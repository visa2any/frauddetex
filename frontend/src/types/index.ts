/**
 * 🎯 FraudDetex - Core TypeScript Definitions
 * Enterprise-grade type safety for fraud detection system
 */

// ============================================================================
// USER AND AUTHENTICATION TYPES
// ============================================================================

export type UserRole = 'user' | 'admin' | 'analyst' | 'viewer';
export type PermissionType = 'read' | 'write' | 'admin' | 'analytics';

export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly permissions: Permission[];
  readonly preferences: UserPreferences;
  readonly createdAt: string;
  readonly lastLoginAt?: string;
  readonly isActive: boolean;
}

export interface Permission {
  readonly type: PermissionType;
  readonly resource: string;
  readonly granted: boolean;
}

export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: string;
  readonly timezone: string;
  readonly notifications: NotificationSettings;
}

export interface NotificationSettings {
  readonly email: boolean;
  readonly sms: boolean;
  readonly dashboard: boolean;
  readonly highRiskAlerts: boolean;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface AuthResult {
  readonly success: boolean;
  readonly user?: User;
  readonly token?: string;
  readonly refreshToken?: string;
  readonly expiresAt?: number;
  readonly error?: string;
}

// ============================================================================
// FRAUD DETECTION TYPES
// ============================================================================

export type FraudDecision = 'approve' | 'reject' | 'review';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'digital_wallet';
export type MerchantCategory = 'general' | 'food' | 'electronics' | 'clothing' | 'travel' | 'healthcare' | 'education';

export interface TransactionData {
  readonly transaction_id: string;
  readonly amount: number;
  readonly user_id: string;
  readonly currency: string;
  readonly payment_method: PaymentMethod;
  readonly merchant_category: MerchantCategory;
  readonly merchant_id?: string;
  readonly description?: string;
  readonly metadata?: Record<string, unknown>;
  readonly timestamp: number;
}

export interface FraudResult {
  readonly transaction_id: string;
  readonly fraud_score: number;
  readonly decision: FraudDecision;
  readonly confidence: number;
  readonly explanation: ExplanationFactor[];
  readonly processing_time_ms: number;
  readonly community_threat_score: number;
  readonly model_version: string;
  readonly timestamp: string;
  readonly cached: boolean;
}

export interface ExplanationFactor {
  readonly factor: string;
  readonly impact: number;
  readonly description: string;
  readonly category: 'behavioral' | 'transaction' | 'device' | 'network' | 'historical';
  readonly confidence: number;
}

// ============================================================================
// BEHAVIORAL BIOMETRICS TYPES
// ============================================================================

export interface BehavioralData {
  readonly mouse_velocity_avg?: number;
  readonly mouse_click_pressure?: number;
  readonly keystroke_dwell_time?: number;
  readonly typing_rhythm_score?: number;
  readonly scroll_pattern_score?: number;
  readonly session_duration?: number;
  readonly overall_risk_score: number;
  readonly data_quality: number;
  readonly captured_at: number;
}

export interface MouseEvent {
  readonly x: number;
  readonly y: number;
  readonly timestamp: number;
  readonly pressure?: number;
  readonly button?: number;
}

export interface KeystrokeEvent {
  readonly key: string;
  readonly timestamp: number;
  readonly dwellTime: number;
  readonly flightTime?: number;
}

export interface ScrollEvent {
  readonly deltaX: number;
  readonly deltaY: number;
  readonly timestamp: number;
  readonly velocity: number;
}

// ============================================================================
// MACHINE LEARNING TYPES
// ============================================================================

export interface MLFeatures {
  // Transaction features
  readonly amount: number;
  readonly transaction_hour: number;
  readonly transaction_day_of_week: number;
  readonly merchant_category: string;
  readonly payment_method: string;
  readonly currency: string;
  
  // User behavior features
  readonly user_age_days: number;
  readonly transactions_last_24h: number;
  readonly avg_transaction_amount: number;
  readonly velocity_score: number;
  
  // Device/IP features
  readonly device_fingerprint: string;
  readonly ip_address: string;
  readonly ip_reputation_score: number;
  readonly geolocation_risk: number;
  readonly is_vpn: boolean;
  readonly is_tor: boolean;
  readonly country_code: string;
  
  // Behavioral biometrics
  readonly mouse_velocity_avg?: number;
  readonly mouse_click_pressure?: number;
  readonly keystroke_dwell_time?: number;
  readonly typing_rhythm_score?: number;
  readonly scroll_pattern_score?: number;
  
