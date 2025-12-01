import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { User } from '../../types/User';
import type { Company } from '../../types/Company';

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
  slaDueDate?: string | null;
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
    PAUSED: { label: 'Pausado', className: 'bg-gray-500' },
    ESCALATED: { label: 'Escalado', className: 'bg-purple-600' },
    CANCELED: { label: 'Cancelado', className: 'bg-red-600' },
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

  // Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [techs, setTechs] = useState<User[]>([]);
  const [selectedTech, setSelectedTech] = useState<string>('');

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

  useEffect(() => {
    if (isManageModalOpen) {
      const fetchTechs = async () => {
        try {
          const response = await api.get<User[]>('/api/users/techs');
          setTechs(response.data);
        } catch (err) {
          console.error('Erro ao carregar técnicos', err);
          toast.error('Erro ao carregar lista de técnicos.');
        }
      };
      fetchTechs();
    }
  }, [isManageModalOpen]);


  const handleAssignTicket = async () => {
    try {
      setIsLoading(true);
      await api.patch(`/api/tickets/${id}/assign`);
      toast.success('Você assumiu a responsabilidade deste chamado.');
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      setTicket(response.data);
    } catch (err: any) {
      console.error('Erro ao assumir ticket:', err);
      toast.error(err.response?.data?.message || 'Erro ao assumir chamado.');
    } finally {
      setIsLoading(false);
    }
  };

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [moderators, setModerators] = useState<User[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<string>('');

  useEffect(() => {
    if (isEscalateModalOpen) {
      const fetchModerators = async () => {
        try {
          const response = await api.get<User[]>('/api/users/moderators');
          setModerators(response.data);
        } catch (err) {
          console.error('Erro ao carregar moderadores', err);
          toast.error('Erro ao carregar lista de moderadores.');
        }
      };
      fetchModerators();
    }
  }, [isEscalateModalOpen]);

  const handleEscalateTicket = async () => {
    if (!selectedModerator) {
      toast.error('Selecione um moderador.');
      return;
    }
    try {
      setIsLoading(true);
      await api.patch(`/api/tickets/${id}/escalate`, { moderatorId: Number(selectedModerator) });
      toast.success('Ticket escalado para a gestão.');
      navigate('/tickets');
    } catch (err: any) {
      console.error('Erro ao escalar ticket:', err);
      toast.error(err.response?.data?.message || 'Erro ao escalar chamado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseTicket = async () => {
    try {
      setIsLoading(true);
      await api.patch(`/api/tickets/${id}/pause`);
      toast.success('Ticket pausado.');
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      setTicket(response.data);
      setIsManageModalOpen(false);
    } catch (err: any) {
      console.error('Erro ao pausar ticket:', err);
      toast.error(err.response?.data?.message || 'Erro ao pausar chamado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar este ticket? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      setIsLoading(true);
      await api.patch(`/api/tickets/${id}/cancel`);
      toast.success('Ticket cancelado.');
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      setTicket(response.data);
      setIsManageModalOpen(false);
    } catch (err: any) {
      console.error('Erro ao cancelar ticket:', err);
      toast.error(err.response?.data?.message || 'Erro ao cancelar chamado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReassignTicket = async () => {
    if (!selectedTech) {
      toast.error('Selecione um técnico para reatribuir.');
      return;
    }
    try {
      setIsLoading(true);
      await api.patch(`/api/tickets/${id}/reassign`, selectedTech, { headers: { 'Content-Type': 'application/json' } });
      toast.success('Ticket reatribuído com sucesso.');
      const response = await api.get<Ticket>(`/api/tickets/${id}`);
      setTicket(response.data);
      setIsManageModalOpen(false);
    } catch (err: any) {
      console.error('Erro ao reatribuir ticket:', err);
      toast.error(err.response?.data?.message || 'Erro ao reatribuir chamado.');
    } finally {
      setIsLoading(false);
    }
  };

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
                    {ticket.slaDueDate && ticket.status !== 'RESOLVED' && (
                      <div>
                        <p className={`text-sm ${labelClass}`}>Prazo SLA:</p>
                        <p className={`${valueClass} font-semibold ${new Date(ticket.slaDueDate) < new Date() ? 'text-tas-status-error' : 'text-tas-status-success'}`}>
                          {formatDate(ticket.slaDueDate)}
                        </p>
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
                      <p className={`${valueClass} whitespace-pre-wrap`}>{ticket.resolutionNotes}</p>
                    </div>
                  </div>
                )}

                {isTechOrModerator && ticket.status !== 'RESOLVED' && (
                  <div className="pt-6 border-t border-tas-accent/20 flex justify-end gap-4">
                    {/* Botão Atender: Apenas se não tiver dono e for TÉCNICO */}
                    {!ticket.assignedTo && user?.roles?.includes('ROLE_TECH_USER') && (
                      <button
                        onClick={handleAssignTicket}
                        className="px-6 py-3 bg-tas-primary text-tas-text-on-primary font-semibold rounded-lg hover:bg-tas-primary-hover transition-colors"
                      >
                        Atender Ticket
                      </button>
                    )}

                    {/* Botão Escalar: Apenas Tech, se tiver dono, em progresso e for o dono */}
                    {ticket.assignedTo && user?.roles?.includes('ROLE_TECH_USER') && ticket.status === 'IN_PROGRESS' && ticket.assignedTo.id === user?.id && (
                      <button
                        onClick={() => setIsEscalateModalOpen(true)}
                        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Escalar
                      </button>
                    )}

                    {/* Botão Gerenciar: Apenas Moderador, SEMPRE visível (exceto resolvido) */}
                    {user?.roles?.includes('ROLE_MODERATOR') && (
                      <button
                        onClick={() => setIsManageModalOpen(true)}
                        className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Gerenciar
                      </button>
                    )}

                    {/* Botão Encerrar: Apenas se tiver dono, não estiver escalado e for o dono */}
                    {ticket.assignedTo && ticket.status !== 'ESCALATED' && ticket.assignedTo.id === user?.id && (
                      <button
                        onClick={() => navigate(`/tickets/${ticket.id}/encerrar`)}
                        className="px-6 py-3 bg-tas-accent text-tas-primary font-semibold rounded-lg hover:bg-tas-accent-hover transition-colors"
                      >
                        Encerrar Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Manage Modal */}
        {isManageModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-tas-bg-card rounded-lg shadow-xl max-w-md w-full p-6 border border-tas-accent/20">
              <h3 className="text-xl font-bold text-tas-primary mb-4">Gerenciar Ticket</h3>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-tas-text-secondary-on-card mb-2">Ações Rápidas</p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handlePauseTicket}
                      className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Pausar Ticket
                    </button>
                    <button
                      onClick={handleCancelTicket}
                      className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Cancelar Ticket
                    </button>
                  </div>
                </div>

                <div className="border-t border-tas-accent/10 pt-4">
                  <p className="text-sm text-tas-text-secondary-on-card mb-2">Reatribuir Ticket</p>
                  <select
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                    className="w-full bg-tas-bg-page border border-tas-accent/20 rounded px-3 py-2 mb-3 text-tas-text-on-card"
                  >
                    <option value="">Selecione um técnico...</option>
                    {techs.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.username}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleReassignTicket}
                    className="w-full py-2 bg-tas-primary text-tas-text-on-primary rounded hover:bg-tas-primary-hover transition-colors"
                  >
                    Confirmar Reatribuição
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-4 py-2 bg-tas-bg-page text-tas-text-secondary rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Escalate Modal */}
        {isEscalateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-tas-bg-card rounded-lg shadow-xl max-w-md w-full p-6 border border-tas-accent/20">
              <h3 className="text-xl font-bold text-tas-primary mb-4">Escalar Ticket</h3>
              <p className="text-tas-text-on-card mb-4">Selecione um moderador para escalar este chamado:</p>

              <select
                value={selectedModerator}
                onChange={(e) => setSelectedModerator(e.target.value)}
                className="w-full bg-tas-bg-page border border-tas-accent/20 rounded px-3 py-2 mb-4 text-tas-text-on-card"
              >
                <option value="">Selecione um moderador...</option>
                {moderators.map(mod => (
                  <option key={mod.id} value={mod.id}>{mod.username}</option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEscalateModalOpen(false)}
                  className="px-4 py-2 bg-tas-bg-page text-tas-text-secondary rounded-lg hover:bg-tas-text-secondary hover:text-tas-text-on-card transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEscalateTicket}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Confirmar Escalada
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}