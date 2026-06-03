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
1. **Cell page** — `/dev/cell` **v3 DONE (strong, desktop + mobile clean).** Paired hero (headline + visx
   distribution, no dead space), P&L readout, firm-mix bar, "more in Kenya" index, trust row. No cards,
   restrained editorial, atlas accent. Polish leftovers for later: subtle warm paper texture; the "more in
   Kenya" data has a couple odd values (Hotels $1.85K) = the all-sizes data bug (spawned task), not design.
2. **Country page** — `/dev/country` v1 DONE (editorial industries index + sector tags, regions wrap, coverage line). Desktop + mobile clean. Committed a2d015ee.
3. **Home** — `/dev/home` v1 DONE (confident serif promise, free-to-read framing, 3 entry lanes, Kenya data taste). Desktop + mobile clean. Committed dc9ecc8a.
4. **Sectors** — `/dev/sectors` v1 DONE (generous editorial directory, activities per sector; afa31781).
   **Cities** — `/dev/cities` v1 DONE (tier-grouped 3-column world directory; 387e2274).
   **Compare** — `/dev/compare` v1 DONE (Kenya vs Germany, two-column gap; 1d6ee7d6). **Calculator** — todo.
5. Mobile passes on all — todo
6. Then: extract the winning patterns into the live pages (after founder approves the batch).

## Log
- 2026-06-03: loop started. Preview loop (Playwright+Edge), visx, PageShell, PercentileStrip, cell mockup v1 done. globals.css @import order fixed (turbopack).
- 2026-06-03: cell mockup v2 (P&L readout, firm-mix bar, trust row, two-column rhythm). Committed 98a23481 (local). Mobile (390) stacks cleanly; percentile labels a touch tight at 390, widen later.
- 2026-06-03 FOUND DATA BUG (spawned as a separate task, not for the design loop): the "all sizes" cell revenue is non-deterministic ($10K vs $270K for the same cell) = the aggregation in cells.ts picks bands inconsistently. This is the founder's "all-sizes unrealistic" complaint. Design loop: tolerate it (judge LAYOUT, not the flickering number) until the data task lands.
- 2026-06-03: cell v3 (paired hero + distribution kills dead space; "more in Kenya" index adds depth). Committed fea56553. Desktop + mobile (390) both clean. CELL PAGE DONE for now.
- 2026-06-03: BATCH of 3 done this round — country v1 (a2d015ee), home v1 (dc9ecc8a), cell v3 (prior). All desktop + mobile clean, the editorial system holds across all three. Data-bug task is editing fill_defaults in parallel (all-sizes share-weighted fold) which will fix the odd revenue values shown in the indexes.
- 2026-06-03: sectors v1 (afa31781) + cities v1 (387e2274) done, desktop + mobile. FIVE pages now in the system (cell, country, home, sectors, cities), all editorial, no cards, consistent.
- 2026-06-03: compare v1 done (1d6ee7d6). SIX pages now (cell, country, home, sectors, cities, compare), one consistent editorial system, desktop + mobile. NOTE: occasional transient blank shots while the parallel data task hot-reloads fill_defaults / the new extrapolated_aggregation.ts; just re-shoot to confirm.
- NEXT cron fire: the **calculator** (`/dev/calculator`), then a POLISH pass across all six (subtle warm paper texture trial, refine the visx percentile strip, tighten spacing rhythm, recheck mobile), then prep extracting the winning patterns into the LIVE pages for founder approval. Review batch: screens/dev_{cell,country,home,sectors,cities,compare}.png (+ _m mobile).
