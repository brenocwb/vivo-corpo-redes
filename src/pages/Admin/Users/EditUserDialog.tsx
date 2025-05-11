
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, UserRole } from '@/types';

const userSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  email: z.string().email('Email inválido'),
  tipo_usuario: z.enum(['admin', 'discipulador', 'discipulo', 'lider', 'membro']),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nome: '',
      email: '',
      tipo_usuario: 'discipulo' as UserRole,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.role as UserRole,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          nome: values.nome,
          email: values.email,
          tipo_usuario: values.tipo_usuario,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast('Usuário atualizado', {
        description: 'As informações do usuário foram atualizadas com sucesso.'
      });
      
      onUserUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      toast('Erro ao atualizar usuário', {
        description: error.message || 'Não foi possível atualizar as informações do usuário.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Usuário</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="discipulador">Discipulador</SelectItem>
                    <SelectItem value="discipulo">Discípulo</SelectItem>
                    <SelectItem value="lider">Líder</SelectItem>
                    <SelectItem value="membro">Membro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

// Adicionado para compatibilidade com importações existentes
export default EditUserDialog;
