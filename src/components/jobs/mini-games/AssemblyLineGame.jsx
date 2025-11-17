import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const GAME_DURATION = 30 // seconds
const COLORS = ['red', 'blue', 'green', 'yellow']
const COLOR_CLASSES = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
}

export default function AssemblyLineGame({ onComplete, basePay = 25 }) {
  const [gameState, setGameState] = useState('idle') // idle, playing, finished
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [currentColor, setCurrentColor] = useState(null)
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

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)])
    }, 2000)

    return () => clearInterval(interval)
  }, [gameState])

  const handleColorClick = (clickedColor) => {
    if (clickedColor === currentColor) {
      setScore((s) => s + 1)
    } else {
      setMistakes((m) => m + 1)
    }
    setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)])
  }

  const handleStart = () => {
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
    setScore(0)
    setMistakes(0)
    setCurrentColor(COLORS[Math.floor(Math.random() * COLORS.length)])
  }

  const handleFinish = () => {
    const accuracy = score / (score + mistakes) || 0
    let multiplier = 1

    if (accuracy >= 0.95) multiplier = 1.25 // Perfect
    else if (accuracy >= 0.8) multiplier = 1.1 // Great
    else if (accuracy >= 0.6) multiplier = 1 // Good
    else multiplier = 0.85 // Below average

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
          <CardTitle>Assembly Line Worker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Sort items on the conveyor belt by clicking the correct color as they appear. Speed and accuracy matter!
          </p>
          <div className="space-y-2 text-sm text-text-tertiary">
            <p><strong>Duration:</strong> {GAME_DURATION} seconds</p>
            <p><strong>Base Pay:</strong> ${basePay}</p>
            <p><strong>Bonus:</strong> +25% for 95%+ accuracy, +10% for 80%+</p>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart}>
            Start Shift
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
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
              <strong>Accuracy:</strong> {((score / (score + mistakes)) * 100 || 0).toFixed(1)}%
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
        <CardTitle>Assembly Line - Time: {timeRemaining}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">Score: {score}</span>
          <span className="text-text-tertiary">Mistakes: {mistakes}</span>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="mb-4 text-sm uppercase tracking-wider text-text-tertiary">Click this color:</p>
            <div
              className={`mx-auto h-24 w-24 rounded-xl shadow-lg ${COLOR_CLASSES[currentColor] ?? 'bg-gray-500'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorClick(color)}
                className={`h-20 w-20 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 ${COLOR_CLASSES[color]}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
