# 29 · Execution Prompt v8 — Autonomous Plan v7+v8 Run

> Paste-ready prompt for a fresh Claude Code session to execute the
> WHOLE Plan v8 (Tracks R-Y plus completion of unfinished Plan v7
> items P/M) autonomously. Founder is away for several hours.

---

## The prompt (paste between BEGIN/END markers)

```
You are picking up the Margin Atlas Plan v8 execution run. The founder
has approved fully autonomous execution and will not be reachable for
several hours. Do NOT ask clarifying questions; make decisions and ship.

STEP 1 — Read the planning context in this order:
  E:\atlas\website\docs\handoff\02_FOUNDER_PROFILE.md
  E:\atlas\website\docs\handoff\04_CURRENT_STATE.md
  E:\atlas\website\docs\handoff\10_NEVER_DO_RULES.md
  E:\atlas\website\docs\masterplan\PROGRESS.md
  E:\atlas\website\docs\masterplan\21_TRACK_R_EXTRAPOLATION_BLITZ.md
  E:\atlas\website\docs\masterplan\22_TRACK_S_HOMEPAGE_UPGRADES.md
  E:\atlas\website\docs\masterplan\23_TRACK_T_SECTION_PAGES.md
  E:\atlas\website\docs\masterplan\24_TRACK_U_QUALITY_SCORE_1_TO_10.md
  E:\atlas\website\docs\masterplan\25_TRACK_V_INFRASTRUCTURE.md
  E:\atlas\website\docs\masterplan\26_TRACK_W_O_AND_Q_COMPLETION.md
  E:\atlas\website\docs\masterplan\27_TRACK_X_COVERAGE_AUDIT.md
  E:\atlas\website\docs\masterplan\28_TRACK_Y_TOP_200_CITIES.md

STEP 2 — Hard rules you MUST honour:
  - Never use the word "okay" in responses (founder explicit, flagged
    multiple times)
  - Never reveal source agencies in user-visible text (R-002)
  - Never use aquamarine / teal / cyan in UI (R-001)
  - Never commit .env.local; never echo API keys (R-006, R-018)
  - Python ingest RSS cap 600 MB (R-009); sequential pipelines only (R-008)
  - tsc --noEmit + verify_taxonomy.ts + npm run lint before EVERY commit (R-010, R-013, R-024)
  - No "Coming soon" placeholders (R-016)
  - Lorem Ipsum is acceptable for editorial copy slots (founder explicit 2026-05-18)
  - Generic coverage_source strings only (R-002 — "National business
    statistics", "European business statistics", etc.)
  - Commit + push per phase (D-092); never force push to main (R-012)

STEP 3 — Execution order (recommended). Run sequentially. Commit + push
after EACH item. Use ScheduleWakeup for long-running background ingest.

Phase A — quick foundations (~3 hours):
  A.1 Apply Track U SQL migration (003_quality_10.sql) — run in
      Supabase SQL editor OR via psql/REST; backfill quality_10 column
      on all 3 tables from quality_score / 10
  A.2 Track U: Cell type update + QualityDots component + replace
      QualityBadge usages on cell page + country page
  A.3 Track V.4: write /api/debug-env/route.ts; push; curl production
      to diagnose ANTHROPIC_API_KEY visibility; remove debug route
      after diagnosis
  A.4 Track V.1: split sitemap into index + cell sub-sitemaps; filter
      to quality_10 >= 4

Phase B — extrapolation blitz (~4 hours):
  B.1 Track R audit script (E:\atlas\scripts\audit_extrapolated_coverage.py
      extension) — list which countries have/need data
  B.2 Track R proxy table — decide per country: proxy_iso3 + scale
  B.3 Write scripts/ingest/city_overlay/fetch_wave4.py with WAVE4_COUNTRIES
      (~60 entries spanning all tiers R.1-R.8 in Track R doc)
  B.4 Run pipeline; expect +30-50k rows
  B.5 Backfill quality_10 per row based on scaling factor
  B.6 Add new countries to taxonomy.ts COUNTRIES list (~60 new entries)
  B.7 Extend country_rates_2024.json to ~120 countries

Phase C — UI surface area (~4 hours):
  C.1 Track S.3 Featured tiles refresh (mix measured + new + tax + quality dots)
  C.2 Track S.2 Global coverage strip
  C.3 Track S.6 Tax overlay teaser section
  C.4 Track S.7 Quality legend
  C.5 Track T.1 Country page enhancements (neighborhood + tax + quality)
  C.6 Track W.3 Geo dispatcher route (country/[geo]/page.tsx for cities + regions)
  C.7 Track W.8 Navigator adaptation (optional fields, adaptive CTA)

Phase D — completion + audit (~2 hours):
  D.1 Track X.1 audit script
  D.2 Track X.2 coverage doc
  D.3 Update PROGRESS.md + docs/handoff/04_CURRENT_STATE.md with all
      Plan v8 landings
  D.4 Final commit + push

STEP 4 — When to pause:
  - Founder dependency required (Vercel env vars, source CSV downloads)
    → document in PROGRESS.md, skip, continue with next item
  - Destructive operation (rm -rf, drop table) → never do without
    founder approval
  - tsc OR verify_taxonomy fails → fix at source; do not commit until clean
  - RAM peak approaches 600 MB → abort that phase, document, continue elsewhere

STEP 5 — Reporting:
  After each phase: brief one-paragraph commit message; no founder summary
  required between phases.
  After ALL phases: post final summary covering rows added, components
  shipped, blockers documented.

STEP 6 — Execution starts immediately after reading STEP 1-5.
  Do NOT confirm. Do NOT ask. Begin Phase A.1 directly.

That's the bootstrap. Execute.
```

---

## Notes for the operator who pastes this

### When founder is available again

After founder returns, brief them on:
- regional_cells row count delta
- New countries added
- New UI components live
- Any unresolvable blockers (Indonesia BPS, France Sirene status, /ask
  production fix outcome)

### If a phase fails or stalls

- Phase A.1 SQL migration: if Supabase SQL editor isn't accessible
  without founder, defer A.1 and rest of Track U; continue with Track R
- Phase B.3 pipeline: if a proxy country is itself missing, fall through
  to a deeper proxy chain — document in script comments
- Phase C any UI work: if tsc fails, fix at source; do not skip
- Phase V.4 /ask diagnostic: if blocked on production deploy access,
  add `/api/debug-env` and leave for founder to test

### RAM monitoring

Every Python script uses `RamGuard(cap_mb=600)`. If it ever raises:
- Abort that script
- Reduce batch size or stream more
- Re-run

### Final state expected after full Plan v8

- regional_cells: ~356k → ~420k+ rows
- COUNTRIES: 49 → ~110
- top200.json locked at v2.0.0 (200 entries)
- Quality 1-10 system live across all cells + UI
- Home page enhanced with 6+ new sections
- Coverage audit doc + /coverage public page

---

## Alternative shorter prompts

For per-track execution (one track at a time):

```
Execute Track R from E:\atlas\website\docs\masterplan\21_TRACK_R_EXTRAPOLATION_BLITZ.md
Honour the never-do rules in docs/handoff/10_NEVER_DO_RULES.md.
Commit + push at completion. Update PROGRESS.md.
```

Replace `R` with `S / T / U / V / W / X / Y` for other tracks.

For verification-only:

```
Run smoke test on 200 random cell URLs sampled from regional_cells.
Report pass rate by quality_10 tier. Do not modify code; report only.
```
