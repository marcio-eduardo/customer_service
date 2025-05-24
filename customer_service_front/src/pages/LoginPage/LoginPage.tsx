// Localização sugerida: src/pages/LoginPage/LoginPage.tsx
import React from 'react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  isDarkMode: boolean;
}

export function LoginPage({ onLoginSuccess, isDarkMode }: LoginPageProps) {
  // Classes de estilo condicionais baseadas no isDarkMode
  const pageBgClass = isDarkMode ? 'bg-slate-900' : 'bg-slate-200'; // Um cinza um pouco mais escuro para o fundo do login no modo escuro
  const cardBgClass = isDarkMode ? 'bg-slate-800' : 'bg-white';
  const titleTextClass = isDarkMode ? 'text-slate-100' : 'text-gray-800';
  const buttonBgClass = isDarkMode ? 'bg-sky-600 hover:bg-sky-700' : 'bg-[#4A90E2] hover:bg-[#3c7ddb]';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-['Poppins'] ${pageBgClass}`}>
      <div className={`p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md ${cardBgClass}`}>
        <div className="flex justify-center mb-6">
          {/* Logo TAS */}
          <div className="w-20 h-20 bg-[#4A90E2] rounded-full flex items-center justify-center text-3xl font-bold">
            <span className="text-white">T</span>
            <span className="text-[#3AB54A]">AS</span>
          </div>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 text-center ${titleTextClass}`}>
          Trust Assist System
        </h1>
        <p className={`text-center mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Faça login para continuar
        </p>
        
        {/* Formulário de Login (campos de exemplo) */}
        <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="seuemail@exemplo.com"
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors
                          ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                                       : 'border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]'}`}
              // Adicione value e onChange para controlar o input
            />
          </div>
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}
            >
              Senha
            </label>
            <input 
              type="password" 
              id="password" 
              name="password"
              placeholder="Sua senha"
              className={`w-full px-4 py-2.5 border rounded-lg shadow-sm transition-colors
                          ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200 focus:ring-sky-500 focus:border-sky-500' 
                                       : 'border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]'}`}
              // Adicione value e onChange para controlar o input
            />
            {/* Link "Esqueceu a senha?" (opcional) */}
            <div className="text-right mt-1">
              <a 
                href="#" 
                className={`text-sm ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-[#4A90E2] hover:text-[#3c7ddb]'}`}
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
          <button 
            type="submit"
            className={`w-full px-4 py-2.5 rounded-lg text-white font-semibold transition-colors ${buttonBgClass}`}
          >
            Entrar
          </button>
        </form>
        {/* Link para criar conta (opcional) */}
        <p className={`mt-6 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Não tem uma conta?{' '}
          <a href="#" className={`font-medium ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-[#3AB54A] hover:text-[#2f9e3c]'}`}>
            Crie uma agora
          </a>
        </p>
      </div>
    </div>
  );
}

// Se você for usar exportação padrão no seu projeto:
// export default LoginPage;
