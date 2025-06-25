/**
 * 🔐 FraudShield Revolutionary - Authentication Routes
 * 
 * User authentication and registration endpoints
 * Features:
 * - User registration with email verification
 * - Login with JWT tokens
 * - API key management
 * - Password reset
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { AuthService, AuthenticatedUser } from "../middleware/auth.ts";
import { InputSanitizer } from "../config/security.ts";

export const authRoutes = new Router();

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Validation helpers
function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      throw new ValidationError(`Field '${field}' is required`);
    }
  }
}

function validateTypes(data: any, types: Record<string, string>): void {
  for (const [field, expectedType] of Object.entries(types)) {
    if (data[field] !== undefined && typeof data[field] !== expectedType) {
      throw new ValidationError(`Field '${field}' must be of type ${expectedType}`);
    }
  }
}

/**
 * POST /api/v1/auth/register
 * Register a new user account
 */
authRoutes.post("/register", async (ctx: Context) => {
  try {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    // Validate required fields
    validateRequired(requestBody, ['email', 'password', 'company_name']);
    validateTypes(requestBody, {
      email: 'string',
      password: 'string',
      company_name: 'string',
      plan: 'string'
    });

    // Sanitize inputs
    const email = InputSanitizer.sanitizeEmail(requestBody.email);
    const companyName = InputSanitizer.sanitizeString(requestBody.company_name);
    const plan = requestBody.plan || 'community';

    // Validate email format
    if (!AuthService.validateEmail(email)) {
      throw new ValidationError("Invalid email format");
    }

    // Validate password strength
    const passwordValidation = AuthService.validatePassword(requestBody.password);
    if (!passwordValidation.valid) {
      throw new ValidationError(passwordValidation.errors.join(', '));
    }

    // Validate plan
    const validPlans = ['community', 'smart', 'enterprise', 'insurance'];
    if (!validPlans.includes(plan)) {
      throw new ValidationError(`Plan must be one of: ${validPlans.join(', ')}`);
    }

    // Set usage limits based on plan
    const usageLimits = {
      community: 10000,
      smart: 100000,
      enterprise: 1000000,
      insurance: 500000
    };

    // Generate mock user data (in real implementation, this would use database)
    const mockUser: AuthenticatedUser = {
      id: crypto.randomUUID(),
      email: email,
      company_name: companyName,
      plan: plan as any,
      usage_count: 0,
      usage_limit: usageLimits[plan as keyof typeof usageLimits],
      api_key: generateApiKey(),
    };

    // Mock JWT generation (in real implementation, this would use AuthService)
    const mockToken = "mock_jwt_token_" + Date.now();

    console.log(`New user registered: ${email} (${plan} plan)`);

    ctx.response.status = 201;
    ctx.response.body = {
      message: "Account created successfully",
      user: {
        id: mockUser.id,
        email: mockUser.email,
        company_name: mockUser.company_name,
        plan: mockUser.plan,
        usage_limit: mockUser.usage_limit,
        api_key: mockUser.api_key,
        email_verified: false
      },
      token: mockToken,
      expires_in: "24h",
      requires_verification: true
    };

  } catch (error) {
    ctx.response.status = error instanceof ValidationError ? 400 : 500;
    ctx.response.body = {
      error: error.name || "InternalError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 */
authRoutes.post("/login", async (ctx: Context) => {
  try {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    validateRequired(requestBody, ['email', 'password']);
    validateTypes(requestBody, {
      email: 'string',
      password: 'string'
    });

    const email = InputSanitizer.sanitizeEmail(requestBody.email);

    // Mock authentication (in real implementation, this would use AuthService and Database)
    if (email === "demo@fraudshield.dev" && requestBody.password === "demo123") {
      const mockUser: AuthenticatedUser = {
        id: "demo-user-id",
        email: email,
        company_name: "Demo Company",
        plan: "smart",
        usage_count: 150,
        usage_limit: 100000,
        api_key: "fs_demo_api_key_" + Date.now(),
      };

      const mockToken = "mock_jwt_token_" + Date.now();

      console.log(`User logged in: ${email}`);

      ctx.response.body = {
        message: "Login successful",
        user: {
          id: mockUser.id,
          email: mockUser.email,
          company_name: mockUser.company_name,
          plan: mockUser.plan,
          usage_count: mockUser.usage_count,
          usage_limit: mockUser.usage_limit,
          api_key: mockUser.api_key
        },
        token: mockToken,
        expires_in: "24h"
      };
    } else {
      throw new AuthenticationError("Invalid email or password");
    }

  } catch (error) {
    ctx.response.status = error instanceof AuthenticationError ? 401 : 400;
    ctx.response.body = {
      error: error.name || "InternalError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh JWT token
 */
authRoutes.post("/refresh", async (ctx: Context) => {
  try {
    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Refresh token required");
    }

    const token = authHeader.substring(7);
    
    // Mock token refresh (in real implementation, this would verify and refresh JWT)
    if (token.startsWith("mock_jwt_token_")) {
      const newToken = "mock_jwt_token_" + Date.now();
      
      ctx.response.body = {
        token: newToken,
        expires_in: "24h",
        user: {
          id: "demo-user-id",
          email: "demo@fraudshield.dev",
          plan: "smart",
          usage_count: 150,
          usage_limit: 100000
        }
      };
    } else {
      throw new AuthenticationError("Invalid token");
    }

  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = {
      error: "AuthenticationError",
      message: "Token refresh failed"
    };
  }
});

/**
 * POST /api/v1/auth/forgot-password
 * Request password reset
 */
authRoutes.post("/forgot-password", async (ctx: Context) => {
  try {
    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    validateRequired(requestBody, ['email']);
    validateTypes(requestBody, { email: 'string' });

    const email = InputSanitizer.sanitizeEmail(requestBody.email);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`Password reset requested for: ${email}`);

    // Always return success to prevent email enumeration
    ctx.response.body = {
      message: "If an account with that email exists, password reset instructions have been sent."
    };

  } catch (error) {
    // Always return success to prevent email enumeration
    ctx.response.body = {
      message: "If an account with that email exists, password reset instructions have been sent."
    };
  }
});

/**
 * GET /api/v1/auth/validate
 * Validate API key or JWT token
 */
authRoutes.get("/validate", async (ctx: Context) => {
  const apiKey = ctx.request.headers.get("X-API-Key");
  const authHeader = ctx.request.headers.get("Authorization");

  if (apiKey && apiKey.startsWith("fs_")) {
    // Mock API key validation
    ctx.response.body = {
      valid: true,
      type: "api_key",
      user: {
        id: "demo-user-id",
        email: "demo@fraudshield.dev",
        plan: "smart",
        usage_count: 150,
        usage_limit: 100000
      }
    };
    return;
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    
    // Mock JWT validation
    if (token.startsWith("mock_jwt_token_")) {
      ctx.response.body = {
        valid: true,
        type: "jwt",
        user: {
          id: "demo-user-id",
          email: "demo@fraudshield.dev",
          plan: "smart",
          usage_count: 150,
          usage_limit: 100000
        }
      };
      return;
    }
  }

  ctx.response.status = 401;
  ctx.response.body = {
    valid: false,
    message: "Invalid or missing authentication credentials"
  };
});

/**
 * POST /api/v1/auth/regenerate-api-key
 * Generate new API key (requires authentication)
 */
authRoutes.post("/regenerate-api-key", async (ctx: Context) => {
  const newApiKey = generateApiKey();

  ctx.response.body = {
    message: "New API key generated successfully",
    api_key: newApiKey,
    warning: "Save this key securely. It won't be shown again."
  };
});

/**
 * GET /api/v1/auth/me
 * Get current user profile (requires authentication)
 */
authRoutes.get("/me", async (ctx: Context) => {
  // Mock user profile
  ctx.response.body = {
    user: {
      id: "demo-user-id",
      email: "demo@fraudshield.dev",
      company_name: "Demo Company",
      plan: "smart",
      usage_count: 150,
      usage_limit: 100000,
      email_verified: true,
      created_at: new Date("2024-01-01").toISOString(),
      last_login: new Date().toISOString()
    }
  };
});

// Helper function to generate API key
function generateApiKey(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'fs_';
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }
  
  return result;
}