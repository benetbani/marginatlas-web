# Data expansion research

Date: 2026-05-26.
Author: ben + atlas-bot.
Status: STRATEGY — sequenced plan, not implementation.

Founder ask (paraphrased): "Run quality and filling checks on
business setup costs per country; come up with conclusions on how
we can use the new goldmine resources we found." Extended to
also cover extrapolation, neighborhoods, and the new AOV/breakeven
layer.

This document is a grounded inventory + gap analysis + expansion
plan. Every number cited below was counted from the actual data
files in this repo (not aspirational).

## Part 1 — what we already have

### Country economic profile (`data/economic_indicators/country_profile_v2.json`)

- **196 countries**, ~50 fields each: GDP per capita (nominal + PPP),
  median wage + p25/p75, minimum wage, employer social, VAT, CIT,
  effective CIT, dividend WHT, commercial rent (T1/T2/T3),
  electricity, gas, diesel, lending rate, inflation, FX volatility,
  productivity index, etc.
- **Tier A** (50): hand-anchored from primary sources.
- **Tier B/C** (~146): regional-cluster + GDP-tier interpolation
  from Tier A anchors.

### Business formation costs (`data/legal/business_formation_costs_v1.json`)

- **40 countries** with per-tier (Freelancer / Sole Trader / LLC /
  Joint-Stock) setup cost USD, setup days, complexity score 1-5.
- Coverage: AE AT AU BE BG BR CA CH CZ DE DK ES FI FR GB GR HK HU ID
  IE IN IT JP KR MX MY NL NO PH PL PT RO RU SE SG TH TR UA US VN.
- Sources cited: government registries (gov.uk, service-public.fr,
  IHK, MISE, KvK, ASIC, USPTO state filings, Receita Federal, SAT,
  MCA, ROCs), Chambers of Commerce, and the World Bank Doing
  Business archive 2003-2019.
- **Missing**: every African country except none (zero coverage),
  most of the Middle East beyond AE, most of LatAm beyond BR/MX, and
  every Central Asian + smaller-Asia country.

### Net wealth per adult (`data/economics/net_wealth_per_adult_usd_v1.json`)

- **124 countries** with median net wealth per adult, USD.
- Used to anchor "what does owning a typical local business actually
  do to your wealth" framing on cell + country pages.

### Self-employment share (`data/economics/self_employment_share_v1.json`)

- **123 countries** with self-employment share of total employment, pct.

### Activity AOV (`data/economics/activity_aov_v1.json`)

- **110+ activities** with hand-curated USD AOV (from NRA, Toast,
  Square, IBISWorld category benchmarks, etc.).
- 12 sector-level defaults for fallback (food_drink $18, retail $65,
  beauty $70, professional_services $850, etc.).
- Just shipped (2026-05-26). Drives the breakeven panel on every
  cell page.

### Cities (`data/cities/city_list_v1.json`)

- **252 cities** with slug + name + ISO-2.

### Neighborhoods

- `data/cities/neighborhoods_v1.json`: **1266 neighborhoods** across
  252 cities (mean 5 per city).
- `data/economics/neighborhood_intensity_v1.json`: intensity tags
  (commuter, tourism, financial CBD, luxury district, etc.) for
  **1266** neighborhoods.
  - **21 source_quality A** — hand-curated (Manhattan FiDi, Times
    Square, Shoreditch, La Défense, etc.).
  - **30 source_quality B** — partial hand-curation.
  - **1215 source_quality C** — heuristic-derived from city tier +
    neighborhood character keywords.

## Part 2 — where the gaps actually are

Counted, not guessed.

### Gap 1: Business formation — Africa + smaller Asia + Pacific

|Region|Countries we cover|Countries we don't|
|---|---|---|
|Africa|0|54 (entire continent)|
|Middle East|AE only|15+|
|LatAm beyond BR/MX|0|18 (CL AR CO PE EC VE BO PY UY GT CR PA DO etc.)|
|Central Asia|0|5 (KZ UZ TM KG TJ)|
|Smaller Asia|HK, ID, IN, JP, KR, MY, PH, SG, TH, VN|MM LA KH BD NP LK MN etc.|
|Pacific|AU|NZ + smaller islands|

