/**
 * Calculate wage multiplier based on job experience
 * Experience levels:
 * 0-100: Novice (1.0x)
 * 100-300: Experienced (1.1x)
 * 300-600: Professional (1.25x)
 * 600-1000: Expert (1.5x)
 * 1000+: Master (2.0x)
 */
export function calculateWageMultiplier(jobExperience = 0) {
  if (jobExperience < 100) return 1.0
  if (jobExperience < 300) return 1.1
  if (jobExperience < 600) return 1.25
  if (jobExperience < 1000) return 1.5
  return 2.0
}

/**
 * Get experience level title
 */
export function getExperienceLevel(jobExperience = 0) {
  if (jobExperience < 100) return { title: 'Novice', color: 'text-gray-400' }
  if (jobExperience < 300) return { title: 'Experienced', color: 'text-blue-400' }
  if (jobExperience < 600) return { title: 'Professional', color: 'text-purple-400' }
  if (jobExperience < 1000) return { title: 'Expert', color: 'text-yellow-400' }
  return { title: 'Master', color: 'text-orange-400' }
}

/**
 * Calculate actual wage for a job based on experience
 */
export function calculateActualWage(baseWage, jobExperience = 0, performanceMultiplier = 1.0) {
  const experienceMultiplier = calculateWageMultiplier(jobExperience)
  return Math.round(baseWage * experienceMultiplier * performanceMultiplier)
}

/**
 * Calculate experience gain from completing a job
 * Better performance = more experience
 */
export function calculateExperienceGain(baseGain = 10, performanceScore = 1.0) {
  return Math.round(baseGain * performanceScore)
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(jobExperience = 0) {
  const thresholds = [0, 100, 300, 600, 1000]
  const currentLevel = thresholds.findIndex((threshold, index) => {
    const nextThreshold = thresholds[index + 1]
    return jobExperience >= threshold && (nextThreshold === undefined || jobExperience < nextThreshold)
  })

  if (currentLevel === -1 || currentLevel === thresholds.length - 1) {
    return { current: jobExperience, max: jobExperience, percent: 100, nextLevel: 'Max Level' }
  }

  const currentThreshold = thresholds[currentLevel]
  const nextThreshold = thresholds[currentLevel + 1]
  const progress = jobExperience - currentThreshold
  const required = nextThreshold - currentThreshold
  const percent = Math.min(100, (progress / required) * 100)

  return {
    current: progress,
    max: required,
    percent: percent,
    nextLevel: getExperienceLevel(nextThreshold).title,
  }
}

