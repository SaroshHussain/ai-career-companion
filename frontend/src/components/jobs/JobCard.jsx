import { useNavigate } from 'react-router-dom'
import { HiOutlineBriefcase, HiOutlineMapPin, HiOutlineArrowRight } from 'react-icons/hi2'
import SanitizedHtml from '../ui/SanitizedHtml'

function formatUpdated(updated) {
  if (!updated) return ''
  const date = new Date(updated)
  if (Number.isNaN(date.getTime())) return updated
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function JobCard({ job }) {
  const navigate = useNavigate()
  const initials = (job.company || job.title || '?')
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-label-sm font-bold text-primary">
            {initials || <HiOutlineBriefcase aria-hidden />}
          </div>
          <div>
            <h3 className="text-body-sm font-medium leading-snug text-on-surface">{job.title}</h3>
            {job.company && (
              <p className="mt-0.5 text-label-sm text-on-surface-variant">{job.company}</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/dashboard/jobs/${job.id}`)}
          className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-primary"
          aria-label={`View details for ${job.title}`}
        >
          <HiOutlineArrowRight className="text-base" aria-hidden />
        </button>
      </div>

      {(job.location || job.type || job.salary) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm text-on-surface-variant">
          {job.location && (
            <span className="flex items-center gap-1">
              <HiOutlineMapPin className="text-sm" aria-hidden />
              {job.location}
            </span>
          )}
          {job.type && (
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              {job.type}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-outline-variant" />
              {job.salary}
            </span>
          )}
        </div>
      )}

      {job.snippet && (
        <SanitizedHtml
          html={job.snippet}
          className="line-clamp-3 text-body-sm text-on-surface-variant"
        />
      )}

      {(job.source || job.updated) && (
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <HiOutlineBriefcase className="text-sm" aria-hidden />
            {job.source || 'Jooble'}
          </span>
          {formatUpdated(job.updated) && <span>{formatUpdated(job.updated)}</span>}
        </div>
      )}
    </article>
  )
}

export default JobCard
