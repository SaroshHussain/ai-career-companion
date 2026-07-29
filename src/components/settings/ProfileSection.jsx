import { useRef } from 'react'
import { HiOutlineCamera, HiOutlineUserCircle } from 'react-icons/hi2'

function ProfileSection({ avatar, onAvatarChange, name, onNameChange, title, onTitleChange, bio, onBioChange }) {
  const fileInputRef = useRef(null)
  const nameError = name.trim().length === 0

  const handleFile = (file) => {
    if (!file) return
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) return
    const reader = new FileReader()
    reader.onload = (e) => onAvatarChange(e.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:p-6">
      <h3 className="text-headline-md text-on-surface">Profile</h3>

      <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <HiOutlineUserCircle className="text-5xl text-outline-variant" aria-hidden />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant shadow transition hover:bg-surface-container-low hover:text-on-surface"
            aria-label="Change photo"
          >
            <HiOutlineCamera className="text-sm" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files[0])
              e.target.value = ''
            }}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="settings-name" className="mb-1.5 block text-label-sm font-medium text-on-surface">
              Full Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className={`w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:ring-1 ${
                nameError
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
                  : 'border-outline-variant focus:border-primary focus:ring-primary'
              }`}
            />
            {nameError && <p className="mt-1 text-body-sm text-red-600">Name is required.</p>}
          </div>

          <div>
            <label htmlFor="settings-title" className="mb-1.5 block text-label-sm font-medium text-on-surface">
              Professional Title
            </label>
            <input
              id="settings-title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="settings-bio" className="mb-1.5 block text-label-sm font-medium text-on-surface">
              Bio
            </label>
            <textarea
              id="settings-bio"
              rows={3}
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileSection
