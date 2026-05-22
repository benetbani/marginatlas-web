# Plan v26 — Edge fix, production-reality audit, and top-200 cities × neighborhoods

> Founder direction 2026-05-22 after discovering every Plan v24 + v25
> commit failed to deploy on Vercel. The live site has been stuck on
> Plan v23 Part 2 (`5c294cb`) for hours. This plan unblocks deploys,
> verifies the actual production state, then expands into a major
> coverage push: top-200 cities with neighborhood-level pages.
>
> Constraint: stay on Vercel Hobby for now. The plan is sized to fit
> within Hobby limits (1 MB Edge functions, 100 GB bandwidth, 100
> deploys/day).

## Goal

1. **Phase A:** Unblock production. Fix the Edge function 1 MB
   overflow caused by Plan v25's data imports. Then audit whether
   the v24+v25 work actually reflects on the live site, and close any
   gaps found.
2. **Phase B:** Top-200 cities × neighborhoods. Build a
   standardization framework that handles the radically different
   scales of NYC, London, Paris, Tokyo, Berlin, Monaco. Pilot on 5
   cities; roll out to 200.
3. **Phase C:** Strategic improvements I would add on my own
   (search, schema markup, mobile audit, internal linking density,
   monitoring) so the platform compounds, not just expands.

## Approval gates

This plan needs five separate "go" approvals from the founder:

| Gate | When | What |
|---|---|---|
| **1** | After this plan is written | The plan itself, end-to-end |
| **2** | After A.5 reality audit | Drift items to fix before Phase B |
| **3** | After B.1 city list draft | The 200-city list |
| **4** | After B.2 neighborhood scheme | Per-city neighborhood depth tier assignments |
| **5** | After B.6 5-city pilot | Approval to roll out remaining 195 |

## Cross-phase quality framework

For every block and every sub-block:

- **Entry criteria** — what must be true before starting
- **Procedure** — exact steps
- **Exit criteria** — observable outcomes proving it's done
- **Quality check** — specific command, probe, or artifact
- **Rollback** — what to do if production breaks

After every block:

- `npx tsc --noEmit` passes
- `npm run prebuild` passes (taxonomy, em-dashes, source-agencies, dead-links, featured-tiles)
- Local `next build` succeeds
- Every Edge function bundle stays under 1 MB
- Sitemap shards each > 1 KB (not the 110-byte empty urlset)
- Vercel deploy reaches "Ready" before next block starts
- Commit + push per block (no half-blocks)

After every phase:

- Founder approval to proceed
- Reality audit re-run on production
- Rollback plan documented

---

# Phase A — Edge fix + production reality audit

Total effort: 1-2 days. Highest priority. Phase B blocked until A is complete.

## A.1 Diagnose the Edge function bloat

### A.1.1 Capture current state

**Procedure:**
1. Run `next build` with `NEXT_DEBUG=true` to get per-route bundle sizes
2. Inspect `.next/server/app/og/cell/` directory: which chunks make up the 1.15 MB
3. Trace the import chain from `src/app/og/cell/route.tsx` outward
4. Confirm hypothesis: `cells.ts` → `triage.ts` → `data/quality/cell_triage_v1.json` (2.8 MB JSON inlined into bundle)

**Quality check A.1.1:**
- File `data/audit/edge_bundle_analysis.md` committed listing chunk sizes and the import chain
- Top 3 contributors to bundle weight identified

### A.1.2 Verify the same issue isn't lurking in other Edge routes

**Procedure:**
1. List every route file with `export const runtime = "edge"`
2. For each: run a bundle-size estimate
3. Flag anything within 80% of the 1 MB cap

**Quality check A.1.2:**
- Edge function inventory committed
- Each marked with current size and headroom

## A.2 Decide fix strategy

Three candidate approaches, each with trade-offs:

### A.2.1 Option α — switch `/og/cell` to Node.js runtime
- **Effort:** 5 minutes
- **Trade-off:** ~50-100 ms slower cold start
- **Pros:** 50 MB function size cap instead of 1 MB; no architectural disruption
- **Cons:** Slightly slower OG image generation; loses Edge-network latency benefits

### A.2.2 Option β — refactor triage/thin_pages out of the import chain
- **Effort:** 1-2 hours
- **Trade-off:** Touches multiple modules
- **Pros:** Keeps Edge runtime; smaller bundles all around
- **Cons:** Harder to maintain; risk of regressing other features

