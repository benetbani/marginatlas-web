# Reformation v2 Plan: Global retune + London pilot

> STATUS: DRAFT for founder approval (2026-06-04). Do NOT execute any phase
> until the founder approves. This is the plan requested after the v1 reform.

## Goal

Two tracks the founder set:
1. GLOBAL fixes that apply site-wide (brand color, homepage hero, remove
   sector pages, reform whole-globe pages, strengthen the weak activity pages).
2. A LONDON / UK pilot built to the absolute highest quality: apply the Bible
   entity blueprint (Section 6), scores (Section 10), deformation (Section 20),
   and voice (Section 25) to UK + London + London neighborhoods + every London
   activity and cell.

Sequence: GLOBAL first, then LONDON.

## Hard constraints (carry from v1, plus new ones)

- Local machine is RAM-starved (about 0.9 GB free of 8 GB). Keep every local
  step under ~600 MB. NEVER run a local `next build` or `tsc`/`prebuild`
  (they OOM). Verify on Vercel preview builds, the proven loop. This is why
  Phase 0 shipped clean even though local gates could not run.
- One change-set at a time, on a branch, preview-verified, then merged. Batch
  pushes so one Vercel build covers several edits.
- All v1 gate rules still bind: no em-dashes, no source-agency names in copy,
  tokens only (no raw hex), hide-weakness (omit a thin module, never fake a
  number or show a low-confidence badge), mobile-first, preserve SEO
  (generateMetadata, JSON-LD, canonical), never rename slugs (add + redirect).
- Free only. No paywall/auth/Stripe in this round.
- Visual QA needs the Vercel Protection Bypass token pasted in (for preview
  screenshots via scripts/shot_preview.mjs). Required before merging visual
  changes to production.

## Phase 0 (DONE, merged to main 286b8378)

- Cold-build fix: `/[country]` prerender to `[]` (mirrors the region page),
  `maxDuration=60`; the two DB-backed sitemap shards wrapped in `withBudget`.
  Root cause: prerendered country pages + sitemap shards each hit the 300s
  per-route DB timeout on a cold/spend-capped DB and blew the 45-minute build
  cap (failed deploy ks27agr69). Build success is now decoupled from DB health.
- `getCellBySlug` deduped per request with React `cache()`.
- Verified: preview gj0udffzo built Ready in ~1 min (was 45-min failure).

---

# PHASE 1: GLOBAL (execute first)

Order within the phase: 1A palette is first because every later screenshot
should show the final colors. Then hero, then sector removal, then the
industry/world reform.

## 1A. Palette retune: brick-red accent + white/gray backgrounds

