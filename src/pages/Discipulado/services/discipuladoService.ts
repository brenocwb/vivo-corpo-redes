
import { supabase } from '@/integrations/supabase/client';

export const checkExistingDiscipulado = async (discipuladorId: string, discipuloId: string) => {
  const { data, error } = await supabase
    .from('discipulados')
    .select('id')
    .eq('discipulador_id', discipuladorId)
    .eq('discipulo_id', discipuloId)
    .maybeSingle();
  
  if (error) throw error;
  return data !== null;
};

export const createDiscipulado = async (discipuladorId: string, discipuloId: string) => {
  const { error } = await supabase
    .from('discipulados')
    .insert([
      {
        discipulador_id: discipuladorId,
        discipulo_id: discipuloId,
      }
    ]);

  if (error) throw error;
  return true;
};
