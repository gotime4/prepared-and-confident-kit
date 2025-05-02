var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-iF7kl0/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/auth-worker.js
var generateSHA256 = /* @__PURE__ */ __name(async (message) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}, "generateSHA256");
var generateToken = /* @__PURE__ */ __name(() => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}, "generateToken");
var validateSession = /* @__PURE__ */ __name(async (env, token) => {
  if (!token) return null;
  const sessionQuery = env.DB.prepare(
    "SELECT user_id, expiration FROM sessions WHERE token = ? AND expiration > ?"
  ).bind(token, (/* @__PURE__ */ new Date()).toISOString());
  const session = await sessionQuery.first();
  if (!session) return null;
  const userQuery = env.DB.prepare(
    "SELECT id, email, name FROM users WHERE id = ?"
  ).bind(session.user_id);
  return userQuery.first();
}, "validateSession");
async function handleSignup(request, env) {
  const { email, password, name } = await request.json();
  if (!email || !password || !name) {
    return new Response(JSON.stringify({
      error: "Email, password, and name are required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const existingUser = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  ).bind(email).first();
  if (existingUser) {
    return new Response(JSON.stringify({
      error: "User with this email already exists"
    }), {
      status: 409,
      headers: { "Content-Type": "application/json" }
    });
  }
  const hashedPassword = await generateSHA256(password);
  try {
    await env.DB.prepare(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)"
    ).bind(email, hashedPassword, name).run();
    return new Response(JSON.stringify({
      success: true,
      message: "User created successfully"
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to create user"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleSignup, "handleSignup");
async function handleLogin(request, env) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return new Response(JSON.stringify({
      error: "Email and password are required"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const hashedPassword = await generateSHA256(password);
  const user = await env.DB.prepare(
    "SELECT id, email, name FROM users WHERE email = ? AND password = ?"
  ).bind(email, hashedPassword).first();
  if (!user) {
    return new Response(JSON.stringify({
      error: "Invalid credentials"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const token = generateToken();
  const expirationDate = /* @__PURE__ */ new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  await env.DB.prepare(
    "INSERT INTO sessions (token, user_id, expiration) VALUES (?, ?, ?)"
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
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleLogin, "handleLogin");
async function handleGetData(request, env) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const user = await validateSession(env, token);
  if (!user) {
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const userData = await env.DB.prepare(
    "SELECT * FROM user_data WHERE user_id = ?"
  ).bind(user.id).first();
  return new Response(JSON.stringify({
    success: true,
    user,
    data: userData || {}
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(handleGetData, "handleGetData");
async function handlePostData(request, env) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const user = await validateSession(env, token);
  if (!user) {
    return new Response(JSON.stringify({
      error: "Unauthorized"
    }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const data = await request.json();
  const existingData = await env.DB.prepare(
    "SELECT id FROM user_data WHERE user_id = ?"
  ).bind(user.id).first();
  try {
    if (existingData) {
      await env.DB.prepare(
        "UPDATE user_data SET data = ? WHERE user_id = ?"
      ).bind(JSON.stringify(data), user.id).run();
    } else {
      await env.DB.prepare(
        "INSERT INTO user_data (user_id, data) VALUES (?, ?)"
      ).bind(user.id, JSON.stringify(data)).run();
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Data saved successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to save data"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handlePostData, "handlePostData");
async function handleLogout(request, env) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!token) {
    return new Response(JSON.stringify({
      error: "No token provided"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    await env.DB.prepare(
      "DELETE FROM sessions WHERE token = ?"
    ).bind(token).run();
    return new Response(JSON.stringify({
      success: true,
      message: "Logged out successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to logout"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleLogout, "handleLogout");
var auth_worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get("Origin") || "http://localhost:8080";
    const corsHeaders = {
      "Access-Control-Allow-Origin": origin,
      // Use the request's origin instead of wildcard
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      // Important for requests with credentials
      // Add Content-Security-Policy header to allow necessary connections
      "Content-Security-Policy": "default-src 'self'; connect-src 'self' http://localhost:8787 http://localhost:8080 *.workers.dev *.cloudflareaccess.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; worker-src 'self' *.workers.dev blob:;"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    try {
      if (path === "/api/signup" && request.method === "POST") {
        const response = await handleSignup(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      if (path === "/api/login" && request.method === "POST") {
        const response = await handleLogin(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      if (path === "/api/data" && request.method === "GET") {
        const response = await handleGetData(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      if (path === "/api/data" && request.method === "POST") {
        const response = await handlePostData(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      if (path === "/api/logout" && request.method === "POST") {
        const response = await handleLogout(request, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...response.headers, ...corsHeaders }
        });
      }
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
  }
};

// ../../.nvm/versions/node/v20.17.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../.nvm/versions/node/v20.17.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-iF7kl0/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = auth_worker_default;

// ../../.nvm/versions/node/v20.17.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-iF7kl0/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=auth-worker.js.map
