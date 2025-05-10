
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUsersList } from './hooks/useUsersList';
import { discipuladoFormSchema, type DiscipuladoFormValues } from './schemas/discipuladoSchema';
import { DiscipuladorSelect } from './components/DiscipuladorSelect';
import { DiscipuloSelect } from './components/DiscipuloSelect';
import { checkExistingDiscipulado, createDiscipulado } from './services/discipuladoService';

// Props and interfaces
interface DiscipuladoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscipuladoCreated: () => void;
}

export default function DiscipuladoDialog({ 
  open, 
  onOpenChange, 
  onDiscipuladoCreated 
}: DiscipuladoDialogProps) {
  const { user, isAdmin } = useAuth();
  const { users, loading, loadUsers } = useUsersList();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<DiscipuladoFormValues>({
    resolver: zodResolver(discipuladoFormSchema),
    defaultValues: {
      discipulador_id: user?.id || '',
      discipulo_id: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadUsers();
      // Set current user as the default discipulador if not admin
      if (!isAdmin() && user) {
        form.setValue('discipulador_id', user.id);
      }
    }
  }, [open, user, isAdmin, form]);

  const onSubmit = async (values: DiscipuladoFormValues) => {
    setSubmitting(true);
    try {
      // Check if this discipulado already exists
      const exists = await checkExistingDiscipulado(values.discipulador_id, values.discipulo_id);
      
      if (exists) {
        toast('Discipulado já existe', {
          description: 'Este relacionamento de discipulado já está registrado.',
          style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
        });
        setSubmitting(false);
        return;
      }
      
      // Create new discipulado
      await createDiscipulado(values.discipulador_id, values.discipulo_id);
      
      toast('Discipulado criado com sucesso', {
        description: 'Um novo relacionamento de discipulado foi registrado.',
      });
      
      form.reset();
      onDiscipuladoCreated();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao criar discipulado:', error);
      toast('Erro ao criar discipulado', {
        description: error.message || 'Não foi possível criar o discipulado.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Discipulado</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <DiscipuladorSelect 
              control={form.control}
              users={users}
              loading={loading}
            />

            <DiscipuloSelect 
              control={form.control}
              users={users}
              loading={loading}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Discipulado
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
