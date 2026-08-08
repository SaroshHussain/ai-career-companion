import { HiOutlineSun, HiOutlineMoon, HiOutlineComputerDesktop } from 'react-icons/hi2'

const options = [
  { value: 'light', label: 'Light', icon: HiOutlineSun },
  { value: 'dark', label: 'Dark', icon: HiOutlineMoon },
  { value: 'system', label: 'System', icon: HiOutlineComputerDesktop },
]

function AppearanceSelector({ value, onChange }) {
  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-card sm:p-6">
      <h3 className="text-headline-md text-on-surface">Appearance</h3>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {options.map((opt) => {
          const Icon = opt.icon
          const selected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition ${
                selected
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-outline-variant/50 text-on-surface-variant hover:border-outline-variant hover:text-on-surface'
              }`}
            >
              <Icon className={`text-xl ${selected ? 'text-primary' : ''}`} aria-hidden />
              <span className="text-label-sm font-medium">{opt.label}</span>
              {selected && (
                <svg className="ml-auto h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default AppearanceSelector
