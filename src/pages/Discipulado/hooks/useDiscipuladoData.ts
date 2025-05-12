
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Define the Discipulado type
export interface Discipulado {
  id: string;
  discipulador_id: string;
  discipulo_id: string;
  criado_em: string;
  discipulador?: {
    nome: string;
  };
  discipulo?: {
    nome: string;
  };
}

export const useDiscipuladoData = () => {
  const [discipulados, setDiscipulados] = useState<Discipulado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDiscipulados = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('discipulados')
        .select(`
          *,
          discipulador:discipulador_id(nome),
          discipulo:discipulo_id(nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      
      setDiscipulados(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar discipulados:', error);
      toast.error('Erro ao carregar discipulados', {
        description: error.message || 'Não foi possível obter a lista de discipulados.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscipulados();
  }, []);

  return { discipulados, loading, fetchDiscipulados };
};
