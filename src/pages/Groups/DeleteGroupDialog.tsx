
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DeleteGroupDialogProps {
  group: {
    id: string;
    nome: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupDeleted: () => void;
}

export default function DeleteGroupDialog({ group, open, onOpenChange, onGroupDeleted }: DeleteGroupDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('grupos')
        .delete()
        .eq('id', group.id);

      if (error) throw error;

      toast('Grupo excluído com sucesso', {
        description: 'O grupo foi removido do sistema.',
      });
      
      onGroupDeleted();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao excluir grupo:', error);
      toast('Erro ao excluir grupo', {
        description: error.message || 'Não foi possível excluir o grupo.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
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
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o grupo{' '}
            <strong>{group.nome}</strong> e removerá seus dados do nosso sistema.
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
              'Sim, excluir grupo'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
