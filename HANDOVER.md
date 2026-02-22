# HANDOVER — lexiflip

> Adaptive vocabulary flashcard game with curated word database and 3D flip animations

## Status: FUNCTIONAL PROTOTYPE

**Started:** January 2026

## Tech Stack

- **Framework:** Next.js 16.1.4 (App Router)
- **UI:** React 19 + Tailwind CSS 4 + Lucide icons
- **Word source:** Local curated database (700 words) — no API key needed

## Key Features

- 700 curated words across 7 properly graded difficulty levels (100+100+115+125+100+80+80)
- **Level chooser**: Clickable difficulty dots let kids pick their own level
- 3D flip card animations (CSS transforms) — fixed-height cards prevent vertical shift
- Adaptive difficulty (3 correct → level up, 1 wrong → level down)
- Default start at Level 1 (Starter) for age-appropriate onboarding
- Streak tracking with progress bar and level-up toast
- Trophy count, total word count
- Text-to-speech pronunciation
- Multi-color action buttons (knew it, still learning, skip)
- Progress persistence in localStorage (via useSyncExternalStore)
- Dark mode support
- Works entirely offline — no API keys needed

## Source Structure

```
app/
├── api/word/route.ts          # Word API — serves from local database
├── page.tsx                    # Main game UI
├── layout.tsx
└── globals.css
components/
└── Flashcard.tsx               # 3D flip card component
data/
├── words.ts                    # Word database hub (imports all levels)
├── level1.ts – level7.ts      # 700 words across 7 difficulty levels
lib/
├── types.ts                    # Shared TypeScript interfaces
├── useProgress.ts              # Adaptive difficulty hook
└── word-service.ts             # Word selection with dedup + fallback
```

## Quick Start

```bash
npm install
npm run dev                   # localhost:3000
```

No environment variables required.

## What Changed (2026-02-22 — Session 2)

- **Default difficulty 3→1**: New users now start at Level 1 (Starter) instead of Level 3 (Medium)
- **Level chooser**: Made difficulty dots clickable — tap any dot to switch level, with hover effects and tooltip labels
- **Fixed flip animation glitch**: Card no longer shifts vertically during flip — uses fixed `h-[400px]` instead of `minHeight`, consistent `p-6` padding on both faces, scrollable inner container for back content
- **Word difficulty audit**: Moved 5 too-advanced words from Level 3 → Level 4: jurisdiction, bureaucratic, antithesis, colloquial, inconspicuous
- **Added `setDifficulty()` to useProgress**: Allows manual level switching with streak reset

## What Changed (2026-02-22 — Session 1)

- **Built curated word database**: 700 words across 7 difficulty levels with definitions, etymology, fun facts, example sentences, synonyms — all age-appropriate and properly difficulty-graded. Split into per-level files for maintainability.
- **Rebalanced difficulty for 8+ age group**: Removed 72 too-easy words from L1-L3 (words like brave, tiny, clever, volcano, justice, fossil) and replaced with age-appropriate challenges (rummage, riveting, catastrophe, haggard, decrepit, bureaucratic, antithesis)
- **Removed Gemini API dependency**: App now works entirely from local database, no API key needed
- **Fixed difficulty unpredictability**: Words are now hand-curated per level instead of AI-generated on the fly
- **Added word service**: Smart word selection avoids repeats, falls back to adjacent levels when pool is exhausted
- **Polished UI**: Level-up toast animation, streak progress bar, per-level color-coded difficulty dots
- **Fixed lint errors**: Refactored useProgress to use `useSyncExternalStore` (React 19 pattern)
- **Shared types**: Created `lib/types.ts` to eliminate interface duplication
- **Removed dead code**: Removed `@google/generative-ai` dependency, removed non-existent manifest.json reference
- **Updated all docs**: CLAUDE.md, HANDOVER.md, PROMPT-LOG.md

## Next Steps

1. Deploy to Vercel
2. Add word categories/topics (science, literature, everyday)
4. Add confetti animation for level-up milestones
5. Add "word of the day" feature
6. Add review mode for previously seen words

## Blockers

None.

---
*Last reviewed: 2026-02-22 (level chooser, flip fix, default difficulty, word audit)*
