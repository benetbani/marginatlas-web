# 59 · Execution Prompt v10 — Autonomous Plan v10 Run

> Paste-ready prompt for a fresh Claude Code session to execute the
> WHOLE Plan v10 (Tracks PP-ZZ, 11 tracks, ~84 hours) autonomously.
> Founder is away. 600 MB RAM cap is absolute.

---

## The prompt (paste between BEGIN/END markers)

```
You are picking up the Margin Atlas Plan v10 execution run. The founder
has approved fully autonomous execution and is away. Do NOT ask
clarifying questions; make decisions and ship. RAM cap is 600 MB
absolute (R-009) — every Python script must wrap its main loop in
RamGuard(cap_mb=600).

STEP 1 — Read the planning context in this order:
  E:\atlas\website\docs\handoff\02_FOUNDER_PROFILE.md
  E:\atlas\website\docs\handoff\04_CURRENT_STATE.md
  E:\atlas\website\docs\handoff\10_NEVER_DO_RULES.md
  E:\atlas\website\docs\masterplan\PROGRESS.md
  E:\atlas\website\docs\masterplan\47_PLAN_V10_README.md

STEP 2 — Hard rules you MUST honour:
  - Never use the word "okay" in responses (founder explicit, flagged
    repeatedly).
  - Never reveal source agencies in user-visible text (R-002). The QQ
    tax-text review must NOT name PwC / OECD / national tax offices
    in any cell-page or tax-table notes the user reads; cite sources
    only inside .py / .json review-notes fields the user never sees.
  - Never use aquamarine / teal / cyan in UI (R-001). Warm-earth
    palette only: atlas, cream, parchment, moss, clay, cocoa, ink.
  - Never commit .env.local; never echo API keys (R-006, R-018).
  - Python ingest RSS cap 600 MB (R-009). Every script must use
    RamGuard(cap_mb=600); abort the script if it ever raises. For
    the WID parser specifically: stream the CSVs line-by-line and
    extract ONLY the (country, variable, year, value) tuples you
    need — never load full WID_data_XX.csv into memory (some files
    are 1M+ rows).
  - Sequential Python pipelines only (R-008). Do not run two heavy
    scripts in parallel against Supabase — connection contention
    causes Cloudflare TLS resets (see backfill_geo_names.py first run
    failing at MX-30-130).
  - tsc --noEmit + verify_taxonomy.ts + npm run lint before EVERY
    commit (R-010, R-013, R-024).
  - No "Coming soon" placeholders anywhere (R-016). New tax / cost
    sections render with real estimates + clear "estimate" labels,
    or they don't render at all.
  - Commit + push per phase (D-092). Never force push to main (R-012).
  - Idempotent scripts: every PATCH script must be safe to re-run.
    Use Session reuse + retry with exponential backoff + an optional
    START_AT_KEY env var for resume after connection drops (pattern
    from scripts/ingest/mx_inegi/backfill_geo_names.py).
  - Cost discipline (R-009 + R-008 spirit): Plan v10 is data + UI
    work; do NOT make new Anthropic API calls beyond the existing
    /api/ask path. No LLM lookups for tax rates or property data.

STEP 3 — Execution order. Run phases sequentially. Within a phase,
items in order. Commit + push after EACH item. RAM checked after each
phase.

Phase A — data foundations, no UI yet (~17 hr):
  A.1 Track VV — write src/lib/finance/industry_margins.json with
      curated gross margin + operating margin + asset intensity for
      every default-visible industry (~180 entries). Sources cited in
      a "source_notes" field that is NOT user-visible.
  A.2 Track XX part 1 — write src/lib/finance/property_tax_2024.json
      with one commercial property tax rate per country (146 entries
      matching country_rates_2024.json).
  A.3 Track XX part 2 — write src/lib/finance/commercial_rent_2024.json
      with USD/m²/year for the top 200 cities + a per-country median
      fallback section.
  A.4 Track YY — write src/lib/finance/operating_cost_multipliers_2024.json
      with per-country multiplier covering utilities + software +
      compliance overhead. ~146 entries.
  A.5 Track PP setup — write scripts/quality/parse_wid_gdp.py that
      streams the per-country files at
      C:\Users\benet\Downloads\wid_all_data\WID_data_XX.csv (845 files),
      extracts variable mnninc999i (real per-adult national income, EUR
      PPP) for the most recent available year per country, and writes
      scripts/quality/gdp_per_capita.json keyed by ISO2. Stream
      line-by-line — never load a full WID CSV into memory. Cap RSS
      at 200MB headroom even though limit is 600MB.
  A.6 tsc + verify_taxonomy + commit per file.

Phase B — sub-regional tax data (~22 hr):
  B.1 Track RR — write src/lib/tax/us_states_2024.json (51 states):
      state CIT, sales tax, PIT for pass-through, employer SUTA range,
      plus an embedded city_surcharges array per state (NYC UBT, SF
      gross receipts, Philadelphia BIRT, DC franchise, LA gross
      receipts, Portland CES, Chicago lease tax).
  B.2 Track SS — write the 9 sub-regional files:
      src/lib/tax/{gb,de,fr,it,es,ch,ca,au,br}_subregional_2024.json
      one at a time, commit per file. Germany Hebesatz table is the
      biggest single file; pull representative city Hebesatz for the
      top 30 German metros.
  B.3 New helpers getUsStateTaxRates(stateId) +
      getSubregionalTaxRates(iso2, regionId) in src/lib/tax.ts.
  B.4 PostTaxToggle reads sub-regional rate when geo_id matches a
      known state/region; falls back to country rate otherwise. Show
      combined "21% federal + 8.84% state = 29.84%" in the breakdown.
  B.5 CountryStatsStrip auto-detects the sub-region from the URL on
      sub-regional cell pages.

Phase C — cross-country plausibility (~11 hr):
  C.1 Track PP — write scripts/quality/scan_plausibility.py:
      • Pull regional_cells + extrapolated_cells revenue per
        (country, industry, size_band).
      • Join GDP/capita from scripts/quality/gdp_per_capita.json.
      • Per (industry, size_band) regress log(revenue) ~ log(GDPpc);
        flag residuals where |z| > 3.
      • Compute pairwise poorer-richer inversions (richer GDP/capita
        ratio > 1.5 but lower revenue/firm).
      • Output delivery/quality/plausibility_scan_v1.json +
        website/data/quality/plausibility_scan_v1.json.
  C.2 Track WW — extend CellWarningChips (already shipped in Plan v9)
      with a CrossCountryWarning variant that reads the plausibility
      JSON; render chip on flagged cell pages.
  C.3 Extend /admin/anomalies page with a "Cross-country" tab that
      surfaces the top 100 flagged cells with country, industry,
      revenue, expected revenue, z-score.

Phase D — fixed cost layer + net profit (~22 hr):
  D.1 Write src/lib/finance/fixed_costs.ts — estimateFixedCosts(cell)
      returns {rent, property_tax, insurance, utilities, software,
      other}. Uses VV margins + XX rent + XX property_tax + YY
      multipliers.
  D.2 Write src/lib/finance/net_profit.ts — estimateNetProfit(cell)
      returns the full waterfall: revenue → COGS → gross_profit →
      payroll → employer_social → operating_profit → fixed_costs →
      pre_tax_profit → cit → net_profit.
  D.3 Track TT — new <FixedCostsBreakdown> component renders below
      PostTaxToggle on cell pages. Each line clearly labeled "estimate".
  D.4 Track UU — extend PostTaxToggle (or replace with new
      <NetProfitWaterfall>) showing the full 13-row breakdown when
      expanded.
  D.5 Track ZZ — new <NetProfitWaterfallVisual> server-renders a
      horizontal stacked-bar SVG showing the waterfall (revenue at
      top, deductions in warm tones, owner take in atlas-amber).
  D.6 Update CellDataset JSON-LD so the new operating-profit and
      net-profit numbers show up in structured data (additional
      PropertyValue entries).

Phase E — per-country tax text quality (~12 hr):
  E.1 Add `vat` (number) + `pit_range` (string) fields to the JSON
      schema. Bulk-update all 146 entries with VAT rate and SMB-
      relevant PIT bracket range.
  E.2 Track QQ — walk the 146-country table and rewrite each `notes`
      field to a consistent 2-4 sentence format covering: headline
      CIT, SMB alternative rate (if any), one common deduction lever,
      VAT, PIT range. Process in commits of ~25 countries each so the
      review is incremental.

Phase F — observability + handoff (~2 hr):
  F.1 Re-run scripts/quality/audit_coverage.py to capture the new
      sub-regional data.
  F.2 Re-run scripts/quality/write_coverage_md.py to refresh
      docs/ingest/COVERAGE_AUDIT_v2.md.
  F.3 Run scripts/quality/scan_anomalies.py +
      scripts/quality/update_quality_10.py one final time so the
      anomaly + plausibility flagging composes cleanly.
  F.4 Update docs/handoff/04_CURRENT_STATE.md + PROGRESS.md with the
      Plan v10 landings (commits + row deltas + new files).
  F.5 Final commit + push.

STEP 4 — When to pause:
  - Founder dependency (Supabase SQL migration, schema column add) →
    document in PROGRESS.md + docs/handoff/06_FOUNDER_TODO_V10.md,
    skip, continue.
  - Destructive operation (rm -rf, drop column, force push) → never
    without founder approval.
  - tsc OR verify_taxonomy fails → fix at source. Do not commit until
    clean.
  - RAM peak approaches 600 MB → abort that script, document, reduce
    batch size, re-run.
  - Plausibility scan flags > 5000 cells (10%+ of rows) → STOP the
    quality-update flow. Almost certainly a calibration bug in
    scan_plausibility.py. Inspect samples before touching production
    quality_score values.
  - WID parsing exceeds 200 MB RSS on a single file → switch to
    csv.reader with explicit line iteration; do NOT use pandas
    read_csv on the full WID files.

STEP 5 — Reporting:
  After each phase: one-paragraph commit message; no founder summary
  required mid-stream.
  After ALL phases: post a final summary covering:
    - rows changed in Supabase
    - new components shipped
    - new data tables on disk
    - number of cross-country anomalies caught
    - number of cells flagged by plausibility
    - any blockers documented in docs/handoff/06_FOUNDER_TODO_V10.md

STEP 6 — Execution starts immediately after reading STEP 1-5.
  Do NOT confirm. Do NOT ask. Begin Phase A.1 directly.

That's the bootstrap. Execute.
```

