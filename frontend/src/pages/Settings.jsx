import { useState, useEffect } from 'react'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import SettingsTabs from '../components/settings/SettingsTabs'
import ProfileSection from '../components/settings/ProfileSection'
import PersonalInfo from '../components/settings/PersonalInfo'
import ProfessionalLinks from '../components/settings/ProfessionalLinks'
import AppearanceSelector from '../components/settings/AppearanceSelector'
import BillingDetails from '../components/settings/BillingDetails'
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

  const [billingEmail, setBillingEmail] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [billingCity, setBillingCity] = useState('')
  const [billingState, setBillingState] = useState('')
  const [billingZip, setBillingZip] = useState('')
  const [billingCountry, setBillingCountry] = useState('')

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
        setBillingEmail(s.billingEmail || '')
        setCardHolder(s.cardHolder || '')
        setCardNumber(s.cardNumber || '')
        setExpiry(s.expiry || '')
        setCvv(s.cvv || '')
        setBillingAddress(s.billingAddress || '')
        setBillingCity(s.billingCity || '')
        setBillingState(s.billingState || '')
        setBillingZip(s.billingZip || '')
        setBillingCountry(s.billingCountry || '')
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
          billingEmail: '',
          cardHolder: '',
          cardNumber: '',
          expiry: '',
          cvv: '',
          billingAddress: '',
          billingCity: '',
          billingState: '',
          billingZip: '',
          billingCountry: '',
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
        billingEmail: '',
        cardHolder: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingZip: '',
        billingCountry: '',
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
      billingEmail,
      cardHolder,
      cardNumber,
      expiry,
      cvv,
      billingAddress,
      billingCity,
      billingState,
      billingZip,
      billingCountry,
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
    setBillingEmail(savedState.billingEmail || '')
    setCardHolder(savedState.cardHolder || '')
    setCardNumber(savedState.cardNumber || '')
    setExpiry(savedState.expiry || '')
    setCvv(savedState.cvv || '')
    setBillingAddress(savedState.billingAddress || '')
    setBillingCity(savedState.billingCity || '')
    setBillingState(savedState.billingState || '')
    setBillingZip(savedState.billingZip || '')
    setBillingCountry(savedState.billingCountry || '')
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

        {activeTab === 'Billing' ? (
          <div className="space-y-6">
            <BillingDetails
              cardHolder={cardHolder}
              onCardHolderChange={setCardHolder}
              cardNumber={cardNumber}
              onCardNumberChange={setCardNumber}
              expiry={expiry}
              onExpiryChange={setExpiry}
              cvv={cvv}
              onCvvChange={setCvv}
              billingEmail={billingEmail}
              onBillingEmailChange={setBillingEmail}
              address={billingAddress}
              onAddressChange={setBillingAddress}
              city={billingCity}
              onCityChange={setBillingCity}
              state={billingState}
              onStateChange={setBillingState}
              zip={billingZip}
              onZipChange={setBillingZip}
              country={billingCountry}
              onCountryChange={setBillingCountry}
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-lg border border-outline-variant/60 bg-surface-container-lowest px-4 py-2.5 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low hover:border-outline-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white shadow-card transition hover:bg-primary/95 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
              >
                Save Changes
              </button>
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
