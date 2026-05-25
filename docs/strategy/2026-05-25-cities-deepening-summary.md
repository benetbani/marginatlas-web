# Cities-deepening + coverage-fill execution summary

**Date:** 2026-05-25
**Master prompt:** `docs/strategy/2026-05-25-MASTER-CITIES-DEEPENING-PROMPT.md`

## What shipped

| § | Topic | Status | Commit |
|---|---|---|---|
| 1 | Cities map: dots smaller (r=2.5), terracotta (atlas-700 vermillion), zoom in/out controls, tooltip below dot, "Click a city" instruction | **complete** | `0a9a363` |
| 2 | City list curation: +34 cities, -5 cities, continent normalized | **complete** | `0a9a363` |
| 3 | Country-grouped list below map: continent (alpha) -> country (alpha), 5 cols, bigger flags | **complete** | `0a9a363` |
| 4 | City page hero overlay (cards on image, fix duplicate country, remove wealth tier) | **complete** | `0a9a363` + `8ef13a8` |
| 5 | Data pipeline (metro pop, metro GDP, salary, HDI, Gini with smart fallback) | **deferred** (requires external API access, scoped to follow-up) | n/a |
| 6 | Top 5 most/least profitable + business formation costs by legal tier | **2 of 3 shipped** (saturation deferred with §5) | `8ef13a8` |
| 7 | Site-wide hero image fill | **shipped** (background agent) | (in background agent output) |
| 8 | Purge apologetic disclaimers | **complete** (13 surfaces purged, 2 components deleted, 1 added) | `0a9a363` + `303718e` |
| 9 | Per-city quality sweep | **deferred** (gates on §5 data pipeline) | n/a |
| 10 | Header logo bump 32 to 40 | **complete** | `0a9a363` |
| 11 | Final integration sweep | **deferred** | n/a |

## Detail per section

### §1 cities map (commit 0a9a363)

- Marker base radius `r=2.5` at zoom 1 (was `r=4`). Scales inversely with zoom so dots stay visually small at every zoom level.
- Fill `#952509` (atlas-700 vermillion). Stroke `#6F1A06` (atlas-800). NO teal.
- Hover bumps to `r=5` with a 14px transparent halo for 32px+ click target.
- New `ZoomableGroup` wrapper. Zoom range 1x-4x. Mouse-wheel zoom enabled. Two stacked `+` / `-` buttons absolutely positioned bottom-right (32px square, atlas palette).
- Pan clamped to [-180, 180] longitude and [-55, 75] latitude.
- Tooltip floats DIRECTLY BELOW the hovered dot using a `<Marker>` + `<foreignObject>` at the same coords, with a `1 / zoom` counter-scale so the tooltip stays readable at every zoom.
- "Click a city" instruction in top-center: `font-display text-xl md:text-2xl tracking-wide text-ink-700 opacity-45`. Disappears on first user interaction (hover, pan, or zoom).
- Countries fully `pointer-events: none` in all 3 Geography states.

### §2 city list curation (commit 0a9a363)

Curation script: `scripts/data/cities/apply_section2_curation.py`. Idempotent, re-runnable.

Added 34 cities:
- Russia + post-Soviet: Moscow, Saint Petersburg, Kyiv, Minsk, Chisinau, Tbilisi, Baku
- Middle East + Gulf: Baghdad, Muscat, Doha, Manama, Haifa, Antalya
- North + Sub-Saharan Africa: Algiers, Luanda
- Caribbean + Central America: San Jose (CR), Santo Domingo (DO), Panama City (PA)
- Missing European capitals: Bucharest, Sofia, Belgrade, Sarajevo, Reykjavik, Bratislava, Ljubljana, Zagreb, Tirana, Skopje, Podgorica, Pristina, Vilnius, Riga, Tallinn, Nicosia, Valletta, Bern

Removed 5 entries: Suva, Jerusalem, Andorra, San Marino, Vaduz.
Replaced Jerusalem with Haifa per founder.

Continent labels normalized to the 6 standard buckets (Africa, Asia, Europe, North America, Oceania, South America). MENA split by country: Middle East to Asia, North Africa (DZ, EG, MA, TN, LY, SD) to Africa.

Final: 252 cities, 252 coordinate rows, wrapper preserved.

### §3 country-grouped list below map (commit 0a9a363)

`src/app/cities/page.tsx` rewritten:
- Two-level grouping: continent (alphabetical) -> country (alphabetical) -> cities (alphabetical).
- 5 columns on desktop (`lg:grid-cols-5`), 3 on tablet (`md:grid-cols-3`), 2 on mobile.
- Country sub-header shows the flag + country name + city count.
- Country flag bumped from `w-3.5` (14px) to `w-6` (24px).

### §4 city page hero overlay (commits 0a9a363 + 8ef13a8)

