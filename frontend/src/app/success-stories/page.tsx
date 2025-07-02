'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, TrendingUp, Users, Heart, ArrowRight, CheckCircle, Quote } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function SuccessStoriesPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const stories = [
    {
      company: 'TechBank',
      industry: 'Digital Banking',
      challenge: 'Reduzir fraudes sem afetar UX',
      achievement: '94% redução em fraudes, 0% impacto na experiência do usuário',
      quote: 'FraudDetex transformou nossa operação. Conseguimos reduzir fraudes drasticamente mantendo a experiência fluida para nossos clientes legítimos.',
      person: 'Maria Silva',
      role: 'Head of Security',
      metrics: { fraudReduction: '94%', customerSatisfaction: '98%', roi: '450%' },
      color: 'blue'
    },
    {
      company: 'GlobalPay',
      industry: 'Fintech',
      challenge: 'Combater lavagem de dinheiro',
      achievement: 'Compliance 100% + redução 87% em falsos positivos',
      quote: 'A precisão da IA do FraudDetex é impressionante. Detectamos muito mais casos reais enquanto reduzimos drasticamente os falsos alarmes.',
      person: 'Carlos Eduardo',
      role: 'Compliance Officer',
      metrics: { compliance: '100%', falsePositives: '-87%', efficiency: '+65%' },
      color: 'green'
    },
    {
      company: 'E-Shop Plus',
      industry: 'E-commerce',
      challenge: 'Fraudes em marketplaces',
      achievement: 'R$ 12M em perdas evitadas no primeiro ano',
      quote: 'O ROI foi fantástico. Já no primeiro trimestre vimos uma redução significativa em chargebacks e aumentamos nossa confiabilidade.',
      person: 'Ana Beatriz',
      role: 'CFO',
      metrics: { savings: 'R$ 12M', chargebacks: '-82%', revenue: '+18%' },
      color: 'purple'
    },
    {
      company: 'CryptoTrade Pro',
      industry: 'Cryptocurrency',
      challenge: 'Wash trading e manipulação',
      achievement: '91% redução em atividades suspeitas',
      quote: 'Nossa exchange se tornou referência em segurança. A confiança dos traders aumentou significativamente após implementarmos o FraudDetex.',
      person: 'Roberto Chen',
      role: 'CTO',
      metrics: { suspiciousActivity: '-91%', userTrust: '+45%', volume: '+25%' },
      color: 'orange'
    },
    {
      company: 'InsureMax',
      industry: 'Insurance',
      challenge: 'Fraudes em sinistros',
      achievement: '89% precisão na detecção de fraudes',
      quote: 'A automação do FraudDetex nos permitiu processar sinistros 3x mais rápido enquanto detectamos muito mais fraudes.',
      person: 'Patricia Santos',
      role: 'Head of Claims',
      metrics: { accuracy: '89%', processingTime: '-70%', fraudDetection: '+156%' },
      color: 'teal'
    },
    {
      company: 'DigitalWallet',
      industry: 'Payments',
      challenge: 'Account takeover attacks',
      achievement: '96% redução em ataques bem-sucedidos',
      quote: 'A biometria comportamental é revolucionária. Detectamos tentativas de takeover que outros sistemas não conseguiriam.',
      person: 'Fernando Lima',
      role: 'Security Director',
      metrics: { attackPrevention: '96%', userExperience: '+28%', trustScore: '+52%' },
      color: 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/40',
      red: 'bg-red-500/20 text-red-400 border-red-500/40'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórias de sucesso...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Histórias de Sucesso - Transformações Reais com FraudDetex"
        description="Descubra como empresas líderes transformaram suas operações e reduziram fraudes drasticamente com FraudDetex. Histórias reais, resultados comprovados."
        keywords="histórias sucesso, success stories, testimonials, fraud reduction, client transformation, business results"
        url="https://frauddetex.com/success-stories"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="company" />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
              <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-yellow-400 text-sm font-medium">🏆 Histórias de Sucesso</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Sucessos que <span className="text-yellow-400">Inspiram</span>
              <br />
              <span className="text-yellow-400">Resultados Reais</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Conheça as transformações extraordinárias de empresas que escolheram FraudDetex e revolucionaram sua proteção contra fraudes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
                <Link href="#stories">
                  🏆 Ver Histórias Completas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black" asChild>
                <Link href="/contact">
                  Ser Nossa Próxima História
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Impact Stats */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-yellow-400 mb-2">50+</div>
                <p className="text-slate-300">Empresas Transformadas</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-400 mb-2">$100M+</div>
                <p className="text-slate-300">Perdas Evitadas</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">94%</div>
                <p className="text-slate-300">Redução Média Fraudes</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">99.2%</div>
                <p className="text-slate-300">Satisfação dos Clientes</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Success Stories Grid */}
        <section id="stories" className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Transformações Extraordinárias</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Cada empresa tem uma história única de como FraudDetex transformou sua operação e trouxe resultados excepcionais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <motion.div
                key={story.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{story.company}</CardTitle>
                        <Badge className={getColorClasses(story.color)}>
                          {story.industry}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Desafio:</h4>
                        <p className="text-sm text-slate-400">{story.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Conquista:</h4>
                        <p className="text-sm text-emerald-400 font-medium">{story.achievement}</p>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <Quote className="absolute top-0 left-0 h-4 w-4 text-slate-500" />
                      <blockquote className="italic text-slate-300 pl-6 pr-4">
                        &ldquo;{story.quote}&rdquo;
                      </blockquote>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {story.person.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{story.person}</div>
                        <div className="text-slate-400 text-xs">{story.role}</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      {Object.entries(story.metrics).map(([key, value]) => (
                        <div key={key}>
                          <div className="font-bold text-emerald-400">{value}</div>
                          <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Awards Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Reconhecimento da Indústria</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Fintech Innovation Award 2024</h3>
                <p className="text-slate-300">Melhor solução de IA para detecção de fraudes</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Gartner Cool Vendor 2024</h3>
                <p className="text-slate-300">Reconhecimento em cybersecurity e risk management</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Customer Choice Award</h3>
                <p className="text-slate-300">99.2% de satisfação dos clientes</p>
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
            className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Pronto Para Escrever Sua
              <br />
              <span className="text-yellow-400">História de Sucesso?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Junte-se a empresas líderes que já transformaram suas operações com FraudDetex. Sua transformação começa agora.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-yellow-500 hover:bg-yellow-600 text-black" asChild>
                <Link href="/signup">
                  🚀 Começar Minha Transformação
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black" asChild>
                <Link href="/demo">
                  Ver Demo Personalizada
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Implementação Guiada
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Suporte Dedicado
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Resultados Garantidos
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}