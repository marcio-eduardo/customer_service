import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../../lib/axios';

interface CompanyUserType {
  id: number;
  name: string;
  cpf: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationDate: string;
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

export function ViewCompanyUsersPage() {
  const [users, setUsers] = useState<CompanyUserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);

  const apiUrl = '/api/company-users';

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      setIsLoading(true);
      setError(null);
      setUsers([]);
      setPaginationInfo(null);
      try {
        const response = await api.get<PaginatedResponse<CompanyUserType>>(apiUrl);
        const data = response.data;

        if (data && Array.isArray(data.content)) {
          setUsers(data.content);
          const { content, ...restOfPaginationData } = data;
          setPaginationInfo(restOfPaginationData);
        } else {
          console.warn("Unexpected API data structure for company users. 'content' field not found or not an array:", data);
          setUsers([]);
        }
      } catch (err: any) {
        console.error(`Failed to fetch company users:`, err);
        if (err.response && err.response.status === 401) {
          setError("Error 401: Unauthorized. Please check if you are logged in or if your session has expired.");
        } else {
          setError(err.message || `An unknown error occurred while fetching company users.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyUsers();
  }, [apiUrl]);

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card'; 

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  const userCardBgClasses = 'bg-white';
  
  const userNameTextClasses = 'text-tas-primary font-semibold';
  const userDetailTextClasses = 'text-tas-text-secondary-on-card';
  const userLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';


  return (
    <>
      <Helmet>
        <title>Company Users - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Company Users</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Consult your registered company users data.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={loadingTextClass}>Loading company users...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && users.length === 0 && (
              <p className={`${userDetailTextClasses} text-center py-4`}>No company users found.</p>
            )}

            {!isLoading && !error && users.length > 0 && (
              <ul className="space-y-6">
                {users.map((user) => (
                  <li key={user.id} className={`${userCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg`}>
                    <h3 className={`text-xl ${userNameTextClasses} mb-1`}>{user.name}</h3>
                    <p className={`text-sm ${userDetailTextClasses} mb-2`}><span className={userLabelTextClasses}>CPF:</span> {user.cpf}</p>
                    <div className="mt-3 text-sm space-y-1">
                      <p><span className={userLabelTextClasses}>Email:</span> <span className={userDetailTextClasses}>{user.email || 'N/A'}</span></p>
                      <p><span className={userLabelTextClasses}>Phone:</span> <span className={userDetailTextClasses}>{user.phone || 'N/A'}</span></p>
                      <p><span className={userLabelTextClasses}>Address:</span> <span className={userDetailTextClasses}>{user.address || 'N/A'}</span></p>
                      <p><span className={userLabelTextClasses}>Registration Date:</span> <span className={userDetailTextClasses}>{formatDate(user.registrationDate)}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {paginationInfo && !isLoading && users.length > 0 && (
              <div className={`mt-8 text-center text-sm ${userDetailTextClasses}`}>
                Page {paginationInfo.number + 1} of {paginationInfo.totalPages}. Total of {paginationInfo.totalElements} users.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
