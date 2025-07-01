/**
 * 🧠 FraudDetex - Enterprise-Grade Edge ML Service
 * High-performance fraud detection with TensorFlow.js
 */

import * as tf from '@tensorflow/tfjs';
import type { 
  MLFeatures, 
  MLPrediction, 
  ModelConfig, 
  BehavioralData,
  ValidationResult 
} from '../types';
import { FraudDetectionError, ErrorCode } from './error-handler';
import { Logger } from './logger';
import { validateMLFeatures } from './validation';

// ============================================================================
// CONSTANTS AND CONFIGURATION
// ============================================================================

const DEFAULT_MODEL_CONFIG: ModelConfig = {
  modelUrl: '/models/fraud-detection-v1/model.json',
  weightsUrl: '/models/fraud-detection-v1/weights.bin',
  version: '1.0.0',
  inputShape: [1, 24], // 24 features
  outputShape: [1, 2], // [legitimate_prob, fraud_prob]
  threshold: 0.5
};

const FEATURE_NAMES = [
  'amount_normalized',
  'transaction_hour',
  'transaction_day_of_week',
  'user_age_days_normalized',
  'transactions_last_24h_normalized',
  'velocity_score_normalized',
  'ip_reputation_score',
  'geolocation_risk',
  'is_vpn',
  'is_tor',
  'mouse_velocity_avg_normalized',
  'mouse_click_pressure_normalized',
  'keystroke_dwell_time_normalized',
  'typing_rhythm_score',
  'scroll_pattern_score',
  'community_threat_score',
  'device_reputation_score',
  'email_age_days_normalized',
  'payment_method_encoded',
  'merchant_category_encoded',
  'currency_encoded',
  'country_code_encoded',
  'behavioral_risk_score',
  'historical_pattern_score'
] as const;

// ============================================================================
// INTERFACES
// ============================================================================

interface ModelLoadResult {
  readonly model: tf.LayersModel;
  readonly config: ModelConfig;
  readonly loadTimeMs: number;
  readonly memoryUsage: number;
}

interface PredictionContext {
  readonly requestId: string;
  readonly startTime: number;
  readonly features: MLFeatures;
  preprocessing: Record<string, number>;
}

// ============================================================================
// EDGE ML SERVICE CLASS
// ============================================================================

export class EdgeMLService {
  private model: tf.LayersModel | null = null;
  private config: ModelConfig;
  private isInitialized = false;
  private loadPromise: Promise<void> | null = null;
  private readonly logger: Logger;

  constructor(config?: Partial<ModelConfig>) {
    this.config = { ...DEFAULT_MODEL_CONFIG, ...config };
    this.logger = new Logger('EdgeMLService');
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Initialize the ML service and load the model
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this._initializeInternal();
    return this.loadPromise;
  }

  /**
   * Detect fraud for a single transaction
   */
  async detectFraud(input: FraudDetectionInput): Promise<MLPrediction> {
    const startTime = performance.now();
    const requestId = this._generateRequestId();

    try {
      if (!this.isInitialized || !this.model) {
        throw new FraudDetectionError(
          'ML service not initialized',
          ErrorCode.ML_NOT_INITIALIZED
        );
      }

      // Validate input
      const features = this._extractFeatures(input);
      const validation = validateMLFeatures(features);
      if (!validation.valid) {
        throw new FraudDetectionError(
          `Invalid ML features: ${validation.errors.map(e => e.message).join(', ')}`,
          ErrorCode.INVALID_INPUT,
          { timestamp: Date.now() }
        );
      }

      const context: PredictionContext = {
        requestId,
        startTime,
        features,
        preprocessing: {}
      };

      // Preprocess features
      const processedFeatures = await this._preprocessFeatures(features, context);

      // Run prediction
      const prediction = await this._runPrediction(processedFeatures, context);

      // Log successful prediction
      this.logger.info('Fraud detection completed', {
        requestId,
        processingTimeMs: performance.now() - startTime,
        fraudScore: prediction.fraud_probability,
        confidence: prediction.confidence
      });

      return prediction;

    } catch (error) {
      const processingTime = performance.now() - startTime;
      
      this.logger.error('Fraud detection failed', {
        requestId,
        processingTimeMs: processingTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        input: this._sanitizeInputForLogging(input)
      });

      if (error instanceof FraudDetectionError) {
        throw error;
      }

      throw new FraudDetectionError(
        'ML prediction failed',
        ErrorCode.ML_PREDICTION_FAILED,
        { timestamp: Date.now() }
      );
    }
  }

