import { Link, useLocation } from 'react-router-dom'
import { navLinks, site } from '../data/site.js'
import { ArrowUp, LinkedIn, Instagram } from './Icons.jsx'

export default function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__name">
            Panji Prakorso
          </Link>
          <p className="footer__tagline">{site.tagline}</p>
        </div>

        <nav className="footer__nav" aria-label="Footer">
          {navLinks.map((link) =>
            isHome ? (
              <a key={link.id} href={link.href}>
                {link.label}
              </a>
            ) : (
              <Link key={link.id} to={`/${link.href}`}>
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="footer__social">
          <a
            href={site.linkedin.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn"
          >
            <LinkedIn />
          </a>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
          >
            <Instagram />
          </a>
        </div>
      </div>

      <div className="shell footer__bottom">
        <p>© 2026 Panji Prakorso. All rights reserved.</p>
        <button
          type="button"
          className="footer__top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp />
        </button>
      </div>
    </footer>
  )
}
