// src/pages/TicketsPage/CloseTicketPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Importar useParams
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

// Interface para o chamado (completa para detalhes, incluindo company e openedBy para exibição)
interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  company: {
    id: number;
    name: string;
  };
  openedBy: {
    id: number;
    username: string;
  };
}

export function CloseTicketPage() {
  const navigate = useNavigate();
  const { id: ticketIdFromUrl } = useParams<{ id: string }>(); // Obter ID da URL
  const { user, isAuthenticated } = useAuth();

  const [ticketToClose, setTicketToClose] = useState<Ticket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [currentTicketSearchId, setCurrentTicketSearchId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTicket, setIsFetchingTicket] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const canCloseTickets = isAuthenticated && user?.roles && (
    user.roles.includes('ROLE_ADMIN') ||
    user.roles.includes('ROLE_MODERATOR') ||
    user.roles.includes('ROLE_TECH_USER')
  );

  useEffect(() => {
    if (!canCloseTickets) {
      toast.error("Acesso negado. Você não tem permissão para encerrar chamados.");
      navigate('/dashboard');
      return;
    }

    // Se o ID vier da URL, tentar carregar esse ticket
    if (ticketIdFromUrl) {
      handleSearchById(ticketIdFromUrl);
    }
  }, [canCloseTickets, navigate, ticketIdFromUrl]);

  const handleSearchById = async (searchId: string) => {
    if (!searchId || isNaN(Number(searchId))) {
      toast.error("Por favor, insira um ID de chamado válido.");
      setTicketToClose(null);
      return;
    }

    setIsFetchingTicket(true);
    setFetchError(null);
    try {
      const response = await api.get<Ticket>(`/api/tickets/${searchId}`);
      if (response.data.status !== 'IN_PROGRESS') {
        toast.error(`O chamado #${searchId} está com status ${response.data.status}. Somente chamados EM ATENDIMENTO podem ser encerrados.`);
        setTicketToClose(null);
        return;
      }
      setTicketToClose(response.data);
      setResolutionNotes(''); // Limpa notas ao carregar novo ticket
    } catch (error: any) {
      console.error("Falha ao buscar chamado:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível carregar o chamado.";
      setFetchError(errorMessage);
      toast.error(errorMessage);
      setTicketToClose(null);
    } finally {
      setIsFetchingTicket(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ticketId = ticketToClose?.id;

    if (!ticketId) {
      toast.error('Nenhum chamado válido está selecionado para encerramento.');
      return;
    }
    if (!resolutionNotes.trim()) {
      toast.error('Por favor, adicione as notas de resolução.');
      return;
    }

    setIsLoading(true);

    try {
      // O backend obtém o ID do técnico logado
      await api.post(`/api/tickets/${ticketId}/close`, { resolutionNotes });
      toast.success(`Chamado #${ticketId} encerrado com sucesso!`);
      // Redireciona para a página de tickets resolvidos ou dashboard
      navigate('/tickets/resolvidos');
    } catch (error: any) {
      console.error("Falha ao encerrar chamado:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocorreu um erro ao encerrar o chamado.';
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Definição das classes de estilo que estavam faltando
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const inputBaseClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-accent hover:bg-tas-accent-hover text-tas-primary'}`;
  const searchInputClasses = `w-full px-4 py-2.5 bg-white border border-gray-300 rounded-l-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary`;
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";

  if (!canCloseTickets && !isFetchingTicket) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Encerrar Chamado - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Encerrar Chamado</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              {ticketIdFromUrl ? "Revise os detalhes e adicione as notas de resolução para o chamado." : "Selecione ou busque um chamado aberto para encerrar."}
            </p>
          </header>

          <section className={formCardClasses}>
            {isFetchingTicket && <p className="text-center text-tas-text-secondary-on-card py-4">A carregar chamado...</p>}
            {fetchError && <p className="text-center text-tas-status-error bg-red-100 p-3 rounded-md">{fetchError}</p>}

            {!ticketIdFromUrl && !isFetchingTicket && (
              <div className="mb-6">
                <label htmlFor="ticketSearchId" className={labelClasses}>
                  Buscar Chamado por ID:
                </label>
                <div className="flex">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    id="ticketSearchId"
                    value={currentTicketSearchId}
                    onChange={(e) => setCurrentTicketSearchId(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchById(currentTicketSearchId);
                      }
                    }}
                    className={searchInputClasses}
                    placeholder="Digite o ID do chamado"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => handleSearchById(currentTicketSearchId)}
                    className={`px-6 py-2.5 rounded-r-lg bg-tas-secondary text-tas-text-on-primary font-semibold transition-colors ${isLoading || !currentTicketSearchId.trim() ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-tas-secondary-hover'}`}
                    disabled={isLoading || !currentTicketSearchId.trim()}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            )}

            {(!isFetchingTicket && !fetchError && ticketToClose) && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-3 bg-white/50 border border-gray-200 rounded-md text-sm">
                  <p className="font-medium text-tas-primary">Chamado Selecionado:</p>
                  <p className="mt-1"><span className="font-medium">ID:</span> #{ticketToClose.id}</p>
                  <p><span className="font-medium">Título:</span> {ticketToClose.title}</p>
                  <p className="text-tas-text-secondary-on-card mt-1 whitespace-pre-wrap">
                    <span className="font-medium">Descrição:</span> {ticketToClose.description}
                  </p>
                  <p><span className="font-medium">Empresa:</span> {ticketToClose.company.name}</p>
                  <p><span className="font-medium">Aberto por:</span> {ticketToClose.openedBy.username}</p>
                  <p><span className="font-medium">Status:</span> {ticketToClose.status}</p>
                  <p><span className="font-medium">Prioridade:</span> {ticketToClose.priority}</p>
                </div>

                <div>
                  <label htmlFor="resolutionNotes" className={labelClasses}>
                    Notas de Resolução <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="resolutionNotes"
                    name="resolutionNotes"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className={`${inputBaseClasses} min-h-[120px]`}
                    placeholder="Descreva a solução aplicada, passos tomados, e qualquer informação relevante para o encerramento do chamado..."
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className={buttonClasses}
                  disabled={isLoading || !resolutionNotes.trim()}
                >
                  {isLoading ? 'A Encerrar Chamado...' : 'Encerrar Chamado'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
