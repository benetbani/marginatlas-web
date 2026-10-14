# R7. A business costs simulator: what exists, what it needs, what to build

The owner's ask, 2026-10-13, verbatim: "A page of the website should be related to business costs simulator where the user picks
country, city, number of employees, rent, blah blah and we calculate his costs, and breakeven revenue for profit. Super detailed
and chic."

How this was read: every website file on `main` (c35e42a7) through `git show` and `git grep`, so line numbers are main's. No
render, browser, network or database. Free memory stood at 520 MB, under the 1000 MB floor, so no Node script ran: every count
below is a `git grep` count over main's files. Paths are relative to `E:/atlas/website` unless they start with `E:/atlas/`.

## 0. The short answer

- A break-even tool exists, /calculator, but its break-even is a fixed fraction of the revenue the reader types, so it cannot
  tell anyone whether a business pays, and it answers for 16 trades only (section 1).
- The levers that compute in the browser (a hire's all-in cost, a loan's month, insurance covers) live on /gb alone.
- The data holds most ingredients for 252 cities as estimates (shop rent, five wages, permits, fit-out, deposit), taxes per
  country, and register and law grade for London and England (section 2).
- The engine composes in the UK: `src/lib/uk/pnl/model.ts` already turns money costs into break-even and keeps after tax.
  Elsewhere every engine starts from revenue and two hide losses, so the world needs one new pure engine (section 3).
- Recommended: rebuild /calculator as the simulator (same address, no rename). Honest world-wide version M, full version L.
  Six gaps need a download and the owner's word (sections 4 and 5).

## 1. What exists

