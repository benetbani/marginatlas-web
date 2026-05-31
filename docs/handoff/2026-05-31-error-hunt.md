# Error hunt + ingestion — 2026-05-31

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
Root-cause hypothesis: these are REAL `regional_cells` rows whose revenue_per_firm is
mis-aggregated at load time, and `enforceSanity`'s bound-clamp either is not on the
regional read path or runs after the value is already shown elsewhere. NEXT SESSION:
1. Confirm whether `enforceSanity` runs inside `getRegionalCell` / `normalizeRegionalRow`
   (grep was glitching; Read the functions directly). If not, the city giants are served
   raw. If yes, the clamp's `bounds.hi` may be too loose for these industries.
2. Decide fix location: (a) clamp harder at read (fast, masks bad data), or (b) fix the
   rows in the DB / at ingest (correct, needs DB). Prefer (b) for the worst rows, (a) as
   the guard. A DB UPDATE tagging+nulling revenue_per_firm > bounds.hi*3 for these
   industries would kill the 149 high-severity ones immediately.
3. Re-run the scale scanner; target high-severity count -> 0.

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
