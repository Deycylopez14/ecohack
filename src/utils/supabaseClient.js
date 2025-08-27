import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://TU_SUPABASE_URL.supabase.co'; // Reemplaza con tu URL
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY'; // Reemplaza con tu clave

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
