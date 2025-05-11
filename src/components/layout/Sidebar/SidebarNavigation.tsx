
import React from 'react';
import { useLocation } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';

export function SidebarNavigation() {
  const location = useLocation();
  const { isAdmin, isDiscipulador } = useAuth();
  
  const isPathActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  
  return (
    <nav>
      <ul className="space-y-1">
        {/* Dashboard link for all users */}
        <NavLink 
          to="/dashboard" 
          icon={Home}
          isActive={isPathActive('/dashboard')}
        >
          Dashboard
        </NavLink>
        
        {/* Admin links */}
        {isAdmin() && (
          <>
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
              to="/comunidade" 
              icon={MessageSquare}
              isActive={isPathActive('/comunidade')}
            >
              Comunidade
            </NavLink>
            <NavLink 
              to="/configuracoes" 
              icon={Settings}
              isActive={isPathActive('/configuracoes')}
            >
              Configurações
            </NavLink>
          </>
        )}
        
        {/* Discipulador links */}
        {isDiscipulador() && !isAdmin() && (
          <>
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
          </>
        )}
        
        {/* Discipulo links */}
        {!isAdmin() && !isDiscipulador() && (
          <>
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
          </>
        )}
      </ul>
    </nav>
  );
}
