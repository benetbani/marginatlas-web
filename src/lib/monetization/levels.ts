/**
 * src/lib/monetization/levels.ts
 *
 * WHICH LEVELS LOCK (milestone 2; his interview of 2026-09-26: 18, half of every chapter, each chapter's first level free and
 * the rest Pro; 27, UK pages only, which the caller decides). A level is a zone (src/components/spine/zones.tsx). A view tags a
 * chapter on the zone that opens it; later zones of the chapter may carry the same tag (city, trade) or none (the country page),
 * so membership is carried forward, and a zone marked `outside` (the page's answer before chapter 01, its close after the last)
 * belongs to no chapter and never locks.
 */
export type LevelRef = { key: string; chapter?: string | null; outside?: boolean };

export function lockedLevelKeys(levels: readonly LevelRef[]): Set<string> {
  const locked = new Set<string>();
  let current: string | null = null;
  let seenInChapter = 0;
  for (const level of levels) {
    if (level.outside) { current = null; seenInChapter = 0; continue; }
    if (level.chapter && level.chapter !== current) { current = level.chapter; seenInChapter = 0; }
    if (!current) continue;
    seenInChapter++;
    if (seenInChapter > 1) locked.add(level.key);
  }
  return locked;
}
