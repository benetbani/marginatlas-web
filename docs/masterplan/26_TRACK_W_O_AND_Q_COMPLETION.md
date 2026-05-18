# 26 · Track W — Track O + Track Q Completion

> Track O.1 (NYC boroughs) shipped session 8. Track O.2 (London) shipped
> session 10 via alias map. This track finishes O.3-O.10 and ships
> Track Q (optional-hierarchy nav) which was planned but not started.

---

## 1 · Goal

Every tier-1 city has neighborhood drill-down. The navigator + URL
space supports dropping in at any level (country / region / city /
neighborhood) without dead ends.

---

## 2 · W.1 — Track O.3-O.10 completion

| City | Current state | Fix |
|---|---|---|
| **O.3 Tokyo 23 wards** | Data missing (e-Stat Phase 8 only has Tokyo aggregate JP-13000) | Need additional e-Stat table probe; skip if blocked |
| **O.4 Paris arrondissements** | Need France Sirene (deferred) OR INSEE REE | Probe INSEE REE; alias map for 20 arrondissements |
| **O.5 São Paulo distritos** | Phase 15 BR has state-level only | Extend IBGE pipeline to municipio + distrito |
| **O.6 Moscow okrugs** | Phase 18 has Moscow as single city | Hand-curate 12 okrugs as alias of MX-CITY-moscow with shares |
| **O.7 Istanbul ilçes** | None | Probe TÜİK bulk CSV (deferred); fallback to hand-curated 5 main ilçes |
| **O.8 Mexico City alcaldías** | DONE session 10 | — |
| **O.9 Buenos Aires comunas** | None | Hand-curate 15 comunas with city share |
| **O.10 Berlin/Madrid/Barcelona Bezirke/distritos** | Aliases shipped session 10; no sub-data | Hand-curate via share-of-city scaling if no source |

Effort: 4-5 hr total (most are hand-curated alias maps, not new ingest).

## 3 · W.2 — Track Q.1 Country page audit + enhancements

Already partially done in Track T.1 (Track S+T overlap). Specifically
for Track Q:
- Inline industry picker at country level
- Region tile grid (where regions exist)

Effort: 2 hr.

## 4 · W.3 — Track Q.2/Q.3 — Geo dispatcher route

Currently `[country]/[geo]/page.tsx` doesn't exist. Cell page is at
`[country]/[geo]/[industry]/page.tsx` (3 segments).

Add `[country]/[geo]/page.tsx` as a dispatcher:
1. If `geo` is a city slug (TOP_100_CITIES) → render city landing
2. If `geo` is a region slug (US state / EU NUTS / etc.) → render region landing
3. If `geo` is a neighborhood alias → redirect to underlying cell
4. Else 404

Effort: 3 hr.

## 5 · W.4 — Track Q.4 Inline industry picker

A `<InlineIndustryPicker>` component shown on country / region / city
pages. ComboField that, on industry selection, routes to
`/{country}/{geo}/{industry}`.

Effort: 1.5 hr.

## 6 · W.5 — Track Q.5 Country-level cell route

URL: `/{country}/all/{industry}` renders a country-level cell from
extrapolated_cells.

Effort: 2 hr.

## 7 · W.6 — Track Q.7 Adaptive breadcrumb

Existing breadcrumb assumes country → state → cell. New variants:
- Country → city → industry
- Country → region → city → industry
- Country → city → neighborhood → industry

Update `<Breadcrumbs>` to collapse missing levels gracefully.

Effort: 1.5 hr.

## 8 · W.7 — Track Q.9 GlobalSearch extension

Add to Cmd+K search:
- Cities (from TOP_100_CITIES + NEIGHBORHOOD_ALIASES)
- Neighborhoods
- Tax-related terms (so "tax in mexico" surfaces a relevant link)

Effort: 1.5 hr.

## 9 · W.8 — Track Q.10 Navigator adaptation

Make navigator fields optional. CTA text adapts:
- Only country → "See {country} benchmarks"
- Country + city → "See {city} benchmarks"
- Country + industry → "See {industry} in {country}"
- Full → "Show me the numbers →"

Effort: 2 hr.

---

## 10 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| W.1 Track O.3-O.10 completion | 4-5 hr | MED |
| W.2 Country page enhancements | 2 hr | HIGH (already partial via Track T) |
| W.3 Geo dispatcher | 3 hr | HIGH |
| W.4 Inline industry picker | 1.5 hr | MED |
| W.5 Country-level cell route | 2 hr | MED |
| W.6 Adaptive breadcrumb | 1.5 hr | MED |
| W.7 GlobalSearch extension | 1.5 hr | LOW |
| W.8 Navigator adaptation | 2 hr | MED |
| **Total** | **~17-18 hr** | |

---

## 11 · Verification gate

- All 8 cities with `neighborhood_drill: true` in top100.json have at least 1 neighborhood URL that resolves
- `/{country}/{geo}` dispatcher correctly routes city vs region vs neighborhood
- Cmd+K surfaces all cities + neighborhoods
- Navigator works with any subset of fields filled

---

## 12 · What this unlocks

Founder's "parallel methodology" + "neighborhoods for tier-1 cities"
visions fully realised. No URL is a dead end.
