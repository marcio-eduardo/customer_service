// src/pages/CreateUserPage/CreateUserPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import TASLogo from '../../assets/logo/NuvemConfig-2.svg';
import type { Company } from '../../types/Company';
import { getAllCompanies } from '../../services/companyService';

interface CreateUserFormData {
  username: string;
  email: string;
  password: string;
  role: 'COMPANY_USER' | 'TECH_USER' | 'MODERATOR_USER';
  companyId: number | '';
}

export function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
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
        email: formData.email,
        password: formData.password,
        role: formData.role,
        companyId: formData.companyId ? Number(formData.companyId) : null,
      };

      await api.post('/api/users', payload);

      toast.success(`Usuário '${formData.username}' criado com sucesso!`);
      setFormData({
        username: '',
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

  const pageWrapperClasses = "min-h-screen flex flex-col items-center justify-center p-4 bg-tas-bg-page";
  const contentCardClasses = "p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md bg-tas-bg-card border border-black/10";
  const inputClasses = "w-full px-4 py-2.5 bg-tas-bg-page text-tas-text-on-card border border-tas-accent/20 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary disabled:opacity-50";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const buttonClasses = "w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors bg-tas-secondary hover:bg-tas-secondary-hover disabled:bg-tas-secondary/50";

  const shouldShowCompanyField = formData.role === 'COMPANY_USER';

  return (
    <>
      <Helmet>
        <title>Criar Usuário - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentCardClasses}>
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <img src={TASLogo} alt="TAS Logo" className="h-16 w-auto" />
            <h2 className="text-2xl font-bold text-tas-primary">
              Criar Novo Usuário
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className={labelClasses}> Nome de Usuário <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ex: joao.silva"
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}> Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}> Senha <span className="text-red-500">*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Senha com no mínimo 6 caracteres"
                className={inputClasses}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="role" className={labelClasses}> Papel do Usuário <span className="text-red-500">*</span></label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClasses}
                disabled={isLoading}
              >
                <option value="COMPANY_USER">Usuário de Empresa</option>
                <option value="TECH_USER">Técnico</option>
                <option value="MODERATOR_USER">Moderador</option>
              </select>
            </div>

            {shouldShowCompanyField && (
              <div>
                <label htmlFor="companyId" className={labelClasses}> Empresa <span className="text-red-500">*</span></label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className={inputClasses}
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

            <div className="pt-2">
              <button
                type="submit"
                className={buttonClasses}
                disabled={isLoading || isFetchingCompanies}
              >
                {isLoading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}