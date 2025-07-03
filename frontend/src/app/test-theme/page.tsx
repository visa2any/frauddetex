'use client';

import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export default function TestThemePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Teste do Sistema de Temas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações do Tema */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Status do Tema</h2>
            <div className="space-y-4">
              <div>
                <strong>Tema Atual:</strong> {theme}
              </div>
              <div>
                <strong>Classe HTML:</strong> {typeof document !== 'undefined' ? document.documentElement.className : 'N/A'}
              </div>
              <div>
                <strong>Classe Body:</strong> {typeof document !== 'undefined' ? document.body.className : 'N/A'}
              </div>
              <div>
                <strong>LocalStorage:</strong> {typeof window !== 'undefined' ? localStorage.getItem('theme') : 'N/A'}
              </div>
            </div>
            
            <Button onClick={toggleTheme} className="mt-4">
              {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
              Alternar para {theme === 'light' ? 'Escuro' : 'Claro'}
            </Button>
          </div>

          {/* Teste de Cores */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Teste de Cores</h2>
            <div className="space-y-4">
              <div className="p-4 bg-background border rounded">
                Background
              </div>
              <div className="p-4 bg-card border rounded">
                Card Background
              </div>
              <div className="p-4 bg-muted border rounded">
                Muted Background
              </div>
              <div className="p-4 bg-primary text-primary-foreground rounded">
                Primary
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">
                Secondary
              </div>
            </div>
          </div>

          {/* Teste de Texto */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Teste de Texto</h2>
            <div className="space-y-2">
              <p className="text-foreground">Texto Principal</p>
              <p className="text-muted-foreground">Texto Secundário</p>
              <p className="text-primary">Texto Primário</p>
              <p className="text-secondary-foreground">Texto Secundário</p>
            </div>
          </div>

          {/* Teste de Bordas */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">Teste de Bordas</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded">
                Borda Padrão
              </div>
              <div className="p-4 border-2 border-primary rounded">
                Borda Primária
              </div>
              <div className="p-4 border-2 border-destructive rounded">
                Borda Destrutiva
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">Como Testar</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Clique no botão "Alternar Tema" para mudar entre claro e escuro</li>
            <li>Observe como as cores mudam automaticamente</li>
            <li>Recarregue a página para ver se o tema persiste</li>
            <li>Verifique se as classes CSS estão sendo aplicadas corretamente</li>
            <li>Teste em diferentes navegadores e dispositivos</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 