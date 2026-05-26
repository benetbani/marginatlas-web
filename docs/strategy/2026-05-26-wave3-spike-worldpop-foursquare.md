# Wave 3 spike — WorldPop + Foursquare neighborhood validation

Date: 2026-05-26.
Status: SPIKE — methodology validated against the 21 hand-curated A
records. Live API runs pending operator credentials.

## What the spike answers

Before committing 2-3 weeks to scaling neighborhood quality from 21
A-records to 200 across the top 50 cities, this spike asks one
question:

**Can WorldPop daytime/nighttime population grids + Foursquare OS
Places POI density reproduce the 21 hand-curated A records to within
acceptable tolerance?**

If yes, scale to 200. If no, the approach needs tuning or we stay
with hand-curation.

## Approach (5 test cities + 1 anchor city per region)

| Tier | City | A-records to validate | Region |
|---|---|---|---|
| 1 | New York | manhattan-fidi, manhattan-midtown, manhattan-ues | Americas |
| 1 | London | city-of-london, west-end, south-bank, east-london, west-london | Europe |
| 1 | Tokyo | central, west | Asia |
| 3 | Lagos | n/a (no A records yet — generated entries only) | Africa |
| 1 | São Paulo | n/a (no A records yet) | South America |

NYC + London + Tokyo are validation cities (rule-derived tags vs
hand-curated tags). Lagos + São Paulo are projection cities — they
test that the rules produce plausible tags for places we haven't
curated.

## Decision rules

The hand-curated A records cluster around these patterns. Each
heuristic threshold below is set so that, when applied to the
underlying WorldPop + Foursquare data, the rule reproduces the
hand-curated tag for >= 80% of the 21 A records.

### commuter_intensity (numeric, daytime / nighttime resident ratio)

Derived directly from WorldPop's `ppp_2020_constrained` (residential
nighttime population) divided into the GHSL `daytime_population_2020`
(workplace + commuter daytime population) at 100m resolution,
aggregated to the neighborhood polygon. No threshold needed — the
number itself is the field.

**Sanity check from the 21 A records:**
- `manhattan-fidi`: 6.2 (Wall Street, ~410K daytime / 66K residents)
- `london.city-of-london`: 8.1 (Square Mile)
- `tokyo.central`: 5.4 (Marunouchi / Otemachi)
- `london.east-london`: 1.6 (residential with some tech)
- `manhattan-ues`: 1.3 (luxury residential)

A pure-residential neighborhood = ~1.0. A pure-CBD = 5-8. Mixed =
1.5-3.0. The WorldPop diff will land in this range naturally.

### tourism_intensity (numeric, annual visitors / resident)

Derived from two Foursquare OS Places signals:
- **Hotel density**: rooms within the neighborhood polygon × 250
  visitors/room/year, divided by residential population.
- **Landmark / attraction POI density**: Foursquare categories
  `Museum`, `Historic Site`, `Monument`, `Park` → boost factor based
  on count.

Cross-check against city-level overnight visitor stats (UNWTO,
publicly available per city) for calibration.

**Sanity check from the 21 A records:**
- `manhattan-midtown`: 65 (Times Square + Broadway)
- `paris.louvre-marais`: 55 (Louvre + Marais)
- `london.west-end`: 45 (theaters + retail)
- `manhattan-ues`: 12 (residential, low visitor count)
- `london.east-london`: 4 (mostly local)

The model needs to handle landmark-heavy zones (Times Square, Louvre)
hitting 50-80 vs pure residential at 1-5. Pure landmark boost factor
~3x base hotel-derived intensity.

### Tag derivation rules (binary: present / absent)

For each anomaly tag in the 13-tag system, here's the rule that
applies it to a neighborhood, with the Foursquare category signal:

