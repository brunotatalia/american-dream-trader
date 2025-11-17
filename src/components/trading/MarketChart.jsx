import Chart from '@/components/ui/Chart'

export default function MarketChart({ data = [] }) {
  return (
    <div className="rounded-xl border border-white/5 bg-background-tertiary/40 p-4">
      <Chart data={data} />
    </div>
  )
}
