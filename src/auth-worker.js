/**
 * Authentication and Data API Cloudflare Worker
 * 
 * Implements:
 * - POST /api/signup: Create new user account
 * - POST /api/login: Authenticate and get session token
 * - GET /api/data: Retrieve authenticated user data
 * - POST /api/data: Update authenticated user data
 * - POST /api/logout: Logout and invalidate session token
 * - POST /api/delete-account: Delete user account
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
  try {
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
    
    try {
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
    } catch (dbError) {
      // Catch and report specific database errors
      console.error('Database error when checking existing user:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Database error when checking user',
        details: dbError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Hash password and create user
    const hashedPassword = await generateSHA256(password);
    let userId;
    try {
      const result = await env.DB.prepare(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id'
      ).bind(email, hashedPassword, name).first();
      userId = result && result.id;
      // --- BEGIN: Insert default user_data for new user ---
      if (userId) {
        // Default kit items (structure based on KitPage.tsx)
        const defaultKit = [
          { id: "water-bottle", name: "Water bottle (1 liter)", recommendedAmount: 3, currentAmount: 0, unit: "quantity", category: "Water", type: "kit" },
          { id: "water-filter", name: "Portable water filter", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Water", type: "kit" },
          { id: "water-purification", name: "Water purification tablets", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Water", type: "kit" },
          { id: "energy-bars", name: "Energy/Protein bars", recommendedAmount: 6, currentAmount: 0, unit: "quantity", category: "Food", type: "kit" },
          { id: "dried-fruits", name: "Dried fruits and nuts", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Food", type: "kit" },
          { id: "canned-food", name: "Ready-to-eat canned foods", recommendedAmount: 3, currentAmount: 0, unit: "quantity", category: "Food", type: "kit" },
          { id: "utensils", name: "Eating utensils", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Food", type: "kit" },
          { id: "first-aid-kit", name: "Basic First Aid Kit", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "First Aid & Medication", type: "kit" },
          { id: "prescription-meds", name: "Prescription medications", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "First Aid & Medication", type: "kit" },
          { id: "otc-meds", name: "OTC medications", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "First Aid & Medication", type: "kit" },
          { id: "hand-sanitizer", name: "Hand sanitizer", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "First Aid & Medication", type: "kit" },
          { id: "change-clothes", name: "Change of clothes", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Clothing & Warmth", type: "kit" },
          { id: "jacket", name: "Rain jacket/poncho", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Clothing & Warmth", type: "kit" },
          { id: "emergency-blanket", name: "Emergency blanket", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Clothing & Warmth", type: "kit" },
          { id: "sturdy-shoes", name: "Sturdy walking shoes", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Clothing & Warmth", type: "kit" },
          { id: "flashlight", name: "Flashlight or headlamp", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "multi-tool", name: "Multi-tool or pocket knife", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "whistle", name: "Emergency whistle", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "dust-mask", name: "Dust mask", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "duct-tape", name: "Duct tape", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "paper-pencil", name: "Notepad and pencil", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" },
          { id: "local-map", name: "Local map", recommendedAmount: 1, currentAmount: 0, unit: "quantity", category: "Tools & Supplies", type: "kit" }
        ];
        // You can add a similar array for food storage if you have it, or leave as [] for now
        const defaultStorage = [];
        await env.DB.prepare(
          'INSERT INTO user_data (user_id, data) VALUES (?, ?)' 
        ).bind(userId, JSON.stringify({ kit: defaultKit, storage: defaultStorage })).run();
      }
      // --- END: Insert default user_data for new user ---
      return new Response(JSON.stringify({ 
        success: true,
        message: 'User created successfully' 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (insertError) {
      // Catch and report specific insert errors
      console.error('Failed to create user:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Failed to create user',
        details: insertError.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    // Catch any overall errors, including JSON parsing
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process signup',
      details: error.message
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
  
  let responseData;
  
  try {
    // Try to parse the data as JSON
    if (userData && userData.data) {
      responseData = userData.data.startsWith('{') ? JSON.parse(userData.data) : {};
    } else {
      responseData = {};
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    responseData = {};
  }
  
  return new Response(JSON.stringify({ 
    success: true,
    userId: user.id, // Include userId for client auth verification
    email: user.email,
    name: user.name,
    ...responseData // Spread parsed user data into response
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

// Handle account deletion request
async function handleDeleteAccount(request, env) {
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

  try {
    // Delete all sessions for the user
    await env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id).run();
    // Delete user data
    await env.DB.prepare('DELETE FROM user_data WHERE user_id = ?').bind(user.id).run();
    // Delete user record
    await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run();
    return new Response(JSON.stringify({
      success: true,
      message: 'Account deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to delete account'
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
    
    // List of allowed origins - add your production domain here
    const allowedOrigins = [
      'http://localhost:8080',
      'http://localhost:5173', 
      'http://localhost:3000',
      'https://reliancehq.com',
      'https://www.reliancehq.com',
      'https://prepared-and-confident-kit.pages.dev'
    ];
    
    // Check if the request origin is allowed
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    // Enhanced CORS headers with proper CSP - use actual origin if it's allowed, otherwise use a default
    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:8787 http://localhost:8080 http://localhost:5173 http://localhost:3000 *.workers.dev *.cloudflareaccess.com https://reliancehq.com https://*.reliancehq.com https://prepared-and-confident-kit.pages.dev; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; worker-src 'self' *.workers.dev blob:;"
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
      
      if (path === '/api/delete-account' && request.method === 'POST') {
        const response = await handleDeleteAccount(request, env);
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
