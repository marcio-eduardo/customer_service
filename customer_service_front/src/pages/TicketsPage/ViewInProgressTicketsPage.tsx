import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

interface Ticket {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    company: {
        name: string;
    };
    openedBy: {
        username: string;
    };
    assignedTo?: {
        username: string;
    };
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getPriorityConfig = (priority: string) => {
    const priorityMap: Record<string, { label: string; className: string }> = {
        BAIXA: { label: 'Baixa', className: 'bg-gray-400 text-white' },
        MEDIA: { label: 'Média', className: 'bg-tas-status-info text-tas-text-on-primary' },
        ALTA: { label: 'Alta', className: 'bg-tas-status-warning text-tas-text-on-primary' },
        URGENTE: { label: 'Urgente', className: 'bg-tas-status-error text-tas-text-on-primary' },
    };
    return priorityMap[priority] || { label: priority, className: 'bg-gray-500 text-white' };
};

export function ViewInProgressTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<Ticket[]>('/api/tickets/status/in-progress');
                setTickets(response.data || []);
            } catch (err) {
                console.error('Erro ao buscar tickets em atendimento:', err);
                setError('Não foi possível carregar os chamados em atendimento.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const pageWrapperClasses = `min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card`;
    const contentContainerClasses = "w-full mx-auto px-4 sm:px-6 lg:px-8 py-8";
    const headerTitleClass = 'text-tas-primary';
    const tableHeaderClass = "px-6 py-3 text-left text-xs font-medium text-tas-text-secondary-on-card uppercase tracking-wider";
    const tableRowClass = "bg-tas-bg-card hover:bg-tas-bg-page transition-colors cursor-pointer border-b border-tas-accent/10";
    const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm text-tas-text-on-card";

    const userRoles = user?.roles || [];
    if (!userRoles.some(r => ['ROLE_MODERATOR', 'ROLE_TECH_USER'].includes(r))) {
        return (
            <div className={pageWrapperClasses}>
                <div className={contentContainerClasses}>
                    <p className="text-center text-tas-status-error text-xl">Acesso Negado.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Chamados em Atendimento - TAS</title>
            </Helmet>
            <div className={pageWrapperClasses}>
                <div className={contentContainerClasses}>
                    <header className="mb-8 text-center">
                        <h1 className={`text-3xl font-bold ${headerTitleClass}`}>Chamados em Atendimento</h1>
                        <p className="mt-2 text-tas-text-secondary-on-card">Acompanhe os chamados que estão sendo tratados.</p>
                    </header>

                    {isLoading ? (
                        <p className="text-center text-tas-text-secondary-on-card py-8">Carregando chamados...</p>
                    ) : error ? (
                        <div className="bg-tas-status-error/10 border border-tas-status-error text-tas-status-error px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Erro!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-12 bg-tas-bg-card rounded-lg shadow border border-tas-accent/10">
                            <p className="text-tas-text-secondary-on-card text-lg">Nenhum chamado em atendimento no momento.</p>
                        </div>
                    ) : (
                        <div className="bg-tas-bg-card shadow overflow-hidden sm:rounded-lg border border-tas-accent/10">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-tas-accent/20">
                                    <thead className="bg-tas-bg-page">
                                        <tr>
                                            <th scope="col" className={tableHeaderClass}>ID</th>
                                            <th scope="col" className={tableHeaderClass}>Título</th>
                                            <th scope="col" className={tableHeaderClass}>Empresa</th>
                                            <th scope="col" className={tableHeaderClass}>Solicitante</th>
                                            <th scope="col" className={tableHeaderClass}>Técnico</th>
                                            <th scope="col" className={tableHeaderClass}>Prioridade</th>
                                            <th scope="col" className={tableHeaderClass}>Data Abertura</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-tas-accent/10">
                                        {tickets.map((ticket) => {
                                            const priorityConfig = getPriorityConfig(ticket.priority);
                                            return (
                                                <tr
                                                    key={ticket.id}
                                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                    className={tableRowClass}
                                                >
                                                    <td className={tableCellClass}>#{ticket.id}</td>
                                                    <td className={`${tableCellClass} font-medium text-tas-primary`}>{ticket.title}</td>
                                                    <td className={tableCellClass}>{ticket.company.name}</td>
                                                    <td className={tableCellClass}>{ticket.openedBy.username}</td>
                                                    <td className={tableCellClass}>{ticket.assignedTo?.username || '-'}</td>
                                                    <td className={`${tableCellClass} ${priorityConfig.className} text-center font-semibold`}>
                                                        {priorityConfig.label}
                                                    </td>
                                                    <td className={tableCellClass}>{formatDate(ticket.createdAt)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
