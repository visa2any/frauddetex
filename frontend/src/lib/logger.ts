/**
 * 📊 FraudDetex - Enterprise Logging System
 * Structured logging with multiple transports and log levels
 */

// ============================================================================
// LOG LEVELS AND TYPES
// ============================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogEntry {
  readonly timestamp: number;
  readonly level: LogLevel;
  readonly message: string;
  readonly context: string;
  readonly data?: Record<string, unknown>;
  readonly error?: Error;
  readonly requestId?: string;
  readonly userId?: string;
  readonly sessionId?: string;
}

export interface LogTransport {
  log(entry: LogEntry): Promise<void>;
  flush?(): Promise<void>;
}

export interface LoggerConfig {
  readonly level: LogLevel;
  readonly context?: string;
  readonly transports: LogTransport[];
  readonly enableConsole: boolean;
  readonly enableRemote: boolean;
  readonly bufferSize: number;
  readonly flushInterval: number;
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

export class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(
    context: string = 'FraudDetex',
    config?: Partial<LoggerConfig>
  ) {
    this.config = {
      level: LogLevel.INFO,
      context,
      transports: [],
      enableConsole: true,
      enableRemote: false,
      bufferSize: 100,
      flushInterval: 5000,
      ...config
    };

    // Initialize default transports
    this.initializeTransports();

    // Start flush timer
    this.startFlushTimer();
  }

  // ============================================================================
  // PUBLIC LOGGING METHODS
  // ============================================================================

  /**
   * Log debug message (development only)
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log error message
   */
  error(message: string, data?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  /**
   * Log critical error (requires immediate attention)
   */
  critical(message: string, data?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.CRITICAL, message, data, error);
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, durationMs: number, metadata?: Record<string, unknown>): void {
    this.info(`Performance: ${operation}`, {
      operation,
      durationMs,
      performanceType: 'timing',
      ...metadata
    });
  }

  /**
   * Log ML operation metrics
   */
  mlMetrics(
    operation: string,
    processingTime: number,
    accuracy?: number,
    metadata?: Record<string, unknown>
  ): void {
    this.info(`ML Metrics: ${operation}`, {
      operation,
      processingTimeMs: processingTime,
      accuracy,
      category: 'ml_metrics',
      ...metadata
    });
  }

  /**
   * Log fraud detection events
   */
  fraudEvent(
    eventType: 'detection' | 'analysis' | 'decision',
    transactionId: string,
    result: Record<string, unknown>
  ): void {
    this.info(`Fraud ${eventType}: ${transactionId}`, {
      eventType,
      transactionId,
      category: 'fraud_detection',
      ...result
    });
  }

  /**
   * Log security events
   */
  security(
    eventType: 'auth' | 'access' | 'violation' | 'threat',
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    metadata?: Record<string, unknown>
  ): void {
    const logLevel = severity === 'critical' ? LogLevel.CRITICAL : 
                    severity === 'high' ? LogLevel.ERROR :
                    severity === 'medium' ? LogLevel.WARN : LogLevel.INFO;

    this.log(logLevel, `Security ${eventType}: ${message}`, {
      eventType,
      severity,
      category: 'security',
      ...metadata
    });
  }

  // ============================================================================
  // CONTEXT MANAGEMENT
  // ============================================================================

  /**
   * Create child logger with additional context
   */
  child(context: string, metadata?: Record<string, unknown>): Logger {
    const childLogger = new Logger(
      `${this.config.context}:${context}`,
      this.config
    );

    // Add metadata to all child logs
    if (metadata) {
      const originalLog = childLogger.log.bind(childLogger);
      childLogger.log = (level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) => {
        originalLog(level, message, { ...metadata, ...data }, error);
      };
    }

    return childLogger;
  }

