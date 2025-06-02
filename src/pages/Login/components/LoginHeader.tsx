
import React from "react";

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto h-12 w-12 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold text-xl">
        CV
      </div>
      <h1 className="text-2xl font-bold mt-2 text-corpovivo-600 dark:text-corpovivo-400">Corpo Vivo</h1>
      <p className="text-gray-500 dark:text-gray-400">Sistema de Gestão de Discipulado</p>
    </div>
  );
}
