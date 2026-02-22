import { wordsByDifficulty, type WordEntry } from '@/data/words'

/**
 * Pick a random word from the local database for the given difficulty level.
 * Avoids recently shown words (previousWords).
 * Falls back to adjacent difficulty levels if all words at the target level have been seen.
 */
export function getRandomWord(
  difficulty: number,
  previousWords: string[] = []
): WordEntry | null {
  const level = Math.max(1, Math.min(7, Math.round(difficulty)))
  const recentSet = new Set(previousWords.map((w) => w.toLowerCase()))

  // Try the target difficulty first
  const candidates = (wordsByDifficulty[level] || []).filter(
    (w) => !recentSet.has(w.word.toLowerCase())
  )

  if (candidates.length > 0) {
    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  // If all words at this level have been seen, try adjacent levels (±1)
  for (const offset of [1, -1]) {
    const adjLevel = level + offset
    if (adjLevel >= 1 && adjLevel <= 7) {
      const adjCandidates = (wordsByDifficulty[adjLevel] || []).filter(
        (w) => !recentSet.has(w.word.toLowerCase())
      )
      if (adjCandidates.length > 0) {
        // Return with the original requested difficulty
        const word = adjCandidates[Math.floor(Math.random() * adjCandidates.length)]
        return { ...word, difficulty: level }
      }
    }
  }

  // Last resort: pick any unseen word from the target level's pool,
  // or just pick a random one (resetting the "seen" concept)
  const allAtLevel = wordsByDifficulty[level] || []
  if (allAtLevel.length > 0) {
    return allAtLevel[Math.floor(Math.random() * allAtLevel.length)]
  }

  return null
}
