import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

// Difficulty levels with descriptions
const difficultyDescriptions: Record<number, string> = {
  1: 'very simple everyday words a 10-year-old would know (like: happy, run, book, friend)',
  2: 'simple words a 11-year-old would know (like: curious, adventure, discover, brilliant)',
  3: 'intermediate words a 12-year-old should learn (like: elaborate, significant, phenomenon, consequence)',
  4: 'challenging words for an advanced 12-year-old (like: meticulous, ephemeral, pragmatic, resilient)',
  5: 'advanced vocabulary words (like: ubiquitous, eloquent, paradigm, juxtaposition)',
  6: 'sophisticated words for eager learners (like: serendipity, ineffable, sycophant, cacophony)',
  7: 'complex words that impress (like: pulchritudinous, defenestration, sesquipedalian, antediluvian)',
}

export async function POST(request: NextRequest) {
  try {
    const { difficulty = 3, previousWords = [] } = await request.json()

    // Clamp difficulty between 1 and 7
    const level = Math.max(1, Math.min(7, Math.round(difficulty)))
    const difficultyDesc = difficultyDescriptions[level]

    const excludeList = previousWords.slice(-20).join(', ')

    const prompt = `Generate a vocabulary word for a 12-year-old student learning new words.

Difficulty level: ${level}/7 - ${difficultyDesc}

${excludeList ? `DO NOT use these recently shown words: ${excludeList}` : ''}

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "word": "the vocabulary word",
  "pronunciation": "phonetic pronunciation like /pruh-NUN-see-AY-shun/",
  "partOfSpeech": "noun/verb/adjective/adverb/etc",
  "definition": "clear, simple definition a 12-year-old can understand",
  "etymology": "interesting origin story of the word (keep it engaging and brief, 1-2 sentences)",
  "exampleSentence": "a relatable example sentence using the word",
  "funFact": "an optional fun or surprising fact about this word or its usage (1 sentence)",
  "synonyms": ["2-3 simpler synonyms"],
  "difficulty": ${level}
}

Make it educational but FUN! The etymology should be interesting like a mini story.`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonStr = text
    if (text.includes('```')) {
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (match) jsonStr = match[1].trim()
    }

    const wordData = JSON.parse(jsonStr)

    return NextResponse.json(wordData)
  } catch (error) {
    console.error('Word generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate word' },
      { status: 500 }
    )
  }
}
