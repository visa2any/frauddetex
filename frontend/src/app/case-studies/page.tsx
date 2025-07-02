'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, Shield, DollarSign, Users, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function CaseStudiesPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const caseStudies = [
    {
      company: 'Banco Digital Alpha',
      industry: 'Fintech',
      size: '2M+ usuários',
      challenge: 'Redução de 89% em fraudes de cartão de crédito',
      solution: 'Implementação de ML em tempo real + biometria comportamental',
      results: {
        fraudReduction: '89%',
        falsePositives: '-76%',
        customerSatisfaction: '+34%',
        roi: '420%'
      },
      description: 'Como um banco digital revolucionou sua detecção de fraudes e aumentou a confiança dos clientes.',
      color: 'blue'
    },
    {
      company: 'E-commerce Global Beta',
      industry: 'E-commerce',
      size: '50M+ transações/mês',
      challenge: 'Combate a fraudes de chargebacks em marketplace',
      solution: 'Regras customizadas + threat intelligence + edge computing',
      results: {
        fraudReduction: '94%',
        chargebacks: '-82%',
        revenue: '+15%',
        roi: '650%'
      },
      description: 'Marketplace global elimina fraudes de chargebacks e aumenta revenue significativamente.',
      color: 'green'
    },
    {
      company: 'Fintech Gamma',
      industry: 'Pagamentos',
      size: '5M+ usuários',
      challenge: 'Detecção de lavagem de dinheiro em tempo real',
      solution: 'IA avançada + blockchain + compliance automatizado',
      results: {
        fraudReduction: '96%',
        compliance: '+99%',
        operationalCost: '-45%',
        roi: '380%'
      },
      description: 'Fintech de pagamentos implementa detecção AML de próxima geração.',
      color: 'purple'
    },
    {
      company: 'InsurTech Delta',
      industry: 'Seguros',
      size: '1M+ apólices',
      challenge: 'Fraudes em sinistros de seguro auto',
      solution: 'Computer vision + NLP + análise comportamental',
      results: {
        fraudReduction: '87%',
        claimProcessing: '+65%',
        customerSatisfaction: '+28%',
        roi: '290%'
      },
      description: 'Seguradora revoluciona análise de sinistros com IA e reduz fraudes drasticamente.',
      color: 'orange'
    },
    {
      company: 'Criptoexchange Epsilon',
      industry: 'Crypto',
      size: '$2B+ volume/dia',
      challenge: 'Detecção de wash trading e manipulação',
      solution: 'Graph analytics + ML + monitoramento 24/7',
      results: {
        fraudReduction: '91%',
        tradingVolume: '+22%',
        userTrust: '+41%',
        roi: '520%'
      },
      description: 'Exchange de criptomoedas elimina manipulações e aumenta confiança dos traders.',
      color: 'amber'
    },
    {
      company: 'Neobank Zeta',
      industry: 'Banking',
      size: '800K+ contas',
      challenge: 'Abertura de contas fraudulentas',
      solution: 'KYC inteligente + verificação de identidade + scoring',
      results: {
        fraudReduction: '93%',
        onboardingTime: '-70%',
        operationalCost: '-55%',
        roi: '410%'
      },
      description: 'Neobank elimina contas fraudulentas mantendo experiência fluida para clientes legítimos.',
      color: 'teal'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando casos de sucesso...</p>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/40'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <MetaTags 
        title="Casos de Sucesso - Resultados Reais de Clientes | FraudDetex"
        description="Cases reais de empresas que reduziram fraudes em até 96% com FraudDetex. Veja resultados, ROI e transformações de negócio."
        keywords="casos de sucesso, case studies, resultados, ROI, fraud reduction, client success, business transformation"
        url="https://frauddetex.com/case-studies"
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
            <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
              <FileText className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-emerald-400 text-sm font-medium">📊 Casos de Sucesso</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Resultados <span className="text-emerald-400">Reais</span>
              <br />
              <span className="text-emerald-400">Transformadores</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Descubra como empresas líderes reduziram fraudes em até 96% e aumentaram ROI em mais de 650% com FraudDetex.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="#cases">
                  📊 Ver Casos Completos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white" asChild>
                <Link href="/contact">
                  Discutir Seu Caso
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-400 mb-2">96%</div>
                <p className="text-slate-300">Redução máxima em fraudes</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">650%</div>
                <p className="text-slate-300">ROI máximo alcançado</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">$50M+</div>
                <p className="text-slate-300">Perdas evitadas anualmente</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-400 mb-2">99.8%</div>
                <p className="text-slate-300">Satisfação dos clientes</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Case Studies Grid */}
        <section id="cases" className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Transformações Reais</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Cases detalhados de como diferentes indústrias superaram seus desafios de fraude.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{study.company}</CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getColorClasses(study.color)}>
                            {study.industry}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {study.size}
                          </Badge>
                        </div>
                      </div>
                      <Building className="h-8 w-8 text-slate-400" />
                    </div>
                    
                    <CardDescription className="text-slate-300 mb-4">
                      {study.description}
                    </CardDescription>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Desafio:</h4>
                        <p className="text-sm text-slate-400">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Solução:</h4>
                        <p className="text-sm text-slate-400">{study.solution}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">{study.results.fraudReduction}</div>
                        <div className="text-xs text-slate-400">Redução Fraudes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{study.results.roi}</div>
                        <div className="text-xs text-slate-400">ROI</div>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      Ver Caso Completo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Sua Empresa Pode Ser a
              <br />
              <span className="text-emerald-400">Próxima História</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Descubra como podemos transformar sua estratégia de detecção de fraudes e gerar resultados similares.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-emerald-500 hover:bg-emerald-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Sua Transformação
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white" asChild>
                <Link href="/contact">
                  Agendar Consultoria
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Consultoria Gratuita
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Análise de Viabilidade
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ROI Personalizado
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}