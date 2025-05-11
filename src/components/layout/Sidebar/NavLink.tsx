
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}

export function NavLink({ to, icon: Icon, children, isActive }: NavLinkProps) {
  return (
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
}
