# Page Skeletons Design (locked via brainstorm 2026-06-05)

> The decision-locked design for the site's page structure and the universal
> data board. Supersedes the earlier draft docs/strategy/PAGE-SKELETONS.md.
> Every choice below was confirmed with the founder. Next step after sign-off:
> an implementation plan (writing-plans), then build London-deep-first.

## Locked principles

1. **Maximal data board, least opinion.** Each page is a dense board of
   categorized data tables, not a narrative. The operator reads and judges.
2. **Every section always shown in full. Missing values render as "-".**
   NO self-omit on the data board. This overrides the old hide-weakness
   "omit thin modules" rule: gaps are shown honestly as dashes, so every page
   carries the complete framework and coverage gaps are visible.
3. **Fill with modeled data, labeled per block.** Modeled rows fill the board;
   a small "modeled, directional" note sits UNDER each block that uses
   estimates. No per-row badges. Never fake precision.
4. **Scores: one overall number on top.** A single 0-100 Opportunity score in
   the top strip is the one-glance read; its four parts (profit, competition,
   rent, owner pay) expand on tap. Scores are the only derived layer up top.
5. **No verdict sentence on data pages.** Pure data. The only plain-language
   block is the "what kills weak operators" failure cards at the BOTTOM.
6. **Money in USD only.** Easy cross-place comparison.
7. **Default to "all sizes" typical**, with a size-band switcher.
8. **Tables + targeted mini-viz** (5 charts, see below).
9. **Guardrails on every number** so nothing looks wrong (see Guardrails).
10. Free-only; mobile-first; preserve SEO/slugs; no source-agency names; no
    em-dashes; tokens only.

## Site structure (lean)

Page types (the whole set):
- **Home + search** (entry; the world map is the "pick a country" surface here)
- **Country** (top of spine)
- **City** (sub of country)
- **Activity-in-city / cell** (sub of city) the maximal board
- **Global Activity** (the activity in general, alongside the spine)
- **Compare** (same business across cities)
- **Calculator** (break-even + take-home)
- **Directory indexes**: /countries, /cities, /activities
- **Trust**: /methodology (absorbs about-data), /coverage
- **Learn + Blog**

Hierarchy: **Country -> City -> Activity-in-city.** Regions are non-clickable
groupings (the country page lists each region with its cities). Global Activity
pages sit beside the spine and funnel to "pick a city."
URLs unchanged: cell /[country]/[city]/[activity]; city /cities/[slug]; activity
/industries/[activity].
Deferred (not built now): Decide, World (folds into home/countries), Browse,
Check, About-data (folds into methodology), neighborhood/curiosities sub-pages,
region pages.

## Universal data-board model (every data page)

- **Hero:** a short, wide, smaller plain title ("Restaurants in London") so the
  board shows without scrolling. The animated rotating question stays only on
  the home page. NO verdict sentence.
- **Score strip:** the single overall Opportunity score (0-100, banded), the
  four components on tap. Plus the size/year/currency switcher and a coverage
  dot.
- **Body:** the category sections in fixed order, each a dense label/value
  stat-grid. Every section ALWAYS renders, every row present, "-" for missing.
  Each block capped at ~8 rows with a "show more" toggle for the rest.
- **Mini-viz (5):** revenue-spread bar (p10/median/p90), cost-breakdown bar,
  survival curve, crowding gauge (density), rent-vs-revenue gauge. Embedded in
  their parent sections.
- **Estimate note:** a small "modeled, directional" line UNDER each block that
  uses estimates.
- **Bottom:** the "what kills weak operators" failure cards (the one
  plain-language block).

## The analysis grid (sections + rows). The CELL renders all of A-J.

Each row shows a value or "-". Status: HAVE (on the data), COMPUTE (derivable),
CURATE (curated dataset, London-drop style), DROP (needs a new feed).

- **A. The numbers** (money), money-first: revenue p10/median/p90 [HAVE]
  *(spread bar)*, gross margin [HAVE], operating margin [HAVE], net margin
  [HAVE], owner take-home [HAVE], break-even orders/day vs typical [HAVE],
  people working [HAVE], revenue per employee [HAVE], wage per employee [HAVE].
- **B. The market**: competitors (firm count) [HAVE], density per 10k residents
  [COMPUTE] *(crowding gauge)*, market structure / typology [CURATE],
  concentration / top-operator share [CURATE], chain and franchise share
  [CURATE], business birth and death + annual churn [CURATE].
- **C. Pricing power**: pricing power [CURATE], premium room [CURATE],
  willingness to pay [CURATE], price dispersion [CURATE], tourism premium
  [CURATE].
