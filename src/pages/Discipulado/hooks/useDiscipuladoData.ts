
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const useDiscipuladoData = () => {
  const [discipulados, setDiscipulados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDiscipulados = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discipulados')
        .select(`
          id,
          criado_em,
          discipulador_id,
          discipulador:discipulador_id(id, nome),
          discipulo_id,
          discipulo:discipulo_id(id, nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;

      setDiscipulados(data || []);
    } catch (error) {
      console.error('Erro ao buscar discipulados:', error);
      toast('Erro ao carregar discipulados', {
        description: 'Não foi possível obter a lista de discipulados.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipulados();
  }, [user]); // Add user as dependency

  return { discipulados, loading, fetchDiscipulados };
};
