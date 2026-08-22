import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from './supabase.js'

/**
 * Full Supabase client — auth, writes and storage.
 * Imported only by the admin area so it stays out of the public bundle.
 */
export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'panji-portfolio-auth'
      }
    })
  : null
