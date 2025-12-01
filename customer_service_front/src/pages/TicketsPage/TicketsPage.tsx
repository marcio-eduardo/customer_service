import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { Company } from '../../types/Company';
import type { User } from '../../types/User';

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
    slaDueDate?: string;
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

const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
        OPEN: { label: 'Aberto', className: 'bg-tas-status-info text-tas-text-on-primary' },
        IN_PROGRESS: { label: 'Em Progresso', className: 'bg-tas-status-warning text-tas-text-on-primary' },
        RESOLVED: { label: 'Resolvido', className: 'bg-tas-status-success text-tas-text-on-primary' },
        PAUSED: { label: 'Pausado', className: 'bg-gray-500 text-white' },
        ESCALATED: { label: 'Escalado', className: 'bg-purple-600 text-white' },
        CANCELED: { label: 'Cancelado', className: 'bg-red-600 text-white' },
    };
    return statusMap[status] || { label: status, className: 'bg-gray-500 text-white' };
};

export function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filters
    const [searchParams, setSearchParams] = useSearchParams();

    // Filters - Initialize from URL
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
    const [companyFilter, setCompanyFilter] = useState<string>(searchParams.get('companyId') || '');
    const [techFilter, setTechFilter] = useState<string>(searchParams.get('techId') || '');

    // Filter Options
    const [companies, setCompanies] = useState<Company[]>([]);
    const [techs, setTechs] = useState<User[]>([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // Tenta corrigir SLAs antigos automaticamente ao carregar a página
                await api.post('/api/tickets/fix-slas').catch(() => { });

                const [companiesRes, techsRes] = await Promise.all([
                    api.get<Company[]>('/api/companies'),
                    api.get<User[]>('/api/users/techs')
                ]);
                setCompanies(companiesRes.data);
                setTechs(techsRes.data);
            } catch (err) {
                console.error('Erro ao carregar filtros', err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (statusFilter) params.append('status', statusFilter);
                if (companyFilter) params.append('companyId', companyFilter);
                if (techFilter) params.append('techId', techFilter);

                const response = await api.get<Ticket[]>(`/api/tickets/search?${params.toString()}`);
                setTickets(response.data || []);
            } catch (err) {
                console.error('Erro ao buscar tickets:', err);
                setError('Não foi possível carregar os chamados.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, [statusFilter, companyFilter, techFilter]);

    const pageWrapperClasses = `min-h-screen pt-16 bg-tas-bg-page text-tas-text-on-card`;
    const contentContainerClasses = "w-full mx-auto px-4 sm:px-6 lg:px-8 py-8";
    const headerTitleClass = 'text-tas-primary';
    const tableHeaderClass = "px-6 py-3 text-left text-xs font-medium text-tas-text-secondary-on-card uppercase tracking-wider";
    const tableRowClass = "bg-tas-bg-card hover:bg-tas-bg-page transition-colors cursor-pointer border-b border-tas-accent/10";
    const tableCellClass = "px-6 py-4 whitespace-nowrap text-sm text-tas-text-on-card";

    return (
        <>
            <Helmet>
                <title>Chamados - TAS</title>
            </Helmet>
            <div className={pageWrapperClasses}>
                <div className={contentContainerClasses}>
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className={`text-3xl font-bold ${headerTitleClass}`}>Chamados</h1>
                            <p className="mt-2 text-tas-text-secondary-on-card">Gerencie todos os chamados do sistema.</p>
                        </div>
                        <button
                            onClick={() => navigate('/tickets/new')}
                            className="bg-tas-primary text-tas-text-on-primary px-4 py-2 rounded-lg hover:bg-tas-primary-hover transition-colors font-medium"
                        >
                            Novo Chamado
                        </button>
                    </header>

                    {/* Filters Bar */}
                    <div className="bg-tas-bg-card p-4 rounded-lg shadow mb-6 border border-tas-accent/10 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-tas-text-secondary-on-card mb-1">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setSearchParams(prev => {
                                        if (e.target.value) prev.set('status', e.target.value);
                                        else prev.delete('status');
                                        return prev;
                                    });
                                }}
                                className="w-full bg-tas-bg-page border border-tas-accent/20 rounded-md px-3 py-2 text-tas-text-on-card focus:outline-none focus:ring-2 focus:ring-tas-primary"
                            >
                                <option value="">Todos</option>
                                <option value="OPEN">Aberto</option>
                                <option value="IN_PROGRESS">Em Progresso</option>
                                <option value="RESOLVED">Resolvido</option>
                                <option value="PAUSED">Pausado</option>
                                <option value="ESCALATED">Escalado</option>
                                <option value="CANCELED">Cancelado</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-tas-text-secondary-on-card mb-1">Empresa</label>
                            <select
                                value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}
                                className="w-full bg-tas-bg-page border border-tas-accent/20 rounded-md px-3 py-2 text-tas-text-on-card focus:outline-none focus:ring-2 focus:ring-tas-primary"
                            >
                                <option value="">Todas</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-tas-text-secondary-on-card mb-1">Técnico</label>
                            <select
                                value={techFilter}
                                onChange={(e) => setTechFilter(e.target.value)}
                                className="w-full bg-tas-bg-page border border-tas-accent/20 rounded-md px-3 py-2 text-tas-text-on-card focus:outline-none focus:ring-2 focus:ring-tas-primary"
                            >
                                <option value="">Todos</option>
                                {techs.map(t => (
                                    <option key={t.id} value={t.id}>{t.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="text-center text-tas-text-secondary-on-card py-8">Carregando chamados...</p>
                    ) : error ? (
                        <div className="bg-tas-status-error/10 border border-tas-status-error text-tas-status-error px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Erro!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-12 bg-tas-bg-card rounded-lg shadow border border-tas-accent/10">
                            <p className="text-tas-text-secondary-on-card text-lg">Nenhum chamado encontrado com os filtros selecionados.</p>
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
                                            <th scope="col" className={tableHeaderClass}>Status</th>
                                            <th scope="col" className={tableHeaderClass}>Prioridade</th>
                                            <th scope="col" className={tableHeaderClass}>SLA</th>
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
                                                    <td className={tableCellClass}>{ticket.company?.name || 'N/A'}</td>
                                                    <td className={tableCellClass}>{ticket.openedBy?.username || 'N/A'}</td>
                                                    <td className={tableCellClass}>{ticket.assignedTo?.username || '-'}</td>
                                                    <td className={tableCellClass}>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusConfig(ticket.status).className}`}>
                                                            {getStatusConfig(ticket.status).label}
                                                        </span>
                                                    </td>
                                                    <td className={tableCellClass}>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityConfig.className}`}>
                                                            {priorityConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className={tableCellClass}>
                                                        {(() => {
                                                            if (!ticket.slaDueDate) return '-';
                                                            if (ticket.status === 'RESOLVED') return <span className="text-gray-500">{formatDate(ticket.slaDueDate)}</span>;

                                                            const now = new Date();
                                                            const slaDate = new Date(ticket.slaDueDate);
                                                            const diffHours = (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60);

                                                            let className = 'text-tas-status-success'; // Safe (> 4h)
                                                            if (diffHours < 0) className = 'text-tas-status-error font-bold'; // Overdue
                                                            else if (diffHours < 4) className = 'text-tas-status-warning font-bold'; // Warning (< 4h)

                                                            return <span className={className}>{formatDate(ticket.slaDueDate)}</span>;
                                                        })()}
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
