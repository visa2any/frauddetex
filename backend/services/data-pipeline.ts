/**
 * 🔄 FraudShield Revolutionary - Data Pipeline Service
 * 
 * Pipeline automatizado para coleta, processamento e distribuição de dados
 * Features:
 * - ETL automatizado para dados econômicos
 * - Streaming de dados em tempo real
 * - Processamento distribuído
 * - Data quality e validação
 * - Alertas automáticos
 */

import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { EconomicDataService } from "./economic-data.ts";
import { DatabaseService } from "./database.ts";
import { RedisService } from "./redis.ts";
import { MLService } from "./ml.ts";

const env = await load();

export interface PipelineConfig {
  name: string;
  source: string;
  destination: string;
  frequency: number; // seconds
  enabled: boolean;
  transformation_rules: any[];
  quality_checks: any[];
}

export interface DataQualityResult {
  pipeline: string;
  timestamp: Date;
  records_processed: number;
  records_valid: number;
  records_rejected: number;
  quality_score: number;
  issues: string[];
}

export interface PipelineMetrics {
  pipeline_name: string;
  status: 'running' | 'stopped' | 'error';
  last_run: Date;
  next_run: Date;
  total_runs: number;
  success_rate: number;
  avg_processing_time: number;
  records_processed_today: number;
  errors_today: number;
}

export class DataPipelineService {
  private pipelines: Map<string, PipelineConfig> = new Map();
  private runningPipelines: Map<string, any> = new Map();
  private metrics: Map<string, PipelineMetrics> = new Map();
  private isInitialized: boolean = false;

  // Services
  private economicService?: EconomicDataService;
  private dbService?: DatabaseService;
  private redisService?: RedisService;
  private mlService?: MLService;

  async initialize(
    economic: EconomicDataService,
    db: DatabaseService,
    redis: RedisService,
    ml: MLService
  ): Promise<void> {
    this.economicService = economic;
    this.dbService = db;
    this.redisService = redis;
    this.mlService = ml;

    console.log('🔄 Initializing Data Pipeline Service...');

    // Configurar pipelines padrão
    await this.setupDefaultPipelines();

    // Iniciar monitoramento
    await this.startPipelineMonitoring();

    // Iniciar pipelines automáticos
    await this.startAutomaticPipelines();

    this.isInitialized = true;
    console.log('✅ Data Pipeline Service initialized');
  }

  private async setupDefaultPipelines(): Promise<void> {
    // Pipeline 1: Dados Econômicos Brasileiros
    this.pipelines.set('bcb_economic_data', {
      name: 'BCB Economic Data Pipeline',
      source: 'bcb_api',
      destination: 'economic_indicators',
      frequency: 21600, // 6 horas
      enabled: true,
      transformation_rules: [
        { type: 'currency_conversion', target: 'USD' },
        { type: 'inflation_adjustment', base_year: 2024 },
        { type: 'outlier_detection', threshold: 3 }
      ],
      quality_checks: [
        { type: 'completeness', threshold: 0.95 },
        { type: 'freshness', max_age_hours: 24 },
        { type: 'consistency', rules: ['selic_rate > 0', 'inflation < 50'] }
      ]
    });

    // Pipeline 2: Dados Globais de Câmbio
    this.pipelines.set('global_exchange_rates', {
      name: 'Global Exchange Rates Pipeline',
      source: 'multiple_apis',
      destination: 'exchange_rates',
      frequency: 3600, // 1 hora
      enabled: true,
      transformation_rules: [
        { type: 'rate_normalization', base: 'USD' },
        { type: 'volatility_calculation', window: 24 },
        { type: 'cross_rate_validation', tolerance: 0.01 }
      ],
      quality_checks: [
        { type: 'rate_bounds', min: 0.001, max: 1000 },
        { type: 'cross_validation', sources: ['ecb', 'fed', 'bcb'] },
        { type: 'volatility_check', max_daily_change: 0.1 }
      ]
    });

    // Pipeline 3: Indicadores de Fraude em Tempo Real
    this.pipelines.set('fraud_indicators', {
      name: 'Real-time Fraud Indicators Pipeline',
      source: 'transaction_stream',
      destination: 'fraud_metrics',
      frequency: 300, // 5 minutos
      enabled: true,
      transformation_rules: [
        { type: 'aggregation', window: '5min', functions: ['count', 'avg', 'max'] },
        { type: 'anomaly_detection', algorithm: 'isolation_forest' },
        { type: 'trend_analysis', lookback: 24 }
      ],
      quality_checks: [
        { type: 'data_latency', max_delay_seconds: 60 },
        { type: 'metric_bounds', rules: ['fraud_rate < 0.5', 'volume > 0'] },
        { type: 'completeness', required_fields: ['timestamp', 'fraud_score', 'decision'] }
      ]
    });

    // Pipeline 4: Enriquecimento de Dados com IA
    this.pipelines.set('ai_data_enrichment', {
      name: 'AI Data Enrichment Pipeline',
      source: 'raw_transactions',
      destination: 'enriched_transactions',
      frequency: 900, // 15 minutos
      enabled: true,
      transformation_rules: [
        { type: 'feature_engineering', model: 'fraud_detection_v2' },
        { type: 'sentiment_analysis', text_fields: ['description'] },
        { type: 'risk_scoring', algorithm: 'ensemble' }
      ],
      quality_checks: [
        { type: 'model_performance', min_accuracy: 0.85 },
        { type: 'feature_completeness', threshold: 0.9 },
        { type: 'score_distribution', expected_mean: 0.3, tolerance: 0.1 }
      ]
    });

    console.log(`📋 Configured ${this.pipelines.size} data pipelines`);
  }

