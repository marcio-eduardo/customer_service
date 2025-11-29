import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

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
  company: {
    id: number;
    name: string;
    cnpj: string;
  };
  openedBy: {
    id: number;
    username: string;
    email: string;
  };
  assignedTo?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    console.warn("Erro ao formatar data:", dateString, e);
    return dateString;
  }
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    OPEN: { label: 'Aberto', className: 'bg-blue-600' },
    IN_PROGRESS: { label: 'Em Progresso', className: 'bg-yellow-600' },
    RESOLVED: { label: 'Resolvido', className: 'bg-green-600' },
  };
  
  const config = statusMap[status] || { label: status, className: 'bg-gray-600' };
  return (
    <span className={`${config.className} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
      {config.label}
    </span>
  );
};

const getPriorityBadge = (priority: string) => {
  const priorityMap: Record<string, { label: string; className: string }> = {
    BAIXA: { label: 'Baixa', className: 'bg-gray-500' },
    MEDIA: { label: 'Média', className: 'bg-blue-500' },
    ALTA: { label: 'Alta', className: 'bg-orange-500' },
    URGENTE: { label: 'Urgente', className: 'bg-red-600' },
  };
  
  const config = priorityMap[priority] || { label: priority, className: 'bg-gray-500' };
  return (
    <span className={`${config.className} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
      {config.label}
    </span>
  );
};

const getRatingStars = (rating?: number | null) => {
  if (!rating) return 'Sem avaliação';
  return '⭐'.repeat(rating);
};

export function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isTechOrModerator = user?.roles?.some(r => 
    ['ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_TECH_USER'].includes(r)
  );

  useEffect(() => {
    const fetchTicket = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Ticket>(`/api/tickets/${id}`);
        setTicket(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar ticket:', err);
        if (err.response?.status === 404) {
          setError('Ticket não encontrado.');
        } else if (err.response?.status === 403) {
          setError('Você não tem permissão para visualizar este ticket.');
        } else {
          setError('Erro ao carregar detalhes do ticket.');
        }
        toast.error('Falha ao carregar ticket');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id]);

  const pageWrapperClasses = `min-h-screen pt-16 font-['Poppins'] bg-tas-bg-page text-tas-text-on-card`;
  const contentContainerClasses = "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const sectionCardBgClasses = 'bg-tas-bg-card';
  const headerTitleClass = 'text-tas-primary';
  const labelClass = 'text-tas-text-on-card font-medium';
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
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-tas-secondary hover:text-tas-secondary-hover font-medium flex items-center gap-2"
            >
              ← Voltar
            </button>
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Detalhes do Ticket
            </h1>
          </header>

          <section className={`${sectionCardBgClasses} shadow-xl rounded-xl p-6 md:p-8`}>
            {isLoading && <p className={loadingTextClass}>Carregando...</p>}
            {error && <p className={errorTextClass}>{error}</p>}

            {!isLoading && !error && ticket && (
              <div className="space-y-6">
                {/* Cabeçalho do Ticket */}
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-tas-primary">
                      #{ticket.id}: {ticket.title}
                    </h2>
                    <div className="flex gap-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                </div>

                {/* Informações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-tas-primary mb-3">Informações do Chamado</h3>
                    <div className="space-y-3">
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
                      {ticket.rating && (
                        <div>
                          <p className={`text-sm ${labelClass}`}>Avaliação:</p>
                          <p className={valueClass}>{getRatingStars(ticket.rating)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-tas-primary mb-3">Empresa e Responsáveis</h3>
                    <div className="space-y-3">
                      <div>
                        <p className={`text-sm ${labelClass}`}>Empresa:</p>
                        <p className={valueClass}>{ticket.company.name}</p>
                        <p className="text-sm text-gray-400">{ticket.company.cnpj}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${labelClass}`}>Solicitante:</p>
                        <p className={valueClass}>{ticket.openedBy.username}</p>
                        <p className="text-sm text-gray-400">{ticket.openedBy.email}</p>
                      </div>
                      {ticket.assignedTo && (
                        <div>
                          <p className={`text-sm ${labelClass}`}>Técnico Responsável:</p>
                          <p className={valueClass}>{ticket.assignedTo.username}</p>
                          <p className="text-sm text-gray-400">{ticket.assignedTo.email}</p>
                        </div>
                      )}
                      {!ticket.assignedTo && (
                        <div>
                          <p className={`text-sm ${labelClass}`}>Técnico Responsável:</p>
                          <p className="text-gray-400 italic">Aguardando atribuição</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <h3 className="text-lg font-semibold text-tas-primary mb-3">Descrição do Problema</h3>
                  <div className="bg-tas-bg-page p-4 rounded-lg">
                    <p className={`${valueClass} whitespace-pre-wrap`}>{ticket.description}</p>
                  </div>
                </div>

                {/* Notas de Resolução */}
                {ticket.resolutionNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-green-500 mb-3">Solução</h3>
                    <div className="bg-green-900/20 border border-green-600/30 p-4 rounded-lg">
                      <p className={`${valueClass} whitespace-pre-wrap`}>{ticket.resolutionNotes}</p>
                    </div>
                  </div>
                )}

                {/* Ações */}
                {isTechOrModerator && ticket.status === 'OPEN' && (
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      onClick={() => navigate(`/tickets/${ticket.id}/fechar`)}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Fechar Ticket
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
