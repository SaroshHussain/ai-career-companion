function StatCard({ title, value, subtitle, icon: Icon, color, onClick }) {
  const colorMap = {
    blue: 'bg-primary/10 text-primary',
    indigo: 'bg-secondary/10 text-secondary',
    teal: 'bg-tertiary-container/10 text-tertiary-container',
    amber: 'bg-amber-50 text-amber-600',
  }

  const iconBg = colorMap[color] || colorMap.blue

  const baseClass =
    'rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card transition-shadow hover:shadow-card-hover'

  const content = (
    <>
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
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClass} cursor-pointer text-left transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      >
        {content}
      </button>
    )
  }

  return <article className={baseClass}>{content}</article>
}

export default StatCard
