/**
 * Supabase configuration shared by the public site and the admin area.
 *
 * The public site deliberately does NOT import @supabase/supabase-js — it only
 * needs two anonymous reads, which are done with fetch() so visitors don't
 * download the SDK. The admin area imports the full client separately.
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export const MEDIA_BUCKET = 'media'

/** Anonymous REST read. Returns parsed JSON or throws. */
export async function restSelect(path, { signal } = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json'
    },
    signal
  })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return response.json()
}

/**
 * Resolve a stored image reference to a URL.
 * Absolute URLs and paths starting with "/" are returned untouched, so
 * bundled assets such as /assets/portrait.svg keep working.
 */
export function mediaPublicUrl(path) {
  if (!path) return ''
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:')) return path
  if (!SUPABASE_URL) return path
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`
}
