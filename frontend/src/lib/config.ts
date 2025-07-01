/**
 * ⚙️ FraudDetex - Enterprise Configuration Management
 * Environment-specific configuration and feature flags
 */

import type { ModelConfig } from '../types';
import { Logger } from './logger';

// ============================================================================
// CONFIGURATION INTERFACES
// ============================================================================

export interface AppConfig {
  readonly app: {
    readonly name: string;
    readonly version: string;
    readonly environment: 'development' | 'staging' | 'production';
    readonly baseUrl: string;
    readonly apiUrl: string;
  };
  readonly fraud: {
    readonly model: ModelConfig;
    readonly thresholds: {
      readonly lowRisk: number;
      readonly mediumRisk: number;
      readonly highRisk: number;
    };
    readonly features: {
      readonly behavioralBiometrics: boolean;
      readonly communityIntelligence: boolean;
      readonly edgeProcessing: boolean;
      readonly explainableAI: boolean;
    };
  };
  readonly security: {
    readonly tokenExpiry: number;
    readonly maxLoginAttempts: number;
    readonly sessionTimeout: number;
    readonly enableCSRF: boolean;
  };
  readonly logging: {
    readonly level: 'debug' | 'info' | 'warn' | 'error';
    readonly enableConsole: boolean;
    readonly enableRemote: boolean;
    readonly endpoint?: string;
  };
  readonly performance: {
    readonly maxConcurrentRequests: number;
    readonly requestTimeout: number;
    readonly cacheTimeout: number;
  };
}

// ============================================================================
// CONFIGURATION PROVIDER
// ============================================================================

export class ConfigService {
  private static instance: ConfigService | null = null;
  private config: AppConfig;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger('ConfigService');
    this.config = this.loadConfiguration();
    this.validateConfiguration();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Get complete configuration
   */
  getConfig(): AppConfig {
    return this.config;
  }

  /**
   * Get application configuration
   */
  getAppConfig() {
    return this.config.app;
  }

  /**
   * Get fraud detection configuration
   */
  getFraudConfig() {
    return this.config.fraud;
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return this.config.security;
  }

  /**
   * Get logging configuration
   */
  getLoggingConfig() {
    return this.config.logging;
  }

  /**
   * Get performance configuration
   */
  getPerformanceConfig() {
    return this.config.performance;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['fraud']['features']): boolean {
    return this.config.fraud.features[feature];
  }

  /**
   * Get environment
   */
  getEnvironment(): string {
    return this.config.app.environment;
  }

  /**
   * Check if in production
   */
  isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  /**
   * Check if in development
   */
  isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private loadConfiguration(): AppConfig {
    const environment = this.getEnvironmentFromProcess();
    
    // Base configuration
    const baseConfig: AppConfig = {
      app: {
        name: 'FraudDetex',
        version: '1.0.0',
        environment,
        baseUrl: this.getEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
        apiUrl: this.getEnvVar('NEXT_PUBLIC_API_URL', '/api')
      },
      fraud: {
        model: {
          modelUrl: this.getEnvVar('NEXT_PUBLIC_MODEL_URL', '/models/fraud-detection-v1/model.json'),
          weightsUrl: this.getEnvVar('NEXT_PUBLIC_WEIGHTS_URL', '/models/fraud-detection-v1/weights.bin'),
          version: '1.0.0',
          inputShape: [1, 24],
          outputShape: [1, 2],
          threshold: parseFloat(this.getEnvVar('FRAUD_THRESHOLD', '0.5'))
        },
        thresholds: {
          lowRisk: parseFloat(this.getEnvVar('LOW_RISK_THRESHOLD', '30')),
          mediumRisk: parseFloat(this.getEnvVar('MEDIUM_RISK_THRESHOLD', '70')),
          highRisk: parseFloat(this.getEnvVar('HIGH_RISK_THRESHOLD', '90'))
        },
        features: {
          behavioralBiometrics: this.getBooleanEnvVar('ENABLE_BEHAVIORAL_BIOMETRICS', true),
          communityIntelligence: this.getBooleanEnvVar('ENABLE_COMMUNITY_INTEL', true),
          edgeProcessing: this.getBooleanEnvVar('ENABLE_EDGE_PROCESSING', true),
          explainableAI: this.getBooleanEnvVar('ENABLE_EXPLAINABLE_AI', true)
        }
      },
      security: {
        tokenExpiry: parseInt(this.getEnvVar('TOKEN_EXPIRY_HOURS', '24')) * 60 * 60 * 1000,
        maxLoginAttempts: parseInt(this.getEnvVar('MAX_LOGIN_ATTEMPTS', '5')),
        sessionTimeout: parseInt(this.getEnvVar('SESSION_TIMEOUT_MINUTES', '30')) * 60 * 1000,
        enableCSRF: this.getBooleanEnvVar('ENABLE_CSRF', true)
      },
      logging: {
        level: this.getEnvVar('LOG_LEVEL', environment === 'development' ? 'debug' : 'info') as any,
        enableConsole: this.getBooleanEnvVar('ENABLE_CONSOLE_LOGGING', true),
        enableRemote: this.getBooleanEnvVar('ENABLE_REMOTE_LOGGING', environment === 'production'),
        endpoint: this.getEnvVar('LOGGING_ENDPOINT', undefined)
      },
      performance: {
        maxConcurrentRequests: parseInt(this.getEnvVar('MAX_CONCURRENT_REQUESTS', '10')),
        requestTimeout: parseInt(this.getEnvVar('REQUEST_TIMEOUT_MS', '30000')),
        cacheTimeout: parseInt(this.getEnvVar('CACHE_TIMEOUT_MS', '300000'))
      }
    };

    // Environment-specific overrides
    switch (environment) {
      case 'development':
        return this.applyDevelopmentOverrides(baseConfig);
      case 'staging':
        return this.applyStagingOverrides(baseConfig);
      case 'production':
        return this.applyProductionOverrides(baseConfig);
      default:
        return baseConfig;
    }
  }

