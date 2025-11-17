import { useMemo } from 'react'

import { useMarketStore } from '@/stores/marketStore'

export function useMarket(selector) {
  // Subscribe to specific store values to ensure re-renders
  const assets = useMarketStore((state) => state.assets)
  const lastUpdated = useMarketStore((state) => state.lastUpdated)
  const sentiment = useMarketStore((state) => state.sentiment)
  const updateTrigger = useMarketStore((state) => state.updateTrigger)

  const result = useMemo(() => {
    if (typeof selector === 'function') {
      return selector({ assets, lastUpdated, sentiment })
    }

    const assetsList = Object.entries(assets || {}).map(([symbol, asset]) => ({
      symbol: symbol,
      id: asset.id ?? symbol,
      ...asset,
    }))

    return {
      assets,
      lastUpdated,
      sentiment,
      assetsList,
      updateTrigger, // Include for debugging
    }
  }, [assets, lastUpdated, sentiment, updateTrigger, selector])

  return result
}

