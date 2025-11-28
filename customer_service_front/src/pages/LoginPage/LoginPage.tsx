// src/pages/LoginPage/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário
import { api } from '../../lib/axios'; // Importa a instância configurada do axios
import { toast } from 'sonner'; // Para notificações
import { Helmet } from 'react-helmet-async'; // Adicionado para título da página

// Logos originais da LoginPage.tsx
import TASLogo from '../../assets/logo/TAS-logo.svg';
import TrustAssisSystem from '../../assets/logo/TrustAssistSystem.svg';

// Removida a prop isDarkMode
interface LoginPageProps {
  // onLoginSuccess: () => void; // Esta prop pode não ser mais necessária se o redirecionamento for feito aqui
}

interface LoginApiResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles?: string[];
  companyUserId?: number | null;
  adminUserId?: number | null;
  moderatorUserId?: number | null;
}

export function LoginPage({}: LoginPageProps) { // Prop removida
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  // Classes de estilo com a paleta "Confiança Moderna (Light) Final"
  const pageBgClass = 'bg-tas-bg-page'; // #DFE0E1
  const cardBgClass = 'bg-tas-bg-card'; // #F2F2F2
  
  const labelTextClass = 'text-tas-text-secondary-on-card'; // #6C757D
  const inputBgClass = 'bg-white'; // Inputs brancos para contraste com card #F2F2F2
  const inputTextClass = 'text-tas-text-on-card'; // #212529
  const inputBorderClass = 'border-gray-300'; // Borda padrão cinza claro
  const inputFocusRingClass = 'focus:ring-tas-secondary focus:border-tas-secondary'; // Foco no verde esmeralda

  const primaryButtonBgClass = 'bg-tas-secondary'; // #00875A (Verde Esmeralda)
  const primaryButtonTextClass = 'text-tas-text-on-primary'; // #FFFFFF
  const primaryButtonHoverBgClass = 'hover:bg-tas-secondary-hover'; // #007a50

  const secondaryLinkTextClass = 'text-tas-secondary'; // #00875A
  const secondaryLinkHoverTextClass = 'hover:text-tas-secondary-hover'; // #007a50

  const accentLinkTextClass = 'text-tas-accent'; // #FFC107 (Âmbar)
  const accentLinkHoverTextClass = 'hover:text-tas-accent-hover'; // #ebb206
  
  const disabledButtonBgClass = 'bg-gray-400';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error('Por favor, preencha o nome de utilizador e a senha.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<LoginApiResponse>('/api/auth/signin', {
        username,
        password,
      });

      const { token, ...userData } = response.data;
      
      const userForContext = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        roles: userData.roles || [],
        companyUserId: userData.companyUserId,
        adminUserId: userData.adminUserId,
        moderatorUserId: userData.moderatorUserId,
      };

      auth.login(userForContext, token);
      
      toast.success('Login bem-sucedido!');
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Falha no login:", error);
      if (error.response && error.response.status === 401) {
        toast.error('Nome de utilizador ou senha inválidos.');
      } else if (error.response) {
        const apiErrorMessage = error.response.data?.message || 'Erro ao tentar fazer login. Tente novamente mais tarde.';
        toast.error(apiErrorMessage);
      } else if (error.request) {
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - TAS</title>
      </Helmet>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] ${pageBgClass}`}>
        <div className={`p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md ${cardBgClass}`}>
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <div>
              <img src={TASLogo} alt="TAS Logo" className="h-16 w-auto" /> {/* Ajuste de tamanho se necessário */}
            </div>
            <div>
              <img src={TrustAssisSystem} alt="Trust Assist System" className="h-10" /> {/* Ajuste de tamanho se necessário */}
            </div>
          </div>
              
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="username"
                className={`block text-sm font-medium mb-1 ${labelTextClass}`}
              >
                Nome de Utilizador 
              </label>
              <input 
                type="text"
                id="username" 
                name="username"
                placeholder="Seu nome de utilizador"
                className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium mb-1 ${labelTextClass}`}
              >
                Senha
              </label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Sua senha"
                className={`w-full px-4 py-2.5 ${inputBgClass} ${inputTextClass} ${inputBorderClass} rounded-lg shadow-sm transition-colors ${inputFocusRingClass}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <div className="text-right mt-1">
                <a 
                  href="#" // Implementar funcionalidade de "Esqueceu a senha?" depois
                  className={`text-sm ${secondaryLinkTextClass} ${secondaryLinkHoverTextClass}`}
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            <button 
              type="submit"
              className={`w-full px-4 py-2.5 rounded-lg ${primaryButtonTextClass} font-semibold transition-colors ${isLoading ? disabledButtonBgClass : `${primaryButtonBgClass} ${primaryButtonHoverBgClass}`}`}
              disabled={isLoading}
            >
              {isLoading ? 'A Entrar...' : 'Entrar'}
            </button>
          </form>
          <p className={`mt-6 text-center text-sm ${labelTextClass}`}>
            Não tem uma conta?{' '}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/signup'); }}
              className={`font-medium ${accentLinkTextClass} ${accentLinkHoverTextClass}`}
            >
              Crie uma agora
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
