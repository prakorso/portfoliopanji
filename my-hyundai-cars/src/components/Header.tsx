import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../data/nav'
import { whatsAppLinkFor } from '../config/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const waHref = whatsAppLinkFor('general')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const solid = scrolled || menuOpen

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? 'bg-paper/95 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div
          className={`shell flex h-[68px] items-center justify-between gap-4 transition-colors duration-500 lg:h-[84px] ${
            solid ? 'border-b border-rule' : 'border-b border-white/10'
          }`}
        >
          <a
            href="#top"
            onClick={() => setMenuOpen(false)}
            className={`font-mono text-[11px] font-medium tracking-[0.24em] uppercase transition-colors duration-500 sm:text-xs ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            My Hyundai Cars
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={`relative block py-2 font-mono text-[11.5px] tracking-[0.16em] uppercase transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
                      solid ? 'text-ink/70 hover:text-ink' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden min-h-[42px] items-center px-5 font-mono text-[11.5px] tracking-[0.16em] uppercase transition-colors duration-300 md:inline-flex ${
                solid
                  ? 'bg-ink text-bone hover:bg-[#1a212b]'
                  : 'border border-white/40 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              Talk to Us
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`-mr-2 inline-flex h-11 w-11 items-center justify-center transition-colors duration-300 lg:hidden ${
                solid ? 'text-ink' : 'text-white'
              }`}
            >
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-[45] bg-paper pt-[68px] lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex h-full flex-col pt-8">
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="border-b border-rule">
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-5 font-display text-[1.75rem] font-light tracking-[-0.03em] text-ink"
                >
                  {item.label}
                  {item.external && (
                    <span className="eyebrow text-mute" aria-hidden="true">
                      External
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-9 inline-flex min-h-[56px] items-center justify-center bg-ink px-6 text-[0.9375rem] font-medium text-bone"
          >
            Talk to a Hyundai Consultant
          </a>

          <p className="mt-6 text-[0.8125rem] leading-relaxed text-mute">
            Independent Hyundai consultation for personal and business needs.
          </p>
        </nav>
      </div>
    </>
  )
}