| Surface | What it computes | From which data | Where | Linked from | Browser? |
|---|---|---|---|---|---|
| /tools | Nothing: three cards. /compare left out on purpose | none | `src/app/(site)/tools/page.tsx:51-83`, `:10-12` | nav `src/lib/nav.ts:78`, footer `src/components/spine2/SiteFooter.tsx:123` | server |
| /calculator | Break-even sales a year and a month, orders a day, the owner's pre-tax pay, the revenue's percentile | a cell's p10 to p90 via /api/cell-lookup (`src/components/CalculatorForm.tsx:161-168`); trade cost shares (`src/lib/qa/industry_baselines.ts:51`); a ticket (`src/lib/economics/breakeven.ts:28`) | `src/app/(site)/calculator/page.tsx:29-77` | hub `tools/page.tsx:66-82`, footers `SiteFooter.tsx:125`, `src/components/SiteChrome.tsx:255` | yes (`CalculatorForm.tsx:1`, `:12-17`) |
| /check | A verdict per ratio (rent, labour, cost of sales) against a sector band | sector shares; the band is 4 points either side by construction (`src/lib/cost_engine/engine.ts:145-148`) | `src/lib/check/verdict_engine.ts:1-40` | hub, `src/app/(site)/methodology/key-benchmarks/page.tsx:89` | yes, state in the URL (`src/app/(site)/check/CheckForm.tsx:4-9`) |
| /compare | One trade in up to three places: revenue, net, take-home, rent and labour pressure | /api/cell-lookup, which runs estimateNetProfit and resolveOwnerTakeHome (`src/app/api/cell-lookup/route.ts:8-17`) | `src/app/(site)/compare/page.tsx:7-18` | nav `src/lib/nav.ts:77`, /calculator (`calculator/page.tsx:80-94`) | yes, `?q=` (`CompareClient.tsx:623-626`) |
| /decide | Ranks a city's neighbourhoods for one trade by what is left after rent | margins, neighbourhood multipliers (`src/app/(site)/decide/page.tsx:35-46`) | `decide/page.tsx:1-24`, `decide/go/route.ts:14-27` | hub, footer `SiteFooter.tsx:124` | server form |
| /you | Watch list, context, recent comparisons; a revenue percentile | localStorage (`src/app/(site)/you/YouDashboard.tsx:3-15`); cell lookup for 15 US states (`CompareToMeClient.tsx:15-19`, `:55-64`) | `you/page.tsx:51-90`, noindex `:29-35` | nothing; only the route table (`src/lib/routing/route_shapes.ts:128`) | yes |
| LoanLever | A loan's monthly repayment and total repaid | the UK start-up loan (`src/lib/spine/country_depth_rows.ts:158-160`) | `src/components/spine/interact/LoanLever.tsx:16-25` | /gb borrowing card (`src/components/spine/country/country-view.tsx:657`) | yes |
| HireLever | One hire at the reader's pay: salary, NI after the allowance, pension | pay bars, the employer rate, the UK's rules.json (`country-view.tsx:1169-1217`) | `interact/HireLever.tsx:30-40` | /gb only: the rich branch needs London's sales (`country-view.tsx:1473-1478`, `:1695`) | yes, from server figures (`HireLever.tsx:16-17`) |
| CoverPicker | The yearly cost of the ticked insurance covers | GB's four covers (`data/facts/country/GB.json:1`, read at `country_depth_rows.ts:121-124`) | `interact/CoverPicker.tsx:21-26` | /gb insurance card (`country-view.tsx:606-628`) | yes |
| SurvivalCurve | The 2019 cohort's survival, the UK or a region | `data/sections/survival.json` (`src/lib/spine/sections/first_years.ts:62`) | `interact/SurvivalCurve.tsx:3-23` | `src/components/spine/sections/FirstYears.tsx:27` | yes |
| Switch, SortTable, Marks, Range, DepthNotify | Views of one subject; a sort; a readout on a drawing; a slider beside a typed figure; an email capture | none of their own | `interact/Switch.tsx:3-14`, `SortTable.tsx:3-21`, `Marks.tsx:3-22`, `Range.tsx:3-12`, `DepthNotify.tsx:3-11` | country view, `CompareTable.tsx:88`, drawings, levers, thin pages | yes |
| MakeItYours | Linear what-if: typical take-home less your extra rent and payroll | the cell's typical lines | `src/components/kit/MakeItYours.tsx:3-36` | neighbourhood cell page only, out of the index (`src/app/[country]/[geo]/[industry]/[sub]/page.tsx:623`) | yes |
| spine2 calculator | Six sliders, "you would keep", what one move is worth, `?c=` | per-trade configs | `src/components/spine2/calc-engine.ts:1-21`, `Calc.tsx:1-19` | /dev/cell2 only (`src/app/dev/cell2/page.tsx:41`) | yes |
| Payback lines | Years to pay back: cost to open over take-home floored at 2,000 | break-in rating (`src/lib/scores/break_in_rating.ts:209`, `:268-272`) | `src/components/open/OpeningPayback.tsx:45-58`, `src/lib/open/buy_vs_start.ts:544-546` | /opening, /buy-or-start | server |
| Trade page foot | Months to break even, years to pay back | the trade shard (243, 3 held, printed modelled) | `src/lib/spine/open_rows.ts:70-76` | every trade-in-place page | server |
| Cost engine v2 | A 13-line waterfall per country, trade, size, revenue | country profile times sector shares | `src/lib/cost_engine/engine.ts:285-524` | no page: only `scripts/audit/engine_smoke_test.ts:6` | unused |

**Three faults a simulator must not inherit.**
1. The calculator's break-even is circular. Fixed costs are a share of the revenue typed (`breakeven.ts:155-161`) and break-even
   is fixed costs over gross margin (`:169`), so it is always one fraction of what the reader types, and the owner's pay is
   revenue times (gross margin minus the fixed share) (`CalculatorForm.tsx:130-133`, `:429-431`). Whether the owner is paid
   never depends on the revenue entered. The place is ignored too: the city tier is passed as null (`CalculatorForm.tsx:132`).
2. It answers for 16 trades: computeBreakeven returns null without a row (`breakeven.ts:141-142`), the table holds 16
   (`industry_baselines.ts:51-281`), and the list offers every default-visible trade (`calculator/page.tsx:36-39`).
