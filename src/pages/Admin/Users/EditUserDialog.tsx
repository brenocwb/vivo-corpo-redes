
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { User, UserRole } from '@/types';

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

const formSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  tipo_usuario: z.enum(['admin', 'lider', 'membro'], {
    required_error: 'Selecione um tipo de usuário',
  }),
  grupo_id: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [grupos, setGrupos] = useState<{ id: string; nome: string }[]>([]);
  const [loadingGrupos, setLoadingGrupos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.role,
      grupo_id: user.grupo_id || null,
    },
  });

  // Update form values when user changes
  useEffect(() => {
    form.reset({
      nome: user.nome,
      email: user.email,
      tipo_usuario: user.role,
      grupo_id: user.grupo_id || null,
    });
  }, [user, form]);

  const loadGrupos = async () => {
    setLoadingGrupos(true);
    try {
      const { data, error } = await supabase
        .from('grupos')
        .select('id, nome')
        .order('nome', { ascending: true });
        
      if (error) throw error;
      setGrupos(data || []);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
      toast('Erro ao carregar grupos', {
        description: 'Não foi possível obter os grupos.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoadingGrupos(false);
    }
  };

  const handleDialogOpenChange = (value: boolean) => {
    if (value) {
      loadGrupos();
    }
    onOpenChange(value);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      // Update user in database
      const { error } = await supabase
        .from('users')
        .update({
          nome: values.nome,
          email: values.email,
          tipo_usuario: values.tipo_usuario,
          grupo_id: values.grupo_id,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast('Usuário atualizado com sucesso', {
        description: 'As informações do usuário foram atualizadas.',
      });
      
      onUserUpdated();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast('Erro ao atualizar usuário', {
        description: error.message || 'Não foi possível atualizar o usuário.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="lider">Líder</SelectItem>
                      <SelectItem value="membro">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grupo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo (opcional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || undefined}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {loadingGrupos ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : grupos.length === 0 ? (
                        <SelectItem value="none" disabled>Nenhum grupo encontrado</SelectItem>
                      ) : (
                        grupos.map(grupo => (
                          <SelectItem key={grupo.id} value={grupo.id}>{grupo.nome}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
