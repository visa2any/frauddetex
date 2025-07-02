'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, CreditCard, ShoppingCart, Shield, Coins, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function IndustrySolutionsPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const industries = [
    {
      icon: CreditCard,
      title: 'Banking & Fintech',
      description: 'Soluções especializadas para bancos digitais, fintechs e instituições financeiras.',
      features: ['Biometria comportamental', 'AML/KYC automático', 'Scoring em tempo real'],
      color: 'blue'
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Proteção completa para lojas online, marketplaces e plataformas digitais.',
      features: ['Detecção de chargebacks', 'Análise de carrinho', 'Proteção contra bots'],
      color: 'green'
    },
    {
      icon: Coins,
      title: 'Cryptocurrency',
      description: 'Segurança avançada para exchanges, wallets e plataformas de crypto.',
      features: ['Detecção wash trading', 'Análise blockchain', 'Compliance crypto'],
      color: 'orange'
    },
    {
      icon: FileText,
      title: 'Insurance',
      description: 'Detecção de fraudes em sinistros e processos de seguros.',
      features: ['Análise de claims', 'Computer vision', 'Scoring de risco'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando soluções por indústria...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Soluções por Indústria - Proteção Personalizada por Setor | FraudDetex"
        description="Soluções especializadas de detecção de fraudes para banking, e-commerce, crypto, seguros e mais. Proteção personalizada para cada indústria."
        keywords="soluções indústria, banking fraud, e-commerce security, crypto fraud, insurance fraud, industry solutions"
        url="https://frauddetex.com/industry-solutions"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="solutions" />

        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-8">
              <Building2 className="h-4 w-4 text-teal-400 mr-2" />
              <span className="text-teal-400 text-sm font-medium">🏢 Soluções por Indústria</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Proteção <span className="text-teal-400">Especializada</span>
              <br />
              <span className="text-teal-400">Por Setor</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Soluções customizadas para as necessidades específicas de cada indústria.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-full bg-teal-500/20 border border-teal-500/40">
                        <industry.icon className="h-6 w-6 text-teal-400" />
                      </div>
                      <Badge className={getColorClasses(industry.color)}>
                        Especializado
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{industry.title}</CardTitle>
                    <p className="text-slate-300 mb-4">{industry.description}</p>
                    <div className="space-y-2">
                      {industry.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardHeader>
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
            className="bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-teal-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Sua Indústria Tem
              <br />
              <span className="text-teal-400">Necessidades Únicas</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-teal-500 hover:bg-teal-600 text-white" asChild>
                <Link href="/contact">
                  🚀 Consulta Especializada
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