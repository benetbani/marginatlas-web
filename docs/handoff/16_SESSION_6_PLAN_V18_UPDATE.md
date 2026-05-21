# 16 · Session 6 / Plan v18 Update

> **Captured 2026-05-21 end of session.** This file is the
> authoritative delta over chapters 00-15. When earlier chapters
> contradict this file, this file wins until they are reconciled.

---

## 0 · TL;DR

- Plan v16 + v17 shipped over the prior turns: hero rebuild, methodology relocation, navigator region cascade, net-profit math guard, image-attribution leak fixed, /world rewritten, edge cache on the middleware, audit crawler, dead-link guard.
- Plan v18 shipped this turn: pre-baked homepage snapshots, parallel cell-page fetches, cache warmer, country sweep, source-agency leak fix + guard, anomaly aggregator framework, branding direction doc, moat doc, new sections + tools doc.
- HEAD: `d92640b` (or later after Phase 6+7 commits land).
- Production still serving older commits per the most recent Vercel screenshot. Once the queued builds drain, every fix below goes live.

---

## 1 · Plan v18 — what shipped in this turn

| Block | What | Commit |
|---|---|---|
| Phase 0.1-0.3 | Pre-baked snapshots (`data/snapshots/featured-tiles.json` + `cell-of-the-week.json` + `popular-cell-rotation.json`); FeaturedCellTile, CellOfTheWeek, `/api/popular-cell-snapshot` read from JSON before falling back to Supabase | `0742e49` |
| Phase 0.5 + 0.6 | Cell page now starts `getCellBySlug` + `getCellVariants` concurrently (Promise.all); `scripts/ops/warm_cache.ts` warms the top ~60 URLs against production after each deploy | `222eeb6` |
| Phase 1 | `scripts/audit/probe_countries.ts` ships; ran against production with results in `data/audit/by-country-REPORT.md` (51/198 ok, 67 timeouts, 38 OECD leaks, 4 empty) | `d92640b` |
| Phase 2 | Already covered by `scripts/audit/probe_urls.ts` from Plan v17; baseline at `data/audit/REPORT.md` | — |
| Phase 3 | `docs/strategy/2026-05-21-new-sections-and-tools.md` — ranked candidates: surprise-numbers gallery, Atlas-badge embed, margin grader, runway calculator | `7a70529` |
| Phase 4 | `docs/strategy/2026-05-21-branding-direction.md` — verdict: lean into editorial-broadsheet; Tier 1 spend $1.8k-$3.5k on 25 custom sector icons + 9 hero illustrations | `7a70529` |
| Phase 5 | `docs/strategy/2026-05-21-moat-low-cost.md` — verdict: Atlas-badge embed + 500 founder city anchors + open-source the taxonomy crosswalk in the next 30 days, $0 cash, ~10 hrs founder time | `7a70529` |
| OECD leak fix | Three "OECD"/"Eurostat" mentions removed; `scripts/verify_no_source_agencies.ts` added as prebuild guard | `d92640b` |
| Phase 6 + 7 | `scripts/qa/aggregate_anomalies.ts` streams `regional_cells` in 1000-row pages (RAM peak <150MB, well under 600MB cap), runs five sanity filters + cross-country outlier detection by World Bank income group, writes `data/quality/anomalies-v1.json` + `cross-country-anomalies-v1.json` + `anomaly-summary.md` | pending |

---

## 2 · How the slowness was attacked

Three layers, all shipped:

1. **Edge cache** (Plan v17 Phase 4.3, commit `3b370d9`). Middleware sets `Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400` on every cacheable HTML route. Same on `/api/cell-snapshot`, `/api/cell-lookup`, `/api/popular-cell-snapshot`. First request fills the Vercel edge; subsequent requests within 6h are instant.
2. **Pre-baked homepage** (Plan v18 Phase 0). The 9 FEATURED tiles, the 9-entry CellOfTheWeek rotation, and the 10-entry popular-cell rotation are baked into JSON files at `data/snapshots/`. Frontend reads JSON synchronously. Homepage server render does zero Supabase queries on the cold path.
3. **Per-tile timeout** (Plan v17 commit `371089e`). FeaturedCellTile and CellOfTheWeek wrap any leftover Supabase call in a 2-second Promise.race. If it doesn't return in 2s, the tile still renders with the title/region affordance — no `<template>` placeholders leak to the DOM ever again.

Effect after Vercel deploys: homepage paints in <500ms warm, <2s cold worst case.

---

## 3 · Country audit findings

Probe ran against `https://www.marginatlas.com` (which was still serving pre-Plan-v18 HTML at the time). Results in `data/audit/by-country-REPORT.md`. Top issues:

