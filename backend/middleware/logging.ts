/**
 * 📊 FraudShield Revolutionary - Logging Middleware
 * 
 * Comprehensive request/response logging with security monitoring
 * Features:
 * - Structured JSON logging
 * - Performance monitoring
 * - Security event detection
 * - Error tracking
 * - Audit trail
 */

import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

const env = await load();

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'security';
  method: string;
  url: string;
  status: number;
  duration_ms: number;
  user_id?: string;
  api_key?: string;
  ip_address: string;
  user_agent?: string;
  request_id: string;
  error?: any;
  security_flags?: string[];
}

export async function loggingMiddleware(ctx: Context, next: Next) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Add request ID to context for tracing
  ctx.state.requestId = requestId;
  ctx.response.headers.set("X-Request-ID", requestId);

  const logEntry: Partial<LogEntry> = {
    timestamp: new Date().toISOString(),
    method: ctx.request.method,
    url: ctx.request.url.pathname + ctx.request.url.search,
    ip_address: getClientIP(ctx),
    user_agent: ctx.request.headers.get("User-Agent") || undefined,
    request_id: requestId
  };

  try {
    await next();
    
    const duration = Date.now() - startTime;
    const status = ctx.response.status || 200;
    
    // Complete log entry
    const completeEntry: LogEntry = {
      ...logEntry,
      level: status >= 400 ? (status >= 500 ? 'error' : 'warn') : 'info',
      status,
      duration_ms: duration,
      user_id: ctx.user?.id,
      api_key: ctx.user?.api_key ? maskApiKey(ctx.user.api_key) : undefined,
    } as LogEntry;

    // Add security flags
    completeEntry.security_flags = detectSecurityIssues(ctx, completeEntry);
    if (completeEntry.security_flags.length > 0) {
      completeEntry.level = 'security';
    }

    await logRequest(completeEntry);

  } catch (error) {
    const duration = Date.now() - startTime;
    
    const errorEntry: LogEntry = {
      ...logEntry,
      level: 'error',
      status: ctx.response.status || 500,
      duration_ms: duration,
      user_id: ctx.user?.id,
      api_key: ctx.user?.api_key ? maskApiKey(ctx.user.api_key) : undefined,
      error: {
        name: error.name,
        message: error.message,
        stack: env.NODE_ENV === 'development' ? error.stack : undefined
      }
    } as LogEntry;

    await logRequest(errorEntry);
    throw error;
  }
}

async function logRequest(entry: LogEntry) {
  // Console logging with colors based on level
  const colors = {
    info: '\x1b[32m',    // Green
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    security: '\x1b[35m' // Magenta
  };
  const reset = '\x1b[0m';
  
  const color = colors[entry.level];
  const statusColor = entry.status >= 400 ? '\x1b[31m' : '\x1b[32m';
  
  console.log(
    `${color}[${entry.level.toUpperCase()}]${reset} ` +
    `${entry.method} ${entry.url} ` +
    `${statusColor}${entry.status}${reset} ` +
    `${entry.duration_ms}ms ` +
    `${entry.ip_address} ` +
    `${entry.request_id}`
  );

  // Detailed logging for errors and security events
  if (entry.level === 'error' || entry.level === 'security') {
    console.log(`  Details:`, JSON.stringify({
      user_id: entry.user_id,
      api_key: entry.api_key,
      security_flags: entry.security_flags,
      error: entry.error
    }, null, 2));
  }

  // In production, you might want to send logs to external services
  if (env.NODE_ENV === 'production') {
    await sendToLogService(entry);
  }

  // Write to file for audit trail
  await writeToLogFile(entry);
}

