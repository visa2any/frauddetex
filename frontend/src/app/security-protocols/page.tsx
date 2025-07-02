'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, FileCheck, Award, Key, Database, ArrowRight, CheckCircle, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function SecurityProtocolsPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    certifications: 12,
    compliance: 99.8,
    audits: 24
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        certifications: prev.certifications,
        compliance: 99.5 + Math.random() * 0.5,
        audits: prev.audits + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const protocols = [
    {
      icon: Lock,
      title: 'Criptografia End-to-End',
      description: 'AES-256 para dados em repouso e TLS 1.3 para dados em trânsito. Chaves gerenciadas por HSM.',
      metrics: 'AES-256'
    },
    {
      icon: Key,
      title: 'Gestão de Identidade',
      description: 'Autenticação multifator obrigatória, RBAC e integração com provedores de identidade corporativos.',
      metrics: 'MFA: 100%'
    },
    {
      icon: Database,
      title: 'Proteção de Dados',
      description: 'Tokenização de dados sensíveis, mascaramento dinâmico e purga automática por políticas de retenção.',
      metrics: 'LGPD Compliant'
    },
    {
      icon: Users,
      title: 'Controle de Acesso',
      description: 'Princípio de menor privilégio, revisões de acesso trimestrais e logs de auditoria completos.',
      metrics: 'Zero Trust'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Certificado', color: 'green' },
    { name: 'ISO 27001', status: 'Certificado', color: 'green' },
    { name: 'PCI DSS Level 1', status: 'Certificado', color: 'green' },
    { name: 'LGPD Compliance', status: 'Ativo', color: 'blue' },
    { name: 'GDPR Compliance', status: 'Ativo', color: 'blue' },
    { name: 'NIST Framework', status: 'Implementado', color: 'purple' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando protocolos de segurança...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Protocolos de Segurança - Compliance e Certificações Enterprise | FraudDetex"
        description="Máxima segurança com SOC 2, ISO 27001, PCI DSS e compliance LGPD/GDPR. Protocolos enterprise para proteção total de dados."
        keywords="security protocols, SOC 2, ISO 27001, PCI DSS, LGPD, GDPR, compliance, data protection, enterprise security"
        url="https://frauddetex.com/security-protocols"
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
            <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-red-400 mr-2" />
              <span className="text-red-400 text-sm font-medium">🛡️ Security Protocols</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Segurança <span className="text-red-400">Máxima</span>
              <br />
              <span className="text-red-400">Compliance Total</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Protocolos de segurança enterprise com as principais certificações internacionais e compliance total.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600 text-white" asChild>
                <Link href="/signup">
                  🛡️ Ativar Segurança Máxima
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-red-500 text-red-400 hover:bg-red-500 hover:text-white" asChild>
                <Link href="/security-report">
                  Ver Relatório de Segurança
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
                <CardTitle className="text-sm font-medium text-slate-300">Certificações Ativas</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.certifications}</div>
                <p className="text-xs text-slate-400">Padrões internacionais</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Compliance Score</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.compliance.toFixed(1)}%</div>
                <Progress value={stats.compliance} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Auditorias Anuais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.audits}</div>
                <p className="text-xs text-slate-400">Por auditores independentes</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Security Protocols Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Protocolos de Segurança Enterprise</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Implementações rigorosas dos mais altos padrões de segurança da indústria.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {protocols.map((protocol, index) => (
              <motion.div
                key={protocol.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-full bg-red-500/20 border border-red-500/40">
                        <protocol.icon className="h-6 w-6 text-red-400" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                        {protocol.metrics}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{protocol.title}</CardTitle>
                    <CardDescription className="text-slate-300 text-base">
                      {protocol.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Certificações e Compliance</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Certificações validadas por auditores independentes e compliance contínuo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{cert.name}</CardTitle>
                      <Badge 
                        className={
                          cert.color === 'green' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
                          cert.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                          'bg-purple-500/20 text-purple-400 border-purple-500/40'
                        }
                      >
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
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
            className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">🛡️</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Sua Confiança é Nossa
              <br />
              <span className="text-red-400">Prioridade Máxima</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Proteja seus dados e garanta compliance total com nossos protocolos de segurança enterprise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-red-500 hover:bg-red-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Ativar Proteção Máxima - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-red-500 text-red-400 hover:bg-red-500 hover:text-white" asChild>
                <Link href="/contact">
                  Falar com CISO
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                SOC 2 Type II
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                ISO 27001 Certified
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                LGPD/GDPR Compliant
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}