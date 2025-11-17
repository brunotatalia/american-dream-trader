import { useState } from 'react'
import { Trophy, Lock } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import achievementsDatabase, { achievementCategories } from '@/data/achievementsDatabase'
import { useAchievementStore } from '@/stores/achievementStore'
import { formatCurrency } from '@/utils/formatters'
import { getAchievementProgress } from '@/utils/achievementChecker'

export default function AchievementsHub() {
  const unlockedAchievements = useAchievementStore((state) => state.unlockedAchievements)
  const stats = useAchievementStore((state) => state.stats)
  const totalPoints = useAchievementStore((state) => state.totalPoints)
  const [activeCategory, setActiveCategory] = useState('all')

  const unlockedCount = Object.keys(unlockedAchievements).length
  const totalAchievements = achievementsDatabase.length
  const completionPercent = (unlockedCount / totalAchievements) * 100

  // Filter achievements by category
  const filteredAchievements = activeCategory === 'all'
    ? achievementsDatabase
    : achievementsDatabase.filter((a) => a.category === activeCategory)

  // Sort: unlocked first, then by points
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    const aUnlocked = !!unlockedAchievements[a.id]
    const bUnlocked = !!unlockedAchievements[b.id]
    if (aUnlocked && !bUnlocked) return -1
    if (!aUnlocked && bUnlocked) return 1
    return b.points - a.points
  })

  // Create tabs
  const tabs = [
    { id: 'all', label: 'All' },
    ...Object.entries(achievementCategories).map(([id, cat]) => ({
      id,
      label: `${cat.icon} ${cat.name}`,
    })),
  ]

  return (
    <div className="grid gap-6">
      {/* Overview Card */}
      <Card className="border-accent-primary/20 bg-gradient-to-r from-accent-primary/10 to-transparent">
        <CardContent className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/20">
              <Trophy className="h-8 w-8 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider text-text-tertiary">Achievement Progress</p>
              <p className="font-display text-3xl font-semibold text-accent-primary">
                {unlockedCount}/{totalAchievements}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {totalPoints} points earned • {completionPercent.toFixed(1)}% complete
              </p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-xs text-text-tertiary">Completion</p>
              <div className="mt-2 h-3 w-48 overflow-hidden rounded-full bg-background-elevated">
                <div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-success transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs tabs={tabs} activeTab={activeCategory} onChange={setActiveCategory} />

          <div className="mt-6 grid gap-3">
            {sortedAchievements.map((achievement) => {
              const isUnlocked = !!unlockedAchievements[achievement.id]
              const progress = getAchievementProgress(achievement, stats)
              const category = achievementCategories[achievement.category]

              return (
                <div
                  key={achievement.id}
                  className={`group relative overflow-hidden rounded-lg border p-4 transition-all ${
                    isUnlocked
                      ? 'border-accent-success/30 bg-accent-success/5 hover:border-accent-success/50'
                      : 'border-white/10 bg-background-tertiary/40 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-3xl ${
                        isUnlocked
                          ? 'bg-accent-success/20'
                          : 'bg-background-elevated'
                      }`}
                    >
                      {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-text-tertiary" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-text-primary">
                              {achievement.title}
                            </h3>
                            {isUnlocked && (
                              <span className="rounded bg-accent-success px-2 py-0.5 text-xs font-semibold text-white">
                                Unlocked
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-text-secondary">
                            {achievement.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className={category.color}>
                              {category.icon} {category.name}
                            </span>
                            <span className="text-text-tertiary">
                              {achievement.points} points
                            </span>
                            {achievement.reward && (
                              <span className="text-accent-info">
                                🎁 Title: {achievement.reward.value}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar (if not unlocked) */}
                      {!isUnlocked && progress.max > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-text-tertiary">
                            <span>
                              Progress: {formatValue(progress.current, achievement.requirement.type)} / {formatValue(progress.max, achievement.requirement.type)}
                            </span>
                            <span>{progress.percent.toFixed(0)}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background-elevated">
                            <div
                              className="h-full bg-gradient-to-r from-accent-primary to-accent-info transition-all duration-300"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Unlocked timestamp */}
                      {isUnlocked && unlockedAchievements[achievement.id]?.unlockedAt && (
                        <p className="mt-2 text-xs text-text-tertiary">
                          Unlocked {new Date(unlockedAchievements[achievement.id].unlockedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper to format values based on type
function formatValue(value, type) {
  if (type.includes('cash') || type.includes('netWorth') || type.includes('savings') || 
      type.includes('Profit') || type.includes('Winnings') || type.includes('rent') || 
      type.includes('Win') || type.includes('Earned')) {
    return formatCurrency(value)
  }
  return value
}

