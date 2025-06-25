'use client';

interface StructuredDataProps {
  type: 'organization' | 'product' | 'article' | 'faq' | 'breadcrumb' | 'reviews';
  data?: any;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "FraudShield",
  "alternateName": "FraudShield Revolutionary",
  "description": "O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real com biometria comportamental e inteligência coletiva.",
  "url": "https://fraudshield.com",
  "logo": "https://fraudshield.com/logo.png",
  "image": "https://fraudshield.com/og-image.png",
  "foundingDate": "2024-01-01",
  "founder": {
    "@type": "Organization",
    "name": "FraudShield Team"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "São Paulo",
    "addressRegion": "SP",
    "addressCountry": "BR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-9999-9999",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese", "English"],
    "areaServed": "BR"
  },
  "sameAs": [
    "https://github.com/fraudshield",
    "https://linkedin.com/company/fraudshield",
    "https://twitter.com/fraudshield"
  ],
  "knowsAbout": [
    "Fraud Detection",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Fintech Security",
    "Behavioral Biometrics",
    "Edge Computing"
  ]
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "FraudShield Revolutionary",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web-based",
  "description": "Sistema avançado de detecção de fraudes com IA explicável, biometria comportamental e inteligência coletiva. Protege empresas contra fraudes em tempo real com 94% de precisão.",
  "url": "https://fraudshield.com",
  "downloadUrl": "https://fraudshield.com/signup",
  "screenshot": "https://fraudshield.com/screenshot.png",
  "softwareVersion": "2.0",
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-20",
  "author": {
    "@type": "Organization",
    "name": "FraudShield"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Community Plan",
      "description": "Plano gratuito para desenvolvedores e pequenos projetos",
      "price": "0",
      "priceCurrency": "BRL",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://fraudshield.com/pricing",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "value": "10000",
        "unitText": "requests por mês"
      }
    },
    {
      "@type": "Offer",
      "name": "Smart Protection",
      "description": "Para empresas que levam segurança a sério",
      "price": "199",
      "priceCurrency": "BRL",
      "billingIncrement": "Monthly",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://fraudshield.com/pricing",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "value": "100000",
        "unitText": "requests mensais inclusos"
      }
    },
    {
      "@type": "Offer",
      "name": "Enterprise Shield",
      "description": "Máxima proteção para grandes volumes",
      "price": "799",
      "priceCurrency": "BRL",
      "billingIncrement": "Monthly",
      "priceValidUntil": "2024-12-31",
      "availability": "https://schema.org/InStock",
      "url": "https://fraudshield.com/pricing"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Carlos Silva"
      },
      "reviewBody": "Reduziu fraudes em 94% e economizou R$ 2.3M em 6 meses. A detecção em tempo real é impressionante.",
      "publisher": {
        "@type": "Organization",
        "name": "TechPay"
      }
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Ana Costa"
      },
      "reviewBody": "Primeira vez que vejo IA explicável funcionando na prática. O compliance adorou a transparência.",
      "publisher": {
        "@type": "Organization",
        "name": "BankTech"
      }
    }
  ],
  "features": [
    "Detecção de fraudes em tempo real",
    "IA explicável e auditável",
    "Biometria comportamental",
    "Edge computing <50ms",
    "Inteligência coletiva P2P",
    "Compliance automático",
    "94% precisão de detecção"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como funciona a garantia de reembolso?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Se não detectarmos pelo menos 80% das fraudes em 30 dias, devolvemos 100% do valor pago."
      }
    },
    {
      "@type": "Question",
      "name": "Quanto tempo leva para implementar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Implementação completa em menos de 24 horas. API REST simples, SDKs prontos para principais linguagens."
      }
    },
    {
      "@type": "Question",
      "name": "É compatível com meu sistema atual?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim! Funciona com qualquer sistema via API REST. Integrações nativas para Shopify, WooCommerce, e principais gateways."
      }
    },
    {
      "@type": "Question",
      "name": "O que acontece se eu ultrapassar o limite?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cobramos apenas o excedente. Sem surpresas, sem bloqueios. Você continua protegido."
      }
    }
  ]
};

const breadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

const articleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image || "https://fraudshield.com/og-image.png",
  "author": {
    "@type": "Organization",
    "name": "FraudShield"
  },
  "publisher": {
    "@type": "Organization",
    "name": "FraudShield",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fraudshield.com/logo.png"
    }
  },
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export default function StructuredData({ type, data }: StructuredDataProps) {
  let schema = {};

  switch (type) {
    case 'organization':
      schema = organizationSchema;
      break;
    case 'product':
      schema = productSchema;
      break;
    case 'faq':
      schema = faqSchema;
      break;
    case 'breadcrumb':
      schema = breadcrumbSchema(data || []);
      break;
    case 'article':
      schema = articleSchema(data || {});
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}