/**
 * Authentication and Data API Cloudflare Worker
 * 
 * Implements:
 * - POST /api/signup: Create new user account
 * - POST /api/login: Authenticate and get session token
 * - GET /api/data: Retrieve authenticated user data
 * - POST /api/data: Update authenticated user data
 * - POST /api/logout: Logout and invalidate session token
 */

// Utility for crypto operations
const generateSHA256 = async (message) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Generate a random session token
const generateToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Validate session token
const validateSession = async (env, token) => {
  if (!token) return null;
  
  const sessionQuery = env.DB.prepare(
    'SELECT user_id, expiration FROM sessions WHERE token = ? AND expiration > ?'
  ).bind(token, new Date().toISOString());
  
  const session = await sessionQuery.first();
  if (!session) return null;
  
  const userQuery = env.DB.prepare(
    'SELECT id, email, name FROM users WHERE id = ?'
  ).bind(session.user_id);
  
  return userQuery.first();
};

// Handle signup request
async function handleSignup(request, env) {
  const { email, password, name } = await request.json();
  
  // Validation
  if (!email || !password || !name) {
    return new Response(JSON.stringify({ 
      error: 'Email, password, and name are required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check if user already exists
  const existingUser = await env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();
  
  if (existingUser) {
    return new Response(JSON.stringify({ 
      error: 'User with this email already exists' 
    }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Hash password and create user
  const hashedPassword = await generateSHA256(password);
  
  try {
    await env.DB.prepare(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)'
    ).bind(email, hashedPassword, name).run();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'User created successfully' 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to create user' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle login request
async function handleLogin(request, env) {
  const { email, password } = await request.json();
  
  // Validation
  if (!email || !password) {
    return new Response(JSON.stringify({ 
      error: 'Email and password are required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Hash the provided password for comparison
  const hashedPassword = await generateSHA256(password);
  
  // Query for user
  const user = await env.DB.prepare(
    'SELECT id, email, name FROM users WHERE email = ? AND password = ?'
  ).bind(email, hashedPassword).first();
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Invalid credentials' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Generate session token
  const token = generateToken();
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7); // Token valid for 7 days
  
  // Store session
  await env.DB.prepare(
    'INSERT INTO sessions (token, user_id, expiration) VALUES (?, ?, ?)'
  ).bind(token, user.id, expirationDate.toISOString()).run();
  
  return new Response(JSON.stringify({ 
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle GET data request
async function handleGetData(request, env) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  const user = await validateSession(env, token);
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Get user data
  const userData = await env.DB.prepare(
    'SELECT * FROM user_data WHERE user_id = ?'
  ).bind(user.id).first();
  
  return new Response(JSON.stringify({ 
    success: true,
    user,
    data: userData || {}
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle POST data request
async function handlePostData(request, env) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  const user = await validateSession(env, token);
  
  if (!user) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const data = await request.json();
  
  // Check if user already has data entry
  const existingData = await env.DB.prepare(
    'SELECT id FROM user_data WHERE user_id = ?'
  ).bind(user.id).first();
  
  try {
    if (existingData) {
      // Update existing data
      await env.DB.prepare(
        'UPDATE user_data SET data = ? WHERE user_id = ?'
      ).bind(JSON.stringify(data), user.id).run();
    } else {
      // Create new data entry
      await env.DB.prepare(
        'INSERT INTO user_data (user_id, data) VALUES (?, ?)'
      ).bind(user.id, JSON.stringify(data)).run();
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Data saved successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to save data' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle logout request
async function handleLogout(request, env) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!token) {
    return new Response(JSON.stringify({ 
      error: 'No token provided' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Delete the session from the database
    await env.DB.prepare(
      'DELETE FROM sessions WHERE token = ?'
    ).bind(token).run();
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Logged out successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to logout' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Main request handler
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get the request origin 
    const origin = request.headers.get('Origin') || 'http://localhost:8080';
    
    // Enhanced CORS headers with proper CSP
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,  // Use the request's origin instead of wildcard
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',  // Important for requests with credentials
      // Add Content-Security-Policy header to allow necessary connections
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:8787 http://localhost:8080 *.workers.dev *.cloudflareaccess.com https://reliancehq.com https://*.reliancehq.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; worker-src 'self' *.workers.dev blob:;"
    };
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    try {
      // Route handling
      if (path === '/api/signup' && request.method === 'POST') {
        const response = await handleSignup(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      
      if (path === '/api/login' && request.method === 'POST') {
        const response = await handleLogin(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      
      if (path === '/api/data' && request.method === 'GET') {
        const response = await handleGetData(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      
      if (path === '/api/data' && request.method === 'POST') {
        const response = await handlePostData(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      
      if (path === '/api/logout' && request.method === 'POST') {
        const response = await handleLogout(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      
      // Route not found
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};
