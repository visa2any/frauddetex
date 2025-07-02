'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Locale, defaultLocale, getTranslations } from '@/lib/i18n-simple';

interface TranslationContextType {
  locale: Locale;
  translations: any;
  isLoading: boolean;
  isClient: boolean;
  t: (key: string, defaultValue?: string) => string;
  changeLanguage: (newLocale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Load translations when locale changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const messages = await getTranslations(locale);
        setTranslations(messages);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to default locale
        if (locale !== defaultLocale) {
          const fallbackMessages = await getTranslations(defaultLocale);
          setTranslations(fallbackMessages);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  // Initialize client state and load saved locale
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-language') as Locale;
      if (savedLocale && ['pt', 'en', 'es', 'fr'].includes(savedLocale)) {
        setLocale(savedLocale);
      }
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { locale, translations } 
      }));
    }
  }, [locale, translations, isClient]);

  const t = (key: string, defaultValue?: string): string => {
    // If not client-side yet, return default value to prevent hydration mismatch
    if (!isClient) {
      return defaultValue || key;
    }

    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return typeof value === 'string' ? value : defaultValue || key;
  };

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const value = {
    locale,
    translations,
    isLoading,
    isClient,
    t,
    changeLanguage
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}