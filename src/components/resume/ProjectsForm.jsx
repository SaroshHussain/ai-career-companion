import { useState } from 'react'
import { HiOutlinePlus, HiOutlineTrash, HiXMark } from 'react-icons/hi2'

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary'

function ProjectEntry({ entry, index, onUpdate, onRemove, onAddTech, onRemoveTech }) {
  const [techInput, setTechInput] = useState('')

  const handleTechKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const trimmed = techInput.trim()
      if (trimmed) {
        onAddTech(entry.id, trimmed)
        setTechInput('')
      }
    }
  }

  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-label-sm font-medium text-on-surface-variant">
          Project {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md p-1.5 text-on-surface-variant transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Remove project ${index + 1}`}
        >
          <HiOutlineTrash className="text-base" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`proj-${entry.id}-name`} className="mb-1 block text-label-sm text-on-surface-variant">
            Project Name
          </label>
          <input
            id={`proj-${entry.id}-name`}
            type="text"
            value={entry.name || ''}
            onChange={(event) => onUpdate(entry.id, 'name', event.target.value)}
            placeholder="My Awesome Project"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`proj-${entry.id}-role`} className="mb-1 block text-label-sm text-on-surface-variant">
            Role
          </label>
          <input
            id={`proj-${entry.id}-role`}
            type="text"
            value={entry.role || ''}
            onChange={(event) => onUpdate(entry.id, 'role', event.target.value)}
            placeholder="Creator & Maintainer"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`proj-${entry.id}-startDate`} className="mb-1 block text-label-sm text-on-surface-variant">
            Start Date
          </label>
          <input
            id={`proj-${entry.id}-startDate`}
            type="month"
            value={entry.startDate || ''}
            onChange={(event) => onUpdate(entry.id, 'startDate', event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`proj-${entry.id}-endDate`} className="mb-1 block text-label-sm text-on-surface-variant">
            End Date
          </label>
          <input
            id={`proj-${entry.id}-endDate`}
            type="month"
            value={entry.endDate || ''}
            onChange={(event) => onUpdate(entry.id, 'endDate', event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor={`proj-${entry.id}-description`} className="mb-1 block text-label-sm text-on-surface-variant">
          Description
        </label>
        <textarea
          id={`proj-${entry.id}-description`}
          rows={3}
          value={entry.description || ''}
          onChange={(event) => onUpdate(entry.id, 'description', event.target.value)}
          placeholder="Describe the project, your role, and key outcomes..."
          className={inputClass}
        />
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-label-sm text-on-surface-variant">
          Technologies Used
        </label>
        <div className="mb-2 flex flex-wrap gap-2">
          {(entry.technologies || []).length === 0 && (
            <span className="text-body-sm text-on-surface-variant">No technologies added.</span>
          )}
          {(entry.technologies || []).map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary"
            >
              {tech}
              <button
                type="button"
                onClick={() => onRemoveTech(entry.id, i)}
                className="ml-0.5 rounded-full p-0.5 transition hover:bg-primary/20"
                aria-label={`Remove ${tech}`}
              >
                <HiXMark className="text-sm" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(event) => setTechInput(event.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="Add a technology..."
            className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => {
              const trimmed = techInput.trim()
              if (trimmed) {
                onAddTech(entry.id, trimmed)
                setTechInput('')
              }
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
          >
            <HiOutlinePlus className="text-base" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`proj-${entry.id}-github`} className="mb-1 block text-label-sm text-on-surface-variant">
            GitHub Link
          </label>
          <input
            id={`proj-${entry.id}-github`}
            type="text"
            value={entry.githubLink || ''}
            onChange={(event) => onUpdate(entry.id, 'githubLink', event.target.value)}
            placeholder="github.com/username/project"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`proj-${entry.id}-live`} className="mb-1 block text-label-sm text-on-surface-variant">
            Live Demo Link
          </label>
          <input
            id={`proj-${entry.id}-live`}
            type="text"
            value={entry.liveLink || ''}
            onChange={(event) => onUpdate(entry.id, 'liveLink', event.target.value)}
            placeholder="myproject.demo.com"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}

function ProjectsForm({ projects, onAdd, onUpdate, onRemove, onAddTech, onRemoveTech }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-headline-md text-on-surface">Projects</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Showcase your personal and professional projects.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
        >
          <HiOutlinePlus className="text-base" />
          Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <p className="py-8 text-center text-body-sm text-on-surface-variant">
          No projects yet. Click &quot;Add Project&quot; to get started.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {projects.map((entry, index) => (
          <ProjectEntry
            key={entry.id}
            entry={entry}
            index={index}
            onUpdate={onUpdate}
            onRemove={() => onRemove(entry.id)}
            onAddTech={onAddTech}
            onRemoveTech={onRemoveTech}
          />
        ))}
      </div>
    </div>
  )
}

export default ProjectsForm
