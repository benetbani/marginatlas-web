# Plan v13 — Credibility Fix (Margin Atlas)

**Date**: 2026-05-19
**Anchor**: Founder review session, 2026-05-19. Founder walked the live site and flagged seventeen distinct issues, three of which are existential (negative net margins, broken image rendering, unreliable firm counts). This spec consolidates the response.
**Decomposition**: Eight independent workstreams, sequenced in three deployable waves.

---

## Context

The founder reviewed `marginatlas.com` live and surfaced the following issues, ranked here by severity:

1. **Catastrophic** — Negative net margins are reported for SMB cells. Net margin can never realistically drop below ~3% for an SMB that is still operating (a sub-3% business has already failed). The current profit-waterfall architecture allows negative outputs, which destroys credibility on every page it appears.
2. **Catastrophic** — The number-of-firms column shows obviously broken data (Birmingham UK has 3.3K restaurants, London 990; the entire United States shows ~35,315 hotel-owning firms). This was a data-quality bug previously suspected; founder confirms it must be addressed.
3. **High** — Image rendering is broken on most pages. Where images do render, country images are mediocre and not skyline-focused; industry images are not aesthetic.
4. **High** — Statistical presentation: "0% earn under $97K" cluster language is unintelligible. Founder wants a `bottom 20% / median / top 10%` tile triplet, big and prominent, plus a true distribution curve (asymmetric parabolic, log-normal-ish) instead of cluster bars.
5. **High** — Engineering jargon leaks into the public site: "coverage TBC", "our show coverage", year ranges like "data only 2018-2020", cell counts like "490 cells in this class". Founder wants these stripped — they belong in `/admin/review`, not the public product.
6. **Medium** — Sister pages (same template, different country/city/industry) are inconsistent. Sections present on one are missing on another. Should be visually identical structure regardless of data nulls.
7. **Medium** — Sub-regional coverage gaps. Argentina has no regions visible; founder wants either coverage or no region tab — no half-broken state.
8. **Low** — Country flags have a faux-3D / wave / glossy lighting effect. Founder wants plain flat SVG.

---

## Architectural Decisions (made during brainstorming)

| # | Decision | Rationale |
|---|---|---|
| **D1** | **Net margin: hard floor at 3% AND industry ratio rebuild from canonical SMB sources** | A defensive code-level floor (`Math.max(0.03, computed_net_margin)`) ensures we can never display a sub-3% number again. In parallel, we rebuild every industry's profit waterfall from canonical SMB sources (IRS SOI Corporate Tax Statistics for the US, NRA / NAHB / ATA / NACS / industry trade-press benchmarks, BizMiner-style SMB data via web search). The floor is a backstop; the rebuild is the real fix. |
| **D2** | **Images: Wikimedia + AI hybrid** | Keep Wikimedia for famous landmarks where free CC photography is excellent (Eiffel Tower, Times Square, Big Ben, Brandenburg Gate, etc.). For everything else (180 industries × process/end-product shots, ~80 lesser-known cities), generate via Imagen 4 / Flux Pro / Midjourney. ~$0.04/image × ~400 needed = ~$15-20 total. Guaranteed aesthetic, no licensing complexity, no broken downloads. |
| **D3** | **# of firms column: remove globally** | Drop the column from every public page (cell, country, comparison, calculator). The underlying `n_enterprises` field stays in the DB for internal tier classification but never renders. Re-add as a Pro feature later if we ever fill the 180+ country coverage gap. |
| **D4** | **Sequencing: three waves** | Wave 1 (hygiene, 1 day), Wave 2 (margin rebuild + stats redesign, 3-5 days), Wave 3 (image system v2, 2-3 days). Hygiene ships first because it's the fastest credibility lift with near-zero risk; Wave 3 last because it benefits from Wave 1+2 layouts being stable before re-rendering images against them. |

---

## Wave 1 — Hygiene (≈1 day)

### P3 — Strip engineering jargon and year citations

- Add `src/lib/format/recency.ts` exporting `formatRecency(year: number | string) → string`. Always returns `"Most recent data"` for public surfaces. The `/admin/review` page bypasses this and shows real years.
- Find/replace pass for every public component:
  - Year string patterns: `/\b20\d{2}(\s*[-–]\s*20\d{2})?\b/` → `"Most recent data"` (or remove entirely if not load-bearing)
  - `coverage TBC`, `our show coverage`, `n=NNN cells`, `data only YYYY-YYYY`, confidence-score `%` exposures
- Scope: `src/app/[country]/`, `src/app/[country]/[geo]/`, `src/app/[country]/[geo]/[industry]/`, `src/app/industries/`, `src/app/world/`, plus shared components in `src/components/`

### P7 — Remove # firms column

