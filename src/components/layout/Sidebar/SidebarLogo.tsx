
import React from 'react';

export function SidebarLogo() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="h-8 w-8 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold">
        CV
      </div>
      <h1 className="text-xl font-bold text-corpovivo-600 dark:text-corpovivo-400">
        Corpo Vivo
      </h1>
    </div>
  );
}
