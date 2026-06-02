# Session handoff: 2026-06-02

The big one. Covers the 2026-05-31 to 2026-06-02 working block (deep-research data
pipeline, Sentry, the visual reform, the database outage + recovery, the data load,
and the production deploy) and a full map of BOTH repositories, every folder.

This file is written to be the single starting point for the next conversation. Read
PART 0 first; it is the work order. Then read everything else it points you at.

---

# PART 0: BOOTSTRAP PROMPT (do this, in order, before writing any code)

You are picking up an in-flight, production product (marginatlas.com). Do NOT skim.
Do NOT trust your memory of the codebase. The cost of a wrong assumption here is a
broken production page or a corrupted database, so you read first and act second.

Work through these steps literally. Use sub-agents for the wide reading passes so you
do not blow your context window; have each sub-agent return a tight structured summary.

## Step 1: Orient (read these whole, in this order)
1. `website/CLAUDE.md` (the navigation index + hard constraints).
2. This file, top to bottom.
3. `website/docs/handoff/INDEX.md`, then the two prior handoffs:
   `2026-05-27-session-handoff.md` and `2026-05-31-error-hunt.md`.
4. `website/docs/handoff/01_PROJECT_OVERVIEW.md`, `02_FOUNDER_PROFILE.md`,
   `03_DECISION_LOG.md`, `10_NEVER_DO_RULES.md`. These four are load-bearing: the
   founder profile and never-do rules have caused real rework when ignored.

## Step 2: Understand the architecture (read the authority docs)
5. `website/docs/architecture/README.md` (domain/layer boundaries, the file map).
6. `website/docs/design-system/GUIDELINES.md` + `TOKENS.md` (authority for any UI).
7. `website/docs/research-ingestion.md` (how research data becomes DB rows).
8. `website/docs/handoff/05_DATABASE_SCHEMA.md` (the three cell tables + columns).

## Step 3: Map the data model in code (read, do not guess)
9. `src/lib/cells.ts` and everything under `src/lib/cells/` (the Supabase read layer,
   exact-first industry resolution, parent fallback, withBudget fail-soft).
10. `src/lib/taxonomy/` (industries.json = 243 activities; sectors; the friendly-id
    vs NAICS crosswalk). Confirm IDs before you ever reference one.
11. `src/lib/finance/` (net profit, margins, industry_margins.json) and
    `src/lib/economic_profile/` + `src/lib/cost_engine/` (the SmartWaterfall inputs).
12. `src/lib/monetization/` (the v34 gating system) and
    `src/lib/monetization/free_paid_map.ts` (NEW this session: the free/paid plan).

## Step 4: Walk the highest-traffic surface
13. Read `src/app/[country]/[geo]/[industry]/page.tsx` end to end. This single route
    file is the cell page AND the neighborhood page; it composes ~40 section
    components, each of which self-suppresses when its data is absent. Understand the
    suppression pattern before touching any section.
14. Read the homepage `src/app/page.tsx` and `src/app/[country]/page.tsx`.

## Step 5: Understand the data pipeline side (the parent repo)
15. `E:\atlas\deep-research\INDEX.md` then the folder: `reports/`, `drops/`,
    `drops/extrapolated/`, `prompts/`, `tools/`, and `EXTRAPOLATION_MAP.md`.
16. `website/scripts/ingest/` (research_drop_schema.ts, validate_research_drop.ts,
    load_research_drop.ts). Know what the loader DOES and does NOT persist.

## Step 6: Verify reality before you believe any claim
17. Confirm production is live: curl the homepage, a US cell, a non-US cell, and a
    blog post; expect HTTP 200.
18. Confirm the DB is healthy and the row counts match what this handoff claims
    (PART 6). Never act on a stale assumption about table contents; query live.
19. Read `git log --oneline -20` in BOTH repos so you know the true latest state.

## Step 7: Only now, plan
20. Restate, in your own words, the data model (cell = activity economics x geo
    multiplier), the three tables, the gating model, and the hard rules. If you cannot,
    re-read. Then propose your plan and get founder approval before implementing.

Rules of engagement while you work: small scoped commits (stage exact files, never
`git add -A`); never run `npm run build`/`prebuild`/`tsc` without asking; always
dry-run + show before any data or render change; the founder runs all DB `--commit`
and all Supabase SQL; no em-dashes in `src/**`; no source-agency names in copy.

---

