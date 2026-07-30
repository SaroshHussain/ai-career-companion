import { forwardRef } from 'react'
import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin } from 'react-icons/hi2'
import { MdLink } from 'react-icons/md'

function formatText(text) {
  if (!text) return ''
  const lines = text.split('\n').filter(Boolean)
  if (lines.length <= 1) {
    const sentences = text.match(/[^.!?\n]+[.!?]+/g)
    if (sentences && sentences.length > 1) {
      return sentences.map((s) => s.trim()).filter(Boolean)
    }
    return [text.trim()]
  }
  return lines.map((l) => l.trim()).filter(Boolean)
}

const ResumePreview = forwardRef(function ResumePreview({ data }, ref) {
  const { personal, education, experience, projects, skills, certifications } = data

  const formatDate = (value) => {
    if (!value) return ''
    const [year, month] = value.split('-')
    if (!year) return value
    const date = new Date(Number(year), Number(month) - 1)
    if (isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }

  const hasContact =
    personal.email || personal.phone || personal.location || personal.portfolio || personal.linkedin || personal.github

  const hasAnyContent =
    personal.fullName ||
    personal.professionalTitle ||
    personal.professionalSummary ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (projects && projects.length > 0) ||
    (skills.technical && skills.technical.length > 0) ||
    (skills.soft && skills.soft.length > 0) ||
    (skills.languages && skills.languages.length > 0) ||
    (skills.certifications && skills.certifications.length > 0) ||
    (certifications && certifications.length > 0)

  if (!hasAnyContent) {
    return (
      <div ref={ref} className="flex min-h-[600px] flex-col items-center justify-center bg-white text-center text-on-surface-variant">
        <p className="text-body-sm">Your resume preview will appear here</p>
        <p className="mt-1 text-label-sm">Start filling in your details on the left</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="bg-white px-8 py-10 text-on-surface sm:px-10">
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-4">
        {personal.fullName && (
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">{personal.fullName}</h1>
        )}
        {personal.professionalTitle && (
          <p className="mt-1 text-base text-primary">{personal.professionalTitle}</p>
        )}
        {hasContact && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
            {personal.email && (
              <span className="inline-flex items-center gap-1">
                <HiOutlineEnvelope className="text-xs shrink-0" aria-hidden /> {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="inline-flex items-center gap-1">
                <HiOutlinePhone className="text-xs shrink-0" aria-hidden /> {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="inline-flex items-center gap-1">
                <HiOutlineMapPin className="text-xs shrink-0" aria-hidden /> {personal.location}
              </span>
            )}
            {personal.portfolio && (
              <span className="inline-flex items-center gap-1">
                <MdLink className="text-xs shrink-0" aria-hidden /> {personal.portfolio}
              </span>
            )}
            {personal.linkedin && (
              <span className="inline-flex items-center gap-1">
                <MdLink className="text-xs shrink-0" aria-hidden /> {personal.linkedin}
              </span>
            )}
            {personal.github && (
              <span className="inline-flex items-center gap-1">
                <MdLink className="text-xs shrink-0" aria-hidden /> {personal.github}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {personal.professionalSummary && (
        <div className="mt-4">
          <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-on-surface">
            {personal.professionalSummary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Experience
          </h2>
          <div className="flex flex-col gap-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface">
                      {exp.jobTitle}
                    </p>
                    {exp.company && (
                      <p className="text-xs text-primary">{exp.company}</p>
                    )}
                  </div>
                  {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
                    <p className="shrink-0 text-[11px] text-on-surface-variant">
                      {exp.startDate ? formatDate(exp.startDate) : ''}
                      {exp.startDate || exp.endDate ? ' – ' : ''}
                      {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                    </p>
                  )}
                </div>
                {exp.description && (
                  <div className="mt-1 space-y-0.5">
                    {formatText(exp.description).map((line, i) => (
                      <p key={i} className="text-xs leading-relaxed text-on-surface-variant">
                        {line.startsWith('-') || line.startsWith('•') ? line : `• ${line}`}
                      </p>
                    ))}
                  </div>
                )}
                {exp.achievements && (
                  <div className="mt-1 space-y-0.5">
                    {formatText(exp.achievements).map((line, i) => (
                      <p key={i} className="text-xs leading-relaxed text-on-surface-variant">
                        {line.startsWith('-') || line.startsWith('•') ? line : `• ${line}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Projects
          </h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface">
                      {proj.name}
                    </p>
                    {proj.role && (
                      <p className="text-xs text-primary">{proj.role}</p>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <p className="shrink-0 text-[11px] text-on-surface-variant">
                      {proj.startDate ? formatDate(proj.startDate) : ''}
                      {proj.startDate || proj.endDate ? ' – ' : ''}
                      {proj.endDate ? formatDate(proj.endDate) : 'Present'}
                    </p>
                  )}
                </div>
                {proj.description && (
                  <div className="mt-1 space-y-0.5">
                    {formatText(proj.description).map((line, i) => (
                      <p key={i} className="text-xs leading-relaxed text-on-surface-variant">
                        {line.startsWith('-') || line.startsWith('•') ? line : `• ${line}`}
                      </p>
                    ))}
                  </div>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {proj.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="rounded-sm bg-surface-container-low px-1.5 py-0.5 text-[10px] text-on-surface-variant"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Education
          </h2>
          <div className="flex flex-col gap-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-on-surface">
                      {edu.institution}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <p className="shrink-0 text-[11px] text-on-surface-variant">
                      {edu.startDate ? formatDate(edu.startDate) : ''} – {edu.endDate ? formatDate(edu.endDate) : ''}
                    </p>
                  )}
                </div>
                {edu.description && (
                  <div className="mt-0.5 space-y-0.5">
                    {formatText(edu.description).map((line, i) => (
                      <p key={i} className="text-xs leading-relaxed text-on-surface-variant">
                        {line.startsWith('-') || line.startsWith('•') ? line : `• ${line}`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mt-4">
        {skills.technical && skills.technical.length > 0 && (
          <div className="mb-3">
            <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.technical.map((skill, i) => (
                <span key={i} className="rounded-sm bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {skills.languages && skills.languages.length > 0 && (
          <div className="mb-3">
            <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              Languages
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.languages.map((lang, i) => (
                <span key={i} className="rounded-sm bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
        {skills.certifications && skills.certifications.length > 0 && (
          <div className="mb-3">
            <h2 className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              Certifications
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.certifications.map((cert, i) => (
                <span key={i} className="rounded-sm bg-surface-container-low px-2 py-0.5 text-[11px] text-on-surface">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications (top-level) */}
      {certifications && certifications.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
            Certifications
          </h2>
          <div className="flex flex-col gap-2">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="text-xs font-semibold text-on-surface">{cert.name}</p>
                {(cert.issuer || cert.date) && (
                  <p className="text-[11px] text-on-surface-variant">
                    {cert.issuer}{cert.issuer && cert.date ? ' — ' : ''}{cert.date ? formatDate(cert.date) : ''}
                  </p>
                )}
                {cert.url && (
                  <p className="text-[11px] text-primary truncate">{cert.url}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default ResumePreview
