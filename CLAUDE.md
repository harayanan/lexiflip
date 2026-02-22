# CLAUDE.md - lexiflip

## Project Purpose

Adaptive vocabulary flashcard game for 12-year-old learners. Features a curated local word database with 700 words across 7 difficulty levels, 3D flip card animations, and adaptive difficulty progression.

**Started**: January 2026 | **Status**: Functional prototype

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Lucide icons
- **Word source**: Local curated database (700 words, 7 difficulty levels) — no API key needed
- **Deployment**: Vercel

## Architecture

```
app/
├── api/word/route.ts    # Word API — serves from local database
├── page.tsx             # Main game UI
├── layout.tsx
└── globals.css
components/
└── Flashcard.tsx        # 3D flip card component
data/
├── words.ts             # Word database hub (imports + re-exports all levels)
├── level1.ts            # Level 1 — Starter (100 words)
├── level2.ts            # Level 2 — Easy (100 words)
├── level3.ts            # Level 3 — Medium (120 words)
├── level4.ts            # Level 4 — Challenging (120 words)
├── level5.ts            # Level 5 — Advanced (100 words)
├── level6.ts            # Level 6 — Expert (80 words)
└── level7.ts            # Level 7 — Master (80 words)
lib/
├── types.ts             # Shared TypeScript interfaces
├── useProgress.ts       # Adaptive difficulty hook (useSyncExternalStore)
└── word-service.ts      # Word selection logic with dedup
```

## Key Files

- `app/page.tsx` — Main game page with word display, scoring, level-up animation
- `components/Flashcard.tsx` — 3D CSS flip animation card with text-to-speech
- `data/words.ts` — Word database hub: imports from 7 per-level files, exports `wordDatabase`, `wordsByDifficulty`, `totalWordCount`
- `data/level1.ts` – `data/level7.ts` — 700 words total with definitions, etymology, fun facts, synonyms
- `lib/word-service.ts` — Picks random words from DB, avoids repeats, falls back to adjacent levels
- `lib/useProgress.ts` — Adaptive difficulty via `useSyncExternalStore` + localStorage

## Features

- 700 curated vocabulary words with proper difficulty grading
- 7 difficulty levels with adaptive progression (3 correct → level up, 1 wrong → level down)
- 3D CSS flip card animations
- Score tracking (streak, trophies, total words)
- Level-up toast animation and streak progress bar
- Text-to-speech pronunciation
- Progress persistence in localStorage
- Dark mode support
- Zero API keys needed — works entirely offline

## Difficulty Levels

| Level | Name | Example Words |
|-------|------|---------------|
| 1 | Starter | brave, swift, curious, wander |
| 2 | Easy | hesitate, magnificent, peculiar, triumph |
| 3 | Medium | elaborate, consequence, paradox, inevitable |
| 4 | Challenging | meticulous, ephemeral, resilient, ambiguous |
| 5 | Advanced | ubiquitous, juxtaposition, quintessential, vicarious |
| 6 | Expert | serendipity, ineffable, cacophony, laconic |
| 7 | Master | sesquipedalian, defenestration, mellifluous, syzygy |

## Development

```bash
npm install && npm run dev    # Dev server on localhost:3000
npm run build                 # Production build
npm run lint                  # ESLint
```

`@/*` resolves to `./*` (project root, not src/)
