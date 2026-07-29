function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colorMap = {
    blue: 'bg-primary/10 text-primary',
    indigo: 'bg-secondary/10 text-secondary',
    teal: 'bg-tertiary-container/10 text-tertiary-container',
    amber: 'bg-amber-50 text-amber-600',
  }

  const iconBg = colorMap[color] || colorMap.blue

  return (
    <article className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-label-sm text-on-surface-variant">{title}</p>
          <p className="mt-1 text-headline-md text-on-surface">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-body-sm text-on-surface-variant">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className="text-xl" aria-hidden />
        </div>
      </div>
    </article>
  )
}

export default StatCard
