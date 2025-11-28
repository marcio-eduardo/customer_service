// src/pages/CreateUserPage/CreateUserPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import TASLogo from '../../assets/logo/NuvemConfig-2.svg';
import type { Company } from '../../types/Company';
import { getAllCompanies } from '../../services/companyService';

// Interface para os dados do formulário
interface CreateUserFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  nome: string;
  cpf: string;
  companyId: number | '';
}

export function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: '',
    email: '',
    password: '',
    role: 'company_user',
    nome: '',
    cpf: '',
    companyId: '',
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getAllCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Não foi possível carregar a lista de empresas.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
      // Limpar formulário
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        nome: '',
        cpf: '',
        companyId: ''
      });

    } catch (error: any) {
      console.error("Falha no registro:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao criar o usuário.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white text-tas-text-on-card border-gray-300 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";

  return (
    <>
      <Helmet>
        <title>Criar Usuário - TAS</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] bg-tas-bg-page">
        <div className="p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md bg-tas-bg-card">
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <img src={TASLogo} alt="TAS Logo" className="h-16 w-auto" />
            <h2 className="text-2xl font-bold text-tas-primary">
              Criar Novo Usuário
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className={labelClasses}> Nome Completo </label>
              <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome completo"
                className={inputClasses}
                required disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="cpf" className={labelClasses}> CPF </label>
              <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF (apenas números)"
                className={inputClasses}
                required disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="username" className={labelClasses}> Nome de Usuário </label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Nome de usuário"
                className={inputClasses}
                required disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}> Email </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@exemplo.com"
                className={inputClasses}
                required disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}> Senha </label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Senha segura"
                className={inputClasses}
                required disabled={isLoading} />
            </div>

            <div>
              <label htmlFor="companyId" className={labelClasses}> Empresa </label>
              <select id="companyId" name="companyId" value={formData.companyId} onChange={handleChange}
                className={inputClasses}
                required disabled={isLoading}>
                <option value="">Selecione uma empresa</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.tradeName} ({company.cnpj})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role" className={labelClasses}> Papel do Usuário </label>
              <select id="role" name="role" value={formData.role} onChange={handleChange}
                className={inputClasses}
                disabled={isLoading}>
                <option value="user">Usuário (User)</option>
                <option value="company_user">Usuário de Empresa (Company User)</option>
                <option value="tech_user">Técnico (Tech User)</option>
                <option value="moderator">Moderador (Moderator)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors bg-tas-secondary hover:bg-tas-secondary-hover disabled:bg-gray-400"
                disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
