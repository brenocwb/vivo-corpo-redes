
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminUsers() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedUsers = data.map(u => ({
          id: u.id,
          email: u.email,
          nome: u.nome,
          role: u.tipo_usuario as any,
          grupo_id: u.grupo_id,
          created_at: u.criado_em
        }));
        setUsers(formattedUsers);
      }
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [user]);

  const filteredUsers = users.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin()) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta página.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
            <p className="text-muted-foreground">
              Administre todos os usuários do sistema.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Usuário
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Cadastrados</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando usuários...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {usuario.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
