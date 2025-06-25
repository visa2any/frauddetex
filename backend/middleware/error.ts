/**
 * ⚠️ FraudShield Revolutionary - Error Handling Middleware
 * 
 * Comprehensive error handling with security considerations
 * Features:
 * - Structured error responses
 * - Error classification
 * - Security-aware error messages
 * - Error metrics tracking
 * - Stack trace sanitization
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  request_id?: string;
  timestamp: string;
  documentation?: string;
  details?: any;
}

export class FraudShieldError extends Error {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.name = 'FraudShieldError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace?.(this, FraudShieldError);
  }
}

// Predefined error types
export class ValidationError extends FraudShieldError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, true, details);
  }
}

export class AuthenticationError extends FraudShieldError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401, true);
  }
}

export class AuthorizationError extends FraudShieldError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403, true);
  }
}

export class NotFoundError extends FraudShieldError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404, true);
  }
}

export class RateLimitError extends FraudShieldError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, true, details);
  }
}

export class MLServiceError extends FraudShieldError {
  constructor(message: string, details?: any) {
    super(message, 'ML_SERVICE_ERROR', 503, true, details);
  }
}

export class DatabaseError extends FraudShieldError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 503, false);
  }
}

export async function errorMiddleware(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    await handleError(ctx, error);
  }
}

async function handleError(ctx: Context, error: any) {
  const requestId = ctx.state.requestId || 'unknown';
  const timestamp = new Date().toISOString();

  // Log the error
  console.error(`Error [${requestId}]:`, error);

  // Determine if this is an operational error
  const isOperational = error instanceof FraudShieldError && error.isOperational;

  // Build error response
  const errorResponse: ErrorResponse = {
    error: getErrorType(error),
    message: getErrorMessage(error, isOperational),
    code: error.code || 'INTERNAL_ERROR',
    request_id: requestId,
    timestamp,
    documentation: getDocumentationUrl(error)
  };

  // Add details for operational errors in development
  if (isOperational && env.NODE_ENV === 'development' && error.details) {
    errorResponse.details = error.details;
  }

  // Set status code
  ctx.response.status = getStatusCode(error);

  // Set security headers
  ctx.response.headers.set('X-Content-Type-Options', 'nosniff');
  ctx.response.headers.set('X-Frame-Options', 'DENY');

  // Add rate limit headers if applicable
  if (error instanceof RateLimitError && error.details) {
    ctx.response.headers.set('Retry-After', error.details.retryAfter?.toString() || '60');
    ctx.response.headers.set('X-RateLimit-Limit', error.details.limit?.toString() || '');
    ctx.response.headers.set('X-RateLimit-Remaining', '0');
  }

  ctx.response.body = errorResponse;

  // Track error metrics
  await trackErrorMetrics(error, ctx);

  // Send security alerts for suspicious errors
  await checkSecurityImplications(error, ctx);
}

function getErrorType(error: any): string {
  if (error instanceof FraudShieldError) {
    return error.constructor.name.replace('Error', '').toLowerCase();
  }

  // Map common error types
  if (error.name === 'ValidationError') return 'validation';
  if (error.name === 'SyntaxError') return 'syntax';
  if (error.name === 'TypeError') return 'type';
  if (error.message?.includes('ECONNREFUSED')) return 'connection';
  if (error.message?.includes('timeout')) return 'timeout';

  return 'internal';
}

function getErrorMessage(error: any, isOperational: boolean): string {
  // For operational errors, return the actual message
  if (isOperational && error.message) {
    return error.message;
  }

  // For non-operational errors, return generic messages in production
  if (env.NODE_ENV === 'production') {
    const genericMessages: Record<number, string> = {
      400: 'Bad request. Please check your request parameters.',
      401: 'Authentication required. Please provide valid credentials.',
      403: 'Access denied. You don\'t have permission to access this resource.',
      404: 'The requested resource was not found.',
      429: 'Too many requests. Please slow down and try again later.',
      500: 'Internal server error. Our team has been notified.',
      503: 'Service temporarily unavailable. Please try again later.'
    };

    const statusCode = getStatusCode(error);
    return genericMessages[statusCode] || genericMessages[500];
  }

  // In development, return the actual error message
  return error.message || 'An unexpected error occurred';
}

function getStatusCode(error: any): number {
  if (error instanceof FraudShieldError) {
    return error.statusCode;
  }

  // Map common error patterns to status codes
  if (error.name === 'ValidationError') return 400;
  if (error.message?.includes('duplicate key')) return 409;
  if (error.message?.includes('not found')) return 404;
  if (error.message?.includes('unauthorized')) return 401;
  if (error.message?.includes('forbidden')) return 403;
  if (error.message?.includes('timeout')) return 504;
  if (error.message?.includes('ECONNREFUSED')) return 503;

  return 500;
}

function getDocumentationUrl(error: any): string {
  const baseUrl = 'https://docs.fraudshield.revolutionary';
  
  if (error instanceof ValidationError) {
    return `${baseUrl}/api-reference#validation-errors`;
  }
  if (error instanceof AuthenticationError) {
    return `${baseUrl}/authentication`;
  }
  if (error instanceof AuthorizationError) {
    return `${baseUrl}/authorization`;
  }
  if (error instanceof RateLimitError) {
    return `${baseUrl}/rate-limits`;
  }
  if (error instanceof MLServiceError) {
    return `${baseUrl}/machine-learning#troubleshooting`;
  }

  return `${baseUrl}/troubleshooting`;
}

async function trackErrorMetrics(error: any, ctx: Context) {
  try {
    // In a real implementation, you'd send metrics to your monitoring service
    const errorType = getErrorType(error);
    const statusCode = getStatusCode(error);
    
    // Example metrics that could be tracked:
    console.log(`Metric: error.${errorType}.count += 1`);
    console.log(`Metric: error.status.${statusCode}.count += 1`);
    
    if (ctx.user) {
      console.log(`Metric: error.user.${ctx.user.id}.count += 1`);
    }

    // Track critical errors separately
    if (statusCode >= 500) {
      console.log(`Metric: error.critical.count += 1`);
    }

  } catch (metricError) {
    console.error('Failed to track error metrics:', metricError);
  }
}

async function checkSecurityImplications(error: any, ctx: Context) {
  const securityFlags: string[] = [];

  // Multiple authentication failures
  if (error instanceof AuthenticationError) {
    securityFlags.push('authentication_failure');
  }

  // Authorization attempts
  if (error instanceof AuthorizationError) {
    securityFlags.push('authorization_failure');
  }

  // Validation errors might indicate injection attempts
  if (error instanceof ValidationError) {
    const message = error.message.toLowerCase();
    if (message.includes('sql') || message.includes('script') || message.includes('union')) {
      securityFlags.push('injection_attempt');
    }
  }

  // Rate limiting violations
  if (error instanceof RateLimitError) {
    securityFlags.push('rate_limit_violation');
  }

  // Unusual error patterns
  if (error.stack?.includes('eval') || error.stack?.includes('Function')) {
    securityFlags.push('code_injection_attempt');
  }

  // If we have security implications, log them
  if (securityFlags.length > 0) {
    const clientIP = getClientIP(ctx);
    const userAgent = ctx.request.headers.get('User-Agent');
    
    console.warn(`Security Event: ${securityFlags.join(', ')} from ${clientIP}`, {
      error: error.message,
      user_agent: userAgent,
      url: ctx.request.url.pathname,
      user_id: ctx.user?.id
    });

    // In production, you might want to:
    // 1. Add IP to temporary blacklist
    // 2. Send alert to security team
    // 3. Increase monitoring for this IP
    // 4. Log detailed forensic information
  }
}

function getClientIP(ctx: Context): string {
  const forwardedFor = ctx.request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = ctx.request.headers.get("X-Real-IP");
  if (realIP) {
    return realIP;
  }

  return ctx.request.ip || "unknown";
}

// Helper function to validate request data
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missing_fields: missing }
    );
  }
}

// Helper function to validate data types
export function validateTypes(data: any, schema: Record<string, string>): void {
  const errors: string[] = [];

  for (const [field, expectedType] of Object.entries(schema)) {
    const value = data[field];
    if (value !== undefined && value !== null) {
      const actualType = typeof value;
      if (actualType !== expectedType) {
        errors.push(`Field '${field}' must be of type ${expectedType}, got ${actualType}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(
      'Type validation failed',
      { validation_errors: errors }
    );
  }
}

// Helper function to validate number ranges
export function validateRange(value: number, min: number, max: number, fieldName: string): void {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      { field: fieldName, value, min, max }
    );
  }
}