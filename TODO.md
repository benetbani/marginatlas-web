# TODO — session 2026-05-28

Source of truth for this session's work. Marker key: `[ ]` open, `[~]` in progress, `[x]` done (must include verification note).

Authoritative context: `docs/handoff/2026-05-27-session-handoff.md` (yesterday's handoff), `docs/design-system/GUIDELINES.md` (rules), `CLAUDE.md` (this-session pointers).

User constraints for this session:
- Careful upgrade, do not break current structure
- Backend + data filling focus; mobile fixes deferred to a later session
- NOT salaries
- Ask before running `npm run prebuild`, `npm run prebuild:serial`, `npm run build`, or `npx tsc --noEmit`
- Commit between phases; phases capped at ~15 files

---

## Phase A — Homepage em-dash sweep (content)

- [ ] Read `scripts/verify_no_em_dashes.ts` to understand what the gate scans — file(s) affected: scripts/verify_no_em_dashes.ts
- [ ] Grep homepage source tree for em-dash characters — file(s) affected: src/app/page.tsx + composed sections
- [ ] Identify whether em-dashes leak from source, data, or content/blog markdown
- [ ] Replace with period/comma/colon in source; if data-sourced, fix at the data layer
- [ ] Verify gate catches what was missed (or document a gate gap)

Verification: `npx tsx scripts/verify_no_em_dashes.ts` (ask first) + spot-check homepage source.

## Phase B — Profit waterfall percentage sanity (data)

- [ ] Find waterfall component(s) — likely `src/components/SmartWaterfall.tsx` and any sibling
- [ ] Trace where percentages come from in data layer
- [ ] Add 0-100 clamp or fix the math producing out-of-range values
- [ ] Add a test/assertion if a sanity gate exists; otherwise document
- [ ] Confirm D8 assertion would now pass

Verification: source change + reasoning in commit; live verification deferred (no dev server this session).

## Phase C — cells.ts decomp Pt 1: `cells/_internal.ts`

- [ ] Identify shared private helpers in `cells.ts`: `applyRollforward`, `applyTaxonomy`, `normalizeRow`, `normalizeRegionalRow`, and any others
- [ ] Extract to `src/lib/cells/_internal.ts` with module-private exports
- [ ] Update `cells.ts` to import from `./cells/_internal`
- [ ] Confirm no external import surface changes

Verification: `npx tsc --noEmit` (ask first). Stop if anything else feels off.

## Phase D — cells.ts decomp Pt 2: `cells/lookup.ts`

- [ ] Extract the `getCellBySlug*` chain to `src/lib/cells/lookup.ts`
- [ ] Re-export from `cells.ts` so external consumers stay unchanged
- [ ] Confirm `verify_layering` still passes

Verification: `npx tsc --noEmit` + import audit. Ask before running.

## Phase E — cells.ts decomp Pt 3: `cells/synthesis.ts` + `cells/variants.ts`

- [ ] Extract `synthesis.ts` (cell synthesis when raw row missing)
- [ ] Extract `variants.ts` (getCellVariants and friends)
- [ ] Re-export from `cells.ts`
- [ ] Target: cells.ts shrinks to a thin re-export shell

Verification: `npx tsc --noEmit` + `npm run prebuild` (ask first).

## Phase F — Data-filling scoping (no code)

- [ ] Read `src/lib/quality/coverage-report.ts` to find website-side gaps
- [ ] Cross-reference with parent-project `E:\atlas\` ledger to see what's available but unloaded
- [ ] Cross-reference with the "What I deferred" lists in `E:\atlas\HANDOFF-v1.16.md`
- [ ] Produce a "fillable gaps + effort" report; no execution this session
- [ ] Add the report to `docs/handoff/2026-05-28-data-filling-scope.md`

Verification: report exists with concrete recommendations.

---

## HANDOFF STATE

Last commit: 154e7f9 (website) — data-activation plan
Current phase: Pivoted to data-access planning per user /writing-plans request
Next task: User to choose execution mode (subagent-driven vs inline) for docs/superpowers/plans/2026-05-29-data-activation.md
Known issues:
  - Em-dash gate (verify_no_em_dashes) scans src/ only; 42 blog markdown files in content/blog/ carry em-dashes that leak to the homepage rail via getAllPosts() frontmatter (excerpt/title). Root cause of QA C7 failure. NOT yet fixed.
  - regional_cells + extrapolated_cells Supabase tables are EMPTY; entire non-US site is synthesized. This is the subject of the new plan.
Canonical patterns: see CLAUDE.md + docs/design-system/GUIDELINES.md
Build status: presumed passing (last verified 2026-05-27 in handoff); not re-run this session

## DONE THIS SESSION
- [x] Homepage em-dash sweep — verified by: gate `npx tsx scripts/verify_no_em_dashes.ts` exits 0; 97 em-dashes across 42 content/blog/*.md replaced; gate extended to scan content/blog markdown. Commit 7a3f9c2.

## DEFERRED FROM ORIGINAL SESSION PLAN (not done)
- Phase B — Profit waterfall percentage sanity (D8) — not started
- Phase C/D/E — cells.ts decomposition — NOT started; NOTE recon confirmed cells.ts does NOT import the phantom _internal/_budget/synthesis modules, so it is not in a broken state
- Mobile fixes — deferred per user ("avoid" this session)

## SESSION OUTPUT
- Created CLAUDE.md + TODO.md at website root
- Wrote docs/superpowers/plans/2026-05-29-data-activation.md (1018 lines, 6-phase plan)
- Fixed em-dash QA C7 (commit 7a3f9c2 website)
- Executed Phase 0 (ground truth, read-only) — LIVE DB CONFIRMED:
  - cells_master = 722,242 rows, US only
  - regional_cells = 0 (EMPTY)
  - extrapolated_cells = 0 (EMPTY)
  - extrapolated_cells.parquet = 57,816 rows / 218 countries / 44 industries, 1:1 match for the empty table
  - 44 industry_ids known: restaurants, software-development, legal-services, hotels-lodging, accounting-bookkeeping, bakeries-pastries, etc.
  - Phase 0 scripts committed to parent repo E:/atlas (commit 8d31f44): scripts/verify_supabase_counts.py, scripts/inspect_parquet.py
- Key finding: site has rich data-access code but 2 of 3 data tables are empty; "reaching the data" = loading extrapolated_cells (immediate unlock, ~3 min) + building regional_cells ETL (larger)

## !! PREMISE CORRECTED — data is ALREADY loaded and reachable !!
Live Supabase Pro query (2026-05-29) contradicts the stale handoff:
  - cells_master      = 722,432 (US)
  - regional_cells    = 376,033 rows / 127 countries / 78 industries / 80% quality>=70 / 2018-2025
  - extrapolated_cells= 239,527 rows / 259 countries / 236 industries / 2018-2024
Live data is RICHER than any parquet on disk (extrap has 236 industries vs 44 in v1.19.0 parquet).
Identifiers MATCH: taxonomy .id underscored == regional_cells.industry_id; geo_id round-trips via regionalSlugToGeoId.
Featured tuples resolve at quality 80-85. NO reachability bug. NO unused-data-on-disk problem.

DID NOT run the extrapolated load (user had approved it) because the live table has 239k rows vs the
parquet's 57k — the TRUNCATE+load would have DESTROYED ~180k live rows. Correct call to abort.

User confirmed: Supabase Pro + Vercel Pro, both paid.

## REVISED NEXT STEPS (load phases obsolete; these remain)
  1. Reachability audit (READ-ONLY): probe representative routes through getCellBySlug, measure the REAL
     synthesis rate now. Proves how much of the site already serves real data.
  2. Synthesis-gap report: which high-traffic (country, geo, industry) routes STILL synthesize despite
     376k regional + 239k extrapolated rows? That gap is the actionable work.
  3. Surface depth: generateStaticParams is 24 hardcoded tuples; prerender top real routes. Coverage page
     + data-vintage line should reflect the real loaded counts.
  4. Lock the gain: synthesis-budget prebuild gate so coverage can't silently regress.
  5. Carry-over quality items: profit waterfall D8 sanity, etc.
Obsolete (do NOT run): plan Phase 2 (load extrapolated), plan Phase 5 (build regional ETL) — already in prod.
