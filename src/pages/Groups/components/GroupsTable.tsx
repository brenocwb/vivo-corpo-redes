
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';
import { Group } from '../hooks/useGroupsData';

interface GroupsTableProps {
  groups: Group[];
  loading: boolean;
  handleEditGroup: (group: Group) => void;
  handleDeleteGroup: (group: Group) => void;
  handleViewMembers: (group: Group) => void;
  canManageGroups: boolean;
  getDayName: (day?: string) => string;
}

export function GroupsTable({
  groups,
  loading,
  handleEditGroup,
  handleDeleteGroup,
  handleViewMembers,
  canManageGroups,
  getDayName
}: GroupsTableProps) {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-10 px-4 text-left">Nome</th>
              <th className="h-10 px-4 text-left">Líder</th>
              <th className="h-10 px-4 text-left">Local</th>
              <th className="h-10 px-4 text-left">Dia da Semana</th>
              <th className="h-10 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="h-12 px-4 text-center">
                  Carregando grupos...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-12 px-4 text-center">
                  Nenhum grupo encontrado.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{group.nome}</td>
                  <td className="p-4 align-middle">{group.lider_nome}</td>
                  <td className="p-4 align-middle">{group.local || 'Não definido'}</td>
                  <td className="p-4 align-middle">{getDayName(group.dia_semana)}</td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewMembers(group)}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      {canManageGroups && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditGroup(group)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteGroup(group)}
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