3. Losses are hidden elsewhere. estimateNetProfit clamps the margin (`src/lib/finance/net_profit.ts:123-139`);
   resolveOwnerTakeHome floors take-home at the 3% margin and twice the country income for larger firms
   (`src/lib/finance/owner_take_home.ts:16-27`); the cost engine lifts a thin margin to the typical low (`engine.ts:397-403`)
   and blends wage quartiles that are a fixed multiple of the median (`src/lib/economic_profile/types.ts:30-36`). A simulator
   prints a loss as a loss, as the UK model does (`src/lib/uk/pnl/model.ts:21`).

**Prior art worth keeping.** The UK model's fixed costs, variable share, break-even F / (1 - v), keeps by legal form and the
after-tax cost of one more expense, the lever's marginal view (`model.ts:23-27`, `:95-124`). The spine2 laws: defaults reproduce
the page's own figure or the tool omits itself (`Calc.tsx:16-19`); a move's caption and worth come from one spec
(`calc-engine.ts:13-20`, `:133-147`); the address holds only values that differ (`calc-engine.ts:248-263`). The lever law: a
lever sits on a card holding its rule, its default a figure the card prints (`interact/Range.tsx:9-11`).

## 2. The cost model's ingredients

Grain and trust: cities from `data/facts/city/<ISO2>-<slug>.json` (252), countries from `data/facts/country/<ISO2>.json` (198)
and `data/economic_indicators/country_profile_v2.json` (195), trades from `data/facts/industry/<id>.json` (243). Each fact is
tagged held, modeled or placeholder (`src/lib/facts/types.ts:13`); a placeholder never leaves the store
(`src/lib/facts/store.ts:20-33`). Pages print shard figures as estimates whatever the tag: the trade shards' held tag checked
out at 57% (`src/lib/spine/trade_net.ts:32-33`), and every page outside the UK says its figures are estimates
(`src/lib/uk/registers/register_city.ts:26-30`). Counts are files holding the metric, then how many are tagged held.

