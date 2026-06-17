# Page type: City (metro)  (/cities/[slug])

## The one job
Answer one question for an operator scouting a metro: is this a friendly place to open a small business, and what kind of market am I selling into? The single focal point is the Business Climate Score, the one 0-100 number Atlas gives a city (the only scored entity), read against its peers.

## Locked section order

| # | section id | label | data source | realness | block / chart to use | highest-grade treatment |
|---|---|---|---|---|---|---|
| 1 | headline | Hero + Business Climate Score | buildCityScore (modeled, banded on break-in cutoffs) | modeled | `stats-card1` quiet KPI row under a calm hero + KEEP kit `ScoreBand`; ONE optional re-skinned shadcn radial for the hero score moment only | Score is the page's only Newsreader hero number. Flag + country eyebrow in Inter caps. Three quiet supporting stats (population, salary, visitors) in a tabular row, never competing with the score. Generous top air; the radial/ScoreBand owns the right column at 1280, stacks under the title at 375. |
| 2 | honest-take | The honest take | london-exemplar (invented-but-plausible for London; verdict-only elsewhere) | london-exemplar | `cta10` calm accent panel (omit buttons), else `SectionEmpty` | One atlas-50 panel, Newsreader verdict line, up to three Inter bullets. The page's editorial heartbeat: warmer ground, slightly tighter measure (60ch), set apart by whitespace not a border-stripe. Calm placeholder on thin cities. |
| 3 | customer | Who the local customer is | incomeMonthly + cityNetWealth (modeled); incomeSpread real for London only | modeled (+ london real spread) | Stat pair in a `chart-card1` shell + KEEP visx `RangeStrip` ("what residents earn a year") | Two big tabular stats, then the RangeStrip as the signature spread (London only). Note line at 65ch. Spread strip self-omits everywhere but London; the two stats still carry the section so it never reads empty. |
| 4 | space | What space costs | costOfLivingIndex character read (modeled); no quoted rent | modeled | KEEP kit `RealityCheck` (character read) + a small 1-2 stat `data-table1`-style dl | Lead with the plain-English truth line (Newsreader), the index sits as a quiet supporting stat, never dressed as a real rent. Body explains it is a cost character, not a quote. |
| 5 | visitors | Tourist money vs local money | arrivals-vs-population footfall proxy (modeled); London curated | modeled | KEEP kit `VisitorSplit` (one proportion bar, never a pie) | One horizontal proportion bar where the dominant resident slice carries the lone atlas accent; visitor slice neutral cocoa. Headline as the section heading. Note keeps it honest as footfall, not spend. ALWAYS rendered. |
| 6 | owners-keep | What owners keep across trades | buildCityActivities, cell engine, trusted-local only | real | KEEP kit `OwnerKeepTable` (Data Table grade) / `LikeForLikeBars` | Trades ranked by take-home, one break-in meaning chip per row (easy/moderate/hard), net margin and take-home as tabular columns. Self-omits below three real rows to `SectionEmpty`. Each row links to the cell page. Tabular figures, right-aligned money, no zebra. |
| 7 | best-areas | Best areas to set up | BEST_AREAS curated (London only) | london-exemplar | Area cards / definition list + a suits pictogram, else `SectionEmpty` | Four area rows: district name (Newsreader), the trade it suits (atlas-700), the why (cocoa body). Calm divided list, not a card grid clone. SectionEmpty elsewhere. |
| 8 | neighbourhoods | Neighbourhoods | neighborhoods_v1.json + flavour (real) | real | Cover cards, up to four featured (`NeighborhoodCover`) | 2-col (375) to 4-col (1280) cover-card grid, district name + character + up to two prime streets, lift-on-hover. "Explore all" text link. Real or `SectionEmpty`. |
| 9 | changing | How the city is changing | londonChanging (London only) | london-exemplar | KEEP kit `ContrarianInsight` trend card, else `SectionEmpty` | One insight verdict + body, optional three-bullet rail. Quiet, low-contrast; never a speculative trend on a non-exemplar city, where it self-omits to the calm strip. |
| 10 | peers | Rival and peer cities | buildCityPeers + each peer's own score (real) | real | KEEP kit `ComparisonBars` on the shared 0-100 scale + `CityPeers` cover cards | ComparisonBars ranks this city (lone accent) against scored peers on the ONE shared climate scale, with the honesty caveat rail. Cards below carry flags + step-sideways links. Self-omits below two peers. (The `VsWorld` peer-median block rides here with its own empty state, no new anchor.) |
| 11 | one-thing | One thing to remember | view.masthead.answer (modeled) | modeled | KEEP kit `OneThing` close card | Warm single closing line, freshness stamp ("June 2026"), flag-it affordance. Quietest block on the page, full-width, breathing room above. |

## Hero + focal point
The eye lands on the Business Climate Score as the one Newsreader hero number (e.g. 71 / 100), set in the hero's right column on a flagship city. The headline is the verdict sentence the score generates ("London is a good place to start a small business."). Eyebrow = country flag + country name. Directly under the hero, the `ScoreBand` draws the same number on a calm 0-100 track with the four climate words quietly beneath and peer-city ticks, so the lone number gains context without a second loud element. The optional re-skinned shadcn radial is permitted ONLY for this hero score moment, never reused elsewhere on the page. On a thin (non-tier-1) city the score softens: it demotes to a quiet break-in chip and the hero leads on the place, not a confident /100, so we never over-claim precision we do not hold.

