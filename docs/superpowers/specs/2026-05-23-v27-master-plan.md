# Plan v27 — Master plan: extrapolation closure, coverage indicator, cities deep build, knowledge base

**Status:** drafted 2026-05-23, awaiting execution
**Predecessor:** v26 (restoration + cities), reformation R1 (4 of 20 ideas shipped)
**Trigger:** founder direction over Remote Control, paraphrased:
"Finish the extrapolation for the whole website, never leave a page
blank when a number is needed. Use GDP per capita and corruption
index in the formula. Keep all 195 countries. Add a coverage
indicator. The top-200 cities section on the homepage is still not
elegant; build sub-pages for metropolis coverage, neighborhood
coverage, curiosities, and given-city comparisons (London vs NYC,
NYC vs LA, SF vs Shenzhen). Build a knowledge base (not a blog)
for SEO. Detailed, ambitious, methodical."

## Headline

Four lanes, sequenced for compounding leverage:

1. **Lane A — Extrapolation closure.** Every (country, industry,
   size_band) the site can render gets a defensible estimate.
   Formula upgraded from a single revenue_multiplier to a 4-factor
   model: GDP per capita, corruption index (CPI), urbanization,
   sector-specific elasticity. 195 countries × ~30 industries × 3
   size bands = ~17,500 cells. Most exist; we fill the gap.
2. **Lane B — Coverage indicator.** Universal disclosure component
   ("Measured / Regional / Estimated / Modeled") that ships on
   every cell, neighborhood, country, and industry page. Replaces
   the ad-hoc EstimatedBadge + CellFallbackBanner duo with a single
   honest signal users learn to read.
3. **Lane C — Top-200 cities deep build.** Redesigned homepage
   section + four new sub-page archetypes:
   - **Metropolis pages** (`/cities/{slug}`): hero, neighborhood
     map, industry mosaic, curiosities, comparisons, sister cities.
   - **Neighborhood hub pages** (`/cities/{slug}/neighborhoods`):
     one page per city listing every neighborhood with character
     tag and headline industry.
   - **Curiosities pages** (`/cities/{slug}/curiosities`): the most
     expensive industry, the most popular industry, the most
     underrepresented, the most surprising — six to eight
     screen-ready facts per city.
   - **City-vs-city comparison pages**
     (`/compare/cities/{a}-vs-{b}`): the classics — London vs NYC,
     NYC vs LA, SF vs Shenzhen, Tokyo vs Seoul, Paris vs Berlin,
     Mumbai vs Delhi, Dubai vs Singapore, Mexico City vs São Paulo.
4. **Lane D — Knowledge base.** Not a blog. An SEO-engineered
   reference site at `/learn/...` covering the language and
   concepts a curious operator types into Google: "what is a healthy
   restaurant profit margin," "how much does a small law firm
   make," "how to read industry benchmarks." 60 evergreen pages,
   templated, with deep internal links into Atlas.

## Why now

- The fall-through to pure synthesis at render-time is real but
  expensive: every cold render that goes country → fallback eats
  Supabase budget and shows the EstimatedBadge anyway. Doing it
  once at ingest is cheaper and more legible.
- The site is 85% extrapolated already. The remaining 15% is
  what looks "broken" to a curious visitor. Closing the gap is
  the highest-impact bounce-rate fix available.
- Cities are the most-shared URL pattern. A NYC user types
  "san francisco software" or "london restaurants" before they
  type a country. The cities lane unlocks the bulk of organic
  SEO upside.
