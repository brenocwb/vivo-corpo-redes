
import { Discipulado } from '../hooks/useDiscipuladoData';
import DiscipuladoDialog from '../DiscipuladoDialog';
import DeleteDiscipuladoDialog from '../DeleteDiscipuladoDialog';
import EncontroDialog from '../EncontroDialog';
import HistoricoEncontrosDialog from '../HistoricoEncontrosDialog';

interface DiscipuladoDialogsProps {
  createDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  encontroDialogOpen: boolean;
  setEncontroDialogOpen: (open: boolean) => void;
  historicoDialogOpen: boolean;
  setHistoricoDialogOpen: (open: boolean) => void;
  selectedDiscipulado: Discipulado | null;
  onDiscipuladoCreated: () => void;
  onDiscipuladoDeleted: () => void;
}

export const DiscipuladoDialogs = ({
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
}: DiscipuladoDialogsProps) => {
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
    </>
  );
};
