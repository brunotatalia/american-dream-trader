import Button from './Button'

export default function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={tab.id === activeTab ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange?.(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
