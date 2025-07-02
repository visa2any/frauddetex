'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function BestPracticesPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const practices = [
    {
      title: 'Implementação em Camadas',
      description: 'Use múltiplas camadas de detecção para máxima eficácia.',
      tips: ['Combine regras e ML', 'Biometria comportamental', 'Análise em tempo real']
    },
    {
      title: 'Monitoramento Contínuo',
      description: 'Monitore e ajuste constantemente seus sistemas.',
      tips: ['Dashboards em tempo real', 'Alertas automáticos', 'Revisões regulares']
    },
    {
      title: 'Balanceamento de Risco',
      description: 'Equilibre segurança com experiência do usuário.',
      tips: ['Scoring adaptativo', 'Verificação escalonada', 'UX otimizada']
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando melhores práticas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Melhores Práticas - Guia de Prevenção à Fraudes | FraudDetex"
        description="Aprenda as melhores práticas para prevenção de fraudes. Estratégias comprovadas e dicas de especialistas em detecção de fraudes."
        keywords="melhores práticas, fraud prevention, best practices, security tips, fraud detection strategies"
        url="https://frauddetex.com/best-practices"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="resources" />

        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
              <Lightbulb className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">💡 Melhores Práticas</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Estratégias <span className="text-green-400">Comprovadas</span>
              <br />
              <span className="text-green-400">de Prevenção</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Aprenda com especialistas as melhores práticas para proteger seu negócio contra fraudes.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practices.map((practice, index) => (
              <motion.div
                key={practice.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardHeader>
                    <div className="p-3 rounded-full bg-green-500/20 border border-green-500/40 w-fit mx-auto mb-4">
                      <Shield className="h-6 w-6 text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-white text-center">{practice.title}</CardTitle>
                    <p className="text-slate-300 text-center">{practice.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {practice.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Implemente as Melhores
              <br />
              <span className="text-green-400">Práticas Hoje</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}