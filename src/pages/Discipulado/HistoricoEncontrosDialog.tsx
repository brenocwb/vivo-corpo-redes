
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Calendar } from 'lucide-react';

interface HistoricoEncontrosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discipuladoId: string;
  discipuladorNome: string;
  discipuloNome: string;
}

interface Encontro {
  id: string;
  data: string;
  tema: string;
  anotacoes?: string;
  criado_em: string;
}

export default function HistoricoEncontrosDialog({
  open,
  onOpenChange,
  discipuladoId,
  discipuladorNome,
  discipuloNome,
}: HistoricoEncontrosDialogProps) {
  const [encontros, setEncontros] = useState<Encontro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEncontros = async () => {
    if (!discipuladoId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('encontros')
        .select('*')
        .eq('discipulado_id', discipuladoId)
        .order('data', { ascending: false });

      if (error) throw error;
      
      setEncontros(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar histórico de encontros:', error);
      toast('Erro ao buscar histórico', {
        description: error.message || 'Não foi possível obter o histórico de encontros.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && discipuladoId) {
      fetchEncontros();
    }
  }, [open, discipuladoId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Histórico de Encontros</DialogTitle>
        </DialogHeader>
        
        <div className="text-sm text-muted-foreground mb-4">
          <p>Discipulador: <span className="font-semibold">{discipuladorNome}</span></p>
          <p>Discípulo: <span className="font-semibold">{discipuloNome}</span></p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : encontros.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p>Nenhum encontro registrado ainda.</p>
            <p className="text-sm text-muted-foreground">
              Registre um novo encontro para começar a acompanhar o progresso do discipulado.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {encontros.map((encontro) => (
                <div key={encontro.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{encontro.tema}</h3>
                    <span className="bg-muted px-2 py-1 rounded text-xs">
                      {format(parseISO(encontro.data), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  
                  {encontro.anotacoes && (
                    <div className="mt-2">
                      <p className="text-sm whitespace-pre-line">{encontro.anotacoes}</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Registrado em {format(parseISO(encontro.criado_em), "d/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
