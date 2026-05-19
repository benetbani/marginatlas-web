# Wave 1 Audit Findings — 2026-05-19

Read-only inventory of every public-facing offender that Wave 1 must touch.
`/admin/review` is intentionally excluded (engineering surface, keeps year strings + cell counts).

## Year-string hits (public render paths)

| File | Lines | What it renders |
|---|---|---|
| `src/components/CellWarningChips.tsx` | 115, 125 | `"Data from {year} — refresh pending"`, `"{year} data — newer benchmarks available for some neighbors"` |
| `src/components/CountryQualitySummary.tsx` | 79-83 | `{year_range[0]}–{year_range[1]}` rendered as the "data years" stat tile |
| `src/app/[country]/[geo]/[industry]/page.tsx` | 101 | `${cell.year}` interpolated into the page description meta tag (visible in OG previews) |

Excluded (internal — leave alone):
- `src/app/admin/review/*.tsx` (admin surface)
- `src/lib/blog.ts`, `src/lib/tax.ts`, `src/lib/currency.ts`, `src/lib/cells.ts`, `src/app/status/page.tsx` (year is a data field, not user-rendered prose)
- `src/app/api/ask/route.ts` (anthropic-version: "2023-06-01" is an API header, not user-facing)

## # firms hits (public render paths)

| File | Lines | What it renders |
|---|---|---|
| `src/app/[country]/[geo]/[industry]/page.tsx` | 101, 199, 344 | Desc string "...spread across X firms"; `nEnterprises={cell.n_enterprises}` prop on `TypicalFirmCard`; body text "**N** of them in {geo_name}, employing..." |
| `src/components/TypicalFirmCard.tsx` | 15, 23 | Card displays firm count + derived avg-employees-per-firm |
| `src/components/TimeSeriesChart.tsx` | 12, 17, 81 | Chart can be sliced by `metric: "n_enterprises"` with title "Number of firms over time" |
| `src/app/compare/CompareClient.tsx` | 270 | `["Firms", (c) => c.n_enterprises, fmtNum]` column entry in comparison table |
| `src/app/you/CompareToMeClient.tsx` | 28 | Used in compare-to-me client (verify what it renders) |
| `src/app/og/cell/route.tsx` | 45 | OG image fallback "Many firms" |
| `src/app/[country]/page.tsx` | ? | Need to grep — likely uses CountryQualitySummary stats |

Excluded (internal — leave alone):
- `src/lib/cells.ts` (DB field, internal sort, returned in row shape — never deleted, just not rendered)
- `src/app/api/popular-cell-snapshot/route.ts` (internal API)

## Engineering-jargon hits

| File | Lines | What it renders |
|---|---|---|
| `src/components/CountryQualitySummary.tsx` | 61, 68, 83 | "cells in atlas" tile, "avg confidence" tile, "data years" tile — the entire "Data depth" panel exposes internals |
| `src/app/world/page.tsx` | 4, 57 | `"sized by cell count and colored by data confidence"` description text |

**Decision per spec P3**: Delete `CountryQualitySummary` entirely from country pages OR strip down to ONLY industries-covered. Stripping is cleaner (preserves the panel layout).

## Flag component

Need to locate. Grep for components rendering country flags:

```bash
npx grep -rn --include='*.tsx' -E 'flag\.svg|flagcdn|flagsapi|CountryFlag|<Flag' src/components src/app
```

To be discovered by the implementer subagent — could be inline `<img>` in `src/app/[country]/page.tsx` rather than a dedicated component.

## Argentina regional coverage check

Per founder feedback "For Argentina, I cannot even see the region" — Argentina (AR) likely has zero regional_cells rows. Manifest builder (Task 9) confirms this empirically; helper (Task 10) hides the Regions tab when missing.
