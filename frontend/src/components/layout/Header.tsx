'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSafeAuth } from '@/hooks/use-safe-auth';
import { useTranslations } from '@/hooks/use-translations';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Locale } from '@/lib/i18n-simple';
import { Sun, Moon, Monitor } from 'lucide-react';

interface HeaderProps {
  variant?: 'homepage' | 'dashboard' | 'pricing' | 'billing' | 'blog' | 'solutions' | 'resources' | 'company';
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
  const { user, isAuthenticated, logout } = useSafeAuth();
  const { t, locale, changeLanguage } = useTranslations();
  const { theme, toggleTheme } = useTheme();

  const languages = [
    { code: 'pt' as Locale, label: t('languages.pt', 'Português'), flag: '🇧🇷' },
    { code: 'en' as Locale, label: t('languages.en', 'English'), flag: '🇺🇸' },
    { code: 'es' as Locale, label: t('languages.es', 'Español'), flag: '🇪🇸' },
    { code: 'fr' as Locale, label: t('languages.fr', 'Français'), flag: '🇫🇷' }
  ];

  // Navegação condensada para usuários logados
  const getNavigationItems = (): NavigationItem[] => {
    if (isAuthenticated) {
      return [
        {
          label: t('navigation.solutions', 'Soluções'),
          icon: '🎯',
          items: [
            { href: '/fraud-detection', label: t('solutions.fraud_detection.title', 'Detecção'), icon: '🛡️' },
            { href: '/behavioral-analysis', label: t('solutions.behavioral_analysis.title', 'Biometria'), icon: '🧠' },
            { href: '/real-time-monitoring', label: t('solutions.realtime_monitoring.title', 'Monitor 24/7'), icon: '⚡' },
            { href: '/compliance-tools', label: t('solutions.compliance.title', 'Compliance'), icon: '✅' }
          ]
        },
        {
          label: t('navigation.resources', 'Recursos'),
          icon: '📚',
          items: [
            { href: '/docs', label: t('resources.docs.title', 'Docs'), icon: '📖' },
            { href: '/api', label: t('products.api_docs.title', 'API'), icon: '📚' },
            { href: '/pricing', label: t('products.pricing.title', 'Preços'), icon: '💰' },
            { href: '/support', label: 'Suporte', icon: '🎧' }
          ]
        }
      ];
    } else {
      return [
        {
          label: t('navigation.solutions', 'Soluções'),
          icon: '🎯',
          items: [
            { href: '/fraud-detection', label: t('solutions.fraud_detection.title', 'Detecção de Fraudes'), icon: '🛡️', description: t('solutions.fraud_detection.description', 'IA avançada para detectar fraudes em tempo real') },
            { href: '/behavioral-analysis', label: t('solutions.behavioral_analysis.title', 'Análise Comportamental'), icon: '🧠', description: t('solutions.behavioral_analysis.description', 'Biometria comportamental e padrões únicos') },
            { href: '/real-time-monitoring', label: t('solutions.realtime_monitoring.title', 'Monitoramento 24/7'), icon: '⚡', description: t('solutions.realtime_monitoring.description', 'Proteção contínua e alertas instantâneos') },
            { href: '/compliance-tools', label: t('solutions.compliance.title', 'Compliance'), icon: '✅', description: t('solutions.compliance.description', 'LGPD, PCI DSS, SOC 2 e ISO 27001') }
          ]
        },
        {
          label: t('navigation.products', 'Produtos'),
          icon: '🚀',
          items: [
            { href: '/pricing', label: t('products.pricing.title', 'Preços'), icon: '💰', description: t('products.pricing.description', 'Planos flexíveis para todos os tamanhos') },
            { href: '/enterprise', label: t('products.enterprise.title', 'Enterprise'), icon: '🏢', description: t('products.enterprise.description', 'Soluções personalizadas para grandes empresas') },
            { href: '/api', label: t('products.api_docs.title', 'API Reference'), icon: '📚', description: t('products.api_docs.description', 'Documentação completa da API') }
          ]
        },
        {
          label: t('navigation.resources', 'Recursos'),
          icon: '📚',
          items: [
            { href: '/docs', label: t('resources.docs.title', 'Documentação'), icon: '📖', description: t('resources.docs.description', 'Guias completos e tutoriais') },
            { href: '/case-studies', label: t('resources.case_studies.title', 'Estudos de Caso'), icon: '📊', description: t('resources.case_studies.description', 'Cases reais de sucesso') },
            { href: '/blog', label: t('resources.blog.title', 'Blog'), icon: '✍️', description: t('resources.blog.description', 'Artigos sobre fraudes e segurança') }
          ]
        },
        {
          label: t('navigation.company', 'Empresa'),
          icon: '🏢',
          items: [
            { href: '/about', label: t('company.about.title', 'Sobre Nós'), icon: '🌟', description: t('company.about.description', 'Nossa missão e história') },
            { href: '/contact', label: t('company.contact.title', 'Contato'), icon: '📞', description: t('company.contact.description', 'Fale conosco') },
            { href: '/careers', label: t('company.careers.title', 'Carreiras'), icon: '💼', description: t('company.careers.description', 'Junte-se ao nosso time') }
          ]
        }
      ];
    }
  };

