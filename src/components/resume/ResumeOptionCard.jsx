function ResumeOptionCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="text-3xl" aria-hidden />
      </div>
      <div>
        <h3 className="text-headline-md text-on-surface">{title}</h3>
        <p className="mt-1.5 text-body-md text-on-surface-variant">{description}</p>
      </div>
    </button>
  )
}

export default ResumeOptionCard
