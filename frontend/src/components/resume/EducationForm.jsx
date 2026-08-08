import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi2'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'

function EducationEntry({ entry, index, onUpdate, onRemove }) {
  const fields = [
    { label: 'Institution', id: 'institution', colSpan: 'sm:col-span-2', placeholder: 'Stanford University' },
    { label: 'Degree', id: 'degree', placeholder: 'Bachelor of Science' },
    { label: 'Field of Study', id: 'fieldOfStudy', placeholder: 'Computer Science' },
    { label: 'Start Date', id: 'startDate', type: 'month', placeholder: '' },
    { label: 'End Date', id: 'endDate', type: 'month', placeholder: '' },
    { label: 'Grade / GPA', id: 'grade', placeholder: '3.8 GPA' },
  ]

  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-label-sm font-medium text-on-surface-variant">
          Education {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Remove education ${index + 1}`}
        >
          <HiOutlineTrash className="text-base" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className={field.colSpan || ''}>
            <label
              htmlFor={`edu-${index}-${field.id}`}
              className="mb-1 block text-label-sm text-on-surface-variant"
            >
              {field.label}
            </label>
            {field.id === 'description' ? (
              <textarea
                id={`edu-${index}-${field.id}`}
                rows={3}
                value={entry[field.id] || ''}
                onChange={(event) => onUpdate(field.id, event.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            ) : (
              <input
                id={`edu-${index}-${field.id}`}
                type={field.type || 'text'}
                value={entry[field.id] || ''}
                onChange={(event) => onUpdate(field.id, event.target.value)}
                placeholder={field.placeholder}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <label
          htmlFor={`edu-${index}-description`}
          className="mb-1 block text-label-sm text-on-surface-variant"
        >
          Description
        </label>
        <textarea
          id={`edu-${index}-description`}
          rows={3}
          value={entry.description || ''}
          onChange={(event) => onUpdate('description', event.target.value)}
          placeholder="Notable achievements, activities, or honors..."
          className={inputClass}
        />
      </div>
    </div>
  )
}

function EducationForm({ education, onAdd, onUpdate, onRemove }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md text-on-surface">Education</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Add your educational background.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
        >
          <HiOutlinePlus className="text-base" />
          Add Education
        </button>
      </div>

      {education.length === 0 && (
        <p className="py-8 text-center text-body-sm text-on-surface-variant">
          No education entries yet. Click &quot;Add Education&quot; to get started.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {education.map((entry, index) => (
          <EducationEntry
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

export default EducationForm