## Density & rhythm
Big: the hero score, the ScoreBand, the RangeStrip spread (London), the OwnerKeepTable, the peers ComparisonBars. Quiet: the supporting stat row, the space dl, the one-thing close. It breathes by alternating a heavy data band with a prose/verdict band (honest-take, space RealityCheck, changing) and by generous 6-8 unit vertical gaps between bands.

The collapse rule: a non-exemplar city legitimately has honest-take (verdict-only), best-areas, and changing all unfilled, plus possibly owners-keep, neighbourhoods, peers. Rather than three to six separate gray boxes stacked into a wall, the consecutive unheld sections render as ONE calm "still filling in" strip: a single muted band, one quiet line ("We are still filling in the local detail for {city}: the best areas, how it is changing, and operator voices."), with the section ids preserved as anchors inside it so the locked order and sticky nav stay intact. A section that is genuinely filled (the modeled customer/space/visitors always are) breaks the strip and renders full-grade. This keeps the IA locked while the page reads calm, not skeletal.

## Realness handling
- modeled (headline score, customer stats, space character, visitors split, one-thing): real derived figures, shown plainly, never dressed as a measured local count. The space index is explicitly framed as a cost character, not a quoted rent; the visitor split is explicitly a footfall proxy, not spend.
- london-exemplar (honest-take editorial, best-areas, changing): fully filled for London (founder-sanctioned invented-but-plausible), self-omitting everywhere else.
- real (owners-keep, neighbourhoods, peers): cell engine and curated data, trusted-local only; owners-keep self-omits below three rows, peers below two.
- placeholder: every unheld section renders the calm `SectionEmpty` (eyebrow, heading, place name, muted ground), and consecutive ones fold into the single "still filling in" strip. Never a fake number, never a blank, never a stub headline pretending to data.

## The static-HTML mockup deliverable
A self-contained `/cities/london` mockup (precedent: `E:\atlas\london-prototype-v1.html`), Newsreader + Inter via a Google Fonts link, the section-2 token map declared in `:root`, openable by double-click, legible at 1280 and 375.

Hand-ported, filled with London exemplar + real data:
- Hero with the London climate score as the Newsreader hero number, flag + "United Kingdom" eyebrow, the three real stats (population, average salary, annual visitors), and the `ScoreBand` track with peer ticks.
- The `cta10`-style honest-take accent panel with London's verdict + three bullets.
- The customer band: two stats + the London `RangeStrip` income spread (p10-p90).
- The space `RealityCheck` truth line + the cost-of-living stat.
- The `VisitorSplit` proportion bar (resident slice accented).
- The `OwnerKeepTable` with a handful of real London trades (take-home, margin, break-in chip).
- The four London best-area rows, the four neighbourhood cover cards, the `ContrarianInsight` changing-city card.
- The peers `ComparisonBars` with London + scored peers on the shared 0-100 scale, plus peer cover cards, and the `OneThing` close.

To prove the collapse behaviour, include at 1280 a small inset (or a second short mockup) of a thin city showing the softened hero (chip not anchor) and the single "still filling in" strip standing in for best-areas + changing + operator-voices. At 375: everything stacks one column, the hero score sits above its band, the neighbourhood grid drops to two columns, no horizontal scroll.

## Lead-designer QA (page-specific)
Page-specific risks and how the design avoids them:
- The score reading as a vanity grade or a ranking across geographies. The score is the ONE scored entity; the ScoreBand and peers ComparisonBars only ever compare cities to cities on the identical 0-100 scale, with the honesty caveat rail visible. Districts are never put on this scale against whole cities. No "best city" crown.
- Modeled figures masquerading as measured. The space index and the visitor split are the two easiest to mis-read as real rents/spend; both carry an explicit "cost character / footfall proxy, not a quote" note, and the space block uses RealityCheck (a read) not a data card.
- The placeholder wall. Without the collapse rule a non-exemplar city is six gray boxes. The single calm strip fixes the cringe while keeping every locked anchor.
- Typography. Exactly one Newsreader hero number (the score) plus the headline; every other figure is Inter with tabular lining figures (income spread, take-home, margins, index). Steps differ by >=1.25; verdict prose held to 60-65ch. No flat scale across the stat row.
- Density. Alternate data bands with prose bands; no two identical card grids in a row (best-areas is a divided list, neighbourhoods is cover cards, peers is bars-then-cards), so the page never reads as repeated template tiles.

The four questions:
1. Sense at a glance? Yes: the score + its band is the unambiguous focal point, the verdict headline states the answer in words, supporting stats stay quiet.
2. Cringe? No: one accent, no pie, no gradient text, no repeated card grid, real numbers doing the talking, the placeholder handled as a calm strip rather than skeleton boxes.
3. Typography? Yes: single hero number in Newsreader, Inter + tabular figures everywhere else, deliberate scale steps, controlled measure.
4. Can it be better? Yes, and it is taken there: the lone hero number is given context by the ScoreBand peer ticks (not left as a bare figure), the radial is restricted to the single hero moment so it never becomes decoration, and the many unheld sections collapse to one strip instead of bloating the page, which is the quieter, cleaner result.
