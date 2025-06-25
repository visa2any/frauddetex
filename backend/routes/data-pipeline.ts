/**
 * 🔄 FraudShield Revolutionary - Data Pipeline Routes
 * 
 * API endpoints para monitoramento e controle do pipeline de dados
 * Features:
 * - Status e métricas de pipelines
 * - Controle de execução (start/stop)
 * - Monitoramento de qualidade de dados
 * - Alertas e notificações
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { DataPipelineService } from "../services/data-pipeline.ts";
import { RedisService } from "../services/redis.ts";

export const dataPipelineRoutes = new Router();

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class PipelineError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PipelineError';
  }
}

// Service instances
let pipelineService: DataPipelineService;
let redisService: RedisService;

export function initializeDataPipelineServices(pipeline: DataPipelineService, redis: RedisService) {
  pipelineService = pipeline;
  redisService = redis;
}

/**
 * GET /api/v1/data-pipeline/status
 * Obter status geral de todos os pipelines
 */
dataPipelineRoutes.get("/status", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    // Verificar permissões (apenas admins podem ver pipelines)
    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { 
        error: "Insufficient permissions",
        message: "Data pipeline access requires Enterprise or Insurance plan"
      };
      return;
    }

    const allMetrics = pipelineService.getPipelineMetrics() as Map<string, any>;
    const pipelinesArray = Array.from(allMetrics.entries()).map(([id, metrics]) => ({
      pipeline_id: id,
      ...metrics
    }));

    // Calcular estatísticas gerais
    const totalPipelines = pipelinesArray.length;
    const runningPipelines = pipelinesArray.filter(p => p.status === 'running').length;
    const errorPipelines = pipelinesArray.filter(p => p.status === 'error').length;
    const avgSuccessRate = totalPipelines > 0 ? 
      pipelinesArray.reduce((sum, p) => sum + p.success_rate, 0) / totalPipelines : 0;

    ctx.response.body = {
      overview: {
        total_pipelines: totalPipelines,
        running_pipelines: runningPipelines,
        stopped_pipelines: totalPipelines - runningPipelines - errorPipelines,
        error_pipelines: errorPipelines,
        overall_health: errorPipelines === 0 ? 'healthy' : errorPipelines < totalPipelines * 0.2 ? 'degraded' : 'critical',
        avg_success_rate: Math.round(avgSuccessRate * 100) / 100
      },
      pipelines: pipelinesArray.sort((a, b) => b.records_processed_today - a.records_processed_today),
      last_updated: new Date().toISOString()
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "PipelineStatusError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/data-pipeline/:pipelineId
 * Obter detalhes de um pipeline específico
 */
dataPipelineRoutes.get("/:pipelineId", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const pipelineId = ctx.params.pipelineId;
    const metrics = pipelineService.getPipelineMetrics(pipelineId) as any;
    const config = pipelineService.getPipelineConfig(pipelineId);

    if (!metrics || !config) {
      ctx.response.status = 404;
      ctx.response.body = {
        error: "PipelineNotFound",
        message: `Pipeline ${pipelineId} not found`
      };
      return;
    }

    // Buscar métricas históricas
    const historicalMetrics = await getHistoricalMetrics(pipelineId);
    
    // Buscar logs recentes
    const recentLogs = await getRecentLogs(pipelineId);

    const pipelineDetails = {
      pipeline_id: pipelineId,
      configuration: {
        name: config.name,
        source: config.source,
        destination: config.destination,
        frequency_seconds: config.frequency,
        enabled: config.enabled,
        transformation_rules: config.transformation_rules.length,
        quality_checks: config.quality_checks.length
      },
      current_metrics: metrics,
      performance: {
        uptime_percentage: calculateUptimePercentage(metrics),
        avg_processing_time_ms: metrics.avg_processing_time,
        records_per_hour: calculateRecordsPerHour(metrics),
        error_rate_percentage: calculateErrorRate(metrics)
      },
      historical_metrics: historicalMetrics,
      recent_logs: recentLogs,
      health_indicators: {
        data_freshness: calculateDataFreshness(metrics.last_run),
        processing_speed: metrics.avg_processing_time < 30000 ? 'fast' : 'slow',
        reliability: metrics.success_rate > 95 ? 'high' : metrics.success_rate > 85 ? 'medium' : 'low',
        data_quality: await getDataQualityScore(pipelineId)
      }
    };

    ctx.response.body = pipelineDetails;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "PipelineDetailsError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/data-pipeline/:pipelineId/start
 * Iniciar um pipeline
 */
dataPipelineRoutes.post("/:pipelineId/start", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const pipelineId = ctx.params.pipelineId;
    
    try {
      await pipelineService.startPipeline(pipelineId);
      
      console.log(`User ${user.email} started pipeline ${pipelineId}`);
      
      ctx.response.body = {
        message: "Pipeline started successfully",
        pipeline_id: pipelineId,
        status: "running",
        started_by: user.email,
        started_at: new Date().toISOString()
      };

    } catch (error) {
      throw new PipelineError(`Failed to start pipeline: ${error.message}`);
    }

  } catch (error) {
    if (error instanceof PipelineError) {
      ctx.response.status = 400;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = {
      error: error.name || "PipelineControlError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/data-pipeline/:pipelineId/stop
 * Parar um pipeline
 */
dataPipelineRoutes.post("/:pipelineId/stop", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const pipelineId = ctx.params.pipelineId;
    
    try {
      await pipelineService.stopPipeline(pipelineId);
      
      console.log(`User ${user.email} stopped pipeline ${pipelineId}`);
      
      ctx.response.body = {
        message: "Pipeline stopped successfully",
        pipeline_id: pipelineId,
        status: "stopped",
        stopped_by: user.email,
        stopped_at: new Date().toISOString()
      };

    } catch (error) {
      throw new PipelineError(`Failed to stop pipeline: ${error.message}`);
    }

  } catch (error) {
    if (error instanceof PipelineError) {
      ctx.response.status = 400;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = {
      error: error.name || "PipelineControlError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/data-pipeline/quality/report
 * Relatório de qualidade de dados
 */
dataPipelineRoutes.get("/quality/report", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const url = new URL(ctx.request.url);
    const timeframe = url.searchParams.get("timeframe") || "24h"; // 24h, 7d, 30d
    const pipelineFilter = url.searchParams.get("pipeline");

    // Gerar relatório de qualidade
    const qualityReport = await generateQualityReport(timeframe, pipelineFilter);

    ctx.response.body = qualityReport;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "QualityReportError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/data-pipeline/metrics/dashboard
 * Dashboard de métricas consolidadas
 */
dataPipelineRoutes.get("/metrics/dashboard", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const dashboard = await generateMetricsDashboard();

    ctx.response.body = dashboard;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "DashboardError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/data-pipeline/alerts
 * Obter alertas ativos dos pipelines
 */
dataPipelineRoutes.get("/alerts", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const alerts = await getPipelineAlerts();

    ctx.response.body = {
      alerts: alerts,
      total_active: alerts.length,
      severity_breakdown: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length
      },
      last_updated: new Date().toISOString()
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "AlertsError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/data-pipeline/alerts/:alertId/acknowledge
 * Confirmar conhecimento de um alerta
 */
dataPipelineRoutes.post("/alerts/:alertId/acknowledge", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const alertId = ctx.params.alertId;
    const requestBody = await ctx.request.body({ type: "json" }).value;

    // Registrar confirmação do alerta
    await acknowledgeAlert(alertId, user.id, requestBody.comment || '');

    console.log(`User ${user.email} acknowledged alert ${alertId}`);

    ctx.response.body = {
      message: "Alert acknowledged successfully",
      alert_id: alertId,
      acknowledged_by: user.email,
      acknowledged_at: new Date().toISOString(),
      comment: requestBody.comment || null
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "AlertAcknowledgeError",
      message: error.message
    };
  }
});

// Helper functions

async function getHistoricalMetrics(pipelineId: string): Promise<any[]> {
  // Simular métricas históricas dos últimos 7 dias
  const metrics = [];
  const now = Date.now();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    metrics.push({
      date: date.toISOString().split('T')[0],
      runs: Math.floor(Math.random() * 10) + 20,
      success_rate: Math.floor(Math.random() * 20) + 80,
      avg_processing_time: Math.floor(Math.random() * 10000) + 15000,
      records_processed: Math.floor(Math.random() * 5000) + 10000,
      errors: Math.floor(Math.random() * 5)
    });
  }
  
  return metrics;
}

async function getRecentLogs(pipelineId: string): Promise<any[]> {
  // Simular logs recentes
  return [
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      level: 'INFO',
      message: 'Pipeline execution completed successfully',
      records_processed: 1250,
      processing_time_ms: 18500
    },
    {
      timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
      level: 'INFO',
      message: 'Starting pipeline execution',
      records_expected: 1200
    },
    {
      timestamp: new Date(Date.now() - 125 * 60 * 1000).toISOString(),
      level: 'WARN',
      message: 'Data quality check threshold barely met',
      quality_score: 0.82,
      threshold: 0.8
    }
  ];
}

function calculateUptimePercentage(metrics: any): number {
  // Calcular uptime baseado em runs vs errors
  const totalRuns = metrics.total_runs || 1;
  const errors = metrics.errors_today || 0;
  return Math.round(((totalRuns - errors) / totalRuns) * 100 * 100) / 100;
}

function calculateRecordsPerHour(metrics: any): number {
  // Estimar records por hora baseado nos dados de hoje
  const recordsToday = metrics.records_processed_today || 0;
  const hoursInDay = 24;
  return Math.round(recordsToday / hoursInDay);
}

function calculateErrorRate(metrics: any): number {
  const totalRuns = metrics.total_runs || 1;
  const errors = metrics.errors_today || 0;
  return Math.round((errors / totalRuns) * 100 * 100) / 100;
}

function calculateDataFreshness(lastRun: Date): string {
  const minutesAgo = (Date.now() - lastRun.getTime()) / (1000 * 60);
  
  if (minutesAgo < 5) return 'very_fresh';
  if (minutesAgo < 30) return 'fresh';
  if (minutesAgo < 120) return 'acceptable';
  return 'stale';
}

async function getDataQualityScore(pipelineId: string): Promise<number> {
  // Simular score de qualidade baseado em métricas recentes
  return Math.round((Math.random() * 20 + 80) * 100) / 100;
}

async function generateQualityReport(timeframe: string, pipelineFilter?: string): Promise<any> {
  // Simular relatório de qualidade
  const report = {
    timeframe: timeframe,
    pipeline_filter: pipelineFilter,
    generated_at: new Date().toISOString(),
    summary: {
      total_records_processed: 1250000,
      valid_records: 1187500,
      rejected_records: 62500,
      overall_quality_score: 95.0,
      data_completeness: 98.5,
      data_accuracy: 94.2,
      data_consistency: 96.8
    },
    quality_trends: [
      { date: '2024-01-20', quality_score: 94.5 },
      { date: '2024-01-21', quality_score: 95.2 },
      { date: '2024-01-22', quality_score: 95.0 },
      { date: '2024-01-23', quality_score: 94.8 }
    ],
    quality_issues: [
      {
        type: 'missing_data',
        frequency: 1.5,
        impact: 'medium',
        description: 'Some economic indicators missing timestamps'
      },
      {
        type: 'outlier_values',
        frequency: 0.8,
        impact: 'low',
        description: 'Exchange rate outliers detected and filtered'
      }
    ],
    recommendations: [
      'Implement additional data validation for timestamp fields',
      'Review outlier detection thresholds for exchange rates',
      'Monitor data source availability more closely'
    ]
  };

  return report;
}

async function generateMetricsDashboard(): Promise<any> {
  const allMetrics = pipelineService.getPipelineMetrics() as Map<string, any>;
  const pipelinesArray = Array.from(allMetrics.values());

  const dashboard = {
    overview: {
      total_pipelines: pipelinesArray.length,
      active_pipelines: pipelinesArray.filter(p => p.status === 'running').length,
      total_records_today: pipelinesArray.reduce((sum, p) => sum + p.records_processed_today, 0),
      avg_success_rate: pipelinesArray.length > 0 ? 
        pipelinesArray.reduce((sum, p) => sum + p.success_rate, 0) / pipelinesArray.length : 0
    },
    performance_metrics: {
      throughput: {
        records_per_minute: Math.floor(Math.random() * 500) + 1000,
        peak_throughput: Math.floor(Math.random() * 1000) + 2000,
        avg_processing_time: Math.floor(Math.random() * 5000) + 15000
      },
      reliability: {
        uptime_percentage: 99.2,
        error_rate: 0.8,
        successful_runs_today: 156,
        failed_runs_today: 3
      },
      data_quality: {
        overall_score: 95.0,
        completeness: 98.5,
        accuracy: 94.2,
        freshness: 96.8
      }
    },
    top_performing_pipelines: pipelinesArray
      .sort((a, b) => b.success_rate - a.success_rate)
      .slice(0, 3)
      .map(p => ({
        name: p.pipeline_name,
        success_rate: p.success_rate,
        records_today: p.records_processed_today
      })),
    alerts_summary: {
      active_alerts: 2,
      critical_alerts: 0,
      unacknowledged_alerts: 1
    },
    trends: {
      data_volume_trend: 'increasing',
      quality_trend: 'stable',
      performance_trend: 'improving'
    }
  };

  return dashboard;
}

async function getPipelineAlerts(): Promise<any[]> {
  // Simular alertas ativos
  return [
    {
      id: 'alert_pipeline_001',
      pipeline_id: 'bcb_economic_data',
      severity: 'medium',
      type: 'data_quality',
      message: 'Data quality score below threshold (82%)',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      acknowledged: false,
      impact: 'Economic indicators may be incomplete'
    },
    {
      id: 'alert_pipeline_002',
      pipeline_id: 'global_exchange_rates',
      severity: 'high',
      type: 'processing_delay',
      message: 'Pipeline execution delayed by 15 minutes',
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      acknowledged: false,
      impact: 'Exchange rates may be stale'
    },
    {
      id: 'alert_pipeline_003',
      pipeline_id: 'fraud_indicators',
      severity: 'low',
      type: 'performance',
      message: 'Processing time increased by 20%',
      created_at: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      acknowledged: true,
      acknowledged_by: 'admin@fraudshield.dev',
      acknowledged_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    }
  ];
}

async function acknowledgeAlert(alertId: string, userId: string, comment: string): Promise<void> {
  // Em produção, atualizaria o banco de dados
  console.log(`Alert ${alertId} acknowledged by user ${userId}: ${comment}`);
}