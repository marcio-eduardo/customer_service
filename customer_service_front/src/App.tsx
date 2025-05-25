import './index.css'
import { LoginPage } from './pages/LoginPage/LoginPage'

// import { QueryClientProvider } from '@tanstack/react-query'
// import { Helmet, HelmetProvider } from 'react-helmet-async';
// import { RouterProvider } from 'react-router-dom'
// import { Toaster } from 'sonner'
// //import { UserProvider } from './auth/signInPage'
// //import { Footer } from './components/footer'
// import { queryClient } from './lib/react-query';
// import { AuthProvider } from './contexts/AuthContext';
// import { AppRouter } from './routes/app.routes'
// import { Footer } from './Components/footer';



//export const UserToken = createContext({} as TokenInStorageType)
 export function App() {
  return (
    <LoginPage onLoginSuccess={function (): void {
      throw new Error('Function not implemented.')
    } } isDarkMode={false} />
    // <HelmetProvider>
    //   <Helmet  titleTemplate='%s | TAS'/> 
    //   <QueryClientProvider client={queryClient}>
    //     <Toaster richColors />
    //       <AuthProvider>       
    //         <RouterProvider router={AppRouter} />                  
    //       </AuthProvider>
    //   </QueryClientProvider>     
    //   <Footer />
    // </HelmetProvider>
  )    
}