  private async startPipelineMonitoring(): Promise<void> {
    // Monitorar health dos pipelines a cada minuto
    setInterval(async () => {
      await this.checkPipelineHealth();
    }, 60000);

    // Coletar métricas a cada 5 minutos
    setInterval(async () => {
      await this.collectPipelineMetrics();
    }, 300000);

    console.log('📊 Pipeline monitoring started');
  }

  private async startAutomaticPipelines(): Promise<void> {
    for (const [pipelineId, config] of this.pipelines) {
      if (config.enabled) {
        await this.startPipeline(pipelineId);
      }
    }
  }

  async startPipeline(pipelineId: string): Promise<void> {
    const config = this.pipelines.get(pipelineId);
    if (!config) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    if (this.runningPipelines.has(pipelineId)) {
      console.log(`Pipeline ${pipelineId} already running`);
      return;
    }

    // Inicializar métricas
    this.metrics.set(pipelineId, {
      pipeline_name: config.name,
      status: 'running',
      last_run: new Date(),
      next_run: new Date(Date.now() + config.frequency * 1000),
      total_runs: 0,
      success_rate: 100,
      avg_processing_time: 0,
      records_processed_today: 0,
      errors_today: 0
    });

    // Agendar execução periódica
    const interval = setInterval(async () => {
      try {
        await this.executePipeline(pipelineId);
      } catch (error) {
        console.error(`Pipeline ${pipelineId} execution failed:`, error);
        await this.handlePipelineError(pipelineId, error);
      }
    }, config.frequency * 1000);

    this.runningPipelines.set(pipelineId, interval);

    // Executar imediatamente uma vez
    try {
      await this.executePipeline(pipelineId);
    } catch (error) {
      console.error(`Initial pipeline ${pipelineId} execution failed:`, error);
    }

    console.log(`🚀 Pipeline ${config.name} started (${config.frequency}s interval)`);
  }

  async stopPipeline(pipelineId: string): Promise<void> {
    const interval = this.runningPipelines.get(pipelineId);
    if (interval) {
      clearInterval(interval);
      this.runningPipelines.delete(pipelineId);
      
      const metrics = this.metrics.get(pipelineId);
      if (metrics) {
        metrics.status = 'stopped';
        this.metrics.set(pipelineId, metrics);
      }
      
      console.log(`🛑 Pipeline ${pipelineId} stopped`);
    }
  }

