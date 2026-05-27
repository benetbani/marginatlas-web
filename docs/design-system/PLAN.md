# Margin Atlas Design System v1 — Master Plan

**Date:** 2026-05-27
**Status:** Approved, executing.
**Decision lock-in:**
- Scope: all 8 phases
- Catalog: `/_design` route on the site, ADMIN_KEY gated
- Migration: 8-10 hot components
- A11y bar: WCAG AA + axe-core prebuild gate

This document is the authority for the design-system effort. Every
component shipped under this plan must satisfy the rules in
`GUIDELINES.md` (Phase 8 output). The plan itself lives here so any
future engineer can read it cold and understand both what we did and
why we made each choice.

---

## North star

A documented, accessible, motion-aware component system that:

1. **Codifies what already works** (Atlas tokens, the 10 shadcn-style primitives in `src/components/ui/`, Tremor charts, the StatCard).
2. **Fills the gaps** (skeleton system, empty/error states, motion vocabulary, accessibility floor).
3. **Has a living visual catalog** at `/_design` so engineers can see every primitive in every state.
4. **Becomes the authority** for every future component via `GUIDELINES.md`.

---

## Current state (audited 2026-05-27)

### What exists

- `src/components/ui/` — 10 primitives: accordion, badge, bar-list, button, card, progress-bar, separator, stat-card, tabs, tooltip
- State components, scattered: `LoadingSkeleton.tsx`, `EmptyState.tsx`, `empty/CellDataMissingEmpty`, `empty/ComingSoonPlaceholderCard`, `empty/SectorUnderConstructionEmpty`
- Data primitives in the wild: `CoverageIndicator`, `TurnoverBandChip`, `AuPrimaryDataBadge`, `CategoryChip`, `CellWarningChips`, `TypicalFirmCard`, `LocalContextCard`, `KeyBenchmarkBanner`
- Tokens in `tailwind.config.ts` + `src/styles/homepage-visual-tokens.css` (undocumented)
- Two `v2/*` components — stalled refactor (`FeaturedCardV2`, `SectorCardV2`)
- 136 total `.tsx` components

### The seven gaps this plan closes

1. Tokens aren't documented; `text-atlas-700` reads as arbitrary.
2. No standardized skeleton system; many components show a blank gap during load.
3. State components live in three different patterns.
4. No visual catalog; engineers can't see all primitives in one place.
5. No motion vocabulary; animations are ad-hoc per component.
6. No accessibility gate; easy to ship missing aria-labels.
7. v1/v2 schism unresolved.

---

## Phase-by-phase

Each phase ends in a discrete commit + clean prebuild. The plan can
stop at any phase boundary without breaking the codebase.

### Phase 0 — Inventory & token extraction (~1.5h, docs only)

Output:
- `docs/design-system/INVENTORY.md` — every primitive that exists today, where it lives, what state it's in
- `docs/design-system/TOKENS.md` — color, type, spacing, elevation, motion, z-index — extracted from tailwind.config + the homepage-visual-tokens.css

No code change. This is the baseline reference for everything that follows.

### Phase 1 — Typed token module (~2h, code)

Output:
- `src/lib/design-tokens.ts` — typed JS/TS exports of every token (color, type, spacing, elevation, motion, z-index)
- `scripts/verify_design_tokens.ts` — new prebuild gate (26th) that asserts `design-tokens.ts` and `tailwind.config.ts` stay in sync; fails the build on drift

The point: animations and inline styles need tokens in JS, not just CSS. A token module gives them a single source.

### Phase 2 — State primitives (~3-4h, code)

Output:
- `src/components/ui/skeleton.tsx` — variants: `text`, `block`, `circle`, `chart`, `card`
- `src/components/ui/empty-state.tsx` — single primitive replacing the three scattered ones
- `src/components/ui/error-state.tsx` — with retry action
- `src/components/ui/spinner.tsx` — for <300ms operations only
- Migrate the 5 existing scattered files to use the new primitives; delete the originals

State primitives are the biggest visible improvement under load. The skill rates "skeleton screens for >300ms operations" as HIGH priority.

### Phase 3 — Core primitive expansion (~3h, code)

Output:
- `src/components/ui/money.tsx` — tabular-nums by default, locale-aware
- `src/components/ui/percent.tsx` — tabular-nums by default
- `src/components/ui/number.tsx` — tabular-nums by default
- `src/components/ui/pill.tsx` — codifies the 6+ ad-hoc chip components
- `src/components/ui/inline-link.tsx` — focus rings + external affordance baked in
- `src/components/ui/disclosure.tsx` — for "where does this number come from" tooltips

