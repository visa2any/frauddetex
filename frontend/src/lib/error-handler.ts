/**
 * 🚨 FraudDetex - Enterprise Error Handling System
 * Comprehensive error management and reporting
 */

// ============================================================================
// ERROR CODES AND TYPES
// ============================================================================

export enum ErrorCode {
  // Authentication & Authorization
  AUTH_FAILED = 'AUTH_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Validation Errors
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // ML Service Errors
  ML_NOT_INITIALIZED = 'ML_NOT_INITIALIZED',
  ML_INITIALIZATION_FAILED = 'ML_INITIALIZATION_FAILED',
  ML_PREDICTION_FAILED = 'ML_PREDICTION_FAILED',
  INVALID_MODEL = 'INVALID_MODEL',
  MODEL_LOAD_FAILED = 'MODEL_LOAD_FAILED',
  
  // Behavioral Biometrics Errors
  BIOMETRICS_INIT_FAILED = 'BIOMETRICS_INIT_FAILED',
  BIOMETRICS_CAPTURE_FAILED = 'BIOMETRICS_CAPTURE_FAILED',
  INSUFFICIENT_BIOMETRIC_DATA = 'INSUFFICIENT_BIOMETRIC_DATA',
  
  // Network & API Errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_REQUEST_FAILED = 'API_REQUEST_FAILED',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Database Errors
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED = 'DATABASE_QUERY_FAILED',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  
  // Security Errors
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  REQUEST_TAMPERING = 'REQUEST_TAMPERING',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  
  // System Errors
  SYSTEM_OVERLOAD = 'SYSTEM_OVERLOAD',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  USER_INPUT = 'user_input',
  SYSTEM = 'system',
  NETWORK = 'network',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BUSINESS_LOGIC = 'business_logic'
}

// ============================================================================
// ERROR INTERFACES
// ============================================================================

export interface ErrorContext {
  readonly requestId?: string;
  readonly userId?: string;
  readonly sessionId?: string;
  readonly userAgent?: string;
  readonly ipAddress?: string;
  readonly endpoint?: string;
  readonly method?: string;
  readonly timestamp: number;
  readonly stackTrace?: string;
  readonly additionalData?: Record<string, unknown>;
}

