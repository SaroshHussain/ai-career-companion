import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HiOutlineChartBarSquare,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineMicrophone,
  HiOutlineDocument,
  HiOutlineSparkles,
  HiOutlineBookmark,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiXMark,
} from 'react-icons/hi2'
import { MdDashboard } from 'react-icons/md'
import { useAuth } from '../../hooks/useAuth'
import ConfirmDialog from '../ui/ConfirmDialog'

const navItems = [
  { label: 'Dashboard', icon: MdDashboard, href: '/dashboard' },
  { label: 'Resume Builder', icon: HiOutlineDocumentText, href: '/dashboard/resume' },
  { label: 'Job Finder', icon: HiOutlineBriefcase, href: '/dashboard/jobs' },
  { label: 'Saved Jobs', icon: HiOutlineBookmark, href: '/dashboard/saved-jobs' },
  { label: 'Interview Coach', icon: HiOutlineMicrophone, href: '/dashboard/interview', disabled: true },
  { label: 'Cover Letter', icon: HiOutlineDocument, href: '/dashboard/cover-letter' },
  { label: 'AI Assistant', icon: HiOutlineSparkles, href: '/dashboard/ai' },
]

const bottomItems = [
  { label: 'User Profile', icon: HiOutlineUser, href: '/dashboard/profile' },
  { label: 'Settings', icon: HiOutlineCog6Tooth, href: '/dashboard/settings' },
]

function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  const handleLogout = () => {
    setShowSignOutDialog(false)
    logout()
    navigate('/login', { replace: true })
  }

  const isActive = (href) => location.pathname === href

  const linkClasses = (href) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm transition-colors whitespace-nowrap ${
      isActive(href)
        ? 'bg-primary/10 font-medium text-primary'
        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
    }`

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 md:translate-x-0 ${
          isCollapsed ? 'w-16' : 'w-[260px]'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-4 py-4">
          {!isCollapsed && (
            <Link to="/dashboard" className="text-headline-md font-bold text-primary">
              Pathfinder AI
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard" className="mx-auto text-headline-md font-bold text-primary">
              P
            </Link>
          )}
          <button
            type="button"
            className="rounded-md p-1 text-on-surface-variant hover:text-on-surface md:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <HiXMark className="text-xl" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.disabled ? (
                  <div
                    aria-disabled="true"
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm whitespace-nowrap text-on-surface-variant/60 ${
                      isCollapsed ? 'justify-center px-2' : ''
                    }`}
                  >
                    <item.icon className="text-xl shrink-0" aria-hidden />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        <span className="ml-auto rounded-full bg-outline-variant/40 px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                          Coming Soon
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`${linkClasses(item.href)} ${isCollapsed ? 'justify-center px-2' : ''}`}
                    onClick={onClose}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="text-xl shrink-0" aria-hidden />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-outline-variant/30 px-2 py-3">
          <ul className="flex flex-col gap-1">
            {bottomItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`${linkClasses(item.href)} ${isCollapsed ? 'justify-center px-2' : ''}`}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="text-xl shrink-0" aria-hidden />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setShowSignOutDialog(true)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm text-on-surface-variant transition-colors hover:bg-red-50 hover:text-red-600 ${
                  isCollapsed ? 'justify-center px-2' : ''
                }`}
                title={isCollapsed ? 'Sign Out' : undefined}
              >
                <HiOutlineArrowRightOnRectangle className="text-xl shrink-0" aria-hidden />
                {!isCollapsed && <span>Sign Out</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Collapse toggle for desktop */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden border-t border-outline-variant/30 p-3 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface md:flex md:items-center md:justify-center"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      <ConfirmDialog
        isOpen={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out? You will need to sign in again to access your dashboard."
        confirmLabel="Sign Out"
        confirmVariant="danger"
      />
    </>
  )
}

export default Sidebar