function detectSecurityIssues(ctx: Context, entry: LogEntry): string[] {
  const flags: string[] = [];

  // SQL injection patterns
  const sqlPatterns = /(\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bdrop\b|\bor\b.*=.*\b)/i;
  if (sqlPatterns.test(entry.url)) {
    flags.push('sql_injection_attempt');
  }

  // XSS patterns
  const xssPatterns = /<script|javascript:|on\w+=/i;
  if (xssPatterns.test(entry.url)) {
    flags.push('xss_attempt');
  }

  // Path traversal
  if (entry.url.includes('../') || entry.url.includes('..\\')) {
    flags.push('path_traversal_attempt');
  }

  // Suspicious user agents
  const suspiciousAgents = /bot|scanner|crawler|curl|wget|python|java/i;
  if (entry.user_agent && suspiciousAgents.test(entry.user_agent)) {
    flags.push('suspicious_user_agent');
  }

  // High error rate from same IP
  if (entry.status >= 400) {
    flags.push('error_response');
  }

  // Missing API key for protected endpoints
  if (entry.url.startsWith('/api/v1/') && !entry.url.includes('/auth/') && !entry.api_key) {
    flags.push('missing_auth');
  }

  // Unusual request size
  const contentLength = ctx.request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) { // > 1MB
    flags.push('large_request');
  }

  // Rate limiting violations
  if (entry.status === 429) {
    flags.push('rate_limit_exceeded');
  }

  // Geographic anomalies (placeholder - would need GeoIP lookup)
  // if (isUnusualLocation(entry.ip_address)) {
  //   flags.push('unusual_geographic_location');
  // }

  return flags;
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

  const cfConnectingIP = ctx.request.headers.get("CF-Connecting-IP");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return ctx.request.ip || "unknown";
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return "****";
  return apiKey.substring(0, 6) + "****" + apiKey.substring(apiKey.length - 4);
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

async function sendToLogService(entry: LogEntry) {
  // Example: Send to external logging service
  // This could be Datadog, Splunk, ELK stack, etc.
  
  if (env.LOG_WEBHOOK_URL) {
    try {
      await fetch(env.LOG_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.LOG_WEBHOOK_TOKEN || ''}`
        },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      console.error('Failed to send log to external service:', error.message);
    }
  }

  // Send security events to security monitoring
  if (entry.level === 'security' && env.SECURITY_WEBHOOK_URL) {
    try {
      await fetch(env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.SECURITY_WEBHOOK_TOKEN || ''}`
        },
        body: JSON.stringify({
          type: 'security_event',
          severity: 'medium',
          title: 'Suspicious Activity Detected',
          description: `Security flags: ${entry.security_flags?.join(', ')}`,
          details: entry,
          timestamp: entry.timestamp
        })
      });
    } catch (error) {
      console.error('Failed to send security alert:', error.message);
    }
  }
}

async function writeToLogFile(entry: LogEntry) {
  try {
    const logDir = './logs';
    const logFile = `${logDir}/fraudshield-${new Date().toISOString().split('T')[0]}.log`;
    
    // Ensure log directory exists
    try {
      await Deno.stat(logDir);
    } catch {
      await Deno.mkdir(logDir, { recursive: true });
    }

    const logLine = JSON.stringify(entry) + '\n';
    await Deno.writeTextFile(logFile, logLine, { append: true });
  } catch (error) {
    console.error('Failed to write to log file:', error.message);
  }
}

// Log rotation helper (call this periodically)
export async function rotateLogs() {
  try {
    const logDir = './logs';
    const maxLogAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    const now = Date.now();

    for await (const dirEntry of Deno.readDir(logDir)) {
      if (dirEntry.isFile && dirEntry.name.endsWith('.log')) {
        const filePath = `${logDir}/${dirEntry.name}`;
        const fileInfo = await Deno.stat(filePath);
        
        if (now - fileInfo.mtime!.getTime() > maxLogAge) {
          await Deno.remove(filePath);
          console.log(`Rotated old log file: ${dirEntry.name}`);
        }
      }
    }
  } catch (error) {
    console.error('Log rotation failed:', error.message);
  }
}

// Security monitoring helpers
export async function logSecurityEvent(
  type: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  description: string,
  context: any = {}
) {
  const securityEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'security',
    method: 'SECURITY',
    url: `/security/${type}`,
    status: 0,
    duration_ms: 0,
    ip_address: context.ip_address || 'unknown',
    request_id: generateRequestId(),
    security_flags: [type],
    error: {
      type,
      severity,
      description,
      context
    }
  };

  await logRequest(securityEntry);
}

export async function logFraudAttempt(
  fraudScore: number,
  decision: string,
  userId?: string,
  transactionData?: any
) {
  await logSecurityEvent(
    'fraud_attempt',
    fraudScore > 80 ? 'high' : fraudScore > 50 ? 'medium' : 'low',
    `Fraud attempt detected with score ${fraudScore}`,
    {
      fraud_score: fraudScore,
      decision,
      user_id: userId,
      transaction_data: transactionData
    }
  );
}