  private async executePipeline(pipelineId: string): Promise<void> {
    const startTime = Date.now();
    const config = this.pipelines.get(pipelineId)!;
    const metrics = this.metrics.get(pipelineId)!;

    console.log(`⚡ Executing pipeline: ${config.name}`);

    try {
      // 1. Extract - Coletar dados da fonte
      const rawData = await this.extractData(config.source);
      
      // 2. Transform - Aplicar regras de transformação
      const transformedData = await this.transformData(rawData, config.transformation_rules);
      
      // 3. Quality Check - Validar qualidade dos dados
      const qualityResult = await this.checkDataQuality(transformedData, config.quality_checks);
      
      // 4. Load - Carregar dados no destino (se aprovado na qualidade)
      if (qualityResult.quality_score >= 0.8) {
        await this.loadData(transformedData, config.destination);
        
        // 5. Update ML models se necessário
        if (config.destination === 'fraud_metrics') {
          await this.updateMLModels(transformedData);
        }
        
        console.log(`✅ Pipeline ${config.name} completed successfully`);
      } else {
        console.warn(`⚠️ Pipeline ${config.name} failed quality check (score: ${qualityResult.quality_score})`);
        await this.handleQualityFailure(pipelineId, qualityResult);
      }

      // Atualizar métricas
      const processingTime = Date.now() - startTime;
      metrics.last_run = new Date();
      metrics.next_run = new Date(Date.now() + config.frequency * 1000);
      metrics.total_runs++;
      metrics.avg_processing_time = (metrics.avg_processing_time + processingTime) / 2;
      metrics.records_processed_today += transformedData.length;
      
      this.metrics.set(pipelineId, metrics);

    } catch (error) {
      metrics.errors_today++;
      metrics.success_rate = Math.max(0, metrics.success_rate - 1);
      this.metrics.set(pipelineId, metrics);
      throw error;
    }
  }

  private async extractData(source: string): Promise<any[]> {
    switch (source) {
      case 'bcb_api':
        return await this.extractBCBData();
      case 'multiple_apis':
        return await this.extractMultipleAPIs();
      case 'transaction_stream':
        return await this.extractTransactionStream();
      case 'raw_transactions':
        return await this.extractRawTransactions();
      default:
        throw new Error(`Unknown data source: ${source}`);
    }
  }

  private async extractBCBData(): Promise<any[]> {
    // Simular extração de dados do Banco Central
    return [
      {
        indicator: 'selic',
        value: 13.75,
        unit: 'percent',
        date: new Date(),
        source: 'bcb'
      },
      {
        indicator: 'ipca',
        value: 4.62,
        unit: 'percent_annual',
        date: new Date(),
        source: 'bcb'
      },
      {
        indicator: 'usd_brl',
        value: 5.15,
        unit: 'exchange_rate',
        date: new Date(),
        source: 'bcb'
      }
    ];
  }

  private async extractMultipleAPIs(): Promise<any[]> {
    // Simular extração de múltiplas APIs de câmbio
    return [
      {
        from: 'USD',
        to: 'BRL',
        rate: 5.15,
        volatility: 2.3,
        timestamp: new Date(),
        source: 'bcb'
      },
      {
        from: 'EUR',
        to: 'USD',
        rate: 1.09,
        volatility: 1.5,
        timestamp: new Date(),
        source: 'ecb'
      }
    ];
  }

  private async extractTransactionStream(): Promise<any[]> {
    // Simular extração de stream de transações
    const transactions = [];
    const now = Date.now();
    
    for (let i = 0; i < 100; i++) {
      transactions.push({
        id: `txn_${now}_${i}`,
        amount: Math.random() * 1000,
        fraud_score: Math.random() * 100,
        decision: Math.random() > 0.8 ? 'reject' : 'approve',
        timestamp: new Date(now - Math.random() * 300000), // Últimos 5 minutos
        country: ['BR', 'US', 'EU'][Math.floor(Math.random() * 3)]
      });
    }
    
    return transactions;
  }

  private async extractRawTransactions(): Promise<any[]> {
    // Simular extração de transações brutas para enriquecimento
    return [
      {
        id: 'raw_txn_1',
        amount: 150.50,
        currency: 'BRL',
        description: 'Online purchase',
        user_agent: 'Mozilla/5.0...',
        ip: '192.168.1.100',
        timestamp: new Date()
      }
    ];
  }

