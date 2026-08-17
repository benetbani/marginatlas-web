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
 *   - clay     — destructive / strong-danger (deep maroon, kept distinct from brand red)
 *   - amber    — warnings / caution (soft-danger), distinct from clay and moss
 *   - teal     — single muted-sage data accent (use <5% of surface)
 *
 * Plus two standalone tokens:
 *   - parchment — the hairline. A true neutral, s=0%, and the ONLY name for it
 *   - graphite  — dedicated warm secondary text token (= ink-700)
 *
 * Banned: aquamarine / cyan (reserved for founder's other product).
 */
export const colors = {
  atlas: {
    // Final accent retone 2026-06-04: vivid red base (#e62200). Brighter and
    // more clearly red than the prior brick ramp, keeping a clean lightness
    // ladder so every contrast relationship still holds.
    50: "#fff1ee",
    100: "#ffd9d0",
    200: "#ffb3a3",
    300: "#fb8469",
    400: "#f24e2f",
    500: "#e62200", // primary accent (surfaces), vivid red
    600: "#c11c00", // hover / pressed
    700: "#991600", // primary accent (text + headline)
    800: "#701000",
    900: "#4a0a00",
  },
  cream: {
    // Warm paper ladder. 50 = warm white (cards/popovers, lightest),
    // climbing into warm sand (page paper, borders). Replaces the cold
    // white-to-gray surfaces that the pre-reformation system used.
    50: "#ffffff", // warm white card / popover surface
    // SaaS reformation 2026-06-12 (founder): the app ground. White cards sit
    // on this field so surfaces read as layered product UI, not a flat sheet.
    // Sits between the white card (50) and 100; supersedes the 2026-06-06
    // white-reset page ground.
    //
    // CREAM PURGE 2026-08-17. Was #fbfaf7, a warm cream. Founder, 2026-08-16:
    // "to remove completely this creamy color from the page. That's totally
    // not allowed."
    //
    // RETONED RATHER THAN DELETED, and the reason is the method: this step has
    // exactly ONE role. Every use of it in the repository is a page ground,
    // checked one by one rather than assumed: two `min-h-screen` <main>
    // elements (/dev/gold-mine, /dev/london-commercial), three sticky
    // header/nav grounds (london-commercial, OrientationHeader,
    // StickySectionNav), one gradient end-stop, one focus ring-offset (which
    // is by definition the ground behind the control) and two inset panels in
    // CompareClient. No card fill, no chip, no table tint. So changing the
    // value migrates the whole page-ground role in one edit, with zero
    // component churn and no chance of the find-and-replace accident that
    // nearly stripped a <thead> background on a previous sweep.
    //
    // #f7f7f8 is `--paper` from src/styles/atlas-spine.css, the v2 system whose
    // first rule is "NEUTRAL PALETTE. No cream, no warm tint." The hue flips
    // from warm (h 45) to cool (h 240) and the new value is a hair darker
    // (l 97.1 vs 98.4). Contrast was computed against the eight foreground
    // tokens that sit on this ground rather than assumed: largest change 0.42
    // on a ratio of 16.7, and ZERO AA verdicts flip in either direction.
    //
    // The NAME is still wrong: this is no longer a cream. Renaming the ramp is
    // the last step of the purge, deliberately separate, because a rename
    // touches every call site and must not ride along with a colour change.
    75: "#f7f7f8", // cool neutral app ground (page surface behind cards)

    // THE MUTED-FILL RETONE, 2026-08-17. These four steps were the last warm
    // tints in the ramp: 100 #f7f6f4, 200 #efeeeb, 300 #e4e2dd, 400 #c3bfb7,
    // all of them at h 40-45 and s 9-16%. They are now TRUE NEUTRALS, s=0%.
    //
    // WHY RETONE RATHER THAN REMAP THE CALL SITES. This is the same move that
    // fixed `parchment`, and it is the only one that works here, because the
    // 400 step is SHARED between two roles that a remap would have to split:
    // it is the neutral bar mass in Waterfall, ComparisonBars, VsWorld,
    // MoneyGoesBreakdown and VisitorSplit, AND the dashed rule on five
    // empty-state boxes AND five underlines. The previous pass deferred it for
    // exactly that reason, having found no cool token at its weight. There is
    // still none, and Tailwind's own cool ramps skip the weight too: zinc-300
    // is l 83.9% and zinc-400 is l 65.7%, against this step's 74.1%, so a remap
    // either way visibly changes how heavy those rules read. Changing the value
    // underneath all seventeen usages moves none of them.
    //
    // THE VALUES ARE LUMINANCE-MATCHED, not eyeballed and not lightness-matched.
    // Relative luminance is the quantity every contrast ratio is computed from,
    // so matching it is what guarantees a fill that must be seen stays seen:
    //   100  L .9222 -> .9216   on white 1.080:1 -> 1.081:1
    //   200  L .8550 -> .8550   on white 1.160:1 -> 1.160:1
    //   300  L .7611 -> .7534   on white 1.295:1 -> 1.283:1
    //   400  L .5228 -> .5210   on white 1.833:1 -> 1.839:1
    // Across the seven foregrounds that sit on these as fills the largest ratio
    // change is 0.03 and ZERO AA verdicts flip. The dashed empty-state box, the
    // case the brief singled out as the one that must not go invisible, reads
    // 1.697:1 against its own fill before and 1.702:1 after.
    //
    // THE HAIRLINE STEP IS GONE, 2026-08-17, and this is a collapse rather than
    // a deletion. It landed on #e3e3e3, which is `parchment` exactly: one value
    // wearing two names, which is the precise mechanism that let cream survive
    // the first three passes of this purge. `parchment` wins because it carries
    // 380-odd call sites against this step's twenty, and because a hairline
    // deserves a name that says hairline rather than a rung on a surface ladder.
    // Every reader moved across with no change of value.
    //
    // The NAME is still wrong on all of these. The ramp holds no cream after
    // this change; renaming it is the last step of the purge and is deliberately
    // kept separate, because a rename touches every call site and must not ride
    // along with a colour change.
    100: "#f6f6f6", // muted surface (thead tints, chips, inset panels)
    200: "#eeeeee",
    400: "#bfbfbf", // chart bar mass, dashed rules, underlines
    // 500 (#8d887e) DELETED 2026-08-17: defined since the warm reformation and
    // referenced exactly zero times in src/. A token that exists gets used, and
    // this one was the darkest cream on the ramp.
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
  /* THE moss RAMP IS DELETED, 2026-08-17. It was the "positive-delta" half of a
     two-hue good-versus-bad scale, and that scale no longer exists: the whole
     axis moved to intensity in ONE hue, which is what
     verify_palette_membership's own header prescribes and what
     src/lib/scores/band_tone.ts implements.

     Deleted rather than kept unused. Charter section 2 says a token that still
     exists will be used again, and this ramp proved it twice in one session.

     Every call site was verified gone first, because deleting a ramp under a
     live one fails SILENTLY: Tailwind emits no rule, tsc says nothing, and the
     element just loses its colour. */
  clay: {
    // Deep maroon / oxblood — the DESTRUCTIVE color. Retoned 2026-06-04 off
    // the prior bright red so strong-danger reads clearly distinct from the
    // vivid red brand accent (atlas, #e62200). Red stays reserved for brand.
    50: "#fbeae8",
    100: "#f3c9c4",
    200: "#e29c93",
    300: "#cf6c5f",
    400: "#b3463a",
    500: "#8c2b22",
    600: "#73211a",
    700: "#5c1813",
    800: "#421009",
    900: "#2b0a05",
  },
  /* THE amber RAMP IS DELETED, 2026-08-17, with moss above and for the same
     reason. Its own comment described it as "distinct from moss (positive)",
     which is the two-hue scale stated outright.

     Note what depended on it: the tier scale below says it "reuses the amber
     ramp so saturation reads as confidence". That sentence is now the design,
     not a borrowing, and tier carries its own values. */
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
    deep: "#991600", //    = atlas-700, measured / primary
    good: "#e62200", //    = atlas-500, regional
    starter: "#fb8469", // = atlas-300, thin
    modeled: "#87745d", // = cocoa-500, estimated
  },
  /**
   * Delta / multiplier indicators (above, at par, caution, below). Semantic,
   * reusing the warm palette so we stop hardcoding green/yellow/red hex like
   * #16a34a / #ca8a04 / #7f1d1d in neighborhood and decide pages.
   */
  delta: {
    positive: "#4a6018", // = moss-700, above par
    atpar: "#463726", //    = ink-700 graphite neutral, at par (not brand-red)
    caution: "#b06a08", //  = amber-600, watch
    negative: "#8a510a", // = amber-700, below par (warning, not brand-red)
  },
  /**
   * Chart color roles (Brand Design Constitution 2026-06-16, section 4.2). The
   * fixed color jobs the visx chart kit consumes; chart components read these
   * roles, never the raw palette, so the chart grammar stays one language. Each
   * value reuses the warm palette (noted) so a chart never invents a hue.
   */
  chart: {
    primary: "#e62200", //  = atlas-500, the typical value / you-are-here / spotlight
    kept: "#4a6018", //     = moss-700, profit / kept / positive delta
    cost: "#87745d", //     = cocoa-500, structure and costs, the neutral breakdown mass
    baseline: "#7d6c58", // = ink-500, neutral data mass / axes / muted labels
    grid: "#e3e3e3", //     = parchment, rails / gridlines / hairlines / track backgrounds
    caution: "#b06a08", //  = amber-600, caution / below par
    danger: "#5c1813", //   = clay-700, destructive / hard errors only
  },
  /**
   * THE HAIRLINE. One value, one job: borders, divides and 1px rules.
   *
   * CREAM PURGE 2026-08-17, and this token WAS the purge's biggest blind spot.
   * It read `#e4e2dd, warm taupe = cream-300` and the comment was exact: it was
   * byte-for-byte cream-300, h=42.9 s=11.5% l=88.0%. So did `--border` and
   * `--input` in globals.css (rgb 228 226 221), `--parchment` in
   * homepage-visual-tokens.css, and the unused `chart.grid` role below. Cream
   * had FOUR names, and 360 hairlines wore the one that did not contain the
   * word. Migrating the cream-300 border utilities onto `border-parchment`
   * would have moved cream behind an alias and made the ratchet look like it
   * was working. (Written without the dead class spelled out: tailwind's
   * content scan does not strip comments, so naming a retired utility in prose
   * re-emits it into the stylesheet. Caught by asserting on the compiled CSS.)
   *
   * #e3e3e3 is not invented. It is the rail/track value the v2 spine system
   * already uses in eleven places (spine/kit.tsx, NeighborhoodExplorer,
   * money-chapter), and the chart role below calls rails and hairlines one job.
   * It is a true neutral, s=0%, so the answer to "remove the creamy colour" is
   * no hue at all rather than a cool tint swapped for a warm one.
   *
   * WEIGHT IS PRESERVED, measured rather than eyeballed, because 360 borders
   * change at once and none of them was asked to get heavier: luminance moves
   * 0.7611 -> 0.7534, so the hairline's contrast against a white card goes
   * 1.29:1 -> 1.28:1 and against the page ground 1.21:1 -> 1.20:1. Against the
   * seven foregrounds that sit on it as a fill (ink-900/800/700, ink-500,
   * cocoa-700/900, atlas-700) the largest change is +0.12 on a ratio of 13.49
   * and ZERO AA verdicts flip in either direction.
   */
  parchment: "#e3e3e3", // neutral hairline (was cream-300 under another name)
  graphite: "#463726", // warm brown-gray = ink-700
} as const;

/**
 * Semantic color aliases — pick by intent, not by tone. Wired to the
 * shadcn CSS-variable system in globals.css; consumers should prefer
 * `bg-primary` / `text-foreground` / `border-border` over raw palette
 * classes for anything that might need theming later.
 */
export const semanticColors = {
  background: colors.cream[75], // warm app ground (SaaS reformation 2026-06-12)
  foreground: colors.ink[900],
  card: colors.cream[50], // warm white article card
  cardForeground: colors.ink[900],
  primary: colors.atlas[700],
  primaryForeground: colors.cream[50],
  border: colors.parchment, // neutral hairline
  ring: colors.atlas[700],
  /* success/successSurface/warning/warningSurface deleted with their ramps.
     All four were call-site free: nothing in src read them. danger keeps clay,
     which is a maroon in the terracotta family rather than a second hue. */
  danger: colors.clay[700], // maroon (destructive), distinct from brand red
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

/**
 * Fluid display scale (Brand Design Constitution 2026-06-16, section 3.4). The
 * editorial tier (Newsreader, --font-display): mastheads and band/section
 * openers use these clamp sizes so the almanac voice scales with the viewport.
 * The scanned tier (body and below) keeps the fixed `fontSize` ladder above,
 * where predictability matters more than fluidity. The serif slot never sets
 * below 20px; the h3 minimum clamp holds at or above 20px, and anything smaller
 * is Inter, not Newsreader.
 */
export const displayScale = {
  hero: "clamp(2.75rem, 6vw, 5.25rem)", //   masthead anchor / homepage hero
  h1: "clamp(2rem, 4vw, 3.5rem)", //         page masthead
  h2: "clamp(1.5rem, 2.5vw, 2.25rem)", //    band / section opener
  h3: "clamp(1.125rem, 1.5vw, 1.375rem)", // sub-opener (20px floor holds)
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
 * Shadow scale. SaaS reformation 2026-06-12 (founder direction: modern
 * product surfaces, not flat newsprint): every step is a warm ink-tinted
 * (rgb 33 24 16 = ink-900) two-layer shadow with a tight contact layer
 * plus a soft long-throw layer. Negative spread keeps the throw under
 * the card so depth reads without grey halos.
 *
 *   subtle — resting card on the app ground
 *   card   — feature frames / hero surfaces (the workhorse)
 *   lift   — hover state of interactive cards; dropdowns, popovers
 *   modal  — dialogs, command palette; one per screen at most
 */
export const elevation = {
  flat: "none",
  subtle: "0 1px 2px rgb(33 24 16 / 0.05), 0 2px 6px rgb(33 24 16 / 0.04)",
  card: "0 1px 2px rgb(33 24 16 / 0.04), 0 14px 30px -18px rgb(33 24 16 / 0.20)",
  lift: "0 2px 4px rgb(33 24 16 / 0.05), 0 18px 38px -18px rgb(33 24 16 / 0.24)",
  modal: "0 2px 4px rgb(33 24 16 / 0.04), 0 30px 60px -28px rgb(33 24 16 / 0.30)",
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
  clay: colors.clay,
  cocoa: colors.cocoa,
  teal: colors.teal,
  tier: colors.tier,
  delta: colors.delta,
  chart: colors.chart,
} as const;
