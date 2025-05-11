
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, RefreshCw } from 'lucide-react';
import { usePlanosData } from './hooks/usePlanosData';
import { PlanosGrid } from './components/PlanosGrid';
import { Plano } from '@/types';
import { PlanoDialog } from './PlanoDialog';
import { DeletePlanoDialog } from './DeletePlanoDialog';
import { ViewPlanoDialog } from './ViewPlanoDialog';

export default function Planos() {
  const { isAdmin } = useAuth();
  const { planos, loading, fetchPlanos } = usePlanosData();
  const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleViewPlano = (plano: Plano) => {
    setSelectedPlano(plano);
    setViewDialogOpen(true);
  };

  const handleCreatePlano = () => {
    setSelectedPlano(null);
    setCreateDialogOpen(true);
  };

  const handleEditPlano = (plano: Plano) => {
    setSelectedPlano(plano);
    setEditDialogOpen(true);
  };

  const handleDeletePlano = (plano: Plano) => {
    setSelectedPlano(plano);
    setDeleteDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Planos de Discipulado</h1>
            <p className="text-muted-foreground">
              Acesse e gerencie os planos de ensino para discipulado.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchPlanos} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
            {isAdmin() && (
              <Button onClick={handleCreatePlano} size="sm">
                <Plus className="w-4 h-4 mr-2" /> Novo Plano
              </Button>
            )}
          </div>
        </div>

        <PlanosGrid 
          planos={planos}
          loading={loading}
          onView={handleViewPlano}
          onEdit={handleEditPlano}
          onDelete={handleDeletePlano}
          isAdmin={isAdmin()}
        />
      </div>

      {/* Dialogs */}
      <PlanoDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onPlanoCreated={fetchPlanos}
      />

      {selectedPlano && (
        <>
          <ViewPlanoDialog 
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            plano={selectedPlano}
          />

          <PlanoDialog 
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onPlanoCreated={fetchPlanos}
            plano={selectedPlano}
          />

          <DeletePlanoDialog 
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            plano={selectedPlano}
            onPlanoDeleted={fetchPlanos}
          />
        </>
      )}
    </Layout>
  );
}
