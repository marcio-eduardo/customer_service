// src/pages/TicketsPage/CreateTicketPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext'; // Importar o useAuth

// Interfaces para os tipos de cliente que esperamos da API
interface ClientePf {
  id: number;
  nome: string;
}

interface ClientePj {
  id: number;
  nomeFantasia: string;
}

// Interface combinada para a lista de clientes no estado
type Client = (ClientePf & { type: 'pf' }) | (ClientePj & { type: 'pj' });

// Interface para os dados do formulário
interface TicketFormData {
  title: string;
  description: string;
  selectedClient: string; 
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Obter o utilizador autenticado do contexto

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    selectedClient: '',
  });
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingClients, setIsFetchingClients] = useState(false);
  const [loggedInClientInfo, setLoggedInClientInfo] = useState<string | null>(null);

  // Determinar se o utilizador é um gestor (Admin/Moderator)
  const isManager = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    // Se for um gestor, busca a lista de todos os clientes para o dropdown
    if (isManager) {
      const fetchAllClients = async () => {
        setIsFetchingClients(true);
        try {
          const pfPromise = api.get<{ content: ClientePf[] }>('/api/clientes-pf');
          const pjPromise = api.get<{ content: ClientePj[] }>('/api/clientes-pj');
          const [pfResponse, pjResponse] = await Promise.all([pfPromise, pjPromise]);
          const pfClients: Client[] = pfResponse.data.content.map(c => ({ ...c, type: 'pf' }));
          const pjClients: Client[] = pjResponse.data.content.map(c => ({ ...c, type: 'pj' }));
          setClients([...pfClients, ...pjClients]);
        } catch (error: any) {
          console.error("Falha ao buscar clientes:", error);
          toast.error("Não foi possível carregar a lista de clientes.");
        } finally {
          setIsFetchingClients(false);
        }
      };
      fetchAllClients();
    } else {
      // Se for um cliente normal, busca as suas próprias informações de cliente
      // ASSUMINDO QUE EXISTE UM ENDPOINT /api/me/client-info
      const fetchMyClientInfo = async () => {
        setIsFetchingClients(true);
        try {
          // Exemplo: O endpoint retorna { "clientePfId": 123 } ou { "clientePjId": 456 }
          const response = await api.get('/api/me/client-info'); 
          if (response.data.clientePfId) {
            setLoggedInClientInfo(`pf-${response.data.clientePfId}`);
          } else if (response.data.clientePjId) {
            setLoggedInClientInfo(`pj-${response.data.clientePjId}`);
          } else {
            toast.error("Não foi possível encontrar uma conta de cliente associada a este utilizador.");
          }
        } catch (error) {
           console.error("Falha ao buscar informações do cliente:", error);
           toast.error("Erro ao buscar as suas informações de cliente.");
        } finally {
           setIsFetchingClients(false);
        }
      };
      // fetchMyClientInfo(); // Descomentar quando o endpoint existir
      // Para fins de teste, pode simular a informação:
      // setLoggedInClientInfo('pf-1'); // Simulação para um cliente PF com ID 1
      setIsFetchingClients(false); // Remover esta linha quando a chamada real for usada
    }
  }, [isManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const clientIdentifier = isManager ? formData.selectedClient : loggedInClientInfo;

    if (!formData.title || !formData.description || !clientIdentifier) {
      toast.error('Por favor, preencha todos os campos. A associação com um cliente é obrigatória.');
      return;
    }

    setIsLoading(true);

    const [clientType, clientId] = clientIdentifier.split('-');

    const payload = {
      title: formData.title,
      description: formData.description,
      clientePfId: clientType === 'pf' ? parseInt(clientId, 10) : undefined,
      clientePjId: clientType === 'pj' ? parseInt(clientId, 10) : undefined,
    };
    
    try {
      await api.post('/api/tickets/open', payload);
      toast.success('Chamado aberto com sucesso!');
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error("Falha ao abrir chamado:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao abrir o chamado.';
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
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
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isLoading || isFetchingClients ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;


  return (
    <>
      <Helmet>
        <title>Abrir Novo Chamado - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Abrir Novo Chamado</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              {isManager ? "Selecione o cliente e descreva o problema." : "Descreva o problema para registrar um novo chamado."}
            </p>
          </header>

          <section className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* O seletor de cliente só é exibido se o utilizador for um gestor */}
              {isManager && (
                <div>
                  <label htmlFor="selectedClient" className={labelClasses}>
                    Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectedClient"
                    name="selectedClient"
                    value={formData.selectedClient}
                    onChange={handleChange}
                    className={inputBaseClasses}
                    required
                    disabled={isFetchingClients || isLoading}
                  >
                    <option value="" disabled>
                      {isFetchingClients ? 'A carregar clientes...' : '-- Selecione um cliente --'}
                    </option>
                    <optgroup label="Pessoa Física">
                      {clients.filter(c => c.type === 'pf').map(client => (
                        <option key={`pf-${client.id}`} value={`pf-${client.id}`}>
                          {(client as ClientePf).nome}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pessoa Jurídica">
                       {clients.filter(c => c.type === 'pj').map(client => (
                        <option key={`pj-${client.id}`} value={`pj-${client.id}`}>
                          {(client as ClientePj).nomeFantasia}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Se o utilizador for um cliente e sua informação já foi carregada, poderia exibir o nome dele aqui */}
              {!isManager && loggedInClientInfo && (
                <div>
                    <label className={labelClasses}>Cliente</label>
                    <p className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-tas-text-secondary-on-card">
                        {/* Lógica para exibir o nome do cliente logado - precisa buscar o nome */}
                        Chamado será aberto em seu nome.
                    </p>
                </div>
              )}

              <div>
                <label htmlFor="title" className={labelClasses}>
                  Título do Chamado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputBaseClasses}
                  placeholder="Ex: Problema ao acessar o sistema"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputBaseClasses} min-h-[120px]`}
                  placeholder="Descreva o problema ou solicitação em detalhes..."
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={buttonClasses}
                disabled={isLoading || isFetchingClients}
              >
                {isLoading ? 'A Abrir Chamado...' : 'Abrir Chamado'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

