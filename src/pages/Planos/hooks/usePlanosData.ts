
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plano } from '@/types';

export const usePlanosData = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlanos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;

      setPlanos(data || []);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      toast('Erro ao carregar planos', {
        description: 'Não foi possível obter a lista de planos.',
        style: { backgroundColor: 'hsl(var(--destructive))' } as React.CSSProperties
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  return { planos, loading, fetchPlanos };
};
