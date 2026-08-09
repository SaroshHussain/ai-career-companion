import { useState, useEffect } from 'react'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import SettingsTabs from '../components/settings/SettingsTabs'
import ProfileSection from '../components/settings/ProfileSection'
import PersonalInfo from '../components/settings/PersonalInfo'
import ProfessionalLinks from '../components/settings/ProfessionalLinks'
import AppearanceSelector from '../components/settings/AppearanceSelector'
import Toast from '../components/ui/Toast'
import { useAuth } from '../hooks/useAuth'

const TABS = ['Profile', 'Billing']

const APPEARANCE_KEY = 'pathfinder-appearance'

function loadAppearance() {
  try {
    return localStorage.getItem(APPEARANCE_KEY) || 'system'
  } catch {
    return 'system'
  }
}

function saveAppearance(val) {
  try {
    localStorage.setItem(APPEARANCE_KEY, val)
  } catch {}
}

function applyTheme(mode) {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
  } else if (mode === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
}

function Settings() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('Profile')

  const [avatar, setAvatar] = useState('')

  const [name, setName] = useState(user?.name || '')
  const [title, setTitle] = useState('Frontend AI Engineer')
  const [bio, setBio] = useState('')

  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  const [linkedin, setLinkedin] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [github, setGithub] = useState('')

  const [appearance, setAppearance] = useState(loadAppearance)

  const [toastOpen, setToastOpen] = useState(false)

  const [savedState, setSavedState] = useState(null)

  useEffect(() => {
    applyTheme(appearance)
    if (appearance === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [appearance])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pathfinder-settings')
      if (raw) {
        const s = JSON.parse(raw)
        setAvatar(s.avatar || '')
        setName(s.name || user?.name || '')
        setTitle(s.title || 'Frontend AI Engineer')
        setBio(s.bio || '')
        setEmail(s.email || user?.email || '')
        setPhone(s.phone || '')
        setLocation(s.location || '')
        setLinkedin(s.linkedin || '')
        setPortfolio(s.portfolio || '')
        setGithub(s.github || '')
        setAppearance(s.appearance || 'system')
        setSavedState(s)
      } else {
        setSavedState({
          avatar: '',
          name: user?.name || '',
          title: 'Frontend AI Engineer',
          bio: '',
          email: user?.email || '',
          phone: '',
          location: '',
          linkedin: '',
          portfolio: '',
          github: '',
          appearance: 'system',
        })
      }
    } catch {
      const fallback = {
        avatar: '',
        name: user?.name || '',
        title: 'Frontend AI Engineer',
        bio: '',
        email: user?.email || '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        github: '',
        appearance: 'system',
      }
      setSavedState(fallback)
    }
  }, [user])

  const handleSave = () => {
    saveAppearance(appearance)
    const newState = {
      avatar,
      name,
      title,
      bio,
      email,
      phone,
      location,
      linkedin,
      portfolio,
      github,
      appearance,
    }
    localStorage.setItem('pathfinder-settings', JSON.stringify(newState))
    setSavedState(newState)
    setToastOpen(true)
  }

  const handleCancel = () => {
    if (!savedState) return
    setAvatar(savedState.avatar || '')
    setName(savedState.name || user?.name || '')
    setTitle(savedState.title || 'Frontend AI Engineer')
    setBio(savedState.bio || '')
    setEmail(savedState.email || user?.email || '')
    setPhone(savedState.phone || '')
    setLocation(savedState.location || '')
    setLinkedin(savedState.linkedin || '')
    setPortfolio(savedState.portfolio || '')
    setGithub(savedState.github || '')
    setAppearance(savedState.appearance || 'system')
  }

  const nameError = name.trim().length === 0

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Settings</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Manage your account preferences and profile information.
          </p>
        </div>

        <SettingsTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab !== 'Profile' ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-outline-variant/50 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low">
              <svg
                className="h-6 w-6 text-outline-variant"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-body-sm font-medium text-on-surface">Coming Soon</p>
              <p className="mt-0.5 text-label-sm text-on-surface-variant">
                This feature is under development.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ProfileSection
              avatar={avatar}
              onAvatarChange={setAvatar}
              name={name}
              onNameChange={setName}
              title={title}
              onTitleChange={setTitle}
              bio={bio}
              onBioChange={setBio}
            />

            <PersonalInfo
              email={email}
              onEmailChange={setEmail}
              phone={phone}
              onPhoneChange={setPhone}
              location={location}
              onLocationChange={setLocation}
            />

            <ProfessionalLinks
              linkedin={linkedin}
              onLinkedinChange={setLinkedin}
              portfolio={portfolio}
              onPortfolioChange={setPortfolio}
              github={github}
              onGithubChange={setGithub}
            />

            <AppearanceSelector value={appearance} onChange={(v) => setAppearance(v)} />

            <div className="flex items-center justify-end gap-3 border-t border-outline-variant/30 pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/50 px-4 py-2.5 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={nameError}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <Toast
        message="Settings saved successfully."
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </DashboardLayout>
  )
}

export default Settings