  const navigationItems = getNavigationItems();

  // Adicionar Dashboard para usuários autenticados
  const dashboardItem: NavigationItem = {
    label: t('navigation.dashboard', 'Dashboard'),
    icon: '📊',
    href: '/dashboard'
  };

  const finalNavigationItems = isAuthenticated 
    ? [dashboardItem, ...navigationItems] 
    : navigationItems;

  const handleLanguageChange = (langCode: Locale) => {
    changeLanguage(langCode);
  };

  // Classes condicionais baseadas no tema
  const headerClasses = theme === 'light' 
    ? "bg-white/95 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50"
    : "bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50";

  const navLinkClasses = theme === 'light'
    ? "flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-100/50 transition-all font-medium"
    : "flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-slate-800/50 transition-all font-medium";

  const dropdownClasses = theme === 'light'
    ? "absolute top-full left-0 mt-1 w-80 bg-white/95 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-2xl py-2"
    : "absolute top-full left-0 mt-1 w-80 bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl py-2";

  const dropdownItemClasses = theme === 'light'
    ? "flex items-start space-x-3 px-4 py-3 hover:bg-slate-100/50 transition-colors group/item"
    : "flex items-start space-x-3 px-4 py-3 hover:bg-slate-800/50 transition-colors group/item";

  const dropdownTextClasses = theme === 'light'
    ? "font-medium text-slate-800 group-hover/item:text-red-400 transition-colors"
    : "font-medium text-white group-hover/item:text-red-400 transition-colors";

  const dropdownDescClasses = theme === 'light'
    ? "text-sm text-slate-500 mt-1"
    : "text-sm text-slate-400 mt-1";

