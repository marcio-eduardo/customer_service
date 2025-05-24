import React, { useState } from 'react';

// --- Ícones ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const ListChecksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19.13 19.13A10 10 0 1 1 4.87 4.87L12 12l7.13 7.13zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="m12 4-.34 2.04M12 20l.34-2.04M4 12l2.04.34M20 12l-2.04-.34M6.34 6.34 7.76 8.24M17.66 17.66l-1.41-1.9M6.34 17.66l1.41-1.9M17.66 6.34l-1.41 1.9"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;


interface NavigationBarProps {
  appName?: string;
  onNavigate: (sectionId: string) => void; 
  activeSection: string; 
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function NavigationBar({ 
  appName = "Trust Assist System", 
  onNavigate, 
  activeSection,
  isDarkMode,
  toggleDarkMode
}: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState(''); 

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false); 
  };
  
  const navBgClass = isDarkMode ? 'bg-slate-700' : 'bg-white';
  const navTextClass = isDarkMode ? 'text-slate-200' : 'text-gray-700';
  const navHoverBgClass = isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100';
  const navActiveBgClass = isDarkMode ? 'bg-slate-600' : 'bg-[#EAEAEA]';
  const navActiveTextClass = 'text-[#4A90E2]'; 
  const navHoverTextClass = 'hover:text-[#3AB54A]'; 
  const appNameTextClass = isDarkMode ? 'text-slate-100' : 'text-gray-700';
  const searchInputBgClass = isDarkMode ? 'bg-slate-600 placeholder-slate-400 text-slate-200 focus:bg-slate-500' : 'bg-gray-100 placeholder-gray-500 text-gray-900 focus:bg-white';
  const searchFocusRingClass = isDarkMode ? 'focus:ring-sky-500 focus:border-sky-500' : 'focus:ring-[#4A90E2] focus:border-[#4A90E2]';
  const mobileMenuBgClass = isDarkMode ? 'bg-slate-700' : 'bg-white';
  const dropdownItemTextClass = isDarkMode ? 'text-slate-200 hover:text-[#3AB54A]' : 'text-gray-700 hover:text-[#3AB54A]';


  const navItemClasses = (id: string, isDropdownParent = false) => {
    let classes = `px-3 py-2 rounded-md text-sm font-medium ${navHoverBgClass} ${navHoverTextClass} transition-colors flex items-center ${navTextClass}`;
    if (isDropdownParent) {
        // O botão "Clientes" fica ativo se a rota ativa começar com 'viewClients/' OU for 'addClient'
        if (activeSection.startsWith('viewClients/') || activeSection === 'addClient') {
            classes = `px-3 py-2 rounded-md text-sm font-medium ${navActiveBgClass} ${navActiveTextClass} transition-colors flex items-center`;
        }
    } else if (activeSection === id) { 
        classes = `px-3 py-2 rounded-md text-sm font-medium ${navActiveBgClass} ${navActiveTextClass} transition-colors flex items-center`;
    }
    return classes;
  }

  const mobileNavItemClasses = (id: string) => 
    `w-full text-left block px-4 py-3 text-base font-medium ${navHoverBgClass} ${navHoverTextClass} transition-colors ${navTextClass} ${activeSection === id ? `${navActiveBgClass} ${navActiveTextClass}` : ''}`;

  return (
    <nav className={`w-full ${navBgClass} shadow-md fixed left-0 right-0 top-0 z-50 font-['Poppins']`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-lg font-bold cursor-pointer"
               
            > <a href="/">
              <span className="text-white">T</span>
              <span className="text-[#3AB54A]">AS</span>
            </a>
            </div>
            <a 
              className={`ml-3 text-xl font-semibold ${appNameTextClass} hidden md:block cursor-pointer ${navHoverTextClass} transition-colors`}
              href="/quem-somos"
            >
              {appName}
            </a>
          </div>

          <div className="hidden md:flex flex-grow items-center justify-end space-x-1">
            <div className={`relative ${isDarkMode ? 'text-slate-400' : 'text-gray-400'} focus-within:${isDarkMode ? 'text-slate-200' : 'text-gray-600'} mr-4`}>
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

            <a href='/' className={navItemClasses('dashboard')} aria-label="Dashboard">
              <HomeIcon /> <span className="ml-2 hidden lg:inline">Dashboard</span>
            </a>
            
            {/* Dropdown Clientes Modificado */}
            <div className="relative group">
              <button 
                onClick={() => handleNavClick('viewClients/pf')} 
                className={navItemClasses('clientsDropdownParent', true)}
              > 
                <UsersIcon /> <span className="ml-2 hidden lg:inline">Clientes</span> <span className="ml-1 text-xs">▼</span>
              </button>
              <div 
                className={
                  `absolute 
                  right-0 
                  md:left-0 
                  top-full 
                  w-64
                  rounded-md 
                  shadow-lg 
                  p-3 
                  ${navBgClass} ring-1 
                  ${isDarkMode ? 'ring-slate-600' : 'ring-black'} ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 hidden group-hover:block`}>
                <div className="space-y-2" role="menu" aria-orientation="vertical">
                  <div>
                    <label htmlFor="client-filter-input" className={`block text-xs font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-500'} mb-1`}>Filtrar por nome/doc.</label>
                    <input 
                      type="text"
                      id="client-filter-input"
                      value={clientFilter}
                      onChange={(e) => setClientFilter(e.target.value)}
                      placeholder="..."
                      className={`w-full text-xs ${searchInputBgClass} border ${isDarkMode ? 'border-slate-500' : 'border-gray-300'} rounded-md py-1.5 px-2 focus:outline-none ${searchFocusRingClass} transition-colors`}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <a 
                      href="/clientes/pf" 
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md border ${isDarkMode ? 'border-slate-500 hover:bg-slate-500' : 'border-gray-300 hover:bg-gray-200'} ${dropdownItemTextClass} ${activeSection === 'viewClients/pf' ? `${navActiveBgClass} ${navActiveTextClass}`: ''}`}
                    >
                      Pessoa Física
                    </a>
                    <a 
                      href="/clientes/pj"
                      className={`flex-1 text-xs py-1.5 px-2 rounded-md border ${isDarkMode ? 'border-slate-500 hover:bg-slate-500' : 'border-gray-300 hover:bg-gray-200'} ${dropdownItemTextClass} ${activeSection === 'viewClients/pj' ? `${navActiveBgClass} ${navActiveTextClass}`: ''}`}
                    >
                      Pessoa Jurídica
                    </a>
                  </div>
                   <button 
                        onClick={() => handleNavClick('addClient')} 
                        className={`w-full text-xs mt-1 py-1.5 px-2 rounded-md border ${isDarkMode ? 'border-slate-500 hover:bg-slate-500' : 'border-gray-300 hover:bg-gray-200'} ${dropdownItemTextClass} ${activeSection === 'addClient' ? `${navActiveBgClass} ${navActiveTextClass}`: ''}`}
                    >
                        + Cadastrar Novo Cliente
                    </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleNavClick('createTicket')} 
              className={navItemClasses('createTicket')} 
              aria-label="Criar Chamado">
              <PlusCircleIcon /> <span className="ml-2 hidden lg:inline">Criar Chamado</span>
            </button>
            <button onClick={() => handleNavClick('manageTickets')} className={navItemClasses('manageTickets')} aria-label="Gerir Chamados">
              <ListChecksIcon /> <span className="ml-2 hidden lg:inline">Chamados</span>
            </button>
            <button onClick={() => handleNavClick('settings')} className={navItemClasses('settings')} aria-label="Configurações">
              <CogIcon />
            </button>
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${navHoverBgClass} ${navTextClass} ${navHoverTextClass}`}
              aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full ${navHoverBgClass} ${navTextClass} ${navHoverTextClass} mr-2`}
              aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
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
            <button onClick={() => handleNavClick('dashboard')} className={mobileNavItemClasses('dashboard')}>Dashboard</button>
            
            <div className="px-2 pt-2">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-500'} mb-1`}>Clientes</p>
                <button onClick={() => handleNavClick('viewClients/pf')} className={mobileNavItemClasses('viewClients/pf')}>Visualizar PF</button>
                <button onClick={() => handleNavClick('viewClients/pj')} className={mobileNavItemClasses('viewClients/pj')}>Visualizar PJ</button>
                <button onClick={() => handleNavClick('addClient')} className={mobileNavItemClasses('addClient')}>Cadastrar Cliente</button>
            </div>

            <button onClick={() => handleNavClick('createTicket')} className={mobileNavItemClasses('createTicket')}>Criar Chamado</button>
            <button onClick={() => handleNavClick('manageTickets')} className={mobileNavItemClasses('manageTickets')}>Chamados</button>
            <button onClick={() => handleNavClick('settings')} className={mobileNavItemClasses('settings')}>Configurações</button>
          </div>
        </div>
      )}
    </nav>
  );
};