- Files to touch:
  - `src/app/[country]/[geo]/[industry]/page.tsx` (cell page — strip the firm-count tile)
  - `src/app/[country]/page.tsx` (country page — strip column from industry-mix grid)
  - `src/app/[country]/[geo]/page.tsx` (geo page — strip column from industry list)
  - `src/components/CompareTable.tsx`, `src/components/CalculatorInputs.tsx`
- `n_enterprises` field stays in DB; never imported into a render path.

### P8 — Flag fix

- Locate the flag component (likely `src/components/CountryFlag.tsx`). Strip:
  - `transform: perspective(...)`, `rotate3d(...)`, animations
  - Shine overlay (`::after` gradient pseudo-element)
  - Drop shadow
- Render plain `<img>` with `aspect-ratio: 3/2`, `object-fit: cover`, no effects.

### P6 (partial) — Sub-regional coverage gating

- New helper: `src/lib/coverage/regional.ts` exporting `hasRegionalCoverage(iso2: string) → boolean`. Backed by a one-time query of `regional_cells` (group by country, count distinct geo_id).
- Country page (`src/app/[country]/page.tsx`): if `hasRegionalCoverage(iso2) === false`, hide the "Regions" tab entirely. No empty state, no placeholder — the tab simply doesn't exist.
- For partial coverage countries (e.g., regional data only for some industries): keep tab, only render regions with data.

---

## Wave 2 — Profit Waterfall + Statistical Presentation (≈3-5 days)

### P1 — Net margin rebuild + floor

- **Canonical sources lookup script**: `scripts/quality/build_canonical_margins.py`. For each of ~180 industries in our taxonomy:
  1. Map to NAICS 6-digit code (already in taxonomy)
  2. Web-search canonical SMB benchmark: IRS SOI Statistics of Income by NAICS (US), industry trade-press benchmarks (NRA, NAHB, ATA, NACS, NRF, AAA Insurance Reports, etc.), supplemented by Bizminer/Vertical IQ-style SMB databases via web search
  3. Capture `{gross_margin, operating_margin, net_margin}` with `source_url` and `notes`
  4. Apply floor: `net_margin = max(0.03, computed_net_margin)`. If a source genuinely shows a sub-3% industry, log to `marginal_industries_review.json` for founder review (these would be industries like residential utilities resellers, certain commodity wholesale plays — they likely exist but rare). While under review, the floor still applies in the render path; the canonical JSON stores the unclamped source value alongside a `floor_applied: true` flag so founder can see both.

- **Relationship to Plan v12 Q9 work**: The 8-industry `industry_margins_verified_v1.json` audit shipped in Plan v12 push #2 was an upper-bound sanity check against Damodaran. Plan v13 P1 supersedes it with the full 180-industry canonical rebuild. The Plan v12 audit file is retained at `/admin/review` for historical reference but is not the source of truth.
- **Output**: `website/src/lib/finance/industry_margins_canonical_v2.json` replacing the current `industry_margins.json`. Same schema, but all values clamped.
- **Defensive guards in render path**: Add `clampMargin(value: number, kind: "gross"|"operating"|"net") → number` in `src/lib/finance/margins.ts`. Every render of a margin number goes through this. Net floor 3%, operating floor 5%, gross floor 15% (these floors are also industry-typical SMB lower bounds).
- **Margin waterfall component**: new `src/components/MarginWaterfall.tsx`. Visual: horizontal bar with three segments — gross (full width = 100% revenue), operating (gross minus opex), net (operating minus taxes & interest). Each segment labeled with percentage. Segments use `bg-moss-200`, `bg-moss-400`, `bg-moss-600` for gradation. No 3D, no shadows.

### P2 — Statistical presentation redesign

- **`RevenueTiles.tsx`** component:
  - Three large tiles in a horizontal row (stacks on mobile)
  - Labels: `Bottom 20% earn` / `Typical (median)` / `Top 10% earn`
  - Big numbers: `text-3xl md:text-4xl font-semibold tabular-nums`
  - Source values: `rev_p20`, `rev_p50`, `rev_p90` from the cell row (if `rev_p20` not in schema, derive from `rev_p10` via interpolation, or fall back to `rev_p10` with a note)
  - When all three percentiles null, the whole component renders a graceful empty state: "Earnings distribution not available for this cell."

- **`RevenueDistribution.tsx`** component:
  - Renders a fitted log-normal curve as a single SVG `<path>`
  - Library: `simple-statistics` (already a peer dep candidate) for log-normal fitting from `[p10, p25, p50, p75, p90]`
  - Curve fills with `fill-moss-100/60` and strokes with `stroke-moss-700 stroke-2`
  - Three vertical reference lines at p20 / p50 / p90 with small labels above
  - No grid, no axes, no tick marks — pure curve
  - Width 100%, height 180px desktop / 140px mobile
  - When percentiles insufficient (only median), renders a flat illustrative curve with a note "Distribution shape estimated"

