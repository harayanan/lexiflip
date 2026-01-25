'use client'

import { useState, useEffect, useCallback } from 'react'
import { Flashcard } from '@/components/Flashcard'
import { useProgress } from '@/lib/useProgress'
import {
  Loader2,
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  RotateCcw,
  Flame,
  BookOpen,
  Trophy,
  Sparkles,
} from 'lucide-react'

interface WordData {
  word: string
  pronunciation: string
  partOfSpeech: string
  definition: string
  etymology: string
  exampleSentence: string
  funFact?: string
  synonyms: string[]
  difficulty: number
}

export default function Home() {
  const [wordData, setWordData] = useState<WordData | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { progress, isLoaded, markKnown, markLearning, skipWord, resetProgress } = useProgress()

  const fetchNewWord = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setIsFlipped(false)

    try {
      const response = await fetch('/api/word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: progress.currentDifficulty,
          previousWords: progress.previousWords,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch word')
      }

      const data = await response.json()
      setWordData(data)
    } catch (err) {
      setError('Oops! Could not load a new word. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [progress.currentDifficulty, progress.previousWords])

  // Fetch first word when progress is loaded
  useEffect(() => {
    if (isLoaded) {
      fetchNewWord()
    }
  }, [isLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleKnewIt = () => {
    if (wordData) {
      markKnown(wordData.word)
      fetchNewWord()
    }
  }

  const handleLearning = () => {
    if (wordData) {
      markLearning(wordData.word)
      fetchNewWord()
    }
  }

  const handleSkip = () => {
    if (wordData) {
      skipWord(wordData.word)
      fetchNewWord()
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const difficultyLabels = [
    'Starter',
    'Easy',
    'Medium',
    'Challenging',
    'Advanced',
    'Expert',
    'Master',
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lexiflip
            </h1>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4" />
              <span className="font-medium">{progress.streak}</span>
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">{progress.knownWords}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">{progress.totalWords}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Difficulty indicator */}
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Difficulty: {difficultyLabels[progress.currentDifficulty - 1]}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-full transition-colors ${
                  level <= progress.currentDifficulty
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Finding a great word for you...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchNewWord}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : wordData ? (
          <Flashcard wordData={wordData} isFlipped={isFlipped} onFlip={handleFlip} />
        ) : null}

        {/* Action buttons - Show only when card is flipped */}
        {!isLoading && !error && wordData && isFlipped && (
          <div className="mt-6 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleKnewIt}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/25"
              >
                <ThumbsUp className="w-5 h-5" />
                Knew it!
              </button>
              <button
                onClick={handleLearning}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
              >
                <ThumbsDown className="w-5 h-5" />
                Still learning
              </button>
            </div>
            <button
              onClick={handleSkip}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-medium transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          </div>
        )}

        {/* Hint when card is not flipped */}
        {!isLoading && !error && wordData && !isFlipped && (
          <p className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
            Take a moment to think about this word, then tap to reveal!
          </p>
        )}
      </div>

      {/* Footer with reset option */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center">
        <button
          onClick={resetProgress}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm flex items-center gap-1 mx-auto"
        >
          <RotateCcw className="w-3 h-3" />
          Reset progress
        </button>
      </footer>
    </main>
  )
}
