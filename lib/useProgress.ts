'use client'

import { useState, useEffect, useCallback } from 'react'

interface Progress {
  currentDifficulty: number
  streak: number
  totalWords: number
  knownWords: number
  learningWords: number
  previousWords: string[]
}

const INITIAL_PROGRESS: Progress = {
  currentDifficulty: 3,
  streak: 0,
  totalWords: 0,
  knownWords: 0,
  learningWords: 0,
  previousWords: [],
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(INITIAL_PROGRESS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lexiflip-progress')
    if (saved) {
      try {
        setProgress(JSON.parse(saved))
      } catch {
        setProgress(INITIAL_PROGRESS)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lexiflip-progress', JSON.stringify(progress))
    }
  }, [progress, isLoaded])

  // Record that user knew the word (increase difficulty)
  const markKnown = useCallback((word: string) => {
    setProgress((prev) => {
      const newStreak = prev.streak + 1
      let newDifficulty = prev.currentDifficulty

      // Increase difficulty after 3 correct in a row
      if (newStreak >= 3 && prev.currentDifficulty < 7) {
        newDifficulty = prev.currentDifficulty + 1
      }

      return {
        ...prev,
        streak: newStreak >= 3 ? 0 : newStreak,
        currentDifficulty: newDifficulty,
        totalWords: prev.totalWords + 1,
        knownWords: prev.knownWords + 1,
        previousWords: [...prev.previousWords.slice(-50), word],
      }
    })
  }, [])

  // Record that user is still learning (decrease difficulty)
  const markLearning = useCallback((word: string) => {
    setProgress((prev) => ({
      ...prev,
      streak: 0,
      currentDifficulty: Math.max(1, prev.currentDifficulty - 1),
      totalWords: prev.totalWords + 1,
      learningWords: prev.learningWords + 1,
      previousWords: [...prev.previousWords.slice(-50), word],
    }))
  }, [])

  // Skip word (no difficulty change)
  const skipWord = useCallback((word: string) => {
    setProgress((prev) => ({
      ...prev,
      totalWords: prev.totalWords + 1,
      previousWords: [...prev.previousWords.slice(-50), word],
    }))
  }, [])

  // Reset all progress
  const resetProgress = useCallback(() => {
    setProgress(INITIAL_PROGRESS)
    localStorage.removeItem('lexiflip-progress')
  }, [])

  return {
    progress,
    isLoaded,
    markKnown,
    markLearning,
    skipWord,
    resetProgress,
  }
}
