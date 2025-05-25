// src/Components/layout/NavigationBar/NavigationBar.tsx
import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar Link e useNavigate
import { useAuth } from '../../../contexts/AuthContext'; // Ajuste o caminho se necessário
import TASLogo from '../../../assets/logo/TAS-logo.svg';
import TrustAssisSystem from '../../../assets/logo/TrustAssistSystem.svg';
// --- Ícones ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const ListChecksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19.13 19.13A10 10 0 1 1 4.87 4.87L12 12l7.13 7.13zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="m12 4-.34 2.04M12 20l.34-2.04M4 12l2.04.34M20 12l-2.04-.34M6.34 6.34 7.76 8.24M17.66 17.66l-1.41-1.9M6.34 17.66l1.41-1.9M17.66 6.34l-1.41 1.9"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;


interface NavigationBarProps {
  appName?: string;
  // onNavigate e activeSection podem ser simplificadas ou removidas se usarmos Link e useLocation
  // onNavigate: (sectionId: string) => void; 
  // activeSection: string; 
}

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState(''); 
  const auth = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };
  
  // Classes de estilo fixas para o modo claro (removida lógica de isDarkMode)
  const navBgClass = 'bg-white';
  const navTextClass = 'text-gray-700';
  const navHoverBgClass = 'hover:bg-gray-100';
  const navHoverTextClass = 'hover:text-[#3AB54A]'; 

  const searchInputBgClass = 'bg-gray-100 placeholder-gray-500 text-gray-900 focus:bg-white';
  const searchFocusRingClass = 'focus:ring-[#4A90E2] focus:border-[#4A90E2]';
  const mobileMenuBgClass = 'bg-white';
  const dropdownItemTextClass = 'text-gray-700 hover:text-[#3AB54A]';

  // Para determinar a seção ativa, podemos usar useLocation do react-router-dom
  // Esta lógica pode ser mais complexa dependendo de como você define "ativo"
  // Por simplicidade, não vou implementar o realce dinâmico aqui, focando na remoção do dark mode.
  // A prop 'activeSection' foi removida, o que simplifica 'navItemClasses'.
  // Você pode reintroduzir 'activeSection' e 'onNavigate' se a sua lógica de navegação/realce precisar delas.

  const navItemBaseClasses = `px-3 py-2 rounded-md text-sm font-medium ${navHoverBgClass} ${navHoverTextClass} transition-colors flex items-center ${navTextClass}`;
  const mobileNavItemBaseClasses = `w-full text-left block px-4 py-3 text-base font-medium ${navHoverBgClass} ${navHoverTextClass} transition-colors ${navTextClass}`;


  // Navegação usando Link do react-router-dom
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, id: 'dashboard' },
    // O dropdown de clientes é tratado separadamente abaixo
    { path: '/tickets/novo', label: 'Criar Chamado', icon: <PlusCircleIcon />, id: 'createTicket' }, // Exemplo de rota
    { path: '/tickets', label: 'Chamados', icon: <ListChecksIcon />, id: 'manageTickets' }, // Exemplo de rota
    { path: '/configuracoes', label: 'Configurações', icon: <CogIcon />, id: 'settings' }, // Exemplo de rota
  ];

  return (
    <nav className={`w-full ${navBgClass} shadow-md fixed left-0 right-0 top-0 z-50 font-['Poppins']`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-lg font-bold cursor-pointer">
              <img src={TASLogo} alt="" />
            </Link>
            <Link 
              to="/about" // Exemplo de link para "Quem Somos"
              className={`ml-3 text-xl font-semibold hidden md:block cursor-pointer  transition-colors`}
            >
              <img src={TrustAssisSystem} alt="Trust Assist System" className="h-8" />
            </Link>
          </div>

          <div className="hidden md:flex flex-grow items-center justify-end space-x-1">
            <div className={`relative text-gray-400 focus-within:text-gray-600 mr-4`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  id="search-navbar"
                  name="search"
                  className={`block w-full md:w-64 ${searchInputBgClass} border border-transparent rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none ${searchFocusRingClass} sm:text-sm transition-colors`}
                  placeholder="Pesquisar..."
                  type="search"
                />
            </div>

            {navLinks.map(link => (
              <Link key={link.id} to={link.path} className={navItemBaseClasses} aria-label={link.label}>
                {link.icon} <span className="ml-2 hidden lg:inline">{link.label}</span>
              </Link>
            ))}
            
            {/* Dropdown Clientes */}
            <div className="relative group">
              <button className={`${navItemBaseClasses} cursor-default`}> 
                <UsersIcon /> <span className="ml-2 hidden lg:inline">Clientes</span> <span className="ml-1 text-xs">▼</span>
              </button>
              <div className={`absolute right-0 md:left-0 top-full w-64 rounded-md shadow-lg p-3 ${navBgClass} ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 hidden group-hover:block`}>
                <div className="space-y-2" role="menu" aria-orientation="vertical">
                  <div>
                    <label htmlFor="client-filter-input" className={`block text-xs font-medium text-gray-500 mb-1`}>Filtrar por nome/doc.</label>
                    <input 
                      type="text"
                      id="client-filter-input"
                      value={clientFilter}
                      onChange={(e) => setClientFilter(e.target.value)}
                      placeholder="..."
                      className={`w-full text-xs ${searchInputBgClass} border border-gray-300 rounded-md py-1.5 px-2 focus:outline-none ${searchFocusRingClass} transition-colors`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to="/clientes/pf" 
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md border border-gray-300 hover:bg-gray-200 ${dropdownItemTextClass}`}
                      onClick={() => setIsMobileMenuOpen(false)} // Fechar menu mobile ao clicar
                    >
                      Pessoa Física
                    </Link>
                    <Link 
                      to="/clientes/pj"
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md border border-gray-300 hover:bg-gray-200 ${dropdownItemTextClass}`}
                      onClick={() => setIsMobileMenuOpen(false)} // Fechar menu mobile ao clicar
                    >
                      Pessoa Jurídica
                    </Link>
                  </div>
                   <button 
                        onClick={() => { navigate('/clientes/novo'); setIsMobileMenuOpen(false); }} // Exemplo de rota para cadastrar
                        className={`w-full text-xs mt-1 py-1.5 px-2 rounded-md border border-gray-300 hover:bg-gray-200 ${dropdownItemTextClass}`}
                    >
                        + Cadastrar Novo Cliente
                    </button>
                </div>
              </div>
            </div>

            {/* Botão de Logout */}
            {auth.isAuthenticated && (
              <button 
                onClick={handleLogout} 
                className={navItemBaseClasses}
                aria-label="Sair">
                <LogOutIcon /> <span className="ml-2 hidden lg:inline">Sair</span>
              </button>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu} 
              className={`${navTextClass} ${navHoverTextClass} p-2 rounded-md focus:outline-none`}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-tas"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-16 inset-x-0 ${mobileMenuBgClass} shadow-lg z-40`} id="mobile-menu-tas">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-2 pb-2">
                <div className={`relative text-gray-400 focus-within:text-gray-600`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon />
                    </div>
                    <input
                      id="search-mobile-navbar"
                      name="search-mobile"
                      className={`block w-full ${searchInputBgClass} border border-transparent rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none ${searchFocusRingClass} sm:text-sm transition-colors`}
                      placeholder="Pesquisar..."
                      type="search"
                    />
                </div>
            </div>

            {navLinks.map(link => (
              <Link key={`mobile-${link.id}`} to={link.path} className={mobileNavItemBaseClasses} onClick={toggleMobileMenu}>
                {link.label}
              </Link>
            ))}
            
            <div className="px-2 pt-2">
                <p className={`text-sm font-medium text-gray-500 mb-1`}>Clientes</p>
                <Link to="/clients/pf" className={mobileNavItemBaseClasses} onClick={toggleMobileMenu}>Visualizar PF</Link>
                <Link to="/clients/pj" className={mobileNavItemBaseClasses} onClick={toggleMobileMenu}>Visualizar PJ</Link>
                <button onClick={() => { navigate('/clientes/novo'); toggleMobileMenu(); }} className={mobileNavItemBaseClasses}>Cadastrar Cliente</button>
            </div>

            {/* Botão de Logout no Menu Mobile */}
            {auth.isAuthenticated && (
              <button onClick={handleLogout} className={mobileNavItemBaseClasses}>
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};