'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function PressPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const pressReleases = [
    {
      title: 'FraudDetex Levanta $50M em Série B',
      date: '2024-06-15',
      outlet: 'TechCrunch',
      summary: 'Funding será usado para expansão internacional e desenvolvimento de IA avançada.',
      category: 'Funding'
    },
    {
      title: 'Redução de 94% em Fraudes no Setor Banking',
      date: '2024-05-20',
      outlet: 'Forbes',
      summary: 'Estudo comprova eficácia da plataforma FraudDetex em instituições financeiras.',
      category: 'Research'
    },
    {
      title: 'Parceria Estratégica com AWS',
      date: '2024-04-10',
      outlet: 'VentureBeat',
      summary: 'Integração nativa com serviços AWS acelera adoção empresarial.',
      category: 'Partnership'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Imprensa - Notícias e Press Releases | FraudDetex"
        description="Últimas notícias, press releases e cobertura da mídia sobre FraudDetex. Acompanhe nossos marcos e conquistas."
        keywords="imprensa, press releases, notícias, mídia, funding, partnerships, FraudDetex news"
        url="https://frauddetex.com/press"
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
            <div className="inline-flex items-center bg-gray-500/10 border border-gray-500/20 rounded-full px-4 py-2 mb-8">
              <Newspaper className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-400 text-sm font-medium">📰 Imprensa</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Na <span className="text-gray-400">Mídia</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Acompanhe as últimas notícias e marcos da FraudDetex na imprensa.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="space-y-6">
            {pressReleases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{item.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(item.date).toLocaleDateString('pt-BR')}
                          </div>
                          <span>{item.outlet}</span>
                        </div>
                      </div>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">{item.summary}</p>
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
            className="bg-gradient-to-r from-gray-900/20 to-slate-900/20 border border-gray-500/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">
              Contato para
              <br />
              <span className="text-gray-400">Imprensa</span>
            </h2>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg px-8 py-6 bg-gray-600 hover:bg-gray-700 text-white" asChild>
                <Link href="mailto:press@frauddetex.com">
                  📧 press@frauddetex.com
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