import {
  HiOutlineDocumentText,
  HiOutlineArrowPath,
  HiOutlineChevronRight,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2'

function formatUpdated(updated) {
  const date = new Date(updated)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

// Reusable saved-resume picker. Renders the same selection list used by the
// Resume Builder so other pages (e.g. Cover Letter) can pick which resume
// should provide their context. The selected resume is highlighted with the
// "Active" badge, matching the active-resume behaviour in Resume Builder.
function ResumePicker({ resumes, selectedId, onSelect, isLoading, error }) {
  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Select Resume</h2>
        {resumes.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-label-sm text-primary">
            {resumes.length} saved
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <HiOutlineExclamationTriangle className="mt-0.5 text-lg text-red-500 shrink-0" aria-hidden />
          <p className="text-body-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <HiOutlineArrowPath className="animate-spin text-lg text-primary" aria-hidden />
          <p className="text-body-sm text-primary">Loading saved resumes...</p>
        </div>
      )}

      {!isLoading && !error && resumes.length === 0 && (
        <p className="rounded-lg border-2 border-dashed border-outline-variant/20 px-4 py-6 text-center text-body-sm text-on-surface-variant">
          No saved resumes yet. Create or upload one from the Resume Builder.
        </p>
      )}

      {!isLoading && resumes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {resumes.map((resume) => {
            const fullName = resume.data?.personal?.fullName?.trim()
            const isSelected = selectedId === resume.id
            const updated = formatUpdated(resume.updatedAt)
            return (
              <li key={resume.id}>
                <button
                  type="button"
                  onClick={() => onSelect(resume.id)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition hover:bg-surface-container-low ${
                    isSelected
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-outline-variant/30 bg-surface-container-lowest'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-primary/15 text-primary' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    <HiOutlineDocumentText className="text-base" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-on-surface">
                      {fullName || resume.name || 'Untitled Resume'}
                      {isSelected && (
                        <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Active
                        </span>
                      )}
                    </p>
                    {updated && (
                      <p className="truncate text-label-sm text-on-surface-variant">
                        Updated {updated}
                      </p>
                    )}
                  </div>
                  <HiOutlineChevronRight className="shrink-0 text-on-surface-variant" aria-hidden />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default ResumePicker