### A.2.3 Option γ — load triage data via Edge KV / runtime fetch
- **Effort:** 4-6 hours plus KV setup
- **Trade-off:** Adds infrastructure
- **Pros:** Permanent fix; data stays small in code
- **Cons:** KV on Vercel Hobby has its own limits; new failure surface

### A.2.4 Decision

**Recommend Option α.** Cold-start delta is imperceptible for OG image generation (which is async anyway and runs at most once per cell URL share). Lowest risk. If Phase B traffic grows and Node runtime becomes a real cost, revisit with Option β.

**Quality check A.2:**
- Decision documented in `data/audit/edge_fix_decision.md`
- Founder informed (but no approval gate — this is a tactical fix, not architectural)

## A.3 Implement the fix

### A.3.1 Switch `/og/cell` runtime

**Procedure:**
1. Edit `src/app/og/cell/route.tsx`: change `export const runtime = "edge"` → `export const runtime = "nodejs"`
2. Run `next build` locally
3. Verify the `/og/cell` route still works: hit it locally, confirm PNG bytes returned

**Quality check A.3.1:**
- Local build succeeds
- `curl localhost:3000/og/cell?country=us&geo=california&industry=restaurants` returns image bytes

### A.3.2 Re-verify all Edge functions

**Procedure:**
1. After the switch, re-inspect Edge function sizes from build output
2. Confirm: any remaining Edge functions are under 1 MB

**Quality check A.3.2:**
- All Edge function sizes captured in `data/audit/edge_sizes_after_fix.md`
- No function above 900 KB (10% safety margin)

## A.4 Push and verify Vercel deploy

### A.4.1 Push

**Procedure:**
1. Commit with clear message ("Plan v26 A.3: switch /og/cell to Node runtime")
2. Push
3. Monitor Vercel dashboard for build progress

### A.4.2 Verify success

**Procedure:**
1. Wait for status = Ready
2. If Failed: read the log, iterate
3. Once Ready: smoke-test production routes:
   - `curl https://www.marginatlas.com/` → 200
   - `curl https://www.marginatlas.com/de/frankfurt/restaurants` → 200
   - `curl https://www.marginatlas.com/sitemap/0.xml` → 200 with XML content > 1 KB
   - `curl https://www.marginatlas.com/og/cell?country=us&geo=california&industry=restaurants` → 200 with image bytes

**Quality check A.4:**
- Deploy status: Ready
- Five smoke-test curls pass
- No "Click for details" in homepage HTML (proves Plan v25 Block 6 is live)

## A.5 Production reality audit

Now that production deploys work, verify every claimed v24+v25 change is actually live. This catches the silent rollback problem we just discovered.

### A.5.1 Build the expected-state checklist

**Procedure:**
Build a checklist with one row per claimed change, including the commit it shipped in and the verification method.

**Expected items (16 total):**

| # | Change | Commit | Verification |
|---|---|---|---|
| 1 | Featured tiles: 6 (not 9), all with $ values, no "Click for details" | a0daf51 + a8f2676 | curl homepage, grep "Click for details" = 0 |
| 2 | /industries page links go to /industries/[slug] | a8f2676 | curl /industries, regex for "/us/california/" = 0 |
| 3 | Sector icons on /industries page | a8f2676 | curl /industries, grep emoji glyphs |
| 4 | Profit waterfall opens by default | a8f2676 | curl cell page, check NetProfitWaterfall section visible |
| 5 | "Estimated" badge on synthesized cells | a8f2676 | curl /xx/yy/restaurants (force synth), grep "Estimated benchmark" |
| 6 | Right TOC further from content | a8f2676 | curl cell page, grep "xl:gap-16" in HTML |
| 7 | Sitemap shards have content | 52ca43f | curl sitemap/0.xml through 4.xml, all > 1 KB |
| 8 | "Show me the numbers" button commits typed input | a8f2676 | manual: type "nightclubs", blur, see state populated |
| 9 | Frankfurt → DE71, not DE7 (Hessen) | 81eebee | curl /de/frankfurt/restaurants, grep "Frankfurt am Main" |
| 10 | Cross-country chart filters LI/MC/CH outliers | b6589a5 | curl restaurant page, verify Liechtenstein not in comparator list |
| 11 | fmtMoney consistent everywhere | 40f6e42 | grep all 17 files use canonical import |
| 12 | /us/california/software-development passes common-sense | a8f2676 | curl page, employees count reasonable for revenue |
| 13 | Negative money renders cleanly | 40f6e42 | curl cell page, check waterfall negatives |
| 14 | Page-fill: 99% of sampled cells render core sections | ef52712 | re-run page_fill_from_supabase.ts |
| 15 | Cell page never 404s on missing data | a8f2676 | curl /xx/yy/restaurants → 200 |
| 16 | Substitution disclosure banner | 8c7c77c | curl /us/california/gyms, grep "Closest comparable category" |

