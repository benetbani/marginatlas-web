/**
 * The warm frame (R6 Phase B): the structural warmth that lives AROUND the data
 * column. AtlasGutters is the fixed gutter layer for the root layout (it
 * carried a place photograph from 2026-08-09 until the founder's 2026-09-07
 * ruling removed it everywhere, see globals.css); HeroWash is the short
 * per-category band behind a page's masthead. Both are flag-gated
 * (NEXT_PUBLIC_WARM_FRAME) and no-op when off, so wiring them in is safe
 * regardless of the flag. The data column stays opaque either way, and it
 * stays neutral: no tint of any kind behind a number.
 */
export { AtlasGutters } from "./AtlasGutters";
export { HeroWash, type HeroWashProps, type HeroWashCategory } from "./HeroWash";