  // Network features
  readonly community_threat_score: number;
  readonly similar_transaction_patterns: number;
  readonly email_age_days: number;
  readonly device_reputation_score: number;
}

export interface MLPrediction {
  readonly fraud_probability: number;
  readonly confidence: number;
  readonly feature_importance: Record<string, number>;
  readonly model_version: string;
  readonly processing_time_ms: number;
}

export interface ModelConfig {
  readonly modelUrl: string;
  readonly weightsUrl?: string;
  readonly version: string;
  readonly inputShape: number[];
  readonly outputShape: number[];
  readonly threshold: number;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface APIResponse<T = unknown> {
  readonly data: T;
  readonly success: boolean;
  readonly message?: string;
  readonly error?: APIError;
  readonly meta?: ResponseMeta;
}

export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: string;
}

export interface ResponseMeta {
  readonly pagination?: PaginationMeta;
  readonly rate_limit?: RateLimitMeta;
  readonly performance?: PerformanceMeta;
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly pages: number;
}

export interface RateLimitMeta {
  readonly limit: number;
  readonly remaining: number;
  readonly reset: number;
}

export interface PerformanceMeta {
  readonly request_id: string;
  readonly processing_time_ms: number;
  readonly cache_hit: boolean;
}

// ============================================================================
// DEVICE AND NETWORK TYPES
// ============================================================================

export interface DeviceFingerprint {
  readonly id: string;
  readonly userAgent: string;
  readonly screenResolution: string;
  readonly timezone: string;
  readonly language: string;
  readonly platform: string;
  readonly webgl_vendor?: string;
  readonly webgl_renderer?: string;
  readonly canvas_fingerprint?: string;
  readonly audio_fingerprint?: string;
  readonly fonts: string[];
  readonly plugins: string[];
  readonly created_at: number;
}

export interface NetworkInfo {
  readonly ip_address: string;
  readonly country_code: string;
  readonly region: string;
  readonly city: string;
  readonly isp: string;
  readonly is_vpn: boolean;
  readonly is_tor: boolean;
  readonly is_proxy: boolean;
  readonly reputation_score: number;
  readonly threat_types: string[];
}

// ============================================================================
// THREAT INTELLIGENCE TYPES
// ============================================================================

export interface ThreatData {
  readonly id: string;
  readonly threat_type: 'ip' | 'device' | 'email' | 'pattern';
  readonly indicator: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly confidence: number;
  readonly source: string;
  readonly description: string;
  readonly first_seen: string;
  readonly last_seen: string;
  readonly verified_count: number;
  readonly false_positive_count: number;
}

export interface CommunityThreat {
  readonly score: number;
  readonly threats: string[];
  readonly sources: string[];
  readonly last_updated: string;
}

// ============================================================================
// ANALYTICS AND METRICS TYPES
// ============================================================================

export interface FraudMetrics {
  readonly total_transactions: number;
  readonly fraud_detected: number;
  readonly fraud_rate: number;
  readonly avg_processing_time: number;
  readonly accuracy: number;
  readonly false_positive_rate: number;
  readonly false_negative_rate: number;
  readonly precision: number;
  readonly recall: number;
  readonly f1_score: number;
}

export interface SystemMetrics {
  readonly uptime: number;
  readonly cpu_usage: number;
  readonly memory_usage: number;
  readonly request_rate: number;
  readonly error_rate: number;
  readonly avg_response_time: number;
}

export interface AlertConfig {
  readonly id: string;
  readonly name: string;
  readonly condition: string;
  readonly threshold: number;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly enabled: boolean;
  readonly channels: ('email' | 'sms' | 'webhook')[];
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: ValidationError[];
  readonly warnings: ValidationWarning[];
}

export interface ValidationError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly value?: unknown;
}

export interface ValidationWarning {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly value?: unknown;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  readonly api: APIConfig;
  readonly ml: MLConfig;
  readonly security: SecurityConfig;
  readonly features: FeatureFlags;
  readonly monitoring: MonitoringConfig;
}

export interface APIConfig {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly rateLimit: number;
}

export interface MLConfig {
  readonly modelUrl: string;
  readonly confidenceThreshold: number;
  readonly batchSize: number;
  readonly maxFeatures: number;
  readonly modelUpdateInterval: number;
}

export interface SecurityConfig {
  readonly enableCSRF: boolean;
  readonly enableCORS: boolean;
  readonly maxRequestSize: number;
  readonly sessionTimeout: number;
  readonly passwordPolicy: PasswordPolicy;
}

export interface PasswordPolicy {
  readonly minLength: number;
  readonly requireUppercase: boolean;
  readonly requireLowercase: boolean;
  readonly requireNumbers: boolean;
  readonly requireSymbols: boolean;
}

export interface FeatureFlags {
  readonly behavioralBiometrics: boolean;
  readonly communityIntelligence: boolean;
  readonly edgeML: boolean;
  readonly realTimeAnalytics: boolean;
  readonly advancedReporting: boolean;
}

export interface MonitoringConfig {
  readonly enableMetrics: boolean;
  readonly enableLogging: boolean;
  readonly logLevel: 'debug' | 'info' | 'warn' | 'error';
  readonly metricsInterval: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Brand<T, B> = T & { readonly __brand: B };

export type TransactionId = Brand<string, 'TransactionId'>;
export type UserId = Brand<string, 'UserId'>;
export type DeviceId = Brand<string, 'DeviceId'>;
export type IPAddress = Brand<string, 'IPAddress'>;

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// Re-exports already available above