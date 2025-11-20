// Localização sugerida: src/pages/ViewClientsPage/ViewClientsPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // Adicionado para título da página
import { api } from '../../lib/axios'; // Ajustado para usar a instância configurada do Axios

// --- Interfaces (mantidas como no seu original) ---
interface ClientePfType {
  id: number;
  nome: string;
  cpf: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  dataCadastro: string; 
}

interface ClientePjType {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  razaoSocial: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  dataCadastro: string; 
  responsavel?: { 
    id?: number; // Adicionado ID do responsável, caso exista
    nome: string;
    cpf: string;
  };
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

interface ViewClientsPageProps {
  // isDarkMode foi removido
  clientType: 'pf' | 'pj'; 
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

export function ViewClientsPage({ clientType }: ViewClientsPageProps) {
  const [clients, setClients] = useState<Array<ClientePfType | ClientePjType>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);

  const pageTitle = clientType === 'pf' ? 'Clientes Pessoa Física (PF)' : 'Clientes Pessoa Jurídica (PJ)';
  const apiUrl = clientType === 'pf' ? '/api/clientes-pf' : '/api/clientes-pj'; // Usando caminhos relativos

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      setClients([]); 
      setPaginationInfo(null);
      try {
        // Usando a instância 'api' do axios
        const response = await api.get<PaginatedResponse<ClientePfType | ClientePjType>>(apiUrl);
        const data = response.data;
        
        if (data && Array.isArray(data.content)) {
          setClients(data.content);
          const { content, ...restOfPaginationData } = data;
          setPaginationInfo(restOfPaginationData);
        } else {
          console.warn("Estrutura de dados da API inesperada. Campo 'content' não encontrado ou não é um array:", data);
          setClients([]); 
        }

      } catch (err: any) {
        console.error(`Falha ao buscar clientes ${clientType.toUpperCase()}:`, err);
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado ou se sua sessão expirou.");
        } else {
          setError(err.message || `Ocorreu um erro desconhecido ao buscar clientes ${clientType.toUpperCase()}.`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [clientType, apiUrl]); 

  // --- Classes de estilo com a paleta "Confiança Moderna (Light) Final" ---
  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = 'text-tas-primary'; 
  const headerSubtitleClass = 'text-tas-text-secondary-on-card'; 

  const sectionCardBgClasses = 'bg-tas-bg-card'; 
  const clientCardBgClasses = 'bg-white'; // Cards de cliente individuais podem ser brancos para maior destaque sobre o bg-tas-bg-card (#F2F2F2)
  
  const clientNameTextClasses = 'text-tas-primary font-semibold'; // Títulos dos clientes com a cor primária
  const clientDetailTextClasses = 'text-tas-text-secondary-on-card';
  const clientLabelTextClasses = 'text-tas-text-secondary-on-card font-medium';
  
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary'; // Texto branco sobre fundo vermelho
  const loadingTextClass = 'text-tas-text-secondary-on-card';

  return (
    <>
      <Helmet>
        <title>{pageTitle} - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>{pageTitle}</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Consulte os dados dos seus clientes.
            </p>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={`${loadingTextClass} italic text-center py-4`}>A carregar clientes...</p>}
            {error && <p className={`${errorTextClass} p-4 rounded-md text-center font-medium`}>{error}</p>}
            
            {!isLoading && !error && clients.length === 0 && (
              <p className={`${clientDetailTextClasses} text-center py-4`}>Nenhum cliente {clientType === 'pf' ? 'pessoa física' : 'pessoa jurídica'} encontrado.</p>
            )}

            {!isLoading && !error && clients.length > 0 && (
              <ul className="space-y-6">
                {clients.map((client) => {
                  if (clientType === 'pf' && 'cpf' in client) {
                    const pfClient = client as ClientePfType;
                    return (
                      <li key={pfClient.id} className={`${clientCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg`}>
                        <h3 className={`text-xl ${clientNameTextClasses} mb-1`}>{pfClient.nome}</h3>
                        <p className={`text-sm ${clientDetailTextClasses} mb-2`}><span className={clientLabelTextClasses}>CPF:</span> {pfClient.cpf}</p>
                        <div className="mt-3 text-sm space-y-1">
                          <p><span className={clientLabelTextClasses}>Email:</span> <span className={clientDetailTextClasses}>{pfClient.email || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Telefone:</span> <span className={clientDetailTextClasses}>{pfClient.telefone || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Endereço:</span> <span className={clientDetailTextClasses}>{pfClient.endereco || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Data Cadastro:</span> <span className={clientDetailTextClasses}>{formatDate(pfClient.dataCadastro)}</span></p>
                        </div>
                      </li>
                    );
                  } else if (clientType === 'pj' && 'cnpj' in client) {
                    const pjClient = client as ClientePjType;
                    return (
                      <li key={pjClient.id} className={`${clientCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-shadow hover:shadow-lg`}>
                        <h3 className={`text-xl ${clientNameTextClasses} mb-1`}>{pjClient.nomeFantasia}</h3>
                        <p className={`text-sm ${clientDetailTextClasses} mb-1`}><span className={clientLabelTextClasses}>CNPJ:</span> {pjClient.cnpj}</p>
                        <p className={`text-sm ${clientDetailTextClasses} mb-2`}><span className={clientLabelTextClasses}>Razão Social:</span> {pjClient.razaoSocial}</p>
                        <div className="mt-3 text-sm space-y-1">
                          <p><span className={clientLabelTextClasses}>Email:</span> <span className={clientDetailTextClasses}>{pjClient.email || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Telefone:</span> <span className={clientDetailTextClasses}>{pjClient.telefone || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Endereço:</span> <span className={clientDetailTextClasses}>{pjClient.endereco || 'N/A'}</span></p>
                          <p><span className={clientLabelTextClasses}>Data Cadastro:</span> <span className={clientDetailTextClasses}>{formatDate(pjClient.dataCadastro)}</span></p>
                          {pjClient.responsavel && (
                            <div className={`mt-3 pt-3 border-t border-gray-200`}>
                              <h4 className={`text-xs font-semibold ${clientLabelTextClasses} uppercase mb-1`}>Responsável</h4>
                              <p><span className={clientLabelTextClasses}>{pjClient.responsavel.nome}</span> <span className={clientDetailTextClasses}>(CPF: {pjClient.responsavel.cpf})</span></p>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  }
                  return null;
                })}
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
