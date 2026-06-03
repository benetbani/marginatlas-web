# DESIGN_STATE — autonomous visual reform loop

Source of truth for the self-driving design loop (cron d07207f5, every :11/:41).
Masterplan: docs/superpowers/specs/2026-06-03-visual-reform-masterplan.md.
**Do not ask the founder. Self-critique. Never deploy or touch live pages until a batch is approved.**

## The loop (repeat, autonomously)
1. Pick next item from "Queue" below.
2. Build/improve it to the Locked System on a `/dev/<name>` preview route.
3. Screenshot: dev server `preview_start name 'atlas'` (port 3210); warm with browser-UA curl
   (`MSYS_NO_PATHCONV=1`, UA `Mozilla/5.0 ... Chrome/126`); then
   `MSYS_NO_PATHCONV=1 node scripts/shot.mjs /dev/<name>` and `--mobile`.
4. READ `screens/<name>.png` (+ `_m`). JUDGE against Design Laws.
5. CORRECT failures, re-shoot, repeat until it clears the bar.
6. `git add` + commit locally (NO push). Update this file. Next item.

## Locked System (decided, do not re-litigate)
- **Layout:** `PageShell` + `ContentColumn` (centered max-width, kills left-lean). No page sets its own width.
- **Charts:** visx only, in `src/components/charts/` (PercentileStrip built). Gridless, direct-labeled, atlas accent.
- **Primitives:** shadcn/ui in `src/components/ui/` (re-skin as needed). Compose, never hand-roll.
- **Color:** restrained. atlas vermillion (`#d73a14`/`#952509`) single accent ≤10%. tinted-neutral ink/cocoa grays. moss/clay only for good/bad. Whitespace carries it.
- **Type:** `font-display` serif headlines (big, confident, ≥1.25 scale steps), clean sans body, `tabular-nums` for data.
- **Rhythm:** vary spacing; hairline `border-ink-100` rules between sections, NOT card boxes.

## Design Laws to self-judge against (fail = rewrite)
- NO card-stack / identical-card-grid reflex. NO isolated hero-metric (big number floating).
- NO gradient text, NO side-stripe accent borders, NO glassmorphism default, NO modal-first.
- NO em-dashes (commas/colons/periods). Every word earns its place.
- Contrast AA (4.5:1). Touch targets 44px. Tabular figures for data. Mobile-first works at 390px.
- "AI slop test": if it looks AI-generated, rewrite. Category-reflex check.

## Component inventory (use these)
- `src/components/ui/page-shell.tsx` (PageShell, ContentColumn)
- `src/components/charts/PercentileStrip.tsx` (visx distribution)
- `src/components/CountryEconomicsBreakdown.tsx` (cost split + firm mix; de-card it when reused)
- `src/components/ui/*` shadcn (button, card, badge, tabs, accordion, separator, skeleton, stat-card, bar-list...)
- Existing custom: DenseCellHero, SmartWaterfall, RevenueDistribution, etc. (audit + reuse/replace)
- AVOID porting `design-assets/incoming/set_17-20` (stale, regresses).

## Queue (status)
1. **Cell page** — `/dev/cell` v2 done (hero, percentile, P&L readout, firm-mix bar, trust row; two-column rhythm). JUDGED: solid, no cards, no floating metrics.
   NEXT ROUNDS: (a) hero is text-only with dead right-space, add a restrained visual anchor or key-figure callout; (b) verify + fix mobile at 390px (two-column sections must stack); (c) consider a subtle warm paper texture for premium feel; (d) add across-regions + related-activities sections; (e) then move to country page. IN PROGRESS.
2. Country page (`/dev/country`) — todo
3. Home — todo
4. Sectors, Cities, Compare, Calculator — todo
5. Mobile passes on all — todo
6. Then: extract the winning patterns into the live pages (after founder approves the batch).

## Log
- 2026-06-03: loop started. Preview loop (Playwright+Edge), visx, PageShell, PercentileStrip, cell mockup v1 done. globals.css @import order fixed (turbopack).
