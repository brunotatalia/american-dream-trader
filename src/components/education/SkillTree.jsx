import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  Building,
  Check,
  Hammer,
  Heart,
  Lock,
  Monitor,
  TrendingUp,
} from 'lucide-react'
import { useCallback, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import educationDatabase from '@/data/educationDatabase'

const PATH_ICONS = {
  finance: TrendingUp,
  technology: Monitor,
  trades: Hammer,
  medicine: Heart,
  business: Briefcase,
  real_estate: Building,
}

function SkillNode({ course, status, color, onClick }) {
  const isCompleted = status === 'completed'
  const isAvailable = status === 'available'
  const isLocked = status === 'locked'
  const isEnrolled = status === 'enrolled'

  return (
    <motion.button
      onClick={() => onClick(course)}
      className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all ${
        isCompleted
          ? 'border-accent-success bg-accent-success/20 text-accent-success shadow-lg shadow-accent-success/20'
          : isEnrolled
            ? 'border-accent-primary bg-accent-primary/20 text-accent-primary shadow-lg shadow-accent-primary/20'
            : isAvailable
              ? 'border-white/20 bg-background-elevated text-text-primary hover:border-white/40 hover:bg-background-tertiary'
              : 'border-white/5 bg-background-tertiary/40 text-text-tertiary'
      }`}
      whileHover={isAvailable ? { scale: 1.1 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      title={course.name}
    >
      {isCompleted ? (
        <Check className="h-5 w-5" />
      ) : isLocked ? (
        <Lock className="h-4 w-4" />
      ) : isEnrolled ? (
        <motion.div
          className="h-3 w-3 rounded-full bg-accent-primary"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      ) : (
        <span className="text-center text-[9px] leading-tight">
          {course.name.split(' ').slice(0, 2).join(' ')}
        </span>
      )}

      {/* Glow effect for completed */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: `0 0 12px ${color}40` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}

      {/* Pulse effect for available */}
      {isAvailable && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-white/20"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        />
      )}
    </motion.button>
  )
}

function ConnectionLine({ color, isCompleted }) {
  return (
    <div className="flex items-center">
      <div
        className={`h-0.5 w-6 flex-shrink-0 ${isCompleted ? '' : 'opacity-30'}`}
        style={{ backgroundColor: isCompleted ? color : '#4b5563' }}
      />
      <div
        className={`h-0 w-0 flex-shrink-0 border-y-[4px] border-l-[6px] border-y-transparent ${
          isCompleted ? '' : 'opacity-30'
        }`}
        style={{ borderLeftColor: isCompleted ? color : '#4b5563' }}
      />
    </div>
  )
}

export default function SkillTree({
  skillTreePaths,
  completedEducation,
  currentEducation,
  onSelectCourse,
}) {
  const [selectedNode, setSelectedNode] = useState(null)

  const getNodeStatus = useCallback(
    (courseId) => {
      if (completedEducation.includes(courseId)) return 'completed'
      if (currentEducation?.id === courseId) return 'enrolled'

      const course = educationDatabase.find((c) => c.id === courseId)
      if (!course) return 'locked'

      if (course.prerequisites.length === 0) return 'available'
      const hasPrereq = course.prerequisites.some((pid) => completedEducation.includes(pid))
      return hasPrereq ? 'available' : 'locked'
    },
    [completedEducation, currentEducation],
  )

  const handleNodeClick = (course) => {
    setSelectedNode(course)
    onSelectCourse?.(course)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-display text-lg font-semibold text-text-primary">
          Career Skill Tree
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          Follow progression paths from basics to mastery
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border-2 border-accent-success bg-accent-success/20" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border-2 border-accent-primary bg-accent-primary/20" />
            Enrolled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border-2 border-white/20 bg-background-elevated" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded border-2 border-white/5 bg-background-tertiary/40" />
            Locked
          </span>
        </div>
      </div>

      {Object.entries(skillTreePaths).map(([pathId, path]) => {
        const PathIcon = PATH_ICONS[pathId] || TrendingUp
        const completedCount = path.nodes.filter((id) =>
          completedEducation.includes(id),
        ).length

        return (
          <Card key={pathId}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${path.color}20` }}
                  >
                    <PathIcon className="h-4 w-4" style={{ color: path.color }} />
                  </div>
                  <CardTitle className="text-base">{path.label}</CardTitle>
                </div>
                <span className="text-xs text-text-tertiary">
                  {completedCount}/{path.nodes.length} completed
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-tertiary">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: path.color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${path.nodes.length > 0 ? (completedCount / path.nodes.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-0 overflow-x-auto pb-2">
                {path.nodes.map((nodeId, index) => {
                  const course = educationDatabase.find((c) => c.id === nodeId)
                  if (!course) return null

                  const status = getNodeStatus(nodeId)
                  const prevCompleted =
                    index === 0 || completedEducation.includes(path.nodes[index - 1])

                  return (
                    <div key={nodeId} className="flex items-center">
                      {index > 0 && (
                        <ConnectionLine
                          color={path.color}
                          isCompleted={prevCompleted && status === 'completed'}
                        />
                      )}
                      <SkillNode
                        course={course}
                        status={status}
                        color={path.color}
                        onClick={handleNodeClick}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Selected node detail popover */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-lg md:bottom-8"
          >
            <Card className="border-white/10 shadow-2xl">
              <CardContent>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-base font-semibold text-text-primary">
                      {selectedNode.name}
                    </h4>
                    <p className="mt-1 text-xs text-text-secondary">{selectedNode.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-tertiary">
                      <span>${selectedNode.cost.toLocaleString()}</span>
                      <span>-</span>
                      <span>{selectedNode.durationDays} days</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="flex-shrink-0 rounded-lg p-1 text-text-tertiary hover:bg-background-tertiary hover:text-text-primary"
                  >
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