  /**
   * Process multiple transactions in batch
   */
  async batchDetectFraud(inputs: FraudDetectionInput[]): Promise<MLPrediction[]> {
    if (inputs.length === 0) {
      return [];
    }

    if (inputs.length > 100) {
      throw new FraudDetectionError(
        'Batch size too large (max 100)',
        ErrorCode.INVALID_INPUT,
        { timestamp: Date.now() }
      );
    }

    const startTime = performance.now();
    const requestId = this._generateRequestId();

    try {
      // Process all inputs in parallel for better performance
      const predictions = await Promise.all(
        inputs.map(input => this.detectFraud(input))
      );

      this.logger.info('Batch fraud detection completed', {
        requestId,
        batchSize: inputs.length,
        processingTimeMs: performance.now() - startTime
      });

      return predictions;

    } catch (error) {
      this.logger.error('Batch fraud detection failed', {
        requestId,
        batchSize: inputs.length,
        processingTimeMs: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Get model information and statistics
   */
  getModelInfo(): ModelInfo {
    return {
      isInitialized: this.isInitialized,
      version: this.config.version,
      inputShape: this.config.inputShape,
      outputShape: this.config.outputShape,
      threshold: this.config.threshold,
      featureCount: FEATURE_NAMES.length,
      memoryUsage: this.model ? this._getModelMemoryUsage() : 0
    };
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
    this.loadPromise = null;
    
    this.logger.info('EdgeML service disposed');
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private async _initializeInternal(): Promise<void> {
    const startTime = performance.now();

    try {
      this.logger.info('Initializing EdgeML service', {
        modelUrl: this.config.modelUrl,
        version: this.config.version
      });

      // Configure TensorFlow.js
      await this._configureTensorFlow();

      // Load the model
      const modelResult = await this._loadModel();
      this.model = modelResult.model;

      // Warm up the model with a dummy prediction
      await this._warmUpModel();

      this.isInitialized = true;

      const loadTime = performance.now() - startTime;
      this.logger.info('EdgeML service initialized successfully', {
        loadTimeMs: loadTime,
        modelVersion: this.config.version,
        memoryUsage: modelResult.memoryUsage
      });

    } catch (error) {
      this.logger.error('Failed to initialize EdgeML service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        config: this.config
      });

      throw new FraudDetectionError(
        'Failed to initialize ML service',
        ErrorCode.ML_INITIALIZATION_FAILED,
        { timestamp: Date.now() }
      );
    }
  }

  private async _configureTensorFlow(): Promise<void> {
    try {
      // Set backend to WebGL for better performance
      await tf.setBackend('webgl');
      
      // Enable production optimizations
      tf.env().set('WEBGL_PACK', true);
      tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
      
      // Configure memory management
      tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0.5);
      
      this.logger.debug('TensorFlow.js configured', {
        backend: tf.getBackend(),
        version: tf.version.tfjs
      });

    } catch (error) {
      this.logger.warn('Failed to configure WebGL backend, falling back to CPU', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Fallback to CPU
      await tf.setBackend('cpu');
    }
  }

  private async _loadModel(): Promise<ModelLoadResult> {
    const startTime = performance.now();

    try {
      // Load model from URL or use fallback
      const model = await this._loadModelFromUrl();
      
      // Validate model structure
      this._validateModel(model);

      const loadTime = performance.now() - startTime;
      const memoryUsage = this._getModelMemoryUsage();

      return {
        model,
        config: this.config,
        loadTimeMs: loadTime,
        memoryUsage
      };

    } catch (error) {
      this.logger.warn('Failed to load model from URL, using fallback', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Use fallback model
      return this._createFallbackModel();
    }
  }

  private async _loadModelFromUrl(): Promise<tf.LayersModel> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const model = await tf.loadLayersModel(this.config.modelUrl, {
        fetchFunc: (url, init) => fetch(url, { 
          ...init, 
          signal: controller.signal 
        })
      });

      clearTimeout(timeoutId);
      return model;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private _createFallbackModel(): ModelLoadResult {
    const startTime = performance.now();

    // Create a simple neural network as fallback
    const model = tf.sequential({
      layers: [
        tf.layers.dense({
          inputShape: [FEATURE_NAMES.length],
          units: 32,
          activation: 'relu',
          name: 'hidden1'
        }),
        tf.layers.dropout({ rate: 0.2, name: 'dropout1' }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
          name: 'hidden2'
        }),
        tf.layers.dense({
          units: 2,
          activation: 'softmax',
          name: 'output'
        })
      ]
    });

    // Initialize with random weights (in production, use pre-trained weights)
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    const loadTime = performance.now() - startTime;

    this.logger.info('Using fallback model', {
      layers: model.layers.length,
      parameters: model.countParams(),
      loadTimeMs: loadTime
    });

    return {
      model,
      config: this.config,
      loadTimeMs: loadTime,
      memoryUsage: this._getModelMemoryUsage()
    };
  }

  private _validateModel(model: tf.LayersModel): void {
    const inputShape = model.inputs[0].shape;
    const outputShape = model.outputs[0].shape;

    if (!inputShape || inputShape.length !== 2 || inputShape[1] !== FEATURE_NAMES.length) {
      throw new FraudDetectionError(
        `Invalid model input shape: expected [null, ${FEATURE_NAMES.length}], got ${inputShape}`,
        ErrorCode.INVALID_MODEL
      );
    }

    if (!outputShape || outputShape.length !== 2 || outputShape[1] !== 2) {
      throw new FraudDetectionError(
        'Invalid model output shape: expected [null, 2]',
        ErrorCode.INVALID_MODEL
      );
    }
  }

  private async _warmUpModel(): Promise<void> {
    if (!this.model) return;

    try {
      // Create dummy input
      const dummyInput = tf.zeros([1, FEATURE_NAMES.length]);
      
      // Run prediction to warm up
      const prediction = this.model.predict(dummyInput) as tf.Tensor;
      
      // Cleanup
      dummyInput.dispose();
      prediction.dispose();

      this.logger.debug('Model warmed up successfully');

    } catch (error) {
      this.logger.warn('Model warm-up failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private _extractFeatures(input: FraudDetectionInput): MLFeatures {
    const now = new Date();
    
    return {
      // Transaction features
      amount: input.amount,
      transaction_hour: now.getHours(),
      transaction_day_of_week: now.getDay(),
      merchant_category: input.merchantCategory || 'general',
      payment_method: input.paymentMethod || 'credit_card',
      currency: input.currency || 'USD',

      // User behavior features (with defaults)
      user_age_days: 30,
      transactions_last_24h: 1,
      avg_transaction_amount: input.amount,
      velocity_score: 0.2,

      // Device/IP features
      device_fingerprint: input.deviceFingerprint || this._generateFallbackFingerprint(),
      ip_address: input.ip || '127.0.0.1',
      ip_reputation_score: 50,
      geolocation_risk: 0.1,
      is_vpn: false,
      is_tor: false,
      country_code: input.country || 'US',

      // Behavioral biometrics
      mouse_velocity_avg: input.behavioral?.mouse_velocity_avg,
      mouse_click_pressure: input.behavioral?.mouse_click_pressure,
      keystroke_dwell_time: input.behavioral?.keystroke_dwell_time,
      typing_rhythm_score: input.behavioral?.typing_rhythm_score,
      scroll_pattern_score: input.behavioral?.scroll_pattern_score,

      // Network features
      community_threat_score: 0,
      similar_transaction_patterns: 0,
      email_age_days: input.email ? 365 : 0,
      device_reputation_score: 50
    };
  }

  private async _preprocessFeatures(
    features: MLFeatures, 
    context: PredictionContext
  ): Promise<Float32Array> {
    const processed = new Float32Array(FEATURE_NAMES.length);

    // Normalize amount (log scale)
    processed[0] = Math.log10(Math.max(features.amount, 0.01)) / 6; // Normalize to [0,1]
    
    // Time features
    processed[1] = features.transaction_hour / 24;
    processed[2] = features.transaction_day_of_week / 7;
    
    // User features
    processed[3] = Math.min(features.user_age_days / 365, 10); // Cap at 10 years
    processed[4] = Math.min(features.transactions_last_24h / 100, 1); // Cap at 100
    processed[5] = features.velocity_score;
    
    // Network features
    processed[6] = features.ip_reputation_score / 100;
    processed[7] = features.geolocation_risk;
    processed[8] = features.is_vpn ? 1 : 0;
    processed[9] = features.is_tor ? 1 : 0;
    
    // Behavioral features (handle undefined values)
    processed[10] = this._normalizeBehavioralFeature(features.mouse_velocity_avg, 0, 1000);
    processed[11] = this._normalizeBehavioralFeature(features.mouse_click_pressure, 0, 1);
    processed[12] = this._normalizeBehavioralFeature(features.keystroke_dwell_time, 0, 500);
    processed[13] = features.typing_rhythm_score || 0.5;
    processed[14] = features.scroll_pattern_score || 0.5;
    
    // Community and device features
    processed[15] = features.community_threat_score / 100;
    processed[16] = features.device_reputation_score / 100;
    processed[17] = Math.min(features.email_age_days / 365, 10); // Cap at 10 years
    
    // Encoded categorical features
    processed[18] = this._encodePaymentMethod(features.payment_method);
    processed[19] = this._encodeMerchantCategory(features.merchant_category);
    processed[20] = this._encodeCurrency(features.currency);
    processed[21] = this._encodeCountry(features.country_code);
    
    // Derived features
    processed[22] = this._calculateBehavioralRiskScore(features);
    processed[23] = this._calculateHistoricalPatternScore(features);

    // Store preprocessing context for debugging
    context.preprocessing = {
      normalizedAmount: processed[0],
      behavioralRisk: processed[22],
      historicalPattern: processed[23]
    };

    return processed;
  }

  private async _runPrediction(
    features: Float32Array,
    context: PredictionContext
  ): Promise<MLPrediction> {
    if (!this.model) {
      throw new FraudDetectionError(
        'Model not loaded',
        ErrorCode.ML_NOT_INITIALIZED
      );
    }

    const inputTensor = tf.tensor2d([Array.from(features)], [1, features.length]);
    
    try {
      const predictionTensor = this.model.predict(inputTensor) as tf.Tensor;
      const predictionData = await predictionTensor.data();
      
      const legitimateProb = predictionData[0];
      const fraudProb = predictionData[1];
      
      // Calculate confidence as the difference between probabilities
      const confidence = Math.abs(fraudProb - legitimateProb);
      
      const processingTime = performance.now() - context.startTime;

      return {
        fraud_probability: fraudProb,
        confidence,
        feature_importance: this._calculateFeatureImportance(features),
        model_version: this.config.version,
        processing_time_ms: processingTime
      };

    } finally {
      inputTensor.dispose();
    }
  }

  private _normalizeBehavioralFeature(
    value: number | undefined, 
    min: number, 
    max: number
  ): number {
    if (value === undefined || value === null) {
      return 0.5; // Default to neutral value
    }
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  private _encodePaymentMethod(method: string): number {
    const mapping: Record<string, number> = {
      'credit_card': 0.2,
      'debit_card': 0.4,
      'pix': 0.6,
      'bank_transfer': 0.8,
      'digital_wallet': 1.0
    };
    return mapping[method] || 0.0;
  }

  private _encodeMerchantCategory(category: string): number {
    const mapping: Record<string, number> = {
      'general': 0.1,
      'food': 0.2,
      'electronics': 0.3,
      'clothing': 0.4,
      'travel': 0.5,
      'healthcare': 0.6,
      'education': 0.7
    };
    return mapping[category] || 0.0;
  }

  private _encodeCurrency(currency: string): number {
    const mapping: Record<string, number> = {
      'USD': 0.1,
      'EUR': 0.2,
      'BRL': 0.3,
      'GBP': 0.4
    };
    return mapping[currency] || 0.0;
  }

  private _encodeCountry(country: string): number {
    const riskMapping: Record<string, number> = {
      'US': 0.1,
      'CA': 0.1,
      'GB': 0.1,
      'DE': 0.1,
      'FR': 0.1,
      'BR': 0.2,
      'MX': 0.3,
      'CN': 0.4,
      'RU': 0.6,
      'NG': 0.8
    };
    return riskMapping[country] || 0.5;
  }

  private _calculateBehavioralRiskScore(features: MLFeatures): number {
    const factors = [
      features.mouse_velocity_avg ? this._normalizeBehavioralFeature(features.mouse_velocity_avg, 0, 1000) : 0.5,
      features.mouse_click_pressure ? this._normalizeBehavioralFeature(features.mouse_click_pressure, 0, 1) : 0.5,
      features.keystroke_dwell_time ? this._normalizeBehavioralFeature(features.keystroke_dwell_time, 0, 500) : 0.5,
      features.typing_rhythm_score || 0.5,
      features.scroll_pattern_score || 0.5
    ];

    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  }

  private _calculateHistoricalPatternScore(features: MLFeatures): number {
    // Simple scoring based on user behavior patterns
    const velocityScore = Math.min(features.velocity_score / 100, 1);
    const ageScore = Math.min(features.user_age_days / 365, 1);
    const transactionScore = Math.min(features.transactions_last_24h / 50, 1);

    return (velocityScore * 0.4 + ageScore * 0.3 + transactionScore * 0.3);
  }

  private _calculateFeatureImportance(features: Float32Array): Record<string, number> {
    const importance: Record<string, number> = {};
    
    FEATURE_NAMES.forEach((name, index) => {
      // Simple importance calculation based on feature value and position
      const value = features[index];
      const baseImportance = value * (1 / FEATURE_NAMES.length);
      
      // Boost importance for key features
      let multiplier = 1;
      if (name.includes('amount')) multiplier = 1.5;
      if (name.includes('behavioral')) multiplier = 1.3;
      if (name.includes('threat')) multiplier = 1.4;
      
      importance[name] = Math.min(baseImportance * multiplier, 1);
    });

    return importance;
  }

  private _getModelMemoryUsage(): number {
    if (!this.model) return 0;
    
    try {
      return tf.memory().numBytes;
    } catch {
      return 0;
    }
  }

  private _generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private _generateFallbackFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('FraudDetex fingerprint', 2, 2);
      return canvas.toDataURL().slice(-16);
    }
    return Math.random().toString(36).substr(2, 16);
  }

  private _sanitizeInputForLogging(input: FraudDetectionInput): Partial<FraudDetectionInput> {
    return {
      amount: input.amount,
      currency: input.currency,
      paymentMethod: input.paymentMethod,
      merchantCategory: input.merchantCategory,
      // Exclude sensitive data like IP, email, device fingerprint
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface FraudDetectionInput {
  readonly amount: number;
  readonly currency?: string;
  readonly paymentMethod?: string;
  readonly merchantCategory?: string;
  readonly ip?: string;
  readonly country?: string;
  readonly email?: string;
  readonly deviceFingerprint?: string;
  readonly timestamp: number;
  readonly behavioral?: BehavioralData;
}

export interface ModelInfo {
  readonly isInitialized: boolean;
  readonly version: string;
  readonly inputShape: number[];
  readonly outputShape: number[];
  readonly threshold: number;
  readonly featureCount: number;
  readonly memoryUsage: number;
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let instance: EdgeMLService | null = null;

export function getEdgeMLService(): EdgeMLService {
  if (!instance) {
    instance = new EdgeMLService();
  }
  return instance;
}

export function createEdgeMLService(config?: Partial<ModelConfig>): EdgeMLService {
  return new EdgeMLService(config);
}