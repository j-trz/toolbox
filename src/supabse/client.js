
import { createClient } from '@supabase/supabase-js';

// Pega aquí la URL y la clave 'anon' que obtuviste de la configuración de tu proyecto en Supabase.
const supabaseUrl = 'https://epoghpspraryorpalkuo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb2docHNwcmFyeW9ycGFsa3VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDQ5OTMsImV4cCI6MjA2MzUyMDk5M30.ooamFNCnhqMlfRv_iql8aYAehcMsbS_uIB5JMw5c4qw';

// Exportamos el cliente de Supabase para usarlo en toda la aplicación.
export const supabase = createClient(supabaseUrl, supabaseKey);
