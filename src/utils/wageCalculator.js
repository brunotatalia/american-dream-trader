/**
 * Calculate adjusted wage based on base pay, experience, and era progression
 */
export function calculateAdjustedWage(basePay, jobExperience = 0, yearsIntoEra = 0) {
  // Experience bonus: +1% per 10 experience points, up to +50%
  const experienceBonus = Math.min(jobExperience / 10, 50) / 100
  
  // Era progression bonus: wages increase ~3% per year due to inflation/growth
  const inflationBonus = yearsIntoEra * 0.03
  
  // Combined multiplier
  const totalMultiplier = 1 + experienceBonus + inflationBonus
  
  return Math.floor(basePay * totalMultiplier)
}

/**
 * Get wage multiplier information for display
 */
export function getWageMultiplierInfo(jobExperience = 0, yearsIntoEra = 0) {
  const experienceBonus = Math.min(jobExperience / 10, 50)
  const inflationBonus = yearsIntoEra * 3
  const totalBonus = experienceBonus + inflationBonus
  
  return {
    experienceBonus,
    inflationBonus,
    totalBonus,
    isMaxExperience: jobExperience >= 500,
  }
}

