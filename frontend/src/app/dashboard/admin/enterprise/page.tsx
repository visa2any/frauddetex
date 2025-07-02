'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface EnterpriseMetrics {
  total_revenue: number;
  monthly_revenue: number;
  annual_revenue: number;
  churn_rate: number;
  customer_lifetime_value: number;
  net_promoter_score: number;
  system_uptime: number;
  security_score: number;
}

interface ComplianceData {
  lgpd_compliance: boolean;
  pci_dss_compliance: boolean;
  soc2_compliance: boolean;
  iso27001_compliance: boolean;
  last_audit_date: string;
  next_audit_date: string;
  compliance_score: number;
}

interface SecurityMetrics {
  total_threats_blocked: number;
  zero_day_threats: number;
  data_breaches_prevented: number;
  security_incidents: number;
  threat_intelligence_sources: number;
  ai_model_accuracy: number;
}

export default function EnterpriseAdminDashboard() {
  const [metrics, setMetrics] = useState<EnterpriseMetrics>({
    total_revenue: 2500000,
    monthly_revenue: 185000,
    annual_revenue: 2220000,
    churn_rate: 2.3,
    customer_lifetime_value: 45000,
    net_promoter_score: 78,
    system_uptime: 99.99,
    security_score: 98.5
  });

  const [compliance, setCompliance] = useState<ComplianceData>({
    lgpd_compliance: true,
    pci_dss_compliance: true,
    soc2_compliance: true,
    iso27001_compliance: true,
    last_audit_date: '2024-01-15',
    next_audit_date: '2024-07-15',
    compliance_score: 96.8
  });

  const [security, setSecurity] = useState<SecurityMetrics>({
    total_threats_blocked: 15420,
    zero_day_threats: 47,
    data_breaches_prevented: 23,
    security_incidents: 2,
    threat_intelligence_sources: 156,
    ai_model_accuracy: 99.7
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEnterpriseData();
  }, []);

  const loadEnterpriseData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados enterprise:', error);
      setIsLoading(false);
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
        {/* Enterprise Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🏢 Enterprise Admin Dashboard - FraudDetex
              </h1>
              <p className="text-gray-300">
                Painel de administração premium com métricas avançadas, compliance e segurança enterprise
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                Enterprise Premium
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                📊 Relatório Executivo
              </Button>
            </div>
          </div>
        </div>

        {/* Enterprise KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-300">Receita Total</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(metrics.total_revenue)}</p>
                  <p className="text-xs text-green-400">+15% este ano</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">Customer Lifetime Value</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(metrics.customer_lifetime_value)}</p>
                  <p className="text-xs text-green-400">+8% este mês</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/50 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Net Promoter Score</p>
                  <p className="text-2xl font-bold text-white">{metrics.net_promoter_score}</p>
                  <p className="text-xs text-green-400">Excelente</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/50 to-red-800/50 border-red-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-300">Taxa de Churn</p>
                  <p className="text-2xl font-bold text-white">{metrics.churn_rate}%</p>
                  <p className="text-xs text-green-400">-0.5% este mês</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📉</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-600">
              📊 Overview
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-white data-[state=active]:bg-green-600">
              ✅ Compliance
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-red-600">
              🛡️ Segurança
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
              📈 Analytics
            </TabsTrigger>
            <TabsTrigger value="operations" className="text-white data-[state=active]:bg-yellow-600">
              ⚙️ Operações
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-white data-[state=active]:bg-indigo-600">
              📋 Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>📈</span>
                    <span>Métricas de Crescimento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Receita Mensal</span>
                      <span className="text-green-400 font-medium">{formatCurrency(metrics.monthly_revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Receita Anual</span>
                      <span className="text-blue-400 font-medium">{formatCurrency(metrics.annual_revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Uptime do Sistema</span>
                      <span className="text-purple-400 font-medium">{metrics.system_uptime}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Score de Segurança</span>
                      <span className="text-yellow-400 font-medium">{metrics.security_score}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Objetivos Empresariais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Crescimento de Receita</span>
                        <span className="text-green-400 text-sm">85%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Redução de Churn</span>
                        <span className="text-blue-400 text-sm">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Satisfação do Cliente</span>
                        <span className="text-purple-400 text-sm">78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>✅</span>
                    <span>Status de Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">✅</span>
                        <span className="text-white">LGPD</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">✅</span>
                        <span className="text-white">PCI DSS</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">✅</span>
                        <span className="text-white">SOC 2</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">✅</span>
                        <span className="text-white">ISO 27001</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>📅</span>
                    <span>Agenda de Auditorias</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Última Auditoria</span>
                        <span className="text-blue-400">{formatDate(compliance.last_audit_date)}</span>
                      </div>
                      <p className="text-gray-400 text-sm">Todas as certificações renovadas com sucesso</p>
                    </div>
                    <div className="p-4 bg-yellow-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Próxima Auditoria</span>
                        <span className="text-yellow-400">{formatDate(compliance.next_audit_date)}</span>
                      </div>
                      <p className="text-gray-400 text-sm">Preparação em andamento</p>
                    </div>
                    <div className="text-center p-4 bg-green-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-1">{compliance.compliance_score}%</div>
                      <div className="text-white text-sm">Score de Compliance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🛡️</span>
                    <span>Métricas de Segurança</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Ameaças Bloqueadas</span>
                      <span className="text-red-400 font-medium">{security.total_threats_blocked.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Zero-Day Threats</span>
                      <span className="text-orange-400 font-medium">{security.zero_day_threats}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Data Breaches Prevenidas</span>
                      <span className="text-green-400 font-medium">{security.data_breaches_prevented}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Incidentes de Segurança</span>
                      <span className="text-yellow-400 font-medium">{security.security_incidents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Fontes de Threat Intel</span>
                      <span className="text-blue-400 font-medium">{security.threat_intelligence_sources}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Precisão do Modelo IA</span>
                      <span className="text-purple-400 font-medium">{security.ai_model_accuracy}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🔒</span>
                    <span>Controles de Segurança</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-400">🔐</span>
                        <div>
                          <div className="text-white font-medium">Criptografia End-to-End</div>
                          <div className="text-gray-400 text-sm">AES-256 implementado</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-400">🛡️</span>
                        <div>
                          <div className="text-white font-medium">Firewall Avançado</div>
                          <div className="text-gray-400 text-sm">WAF + DDoS Protection</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-purple-400">👁️</span>
                        <div>
                          <div className="text-white font-medium">Monitoramento 24/7</div>
                          <div className="text-gray-400 text-sm">SIEM + SOC</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-yellow-400">🔍</span>
                        <div>
                          <div className="text-white font-medium">Penetration Testing</div>
                          <div className="text-gray-400 text-sm">Mensal + Anual</div>
                        </div>
                      </div>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-400 mb-2">156</div>
                    <div className="text-gray-400">Clientes Enterprise</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-green-400 mb-2">2.5M</div>
                    <div className="text-gray-400">Transações Processadas</div>
                  </div>
                  <div className="text-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-400 mb-2">99.99%</div>
                    <div className="text-gray-400">SLA Compliance</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Operações de Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Backup Automático</span>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Disaster Recovery</span>
                      <Badge className="bg-green-100 text-green-800">Configurado</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Load Balancing</span>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Auto Scaling</span>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Monitoring</span>
                      <Badge className="bg-green-100 text-green-800">24/7</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🔧</span>
                    <span>Manutenção</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Última Manutenção</span>
                        <span className="text-blue-400">2 dias atrás</span>
                      </div>
                      <p className="text-gray-400 text-sm">Atualização de segurança aplicada</p>
                    </div>
                    <div className="p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Próxima Manutenção</span>
                        <span className="text-green-400">15 dias</span>
                      </div>
                      <p className="text-gray-400 text-sm">Manutenção programada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>📋</span>
                  <span>Relatórios Enterprise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                    <span className="text-2xl mb-2">📊</span>
                    <span className="text-sm">Relatório Executivo</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                    <span className="text-2xl mb-2">💰</span>
                    <span className="text-sm">Relatório Financeiro</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                    <span className="text-2xl mb-2">🛡️</span>
                    <span className="text-sm">Relatório de Segurança</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                    <span className="text-2xl mb-2">✅</span>
                    <span className="text-sm">Relatório de Compliance</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white">
                    <span className="text-2xl mb-2">👥</span>
                    <span className="text-sm">Relatório de Clientes</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white">
                    <span className="text-2xl mb-2">📈</span>
                    <span className="text-sm">Relatório de Performance</span>
                  </Button>
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