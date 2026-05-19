# Plan v13 Wave 4 — Credibility Follow-up Design

**Date**: 2026-05-19
**Anchor**: Second founder review (after Waves 1-3 narrow shipped). Founder identified 8 remaining workstreams across cleanup, taxonomy, images, discoverability, and design polish. This spec consolidates the response.

---

## Context

After Waves 1, 2, 2b, and Wave 3 narrow (rendering bug + audit) shipped, the founder walked the live site again and surfaced:

1. **Old "0% earn under $X" clustering chart still rendering somewhere** — we replaced it on the cell page in Wave 2 but it persists on another surface. Catastrophic.
2. **"Average staff 3.3 people" displayed and looks dubious** — the n_employees / n_enterprises derivation is shown without the firm-count denominator (which we removed), making it look broken.
3. **Sub-regional pages only work for US** — 36 countries have non-CITY regional data in the DB but the country-page UI doesn't expose a sub-regions navigation list for non-US countries.
4. **Loud "we don't have firm-level numbers for X" banners** — empty-state warnings that broadcast brokenness instead of degrading silently.
5. **Industry taxonomy mis-bundles** — `auto_dealers_gas` mixes two unrelated business models. ~30-60 bundles need audit + splits.
6. **Image system at scale, NO AI, ~$20 budget** — current Wikimedia-only manifests have weak coverage. Founder wants Unsplash/Pexels-orchestrated approach with manual top-up for top pages.
7. **Flags missing on homepage + many surfaces** — Wave 1 only flipped the most-visible flag call sites; ~8 less-prominent ones still render emoji.
8. **Visual monotony** — every section looks like a rounded card on cream background. Founder finds it "boring."

---

## Architectural Decisions (made during brainstorming)

