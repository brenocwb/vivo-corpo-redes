
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { useDiscipuladoData } from './hooks/useDiscipuladoData';
import { useDiscipuladoDialogs } from './hooks/useDiscipuladoDialogs';
import { DiscipuladoHeader } from './components/DiscipuladoHeader';
import { DiscipuladoTable } from './components/DiscipuladoTable';
import { DiscipuladoDialogs } from './components/DiscipuladoDialogs';

export default function Discipulado() {
  const { user, isAdmin, isDiscipulador } = useAuth();
  const { discipulados, loading, fetchDiscipulados } = useDiscipuladoData(user);
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
  } = useDiscipuladoDialogs();

  const isLeaderOrAdmin = isAdmin() || isDiscipulador();

  return (
    <Layout>
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
      </div>

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
    </Layout>
  );
}