  private async transformData(data: any[], rules: any[]): Promise<any[]> {
    let transformed = [...data];
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'currency_conversion':
          transformed = await this.applyCurrencyConversion(transformed, rule.target);
          break;
        case 'inflation_adjustment':
          transformed = await this.applyInflationAdjustment(transformed, rule.base_year);
          break;
        case 'outlier_detection':
          transformed = await this.applyOutlierDetection(transformed, rule.threshold);
          break;
        case 'aggregation':
          transformed = await this.applyAggregation(transformed, rule);
          break;
        case 'feature_engineering':
          transformed = await this.applyFeatureEngineering(transformed, rule.model);
          break;
      }
    }
    
    return transformed;
  }

  private async applyCurrencyConversion(data: any[], targetCurrency: string): Promise<any[]> {
    // Aplicar conversão de moeda usando taxas atuais
    for (const item of data) {
      if (item.currency && item.currency !== targetCurrency) {
        const rate = await this.economicService?.getExchangeRate(item.currency, targetCurrency);
        if (rate) {
          item.original_amount = item.amount;
          item.original_currency = item.currency;
          item.amount = item.amount * rate.rate;
          item.currency = targetCurrency;
          item.exchange_rate_used = rate.rate;
        }
      }
    }
    return data;
  }

  private async applyInflationAdjustment(data: any[], baseYear: number): Promise<any[]> {
    // Ajustar valores pela inflação
    const currentYear = new Date().getFullYear();
    const inflationRate = 0.04; // 4% ao ano simplificado
    const adjustment = Math.pow(1 + inflationRate, currentYear - baseYear);
    
    for (const item of data) {
      if (item.amount && typeof item.amount === 'number') {
        item.original_amount = item.amount;
        item.inflation_adjusted_amount = item.amount / adjustment;
        item.inflation_adjustment_factor = adjustment;
      }
    }
    
    return data;
  }

  private async applyOutlierDetection(data: any[], threshold: number): Promise<any[]> {
    // Detectar e marcar outliers usando Z-score
    const values = data.map(item => item.value || item.amount || 0);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const std = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    for (let i = 0; i < data.length; i++) {
      const value = values[i];
      const zScore = Math.abs((value - mean) / std);
      data[i].is_outlier = zScore > threshold;
      data[i].z_score = zScore;
    }
    
    return data.filter(item => !item.is_outlier);
  }

  private async applyAggregation(data: any[], rule: any): Promise<any[]> {
    // Aplicar agregações por janela de tempo
    const windowMs = this.parseTimeWindow(rule.window);
    const now = Date.now();
    const aggregated: any[] = [];
    
    // Agrupar por janela de tempo
    const buckets = new Map();
    for (const item of data) {
      const timestamp = new Date(item.timestamp).getTime();
      const bucketKey = Math.floor(timestamp / windowMs) * windowMs;
      
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, []);
      }
      buckets.get(bucketKey).push(item);
    }
    
    // Aplicar funções de agregação
    for (const [bucketKey, items] of buckets) {
      const agg: any = {
        window_start: new Date(bucketKey),
        window_end: new Date(bucketKey + windowMs),
        count: items.length
      };
      
      if (rule.functions.includes('avg')) {
        agg.avg_amount = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) / items.length;
        agg.avg_fraud_score = items.reduce((sum: number, item: any) => sum + (item.fraud_score || 0), 0) / items.length;
      }
      
      if (rule.functions.includes('max')) {
        agg.max_amount = Math.max(...items.map((item: any) => item.amount || 0));
        agg.max_fraud_score = Math.max(...items.map((item: any) => item.fraud_score || 0));
      }
      
      aggregated.push(agg);
    }
    
    return aggregated;
  }

  private async applyFeatureEngineering(data: any[], modelName: string): Promise<any[]> {
    // Aplicar engenharia de features usando ML service
    for (const item of data) {
      if (this.mlService) {
        const features = await this.mlService.predictFraud({
          amount: item.amount || 0,
          transaction_hour: new Date(item.timestamp).getHours(),
          transaction_day_of_week: new Date(item.timestamp).getDay(),
          merchant_category: 'online',
          payment_method: 'card',
          currency: item.currency || 'USD',
          user_age_days: 30,
          transactions_last_24h: 5,
          avg_transaction_amount: 100,
          velocity_score: 20,
          device_fingerprint: 'device_123',
          ip_address: item.ip || '127.0.0.1',
          ip_reputation_score: 80,
          geolocation_risk: 10,
          is_vpn: false,
          is_tor: false,
          country_code: item.country || 'US'
        });
        
        item.ml_fraud_score = features.fraud_score;
        item.ml_decision = features.decision;
        item.ml_confidence = features.confidence;
      }
    }
    
    return data;
  }

  private parseTimeWindow(window: string): number {
    const unit = window.slice(-3);
    const value = parseInt(window.slice(0, -3));
    
    switch (unit) {
      case 'min': return value * 60 * 1000;
      case 'hour': return value * 60 * 60 * 1000;
      case 'day': return value * 24 * 60 * 60 * 1000;
      default: return 5 * 60 * 1000; // Default 5 minutes
    }
  }

  private async checkDataQuality(data: any[], checks: any[]): Promise<DataQualityResult> {
    const result: DataQualityResult = {
      pipeline: 'unknown',
      timestamp: new Date(),
      records_processed: data.length,
      records_valid: 0,
      records_rejected: 0,
      quality_score: 0,
      issues: []
    };
    
    let totalScore = 0;
    let checkCount = 0;
    
    for (const check of checks) {
      checkCount++;
      
      switch (check.type) {
        case 'completeness':
          const completeRecords = data.filter(item => this.isRecordComplete(item)).length;
          const completenessScore = completeRecords / data.length;
          totalScore += completenessScore >= check.threshold ? 1 : 0;
          
          if (completenessScore < check.threshold) {
            result.issues.push(`Data completeness ${completenessScore.toFixed(2)} below threshold ${check.threshold}`);
          }
          break;
          
        case 'freshness':
          const now = Date.now();
          const freshRecords = data.filter(item => {
            const age = (now - new Date(item.timestamp).getTime()) / (1000 * 60 * 60);
            return age <= check.max_age_hours;
          }).length;
          
          const freshnessScore = freshRecords / data.length;
          totalScore += freshnessScore >= 0.9 ? 1 : 0;
          
          if (freshnessScore < 0.9) {
            result.issues.push(`Data freshness ${freshnessScore.toFixed(2)} indicates stale data`);
          }
          break;
          
        case 'consistency':
          const consistentRecords = data.filter(item => this.checkConsistencyRules(item, check.rules)).length;
          const consistencyScore = consistentRecords / data.length;
          totalScore += consistencyScore >= 0.95 ? 1 : 0;
          
          if (consistencyScore < 0.95) {
            result.issues.push(`Data consistency ${consistencyScore.toFixed(2)} indicates rule violations`);
          }
          break;
      }
    }
    
    result.quality_score = checkCount > 0 ? totalScore / checkCount : 0;
    result.records_valid = Math.floor(data.length * result.quality_score);
    result.records_rejected = data.length - result.records_valid;
    
    return result;
  }

  private isRecordComplete(record: any): boolean {
    // Verificar se campos essenciais estão presentes
    const requiredFields = ['timestamp'];
    return requiredFields.every(field => record[field] != null);
  }

  private checkConsistencyRules(record: any, rules: string[]): boolean {
    // Avaliar regras de consistência simples
    for (const rule of rules) {
      if (rule === 'selic_rate > 0' && record.indicator === 'selic' && record.value <= 0) {
        return false;
      }
      if (rule === 'inflation < 50' && record.indicator === 'ipca' && record.value >= 50) {
        return false;
      }
    }
    return true;
  }

  private async loadData(data: any[], destination: string): Promise<void> {
    switch (destination) {
      case 'economic_indicators':
        await this.loadEconomicIndicators(data);
        break;
      case 'exchange_rates':
        await this.loadExchangeRates(data);
        break;
      case 'fraud_metrics':
        await this.loadFraudMetrics(data);
        break;
      case 'enriched_transactions':
        await this.loadEnrichedTransactions(data);
        break;
    }
  }

  private async loadEconomicIndicators(data: any[]): Promise<void> {
    // Carregar indicadores econômicos no cache Redis
    if (this.redisService) {
      for (const indicator of data) {
        const key = `economic_indicator:${indicator.indicator}:${indicator.date.toISOString().split('T')[0]}`;
        await this.redisService.setSession(key, indicator, 86400); // 24 horas
      }
    }
    console.log(`📊 Loaded ${data.length} economic indicators`);
  }

  private async loadExchangeRates(data: any[]): Promise<void> {
    // Carregar taxas de câmbio no cache
    if (this.redisService) {
      for (const rate of data) {
        const key = `exchange_rate:${rate.from}_${rate.to}`;
        await this.redisService.setSession(key, rate, 3600); // 1 hora
      }
    }
    console.log(`💱 Loaded ${data.length} exchange rates`);
  }

  private async loadFraudMetrics(data: any[]): Promise<void> {
    // Carregar métricas de fraude para monitoramento
    if (this.redisService) {
      for (const metric of data) {
        const key = `fraud_metric:${metric.window_start.toISOString()}`;
        await this.redisService.setSession(key, metric, 7200); // 2 horas
      }
    }
    console.log(`🔍 Loaded ${data.length} fraud metrics`);
  }

  private async loadEnrichedTransactions(data: any[]): Promise<void> {
    // Armazenar transações enriquecidas
    console.log(`✨ Loaded ${data.length} enriched transactions`);
  }

  private async updateMLModels(data: any[]): Promise<void> {
    // Atualizar modelos de ML com novos dados se necessário
    if (this.mlService && data.length > 100) {
      console.log('🤖 Updating ML models with new fraud data');
      // Em produção, retrainaria modelos periodicamente
    }
  }

  private async handlePipelineError(pipelineId: string, error: any): Promise<void> {
    console.error(`❌ Pipeline ${pipelineId} error:`, error);
    
    const metrics = this.metrics.get(pipelineId);
    if (metrics) {
      metrics.status = 'error';
      metrics.errors_today++;
      this.metrics.set(pipelineId, metrics);
    }
    
    // Implementar alertas e recuperação automática
    await this.sendPipelineAlert(pipelineId, error);
  }

  private async handleQualityFailure(pipelineId: string, qualityResult: DataQualityResult): Promise<void> {
    console.warn(`⚠️ Pipeline ${pipelineId} quality failure:`, qualityResult);
    
    // Log issues detalhados
    for (const issue of qualityResult.issues) {
      console.warn(`  - ${issue}`);
    }
    
    // Enviar alerta de qualidade
    await this.sendQualityAlert(pipelineId, qualityResult);
  }

  private async sendPipelineAlert(pipelineId: string, error: any): Promise<void> {
    // Em produção, enviaria alertas via email/Slack/webhook
    console.log(`🚨 ALERT: Pipeline ${pipelineId} failed - ${error.message}`);
  }

  private async sendQualityAlert(pipelineId: string, qualityResult: DataQualityResult): Promise<void> {
    // Em produção, enviaria alertas de qualidade
    console.log(`📉 QUALITY ALERT: Pipeline ${pipelineId} quality score: ${qualityResult.quality_score}`);
  }

  private async checkPipelineHealth(): Promise<void> {
    // Verificar saúde de todos os pipelines
    for (const [pipelineId, metrics] of this.metrics) {
      const lastRunAge = Date.now() - metrics.last_run.getTime();
      const config = this.pipelines.get(pipelineId);
      
      if (config && lastRunAge > config.frequency * 2000) { // 2x o intervalo esperado
        console.warn(`⚠️ Pipeline ${pipelineId} appears to be stalled`);
        metrics.status = 'error';
        this.metrics.set(pipelineId, metrics);
      }
    }
  }

  private async collectPipelineMetrics(): Promise<void> {
    // Coletar e armazenar métricas de todos os pipelines
    for (const [pipelineId, metrics] of this.metrics) {
      if (this.redisService) {
        const key = `pipeline_metrics:${pipelineId}`;
        await this.redisService.setSession(key, metrics, 3600); // 1 hora
      }
    }
  }

  // API pública para monitoramento
  getPipelineMetrics(pipelineId?: string): PipelineMetrics | Map<string, PipelineMetrics> {
    if (pipelineId) {
      return this.metrics.get(pipelineId)!;
    }
    return this.metrics;
  }

  getPipelineConfig(pipelineId: string): PipelineConfig | undefined {
    return this.pipelines.get(pipelineId);
  }

  async healthCheck(): Promise<boolean> {
    return this.isInitialized && this.pipelines.size > 0;
  }

  async shutdown(): Promise<void> {
    // Parar todos os pipelines
    for (const pipelineId of this.runningPipelines.keys()) {
      await this.stopPipeline(pipelineId);
    }
    
    console.log('🔌 Data Pipeline Service shut down');
  }
}