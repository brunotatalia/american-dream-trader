import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// Keys for the rhythm game
const KEYS = ['A', 'S', 'D', 'F']
const KEY_COLORS = {
  A: 'from-red-500 to-red-600',
  S: 'from-blue-500 to-blue-600',
  D: 'from-green-500 to-green-600',
  F: 'from-yellow-500 to-yellow-600',
}

// Generate a sequence of notes
function generatePattern(length = 8) {
  return Array.from({ length }, () => KEYS[Math.floor(Math.random() * KEYS.length)])
}

export default function RhythmGame({ onComplete, basePay = 36 }) {
  const [timeLeft, setTimeLeft] = useState(50) // 50 seconds
  const [pattern, setPattern] = useState([])
  const [userPattern, setUserPattern] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [patternsCompleted, setPatternsCompleted] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [activeKey, setActiveKey] = useState('')
  const [isGameActive, setIsGameActive] = useState(true)
  const [isShowingPattern, setIsShowingPattern] = useState(true)
  const [patternLength, setPatternLength] = useState(5)

  // Initialize first pattern
  useEffect(() => {
    startNewPattern()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) {
      if (timeLeft === 0) endGame()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isGameActive])

  // Keyboard listener
  useEffect(() => {
    if (!isGameActive || isShowingPattern) return

    const handleKeyPress = (e) => {
      const key = e.key.toUpperCase()
      if (KEYS.includes(key)) {
        handleKeyInput(key)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameActive, isShowingPattern, currentIndex, pattern])

  const startNewPattern = () => {
    const newPattern = generatePattern(patternLength)
    setPattern(newPattern)
    setUserPattern([])
    setCurrentIndex(0)
    setIsShowingPattern(true)
    
    // Show pattern for a few seconds
    setTimeout(() => {
      setIsShowingPattern(false)
    }, patternLength * 600 + 500)
  }

  const handleKeyInput = (key) => {
    if (isShowingPattern) return

    // Visual feedback
    setActiveKey(key)
    setTimeout(() => setActiveKey(''), 150)

    // Check if correct
    if (key === pattern[currentIndex]) {
      // Correct!
      const newCombo = combo + 1
      const points = 50 + (newCombo * 10) // Combo bonus
      setScore(score + points)
      setCombo(newCombo)
      setMaxCombo(Math.max(maxCombo, newCombo))
      setUserPattern([...userPattern, key])
      setFeedback('Perfect! 🎵')
      setTimeout(() => setFeedback(''), 300)

      // Check if pattern complete
      if (currentIndex === pattern.length - 1) {
        setPatternsCompleted(patternsCompleted + 1)
        setFeedback('Pattern Complete! 🎉')
        
        // Increase difficulty
        if ((patternsCompleted + 1) % 3 === 0) {
          setPatternLength(Math.min(12, patternLength + 1))
        }
        
        setTimeout(() => {
          startNewPattern()
          setFeedback('')
        }, 800)
      } else {
        setCurrentIndex(currentIndex + 1)
      }
    } else {
      // Wrong!
      setMistakes(mistakes + 1)
      setCombo(0)
      setFeedback('Miss! 💥')
      setTimeout(() => setFeedback(''), 500)
    }
  }

  const endGame = () => {
    setIsGameActive(false)
    
    // Calculate performance
    const totalNotes = patternsCompleted * patternLength + currentIndex
    const accuracy = totalNotes / Math.max(totalNotes + mistakes, 1)
    const performanceMultiplier = Math.max(0.5, accuracy)
    const earnings = Math.round(basePay * performanceMultiplier * (1 + maxCombo * 0.01))

    onComplete({
      success: true,
      earnings,
      score: patternsCompleted,
      mistakes,
      accuracy,
    })
  }

  if (!isGameActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-2xl font-bold text-accent-success">Songs Completed: {patternsCompleted}</p>
            <p className="text-text-secondary">Max Combo: {maxCombo} notes</p>
            <p className="text-text-secondary">Final Score: {score}</p>
            <p className="text-xs text-text-tertiary">The crowd loved your performance! 🎵</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jazz Performance - Speakeasy Musician</CardTitle>
        <p className="text-sm text-text-tertiary">
          Follow the rhythm and play the notes in sequence! Higher combos earn more tips!
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer and Stats */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background-tertiary p-4">
            <div>
              <p className="text-xs text-text-tertiary">Time</p>
              <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-accent-danger' : 'text-accent-primary'}`}>
                {timeLeft}s
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Songs</p>
              <p className="text-2xl font-bold text-accent-success">{patternsCompleted}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Combo</p>
              <p className="text-2xl font-bold text-yellow-500">{combo}x</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Score</p>
              <p className="text-2xl font-bold text-text-primary">{score}</p>
            </div>
          </div>

          {/* Pattern Display */}
          <div className="rounded-lg border-2 border-accent-primary/30 bg-background-elevated p-6">
            {isShowingPattern ? (
              <div>
                <p className="mb-4 text-center text-sm font-semibold text-accent-warning">
                  Memorize this pattern! 🎼
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {pattern.map((note, index) => (
                    <div
                      key={index}
                      className={`flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br ${KEY_COLORS[note]} text-2xl font-bold text-white shadow-lg animate-pulse`}
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-center text-sm font-semibold text-accent-primary">
                  Play it back! Press the keys in order
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {pattern.map((note, index) => (
                    <div
                      key={index}
                      className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 ${
                        index < currentIndex
                          ? `bg-gradient-to-br ${KEY_COLORS[note]} border-white text-white`
                          : index === currentIndex
                          ? 'border-accent-primary bg-background-tertiary text-accent-primary'
                          : 'border-white/20 bg-background-secondary text-text-tertiary'
                      } text-2xl font-bold shadow-lg transition-all`}
                    >
                      {index < currentIndex ? '✓' : note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="text-center">
              <p className={`text-xl font-bold ${
                feedback.includes('Perfect') || feedback.includes('Complete') 
                  ? 'text-accent-success' 
                  : 'text-accent-danger'
              }`}>
                {feedback}
              </p>
            </div>
          )}

          {/* Piano Keys */}
          <div className="flex items-center justify-center gap-2">
            {KEYS.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyInput(key)}
                disabled={isShowingPattern}
                className={`flex h-32 w-20 flex-col items-center justify-center rounded-lg border-2 bg-gradient-to-br ${KEY_COLORS[key]} font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 md:h-40 md:w-24 ${
                  activeKey === key ? 'scale-95 brightness-150' : ''
                }`}
              >
                <span className="text-3xl">{key}</span>
                <span className="mt-2 text-xs">KEY</span>
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-accent-info/20 bg-accent-info/5 p-3 text-xs text-text-secondary">
            <p className="font-semibold text-accent-info">Performance Tips:</p>
            <ul className="mt-1 space-y-1">
              <li>• Watch the pattern carefully during the memorization phase</li>
              <li>• Press keys in the exact order shown</li>
              <li>• Build combos for bonus points and tips</li>
              <li>• Patterns get longer as you improve!</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

