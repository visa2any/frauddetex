'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, Code, Zap, Filter, Wrench, Cog, ArrowRight, CheckCircle, Target } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function CustomRulesPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    rules: 342,
    precision: 97.2,
    responseTime: 28
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        rules: prev.rules + Math.floor(Math.random() * 5),
        precision: 96.8 + Math.random() * 0.8,
        responseTime: 25 + Math.floor(Math.random() * 10)
      }));
    }, 3500);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Code,
      title: 'Editor Visual de Regras',
      description: 'Interface drag-and-drop intuitiva para criar regras complexas sem necessidade de programação.',
      metrics: 'Setup: 2 min'
    },
    {
      icon: Filter,
      title: 'Filtros Avançados',
      description: 'Combine múltiplos critérios, operadores lógicos e condições aninhadas para máxima precisão.',
      metrics: 'Critérios: 50+'
    },
    {
      icon: Zap,
      title: 'Execução em Tempo Real',
      description: 'Regras processadas instantaneamente com engine otimizada para baixa latência e alta performance.',
      metrics: 'Latência: <30ms'
    },
    {
      icon: Target,
      title: 'Teste e Simulação',
      description: 'Ambiente sandbox para testar regras antes da implementação, com dados históricos para validação.',
      metrics: 'Testes: Ilimitados'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor de regras...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Regras Personalizadas - Engine de Regras Customizáveis | FraudDetex"
        description="Crie regras de detecção personalizadas com editor visual intuitivo. Configure filtros avançados e lógica customizada para seu negócio."
        keywords="regras personalizadas, custom rules, business rules, fraud rules, rule engine, detecção customizada"
        url="https://frauddetex.com/custom-rules"
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
            <div className="inline-flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
              <Settings className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-purple-400 text-sm font-medium">⚙️ Regras Personalizadas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Suas Regras, <span className="text-purple-400">Sua</span>
              <br />
              <span className="text-purple-400">Proteção</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Crie regras de detecção personalizadas que se adaptam perfeitamente às necessidades específicas do seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-purple-500 hover:bg-purple-600 text-white" asChild>
                <Link href="/signup">
                  ⚙️ Criar Regras Personalizadas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Editor de Regras
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
                <CardTitle className="text-sm font-medium text-slate-300">Regras Ativas</CardTitle>
                <Cog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.rules}</div>
                <p className="text-xs text-slate-400">Executando em produção</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Precisão das Regras</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.precision.toFixed(1)}%</div>
                <Progress value={stats.precision} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Tempo de Execução</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.responseTime}ms</div>
                <p className="text-xs text-slate-400">Processamento instantâneo</p>
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
            <h2 className="text-4xl font-bold mb-4 text-white">Engine de Regras Avançado</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Construa lógicas de detecção personalizadas com nossa ferramenta visual intuitiva e poderosa.
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
                      <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/40">
                        <feature.icon className="h-6 w-6 text-purple-400" />
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

        {/* Rule Examples Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Exemplos de Regras Populares</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Filter className="h-5 w-5 text-yellow-400 mr-2" />
                  Transação Suspeita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm text-slate-300 block bg-slate-900/50 p-3 rounded">
                  SE valor {'>'} R$ 5.000<br />
                  E horário ENTRE 2h-6h<br />
                  E localização != usual<br />
                  ENTÃO bloquear
                </code>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Wrench className="h-5 w-5 text-blue-400 mr-2" />
                  Velocidade de Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm text-slate-300 block bg-slate-900/50 p-3 rounded">
                  SE tentativas {'>'} 5<br />
                  EM período {'<'} 10 min<br />
                  E IPs diferentes<br />
                  ENTÃO alertar
                </code>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Target className="h-5 w-5 text-green-400 mr-2" />
                  Padrão Comportamental
                </CardTitle>
              </CardHeader>
              <CardContent>
                <code className="text-sm text-slate-300 block bg-slate-900/50 p-3 rounded">
                  SE score_biométrico {'<'} 70<br />
                  E navegação != padrão<br />
                  E dispositivo novo<br />
                  ENTÃO verificar
                </code>
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
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">⚙️</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Configure Proteção
              <br />
              <span className="text-purple-400">Sob Medida</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Crie regras personalizadas que atendem às necessidades específicas do seu negócio com nossa ferramenta visual.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-purple-500 hover:bg-purple-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Agora - Grátis por 30 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Editor Visual Intuitivo
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Testes em Sandbox
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Execução em Tempo Real
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}