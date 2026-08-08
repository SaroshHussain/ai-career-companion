import { HiOutlinePlus, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi2'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'

function ExperienceEntry({ entry, index, onUpdate, onRemove }) {
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-label-sm font-medium text-on-surface-variant">
          Experience {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Remove experience ${index + 1}`}
        >
          <HiOutlineTrash className="text-base" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`exp-${index}-jobTitle`}
            className="mb-1 block text-label-sm text-on-surface-variant"
          >
            Job Title
          </label>
          <input
            id={`exp-${index}-jobTitle`}
            type="text"
            value={entry.jobTitle || ''}
            onChange={(event) => onUpdate('jobTitle', event.target.value)}
            placeholder="Senior Frontend Developer"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={`exp-${index}-company`}
            className="mb-1 block text-label-sm text-on-surface-variant"
          >
            Company
          </label>
          <input
            id={`exp-${index}-company`}
            type="text"
            value={entry.company || ''}
            onChange={(event) => onUpdate('company', event.target.value)}
            placeholder="TechCorp Inc."
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={`exp-${index}-startDate`}
            className="mb-1 block text-label-sm text-on-surface-variant"
          >
            Start Date
          </label>
          <input
            id={`exp-${index}-startDate`}
            type="month"
            value={entry.startDate || ''}
            onChange={(event) => onUpdate('startDate', event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={`exp-${index}-endDate`}
            className="mb-1 block text-label-sm text-on-surface-variant"
          >
            End Date
          </label>
          <input
            id={`exp-${index}-endDate`}
            type="month"
            value={entry.endDate || ''}
            onChange={(event) => onUpdate('endDate', event.target.value)}
            disabled={entry.currentlyWorking}
            className={`${inputClass} ${entry.currentlyWorking ? 'cursor-not-allowed opacity-50' : ''}`}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          id={`exp-${index}-currentlyWorking`}
          type="checkbox"
          checked={entry.currentlyWorking || false}
          onChange={(event) => onUpdate('currentlyWorking', event.target.checked)}
          className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
        />
        <label
          htmlFor={`exp-${index}-currentlyWorking`}
          className="text-body-sm text-on-surface"
        >
          I currently work here
        </label>
      </div>
      <div className="mt-3">
        <label
          htmlFor={`exp-${index}-description`}
          className="mb-1 block text-label-sm text-on-surface-variant"
        >
          Description
        </label>
        <textarea
          id={`exp-${index}-description`}
          rows={3}
          value={entry.description || ''}
          onChange={(event) => onUpdate('description', event.target.value)}
          placeholder="Describe your responsibilities and role..."
          className={inputClass}
        />
      </div>
      <div className="mt-3">
        <label
          htmlFor={`exp-${index}-achievements`}
          className="mb-1 block text-label-sm text-on-surface-variant"
        >
          Achievements
        </label>
        <textarea
          id={`exp-${index}-achievements`}
          rows={3}
          value={entry.achievements || ''}
          onChange={(event) => onUpdate('achievements', event.target.value)}
          placeholder="Key accomplishments, metrics, and impact..."
          className={inputClass}
        />
      </div>
    </div>
  )
}

function AIRecommendationCard() {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <HiOutlineSparkles className="text-lg" aria-hidden />
      </div>
      <div>
        <p className="text-body-sm font-medium text-primary">AI Suggestion</p>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">
          Use strong action verbs and quantify achievements with metrics. For example,
          instead of &quot;Improved performance,&quot; try &quot;Reduced page load time by 40%.&quot;
        </p>
      </div>
    </div>
  )
}

function ExperienceForm({ experience, onAdd, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md text-on-surface">Experience</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Add your work history, starting with the most recent.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
        >
          <HiOutlinePlus className="text-base" />
          Add Experience
        </button>
      </div>

      <AIRecommendationCard />

      {experience.length === 0 && (
        <p className="py-8 text-center text-body-sm text-on-surface-variant">
          No experience entries yet. Click &quot;Add Experience&quot; to get started.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {experience.map((entry, index) => (
          <ExperienceEntry
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={(field, value) => onUpdate(entry.id, field, value)}
            onRemove={() => onRemove(entry.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExperienceForm
