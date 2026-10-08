# The six UK cities marked: every figure official, an estimate in its line, or none (2026-10-08) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every figure on the six other UK city pages (Manchester, Birmingham, Leeds, Glasgow, Edinburgh, Bristol) and on their trade
pages is an official figure, says it is an estimate in its card's one line, or is withheld, as London's are since masterplan step
03; one gate holds all seven cities (QUEUE `uk:cities-sourced-or-marked`, launch BLOCKS).

**Architecture:** The predicate splits in two (his decision 2). `cityHeldToSources(iso2, slug)`, true for every UK city with a page,
picks what a card's line SAYS; `cityRegisterPlace` stays London's alone and picks which figures a page READS. Where London's figure
is the shard's too (living, the runway, the permits, the crew, the visits, the district rents) the builder's branch moves to
`cityHeldToSources` and the six take London's estimate line word for word. Where London reads a register (the premises, the board,
the peers, the market) the builder gets three cases: London's official figure as today, the six's shard figure with its estimate
line, everywhere else as today. Four cards London never drew (the spend, the split of the footfall, the calendar, the market's
densities) get an estimate line of their own. The six's trade pages take London's trade's-typical lines and keep the city's own
density, marked. Nothing is withheld that has an honest one-line estimate (his decision 1: mark now, source later). The gate
`uk-city-sources` (London's gate, generalised) holds every card's line on all seven; the five browser gates measure the seven
renders by hand, since the six are not in the chain's list and stay out of it.

**Tech Stack:** Next.js 15 (App Router), TypeScript, tsx-run gate scripts (`scripts/prebuild_all.ts`), the harness renderer
(`scripts/harness/render_page.tsx` through `scratchpad/reform/render_some.sh`), Playwright's Chromium for the browser gates; the
design repo `E:/atlas` (QUEUE).

**Ground rules (binding on every task):** no push, deploy, merge into main or force-push without his word; no Stripe, Supabase,
Vercel or DNS setting changed; no migration applied; no `.env` value printed; no install or download; no invented figure; one
change, one verification, then a commit; `tsc --noEmit` after any restore or late fix (the chain runs no typecheck); patches
holding a backslash go through the Edit tool, never a Bash heredoc (it turns `\b` into a backspace). Never raise a ratchet
baseline. Chromium is installed, so the browser gates run locally. Run `node node_modules/tsx/dist/cli.mjs`, not npx. Every
verification writes to a file under `scratchpad/uk-cities/` and is read there, never piped into a formatter (a pipe hides the exit
code). Free memory sits near 1 GB: renders and browser gates run one at a time, and one that dies for memory waits 60 s and runs
again. Another session may commit on `whats-left` meanwhile (src/lib/taxonomy.ts, src/middleware.ts, the routing files): this
plan touches none of them; if a commit meets a moved HEAD, commit on top.

---

## Where things stand (measured 2026-10-08 on `whats-left` at 7395d11d: production main d2cefe6b plus the built-in-word 404)

- The seven UK city renders (`bash scratchpad/reform/render_some.sh "city <slug>"`, node only) were drawn fresh and read card by
  card. London prints the lines of masterplan step 03. The six print their shards' and the city list's figures under lines that
  never say "estimate", on every card but the answer, the earnings strip and the people table, whose figures are official.
- The six's typical pay is official, not the shard's guess: `owner_col.median_salary_usd_mo` on all seven UK shards was set from
  the earnings survey's April 2025 full-time median by residence on 2026-09-25 (website 3acaf667; research note
  `E:/atlas/design/loop/build/research/2026-09-25-uk-official-figures.md`, row 19: Manchester 36,278 pounds, Birmingham 35,989,
  Leeds 36,716, Glasgow 38,125, Bristol 39,509, Edinburgh 43,169), and About the figures names that survey for "the UK's and its
  cities'" pay (`src/lib/spine/uk_sources.ts:61`). Each shard's month times twelve sits within 5 dollars of the pounds at the site's
  one rate.
- Every one of the seven shards holds the same "Health & food-hygiene permit": required, 28 days, no fee. London's permits line
  ("Estimates, but food registration is free. ...") is true of all seven.
- The UK's own page prints no deposit (its render holds no "deposit" at all), so a city's six months contradicts nothing a reader
  can see; London withheld its deposit for that disagreement with the country file's three months.
- The six's trade pages (`/gb/manchester/restaurants` rendered as `cell gb manchester restaurants`) print the world-typical cards
  London marks through `sayTradeTypical` (split, team, clears, mix, customers, the market) under their plain lines; the cell view
  calls it only where `cityRegisterPlace` holds (`src/components/spine/cell/cell-view.tsx:382`). Since D2 = lock, those pages are
  sold too. They need their own batch (Tasks 13 and 14).
