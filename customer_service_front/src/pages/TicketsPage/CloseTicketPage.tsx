// src/pages/TicketsPage/CloseTicketPage.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

// Interface para o chamado (simplificada para o que precisamos)
interface Ticket {
  id: number;
  title: string;
  status: string; // Para filtrar por "OPEN"
  description: string; // Para mostrar um resumo
}

// Interface para os dados do formulário
interface CloseTicketFormData {
  selectedTicketId: string;
  resolutionNotes: string;
}

export function CloseTicketPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Obter dados do utilizador autenticado

  const [formData, setFormData] = useState<CloseTicketFormData>({
    selectedTicketId: '',
    resolutionNotes: '',
  });
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTickets, setIsFetchingTickets] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Verifica se o utilizador tem permissão para aceder a esta página
  const canCloseTickets = isAuthenticated && user?.roles && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MODERATOR'));

  useEffect(() => {
    if (!canCloseTickets) {
      toast.error("Acesso negado. Você não tem permissão para encerrar chamados.");
      navigate('/dashboard'); // Redireciona se não tiver permissão
      return;
    }

    const fetchOpenTickets = async () => {
      setIsFetchingTickets(true);
      setFetchError(null);
      try {
        // O endpoint /api/tickets deve retornar todos, filtramos pelo status 'OPEN' no cliente
        // Ou, se existir um endpoint específico como /api/tickets/status/open, usá-lo.
        // Para este exemplo, vamos buscar todos e filtrar.
        const response = await api.get<Ticket[]>('/api/tickets');
        if (response.data && Array.isArray(response.data)) {
          const filteredOpenTickets = response.data.filter(ticket => ticket.status === 'OPEN');
          setOpenTickets(filteredOpenTickets);
          if (filteredOpenTickets.length === 0) {
            toast.info("Não há chamados abertos para encerrar.");
          }
        } else {
          setOpenTickets([]);
          toast.info("Nenhum chamado encontrado.");
        }
      } catch (error: any) {
        console.error("Falha ao buscar chamados:", error);
        const errorMessage = error.response?.data?.message || "Não foi possível carregar a lista de chamados.";
        setFetchError(errorMessage);
        toast.error(errorMessage);
        setOpenTickets([]);
      } finally {
        setIsFetchingTickets(false);
      }
    };

    fetchOpenTickets();
  }, [canCloseTickets, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.selectedTicketId) {
      toast.error('Por favor, selecione um chamado para encerrar.');
      return;
    }
    if (!formData.resolutionNotes.trim()) {
      toast.error('Por favor, adicione as notas de resolução.');
      return;
    }
    if (!user?.id) {
      toast.error('Não foi possível identificar o técnico. Faça login novamente.');
      return;
    }

    setIsLoading(true);

    const payload = {
      ticketId: parseInt(formData.selectedTicketId, 10),
      closedByTechnicalId: user.id, // ID do utilizador autenticado
      resolutionNotes: formData.resolutionNotes,
    };

    try {
      await api.post('/api/tickets/close', payload);
      toast.success(`Chamado #${formData.selectedTicketId} encerrado com sucesso!`);
      setFormData({ selectedTicketId: '', resolutionNotes: '' }); // Limpa o formulário
      // Atualiza a lista de chamados abertos
      setOpenTickets(prevTickets => prevTickets.filter(ticket => ticket.id.toString() !== formData.selectedTicketId));
      // Poderia navegar para outra página ou mostrar uma mensagem de sucesso mais proeminente
    } catch (error: any) {
      console.error("Falha ao encerrar chamado:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocorreu um erro ao encerrar o chamado.';
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Classes de estilo com a paleta "Confiança Moderna (Light) Final"
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";

  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8";
  
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  
  const inputBaseClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-accent hover:bg-tas-accent-hover text-tas-primary'}`; // Botão de acento (âmbar)

  if (!canCloseTickets && !isFetchingTickets) { // Verifica se já terminou de verificar permissões
    return null; // Ou um componente de "Acesso Negado"
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
              Selecione um chamado aberto e adicione as notas de resolução.
            </p>
          </header>

          <section className={formCardClasses}>
            {isFetchingTickets && <p className="text-center text-tas-text-secondary-on-card py-4">A carregar chamados abertos...</p>}
            {fetchError && <p className="text-center text-tas-status-error bg-red-100 p-3 rounded-md">{fetchError}</p>}
            
            {!isFetchingTickets && !fetchError && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="selectedTicketId" className={labelClasses}>
                    Selecionar Chamado Aberto <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectedTicketId"
                    name="selectedTicketId"
                    value={formData.selectedTicketId}
                    onChange={handleChange}
                    className={`${inputBaseClasses} ${openTickets.length === 0 ? 'text-gray-500' : ''}`}
                    required
                    disabled={isLoading || openTickets.length === 0}
                  >
                    <option value="" disabled>
                      {openTickets.length === 0 ? "Nenhum chamado aberto" : "-- Selecione um chamado --"}
                    </option>
                    {openTickets.map(ticket => (
                      <option key={ticket.id} value={ticket.id}>
                        #{ticket.id} - {ticket.title}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.selectedTicketId && openTickets.find(t => t.id.toString() === formData.selectedTicketId) && (
                  <div className="p-3 bg-white/50 border border-gray-200 rounded-md text-sm">
                    <p className="font-medium text-tas-primary">Detalhes do Chamado Selecionado:</p>
                    <p className="text-tas-text-secondary-on-card mt-1 whitespace-pre-wrap">
                      {openTickets.find(t => t.id.toString() === formData.selectedTicketId)?.description}
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="resolutionNotes" className={labelClasses}>
                    Notas de Resolução <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="resolutionNotes"
                    name="resolutionNotes"
                    value={formData.resolutionNotes}
                    onChange={handleChange}
                    className={`${inputBaseClasses} min-h-[120px]`}
                    placeholder="Descreva a solução aplicada, passos tomados, e qualquer informação relevante para o encerramento do chamado..."
                    required
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className={buttonClasses}
                  disabled={isLoading || openTickets.length === 0 || !formData.selectedTicketId}
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