### A.5.2 Execute the checklist

**Procedure:**
1. For each item, run the verification curl/script
2. Record pass/fail in `data/audit/v24_v25_reality_audit.md`
3. For any fail: investigate root cause (was it actually shipped? did the deploy strip it?)

**Quality check A.5:**
- Audit document committed with pass/fail per item
- Pass rate ≥ 95% (15 of 16 items)

### A.5.3 Fix any drift

**Procedure:**
1. For each failed item, decide: re-apply the fix or remove the unfulfilled promise
2. Commit each drift fix separately for traceability
3. Re-run the verification after each fix

**Quality check A.5.3:**
- Pass rate = 100% (16 of 16) before Phase B starts

## A.6 Pre-deploy bundle size guard (preventive)

This is the kind of guard that would have caught the Edge bloat before it shipped. Adding it now prevents recurrence.

### A.6.1 New prebuild script

**Procedure:**
1. Create `scripts/verify_edge_function_sizes.ts`
2. Parses `.next/server/app/**/route.js` files
3. For any file under an Edge runtime path, check size < 900 KB
4. Fail the build if any exceeds

**Quality check A.6:**
- Script committed and wired into `package.json` prebuild chain
- Manual test: artificially bloat a route, confirm prebuild fails

## A.7 Exit criteria for Phase A

- ✅ Production deploy status = Ready
- ✅ All 16 v24+v25 reality-audit items pass
- ✅ No "Click for details" anywhere on production
- ✅ Sitemap shards each > 1 KB on production
- ✅ Pre-deploy bundle-size guard in place
- ✅ Reality audit committed for future reference

**Approval gate 2** before Phase B starts.

---

# Phase B — Top-200 cities × neighborhoods

Total effort: 3-4 weeks of focused work. The big expansion.

## B.1 City selection methodology

### B.1.1 Selection criteria framework

The 200-city list must balance five axes:

1. **Scale** — raw population and metropolitan GDP
2. **Wealth concentration** — so Geneva, Monaco, Singapore make it even though they're small
3. **Geographic diversity** — every inhabited continent represented
4. **SMB economic activity** — actual small-business density (this is what the site benchmarks)
5. **Cultural relevance** — places real people identify with as "the city where this industry is"

**Exclusion rule:** pure tax-haven shells with no real local economy. Bermuda, Cayman, BVI are excluded. Liechtenstein and Andorra are included (they have residents, restaurants, real businesses).

### B.1.2 Weighted scoring formula

```
score = 0.35 × log10(population)
      + 0.25 × log10(metropolitan_GDP_usd)
      + 0.20 × wealth_per_capita_z_score
      + 0.10 × continent_diversity_bonus
      + 0.10 × SMB_density_score
```

Continent diversity bonus = boost for under-represented continents so we don't end up with 150 European cities. Target distribution:

- North America: ~30 cities
- Europe: ~50 cities
- Asia: ~60 cities
- South America: ~20 cities
- Africa: ~15 cities
- Oceania: ~10 cities
- MENA / Gulf: ~15 cities

Total: 200, with ±5 wiggle room for ties.

### B.1.3 Draft list construction

**Procedure:**
1. Pull candidate set from public sources:
   - World Cities Population (Brookings)
   - Mercer Quality of Living
   - Global Financial Centres Index
   - PWC Cities of Opportunity
2. Cross-reference with Margin Atlas existing country coverage
3. Apply scoring formula
4. Top 200 by score
5. Manual adjustment for continent balance (swap ties)
6. Document each city's scoring inputs and tier

