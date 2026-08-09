import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineDocument,
  HiOutlineSparkles,
  HiOutlineAcademicCap,
} from 'react-icons/hi2'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import AIInsightsCard from '../components/dashboard/AIInsightsCard'
import StatCard from '../components/dashboard/StatCard'
import { useAuth } from '../hooks/useAuth'
import { getResumeDocuments } from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const name = user?.name || 'Guest'
  const [resumeCount, setResumeCount] = useState(0)

  useEffect(() => {
    let mounted = true
    getResumeDocuments()
      .then((data) => {
        if (mounted && typeof data?.count === 'number') setResumeCount(data.count)
      })
      .catch((err) => console.error('[Dashboard] failed to load resume count', err))
    return () => {
      mounted = false
    }
  }, [])

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

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Resumes"
            value={resumeCount}
            subtitle="Saved on your account"
            icon={HiOutlineDocumentText}
            color="blue"
          />
          <StatCard
            title="Jobs Applied"
            value={0}
            subtitle="Tracked applications"
            icon={HiOutlineBriefcase}
            color="indigo"
          />
          <StatCard
            title="Cover Letters"
            value={0}
            subtitle="Created so far"
            icon={HiOutlineDocument}
            color="teal"
          />
          <StatCard
            title="AI Sessions"
            value={0}
            subtitle="Assist & interview prep"
            icon={HiOutlineSparkles}
            color="amber"
          />
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
