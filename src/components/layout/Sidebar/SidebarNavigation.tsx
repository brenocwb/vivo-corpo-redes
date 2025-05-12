
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Folder,
  User
} from 'lucide-react';
import { NavLink } from './NavLink';
import { SidebarSection } from './SidebarParts';

export function SidebarNavigation() {
  const location = useLocation();
  const { isAdmin, isDiscipulador } = useAuth();
  
  const isPathActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  // Admin navigation links
  const renderAdminLinks = () => (
    <SidebarSection title="Administração">
      <NavLink 
        to="/admin/usuarios" 
        icon={Users}
        isActive={isPathActive('/admin/usuarios')}
      >
        Usuários
      </NavLink>
      <NavLink 
        to="/grupos" 
        icon={Folder}
        isActive={isPathActive('/grupos')}
      >
        Grupos
      </NavLink>
      <NavLink 
        to="/discipulado" 
        icon={Users}
        isActive={isPathActive('/discipulado')}
      >
        Discipulados
      </NavLink>
      <NavLink 
        to="/planos" 
        icon={BookOpen}
        isActive={isPathActive('/planos')}
      >
        Planos
      </NavLink>
      <NavLink 
        to="/configuracoes" 
        icon={Settings}
        isActive={isPathActive('/configuracoes')}
      >
        Configurações
      </NavLink>
    </SidebarSection>
  );
  
  // Discipulador navigation links
  const renderDiscipuladorLinks = () => (
    <SidebarSection title="Liderança">
      <NavLink 
        to="/meus-discipulos" 
        icon={Users}
        isActive={isPathActive('/meus-discipulos')}
      >
        Meus Discípulos
      </NavLink>
      <NavLink 
        to="/meu-grupo" 
        icon={Folder}
        isActive={isPathActive('/meu-grupo')}
      >
        Meu Grupo
      </NavLink>
      <NavLink 
        to="/planos" 
        icon={BookOpen}
        isActive={isPathActive('/planos')}
      >
        Planos
      </NavLink>
    </SidebarSection>
  );
  
  // Common navigation links for all users
  const renderCommonLinks = () => (
    <SidebarSection title="Geral">
      <NavLink 
        to="/dashboard" 
        icon={Home}
        isActive={isPathActive('/dashboard')}
      >
        Dashboard
      </NavLink>
      <NavLink 
        to="/comunidade" 
        icon={MessageSquare}
        isActive={isPathActive('/comunidade')}
      >
        Comunidade
      </NavLink>
      <NavLink 
        to="/perfil" 
        icon={User}
        isActive={isPathActive('/perfil')}
      >
        Meu Perfil
      </NavLink>
    </SidebarSection>
  );
  
  // Discipulo-specific navigation links
  const renderDiscipuloLinks = () => (
    <SidebarSection title="Meu Crescimento">
      <NavLink 
        to="/meu-plano" 
        icon={BookOpen}
        isActive={isPathActive('/meu-plano')}
      >
        Meu Plano
      </NavLink>
      <NavLink 
        to="/meu-grupo" 
        icon={Folder}
        isActive={isPathActive('/meu-grupo')}
      >
        Meu Grupo
      </NavLink>
    </SidebarSection>
  );
  
  return (
    <nav className="mt-6">
      {renderCommonLinks()}
      
      {isAdmin() && renderAdminLinks()}
      
      {isDiscipulador() && !isAdmin() && renderDiscipuladorLinks()}
      
      {!isAdmin() && !isDiscipulador() && renderDiscipuloLinks()}
    </nav>
  );
}
