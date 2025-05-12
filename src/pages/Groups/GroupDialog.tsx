import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Grupo } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Grupo;
  onSuccess?: () => void;
}

export default function GroupDialog({ open, onOpenChange, group, onSuccess }: GroupDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  const isEditing = !!group;

  useEffect(() => {
    if (group) {
      setNome(group.nome);
      setDescricao(group.descricao || '');
    } else {
      setNome('');
      setDescricao('');
    }
  }, [group, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast('Erro', { description: 'Nome do grupo é obrigatório' });
      return;
    }

    setLoading(true);

    try {
      if (isEditing && group) {
        // Update existing group
        const { error } = await supabase
          .from('grupos')
          .update({ nome, descricao })
          .eq('id', group.id);

        if (error) throw error;

        toast('Sucesso', { description: 'Grupo atualizado com sucesso!' });
      } else {
        // Create new group
        const { error } = await supabase
          .from('grupos')
          .insert({ 
            nome, 
            descricao, 
            lider_id: user?.id
          });

        if (error) throw error;

        toast('Sucesso', { description: 'Grupo criado com sucesso!' });
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar grupo:', error);
      toast('Erro', { 
        description: `Erro ao ${isEditing ? 'atualizar' : 'criar'} grupo: ${error.message}`,
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Grupo' : 'Criar Grupo'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edite os detalhes do grupo abaixo.' 
                : 'Preencha as informações para criar um novo grupo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Grupo *</Label>
              <Input 
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Grupo Jovem"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o propósito do grupo"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
