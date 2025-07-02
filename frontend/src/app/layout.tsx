import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { TranslationProvider } from '@/contexts/translation-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://fraudshield.com'),
  title: {
    default: 'FraudShield - Proteção Anti-Fraude com IA Explicável | Detecção em Tempo Real',
    template: '%s | FraudShield Revolutionary'
  },
  description: 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real, economize milhões e proteja seu negócio com biometria comportamental.',
  keywords: ['detecção fraude', 'anti-fraude', 'IA explicável', 'machine learning', 'biometria comportamental', 'edge computing', 'fintech security', 'proteção pagamentos', 'fraud detection', 'cybersecurity'],
  authors: [{ name: 'FraudShield Team' }],
  creator: 'FraudShield',
  publisher: 'FraudShield',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://fraudshield.com',
    siteName: 'FraudShield Revolutionary',
    title: 'FraudShield - Proteção Anti-Fraude com IA Explicável',
    description: 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FraudShield - Sistema Anti-Fraude com IA Explicável',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fraudshield',
    creator: '@fraudshield',
    title: 'FraudShield - Proteção Anti-Fraude com IA Explicável',
    description: 'O primeiro sistema de proteção anti-fraude com IA explicável do mundo. Detecte 94% das fraudes em tempo real.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      'facebook-domain-verification': 'facebook-verification-code',
      'pinterest-site-verification': 'pinterest-verification-code',
    },
  },
  alternates: {
    canonical: 'https://fraudshield.com',
    languages: {
      'pt-BR': 'https://fraudshield.com',
      'en-US': 'https://fraudshield.com/en',
    },
  },
  category: 'technology',
  classification: 'Security Software',
  referrer: 'origin-when-cross-origin',
  other: {
    'price': 'Freemium',
    'priceCurrency': 'BRL',
    'availability': 'InStock',
    'geo.region': 'BR-SP',
    'geo.placename': 'São Paulo',
    'geo.position': '-23.5505;-46.6333',
    'ICBM': '-23.5505, -46.6333',
    'application-name': 'FraudShield',
    'msapplication-TileColor': '#EF4444',
    'theme-color': '#EF4444',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Advanced Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://fraudshield.com/#organization",
                  "name": "FraudShield",
                  "url": "https://fraudshield.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://fraudshield.com/logo.png",
                    "width": 300,
                    "height": 100
                  },
                  "sameAs": [
                    "https://github.com/fraudshield",
                    "https://linkedin.com/company/fraudshield",
                    "https://twitter.com/fraudshield"
                  ],
                  "foundingDate": "2024-01-01",
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
                    "availableLanguage": ["Portuguese", "English"]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://fraudshield.com/#website",
                  "url": "https://fraudshield.com",
                  "name": "FraudShield Revolutionary",
                  "description": "O primeiro sistema de proteção anti-fraude com IA explicável do mundo",
                  "publisher": {
                    "@id": "https://fraudshield.com/#organization"
                  },
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://fraudshield.com/search?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                }
              ]
            })
          }}
        />
        
        {/* Performance and SEO optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fraudshield.com" />
        <link rel="dns-prefetch" href="//google-analytics.com" />
        <link rel="dns-prefetch" href="//googletagmanager.com" />
        
        {/* Favicons and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Additional meta for better indexing */}
        <meta name="application-name" content="FraudShield" />
        <meta name="apple-mobile-web-app-title" content="FraudShield" />
        <meta name="msapplication-TileColor" content="#EF4444" />
        <meta name="theme-color" content="#EF4444" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}