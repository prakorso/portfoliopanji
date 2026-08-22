import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider.jsx'
import { Monogram } from '../components/Icons.jsx'

const NAV = [
  { to: '/admin/homepage', label: 'Homepage' },
  { to: '/admin/about', label: 'About' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/skills', label: 'Skills' },
  { to: '/admin/contact', label: 'Contact' },
  { to: '/admin/media', label: 'Media' }
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="ashell">
      <aside className={`aside ${navOpen ? 'is-open' : ''}`}>
        <div className="aside__brand">
          <Monogram size={30} />
          <span>Portfolio CMS</span>
        </div>

        <nav className="aside__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `aside__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="aside__foot">
          <Link className="aside__view" to="/" target="_blank" rel="noreferrer">
            View site ↗
          </Link>
          <span className="aside__user" title={user?.email}>
            {user?.email}
          </span>
          <button type="button" className="abtn abtn--ghost abtn--block" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="amain">
        <header className="atopbar">
          <button
            type="button"
            className="abtn abtn--ghost atopbar__menu"
            onClick={() => setNavOpen((v) => !v)}
            aria-expanded={navOpen}
          >
            Menu
          </button>
          <Link className="atopbar__view" to="/" target="_blank" rel="noreferrer">
            View site ↗
          </Link>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
