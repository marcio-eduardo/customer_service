// Localização: src/pages/TicketsPage/CreateTicketPage.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios'; // Nossa instância Axios configurada
// Não precisamos mais da interface TechnicalType ou de buscar técnicos aqui

// Interface para os dados do formulário (MODIFICADA)
interface TicketFormData {
  title: string;
  description: string;
  // technicalId foi removido
}

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  // Não precisamos mais de technicians ou isFetchingTechnicians

  // useEffect para buscar técnicos foi removido

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // Removido HTMLSelectElement
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.description) { // Verificação simplificada
      toast.error('Por favor, preencha o título e a descrição.');
      setIsLoading(false);
      return;
    }

    // MODIFICADO: technicalId não é mais enviado
    const ticketDataToSend = {
      title: formData.title,
      description: formData.description,
    };

    try {
      // O backend agora espera apenas title e description no TicketOpenRequest
      await api.post('/api/tickets/open', ticketDataToSend); // Endpoint para abrir chamado
      toast.success('Chamado aberto com sucesso! Um técnico será atribuído em breve.');
      // Redirecionar para uma página onde o usuário pode ver seus chamados ou dashboard
      navigate('/dashboard'); // ou talvez '/meus-chamados' se existir
    } catch (error: any) {
      console.error("Falha ao abrir chamado:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Ocorreu um erro ao abrir o chamado.';
       // O backend agora deve permitir a abertura para qualquer authenticated,
       // então um 403 aqui seria inesperado para esta ação específica, a menos que haja outras restrições.
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

  // Classes de estilo (mantidas para consistência, ajuste conforme necessário)
  const inputClasses = "w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors bg-white border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2] text-gray-800";
  const labelClasses = "block text-sm font-medium mb-1 text-gray-700";
  const buttonClasses = `w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-colors ${isLoading ? 'bg-gray-400' : 'bg-[#006086] hover:bg-[#3c7ddb]'}`;
  const pageWrapperClasses = "min-h-screen pt-20 md:pt-24 bg-[#EAEAEA] text-gray-800 font-['Poppins']";
  const contentContainerClasses = "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8";
  const formCardClasses = "bg-white shadow-xl rounded-xl p-6 md:p-8";

  return (
    <>
      <Helmet>
        <title>Abrir Novo Chamado</title>
      </Helmet>
      <div className={pageWrapperClasses}>
        <div className={contentContainerClasses}>
          <header className="mb-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Abrir Novo Chamado</h1>
            <p className="text-gray-600 mt-2 text-base lg:text-lg">
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

              {/* Campo de seleção de técnico foi REMOVIDO */}

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