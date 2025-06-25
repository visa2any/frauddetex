'use client';

import { Badge } from '@/components/ui/badge';

const securityCertifications = [
  {
    name: 'PCI DSS Level 1',
    description: 'Máximo nível de segurança para pagamentos',
    icon: '🔒',
    color: 'green'
  },
  {
    name: 'ISO 27001',
    description: 'Gestão de segurança da informação',
    icon: '🏆',
    color: 'blue'
  },
  {
    name: 'SOC 2 Type II',
    description: 'Auditoria independente de controles',
    icon: '✅',
    color: 'purple'
  },
  {
    name: 'LGPD Compliant',
    description: 'Conformidade total com LGPD',
    icon: '🛡️',
    color: 'green'
  },
  {
    name: 'Penetration Tested',
    description: 'Testado por especialistas em segurança',
    icon: '🔍',
    color: 'red'
  },
  {
    name: '99.9% SLA',
    description: 'Garantia de disponibilidade',
    icon: '⚡',
    color: 'yellow'
  }
];

const performanceMetrics = [
  {
    metric: '< 50ms',
    description: 'Tempo de resposta médio',
    icon: '⚡'
  },
  {
    metric: '99.99%',
    description: 'Uptime garantido',
    icon: '🛡️'
  },
  {
    metric: '94%+',
    description: 'Taxa de detecção',
    icon: '🎯'
  },
  {
    metric: '0.3%',
    description: 'Falsos positivos',
    icon: '✅'
  }
];

const industryRecognition = [
  {
    award: 'Best AI Innovation 2024',
    organization: 'FinTech Awards',
    icon: '🏅'
  },
  {
    award: 'Top Security Solution',
    organization: 'CyberSec Brasil',
    icon: '🥇'
  },
  {
    award: 'Editor\'s Choice',
    organization: 'TechReview',
    icon: '⭐'
  }
];

interface TrustBadgesProps {
  variant?: 'compact' | 'full' | 'certifications' | 'performance';
  showTitle?: boolean;
}

export default function TrustBadges({ 
  variant = 'compact', 
  showTitle = true 
}: TrustBadgesProps) {
  
  if (variant === 'certifications') {
    return (
      <div className="py-8">
        {showTitle && (
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Certificações e Compliance</h3>
            <p className="text-slate-400">Segurança e conformidade de nível enterprise</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {securityCertifications.map((cert, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                cert.color === 'green' ? 'bg-green-500/20 border-2 border-green-500/40' :
                cert.color === 'blue' ? 'bg-blue-500/20 border-2 border-blue-500/40' :
                cert.color === 'purple' ? 'bg-purple-500/20 border-2 border-purple-500/40' :
                cert.color === 'red' ? 'bg-red-500/20 border-2 border-red-500/40' :
                'bg-yellow-500/20 border-2 border-yellow-500/40'
              }`}>
                <span>{cert.icon}</span>
              </div>
              <div className="font-medium text-white text-sm mb-1">{cert.name}</div>
              <div className="text-xs text-slate-400">{cert.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'performance') {
    return (
      <div className="py-8">
        {showTitle && (
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white mb-2">Performance Garantida</h3>
            <p className="text-slate-400">Métricas que importam para seu negócio</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="text-center bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{metric.metric}</div>
              <div className="text-sm text-slate-400">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          {/* Security Certifications */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
                <span className="text-green-400 text-sm font-medium">🔒 Máxima Segurança</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Certificações e Compliance</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Atendemos aos mais altos padrões de segurança e conformidade da indústria
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {securityCertifications.map((cert, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 ${
                    cert.color === 'green' ? 'bg-green-500/20 border-2 border-green-500/40 group-hover:border-green-400' :
                    cert.color === 'blue' ? 'bg-blue-500/20 border-2 border-blue-500/40 group-hover:border-blue-400' :
                    cert.color === 'purple' ? 'bg-purple-500/20 border-2 border-purple-500/40 group-hover:border-purple-400' :
                    cert.color === 'red' ? 'bg-red-500/20 border-2 border-red-500/40 group-hover:border-red-400' :
                    'bg-yellow-500/20 border-2 border-yellow-500/40 group-hover:border-yellow-400'
                  }`}>
                    <span>{cert.icon}</span>
                  </div>
                  <div className="font-semibold text-white mb-2">{cert.name}</div>
                  <div className="text-xs text-slate-400">{cert.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Performance de Classe Mundial</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Métricas que comprovam nossa excelência técnica
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
                  <div className="text-4xl mb-4">{metric.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.metric}</div>
                  <div className="text-slate-400">{metric.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Recognition */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Reconhecimento da Indústria</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Premiado pelas principais organizações do setor
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8">
              {industryRecognition.map((award, index) => (
                <div key={index} className="text-center bg-slate-800/30 rounded-lg p-6 border border-slate-700/50 min-w-[200px]">
                  <div className="text-3xl mb-3">{award.icon}</div>
                  <div className="font-semibold text-white mb-1">{award.award}</div>
                  <div className="text-sm text-slate-400">{award.organization}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4">
      {securityCertifications.slice(0, 4).map((cert, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="bg-slate-800/50 text-slate-300 border-slate-600 px-3 py-1"
        >
          <span className="mr-2">{cert.icon}</span>
          {cert.name}
        </Badge>
      ))}
    </div>
  );
}