- **Replaces**: existing `EarningsClusters.tsx` (the "0% earn under $97K" component) — delete it.

### P5 — Sister-page consistency

Canonical section order, codified as `RenderOrder` arrays in each page template:

- **Cell page** (`/[country]/[geo]/[industry]`):
  ```
  Hero → RevenueTiles → RevenueDistribution → MarginWaterfall → TaxAndCostPanel → RelatedCells
  ```
- **Country page** (`/[country]`):
  ```
  Hero → CountryStats (tiles) → IndustryMixGrid → TopCities → TaxOverview → RelatedCountries
  ```
- **Industry page** (`/industries/[industry]`):
  ```
  Hero → IndustryTiles (aggregated) → RevenueDistribution → MarginWaterfall → TopCountries → TopCitiesForIndustry
  ```

Every section has a graceful "Not available for this <cell|country|industry>" fallback. Sections never disappear; they degrade.

---

## Wave 3 — Image System v2 (≈2-3 days)

### P4 — Rip and replace

- **Step 1: Audit current image manifest quality**: `scripts/images/audit_manifests.py` scores each entry on (a) does the URL still resolve, (b) is the image actually a relevant skyline/process shot, (c) is image quality > 1024×768. Output `image_audit_v1.json` with reject list.

- **Step 2: Build the AI generation pipeline**: `scripts/images/generate_ai.py`. Use one of:
  - Google Imagen 4 via Vertex AI (preferred — best landscape/architectural realism, ~$0.04/image)
  - Black Forest Labs Flux Pro via Replicate or fal.ai (~$0.03/image)
  - OpenAI DALL-E 3 (fallback, ~$0.04/image)
  - Prompt templates per category:
    - City skyline: `"Aerial photograph of {city} skyline at golden hour, professional architectural photography, sharp focus, warm light, no people, 4K"`
    - Industry process: `"Professional photograph of {industry_description} in operation, clean modern setting, soft natural light, no people in frame, editorial quality, 4K"`
    - Industry end-product: `"Editorial product photography of {product}, minimalist studio setting, soft directional light, neutral background, magazine quality"`

- **Step 3: Hybrid manifest builder**: `scripts/images/build_hybrid_manifest.py`. For each entry:
  1. If Wikimedia has a high-quality CC-BY photo matching the founder-acceptable criteria (skyline for cities; process/end-product for industries), use it
  2. Else generate via AI
  3. Always download and re-host on our CDN (so we never ship broken remote URLs again)

- **Step 4: Fix the rendering bug**: founder reports "div" text appearing in front of images. Likely a JSX rendering error or `dangerouslySetInnerHTML` leak. Audit `AtlasHeroImage.tsx` and `CountryHero.tsx`. Strip any html-as-text leaks. Add a test: image always renders as `<img>` element, attribution renders as `<figcaption>`, nothing else.

- **Step 5: Replace existing manifests**: Drop the current `cities_manifest.json`, `industries_manifest.json`, `countries_manifest.json`. Replace with the hybrid output. Keep `sectors_manifest.json` (those 19 entries are fine).

---

## Out of Scope (deferred to Plan v14)

- IRS SOI ingest for revenue distribution refinement
- Per-state / per-province margin data (only national for now)
- Real-time FX rate updates (current static 2024 table is fine)
- A/B testing infrastructure
- Founder one-pager and slide deck (separate deliverable)

---

## Acceptance Criteria (per wave)

### Wave 1 done when:
- No public page renders a year string (verified via Grep across `src/app/`)
- No public page renders `# firms` (verified via Grep + manual click-through of `/us/`, `/gb/`, `/de/`, `/mx/`)
- Country flag has no transform / shadow / overlay (verified via DOM inspect)
- Countries with no regional data don't show a Regions tab (verified for AR)

### Wave 2 done when:
- Every cell page renders a non-negative net margin >= 3% (verified via DB query against `industry_margins_canonical_v2.json` outputs)
- Every cell page renders the new `RevenueTiles` + `RevenueDistribution` + `MarginWaterfall` triplet
- Sister pages (e.g., `/us/california/restaurants` vs `/jp/tokyo/restaurants` vs `/fr/paris/restaurants`) have identical section order
- Old `EarningsClusters` component is deleted from the codebase

### Wave 3 done when:
- 100% of cell hero positions render either a Wikimedia or AI image (no glyph fallback)
- 100% of country pages render a hero photo of the main city's skyline
- 100% of industry pages render a process or end-product photo
- Rendering bug fixed: no html-as-text leaks (verified via E2E test that asserts `<figure>` has exactly one `<img>` child and one `<figcaption>` child)

---

## Open Questions

None — three architectural decisions (margin floor + rebuild, hybrid image strategy, remove # firms) and wave sequencing all confirmed during brainstorming. Ready for implementation plan.
