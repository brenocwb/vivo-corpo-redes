
import React from 'react';
import { useAuth } from '@/context/AuthContext';

export function SidebarUserProfile() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
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
  );
}
