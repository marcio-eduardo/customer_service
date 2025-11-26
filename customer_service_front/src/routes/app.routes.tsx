import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { ViewCompaniesPage } from "../pages/ViewClientsPage/ViewCompaniesPage";
import { ViewCompanyUsersPage } from "../pages/ViewClientsPage/ViewCompanyUsersPage";
import { AddUserToCompanyPage } from "../pages/CompaniesPage/AddUserToCompanyPage";
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CreateTicketPage } from "../pages/TicketsPage/CreateTicketPage";
import { ViewOpenTicketsPage } from "../pages/TicketsPage/ViewOpenTicketsPage";
import { CloseTicketPage } from "../pages/TicketsPage/CloseTicketPage"; 
import { ViewResolvedTicketsPage } from "../pages/TicketsPage/ViewResolvedTicketsPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage /> 
  },
  {
    path: '/signup',
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
      { path: '/companies', element: <ViewCompaniesPage /> },
      { path: '/company-users', element: <ViewCompanyUsersPage /> },
      { path: '/companies/:id/add-user', element: <AddUserToCompanyPage /> },
      { path: '/about', element: <AboutUsPage /> },             
      { path: '/tickets/novo', element: <CreateTicketPage /> },
      { path: '/tickets/abertos', element: <ViewOpenTicketsPage /> },
      { path: '/tickets/encerrar', element: <CloseTicketPage /> }, 
      { path: '/tickets/resolvidos', element: <ViewResolvedTicketsPage /> },
      { path: '/admin/criar-utilizador', element: <SignUpPage /> }, 
    ]
  }
]);
