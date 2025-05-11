
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { UserPlus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import CreateUserDialog from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import DeleteUserDialog from './DeleteUserDialog';

export default function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Check if user is admin, otherwise redirect
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedUsers = data.map(userData => ({
          id: userData.id,
          nome: userData.nome,
          email: userData.email,
          role: userData.tipo_usuario as UserRole,
          grupo_id: userData.grupo_id,
          created_at: userData.criado_em,
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast('Erro ao carregar usuários', {
        description: 'Não foi possível obter a lista de usuários.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'lider': return 'Líder';
      case 'membro': return 'Membro';
      default: return role;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">
              Gerencie todos os usuários da plataforma Corpo Vivo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchUsers()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            <Button onClick={() => setCreateDialogOpen(true)} size="sm">
              <UserPlus className="w-4 h-4 mr-2" /> Novo Usuário
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left">Nome</th>
                  <th className="h-10 px-4 text-left">E-mail</th>
                  <th className="h-10 px-4 text-left">Tipo</th>
                  <th className="h-10 px-4 text-left">Data de Criação</th>
                  <th className="h-10 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center">
                      Carregando usuários...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{user.nome}</td>
                      <td className="p-4 align-middle">{user.email}</td>
                      <td className="p-4 align-middle">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'lider' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{formatDate(user.created_at)}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteClick(user)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <CreateUserDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onUserCreated={fetchUsers}
      />
      
      {selectedUser && (
        <>
          <EditUserDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            user={selectedUser}
            onUserUpdated={fetchUsers}
          />
          
          <DeleteUserDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            user={selectedUser}
            onUserDeleted={fetchUsers}
          />
        </>
      )}
    </Layout>
  );
}
