import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isMock = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
