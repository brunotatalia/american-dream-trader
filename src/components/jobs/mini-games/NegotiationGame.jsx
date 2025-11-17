import { useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Scenarios for speakeasy host
const SCENARIOS = [
  {
    id: 1,
    character: 'Police Officer',
    situation: 'A cop is at the door asking questions about "unusual activity"',
    options: [
      { text: 'Offer a small bribe ($50)', cost: 50, success: 0.7, points: 100 },
      { text: 'Claim it\'s a private social club', cost: 0, success: 0.5, points: 150 },
      { text: 'Invite him in for a "drink" (free)', cost: 0, success: 0.8, points: 120 },
      { text: 'Offer a large bribe ($200)', cost: 200, success: 0.95, points: 50 },
    ],
  },
  {
    id: 2,
    character: 'Angry Customer',
    situation: 'A patron is causing a scene, demanding a refund for watered-down whiskey',
    options: [
      { text: 'Full refund and apology', cost: 30, success: 0.9, points: 80 },
      { text: 'Offer a free drink next time', cost: 10, success: 0.7, points: 120 },
      { text: 'Have security escort them out', cost: 0, success: 0.6, points: 60 },
      { text: 'Give them premium bottle', cost: 50, success: 0.95, points: 100 },
    ],
  },
  {
    id: 3,
    character: 'Rival Gang Member',
    situation: 'A member of a rival gang wants "protection money" to avoid trouble',
    options: [
      { text: 'Pay the protection ($100)', cost: 100, success: 0.85, points: 60 },
      { text: 'Call their bluff', cost: 0, success: 0.4, points: 200 },
      { text: 'Negotiate down to $50', cost: 50, success: 0.7, points: 140 },
      { text: 'Offer alliance instead', cost: 0, success: 0.6, points: 180 },
    ],
  },
  {
    id: 4,
    character: 'VIP Guest',
    situation: 'A wealthy patron wants a reserved table, but it\'s already booked',
    options: [
      { text: 'Give them the table anyway', cost: 0, success: 0.7, points: 100 },
      { text: 'Offer a better table with free drinks', cost: 40, success: 0.9, points: 150 },
      { text: 'Politely decline', cost: 0, success: 0.3, points: 50 },
      { text: 'Promise to get them in next time', cost: 0, success: 0.6, points: 120 },
    ],
  },
  {
    id: 5,
    character: 'Bootlegger',
    situation: 'Your supplier wants to raise prices, claiming increased risk',
    options: [
      { text: 'Accept the new prices', cost: 80, success: 0.95, points: 70 },
      { text: 'Negotiate to split the increase', cost: 40, success: 0.8, points: 130 },
      { text: 'Threaten to find new supplier', cost: 0, success: 0.5, points: 180 },
      { text: 'Offer to buy in bulk for discount', cost: 60, success: 0.75, points: 160 },
    ],
  },
  {
    id: 6,
    character: 'Suspicious Neighbor',
    situation: 'A neighbor is complaining about the noise and late-night traffic',
    options: [
      { text: 'Offer them cash to stay quiet ($70)', cost: 70, success: 0.85, points: 90 },
      { text: 'Promise to keep it down', cost: 0, success: 0.6, points: 110 },
      { text: 'Give them VIP access', cost: 0, success: 0.75, points: 140 },
      { text: 'Claim it\'s a legitimate business', cost: 0, success: 0.4, points: 150 },
    ],
  },
]

export default function NegotiationGame({ onComplete, basePay = 34 }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [cashSpent, setCashSpent] = useState(0)
  const [successfulDeals, setSuccessfulDeals] = useState(0)
  const [failedDeals, setFailedDeals] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  const scenario = SCENARIOS[currentScenario]

  const handleChoice = (option) => {
    const success = Math.random() < option.success
    
    if (success) {
      // Successful negotiation
      setScore(score + option.points)
      setSuccessfulDeals(successfulDeals + 1)
      setCashSpent(cashSpent + option.cost)
      setFeedback(`✓ Success! +${option.points} points. ${option.cost > 0 ? `Cost: $${option.cost}` : 'No cost!'}`)
    } else {
      // Failed negotiation
      setFailedDeals(failedDeals + 1)
      setCashSpent(cashSpent + option.cost)
      setFeedback(`✗ Failed! ${option.cost > 0 ? `Lost $${option.cost}` : 'But no money lost'}`)
    }

    // Move to next scenario or end game
    setTimeout(() => {
      if (currentScenario < SCENARIOS.length - 1) {
        setCurrentScenario(currentScenario + 1)
        setFeedback('')
      } else {
        endGame()
      }
    }, 2000)
  }

  const endGame = () => {
    setIsComplete(true)
    
    // Calculate performance
    const totalDeals = successfulDeals + failedDeals
    const accuracy = successfulDeals / Math.max(totalDeals, 1)
    const performanceMultiplier = Math.max(0.5, accuracy)
    
    // Bonus for saving money
    const efficiencyBonus = Math.max(0, 1 - (cashSpent / 400))
    const finalMultiplier = performanceMultiplier * (1 + efficiencyBonus * 0.5)
    
    const earnings = Math.round(basePay * finalMultiplier)

    onComplete({
      success: true,
      earnings,
      score: successfulDeals,
      mistakes: failedDeals,
      accuracy,
    })
  }

  if (isComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-2xl font-bold text-accent-success">
              Successful Deals: {successfulDeals}/{successfulDeals + failedDeals}
            </p>
            <p className="text-text-secondary">Cash Spent: ${cashSpent}</p>
            <p className="text-text-secondary">Final Score: {score}</p>
            <p className="text-xs text-text-tertiary">Another night keeping the speakeasy running smooth! 🎩</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Speakeasy Host - Negotiation Challenge</CardTitle>
        <p className="text-sm text-text-tertiary">
          Handle delicate situations with the right mix of charm, money, and wit!
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background-tertiary p-4">
            <div>
              <p className="text-xs text-text-tertiary">Scenario</p>
              <p className="text-2xl font-bold text-accent-primary">
                {currentScenario + 1}/{SCENARIOS.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Success Rate</p>
              <p className="text-2xl font-bold text-accent-success">
                {successfulDeals}/{successfulDeals + failedDeals}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Score</p>
              <p className="text-2xl font-bold text-text-primary">{score}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Cash Spent</p>
              <p className="text-2xl font-bold text-accent-warning">${cashSpent}</p>
            </div>
          </div>

          {/* Scenario Card */}
          <div className="rounded-lg border-2 border-accent-primary/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-primary text-2xl">
                {scenario.character === 'Police Officer' && '👮'}
                {scenario.character === 'Angry Customer' && '😠'}
                {scenario.character === 'Rival Gang Member' && '🤵'}
                {scenario.character === 'VIP Guest' && '💎'}
                {scenario.character === 'Bootlegger' && '🚚'}
                {scenario.character === 'Suspicious Neighbor' && '👵'}
              </div>
              <div>
                <p className="text-xs font-semibold text-accent-primary">Dealing with:</p>
                <p className="text-lg font-bold text-text-primary">{scenario.character}</p>
              </div>
            </div>
            
            <p className="text-text-secondary">{scenario.situation}</p>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`rounded-lg p-4 text-center font-semibold ${
              feedback.includes('✓') 
                ? 'bg-accent-success/20 text-accent-success border border-accent-success/30' 
                : 'bg-accent-danger/20 text-accent-danger border border-accent-danger/30'
            }`}>
              {feedback}
            </div>
          )}

          {/* Options */}
          {!feedback && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-text-primary">How do you handle this?</p>
              <div className="grid gap-3">
                {scenario.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(option)}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-background-elevated p-4 text-left transition-all hover:border-accent-primary hover:bg-accent-primary/5 hover:scale-[1.02]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary">{option.text}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span className="text-text-tertiary">
                          Success: {Math.round(option.success * 100)}%
                        </span>
                        {option.cost > 0 && (
                          <span className="text-accent-warning">Cost: ${option.cost}</span>
                        )}
                        <span className="text-accent-info">Potential: +{option.points}pts</span>
                      </div>
                    </div>
                    <div className="ml-3 text-2xl opacity-50">→</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="rounded-lg border border-accent-info/20 bg-accent-info/5 p-3 text-xs text-text-secondary">
            <p className="font-semibold text-accent-info">Negotiation Tips:</p>
            <ul className="mt-1 space-y-1">
              <li>• Higher success rates are safer but may give fewer points</li>
              <li>• Spending money can help, but efficiency matters</li>
              <li>• Risky choices can pay off big if they succeed</li>
              <li>• Each scenario requires different tactics</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

