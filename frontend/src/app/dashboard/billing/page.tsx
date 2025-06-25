'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface UsageData {
  current_period: {
    requests: number;
    limit: number;
    percentage: number;
    cost: number;
  };
  daily_usage: Array<{
    date: string;
    requests: number;
    cost: number;
  }>;
  plan: {
    name: string;
    price: number;
    requests_included: number;
    overage_rate: number;
  };
  billing_history: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    invoice_url?: string;
  }>;
}

interface FraudStats {
  total_blocked: number;
  money_saved: number;
  accuracy_rate: number;
  avg_response_time: number;
}

export default function BillingDashboard() {
  const [usageData, setUsageData] = useState<UsageData>({
    current_period: {
      requests: 67543,
      limit: 100000,
      percentage: 67.5,
      cost: 199
    },
    daily_usage: [
      { date: '2024-01-15', requests: 3200, cost: 6.4 },
      { date: '2024-01-16', requests: 2890, cost: 5.78 },
      { date: '2024-01-17', requests: 4150, cost: 8.3 },
      { date: '2024-01-18', requests: 3870, cost: 7.74 },
      { date: '2024-01-19', requests: 4420, cost: 8.84 },
      { date: '2024-01-20', requests: 3960, cost: 7.92 },
      { date: '2024-01-21', requests: 4053, cost: 8.11 }
    ],
    plan: {
      name: 'Smart Protection',
      price: 199,
      requests_included: 100000,
      overage_rate: 0.05
    },
    billing_history: [
      { id: 'inv_001', date: '2024-01-01', amount: 199.00, status: 'paid', invoice_url: '#' },
      { id: 'inv_002', date: '2023-12-01', amount: 234.50, status: 'paid', invoice_url: '#' },
      { id: 'inv_003', date: '2023-11-01', amount: 199.00, status: 'paid', invoice_url: '#' }
    ]
  });

  const [fraudStats, setFraudStats] = useState<FraudStats>({
    total_blocked: 247,
    money_saved: 1235000,
    accuracy_rate: 94.7,
    avg_response_time: 45
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const calculateProjectedCost = () => {
    const daysInMonth = 30;
    const daysElapsed = 21;
    const avgDailyRequests = usageData.current_period.requests / daysElapsed;
    const projectedMonthlyRequests = avgDailyRequests * daysInMonth;
    
    if (projectedMonthlyRequests <= usageData.plan.requests_included) {
      return usageData.plan.price;
    }
    
    const overage = projectedMonthlyRequests - usageData.plan.requests_included;
    return usageData.plan.price + (overage * usageData.plan.overage_rate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="billing" />

      <div className="container mx-auto px-4 py-8">
        {/* Current Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm flex items-center space-x-2">
                <span>📊</span>
                <span>Requests Este Mês</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {usageData.current_period.requests.toLocaleString()}
              </div>
              <div className="text-sm text-slate-400 mb-2">
                de {usageData.current_period.limit.toLocaleString()} inclusos
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${usageData.current_period.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {usageData.current_period.percentage.toFixed(1)}% usado
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm flex items-center space-x-2">
                <span>💰</span>
                <span>Custo Atual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">
                {formatCurrency(usageData.current_period.cost)}
              </div>
              <div className="text-sm text-slate-400 mb-2">
                Projeção: {formatCurrency(calculateProjectedCost())}
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/20 text-xs">
                Dentro do orçamento
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm flex items-center space-x-2">
                <span>🛡️</span>
                <span>Fraudes Bloqueadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400 mb-2">
                {fraudStats.total_blocked}
              </div>
              <div className="text-sm text-slate-400 mb-2">
                {fraudStats.accuracy_rate}% precisão
              </div>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/20 text-xs">
                Ativo 24/7
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm flex items-center space-x-2">
                <span>💎</span>
                <span>Economia Total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400 mb-2">
                {formatCurrency(fraudStats.money_saved)}
              </div>
              <div className="text-sm text-slate-400 mb-2">
                ROI: {Math.round((fraudStats.money_saved / (usageData.current_period.cost * 12)) * 100)}%
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/20 text-xs">
                Investimento recuperado
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart and Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Usage Chart */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span>📈</span>
                  <span>Uso Diário - Últimos 7 dias</span>
                </span>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                  Tempo real
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageData.daily_usage.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-400 w-20">
                        {new Date(day.date).toLocaleDateString('pt-BR', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(day.requests / Math.max(...usageData.daily_usage.map(d => d.requests))) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-white">
                        {day.requests.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatCurrency(day.cost)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Média diária:</span>
                  <span className="text-white font-medium">
                    {Math.round(usageData.current_period.requests / 21).toLocaleString()} requests
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-slate-400">Pico máximo:</span>
                  <span className="text-white font-medium">
                    {Math.max(...usageData.daily_usage.map(d => d.requests)).toLocaleString()} requests
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>🎯</span>
                <span>Seu Plano</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <div className="text-lg font-bold text-white mb-1">
                    {usageData.plan.name}
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {formatCurrency(usageData.plan.price)}/mês
                  </div>
                  <div className="text-sm text-slate-400">
                    {usageData.plan.requests_included.toLocaleString()} requests inclusos
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Excedente:</span>
                    <span className="text-sm text-white">
                      {formatCurrency(usageData.plan.overage_rate)} por request
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Próxima cobrança:</span>
                    <span className="text-sm text-white">01/02/2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Status:</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                      Ativo
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    💎 Upgrade do Plano
                  </Button>
                  <Button variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                    ⚙️ Gerenciar Plano
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span>🧾</span>
                <span>Histórico de Cobrança</span>
              </span>
              <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                Ver Todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData.billing_history.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-slate-300">📄</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">Fatura #{bill.id}</div>
                      <div className="text-sm text-slate-400">
                        {new Date(bill.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-white">
                        {formatCurrency(bill.amount)}
                      </div>
                      <Badge className={`text-xs ${
                        bill.status === 'paid' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/20'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {bill.status === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                      📥 PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>⚡</span>
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tempo de resposta médio:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                    {fraudStats.avg_response_time}ms
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Uptime:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                    99.9%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Taxa de falsos positivos:</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                    0.3%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>📱</span>
                <span>Ações Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  🔔 Configurar Alertas de Uso
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  📊 Exportar Relatório
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  💳 Atualizar Método de Pagamento
                </Button>
                <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  📞 Suporte Técnico
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}