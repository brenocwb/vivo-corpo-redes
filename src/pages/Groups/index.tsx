
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useGroupsData } from './hooks/useGroupsData';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { GroupsTable } from './components/GroupsTable';
import GroupDialog from './GroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';
import ViewGroupMembersDialog from './ViewGroupMembersDialog';

// Define the Grupo interface if it's not already defined elsewhere
export interface Grupo {
  id: string;
  nome: string;
  local?: string;
  dia_semana?: string;
  criado_em: string;
  lider_id?: string;
  lider?: {
    nome: string;
  };
}

export default function Groups() {
  const { grupos, loading, fetchGrupos } = useGroupsData();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewMembersDialogOpen, setViewMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);

  const handleCreateClick = () => {
    setSelectedGroup(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (group: Grupo) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (group: Grupo) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleViewMembersClick = (group: Grupo) => {
    setSelectedGroup(group);
    setViewMembersDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-muted-foreground">
              Administre os grupos de discipulado e células da igreja.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchGrupos} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            <Button onClick={handleCreateClick} size="sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Grupo
            </Button>
          </div>
        </div>

        <GroupsTable
          grupos={grupos}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onViewMembers={handleViewMembersClick}
        />

        <GroupDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onGroupCreated={fetchGrupos}
        />

        {selectedGroup && (
          <>
            <GroupDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              group={selectedGroup}
              onGroupCreated={fetchGrupos}
            />

            <DeleteGroupDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              group={selectedGroup}
              onGroupDeleted={fetchGrupos}
            />

            <ViewGroupMembersDialog
              open={viewMembersDialogOpen}
              onOpenChange={setViewMembersDialogOpen}
              group={selectedGroup}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
