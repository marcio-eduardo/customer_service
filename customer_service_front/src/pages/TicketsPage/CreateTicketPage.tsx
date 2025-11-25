// src/pages/TicketsPage/CreateTicketPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

// Tipos
interface ClientePf { id: number; nome: string; }
interface ClientePj { id: number; nomeFantasia: string; }
type Client = (ClientePf & { type: 'pf' }) | (ClientePj & { type: 'pj' });

interface TicketFormData {
  title: string;
  description: string;
  selectedClient: string;
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    selectedClient: '',
  });
  
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [clientTypeFilter, setClientTypeFilter] = useState<'pf' | 'pj' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);
  const [loggedInClientInfo, setLoggedInClientInfo] = useState<string | null>(null);

  const isManager = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_MODERATOR');

  useEffect(() => {
    if (isManager) {
      const fetchAllClients = async () => {
        setIsFetchingInitialData(true);
        try {
          const pfPromise = api.get<ClientePf[]>('/api/clientes-pf/all');
          const pjPromise = api.get<ClientePj[]>('/api/clientes-pj/all');
          const [pfResponse, pjResponse] = await Promise.all([pfPromise, pjPromise]);
          const pfClients: Client[] = pfResponse.data.map(c => ({ ...c, type: 'pf' }));
          const pjClients: Client[] = pjResponse.data.map(c => ({ ...c, type: 'pj' }));
          setClients([...pfClients, ...pjClients]);
        } catch (error: any) {
          toast.error("Não foi possível carregar a lista de clientes.");
        } finally {
          setIsFetchingInitialData(false);
        }
      };
      fetchAllClients();
    } else {
      const fetchMyClientInfo = async () => {
        setIsFetchingInitialData(true);
        try {
          const response = await api.get('/api/me/client-info'); 
          if (response.data.clientePfId) {
            setLoggedInClientInfo(`pf-${response.data.clientePfId}`);
          } else if (response.data.clientePjId) {
            setLoggedInClientInfo(`pj-${response.data.clientePjId}`);
          } else {
            toast.error("Não foi possível encontrar uma conta de cliente associada a este utilizador.");
          }
        } catch (error) {
           toast.error("Erro ao buscar as suas informações de cliente para abrir um chamado.");
        } finally {
           setIsFetchingInitialData(false);
        }
      };
      fetchMyClientInfo();
    }
  }, [isManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClientTypeFilter(e.target.value as 'pf' | 'pj' | '');
    setFormData(prev => ({ ...prev, selectedClient: '' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const clientIdentifier = isManager ? formData.selectedClient : loggedInClientInfo;

    if (!formData.title || !formData.description || !clientIdentifier) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
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

  const filteredClients = allClients.filter(c => c.type === clientTypeFilter);

  return (
    <>
      <Helmet>
        <title>Abrir Novo Chamado - TAS</title>
      </Helmet>
      <div className="min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-tas-primary">Abrir Novo Chamado</h1>
            <p className="text-tas-text-secondary-on-card mt-2 text-base lg:text-lg">
              {isManager ? "Selecione o tipo de cliente e o cliente para registrar o chamado." : "Descreva o problema para registrar um novo chamado."}
            </p>
          </header>

          <section className="bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isManager ? (
                <>
                  <div>
                    <label htmlFor="clientTypeFilter" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                      Tipo de Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="clientTypeFilter"
                      name="clientTypeFilter"
                      value={clientTypeFilter}
                      onChange={handleClientTypeChange}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm"
                      required
                      disabled={isFetchingInitialData || isLoading}
                    >
                      <option value="" disabled>-- Selecione o tipo --</option>
                      <option value="pf">Pessoa Física</option>
                      <option value="pj">Pessoa Jurídica</option>
                    </select>
                  </div>

                  {clientTypeFilter && (
                    <div>
                      <label htmlFor="selectedClient" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                        Cliente <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="selectedClient"
                        name="selectedClient"
                        value={formData.selectedClient}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm"
                        required
                        disabled={isFetchingInitialData || isLoading || filteredClients.length === 0}
                      >
                        <option value="" disabled>
                          {isFetchingInitialData ? 'A carregar...' : `-- Selecione um cliente ${clientTypeFilter === 'pf' ? 'Físico' : 'Jurídico'} --`}
                        </option>
                        {filteredClients.map(client => (
                          <option key={`${client.type}-${client.id}`} value={`${client.type}-${client.id}`}>
                            {client.type === 'pf' ? (client as ClientePf).nome : (client as ClientePj).nomeFantasia}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              ) : (
                 <div>
                    <label className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">Cliente</label>
                    <p className="px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-tas-text-secondary-on-card">
                        {isFetchingInitialData ? 'A verificar dados do cliente...' : 'Chamado será aberto em seu nome.'}
                    </p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                  Título do Chamado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm"
                  placeholder="Ex: Problema ao acessar o sistema"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm min-h-[120px]"
                  placeholder="Descreva o problema ou solicitação em detalhes..."
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors disabled:bg-gray-400 bg-tas-secondary hover:bg-tas-secondary-hover"
                disabled={isLoading || isFetchingInitialData}
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