- **D. Market deformation**: informality [CURATE], tax-evasion normalization
  [CURATE], rent speculation [CURATE], tourism distortion [CURATE], platform-fee
  drag [CURATE], enforcement unpredictability [CURATE], cash-economy share
  [CURATE].
- **E. Tax and compliance**: VAT [HAVE], payroll tax [HAVE/CURATE], corporate
  tax [HAVE], effective tax wedge [COMPUTE], licensing cost [CURATE], permit
  complexity [CURATE], days to register [HAVE].
- **F. Institutional friction** (country-level only, no accusations): bribery /
  inspection exposure [CURATE], permit bottlenecks [CURATE], contract
  enforceability [CURATE].
- **G. Demand depth**: addressable customers [CURATE/DROP], income base [HAVE],
  tourism intensity [CURATE], commuter/student/office mix [CURATE], B2B density
  [CURATE], search/footfall proxy [DROP].
- **H. Location and rent**: rent-to-revenue [COMPUTE] *(rent gauge)*, commercial
  rent level [CURATE], high-street viability [CURATE], tourist-zone premium
  [CURATE], catchment [CURATE].
- **I. Labor and skills**: wage burden / payroll share [HAVE], hiring difficulty
  [CURATE], turnover [CURATE], owner-operator dependence [CURATE], minimum-wage
  pressure [CURATE], skills scarcity [CURATE].
- **J. Survival and fragility**: 1/3/5-year survival [CURATE] *(survival
  curve)*, closure rate [CURATE], rent-shock sensitivity [COMPUTE], wage-shock
  sensitivity [COMPUTE], COGS-shock sensitivity [COMPUTE], seasonality [CURATE],
  minimum viable scale [COMPUTE].
- (Later: K. Acquisition, L. Financing, M. Strategic opportunity. Added as new
  always-on sections when their feeds exist.)

## Per-page slice

- **CELL (activity in city):** score strip + A through J (full grid) + failure
  cards. The maximal board.
- **COUNTRY:** score strip (country-level) + Business climate (E) + Tax reality
  (E) + Friction (F) + Labor/wages (I) + Survival baseline (J) + Market-
  structure summary (B). THEN the **regions-and-cities list** (each region a
  heading, its cities as clickable chips). No best/worst businesses table on the
  country page (that lives on city pages).
- **CITY:** score strip (city-level) + Demand depth (G) + Rent and location (H)
  + Saturation (B) + Survival baseline (J). THEN the **activities-in-this-city
  table**, ranked by owner take-home (best and hardest), each row links to the
  cell.
- **GLOBAL ACTIVITY:** the cost-structure shape (A, structural ratios that hold
  across places) + a low-to-high revenue RANGE across covered cities (never a
  single worldwide average) + structure/pricing/labor/survival archetypes
  (B/C/I/J). Then a "where it works" places table. Funnels to "pick a city."
- **COMPARE:** same business across up to 3 cities, the decisive rows
  (A,B,C,H,I,J) side by side + the single biggest differentiator + mini-viz
  bars.
- **CALCULATOR:** inputs (rent/payroll/COGS/concept/seats) -> break-even +
  owner take-home + rent/wage sensitivity + "vs the local typical" delta.
- **HOME:** plain entry: rotating question H1, search, world map, featured
  cells, what-you-can-ask, editorial rail, trust line.
- **INDEXES** (/countries continent grid, /cities by depth, /activities A-Z):
  compact card directories for browse.
- **METHODOLOGY / COVERAGE:** trust as a feature; how scores are built, source
  priority, confidence model, measured-vs-modeled coverage scorecards.
- **LEARN / BLOG:** explainers (one-line answer then detail) + data stories,
  each linking to live cells.

## Top menu

Countries, Cities, Activities, Compare, Calculator, Learn. (Kept.)

## Titles / SEO

Visible title plain ("Restaurants in London"); meta/search title richer
("Restaurants in London: revenue, margins, survival, competition"). Separate.

## Data guardrails (so no number looks wrong)

- Owner take-home floor: 10+ staff earn at least 2x the country's average annual
  income (already shipped).
- Net margin clamped to a sane floor/ceiling per activity (existing
  margin_floor extended).
- Survival rates bounded to plausible ranges (1yr >= 3yr >= 5yr; within sane
  bands).
- Competitor density sanity-capped per residents.
- All revenue/per-firm figures pass the existing SMB plausibility bounds.
- Every guardrail trims silently; never shows an apology.

## Rollout

London deep first: fully fill A through J for London's ~20 activities (extend
the curated London dataset to every section), each dry-run and shown before any
DB write. Then other UK cities, then other countries. The board renders the full
framework everywhere from day one (dashes where data is missing), and fills in
as curation proceeds.
