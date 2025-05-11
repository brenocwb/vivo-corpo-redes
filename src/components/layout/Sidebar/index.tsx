
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

import { SidebarLogo } from './SidebarLogo';
import { SidebarUserProfile } from './SidebarUserProfile';
import { SidebarNavigation } from './SidebarNavigation';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { signOut } = useAuth();
  
  return (
    <div className={cn('pb-4 w-64 bg-white dark:bg-gray-800 border-r', className)}>
      <div className="py-6 px-4">
        <SidebarLogo />
        <SidebarUserProfile />
        <SidebarNavigation />
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
