import Table from '@/components/ui/Table'
import { useRealEstate } from '@/hooks/useRealEstate'
import { formatCurrency } from '@/utils/formatters'

export default function PropertyList() {
  const { availableProperties } = useRealEstate()

  return (
    <Table
      columns={[
        { accessor: 'type', title: 'Type' },
        { accessor: 'location', title: 'Location' },
        { accessor: 'price', title: 'Price', render: (row) => formatCurrency(row.price) },
      ]}
      data={availableProperties}
      keyField="id"
    />
  )
}
