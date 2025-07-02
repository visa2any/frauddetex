'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  email: string;
  company_name?: string;
  plan: 'community' | 'smart' | 'enterprise' | 'insurance';
  usage_count: number;
  usage_limit: number;
  subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  created_at: string;
  is_active: boolean;
  email_verified: boolean;
}

interface UserManagementProps {
  users: User[];
  onUserAction: (userId: string, action: string) => void;
}

export default function UserManagement({ users, onUserAction }: UserManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.company_name && user.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesStatus = filterStatus === 'all' || user.subscription_status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'community': return 'bg-gray-100 text-gray-800';
      case 'smart': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'insurance': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleUserAction = (userId: string, action: string) => {
    onUserAction(userId, action);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">🔍 Filtros e Busca</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plano</label>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Planos</option>
                <option value="community">Community</option>
                <option value="smart">Smart</option>
                <option value="enterprise">Enterprise</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="canceled">Cancelado</option>
                <option value="past_due">Vencido</option>
                <option value="trialing">Teste</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterPlan('all');
                  setFilterStatus('all');
                }}
                className="w-full border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
              >
                🔄 Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>👥 Usuários ({filteredUsers.length} de {users.length})</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                ➕ Adicionar Usuário
              </Button>
              <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                📥 Exportar CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-gray-400">Empresa</th>
                  <th className="text-left py-3 px-4 text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-gray-400">Plano</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400">Uso</th>
                  <th className="text-left py-3 px-4 text-gray-400">Criado</th>
                  <th className="text-left py-3 px-4 text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-white">{user.company_name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{user.email_verified ? '✅ Verificado' : '❌ Não verificado'}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge className={getPlanColor(user.plan)}>
                        {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(user.subscription_status || 'inactive')}>
                        {user.subscription_status === 'active' ? 'Ativo' :
                         user.subscription_status === 'canceled' ? 'Cancelado' :
                         user.subscription_status === 'past_due' ? 'Vencido' :
                         user.subscription_status === 'trialing' ? 'Teste' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="text-white">{user.usage_count.toLocaleString()} / {user.usage_limit.toLocaleString()}</div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${Math.min((user.usage_count / user.usage_limit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{formatDate(user.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                          onClick={() => setSelectedUser(user)}
                        >
                          👁️ Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                          onClick={() => handleUserAction(user.id, 'edit')}
                        >
                          ✏️ Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                          onClick={() => handleUserAction(user.id, user.is_active ? 'deactivate' : 'activate')}
                        >
                          🚫 {user.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Detalhes do Usuário</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Empresa</label>
                  <p className="text-white">{selectedUser.company_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Plano</label>
                  <Badge className={getPlanColor(selectedUser.plan)}>
                    {selectedUser.plan.charAt(0).toUpperCase() + selectedUser.plan.slice(1)}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <Badge className={getStatusColor(selectedUser.subscription_status || 'inactive')}>
                    {selectedUser.subscription_status === 'active' ? 'Ativo' :
                     selectedUser.subscription_status === 'canceled' ? 'Cancelado' :
                     selectedUser.subscription_status === 'past_due' ? 'Vencido' :
                     selectedUser.subscription_status === 'trialing' ? 'Teste' : 'Inativo'}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Uso Atual</label>
                  <p className="text-white">{selectedUser.usage_count.toLocaleString()} / {selectedUser.usage_limit.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Data de Criação</label>
                  <p className="text-white">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleUserAction(selectedUser.id, 'edit')}
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  ✏️ Editar Usuário
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUserAction(selectedUser.id, 'reset_password')}
                  className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
                >
                  🔑 Resetar Senha
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleUserAction(selectedUser.id, selectedUser.is_active ? 'deactivate' : 'activate')}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  🚫 {selectedUser.is_active ? 'Desativar' : 'Ativar'} Usuário
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 