import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../data/site.js'
import { useSection } from '../content/ContentProvider.jsx'
import { Menu, Close, Monogram } from './Icons.jsx'

export default function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const general = useSection('general')
  const contact = useSection('contact')
  const [firstName, ...restName] = (general.name ?? '').split(' ')

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 24)
        if (!isHome) return
        const line = window.scrollY + window.innerHeight * 0.3
        let current = navLinks[0].id
        for (const link of navLinks) {
          const el = document.getElementById(link.id)
          if (el && el.offsetTop <= line) current = link.id
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="shell nav__inner">
          <Link to="/" className="nav__brand" onClick={closeMenu}>
            <Monogram />
            <span className="nav__brand-text">
              {firstName} <strong>{restName.join(' ')}</strong>
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = isHome && active === link.id
              const className = `nav__link ${isActive ? 'is-active' : ''}`
              return isHome ? (
                <a key={link.id} href={link.href} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.id} to={`/${link.href}`} className="nav__link">
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="nav__actions">
            <a className="btn btn--sm nav__cta" href={isHome ? '#contact' : '/#contact'}>
              Get in touch
            </a>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav className="mobile-menu__links" aria-label="Mobile">
          {navLinks.map((link, i) =>
            isHome ? (
              <a
                key={link.id}
                href={link.href}
                onClick={closeMenu}
                style={{ transitionDelay: `${60 + i * 45}ms` }}
              >
                <span className="mobile-menu__index">0{i + 1}</span>
                {link.label}
              </a>
            ) : (
              <Link
                key={link.id}
                to={`/${link.href}`}
                onClick={closeMenu}
                style={{ transitionDelay: `${60 + i * 45}ms` }}
              >
                <span className="mobile-menu__index">0{i + 1}</span>
                {link.label}
              </Link>
            )
          )}
        </nav>
        <div className="mobile-menu__foot">
          <span className="label label--bare">{general.tagline}</span>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
    </>
  )
}
