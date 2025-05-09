
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Props and interfaces
interface DiscipuladoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscipuladoCreated: () => void;
}

interface User {
  id: string;
  nome: string;
  tipo_usuario?: string;
}

// Form schema for validation
const formSchema = z.object({
  discipulador_id: z.string({
    required_error: 'Selecione um discipulador'
  }),
  discipulo_id: z.string({
    required_error: 'Selecione um discípulo'
  }),
}).refine(data => data.discipulador_id !== data.discipulo_id, {
  message: "Discipulador e discípulo não podem ser a mesma pessoa",
  path: ["discipulo_id"]
});

type FormValues = z.infer<typeof formSchema>;

// Custom hooks
const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, tipo_usuario')
        .order('nome', { ascending: true });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast('Erro ao carregar usuários', {
        description: 'Não foi possível obter a lista de usuários.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };
  
  return { users, loading, loadUsers };
};

export default function DiscipuladoDialog({ 
  open, 
  onOpenChange, 
  onDiscipuladoCreated 
}: DiscipuladoDialogProps) {
  const { user, isAdmin } = useAuth();
  const { users, loading, loadUsers } = useUsersList();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const checkExistingDiscipulado = async (discipuladorId: string, discipuloId: string) => {
    const { data, error } = await supabase
      .from('discipulados')
      .select('id')
      .eq('discipulador_id', discipuladorId)
      .eq('discipulo_id', discipuloId)
      .maybeSingle();
    
    if (error) throw error;
    return data !== null;
  };

  const onSubmit = async (values: FormValues) => {
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
      const { error } = await supabase
        .from('discipulados')
        .insert([
          {
            discipulador_id: values.discipulador_id,
            discipulo_id: values.discipulo_id,
          }
        ]);

      if (error) throw error;
      
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
            <FormField
              control={form.control}
              name="discipulador_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discipulador</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!isAdmin() && user?.id === field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um discipulador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : users.length === 0 ? (
                        <SelectItem value="none" disabled>Nenhum usuário encontrado</SelectItem>
                      ) : (
                        // Filtrando para mostrar apenas admin e líderes como discipuladores
                        users
                          .filter(user => ['admin', 'lider'].includes(user.tipo_usuario || ''))
                          .map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.nome}</SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discipulo_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discípulo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um discípulo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : users.length === 0 ? (
                        <SelectItem value="none" disabled>Nenhum usuário encontrado</SelectItem>
                      ) : (
                        users.map(user => (
                          <SelectItem key={user.id} value={user.id}>{user.nome}</SelectItem>
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
                Criar Discipulado
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
