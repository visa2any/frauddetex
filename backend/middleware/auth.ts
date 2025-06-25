/**
 * 🔐 FraudShield Revolutionary - Authentication Middleware
 * 
 * JWT-based authentication with API key support
 * Features:
 * - JWT token validation
 * - API key authentication
 * - User context injection
 * - Role-based access control
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { create, verify, decode, Payload } from "https://deno.land/x/djwt@v3.0.1/mod.ts";
import { DatabaseService } from "../services/database.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

const JWT_SECRET = env.JWT_SECRET || "your_super_secure_jwt_secret_key_here_minimum_32_chars";
const JWT_ALGORITHM = "HS256";

export interface AuthenticatedUser {
  id: string;
  email: string;
  company_name?: string;
  plan: string;
  usage_count: number;
  usage_limit: number;
  api_key: string;
}

export interface JWTPayload extends Payload {
  user_id: string;
  email: string;
  plan: string;
  iat?: number;
  exp?: number;
}

// Extend Oak's Context to include user
declare module "https://deno.land/x/oak@v12.6.1/mod.ts" {
  interface Context {
    user?: AuthenticatedUser;
  }
}

export class AuthService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  async generateJWT(user: AuthenticatedUser): Promise<string> {
    const payload: JWTPayload = {
      user_id: user.id,
      email: user.email,
      plan: user.plan,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    return await create({ alg: JWT_ALGORITHM, typ: "JWT" }, payload, key);
  }

  async verifyJWT(token: string): Promise<JWTPayload | null> {
    try {
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(JWT_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const payload = await verify(token, key) as JWTPayload;
      return payload;
    } catch (error) {
      console.log("JWT verification failed:", error.message);
      return null;
    }
  }

  async authenticateByApiKey(apiKey: string): Promise<AuthenticatedUser | null> {
    try {
      const user = await this.db.getUserByApiKey(apiKey);
      return user;
    } catch (error) {
      console.log("API key authentication failed:", error.message);
      return null;
    }
  }

  async authenticateByJWT(token: string): Promise<AuthenticatedUser | null> {
    try {
      const payload = await this.verifyJWT(token);
      if (!payload) return null;

      const user = await this.db.getUserByEmail(payload.email);
      return user;
    } catch (error) {
      console.log("JWT authentication failed:", error.message);
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    // Use bcrypt-like approach with Web Crypto API for better security
    const saltRounds = 12;
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive key using PBKDF2 (more secure than simple SHA-256)
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: Math.pow(2, saltRounds), // 4096 iterations for security
        hash: "SHA-256"
      },
      keyMaterial,
      256 // 32 bytes
    );
    
    // Combine salt and hash for storage
    const hashArray = new Uint8Array(salt.length + derivedBits.byteLength);
    hashArray.set(salt);
    hashArray.set(new Uint8Array(derivedBits), salt.length);
    
    // Return base64 encoded result
    return btoa(String.fromCharCode(...hashArray));
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // Decode stored hash
      const hashArray = new Uint8Array(atob(hash).split('').map(c => c.charCodeAt(0)));
      const salt = hashArray.slice(0, 16);
      const storedHash = hashArray.slice(16);
      
      // Derive key with same parameters
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );
      
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 4096,
          hash: "SHA-256"
        },
        keyMaterial,
        256
      );
      
      // Compare hashes in constant time
      const candidateHash = new Uint8Array(derivedBits);
      if (candidateHash.length !== storedHash.length) return false;
      
      let result = 0;
      for (let i = 0; i < candidateHash.length; i++) {
        result |= candidateHash[i] ^ storedHash[i];
      }
      
      return result === 0;
    } catch (error) {
      console.error("Password verification failed:", error);
      return false;
    }
  }

  generateApiKey(): string {
    // Use cryptographically secure random generation
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'fs_';
    
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(randomBytes[i] % chars.length);
    }
    
    // Add checksum for validation
    const checksum = this.calculateChecksum(result);
    return result + checksum;
  }

  generateVerificationToken(): string {
    // Use cryptographically secure random generation for verification tokens
    const randomBytes = crypto.getRandomValues(new Uint8Array(48));
    return btoa(String.fromCharCode(...randomBytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private calculateChecksum(input: string): string {
    // Simple checksum for API key validation
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
      sum += input.charCodeAt(i);
    }
    return (sum % 99).toString().padStart(2, '0');
  }

  validateApiKey(apiKey: string): boolean {
    if (!apiKey.startsWith('fs_') || apiKey.length !== 37) {
      return false;
    }
    
    const keyPart = apiKey.substring(0, 35);
    const checksum = apiKey.substring(35);
    const expectedChecksum = this.calculateChecksum(keyPart);
    
    return checksum === expectedChecksum;
  }

  // Input validation utilities
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/['"]/g, '') // Remove quotes
      .trim()
      .substring(0, 1000); // Limit length
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (password.length > 128) {
      errors.push("Password must be less than 128 characters");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Global auth service instance
let authService: AuthService;

export function initializeAuthService(db: DatabaseService) {
  authService = new AuthService(db);
}

export async function authMiddleware(ctx: Context, next: Next) {
  // Skip auth for health checks and public endpoints
  const publicEndpoints = ['/health', '/api/v1/health', '/api/v1/auth'];
  if (publicEndpoints.some(endpoint => ctx.request.url.pathname.startsWith(endpoint))) {
    await next();
    return;
  }

  let user: AuthenticatedUser | null = null;

  // Try API key authentication first (preferred for API access)
  const apiKey = ctx.request.headers.get("X-API-Key") || 
                  ctx.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (apiKey && apiKey.startsWith("fs_")) {
    // Validate API key format first
    if (authService.validateApiKey(apiKey)) {
      user = await authService.authenticateByApiKey(apiKey);
    }
  }

  // Try JWT authentication (for web app)
  if (!user) {
    const authHeader = ctx.request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      if (!token.startsWith("fs_")) { // Not an API key
        user = await authService.authenticateByJWT(token);
      }
    }
  }

  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = {
      error: "Authentication required",
      message: "Please provide a valid API key or JWT token",
      documentation: "https://docs.fraudshield.revolutionary/authentication"
    };
    return;
  }

  // Check if user is active
  if (!user.is_active) {
    ctx.response.status = 403;
    ctx.response.body = {
      error: "Account suspended",
      message: "Your account has been suspended. Please contact support.",
    };
    return;
  }

  // Check usage limits (except for unlimited plans)
  if (user.plan !== 'enterprise' && user.usage_count >= user.usage_limit) {
    ctx.response.status = 429;
    ctx.response.body = {
      error: "Usage limit exceeded",
      message: `You have exceeded your monthly limit of ${user.usage_limit} requests.`,
      current_usage: user.usage_count,
      limit: user.usage_limit,
      plan: user.plan,
      upgrade_url: "https://fraudshield.revolutionary/pricing"
    };
    return;
  }

  // Inject user into context
  ctx.user = user;

  await next();
}

// Role-based access control middleware
export function requirePlan(...allowedPlans: string[]) {
  return async (ctx: Context, next: Next) => {
    if (!ctx.user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (!allowedPlans.includes(ctx.user.plan)) {
      ctx.response.status = 403;
      ctx.response.body = {
        error: "Insufficient permissions",
        message: `This feature requires ${allowedPlans.join(' or ')} plan`,
        current_plan: ctx.user.plan,
        upgrade_url: "https://fraudshield.revolutionary/pricing"
      };
      return;
    }

    await next();
  };
}

// Usage tracking middleware
export async function trackUsage(ctx: Context, next: Next) {
  if (ctx.user) {
    // Increment usage count for API calls
    if (ctx.request.url.pathname.startsWith('/api/v1/fraud/detect')) {
      try {
        await authService.db.updateUserUsage(ctx.user.id, 1);
        ctx.user.usage_count += 1; // Update local context
      } catch (error) {
        console.error("Failed to update usage:", error);
      }
    }
  }

  await next();
}

export { authService };