import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(url && key && !url.includes('YOUR_PROJECT'));
export const supabase = hasSupabaseConfig ? createClient(url, key) : null;
