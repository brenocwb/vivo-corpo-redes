
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvckemylcqzekfzqjscm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Y2tlbXlsY3F6ZWtmenFqc2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Nzc5NzcsImV4cCI6MjA2MjM1Mzk3N30.rlwghlZ0G14C8lGXmdrgxzY9toatNCPgpTgdy1UZHKU';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