---

## Notes for the operator who pastes this

### Phases at a glance

| Phase | Theme | Wall time | RAM-bounded? |
|---|---|---|---|
| A | Data foundations (4 new JSON files + WID parser) | ~17 hr | yes (WID parser explicit) |
| B | Sub-regional tax (US + 9 countries) | ~22 hr | no (JSON authoring) |
| C | Cross-country plausibility scanner + UI | ~11 hr | yes (Supabase pagination) |
| D | Fixed costs + net profit waterfall | ~22 hr | no (pure UI + logic) |
| E | 146-country tax text review | ~12 hr | no (JSON edits) |
| F | Refresh audits + PROGRESS log | ~2 hr | yes (existing scripts) |

### WID dataset note

`C:\Users\benet\Downloads\wid_all_data\` is the World Inequality
Database export the founder downloaded for this run. Use variable
`mnninc999i` (real per-adult national income in EUR PPP) as the
GDP/capita proxy. Some country CSVs are 1M+ rows — always stream.

### Founder dependency carve-outs

Most of Plan v10 is data + UI work that needs no founder action. The
two items that may need them:
- Schema additions (new fields on Supabase tables) → not strictly
  needed; the new JSON tables live in the repo, not Supabase.
- Net-profit numbers exposed via the public API → defer until Plan v9
  Track NN ships.

### Final state after Plan v10

- 146 country tax narratives reviewed, with VAT + PIT brackets.
- 51 US states + ~20 US cities have specific tax overlay.
- 9 multi-region countries have sub-regional tax overlay.
- Every cell page shows a 13-row net-profit waterfall.
- Cross-country plausibility scanner flags implausible cells with
  references to the GDP/capita regression that flagged them.
- 4 new data files in src/lib/finance/.
- 1 new data file in scripts/quality/gdp_per_capita.json.
- 11 new sub-regional tax JSON files.
- Coverage audit and tax narrative regenerated.
