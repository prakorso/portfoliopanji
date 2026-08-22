import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured, MEDIA_BUCKET, mediaPublicUrl } from '../lib/supabase.js'
import { supabase } from '../lib/supabaseClient.js'

const FOLDER = 'uploads'
const MAX_BYTES = 8 * 1024 * 1024

const safeName = (name) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, (ext) => ext)
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')

/** Lists, uploads, replaces and deletes files in the Supabase `media` bucket. */
export function useMedia() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    setLoading(true)
    try {
      const { data, error: listError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list(FOLDER, { limit: 200, sortBy: { column: 'created_at', order: 'desc' } })
      if (listError) throw listError
      setFiles(
        (data ?? [])
          .filter((f) => f.id || f.metadata)
          .map((f) => ({
            name: f.name,
            path: `${FOLDER}/${f.name}`,
            url: mediaPublicUrl(`${FOLDER}/${f.name}`),
            size: f.metadata?.size ?? 0,
            type: f.metadata?.mimetype ?? '',
            createdAt: f.created_at
          }))
      )
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const upload = useCallback(
    async (file, { replacePath } = {}) => {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
      if (file.size > MAX_BYTES) throw new Error('File is larger than 8 MB.')
      setBusy(true)
      try {
        const path = replacePath ?? `${FOLDER}/${Date.now()}-${safeName(file.name)}`
        const { error: uploadError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { upsert: Boolean(replacePath), cacheControl: '3600' })
        if (uploadError) throw uploadError
        await refresh()
        return { path, url: mediaPublicUrl(path) }
      } finally {
        setBusy(false)
      }
    },
    [refresh]
  )

  const remove = useCallback(
    async (path) => {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
      setBusy(true)
      try {
        const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove([path])
        if (removeError) throw removeError
        await refresh()
      } finally {
        setBusy(false)
      }
    },
    [refresh]
  )

  return { files, loading, busy, error, refresh, upload, remove }
}

export const formatBytes = (bytes) => {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
