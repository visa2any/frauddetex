'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Users, 
  Zap, 
  Eye, 
  Globe,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Clock,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BehavioralCapture } from '@/lib/behavioral-biometrics';
import { EdgeMLService } from '@/lib/edge-ml';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import StructuredData from '@/components/seo/StructuredData';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function HomePage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    edge: 'online',
    community: 'online',
    ml: 'online',
    uptime: '99.99%'
  });
  
  const [realtimeStats, setRealtimeStats] = useState({
    requestsProcessed: 0,
    averageLatency: 0,
    fraudDetected: 0,
    accuracy: 0
  });

  useEffect(() => {
    // Initialize behavioral capture
    const behavioralCapture = new BehavioralCapture();
    behavioralCapture.startCapture();

    // Initialize edge ML service
    const edgeML = new EdgeMLService();
    edgeML.initialize();

    // Simulate real-time stats
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        requestsProcessed: prev.requestsProcessed + Math.floor(Math.random() * 5),
        averageLatency: 45 + Math.floor(Math.random() * 10),
        fraudDetected: prev.fraudDetected + (Math.random() > 0.95 ? 1 : 0),
        accuracy: 92.5 + Math.random() * 2
      }));
    }, 2000);

    setIsLoading(false);

    return () => {
      clearInterval(interval);
      behavioralCapture.stopCapture();
    };
  }, []);

  const features = [
    {
      icon: Zap,
      title: t('homepage.features.instant_detection.title', 'Detecção Instantânea'),
      description: t('homepage.features.instant_detection.description', 'Edge computing com resposta em <50ms para bloquear fraudes em tempo real'),
      status: t('homepage.features.instant_detection.status', 'Ultrarapido'),
      color: 'bg-yellow-500/20 border-yellow-500/40',
      threat: t('homepage.features.instant_detection.threat', 'Bloqueia ataques antes que causem danos')
    },
    {
      icon: Brain,
      title: t('homepage.features.behavioral_biometrics.title', 'Biometria Comportamental'),
      description: t('homepage.features.behavioral_biometrics.description', 'Análise de padrões de mouse, teclado e navegação para identificar fraudadores'),
      status: '🧠 ' + t('homepage.features.behavioral_biometrics.status', 'Inteligência'),
      color: 'bg-blue-500/20 border-blue-500/40',
      threat: t('homepage.features.behavioral_biometrics.threat', 'Detecta bots e ataques automatizados')
    },
    {
      icon: Users,
      title: t('homepage.features.collective_intelligence.title', 'Inteligência Coletiva'),
      description: t('homepage.features.collective_intelligence.description', 'Rede colaborativa que compartilha ameaças entre empresas anonimamente'),
      status: '🌐 ' + t('homepage.features.collective_intelligence.status', 'Conectado'),
      color: 'bg-green-500/20 border-green-500/40',
      threat: t('homepage.features.collective_intelligence.threat', 'Proteção contra ameaças globais')
    },
    {
      icon: Eye,
      title: t('homepage.features.explainable_ai.title', 'IA Explicável'),
      description: t('homepage.features.explainable_ai.description', 'Cada decisão é transparente e auditável para compliance total'),
      status: '🔍 ' + t('homepage.features.explainable_ai.status', 'Transparente'),
      color: 'bg-purple-500/20 border-purple-500/40',
      threat: t('homepage.features.explainable_ai.threat', 'Justifica todas as decisões para auditores')
    },
    {
      icon: Globe,
      title: t('homepage.features.graph_networks.title', 'Redes Neurais de Grafos'),
      description: t('homepage.features.graph_networks.description', 'Detecta esquemas complexos e fraud rings com análise de relacionamentos'),
      status: '🔥 ' + t('homepage.features.graph_networks.status', 'Avançado'),
      color: 'bg-red-500/20 border-red-500/40',
      threat: t('homepage.features.graph_networks.threat', 'Desmascara organizações criminosas')
    },
    {
      icon: Lock,
      title: t('homepage.features.military_privacy.title', 'Privacidade Militar'),
      description: t('homepage.features.military_privacy.description', 'Arquitetura zero-knowledge que protege dados sensíveis'),
      status: '🔒 ' + t('homepage.features.military_privacy.status', 'Blindado'),
      color: 'bg-indigo-500/20 border-indigo-500/40',
      threat: t('homepage.features.military_privacy.threat', 'Resistência a ataques de estado')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', 'Carregando...')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="FraudDetex - Fraud Detection with Explainable AI"
        description="Advanced fraud detection system with explainable AI. Detect fraud in real-time and protect your business."
        keywords="fraud detection, anti-fraud, explainable AI, machine learning, cybersecurity"
        url="https://frauddetex.com"
        type="website"
      />
      <StructuredData type="organization" />
      <StructuredData type="product" />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="homepage" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
            <span className="text-red-400 text-sm font-medium">🚨 {t('homepage.hero.alert', 'ALERTA: Fraudes custam R$ 50 bilhões/ano no Brasil')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            {t('homepage.hero.title', 'Pare de')} <span className="text-red-400">{t('homepage.hero.title_highlight1', 'Perder Dinheiro')}</span>
            <br />
            {t('homepage.hero.title_with', 'com')} <span className="text-red-400">{t('homepage.hero.title_highlight2', 'Fraudes')}</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {t('homepage.hero.subtitle', 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real e economize milhões.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600 text-white" asChild>
              <Link href="/signup">
                🛡️ {t('homepage.hero.cta_primary', 'Proteger Grátis por 30 Dias')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-red-500 text-red-400 hover:bg-red-500 hover:text-white" asChild>
              <Link href="/demo">
                {t('homepage.hero.cta_secondary', 'Ver Demo ao Vivo')}
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
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{t('homepage.stats.attacks_blocked', 'Ataques Bloqueados')}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{realtimeStats.requestsProcessed.toLocaleString()}</div>
              <p className="text-xs text-slate-400">{t('homepage.stats.last_24h', 'Últimas 24h protegidas')}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{t('homepage.stats.response_time', 'Tempo de Resposta')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{realtimeStats.averageLatency}ms</div>
              <p className="text-xs text-slate-400">{t('homepage.stats.instant_detection', 'Detecção instantânea')}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{t('homepage.stats.savings_generated', 'Economia Gerada')}</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">R$ {(realtimeStats.fraudDetected * 4500).toLocaleString()}</div>
              <p className="text-xs text-slate-400">{t('homepage.stats.fraud_prevented_today', 'Fraudes evitadas hoje')}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{t('homepage.stats.protection_rate', 'Taxa de Proteção')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{realtimeStats.accuracy.toFixed(1)}%</div>
              <Progress value={realtimeStats.accuracy} className="mt-2" />
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
          <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-blue-400 text-sm font-medium">🔬 {t('homepage.features_section.badge', 'Tecnologia Militar')}</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">{t('homepage.features_section.title', 'Arsenal de Proteção Anti-Fraude')}</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t('homepage.features_section.subtitle', 'Cada componente é uma camada de segurança impenetrável contra fraudadores.')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card className={`bg-slate-800/50 border-2 ${feature.color} hover:scale-105 transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-slate-700 text-slate-300">
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300 text-base mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-400 text-sm font-medium">
                      ⚠️ {feature.threat}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Threat Intelligence */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
                <span className="text-red-400 text-sm font-medium">🚨 {t('homepage.threat_intelligence.badge', 'Monitoramento Ativo')}</span>
              </div>
              <CardTitle className="text-2xl text-white mb-4">
                {t('homepage.threat_intelligence.title', 'Centro de Comando Anti-Fraude')}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {t('homepage.threat_intelligence.subtitle', 'Todos os sistemas de proteção operando em máxima capacidade')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center bg-slate-900/50 rounded-lg p-6">
                <div className="text-2xl font-bold text-green-400 mb-2">{t('homepage.threat_intelligence.edge_defense', 'Edge Defense')}</div>
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-green-500 animate-pulse"></div>
                <p className="text-sm text-slate-400">{t('homepage.threat_intelligence.edge_status', '99.99% Blindagem')}</p>
                <p className="text-xs text-green-400 mt-1">⚡ {t('homepage.threat_intelligence.edge_response', 'Resposta instantânea')}</p>
              </div>
              <div className="text-center bg-slate-900/50 rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-400 mb-2">{t('homepage.threat_intelligence.global_network', 'Rede Global')}</div>
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-blue-500 animate-pulse"></div>
                <p className="text-sm text-slate-400">{t('homepage.threat_intelligence.sentinels', '1,247 Sentinelas')}</p>
                <p className="text-xs text-blue-400 mt-1">🌐 {t('homepage.threat_intelligence.global_coverage', 'Cobertura mundial')}</p>
              </div>
              <div className="text-center bg-slate-900/50 rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-400 mb-2">{t('homepage.threat_intelligence.ai_vigilant', 'IA Vigilante')}</div>
                <div className="w-4 h-4 rounded-full mx-auto mb-2 bg-purple-500 animate-pulse"></div>
                <p className="text-sm text-slate-400">{t('homepage.threat_intelligence.continuous_learning', 'Aprendizado Contínuo')}</p>
                <p className="text-xs text-purple-400 mt-1">🧠 {t('homepage.threat_intelligence.always_evolving', 'Evoluindo sempre')}</p>
              </div>
              <div className="text-center bg-slate-900/50 rounded-lg p-6">
                <div className="text-2xl font-bold text-red-400 mb-2">{t('homepage.threat_intelligence.threats_neutralized', 'Ameaças Neutralizadas')}</div>
                <div className="text-3xl font-bold text-green-400">{systemStatus.uptime}</div>
                <p className="text-sm text-slate-400">{t('homepage.threat_intelligence.last_24h', 'Últimas 24h')}</p>
                <p className="text-xs text-red-400 mt-1">🛡️ {t('homepage.threat_intelligence.total_security', 'Segurança total')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Urgency CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-2xl p-12"
        >
          <div className="text-6xl mb-6">{t('homepage.urgency_cta.emoji', '⚠️')}</div>
          <h2 className="text-4xl font-bold mb-6 text-white">
            {t('homepage.urgency_cta.title_line1', 'Cada Minuto Sem Proteção =')}
            <br />
            <span className="text-red-400">{t('homepage.urgency_cta.title_highlight', 'Dinheiro Perdido')}</span>
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {t('homepage.urgency_cta.subtitle', 'Enquanto você lê isso, fraudadores estão atacando sistemas desprotegidos. Não seja a próxima vítima - proteja seu negócio agora.')}
          </p>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{t('homepage.urgency_cta.stat1_value', 'R$ 137.000')}</div>
              <div className="text-sm text-slate-400">{t('homepage.urgency_cta.stat1_label', 'Perdido por hora no Brasil')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">{t('homepage.urgency_cta.stat2_value', '2.3 seg')}</div>
              <div className="text-sm text-slate-400">{t('homepage.urgency_cta.stat2_label', 'Nova tentativa de fraude')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{t('homepage.urgency_cta.stat3_value', '94%')}</div>
              <div className="text-sm text-slate-400">{t('homepage.urgency_cta.stat3_label', 'Fraudes que bloqueamos')}</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600 text-white" asChild>
              <Link href="/signup">
                🚀 {t('homepage.urgency_cta.cta_primary', 'Proteger Agora - Grátis por 30 Dias')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-red-500 text-red-400 hover:bg-red-500 hover:text-white" asChild>
              <Link href="/pricing">
                💰 {t('homepage.urgency_cta.cta_secondary', 'Ver Preços e Economia')}
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              ✅ {t('homepage.urgency_cta.guarantee1', 'Sem compromisso')}
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              ✅ {t('homepage.urgency_cta.guarantee2', 'Cancelamento a qualquer momento')}
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              ✅ {t('homepage.urgency_cta.guarantee3', 'Garantia de reembolso')}
            </div>
          </div>
        </motion.div>
      </section>


        <Footer />
      </div>
    </>
  );
}