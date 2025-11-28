import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CreateTicketPage } from "../pages/TicketsPage/CreateTicketPage";
import { ViewOpenTicketsPage } from "../pages/TicketsPage/ViewOpenTicketsPage";
import { CloseTicketPage } from "../pages/TicketsPage/CloseTicketPage";
import { ViewResolvedTicketsPage } from "../pages/TicketsPage/ViewResolvedTicketsPage";
import { CreateUserPage } from "../pages/CreateUserPage/CreateUserPage";
import { ViewCompaniesPage } from "../pages/CompaniesPage/ViewCompaniesPage";
import { CreateCompanySimplePage } from "../pages/CompaniesPage/CreateCompanySimplePage";

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
      { path: '/about', element: <AboutUsPage /> },
      { path: '/tickets/novo', element: <CreateTicketPage /> },
      { path: '/tickets/abertos', element: <ViewOpenTicketsPage /> },
      { path: '/tickets/encerrar', element: <CloseTicketPage /> },
      { path: '/tickets/resolvidos', element: <ViewResolvedTicketsPage /> },
      { path: '/admin/criar-utilizador', element: <CreateUserPage /> },
    ]
  }
]);
