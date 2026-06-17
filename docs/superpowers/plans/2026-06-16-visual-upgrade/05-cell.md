# Page type: Cell (activity-in-place, the X-in-Y page)  (/[country]/[geo]/[industry], e.g. /gb/london/restaurants)

## The one job
Answer one question for someone weighing this exact business in this exact place: what does a [trade] in [place] actually earn, and what would the owner keep? The single focal point is the masthead's one Newsreader hero number (typical revenue a year) sitting on its RangeStrip spread, with the take-home as its immediate echo.

## Locked section order

| # | section id | label | data source | realness | block / chart to use | highest-grade treatment |
|---|---|---|---|---|---|---|
| 0a | masthead | Business + place + anchor revenue with spread | real (gated `moneyShown`) | real | quiet hero + `stats-card1` KPI row + KEEP visx `RangeStrip` | The one Newsreader hero number, oversized, tabular; RangeStrip directly under it with TYPICAL/spread marks; three calm stat tiles (net margin, take-home, firms). Most whitespace on the page lives here. |
| 0b | make-it-yours calculator | Make it yours | real (mounts only when real take-home + revenue held) | real | bespoke calc card (shadcn `card` + `input` + `switch`), not a block | Sits immediately under the masthead, framed as "your scenario". Quiet, single-column, one terracotta CTA tone on the result line. Mounts silently when data absent (no empty shell). |
| 1 | honest-take | The honest take | london-exemplar (verdict derived elsewhere) | london-exemplar | `cta10` calm accent panel (buttons omitted) + break-in `ScoreBand` gauge | Verdict in Newsreader-adjacent weight, one short line; ScoreBand "easier/harder to break in" tick beside it. Calm atlas-50 panel, never loud. Follows the number directly (the masthead IS the lead). |
| 2 | narrative | In context | modeled (live-derived from page figures) | modeled | quiet prose block (no chart), narrow measure | LOW visual weight: two sentences at 65ch, ink-600, generous lead. Deliberately the quietest band on the page. |
| 3 | plain-terms | In plain terms | modeled (gated `moneyShown`) | modeled | `feature43` icon grid re-skinned as unit cards | Icon-led tangible-unit cards (covers a day, average spend, people on payroll). Few, big, airy; not a dense stat grid. |
| 4 | money | Where the money goes | modeled (gated `moneyShown`) | modeled | KEEP kit `Waterfall` (+ optional 100%-wide stacked div) | Per-$100 waterfall; the kept row gets the lone vermillion (atlas-500) tick, every cost line in cocoa/ink neutrals. NEVER a pie. Direct labels, tabular. |
| 5 | cost-drivers | What moves the cost | modeled (derived from the money split) | modeled | ranked horizontal bars from the kit (`ComparisonBars`-family, single-series) | Ranked bars of the largest non-kept lines, impact-weighted. Reads as a continuation of #4, lighter, no second chart shell competing. |
| 6 | owner-take-home | What the owner keeps | real (gated `moneyShown`) | real | KEEP `ScoreBand` OR a kept-vs-gone single bar; ONE optional re-skinned radial for a hero moment | Kept-vs-gone bar with the kept slice in moss; the take-home dollar repeated in tabular figures. Optional margin radial only if it earns the moment, else the bar. |
| 7 | break-even | Break-even | modeled (gated, floor >= 2/day) | modeled | KEEP kit `ThresholdGauge` | Amber-below / moss-above, lone atlas tick at break-even, a quiet "typical day" tick to the right. One sentence above it. |
| 8 | risks | What to watch | london-exemplar | london-exemplar | KEEP kit `SeverityGlyph` rows | Moved UP (sits right after money/break-even per the upgrade note). Severity glyph + title + one calm note per row; rare/watch/serious cues, never alarmist red walls. |
| 9 | wages | Pay by role | london-exemplar | london-exemplar | NEW compact range / dumbbell primitive (RangeStrip sibling) | Floating range rows per role (low-median-high). Median dot in atlas, the bar in neutral. Compact, three to four rows, tabular pay figures. |
| 10 | startup-cost | Cost to open | modeled | modeled | stacked cost bar (kit stacked primitive / `chart-card1` stacked) | Single horizontal stacked bar of fit-out / kit / deposits / float, one total in Newsreader-weight. Calm cocoa stack, one atlas total. |
| 11 | seasonality | Through the year | london-exemplar | london-exemplar | PORT shadcn `chart-area-gradient` SHAPE, single atlas series | Twelve-month area with a soft atlas gradient fill, stripped axes, one direct "busiest / quietest" label. Its sweet spot; keep it serene. |
| 12 | first-year | Your first year | london-exemplar | london-exemplar | KEEP kit `TimelineRibbon` | Four time-tagged milestones; the break-even node carries the single vermillion dot (the one emphasis). Horizontal ribbon, airy. |
| 13 | nearby | The same business nearby | real (suppressible) | real | KEEP kit `LikeForLikeBars` (honesty rail load-bearing) | Like-for-like comparable places only, honesty rail kept. Suppressed for districts (no district-vs-city). Bars in neutral, subject in atlas. |
| 14 | operator-voices | Operator voices | placeholder/exemplar | placeholder | calm `SectionEmpty` (or static quote wall on exemplar) | On most cells: collapses into the "still filling in" strip. On London: a quiet static quote wall, no avatars, no fake names presented as data. |
| 15 | vs-world | Versus the world | placeholder | placeholder | KEEP `ScoreBand` vs global median (one site-wide grammar) | When held: ScoreBand with a global-median peer tick. When not: calm SectionEmpty in the strip. Never a fabricated world number. |
| 16 | related | Related | real | real | `cta10` / quiet gallery grid of links | Plain link tiles to nearby businesses + places. Hand-off, calm, no hard sell. The page's last visual breath. |