- The browser gates on the seven renders before this plan, each run by hand on the explicit files:
  - harness-copy-plain: 0 reds on all seven at 1280 and 375 (and 0 on the two restaurants renders);
  - harness-readability: 0 reds at 1280, 768 and 375;
  - harness-page-filter: 0 holes; accents 2 a page (the answer and the shop rent);
  - harness-page-laws: London 0; each of the six 1, `#demand: LONE FIGURE` at 1280 (clause 65), the six holding no baseline entry
    (Manchester restaurants: 0);
  - loud-seats reads only the chain's list: `ok loud-seats: 10 renders at 1280, 14 accent figures, ... (15 declared LIT, 1 withheld
    on these renders)`.
- The gates this plan edits pass today: london-city-sources 24 PASS, london-city 29 PASS, uk-pages-sources 36 PASS; with
  archetype-copy, model-laws-copy and copy-no-method-words, `Passed: 6, Failed: 0`.
- Every new line below was counted (twelve words at most, no semicolon: the plain-copy gate's LINE LONG and SEMICOLON) and laid
  into the Manchester render in a browser at 1280 and 768: none runs over half the content width (TEXT WIDE), and the split card
  grows from 114 to 134 tall beside the spend card's 99 (no card is stretched, so no CARD FOOT BLANK).

## Decisions taken here beyond the brief

1. The crew's line covers the usual week on all seven cities: "Estimated pay and hours for five roles a small business hires."
   London's week ("40 hours in the usual week", the shard's) printed unmarked; London's line changes with the six's.
2. London's board says its permit wait is an estimate in words: "The permit wait is an estimate. Levels compare cities." Its only
   mark was the row's tag, which `HeroBoard.tsx` draws nowhere.
3. The six's deposits are marked, not withheld as London's is: no UK page prints the country file's three months beside them.
4. The six's trade pages keep the city's own density, marked: "Estimated here, beside the trade's typical." London's still drops
   its metro density (the wrong place); the six's is the figure their own city page prints as an estimate.
5. The market card's line moves from the view into its builder (`opening.tsx` chose `basisWithFocal` itself), so one builder holds
   every line the gate reads.
6. The gate is renamed `uk-city-sources` (`tests/spine/uk_city_sources.test.ts`, by `git mv`), London's checks kept as they are.
7. loud-seats takes `--list=<file>` as its four siblings do, so the six renders can be measured by hand without joining the chain.
8. Not changed, written into the QUEUE in Task 16: London's peers print the pay of the cities abroad with no mark; the six's spend
   card's LONE FIGURE red, which is older than this plan.

---

## The audit: every figure the six pages print

Manchester's print is quoted; the other five print the same cards with their own figures. Lines are cited at 7395d11d.

| # | Card and figure (Manchester) | Builder | Value from | Its line today | Fix |
|---|---|---|---|---|---|
| 1 | Board: typical customer pay $48K, and its place among the cities | `src/lib/spine/city_hero_board.ts:154-169` (`city_income.ts:95-108`) | shard `owner_col.median_salary_usd_mo` x 12, the earnings survey's resident median | "Pay, a year." | official: keep; the gate holds each city to the survey's pounds (Task 6) |
| 2 | Board: City permits 60 days | `city_hero_board.ts:135-139` | shard `reg.total_local_days` | none (the column's level line) | mark: London's label "Longest permit wait", tag modeled, the column's line (Task 6) |
| 3 | Board: Per 10,000 residents 379 businesses | `city_hero_board.ts:140-143` | shard `comp.density_per_10k` | none | mark: the column's line (Task 6) |
| 4 | Board: Metro GDP $130B a year | `city_hero_board.ts:144-146` | city list `gdp_b`, approximate on every row | none | mark: the column's line (Task 6) |
| 5 | Board: Cost of living 31 | `city_hero_board.ts:147-152` | city list `cost_of_living_index`, a hand anchor | "Levels compare cities. Cost of living: cheapest city 1, dearest 100." | mark: "Estimates. Levels compare cities. Cost of living: cheapest city 1, dearest 100." (Task 6) |
| 6 | Premises: Prime shop rent $3,550 | `src/lib/spine/premises_bento_rows.ts:171` | shard `realestate.rent_prime_usd_sqm_yr` | "A square metre of prime shop space, a year." | mark: "Estimates: a square metre of prime shop space, a year." (Task 2) |
| 7 | Premises: the rent's plus, secondary street $600, service charge $142, rent trend +2.4% | `premises_bento_rows.ts:193-197`, `:207` | shard `realestate.rent_secondary_usd_sqm_yr`, `service_charge_usd_sqm_yr`, `rent_trend_pct_yoy` | under the rent's line | mark: the rent's "Estimates:" line covers its cell (Task 2) |
| 8 | Premises: Deposit up front 6 months | `premises_bento_rows.ts:208-213` | shard `realestate.deposit_months` | "Months of rent held as the deposit on a shop." | mark: "Estimates: months of rent held as the deposit, and the lease term." (Task 2) |
| 9 | Premises: 10 years the lease it is held on | `premises_bento_rows.ts:204`, `:214` | shard `realestate.lease_term_years` | the deposit's line | mark: the same line (Task 2) |
| 10 | Premises: Shops standing empty 13.5 of 100 | `premises_bento_rows.ts:221-230` | shard `realestate.vacancy_rate_pct` | "Out of every 100 shops." | mark: "Out of every 100 shops, an estimate." (Task 2) |
| 11 | Premises: Fit-out cost $850 | `premises_bento_rows.ts:172` | shard `realestate.fit_out_cost_usd_sqm` | "To fit out a square metre of shop space." | mark: London's `fitOutEstimate` (Task 2) |
| 12 | Premises: 6 months rent-free to fit out | `premises_bento_rows.ts:205-206` | shard `realestate.rent_free_months` | the fit-out's line | mark: London's line (Task 2) |
| 13 | Permits: All the city's fees $830 | `src/lib/spine/city_gates_rows.ts:114`, `:122` | shard `reg.total_local_cost_usd` | "On top of registering the company. The slowest sets your opening date." | mark: London's `basisSourcedOnly` (Task 5) |
| 14 | Permits: each required gate's wait and fee | `city_gates_rows.ts:64-85`, `:106-112` | shard `reg.local_gates.*` | the same line | mark: the same line; the free food registration is the one gate it names (Task 5) |
| 15 | Who is trading: 106,000 businesses | `src/lib/spine/city_market_rows.ts:169-170`; line chosen at `src/components/spine/city/opening.tsx:72` | shard `comp.total_businesses` | "Businesses trading in the city." | mark: "Estimates of the businesses trading in the city.", the builder's (Task 9) |
| 16 | Who is trading: six trades per 10,000 residents, the densest 8.4 | `city_market_rows.ts:133-149` | shard `comp.by_trade.*` | the same line | mark: the same line (Task 9) |
| 17 | Who is trading: the plus, new 13,500 a year, 11% close, 66% independents | `city_market_rows.ts:155-165` | shard `comp.new_firms_per_yr`, `closure_rate_pct`, `independents_pct` | the same line | mark: the same line (Task 9) |
| 18 | Living: one-bed $1,455, groceries $327, transit $106, a coffee $4.20 | `src/lib/spine/fact_rows.ts:169-184` | shard `owner_col.*` | "Prices for one person living here, not for the shop." | mark: London's `basisSourcedOnly` (Task 3) |
| 19 | Runway: 36% rent's share of income | `fact_rows.ts:279-298` | the shard's one-bed rent over row 1's pay | "One-bed rent for a year, against a typical income." | mark: London's `basisSourcedOnly` (Task 3) |
| 20 | Spend: $15K a resident a year | `fact_rows.ts:363-376` | shard `demand.spend_per_capita_usd`, a share of metro GDP | "What one resident spends in a year, on everything." | mark: "An estimate of what one resident spends in a year, on everything." (Task 10) |
| 21 | Earnings: bottom tenth $32K, top tenth $102K | `src/lib/spine/range_rows.ts:117-160` | `data/economics/wage_deciles_v1.json`, the survey's, the UK's | "Typical pay here, a year. Both tenths are for the whole country." | official: keep (Task 4 checks) |
| 22 | Earnings: typical $48K | the same | row 1's figure | the same | official: keep |
| 23 | Split: residents 68%, visitors 32% of footfall | `fact_rows.ts:432-448`; drawn `src/components/spine/city/city-view.tsx:787-811` | shard `footfall.resident_pct`, `visitor_pct` | none (the bar's own words; the foot is empty) | mark: foot "An estimated split of the year's footfall." (Task 10) |
| 24 | Crew: middle of the 5 $2,740, the five roles' monthly pay | `src/lib/spine/city_crew_rows.ts:72-93` | shard `labor.wages_by_role.*` | "Five roles a small business hires." | mark: "Estimated pay and hours for five roles a small business hires." (Task 4) |
| 25 | Crew: 40 hours in the usual week | `city_crew_rows.ts:103-106` | shard `labor.typical_workweek_hours` | none (unmarked on London too) | mark: the same line (Task 4) |
| 26 | Texture: 1 official visit a year | `src/lib/spine/city_texture_rows.ts:117-123` | shard `reg.inspections_per_yr` | none | mark: London's `basisSourcedOnly` (Task 7) |
| 27 | Calendar: busiest over quietest 28%, the twelve months drawn | `src/lib/spine/city_calendar_rows.ts:67-87` | shard `demand_calendar.months[0..11]`, modelled | "Spending each month, with the busiest set to 100." | mark: "Estimated spending each month, with the busiest set to 100." (Task 10) |
| 28 | Peers: cost of living, every row | `src/lib/spine/peer_rows.ts:135` | city list index, hand anchors | "Pay and visitors, a year." | mark: "Pay and visitors, a year. Estimates: cost of living, and pay abroad." (Task 8) |
| 29 | Peers: typical pay, the UK rows | `peer_rows.ts:136` (`city_peer_list.ts`) | row 1's figure for each UK city | the same | official: keep |
| 30 | Peers: typical pay, the rows abroad | `peer_rows.ts:136` | each city's shard | the same | mark: the same caveat (Task 8) |
| 31 | Peers: visitors, the counted rows (Manchester and Birmingham only; the other four draw no visitors column) | `peer_rows.ts:137` (`city_glance_rows.ts:91`) | a tourism body's count | the same | counted: keep; the caveat names visitors only where the column draws (Task 8) |
| 32 | People: 14% born abroad, nationwide | `src/lib/spine/character_rows.ts:179` | country signature `foreign_born_pct`, the UN's migrant stock (2024), the figure /gb prints | "These describe the country, not Manchester alone." | official: keep (Task 12 holds it to /gb's) |

Not drawn on the six: the districts card (no district scheme; its line's branch moves anyway, Task 11), the trades, the
neighbourhoods, the age mix; the glance and the seat are built for the gates and drawn by nothing. The reads on the texture and the
people tables are positions on a track, not figures, as on London.

**The count:** 32 figure rows on Manchester and Birmingham, 31 on Leeds, Glasgow, Edinburgh and Bristol (no row 31). Official or
counted: 6 (5). To mark: 26 on every one of the six. To withhold: none; every unsourced figure has an honest one-line estimate.

### The six's trade pages (`/gb/manchester/restaurants`, against `/gb/london/restaurants`)

| Card | Manchester prints | Its line | London's | Fix |
|---|---|---|---|---|
| take | net margin 7% | "Estimates for a typical restaurant, from national business statistics." | its register hero | already marked |
| customers | $1,320 a year, $22 a visit, 60 visits | "Spend per visit, times visits a year." | `tradeTypical.customers` | London's (Task 14) |
| open | $426K, its lines, 6 months, 2.5 years | "The four smaller costs, $4,020 together, are in the total." | the same | unchanged: the cell's own lines, held; masterplan step 04 left London's too |
| split | 7% and six shares, fixed 30% | "Out of every $100 in sales." | `tradeTypical.split` | London's (Task 14) |
| team | five roles, counts, pay | none | `tradeTypical.team` | London's (Task 14) |
| clears | 70% | "Of each day's sales, the part that pays the costs." | `tradeTypical.clears` | London's (Task 14) |
| lasts | 29% after five years | "Per 100 that open, recent rates, UK restaurants and mobile food." | the same | official: keep |
| market | 8.4 here, 16 typical, 20 of 100 close; chains 30; swing 20%; the week | "Firms per 10,000 people here, beside the usual for this trade", "Out of every 100 firms." ... | the trade's typical lines, the UK's insolvencies, no density | London's lines and insolvencies; the city's 8.4 kept: "Estimated here, beside the trade's typical." (Tasks 13, 14) |
| mix | 60%, 25%, 15% | "Out of every $100 in sales." | `tradeTypical.mix` | London's (Task 14) |
| rivals | five trades' costs | "Estimates at Manchester prices." | the same | already marked |
| apps, spend by income | providers' prices; family spending | their own | the same | looked up, official: keep |

---

## File structure

| File | Task | Responsibility |
|---|---|---|
| `src/lib/uk/registers/register_city.ts` | 1 | `UK_CITY_SLUGS`, `cityHeldToSources` |
| `tests/spine/london_city.test.ts` | 1, 12 | the predicate's checks; one comment's path |
| `src/lib/spine/copy.ts` | 2, 4, 6, 8, 9, 10, 13 | the new lines |
| `src/lib/spine/premises_bento_rows.ts` | 2 | the six's four cells say "estimate" |
| `src/lib/spine/fact_rows.ts` | 3, 10 | living, the runway, the spend, the split |
| `src/lib/spine/city_crew_rows.ts` | 4 | the crew's line |
| `src/lib/spine/city_gates_rows.ts` | 5 | the permits' line |
| `src/lib/spine/city_hero_board.ts` | 6 | the board's rows and its line |
| `src/lib/spine/city_texture_rows.ts` | 7 | the visits' line |
| `src/lib/spine/peer_rows.ts` | 8 | the peers' caveat |
| `src/lib/spine/city_market_rows.ts`, `src/components/spine/city/opening.tsx` | 9 | the market's line, now the builder's |
| `src/lib/spine/city_calendar_rows.ts`, `scripts/verify_archetype_copy.ts` | 10 | the calendar's line; the split's foot rule for UK cities |
| `src/lib/spine/district_rows.ts` | 11 | the district rents' line |
| `tests/spine/london_city_sources.test.ts`, renamed `tests/spine/uk_city_sources.test.ts` | 2 to 12 | the gate `uk-city-sources` |
| `scripts/prebuild_all.ts`, `scripts/gates.json` | 12, 14 | the gate renamed; a comment |
| `src/lib/spine/uk_trade_typical.ts`, `src/lib/spine/market_rows.ts`, `src/components/spine/cell/market.tsx` | 13 | the city's own density kept and marked |
| `tests/spine/uk_pages_sources.test.ts` | 13, 14 | the trade pages' checks |
| `src/components/spine/cell/cell-view.tsx` | 14 | every UK city's trade page says the trade's typical |
| `scripts/lib/page_renders.mjs`, `scripts/verify_loud_seats.mjs` | 15 | loud-seats takes `--list=` |
| `scratchpad/uk-cities/*` (never committed) | all | the outputs, the hand-run list, the lines check |
| `E:/atlas/design/loop/build/QUEUE.md` | 16 | the row DONE; three rows found |

Line numbers are 7395d11d's. Earlier tasks shift them (copy.ts and the gate file above all), so every edit below is anchored on
the exact text it quotes: find that text, not the number.

---

## Task 1: the predicate, `cityHeldToSources`

**Files:**
- Modify: `src/lib/uk/registers/register_city.ts:11-13` (header and imports), below `:25` (two exports)
- Modify: `tests/spine/london_city.test.ts:19` (import), below `:35` (checks)

- [ ] **Step 1: Make the output folder and write the failing checks**

Run: `mkdir -p scratchpad/uk-cities`

In `tests/spine/london_city.test.ts`, replace line 19:

```ts
import { cityRegisterPlace } from "../../src/lib/uk/registers/register_city";
```

with:

```ts
import { cityHeldToSources, cityRegisterPlace, UK_CITY_SLUGS } from "../../src/lib/uk/registers/register_city";
```

and below line 35 (`check("Manchester is not held to a register region", cityRegisterPlace("GB", "manchester") === null);`) add:

```ts
  /* THE TWO PREDICATES (plan 2026-10-08, uk:cities-sourced-or-marked). cityRegisterPlace says which figures a page reads (London
     alone: Greater London's registers); cityHeldToSources says whether its lines say which figures are estimates (every UK city
     with a page, as countryHeldToRegisters holds the country's page). */
  check(`the UK's cities with a page are the seven (${UK_CITY_SLUGS.join(", ")})`, UK_CITY_SLUGS.join(",") === "birmingham,bristol,edinburgh,glasgow,leeds,london,manchester");
  for (const slug of UK_CITY_SLUGS) check(`${slug}'s page is held to sources`, cityHeldToSources("GB", slug));
  check("the country's code is read in either case", cityHeldToSources("gb", "manchester"));
  check("only London is held to a register region", UK_CITY_SLUGS.filter((s) => cityRegisterPlace("GB", s) !== null).join(",") === "london");
  check("a city outside the UK is not held to sources (Paris)", !cityHeldToSources("FR", "paris"));
  check("a UK city's slug under another country's code is not (Manchester as US)", !cityHeldToSources("US", "manchester"));
  check("a UK address that is no city page is not (the UK aggregate, a London district)", !cityHeldToSources("GB", "gb") && !cityHeldToSources("GB", "west-end"));
  check("a word that names a built-in names no city", !cityHeldToSources("GB", "constructor") && !cityHeldToSources("GB", "__proto__"));
  check("no slug, no city; no country, no city", !cityHeldToSources("GB", "") && !cityHeldToSources("GB", null) && !cityHeldToSources(null, "london"));
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city.test.ts > scratchpad/uk-cities/t01.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t01.txt`
Expected (read the file): a TypeError on `UK_CITY_SLUGS` or `cityHeldToSources` (neither is exported yet), `exit 1`.

- [ ] **Step 3: Write the predicate**

In `src/lib/uk/registers/register_city.ts`, replace:

```ts
 * Keyed by country and city slug; the geography is the register's own code (london_trade.ts reads the same constant).
 */
import { LONDON_GEOGRAPHY } from "./london_trade";
```

with:

```ts
 * Keyed by country and city slug; the geography is the register's own code (london_trade.ts reads the same constant).
 *
 * THE CITIES HELD TO SOURCES (plan 2026-10-08, uk:cities-sourced-or-marked) are the wider set, every UK city with a page:
 * `cityHeldToSources` says whether a card's lines say which figures are estimates; `cityRegisterPlace` still says which figures
 * a page reads, and names London alone.
 */
import cityListJson from "../../../../data/cities/city_list_v1.json";
import { LONDON_GEOGRAPHY } from "./london_trade";
```

and below:

```ts
export function countryHeldToRegisters(iso2: string | null | undefined): boolean {
  return String(iso2 ?? "").toUpperCase() === "GB";
}
```

add:

```ts

/** THE UK'S CITIES WITH A PAGE (plan 2026-10-08, uk:cities-sourced-or-marked): the city list's United Kingdom rows, sorted. London
 *  and the six the paywall sells beside it (his ruling 27: the UK pages are the Pro pages). */
export const UK_CITY_SLUGS: readonly string[] = (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities
  .filter((c) => String(c.iso2).toUpperCase() === "GB")
  .map((c) => c.slug)
  .sort();
const UK_CITIES: ReadonlySet<string> = new Set(UK_CITY_SLUGS);

/** A UK CITY'S PAGE IS HELD TO SOURCES (plan 2026-10-08, uk:cities-sourced-or-marked; the city twin of countryHeldToRegisters):
 *  it prints an official figure, a figure its card's one line calls an estimate, or none, as London's has since masterplan step
 *  03. This drives what a card's lines SAY. What a page READS stays cityRegisterPlace's (London alone: Greater London's register
 *  counts and valuation); a city held to sources and to no register region prints its shard's figures, each line saying they
 *  are estimates. A Set, so a word that names a built-in ("constructor") names no city. */
export function cityHeldToSources(iso2: string | null | undefined, slug: string | null | undefined): boolean {
  return countryHeldToRegisters(iso2) && UK_CITIES.has(String(slug ?? "").toLowerCase());
}
```

- [ ] **Step 4: Run the test and the gates that read the file**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city.test.ts > scratchpad/uk-cities/t01.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t01.txt`
Expected: the PASS lines (the seven cities each held), `spine/london_city: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city,layering,london-city-sources > scratchpad/uk-cities/g01.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g01.txt`
Expected: `Passed: 3`, `Failed: 0`, `SUBSET: PASS`, `exit 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/uk/registers/register_city.ts tests/spine/london_city.test.ts
git commit -m "cityHeldToSources: every UK city with a page says which figures are estimates; cityRegisterPlace stays London's (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 2: the premises, four cells each saying "estimate"

**Files:**
- Modify: `src/lib/spine/copy.ts:1097` (three keys below `fitOutEstimate`)
- Modify: `src/lib/spine/premises_bento_rows.ts:59`, below `:167`, `:171-172`, `:210`, `:229`
- Modify: `tests/spine/london_city_sources.test.ts` (a block above the summary line)

- [ ] **Step 1: Write the failing checks**

In `tests/spine/london_city_sources.test.ts`, above
`if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }` add:

```ts
/* THE SIX OTHER UK CITIES (plan 2026-10-08, uk:cities-sourced-or-marked): held to sources and to no register region, each keeps its
   shard's figures and says in each card's one line that they are estimates; nothing with an honest estimate line is withheld. */
