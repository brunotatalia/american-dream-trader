import { motion } from 'framer-motion'
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  Clock,
  DollarSign,
  GraduationCap,
  Lock,
  School,
  TrendingUp,
  Wrench,
  X,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { EDUCATION_CATEGORIES } from '@/data/educationDatabase'

const CATEGORY_ICONS = {
  high_school: School,
  trade_school: Wrench,
  college: GraduationCap,
  graduate: Award,
  professional_cert: BadgeCheck,
  short_course: BookOpen,
}

export default function CourseCard({
  course,
  isCompleted,
  isCurrentlyEnrolled,
  progress,
  canEnroll,
  canAfford,
  meetsPrereqs,
  prerequisiteStatus,
  onEnroll,
  onDrop,
}) {
  const categoryMeta = EDUCATION_CATEGORIES[course.category] || {}
  const CategoryIcon = CATEGORY_ICONS[course.category] || BookOpen

  const skillBoostEntries = Object.entries(course.skillBoosts)
  const investmentBoostEntries = Object.entries(course.investmentBoosts)
  const hasBoosts = skillBoostEntries.length > 0 || investmentBoostEntries.length > 0

  const formatBoostKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 ${
          isCompleted
            ? 'border-accent-success/30 bg-accent-success/5'
            : isCurrentlyEnrolled
              ? 'border-accent-primary/30 bg-accent-primary/5'
              : 'hover:border-white/10'
        }`}
      >
        {/* Category color bar */}
        <div
          className="absolute left-0 top-0 h-full w-1"
          style={{ backgroundColor: categoryMeta.color || '#6b7280' }}
        />

        <CardContent className="pl-8">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${categoryMeta.color}20`,
                    color: categoryMeta.color,
                  }}
                >
                  <CategoryIcon className="h-3 w-3" />
                  {categoryMeta.label}
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-success/20 px-2.5 py-0.5 text-xs font-medium text-accent-success">
                    <Check className="h-3 w-3" />
                    Completed
                  </span>
                )}
                {isCurrentlyEnrolled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-primary/20 px-2.5 py-0.5 text-xs font-medium text-accent-primary">
                    <BookOpen className="h-3 w-3" />
                    Enrolled
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {course.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {course.description}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <DollarSign className="h-4 w-4 text-accent-success" />
              <span>{course.cost === 0 ? 'Free' : `$${course.cost.toLocaleString()}`}</span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Clock className="h-4 w-4 text-accent-primary" />
              <span>
                {course.durationDays === 0
                  ? 'Instant'
                  : course.durationDays >= 365
                    ? `${Math.round(course.durationDays / 365 * 10) / 10} year${course.durationDays >= 730 ? 's' : ''}`
                    : `${course.durationDays} days`}
              </span>
            </div>
          </div>

          {/* Prerequisites */}
          {prerequisiteStatus && prerequisiteStatus.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Prerequisites
              </p>
              <div className="flex flex-wrap gap-2">
                {prerequisiteStatus.map((prereq) => (
                  <span
                    key={prereq.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                      prereq.completed
                        ? 'bg-accent-success/10 text-accent-success'
                        : 'bg-accent-danger/10 text-accent-danger'
                    }`}
                  >
                    {prereq.completed ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    {prereq.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Boosts */}
          {hasBoosts && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Benefits
              </p>
              <div className="flex flex-wrap gap-2">
                {skillBoostEntries.map(([skill, amount]) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-md bg-accent-primary/10 px-2 py-1 text-xs text-accent-primary"
                  >
                    <TrendingUp className="h-3 w-3" />
                    +{amount} {formatBoostKey(skill)}
                  </span>
                ))}
                {investmentBoostEntries.map(([key, amount]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 rounded-md bg-accent-success/10 px-2 py-1 text-xs text-accent-success"
                  >
                    <TrendingUp className="h-3 w-3" />
                    +{amount}% {formatBoostKey(key)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Unlocks */}
          {course.jobUnlocks.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Unlocks Jobs
              </p>
              <div className="flex flex-wrap gap-2">
                {course.jobUnlocks.map((jobId) => (
                  <span
                    key={jobId}
                    className="inline-flex items-center gap-1 rounded-md bg-background-tertiary px-2 py-1 text-xs text-text-secondary"
                  >
                    <Briefcase className="h-3 w-3" />
                    {jobId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Progress bar for enrolled course */}
          {isCurrentlyEnrolled && typeof progress === 'number' && (
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-text-tertiary">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
                <motion.div
                  className="h-full rounded-full bg-accent-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isCompleted && (
            <div className="mt-4 flex items-center gap-2">
              {isCurrentlyEnrolled ? (
                <Button variant="danger" size="sm" onClick={onDrop}>
                  Drop Course
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canEnroll || !canAfford || !meetsPrereqs}
                  onClick={() => onEnroll(course.id)}
                >
                  {!meetsPrereqs ? (
                    <>
                      <Lock className="mr-1.5 h-3.5 w-3.5" />
                      Prerequisites Required
                    </>
                  ) : !canAfford ? (
                    <>
                      <DollarSign className="mr-1.5 h-3.5 w-3.5" />
                      Insufficient Funds
                    </>
                  ) : !canEnroll ? (
                    'Unavailable'
                  ) : (
                    'Enroll Now'
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
