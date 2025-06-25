/**
 * 🔒 FraudShield Revolutionary - Security Configuration
 * 
 * Centralized security configuration and hardening
 */

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

export interface SecurityConfig {
  jwt: {
    secret: string;
    algorithm: string;
    expirationTime: number;
    refreshExpirationTime: number;
  };
  password: {
    saltRounds: number;
    minLength: number;
    maxLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireMixedCase: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
    skipFailedRequests: boolean;
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
  };
  session: {
    secure: boolean;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none";
    maxAge: number;
  };
}

// Generate secure JWT secret if not provided
function generateSecureSecret(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(64));
  return btoa(String.fromCharCode(...randomBytes));
}

export const securityConfig: SecurityConfig = {
  jwt: {
    secret: env.JWT_SECRET || generateSecureSecret(),
    algorithm: "HS256",
    expirationTime: 24 * 60 * 60, // 24 hours
    refreshExpirationTime: 7 * 24 * 60 * 60, // 7 days
  },
  password: {
    saltRounds: 12,
    minLength: 8,
    maxLength: 128,
    requireSpecialChars: true,
    requireNumbers: true,
    requireMixedCase: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // Limit each IP to 100 requests per windowMs
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://fraudshield.revolutionary',
      'https://api.fraudshield.dev'
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Request-ID',
      'X-User-Agent'
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset'
    ],
    credentials: true,
  },
  session: {
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Security headers middleware
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.fraudshield.dev wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

// Validate environment security
export function validateSecurityEnvironment(): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (!env.JWT_SECRET) {
    warnings.push("JWT_SECRET not set - using generated secret (will reset on restart)");
  }
  
  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    warnings.push("JWT_SECRET is too short - should be at least 32 characters");
  }
  
  if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'development') {
    warnings.push("NODE_ENV not properly set");
  }
  
  if (!env.DATABASE_URL) {
    warnings.push("DATABASE_URL not set");
  }
  
  if (!env.REDIS_URL) {
    warnings.push("REDIS_URL not set");
  }
  
  return {
    valid: warnings.length === 0,
    warnings
  };
}

// Audit logging configuration
export interface AuditLogEntry {
  timestamp: string;
  userId?: string;
  ip: string;
  userAgent: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'blocked';
  details?: Record<string, any>;
  riskScore?: number;
}

export class AuditLogger {
  private logs: AuditLogEntry[] = [];
  
  log(entry: Omit<AuditLogEntry, 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
    };
    
    this.logs.push(auditEntry);
    
    // Log to console in development
    if (env.NODE_ENV === 'development') {
      console.log('🔍 AUDIT:', JSON.stringify(auditEntry, null, 2));
    }
    
    // In production, send to logging service
    if (env.NODE_ENV === 'production') {
      this.sendToLogService(auditEntry);
    }
    
    // Keep only last 1000 entries in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }
  
  private async sendToLogService(entry: AuditLogEntry): Promise<void> {
    // Implementation for external logging service
    // Could be Sentry, DataDog, or custom logging endpoint
    try {
      // Example: Send to custom logging endpoint
      await fetch(`${env.AUDIT_LOG_ENDPOINT || '/api/audit'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send audit log:', error);
    }
  }
  
  getRecentLogs(limit = 100): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }
  
  getLogsByUser(userId: string, limit = 50): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .slice(-limit);
  }
}

export const auditLogger = new AuditLogger();

// Input sanitization utilities
export class InputSanitizer {
  static sanitizeString(input: string, maxLength = 1000): string {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/['"]/g, '') // Remove quotes
      .replace(/\0/g, '') // Remove null bytes
      .trim()
      .substring(0, maxLength);
  }
  
  static sanitizeEmail(email: string): string {
    return email
      .toLowerCase()
      .trim()
      .substring(0, 254); // RFC 5321 limit
  }
  
  static sanitizeNumeric(input: string): number | null {
    const num = parseFloat(input);
    return isNaN(num) ? null : num;
  }
  
  static sanitizeAlphanumeric(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '');
  }
  
  static sanitizeSQL(input: string): string {
    // Basic SQL injection prevention
    return input
      .replace(/['";\\]/g, '') // Remove SQL metacharacters
      .replace(/(\b(ALTER|CREATE|DELETE|DROP|EXEC|INSERT|SELECT|UNION|UPDATE)\b)/gi, '') // Remove SQL keywords
      .trim();
  }
}