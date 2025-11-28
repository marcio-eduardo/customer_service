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
import { getUsersByCompany, getAllTechUsers } from '../../services/userService';

interface TicketFormData {
  title: string;
  description: string;
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
    selectedCompanyId: '',
    selectedRequesterId: '',
    selectedAssigneeId: '',
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [techUsers, setTechUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(true);

  // Roles
  const isManager = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_MODERATOR', 'ROLE_TECH_USER'].includes(r));
  const canAssignTech = user?.roles?.some(r => ['ROLE_ADMIN', 'ROLE_MODERATOR'].includes(r));
  const isCompanyUser = !isManager; // Simplificação, assumindo que se não é manager, é company user (ou user simples)

  useEffect(() => {
    const loadInitialData = async () => {
      setIsFetchingInitialData(true);
      try {
        if (isManager) {
          // Carregar todas as empresas
          const companiesData = await getAllCompanies();
          setCompanies(companiesData);

          // Se puder atribuir técnico, carregar técnicos
          if (canAssignTech) {
            const techsData = await getAllTechUsers();
            setTechUsers(techsData);
          }
        } else {
          // Se for usuário de empresa, a empresa já deve vir do contexto ou de um endpoint 'me'
          // Como o contexto atual tem user.companyId (se adicionarmos), ou podemos pegar do backend
          // Por enquanto, vamos assumir que o backend valida, mas para o frontend precisamos saber a empresa dele
          // Vamos tentar pegar os dados do usuário atual atualizados, caso o contexto não tenha
          try {
            // Se o user context não tiver companyId, talvez precisemos de um endpoint /api/me/details
            // Mas vamos assumir que o usuário logado sabe sua empresa ou o backend preenche automaticamente se não enviado
            // Para exibir o nome da empresa, seria bom ter essa info.
            // Vou deixar como "Sua Empresa" se não tivermos o dado visualmente, mas o backend deve tratar.
            // O ideal seria: const myCompany = await getMyCompany(); setCompanies([myCompany]);
            // Mas vamos simplificar: se é company user, ele não seleciona empresa, o backend pega do token.
          } catch (e) {
            console.error("Erro ao carregar dados do usuário", e);
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
  }, [isManager, canAssignTech]);

  // Quando a empresa selecionada mudar, carregar os usuários dessa empresa
  useEffect(() => {
    const loadCompanyUsers = async () => {
      if (formData.selectedCompanyId) {
        try {
          const users = await getUsersByCompany(Number(formData.selectedCompanyId));
          setCompanyUsers(users);
        } catch (error) {
          console.error("Erro ao carregar usuários da empresa:", error);
          toast.error("Erro ao carregar usuários da empresa selecionada.");
        }
      } else {
        setCompanyUsers([]);
      }
    };

    if (isManager) {
      loadCompanyUsers();
    }
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
      companyId: isManager ? Number(formData.selectedCompanyId) : undefined, // Backend pega do token se null
      requesterId: isManager ? Number(formData.selectedRequesterId) : undefined, // Backend pega do token se null
      assigneeId: canAssignTech && formData.selectedAssigneeId ? Number(formData.selectedAssigneeId) : undefined,
    };

    try {
      await api.post('/api/tickets/open', payload);
      toast.success('Chamado aberto com sucesso!');
      navigate('/tickets/abertos'); // Redirecionar para lista de chamados
    } catch (error: any) {
      console.error("Falha ao abrir chamado:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao abrir o chamado.';
      toast.error(`Erro: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Abrir Novo Chamado - TAS</title>
      </Helmet>
      <div className="min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-tas-primary">Abrir Novo Chamado</h1>
            <p className="text-tas-text-secondary-on-card mt-2 text-base lg:text-lg">
              {isManager ? "Registre um chamado para um cliente." : "Descreva o problema para registrar um novo chamado."}
            </p>
          </header>

          <section className="bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Seleção de Empresa (Apenas Managers) */}
              {isManager ? (
                <div>
                  <label htmlFor="selectedCompanyId" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                    Empresa <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectedCompanyId"
                    name="selectedCompanyId"
                    value={formData.selectedCompanyId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-tas-secondary focus:border-tas-secondary"
                    required
                    disabled={isLoading || isFetchingInitialData}
                  >
                    <option value="" disabled>-- Selecione a Empresa --</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.tradeName} ({company.cnpj})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">Empresa</label>
                  <input
                    type="text"
                    value="Sua Empresa (Vinculada ao Perfil)"
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Seleção de Solicitante (Apenas Managers e se Empresa selecionada) */}
              {isManager && (
                <div>
                  <label htmlFor="selectedRequesterId" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                    Solicitante (Usuário da Empresa) <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectedRequesterId"
                    name="selectedRequesterId"
                    value={formData.selectedRequesterId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-tas-secondary focus:border-tas-secondary"
                    required
                    disabled={isLoading || !formData.selectedCompanyId}
                  >
                    <option value="" disabled>
                      {!formData.selectedCompanyId ? '-- Selecione uma empresa primeiro --' : '-- Selecione o Solicitante --'}
                    </option>
                    {companyUsers.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.username})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Seleção de Técnico Responsável (Apenas Admin/Moderator) */}
              {canAssignTech && (
                <div>
                  <label htmlFor="selectedAssigneeId" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                    Técnico Responsável (Opcional)
                  </label>
                  <select
                    id="selectedAssigneeId"
                    name="selectedAssigneeId"
                    value={formData.selectedAssigneeId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-tas-secondary focus:border-tas-secondary"
                    disabled={isLoading || isFetchingInitialData}
                  >
                    <option value="">-- Deixar na fila (Sem técnico) --</option>
                    {techUsers.map(tech => (
                      <option key={tech.id} value={tech.id}>
                        {tech.nome} ({tech.username})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                  Título do Chamado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-tas-secondary focus:border-tas-secondary"
                  placeholder="Ex: Problema ao acessar o sistema"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card">
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm min-h-[120px] focus:ring-tas-secondary focus:border-tas-secondary"
                  placeholder="Descreva o problema ou solicitação em detalhes..."
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors disabled:bg-gray-400 bg-tas-secondary hover:bg-tas-secondary-hover"
                disabled={isLoading || isFetchingInitialData}
              >
                {isLoading ? 'A Abrir Chamado...' : 'Abrir Chamado'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
