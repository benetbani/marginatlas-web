# 16 · Track M — Top-100 Cities Priority List

> Strategic anchor for Wave 2. Search volume + economic importance are
> wildly skewed toward ~100 cities globally. The atlas should reflect
> that reality: Istanbul gets a third of Turkey's user attention; Paris
> gets two-thirds of France's; London gets 40% of UK's. Build for that
> distribution, not for uniform coverage.
>
> This track produces the canonical list. Tracks N, O, Q reference it.

---

## 1 · Goal

Lock the **canonical 100-city list** as a structured data file at
`src/lib/cities.ts` (or JSON), with a stable tier classification + per-city
metadata. Every downstream track (UX shortcuts, neighborhood drill-down,
ingest priority) refers to this list.

### Strategic rationale (founder direction)

- Searches concentrate disproportionately: "restaurants in Paris" >> "restaurants in any French département"
- Sub-region coverage is necessary but insufficient — users often skip the region step entirely
- Top metropolises deserve special UX treatment (Track N) + deeper coverage (Track O)
- This list is the "list of lists" — every other Wave 2 track consults it

---

## 2 · Targets

| Metric | Current | Target |
|---|---|---|
| Curated city list | n/a (Phase 18 had 240 cities but no tiering) | **100 cities with tier + metadata** |
| Tier-1 cities (global metropolises) | n/a | **~25 cities** |
| Tier-2 cities (major regional/capital) | n/a | **~50 cities** |
| Tier-3 cities (secondary + niche) | n/a | **~25 cities** |
| Tier-1 cities with measured (not extrapolated) data | unknown | **100% (25/25)** |
| Tier-2 cities with measured data | unknown | **80% (40/50)** |
| Tier-3 cities with measured data | unknown | **40% (10/25)** |

---

## 3 · The tier system

### Tier 1 — Global metropolises (~25 cities)

Cities where the atlas WILL be the canonical SMB benchmark source if the
data is there. Defining traits: financial/cultural global hub, ≥ 5M
metro population OR exceptional economic density.

Candidates (will refine in T-M.2):

- **North America**: New York, Los Angeles, Chicago, San Francisco, Toronto
- **Europe**: London, Paris, Berlin, Madrid, Barcelona, Rome, Milan, Amsterdam
- **Asia**: Tokyo, Osaka, Seoul, Shanghai, Beijing, Mumbai, Delhi, Bangalore, Singapore
- **Latin America**: São Paulo, Mexico City, Buenos Aires
- **Pacific**: Sydney
- **MENA + Bridge**: Moscow, Istanbul, Dubai

Count: ~26. Cut or merge to 25 in T-M.2 review.

### Tier 2 — Major regional capitals + economic centers (~50 cities)

Cities with strong national presence but not global Top-25. Includes:

- US secondaries: Boston, Miami, Atlanta, Dallas, Houston, Philadelphia, Washington DC, Seattle, San Diego, Phoenix, Denver, Minneapolis, Detroit
- European secondaries: Munich, Hamburg, Frankfurt, Vienna, Brussels, Zurich, Stockholm, Copenhagen, Dublin, Lisbon, Athens, Prague, Warsaw, Budapest
- Asian secondaries: Hong Kong, Taipei, Bangkok, Jakarta, Manila, Kuala Lumpur, Ho Chi Minh, Hyderabad, Chennai, Pune, Guangzhou, Shenzhen, Tianjin
- LATAM: Rio de Janeiro, Lima, Santiago, Bogotá
- MENA: Tel Aviv, Riyadh, Cairo, Casablanca, Tehran
- Africa: Lagos, Nairobi, Johannesburg, Cape Town
- Other Pacific: Melbourne, Auckland

Count: ~55. Cut to 50.

### Tier 3 — Secondary cities + niche specialists (~25 cities)

Cities where the atlas adds material value but search volume is lower:

- US tertiary: Charlotte, Nashville, Tampa, Austin, Salt Lake City, Portland, Pittsburgh
- European tertiary: Manchester, Birmingham (UK), Lyon, Marseille, Naples, Valencia, Seville, Rotterdam, Antwerp, Helsinki, Oslo
- Asian tertiary: Kyoto, Yokohama, Busan, Kolkata, Karachi, Lahore, Dhaka
- Other: Vancouver, Montreal, Wellington

Count: ~28. Cut to 25.

---

## 4 · Per-city metadata schema

```typescript
export type CityEntry = {
  id: string;              // e.g. "new-york", "sao-paulo", "tokyo"
  name: string;            // "New York", "São Paulo", "Tokyo"
  country: string;         // ISO-2: "US", "BR", "JP"
  country_name: string;    // "United States"
  region: string;          // parent region (state/Land/province) ID where applicable
  region_name: string;     // human name
  tier: 1 | 2 | 3;
  population: number;      // metro population estimate
  gdp_rank_global: number | null;  // 1-200 global metro GDP rank
  slug: string;            // URL slug, usually = id
  geo_id: string;          // matches regional_cells.geo_id when measured
  data_status: "measured" | "extrapolated" | "missing";
  neighborhood_drill: boolean;  // does Track O cover this city?
  language_search_terms: string[];  // local-language variants for SEO
};
```

