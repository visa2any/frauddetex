'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'sales',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Geral',
      value: 'contato@frauddetex.com',
      description: 'Para dúvidas gerais e informações'
    },
    {
      icon: '💼',
      title: 'Vendas',
      value: 'vendas@frauddetex.com',
      description: 'Para demonstrações e propostas comerciais'
    },
    {
      icon: '🛠️',
      title: 'Suporte Técnico',
      value: 'suporte@frauddetex.com',
      description: 'Para suporte técnico e dúvidas de implementação'
    },
    {
      icon: '📞',
      title: 'Telefone',
      value: '+55 11 1234-5678',
      description: 'Horário comercial: 9h às 18h (UTC-3)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header variant="homepage" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-500/10 text-red-400 border-red-500/20">
              Fale Conosco
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Entre em <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Nossa equipe está pronta para ajudar você a implementar a melhor solução 
              de detecção de fraudes para seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                            Nome Completo *
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Seu nome"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="seu@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                          Empresa
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Nome da sua empresa"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Assunto *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="sales">Vendas e Demonstração</option>
                          <option value="support">Suporte Técnico</option>
                          <option value="partnership">Parcerias</option>
                          <option value="press">Imprensa</option>
                          <option value="careers">Carreiras</option>
                          <option value="other">Outros</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Mensagem *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Como podemos ajudar você?"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Enviando...</span>
                          </div>
                        ) : (
                          '📧 Enviar Mensagem'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-green-400 text-2xl">✅</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Mensagem Enviada!
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Recebemos sua mensagem e entraremos em contato em até 24 horas.
                      </p>
                      <Button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            company: '',
                            subject: 'sales',
                            message: ''
                          });
                        }}
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                      >
                        Enviar Nova Mensagem
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Contatos Diretos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h4 className="font-semibold text-white">{method.title}</h4>
                        <p className="text-red-400 font-medium">{method.value}</p>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Resposta Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vendas:</span>
                      <span className="text-green-400">&lt; 2 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Suporte:</span>
                      <span className="text-green-400">&lt; 4 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Geral:</span>
                      <span className="text-yellow-400">&lt; 24 horas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Offices Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Nossos Escritórios
              </h2>
              <p className="text-gray-300">
                Estamos presentes em todo o Brasil para atender você de perto
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">São Paulo - Matriz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    Av. Paulista, 1000 - 15º andar<br />
                    Bela Vista, São Paulo - SP<br />
                    CEP: 01310-100
                  </p>
                  <p className="text-red-400 font-medium">+55 11 1234-5678</p>
                  <p className="text-gray-400">sp@frauddetex.com</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Rio de Janeiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    Rua da Assembleia, 100 - 10º andar<br />
                    Centro, Rio de Janeiro - RJ<br />
                    CEP: 20011-901
                  </p>
                  <p className="text-red-400 font-medium">+55 21 1234-5678</p>
                  <p className="text-gray-400">rj@frauddetex.com</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Belo Horizonte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-300 text-sm">
                    Av. Afonso Pena, 500 - 8º andar<br />
                    Centro, Belo Horizonte - MG<br />
                    CEP: 30130-001
                  </p>
                  <p className="text-red-400 font-medium">+55 31 1234-5678</p>
                  <p className="text-gray-400">bh@frauddetex.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}