Founder: the current terracotta reads orange/brown and detached; wants a
brighter BRICK RED accent and backgrounds that lean WHITE and light GRAY (less
warm sand/cream). This is an editorial-data-product look (Bible Section 14:
"atlas + financial dashboard + investigative briefing, not startup gradient
soup"), which fits.

Mechanism (same lever as v1): retone the token FAMILIES in lockstep; names stay,
so all components inherit with zero churn. Files to change together (exact ramps
and lines from the token mapper):
- `src/lib/design-tokens.ts` (single source of truth)
- `src/app/globals.css` (shadcn CSS vars + `--atlas-surface-*`)
- `src/styles/homepage-visual-tokens.css`
- `src/styles/atlas-pattern.css`
- `tailwind.config.ts` imports from tokens (verify)

Direction (exact hexes proposed after the mapper returns current values, then
shown on a preview swatch for approval):
- `atlas` accent: brighter brick red (clearly red, not orange/brown). Keep a
  ramp dark enough at 700+ for AA text on light surfaces.
- `cream`/surfaces: shift to near-white and light warm-gray (keep a hint of
  warmth so it is not clinical SaaS white).
- `clay` (danger) must stay visibly distinct from the new brick accent; may
  retune clay toward a cooler/deeper red or keep as-is and ensure contrast.
- `ink`/`cocoa`/`graphite` text: keep AA contrast on the new lighter surfaces.

Risk: brick accent vs clay danger collision; AA contrast on lighter surfaces.
Mitigation: contrast-check every pair; preview screenshots before merge.

## 1B. Homepage hero rework

Founder asks:
- Eyebrow becomes a number-one leadership claim (e.g. "The #1 atlas of local
  profit intelligence", exact wording to confirm, must not read as idiotic).
- Restore the rotating changing-words H1 (worked well pre-reform; the reform
  made it a static H1). Restore source from git (pre-reform hero), from the
  hero mapper.
- Demote the current H1 ("Know if a business works before you risk your money")
  to a subtitle.
- Remove the "Compare small-business profitability..." subtitle entirely.
- Fix the homepage map's white-margin issue (mapper to pinpoint the
  viewBox/container/background cause).

Files: `src/app/page.tsx` + the hero/section components + the homepage map
component (exact files from the hero mapper). Preserve SEO h1 semantics (the
rotating words must still render a real, crawlable H1 string).

## 1C. Remove sector pages

Founder: a sector is too diluted to help any visitor; remove all sector PAGES.
CRUCIAL: remove the sector PAGES and links, but KEEP the sector TAXONOMY
(SECTOR_BY_ID / SECTORS_ORDERED / industry.sector_id) used to GROUP industries
elsewhere.

From the sectors mapper, the removal checklist will list: page files to delete
(`src/app/sectors/page.tsx`, `src/app/sectors/[sector]/page.tsx`,
`src/lib/scores/sector_economics.ts`), every nav/footer/related link to remove,
the sitemap sector block to drop, and the redirects to add. SEO: do not 404;
add 308 redirects `/sectors` and `/sectors/*` to `/industries` (or the best
target) in `src/middleware.ts`, following the existing redirect pattern.
DO NOT TOUCH the taxonomy grouping usages (the mapper lists them).

## 1D. Reform whole-globe pages + strengthen the activity pages

Founder: aggregating an activity across the whole world ("barbershop margins
worldwide") is meaningless; the global pages must become place-aware and
useful. And the per-activity pages (the "Activities" tab) are a weak link.

- `/industries/[industry]` (per-activity): reframe from any single global
  number to "how this activity makes money" (business-model anatomy: structural
  cost shape, what drives the margin, what kills weak operators, the levers),
  then immediately push to "pick a place" (a strong places picker / best-and-
  hardest cities), since the real answer is always local. Bible Section 5 row
  ("Industry page", show "business model anatomy") and Section 13.
- `/world`: reframe away from whole-globe aggregates into a guided entry
  ("choose a place / activity"), not a worldwide average. Exact current shape
  and the global-aggregation hotspots from the industry/world mapper.
- "Activities" tab: ensure it lands on the improved activity directory.

---

# PHASE 2: LONDON / UK pilot (execute second, highest quality)

Scope (narrow on purpose, nail it):
- UK country page (`/gb`)
- London city page (`/cities/london`)
- London neighborhoods (`/cities/london/neighborhoods`, the neighborhood cells)
- Every London activity cell: `/gb/london/<activity>` for the 20 MVP activities
- The London/UK industry hubs and the UK-side of compare/decide for London

Apply the Bible entity blueprint. Each module is its own well-shaped section
(its own table/typology/detail level per the founder), in the blunt voice
(Section 25: never name an upside without naming what can kill it), and SELF-
OMITS when its data is thin (hide-weakness; never fabricate).

## London cell modules (Bible-mapped)

Decision-first order, each section self-suppressing when data is absent:
1. Verdict hero: named upside + the thing that can break it. [S6 #1, S25]
2. Profit snapshot: typical revenue, gross/net margin, owner take-home. [S6 #2-4]
3. Cost structure waterfall: where the margin goes. [S6 #5]
4. Break-even: sales floor, orders/day. [S6 #6]
5. Competition density: total competitors + per 10k residents. [S4-B, S10 Saturation]
6. Market structure and typology: fragmented vs concentrated; free market vs
   oligopoly; revenue concentration (top-player share). [S4-B]
7. Chain/franchise share + independent-operator viability. [S4-B, S10]
8. Informality pressure (where relevant). [S4-D, S20]
9. Pricing power. [S4-C, S10]
10. Rent pressure (rent vs revenue). [S6 #11, S10]
11. Labor pressure (wage/payroll burden). [S6 #12]
12. Survival and churn: 1/3/5-year survival, birth/death rate. [S6 #14, S10]
13. Seasonality + demand drivers (locals/tourists/office/students). [S6 #15-16]
14. Tax and compliance burden. [S6 #10]
15. What kills weak operators. [S6 #22]
16. Scores panel: the best-early five (Opportunity, Local Profitability, Market
    Saturation, Rent Pressure, Owner Take-Home). [S10]
17. Compare/related: other London activities, other UK cities, London
    neighborhoods. [S6 #26-28]

## The hard part: DATA for the rich modules (must resolve before building)

Modules 5-13 (competitor density, market structure, concentration, chains
share, informality, churn, pricing power, seasonality) need DATA that the
current cell tables may not carry for London. Hide-weakness forbids faking
them. So for each module, the plan must classify London data as:
- COMPUTABLE from existing data (e.g. competitor density from firm counts +
  London population; concentration/structure from the firm-size distribution
  already in the data; chains share if chain counts exist).
- NEEDS A LONDON RESEARCH DROP: a curated, sourced dataset loaded via the
  existing ingest pipeline (`scripts/ingest/load_all_drops.ts`, research-drop/v1
  JSON). The drop schema may need new fields (competitors_per_10k,
  concentration, chain_share, informality, churn, pricing_power) for the rich
  modules. This is a parent-repo (`E:\atlas`) data task.
- OMIT for now: if neither, the module self-suppresses (and we note the gap),
  rather than fabricating.

A London pilot that "mentions all these sections" at the founder's quality bar
most likely requires a London research drop for the structural/competition/
deformation modules. The plan will spell out, per module, which bucket it is in,
and the drop will be dry-run + shown before any DB write (standing rule).

## Execution method (per page-type)

Reuse the proven v1 pattern: a pure synthesis module (`src/lib/scores/*` or a
London-specific module) feeding a warm, tokenized server component that
self-omits on null. Dispatch a subagent per page-type with a tight brief, review
the 2 new files, re-gate the tree, batch-push, preview-verify with the bypass
token. One page-type in flight at a time.

---

# Open choices to confirm at approval

1. Exact brick-red + gray palette: I will propose specific hexes and show a
   preview swatch; you pick.
2. Eyebrow wording for the #1 claim.
3. London rich-module data: build a London research drop now so modules 5-13
   show real sourced data (higher effort, true pilot), OR ship London with the
   computable modules now and self-omit the rest until a drop lands. This is the
   biggest scope lever for the pilot.
4. `/world` reform target shape (guided entry vs something else).
5. Whether to re-enable a small country/cell prerender set later (safe once the
   country top-industries read is materialized).

# Sequencing summary

1. Phase 1A palette (preview swatch -> approve -> merge)
2. Phase 1B hero (rotating H1 + #1 eyebrow + demote/remove subtitles + map fix)
3. Phase 1C remove sector pages (+ redirects)
4. Phase 1D industry/world reform
5. Phase 2 London data resolution (drop if approved) then page-by-page build
