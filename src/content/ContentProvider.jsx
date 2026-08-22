import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { restSelect, isSupabaseConfigured } from '../lib/supabase.js'
import {
  defaultContent,
  defaultProjectList,
  flattenProject
} from './defaults.js'

const ContentContext = createContext(null)

/** Section rows from the DB win, but any missing key falls back to the default. */
function mergeSections(rows) {
  const merged = { ...defaultContent }
  for (const row of rows ?? []) {
    if (!row?.key) continue
    merged[row.key] = { ...(defaultContent[row.key] ?? {}), ...(row.data ?? {}) }
  }
  return merged
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [projects, setProjects] = useState(defaultProjectList)
  const [ready, setReady] = useState(!isSupabaseConfigured)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setReady(true)
      return
    }
    try {
      const [sections, projectRows] = await Promise.all([
        restSelect('site_content?select=key,data'),
        restSelect('projects?select=slug,position,featured,data&order=position.asc')
      ])

      setContent(mergeSections(sections))
      if (projectRows?.length) {
        setProjects(projectRows.map((row) => ({ ...flattenProject(row), featured: row.featured })))
      }
      setError(null)
    } catch (err) {
      // Never block the public site on a CMS problem — keep the defaults.
      console.warn('[content] falling back to built-in content:', err.message)
      setError(err)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    load()
    // Safety net: if the network hangs, show the default content rather than a spinner.
    const timer = setTimeout(() => setReady(true), 4000)
    return () => clearTimeout(timer)
  }, [load])

  const value = useMemo(
    () => ({ content, projects, ready, error, reload: load }),
    [content, projects, ready, error, load]
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

function useContentContext() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}

/** One content section, e.g. useSection('hero'). */
export function useSection(key) {
  const { content } = useContentContext()
  return content[key] ?? defaultContent[key] ?? {}
}

export function useContent() {
  return useContentContext()
}

/** Projects marked as featured, in admin-defined order. */
export function useFeaturedProjects() {
  const { projects } = useContentContext()
  const featured = projects.filter((p) => p.featured !== false)
  return featured.length ? featured : projects
}

export function useProjects() {
  return useContentContext().projects
}

export function useProject(slug) {
  const { projects } = useContentContext()
  return projects.find((p) => p.slug === slug) ?? null
}
