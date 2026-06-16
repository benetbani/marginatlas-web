# 08 . Chart kit reconciliation (Phase 12 / F4)

The chart kit largely exists already (the R7 Phase-0 primitives plus the older
family). F4 reconciles it to the constitution's §5.2 statistic-to-chart matrix and
the §4.2 chart tokens, rather than rebuilding from scratch.

## Matrix coverage (every statistic has a component)

| Statistic (constitution §5.2) | Kit component | File | Status |
| --- | --- | --- | --- |
| Typical revenue + spread (masthead) | RangeStrip (RevenueRange) | `kit/RangeStrip.tsx` | exists |
| Revenue distribution | RangeStrip | `kit/RangeStrip.tsx` | exists |
| Where the money goes (per-$100 bar, founder pick Q17) | MoneyGoesBreakdown | `kit/MoneyGoesBreakdown.tsx` | exists (kept-row tick added earlier) |
| Where the money goes (optional waterfall) | Waterfall | `kit/charts/Waterfall.tsx` | exists |
| Break-even (gap-is-the-wage, Q19) | ThresholdGauge | `kit/charts/ThresholdGauge.tsx` | exists; gap-two-bar form built on the cell earlier, to fold into the component |
| Risks (severity ladder, Q22) | SeverityGlyph | `kit/charts/SeverityGlyph.tsx` | exists (RiskList renders the ladder) |
| Comparable places nearby (ranked bars, Q20) | LikeForLikeBars | `kit/charts/LikeForLikeBars.tsx` | exists |
| Versus the world | ComparisonBars / VisitorSplit | `kit/charts/ComparisonBars.tsx` | exists |
| Seasonality (12-month bars, Q21) | Seasonality bars | `kit/sections.tsx` Seasonality | exists |
| First year (stage timeline, Q23) | TimelineRibbon | `kit/charts/TimelineRibbon.tsx` | exists |
| Score (city climate) | ScoreBand | `kit/charts/ScoreBand.tsx` | exists |
| Footfall (city/neighbourhood) | HeatStrip / FootfallGrid | `kit/charts/HeatStrip.tsx`, `FootfallGrid.tsx` | exists |
| Position-in-band whisper | TierBar | `kit/charts/TierBar.tsx` | exists |
| Tourist vs local | VisitorSplit | `kit/charts/VisitorSplit.tsx` | exists |

Gaps to build during page reform (Part IV), only where a page needs them:
`TornadoLevers` (what-moves-the-cost), `OwnerKeepBand`, `CostToOpenRange`,
`NineLensRadar`/`OpportunityScatter`/`CharacterSpectrum`/`RolePayRails` (country/city
primitives already exist in the engraved kit and are folded in as those pages reform).

## Contract (already in force, confirmed)
Every chart component: accepts nullable inputs and returns `null` on insufficient
data (graceful silent omission, no placeholder chart); shows the full spread, never
a lone point; is server-renderable SVG/HTML (no client-only hook in the SSR path);
sets numerals in Inter `tabular-nums`; carries at most one accent. Shared helpers in
`kit/charts/helpers.tsx`. Catalogued at `/dev/charts`.

## Tokenization (F4, incremental and safe)
The chart tokens (`chart.primary/kept/cost/baseline/grid/caution/danger`, §4.2) now
exist and are Tailwind-exposed. F4 migrates the **spotlight** role across all chart
components: `bg-atlas-500` to `bg-chart-primary` (an exact 1:1 value match,
visually identical, 14 sites). The shade-gradation roles each component uses
(moss-500/700 kept tints, cocoa-300/500 cost mass, cream-200/300/400 tracks/grid)
are richer than the lean 7-role set, so the remaining per-component migration is
done **as each page reforms** (Part IV), when the chart renders in its real context
and can be SEEN at 1280 and 375. This keeps the migration regression-safe rather
than a blind cross-kit sweep. If the gradations recur, the chart-token set is
extended then (e.g. `chart.keptSoft`, `chart.costSoft`, `chart.track`).

## Exit
The kit covers the matrix, the contract holds, the spotlight reads the chart token.
Remaining: fold the cell's gap-two-bar break-even form into ThresholdGauge, and
complete per-component tokenization during page reform. The Foundation's chart layer
is ready for the six-band layout (F5) and page reform (Part IV).