| Ingredient | Held | Estimated | Missing |
|---|---|---|---|
| Rent per m2 | England's official estimate of rent (rateable value per m2, valued April 2021) by kind of premises, London and England only; London restaurants £362 (`data/uk/registers/premises.json:75-78`, `:185-188`; the export keeps two areas, `E:/atlas/registers/uk/export_for_site.py:82`) | prime and secondary shop rent and service charge, 252 cities, 133 held (`src/lib/spine/premises_bento_rows.ts:32-38`); one rent on 193 country files (16 held); three city tiers (`types.ts:59-61`); a commercial rent table, 202 cities and 130 countries, "estimation tool only" (`src/lib/finance/commercial_rent_2024.json:4-58`) | register-grade shop rent outside England |
| Floor area | the UK's average premises, floorspace over count (`src/lib/uk/pnl/inputs.ts:34-38`): London restaurants 203 m2 | sector constants (`src/lib/finance/fixed_costs.ts:77-99`); m2 per worker by sector (`engine.ts:97`) | area by trade outside the UK |
| Rates and lease tax | England's 2026-27 business rates with relief (`src/lib/uk/law/business_rates.ts:4-15`, London supplement out of scope `:15`); tax on a new lease's rent (`src/lib/uk/law/lease_tax.ts:4-12`) | property tax rate times asset value (`fixed_costs.ts:133-135`) | a bill outside the UK |
| Wages | five roles a city, 835 of 1,260 held, London $2,825 to $4,000 a month (`src/lib/spine/city_crew_rows.ts:13-19`); a city average wage, 156 cities (`src/lib/economic_profile/city_wages.ts:5-19`); a trusted cell's payroll per employee (`src/lib/cells.ts:115`); the UK's £12.71 an hour (`src/lib/uk/law/params_2026_27.ts:120`) | a trade's roles, counts and wage index, 243 trades, pay = index times the country median (`src/lib/spine/team_rows.ts:11-29`); pay by level on 197 country files | a map from a trade's roles to the city's five |
| Employer on-costs | the UK's NI above its threshold, the allowance shared across hires, the pension minimum (`src/lib/uk/law/employer_cost.ts:4-12`, `national_insurance.ts:58`) | one rate per country, 145 countries (`src/lib/tax.ts:38-41`); the profile's multiplier (`types.ts:45-48`) | one agreed source: city files disagree with the country rate on 164 of 252 (`city_crew_rows.ts:99-102`) |
| Corporate tax | the UK's 19% to 25% with marginal relief (`src/lib/uk/law/corporation_tax.ts:7-12`) | one rate per country, 145, regional for ten countries (`src/lib/tax.ts:12-22`, `:169-207`) | |
| Owner's personal tax | UK keeps for a sole trader and a one-director company (`src/lib/uk/law/take_home.ts:6-16`) | one marginal rate at $50K per country (`types.ts:56`) | schedules outside the UK |
| VAT | the UK's rate and £90,000 threshold (`data/facts/country/GB.json:1`) | a rate on 198 files, a threshold on 155 | the register's turnover is net of VAT (`data/uk/registers/manifest.json:21`): sales must be too |
| Electricity, utilities | a rate per kWh on 195 profiles, 52 of them the 0.13 fill, withheld (`src/lib/spine/running_costs_rows.ts:14-38`) | utilities as a share of sales | use in kWh per trade or per m2: none in src or data |
| Registration, licences | 852 registration steps with costs on 196 countries, 181 held (`src/lib/spine/howto_steps_rows.ts:12-15`); legal forms with fees, 152 countries (`src/lib/spine/setup_rows.ts:17-28`); five local permits a city, 665 of 1,260 held (`src/lib/spine/city_gates_rows.ts:14-17`) | a trade's licences as "low", "medium", "high" (`data/facts/industry/restaurants.json:1`) | licence fees in money |
| Insurance | GB's four covers with typical premiums, modelled (`data/facts/country/GB.json:1`) | 1% of sales (`fixed_costs.ts:137-138`); sector shares (`engine.ts:82-91`) | premiums outside GB |
| Accounting, software, card fees | a card fee for GB only | 0.6% and 1.2% of sales times a country multiplier, 130 countries (`fixed_costs.ts:143-148`) | any price list |
| Cost to open | held bills on GB and US cells, grade A or B, nine lines on London's (`src/lib/spine/setup_items.ts:11-38`, `open_rows.ts:21-23`); fit-out per m2 and deposit months, 252 cities (`premises_bento_rows.ts:26-31`) | the archetype table, 153 of 243 trades, scaled by cost of living within 0.4 to 2.5 (`src/lib/markets/startup_capital_archetypes.ts:14-27`, `:267-268`) | the 90 trades on the 80,000 default, withheld (`open_rows.ts:37-38`) |
| Variable share, margins | UK recipes for 7 trades, money printed for 3 (`src/lib/uk/pnl/recipes.ts:31-117`, `src/lib/spine/london_trade_hero.ts:13-17`) | margin ladder on 243 shards, 38 a fill and withheld (`trade_net.ts:25-33`); 1,091 cost drivers; a fixed and variable split on 243; 205 trades in `src/lib/finance/industry_margins.json:3` (net floored at 3%) | each cost's class, variable or fixed, beyond the 7 recipes |
| Break-even, payback | the UK's break-even and the share of registered firms above it (`model.ts:23-27`, `:110-118`) | computeBreakeven for 16 trades; months to break even and years to pay back on 243 shards, 3 held (restaurants 6 and 2.5, `restaurants.json:1`); the break-in payback | a payback from the place's own costs |
| Sales, ticket | register turnover bands, 137 trades in London's 33 boroughs, London and England (`manifest.json:20-23`); a trusted cell's p10 to p90 (`src/lib/cells/trust.ts:20-30`) | spend per head on 243 shards (28 held); a ticket per trade times a city tier (`breakeven.ts:48-68`) | |
| Loans, seasons, exit | the UK start-up loan at 7.5%, held (`GB.json:1`); a bank lending rate on 195 profiles (`country-view.tsx:631-642`) | months of demand on 243 shards and 252 cities; sale multiples on 243 shards (182 held) and 198 countries | |

