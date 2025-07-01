'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AboutPage() {
  const team = [
    {
      name: 'Dr. Marina Silva',
      role: 'CEO & Co-fundadora',
      avatar: '👩‍💻',
      bio: 'PhD em Computer Science pela USP, ex-pesquisadora do MIT. 15 anos em machine learning e segurança digital.',
      linkedin: '#'
    },
    {
      name: 'Prof. Carlos Mendes',
      role: 'CTO & Co-fundador',
      avatar: '👨‍🔬',
      bio: 'Professor titular de Cibersegurança na UNICAMP. Especialista em biometria comportamental e edge computing.',
      linkedin: '#'
    },
    {
      name: 'Eng. Ana Beatriz',
      role: 'Head of Engineering',
      avatar: '👩‍💻',
      bio: 'Ex-engenheira sênior do Google. Especialista em sistemas distribuídos e arquiteturas de baixa latência.',
      linkedin: '#'
    },
    {
      name: 'Dr. Roberto Santos',
      role: 'Head of Data Science',
      avatar: '👨‍🔬',
      bio: 'PhD em Estatística pela UFRJ. Ex-cientista de dados do Nubank. Especialista em detecção de anomalias.',
      linkedin: '#'
    }
  ];

  const timeline = [
    {
      year: '2021',
      title: 'Fundação da Empresa',
      description: 'FraudDetex é fundada por pesquisadores da USP e UNICAMP com foco em IA explicável para detecção de fraudes.'
    },
    {
      year: '2022',
      title: 'Primeira Patente',
      description: 'Registro da primeira patente de biometria comportamental em tempo real no Brasil.'
    },
    {
      year: '2023',
      title: 'Investimento Seed',
      description: 'Captação de R$ 15M em investimento Seed liderado pela Monashees e Kaszek Ventures.'
    },
    {
      year: '2024',
      title: 'Escala Nacional',
      description: 'Processamento de mais de 1 bilhão de transações e presença em 500+ empresas brasileiras.'
    }
  ];

  const values = [
    {
      icon: '🛡️',
      title: 'Segurança Primeiro',
      description: 'Priorizamos a proteção de dados e a privacidade dos usuários em todas as nossas decisões.'
    },
    {
      icon: '🔍',
      title: 'Transparência',
      description: 'Nossas decisões de IA são explicáveis e auditáveis, promovendo confiança e compliance.'
    },
    {
      icon: '⚡',
      title: 'Inovação Contínua',
      description: 'Investimos constantemente em pesquisa para estar sempre à frente das ameaças emergentes.'
    },
    {
      icon: '🤝',
      title: 'Colaboração',
      description: 'Acreditamos na força da comunidade e compartilhamento de inteligência contra fraudes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
              Sobre Nós
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Revolucionando a <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Detecção de Fraudes</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Somos uma empresa brasileira de tecnologia dedicada a criar as soluções mais avançadas 
              de detecção de fraudes do mundo, combinando inteligência artificial explicável, 
              biometria comportamental e edge computing.
            </p>
          </div>

          {/* Mission Vision Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Nossa Missão</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Proteger empresas e consumidores contra fraudes digitais através de tecnologia 
                  inovadora, transparente e acessível, democratizando a segurança digital no Brasil e no mundo.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Nossa Visão</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Ser a plataforma líder global em detecção de fraudes, reconhecida pela excelência 
                  técnica, inovação contínua e compromisso com a privacidade e transparência.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <span>💎</span>
                  <span>Nossos Valores</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>
                  Segurança, transparência, inovação e colaboração são os pilares que guiam 
                  nossas decisões e moldam nossa cultura organizacional.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values Details */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Nossos Valores em Ação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{value.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                        <p className="text-gray-300">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Nossa Jornada
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-gradient-to-b from-red-500 to-orange-500"></div>
              
              <div className="space-y-8">
                {timeline.map((event, index) => (
                  <div key={index} className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border-4 border-slate-900 z-10"></div>
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 flex-1 ${
                      index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                    }`}>
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge className="bg-red-500 text-white">{event.year}</Badge>
                            <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                          </div>
                          <p className="text-gray-300">{event.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Nossa Equipe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-red-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{member.avatar}</div>
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-red-400 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      LinkedIn →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white text-center mb-8">
                  FraudDetex em Números
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-400 mb-2">1B+</div>
                    <div className="text-gray-300">Transações Analisadas</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">500+</div>
                    <div className="text-gray-300">Empresas Protegidas</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">99.7%</div>
                    <div className="text-gray-300">Precisão na Detecção</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">&lt;50ms</div>
                    <div className="text-gray-300">Latência Média</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technology */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Nossa Tecnologia
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🧠</span>
                    <span>Edge Computing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-3">
                    Processamento distribuído próximo ao usuário para latência ultra-baixa.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• WebAssembly para performance nativa</li>
                    <li>• CDN global com 50+ pontos de presença</li>
                    <li>• Cache inteligente adaptativo</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>👆</span>
                    <span>Biometria Comportamental</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-3">
                    Análise de padrões únicos de comportamento humano.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Dinâmica de digitação em tempo real</li>
                    <li>• Padrões de movimento do mouse</li>
                    <li>• Timing de interações</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <span>🔍</span>
                    <span>IA Explicável</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-3">
                    Decisões transparentes e auditáveis.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• SHAP values para explicabilidade</li>
                    <li>• Relatórios detalhados de decisão</li>
                    <li>• Compliance com regulamentações</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Quer Conhecer Mais?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Estamos sempre abertos para conversas sobre tecnologia, parcerias ou 
                  oportunidades de carreira. Entre em contato conosco!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Link href="/demo">🚀 Testar Demo</Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Link href="/contact">📧 Falar Conosco</Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
                  >
                    <Link href="/careers">💼 Trabalhe Conosco</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}