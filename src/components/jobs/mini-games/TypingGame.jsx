import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

const SENTENCES = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'The five boxing wizards jump quickly.',
  'Bright vixens jump; dozy fowl quack.',
]

const GAME_DURATION = 60 // seconds

export default function TypingGame({ onComplete, basePay = 40 }) {
  const [gameState, setGameState] = useState('idle')
  const [currentSentence, setCurrentSentence] = useState('')
  const [userInput, setUserInput] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [completedSentences, setCompletedSentences] = useState(0)
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [correctCharacters, setCorrectCharacters] = useState(0)

  const pickRandomSentence = () => {
    return SENTENCES[Math.floor(Math.random() * SENTENCES.length)]
  }

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
    setCurrentSentence(pickRandomSentence())
    setUserInput('')
    setTimeRemaining(GAME_DURATION)
    setCompletedSentences(0)
    setTotalCharacters(0)
    setCorrectCharacters(0)
  }

  const handleInputChange = (e) => {
    const input = e.target.value
    setUserInput(input)

    // Check if sentence is complete
    if (input === currentSentence) {
      setCompletedSentences((c) => c + 1)
      setCorrectCharacters((c) => c + currentSentence.length)
      setTotalCharacters((t) => t + input.length)
      setCurrentSentence(pickRandomSentence())
      setUserInput('')
    } else if (input.length > currentSentence.length) {
      // User typed too much - reset
      setUserInput('')
      setTotalCharacters((t) => t + input.length)
    }
  }

  const handleFinish = () => {
    const wpm = Math.floor((correctCharacters / 5) / (GAME_DURATION / 60))
    const accuracy = totalCharacters > 0 ? correctCharacters / totalCharacters : 0

    let multiplier = 1
    if (accuracy >= 0.98 && wpm >= 40) multiplier = 1.25
    else if (accuracy >= 0.9 && wpm >= 30) multiplier = 1.1
    else if (accuracy >= 0.75) multiplier = 1
    else multiplier = 0.85

    const earnings = Math.floor(basePay * multiplier)

    onComplete?.({
      success: true,
      earnings,
      wpm,
      accuracy,
      completedSentences,
    })
  }

  if (gameState === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Secretary - Typing Challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            Type the sentences as they appear with speed and accuracy. Fast typists earn bonuses!
          </p>
          <div className="space-y-2 text-sm text-text-tertiary">
            <p><strong>Duration:</strong> {GAME_DURATION} seconds</p>
            <p><strong>Base Pay:</strong> ${basePay}</p>
            <p><strong>Bonus:</strong> +25% for 98%+ accuracy and 40+ WPM</p>
          </div>
          <Button variant="primary" size="lg" onClick={handleStart}>
            Start Shift
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === 'finished') {
    const wpm = Math.floor((correctCharacters / 5) / (GAME_DURATION / 60))
    const accuracy = totalCharacters > 0 ? correctCharacters / totalCharacters : 0

    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">
              <strong>Completed:</strong> {completedSentences} sentences
            </p>
            <p className="text-sm text-text-secondary">
              <strong>WPM:</strong> {wpm}
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
        <CardTitle>Secretary - Time: {timeRemaining}s</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">Completed: {completedSentences}</span>
          <span className="text-text-tertiary">
            WPM: {Math.floor((correctCharacters / 5) / ((GAME_DURATION - timeRemaining) / 60)) || 0}
          </span>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-background-tertiary/60 p-4">
            <p className="font-mono text-lg text-text-primary">{currentSentence}</p>
          </div>

          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type the sentence here..."
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-background-elevated px-4 py-3 font-mono text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          />

          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <span>Match exactly (including punctuation)</span>
            <span>{userInput.length} / {currentSentence.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