export interface ErrorMetadata {
  readonly code: ErrorCode;
  readonly category: ErrorCategory;
  readonly severity: ErrorSeverity;
  readonly retryable: boolean;
  readonly userMessage: string;
  readonly technicalMessage: string;
  readonly suggestedActions?: string[];
  readonly documentationUrl?: string;
}

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class FraudDetectionError extends Error {
  public readonly code: ErrorCode;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext;
  public readonly retryable: boolean;
  public readonly userMessage: string;
  public readonly timestamp: number;

  constructor(
    message: string,
    code: ErrorCode,
    context?: Partial<ErrorContext>,
    options?: Partial<ErrorMetadata>
  ) {
    super(message);
    
    this.name = 'FraudDetectionError';
    this.code = code;
    this.timestamp = Date.now();
    this.context = context ? { timestamp: this.timestamp, ...context } : undefined;
    
    // Set metadata based on error code
    const metadata = this._getErrorMetadata(code);
    this.category = options?.category || metadata.category;
    this.severity = options?.severity || metadata.severity;
    this.retryable = options?.retryable ?? metadata.retryable;
    this.userMessage = options?.userMessage || metadata.userMessage;

    // Ensure stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FraudDetectionError);
    }
  }

  private _getErrorMetadata(code: ErrorCode): ErrorMetadata {
    const errorMetadataMap: Record<ErrorCode, ErrorMetadata> = {
      // Authentication & Authorization
      [ErrorCode.AUTH_FAILED]: {
        code,
        category: ErrorCategory.SECURITY,
        severity: ErrorSeverity.HIGH,
        retryable: true,
        userMessage: 'Authentication failed. Please check your credentials.',
        technicalMessage: 'User authentication failed',
        suggestedActions: ['Verify credentials', 'Reset password', 'Contact support']
      },
      
      [ErrorCode.TOKEN_EXPIRED]: {
        code,
        category: ErrorCategory.SECURITY,
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        userMessage: 'Your session has expired. Please log in again.',
        technicalMessage: 'Authentication token has expired',
        suggestedActions: ['Refresh token', 'Re-authenticate']
      },
      
      [ErrorCode.INSUFFICIENT_PERMISSIONS]: {
        code,
        category: ErrorCategory.SECURITY,
        severity: ErrorSeverity.MEDIUM,
        retryable: false,
        userMessage: 'You do not have permission to perform this action.',
        technicalMessage: 'User lacks required permissions',
        suggestedActions: ['Contact administrator', 'Request permission upgrade']
      },

      // Validation Errors
      [ErrorCode.INVALID_INPUT]: {
        code,
        category: ErrorCategory.USER_INPUT,
        severity: ErrorSeverity.LOW,
        retryable: true,
        userMessage: 'Invalid input provided. Please check your data.',
        technicalMessage: 'Input validation failed',
        suggestedActions: ['Verify input format', 'Check required fields']
      },
      
      [ErrorCode.VALIDATION_FAILED]: {
        code,
        category: ErrorCategory.USER_INPUT,
        severity: ErrorSeverity.LOW,
        retryable: true,
        userMessage: 'Data validation failed. Please correct the errors.',
        technicalMessage: 'Data validation constraints not met',
        suggestedActions: ['Review validation errors', 'Correct invalid fields']
      },

      // ML Service Errors
      [ErrorCode.ML_NOT_INITIALIZED]: {
        code,
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        retryable: true,
        userMessage: 'Fraud detection service is initializing. Please try again.',
        technicalMessage: 'ML service not properly initialized',
        suggestedActions: ['Wait for initialization', 'Retry request', 'Check system status']
      },
      
      [ErrorCode.ML_PREDICTION_FAILED]: {
        code,
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        retryable: true,
        userMessage: 'Fraud analysis failed. Please try again.',
        technicalMessage: 'ML prediction pipeline failed',
        suggestedActions: ['Retry analysis', 'Check input data', 'Contact support']
      },

      // Network & API Errors
      [ErrorCode.NETWORK_ERROR]: {
        code,
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        userMessage: 'Network connection error. Please check your internet connection.',
        technicalMessage: 'Network request failed',
        suggestedActions: ['Check internet connection', 'Retry request', 'Try again later']
      },
      
      [ErrorCode.TIMEOUT_ERROR]: {
        code,
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        userMessage: 'Request timed out. Please try again.',
        technicalMessage: 'Request exceeded timeout limit',
        suggestedActions: ['Retry request', 'Check network speed', 'Try again later']
      },

      // Security Errors
      [ErrorCode.SECURITY_VIOLATION]: {
        code,
        category: ErrorCategory.SECURITY,
        severity: ErrorSeverity.CRITICAL,
        retryable: false,
        userMessage: 'Security violation detected. Your request has been blocked.',
        technicalMessage: 'Security policy violation detected',
        suggestedActions: ['Contact security team', 'Review request', 'Report if legitimate']
      },

      // System Errors
      [ErrorCode.SERVICE_UNAVAILABLE]: {
        code,
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.HIGH,
        retryable: true,
        userMessage: 'Service temporarily unavailable. Please try again later.',
        technicalMessage: 'Service is currently unavailable',
        suggestedActions: ['Try again later', 'Check status page', 'Contact support']
      },

      // Additional error codes
      [ErrorCode.MISSING_REQUIRED_FIELD]: { code, category: ErrorCategory.USER_INPUT, severity: ErrorSeverity.LOW, retryable: true, userMessage: 'Required field missing', technicalMessage: 'Required field not provided', suggestedActions: ['Complete missing fields'] },
      [ErrorCode.ML_INITIALIZATION_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'ML initialization failed', technicalMessage: 'ML service failed to initialize', suggestedActions: ['Retry request'] },
      [ErrorCode.INVALID_MODEL]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: false, userMessage: 'Invalid model', technicalMessage: 'ML model validation failed', suggestedActions: ['Contact support'] },
      [ErrorCode.MODEL_LOAD_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'Model loading failed', technicalMessage: 'Failed to load ML model', suggestedActions: ['Retry request'] },
      [ErrorCode.BIOMETRICS_INIT_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.MEDIUM, retryable: true, userMessage: 'Biometrics init failed', technicalMessage: 'Biometric capture failed to initialize', suggestedActions: ['Retry operation'] },
      [ErrorCode.BIOMETRICS_CAPTURE_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.MEDIUM, retryable: true, userMessage: 'Biometrics capture failed', technicalMessage: 'Biometric data collection failed', suggestedActions: ['Retry operation'] },
      [ErrorCode.INSUFFICIENT_BIOMETRIC_DATA]: { code, category: ErrorCategory.USER_INPUT, severity: ErrorSeverity.LOW, retryable: true, userMessage: 'Insufficient biometric data', technicalMessage: 'Not enough biometric data collected', suggestedActions: ['Interact longer'] },
      [ErrorCode.API_REQUEST_FAILED]: { code, category: ErrorCategory.NETWORK, severity: ErrorSeverity.MEDIUM, retryable: true, userMessage: 'API request failed', technicalMessage: 'HTTP API request failed', suggestedActions: ['Retry request'] },
      [ErrorCode.RATE_LIMIT_EXCEEDED]: { code, category: ErrorCategory.NETWORK, severity: ErrorSeverity.MEDIUM, retryable: true, userMessage: 'Rate limit exceeded', technicalMessage: 'API rate limit exceeded', suggestedActions: ['Wait before retrying'] },
      [ErrorCode.DATABASE_CONNECTION_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'Database connection failed', technicalMessage: 'Unable to connect to database', suggestedActions: ['Retry request'] },
      [ErrorCode.DATABASE_QUERY_FAILED]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'Database query failed', technicalMessage: 'Database query execution failed', suggestedActions: ['Retry request'] },
      [ErrorCode.RECORD_NOT_FOUND]: { code, category: ErrorCategory.USER_INPUT, severity: ErrorSeverity.LOW, retryable: false, userMessage: 'Record not found', technicalMessage: 'Requested record does not exist', suggestedActions: ['Verify input'] },
      [ErrorCode.DUPLICATE_RECORD]: { code, category: ErrorCategory.USER_INPUT, severity: ErrorSeverity.LOW, retryable: false, userMessage: 'Record already exists', technicalMessage: 'Duplicate record constraint violation', suggestedActions: ['Use different identifier'] },
      [ErrorCode.CSRF_TOKEN_INVALID]: { code, category: ErrorCategory.SECURITY, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'Security token invalid', technicalMessage: 'CSRF token validation failed', suggestedActions: ['Refresh page'] },
      [ErrorCode.REQUEST_TAMPERING]: { code, category: ErrorCategory.SECURITY, severity: ErrorSeverity.CRITICAL, retryable: false, userMessage: 'Request tampering detected', technicalMessage: 'Request integrity check failed', suggestedActions: ['Contact security'] },
      [ErrorCode.SUSPICIOUS_ACTIVITY]: { code, category: ErrorCategory.SECURITY, severity: ErrorSeverity.HIGH, retryable: false, userMessage: 'Suspicious activity detected', technicalMessage: 'Anomalous behavior detected', suggestedActions: ['Contact support'] },
      [ErrorCode.SYSTEM_OVERLOAD]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.HIGH, retryable: true, userMessage: 'System overloaded', technicalMessage: 'System resource limits exceeded', suggestedActions: ['Try again later'] },
      [ErrorCode.CONFIGURATION_ERROR]: { code, category: ErrorCategory.SYSTEM, severity: ErrorSeverity.CRITICAL, retryable: false, userMessage: 'Configuration error', technicalMessage: 'System misconfiguration detected', suggestedActions: ['Contact support'] },
      
      // Default case
      [ErrorCode.UNKNOWN_ERROR]: {
        code,
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        userMessage: 'An unexpected error occurred. Please try again.',
        technicalMessage: 'Unknown system error',
        suggestedActions: ['Retry request', 'Contact support if persistent']
      }
    };

    return errorMetadataMap[code] || errorMetadataMap[ErrorCode.UNKNOWN_ERROR];
  }

  /**
   * Convert error to JSON for logging/API responses
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      userMessage: this.userMessage,
      retryable: this.retryable,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }

  /**
   * Create user-friendly error response
   */
  toUserResponse(): Record<string, unknown> {
    return {
      error: true,
      code: this.code,
      message: this.userMessage,
      retryable: this.retryable,
      timestamp: this.timestamp
    };
  }
}

