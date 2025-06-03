
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-full bg-corpovivo-600 flex items-center justify-center text-white font-semibold">
            CV
          </div>
          <h1 className="text-2xl font-bold text-corpovivo-600 dark:text-corpovivo-400">
            Corpo Vivo
          </h1>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <Link to="/dashboard">
          <Button className="bg-corpovivo-600 hover:bg-corpovivo-700">
            <Home className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