# PART 1: THE TWO REPOSITORIES, EVERY FOLDER

There are two separate git repos. Do not confuse them.

## A. `E:\atlas\` (parent) = the DATA PIPELINE + planning brain
This is where raw data is gathered, normalized, and where long-form planning lives. It
is NOT deployed. Remote is separate from the website.

Top-level folders:
- `adapters/` source-specific extractors (per statistical agency) that pull raw data.
- `extracted/` raw pulls landed from adapters (pre-normalization).
- `normalised/` cleaned/standardized intermediate data.
- `cells/` computed cell artifacts (the activity x geo products) before DB load.
- `taxonomy/` the canonical activity/sector taxonomy source (mirrors into the website).
- `macro/` country macro overlays (FX, wages, price levels) feeding the cost engine.
- `refs/` reference tables (ISO codes, crosswalks, geo hierarchies).
- `delivery/` packaged outputs staged for loading into Supabase.
- `ledger/` provenance/accounting of what was loaded when.
- `cache/`, `logs/`, `scratch/`, `us/` working scratch + per-country scratch (US).
- `scripts/` the pipeline scripts (extract, normalize, verify, load helpers).
- `deep-research/` THE IMPORTANT ONE this session. Heavy-web-research outputs that
  fill data gaps. See PART 4.
- `research-prompts/` older prompt set (pre deep-research folder).
- Many `*.md` plan files at root (ATLAS-MASTER-PLAN, ATLAS-EXECUTION-PLAN v2.x,
  GOAL-PLAN-*, STATE.md, HEALTH.md, NEXT-STEPS.md, SESSION-SUMMARY-*, HANDOFF-v1.16).
  These are the historical planning record; STATE.md + NEXT-STEPS.md are the freshest.
- `secrets.env` = the parent's secrets (incl. SUPABASE_DB_URL). Treat as sensitive.

## B. `E:\atlas\website\` = the FRONTEND (this is the deployed product)
Its own git repo on `main`, deploys to Vercel (`fra1`), production marginatlas.com.
Stack: Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase Pro (eu-west-1),
Sentry. ~322 TS/TSX files, 56 routes, ~600+ static pages prerendered per build.

- `src/app/` Next App Router. Each subdir is a route. Key ones: `[country]/` (country,
  geo, and cell/neighborhood pages live under here), `blog/`, `compare/`, `cities/`,
  `countries/`, `industries/`, `sectors/`, `calculator/` (the "where do I sit" tool),
  `check/`, `decide/`, `coverage/`, `methodology/`, `about-data/`, `pricing/`,
  `account/`, `api/` (route handlers incl. cell-lookup, newsletter, export-csv, og),
  `og/` (dynamic OG images), `_design/` (admin-gated component catalog; NEW
  `_design/monetized/` is the free-vs-paid preview), `admin/`, `world/`, `you/`.
- `src/components/` 3 layers. `ui/` = design-system primitives (Button is the
  reference shape: forwardRef + displayName + cva + tokens). `motion/` = animation.
  Root + `sections/` + `mobile/` = application components. Notable subdirs:
  `comparison/`, `empty/` (honest not-yet states), `mobile/` (5 mobile cell
  components), `monetization/` (the v34 lock primitives), `newsletter/`, `billing/`,
  `v2/` (geo wow components: LondonRoadmap, CoverageHubV2, City/Country scorecards),
  `editorial/` (NEW: LongformArticle), `brand/`, `icons/`, `cities/`, `countries/`.
- `src/lib/` the domain layer (no React). Read the subdir names; each is a bounded
  concern: `cells/` (Supabase reads), `taxonomy/`, `finance/`, `economic_profile/`,
  `cost_engine/`, `economics/` (breakeven), `coverage/`, `quality/`, `qa/`,
  `extrapolations/` (fill-missing estimators), `content/` (narratives, activity
  character), `editorial/`, `monetization/`, `tax/`, `geo/`, `regions/`, `places/`,
  `cities/`, `seo/`, `stats/`, `format/`, `images/`, `learn/`, `check/`, `external/`,
  `page-layout/` (section-order gate source), `types/`, `ui/`.
- `src/styles/` `globals.css` (defines the `--atlas-*` CSS token vars + `.atlas-paper`
  textures), `homepage-visual-tokens.css`, `atlas-pattern.css`.
- `scripts/` the prebuild gates (26 verifiers run by `scripts/prebuild_all.ts`),
  `scripts/ingest/` (research-drop schema + validate + load), `scripts/audit/`,
  `scripts/db/`, maintenance codemods.