**Where the sources disagree.** London's rent, dollars a m2 a year: prime 5,000 and secondary 1,750 in the city file
(`data/facts/city/GB-london.json:1`); 1,050 in the commercial table (`commercial_rent_2024.json:58`), whose check was against
office rents (`data/quality/commercial_rent_verified_v1.json:3`); 920 for the profile's tier one
(`country_profile_v2.json:315`); 1,389 in the country file (`GB.json:1`); £362 for restaurants at 2021 values
(`premises.json:78`). Five readings, a factor of five apart: each input needs one stated precedence. Fills to keep out:
electricity 0.13 (`running_costs_rows.ts:23-38`), the 80,000 archetype, the 42/10/5 ladder, every placeholder (`store.ts:88-92`).

## 3. The engine

| Function | Takes | Gives | For a simulator |
|---|---|---|---|
| estimateNetProfit (`net_profit.ts:93-168`) | country, region, trade, revenue, payroll or none | COGS, payroll (given, or 0.7 of the gross-operating gap, `:100-105`), employer social, fixed costs, CIT, net | only payroll enters; rent is a sector area times a table (`fixed_costs.ts:77-99`, `:131`), the rest shares of revenue (`:137-148`); clamped |
| resolveOwnerTakeHome (`owner_take_home.ts:54-85`) | the waterfall | one take-home | floored: unfit |
| getCountryEconomicsSnapshot (`src/lib/economics/country_metrics.ts:355`) | country | salary, wealth, self-employment, days to start | context, not costs |
| computeBreakeven (`breakeven.ts:135-197`) | trade, revenue, city tier | ticket, fixed share, break-even, orders a day | circular on the reader's revenue |
| estimateCostStructure (`engine.ts:285-524`) | country, trade, size, revenue | 13 lines with reasons and grades | shares, clamped, unused |
| buildOpeningPage (`src/lib/open/opening_page.ts:10-48`) | a trusted cell | capital, permits, weeks, first hires, take-home, payback | server and database; the cost-to-open precedence to copy |
| buy vs start (`buy_vs_start.ts:10-43`) | the opening page | sale price, take-home times a multiple | a later buyer view |
| UK P&L (`src/lib/uk/pnl/london.ts:47-60`, `model.ts:71-160`) | recipe, register bands, valuation premises, legal form | the bill by line with kinds and sources, break-even, share above it, keeps, the after-tax cost of a change | fit |
| UK law (`src/lib/uk/law/*.ts`) | pay, profit, rateable value, loan | employer cost, rates, corporation tax, keeps by form, a loan's month, lease tax | fit and pure: each imports only siblings (`business_rates.ts:17-18`, `take_home.ts:32-36`) |

**Verdict: it composes in the UK and nowhere else.** London: wrap model.ts, let the reader change the premises' size and rent per
m2 (the rent and rates lines), add hires through hireAllIn, pick the form; at the defaults it reproduces the trade page's
break-even, which reads the same engine (`london_trade_hero.ts:63-67`). England outside London: the same engine on the England
rows (`premises.json:113`), labelled as England's, once the geography fixed at `london.ts:25` becomes a parameter. Elsewhere no
engine takes a reader's rent or staff, so new code:
1. `src/lib/simulator/defaults.ts`, server: a place and trade in, a bundle out (each input's value, unit, data-src, data-kind,
   the level it came from and its line), read through the store's shard doors, London through london.ts, sales from a trusted cell.
2. `src/lib/simulator/engine.ts`, pure: model.ts's identities on absolute inputs, giving lines a month and a year, fixed costs F,
   variable share v, break-even, profit and margin at a sales figure, tax (the UK law, else the country rate), payback,
   sensitivity, and each output's kind by combineKinds (`src/lib/uk/pnl/kinds.ts:11-25`).
3. An API route for a place switch, rate-limited as the cell lookup is (`src/app/api/cell-lookup/route.ts:20`).
4. The page and one client component from Range, the LoanLever and the HireLever's bar. The money grammar needs a form below
   zero: `src/lib/spine/money.ts:9-18` prints -5000 as "$-5,000".

