import Table from '@/components/ui/Table'
import { useTrading } from '@/hooks/useTrading'
import { formatCurrency } from '@/utils/formatters'

export default function TradingHistory() {
  const { portfolio } = useTrading()

  return (
    <Table
      columns={[
        { accessor: 'timestamp', title: 'Date', render: (row) => new Date(row.timestamp).toLocaleString() },
        { accessor: 'symbol', title: 'Symbol' },
        { accessor: 'type', title: 'Type' },
        { accessor: 'totalCost', title: 'Value', render: (row) => formatCurrency(row.totalCost ?? 0) },
      ]}
      data={portfolio.transactions}
      keyField="timestamp"
    />
  )
}
