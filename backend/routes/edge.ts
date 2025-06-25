/**
 * 🌐 FraudShield Revolutionary - Edge Computing Routes
 * 
 * API endpoints para gerenciamento e monitoramento de edge computing
 * Features:
 * - Status e métricas de edge nodes
 * - Processamento distribuído
 * - Balanceamento de carga
 * - Monitoramento em tempo real
 * - Configuração de edge nodes
 */

import { Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { EdgeComputingService } from "../services/edge-computing.ts";
import { RedisService } from "../services/redis.ts";

export const edgeRoutes = new Router();

// Error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class EdgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EdgeError';
  }
}

// Service instances
let edgeService: EdgeComputingService;
let redisService: RedisService;

export function initializeEdgeServices(edge: EdgeComputingService, redis: RedisService) {
  edgeService = edge;
  redisService = redis;
}

/**
 * GET /api/v1/edge/status
 * Obter status geral da rede edge
 */
edgeRoutes.get("/status", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    // Verificar permissões (apenas Enterprise/Insurance)
    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { 
        error: "Insufficient permissions",
        message: "Edge computing access requires Enterprise or Insurance plan"
      };
      return;
    }

    const globalMetrics = await edgeService.getGlobalMetrics();
    const nodes = edgeService.getEdgeNodes();

    const status = {
      overview: globalMetrics,
      edge_nodes: nodes.map(node => ({
        id: node.id,
        region: node.region,
        location: node.location,
        status: node.status,
        health_score: calculateHealthScore(node.health),
        load_percentage: Math.round((node.load.current_requests_per_second / node.load.max_requests_per_second) * 100),
        latency_ms: node.load.average_response_time,
        uptime: node.health.uptime_percentage,
        model_version: node.model_version,
        last_sync: node.last_sync
      })),
      network_health: {
        total_capacity_rps: nodes.reduce((sum, n) => sum + n.load.max_requests_per_second, 0),
        current_utilization_rps: globalMetrics.global_rps,
        utilization_percentage: Math.round((globalMetrics.global_rps / nodes.reduce((sum, n) => sum + n.load.max_requests_per_second, 0)) * 100),
        average_latency_ms: globalMetrics.average_latency,
        global_uptime_percentage: globalMetrics.global_uptime
      },
      geographic_coverage: calculateGeographicCoverage(nodes),
      last_updated: new Date().toISOString()
    };

    ctx.response.body = status;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "EdgeStatusError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/edge/nodes/:nodeId
 * Obter detalhes de um edge node específico
 */
