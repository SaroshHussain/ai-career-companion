import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle,
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineBookmark,
  HiCheck,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import { HiExternalLink, HiOutlineClock } from 'react-icons/hi'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import SanitizedHtml from '../components/ui/SanitizedHtml'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Toast from '../components/ui/Toast'
import { getJob, getSavedJob, saveJob, unsaveJob, setSavedJobApplied } from '../services/api'

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

  const [isSaved, setIsSaved] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showUnsaveDialog, setShowUnsaveDialog] = useState(false)
  const [toast, setToast] = useState(null)

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

  const showToast = useCallback((message) => {
    setToast(message)
  }, [])

  // Once the job is known, fetch its saved/applied status.
  useEffect(() => {
    if (!job) return

    let cancelled = false
    const loadStatus = async () => {
      try {
        const data = await getSavedJob(jobId)
        if (!cancelled) {
          setIsSaved(Boolean(data.savedJob?.isSaved))
          setIsApplied(Boolean(data.savedJob?.isApplied))
        }
      } catch (err) {
        // 404 simply means the job was never saved/applied.
        if (!cancelled) {
          setIsSaved(false)
          setIsApplied(false)
        }
      }
    }

    loadStatus()
    return () => {
      cancelled = true
    }
  }, [job, jobId])

  const handleSave = async () => {
    if (!job || isUpdating) return
    setIsUpdating(true)
    try {
      await saveJob({ jobId, job })
      setIsSaved(true)
      showToast('Job saved to your dashboard')
    } catch (err) {
      console.error('[JobDetailPage] save failed', err)
      showToast(err.message || 'Failed to save this job. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUnsave = async () => {
    setShowUnsaveDialog(false)
    if (!job || isUpdating) return
    setIsUpdating(true)
    try {
      await unsaveJob(jobId)
      setIsSaved(false)
      showToast('Job removed from saved jobs')
    } catch (err) {
      console.error('[JobDetailPage] unsave failed', err)
      showToast(err.message || 'Failed to remove this job. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleToggleApplied = async () => {
    if (!job || isUpdating) return
    setIsUpdating(true)
    const next = !isApplied
    try {
      await setSavedJobApplied(jobId, { isApplied: next, job })
      setIsApplied(next)
      showToast(next ? 'Marked as applied' : 'Applied status removed')
    } catch (err) {
      console.error('[JobDetailPage] applied toggle failed', err)
      showToast(err.message || 'Failed to update applied status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

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

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {isSaved ? (
                  <button
                    type="button"
                    onClick={() => setShowUnsaveDialog(true)}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-sm font-medium text-primary transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HiOutlineBookmark className="text-base" aria-hidden />
                    Saved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HiOutlineBookmark className="text-base" aria-hidden />
                    Save Job
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleToggleApplied}
                  disabled={isUpdating}
                  aria-pressed={isApplied}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-label-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isApplied
                      ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {isApplied ? (
                    <HiCheck className="text-base" aria-hidden />
                  ) : (
                    <HiOutlineCheckCircle className="text-base" aria-hidden />
                  )}
                  {isApplied ? 'Applied' : 'Mark as Applied'}
                </button>
              </div>
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

      <ConfirmDialog
        isOpen={showUnsaveDialog}
        onClose={() => setShowUnsaveDialog(false)}
        onConfirm={handleUnsave}
        title="Remove Saved Job"
        message="Are you sure you want to remove this job from your saved jobs? You can save it again from its detail page at any time."
        confirmLabel="Remove"
        confirmVariant="danger"
      />

      <Toast message={toast} isOpen={Boolean(toast)} onClose={() => setToast(null)} />
    </DashboardLayout>
  )
}

export default JobDetailPage
