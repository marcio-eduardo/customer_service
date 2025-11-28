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

// --- Interfaces para a Estrutura de Navegação ---
interface NavLinkSimple { type: 'link'; path: string; label: string; icon?: JSX.Element; id: string; condition?: boolean; }
interface DropdownSubItemLink { path: string; label: string; style: string; condition?: boolean; }
interface DropdownItemGroupRow { type: 'row'; subItems: (DropdownSubItemLink)[]; condition?: boolean; }
interface DropdownItemGroupFullWidthLink { type: 'fullwidth-link'; path: string; label: string; style: string; condition?: boolean; }
interface DropdownItemGroupSearch { type: 'search'; condition?: boolean; } 
interface DropdownSubMenu { type: 'submenu'; label: string; items: DropdownItemGroup[]; condition?: boolean; }

type DropdownItemGroup = DropdownItemGroupRow | DropdownItemGroupFullWidthLink | DropdownItemGroupSearch | DropdownSubMenu;

interface NavDropdown { type: 'dropdown'; label: string; icon?: JSX.Element; id: string; items: DropdownItemGroup[]; condition?: boolean; }
type NavigationItemConfig = NavLinkSimple | NavDropdown;

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ticketIdFilter, setTicketIdFilter] = useState(''); 
  
  const auth = useAuth();
  const navigate = useNavigate();

  const userRoles = auth.user?.roles || [];
  const isModerator = userRoles.includes('ROLE_MODERATOR');
  const isTechUser = userRoles.includes('ROLE_TECH_USER');
  const isCompanyUser = userRoles.includes('ROLE_COMPANY_USER');

  const canManageTickets = isTechUser || isModerator;
  
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
  const dropdownFullWidthLinkStyle = `block w-full text-center text-xs mt-2 py-1.5 px-2 rounded-md border border-tas-accent text-tas-text-on-primary hover:bg-tas-primary-hover hover:text-tas-accent transition-colors`;

  const navItemBaseClasses = `px-3 py-2 rounded-md text-sm font-medium ${navHoverTextClass} transition-colors flex items-center ${navTextClass} cursor-pointer hover:bg-tas-primary-hover`;
  const mobileNavItemBaseClasses = `w-full text-left block px-4 py-3 text-base font-medium ${navHoverTextClass} transition-colors ${navTextClass} hover:bg-tas-primary-hover`;

  const dropdownContainerClasses = `absolute right-0 md:left-0 top-full mt-0.5 w-64 rounded-md shadow-lg p-3 bg-tas-primary-hover ring-1 ring-black ring-opacity-5 invisible opacity-0 group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all duration-150 z-50`;

  const navigationStructure: NavigationItemConfig[] = [
    { type: 'link', path: '/dashboard', label: 'Dashboard', icon: <HomeIcon />, id: 'dashboard', condition: isModerator || isTechUser },
    { 
      type: 'dropdown', 
      label: 'Chamados', 
      icon: <ListChecksIcon />, 
      id: 'chamados',
      condition: isModerator || isTechUser || isCompanyUser, // All roles can see tickets
      items: [
        { type: 'search', condition: isModerator || isTechUser }, // Only tech/moderator can search tickets
        { type: 'row', subItems: [
            { path: '/tickets/novo', label: '+ Novo', style: dropdownButtonRowStyle, condition: isModerator || isCompanyUser }, // Moderator and CompanyUser can create
            { path: '/tickets/abertos', label: 'Abertos', style: dropdownButtonRowStyle, condition: isModerator || isTechUser || isCompanyUser }, // All can see open
          ],
        },
      ]
    },
    { 
      type: 'dropdown', 
      label: 'Configurações', 
      icon: <CogIcon />, 
      id: 'settings',
      condition: isModerator || isTechUser, // Only moderator and tech user see this dropdown
      items: [
        {
          type: 'submenu',
          label: 'Empresas',
          condition: isModerator || isTechUser,
          items: [
            { type: 'fullwidth-link', path: '/companies/view', label: 'Empresas Cadastradas', style: dropdownFullWidthLinkStyle, condition: isModerator || isTechUser },
            { type: 'fullwidth-link', path: '/companies/add', label: 'Adicionar Empresas', style: dropdownFullWidthLinkStyle, condition: isModerator },
          ]
        },
        {
          type: 'submenu',
          label: 'Usuários',
          condition: isModerator,
          items: [
            { type: 'fullwidth-link', path: '/users/view', label: 'Usuários Cadastrados', style: dropdownFullWidthLinkStyle, condition: isModerator },
            { type: 'fullwidth-link', path: '/users/add', label: 'Adicionar Usuários', style: dropdownFullWidthLinkStyle, condition: isModerator },
          ]
        },
      ]
    },
  ].filter(item => item.condition === undefined || item.condition); // Filter out items based on their conditions

  const renderDropdownItems = (items: DropdownItemGroup[]): JSX.Element[] => {
    return items.map((group, groupIndex) => {
      if (group.condition === false) return null;

      if (group.type === 'submenu') {
        return (
          <div key={`submenu-${groupIndex}`} className="relative group/submenu">
            <button className="w-full text-left px-3 py-2 text-sm font-medium text-tas-text-on-primary hover:bg-tas-primary-hover rounded-md flex items-center justify-between">
              <span>{group.label}</span>
              <ChevronDownIcon />
            </button>
            <div className="pl-4 border-l border-tas-accent ml-2 hidden group-hover/submenu:block">
              {renderDropdownItems(group.items)}
            </div>
          </div>
        );
      }
      
      if (group.type === 'search') {
        return (
          <div key={`search-${groupIndex}`} className="relative flex items-center mb-1">
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              id={`search-filter-input-${groupIndex}`}
              value={ticketIdFilter}
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
          <div key={`group-${groupIndex}`} className="flex space-x-2">
            {group.subItems.map(subItem => (
              (subItem.condition === undefined || subItem.condition) &&
              <Link key={subItem.label} to={subItem.path} className={subItem.style} onClick={handleLinkClick}>
                {subItem.label}
              </Link>
            ))}
          </div>
        );
      }

      if (group.type === 'fullwidth-link') {
        return (
          <Link key={group.label} to={group.path} className={group.style} onClick={handleLinkClick}>
            {group.label}
          </Link>
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
            <Link to={isCompanyUser ? "/tickets/abertos" : "/dashboard"} className="flex-shrink-0" onClick={handleLinkClick}>
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
                        {renderDropdownItems(item.items)}
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
      </div> )}
    </nav>
  );
};
