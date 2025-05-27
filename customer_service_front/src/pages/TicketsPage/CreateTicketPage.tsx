// Localização: src/pages/TicketsPage/CreateTicketPage.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios'; // Nossa instância Axios configurada

// Interface para os dados do formulário
interface TicketFormData {
  title: string;
  description: string;
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.description) {
      toast.error('Por favor, preencha o título e a descrição.');
      setIsLoading(false);
      return;
    }

    const ticketDataToSend = {
      title: formData.title,
      description: formData.description,
    };

    try {
      await api.post('/api/tickets/open', ticketDataToSend);
      toast.success('Chamado aberto com sucesso! Um técnico será atribuído em breve.');
      navigate('/dashboard'); 
    } catch (error: any) {
      console.error("Falha ao abrir chamado:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocorreu um erro ao abrir o chamado.';
      if (error.response?.status === 401) {
        toast.error("Erro 401: Não autorizado. Faça login para abrir um chamado.");
      } else if (error.response?.status === 403) {
        toast.error("Erro 403: Você não tem permissão para realizar esta ação.");
      }
      else {
        toast.error(`Erro: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Classes de estilo com a paleta "Confiança Moderna (Light) Final"
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-tas-bg-page text-tas-text-on-card font-['Poppins']"; // Fundo da página e texto padrão
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  
  const headerTitleClass = "text-tas-primary"; // Azul da navbar para o título principal
  const headerSubtitleClass = "text-tas-text-secondary-on-card"; // Texto secundário para o subtítulo

  const formCardClasses = "bg-tas-bg-card shadow-xl rounded-xl p-6 md:p-8"; // Fundo do card
  
  const labelClasses = "block text-sm font-medium mb-1 text-tas-text-secondary-on-card"; // Texto dos rótulos
  
  // Inputs mantêm fundo branco para contraste com o card F2F2F2, borda cinza padrão. Foco usa cor secundária (verde).
  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm transition-colors text-tas-text-on-card focus:ring-tas-secondary focus:border-tas-secondary";
  
  // Botão principal usa cor secundária (verde)
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tas-secondary hover:bg-tas-secondary-hover'}`;


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
              Preencha os detalhes abaixo para registrar um novo chamado de suporte.
            </p>
          </header>

          <section className={formCardClasses}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className={labelClasses}>
                  Título do Chamado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Ex: Problema ao acessar o sistema"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClasses}>
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`${inputClasses} min-h-[120px]`}
                  placeholder="Descreva o problema ou solicitação em detalhes..."
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={buttonClasses}
                disabled={isLoading}
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
