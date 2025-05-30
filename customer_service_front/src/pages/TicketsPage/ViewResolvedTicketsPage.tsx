// src/pages/TicketsPage/ViewResolvedTicketsPage.tsx
import React, { useState, useEffect } from 'react';
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
  resolvedAt?: string | null; // Importante para chamados resolvidos
  resolutionNotes?: string | null; // Importante para chamados resolvidos
  technical?: { 
    id: number;
    name: string;
  } | null;
  closedByTechnical?: { // Técnico que fechou o chamado
    id: number;
    name: string;
  } | null;
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
        if (err.response && err.response.status === 401) {
          setError("Erro 401: Não autorizado. Verifique se está logado.");
          toast.error("Sessão expirada ou não autorizado. Faça login novamente.");
        } else if (err.response && err.response.status === 403) {
          setError("Erro 403: Você não tem permissão para ver esta lista.");
          toast.error("Você não tem permissão para acessar este recurso.");
        } else {
          setError(err.message || "Ocorreu um erro desconhecido ao buscar os chamados resolvidos.");
          toast.error("Não foi possível carregar os chamados resolvidos.");
        }
        setResolvedTickets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResolvedTickets();
  }, []);

  // Classes de estilo com a paleta "Confiança Moderna (Light) Final"
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = "text-tas-primary"; 
  const headerSubtitleClass = "text-tas-text-secondary-on-card"; 

  const cardBgClasses = "bg-tas-bg-card"; 
  const cardTitleTextClasses = "text-tas-primary font-semibold"; 
  const cardDetailTextClasses = "text-tas-text-secondary-on-card"; 
  const cardLabelTextClasses = "text-tas-text-secondary-on-card font-medium"; 
  
  const errorTextClass = "bg-tas-status-error text-tas-text-on-primary"; 
  const loadingTextClass = "text-tas-text-secondary-on-card";

  const statusTagClasses = "bg-tas-status-success text-tas-text-on-primary"; // Tag de status "RESOLVED"
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
              <p className={`${errorTextClass} p-4 rounded-md text-center font-medium`}>
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
                  <div key={ticket.id} className={`${cardBgClasses} p-6 rounded-xl shadow-lg border border-gray-200`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                      <h2 className={`text-xl ${cardTitleTextClasses} mb-1 sm:mb-0`}>
                        #{ticket.id}: {ticket.title}
                      </h2>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusTagClasses}`}>
                        {ticket.status} 
                      </span>
                    </div>
                    <p className={`${cardDetailTextClasses} text-sm mb-1 leading-relaxed`}>
                      <span className={cardLabelTextClasses}>Descrição:</span> {ticket.description}
                    </p>
                    {ticket.resolutionNotes && (
                       <p className={`${cardDetailTextClasses} text-sm mb-3 leading-relaxed bg-white/50 p-2 rounded-md border border-gray-100`}>
                        <span className={cardLabelTextClasses}>Notas da Resolução:</span> {ticket.resolutionNotes}
                      </p>
                    )}
                    <div className="text-xs space-y-1">
                      <p>
                        <span className={cardLabelTextClasses}>Criado em:</span>{' '}
                        <span className={cardDetailTextClasses}>{formatDate(ticket.createdAt)}</span>
                      </p>
                       {ticket.resolvedAt && (
                        <p>
                            <span className={cardLabelTextClasses}>Resolvido em:</span>{' '}
                            <span className={cardDetailTextClasses}>{formatDate(ticket.resolvedAt)}</span>
                        </p>
                       )}
                      {ticket.closedByTechnical && (
                        <p>
                            <span className={cardLabelTextClasses}>Fechado por:</span>{' '}
                            <span className={cardDetailTextClasses}>{ticket.closedByTechnical.name}</span>
                        </p>
                      )}
                       {ticket.technical && !ticket.closedByTechnical && ( // Mostra técnico original se não houver quem fechou
                        <p>
                            <span className={cardLabelTextClasses}>Técnico Original:</span>{' '}
                            <span className={cardDetailTextClasses}>{ticket.technical.name}</span>
                        </p>
                       )}
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <Link 
                        to={`/tickets/${ticket.id}`} // Link para detalhes do chamado (se existir essa rota)
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
