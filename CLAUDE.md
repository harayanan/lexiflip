# CLAUDE.md - lexiflip

## Project Purpose

Adaptive vocabulary flashcard game that uses AI to generate contextual words. Features 3D flip card animations and 7 difficulty levels that adapt to player performance.

**Started**: January 2026 | **Commits**: 2 | **Status**: Early prototype

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Lucide icons
- **AI**: Google Gemini via @google/generative-ai (word generation)
- **Deployment**: Vercel

## Architecture

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # Main game UI
│   └── globals.css
├── components/
│   └── Flashcard.tsx      # 3D flip card component
└── lib/
    └── useProgress.ts     # Adaptive difficulty hook
```

## Key Files

- `src/app/page.tsx` — Main game page with word display and scoring
- `src/components/Flashcard.tsx` — 3D CSS flip animation card component
- `src/lib/useProgress.ts` — Adaptive difficulty tracking (7 levels)

## Features

- 7 difficulty levels with adaptive progression
- 3D CSS flip card animations
- AI-generated vocabulary words via Gemini
- Score tracking and level progression

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key for word generation |

## Development

```bash
npm install && npm run dev    # Dev server on localhost:3000
npm run build                 # Production build
npm run lint                  # ESLint
```

`@/*` resolves to `./src/*`
