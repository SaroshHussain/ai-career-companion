import { useState, useRef, useEffect } from 'react'
import { HiOutlinePlus, HiXMark, HiCheck } from 'react-icons/hi2'

const categories = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'languages', label: 'Languages' },
  { key: 'certifications', label: 'Certifications' },
]

function EditableTag({ label, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(label)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const startEditing = () => {
    setValue(label)
    setEditing(true)
  }

  const save = () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== label) {
      onEdit(trimmed)
    }
    setEditing(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      save()
    }
    if (event.key === 'Escape') {
      setValue(label)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pl-2 pr-1 text-label-sm text-primary">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={save}
          className="min-w-[60px] max-w-[160px] bg-transparent text-label-sm text-on-surface outline-none"
        />
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={save}
          className="rounded-full p-0.5 transition hover:bg-primary/20"
          aria-label="Save"
        >
          <HiCheck className="text-sm" />
        </button>
      </span>
    )
  }

  return (
    <span
      className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-label-sm text-primary transition hover:bg-primary/15"
      onClick={startEditing}
      title="Click to edit"
    >
      {label}
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onRemove()
        }}
        className="ml-0.5 rounded-full p-0.5 transition hover:bg-primary/20"
        aria-label={`Remove ${label}`}
      >
        <HiXMark className="text-sm" />
      </button>
    </span>
  )
}

function SkillCategory({ category, items, onAdd, onRemove, onEdit }) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (trimmed) {
      onAdd(category.key, trimmed)
      setInputValue('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4">
      <label className="mb-2 block text-label-sm font-medium text-on-surface-variant">
        {category.label}
      </label>
      <div className="mb-2 flex min-h-[2rem] flex-wrap gap-2">
        {items && items.length > 0
          ? items.map((item, index) => (
              <EditableTag
                key={`${category.key}-${index}`}
                label={item}
                onRemove={() => onRemove(category.key, index)}
                onEdit={(newValue) => onEdit(category.key, index, newValue)}
              />
            ))
          : (
            <span className="text-body-sm text-on-surface-variant">No items added yet.</span>
          )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${category.label.toLowerCase()}...`}
          className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
        >
          <HiOutlinePlus className="text-base" />
        </button>
      </div>
    </div>
  )
}

function SkillsForm({ skills, onAdd, onRemove, onEdit }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-headline-md text-on-surface">Skills</h2>
        <p className="mt-1 text-body-sm text-on-surface-variant">
          Add your technical skills, soft skills, languages, and certifications. Click any tag to edit it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <SkillCategory
            key={category.key}
            category={category}
            items={skills[category.key]}
            onAdd={onAdd}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default SkillsForm