**Quality check B.1.3:**
- `data/cities/city_list_v1.json` committed with 200 entries
- Each entry has: slug, country_iso2, population, gdp_usd, wealth_z, continent, tier, score breakdown

### B.1.4 Tier assignment within the 200

Three tiers for neighborhood-depth treatment (see B.2):

- **Tier 1 (top 20)** — mega-metros, get the deepest neighborhood breakdown
  - Likely: NYC, London, Tokyo, Paris, Shanghai, Mexico City, Mumbai, Beijing, Cairo, São Paulo, Lagos, Istanbul, Buenos Aires, Manila, Jakarta, Seoul, Moscow, Bangkok, Karachi, Lahore
- **Tier 2 (next 50)** — major metros, neighborhood breakdown
  - Includes: Berlin, Madrid, Barcelona, Toronto, Sydney, Singapore, Hong Kong, Chicago, Houston, LA, SF, Boston, Miami, Dallas, Atlanta, Denver, Seattle, Vancouver, Montreal, Rome, Milan, Amsterdam, Brussels, Vienna, Warsaw, Prague, Budapest, Stockholm, Copenhagen, Oslo, Helsinki, Dublin, Lisbon, Athens, Tel Aviv, Dubai, Riyadh, Doha, Mumbai-2, Bangalore, Delhi, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Surat, Kuala Lumpur, Manila-2, Bangkok-2
- **Tier 3 (remaining 130)** — mid-large cities, city-level only (no neighborhoods)

**Quality check B.1.4:**
- Each city's tier explicitly assigned
- Tier 1 + Tier 2 count = 70 (the ones that get neighborhood treatment)

### B.1.5 Approval gate 3

Present the 200-city list, tier assignments, and continent distribution. Founder reviews and approves before any neighborhood work starts.

**Quality check B.1.5:**
- Founder signs off on `data/cities/city_list_v1.json`

## B.2 Neighborhood standardization framework

### B.2.1 The standardization problem

The founder identified the core issue: NYC's Manhattan, London's Camden, Paris's 8th arrondissement, and Tokyo's Shibuya are all "central business districts" but they're radically different in:

- Population (Manhattan 1.6M, Camden 270K, 8th 36K, Shibuya 230K)
- Area (Manhattan 87 km², Camden 22 km², 8th 4 km², Shibuya 15 km²)
- Historical context
- Administrative status

**A single scheme that fits all 70 neighborhood-eligible cities will fail.** We need tiered schemes.

### B.2.2 Three-tier neighborhood depth

For each Tier 1 + Tier 2 city, pick the closest of three depth schemes:

#### Scheme α — macro zones (4-7 chunks)
Used when the city's official subdivisions are too fine-grained to be statistically reliable or culturally meaningful at the SMB-benchmark level.

Examples:
- NYC: 5 boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
- London: 5 zones (Central, North, South, East, West)
- Paris: 4 macro (Right Bank Central, Left Bank Central, North Periphery, South Periphery)
- Tokyo: 5 zones (Central [Chiyoda+Chuo+Minato], West [Shinjuku+Shibuya+Setagaya], North [Toshima+Bunkyo], East [Sumida+Koto], South [Shinagawa+Ota])
- Berlin: 4 macro (Mitte/Central, West, East, Periphery)
- Beijing: 6 zones (3rd Ring Inner / Outer, Haidian-Education, Chaoyang-Business, Industrial South, Suburban)

#### Scheme β — official subdivisions (10-30 chunks)
Used when the city's official subdivisions are well-documented at usable scale.

Examples:
- London: 32 boroughs
- Paris: 20 arrondissements
- Tokyo: 23 special wards
- Berlin: 12 districts (Bezirke)
- Madrid: 21 districts
- Barcelona: 10 districts
- Vienna: 23 Bezirke
- Hong Kong: 18 districts
- Singapore: 5 regions + 28 planning areas (use the 28)

#### Scheme γ — city-only (no neighborhoods)
Used for Tier 3 cities and any Tier 1/2 city where no good subdivision scheme exists (or where data is too thin to support sub-city granularity).

### B.2.3 Scheme assignment per city

For each of the 70 neighborhood-eligible cities, the scheme is chosen to balance:

