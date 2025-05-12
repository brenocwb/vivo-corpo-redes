import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from 'lucide-react';

interface ViewGroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
}

interface Member {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: string;
}

export default function ViewGroupMembersDialog({ 
  open, 
  onOpenChange, 
  groupId,
  groupName
}: ViewGroupMembersDialogProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGroupMembers = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, email, tipo_usuario')
        .eq('grupo_id', groupId)
        .order('nome', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar membros do grupo:', error);
      toast('Erro ao carregar membros', {
        description: error.message || 'Não foi possível obter os membros do grupo.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && groupId) {
      fetchGroupMembers();
    }
  }, [open, groupId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Membros do Grupo: {groupName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="text-center py-4">Carregando membros...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-4">Nenhum membro neste grupo.</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <ul className="divide-y">
                {members.map(member => (
                  <li key={member.id} className="py-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{member.nome}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.tipo_usuario}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
