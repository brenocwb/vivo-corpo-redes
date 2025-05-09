import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DeleteDiscipuladoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discipulado: { id: string };
  onDiscipuladoDeleted: () => void;
}

export default function DeleteDiscipuladoDialog({
  open,
  onOpenChange,
  discipulado,
  onDiscipuladoDeleted,
}: DeleteDiscipuladoDialogProps) {
  const handleDelete = async () => {
    const { error } = await supabase.from("discipulados").delete().eq("id", discipulado.id);

    if (error) {
      toast.error("Erro ao excluir discipulado");
    } else {
      toast.success("Discipulado excluído com sucesso");
      onDiscipuladoDeleted();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirmar exclusão</h2>
          <p>Tem certeza que deseja excluir este discipulado?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
