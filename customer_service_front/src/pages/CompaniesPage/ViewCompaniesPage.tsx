// Localização: src/pages/ViewCompaniesPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { Company } from '../../types/Company';
import { formatCNPJ, formatPhone } from '../../lib/validators';

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

interface PaginatedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

const formatDate = (dateString: string) => {
  try {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString || 'N/A';
    }
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    console.warn("Erro ao formatar data:", dateString, e);
    return dateString;
  }
};

export function ViewCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);
  const { user } = useAuth();

  const apiUrl = '/api/companies';
  const isModerator = user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      setCompanies([]);
      setPaginationInfo(null);
      try {
        const response = await api.get<Company[]>(apiUrl);
        const data = response.data;

        if (data && Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.warn("Estrutura de dados da API inesperada para empresas. Não é um array:", data);
          setCompanies([]);
        }
      } catch (err: any) {
        console.error(`Falha ao buscar empresas:`, err);
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado ou se sua sessão expirou.");
        } else {
          setError(err.message || `Ocorreu um erro desconhecido ao buscar empresas.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  
  const companyNameTextClasses = 'text-tas-primary font-semibold';
  const companyDetailTextClasses = 'text-tas-text-on-card';
  const companyLabelTextClasses = 'text-tas-text-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';
  const buttonPrimaryClasses = 'inline-flex items-center px-6 py-3 bg-tas-secondary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-secondary-hover transition-colors shadow-md';

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

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={loadingTextClass}>A carregar empresas...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && companies.length === 0 && (
              <p className={`${companyDetailTextClasses} text-center py-4`}>Nenhuma empresa encontrada.</p>
            )}

            {!isLoading && !error && companies.length > 0 && (
              <ul className="space-y-6">
                {companies.map((company) => (
                  <li key={company.id} className={`bg-tas-bg-card p-4 sm:p-6 rounded-lg shadow-md border border-gray-700 transition-shadow hover:shadow-lg`}>
                    <h3 className={`text-xl ${companyNameTextClasses} mb-1`}>{company.name}</h3>
                    <p className={`text-sm ${companyDetailTextClasses} mb-2`}><span className={companyLabelTextClasses}>CNPJ:</span> {formatCNPJ(company.cnpj || '')}</p>
                    <div className="mt-3 text-sm space-y-1">
                      <p><span className={companyLabelTextClasses}>Email:</span> <span className={companyDetailTextClasses}>{company.email || 'N/A'}</span></p>
                      <p><span className={companyLabelTextClasses}>Telefone:</span> <span className={companyDetailTextClasses}>{company.phone ? formatPhone(company.phone) : 'N/A'}</span></p>
                      <p><span className={companyLabelTextClasses}>Endereço:</span> <span className={companyDetailTextClasses}>{company.address || 'N/A'}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {paginationInfo && !isLoading && companies.length > 0 && (
              <div className={`mt-8 text-center text-sm ${companyDetailTextClasses}`}>
                Página {paginationInfo.number + 1} de {paginationInfo.totalPages}. Total de {paginationInfo.totalElements} empresas.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
