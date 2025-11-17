import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useEra } from '@/hooks/useEra'

export default function WelcomeScreen({ onDismiss }) {
  const { eraData } = useEra()

  if (!eraData) return null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border-accent-primary/30 bg-gradient-to-br from-accent-primary/20 via-transparent to-transparent">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Welcome to {eraData.name}!</CardTitle>
          <p className="mt-2 text-center text-text-secondary">{eraData.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-background-tertiary/60 p-4 text-center">
              <p className="text-sm uppercase tracking-wider text-text-tertiary">Starting Capital</p>
              <p className="mt-2 font-display text-2xl text-accent-success">
                ${eraData.startingCapital.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background-tertiary/60 p-4 text-center">
              <p className="text-sm uppercase tracking-wider text-text-tertiary">Time Period</p>
              <p className="mt-2 font-display text-2xl text-text-primary">
                {eraData.startYear}–{eraData.endYear}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-background-tertiary/60 p-4 text-center">
              <p className="text-sm uppercase tracking-wider text-text-tertiary">Market Volatility</p>
              <p className="mt-2 font-display text-2xl text-text-primary">
                {eraData.marketVolatilityModifier}x
              </p>
            </div>
          </div>

          {eraData.economicContext && (
            <div className="rounded-lg border border-white/10 bg-background-elevated/60 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Economic Context
              </p>
              <p className="text-sm leading-relaxed text-text-secondary">{eraData.economicContext}</p>
            </div>
          )}

          {eraData.keyEvents && eraData.keyEvents.length > 0 && (
            <div className="rounded-lg border border-white/10 bg-background-elevated/60 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Major Events This Era
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
                {eraData.keyEvents.map((event, idx) => (
                  <li key={idx}>{event}</li>
                ))}
              </ul>
            </div>
          )}

          {eraData.strategies && eraData.strategies.length > 0 && (
            <div className="rounded-lg border border-accent-info/20 bg-accent-info/10 p-4">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-info">
                Success Strategies
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
                {eraData.strategies.map((strategy, idx) => (
                  <li key={idx}>{strategy}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button variant="primary" size="lg" onClick={onDismiss}>
              Begin Your Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