- The knowledge base is the SEO multiplier. Atlas's current
  benchmark URLs target transactional intent ("restaurant
  revenue London"); knowledge-base URLs target informational
  intent ("how much does a restaurant make"). Same audience,
  different funnel position.

## Lane A — Extrapolation closure

### A.1 Enhanced country baseline

Augment `country_smb_baseline.json` from 3 fields to 6:

```json
{
  "DE": {
    "payroll_per_employee_usd": 49000,
    "revenue_multiplier": 1.4,
    "currency": "$",
    "gdp_per_capita_usd": 52000,
    "cpi_score": 78,
    "urbanization_pct": 77,
    "world_bank_region": "Europe & Central Asia"
  }
}
```

Sources (internal only, never named in UI per R-002):
- `gdp_per_capita_usd`: World Bank WDI 2024 nominal
- `cpi_score`: Transparency International Corruption Perceptions
  Index 2024 (0-100, higher = cleaner)
- `urbanization_pct`: UN Population Division 2024
- `world_bank_region`: standard 7-region code

Coverage target: **all 195 sovereign states + 28 dependencies/
territories** that Atlas already lists in COUNTRIES.

### A.2 4-factor extrapolation formula

Current formula (Plan v25):
```
revenue_per_firm = global_industry_median × country.revenue_multiplier
```

New formula:
```
revenue_per_firm = global_industry_median
  × gdp_factor(country)
  × cpi_factor(country, industry)
  × urbanization_factor(country, industry)
  × sector_elasticity(industry)
```

Where:
- `gdp_factor = clamp(gdp_per_capita_usd / 35000, 0.15, 3.0)`
  (35k is the global SMB-weighted median; clamps prevent
  Luxembourg outliers and Burundi underflows.)
- `cpi_factor = 1.0` for sectors with low corruption exposure
  (e.g., restaurants, retail).
  `cpi_factor = 0.7 + 0.6 × (cpi_score / 100)` for sectors with
  high corruption exposure (construction, mining, logistics,
  legal, real estate). Hi-CPI countries get a small revenue
  premium because shadow economy is smaller and reported revenue
  is closer to true revenue.
- `urbanization_factor = 1.0 + 0.4 × (urbanization_pct − 50) / 50`
  for urban-dominant industries (software, finance, consulting);
  flat 1.0 for rural-neutral industries (restaurants); inverse
  for rural-dominant industries (agriculture, forestry).
- `sector_elasticity`: 0.5 (deeply local services: barbers,
  laundromats) to 2.5 (highly tradable: software, professional
  services).

Result for every (country, industry, size_band) is clamped to
`REVENUE_PER_FIRM_BOUNDS` so the global SMB-physical sanity
checks still hold.

### A.3 Ingest pipeline

New script `scripts/ingest/extrapolation_backfill_v2.ts`:

1. Load enriched country baseline.
2. Load industry classification table (urban/rural/tradable/
   corruption-exposed flags).
3. For each (country, industry, size_band) NOT in
   `extrapolated_cells`:
   - Compute predicted_rev_per_firm with the 4-factor formula
   - Clamp to bounds
   - Write `coverage_tier='X'`, `quality_score = 15 + cpi_score/10`
     (so cleaner-governance countries get slightly higher trust)
   - Write `coverage_source = "Estimated from country and industry
     averages"` (R-002 compliant; never name TI or WB)
4. Run `--dry-run` first, then live in batches of 500.

Acceptance: zero `(country_iso3, industry_id, size_band)` triples
in COUNTRIES × ATLAS_INDUSTRIES × {small, medium, large} are
missing after the script runs. Verified by audit script
`scripts/audit/extrapolation_coverage_audit.ts` (new) — must
report 100%.

### A.4 Percentile re-backfill

Once new rows land, re-run `percentile_backfill.ts` so the p10/
p25/p75/p90 columns are populated for the new rows. Use simple
deterministic ratios from the global SMB distribution
(p10 = 0.32 × mean, p90 = 2.6 × mean, etc.) since we don't have
per-country distributions for synthesized rows.

### A.5 Industry classification table

New file `src/lib/cells/industry_factors.json`:

```json
{
  "restaurants": {
    "urban_factor": "neutral",
    "corruption_exposure": "low",
    "tradability": "local",
    "sector_elasticity": 0.85
  },
  "software_development": {
    "urban_factor": "high",
    "corruption_exposure": "low",
    "tradability": "global",
    "sector_elasticity": 2.4
  },
  "construction": {
    "urban_factor": "neutral",
    "corruption_exposure": "high",
    "tradability": "local",
    "sector_elasticity": 1.1
  }
}
```

Coverage target: every industry in `ATLAS_INDUSTRIES`.

## Lane B — Coverage indicator

### B.1 Single component, single vocabulary

Replace `EstimatedBadge` + `CellFallbackBanner` with one
`<CoverageIndicator />` component. Four tiers:

| Tier | Color | Wording | When |
|------|-------|---------|------|
| **Measured** | green | "Measured from primary data." | `coverage_tier='P'`, `quality_score ≥ 80` |
| **Regional** | blue | "Regional benchmark applied to this geography." | `coverage_tier='G'` or fallback from parent geo |
| **Estimated** | amber | "Estimated from country and industry averages." | `coverage_tier='X'`, quality ≥ 30 |
| **Modeled** | gray | "Modeled from global SMB averages." | synthesizeCell() output, no DB row |

Position: always immediately under the headline number on every
page that displays a number. Compact (single-line chip) on cell
pages; expanded card on hub pages.

### B.2 Sitewide rollout

Every page that displays a number gets the chip:
- Cell pages (`[country]/[geo]/[industry]`)
- Neighborhood pages (`[country]/[city]/[neighborhood]/[industry]`)
- Country pages (`[country]`)
- Industry pages (`/industries/{slug}`)
- Compare pages (`/compare/...`)
- City sub-pages (Lane C)

### B.3 Methodology link

Every chip is a link to `/methodology#{tier}` so a skeptical
visitor can read the underlying formula. The methodology page
already exists; add 4 anchor sections.

## Lane C — Top-200 cities deep build

### C.1 Homepage section redesign

Current homepage "Top cities" section: a flat alphabetical list
with no signal. Replace with a **scrollable continent-grouped
mosaic**:

- **Tabs**: All / Americas / Europe / Asia-Pacific / Africa / Middle East
- **Each card**: city hero photo (Unsplash), city name, country
  flag, one signature industry stat ("Median restaurant revenue
  $1.2M"), and a coverage chip.
- **Sort within continent**: by population, by GDP, by Atlas
  data completeness — toggle.
- **Below the mosaic**: 6 hand-curated "Cities to wander" cards
  (rotating editorial picks).

Implementation: `src/components/home/TopCitiesMosaic.tsx`. Server
component. Reads from `data/cities/city_list_v1.json` and
`data/images/city_heroes_v1.json`.

### C.2 Metropolis pages (`/cities/{slug}`)

Hero (full-bleed Unsplash) → meta strip (country, population,
GDP, currency) → ten-industry mosaic (the city's most
representative SMB industries with median revenue) →
neighborhood mini-map (deep-link to neighborhood hub) →
curiosities strip (deep-link to curiosities page) → sister
cities ribbon (the existing ComparableCitiesRibbon) → "compare
with..." (deep-link to comparison pages).

Status: 23 Tier 1+2 cities have neighborhood schemes; 200 total
cities in city_list_v1.json. All 200 get a metropolis page; the
177 without neighborhood schemes simply omit the mini-map.

### C.3 Neighborhood hub pages (`/cities/{slug}/neighborhoods`)

One row per neighborhood with:
- Name + character tag (CBD, affluent residential, etc.)
- Headline industry (the industry whose multiplier × character
  fit is highest)
- Median revenue for that headline industry
- Deep-link to the (city, neighborhood, industry) cell page

Only the 23 cities with neighborhood schemes get this hub.

### C.4 Curiosities pages (`/cities/{slug}/curiosities`)

6-8 hand-templated facts per city, server-rendered:

1. **Most expensive industry** — highest median revenue per firm
2. **Most popular industry** — most establishments
3. **Most underrepresented** — lowest establishments-per-capita
   vs global norm
4. **Surprise category** — industry with biggest positive delta
   from country average
5. **Tourist factor** — if applicable, the industry mix variance
   between tourist neighborhoods and the city overall
6. **Wage anchor** — median wage vs national wage vs global
   wage, in three sentences
7. **Cost-of-living tier** — bucketed (luxury, expensive, mid,
   affordable, budget)
8. **One historical SMB note** — pre-generated, optional; pulled
   from a small editorial table

Each fact is a server-rendered card with an icon + 2-sentence
body. Templated, not LLM-generated — deterministic numbers
only.

### C.5 City-vs-city comparison pages

URL pattern: `/compare/cities/{slug-a}-vs-{slug-b}` (alphabetical
canonical order).

Seed 20 hand-picked pairs:
- london-vs-new-york
- new-york-vs-los-angeles
- san-francisco-vs-shenzhen
- tokyo-vs-seoul
- paris-vs-berlin
- mumbai-vs-delhi
- dubai-vs-singapore
- mexico-city-vs-sao-paulo
- toronto-vs-vancouver
- madrid-vs-barcelona
- bangkok-vs-ho-chi-minh-city
- nairobi-vs-lagos
- istanbul-vs-cairo
- buenos-aires-vs-santiago
- sydney-vs-melbourne
- hong-kong-vs-taipei
- amsterdam-vs-brussels
- moscow-vs-warsaw
- jakarta-vs-manila
- riyadh-vs-doha

Each comparison page:
- Side-by-side hero (two photos)
- 12-industry side-by-side bar chart (median revenue, log scale)
- Population, GDP, median wage stat block
- Character composition pie (% CBD, % affluent, % working, etc.)
- Three editorial sentences: which city is bigger, which pays
  more, where SMBs are denser
- "Take me to..." deep-link block: 6 deep-links per side
  (e.g., "London restaurants", "NYC software")

Implementation: `/compare/cities/[pair]/page.tsx` — single file,
reads a `city_comparisons_v1.json` seed and computes the rest
from existing data.

### C.6 Sitemap impact

Add to sitemap shards:
- 200 metropolis pages
- 23 neighborhood hub pages
- 200 curiosities pages
- 20 comparison pages
- **Total: ~443 new URLs**

Sitemap shard math after Lane C: existing 6 shards + 1 new
"cities" shard. Each shard stays under the 50k-URL Google limit.

## Lane D — Knowledge base

### D.1 Concept

A separately-routed information site at `/learn/...` that
targets informational queries. Distinct from `/blog/` (which is
news + editorial) and from `/methodology` (which is how Atlas
works).

Design ethos: **the calm encyclopedia, not the SEO content farm**.
Every page exists because a real curious person asked the
question.

### D.2 60-page launch corpus

Three families, 20 pages each:

**Family 1 — "How much does X make?"** (high-volume head terms)
- restaurant, coffee shop, bakery, food truck
- barbershop, hair salon, nail salon, spa
- law firm, accounting firm, dental practice, medical practice
- gym, yoga studio, martial arts dojo
- bookstore, vintage clothing store, comic shop, record store
- plumbing, electrician, HVAC, landscaping

**Family 2 — "What is a healthy margin for X?"** (decision intent)
- restaurant profit margin
- e-commerce profit margin
- SaaS gross margin
- agency margin
- construction margin
- retail margin
- and 14 more

**Family 3 — "How to read benchmarks"** (educational, top-funnel)
- what is a revenue benchmark
- how SMB revenue is measured
- why benchmarks vary by city
- what coverage tier means
- how to use percentile bands
- and 15 more

### D.3 Page template

Every page has:

1. **Headline question** (h1, matches search query)
2. **The one-line answer** (large, bold, with a number where
   possible)
3. **"Show me the data"** — a deep-link block to the relevant
   Atlas benchmarks
4. **3-4 paragraph body** — calm, declarative, no marketing
5. **Related concepts** — cross-links to other knowledge base
   pages
6. **"Explore in Atlas"** — 6 city × industry deep links

Generated from:
- A YAML front-matter + Markdown body per page, in
  `content/learn/{slug}.md`
- An MDX layout component that wires the cross-links
  programmatically from front-matter

Writing: I generate first drafts; user reviews. Tone matches
existing copy. No source citations in body (R-002), but
references are tracked in a private internal table.

### D.4 Internal-link engine

Every Atlas cell page gets a "Learn more" footer block
linking to the relevant knowledge-base entry for that industry.
Every knowledge-base entry gets up to 12 deep-links into Atlas
benchmarks. This forms a tight cross-link graph that
search engines reward.

### D.5 Sitemap and SEO

- Add `/learn/` shard to sitemap
- One `<article>` schema.org block per page
- `<FAQPage>` schema where the page is question-form
- All pages indexed; none `noindex`

## Sequencing

Six weeks of compounding work:

**Week 1 — Lane A foundation**
- Enrich country_smb_baseline.json with GDP/CPI/urbanization (~2 hr)
- Build industry_factors.json (~2 hr)
- Write extrapolation_backfill_v2.ts (~3 hr)
- Dry-run, audit, run live (~2 hr)
- Re-run percentile backfill (~1 hr)

**Week 2 — Lane B + Lane A polish**
- CoverageIndicator component (~3 hr)
- Replace EstimatedBadge/CellFallbackBanner sitewide (~3 hr)
- Add methodology page anchors (~1 hr)
- Audit coverage chip on every page type (~2 hr)

**Week 3 — Lane C: homepage + metropolis**
- TopCitiesMosaic homepage component (~5 hr)
- Metropolis page route + layout (~4 hr)
- Pre-fetch remaining city heroes from Unsplash (~1 hr)

**Week 4 — Lane C: sub-pages**
- Neighborhood hub pages (~3 hr)
- Curiosities pages (~5 hr)
- City-vs-city comparison pages (~6 hr)
- Sitemap shard for cities (~2 hr)

**Week 5 — Lane D: knowledge base foundation**
- /learn/ route + MDX layout (~3 hr)
- First 20 pages (Family 1: "How much does X make") (~8 hr)

**Week 6 — Lane D: knowledge base completion**
- 20 pages (Family 2: margins) (~8 hr)
- 20 pages (Family 3: how to read) (~6 hr)
- Internal link engine (~3 hr)
- Final sitemap + schema audit (~2 hr)

**Total effort**: ~76 hours over 6 weeks. Solo-buildable.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Extrapolation v2 produces an absurd number for some country | Hard bounds + audit script that flags any cell > 5× regional norm |
| Coverage indicator confuses users | Methodology link inline; A/B test wording over a week |
| Knowledge base looks like SEO spam | Calm template, no listicles, real numbers, deep cross-links |
| Comparison page count explodes | Cap at 20 hand-picked pairs; never auto-generate combinatorially |
| Unsplash rate limit blocks city heroes | Demo tier 50/hr; spread fetch over 2 days, cache permanently |
| User-blocked migrations still pending | Lane A doesn't depend on indexes; can ship independently |

## Acceptance criteria

- [ ] Every (country, industry, size_band) triple in
      COUNTRIES × ATLAS_INDUSTRIES × {small, medium, large} has
      a row in `extrapolated_cells`. Zero gaps.
- [ ] CoverageIndicator renders on every page that shows a
      number. No legacy badges remain.
- [ ] Homepage Top-200 mosaic shipped with continent tabs.
- [ ] 200 metropolis pages indexable.
- [ ] 23 neighborhood hub pages indexable.
- [ ] 200 curiosities pages indexable.
- [ ] 20 city-vs-city comparison pages indexable.
- [ ] 60 knowledge-base pages indexable.
- [ ] All new URLs in sitemap.
- [ ] Lighthouse mobile score ≥ 90 on a sample of 10 new pages.
- [ ] No R-002 violations (source-agency names) anywhere in UI.

## Anti-scope (what this plan deliberately does NOT do)

- No LLM-generated body copy. Templates only. Deterministic
  numbers only.
- No combinatorial city-vs-city pages. 20 hand-picked pairs,
  not 200×200.
- No new database tables — everything fits in
  `extrapolated_cells` + JSON content files.
- No new Vercel functions. All new routes are server-rendered
  React with `revalidate`.
- No paid sources. Knowledge-base copy is internal voice.
- No re-architecture of existing cell pages. The new
  CoverageIndicator replaces two existing components in-place.

## Open questions for the user (defer until execution)

These do not block the plan but the user may want to weigh in:

1. **Curiosities tone**: clinical-numerical, or warmer/editorial?
2. **Comparison-page editorial sentences**: do you want to
   review each pair's three sentences before shipping?
3. **Knowledge-base authorship**: byline-free, founder byline,
   or "Atlas team"?
4. **Top-200 mosaic sort default**: population, GDP, or
   data-completeness?

I'll proceed with: clinical-numerical; ship without review
unless flagged; "Atlas team"; population.

## What ships next session

Lane A.1 + A.2: enrich the country baseline file and write the
v2 extrapolation backfill. This is the highest-leverage,
lowest-risk piece and unblocks everything else.
