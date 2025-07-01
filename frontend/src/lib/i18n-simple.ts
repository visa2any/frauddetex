// Simple i18n system for client-side translation
export const locales = ['pt', 'en', 'es', 'fr'] as const;
export const defaultLocale = 'pt' as const;

export type Locale = (typeof locales)[number];

// Simple translation function
export async function getTranslations(locale: Locale) {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, falling back to ${defaultLocale}`);
    const fallbackMessages = await import(`../messages/${defaultLocale}.json`);
    return fallbackMessages.default;
  }
}

export function getLocalizedPath(path: string, locale: string) {
  if (locale === defaultLocale) {
    return path;
  }
  return `/${locale}${path}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/');
  const localeSegment = segments[1];
  
  if (locales.includes(localeSegment as Locale)) {
    return localeSegment as Locale;
  }
  
  return defaultLocale;
}

export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (locale === defaultLocale) {
    return pathname;
  }
  
  return pathname.replace(`/${locale}`, '') || '/';
}