'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, defaultLocale, getLocaleFromPath, getLocalizedPath, type Locale } from '@/lib/i18n-simple';

export function useI18n() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const locale = getLocaleFromPath(pathname);
    setCurrentLocale(locale);
  }, [pathname]);

  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Remove current locale from path
    let newPath = pathname;
    if (currentLocale !== defaultLocale) {
      newPath = pathname.replace(`/${currentLocale}`, '') || '/';
    }

    // Add new locale if not default
    if (newLocale !== defaultLocale) {
      newPath = `/${newLocale}${newPath}`;
    }

    setCurrentLocale(newLocale);
    router.push(newPath);
  };

  const getLocalizedHref = (href: string, locale?: Locale) => {
    const targetLocale = locale || currentLocale;
    return getLocalizedPath(href, targetLocale);
  };

  return {
    currentLocale,
    locales,
    defaultLocale,
    changeLanguage,
    getLocalizedHref,
    isDefaultLocale: currentLocale === defaultLocale
  };
}

// Hook para detectar linguagem preferida do browser
export function useBrowserLanguage() {
  const [preferredLanguage, setPreferredLanguage] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (locales.includes(browserLang)) {
        setPreferredLanguage(browserLang);
      }
    }
  }, []);

  return preferredLanguage;
}

// Hook para formatar números baseado na localização
export function useNumberFormatter(locale?: Locale) {
  const { currentLocale } = useI18n();
  const targetLocale = locale || currentLocale;

  const formatCurrency = (value: number, currency = 'BRL') => {
    const localeMap: Record<Locale, string> = {
      pt: 'pt-BR',
      en: 'en-US', 
      es: 'es-ES',
      fr: 'fr-FR'
    };

    const currencyMap: Record<Locale, string> = {
      pt: 'BRL',
      en: 'USD',
      es: 'EUR', 
      fr: 'EUR'
    };

    return new Intl.NumberFormat(localeMap[targetLocale], {
      style: 'currency',
      currency: currency === 'BRL' ? currencyMap[targetLocale] : currency
    }).format(value);
  };

  const formatNumber = (value: number) => {
    const localeMap: Record<Locale, string> = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES', 
      fr: 'fr-FR'
    };

    return new Intl.NumberFormat(localeMap[targetLocale]).format(value);
  };

  const formatPercent = (value: number) => {
    const localeMap: Record<Locale, string> = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR'
    };

    return new Intl.NumberFormat(localeMap[targetLocale], {
      style: 'percent',
      minimumFractionDigits: 1
    }).format(value / 100);
  };

  return {
    formatCurrency,
    formatNumber,
    formatPercent
  };
}

// Hook para formatar datas baseado na localização
export function useDateFormatter(locale?: Locale) {
  const { currentLocale } = useI18n();
  const targetLocale = locale || currentLocale;

  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}) => {
    const localeMap: Record<Locale, string> = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR'
    };

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Intl.DateTimeFormat(localeMap[targetLocale], {
      ...defaultOptions,
      ...options
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    const localeMap: Record<Locale, string> = {
      pt: 'pt-BR',
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR'
    };

    const rtf = new Intl.RelativeTimeFormat(localeMap[targetLocale], {
      numeric: 'auto'
    });

    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return rtf.format(-interval, unit as Intl.RelativeTimeFormatUnit);
      }
    }

    return rtf.format(-diffInSeconds, 'second');
  };

  return {
    formatDate,
    formatRelativeTime
  };
}