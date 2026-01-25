'use client'

import { useState } from 'react'
import { Volume2 } from 'lucide-react'

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

interface FlashcardProps {
  wordData: WordData
  isFlipped: boolean
  onFlip: () => void
}

export function Flashcard({ wordData, isFlipped, onFlip }: FlashcardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleFlip = () => {
    if (isAnimating) return
    setIsAnimating(true)
    onFlip()
    setTimeout(() => setIsAnimating(false), 600)
  }

  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation()
    const utterance = new SpeechSynthesisUtterance(wordData.word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  const difficultyColors = [
    'from-green-400 to-emerald-500',
    'from-green-500 to-teal-500',
    'from-teal-500 to-cyan-500',
    'from-cyan-500 to-blue-500',
    'from-blue-500 to-indigo-500',
    'from-indigo-500 to-purple-500',
    'from-purple-500 to-pink-500',
  ]

  const gradientClass = difficultyColors[wordData.difficulty - 1] || difficultyColors[2]

  return (
    <div
      className="perspective-1000 w-full max-w-md mx-auto cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ minHeight: '400px' }}
      >
        {/* Front of card - Word only */}
        <div
          className={`absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-8 shadow-2xl flex flex-col items-center justify-center`}
        >
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-sm font-medium">
              Level {wordData.difficulty}
            </span>
          </div>

          <button
            onClick={speakWord}
            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            aria-label="Hear pronunciation"
          >
            <Volume2 className="w-5 h-5 text-white" />
          </button>

          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-4 drop-shadow-lg">
            {wordData.word}
          </h1>

          <p className="text-white/80 text-lg italic mb-2">
            {wordData.pronunciation}
          </p>

          <p className="text-white/70 text-sm uppercase tracking-wider">
            {wordData.partOfSpeech}
          </p>

          <div className="absolute bottom-6 text-white/60 text-sm animate-pulse">
            Tap to reveal meaning
          </div>
        </div>

        {/* Back of card - Definition, etymology, usage */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl overflow-y-auto"
          style={{ minHeight: '400px' }}
        >
          <div className={`h-2 rounded-full bg-gradient-to-r ${gradientClass} mb-4`} />

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {wordData.word}
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {wordData.pronunciation} • {wordData.partOfSpeech}
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">
                Definition
              </h3>
              <p className="text-gray-800 dark:text-gray-200 text-lg">
                {wordData.definition}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-1">
                Origin Story
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {wordData.etymology}
              </p>
            </div>

            <div className={`bg-gradient-to-r ${gradientClass} rounded-xl p-4`}>
              <h3 className="text-xs uppercase tracking-wider text-white/80 font-semibold mb-1">
                Example
              </h3>
              <p className="text-white italic">
                &ldquo;{wordData.exampleSentence}&rdquo;
              </p>
            </div>

            {wordData.funFact && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <span className="font-semibold">Fun fact:</span> {wordData.funFact}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                Similar Words
              </h3>
              <div className="flex flex-wrap gap-2">
                {wordData.synonyms.map((syn, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-gray-400 dark:text-gray-500 text-sm">
            Tap to see next word
          </div>
        </div>
      </div>
    </div>
  )
}
