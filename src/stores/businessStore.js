import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-business-store',
  partialize: (state) => ({
    ownedBusinesses: state.ownedBusinesses,
    businessHistory: state.businessHistory,
    totalBusinessIncome: state.totalBusinessIncome,
  }),
}

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      ownedBusinesses: {},
      businessHistory: [],
      totalBusinessIncome: 0,

      startBusiness: (business, startDay) => {
        const id = `${business.id}_${Date.now()}`
        set((state) => ({
          ownedBusinesses: {
            ...state.ownedBusinesses,
            [id]: {
              businessId: business.id,
              name: business.name,
              category: business.category,
              level: 1,
              employees: 0,
              dailyRevenue: [],
              totalRevenue: 0,
              totalExpenses: 0,
              startDay,
              monthlyExpenses: business.monthlyExpenses ?? 0,
              revenueRange: business.monthlyRevenue ?? { min: 0, max: 0 },
            },
          },
        }))
        return id
      },

      closeBusiness: (ownedId) => {
        const state = get()
        const business = state.ownedBusinesses[ownedId]
        if (!business) return 0

        const recoveryRate = 0.3 + Math.random() * 0.3
        const recoveredAmount = Math.round(business.totalRevenue * 0.1 * recoveryRate)

        set((s) => {
          const updated = { ...s.ownedBusinesses }
          delete updated[ownedId]
          return {
            ownedBusinesses: updated,
            businessHistory: [
              ...s.businessHistory,
              { ...business, closedAt: Date.now(), recovered: recoveredAmount },
            ].slice(-50),
          }
        })
        return recoveredAmount
      },

      upgradeBusiness: (ownedId) =>
        set((state) => {
          const biz = state.ownedBusinesses[ownedId]
          if (!biz || biz.level >= 5) return state
          return {
            ownedBusinesses: {
              ...state.ownedBusinesses,
              [ownedId]: {
                ...biz,
                level: biz.level + 1,
                revenueRange: {
                  min: Math.round(biz.revenueRange.min * 1.25),
                  max: Math.round(biz.revenueRange.max * 1.25),
                },
                monthlyExpenses: Math.round(biz.monthlyExpenses * 1.15),
              },
            },
          }
        }),

      hireEmployee: (ownedId) =>
        set((state) => {
          const biz = state.ownedBusinesses[ownedId]
          if (!biz) return state
          return {
            ownedBusinesses: {
              ...state.ownedBusinesses,
              [ownedId]: {
                ...biz,
                employees: biz.employees + 1,
                revenueRange: {
                  min: Math.round(biz.revenueRange.min * 1.1),
                  max: Math.round(biz.revenueRange.max * 1.1),
                },
                monthlyExpenses: biz.monthlyExpenses + 30,
              },
            },
          }
        }),

      collectDailyRevenue: (ownedId) => {
        const state = get()
        const biz = state.ownedBusinesses[ownedId]
        if (!biz) return 0

        const { min, max } = biz.revenueRange
        const dailyMin = min / 30
        const dailyMax = max / 30
        const revenue = dailyMin + Math.random() * (dailyMax - dailyMin)
        const levelBonus = 1 + (biz.level - 1) * 0.15
        const employeeBonus = 1 + biz.employees * 0.08
        const finalRevenue = Math.round(revenue * levelBonus * employeeBonus * 100) / 100

        set((s) => ({
          ownedBusinesses: {
            ...s.ownedBusinesses,
            [ownedId]: {
              ...biz,
              totalRevenue: biz.totalRevenue + finalRevenue,
              dailyRevenue: [...(biz.dailyRevenue || []).slice(-29), finalRevenue],
            },
          },
          totalBusinessIncome: s.totalBusinessIncome + finalRevenue,
        }))

        return finalRevenue
      },

      getBusinessCount: () => Object.keys(get().ownedBusinesses).length,

      resetBusinesses: () =>
        set({ ownedBusinesses: {}, businessHistory: [], totalBusinessIncome: 0 }),
    }),
    persistConfig,
  ),
)
