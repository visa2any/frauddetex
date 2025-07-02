'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cloud, Server, Shield, TrendingUp, Cpu, Database, ArrowRight, CheckCircle, Activity } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function CloudInfrastructurePage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    servers: 847,
    availability: 99.99,
    throughput: 1247500
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        servers: prev.servers + Math.floor(Math.random() * 5),
        availability: 99.95 + Math.random() * 0.05,
        throughput: prev.throughput + Math.floor(Math.random() * 1000)
      }));
    }, 3500);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Cloud,
      title: 'Multi-Cloud Híbrida',
      description: 'Infraestrutura distribuída entre AWS, Azure e GCP para máxima redundância e disponibilidade.',
      metrics: 'Clouds: 3'
    },
    {
      icon: TrendingUp,
      title: 'Auto-scaling Inteligente',
      description: 'Dimensionamento automático baseado em demanda com previsão de carga por machine learning.',
      metrics: 'Escalabilidade: 100x'
    },
    {
      icon: Database,
      title: 'Storage Distribuído',
      description: 'Dados replicados globalmente com consistência eventual e backup automatizado.',
      metrics: 'Replicação: 99.9%'
    },
    {
      icon: Shield,
      title: 'Segurança Enterprise',
      description: 'Isolamento por containers, criptografia end-to-end e compliance com principais certificações.',
      metrics: 'Compliance: SOC2'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Conectando à infraestrutura...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Cloud Infrastructure - Arquitetura Escalável e Resiliente | FraudDetex"
        description="Infraestrutura cloud enterprise com multi-cloud, auto-scaling e 99.99% uptime. Arquitetura preparada para qualquer escala."
        keywords="cloud infrastructure, multi-cloud, scalability, high availability, enterprise architecture, AWS, Azure, GCP"
        url="https://frauddetex.com/cloud-infrastructure"
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
            <div className="inline-flex items-center bg-sky-500/10 border border-sky-500/20 rounded-full px-4 py-2 mb-8">
              <Cloud className="h-4 w-4 text-sky-400 mr-2" />
              <span className="text-sky-400 text-sm font-medium">☁️ Cloud Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Escala <span className="text-sky-400">Infinita</span>
              <br />
              <span className="text-sky-400">Confiabilidade Total</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Infraestrutura cloud enterprise que escala automaticamente e garante 99.99% de disponibilidade mundial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-sky-500 hover:bg-sky-600 text-white" asChild>
                <Link href="/signup">
                  ☁️ Escalar para Cloud
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Arquitetura
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
                <CardTitle className="text-sm font-medium text-slate-300">Servidores Ativos</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-sky-400">{stats.servers}</div>
                <p className="text-xs text-slate-400">Instâncias globais</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Disponibilidade</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.availability.toFixed(2)}%</div>
                <Progress value={stats.availability} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Throughput</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.throughput.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Req/s processadas</p>
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
            <h2 className="text-4xl font-bold mb-4 text-white">Arquitetura Cloud Enterprise</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Infraestrutura de classe mundial projetada para máxima performance, segurança e escalabilidade.
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
                      <div className="p-3 rounded-full bg-sky-500/20 border border-sky-500/40">
                        <feature.icon className="h-6 w-6 text-sky-400" />
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

        {/* Architecture Diagram Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Componentes da Infraestrutura</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Cloud className="h-5 w-5 text-blue-400 mr-2" />
                  Load Balancers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Distribuição inteligente de tráfego com failover automático</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Capacidade:</span>
                  <span className="text-green-400">1M+ req/s</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Database className="h-5 w-5 text-purple-400 mr-2" />
                  Distributed Cache
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Cache distribuído com Redis Cluster para performance máxima</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Latência:</span>
                  <span className="text-green-400">{'<'}1ms</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Server className="h-5 w-5 text-orange-400 mr-2" />
                  Container Orchestration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Kubernetes clusters com auto-healing e rolling updates</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Pods:</span>
                  <span className="text-green-400">2,500+</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-sky-900/20 to-blue-900/20 border border-sky-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">☁️</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Infraestrutura que
              <br />
              <span className="text-sky-400">Nunca Falha</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Confie em nossa arquitetura cloud enterprise para garantir que sua detecção de fraudes esteja sempre disponível.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-sky-500 hover:bg-sky-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Migrar para Cloud - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white" asChild>
                <Link href="/contact">
                  Consultar Arquiteto Cloud
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                99.99% SLA Garantido
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Multi-Cloud Híbrida
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Auto-scaling Inteligente
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}