Existing money formatter (`fmtMoney` in `src/lib/format/money.ts`) keeps working; the new `<Money />` component wraps it with tabular-nums and consistent spacing.

### Phase 4 — Motion vocabulary (~2h, code)

Output:
- `src/lib/motion.ts` — duration tokens (150/200/300ms), easing curves (ease-out, spring presets)
- `src/components/ui/motion/FadeIn.tsx`, `SlideUp.tsx`, `Stagger.tsx`
- Built on `framer-motion` (already installed)
- Every motion primitive respects `prefers-reduced-motion` at the primitive level

The skill calls motion a MEDIUM-priority issue: consistent timing + spring physics > ad-hoc cubic-bezier.

### Phase 5 — Internal catalog page `/_design` (~3-4h, code)

Output:
- `src/app/_design/page.tsx` — admin-gated (same `?key=ADMIN_KEY` pattern as `/admin/data-quality`)
- Renders every primitive in every state: default, hover, focus, disabled, loading, empty, error
- Side-by-side mobile (375px iframe) + desktop preview
- Light/dark toggle (preview, since site is light-only today)

If it's not on `/_design`, it's not a primitive. The catalog is THE source of truth, not the docs.

### Phase 6 — Accessibility floor (~2-3h, code)

Output:
- `@axe-core/react` integrated in dev mode (no prod cost)
- `scripts/verify_a11y.ts` — 27th prebuild gate, runs axe against a server-rendered `/_design` and fails on any AA violation
- `docs/design-system/A11Y.md` — documents the floor: 4.5:1 body / 3:1 large text, 2px+ focus rings, aria-labels on icon-only buttons, keyboard nav everywhere

### Phase 7 — Migration sweep (~4-6h, code)

Output (one commit per component):
- Resolve v1/v2 schism: keep v2, delete v1 (or vice versa, after inspection)
- Migrate 8-10 highest-traffic components to use the new primitives, in this priority order:
  1. `KeyBenchmarkBanner` (cell page hero)
  2. `DenseCellHero`
  3. `RevenueDistribution`
  4. `SmartWaterfall`
  5. `NavigatorForm` (main button)
  6. `HomepageHero`
  7. `CellWarningChips`
  8. `CoverageIndicator`
  9-10: TBD based on what surfaces during the work

The other 126 components stay untouched. New code uses the primitives; old code migrates organically.

### Phase 8 — Guidelines (~2h, docs — the future-proofing artifact)

Output:
- `docs/design-system/GUIDELINES.md` — the authority for everything that comes after this plan
- Sections:
  - "When to add a new component" decision tree
  - "When to use a token vs. an arbitrary value" (the answer: almost always token)
  - "What every primitive must satisfy" — props API shape, a11y floor, state coverage, story on /_design
  - "How to read the inventory + catalog before reaching for a new component"
  - Coding conventions: prop naming, variant patterns (cva), forwardRef, displayName, file structure
  - Pre-merge checklist for any UI change

This is the document the next engineer reads first.

---

## Quality loops (between every phase)

Each phase ends with:

- **Loop A**: `npx tsc --noEmit` clean
- **Loop B**: `npm run prebuild` — all gates pass
- **Loop C**: visual smoke on `/_design` (Phase 5+)
- **Loop D**: one real cell page renders correctly with the new primitives
- **Loop E**: commit + push

No phase ships until all five loops pass.

---

## Wall-clock estimate

| Phase | Hours | Output |
|---|---|---|
| 0 | 1.5 | 2 docs |
| 1 | 2 | tokens.ts + verify gate |
| 2 | 3-4 | 4 primitives + cleanup |
| 3 | 3 | 4 primitives |
| 4 | 2 | motion lib + 3 primitives |
| 5 | 3-4 | /_design route |
| 6 | 2-3 | a11y gate + docs |
| 7 | 4-6 | 8 migrations |
| 8 | 2 | guidelines.md |
| **Total** | **22-28h** | **Design system + guidelines artifact** |

---

## What this plan deliberately does NOT do

- **Dark mode** is out of scope. Site is light-only today. Tokens will support it; the actual dark-mode CSS variables are not in this plan.
- **Storybook** is out of scope. `/_design` covers the same use case at lower lift.
- **Replacing the 126 untouched components** is out of scope. They keep working; the system is for new work and the 8-10 hot migrations.
- **Re-doing the Atlas color palette.** The palette is locked. The system documents and codifies it.
- **Performance optimization** beyond what's already shipped. The earlier perf pass + middleware fixes stand.
