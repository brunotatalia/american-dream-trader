import { motion } from 'framer-motion'
import {
  Award,
  BadgeCheck,
  BookOpen,
  DollarSign,
  GraduationCap,
  Search,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import Tabs from '@/components/ui/Tabs'
import { EDUCATION_CATEGORIES } from '@/data/educationDatabase'
import { useEducation } from '@/hooks/useEducation'

import CourseCard from './CourseCard'
import SkillTree from './SkillTree'

const TABS = [
  { id: 'available', label: 'Available Courses' },
  { id: 'my-education', label: 'My Education' },
  { id: 'skill-tree', label: 'Skill Tree' },
]

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'short_course', label: 'Short Courses' },
  { id: 'trade_school', label: 'Trades' },
  { id: 'college', label: 'College' },
  { id: 'graduate', label: 'Graduate' },
  { id: 'professional_cert', label: 'Professional' },
]

export default function EducationHub() {
  const [activeTab, setActiveTab] = useState('available')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [enrollModalCourse, setEnrollModalCourse] = useState(null)

  const {
    availableCourses,
    completedCourses,
    completedEducation,
    currentCourse,
    currentEducation,
    studyProgress,
    totalBoosts,
    totalEducationSpent,
    skillTreePaths,
    cash,
    handleEnroll,
    canEnroll,
    canAfford,
    meetsPrerequisites,
    getPrerequisiteStatus,
    dropCourse,
  } = useEducation()

  const filteredCourses = useMemo(() => {
    let courses = availableCourses

    if (categoryFilter !== 'all') {
      courses = courses.filter((c) => c.category === categoryFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      courses = courses.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query),
      )
    }

    // Sort: available & affordable first, then by cost
    courses.sort((a, b) => {
      const aCanEnroll = canEnroll(a.id) && canAfford(a.id) && meetsPrerequisites(a.id)
      const bCanEnroll = canEnroll(b.id) && canAfford(b.id) && meetsPrerequisites(b.id)
      if (aCanEnroll && !bCanEnroll) return -1
      if (!aCanEnroll && bCanEnroll) return 1
      return a.cost - b.cost
    })

    return courses
  }, [availableCourses, categoryFilter, searchQuery, canEnroll, canAfford, meetsPrerequisites])

  const handleEnrollClick = (courseId) => {
    const course = availableCourses.find((c) => c.id === courseId)
    if (!course) return
    setEnrollModalCourse(course)
  }

  const confirmEnroll = () => {
    if (!enrollModalCourse) return
    handleEnroll(enrollModalCourse.id)
    setEnrollModalCourse(null)
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          Education & Training
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Invest in yourself. Unlock higher-paying careers and better investment knowledge.
        </p>
      </motion.div>

      {/* Stats overview */}
      <motion.div
        className="grid grid-cols-2 gap-3 md:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-primary/10">
              <GraduationCap className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Completed</p>
              <p className="font-display text-lg font-bold">{completedCourses.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-success/10">
              <DollarSign className="h-5 w-5 text-accent-success" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Invested</p>
              <p className="font-display text-lg font-bold">
                ${totalEducationSpent.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Skill Boosts</p>
              <p className="font-display text-lg font-bold">
                +{Object.values(totalBoosts.skillBoosts).reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <Award className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Jobs Unlocked</p>
              <p className="font-display text-lg font-bold">{totalBoosts.jobUnlocks.length}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currently enrolled banner */}
      {currentCourse && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="border-accent-primary/20 bg-accent-primary/5">
            <CardContent>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/20">
                    <BookOpen className="h-6 w-6 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary">Currently Studying</p>
                    <p className="font-display text-base font-semibold">{currentCourse.name}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-4 md:max-w-xs">
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between text-xs text-text-tertiary">
                      <span>Progress</span>
                      <span>{currentCourse.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-background-tertiary">
                      <motion.div
                        className="h-full rounded-full bg-accent-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentCourse.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {/* Search and filter */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/10 bg-background-tertiary pl-10 pr-4 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent-primary/50"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_FILTERS.map((cat) => (
                <Button
                  key={cat.id}
                  variant={categoryFilter === cat.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCategoryFilter(cat.id)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Course listing */}
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-text-tertiary" />
                <p className="mt-3 text-sm text-text-secondary">
                  No courses found matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isCompleted={false}
                  isCurrentlyEnrolled={currentEducation?.id === course.id}
                  progress={studyProgress[course.id] || 0}
                  canEnroll={canEnroll(course.id)}
                  canAfford={canAfford(course.id)}
                  meetsPrereqs={meetsPrerequisites(course.id)}
                  prerequisiteStatus={getPrerequisiteStatus(course.id)}
                  onEnroll={handleEnrollClick}
                  onDrop={dropCourse}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-education' && (
        <div className="space-y-6">
          {/* Current enrollment */}
          {currentCourse ? (
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Currently Enrolled
              </h3>
              <CourseCard
                course={currentCourse}
                isCompleted={false}
                isCurrentlyEnrolled={true}
                progress={currentCourse.progress}
                canEnroll={false}
                canAfford={true}
                meetsPrereqs={true}
                prerequisiteStatus={getPrerequisiteStatus(currentCourse.id)}
                onEnroll={() => {}}
                onDrop={dropCourse}
              />
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-text-tertiary" />
                <p className="mt-2 text-sm text-text-secondary">
                  You are not currently enrolled in any course.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab('available')}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Completed courses */}
          <div>
            <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
              Completed ({completedCourses.length})
            </h3>
            {completedCourses.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-text-secondary">
                    No completed courses yet. Start learning!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {completedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isCompleted={true}
                    isCurrentlyEnrolled={false}
                    progress={100}
                    canEnroll={false}
                    canAfford={true}
                    meetsPrereqs={true}
                    prerequisiteStatus={getPrerequisiteStatus(course.id)}
                    onEnroll={() => {}}
                    onDrop={() => {}}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Active boosts summary */}
          {Object.keys(totalBoosts.skillBoosts).length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Active Boosts
              </h3>
              <Card>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {Object.entries(totalBoosts.skillBoosts).map(([skill, amount]) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 rounded-lg bg-background-tertiary p-3"
                      >
                        <TrendingUp className="h-4 w-4 text-accent-primary" />
                        <div>
                          <p className="text-xs text-text-tertiary">
                            {skill.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                          </p>
                          <p className="font-display text-sm font-bold text-accent-primary">
                            +{amount}
                          </p>
                        </div>
                      </div>
                    ))}
                    {Object.entries(totalBoosts.investmentBoosts).map(([key, amount]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 rounded-lg bg-background-tertiary p-3"
                      >
                        <BadgeCheck className="h-4 w-4 text-accent-success" />
                        <div>
                          <p className="text-xs text-text-tertiary">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                          </p>
                          <p className="font-display text-sm font-bold text-accent-success">
                            +{amount}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {activeTab === 'skill-tree' && (
        <SkillTree
          skillTreePaths={skillTreePaths}
          completedEducation={completedEducation}
          currentEducation={currentEducation}
          onSelectCourse={(course) => {
            if (canEnroll(course.id) && canAfford(course.id) && meetsPrerequisites(course.id)) {
              handleEnrollClick(course.id)
            }
          }}
        />
      )}

      {/* Enrollment confirmation modal */}
      <Modal
        isOpen={!!enrollModalCourse}
        onClose={() => setEnrollModalCourse(null)}
        title="Confirm Enrollment"
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setEnrollModalCourse(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmEnroll}>
              Enroll - ${enrollModalCourse?.cost.toLocaleString()}
            </Button>
          </div>
        }
      >
        {enrollModalCourse && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold">{enrollModalCourse.name}</h3>
              <p className="mt-1 text-sm text-text-secondary">{enrollModalCourse.description}</p>
            </div>

            <div className="rounded-lg bg-background-tertiary p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-tertiary">Cost</p>
                  <p className="font-semibold">${enrollModalCourse.cost.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-tertiary">Duration</p>
                  <p className="font-semibold">{enrollModalCourse.durationDays} days</p>
                </div>
                <div>
                  <p className="text-text-tertiary">Your Cash</p>
                  <p className="font-semibold text-accent-success">${cash.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-tertiary">After Enrollment</p>
                  <p className="font-semibold">
                    ${(cash - enrollModalCourse.cost).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {Object.keys(enrollModalCourse.skillBoosts).length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Skill Boosts on Completion
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(enrollModalCourse.skillBoosts).map(([skill, amount]) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md bg-accent-primary/10 px-2.5 py-1 text-xs text-accent-primary"
                    >
                      <TrendingUp className="h-3 w-3" />
                      +{amount}{' '}
                      {skill.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {enrollModalCourse.jobUnlocks.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                  Jobs Unlocked
                </p>
                <div className="flex flex-wrap gap-2">
                  {enrollModalCourse.jobUnlocks.map((jobId) => (
                    <span
                      key={jobId}
                      className="inline-flex items-center rounded-md bg-background-tertiary px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {jobId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-text-tertiary">
              You can only be enrolled in one course at a time. Dropping a course will forfeit your
              tuition.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
