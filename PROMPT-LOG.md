# PROMPT LOG — lexiflip

> A running log of all user prompts/inputs for this project, maintained across sessions.

---

## 2026-02-22

1. "start work on lexiflip"
   - Explored project, read all source files, diagnosed issues

2. "Update all the usual docs. Polish it. Make sure it works. It wasn't working. Also, download and build a database of words so that you don't have to use the Gemini API again and again. Make sure the difficulty level is well sorted because I feel it is also unpredictable. Sometimes very tough words show up in easy levels."
   - Built curated word database (175+ words, 7 difficulty levels)
   - Removed Gemini API dependency entirely
   - Created word-service.ts for smart word selection
   - Polished UI (level-up toast, streak progress bar, colored difficulty dots)
   - Fixed lint errors (useSyncExternalStore refactor)
   - Shared types to eliminate duplication
   - Updated CLAUDE.md, HANDOVER.md, PROMPT-LOG.md

3. "Increase the database size to all words that a child under 12 years of age would need to know. First, give a number of words, and once I approve, go ahead and create the extended database."
   - Proposed 700 words across 7 levels (100+100+120+120+100+80+80)

4. "700 is good, go ahead"
   - Expanded database from 175 to 700 curated words
   - Split into per-level files (data/level1.ts – level7.ts)
   - Ran cross-level deduplication (removed 68 duplicates, backfilled replacements)
   - Updated words.ts to import from per-level files
   - All builds and lints clean
   - Updated CLAUDE.md, HANDOVER.md, PROMPT-LOG.md

5. "The minimum age group of this is 8+. Most of the words are too easy. Can you remove the too easy words and add medium and advanced words?"
   - Analyzed all L1-L3 words for difficulty appropriateness
   - Removed 72 too-easy words: 43 from L1 (brave, tiny, clever, etc.), 18 from L2 (villain, chaos, justice, etc.), 11 from L3 (fossil, habitat, ecosystem, etc.)
   - Added 72 age-appropriate replacements (rummage, riveting, catastrophe, haggard, decrepit, bureaucratic, antithesis, etc.)
   - Ran cross-level dedup, fixed 5 overlaps, backfilled to maintain 700 total
   - Build and lint clean
