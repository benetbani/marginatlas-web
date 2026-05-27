# Design Tokens

**Date:** 2026-05-27
**Sources:** `tailwind.config.ts`, `src/app/globals.css`, `src/styles/homepage-visual-tokens.css`
**Status:** Documentation of what exists. The typed module lives at `src/lib/design-tokens.ts` (Phase 1 output).

This file is the canonical record of every token in use on Margin Atlas.
If a value isn't in this file, it isn't a token.

---

## 1. Color

### Brand: Atlas (vermillion)

The single brand accent. Use sparingly — vermillion is loud at full
saturation. `atlas-700` is the primary text accent; `atlas-500` is the
primary surface accent.

| Token | Hex | Use for |
|---|---|---|
| `atlas-50` | `#FFF1ED` | pale wash backgrounds |
| `atlas-100` | `#FED7C6` | subtle highlight backgrounds |
| `atlas-200` | `#FCAA8B` | light vermillion |
| `atlas-300` | `#F87850` | tertiary chips |
| `atlas-400` | `#E94E20` | mid vermillion |
| `atlas-500` | `#D73A14` | **primary accent — surfaces** |
| `atlas-600` | `#B82F0F` | hover / pressed |
| `atlas-700` | `#952509` | **primary accent — text + headline accents** |
| `atlas-800` | `#6F1A06` | deepest accents |
| `atlas-900` | `#491004` | darkest, footer accents |

### Surfaces: cream + parchment

| Token | Hex | Use for |
|---|---|---|
| `cream-50` | `#FFFFFF` | **page background — pure white** |
| `cream-100` | `#F5F5F5` | **primary card surface** |
| `cream-200` | `#EAEAEA` | hover surface on tiles |
| `cream-300` | `#DDDDDD` | soft borders |
| `cream-400` | `#BBBBBB` | borders |
| `cream-500` | `#888888` | mid grays |
| `parchment` | `#DDDDDD` | dedicated border token (same as cream-300) |

### Text: ink + cocoa

`ink` is the pure-grayscale ladder. `cocoa` was a warm-brown family,
retokenized to neutral gray in Plan v31 v3 so ~120 components shifted
automatically.

| Token | Hex | Use for |
|---|---|---|
| `ink-50` | `#FAFAFA` | off-white |
| `ink-100` | `#F0F0F0` | soft background |
| `ink-200` | `#E5E5E5` | borders, dividers |
| `ink-300` | `#D4D4D4` | borders |
| `ink-500` | `#737373` | muted text |
| `ink-600` | `#525252` | body text muted |
| `ink-700` | `#3A3A3A` | body text default |
| `ink-800` | `#1A1A1A` | strong text |
| `ink-900` | `#000000` | **headlines — pure black** |
| `cocoa-50` | `#FAFAFA` | (= ink-50) |
| `cocoa-100` | `#F0F0F0` | (= ink-100) |
| `cocoa-300` | `#BBBBBB` | muted borders |
| `cocoa-500` | `#737373` | (= ink-500) |
| `cocoa-700` | `#3A3A3A` | (= ink-700) |
| `cocoa-900` | `#171717` | near-black |
| `graphite` | `#3A3A3A` | dedicated secondary text token |

### Semantic deltas: moss + clay

Used for positive / negative deltas (YoY, vs benchmark). Replaces harsh
emerald / rose tones with warmer earth tones that fit the editorial
voice.

| Token | Hex | Use for |
|---|---|---|
| `moss-50` | `#F7FCE8` | positive badge background wash |
| `moss-100` | `#ECFCCB` | **positive badge background** |
| `moss-300` | `#BEF264` | positive accent |
| `moss-500` | `#65A30D` | chart positive area |
| `moss-700` | `#3F6212` | **positive YoY text** |
| `moss-900` | `#1A2E05` | deepest moss |
| `clay-50` | `#FEF2F2` | negative badge background wash |
| `clay-100` | `#FEE2E2` | **negative badge background** |
| `clay-300` | `#FCA5A5` | negative accent |
| `clay-500` | `#DC2626` | **chart negative area / destructive** |
| `clay-700` | `#991B1B` | **negative YoY text / destructive text** |
| `clay-900` | `#450A0A` | deepest clay |

