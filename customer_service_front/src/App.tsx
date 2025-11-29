import './index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { queryClient } from './lib/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { AppRouter } from './routes/app.routes'
import { ThemeProvider } from './contexts/ThemeContext';
//import { Footer } from './Components/footer';



//export const UserToken = createContext({} as TokenInStorageType)
 export function App() {
  return (
    <HelmetProvider>
      <Helmet  titleTemplate='%s | TAS' defaultTitle='Trust Assist System'/> 
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        <ThemeProvider>
          <AuthProvider>       
            <RouterProvider router={AppRouter} />                  
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>     
      
    </HelmetProvider>
  )    
}

