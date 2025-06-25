'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricData {
  total_transactions: number;
  fraud_detected: number;
  fraud_rate: number;
  accuracy: number;
  avg_response_time: number;
  api_usage: {
    current: number;
    limit: number;
    percentage: number;
  };
  cost_savings: number;
  uptime: number;
}

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState<MetricData>({
    total_transactions: 152847,
    fraud_detected: 247,
    fraud_rate: 0.16,
    accuracy: 99.7,
    avg_response_time: 86,
    api_usage: {
      current: 43567,
      limit: 100000,
      percentage: 43.6
    },
    cost_savings: 2340000,
    uptime: 99.9
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        total_transactions: prev.total_transactions + Math.floor(Math.random() * 5),
        fraud_detected: prev.fraud_detected + (Math.random() < 0.1 ? 1 : 0),
        avg_response_time: 80 + Math.floor(Math.random() * 20),
        api_usage: {
          ...prev.api_usage,
          current: prev.api_usage.current + Math.floor(Math.random() * 3)
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
      {/* Total Transactions */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total de Transações
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-lg">📊</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(metrics.total_transactions)}
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ↗ +12.5% vs ontem
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">Últimas 24 horas</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* Fraud Detected */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fraudes Detectadas
            </CardTitle>
            <div className="p-2 bg-red-100 rounded-full">
              <span className="text-red-600 text-lg">🚨</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatNumber(metrics.fraud_detected)}
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {metrics.fraud_rate.toFixed(2)}% taxa
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(metrics.fraud_detected * 4500)} economizados
          </p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* Accuracy */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Precisão do Modelo
            </CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <span className="text-green-600 text-lg">🎯</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {metrics.accuracy}%
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ↗ +0.3% este mês
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">ML performance</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* Response Time */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tempo de Resposta
            </CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-lg">⚡</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.avg_response_time}ms
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              ⚡ Ultra rápido
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">Média global</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* API Usage */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Uso da API
            </CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full">
              <span className="text-indigo-600 text-lg">🔌</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">
            {formatNumber(metrics.api_usage.current)}
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{metrics.api_usage.percentage.toFixed(1)}% usado</span>
              <span>{formatNumber(metrics.api_usage.limit)} limite</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.api_usage.percentage}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Este mês</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* Cost Savings */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Economia Total
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-600 text-lg">💰</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(metrics.cost_savings)}
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              ↗ ROI: 450%
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">Fraudes evitadas</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

      {/* Uptime */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">
              Uptime do Sistema
            </CardTitle>
            <div className="p-2 bg-cyan-100 rounded-full">
              <span className="text-cyan-600 text-lg">🛡️</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">
            {metrics.uptime}%
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
              🟢 Operacional
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
        </CardContent>
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full -mr-10 -mt-10"></div>
      </Card>

    </div>
  );
}