// Localização: src/pages/TicketsPage/ViewOpenTicketsPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; 
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { User } from '../../types/User';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string; 
  priority: string;
  createdAt: string;
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

export function ViewOpenTicketsPage() {
  const [openTickets, setOpenTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<Ticket[]>('/api/tickets/status/open'); 
        setOpenTickets(response.data || []);
      } catch (err: any) {
        console.error("Falha ao buscar chamados abertos:", err);
        const errorMessage = err.response?.data?.message || "Ocorreu um erro desconhecido ao buscar os chamados.";
        setError(errorMessage);
        toast.error(errorMessage);
        setOpenTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenTickets();
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
        <title>Chamados Abertos - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>
              Chamados Abertos
            </h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              Lista de todos os chamados de suporte que aguardam atendimento.
            </p>
          </header>

          <section>
            {isLoading && (
              <p className={`${loadingTextClass} italic text-center py-10`}>
                A carregar chamados abertos...
              </p>
            )}
            {error && (
              <p className={errorTextClass}>
                {error}
              </p>
            )}
            {!isLoading && !error && openTickets.length === 0 && (
              <p className={`${cardDetailTextClasses} text-center py-10 text-lg`}>
                Nenhum chamado aberto encontrado no momento.
              </p>
            )}
            {!isLoading && !error && openTickets.length > 0 && (
              <div className="space-y-6">
                {openTickets.map((ticket) => (
                  <div key={ticket.id} className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-black/10 transition-transform hover:scale-[1.02] hover:shadow-xl`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                      <h2 className={`text-xl ${cardTitleTextClasses} mb-1 sm:mb-0`}>
                        #{ticket.id}: {ticket.title}
                      </h2>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className={`${cardDetailTextClasses} text-sm mb-3 leading-relaxed line-clamp-3`}>
                      {ticket.description}
                    </p>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className={cardLabelTextClasses}>Criado em:</span>{' '}
                        <span className={cardDetailTextClasses}>{formatDate(ticket.createdAt)}</span>
                      </p>
                      <p>
                        <span className={cardLabelTextClasses}>Aberto por:</span>{' '}
                        <span className={cardDetailTextClasses}>{ticket.openedBy?.username ?? 'N/A'}</span>
                      </p>
                      <p>
                        <span className={cardLabelTextClasses}>Técnico Atribuído:</span>{' '}
                        <span className={cardDetailTextClasses}>{ticket.assignedTo ? ticket.assignedTo.username : 'Aguardando atribuição'}</span>
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
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