const SIX = ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"] as const;
const PB = COPY.premisesBento.basis;
for (const slug of SIX) {
  const p = buildPremisesBento(slug);
  check(`${slug}'s premises keep all four cells (${p?.withheld} withheld)`, !!p && p.withheld === 0);
  check(`${slug}'s prime rent and its details say they are estimates ("${p && "figure" in p.rent ? p.rent.basis : "none"}")`, !!p && !p.rentKicker && "figure" in p.rent && p.rent.basis === `${PB.rentEstimate}.` && (p.rent.detail?.rows.length ?? 0) >= 2);
  check(`${slug}'s deposit and its lease say they are estimates`, !!p && "figure" in p.deposit && p.deposit.basis === `${PB.depositEstimate}.` && !!p.deposit.second);
  check(`${slug}'s empty shops say they are an estimate`, !!p && "part" in p.empty && p.empty.basis === `${PB.emptyEstimate}.`);
  check(`${slug}'s fit-out and its rent-free months say they are estimates (London's line)`, !!p && "figure" in p.fitOut && p.fitOut.basis === `${PB.fitOutEstimate}.` && !!p.fitOut.second);
}
check("Paris's premises lines are unchanged", !!parisPrem && "figure" in parisPrem.rent && parisPrem.rent.basis === `${PB.rent}.`);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t02.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t02.txt`
Expected: 24 red lines (four a city: the rent, the deposit, the empty shops, the fit-out), the withheld and Paris checks passing, `exit 1`.

- [ ] **Step 3: Write the three lines**

In `src/lib/spine/copy.ts`, below:

```ts
      fitOutEstimate: "Estimates: a square metre fitted out, and the rent-free months",
```

add:

```ts
      /** The six UK cities held to sources and to no register region (plan 2026-10-08, uk:cities-sourced-or-marked): the shard's
       *  figures, each cell's one line saying they are estimates; "Estimates" covers the cell's details and its companion. */
      rentEstimate: "Estimates: a square metre of prime shop space, a year",
      depositEstimate: "Estimates: months of rent held as the deposit, and the lease term",
      emptyEstimate: "Out of every 100 shops, an estimate",
