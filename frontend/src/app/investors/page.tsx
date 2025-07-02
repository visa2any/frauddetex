'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function InvestorsPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações para investidores...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Relações com Investidores - Informações Financeiras | FraudDetex"
        description="Informações para investidores, resultados financeiros e oportunidades de investimento na FraudDetex."
        keywords="investor relations, financial results, investment opportunity, funding, valuation"
        url="https://frauddetex.com/investors"
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
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
              <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">📈 Investidores</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Oportunidade de <span className="text-green-400">Investimento</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Líder em crescimento no mercado de detecção de fraudes com tecnologia revolucionária.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-green-500/20 border border-green-500/40 w-fit mx-auto">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-center text-white">Crescimento</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">300%</div>
                <p className="text-slate-300">Crescimento anual de receita</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/40 w-fit mx-auto">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-center text-white">ARR</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">$25M</div>
                <p className="text-slate-300">Receita recorrente anual</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="p-3 rounded-full bg-purple-500/20 border border-purple-500/40 w-fit mx-auto">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-center text-white">Clientes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                <p className="text-slate-300">Empresas protegidas</p>
              </CardContent>
            </Card>
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
              Interessado em
              <br />
              <span className="text-green-400">Investir?</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="mailto:investors@frauddetex.com">
                  📧 Contato Investidores
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