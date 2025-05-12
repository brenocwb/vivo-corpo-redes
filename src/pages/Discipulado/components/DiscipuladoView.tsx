
import { DiscipuladoHeader } from './DiscipuladoHeader';
import { DiscipuladoTable } from './DiscipuladoTable';
import { DiscipuladoDialogs } from './DiscipuladoDialogs';
import { Discipulado } from '../hooks/useDiscipuladoData';

interface DiscipuladoViewProps {
  discipulados: Discipulado[];
  loading: boolean;
  fetchDiscipulados: () => void;
  dialogsState: any;
  isLeaderOrAdmin: boolean;
}

export function DiscipuladoView({ 
  discipulados, 
  loading, 
  fetchDiscipulados,
  dialogsState,
  isLeaderOrAdmin
}: DiscipuladoViewProps) {
  const {
    createDialogOpen,
    setCreateDialogOpen,
    encontroDialogOpen,
    setEncontroDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    historicoDialogOpen,
    setHistoricoDialogOpen,
    selectedDiscipulado,
    handleCreateDiscipulado,
    handleDeleteDiscipulado,
    handleAddEncontro,
    handleViewHistorico
  } = dialogsState;

  return (
    <div className="space-y-6">
      <DiscipuladoHeader 
        onRefresh={fetchDiscipulados}
        onCreate={handleCreateDiscipulado}
        isLeaderOrAdmin={isLeaderOrAdmin}
      />

      <DiscipuladoTable 
        discipulados={discipulados}
        loading={loading}
        handleAddEncontro={handleAddEncontro}
        handleViewHistorico={handleViewHistorico}
        handleDeleteDiscipulado={handleDeleteDiscipulado}
        isLeaderOrAdmin={isLeaderOrAdmin}
      />

      <DiscipuladoDialogs 
        createDialogOpen={createDialogOpen}
        setCreateDialogOpen={setCreateDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        encontroDialogOpen={encontroDialogOpen}
        setEncontroDialogOpen={setEncontroDialogOpen}
        historicoDialogOpen={historicoDialogOpen}
        setHistoricoDialogOpen={setHistoricoDialogOpen}
        selectedDiscipulado={selectedDiscipulado}
        onDiscipuladoCreated={fetchDiscipulados}
        onDiscipuladoDeleted={fetchDiscipulados}
      />
    </div>
  );
}