The Africa hole is the headline. Margin Atlas is increasingly used
by users in Lagos, Nairobi, Cairo, Cape Town — the formation cost
field falls back to "generic emerging market" defaults rather than
real numbers. That's a credibility issue.

### Gap 2: Neighborhood intensity quality

96% of the 1266 neighborhoods are heuristic-derived (source_quality
C). That's fine for the long tail, but the top 50 cities deserve
hand-curation on every neighborhood, not just the famous ones.

Current state by tier:
- **Tier-1 (NYC, London, Paris, Tokyo, etc.)**: ~85% A/B.
- **Tier-2 (Berlin, Madrid, São Paulo, Mumbai, etc.)**: ~30% A/B.
- **Tier-3 (smaller capitals)**: ~5% A/B.

### Gap 3: AOV granularity

The AOV table is per-activity globally — one number per activity
regardless of city. A restaurant AOV of $35 is correct on average
but wrong in:
- Manhattan (~$80)
- Lagos (~$8)
- Tokyo (~$45 for sit-down, ~$12 for ramen counter)

The breakeven panel currently uses the global AOV scaled by the
country tier multiplier from `country_smb_baseline.json`. That works
for first-order accuracy but a city tier scalar would tighten it.

### Gap 4: Extrapolation transparency

The cell page renders a number for every (country × industry) pair,
but the user can't easily see WHICH cells are measured vs estimated
without reading the coverage tier letter on the coverage page. The
SmartImage + smart-data layers know the provenance internally;
nothing surfaces it on the cell page itself beyond the tier letter.

This is a trust problem more than a data problem: the data exists,
the UI undersells the difference.

### Gap 5: Microcoverage spec

We cover the 252 cities most likely to be searched. There is no
strategy yet for the next 500 cities (100k-500k population) where
search demand will grow as the product matures.

## Part 3 — sources that can fill the gaps

### Africa SME data

**Primary sources for formation cost data:**
1. **National investment agencies** (the African equivalent of
   InvestEurope): each country has an investment promotion agency
   that publishes "how to start a business" guides. NIPC (Angola),
   NIPC (Mozambique), NIPC (Cape Verde), KIA (Kenya), NSIA
   (Nigeria), TIC (Tanzania), UIA (Uganda), GIPC (Ghana), etc.
2. **African Development Bank's Open Data Portal**: business
   environment indicators by country.
3. **Doing Business Archive** (2003-2019, frozen): the World Bank
   discontinued it but the historical data is still accurate for
   countries where formation rules haven't changed since 2019. Most
   African countries fit this — formation regimes change slowly.
4. **B-Ready** (the World Bank successor to Doing Business, launched
   2024): 50 economies in pilot, scaling to 180 by 2026. Same
   methodology but updated and free.
5. **Heritage Foundation Index of Economic Freedom**: time-to-start
   numbers per country, refreshed annually.
6. **OECD Africa Investment Climate** reports.

**Estimated coverage gain**: 40 -> ~140 countries in one focused
sprint (Africa + LatAm + Central/smaller Asia + Pacific).

### Neighborhood intensity quality upgrade

**Sources to upgrade C → A:**
1. **WorldPop** + **Meta High-Resolution Population Density**: free
   100m-resolution daytime + nighttime population grids. Convert
   directly to commuter ratio (daytime / residential).
2. **Foursquare Open Source Places**: free dataset of categorized
   POIs (restaurants, offices, retail) with density at the H3 cell
   level. Drives the tag set (financial_cbd, retail_strip,
   tourist_zone) more accurately than keyword matching.
3. **OpenStreetMap Overture Maps**: free buildings + land-use polygons.
   Differentiate residential from mixed-use from CBD.
4. **Inrush / SimilarWeb** (paid, $$$): foot traffic and dwell time
   per neighborhood. Probably too expensive for atlas at this stage.

**Estimated coverage gain**: 21 A + 30 B -> 200 A + 500 B (top 50
cities fully hand-curated, top 200 with partial enrichment) in one
sprint.

### AOV city-tier multipliers

**Approach**: extend `country_smb_baseline.json` with a city tier
multiplier (1.6x for T1 like NYC/London/Tokyo, 1.0x for T2 like
Madrid/Mumbai/São Paulo, 0.7x for T3 like Sofia/Cairo/Lagos). Apply
to the global AOV at render time.

