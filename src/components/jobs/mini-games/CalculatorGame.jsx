import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const GAME_DURATION = 45 // seconds
const DIFFICULTY_RANGES = {
  easy: { min: 10, max: 50 },
  medium: { min: 20, max: 100 },
  hard: { min: 50, max: 500 },
}

function generateProblem(difficulty = 'medium') {
  const range = DIFFICULTY_RANGES[difficulty]
  const operations = ['+', '-', '*']
  const operation = operations[Math.floor(Math.random() * operations.length)]

  const num1 = Math.floor(Math.random() * (range.max - range.min)) + range.min
  const num2 = Math.floor(Math.random() * (range.max - range.min)) + range.min

  let question, answer

  switch (operation) {
    case '+':
      question = `${num1} + ${num2}`
      answer = num1 + num2
      break
    case '-':
      question = `${num1} - ${num2}`
      answer = num1 - num2
      break
    case '*':
      question = `${num1} × ${num2}`
      answer = num1 * num2
      break
    default:
      question = `${num1} + ${num2}`
      answer = num1 + num2
  }

  return { question, answer }
}

export default function CalculatorGame({ onComplete, basePay = 50 }) {
  const [gameState, setGameState] = useState('idle')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [currentProblem, setCurrentProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState])

  const handleStart = () => {
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
    setScore(0)
    setMistakes(0)
    setCurrentProblem(generateProblem('medium'))
    setUserAnswer('')
  }

  const handleSubmit = (e) => {
    e?.preventDefault()

    const numericAnswer = parseInt(userAnswer, 10)

    if (numericAnswer === currentProblem.answer) {
      setScore((s) => s + 1)
    } else {
      setMistakes((m) => m + 1)
    }

    setCurrentProblem(generateProblem('medium'))
    setUserAnswer('')
  }

  const handleFinish = () => {
    const accuracy = score / (score + mistakes) || 0
    let multiplier = 1

    if (accuracy >= 0.95) multiplier = 1.25
    else if (accuracy >= 0.85) multiplier = 1.1
    else if (accuracy >= 0.7) multiplier = 1
    else multiplier = 0.85

    const earnings = Math.floor(basePay * multiplier)

    onComplete?.({
      success: true,
      earnings,
      score,
      mistakes,
      accuracy,
    })
  }

  if (gameState === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accountant - Math Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Solve arithmetic problems quickly and accurately. Fast mental math earns bonuses!
          </p>
          <div className="space-y-2 text-sm text-text-tertiary">
            <p>
              <strong>Duration:</strong> {GAME_DURATION} seconds
            </p>
            <p>
              <strong>Base Pay:</strong> ${basePay}
            </p>
            <p>
              <strong>Bonus:</strong> +25% for 95%+ accuracy, +10% for 85%+
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart}>
            Start Shift
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const accuracy = score / (score + mistakes) || 0

    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              <strong>Correct:</strong> {score}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Mistakes:</strong> {mistakes}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Accuracy:</strong> {(accuracy * 100).toFixed(1)}%
            </p>
          </div>
          <Button variant="success" size="lg" onClick={handleFinish}>
            Collect Earnings
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accountant - Time: {timeRemaining}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">Correct: {score}</span>
          <span className="text-text-tertiary">Mistakes: {mistakes}</span>
        </div>

        {currentProblem && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-background-elevated p-8 text-center">
              <p className="font-display text-4xl text-text-primary">{currentProblem.question} = ?</p>
            </div>

            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter answer..."
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-3 text-center font-display text-2xl text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Submit Answer
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
