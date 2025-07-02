'use client';

import { useTranslations as useTranslationsContext } from '@/contexts/translation-context';

// Re-export the hook from context for backward compatibility
export const useTranslations = useTranslationsContext;