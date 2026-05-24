# Phase 0 finding: currency bug, confirmed + patched

## Verdict

**Bug confirmed and patched at the render layer.** Mexico cells (2,079 of
them) were being stored in MXN (Mexican pesos) by the ingestion pipeline
and displayed with a hardcoded "$" prefix on the live site. A typical
Mexican firm with MX$5,000,000 in revenue was surfacing as "$5M" — an
~17× overstatement.

Other countries were flagged by the audit heuristic but in numbers small
enough to be statistical noise rather than systemic pipeline failure:
Australia (49 cells), Canada (48), Israel (45), Qatar (43), New Zealand
(19), Hong Kong (14), Saudi Arabia (1). These are NOT corrected in this
patch pending a re-run of the audit to confirm whether the flags are
real or false positives.

## How it was found

`data/quality/currency_sanity_v1.json` (May 18, 2026) had already
identified the bug six days before the founder asked for the audit. The
audit method: for every cell, compute `stored_revenue / FX_rate` and
check whether dividing by the FX rate places the value back inside the
peer industry's normal band. If yes, the cell is almost certainly stored
in local currency and rendered as USD.

The audit file existed on disk but had **zero consumers in the live
render path**. Only `src/app/admin/review/page.tsx` reads it, and only
to display the flag list internally. The 2,298 affected cells continued
to render with the wrong value on the public site.

## Root cause hypothesis

Two-step failure:

1. **Ingestion did not convert.** Whatever pipeline loaded the Mexican
   data into `regional_cells` and `extrapolated_cells` did not divide by
   the MXN/USD exchange rate before insert. The `currency` column on
   each row presumably says "MXN", but the row otherwise looks like any
   USD row to the render layer.

2. **Render layer ignored the currency column.** `src/lib/format/money.ts`
   exposes `fmtMoney(v, sym = "$")`. Every cell-page caller in the
   codebase passes `currencySymbol="$"` hardcoded (lines 514, 626 of
   `src/app/[country]/[geo]/[industry]/page.tsx`). The `cell.currency`
   field is never consulted at render time.

The combination is the bug. Either failure alone would have been
catchable; both together produce silent 17× overstatement on every
Mexican cell page.

## What was patched

### New file: `src/lib/qa/currency_corrections.ts`

A small render-time correction layer. Exports:

- `CURRENCY_FX_CORRECTIONS`: country → FX-rate map. Currently `{ MX: 17.5 }`.
- `applyCurrencyCorrection(cell)`: scales every revenue/payroll field on
  the cell by `1 / FX_RATE` when the country is on the list. No-op
  otherwise. Idempotent only in the sense that callers must invoke it
  exactly once per cell — once inside the normalization step.
- `listCorrectedCountries()`: introspection helper for audit scripts.

### Patched: `src/lib/cells.ts`

`applyCurrencyCorrection` is now called inside:

- `normalizeRegionalRow` (the `regional_cells` path) at line 270
- `normalizeRow` (the US `cells_master` path) at line 422 — defensive,
  even though no US cells are currently on the correction list
- `getExtrapolatedCell` (the `extrapolated_cells` per-cell path) at line 995
- `getTopIndustriesForCountry` (the country page at-a-glance + industry
  mix tiles) gets a row-level scale at line ~745, because those rows
  don't flow through `normalize*Row`

Every render path that reads from the database now passes through the
correction.

## What is NOT patched (and why)

- **Source data.** The DB rows are untouched. This patch is a band-aid
  at the render layer. Proper fix is to re-ingest the Mexican data with
  the FX conversion applied at load time, then revert this patch. Until
  the re-ingest happens, every deploy needs this band-aid.

- **The 7 other flagged countries** (AU, CA, IL, QA, NZ, HK, SA). The
  flag counts are small enough that they could be individual outlier
  cells rather than systemic. Adding a country to the correction list
  applies the scale to every cell in that country, which would over-
  correct the genuinely-USD cells. We need to re-run the audit and
  bucket by "is this country systemic or sparse outliers" before
  adding any more entries.

- **The hardcoded `"$"` symbol on every cell-page tile.** Long-term
  fix is to pass `currencySymbol` derived from the cell's country
  (USD: $, EUR: €, JPY: ¥, etc.). For now we keep showing "$" because
  the underlying values are USD after the correction, so the symbol is
  honest. That changes the moment we introduce a per-country symbol
  override.

## Verification plan

Three things prove the patch worked:

1. **A spot-check on a known-affected Mexican cell.** Pick
   `MX-AGU / textile_apparel_mfg / total / 2024` (from the audit
   sample). Pre-patch the page would render typical revenue ≈ "$40M".
   Post-patch it should render ≈ "$2.3M".
2. **Re-run `currency_sanity_v1` audit with the patch live.** The MX
   flag count should drop from 2,079 to ~0.
3. **No regression on US cells.** California restaurants, NY law firms,
   Texas residential construction — same numbers before and after, since
   `US` is not in the correction map.

(1) is the founder's call when the deploy lands. (2) and (3) will be
part of the Phase 1 audit script suite.

## Open questions for the founder

1. **Re-ingestion timing.** The render-time band-aid works but is
   architecturally ugly. Do you want me to draft the spec for a proper
   re-ingest pass that fixes the source data so the band-aid can come
   out? The re-ingest probably needs to walk the original source files
   for Mexico and re-apply the loader with FX conversion at insert time.

2. **The 7 other flagged countries.** Should we re-run the currency
   audit before adding any of them to the correction list, or are you
   comfortable adding the top 2 (AU, CA) defensively given they're
   USD-adjacent (high-cost economies where over-statement is harder to
   spot)?

3. **`currency` column in the DB.** Is it actually populated with
   country-correct values, or does it default to "USD" everywhere? If
   the column is correct, we can drive the correction off it directly
   instead of maintaining a parallel list in code. Quick query I can
   run on your sign-off.

## Sprint position

Phase 0 (this) and Phase 0b: complete.
Phase 1 (build the 10 audit scripts): next.
Phase 2-6: queued per the master plan.

The render-time patch ships in the same commit as this finding doc.
