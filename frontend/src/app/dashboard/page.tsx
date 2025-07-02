'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MetricsGrid from '@/components/dashboard/MetricsGrid';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { FraudDetex } from '@/components/fraud/FraudDetex';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const onboardingCompleted = localStorage.getItem('fraudshield_onboarding_completed');
      if (userData) setUser(JSON.parse(userData));
      if (!onboardingCompleted) setShowOnboarding(true);
    }
  }, []);

  const handleStartOnboarding = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/onboarding';
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="dashboard" />
      <div className="container mx-auto px-4 py-8">
        {showOnboarding && (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Configure sua conta em 5 minutos!</h3>
                  <p className="text-blue-100">Complete o setup para aproveitar todos os recursos do FraudShield.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="ghost" onClick={() => setShowOnboarding(false)} className="text-white hover:bg-white/20">Mais tarde</Button>
                <Button onClick={handleStartOnboarding} className="bg-white text-blue-600 hover:bg-gray-100">Começar Setup</Button>
              </div>
            </div>
          </div>
        )}
        <div className="mb-8"><MetricsGrid /></div>
        <div className="mb-8"><FraudDetex autoStart={false} /></div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3"><RecentTransactions /></div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><span>📡</span><span>Status do Sistema</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">Edge Computing</span><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs text-green-600 font-medium">Operacional</span></div></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">ML Pipeline</span><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs text-green-600 font-medium">Operacional</span></div></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">Community Network</span><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs text-green-600 font-medium">Operacional</span></div></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium">API Gateway</span><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs text-green-600 font-medium">Operacional</span></div></div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800 font-medium">✅ Todos os sistemas operacionais</p><p className="text-xs text-green-600 mt-1">Última verificação: agora mesmo</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><span>🚨</span><span>Alertas Recentes</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500"><span className="text-red-500 text-lg mt-0.5">⚠️</span><div className="flex-1"><p className="font-medium text-red-800">Transação de Alto Risco</p><p className="text-sm text-red-600">R$ 5.000 - Bloqueada automaticamente</p><p className="text-xs text-red-500 mt-1">2 min atrás</p></div></div>
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"><span className="text-yellow-500 text-lg mt-0.5">👀</span><div className="flex-1"><p className="font-medium text-yellow-800">Padrão Suspeito</p><p className="text-sm text-yellow-600">Múltiplos logins falharam</p><p className="text-xs text-yellow-500 mt-1">5 min atrás</p></div></div>
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"><span className="text-blue-500 text-lg mt-0.5">🔄</span><div className="flex-1"><p className="font-medium text-blue-800">Modelo Atualizado</p><p className="text-sm text-blue-600">Precisão melhorou para 99.7%</p><p className="text-xs text-blue-500 mt-1">1 hora atrás</p></div></div>
                </div>
                <Button variant="outline" className="w-full mt-4 border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">Ver Todos os Alertas</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><span>⚡</span><span>Ações Rápidas</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">🧪 Testar API</Button>
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">📊 Ver Relatórios</Button>
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">🔔 Configurar Alertas</Button>
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">💳 Gerenciar Billing</Button>
                  <Button variant="outline" className="w-full justify-start border-red-500 text-red-400 hover:bg-red-500 hover:text-white" size="sm">📚 Ver Documentação</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><span>🚀</span><span>Recursos FraudShield Revolutionary</span></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-blue-600 text-2xl">🧠</span></div>
                  <h3 className="font-semibold mb-2">Edge Computing</h3>
                  <p className="text-sm text-gray-600">Processamento em tempo real com latência &lt;100ms</p>
                </div>
                <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center"><span className="text-purple-600 text-2xl">👆</span></div>
                  <h3 className="font-semibold mb-2">Biometria Comportamental</h3>
                  <p className="text-sm text-gray-600">Análise de padrões de mouse e teclado</p>
                </div>
                <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center"><span className="text-green-600 text-2xl">🌐</span></div>
                  <h3 className="font-semibold mb-2">Inteligência Comunitária</h3>
                  <p className="text-sm text-gray-600">Proteção colaborativa P2P</p>
                </div>
                <div className="text-center p-6 border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center"><span className="text-yellow-600 text-2xl">🔍</span></div>
                  <h3 className="font-semibold mb-2">IA Explicável</h3>
                  <p className="text-sm text-gray-600">Decisões transparentes e auditáveis</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
} 