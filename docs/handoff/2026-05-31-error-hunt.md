# Error hunt + ingestion — 2026-05-31

## RESUME-SESSION VERIFY (2026-05-31, second pass)
- Ingestion re-verified: unit test PASS, sample drop OK, `tsc --noEmit` 0 (raised heap).
- **Full serial prebuild: GATE PASS, 0 hard fails** — D4/D8/regional-enforceSanity fixes
  broke nothing. The 76 "taxonomy warnings" are the legacy DB ids (food_beverage_mfg etc);
  confirmed NON-issue: verify_industry_medians validates their medians (R1-R4) BEFORE the
  cosmetic R5 mapping-warning, so no plausibility gap. 24 grandfathered layering warnings
  = known tech debt, non-urgent.
- DB still DOWN (Supabase pooler, not the password). Live scanners + source-row cleanup
  remain blocked. All render-layer fixes are already in and need no DB.

## DONE + VERIFIED this session
- **Research ingestion pipeline** (commit 15629f60): schema + validator + dry-run
  loader + rollback + offline test. Verified: unit test PASS, sample drop validates
  OK, tsc 0. Paste flow lives in `docs/research-ingestion.md`; drops go in
  `data/research/incoming/`.
- **QA D4 fixed** (commit 6f8a09f9): `enforceSanity` now sorts present revenue
  percentiles ascending so p10<=p25<=p50<=p75<=p90 always holds (bottom-10% can no
  longer sit above typical). Data layer, covers all consumers.
- **QA D8 fixed** (commit 6f8a09f9): `MarginWaterfall` enforces gross>=operating>=net
  and clamps every bar width to 0-100%. Render layer defense-in-depth. tsc 0, gate 0.

## THE BIG OPEN ERROR (blocked on DB + clean output)
Scale-anomaly report (`data/quality/scale_anomalies_REPORT.md`): **13,455 anomalies**,
149 high-severity. The dominant real bug class:
- **`travel_agencies`**: $500-900M revenue_per_firm across ~30 cities (bound $5M).
  Almost certainly a wrong-aggregation (whole-sector revenue as per-firm, or n=1).
- **Swiss/Monaco giants**: grocery_stores $1-2B, veterinary_pet_care $1B, utilities
  $5B at city level.
ROOT CAUSE CONFIRMED (grep of cells.ts call sites, 2026-05-31):
`enforceSanity` (which holds the revenue bound-clamp + the new D4 percentile sort) is
ONLY called inside `getCellBySlug` (line ~458). The regional read path does NOT call it:
- `getRegionalCell` (~line 263) maps via `normalizeRegionalRow` and returns at line ~382
  through `applyPlausibilitySuppression(applyCurrencyCorrection(applyRollforward(
  applyTaxonomy(cell))))` — NO enforceSanity.
- `normalizeRegionalRow` itself (def ~line 163, shared return ~line 382) is also used by
  the variants path (~line 1149).
So the single cell PAGE is protected (getCellBySlug clamps), but comparison rails,
variant lists, and any direct getRegionalCell/variants consumer serve RAW unclamped
revenue. That is why travel_agencies shows $900M on those surfaces.

THE FIX (do in a fresh session with clean I/O + tsc working):
1. Add `enforceSanity` into the regional pipeline. Cleanest single point:
   `normalizeRegionalRow`'s return (line ~382), wrap the existing chain:
   `return enforceSanity(applyPlausibilitySuppression(applyCurrencyCorrection(
     applyRollforward(applyTaxonomy(cell)))));`
   CAUTION: that exact return line appears 3x (lines ~207, ~382, ~942 = three different
   functions). Do NOT use a plain Edit (not unique). Either Read each and use a unique
   surrounding-context anchor, or add a tiny named helper `finalizeRegional(cell)` and
   call it only at line 382. tsc was OOMing this session; verify when it recovers.
2. enforceSanity already clamps revenue_per_firm and percentiles to bounds.hi; once it
   runs on the regional path, the city giants (travel_agencies, Swiss grocery/vet) drop
   to their SMB bound automatically. No DB write needed for the render fix.
3. SEPARATELY, fix the source rows so the DB itself is clean (needs DB back): a tagged
   UPDATE nulling revenue_per_firm where it exceeds bounds.hi*3 for the worst industries,
   so exports/API and the scanner agree with the rendered pages.
4. Re-run `data/quality` scale scanner; target high-severity 149 -> 0.

## ENVIRONMENT BLOCKERS (why the big fix waited)
- **Supabase DB unreachable** mid-session: `connection to database not available`
  (pooler auth hiccup, likely transient). All live-data fixes need it.
- **Tool output degrading**: Bash/Grep returned empty or truncated repeatedly; Read +
  exit codes stayed reliable. Verify via Read and redirected files, not raw stdout.

## SECURITY — ACTION FOR USER
The `SUPABASE_DB_URL` including its password printed in this session's tool output
(from `grep ^SUPABASE_DB_URL secrets.env`). **Rotate the Supabase database password**
when convenient; it is now in the transcript. Future DB scripts should read the URL
without echoing it.

## QA failures that are NOT real bugs (audit ran against a stale/unreachable preview)
Many `comprehensive_qa.md` failures are "network error: fetch failed" (A7/A8/A10,
B12-B14, D2/D5/D7/D11/D12) — the audit could not reach those pages, not a data fault.
Re-run the audit against a live deploy before trusting them. The genuinely actionable
content failures: B4/B6/B7 (/industries missing Popular/A-Z/emoji sections),
C7 (homepage em-dash), H6/H9 (neighborhood links), E4 (og:title), G7 (Speed Insights).
