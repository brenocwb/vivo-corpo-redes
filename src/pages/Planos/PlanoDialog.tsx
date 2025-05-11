
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { planoSchema, PlanoFormValues } from './schemas/planoSchema';
import { supabase } from '@/lib/supabase';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PlanoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanoCreated?: () => void;
  plano?: any;
}

export function PlanoDialog({ open, onOpenChange, onPlanoCreated, plano }: PlanoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!plano;

  const defaultValues: PlanoFormValues = {
    nome: plano?.titulo || '',
    descricao: plano?.descricao || '',
    etapas: plano?.etapas || [{ titulo: '', descricao: '', ordem: 0, recursos: [''] }],
  };

  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "etapas",
  });

  const onSubmit = async (data: PlanoFormValues) => {
    setIsSubmitting(true);
    
    try {
      const planoData = {
        nome: data.nome,
        descricao: data.descricao,
        etapas: data.etapas.map((etapa, index) => ({
          ...etapa,
          ordem: index + 1,
          recursos: etapa.recursos?.filter(r => r.trim() !== '') || []
        })),
      };
      
      if (isEditing) {
        const { error } = await supabase
          .from('planos')
          .update(planoData)
          .eq('id', plano.id);

        if (error) throw error;
        
        toast('Plano atualizado', {
          description: 'O plano foi atualizado com sucesso.'
        });
      } else {
        const { error } = await supabase
          .from('planos')
          .insert([planoData]);

        if (error) throw error;
        
        toast('Plano criado', {
          description: 'O plano foi criado com sucesso.'
        });
      }
      
      if (onPlanoCreated) onPlanoCreated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao salvar plano:', error);
      toast('Erro ao salvar plano', {
        description: error.message || 'Ocorreu um erro ao salvar o plano.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEtapa = () => {
    append({ 
      titulo: '', 
      descricao: '', 
      ordem: fields.length + 1,
      recursos: [''] 
    });
  };

  const handleAddRecurso = (etapaIndex: number) => {
    const currentEtapa = form.getValues(`etapas.${etapaIndex}`);
    const recursos = currentEtapa.recursos || [];
    form.setValue(`etapas.${etapaIndex}.recursos`, [...recursos, '']);
  };

  const handleRemoveRecurso = (etapaIndex: number, recursoIndex: number) => {
    const currentEtapa = form.getValues(`etapas.${etapaIndex}`);
    const recursos = [...(currentEtapa.recursos || [])];
    recursos.splice(recursoIndex, 1);
    form.setValue(`etapas.${etapaIndex}.recursos`, recursos);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Plano</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Fundamentos da Fé" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva o objetivo e conteúdo do plano..." 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Etapas do Plano</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddEtapa}
                >
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Etapa
                </Button>
              </div>

              <Accordion type="multiple" className="w-full">
                {fields.map((etapa, index) => (
                  <AccordionItem key={etapa.id} value={`etapa-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center">
                        <span className="font-medium">
                          {form.watch(`etapas.${index}.titulo`) || `Etapa ${index + 1}`}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 p-4 bg-muted/50 rounded-md">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Detalhes da Etapa</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`etapas.${index}.titulo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: Introdução à Oração" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`etapas.${index}.descricao`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Descreva o conteúdo e objetivos desta etapa..." 
                                  rows={2}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <FormLabel>Recursos</FormLabel>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAddRecurso(index)}
                            >
                              <Plus className="w-3 h-3 mr-1" /> Recurso
                            </Button>
                          </div>
                          
                          {form.watch(`etapas.${index}.recursos`)?.map((_, recursoIndex) => (
                            <div key={recursoIndex} className="flex gap-2">
                              <FormField
                                control={form.control}
                                name={`etapas.${index}.recursos.${recursoIndex}`}
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormControl>
                                      <Input {...field} placeholder="Link ou referência do recurso" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRecurso(index, recursoIndex)}
                                className="h-10 w-10"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
