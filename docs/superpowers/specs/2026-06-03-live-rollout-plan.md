# Live Redesign Rollout — Deployment Plan

Goal: take the approved `/dev/*` mockup system and make it the REAL site, methodically,
with quality gates at every step. The live pages (`/`, `/[country]`, `/[country]/[geo]/[industry]`,
sectors, cities, compare, calculator) get the new editorial design. Nothing ships unverified.

## Pre-flight — stabilize (blockers, do first)
1. **Fix the dev server.** It currently boots then dies compiling any `cells`-importing route. The
   parallel data task left `fill_defaults.ts` (M) + `extrapolated_aggregation.ts` (new) in a state
   turbopack chokes on. Resolve: confirm those compile + run, OR revert them to last-committed and
   re-apply the all-sizes fix cleanly. The dev server must serve `/dev/*` AND the real routes.
2. **Lock the all-sizes data fix.** Confirm the firm-share-weighted blend is complete, tsc-clean,
   deterministic (two fetches return the same number), and sensible (KE restaurant ~$26K, not $10K).
   Commit it. This is what makes the live numbers realistic.
3. **Capture BEFORE screenshots** of the current live pages (real routes) for rollback comparison.

## Port — design into the LIVE pages, one type at a time, each verified
Rebuild each real page to the locked system (PageShell + ContentColumn, visx charts, editorial
sections), PRESERVING: the real data plumbing, SEO (title / description / canonical / structured
data), URL slugs (no renames), and edge cases (US `cells_master` path, missing-data cells, all geos).
After each: screenshot the REAL route desktop + mobile, self-critique vs the design laws, fix to a
high bar, commit local.

1. **Cell page** `/[country]/[geo]/[industry]` — flagship. Verify on: `/ke/kenya/restaurants`,
   `/us/california/restaurants`, `/de/<geo>/plumbers`, and a thin/missing-data cell.
2. **Country page** `/[country]` — verify `/ke`, `/us`, a low-coverage country.
3. **Home** `/`.
4. **Sectors, Cities, Compare, Calculator.**

## Quality gates — ALL must pass before any deploy
- `npx tsc --noEmit` = 0 real errors.
- `npm run prebuild:serial` = all 25 gates green (hardcoded-hex, em-dashes, no-source-agencies,
  plausibility, cost-share-invariant, layering, typography, render-guards, etc.).
- Screenshot every key live route (desktop + 390px mobile); self-critique each.
- Data sanity: no NaN / undefined / absurd numbers on a sample of real cells.
- SEO preserved: titles, canonical, structured data present; zero slug renames.
- a11y: contrast AA, heading order, tap targets >= 44px.

## Deploy
- Commit scoped. Push to `main`.
- Vercel builds remotely (the 25 gates run again there). MONITOR via `vercel ls` until **Ready**
  (not Error). REMOTE build only, never a local `npm run build`.
- Verify LIVE: screenshot the real routes on marginatlas.com via the Playwright+Edge loop; confirm
  the new design is live, correct, and mobile-clean.
- **Rollback:** on build failure, prod stays on the last good deploy (safe). On a live defect,
  `git revert <sha>` + push. The old design is one revert away.

## Sequencing (recommended: flagship-first)
- **Option A — all at once:** port every page, gate, single deploy. Most impact, largest risk surface.
- **Option B — flagship-first (RECOMMENDED):** cell page only → gate → deploy → verify live → then
  country + home → gate → deploy → then the rest. Each live change is verified before the next.
  Safer; the site visibly transforms in 2-3 controlled waves instead of one big-bang.

## Risk notes
- The live pages are far richer than the mockups (real data edge cases, SEO, the US measured path).
  Porting is real work, not a copy-paste; budget for per-page edge-case fixes.
- The build gates are strict; a redesign can trip plausibility / typography / layering gates. Expect
  to fix a few before the build is green.