**Server and browser.** Server: the shards (file reads, `src/lib/facts/country_shard.ts:19-21`), the register slices
(turnover.json is 2 MB and stays off the browser, `london.ts:4-5`), cells (withBudget, `opening_page.ts:43-48`), the page's one
net (`trade_net.ts:50-52`), the copy table (`HireLever.tsx:16-17`). Browser: the engine, the law, money, the address.

**Calibration.** At the defaults the page must print the trade page's one net (`trade_net.ts:4-13`) and, in London, its
break-even, or omit itself (`Calc.tsx:16-19`). Outside the UK use the UK's size rule (`model.ts:6-16`): costs sized at the
place's typical sales, "other running costs" the one solved line, named as such.

## 4. The proposed simulator

**4.1 Inputs, each default with its source**

| Input | Default | data-src | data-kind | When the place lacks it |
|---|---|---|---|---|
| Country, city, trade | London restaurants, the site's exemplar | taxonomy, city list | none | city optional: "anywhere in" the country |
| Premises size | UK: the average premises of the trade's kind | `uk/registers/premises.json:Restaurants:E12000007` | worked out | m2 per worker times the team (estimate); else typed |
| Rent per m2 a year | UK valuation; else the city's secondary rent | premises.json; `facts/city/<id>:realestate.rent_secondary_usd_sqm_yr` | worked out (dated 2021); estimate | the country's rent, said so; never prime |
| Service charge, rates | city service charge; GB rates by law on the value | `realestate.service_charge_usd_sqm_yr`; `uk/law/business_rates.ts` | estimate; worked out | rates omitted outside England |
| Team by role | the trade's roles at typical counts | `facts/industry/<id>:roles.*.headcount_typical` | estimate | sector headcount (`engine.ts:98-100`) |
| Pay per role | wage index times the city's average wage, else the country median | `economics/city_wage_premium_v1.json`; `team_rows.ts:137-143` | estimate | withheld where no median (`team_rows.ts:25-29`) |
| Employer on-cost | GB law per hire; else the country rate | `uk/law/employer_cost.ts:hireAllIn`; `tax/country_rates_2024.json:<ISO2>` | worked out; estimate | withheld if no row: the default rate is never used |
| Owner's pay | none, the owner keeps the profit (`recipes.ts:18`); a target if set, default the city's typical income | `owner_col.median_salary_usd_mo` x 12 (`src/lib/spine/city_income.ts:95-107`) | estimate | the country's average income |
| Sales a year | London: the register's median; else a trusted cell's typical | `uk/registers/turnover.json:<trade>:E12000007`; the cell | worked out; the cell's | withheld: the reader types it |
| Average ticket | spend per head | `facts/industry:demand.spend_per_head_usd` | estimate | ticket times city tier (`breakeven.ts:55-68`) |
| Cost of goods share | UK recipe's variable shares; else 1 minus the gross margin | `recipes.ts:<trade>`; `margin_ladder.gross_margin_pct` | estimate | sector share; a fill ladder never |
| Running costs | recipe or shard drivers at typical sales: utilities, insurance, software, marketing | `cost_structure.cost_drivers.*` | estimate | sector shares |
| Loan | none; rate 7.5% in GB, else the lending rate | `GB.json:financing.startup_loan_rate_pct`; `bank_lending_rate_pct` | looked up; estimate | typed |
| Cost to open | the cell's held bill; else fit-out times area, deposit, registration; else the archetype | `setup_items.ts`; `realestate.fit_out_cost_usd_sqm`; `setup.steps`; archetypes | estimate | withheld on the 90 default trades |
| Legal form (GB) | sole trader | `uk/law/take_home.ts` | worked out | not shown elsewhere |

**4.2 Outputs and their provenance**

