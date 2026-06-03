# Masterplan — Total Visual Reform of marginatlas.com

**Date:** 2026-06-03
**Mandate:** Reform the site visually, completely. Change anything except the brand color
schema (atlas vermillion + cocoa/ink neutrals + moss/clay). Maximize use of ready-made,
library-grade components. Standardize a framework that minimizes future distortion. Every
change goes through a cycle: import -> review -> implement -> QA. Nothing ships unseen.

## North star
A quiet, editorial, *expensive-feeling* data publication — not a SaaS dashboard, not a 2010
stats page. Big confident type, generous whitespace, one accent color used sparingly,
restrained library-grade charts. The page should feel designed, not assembled.

---

## Part 1 — The Framework (set once, never re-litigated)

Four pillars. These are the "rules forever."

### Pillar A — Component library: shadcn/ui
Radix + Tailwind + cva — the stack already uses all three. Adopt shadcn primitives (Card,
Button, Badge, Tabs, Select, Tooltip, Separator, Accordion, Skeleton, Sheet for mobile).
Re-skin them once with the brand tokens. Every surface composes from this set. No more
bespoke one-off cards.

### Pillar B — Chart/stat layer: visx
ALL data visualization comes from one system built on `visx` (D3 primitives, full editorial
control, no dashboard look). Build ~5 reusable chart primitives once: PercentileStrip,
StackedShareBar (cost split / firm mix), MiniTrend, RankedBars, Distribution. Hand-drawn bars
are banned going forward.

### Pillar C — Layout shell
One `PageShell` + `ContentColumn` primitive: centered max-width container, consistent
horizontal rhythm, a real right-rail slot. Fixes the left-lean and the background-vs-card
clash (define a quiet page background + an elevated card surface that actually relate). Every
page renders inside the shell. No page sets its own margins.

### Pillar D — Local preview loop (the root-cause fix)
Stop building blind on the prod URL. Stand up a local render I can screenshot and iterate on
BEFORE shipping. `next dev` OOMs this box, so: a lightweight isolated preview route (or a
Node `--max-old-space-size` bump), screenshotted via the browser / Claude_Preview MCP. This
is non-negotiable and is *why* the page kept breaking.

---

## Part 2 — Anti-distortion rules (locked)

1. **Tokens only.** Spacing, type scale, radius, shadow, color — all from `design-tokens.ts`.
   No arbitrary values. New gate: `verify_layout_tokens`.
2. **Compose, never hand-roll.** New UI = shadcn primitive + visx chart. If a primitive is
   missing, add it to the catalog first.
3. **Catalog or it doesn't exist.** Every primitive appears in `/_design` with all states.
4. **Screenshot gate.** Nothing ships without a desktop + mobile screenshot review.
5. **One section spec.** Each page's sections are defined in a spec (order, purpose, density);
   components render the spec, they don't improvise.

---

## Part 3 — The cycle (applied to every surface)

```
IMPORT      pull the shadcn/visx pieces the surface needs
REVIEW      build a mockup, screenshot it, you react (I drive, you point)
IMPLEMENT   build to the approved mockup using only framework pieces
QA          desktop + mobile screenshots + the verify gates + a11y check
SHIP        merge, deploy, confirm live
```

---

## Part 4 — Execution phases (big elements first)

### Phase 0 — Foundations (the framework)
Install shadcn/ui + visx. Re-skin primitives with brand tokens. Build `PageShell` +
`ContentColumn`. Build the 5 visx chart primitives. Stand up the preview loop. Add the
layout-token gate. **Deliverable: a `/_design` catalog page you can screenshot.**

### Phase 1 — Design language lock
Present a full **mockup of the redesigned cell page** (the worst offender) in the new system.
Typography scale, card system, chart style, background treatment, spacing rhythm, section
order. You approve the look before any page is rebuilt.

### Phase 2 — Cell page rebuild (flagship)
Rebuild `/[country]/[geo]/[industry]` to the approved language. Fixes baked in:
- Duplicate breadcrumb -> single.
- Garbled size selector -> proper shadcn Select/Tabs with correct bands.
- "All sizes" showing the micro-floor as typical -> blend across bands (the $10K realism bug).
- Isolated revenue + dated percentile bar -> a contextual hero with the visx PercentileStrip.
- "3% profit / 1 employee / $6K wage" junk -> a coherent, sane typical-firm readout.
- The cost-split / firm-mix panel -> rebuilt on visx StackedShareBar.

### Phase 3 — Country page rebuild
Shell + a real country scorecard, the top-industries grid, regions — all library-grade.

### Phase 4 — Roll the system across the rest
Home, coverage, sectors, cities, compare, calculator, about-data, pricing — re-shell and
re-card. Each is now fast because the framework exists.

### Phase 5 — Mobile + accessibility pass
Every surface reviewed at 3 breakpoints (mobile-first, your emphasis). WCAG AA. Tap targets.
Mobile nav via shadcn Sheet.

---

## Part 5 — Skills + tools called

- `frontend-design` + `impeccable` — design direction, mockups, polish (Phases 1-5).
- `ui-styling` / `ui-ux-pro-max` — shadcn setup + component patterns (Phase 0).
- `find-docs` / `context7` — current visx + shadcn APIs.
- `react-best-practices` — performant component build.
- `superpowers:writing-plans` — formalize each phase into a step plan.
- `verification-before-completion` — the screenshot + gate QA.
- Browser / Claude_Preview MCP — the preview loop.

## Part 6 — Quality gates (locked, additive to the existing 25)

- Visual: desktop + mobile screenshot review per surface.
- `verify_layout_tokens` (new): no arbitrary spacing/type/radius.
- `verify_hardcoded_hex` (exists): brand tokens only.
- `/_design` catalog completeness.
- a11y: AA contrast + tap targets.

## Part 7 — Sequencing note
Phase 0 + 1 are the real investment (the framework + the locked look). Phases 2-5 then go
fast and *cannot* drift, because every piece is a re-used framework element. This is how the
botching stops permanently.
