import { HiOutlineCheckCircle } from 'react-icons/hi2'

function PreviewPage({ data }) {
  const { personal, education, experience, projects, skills } = data

  const sections = [
    { key: 'personal', label: 'Personal Information', complete: personal.fullName && personal.email },
    { key: 'education', label: 'Education', complete: education.length > 0 },
    { key: 'experience', label: 'Experience', complete: experience.length > 0 },
    {
      key: 'skills',
      label: 'Skills',
      complete:
        (skills.technical && skills.technical.length > 0) ||
        (skills.soft && skills.soft.length > 0) ||
        (skills.languages && skills.languages.length > 0) ||
        (skills.certifications && skills.certifications.length > 0),
    },
    { key: 'projects', label: 'Projects', complete: projects && projects.length > 0 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-headline-md text-on-surface">Preview Your Resume</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Review all sections before downloading.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.key}
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              section.complete
                ? 'border-green-200 bg-green-50'
                : 'border-outline-variant/30 bg-surface-container-lowest'
            }`}
          >
            <HiOutlineCheckCircle
              className={`text-xl ${
                section.complete ? 'text-green-600' : 'text-outline-variant'
              }`}
              aria-hidden
            />
            <div>
              <p className="text-body-sm font-medium text-on-surface">{section.label}</p>
              <p className="text-label-sm text-on-surface-variant">
                {section.complete ? 'Completed' : 'Incomplete'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {(!personal.fullName || !personal.email) && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-body-sm text-amber-800">
          Please fill in at least your full name and email before downloading.
        </div>
      )}
    </div>
  )
}

export default PreviewPage
