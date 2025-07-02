'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Cpu, Network, Bot, Zap, ArrowRight, CheckCircle, Target } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function MachineLearningPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    accuracy: 98.9,
    models: 47,
    predictions: 2847593
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        accuracy: 98.5 + Math.random() * 0.5,
        models: prev.models + Math.floor(Math.random() * 2),
        predictions: prev.predictions + Math.floor(Math.random() * 1000)
      }));
    }, 2500);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Deep Learning Avançado',
      description: 'Redes neurais profundas treinadas em bilhões de transações para detectar padrões imperceptíveis.',
      metrics: 'Precisão: 98.9%'
    },
    {
      icon: TrendingUp,
      title: 'Aprendizado Contínuo',
      description: 'Modelos que evoluem automaticamente com novos dados, mantendo-se atualizados contra ameaças emergentes.',
      metrics: 'Auto-evolução: 24/7'
    },
    {
      icon: Network,
      title: 'Ensemble de Modelos',
      description: 'Combinação inteligente de múltiplos algoritmos para máxima precisão e robustez na detecção.',
      metrics: 'Modelos: 12+'
    },
    {
      icon: Cpu,
      title: 'Processamento Distribuído',
      description: 'Infraestrutura GPU otimizada para inferência em tempo real com latência ultra-baixa.',
      metrics: 'Latência: <15ms'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando modelos de IA...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Machine Learning - IA Avançada para Detecção de Fraudes | FraudDetex"
        description="Tecnologia de ponta em Machine Learning e Deep Learning. Modelos de IA que aprendem continuamente para máxima precisão na detecção."
        keywords="machine learning, deep learning, AI fraud detection, neural networks, artificial intelligence, ML models"
        url="https://frauddetex.com/machine-learning"
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
            <div className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 mb-8">
              <Brain className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-cyan-400 text-sm font-medium">🤖 Machine Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              IA que <span className="text-cyan-400">Aprende</span>
              <br />
              <span className="text-cyan-400">Evolui</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Modelos de Machine Learning de última geração que se adaptam automaticamente às novas ameaças.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-600 text-white" asChild>
                <Link href="/signup">
                  🤖 Ativar IA Avançada
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Modelos em Ação
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
                <CardTitle className="text-sm font-medium text-slate-300">Precisão dos Modelos</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-400">{stats.accuracy.toFixed(1)}%</div>
                <Progress value={stats.accuracy} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Modelos Ativos</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.models}</div>
                <p className="text-xs text-slate-400">Executando em produção</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Predições Hoje</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.predictions.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Inferências processadas</p>
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
            <h2 className="text-4xl font-bold mb-4 text-white">Tecnologias de Machine Learning</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Algoritmos de ponta que revolucionam a detecção de fraudes com precisão incomparável.
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
                      <div className="p-3 rounded-full bg-cyan-500/20 border border-cyan-500/40">
                        <feature.icon className="h-6 w-6 text-cyan-400" />
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

        {/* AI Models Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Modelos de IA Especializados</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Brain className="h-5 w-5 text-blue-400 mr-2" />
                  Neural Fraud Net
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Rede neural especializada em padrões de fraude financeira</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Precisão:</span>
                  <span className="text-green-400">99.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                  Anomaly Detector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Algoritmo não-supervisionado para anomalias comportamentais</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Detecção:</span>
                  <span className="text-green-400">0-day threats</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Network className="h-5 w-5 text-orange-400 mr-2" />
                  Risk Predictor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-3">Modelo preditivo de scores de risco em tempo real</p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Latência:</span>
                  <span className="text-green-400">{'<'}12ms</span>
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
            className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🤖</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              O Futuro da Detecção
              <br />
              <span className="text-cyan-400">Está Aqui</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Implemente modelos de IA que aprendem continuamente e se adaptam às ameaças mais sofisticadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-cyan-500 hover:bg-cyan-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar com IA - Grátis por 30 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com Especialista em IA
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                12+ Modelos Especializados
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Aprendizado Contínuo
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Inferência em Tempo Real
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}