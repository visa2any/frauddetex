/**
 * 🛡️ FraudShield Revolutionary - Security Middleware
 * 
 * Additional security layers for production hardening
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { securityHeaders, auditLogger, InputSanitizer, securityConfig } from "../config/security.ts";

// Security middleware for all requests
export async function securityMiddleware(ctx: Context, next: Next) {
  const startTime = Date.now();
  
  // Add security headers
  for (const [header, value] of Object.entries(securityHeaders)) {
    ctx.response.headers.set(header, value);
  }
  
  // Request ID for tracing
  const requestId = ctx.request.headers.get('X-Request-ID') || crypto.randomUUID();
  ctx.response.headers.set('X-Request-ID', requestId);
  
  // Get client information
  const clientIP = getClientIP(ctx);
  const userAgent = ctx.request.headers.get('User-Agent') || 'unknown';
  
  // Basic request validation
  if (!validateRequest(ctx)) {
    auditLogger.log({
      userId: (ctx as any).user?.id,
      ip: clientIP,
      userAgent,
      action: 'request_validation_failed',
      resource: ctx.request.url.pathname,
      result: 'blocked',
      details: {
        method: ctx.request.method,
        headers: Object.fromEntries(ctx.request.headers.entries())
      }
    });
    
    ctx.response.status = 400;
    ctx.response.body = { error: 'Invalid request format' };
    return;
  }
  
  // Check for suspicious patterns
  const suspiciousScore = calculateSuspiciousScore(ctx, clientIP, userAgent);
  if (suspiciousScore > 80) {
    auditLogger.log({
      userId: (ctx as any).user?.id,
      ip: clientIP,
      userAgent,
      action: 'suspicious_request_blocked',
      resource: ctx.request.url.pathname,
      result: 'blocked',
      riskScore: suspiciousScore,
      details: {
        method: ctx.request.method,
        suspiciousScore
      }
    });
    
    ctx.response.status = 429;
    ctx.response.body = { 
      error: 'Request blocked due to suspicious activity',
      requestId 
    };
    return;
  }
  
  try {
    await next();
    
    // Log successful requests
    const duration = Date.now() - startTime;
    if (ctx.request.url.pathname.startsWith('/api/')) {
      auditLogger.log({
        userId: (ctx as any).user?.id,
        ip: clientIP,
        userAgent,
        action: 'api_request',
        resource: ctx.request.url.pathname,
        result: ctx.response.status < 400 ? 'success' : 'failure',
        details: {
          method: ctx.request.method,
          status: ctx.response.status,
          duration
        }
      });
    }
    
  } catch (error) {
    // Log errors
    auditLogger.log({
      userId: (ctx as any).user?.id,
      ip: clientIP,
      userAgent,
      action: 'request_error',
      resource: ctx.request.url.pathname,
      result: 'failure',
      details: {
        error: error.message,
        stack: error.stack
      }
    });
    
    // Don't expose internal errors in production
    if (Deno.env.get('NODE_ENV') === 'production') {
      ctx.response.status = 500;
      ctx.response.body = { 
        error: 'Internal server error',
        requestId 
      };
    } else {
      throw error;
    }
  }
}

// Input sanitization middleware
export async function inputSanitationMiddleware(ctx: Context, next: Next) {
  if (ctx.request.hasBody) {
    try {
      const body = await ctx.request.body();
      
      if (body.type === "json") {
        const jsonValue = await body.value;
        const sanitizedBody = sanitizeObject(jsonValue);
        
        // Replace the body with sanitized version
        (ctx.request as any).sanitizedBody = sanitizedBody;
      }
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { error: 'Invalid JSON format' };
      return;
    }
  }
  
  await next();
}

// WAF (Web Application Firewall) middleware
export async function wafMiddleware(ctx: Context, next: Next) {
  const clientIP = getClientIP(ctx);
  const userAgent = ctx.request.headers.get('User-Agent') || '';
  const url = ctx.request.url.pathname;
  
  // Check for common attack patterns
  const attackPatterns = [
    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b.*\b(FROM|WHERE|INTO)\b)/i,
    // XSS patterns
    /<script[\s\S]*?>[\s\S]*?<\/script>/i,
    // Path traversal
    /\.\.\//,
    // Command injection
    /[;&|`]/,
    // XXE patterns
    /<!ENTITY/i,
  ];
  
  const requestContent = url + userAgent;
  const isAttack = attackPatterns.some(pattern => pattern.test(requestContent));
  
  if (isAttack) {
    auditLogger.log({
      ip: clientIP,
      userAgent,
      action: 'waf_block',
      resource: url,
      result: 'blocked',
      details: {
        attackType: 'pattern_match',
        userAgent,
        url
      }
    });
    
    ctx.response.status = 403;
    ctx.response.body = { error: 'Request blocked by WAF' };
    return;
  }
  
  // Check for bot patterns
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /scan/i
  ];
  
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  if (isBot && !url.startsWith('/api/v1/health')) {
    // Allow bots for health checks but rate limit others
    const rateLimitKey = `bot_limit:${clientIP}`;
    // Implementation would check Redis for bot rate limiting
    
    auditLogger.log({
      ip: clientIP,
      userAgent,
      action: 'bot_detected',
      resource: url,
      result: 'success',
      details: { userAgent }
    });
  }
  
  await next();
}

// CSRF protection middleware
export async function csrfMiddleware(ctx: Context, next: Next) {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(ctx.request.method)) {
    await next();
    return;
  }
  
  // Skip CSRF for API requests with valid API key
  const apiKey = ctx.request.headers.get("X-API-Key");
  if (apiKey && apiKey.startsWith("fs_")) {
    await next();
    return;
  }
  
  // Check CSRF token for web requests
  const csrfToken = ctx.request.headers.get('X-CSRF-Token') || 
                    ctx.request.headers.get('X-Requested-With');
  
  if (!csrfToken || csrfToken !== 'XMLHttpRequest') {
    auditLogger.log({
      ip: getClientIP(ctx),
      userAgent: ctx.request.headers.get('User-Agent') || '',
      action: 'csrf_validation_failed',
      resource: ctx.request.url.pathname,
      result: 'blocked'
    });
    
    ctx.response.status = 403;
    ctx.response.body = { error: 'CSRF token validation failed' };
    return;
  }
  
  await next();
}

// Utility functions
function getClientIP(ctx: Context): string {
  const forwardedFor = ctx.request.headers.get("X-Forwarded-For");
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = ctx.request.headers.get("X-Real-IP");
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = ctx.request.headers.get("CF-Connecting-IP");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return ctx.request.ip || "unknown";
}

function validateRequest(ctx: Context): boolean {
  // Basic request validation
  const method = ctx.request.method;
  const url = ctx.request.url;
  
  // Check method
  if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(method)) {
    return false;
  }
  
  // Check URL length
  if (url.pathname.length > 2000) {
    return false;
  }
  
  // Check for null bytes
  if (url.pathname.includes('\0')) {
    return false;
  }
  
  return true;
}

function calculateSuspiciousScore(ctx: Context, ip: string, userAgent: string): number {
  let score = 0;
  
  // Check user agent
  if (!userAgent || userAgent === 'unknown') {
    score += 30;
  }
  
  // Check for automation tools
  if (/curl|wget|python|bot|scanner/i.test(userAgent)) {
    score += 20;
  }
  
  // Check for suspicious IPs (simplified - in production use threat intel)
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip === '127.0.0.1') {
    // Local IPs are less suspicious for development
    score += 0;
  } else if (ip.includes('tor') || ip.includes('proxy')) {
    score += 40;
  }
  
  // Check request patterns
  const path = ctx.request.url.pathname;
  if (path.includes('admin') || path.includes('config') || path.includes('backup')) {
    score += 25;
  }
  
  // Check for rapid requests (simplified - in production use Redis)
  // This would track request frequency per IP
  
  return Math.min(score, 100); // Cap at 100
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return InputSanitizer.sanitizeString(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = InputSanitizer.sanitizeString(key, 100);
      sanitized[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

// Geo-blocking middleware (basic implementation)
export async function geoBlockingMiddleware(ctx: Context, next: Next) {
  const country = ctx.request.headers.get('CF-IPCountry');
  
  // Example: Block requests from certain countries
  const blockedCountries = ['XX', 'YY']; // Replace with actual country codes
  
  if (country && blockedCountries.includes(country)) {
    auditLogger.log({
      ip: getClientIP(ctx),
      userAgent: ctx.request.headers.get('User-Agent') || '',
      action: 'geo_block',
      resource: ctx.request.url.pathname,
      result: 'blocked',
      details: { country }
    });
    
    ctx.response.status = 403;
    ctx.response.body = { error: 'Access not available in your region' };
    return;
  }
  
  await next();
}

// Export all security middlewares
export const securityStack = [
  securityMiddleware,
  wafMiddleware,
  inputSanitationMiddleware,
  csrfMiddleware,
  // geoBlockingMiddleware, // Enable if needed
];