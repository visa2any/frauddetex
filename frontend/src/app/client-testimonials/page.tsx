'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Quote, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function ClientTestimonialsPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const testimonials = [
    {
      quote: "FraudDetex transformou nossa operação. Reduzimos fraudes em 94% mantendo experiência fluida para clientes.",
      author: "Maria Silva",
      role: "CTO, TechBank",
      rating: 5,
      company: "TechBank"
    },
    {
      quote: "A precisão da IA é impressionante. Detectamos muito mais casos reais com 87% menos falsos positivos.",
      author: "Carlos Eduardo",
      role: "Head of Security, GlobalPay", 
      rating: 5,
      company: "GlobalPay"
    },
    {
      quote: "ROI fantástico. Já no primeiro trimestre vimos redução significativa em chargebacks.",
      author: "Ana Beatriz",
      role: "CFO, E-Shop Plus",
      rating: 5,
      company: "E-Shop Plus"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando depoimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Depoimentos de Clientes - O que Dizem Nossos Clientes | FraudDetex"
        description="Veja depoimentos reais de clientes satisfeitos com FraudDetex. Empresas que reduziram fraudes e aumentaram ROI significativamente."
        keywords="depoimentos, testimonials, cliente satisfeito, avaliações, feedback, reviews"
        url="https://frauddetex.com/client-testimonials"
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
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Quote className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">💬 Depoimentos</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              O que Nossos <span className="text-blue-400">Clientes</span>
              <br />
              <span className="text-blue-400">Dizem</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Depoimentos reais de empresas que transformaram sua proteção contra fraudes com FraudDetex.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 h-full">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-blue-400 mb-2" />
                    <CardTitle className="text-slate-300 text-base font-normal">
                      "{testimonial.quote}"
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-white font-semibold">{testimonial.author}</div>
                    <div className="text-slate-400 text-sm">{testimonial.role}</div>
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
            className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Seja Nosso Próximo
              <br />
              <span className="text-blue-400">Cliente Satisfeito</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-500 hover:bg-blue-600 text-white" asChild>
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