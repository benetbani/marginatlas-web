# 36 · Track FF — Section / Country / Compare Pages + /world

> Containers (country, sector, compare, browse) stop being thin pages.
> New `/world` is a flagship cross-cutting view. This is the biggest
> UX track in Plan v9.

---

## 1 · Goal

Every non-cell page becomes a usable destination. Visitor arriving at
`/de` (Germany), `/sectors/food_drink`, `/compare`, `/browse`, or new
`/world` gets enough richness to dig deeper without feeling stranded.

---

## 2 · FF.1 — Country page enhancements (extends Track T.1)

Per `/[country]/page.tsx`. Add:

| Section | What |
|---|---|
| Tax snapshot card | "Typical owner takes home ~X% of revenue after tax in {country}." Pulls country_rates_2024.json. |
| Quality score average | "{country} coverage quality: 7.2/10 across N cells." Links to /coverage/{iso2}. |
| Neighborhood drill | When country has entries in NEIGHBORHOOD_ALIASES, show grid linking to top neighborhoods. |
| Most-recent year | "Data current to {latest year present}." Color-coded freshness. |
| Compare to peer | "Compare {country} to ↔ neighbor countries with similar economy" |
| Population + GDP context | One-line per country (from a curated table). |

Effort: 3-4 hr.

## 3 · FF.2 — Sector cross-country view

`/sectors/[id]/page.tsx`. Add:

| Section | What |
|---|---|
| Same sector across countries | Strip showing the sector's typical revenue in 10-15 covered countries. |
| Top industries within sector | Already there; verify still works post Track CC. |
| Sister sectors | Chips at bottom. |
| Featured cells in sector | 6 hand-picked from across countries. |
| Sector cross-country picker | Dropdown that filters the page to one country. |

Effort: 3-4 hr.

## 4 · FF.3 — Compare page upgrades

`/compare`. Add:

| Section | What |
|---|---|
| Country mode | 4 countries × 1 industry side-by-side (new layout). |
| Tax overlay column | Toggle to show post-tax view across all cells in compare. |
| Export to CSV / PDF | Action buttons. |
| Save comparison | localStorage; "name this comparison" prompt. Future: tie to auth. |

Effort: 3-4 hr.

## 5 · FF.4 — Browse page rebuild

`/browse`. Replace stub with:

- World map (SVG, country dots colored by data quality)
- Region filter (Europe / Americas / Asia / Africa / Oceania)
- Quality tier filter (high / med / low)
- Sortable list view (alphabetical / by quality / by cell count)

Effort: 4-5 hr.

## 6 · FF.5 — New `/world` page

Flagship cross-cutting view:

- Big world map (more detailed than /browse) with all 100+ covered
  cities pinned + colored by quality
- "Where's the best margin for X?" picker (industry → highlights map)
- Top 50 cities by [revenue / margin / firm count]
- Country leaderboards (highest CIT, lowest social contributions, etc.)
- Heatmap industry × country

Effort: 5-6 hr.

## 7 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| FF.1 Country page | 3-4 hr | HIGH |
| FF.2 Sector cross-country | 3-4 hr | MED |
| FF.3 Compare upgrades | 3-4 hr | MED |
| FF.4 Browse rebuild | 4-5 hr | MED |
| FF.5 /world page | 5-6 hr | HIGH |
| **Total** | **~18-22 hr** | |

---

## 8 · Verification gate

- All 5 page enhancements live
- Mobile responsive on each
- Country page renders tax snapshot for all 191 countries
- /world world map renders 100+ city pins
- Compare page export-CSV produces valid file

---

## 9 · What this unlocks

The site stops being "cell page is great, rest is stubs". Container
pages become destinations. /world becomes the flagship cross-cutting
view that justifies the global breadth.
