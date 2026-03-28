import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import { useEra } from '@/hooks/useEra'
import { useJobs } from '@/hooks/useJobs'
import { useNotifications } from '@/hooks/useNotifications'
import { usePlayerStore } from '@/stores/playerStore'
import { formatCurrency } from '@/utils/formatters'
import { calculateActualWage, calculateExperienceGain, getExperienceLevel, getProgressToNextLevel } from '@/utils/jobProgression'

import AssemblyLineGame from './mini-games/AssemblyLineGame'
import CalculatorGame from './mini-games/CalculatorGame'
import ConstructionGame from './mini-games/ConstructionGame'
import DataEntryGame from './mini-games/DataEntryGame'
import DeliveryGame from './mini-games/DeliveryGame'
import NegotiationGame from './mini-games/NegotiationGame'
import RhythmGame from './mini-games/RhythmGame'
import TypingGame from './mini-games/TypingGame'
import WordScrambleGame from './mini-games/WordScrambleGame'

const MINI_GAME_COMPONENTS = {
  assemblyLine: AssemblyLineGame,
  typing: TypingGame,
  calculator: CalculatorGame,
  delivery: DeliveryGame,
  construction: ConstructionGame,
  math_quiz: CalculatorGame,
  delivery_route: DeliveryGame,
  cargo_load: ConstructionGame,
  word_scramble: WordScrambleGame,
  data_entry: DataEntryGame,
  rhythm_game: RhythmGame,
  negotiation: NegotiationGame,
}

export default function JobsHub() {
  const { jobs, activeJob, selectJob } = useJobs()
  const { eraData } = useEra()
  const { notify } = useNotifications()
  const adjustCash = usePlayerStore((state) => state.adjustCash)
  const addJobExperience = usePlayerStore((state) => state.addJobExperience)
  const addSkillExperience = usePlayerStore((state) => state.addSkillExperience)
  const jobExperience = usePlayerStore((state) => state.jobExperience)

  const [isPlaying, setIsPlaying] = useState(false)

  // Filter jobs available in current era
  const availableJobs = eraData
    ? jobs.filter((job) => job.eraAvailability && job.eraAvailability.includes(eraData.id))
    : jobs

  const tabs = availableJobs.map((job) => ({ id: job.id, label: job.title }))

  const handleJobComplete = (result) => {
    if (result.success && activeJob) {
      // Calculate performance multiplier from mini-game result
      const performanceMultiplier = result.accuracy || result.score / Math.max(result.score + (result.mistakes || 0), 1) || 1
      
      // Calculate actual wage with experience bonus
      const currentJobXP = jobExperience[activeJob.id] || 0
      const actualWage = calculateActualWage(activeJob.payPerSession, currentJobXP, performanceMultiplier)
      
      // Award money
      adjustCash(actualWage, `job_${activeJob.id}`)
      
      // Calculate and add experience
      const experienceGained = calculateExperienceGain(15, performanceMultiplier)
      addJobExperience(activeJob.id, experienceGained)
      
      // Add skill experience if job provides it
      if (activeJob.experienceGain) {
        addSkillExperience(activeJob.experienceGain)
      }
      
      // Get experience level info
      const newJobXP = currentJobXP + experienceGained
      const levelInfo = getExperienceLevel(newJobXP)
      
      notify({
        title: 'Shift Complete!',
        description: `You earned ${formatCurrency(actualWage)} and gained ${experienceGained} XP! (${levelInfo.title})`,
        variant: 'success',
      })
    }
    setIsPlaying(false)
  }

  const MiniGameComponent = activeJob ? MINI_GAME_COMPONENTS[activeJob.miniGame] : null

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Career Opportunities</CardTitle>
            <p className="text-sm text-text-tertiary">Choose a profession and complete mini-games to earn income.</p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs tabs={tabs} activeTab={activeJob?.id ?? tabs[0]?.id} onChange={selectJob} />
          <div className="mt-6 rounded-lg border border-white/5 bg-background-tertiary/50 p-4 text-sm text-text-secondary">
            {activeJob ? (
              <>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">{activeJob.title}</p>
                    <p className="mt-1 text-text-tertiary">{activeJob.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-text-tertiary">Category</p>
                    <p className="font-semibold capitalize text-text-primary">{activeJob.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Difficulty</p>
                    <p className="font-semibold capitalize text-text-primary">{activeJob.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Base Pay</p>
                    <p className="font-semibold text-text-primary">{formatCurrency(activeJob.payPerSession)}</p>
                  </div>
                  <div>
                    <p className="text-text-tertiary">Your Level</p>
                    <p className={`font-semibold ${getExperienceLevel(jobExperience[activeJob.id] || 0).color}`}>
                      {getExperienceLevel(jobExperience[activeJob.id] || 0).title}
                    </p>
                  </div>
                </div>
                {/* Experience Progress Bar */}
                {(() => {
                  const currentJobXP = jobExperience[activeJob.id] || 0
                  const progress = getProgressToNextLevel(currentJobXP)
                  const actualWage = calculateActualWage(activeJob.payPerSession, currentJobXP)
                  
                  return (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-tertiary">Experience: {currentJobXP} XP</span>
                        <span className="text-text-tertiary">Next: {progress.nextLevel}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary">
                        <div 
                          className="h-full bg-gradient-to-r from-accent-primary to-accent-success transition-all duration-300"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-accent-primary font-semibold">Current Wage: {formatCurrency(actualWage)}</span>
                        {actualWage > activeJob.payPerSession && (
                          <span className="text-accent-success">+{Math.round((actualWage / activeJob.payPerSession - 1) * 100)}% bonus!</span>
                        )}
                      </div>
                    </div>
                  )
                })()}
                {!isPlaying && MiniGameComponent && (
                  <Button className="mt-4 w-full" variant="primary" onClick={() => setIsPlaying(true)}>
                    Start Work
                  </Button>
                )}
              </>
            ) : (
              <p>Select a job to view its details and start working.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {isPlaying && MiniGameComponent && (
        <MiniGameComponent onComplete={handleJobComplete} basePay={activeJob?.payPerSession ?? 25} />
      )}
    </div>
  )
}

