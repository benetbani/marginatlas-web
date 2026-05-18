# 37 · Track GG — Coverage Audit + Per-Country Scorecard + /coverage

> Public-facing accounting of data quality. Per-country scorecard.
> /coverage page with world heatmap. Trust signal.

---

## 1 · Goal

A single audit pipeline that produces:
- `delivery/quality/coverage_v2.json` — per-country quality stats
- `docs/ingest/COVERAGE_AUDIT_v2.md` — human-readable report
- `/coverage` public page — world heatmap + filterable table
- `/coverage/[iso2]` per-country scorecard

---

## 2 · Sub-tracks

### GG.1 — Audit script

`scripts/audit_coverage_v2.py`:

For each country in COUNTRIES:
- Cell count in regional_cells
- Cell count in extrapolated_cells (fallback)
- Distinct industries with data
- Distinct geographies (states/cities)
- Average quality_10
- Tier distribution: P/S/M/T/X counts
- Tax overlay coverage (Y/N)
- Top 100 cities coverage (how many cities in the country are present)
- Last-updated year

Output: structured JSON.

Effort: 2 hr.

### GG.2 — Markdown report generator

Convert JSON to `docs/ingest/COVERAGE_AUDIT_v2.md`:
- Headline numbers
- Region-by-region breakdown
- Top 20 priority gaps
- Removal candidates (countries with quality < 3)
- Heatmap-style table (country × quality)

Effort: 1.5 hr.

### GG.3 — `/coverage` public page

Server component:
- World map (SVG with country fills colored by avg quality)
- Filterable table (region, quality tier, cell count)
- "Top covered" + "Most-needed" sections
- "Where would you like us to expand?" CTA (placeholder for future
  feedback)

Effort: 3-4 hr.

### GG.4 — `/coverage/[iso2]` per-country scorecard

For each country:
- Big quality dot (avg)
- Coverage stats (cells, industries, cities)
- Tier breakdown bar chart
- Top 10 cells in the country (with quality dots)
- Recent changes (when added, when last refreshed)
- "How we got this data" generic explainer

Effort: 2 hr.

### GG.5 — Footer link + nav integration

- Add "/coverage" link to footer (Track BB.5)
- Add link from each country page → /coverage/{iso2}
- Add to sitemap

Effort: 30 min.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| GG.1 Audit script | 2 hr |
| GG.2 Markdown report | 1.5 hr |
| GG.3 /coverage page | 3-4 hr |
| GG.4 /coverage/[iso2] | 2 hr |
| GG.5 Nav integration | 30 min |
| **Total** | **~9 hr** |

---

## 4 · Verification gate

- COVERAGE_AUDIT_v2.md exists with all sections
- /coverage renders the world heatmap
- /coverage/[iso2] renders for 5 sampled countries
- All sitemap entries for /coverage* present

---

## 5 · What this unlocks

- Trust signal: public-facing honest accounting of where data is
  strong vs weak
- Founder + future sessions have a clear "where to invest next" picture
- Pro-tier "data quality dashboard" baseline (future)
