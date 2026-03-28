import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-network-store',
  partialize: (state) => ({
    contacts: state.contacts,
    unlockedContacts: state.unlockedContacts,
    pendingTips: state.pendingTips,
  }),
}

export const useNetworkStore = create(
  persist(
    (set, get) => ({
      contacts: {},
      unlockedContacts: [],
      pendingTips: [],

      unlockContact: (contact) =>
        set((state) => {
          if (state.unlockedContacts.includes(contact.id)) return state
          return {
            unlockedContacts: [...state.unlockedContacts, contact.id],
            contacts: {
              ...state.contacts,
              [contact.id]: {
                contactId: contact.id,
                name: contact.name,
                title: contact.title,
                category: contact.category,
                trustLevel: 10,
                lastInteraction: null,
                tipsReceived: 0,
                benefits: contact.benefits ?? {},
              },
            },
          }
        }),

      interactWithContact: (contactId) =>
        set((state) => {
          const contact = state.contacts[contactId]
          if (!contact) return state
          return {
            contacts: {
              ...state.contacts,
              [contactId]: {
                ...contact,
                trustLevel: Math.min(100, contact.trustLevel + 5),
                lastInteraction: Date.now(),
              },
            },
          }
        }),

      addTip: (tip) =>
        set((state) => ({
          pendingTips: [
            ...state.pendingTips,
            { ...tip, id: `tip_${Date.now()}`, createdAt: Date.now() },
          ].slice(-20),
        })),

      dismissTip: (tipId) =>
        set((state) => ({
          pendingTips: state.pendingTips.filter((t) => t.id !== tipId),
        })),

      getNetworkPower: () => {
        const { contacts } = get()
        return Object.values(contacts).reduce(
          (sum, c) => sum + c.trustLevel,
          0,
        )
      },

      getContactCount: () => Object.keys(get().contacts).length,

      resetNetwork: () =>
        set({ contacts: {}, unlockedContacts: [], pendingTips: [] }),
    }),
    persistConfig,
  ),
)