// ============================================================================
// SPECIALIZED ERROR CLASSES
// ============================================================================

export class ValidationError extends FraudDetectionError {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(
    message: string,
    field?: string,
    value?: unknown,
    context?: Partial<ErrorContext>
  ) {
    super(message, ErrorCode.VALIDATION_FAILED, context);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }
}

export class MLServiceError extends FraudDetectionError {
  public readonly modelVersion?: string;
  public readonly featureCount?: number;

  constructor(
    message: string,
    code: ErrorCode,
    context?: Partial<ErrorContext>,
    metadata?: { modelVersion?: string; featureCount?: number }
  ) {
    super(message, code, context);
    this.name = 'MLServiceError';
    this.modelVersion = metadata?.modelVersion;
    this.featureCount = metadata?.featureCount;
  }
}

export class SecurityError extends FraudDetectionError {
  public readonly threatLevel: 'low' | 'medium' | 'high' | 'critical';
  public readonly blockedRequest: boolean;

  constructor(
    message: string,
    threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    blockedRequest = true,
    context?: Partial<ErrorContext>
  ) {
    super(message, ErrorCode.SECURITY_VIOLATION, context, {
      severity: threatLevel === 'critical' ? ErrorSeverity.CRITICAL : ErrorSeverity.HIGH
    });
    this.name = 'SecurityError';
    this.threatLevel = threatLevel;
    this.blockedRequest = blockedRequest;
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export class ErrorHandler {
  private static instance: ErrorHandler | null = null;
  private errorReporters: ErrorReporter[] = [];
  private errorFilters: ErrorFilter[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Add error reporter (e.g., logging service, monitoring service)
   */
  addReporter(reporter: ErrorReporter): void {
    this.errorReporters.push(reporter);
  }

  /**
   * Add error filter to exclude certain errors from reporting
   */
  addFilter(filter: ErrorFilter): void {
    this.errorFilters.push(filter);
  }

  /**
   * Handle and report error
   */
  async handleError(error: Error, context?: Partial<ErrorContext>): Promise<void> {
    let fraudError: FraudDetectionError;

    // Convert to FraudDetectionError if needed
    if (error instanceof FraudDetectionError) {
      fraudError = error;
    } else {
      fraudError = new FraudDetectionError(
        error.message,
        ErrorCode.UNKNOWN_ERROR,
        context
      );
    }

    // Apply filters
    if (this.shouldFilterError(fraudError)) {
      return;
    }

    // Report to all registered reporters
    const reportPromises = this.errorReporters.map(reporter =>
      reporter.report(fraudError).catch(reportError => {
        console.error('Error reporter failed:', reportError);
      })
    );

    await Promise.allSettled(reportPromises);
  }

  /**
   * Create standardized error response for APIs
   */
  createErrorResponse(error: Error): ErrorResponse {
    if (error instanceof FraudDetectionError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.userMessage,
          category: error.category,
          severity: error.severity,
          retryable: error.retryable,
          timestamp: error.timestamp
        }
      };
    }

    return {
      success: false,
      error: {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unexpected error occurred',
        category: ErrorCategory.SYSTEM,
        severity: ErrorSeverity.MEDIUM,
        retryable: true,
        timestamp: Date.now()
      }
    };
  }

  private shouldFilterError(error: FraudDetectionError): boolean {
    return this.errorFilters.some(filter => filter.shouldFilter(error));
  }
}

// ============================================================================
// ERROR REPORTER INTERFACE
// ============================================================================

export interface ErrorReporter {
  report(error: FraudDetectionError): Promise<void>;
}

export class ConsoleErrorReporter implements ErrorReporter {
  async report(error: FraudDetectionError): Promise<void> {
    const logLevel = this.getLogLevel(error.severity);
    console[logLevel]('FraudDetection Error:', {
      code: error.code,
      message: error.message,
      severity: error.severity,
      category: error.category,
      context: error.context,
      timestamp: new Date(error.timestamp).toISOString()
    });
  }

