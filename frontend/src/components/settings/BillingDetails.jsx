import {
  HiOutlineCreditCard,
  HiOutlineLockClosed,
  HiOutlineMapPin,
} from 'react-icons/hi2'

const inputClass =
  'w-full rounded-lg border bg-surface-container-lowest px-3.5 py-2.5 text-body-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15'

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-0.5 text-label-sm font-medium text-on-surface">
      {children}
      <span className="text-red-500" aria-hidden="true">
        *
      </span>
    </label>
  )
}

function BillingDetails({
  cardHolder,
  onCardHolderChange,
  cardNumber,
  onCardNumberChange,
  expiry,
  onExpiryChange,
  cvv,
  onCvvChange,
  billingEmail,
  onBillingEmailChange,
  address,
  onAddressChange,
  city,
  onCityChange,
  state,
  onStateChange,
  zip,
  onZipChange,
  country,
  onCountryChange,
}) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailError = billingEmail.trim().length > 0 && !emailPattern.test(billingEmail.trim())
  const digitsOnly = (val) => val.replace(/\D/g, '')
  const cardNumberError = cardNumber.trim().length > 0 && digitsOnly(cardNumber.trim()).length !== 16
  const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/
  const expiryError = expiry.trim().length > 0 && !expiryPattern.test(expiry.trim())
  const cvvError = cvv.trim().length > 0 && digitsOnly(cvv.trim()).length < 3

  const errorClass = (hasError) =>
    hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-card">
      <div className="flex items-center gap-3 border-b border-outline-variant/20 bg-surface-container-low/50 px-5 py-5 sm:px-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HiOutlineCreditCard className="text-xl" aria-hidden />
        </div>
        <div>
          <h3 className="text-headline-md text-on-surface">Billing Details</h3>
          <p className="mt-0.5 text-body-sm text-on-surface-variant">
            Enter your payment information and billing address.
          </p>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HiOutlineLockClosed className="text-base text-primary" aria-hidden />
            <h4 className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
              Payment Information
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="settings-billing-email">Email for Receipts</Label>
              <input
                id="settings-billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => onBillingEmailChange(e.target.value)}
                className={`${inputClass} ${errorClass(emailError)}`}
                placeholder="billing@example.com"
              />
              {emailError && <p className="mt-1 text-body-sm text-red-600 dark:text-red-400">Enter a valid email address.</p>}
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="settings-card-holder">Name on Card</Label>
              <input
                id="settings-card-holder"
                type="text"
                value={cardHolder}
                onChange={(e) => onCardHolderChange(e.target.value)}
                className={inputClass}
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <Label htmlFor="settings-card-number">Card Number</Label>
              <input
                id="settings-card-number"
                type="text"
                inputMode="numeric"
                value={cardNumber}
                onChange={(e) => onCardNumberChange(e.target.value)}
                className={`${inputClass} ${errorClass(cardNumberError)}`}
                placeholder="1234 5678 9012 3456"
              />
              {cardNumberError && (
                <p className="mt-1 text-body-sm text-red-600 dark:text-red-400">Enter a valid 16-digit card number.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="settings-expiry">Expiry Date</Label>
                <input
                  id="settings-expiry"
                  type="text"
                  value={expiry}
                  onChange={(e) => onExpiryChange(e.target.value)}
                  className={`${inputClass} ${errorClass(expiryError)}`}
                  placeholder="MM/YY"
                />
                {expiryError && <p className="mt-1 text-body-sm text-red-600 dark:text-red-400">Use the MM/YY format.</p>}
              </div>
              <div>
                <Label htmlFor="settings-cvv">CVV</Label>
                <input
                  id="settings-cvv"
                  type="text"
                  inputMode="numeric"
                  value={cvv}
                  onChange={(e) => onCvvChange(e.target.value)}
                  className={`${inputClass} ${errorClass(cvvError)}`}
                  placeholder="123"
                />
                {cvvError && <p className="mt-1 text-body-sm text-red-600 dark:text-red-400">Enter a valid CVV.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HiOutlineMapPin className="text-base text-primary" aria-hidden />
            <h4 className="text-label-sm font-semibold uppercase tracking-wide text-on-surface-variant">
              Billing Address
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="settings-billing-address">Billing Address</Label>
              <input
                id="settings-billing-address"
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                className={inputClass}
                placeholder="Street address"
              />
            </div>

            <div>
              <Label htmlFor="settings-billing-city">City</Label>
              <input
                id="settings-billing-city"
                type="text"
                value={city}
                onChange={(e) => onCityChange(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="settings-billing-state">State / Province</Label>
              <input
                id="settings-billing-state"
                type="text"
                value={state}
                onChange={(e) => onStateChange(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="settings-billing-zip">ZIP / Postal Code</Label>
              <input
                id="settings-billing-zip"
                type="text"
                value={zip}
                onChange={(e) => onZipChange(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="settings-billing-country">Country</Label>
              <input
                id="settings-billing-country"
                type="text"
                value={country}
                onChange={(e) => onCountryChange(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BillingDetails