| Output | How | Provenance |
|---|---|---|
| The bill, a month and a year, by line | each input line; the month drawn as one bar | each line keeps its input's data-src and data-kind |
| Sales to break even | F / (1 - v), F every fixed line plus the owner's pay when set (`model.ts:23-27`) | combineKinds of the inputs: an estimate unless all are counted, looked up or worked out |
| Sales that pay you and leave a profit | (F + target) / (1 - v); after tax by searching the UK law, else the country rate | as above |
| Customers a day | break-even over the ticket over days open | the ticket's kind joins in |
| Margin at your sales | (R - vR - F) / R, before and after tax; GB keeps by law (`model.ts:95-102`) | as above |
| Firms above break-even | London: the register's share (`model.ts:114-118`); a trusted cell: from its p10 to p90 | estimate |
| What moves break-even most | each input moved one step (10%, one hire), sorted; dR/dF = 1 / (1 - v), dR/dv = F / (1 - v)^2 | estimate |
| Months to pay back | cost to open over the month's profit after tax; withheld at a loss | estimate |

A reader's own typed figure has no word in the vocabulary: provenance knows four kinds (`src/lib/spine/provenance.ts:19`).
Proposed: inputs the reader set carry "yours", and an output resting on one says "your figures" in its line.

**4.3 When the place lacks data.** Every input takes the city's figure, then the country's, then none, and its row says which:
"London holds none. This is the UK's." A withheld input leaves an empty field with its line, and every output that needs it is
withheld where the figure would stand (`premises_bento_rows.ts:41-46`), never a typed default (`Range.tsx:9-11`). A section
whose subject the place lacks omits itself: covers outside GB, rates outside England, firms above break-even without a register
or a trusted cell. Never a fill: electricity 0.13, the 80,000 archetype, the 42/10/5 ladder, the wage fingerprint
(`running_costs_rows.ts:33-35`), any placeholder.

**4.4 Address, state and indexing.**
- Build it at /calculator: the route exists (`src/lib/routing/route_shapes.ts:39`), so do its canonical
  (`calculator/page.tsx:26`), the hub card's promise (`tools/page.tsx:79-81`) and the footer links; the house rule is add new,
  never rename (`CLAUDE.md:99`), and today's tool is the circular one. The other road, /tools/simulator, needs gen_route_shapes and a fourth hub
  card, which the hub calls a decision (`tools/page.tsx:10-12`).
- State: `?country=gb&city=london&trade=restaurants&v=area:180,rent:410,team:chef-2.server-4,sales:520000,loan:40000-7.5-5`,
  only values that differ from the defaults (`calc-engine.ts:248-263`).
- A cold load renders on the server from the parameters; a place switch fetches the bundle from the API route; the levers
  recompute in the browser and write the address with replaceState (`Calc.tsx:10-14`), debounced (`src/lib/url_state.ts:40-42`).
- Canonical /calculator on every view, the 2026-10-09 rule for views
  (`E:/atlas/docs/superpowers/specs/2026-10-09-page-architecture-design.md:82-91`). The bare page indexes by the upper default
  (`src/lib/seo/indexable.ts:133`); a view with parameters is noindex and never in a sitemap. An unknown country, city or trade
  answers 404; an unknown lever is ignored, one out of range clamped (`Calc.tsx:14`).
- Doors: each trade-in-place page links "Run your own numbers" with its three place parameters. The page joins the chain's
  renders so the copy, page and provenance gates read it (`provenance.ts:15-17`).

**4.5 Composition, phone first.** Seven zones, paper and tint alternating, sections open on them
(`E:/atlas/design/loop/build/briefs/MODEL.md:1028-1032`, cited below as `MODEL.md`):
1. Masthead: "What your business costs", one line, three native pickers on 48px fields (`DepthNotify.tsx:38-43`).
2. The answer: sales to break even a month at 40, the page's one 40 (`MODEL.md:1026`); a day at 16; firms above it; the margin
   at your sales at 30.
3. The levers, the one card, because the reader operates it (`MODEL.md:1034`): Team, Premises, Sales, You, Loan. Each row a
   slider beside a typed figure (`Range.tsx:3-7`) with its source line; team rows as steppers drawing the HireLever's bar.
4. The month: one bar of variable costs, fixed costs and profit with break-even ticked, then fact rows (label, source, figure);
   a Switch for a month or a year, words and figures only (`Switch.tsx:7-9`).
