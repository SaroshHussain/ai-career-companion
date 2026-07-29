function PersonalInfo({ email, onEmailChange, phone, onPhoneChange, location, onLocationChange }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = email.trim().length > 0 && !emailPattern.test(email.trim())
  const phonePattern = /^[\d\s\-+().]{7,20}$/
  const phoneError = phone.trim().length > 0 && !phonePattern.test(phone.trim())

  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:p-6">
      <h3 className="text-headline-md text-on-surface">Personal Information</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="settings-email" className="mb-1.5 block text-label-sm font-medium text-on-surface">
            Email Address
          </label>
          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={`w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:ring-1 ${
              emailError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
                : 'border-outline-variant focus:border-primary focus:ring-primary'
            }`}
          />
          {emailError && <p className="mt-1 text-body-sm text-red-600">Enter a valid email address.</p>}
        </div>

        <div>
          <label htmlFor="settings-phone" className="mb-1.5 block text-label-sm font-medium text-on-surface">
            Phone Number
          </label>
          <input
            id="settings-phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={`w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:ring-1 ${
              phoneError
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
                : 'border-outline-variant focus:border-primary focus:ring-primary'
            }`}
            placeholder="+1 (555) 000-0000"
          />
          {phoneError && <p className="mt-1 text-body-sm text-red-600">Enter a valid phone number.</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="settings-location" className="mb-1.5 block text-label-sm font-medium text-on-surface">
            Location
          </label>
          <input
            id="settings-location"
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="City, Country"
          />
        </div>
      </div>
    </section>
  )
}

export default PersonalInfo
