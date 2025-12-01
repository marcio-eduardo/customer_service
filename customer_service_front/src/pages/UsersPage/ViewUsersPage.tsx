// src/pages/UsersPage/ViewUsersPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types/User';
import type { Company } from '../../types/Company';
import { toast } from 'sonner';
import { formatCPF } from '../../lib/validators'; // Assumindo que o CPF existe na interface User

type TabType = 'company_user' | 'tech_user' | 'moderator';

interface EditFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'COMPANY_USER' | 'TECH_USER' | 'MODERATOR_USER' | '';
  companyId: number | '';
}

export function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('company_user');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    username: '', firstName: '', lastName: '', email: '', password: '', role: '', companyId: ''
  });
  const { user } = useAuth();
  const isModerator = user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [usersResponse, companiesResponse] = await Promise.all([
          api.get<User[]>('/api/users'),
          api.get<Company[]>('/api/companies')
        ]);
        setUsers(usersResponse.data || []);
        setCompanies(companiesResponse.data || []);
      } catch (err: any) {
        const msg = err.response?.data?.message || `Ocorreu um erro desconhecido.`;
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };
    if (isModerator) fetchData();
  }, [isModerator]);

  const handleEditClick = (userToEdit: User) => {
    setEditingUser(userToEdit);
    const rawRole = userToEdit.roles.find(r => r.startsWith('ROLE_'))?.replace('ROLE_', '') || '';
    const userRole = rawRole === 'MODERATOR' ? 'MODERATOR_USER' : rawRole as EditFormData['role'];
    setEditFormData({
      username: userToEdit.username,
      firstName: userToEdit.firstName || '',
      lastName: userToEdit.lastName || '',
      email: userToEdit.email,
      password: '',
      role: userRole,
      companyId: userToEdit.companyId || ''
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'role' && (value === 'MODERATOR_USER' || value === 'TECH_USER')) {
      setEditFormData(prev => ({ ...prev, [name]: value, companyId: '' }));
      return;
    }

    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (editFormData.role === 'COMPANY_USER' && !editFormData.companyId) {
      toast.error('É necessário selecionar uma empresa para usuários deste tipo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        username: editFormData.username,
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        role: editFormData.role,
        companyId: editFormData.role === 'COMPANY_USER' ? Number(editFormData.companyId) : null,
      };
      if (editFormData.password) payload.password = editFormData.password;

      await api.put(`/api/users/${editingUser.id}`, payload);
      toast.success('Usuário atualizado com sucesso!');
      setEditingUser(null);
      const response = await api.get<User[]>('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/api/users/${deletingUser.id}`);
      toast.success('Usuário deletado com sucesso!');
      setDeletingUser(null);
      setUsers(users.filter(u => u.id !== deletingUser.id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao deletar usuário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => u.roles?.includes(`ROLE_${activeTab.toUpperCase()}`));

  // --- Estilos ---
  const pageWrapperClasses = `min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = 'text-tas-primary';
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const userNameTextClasses = 'text-tas-primary font-semibold';
  const userDetailTextClasses = 'text-tas-text-on-card';
  const userLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';
  const buttonPrimaryClasses = 'inline-flex items-center px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors shadow-md';
  const modalInputClasses = "w-full px-4 py-2 bg-tas-bg-page border border-tas-accent/20 rounded-lg text-tas-text-on-card focus:outline-none focus:ring-2 focus:ring-tas-secondary";
  const tabButtonBaseClasses = 'px-6 py-3 font-semibold rounded-t-lg transition-colors border-b-2';
  const tabButtonActiveClasses = 'bg-tas-bg-card text-tas-primary border-tas-primary';
  const tabButtonInactiveClasses = 'bg-transparent text-tas-text-secondary-on-card border-transparent hover:bg-tas-accent/10 hover:border-tas-accent/30';
  const labelClasses = 'block text-tas-text-secondary-on-card font-medium mb-1';

  return (
    <>
      <Helmet><title>Usuários - TAS</title></Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Usuários Cadastrados</h1>
                <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>Gerencie os usuários do sistema.</p>
              </div>
              {isModerator && (
                <Link to="/admin/criar-utilizador" className={buttonPrimaryClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  Novo Usuário
                </Link>
              )}
            </div>
          </header>

          {isLoading && <div className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6`}><p className={loadingTextClass}>Carregando...</p></div>}
          {error && <div className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6`}><p className={errorTextClass}>{error}</p></div>}

          {!isLoading && !error && (
            <section className={`${sectionCardBgClasses} shadow-xl rounded-xl overflow-hidden border border-black/10`}>
              <div className="flex border-b border-tas-accent/20">
                <button onClick={() => setActiveTab('company_user')} className={`${tabButtonBaseClasses} ${activeTab === 'company_user' ? tabButtonActiveClasses : tabButtonInactiveClasses}`}>Clientes ({users.filter(u => u.roles.includes('ROLE_COMPANY_USER')).length})</button>
                <button onClick={() => setActiveTab('tech_user')} className={`${tabButtonBaseClasses} ${activeTab === 'tech_user' ? tabButtonActiveClasses : tabButtonInactiveClasses}`}>Técnicos ({users.filter(u => u.roles.includes('ROLE_TECH_USER')).length})</button>
                <button onClick={() => setActiveTab('moderator')} className={`${tabButtonBaseClasses} ${activeTab === 'moderator' ? tabButtonActiveClasses : tabButtonInactiveClasses}`}>Moderadores ({users.filter(u => u.roles.includes('ROLE_MODERATOR')).length})</button>
              </div>

              <div className="p-6 md:p-8">
                {!filteredUsers.length && <p className={`${userDetailTextClasses} text-center py-4`}>Nenhum usuário encontrado para esta categoria.</p>}
                {filteredUsers.length > 0 && (
                  <ul className="space-y-6">
                    {filteredUsers.map((u) => (
                      <li key={u.id} className={`bg-tas-bg-page p-4 sm:p-6 rounded-lg shadow-md border border-tas-accent/10`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className={`text-xl ${userNameTextClasses} mb-2`}>
                              {u.firstName ? `${u.firstName} ${u.lastName}` : u.username}
                              <span className="text-sm font-normal text-tas-text-secondary-on-card ml-2">({u.username})</span>
                            </h3>
                            <div className="mt-3 text-sm space-y-1">
                              <p><span className={userLabelTextClasses}>Email:</span> <span className={userDetailTextClasses}>{u.email}</span></p>
                              {u.cpf && <p><span className={userLabelTextClasses}>CPF:</span> <span className={userDetailTextClasses}>{formatCPF(u.cpf)}</span></p>}
                              {u.companyName && <p><span className={userLabelTextClasses}>Empresa:</span> <span className={userDetailTextClasses}>{u.companyName}</span></p>}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => handleEditClick(u)} className="px-4 py-2 bg-tas-secondary text-tas-text-on-primary rounded-lg hover:bg-tas-secondary-hover transition-colors text-sm font-semibold">Editar</button>
                            <button onClick={() => setDeletingUser(u)} className="px-4 py-2 bg-tas-status-error text-tas-text-on-primary rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold">Deletar</button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {editingUser && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setEditingUser(null)}
            >
              <div
                className="bg-tas-bg-card rounded-xl shadow-2xl max-w-md w-full p-6 border border-black/10"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-tas-primary mb-4">Editar Usuário</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className={labelClasses}>Username</label>
                    <input type="text" id="username" name="username" value={editFormData.username} onChange={handleEditChange} required className={modalInputClasses} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="firstName" className={labelClasses}>Nome</label>
                      <input type="text" id="firstName" name="firstName" value={editFormData.firstName} onChange={handleEditChange} required className={modalInputClasses} />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="lastName" className={labelClasses}>Sobrenome</label>
                      <input type="text" id="lastName" name="lastName" value={editFormData.lastName} onChange={handleEditChange} required className={modalInputClasses} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClasses}>Email</label>
                    <input type="email" id="email" name="email" value={editFormData.email} onChange={handleEditChange} required className={modalInputClasses} />
                  </div>
                  <div>
                    <label htmlFor="password" className={labelClasses}>Nova Senha <span className="text-tas-text-secondary-on-card/70 text-xs">(deixe em branco para manter)</span></label>
                    <input type="password" id="password" name="password" value={editFormData.password} onChange={handleEditChange} className={modalInputClasses} placeholder="••••••••" />
                  </div>
                  <div>
                    <label htmlFor="role" className={labelClasses}>Papel</label>
                    <select id="role" name="role" value={editFormData.role} onChange={handleEditChange} required className={modalInputClasses}>
                      <option value="" disabled>Selecione um papel</option>
                      <option value="COMPANY_USER">Cliente</option>
                      <option value="TECH_USER">Técnico</option>
                      <option value="MODERATOR_USER">Moderador</option>
                    </select>
                  </div>
                  {editFormData.role === 'COMPANY_USER' && (
                    <div>
                      <label htmlFor="companyId" className={labelClasses}>Empresa</label>
                      <select id="companyId" name="companyId" value={editFormData.companyId} onChange={handleEditChange} required className={modalInputClasses}>
                        <option value="">Selecione uma empresa</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setEditingUser(null)} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-tas-bg-page text-tas-text-secondary rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors font-semibold disabled:opacity-50">Cancelar</button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-tas-secondary text-tas-text-on-primary rounded-lg hover:bg-tas-secondary-hover transition-colors font-semibold disabled:opacity-50">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {deletingUser && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setDeletingUser(null)}
            >
              <div
                className="bg-tas-bg-card rounded-xl shadow-2xl max-w-md w-full p-6 border border-black/10"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-tas-status-error mb-4">Confirmar Exclusão</h2>
                <p className="text-tas-text-on-card mb-6">Tem certeza que deseja deletar o usuário <strong className="text-tas-primary">{deletingUser.username}</strong>? Esta ação não pode ser desfeita.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeletingUser(null)} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-tas-bg-page text-tas-text-secondary rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors font-semibold disabled:opacity-50">Cancelar</button>
                  <button onClick={handleDeleteConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2 bg-tas-status-error text-tas-text-on-primary rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50">{isSubmitting ? 'Deletando...' : 'Deletar'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}