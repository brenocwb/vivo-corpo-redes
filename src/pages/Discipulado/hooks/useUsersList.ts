
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface User {
  id: string;
  nome: string;
  tipo_usuario?: string;
}

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, nome, tipo_usuario')
        .order('nome', { ascending: true });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast('Erro ao carregar usuários', {
        description: 'Não foi possível obter a lista de usuários.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };
  
  return { users, loading, loadUsers };
};
