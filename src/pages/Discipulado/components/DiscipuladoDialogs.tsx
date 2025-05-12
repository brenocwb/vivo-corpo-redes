
import { Discipulado } from '@/types';
import DiscipuladoDialog from '../DiscipuladoDialog';
import DeleteDiscipuladoDialog from '../DeleteDiscipuladoDialog';
import EncontroDialog from '../EncontroDialog';
import HistoricoEncontrosDialog from '../HistoricoEncontrosDialog';
import { Dispatch, SetStateAction } from 'react';

interface DiscipuladoDialogsProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: Dispatch<SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  encontroDialogOpen: boolean;
  setEncontroDialogOpen: Dispatch<SetStateAction<boolean>>;
  historicoDialogOpen: boolean;
  setHistoricoDialogOpen: Dispatch<SetStateAction<boolean>>;
  selectedDiscipulado: Discipulado | null;
  onDiscipuladoCreated: () => void;
  onDiscipuladoDeleted: () => void;
}

export function DiscipuladoDialogs({
  createDialogOpen,
  setCreateDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  encontroDialogOpen,
  setEncontroDialogOpen,
  historicoDialogOpen,
  setHistoricoDialogOpen,
  selectedDiscipulado,
  onDiscipuladoCreated,
  onDiscipuladoDeleted
}: DiscipuladoDialogsProps) {
  return (
    <>
      <DiscipuladoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDiscipuladoCreated={onDiscipuladoCreated}
      />

      {selectedDiscipulado && (
        <>
          <DeleteDiscipuladoDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            discipulado={selectedDiscipulado}
            onDiscipuladoDeleted={onDiscipuladoDeleted}
          />

          <EncontroDialog
            open={encontroDialogOpen}
            onOpenChange={setEncontroDialogOpen}
            discipuladoId={selectedDiscipulado.id}
          />

          <HistoricoEncontrosDialog
            open={historicoDialogOpen}
            onOpenChange={setHistoricoDialogOpen}
            discipuladoId={selectedDiscipulado.id}
          />
        </>
      )}
    </>
  );
}
