
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Users, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Folder,
  User
} from 'lucide-react';

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink = ({ to, icon: Icon, children, isActive }: NavLinkProps) => (
  <li>
    <Link 
      to={to} 
      className={cn('nav-link', isActive && 'nav-link-active')}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  </li>
);

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, isDiscipulador, signOut } = useAuth();

  const isPathActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn('pb-4 w-64 bg-white dark:bg-gray-800 border-r', className)}>
      <div className="py-6 px-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold">
            CV
          </div>
          <h1 className="text-xl font-bold text-corpovivo-600 dark:text-corpovivo-400">
            Corpo Vivo
          </h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-medium">{user.nome.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{user.nome}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        )}
        
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
      </div>
      <div className="px-4 mt-6">
        <button 
          onClick={() => signOut()} 
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
