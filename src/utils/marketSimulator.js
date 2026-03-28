import economicIndicators from '@/data/economicIndicators'

import { randomBetween } from './randomizers'

/**
 * Simulate price change using geometric Brownian motion with economic factors
 */
export function simulatePrice(currentPrice, asset, eraVolatilityModifier = 1) {
  // Validate inputs
  if (!currentPrice || isNaN(currentPrice) || currentPrice <= 0) {
    console.warn('⚠️ Invalid currentPrice, using initialPrice')
    return asset.initialPrice ?? 1
  }

  // Parse trend value if it's a string
  let trendValue = 0
  if (typeof asset.trend === 'string') {
    if (asset.trend === 'bullish') trendValue = 0.001 // +0.1% daily bias
    else if (asset.trend === 'bearish') trendValue = -0.001 // -0.1% daily bias
    else trendValue = 0 // neutral
  } else {
    trendValue = asset.trend || 0
  }

  const volatility = asset.volatility ?? 0.1
  const sector = asset.sector

  // Economic indicators impact
  const gdpImpact = economicIndicators.gdpGrowth.current * (economicIndicators.gdpGrowth.impact[sector] ?? 0.3)
  const unemploymentImpact = economicIndicators.unemployment.current * -0.2
  const indicatorImpact = (gdpImpact + unemploymentImpact) * 0.1

  // Random walk component with era-adjusted volatility (this is the main driver)
  const adjustedVolatility = volatility * eraVolatilityModifier
  const randomShock = randomBetween(-adjustedVolatility, adjustedVolatility)

  // Mean reversion (prevent infinite drift)
  const fairValue = asset.initialPrice ?? currentPrice
  const meanReversion = fairValue > 0 ? ((fairValue - currentPrice) / fairValue) * 0.005 : 0

  // Combine all factors
  let totalChange = trendValue + indicatorImpact + randomShock + meanReversion

  // CRITICAL: Ensure there's ALWAYS some movement (minimum 0.1% change)
  // This prevents prices from getting stuck
  if (Math.abs(totalChange) < 0.001) {
    totalChange = (Math.random() - 0.5) * 0.002 // Random -0.1% to +0.1%
  }

  // Apply the change
  const newPrice = currentPrice * (1 + totalChange)

  return Math.max(newPrice, 0.01)
}

/**
 * Update all market prices for daily tick
 */
export function updateMarketPrices(assets, eraVolatilityModifier = 1) {
  const updates = {}

  Object.entries(assets).forEach(([symbol, asset]) => {
    // Ensure we have a valid current price
    const currentPrice = asset.currentPrice ?? asset.initialPrice ?? 1
    
    // Validate current price is not NaN
    if (isNaN(currentPrice)) {
      console.error(`Invalid price for ${symbol}, resetting to initial`)
      updates[symbol] = {
        ...asset,
        currentPrice: asset.initialPrice ?? 1,
        priceChange: 0,
        priceChangePercent: 0,
      }
      return
    }

    const newPrice = simulatePrice(currentPrice, asset, eraVolatilityModifier)
    
    // Validate result
    if (isNaN(newPrice) || newPrice <= 0) {
      console.error(`SimulatePrice returned invalid value for ${symbol}:`, newPrice)
      updates[symbol] = asset // Keep existing
      return
    }

    const priceChange = newPrice - currentPrice
    const priceChangePercent = currentPrice > 0 ? (priceChange / currentPrice) * 100 : 0

    updates[symbol] = {
      ...asset,
      currentPrice: newPrice,
      priceChange,
      priceChangePercent,
      history: [
        ...(asset.history || []),
        {
          timestamp: Date.now(),
          price: newPrice,
        },
      ].slice(-365), // Keep 1 year of history
    }
  })

  return updates
}

export function simulatePortfolioValue(positions = {}) {
  return Object.values(positions).reduce((acc, position) => {
    const { quantity = 0, price = 0 } = position
    return acc + quantity * price
  }, 0)
}

// Test function - expose to window for debugging
if (typeof window !== 'undefined') {
  window.testPriceSimulation = (asset = { symbol: 'TEST', initialPrice: 100, volatility: 0.15, trend: 'bullish', sector: 'Automotive' }) => {
    console.log('🧪 Testing price simulation...')
    console.log('Input asset:', asset)
    const prices = []
    let currentPrice = asset.initialPrice
    for (let i = 0; i < 10; i++) {
      const newPrice = simulatePrice(currentPrice, asset, 1.0)
      const change = ((newPrice - currentPrice) / currentPrice) * 100
      prices.push({ day: i + 1, price: newPrice.toFixed(2), change: change.toFixed(3) + '%' })
      currentPrice = newPrice
    }
    console.table(prices)
    console.log('✓ If you see varying prices above, the simulator works!')
    return prices
  }
}

