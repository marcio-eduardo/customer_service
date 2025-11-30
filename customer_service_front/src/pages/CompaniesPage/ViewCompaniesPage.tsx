// Localização: src/pages/ViewCompaniesPage.tsx
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { Company } from '../../types/Company';
import { formatCNPJ, formatPhone, validateCNPJ, removeNonNumeric } from '../../lib/validators';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function ViewCompaniesPage() {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    slaHours: 24,
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isModerator = user?.roles?.includes('ROLE_MODERATOR');

  const { data: companies = [], isLoading, error } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/api/companies');
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/api/companies/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa atualizada com sucesso!');
      setEditingCompany(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar empresa';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa excluída com sucesso!');
      setDeletingCompany(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao excluir empresa';
      if (errorMessage.includes('usuário(s) vinculado(s)')) {
        toast.error(errorMessage, { duration: 5000 });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  const handleEditClick = (company: Company) => {
    setEditingCompany(company);
    setEditFormData({
      name: company.name || '',
      cnpj: formatCNPJ(company.cnpj || ''),
      email: company.email || '',
      phone: formatPhone(company.phone || ''),
      address: company.address || '',
      slaHours: company.slaHours || 24,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;

    if (editFormData.cnpj) {
      const cnpjNumerico = removeNonNumeric(editFormData.cnpj);
      if (!validateCNPJ(cnpjNumerico)) {
        toast.error('CNPJ inválido');
        return;
      }
    }

    const updateData: any = {};
    if (editFormData.name) updateData.name = editFormData.name;
    if (editFormData.cnpj) updateData.cnpj = removeNonNumeric(editFormData.cnpj);
    if (editFormData.email) updateData.email = editFormData.email;
    if (editFormData.phone) updateData.phone = removeNonNumeric(editFormData.phone);
    if (editFormData.address) updateData.address = editFormData.address;
    if (editFormData.slaHours) updateData.slaHours = Number(editFormData.slaHours);

    updateMutation.mutate({ id: editingCompany.id, data: updateData });
  };

  const handleDeleteConfirm = () => {
    if (deletingCompany) {
      deleteMutation.mutate(deletingCompany.id);
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, cnpj: formatCNPJ(e.target.value) });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, phone: formatPhone(e.target.value) });
  };

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = 'text-tas-primary';
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const companyNameTextClasses = 'text-tas-primary font-semibold';
  const companyDetailTextClasses = 'text-tas-text-on-card';
  const companyLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';
  const buttonPrimaryClasses = 'inline-flex items-center px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors shadow-md';
  const modalInputClasses = "w-full px-4 py-2 bg-tas-bg-page border border-tas-accent/20 rounded-lg text-tas-text-on-card focus:outline-none focus:ring-2 focus:ring-tas-secondary";

  const handleCloseModal = () => {
    setEditingCompany(null);
  };

  return (
    <>
      <Helmet>
        <title>Empresas Cadastradas - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Empresas Cadastradas</h1>
                <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
                  Consulte os dados das empresas cadastradas no sistema.
                </p>
              </div>
              {isModerator && (
                <Link to="/companies/create" className={buttonPrimaryClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Nova Empresa
                </Link>
              )}
            </div>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8 border border-black/10`}>
            {isLoading && <p className={loadingTextClass}>A carregar empresas...</p>}
            {error && <p className={errorTextClass}>Erro ao carregar empresas</p>}

            {!isLoading && !error && companies.length === 0 && (
              <p className={`${companyDetailTextClasses} text-center py-4`}>Nenhuma empresa encontrada.</p>
            )}

            {!isLoading && !error && companies.length > 0 && (
              <ul className="space-y-6">
                {companies.map((company: Company) => (
                  <li key={company.id} className={`bg-tas-bg-page p-4 sm:p-6 rounded-lg shadow-md border border-tas-accent/10 transition-shadow hover:shadow-lg`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className={`text-xl ${companyNameTextClasses} mb-1`}>{company.name}</h3>
                        <p className={`text-sm ${companyDetailTextClasses} mb-2`}>
                          <span className={companyLabelTextClasses}>CNPJ:</span> {formatCNPJ(company.cnpj || '')}
                        </p>
                        <div className="mt-3 text-sm space-y-1">
                          <p><span className={companyLabelTextClasses}>Email:</span> <span className={companyDetailTextClasses}>{company.email || 'N/A'}</span></p>
                          <p><span className={companyLabelTextClasses}>Telefone:</span> <span className={companyDetailTextClasses}>{company.phone ? formatPhone(company.phone) : 'N/A'}</span></p>
                          <p><span className={companyLabelTextClasses}>Endereço:</span> <span className={companyDetailTextClasses}>{company.address || 'N/A'}</span></p>
                          <p><span className={companyLabelTextClasses}>SLA:</span> <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-tas-status-info/10 text-tas-status-info border border-tas-status-info/20">{company.slaHours || 24}h</span></p>
                        </div>
                      </div>
                      {isModerator && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditClick(company)}
                            className="px-3 py-2 bg-tas-secondary text-tas-text-on-primary rounded-lg hover:bg-tas-secondary-hover transition-colors text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeletingCompany(company)}
                            className="px-3 py-2 bg-tas-status-error text-tas-text-on-primary rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {editingCompany && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-tas-bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-tas-primary mb-4">Editar Empresa</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">Nome*</label>
                <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">CNPJ*</label>
                <input type="text" value={editFormData.cnpj} onChange={handleCnpjChange} maxLength={18} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">Email*</label>
                <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className={modalInputClasses} required />
              </div>
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">Telefone</label>
                <input type="text" value={editFormData.phone} onChange={handlePhoneChange} maxLength={15} className={modalInputClasses} />
              </div>
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">SLA (Horas)*</label>
                <select
                  value={editFormData.slaHours}
                  onChange={(e) => setEditFormData({ ...editFormData, slaHours: Number(e.target.value) })}
                  className={modalInputClasses}
                  required
                >
                  <option value={12}>12 Horas</option>
                  <option value={24}>24 Horas</option>
                  <option value={48}>48 Horas</option>
                  <option value={72}>72 Horas</option>
                </select>
              </div>
              <div>
                <label className="block text-tas-text-secondary-on-card font-medium mb-1">Endereço</label>
                <textarea value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} rows={3} className={modalInputClasses} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 bg-tas-bg-page text-tas-text-secondary font-semibold rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={updateMutation.isPending} className="flex-1 px-4 py-2 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors disabled:opacity-50">
                  {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingCompany && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setDeletingCompany(null)}
        >
          <div
            className="bg-tas-bg-card rounded-lg p-6 max-w-md w-full border border-black/10"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-tas-status-error mb-4">Confirmar Exclusão</h2>
            <div className="text-tas-text-on-card mb-6">
              <p className="mb-3">Tem certeza que deseja excluir a empresa <strong>{deletingCompany.name}</strong>?</p>
              <div className="bg-tas-status-warning/10 border border-tas-status-warning/20 rounded-lg p-3 text-sm">
                <p className="text-tas-accent font-medium mb-1">⚠️ Atenção:</p>
                <p className="text-tas-text-secondary-on-card">Não será possível excluir se houver usuários vinculados a esta empresa. Remova ou transfira os usuários antes de prosseguir.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeletingCompany(null)} className="flex-1 px-4 py-2 bg-tas-bg-page text-tas-text-secondary font-semibold rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors">
                Cancelar
              </button>
              <button onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} className="flex-1 px-4 py-2 bg-tas-status-error text-tas-text-on-primary font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}