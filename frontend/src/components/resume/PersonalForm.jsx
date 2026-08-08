import Input from '../ui/Input'

function PersonalForm({ data, onUpdate }) {
  const fields = [
    { label: 'Full Name', id: 'fullName', placeholder: 'John Doe' },
    { label: 'Professional Title', id: 'professionalTitle', placeholder: 'Senior Frontend Developer' },
    { label: 'Email', id: 'email', type: 'email', placeholder: 'john@email.com' },
    { label: 'Phone', id: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
    { label: 'Location', id: 'location', placeholder: 'San Francisco, CA' },
    { label: 'Portfolio', id: 'portfolio', placeholder: 'johndoe.dev' },
    { label: 'LinkedIn', id: 'linkedin', placeholder: 'linkedin.com/in/johndoe' },
    { label: 'GitHub', id: 'github', placeholder: 'github.com/johndoe' },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-headline-md text-on-surface">Personal Information</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Tell us about yourself to start building your resume.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Input
            key={field.id}
            label={field.label}
            id={field.id}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={data[field.id] || ''}
            onChange={(event) => onUpdate(field.id, event.target.value)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="professionalSummary" className="text-label-md font-label-md text-on-surface">
          Professional Summary
        </label>
        <textarea
          id="professionalSummary"
          rows={4}
          value={data.professionalSummary || ''}
          onChange={(event) => onUpdate('professionalSummary', event.target.value)}
          placeholder="A brief summary of your professional background and career goals..."
          className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}

export default PersonalForm
