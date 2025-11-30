import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { formatCNPJ, formatPhone, validateCNPJ, removeNonNumeric } from '../../lib/validators';

interface FormData {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  slaHours: number;
}

export function CreateCompanySimplePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    slaHours: 24,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Aplicar máscara de CNPJ
    if (name === 'cnpj') {
      const formatted = formatCNPJ(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // Aplicar máscara de telefone
    if (name === 'phone') {
      const formatted = formatPhone(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.cnpj.trim() || !formData.email.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar CNPJ
    if (!validateCNPJ(formData.cnpj)) {
      toast.error('CNPJ inválido. Por favor, verifique o número digitado.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Enviar dados com CNPJ e telefone sem formatação
      const payload = {
        name: formData.name,
        cnpj: removeNonNumeric(formData.cnpj),
        email: formData.email,
        phone: removeNonNumeric(formData.phone),
        address: formData.address,
        slaHours: Number(formData.slaHours),
      };

      await api.post('/api/companies', payload);
      toast.success('Empresa criada com sucesso!');
      navigate('/companies/view');
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao criar empresa. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = 'text-tas-primary';
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const labelTextClass = 'text-tas-text-on-card font-medium';
  const inputBaseClasses = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tas-secondary focus:border-transparent bg-white text-tas-text-on-card';
  const buttonPrimaryClasses = 'w-full sm:w-auto px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed';


  return (
    <>
      <Helmet>
        <title>Criar Empresa - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Criar Nova Empresa</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Cadastre uma nova empresa no sistema.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className={`block mb-2 ${labelTextClass}`}>
                  Nome da Empresa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputBaseClasses}
                  placeholder="Digite o nome da empresa"
                />
              </div>

              <div>
                <label htmlFor="cnpj" className={`block mb-2 ${labelTextClass}`}>
                  CNPJ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  required
                  className={inputBaseClasses}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  autoComplete="off"
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
                  required
                  className={inputBaseClasses}
                  placeholder="empresa@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="slaHours" className={`block mb-2 ${labelTextClass}`}>
                  SLA (Horas) <span className="text-red-500">*</span>
                </label>
                <select
                  id="slaHours"
                  name="slaHours"
                  value={formData.slaHours}
                  onChange={handleChange as any}
                  required
                  className={inputBaseClasses}
                >
                  <option value={12}>12 Horas</option>
                  <option value={24}>24 Horas</option>
                  <option value={48}>48 Horas</option>
                  <option value={72}>72 Horas</option>
                </select>
              </div>

              <div>
                <label htmlFor="phone" className={`block mb-2 ${labelTextClass}`}>
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
                  maxLength={15}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="address" className={`block mb-2 ${labelTextClass}`}>
                  Endereço
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={inputBaseClasses}
                  placeholder="Digite o endereço completo"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={buttonPrimaryClasses}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Empresa'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
