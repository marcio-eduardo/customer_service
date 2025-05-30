// src/Components/layout/NavigationBar/NavigationBar.tsx
import { useState, useEffect, useRef, type Dispatch, type SetStateAction, type JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; 
import TASLogo from '../../../assets/logo/NuvemConfig-2.svg'; 

// --- Icons ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ListChecksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19.13 19.13A10 10 0 1 1 4.87 4.87L12 12l7.13 7.13zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="m12 4-.34 2.04M12 20l.34-2.04M4 12l2.04.34M20 12l-2.04-.34M6.34 6.34 7.76 8.24M17.66 17.66l-1.41-1.9M6.34 17.66l1.41-1.9M17.66 6.34l-1.41 1.9"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

// --- Navigation Structure Interfaces ---
interface NavLinkSimple {
  type: 'link';
  path: string;
  label: string;
  icon?: JSX.Element;
  id: string;
}

interface DropdownSubItemLink {
  path: string;
  label: string;
  style: string;
}

interface DropdownSubItemButton {
  action: () => void;
  label: string;
  style: string;
  condition?: boolean;
}

interface DropdownItemGroupRow {
  type: 'row';
  subItems: DropdownSubItemLink[];
}

interface DropdownItemGroupFullWidthButton {
  type: 'fullwidth-button';
  path?: string; 
  action?: () => void;
  label: string;
  style: string;
  condition?: boolean;
}

type DropdownItemGroup = DropdownItemGroupRow | DropdownItemGroupFullWidthButton;

interface NavDropdown {
  type: 'dropdown';
  label: string;
  icon?: JSX.Element;
  id: string;
  filterState?: string;
  setFilterState?: Dispatch<SetStateAction<string>>;
  filterPlaceholder?: string;
  filterLabel?: string;
  items: DropdownItemGroup[];
}

type NavigationItemConfig = NavLinkSimple | NavDropdown;


export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState('');
  const [ticketFilter, setTicketFilter] = useState('');
  
  const auth = useAuth();
  const navigate = useNavigate();

  const userRoles = auth.user?.roles || [];
  const canManageTickets = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  
  // Style classes based on "Confiança Moderna (Light) Final" palette
  const navBgClass = 'bg-tas-primary'; 
  const navTextClass = 'text-tas-text-on-primary'; 
  const navHoverTextClass = 'hover:text-tas-accent'; 
  
  const searchInputBgClass = 'bg-tas-primary-hover placeholder-gray-400 text-tas-text-on-primary focus:bg-tas-primary'; 
  const searchFocusRingClass = 'focus:ring-tas-accent focus:border-tas-accent'; 

  const mobileMenuBgClass = 'bg-tas-primary'; 
  
  const dropdownButtonBase = `flex-1 text-xs py-1.5 px-2 rounded-md border transition-colors`;
  const dropdownButtonRowStyle = `${dropdownButtonBase} border-tas-accent text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent text-center`;
  const dropdownFullWidthButtonStyle = `block w-full text-center text-xs mt-2 py-1.5 px-2 rounded-md border border-tas-accent text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent transition-colors`;

  const navItemBaseClasses = `px-3 py-2 rounded-md text-sm font-medium ${navHoverTextClass} transition-colors flex items-center ${navTextClass} cursor-pointer hover:bg-tas-primary-hover`;
  const mobileNavItemBaseClasses = `w-full text-left block px-4 py-3 text-base font-medium ${navHoverTextClass} transition-colors ${navTextClass} hover:bg-tas-primary-hover`;

  const navigationStructure: NavigationItemConfig[] = [
    { type: 'link', path: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, id: 'dashboard' },
    { 
      type: 'dropdown', 
      label: 'Chamados', 
      icon: <ListChecksIcon />, 
      id: 'chamados',
      filterState: ticketFilter,
      setFilterState: setTicketFilter,
      filterPlaceholder: "ID, título...",
      filterLabel: "Filtrar Chamados",
      items: [
        { type: 'row', subItems: [
            { path: '/tickets/novo', label: '+ Novo', style: dropdownButtonRowStyle },
            { path: '/tickets/abertos', label: 'Abertos', style: dropdownButtonRowStyle },
          ]
        },
        // UPDATED: Changed path to /tickets/encerrar
        { type: 'fullwidth-button', path: '/tickets/encerrar', label: 'Encerrar Chamado', style: dropdownFullWidthButtonStyle, condition: canManageTickets },
      ]
    },
    { 
      type: 'dropdown', 
      label: 'Clientes', 
      icon: <UsersIcon />, 
      id: 'clientes',
      filterState: clientFilter,
      setFilterState: setClientFilter,
      filterPlaceholder: "Nome/Documento...", 
      filterLabel: "Filtrar por nome/doc.",
      items: [
        { type: 'row', subItems: [
            { path: '/clientes/pf', label: 'Pessoa Física', style: dropdownButtonRowStyle },
            { path: '/clientes/pj', label: 'Pessoa Jurídica', style: dropdownButtonRowStyle },
          ] 
        },
        { type: 'fullwidth-button', action: () => { navigate('/clientes/novo'); handleLinkClick(); }, label: '+ Cadastrar Novo Cliente', style: dropdownFullWidthButtonStyle },
      ]
    },
    { type: 'link', path: '/configuracoes', label: 'Configurações', icon: <CogIcon />, id: 'settings' },
  ];

  const dropdownContainerClasses = `absolute right-0 md:left-0 top-full mt-0.5 w-64 rounded-md shadow-lg p-3 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-150 z-50`;

  return (
    <nav className={`w-full ${navBgClass} shadow-lg fixed left-0 right-0 top-0 z-50 font-['Poppins']`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0" onClick={handleLinkClick}>
              <img src={TASLogo} alt="TAS Logo" className="h-10 w-auto" />
            </Link>
            <Link 
              to="/about" 
              className={`ml-3 text-xl font-semibold hidden md:flex items-center ${navTextClass} ${navHoverTextClass}`} 
              onClick={handleLinkClick}
            >
              <h2 className="hidden lg:block">Trust Assist System</h2> 
              <span className="hidden md:block lg:hidden">TAS</span>   
            </Link>
          </div>

          <div className="hidden md:flex flex-grow items-center justify-end space-x-1">
            <div className={`relative text-gray-400 focus-within:text-tas-accent mr-4`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon /> </div>
              <input id="search-navbar" name="search"
                className={`block w-full md:w-64 ${searchInputBgClass} border border-transparent rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none ${searchFocusRingClass} sm:text-sm transition-colors`}
                placeholder="Pesquisar globalmente..." type="search" />
            </div>

            {navigationStructure.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link key={item.id} to={item.path} className={navItemBaseClasses} aria-label={item.label} onClick={handleLinkClick}>
                    {item.icon} 
                    <span className="ml-2 hidden 2xl:inline">{item.label}</span>
                  </Link>
                );
              }
              if (item.type === 'dropdown') {
                return (
                  <div key={item.id} className="relative group">
                    <button className={`${navItemBaseClasses} cursor-default`}>
                      {item.icon} 
                      <span className="ml-2 hidden 2xl:inline">{item.label}</span> <ChevronDownIcon />
                    </button>
                    <div className={dropdownContainerClasses}>
                      <div className="space-y-2" role="menu" aria-orientation="vertical">
                        {item.filterLabel && item.setFilterState && (
                          <div>
                            <label htmlFor={`${item.id}-filter-input`} className={`block text-xs font-medium text-gray-400 mb-1`}> 
                              {item.filterLabel}
                            </label>
                            <input 
                              type="text" id={`${item.id}-filter-input`} value={item.filterState}
                              onChange={(e) => item.setFilterState!(e.target.value)}
                              placeholder={item.filterPlaceholder || "..."}
                              className={`w-full text-xs ${searchInputBgClass} border border-tas-accent rounded-md py-1.5 px-2 focus:outline-none ${searchFocusRingClass} transition-colors`}
                            />
                          </div>
                        )}
                        {item.items.map((group, groupIndex) => {
                          if (group.type === 'row') {
                            return (
                              <div key={`group-${item.id}-${groupIndex}`} className="flex space-x-2">
                                {group.subItems.map(subItem => (
                                  <Link key={subItem.label} to={subItem.path} className={subItem.style} onClick={handleLinkClick}>
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            );
                          }
                          if (group.type === 'fullwidth-button') {
                            if (group.condition === undefined || group.condition) {
                              return group.path ? (
                                <Link key={group.label} to={group.path} className={group.style} onClick={handleLinkClick}>
                                  {group.label}
                                </Link>
                              ) : (
                                <button key={group.label} onClick={() => { if (group.action) group.action(); handleLinkClick(); }} className={group.style}>
                                  {group.label}
                                </button>
                              );
                            }
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {auth.isAuthenticated && (
              <button onClick={handleLogout} className={navItemBaseClasses} aria-label="Sair">
                <LogOutIcon /> 
                <span className="ml-2 hidden 2xl:inline">Sair</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className={`${navTextClass} ${navHoverTextClass} p-2 rounded-md focus:outline-none hover:bg-tas-primary-hover`} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu-tas">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
         <div className={`md:hidden absolute top-16 inset-x-0 ${mobileMenuBgClass} shadow-lg z-40 border-t border-tas-primary-hover`} >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="px-2 pb-2">
                <div className={`relative text-gray-400 focus-within:text-tas-accent`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <SearchIcon /> </div>
                    <input id="search-mobile-navbar" name="search-mobile"
                      className={`block w-full ${searchInputBgClass} border border-transparent rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none ${searchFocusRingClass} sm:text-sm transition-colors`}
                      placeholder="Pesquisar..." type="search" />
                </div>
              </div>

              {navigationStructure.map(item => {
                if (item.type === 'link') {
                  return ( <Link key={`mobile-${item.id}`} to={item.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}> {item.label} </Link> );
                }
                if (item.type === 'dropdown') {
                  return (
                    <div key={`mobile-dropdown-${item.id}`} className="border-t border-tas-primary-hover mt-2 pt-2">
                      <p className={`px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1`}>{item.label}</p> 
                      {item.items.map((group, groupIndex) => {
                        if (group.type === 'row') {
                          return group.subItems.map(subItem => (
                            <Link key={`mobile-sub-${item.id}-${subItem.label}-${groupIndex}`} to={subItem.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}>
                              {subItem.label}
                            </Link>
                          ));
                        }
                        if (group.type === 'fullwidth-button') {
                          if (group.condition === undefined || group.condition) {
                            return group.path ? (
                              <Link key={`mobile-sub-${item.id}-${group.label}-${groupIndex}`} to={group.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}>
                                {group.label}
                              </Link>
                            ) : (
                              <button key={`mobile-sub-${item.id}-${group.label}-${groupIndex}`} 
                                onClick={() => { if(group.action) group.action(); handleLinkClick(); }} 
                                className={mobileNavItemBaseClasses}
                              >
                                {group.label}
                              </button>
                            );
                          }
                        }
                        return null;
                      })}
                    </div>
                  );
                }
                return null;
              })}

              {auth.isAuthenticated && (
                <div className="border-t border-tas-primary-hover mt-2 pt-2">
                  <button onClick={handleLogout} className={mobileNavItemBaseClasses}> Sair </button>
                </div>
              )}
            </div>
         </div>
      )}
    </nav>
  );
};
