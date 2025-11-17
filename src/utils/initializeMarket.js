import commoditiesDatabase from '@/data/commoditiesDatabase'
import stocksDatabase from '@/data/stocksDatabase'

export function initializeMarket(eraId) {
  const assets = {}

  // Initialize stocks
  stocksDatabase.forEach((stock) => {
    if (!stock.eraAvailability || stock.eraAvailability.includes(eraId)) {
      assets[stock.symbol] = {
        ...stock,
        currentPrice: stock.initialPrice,
        priceChange: 0,
        priceChangePercent: 0,
        history: [
          {
            timestamp: Date.now(),
            price: stock.initialPrice,
          },
        ],
      }
    }
  })

  // Initialize commodities
  Object.values(commoditiesDatabase).forEach((category) => {
    category.forEach((commodity) => {
      if (!commodity.eraAvailability || commodity.eraAvailability.includes(eraId)) {
        assets[commodity.id] = {
          ...commodity,
          currentPrice: commodity.initialPrice,
          priceChange: 0,
          priceChangePercent: 0,
          history: [
            {
              timestamp: Date.now(),
              price: commodity.initialPrice,
            },
          ],
        }
      }
    })
  })

  return assets
}

