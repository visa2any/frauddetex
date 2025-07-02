'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Zap, Globe, Settings, Terminal, Book, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function ApiIntegrationPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    calls: 15642873,
    uptime: 99.97,
    responseTime: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        calls: prev.calls + Math.floor(Math.random() * 500),
        uptime: 99.95 + Math.random() * 0.05,
        responseTime: 40 + Math.floor(Math.random() * 15)
      }));
    }, 2000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Code,
      title: 'APIs RESTful Modernas',
      description: 'Endpoints bem documentados com OpenAPI 3.0, suporte a JSON/XML e versionamento adequado.',
      metrics: 'Versão: 2.1'
    },
    {
      icon: Zap,
      title: 'Webhook em Tempo Real',
      description: 'Notificações instantâneas de eventos de fraude diretamente para seus sistemas.',
      metrics: 'Latência: <50ms'
    },
    {
      icon: Globe,
      title: 'SDKs Multiplataforma',
      description: 'Bibliotecas nativas para Python, Node.js, PHP, Java, .NET e outras linguagens populares.',
      metrics: 'Linguagens: 12+'
    },
    {
      icon: Settings,
      title: 'Configuração Flexível',
      description: 'Personalização completa de endpoints, parâmetros e formatos de resposta.',
      metrics: 'Customização: 100%'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando documentação da API...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="API Integration - Integração Simples e Poderosa | FraudDetex"
        description="APIs RESTful modernas com SDKs para todas as linguagens. Integre detecção de fraudes em minutos com nossa documentação completa."
        keywords="API integration, REST API, webhook, SDK, developer tools, fraud detection API, integration guide"
        url="https://frauddetex.com/api-integration"
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
            <div className="inline-flex items-center bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
              <Code className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-indigo-400 text-sm font-medium">🔧 API Integration</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Integração em <span className="text-indigo-400">5</span>
              <br />
              <span className="text-indigo-400">Minutos</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              APIs modernas e SDKs nativos para integração rápida e simples com qualquer sistema ou linguagem de programação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-500 hover:bg-indigo-600 text-white" asChild>
                <Link href="/signup">
                  🔧 Começar Integração
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white" asChild>
                <Link href="/docs">
                  Ver Documentação
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
                <CardTitle className="text-sm font-medium text-slate-300">API Calls Hoje</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-400">{stats.calls.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Requisições processadas</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Uptime da API</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.uptime.toFixed(2)}%</div>
                <Progress value={stats.uptime} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Tempo de Resposta</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.responseTime}ms</div>
                <p className="text-xs text-slate-400">Resposta média</p>
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
            <h2 className="text-4xl font-bold mb-4 text-white">Ferramentas de Integração</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tudo que você precisa para integrar nossa plataforma com seus sistemas existentes.
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
                      <div className="p-3 rounded-full bg-indigo-500/20 border border-indigo-500/40">
                        <feature.icon className="h-6 w-6 text-indigo-400" />
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

        {/* Code Examples Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Exemplos de Código</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Veja como é simples integrar nossa API em diferentes linguagens.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Terminal className="h-5 w-5 text-green-400 mr-2" />
                  Node.js
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded overflow-x-auto">
                  <code>{`const fraud = require('frauddetex');

const result = await fraud.analyze({
  transaction: {
    amount: 1000,
    userId: 'user123',
    ip: '192.168.1.1'
  }
});

console.log(result.riskScore);`}</code>
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Terminal className="h-5 w-5 text-blue-400 mr-2" />
                  Python
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-slate-300 bg-slate-900/50 p-4 rounded overflow-x-auto">
                  <code>{`import frauddetex

client = frauddetex.Client(api_key='your_key')

result = client.analyze_transaction({
    'amount': 1000,
    'user_id': 'user123',
    'ip': '192.168.1.1'
})

print(result.risk_score)`}</code>
                </pre>
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
            className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🔧</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Integração Simples
              <br />
              <span className="text-indigo-400">Poder Infinito</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Comece a detectar fraudes em minutos com nossa API moderna e documentação completa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-500 hover:bg-indigo-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Obter API Key - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white" asChild>
                <Link href="/docs">
                  Ver Documentação Completa
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                SDKs para 12+ linguagens
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Webhooks em tempo real
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                99.97% Uptime
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}