import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Chart({ data = [], dataKey = 'value', stroke = '#3b82f6' }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="label" stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
          <YAxis stroke="currentColor" tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
          <Tooltip
            contentStyle={{
              background: 'rgba(17, 24, 39, 0.9)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'white',
            }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
