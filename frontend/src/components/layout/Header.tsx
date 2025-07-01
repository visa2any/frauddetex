'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  variant?: 'homepage' | 'dashboard' | 'pricing' | 'billing' | 'blog' | 'solutions';
}

interface DropdownItem {
  href: string;
  label: string;
  icon: string;
  description?: string;
}

interface NavigationItem {
  label: string;
  icon: string;
  href?: string;
  items?: DropdownItem[];
}

export default function Header({ variant = 'homepage' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('pt');
  const { user, isAuthenticated, logout } = useSafeAuth();

  const languages = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  // Navegação principal com submenus
  const navigationItems: NavigationItem[] = [
    {
      label: 'Soluções',
      icon: '🎯',
      items: [
        { href: '/fraud-detection', label: 'Detecção de Fraudes', icon: '🛡️', description: 'IA avançada para detectar fraudes em tempo real' },
        { href: '/behavioral-analysis', label: 'Análise Comportamental', icon: '🧠', description: 'Biometria comportamental e padrões únicos' },
        { href: '/real-time-monitoring', label: 'Monitoramento 24/7', icon: '⚡', description: 'Proteção contínua e alertas instantâneos' },
        { href: '/compliance-tools', label: 'Compliance', icon: '✅', description: 'LGPD, PCI DSS, SOC 2 e ISO 27001' },
        { href: '/api-integration', label: 'Integração API', icon: '🔌', description: 'APIs REST e SDKs para todas as linguagens' },
        { href: '/custom-rules', label: 'Regras Personalizadas', icon: '⚙️', description: 'Configure regras específicas do seu negócio' }
      ]
    },
    {
      label: 'Produtos',
      icon: '🚀',
      items: [
        { href: '/pricing', label: 'Preços', icon: '💰', description: 'Planos flexíveis para todos os tamanhos' },
        { href: '/enterprise', label: 'Enterprise', icon: '🏢', description: 'Soluções personalizadas para grandes empresas' },
        { href: '/api', label: 'API Reference', icon: '📚', description: 'Documentação completa da API' },
        { href: '/integrations', label: 'Integrações', icon: '🔗', description: 'Conecte com suas ferramentas favoritas' },
        { href: '/changelog', label: 'Changelog', icon: '📝', description: 'Novidades e atualizações da plataforma' }
      ]
    },
    {
      label: 'Recursos',
      icon: '📚',
      items: [
        { href: '/docs', label: 'Documentação', icon: '📖', description: 'Guias completos e tutoriais' },
        { href: '/case-studies', label: 'Estudos de Caso', icon: '📊', description: 'Cases reais de sucesso' },
        { href: '/blog', label: 'Blog', icon: '✍️', description: 'Artigos sobre fraudes e segurança' },
        { href: '/webinars', label: 'Webinars', icon: '🎥', description: 'Eventos online e treinamentos' },
        { href: '/security', label: 'Centro de Segurança', icon: '🔒', description: 'Informações sobre nossa segurança' },
        { href: '/status', label: 'Status', icon: '📡', description: 'Uptime e status dos serviços' }
      ]
    },
    {
      label: 'Empresa',
      icon: '🏢',
      items: [
        { href: '/about', label: 'Sobre Nós', icon: '🌟', description: 'Nossa missão e história' },
        { href: '/careers', label: 'Carreiras', icon: '💼', description: 'Junte-se ao nosso time' },
        { href: '/contact', label: 'Contato', icon: '📞', description: 'Fale conosco' },
        { href: '/press', label: 'Imprensa', icon: '📰', description: 'Kit de imprensa e notícias' },
        { href: '/partners', label: 'Parceiros', icon: '🤝', description: 'Programa de parceiros' }
      ]
    }
  ];

  // Adicionar Dashboard para usuários autenticados
  const dashboardItem: NavigationItem = {
    label: 'Dashboard',
    icon: '📊',
    href: '/dashboard'
  };

  const finalNavigationItems = isAuthenticated 
    ? [dashboardItem, ...navigationItems] 
    : navigationItems;

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    // Aqui você implementaria a lógica de mudança de idioma
    console.log('Language changed to:', langCode);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">🛡️</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 rounded-lg opacity-20 blur-md"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight">FraudDetex</span>
              <span className="text-xs text-orange-300/70 font-medium tracking-wide">FRAUD DETECTION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {finalNavigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-all font-medium"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-all font-medium"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                {/* Dropdown Menu */}
                {item.items && activeDropdown === item.label && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-80 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl py-2"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="flex items-start space-x-3 px-4 py-3 hover:bg-slate-800/50 transition-colors group/item"
                      >
                        <span className="text-lg">{subItem.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-white group-hover/item:text-red-400 transition-colors">
                            {subItem.label}
                          </div>
                          {subItem.description && (
                            <div className="text-sm text-slate-400 mt-1">
                              {subItem.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Language + Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all">
                <span>{languages.find(lang => lang.code === selectedLanguage)?.flag}</span>
                <span className="text-sm font-medium">
                  {languages.find(lang => lang.code === selectedLanguage)?.label}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-800/50 transition-colors text-left ${
                      selectedLanguage === lang.code ? 'text-red-400' : 'text-slate-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                    {selectedLanguage === lang.code && (
                      <span className="ml-auto text-red-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-slate-300">
                    Olá, <span className="text-white font-medium">{user?.name}</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-400">
                    {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </Badge>
                </div>
                <Button 
                  variant="outline"
                  className="border-slate-500 text-slate-400 hover:bg-slate-700 hover:text-white"
                  onClick={logout}
                >
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0" 
                  asChild
                >
                  <Link href="/signup">🛡️ Proteger Agora</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-slate-700 max-h-[70vh] overflow-y-auto">
            <nav className="space-y-2">
              {/* Language Selector Mobile */}
              <div className="px-2 py-3 border-b border-slate-700 mb-4">
                <div className="text-sm text-slate-400 mb-2">Idioma</div>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        selectedLanguage === lang.code 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Items */}
              {finalNavigationItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 text-slate-300 hover:text-red-400 transition-colors font-medium px-2 py-3 rounded-lg hover:bg-slate-800/50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 text-white font-medium px-2 py-3 bg-slate-800/30 rounded-lg mb-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.items && (
                        <div className="ml-4 space-y-1 mb-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="flex items-center space-x-3 text-slate-400 hover:text-red-400 transition-colors text-sm px-2 py-2 rounded-lg hover:bg-slate-800/30"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <span>{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-center text-sm text-slate-300 mb-3">
                      Olá, <span className="text-white font-medium">{user?.name}</span>
                      <Badge variant="outline" className="ml-2 border-green-500 text-green-400">
                        {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </Badge>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full border-slate-500 text-slate-400 hover:bg-slate-700 hover:text-white"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white" 
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0" 
                      asChild
                    >
                      <Link href="/signup">🛡️ Proteger Agora</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}