/**
 * src/lib/design-tokens.ts
 *
 * Single source of truth for every design token on Margin Atlas.
 * `tailwind.config.ts` imports from here, so any change made in this
 * file propagates to Tailwind utility classes without a separate
 * config edit.
 *
 * Read this file before adding any new color, font size, spacing
 * value, radius, shadow, motion timing, or z-index to the codebase.
 * If the value isn't here, it isn't a token. New ad-hoc values go
 * through PR review; the burden of proof is on adding the token,
 * not on rejecting the inline value.
 *
 * Conventions:
 *   - All hex codes lowercase
 *   - All numeric values are strings when CSS expects them (px, ms, etc.)
 *   - Semantic aliases (success / danger / warning) live alongside
 *     palette aliases (moss / clay / atlas) so consumers can pick
 *     by intent or by tone
 *
 * Design-system Phase 1, 2026-05-27.
 */

// =============================================================
// Colors
// =============================================================

/**
 * The full Atlas palette, Warm Atlas reformation (2026-06-04). Founder
 * direction: warm, cozy, lifestyle feeling with terracotta, while still
 * delivering serious data value. This reverses the earlier warmth-drain.
 *
 *   - atlas    — terracotta / burnt-sienna brand accent (the only loud color)
 *   - cream    — warm-white-to-warm-sand paper surfaces
 *   - ink      — warm brown-black text ladder
 *   - cocoa    — text aliases, re-warmed to real browns
 *   - moss     — positive deltas (YoY up, "good" indicator)
 *   - clay     — negative deltas + destructive (held as a true red)
 *   - teal     — single muted-sage data accent (use <5% of surface)
 *
 * Plus two standalone tokens:
 *   - parchment — dedicated warm-taupe border token (= cream-300)
 *   - graphite  — dedicated warm secondary text token (= ink-700)
 *
 * Banned: aquamarine / cyan (reserved for founder's other product).
 */
export const colors = {
  atlas: {
    // Warm Atlas reformation 2026-06-04: the loud vermillion ramp earthed
    // toward terracotta / burnt sienna. Browner, slightly less saturated,
    // same lightness ladder so every contrast relationship still holds.
    50: "#fdf3ed",
    100: "#f8dcca",
    200: "#efb795",
    300: "#e08a5f",
    400: "#cf6336",
    500: "#bd5424", // primary accent (surfaces), terracotta
    600: "#a0440f", // hover / pressed
    700: "#883a14", // primary accent (text + headline), burnt sienna
    800: "#65290c",
    900: "#431a06",
  },
  cream: {
    // Warm paper ladder. 50 = warm white (cards/popovers, lightest),
    // climbing into warm sand (page paper, borders). Replaces the cold
    // white-to-gray surfaces that the pre-reformation system used.
    50: "#fffdf8", // warm white card / popover surface
    100: "#f7efe1", // warm sand page paper / muted surface
    200: "#eee2cf",
    300: "#e2d2b9", // warm taupe hairline / border step
    400: "#c4b095",
    500: "#93826a",
  },
  ink: {
    // Warm brown-black text ladder. Reads as warm ink on warm paper,
    // not clinical black on white. 900 is the headline near-black.
    50: "#faf4ec",
    100: "#f0e7d9",
    200: "#e4d8c5", // warm border
    300: "#cbb79c",
    500: "#7d6c58",
    600: "#5d4d3b",
    700: "#463726",
    800: "#2c2015",
    900: "#211810", // headlines, warm near-black
  },
  cocoa: {
    // Re-warmed to real browns (the pre-reformation system had drained
    // these to neutral gray). The text-alias family for muted copy.
    50: "#faf4ec",
    100: "#f0e7d9",
    300: "#c3b39c",
    500: "#87745d",
    700: "#534231",
    900: "#221910",
  },
  moss: {
    50: "#f6fbe8",
    100: "#e9f6c8",
    300: "#bcd96a",
    500: "#6f8f25",
    700: "#4a6018",
    900: "#222e09",
  },
  clay: {
    // Held as a true red. Danger and negative deltas must stay clearly
    // distinct from the terracotta accent, so this family is NOT warmed.
    50: "#fef2f2",
    100: "#fee2e2",
    300: "#fca5a5",
    500: "#dc2626",
    700: "#991b1b",
    900: "#450a0a",
  },
  teal: {
    // Muted sage / eucalyptus — the single cool counterweight to the
    // terracotta field. Cozy, never a loud cyan. Use under 5% of surface.
    50: "#eef5f0",
    500: "#4d7c64",
    600: "#3d6650",
    700: "#345a47",
  },
  /**
   * Data-confidence tier scale. Semantic, not a new hue: it reuses the
   * amber ramp so saturation reads as confidence (deeper amber = more
   * measured), draining to neutral gray for the weakest tier. This is the
   * one canonical place tier color lives; tier dots, scorecard badges, and
   * coverage chips all read from here instead of inventing their own green
   * or blue (the v2 components hardcoded a blue dot, which this retires).
   */
  tier: {
    deep: "#883a14", //    = atlas-700, measured / primary
    good: "#bd5424", //    = atlas-500, regional
    starter: "#e08a5f", // = atlas-300, thin
    modeled: "#87745d", // = cocoa-500, estimated
  },
  /**
   * Delta / multiplier indicators (above, at par, caution, below). Semantic,
   * reusing the warm palette so we stop hardcoding green/yellow/red hex like
   * #16a34a / #ca8a04 / #7f1d1d in neighborhood and decide pages.
   */
  delta: {
    positive: "#4a6018", // = moss-700, above par
    atpar: "#883a14", //    = atlas-700, at par
    caution: "#e08a5f", //  = atlas-300, watch
    negative: "#991b1b", // = clay-700, below par
  },
  parchment: "#e2d2b9", // warm taupe = cream-300
  graphite: "#463726", // warm brown-gray = ink-700
} as const;

