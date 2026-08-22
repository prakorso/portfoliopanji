import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabase.js'
import { supabase } from '../lib/supabaseClient.js'
import { defaultContent, defaultProjects } from '../content/defaults.js'

const clone = (value) => JSON.parse(JSON.stringify(value))

/**
 * Loads a set of content sections (and optionally the project list) for editing,
 * tracks unsaved changes, and writes everything back in one Save.
 */
export function useSectionsEditor(keys, { withProjects = false } = {}) {
  const sectionKeys = useMemo(() => keys, [keys.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  const [values, setValues] = useState(() => {
    const initial = {}
    for (const key of sectionKeys) initial[key] = clone(defaultContent[key] ?? {})
    return initial
  })
  const [projects, setProjects] = useState(() => clone(defaultProjects))
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState(null)
  const savedRef = useRef(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const requests = [supabase.from('site_content').select('key, data').in('key', sectionKeys)]
      if (withProjects) {
        requests.push(
          supabase.from('projects').select('slug, position, featured, data').order('position')
        )
      }
      const [sections, projectRows] = await Promise.all(requests)
      if (sections.error) throw sections.error

      const next = {}
      for (const key of sectionKeys) next[key] = clone(defaultContent[key] ?? {})
      for (const row of sections.data ?? []) {
        next[row.key] = { ...(defaultContent[row.key] ?? {}), ...(row.data ?? {}) }
      }
      setValues(next)
      savedRef.current = JSON.stringify(next)

      if (withProjects) {
        if (projectRows?.error) throw projectRows.error
        if (projectRows?.data?.length) setProjects(clone(projectRows.data))
      }
      setStatus(null)
    } catch (err) {
      setStatus({ type: 'error', message: `Could not load content: ${err.message}` })
    } finally {
      setDirty(false)
      setLoading(false)
    }
  }, [sectionKeys, withProjects])

  useEffect(() => {
    load()
  }, [load])

  const setSection = useCallback((key, updater) => {
    setValues((prev) => {
      const nextValue = typeof updater === 'function' ? updater(prev[key]) : updater
      return { ...prev, [key]: nextValue }
    })
    setDirty(true)
    setStatus(null)
  }, [])

  const setField = useCallback(
    (key, field, value) => setSection(key, (section) => ({ ...section, [field]: value })),
    [setSection]
  )

  const updateProjects = useCallback((next) => {
    setProjects(next)
    setDirty(true)
    setStatus(null)
  }, [])

  const save = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setStatus({ type: 'error', message: 'Supabase is not configured — nothing to save to.' })
      return false
    }
    setSaving(true)
    try {
      if (sectionKeys.length) {
        const rows = sectionKeys.map((key) => ({ key, data: values[key] }))
        const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
        if (error) throw error
      }

      if (withProjects) {
        const projectRows = projects.map((p, index) => ({
          slug: p.slug,
          position: index,
          featured: p.featured !== false,
          data: p.data
        }))
        const { error: projectError } = await supabase
          .from('projects')
          .upsert(projectRows, { onConflict: 'slug' })
        if (projectError) throw projectError
      }

      savedRef.current = JSON.stringify(values)
      setDirty(false)
      setStatus({ type: 'success', message: 'Saved. Refresh the public site to see it live.' })
      return true
    } catch (err) {
      setStatus({ type: 'error', message: `Save failed: ${err.message}` })
      return false
    } finally {
      setSaving(false)
    }
  }, [sectionKeys, values, projects, withProjects])

  return {
    values,
    projects,
    loading,
    saving,
    dirty,
    status,
    setSection,
    setField,
    updateProjects,
    save,
    reload: load
  }
}
