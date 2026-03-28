import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import educationDatabase from '@/data/educationDatabase'

const persistConfig = {
  name: 'adt-education-store',
  partialize: (state) => ({
    completedEducation: state.completedEducation,
    currentEducation: state.currentEducation,
    studyProgress: state.studyProgress,
  }),
}

export const useEducationStore = create(
  persist(
    (set, get) => ({
      completedEducation: ['HIGH_SCHOOL_DIPLOMA'],
      currentEducation: null,
      studyProgress: {},

      enrollInCourse: (educationId, currentDay) => {
        const course = educationDatabase.find((c) => c.id === educationId)
        if (!course) return false

        const { canEnroll } = get()
        if (!canEnroll(educationId)) return false

        set({
          currentEducation: {
            id: educationId,
            startDay: currentDay,
            endDay: currentDay + course.durationDays,
          },
          studyProgress: {
            ...get().studyProgress,
            [educationId]: 0,
          },
        })

        return true
      },

      progressStudy: (currentDay) => {
        const { currentEducation, studyProgress } = get()
        if (!currentEducation) return null

        const course = educationDatabase.find((c) => c.id === currentEducation.id)
        if (!course) return null

        const totalDays = course.durationDays
        if (totalDays === 0) {
          // Instant completion (e.g., High School Diploma)
          get().completeEducation(currentEducation.id)
          return currentEducation.id
        }

        const elapsed = currentDay - currentEducation.startDay
        const progress = Math.min(100, Math.round((elapsed / totalDays) * 100))

        set({
          studyProgress: {
            ...studyProgress,
            [currentEducation.id]: progress,
          },
        })

        if (currentDay >= currentEducation.endDay) {
          const completedId = currentEducation.id
          get().completeEducation(completedId)
          return completedId
        }

        return null
      },

      completeEducation: (educationId) => {
        const { completedEducation, studyProgress } = get()
        if (completedEducation.includes(educationId)) return

        set({
          completedEducation: [...completedEducation, educationId],
          currentEducation: null,
          studyProgress: {
            ...studyProgress,
            [educationId]: 100,
          },
        })
      },

      canEnroll: (educationId) => {
        const { completedEducation, currentEducation } = get()

        // Cannot enroll if already studying
        if (currentEducation) return false

        // Cannot enroll if already completed
        if (completedEducation.includes(educationId)) return false

        const course = educationDatabase.find((c) => c.id === educationId)
        if (!course) return false

        // Check prerequisites - need at least one prereq met (OR logic for alternatives)
        if (course.prerequisites.length > 0) {
          const hasPrereq = course.prerequisites.some((prereqId) =>
            completedEducation.includes(prereqId),
          )
          if (!hasPrereq) return false
        }

        return true
      },

      canAfford: (educationId, playerCash) => {
        const course = educationDatabase.find((c) => c.id === educationId)
        if (!course) return false
        return playerCash >= course.cost
      },

      getActiveBoosts: () => {
        const { completedEducation } = get()
        const boosts = {
          skillBoosts: {},
          investmentBoosts: {},
          jobUnlocks: [],
        }

        completedEducation.forEach((eduId) => {
          const course = educationDatabase.find((c) => c.id === eduId)
          if (!course) return

          // Aggregate skill boosts
          Object.entries(course.skillBoosts).forEach(([skill, amount]) => {
            boosts.skillBoosts[skill] = (boosts.skillBoosts[skill] || 0) + amount
          })

          // Aggregate investment boosts
          Object.entries(course.investmentBoosts).forEach(([key, amount]) => {
            boosts.investmentBoosts[key] = (boosts.investmentBoosts[key] || 0) + amount
          })

          // Aggregate job unlocks
          course.jobUnlocks.forEach((jobId) => {
            if (!boosts.jobUnlocks.includes(jobId)) {
              boosts.jobUnlocks.push(jobId)
            }
          })
        })

        return boosts
      },

      dropCourse: () => {
        const { currentEducation, studyProgress } = get()
        if (!currentEducation) return

        const newProgress = { ...studyProgress }
        delete newProgress[currentEducation.id]

        set({
          currentEducation: null,
          studyProgress: newProgress,
        })
      },

      resetEducation: () =>
        set({
          completedEducation: ['HIGH_SCHOOL_DIPLOMA'],
          currentEducation: null,
          studyProgress: {},
        }),
    }),
    persistConfig,
  ),
)
