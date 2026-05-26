# Visual upgrade §3 — per-page matrix

Date: 2026-05-26.
Author: ben + atlas-bot.
Owner: visual upgrade workstream (§1-§7).
Status: PARTIAL — wave 1 shipped, wave 2 spec'd below.

## Scope

§3 is the "deploy the primitives" pass. §1 built shadcn foundation,
§2 built StatCard, §4 built BarList + ProgressBar, §5 locked typography
tokens. §3 walks every user-facing page and asks: does this surface
use a hand-rolled tile / bar / progress pattern that should be the
primitive?

Goal: visual consistency at the system level. Every stat tile reads
with the same eyebrow-value-sub rhythm. Every horizontal bar list has
the same atlas treatment. Every progress bar has the same track + fill.

## Inventory (44 user-facing pages, admin/dev excluded)

| Page                                  | Hand-rolled patterns                   | Action                  |
| ------------------------------------- | -------------------------------------- | ----------------------- |
| `/` (homepage)                        | none — already migrated                | done                    |
| `/[country]`                          | none — country rebuild used primitives | done                    |
| `/[country]/[geo]`                    | none observed                          | done                    |
| `/[country]/[geo]/[industry]` (cell)  | breakeven panel hand-rolled            | done (round 2)          |
| `/[country]/[geo]/industries`         | none                                   | done                    |
| `/[country]/industries`               | none                                   | done                    |
| `/[country]/[city]/[neighborhood]`    | uses NeighborhoodCard primitives       | done                    |
| `/[country]/[city]/[neighborhood]/[industry]` | uses cell-page primitives      | done                    |
| `/cities`                             | uses CityFlow primitives               | done                    |
| `/cities/[slug]`                      | custom StatTableCell — intentional     | leave (table-grid look) |
| `/cities/[slug]/curiosities`          | low-density text page                  | leave                   |
| `/cities/[slug]/neighborhoods`        | uses primitives                        | done                    |
| `/coverage` (redirect)                | n/a                                    | n/a                     |
| `/coverage/[iso2]`                    | hand-rolled tier bars                  | done (round 2)          |
| `/countries`                          | simple grid                            | done                    |
| `/world`                              | map + supporting tiles                 | done                    |
| `/sectors`                            | tile grid                              | done                    |
| `/sectors/[sector]`                   | uses sector primitives                 | done                    |
| `/industries`                         | A-Z index                              | done                    |
| `/industries/[industry]`              | uses industry primitives               | done                    |
| `/browse`                             | navigator                              | done                    |
| `/pricing`                            | custom price matrix — intentional      | leave (pricing surface) |
| `/calculator`                         | form-driven                            | leave                   |
| `/compare`                            | form-driven                            | leave                   |
| `/compare/cities/[pair]`              | mirror-bar comparison — intentional    | leave (split bar style) |
| `/about-data`                         | text                                   | leave                   |
| `/blog`, `/blog/[slug]`               | text                                   | leave                   |
| `/learn`, `/learn/[slug]`             | text                                   | leave                   |
| `/methodology`                        | text                                   | leave                   |
| `/decide`                             | new picker                             | done                    |
| `/decide/[activity]/[city]`           | top-3 card bars                        | done (round 2)          |
| `/you`, `/saved`, `/account`          | account surfaces                       | leave                   |

## Components inventoried (78 user-visible components)

Bar-pattern audit (`style={{ width: ... }}` on `h-1.5|h-2|h-3` track):

- `AtlasScore.tsx` — gradient bar (atlas-300 → 700). **Leave**: the
  gradient is intentional visual signal for "composite score"; not a
  plain progress bar. Migrating would lose the gradient.
- `AcrossStatesStrip.tsx` — hand-rolled bar list. **Migrated to BarList
  primitive** (also fixed an old bug where bar length was firm-count
  but the displayed number was revenue-per-firm — the two now match).
- `AcrossCountriesStrip.tsx`, `SectorAcrossWorld.tsx` — both deprecated
  per Country-page rebuild §8. **Leave**, scheduled for deletion in
  next cleanup pass.
- `compare/cities/[pair]` mirror bars — intentional split bar pattern
  for A-vs-B comparison. **Leave**.
- `MarginWaterfall.tsx`, `QuartileMarkers.tsx`, `dev/distribution-states`
  — chart primitives with width-based positioning, not progress bars.
  **Leave**.
- `pricing/page.tsx` — pricing matrix; uses `tabular-nums` for prices
  only, no bars. **Leave**.

Stat-tile audit (4-up grid of `label + tabular-nums value + sub`):

- `LocalContextCard.tsx` — 4 hand-rolled tiles. **Migrated to StatCard
  primitive (variant="card", size="lg")**.
- `cities/[slug]` `StatTableCell` — intentional table-grid (divide-x
  borders unify the cells). Per-cell card chrome would destroy that
  look. **Leave**.
- `DenseCellHero.tsx`, `MobileCellHero.tsx` — hero treatments with
  giant display number + p10/p50/p90 strip. Not tile grids. **Leave**.
- `pricing/page.tsx` — pricing display, not stat tiles. **Leave**.

## Wave 1 shipped (this PR)

1. **`AcrossStatesStrip.tsx`** → BarList migration + bar/number mismatch
   fix. Mounted on every cell page that has within-country comparisons.
2. **`LocalContextCard.tsx`** → 4 hand-rolled tiles to StatCard. Mounted
   on every cell page.
3. **(prior round)** `/coverage/[iso2]` tier bars → ProgressBar with
   tier-tone semantic (A green, B atlas, C amber, D muted).
4. **(prior round)** Cell-page breakeven panel "Margin of safety" tile
   → ProgressBar gauge.
5. **(prior round)** `/decide/[activity]/[city]` top-3 cards → per-card
   ProgressBar scaled to max margin so visual comparison is honest.

## Wave 2 (queued, not shipped)

Lower-leverage migrations the matrix surfaced but did not ship in
wave 1:

- **AtlasScore**: optionally add a `tone="gradient"` variant to the
  ProgressBar primitive so AtlasScore can migrate while keeping the
  gradient. Currently the gradient signal is worth the special case.
- **MobileCellHero**: review whether the mobile hero's secondary stat
  row could use StatCard size="sm". Today it uses bespoke compact
  tiles that match the hero rhythm. Migration may not net out positive.
- **DenseCellHero p10/p50/p90 strip**: convert to a horizontal
  three-segment ProgressBar with markers. New primitive needed
  (`DistributionBar`). Defer.

## Quality gate

Wave 1 passes:
- `tsc --noEmit` clean.
- All 13 prebuild gates pass (taxonomy, em-dashes, source-agencies,
  dead-links, featured-tiles, render-guards, deepening, monetization,
  v34-research-rules, no-internal-notes, top-industries-plausibility,
  useless-tiles, typography-consistency).

## Decision log

- **AtlasScore left alone**: gradient is intentional brand signal.
- **Compare-cities mirror bars left alone**: A-vs-B split bar pattern
  doesn't fit a single-value ProgressBar.
- **City `StatTableCell` left alone**: table-grid borders unify the
  cells visually. Per-cell chrome would fragment.
- **DenseCellHero left alone**: bespoke hero rhythm; migration would
  flatten.
- **Deprecated components (`AcrossCountriesStrip`, `SectorAcrossWorld`)
  left alone**: scheduled for deletion next cleanup pass.

## Next workstream

- §6 mobile audit sweep (320/375px) — once §3 is fully done.
- §7 post-ship QA (tsc, prebuild, lighthouse, sentry).
