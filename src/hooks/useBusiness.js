import { useMemo } from 'react'

import businessDatabase from '@/data/businessDatabase'
import { useEra } from '@/hooks/useEra'
import { useBusinessStore } from '@/stores/businessStore'

export function useBusiness() {
  const ownedBusinesses = useBusinessStore((state) => state.ownedBusinesses)
  const businessHistory = useBusinessStore((state) => state.businessHistory)
  const totalBusinessIncome = useBusinessStore((state) => state.totalBusinessIncome)
  const { eraData } = useEra()

  const availableBusinesses = useMemo(() => {
    if (!eraData) return businessDatabase
    return businessDatabase.filter(
      (b) => !b.eraAvailability || b.eraAvailability.includes(eraData.id),
    )
  }, [eraData])

  const ownedCount = Object.keys(ownedBusinesses).length

  const totalMonthlyRevenue = useMemo(() =>
    Object.values(ownedBusinesses).reduce(
      (sum, b) => sum + (b.revenueRange.min + b.revenueRange.max) / 2,
      0,
    ),
  [ownedBusinesses])

  const totalMonthlyExpenses = useMemo(() =>
    Object.values(ownedBusinesses).reduce(
      (sum, b) => sum + b.monthlyExpenses,
      0,
    ),
  [ownedBusinesses])

  return {
    ownedBusinesses,
    businessHistory,
    totalBusinessIncome,
    availableBusinesses,
    ownedCount,
    totalMonthlyRevenue,
    totalMonthlyExpenses,
    startBusiness: useBusinessStore.getState().startBusiness,
    closeBusiness: useBusinessStore.getState().closeBusiness,
    upgradeBusiness: useBusinessStore.getState().upgradeBusiness,
    hireEmployee: useBusinessStore.getState().hireEmployee,
    collectDailyRevenue: useBusinessStore.getState().collectDailyRevenue,
  }
}
