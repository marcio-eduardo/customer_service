// src/pages/LoginPage/LoginPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react'; // Importa FormEvent como um tipo
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário
import { api } from '../../lib/axios'; // Importa a instância configurada do axios
import { toast } from 'sonner'; // Para notificações

import TASLogo from '../../assets/logo/TAS-logo.svg';
import TrustAssisSystem from '../../assets/logo/TrustAssistSystem.svg';

interface LoginPageProps {
  // onLoginSuccess: () => void; // Esta prop pode não ser mais necessária se o redirecionamento for feito aqui
  isDarkMode: boolean;
}

// Interface para a resposta esperada da API de login (baseada na sua JwtResponse.java)
interface LoginApiResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles?: string[]; // Papéis são opcionais, mas idealmente presentes
}

export function LoginPage({ isDarkMode }: LoginPageProps) {
  const [username, setUsername] = useState(''); // Usaremos username para login, conforme backend
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

  // Classes de estilo condicionais baseadas no isDarkMode
  const pageBgClass = isDarkMode ? 'bg-slate-900' : 'bg-slate-200';
  const cardBgClass = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const buttonBgClass = 'bg-[#006086] hover:bg-[#3c7ddb]'; // Use suas cores do Tailwind aqui
  const buttonDisabledBgClass = 'bg-gray-400';


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // toast.dismiss(); // Limpa toasts anteriores, se houver

    if (!username || !password) {
      toast.error('Por favor, preencha o nome de utilizador e a senha.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post<LoginApiResponse>('/api/auth/signin', { //
        username, // O backend espera 'username'
        password,
      });

      const { token, ...userData } = response.data;
      
      // Prepara os dados do utilizador para o AuthContext
      // Se o backend enviar 'username', e o AuthContext esperar 'username', está ok.
      // Se o AuthContext esperar 'nome', você precisaria mapear: nome: userData.username
      const userForContext = {
        id: userData.id, // Converte para string se o AuthContext User.id for string
        username: userData.username,
        email: userData.email,
        roles: userData.roles || [], // Garante que roles seja um array
      };

      auth.login(userForContext, token); // Chama o login do AuthContext
      
      toast.success('Login bem-sucedido!');
      navigate('/dashboard'); // Redireciona para a dashboard ou página principal

    } catch (error: any) {
      console.error("Falha no login:", error);
      if (error.response && error.response.status === 401) {
        toast.error('Nome de utilizador ou senha inválidos.');
      } else if (error.response) {
        // Outros erros da API (ex: 500)
        const apiErrorMessage = error.response.data?.message || 'Erro ao tentar fazer login. Tente novamente mais tarde.';
        toast.error(apiErrorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta (ex: servidor offline)
        toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Algo aconteceu ao configurar a requisição que acionou um erro
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] ${pageBgClass}`}>
      <div className={`p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md ${cardBgClass}`}>
        <div className="flex justify-center mb-10 flex-col items-center gap-4">
          <div>
            <img src={TASLogo} alt="TAS Logo" />
          </div>
          <div>
            <img src={TrustAssisSystem} alt="Trust Assist System" />
          </div>
        </div>
            
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="username" // Alterado de 'email' para 'username' para corresponder ao backend
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Nome de Utilizador 
            </label>
            <input 
              type="text" // Alterado de 'email' para 'text'
              id="username" 
              name="username"
              placeholder="Seu nome de utilizador"
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors
                          ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                                       : 'border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Senha
            </label>
            <input 
              type="password" 
              id="password" 
              name="password"
              placeholder="Sua senha"
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors
                          ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                                       : 'border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="text-right mt-1">
              <a 
                href="#" // Implementar funcionalidade de "Esqueceu a senha?" depois
                className={`text-sm ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-[#4A90E2] hover:text-[#005BC5]'}`}
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
          <button 
            type="submit"
            className={`w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-colors ${isLoading ? buttonDisabledBgClass : buttonBgClass}`}
            disabled={isLoading}
          >
            {isLoading ? 'A Entrar...' : 'Entrar'}
          </button>
        </form>
        <p className={`mt-6 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Não tem uma conta?{' '}
          <a 
            href="#" // Idealmente, isto navegaria para uma página de registo
            onClick={(e) => { e.preventDefault(); navigate('/signup'); /* Exemplo, se tiver uma rota /signup */} }
            className={`font-medium ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-[#54B938] hover:text-[#1E8202]'}`}
          >
            Crie uma agora
          </a>
        </p>
      </div>
    </div>
  );
}