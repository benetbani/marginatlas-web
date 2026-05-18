# 32 · Track BB — Home Page Completion

> Founder direction: "Focus on improving the home page by adding some
> are still not present."
>
> Track S added 6 sections (GlobalCoverageStrip, TaxOverlayTeaser,
> AskWidget, CityPicker, QualityLegend) plus a tax teaser. But the
> home still has gaps. This track ships everything still missing.

---

## 1 · Goal

Make the home page a complete first-time-visitor experience that:
- Sets context immediately (hero rewrite)
- Surfaces what's new (recently added countries / cells)
- Provides multiple entry paths (city, industry, sector, ask, browse)
- Demonstrates value with samples (tax overlay teaser already there;
  add more)
- Earns trust (quality legend, sources)
- Closes with a clear next action (newsletter / Pro tier / API)

---

## 2 · Sub-tracks

### BB.1 — Hero rewrite

Current hero: generic small-business benchmarks tagline.

Replace with the Plan v8 S.1 spec:

```
[Big headline]
Small-business benchmarks across 191 countries.

[Subhead]
Revenue, payroll, and after-tax owner take-home for every covered
country × industry × city × size combination — all from one query.

[CTAs]
[Browse 191 countries] [Try Ask Atlas] [Pick a city]
```

Effort: 30 min.

### BB.2 — Recently added countries strip

Below GlobalCoverageStrip. Rotating 5-tile list of countries added in
the last 30 days. Each tile: flag + country name + "X cells".

Static for now (hardcode the 10 Plan v8 additions: Albania, Russia,
Israel, etc.); switch to dynamic when an "added_at" column lands.

Effort: 1 hr.

### BB.3 — Featured tiles refresh

Current 12 tiles are mostly US-centric and stale. Diversify to:

1. New York restaurants 🇺🇸
2. London legal services 🇬🇧
3. Berlin software development 🇩🇪
4. Madrid cafés 🇪🇸
5. Tokyo restaurants 🇯🇵
6. São Paulo retail 🇧🇷
7. Mexico City restaurants 🇲🇽
8. Sydney cafés 🇦🇺
9. Tirana cafés 🇦🇱 (founder's home — show explicitly)
10. Zurich professional services 🇨🇭
11. Dubai retail 🇦🇪
12. Mumbai software 🇮🇳

Each tile: city × industry, real numbers, quality dots, tax-aware
owner take-home line. Click-through to cell.

Effort: 1.5 hr.

### BB.4 — "Spotlight country of the day"

Big card mid-page rotating daily through covered countries. Shows:
- Country flag + name + signature line
- Top 3 industries for that country (with revenue)
- Click-through to country page

Selection: deterministic per day-of-year mod 191 so it cycles through
all countries over a year.

Effort: 1.5 hr.

### BB.5 — Footer redesign

Current footer is 4 thin columns. Upgrade to 5-column layout:

| Browse | Use | Learn | Trust | Atlas |
|---|---|---|---|---|
| All 191 countries | Ask Atlas | About the data | Quality methodology | Pricing |
| Top 100 cities | Compare | Blog | Sources lockdown | Status |
| Sectors | Compare to me | Tax overlay guide | Coverage report | API |
| Random cell | Newsletter | Glossary | Contact | GitHub |

Effort: 2 hr.

### BB.6 — Mobile responsive audit

Test home page at 360px (iPhone SE), 768px (iPad), 1024px (desktop).
Fix any layout breaks. Particularly:
- Hero CTA buttons (currently might wrap awkwardly)
- GlobalCoverageStrip 4-column grid (collapse to 2 on mobile)
- CityPicker autocomplete dropdown positioning

Effort: 1.5 hr.

### BB.7 — Loading skeleton states

Currently sections that fetch data (GlobalCoverageStrip, FeaturedCellTile,
CellOfTheWeek) flash empty during ISR rebuild. Add proper skeleton
loaders.

Effort: 1 hr.

### BB.8 — Hero animation polish

Subtle fade-in for hero text on page load. Subtle hover-lift on
FeaturedCellTile + city picker dropdown.

All via CSS only (no client JS for transitions). Respects
`prefers-reduced-motion`.

Effort: 1 hr.

### BB.9 — Newsletter signup rewrite

Current: generic email field with "subscribe" button.

Replace with: "Monthly cell of the month — pick a benchmark you didn't
know you needed." Specific value prop.

Effort: 30 min.

### BB.10 — Live "what's hot" strip

Bottom of home: small marquee or grid showing 3 cells that got the
most traffic this week. Tied to an analytics signal (when Track JJ
analytics lands).

For now: hardcoded curated 3 cells; switch to dynamic later.

Effort: 1 hr.

---

## 3 · Steps + effort

| Step | Effort | Critical? |
|---|---|---|
| BB.1 Hero rewrite | 30 min | HIGH |
| BB.2 Recently added strip | 1 hr | MED |
| BB.3 Featured tiles refresh | 1.5 hr | HIGH |
| BB.4 Spotlight country | 1.5 hr | MED |
| BB.5 Footer redesign | 2 hr | MED |
| BB.6 Mobile audit | 1.5 hr | HIGH |
| BB.7 Loading skeletons | 1 hr | LOW |
| BB.8 Animation polish | 1 hr | LOW |
| BB.9 Newsletter rewrite | 30 min | LOW |
| BB.10 What's hot strip | 1 hr | LOW |
| **Total** | **~11 hr** | |

---

## 4 · Verification gate

- All 10 sections visible on /
- Mobile renders cleanly at 360px / 768px / 1024px
- Lighthouse Performance ≥ 85
- `tsc` + `verify_taxonomy` + `lint` clean
- No new "Coming soon" anywhere (R-016)

---

## 5 · What this unlocks

Home page becomes a complete showcase of the 357k-cell, 191-country
database with multiple entry paths. First-time visitor leaves with a
clear sense of what's here + at least one specific cell viewed.
