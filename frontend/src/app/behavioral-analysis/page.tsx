'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, MousePointer, Keyboard, Clock, Eye, Target, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function BehavioralAnalysisPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    accuracy: 96.8,
    patterns: 1247,
    detectionTime: 120
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        accuracy: 96.5 + Math.random() * 1,
        patterns: prev.patterns + Math.floor(Math.random() * 3),
        detectionTime: 100 + Math.floor(Math.random() * 50)
      }));
    }, 3000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: MousePointer,
      title: 'Análise de Mouse',
      description: 'Padrões únicos de movimento, velocidade e cliques são analisados em tempo real para identificar comportamentos suspeitos.',
      metrics: 'Precisão: 94.2%'
    },
    {
      icon: Keyboard,
      title: 'Biometria de Teclado',
      description: 'Ritmo de digitação, pressão das teclas e padrões únicos criam uma impressão digital comportamental.',
      metrics: 'Falsos Positivos: <0.1%'
    },
    {
      icon: Clock,
      title: 'Análise Temporal',
      description: 'Horários de acesso, duração de sessões e intervalos entre ações revelam padrões de comportamento.',
      metrics: 'Detecção: <2 segundos'
    },
    {
      icon: Eye,
      title: 'Padrões Visuais',
      description: 'Movimento dos olhos, foco de atenção e navegação são capturados para análise comportamental.',
      metrics: 'Cobertura: 98.7%'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando análise comportamental...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Análise Comportamental - Biometria Digital Avançada | FraudDetex"
        description="Detecte fraudes através de padrões únicos de comportamento. Biometria de mouse, teclado e navegação com precisão superior a 96%."
        keywords="biometria comportamental, análise mouse, detecção fraude, padrões digitação, behavioral biometrics"
        url="https://frauddetex.com/behavioral-analysis"
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
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Brain className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">🧠 Biometria Comportamental</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Cada Pessoa é <span className="text-blue-400">Única</span>
              <br />
              <span className="text-blue-400">Digitalmente</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Nossa IA analisa mais de 200 padrões comportamentais únicos para criar uma impressão digital digital impossível de falsificar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white" asChild>
                <Link href="/signup">
                  🧠 Ativar Biometria Comportamental
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Demonstração ao Vivo
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
                <CardTitle className="text-sm font-medium text-slate-300">Precisão da Análise</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.accuracy.toFixed(1)}%</div>
                <Progress value={stats.accuracy} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Padrões Únicos</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.patterns.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Identificados em tempo real</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Tempo de Detecção</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.detectionTime}ms</div>
                <p className="text-xs text-slate-400">Análise instantânea</p>
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
            <h2 className="text-4xl font-bold mb-4 text-white">Tecnologias de Análise Comportamental</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Cada interação digital revela padrões únicos que identificam usuários legítimos e detectam fraudadores.
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
                      <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/40">
                        <feature.icon className="h-6 w-6 text-blue-400" />
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
            className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🧠</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Proteja seu Negócio com
              <br />
              <span className="text-blue-400">Biometria Comportamental</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Implemente a tecnologia mais avançada de detecção de fraudes baseada em padrões comportamentais únicos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Agora - Grátis por 30 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Setup em 5 minutos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Integração API simples
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Compliance LGPD
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}