import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CreateTicketPage } from "../pages/TicketsPage/CreateTicketPage";
import { TicketsPage } from "../pages/TicketsPage/TicketsPage";
import { CloseTicketPage } from "../pages/TicketsPage/CloseTicketPage";
import { TicketDetailsPage } from "../pages/TicketsPage/TicketDetailsPage";
import { CreateUserPage } from "../pages/CreateUserPage/CreateUserPage";
import { ViewCompaniesPage } from "../pages/CompaniesPage/ViewCompaniesPage";
import { CreateCompanySimplePage } from "../pages/CompaniesPage/CreateCompanySimplePage";
import { ViewUsersPage } from "../pages/UsersPage/ViewUsersPage";

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />
  },

  {
    path: '/',
    element:
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/companies/view', element: <ViewCompaniesPage /> },
      { path: '/companies/create', element: <CreateCompanySimplePage /> },
      { path: '/users/view', element: <ViewUsersPage /> },
      { path: '/about', element: <AboutUsPage /> },
      { path: '/tickets/novo', element: <CreateTicketPage /> },
      { path: '/tickets', element: <TicketsPage /> },
      { path: '/tickets/:id', element: <TicketDetailsPage /> },
      { path: '/tickets/:id/encerrar', element: <CloseTicketPage /> },
      { path: '/tickets/encerrar', element: <CloseTicketPage /> }, // Rota estática para o menu
      { path: '/admin/criar-utilizador', element: <CreateUserPage /> },
    ]
  }
]);
