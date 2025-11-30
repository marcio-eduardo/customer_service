import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'original' | 'techBlue' | 'forest' | 'purple' | 'warm' | 'minimal';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Tenta obter o tema do localStorage, ou usa 'original' como padrão
    return (localStorage.getItem('tas-theme') as Theme) || 'original';
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Limpa temas antigos para garantir que apenas um esteja ativo
    root.removeAttribute('data-theme');

    // Adiciona o novo atributo de tema, exceto para o tema original que é o padrão
    if (theme !== 'original') {
      root.setAttribute('data-theme', theme);
    }

    // Salva a preferência do tema no localStorage
    localStorage.setItem('tas-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
