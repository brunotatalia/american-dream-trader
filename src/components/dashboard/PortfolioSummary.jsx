import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/formatters'

export default function PortfolioSummary({ positions = [] }) {
  const totalValue = positions.reduce((acc, position) => acc + position.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-text-secondary">
        <p className="font-display text-2xl text-text-primary">{formatCurrency(totalValue)}</p>
        <p>Holdings: {positions.length}</p>
      </CardContent>
    </Card>
  )
}
