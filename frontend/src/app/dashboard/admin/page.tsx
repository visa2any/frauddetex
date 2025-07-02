'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface User {
  id: string;
  email: string;
  company_name?: string;
  plan: 'community' | 'smart' | 'enterprise' | 'insurance';
  usage_count: number;
  usage_limit: number;
  subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  created_at: string;
  is_active: boolean;
  email_verified: boolean;
}

interface SystemMetrics {
  total_users: number;
  active_users: number;
  total_revenue: number;
  monthly_revenue: number;
  fraud_detected: number;
  total_transactions: number;
  system_uptime: number;
  avg_response_time: number;
}

interface PlanStats {
  community: number;
  smart: number;
  enterprise: number;
  insurance: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    total_users: 0,
    active_users: 0,
    total_revenue: 0,
    monthly_revenue: 0,
    fraud_detected: 0,
    total_transactions: 0,
    system_uptime: 99.9,
    avg_response_time: 45
  });
  const [planStats, setPlanStats] = useState<PlanStats>({
    community: 0,
    smart: 0,
    enterprise: 0,
    insurance: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Simular dados de administração
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'empresa1@exemplo.com',
          company_name: 'Empresa Tech Ltda',
          plan: 'enterprise',
          usage_count: 85000,
          usage_limit: 1000000,
          subscription_status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          is_active: true,
          email_verified: true
        },
        {
          id: '2',
          email: 'startup@exemplo.com',
          company_name: 'Startup Inovadora',
          plan: 'smart',
          usage_count: 45000,
          usage_limit: 100000,
          subscription_status: 'active',
          created_at: '2024-02-01T14:30:00Z',
          is_active: true,
          email_verified: true
        },
        {
          id: '3',
          email: 'teste@exemplo.com',
          company_name: 'Teste Dev',
          plan: 'community',
          usage_count: 8500,
          usage_limit: 10000,
          subscription_status: 'active',
          created_at: '2024-02-10T09:15:00Z',
          is_active: true,
          email_verified: false
        },
        {
          id: '4',
          email: 'banco@exemplo.com',
          company_name: 'Banco Seguro S.A.',
          plan: 'insurance',
          usage_count: 250000,
          usage_limit: 5000000,
          subscription_status: 'active',
          created_at: '2024-01-20T16:45:00Z',
          is_active: true,
          email_verified: true
        },
        {
          id: '5',
          email: 'inativo@exemplo.com',
          company_name: 'Empresa Inativa',
          plan: 'smart',
          usage_count: 15000,
          usage_limit: 100000,
          subscription_status: 'canceled',
          created_at: '2024-01-05T11:20:00Z',
          is_active: false,
          email_verified: true
        }
      ];

      const mockMetrics: SystemMetrics = {
        total_users: 156,
        active_users: 142,
        total_revenue: 125000,
        monthly_revenue: 18500,
        fraud_detected: 2847,
        total_transactions: 1250000,
        system_uptime: 99.9,
        avg_response_time: 45
      };

      const mockPlanStats: PlanStats = {
        community: 89,
        smart: 45,
        enterprise: 18,
        insurance: 4
      };

      setUsers(mockUsers);
      setMetrics(mockMetrics);
      setPlanStats(mockPlanStats);
    } catch (error) {
      console.error('Erro ao carregar dados administrativos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'community': return 'bg-gray-100 text-gray-800';
      case 'smart': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'insurance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="dashboard" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="dashboard" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                👑 Painel de Administração - FraudDetex
              </h1>
              <p className="text-gray-300">
                Gestão completa de usuários, clientes, assinaturas e métricas do sistema
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-500 text-green-400">
                Sistema Operacional
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                📊 Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total de Usuários</p>
                  <p className="text-2xl font-bold text-white">{metrics.total_users}</p>
                  <p className="text-xs text-green-400">+12% este mês</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Receita Mensal</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(metrics.monthly_revenue)}</p>
                  <p className="text-xs text-green-400">+8% este mês</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Fraudes Detectadas</p>
                  <p className="text-2xl font-bold text-white">{metrics.fraud_detected.toLocaleString()}</p>
                  <p className="text-xs text-red-400">+5% este mês</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Uptime do Sistema</p>
                  <p className="text-2xl font-bold text-white">{metrics.system_uptime}%</p>
                  <p className="text-xs text-green-400">Estável</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-blue-600">
              👥 Usuários
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-white data-[state=active]:bg-blue-600">
              📊 Planos
            </TabsTrigger>
            <TabsTrigger value="revenue" className="text-white data-[state=active]:bg-blue-600">
              💰 Receita
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-blue-600">
              ⚙️ Sistema
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-blue-600">
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span>👥</span>
                    <span>Gestão de Usuários ({users.length})</span>
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                      ➕ Adicionar Usuário
                    </Button>
                    <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                      📥 Importar CSV
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-400">Empresa</th>
                        <th className="text-left py-3 px-4 text-gray-400">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400">Plano</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Uso</th>
                        <th className="text-left py-3 px-4 text-gray-400">Criado</th>
                        <th className="text-left py-3 px-4 text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-white">{user.company_name || 'N/A'}</div>
                              <div className="text-xs text-gray-400">{user.email_verified ? '✅ Verificado' : '❌ Não verificado'}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge className={getPlanColor(user.plan)}>
                              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(user.subscription_status || 'inactive')}>
                              {user.subscription_status === 'active' ? 'Ativo' :
                               user.subscription_status === 'canceled' ? 'Cancelado' :
                               user.subscription_status === 'past_due' ? 'Vencido' :
                               user.subscription_status === 'trialing' ? 'Teste' : 'Inativo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white">{user.usage_count.toLocaleString()} / {user.usage_limit.toLocaleString()}</div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min((user.usage_count / user.usage_limit) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-300">{formatDate(user.created_at)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                                👁️ Ver
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white">
                                ✏️ Editar
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                                🚫 {user.is_active ? 'Desativar' : 'Ativar'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans Distribution */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>📊</span>
                    <span>Distribuição de Planos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-500 rounded"></div>
                        <span className="text-white">Community</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{planStats.community}</div>
                        <div className="text-xs text-gray-400">{Math.round((planStats.community / metrics.total_users) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-white">Smart</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{planStats.smart}</div>
                        <div className="text-xs text-gray-400">{Math.round((planStats.smart / metrics.total_users) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className="text-white">Enterprise</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{planStats.enterprise}</div>
                        <div className="text-xs text-gray-400">{Math.round((planStats.enterprise / metrics.total_users) * 100)}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-white">Insurance</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{planStats.insurance}</div>
                        <div className="text-xs text-gray-400">{Math.round((planStats.insurance / metrics.total_users) * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>💰</span>
                    <span>Receita por Plano</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Community</span>
                      <span className="text-green-400 font-medium">R$ 0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Smart</span>
                      <span className="text-green-400 font-medium">R$ 2.250</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Enterprise</span>
                      <span className="text-green-400 font-medium">R$ 3.600</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Insurance</span>
                      <span className="text-green-400 font-medium">R$ 800</span>
                    </div>
                    <div className="border-t border-slate-700 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Total</span>
                        <span className="text-green-400 font-bold text-lg">{formatCurrency(metrics.monthly_revenue)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Analytics */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>💰</span>
                  <span>Análise de Receita</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">{formatCurrency(metrics.total_revenue)}</div>
                    <div className="text-gray-400">Receita Total</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{formatCurrency(metrics.monthly_revenue)}</div>
                    <div className="text-gray-400">Receita Mensal</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">+8%</div>
                    <div className="text-gray-400">Crescimento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Status do Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">API Gateway</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Operacional</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Operacional</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">ML Pipeline</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Operacional</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Edge Computing</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Operacional</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>📊</span>
                    <span>Métricas de Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Tempo Médio de Resposta</span>
                      <span className="text-blue-400 font-medium">{metrics.avg_response_time}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Uptime</span>
                      <span className="text-green-400 font-medium">{metrics.system_uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Transações Processadas</span>
                      <span className="text-purple-400 font-medium">{metrics.total_transactions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Taxa de Detecção</span>
                      <span className="text-yellow-400 font-medium">99.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>📈</span>
                  <span>Analytics Avançados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400 mb-2">156</div>
                    <div className="text-gray-400 text-sm">Usuários Ativos</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-2">1.25M</div>
                    <div className="text-gray-400 text-sm">Transações</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-red-400 mb-2">2.8K</div>
                    <div className="text-gray-400 text-sm">Fraudes Detectadas</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400 mb-2">99.7%</div>
                    <div className="text-gray-400 text-sm">Precisão</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
} 