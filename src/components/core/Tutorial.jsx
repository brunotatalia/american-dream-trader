import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to American Dream Trader',
    content:
      'This is an economic simulation game where you build wealth through jobs, investments, real estate, and calculated risks. Your goal: achieve financial independence in historical America.',
  },
  {
    title: 'Time & Game Flow',
    content:
      'Time advances automatically based on your selected speed (Slow/Normal/Fast). Use the controls in the top bar to pause or adjust speed. Markets update daily, rent is collected monthly, and major events occur throughout the era.',
  },
  {
    title: 'Jobs & Income',
    content:
      'Visit the Jobs section to find work. Each job has a mini-game—complete it successfully to earn money. Higher difficulty jobs pay more but require better performance.',
  },
  {
    title: 'Trading & Investing',
    content:
      'Buy and sell stocks in the Trading section. Watch market prices fluctuate based on economic indicators and events. Sell for a profit or cut losses when needed.',
  },
  {
    title: 'Real Estate',
    content:
      'Purchase properties to generate passive rental income. Pay attention to down payment requirements, monthly rent, and appreciation rates. Properties require mortgages and maintenance.',
  },
  {
    title: 'Risk & Reward',
    content:
      'Visit the Casino for entertainment and quick cash opportunities—but remember the house always has an edge. Balance your portfolio between safe investments and calculated risks.',
  },
]

export default function Tutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete?.()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleSkip = () => {
    onComplete?.()
  }

  const step = TUTORIAL_STEPS[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl px-4">
        <Card className="border-accent-primary/30">
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <p className="mt-1 text-sm text-text-tertiary">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-relaxed text-text-secondary">{step.content}</p>

            <div className="flex items-center gap-4">
              <div className="flex flex-1 gap-1">
                {TUTORIAL_STEPS.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full ${
                      idx <= currentStep ? 'bg-accent-primary' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
              <Button variant="primary" onClick={handleNext}>
                {isLastStep ? 'Start Playing' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

