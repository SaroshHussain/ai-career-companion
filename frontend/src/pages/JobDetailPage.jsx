import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
} from 'react-icons/hi2'
import { HiExternalLink, HiOutlineClock } from 'react-icons/hi'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import SanitizedHtml from '../components/ui/SanitizedHtml'
import { getJob } from '../services/api'

function formatUpdated(updated) {
  if (!updated) return ''
  const date = new Date(updated)
  if (Number.isNaN(date.getTime())) return updated
  return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

function JobDetailPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const initialJob = location.state?.job

  const [job, setJob] = useState(initialJob || null)
  const [isLoading, setIsLoading] = useState(!initialJob)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initialJob) return

    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getJob(jobId)
        if (!cancelled) setJob(data.data.job)
      } catch (err) {
        console.error('[JobDetailPage] load failed', err)
        if (!cancelled) setError(err.message || 'Failed to load this job.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [jobId, initialJob])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard/jobs')}
          className="inline-flex items-center gap-2 rounded-lg text-label-sm font-medium text-on-surface-variant transition hover:text-primary"
        >
          <HiOutlineArrowLeft className="text-base" aria-hidden />
          Back to Job Finder
        </button>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
            <p className="text-body-sm text-primary">Loading job details...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
              <p className="text-body-sm text-red-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/dashboard/jobs')}
              className="self-start rounded-lg border border-red-300 bg-white px-3 py-1.5 text-label-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Back to Job Finder
            </button>
          </div>
        )}

        {job && (
          <article className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-lowest shadow-card">
            <div className="border-b border-outline-variant/30 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                    {(job.company || job.title || '?')
                      .split(' ')
                      .map((word) => word[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || <HiOutlineBriefcase aria-hidden />}
                  </div>
                  <div>
                    <h1 className="text-headline-md text-on-surface">{job.title}</h1>
                    {job.company && (
                      <p className="mt-1 text-body-sm font-medium text-on-surface-variant">{job.company}</p>
                    )}
                  </div>
                </div>

                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
                  >
                    <HiExternalLink className="text-base" aria-hidden />
                    Apply on Jooble
                  </a>
                )}
              </div>

              {(job.location || job.type || job.salary) && (
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-label-sm text-on-surface-variant">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineMapPin className="text-base" aria-hidden />
                      {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineBriefcase className="text-base" aria-hidden />
                      {job.type}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineClock className="text-base" aria-hidden />
                      {job.salary}
                    </span>
                  )}
                </div>
              )}

              {(job.source || job.updated) && (
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-outline-variant/30 pt-4 text-label-sm text-on-surface-variant">
                  {job.source && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineBriefcase className="text-base" aria-hidden />
                      Source: {job.source}
                    </span>
                  )}
                  {job.updated && (
                    <span className="flex items-center gap-1.5">
                      <HiOutlineCalendarDays className="text-base" aria-hidden />
                      Updated: {formatUpdated(job.updated)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-body-sm font-medium text-on-surface">Job Description</h2>
              {job.snippet ? (
                <SanitizedHtml
                  html={job.snippet}
                  className="mt-3 whitespace-pre-line text-body-md leading-relaxed text-on-surface-variant"
                />
              ) : (
                <p className="mt-3 text-body-md text-on-surface-variant">
                  No description available for this position.
                </p>
              )}
            </div>
          </article>
        )}
      </div>
    </DashboardLayout>
  )
}

export default JobDetailPage
