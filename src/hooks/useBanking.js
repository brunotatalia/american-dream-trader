import { useEffect, useMemo, useState } from 'react'

import bankingConfig from '@/config/gameConfig'

export function useBanking() {
  const [activeAccountId, setActiveAccountId] = useState(
    bankingConfig?.banking?.accounts?.[0]?.id ?? null,
  )

  const accounts = useMemo(
    () => bankingConfig?.banking?.accounts ?? [],
    [],
  )

  useEffect(() => {
    if (!activeAccountId && accounts.length > 0) {
      setActiveAccountId(accounts[0].id)
    }
  }, [accounts, activeAccountId])

  const activeAccount = useMemo(
    () => accounts.find((account) => account.id === activeAccountId) ?? null,
    [accounts, activeAccountId],
  )

  return {
    accounts,
    activeAccount,
    selectAccount: setActiveAccountId,
    clearSelection: () => setActiveAccountId(null),
  }
}
