import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/User';
import { Company } from '../../types/Company';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  rating?: number | null;
  company: Company;
  openedBy: User;
  assignedTo?: User | null;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    OPEN: { label: 'Aberto', className: 'bg-tas-status-info' },
    IN_PROGRESS: { label: 'Em Progresso', className: 'bg-tas-status-warning' },
    RESOLVED: { label: 'Resolvido', className: 'bg-tas-status-success' },
  };
  const config = statusMap[status] || { label: status, className: 'bg-gray-500' };
  return <span className={`${config.className} text-tas-text-on-primary px-3 py-1 rounded-full text-xs font-semibold`}>{config.label}</span>;
};

const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, { label: string; className: string }> = {
    BAIXA: { label: 'Baixa', className: 'bg-gray-400' },
    MEDIA: { label: 'Média', className: 'bg-tas-status-info' },
    ALTA: { label: 'Alta', className: 'bg-tas-status-warning' },
    URGENTE: { label: 'Urgente', className: 'bg-tas-status-error' },
  };
  const config = priorityMap[priority] || { label: priority, className: 'bg-gray-500' };
  return <span className={`${config.className} text-tas-text-on-primary px-3 py-1 rounded-full text-xs font-semibold`}>{config.label}</span>;
};

const getRatingStars = (rating?: number | null) => {
  if (rating === null || rating === undefined || rating === 0) return 'Sem avaliação';
  return '⭐'.repeat(rating);
};

export function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isTechOrModerator = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_TECH_USER'].includes(r));

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Ticket>(`/api/tickets/${id}`);
        setTicket(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar ticket:', err);
        const msg = err.response?.data?.message || 'Erro ao carregar detalhes do ticket.';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);
  
  const pageWrapperClasses = `min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const headerTitleClass = 'text-tas-primary';
  const labelClass = 'text-tas-text-secondary-on-card font-medium';
  const valueClass = 'text-tas-text-on-card';
  const errorTextClass = 'bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium';
  const loadingTextClass = 'text-tas-text-secondary-on-card italic text-center py-4';

  return (
    <>
      <Helmet>
        <title>Detalhes do Ticket - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-8">
            <button onClick={() => navigate(-1)} className="mb-4 text-tas-secondary hover:text-tas-secondary-hover font-medium flex items-center gap-2">
              ← Voltar
            </button>
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Detalhes do Ticket</h1>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8 border border-black/10`}>
            {isLoading && <p className={loadingTextClass}>Carregando...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && ticket && (
              <div className="space-y-8">
                <div className="border-b border-tas-accent/20 pb-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-2">
                    <h2 className="text-2xl font-bold text-tas-primary">#{ticket.id}: {ticket.title}</h2>
                    <div className="flex gap-2 flex-shrink-0">{getStatusBadge(ticket.status)}{getPriorityBadge(ticket.priority)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-tas-primary">Informações do Chamado</h3>
                    <div>
                      <p className={`text-sm ${labelClass}`}>Data de Abertura:</p>
                      <p className={valueClass}>{formatDate(ticket.createdAt)}</p>
                    </div>
                    {ticket.resolvedAt && (
                      <div>
                        <p className={`text-sm ${labelClass}`}>Data de Resolução:</p>
                        <p className={valueClass}>{formatDate(ticket.resolvedAt)}</p>
                      </div>
                    )}
                    {ticket.status === 'RESOLVED' && (
                      <div>
                        <p className={`text-sm ${labelClass}`}>Avaliação:</p>
                        <p className={`${valueClass} text-lg`}>{getRatingStars(ticket.rating)}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-tas-primary">Empresa e Responsáveis</h3>
                    <div>
                      <p className={`text-sm ${labelClass}`}>Empresa:</p>
                      <p className={valueClass}>{ticket.company.name}</p>
                      <p className="text-sm text-tas-text-secondary-on-card">{ticket.company.cnpj}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${labelClass}`}>Solicitante:</p>
                      <p className={valueClass}>{ticket.openedBy.username}</p>
                      <p className="text-sm text-tas-text-secondary-on-card">{ticket.openedBy.email}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${labelClass}`}>Técnico Responsável:</p>
                      {ticket.assignedTo ? (
                        <>
                          <p className={valueClass}>{ticket.assignedTo.username}</p>
                          <p className="text-sm text-tas-text-secondary-on-card">{ticket.assignedTo.email}</p>
                        </>
                      ) : (
                        <p className="text-tas-text-secondary-on-card italic">Aguardando atribuição</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-tas-primary mb-3">Descrição do Problema</h3>
                  <div className="bg-tas-bg-page p-4 rounded-lg border border-tas-accent/10">
                    <p className={`${valueClass} whitespace-pre-wrap`}>{ticket.description}</p>
                  </div>
                </div>

                {ticket.resolutionNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-tas-status-success mb-3">Solução</h3>
                    <div className="bg-tas-status-success/10 border border-tas-status-success/20 p-4 rounded-lg">
                      <p className={`${value.class} whitespace-pre-wrap`}>{ticket.resolutionNotes}</p>
                    </div>
                  </div>
                )}

                {isTechOrModerator && ticket.status === 'OPEN' && (
                  <div className="pt-6 border-t border-tas-accent/20 text-right">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}/encerrar`)}
                      className="px-6 py-3 bg-tas-accent text-tas-primary font-semibold rounded-lg hover:bg-tas-accent-hover transition-colors"
                    >
                      Encerrar Ticket
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}