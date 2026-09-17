# VERIFICATION of the `held` tag on the trade shards, on a sample. 2026-09-18.

Plan step 47 (`design/loop/build/plan-2026-09-17/05-DATA-AND-LAUNCH.md`): the 243 shards in `data/facts/industry/<trade>.json` tag rows `held`, `modeled` or `placeholder`. MODEL.md PART 9 clause 47 (R12) says held is a tag, not a verification. This file is the verification, on a sample drawn by a rule written down before any value was looked at. It is documentation, not page copy: the source names below never reach a page (the source-agency gate, `scripts/verify_no_source_agencies.ts`, walks `src/` only, `.ts` and `.tsx`, with `ROOT = resolve(process.cwd(), "src")`; the two page-body checks in `scripts/audit/comprehensive_qa.ts` read rendered pages; nothing enumerates `data/facts/` as a folder, so this file is read by no loader).

## The result, first

- Sampled: 20 shards, 146 rows (the rule asked for ten a shard; eleven of the twenty hold fewer than ten numeric held rows and one holds none, so 146, not 200).
- Verifiable at all: 68 of 146. The other 78 (53.4 percent) have no named, dated, public source with data behind them for that quantity within the searches listed under each family, or are coined scores no source can define.
- Hit rate over the verifiable rows: 39 hits, 29 misses, **57.4 percent**. The stated floor is 80 percent of verifiable rows. Below the floor.
- **The consequence: every shard figure stays marked modelled on every page until the data track raises the rate.** That is what the pages do today under R12 (MODEL.md PART 9 clause 47, and the `00 take` and `11 easiest` rows of PART 8), so this confirms the current state rather than changing it.
- Caveat on the sample itself: only these twenty shards and 146 rows were checked; the rate says nothing row by row about the other 223 shards, only that the tag cannot be trusted as a class.

## What was verified against what

The `held` tag is set per block, not per row, and the block's own `_meta.method` prose sometimes says a row inside it is modelled ("outlet density modeled", "swing magnitude modeled", "interpolated the earlier years", "trimmed slightly to add a bancassurance line"). The tag's stated meaning (`page-data/tools/industry_specs.py`: "HELD = a value confirmed by >=2 independent credible sources that agree") is a claim of two sources; the `_meta.source` fields are prose, not citations, so this pass looked for ONE named, dated, public source for each sampled quantity and judged the row against it.

Judging conventions, fixed before the first verdict:
1. HIT: the shard value sits inside the source's stated range, or within 20 percent (relative) of its point figure. MISS otherwise, with both figures. UNVERIFIABLE: no named, dated, public source with data behind it for that quantity, within the searches listed.
2. The quantity compared is the one the shard's own `_meta.source` names (a sector, a class, a trade). Where it names a sector ("retail-trade survival"), the sector figure is the comparator. Where it names the trade, the finest class containing the trade with at least 100 units; where that is a two-digit sector, the row says "broad class".
3. A coined score (0 to 100 trend index, compliance burden) has no external definition and cannot be matched: UNVERIFIABLE by definition. Likewise `fixed_pct`, `variable_pct` and `breakeven_utilization_pct`, which no survey measures.
4. A vendor's report counts as a source only if it states its data basis (n transactions, n firms, its own platform data). A page that cites nothing is not a source, whatever it asserts.
5. The shard carries no geography; the source's geography is recorded on every row. Most comparators are US; survival is UK.
6. BLS (bls.gov) is geo-blocked from this network (HTTP 403 by fetch, curl and the browser pane), and api.census.gov now demands a key, which this pass could not create; US survival used the ONS equivalent, US counts came through data.census.gov's own table API in the browser pane.
7. For a low/high pair of sale multiples, `multiple_low` is judged against the source's lower quartile and `multiple_high` against its upper quartile, same basis (SDE or EBITDA). Where a source publishes only a median, the shard's band is judged as a whole (band-level, flagged).

## The sample rule, written before any value was read

SHARD RULE: the 243 files of `data/facts/industry/` sorted by filename in byte order, numbered 1 to 243; take position 6 + 12k for k = 0 to 19 (6, 18, 30, ... 234).

ROW RULE: within a shard, the frame is its `held` rows whose value is a number (a name, a basis word, a role title, a cost band or an inspections string carries no quantity that can hit or miss; they are left out and counted). Frame rows are numbered 1 to n in the file's own order. Take positions p_i = 1 + floor((i - 1) * n / 10) for i = 1 to 10, so the ten span the shard's blocks instead of clustering in its first block. If n is 10 or fewer, take all n and say so.

The draw script is `scratchpad/step47/draw_sample.py`; its output, `scratchpad/step47/sample.md`, was written before the first search. The working table with every URL is `scratchpad/step47/verification.md`; this file carries the same 146 verdicts.

## The twenty shards

| position | shard | held rows | string rows left out | numeric frame n | rows taken |
|---|---|---|---|---|---|
| 6 | appliance_repair | 22 | 9 | 13 | 10 (stride) |
| 18 | barbershops | 27 | 6 | 21 | 10 (stride) |
| 30 | brow_lash_studios | 42 | 15 | 27 | 10 (stride) |
| 42 | chicken_shops | 16 | 5 | 11 | 10 (stride) |
| 54 | cosmetics_shops | 12 | 3 | 9 | 9 (all) |
| 66 | doctors_clinics | 17 | 5 | 12 | 10 (stride) |
| 78 | equipment_rental | 6 | 1 | 5 | 5 (all) |
| 90 | funeral_services | 7 | 1 | 6 | 6 (all) |
| 102 | hairdressers_beauty | 48 | 16 | 32 | 10 (stride) |
| 114 | insurance | 8 | 4 | 4 | 4 (all) |
| 126 | locksmiths | 6 | 1 | 5 | 5 (all) |
| 138 | motion_picture_recording | 0 | 0 | 0 | 0 (none held) |
| 150 | other_transport_mfg | 6 | 1 | 5 | 5 (all) |
| 162 | petroleum_coal_mfg | 19 | 6 | 13 | 10 (stride) |
| 174 | primary_secondary_schools | 25 | 9 | 16 | 10 (stride) |
| 186 | roofing_services | 15 | 5 | 10 | 10 (all) |
| 198 | sole_accounting | 7 | 1 | 6 | 6 (all) |
| 210 | tanning_salons | 1 | 0 | 1 | 1 (all) |
| 222 | tutoring_centers | 6 | 1 | 5 | 5 (all) |
| 234 | wedding_planning | 20 | 6 | 14 | 10 (stride) |

Total 146.

## Totals over the 146 rows

