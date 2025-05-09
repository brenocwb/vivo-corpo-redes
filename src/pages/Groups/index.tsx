
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Folder, Edit, Trash2, RefreshCw, FolderPlus, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import GroupDialog from './GroupDialog';
import DeleteGroupDialog from './DeleteGroupDialog';
import ViewGroupMembersDialog from './ViewGroupMembersDialog';

// Define interfaces for better type safety
interface Group {
  id: string;
  nome: string;
  lider_id: string;
  local?: string;
  dia_semana?: string;
  criado_em: string;
  lider_nome?: string;
}

interface LeaderInfo {
  nome: string;
}

export default function Groups() {
  const { isAdmin, isLider } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Fetch groups with separate query for leader names to avoid join errors
      const { data: groupsData, error } = await supabase
        .from('grupos')
        .select('id, nome, lider_id, local, dia_semana, criado_em')
        .order('nome', { ascending: true });

      if (error) throw error;

      if (groupsData) {
        // Create an array to store the formatted groups
        const formattedGroups: Group[] = [];
        
        // Process each group data and fetch leader name separately
        for (const group of groupsData) {
          // Fetch leader name from users table
          const { data: leaderData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', group.lider_id)
            .single();
          
          // Create formatted group with leader name
          const formattedGroup: Group = {
            ...group,
            lider_nome: leaderData?.nome || 'Não definido'
          };
          
          formattedGroups.push(formattedGroup);
        }
        
        setGroups(formattedGroups);
      }
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error);
      toast('Erro ao carregar grupos', {
        description: error.message || 'Não foi possível obter a lista de grupos.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

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

  const getDayName = (day?: string) => {
    if (!day) return 'Não definido';
    const days: Record<string, string> = {
      'domingo': 'Domingo',
      'segunda': 'Segunda-feira',
      'terca': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira',
      'sabado': 'Sábado'
    };
    return days[day.toLowerCase()] || day;
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
