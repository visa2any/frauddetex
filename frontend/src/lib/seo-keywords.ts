// SEO Keywords Strategy - FraudShield Revolutionary

export const PRIMARY_KEYWORDS = [
  'detecção de fraude',
  'anti-fraude',
  'IA explicável',
  'fraud detection',
  'proteção anti-fraude',
  'sistema anti-fraude',
  'machine learning fraude'
];

export const SECONDARY_KEYWORDS = [
  'biometria comportamental',
  'edge computing',
  'inteligência artificial fraude',
  'cybersecurity brasil',
  'fintech security',
  'proteção pagamentos',
  'fraud prevention',
  'real-time fraud detection',
  'behavioral analytics',
  'explainable AI'
];

export const LONG_TAIL_KEYWORDS = [
  'como detectar fraude em tempo real',
  'melhor sistema anti-fraude brasil',
  'IA explicável para detecção de fraude',
  'proteção contra fraude e-commerce',
  'biometria comportamental fraud detection',
  'edge computing anti-fraude',
  'sistema de proteção fintech',
  'como prevenir fraudes online',
  'fraud detection machine learning',
  'artificial intelligence cybersecurity'
];

export const INDUSTRY_KEYWORDS = [
  // Fintech
  'fraud detection fintech',
  'proteção fintech',
  'segurança pagamentos digitais',
  'anti-fraude pix',
  'fraud prevention banking',
  
  // E-commerce
  'proteção e-commerce',
  'fraud detection online store',
  'segurança loja virtual',
  'anti-fraude checkout',
  'payment fraud prevention',
  
  // Banking
  'fraud detection banking',
  'proteção bancária',
  'anti-fraude banco digital',
  'cybersecurity banking',
  'financial fraud prevention',
  
  // Insurance
  'fraud detection insurance',
  'anti-fraude seguros',
  'proteção seguradoras',
  'insurance fraud prevention',
  'claims fraud detection'
];

export const TECHNICAL_KEYWORDS = [
  'api anti-fraude',
  'sdk fraud detection',
  'rest api cybersecurity',
  'machine learning api',
  'real-time analytics',
  'behavioral biometrics api',
  'fraud scoring',
  'risk assessment api',
  'threat intelligence',
  'anomaly detection'
];

export const COMPETITIVE_KEYWORDS = [
  'alternativa sift',
  'alternativa riskified',
  'melhor que forter',
  'fraud detection brasil',
  'anti-fraude nacional',
  'sistema fraude brasileiro',
  'fraud prevention latam',
  'cybersecurity south america'
];

export const LOCATION_KEYWORDS = [
  'fraud detection brasil',
  'anti-fraude são paulo',
  'cybersecurity brasil',
  'proteção fraude rio janeiro',
  'fintech security brasil',
  'fraud prevention latin america',
  'segurança digital brasil',
  'sistema anti-fraude nacional'
];

// Content optimization helpers
export const getKeywordsForPage = (page: string): string[] => {
  const baseKeywords = [...PRIMARY_KEYWORDS, ...SECONDARY_KEYWORDS];
  
  switch (page) {
    case 'homepage':
      return [
        ...baseKeywords,
        ...LONG_TAIL_KEYWORDS.slice(0, 5),
        'primeiro sistema IA explicável',
        'revolucionário anti-fraude'
      ];
      
    case 'pricing':
      return [
        ...baseKeywords,
        'preço anti-fraude',
        'custo fraud detection',
        'planos proteção fraude',
        'freemium cybersecurity',
        'roi fraud prevention'
      ];
      
    case 'features':
      return [
        ...baseKeywords,
        ...TECHNICAL_KEYWORDS,
        'funcionalidades anti-fraude',
        'recursos fraud detection'
      ];
      
    case 'docs':
      return [
        ...TECHNICAL_KEYWORDS,
        'documentação api anti-fraude',
        'tutorial fraud detection',
        'integração sistema fraude'
      ];
      
    case 'solutions':
      return [
        ...baseKeywords,
        ...INDUSTRY_KEYWORDS,
        'soluções anti-fraude',
        'casos uso fraud detection'
      ];
      
    default:
      return baseKeywords;
  }
};

export const getMetaDescription = (page: string, customDescription?: string): string => {
  if (customDescription) return customDescription;
  
  const descriptions = {
    homepage: 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real, economize milhões e proteja seu negócio com biometria comportamental.',
    pricing: 'Escolha o melhor plano de proteção anti-fraude. Comece grátis com 10K requests. Planos a partir de R$ 199/mês. ROI de 450% comprovado.',
    features: 'Conheça todas as funcionalidades do FraudShield: IA explicável, biometria comportamental, edge computing, inteligência coletiva e muito mais.',
    docs: 'Documentação completa da API FraudShield. Guias, exemplos de código, SDKs e tutoriais para implementar proteção anti-fraude em minutos.',
    solutions: 'Soluções de proteção anti-fraude para diferentes setores: fintech, e-commerce, banking, insurance. Cases de sucesso e ROI comprovado.'
  };
  
  return descriptions[page as keyof typeof descriptions] || descriptions.homepage;
};

export const getPageTitle = (page: string, customTitle?: string): string => {
  if (customTitle) return customTitle;
  
  const titles = {
    homepage: 'FraudShield - Proteção Anti-Fraude com IA Explicável | Detecção em Tempo Real',
    pricing: 'Preços FraudShield - Planos de Proteção Anti-Fraude | Freemium',
    features: 'Funcionalidades FraudShield - IA Explicável e Biometria Comportamental',
    docs: 'Documentação FraudShield - API Anti-Fraude | Guias e Tutoriais',
    solutions: 'Soluções FraudShield - Proteção Anti-Fraude por Setor | Cases de Sucesso'
  };
  
  return titles[page as keyof typeof titles] || titles.homepage;
};