import { HiOutlineHeart, HiOutlineBookmark } from 'react-icons/hi2'

const badgeColors = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-primary/10 text-primary',
  amber: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
}

function JobCard({ job }) {
  const matchColor = badgeColors[job.matchColor] || badgeColors.blue
  const initials = job.company
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-label-sm font-bold text-primary">
            {initials}
          </div>
          <div>
            <h3 className="text-body-sm font-medium text-on-surface">{job.title}</h3>
            <p className="text-label-sm text-on-surface-variant">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
            aria-label={`Save ${job.title}`}
          >
            <HiOutlineBookmark className="text-base" />
          </button>
          <button
            type="button"
            className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-red-500"
            aria-label={`Like ${job.title}`}
          >
            <HiOutlineHeart className="text-base" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-label-sm text-on-surface-variant">
        <span>{job.location}</span>
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-outline-variant" />
          {job.salary}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-outline-variant" />
          {job.type}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-label-sm font-medium ${matchColor}`}>
          {job.match} Match
        </span>
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-surface-container-low px-2.5 py-0.5 text-label-sm text-on-surface-variant"
          >
            {skill}
          </span>
        ))}
      </div>
    </article>
  )
}

export default JobCard
