import { MdPublic, MdSend } from 'react-icons/md'
import { HiAtSymbol, HiShare } from 'react-icons/hi2'

import { footerLinks } from '../../data/footerLinks'
import Button from '../ui/Button'

const socialIcons = [
  { icon: MdPublic, label: 'Website' },
  { icon: HiAtSymbol, label: 'Email' },
  { icon: HiShare, label: 'Share' },
]

function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-lowest">
      <div className="mx-auto grid max-w-container-max gap-xl px-margin-mobile py-2xl md:grid-cols-4 md:px-gutter">
        <div>
          <a href="#top" className="mb-lg block text-headline-md font-bold text-primary">
            Pathfinder AI
          </a>
          <p className="mb-lg text-body-sm text-on-surface-variant">
            Empowering professionals to navigate their career path with data-driven confidence.
          </p>
          <div className="flex gap-md">
            {socialIcons.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-outline transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Icon className="text-xl" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-lg text-label-md font-bold text-on-surface">Product</h2>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            {footerLinks.product.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-primary focus-visible:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-lg text-label-md font-bold text-on-surface">Company</h2>
          <ul className="space-y-sm text-body-sm text-on-surface-variant">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-primary focus-visible:text-primary">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-lg text-label-md font-bold text-on-surface">Subscribe</h2>
          <p className="mb-md text-body-sm text-on-surface-variant">Get career tips delivered to your inbox.</p>
          <form className="flex gap-2" aria-label="Newsletter signup">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email address"
              className="h-11 w-full rounded border border-outline-variant bg-white px-3 py-2 text-body-sm text-on-surface outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            <Button type="submit" className="h-11 w-11 rounded px-0" aria-label="Submit newsletter signup">
              <MdSend aria-hidden />
            </Button>
          </form>
        </div>
      </div>

      <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-md border-t border-outline-variant/30 px-margin-mobile py-lg text-body-sm text-on-surface-variant md:flex-row md:px-gutter">
        <p>© 2024 Pathfinder AI Career Companion. All rights reserved.</p>
        <div className="flex gap-xl">
          <a href="#" className="transition hover:text-primary focus-visible:text-primary">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-primary focus-visible:text-primary">
            Terms of Service
          </a>
          <a href="#" className="transition hover:text-primary focus-visible:text-primary">
            Cookie Policy
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer