'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Settings, CheckCircle, Users, Zap, ArrowRight, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function ImplementationGuidePage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const steps = [
    {
      step: 1,
      title: 'Análise e Planejamento',
      duration: '1-2 semanas',
      description: 'Avaliação completa dos seus sistemas e definição da estratégia de implementação.',
      details: ['Auditoria de segurança atual', 'Mapeamento de fluxos', 'Definição de requisitos']
    },
    {
      step: 2,
      title: 'Configuração Inicial',
      duration: '3-5 dias',
      description: 'Setup da plataforma e configurações básicas personalizadas.',
      details: ['Criação de ambiente', 'Configuração de APIs', 'Integração básica']
    },
    {
      step: 3,
      title: 'Integração Técnica',
      duration: '1-2 semanas',
      description: 'Integração completa com seus sistemas e customização avançada.',
      details: ['Implementação de SDKs', 'Configuração de webhooks', 'Testes de integração']
    },
    {
      step: 4,
      title: 'Treinamento e Go-Live',
      duration: '1 semana',
      description: 'Treinamento da equipe e ativação em ambiente de produção.',
      details: ['Treinamento técnico', 'Documentação', 'Monitoramento inicial']
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando guia de implementação...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Guia de Implementação - Passo a Passo para Integrar FraudDetex"
        description="Guia completo de implementação FraudDetex. Do planejamento ao go-live em 4-6 semanas com suporte especializado."
        keywords="implementation guide, integration guide, setup, API integration, technical implementation"
        url="https://frauddetex.com/implementation-guide"
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
            <div className="inline-flex items-center bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
              <Settings className="h-4 w-4 text-indigo-400 mr-2" />
              <span className="text-indigo-400 text-sm font-medium">📋 Guia de Implementação</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Do Zero ao <span className="text-indigo-400">Protegido</span>
              <br />
              <span className="text-indigo-400">em 4-6 Semanas</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Processo estruturado e suporte especializado para implementação rápida e eficiente.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                          {step.step}
                        </div>
                        <div>
                          <CardTitle className="text-xl text-white">{step.title}</CardTitle>
                          <div className="flex items-center mt-1">
                            <Clock className="h-4 w-4 text-slate-400 mr-1" />
                            <span className="text-slate-400 text-sm">{step.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/40">
                        Etapa {step.step}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">{step.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {detail}
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
            className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Implementação com
              <br />
              <span className="text-indigo-400">Suporte Completo</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-500 hover:bg-indigo-600 text-white" asChild>
                <Link href="/contact">
                  🚀 Iniciar Implementação
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