
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Users, 
  BookOpen, 
  MessageSquare, 
  BarChartHorizontal, 
  Settings, 
  LogOut, 
  Folder,
  User
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, isDiscipulador, signOut } = useAuth();

  const AdminLinks = () => (
    <>
      <li>
        <Link 
          to="/dashboard" 
          className={cn('nav-link', location.pathname === '/dashboard' && 'nav-link-active')}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/admin/usuarios" 
          className={cn('nav-link', location.pathname.startsWith('/admin/usuarios') && 'nav-link-active')}
        >
          <Users className="h-5 w-5" />
          <span>Usuários</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/grupos" 
          className={cn('nav-link', location.pathname.startsWith('/grupos') && 'nav-link-active')}
        >
          <Folder className="h-5 w-5" />
          <span>Grupos</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/discipulado" 
          className={cn('nav-link', location.pathname.startsWith('/discipulado') && 'nav-link-active')}
        >
          <Users className="h-5 w-5" />
          <span>Discipulados</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/planos" 
          className={cn('nav-link', location.pathname.startsWith('/planos') && 'nav-link-active')}
        >
          <BookOpen className="h-5 w-5" />
          <span>Planos</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/comunidade" 
          className={cn('nav-link', location.pathname.startsWith('/comunidade') && 'nav-link-active')}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comunidade</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/configuracoes" 
          className={cn('nav-link', location.pathname === '/configuracoes' && 'nav-link-active')}
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </Link>
      </li>
    </>
  );

  const DiscipuladorLinks = () => (
    <>
      <li>
        <Link 
          to="/dashboard" 
          className={cn('nav-link', location.pathname === '/dashboard' && 'nav-link-active')}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/meus-discipulos" 
          className={cn('nav-link', location.pathname.startsWith('/meus-discipulos') && 'nav-link-active')}
        >
          <Users className="h-5 w-5" />
          <span>Meus Discípulos</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/meu-grupo" 
          className={cn('nav-link', location.pathname.startsWith('/meu-grupo') && 'nav-link-active')}
        >
          <Folder className="h-5 w-5" />
          <span>Meu Grupo</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/planos" 
          className={cn('nav-link', location.pathname.startsWith('/planos') && 'nav-link-active')}
        >
          <BookOpen className="h-5 w-5" />
          <span>Planos</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/comunidade" 
          className={cn('nav-link', location.pathname.startsWith('/comunidade') && 'nav-link-active')}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comunidade</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/perfil" 
          className={cn('nav-link', location.pathname === '/perfil' && 'nav-link-active')}
        >
          <User className="h-5 w-5" />
          <span>Meu Perfil</span>
        </Link>
      </li>
    </>
  );

  const DiscipuloLinks = () => (
    <>
      <li>
        <Link 
          to="/dashboard" 
          className={cn('nav-link', location.pathname === '/dashboard' && 'nav-link-active')}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/meu-plano" 
          className={cn('nav-link', location.pathname.startsWith('/meu-plano') && 'nav-link-active')}
        >
          <BookOpen className="h-5 w-5" />
          <span>Meu Plano</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/meu-grupo" 
          className={cn('nav-link', location.pathname.startsWith('/meu-grupo') && 'nav-link-active')}
        >
          <Folder className="h-5 w-5" />
          <span>Meu Grupo</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/comunidade" 
          className={cn('nav-link', location.pathname.startsWith('/comunidade') && 'nav-link-active')}
        >
          <MessageSquare className="h-5 w-5" />
          <span>Comunidade</span>
        </Link>
      </li>
      <li>
        <Link 
          to="/perfil" 
          className={cn('nav-link', location.pathname === '/perfil' && 'nav-link-active')}
        >
          <User className="h-5 w-5" />
          <span>Meu Perfil</span>
        </Link>
      </li>
    </>
  );

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
            {isAdmin() ? <AdminLinks /> : null}
            
            {isDiscipulador() && !isAdmin() ? <DiscipuladorLinks /> : null}
            
            {!isAdmin() && !isDiscipulador() ? <DiscipuloLinks /> : null}
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
