# 22 · Track S — Home Page Upgrades

> Founder direction: "add like parts of the page that actually
> accommodate such thing. either at the home page or section pages."
>
> The home page hasn't been updated since the Wave 2 work landed. It
> needs to surface: tax overlay, new countries, the global breadth, the
> /ask widget. This is what hits visitors first; high-leverage UX work.

---

## 1 · Goal

Upgrade the home page so the new capabilities (tax overlay, 49+
countries, 80+ city slugs, AI ask, 356k+ cells) are visible without
the user having to dig.

---

## 2 · Section-by-section plan

### S.1 — Hero rewrite

Current: generic "small-business benchmarks" tagline. Update to call
out global scope:

```
Margin Atlas
Small-business benchmarks across 49+ countries and 80+ major cities.
Revenue, payroll, and after-tax owner take-home — all from one query.
```

Effort: 15 min.

### S.2 — Global coverage strip

New section under navigator. Static, server-rendered. Shows:

- Total cells, total countries, total cities (live numbers via Supabase)
- 5-6 flag chips clicking through to country pages (mix of measured
  + new — US, UK, MX, DE, AU, BR, JP, plus rotating "spotlight country"
  of the day)

Effort: 1.5 hr (new component + Supabase count queries).

### S.3 — Featured tiles refresh

Existing 12-tile grid points at older cells. Upgrade to:

- Mix of measured (US states, EU NUTS, AU SA2, MX states) + new
  city-overlay cells (Tirana, Zurich, Tokyo)
- Add "Owner take-home: $X" line per tile (using PostTaxToggle math)
- Add tier 1-10 quality dot scale per tile

Effort: 1 hr.

### S.4 — "Pick a city" panel

Below featured tiles. Compact widget with searchable city autocomplete
covering all 80 city aliases:

```
Pick a city: [____________________] → Show typical numbers
```

Effort: 2 hr (new ComboField wrapper + server-side autocomplete using
TOP_100_CITIES + NEIGHBORHOOD_ALIASES).

### S.5 — Ask widget (post /ask production fix)

Inline `/ask` widget on home page. Text input → instant Claude answer
in a card below.

Blocked on: `/ask` production unlock (currently preview-stub in prod).

Effort: 1.5 hr.

### S.6 — Tax overlay teaser

New section: "Owner take-home calculator". Show a sample (e.g. "a
typical cafe in Madrid takes home ~€42K after Spanish CIT + social
contributions"). Click-through to that cell page with PostTaxToggle
open by default.

Effort: 1.5 hr.

### S.7 — Quality legend

Small footer block explaining the 1-10 quality scale. Tooltip-style
when hovering over a quality dot anywhere on the site.

Effort: 30 min (write the legend + add Tooltip reference).

### S.8 — "Recently added" strip

Rotating list of the 5 most-recently-added country pages. Sources from
COUNTRIES list, sorted by "added" date (need a small audit table or
just hardcoded order for now).

Effort: 1 hr.

---

## 3 · Steps

| # | Task | Effort | Critical? |
|---|---|---|---|
| S.1 | Hero rewrite | 15 min | LOW |
| S.2 | Global coverage strip | 1.5 hr | MED |
| S.3 | Featured tiles refresh with tax + quality | 1 hr | HIGH |
| S.4 | Pick-a-city autocomplete | 2 hr | MED |
| S.5 | Ask widget (blocked on /ask production) | 1.5 hr | depends |
| S.6 | Tax overlay teaser section | 1.5 hr | HIGH |
| S.7 | Quality legend + tooltip | 30 min | MED |
| S.8 | Recently-added countries strip | 1 hr | LOW |
| **Total** | | **9-10 hr** | |

---

## 4 · Verification gate

- All sections render on /
- Mobile responsive (360px / 768px / 1024px)
- Lighthouse Performance ≥ 85
- `tsc` + `verify_taxonomy` + `lint` all clean
- No new "Coming soon" placeholders (R-016)

---

## 5 · Component additions

| File | Purpose |
|---|---|
| `src/components/GlobalCoverageStrip.tsx` | S.2 (server component) |
| `src/components/CityPicker.tsx` | S.4 (client component) |
| `src/components/AskWidget.tsx` | S.5 (client; calls /api/ask) |
| `src/components/TaxOverlayTeaser.tsx` | S.6 (server) |
| `src/components/QualityLegend.tsx` | S.7 |
| `src/components/RecentlyAddedCountries.tsx` | S.8 (server) |

All consistent with existing patterns (cream backgrounds, atlas
accents, no aquamarine — R-001).

---

## 6 · What this unlocks

The home page becomes a fair showcase of the database's actual scope.
Users no longer have to know about /us/california/restaurants to find
something useful — the home page surfaces 80+ city quick-picks, tax
overlay, and AI ask.
