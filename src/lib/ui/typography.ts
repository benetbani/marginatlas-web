/**
 * typography.ts
 *
 * Canonical typography class strings. Every H1/H2/H3 on the site
 * should use one of these or carry `data-typography="custom"` to opt
 * out (and explain why in a comment).
 *
 * The verify_typography_consistency.ts prebuild gate enforces this so
 * future drift gets caught at build time, not in production review.
 *
 * Visual upgrade §5 (2026-05-26).
 */

/** Page H1. font-display serif, 3xl mobile to 6xl desktop, text-balance. */
export const T_H1 =
  "font-display text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-balance text-ink-900";

/** Section H2. font-display serif, 2xl mobile to 3xl desktop. */
export const T_H2 =
  "font-display text-2xl md:text-3xl font-medium tracking-tight text-balance text-ink-900";

/** Subsection H3. font-display serif, xl mobile to 2xl desktop. */
export const T_H3 =
  "font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900";

/** Tiny uppercase eyebrow above the headline. atlas-700 vermillion. */
export const T_EYEBROW =
  "text-[11px] uppercase tracking-[0.18em] font-semibold text-atlas-700";

/** Subhead paragraph immediately under an H1/H2. */
export const T_SUBHEAD =
  "text-base md:text-lg text-cocoa-700/80 leading-relaxed max-w-2xl";

/** Small caption text. */
export const T_CAPTION = "text-xs text-cocoa-700/70";

/** Body copy. */
export const T_BODY =
  "text-sm md:text-base text-ink-800 leading-relaxed";

/**
 * Token list used by the verify gate to recognize canonical use.
 * A heading whose className contains ANY of these substrings is
 * considered canonical for that level.
 *
 * The gate's intent is to catch EGREGIOUS drift (e.g. someone using
 * text-sm for an H1, or no size token at all), not to enforce
 * micro-uniformity. Tokens accept both serif (font-display) and the
 * sans default at sensible sizes for the level.
 */
export const TYPOGRAPHY_TOKENS = {
  h1: [
    // Serif (preferred for editorial heroes)
    "font-display text-2xl",
    "font-display text-3xl",
    "font-display text-4xl",
    "font-display text-5xl",
    "font-display text-6xl",
    // Sans fallback at H1-appropriate sizes
    "text-3xl font-semibold",
    "text-4xl font-semibold",
    "text-5xl font-semibold",
    "text-6xl font-semibold",
    "text-3xl font-medium",
    "text-4xl font-medium",
    // Hero pages with arbitrary pixel sizes
    "text-[28px]",
    "text-[32px]",
    "text-[40px]",
    "text-[48px]",
    "text-[64px]",
    "text-[1.5rem]",
    "text-[1.75rem]",
    // sm:text-Nxl breakpoint patterns
    "sm:text-2xl",
    "sm:text-3xl",
    "sm:text-4xl",
    "sm:text-5xl",
    "sm:text-6xl",
  ],
  h2: [
    "font-display text-lg",
    "font-display text-xl",
    "font-display text-2xl",
    "font-display text-3xl",
    "font-display text-4xl",
    // Sans fallback
    "text-lg md:text-xl font-semibold",
    "text-xl md:text-2xl font-semibold",
    "text-2xl md:text-3xl font-semibold",
    "text-xl font-semibold",
    "text-2xl font-semibold",
    "text-3xl font-semibold",
    "text-lg font-semibold",
    "text-lg font-medium",
    "text-xl font-medium",
    "text-2xl font-medium",
    // sm:text-Nxl breakpoint patterns
    "sm:text-xl",
    "sm:text-2xl",
    "sm:text-3xl",
    "sm:text-4xl",
    // sr-only (accessibility-only heading)
    "sr-only",
  ],
  h3: [
    "font-display text-base",
    "font-display text-sm",
    "font-display text-lg",
    "font-display text-xl",
    "font-display text-2xl",
    // Sans fallback
    "text-base font-semibold",
    "text-lg font-semibold",
    "text-xl font-semibold",
    "text-sm font-semibold",
    "text-base font-medium",
    "text-lg font-medium",
    "text-xl font-medium",
    // sm: breakpoint patterns
    "sm:text-lg",
    "sm:text-xl",
    "sm:text-2xl",
  ],
};
