# Page type: Industry / activity  (/industries/[industry])

## The one job
This page answers, for one trade with no place picked yet: how does this kind of small business make money, and how little of each sale survives to the owner. The single focal point is the Newsreader verdict thesis (the opinionated model read) sitting over one anchor figure: the typical-revenue band from the US-state cohort, or, when that band is too thin, the kept-per-$100 share. The reader leaves with the cost shape in their head and a place picker to make it real.

## Locked section order

| # | section id | label | data source | realness | block / chart to use | highest-grade treatment |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `hero` | Hero, verdict model read | `view.masthead` (verdict + US-state revenue band + place-stable shares) | modeled, GATE id | Answer hero pattern (`stats-card1` row under a quiet hero) + KEEP kit `RangeStrip` for the 7-gradation spread; `AtlasPictogram` eyebrow; `ActivityPlacePicker` | The verdict H1 in Newsreader, ~clamp(2.5rem,5vw,3.75rem), one anchor number in display tabular figures, RangeStrip a single thin band under it. NO tier chip, NO London fill. Pictogram + sector eyebrow small and quiet. Place picker is the one primary action, full-width on mobile. |
| 2 | `honest-take` | The honest take | `view.honestTake` (verdict close + activity watch-out) | modeled | `cta10` as a calm accent panel (buttons omitted), or `SectionEmpty` when it cannot form | One short serif verdict line + up to two plain points. Warm atlas-50 ground, generous padding, no icons. When unheld it collapses to a calm SectionEmpty, never a fake line. |
| 3 | `how-it-works` | How it makes money (model anatomy) | `verdict.lead` + `verdict.signals` (cost stages as qualitative words) + `character` | modeled, GATE id | `feature43`/`feature108` icon-or-tab grid reskinned as `BeatCard` with a signal-word dl | The page's primary search H2 ("How {trade} make money"). Each cost stage one qualitative word in display type, tone-colored (moss/atlas/clay), with a one-line note. 2-col on desktop, stack on mobile. The distinctive move; give it the most room. |
| 4 | `money` | Where the money goes (per $100) | `view.moneyGoes` (per-$100 split from margin shape) | modeled | KEEP kit `Waterfall` (or `chart-card1` 100%-wide stacked), `MoneyGoesBreakdown` | One per-$100 bar, kept row in moss, cost rows in cocoa/ink. Direct labels, tabular figures, never a pie. Place-stable shares stated as such. Sits inside the how-it-works beat as the payoff. |
| 5 | `typical-operator` | A typical operator | `view.typicalOperator` (structure read into plain facts) | modeled, GATE id | `PlainTerms` (data-table1 sibling), or `SectionEmpty` | Plain term/value rows, no fabricated headcount. Self-omits below 2 facts to a calm SectionEmpty. Quiet block, lots of line-height, no chart. |
| 6 | `where-it-earns` | Where it earns most | `stateRows` (US-state cohort, after-tax take-home) | real, GATE id | KEEP kit `LikeForLikeBars` over the US-state cohort ONLY (or the ranked list reskinned), `BeatCard` | A like-for-like ranking, US states only, ordered by modeled after-tax take-home. The honesty rail copy ("one currency, one tax system; we do not rank across borders") stays. NO cross-country ranking. Rows open to the cell page. |
| 7 | `margin-waterfall` | The cost stack, cut by cut | `margin` (gross/operating/net) | modeled, GATE id | KEEP kit `MarginWaterfall` (`MarginWaterfall.tsx`) | One cut-by-cut waterfall, the deepest read. Atlas for the surviving bar, cocoa for the cuts. The gap between top and bottom bar is the visual punchline. Generous vertical room, direct labels. |
| 8 | `cost-drivers` | What moves the cost | `view.costDrivers` (largest non-kept lines) | modeled | `CostDrivers` brand block (or `feature43`-style impact rows) | The same per-$100 cost lines re-cast as the few levers, ranked by impact (3/2/1), all "down". No new numbers. Quiet, scannable, omits honestly when no cost structure. |
| 9 | `related-links` | Go deeper | `relatedActivities` (taxonomy siblings) | real, GATE id | `cta10` / Gallery grid of sibling cards, or `SectionEmpty` | A taxonomy rail, NOT a ranking. Uniform sibling tiles with pictogram + examples. Calm closing hand-off, never implies one trade beats another. |
| 10 | `one-thing` | One thing to remember | `verdict.close` | modeled | `OneThing` close block | One sentence, serif, lots of air. The page exhales here. `lastChecked` date small and muted. |

## Hero + focal point
The eye lands on the Newsreader verdict thesis (a real opinion, no number, ending in a full stop, e.g. "Restaurants run on volume, and almost none of it survives the kitchen."). Directly under it: the single hero number in display tabular figures, either the typical-revenue median ("Typical revenue a year, across the US markets we measure") with the signature RangeStrip spread under it, or, when the US-state band is too thin to defend, the kept-per-$100 share ("Kept by the owner per $100 of sales, before any place is picked"). The eyebrow is the AtlasPictogram + sector name, small. The one-line answer sits between thesis and number. The primary action is the place picker ("pick a country and city"); the secondary is the quiet across-cities link. No tier chip exists at this altitude (an activity carries no single confidence read), and there is no London fill here.

## Density & rhythm
Big: the hero verdict + anchor (screen one), the how-it-works model anatomy with its signal words (the distinctive move, most room), and the cost-stack waterfall (the punchline). Quiet: the honest-take panel, the typical-operator plain terms, the cost-drivers levers, the related rail, and the one-thing close. Breathing room comes from `space-y-6 md:space-y-8` between beats and generous in-card padding, not from dropping sections.

