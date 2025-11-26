// src/Components/layout/NavigationBar/NavigationBar.tsx
import { useState, type JSX, type KeyboardEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import TASLogo from '../../../assets/logo/NuvemConfig-2.svg';

// --- Ícones ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const ListChecksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19.13 19.13A10 10 0 1 1 4.87 4.87L12 12l7.13 7.13zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="m12 4-.34 2.04M12 20l.34-2.04M4 12l2.04.34M20 12l-2.04-.34M6.34 6.34 7.76 8.24M17.66 17.66l-1.41-1.9M6.34 17.66l1.41-1.9M17.66 6.34l-1.41 1.9"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-auto"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L10.94 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>;


// --- Interfaces para a Estrutura de Navegação ---
interface NavLinkSimple { type: 'link'; path: string; label: string; icon?: JSX.Element; id: string; }
interface DropdownSubItemLink { path: string; label: string; style: string; condition?: boolean; }
interface DropdownSubItemButton { action: () => void; label: string; style: string; condition?: boolean; }
interface DropdownItemGroupRow { type: 'row'; subItems: (DropdownSubItemLink | DropdownSubItemButton)[]; }
interface DropdownItemGroupFullWidthButton { type: 'fullwidth-button'; path?: string; action?: () => void; label: string; style: string; condition?: boolean; }
interface DropdownItemGroupSearch { type: 'search'; condition?: boolean; }
interface SubmenuItem { path: string; label: string; condition?: boolean; }
interface NavSubmenu { type: 'submenu'; label: string; items: SubmenuItem[]; condition?: boolean; }

type DropdownItemGroup = DropdownItemGroupRow | DropdownItemGroupFullWidthButton | DropdownItemGroupSearch | NavSubmenu;

interface NavDropdown { type: 'dropdown'; label: string; icon?: JSX.Element; id: string; items: DropdownItemGroup[]; }
type NavigationItemConfig = NavLinkSimple | NavDropdown;

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ticketIdFilter, setTicketIdFilter] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();

  const userRoles = auth.user?.roles || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');
  const isModerator = userRoles.includes('ROLE_MODERATOR');
  const canManageTickets = isAdmin || isModerator;
  const isCustomer = auth.isAuthenticated && !canManageTickets;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleTicketSearch = () => {
    if (ticketIdFilter.trim() && !isNaN(Number(ticketIdFilter))) {
      handleLinkClick();
      navigate(`/tickets/${ticketIdFilter}`);
      setTicketIdFilter('');
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTicketSearch();
    }
  };

  // Classes de estilo
  const navBgClass = 'bg-tas-primary';
  const navTextClass = 'text-tas-text-on-primary';
  const navHoverTextClass = 'hover:text-tas-accent';
  const mobileMenuBgClass = 'bg-tas-primary';
  const searchInputBgClass = 'bg-tas-primary-hover placeholder-gray-400 text-tas-text-on-primary focus:bg-tas-primary';
  const searchFocusRingClass = 'focus:ring-tas-accent focus:border-tas-accent';

  const dropdownButtonBase = `flex-1 text-xs py-1.5 px-2 rounded-md border transition-colors`;
  const dropdownButtonRowStyle = `${dropdownButtonBase} border-tas-accent text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent text-center`;
  const dropdownFullWidthButtonStyle = `block w-full text-center text-xs mt-2 py-1.5 px-2 rounded-md border border-tas-accent text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent transition-colors`;
  const submenuItemStyle = `block w-full text-left text-xs px-3 py-1.5 rounded-md text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent transition-colors`;

  const navItemBaseClasses = `px-3 py-2 rounded-md text-sm font-medium ${navHoverTextClass} transition-colors flex items-center ${navTextClass} cursor-pointer hover:bg-tas-primary-hover`;
  const mobileNavItemBaseClasses = `w-full text-left block px-4 py-3 text-base font-medium ${navHoverTextClass} transition-colors ${navTextClass} hover:bg-tas-primary-hover`;

  const adminModeratorNav: NavigationItemConfig[] = [
    { type: 'link', path: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, id: 'dashboard' },
    {
      type: 'dropdown',
      label: 'Chamados',
      icon: <ListChecksIcon />,
      id: 'chamados',
      items: [
        { type: 'search', condition: canManageTickets },
        {
          type: 'row', subItems: [
            { path: '/tickets/novo', label: '+ Novo', style: dropdownButtonRowStyle },
            { path: '/tickets/abertos', label: 'Abertos', style: dropdownButtonRowStyle },
          ]
        },
        { type: 'fullwidth-button', path: '/tickets/encerrar', label: 'Encerrar Chamado', style: dropdownFullWidthButtonStyle, condition: canManageTickets },
      ]
    },
    {
      type: 'dropdown',
      label: 'Configurações',
      icon: <CogIcon />,
      id: 'settings',
      items: [
        { type: 'fullwidth-button', path: '/configuracoes', label: 'Minhas Configurações', style: dropdownFullWidthButtonStyle },
        { type: 'fullwidth-button', path: '/admin/create-user', label: 'Criar Usuário', style: dropdownFullWidthButtonStyle, condition: isAdmin },
        {
          type: 'submenu',
          label: 'Empresas',
          condition: isModerator,
          items: [
            { path: '/companies/new', label: 'Adicionar Empresa' },
            { path: '/companies/add-user', label: 'Adicionar Usuários' },
            { path: '/companies', label: 'Empresas Cadastradas' },
            { path: '/company-users', label: 'Usuários Cadastrados' },
          ]
        },
      ]
    },
  ];

  const customerNav: NavigationItemConfig[] = [
    { type: 'link', path: '/tickets/novo', label: 'Criar Chamado', icon: <ListChecksIcon />, id: 'customer-new-ticket' },
    { type: 'link', path: '/tickets/abertos', label: 'Meus Chamados', icon: <HomeIcon />, id: 'customer-view-tickets' },
    { type: 'link', path: '/configuracoes', label: 'Minha Conta', icon: <CogIcon />, id: 'customer-account' }
  ];

  const navigationStructure = isCustomer ? customerNav : adminModeratorNav;
  const dropdownContainerClasses = `absolute right-0 md:left-0 top-full mt-0.5 w-64 rounded-md shadow-lg p-3 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-150 z-50`;

  return (
    <nav className={`w-full ${navBgClass} shadow-lg fixed left-0 right-0 top-0 z-50 font-['Poppins']`}>
      <style>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isCustomer ? "/tickets/abertos" : "/dashboard"} className="flex-shrink-0" onClick={handleLinkClick}>
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
            {navigationStructure.map((item) => {
              if (item.type === 'link') {
                return ( <Link key={item.id} to={item.path} className={navItemBaseClasses} aria-label={item.label} onClick={handleLinkClick}> {item.icon} <span className="ml-2 hidden xl:inline">{item.label}</span> </Link> );
              }
              if (item.type === 'dropdown') {
                return (
                  <div key={item.id} className="relative group">
                    <button className={`${navItemBaseClasses} cursor-default`}> {item.icon} <span className="ml-2 hidden xl:inline">{item.label}</span> <ChevronDownIcon /> </button>
                    <div className={dropdownContainerClasses}>
                      <div className="space-y-2" role="menu" aria-orientation="vertical">
                        {item.items.map((group, groupIndex) => {
                          if (group.type === 'search' && (group.condition === undefined || group.condition)) {
                            return (
                              <div key={`search-${item.id}-${groupIndex}`} className="relative flex items-center mb-1">
                                <input
                                  type="text"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  id={`${item.id}-filter-input`} value={ticketIdFilter}
                                  onChange={(e) => setTicketIdFilter(e.target.value)}
                                  onKeyDown={handleSearchKeyDown}
                                  placeholder="Pesquisar Chamado por ID..."
                                  className={`w-full text-xs ${searchInputBgClass} border border-tas-accent rounded-md py-1.5 pl-2 pr-8 focus:outline-none ${searchFocusRingClass} transition-colors`}
                                />
                                <button onClick={handleTicketSearch} className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-tas-accent">
                                  <SearchIcon />
                                </button>
                              </div>
                            );
                          }
                          if (group.type === 'row') {
                            return (
                              <div key={`group-${item.id}-${groupIndex}`} className="flex space-x-2">
                                {group.subItems.map(subItem => {
                                  if ('path' in subItem) {
                                      return (subItem.condition === undefined || subItem.condition) && <Link key={subItem.label} to={subItem.path} className={subItem.style} onClick={handleLinkClick}>{subItem.label}</Link>;
                                  }
                                  if ('action' in subItem) {
                                      return (subItem.condition === undefined || subItem.condition) && <button key={subItem.label} onClick={() => { if (subItem.action) subItem.action(); handleLinkClick(); }} className={subItem.style}>{subItem.label}</button>;
                                  }
                                  return null;
                                })}
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
                           if (group.type === 'submenu' && (group.condition === undefined || group.condition)) {
                            return (
                              <div key={`submenu-${item.id}-${groupIndex}`} className="relative group/submenu">
                                <button className={`${dropdownFullWidthButtonStyle} flex items-center justify-between`}>
                                  <span>{group.label}</span>
                                  <ChevronRightIcon />
                                </button>
                                <div className={`absolute top-0 mt-0 w-48 rounded-md shadow-lg p-2 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-150 z-10 ${item.id === 'settings' ? 'right-full' : 'left-full'}`}>
                                  <div className="space-y-1">
                                    {group.items.map(subItem => (
                                      (subItem.condition === undefined || subItem.condition) &&
                                      <Link key={subItem.label} to={subItem.path} className={submenuItemStyle} onClick={handleLinkClick}>
                                        {subItem.label}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
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
            {auth.isAuthenticated && ( <button onClick={handleLogout} className={navItemBaseClasses} aria-label="Sair"> <LogOutIcon /> <span className="ml-2 hidden xl:inline">Sair</span> </button> )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className={`${navTextClass} ${navHoverTextClass} p-2 rounded-md focus:outline-none hover:bg-tas-primary-hover`} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu-tas">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && ( <div className={`md:hidden absolute top-16 inset-x-0 ${mobileMenuBgClass} shadow-lg z-40 border-t border-tas-primary-hover`} >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationStructure.map(item => {
                if (item.type === 'link') {
                  return ( <Link key={`mobile-${item.id}`} to={item.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}> {item.label} </Link> );
                }
                if (item.type === 'dropdown') {
                  return (
                    <div key={`mobile-dropdown-${item.id}`} className="border-t border-tas-primary-hover mt-2 pt-2">
                      <p className={`px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1`}>{item.label}</p>
                      {item.items.map((group, groupIndex) => {
                        if (group.type === 'search') return null;
                        if (group.type === 'row') {
                          return group.subItems.map(subItem => (
                             (subItem.condition === undefined || subItem.condition) && 'path' in subItem && <Link key={`mobile-sub-${item.id}-${subItem.label}-${groupIndex}`} to={subItem.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}>{subItem.label}</Link>
                          ));
                        }
                        if (group.type === 'fullwidth-button') {
                          if (group.condition === undefined || group.condition) {
                            return <Link key={`mobile-sub-${item.id}-${group.label}-${groupIndex}`} to={group.path || '#'} className={mobileNavItemBaseClasses} onClick={handleLinkClick}>{group.label}</Link>;
                          }
                        }
                        if (group.type === 'submenu' && (group.condition === undefined || group.condition)) {
                          return (
                            <div key={`mobile-submenu-${item.id}-${groupIndex}`} className="mt-1">
                               <p className={`px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1`}>{group.label}</p>
                              {group.items.map(subItem => (
                                (subItem.condition === undefined || subItem.condition) &&
                                <Link key={`mobile-subitem-${item.id}-${subItem.label}`} to={subItem.path} className={`${mobileNavItemBaseClasses} pl-6`} onClick={handleLinkClick}>
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          );
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
      </div> )}
    </nav>
  );
};
