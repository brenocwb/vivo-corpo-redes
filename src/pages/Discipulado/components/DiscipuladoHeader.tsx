
import { ActionButtons } from './ActionButtons';

interface DiscipuladoHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
  isLeaderOrAdmin: boolean;
}

export const DiscipuladoHeader = ({ onRefresh, onCreate, isLeaderOrAdmin }: DiscipuladoHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discipulados</h1>
        <p className="text-muted-foreground">
          Gerencie os relacionamentos de discipulado da plataforma Corpo Vivo.
        </p>
      </div>
      <ActionButtons 
        onRefresh={onRefresh} 
        onCreate={onCreate} 
        isLeaderOrAdmin={isLeaderOrAdmin} 
      />
    </div>
  );
};
