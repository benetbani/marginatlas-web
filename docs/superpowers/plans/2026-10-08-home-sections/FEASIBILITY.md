# Home sections: a data-feasibility audit of his thirteen ideas (2026-10-08)

Read-only research for the next goal. His words are in `IDEAS.md` beside this file. This file does not design or build anything:
for each idea it says what the site holds that could back it honestly, the one measure it would show, whether the places he
named are in the data, and a verdict. Nothing tracked was edited, no build, render, browser, gate or database query was run;
small node and python reads of local files only (scratch outputs under the session's scratchpad `feas/`).

The rules every verdict is held to: no visibly wrong number; like for like only (one trade across places, or trades within one
place), never business against geography; no composite index, ever (ruling 11); a figure outside the UK is an estimate and the
page says so once; feature a member only with a reason; plain copy, no disclaimers, no "modelled"; PART 9 clause 15 (a comparison
prints absolutes, never a percent difference or a multiple); R-002 (no source agency named outside About the figures); data first.

## 0. The answer in one table

| # | His idea | Verdict | The one honest measure |
|---|---|---|---|
| 1 | Deep techniques used to derive data | BUILD WITH WORDING CHANGE (merge 1, 2, 3) | none of its own: each technique shown with the figure it produced |
| 2 | Unmatched archival capability | DROP as worded; its honest part folds into 1 | counts of distinct records read, never summed across trades |
| 3 | Global coverage | BUILD WITH WORDING CHANGE (inside 1) | pages a visitor can reach, and where the figures are counted |
| 4 | High tax burdens: NYC, London, LA | NEEDS DATA (an engine on one basis) | tax on the same profit, as a share; only the UK can compute it |
| 5 | Rising stars countries | DROP as worded; fold into 8 and 9 | the site's growth field is a fill; no honest "star" |
| 6 | US winners and losers, top 5 and bottom 5 cities | BUILD WITH WORDING CHANGE (one export) | full-service restaurants with staff, 2019 and 2023, 45 metros |
| 7 | Mid-tier cities: Leeds, Austin, Lublin, Malaga | BUILD for the UK (one export); Lublin, Malaga NEEDS DATA | of 100 firms born in 2019, still trading after five years |
| 8 | LATAM gems | BUILD WITH WORDING CHANGE (one export) | new companies a year per 1,000 working-age people, 2022 |
| 9 | Best of Africa | BUILD WITH WORDING CHANGE (same export as 8) | the same measure, the same year |
| 10 | Restaurants in Rome, Paris, NYC, London | NEEDS DATA for Paris and Rome; London and New York only | each city's own counted figure, never on one scale |
| 11 | Hotels in 6 cities | BUILD WITH WORDING CHANGE | London's hotel boroughs now; six US metros after one export |
| 12 | Industries: default rates, cash flow masters, context | default rates BUILT (the duel); cash flow NEEDS DATA; context DROP | insolvencies a year per 1,000 live companies, UK |
| 13 | Underserved realities: Calgary, Tromso | DROP as worded | the premise fails on the data on disk; causes are judgements |

Top four for the home, with the reasons, in section 4.

## 1. What the live home already is (the base)

`src/components/spine/home/home-view.tsx` (the code default since 2026-10-07). Every builder it calls reads LOCAL JSON or TS (none
imports the database layer directly):

| Level | Builder | Reads |
|---|---|---|
| search (hero) | `NavigatorForm`, `RotatingWord` | taxonomy |
| the UK's three answers | `src/lib/spine/home_answers.ts` | `hero_board.ts` + `uk_tax_on_profit.ts` (the law engine: 18% on GBP 39,039, tested in `tests/spine/hero_rows.test.ts`); `country_depth_rows.ts` over `data/uk/registers/turnover.json`; `sections/first_years.ts` over `data/sections/survival.json` (UK 2019 cohort, 38.4 of 100 after five years) |
| the duel and the kitchens | `src/lib/home/duel.ts`, `src/lib/home/kitchens.ts` (not `src/lib/spine/`) | `data/editorial/editorial_feed.json` items `fail-most` and `kitchens-five`, with the 45-day rule |
| Pro (only while the paywall switch is on) | `ProBand.tsx` | none |
| the UK's cities beside the notebook | `src/lib/spine/city_cards.ts`, `src/lib/home/notebook.ts` | city shards and city list; `content/blog` |

Loud seats: one lit (the UK answer at 40); the search button and the Pro band are recorded as "no honest candidate"
(`LOUD_SEATS` in home-view.tsx). So two loud moments are free for new sections.

The precedent for every honest home section already exists: `E:/atlas/design/loop/build/goal-2026-10-02/HOMEPAGE-EDITORIAL.md`
(twelve measured, like-for-like findings; rules: one dimension ranked and one held, four members or no ranking, a floor on every
member, absolutes in one unit, no company named, dated, monthly items die after 45 days). The feed holds twelve items; the home
prints two. The other ten are ready material: `last-longest`, `restaurants-year-one`, `last-where`, `open-close`, `youngest`,
`shop-metre`, `kitchens-new`, `saturday`, `takings`, `new-companies`.

## 2. The instruments, and their blind spots (read before trusting any number below)

1. **City shards** (`data/facts/city/*.json`, 252 files; read by city pages through `src/lib/facts/*`). Local JSON. Every fact
   carries `tag` (held / modeled / placeholder) and a confidence. Blind spot: the tag is not a verification.
   `data/facts/VERIFICATION.md` sampled 146 "held" rows of the trade shards: 57.4 percent hit rate against an 80 percent floor.
   Measured here: the cross-city fields do not share definitions. Businesses per 10,000 residents: Austin 1,160, New York 351,
   Los Angeles 383, Warsaw 1,810, Prague 2,489, Guangzhou 2,893, Durban 46 (196 of 252 tagged modeled). Restaurants per 10,000:
   London 9.1, Bristol 4.5, Seoul 128.9. Prime rent a square metre a year: Paris $22,140, New York $13,993, London $5,000. Demand
   growth: 248 of 252 modeled, clustered (30 cities at 4.5, 23 at 4.0). **No home section may rank cities on a shard field.**
2. **Country profile** (`data/economic_indicators/country_profile_v2.json`, 197 countries). Its own anchor line: "Top 50 are Tier
   A (hand-anchored). Remaining ~146 are Tier B/C via regional-cluster + GDP-tier interpolation". The five-year growth field is a
   fill: 31 countries at exactly 1.7 percent, 15 at 2.5 (Venezuela and Haiti among them); even Tier A holds 24 distinct values
   across 50 countries (Indonesia, Poland, Egypt, Romania all 3.8). 45 of 47 African countries and 28 of the file's 33 in Latin
   America and the Caribbean are Tier B. **Never rank countries on this file.**
3. **Country shards** (`data/facts/country/*.json`, 198). Every `tax_burden.total_pct` is tagged modeled (UK 30.5, US 45.4,
   Australia 64.9) and disagrees with the hero's figure on the same page (the UK's 18 percent from the law engine, other countries'
   typed `effective_rate` in `src/lib/tax/smb_effective_rates.ts`, US 25 percent). Three "tax burdens" exist for one country.
