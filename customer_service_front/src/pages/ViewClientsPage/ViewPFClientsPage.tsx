// Localização: src/pages/ViewClientsPage/ViewPFClientsPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../../lib/axios'; // Importe a instância configurada do Axios

// --- Interfaces (mantidas como no seu original de ViewPFClientsPage.tsx) ---
interface ClientePfType {
  id: number;
  nome: string;
  cpf: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  dataCadastro: string;
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

// Removida a prop isDarkMode
// interface ViewPFClientsPageProps {
//   isDarkMode: boolean;
// }

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

export function ViewPFClientsPage(/* { isDarkMode }: ViewPFClientsPageProps */) {
  const [clients, setClients] = useState<ClientePfType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);

  const apiUrl = '/api/clientes-pf'; // Endpoint relativo, baseURL está no axios

  useEffect(() => {
    const fetchPFClients = async () => {
      setIsLoading(true);
      setError(null);
      setClients([]);
      setPaginationInfo(null);
      try {
        const response = await api.get<PaginatedResponse<ClientePfType>>(apiUrl);
        const data = response.data;

        if (data && Array.isArray(data.content)) {
          setClients(data.content);
          const { content, ...restOfPaginationData } = data;
          setPaginationInfo(restOfPaginationData);
        } else {
          console.warn("Estrutura de dados da API inesperada para clientes PF. Campo 'content' não encontrado ou não é um array:", data);
          setClients([]);
        }

      } catch (err: any) {
        console.error(`Falha ao buscar clientes PF:`, err);
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado ou se sua sessão expirou.");
        } else {
          setError(err.message || `Ocorreu um erro desconhecido ao buscar clientes PF.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPFClients();
  }, []); // apiUrl é constante

  // --- Classes de estilo com a paleta "Confiança Moderna (Light) Final" ---
  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card'; 

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  const clientCardBgClasses = 'bg-white'; // Cards de cliente individuais brancos para destaque
  
  const clientNameTextClasses = 'text-tas-primary font-semibold';
  const clientDetailTextClasses = 'text-tas-text-secondary-on-card';
  const clientLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';


  return (
    <>
      <Helmet>
        <title>Clientes Pessoa Física - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Clientes Pessoa Física (PF)</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Consulte os dados dos seus clientes pessoa física.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={loadingTextClass}>A carregar clientes PF...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && clients.length === 0 && (
              <p className={`${clientDetailTextClasses} text-center py-4`}>Nenhum cliente pessoa física encontrado.</p>
            )}

            {!isLoading && !error && clients.length > 0 && (
              <ul className="space-y-6">
                {clients.map((cliente) => (
                  <li key={cliente.id} className={`${clientCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg`}>
                    <h3 className={`text-xl ${clientNameTextClasses} mb-1`}>{cliente.nome}</h3>
                    <p className={`text-sm ${clientDetailTextClasses} mb-2`}><span className={clientLabelTextClasses}>CPF:</span> {cliente.cpf}</p>
                    <div className="mt-3 text-sm space-y-1">
                      <p><span className={clientLabelTextClasses}>Email:</span> <span className={clientDetailTextClasses}>{cliente.email || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Telefone:</span> <span className={clientDetailTextClasses}>{cliente.telefone || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Endereço:</span> <span className={clientDetailTextClasses}>{cliente.endereco || 'N/A'}</span></p>
                      <p><span className={clientLabelTextClasses}>Data Cadastro:</span> <span className={clientDetailTextClasses}>{formatDate(cliente.dataCadastro)}</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {paginationInfo && !isLoading && clients.length > 0 && (
              <div className={`mt-8 text-center text-sm ${clientDetailTextClasses}`}>
                Página {paginationInfo.number + 1} de {paginationInfo.totalPages}. Total de {paginationInfo.totalElements} clientes.
                {/* TODO: Adicionar botões de paginação aqui, se necessário */}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
