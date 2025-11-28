import { useState, useEffect, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

interface Company {
  id: number;
  tradingName: string;
  legalName: string;
}

interface FormData {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: string;
}

export function AddUserToCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!id) {
        toast.error('ID da empresa não fornecido');
        navigate('/companies');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get<Company>(`/api/companies/${id}`);
        setCompany(response.data);
      } catch (error: any) {
        console.error('Erro ao buscar empresa:', error);
        toast.error('Falha ao carregar detalhes da empresa');
        navigate('/companies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      }
      return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.cpf || !formData.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      cpf: formData.cpf.replace(/\D/g, ''),
      email: formData.email,
      phone: formData.phone.replace(/\D/g, ''),
      address: formData.address,
      company: { id: Number(id) },
    };

    try {
      await api.post('/api/company-users', payload);
      toast.success('Usuário adicionado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro ao adicionar usuário:', error);
      const errorMessage = error.response?.data?.message || error.response?.data || 'Ocorreu um erro ao adicionar o usuário.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Classes de estilo
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const inputBaseClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isSubmitting || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;

  if (isLoading) {
    return (
      <>
        <Helmet><title>Adicionar Usuário - TAS</title></Helmet>
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
      <Helmet><title>Adicionar Usuário - {company?.tradingName || 'Empresa'} - TAS</title></Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Adicionar Usuário a {company?.tradingName}
            </h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Preencha os dados do novo usuário para esta empresa
            </p>
          </header>

          <section className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações do Usuário */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputBaseClasses}
                    placeholder="Ex: João da Silva"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className={labelClasses}>
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    className={inputBaseClasses}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputBaseClasses}
                    placeholder="usuario@email.com"
                    required
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
                    onChange={handlePhoneChange}
                    className={inputBaseClasses}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
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

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-tas-text-secondary-on-card font-semibold hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={buttonClasses}
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Usuário'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
