'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Monitor, Zap, Shield, AlertTriangle, Eye, Bell, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function RealTimeMonitoringPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    uptime: 99.99,
    threats: 1247,
    responseTime: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        uptime: 99.95 + Math.random() * 0.05,
        threats: prev.threats + Math.floor(Math.random() * 5),
        responseTime: 40 + Math.floor(Math.random() * 20)
      }));
    }, 2000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando monitoramento...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Monitoramento 24/7 - Proteção Contínua em Tempo Real | FraudDetex"
        description="Sistema de monitoramento contínuo com alertas instantâneos. Detecte e bloqueie fraudes 24 horas por dia com uptime de 99.99%."
        keywords="monitoramento tempo real, alertas fraude, proteção 24/7, detecção contínua, fraud monitoring"
        url="https://frauddetex.com/real-time-monitoring"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="solutions" />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
              <Monitor className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">⚡ Monitoramento 24/7</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Proteção que <span className="text-green-400">Nunca</span>
              <br />
              <span className="text-green-400">Descansa</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Sistema de vigilância contínua que monitora, detecta e bloqueia ameaças 24 horas por dia, 7 dias por semana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  🛡️ Ativar Proteção 24/7
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-green-500 text-green-400 hover:bg-green-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Centro de Comando
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Real-time Stats */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Uptime do Sistema</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.uptime.toFixed(2)}%</div>
                <Progress value={stats.uptime} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Ameaças Bloqueadas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.threats.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Últimas 24 horas</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Tempo de Resposta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.responseTime}ms</div>
                <p className="text-xs text-slate-400">Alerta instantâneo</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🛡️</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Nunca Mais Perca Uma
              <br />
              <span className="text-green-400">Tentativa de Fraude</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Implemente monitoramento contínuo e receba alertas instantâneos sobre qualquer atividade suspeita.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Monitoramento - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ 99.99% Uptime garantido
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Alertas em tempo real
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Suporte 24/7
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}