  /**
   * Set request context for correlation
   */
  setRequestContext(requestId: string, userId?: string, sessionId?: string): Logger {
    return this.child('request', { requestId, userId, sessionId });
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private log(
    level: LogLevel,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ): void {
    // Check if log level meets threshold
    if (level < this.config.level) {
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context: this.config.context,
      data,
      error,
      requestId: this.extractFromData(data, 'requestId'),
      userId: this.extractFromData(data, 'userId'),
      sessionId: this.extractFromData(data, 'sessionId')
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Console logging for immediate feedback
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Check if buffer needs flushing
    if (this.logBuffer.length >= this.config.bufferSize) {
      this.flush();
    }
  }

  private extractFromData(data: Record<string, unknown> | undefined, key: string): string | undefined {
    return data?.[key] as string | undefined;
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}] [${entry.context}]`;
    
    const logMethod = this.getConsoleMethod(entry.level);
    
    if (entry.error) {
      logMethod(`${prefix} ${entry.message}`, entry.data, entry.error);
    } else if (entry.data) {
      logMethod(`${prefix} ${entry.message}`, entry.data);
    } else {
      logMethod(`${prefix} ${entry.message}`);
    }
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  private initializeTransports(): void {
    // Console transport (already handled in logToConsole)
    
    // Remote transport (if enabled)
    if (this.config.enableRemote) {
      this.config.transports.push(new RemoteLogTransport());
    }

    // Local storage transport (for debugging)
    if (typeof window !== 'undefined') {
      this.config.transports.push(new LocalStorageTransport());
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Flush buffered logs to all transports
   */
  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    // Send to all transports
    const flushPromises = this.config.transports.map(transport =>
      Promise.all(logsToFlush.map(entry => transport.log(entry)))
        .catch(error => {
          console.error('Transport failed to log entries:', error);
        })
    );

    await Promise.allSettled(flushPromises);
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush remaining logs
    this.flush();

    // Cleanup transports
    this.config.transports.forEach(transport => {
      if (transport.flush) {
        transport.flush().catch(console.error);
      }
    });
  }
}

// ============================================================================
// LOG TRANSPORTS
// ============================================================================

export class RemoteLogTransport implements LogTransport {
  private endpoint: string;
  private apiKey: string;
  private batchSize: number;
  private logBatch: LogEntry[] = [];

  constructor(
    endpoint: string = '/api/logs',
    apiKey: string = '',
    batchSize: number = 10
  ) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.batchSize = batchSize;
  }

  async log(entry: LogEntry): Promise<void> {
    this.logBatch.push(entry);

    if (this.logBatch.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.logBatch.length === 0) {
      return;
    }

    const batch = [...this.logBatch];
    this.logBatch = [];

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
        },
        body: JSON.stringify({
          logs: batch.map(entry => ({
            timestamp: entry.timestamp,
            level: LogLevel[entry.level],
            message: entry.message,
            context: entry.context,
            data: entry.data,
            error: entry.error ? {
              name: entry.error.name,
              message: entry.error.message,
              stack: entry.error.stack
            } : undefined,
            requestId: entry.requestId,
            userId: entry.userId,
            sessionId: entry.sessionId
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Failed to send logs to remote endpoint:', error);
      // Re-add failed logs to batch for retry
      this.logBatch.unshift(...batch);
    }
  }
}

export class LocalStorageTransport implements LogTransport {
  private storageKey: string;
  private maxEntries: number;

  constructor(storageKey: string = 'frauddetex_logs', maxEntries: number = 1000) {
    this.storageKey = storageKey;
    this.maxEntries = maxEntries;
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      const existingLogs = this.getLogs();
      existingLogs.push({
        timestamp: entry.timestamp,
        level: LogLevel[entry.level],
        message: entry.message,
        context: entry.context,
        data: entry.data,
        requestId: entry.requestId,
        userId: entry.userId
      });

      // Keep only the most recent entries
      if (existingLogs.length > this.maxEntries) {
        existingLogs.splice(0, existingLogs.length - this.maxEntries);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(existingLogs));

    } catch (error) {
      // Storage quota exceeded or not available
      console.warn('LocalStorage logging failed:', error);
    }
  }

  private getLogs(): any[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Get logs for debugging
   */
  getStoredLogs(): any[] {
    return this.getLogs();
  }

  /**
   * Clear stored logs
   */
  clearLogs(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create logger instance with fraud detection context
 */
export function createFraudLogger(context: string): Logger {
  return new Logger(`FraudDetex:${context}`, {
    level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
    enableConsole: true,
    enableRemote: process.env.NODE_ENV === 'production'
  });
}

/**
 * Performance timing decorator
 */
export function logPerformance<T extends (...args: any[]) => Promise<any>>(
  logger: Logger,
  operation: string
) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const startTime = performance.now();
      
      try {
        const result = await originalMethod.apply(this, args);
        const duration = performance.now() - startTime;
        
        logger.performance(operation, duration, {
          method: propertyKey,
          success: true
        });
        
        return result;
        
      } catch (error) {
        const duration = performance.now() - startTime;
        
        logger.performance(operation, duration, {
          method: propertyKey,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Get logger for specific context
 */
export function getLogger(context: string): Logger {
  return loggerRegistry.get(context);
}

// ============================================================================
// LOGGER REGISTRY
// ============================================================================

class LoggerRegistry {
  private loggers = new Map<string, Logger>();

  get(context: string): Logger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, createFraudLogger(context));
    }
    return this.loggers.get(context)!;
  }

  dispose(): void {
    this.loggers.forEach(logger => logger.dispose());
    this.loggers.clear();
  }
}

export const loggerRegistry = new LoggerRegistry();

// Global cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    loggerRegistry.dispose();
  });
}

// Default logger
export const defaultLogger = createFraudLogger('App');