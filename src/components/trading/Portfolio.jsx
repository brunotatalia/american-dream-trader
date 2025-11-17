import Table from '@/components/ui/Table'
import { useTrading } from '@/hooks/useTrading'
import { formatCurrency } from '@/utils/formatters'

export default function Portfolio() {
  const { portfolio } = useTrading()

  return (
    <Table
      columns={[
        { accessor: 'symbol', title: 'Symbol' },
        { accessor: 'quantity', title: 'Quantity' },
        { accessor: 'price', title: 'Last Price', render: (row) => formatCurrency(row.price ?? 0) },
      ]}
      data={Object.keys(portfolio.positions).map((symbol) => ({
        symbol,
        ...portfolio.positions[symbol],
      }))}
    />
  )
}