  return (
    <header className={headerClasses}>
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
                    className={navLinkClasses}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    className={navLinkClasses}
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
                    className={dropdownClasses}
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={dropdownItemClasses}
                      >
                        <span className="text-lg">{subItem.icon}</span>
                        <div className="flex-1">
                          <div className={dropdownTextClasses}>
                            {subItem.label}
                          </div>
                          {subItem.description && (
                            <div className={dropdownDescClasses}>
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

          {/* Right Side - Theme + Language + Actions */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`p-2 ${theme === 'light' ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Language Selector - Only Flags */}
            <div className="relative group">
              <button className={`flex items-center px-2 py-2 rounded-lg ${theme === 'light' ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'} transition-all`}>
                <span className="text-lg">{languages.find(lang => lang.code === locale)?.flag}</span>
              </button>
              
              <div className={`absolute top-full right-0 mt-1 w-40 ${theme === 'light' ? 'bg-white/95 border-slate-200/50' : 'bg-slate-900/95 border-slate-700/50'} backdrop-blur-sm border rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50' : 'hover:bg-slate-800/50'} transition-colors text-left ${
                      locale === lang.code ? 'text-red-400' : theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="font-medium text-sm">{lang.label}</span>
                    {locale === lang.code && (
                      <span className="ml-auto text-red-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* User Menu Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme === 'light' ? 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'} transition-all`}>
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden xl:block text-sm">
                      <div className="font-medium">{user?.name || 'User'}</div>
                      <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </div>
                    </div>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`absolute top-full right-0 mt-1 w-48 ${theme === 'light' ? 'bg-white/95 border-slate-200/50' : 'bg-slate-900/95 border-slate-700/50'} backdrop-blur-sm border rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200`}>
                    <div className={`px-4 py-2 border-b ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-700/50'}`}>
                      <div className={`font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{user?.name || 'User'}</div>
                      <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      className={`flex items-center space-x-2 px-4 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50 text-slate-600' : 'hover:bg-slate-800/50 text-slate-300'} transition-colors`}
                    >
                      <span>📊</span>
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/billing"
                      className={`flex items-center space-x-2 px-4 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50 text-slate-600' : 'hover:bg-slate-800/50 text-slate-300'} transition-colors`}
                    >
                      <span>💳</span>
                      <span>Billing</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <Link
                          href="/dashboard/admin"
                          className={`flex items-center space-x-2 px-4 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50 text-slate-600' : 'hover:bg-slate-800/50 text-slate-300'} transition-colors`}
                        >
                          <span>👑</span>
                          <span>Admin Panel</span>
                        </Link>
                        <Link
                          href="/dashboard/admin/enterprise"
                          className={`flex items-center space-x-2 px-4 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50 text-slate-600' : 'hover:bg-slate-800/50 text-slate-300'} transition-colors`}
                        >
                          <span>🏢</span>
                          <span>Enterprise</span>
                        </Link>
                      </>
                    )}
                    <button
                      onClick={logout}
                      className={`w-full flex items-center space-x-2 px-4 py-2 ${theme === 'light' ? 'hover:bg-slate-100/50 text-slate-600' : 'hover:bg-slate-800/50 text-slate-300'} transition-colors text-left`}
                    >
                      <span>🚪</span>
                      <span>{t('navigation.logout', 'Sair')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${theme === 'light' ? 'border-red-400 text-red-600' : 'border-red-500 text-red-400'} hover:bg-red-500 hover:text-white`} 
                  asChild
                >
                  <Link href="/login">{t('navigation.login', 'Login')}</Link>
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0" 
                  asChild
                >
                  <Link href="/signup">🛡️ {t('navigation.signup', 'Proteger Agora')}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 ${theme === 'light' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-300 hover:text-white'}`}
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
          <div className={`lg:hidden mt-4 py-4 border-t ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-700/50'} max-h-[75vh] overflow-y-auto`}>
            <nav className="space-y-1">
              {/* Theme + Language Controls Mobile */}
              <div className={`px-2 py-3 border-b ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-700/50'} mb-4`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Configurações</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className={`p-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                        locale === lang.code 
                          ? 'bg-red-500 text-white' 
                          : theme === 'light' 
                            ? 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
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
                      className={`flex items-center space-x-3 ${theme === 'light' ? 'text-slate-600 hover:bg-slate-100/50' : 'text-slate-300 hover:bg-slate-800/50'} hover:text-red-400 transition-colors font-medium px-3 py-3 rounded-lg`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <div className={`flex items-center space-x-3 font-medium px-3 py-3 rounded-lg mb-2 ${theme === 'light' ? 'text-slate-800 bg-slate-100/30' : 'text-white bg-slate-800/30'}`}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.items && (
                        <div className="ml-4 space-y-1 mb-4">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`flex items-center space-x-3 ${theme === 'light' ? 'text-slate-500 hover:bg-slate-100/30' : 'text-slate-400 hover:bg-slate-800/30'} hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-lg`}
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

              {/* User Actions Mobile */}
              {isAuthenticated && (
                <div className={`pt-4 border-t ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-700/50'} space-y-3`}>
                  <div className={`flex items-center space-x-3 p-3 ${theme === 'light' ? 'bg-slate-100/30' : 'bg-slate-800/30'} rounded-lg`}>
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{user?.name || 'User'}</div>
                      <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className={`flex items-center justify-center space-x-2 p-3 ${theme === 'light' ? 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'} rounded-lg transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>📊</span>
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/billing"
                    className={`flex items-center justify-center space-x-2 p-3 ${theme === 'light' ? 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'} rounded-lg transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>💳</span>
                    <span>Billing</span>
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link
                      href="/dashboard/admin"
                      className={`flex items-center justify-center space-x-2 p-3 ${theme === 'light' ? 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'} rounded-lg transition-colors`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>👑</span>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full border ${theme === 'light' ? 'border-slate-300 text-slate-600 hover:bg-slate-200 hover:text-slate-800' : 'border-slate-500 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                  >
                    🚪 {t('navigation.logout', 'Sair')}
                  </button>
                </div>
              )}

              {/* Auth Buttons Mobile */}
              {!isAuthenticated && (
                <div className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`w-full ${theme === 'light' ? 'border-red-400 text-red-600' : 'border-red-500 text-red-400'} hover:bg-red-500 hover:text-white`} 
                    asChild
                  >
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>{t('navigation.login', 'Login')}</Link>
                  </Button>
                  <Button 
                    size="sm"
                    className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white border-0" 
                    asChild
                  >
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>🛡️ {t('navigation.signup', 'Proteger Agora')}</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}