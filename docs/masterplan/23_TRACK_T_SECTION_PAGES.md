# 23 · Track T — Section / Country / Compare Page Polish

> Bring every non-cell page up to the level of richness the cell page
> already has. Country pages need neighborhood drill, sector pages
> need cross-country views, compare page needs multi-country mode.

---

## 1 · Goal

Every "container" page (country, sector, compare, browse, sectors-index)
becomes a usable destination, not a stub. Visitors arriving at a
non-cell URL get enough signal to dig deeper.

---

## 2 · T.1 — Country page enhancements

Current: top cities (Track N) + top industries + Compare CTA.

Add:

- **Neighborhood section** (when country has any in NEIGHBORHOOD_ALIASES)
  → "Drill into neighborhoods" tile grid. Currently only for US (NYC),
  GB (London), MX (CDMX). Show only when relevant.
- **Tax snapshot card** — "Owner take-home rate" at country level
  using country_rates_2024 data. One-liner: "Typical small business
  in [Country] keeps ~X% of revenue after tax."
- **Quality indicator** — show overall country quality 1-10 average
- **Recently updated** — indicate the most recent data year per country

Effort: 2-3 hr.

## 3 · T.2 — Sector page (`/sectors/[id]`) cross-country view

Current: sector hero + top industries within sector.

Add:

- **Same sector across countries strip** — for each sector, show a
  horizontal scrolling list of the same sector's headline number in
  all covered countries
  ("Food & drink: 🇺🇸 $X / 🇩🇪 $Y / 🇲🇽 $Z / 🇦🇱 $W ...")
- **Top industries in sector × country chooser** — small picker
  that updates the page when country changes
- **Featured cells in sector** — 6 hand-picked cells representing
  the breadth (US restaurants, German metal mfg, etc.)

Effort: 3-4 hr.

## 4 · T.3 — Compare page upgrades

Current: 4-cell side-by-side.

Add:

- **Country mode** — pick 4 countries × 1 industry; see the same
  industry across countries side-by-side
- **Tax overlay column** — when in compare mode, optionally toggle
  "after-tax view" so all 4 cells recompute owner take-home
- **Export to PDF/CSV** — bulk-download the comparison table

Effort: 3-4 hr.

## 5 · T.4 — Sectors index (`/sectors`) upgrades

Current: 20-sector master menu grid.

Add:

- **Cell count per sector chip** — show "X measured cells" badge
  on each sector tile
- **Sister sectors** — small "related" chips at the bottom of each tile

Effort: 1 hr.

## 6 · T.5 — Browse page (`/browse`) upgrades

Current: stub (all countries grid).

Replace with:

- **Globe / map visual** (SVG, no JS heavy lib) showing country dots
  colored by data quality
- **Filter by region** (Europe / Americas / Asia / Africa / Oceania)
- **Filter by quality tier** (high / medium / low)
- **List view** with each country's headline coverage stats

Effort: 4-5 hr.

## 7 · T.6 — New `/world` or `/global` page

Big strategic addition: a single page showing the database at a glance.

- World map with all 100+ covered cities pinned
- "Where is the best margin for X?" cross-country picker
- Top 50 cities by [revenue / margin / firm count]

Effort: 5-6 hr.

---

## 8 · Steps

| # | Task | Effort | Critical? |
|---|---|---|---|
| T.1 | Country page enhancements | 2-3 hr | HIGH |
| T.2 | Sector cross-country view | 3-4 hr | MED |
| T.3 | Compare page upgrades | 3-4 hr | MED |
| T.4 | Sectors index polish | 1 hr | LOW |
| T.5 | Browse page rebuild | 4-5 hr | MED |
| T.6 | New /world page | 5-6 hr | MED |
| **Total** | | **18-23 hr** | |

---

## 9 · Verification gate

- Every section in Track T renders on its page
- Mobile responsive
- `tsc` + `verify_taxonomy` + `lint` clean
- Performance budget: no individual page > 200ms p50 server response

---

## 10 · What this unlocks

The site stops being "the cell page is great, everything else is a
stub". Users browsing without a clear query in mind find their way to
something interesting via country, sector, or world view.