- Data availability (is there country-level depth that maps to subdivisions?)
- Cultural recognition (would a local user think of their neighborhood as a meaningful identifier?)
- Page-count constraint (we want total neighborhood pages × industries to stay under ~5,000 cells, well within Vercel limits)

**Page math:**
- Tier 1 cities (20) at scheme β average 20 neighborhoods × 30 industries = 600 cells/city × 20 = 12,000
- Tier 2 cities (50) at scheme α average 5 neighborhoods × 30 industries = 150 cells/city × 50 = 7,500
- Tier 3 cities (130) at scheme γ, no neighborhood expansion = 0
- **Total new neighborhood-level cells: ~19,500**

That's a lot. We'd blow Vercel build budget. Adjustment:

**Revised math:**
- Tier 1 (20): scheme β, top 20 industries per neighborhood = 20 × 20 × 20 = 8,000
- Tier 2 (50): scheme α, top 15 industries per neighborhood = 5 × 50 × 15 = 3,750
- Tier 3 (130): scheme γ, no new cells
- **Total: ~11,750 new cells**

Combined with existing ~3,500 cells in sitemap = ~15,000 total. Comfortably under Vercel sitemap limit (50K per shard, 5 shards = 250K capacity).

### B.2.4 Manual mapping document

For each of the 70 cities, document:
- Scheme assignment (α / β)
- Neighborhood list (full)
- Slug per neighborhood
- Character classification (see B.3.2)
- Optional: brief description (1 sentence per neighborhood)

Persisted to `data/cities/neighborhoods_v1.json`.

**Quality check B.2.4:**
- All 70 cities have neighborhood schemes documented
- Each neighborhood has slug + character + description
- Total neighborhood count is auditable

### B.2.5 Approval gate 4

Present a sample of 30 cities' neighborhood schemes. Founder reviews for:
- Cultural accuracy (does "North London" map correctly?)
- Scale consistency (are zones roughly comparable across cities?)
- Slug quality (are URLs readable?)

**Quality check B.2.5:**
- Founder signs off on `data/cities/neighborhoods_v1.json`

## B.3 Neighborhood data synthesis

### B.3.1 Three data tiers per neighborhood

For every (neighborhood, industry) cell:

1. **Measured** — if the country stats agency publishes at this granularity (rare, mostly Western Europe metro areas)
2. **Derived** — apply a neighborhood character multiplier to the city-level cell
3. **Synthesized** — fall back to country baseline (Plan v25 path) with neighborhood character modifier

**Pseudocode:**

```typescript
function getNeighborhoodCell(country, city, neighborhood, industry):
  // 1. Try measured
  const measured = await getRegionalCell(country, neighborhoodGeoId, industry)
  if (measured) return measured

  // 2. Try derived from city-level
  const cityCell = await getRegionalCell(country, cityGeoId, industry)
  if (cityCell):
    const character = NEIGHBORHOOD_CHARACTER[city][neighborhood]
    const multiplier = CHARACTER_MULTIPLIERS[industry][character]
    return applyMultiplier(cityCell, multiplier)

  // 3. Synthesize from country baseline
  const synthesized = synthesizeCell(country, industry, { geoSlug: neighborhood })
  const character = NEIGHBORHOOD_CHARACTER[city][neighborhood]
  return applyMultiplier(synthesized, CHARACTER_MULTIPLIERS[industry][character])
```

### B.3.2 Neighborhood character classifier

Tag each neighborhood as one of:

- `central-business` — financial / corporate density, high commute volume, low residential
- `affluent-residential` — wealthy residential, premium retail support
- `mid-residential` — middle-class residential, mixed retail
- `working-residential` — working-class residential, value retail
- `industrial` — manufacturing / logistics, low retail
- `tourist` — visitor-heavy, hospitality-dominant
- `mixed-urban` — combination, hard to classify
- `academic` — universities, student-heavy economy

### B.3.3 Character multiplier table

Per (industry, character) → multiplier on revenue, n_enterprises, n_employees.

Example rows:

| industry | character | revenue × | n_firms × |
|---|---|---:|---:|
| restaurants | central-business | 1.40 | 1.20 |
| restaurants | affluent-residential | 1.20 | 1.05 |
| restaurants | tourist | 1.30 | 1.40 |
| restaurants | working-residential | 0.75 | 1.10 |
| restaurants | industrial | 0.65 | 0.50 |
| hotels-lodging | tourist | 1.60 | 1.50 |
| hotels-lodging | central-business | 1.40 | 1.20 |
| hotels-lodging | industrial | 0.40 | 0.30 |
| software-development | central-business | 1.50 | 1.40 |
| software-development | academic | 1.30 | 1.50 |
| software-development | industrial | 0.70 | 0.60 |
| jewelry-stores | affluent-residential | 1.80 | 1.20 |
| jewelry-stores | central-business | 1.40 | 1.10 |
| jewelry-stores | working-residential | 0.30 | 0.50 |
| manufacturing-* | industrial | 1.30 | 1.50 |
| manufacturing-* | central-business | 0.40 | 0.20 |

Full table: ~30 industries × 8 characters = 240 cells. Built once, applied everywhere.

**Quality check B.3.3:**
- `data/cities/character_multipliers_v1.json` committed
- Every (industry, character) combination has a value
- Common-sense review: working-class + jewelry = low (yes), industrial + manufacturing = high (yes)

### B.3.4 Synthesis test harness

**Procedure:**
1. Create `scripts/test_neighborhood_synth.ts`
2. For 10 sample (city, neighborhood, industry) combinations, output:
   - Tier of data source (measured/derived/synthesized)
   - Multiplier applied
   - Final revenue_per_firm
   - Sanity: revenue / (employees × wage) ≥ 1.4
3. Manually review: numbers make sense

**Quality check B.3.4:**
- 10/10 samples pass sanity check
- Numbers are within SMB-physical bounds

## B.4 Neighborhood page architecture

### B.4.1 URL scheme

Add a 4-segment route: `/[country]/[city]/[neighborhood]/[industry]`

Examples:
- `/us/new-york/manhattan/restaurants`
- `/gb/london/camden/restaurants`
- `/jp/tokyo/shibuya/restaurants`
- `/fr/paris/8e/jewelry-stores`

The existing 3-segment route `/[country]/[geo]/[industry]` stays — it covers country-level cells and region-level cells. The new 4-segment route is purely for the neighborhood case.

### B.4.2 Route implementation

**Procedure:**
1. Create `src/app/[country]/[city]/[neighborhood]/[industry]/page.tsx`
2. Reuse 90% of the existing cell page; differences:
   - Reads neighborhood from URL
   - Calls `getNeighborhoodCell()` instead of `getCellBySlug()`
   - Renders breadcrumb: Country > City > Neighborhood > Industry
   - Renders neighborhood-character chip
3. Add `generateStaticParams` returning the top 5 (city, neighborhood, industry) combinations per Tier 1 city for SSG; the rest are dynamic

**Quality check B.4.2:**
- Local build successfully generates static params
- Routes resolve: `curl localhost:3000/us/new-york/manhattan/restaurants` → 200
- TypeScript passes

### B.4.3 Neighborhood landing page

For each neighborhood, a hub page at `/[country]/[city]/[neighborhood]` showing:
- Hero: "Industries in Manhattan, New York"
- Character chip + 1-sentence description
- Grid of top industries (with their typical revenue)
- Link back to city
- Sibling neighborhoods strip

**Quality check B.4.3:**
- `/us/new-york/manhattan` renders with all sections
- Sibling strip shows 4 other NYC boroughs

### B.4.4 City landing page extension

The existing `/[country]/[city]` page gets a new section above the industry list:

- "Neighborhoods of New York"
- Card grid: one per neighborhood
- Each card shows character + 1-2 representative industries

**Quality check B.4.4:**
- `/us/new-york` shows the new neighborhood grid
- Mobile renders correctly (cards stack)

## B.5 Linking and navigation

### B.5.1 Breadcrumb

On every neighborhood cell page:
```
Home > United States > New York > Manhattan > Restaurants
```

Each segment a link to its level.

### B.5.2 Sibling-neighborhood strip

On every neighborhood cell page, after the main content:
"Restaurants elsewhere in New York" — cards for the same industry in 4 other neighborhoods of the same city.

### B.5.3 Sitemap inclusion

- Sitemap shard 4 (region-industry hubs) extends to include neighborhood pages
- ~12,000 new URLs added
- Verify shard stays under 50K per Sitemap protocol

### B.5.4 Internal link graph audit