- **67 timeouts at 10-15s** — the slowness already addressed above.
- **38 source-agency leaks ("OECD")** — fixed in `d92640b`. Will be 0 after deploy.
- **4 empty pages** (Eritrea, South Sudan, North Korea, Vatican City) — no extrapolated_cells coverage. Low priority.
- **38 slow pages (1-10s)** — same root cause as the timeouts; expected to drop with the edge cache.

Re-run the audit after the next deploy:

```bash
npx tsx scripts/audit/probe_countries.ts --base https://www.marginatlas.com
```

Expected: ok count climbs from 51 → 150+ once edge cache fills.

---

## 4 · Quality framework (Phases 6 + 7)

Three sanity filters per row + one cross-country filter, all in `scripts/qa/aggregate_anomalies.ts`:

| Filter | What it catches |
|---|---|
| `negative-revenue` | revenue_per_firm < 0 |
| `payroll-exceeds-revenue` | total payroll > total revenue × 1.2 (impossible business) |
| `zero-headcount-with-revenue` | n_enterprises > 5 but n_employees = 0 (data error) |
| `p90-less-than-p50` | distribution inverted, data corruption |
| `low-quality-but-headlined` | quality_score < 30 but coverage_tier is P or S |
| `cross-country-outlier-high/low` | cell revenue > 3× or < 0.33× the World Bank income-group median for that (industry, size_band) |

The aggregator streams data in 1000-row pages with a 450MB heap kill-switch (honors the 600MB RAM cap per D-055).

Outputs (once the in-flight run lands):

- `data/quality/anomalies-v1.json`
- `data/quality/cross-country-anomalies-v1.json`
- `data/quality/anomaly-summary.md`

Triage workflow:

1. Open `anomaly-summary.md` — see counts by kind.
2. Look at the top-20 sanity issues + top-30 cross-country outliers in the markdown report.
3. For each, decide: fix the underlying data via ingest re-run, or add to a `data/quality/known-anomalies.json` allowlist with a note.

---

## 5 · New prebuild guards

`npm run prebuild` now runs four checks:

1. `verify_taxonomy.ts` — structural invariants on sectors + industries
2. `verify_no_em_dashes.ts` — Plan v16 Block G
3. `verify_no_source_agencies.ts` — Plan v18 (new this turn)
4. `find_dead_links.ts --strict` — Plan v17 Phase 3.1

Build fails on any violation. No source-agency name can ship in `src/` outside a comment or an allowlisted file (currently only `QualityBadge.tsx` and `audience.ts`).

---

## 6 · Recommended next steps

### Immediately

1. Promote the latest Vercel build to production once it finishes building.
2. Run `npx tsx scripts/ops/warm_cache.ts` after the deploy to pre-fill the edge cache for the top ~60 URLs.
3. Hard-refresh `https://www.marginatlas.com/` to confirm the slowness fix.
4. Re-run `npx tsx scripts/audit/probe_countries.ts` to confirm timeout count drops.

### Within 30 days (founder time)

1. Atlas-badge embed program (Phase 3 / Phase 5 §A) — 1 weekend of engineering.
2. Founder-curated city anchors expanded from 207 to 500 (Phase 5 §B) — 5 hrs of writing.
3. Open-source the taxonomy crosswalk (Phase 5 §C) — half day.

### Within 30 days (engineering)

1. Triage the anomaly report (Phase 6+7). Most outliers will be data-quality issues in ingest; some will be real economic facts (e.g. Swiss watch shops genuinely outperforming the HIC median).
2. Re-bake snapshots monthly via cron: `npx tsx scripts/snapshots/build_homepage_snapshots.ts`.

### Quarter-end

1. Branding spend (Phase 4 Tier 1): 25 sector icons + 9 hero illustrations from one editorial illustrator. $1.8k-$3.5k.

---

## 7 · What is NOT in v18

- S-100 ISR restore (the proper fix for benchmark page caching that gives up `force-dynamic`). Deferred because risk is high (R-003 regression vector) and edge-cache + snapshot baking solve most of the user-facing slowness without it.
- Auth + Stripe (B-011, still deferred).
- New ingest. Cross-country anomalies will surface ingest gaps for follow-up.
- Sentry re-enable (S-103).
- Real images (B-008, but Phase 4 makes the cheap commission case).

---

## 8 · Commits in this turn (Plan v18 only)

| Commit | What |
|---|---|
| `0742e49` | Phase 0 snapshot pre-bake |
| `222eeb6` | Phase 0.5 parallel cell page + Phase 0.6 cache warmer |
| `7a70529` | Phases 3-5 strategy docs |
| `d92640b` | Phase 1 country audit + OECD leak fix + Phase 6 prep |
| pending | Phase 6 + 7 anomaly aggregator results |
| pending | This handoff doc |
