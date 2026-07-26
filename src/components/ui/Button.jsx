import { cloneElement } from 'react'

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md px-xl py-4 text-label-md font-label-md transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95'

const variantClasses = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30',
  secondary:
    'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high',
  ghost: 'text-on-surface-variant hover:text-primary',
}

function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  iconLeft,
  iconRight,
  children,
  ...props
}) {
  const classes = `${baseClasses} ${variantClasses[variant] ?? variantClasses.primary} ${className}`

  const leftIcon = iconLeft
    ? cloneElement(iconLeft, { 'aria-hidden': true, className: `text-[1.1rem] ${iconLeft.props.className ?? ''}` })
    : null
  const rightIcon = iconRight
    ? cloneElement(iconRight, { 'aria-hidden': true, className: `text-[1.1rem] ${iconRight.props.className ?? ''}` })
    : null

  return (
    <Component className={classes} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Component>
  )
}

export default Button
