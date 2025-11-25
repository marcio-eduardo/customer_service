// src/pages/LoginPage/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

import TASLogo from '../../assets/logo/TAS-logo.svg';
import TrustAssisSystem from '../../assets/logo/TrustAssistSystem.svg';

interface LoginApiResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  roles?: string[];
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const navigate = useNavigate();

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] bg-tas-bg-page">
        <div className="p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md bg-tas-bg-card">
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <div>
              <img src={TASLogo} alt="TAS Logo" className="h-16 w-auto" />
            </div>
            <div>
              <img src={TrustAssisSystem} alt="Trust Assist System" className="h-10" />
            </div>
          </div>
              
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card"
              >
                Nome de Utilizador 
              </label>
              <input 
                type="text"
                id="username" 
                name="username"
                placeholder="Seu nome de utilizador"
                className="w-full px-4 py-2.5 bg-white text-tas-text-on-card border-gray-300 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card"
              >
                Senha
              </label>
              <input 
                type="password" 
                id="password" 
                name="password"
                placeholder="Sua senha"
                className="w-full px-4 py-2.5 bg-white text-tas-text-on-card border-gray-300 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <div className="text-right mt-1">
                <a 
                  href="#"
                  className="text-sm text-tas-secondary hover:text-tas-secondary-hover"
                >
                  Esqueceu a senha?
                </a>
              </div>
            </div>
            <button 
              type="submit"
              className="w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors disabled:bg-gray-400 bg-tas-secondary hover:bg-tas-secondary-hover"
              disabled={isLoading}
            >
              {isLoading ? 'A Entrar...' : 'Entrar'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-tas-text-secondary-on-card">
            Não tem uma conta?{' '}
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); navigate('/signup'); }}
              className="font-medium text-tas-accent hover:text-tas-accent-hover"
            >
              Crie uma agora
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
