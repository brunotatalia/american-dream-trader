export default function Table({ columns = [], data = [], keyField = 'id' }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5">
      <table className="min-w-full divide-y divide-white/10 bg-background-elevated/60">
        <thead className="bg-background-tertiary/60">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wide text-text-tertiary">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((row) => (
            <tr key={row[keyField] ?? JSON.stringify(row)} className="hover:bg-background-tertiary/40">
              {columns.map((column) => (
                <td key={column.accessor} className="px-4 py-3 text-sm text-text-secondary">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