4. **Cells** (Supabase; DATABASE reads through `src/lib/cells.ts`, wrapped in `withBudget`). `cells_master` holds about 722,000 US
   state rows; `regional_cells` holds counties and city overlays (`US-CITY-new-york`). Blind spot, stated in
   `src/lib/cells/trust.ts`: over the 15-city slate (`src/lib/markets/major_cities.ts`, which has Paris but not Rome), 945 of
   1,029 city-trade rows carry a filled anchor revenue, not their own ("restaurants in every European city and Tokyo at
   433,168.58"); New York holds its own revenue on 48 trades, London's curated entry on 14. A database read cannot be checked
   from here; nothing below depends on one.
5. **UK registers** (`data/uk/registers/{turnover,failures,survival,premises}.json`, manifest built 2026-10-06 by
   `E:/atlas/registers/uk/export_for_site.py`). Local JSON, counted or worked out, with intervals and floors. Geography: London's
   33 boroughs, London and England only (turnover, survival areas); failures are UK-wide by trade. This is the site's measured
   asset, and its edge is London.
6. **Raw archives on disk that the site does not read yet** (all local, none queried over a network):
   - `E:/atlas/cache/uk/ons_demography/2026-10-02/businessdemographyexceltables2024.xlsx`: every UK local authority (births,
     deaths, active firms 2019 to 2024, survival of each cohort, high-growth counts). The site exported London's boroughs only.
   - `E:/atlas/us/bls/qcew/parsed/qcew_cells_{2019..2023}.parquet`: US establishments, employment and wages by county and metro
     (`C` area codes) and 3- to 6-digit trade, private ownership. No all-industry total row in the parsed set.
   - `E:/atlas/us/economic_census/2022/sector*/EC22*BASIC.zip`: receipts, establishments, payroll by trade and metro (some cells
     suppressed); `E:/atlas/us/cbp/` 2019 to 2021; `E:/atlas/us/nes/` nonemployer counts by metro.
   - `E:/atlas/macro/global-aggregates/wb-business-density.json` (new limited companies registered per 1,000 people aged 15 to 64;
     219 economies hold a value, 2022 the latest year for 127; last updated 2026-04-08) and `imf-ngdp-rpch.json` (real GDP growth,
     229 economies, actuals to 2024, projections to 2031).
   - `E:/atlas/cache/no/brreg-enheter-master.json.gz` (Norway's full register of entities, May 2026, with municipality and trade
     code) and `brreg-underenheter-master.json.gz` (establishments).
   - `E:/atlas/macro/eurostat/bd_size_r3.tsv.gz` (business demography by NUTS 3 region, to 2020).
   - `E:/atlas/cache/uk/companies-house-accounts/` (5.5 GB, 57 daily bulk files of filed accounts, February 2026): nothing built.
   - Not usable: `E:/atlas/us/eu/eurostat/*_raw.json` are each cut off at exactly 5,000,000 bytes and do not parse;
     `E:/atlas/cache/{fr,it,es,pl,de}` are empty; the StatCan zips in `E:/atlas/us/ca/statcan/` are financial tables and exchange
     rates, not business counts by city.
7. **The catalog collections** (`data/catalog/collections_v1.json`, drawn by `src/components/extremes/CatalogCollections.tsx` on
   /extremes). Generated in August from `page-data/derived/atlas_facts.csv`, which is the shard data above. "Cheap to run, light to
   tax" lists Vanuatu at 1.0 percent tax and Iran at $661 labour cost; "Growing fastest" is the modeled demand growth (Indian
   cities all 8.5 to 9); "What the trade itself keeps" ranks trades by net margin and four of its top five read exactly 25.2,
   which reads as a ceiling, not four measurements; "Districts on the way down" is empty. **None of it may reach the home.**
