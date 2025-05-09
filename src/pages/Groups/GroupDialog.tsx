
import { useState, useEffect } from 'react';
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

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    id: string;
    nome: string;
    lider_id?: string;
    local?: string;
    dia_semana?: string;
  } | null;
  onGroupSaved: () => void;
}

const formSchema = z.object({
  nome: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  lider_id: z.string().optional(),
  local: z.string().optional(),
  dia_semana: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GroupDialog({ open, onOpenChange, group, onGroupSaved }: GroupDialogProps) {
  const [leaders, setLeaders] = useState<{ id: string; nome: string }[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!group;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: group?.nome || '',
      lider_id: group?.lider_id || undefined,
      local: group?.local || '',
      dia_semana: group?.dia_semana || '',
    },
  });

  // Update form when group changes
  useEffect(() => {
    if (group) {
      form.reset({
        nome: group.nome || '',
        lider_id: group.lider_id || undefined,
        local: group.local || '',
        dia_semana: group.dia_semana || '',
      });
    } else {
      form.reset({
        nome: '',
        lider_id: undefined,
        local: '',
        dia_semana: '',
      });
    }
  }, [group, form]);

  const loadLeaders = async () => {
    setLoadingLeaders(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome')
        .in('tipo_usuario', ['admin', 'lider'])
        .order('nome', { ascending: true });
        
      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error('Erro ao carregar líderes:', error);
      toast('Erro ao carregar líderes', {
        description: 'Não foi possível obter a lista de líderes.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoadingLeaders(false);
    }
  };

  const handleDialogOpenChange = (value: boolean) => {
    if (value) {
      loadLeaders();
    }
    onOpenChange(value);
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        // Update existing group
        const { error } = await supabase
          .from('grupos')
          .update({
            nome: values.nome,
            lider_id: values.lider_id || null,
            local: values.local || null,
            dia_semana: values.dia_semana || null,
          })
          .eq('id', group.id);

        if (error) throw error;
        
        toast('Grupo atualizado com sucesso', {
          description: 'As informações do grupo foram atualizadas.',
        });
      } else {
        // Create new group
        const { error } = await supabase
          .from('grupos')
          .insert([
            {
              nome: values.nome,
              lider_id: values.lider_id || null,
              local: values.local || null,
              dia_semana: values.dia_semana || null,
            }
          ]);

        if (error) throw error;
        
        toast('Grupo criado com sucesso', {
          description: 'Um novo grupo foi adicionado.',
        });
      }
      
      form.reset();
      onGroupSaved();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao salvar grupo:', error);
      toast('Erro ao salvar grupo', {
        description: error.message || 'Não foi possível salvar o grupo.',
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
          <DialogTitle>{isEditing ? 'Editar Grupo' : 'Criar Novo Grupo'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Grupo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do grupo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lider_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Líder</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um líder" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não definido</SelectItem>
                      {loadingLeaders ? (
                        <SelectItem value="loading" disabled>Carregando...</SelectItem>
                      ) : leaders.length === 0 ? (
                        <SelectItem value="none" disabled>Nenhum líder encontrado</SelectItem>
                      ) : (
                        leaders.map(leader => (
                          <SelectItem key={leader.id} value={leader.id}>{leader.nome}</SelectItem>
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
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Local do encontro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dia_semana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia da Semana</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Não definido</SelectItem>
                      <SelectItem value="domingo">Domingo</SelectItem>
                      <SelectItem value="segunda">Segunda-feira</SelectItem>
                      <SelectItem value="terca">Terça-feira</SelectItem>
                      <SelectItem value="quarta">Quarta-feira</SelectItem>
                      <SelectItem value="quinta">Quinta-feira</SelectItem>
                      <SelectItem value="sexta">Sexta-feira</SelectItem>
                      <SelectItem value="sabado">Sábado</SelectItem>
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
                {isEditing ? 'Salvar Alterações' : 'Criar Grupo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
