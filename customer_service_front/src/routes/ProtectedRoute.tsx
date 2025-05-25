// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Ajuste o caminho se necessário

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Enquanto verifica o estado de autenticação, pode mostrar um loader
    return <div>A carregar aplicação...</div>; 
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    // O 'replace' evita que a rota protegida entre no histórico de navegação
    return <Navigate to="/" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota protegida (ou o Outlet para rotas filhas)
  return <>{children}</>;
}