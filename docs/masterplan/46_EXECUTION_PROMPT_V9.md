# 46 · Execution Prompt v9 — Autonomous Plan v9 Run

> Paste-ready prompt for a fresh Claude Code session to execute the
> WHOLE Plan v9 (Tracks AA-OO, 15 tracks, ~165-195 hours) autonomously.
> Founder is away. Make decisions and ship.

---

## The prompt (paste between BEGIN/END markers)

```
You are picking up the Margin Atlas Plan v9 execution run. The founder
has approved fully autonomous execution and will not be reachable for
several hours. Do NOT ask clarifying questions; make decisions and ship.

STEP 1 — Read the planning context in this order:
  E:\atlas\website\docs\handoff\02_FOUNDER_PROFILE.md
  E:\atlas\website\docs\handoff\04_CURRENT_STATE.md
  E:\atlas\website\docs\handoff\10_NEVER_DO_RULES.md
  E:\atlas\website\docs\masterplan\PROGRESS.md
  E:\atlas\website\docs\masterplan\30_PLAN_V9_README.md
  E:\atlas\website\docs\masterplan\31_TRACK_AA_QUALITY_VERIFICATION.md
  E:\atlas\website\docs\masterplan\32_TRACK_BB_HOMEPAGE_COMPLETION.md
  E:\atlas\website\docs\masterplan\33_TRACK_CC_LOGIC_AND_BUG_FIXES.md
  E:\atlas\website\docs\masterplan\34_TRACK_DD_SEO_AND_OG.md
  E:\atlas\website\docs\masterplan\35_TRACK_EE_PERFORMANCE.md
  E:\atlas\website\docs\masterplan\36_TRACK_FF_SECTION_PAGES.md
  E:\atlas\website\docs\masterplan\37_TRACK_GG_COVERAGE_AUDIT.md
  E:\atlas\website\docs\masterplan\38_TRACK_HH_TOP_1000_CITIES.md
  E:\atlas\website\docs\masterplan\39_TRACK_II_AUTH_AND_STRIPE.md
  E:\atlas\website\docs\masterplan\40_TRACK_JJ_ANALYTICS.md
  E:\atlas\website\docs\masterplan\41_TRACK_KK_WAVE4_CITY_OVERLAY.md
  E:\atlas\website\docs\masterplan\42_TRACK_LL_DISTRIBUTION_REFINEMENT.md
  E:\atlas\website\docs\masterplan\43_TRACK_MM_LOCALIZATION.md
  E:\atlas\website\docs\masterplan\44_TRACK_NN_PUBLIC_API.md
  E:\atlas\website\docs\masterplan\45_TRACK_OO_TESTING.md

STEP 2 — Hard rules you MUST honour:
  - Never use the word "okay" in responses (founder explicit, flagged
    multiple times across sessions)
  - Never reveal source agencies in user-visible text (R-002 — use
    generic strings like "National business statistics")
  - Never use aquamarine / teal / cyan in UI (R-001 — warm-earth-tone
    palette only: atlas, cream, parchment, moss, clay, cocoa, ink)
  - Never commit .env.local; never echo API keys (R-006, R-018)
  - Python ingest RSS cap 600 MB (R-009); sequential pipelines only (R-008)
  - tsc --noEmit + verify_taxonomy.ts + npm run lint before EVERY commit
    (R-010, R-013, R-024)
  - No "Coming soon" placeholders (R-016)
  - Lorem Ipsum is acceptable for editorial copy slots (founder explicit
    2026-05-18)
  - Commit + push per phase (D-092); never force push to main (R-012)
  - Founder-dependency items (Stripe dashboard, Supabase Auth toggle,
    Sentry account, Plausible signup) → stage code + document in
    PROGRESS.md, do not block on these

STEP 3 — Execution order (recommended). Run sequentially within each
phase; commit + push after EACH item. Use ScheduleWakeup for any
long-running background ingest or build.

Phase A — high-leverage bug fixes + quality scan (~6 hours):
  A.1 Track CC.1 — fix slugToIndustry() fuzzy match bug (metal→mining).
      Replace includes() with exact-token match + alias map. Add unit
      test for /de/munich/metal-products-mfg → "Metal Products Mfg".
  A.2 Track CC.2 — Mexico CDMX alcaldía name fixes (Cuauhtémoc not
      Cuauhtemoc, etc.) — UTF-8 + accent normalization in lookups.
  A.3 Track CC.5 — Smart 404 page with nearest-match suggestions.
  A.4 Track AA.1-AA.4 — anomaly detection scan across regional_cells +
      extrapolated_cells: outlier values (z-score > 4), monotonicity
      violations, suspicious zeros, cross-source disagreements. Output
      report to docs/quality/anomaly_scan_v1.md.
  A.5 Track AA.5-AA.7 — auto-flag bad cells with quality_10 reduction;
      add /admin/anomalies dashboard.

Phase B — home page completion (~8 hours):
  B.1 Track BB.1 — hero rewrite (founder voice, no Lorem Ipsum in hero).
  B.2 Track BB.2 — "what's new" strip (last 10 data refreshes by country).
  B.3 Track BB.3 — country chips + sector chips below hero.
  B.4 Track BB.4 — Cmd+K global search on home (cell, city, country,
      sector autocomplete).
  B.5 Track BB.5 — footer redesign (sitemap links, /coverage, /about,
      /api, social).
  B.6 Track BB.6-BB.10 — remaining home sections per Track BB doc.

Phase C — performance + SEO (~12 hours):
  C.1 Track EE.1 — ISR tiering per cell quality (tier 1 = 1h, tier 5 = 7d).
  C.2 Track EE.2 — build-time precompute for top 5k cells.
  C.3 Track EE.3-EE.6 — edge runtime audit, image opt, bundle audit.
  C.4 Track DD.1 — per-cell OG images (Vercel OG + cell stats).
  C.5 Track DD.2 — JSON-LD enrichment per cell (Organization +
      StatisticalPopulation schemas).
  C.6 Track DD.3-DD.6 — canonical tags, internal linking, hreflang
      scaffolding, sitemap-index split.

Phase D — section pages + coverage (~16 hours):
  D.1 Track FF.1 — /world map page (server-rendered SVG + quality fill).
  D.2 Track FF.2 — country page tax + neighborhood + quality enrichment.
  D.3 Track FF.3 — sector cross-country view.
  D.4 Track FF.4 — compare upgrades (3-cell side-by-side + delta dots).
  D.5 Track FF.5 — browse page rebuild.
  D.6 Track GG.1-GG.5 — coverage audit script + /coverage page +
      per-country /coverage/[iso2] scorecard.

Phase E — Wave 4 city overlay (~8 hours):
  E.1 Track KK — capital + 3-5 major cities for each of 142 new
      countries. Pipeline at scripts/ingest/city_overlay/fetch_wave4.py.
      Expect +30-50k regional_cells rows.
  E.2 Backfill quality_10 per row.
  E.3 Verify CityPicker covers new cities.

Phase F — top-1000 cities + distribution (~30 hours):
  F.1 Track HH.1-HH.6 — source UN/OECD/Brookings; build top1000.json
      v3.0.0; migrate consumers; write /cities directory page.
  F.2 Track HH.7-HH.8 — per-city URL /cities/{slug}.
  F.3 Track LL.1-LL.5 — bootstrap CIs on distributions, Pareto tail
      modeling, YoY deltas, industry-mix sankey.

Phase G — analytics + testing foundation (~25 hours):
  G.1 Track JJ.3 — /ask cost monitoring (Supabase ask_queries table +
      hard cap at $200/mo).
  G.2 Track JJ.5 — /status page.
  G.3 Track JJ.6 — /admin/queries dashboard.
  G.4 Track OO.4 — unit tests for critical helpers (score100to10,
      regionalSlugToGeoId, slugToIndustry, estimatePostTax,
      getCellBySlug).
  G.5 Track OO.3 — TypeScript strict tightening (noUncheckedIndexedAccess
      + noPropertyAccessFromIndexSignature; fix all errors).
  G.6 Track OO.1 — Playwright E2E smoke tests.
  G.7 Track OO.5-OO.6 — CI pipeline + pre-commit hooks.

Phase H — staged for founder action (do NOT block, prepare code only):
  H.1 Track II — Auth + Stripe scaffolding (all code; founder runs
      Supabase Auth toggle + Stripe dashboard setup + adds keys).
      Document founder TODO list in docs/handoff/05_FOUNDER_TODO_V9.md.
  H.2 Track JJ.1, JJ.2, JJ.4 — Vercel Analytics enable (founder),
      Plausible signup (founder), Sentry signup (founder). Wire up
      code paths so flipping the keys in env vars lights them up.
  H.3 Track MM — Localization scaffolding (next-intl install + en
      baseline strings + currency display switcher). Translation
      content deferred to founder review.
  H.4 Track NN — Public API skeleton (rate-limited /api/v1/cells +
      OpenAPI YAML). Full SDK release deferred to post-launch.

STEP 4 — When to pause:
  - Founder dependency required (Supabase SQL, Vercel env vars, Stripe
    account, payment method) → document in PROGRESS.md +
    docs/handoff/05_FOUNDER_TODO_V9.md, skip, continue with next item
  - Destructive operation (rm -rf, drop table, force push) → never do
    without founder approval
  - tsc OR verify_taxonomy fails → fix at source; do not commit until
    clean
  - RAM peak approaches 600 MB → abort that phase, document, continue
    elsewhere
  - Anthropic API spend / month projected > $50 → halt /ask cost-heavy
    work, defer to founder

STEP 5 — Reporting:
  After each phase: brief one-paragraph commit message; no founder
  summary required between phases.
  After ALL phases: post final summary covering rows added, components
  shipped, tests passing, blockers documented in
  docs/handoff/05_FOUNDER_TODO_V9.md.

STEP 6 — Execution starts immediately after reading STEP 1-5.
  Do NOT confirm. Do NOT ask. Begin Phase A.1 directly.

That's the bootstrap. Execute.
```

