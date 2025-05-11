
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2, RefreshCw, Users, CalendarPlus } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import DiscipuladoDialog from './DiscipuladoDialog';
import DeleteDiscipuladoDialog from './DeleteDiscipuladoDialog';
import EncontroDialog from './EncontroDialog';
import HistoricoEncontrosDialog from './HistoricoEncontrosDialog';
import { useDiscipuladoData } from './hooks/useDiscipuladoData';
import { DiscipuladoTable } from './components/DiscipuladoTable';

export default function Discipulado() {
  const { user, isAdmin, isDiscipulador } = useAuth();
  const { discipulados, loading, fetchDiscipulados } = useDiscipuladoData(user);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [encontroDialogOpen, setEncontroDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historicoDialogOpen, setHistoricoDialogOpen] = useState(false);
  const [selectedDiscipulado, setSelectedDiscipulado] = useState<any | null>(null);

  const isLeaderOrAdmin = isAdmin() || isDiscipulador();

  // Event handlers
  const handleCreateDiscipulado = () => {
    setSelectedDiscipulado(null);
    setCreateDialogOpen(true);
  };

  const handleDeleteDiscipulado = (discipulado: any) => {
    setSelectedDiscipulado(discipulado);
    setDeleteDialogOpen(true);
  };

  const handleAddEncontro = (discipulado: any) => {
    setSelectedDiscipulado(discipulado);
    setEncontroDialogOpen(true);
  };

  const handleViewHistorico = (discipulado: any) => {
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

        <DiscipuladoTable 
          discipulados={discipulados}
          loading={loading}
          handleAddEncontro={handleAddEncontro}
          handleViewHistorico={handleViewHistorico}
          handleDeleteDiscipulado={handleDeleteDiscipulado}
          isLeaderOrAdmin={isLeaderOrAdmin}
        />
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
