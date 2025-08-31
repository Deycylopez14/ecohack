import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tvoetsudgnwbkedehxrp.supabase.co'; // Reemplaza con tu URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2b2V0c3VkZ253YmtlZGVoeHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1ODQxOTEsImV4cCI6MjA3MjE2MDE5MX0.EY9ATAFLhMvPubKMBG4nSqiLUzcYyotWZ4s_WWyZ99g'; // Reemplaza con tu clave

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
