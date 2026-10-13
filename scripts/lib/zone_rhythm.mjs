/**
 * scripts/lib/zone_rhythm.mjs , ART DIRECTION D3 AND D6 ON THE ZONES (plan 2026-10-12 rhythm-air-inside, Task 1D; spec
 * E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md, section 3 item 4).
 * D3: no zone repeats the split of the zone before it, and never three equal-halves zones in a row. A "wide" zone (the hero, the peers table,
 * the close: full-width levels, which section-bands counts) holds no split, so two wide neighbours are no repeat; "lone" is a split (a level
 * whose partner self-omits), so two lone neighbours are one, whichever side each stands (the attribute does not say the side).
 * D6: on a band page a level stands further from the next than two sections in a level stand from each other, and they further than a kept
 * box's padding (DISTANCES 2.5: 128, 64 and 20 at 1024 and up). The card page's chapter rung is not read: a band page opens a chapter under
 * the same padding as any level and marks it with its numbered head (MODEL PART 10.2), which the spec keeps.
 * BLIND SPOT, stated: it judges what verify_art_direction.mjs measured at one width (1440) on the chain's renders; a data state no render
 * draws is not judged. D3 judges the split each zone DECLARES (the data-zone attribute the Zone component writes from the split the page asks
 * for and the sections it gives), not the tracks the stylesheet draws: it cannot distinguish a split that silently failed to compile from
 * one that drew as declared, nor say how a lone zone's section is drawn (the left two thirds, or the left third where it is lean). A render
 * that holds no zone judged nothing, so zoneRhythm names it (NO_ZONE_READ) and the gate stops on it: the zone attribute renamed, or the
 * render broken, can never make D3 and D6 pass by leaving them nothing to judge.
 */

/** The finding for a reading of nothing, one text wherever it is said: zoneRhythm, the art-direction gate's stop, Task 6's extra renders. */
export const NO_ZONE_READ = "no zone read: the render holds no `main [data-zone]`, so D3 and D6 judged nothing. Remedy: draw the page's levels with the Zone component (src/components/spine/zones.tsx), which writes data-zone, or, where the page does draw them, fix the render (run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names)";

/**
 * @param {string[]} splits the split each zone declares, in page order (`main [data-zone]`'s attribute)
 * @returns {string[]} NO_ZONE_READ alone when no zone was read, else one finding per repeat, then one per run of three equal halves
 */
export function zoneRhythm(splits) {
  /* A reading of nothing is a finding, not a pass: the header's last sentence. One zone read is a read; only none is not. */
  if (!splits.length) return [NO_ZONE_READ];
  const out = [];
  for (let i = 1; i < splits.length; i++) {
    if (splits[i] !== "wide" && splits[i] === splits[i - 1]) out.push(`zones ${i} and ${i + 1} both split ${splits[i]}`);
  }
  for (let i = 2; i < splits.length; i++) {
    if (splits[i] === "1-1" && splits[i - 1] === "1-1" && splits[i - 2] === "1-1") out.push(`zones ${i - 1} to ${i + 1} are three equal halves in a row`);
  }
  return out;
}

/*
 * THE TYPE IS DECLARED, NOT INFERRED: with the `= []` defaults alone, tsc (allowJs) reads each of the three as never[], so the test's calls
 * with numbers are a TS2322 and `next build`, which type-checks tests/, fails on it.
 */
/**
 * @param {{ levelGaps?: number[], pairGaps?: number[], keptPads?: number[] }} measured the page's measured distances in px: a level to the
 *   next (one zone's padding below plus the next one's above), two sections side by side (the level's column gap), a kept box's padding
 * @returns {string[]} one finding per rung that does not stand over the one inside it
 */
export function zoneLadder({ levelGaps = [], pairGaps = [], keptPads = [] }) {
  const out = [];
  if (!levelGaps.length) return out;
  const level = Math.min(...levelGaps);
  const pair = pairGaps.length ? Math.max(...pairGaps) : 0;
  const pad = keptPads.length ? Math.max(...keptPads) : 0;
  if (pair && level <= pair) out.push(`a level stands ${level} from the next, not more than the ${pair} between two sections in a level`);
  if (pair && pad && pair <= pad) out.push(`two sections in a level stand ${pair} apart, not more than a kept box's padding of ${pad}`);
  if (!pair && pad && level <= pad) out.push(`a level stands ${level} from the next, not more than a kept box's padding of ${pad}`);
  return out;
}