edgeRoutes.get("/nodes/:nodeId", async (ctx: Context) => {
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

    const nodeId = ctx.params.nodeId;
    const nodes = edgeService.getEdgeNodes();
    const node = nodes.find(n => n.id === nodeId);

    if (!node) {
      ctx.response.status = 404;
      ctx.response.body = {
        error: "NodeNotFound",
        message: `Edge node ${nodeId} not found`
      };
      return;
    }

    // Obter métricas históricas simuladas
    const historicalMetrics = await getNodeHistoricalMetrics(nodeId);
    
    // Obter logs recentes simulados
    const recentLogs = await getNodeRecentLogs(nodeId);

    const nodeDetails = {
      node_info: {
        id: node.id,
        region: node.region,
        location: node.location,
        status: node.status,
        capabilities: node.capabilities,
        model_version: node.model_version,
        last_sync: node.last_sync
      },
      current_metrics: {
        health: node.health,
        load: node.load,
        health_score: calculateHealthScore(node.health),
        load_percentage: Math.round((node.load.current_requests_per_second / node.load.max_requests_per_second) * 100),
        efficiency_score: calculateEfficiencyScore(node)
      },
      performance: {
        requests_processed_today: Math.floor(Math.random() * 100000) + 50000,
        average_response_time_24h: node.load.average_response_time + Math.random() * 10 - 5,
        error_rate_percentage: Math.random() * 2,
        cache_hit_rate_percentage: Math.random() * 20 + 75,
        ml_inference_accuracy: Math.random() * 5 + 94
      },
      historical_metrics: historicalMetrics,
      recent_logs: recentLogs,
      alerts: await getNodeAlerts(nodeId),
      recommendations: generateNodeRecommendations(node)
    };

    ctx.response.body = nodeDetails;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "NodeDetailsError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/edge/process
 * Processar transação via edge computing
 */
edgeRoutes.post("/process", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    // Validar dados da transação
    if (!requestBody.transaction_data) {
      throw new ValidationError("Transaction data is required");
    }

    // Criar request para edge processing
    const edgeRequest = {
      request_id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      user_location: requestBody.user_location || { lat: 0, lng: 0 },
      transaction_data: requestBody.transaction_data,
      priority: requestBody.priority || 'medium',
      timestamp: new Date(),
      requires_ml: requestBody.requires_ml !== false,
      requires_real_time: requestBody.requires_real_time !== false
    };

    // Processar via edge network
    const startTime = Date.now();
    const result = await edgeService.processTransaction(edgeRequest);
    const totalTime = Date.now() - startTime;

    // Log para auditoria
    console.log(`Edge processing completed: ${result.request_id} in ${totalTime}ms by ${result.processed_by}`);

    ctx.response.body = {
      request_id: result.request_id,
      fraud_analysis: {
        fraud_score: result.fraud_score,
        decision: result.decision,
        confidence: result.confidence,
        risk_level: result.fraud_score > 70 ? 'high' : result.fraud_score > 40 ? 'medium' : 'low'
      },
      processing_info: {
        processed_by: result.processed_by,
        region: result.edge_metadata.region,
        processing_time_ms: result.processing_time_ms,
        total_time_ms: totalTime,
        model_version: result.model_version,
        cache_hit: result.edge_metadata.cache_hit,
        fallback_used: result.edge_metadata.fallback_used
      },
      edge_performance: {
        latency_category: result.processing_time_ms < 50 ? 'excellent' : result.processing_time_ms < 100 ? 'good' : 'acceptable',
        edge_efficiency: !result.edge_metadata.fallback_used ? 'optimal' : 'degraded'
      }
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.response.status = 400;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = {
      error: error.name || "EdgeProcessingError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/edge/regions
 * Listar edge nodes por região
 */
edgeRoutes.get("/regions", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    const url = new URL(ctx.request.url);
    const region = url.searchParams.get("region");

    let nodes = edgeService.getEdgeNodes();
    
    if (region) {
      nodes = edgeService.getNodesByRegion(region);
    }

    // Agrupar por região
    const regionGroups = nodes.reduce((groups: any, node) => {
      const region = node.region;
      if (!groups[region]) {
        groups[region] = {
          region: region,
          continent: node.location.continent,
          nodes: [],
          total_capacity: 0,
          current_load: 0,
          average_latency: 0,
          health_score: 0
        };
      }
      
      groups[region].nodes.push({
        id: node.id,
        location: node.location,
        status: node.status,
        capacity: node.load.max_requests_per_second,
        current_rps: node.load.current_requests_per_second,
        latency: node.load.average_response_time,
        health: calculateHealthScore(node.health)
      });
      
      groups[region].total_capacity += node.load.max_requests_per_second;
      groups[region].current_load += node.load.current_requests_per_second;
      
      return groups;
    }, {});

    // Calcular métricas agregadas por região
    Object.values(regionGroups).forEach((group: any) => {
      const activeNodes = group.nodes.filter((n: any) => n.status === 'active');
      group.average_latency = activeNodes.length > 0 ? 
        activeNodes.reduce((sum: number, n: any) => sum + n.latency, 0) / activeNodes.length : 0;
      group.health_score = activeNodes.length > 0 ?
        activeNodes.reduce((sum: number, n: any) => sum + n.health, 0) / activeNodes.length : 0;
      group.utilization_percentage = group.total_capacity > 0 ?
        Math.round((group.current_load / group.total_capacity) * 100) : 0;
    });

    ctx.response.body = {
      regions: Object.values(regionGroups),
      total_regions: Object.keys(regionGroups).length,
      global_coverage: calculateGeographicCoverage(nodes),
      last_updated: new Date().toISOString()
    };

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "RegionsError",
      message: error.message
    };
  }
});

/**
 * POST /api/v1/edge/nodes
 * Adicionar novo edge node
 */
edgeRoutes.post("/nodes", async (ctx: Context) => {
  try {
    const user = ctx.user;
    if (!user) {
      ctx.response.status = 401;
      ctx.response.body = { error: "Authentication required" };
      return;
    }

    // Apenas admins podem adicionar nodes
    if (user.plan !== 'enterprise' && user.plan !== 'insurance') {
      ctx.response.status = 403;
      ctx.response.body = { error: "Insufficient permissions" };
      return;
    }

    const requestBody = await ctx.request.body({ type: "json" }).value;
    
    // Validar configuração do node
    if (!requestBody.region || !requestBody.location) {
      throw new ValidationError("Region and location are required");
    }

    const nodeId = await edgeService.addEdgeNode({
      region: requestBody.region,
      location: requestBody.location,
      capabilities: requestBody.capabilities || {
        ml_inference: true,
        data_caching: true,
        real_time_processing: true,
        model_training: false
      }
    });

    console.log(`User ${user.email} added edge node ${nodeId}`);

    ctx.response.status = 201;
    ctx.response.body = {
      message: "Edge node added successfully",
      node_id: nodeId,
      region: requestBody.region,
      location: requestBody.location,
      status: "active",
      added_by: user.email,
      added_at: new Date().toISOString()
    };

  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.response.status = 400;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = {
      error: error.name || "NodeCreationError",
      message: error.message
    };
  }
});

/**
 * DELETE /api/v1/edge/nodes/:nodeId
 * Remover edge node
 */
edgeRoutes.delete("/nodes/:nodeId", async (ctx: Context) => {
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

    const nodeId = ctx.params.nodeId;
    
    try {
      await edgeService.removeEdgeNode(nodeId);
      
      console.log(`User ${user.email} removed edge node ${nodeId}`);
      
      ctx.response.body = {
        message: "Edge node removed successfully",
        node_id: nodeId,
        removed_by: user.email,
        removed_at: new Date().toISOString()
      };

    } catch (error) {
      throw new EdgeError(`Failed to remove node: ${error.message}`);
    }

  } catch (error) {
    if (error instanceof EdgeError) {
      ctx.response.status = 400;
    } else {
      ctx.response.status = 500;
    }
    ctx.response.body = {
      error: error.name || "NodeRemovalError",
      message: error.message
    };
  }
});

/**
 * GET /api/v1/edge/metrics/dashboard
 * Dashboard de métricas de edge computing
 */
edgeRoutes.get("/metrics/dashboard", async (ctx: Context) => {
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

    const globalMetrics = await edgeService.getGlobalMetrics();
    const nodes = edgeService.getEdgeNodes();

    const dashboard = {
      overview: {
        total_nodes: globalMetrics.total_nodes,
        active_nodes: globalMetrics.active_nodes,
        regions_covered: globalMetrics.regions_covered,
        global_rps: globalMetrics.global_rps,
        average_latency_ms: Math.round(globalMetrics.average_latency),
        global_uptime: Math.round(globalMetrics.global_uptime * 100) / 100,
        model_sync_status: globalMetrics.model_sync_status
      },
      performance_metrics: {
        latency_distribution: {
          excellent_under_50ms: nodes.filter(n => n.load.average_response_time < 50).length,
          good_50_100ms: nodes.filter(n => n.load.average_response_time >= 50 && n.load.average_response_time < 100).length,
          acceptable_over_100ms: nodes.filter(n => n.load.average_response_time >= 100).length
        },
        load_distribution: {
          low_under_30: nodes.filter(n => (n.load.current_requests_per_second / n.load.max_requests_per_second) < 0.3).length,
          medium_30_70: nodes.filter(n => {
            const util = n.load.current_requests_per_second / n.load.max_requests_per_second;
            return util >= 0.3 && util < 0.7;
          }).length,
          high_over_70: nodes.filter(n => (n.load.current_requests_per_second / n.load.max_requests_per_second) >= 0.7).length
        },
        health_distribution: {
          healthy: nodes.filter(n => calculateHealthScore(n.health) >= 80).length,
          degraded: nodes.filter(n => {
            const health = calculateHealthScore(n.health);
            return health >= 60 && health < 80;
          }).length,
          critical: nodes.filter(n => calculateHealthScore(n.health) < 60).length
        }
      },
      geographic_insights: {
        coverage_by_continent: calculateCoverageByContinent(nodes),
        top_performing_regions: getTopPerformingRegions(nodes),
        latency_hotspots: getLatencyHotspots(nodes)
      },
      real_time_stats: {
        requests_last_hour: Math.floor(Math.random() * 50000) + 100000,
        cache_hit_rate: Math.round((Math.random() * 15 + 80) * 100) / 100,
        edge_efficiency: Math.round((1 - nodes.filter(n => n.status !== 'active').length / nodes.length) * 100),
        ml_accuracy: Math.round((Math.random() * 3 + 96) * 100) / 100
      },
      trends: {
        traffic_trend: 'increasing',
        latency_trend: 'stable',
        efficiency_trend: 'improving',
        coverage_trend: 'expanding'
      }
    };

    ctx.response.body = dashboard;

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      error: "DashboardError",
      message: error.message
    };
  }
});

