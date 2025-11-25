// Localização: src/pages/TicketsPage/ViewOpenTicketsPage.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom'; 
import { toast } from 'sonner';
import { api } from '../../lib/axios'; 

// Interface para o modelo de Ticket
interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string; 
  createdAt: string; 
  technical?: { 
    id: number;
    name: string;
  } | null;
  closedByTechnical?: { 
    id: number;
    name: string;
  } | null;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
}

// Função para formatar a data
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
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado.");
          toast.error("Sessão expirada ou não autorizado. Faça login novamente.");
        } else if (err.response && err.response.status === 403) {
          setError("Erro 403: Você não tem permissão para ver esta lista.");
          toast.error("Você não tem permissão para acessar este recurso.");
        } else {
          setError(err.message || "Ocorreu um erro desconhecido ao buscar os chamados.");
          toast.error("Não foi possível carregar os chamados abertos.");
        }
        setOpenTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpenTickets();
  }, []);

  // Classes de estilo com a paleta "Confiança Moderna (Light) Final"
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = "text-tas-primary"; // Azul da navbar para o título principal
  const headerSubtitleClass = "text-tas-text-secondary-on-card"; // Texto secundário para o subtítulo

  const cardBgClasses = "bg-tas-bg-card"; // Fundo do card
  const cardTitleTextClasses = "text-tas-primary font-semibold"; // Título do card com a cor primária
  const cardDetailTextClasses = "text-tas-text-secondary-on-card"; // Detalhes do card
  const cardLabelTextClasses = "text-tas-text-secondary-on-card font-medium"; // Rótulos dentro do card
  
  const errorTextClass = "bg-tas-status-error text-tas-text-on-primary"; // Fundo vermelho com texto branco
  const loadingTextClass = "text-tas-text-secondary-on-card";

  const statusTagClasses = "bg-tas-status-info text-tas-text-on-primary"; // Tag de status "OPEN"
  const buttonClasses = "bg-tas-secondary text-tas-text-on-primary hover:bg-tas-secondary-hover"; // Botão verde

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
              <p className={`${errorTextClass} p-4 rounded-md text-center font-medium`}>
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
                  <div key={ticket.id} className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                      <h2 className={`text-xl ${cardTitleTextClasses} mb-1 sm:mb-0`}>
                        #{ticket.id}: {ticket.title}
                      </h2>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusTagClasses}`}>
                        {ticket.status} 
                      </span>
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
                        <span className={cardLabelTextClasses}>Técnico Atribuído:</span>{' '}
                        <span className={cardDetailTextClasses}>{ticket.technical ? ticket.technical.name : 'Nenhum (Aguardando atribuição)'}</span>
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