  private applyDevelopmentOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      logging: {
        ...config.logging,
        level: 'debug',
        enableConsole: true,
        enableRemote: false
      },
      fraud: {
        ...config.fraud,
        thresholds: {
          lowRisk: 20, // Lower thresholds for testing
          mediumRisk: 50,
          highRisk: 80
        }
      }
    };
  }

  private applyStagingOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      logging: {
        ...config.logging,
        level: 'info',
        enableRemote: true
      }
    };
  }

  private applyProductionOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      logging: {
        ...config.logging,
        level: 'warn',
        enableConsole: false,
        enableRemote: true
      },
      security: {
        ...config.security,
        maxLoginAttempts: 3, // Stricter in production
        sessionTimeout: 15 * 60 * 1000 // 15 minutes
      }
    };
  }

  private validateConfiguration(): void {
    try {
      // Validate required configurations
      if (!this.config.app.name || !this.config.app.version) {
        throw new Error('App name and version are required');
      }

      if (this.config.fraud.thresholds.lowRisk >= this.config.fraud.thresholds.mediumRisk) {
        throw new Error('Low risk threshold must be less than medium risk threshold');
      }

      if (this.config.fraud.thresholds.mediumRisk >= this.config.fraud.thresholds.highRisk) {
        throw new Error('Medium risk threshold must be less than high risk threshold');
      }

      if (this.config.security.tokenExpiry <= 0) {
        throw new Error('Token expiry must be positive');
      }

      this.logger.info('Configuration validated successfully', {
        environment: this.config.app.environment,
        version: this.config.app.version
      });

    } catch (error) {
      this.logger.error('Configuration validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private getEnvironmentFromProcess(): 'development' | 'staging' | 'production' {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') return 'production';
    if (process.env.NEXT_PUBLIC_ENV === 'staging') return 'staging';
    return 'development';
  }

  private getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (value !== undefined) {
      return value;
    }
    
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    
    throw new Error(`Required environment variable ${key} is not set`);
  }

  private getBooleanEnvVar(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    
    return value.toLowerCase() === 'true' || value === '1';
  }
}

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export class FeatureFlags {
  private config: ConfigService;

  constructor() {
    this.config = ConfigService.getInstance();
  }

  /**
   * Check if behavioral biometrics is enabled
   */
  isBehavioralBiometricsEnabled(): boolean {
    return this.config.isFeatureEnabled('behavioralBiometrics');
  }

  /**
   * Check if community intelligence is enabled
   */
  isCommunityIntelligenceEnabled(): boolean {
    return this.config.isFeatureEnabled('communityIntelligence');
  }

  /**
   * Check if edge processing is enabled
   */
  isEdgeProcessingEnabled(): boolean {
    return this.config.isFeatureEnabled('edgeProcessing');
  }

  /**
   * Check if explainable AI is enabled
   */
  isExplainableAIEnabled(): boolean {
    return this.config.isFeatureEnabled('explainableAI');
  }
}

// ============================================================================
// SINGLETON EXPORTS
// ============================================================================

export const configService = ConfigService.getInstance();
export const featureFlags = new FeatureFlags();

export default configService;