### Single signature: teal

The only cool color on the palette. Reserved for sparse data accents
(<5% of surface). Never used for primary chrome.

| Token | Hex | Use for |
|---|---|---|
| `teal-50` | `#F0FDFA` | wash |
| `teal-500` | `#0F766E` | data accent |
| `teal-600` | `#0D5F58` | hover |
| `teal-700` | `#0F766E` | text |

### Semantic aliases (via CSS variables in globals.css)

These are shadcn-style semantic tokens that map onto the palette above.
Use these in `ui/*` primitives so theming stays centralized.

| Semantic | Maps to | Tailwind class |
|---|---|---|
| `--background` | `cream-50` (#FFFFFF) | `bg-background` |
| `--foreground` | `ink-900` (#000000) | `text-foreground` |
| `--card` | `cream-100` (#F5F5F5) | `bg-card` |
| `--card-foreground` | `ink-900` | `text-card-foreground` |
| `--primary` | `atlas-700` (#952509) | `bg-primary` |
| `--primary-foreground` | `cream-50` | `text-primary-foreground` |
| `--border` | `ink-200` (#E5E5E5) | `border-border` |
| `--ring` | `atlas-700` | `ring-ring` (used with /40 alpha) |
| `--radius` | `1rem` | `rounded-lg` |

### Banned

- **Aquamarine / cyan** — reserved for the founder's other product (Tesseract Stock Agent). Never appears on Margin Atlas.
- **Warm sand / amber** — replaced in Plan v31 v3 by neutral grays.
- **Pure cyan / electric blue** — does not match the editorial voice.

## 2. Typography

### Font families

| Family | Variable | Stack |
|---|---|---|
| `sans` | `--font-sans` | Inter (via next/font) → ui-sans-serif → system-ui → -apple-system → Segoe UI → Roboto → sans-serif |
| `display` / `serif` | `--font-display` | Newsreader (via next/font) → Georgia → ui-serif → serif |

`sans` is the default for body text and numeric tables. `display` is
reserved for H1/H2/H3 and the single hero number per page.

### Scale (Tailwind defaults — no extension)

Tailwind's default `fontSize` scale is used as-is. Documented here so
nobody has to look it up.

| Class | Size | Line-height | Use for |
|---|---|---|---|
| `text-xs` | 12px | 16px | captions, fine print |
| `text-sm` | 14px | 20px | secondary body, table cells |
| `text-base` | 16px | 24px | **body text default** |
| `text-lg` | 18px | 28px | lead paragraphs |
| `text-xl` | 20px | 28px | small headlines |
| `text-2xl` | 24px | 32px | section headers |
| `text-3xl` | 30px | 36px | H2 |
| `text-4xl` | 36px | 40px | H1 mobile |
| `text-5xl` | 48px | 1 | H1 desktop |
| `text-6xl` | 60px | 1 | hero number |
| `text-7xl` | 72px | 1 | (reserved — avoid) |

### Tabular numerals

Any UI rendering numbers in alignment-sensitive context (tables,
waterfalls, stat cards, percentile rows) MUST use `tabular-nums`. The
`Money`, `Percent`, `Number` primitives in Phase 3 enforce this.

## 3. Spacing

Tailwind's default 4pt scale is used as-is. Use multiples of 4 or 8
exclusively — no arbitrary pixel values.

| Class | rem | px |
|---|---|---|
| `p-0.5` | 0.125rem | 2px |
| `p-1` | 0.25rem | 4px |
| `p-2` | 0.5rem | 8px |
| `p-3` | 0.75rem | 12px |
| `p-4` | 1rem | 16px |
| `p-5` | 1.25rem | 20px |
| `p-6` | 1.5rem | 24px |
| `p-8` | 2rem | 32px |
| `p-10` | 2.5rem | 40px |
| `p-12` | 3rem | 48px |
| `p-16` | 4rem | 64px |
| `p-20` | 5rem | 80px |
| `p-24` | 6rem | 96px |

Section spacing rhythm: **16 / 24 / 32 / 48 / 64** by hierarchy level.

## 4. Border radius

Driven by `--radius: 1rem` (16px) in CSS variables. Tailwind aliases:

| Class | Computed | Use for |
|---|---|---|
| `rounded-sm` | `calc(1rem - 0.5rem)` = 8px | small chips, tight controls |
| `rounded-md` | `calc(1rem - 0.25rem)` = 12px | buttons, inputs |
| `rounded-lg` | `1rem` = 16px | **cards (default surface radius)** |
| `rounded-full` | 9999px | pills, badges, buttons (per Atlas's button style) |
| `rounded-xl` / `rounded-2xl` | 12px / 16px | (Tailwind defaults — same as lg) |

Buttons use `rounded-full` per the Atlas brand convention. Cards use
`rounded-lg` (`rounded-2xl` for hero surfaces).

## 5. Elevation / shadows

There is currently NO documented shadow scale. Shadows appear ad-hoc.
Phase 1 will codify these as tokens. Until then, here's what's in
common use:

| Pattern | Use for |
|---|---|
| `shadow-sm` | Subtle card lift, button shadow |
| `shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_8px_28px_rgba(0,0,0,0.06)]` | NavigatorForm card (paper-card style) |
| `shadow-lg` | Hover-elevated cards |
| `shadow-2xl` | Modals (avoid — site uses none currently) |

Phase 1 codifies these as `elevation.flat`, `elevation.card`,
`elevation.lift`, `elevation.modal`.

## 6. Motion

Currently three named keyframes exist in Tailwind config; everything
else is ad-hoc Tailwind transition classes.

### Existing keyframes

| Name | Duration | Easing | Use for |
|---|---|---|---|
| `atlasPulse` | 1800ms | ease-in-out infinite | LoadingSkeleton shimmer |
| `accordion-down` | 200ms | ease-out | Accordion expand |
| `accordion-up` | 200ms | ease-out | Accordion collapse |

### Phase 4 will add

| Token | Value | Use for |
|---|---|---|
| `duration.fast` | 150ms | hover / focus state changes |
| `duration.base` | 200ms | most state transitions (accordions, dropdowns) |
| `duration.slow` | 300ms | enter / exit animations |
| `easing.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | enter (page transitions, drawers) |
| `easing.in` | `cubic-bezier(0.7, 0, 0.84, 0)` | exit (60-70% of enter duration) |
| `easing.spring` | framer-motion spring preset | natural-feel interactions |

All motion primitives MUST respect `prefers-reduced-motion` (per axe AA).

## 7. Z-index

There is currently NO documented z-index scale. Common values in use:

| Class | Value | Use for |
|---|---|---|
| `z-10` | 10 | sticky section headers |
| `z-20` | 20 | sticky page navigation |
| `z-40` | 40 | tooltips (Radix default) |
| `z-50` | 50 | dropdowns (Radix default) |

Phase 1 will codify as `z.sticky`, `z.dropdown`, `z.tooltip`, `z.modal`,
`z.toast`.

## 8. Decorative-utility classes

Defined in `src/styles/homepage-visual-tokens.css`. These are page-level
decorative primitives, not component tokens. Documented here for
discoverability.

| Class | Use for |
|---|---|
| `.atlas-dot-grid` | Subtle dot-pattern background |
| `.atlas-dot-grid-dense` | Denser dot-pattern for hero |
| `.atlas-rule` + `.atlas-rule__mark` | Hairline rule with vermillion diamond |
| `.atlas-spotlight` | Soft amber radial glow behind hero callouts |
| `.atlas-editorial-line` | Vertical vermillion accent line on the left edge of editorial quotes |
| `.atlas-pipeline` + `.atlas-pipeline-step` | Three connected cards with hairline arrows |
| `.atlas-rotator__word` + `.atlas-rotator__word--active` | Cross-fade rotating word animation |
