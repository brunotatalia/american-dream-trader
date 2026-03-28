import { motion, useInView } from 'framer-motion'
import {
  Briefcase,
  TrendingUp,
  Home,
  DollarSign,
  GraduationCap,
  Sparkles,
  Trophy,
  Target,
  Crown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useRef } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useEducationStore } from '@/stores/educationStore'
import { useGameStore } from '@/stores/gameStore'
import { usePlayerStore } from '@/stores/playerStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { useRealEstateStore } from '@/stores/realEstateStore'
function getAllMilestones({ netWorth, portfolio, ownedProperties, completedEducation, activeJob, daysPassed }) {
  const milestones = [
    {
      id: 'first-job',
      icon: Briefcase,
      label: 'First Job',
      description: 'Secured your first employment',
      achieved: !!activeJob,
      order: 1,
    },
    {
      id: 'first-investment',
      icon: TrendingUp,
      label: 'First Investment',
      description: 'Made your first trade on the market',
      achieved: Object.keys(portfolio).length > 0,
      order: 2,
    },
    {
      id: 'first-property',
      icon: Home,
      label: 'First Property',
      description: 'Purchased your first real estate',
      achieved: Object.keys(ownedProperties).length > 0,
      order: 3,
    },
    {
      id: 'net-worth-1k',
      icon: DollarSign,
      label: '$1,000 Net Worth',
      description: 'Crossed the thousand dollar mark',
      achieved: netWorth >= 1000,
      order: 4,
    },
    {
      id: 'net-worth-10k',
      icon: DollarSign,
      label: '$10,000 Net Worth',
      description: 'Five figures of wealth accumulated',
      achieved: netWorth >= 10000,
      order: 5,
    },
    {
      id: 'net-worth-100k',
      icon: Target,
      label: '$100,000 Net Worth',
      description: 'Six figures - a major milestone',
      achieved: netWorth >= 100000,
      order: 6,
    },
    {
      id: 'net-worth-1m',
      icon: Crown,
      label: '$1,000,000 Net Worth',
      description: 'Congratulations, you are a millionaire!',
      achieved: netWorth >= 1000000,
      order: 7,
    },
    {
      id: 'education-community',
      icon: GraduationCap,
      label: 'College Graduate',
      description: 'Completed community college education',
      achieved: completedEducation.some((e) =>
        ['COMMUNITY_COLLEGE_FINANCE', 'COMMUNITY_COLLEGE_BUSINESS'].includes(e)
      ),
      order: 8,
    },
    {
      id: 'education-bachelors',
      icon: GraduationCap,
      label: "Bachelor's Degree",
      description: "Earned a bachelor's degree",
      achieved: completedEducation.some((e) =>
        ['BACHELORS_ECONOMICS', 'BACHELORS_BUSINESS'].includes(e)
      ),
      order: 9,
    },
    {
      id: 'education-masters',
      icon: GraduationCap,
      label: 'Advanced Degree',
      description: 'Achieved an MBA, CFA, or PhD',
      achieved: completedEducation.some((e) =>
        ['MBA', 'CFA_CERTIFICATION', 'PHD_ECONOMICS'].includes(e)
      ),
      order: 10,
    },
    {
      id: 'survived-year',
      icon: Trophy,
      label: 'First Year',
      description: 'Survived your first full year',
      achieved: daysPassed >= 365,
      order: 11,
    },
    {
      id: 'financial-freedom',
      icon: Sparkles,
      label: 'Financial Freedom',
      description: 'Passive income covers all expenses',
      achieved: false, // placeholder - would need passive income tracking
      order: 12,
    },
  ]

  return milestones.sort((a, b) => {
    if (a.achieved && !b.achieved) return -1
    if (!a.achieved && b.achieved) return 1
    return a.order - b.order
  })
}

function MilestoneNode({ milestone, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })
  const Icon = milestone.icon

  return (
    <motion.div
      ref={ref}
      className="flex shrink-0 flex-col items-center"
      style={{ width: 160 }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Icon bubble */}
      <motion.div
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
          milestone.achieved
            ? 'border-accent-primary bg-accent-primary/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
            : 'border-white/10 bg-background-tertiary/40'
        }`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Icon
          size={22}
          className={milestone.achieved ? 'text-accent-primary' : 'text-text-tertiary/40'}
        />
        {milestone.achieved && (
          <motion.div
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-success text-[10px] text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, delay: index * 0.08 + 0.3 }}
          >
            ✓
          </motion.div>
        )}
      </motion.div>

      {/* Label */}
      <p
        className={`mt-3 text-center text-xs font-semibold ${
          milestone.achieved ? 'text-text-primary' : 'text-text-tertiary/50'
        }`}
      >
        {milestone.label}
      </p>

      {/* Description */}
      <p
        className={`mt-1 text-center text-[10px] leading-tight ${
          milestone.achieved ? 'text-text-secondary' : 'text-text-tertiary/30'
        }`}
      >
        {milestone.description}
      </p>
    </motion.div>
  )
}

export default function MilestonesTimeline({ netWorth = 0 }) {
  const scrollRef = useRef(null)
  const activeJob = usePlayerStore((s) => s.activeJob)
  const daysPassed = useGameStore((s) => s.daysPassed)
  const portfolio = usePortfolioStore((s) => s.positions)
  const ownedProperties = useRealEstateStore((s) => s.ownedProperties)
  const completedEducation = useEducationStore((s) => s.completedEducation) || []

  const milestones = getAllMilestones({
    netWorth,
    portfolio,
    ownedProperties,
    completedEducation,
    activeJob,
    daysPassed,
  })

  const achievedCount = milestones.filter((m) => m.achieved).length

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction * 300,
        behavior: 'smooth',
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy size={18} className="text-accent-primary" />
              Life Milestones
            </CardTitle>
            <p className="mt-1 text-sm text-text-tertiary">
              {achievedCount} of {milestones.length} achieved
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              className="rounded-lg border border-white/10 bg-background-tertiary/40 p-2 text-text-secondary transition-colors hover:bg-background-tertiary hover:text-text-primary"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="rounded-lg border border-white/10 bg-background-tertiary/40 p-2 text-text-secondary transition-colors hover:bg-background-tertiary hover:text-text-primary"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-1.5 overflow-hidden rounded-full bg-background-primary/60">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-primary to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(achievedCount / milestones.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Scrollable timeline */}
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-background-tertiary"
              style={{ scrollbarWidth: 'thin' }}
            >
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start">
                  <MilestoneNode milestone={milestone} index={index} />
                  {index < milestones.length - 1 && (
                    <div className="mt-7 flex items-center px-1">
                      <div
                        className={`h-0.5 w-8 ${
                          milestone.achieved && milestones[index + 1]?.achieved
                            ? 'bg-accent-primary/60'
                            : 'bg-white/5'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
