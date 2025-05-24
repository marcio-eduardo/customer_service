import { HomeLayout } from "../Components/layout/Layouts/HomeLayout";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { createBrowserRouter } from 'react-router-dom';
import { ViewPFClientsPage } from "../pages/ViewClientsPage/ViewPFClientsPage";
import { ViewPJClientsPage } from "../pages/ViewClientsPage/ViewPJClientsPage";
import { AboutUsPage } from "../pages/AboutUsPage/AboutUsPage";

export const AppRouter = createBrowserRouter([
  
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: '/', element: <DashboardPage /> },
      //{ path: 'not-logged', element: <NotLoggedInPage />}
    ]
  },
  { 
    path: '/',
    element: <HomeLayout/>, 
    children: [
      { path: "/quem-somos",
      element: <AboutUsPage isDarkMode={true} /> }
    ]
  },
  { 
    path: '/',
    element: <HomeLayout />,
    children: [
      { path: "/clientes/pf",
      element: <ViewPFClientsPage isDarkMode={true} /> }
    ]
  },
  { 
    path: '/',
    element: <HomeLayout />, 
    children: [
      { path: "/clientes/pj",
      element: <ViewPJClientsPage isDarkMode={true} /> }
    ]
  }
]);