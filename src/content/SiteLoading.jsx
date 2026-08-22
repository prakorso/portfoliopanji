import { Monogram } from '../components/Icons.jsx'

/** Shown only for the brief moment content is being fetched from Supabase. */
export default function SiteLoading() {
  return (
    <div className="site-loading" role="status" aria-live="polite">
      <Monogram size={44} />
      <span className="sr-only">Loading</span>
    </div>
  )
}
