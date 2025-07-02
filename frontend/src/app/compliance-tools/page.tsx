'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, FileText, AlertTriangle, Eye, Lock, ArrowRight, Download, Settings } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function ComplianceToolsPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    compliance: 98.7,
    audits: 247,
    certifications: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        compliance: 97.5 + Math.random() * 2,
        audits: prev.audits + Math.floor(Math.random() * 2),
        certifications: 12 + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const tools = [
    {
      icon: FileText,
      title: 'Relatórios de Compliance',
      description: 'Gere relatórios automáticos para LGPD, SOC 2, ISO 27001 e outras certificações.',
      features: ['Relatórios automáticos', 'Templates personalizados', 'Exportação PDF/Excel'],
      color: 'blue'
    },
    {
      icon: Eye,
      title: 'Auditoria em Tempo Real',
      description: 'Monitore continuamente a conformidade com regulamentações e políticas internas.',
      features: ['Monitoramento 24/7', 'Alertas automáticos', 'Dashboard executivo'],
      color: 'green'
    },
    {
      icon: Lock,
      title: 'Controle de Acesso',
      description: 'Gerencie permissões e controles de acesso com base em políticas de compliance.',
      features: ['RBAC avançado', 'Logs de acesso', 'Aprovações workflow'],
      color: 'purple'
    },
    {
      icon: AlertTriangle,
      title: 'Gestão de Riscos',
      description: 'Identifique, avalie e mitigue riscos de compliance em tempo real.',
      features: ['Risk scoring', 'Planos de mitigação', 'Relatórios executivos'],
      color: 'red'
    }
  ];

  const certifications = [
    { name: 'LGPD', status: 'Compliant', icon: '🇧🇷' },
    { name: 'GDPR', status: 'Compliant', icon: '🇪🇺' },
    { name: 'SOC 2 Type II', status: 'Certified', icon: '🛡️' },
    { name: 'ISO 27001', status: 'Certified', icon: '🔒' },
    { name: 'PCI DSS', status: 'Level 1', icon: '💳' },
    { name: 'NIST Framework', status: 'Aligned', icon: '🇺🇸' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      green: 'bg-green-500/20 text-green-400 border-green-500/40',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      red: 'bg-red-500/20 text-red-400 border-red-500/40'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ferramentas de compliance...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Ferramentas de Compliance - Gestão Automatizada | FraudDetex"
        description="Suite completa de ferramentas para compliance automatizado. LGPD, GDPR, SOC 2, ISO 27001 e PCI DSS em uma plataforma única."
        keywords="compliance tools, LGPD, GDPR, SOC 2, ISO 27001, PCI DSS, audit automation, risk management"
        url="https://frauddetex.com/compliance-tools"
        type="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Header variant="solutions" />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 text-sm font-medium">✅ Compliance Automatizado</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Compliance <span className="text-green-400">Sem</span>
              <br />
              <span className="text-green-400">Complicação</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Suite completa de ferramentas para automatizar compliance, gerar relatórios e manter certificações sempre atualizadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  ✅ Automatizar Compliance
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-green-500 text-green-400 hover:bg-green-500 hover:text-white" asChild>
                <Link href="/demo">
                  Ver Ferramentas
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Real-time Stats */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Score de Compliance</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.compliance.toFixed(1)}%</div>
                <Progress value={stats.compliance} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Auditorias Realizadas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.audits}</div>
                <p className="text-xs text-slate-400">Este mês</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Certificações Ativas</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.certifications}</div>
                <p className="text-xs text-slate-400">Sempre atualizadas</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Tools Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Ferramentas de Compliance</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Automatize processos, gere relatórios e mantenha-se sempre em conformidade com as regulamentações.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className={`bg-slate-800/50 border-2 ${getColorClasses(tool.color)} hover:scale-105 transition-all duration-300 h-full`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${getColorClasses(tool.color)}`}>
                        <tool.icon className="h-6 w-6" />
                      </div>
                      <Button size="sm" variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                        <Download className="h-3 w-3 mr-1" />
                        Usar
                      </Button>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{tool.title}</CardTitle>
                    <p className="text-slate-300 text-base mb-4">{tool.description}</p>
                    <ul className="space-y-2">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-slate-400">
                          <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                  <span className="text-green-400 text-sm font-medium">🏆 Certificações</span>
                </div>
                <CardTitle className="text-2xl text-white mb-4">
                  Conformidade com Padrões Globais
                </CardTitle>
                <p className="text-slate-300">
                  Mantemos as mais altas certificações de segurança e compliance do mercado
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <div key={cert.name} className="text-center bg-slate-900/50 rounded-lg p-6">
                    <div className="text-2xl mb-2">{cert.icon}</div>
                    <div className="font-semibold text-white mb-1">{cert.name}</div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Automatize seu
              <br />
              <span className="text-green-400">Compliance Hoje</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Pare de perder tempo com relatórios manuais. Automatize compliance e mantenha certificações sempre atualizadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-green-500 hover:bg-green-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar Automação - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-green-500 text-green-400 hover:bg-green-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com Especialista
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Relatórios automáticos
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Certificações mantidas
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ✅ Conformidade garantida
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}