  private getLogLevel(severity: ErrorSeverity): 'error' | 'warn' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'error';
    }
  }
}

export class RemoteErrorReporter implements ErrorReporter {
  constructor(private endpoint: string, private apiKey: string) {}

  async report(error: FraudDetectionError): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          error: error.toJSON(),
          timestamp: error.timestamp,
          service: 'frauddetex'
        })
      });
    } catch (reportError) {
      console.error('Failed to report error to remote service:', reportError);
    }
  }
}

// ============================================================================
// ERROR FILTER INTERFACE
// ============================================================================

export interface ErrorFilter {
  shouldFilter(error: FraudDetectionError): boolean;
}

export class SeverityErrorFilter implements ErrorFilter {
  constructor(private minSeverity: ErrorSeverity) {}

  shouldFilter(error: FraudDetectionError): boolean {
    const severityLevels = {
      [ErrorSeverity.LOW]: 1,
      [ErrorSeverity.MEDIUM]: 2,
      [ErrorSeverity.HIGH]: 3,
      [ErrorSeverity.CRITICAL]: 4
    };

    return severityLevels[error.severity] < severityLevels[this.minSeverity];
  }
}

export class CategoryErrorFilter implements ErrorFilter {
  constructor(private excludedCategories: ErrorCategory[]) {}

