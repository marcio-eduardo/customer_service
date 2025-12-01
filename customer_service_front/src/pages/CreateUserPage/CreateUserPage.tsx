// src/pages/CreateUserPage/CreateUserPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';

import type { Company } from '../../types/Company';
import { getAllCompanies } from '../../services/companyService';

interface CreateUserFormData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'COMPANY_USER' | 'TECH_USER' | 'MODERATOR_USER';
  companyId: number | '';
}

export function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'COMPANY_USER',
    companyId: '',
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCompanies, setIsFetchingCompanies] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      setIsFetchingCompanies(true);
      try {
        const data = await getAllCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
        toast.error("Não foi possível carregar a lista de empresas.");
      } finally {
        setIsFetchingCompanies(false);
      }
    };
    loadCompanies();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'role' && (value === 'MODERATOR_USER' || value === 'TECH_USER')) {
      setFormData(prev => ({ ...prev, [name]: value as CreateUserFormData['role'], companyId: '' }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.role === 'COMPANY_USER' && !formData.companyId) {
      toast.error('Selecione uma empresa para um Usuário de Empresa.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyId: formData.companyId ? Number(formData.companyId) : null,
      };

      await api.post('/api/users', payload);

      toast.success(`Usuário '${formData.username}' criado com sucesso!`);
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'COMPANY_USER',
        companyId: ''
      });

    } catch (error: any) {
      console.error("Falha na criação do usuário:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao criar o usuário.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = 'text-tas-primary';
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const labelTextClass = 'text-tas-text-on-card font-medium';
  const inputBaseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tas-secondary focus:border-transparent bg-white text-tas-text-on-card disabled:opacity-50';
  const buttonPrimaryClasses = 'w-full sm:w-auto px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const shouldShowCompanyField = formData.role === 'COMPANY_USER';

  return (
    <>
      <Helmet>
        <title>Criar Usuário - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Criar Novo Usuário</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Cadastre um novo usuário no sistema.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className={`block mb-2 ${labelTextClass}`}>
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ex: João"
                    className={inputBaseClasses}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className={`block mb-2 ${labelTextClass}`}>
                    Sobrenome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ex: Silva"
                    className={inputBaseClasses}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className={`block mb-2 ${labelTextClass}`}>
                  Nome de Usuário <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ex: joao.silva"
                  className={inputBaseClasses}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className={`block mb-2 ${labelTextClass}`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  className={inputBaseClasses}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className={`block mb-2 ${labelTextClass}`}>
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Senha com no mínimo 6 caracteres"
                  className={inputBaseClasses}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="role" className={`block mb-2 ${labelTextClass}`}>
                  Papel do Usuário <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputBaseClasses}
                  disabled={isLoading}
                >
                  <option value="COMPANY_USER">Usuário de Empresa</option>
                  <option value="TECH_USER">Técnico</option>
                  <option value="MODERATOR_USER">Moderador</option>
                </select>
              </div>

              {shouldShowCompanyField && (
                <div>
                  <label htmlFor="companyId" className={`block mb-2 ${labelTextClass}`}>
                    Empresa <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    className={inputBaseClasses}
                    required
                    disabled={isLoading || isFetchingCompanies}
                  >
                    <option value="">{isFetchingCompanies ? 'Carregando empresas...' : 'Selecione uma empresa'}</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className={buttonPrimaryClasses}
                  disabled={isLoading || isFetchingCompanies}
                >
                  {isLoading ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}