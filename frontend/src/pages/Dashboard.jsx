import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineMicrophone,
  HiOutlineDocument,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
} from 'react-icons/hi2'
import { MdArrowForward } from 'react-icons/md'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import AIInsightsCard from '../components/dashboard/AIInsightsCard'
import { useAuth } from '../hooks/useAuth'

const emptyFeatures = [
  {
    title: 'Resume Builder',
    description: 'No resume has been created yet.',
    action: 'Create Resume',
    icon: HiOutlineDocumentText,
    href: '/dashboard/resume',
    color: 'text-primary bg-primary/10',
  },
  {
    title: 'Job Finder',
    description: 'No job searches yet.',
    action: 'Find Jobs',
    icon: HiOutlineBriefcase,
    href: '/dashboard/jobs',
    color: 'text-secondary bg-secondary/10',
  },
  {
    title: 'Interview Coach',
    description: 'No interview sessions yet.',
    action: 'Start Practice',
    icon: HiOutlineMicrophone,
    href: '#',
    color: 'text-tertiary-container bg-tertiary-container/10',
  },
  {
    title: 'Cover Letter',
    description: 'No cover letters created yet.',
    action: 'Create One',
    icon: HiOutlineDocument,
    href: '/dashboard/cover-letter',
    color: 'text-amber-600 bg-amber-50',
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.name || 'Guest'

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div>
          <h1 className="text-headline-lg text-on-surface">Welcome back, {name}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            You haven&apos;t started your career journey yet.
          </p>
        </div>

        {/* Empty State Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emptyFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="flex flex-col gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                  <Icon className="text-xl" aria-hidden />
                </div>
                <div className="flex-1">
                  <h3 className="text-body-sm font-medium text-on-surface">{feature.title}</h3>
                  <p className="mt-0.5 text-label-sm text-on-surface-variant">{feature.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(feature.href)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
                >
                  {feature.action}
                  <MdArrowForward aria-hidden />
                </button>
              </article>
            )
          })}
        </div>

        {/* Get Started + AI Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card">
              <div className="flex flex-col items-center gap-4 py-8 text-center sm:py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <HiOutlineAcademicCap className="text-3xl text-primary" aria-hidden />
                </div>
                <div className="max-w-sm">
                  <h2 className="text-headline-md text-on-surface">Start Your Career Journey</h2>
                  <p className="mt-1.5 text-body-sm text-on-surface-variant">
                    Create your first resume to unlock AI-powered job matching, interview coaching, and more.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/resume')}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-sm font-medium text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  <HiOutlineDocumentText className="text-lg" aria-hidden />
                  Create Your First Resume
                </button>
              </div>
            </section>
          </div>

          <div>
            <AIInsightsCard />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-outline-variant/30 py-4">
          <div className="flex flex-col items-center justify-between gap-2 text-label-sm text-on-surface-variant sm:flex-row">
            <p>&copy; 2024 Pathfinder AI Career Companion</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-primary">Privacy Policy</a>
              <a href="#" className="hover:text-primary">Terms of Service</a>
              <a href="#" className="hover:text-primary">Cookie Policy</a>
              <a href="#" className="hover:text-primary">Sitemap</a>
            </div>
          </div>
        </footer>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