Most industry pages are NOT London, so several sections will be thin. They do not stack into a wall of empty boxes: each unheld required section (honest-take, typical-operator, where-it-earns, related-links) renders ONE calm SectionEmpty at its anchor, and the conditional `money`/`cost-drivers` simply self-omit. The RangeStrip and anchor vanish together when the band is thin, so the hero stays clean (thesis + answer + shares) rather than showing a dashed number. The result reads as a confident template with a few "still filling in" notes, never a broken page.

## Realness handling
- Hero (modeled): real verdict + real US-state band when defensible; the band/anchor self-omit to the kept-share fallback (a true structural ratio, clearly labeled, never revenue) when thin. No invented dollars.
- Honest take (modeled): real when verdict.close or watch-out exist; else a calm SectionEmpty reading eyebrow "The honest take", heading "What to know before you commit", with the trade name. Never a fake verdict.
- How it works (modeled): always renders (margins fall back to a conservative default), but each signal/clause self-omits on a missing input. Qualitative words only, no fabricated number.
- Money / per-$100 (modeled): renders only when the margin shape forms a credible $100 split (>=2 cost stages + kept, summing near $100); else absent. Shares labeled place-stable.
- Typical operator (modeled): plain facts from structure; SectionEmpty below 2 facts. No fabricated headcount or revenue-per-operator.
- Where it earns most (real): US-state cohort only, after-tax take-home, garbage tails dropped upstream. SectionEmpty when fewer than 2 states resolve. NEVER a cross-country rank.
- Margin waterfall (modeled): always present from the curated margins; notes line shown only when it is real editorial (not a TODO/clone marker).
- Cost drivers (modeled): derived from the held split; the block's own honest empty state when no cost structure, never a fabricated lever.
- Related links (real): taxonomy siblings; SectionEmpty ("Go deeper" / "Into the places and businesses") when a sector has no other measured siblings. Not a ranking.
- One thing (modeled): the verdict close.

The single SectionEmpty voice across all of them is calm and identical in shape ("still filling in" for {trade}), so the placeholders read as one quiet system, not as scattered failures.

## The static-HTML mockup deliverable
A self-contained `.html` (Newsreader + Inter via Google Fonts link, the section-2 token map as `:root` vars, openable by double-click), modeled on `london-prototype-v1.html`, filled with Restaurants (a trade with a real US-state band, real margins, and written character, so it shows the page at full richness).

At 1280: left body column + sticky section-nav rail (xl). Hand-ported, in order: the answer hero with the verdict H1, the typical-revenue anchor and a real RangeStrip spread, the pictogram/sector eyebrow, and the place picker; the calm honest-take panel; the how-it-works beat with the signal-word grid (the model anatomy) and the per-$100 Waterfall; the typical-operator PlainTerms; the where-it-earns US-state LikeForLikeBars/ranked list with the honesty rail copy; the MarginWaterfall cut-by-cut; the CostDrivers levers; the related-activities sibling grid; the one-thing close.

At 375: single column, no horizontal scroll, hero number and waterfalls legible, place picker full-width, nav collapses to a chip row, 44px tap targets.

To prove the honesty system, include ONE thin-trade variant (or an annotation) showing a section collapsed to its calm SectionEmpty and the hero leading with the kept-share fallback (no dashed number). Real restaurant margins/band fill the live sections; the collapse is shown, not faked.

## Lead-designer QA (page-specific)
Specific risks for THIS page:
- Three waterfall-like things in a row (per-$100 split, where-it-earns bars, the MarginWaterfall) can read as repetitive bar soup. Avoid it by giving each a distinct job and shape: the per-$100 is one horizontal 100-unit bar inside the how-it-works beat; where-it-earns is a ranked like-for-like list/bars; the cut-by-cut is the only true vertical waterfall, spaced apart and visually owning the "the gap is the whole game" moment. Vary card rhythm so they don't form an identical grid (an impeccable ban).
- The kept-share fallback reading as revenue. It must always carry its "per $100 of sales, before any place is picked" label and use the kept/moss treatment, never the revenue anchor styling, so it never looks like an invented dollar figure.
- Cross-geography ranking creep. Resist any temptation to merge the country cohort into where-it-earns or to rank trades across borders. US-state cohort only; the honesty rail copy stays load-bearing.
- Placeholder pile-up on thin trades. Without care a non-London trade becomes a stack of empty boxes. The single calm SectionEmpty voice plus the conditional self-omits keep it to a quiet "filling in" rhythm.
- Typography: verdict H1 and the one hero number in Newsreader; everything else Inter. Tabular lining figures on every number (anchor, per-$100, take-home, percentages). Steps differ by >=1.25; signal words in display size so the anatomy reads as the hero of its section. Body 65-75ch.
- No em-dashes, no source-agency names anywhere in copy (the margins JSON's source field is internal-only).

The four questions:
1. Sense at a glance? Yes: thesis + one anchor + the model anatomy answer the "how does this make money" question on the first screen, with one focal point.
2. Cringe? No: no second loud color, no decorative animation, no repeated identical card grids, real numbers and real opinions carry it; the placeholders are calm, not apologetic.
3. Typography works? Yes: Newsreader for the one thesis + one number, Inter elsewhere, tabular figures throughout, varied scale, signal words promoted.
4. Can it be quieter/better? Yes, applied: the four conditional/unheld sections collapse to one calm SectionEmpty voice, the three bar-shaped charts are deliberately differentiated, and the close exhales on a single line. Then asked again, and it holds.
