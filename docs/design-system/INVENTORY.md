# Design-System Inventory

**Date:** 2026-05-27
**Source:** Audit pass at the start of Phase 0 of the design-system effort.

Every UI primitive, state component, data primitive, and token source
that exists in the codebase as of today. This is the baseline — anything
the design-system effort touches starts from here.

---

## 1. shadcn-style primitives (`src/components/ui/`)

These 10 already follow the pattern we want every primitive to use: cva
variants, `forwardRef`, `displayName`, focus-visible ring, semantic color
tokens.

| Primitive | File | Notes |
|---|---|---|
| `Button` | `ui/button.tsx` | Variants: default, destructive, outline, secondary, ghost, link. Sizes: default, sm, lg, icon. `asChild` via Slot. Reference implementation. |
| `Badge` | `ui/badge.tsx` | Atlas-skinned shadcn badge. |
| `Card` | `ui/card.tsx` | Surface primitive with Header / Title / Description / Content / Footer subparts. |
| `Accordion` | `ui/accordion.tsx` | Radix-based, animated via tailwindcss-animate. |
| `Tabs` | `ui/tabs.tsx` | Radix-based. |
| `Tooltip` | `ui/tooltip.tsx` | Radix-based. |
| `Separator` | `ui/separator.tsx` | Radix-based horizontal / vertical rule. |
| `ProgressBar` | `ui/progress-bar.tsx` | Tremor-style. |
| `BarList` | `ui/bar-list.tsx` | Tremor-style horizontal bar list. |
| `StatCard` | `ui/stat-card.tsx` | Canonical stat-display primitive. Migrated 4 sites already (Visual upgrade §2). |

## 2. State components (scattered — Phase 2 consolidates)

| Component | File | Replaced by |
|---|---|---|
| `LoadingSkeleton` | `src/components/LoadingSkeleton.tsx` | `ui/skeleton.tsx` (Phase 2) |
| `EmptyState` | `src/components/EmptyState.tsx` | `ui/empty-state.tsx` (Phase 2) |
| `CellDataMissingEmpty` | `src/components/empty/CellDataMissingEmpty.tsx` | `ui/empty-state.tsx` with `variant="cell-missing"` |
| `ComingSoonPlaceholderCard` | `src/components/empty/ComingSoonPlaceholderCard.tsx` | `ui/empty-state.tsx` with `variant="coming-soon"` |
| `SectorUnderConstructionEmpty` | `src/components/empty/SectorUnderConstructionEmpty.tsx` | `ui/empty-state.tsx` with `variant="under-construction"` |
| *(none — to be created)* | — | `ui/error-state.tsx` (Phase 2) |
| *(none — to be created)* | — | `ui/spinner.tsx` (Phase 2) |

## 3. Data-presentation primitives (in the wild — Phase 7 may migrate)

These render data-specific UI. Most are NOT in `ui/`. Many would benefit
from refactoring to use the new primitives but stay in their current
location.

| Component | File | What it does |
|---|---|---|
| `CoverageIndicator` | `src/components/CoverageIndicator.tsx` | Coverage tier chip + tooltip |
| `TurnoverBandChip` | `src/components/TurnoverBandChip.tsx` | Small/medium/large band chip |
| `AuPrimaryDataBadge` | `src/components/AuPrimaryDataBadge.tsx` | "AU primary data" inline badge |
| `CategoryChip` | `src/components/CategoryChip.tsx` | Sector / industry chip |
| `CellWarningChips` | `src/components/CellWarningChips.tsx` | Per-cell warning chips |
| `TypicalFirmCard` | `src/components/TypicalFirmCard.tsx` | "Here's what a typical firm looks like" |
| `LocalContextCard` | `src/components/LocalContextCard.tsx` | City / region context card |
| `KeyBenchmarkBanner` | `src/components/sections/KeyBenchmarkBanner.tsx` | Cell-page hero banner |
| `RevenueDistribution` | `src/components/RevenueDistribution.tsx` | p10/p25/p50/p75/p90 bar |
| `RevenueTiles` | `src/components/RevenueTiles.tsx` | Tile grid for revenue percentiles |
| `SmartWaterfall` | `src/components/SmartWaterfall.tsx` | Cost breakdown waterfall |
| `DistributionVisual` | `src/components/DistributionVisual.tsx` | Distribution density chart |
| `NetProfitSummary` | `src/components/NetProfitSummary.tsx` | Net-profit estimate panel |
| `NetProfitWaterfall` | `src/components/NetProfitWaterfall.tsx` | Net profit cascade |
| `MarginWaterfall` | `src/components/MarginWaterfall.tsx` | Margin cascade |
| `DenseCellHero` | `src/components/DenseCellHero.tsx` | Cell-page dense hero |
| `HeroBenchmark` | `src/components/HeroBenchmark.tsx` | Hero benchmark headline |

## 4. Brand / layout primitives

| Component | File | Notes |
|---|---|---|
| `LogoWordmark` | `src/components/brand/LogoWordmark.tsx` | Atlas wordmark, tone variants |
| `CountryFlag` | `src/components/CountryFlag.tsx` | SVG flag by ISO2 |
| `SectionDivider` | `src/components/SectionDivider.tsx` | Editorial hairline + diamond |
| `SectorIcon` | `src/components/SectorIcon.tsx` + `src/components/icons/SectorIcon.tsx` | Two paths, needs consolidation |
| `IndustryIcon` | `src/components/icons/IndustryIcon.tsx` | Industry-specific glyph |

## 5. Stalled refactors (Phase 7 resolves)

| Component | File | Status |
|---|---|---|
| `FeaturedCardV2` | `src/components/v2/FeaturedCardV2.tsx` | "v2" suggests there's a v1 somewhere it superseded or was superseded by. Resolve. |
| `SectorCardV2` | `src/components/v2/SectorCardV2.tsx` | Same. |

## 6. Where tokens live today

| Source | What's there |
|---|---|
| `tailwind.config.ts` | colors, fontFamily, borderRadius, keyframes, animation. Atlas palette + cream + ink + cocoa + moss + clay + parchment + graphite + teal. |
| `src/app/globals.css` (CSS variables on :root) | `--background`, `--foreground`, `--card`, `--primary`, `--border`, `--ring`, `--radius` — the shadcn aliases that map to the Atlas palette. |
| `src/styles/homepage-visual-tokens.css` | Decorative primitives: `.atlas-dot-grid`, `.atlas-rule`, `.atlas-spotlight`, `.atlas-editorial-line`, `.atlas-pipeline`, `.atlas-rotator__word`. |
| `src/styles/atlas-pattern.css` | Pattern backgrounds. |
| `src/lib/design-tokens.ts` | **Does not exist yet — Phase 1 output.** |

## 7. Total scale

- **136** total `.tsx` components in `src/components/`
- **10** primitives in `ui/`
- **5** state components scattered
- **~17** data-presentation primitives
- **~5** brand/layout primitives
- **~2** stalled v2 refactors
- **~97** remaining (page-specific sections, monetization, search, etc.)

## 8. The seven gaps this plan closes

1. Tokens aren't documented; `text-atlas-700` reads as arbitrary
2. No standardized skeleton system
3. State components scattered across 3 patterns
4. No visual catalog
5. No motion vocabulary
6. No accessibility gate
7. v1/v2 schism unresolved
