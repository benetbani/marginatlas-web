# Cell-page hang post-mortem

**Date:** 2026-05-25
**Reporter:** founder, via screenshots of cell URLs failing to load
**Severity:** SEV-1, every cell page intermittently unreachable

## Symptom

Clicking the homepage navigator routes to a cell URL like `/us/california/restaurants`. The browser shows a loading spinner for ~10 to 60 seconds, then either:
- displays a Vercel 504 / "gateway timeout"
- shows a blank page
- shows the styled Atlas not-found page after a long wait

All other pages on the site load normally. The hang is specific to the cell route.

## Root cause

The cell page render performs two waves of parallel data fetches:

**Wave 1** (line 237 in `src/app/[country]/[geo]/[industry]/page.tsx`):
- `getCellBySlug()` — wraps `getCellBySlugRaw` in `withTimeout(25_000ms)`. If the underlying Supabase query hangs, the timeout fires and the page falls back to `synthesizeCell()`. **Protected.**
- `getCellVariants()` — **UNPROTECTED.** No timeout. If Supabase is slow on this one query, the entire `Promise.all` blocks indefinitely.

**Wave 2** (line 255):
- `getComparableCells()` — UNPROTECTED.
- `getSameIndustryAcrossStates()` — UNPROTECTED.
- `getSameIndustryAcrossCountries()` — UNPROTECTED.
- `getNudgeNeighbor()` — UNPROTECTED.

So 5 of 6 secondary fetches had no timeout protection. Any one of them slow on Supabase would block the page until Vercel killed the function at `maxDuration = 60s`.

Why it surfaced now: likely a Supabase query plan changed (autovacuum, statistics refresh, a query optimizer flip on one of the comparable-cells joins). The unprotected `Promise.all` made every other query's success irrelevant.

## Fix

Added `withBudget()` helper in `src/lib/cells.ts`, exported. Same shape as `withTimeout` but returns a caller-supplied default value on timeout instead of `null`, so the caller's return type is preserved. Also logs a single `console.warn` so a chronically slow query is visible in Vercel function logs.

Wrapped every secondary fetch on the cell page in `withBudget(..., default, 4_000ms)`:

```ts
const [comparables, acrossStates, acrossCountries, nudge] = await Promise.all([
  withBudget(getComparableCells(...), [], 4_000, "getComparableCells"),
  withBudget(getSameIndustryAcrossStates(...), [], 4_000, "getSameIndustryAcrossStates"),
  withBudget(getSameIndustryAcrossCountries(...), [], 4_000, "getSameIndustryAcrossCountries"),
  withBudget(getNudgeNeighbor(cell), null, 4_000, "getNudgeNeighbor"),
]);
```

Also wrapped `getCellVariants()` with a 5s budget (slightly larger since variants drives the size/year switcher which the user notices missing).

## Worst-case render time after fix

- Wave 1: max(25s for cell, 5s for variants) = **25s**, but in practice the cell almost always returns in under 2s.
- Wave 2: max(4s, 4s, 4s, 4s) = **4s**, all parallel.
- Total: ~6s for a healthy DB, ~30s ceiling if both the primary cell query and one secondary query time out. Well under Vercel's 60s `maxDuration`.

## Verifier

`scripts/audit/cell_page_smoke.ts` hits 30 representative cell URLs (homepage-featured + high-traffic US + EU restaurants + random combinations) and reports per-URL TTFB plus pass/fail against the §3 hard targets:

- §3.1 median TTFB under 1.5s
- §3.2 p95 TTFB under 3s
- §3.3 zero 5xx / timeouts
- §3.4 zero Atlas not-found for navigator-generated URLs

Run via: `npm run audit:cell-smoke -- --base=https://www.marginatlas.com`

## What this exposes for the rest of the sanity sweep

This is exactly the class of bug §1 is designed to catch in regression: a critical user path silently degrading because nothing was watching the budget. The plausibility sweep and per-page audit framework that §1 builds will continue catching analogous issues.

## Follow-up actions (not blocking)

1. Audit every other route for unprotected `Promise.all`. Likely candidates: industry page, sector page, city page, calculator API.
2. Add a Supabase slow-query alert in the dashboard for queries over 2s on the `regional_cells` and `cells_master` tables.
3. Consider adding indexes on the comparable-cells join columns once we see which query was the actual offender (visible in the new console.warn logs).
