// Localização sugerida: src/contexts/AuthContext.tsx
// ou src/auth/UserProvider.tsx (se preferir o nome UserProvider)

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Dentro de src/contexts/AuthContext.tsx
interface User {
  id: number; // Backend envia Long, que é number em TS
  username: string; // O backend envia 'username'
  firstName?: string;
  lastName?: string;
  email: string;
  roles?: string[]; // Adicionar para guardar os papéis do utilizador
}

// Interface para o valor do contexto de autenticação
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token?: string) => void; // userData pode ser o objeto do usuário, token opcional
  logout: () => void;
  isLoading: boolean; // Para lidar com a verificação inicial de autenticação
}

// Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Alterado para usar export function
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Inicia como true para verificar o estado inicial

  useEffect(() => {
    // Simula a verificação de um token de autenticação no localStorage ao carregar a app
    const token = localStorage.getItem('tas-auth-token');
    const userDataString = localStorage.getItem('tas-user-data');

    if (token && userDataString) {
      try {
        const parsedUser = JSON.parse(userDataString);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao parsear dados do usuário do localStorage", error);
        // Limpa dados inválidos se houver erro
        localStorage.removeItem('tas-auth-token');
        localStorage.removeItem('tas-user-data');
      }
    }
    setIsLoading(false); // Finaliza o carregamento após verificar o estado inicial
  }, []);

  const login = (userData: User, token?: string) => {
    // Simulação de login bem-sucedido
    setIsAuthenticated(true);
    setUser(userData);
    if (token) {
      localStorage.setItem('tas-auth-token', token); // Simula guardar o token
    }
    localStorage.setItem('tas-user-data', JSON.stringify(userData)); // Guarda dados do usuário
    console.log("Usuário logado:", userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('tas-auth-token'); // Remove o token
    localStorage.removeItem('tas-user-data'); // Remove dados do usuário
    console.log("Usuário deslogado");
    // Aqui você também pode querer redirecionar para a página de login.
    // O redirecionamento geralmente é tratado pelo sistema de rotas.
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}; // A tipagem React.FC foi removida pois não é estritamente necessária com export function e props tipadas diretamente

// Hook customizado para usar o AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
