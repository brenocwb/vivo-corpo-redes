
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UsersRound } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { discipuladoFormSchema, DiscipuladoFormValues } from './schemas/discipuladoSchema';

// Components
import DiscipuladorSelect from './components/DiscipuladorSelect';
import DiscipuloSelect from './components/DiscipuloSelect';

interface DiscipuladoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscipuladoCreated?: () => void;
}

export default function DiscipuladoDialog({
  open,
  onOpenChange,
  onDiscipuladoCreated,
}: DiscipuladoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discipuladoresData, setDiscipuladoresData] = useState<{id: string, nome: string}[]>([]);
  const [discipulosData, setDiscipulosData] = useState<{id: string, nome: string}[]>([]);
  
  const form = useForm<DiscipuladoFormValues>({
    resolver: zodResolver(discipuladoFormSchema),
    defaultValues: {
      discipulador_id: '',
      discipulo_id: '',
    }
  });

  // Função para carregar discipuladores (usuários com role 'discipulador' ou 'lider')
  const loadDiscipuladores = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome')
        .in('tipo_usuario', ['discipulador', 'lider']) 
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setDiscipuladoresData(data || []);
    } catch (error) {
      console.error('Erro ao carregar discipuladores:', error);
      toast('Erro ao carregar lista de discipuladores', {
        description: 'Não foi possível obter a lista de discipuladores.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    }
  };

  // Função para carregar discípulos (usuários com role 'discipulo' ou 'membro')
  const loadDiscipulos = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome')
        .in('tipo_usuario', ['discipulo', 'membro'])
        .order('nome', { ascending: true });
      
      if (error) throw error;
      setDiscipulosData(data || []);
    } catch (error) {
      console.error('Erro ao carregar discípulos:', error);
      toast('Erro ao carregar lista de discípulos', {
        description: 'Não foi possível obter a lista de discípulos.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    }
  };

  // Carregar os dados quando o diálogo abrir
  useEffect(() => {
    if (open) {
      loadDiscipuladores();
      loadDiscipulos();
      form.reset();
    }
  }, [open, form]);

  // Função para criar o relacionamento de discipulado
  const onSubmit = async (values: DiscipuladoFormValues) => {
    setIsSubmitting(true);
    try {
      // Verificar se já existe um relacionamento entre esses usuários
      const { data: existingData, error: checkError } = await supabase
        .from('discipulados')
        .select('id')
        .eq('discipulador_id', values.discipulador_id)
        .eq('discipulo_id', values.discipulo_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingData) {
        toast('Relacionamento já existe', {
          description: 'Já existe um relacionamento de discipulado entre esses usuários.',
          style: { backgroundColor: 'hsl(var(--warning))' } as React.CSSProperties
        });
        return;
      }
      
      // Criar o novo relacionamento
      const { error: insertError } = await supabase
        .from('discipulados')
        .insert({
          discipulador_id: values.discipulador_id,
          discipulo_id: values.discipulo_id
        });
      
      if (insertError) throw insertError;
      
      toast('Discipulado criado', {
        description: 'O relacionamento de discipulado foi criado com sucesso.'
      });
      
      onOpenChange(false);
      if (onDiscipuladoCreated) onDiscipuladoCreated();
    } catch (error: any) {
      console.error('Erro ao criar discipulado:', error);
      toast('Erro ao criar discipulado', {
        description: error.message || 'Não foi possível criar o relacionamento de discipulado.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" />
            Novo Discipulado
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="discipulador_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discipulador</FormLabel>
                  <FormControl>
                    <DiscipuladorSelect 
                      value={field.value} 
                      onChange={field.onChange} 
                      options={discipuladoresData.map(d => ({ 
                        value: d.id, 
                        label: d.nome 
                      }))} 
                    />
                  </FormControl>
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
                  <FormControl>
                    <DiscipuloSelect 
                      value={field.value} 
                      onChange={field.onChange} 
                      options={discipulosData.map(d => ({ 
                        value: d.id, 
                        label: d.nome 
                      }))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
