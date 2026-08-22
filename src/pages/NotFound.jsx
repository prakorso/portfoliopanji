import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons.jsx'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Panji Prakorso'
  }, [])

  return (
    <section className="section notfound">
      <div className="shell notfound__inner">
        <span className="label">404</span>
        <h1 className="notfound__title">This page moved, or never existed.</h1>
        <p className="section-lead">
          The link you followed does not match anything on this site. Head back to the homepage to
          find the work.
        </p>
        <Link className="btn" to="/">
          <ArrowLeft /> Back to home
        </Link>
      </div>
    </section>
  )
}