After full rollout, audit:
- Every neighborhood page has at least 8 outgoing internal links (breadcrumb + siblings + industry chips)
- No orphan neighborhoods
- Sitemap link count matches generated route count

**Quality check B.5:**
- Audit committed to `data/audit/internal_links_v2.md`
- Link density per page averages > 12

## B.6 Pilot deployment (5 cities)

### B.6.1 Pilot scope

Start with 5 cities to validate the pipeline:

1. **NYC** (scheme β): 5 boroughs × 20 industries = 100 cells + 5 borough hubs + 1 city hub
2. **London** (scheme β): 10 boroughs (top by SMB density) × 20 industries = 200 cells + hubs
3. **Paris** (scheme β): 10 arrondissements × 20 industries = 200 cells + hubs
4. **Tokyo** (scheme β): 10 wards × 20 industries = 200 cells + hubs
5. **Berlin** (scheme β): 6 districts × 20 industries = 120 cells + hubs

**Total: ~820 new pages.**

### B.6.2 Build + deploy

**Procedure:**
1. Generate all 820 page routes
2. Local `next build` succeeds, all routes pre-render or dynamic-resolve
3. Bundle sizes still under 1 MB Edge cap
4. Push to Vercel
5. Verify deploy = Ready

**Quality check B.6.2:**
- Local build succeeds within 5-minute SSG budget
- Deploy: Ready
- 10 spot-curls on pilot URLs return 200

### B.6.3 Visual QA

**Procedure:**
1. Visit each pilot city's hub page
2. Visit 3 random neighborhoods per city (15 total)
3. Visit 5 random neighborhood × industry cells (25 total)
4. Check:
   - Hero label correct
   - Character chip present
   - Sibling strip populated
   - Numbers within SMB-physical bounds
   - Estimated badge appears on synthesized cells
   - Breadcrumb works

**Quality check B.6.3:**
- 40 spot-checked pages all render correctly
- No "Click for details" anywhere

### B.6.4 Approval gate 5

Present 5-city pilot to founder. Founder reviews UX, data plausibility, neighborhood character feel.

**Quality check B.6.4:**
- Founder signs off on pilot before remaining 65 cities roll out

## B.7 Full rollout (remaining 65 cities)

### B.7.1 Batch by tier

- **Batch 1:** remaining 15 Tier 1 cities. ~3,000 new pages.
- **Batch 2:** Tier 2 cities (50). ~3,750 new pages.

### B.7.2 Per-batch validation

**Procedure for each batch:**
1. Add cities to `neighborhoods_v1.json`
2. Local build
3. Edge function size check
4. Push
5. Verify Vercel deploy = Ready
6. Spot-check 20 random pages from the batch
7. Re-run page-fill audit; expect ≥99% ok

**Quality check B.7:**
- Each batch ships independently with audit
- Production stays Ready throughout

### B.7.3 Final state verification

After all 200 cities live:
- Run `scripts/audit/page_fill_from_supabase.ts` against the full surface
- Sitemap shows correct URL count
- Search engines pinged with new sitemap

**Quality check B.7.3:**
- Final audit: ≥99% pages render core sections
- Sitemap correctly lists ~12,000 new URLs
- No 5xx errors on any sampled neighborhood URL

## B.8 Exit criteria for Phase B

- ✅ 200 cities present in city list
- ✅ 70 cities have neighborhood schemes
- ✅ ~12,000 new neighborhood-level pages live
- ✅ Every page renders with synthesized + character-modified data
- ✅ Sitemap reflects all new URLs
- ✅ Internal link graph audited
- ✅ Page-fill audit ≥ 99% ok

---

# Phase C — Strategic improvements (parallel-runnable)

These are improvements the founder didn't explicitly request but that materially help the platform. Each is small enough to ship between Phase B batches, or after Phase B if scope is tight.

## C.0 Pre-deploy bundle size guard

Already covered in A.6, restated for clarity: this is the most important preventive control on the list. Without it, future imports can silently re-blow the Edge function cap and we waste hours.

## C.1 Site search

### C.1.1 Architecture
Postgres full-text search over `regional_cells.geo_name + industry_name`. Client-side debounced autocomplete via existing `/api/cell-lookup` endpoint (extend it).

### C.1.2 UI
Replace the header "Search" button with active functionality. Cmd+K opens overlay. Top 10 matches with sector icon + typical revenue.