```

- [ ] **Step 4: Mark the six's cells**

In `src/lib/spine/premises_bento_rows.ts`, replace line 59:

```ts
import { cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

with:

```ts
import { cityHeldToSources, cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

Below `  if (held) return buildSourcedPremises(city, iso2, held.geography);` add:

```ts
  /* A UK CITY HELD TO SOURCES AND TO NO REGISTER REGION (the six; plan 2026-10-08, uk:cities-sourced-or-marked) keeps its shard's
     four readings, their details and companions, each cell's one line saying they are estimates: no register on disk holds a
     city's own rent, deposit, empty shops or fit-out outside Greater London (the valuation slice holds Greater London and
     England). Its deposit is marked, not withheld as London's is: no UK page prints the country file's three months beside it. */
  const marked = cityHeldToSources(iso2, slug);
```

Replace:

```ts
  const rent = metric(cityFigure(iso2, slug, "realestate.rent_prime_usd_sqm_yr"), B.rent, usd, W.rent);
  const fitOut = metric(cityFigure(iso2, slug, "realestate.fit_out_cost_usd_sqm"), B.fitOut, usd, W.fitOut);
```

with:

```ts
  const rent = metric(cityFigure(iso2, slug, "realestate.rent_prime_usd_sqm_yr"), marked ? B.rentEstimate : B.rent, usd, W.rent);
  const fitOut = metric(cityFigure(iso2, slug, "realestate.fit_out_cost_usd_sqm"), marked ? B.fitOutEstimate : B.fitOut, usd, W.fitOut);
```

In the deposit's `metric(` call, replace `    B.deposit,` with `    marked ? B.depositEstimate : B.deposit,`. In the count, replace
`basis: basisOf(B.empty, vacancy.tag)` with `basis: basisOf(marked ? B.emptyEstimate : B.empty, vacancy.tag)`.

- [ ] **Step 5: Run the test and the copy gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t02.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t02.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy,model-laws-copy,copy-no-method-words,no-em-dashes > scratchpad/uk-cities/g02.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g02.txt`
Expected: `Passed: 5`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/premises_bento_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' premises: each cell keeps its figure and says it is an estimate (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 3: living and the runway, London's lines word for word

**Files:**
- Modify: `src/lib/spine/fact_rows.ts:76`, `:195-196`, `:311-312`
- Modify: `tests/spine/london_city_sources.test.ts`

- [ ] **Step 1: Write the failing checks**

Above the summary line of `tests/spine/london_city_sources.test.ts` add:

```ts
/* LIVING AND THE RUNWAY (plan 2026-10-08): the shard's prices and one-bed rent, London's lines word for word. */
for (const slug of SIX) {
  check(`${slug}'s living card says its prices are estimates`, buildCityLiving(slug)?.basis === COPY.cityLiving.basisSourcedOnly);
  check(`${slug}'s runway says its rent is an estimate`, buildCityRunway(slug)?.basis === COPY.cityRunway.basisSourcedOnly);
}
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t03.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t03.txt`
Expected: 12 red lines (two a city), `exit 1`.

- [ ] **Step 3: Move the two branches to the wider predicate**

In `src/lib/spine/fact_rows.ts`, replace line 76 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

Replace:

```ts
    /* A page held to a register region says in its one line that these prices are estimates (masterplan step 03, 2026-10-05; the labels audit's item 24). */
    basis: cityRegisterPlace(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

with:

```ts
    /* A UK city's page says in its one line that these prices are estimates (London since masterplan step 03; every UK city since plan 2026-10-08, uk:cities-sourced-or-marked). */
    basis: cityHeldToSources(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

and replace:

```ts
    /* A page held to a register region says the rent is an estimate (masterplan step 03, 2026-10-05; the labels audit's item 24). */
    basis: cityRegisterPlace(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

with:

```ts
    /* A UK city's page says the rent is an estimate (London since masterplan step 03; every UK city since plan 2026-10-08). */
    basis: cityHeldToSources(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t03.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t03.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy,model-laws-copy > scratchpad/uk-cities/g03.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g03.txt`
Expected: `Passed: 3`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spine/fact_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' living costs and runway say they are estimates, London's lines (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 4: the crew (pay and the week) and the earnings strip (official, held to it)

**Files:**
- Modify: `src/lib/spine/copy.ts:2219-2220`
- Modify: `src/lib/spine/city_crew_rows.ts:43`, `:112-113`
- Modify: `tests/spine/london_city_sources.test.ts` (an import, a block)

- [ ] **Step 1: Write the failing checks**

In `tests/spine/london_city_sources.test.ts`, below `import { readFileSync } from "node:fs";` add:

```ts
import { cityTypicalIncome } from "../../src/lib/spine/city_income";
```

and above the summary line add:

```ts
/* THE CREW AND THE EARNINGS (plan 2026-10-08): the crew's pay and its usual week are the shard's, and the one line says both are
   estimates, on London too (its week printed unmarked until this plan). The earnings strip is official on all seven: the survey's
   tenths for the UK and its typical pay for the city; it keeps its line. */
check(`London's crew line names the week too ("${buildCityCrew("london")?.basis}")`, /pay and hours/.test(buildCityCrew("london")?.basis ?? ""));
for (const slug of SIX) {
  const crew = buildCityCrew(slug);
  check(`${slug}'s crew says its pay and its week are estimates`, !!crew && crew.basis === COPY.cityCrew.basisSourcedOnly && !!crew.week);
  const strip = buildCityEarningsStrip(slug);
  check(`${slug}'s tenths are the survey's, the UK's (${strip?.figures.p10}, ${strip?.figures.p90})`, strip?.figures.p10 === p10 && strip?.figures.p90 === p90 && strip?.basis === COPY.cityCustomers.basis);
  check(`${slug}'s typical pay is the one builder's, the survey's for the city`, strip?.figures.typical === cityTypicalIncome(slug)?.value);
}
check("Paris's crew line is unchanged", buildCityCrew("paris")?.basis === COPY.cityCrew.basis);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t04.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t04.txt`
Expected: 7 red lines (the six crews and London's week); the earnings checks pass already (they are official and keep their
lines: no code changes for them), `exit 1`.

- [ ] **Step 3: Extend the line to the week**

In `src/lib/spine/copy.ts`, replace:

```ts
    /** A page held to a register region: no source holds the pay by role, so the line says it is estimated. */
    basisSourcedOnly: "Estimated pay for five roles a small business hires.",
```

with:

```ts
    /** A UK city's page (held to sources): no source holds the pay by role or the usual week, so the line says both are estimated
     *  (plan 2026-10-08: the week printed unmarked on London until then). */
    basisSourcedOnly: "Estimated pay and hours for five roles a small business hires.",
```

- [ ] **Step 4: Move the branch**

In `src/lib/spine/city_crew_rows.ts`, replace line 43 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
    /* A page held to a register region says the pay is estimated (masterplan step 03, 2026-10-05; the labels audit's item 24). */
    basis: cityRegisterPlace(iso2, slug) ? COPY.cityCrew.basisSourcedOnly : COPY.cityCrew.basis,
```

with:

```ts
    /* A UK city's page says the pay and the week are estimated (London since masterplan step 03; every UK city, and the week, since plan 2026-10-08). */
    basis: cityHeldToSources(iso2, slug) ? COPY.cityCrew.basisSourcedOnly : COPY.cityCrew.basis,
```

- [ ] **Step 5: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t04.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t04.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy,copy-no-method-words > scratchpad/uk-cities/g04.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g04.txt`
Expected: `Passed: 3`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/city_crew_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The UK cities' crew says its pay and its week are estimates; the earnings strip held to the survey (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 5: the permits, London's line word for word

**Files:**
- Modify: `src/lib/spine/city_gates_rows.ts:37`, `:125-126`
- Modify: `tests/spine/london_city_sources.test.ts`

- [ ] **Step 1: Write the failing checks**

Above the summary line add:

```ts
/* THE PERMITS (plan 2026-10-08): London's line word for word; every UK city's food registration is the one free gate it names. */
for (const slug of SIX) {
  const g = buildCityGates(slug);
  check(`${slug}'s permits say their fees are estimates but food registration`, g?.basis === COPY.cityGates.basisSourcedOnly);
  check(`${slug}'s food registration is a required gate at no fee, as the line says`, !!g && g.gates.some((x) => /food/i.test(x.name) && x.required && x.cost === 0));
}
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t05.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t05.txt`
Expected: 6 red lines (the lines); the six food-registration checks pass (the shards hold the gate), `exit 1`.

- [ ] **Step 3: Move the branch**

In `src/lib/spine/city_gates_rows.ts`, replace line 37 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
    /* A page held to a register region says in its one line which figures are estimates (masterplan step 03, 2026-10-05; the labels audit's item 24). */
    basis: cityRegisterPlace(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

with:

```ts
    /* A UK city's page says in its one line which figures are estimates (London since masterplan step 03; every UK city since plan 2026-10-08, uk:cities-sourced-or-marked): each UK city's food registration is the free gate the line names. */
    basis: cityHeldToSources(iso2, slug) ? C.basisSourcedOnly : C.basis,
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t05.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t05.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy > scratchpad/uk-cities/g05.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g05.txt`
Expected: `Passed: 2`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spine/city_gates_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' permits say their fees are estimates but food registration, London's line (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 6: the board, every row an estimate and said once; London's permit wait said in words

**Files:**
- Modify: `src/lib/spine/copy.ts:384-385`
- Modify: `src/lib/spine/city_hero_board.ts:57`, `:129-139`, `:142`, `:151`, `:178`
- Modify: `tests/spine/london_city_sources.test.ts`

- [ ] **Step 1: Write the failing checks**

Above the summary line add:

```ts
/* THE BOARD (plan 2026-10-08): the six keep their four rows, each an estimate, the column's line saying so first; the answer is the
   earnings survey's typical pay for the city (by residence, April 2025, research note 2026-09-25 row 19) at the site's one rate,
   and keeps its line. London's permit wait, the one estimate on its board, is said in its line: the board draws no tag. */
const SURVEY_GBP: Record<(typeof SIX)[number], number> = { manchester: 36278, birmingham: 35989, leeds: 36716, glasgow: 38125, edinburgh: 43169, bristol: 39509 };
for (const slug of SIX) {
  const b = buildCityHeroBoard(slug);
  const keys = (b?.rows ?? []).map((r) => r.key).join(",");
  check(`${slug}'s board keeps its four rows (${keys})`, keys === "permits,density,gdp,living");
  check(`${slug}'s rows are each an estimate`, !!b && b.rows.every((r) => r.confidence === "modeled"));
  check(`${slug}'s permit row says what it is ("${b?.rows.find((r) => r.key === "permits")?.label}")`, b?.rows.find((r) => r.key === "permits")?.label === COPY.cityHeroBoard.rows.permitsLongest);
  check(`${slug}'s column says its figures are estimates ("${b?.levelBasis}")`, b?.levelBasis === COPY.cityHeroBoard.levelBasisEstimates);
  const want = Math.round(convertToUsd("GBP", SURVEY_GBP[slug]) ?? 0);
  const typical = cityTypicalIncome(slug)?.value ?? 0;
  check(`${slug}'s answer is the survey's pay, ${SURVEY_GBP[slug]} pounds at the site's rate (${typical} against ${want})`, Math.abs(typical - want) <= 12 && b?.answerBasis === COPY.cityHero.answerBasis);
}
check(`London's line says its permit wait is an estimate ("${hero?.levelBasis}")`, hero?.levelBasis === COPY.cityHeroBoard.levelBasisNoLiving && /permit wait is an estimate/i.test(hero?.levelBasis ?? ""));
check("Paris's board is unchanged", paris?.levelBasis === COPY.cityHeroBoard.levelBasis && paris?.rows.find((r) => r.key === "permits")?.label === COPY.cityHeroBoard.rows.permits);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t06.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t06.txt`
Expected: 17 red lines: six permit labels, six column lines, London's line, and four "each an estimate" (Birmingham's density,
Leeds's and Glasgow's permits and Bristol's two are tagged held today; Manchester's and Edinburgh's rows are all modelled already);
the rows, the answers and Paris pass, `exit 1`.

- [ ] **Step 3: Write the two lines**

In `src/lib/spine/copy.ts`, replace:

```ts
    /** The level line where the cost of living does not print (a city held to a register region: no source holds the index). */
    levelBasisNoLiving: "Levels compare cities.",
```

with:

```ts
    /** The level line where the cost of living does not print (a city held to a register region, London: no source holds the
     *  index). It says the board's one estimate, the permit wait, in words (plan 2026-10-08): the row's tag is drawn by nothing
     *  on the board, and the visitors above it are counted. */
    levelBasisNoLiving: "The permit wait is an estimate. Levels compare cities.",
    /** A UK city held to no register region (the six; plan 2026-10-08, uk:cities-sourced-or-marked): every row is an estimate,
     *  and the line says so first. */
    levelBasisEstimates: "Estimates. Levels compare cities. Cost of living: cheapest city 1, dearest 100.",
```

- [ ] **Step 4: Mark the six's rows**

In `src/lib/spine/city_hero_board.ts`, replace line 57 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources, cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

Replace:

```ts
  /* A CITY HELD TO A REGISTER REGION PRINTS A SOURCED FIGURE OR A MARKED ONE (masterplan step 03, 2026-10-05; the labels audit's
     items 22 and 24). Its permit wait is the shard's longest single gate, held with no source: the label says what it is and
     the row carries the estimate mark. Its cost of living is a hand-anchored index no source holds: the row does not print. */
  const sourcedOnly = !metroRows;
  const days = cityFigure(iso2, slug, "reg.total_local_days");
  if (days) {
    const v = Math.round(days.value);
    rows.push({ key: "permits", icon: "red-tape", label: sourcedOnly ? C.rows.permitsLongest : C.rows.permits, value: String(v), unit: v === 1 ? COPY.heroBoard.units.day : COPY.heroBoard.units.days, level: levelOf(days.value, s.days), confidence: days.tag === "held" && !sourcedOnly ? "measured" : "modeled" });
  }
```

with:

```ts
  /* A CITY HELD TO A REGISTER REGION PRINTS A SOURCED FIGURE OR A MARKED ONE (masterplan step 03, 2026-10-05; the labels audit's
     items 22 and 24). Its permit wait is the shard's longest single gate, held with no source: the label says what it is, and
     since plan 2026-10-08 the column's line says it is an estimate (the board draws no tag). Its cost of living is a
     hand-anchored index no source holds: the row does not print. */
  const sourcedOnly = !metroRows;
  /* A UK CITY HELD TO NO REGISTER REGION (the six; plan 2026-10-08, uk:cities-sourced-or-marked) keeps its four rows, the shard's
     and the city list's figures held with no source, each an estimate, and the column's line says so first; its permit row says
     what it is, as London's does. The answer above the rows is the earnings survey's pay and keeps its line. None of the six
     holds a counted visitor figure; the day one does, its row is measured and the line must name it (uk-city-sources holds the
     six's boards to estimates). */
  const marked = metroRows && cityHeldToSources(iso2, slug);
  const days = cityFigure(iso2, slug, "reg.total_local_days");
  if (days) {
    const v = Math.round(days.value);
    rows.push({ key: "permits", icon: "red-tape", label: sourcedOnly || marked ? C.rows.permitsLongest : C.rows.permits, value: String(v), unit: v === 1 ? COPY.heroBoard.units.day : COPY.heroBoard.units.days, level: levelOf(days.value, s.days), confidence: days.tag === "held" && !sourcedOnly && !marked ? "measured" : "modeled" });
  }
```

In the density row, replace `confidence: density.tag === "held" ? "measured" : "modeled"` with
`confidence: density.tag === "held" && !marked ? "measured" : "modeled"`. In the cost of living row, replace
`confidence: /city-level/i.test(` with `confidence: !marked && /city-level/i.test(` (the rest of the expression unchanged). Replace:

```ts
    levelBasis: sourcedOnly ? C.levelBasisNoLiving : C.levelBasis,
```

with:

```ts
    levelBasis: sourcedOnly ? C.levelBasisNoLiving : marked ? C.levelBasisEstimates : C.levelBasis,
```

- [ ] **Step 5: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t06.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t06.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,london-city,copy-no-method-words,no-em-dashes > scratchpad/uk-cities/g06.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g06.txt`
Expected: `Passed: 4`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/city_hero_board.ts tests/spine/london_city_sources.test.ts
git commit -m "The UK cities' boards: the six's rows each an estimate and said once; London's permit wait said in words (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 7: the texture's one figure, London's line word for word

**Files:**
- Modify: `src/lib/spine/city_texture_rows.ts:56`, `:124-125`
- Modify: `tests/spine/london_city_sources.test.ts`

- [ ] **Step 1: Write the failing checks**

Above the summary line add:

```ts
/* THE TEXTURE (plan 2026-10-08): the count of official visits is the shard's; London's line word for word. */
for (const slug of SIX) check(`${slug}'s texture card says its visit count is an estimate`, buildCityTexture(slug)?.basis === COPY.cityTexture.basisSourcedOnly);
check("Paris's texture line is unchanged", buildCityTexture("paris")?.basis === COPY.cityTexture.basis);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t07.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t07.txt`
Expected: 6 red lines, `exit 1`.

- [ ] **Step 3: Move the branch**

In `src/lib/spine/city_texture_rows.ts`, replace line 56 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
    /* A page held to a register region says its one figure is an estimate (masterplan step 03, 2026-10-05; the labels audit's item 24). */
    basis: cityRegisterPlace(iso2, slug) ? COPY.cityTexture.basisSourcedOnly : COPY.cityTexture.basis,
```

with:

```ts
    /* A UK city's page says its one figure is an estimate (London since masterplan step 03; every UK city since plan 2026-10-08, uk:cities-sourced-or-marked). */
    basis: cityHeldToSources(iso2, slug) ? COPY.cityTexture.basisSourcedOnly : COPY.cityTexture.basis,
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t07.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t07.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy > scratchpad/uk-cities/g07.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g07.txt`
Expected: `Passed: 2`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spine/city_texture_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' texture card says its visit count is an estimate, London's line (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 8: the peers, every figure kept and the estimates named once

**Files:**
- Modify: `src/lib/spine/copy.ts:1352` (two keys below `caveatNoLiving`)
- Modify: `src/lib/spine/peer_rows.ts:23`, `:145-155`
- Modify: `tests/spine/london_city_sources.test.ts` (two imports, a block)

- [ ] **Step 1: Write the failing checks**

Below `import { readFileSync } from "node:fs";` add:

```ts
import { cityPeerListRow } from "../../src/lib/spine/city_peer_list";
import { getCityPeerSet } from "../../src/lib/cities/comparable_cities";
```

and above the summary line add:

```ts
/* THE PEERS (plan 2026-10-08): the six keep every figure, the cost of living included, and the caveat says once which are
   estimates: the cost of living on every row and the pay of the cities abroad. A UK row's pay is the survey's (the answer's own),
   the visitors counted. The rows are built as the city adapter builds them: city_peer_list.ts over the pure peer set (the
   adapter itself opens a database client a chain test cannot). */
const peerSeedOf = (slug: string) => {
  const home = cityPeerListRow(slug, true);
  const rest = getCityPeerSet(slug, 6).slice(0, 6).map((p) => { const r = cityPeerListRow(p.slug, false, p.name); return r ? { ...r, iso2: p.iso2 } : null; }).filter((r) => r !== null);
  return { meta: { iso2: "GB", slug }, peers: { list: [home, ...rest] } };
};
for (const slug of SIX) {
  const t = buildCityPeerTable(peerSeedOf(slug));
  const visitors = !!t && t.columns.some((c) => c.key === "visitors");
  check(`${slug}'s peers keep every city's cost of living (${t?.rows.map((r) => r.values.living).join(", ")})`, !!t && t.rows.every((r) => typeof r.values.living === "number") && t.columns[0]?.key === "living");
  check(`${slug}'s peers say which figures are estimates ("${t?.caveat}")`, !!t && t.caveat === (visitors ? COPY.cityPeers.caveatEstimates : COPY.cityPeers.caveatEstimatesNoVisitors));
  check(`${slug}'s UK rows print the survey's pay, the answer's own`, !!t && t.rows.filter((r) => r.iso2 === "GB").every((r) => r.values.income === cityTypicalIncome(r.key ?? "")?.value));
}
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t08.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t08.txt`
Expected: 6 red lines (the caveats); the cost of living and the UK rows' pay pass, `exit 1`.

- [ ] **Step 3: Write the two caveats**

In `src/lib/spine/copy.ts`, below:

```ts
    caveatNoLiving: "Pay and visitors, a year. No source holds a cost of living.",
```

add:

```ts
    /** A UK city held to no register region (the six; plan 2026-10-08, uk:cities-sourced-or-marked): every figure kept, the line
     *  saying once which are estimates, the cost of living and the pay of the cities abroad; the visitors named only where their
     *  column draws. */
    caveatEstimates: "Pay and visitors, a year. Estimates: cost of living, and pay abroad.",
    caveatEstimatesNoVisitors: "Pay, a year. Estimates: cost of living, and pay abroad.",
```

- [ ] **Step 4: Give the builder its third case**

In `src/lib/spine/peer_rows.ts`, replace line 23:

```ts
import { cityRegisterPlace, countryHeldToRegisters } from "@/lib/uk/registers/register_city";
```

with:

```ts
import { cityHeldToSources, cityRegisterPlace, countryHeldToRegisters } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
     saying once that its figures are estimates. */
  const sourcedOnly = cityRegisterPlace(fallbackIso2, String(seed?.meta?.slug ?? "")) !== null;
  if (sourcedOnly) for (const r of rows) r.values.living = null;
  /* The dash column stands last there, so each name keeps its first figure beside it (the harness's LABEL GAP). */
  const ordered = sourcedOnly ? [...all.filter((c) => c.key !== "living"), ...all.filter((c) => c.key === "living")] : all;
  const columns = ordered.filter((c) => (sourcedOnly && c.key === "living") || rows.filter((r) => isNum(r.values[c.key])).length >= 2);
  if (columns.length === 0) return null;
  return { rows, columns, caveat: fillWords(sourcedOnly ? COPY.cityPeers.caveatNoLiving : COPY.cityPeers.caveat, { city: String(home.name) }), entityHead: COPY.cityPeers.cols.city };
```

with:

```ts
     saying once that its figures are estimates. A UK CITY HELD TO NO REGISTER REGION (the six; plan 2026-10-08,
     uk:cities-sourced-or-marked) keeps every figure and says once which are estimates: the cost of living on every row and the
     pay of the cities abroad (a UK row's pay is the earnings survey's, the answer's own; the visitors are counted). */
  const homeSlug = String(seed?.meta?.slug ?? "");
  const sourcedOnly = cityRegisterPlace(fallbackIso2, homeSlug) !== null;
  const marked = !sourcedOnly && cityHeldToSources(fallbackIso2, homeSlug);
  if (sourcedOnly) for (const r of rows) r.values.living = null;
  /* The dash column stands last there, so each name keeps its first figure beside it (the harness's LABEL GAP). */
  const ordered = sourcedOnly ? [...all.filter((c) => c.key !== "living"), ...all.filter((c) => c.key === "living")] : all;
  const columns = ordered.filter((c) => (sourcedOnly && c.key === "living") || rows.filter((r) => isNum(r.values[c.key])).length >= 2);
  if (columns.length === 0) return null;
  /* The caveat names the visitors only where their column draws: four of the six hold too few counted peers to draw it. */
  const caveat = sourcedOnly ? COPY.cityPeers.caveatNoLiving : marked ? (columns.some((c) => c.key === "visitors") ? COPY.cityPeers.caveatEstimates : COPY.cityPeers.caveatEstimatesNoVisitors) : COPY.cityPeers.caveat;
  return { rows, columns, caveat: fillWords(caveat, { city: String(home.name) }), entityHead: COPY.cityPeers.cols.city };
```

- [ ] **Step 5: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t08.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t08.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0` (Manchester and Birmingham take the visitors' caveat, the other four the
shorter one).
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,london-city,archetype-copy,model-laws-copy > scratchpad/uk-cities/g08.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g08.txt`
Expected: `Passed: 4`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/peer_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' peers keep every figure and say once which are estimates (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 9: who is already trading, the line now the builder's

**Files:**
- Modify: `src/lib/spine/copy.ts:412-413` (two keys)
- Modify: `src/lib/spine/city_market_rows.ts:47`, `:172`, `:180`
- Modify: `src/components/spine/city/opening.tsx:72`
- Modify: `tests/spine/london_city_sources.test.ts` (an import, a block)

- [ ] **Step 1: Write the failing checks**

Below `import { readFileSync } from "node:fs";` add:

```ts
import { buildCityMarket } from "../../src/lib/spine/city_market_rows";
```

and above the summary line add:

```ts
/* WHO IS ALREADY TRADING (plan 2026-10-08): the shard's densities, count and plus, the one line saying they are estimates; the line
   is the builder's in both forms, and the card prints it as handed. */
for (const slug of SIX) {
  const m = buildCityMarket(slug);
  check(`${slug}'s market keeps the shard's densities, its count and its plus`, m?.form === "density" && !!m.focal && !!m.detail);
  check(`${slug}'s market says its figures are estimates ("${m?.basis}")`, m?.basis === COPY.cityMarket.basisWithFocalEstimate);
}
const parisMarket = buildCityMarket("paris");
check(`Paris's market line is unchanged ("${parisMarket?.basis}")`, parisMarket?.basis === (parisMarket?.focal ? COPY.cityMarket.basisWithFocal : COPY.cityMarket.basis));
check("London's market keeps the register's line", buildCityMarket("london")?.basis === COPY.cityMarket.register.basis.replace("{city}", "London"));
const openingSrc = readFileSync("src/components/spine/city/opening.tsx", "utf8");
check("the market card prints the line its builder hands it", !/basisWithFocal/.test(openingSrc) && /basis=\{`\$\{market\.basis\}/.test(openingSrc));
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t09.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t09.txt`
Expected: 8 red lines: six market lines, Paris (its builder still hands the bars' line while the view prints the focal's), the
card's source; the London check and the six "keeps" checks pass, `exit 1`.

- [ ] **Step 3: Write the two lines**

In `src/lib/spine/copy.ts`, below:

```ts
    basis: "Businesses for every 10,000 residents, by trade.",
```

(the `cityMarket` block, line 413) add:

```ts
    /** The six UK cities held to no register region (plan 2026-10-08, uk:cities-sourced-or-marked): the same two lines, each
     *  saying the figures are estimates. */
    basisWithFocalEstimate: "Estimates of the businesses trading in the city.",
    basisEstimate: "Estimated businesses for every 10,000 residents, by trade.",
```

- [ ] **Step 4: Move the line into the builder**

In `src/lib/spine/city_market_rows.ts`, replace line 47 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources, cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

Below `  const sample = sampleBars || detailRows.some((r) => r.tag !== "held");` add:

```ts
  /* A UK CITY HELD TO NO REGISTER REGION (the six; plan 2026-10-08, uk:cities-sourced-or-marked): its densities, its count of
     every business and the plus are the shard's, held with no source, so the one line says they are estimates. */
  const marked = cityHeldToSources(iso2, slug);
```

and replace:

```ts
    basis: C.basis,
    foot: sample ? C.footModelled : null,
```

with:

```ts
    /* THE ONE LINE IS THE BUILDER'S IN BOTH FORMS (plan 2026-10-08; the card chose the focal's line itself until then): the
       count's words where the count stands at 30, the bars' otherwise, each its estimate form on the six. */
    basis: focal ? (marked ? C.basisWithFocalEstimate : C.basisWithFocal) : marked ? C.basisEstimate : C.basis,
    foot: sample ? C.footModelled : null,
```

In `src/components/spine/city/opening.tsx`, replace line 72:

```tsx
      basis={`${market.focal && !register ? C.basisWithFocal : market.basis}${market.foot ? ` ${market.foot}` : ""}`}
```

with:

```tsx
      basis={`${market.basis}${market.foot ? ` ${market.foot}` : ""}`}
```

- [ ] **Step 5: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t09.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t09.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,london-city,census-fresh,model-laws-copy > scratchpad/uk-cities/g09.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g09.txt`
Expected: `Passed: 4`, `Failed: 0`. (If census-fresh reds, run `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write`,
read what it rewrote, and commit that with this task; no kicker or archetype changed, so it should stay green.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/city_market_rows.ts src/components/spine/city/opening.tsx tests/spine/london_city_sources.test.ts
git commit -m "Who is already trading: the line is the builder's, and on the six UK cities it says the figures are estimates (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 10: the spend, the split of the footfall and the calendar, each saying "estimate"

**Files:**
- Modify: `src/lib/spine/copy.ts:1233`, `:1258-1259`, `:2252` (three keys)
- Modify: `src/lib/spine/fact_rows.ts:371-373`, `:444-446`
- Modify: `src/lib/spine/city_calendar_rows.ts:41`, `:84`
- Modify: `scripts/verify_archetype_copy.ts:55` (import), `:825-826`
- Modify: `tests/spine/london_city_sources.test.ts` (imports, a block)

- [ ] **Step 1: Write the failing checks**

In `tests/spine/london_city_sources.test.ts`, replace:

```ts
import { buildCityLiving, buildCityRunway } from "../../src/lib/spine/fact_rows";
```

with:

```ts
import { buildCityDemand, buildCityLiving, buildCityRunway, buildCitySeason } from "../../src/lib/spine/fact_rows";
import { buildCityCalendar } from "../../src/lib/spine/city_calendar_rows";
```

and above the summary line add:

```ts
/* WHAT RESIDENTS SPEND, WHO THE FOOTFALL IS, WHEN THE CITY SPENDS (plan 2026-10-08): the shard's modelled figures, each card's one
   line saying it is an estimate. London draws none of the three (its spend and calendar are placeholders, its split unheld). */
for (const slug of SIX) {
  const d = buildCityDemand(slug);
  check(`${slug}'s spend says it is an estimate ("${d?.basis}")`, !!d?.figure && d.basis === COPY.cityDemand.basisEstimate);
  const s = buildCitySeason(slug);
  check(`${slug}'s split says it is an estimate ("${s?.foot}")`, (s?.cells.length ?? 0) === 2 && s?.foot === COPY.citySeason.footEstimate);
  const k = buildCityCalendar(slug);
  check(`${slug}'s calendar says it is an estimate ("${k?.basis}")`, !!k && k.basis === COPY.cityCalendar.basisEstimate);
}
check("Paris's three lines are unchanged", buildCityDemand("paris")?.basis === COPY.cityDemand.basis && buildCitySeason("paris")?.foot === null && buildCityCalendar("paris")?.basis === COPY.cityCalendar.basis);
check("London draws none of the three", buildCityDemand("london")?.figure === null && (buildCitySeason("london")?.cells.length ?? 0) === 0 && buildCityCalendar("london") === null);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t10.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t10.txt`
Expected: 18 red lines (three a city); Paris and London pass, `exit 1`.

- [ ] **Step 3: Write the three lines**

In `src/lib/spine/copy.ts`, below `    basis: "What one resident spends in a year, on everything.",` add:

```ts
    /** The six UK cities (plan 2026-10-08, uk:cities-sourced-or-marked): the shard's spend, a share of metro GDP, said once. */
    basisEstimate: "An estimate of what one resident spends in a year, on everything.",
```

Replace:

```ts
    basis: "Of the year's footfall, the share who live here and the share visiting.",
    footModelled: "",
```

with:

```ts
    basis: "Of the year's footfall, the share who live here and the share visiting.",
    footModelled: "",
    /** The six UK cities (plan 2026-10-08): the shard's split, under the drawn bar, whatever its tag. */
    footEstimate: "An estimated split of the year's footfall.",
```

and below `    basis: "Spending each month, with the busiest set to 100.",` add:

```ts
    /** The six UK cities (plan 2026-10-08): the shard's modelled months. */
    basisEstimate: "Estimated spending each month, with the busiest set to 100.",
```

- [ ] **Step 4: Give the three builders the line**

In `src/lib/spine/fact_rows.ts`, replace:

```ts
    withheld: null,
    basis: C.basis,
    foot: notHeld(spend.tag) ? C.footModelled : null,
```

with:

```ts
    withheld: null,
    /* A UK city's spend says it is an estimate (plan 2026-10-08, uk:cities-sourced-or-marked); London's placeholder never prints. */
    basis: cityHeldToSources(iso2, slug) ? C.basisEstimate : C.basis,
    foot: notHeld(spend.tag) ? C.footModelled : null,
```

and replace:

```ts
      withheld: null,
      basis: C.basis,
      foot: notHeld(tag) ? C.footModelled : null,
```

with:

```ts
      withheld: null,
      basis: C.basis,
      /* A UK city's split says it is an estimate, whatever its tag (plan 2026-10-08): the card prints the foot under its bar. */
      foot: cityHeldToSources(iso2, slug) ? C.footEstimate : notHeld(tag) ? C.footModelled : null,
```

In `src/lib/spine/city_calendar_rows.ts`, below `import { COPY } from "@/lib/spine/copy";` add:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace `    basis: COPY.cityCalendar.basis,` with:

```ts
    /* A UK city's months say they are estimates (plan 2026-10-08, uk:cities-sourced-or-marked); London's placeholder draws no card. */
    basis: cityHeldToSources(iso2, slug) ? COPY.cityCalendar.basisEstimate : COPY.cityCalendar.basis,
```

- [ ] **Step 5: Teach archetype-copy the split's UK foot**

`scripts/verify_archetype_copy.ts` holds every city's split foot to "modelled exactly when the tag is not held" (`:825-826`), which
the UK cities now break on purpose (Edinburgh's split is tagged held and prints the estimate foot). Below line 55
(`import { buildCityLiving, buildCityRunway, buildCityDemand, buildCitySeason, CITY_LIVING_CELLS } from "@/lib/spine/fact_rows";`) add:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
      if ((se.confidence !== "measured") !== (se.foot != null)) reds.push(`city season ${c.slug}: the confidence is ${se.confidence} and the foot is ${se.foot ? "printed" : "absent"}`);
      if (se.from === "shard" && se.foot != null && se.foot !== COPY.citySeason.footModelled) reds.push(`city season ${c.slug}: the shard's modelled shares under the foot "${se.foot}"`);
```

with:

```ts
      /* A UK city's split says once that it is an estimate, whatever its tag (plan 2026-10-08, uk:cities-sourced-or-marked); the
         predicate holds the UK's slugs alone, so "GB" with the slug asks whether the city is one. */
      const ukSplit = cityHeldToSources("GB", c.slug);
      if (ukSplit && se.foot !== COPY.citySeason.footEstimate) reds.push(`city season ${c.slug}: a UK city's split under the foot "${se.foot ?? ""}", not "${COPY.citySeason.footEstimate}"`);
      if (!ukSplit && (se.confidence !== "measured") !== (se.foot != null)) reds.push(`city season ${c.slug}: the confidence is ${se.confidence} and the foot is ${se.foot ? "printed" : "absent"}`);
      if (!ukSplit && se.from === "shard" && se.foot != null && se.foot !== COPY.citySeason.footModelled) reds.push(`city season ${c.slug}: the shard's modelled shares under the foot "${se.foot}"`);
```

- [ ] **Step 6: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t10.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t10.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,london-city,archetype-copy,model-laws-copy,placeholder-never-printed,copy-no-method-words > scratchpad/uk-cities/g10.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g10.txt`
Expected: `Passed: 6`, `Failed: 0`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/spine/copy.ts src/lib/spine/fact_rows.ts src/lib/spine/city_calendar_rows.ts scripts/verify_archetype_copy.ts tests/spine/london_city_sources.test.ts
git commit -m "The six UK cities' spend, footfall split and calendar each say they are estimates (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 11: the district rents, the branch on the wider predicate

No UK city but London draws a district card today; the day one does, its rents say they are estimates, as London's do.

**Files:**
- Modify: `src/lib/spine/district_rows.ts:85`, `:197-200`
- Modify: `tests/spine/london_city_sources.test.ts`

- [ ] **Step 1: Write the failing checks**

Above the summary line add:

```ts
/* THE DISTRICT RENTS (plan 2026-10-08): the engine's multipliers on any UK city say they are estimates; a lettered fixture, since no
   other UK city draws the card today. A city outside the UK keeps its line. */
const ukBars = buildCityDistrictBars({ meta: { iso2: "GB", slug: "manchester" }, where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.8 }, { name: "A", slug: "a", rent_mult: 1 }] } });
check(`a UK city's district card says its rents are estimates ("${ukBars?.basis}")`, ukBars?.basis === COPY.cityDistricts.basisEstimate.replace("{district}", "A"));
const deBars = buildCityDistrictBars({ meta: { iso2: "DE", slug: "berlin" }, where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.8 }, { name: "A", slug: "a", rent_mult: 1 }] } });
check("a city outside the UK keeps its line", !!deBars && !/estimate/i.test(deBars.basis));
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t11.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t11.txt`
Expected: 1 red line (the UK fixture), `exit 1`.

- [ ] **Step 3: Move the branch**

In `src/lib/spine/district_rows.ts`, replace line 85 `import { cityRegisterPlace } from "@/lib/uk/registers/register_city";` with:

```ts
import { cityHeldToSources } from "@/lib/uk/registers/register_city";
```

and replace:

```ts
  /* ONE SUPPORTING LINE (PART 9): where the rents say they are estimates (a page held to a register region; masterplan step 03)
     the clip rides in the same line, "Estimated rents against South London. West End may be dearer than shown.", and no second
     line stands under it. */
  const estimated = !!citySlug && cityRegisterPlace(String(seed?.meta?.iso2 ?? hoodCity(citySlug)?.iso2 ?? ""), citySlug) !== null;
```

with:

```ts
  /* ONE SUPPORTING LINE (PART 9): where the rents say they are estimates (a UK city's page: London since masterplan step 03, every
     UK city since plan 2026-10-08) the clip rides in the same line, "Estimated rents against South London. West End may be dearer
     than shown.", and no second line stands under it. */
  const estimated = !!citySlug && cityHeldToSources(String(seed?.meta?.iso2 ?? hoodCity(citySlug)?.iso2 ?? ""), citySlug);
```

- [ ] **Step 4: Run the test, the gates and the typecheck (the end of the city builders)**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/london_city_sources.test.ts > scratchpad/uk-cities/t11.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t11.txt`
Expected: `spine/london_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=london-city-sources,archetype-copy,model-laws-copy > scratchpad/uk-cities/g11.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g11.txt`
Expected: `Passed: 3`, `Failed: 0`.
Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/uk-cities/tsc11.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/tsc11.txt`
Expected: `exit 0` and no error line (tsc reads the tests too; Tasks 2 to 11 must type-check).

- [ ] **Step 5: Commit**

```bash
git add src/lib/spine/district_rows.ts tests/spine/london_city_sources.test.ts
git commit -m "District rents on any UK city say they are estimates, as London's do (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 12: the generalised gate, `uk-city-sources`

**Files:**
- Rename: `tests/spine/london_city_sources.test.ts` to `tests/spine/uk_city_sources.test.ts` (`git mv`)
- Modify: the renamed file (header, two imports, RULE, REMEDY, a block, the last line)
- Modify: `scripts/prebuild_all.ts:816-818`
- Modify: `tests/spine/london_city.test.ts:45` (a comment's path)
- Regenerate: `scripts/gates.json` (by `scripts/counts.ts --write`, never by hand)

- [ ] **Step 1: Rename the file**

Run: `git mv tests/spine/london_city_sources.test.ts tests/spine/uk_city_sources.test.ts`

- [ ] **Step 2: Rewrite its header, its rule and its remedy**

In `tests/spine/uk_city_sources.test.ts`, replace lines 1 to 8 (the header, from `/**` to ` */`) with:

```ts
/**
 * EVERY UK CITY'S PAGE PRINTS A SOURCED FIGURE OR A MARKED ONE (masterplan step 03, 2026-10-05, for London; plan 2026-10-08,
 * uk:cities-sourced-or-marked, for the six others). The UK pages are the Pro pages (his ruling 27), so a figure on them is an
 * official one, says it is an estimate in its card's one line, or is withheld. London is held to a register region (Greater
 * London, his ruling of 2026-10-04): its shop rent is the valuation's, its pay tenths the survey's, its hand-anchored cost of
 * living and its engine district rents gone or marked. Manchester, Birmingham, Leeds, Glasgow, Edinburgh and Bristol are held to
 * no register region: they keep their shards' and the city list's figures, each card's one line saying they are estimates, and
 * their official figures (the survey's pay, the UK's tenths, the counted visitors, the UK's born-abroad share) keep their lines.
 * cityHeldToSources picks the lines; cityRegisterPlace picks which figures are read.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/uk_city_sources.test.ts
 */
```

Replace `const RULE = "london-city-sources";` with `const RULE = "uk-city-sources";`, replace:

```ts
const REMEDY = "on a page held to a register region print an official figure, say the figure is an estimate, or withhold it";
```

with:

```ts
const REMEDY = "on a UK city's page print an official figure, say in the card's one line that the figure is an estimate (cityHeldToSources picks the line), or withhold it";
```

and replace the last line `console.log("spine/london_city_sources: all pass");` with `console.log("spine/uk_city_sources: all pass");`.

- [ ] **Step 3: Add the one list**

Below `import { readFileSync } from "node:fs";` add:

```ts
import { buildCharacterTables, buildCityPeopleTable } from "../../src/lib/spine/character_rows";
import { UK_CITY_SLUGS } from "../../src/lib/uk/registers/register_city";
```

and above the summary line add:

```ts
/* EVERY CARD'S ONE LINE ON THE SIX, IN ONE LIST (the audit of plan 2026-10-08): a card printing the shard's or the city list's
   figures says "estimate" in its line; the cards whose figures are official (the answer and the earnings strip, the survey's pay;
   the people table's born-abroad share, the UK page's own) keep theirs. A card added to the city page joins one of the two. */
check(`the gate holds every UK city with a page (${UK_CITY_SLUGS.join(", ")})`, [...SIX, "london"].sort().join(",") === UK_CITY_SLUGS.join(","));
for (const slug of SIX) {
  const board = buildCityHeroBoard(slug);
  const cells = buildPremisesBento(slug);
  const marked: Array<[string, string | null | undefined]> = [
    ["the board's column", board?.levelBasis],
    ["the prime rent", cells && "figure" in cells.rent ? cells.rent.basis : null],
    ["the deposit", cells && "figure" in cells.deposit ? cells.deposit.basis : null],
    ["the empty shops", cells && "part" in cells.empty ? cells.empty.basis : null],
    ["the fit-out", cells && "figure" in cells.fitOut ? cells.fitOut.basis : null],
    ["the permits", buildCityGates(slug)?.basis],
    ["who is trading", buildCityMarket(slug)?.basis],
    ["living", buildCityLiving(slug)?.basis],
    ["the runway", buildCityRunway(slug)?.basis],
    ["the spend", buildCityDemand(slug)?.basis],
    ["the split", buildCitySeason(slug)?.foot],
    ["the crew", buildCityCrew(slug)?.basis],
    ["the texture", buildCityTexture(slug)?.basis],
    ["the calendar", buildCityCalendar(slug)?.basis],
    ["the peers", buildCityPeerTable(peerSeedOf(slug))?.caveat],
  ];
  for (const [card, line] of marked) check(`${slug}: ${card} says its figures are estimates ("${line ?? "no line"}")`, typeof line === "string" && /\bestimate/i.test(line));
  check(`${slug}: the answer is official and keeps its line`, board?.answerBasis === COPY.cityHero.answerBasis);
  check(`${slug}: the earnings strip is official and keeps its line`, buildCityEarningsStrip(slug)?.basis === COPY.cityCustomers.basis);
  const bornAbroad = buildCityPeopleTable(slug)?.foot?.value;
  check(`${slug}: the born-abroad share is the UK page's own (${bornAbroad})`, !!bornAbroad && bornAbroad === buildCharacterTables("GB").people?.foot?.value);
}
/* The views print the lines the builders hand them (a builder's line a view ignores is a line no reader meets). */
const cityViewSrc = readFileSync("src/components/spine/city/city-view.tsx", "utf8");
check("the split card prints its foot", /\{season\.foot \? <p/.test(cityViewSrc));
check("the spend card prints its basis", /basis=\{demand\.basis \?\? undefined\}/.test(cityViewSrc));
```

- [ ] **Step 4: Point the chain and the comment at the new name**

In `scripts/prebuild_all.ts`, replace:

```ts
  /* London's city page prints an official figure, says a figure is an estimate, or withholds it: the shop rent from the
     valuation slice, the survey's pay tenths, no hand-anchored cost of living, no engine district rents (masterplan step 03). */
  { name: "london-city-sources", script: "tests/spine/london_city_sources.test.ts" },
```

with:

```ts
  /* Every UK city's page prints an official figure, says in its card's one line that a figure is an estimate, or withholds it:
     London's shop rent from the valuation slice, the survey's pay, no hand-anchored cost of living, no engine district rents
     (masterplan step 03); the six other cities' shard figures each marked an estimate (plan 2026-10-08, uk:cities-sourced-or-marked). */
  { name: "uk-city-sources", script: "tests/spine/uk_city_sources.test.ts" },
```

In `tests/spine/london_city.test.ts`, replace `(tests/spine/london_city_sources.test.ts)` with `(tests/spine/uk_city_sources.test.ts)`.

- [ ] **Step 5: Run the gate, regenerate the registry, run the chain's own checks**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_city_sources.test.ts > scratchpad/uk-cities/t12.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t12.txt`
Expected: no red line, `spine/uk_city_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/uk-cities/counts12.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/counts12.txt`
Expected: `exit 0`; `git diff --stat` then shows `scripts/gates.json` changed (the gate's name and script) and the count of gates
the same, so CLAUDE.md's block does not change.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=uk-city-sources,london-city,counts-fresh,single-gate-chain,gate-reds-ratchet,gate-conflicts > scratchpad/uk-cities/g12.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g12.txt`
Expected: `Passed: 6`, `Failed: 0` (gate-reds-ratchet reads the new gate's failure text: red() names the file, the rule and the
remedy).

- [ ] **Step 6: Commit**

```bash
git add tests/spine/uk_city_sources.test.ts tests/spine/london_city.test.ts scripts/prebuild_all.ts scripts/gates.json
git commit -m "Gate uk-city-sources: London's sources gate over all seven UK cities, every card's line in one list (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(`git mv` staged the deletion of the old path; check `git status --short tests/spine` shows only the rename and the edit before
committing.)

---

## Task 13: the trade's typical keeps the city's own density, marked

**Files:**
- Modify: `src/lib/spine/uk_trade_typical.ts:16`, `:50-51`, `:69`
- Modify: `src/lib/spine/market_rows.ts:113` (one field)
- Modify: `src/components/spine/cell/market.tsx:111`
- Modify: `src/lib/spine/copy.ts:2065` (one key)
- Modify: `tests/spine/uk_pages_sources.test.ts` (a block)

- [ ] **Step 1: Write the failing checks**

In `tests/spine/uk_pages_sources.test.ts`, above
`for (const w of Object.values(T).flatMap((v) => (typeof v === "string" ? [v] : Object.values(v)))) {` add:

```ts
/* Every other UK city's trade page (plan 2026-10-08, uk:cities-sourced-or-marked): the same lines; the city's own density stays,
   its line saying it is an estimate (its city page prints the same figure as one). London's still leaves. */
const kept = sayTradeTypical(fixture, "restaurants", { keepHere: true });
check(`a UK city's trade page keeps the city's own density (${kept.market?.here?.value})`, kept.market?.here?.value === 9.1);
check(`and says it is an estimate: "${kept.market?.hereBasis}"`, kept.market?.hereBasis === T.market.firmsHere);
check("its other cards say the trade's typical as London's do", kept.split?.basis === T.split && kept.team?.basis === T.team && kept.mix?.foot === T.mix && kept.customers?.basis === T.customers && kept.clears?.basis === T.clears && kept.market?.insolvent?.per100 === 2.9);
check("London's drops the density and carries no density line", said.market?.here === null && said.market?.hereBasis === undefined);
const rivalsSrc = readFileSync("src/components/spine/cell/market.tsx", "utf8");
check("the rivals cell prints the line the page hands it", /market\.here \? market\.hereBasis \?\? R\.basisHere : firms\.basis/.test(rivalsSrc));
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_pages_sources.test.ts > scratchpad/uk-cities/t13.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t13.txt`
Expected: 3 red lines (the density kept, its line, the rivals cell's source); the other two pass, `exit 1`.

- [ ] **Step 3: Write the line and the field**

In `src/lib/spine/copy.ts`, below `      dayparts: "Out of every $100 taken in a week, the trade's typical.",` add:

```ts
      /** The city's own density on a UK trade page outside London (plan 2026-10-08): the shard's figure, beside the trade's typical. */
      firmsHere: "Estimated here, beside the trade's typical.",
```

In `src/lib/spine/market_rows.ts`, below `  here: { value: number; tag: FactTag } | null;` add:

```ts
  /** The rivals cell's line where the city's own density leads on a UK trade page outside London (uk_trade_typical.ts; plan
   *  2026-10-08): it says the density is an estimate. The copy's `basisHere` otherwise. */
  hereBasis?: string;
```

In `src/components/spine/cell/market.tsx`, replace `      basis={market.here ? R.basisHere : firms.basis}` with:

```tsx
      basis={market.here ? market.hereBasis ?? R.basisHere : firms.basis}
```

- [ ] **Step 4: Teach `sayTradeTypical` to keep the density**

In `src/lib/spine/uk_trade_typical.ts`, replace:

```ts
 * Pure over the built cards; the cell view calls it on a page held to a register region and nowhere else.
```

with:

```ts
 * EVERY OTHER UK CITY'S TRADE PAGE (plan 2026-10-08, uk:cities-sourced-or-marked) takes the same lines with `keepHere`: its city's
 * own density stays, its line saying it is an estimate, since the city page prints the same figure as one and only London's
 * density stood over the wrong place.
 *
 * Pure over the built cards; the cell view calls it on a UK city's trade page and nowhere else.
```

replace:

```ts
/** The same cards, each world-typical line saying so; the market without the metro density and with the UK's insolvencies. */
export function sayTradeTypical(cards: UkTradeCards, tradeSlug: string | null | undefined): UkTradeCards {
```

with:

```ts
/** The same cards, each world-typical line saying so; the market with the UK's insolvencies, and without the city's own density
 *  unless `keepHere` (a UK city held to no register region), where the density stays and its line says it is an estimate. */
export function sayTradeTypical(cards: UkTradeCards, tradeSlug: string | null | undefined, opts: { keepHere?: boolean } = {}): UkTradeCards {
```

and replace `          here: null,` with:

```ts
          here: opts.keepHere ? market.here : null,
          hereBasis: opts.keepHere && market.here ? T.market.firmsHere : undefined,
```

- [ ] **Step 5: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_pages_sources.test.ts > scratchpad/uk-cities/t13.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t13.txt`
Expected: `spine/uk_pages_sources: all pass` (the loop over the trade's-typical strings now reads `firmsHere` too: six words, no
"anywhere"), `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=uk-pages-sources,archetype-copy,copy-no-method-words,census-fresh > scratchpad/uk-cities/g13.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g13.txt`
Expected: `Passed: 4`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/spine/uk_trade_typical.ts src/lib/spine/market_rows.ts src/components/spine/cell/market.tsx src/lib/spine/copy.ts tests/spine/uk_pages_sources.test.ts
git commit -m "sayTradeTypical keeps a UK city's own density, its line saying it is an estimate (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 14: every UK city's trade page says the trade's typical

**Files:**
- Modify: `src/components/spine/cell/cell-view.tsx:179`, `:379-382`
- Modify: `tests/spine/uk_pages_sources.test.ts:1-3` (header), below `:60` (a check)
- Modify: `scripts/prebuild_all.ts:819-821` (the uk-pages-sources comment)

- [ ] **Step 1: Write the failing check**

In `tests/spine/uk_pages_sources.test.ts`, below
`check("the cell view says it on a page held to a register region", /cityRegisterPlace\([^;]*\) \? sayTradeTypical\(builtCards/.test(view));` add:

```ts
check("and on every other UK city's trade page, the city's density kept", /cityHeldToSources\(placeIso2, placeGeo\) \? sayTradeTypical\(builtCards, tradeSlug, \{ keepHere: true \}\)/.test(view));
```

and replace its header's first two lines:

```ts
 * THE LONDON TRADE PAGES AND THE UK'S PAGE PRINT A SOURCED FIGURE, A MARKED ONE, OR NONE (masterplan step 04, 2026-10-05; the
 * labels audit of 2026-10-02, items 10, 17 and 18; QUEUE country:cities-region-line).
```

with:

```ts
 * THE UK'S TRADE PAGES AND THE UK'S PAGE PRINT A SOURCED FIGURE, A MARKED ONE, OR NONE (masterplan step 04, 2026-10-05, London's
 * trade pages; plan 2026-10-08, every other UK city's; the labels audit of 2026-10-02, items 10, 17 and 18; QUEUE
 * country:cities-region-line).
```

- [ ] **Step 2: Run it to see it fail**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_pages_sources.test.ts > scratchpad/uk-cities/t14.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t14.txt`
Expected: 1 red line, `exit 1`.

- [ ] **Step 3: Wire the cell view**

In `src/components/spine/cell/cell-view.tsx`, replace line 179:

```tsx
import { cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

with:

```tsx
import { cityHeldToSources, cityRegisterPlace } from "@/lib/uk/registers/register_city";
```

and replace:

```tsx
  /* A PAGE HELD TO A REGISTER REGION (a London trade page; masterplan step 04, the labels audit's item 10): each card printing
     the trade's figure says so in its one line, the market drops the metro density and takes the UK's insolvencies. */
  const builtCards = { split: splitBuilt, team: teamBuilt, clears: clearsBuilt, mix: mixBuilt, customers: customersBuilt, open: openBuilt, market: marketBuilt };
  const { split, team, clears, mix, customers, open, market } = cityRegisterPlace(String(d.meta?.iso2 ?? ""), String(d.meta?.geo ?? "")) ? sayTradeTypical(builtCards, typeof d.meta?.industry === "string" ? d.meta.industry : null) : builtCards;
```

with:

```tsx
  /* A PAGE HELD TO A REGISTER REGION (a London trade page; masterplan step 04, the labels audit's item 10): each card printing
     the trade's figure says so in its one line, the market drops the metro density and takes the UK's insolvencies. EVERY OTHER
     UK CITY'S TRADE PAGE (plan 2026-10-08, uk:cities-sourced-or-marked) says the same and keeps the city's own density, marked an
     estimate: its city page prints that figure as an estimate. */
  const builtCards = { split: splitBuilt, team: teamBuilt, clears: clearsBuilt, mix: mixBuilt, customers: customersBuilt, open: openBuilt, market: marketBuilt };
  const placeIso2 = String(d.meta?.iso2 ?? ""), placeGeo = String(d.meta?.geo ?? "");
  const tradeSlug = typeof d.meta?.industry === "string" ? d.meta.industry : null;
  const { split, team, clears, mix, customers, open, market } = cityRegisterPlace(placeIso2, placeGeo) ? sayTradeTypical(builtCards, tradeSlug) : cityHeldToSources(placeIso2, placeGeo) ? sayTradeTypical(builtCards, tradeSlug, { keepHere: true }) : builtCards;
```

In `scripts/prebuild_all.ts`, replace:

```ts
  /* The London trade pages and the UK's page: the trade's typical said on each world-typical card, the UK's insolvencies for the
```

with:

```ts
  /* The UK's trade pages (London's; every other UK city's since plan 2026-10-08, its own density kept and marked) and the UK's
     page: the trade's typical said on each world-typical card, the UK's insolvencies for the
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_pages_sources.test.ts > scratchpad/uk-cities/t14.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/t14.txt`
Expected: `spine/uk_pages_sources: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=uk-pages-sources,page-foot,census-fresh,layering > scratchpad/uk-cities/g14.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g14.txt`
Expected: `Passed: 4`, `Failed: 0`.

- [ ] **Step 5: See it on the two restaurants pages**

Run: `bash scratchpad/reform/render_some.sh "cell gb manchester restaurants" "cell gb london restaurants" > scratchpad/uk-cities/render14.txt 2>&1`
Expected (read the file): `rendered: cell gb manchester restaurants`, `rendered: cell gb london restaurants`, no `FAILED:` line
(one that failed for memory: wait 60 s and render it again).
Run: `node -e "const f=require('fs');const s=f.readFileSync('scratchpad/harness/pages/cell-gb-manchester-restaurants.html','utf8').replace(/&#x27;/g,String.fromCharCode(39));for(const t of ['Estimated here, beside the trade','Roles typical for the trade','UK companies insolvent a year','of 100 close a year'])console.log(s.includes(t)?'PRINTS':'ABSENT',t)" > scratchpad/uk-cities/lines14.txt 2>&1`
Expected (read the file): `PRINTS` on the first three, `ABSENT` on the last.
Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/uk-cities/tsc14.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/tsc14.txt`
Expected: `exit 0`, no error line.

- [ ] **Step 6: Commit**

```bash
git add src/components/spine/cell/cell-view.tsx tests/spine/uk_pages_sources.test.ts scripts/prebuild_all.ts
git commit -m "Every UK city's trade page says the trade's typical as London's does, its own density marked (uk:cities-sourced-or-marked)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 15: loud-seats takes `--list=` as its siblings do

The copy, laws, readability and page-filter gates take `--list=<file>`; loud-seats reads only `scripts/harness/pages.json`, and the
six cities are not in it (adding them would render six more pages on every deploy). One optional argument, the chain's run
unchanged.

**Files:**
- Modify: `scripts/lib/page_renders.mjs` (`pageRenders` and its doc line)
- Modify: `scripts/verify_loud_seats.mjs:69` (usage), `:109`

- [ ] **Step 1: Let `pageRenders` read a list it is handed**

In `scripts/lib/page_renders.mjs`, replace:

```js
 * @param {{ kinds?: Array<"fresh" | "frozen"> }} [opts]  which kinds to return; both by default
```

with:

```js
 * @param {{ kinds?: Array<"fresh" | "frozen">, list?: string }} [opts]  which kinds to return (both by default), and the harness
 *   list the fresh ones come from (scripts/harness/pages.json by default; a list of the same shape names renders the chain does not
 *   draw, for a gate run by hand)
```

and replace:

```js
export function pageRenders({ kinds = ["fresh", "frozen"] } = {}) {
  const out = [];
  if (kinds.includes("fresh")) {
    const list = JSON.parse(readFileSync(HARNESS_LIST, "utf8")).pages;
    for (const p of list) {
```

with:

```js
export function pageRenders({ kinds = ["fresh", "frozen"], list = HARNESS_LIST } = {}) {
  const out = [];
  if (kinds.includes("fresh")) {
    const pages = JSON.parse(readFileSync(list, "utf8")).pages;
    for (const p of pages) {
```

- [ ] **Step 2: Read the flag in loud-seats**

In `scripts/verify_loud_seats.mjs`, replace ` * Usage: npx tsx scripts/verify_loud_seats.mjs` with
` * Usage: npx tsx scripts/verify_loud_seats.mjs [--list=<a list shaped as scripts/harness/pages.json>]`, and replace:

```js
const ENTRIES = pageRenders({ kinds: ["fresh"] });
```

with:

```js
/* THE LIST, AS ITS SIBLINGS TAKE IT (plan 2026-10-08, uk:cities-sourced-or-marked): the chain's own by default; --list=<file>, a list
   shaped as scripts/harness/pages.json, measures renders the chain does not draw (the six other UK city pages), by hand only. */
const LIST_ARG = process.argv.slice(2).find((a) => a.startsWith("--list="));
const ENTRIES = pageRenders({ kinds: ["fresh"], ...(LIST_ARG ? { list: LIST_ARG.slice("--list=".length) } : {}) });
```

- [ ] **Step 3: Write the hand-run list (never committed)**

Create `scratchpad/uk-cities/pages.json`:

```json
{
  "why": "The seven UK city pages, for one hand run of the browser gates (plan 2026-10-08, uk:cities-sourced-or-marked); the chain never reads it.",
  "pages": [
    { "surface": "city", "slugs": ["london"] },
    { "surface": "city", "slugs": ["manchester"] },
    { "surface": "city", "slugs": ["birmingham"] },
    { "surface": "city", "slugs": ["leeds"] },
    { "surface": "city", "slugs": ["glasgow"] },
    { "surface": "city", "slugs": ["edinburgh"] },
    { "surface": "city", "slugs": ["bristol"] }
  ]
}
```

- [ ] **Step 4: Run it both ways**

Run: `node node_modules/tsx/dist/cli.mjs scripts/verify_loud_seats.mjs > scratchpad/uk-cities/loud15a.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/loud15a.txt`
Expected: the chain's run as measured before the plan: `ok loud-seats: 10 renders at 1280, 14 accent figures, ... (15 declared
LIT, 1 withheld on these renders)`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/verify_loud_seats.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/loud15b.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/loud15b.txt`
Expected: `loud-seats reads 7 fresh renders`, each city `declared LIT 2 of 3, withheld on this render 0, measured 2: agree` (the
answer and the shop rent), `ok loud-seats: 7 renders at 1280, 14 accent figures, ... (14 declared LIT, 0 withheld on these
renders)`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=gate-reds-ratchet,single-gate-chain > scratchpad/uk-cities/g15.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g15.txt`
Expected: `Passed: 2`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/page_renders.mjs scripts/verify_loud_seats.mjs
git commit -m "loud-seats takes --list= as its four siblings do, for renders the chain does not draw; the chain's run unchanged" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 16: the seven pages measured, and the records

**Files:**
- Create (never committed): `scratchpad/uk-cities/lines.mjs`
- Modify: `E:/atlas/design/loop/build/QUEUE.md` (the row's status; three rows)

- [ ] **Step 1: Re-render the seven cities and the two restaurants pages, one at a time**

Run: `bash scratchpad/reform/render_some.sh "city london" "city manchester" "city birmingham" "city leeds" "city glasgow" "city edinburgh" "city bristol" "cell gb manchester restaurants" "cell gb london restaurants" > scratchpad/uk-cities/render16.txt 2>&1`
Expected (read the file): nine `rendered:` lines and no `FAILED:` (a render that failed for memory: wait 60 s, render that one again).

- [ ] **Step 2: Read the lines off the renders**

Create `scratchpad/uk-cities/lines.mjs`:

```js
/* THE LINES PLAN 2026-10-08 PUTS ON THE PAGES, read off the harness renders (scratchpad, never committed). Run from E:/atlas/website. */
import { readFileSync } from "node:fs";
const read = (name) => readFileSync(`scratchpad/harness/pages/${name}.html`, "utf8").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
let bad = 0, ok = 0;
const has = (page, text, want = true) => {
  const found = read(page).includes(text);
  if (found === want) ok++;
  else { bad++; console.log(`BAD  ${page}: ${want ? "missing" : "still prints"} ${JSON.stringify(text)}`); }
};
const SIX = ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"];
const VISITORS = new Set(["manchester", "birmingham"]);
for (const slug of SIX) {
  const page = `city-${slug}`;
  for (const t of [
    ">Longest permit wait<",
    ">Estimates. Levels compare cities. Cost of living: cheapest city 1, dearest 100.<",
    ">Pay, a year.<",
    ">Estimates: a square metre of prime shop space, a year.<",
    ">Estimates: months of rent held as the deposit, and the lease term.<",
    ">Out of every 100 shops, an estimate.<",
    ">Estimates: a square metre fitted out, and the rent-free months.<",
    ">Estimates, but food registration is free. The slowest sets your opening date.<",
    ">Estimates of the businesses trading in the city.<",
    ">Estimates for one person living here, not for the shop.<",
    ">An estimated one-bed rent for a year, against a typical income.<",
    ">An estimate of what one resident spends in a year, on everything.<",
    ">An estimated split of the year's footfall.<",
    ">Typical pay here, a year. Both tenths are for the whole country.<",
    ">Estimated pay and hours for five roles a small business hires.<",
    ">The count of official visits is an estimate.<",
    ">Estimated spending each month, with the busiest set to 100.<",
    VISITORS.has(slug) ? ">Pay and visitors, a year. Estimates: cost of living, and pay abroad.<" : ">Pay, a year. Estimates: cost of living, and pay abroad.<",
  ]) has(page, t);
  for (const t of [
    ">City permits<", ">Levels compare cities. Cost of living", ">A square metre of prime shop space", ">Months of rent held",
    ">Out of every 100 shops.<", ">To fit out a square metre", ">On top of registering the company.", ">Businesses trading in the city.<",
    ">Prices for one person living here", ">One-bed rent for a year", ">What one resident spends", ">Five roles a small business hires.<",
    ">Spending each month", ">Pay and visitors, a year.<",
  ]) has(page, t, false);
}
for (const t of [
  ">The permit wait is an estimate. Levels compare cities.<",
  ">Estimated pay and hours for five roles a small business hires.<",
  ">Pay and visitors, a year. No source holds a cost of living.<",
  ">Estimates for one person living here, not for the shop.<",
]) has("city-london", t);
for (const t of [
  ">Out of every $100 in sales, the trade's typical.<", ">Roles typical for the trade, pay from the UK's median.<",
  ">The trade's typical part of each day's sales that pays costs.<", ">Spend per visit times visits a year, the trade's typical.<",
  ">Estimated here, beside the trade's typical.<", "of 100 UK companies insolvent a year", ">Out of every 100 firms, the trade's typical.<",
  ">The busiest month over the quietest, the trade's typical.<", ">Out of every $100 taken in a week, the trade's typical.<",
]) has("cell-gb-manchester-restaurants", t);
for (const t of [
  "of 100 close a year", ">Firms per 10,000 people here, beside the usual for this trade<", ">Out of every $100 in sales.<",
  ">Spend per visit, times visits a year.<", ">Of each day's sales, the part that pays the costs.<",
]) has("cell-gb-manchester-restaurants", t, false);
for (const t of [">The trade's typical.<", "of 100 UK companies insolvent a year"]) has("cell-gb-london-restaurants", t);
has("cell-gb-london-restaurants", ">Estimated here, beside the trade's typical.<", false);
console.log(`lines: ${ok} as expected, ${bad} not`);
process.exit(bad ? 1 : 0);
```

Run: `node scratchpad/uk-cities/lines.mjs > scratchpad/uk-cities/lines16.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/lines16.txt`
Expected: `lines: 213 as expected, 0 not`, `exit 0` (32 a city on the six, 4 on London, 14 on Manchester's restaurants, 3 on London's).

- [ ] **Step 3: The browser gates on the seven, one at a time**

Run each, then read its file:

```bash
node scripts/harness/check_copy_plain.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/copy_plain.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/copy_plain.txt
node scripts/harness/check_copy_plain.mjs scratchpad/harness/pages/cell-gb-manchester-restaurants.html scratchpad/harness/pages/cell-gb-london-restaurants.html > scratchpad/uk-cities/copy_plain_cells.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/copy_plain_cells.txt
node scripts/harness/check_page_laws.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/page_laws.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/page_laws.txt
node scripts/harness/check_page_laws.mjs scratchpad/harness/pages/cell-gb-manchester-restaurants.html > scratchpad/uk-cities/page_laws_cell.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/page_laws_cell.txt
node scripts/harness/check_readability.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/readability.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/readability.txt
node scripts/harness/check_page_holes.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/page_holes.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/page_holes.txt
node node_modules/tsx/dist/cli.mjs scripts/verify_loud_seats.mjs --list=scratchpad/uk-cities/pages.json > scratchpad/uk-cities/loud_seats.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/loud_seats.txt
```

Expected, against the measurements of 2026-10-08 before this plan:
- copy plain: `copy plain: 7 page(s) x 2 widths, 0 red(s) (none)`, `exit 0`; the two restaurants pages `0 red(s)`, `exit 0`. Every
  new line holds twelve words or fewer and no semicolon; one line a card.
- page laws: London `0 red(s)` at every width; `page laws: 7 page(s) x 3 widths, 6 red(s)`, the six reds the plan found and did not
  cause (`city-<one of the six>@1280 #demand: LONE FIGURE`), the ratchet line naming the six at 1 against a baseline of 0, `exit 1`.
  Any other red is this plan's: fix the card it names under its law and run again; never raise a baseline. Manchester's
  restaurants: `0 red(s)`, `exit 0`.
- readability: `readability: 7 page(s) x 3 widths, 0 red(s)`, `exit 0`.
- page filter: `page holes: 7 page(s) x 3 widths, 0 red(s)` with 2 accents a page, `exit 0` (it rewrites
  `scratchpad/harness/accents.json`; the chain's next run writes it back).
- loud-seats: `ok loud-seats: 7 renders at 1280, 14 accent figures, ...`, `exit 0`.

- [ ] **Step 4: The city and copy gates, and the full typecheck**

Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=uk-city-sources,london-city,uk-pages-sources,page-foot,archetype-copy,model-laws-copy,placeholder-never-printed,copy-no-method-words,legacy-method-words,no-em-dashes,no-source-agencies,census-fresh,layering,counts-fresh,single-gate-chain,gate-reds-ratchet,gate-conflicts > scratchpad/uk-cities/g16.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/g16.txt`
Expected: `Passed: 17`, `Failed: 0`, `SUBSET: PASS`, `exit 0`.
Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/uk-cities/tsc16.txt 2>&1; echo "exit $?" >> scratchpad/uk-cities/tsc16.txt`
Expected: `exit 0`, no error line.

London's page sits in the chain's list (`scripts/harness/pages.json`), so the deploy chain re-renders it and runs every browser gate
on it; Tasks 4 and 6 changed two of its lines, and Step 3 measured both under the five gates above.

- [ ] **Step 5: The records in the design repo**

In `E:/atlas/design/loop/build/QUEUE.md`, in the row whose id is `uk:cities-sourced-or-marked` (line 332 when this plan was
written), replace its status cell:

```
TODO (verified 2026-10-06: still true; launch BLOCKS (promoted 2026-10-06: the six cities print shard figures as fact on pages the paywall sells), M)
```

with (the two hashes from `git log --oneline`, the first and last commit of Tasks 1 to 15):

```
DONE, built on whats-left <first>..<last> (plan website docs/superpowers/plans/2026-10-08-uk-cities-marked/PLAN.md): every figure on the six pages official or saying it is an estimate in its card's one line, none withheld; their trade pages say the trade's typical as London's do, their own density marked; gate uk-city-sources; NOT pushed, his word for the deploy
```

and insert below that row:

```
| uk:cities-sourced | DATA | the six other UK cities print their shards' figures marked as estimates (plan 2026-10-08); no register on disk holds them | each city's own official figure where one is published, replacing its estimate line card by card: the valuation's shop rent for the city's own rating area (the slice holds Greater London and England only), the register's counts for its trades, each through E:/atlas/registers/uk/export_for_site.py | TODO (LATER, L; the data track) |
| uk:london-peers-abroad | PAGE | London's peers table prints the pay of the cities abroad with no estimate mark; its line is "Pay and visitors, a year. No source holds a cost of living." (website src/lib/spine/peer_rows.ts, the register case) | the line says the pay abroad is an estimate within the copy gate's twelve words, or the column holds only figures the line can call sourced | TODO (launch HELPS, S; found by plan 2026-10-08) |
| uk:cities-demand-lone-figure | PAGE | on the six other UK city pages the spend card ("What residents spend") reds LONE FIGURE at 1280 (harness-page-laws, clause 65: one figure and nothing beside it); measured before plan 2026-10-08 and unchanged by it | a second reading beside the spend, or a seat where clause 65 is met; harness-page-laws at 0 on the six | TODO (LATER, S; the six are not in the chain's list) |
```

```bash
git -C E:/atlas add design/loop/build/QUEUE.md
git -C E:/atlas commit -m "QUEUE: uk:cities-sourced-or-marked DONE on whats-left (plan 2026-10-08); three rows the audit found" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Report**

Report the commits, the five browser gates' lines from Step 3, `Passed: 17`, the typecheck, and that nothing was pushed. The deploy
is his word.

---

## Out of scope, named

- **Sourcing the six** (his decision 1: later): the valuation's shop rent by each city's rating area and the register's counts by
  local authority need the register export widened (QUEUE `uk:cities-sourced`, Task 16).
- **London's peers' pay abroad**, unmarked since masterplan step 03; its line has no room inside twelve words without a copy
  decision (QUEUE `uk:london-peers-abroad`).
- **The cost to open on every UK trade page** prints the cell's own lines (held state) with no estimate word, London's included; masterplan
  step 04 left it, and the cell holds them as real lines.
- **The UK aggregate trade page** (`/gb/gb/<trade>`) is no city: `cityHeldToSources` is false there, and this plan did not read it.
- **The six's spend card's LONE FIGURE**, older than this plan (QUEUE `uk:cities-demand-lone-figure`).
- **Adding the six to `scripts/harness/pages.json`**: six more renders on every deploy and six new ratchet entries; the hand run in
  Task 16 measures them instead.
