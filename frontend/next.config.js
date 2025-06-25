/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração mínima para Vercel
  poweredByHeader: false,
  compress: true,
  
  images: {
    domains: ['localhost', 'frauddetex.vercel.app'],
    formats: ['image/webp', 'image/avif']
  },
  
  env: {
    SITE_URL: process.env.SITE_URL || 'https://frauddetex.vercel.app',
    SITE_NAME: 'FraudDetex'
  },
  
  // Configuração webpack simplificada
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  }
};

module.exports = nextConfig;