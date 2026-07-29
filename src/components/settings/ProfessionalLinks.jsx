import { HiOutlineLink } from 'react-icons/hi2'

function ProfessionalLinks({ linkedin, onLinkedinChange, portfolio, onPortfolioChange, github, onGithubChange }) {
  const urlPattern = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
  const linkError = (val) => val.trim().length > 0 && !urlPattern.test(val.trim()) ? 'Enter a valid URL.' : ''

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:p-6">
      <h3 className="text-headline-md text-on-surface">Professional Links</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="settings-linkedin" className="mb-1.5 flex items-center gap-1.5 text-label-sm font-medium text-on-surface">
            <HiOutlineLink className="text-sm text-primary" aria-hidden />
            LinkedIn
          </label>
          <input
            id="settings-linkedin"
            type="url"
            value={linkedin}
            onChange={(e) => onLinkedinChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://linkedin.com/in/username"
          />
          {linkError(linkedin) && <p className="mt-1 text-body-sm text-red-600">{linkError(linkedin)}</p>}
        </div>

        <div>
          <label htmlFor="settings-portfolio" className="mb-1.5 flex items-center gap-1.5 text-label-sm font-medium text-on-surface">
            <HiOutlineLink className="text-sm text-primary" aria-hidden />
            Portfolio Website
          </label>
          <input
            id="settings-portfolio"
            type="url"
            value={portfolio}
            onChange={(e) => onPortfolioChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://yourportfolio.com"
          />
          {linkError(portfolio) && <p className="mt-1 text-body-sm text-red-600">{linkError(portfolio)}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="settings-github" className="mb-1.5 flex items-center gap-1.5 text-label-sm font-medium text-on-surface">
            <HiOutlineLink className="text-sm text-primary" aria-hidden />
            GitHub
          </label>
          <input
            id="settings-github"
            type="url"
            value={github}
            onChange={(e) => onGithubChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="https://github.com/username"
          />
          {linkError(github) && <p className="mt-1 text-body-sm text-red-600">{linkError(github)}</p>}
        </div>
      </div>
    </section>
  )
}

export default ProfessionalLinks
