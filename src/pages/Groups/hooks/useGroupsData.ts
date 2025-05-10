
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Group {
  id: string;
  nome: string;
  lider_id: string;
  local?: string;
  dia_semana?: string;
  criado_em: string;
  lider_nome?: string;
}

export const useGroupsData = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Fetch groups with separate query for leader names to avoid join errors
      const { data: groupsData, error } = await supabase
        .from('grupos')
        .select('id, nome, lider_id, local, dia_semana, criado_em')
        .order('nome', { ascending: true });

      if (error) throw error;

      if (groupsData) {
        // Create an array to store the formatted groups
        const formattedGroups: Group[] = [];
        
        // Process each group data and fetch leader name separately
        for (const group of groupsData) {
          // Fetch leader name from users table
          const { data: leaderData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', group.lider_id)
            .single();
          
          // Create formatted group with leader name
          const formattedGroup: Group = {
            ...group,
            lider_nome: leaderData?.nome || 'Não definido'
          };
          
          formattedGroups.push(formattedGroup);
        }
        
        setGroups(formattedGroups);
      }
    } catch (error: any) {
      console.error('Erro ao buscar grupos:', error);
      toast('Erro ao carregar grupos', {
        description: error.message || 'Não foi possível obter a lista de grupos.',
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return { groups, loading, fetchGroups };
};
