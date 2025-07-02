'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Globe, Server, Network, Cpu, Clock, ArrowRight, CheckCircle, Activity } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function EdgeComputingPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    latency: 8.5,
    nodes: 127,
    uptime: 99.98
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        latency: 7 + Math.random() * 3,
        nodes: prev.nodes + Math.floor(Math.random() * 2),
        uptime: 99.95 + Math.random() * 0.05
      }));
    }, 3000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Processamento Ultra-Rápido',
      description: 'Análise local nos edge nodes para latência mínima e resposta instantânea às transações.',
      metrics: 'Latência: <10ms'
    },
    {
      icon: Globe,
      title: 'Rede Global Distribuída',
      description: 'Infraestrutura edge presente em mais de 50 países para cobertura mundial completa.',
      metrics: 'Cobertura: 95%'
    },
    {
      icon: Server,
      title: 'Auto-scaling Inteligente',
      description: 'Recursos computacionais que se ajustam automaticamente à demanda em tempo real.',
      metrics: 'Escalabilidade: 10x'
    },
    {
      icon: Network,
      title: 'Sincronização Distribuída',
      description: 'Dados e modelos sincronizados instantaneamente entre todos os pontos da rede edge.',
      metrics: 'Sync: Tempo Real'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando à rede edge...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Edge Computing - Processamento Distribuído de Alta Performance | FraudDetex"
        description="Rede edge global para detecção de fraudes com latência ultra-baixa. Processamento local e sincronização mundial em tempo real."
        keywords="edge computing, distributed processing, low latency, edge nodes, real-time processing, global network"
        url="https://frauddetex.com/edge-computing"
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
            <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
              <Network className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-emerald-400 text-sm font-medium">⚡ Edge Computing</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Velocidade da <span className="text-emerald-400">Luz</span>
              <br />
              <span className="text-emerald-400">Mundial</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Rede edge distribuída globalmente para processamento de fraudes com latência ultra-baixa em qualquer lugar do mundo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/signup">
                  ⚡ Ativar Edge Computing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Rede Global
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
                <CardTitle className="text-sm font-medium text-slate-300">Latência Média</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-400">{stats.latency.toFixed(1)}ms</div>
                <p className="text-xs text-slate-400">Processamento edge local</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Nodes Ativos</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.nodes}</div>
                <p className="text-xs text-slate-400">Pontos edge globais</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Uptime da Rede</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.uptime.toFixed(2)}%</div>
                <Progress value={stats.uptime} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Infraestrutura Edge Avançada</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Processamento distribuído que leva a detecção de fraudes para mais perto dos seus usuários.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                        <feature.icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                        {feature.metrics}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-300 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Performance Global
              <br />
              <span className="text-emerald-400">Sem Limites</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Experimente a velocidade de processamento edge com cobertura mundial e latência mínima.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Agora - Grátis por 30 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white" asChild>
                <Link href="/contact">
                  Consultar Arquitetura
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                127+ Pontos Edge
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Latência Ultra-Baixa
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                99.98% Uptime
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}