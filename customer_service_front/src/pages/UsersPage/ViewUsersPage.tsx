// src/pages/UsersPage/ViewUsersPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types/User';
import type { Company } from '../../types/Company';
import { toast } from 'sonner';

type TabType = 'company' | 'tech';

interface EditFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  companyId: number | '';
}

export function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('company');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    username: '',
    email: '',
    password: '',
    role: '',
    companyId: ''
  });
  const { user } = useAuth();

  const isModerator = user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setUsers([]);
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          api.get<User[]>('/api/users'),
          api.get<Company[]>('/api/companies')
        ]);

        if (usersResponse.data && Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data);
        }
        
        if (companiesResponse.data && Array.isArray(companiesResponse.data)) {
          setCompanies(companiesResponse.data);
        }
      } catch (err: any) {
        console.error(`Falha ao buscar dados:`, err);
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado ou se sua sessão expirou.");
        } else {
          setError(err.message || `Ocorreu um erro desconhecido ao buscar dados.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.roles[0]?.replace('ROLE_', '').toLowerCase() || '',
      companyId: user.companyId || ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role,
      };

      if (editFormData.password) {
        payload.password = editFormData.password;
      }

      if (editFormData.companyId) {
        payload.companyId = Number(editFormData.companyId);
      }

      await api.put(`/api/users/${editingUser.id}`, payload);
      
      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      
      // Recarregar usuários
      const response = await api.get<User[]>('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/api/users/${deletingUser.id}`);
      
      toast.success('Usuário deletado com sucesso!');
      setDeletingUser(null);
      
      // Recarregar usuários
      const response = await api.get<User[]>('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      console.error('Erro ao deletar usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao deletar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar usuários por role
  const companyUsers = users.filter(u => u.roles?.includes('ROLE_COMPANY_USER'));
  const techUsers = users.filter(u => u.roles?.includes('ROLE_TECH_USER'));

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  
  const userNameTextClasses = 'text-tas-primary font-semibold';
  const userDetailTextClasses = 'text-tas-text-on-card';
  const userLabelTextClasses = 'text-tas-text-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';
  const buttonPrimaryClasses = 'inline-flex items-center px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors shadow-md';

  // Tab classes
  const tabButtonBaseClasses = 'px-6 py-3 font-semibold rounded-t-lg transition-colors border-b-2';
  const tabButtonActiveClasses = 'bg-tas-bg-card text-tas-primary border-tas-primary';
  const tabButtonInactiveClasses = 'bg-gray-700 text-gray-400 border-transparent hover:bg-gray-600 hover:text-gray-300';

  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tas-secondary focus:border-transparent bg-white text-tas-text-on-card";
  const labelClasses = "block mb-2 text-tas-text-on-card font-medium";

  const currentUsers = activeTab === 'company' ? companyUsers : techUsers;

  return (
    <>
      <Helmet>
        <title>Usuários Cadastrados - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Usuários Cadastrados</h1>
                <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
                  Consulte os dados dos usuários cadastrados no sistema.
                </p>
              </div>
              {isModerator && (
                <Link to="/admin/criar-utilizador" className={buttonPrimaryClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Novo Usuário
                </Link>
              )}
            </div>
          </header>

          {isLoading && (
            <div className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
              <p className={loadingTextClass}>A carregar usuários...</p>
            </div>
          )}

          {error && (
            <div className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
              <p className={errorTextClass}>{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <section className={`${sectionCardBgClasses} shadow-xl rounded-xl overflow-hidden`}>
              {/* Tabs */}
              <div className="flex border-b border-gray-700 bg-gray-800">
                <button
                  onClick={() => setActiveTab('company')}
                  className={`${tabButtonBaseClasses} ${activeTab === 'company' ? tabButtonActiveClasses : tabButtonInactiveClasses}`}
                >
                  Usuários de Empresa ({companyUsers.length})
                </button>
                <button
                  onClick={() => setActiveTab('tech')}
                  className={`${tabButtonBaseClasses} ${activeTab === 'tech' ? tabButtonActiveClasses : tabButtonInactiveClasses}`}
                >
                  Técnicos ({techUsers.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {currentUsers.length === 0 && (
                  <p className={`${userDetailTextClasses} text-center py-4`}>
                    {activeTab === 'company' ? 'Nenhum usuário de empresa encontrado.' : 'Nenhum técnico encontrado.'}
                  </p>
                )}

                {currentUsers.length > 0 && (
                  <ul className="space-y-6">
                    {currentUsers.map((user) => (
                      <li key={user.id} className={`bg-tas-bg-card p-4 sm:p-6 rounded-lg shadow-md border border-gray-700 transition-shadow hover:shadow-lg`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className={`text-xl ${userNameTextClasses} mb-1`}>{user.username}</h3>
                            <div className="mt-3 text-sm space-y-1">
                              <p><span className={userLabelTextClasses}>Email:</span> <span className={userDetailTextClasses}>{user.email}</span></p>
                              {user.companyName && (
                                <p><span className={userLabelTextClasses}>Empresa:</span> <span className={userDetailTextClasses}>{user.companyName}</span></p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditClick(user)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                            >
                              Deletar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {/* Modal de Edição */}
          {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-tas-bg-card rounded-xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-tas-primary mb-4">Editar Usuário</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className={labelClasses}>Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                      required
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      required
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className={labelClasses}>
                      Nova Senha <span className="text-gray-400 text-sm">(deixe em branco para manter)</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                      className={inputClasses}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className={labelClasses}>Papel</label>
                    <select
                      id="role"
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditChange}
                      required
                      className={inputClasses}
                    >
                      <option value="company_user">Usuário de Empresa</option>
                      <option value="tech_user">Técnico</option>
                      <option value="moderator">Moderador</option>
                    </select>
                  </div>

                  {editFormData.role === 'company_user' && (
                    <div>
                      <label htmlFor="companyId" className={labelClasses}>Empresa</label>
                      <select
                        id="companyId"
                        name="companyId"
                        value={editFormData.companyId}
                        onChange={handleEditChange}
                        required
                        className={inputClasses}
                      >
                        <option value="">Selecione uma empresa</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-tas-secondary text-tas-text-on-primary rounded-lg hover:bg-tas-secondary-hover transition-colors font-semibold disabled:opacity-50"
                    >
                      {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Exclusão */}
          {deletingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-tas-bg-card rounded-xl shadow-2xl max-w-md w-full p-6">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Confirmar Exclusão</h2>
                <p className="text-tas-text-on-card mb-6">
                  Tem certeza que deseja deletar o usuário <strong className="text-tas-primary">{deletingUser.username}</strong>?
                  Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingUser(null)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Deletando...' : 'Deletar'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