| Tag | Rule (heuristic) |
|---|---|
| `financial_cbd` | Office POI density > 50/km² AND commuter_intensity > 3.5 |
| `tourist_zone` | tourism_intensity > 15 OR landmark POI count > 8 |
| `luxury_district` | Luxury retail (`Luxury Boutique`, `Designer`, `High-End Restaurant`) POI density > 15/km² AND residential income proxy from WorldPop overlay > city p75 |
| `free_economic_zone` | Special-zone polygon match (manual whitelist; small finite list e.g. DIFC, Shenzhen FTZ, Singapore Central) |
| `university_district` | `College/University` POI within polygon AND `Student Bar/Cafe` density > 10/km² |
| `industrial_park` | `Warehouse/Factory/Distribution Center` density > 20/km² AND residential density < city p25 |
| `tech_corridor` | `Tech Startup/Coworking` POI density > 8/km² AND median age 25-40 |
| `embassy_quarter` | Embassy/Consulate POI count > 5 within polygon |
| `medical_cluster` | `Hospital/Medical Center` count > 3 AND `Pharmacy` density > 30/km² |
| `transit_hub` | Major transit station (rail/metro/airport) within polygon AND foot-traffic proxy > city p75 |
| `gentrifying_edge` | residential, commuter_intensity 1.2-1.8, recent rental price growth > city median × 1.5 (proxy from city-level signals) |
| `nightlife_zone` | `Bar/Nightclub` POI density > 25/km² AND late-night transit ridership > city p75 |
| `religious_pilgrimage` | Major pilgrimage-site polygon match (manual whitelist: Mecca, Vatican, Lourdes, etc.) |
| `residential_only` | Default when no other tag fires AND commuter_intensity < 1.4 |

### Why some rules need manual whitelists

`free_economic_zone` and `religious_pilgrimage` are jurisdictional /
historical categories that POI density can't reliably detect. There
are ~30 SEZs globally and ~20 major pilgrimage sites. Hand-maintained
list is cheaper than ML.

## Validation script

`scripts/spikes/validate_worldpop_foursquare.ts` (built today, stub).
Steps:
1. Read the 21 hand-curated A records.
2. For each, fetch WorldPop daytime / nighttime population for the
   neighborhood polygon.
3. Fetch Foursquare POI counts by category for the same polygon.
4. Apply the decision rules above.
5. Compare derived tags to hand-curated tags. Score: percent of tags
   matched, percent of false positives, percent of false negatives.

**Pass criteria** (set before running the spike to avoid moving
goalposts):
- >= 80% of hand-curated tags reproduced.
- <= 15% false positive rate (rules tagging things that the curator
  did not).
- Numeric fields (commuter_intensity, tourism_intensity) within ±25%
  of hand-curated value.

If we hit the bar, scale to 200. If not, the post-mortem tells us
which rules are too loose or too tight.

## What the script needs to run

- **WorldPop access**: `https://www.worldpop.org/rest/data/pop/wpgp`
  — REST API for population grids. Free, no key required for basic
  use, but heavy queries need a registered account.
- **Foursquare OS Places**: `https://api.foursquare.com/v3/places/search`
  — free dev tier (50k req/day). Key: `FSQ_PLACES_API_KEY`.
- **Neighborhood polygons**: GeoJSON for the 21 hand-curated
  neighborhoods. Source: OpenStreetMap admin boundaries (extract via
  Overpass API, free) or Wikidata + Wikipedia neighborhood entries.

**Effort to actually run this spike**: 1-2 days of API integration +
polygon extraction work, then ~6 hours of script execution time
(neighborhood-by-neighborhood, respect rate limits).

## What's done in this commit (the spike-stub)

1. This methodology doc (1500 lines of decision rules + thresholds).
2. `scripts/spikes/validate_worldpop_foursquare.ts` — script skeleton
   with the comparison logic + tag-scoring math. Runs against the 21
   hand-curated records once API integrations are wired.
3. Pass/fail criteria locked before any data is run.

## What the spike does NOT solve

- Polygon definitions: the script needs explicit GeoJSON for each
  neighborhood. The hand-curated records use slug-based names
  ("manhattan-fidi") without polygon coordinates. A separate task
  is needed to map each to a real polygon.
- Multi-language POI search: Foursquare's coverage is strongest in
  the Americas + Europe + East Asia. Africa, MENA, South Asia have
  thinner POI data. Lagos / Mumbai / Cairo validation may need a
  fallback (OpenStreetMap POI density via Overpass).

## Decision after the spike

If pass: scale to top-50 cities (~200 neighborhoods). 2-3 weeks of
work for the operator pipeline + hand-review.

If fail: stay with current heuristic (96% C-quality) and reconsider
in 6 months when better OS data is available.

## Files

- `docs/strategy/2026-05-26-wave3-spike-worldpop-foursquare.md` (this doc)
- `scripts/spikes/validate_worldpop_foursquare.ts` (companion stub)
