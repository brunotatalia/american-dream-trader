import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-portfolio-store',
  partialize: (state) => ({
    positions: state.positions,
    cashReserved: state.cashReserved,
    transactions: state.transactions,
  }),
}

export const usePortfolioStore = create(
  persist(
    (set) => ({
      positions: {},
      cashReserved: 0,
      transactions: [],
      leverage: {
        marginUsed: 0,
        marginLimit: 0,
        maintenanceMargin: 0.25,
      },
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions].slice(0, 200),
        })),
      updatePosition: (symbol, updates) =>
        set((state) => ({
          positions: {
            ...state.positions,
            [symbol]: { ...(state.positions[symbol] || {}), ...updates },
          },
        })),
      removePosition: (symbol) =>
        set((state) => {
          const positions = { ...state.positions }
          delete positions[symbol]
          return { positions }
        }),
      setCashReserved: (amount) => set({ cashReserved: Math.max(0, amount) }),
      setLeverage: (updates) =>
        set((state) => ({
          leverage: { ...state.leverage, ...updates },
        })),
      resetPortfolio: () =>
        set({ positions: {}, cashReserved: 0, transactions: [], leverage: { marginUsed: 0, marginLimit: 0, maintenanceMargin: 0.25 } }),
    }),
    persistConfig,
  ),
)
