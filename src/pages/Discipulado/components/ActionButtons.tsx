
import { Button } from '@/components/ui/button';
import { RefreshCw, UserPlus } from 'lucide-react';

interface ActionButtonsProps {
  onRefresh: () => void;
  onCreate: () => void;
  isLeaderOrAdmin: boolean;
}

export const ActionButtons = ({ onRefresh, onCreate, isLeaderOrAdmin }: ActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
      </Button>
      {isLeaderOrAdmin && (
        <Button onClick={onCreate} size="sm">
          <UserPlus className="w-4 h-4 mr-2" /> Novo Discipulado
        </Button>
      )}
    </div>
  );
};