**Sources**: Toast Restaurant Industry Report by metro tier, Square
quarterly small business pulse by city, OpenTable economic reports.
Free for the headline numbers; the metro-level granularity often
needs digging into individual reports.

**Effort**: 1 sprint to extract metro-tier scalars for the top 10
activities (restaurants, cafes, grocery, retail, services), wire
through the breakeven engine.

### Extrapolation transparency

Not a data gap — a UI gap. Surface the per-line confidence in the
waterfall (already implemented in `SmartWaterfall`, just under-used)
and add a "show all sources" expander on every cell page.

**Effort**: ~1 day of UI work + a methodology page update.

### Microcoverage (the long tail of cities)

**Approach**: synthesise rather than curate. The cell page extrapolation
engine already estimates (country × industry); city-level extrapolation
plugs in the city tier + character multiplier on top. For cities we
don't have in `city_list_v1`, the request walks the country page
first, then the user can navigate down by region.

**Sources for the next 500 cities**:
1. **GHS Urban Centre Database** (EU JRC, free): 13,000+ urban
   centres globally with population, area, density.
2. **GeoNames** for canonical naming + ISO 3166-2 admin1 codes.
3. **Wikidata** for the cross-reference (city -> region -> country).

**Effort**: ~1 sprint to ingest GHS, filter to 500-1500 cities,
attach intensity heuristics, add to `city_list_v1.json`. The cell
page will work because extrapolation always returns a number.

## Part 4 — sequenced expansion plan

Four waves, each fits in a focused sprint. Each wave ships a
measurable user-visible improvement.

### Wave 1: Africa SME — formation data parity (1-2 weeks)

Goal: take `business_formation_costs_v1.json` from 40 to 140
countries.

Steps:
1. Pull B-Ready data for the 50 economies they cover (free, JSON).
2. Pull DBA-2019 archive numbers for the remaining 100 (free, CSV).
3. Hand-verify the 10 highest-traffic African countries (NG, KE, ZA,
   EG, GH, ET, CM, DZ, MA, TN) against the national investment
   agency's current published guide. These get tier A.
4. Tier C the remaining 90 from B-Ready/DBA-2019 with a "last
   verified pre-2019" caveat embedded.
5. Add a `last_verified_year` field to the schema; surface it on the
   methodology page only (not the cell page).
6. Wire into the country-page "5-tile hero" (already mounted, just
   needs the data).

**Shipped result**: Africa country pages render real formation
numbers, not the generic-emerging-market fallback.

### Wave 2: AOV city-tier multiplier (1 sprint)

Goal: tighten breakeven accuracy on Tier-1 / Tier-3 city pages.

Steps:
1. Extend `country_smb_baseline.json` (or a new
   `city_tier_aov_multipliers_v1.json`) with multipliers for the top
   10 activities × 3 city tiers.
2. Update `src/lib/economics/breakeven.ts` to apply the multiplier.
3. Update the breakeven panel copy to mention "tier-adjusted" so the
   user knows the number is location-aware.

**Shipped result**: a Manhattan restaurant shows AOV ~$80 not ~$35;
a Lagos one shows ~$8. Breakeven orders/day reflects local reality.

### Wave 3: Neighborhood quality A/B upgrade (2-3 weeks)

Goal: 21 source_quality A → 200 A across the top 50 cities.

Steps:
1. Pull WorldPop daytime + nighttime grids for the top 50 cities.
2. Compute commuter_ratio + tourism_intensity directly from grids
   rather than heuristics.
3. Pull Foursquare OS Places, run H3-level POI density → derive tag
   set (financial_cbd if office density > X, tourist_zone if hotel
   density > Y, etc.).
4. Hand-review the top 5 neighborhoods per city for the top 50
   cities = 250 neighborhoods promoted to A.
5. Auto-promote everything else with WorldPop+Foursquare-derived
   tags to B.

**Shipped result**: decide-wizard ranks neighborhoods on real data,
not keyword matches.

### Wave 4: Microcoverage for the next 500 cities (1 sprint)

Goal: 252 → 750 cities indexed.

Steps:
1. Ingest GHS Urban Centre Database.
2. Filter to cities with population > 100k that are NOT already in
   `city_list_v1.json`.
