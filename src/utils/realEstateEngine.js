/**
 * Purchase a property
 */
export function purchaseProperty({ property, player, realEstate, notify }) {
  const downPaymentAmount = property.price * property.downPayment
  const totalUpfront = downPaymentAmount // Future: add closing costs

  if (player.cash < totalUpfront) {
    return {
      success: false,
      error: 'Insufficient funds for down payment',
    }
  }

  // Deduct down payment
  player.adjustCash(-totalUpfront, `property_purchase_${property.id}`)

  // Add property to portfolio
  const ownedProperty = {
    ...property,
    purchaseDate: Date.now(),
    currentValue: property.price,
    mortgageRemaining: property.price - downPaymentAmount,
    monthlyPayment: calculateMortgagePayment(
      property.price - downPaymentAmount,
      0.06, // 6% interest for 1920s
      360, // 30 years
    ),
  }

  realEstate.addProperty(ownedProperty)

  notify({
    title: 'Property Purchased!',
    description: `You now own a ${property.type} in ${property.location}.`,
    variant: 'success',
  })

  return {
    success: true,
    property: ownedProperty,
  }
}

/**
 * Calculate monthly mortgage payment
 */
function calculateMortgagePayment(principal, annualRate, termMonths) {
  if (annualRate === 0) return principal / termMonths

  const monthlyRate = annualRate / 12
  const numerator = principal * monthlyRate * (1 + monthlyRate) ** termMonths
  const denominator = (1 + monthlyRate) ** termMonths - 1

  return numerator / denominator
}

/**
 * Collect rent from all properties
 */
export function collectRent(ownedProperties) {
  let totalRent = 0

  Object.values(ownedProperties).forEach((property) => {
    // Random tenant payment (85% chance they pay on time)
    if (Math.random() < 0.85) {
      totalRent += property.monthlyRent
    }
  })

  return totalRent
}

/**
 * Apply property appreciation
 */
export function appreciateProperties(ownedProperties) {
  const updates = {}

  Object.entries(ownedProperties).forEach(([id, property]) => {
    const appreciationRate = property.appreciation / 12 // Monthly
    const randomFactor = 1 + (Math.random() - 0.5) * 0.02 // +/- 1%
    const newValue = property.currentValue * (1 + appreciationRate * randomFactor)

    updates[id] = {
      ...property,
      currentValue: newValue,
    }
  })

  return updates
}

/**
 * Update market listing prices based on economic conditions
 * This simulates how property prices change over time in the market
 */
export function updateListingPrices(properties, economicGrowth = 0.05) {
  return properties.map((property) => {
    // Annual growth rate adjusted monthly
    const monthlyGrowth = economicGrowth / 12
    const randomFactor = 1 + (Math.random() - 0.5) * 0.03 // +/- 1.5% variance
    const newPrice = property.price * (1 + monthlyGrowth * randomFactor)
    
    // Also adjust rent proportionally
    const newRent = property.monthlyRent * (1 + monthlyGrowth * randomFactor)

    return {
      ...property,
      price: Math.round(newPrice),
      monthlyRent: Math.round(newRent),
    }
  })
}