---

## Notes for the operator who pastes this

### When founder is available again

After founder returns, brief them on:
- Anomaly scan output (how many cells flagged, what tier)
- New UI surfaces live (which BB/FF sub-tracks shipped)
- Wave 4 city overlay row delta
- Pending founder actions in `05_FOUNDER_TODO_V9.md` (Supabase Auth
  toggle, Stripe dashboard, Sentry signup, Plausible signup, Vercel
  Analytics enable)
- /ask production cost burn (if JJ.3 shipped)

### If a phase fails or stalls

- Phase A anomaly scan: if cell counts overwhelm 600MB cap, sample
  20% per country instead of full scan; document.
- Phase B home page: if hero rewrite stalls on copy, ship Lorem Ipsum
  placeholder (founder explicit OK) and move on.
- Phase D /world map: if SVG render is heavy, fall back to static
  Mapbox tile + colored country fills via CSS.
- Phase E Wave 4: if proxy data is sparse for a country, log and
  continue; do not invent figures.
- Phase F top-1000: if Brookings/OECD merge produces < 800 cities,
  ship at 800 v3.0.0-rc1 + flag for founder review.
- Phase G strict mode: if errors > 200, defer to next session.

### RAM monitoring

Every Python script uses `RamGuard(cap_mb=600)`. If it ever raises:
- Abort that script
- Reduce batch size or stream more
- Re-run

