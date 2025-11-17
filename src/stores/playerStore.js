import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const persistConfig = {
  name: 'adt-player-store',
  partialize: (state) => ({
    profile: state.profile,
    cash: state.cash,
    savings: state.savings,
    activeJob: state.activeJob,
    jobExperience: state.jobExperience,
    skills: state.skills,
  }),
}

export const usePlayerStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Player One',
        title: 'Dreamer',
      },
      cash: 1000,
      savings: 0,
      incomePerDay: 0,
      expensesPerDay: 0,
      netWorthHistory: [],
      activeJob: null,
      jobExperience: {}, // Tracks experience per job ID
      skills: {
        trading: 0,
        jobPerformance: 0,
        realEstate: 0,
        gambling: 0,
      },
      setProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates },
      })),
      adjustCash: (amount, reason = 'adjustment') => set((state) => ({
        cash: Math.max(0, state.cash + amount),
        netWorthHistory: [
          ...state.netWorthHistory,
          {
            timestamp: Date.now(),
            cash: Math.max(0, state.cash + amount),
            reason,
          },
        ].slice(-120),
      })),
      setSavings: (amount) => set({ savings: Math.max(0, amount) }),
      setIncomePerDay: (amount) => set({ incomePerDay: Math.max(0, amount) }),
      setExpensesPerDay: (amount) => set({ expensesPerDay: Math.max(0, amount) }),
      setActiveJob: (jobId) => set({ activeJob: jobId }),
      addJobExperience: (jobId, amount) => set((state) => ({
        jobExperience: {
          ...state.jobExperience,
          [jobId]: (state.jobExperience[jobId] || 0) + amount,
        },
      })),
      addSkillExperience: (skillUpdates) => set((state) => {
        const newSkills = { ...state.skills }
        Object.entries(skillUpdates).forEach(([skill, amount]) => {
          newSkills[skill] = (newSkills[skill] || 0) + amount
        })
        return { skills: newSkills }
      }),
    }),
    persistConfig,
  ),
)
