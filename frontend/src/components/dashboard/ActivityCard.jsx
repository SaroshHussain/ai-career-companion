import { HiOutlineClock } from 'react-icons/hi2'

const activityIconMap = {
  resume: 'bg-primary/10 text-primary',
  interview: 'bg-secondary/10 text-secondary',
  job: 'bg-tertiary-container/10 text-tertiary-container',
  skill: 'bg-amber-50 text-amber-600',
}

function ActivityCard({ activities }) {
  return (
    <section className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-headline-md text-on-surface">Recent Activity</h2>
        <button
          type="button"
          className="text-label-sm font-medium text-primary transition hover:underline"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((activity) => {
          const iconBg = activityIconMap[activity.type] || activityIconMap.resume

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
              >
                {activity.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body-sm text-on-surface">{activity.title}</p>
                <p className="text-label-sm text-on-surface-variant">{activity.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-label-sm text-on-surface-variant">
                <HiOutlineClock className="text-sm" aria-hidden />
                {activity.time}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ActivityCard