8. **The /extremes leaderboards** (`src/lib/extremes/leaderboards.ts`, DATABASE reads). The take-home boards rank one trade across
   US STATES (not cities) on the modeled take-home estimator; the density boards read the 15-city slate; the startup and break-in
   boards pool (activity, city) pairs into one ranking, which is business against geography and breaks his first comparison rule.
9. **Indexing** (`src/lib/seo/indexable.ts` over `data/seo/floor_census.json`, written 2026-10-05). Every UK page indexes. All 194
   country pages and every how-to page are at their floor; 42 of 245 city pages are. In: New York 17 blocks, Los Angeles 16, Paris
   16, Rome 16, Raleigh, Charlotte, Nashville, Buffalo, San Francisco, Pittsburgh, St. Louis, Cleveland. Out (15 against a floor
   of 16): Austin, Calgary, Oslo, Atlanta, Phoenix, Detroit, San Jose, Las Vegas, Orlando. A section may link to an unindexed
   page; it should know it is doing so.

## 3. The thirteen ideas

### 1. Section for the deep techniques used to derive data

**What backs it (local, all of it):** the registers' ledger `E:/atlas/registers/uk/tables/ledger.json` (14 kinds of figure, each
counted or worked out, with `how`, `leaves_out`, licence and date; the source of About the figures); the estimators in
`E:/atlas/registers/uk/estimators/` (`banded.py`: a median read from the official counts by turnover band, on a log scale inside
the band, with the range the rounded counts allow; `rates.py`: Wilson and Garwood intervals, the ten-case publication rule, Holm;
`survival.py`: survival on the latest year's closure rates with Greenwood intervals); the name match of insolvency notices to the
register (`company_failures_by_trade.json` `match`: 31,926 notices, 30,510 names matched, 1,137 unmatched); the law engine
(`src/lib/uk/law/take_home.ts`, the UK's 18 percent worked out from the rules); the provenance stamps every figure carries
(`src/lib/spine/provenance.ts`, the four kinds: counted, worked out, looked up, estimated); the pages
`src/app/(site)/methodology/page.tsx` and `src/app/(site)/about-data/page.tsx` (About the figures, with `#sources` from
`src/lib/spine/uk_sources.ts`).

**The honest form:** not a measure; a technique is shown by the figure it produced, each a door to its page. For example: "a year
of insolvency notices, matched by name to the register" over 28.9 (restaurants, per 1,000 companies); "takings read from the
official counts by turnover band" over London restaurants' GBP 281.9K; "tax worked out from the rules" over 18 percent. Three
cards at most, one line each.

**Rules it meets or breaks:** the word "deep" is a boast; the title says what the reader gets ("How a figure is made"). No source
agency on the card (R-002: names live on About the figures only; `scripts/lib/agency_tokens.ts`). This is the home's one place to
say how numbers are made, which the copy ruling allows once per page.

**Places:** not applicable. **Verdict: BUILD WITH WORDING CHANGE**, merged with 2 and 3 into one quiet section.

### 2. Section for unmatched archival capability, "show off basically"

**What backs it:** the same registers and the raw archives in section 2.6. Honest counts exist only as distinct records: 31,926
notices read; about 81,700 London food businesses with their ratings (`london_food_by_borough.json`, the 33 authorities); 430
stations (`london_station_footfall.json`); 24 months of company formations (`formations_by_month.json`).

**Why DROP as worded:** "unmatched" is a claim no figure can prove. On 2026-10-07 the home's counts band left because its counts
took in pages a visitor cannot reach (the comment at the foot of `home_answers.ts`). The traps are known: summing
`uk_live_companies` across the 137 trades gives 4,274,057, which double counts every company carrying several trade codes (the
formations table's own caveat); `regional_cells + extrapolated_cells` counts slots, not facts (`src/lib/coverage/report.ts`). And
the biggest archives on disk (5.5 GB of filed accounts, the US census files) feed no page, so naming them would show off what the
site cannot show.

**Verdict: DROP as worded.** Its honest half (what was read, counted from distinct records, each figure dated) is one line of the
section in idea 1.

### 3. Section for the global coverage

**What backs it:** `src/lib/coverage/report.ts` over `data/quality/coverage_v2.json` (95 countries hold classified cells, 366,793
cells; Australia 80,728, the US 80,448, Mexico 54,277, Spain 14,502, the UK 13,462: the five hold two thirds, the ledger's
`topFiveShare` in `src/lib/home/atlas_ledger.ts`, still built, no longer drawn); `src/lib/seo/indexable.ts` and the floor census
(194 country pages, 42 city pages outside the UK, every UK page); the /coverage page.

**The honest measure:** pages a visitor can reach, split by kind: the UK counted from official records, the rest estimates. This is
exactly the "say so once" line his rule asks for, so it belongs in the same section as idea 1, not as a map of its own.

**Rules:** counts must be of reachable pages, never cells or slots; the /countries ruling (flag and name only, North America and
Europe first) applies to any list of countries it shows.

**Verdict: BUILD WITH WORDING CHANGE**, as one line or one small card inside idea 1's section.

**Not built (2026-10-08):** the owner called the home's 195 counter wrong on 2026-10-07; the home prints no count of countries.

### 4. High tax burdens in global cities: NYC, London, LA

**What backs it:** the UK only. `src/lib/spine/uk_tax_on_profit.ts` works out income tax and Class 4 national insurance on the
median full-time pay as a sole trader's profit: 18 percent on GBP 39,039. Everything else is a typed or modeled rate:
`smb_effective_rates.ts` (US 25 percent "Schedule C + state tax", no state, no city); `src/lib/tax/us_states_2024.json` holds
statutory rates (New York's top personal rate, NYC's 4 percent unincorporated business tax, LA's gross receipts tax at about 0.5
percent blended) but no brackets; `src/lib/finance/net_profit.ts` applies 21 percent federal plus state CORPORATE tax, a different
basis from the UK's sole-trader figure; the country shards carry a third, modeled total (UK 30.5, US 45.4).

**The honest measure:** the tax on one profit level in one currency, as a share, for a sole trader, from an engine per
jurisdiction with the city layer where the city taxes income (New York does; Los Angeles taxes receipts, not profit; London has no
city income tax, so London's figure is the UK's).

**Coverage of the named places:** 1 of 3 (London). With today's data New York and Los Angeles print the same 25 percent, which is
wrong for both, and against London's 18 the comparison mixes a law-engine figure with a typed one.

**Rules:** "high tax burden" ranks places by one measure, which is allowed only once the measure is real on every row.

**Verdict: NEEDS DATA:** a US sole-trader engine (federal brackets, self-employment tax, New York and California brackets, NYC's
resident tax and UBT). The rates exist in part on disk; the engine does not. It also overlaps the home's first answer.

### 5. Rising stars countries

**What backs it:** nothing in the site. `gdp_per_capita_growth_5y_pct` in the country profile is the fill described in 2.2; the
city "Growing fastest" collection is modeled demand growth; the coined 1-to-10 scores in the country shards (`economic_profile.*`,
built by `E:/atlas/page-data/tools/macro_snapshot.py`) are a composite in all but name.

**What exists on disk:** the IMF real growth series (`imf-ngdp-rpch.json`, 229 economies; use 2024 actuals, never the projections)
and the new-company series (8 and 9). Tested for a "risers" cut, 2017 against 2022: Canada jumps from 0.2 to 9.8 (a break in its
series, not a boom), the world's top in 2022 is the Cayman Islands at 228.7 companies per 1,000, then the Isle of Man, Estonia,
Hong Kong and Liechtenstein: registration hubs, not places where shops open. The US holds no value.

**Rules:** "rising star" is a verdict; the honest title is the measure.

**Verdict: DROP as worded.** If he wants growth, it is one figure (the economy's real growth in 2024) on the regional cuts of 8 and
9, not a section of its own.

### 6. US biggest winners and losers: top 5 and bottom 5 cities

**What backs it:** on disk, the QCEW parquet (section 2.6). Read for this audit, one trade held (full-service restaurants, NAICS
722511, private establishments with staff), 2019 and 2023, the site's 45 US city pages, all 45 matched:

| More restaurants | 2019 | 2023 | Fewer restaurants | 2019 | 2023 |
|---|---|---|---|---|---|
| Raleigh | 1,038 | 1,264 | Buffalo | 939 | 886 |
| Charlotte | 1,994 | 2,384 | San Francisco | 5,189 | 4,919 |
| Atlanta | 4,451 | 5,179 | Pittsburgh | 1,776 | 1,714 |
| Nashville | 1,526 | 1,774 | San Jose | 1,738 | 1,698 |
| Phoenix | 2,435 | 2,828 | St. Louis | 2,030 | 1,989 |

(ranked here by the share added, which a page would never print; ranked by count added, New York and Los Angeles enter. The design
picks one order and says it.)

**The honest measure:** one trade's count of establishments, two absolutes a row, never a percent (PART 9 clause 15). "Winners and
losers" becomes the question ("Where restaurants grew in number"). Another trade or all trades works the same way (the all-trades
total needs the raw singlefiles, since the parsed set has no total row).

**Places:** all 45 hold it; seven of the ten above have indexed pages (Atlanta, Phoenix and San Jose do not).

**Rules and risks:** counted, not estimated, so its line says counted. The US city pages print a modeled restaurant figure from the
shards (Austin's shard: 5,700 restaurant firms; the 2022 census counts 1,651 full-service restaurants in Austin's metro). Same word,
two definitions: the home's label must name the narrower thing ("full-service restaurants with staff"), or the city pages adopt the
counted figure first. The /extremes take-home boards are states and modeled, so they cannot stand in.

**Verdict: BUILD WITH WORDING CHANGE**, after one export from the parquet into `data/` (the prebuild chain never reads the network).

### 7. Mid-tier city opportunities: Leeds, Austin, Lublin, Malaga

**What backs it:** for the UK, the ONS workbook on disk (Table 5.1a, the 2019 births and their survival, every local authority).
Read for this audit, of 100 firms born in 2019 still trading in 2024:

| City | Born 2019 | Still trading after five years, of 100 |
|---|---|---|
| Leeds | 3,890 | 41.8 |
| Glasgow | 3,275 | 40.2 |
| Edinburgh | 2,590 | 39.6 |
| Bristol | 2,725 | 38.9 |
| London | 88,550 | 38.2 |
| Manchester | 4,380 | 33.9 |
| Birmingham | 7,430 | 29.7, starred by the publisher: over 500 businesses at one postcode |

The UK row (38.4) is the figure the home's ring already prints (`data/sections/survival.json`, the same release), so the section
agrees with the page it sits on. Birmingham's star is the City of London's case (mass registration addresses), which the site
already refuses to rank, so it is held out or shown unranked.

Austin: no site figure that is counted (its city page is shard data and below its indexing floor); on disk, the QCEW and 2022
census figures of idea 6. Lublin and Malaga: not in `data/cities/city_list_v1.json`, no shard, no page, no slug. Malaga exists only
as a modeled "market index 14" line inside the Spain country file. On disk, Eurostat's NUTS 3 demography covers Malaga PROVINCE
(ES617, 86,868 active firms in 2020) and the Lublin SUBREGION (PL814, 32,559), regions not cities, and it ends in 2020.

**The honest measure:** survival of new firms, one source and one cohort, within one country. "Opportunity" is a verdict; four
cities in four countries on one scale is not like for like.

**Verdict: BUILD WITH WORDING CHANGE for the UK's seven cities** (one export from the workbook, the same pipeline that exported
London's boroughs). Leeds earns its mark by leading a measured ranking, which is the reason his featuring rule asks for. Austin:
only through idea 6's measure. **Lublin and Malaga: NEEDS DATA** (city pages and a current source; nothing on disk is a city).

### 8. LATAM gems

**What backs it:** on disk, the new-company series (2.6), not yet in the site. New limited companies a year per 1,000 people aged
15 to 64, 2022: Chile 10.8, Costa Rica 5.8, Brazil 5.1, Peru 4.7, Panama 4.6, Uruguay 3.1, Jamaica 2.3, Colombia 2.3, Mexico 0.9,
Paraguay 0.7, Honduras 0.5. Older years only: Argentina 0.20 (2018), Dominican Republic 1.45 (2018), Guatemala 0.77 (2021),
Bolivia and El Salvador (2020). None: Ecuador, Nicaragua.

**The honest measure:** that one figure, one year (2022), with a floor of population to keep registration hubs out, and the one
caveat said once (it counts limited companies, not sole traders). Flags and names, as his /countries ruling asks.

**Rules:** "gems" is a verdict; the title is the question ("Where most new companies open"). Never the site's own Latin American
figures, which are interpolated for every country but Argentina, Brazil, Chile, Colombia, Mexico and Peru.

**Places:** of the 18 checked, 14 have a 2020 to 2022 value and 11 have 2022. All link to indexed country pages.

**Verdict: BUILD WITH WORDING CHANGE** after one export.

### 9. Best of Africa (countries)

**What backs it:** the same series, 2022: South Africa 11.1, Mauritius 9.6, Botswana 8.7, Morocco 2.6, Tunisia 1.7, Zambia 1.6,
Ghana 1.3, Senegal 1.3, Cote d'Ivoire 1.2, Nigeria 1.2, Namibia 0.8, Ethiopia 0.5, Egypt 0.3. Older only: Kenya 1.62 and Rwanda
2.13 (2020), Tanzania and Uganda (2018). None: Cameroon.

**Rules:** "best" is a verdict. The site's African figures are interpolated for 45 of 47 countries (growth 1.7 percent nearly
everywhere), so nothing from them ranks. His 2026-10-07 words about /countries ("starting with Africa was a catastrophic error")
are about that page's order; on the home, an Africa cut should not lead and works best as a second tab of idea 8.

**Verdict: BUILD WITH WORDING CHANGE**, as idea 8's second cut (one section, one measure, two regions).

### 10. Restaurants in 4 major cities: Rome, Paris, NYC, London

**What backs it:**
- London, counted, on the site: 7,865 licensed-restaurant firms (SIC 56101), the middle one takes GBP 281.9K a year
  (`turnover.json`; England 28,360 firms, GBP 252.1K); 28.9 insolvencies a year per 1,000 UK restaurant companies (`failures.json`,
  43,634 live companies); hygiene by borough (the kitchens item already on the home).
- New York, counted, on disk only: the 2022 census, 19,360 full-service restaurants in the metro, $1.56M receipts per restaurant
  on average; QCEW counts 2019 to 2023.
- Paris and Rome: nothing counted anywhere on disk. The cells resolve to filled anchors (withheld by the trust gate); Rome is not
  on the 15-city slate; the shards' restaurants per 10,000 (Paris 24.4, Rome 27.7) are modeled beside London's 9.1; the French and
  Italian caches are empty; the Eurostat files are truncated.

**The honest measure:** each city's own counted figure, side by side, never on one scale: London's is a median of VAT turnover read
from band counts, New York's a mean of gross receipts per establishment; they are different statistics in different currencies.

**Verdict: NEEDS DATA for Paris and Rome.** A London and New York pair is buildable (one export for New York). Overlaps the duel
(restaurants top the failure list), the kitchens and the London trades answer.

### 11. Hotels in 6 cities

**What backs it:**
- London's boroughs, counted, ON THE SITE now (`turnover.json` `hotels-lodging`, SIC 55100, a code shared with guest houses, so it
  prints under "hotels and similar accommodation"): Westminster 565 hotels, the middle one takes GBP 1.55M a year; Kensington and
  Chelsea 135, GBP 1.30M; City of London 80, GBP 1.41M; Lambeth 90, GBP 1.26M; Camden 155, GBP 0.77M; Hillingdon 75, GBP 1.68M;
  London 1,920, GBP 787K; England 7,790, GBP 434K. UK hotels: 9.3 insolvencies a year per 1,000 companies. The food hygiene
  register counts 971 hotel and guest-house kitchens in London (Westminster 263).
- Six US metros, counted, on disk (the 2022 census, sector 72, hotels NAICS 721110, receipts per hotel): New York 1,610 hotels,
  $8.3M; Los Angeles 1,736, $6.8M; Las Vegas 198, $8.8M; Orlando 513, $17.1M; San Francisco 713, $6.5M; Austin 383, $6.2M. Boston,
  Chicago, Miami and Washington have their receipts withheld by the publisher.
- Not usable: `tourist_arrivals_m` in the city list is a fill (Atlanta, Austin, Baltimore, Charlotte all 13.4M; Lyon and Marseille
  20M against Paris 19M).

**The six cities the data holds best:** New York, Los Angeles, Las Vegas, Orlando, San Francisco, Austin (the six large metros
with published 2022 hotel receipts). London is held deeper than any of them, at borough level.

**Rules:** never London against the US on one scale (median of VAT bands against mean receipts). One trade across places: like for
like inside each set.

**Verdict: BUILD WITH WORDING CHANGE:** London's hotel boroughs now, from data the site holds; the six US metros after one export.

### 12. Industries possibilities: default rate leaders, cash flow masters, context dependent

**What backs it:** the feed. `fail-most` (insolvencies a year per 1,000 live companies, UK, 76 trades over the floor of 10, middle
6.1; restaurants 28.9, dental practices 1.3) is LIVE as the duel. `last-longest` (of 100 new firms, still trading after five years,
36 trade groups, UK: medical and dental 67.4, office support 8.8), `takings`, `youngest` and `new-companies` are ready beside it.

**Cash flow masters:** no cash measure exists in the site. The 243 trade shards hold margins (unverified: the 57.4 percent hit
rate), payback and seasonality, all modeled; no receivable days, deposits or terms. On disk, 5.5 GB of filed accounts could give
cash at bank and debtors by trade for small companies, but most micro-entity accounts file no profit and loss, so no ratio to
turnover; nothing is built.

**Context dependent:** not a measure.

**Rules:** his 2026-06-11 rule bars ranking whole industries against each other; his 2026-10-05 ruling on PARKED P36.2 chose the
duel of trades within the UK on a counted measure. So: counted measures, one place held, no adjectives ("leaders", "masters").

**Verdict:** default rates **BUILT** (the duel); its pair `last-longest` buildable now from the feed; cash flow **NEEDS DATA**;
context **DROP**.

### 13. Underserved realities: six cities short of businesses (Calgary, Tromso)

**What backs it:**
- Tromso: no page, no shard. On disk, Norway's register: read for this audit, active entities (not bankrupt, not winding up) by
  business-address municipality: Oslo 191,637, Bergen 54,837, Trondheim 38,785, Stavanger 27,279, Tromso 13,655, Bodo 8,461; food
  and drink service (NACE 56): Oslo 3,267, Bergen 809, Trondheim 632, Stavanger 524, Tromso 203. Population is not on disk; with
  rough outside figures (Tromso about 79,000, Bergen 291,000, Trondheim 215,000, Stavanger 149,000) Tromso holds about 173
  entities per 1,000 residents against Bergen's 188, Trondheim's 181, Stavanger's 183. In line, not short.
- Calgary: no counted figure on disk (the StatCan zips are financial tables). Its shard says 362.5 businesses per 10,000, tagged
  held, beside Toronto's 450 and Montreal's 466 tagged modeled: not comparable tags, and the field is the mismatched one of 2.1. Its
  page is below the indexing floor.
- The /extremes "still room" board (restaurants thinnest per resident across the 15-city slate) is a database read on that same
  slate, mixing countries.

**Why DROP as worded:** "culturally bland" is a verdict that badmouths places (his own 2026-06-11 rule); "due to harsh climate"
asserts a cause no figure shows; and the premise fails on the one register on disk that can test it. Cross-country (Calgary
against Tromso) is not like for like.

**What would be honest:** "fewest businesses per 10,000 residents" within one country from one register, with the populations
added: the UK's cities (active firms from the ONS workbook plus mid-year populations, not on disk) or Norway's (register on disk,
populations not). **Verdict: DROP as worded;** the within-country version NEEDS DATA (populations).

## 4. Overlaps, and the strongest home

**Overlaps with the live home:** 4 with the UK tax answer; 12's default rates with the duel; 10 with the kitchens, the duel and
the London trades answer; 7 with the UK's cities level; 1, 2 and 3 with /methodology and About the figures, and 3 with the counts
band removed on 2026-10-07. **Overlaps with each other:** 1, 2 and 3 are one section; 5, 8 and 9 are one section with regional
cuts; 6 and 10 share the US restaurant data; 7 and 13 are both "where firms do well or are scarce"; 11 and 10 are one trade across
places each.

**The top four** (each measured, like for like, ready on disk or on the site, and none a composite):

1. **Where new firms last, the UK's cities** (idea 7, honestly). Leeds 41.8 of 100 after five years, London 38.2, Birmingham held
   out. UK-first, agrees with the home's own 38 ring, links to indexed pages, gives Leeds a reason to be featured. One export. It
   pairs two-up with the UK's cities list. Candidate loud moment: Leeds's figure.
2. **Where most new companies open, Latin America and Africa** (ideas 5, 8, 9 in one). New companies per 1,000 working-age people,
   2022, flags and names, a population floor. One export. Pairs two-up with 3.
3. **Where US restaurants grew in number, and shrank** (idea 6, with 10's New York thread). Full-service restaurants with staff,
   2019 and 2023, top five and bottom five of 45 metros, two absolutes a row (a dumbbell, a visual kind the home does not use yet,
   which keeps clause 55). One export. Candidate loud moment: the top figure.
4. **How a figure is made** (ideas 1, 2, 3 in one). Three techniques with the figure each produced, the reachable-pages line, the
   page's one "outside the UK these are estimates", a door to /methodology. Quiet, furniture like the notebook, beside which it
   stands. No export; its counts come from distinct records.

Kept as they are: the duel (his default rates). Next in line: London's hotel boroughs (idea 11, buildable today, but it would be
a second London-borough ranked list beside the kitchens). Not now: 4 and 10 (an engine, and data for Paris and Rome), 13 as worded.

**Three loud moments:** the UK answer (lit today) plus the leads of 1 and 3, with 2 and 4 quiet. **Density:** net one level more
than today, every new level two-up ([new companies | US restaurants], [UK survival | UK cities], [how a figure is made |
notebook]); no new full-width band.

## 5. What this audit did not see

- No database read: whatever `cells_master` or `regional_cells` holds for US counties or city overlays is unseen here, so
  "NEEDS DATA" never rests on the database being empty, only on the local evidence.
- QCEW cells can be suppressed by disclosure; the ten metros above printed values in both years, but an export must carry the
  disclosure code and drop suppressed rows. The 2023 metro definitions may differ from 2019's for a few areas; all 45 codes
  matched both years.
- The Norwegian per-resident figures use populations from outside the disk and are a test of the premise, not a publishable figure.
- The new-company series counts limited companies only, so it cannot see sole traders, which is most small firms in Latin America
  and Africa; it says nothing about informal businesses.
- Every figure quoted above was read from the file named beside it on 2026-10-08; none was typed into the site.
