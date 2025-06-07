import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { ViewPFClientsPage } from "../pages/ViewClientsPage/ViewPFClientsPage";
import { ViewPJClientsPage } from "../pages/ViewClientsPage/ViewPJClientsPage";
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CreateTicketPage } from "../pages/TicketsPage/CreateTicketPage";
import { ViewOpenTicketsPage } from "../pages/TicketsPage/ViewOpenTicketsPage";
import { CloseTicketPage } from "../pages/TicketsPage/CloseTicketPage"; 
import { ViewResolvedTicketsPage } from "../pages/TicketsPage/ViewResolvedTicketsPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage"; // Importar a nova página

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage /> 
  },
  {
    path: '/signup', // Rota pública para a página de registo
    element: <SignUpPage />
  },
  { 
    path: '/',
    element: 
    <ProtectedRoute>
      <HomeLayout/>
    </ProtectedRoute>, 
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/clientes/pf', element: <ViewPFClientsPage /> }, 
      { path: '/clientes/pj', element: <ViewPJClientsPage /> }, 
      { path: '/about', element: <AboutUsPage /> },             
      { path: '/tickets/novo', element: <CreateTicketPage /> },
      { path: '/tickets/abertos', element: <ViewOpenTicketsPage /> },
      { path: '/tickets/encerrar', element: <CloseTicketPage /> }, 
      { path: '/tickets/resolvidos', element: <ViewResolvedTicketsPage /> },
      // Rota protegida para um admin criar novos utilizadores
      { path: '/admin/criar-utilizador', element: <SignUpPage /> }, 
    ]
  }
]);
