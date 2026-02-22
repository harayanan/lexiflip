'use client'

import { useCallback, useSyncExternalStore } from 'react'

interface Progress {
  currentDifficulty: number
  streak: number
  totalWords: number
  knownWords: number
  learningWords: number
  previousWords: string[]
}

const INITIAL_PROGRESS: Progress = {
  currentDifficulty: 1,
  streak: 0,
  totalWords: 0,
  knownWords: 0,
  learningWords: 0,
  previousWords: [],
}

const STORAGE_KEY = 'lexiflip-progress'

// In-memory cache to avoid repeated JSON.parse on every render
let cachedProgress: Progress = INITIAL_PROGRESS
let listeners: Array<() => void> = []

function getSnapshot(): Progress {
  return cachedProgress
}

function getServerSnapshot(): Progress {
  return INITIAL_PROGRESS
}

function subscribe(listener: () => void): () => void {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function saveProgress(next: Progress) {
  cachedProgress = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage full or unavailable
  }
  emitChange()
}

// Initialize from localStorage on first client-side load
let initialized = false
function ensureInitialized() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      cachedProgress = JSON.parse(saved)
    }
  } catch {
    // ignore parse errors
  }
}

export function useProgress() {
  ensureInitialized()
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Record that user knew the word (increase difficulty)
  const markKnown = useCallback((word: string) => {
    const prev = cachedProgress
    const newStreak = prev.streak + 1
    let newDifficulty = prev.currentDifficulty

    if (newStreak >= 3 && prev.currentDifficulty < 7) {
      newDifficulty = prev.currentDifficulty + 1
    }

    saveProgress({
      ...prev,
      streak: newStreak >= 3 ? 0 : newStreak,
      currentDifficulty: newDifficulty,
      totalWords: prev.totalWords + 1,
      knownWords: prev.knownWords + 1,
      previousWords: [...prev.previousWords.slice(-50), word],
    })
  }, [])

  // Record that user is still learning (decrease difficulty)
  const markLearning = useCallback((word: string) => {
    const prev = cachedProgress
    saveProgress({
      ...prev,
      streak: 0,
      currentDifficulty: Math.max(1, prev.currentDifficulty - 1),
      totalWords: prev.totalWords + 1,
      learningWords: prev.learningWords + 1,
      previousWords: [...prev.previousWords.slice(-50), word],
    })
  }, [])

  // Skip word (no difficulty change)
  const skipWord = useCallback((word: string) => {
    const prev = cachedProgress
    saveProgress({
      ...prev,
      totalWords: prev.totalWords + 1,
      previousWords: [...prev.previousWords.slice(-50), word],
    })
  }, [])

  // Manually set difficulty level (level chooser)
  const setDifficulty = useCallback((level: number) => {
    const clamped = Math.max(1, Math.min(7, level))
    const prev = cachedProgress
    saveProgress({
      ...prev,
      currentDifficulty: clamped,
      streak: 0,
    })
  }, [])

  // Reset all progress
  const resetProgress = useCallback(() => {
    cachedProgress = INITIAL_PROGRESS
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    emitChange()
  }, [])

  return {
    progress,
    isLoaded: typeof window !== 'undefined',
    markKnown,
    markLearning,
    skipWord,
    setDifficulty,
    resetProgress,
  }
}
