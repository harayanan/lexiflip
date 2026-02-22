export interface WordEntry {
  word: string
  pronunciation: string
  partOfSpeech: string
  definition: string
  etymology: string
  exampleSentence: string
  funFact: string
  synonyms: string[]
  difficulty: number
}

import { level1 } from './level1'
import { level2 } from './level2'
import { level3 } from './level3'
import { level4 } from './level4'
import { level5 } from './level5'
import { level6 } from './level6'
import { level7 } from './level7'

// Export the complete word database
export const wordDatabase: WordEntry[] = [
  ...level1,
  ...level2,
  ...level3,
  ...level4,
  ...level5,
  ...level6,
  ...level7,
]

// Export words grouped by difficulty for efficient lookup
export const wordsByDifficulty: Record<number, WordEntry[]> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
}

// Get total word count
export const totalWordCount = wordDatabase.length
