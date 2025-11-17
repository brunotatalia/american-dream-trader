const VARIANT_STYLES = {
  primary: 'bg-accent-primary text-white hover:bg-accent-primary/90',
  secondary: 'bg-background-elevated text-text-primary hover:bg-background-elevated/80',
  success: 'bg-accent-success text-white hover:bg-accent-success/90',
  danger: 'bg-accent-danger text-white hover:bg-accent-danger/90',
  ghost: 'bg-transparent text-text-secondary hover:bg-background-tertiary',
}

const SIZE_STYLES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary
  const sizeClass = SIZE_STYLES[size] ?? SIZE_STYLES.md

  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-info disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
