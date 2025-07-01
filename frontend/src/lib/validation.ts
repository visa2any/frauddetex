/**
 * ✅ FraudDetex - Enterprise Validation System
 * Comprehensive input validation and sanitization
 */

import type { 
  ValidationResult, 
  ValidationError as ValidationErrorType,
  ValidationWarning,
  MLFeatures,
  TransactionData,
  BehavioralData,
  User
} from '../types';

// ============================================================================
// VALIDATION SCHEMAS AND RULES
// ============================================================================

export interface ValidationRule<T> {
  readonly name: string;
  readonly message: string;
  readonly validate: (value: T, context?: any) => boolean;
  readonly severity: 'error' | 'warning';
}

export interface FieldValidationConfig<T> {
  readonly required?: boolean;
  readonly type?: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'date';
  readonly min?: number;
  readonly max?: number;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly enum?: readonly T[];
  readonly custom?: ValidationRule<T>[];
}

// ============================================================================
// CORE VALIDATION CLASS
// ============================================================================

export class Validator {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static urlRegex = /^https?:\/\/.+/;
  private static phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  private static sqlInjectionRegex = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i;
  private static xssRegex = /<[^>]*script[^>]*>|javascript:|on\w+\s*=/i;

  /**
   * Validate a single field with configuration
   */
  static validateField<T>(
    value: T,
    fieldName: string,
    config: FieldValidationConfig<T>
  ): ValidationResult {
    const errors: ValidationErrorType[] = [];
    const warnings: ValidationWarning[] = [];

    // Required check
    if (config.required && this.isEmpty(value)) {
      errors.push({
        field: fieldName,
        code: 'REQUIRED',
        message: `${fieldName} is required`,
        value
      });
      return { valid: false, errors, warnings };
    }

    // Skip other validations if value is empty and not required
    if (this.isEmpty(value) && !config.required) {
      return { valid: true, errors, warnings };
    }

    // Type validation
    if (config.type) {
      const typeResult = this.validateType(value, config.type, fieldName);
      if (!typeResult.valid) {
        errors.push(...typeResult.errors);
      }
    }

    // Range validation for numbers
    if (typeof value === 'number') {
      if (config.min !== undefined && value < config.min) {
        errors.push({
          field: fieldName,
          code: 'MIN_VALUE',
          message: `${fieldName} must be at least ${config.min}`,
          value
        });
      }

      if (config.max !== undefined && value > config.max) {
        errors.push({
          field: fieldName,
          code: 'MAX_VALUE',
          message: `${fieldName} must be at most ${config.max}`,
          value
        });
      }
    }

    // Length validation for strings
    if (typeof value === 'string') {
      if (config.minLength !== undefined && value.length < config.minLength) {
        errors.push({
          field: fieldName,
          code: 'MIN_LENGTH',
          message: `${fieldName} must be at least ${config.minLength} characters`,
          value
        });
      }

      if (config.maxLength !== undefined && value.length > config.maxLength) {
        errors.push({
          field: fieldName,
          code: 'MAX_LENGTH',
          message: `${fieldName} must be at most ${config.maxLength} characters`,
          value
        });
      }

      // Security validation for strings
      const securityResult = this.validateSecurity(value, fieldName);
      if (!securityResult.valid) {
        errors.push(...securityResult.errors);
      }
    }

    // Pattern validation
    if (config.pattern && typeof value === 'string') {
      if (!config.pattern.test(value)) {
        errors.push({
          field: fieldName,
          code: 'PATTERN',
          message: `${fieldName} format is invalid`,
          value
        });
      }
    }

    // Enum validation
    if (config.enum && !config.enum.includes(value)) {
      errors.push({
        field: fieldName,
        code: 'ENUM',
        message: `${fieldName} must be one of: ${config.enum.join(', ')}`,
        value
      });
    }

    // Custom validation rules
    if (config.custom) {
      for (const rule of config.custom) {
        if (!rule.validate(value)) {
          const validationItem = {
            field: fieldName,
            code: rule.name.toUpperCase(),
            message: rule.message,
            value
          };

          if (rule.severity === 'error') {
            errors.push(validationItem);
          } else {
            warnings.push(validationItem);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate object with schema
   */
  static validateObject<T extends Record<string, any>>(
    obj: T,
    schema: Record<keyof T, FieldValidationConfig<any>>
  ): ValidationResult {
    const errors: ValidationErrorType[] = [];
    const warnings: ValidationWarning[] = [];

    for (const [fieldName, config] of Object.entries(schema)) {
      const fieldResult = this.validateField(obj[fieldName], fieldName, config);
      errors.push(...fieldResult.errors);
      warnings.push(...fieldResult.warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // ============================================================================
  // TYPE VALIDATION
  // ============================================================================

  private static validateType(
    value: any,
    type: string,
    fieldName: string
  ): ValidationResult {
    const errors: ValidationErrorType[] = [];

    switch (type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push({
            field: fieldName,
            code: 'INVALID_TYPE',
            message: `${fieldName} must be a string`,
            value
          });
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push({
            field: fieldName,
            code: 'INVALID_TYPE',
            message: `${fieldName} must be a valid number`,
            value
          });
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push({
            field: fieldName,
            code: 'INVALID_TYPE',
            message: `${fieldName} must be a boolean`,
            value
          });
        }
        break;

      case 'email':
        if (typeof value !== 'string' || !this.emailRegex.test(value)) {
          errors.push({
            field: fieldName,
            code: 'INVALID_EMAIL',
            message: `${fieldName} must be a valid email address`,
            value
          });
        }
        break;

      case 'url':
        if (typeof value !== 'string' || !this.urlRegex.test(value)) {
          errors.push({
            field: fieldName,
            code: 'INVALID_URL',
            message: `${fieldName} must be a valid URL`,
            value
          });
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push({
            field: fieldName,
            code: 'INVALID_DATE',
            message: `${fieldName} must be a valid date`,
            value
          });
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  // ============================================================================
  // SECURITY VALIDATION
  // ============================================================================

  private static validateSecurity(
    value: string,
    fieldName: string
  ): ValidationResult {
    const errors: ValidationErrorType[] = [];

    // Check for SQL injection patterns
    if (this.sqlInjectionRegex.test(value)) {
      errors.push({
        field: fieldName,
        code: 'SQL_INJECTION',
        message: `${fieldName} contains potentially dangerous SQL patterns`,
        value
      });
    }

    // Check for XSS patterns
    if (this.xssRegex.test(value)) {
      errors.push({
        field: fieldName,
        code: 'XSS_ATTEMPT',
        message: `${fieldName} contains potentially dangerous script content`,
        value
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: []
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private static isEmpty(value: any): boolean {
    return value === null || 
           value === undefined || 
           value === '' ||
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  }
}

// ============================================================================
// SPECIFIC VALIDATORS
// ============================================================================

/**
 * Validate ML features for fraud detection
 */
export function validateMLFeatures(features: MLFeatures): ValidationResult {
  const schema: Record<keyof MLFeatures, FieldValidationConfig<any>> = {
    // Transaction features
    amount: {
      required: true,
      type: 'number',
      min: 0.01,
      max: 1000000
    },
    transaction_hour: {
      required: true,
      type: 'number',
      min: 0,
      max: 23
    },
    transaction_day_of_week: {
      required: true,
      type: 'number',
      min: 0,
      max: 6
    },
    merchant_category: {
      required: true,
      type: 'string',
      enum: ['general', 'food', 'electronics', 'clothing', 'travel', 'healthcare', 'education']
    },
    payment_method: {
      required: true,
      type: 'string',
      enum: ['credit_card', 'debit_card', 'pix', 'bank_transfer', 'digital_wallet']
    },
    currency: {
      required: true,
      type: 'string',
      minLength: 3,
      maxLength: 3
    },

    // User behavior features
    user_age_days: {
      required: true,
      type: 'number',
      min: 0,
      max: 10950 // ~30 years
    },
    transactions_last_24h: {
      required: true,
      type: 'number',
      min: 0,
      max: 1000
    },
    avg_transaction_amount: {
      required: true,
      type: 'number',
      min: 0
    },
    velocity_score: {
      required: true,
      type: 'number',
      min: 0,
      max: 100
    },

    // Device/IP features
    device_fingerprint: {
      required: true,
      type: 'string',
      minLength: 10,
      maxLength: 100
    },
    ip_address: {
      required: true,
      type: 'string',
      pattern: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
    },
    ip_reputation_score: {
      required: true,
      type: 'number',
      min: 0,
      max: 100
    },
    geolocation_risk: {
      required: true,
      type: 'number',
      min: 0,
      max: 1
    },
    is_vpn: {
      required: true,
      type: 'boolean'
    },
    is_tor: {
      required: true,
      type: 'boolean'
    },
    country_code: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 2
    },

    // Behavioral biometrics (optional)
    mouse_velocity_avg: {
      required: false,
      type: 'number',
      min: 0
    },
    mouse_click_pressure: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },
    keystroke_dwell_time: {
      required: false,
      type: 'number',
      min: 0
    },
    typing_rhythm_score: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },
    scroll_pattern_score: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },

    // Network features
    community_threat_score: {
      required: true,
      type: 'number',
      min: 0,
      max: 100
    },
    similar_transaction_patterns: {
      required: true,
      type: 'number',
      min: 0
    },
    email_age_days: {
      required: true,
      type: 'number',
      min: 0
    },
    device_reputation_score: {
      required: true,
      type: 'number',
      min: 0,
      max: 100
    }
  };

  return Validator.validateObject(features, schema);
}

/**
 * Validate transaction data
 */
export function validateTransactionData(transaction: TransactionData): ValidationResult {
  const schema: Record<keyof TransactionData, FieldValidationConfig<any>> = {
    transaction_id: {
      required: true,
      type: 'string',
      minLength: 5,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9_-]+$/
    },
    amount: {
      required: true,
      type: 'number',
      min: 0.01,
      max: 1000000
    },
    user_id: {
      required: true,
      type: 'string',
      minLength: 5,
      maxLength: 100
    },
    currency: {
      required: true,
      type: 'string',
      enum: ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD']
    },
    payment_method: {
      required: true,
      type: 'string',
      enum: ['credit_card', 'debit_card', 'pix', 'bank_transfer', 'digital_wallet']
    },
    merchant_category: {
      required: true,
      type: 'string',
      enum: ['general', 'food', 'electronics', 'clothing', 'travel', 'healthcare', 'education']
    },
    merchant_id: {
      required: false,
      type: 'string',
      maxLength: 100
    },
    description: {
      required: false,
      type: 'string',
      maxLength: 500
    },
    metadata: {
      required: false
    },
    timestamp: {
      required: true,
      type: 'number',
      min: 0,
      custom: [{
        name: 'future_timestamp',
        message: 'Timestamp cannot be in the future',
        severity: 'warning',
        validate: (value: number) => value <= Date.now() + 60000 // Allow 1 minute future
      }]
    }
  };

  return Validator.validateObject(transaction, schema);
}

/**
 * Validate behavioral data
 */
export function validateBehavioralData(behavioral: BehavioralData): ValidationResult {
  const schema: Record<keyof BehavioralData, FieldValidationConfig<any>> = {
    mouse_velocity_avg: {
      required: false,
      type: 'number',
      min: 0,
      max: 10000
    },
    mouse_click_pressure: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },
    keystroke_dwell_time: {
      required: false,
      type: 'number',
      min: 0,
      max: 2000
    },
    typing_rhythm_score: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },
    scroll_pattern_score: {
      required: false,
      type: 'number',
      min: 0,
      max: 1
    },
    session_duration: {
      required: false,
      type: 'number',
      min: 0
    },
    overall_risk_score: {
      required: true,
      type: 'number',
      min: 0,
      max: 1
    },
    data_quality: {
      required: true,
      type: 'number',
      min: 0,
      max: 1
    },
    captured_at: {
      required: true,
      type: 'number',
      min: 0
    }
  };

  return Validator.validateObject(behavioral, schema);
}

/**
 * Validate user data
 */
export function validateUser(user: Partial<User>): ValidationResult {
  const schema: Record<string, FieldValidationConfig<any>> = {
    email: {
      required: true,
      type: 'email',
      maxLength: 255
    },
    name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100
    },
    role: {
      required: true,
      type: 'string',
      enum: ['user', 'admin', 'analyst', 'viewer']
    }
  };

  return Validator.validateObject(user, schema);
}

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(input: string): string {
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'];
  const allowedTagsRegex = new RegExp(`<(?!/?(?:${allowedTags.join('|')})\\b)[^>]*>`, 'gi');
  
  return input
    .replace(allowedTagsRegex, '') // Remove non-allowed tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript URLs
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

/**
 * Sanitize behavioral data to remove potential tracking information
 */
export function sanitizeBehavioralData(data: BehavioralData): BehavioralData {
  return {
    ...data,
    // Remove precise timing that could be used for fingerprinting
    captured_at: Math.floor(data.captured_at / 1000) * 1000, // Round to nearest second
    // Normalize values to prevent precise device identification
    mouse_velocity_avg: data.mouse_velocity_avg ? Math.round(data.mouse_velocity_avg * 10) / 10 : undefined,
    keystroke_dwell_time: data.keystroke_dwell_time ? Math.round(data.keystroke_dwell_time / 10) * 10 : undefined
  };
}

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

/**
 * Create validation middleware for API endpoints
 */
export function createValidationMiddleware<T>(
  validator: (data: T) => ValidationResult,
  options?: {
    allowWarnings?: boolean;
    sanitize?: boolean;
  }
) {
  return (data: T): T => {
    const result = validator(data);
    
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.map(e => e.message).join(', ')}`);
    }

    if (!options?.allowWarnings && result.warnings.length > 0) {
      console.warn('Validation warnings:', result.warnings);
    }

    // Apply sanitization if requested
    if (options?.sanitize && typeof data === 'object' && data !== null) {
      return sanitizeObject(data);
    }

    return data;
  };
}

/**
 * Sanitize object recursively
 */
function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }

  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (sanitized as any)[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      (sanitized as any)[key] = sanitizeObject(value);
    } else {
      (sanitized as any)[key] = value;
    }
  }

  return sanitized;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Check if IP address is valid
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Check if email domain is suspicious
 */
export function isSuspiciousEmailDomain(email: string): boolean {
  const suspiciousDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return suspiciousDomains.includes(domain);
}

/**
 * Validate credit card number (basic Luhn algorithm)
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s|-/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Validator class already exported above