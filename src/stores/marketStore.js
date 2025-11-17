import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-market-store',
  partialize: (state) => ({
    assets: state.assets,
    lastUpdated: state.lastUpdated,
    sentiment: state.sentiment,
  }),
}

export const useMarketStore = create(
  persist(
    (set, get) => ({
      assets: {},
      lastUpdated: null,
      sentiment: 'neutral',
      economicIndicators: {},
      updateTrigger: 0, // Force re-render trigger
      setAssets: (assets) => {
        // Create a completely new object to force Zustand to detect the change
        const newAssets = { ...assets }
        set({ 
          assets: newAssets, 
          lastUpdated: Date.now(),
          updateTrigger: get().updateTrigger + 1 
        })
      },
      updateAssetPrice: (symbol, price) =>
        set((state) => ({
          assets: {
            ...state.assets,
            [symbol]: {
              ...(state.assets[symbol] || {}),
              price,
              history: [
                ...((state.assets[symbol] && state.assets[symbol].history) || []),
                { timestamp: Date.now(), price },
              ].slice(-365),
            },
          },
          lastUpdated: Date.now(),
          updateTrigger: state.updateTrigger + 1,
        })),
      setSentiment: (sentiment) => set({ sentiment }),
      setEconomicIndicators: (indicators) => set({ economicIndicators: indicators }),
      resetMarket: () => set({ assets: {}, lastUpdated: null, sentiment: 'neutral', updateTrigger: 0 }),
      getAsset: (symbol) => get().assets[symbol],
    }),
    persistConfig,
  ),
)
