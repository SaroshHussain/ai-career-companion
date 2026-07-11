import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Resume', href: '/#resume' },
  { label: 'Interview', href: '/#interview' },
  { label: 'Tracker', href: '/#tracker' },
  { label: 'Settings', href: '/settings' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)
  const closeMenu = () => setIsMenuOpen(false)

  const getLinkClassName = (href) => {
    const isActive =
      href === '/settings'
        ? location.pathname === '/settings'
        : location.pathname === '/' && href.startsWith('/#')

    return isActive
      ? 'text-sm font-medium text-indigo-600'
      : 'text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600'
  }

  const getMobileLinkClassName = (href) => {
    const isActive =
      href === '/settings'
        ? location.pathname === '/settings'
        : location.pathname === '/' && href.startsWith('/#')

    return isActive
      ? 'block rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50'
      : 'block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-indigo-600 sm:text-xl"
        >
          AI Career Companion
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('/#') ? (
                <a href={link.href} className={getLinkClassName(link.href)}>
                  {link.label}
                </a>
              ) : (
                <Link to={link.href} className={getLinkClassName(link.href)}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            to="/settings"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Set Preferences
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('/#') ? (
                  <a
                    href={link.href}
                    className={getMobileLinkClassName(link.href)}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    to={link.href}
                    className={getMobileLinkClassName(link.href)}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/settings"
                className="block rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                onClick={closeMenu}
              >
                Set Preferences
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

export default Navbar
