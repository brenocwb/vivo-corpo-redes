
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';

export interface Discipulado {
  id: string;
  discipulador_id: string;
  discipulo_id: string;
  criado_em: string;
  discipulador_nome: string;
  discipulo_nome: string;
}

export const useDiscipuladoData = (user: User | null) => {
  const { isAdmin, isDiscipulador } = useAuth();
  const [discipulados, setDiscipulados] = useState<Discipulado[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscipulados = async () => {
    setLoading(true);
    try {
      // Separate fetches to avoid join errors
      let query = supabase
        .from('discipulados')
        .select('id, discipulador_id, discipulo_id, criado_em');

      // Filter by discipulador_id if user is discipulador but not admin
      if (isDiscipulador() && !isAdmin() && user) {
        query = query.eq('discipulador_id', user.id);
      }

      const { data, error } = await query.order('criado_em', { ascending: false });

      if (error) throw error;

      if (data) {
        // Create an array to store the formatted discipulados
        const formattedDiscipulados: Discipulado[] = [];
        
        // Process each discipulado and fetch related names
        for (const item of data) {
          // Fetch discipulador name
          const { data: discipuladorData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', item.discipulador_id)
            .single();
          
          // Fetch discipulo name
          const { data: discipuloData } = await supabase
            .from('users')
            .select('nome')
            .eq('id', item.discipulo_id)
            .single();
          
          // Create formatted discipulado with names
          const formattedDiscipulado: Discipulado = {
            ...item,
            discipulador_nome: discipuladorData?.nome || 'Não definido',
            discipulo_nome: discipuloData?.nome || 'Não definido'
          };
          
          formattedDiscipulados.push(formattedDiscipulado);
        }
        
        setDiscipulados(formattedDiscipulados);
      }
    } catch (error: any) {
      console.error('Erro ao buscar discipulados:', error);
      toast('Erro ao carregar discipulados', {
        description: error.message || 'Não foi possível obter a lista de discipulados.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDiscipulados();
    }
  }, [user]);

  return { discipulados, loading, fetchDiscipulados };
};
