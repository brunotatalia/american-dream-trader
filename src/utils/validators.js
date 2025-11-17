export function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function isWithinRange(value, min, max) {
  return value >= min && value <= max
}

export function validateOrder(order) {
  if (!order || typeof order !== 'object') return false
  if (!order.asset) return false
  if (!isPositiveNumber(order.quantity)) return false
  return true
}
