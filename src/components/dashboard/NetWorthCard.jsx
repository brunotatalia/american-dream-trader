import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/utils/formatters'

export default function NetWorthCard({ netWorth, dailyChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-display text-3xl text-text-primary">{formatCurrency(netWorth)}</p>
        <p className="text-sm text-text-tertiary">Daily change: {formatCurrency(dailyChange)}</p>
      </CardContent>
    </Card>
  )
}
