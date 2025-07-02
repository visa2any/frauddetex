'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Building, Users, ArrowRight, CheckCircle, Heart } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function PartnersPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const partnerTypes = [
    {
      icon: Code,
      title: 'Technology Partners',
      description: 'Integre FraudDetex em suas soluções tecnológicas.',
      benefits: ['APIs abertas', 'Suporte técnico', 'Co-marketing'],
      color: 'blue'
    },
    {
      icon: Building,
      title: 'Channel Partners',
      description: 'Revenda nossas soluções para seus clientes.',
      benefits: ['Margens atrativas', 'Treinamento', 'Suporte vendas'],
      color: 'green'
    },
    {
      icon: Users,
      title: 'Strategic Partners',
      description: 'Parcerias estratégicas de longo prazo.',
      benefits: ['Joint solutions', 'Go-to-market', 'Inovação conjunta'],
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando programa de parceiros...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Parceiros - Programa de Parcerias FraudDetex"
        description="Junte-se ao nosso programa de parcerias. Oportunidades para integradores, revendedores e parceiros estratégicos."
        keywords="partners, partnership program, channel partners, technology partners, reseller program"
        url="https://frauddetex.com/partners"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="company" />

        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
              <Handshake className="h-4 w-4 text-orange-400 mr-2" />
              <span className="text-orange-400 text-sm font-medium">🤝 Parceiros</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Crescer <span className="text-orange-400">Juntos</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Junte-se ao nosso ecosistema de parceiros e expanda seu negócio com soluções anti-fraude líderes de mercado.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-full bg-orange-500/20 border border-orange-500/40">
                        <type.icon className="h-6 w-6 text-orange-400" />
                      </div>
                      <Badge className={getColorClasses(type.color)}>
                        Partner
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{type.title}</CardTitle>
                    <p className="text-slate-300 mb-4">{type.description}</p>
                    <div className="space-y-2">
                      {type.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {benefit}
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
            className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Pronto Para Ser
              <br />
              <span className="text-orange-400">Nosso Parceiro?</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="mailto:partners@frauddetex.com">
                  🚀 Aplicar para Parceria
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