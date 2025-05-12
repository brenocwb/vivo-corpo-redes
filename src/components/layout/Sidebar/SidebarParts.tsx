
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';

// Reusable sidebar section component
export function SidebarSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      {title && <h2 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>}
      {children}
    </div>
  );
}

// Sidebar header component
export function SidebarHeader({ children }: { children: ReactNode }) {
  return (
    <div className="py-6 px-4">
      {children}
    </div>
  );
}

// Sidebar content component
export function SidebarContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-auto">
      {children}
    </div>
  );
}

// Sidebar footer component
export function SidebarFooter({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="px-4 mt-6">
      <button 
        onClick={onSignOut} 
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </div>
  );
}

// Sidebar wrapper component
export function SidebarWrapper({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('pb-4 w-64 bg-white dark:bg-gray-800 border-r flex flex-col h-screen', className)}>
      {children}
    </div>
  );
}
