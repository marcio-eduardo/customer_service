import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { ViewPFClientsPage } from "../pages/ViewClientsPage/ViewPFClientsPage";
import { ViewPJClientsPage } from "../pages/ViewClientsPage/ViewPJClientsPage";
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage isDarkMode={false} />
  },
  { 
    path: '/',
    element: 
    <ProtectedRoute>
      <HomeLayout/>
    </ProtectedRoute>, 
    children: [
      { 
        path: '/dashboard', 
        element:  
        
          <DashboardPage />
       
      },
      { path: '/clientes/pf', element: <ViewPFClientsPage isDarkMode={false} /> },
      { path: '/clientes/pj', element: <ViewPJClientsPage isDarkMode={false} /> },
      { path: '/about', element: <AboutUsPage isDarkMode={false} /> },
    ]
  }
]);