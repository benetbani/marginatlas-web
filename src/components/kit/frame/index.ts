/**
 * The warm frame (R6 Phase B): the structural warmth that lives AROUND the data
 * column. AtlasGutters is the fixed place-photography layer for the root layout;
 * HeroWash is the short per-category band behind a page's masthead. Both are
 * flag-gated (NEXT_PUBLIC_WARM_FRAME) and no-op when off, so wiring them in is
 * safe regardless of the flag. The data column stays cream and opaque either
 * way: warmth in the frame, never behind a number.
 */
export { AtlasGutters } from "./AtlasGutters";
export { HeroWash, type HeroWashProps, type HeroWashCategory } from "./HeroWash";
