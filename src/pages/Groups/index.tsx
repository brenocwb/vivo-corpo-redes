
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { FolderPlus, RefreshCw } from 'lucide-react';
import GroupDialog from './GroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';
import ViewGroupMembersDialog from './ViewGroupMembersDialog';
import { useGroupsData, Group } from './hooks/useGroupsData';
import { GroupsTable } from './components/GroupsTable';
import { getDayName } from './utils/groupUtils';

export default function Groups() {
  const { isAdmin, isLider } = useAuth();
  const { groups, loading, fetchGroups } = useGroupsData();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Group management handlers
  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setCreateDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const handleDeleteGroup = (group: Group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleViewMembers = (group: Group) => {
    setSelectedGroup(group);
    setMembersDialogOpen(true);
  };

  const canManageGroups = isAdmin() || isLider();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-muted-foreground">
              Gerencie os grupos de discipulado da plataforma Corpo Vivo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchGroups()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {canManageGroups && (
              <Button onClick={handleCreateGroup} size="sm">
                <FolderPlus className="w-4 h-4 mr-2" /> Novo Grupo
              </Button>
            )}
          </div>
        </div>

        <GroupsTable 
          groups={groups}
          loading={loading}
          handleEditGroup={handleEditGroup}
          handleDeleteGroup={handleDeleteGroup}
          handleViewMembers={handleViewMembers}
          canManageGroups={canManageGroups}
          getDayName={getDayName}
        />
      </div>

      {/* Create/Edit Dialog */}
      <GroupDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        group={null}
        onGroupSaved={fetchGroups}
      />
      
      {selectedGroup && (
        <>
          <GroupDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            group={selectedGroup}
            onGroupSaved={fetchGroups}
          />
          
          <DeleteGroupDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            group={selectedGroup}
            onGroupDeleted={fetchGroups}
          />

          <ViewGroupMembersDialog
            open={membersDialogOpen}
            onOpenChange={setMembersDialogOpen}
            groupId={selectedGroup.id}
            groupName={selectedGroup.nome}
          />
        </>
      )}
    </Layout>
  );
}