| # | Decision | Rationale |
|---|---|---|
| **D1** | **Image strategy: Unsplash + Pexels orchestrated, Wikimedia for landmarks only, manual override system for top 30 pages, optional $12 Unsplash+ monthly top-up** | Founder ruled out AI. The right answer is to use the free APIs we already have keys for (currently underutilized — Plan v12 only successfully populated Wikimedia) with better query templates. Hand-pick top 30 pages from Unsplash+ for premium quality. Total cost $0-12/month. |
| **D2** | **Empty-state policy: SILENT OMISSION** | Founder said "remove all those shitters" (banners that scream what's missing). Overrides the Plan v13 design's "sections always render, never disappear" rule. Sections with no data don't render at all. Page is shorter but never broadcasts brokenness. |
| **D3** | **Remove avg-staff display everywhere** | The 3.3 employees/firm number is technically correct but looks suspect now that the firm-count denominator was removed in Wave 1. Strip it from all public render paths. |
| **D4** | **Industry taxonomy: full audit + split obvious mis-bundles** | Systematic pass across all 206 industries. Surface every mis-bundle in /admin/review. Founder approves the split list, then execute splits + URL redirects from old→new. |
| **D5** | **Sub-regional UI for non-US: add a regions list to country pages** | Data already exists for 36 countries (per Wave 1 manifest). The fix is UI-only: when `hasRegionalCoverage(iso2)` is true AND the country isn't the US (which has its own state-list UI), render a "Regions" navigation block on the country page that lists every sub-region with cells, sorted by row count. Click → existing sub-regional cell pages. |
| **D6** | **Sequencing: four sub-waves** | 4a cleanup (1 day), 4b taxonomy (1-2 days), 4c images (2 days), 4d discoverability+design (1-2 days). Cleanup first for fast credibility, taxonomy next because URL redirects need to settle, images third (slowest), polish last. |

---

## Wave 4a — Cleanup (≈1 day)

### W4-B — Find and kill the orphan clustering chart

Wave 2 deleted `DistributionHistogram` usage from the cell page but the COMPONENT file still exists on disk. The founder reports seeing the old "0% earn under $X" cluster bars somewhere. Suspects:
- `src/app/embed/[country]/[geo]/[industry]/page.tsx` (embed variant)
- `src/app/industries/[industry]/page.tsx` (industry page, just rebuilt in Wave 2b — may have inherited the cluster chart import)
- `src/app/[country]/page.tsx` (country page)
- The bought-domain production site (not yet deployed — confirm)

**Approach**:
1. Grep for every import of `DistributionHistogram`, `DistributionBars`, `RangeBars`, `EarningsClusters`
2. For every hit, replace with `RevenueTiles` + `RevenueDistribution` from the Wave 2 components
3. Delete the orphan component files (`DistributionHistogram.tsx`, `DistributionBars.tsx`) so they can't be re-introduced

### W4-C — Remove avg-staff display

Grep for `n_employees`, `nEmployees`, `avgEmployees`, `staffPerFirm`, `staff_per_firm`, `n_emp / n_ent`, "average staff", "employees per firm". For every public render path, delete the display element. Keep DB field for internal use.

### W4-E — Silent-omission empty states

Sweep cell / country / industry pages for any explicit "Not available", "We don't have data", "Coming soon", "no firm-level numbers" text. Wrap the parent section in a null check so the entire section drops out when underlying data is missing.

Specific known culprits:
- `MarginWaterfall` empty state — "Margin breakdown not available."
- `RevenueTiles` empty state — "Earnings distribution not available for this cell."
- `RevenueDistribution` empty state — "Distribution shape not estimable for this cell."
- Country page stub sections ("Coming soon" placeholders left by Wave 2b)
- Any `CellWarningChips` chip that fired on a small-sample warning

Replace all with: render nothing.

### W4-G — Flag sweep

The Wave 1 implementer flagged 8 less-prominent flag call sites that still use emoji:
- `SectorAcrossWorld`, `AcrossCountriesStrip`, `FeaturedCellTile`, `GlobalSearch`, `NavigatorForm`, `FirstFrameStrip`, `CellOfTheWeek`, breadcrumb glyph

Plus the homepage which the founder says "needs flags but doesn't have them."

For each call site, replace `flagFromIso2(iso2)` emoji string with `<CountryFlag iso2={iso2} countryName={name} />`. Verify every flag rendering on the homepage.

---

## Wave 4b — Taxonomy Audit (≈1-2 days)

### W4-F — Full bundling audit + splits

**Phase 1 — Audit**:
A Python script reads every industry in `src/lib/taxonomy/industries.json`. For each, it cross-references:
- The industry's `examples[]` list
- The industry's NAICS-3 codes (and what NAICS-6 codes roll up under each)
- The industry's keywords
- Cross-NAICS heterogeneity score (multiple NAICS-3 in same industry = candidate split)

Output: `delivery/quality/taxonomy_bundling_audit_v1.json` with a list of every industry that mixes:
- Multiple business models (e.g., auto dealers + gas stations)
- Multiple customer segments (e.g., B2C food retail + B2B food wholesale)
- Service + product (e.g., auto_dealers_gas: car SALES + fuel RETAIL)
- Capital-intensive + capital-light (e.g., property_mgmt: brokerage + maintenance)

Each entry in the audit gets:
- `industry_id`, `current_name`, `current_examples`, `current_naics_3`
- `dubious_because`: short explanation
- `suggested_splits`: array of `{new_id, new_name, examples_subset, naics_3_subset}`
- `recommended_action`: "split" / "rename" / "keep"

**Phase 2 — Founder review**:
Audit surfaces in `/admin/review` new "Taxonomy" tab. Founder marks each entry as approve-split / approve-rename / leave-as-is. UI writes decisions back to `delivery/quality/taxonomy_review_decisions.json`.

**Phase 3 — Execute approved splits**:
- For each approved split, mutate `src/lib/taxonomy/industries.json` (add new entries, remove old)
- For URL changes, write a redirect map in `src/middleware.ts` (e.g., `/us/california/auto-dealers-gas` → `/us/california/auto-dealers`)
- Re-ingest affected cells from the original NAICS data to redistribute revenue/employees into the split categories (Python script)
- Update `industry_margins.json` to add entries for new split industries

**Phase 4 — Verify**:
Spot-check ~10 affected URLs to ensure redirects work and the split data looks right.

---

## Wave 4c — Image System Rebuild (≈2 days)

### W4-A — Unsplash + Pexels orchestrated rebuild

**Step 1 — Better query templates** (`scripts/images/queries_v2.py`):

For cities (hero shot):
- Primary: `"{city_name} skyline aerial golden hour"`
- Secondary: `"{city_name} downtown panorama"`
- Tertiary: `"{city_name} cityscape sunset"`

For industries:
- Primary: `"{industry_descriptor} interior professional"` (e.g., "specialty coffee shop interior professional")
- Secondary: `"{industry_descriptor} workspace modern"`
- Tertiary: `"{end_product_descriptor} studio"`

For countries:
- Primary: `"{capital_city} skyline aerial"`
- Secondary: `"{country_name} famous landmark"`
- For US: Manhattan skyline. For UK: London Tower Bridge. For DE: Brandenburg Gate. Hand-curated mapping for top 50.

**Step 2 — Source ordering** (`scripts/images/fetch_sources_v2.py`):
1. Unsplash (5000/hr in production with proper API key; 50/hr demo)
2. Pexels (200/hr free)
3. Wikimedia (landmarks only, when the slug matches the `FAMOUS_LANDMARKS` whitelist)

**Step 3 — Quality filter** (`scripts/images/pick_best_v2.py`):
- Require width >= 1600px (panoramic)
- Require landscape orientation (width / height > 1.3)
- Prefer Unsplash > Pexels > Wikimedia for non-landmark queries
- Reject obviously-portrait or square images even if relevance is high

**Step 4 — Manual override system** (`data/images/manual_overrides_v1.json`):
A JSON file the founder can edit by hand to override any auto-picked image. Format:
```json
{
  "countries/US": { "url": "https://images.unsplash.com/...", "attribution": "Photo by ... on Unsplash" },
  "cities/new-york": { "url": "...", "attribution": "..." }
}
```
The lookup helper (`src/lib/images.ts`) checks `manual_overrides_v1.json` first; falls back to the auto-built manifest. This lets the founder cherry-pick the top 30 hero images personally if desired.

**Step 5 — Optional Unsplash+ top-up**:
If the founder wants premium for top 30 pages, sign up for Unsplash+ ($12/month), download 30 hand-picked panoramic shots manually, drop them into `public/images/manual/`, register URLs in `manual_overrides_v1.json`.

**Step 6 — Build and replace**:
- Run rebuild script across all 191 countries + 207 cities + 191 industries
- Compare new manifests to old; backup old to `*_v1_backup.json`
- Replace `data/images/*_manifest.json` with v2 outputs

---

## Wave 4d — Discoverability + Visual Polish (≈1-2 days)

### W4-D — Sub-regions navigation for non-US countries

Modify `src/app/[country]/page.tsx`:

For countries where `hasRegionalCoverage(iso2) === true` AND `iso2 !== "US"` (US has its own state list UI already), add a section after `top-cities` and before `tax-overview`:

```tsx
<section id="regions">
  <h2>Regions of {country_name}</h2>
  <ul>
    {regions.map(r => (
      <li><Link href={`/${iso2}/${r.slug}`}>{r.name} ({r.cell_count} industries)</Link></li>
    ))}
  </ul>
</section>
```

Data source: query Supabase `regional_cells` table for distinct `geo_id`s per country (excluding `*-CITY-*` rows). Cache in a build-time JSON at `data/coverage/non_us_regions_v1.json` so the page doesn't hit DB on every render.

### W4-H — Visual section differentiation

Replace the "every section is a cream card" monotony with **alternating section backgrounds** + light section-type accents:

- Section 1 (hero): `bg-ink-900` (dark — the hero already has this treatment)
- Section 2 (revenue tiles): `bg-cream-50`
- Section 3 (revenue distribution): `bg-white`
- Section 4 (margin waterfall): `bg-cream-100` (slightly darker cream)
- Section 5 (tax/cost panel): `bg-white`
- Section 6 (related cells): `bg-cream-50`

Section-type accent tweaks layered on top of the alternation:
- Tiles: no inner card border, just big typography on the cream tone
- Distribution: no axes, no card, curve flows edge-to-edge in the white section
- Waterfall: horizontal bars span full section width (no inner card wrapper)
- Tax/cost: keep its inner card but switch the border to thin moss-green (signals "estimation")
- Related: grid layout, no inner cards

**Implementation**: extend `src/lib/page-layout/section-order.ts` with a `SECTION_TONES` map keyed by section id. Each cell/country/industry page reads the map and wraps each section in the corresponding background class.

Deferred to Wave 5: per-section icon eyebrows, hover micro-interactions.

---

## Out of Scope (Wave 5+)

- Production deployment (separate concern — Wave 4 is dev work only)
- Real SEO optimizations beyond alt-text on images
- Multi-language image alt text
- Per-cell unique image override (currently only country/city/industry get hero images)
- Mobile responsiveness audit (assumed Tailwind defaults suffice for now)
- A/B testing infrastructure

---

## Acceptance Criteria (per sub-wave)

### Wave 4a done when:
- Grep for `DistributionHistogram|EarningsClusters|RangeBars` returns 0 hits across `src/app/`
- Grep for `n_employees|avgEmployees|staff_per_firm` returns 0 public render-path hits
- No "Not available for..." / "Coming soon" / "We don't have" text on any cell, country, or industry page when fetched
- Every flag rendered anywhere uses `<CountryFlag>` (verified by grep for emoji flag patterns)

### Wave 4b done when:
- `/admin/review?tab=taxonomy` shows the audit with founder-approved decisions
- Approved splits executed in `industries.json`
- URL redirects in middleware.ts cover all renamed industries
- ~10 spot-checked cell URLs render correctly after the splits

### Wave 4c done when:
- `cities_manifest.json` has at least 70% Unsplash entries (not Wikimedia)
- `industries_manifest.json` has at least 70% Unsplash entries
- `countries_manifest.json` has Wikimedia entries only for the FAMOUS_LANDMARKS whitelist; everything else is Unsplash
- `manual_overrides_v1.json` exists with at least the top 5 founder picks (or empty if founder hasn't added any yet)
- Image rendering bug from Wave 3 still fixed (no HTML in attribution captions)

### Wave 4d done when:
- All 35 non-US countries with regional data show a clickable Regions list on their country page
- Sections on cell / country / industry pages have visually distinct treatments (verified via DOM inspect: at least 3 different background tones across the section stack)
- Sister pages still render the same canonical section order (Wave 2b guarantee not violated)

---

## Open Questions

None — six architectural decisions confirmed during brainstorming:
1. Image strategy (Unsplash + Pexels + manual top-up)
2. Empty-state policy (silent omission)
3. Avg-staff display (remove)
4. Taxonomy audit (full + splits)
5. Sub-regional UI (add nav list for 35 non-US countries)
6. Sequencing (4a → 4b → 4c → 4d)
