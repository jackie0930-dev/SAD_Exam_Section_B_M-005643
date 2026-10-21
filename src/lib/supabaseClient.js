import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wxmmkzhgngjzvjazsnue.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_47UDNjbJxcCt7ldOeC4rfg_CJTjX_x4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
