import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { toast } from 'sonner';

interface Company {
  id: number;
  tradingName: string;
  legalName: string;
}

export function SelectCompanyForUserPage() {
  const navigate = useNavigate();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/companies/all');
        setCompanies(response.data || []);
      } catch (error: any) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Não foi possível carregar a lista de empresas');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  const handleProceed = () => {
    if (!selectedCompanyId) {
      toast.warning('Por favor, selecione uma empresa');
      return;
    }
    navigate(`/companies/${selectedCompanyId}/add-user`);
  };

  // Classes de estilo
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const cardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  const labelClasses = "block text-sm font-medium mb-2 text-tas-text-secondary-on-card";
  const selectClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${!selectedCompanyId || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;

  if (isLoading) {
    return (
      <>
        <Helmet><title>Adicionar Usuário - TAS</title></Helmet>
        <div className={pageWrapperClasses}>
          <div className={contentContainerClasses}>
            <p className="text-center text-tas-text-secondary-on-card py-10">Carregando empresas...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Adicionar Usuário a uma Empresa - TAS</title></Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Adicionar Usuário a uma Empresa
            </h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Para qual empresa você deseja adicionar um novo usuário?
            </p>
          </header>

          <section className={cardClasses}>
            <div className="mb-6">
              <label htmlFor="company-select" className={labelClasses}>
                Selecione a Empresa <span className="text-red-500">*</span>
              </label>
              <select
                id="company-select"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className={selectClasses}
                disabled={isLoading}
              >
                <option value="">-- Selecione uma empresa --</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.tradingName}
                  </option>
                ))}
              </select>
              {companies.length === 0 && (
                <p className="text-sm text-tas-text-secondary-on-card mt-2">
                  Nenhuma empresa cadastrada no sistema
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-tas-text-secondary-on-card font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className={buttonClasses}
                disabled={!selectedCompanyId || isLoading}
              >
                Avançar
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
