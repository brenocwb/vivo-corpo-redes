
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plano } from '@/types';
import { Check, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ViewPlanoDialogProps {
  plano: Plano;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewPlanoDialog({ plano, open, onOpenChange }: ViewPlanoDialogProps) {
  const etapas = Array.isArray(plano.etapas) ? plano.etapas : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{plano.titulo}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2 mb-4 text-muted-foreground">
          {plano.descricao || "Sem descrição disponível."}
        </div>

        <h3 className="font-medium text-lg mb-2">Etapas do Plano</h3>
        
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="space-y-6">
            {etapas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Este plano não possui etapas definidas.</p>
            ) : (
              etapas.map((etapa, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 bg-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full">
                      {index + 1}
                    </Badge>
                    <h4 className="font-medium">{etapa.titulo}</h4>
                  </div>

                  {etapa.descricao && (
                    <p className="text-sm text-muted-foreground mb-3 ml-9">
                      {etapa.descricao}
                    </p>
                  )}

                  {Array.isArray(etapa.recursos) && etapa.recursos.length > 0 && (
                    <div className="ml-9 mt-3">
                      <h5 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                        Recursos
                      </h5>
                      <ul className="space-y-1">
                        {etapa.recursos
                          .filter(recurso => recurso && recurso.trim() !== '')
                          .map((recurso, idx) => {
                            // Verifica se o recurso é uma URL para mostrar como link clicável
                            const isUrl = recurso.startsWith('http://') || recurso.startsWith('https://');
                            
                            return (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {isUrl ? (
                                  <a 
                                    href={recurso} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary hover:underline flex items-center"
                                  >
                                    {recurso.length > 50 ? `${recurso.substring(0, 50)}...` : recurso}
                                    <Link className="h-3 w-3 ml-1 flex-shrink-0" />
                                  </a>
                                ) : (
                                  <span>{recurso}</span>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 mt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
