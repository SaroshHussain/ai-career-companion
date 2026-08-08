import { HiOutlineMagnifyingGlass, HiOutlineBell, HiOutlineSparkles, HiBars3 } from 'react-icons/hi2'

function TopNavbar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant/30 bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        <button
          type="button"
          className="rounded-md p-1.5 text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface md:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <HiBars3 className="text-2xl" />
        </button>

        <div className="relative hidden max-w-sm flex-1 sm:block">
          <HiOutlineMagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search jobs, skills, companies..."
            className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low py-2 pl-10 pr-3 text-body-sm text-on-surface placeholder:text-on-surface-variant outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Notifications"
          >
            <HiOutlineBell className="text-xl" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-label-sm font-medium text-primary transition hover:bg-primary/20"
            aria-label="AI Assistant"
          >
            <HiOutlineSparkles className="text-lg" aria-hidden />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default TopNavbar
