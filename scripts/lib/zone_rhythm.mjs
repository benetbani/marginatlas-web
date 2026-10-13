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
 * draws is not judged.
 */

/**
 * @param {string[]} splits the split each zone declares, in page order (`main [data-zone]`'s attribute)
 * @returns {string[]} one finding per repeat, then one per run of three equal halves
 */
export function zoneRhythm(splits) {
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