(Section-constitution items "cost to open / startup-cost", "operator-voices", and "vs-world" map to the manifest ids above; "one thing to remember" is carried as the page's closing line, reused from the honest-take verdict, rendered just above `related`.)

## Hero + focal point
The eye lands on ONE thing: the typical-revenue-a-year number, set in Newsreader at the largest type on the page, rounded to the nearest $1,000 (no false precision), tabular figures. Directly beneath it, the RangeStrip shows where that number sits in the spread (p10 to p90) with the TYPICAL mark aligned to the hero figure. The headline above is a full plain sentence ("A London restaurant clears about $Xk for its owner in a normal year." when take-home is held, else "What a restaurant in London really earns."). The primary "answer" is the take-home, echoed in the stat row and in the calculator's result line. There is no marketing CTA button competing with the number; the calculator is the one interactive affordance, and it sits below, framed as the reader's own scenario.

## Density & rhythm
Big: the masthead (hero number + spread + stat tiles) owns the first screen with the most whitespace on the page. Where-the-money-goes (#4) and break-even (#7) are the two mid-page anchors that get full-width breathing room and a real chart each.

Quiet: narrative (#2) is deliberately the smallest, plainest band, two sentences at a narrow measure. Cost-drivers (#5) rides directly off the money chart as a lighter continuation rather than a fresh full card. The risks/wages/seasonality/first-year run is a calm rhythm of one-visual-each sections, never two charts fighting on a screen.

The collapse: every unheld or placeholder section (on a typical non-London cell that is operator-voices, vs-world, and any London-exemplar section that does not fill: wages, seasonality, first-year, risks, plus nearby if suppressed) does NOT each render its own empty card. Consecutive unheld sections fold into ONE calm "still filling in" strip: a single low-contrast band that lists the section names as muted labels with a short honest line ("These fill in as we hold a local read for this place."). This is the mechanism that keeps a thin cell from reading as a wall of dashes while still honoring "every section always present".

## Realness handling
- real (masthead, calculator, owner-take-home, nearby, related): show the real figure. Gated by `moneyShown = isLondon || isTrustedLocal`. If money is not shown, the anchor / spread / take-home / per-$100 / plain-terms / break-even all silently withhold (return null), and their sections route into the collapse strip rather than printing a dashed shell.
- london-exemplar (honest-take, risks, wages, seasonality, first-year): fully filled ONLY on London (or other founder-sanctioned exemplar). Off-exemplar these self-omit into the strip; they never invent role wages or seasonal curves for a place we have not held.
- modeled (narrative, plain-terms, money, cost-drivers, break-even): filled from real held figures where `moneyShown`, tagged as modeled-from-national-pattern in the honest-take body line ("read them as a starting point, not a measured local number"). The shape is honest; the dollars are flagged directional.
- placeholder (operator-voices, vs-world): never a fake quote, never a fake world rank. Each reads as a calm `SectionEmpty` line inside the collapse strip: the section heading stays present, the body is one muted sentence ("We are still gathering operator voices for this place." / "A worldwide comparison lands once we hold the global read."). No number, no dash grid, no greyed-out fake chart.

## The static-HTML mockup deliverable
A single self-contained `.html` (double-click openable, precedent: `london-prototype-v1.html`), legible at 1280 and 375, loading Newsreader + Inter via a Google Fonts link and declaring the one token map in `:root`.

Filled with the London restaurants exemplar so every band shows its best self:
- masthead: hero revenue number + hand-ported RangeStrip + three stat tiles.
- calculator: a static rendition (sliders/inputs shown in a resting state with a worked result).
- honest-take: `cta10`-shape panel + a hand-ported ScoreBand break-in tick.
- money: hand-ported Waterfall with the kept row vermillion.
- break-even: hand-ported ThresholdGauge with break-even + typical-day ticks.
- wages: the new dumbbell/range rows.
- seasonality: the ported area-gradient, single atlas series.
- first-year: TimelineRibbon with the emphasized break-even node.
- nearby: LikeForLikeBars with the honesty rail visible.

Shown vs collapsed in the mockup: render the full filled flow once (London) so the founder sees the ceiling, AND include ONE rendition of the "still filling in" collapse strip (e.g. operator-voices + vs-world folded together) so the calm-placeholder behavior is visible in the same document. At 375 everything stacks single-column with no horizontal scroll; the RangeStrip, Waterfall, gauge and area each reflow to full width; the stat tiles stack; the dumbbell rows keep their low-median-high legibility.

## Lead-designer QA (page-specific)
THIS page's specific risks:
- Too many charts in a row (money, cost-drivers, owner-keeps, break-even, wages, startup, seasonality, first-year, nearby is nine visuals back-to-back). Mitigation: vary the rhythm deliberately, only the two mid-page anchors (money, break-even) get full chart-card weight; cost-drivers rides off money as a lighter list; narrative and the strip act as palate cleansers between chart runs.
- Number-soup / false precision. Mitigation: one hero number only, rounded to $1,000; tabular figures everywhere; the take-home is repeated, not multiplied into new variants.
- The honesty leak. Mitigation: every gated section obeys `moneyShown`; placeholders are calm SectionEmpty lines, never dashed numbers; per-$100 and take-home show together or not at all; districts never compared to cities (suppressInventedPeers).
- AI-slop tells. Mitigation: no pie for the money split, no side-stripe accent cards, no identical card grid repeated, no second loud color (atlas alone, moss only for kept, amber only for break-even/caution), no gradient text, no fake operator headshots.
- Typography. Newsreader reserved strictly for the page headline and the one hero number; Inter for all else; steps >= 1.25; body 65 to 75ch; tabular lining figures on every figure.

The four questions:
1. Sense at a glance? Yes: one revenue number on its spread is the first and only focal point; the take-home answers "so what do I keep" one beat later.
2. Cringe? No, if the chart-run rhythm is varied and the collapse strip replaces the dashed-wall; the risk is density, which the rhythm plan and the strip defuse.
3. Typography? Works: a single display use (headline + hero number), strict Inter elsewhere, tabular figures, controlled measure, no flat scale.
4. Can it be quieter / better? Yes, and the design takes it: narrative shrunk to two lines, cost-drivers demoted to a sub-list off the money chart, all unheld sections folded into one calm strip instead of nine empty cards. Re-ask after the mockup at 1280 and 375.
