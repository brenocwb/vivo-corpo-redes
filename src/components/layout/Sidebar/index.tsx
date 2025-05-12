
import React from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { SidebarLogo } from './SidebarLogo';
import { SidebarUserProfile } from './SidebarUserProfile';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarWrapper, SidebarHeader, SidebarContent, SidebarFooter } from './SidebarParts';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { signOut } = useAuth();
  
  return (
    <SidebarWrapper className={className}>
      <SidebarHeader>
        <SidebarLogo />
        <SidebarUserProfile />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      
      <SidebarFooter onSignOut={signOut} />
    </SidebarWrapper>
  );
}
