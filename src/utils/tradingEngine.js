import tradingConfig from '@/config/tradingConfig'

/**
 * Execute a buy order
 */
export function executeBuyOrder({ symbol, quantity, price, player, portfolio, market }) {
  const totalCost = quantity * price + tradingConfig.fees.commission
  
  if (player.cash < totalCost) {
    return {
      success: false,
      error: 'Insufficient funds',
    }
  }

  // Deduct cash
  player.adjustCash(-totalCost, `buy_${symbol}`)

  // Add to portfolio
  const existingPosition = portfolio.positions[symbol] || { quantity: 0, averagePrice: 0 }
  const newQuantity = existingPosition.quantity + quantity
  const newAveragePrice =
    ((existingPosition.quantity * existingPosition.averagePrice) + (quantity * price)) / newQuantity

  portfolio.updatePosition(symbol, {
    symbol,
    quantity: newQuantity,
    averagePrice: newAveragePrice,
    currentPrice: price,
    sector: market.getAsset(symbol)?.sector ?? 'unknown',
  })

  // Log transaction
  portfolio.addTransaction({
    timestamp: Date.now(),
    type: 'buy',
    symbol,
    quantity,
    price,
    totalCost,
    commission: tradingConfig.fees.commission,
  })

  // Track for achievements
  const { useAchievementStore } = require('@/stores/achievementStore')
  const { useGameStore } = require('@/stores/gameStore')
  const asset = market.getAsset(symbol)
  const currentDay = useGameStore.getState().daysPassed
  useAchievementStore.getState().recordTrade(0, asset?.sector, currentDay)

  return {
    success: true,
    message: `Bought ${quantity} shares of ${symbol} at $${price.toFixed(2)}`,
  }
}

/**
 * Execute a sell order
 */
export function executeSellOrder({ symbol, quantity, price, player, portfolio }) {
  const position = portfolio.positions[symbol]

  if (!position || position.quantity < quantity) {
    return {
      success: false,
      error: 'Insufficient shares',
    }
  }

  const totalProceeds = quantity * price - tradingConfig.fees.commission
  const costBasis = quantity * position.averagePrice
  const realizedPnL = totalProceeds - costBasis

  // Add cash
  player.adjustCash(totalProceeds, `sell_${symbol}`)

  // Update or remove position
  const newQuantity = position.quantity - quantity

  if (newQuantity === 0) {
    portfolio.removePosition(symbol)
  } else {
    portfolio.updatePosition(symbol, {
      ...position,
      quantity: newQuantity,
      currentPrice: price,
    })
  }

  // Log transaction
  portfolio.addTransaction({
    timestamp: Date.now(),
    type: 'sell',
    symbol,
    quantity,
    price,
    totalCost: totalProceeds,
    commission: tradingConfig.fees.commission,
    realizedPnL,
  })

  // Track for achievements (record profit for sell trades)
  const { useAchievementStore } = require('@/stores/achievementStore')
  const { useGameStore } = require('@/stores/gameStore')
  const currentDay = useGameStore.getState().daysPassed
  useAchievementStore.getState().recordTrade(realizedPnL, null, currentDay)

  return {
    success: true,
    message: `Sold ${quantity} shares of ${symbol} at $${price.toFixed(2)}`,
    profit: realizedPnL,
  }
}

