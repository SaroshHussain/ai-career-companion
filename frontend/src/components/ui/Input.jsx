import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, id, type = 'text', error, className = '', icon, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md font-label-md text-on-surface">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={type}
          className={`w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 pr-10 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
          {...props}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="text-body-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

export default Input