/**
 * Semantic color aliases — pick by intent, not by tone. Wired to the
 * shadcn CSS-variable system in globals.css; consumers should prefer
 * `bg-primary` / `text-foreground` / `border-border` over raw palette
 * classes for anything that might need theming later.
 */
export const semanticColors = {
  background: colors.cream[100], // warm sand page paper
  foreground: colors.ink[900],
  card: colors.cream[50], // warm white article card
  cardForeground: colors.ink[900],
  primary: colors.atlas[700],
  primaryForeground: colors.cream[50],
  border: colors.cream[300], // warm taupe hairline
  ring: colors.atlas[700],
  success: colors.moss[700],
  successSurface: colors.moss[100],
  danger: colors.clay[700],
  dangerSurface: colors.clay[100],
  muted: colors.ink[500],
  mutedSurface: colors.cream[100],
} as const;

// =============================================================
// Typography
// =============================================================

/**
 * Font families. `sans` (Inter) is the default; `display` (Newsreader)
 * is reserved for H1/H2/H3 and the single hero number per page.
 */
export const fontFamily = {
  sans: [
    "var(--font-sans)",
    "Inter",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  serif: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
  display: ["var(--font-display)", "Georgia", "ui-serif", "serif"],
} as const;

/**
 * Type scale. Tailwind's default scale; documented here so consumers
 * have one place to read it. Use `text-base` (16px) as body default.
 */
export const fontSize = {
  xs: ["12px", { lineHeight: "16px" }],
  sm: ["14px", { lineHeight: "20px" }],
  base: ["16px", { lineHeight: "24px" }],
  lg: ["18px", { lineHeight: "28px" }],
  xl: ["20px", { lineHeight: "28px" }],
  "2xl": ["24px", { lineHeight: "32px" }],
  "3xl": ["30px", { lineHeight: "36px" }],
  "4xl": ["36px", { lineHeight: "40px" }],
  "5xl": ["48px", { lineHeight: "1" }],
  "6xl": ["60px", { lineHeight: "1" }],
} as const;

// =============================================================
// Spacing & radius
// =============================================================

/**
 * Section spacing rhythm. Use these constants for section-level
 * gaps; Tailwind's default 4pt scale covers component-level padding.
 */
export const sectionSpacing = {
  tight: "1rem", //   16px (sub-sections)
  base: "1.5rem", //  24px (within a section)
  loose: "2rem", //   32px (between sections)
  hero: "3rem", //    48px (between major page bands)
  band: "4rem", //    64px (between hero and content)
} as const;

/**
 * Border radius. `--radius: 1rem` in globals.css drives `rounded-lg`
 * (16px); the rest are computed from it. Buttons use `rounded-full`
 * per Atlas brand convention.
 */
export const radius = {
  sm: "8px", // small chips, tight controls (= calc(1rem - 0.5rem))
  md: "12px", // buttons, inputs (= calc(1rem - 0.25rem))
  lg: "16px", // cards (default surface radius)
  xl: "20px", // hero surfaces
  "2xl": "24px",
  full: "9999px", // pills, badges, Atlas-style buttons
} as const;

// =============================================================
// Elevation (shadow scale)
// =============================================================

/**
 * Shadow scale. Codifies the ad-hoc shadows in use. `card` is the
 * NavigatorForm paper-card style (two-layer soft shadow).
 */
export const elevation = {
  flat: "none",
  subtle: "0 1px 2px rgb(0 0 0 / 0.04)",
  card: "0 1px 3px rgb(0 0 0 / 0.05), 0 8px 28px rgb(0 0 0 / 0.06)",
  lift: "0 4px 12px rgb(0 0 0 / 0.08), 0 12px 32px rgb(0 0 0 / 0.08)",
  modal: "0 12px 24px rgb(0 0 0 / 0.12), 0 24px 48px rgb(0 0 0 / 0.12)",
} as const;

// =============================================================
// Motion
// =============================================================

/**
 * Motion duration. Use `fast` for hover / focus, `base` for most
 * state transitions, `slow` for enter / exit animations.
 *
 * Hard rule from ui-ux-pro-max: micro-interactions in 150-300ms;
 * complex transitions <=400ms; never >500ms.
 */
export const duration = {
  instant: "0ms",
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  deliberate: "400ms",
} as const;

/**
 * Easing curves. `out` for entering (page transitions, drawers);
 * `in` for exiting (60-70% of enter duration); `spring` for natural-
 * feel interactions; `linear` only for indeterminate progress.
 */
export const easing = {
  in: "cubic-bezier(0.7, 0, 0.84, 0)",
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // bouncy, for natural feel
  linear: "linear",
} as const;

// =============================================================
// Z-index
// =============================================================

/**
 * Z-index scale. Numeric gaps so adjacent layers don't collide and
 * we don't end up with `z-9999` arms races.
 */
export const z = {
  base: 0,
  raised: 10, // sticky section headers
  sticky: 20, // sticky page nav
  dropdown: 30,
  overlay: 40,
  tooltip: 50,
  modal: 60,
  toast: 70,
} as const;

// =============================================================
// Breakpoints (Tailwind defaults — documented)
// =============================================================

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =============================================================
// Re-exports for Tailwind config
// =============================================================

/**
 * Tailwind expects `theme.extend.colors` to be a flat-or-nested
 * object of color strings. The Atlas palette is already shaped that
 * way; we re-export it here under the name Tailwind expects.
 *
 * This object is consumed by `tailwind.config.ts`. Do not edit the
 * spread destructure there — edit the palettes above instead.
 */
export const tailwindColors = {
  ink: colors.ink,
  atlas: colors.atlas,
  cream: colors.cream,
  parchment: colors.parchment,
  graphite: colors.graphite,
  moss: colors.moss,
  clay: colors.clay,
  cocoa: colors.cocoa,
  teal: colors.teal,
  tier: colors.tier,
  delta: colors.delta,
} as const;
