import {
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiOutlineBriefcase,
  HiOutlineBookmark,
  HiOutlineDocument,
  HiOutlineMicrophone,
  HiOutlineAcademicCap,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'
import { MdArrowForward, MdOutlineTrendingDown, MdOutlineTrendingUp } from 'react-icons/md'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import JobCard from '../components/dashboard/JobCard'
import ActivityCard from '../components/dashboard/ActivityCard'
import AIInsightsCard from '../components/dashboard/AIInsightsCard'

const stats = [
  {
    title: 'Resume Score',
    value: '86',
    subtitle: 'Above average',
    icon: HiOutlineDocumentText,
    color: 'blue',
  },
  {
    title: 'ATS Match Rate',
    value: '72%',
    subtitle: 'Improved by 12%',
    icon: HiOutlineChartBarSquare,
    color: 'indigo',
  },
  {
    title: 'Active Applications',
    value: '14',
    subtitle: '3 new this week',
    icon: HiOutlineBriefcase,
    color: 'teal',
  },
  {
    title: 'Saved Jobs',
    value: '28',
    subtitle: '5 new matches',
    icon: HiOutlineBookmark,
    color: 'amber',
  },
]

const activities = [
  {
    id: 1,
    type: 'resume',
    icon: <HiOutlineDocumentText className="text-lg" />,
    title: 'Resume reviewed by AI',
    description: 'Your resume scored 86/100. Suggestions applied.',
    time: '2 min ago',
  },
  {
    id: 2,
    type: 'interview',
    icon: <HiOutlineMicrophone className="text-lg" />,
    title: 'Mock interview completed',
    description: 'Technical interview practice scored 74%.',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'job',
    icon: <HiOutlineBriefcase className="text-lg" />,
    title: 'New job match found',
    description: 'Senior Frontend Developer at TechCorp matches your profile.',
    time: '3 hours ago',
  },
  {
    id: 4,
    type: 'skill',
    icon: <HiOutlineAcademicCap className="text-lg" />,
    title: 'Cover letter generated',
    description: 'AI created a tailored cover letter for Senior Frontend Developer role.',
    time: '1 day ago',
  },
]

const jobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$140k-$180k',
    type: 'Full-time',
    match: '95%',
    matchColor: 'green',
    skills: ['React', 'TypeScript', 'Next.js'],
  },
  {
    title: 'Full Stack Engineer',
    company: 'DataFlow Inc',
    location: 'New York, NY',
    salary: '$120k-$160k',
    type: 'Full-time',
    match: '88%',
    matchColor: 'blue',
    skills: ['Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'UX Engineer',
    company: 'DesignLab',
    location: 'Austin, TX',
    salary: '$110k-$150k',
    type: 'Remote',
    match: '82%',
    matchColor: 'purple',
    skills: ['Figma', 'React', 'Storybook'],
  },
]

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div>
          <h1 className="text-headline-lg text-on-surface">Welcome back, Alex</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Here is your career progress overview for this week.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Weekly Progress + AI Insights */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-headline-md text-on-surface">Weekly Progress</h2>
                  <p className="text-body-sm text-on-surface-variant">
                    Your activity over the past week
                  </p>
                </div>
                <select
                  className="rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-1.5 text-label-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  defaultValue="7"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="14">Last 14 Days</option>
                  <option value="30">Last 30 Days</option>
                </select>
              </div>
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-outline-variant/50 bg-surface-container-low sm:h-56">
                <div className="text-center">
                  <HiOutlineCalendarDays className="mx-auto text-3xl text-outline-variant" aria-hidden />
                  <p className="mt-2 text-body-sm text-on-surface-variant">Chart coming soon</p>
                </div>
              </div>
            </section>
          </div>

          <div>
            <AIInsightsCard />
          </div>
        </div>

        {/* Recent Activity + Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityCard activities={activities} />
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card sm:p-5">
            <h2 className="text-headline-md text-on-surface">Quick Stats</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <HiOutlineDocumentText className="text-lg text-primary" aria-hidden />
                  <span className="text-body-sm text-on-surface">Resume views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-body-sm font-medium text-on-surface">47</span>
                  <MdOutlineTrendingUp className="text-base text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <HiOutlineMicrophone className="text-lg text-secondary" aria-hidden />
                  <span className="text-body-sm text-on-surface">Interviews</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-body-sm font-medium text-on-surface">3</span>
                  <MdOutlineTrendingUp className="text-base text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <HiOutlineBriefcase className="text-lg text-tertiary-container" aria-hidden />
                  <span className="text-body-sm text-on-surface">Offers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-body-sm font-medium text-on-surface">1</span>
                  <MdOutlineTrendingDown className="text-base text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-headline-md text-on-surface">Recommended Jobs</h2>
              <p className="text-body-sm text-on-surface-variant">
                Based on your profile and preferences
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-label-sm font-medium text-primary transition hover:underline"
            >
              View all <MdArrowForward aria-hidden />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.title} job={job} />
            ))}
          </div>
        </section>

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
