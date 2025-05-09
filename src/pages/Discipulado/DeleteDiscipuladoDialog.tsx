
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from("discipulados").delete().eq("id", discipulado.id);

      if (error) {
        toast('Erro ao excluir discipulado', {
          description: error.message,
          style: { backgroundColor: 'hsl(var(--destructive))' }
        });
        throw error;
      } else {
        toast('Discipulado excluído com sucesso', {
          description: 'O relacionamento de discipulado foi removido.'
        });
        onDiscipuladoDeleted();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao excluir discipulado:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Confirmar exclusão</h2>
          <p>Tem certeza que deseja excluir este discipulado?</p>
          <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