  shouldFilter(error: FraudDetectionError): boolean {
    return this.excludedCategories.includes(error.category);
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Partial<ErrorContext>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorHandler = ErrorHandler.getInstance();
      await errorHandler.handleError(error as Error, context);
      throw error;
    }
  }) as T;
}

/**
 * Create error context from request
 */
export function createErrorContext(
  request?: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    user?: { id: string };
  }
): ErrorContext {
  return {
    requestId: generateRequestId(),
    userId: request?.user?.id,
    userAgent: request?.headers?.['user-agent'],
    endpoint: request?.url,
    method: request?.method,
    timestamp: Date.now()
  };
}

/**
 * Generate unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// RESPONSE INTERFACES
// ============================================================================

export interface ErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: ErrorCode;
    readonly message: string;
    readonly category: ErrorCategory;
    readonly severity: ErrorSeverity;
    readonly retryable: boolean;
    readonly timestamp: number;
  };
}

// ============================================================================
// SINGLETON SETUP
// ============================================================================

// Initialize default error handler
const defaultErrorHandler = ErrorHandler.getInstance();
defaultErrorHandler.addReporter(new ConsoleErrorReporter());

// Global error handler for uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    defaultErrorHandler.handleError(new Error(event.message), {
      endpoint: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    defaultErrorHandler.handleError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      {
        endpoint: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    );
  });
}

export { defaultErrorHandler as errorHandler };