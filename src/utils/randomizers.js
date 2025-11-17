export function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export function pickWeighted(items) {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight ?? 1), 0)
  let threshold = Math.random() * totalWeight

  for (const item of items) {
    threshold -= item.weight ?? 1
    if (threshold <= 0) {
      return item.value ?? item
    }
  }

  return items[items.length - 1].value ?? items[items.length - 1]
}
