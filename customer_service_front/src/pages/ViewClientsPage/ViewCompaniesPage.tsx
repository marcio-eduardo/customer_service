import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { api } from '../../lib/axios';

interface CompanyUser {
  id?: number;
  name: string;
  cpf: string;
}

interface CompanyType {
  id: number;
  tradingName: string;
  taxId: string;
  legalName: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationDate: string;
  responsible?: CompanyUser;
}

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
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    console.warn("Error formatting date:", dateString, e);
    return dateString;
  }
};

export function ViewCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);

  const apiUrl = '/api/companies';

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      setCompanies([]);
      setPaginationInfo(null);
      try {
        const response = await api.get<PaginatedResponse<CompanyType>>(apiUrl);
        const data = response.data;

        if (data && Array.isArray(data.content)) {
          setCompanies(data.content);
          const { content, ...restOfPaginationData } = data;
          setPaginationInfo(restOfPaginationData);
        } else {
          console.warn("Unexpected API data structure for companies. 'content' field not found or not an array:", data);
          setCompanies([]);
        }
      } catch (err: any) {
        console.error(`Failed to fetch companies:`, err);
        if (err.response && err.response.status === 401) {
          setError("Error 401: Unauthorized. Please check if you are logged in or if your session has expired.");
        } else {
          setError(err.message || `An unknown error occurred while fetching companies.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [apiUrl]);

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card';

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  const clientCardBgClasses = 'bg-white';
  
  const clientNameTextClasses = 'text-tas-primary font-semibold';
  const clientDetailTextClasses = 'text-tas-text-secondary-on-card';
  const clientLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';

  return (
    <>
      <Helmet>
        <title>Companies - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Companies</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Consult your registered companies data.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={loadingTextClass}>Loading companies...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && companies.length === 0 && (
              <p className={`${clientDetailTextClasses} text-center py-4`}>No companies found.</p>
            )}

            {!isLoading && !error && companies.length > 0 && (
              <ul className="space-y-6">
                {companies.map((company) => (
                  <li key={company.id} className={`${clientCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg`}>
                    <h3 className={`text-xl ${clientNameTextClasses} mb-1`}>{company.tradingName}</h3>
                    <p className={`text-sm ${clientDetailTextClasses} mb-1`}><span className={clientLabelTextClasses}>Tax ID:</span> {company.taxId}</p>
                    <p className={`text-sm ${clientDetailTextClasses} mb-2`}><span className={clientLabelTextClasses}>Legal Name:</span> {company.legalName}</p>
                    <div className="mt-3 text-sm space-y-1">
                      <p><span className={clientLabelTextClasses}>Email:</span> <span className={clientDetailTextClasses}>{company.email || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Phone:</span> <span className={clientDetailTextClasses}>{company.phone || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Address:</span> <span className={clientDetailTextClasses}>{company.address || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Registration Date:</span> <span className={clientDetailTextClasses}>{formatDate(company.registrationDate)}</span></p>
                      {company.responsible && (
                        <div className={`mt-3 pt-3 border-t border-gray-200`}>
                          <h4 className={`text-xs font-semibold ${clientLabelTextClasses} uppercase mb-1`}>Responsible</h4>
                          <p><span className={clientLabelTextClasses}>{company.responsible.name}</span> <span className={clientDetailTextClasses}>(CPF: {company.responsible.cpf})</span></p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <Link
                            to={`/companies/${company.id}/add-user`}
                            className="inline-block bg-tas-primary text-white font-bold py-2 px-4 rounded hover:bg-tas-primary-dark transition-colors"
                        >
                            Add User
                        </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {paginationInfo && !isLoading && companies.length > 0 && (
              <div className={`mt-8 text-center text-sm ${clientDetailTextClasses}`}>
                Page {paginationInfo.number + 1} of {paginationInfo.totalPages}. Total of {paginationInfo.totalElements} companies.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
