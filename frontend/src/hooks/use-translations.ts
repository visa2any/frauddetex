'use client';

import { useState, useEffect } from 'react';
import { type Locale, defaultLocale, getTranslations } from '@/lib/i18n-simple';

export function useTranslations(initialLocale: Locale = defaultLocale) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

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

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale);
    }
  }, [locale]);

  // Load language preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('preferred-language') as Locale;
      if (savedLocale && ['pt', 'en', 'es', 'fr'].includes(savedLocale)) {
        setLocale(savedLocale);
      }
    }
  }, []);

  const t = (key: string, defaultValue?: string): string => {
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

  return {
    locale,
    translations,
    isLoading,
    t,
    changeLanguage
  };
}