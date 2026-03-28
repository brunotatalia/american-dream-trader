const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const percentageFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function formatCurrency(value) {
  if (value == null || isNaN(value) || !isFinite(value)) return '$0.00'
  return currencyFormatter.format(value)
}

export function formatPercent(value) {
  if (value == null || isNaN(value) || !isFinite(value)) return '0%'
  return percentageFormatter.format(value)
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
