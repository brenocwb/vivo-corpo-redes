
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2, RefreshCw, Users, CalendarPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import DiscipuladoDialog from './DiscipuladoDialog';
import DeleteDiscipuladoDialog from './DeleteDiscipuladoDialog';
import EncontroDialog from './EncontroDialog';
import HistoricoEncontrosDialog from './HistoricoEncontrosDialog';

// Interfaces
interface Discipulado {
  id: string;
  discipulador_id: string;
  discipulo_id: string;
  criado_em: string;
  discipulador_nome: string;
  discipulo_nome: string;
}

// Helper functions
const useDiscipuladosList = (user: any) => {
  const { isAdmin, isLider } = useAuth();
  const [discipulados, setDiscipulados] = useState<Discipulado[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscipulados = async () => {
    setLoading(true);
    try {
      // Separate fetches to avoid join errors
      let query = supabase
        .from('discipulados')
        .select('id, discipulador_id, discipulo_id, criado_em');

      // Filter by discipulador_id if user is lider but not admin
      if (isLider() && !isAdmin() && user) {
        query = query.eq('discipulador_id', user.id);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        // Create an array to store the formatted discipulados
        const formattedDiscipulados: Discipulado[] = [];
        
        // Process each discipulado and fetch related names
        for (const item of data) {
          // Fetch discipulador name
          const { data: discipuladorData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', item.discipulador_id)
            .single();
          
          // Fetch discipulo name
          const { data: discipuloData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', item.discipulo_id)
            .single();
          
          // Create formatted discipulado with names
          const formattedDiscipulado: Discipulado = {
            ...item,
            discipulador_nome: discipuladorData?.nome || 'Não definido',
            discipulo_nome: discipuloData?.nome || 'Não definido'
          };
          
          formattedDiscipulados.push(formattedDiscipulado);
        }
        
        setDiscipulados(formattedDiscipulados);
      }
    } catch (error: any) {
      console.error('Erro ao buscar discipulados:', error);
      toast('Erro ao carregar discipulados', {
        description: error.message || 'Não foi possível obter a lista de discipulados.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDiscipulados();
    }
  }, [user]);

  return { discipulados, loading, fetchDiscipulados };
};

export default function Discipulado() {
  const { user, isAdmin, isLider } = useAuth();
  const { discipulados, loading, fetchDiscipulados } = useDiscipuladosList(user);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [encontroDialogOpen, setEncontroDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
  const [selectedDiscipulado, setSelectedDiscipulado] = useState<Discipulado | null>(null);

  const isLeaderOrAdmin = isAdmin() || isLider();

  // Event handlers
  const handleCreateDiscipulado = () => {
    setSelectedDiscipulado(null);
    setCreateDialogOpen(true);
  };

  const handleDeleteDiscipulado = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setDeleteDialogOpen(true);
  };

  const handleAddEncontro = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setEncontroDialogOpen(true);
  };

  const handleViewHistorico = (discipulado: Discipulado) => {
    setSelectedDiscipulado(discipulado);
    setHistoricoDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Discipulados</h1>
            <p className="text-muted-foreground">
              Gerencie os relacionamentos de discipulado da plataforma Corpo Vivo.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => fetchDiscipulados()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {isLeaderOrAdmin && (
              <Button onClick={handleCreateDiscipulado} size="sm">
                <UserPlus className="w-4 h-4 mr-2" /> Novo Discipulado
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left">Discipulador</th>
                  <th className="h-10 px-4 text-left">Discípulo</th>
                  <th className="h-10 px-4 text-left">Data de Início</th>
                  <th className="h-10 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="h-12 px-4 text-center">
                      Carregando discipulados...
                    </td>
                  </tr>
                ) : discipulados.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="h-12 px-4 text-center">
                      Nenhum discipulado encontrado.
                    </td>
                  </tr>
                ) : (
                  discipulados.map((discipulado) => (
                    <tr key={discipulado.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{discipulado.discipulador_nome}</td>
                      <td className="p-4 align-middle">{discipulado.discipulo_nome}</td>
                      <td className="p-4 align-middle">{formatDate(discipulado.criado_em)}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleAddEncontro(discipulado)}
                            title="Registrar encontro"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewHistorico(discipulado)}
                            title="Ver histórico de encontros"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          {isLeaderOrAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteDiscipulado(discipulado)}
                              className="text-destructive hover:bg-destructive/10"
                              title="Excluir discipulado"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Dialogs */}
      <DiscipuladoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDiscipuladoCreated={fetchDiscipulados}
      />
      
      {selectedDiscipulado && (
        <>
          <DeleteDiscipuladoDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            discipulado={selectedDiscipulado}
            onDiscipuladoDeleted={fetchDiscipulados}
          />
          
          <EncontroDialog
            open={encontroDialogOpen}
            onOpenChange={setEncontroDialogOpen}
            discipuladoId={selectedDiscipulado.id}
            discipuladorNome={selectedDiscipulado.discipulador_nome}
            discipuloNome={selectedDiscipulado.discipulo_nome}
          />
          
          <HistoricoEncontrosDialog
            open={historicoDialogOpen}
            onOpenChange={setHistoricoDialogOpen}
            discipuladoId={selectedDiscipulado.id}
            discipuladorNome={selectedDiscipulado.discipulador_nome}
            discipuloNome={selectedDiscipulado.discipulo_nome}
          />
        </>
      )}
    </Layout>
  );
}
