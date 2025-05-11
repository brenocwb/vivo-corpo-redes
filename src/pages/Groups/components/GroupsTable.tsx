
import { Grupo } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

export interface GroupsTableProps {
  groups: Grupo[];
  loading: boolean;
  currentUserId?: string;
  onEdit: (group: Grupo) => void;
  onDelete: (group: Grupo) => void;
  onViewMembers: (group: Grupo) => void;
}

export function GroupsTable({
  groups,
  loading,
  currentUserId,
  onEdit,
  onDelete,
  onViewMembers
}: GroupsTableProps) {
  const { isAdmin, isDiscipulador } = useAuth();

  const canEditGroup = (group: Grupo) => {
    return isAdmin() || (isDiscipulador() && group.lider_id === currentUserId);
  };

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left">Nome</th>
              <th className="h-10 px-4 text-left">Descrição</th>
              <th className="h-10 px-4 text-left">Data de Criação</th>
              <th className="h-10 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="h-12 px-4 text-center">
                  Carregando grupos...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={4} className="h-12 px-4 text-center">
                  Nenhum grupo encontrado.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{group.nome}</td>
                  <td className="p-4 align-middle">{group.descricao || '-'}</td>
                  <td className="p-4 align-middle">{formatDate(group.created_at)}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onViewMembers(group)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      {canEditGroup(group) && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEdit(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onDelete(group)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