- `data/` static fixtures + audit/quality report outputs (gitignored noise lives here;
  do NOT sweep it into commits).
- `docs/` AUTHORITATIVE. `architecture/`, `design-system/`, `handoff/` (this folder),
  `ingest/` (per-country ingestion playbooks), `masterplan/` (the big track plan),
  `strategy/` (incl. the v34 monetization mega-plan), `research-ingestion.md`,
  `superpowers/specs/` (brainstorm design specs, incl. the visual-reform spec).
- `db/migrations/` Supabase SQL applied manually in the SQL editor.
- `content/blog/` markdown blog posts.
- `public/` static assets incl. the 8 `atlas-*.svg` texture/pattern files.
- `design-assets/incoming/` (gitignored) the 4 extracted design-export sets 17-20.

---

# PART 2: WHAT THIS SESSION SHIPPED (2026-05-31 to 06-02)

## Deep-research data pipeline (parent repo, commits f2ff826, c07df8d)
- Created `E:\atlas\deep-research\` with `reports/`, `drops/`, `prompts/`, `tools/`,
  `INDEX.md`, `EXTRAPOLATION_MAP.md`.
- Ingested 9 heavy-research reports into 11 validated research-drop JSON files
  (countries: US, India x2, China x2, Indonesia, Philippines, Brazil, Nigeria,
  Vietnam, Thailand). All pass `validate_research_drop.ts`.
- Wrote 10 NEW research prompts (11-20), software + building-trades priority.
- Phase 3 extrapolation: generated 8 derived drops (T1 within-country parent backfill,
  T2 adjacent-family, T3 cross-country analogue), 114 derived cells, all forced to
  `low` confidence and tagged `extrapolated-from:`. See `EXTRAPOLATION_MAP.md`.

## Sentry (website, commit c6143a7)
- Wired via Next 15 native instrumentation files (NOT the withSentryConfig webpack
  wrapper, which crashed SSR). Then hardened for the free tier: removed paid Session
  Replay, lowered trace sampling to 0.05. Action for founder: just let the trial lapse
  (no card on file = auto-drops to free Developer plan).

## Visual reform (website, branch merged to main, commits 194555f..6e70f83)
The 4 dropped design zips (sets 17-20) turned out to be ~90% already integrated from
prior sessions. Executed 5 founder decisions:
1. Killed the Atlas Score (composite 0-100 number, too risky). Removed the strip + the
   `atlasScore` prop on DenseCellHero + deleted `AtlasScore.tsx`. Hero now shows a
   coverage-confidence word: loud on strong tiers ("Measured data" / "Regional
   benchmark"), silent on weak tiers.
2. Adopted an on-brand long-form blog layout: NEW `src/components/editorial/
   LongformArticle.tsx` (re-skinned from the export's "Decade article" into Atlas
   tokens), wired on every blog post. Skipped the demo-hardcoded BlogCoverCard.
3. Skipped RolePay (salary-by-role); the site does not speculate on salaries.
4. Declined `atlas-reform.css`: it is mockup-showcase CSS with a CONFLICTING palette
   under the same var names + generic colliding class names. The real texture pack is
   already in the repo.
5. Built the gated free/paid DESIGN (billing logic deferred): NEW
   `src/lib/monetization/free_paid_map.ts` (the Free/Basic/Premium visibility plan,
   pure data) + admin-gated `/_design/monetized` preview showing fog, ghost bars,
   redaction, a key cue, and the full table. Deliberately did NOT wire gating onto the
   live cell page (an earlier attempt broke it, reverted 2026-05-25).
Verified: `tsc --noEmit` clean + `prebuild` 26/26 gates green. Merged to main.

## Database outage + recovery (the big one, 2026-06-02)
- First deploy FAILED: country-page prerenders timed out (>300s each). Root cause was
  NOT the code (it compiled fine). Supabase was Unhealthy: NANO compute, CPU pinned at
  97%, and the perf indexes from 2026-05-27 had NEVER been applied, so 600k-row tables
  were doing full scans.
- Founder applied `db/migrations/2026-05-27-perf-indexes.sql` (6 indexes + ANALYZE) in
  the SQL editor. DB went healthy; queries dropped from 4s+ to ms.
- Fixed a loader bug surfaced by the first successful run: the loader did not set the
  NOT NULL `country_name` column on extrapolated_cells (website commit 883302d).
- Loaded all 19 drops to the DB (11 measured + 8 extrapolation). Then redeployed.

## Production deploy (website commit 883302d)
- Redeploy GREEN. Verified live: cell page has 0 "Atlas Score" occurrences and shows
  "Measured data"; blog uses the longform layout (`lf-title/lf-deck/lf-body`); Nigeria
  cell (fresh data) renders; homepage + blog return 200.

---

# PART 3: CURRENT PRODUCTION STATE
- Live, deployed, stable at website `main` = `883302d`. Vercel deploy succeeded.
- Parent repo `main` = `c07df8d`.
- DB: Supabase Pro, project "Margin Atlas", eu-west-1, NANO compute, indexes applied,
  healthy. 19 research drops loaded (coverage_source = `research-drop:<id>`).

---

# PART 4: THE DATA PIPELINE (deep-research + ingestion)
Mental model: a cell = activity economic profile x geo multiplier. We research two
FINITE layers (activity economics ~240; geo multipliers per country/city) and multiply
them, instead of researching millions of per-cell combinations.

`E:\atlas\deep-research\`:
- `prompts/` 20 prompts to paste into a heavy research model (one country/cluster +
  one sector cluster each). 01-10 original wave; 11-20 software + trades wave.
- `reports/` the raw prose+table reports the model returns.
- `drops/` validated research-drop JSON converted from reports (11 measured).
- `drops/extrapolated/` + `drops/extrapolated/crosscountry/` the 8 Phase-3 derived
  drops. All low-confidence, tagged.
- `tools/generate_extrapolations.js` the deterministic Phase-3 generator.
- `EXTRAPOLATION_MAP.md` the documented logic for every derived cell.
- `INDEX.md` the folder's own table of contents + per-report coverage.

Ingestion (website `scripts/ingest/`):
- `research_drop_schema.ts` types + `validateResearchDrop` (pure; taxonomy-checked).
- `validate_research_drop.ts` CLI validator.
- `load_research_drop.ts` the loader. DRY-RUN by default; `--commit` writes;
  `--rollback <id>` undoes by tag. IMPORTANT: the loader currently persists only USD
  `predicted_rev_per_firm` + quality/tier per cell into `extrapolated_cells`. It does
  NOT persist net margin / cost structure / regional multipliers (those are the
  activity-level layer, `industry_margins.json`). It now also sets `country_name`.
  The founder runs every `--commit`.

To load a drop: `npx tsx scripts/ingest/load_research_drop.ts <path> --commit` from
`website/` (the `npm run research:*` aliases do NOT exist; call tsx directly).

---

# PART 5: ARCHITECTURE + CANONICAL PATTERNS (do not invent variations)
- Pages server-fetch via `getCellBySlug()` (or sibling accessor). If missing, call
  `notFound()`, never a "coming soon" stub.
- Visualizations accept nullable inputs and `return null` when data is insufficient
  (graceful silent omission). Never render raw undefined/NaN.
- Supabase queries live only in `src/lib/cells.ts` (or `src/lib/cells/`), each wrapped
  in `withBudget(query, ms)` fail-soft. Never query from a component.
- Layering is upward-only: app -> domain (`src/lib/`) -> system (`src/components/ui/`)
  -> tokens (`src/lib/design-tokens.ts`). `scripts/verify_layering.ts` enforces it.
- Every UI primitive needs a `/_design` catalog story before merge.
- Industry resolution is exact-first via `src/lib/cells/industry_resolution.ts`
  (with a LEGACY_DB_TO_TAXONOMY crosswalk); sub-niches fall back to the measured
  parent automatically.

---

# PART 6: DATABASE (Supabase)
Three cell tables:
- `cells_master` US, NAICS-based, ~722k rows.
- `regional_cells` non-US sub-national, ~376k rows, 127 countries, friendly industry_id.
- `extrapolated_cells` country-level estimates, ~239k rows, friendly industry_id. This
  is where the research loader writes (key: country_iso3, year, industry_id, size_band).
- Read-time inflation roll-forward (`applyRollforward` to INFLATION_TARGET_YEAR), so do
  NOT roll values to the current year in the DB (would double-inflate).
- Indexes: `db/migrations/2026-05-27-perf-indexes.sql` is APPLIED as of 2026-06-02. If
  the DB ever goes Unhealthy / high-CPU again, first check these indexes still exist,
  then consider bumping compute off NANO.
- `regional_cells` has NO `updated_at` column (a scrub script once failed on this).

Verify live before trusting counts. Founder runs all SQL in the Supabase SQL editor
(CONCURRENTLY cannot run inside a transaction, so one statement at a time).

---

# PART 7: MONETIZATION (design done, billing later)
- Full v34 primitive system exists in `src/components/monetization/` (LockPill,
  BlurredOverlay = fog, RedactedNumber, GhostBar, MoreDepthBanner, PaywallModalRoot).
  Research-locked rule: no padlock icon. The founder added a "key" cue (a key reads as
  unlock-available, not forbidden) in the preview.
- `src/lib/monetization/viewer_tier.ts` is a stub: everyone is "free" until billing.
- `src/lib/monetization/free_paid_map.ts` (NEW) declares what Free/Basic/Premium see.
- `/_design/monetized?key=<ADMIN_KEY>` previews the gated states on mock data.
- NOT YET DONE: wiring gating onto the live cell page (broke before, do it field by
  field with tests), and the actual Stripe billing.

---

# PART 8: HARD RULES (enforced by gates or the founder)
- No em-dashes in `src/**` (gate `verify_no_em_dashes`; the gate tolerates comments but
  do not add new ones; override `// allow-em-dash`).
- No source-agency names in user-facing copy (gate `verify_no_source_agencies`).
- No URL slug renames (SEO equity). Add new, never rename.
- No raw hex/pixel/ms in components; use tokens.
- No `--no-verify`, no `--no-gpg-sign`, no force-push to main.
- Parallel prebuild concurrency <= 4 on Windows (6 segfaults intermittently); the
  `npm run build` prebuild lifecycle hook can segfault. Standalone `npm run prebuild`
  at concurrency 4 is reliable.
- Founder profile rules: talk short and plain; do NOT focus on salaries; editorial
  "line" and the Atlas Score were judged too risky; always dry-run + show before
  data/render changes; the founder runs the loader/DB, not the AI; never claim done
  without proof.

---

# PART 9: BLOCKERS + GOTCHAS LEARNED THIS SESSION
- The local machine CANNOT complete a full `next build` (OOMs at the webpack compile,
  even at 8GB heap; the build worker does not inherit the heap bump). Use `tsc
  --noEmit` + `npm run prebuild` as the local proof of correctness, and let Vercel be
  the real compiler. A failed Vercel build does not promote, so production stays safe.
- `git add -A` swept pre-existing uncommitted `data/audit/*` changes into a commit.
  Always stage exact paths.
- Spawning many `npx tsx` processes back-to-back thrashes memory (loads OOM'd mid-batch
  and "Resource temporarily unavailable"). Run loads in small batches.
- The em-dash gate scans `<style>` strings inside `.tsx`, so keep style islands clean.
- A NANO Supabase box with missing indexes silently breaks builds AND data loads via
  query timeouts; it presents as "DB down" but is actually "DB overloaded."

---

# PART 10: PENDING / NEXT STEPS (no fire; founder-paced)
1. Sentry: cancel the trial (free tier already configured in code).
2. Keep pasting research prompts 11-20; convert returns to drops; founder commits.
3. Tier-1/2 visual component PORTS not yet done (the spec lists them): empty-states
   visual upgrade + 404, WorldMapPicker, homepage polish, icons/dividers/skeleton.
   See `docs/superpowers/specs/2026-06-01-visual-reform-design.md`.
4. Monetization: wire gating onto the live cell page (carefully, field by field), then
   real billing. Only the design + map exist now.
5. Minor data/display: `/es/es511/...` titles as "ES" (region code not resolving to a
   name). Pre-existing, low priority.
6. Optional: bump Supabase off NANO if CPU strains under traffic + builds.

---

# PART 11: SECRETS + ACCESS
- `E:\atlas\secrets.env` holds `SUPABASE_DB_URL` (the SUPABASE_DB_URL password was once
  exposed in a transcript; rotation was deferred by the founder, still worth doing).
- `website/.env.local` holds the PostgREST/admin env the loader + app read.
- Vercel env needs `NEXT_PUBLIC_SENTRY_DSN` (already added) and `ADMIN_KEY` (gates
  `/_design`). The Sentry DSN is a write-only ingest key, safe in the client bundle.
- GitHub: `benetbani/marginatlas-web` (website). Deploys auto on push to main.
