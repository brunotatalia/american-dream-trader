import { useMemo } from 'react'

import networkDatabase from '@/data/networkDatabase'
import { useEra } from '@/hooks/useEra'
import { useNetworkStore } from '@/stores/networkStore'

export function useNetwork() {
  const contacts = useNetworkStore((state) => state.contacts)
  const unlockedContacts = useNetworkStore((state) => state.unlockedContacts)
  const pendingTips = useNetworkStore((state) => state.pendingTips)
  const { eraData } = useEra()

  const allContacts = useMemo(() => {
    if (!eraData) return networkDatabase
    return networkDatabase.filter(
      (c) => !c.eraAvailability || c.eraAvailability.includes(eraData.id),
    )
  }, [eraData])

  const unlockedContactDetails = useMemo(() =>
    allContacts.filter((c) => unlockedContacts.includes(c.id)),
  [allContacts, unlockedContacts])

  const lockedContacts = useMemo(() =>
    allContacts.filter((c) => !unlockedContacts.includes(c.id)),
  [allContacts, unlockedContacts])

  const networkPower = useNetworkStore.getState().getNetworkPower()

  return {
    contacts,
    unlockedContacts,
    pendingTips,
    allContacts,
    unlockedContactDetails,
    lockedContacts,
    networkPower,
    unlockContact: useNetworkStore.getState().unlockContact,
    interactWithContact: useNetworkStore.getState().interactWithContact,
    addTip: useNetworkStore.getState().addTip,
    dismissTip: useNetworkStore.getState().dismissTip,
  }
}
