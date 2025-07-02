'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Link2, Lock, Zap, Hash, Blocks, ArrowRight, CheckCircle, FileCheck } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MetaTags from '@/components/seo/MetaTags';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

export default function BlockchainPage() {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    transactions: 847239,
    blocks: 12847,
    integrity: 100
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        transactions: prev.transactions + Math.floor(Math.random() * 50),
        blocks: prev.blocks + Math.floor(Math.random() * 2),
        integrity: 100
      }));
    }, 4000);

    setIsLoading(false);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Link2,
      title: 'Auditoria Imutável',
      description: 'Registro permanente e inalterável de todas as transações e decisões de detecção de fraude.',
      metrics: 'Imutabilidade: 100%'
    },
    {
      icon: Hash,
      title: 'Validação Criptográfica',
      description: 'Cada transação é verificada e validada através de algoritmos criptográficos avançados.',
      metrics: 'Segurança: SHA-256'
    },
    {
      icon: Blocks,
      title: 'Consensus Distribuído',
      description: 'Rede descentralizada que garante consenso sobre a legitimidade das transações.',
      metrics: 'Nodes: 500+'
    },
    {
      icon: FileCheck,
      title: 'Smart Contracts',
      description: 'Contratos inteligentes que executam automaticamente regras de compliance e auditoria.',
      metrics: 'Execução: Automática'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sincronizando blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        title="Blockchain Security - Segurança Descentralizada e Auditoria Imutável | FraudDetex"
        description="Tecnologia blockchain para auditoria imutável e transparência total. Smart contracts e consensus distribuído para máxima segurança."
        keywords="blockchain security, immutable audit, smart contracts, cryptocurrency security, distributed ledger, consensus"
        url="https://frauddetex.com/blockchain"
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
            <div className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8">
              <Blocks className="h-4 w-4 text-amber-400 mr-2" />
              <span className="text-amber-400 text-sm font-medium">⛓️ Blockchain Security</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Confiança <span className="text-amber-400">Absoluta</span>
              <br />
              <span className="text-amber-400">Descentralizada</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Leverage blockchain technology for immutable fraud detection records and decentralized security validation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-amber-500 hover:bg-amber-600 text-white" asChild>
                <Link href="/signup">
                  ⛓️ Ativar Blockchain Security
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white" asChild>
                <Link href="/demo">
                  Explorar Blockchain
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
                <CardTitle className="text-sm font-medium text-slate-300">Transações Validadas</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-400">{stats.transactions.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Na blockchain hoje</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Blocos Minerados</CardTitle>
                <Blocks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.blocks.toLocaleString()}</div>
                <p className="text-xs text-slate-400">Auditoria permanente</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Integridade dos Dados</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.integrity}%</div>
                <Progress value={stats.integrity} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Tecnologia Blockchain Avançada</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Garanta transparência total e auditoria imutável com nossa infraestrutura blockchain proprietária.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="bg-slate-800/50 border-slate-700 hover:scale-105 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/40">
                        <feature.icon className="h-6 w-6 text-amber-400" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/40">
                        {feature.metrics}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white mb-3">{feature.title}</CardTitle>
                    <CardDescription className="text-slate-300 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Casos de Uso Blockchain</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <FileCheck className="h-5 w-5 text-blue-400 mr-2" />
                  Auditoria Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Registros imutáveis para auditoria regulatória e compliance automático</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Lock className="h-5 w-5 text-purple-400 mr-2" />
                  Validação de Identidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Verificação descentralizada de identidade digital com máxima segurança</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Zap className="h-5 w-5 text-orange-400 mr-2" />
                  Smart Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">Execução automática de regras de negócio e policies de segurança</p>
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
            className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/20 rounded-2xl p-12"
          >
            <div className="text-6xl mb-6">⛓️</div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Segurança que Nunca
              <br />
              <span className="text-amber-400">Pode Ser Alterada</span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Implemente blockchain security para auditoria imutável e transparência total em sua detecção de fraudes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-amber-500 hover:bg-amber-600 text-white" asChild>
                <Link href="/signup">
                  🚀 Começar com Blockchain - Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-white" asChild>
                <Link href="/contact">
                  Consultar Arquitetura
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center items-center mt-8 space-x-8 text-sm text-slate-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Auditoria Imutável
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Smart Contracts
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                Consensus Distribuído
              </div>
            </div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
}