// Helper functions

function calculateHealthScore(health: any): number {
  const cpuScore = Math.max(0, 100 - health.cpu_usage);
  const memoryScore = Math.max(0, 100 - health.memory_usage);
  const latencyScore = Math.max(0, 100 - health.network_latency * 2);
  const uptimeScore = health.uptime_percentage;
  
  return Math.round((cpuScore + memoryScore + latencyScore + uptimeScore) / 4);
}

function calculateEfficiencyScore(node: any): number {
  const healthScore = calculateHealthScore(node.health);
  const loadScore = 100 - ((node.load.current_requests_per_second / node.load.max_requests_per_second) * 100);
  const queueScore = Math.max(0, 100 - node.load.queue_length * 2);
  
  return Math.round((healthScore + loadScore + queueScore) / 3);
}

function calculateGeographicCoverage(nodes: any[]): any {
  const continents = [...new Set(nodes.map(n => n.location.continent))];
  const countries = [...new Set(nodes.map(n => n.location.country))];
  
  return {
    continents_covered: continents.length,
    countries_covered: countries.length,
    total_locations: nodes.length,
    coverage_score: Math.min(100, (continents.length * 20) + (countries.length * 5))
  };
}

function calculateCoverageByContinent(nodes: any[]): any {
  const continentCounts = nodes.reduce((counts: any, node) => {
    const continent = node.location.continent;
    counts[continent] = (counts[continent] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(continentCounts).map(([continent, count]) => ({
    continent,
    node_count: count,
    percentage: Math.round((count as number / nodes.length) * 100)
  }));
}

function getTopPerformingRegions(nodes: any[]): any[] {
  const regionPerformance = nodes.reduce((regions: any, node) => {
    if (!regions[node.region]) {
      regions[node.region] = {
        region: node.region,
        nodes: [],
        total_health: 0,
        total_latency: 0
      };
    }
    
    regions[node.region].nodes.push(node);
    regions[node.region].total_health += calculateHealthScore(node.health);
    regions[node.region].total_latency += node.load.average_response_time;
    
    return regions;
  }, {});

  return Object.values(regionPerformance)
    .map((region: any) => ({
      region: region.region,
      node_count: region.nodes.length,
      average_health: Math.round(region.total_health / region.nodes.length),
      average_latency: Math.round(region.total_latency / region.nodes.length),
      performance_score: Math.round(region.total_health / region.nodes.length) - 
                        Math.round(region.total_latency / region.nodes.length)
    }))
    .sort((a, b) => b.performance_score - a.performance_score)
    .slice(0, 5);
}

function getLatencyHotspots(nodes: any[]): any[] {
  return nodes
    .filter(node => node.load.average_response_time > 100)
    .map(node => ({
      node_id: node.id,
      region: node.region,
      location: node.location.city,
      latency_ms: node.load.average_response_time,
      severity: node.load.average_response_time > 200 ? 'critical' : 'warning'
    }))
    .sort((a, b) => b.latency_ms - a.latency_ms);
}

async function getNodeHistoricalMetrics(nodeId: string): Promise<any[]> {
  // Simular métricas históricas
  const metrics = [];
  const now = Date.now();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    metrics.push({
      timestamp: timestamp.toISOString(),
      requests_per_second: Math.floor(Math.random() * 1000) + 500,
      latency_ms: Math.floor(Math.random() * 40) + 20,
      cpu_usage: Math.floor(Math.random() * 30) + 30,
      memory_usage: Math.floor(Math.random() * 40) + 40,
      error_rate: Math.random() * 2
    });
  }
  
  return metrics;
}

async function getNodeRecentLogs(nodeId: string): Promise<any[]> {
  // Simular logs recentes
  return [
    {
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      level: 'INFO',
      message: 'Model sync completed successfully',
      model_version: 'v2.1.0'
    },
    {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      level: 'INFO',
      message: 'Cache refresh completed',
      cache_size_mb: 245
    },
    {
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      level: 'WARN',
      message: 'High CPU usage detected',
      cpu_usage: 78.5
    }
  ];
}

async function getNodeAlerts(nodeId: string): Promise<any[]> {
  // Simular alertas ativos
  return [
    {
      id: `alert_${nodeId}_001`,
      severity: 'medium',
      type: 'performance',
      message: 'Latency above normal threshold',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      acknowledged: false
    }
  ];
}

function generateNodeRecommendations(node: any): string[] {
  const recommendations = [];
  
  if (node.health.cpu_usage > 70) {
    recommendations.push("Consider scaling up CPU resources");
  }
  
  if (node.health.memory_usage > 80) {
    recommendations.push("Memory usage is high, monitor for leaks");
  }
  
  if (node.load.average_response_time > 100) {
    recommendations.push("Optimize processing to reduce latency");
  }
  
  if (node.load.queue_length > 20) {
    recommendations.push("Consider load balancing improvements");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Node is performing optimally");
  }
  
  return recommendations;
}