| family | rows | HIT | MISS | UNVERIFIABLE |
|---|---|---|---|---|
| A survival | 9 | 7 | 2 | 0 |
| B sale multiples | 18 | 11 | 7 | 0 |
| C margin ladders | 32 | 8 | 15 | 9 |
| D cost structure | 42 | 5 | 1 | 36 |
| E demand | 19 | 1 | 2 | 16 |
| F licensing | 9 | 1 | 2 | 6 |
| G competition | 2 | 0 | 0 | 2 |
| H channel mix | 9 | 4 | 0 | 5 |
| I seasonality | 6 | 2 | 0 | 4 |
| all | 146 | 39 | 29 | 78 |

Hit rate over verifiable rows: 39 / 68 = 57.4 percent. Unverifiable share: 78 / 146 = 53.4 percent. Floor: 80 percent. Below the floor. (Counted by machine over the verdict column; a first hand tally read 40 and 28 and was wrong.)

## The misses' pattern, for the data track

1. **Net margins run low, and were never measured.** Seven of the nine net-margin rows checked missed and an eighth sits on the rule's edge; every miss but chicken shops sits 25 to 40 percent UNDER the sector median of private businesses that sold (DealStats 2023). The spec that produced the shards (`page-data/tools/industry_specs.py`) hands the researcher "ANCHOR margins" and tells it to "re-state" them, so a held ladder is an anchor that survived a range check, not a figure anyone measured. Shards: appliance_repair, chicken_shops, cosmetics_shops, equipment_rental, funeral_services, locksmiths, tutoring_centers. (The comparator population, businesses that transacted, skews profitable; the direction of the gap is still one-sided.)
2. **Gross margins on a "direct cost" basis have no public comparator.** Nine of the ten gross-margin rows in service trades are UNVERIFIABLE; the one goods trade checked (cosmetics, 55 against retail's 42) missed, and chicken shops' 42 uses a definition no source uses.
3. **Sale multiples miss in both directions.** Seven of eighteen: roofing (2.5 to 4.0 against construction's 1.81 to 3.13 quartiles), equipment rental's low end, accounting's high end overstate; funeral homes (2.0 to 3.5 against 3.06 to 5.06) understate by a third; the schools' 4 to 7 times EBITDA is a mid-market figure put on a small school (sector median 3.0).
4. **Constructs wear the tag.** Twenty-nine rows are `fixed_pct`, `variable_pct`, `breakeven_utilization_pct`, a trend index or a compliance score: modelling constructs no survey measures, all tagged held because the block is. The tag should be per row, or these rows should be tagged modelled at export.
5. **Cost lines are mostly unverifiable and one of three checkable ones missed.** Thirty-six of forty-two cost rows have no public source (NRCA, MGMA, ARA, NHBF and NAIS benchmarks are member-only; the public web is vendor pages citing nothing). Of the three limited-service lines the NRA publishes, food and labour hit and rent missed by double (10 against 5.2). Doctors' fixed share hits only because the shard lifted a 2002 trade-press line, and it lifted the 50 percent staff figure onto the wrong base (share of revenue for share of costs).
6. **Registration days miss against the one cross-country measure.** Two of three "business registration" rows (7 and 14 days) miss the Doing Business 2020 OECD high-income average of 9.0; the per-licence processing times (certificates, permits, policies) have no public survey.
7. **Demand rows are largely invented at the row level.** The wedding planner fee (4,000) is the full-service subset, not the study's 2,100 average its own method names; barber density (0.7 per 10k) matches no count the Census publishes (0.22 shops, 4.34 filers); the six trend-index numbers on every shard are a coined series.
8. **Survival is the one family that mostly holds** (7 of 9), but the two misses are the broad "retail trade" curve carried onto cosmetics shops at years three and five (72 and 58 against 51.8 and 34.5), the same class-transfer fault as the country side's formation file. A US table (BLS) could not be reached; the UK table was used.
9. **Blocks tagged held contain rows their own notes call modelled.** tanning_salons ("swing magnitude modeled"), hairdressers_beauty survival ("interpolated the earlier years"), barbershops demand ("outlet density modeled"), wedding_planning demand ("saturation modeled"), insurance channels ("trimmed slightly to add").

What the data track needs to do before any shard figure can print as held: a per-row tag (or a modelled tag on the construct rows at export), a real citation field in `_meta` (name, year, URL, definition) instead of prose, and a re-anchoring of the net-margin ladders on a measured source, starting with the 17 shards item 61 already names.

## The 146 rows, by family, each with its source and verdict

The sections below are carried verbatim from the working table. "off" is the relative distance from the source's point figure. Source URLs are kept here because this is documentation; none of them is page copy.

## A. Survival (9 rows)
Source: Office for National Statistics, "Business demography, UK: 2024", Table 4.2 (broad industry) and Table 5.2a (SIC group), births of 2019 and their survival to 2024. Enterprise survival, UK. Released 20 Nov 2025. URL: https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/datasets/businessdemographyreferencetable (file businessdemographyexceltables2024.xlsx, downloaded 2026-09-18).
Figures (2019 births): Retail (SIC 47) 1y 94.3, 3y 51.8, 5y 34.5. SIC 477 (specialised stores, includes 47.75 cosmetics) 1y 93.9, 3y 66.3, 5y 50.1. Production 1y 94.2, 3y 56.3, 5y 41.1. SIC 30 (other transport equipment, 275 births) 1y 92.7, 3y 47.3, 5y 29.1. SIC 19 (refined petroleum) 5 births, unusable. SIC 960 (other personal services, includes 96.02 hairdressing, 6,755 births) 1y 94.7, 3y 70.5, 5y 51.4.

| shard | row | shard value | comparator (shard's own definition) | source figure | verdict |
|---|---|---|---|---|---|
| cosmetics_shops | survival.yr1_pct | 84 | "retail-trade establishment survival": Retail SIC 47 | 94.3 | HIT (10.9% off) |
| cosmetics_shops | survival.yr3_pct | 72 | Retail SIC 47 | 51.8 | MISS (72 vs 51.8; finest class 477 gives 66.3, which would be a hit) |
| cosmetics_shops | survival.yr5_pct | 58 | Retail SIC 47 | 34.5 | MISS (58 vs 34.5; class 477 gives 50.1, which would be a hit) |
| other_transport_mfg | survival.yr1_pct | 80 | "manufacturing establishment survival": Production | 94.2 | HIT (15.1% off) |
| other_transport_mfg | survival.yr3_pct | 62 | Production | 56.3 | HIT (10.1% off; class SIC 30 gives 47.3, a miss) |
| other_transport_mfg | survival.yr5_pct | 48 | Production | 41.1 | HIT (16.8% off; class SIC 30 gives 29.1, a miss) |
| petroleum_coal_mfg | survival.yr3_pct | 60 | "manufacturing survival tables": Production (SIC 19 has 5 births) | 56.3 | HIT (6.6% off) |
| petroleum_coal_mfg | survival.yr5_pct | 47 | Production | 41.1 | HIT (14.4% off) |
| hairdressers_beauty | survival.yr5_pct | 49 | "personal-care service five-year survival": SIC 960 | 51.4 | HIT (4.7% off) |

A: 7 HIT, 2 MISS, 0 UNVERIFIABLE. Note: the shard's own method for hairdressers says year one and three were "interpolated", so the block's held tag covers interpolated rows; only yr5 was sampled here.

## B. Sale multiples (18 rows)
Rule for a low/high pair: `multiple_low` is judged against the source's lower quartile and `multiple_high` against its upper quartile, same basis (SDE or EBITDA) as the shard row. Where a source publishes only a median, the shard's [low, high] band is judged as a whole: HIT for both endpoint rows if the median lies inside the band, MISS if not (band-level verdict, flagged).
Source S1 (SDE basis): BizBuySell, "Business Valuation Benchmarks" industry pages, quartiles of sale price / seller's discretionary earnings for businesses sold on BizBuySell 2021 through 2025, US. Read 2026-09-18 via the browser pane. Pages: /learning-center/valuation-benchmarks/<slug>/ with slugs locksmith, equipment-rental-dealers, medical-practice, school, accounting-cpa-tax-practice, service-business (5,839 sold), building-construction (3,142 sold, roofing named in scope), funeral-home. Index page: https://www.bizbuysell.com/learning-center/industry-valuation-multiples/ (Q3 2021 to Q2 2026).
Sold-business SDE multiples, lower quartile / median / average / upper quartile: locksmith 1.56 / 1.99 / 2.36 / 2.68; equipment rental and dealers 2.00 / 2.58 / 3.15 / 3.80; medical practices 1.46 / 2.05 / 2.37 / 2.94; schools and education (scope names tutoring and test-prep centres and K-12 private schools) 1.56 / 2.22 / 2.58 / 2.98; accounting and tax practices 1.61 / 2.04 / 2.23 / 2.66; service businesses 1.75 / 2.38 / 2.58 / 3.13; construction 1.81 / 2.43 / 2.60 / 3.13; funeral homes 3.06 / 4.01 / 4.28 / 5.06.
Source S2 (EBITDA basis): Business Valuation Resources, "DealStats Value Index Q2 2024", Exhibit 10, median selling price / EBITDA by NAICS sector, private targets, by year (2023 column), US. Mirror copy read 2026-09-18: https://wabusinessbrokers.com/wp-content/uploads/2024/06/DealStats-Value-Index-2024-Q2-Washington-Business-Brokers.pdf (BVR's own current edition sits behind a challenge page at https://www.bvresources.com/docs/default-source/free-downloads/dvi.pdf). 2023 medians: Manufacturing 4.1 (2022: 4.2), Educational Services 3.0 (2022: 3.3), Construction 3.5, Other Services 3.4, all sectors 3.6.

| shard | row | shard value | basis | comparator | source figure | verdict |
|---|---|---|---|---|---|---|
| appliance_repair | sale_exit.multiple_low | 2.0 | SDE | S1 service businesses (no appliance-repair page; sector is the finest class), lower quartile | 1.75 | HIT (14.3% off) |
| doctors_clinics | sale_exit.multiple_low | 1.7 | SDE | S1 medical practices, lower quartile | 1.46 | HIT (16.4% off) |
| equipment_rental | sale_exit.multiple_low | 2.6 | SDE | S1 equipment rental and dealers, lower quartile | 2.00 | MISS (2.6 vs 2.00, 30% off; the shard's low is the source's median) |
| equipment_rental | sale_exit.multiple_high | 3.5 | SDE | S1 equipment rental and dealers, upper quartile | 3.80 | HIT (7.9% off) |
| funeral_services | sale_exit.multiple_low | 2.0 | SDE | S1 funeral homes, lower quartile | 3.06 | MISS (2.0 vs 3.06) |
| funeral_services | sale_exit.multiple_high | 3.5 | SDE | S1 funeral homes, upper quartile | 5.06 | MISS (3.5 vs 5.06) |
| locksmiths | sale_exit.multiple_low | 1.5 | SDE | S1 locksmith, lower quartile | 1.56 | HIT (3.8% off) |
| locksmiths | sale_exit.multiple_high | 3.0 | SDE | S1 locksmith, upper quartile | 2.68 | HIT (11.9% off) |
| other_transport_mfg | sale_exit.multiple_low | 3.0 | EBITDA | S2 manufacturing median 2023, band [3.0, 5.0] | 4.1 | HIT (band-level: median inside the band) |
| other_transport_mfg | sale_exit.multiple_high | 5.0 | EBITDA | S2 manufacturing median 2023, band [3.0, 5.0] | 4.1 | HIT (band-level) |
| petroleum_coal_mfg | sale_exit.multiple_low | 3.0 | EBITDA | S2 manufacturing median 2023, band [3.0, 5.0] | 4.1 | HIT (band-level) |
| primary_secondary_schools | sale_exit.multiple_high | 7.0 | EBITDA | S2 educational services median 2023 (3.0) and 2022 (3.3), band [4.0, 7.0] | 3.0 | MISS (band-level: the median sits below the band's floor) |
| roofing_services | sale_exit.multiple_low | 2.5 | SDE | S1 construction (roofing in scope), lower quartile | 1.81 | MISS (2.5 vs 1.81, 38% off) |
| roofing_services | sale_exit.multiple_high | 4.0 | SDE | S1 construction, upper quartile | 3.13 | MISS (4.0 vs 3.13, 28% off) |
| sole_accounting | sale_exit.multiple_low | 1.8 | SDE | S1 accounting and tax practices, lower quartile | 1.61 | HIT (11.8% off) |
| sole_accounting | sale_exit.multiple_high | 3.25 | SDE | S1 accounting and tax practices, upper quartile | 2.66 | MISS (3.25 vs 2.66, 22.2% off; the shard's "median near 2.75x" is the source's 2.04) |
| tutoring_centers | sale_exit.multiple_low | 1.5 | SDE | S1 schools and education (tutoring named in scope), lower quartile | 1.56 | HIT (3.8% off) |
| tutoring_centers | sale_exit.multiple_high | 3.0 | SDE | S1 schools and education, upper quartile | 2.98 | HIT (0.7% off) |

B: 11 HIT, 7 MISS, 0 UNVERIFIABLE. Pattern: the misses run in both directions (roofing, equipment rental and accounting overstate the band; funeral homes understate it by a third; the schools' 4 to 7x EBITDA is a mid-market figure put on a small school).

## C. Margin ladders (32 rows)
Trade-level sources found with data behind them:
- C1 National Restaurant Association, "Restaurant Operations Data Abstract", 2025 edition, 2024 data from more than 900 operators, US. Limited-service segment: median income before taxes 4.0% of sales; prime cost (food, beverage and labour) a median 65 cents per sales dollar; salaries and wages including benefits a median 31.7% of sales (30.0% among profitable operators). URLs: https://restaurant.org/research-and-media/media/press-releases/new-resource-from-national-restaurant-association-provides-insights-into-operational-realities/ and https://restaurant.org/research-and-media/research/restaurant-economic-insights/analysis-commentary/elevated-labor-costs-had-a-significant-impact-on-restaurant-profitability-in-2024/
- C2 NBOA (National Business Officers Association), "Financial State of the Industry: BIIS 5-Year Trend Report 2021-2025", 279 US independent day and boarding schools reporting every year 2020-21 to 2024-25: median operating margin 4.9% in 2024-25 (average 5.7%), down from 8.7% in 2020-21. Read through the summary at https://wallyboston.com/independent-schools-operating-model/ (May 2026) and NBOA's own article https://www.nboa.org/net-assets/article/enrollment--operating-expenses-and--the-gap--all-rose-last-year; the report itself is member-only.
- Searched and found no public figure with data behind it: MGMA (physician practice margins; overhead tables are member-only, the "60 to 70% overhead" line circulates without a table), NFDA (funeral home profit; its research page lists no financial metric), ARA "Cost of Doing Business" (member-only; the "8 to 12% average" on vendor blogs cites nothing), NHBF State of the Industry (profitability shares only, no cost ratios), Rosenberg MAP Survey (public figure is 33.1% "profit as % of revenue" for $2-10M firms, 2013 data; solo practices are outside its scope).
Sector-level fallback (finest class with data): C3 BVR "DealStats Value Index Q2 2024", Exhibits 11 to 13, median gross, operating and net profit margins of private targets by NAICS sector, 2023 column, US (same mirror URL as S2). 2023 medians, gross / operating / net: Construction 57 / 14 / 14; Manufacturing 58 / 12 / 12; Retail 42 / 11 / 11; Real estate, rental and leasing (53) 95 / 22 / 22; Professional, scientific and technical (54) 96 / 19 / 21; Administrative and support (56) 85 / 21 / 22; Educational services (61) 100 / 22 / 21; Health care (62) 99 / 15 / 15; Accommodation and food (72) 69 / 14 / 14; Other services (81) 91 / 18 / 18. Service-sector gross margins there sit at 85 to 100 because most service sellers book no cost of goods; a shard's service gross margin on a "direct cost" basis is a different definition and is UNVERIFIABLE against them.

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| appliance_repair | margin_ladder.gross_margin_pct | 50 | C3 Other services gross (no-COGS convention) | 91 | UNVERIFIABLE (definition: a service gross margin on a direct-cost basis has no public benchmark found; searched "appliance repair gross margin benchmark survey") |
| appliance_repair | margin_ladder.operating_margin_pct | 15 | C3 Other services (81, holds NAICS 8114) operating, broad class | 18 | HIT (16.7% off) |
| appliance_repair | margin_ladder.net_margin_pct | 10.8 | C3 Other services net, broad class | 18 | MISS (10.8 vs 18) |
| barbershops | margin_ladder.operating_margin_pct | 20 | C3 Other services (81, holds 812111) operating, broad class | 18 | HIT (11.1% off) |
| brow_lash_studios | margin_ladder.operating_margin_pct | 22 | C3 Other services (81, holds 812112) operating, broad class | 18 | MISS (22 vs 18, 22.2% off) |
| chicken_shops | margin_ladder.gross_margin_pct | 42 | C1 limited-service median food and non-alcohol beverage cost 32.4% of sales (D1), so a standard gross margin near 67.6; C3 Accommodation and food gross 69 | 67.6 to 69 | MISS (42 vs 67.6; the shard's own note defines gross after packaging, waste and prep loss, a definition no source uses) |
| chicken_shops | margin_ladder.operating_margin_pct | 10 | C1 publishes no operating margin; C3 Accommodation and food operating | 14 | MISS (10 vs 14, 28.6% off) |
| chicken_shops | margin_ladder.net_margin_pct | 5 | C1 limited-service median income before taxes | 4.0 | MISS (5 vs 4.0, 25% off; close, outside the rule) |
| cosmetics_shops | margin_ladder.gross_margin_pct | 55 | C3 Retail gross (COGS is real in retail), broad class | 42 | MISS (55 vs 42, 31% off) |
| cosmetics_shops | margin_ladder.operating_margin_pct | 11 | C3 Retail operating | 11 | HIT (0% off) |
| cosmetics_shops | margin_ladder.net_margin_pct | 7.9 | C3 Retail net | 11 | MISS (7.9 vs 11, 28% off) |
| doctors_clinics | margin_ladder.gross_margin_pct | 60 | none: the shard's own note gives two bases (40 or 60); C3 Health care gross is the no-COGS 99 | none | UNVERIFIABLE (no source on the shard's basis; MGMA overhead tables are member-only) |
| doctors_clinics | margin_ladder.operating_margin_pct | 20 | C3 Health care (62) operating, broad class | 15 | MISS (20 vs 15, 33% off) |
| doctors_clinics | margin_ladder.net_margin_pct | 13 | C3 Health care net, broad class | 15 | HIT (13.3% off) |
| equipment_rental | margin_ladder.gross_margin_pct | 75 | C3 Real estate, rental and leasing gross is the no-COGS 95 | none | UNVERIFIABLE (ARA benchmark member-only; searched) |
| equipment_rental | margin_ladder.operating_margin_pct | 30 | C3 Real estate, rental and leasing (53, holds 532) operating, broad class | 22 | MISS (30 vs 22, 36% off) |
| equipment_rental | margin_ladder.net_margin_pct | 16.5 | C3 Real estate, rental and leasing net | 22 | MISS (16.5 vs 22, 25% off) |
| funeral_services | margin_ladder.gross_margin_pct | 50 | C3 Other services gross is the no-COGS 91 | none | UNVERIFIABLE (NFDA publishes no margin; searched) |
| funeral_services | margin_ladder.operating_margin_pct | 18 | C3 Other services (81, holds 8122) operating, broad class | 18 | HIT (0% off) |
| funeral_services | margin_ladder.net_margin_pct | 11.7 | C3 Other services net | 18 | MISS (11.7 vs 18, 35% off) |
| hairdressers_beauty | margin_ladder.gross_margin_pct | 60 | C3 Other services gross is the no-COGS 91 | none | UNVERIFIABLE (NHBF publishes no cost ratios; searched) |
| locksmiths | margin_ladder.gross_margin_pct | 60 | C3 Administrative and support gross is the no-COGS 85 | none | UNVERIFIABLE |
| locksmiths | margin_ladder.operating_margin_pct | 20 | C3 Administrative and support (56, holds 561622) operating, broad class | 21 | HIT (4.8% off) |
| locksmiths | margin_ladder.net_margin_pct | 14.4 | C3 Administrative and support net | 22 | MISS (14.4 vs 22, 35% off) |
| primary_secondary_schools | margin_ladder.gross_margin_pct | 65 | none on a "tuition less direct instruction" basis | none | UNVERIFIABLE (NBOA and NAIS publish compensation as a share of expenses, not this ratio) |
| primary_secondary_schools | margin_ladder.operating_margin_pct | 8 | C2 NBOA median operating margin 2024-25 | 4.9 (average 5.7) | MISS (8 vs 4.9; 8 is the top of the shard's own 3 to 8 range and above both the median and the average) |
| sole_accounting | margin_ladder.gross_margin_pct | 88 | none on a "revenue less staff cost" basis | none | UNVERIFIABLE |
| sole_accounting | margin_ladder.operating_margin_pct | 35 | C3 Professional, scientific and technical (54, holds 5412) operating, broad class | 19 | MISS (35 vs 19) |
| sole_accounting | margin_ladder.net_margin_pct | 25.2 | C3 Professional, scientific and technical net, broad class | 21 | HIT (20.0% off, on the rule's edge; Rosenberg's 33.1% for $2-10M firms is a different size class) |
| tutoring_centers | margin_ladder.gross_margin_pct | 72 | C3 Educational services gross is the no-COGS 100 | none | UNVERIFIABLE |
| tutoring_centers | margin_ladder.operating_margin_pct | 18 | C3 Educational services (61) operating, broad class | 22 | HIT (18.2% off) |
| tutoring_centers | margin_ladder.net_margin_pct | 13 | C3 Educational services net, broad class | 21 | MISS (13 vs 21, 38% off) |

C: 8 HIT, 15 MISS, 9 UNVERIFIABLE (machine-counted; a first hand tally said 9 and 14). Pattern: seven of the nine net-margin rows checked went MISS and an eighth sits on the rule's edge, and all but chicken shops sit on the LOW side of the sector medians of businesses that sold (25 to 40 percent under); the gross margins on a service "direct cost" basis have no public comparator at all.

## D. Cost structure (42 rows)
Sources with data behind them:
- D1 National Restaurant Association, "Restaurant Operations Data Abstract" 2025 edition (2024 data, more than 900 operators, US), limited-service medians: food and non-alcohol beverage 32.4% of sales; salaries and wages including benefits 31.7%; occupancy 5.2% (city centre 6.0, suburban 5.0, rural 3.2). URLs: https://restaurant.org/research-and-media/research/restaurant-economic-insights/analysis-commentary/restaurant-operators-kept-food-cost-ratios-in-check-in-2024/ ; https://www.restaurant.org/research-and-media/research/restaurant-economic-insights/analysis-commentary/restaurant-occupancy-costs-were-more-than-5-of-sales-in-2024/ ; the labour page under C1. Utilities are in the paid Abstract only.
- D2 Physicians Practice, "Dividing Overhead", 15 September 2002, US: "In most practices, fixed costs account for about 85 percent of the costs; staff alone generally account for 50 percent of all costs, based on an analysis of MGMA's annual Cost Survey." https://www.physicianspractice.com/view/dividing-overhead (read in the browser pane; the fetch tool gets a 403). Trade press citing a named survey, twenty-four years old.
- D3 Eurostat, Structural Business Statistics, dataset sbs_sc_ovw, NACE C19 "Manufacture of coke and refined petroleum products", EU27, 2022, by size class. Net turnover, purchases of goods and services and employee benefits expense, million euro: size 20-49 employees 2,128 / 1,964 / 129.5 (purchases 92.3% of turnover, personnel 6.1%); size 50-249 10,229 / 9,399 / 545 (91.9%, 5.3%); all sizes 717,878 / 644,747 / 13,381 (89.8%, 1.9%). Gross operating rate 8.1% (20-49), 9.2% (all). API call: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw?geo=EU27_2020&nace_r2=C19&time=2022&format=JSON&lang=EN (saved as scratchpad/step47/es_c19.json). The shard's own note names small plants, so the 20-49 class is the comparator.
- D4 NBOA, "Show Them More Than the Money", Jeff Shields, 21 July 2022, citing DASL/BIIS: "on average 63.9% of a school's operating expenses are allocated to faculty and staff compensation". https://www.nboa.org/net-assets/article/show-them-more-than-the-money . Total compensation only; no teaching-versus-administration split.
- Searched and found nothing with data behind it: NRCA financial benchmarks (member-only; every public roofing cost breakdown is a vendor page citing nothing), MGMA cost shares beyond D2 (member-only), salon and barber occupancy and card-fee shares (vendor pages citing nothing; PBA and NHBF publish no cost ratios), a source that splits a school's payroll between teaching and administration, a source for "utilities, oil and equipment" in a takeaway.
- `fixed_pct`, `variable_pct` and `breakeven_utilization_pct` are modelling constructs: no public survey reports the fixed share of a trade's costs or its breakeven utilisation, except D2's fixed share for medical practices. Every other such row is UNVERIFIABLE by definition (convention 3).

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| barbershops | cost_structure.fixed_pct | 30 | none | none | UNVERIFIABLE (construct) |
| barbershops | cost_structure.breakeven_utilization_pct | 55 | none | none | UNVERIFIABLE (construct) |
| barbershops | cost_drivers rent_and_utilities pct_of_revenue | 15 | none with data | none | UNVERIFIABLE (searched salon and barber occupancy surveys) |
| barbershops | cost_drivers other_operating pct_of_revenue | 12 | none | none | UNVERIFIABLE |
| brow_lash_studios | cost_structure.variable_pct | 60 | none | none | UNVERIFIABLE (construct) |
| brow_lash_studios | cost_drivers rent_and_utilities pct_of_revenue | 15 | none with data | none | UNVERIFIABLE |
| brow_lash_studios | cost_drivers card_fees,_marketing_and_admin pct_of_revenue | 8 | none | none | UNVERIFIABLE |
| chicken_shops | cost_structure.fixed_pct | 40 | none | none | UNVERIFIABLE (construct) |
| chicken_shops | cost_structure.variable_pct | 60 | none | none | UNVERIFIABLE (construct) |
| chicken_shops | cost_structure.breakeven_utilization_pct | 65 | none | none | UNVERIFIABLE (construct) |
| chicken_shops | cost_drivers food_and_packaging pct_of_revenue | 32 | D1 limited-service food and non-alcohol beverage (packaging sits outside the source's line) | 32.4 | HIT (1.2% off) |
| chicken_shops | cost_drivers labor pct_of_revenue | 27 | D1 limited-service salaries and wages including benefits | 31.7 | HIT (14.8% off) |
| chicken_shops | cost_drivers rent_and_occupancy pct_of_revenue | 10 | D1 limited-service occupancy (city centre 6.0) | 5.2 | MISS (10 vs 5.2; the shard's "rent target under 10%" is a ceiling, not a median) |
| chicken_shops | cost_drivers utilities,_oil_and_equipment pct_of_revenue | 6 | D1 holds utilities in the paid Abstract only | none | UNVERIFIABLE |
| doctors_clinics | cost_structure.fixed_pct | 85 | D2 fixed share of practice costs (2002, MGMA Cost Survey analysis) | 85 | HIT (0% off; year 2002) |
| doctors_clinics | cost_structure.variable_pct | 15 | D2 "the 15 percent of costs that are variable" | 15 | HIT (0% off; year 2002) |
| doctors_clinics | cost_drivers staff_and_clinician_payroll pct_of_revenue | 50 | D2 gives support staff as 50% of COSTS, not staff and clinician payroll as a share of revenue | 50 of costs | UNVERIFIABLE (different base and scope; the shard's 50 reads as a lift of D2's figure onto the wrong base) |
| doctors_clinics | cost_drivers rent_and_facility pct_of_revenue | 10 | none public (MGMA member-only) | none | UNVERIFIABLE |
| doctors_clinics | cost_drivers medical_and_office_supplies pct_of_revenue | 8 | none public | none | UNVERIFIABLE |
| doctors_clinics | cost_drivers insurance,_it,_and_admin pct_of_revenue | 9 | none public | none | UNVERIFIABLE |
| hairdressers_beauty | cost_structure.fixed_pct | 35 | none | none | UNVERIFIABLE (construct) |
| hairdressers_beauty | cost_drivers rent_and_occupancy pct_of_revenue | 12 | none with data | none | UNVERIFIABLE |
| hairdressers_beauty | cost_drivers marketing_and_card_fees pct_of_revenue | 5 | none | none | UNVERIFIABLE |
| petroleum_coal_mfg | cost_structure.fixed_pct | 30 | none | none | UNVERIFIABLE (construct) |
| petroleum_coal_mfg | cost_structure.variable_pct | 70 | none | none | UNVERIFIABLE (construct) |
| petroleum_coal_mfg | cost_structure.breakeven_utilization_pct | 78 | none | none | UNVERIFIABLE (construct) |
| petroleum_coal_mfg | cost_drivers feedstock_and_raw_materials pct_of_revenue | 58 | D3 publishes purchases of goods and services as one line: 92.3% of turnover in the 20-49 class | 92.3 (all purchases) | UNVERIFIABLE as a line; note that the shard's whole non-labour stack (58 + 8 + 10 + 5 = 81 at most) sits under the class's purchases alone |
| petroleum_coal_mfg | cost_drivers plant,_depreciation_and_maintenance pct_of_revenue | 10 | none (no such line in D3) | none | UNVERIFIABLE |
| petroleum_coal_mfg | cost_drivers labor pct_of_revenue | 7 | D3 employee benefits expense over net turnover, 20-49 class | 6.1 (50-249: 5.3; all sizes: 1.9) | HIT (14.8% off in the small-plant class; a miss against the all-sizes 1.9, which refineries dominate) |
| petroleum_coal_mfg | cost_drivers compliance,_environmental_and_insurance pct_of_revenue | 5 | none | none | UNVERIFIABLE |
| primary_secondary_schools | cost_structure.fixed_pct | 75 | none | none | UNVERIFIABLE (construct) |
| primary_secondary_schools | cost_structure.variable_pct | 25 | none | none | UNVERIFIABLE (construct) |
| primary_secondary_schools | cost_drivers teaching_and_staff_salaries pct_of_revenue | 55 | D4 gives total compensation only, 63.9% of expenses | none for the line | UNVERIFIABLE (the shard's two payroll lines sum to 67 of revenue against a measured total near 61 of revenue at a 5% margin) |
| primary_secondary_schools | cost_drivers administration_and_support pct_of_revenue | 12 | D4, no split | none for the line | UNVERIFIABLE |
| primary_secondary_schools | cost_drivers materials,_technology_and_supplies pct_of_revenue | 8 | none | none | UNVERIFIABLE |
| roofing_services | cost_structure.fixed_pct | 25 | none | none | UNVERIFIABLE (construct) |
| roofing_services | cost_structure.variable_pct | 75 | none | none | UNVERIFIABLE (construct) |
| roofing_services | cost_structure.breakeven_utilization_pct | 65 | none | none | UNVERIFIABLE (construct) |
| roofing_services | cost_drivers materials pct_of_revenue | 33 | none with data (NRCA member-only) | none | UNVERIFIABLE |
| roofing_services | cost_drivers crew_labor pct_of_revenue | 22 | none with data | none | UNVERIFIABLE |
| roofing_services | cost_drivers sales_commissions pct_of_revenue | 7 | none | none | UNVERIFIABLE |
| roofing_services | cost_drivers overhead_(office,_insurance,_vehicles,_marketing) pct_of_revenue | 27 | none with data | none | UNVERIFIABLE |

D: 5 HIT, 1 MISS, 36 UNVERIFIABLE. Pattern: seventeen of the forty-two are constructs (fixed, variable, breakeven) that no survey measures, yet every one carries the held tag; the line items that could be checked (a takeaway's food, labour and rent) came out two hits and one miss, the rent doubled.

## E. Demand (19 rows)
Sources:
- E1 Square, "Here's What Salon Pricing Looks Like Across the Country", 5 July 2017, US, Square sellers' transaction data: "In 2016, the average price of a woman's haircut in the U.S. was $45. The average cost of a man's haircut was $34." https://squareup.com/us/en/the-bottom-line/operating-your-business/salon-pricing-and-appointments-across-the-country . The one data-backed barber price found; nine years old. Squire's August 2025 table of 45 city averages ($30.40 to $54.14, mean $40.11) states no data basis and is not used as a source (https://getsquire.com/business-edge/how-do-your-barbershop-prices-compare-to-top-us-cities).
- E2 US Census Bureau, County Business Patterns 2022 (CB2200CBP) and Nonemployer Statistics 2022 (NS2200NONEMP), read through data.census.gov's own table API in the browser pane (the public api.census.gov endpoints now demand a key). NAICS 812111 barber shops: 7,363 employer establishments; 137,372 nonemployer establishments, of which 4,820 report receipts of $100,000 or more. NAICS 812112 beauty salons: 82,964 employer establishments, 823,967 nonemployer. NAICS 812990 all other personal services: 22,597 employer establishments (wedding planners are one of many trades in it). NAICS 811412 appliance repair: 5,411 employer establishments; nonemployer counts not published at this code. US population, Vintage 2022 estimate for 1 July 2022, 333,287,557 (Census Bureau release of 22 December 2022, https://www.census.gov/newsroom/press-releases/2022/2022-population-estimates.html), so 33,329 units of ten thousand.
- E3 The Knot, "How Much Does a Wedding Planner Cost?", updated 13 May 2026, citing The Knot Real Weddings Study (2026 edition, 10,474 US couples married in 2025): "the average cost of a wedding planner is $2,100"; full-service planner "about $3,800 on average" (33% of couples); day-of coordinator $1,600 (37%). https://www.theknot.com/content/how-much-do-wedding-planners-charge (browser pane; fetch tool gets a 403). Study basis: https://www.theknotww.com/press-releases/the-knot-worldwide-unveils-2026-real-weddings-study
- The trend index (six numbers, 0 to 100, "indexed to the pandemic dip and recovery") has no external definition: UNVERIFIABLE by convention 3. Lash pricing: every hit was a supplier or booking-site page citing no data.

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| barbershops | demand.spend_per_head_usd | 32 | E1 average man's haircut, US, 2016 | 34 | HIT (5.9% off; source year 2016) |
| barbershops | demand.venues_per_10k | 0.7 | E2 barber shops per 10,000 residents, US 2022: employer shops 0.22; employer plus nonemployer filers over $100,000 0.37; every filer 4.34 | 0.22 to 0.37 (shops), 4.34 (every filer) | MISS (0.7 matches no definition: three times the shop count, a sixth of the filer count; the shard's own method calls this row "modeled") |
| barbershops | demand.trend_index[1] | 70 | none | none | UNVERIFIABLE (coined index) |
| barbershops | demand.trend_index[3] | 78 | none | none | UNVERIFIABLE (coined index) |
| barbershops | demand.trend_index[5] | 92 | none | none | UNVERIFIABLE (coined index) |
| brow_lash_studios | demand.spend_per_head_usd | 90 | none with data | none | UNVERIFIABLE (searched lash pricing reports; only supplier pages citing nothing) |
| brow_lash_studios | demand.venues_per_10k | 1.2 | E2: no count isolates lash and brow studios; the containing class 812112 has 2.49 employer establishments per 10,000 | none | UNVERIFIABLE |
| brow_lash_studios | demand.trend_index[2] | 62 | none | none | UNVERIFIABLE (coined index) |
| brow_lash_studios | demand.trend_index[5] | 88 | none | none | UNVERIFIABLE (coined index) |
| hairdressers_beauty | demand.spend_per_head_usd | 55 | E1 gives the components (women's $45, men's $34 in 2016) but no blended hair-and-beauty ticket exists in any source found | none | UNVERIFIABLE |
| hairdressers_beauty | demand.trend_index[0] | 70 | none | none | UNVERIFIABLE (coined index) |
| hairdressers_beauty | demand.trend_index[3] | 86 | none | none | UNVERIFIABLE (coined index) |
| wedding_planning | demand.spend_per_head_usd | 4000 | E3 average cost of a wedding planner, all planner types, US couples married 2025 | 2,100 (full-service subset 3,800) | MISS (4,000 vs 2,100; the shard's "national average near 4,000" is the full-service third of couples, not the average its own method names) |
| wedding_planning | demand.purchases_per_year | 1.0 | none: a definitional constant, not a measured quantity | none | UNVERIFIABLE |
| wedding_planning | demand.venues_per_10k | 0.4 | E2: 812990 mixes wedding planners with many other services | none | UNVERIFIABLE |
| wedding_planning | demand.trend_index[1] | 55 | none | none | UNVERIFIABLE (coined index) |
| wedding_planning | demand.trend_index[2] | 75 | none | none | UNVERIFIABLE (coined index) |
| wedding_planning | demand.trend_index[4] | 80 | none | none | UNVERIFIABLE (coined index) |
| wedding_planning | demand.trend_index[5] | 83 | none | none | UNVERIFIABLE (coined index) |

E: 1 HIT, 2 MISS, 16 UNVERIFIABLE.

## F. Licensing (9 rows)
Source F1: World Bank, Doing Business 2020, "Starting a Business", time in days (men), data as of May 2019, from the historical dataset https://archive.doingbusiness.org/content/dam/doingBusiness/excel/db2020/Historical-data---COMPLETE-dataset-with-scores.xlsx (downloaded 2026-09-18, sheet "All Data", DB Year 2020, column "Time - Men (days)"). High income: OECD, 38 economies, mean 9.0 days, median 7.2 (the report's own published OECD high-income average is 9.2); all 213 economies mean 18.8, median 12. Examples: US 4.2, UK 4.5, Germany 8, Japan 11.15, Spain 12.5, Canada 1.5. The measure covers every procedure to register and formally operate a standard company, which is the shard's "business registration and tax number". Nothing public measures the processing time of a refrigerant certificate, a resale permit, a salon premises permit or a liability policy across developed markets; those rows are UNVERIFIABLE. The compliance-burden score is coined (convention 3).

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| appliance_repair | licences business_registration_and_tax_number typical_days | 7 | F1 OECD high income mean | 9.0 (median 7.2; published 9.2) | MISS (7 vs 9.0, 22% off; inside the median, outside the rule against the average) |
| appliance_repair | licences refrigerant_handling_certification_(sealed_systems) typical_days | 14 | none | none | UNVERIFIABLE |
| appliance_repair | licences sales_tax_or_resale_permit_for_parts typical_days | 14 | none | none | UNVERIFIABLE |
| appliance_repair | licensing.compliance_burden_0_100 | 25 | none | none | UNVERIFIABLE (coined score) |
| brow_lash_studios | licences business_registration_and_tax_number typical_days | 10 | F1 OECD high income mean | 9.0 | HIT (11% off) |
| brow_lash_studios | licences salon_establishment_or_premises_permit typical_days | 21 | none | none | UNVERIFIABLE |
| hairdressers_beauty | licences business_registration_and_sales_tax_permit typical_days | 14 | F1 OECD high income mean | 9.0 | MISS (14 vs 9.0, 56% off) |
| wedding_planning | licences seller's_permit_(if_reselling_decor_or_favors) typical_days | 1 | none across jurisdictions | none | UNVERIFIABLE |
| wedding_planning | licences professional_liability_and_general_liability_insurance typical_days | 3 | none | none | UNVERIFIABLE |

F: 1 HIT, 2 MISS, 6 UNVERIFIABLE.

## G. Competition (2 rows)

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| appliance_repair | competition.firms_per_10k_typical | 1.1 | E2: 5,411 employer establishments in 811412 is 0.16 per 10,000; the shard's definition counts single-owner firms, which the nonemployer table does not publish at this code | 0.16 (employers only) | UNVERIFIABLE (no count matches the shard's definition; the employer floor is a seventh of the shard's figure) |
| appliance_repair | competition.chain_vs_independent_share_pct | 18 | none | none | UNVERIFIABLE (no public count of chain or franchise share; searched) |

G: 0 HIT, 0 MISS, 2 UNVERIFIABLE.

## H. Channel mix (9 rows)
Sources:
- H1 NIQ (NielsenIQ), "The Beauty Category's Dynamic Growth: A 2024 Mid-Year Update", 9 August 2024, US: "In the first half of 2024, 41% of all beauty and personal care sales occurred through e-commerce platforms". https://nielseniq.com/global/en/insights/commentary/2024/beauty-2024-mid-year-update/ . NIQ's own retail measurement; no split of online between brand sites and marketplaces.
- H2 Independent Insurance Agents and Brokers of America (Big I), "2024 Market Share Report", 2023 premium data compiled from AM Best, US property and casualty: independent agents 62%, exclusive or captive agents 21%, direct sales 16% (personal lines: 39 / 35 / 25; commercial lines: independent 87%). Read via Insurance Journal, 27 June 2024: https://www.insurancejournal.com/news/national/2024/06/27/781533.htm
- Independent-school revenue shares: NAIS's State of the Independent School Sector and NBOA's BIIS reports are member-only; the "about 80 percent net tuition ratio" that circulates is a ratio to expenses, not revenue, and could not be pinned to a page. UNVERIFIABLE.

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| cosmetics_shops | channels in-store pct_of_revenue | 63 | H1: 100 less 41 online, beauty and personal care, US, H1 2024 | 59 | HIT (6.8% off) |
| cosmetics_shops | channels own_website___click-and-collect pct_of_revenue | 25 | H1 gives no split of the online 41 | none | UNVERIFIABLE (the shard's two online lines sum to 37 against 41 measured) |
| cosmetics_shops | channels online_marketplaces pct_of_revenue | 12 | H1, no split | none | UNVERIFIABLE |
| insurance | channels independent_agents_and_brokers pct_of_revenue | 55 | H2 independent agency share of P&C premiums, 2023 | 62 | HIT (11.3% off) |
| insurance | channels captive_and_tied_agents pct_of_revenue | 22 | H2 exclusive or captive agents | 21 | HIT (4.8% off) |
| insurance | channels direct_to_customer_(branch,_phone,_online) pct_of_revenue | 18 | H2 direct sales | 16 | HIT (12.5% off) |
| insurance | channels bank_and_affinity_partners pct_of_revenue | 5 | H2 reports no bank channel; its three channels leave 1 | none | UNVERIFIABLE (the shard's own method says this line was added by trimming the others) |
| primary_secondary_schools | channels tuition_and_enrollment_fees pct_of_revenue | 83 | none public | none | UNVERIFIABLE |
| primary_secondary_schools | channels auxiliary_services_(meals,_transport,_care) pct_of_revenue | 6 | none public | none | UNVERIFIABLE |

H: 4 HIT, 0 MISS, 5 UNVERIFIABLE.

## I. Seasonality (6 rows)
The shard defines `swing_pct` only as "peak-to-trough revenue swing" (page-data/tools/industry_specs.py), with no base stated. Computed here as (peak minus trough) over peak, using the shard's own named peak months against the published trough, with the month-level reading recorded beside it.
Sources:
- I1 CDC/NCHS, "Weekly Counts of Deaths by State and Select Causes, 2014-2019" (data.cdc.gov dataset 3yf8-kanr, all-cause deaths, United States), 2015 to 2019 weeks: December to February mean 57,691 a week against June to August 50,404, a swing of 12.6% of the winter level (14.5% of summer); peak month January 59,324 against trough August 49,982, 15.7% of peak. API call saved as scratchpad/step47/cdc_weekly.json.
- I2 The Knot, "When Is Wedding Season?", updated 11 May 2026, Real Weddings Study (10,474 couples married 2025): October and June 16% of weddings each, May 14%, September 13%, August 10%, December 1%; May through October 76%, November through April 24%. https://www.theknot.com/content/is-there-an-off-season-for-weddings
- I3 US Census Bureau, Quarterly Services Survey, Q4 2025 release, Table 1c (not seasonally adjusted), NAICS 5412 accounting, tax preparation, bookkeeping and payroll services, employer firms, revenue in millions: 1Q 2025 63,293; 2Q 55,521; 3Q 51,185; 4Q 49,867 (p): a 21% quarterly swing of peak. https://www2.census.gov/services/qss/2025/all_2025Q4.xlsx . NAICS 8121 is suppressed in the same table.

| shard | row | shard value | comparator | source figure | verdict |
|---|---|---|---|---|---|
| funeral_services | seasonality.swing_pct | 15 | I1 winter-versus-summer death swing, US 2015-2019 | 12.6 (season means) to 15.7 (peak month) | HIT (4.5% off the month reading, 19% off the season reading) |
| hairdressers_beauty | seasonality.swing_pct | 25 | none: no monthly revenue series for salons; I3's 8121 row is suppressed | none | UNVERIFIABLE |
| roofing_services | seasonality.swing_pct | 50 | none with data (NRCA member-only) | none | UNVERIFIABLE |
| sole_accounting | seasonality.swing_pct | 55 | I3 is quarterly and covers every employer firm in 5412, not a tax-led solo's months | 21 (quarterly, all firms; context only) | UNVERIFIABLE (different granularity and population; the sector's quarterly swing is a floor, not the row's quantity) |
| tanning_salons | seasonality.swing_pct | 55 | none; the block's own method says "swing magnitude modeled" | none | UNVERIFIABLE |
| wedding_planning | seasonality.swing_pct | 60 | I2: the shard's named peak months (May, June, September, October) average 14.75% of weddings a month; the published off-season averages 4% a month | 72.9 (peak month against December alone: 94) | HIT (17.7% off on the season reading; a miss on the month reading, so definition-sensitive) |

I: 2 HIT, 0 MISS, 4 UNVERIFIABLE.
