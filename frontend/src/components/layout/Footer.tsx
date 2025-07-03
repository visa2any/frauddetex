'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/theme-context';

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
  const { theme } = useTheme();

  // Classes condicionais baseadas no tema
  const footerBgClasses = theme === 'light' 
    ? "bg-slate-100 border-slate-200"
    : "bg-slate-950 border-slate-800";

  const textClasses = theme === 'light'
    ? "text-slate-800"
    : "text-white";

  const subtitleClasses = theme === 'light'
    ? "text-slate-600"
    : "text-slate-300";

  const linkClasses = theme === 'light'
    ? "text-slate-600 hover:text-cyan-600"
    : "text-slate-400 hover:text-cyan-400";

  const ctaBgClasses = theme === 'light'
    ? "bg-slate-200/50 border-slate-300/20"
    : "bg-slate-900/50 border-slate-800/50";

  return (
    <footer className={`${footerBgClasses} border-t text-white`}>
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
              <div className={`flex items-center text-sm space-x-3 mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>🔒 Proteção 24/7</span>
                <span>•</span>
                <span>🚀 IA Explicável</span>
              </div>
            </div>
          </div>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${subtitleClasses}`}>
            O sistema mais avançado de <strong className={textClasses}>detecção de fraudes</strong> do mundo. 
            Proteja seu negócio com <strong className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">IA explicável</strong> e defesa em tempo real.
          </p>
          
          {/* CTA Section */}
          <div className={`${ctaBgClasses} rounded-2xl p-8 mb-12 border border-red-500/20`}>
            <h3 className={`text-2xl font-bold mb-4 ${textClasses}`}>
              Pare de Perder Dinheiro com Fraudes
            </h3>
            <p className={`${subtitleClasses} mb-6`}>
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
            <h3 className={`font-bold text-lg mb-6 flex items-center ${textClasses}`}>
              <span className="mr-2">🚀</span>
              Serviços
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`flex items-center space-x-2 transition-colors ${linkClasses}`}
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
            <h3 className={`font-bold text-lg mb-6 flex items-center ${textClasses}`}>
              <span className="mr-2">🔧</span>
              Tecnologias
            </h3>
            <ul className="space-y-3">
              {technologiesLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`flex items-center space-x-2 transition-colors ${linkClasses}`}
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
            <h3 className={`font-bold text-lg mb-6 flex items-center ${textClasses}`}>
              <span className="mr-2">🏆</span>
              Portfolio
            </h3>
            <ul className="space-y-3">
              {portfolioLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`flex items-center space-x-2 transition-colors ${linkClasses}`}
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
            <h3 className={`font-bold text-lg mb-6 flex items-center ${textClasses}`}>
              <span className="mr-2">🏢</span>
              Empresa
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={`flex items-center space-x-2 transition-colors ${linkClasses}`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className={`text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} mb-4 md:mb-0`}>
              © 2024 FraudDetex. Todos os direitos reservados.
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4">
              {certifications.map((cert) => (
                <div key={cert.name} className={`flex items-center space-x-1 text-xs ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                  <span>{cert.icon}</span>
                  <span>{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}