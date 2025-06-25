'use client';

import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  noindex?: boolean;
  canonical?: string;
}

const defaultMeta = {
  title: 'FraudShield - Proteção Anti-Fraude com IA Explicável | Detecção em Tempo Real',
  description: 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real, economize milhões e proteja seu negócio com biometria comportamental.',
  keywords: 'detecção fraude, anti-fraude, IA explicável, machine learning, biometria comportamental, edge computing, fintech security, proteção pagamentos, fraud detection, cybersecurity',
  image: 'https://fraudshield.com/og-image.png',
  url: 'https://fraudshield.com',
  type: 'website' as const,
  siteName: 'FraudShield Revolutionary',
  locale: 'pt_BR'
};

export default function MetaTags({
  title = defaultMeta.title,
  description = defaultMeta.description,
  keywords = defaultMeta.keywords,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = defaultMeta.type,
  siteName = defaultMeta.siteName,
  locale = defaultMeta.locale,
  noindex = false,
  canonical
}: MetaTagsProps) {
  const fullTitle = title === defaultMeta.title ? title : `${title} | ${siteName}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="FraudShield Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#EF4444" />
      <meta name="msapplication-TileColor" content="#EF4444" />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="pt-BR" />
      <link rel="alternate" hrefLang="pt-BR" href={url} />
      <link rel="alternate" hrefLang="en" href={url.replace('.com', '.com/en')} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@fraudshield" />
      <meta name="twitter:creator" content="@fraudshield" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Additional Social Meta */}
      <meta property="article:publisher" content="https://fraudshield.com" />
      <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
      
      {/* Business/Product Specific */}
      <meta name="price" content="Freemium" />
      <meta name="priceCurrency" content="BRL" />
      <meta name="availability" content="InStock" />
      <meta name="category" content="Security Software" />
      
      {/* Technical Meta */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.fraudshield.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//google-analytics.com" />
      <link rel="dns-prefetch" href="//googletagmanager.com" />
      
      {/* Rich Snippets for Local Business */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="São Paulo" />
      <meta name="geo.position" content="-23.5505;-46.6333" />
      <meta name="ICBM" content="-23.5505, -46.6333" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Cache Control */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      
      {/* JSON-LD for Additional Context */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": title,
            "description": description,
            "url": url,
            "inLanguage": "pt-BR",
            "isPartOf": {
              "@type": "WebSite",
              "name": siteName,
              "url": "https://fraudshield.com"
            },
            "primaryImageOfPage": {
              "@type": "ImageObject",
              "url": image
            },
            "dateModified": new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "FraudShield"
            }
          })
        }}
      />
    </Head>
  );
}