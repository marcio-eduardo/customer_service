import { useState, type JSX, type KeyboardEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext'; // Importar useTheme
import TASLogo from '../../../assets/logo/NuvemConfig-Wite.svg';

// --- Ícones ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

const ListChecksIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19.13 19.13A10 10 0 1 1 4.87 4.87L12 12l7.13 7.13zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="m12 4-.34 2.04M12 20l.34-2.04M4 12l2.04.34M20 12l-2.04-.34M6.34 6.34 7.76 8.24M17.66 17.66l-1.41-1.9M6.34 17.66l1.41-1.9M17.66 6.34l-1.41 1.9"></path></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className || ''}`}><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

// --- Interfaces para a Estrutura de Navegação ---
interface NavLinkSimple { type: 'link'; path: string; label: string; icon?: JSX.Element; id: string; condition?: boolean; }
interface DropdownSubItemLink { path: string; label: string; style: string; condition?: boolean; }
// Nova interface para botões de tema
interface DropdownThemeItem { label: string; theme: 'original' | 'techBlue' | 'forest' | 'purple' | 'warm' | 'minimal'; style: string; }
interface DropdownItemGroupRow { type: 'row'; subItems: (DropdownSubItemLink | DropdownThemeItem)[]; condition?: boolean; }
interface DropdownItemGroupFullWidthLink { type: 'fullwidth-link'; path: string; label: string; style: string; condition?: boolean; }
interface DropdownItemGroupSearch { type: 'search'; condition?: boolean; }
interface DropdownSubMenu { type: 'submenu'; label: string; items: DropdownItemGroup[]; condition?: boolean; }

type DropdownItemGroup = DropdownItemGroupRow | DropdownItemGroupFullWidthLink | DropdownItemGroupSearch | DropdownSubMenu;

interface NavDropdown { type: 'dropdown'; label: string; icon?: JSX.Element; id: string; items: DropdownItemGroup[]; condition?: boolean; align?: 'left' | 'right'; }
type NavigationItemConfig = NavLinkSimple | NavDropdown;

// Componente para Submenu Colapsável
const DropdownSubMenuComponent = ({ label, items, renderItems }: { label: string, items: DropdownItemGroup[], renderItems: (items: DropdownItemGroup[]) => JSX.Element[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-1 first:mt-0 border-b border-tas-accent/10 last:border-0">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
        className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-tas-text-on-primary hover:text-tas-secondary uppercase tracking-wider transition-colors"
      >
        <span>{label}</span>
        <ChevronDownIcon className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`pl-0 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
        {renderItems(items)}
      </div>
    </div>
  );
};

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ticketIdFilter, setTicketIdFilter] = useState('');

  const auth = useAuth();
  const navigate = useNavigate();
  const { setTheme } = useTheme();

  const userRoles = auth.user?.roles || [];
  const isModerator = userRoles.includes('ROLE_MODERATOR');
  const isTechUser = userRoles.includes('ROLE_TECH_USER');
  const isCompanyUser = userRoles.includes('ROLE_COMPANY_USER');


  // const _canManageTickets = isTechUser || isModerator;
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

  const handleThemeChange = (theme: 'original' | 'techBlue' | 'forest' | 'purple' | 'warm' | 'minimal') => {
    setTheme(theme);
    handleLinkClick();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTicketSearch();
    }
  };

  // Classes de estilo
  const navBgClass = 'bg-tas-primary';
  const navTextClass = 'text-tas-text-on-primary';
  const navHoverTextClass = 'hover:text-tas-secondary';
  const mobileMenuBgClass = 'bg-tas-primary';
  const searchInputBgClass = 'bg-tas-text-secondary placeholder-gray-300 text-tas-text-on-card focus:bg-tas-text-secondary';
  const searchFocusRingClass = 'focus:ring-2 focus:ring-tas-secondary focus:border-tas-secondary';

  const dropdownButtonBase = `flex-1 text-xs py-1.5 px-2 rounded-md transition-colors`;
  const dropdownButtonRowStyle = `${dropdownButtonBase} text-tas-text-on-primary hover:text-tas-secondary text-left`;
  const dropdownFullWidthLinkStyle = `block w-full text-left text-xs py-1.5 px-2 rounded-md text-tas-text-on-primary hover:text-tas-secondary transition-colors`;

  // Função para gerar classes de Link (sem estado ativo fixo)
  const getNavLinkClass = () => {
    const baseClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center cursor-pointer`;
    const inactiveClasses = `${navTextClass} ${navHoverTextClass}`;

    return `${baseClasses} ${inactiveClasses}`;
  };

  const navItemBaseClasses = `px-3 py-2 rounded-md text-sm font-medium ${navHoverTextClass} transition-colors flex items-center ${navTextClass} cursor-pointer`;
  const mobileNavItemBaseClasses = `w-full text-left block px-4 py-3 text-base font-medium ${navHoverTextClass} transition-colors ${navTextClass}`;

  const themes: DropdownThemeItem[] = [
    { label: 'Padrão', theme: 'original', style: dropdownButtonRowStyle },
    { label: 'Tech Blue', theme: 'techBlue', style: dropdownButtonRowStyle },
    { label: 'Forest', theme: 'forest', style: dropdownButtonRowStyle },
    { label: 'Purple', theme: 'purple', style: dropdownButtonRowStyle },
    { label: 'Warm', theme: 'warm', style: dropdownButtonRowStyle },
    { label: 'Minimal', theme: 'minimal', style: dropdownButtonRowStyle },
  ];

  const navigationStructure: NavigationItemConfig[] = ([
    { type: 'link', path: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, id: 'dashboard', condition: isModerator || isTechUser },
    {
      type: 'dropdown',
      label: 'Chamados',
      icon: <ListChecksIcon />,
      id: 'chamados',
      condition: isModerator || isTechUser || isCompanyUser,
      items: [
        { type: 'search', condition: isModerator || isTechUser },
        { type: 'fullwidth-link', path: '/tickets/novo', label: '+ Novo Chamado', style: dropdownFullWidthLinkStyle, condition: isModerator || isCompanyUser },
        { type: 'fullwidth-link', path: '/tickets', label: 'Listar Chamados', style: dropdownFullWidthLinkStyle, condition: true },
      ]
    },
    {
      type: 'dropdown',
      label: 'Configurações',
      icon: <CogIcon />,
      id: 'settings',
      condition: true, // Todos podem ver Configurações para mudar o tema
      align: 'right', // Alinhamento à direita
      items: [
        {
          type: 'submenu',
          label: 'Empresas',
          condition: isModerator || isTechUser,
          items: [
            { type: 'fullwidth-link', path: '/companies/view', label: 'Listar Empresas', style: dropdownFullWidthLinkStyle, condition: true },
            { type: 'fullwidth-link', path: '/companies/create', label: 'Adicionar Empresas', style: dropdownFullWidthLinkStyle, condition: isModerator },
          ]
        },
        {
          type: 'submenu',
          label: 'Usuários',
          condition: isModerator,
          items: [
            { type: 'fullwidth-link', path: '/users/view', label: 'Listar Usuários', style: dropdownFullWidthLinkStyle, condition: true },
            { type: 'fullwidth-link', path: '/admin/criar-utilizador', label: 'Adicionar Usuários', style: dropdownFullWidthLinkStyle, condition: true },
          ]
        },
        {
          type: 'submenu',
          label: 'Tema',
          condition: true, // Todos podem mudar o tema
          items: [
            { type: 'row', subItems: themes.slice(0, 2) },
            { type: 'row', subItems: themes.slice(2, 4) },
            { type: 'row', subItems: themes.slice(4, 6) },
          ]
        },
      ]
    },
  ] as NavigationItemConfig[]).filter(item => item.condition === undefined || item.condition);

  const renderDropdownItems = (items: DropdownItemGroup[]): JSX.Element[] => {
    return items.map((group, groupIndex) => {
      if (group.condition === false) return null;

      if (group.type === 'submenu') {
        return (
          <DropdownSubMenuComponent
            key={`submenu-${groupIndex}`}
            label={group.label}
            items={group.items}
            renderItems={renderDropdownItems}
          />
        );
      }

      if (group.type === 'search') {
        return (
          <div key={`search-${groupIndex}`} className="relative flex items-center mb-1 px-2">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              id={`search-filter-input-${groupIndex}`}
              value={ticketIdFilter}
              onChange={(e) => setTicketIdFilter(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Pesquisar Chamado por ID..."
              className={`w-full text-xs ${searchInputBgClass} border border-tas-accent/20 rounded-lg py-1.5 pl-2 pr-8 focus:outline-none ${searchFocusRingClass} transition-colors shadow-sm`}
            />
            <button onClick={handleTicketSearch} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-tas-accent">
              <SearchIcon />
            </button>
          </div>
        );
      }

      if (group.type === 'row') {
        return (
          <div key={`group-${groupIndex}`} className="flex space-x-2 px-2">
            {group.subItems.map(subItem => {
              if ('path' in subItem) { // É um DropdownSubItemLink
                return (subItem.condition === undefined || subItem.condition) &&
                  <NavLink key={subItem.label} to={subItem.path} className={subItem.style} onClick={handleLinkClick}>
                    {subItem.label}
                  </NavLink>
              } else { // É um DropdownThemeItem
                return <button key={subItem.label} onClick={() => handleThemeChange(subItem.theme)} className={subItem.style}>
                  {subItem.label}
                </button>
              }
            })}
          </div>
        );
      }

      if (group.type === 'fullwidth-link') {
        return (
          <div key={`fullwidth-${groupIndex}`} className="px-2">
            <NavLink key={group.label} to={group.path} className={group.style} onClick={handleLinkClick}>
              {group.label}
            </NavLink>
          </div>
        );
      }
      return null;
    }).filter(Boolean) as JSX.Element[];
  };

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
            <Link to={isCompanyUser ? "/tickets" : "/dashboard"} className="flex-shrink-0 group" onClick={handleLinkClick}>
              <div
                className="h-10 w-16 bg-tas-text-on-primary group-hover:bg-tas-secondary transition-colors duration-200"
                style={{
                  maskImage: `url(${TASLogo})`,
                  WebkitMaskImage: `url(${TASLogo})`,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskPosition: 'left',
                  WebkitMaskPosition: 'left'
                }}
              />
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
                return (<NavLink key={item.id} to={item.path} className={getNavLinkClass} aria-label={item.label} onClick={handleLinkClick}> {item.icon} <span className="ml-2 hidden xl:inline">{item.label}</span> </NavLink>);
              }
              if (item.type === 'dropdown') {
                const alignClass = item.align === 'right' ? 'right-0' : 'right-0 md:left-0';
                const dropdownContainerClasses = `absolute ${alignClass} top-full w-64 rounded-md shadow-lg p-3 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-150 z-50`;

                return (
                  <div key={item.id} className="relative group">
                    <button className={`${navItemBaseClasses} cursor-default`}> {item.icon} <span className="ml-2 hidden xl:inline">{item.label}</span> <ChevronDownIcon className="ml-1" /> </button>
                    <div className={dropdownContainerClasses}>
                      <div className="space-y-2" role="menu" aria-orientation="vertical">
                        {renderDropdownItems(item.items)}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            {auth.isAuthenticated && auth.user && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tas-primary-hover/50 hover:bg-tas-primary-hover text-tas-text-on-primary transition-colors cursor-pointer border border-tas-accent/10 focus:outline-none">
                  <div className="w-6 h-6 rounded-full bg-tas-secondary flex items-center justify-center text-tas-primary font-bold text-xs">
                    {(auth.user.firstName || auth.user.username).charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium hidden xl:inline max-w-[150px] truncate">
                    {auth.user.firstName ? `${auth.user.firstName} ${auth.user.lastName}` : auth.user.username}
                  </span>
                  <ChevronDownIcon className="ml-1 w-3 h-3" />
                </button>

                <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg p-2 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-150 z-50">
                  <div className="px-2 py-2 border-b border-tas-accent/10 mb-1">
                    <p className="text-xs text-tas-text-on-primary opacity-70">Logado como</p>
                    <p className="text-sm font-semibold text-tas-text-on-primary truncate">
                      {auth.user.firstName ? `${auth.user.firstName} ${auth.user.lastName}` : auth.user.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-2 py-2 text-sm text-red-400 hover:bg-tas-primary hover:text-red-300 rounded-md transition-colors"
                  >
                    <LogOutIcon />
                    <span className="ml-2">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className={`${navTextClass} ${navHoverTextClass} p-2 rounded-md focus:outline-none`} aria-expanded={isMobileMenuOpen} aria-controls="mobile-menu-tas">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (<div className={`md:hidden absolute top-16 inset-x-0 ${mobileMenuBgClass} shadow-lg z-40 border-t border-tas-primary-hover`} >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navigationStructure.map(item => {
            if (item.type === 'link') {
              return (<NavLink key={`mobile-${item.id}`} to={item.path} className={mobileNavItemBaseClasses} onClick={handleLinkClick}> {item.label} </NavLink>);
            }
            if (item.type === 'dropdown') {
              if (item.condition === false) return null; // Apply condition for dropdown
              return (
                <div key={`mobile-dropdown-${item.id}`} className="border-t border-tas-primary-hover mt-2 pt-2">
                  <p className={`px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider mb-1`}>{item.label}</p>
                  {renderDropdownItems(item.items)}
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
      </div>)}
    </nav>
  );
};