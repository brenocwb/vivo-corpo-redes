
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

const formSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
  tipo_usuario: z.enum(['admin', 'lider', 'membro'], {
    required_error: 'Selecione um tipo de usuário',
  }),
  grupo_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateUserDialog({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) {
  const [grupos, setGrupos] = useState<{ id: string; nome: string }[]>([]);
  const [loadingGrupos, setLoadingGrupos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      password: '',
      tipo_usuario: 'membro',
    },
  });

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
      // Create user in users table first
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            nome: values.nome,
            email: values.email,
            tipo_usuario: values.tipo_usuario,
            grupo_id: values.grupo_id || null,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Create auth user
      // Note: In a real-world scenario, this should be done through a Supabase Edge Function
      // with admin privileges, as client-side auth creation isn't possible.
      // This is simplified for demonstration.

      // For educational purposes only - this would need server-side implementation:
      /*
      const { error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
      });

      if (authError) {
        // Rollback user creation in public table if auth creation fails
        await supabase.from('users').delete().eq('id', data.id);
        throw authError;
      }
      */

      // Simulate auth user creation success:
      toast('Usuário criado com sucesso', {
        description: 'Um novo usuário foi adicionado ao sistema.',
      });
      
      form.reset();
      onUserCreated();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      toast('Erro ao criar usuário', {
        description: error.message || 'Não foi possível criar o usuário.',
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
          <DialogTitle>Criar Novo Usuário</DialogTitle>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="●●●●●●" {...field} />
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
                Criar Usuário
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
