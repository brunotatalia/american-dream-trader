import { useEffect, useState } from 'react'

import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

// 1920s advertising words and slogans
const WORD_LIST = [
  'RADIO', 'AUTOMOBILE', 'LUXURY', 'MODERN', 'ELECTRIC',
  'QUALITY', 'SAVINGS', 'PROSPERITY', 'FREEDOM', 'COMFORT',
  'RELIABLE', 'POWERFUL', 'ELEGANT', 'GENUINE', 'PREMIUM',
  'SUPERIOR', 'EFFICIENT', 'STYLISH', 'AUTHENTIC', 'REFINED'
]

function scrambleWord(word) {
  const letters = word.split('')
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[letters[i], letters[j]] = [letters[j], letters[i]]
  }
  return letters.join('')
}

export default function WordScrambleGame({ onComplete, basePay = 45 }) {
  const [timeLeft, setTimeLeft] = useState(45) // 45 seconds
  const [currentWord, setCurrentWord] = useState('')
  const [scrambled, setScrambled] = useState('')
  const [userInput, setUserInput] = useState('')
  const [score, setScore] = useState(0)
  const [wordsSolved, setWordsSolved] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isGameActive, setIsGameActive] = useState(true)

  // Initialize first word
  useEffect(() => {
    generateNewWord()
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

  const generateNewWord = () => {
    const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    let scrambledWord = scrambleWord(word)
    
    // Ensure word is actually scrambled
    while (scrambledWord === word && word.length > 2) {
      scrambledWord = scrambleWord(word)
    }
    
    setCurrentWord(word)
    setScrambled(scrambledWord)
    setUserInput('')
    setFeedback('')
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    
    if (userInput.toUpperCase() === currentWord) {
      // Correct!
      const points = 100 + (timeLeft * 2) // Bonus for speed
      setScore(score + points)
      setWordsSolved(wordsSolved + 1)
      setFeedback('✓ Correct!')
      
      // Generate new word after short delay
      setTimeout(() => {
        generateNewWord()
      }, 500)
    } else {
      // Wrong
      setMistakes(mistakes + 1)
      setFeedback('✗ Try again!')
      setUserInput('')
      
      // Clear feedback after 1 second
      setTimeout(() => setFeedback(''), 1000)
    }
  }

  const handleSkip = () => {
    setMistakes(mistakes + 1)
    generateNewWord()
  }

  const endGame = () => {
    setIsGameActive(false)
    
    // Calculate performance
    const accuracy = wordsSolved / Math.max(wordsSolved + mistakes, 1)
    const performanceMultiplier = Math.max(0.5, accuracy)
    const earnings = Math.round(basePay * performanceMultiplier)

    onComplete({
      success: true,
      earnings,
      score: wordsSolved,
      mistakes,
      accuracy,
    })
  }

  if (!isGameActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shift Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-2xl font-bold text-accent-success">Words Solved: {wordsSolved}</p>
            <p className="text-text-secondary">Mistakes: {mistakes}</p>
            <p className="text-text-secondary">Final Score: {score}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word Scramble - Advertising Copywriter</CardTitle>
        <p className="text-sm text-text-tertiary">
          Unscramble advertising words quickly to create compelling copy!
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Timer and Stats */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-background-tertiary p-4">
            <div>
              <p className="text-xs text-text-tertiary">Time Remaining</p>
              <p className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-accent-danger' : 'text-accent-primary'}`}>
                {timeLeft}s
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Words Solved</p>
              <p className="text-2xl font-bold text-accent-success">{wordsSolved}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary">Score</p>
              <p className="text-2xl font-bold text-text-primary">{score}</p>
            </div>
          </div>

          {/* Scrambled Word Display */}
          <div className="text-center">
            <p className="text-sm text-text-tertiary">Unscramble this word:</p>
            <div className="my-4 flex items-center justify-center gap-2">
              {scrambled.split('').map((letter, index) => (
                <div
                  key={index}
                  className="flex h-16 w-12 items-center justify-center rounded-lg border-2 border-accent-primary bg-background-elevated text-2xl font-bold text-accent-primary md:h-20 md:w-16"
                >
                  {letter}
                </div>
              ))}
            </div>
            
            {/* Feedback */}
            {feedback && (
              <p className={`text-lg font-semibold ${feedback.includes('✓') ? 'text-accent-success' : 'text-accent-danger'}`}>
                {feedback}
              </p>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="word-input" className="block text-sm font-medium text-text-primary">
                Your Answer:
              </label>
              <input
                id="word-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-lg border border-white/10 bg-background-tertiary px-4 py-3 text-center text-xl font-semibold uppercase tracking-wider text-text-primary focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
                placeholder="TYPE HERE"
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleSkip} className="flex-1">
                Skip Word
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={!userInput}>
                Submit
              </Button>
            </div>
          </form>

          {/* Instructions */}
          <div className="rounded-lg border border-accent-info/20 bg-accent-info/5 p-3 text-xs text-text-secondary">
            <p className="font-semibold text-accent-info">Tips:</p>
            <ul className="mt-1 space-y-1">
              <li>• Solve words quickly for bonus points</li>
              <li>• Accuracy matters - mistakes reduce your pay</li>
              <li>• Skip if you're stuck, but it counts as a mistake</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

