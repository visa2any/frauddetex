'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Clock, Code, Shield, Lightbulb, ArrowRight, CheckCircle, Heart, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function CareersPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const benefits = [
    {
      icon: Heart,
      title: 'Bem-estar Total',
      description: 'Plano de saúde premium, seguro de vida, auxílio psicológico e programas de wellness.'
    },
    {
      icon: Lightbulb,
      title: 'Crescimento Contínuo',
      description: 'Budget para cursos, conferências, certificações e development plan personalizado.'
    },
    {
      icon: Users,
      title: 'Flexibilidade',
      description: 'Trabalho remoto, horários flexíveis e política de férias ilimitadas.'
    },
    {
      icon: Star,
      title: 'Equity e Bonificações',
      description: 'Participação nos lucros, stock options e bonificações por performance.'
    }
  ];

  const jobs = [
    {
      title: 'Senior ML Engineer',
      department: 'Engineering',
      location: 'Remote / São Paulo',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Desenvolva modelos de ML de ponta para detecção de fraudes em tempo real.',
      skills: ['Python', 'TensorFlow', 'Kubernetes', 'AWS']
    },
    {
      title: 'Security Engineer',
      department: 'Security',
      location: 'Remote / Rio de Janeiro',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Implemente e monitore protocolos de segurança enterprise.',
      skills: ['Cybersecurity', 'SOC', 'SIEM', 'Cloud Security']
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Construa e mantenha nossa infraestrutura cloud distribuída.',
      skills: ['Kubernetes', 'Terraform', 'AWS', 'Monitoring']
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'São Paulo',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Lidere o desenvolvimento de features inovadoras de detecção.',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'UX']
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Desenvolva interfaces intuitivas para nossos dashboards.',
      skills: ['React', 'TypeScript', 'Next.js', 'Design Systems']
    },
    {
      title: 'Data Scientist',
      department: 'Data',
      location: 'Remote / São Paulo',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Analise padrões complexos de fraude e desenvolva insights.',
      skills: ['Python', 'R', 'Statistics', 'Machine Learning']
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando oportunidades...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Carreiras - Junte-se ao Futuro da Detecção de Fraudes | FraudDetex"
        description="Oportunidades únicas em ML, cybersecurity e fintech. Trabalhe remotamente com os melhores benefícios e faça parte da revolução anti-fraude."
        keywords="carreiras, jobs, vagas, machine learning jobs, cybersecurity careers, fintech jobs, remote work, tech careers"
        url="https://frauddetex.com/careers"
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
            <div className="inline-flex items-center bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2 mb-8">
              <Users className="h-4 w-4 text-pink-400 mr-2" />
              <span className="text-pink-400 text-sm font-medium">💼 Carreiras</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Construa o <span className="text-pink-400">Futuro</span>
              <br />
              <span className="text-pink-400">Conosco</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Junte-se a uma equipe de classe mundial que está revolucionando a detecção de fraudes com tecnologia de ponta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-pink-500 hover:bg-pink-600 text-white" asChild>
                <Link href="#vagas">
                  💼 Ver Vagas Abertas
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white" asChild>
                <Link href="#cultura">
                  Conhecer Nossa Cultura
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Culture Section */}
        <section id="cultura" className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Nossa Cultura</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Ambiente colaborativo, inovador e inclusivo onde todos podem crescer e fazer a diferença.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full text-center">
                  <CardHeader>
                    <div className="mx-auto p-3 rounded-full bg-pink-500/20 border border-pink-500/40 w-fit">
                      <benefit.icon className="h-6 w-6 text-pink-400" />
                    </div>
                    <CardTitle className="text-lg text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Jobs Section */}
        <section id="vagas" className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Vagas Abertas</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Oportunidades para construir o futuro da detecção de fraudes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <CardTitle className="text-xl text-white mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/40">
                          {job.type}
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/40">
                          {job.experience}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-slate-300 mb-4">
                      {job.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      Candidatar-se
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
          >
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">50+</div>
              <div className="text-slate-300">Talentos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-slate-300">Países</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
              <div className="text-slate-300">Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">$2M+</div>
              <div className="text-slate-300">Investimento em People</div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">💼</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Não Viu a Vaga
              <br />
              <span className="text-pink-400">Perfeita?</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Estamos sempre em busca de talentos excepcionais. Envie seu currículo e vamos conversar!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-pink-500 hover:bg-pink-600 text-white" asChild>
                <Link href="mailto:careers@frauddetex.com">
                  📧 Enviar Currículo Espontâneo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com RH
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                100% Remoto
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Equity para Todos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Crescimento Acelerado
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}