// src/pages/TicketsPage/CreateTicketPage.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import type { Company } from '../../types/Company';
import type { User } from '../../types/User';
import { getAllCompanies } from '../../services/companyService';
import { getUsersByCompany, getAllTechUsers, getUserDetails } from '../../services/userService';

interface TicketFormData {
  title: string;
  description: string;
  priority: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  selectedCompanyId: string;
  selectedRequesterId: string;
  selectedAssigneeId: string;
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    priority: 'MEDIA', // Valor padrão
    selectedCompanyId: '',
    selectedRequesterId: '',
    selectedAssigneeId: '',
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [techUsers, setTechUsers] = useState<User[]>([]);
  const [loggedInUserCompany, setLoggedInUserCompany] = useState<Company | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  const isManager = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_TECH_USER'].includes(r));
  const canAssignTech = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_MODERATOR'].includes(r));

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFetchingInitialData(true);
      try {
        if (isManager) {
          const companiesData = await getAllCompanies();
          setCompanies(companiesData);
          if (canAssignTech) {
            const techsData = await getAllTechUsers();
            setTechUsers(techsData);
          }
        } else if (user) {
          // Para usuário comum, buscar os detalhes completos, incluindo a empresa
          const userDetails = await getUserDetails(user.id);
          if (userDetails.company) {
            setLoggedInUserCompany(userDetails.company);
            setFormData(prev => ({ ...prev, selectedCompanyId: userDetails.company!.id.toString() }));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        toast.error("Erro ao carregar informações necessárias.");
      } finally {
        setIsFetchingInitialData(false);
      }
    };

    loadInitialData();
  }, [isManager, canAssignTech, user]);

  useEffect(() => {
    const loadCompanyUsers = async () => {
      if (isManager && formData.selectedCompanyId) {
        try {
          const users = await getUsersByCompany(Number(formData.selectedCompanyId));
          setCompanyUsers(users);
          setFormData(prev => ({ ...prev, selectedRequesterId: '' })); // Limpa o solicitante ao trocar de empresa
        } catch (error) {
          console.error("Erro ao carregar usuários da empresa:", error);
          toast.error("Erro ao carregar usuários da empresa selecionada.");
        }
      } else {
        setCompanyUsers([]);
      }
    };
    loadCompanyUsers();
  }, [formData.selectedCompanyId, isManager]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Por favor, preencha o título e a descrição.');
      return;
    }
    if (isManager && !formData.selectedCompanyId) {
      toast.error('Por favor, selecione uma empresa.');
      return;
    }
    if (isManager && !formData.selectedRequesterId) {
      toast.error('Por favor, selecione o solicitante.');
      return;
    }

    setIsLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      companyId: isManager ? Number(formData.selectedCompanyId) : (loggedInUserCompany?.id),
      requesterId: isManager ? Number(formData.selectedRequesterId) : (user?.id),
      assigneeId: canAssignTech && formData.selectedAssigneeId ? Number(formData.selectedAssigneeId) : undefined,
    };

    try {
      await api.post('/api/tickets/open', payload);
      toast.success('Chamado aberto com sucesso!');
      navigate('/tickets/abertos');
    } catch (error: any) {
      console.error("Falha ao abrir chamado:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao abrir o chamado.';
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos consistentes
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8 border border-black/10";
  const headerTitleClass = "text-tas-primary";
  const headerSubtitleClass = "text-tas-text-secondary-on-card";
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card";
  const inputBaseClasses = "w-full px-4 py-2.5 bg-tas-bg-page text-tas-text-on-card border border-tas-accent/20 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary disabled:opacity-50 disabled:cursor-not-allowed";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors disabled:bg-tas-secondary/50 bg-tas-secondary hover:bg-tas-secondary-hover`;

  return (
    <>
      <Helmet>
        <title>Abrir Novo Chamado - TAS</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className={`text-3xl lg:text-4xl font-bold ${headerTitleClass}`}>Abrir Novo Chamado</h1>
            <p className={`${headerSubtitleClass} mt-2 text-base lg:text-lg`}>
              {isManager ? "Registre um chamado para um cliente." : "Descreva o problema para registrar um novo chamado."}
            </p>
          </header>

          <section className={formCardClasses}>
            {isFetchingInitialData ? (
              <p className="text-center py-10 text-tas-text-secondary-on-card">Carregando formulário...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isManager ? (
                  <div>
                    <label htmlFor="selectedCompanyId" className={labelClasses}>Empresa <span className="text-red-500">*</span></label>
                    <select id="selectedCompanyId" name="selectedCompanyId" value={formData.selectedCompanyId} onChange={handleChange} className={inputBaseClasses} required disabled={isLoading}>
                      <option value="" disabled>-- Selecione a Empresa --</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  loggedInUserCompany && (
                    <div>
                      <label className={labelClasses}>Empresa</label>
                      <input type="text" value={`${loggedInUserCompany.name} (CNPJ: ${loggedInUserCompany.cnpj})`} disabled className={inputBaseClasses} />
                    </div>
                  )
                )}

                {isManager && (
                  <div>
                    <label htmlFor="selectedRequesterId" className={labelClasses}>Solicitante <span className="text-red-500">*</span></label>
                    <select id="selectedRequesterId" name="selectedRequesterId" value={formData.selectedRequesterId} onChange={handleChange} className={inputBaseClasses} required disabled={isLoading || !formData.selectedCompanyId}>
                      <option value="" disabled>{!formData.selectedCompanyId ? '-- Selecione uma empresa primeiro --' : '-- Selecione o Solicitante --'}</option>
                      {companyUsers.map(u => (
                        <option key={u.id} value={u.id}>{`${u.username} (${u.email})`}</option>
                      ))}
                    </select>
                  </div>
                )}

                {canAssignTech && (
                  <div>
                    <label htmlFor="selectedAssigneeId" className={labelClasses}>Atribuir Técnico (Opcional)</label>
                    <select id="selectedAssigneeId" name="selectedAssigneeId" value={formData.selectedAssigneeId} onChange={handleChange} className={inputBaseClasses} disabled={isLoading}>
                      <option value="">-- Deixar na fila (Sem técnico) --</option>
                      {techUsers.map(tech => (
                        <option key={tech.id} value={tech.id}>{`${tech.username} (${tech.email})`}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="title" className={labelClasses}>Título do Chamado <span className="text-red-500">*</span></label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputBaseClasses} placeholder="Ex: Problema ao acessar o sistema" required disabled={isLoading} />
                </div>

                <div>
                  <label htmlFor="priority" className={labelClasses}>Prioridade</label>
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange} className={inputBaseClasses} disabled={isLoading}>
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className={labelClasses}>Descrição Detalhada <span className="text-red-500">*</span></label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputBaseClasses} min-h-[120px]`} placeholder="Descreva o problema ou solicitação em detalhes..." required disabled={isLoading} />
                </div>

                <button type="submit" className={buttonClasses} disabled={isLoading}>
                  {isLoading ? 'A Abrir Chamado...' : 'Abrir Chamado'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}