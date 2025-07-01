'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

  const offices = [
    {
      city: 'São Paulo - Matriz',
      address: 'Av. Paulista, 1000 - 15º andar\nBela Vista, São Paulo - SP\nCEP: 01310-100',
      phone: '+55 11 1234-5678',
      email: 'sp@frauddetex.com'
    },
    {
      city: 'Rio de Janeiro',
      address: 'Rua da Assembleia, 100 - 10º andar\nCentro, Rio de Janeiro - RJ\nCEP: 20011-901',
      phone: '+55 21 1234-5678',
      email: 'rj@frauddetex.com'
    },
    {
      city: 'Belo Horizonte',
      address: 'Av. Afonso Pena, 500 - 8º andar\nCentro, Belo Horizonte - MG\nCEP: 30130-001',
      phone: '+55 31 1234-5678',
      email: 'bh@frauddetex.com'
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
                      <span className="text-green-400">< 2 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Suporte:</span>
                      <span className="text-blue-400">< 4 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Geral:</span>
                      <span className="text-yellow-400">< 24 horas</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-400 text-sm">
                      💡 Para suporte urgente, ligue diretamente para nosso telefone.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Offices */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Nossos Escritórios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{office.city}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-1">📍 Endereço</h4>
                        <p className="text-gray-400 whitespace-pre-line">{office.address}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-300 mb-1">📞 Telefone</h4>
                        <p className="text-red-400">{office.phone}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-300 mb-1">✉️ Email</h4>
                        <p className="text-red-400">{office.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Perguntas Frequentes
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">⏱️ Qual o tempo de implementação?</h3>
                  <p className="text-gray-300 text-sm">
                    A integração básica pode ser feita em 1-2 dias. Para implementações 
                    customizadas, entre 1-4 semanas dependendo da complexidade.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">💰 Como funciona a precificação?</h3>
                  <p className="text-gray-300 text-sm">
                    Cobramos por transação analisada, com planos mensais flexíveis. 
                    Entre em contato para uma proposta personalizada.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">🔒 Os dados são seguros?</h3>
                  <p className="text-gray-300 text-sm">
                    Sim! Utilizamos criptografia AES-256, compliance LGPD/GDPR e 
                    processamento local para máxima segurança.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-2">🚀 Posso testar antes?</h3>
                  <p className="text-gray-300 text-sm">
                    Absolutamente! Oferecemos demo gratuito e trial de 30 dias 
                    para você avaliar nossa solução.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Pronto para Começar?
                </h3>
                <p className="text-gray-300 mb-6">
                  Agende uma demonstração gratuita e veja como o FraudDetex pode proteger seu negócio.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    📅 Agendar Demo
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    📞 Ligar Agora
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}