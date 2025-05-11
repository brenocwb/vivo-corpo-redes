
import { Plano } from '@/types';
import { PlanoCard } from './PlanoCard';

interface PlanosGridProps {
  planos: Plano[];
  loading: boolean;
  onView: (plano: Plano) => void;
  onEdit: (plano: Plano) => void;
  onDelete: (plano: Plano) => void;
  isAdmin: boolean;
}

export function PlanosGrid({ planos, loading, onView, onEdit, onDelete, isAdmin }: PlanosGridProps) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Carregando...
          </span>
        </div>
        <p className="mt-2 text-muted-foreground">Carregando planos...</p>
      </div>
    );
  }

  if (planos.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nenhum plano encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {planos.map((plano) => (
        <PlanoCard
          key={plano.id}
          plano={plano}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
