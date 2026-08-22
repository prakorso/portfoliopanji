import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../data/site.js'
import { useSection } from '../content/ContentProvider.jsx'
import { ArrowUp, LinkedIn, Instagram } from './Icons.jsx'

export default function Footer() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const general = useSection('general')
  const contact = useSection('contact')
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__name">
            {general.name}
          </Link>
          <p className="footer__tagline">{general.tagline}</p>
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
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </a>
          )}
          {contact.instagramUrl && (
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
          )}
        </div>
      </div>

      <div className="shell footer__bottom">
        <p>
          © {year} {general.name}. All rights reserved.
        </p>
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
