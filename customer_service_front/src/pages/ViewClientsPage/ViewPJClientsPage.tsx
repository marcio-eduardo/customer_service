// Localização sugerida: src/pages/ViewClientsPage/ViewPJClientsPage.tsx
import React, { useState, useEffect } from 'react';

// --- Interfaces (Idealmente, viriam de um ficheiro types/client.ts) ---
interface ClientePjType {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  razaoSocial: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  dataCadastro: string; 
  responsavel?: { // Ajuste esta interface conforme o seu modelo de dados real
    id?: number; // ID do responsável, se houver
    nome: string;
    cpf: string;
    // Outros campos do responsável, se necessário
  };
}

// Interface para a estrutura de paginação da API, baseada no seu exemplo
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

interface ViewPJClientsPageProps {
  isDarkMode: boolean;
}

// Função para formatar a data (Idealmente, viria de um ficheiro utils/formatDate.ts)
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

export function ViewPJClientsPage({ isDarkMode }: ViewPJClientsPageProps) {
  const [clients, setClients] = useState<ClientePjType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationInfo, setPaginationInfo] = useState<Omit<PaginatedResponse<any>, 'content'> | null>(null);

  const apiUrl = 'http://localhost:8080/api/clientes-pj';

  useEffect(() => {
    const fetchPJClients = async () => {
      setIsLoading(true);
      setError(null);
      setClients([]); 
      setPaginationInfo(null);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status} ao buscar clientes PJ`);
        }
        
        const data: PaginatedResponse<ClientePjType> = await response.json();
        
        if (data && Array.isArray(data.content)) {
          setClients(data.content);
          const { content, ...restOfPaginationData } = data;
          setPaginationInfo(restOfPaginationData);
        } else {
          console.warn("Estrutura de dados da API inesperada para clientes PJ. Campo 'content' não encontrado ou não é um array:", data);
          setClients([]); 
        }

      } catch (err: any) {
        console.error(`Falha ao buscar clientes PJ:`, err);
        setError(err.message || `Ocorreu um erro desconhecido ao buscar clientes PJ.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPJClients();
  }, [apiUrl]); // apiUrl é constante, mas mantido para clareza

  // --- Classes de Estilo Condicionais ---
  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-[#EAEAEA] text-gray-800'}`;
  const contentContainerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const pageHeaderTextClasses = isDarkMode ? 'text-slate-100' : 'text-gray-800';
  const pageSubHeaderTextClasses = isDarkMode ? 'text-slate-400' : 'text-gray-600';
  const sectionCardBgClasses = isDarkMode ? 'bg-slate-700' : 'bg-white';
  const clientCardBgClasses = isDarkMode ? 'bg-slate-600' : 'bg-gray-50';
  const clientNameTextClasses = isDarkMode ? 'text-[#60A5FA]' : 'text-[#4A90E2]'; 
  const clientDetailTextClasses = isDarkMode ? 'text-slate-300' : 'text-gray-600';
  const clientLabelTextClasses = isDarkMode ? 'text-slate-400' : 'text-gray-500';
  const errorTextClass = isDarkMode ? 'text-red-400 bg-red-900 bg-opacity-50' : 'text-red-600 bg-red-100';
  const loadingTextClass = isDarkMode ? 'text-slate-400' : 'text-gray-600';

  return (
    <div className={pageWrapperClasses}>
      <div className={contentContainerClasses}>
        <header className="mb-10 text-center">
          <h1 className={`text-3xl lg:text-4xl font-bold ${pageHeaderTextClasses}`}>Clientes Pessoa Jurídica (PJ)</h1>
          <p className={`${pageSubHeaderTextClasses} mt-2 text-base lg:text-lg`}>
            Consulte os dados dos seus clientes pessoa jurídica.
          </p>
        </header>

        <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
          {isLoading && <p className={`${loadingTextClass} italic text-center py-4`}>A carregar clientes PJ...</p>}
          {error && <p className={`${errorTextClass} p-4 rounded-md text-center`}>{error}</p>}
          
          {!isLoading && !error && clients.length === 0 && (
            <p className={`${clientDetailTextClasses} text-center py-4`}>Nenhum cliente pessoa jurídica encontrado.</p>
          )}

          {!isLoading && !error && clients.length > 0 && (
            <ul className="space-y-6">
              {clients.map((cliente) => (
                <li key={cliente.id} className={`${clientCardBgClasses} p-4 sm:p-6 rounded-lg shadow-md border ${isDarkMode ? 'border-slate-500' : 'border-gray-200'} transition-shadow hover:shadow-lg`}>
                  <h3 className={`text-xl font-semibold ${clientNameTextClasses} mb-1`}>{cliente.nomeFantasia}</h3>
                  <p className={`text-sm ${clientDetailTextClasses} mb-1`}><span className={clientLabelTextClasses}>CNPJ:</span> {cliente.cnpj}</p>
                  <p className={`text-sm ${clientDetailTextClasses} mb-2`}><span className={clientLabelTextClasses}>Razão Social:</span> {cliente.razaoSocial}</p>
                  <div className="mt-3 text-sm space-y-1">
                    <p><span className={clientLabelTextClasses}>Email:</span> <span className={clientDetailTextClasses}>{cliente.email || 'N/A'}</span></p>
                    <p><span className={clientLabelTextClasses}>Telefone:</span> <span className={clientDetailTextClasses}>{cliente.telefone || 'N/A'}</span></p>
                    <p><span className={clientLabelTextClasses}>Endereço:</span> <span className={clientDetailTextClasses}>{cliente.endereco || 'N/A'}</span></p>
                    <p><span className={clientLabelTextClasses}>Data Cadastro:</span> <span className={clientDetailTextClasses}>{formatDate(cliente.dataCadastro)}</span></p>
                    {cliente.responsavel && (
                      <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-500' : 'border-gray-200'}`}>
                        <h4 className={`text-xs font-semibold ${clientLabelTextClasses} uppercase mb-1`}>Responsável</h4>
                        <p><span className={clientLabelTextClasses}>{cliente.responsavel.nome}</span> <span className={clientDetailTextClasses}>(CPF: {cliente.responsavel.cpf})</span></p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {paginationInfo && !isLoading && clients.length > 0 && (
            <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Página {paginationInfo.number + 1} de {paginationInfo.totalPages}. Total de {paginationInfo.totalElements} clientes.
              {/* Botões de paginação iriam aqui */}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
