import { useMemo } from 'react'

import educationDatabase, { EDUCATION_CATEGORIES, SKILL_TREE_PATHS } from '@/data/educationDatabase'
import { useEducationStore } from '@/stores/educationStore'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'

export function useEducation() {
  const completedEducation = useEducationStore((s) => s.completedEducation)
  const currentEducation = useEducationStore((s) => s.currentEducation)
  const studyProgress = useEducationStore((s) => s.studyProgress)
  const enrollInCourse = useEducationStore((s) => s.enrollInCourse)
  const progressStudy = useEducationStore((s) => s.progressStudy)
  const completeEducation = useEducationStore((s) => s.completeEducation)
  const canEnroll = useEducationStore((s) => s.canEnroll)
  const canAfford = useEducationStore((s) => s.canAfford)
  const getActiveBoosts = useEducationStore((s) => s.getActiveBoosts)
  const dropCourse = useEducationStore((s) => s.dropCourse)

  const cash = usePlayerStore((s) => s.cash)
  const adjustCash = usePlayerStore((s) => s.adjustCash)
  const daysPassed = useGameStore((s) => s.daysPassed)
  const currentEra = useGameStore((s) => s.currentEra)

  const allCourses = educationDatabase

  const availableCourses = useMemo(() => {
    return allCourses.filter((course) => {
      if (completedEducation.includes(course.id)) return false
      if (currentEducation?.id === course.id) return false
      if (currentEra && !course.eraAvailability.includes(currentEra)) return false
      return true
    })
  }, [allCourses, completedEducation, currentEducation, currentEra])

  const completedCourses = useMemo(() => {
    return allCourses.filter((course) => completedEducation.includes(course.id))
  }, [allCourses, completedEducation])

  const currentCourse = useMemo(() => {
    if (!currentEducation) return null
    const course = allCourses.find((c) => c.id === currentEducation.id)
    if (!course) return null
    return {
      ...course,
      startDay: currentEducation.startDay,
      endDay: currentEducation.endDay,
      progress: studyProgress[currentEducation.id] || 0,
    }
  }, [currentEducation, allCourses, studyProgress])

  const totalBoosts = useMemo(() => getActiveBoosts(), [completedEducation, getActiveBoosts])

  const totalEducationSpent = useMemo(() => {
    return completedCourses.reduce((total, course) => total + course.cost, 0)
  }, [completedCourses])

  const handleEnroll = (educationId) => {
    const course = allCourses.find((c) => c.id === educationId)
    if (!course) return false
    if (!canAfford(educationId, cash)) return false
    if (!canEnroll(educationId)) return false

    adjustCash(-course.cost, `Enrolled in ${course.name}`)
    return enrollInCourse(educationId, daysPassed)
  }

  const meetsPrerequisites = (educationId) => {
    const course = allCourses.find((c) => c.id === educationId)
    if (!course) return false
    if (course.prerequisites.length === 0) return true
    return course.prerequisites.some((prereqId) => completedEducation.includes(prereqId))
  }

  const getPrerequisiteStatus = (educationId) => {
    const course = allCourses.find((c) => c.id === educationId)
    if (!course) return []
    return course.prerequisites.map((prereqId) => {
      const prereqCourse = allCourses.find((c) => c.id === prereqId)
      return {
        id: prereqId,
        name: prereqCourse?.name || prereqId,
        completed: completedEducation.includes(prereqId),
      }
    })
  }

  return {
    allCourses,
    availableCourses,
    completedCourses,
    completedEducation,
    currentCourse,
    currentEducation,
    studyProgress,
    totalBoosts,
    totalEducationSpent,
    categories: EDUCATION_CATEGORIES,
    skillTreePaths: SKILL_TREE_PATHS,
    cash,
    daysPassed,
    handleEnroll,
    progressStudy,
    completeEducation,
    canEnroll,
    canAfford: (id) => canAfford(id, cash),
    meetsPrerequisites,
    getPrerequisiteStatus,
    dropCourse,
  }
}