Storage: `src/lib/cities/top100.json` + TypeScript loader in
`src/lib/cities.ts`.

---

## 5 · Step-by-step

### T-M.1 · Draft the 100-city list

Source data:

- **GDP-by-metro rankings**: OECD Functional Urban Areas dataset, Brookings Global Metro Monitor, McKinsey Global 600
- **Population**: UN World Urbanization Prospects + national census data
- **Search volume signals**: Google Trends comparative queries (founder can validate via gut + intuition)

Draft list goes to `delivery/cities/draft_top100.csv` for review.

### T-M.2 · Founder review pass

Founder reviews the draft list:
- Cut any cities they consider over-rated
- Promote any cities they consider under-rated
- Sanity-check the tier assignments

The list freezes after this pass. No further additions without explicit
founder approval.

### T-M.3 · Map each city to existing geo_ids

For each city, check whether `regional_cells` already has a row:

```python
# Pseudocode
for city in TOP_100:
    candidate_geo_ids = generate_candidates(city.country, city.name)
    # e.g. London → ["GB-E09000033", "GB-CITY-london", ...]
    found = supabase.query("regional_cells",
                            country=city.country,
                            geo_id__in=candidate_geo_ids).first()
    if found:
        city.geo_id = found.geo_id
        city.data_status = "measured"
    else:
        # Check Phase 18 city overlay
        overlay = check_phase18(city)
        if overlay:
            city.geo_id = overlay.geo_id
            city.data_status = "extrapolated"
        else:
            city.data_status = "missing"
```

Output: `delivery/cities/top100_with_status.json`.

### T-M.4 · Identify the coverage gap

For each tier:
- Tier 1: any city with status != "measured" is a P0 ingest target
- Tier 2: any city with status == "missing" is a P1 ingest target
- Tier 3: missing is acceptable; extrapolation is fine

The output drives Wave 2 ingest priority (which countries to push next).

### T-M.5 · Lock the list

Write `src/lib/cities/top100.json` with the full schema. Add the loader:

```typescript
// src/lib/cities.ts
import top100 from "./cities/top100.json";

export const TOP_100_CITIES: CityEntry[] = top100;
export const TIER_1_CITIES = TOP_100_CITIES.filter(c => c.tier === 1);
export const TIER_2_CITIES = TOP_100_CITIES.filter(c => c.tier === 2);
export const TIER_3_CITIES = TOP_100_CITIES.filter(c => c.tier === 3);
export const CITIES_BY_COUNTRY: Record<string, CityEntry[]> =
  TOP_100_CITIES.reduce((acc, c) => {
    (acc[c.country] = acc[c.country] || []).push(c);
    return acc;
  }, {} as Record<string, CityEntry[]>);

export function getCitiesForCountry(iso2: string): CityEntry[] {
  return CITIES_BY_COUNTRY[iso2.toUpperCase()] || [];
}
```

Tracks N, O, Q consume this.

### T-M.6 · Add to verify_taxonomy CI

`scripts/verify_taxonomy.ts` extends to check:
- Every TIER_1 city's `geo_id` resolves to a row in `regional_cells` (data_status == "measured")
- TIER_1 list has exactly 25 entries
- Total list is 100

Build fails if these invariants drift.

---

## 6 · Verification gate

| Check | Pass criterion |
|---|---|
| M.1 Draft list | `delivery/cities/draft_top100.csv` exists with 100 rows |
| M.2 Founder review | Founder confirms list (one chat message) |
| M.3 Geo mapping | Each city has either measured / extrapolated / missing status |
| M.4 Gap report | `delivery/cities/coverage_gap.csv` lists P0 + P1 ingest targets |
| M.5 Locked file | `src/lib/cities/top100.json` exists with 100 valid entries |
| M.5 Loader | `import { TOP_100_CITIES } from "@/lib/cities"` works in TS |
| M.6 CI invariant | `verify_taxonomy.ts` passes with 25 tier-1 / 100 total checks |

When all seven pass: **M is DONE.** Tracks N + O + Q can proceed.

---

## 7 · Time estimate

| Task | Time |
|---|---|
| M.1 Draft list (research-heavy) | 3-4 hours |
| M.2 Founder review pass | 30 min (founder side) |
| M.3 Geo mapping | 1 hour |
| M.4 Gap analysis | 1 hour |
| M.5 Lock file + loader | 1 hour |
| M.6 CI extension | 30 min |
| **Total** | 7-8 hours |

---

## 8 · What this unlocks

- **Track N**: country pages show city quick-tiles (needs CITIES_BY_COUNTRY)
- **Track O**: neighborhood drill-down on `neighborhood_drill: true` cities
- **Track Q**: navigator can suggest cities at any level of the hierarchy
- **Wave 2 ingest priority**: re-orders Tracks D/E/G/I to prioritize tier-1 gaps
- **SEO**: cities have stable URLs + language_search_terms drive multi-lingual indexing
- **Marketing**: founder can quote "covers the top 100 cities globally" with a CI-enforced backing
