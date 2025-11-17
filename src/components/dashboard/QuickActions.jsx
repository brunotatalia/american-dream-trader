import Button from '@/components/ui/Button'

const ACTIONS = [
  { id: 'jobs', label: 'Find Jobs', description: 'Discover income opportunities.' },
  { id: 'trade', label: 'Trade Now', description: 'Enter the markets with confidence.' },
  { id: 'property', label: 'Browse Properties', description: 'Invest in long-term assets.' },
]

export default function QuickActions({ onAction }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {ACTIONS.map((action) => (
        <div key={action.id} className="rounded-xl border border-white/5 bg-background-tertiary/50 p-4">
          <p className="font-semibold text-text-primary">{action.label}</p>
          <p className="mt-1 text-sm text-text-tertiary">{action.description}</p>
          <Button className="mt-3" size="sm" variant="secondary" onClick={() => onAction?.(action.id)}>
            Go
          </Button>
        </div>
      ))}
    </div>
  )
}
