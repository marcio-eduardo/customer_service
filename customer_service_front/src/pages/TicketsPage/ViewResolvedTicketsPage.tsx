// src/pages/TicketsPage/ViewResolvedTicketsPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import type { User } from '../../types/User';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
  openedBy: User;
  assignedTo?: User | null;
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    OPEN: { label: 'Aberto', className: 'bg-tas-status-info text-tas-text-on-primary' },
    IN_PROGRESS: { label: 'Em Progresso', className: 'bg-tas-status-warning text-tas-text-on-primary' },
    RESOLVED: { label: 'Resolvido', className: 'bg-tas-status-success text-tas-text-on-primary' },
  };
  const config = statusMap[status] || { label: status, className: 'bg-gray-500 text-white' };
  return <span className={`text-xs px-3 py-1 rounded-full font-semibold ${config.className}`}>{config.label}</span>;
};

export function ViewResolvedTicketsPage() {
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Ticket[]>('/api/tickets/status/resolved');
        setResolvedTickets(response.data || []);
      } catch (err: any) {
        console.error("Falha ao buscar chamados resolvidos:", err);
        const errorMessage = err.response?.data?.message || "Ocorreu um erro desconhecido ao buscar os chamados resolvidos.";
        setError(errorMessage);
        toast.error(errorMessage);
        setResolvedTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResolvedTickets();
  }, []);

  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card";
  const contentContainerClasses = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const cardBgClasses = "bg-tas-bg-card";
  const cardTitleTextClasses = "text-tas-primary font-semibold";
  const cardDetailTextClasses = "text-tas-text-secondary-on-card";
  const cardLabelTextClasses = "text-tas-text-secondary-on-card font-medium";
  const errorTextClass = "bg-tas-status-error text-tas-text-on-primary p-4 rounded-md text-center font-medium";
  const loadingTextClass = "text-tas-text-secondary-on-card";
  const buttonClasses = "bg-tas-secondary text-tas-text-on-primary hover:bg-tas-secondary-hover";

  return (
    <>
      <Helmet>
        <title>Chamados Resolvidos - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Chamados Resolvidos
            </h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Lista de todos os chamados de suporte que foram concluídos.
            </p>
          </header>

          <section>
            {isLoading && (
              <p className={`${loadingTextClass} italic text-center py-10`}>
                A carregar chamados resolvidos...
              </p>
            )}
            {error && (
              <p className={errorTextClass}>
                {error}
              </p>
            )}
            {!isLoading && !error && resolvedTickets.length === 0 && (
              <p className={`${cardDetailTextClasses} text-center py-10 text-lg`}>
                Nenhum chamado resolvido encontrado.
              </p>
            )}
            {!isLoading && !error && resolvedTickets.length > 0 && (
              <div className="space-y-6">
                {resolvedTickets.map((ticket) => (
                  <div key={ticket.id} className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-black/10 transition-transform hover:scale-[1.02] hover:shadow-xl`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                      <h2 className={`text-xl ${cardTitleTextClasses} mb-1 sm:mb-0`}>
                        #{ticket.id}: {ticket.title}
                      </h2>
                      {getStatusBadge(ticket.status)}
                    </div>

                    {ticket.resolutionNotes && (
                      <div className="mb-4 p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
                        <p className={`${cardLabelTextClasses} text-sm mb-1`}>Notas da Resolução:</p>
                        <p className={`text-sm text-tas-text-on-card leading-relaxed`}>{ticket.resolutionNotes}</p>
                      </div>
                    )}

                    <div className="text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <p className={cardLabelTextClasses}>Criado em:</p>
                        <p className={cardDetailTextClasses}>{formatDate(ticket.createdAt)}</p>
                      </div>
                      <div>
                        <p className={cardLabelTextClasses}>Resolvido em:</p>
                        <p className={cardDetailTextClasses}>{formatDate(ticket.resolvedAt)}</p>
                      </div>
                      <div>
                        <p className={cardLabelTextClasses}>Aberto por:</p>
                        <p className={cardDetailTextClasses}>{ticket.openedBy?.username ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className={cardLabelTextClasses}>Técnico Responsável:</p>
                        <p className={cardDetailTextClasses}>{ticket.assignedTo?.username ?? 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/tickets/${ticket.id}`}
                        className={`text-xs px-3 py-1.5 rounded-md transition-colors ${buttonClasses}`}
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}