'use client';

import { useTranslations } from '@/hooks/use-translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TranslationDemo() {
  const { t, locale, changeLanguage } = useTranslations();

  const languages = [
    { code: 'pt' as const, label: 'Português', flag: '🇧🇷' },
    { code: 'en' as const, label: 'English', flag: '🇺🇸' },
    { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>🌍</span>
          <span>{t('common.language', 'Idioma')} Demo</span>
          <Badge variant="outline" className="ml-auto">
            {locale.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Language Selector */}
        <div>
          <h3 className="font-medium mb-3">Selecionar Idioma:</h3>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                variant={locale === lang.code ? "default" : "outline"}
                className="justify-start"
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-lg">
            {t('navigation.solutions', 'Soluções')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-lg">🛡️</span>
              <div>
                <div className="font-medium">
                  {t('solutions.fraud_detection.title', 'Detecção de Fraudes')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('solutions.fraud_detection.description', 'IA avançada para detectar fraudes em tempo real')}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">🧠</span>
              <div>
                <div className="font-medium">
                  {t('solutions.behavioral_analysis.title', 'Análise Comportamental')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('solutions.behavioral_analysis.description', 'Biometria comportamental e padrões únicos')}
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-lg">⚡</span>
              <div>
                <div className="font-medium">
                  {t('solutions.realtime_monitoring.title', 'Monitoramento 24/7')}
                </div>
                <div className="text-sm text-gray-600">
                  {t('solutions.realtime_monitoring.description', 'Proteção contínua e alertas instantâneos')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-green-600 font-medium">
            ✅ Sistema de Tradução Ativo
          </div>
          <div className="text-sm text-green-600 mt-1">
            Idioma atual: <strong>{languages.find(l => l.code === locale)?.label}</strong>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}