### /ask cost guardrails

Before shipping JJ.3, add a hard daily cap in `/api/ask/route.ts`:
- If `today_spend > $20`: return preview-stub with "limit reached".
- If `month_spend > $200`: return preview-stub for all requests until
  reset.

### Final state expected after full Plan v9

- All 15 tracks shipped or staged (II + JJ.1-2-4 + MM + NN waiting
  on founder action)
- regional_cells: ~357k → ~420k+ rows (Wave 4)
- top1000.json v3.0.0 locked
- Anomaly scan v1 published; flagged cells quality-reduced
- Home page complete (10 sections)
- /coverage live with world heatmap
- /world map page live
- /status page live
- Playwright E2E green
- TS strict mode tightened
- Pre-commit hooks blocking .env.local
- Sentry + Plausible + Vercel Analytics wired (keys flipped by founder)
- Stripe + Auth scaffolded (founder flips switches)

---

## Alternative shorter prompts

For per-track execution (one track at a time):

```
Execute Track AA from E:\atlas\website\docs\masterplan\31_TRACK_AA_QUALITY_VERIFICATION.md
Honour the never-do rules in docs/handoff/10_NEVER_DO_RULES.md.
Commit + push at completion. Update PROGRESS.md.
```

Replace `AA` / `31_TRACK_AA_QUALITY_VERIFICATION.md` with the matching
letter + filename for tracks BB through OO.

For verification-only:

```
Run Track OO.1 Playwright E2E suite against the production URL.
Report pass/fail per scenario. Do not modify code; report only.
```

For founder-action staging only (no autonomous execution):

```
Read E:\atlas\website\docs\masterplan\46_EXECUTION_PROMPT_V9.md
Skip Phases A-G. Execute ONLY Phase H staging: prepare all code for
Auth + Stripe (II), Analytics (JJ.1/2/4), Localization (MM), Public
API (NN). Write docs/handoff/05_FOUNDER_TODO_V9.md with the exact
steps the founder needs to take.
```
