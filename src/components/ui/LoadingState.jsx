export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-text-secondary">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-accent-primary" />
      <p className="text-sm uppercase tracking-[0.2em]">{message}</p>
    </div>
  )
}