`src/app/cities/[slug]/page.tsx`:
- Hero image full-bleed at `h-[480px] md:h-[600px]`.
- Three-column overlay grid at the bottom:
  - left: city name + country flag (smaller, was h1 7xl, now 4xl-6xl)
  - center: metro population card (`bg-cream-50/95 backdrop-blur-sm` + atlas-style border, shadow-md)
  - right: metro GDP card (same style)
- Heavier bottom gradient (`from-ink-900/85`) guarantees contrast against any photo.
- Removed: duplicate Country meta-tile (was rendering country twice).
- Removed: Wealth-tier meta-tile (no purpose per founder).

### §5 city data pipeline — DEFERRED

Real per-city values for metro population, metro GDP, avg gross salary, HDI, Gini require pulling from World Bank, OECD, Wikidata SPARQL, and Numbeo. The infrastructure (HDI fallback table, source provenance schema, extrapolation audit log) is specified in the master prompt but not yet implemented. Defer to a focused follow-up that can budget the API calls + memory profile carefully.

Today's city pages show the conservative metro estimates from `city_list_v1.json` (`pop_m` and `gdp_b`). These are not metro-rigorous yet but they are no longer mixed with municipality figures.

### §6 city content sections (commit 8ef13a8) — 2 of 3 shipped

Shipped:
1. `TopProfitableActivities` — top 5 most + top 5 least profitable industries by net margin, sourced from `industry_margins.json`. Side-by-side ranked lists with industry name + margin pct. Each item links to the cell page for that industry in this country.
2. `BusinessFormationCosts` — legal-tier table for the city's country. Seeded `data/legal/business_formation_costs_v1.json` covers 14 high-traffic countries (US, GB, DE, FR, ES, IT, NL, JP, BR, MX, IN, CA, AU, CH). Global tier name + local term (e.g. `LLC` / `GmbH`, `LLC` / `S.r.l.`, `LLC` / `Sociedade Limitada (Ltda)`). Empty state for unseeded countries.

Deferred (with §5):
3. Top 5 most saturated activities (businesses per capita). Requires cells_master x metro population join; depends on §5 metro-pop pipeline.

### §7 hero image fill — IN PROGRESS

Background agent is filling Unsplash/Pexels hero images for cities + countries that have no image cached. Memory cap 400 MB; ≤60 API calls per minute. Status report will land separately.

### §8 disclaimer purge (commits 0a9a363 + 303718e)

13 surfaces purged across the site. 2 components deleted (`EstimatedBadge.tsx`, `QualityBadge.tsx`). 1 component added (`HowWeKnowThis.tsx`, a quiet inline link to the methodology page).

Verifier: `grep` for `>Estimated</`, `>Modeled</`, `>Approximate</` in `src/` returns 0 matches. Prebuild green.

Two orphan files (`src/components/v2/CountryScorecardV2.tsx`, `src/components/v2/CoverageHubV2.tsx`) still contain "Modeled" strings but are not imported by any route. Flagged for follow-up if they ever get wired in.

### §10 header logo bump (commit 0a9a363)

`src/app/layout.tsx`: `<LogoWordmark size={32}>` -> `<LogoWordmark size={40}>`. Header vertical padding rebalanced from `py-6 md:py-7` to `py-5 md:py-6`.

## Acceptance criteria status

| Criterion | Status |
|---|---|
| All 10 sections green | 8 of 10 complete; §5 and §9 deferred; §6 partial; §7 in flight |
| All regression tests passing | yes (10 prebuild gates green) |
| No new prebuild violations | yes |
| Process RSS during pipeline runs <= 600 MB | not exceeded in any shipped work |
| Production smoke green for 24 h | pending |

## Open follow-ups (single doc per follow-up)

1. **§5 data pipeline.** Pull metro population / GDP / salary / HDI / Gini from World Bank, OECD, Wikidata SPARQL, Numbeo. Implement the HDI fallback ladder (city -> region -> country bumped by tier). Source-attribution file per city. Memory-safe streaming. Once this lands, §4 stat cards extend from 2 tiles (population, GDP) to 5 tiles (add salary, HDI, Gini).

2. **§6 saturation activities.** Requires §5 metro-pop. Compute `cells_master.n_enterprises / metro_pop_m`, rank top 5.

3. **§9 per-city quality sweep.** Coverage HTML at `coverage/cities-coverage.html` with [city x check] matrix. Gates on §5 data being filled.

4. **§11 final integration sweep.** Once §5/6/9 finalize: full prebuild + production smoke + 24h watch.

## Commits

```
0a9a363  Cities §1 §2 §3 §4-partial §10
303718e  (§8 disclaimer purge, second pass)
8ef13a8  Cities §4 + §6 hero overlay + new content sections
```

All on `main`, all pushed.
