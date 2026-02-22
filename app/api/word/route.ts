import { NextRequest, NextResponse } from 'next/server'
import { getRandomWord } from '@/lib/word-service'

export async function POST(request: NextRequest) {
  try {
    const { difficulty = 3, previousWords = [] } = await request.json()

    const level = Math.max(1, Math.min(7, Math.round(difficulty)))
    const word = getRandomWord(level, previousWords)

    if (!word) {
      return NextResponse.json(
        { error: 'No words available' },
        { status: 500 }
      )
    }

    return NextResponse.json(word)
  } catch (error) {
    console.error('Word fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch word' },
      { status: 500 }
    )
  }
}
