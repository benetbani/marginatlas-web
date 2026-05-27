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
 * The full Atlas palette. Five families:
 *
 *   - atlas    — vermillion brand accent (the only loud color)
 *   - cream    — pure-white-to-light-gray surfaces
 *   - ink      — pure-grayscale text ladder
 *   - cocoa    — text aliases (retokenized from warm browns to neutral gray)
 *   - moss     — positive deltas (YoY up, "good" indicator)
 *   - clay     — negative deltas + destructive
 *   - teal     — single signature data accent (use <5% of surface)
 *
 * Plus two standalone tokens:
 *   - parchment — dedicated border token (= cream-300)
 *   - graphite  — dedicated secondary text token (= ink-700)
 *
 * Banned: aquamarine / cyan (reserved for founder's other product),
 * warm sand / amber (retokenized away in Plan v31 v3).
 */
export const colors = {
  atlas: {
    50: "#fff1ed",
    100: "#fed7c6",
    200: "#fcaa8b",
    300: "#f87850",
    400: "#e94e20",
    500: "#d73a14", // primary accent (surfaces)
    600: "#b82f0f", // hover / pressed
    700: "#952509", // primary accent (text + headline)
    800: "#6f1a06",
    900: "#491004",
  },
  cream: {
    50: "#ffffff", // page background, pure white
    100: "#f5f5f5", // primary card surface
    200: "#eaeaea",
    300: "#dddddd",
    400: "#bbbbbb",
    500: "#888888",
  },
  ink: {
    50: "#fafafa",
    100: "#f0f0f0",
    200: "#e5e5e5",
    300: "#d4d4d4",
    500: "#737373",
    600: "#525252",
    700: "#3a3a3a",
    800: "#1a1a1a",
    900: "#000000", // headlines, pure black
  },
  cocoa: {
    50: "#fafafa",
    100: "#f0f0f0",
    300: "#bbbbbb",
    500: "#737373",
    700: "#3a3a3a",
    900: "#171717",
  },
  moss: {
    50: "#f7fce8",
    100: "#ecfccb",
    300: "#bef264",
    500: "#65a30d",
    700: "#3f6212",
    900: "#1a2e05",
  },
  clay: {
    50: "#fef2f2",
    100: "#fee2e2",
    300: "#fca5a5",
    500: "#dc2626",
    700: "#991b1b",
    900: "#450a0a",
  },
  teal: {
    50: "#f0fdfa",
    500: "#0f766e",
    600: "#0d5f58",
    700: "#0f766e",
  },
  parchment: "#dddddd",
  graphite: "#3a3a3a",
} as const;

/**
 * Semantic color aliases — pick by intent, not by tone. Wired to the
 * shadcn CSS-variable system in globals.css; consumers should prefer
 * `bg-primary` / `text-foreground` / `border-border` over raw palette
 * classes for anything that might need theming later.
 */
export const semanticColors = {
  background: colors.cream[50],
  foreground: colors.ink[900],
  card: colors.cream[100],
  cardForeground: colors.ink[900],
  primary: colors.atlas[700],
  primaryForeground: colors.cream[50],
  border: colors.ink[200],
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
} as const;
