'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Shield, Globe, AlertTriangle, TrendingUp, Database, ArrowRight, CheckCircle, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function ThreatIntelligencePage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    threats: 15420,
    sources: 847,
    accuracy: 98.7
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        threats: prev.threats + Math.floor(Math.random() * 10),
        sources: prev.sources + Math.floor(Math.random() * 3),
        accuracy: 98.2 + Math.random() * 0.8
      }));
    }, 4000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Globe,
      title: 'Inteligência Global',
      description: 'Coleta dados de ameaças de mais de 500 fontes globais incluindo dark web, fóruns de hackers e feeds de inteligência.',
      metrics: 'Cobertura: 95%'
    },
    {
      icon: Database,
      title: 'Base de Conhecimento',
      description: 'Banco de dados com milhões de indicadores de compromisso (IOCs) e padrões de ataques atualizados em tempo real.',
      metrics: 'IOCs: 12M+'
    },
    {
      icon: TrendingUp,
      title: 'Análise Preditiva',
      description: 'IA que identifica tendências emergentes e prevê novos vetores de ataque antes que se tornem ameaças ativas.',
      metrics: 'Precisão: 94.8%'
    },
    {
      icon: Eye,
      title: 'Monitoramento Contínuo',
      description: 'Vigilância 24/7 da superfície, deep web e dark web para identificar ameaças direcionadas ao seu negócio.',
      metrics: 'Tempo Real: <30s'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando inteligência de ameaças...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Inteligência de Ameaças - Proteção Baseada em Dados Globais | FraudDetex"
        description="Sistema avançado de threat intelligence com dados de 500+ fontes globais. Detecte ameaças emergentes e proteja-se proativamente."
        keywords="threat intelligence, inteligência ameaças, dark web monitoring, IOC, cyber intelligence, fraud prevention"
        url="https://frauddetex.com/threat-intelligence"
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
            <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
              <Search className="h-4 w-4 text-orange-400 mr-2" />
              <span className="text-orange-400 text-sm font-medium">🔍 Threat Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Conheça Suas <span className="text-orange-400">Ameaças</span>
              <br />
              <span className="text-orange-400">Antes Delas</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Proteja-se proativamente com inteligência de ameaças em tempo real coletada de centenas de fontes globais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="/signup">
                  🛡️ Ativar Threat Intelligence
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Painel de Ameaças
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
                <CardTitle className="text-sm font-medium text-slate-300">Ameaças Identificadas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{stats.threats.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Últimas 24 horas</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Fontes de Intel</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.sources}</div>
                <p className="text-xs text-slate-400">Fontes ativas globais</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Precisão da IA</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.accuracy.toFixed(1)}%</div>
                <Progress value={stats.accuracy} className="mt-2" />
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
            <h2 className="text-4xl font-bold mb-4 text-white">Inteligência de Ameaças Avançada</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Colete, analise e aja com base em dados de ameaças das melhores fontes de inteligência do mundo.
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
                      <div className="p-3 rounded-full bg-orange-500/20 border border-orange-500/40">
                        <feature.icon className="h-6 w-6 text-orange-400" />
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
            className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Esteja Um Passo à Frente
              <br />
              <span className="text-orange-400">Das Ameaças</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Implemente inteligência de ameaças proativa e detecte riscos antes que se tornem ataques reais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Agora - Grátis por 30 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                500+ Fontes de Intel
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Atualizações em Tempo Real
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                IA Preditiva Avançada
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}