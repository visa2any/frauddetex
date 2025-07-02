'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const productLinks = [
  { href: '/solutions', label: 'Soluções', icon: '🎯' },
  { href: '/pricing', label: 'Preços', icon: '💰' },
  { href: '/docs', label: 'Documentação', icon: '📚' },
  { href: '/api', label: 'API Reference', icon: '🔌' },
  { href: '/integrations', label: 'Integrações', icon: '🔗' },
  { href: '/changelog', label: 'Changelog', icon: '📝' }
];

const securityLinks = [
  { href: '/security', label: 'Centro de Segurança', icon: '🔒' },
  { href: '/compliance', label: 'Compliance', icon: '✅' },
  { href: '/privacy', label: 'Privacidade', icon: '🛡️' },
  { href: '/terms', label: 'Termos de Uso', icon: '📄' },
  { href: '/sla', label: 'SLA & Uptime', icon: '⚡' },
  { href: '/status', label: 'Status da Plataforma', icon: '📡' }
];

const communityLinks = [
  { href: '/discord', label: 'Discord', icon: '💬' },
  { href: '/github', label: 'GitHub', icon: '🐙' },
  { href: '/blog', label: 'Blog', icon: '📖' },
  { href: '/events', label: 'Eventos', icon: '🎪' },
  { href: '/webinars', label: 'Webinars', icon: '🎥' },
  { href: '/newsletter', label: 'Newsletter', icon: '📬' }
];

const companyLinks = [
  { href: '/about', label: 'Sobre Nós', icon: '🏢' },
  { href: '/careers', label: 'Carreiras', icon: '💼' },
  { href: '/contact', label: 'Contato', icon: '📞' },
  { href: '/press', label: 'Imprensa', icon: '📰' },
  { href: '/investors', label: 'Investidores', icon: '💹' },
  { href: '/partners', label: 'Parceiros', icon: '🤝' }
];

const serviceLinks = [
  { href: '/fraud-detection', label: 'Detecção de Fraudes', icon: '🛡️' },
  { href: '/behavioral-analysis', label: 'Análise Comportamental', icon: '🧠' },
  { href: '/real-time-monitoring', label: 'Monitoramento em Tempo Real', icon: '⚡' },
  { href: '/threat-intelligence', label: 'Inteligência de Ameaças', icon: '🕵️' },
  { href: '/compliance-tools', label: 'Ferramentas de Compliance', icon: '✅' },
  { href: '/custom-rules', label: 'Regras Personalizadas', icon: '⚙️' }
];

const technologiesLinks = [
  { href: '/machine-learning', label: 'Machine Learning', icon: '🤖' },
  { href: '/edge-computing', label: 'Edge Computing', icon: '🌐' },
  { href: '/blockchain', label: 'Blockchain', icon: '⛓️' },
  { href: '/api-integration', label: 'Integração de APIs', icon: '🔌' },
  { href: '/cloud-infrastructure', label: 'Infraestrutura em Nuvem', icon: '☁️' },
  { href: '/security-protocols', label: 'Protocolos de Segurança', icon: '🔒' }
];

const portfolioLinks = [
  { href: '/case-studies', label: 'Estudos de Caso', icon: '📊' },
  { href: '/success-stories', label: 'Histórias de Sucesso', icon: '🏆' },
  { href: '/client-testimonials', label: 'Depoimentos', icon: '💬' },
  { href: '/industry-solutions', label: 'Soluções por Setor', icon: '🏭' },
  { href: '/implementation-guide', label: 'Guia de Implementação', icon: '📋' },
  { href: '/best-practices', label: 'Melhores Práticas', icon: '⭐' }
];

const certifications = [
  { name: 'PCI DSS', icon: '🔒' },
  { name: 'ISO 27001', icon: '🏆' },
  { name: 'SOC 2', icon: '✅' },
  { name: 'LGPD', icon: '🛡️' },
  { name: 'Pentesting', icon: '🔍' }
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        {/* Top Section - FraudShield Revolutionary */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {/* Logo Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold">🛡️</span>
              </div>
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-xl opacity-30 blur-lg"></div>
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-4xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  FraudDetex
                </span>
                <div className="ml-3 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center text-sm text-slate-400 space-x-3 mt-1">
                <span>🔒 Proteção 24/7</span>
                <span>•</span>
                <span>🚀 IA Explicável</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            O sistema mais avançado de <strong className="text-white">detecção de fraudes</strong> do mundo. 
            Proteja seu negócio com <strong className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">IA explicável</strong> e defesa em tempo real.
          </p>
          
          {/* CTA Section */}
          <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-2xl p-8 mb-12 border border-red-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pare de Perder Dinheiro com Fraudes
            </h3>
            <p className="text-slate-300 mb-6">
              Teste grátis por 30 dias e veja como podemos proteger seu negócio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0 px-8 py-3"
                asChild
              >
                <Link href="/signup">🛡️ Proteger Grátis por 30 Dias</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3"
                asChild
              >
                <Link href="/demo">🎯 Ver Demo ao Vivo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center">
              <span className="mr-2">🚀</span>
              Serviços
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center">
              <span className="mr-2">🔧</span>
              Tecnologias
            </h3>
            <ul className="space-y-3">
              {technologiesLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portfolio */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center">
              <span className="mr-2">🏆</span>
              Portfolio
            </h3>
            <ul className="space-y-3">
              {portfolioLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white flex items-center">
              <span className="mr-2">🏢</span>
              Empresa
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="flex items-center space-x-2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-bold text-white mb-6">
            🏆 Certificações e Especialidades
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {certifications.map((cert, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 bg-slate-900/50 rounded-lg px-4 py-2 border border-cyan-500/20"
              >
                <span className="text-lg">{cert.icon}</span>
                <span className="text-sm font-medium text-slate-300">{cert.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-slate-900/30 to-slate-800/30 rounded-xl p-8 mb-8 border border-red-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-semibold text-white mb-2">Contato</h4>
              <p className="text-red-400 font-medium">info@frauddetex.com</p>
              <p className="text-slate-400 text-sm">Resposta em 2h</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚨</div>
              <h4 className="font-semibold text-white mb-2">Emergências</h4>
              <p className="text-red-400 font-medium">24/7 SOC</p>
              <p className="text-slate-400 text-sm">Proteção contínua</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🌍</div>
              <h4 className="font-semibold text-white mb-2">Cobertura Global</h4>
              <p className="text-slate-400">Proteção mundial</p>
              <p className="text-slate-400">Edge computing</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">94%</div>
            <div className="text-sm text-slate-400">Taxa de Detecção</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400 mb-1">&lt;50ms</div>
            <div className="text-sm text-slate-400">Tempo de Resposta</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">50M+</div>
            <div className="text-sm text-slate-400">Transações Protegidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
            <div className="text-sm text-slate-400">Uptime SLA</div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-slate-400">
                &copy; 2024 FraudDetex. Todos os direitos reservados.
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Protegendo negócios digitais contra fraudes desde 2024
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy" 
                className="text-slate-400 hover:text-red-400 transition-colors text-sm"
              >
                Privacidade
              </Link>
              <Link 
                href="/terms" 
                className="text-slate-400 hover:text-red-400 transition-colors text-sm"
              >
                Termos
              </Link>
              <Link 
                href="/cookies" 
                className="text-slate-400 hover:text-red-400 transition-colors text-sm"
              >
                Cookies
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 text-sm">Feito com</span>
                <span className="text-red-500">❤️</span>
                <span className="text-slate-500 text-sm">no Brasil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}