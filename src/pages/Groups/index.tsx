
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { GroupsTable } from './components/GroupsTable';
import { useGroupsData } from './hooks/useGroupsData';
import GroupDialog from './GroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';
import ViewGroupMembersDialog from './ViewGroupMembersDialog';
import { Grupo } from '@/types';

export default function Groups() {
  const { user, isAdmin, isDiscipulador } = useAuth();
  const { groups, loading, fetchGroups } = useGroupsData();
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewMembersDialogOpen, setViewMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Grupo | null>(null);
  
  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setCreateDialogOpen(true);
  };
  
  const handleEditGroup = (group: Grupo) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };
  
  const handleDeleteGroup = (group: Grupo) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };
  
  const handleViewMembers = (group: Grupo) => {
    setSelectedGroup(group);
    setViewMembersDialogOpen(true);
  };
  
  const canCreateGroup = isAdmin() || isDiscipulador();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Grupos</h1>
            <p className="text-muted-foreground">
              Gerencie os grupos da igreja e seus membros.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchGroups} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {canCreateGroup && (
              <Button onClick={handleCreateGroup} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Grupo
              </Button>
            )}
          </div>
        </div>
        
        <GroupsTable 
          groups={groups}
          loading={loading}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
          onViewMembers={handleViewMembers}
          currentUserId={user?.id}
        />
      </div>
      
      <GroupDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onSuccess={fetchGroups}
      />
      
      {selectedGroup && (
        <>
          <GroupDialog 
            open={editDialogOpen} 
            onOpenChange={setEditDialogOpen} 
            group={selectedGroup}
            onSuccess={fetchGroups}
          />
          
          <DeleteGroupDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            group={selectedGroup}
          />
          
          <ViewGroupMembersDialog
            open={viewMembersDialogOpen}
            onOpenChange={setViewMembersDialogOpen}
            groupId={selectedGroup.id}
            groupName={selectedGroup.nome}
          />
        </>
      )}
    </Layout>
  );
}