3. Auto-attach commuter / tourism / tag heuristics from neighborhood
   character of the parent admin1 region.
4. Update `city_list_v1.json` with 500 new entries (source_quality C).
5. Add `/cities/[slug]` SEO sitemap entries so Google indexes them.

**Shipped result**: every city of 100k+ population globally has a
landing page. Long-tail SEO opens up.

### Order rationale

Wave 1 first because Africa is the credibility gap and the data is
literally free. Wave 2 second because it makes the breakeven panel
(just shipped) actually correct for Tier-1 cities. Wave 3 third
because it requires the most data engineering. Wave 4 last because
it's pure ingest + auto-fill (boring but easy).

## Part 5 — what NOT to do

- **Don't buy SimilarWeb / Inrush traffic data** until paid users
  start asking for it. Pre-revenue, the cost-benefit doesn't pencil.
- **Don't try to scrape national tax authorities at scale.** Government
  websites change constantly and the legal posture is unclear.
  B-Ready + DBA-2019 archive is what we should consume — that's
  what they're for.
- **Don't promise an "all-cities" rollout.** Microcoverage is a
  long-tail SEO play; the cells still extrapolate. Be honest about
  which 252 cities have real curation vs the 500 with synth-only.
- **Don't add another tier to the formation schema.** Freelancer /
  Sole Trader / LLC / Joint-Stock is the right ladder; adding cooperatives,
  partnerships, fund vehicles, etc. fragments the user's mental model
  for no SMB benefit.

## Part 6 — open questions for the founder

1. **Africa headline**: should the country pages for the 90
   countries we'd add with DBA-2019-archive data carry a tiny
   "last verified 2019" badge, or hide that detail since formation
   regimes don't change often?
2. **AOV city-tier copy**: do we want the breakeven panel to say
   "in [city]" explicitly, or stay generic? Saying "in Manhattan"
   commits us to defending the Manhattan number.
3. **Microcoverage 100k vs 500k cutoff**: 100k+ adds ~750 cities,
   500k+ adds ~150. Smaller cutoff is more SEO but more synth-only
   pages.
4. **Neighborhood quality budget**: hand-curating 200 city × 5 neighborhoods
   = 1000 deep reviews. Worth a 2-3 week sprint or split into two waves?

## Part 7 — image audit followup (from §7)

The image_integrity audit was 94% rate-limited by Wikimedia. To
fix, either:
1. Add token-bucket throttling (10 req/sec max) — slow but reliable.
2. Build an internal Wikimedia thumb-URL resolver that pre-computes
   canonical URLs from filenames, eliminating the HTTP probe.

Either is half a day of work. Defer until the visual upgrade
workstream calls for re-validating all hero images.

## Conclusion

The data we have is more solid than the gaps suggest — 196 countries
covered for the economic profile, 252 cities indexed, 1266
neighborhoods tagged. The credibility-critical gap is Africa formation
data, which is free to fill. Wave 1 should ship first; everything
else is downstream of trust being established.

Estimated total effort across all four waves: **6-8 focused weeks**
of one developer + data work. The "goldmine" framing matches:
B-Ready, WorldPop, Foursquare OS Places, GHS, OpenTable + Square +
Toast metro reports are all free or near-free public assets. The
moat is in the curation layer that turns those raw inputs into the
atlas-style stat tile + bar list + breakeven gauge.

## Files referenced in this doc

- `data/economic_indicators/country_profile_v2.json` (196 countries)
- `data/legal/business_formation_costs_v1.json` (40 countries)
- `data/economics/net_wealth_per_adult_usd_v1.json` (124 countries)
- `data/economics/self_employment_share_v1.json` (123 countries)
- `data/economics/activity_aov_v1.json` (110 activities)
- `data/cities/city_list_v1.json` (252 cities)
- `data/cities/neighborhoods_v1.json` (1266 neighborhoods)
- `data/economics/neighborhood_intensity_v1.json` (1266 entries, 21 A / 30 B / 1215 C)
- `src/lib/economics/country_metrics.ts` (single accessor for country page)
- `src/lib/economics/breakeven.ts` (AOV + breakeven engine)
- `src/lib/economics/neighborhood_multipliers.ts` (tag composition math)
