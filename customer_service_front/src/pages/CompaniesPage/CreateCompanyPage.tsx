// src/pages/CompaniesPage/CreateCompanyPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyUser {
  id: number;
  user?: {
    name: string;
    email: string;
  };
}

interface FormData {
  tradingName: string;
  legalName: string;
  taxId: string;
  address: string;
  phone: string;
  email: string;
  responsibleId: string;
  userIds: number[];
}

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    tradingName: '',
    legalName: '',
    taxId: '',
    address: '',
    phone: '',
    email: '',
    responsibleId: '',
    userIds: [],
  });
  
  const [unassignedUsers, setUnassignedUsers] = useState<CompanyUser[]>([]);
  const [allUsers, setAllUsers] = useState<CompanyUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const [unassignedRes, allRes] = await Promise.all([
          api.get('/api/company-users/unassigned'),
          api.get('/api/company-users/all')
        ]);
        setUnassignedUsers(unassignedRes.data || []);
        setAllUsers(allRes.data || []);
      } catch (error: any) {
        console.error('Erro ao buscar usuários:', error);
        toast.error('Falha ao carregar usuários. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      userIds: prev.userIds.includes(userId)
        ? prev.userIds.filter(id => id !== userId)
        : [...prev.userIds, userId]
    }));
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, taxId: formatted }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.tradingName || !formData.legalName || !formData.taxId || !formData.responsibleId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      tradingName: formData.tradingName,
      legalName: formData.legalName,
      taxId: formData.taxId.replace(/\D/g, ''),
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      responsibleId: parseInt(formData.responsibleId, 10),
      userIds: formData.userIds,
    };

    try {
      await api.post('/api/companies', payload);
      toast.success('Empresa cadastrada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Ocorreu um erro ao criar a empresa.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Classes de estilo
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const inputBaseClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isSubmitting || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;
  const sectionTitleClass = "text-xl font-semibold mb-4 text-tas-primary";

  if (isLoading) {
    return (
      <>
        <Helmet><title>Cadastro de Empresa - TAS</title></Helmet>
        <div className={pageWrapperClasses}>
          <div className={contentContainerClasses}>
            <p className="text-center text-tas-text-secondary-on-card py-10">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Cadastro de Empresa - TAS</title></Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Cadastro de Nova Empresa
            </h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Preencha as informações da empresa e associe usuários
            </p>
          </header>

          <section className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações da Empresa */}
              <div>
                <h2 className={sectionTitleClass}>Informações da Empresa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="tradingName" className={labelClasses}>
                      Nome Fantasia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="tradingName"
                      name="tradingName"
                      value={formData.tradingName}
                      onChange={handleChange}
                      className={inputBaseClasses}
                      placeholder="Ex: TechSolutions"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="legalName" className={labelClasses}>
                      Razão Social <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="legalName"
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleChange}
                      className={inputBaseClasses}
                      placeholder="Ex: TechSolutions Ltda"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="taxId" className={labelClasses}>
                      CNPJ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleCNPJChange}
                      className={inputBaseClasses}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClasses}>
                      Email de Contato
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputBaseClasses}
                      placeholder="contato@empresa.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClasses}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputBaseClasses}
                      placeholder="(00) 00000-0000"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className={labelClasses}>
                      Endereço
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={inputBaseClasses}
                      placeholder="Rua, Número, Cidade - UF"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Usuário Responsável */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className={sectionTitleClass}>Usuário Responsável</h2>
                <div>
                  <label htmlFor="responsibleId" className={labelClasses}>
                    Selecione um usuário <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="responsibleId"
                    name="responsibleId"
                    value={formData.responsibleId}
                    onChange={handleChange}
                    className={inputBaseClasses}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">-- Selecione um usuário --</option>
                    {allUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.user?.name || `Usuário ${user.id}`} ({user.user?.email || 'Sem email'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className={sectionTitleClass}>Associar Usuários à Empresa</h2>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 space-y-2 bg-white">
                  {unassignedUsers.length > 0 ? (
                    unassignedUsers.map(user => (
                      <div key={user.id} className="flex items-center py-2 hover:bg-gray-50 rounded px-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.userIds.includes(user.id)}
                          onChange={() => handleCheckboxChange(user.id)}
                          className="h-4 w-4 rounded border-gray-300 text-tas-secondary focus:ring-tas-secondary"
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="ml-3 text-sm text-tas-text-on-card cursor-pointer flex-1"
                        >
                          {user.user?.name || `Usuário ${user.id}`} - {user.user?.email || 'Sem email'}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-tas-text-secondary-on-card text-center py-4">
                      Nenhum usuário não associado encontrado.
                    </p>
                  )}
                </div>
                {formData.userIds.length > 0 && (
                  <p className="text-sm text-tas-secondary mt-2">
                    {formData.userIds.length} usuário(s) selecionado(s)
                  </p>
                )}
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-tas-text-secondary-on-card font-semibold hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button type="submit" className={buttonClasses} disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Empresa'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
