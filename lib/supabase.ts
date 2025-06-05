import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtrqvlgdovwqfomgcjiw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cnF2bGdkb3Z3cWZvbWdjaml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTUyMDYsImV4cCI6MjA2NDY3MTIwNn0.D2EW7h0Yo-99qOzr_fuIMNXcsSwh_nY0N_mN4iLe9eo';

export const supabase = createClient(supabaseUrl, supabaseKey);
