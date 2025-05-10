import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'SUA_URL_SUPABASE';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANONIMA';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
  }
});
