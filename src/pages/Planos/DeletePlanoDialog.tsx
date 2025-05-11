
import { useState } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plano } from '@/types';
import { Loader2 } from 'lucide-react';

interface DeletePlanoDialogProps {
  plano: Plano;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanoDeleted: () => void;
}

export function DeletePlanoDialog({ plano, open, onOpenChange, onPlanoDeleted }: DeletePlanoDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('planos')
        .delete()
        .eq('id', plano.id);

      if (error) throw error;

      toast('Plano excluído', {
        description: 'O plano foi removido com sucesso.',
      });
      
      onPlanoDeleted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao excluir plano:', error);
      toast('Erro ao excluir plano', {
        description: error.message || 'Não foi possível excluir o plano.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o plano{' '}
            <strong>{plano.titulo}</strong> e removerá seus dados do sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Sim, excluir plano'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
