import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { api } from '../../lib/axios';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

import TASLogo from '../../assets/logo/NuvemConfig-Wite.svg';


interface LoginApiResponse {
  token: string;
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles?: string[];
}

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setTheme('techBlue');
  }, [setTheme]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error('Por favor, preencha o nome de usuário e a senha.');
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
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        roles: userData.roles || [],
      };

      auth.login(userForContext, token);

      toast.success('Login bem-sucedido!');
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Falha no login:", error);
      if (error.response && error.response.status === 401) {
        toast.error('Nome de usuário ou senha inválidos.');
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-tas-bg-page">
        <div className="p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md bg-tas-bg-card border border-black/10">
          <div className="flex justify-center mb-10 flex-col items-center gap-4">
            <div className="flex items-center justify-center">
              <div
                className="h-16 w-24 bg-tas-secondary-hover"
                style={{
                  maskImage: `url(${TASLogo})`,
                  WebkitMaskImage: `url(${TASLogo})`,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center'
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-tas-text-secondary-on-card">Trust Assist System</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1 text-tas-text-secondary-on-card"
              >
                Nome de Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Seu nome de usuário"
                className="w-full px-4 py-2.5 bg-tas-bg-page text-tas-text-on-card border-tas-accent/20 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary"
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
                className="w-full px-4 py-2.5 bg-tas-bg-page text-tas-text-on-card border-tas-accent/20 rounded-lg shadow-sm transition-colors focus:ring-tas-secondary focus:border-tas-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => toast.info('Funcionalidade de recuperação de senha em desenvolvimento.')}
                  className="text-sm text-tas-secondary hover:text-tas-secondary-hover underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2.5 rounded-lg text-tas-text-on-primary font-semibold transition-colors disabled:bg-tas-secondary/50 bg-tas-secondary hover:bg-tas-secondary-hover"
              disabled={isLoading}
            >
              {isLoading ? 'A Entrar...' : 'Entrar'}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}