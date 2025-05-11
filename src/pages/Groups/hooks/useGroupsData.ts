
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Grupo } from '@/types';

export const useGroupsData = () => {
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('grupos')
        .select(`
          id,
          nome, 
          descricao,
          lider_id,
          created_at
        `)
        .order('nome', { ascending: true });

      if (error) throw error;

      if (data) {
        setGroups(data as Grupo[]);
      }
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error);
      toast('Erro ao carregar grupos', {
        description: 'Não foi possível obter a lista de grupos.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  // Call fetchGroups on component mount
  useState(() => {
    fetchGroups();
  });

  return { groups, loading, fetchGroups };
};
