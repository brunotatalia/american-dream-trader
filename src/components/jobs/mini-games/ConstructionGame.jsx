import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const GAME_DURATION = 35 // seconds
const TARGET_HEIGHT = 10
const BLOCK_TYPES = ['🧱', '🪵', '🪨']

export default function ConstructionGame({ onComplete, basePay = 25 }) {
  const [gameState, setGameState] = useState('idle')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [currentBlock, setCurrentBlock] = useState('🧱')
  const [stack, setStack] = useState([])
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1 || stack.length >= TARGET_HEIGHT) {
          setGameState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, stack.length])

  const handleStart = () => {
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
    setStack([])
    setMistakes(0)
    setCurrentBlock(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)])
  }

  const handlePlaceBlock = (blockType) => {
    if (blockType === currentBlock) {
      setStack([...stack, blockType])
      setCurrentBlock(BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)])

      // Complete if target reached
      if (stack.length + 1 >= TARGET_HEIGHT) {
        setTimeout(() => setGameState('finished'), 300)
      }
    } else {
      setMistakes((m) => m + 1)
      // Penalty: remove top block if mistake
      if (stack.length > 0) {
        setStack(stack.slice(0, -1))
      }
    }
  }

  const handleFinish = () => {
    const completionRate = stack.length / TARGET_HEIGHT
    let multiplier = 1

    if (completionRate >= 1 && mistakes === 0) multiplier = 1.25 // Perfect
    else if (completionRate >= 1) multiplier = 1.1 // Complete with mistakes
    else if (completionRate >= 0.7) multiplier = 1 // Partial
    else multiplier = 0.85

    const earnings = Math.floor(basePay * multiplier)

    onComplete?.({
      success: true,
      earnings,
      blocksPlaced: stack.length,
      mistakes,
      completionRate,
    })
  }

  if (gameState === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Construction Worker - Block Stacking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Stack blocks by clicking the matching material. Wrong choices remove the top block. Build to {TARGET_HEIGHT}
            blocks!
          </p>
          <div className="space-y-2 text-sm text-text-tertiary">
            <p>
              <strong>Duration:</strong> {GAME_DURATION} seconds
            </p>
            <p>
              <strong>Base Pay:</strong> ${basePay}
            </p>
            <p>
              <strong>Bonus:</strong> +25% for perfect completion, +10% for any completion
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
    const completionRate = stack.length / TARGET_HEIGHT

    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              <strong>Blocks Placed:</strong> {stack.length} / {TARGET_HEIGHT}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Mistakes:</strong> {mistakes}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Completion:</strong> {(completionRate * 100).toFixed(0)}%
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
        <CardTitle>Construction Worker - Time: {timeRemaining}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">
            Height: {stack.length} / {TARGET_HEIGHT}
          </span>
          <span className="text-text-tertiary">Mistakes: {mistakes}</span>
        </div>

        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-wider text-text-tertiary">Place this block:</p>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl border-2 border-accent-primary bg-accent-primary/10 text-5xl">
            {currentBlock}
          </div>
        </div>

        {/* Visual stack */}
        <div className="mx-auto flex h-64 w-48 flex-col-reverse items-center justify-start gap-1 overflow-hidden rounded-lg border border-white/10 bg-background-elevated p-2">
          {stack.map((block, idx) => (
            <div
              key={idx}
              className="flex h-8 w-full items-center justify-center rounded border border-white/20 bg-background-tertiary text-2xl"
            >
              {block}
            </div>
          ))}
        </div>

        {/* Block selection */}
        <div className="grid grid-cols-3 gap-3">
          {BLOCK_TYPES.map((blockType) => (
            <button
              key={blockType}
              type="button"
              onClick={() => handlePlaceBlock(blockType)}
              className="flex h-20 items-center justify-center rounded-xl border-2 border-white/10 bg-background-tertiary text-4xl transition-transform hover:scale-105 active:scale-95"
            >
              {blockType}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
