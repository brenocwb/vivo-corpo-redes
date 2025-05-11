
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, BookOpen } from 'lucide-react';
import { Plano } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface PlanoCardProps {
  plano: Plano;
  onView: (plano: Plano) => void;
  onEdit: (plano: Plano) => void;
  onDelete: (plano: Plano) => void;
  isAdmin: boolean;
}

export function PlanoCard({ plano, onView, onEdit, onDelete, isAdmin }: PlanoCardProps) {
  const etapasCount = Array.isArray(plano.etapas) ? plano.etapas.length : 0;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{plano.titulo}</CardTitle>
            <CardDescription className="text-sm mt-1">
              Criado em {formatDate(plano.created_at)}
            </CardDescription>
          </div>
          <Badge variant="outline">{etapasCount} etapas</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {plano.descricao || "Sem descrição disponível."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" onClick={() => onView(plano)}>
          <BookOpen className="h-4 w-4 mr-2" /> Ver Plano
        </Button>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(plano)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(plano)}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