**Quality check C.1:**
- Search returns results for 50 representative queries
- Median response < 200 ms

## C.2 Mobile responsive deep audit

### C.2.1 Lighthouse mobile probe
Run Lighthouse on 20 representative pages (different industries, different countries, mix of measured / derived / synthesized cells).

### C.2.2 Fix top issues
Address findings classified "high impact" by Lighthouse:
- LCP > 2.5s on hero
- CLS > 0.1
- INP > 200 ms

**Quality check C.2:**
- 20-page Lighthouse report committed
- Top 3 LCP/CLS regressions fixed

## C.3 Schema.org markup

### C.3.1 LocalBusiness on cell pages
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Restaurants in Manhattan",
  "address": { "@type": "PostalAddress", "addressLocality": "Manhattan", ... }
}
</script>
```

### C.3.2 Place schema on neighborhood pages
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Place",
  "name": "Manhattan, New York",
  "geo": { "@type": "GeoCoordinates", "latitude": 40.78, "longitude": -73.97 }
}
</script>
```

### C.3.3 BreadcrumbList everywhere

**Quality check C.3:**
- Google Structured Data Testing Tool passes for 5 sample pages
- No schema errors

## C.4 Internal linking density

### C.4.1 Sibling enrichment
Every cell page automatically links to 5-10 sibling cells (same industry / same neighborhood / same city / same country).

### C.4.2 Topic clusters
Industries within the same sector cross-link.

**Quality check C.4:**
- Median outgoing links per cell page ≥ 12
- Crawl simulation shows full graph reachable from homepage in ≤ 4 clicks

## C.5 Production monitoring

### C.5.1 Vercel Speed Insights
Enable on the project (free on Hobby). Surfaces real-user LCP/CLS/INP per route.

### C.5.2 Sentry build-failure alerts
Configure Sentry to email on Vercel build failures so we don't discover them via screenshot.

### C.5.3 Sitemap ping
After major deploys, ping Google + Bing sitemap endpoints. (Note: Google deprecated sitemap-ping mid-2023, but Bing still accepts. Use IndexNow instead for Google.)

**Quality check C.5:**
- Speed Insights showing data 24h after enable
- Sentry alert fires on a test failure
- IndexNow integration tested

## C.6 Cross-city comparison

A new `/compare` extension: pick two cities, see same-industry side-by-side. Already partially exists; verify it handles the new neighborhood-aware data.

**Quality check C.6:**
- /compare works for 10 sample pairs
- Visual layout symmetrical

## C.7 Methodology page update

Reflect the new neighborhood synthesis in the methodology page so users understand where the numbers come from. Updates:
- Add neighborhood-character section
- Add synthesis explanation
- Add Estimated-badge explanation

**Quality check C.7:**
- Methodology page reads cleanly
- All sections present and cross-referenced from data sources

---

# Risk register

| Risk | Impact | Mitigation |
|---|---|---|
| Edge function size grows again after fix | Production deploys block | A.6 pre-deploy guard |
| Vercel Hobby bandwidth cap hit during rollout | Site goes 503 | Monitor Vercel usage; pause batch rollout if > 50% cap |
| Neighborhood synthesis produces wrong-feeling numbers | User trust erodes | B.3.4 sanity harness; founder review at gate 4 |
| Sitemap exceeds 50K URLs per shard | SEO degradation | Sharding strategy in sitemap.ts; current 5-shard plan supports up to 250K URLs |
| Country baseline data is wrong for many countries | Numbers off | Audit + adjust during Phase B.3 |
| Build SSG timeout hits at >2000 static pages | Deploy fails | Tighten generateStaticParams to top-N per city |
| Sentry / Speed Insights cost on Hobby | Surprise bill | Confirm both free at our scale before enabling |

# Rollback plans

- **Phase A:** if any A.x commit breaks production, `git revert` the commit and redeploy. The fix is small enough to roll back cleanly.
- **Phase B:** each batch is its own commit. Revert the offending batch.
- **Phase C:** items are independent; revert individually.

# Out of scope (Plan v27+)

- Auth + Stripe (B-011 still parked)
- Real-image commissioning per neighborhood
- Multi-language UI
- API for synthesized cells
- Map view of neighborhoods
- Mobile native app
- Real-time data streaming
- City-vs-city benchmark battles
