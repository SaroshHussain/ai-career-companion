import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  HiOutlineBookmark,
  HiOutlineExclamationTriangle,
  HiOutlineBriefcase,
  HiCheck,
  HiOutlineCheckCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import JobCard from '../components/jobs/JobCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Toast from '../components/ui/Toast'
import { getSavedJobs, unsaveJob, setSavedJobApplied } from '../services/api'

function SavedJobs() {
  const navigate = useNavigate()
  const [savedJobs, setSavedJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const loadSavedJobs = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getSavedJobs()
      setSavedJobs(data.savedJobs || [])
    } catch (err) {
      console.error('[SavedJobs] load failed', err)
      setError(err.message || 'Failed to load saved jobs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSavedJobs()
  }, [loadSavedJobs])

  const handleOpenJob = (job) => {
    navigate(`/dashboard/jobs/${job.id}`, { state: { job } })
  }

  const handleToggleApplied = async (savedJob) => {
    const next = !savedJob.isApplied
    try {
      await setSavedJobApplied(savedJob.jobId, { isApplied: next, job: savedJob.job })
      setSavedJobs((prev) =>
        prev.map((item) => (item.jobId === savedJob.jobId ? { ...item, isApplied: next } : item)),
      )
      setToast(next ? 'Marked as applied' : 'Applied status removed')
    } catch (err) {
      console.error('[SavedJobs] applied toggle failed', err)
      setToast(err.message || 'Failed to update applied status. Please try again.')
    }
  }

  const handleRemove = async () => {
    if (!pendingDelete || isDeleting) return
    setIsDeleting(true)
    try {
      await unsaveJob(pendingDelete.jobId)
      setSavedJobs((prev) => prev.filter((item) => item.jobId !== pendingDelete.jobId))
      setToast('Job removed from saved jobs')
    } catch (err) {
      console.error('[SavedJobs] remove failed', err)
      setToast(err.message || 'Failed to remove this job. Please try again.')
    } finally {
      setIsDeleting(false)
      setPendingDelete(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Saved Jobs</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Jobs you have saved for later. Track the ones you have applied to.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
            <p className="text-body-sm text-primary">Loading saved jobs...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4">
            <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
            <p className="text-body-sm text-red-700">{error}</p>
          </div>
        )}

        {!isLoading && !error && savedJobs.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-outline-variant/50 bg-surface-container-lowest px-6 py-14 text-center">
            <HiOutlineBookmark className="text-4xl text-on-surface-variant" aria-hidden />
            <div>
              <p className="text-body-sm font-medium text-on-surface">No saved jobs yet</p>
              <p className="mt-1 text-label-sm text-on-surface-variant">
                Browse jobs and tap &ldquo;Save Job&rdquo; to keep them here.
              </p>
            </div>
            <Link
              to="/dashboard/jobs"
              className="rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {!isLoading && !error && savedJobs.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedJobs.map((savedJob) => (
              <JobCard
                key={savedJob.id}
                job={savedJob.job}
                onOpen={handleOpenJob}
                actions={
                  <>
                    <button
                      type="button"
                      onClick={() => handleToggleApplied(savedJob)}
                      aria-pressed={savedJob.isApplied}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-label-sm font-medium transition ${
                        savedJob.isApplied
                          ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                      }`}
                    >
                      {savedJob.isApplied ? (
                        <HiCheck className="text-sm" aria-hidden />
                      ) : (
                        <HiOutlineCheckCircle className="text-sm" aria-hidden />
                      )}
                      {savedJob.isApplied ? 'Applied' : 'Mark Applied'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(savedJob)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-label-sm font-medium text-on-surface-variant transition hover:bg-red-50 hover:text-red-600"
                    >
                      <HiOutlineBriefcase className="text-sm" aria-hidden />
                      Remove
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleRemove}
        title="Remove Saved Job"
        message="Are you sure you want to remove this job from your saved jobs?"
        confirmLabel="Remove"
        confirmVariant="danger"
      />

      <Toast message={toast} isOpen={Boolean(toast)} onClose={() => setToast(null)} />
    </DashboardLayout>
  )
}

export default SavedJobs
