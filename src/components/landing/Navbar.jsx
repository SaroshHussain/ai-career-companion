import { useState } from 'react'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'

import Button from '../ui/Button'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-surface/80 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-4 md:px-gutter">
        <a href="#top" className="text-headline-md font-bold text-primary">
          Pathfinder AI
        </a>

        <div className="hidden items-center gap-xl md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-body-md text-on-surface-variant transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-md md:flex">
          <Button variant="ghost" className="px-lg py-2">
            Sign In
          </Button>
          <Button as="a" href="#features" className="rounded px-lg py-2">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <HiX className="text-xl" aria-hidden /> : <HiOutlineMenuAlt3 className="text-xl" aria-hidden />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div id="mobile-nav" className="border-t border-outline-variant/30 bg-surface/95 px-margin-mobile pb-4 md:hidden">
          <div className="flex max-w-container-max flex-col gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-body-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" className="flex-1 py-3 text-center" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Button>
              <Button as="a" href="#features" className="flex-1 py-3 text-center" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default Navbar