5. What moves it most: the sorted bars.
6. Money to open it: the opening bill as ranked bars, months to pay back at 30, the PhaseBar (`src/components/spine/kit.tsx:1472`).
7. Where figures come from: every default's source in words, with its date.
From 1024 the levers stand left and the answer and bill right, as the LoanLever stands its answer beside its controls from 560px
of card (`LoanLever.tsx:27-30`). No modal, drawer, carousel or toast anywhere.

**4.6 What makes it chic, inside the system.**
- One answer in terra, the break-even; every control in ink2, as the covers' boxes are (`CoverPicker.tsx:43-44`); the largest
  sensitivity bar the one other terra, inside PART 6's budget (`MODEL.md:1026`).
- Figures in the figure face through Fig, which also stamps data-src and data-kind (`kit.tsx:100-102`).
- Live figures, no Apply button, announced politely (`HireLever.tsx:47`; `MakeItYours.tsx:27-28`).
- The signature drawing is the month as one bar in the HireLever bar's style (`HireLever.tsx:50-70`), with PhaseBar's rule that
  a late tick extends the axis instead of clipping (`kit.tsx:1462-1471`).
- Headings of four words: "Sales to break even", "What your team costs", "What moves it most", "Money to open it", "Where
  figures come from". Lines under twelve words: "Each month must take this much to cover every cost."

## 5. Minimum honest version and full version

| Version | Scope | Size | Data it needs |
|---|---|---|---|
| Minimum honest | Every place. London and England on the register and law engine; elsewhere shard defaults as estimates, fallbacks said. Outputs: the bill, break-even with and without the owner's pay, margin at your sales (pre-tax outside GB), firms above break-even (London, trusted cells), sensitivity, payback. Calibrated to the trade page's net. | M | all held: premises.json, turnover.json, the 7 recipes, the UK law, rules.json, the three shard folders, the country tax table, the archetypes, the cells |
| Full | Adds every London borough and English local authority's rent, the recipe protocol (`recipes.ts:9-27`) on all 243 trades, the role map, a monthly cash curve with ramp and seasons, tax by legal form beyond GB, energy from use, insurance and licence fees in money, two scenarios side by side, the owner's numbers exchange at the end | L | rebuilds of held caches plus the downloads below |

A size S first slice sits inside the minimum: London's three money trades on london.ts and model.ts as they stand
(`london_trade_hero.ts:13-17`).

**Gaps that need a download, so the owner's word:**
1. Energy use per trade or per m2: the rates are held, the use is held nowhere.
2. Personal income tax schedules outside the UK (one marginal rate today, `types.ts:56`).
3. Insurance premiums by trade beyond GB's four covers.
4. Licence and permit fees in money per trade and country (bands only, `restaurants.json:1`).
5. Accounting, software and card-fee prices outside GB.
6. Register-grade shop rents outside England (the city rents are estimates; the commercial table was checked against offices).

**Gaps that need no download:** the local-authority valuation table is on disk
(`E:/atlas/cache/uk/voa_floorspace/2026-10-02/NDR_SCat_Floorspace_LA_2025.zip`); the build keeps London's boroughs
(`E:/atlas/registers/uk/build_floorspace.py:70-74`) and the export two areas, so wider rents are a rebuild. Borough turnover bands
are already in turnover.json (35 areas). The role map and the cost-driver classes are work on held shards.

**For the owner to decide:**
1. Free or Pro: Pro sells "premium information, premium sections" (noted there as content depth, not tools) and the free line
   is "Depth behind Pro" (`E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md:22`, `:24`); the paywall map already fogs the
   full cost stack and the orders to break even (`src/lib/monetization/free_paid_map.ts:81-83`).
2. /calculator rebuilt, or /tools/simulator added.
3. A provenance word for the reader's own figures.
4. Dollars, or the place's currency through the display switch (`src/lib/finance/fx.ts:27-35`).
5. The answer as the one sticky element on a phone, a new pattern (a copy of it would repeat a fact).
6. The give-to-get exchange as the page's end: its fields are the simulator's inputs (sales, owner's pay, rent, rates, staff,
   wages, ticket, hours) (`E:/atlas/design/loop/build/SPEC-2026-10-02-owner-numbers.md:8-30`).
