// src/pages/SignUpPage/SignUpPage.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { api } from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import TASLogo from '../../assets/logo/NuvemConfig-2.svg';

// Interface para os dados do formulário de registo atualizada
interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  role: string;
  nome: string; // Novo campo para o nome completo do ClientePf
  cpf: string;  // Novo campo para o CPF do ClientePf
}

export function SignUpPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  
  const isAdmin = auth.isAuthenticated && auth.user?.roles?.includes('ROLE_ADMIN');

  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    nome: '', // Inicializar novos campos
    cpf: '',   // Inicializar novos campos
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // O payload agora inclui os campos nome e cpf
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nome: formData.nome,
        cpf: formData.cpf,
        // Só envia o 'role' se o utilizador for admin.
        ...(isAdmin && { role: [formData.role] }),
      };

      await api.post('/api/auth/signup', payload);

      if (isAdmin) {
        toast.success(`Utilizador '${formData.username}' criado com sucesso!`);
        setFormData({ username: '', email: '', password: '', role: 'user', nome: '', cpf: '' });
      } else {
        toast.success('Conta criada com sucesso! A autenticar...');
        
        const loginResponse = await api.post('/api/auth/signin', {
          username: formData.username,
          password: formData.password,
        });

        const { token, ...userData } = loginResponse.data;
        auth.login(userData, token);

        // Redireciona para a página de criação de chamados
        navigate('/tickets/novo');
      }

    } catch (error: any) {
      console.error("Falha no registo:", error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro durante o registo.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Classes de estilo
  const pageBgClass = 'bg-tas-bg-page';
  const cardBgClass = 'bg-tas-bg-card';
  const labelTextClass = 'text-tas-text-secondary-on-card';
  const inputBgClass = 'bg-white';
  const inputTextClass = 'text-tas-text-on-card';
  const inputBorderClass = 'border-gray-300';
  const inputFocusRingClass = 'focus:ring-tas-secondary focus:border-tas-secondary';
  const primaryButtonBgClass = 'bg-tas-secondary';
  const primaryButtonTextClass = 'text-tas-text-on-primary';
  const primaryButtonHoverBgClass = 'hover:bg-tas-secondary-hover';
  const secondaryLinkTextClass = 'text-tas-secondary';
  const secondaryLinkHoverTextClass = 'hover:text-tas-secondary-hover';
  const disabledButtonBgClass = 'bg-gray-400';

  return (
    <>
      <Helmet>
        <title>Criar Conta - TAS</title>
      </Helmet>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] ${pageBgClass}`}>
        <div className={`p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md ${cardBgClass}`}>
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <Link to="/">
              <img src={TASLogo} alt="TAS Logo" className="h-16 w-auto" />
            </Link>
            <h2 className="text-2xl font-bold text-tas-primary">
              {isAdmin ? 'Criar Novo Utilizador' : 'Crie a sua Conta'}
            </h2>
          </div>
              
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Se for um cliente a registar-se, pede primeiro os dados pessoais */}
            {!isAdmin && (
              <>
                <div>
                  <label htmlFor="nome" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Nome Completo </label>
                  <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="O seu nome completo"
                    className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                    required disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="cpf" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> CPF </label>
                  <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="Seu CPF (apenas números)"
                    className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                    required disabled={isLoading} />
                </div>
              </>
            )}
            
            {/* Campos de login */}
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Nome de Utilizador </label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Escolha um nome de utilizador"
                className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Email </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="o.seu.email@exemplo.com"
                className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Senha </label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Crie uma senha segura"
                className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                required disabled={isLoading} />
            </div>
            
            {/* Campo de seleção de papel (role) - Visível apenas para Admins */}
            {isAdmin && (
              <>
                 <div>
                  <label htmlFor="nome" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Nome Completo (para Técnico/Moderador) </label>
                  <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome completo do novo utilizador"
                    className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                    required disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="cpf" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> CPF (para Técnico/Moderador) </label>
                  <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="CPF do novo utilizador"
                    className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                    required disabled={isLoading} />
                </div>
                <div>
                  <label htmlFor="role" className={`block text-sm font-medium mb-1 ${labelTextClass}`}> Papel do Utilizador </label>
                  <select id="role" name="role" value={formData.role} onChange={handleChange}
                    className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                    disabled={isLoading}>
                    <option value="user">Utilizador (User)</option>
                    <option value="moderator">Moderador (Moderator)</option>
                    <option value="admin">Administrador (Admin)</option>
                  </select>
                </div>
              </>
            )}

            <div className="pt-2">
              <button type="submit" className={`w-full px-4 py-2.5 rounded-lg ${primaryButtonTextClass} font-semibold transition-colors ${isLoading ? disabledButtonBgClass : `${primaryButtonBgClass} ${primaryButtonHoverBgClass}`}`}
                disabled={isLoading}>
                {isLoading ? 'A Criar Conta...' : 'Criar Conta'}
              </button>
            </div>
          </form>
          
          {!isAdmin && (
            <p className={`mt-6 text-center text-sm ${labelTextClass}`}> Já tem uma conta?{' '}
              <Link to="/" className={`font-medium ${secondaryLinkTextClass} ${secondaryLinkHoverTextClass}`}> Faça login aqui </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
