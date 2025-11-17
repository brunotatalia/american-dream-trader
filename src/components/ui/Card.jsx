export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-white/5 bg-background-elevated/60 backdrop-blur-sm shadow-lg shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={`border-b border-white/5 px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h2 className={`font-display text-xl font-semibold ${className}`} {...props}>
      {children}
    </h2>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
