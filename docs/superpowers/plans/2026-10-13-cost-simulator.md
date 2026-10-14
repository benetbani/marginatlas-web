# Cost simulator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** /calculator rebuilt as the free cost simulator: a reader picks a country, a city and a trade, sets the team, the premises, the sales, their own pay and a loan, and reads at once what the business costs by line, the sales it needs to break even (F / (1 - v), never circular), the margin at their sales, what moves the break-even most and how many months the money to open it takes to come back, every default with its source and its kind, every figure of their own marked "yours".

**Architecture:** A pure engine (`src/lib/simulator/engine.ts`) proved first, test first, on the UK model as it stands (London's three money trades, model.ts's break-even to the penny: the spec's first slice) and on hand-worked London and Berlin cases. A server defaults builder (`src/lib/simulator/defaults.ts`) reads R7 4.1's rows in their precedence, city then country then none, each default carrying its stamp, its level and its line, on two paths: model.ts's own business where the place is in England and the trade passes the model there, R7's rows everywhere else. One API route answers a place switch. The page is a spine band page whose body is one client component: the levers recompute in the browser and write the address with replaceState. Every trade page's close gains the door; the circular form leaves; the written rules follow; the spec's section 5 verifies.

**Tech Stack:** Next.js 15.5 App Router (a dynamic page that reads `searchParams`, one route handler), React 19 server and client components, TypeScript 5, Tailwind 3.4; the UK law modules (`src/lib/uk/law`) run in the browser; tests are tsx scripts in the `check()`/`red()` style wired into `scripts/prebuild_all.ts`; jsdom for static reads and for mounting the client; Playwright behind `requireBrowser` for the browser gates.

**Spec:** E:/atlas/docs/superpowers/specs/2026-10-13-cost-simulator-design.md

Research behind it: E:/atlas/docs/superpowers/research/2026-10-13-strategic-pages/R7-simulator.md (its tables 4.1 to 4.6 adopted row for row). This plan executes after three plans and on top of all of them: E:/atlas/docs/superpowers/plans/2026-10-12-rhythm-air-inside.md, E:/atlas/docs/superpowers/plans/2026-10-13-home-quiet-editorial.md and E:/atlas/docs/superpowers/plans/2026-10-13-country-page-journey.md (whose signal this page uses). Every implementer reads the spec, R7, E:/atlas/website/CLAUDE.md and E:/atlas/website/.superpowers/sdd/pl-implementer-rules.md (its rules hold here with this plan's branch, `cost-simulator`, in place of `pre-launch-fixes`). The spec numbers the page's parts in its section 4; this plan cites them as "section 4, item 1" (the masthead) to "item 7" (where figures come from).

## Global Constraints

The spec's rules, verbatim:

- **Why.** "today's /calculator is the site's only break-even tool, and its break-even is circular: it sizes fixed costs as a share of the revenue the reader types, so whether the owner is paid never depends on that revenue ... it is replaced, at its own address (no URL renamed)."
- **Success.** "every default carries its source and its kind; a reader's own figure says "yours"; a place that lacks a figure says so and falls back to the country, or leaves the field empty with its reason, never a typed default; the break-even is the arithmetic F / (1 - v), never circular; the page reads phone first and stands beside the site's best pages in finish."
- **The version.** "Every place. London and England run on the register and the UK law engine already in the repo (src/lib/uk/pnl/model.ts and the law modules: business rates, employer cost, take-home by legal form, loans, lease tax); elsewhere the trade and city shards supply the defaults as estimates, each fallback said. Only data already held (R7 section 5). Inside it, a first slice (London's three money trades on the model as it stands) proves the engine before the world defaults land."
- **Inputs** (R7 4.1, row for row). "country, city (optional: "anywhere in" the country), trade; premises size; rent per m2 a year; service charge and rates (rates by law in England, omitted elsewhere); team by role with pay per role and employer on-cost; owner's pay (none by default: the owner keeps the profit; a target when set); sales a year; average ticket; cost of goods share; running costs (utilities, insurance, software, marketing as the trade's drivers); a loan; the cost to open; the legal form (UK only)."
- **Outputs** (R7 4.2). "the bill by line, a month and a year, the month drawn as one bar; sales to break even (F / (1 - v), F with the owner's pay when set); the sales that pay the owner and leave a target profit, after tax where the law engine holds the tax; customers a day; the margin at the reader's sales, before and after tax (after tax in the UK; before tax elsewhere, said so); the share of firms above break-even where a register or a trusted cell holds it; what moves the break-even most (each input moved one step, sorted); months to pay back the opening money (withheld at a loss)."
- **Provenance.** "every figure through the kit's Fig with its data-src and data-kind; an output combines its inputs' kinds (an estimate unless all are counted, looked up or worked out); a reader's own figure carries the new kind word "yours", and an output that rests on one says "your figures" in its line."
- **When the place lacks data.** "city, then country, then none, and the row says which ("London holds none. This is the UK's."). A withheld input leaves its field empty with its line, and every output that needs it is withheld where the figure would stand. Never a fill (the electricity 0.13, the 80,000 archetype, the 42/10/5 ladder, any placeholder)."
- **Address, state, indexing.** "At /calculator (its route, canonical, hub card and footer links stand). State in the address: country, city and trade, and only the levers that differ from the defaults (`?country=gb&city=london&trade=restaurants&v=...`). A cold load renders on the server from the parameters; a place switch fetches its defaults from one API route; the levers recompute in the browser and write the address with replaceState, debounced. Canonical /calculator on every view; a view with parameters is noindex and in no sitemap; an unknown country, city or trade answers 404; an unknown lever is ignored, one out of range clamped. Each trade-in-place page gains a door, "Run your own numbers", carrying its three place parameters."
- **The page, phone first** (section 4): "1. Masthead: "What your business costs", one line, three native pickers on 48px fields. 2. The answer: sales to break even a month at 40, the page's one 40, in terracotta; a day at 16; the share of firms above it; the margin at the reader's sales at 30. 3. The levers, the page's one card (the reader operates it): Team, Premises, Sales, You, Loan; each a slider beside a typed figure with its source line; team rows as steppers drawing the hire lever's bar. 4. The month: one bar of variable costs, fixed costs and profit with break-even ticked, then fact rows (label, source, figure); a switch for a month or a year. 5. What moves it most: the sorted bars, the largest the one other terracotta. 6. Money to open it: the opening bill as ranked bars, months to pay back at 30, the phase bar. 7. Where figures come from: every default's source in words, with its date."
- "From 1024 the levers stand left and the answer and the bill right. Live figures, no Apply button, announced politely. Headings of four words; lines under twelve words; no modal, drawer, carousel or toast; the money in the reader's display currency through the site's existing switch (src/lib/finance/fx.ts). The rhythm branch's air, type floor, each-fact-once and bare opener icons hold here, and the country page's signal marks the margin and the share above break-even where a direction exists."
- **Gates.** "The page joins the chain's renders, so the copy, page and provenance gates read it; a new engine test pins the break-even arithmetic (F / (1 - v), the owner's pay in F, a loss shown as a loss, payback withheld at a loss) against hand-worked cases for London restaurants and one place outside the UK; a fallback test pins city to country to none with its line; a no-fill test reds any of the known fills reaching an input."
- **Decided in the spec, for his review.** ""yours" as the provenance word for a reader's own figure." "The display currency through the existing switch, dollars by default as the site prints today." "No sticky answer on a phone in this version (a new pattern the model does not hold); the answer stands above the levers and each lever shows its effect beside it."
- **Later, not here** (section 6): every borough's rent, the recipe protocol on all 243 trades, a monthly cash curve, tax by legal form beyond the UK, and every download item; the give-to-get exchange.

The house rules every task holds:

- Copy, for every user-visible string: headings of four words at most; a line twelve words at most; no semicolon; no em-dash; never "modelled", "withheld" or "on file" (nor the plain-copy gate's other method words: "not gathered", "not measured", "the model", "placeholder", "worked from"); no source-agency names; no "we"; a label a noun phrase of three words at most. Every string lives in `src/lib/spine/copy.ts`; a rule prints in the law's currency and unit (MODEL 10.8).
- The palette: terracotta and neutral greys; the signal's five colours only inside the country plan's `src/components/spine/signal/`.
- A gate never passes having read nothing; a knowable scan set is checked against an enumeration; the chain needs no network or secret, so the engine and defaults tests run offline on fixtures and on the repo's own files, and nothing in the chain imports `src/lib/cells.ts` (its Supabase client throws without a secret).
- tsx injects `__name` into compiled functions, so no tsx test hands a function to `page.evaluate`; a browser rule lives in an `.mjs` and a tsx test reads that file's source from disk.
- A comment says what the code does, no more. Tests of removed code leave with it. No ratchet baseline raised (a new page is held at zero; lowering to a measured value is allowed). No URL renamed; a new route ships with `scripts/gen_route_shapes.ts` run in the same commit.
- The owner's never-list, verbatim: "Never: push, deploy, merge into main, force-push, --no-verify; change Stripe, Supabase, Vercel or DNS settings; apply a migration to the live database; print or copy any .env value; install or download anything (npm, pip, data files); send an email or post anywhere; rename a URL; raise a ratchet baseline; pipe a verification into a filter; run two browsers or a browser beside the chain; close my apps for memory (wait and check again). Never invent a figure, testimonial, review, logo or credential."

## Review Focus

1. **A loss.** Sales under the break-even, or each sale's costs at or above its price (a cost of goods share and running share summing to 100% or more). Expected: the profit and the margin print as losses with a true minus ("−$12K", "−4%", never "$-12K"), the month's bar draws the costs running past the sales, the payback stands empty with "No payback while the month runs at a loss.", and where each sale costs more than it brings no break-even prints and its place says so; the engine never divides by zero or by a negative. Test: Task 1, Step 1 (engine fixtures: R below R*, v = 1 and 1.05) and Task 4A, Step 1 (the signed money form).
2. **A zero sales input.** The reader clears the sales field or types 0, and a place whose sales no register or trusted cell holds. Expected: the margin, the month's profit and the payback stand empty with "Type your sales to see this.", the break-even and customers a day still print (they need no sales), and no NaN, Infinity or "$0" margin reaches the page. Test: Task 1, Step 1 (sales null and 0) and Task 4B, Step 1 (a world bundle with no sales rendered: no NaN or Infinity in the markup, the three empty lines).
3. **A city with no rent.** A city whose shard holds no secondary shop rent, and then a country that holds none either. Expected: the rent row takes the country's figure with "{City} holds none. This is {country}'s.", and where the country holds none the field stands empty with its line and the break-even stands empty with "Fill the empty fields above to see this.", never a fill. Test: Task 2, Step 1 (Berlin's rent taken out of the fact store, then Germany's: the level, the line, the engine's `needs`).
4. **A typed figure out of range.** A typed area of 999,999, a negative rent, letters in a field, an address holding `v=area:-5,rent:abc,zz:1`, a rent that puts the rateable value past the law's £500,000. Expected: the lever and the address clamp to the lever's bounds, letters and unknown keys are ignored, the engine never throws, and rates past the law's reach stand empty with their rule in pounds. Test: Task 5, Step 1 (decode fixtures) and Task 1, Step 1 (the engine over extremes).
5. **A currency switch mid-session.** The reader types a rent in dollars, switches to pounds, then back. Expected: the typed figure keeps its value in the base currency to the penny, the address does not change, a UK view in pounds prints the law's pounds exactly and in dollars the trade page's dollars (the site's pound rate), and no lever writes a converted figure back. Test: Task 4A, Step 1 (display round trips) and Task 4B, Step 1 (a mounted lever row: a currency change calls no `onChange`).

## Decisions the spec leaves open (the controller asks him; the plan names, it does not decide)

- **Q1, before Task 2: London's defaults where model.ts and R7 4.1 part.** The spec runs London and England "on the register and the UK law engine already in the repo (src/lib/uk/pnl/model.ts ...)" and adopts R7 4.1 row for row; on two rows they disagree. model.ts's business in the average premises carries no service charge (the valuation's figure is the rent alone) and its sales are the anchor's, the register's mean under £5m (£597,440.87 for London restaurants); R7 4.1 adds the city's service charge ($200 a m2 a year on London's file) and takes the register's median (about £281,900). (A) model.ts's business throughout: the service charge field empty with its line (the reader types one, "yours") and the sales the anchor's, so the break-even at the defaults is the trade page's to the penny and the margin 4.4% before tax; (B) R7's two rows: the break-even rises by the service charge (about £47,800 a year) above the trade page's, the defaults stand at a loss of about 73% at the median, and the payback stands empty on the bare page, a FOCAL finding on its render until he rules. The plan is written for A; B's delta is the two lines marked `Q1` in Task 2, Step 8 (`defaults.ts`), the check marked `Q1` in Task 2, Step 1, and Task 4C's render expectations (under B the bare page stands at a loss, so its money to open it holds no 30 there).
- **Q2, before Task 2: the trade page's net at the defaults, outside the UK.** R7 section 3 asks the defaults to print the trade page's one net (trade_net.ts) or the tool to omit itself, through one solved line, "other running costs", sized so the margin at the place's typical sales equals that net; R7 section 5 counts it in size M; the spec's text never names it. A solved line is a residual printed as a cost, the form the trade page's split retired ("rescaled every cost to fit the net, the fabrication the residual law forbids", `cell-view.tsx`'s header), and it can be solved only where a trusted cell holds typical sales. (A) solve it there, named as such, and print no margin where it cannot be solved; (B) no solved line: the defaults are the rows' own figures and the margin at them is the arithmetic's. The plan is written for B; A adds one line to Task 2's builder and one check to its test.
- **Q3, before Task 6: where the door stands on the trade page.** Terminus draws at most three doors ("At most three doors; a fourth is not drawn", `Terminus.tsx`) and the trade close holds three (MODEL 8.6 `15 close`: "three doors (its cap)"); 8.6's door paragraph ends "Nothing else on the page navigates"; PART 7 keeps doors out of a card's foot. (A) a fourth door in the trade close, before the compare pill, the cap a prop the trade close alone sets to four; (B) the door on a card of its own before the close, as the country page's compare door stands (a new block on every trade page); (C) the door in place of the industry door. The plan is written for A.
- **Q4, before Task 4B: five drawings against the bar ledger.** The spec draws five things as bars: each team row ("team rows as steppers drawing the hire lever's bar"), the month, what moves it most, the opening bill ("as ranked bars") and the phase bar. MODEL PART 6 allows three bar-family cards a page, never two in one band or in one column of neighbouring bands; PART 7: "No card holds two drawings"; his ruling of 2026-07-09 keeps every drawing out of a disclosure (`Switch.tsx`). The levers stand beside the answer and the month (spec section 4), so hire bars and the month bar would share a band. (A) two bar cards, the month beside the levers and what moves it most; the team rows as steppers with their figures; the opening bill as fact rows under the months to pay back at 30; no phase bar; (B) a named exception in MODEL for the page's one operated card, so the hire bars stand inside it; (C) the opening bill as ranked bars and what moves it most as rows. The plan is written for A.

## The controller's rulings on Q1 to Q4 (2026-10-13)

- **Q1: A.** London's defaults are model.ts's business throughout (no service charge, the field empty with its line for the reader to type; the sales the register's mean under £5m), so the simulator's break-even at the defaults is the trade page's to the penny: one figure for one thing across the site. The median or mean question is a later data ruling.
- **Q2: B.** No solved line: a residual printed as a cost is the fabrication the residual law forbids; the margin at the defaults is the arithmetic's.
- **Q3: A.** A fourth door in the trade close, the cap a prop the trade close alone sets to four, named.
- **Q4: A.** Two bar cards (the month beside the levers, and what moves it most); team rows as steppers with their figures; the opening bill as fact rows under the months to pay back at 30; no phase bar.

## Readings the plan takes (stated, not asked)

1. "London and England run on the register and the UK law engine" (spec section 2) is model.ts's own business at the anchor, as R7 section 3 reads it ("wrap model.ts ... at the defaults it reproduces the trade page's break-even"). The path, `uk-model`, holds where the place is in England and the trade passes model.ts's own conditions in that geography with a recipe that carries its utilities (`londonMoneyPrints`' rule, made geographic). There the crew and running lines are the recipe's sized lines at the anchor's sales, hires are added on top through `hireAllIn`, and the break-even at the defaults is model.ts's `breakEvenSales` to the penny. Every other trade, in London too, takes R7 4.1's rows (path `world`).
2. England outside London (Birmingham, Bristol, Leeds, Manchester) and "anywhere in" the UK read England's register and valuation rows (`E92000001`), said ("Leeds holds none. This is England's."). Edinburgh and Glasgow take the world path with no rates and no tax, said: England's rates do not run in Scotland and the law module's income tax is rUK (`params_2026_27.ts`: "Scottish income tax bands are NOT here"). The UK cities' nations are a map in `place.ts`, held to the city list by a test.
3. The owner's pay W is a draw before tax, inside F (the spec's formula). After tax (UK law) the owner's money is W + P, and the profit after tax is keeps(W + P) − keeps(W), keeps the legal form's take-home (`model.ts` `keepsOfProfit`); at W = 0 it is model.ts's own keeps of P. A target T is after tax; outside the UK it stands before tax and says so (spec: "after tax where the law engine holds the tax"; R7's "else the country rate" is read as the spec narrowed it).
4. A loan's repayments count in F in full, the cash that leaves each month; for tax the year's principal is added back, since it is no cost for tax.
5. Off the UK model the running costs are a share of each sale: the recipe's sized lines that pay no staff, else the trade's sector profile's six running shares (energy, marketing, software, insurance, vehicles, other overhead). No typical sales size them there, and the shard's own drivers wait for the recipe protocol (spec section 6); R7 4.1's fallback for this row is "sector shares".
6. Off the UK model the cost of goods is the recipe's shares of each sale that pay no one (a commission line is a producer's pay, and the team pays producers there), else one minus the shard's gross margin, else the sector profile's share; never the 42/10/5 ladder (`trade_net.ts` `LADDER_FILL`).
7. A role whose name begins "Owner" (the shard's "Owner or general manager", "Owner-operator (...)") is the owner's own seat: it stands at nought heads, the owner's pay row stands for it (`recipes.ts` P2), and its stepper hires a manager. Its typical count still enters the floor area (the owner works on the floor).
8. A role's heads may be fractional where the shard holds a part-time role; a part head is one more hire at that fraction of the role's pay. Under the UK law each head is costed by `hireAllIn` at an adult's age, 30 (22 or over, under State Pension age). Off the UK model the Employment Allowance is spent once across the hires; on it the allowance is held spent on the crew the recipe's line already pays.
9. Rates in England take the recipe's own multiplier flag (`retailHospitalityLeisure`); a trade with no recipe takes the standard multiplier, said in the row.
10. Customers a day count every day of the year, 365; the line says so.
11. The answer zone holds two sections, the answer (the 40, a day at 16, the firms above it) and your margin (its 30), so no card holds a 40 beside a 30 (PART 4, "the hero holds the page's 40 ... never a 30 beside it"); the levers card's one 30 is the fixed costs a month, the month's is the profit a month, the opening section's the months to pay back.
12. What moves it most moves each input up one step, a tenth, and each role the team holds one more hire; a role at nought heads (the UK model's hires) is not a move. The five largest rises stand, as RankedBars' bars; its focal is the sales each 100 of fixed cost needs, 100 / (1 − v).
13. The signal marks the firms above break-even (the break-even placed among the place's firms: the share above it, by its fifth) and the margin (the reader's sales placed among the same firms, by its fifth), each only where the register's bands or a trusted cell's tenths hold the firms and they number twenty or more (`signal.ts`'s floor). Both measures are "higher is easier" and join the direction table with this spec named as their line.
14. "The site's existing switch" is the stored choice and the event of `src/components/CurrencySwitcher.tsx` over `src/lib/currency.ts`; fx.ts's header names currency.ts the display half and fx.ts the parse-time half. The engine counts in pounds for a UK place (the law's own currency) and dollars elsewhere; a UK figure shows exactly in pounds, in dollars at the site's pound rate (fx.ts, the trade page's own dollars), and in any other currency through dollars. The address holds base figures, so a link means one thing in every currency.
15. A place switch resets every lever to the new place's defaults; the address keeps the place.
16. Missing parameters: no country means London (a city with no country names no place: 404); a country with no city is "anywhere in" it; no trade means restaurants. Any parameter makes a view noindex.
17. The door carries the trade page's city where the calculator holds it as a city of that country; a region's trade page (California) carries its country and trade alone ("anywhere in" the United States).
18. "Where figures come from" is the page's one prose section, NoteList, one note for each kind of source, five at most.
19. The chain renders one view, the bare page (`calculator gb london restaurants`): offline it holds every default (the register, the valuation, the recipe, the law, the city's fit-out) and no loss, so FOCAL and the copy gates read the page in its whole form. The world path is held by Task 4B's static test and Task 9's photographs.

## What is true today (main c35e42a7; rhythm-air-inside 064f54df)

Read with `git -C E:/atlas/website show main:<path>`; line numbers drift, quoted text anchors.

- **The circular calculator.** `src/app/(site)/calculator/page.tsx` (122 lines): `export const revalidate = 86400;`, metadata with `alternates: { canonical: "/calculator" }`, the body `<CalculatorForm countries={...} industries={industries} />` inside `PageShell`, two cards to /compare and /browse. `src/components/CalculatorForm.tsx` (513 lines, `"use client"`): fetches `/api/cell-lookup`, `computeBreakeven(submittedIndustryId, submittedRevenue, null)` (:132), fixed costs a share of the typed revenue (`src/lib/economics/breakeven.ts:155-161`); its only importer is the page. `computeBreakeven` stays: six more callers (`adapt_cell.ts:172`, `home/beats.ts:258`, `markets/across_cities.ts:453`, `[country]/[geo]/[industry]/page.tsx:566`, `.../[sub]/page.tsx:307`, `scripts/verify_aov_city_tier.ts:45`). `src/components/spine2/Calc.tsx` and `calc-engine.ts` are /dev/cell2's calculator (`Ch02Calculator`) and stay; their laws are prior art (defaults reproduce the page, the address holds only differences, decode clamps). `src/app/dev/calculator/page.tsx` is a dev mockup and stays.
- **Baselines naming the two files.** `scripts/type_ladder_baseline.json`: `"src/app/(site)/calculator/page.tsx": 2` (:10), `"src/components/CalculatorForm.tsx": 5` (:85); `scripts/width_discipline_baseline.json`: entries for both (:48, :293).
- **The edge.** `src/middleware.ts` `CACHEABLE_PATTERNS` holds `/^\/calculator$/,` (:597) beside the note "/decide, /margin-index and /contact are deliberately still absent because they DO read searchParams". `src/lib/routing/route_shapes.ts` holds `["calculator"]` and the API shapes (`["api", "cell-lookup"]`); `scripts/gen_route_shapes.ts` writes the file and `tests/routing/edge_not_found.test.ts` reds when it is stale. `src/app/api/cell-lookup/route.ts:114`: `const limited = tooMany(req, "cell-lookup", 120);`.
- **The links that stand.** `src/app/(site)/tools/page.tsx:66-82` (the hub card, title "Find your break-even, and whether the owner gets paid"; its comment `:69-78` describes the old five fields), `src/components/SiteChrome.tsx:255`, `src/components/spine2/SiteFooter.tsx:125`, `src/app/not-found.tsx:56`; `src/lib/coverage/admin1.ts:13` and `src/lib/format/money.ts:10` name the form in comments.
- **The UK engine.** `src/lib/uk/pnl/model.ts`: `billAt`, `profitAt`, `keepsOfProfit`, `keepsAt`, `anchorFixed`, `breakEvenSales` (`pennies(anchorFixed(inputs) / (1 - total(inputs.variable)))`), `shareAboveBreakEven`, `afterTaxCostOf`, `summarise`. `src/lib/uk/pnl/london.ts`: `const LONDON = "E12000007";`, `londonWithholding(slug)`, `londonTradeInputs(slug, form)`, `londonTradeSummary`, `londonTradeRanges`. `inputs.ts`: `premisesFromValuation`, `anchorSalesFromBands`, `buildInputs(recipe, { revenueBandsK, premises, premisesCategory, place, form })`. `recipes.ts`: seven recipes; `utilitiesCarried: true` on restaurants, nail-salons and sports-fitness. `kinds.ts` `combineKinds`. `banded.ts` `bandCdf`, `bandMeanK`, `bandQuantile`, `inOpenBand`. `src/lib/spine/london_trade_hero.ts` `londonMoneyPrints(slug)` (withholding null and `utilitiesCarried === true`), the trade page's break-even through `londonTradeRanges` and `convertToUsd`.
- **London restaurants' rows.** `data/uk/registers/premises.json` E12000007 Restaurants: count 8170, floorspace 1656 (thousand m2), rv 362 a m2; E92000001 Restaurants: 28570, 6015, 195. `data/uk/registers/turnover.json` restaurants E12000007 bands `[625, 800, 2250, 1470, 1245, 725, 500, 140, 75, 30]`, 7,865 enterprises; E92000001 `[1665, 2735, 9700, 6540, 4515, 1935, 890, 215, 120, 45]`; its snapshot "March 2026 register snapshot".
- **The law.** `business_rates.ts` throws at a rateable value of 500,000 or more; 43p for retail, hospitality and leisure from 51,000, full relief to 12,000 and none from 15,000. `employer_cost.ts` `hireAllIn({ gross, age, apprentice?, allowanceRemaining? })`. `take_home.ts` `soleTraderTakeHome`, `bestCompanyTakeHome` (throws on a loss). `loan.ts` `annuity` (throws under one month). `money.ts` `pennies`, `sumPennies`. `params_2026_27.ts` `UK_2026_27.class1Secondary.employmentAllowance` 10,500, `businessRates.highValueThreshold` 500,000.
- **Provenance.** `src/lib/spine/provenance.ts:19-24`: `export type ProvenanceKind = "counted" | "worked out" | "looked up" | "estimate";`, `export type Provenance = { src: string; kind: ProvenanceKind };`, `provAttrs`. Every read of a provenance's kind in src, scripts and tests is a comparison to one of the four words. `scripts/harness/check_provenance.mjs:40`: `const KINDS = new Set(["counted", "worked out", "looked up", "estimate"]);`, a kind outside it a red, a page with no baseline a red unless seeded.
- **The shards and files the defaults read** (as read on 2026-10-13). `data/facts/city/GB-london.json`: `realestate.rent_secondary_usd_sqm_yr` 1750, `realestate.service_charge_usd_sqm_yr` 200, `realestate.fit_out_cost_usd_sqm` 1400, `realestate.deposit_months` 6, `owner_col.median_salary_usd_mo` 5131. `data/facts/city/DE-berlin.json`: 608, 40, 1100, 3, 3100. `data/facts/industry/restaurants.json`: `demand.spend_per_head_usd` 22; roles `owner_or_general_manager` 1 at 1.15, `head_chef_or_kitchen_lead` 1 at 1.1, `line_and_prep_cook` 4 at 0.72, `server_or_front-of-house` 4 at 0.62, `dishwasher_or_kitchen_porter` 1 at 0.55; `margin_ladder` 65 / 10 / 6.5. `data/facts/country/GB.json`: `financing.startup_loan_rate_pct` 7.5, `costs.commercial_rent_usd_sqm_yr` 1389 (DE 330). `data/economics/city_wage_premium_v1.json`: london 5400, berlin 4100 (a month, dollars). `src/lib/tax/country_rates_2024.json`: DE `employer_social` 0.197, GB 0.15, and a `default_fallback` that `getCountryTaxRates` returns for a country it does not hold (`hasCountrySpecificRates` says which). `data/finance/industry_cost_profile_v1.json` `food_drink`: `sqm_per_fte` 22, `cogs_share` 0.32, `energy_share` 0.025, `marketing_share` 0.025, `software_share` 0.012, `insurance_share` 0.018, `other_overhead_share` 0.028, `motor_vehicle_share` 0.012.
- **The accessors.** `cityFigure(iso2, slug, metric)`, `countryFigure(iso2, metric)`, `industryFigure(id, metric)`, `industryRows(id, prefix)` (each drops a placeholder: `store.ts`); `team_rows.ts` `shardRoles`, `countryMedianPay`, `roleLines`; `city_wages.ts` `getCityAnnualWageUsd`; `tax.ts` `hasCountrySpecificRates`, `getCountryTaxRates`; `open_rows.ts` `placeCostFactor`; `startup_capital_archetypes.ts` `startupCapitalArchetypeKeyed` (null on the 80,000 default); `setup_items.ts` `setupItemsFromCell` (grade A or B, scope the row's country); `cells/trust.ts` `isTrustedLocalCell`; `cells.ts` `getCellBySlug`, `withBudget(p, defaultValue, ms, label)`; `entry_bill_rows.ts` `ENTRY_BILL_METRICS.bill` (`"costs.license_setup_usd"`); `trade_net.ts` `LADDER_FILL`, `shardLadderNet`; `economics/country_metrics.ts` `getCountryEconomicsSnapshot(iso2).avgMonthlySalary`; `economic_profile` `getCountryProfile(iso2).bank_lending_rate_pct`; `economics/breakeven.ts` `getAovCityTierMultiplier`; `uk/present/precision.ts` `honestRound`; `spine/place_names.ts` `inSentence`; `uk/registers/register_city.ts` `UK_CITY_SLUGS`; `spine/provenance.ts` `registerSrc`.
- **The display.** `src/lib/finance/fx.ts`: GBP `per_usd: 1 / 1.3265`, `convertUsdTo`, `convertToUsd`. `src/lib/currency.ts`: `CURRENCIES` (USD, EUR, GBP, JPY, CAD, AUD), `convertFromUsd`. `src/components/CurrencySwitcher.tsx`: `getStoredCurrency`, `setStoredCurrency` (the `atlas:currency-change` event). `src/lib/spine/money.ts` `usd` prints -5000 as "$-5,000".
- **The levers.** `src/components/spine/interact/Range.tsx`: the typed figure carries `className="fig ..."` and no provenance, a fixed `$` prefix, `value={draft ?? Math.round(value).toLocaleString("en-US")}`. `HireLever.tsx`, `LoanLever.tsx`, `Switch.tsx` ("THE LAW: never a drawing out of sight").
- **The trade page's close.** `src/lib/spine/close_rows.ts` `buildTradeCloseDoors`: industry, place, the compare pill. `src/components/spine/archetypes/Terminus.tsx`: `export const DOOR_CAP = 3;`, `const live = doors.filter(...).slice(0, DOOR_CAP);`. `src/components/spine/cell/exit.tsx:195-199` `CloseCard` draws `<Terminus kicker={COPY.close.kicker} doors={doors} />`. `src/lib/spine/door_kinds.ts`: ten kinds, `LandingSurface`, `SURFACE_ANSWERS`. `scripts/verify_doors.ts`: `landingOf` (a static route answers `null`), `expectedAnswer`, the masthead query `[data-archetype="answer-card"][data-level="page"], [data-archetype="hero-board"][data-level="page"]`. `scripts/verify_archetype_copy.ts` holds the trade close at 3, 3 and 2 doors (`tradeCloseSeeds`).
- **The harness's twelve places** (plan 2026-10-09 Task 5, Step 7): `render_page.tsx` (`case "openings": ...` :101), `scripts/harness/pages.json`, `check_model_laws.mjs` `FLOOR_BY_SURFACE` (:373) with `data/seo/floor_census.json`, `docs/loop/CENSUS.md`, `check_page_links.mjs` `LINK_FLOOR` (:59) and `name.startsWith("openings-")` (:68), `verify_doors.ts` (`case "openings": return null;` :276), the ratchets (a new page held at zero), the four source gates that list each band page's view (`verify_banned_patterns.ts`, `verify_no_bold_display.ts`, `verify_no_eyebrow.ts`, `verify_subsection_icons.ts`) and `verify_bar_budget.ts`'s groups, the counts; `verify_launch_ready.ts` (:202, :218, :286), `tests/spine/page_foot.test.ts` (:46), `scripts/lib/loud_seats.ts` `SPINE_PAGES` (:39), `verify_art_direction.mjs` (its list of band-page surfaces in the comment above `const unread`).
- **The model's laws this page meets.** PART 4 (the 40 once; one 30 a section; "WHO HOLDS NO 30"); PART 6 (three accents, fills follow their figure, three bar-family cards, none two in a band or a column of neighbouring bands); PART 7 (one drawing a card; a section's basis line); 10.4 (a card stays only where the reader operates it); 10.8 (a rule in the law's currency); clauses 30, 36, 64, 65, 67. `check_model_laws.mjs` FOCAL judges every top-level `[data-block]` (one 30, or a 40; exempt forms by `data-archetype`: `note-list` and the sibling forms). `check_copy_plain.mjs`: its banned list (:86-95) and LINES (one supporting line a card, a lifted line marked `data-line`, `data-basis` or `data-placement`). `verify_bar_budget.ts`: hand-rolled fill bars and named primitives per page group. `tests/spine/spacing_pin.test.ts`: no `className="mb-2 flex items-center gap-2"`, no `data-focal="1"` outside the kit, no muted `<p>` ending in `basis}` outside the kit.

## The state this plan builds on (after rhythm-air-inside, home-quiet-editorial and country-page-journey)

Task 0, Step 2 checks each by grep; any difference stops the plan and goes to the controller with the file.

- **Rhythm:** `Rail` renders `<div class="mb-6" data-rail="">` and takes `level={2}`; `Focal` and `Basis` are exported by `src/components/spine/kit.tsx`; reader text is 14 (no `--t-micro` in the interact levers); FactRows draw no glyph; `scripts/lib/spine_scan.mjs` reads every new folder under `src/components/spine` from its first commit; gates `type-floor`, `type-floor-reader`, `fact-once`, `spacing-pin`, `zone-rhythm`, `tiles-openers`.
- **Home:** `tests/home/band.test.ts` reads `export type ProvenanceKind = (...)` from provenance.ts and requires its four words (so the fifth word lives in another type); `spine_scan.mjs` no longer names `home/` out; `FOCAL_EXEMPT_FORMS` holds `department`.
- **Country:** `src/lib/spine/owner_direction.ts` (`OWNER_DIRECTION`, `MeasureKey`, `OwnerDirection`, `directionOf`); `src/lib/spine/signal.ts` (`SignalState`, `Signalled`, `SIGNAL_SET_FLOOR`, `signalState(value, values, direction)`, `signalFor`); `src/components/spine/signal/Signal.tsx` (`Signal({ state, measure, size })`, `SignalKey()`); `Focal({ ..., placed, signal, noSignal })` and `FactRow` `placed`, `signal`, `noSignal`, `FactRows({ rows, className, answer })` (country Task 3A); `tests/spine/country_model.test.ts` `const WANT: Record<string, string> = {` ending with `"admin-ease": "none", "cost-of-living": "none",`; `scripts/harness/pages.json` holds country KH and DE; the gates `signal`, `signal-marks` (country renders only), `answer-fold`.

## Conventions for every task

- Commands from Git Bash, each `cd /e/atlas/website && ...` (Task 8's E:/atlas files `cd /e/atlas && ...`). tsx as `node node_modules/tsx/dist/cli.mjs`, never npx. Each verification `> scratchpad/calc/<file> 2>&1; echo "exit $?" >> scratchpad/calc/<file>`, read with the Read tool, never piped.
- RENDER, the page: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx calculator gb london restaurants` (writes `scratchpad/harness/pages/calculator-gb-london-restaurants.html`); another view: the same with its three slugs. Renders and browser checks one at a time, never beside the chain.
- GATES: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=<names>`; after a source change name `pages-fresh` first.
- COUNTS after a gate is added or removed, or a gate's path literals change (new files staged first): `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write`; `scripts/gates.json` and CLAUDE.md's generated block move, nothing else.
- CENSUS after a block is added or removed on a harness page: `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write --pages=scratchpad/calc/no-pages.md` (that path does not exist, so it writes `docs/loop/CENSUS.md` alone and leaves the design repo's PAGES.md to the controller).
- MEMORY before a typecheck, a render or a census: `node -e "const f=Math.round(require('os').freemem()/1048576);console.log(f+' MB free');process.exit(f>=1150?0:1)"`. TYPECHECK: exit 0 runs `node node_modules/typescript/bin/tsc --noEmit -p .`, exit 1 a scoped config under `scratchpad/calc/` (extends `../../tsconfig.json`, `incremental: false`, `include` the files touched plus `src/types` and `next-env.d.ts`). Under 1000 MB, wait and check again; never close an application.
- The words: every user-visible string is a key of `COPY.calculator` (or `COPY.tradeClose.runDoor`); the server hands the client the words in the seed, so no calculator file imports the copy table (the archetypes it draws, RankedBars and the foot lines, keep their own words).
- Names: the domain layer is `src/lib/simulator/`; the view is `src/components/spine/calculator/` (its folder is its page's name in `scripts/lib/loud_seats.ts`); the harness surface and the page key are `calculator` and `calculator-gb-london-restaurants`; the gates are `calc-*`.
- Edits holding a backslash go through the Edit tool. Keep each file's line endings (`git ls-files --eol <file>`). `country-view.tsx` and `city-view.tsx` are not touched.
- Commits: only the task's files; one commit per task unless the task says otherwise; the message `calc:<slug>: <what> (plan 2026-10-13 cost-simulator, Task <n>)`, then a blank line and exactly `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never switch branches, rebase, reset, stash, merge or amend. Records in the design repo (QUEUE.md, STATE.md, PAGES.md) are the controller's.
- A gate that cannot read what it holds reds: a module this plan creates is loaded with `import()` and a missing one is a red by name; a test whose render is missing reds with the remedy "run the pages-fresh gate", except where a step says DEFER.

## File map

| File | Task | Role |
|---|---|---|
| `scratchpad/calc/census.ts` | 0 | what the data holds for the defaults' rules (not committed) |
| `src/lib/spine/provenance.ts`, `scripts/harness/check_provenance.mjs` | 1 | the fifth kind word, "yours" |
| `src/lib/simulator/engine.ts` | 1 | the arithmetic, pure |
| `src/lib/simulator/uk_model.ts` | 1 | the first slice: model.ts's business as the engine's inputs |
| `tests/simulator/engine.test.ts` | 1 | gate `calc-engine` |
| `src/lib/uk/pnl/london.ts` | 2 | the geography a parameter (London's functions and words unchanged) |
| `src/lib/simulator/place.ts` | 2 | the place a view names, the pickers' lists, the UK cities' nations |
| `src/lib/simulator/bundle.ts` | 2 | the bundle's types, the reader's state, `toEngine`, `DEFAULT_PLACE` |
| `src/lib/simulator/cell_facts.ts`, `src/lib/simulator/load.ts` | 2 | a cell's facts (pure); the one database read (and, from 4B, the page's seed) |
| `src/lib/simulator/defaults.ts` | 2 | every default with its stamp, level and line (server) |
| `src/lib/spine/copy.ts` | 2, 6 | `COPY.calculator` (every word the page prints); `COPY.tradeClose.runDoor` |
| `tests/simulator/defaults.test.ts` | 2 | gate `calc-defaults` |
| `src/lib/simulator/respond.ts`, `src/app/api/calculator/route.ts`, `src/lib/routing/route_shapes.ts` | 3 | the place switch's answer and route |
| `tests/simulator/api.test.ts` | 3 | gate `calc-api` |
| `src/lib/simulator/display.ts`, `src/lib/simulator/bounds.ts`, `src/components/spine/interact/Range.tsx` | 4A | the money in the reader's currency; each lever's range; the lever empty and stamped |
| `tests/simulator/display.test.ts` | 4A | gate `calc-display` |
| `src/lib/spine/owner_direction.ts`, `src/lib/spine/signal.ts`, `tests/spine/country_model.test.ts` | 4B | the two measures; the state of a placed share |
| `src/lib/spine/door_kinds.ts`, `RankedBars.tsx`, `zones.tsx`, `NoteList.tsx`, `src/lib/spine/note_shape.ts`, `locals_rows.ts` | 4B | the kind `break-even`; a title's level; `STACKED`; a note's shape the browser may carry |
| `src/lib/simulator/seed.ts`, `src/components/spine/calculator/*`, `src/app/(site)/calculator/page.tsx` | 4B | the page |
| `scripts/lib/loud_seats.ts`, `verify_bar_budget.ts` and the four source gates | 4B | the page joins the source gates |
| `tests/simulator/page.test.ts` | 4B, 4C, 7 | gate `calc-page` |
| `render_page.tsx`, `pages.json`, the floors, the link floor, `verify_doors.ts`, `page_foot.test.ts`, `verify_launch_ready.ts`, `verify_art_direction.mjs`, the baselines at zero | 4C | the page joins the chain's renders |
| `src/lib/simulator/state.ts`, `src/lib/simulator/seo.ts`, `src/middleware.ts` | 5 | the address, its robots, the edge |
| `tests/simulator/state.test.ts` | 5 | gate `calc-state` |
| `src/lib/spine/close_rows.ts`, `Terminus.tsx`, `src/components/spine/cell/exit.tsx`, `cell-view.tsx`, `stories.tsx`, `scripts/verify_doors.ts`, `scripts/verify_archetype_copy.ts` | 6 | the door |
| `tests/simulator/door.test.ts` | 6 | gate `calc-door` |
| `src/components/CalculatorForm.tsx` (deleted) and its baselines and comments | 7 | the circular form leaves |
| E:/atlas `design/loop/build/briefs/MODEL.md`; website `docs/design-system/GUIDELINES.md` | 8 | the written rules |

---

### Task 0: The ground and the before

**Files:**
- Create (scratch, never committed): `scratchpad/calc/census.ts`, `scratchpad/calc/before/*`, `scratchpad/calc/shots/*`

**Interfaces:**
- Produces: `scratchpad/calc/before/census.txt` (the counts Task 2's rules and Review Focus 3 cite); the before render and photographs of the trade page's close (Task 6 compares); `scratchpad/calc/before/state.txt` (Step 2's greps).

- [ ] **Step 1: The branch (the controller's).** When `country-page-journey` has completed its Task 8 (or `main`, once the controller has merged it): from E:/atlas/website, clean, `git switch -c cost-simulator`. Then `mkdir -p scratchpad/calc/before scratchpad/calc/after scratchpad/calc/shots`.

- [ ] **Step 2: The state this plan builds on, checked.** Each to its own file with the exit line:

```bash
cd /e/atlas/website && git log --oneline -120 > scratchpad/calc/t0-log.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-log.txt
cd /e/atlas/website && git grep -n 'className="mb-6" data-rail=""\|^export function Focal\|^export function Basis' -- src/components/spine/kit.tsx > scratchpad/calc/t0-kit.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-kit.txt
cd /e/atlas/website && git grep -n "placed = null, signal = null, noSignal = null\|placed?: MeasureKey | null" -- src/components/spine/kit.tsx src/components/spine/archetypes/FactRows.tsx > scratchpad/calc/t0-placed.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-placed.txt
cd /e/atlas/website && git grep -n "^export function Signal\|^export function SignalKey\|^export function signalState\|^export const SIGNAL_SET_FLOOR\|^export const OWNER_DIRECTION\|^export function directionOf" -- src/components/spine/signal/Signal.tsx src/lib/spine/signal.ts src/lib/spine/owner_direction.ts > scratchpad/calc/t0-signal.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-signal.txt
cd /e/atlas/website && git grep -n '"admin-ease": "none", "cost-of-living": "none",' -- tests/spine/country_model.test.ts > scratchpad/calc/t0-want.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-want.txt
cd /e/atlas/website && git grep -n "export type ProvenanceKind = " -- src/lib/spine/provenance.ts tests/home/band.test.ts > scratchpad/calc/t0-prov.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-prov.txt
cd /e/atlas/website && git grep -n "SPINE_ROOT}/home/" -- scripts/lib/spine_scan.mjs > scratchpad/calc/t0-scan.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-scan.txt
cd /e/atlas/website && git grep -n '"surface": "country"' -- scripts/harness/pages.json > scratchpad/calc/t0-pages.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-pages.txt
cd /e/atlas/website && git grep -n "const FLOOR_BY_SURFACE = \|const FOCAL_EXEMPT_FORMS = " -- scripts/harness/check_model_laws.mjs > scratchpad/calc/t0-laws.txt 2>&1; echo "exit $?" >> scratchpad/calc/t0-laws.txt
```

Expected: the log holds the three plans' commits (`rhythm:`, `home:`, `journey:`), the last `journey:` commit among the newest; kit three hits (exit 0); placed two hits, one in each file (exit 0); signal six hits (exit 0); want one hit (exit 0); prov one hit in provenance.ts, and band.test.ts's regex reading it (two hits, exit 0); scan no hit (exit 1, which is the expected answer: home is read); pages four or more country entries (GB, AF, KH, DE); laws two hits, `FOCAL_EXEMPT_FORMS` holding `department`. Record `FLOOR_BY_SURFACE`'s line as it stands (the country plan lowered its country entry; Task 4C appends to whatever it holds). Any other answer stops the plan and goes to the controller with the file.

- [ ] **Step 3: What the data holds.** Write `scratchpad/calc/census.ts`:

```ts
// scratchpad/calc/census.ts (plan 2026-10-13 cost simulator, Task 0): what the files hold for the defaults' rules, counted, not remembered.
// Not a gate, never committed. usage: node node_modules/tsx/dist/cli.mjs scratchpad/calc/census.ts
import cityListJson from "../../data/cities/city_list_v1.json";
import { cityFigure } from "../../src/lib/facts/city_shard";
import { countryFigure } from "../../src/lib/facts/country_shard";
import { industryFigure } from "../../src/lib/facts/industry_shard";
import { shardRoles } from "../../src/lib/spine/team_rows";
import { hasCountrySpecificRates } from "../../src/lib/tax";
import { shardLadderNet } from "../../src/lib/spine/trade_net";
import { startupCapitalArchetypeKeyed } from "../../src/lib/markets/startup_capital_archetypes";
import { getCityAnnualWageUsd } from "../../src/lib/economic_profile/city_wages";
import { COUNTRIES, INDUSTRIES, industryToSlug, isDefaultVisible } from "../../src/lib/taxonomy";

const cities = (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities;
const lacking = (metric: string) => cities.filter((c) => !cityFigure(c.iso2, c.slug, metric)).map((c) => `${c.iso2}-${c.slug}`);
const trades = INDUSTRIES.filter(isDefaultVisible);
const lines: string[] = [];
const say = (label: string, xs: string[]) => lines.push(`${label}: ${xs.length}${xs.length ? ` (${xs.slice(0, 12).join(", ")}${xs.length > 12 ? ", ..." : ""})` : ""}`);
say("cities without a secondary shop rent", lacking("realestate.rent_secondary_usd_sqm_yr"));
say("cities without a service charge", lacking("realestate.service_charge_usd_sqm_yr"));
say("cities without a fit-out cost", lacking("realestate.fit_out_cost_usd_sqm"));
say("cities without a deposit", lacking("realestate.deposit_months"));
say("cities without an owner's median salary", lacking("owner_col.median_salary_usd_mo"));
say("cities without a city wage", cities.filter((c) => getCityAnnualWageUsd(c.slug) == null).map((c) => `${c.iso2}-${c.slug}`));
say("countries without their own employer rate", COUNTRIES.filter((c) => !hasCountrySpecificRates(c.code)).map((c) => c.code));
say("countries without a commercial rent", COUNTRIES.filter((c) => !countryFigure(c.code, "costs.commercial_rent_usd_sqm_yr")).map((c) => c.code));
say("countries without a registration bill", COUNTRIES.filter((c) => !countryFigure(c.code, "costs.license_setup_usd")).map((c) => c.code));
say("trades offered (default-visible)", trades.map((t) => t.id));
say("trades with no roles on their shard", trades.filter((t) => shardRoles(t.id).length === 0).map((t) => t.id));
say("trades with an owner's seat", trades.filter((t) => shardRoles(t.id).some((r) => /^owner\b/i.test(r.role))).map((t) => t.id));
say("trades whose spend per head is 0 or absent", trades.filter((t) => !((industryFigure(t.id, "demand.spend_per_head_usd")?.value ?? 0) > 0)).map((t) => t.id));
say("trades on the 42/10/5 ladder", trades.filter((t) => shardLadderNet(t.id)?.fill).map((t) => t.id));
say("trades on the 80,000 archetype default", trades.filter((t) => startupCapitalArchetypeKeyed(industryToSlug(t.id)) == null).map((t) => t.id));
console.log(lines.join("\n"));
```

The memory line, then `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs scratchpad/calc/census.ts > scratchpad/calc/before/census.txt 2>&1; echo "exit $?" >> scratchpad/calc/before/census.txt`. Expected: exit 0 and fifteen lines. The report quotes the counts; Task 2's test uses the store for Review Focus 3 whatever the count of cities without a rent, and names the first such city here if there is one.

- [ ] **Step 4: The before of the trade page's close.** The memory line; `render_page.tsx cell gb london restaurants` to `scratchpad/calc/before/render-cell.txt` (exit 0); copy `scratchpad/harness/pages/cell-gb-london-restaurants.html` to `scratchpad/calc/before/`; then, one at a time, `node scripts/harness/shoot_page.mjs scratchpad/calc/before/cell-gb-london-restaurants.html "#close" scratchpad/calc/shots/before-close 1280,768,375 > scratchpad/calc/before/shoot-close.txt 2>&1; echo "exit $?" >> scratchpad/calc/before/shoot-close.txt` and `node node_modules/tsx/dist/cli.mjs scripts/verify_doors.ts --out=scratchpad/calc/before/doors.txt > scratchpad/calc/before/doors-run.txt 2>&1; echo "exit $?" >> scratchpad/calc/before/doors-run.txt` (it reads every render the list names; exit 0). Read the photographs: three doors, the pill last.

- [ ] **Step 5: The before of the old page.** It is no harness surface. Where the network is up, one browser and nothing beside it: `node scripts/harness/shoot_page.mjs https://www.marginatlas.com/calculator "main" scratchpad/calc/shots/before-calculator 1280,768,375 > scratchpad/calc/before/shoot-calculator.txt 2>&1; echo "exit $?" >> scratchpad/calc/before/shoot-calculator.txt`; where it is not, the report says so and the before is the code read above. Read each picture.

---

### Task 1: The engine and the first slice

The spec's first slice lands here: London's three money trades (restaurants, nail salons, sports and fitness) on model.ts as it stands give the engine's break-even to the penny, before any world default exists.

**Files:**
- Modify: `src/lib/spine/provenance.ts` (the type `StampKind`; `Provenance` and `provAttrs` take it)
- Modify: `scripts/harness/check_provenance.mjs` (`KINDS` holds "yours"; the header and the wrong-kind red say so)
- Create: `src/lib/simulator/engine.ts`, `src/lib/simulator/uk_model.ts`
- Test: `tests/simulator/engine.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-engine` after `provenance`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `pennies`, `sumPennies` (`src/lib/uk/law/money.ts`); `businessRates({ rateableValue, retailHospitalityLeisure })` (`business_rates.ts`, throws at 500,000); `hireAllIn({ gross, age, allowanceRemaining })` returning `{ allowanceUsed, allIn }` (`employer_cost.ts`); `annuity({ principal, annualRatePct, months })` returning `{ monthly }` (`loan.ts`); `soleTraderTakeHome(p).takeHome`, `bestCompanyTakeHome(p).takeHome` (`take_home.ts`); `UK_2026_27.class1Secondary.employmentAllowance`, `UK_2026_27.businessRates.highValueThreshold`; `bandCdf(counts, xK)` (`src/lib/uk/pnl/banded.ts`); `PnlInputs`, `Share` (`model.ts`); `RECIPES` (`recipes.ts`); `own` (`src/lib/own.ts`); `registerSrc` (`provenance.ts`).
- Produces (`src/lib/spine/provenance.ts`): `export type StampKind = ProvenanceKind | "yours"`; `Provenance = { src: string; kind: StampKind }`; `provAttrs` returns `"data-kind"?: StampKind`. `ProvenanceKind` keeps its four words.
- Produces (`src/lib/simulator/engine.ts`): `type Stamp = { src: string; kind: StampKind }`; `type Held = { v: number; stamp: Stamp }`; `type Value = Held | null`; `type Line = { key; amountYear; stamp }`; `type Share = { key; share; stamp }`; `type Role = { key; heads: number; headsStamp: Stamp; payYear: Value }`; `type OnCost = { law: "uk"; allowance: boolean } | { rate: Held } | null`; `type Form = "sole trader" | "company"`; `type Tax = { law: "uk"; form: Form } | { law: "none" }`; `type Spread = { kind: "bands"; revenueBandsK: readonly number[]; stamp } | { kind: "tenths"; p10; p25; p50; p75; p90; firms; stamp }`; `type EngineInputs` (fields in Step 5); `type Reason = "needs" | "no-margin" | "no-sales" | "loss" | "no-ticket" | "no-opening" | "no-target" | "no-tax" | "no-spread" | "beyond-spread" | "out-of-reach"`; `type Out = { held: true; value: number; kind: ProvenanceKind; yours: boolean } | { held: false; reason: Reason; needs?: string[] }`; `type BillLine = { key; year; part: "variable" | "fixed" | "owner"; kind: ProvenanceKind; yours: boolean; src: string }`; `type Move = { key; rise; kind; yours }`; `type EngineResult` (fields in Step 5); `combineStamps(stamps) => { kind: ProvenanceKind; yours: boolean }`; `afterTaxProfit(profit, ownerPay, tax, addBack?) => number`; `profitForAfterTax(target, ownerPay, tax, addBack?) => number | null`; `simulate(inputs) => EngineResult`; `MOVES_MAX = 5`. Bill keys: `rent`, `rates`, `service`, `line:<key>`, `team:<role>`, `loan`, `share:<key>` (the running share is `share:running`), `owner`. Move keys: `area`, `rent`, `service`, `line:<key>`, `hire:<role>`, `pay`, `goods`, `running`, `owner`, `loan`.
- Produces (`src/lib/simulator/uk_model.ts`): `STAFF_DRIVER`; `ukModelInputs(model: PnlInputs, ctx: { trade: string; geography: string }) => EngineInputs` (lines `crew` and `running`, no roles, sales null).

- [ ] **Step 1: Write the failing test** `tests/simulator/engine.test.ts`:

```ts
/**
 * THE COST SIMULATOR'S ARITHMETIC (plan 2026-10-13 cost-simulator, Task 1; spec E:/atlas/docs/superpowers/specs/2026-10-13-cost-simulator-design.md,
 * section 3, Gates: "a new engine test pins the break-even arithmetic (F / (1 - v), the owner's pay in F, a loss shown as a loss, payback withheld at
 * a loss) against hand-worked cases for London restaurants and one place outside the UK").
 *
 * THE FIRST SLICE (spec section 2): London's three money trades on model.ts as it stands give the engine's break-even to the penny, its profit at the
 * anchor's sales and the sole trader's keeps of it. THE HAND-WORKED CASES: London restaurants (the register, the valuation, the recipe and the law,
 * summed in the plan's Task 1) and Berlin restaurants (R7 4.1's rows as the files held them on 2026-10-13). Then Review Focus 1, 2 and 4: a loss, a
 * sale that costs all it brings, no sales, extremes.
 * BLIND SPOT, stated: it proves the arithmetic on what it is handed; that a default is the right default is tests/simulator/defaults.test.ts's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/engine.test.ts
 */
import type { EngineInputs, Out, Stamp } from "../../src/lib/simulator/engine";
import { pennies } from "../../src/lib/uk/law/money";
import { soleTraderTakeHome } from "../../src/lib/uk/law/take_home";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-engine";
const FILE = "src/lib/simulator/engine.ts";
const REMEDY = "the engine is F / (1 - v) on absolute inputs: every fixed line and the owner's pay in F, each share of a sale in v, a loss printed as a loss, no break-even where a sale costs all it brings, the payback withheld at a loss, nothing filled";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const est = (src: string): Stamp => ({ src, kind: "estimate" });
const won = (src: string): Stamp => ({ src, kind: "worked out" });
const mine = (key: string): Stamp => ({ src: `calculator:lever:${key}`, kind: "yours" });
const v = (x: number, stamp: Stamp) => ({ v: x, stamp });
const value = (o: Out): number | null => (o.held ? o.value : null);
const reason = (o: Out): string | null => (o.held ? null : o.reason);
/* JSON.stringify writes NaN and Infinity as null, so the scan walks the values. */
const nonFinite = (x: unknown): boolean => (typeof x === "number" ? !Number.isFinite(x) : Array.isArray(x) ? x.some(nonFinite) : x !== null && typeof x === "object" ? Object.values(x as Record<string, unknown>).some(nonFinite) : false);

function blank(): EngineInputs {
  return { area: null, rentPerM2: null, serviceChargePerM2: null, rates: null, lines: [], roles: [], onCost: null, variable: [], runningShare: null, ownerPay: null, targetProfit: null, sales: null, ticket: null, openingCost: null, loan: { amount: null, ratePct: null, years: null }, tax: { law: "none" }, spread: null };
}

/* BERLIN RESTAURANTS, R7 4.1's rows as the files held them on 2026-10-13, in dollars: 22 m2 a worker (data/finance/industry_cost_profile_v1.json,
   food_drink) for the shard's eleven typical heads, the owner's seat among them, is 242 m2; secondary rent 608 and service charge 40 a m2 a year
   (data/facts/city/DE-berlin.json); the city's wage, 4,100 a month (data/economics/city_wage_premium_v1.json), times 12 times each role's index
   (1.15, 1.1, 0.72, 0.62, 0.55, data/facts/industry/restaurants.json); Germany's employer rate 0.197 (src/lib/tax/country_rates_2024.json); food
   32% and fees 4% of each sale and running costs 12% (the restaurants recipe, its line that pays no staff); spend per head 22. */
function berlin(): EngineInputs {
  const wage = 4100 * 12;
  const role = (key: string, heads: number, index: number) => ({ key, heads, headsStamp: est(`facts/industry/restaurants.json:roles.${key}`), payYear: v(pennies(wage * index), est(`economics/city_wage_premium_v1.json:berlin x ${index}`)) });
  return {
    ...blank(),
    area: v(242, est("finance/industry_cost_profile_v1.json:food_drink.sqm_per_fte x 11")),
    rentPerM2: v(608, est("facts/city/DE-berlin.json:realestate.rent_secondary_usd_sqm_yr")),
    serviceChargePerM2: v(40, est("facts/city/DE-berlin.json:realestate.service_charge_usd_sqm_yr")),
    roles: [role("owner_or_general_manager", 0, 1.15), role("head_chef_or_kitchen_lead", 1, 1.1), role("line_and_prep_cook", 4, 0.72), role("server_or_front_of_house", 4, 0.62), role("dishwasher_or_kitchen_porter", 1, 0.55)],
    onCost: { rate: v(0.197, est("tax/country_rates_2024.json:DE.employer_social")) },
    variable: [{ key: "food and drink", share: 0.32, stamp: est("uk/pnl/recipes.ts:restaurants:food and drink") }, { key: "marketing and delivery fees", share: 0.04, stamp: est("uk/pnl/recipes.ts:restaurants:marketing and delivery fees") }],
    runningShare: v(0.12, est("uk/pnl/recipes.ts:restaurants:utilities, supplies, running costs")),
    ticket: v(22, est("facts/industry/restaurants.json:demand.spend_per_head_usd")),
  };
}

async function main(): Promise<void> {
  const E = await import("../../src/lib/simulator/engine").catch(() => null);
  const U = await import("../../src/lib/simulator/uk_model").catch(() => null);
  check("the engine is there", !!E);
  check("the first slice's adapter is there", !!U, "src/lib/simulator/uk_model.ts");
  if (!E || !U) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const L = await import("../../src/lib/uk/pnl/london");
  const M = await import("../../src/lib/uk/pnl/model");
  const results: unknown[] = [];
  const run = (i: EngineInputs) => { const r = E.simulate(i); results.push(r); return r; };

  /* LONDON RESTAURANTS BY HAND: the register's mean under 5m, 597,440.87 (turnover.json, E12000007); the average premises, 1,656,000 m2 over
     8,170 premises at 362 a m2 (premises.json) = 73,374.79 of rent; rates at 43p on it = 31,551.16; the recipe's staff 30% and running 12% of the
     anchor = 179,232.26 and 71,692.90; F = 355,851.11; v = 32% + 4%; R* = 355,851.11 / 0.64 = 556,017.36. */
  const m = L.londonTradeInputs("restaurants");
  check("model.ts builds London restaurants", !!m, "src/lib/uk/pnl/london.ts");
  if (!m) { redSummary(RULE, failed, REMEDY, "no London inputs"); process.exit(1); }
  const london = U.ukModelInputs(m, { trade: "restaurants", geography: "E12000007" });
  const lr = run(london);
  const line = (key: string) => lr.bill.find((b) => b.key === key)?.year ?? null;
  check(`the anchor is 597,440.87 (${m.anchorSales.value})`, m.anchorSales.value === 597440.87, "src/lib/uk/pnl/inputs.ts");
  check(`London's bill by hand: rent 73,374.79, rates 31,551.16, staff 179,232.26, running 71,692.90 (${line("rent")}, ${line("rates")}, ${line("line:crew")}, ${line("line:running")})`, line("rent") === 73374.79 && line("rates") === 31551.16 && line("line:crew") === 179232.26 && line("line:running") === 71692.9);
  check(`F = 355,851.11 and R* = 355,851.11 / (1 - 0.36) = 556,017.36 (${value(lr.fixedYear)}, ${value(lr.breakEven)})`, value(lr.fixedYear) === 355851.11 && value(lr.breakEven) === 556017.36);
  check(`with no sales the bill stands at the break-even and the margin waits for sales (${lr.billAt}, ${reason(lr.marginBefore)})`, lr.billAt === "break-even" && reason(lr.marginBefore) === "no-sales" && reason(lr.profit) === "no-sales");
  check(`each 100 of fixed cost needs 156.25 of sales (${value(lr.perHundred)})`, value(lr.perHundred) === 156.25);
  check(`the outputs rest on the recipe's shares, so they are estimates, and nothing is the reader's (${lr.breakEven.held ? `${lr.breakEven.kind}, ${lr.breakEven.yours}` : "withheld"})`, lr.breakEven.held && lr.breakEven.kind === "estimate" && !lr.breakEven.yours);

  /* THE FIRST SLICE: London's three money trades against model.ts as it stands. */
  for (const slug of ["restaurants", "nail-salons", "sports-fitness"]) {
    const mm = L.londonTradeInputs(slug);
    if (!mm) { check(`${slug}: model.ts builds London's inputs`, false, "src/lib/uk/pnl/london.ts"); continue; }
    const at = mm.anchorSales.value;
    const r = run(U.ukModelInputs(mm, { trade: slug, geography: "E12000007" }));
    const rA = run({ ...U.ukModelInputs(mm, { trade: slug, geography: "E12000007" }), sales: v(at, won("anchor")) });
    check(`${slug}: the break-even is model.ts's to the penny (${value(r.breakEven)} against ${M.breakEvenSales(mm)})`, value(r.breakEven) === M.breakEvenSales(mm));
    check(`${slug}: the profit at the anchor's sales is model.ts's (${value(rA.profit)} against ${M.profitAt(at, mm)})`, value(rA.profit) === M.profitAt(at, mm));
    check(`${slug}: the sole trader keeps model.ts's keeps of it (${value(rA.profitAfterTax)} against ${M.keepsOfProfit(M.profitAt(at, mm), "sole trader")})`, value(rA.profitAfterTax) === M.keepsOfProfit(M.profitAt(at, mm), "sole trader"));
    check(`${slug}: the share of firms above the break-even is model.ts's (${value(r.shareAbove)} against ${M.shareAboveBreakEven(mm)})`, value(r.shareAbove) === M.shareAboveBreakEven(mm));
  }

  /* THE REGISTER'S BANDS PLACE THE BREAK-EVEN AND THE SALES, log-flat inside a band (banded.ts): 556,017.36 lies in the 500k to 1m band. */
  const cdfAt = (x: number) => (5145 + (1245 * Math.log(x / 500000)) / Math.log(2)) / 7860;
  const lA = run({ ...london, sales: v(597440.87, won("anchor")) });
  check(`firms above London's break-even, by hand: 1 - (5,145 + 1,245 x log2(556,017.36 / 500,000)) / 7,860 (${value(lr.shareAbove)}), of ${lr.firms} firms`, Math.abs((value(lr.shareAbove) ?? -1) - (1 - cdfAt(556017.36))) < 1e-9 && lr.firms === 7860);
  check(`the anchor's sales sit above ${Math.round(cdfAt(597440.87) * 100)}% of the firms (${value(lA.salesRank)})`, Math.abs((value(lA.salesRank) ?? -1) - cdfAt(597440.87)) < 1e-9);

  /* BERLIN BY HAND: the team 64,781.64 + 4 x 42,402.53 + 4 x 36,513.29 + 32,390.82 = 412,835.74 (each head's pay plus 19.7% of it, rounded
     first); rent 242 x 608 = 147,136; service 242 x 40 = 9,680; F = 569,651.74; v = 0.48; R* = 569,651.74 / 0.52 = 1,095,484.12; customers a day
     1,095,484.12 / 22 / 365 = 136.4. */
  const b = run(berlin());
  const team = b.bill.filter((x) => x.key.startsWith("team:")).reduce((a, x) => a + Math.round(x.year * 100), 0) / 100;
  check(`Berlin's team, rent and service: 412,835.74, 147,136, 9,680 (${team}, ${b.bill.find((x) => x.key === "rent")?.year}, ${b.bill.find((x) => x.key === "service")?.year})`, team === 412835.74 && b.bill.find((x) => x.key === "rent")?.year === 147136 && b.bill.find((x) => x.key === "service")?.year === 9680);
  check(`no rates outside England (${b.bill.some((x) => x.key === "rates")})`, !b.bill.some((x) => x.key === "rates"));
  check(`Berlin's F 569,651.74, v 0.48, R* 1,095,484.12 (${value(b.fixedYear)}, ${value(b.variableShare)}, ${value(b.breakEven)})`, value(b.fixedYear) === 569651.74 && Math.abs((value(b.variableShare) ?? 0) - 0.48) < 1e-12 && value(b.breakEven) === 1095484.12);
  check(`136 customers a day (${value(b.customersADay)})`, Math.round(value(b.customersADay) ?? 0) === 136);
  check(`the owner's seat costs nothing at nought heads (${b.bill.some((x) => x.key === "team:owner_or_general_manager")})`, !b.bill.some((x) => x.key === "team:owner_or_general_manager"));

  /* THE OWNER'S PAY IN F: 40,000 before tax lifts the break-even to 609,651.74 / 0.52 = 1,172,407.19; without it, 1,095,484.12. */
  const bw = run({ ...berlin(), ownerPay: v(40000, mine("owner")) });
  check(`the owner's pay is in F (${value(bw.breakEven)} with, ${value(bw.breakEvenBusiness)} without)`, value(bw.breakEven) === 1172407.19 && value(bw.breakEvenBusiness) === 1095484.12);
  check("the owner's pay is a line of the bill, and an output resting on it says it is the reader's", bw.bill.some((x) => x.key === "owner" && x.year === 40000 && x.part === "owner") && bw.breakEven.held && bw.breakEven.yours && !(bw.breakEvenBusiness.held && bw.breakEvenBusiness.yours));

  /* REVIEW FOCUS 1, A LOSS: at 800,000 the shares take 384,000 and F 569,651.74, so the year loses 153,651.74; the payback waits. */
  const loss = run({ ...berlin(), sales: v(800000, mine("sales")), openingCost: v(300000, mine("opening")) });
  check(`a loss is printed as a loss (${value(loss.profit)}, margin ${value(loss.marginBefore)})`, value(loss.profit) === -153651.74 && Math.abs((value(loss.marginBefore) ?? 0) + 0.192064675) < 1e-9);
  check(`no payback at a loss, and the bill stands at the reader's sales (${reason(loss.paybackMonths)}, ${loss.billAt})`, reason(loss.paybackMonths) === "loss" && loss.billAt === "sales" && loss.bill.find((x) => x.key === "share:food and drink")?.year === 256000);
  check(`outside the UK the margin after tax says why it is missing (${reason(loss.marginAfter)})`, reason(loss.marginAfter) === "no-tax" && reason(loss.profitAfterTax) === "no-tax");
  const pay = run({ ...berlin(), sales: v(1500000, mine("sales")), openingCost: v(300000, mine("opening")) });
  check(`the payback: 300,000 over 210,348.26 / 12 a month is 17.1, so 18 months (${value(pay.paybackMonths)})`, value(pay.paybackMonths) === 18);

  /* REVIEW FOCUS 1, A SALE THAT COSTS ALL IT BRINGS: no break-even is printed and no division by nothing or by a negative happens. */
  for (const total of [1.05, 1]) {
    const r2 = run({ ...berlin(), variable: [{ key: "goods", share: total - 0.12, stamp: est("t") }], sales: v(800000, mine("sales")) });
    check(`shares summing to ${total}: no break-even, no customers a day, no sales per 100 (${reason(r2.breakEven)}, ${reason(r2.customersADay)}, ${reason(r2.perHundred)}), the year a loss (${value(r2.profit)})`, reason(r2.breakEven) === "no-margin" && reason(r2.customersADay) === "no-margin" && reason(r2.perHundred) === "no-margin" && (value(r2.profit) ?? 0) < 0 && r2.moves.length === 0);
  }

  /* REVIEW FOCUS 2, NO SALES: cleared (null) and typed as 0. */
  for (const sales of [null, v(0, mine("sales"))]) {
    const r = run({ ...berlin(), sales, openingCost: v(300000, mine("opening")) });
    check(`sales ${sales ? "0" : "cleared"}: the margin, the profit and the payback wait for sales, the break-even and customers a day still print (${reason(r.marginBefore)}, ${reason(r.profit)}, ${reason(r.paybackMonths)}, ${value(r.breakEven)}, ${r.billAt})`, reason(r.marginBefore) === "no-sales" && reason(r.profit) === "no-sales" && reason(r.paybackMonths) === "no-sales" && value(r.breakEven) === 1095484.12 && r.customersADay.held && r.billAt === "break-even");
  }

  /* TAX: the UK law on top of the owner's draw; a loss pays none; the profit that leaves a target after tax. */
  const sole = { law: "uk" as const, form: "sole trader" as const };
  check(`with 20,000 drawn, 10,000 more profit keeps st(30,000) - st(20,000) (${E.afterTaxProfit(10000, 20000, sole)})`, E.afterTaxProfit(10000, 20000, sole) === pennies(soleTraderTakeHome(30000).takeHome - soleTraderTakeHome(20000).takeHome));
  check("a loss pays no tax", E.afterTaxProfit(-5000, 0, sole) === -5000);
  const p = E.profitForAfterTax(20000, 0, sole);
  const lt = run({ ...london, targetProfit: v(20000, mine("target")) });
  check(`20,000 after tax needs a profit p within two pounds, and sales of (F + p) / 0.64 (${p}, ${value(lt.targetSales)})`, p !== null && E.afterTaxProfit(p, 0, sole) >= 20000 && E.afterTaxProfit(p - 2, 0, sole) < 20000 && value(lt.targetSales) === pennies((355851.11 + p) / 0.64));
  const bt = run({ ...berlin(), targetProfit: v(50000, mine("target")) });
  check(`outside the UK the target stands before tax: (569,651.74 + 50,000) / 0.52 = 1,191,637.96 (${value(bt.targetSales)})`, value(bt.targetSales) === 1191637.96);

  /* WHAT MOVES IT MOST: each input up a tenth or one more hire, the five largest rises. */
  check(`Berlin: a second head chef moves it most, 634,433.38 / 0.52 - 1,095,484.12 = 124,580.07 (${b.moves[0]?.key} ${b.moves[0]?.rise})`, b.moves[0]?.key === "hire:head_chef_or_kitchen_lead" && b.moves[0]?.rise === 124580.07);
  check("no role at nought heads is a move, at most five moves, largest first", !b.moves.some((x) => x.key === "hire:owner_or_general_manager") && b.moves.length <= E.MOVES_MAX && b.moves.every((x, k) => k === 0 || b.moves[k - 1].rise >= x.rise));
  check(`London: dearer goods first, 355,851.11 / 0.604 - 556,017.36 = 33,140.11, five moves and no hire (${lr.moves.map((x) => `${x.key} ${x.rise}`).join(", ")})`, lr.moves.length === 5 && lr.moves[0].key === "goods" && lr.moves[0].rise === 33140.11 && !lr.moves.some((x) => x.key.startsWith("hire:")));

  /* SPREADS: a trusted cell's tenths, read straight between its five points, and nothing past them. */
  const tenths = { kind: "tenths" as const, p10: 100000, p25: 200000, p50: 300000, p75: 400000, p90: 500000, firms: 40, stamp: est("cells:x") };
  const base = { ...blank(), area: v(100, est("t")), rentPerM2: v(1000, est("t")), variable: [{ key: "goods", share: 0.5, stamp: est("t") }], spread: tenths };
  const t = run({ ...base, lines: [{ key: "fixed", amountYear: 25000, stamp: est("t") }] });
  check(`a break-even of 250,000 between the 25th and 50th points is above 37.5% of the firms (${value(t.breakEven)}, ${value(t.shareAbove)})`, value(t.breakEven) === 250000 && Math.abs((value(t.shareAbove) ?? 0) - 0.625) < 1e-12 && t.firms === 40);
  const far = run({ ...base, lines: [{ key: "fixed", amountYear: 200000, stamp: est("t") }] });
  check(`a break-even past the 90th point is not placed (${reason(far.shareAbove)})`, reason(far.shareAbove) === "beyond-spread");
  check(`no spread, no share (${reason(b.shareAbove)})`, reason(b.shareAbove) === "no-spread");

  /* KINDS: an output is worked out only when every input is counted, looked up or worked out; a reader's figure is "yours" on the output. */
  check("counted and looked up combine to worked out", JSON.stringify(E.combineStamps([{ src: "a", kind: "counted" }, { src: "b", kind: "looked up" }])) === JSON.stringify({ kind: "worked out", yours: false }));
  check("an estimate makes an estimate, and so does nothing", E.combineStamps([{ src: "a", kind: "counted" }, est("b")]).kind === "estimate" && E.combineStamps([]).kind === "estimate");
  check("a reader's figure makes an estimate that is the reader's", JSON.stringify(E.combineStamps([mine("area"), { src: "b", kind: "counted" }])) === JSON.stringify({ kind: "estimate", yours: true }));
  const ly = run({ ...london, area: v(250, mine("area")) });
  check("London with the reader's floor space: the break-even and the rent line say they rest on the reader's figure", ly.breakEven.held && ly.breakEven.yours && ly.bill.find((x) => x.key === "rent")?.yours === true);

  /* REVIEW FOCUS 4, EXTREMES: nothing throws and nothing prints NaN or Infinity. */
  const extremes: Array<[string, EngineInputs, (r: ReturnType<typeof E.simulate>) => boolean]> = [
    ["5,000 m2 at 362 puts the rateable value past the law's 500,000", { ...london, area: v(5000, mine("area")) }, (r) => reason(r.breakEven) === "out-of-reach"],
    ["a negative rent is no rent", { ...berlin(), rentPerM2: v(-5, mine("rent")) }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("rent")],
    ["a pay that is not a number is no pay", { ...berlin(), roles: berlin().roles.map((x) => (x.heads > 0 ? { ...x, payYear: v(Number.NaN, mine("pay")) } : x)) }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).some((n) => n.startsWith("pay:"))],
    ["a loan with no years asks for them", { ...berlin(), loan: { amount: v(40000, mine("loanAmount")), ratePct: v(7.5, est("t")), years: v(0, mine("loanYears")) } }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("loan")],
    ["two and a half heads under the UK law", { ...london, roles: [{ key: "cook", heads: 2.5, headsStamp: mine("team:cook"), payYear: v(28000, est("t")) }] }, (r) => (r.bill.find((x) => x.key === "team:cook")?.year ?? 0) > 2 * 28000],
    ["a million heads", { ...berlin(), roles: [{ key: "cook", heads: 1e6, headsStamp: mine("team:cook"), payYear: v(30000, est("t")) }] }, (r) => !r.breakEven.held && (r.breakEven.needs ?? []).includes("heads:cook")],
    ["sales of a trillion", { ...berlin(), sales: v(1e12, mine("sales")) }, (r) => r.profit.held],
    /* The lever's top (Task 5's bounds): bestCompanyTakeHome walks salaries in 250 steps, so the search's cost grows with the target. */
    ["a company's target of 250,000", { ...london, tax: { law: "uk", form: "company" }, targetProfit: v(250000, mine("target")) }, (r) => r.targetSales.held],
  ];
  for (const [label, inputs, ok] of extremes) {
    let r: ReturnType<typeof E.simulate> | null = null;
    try { r = run(inputs); } catch (e) { check(`${label}: no throw (${(e as Error).message})`, false); continue; }
    check(`${label}: ${JSON.stringify(r.breakEven)}`, ok(r));
  }
  check(`no output of the ${results.length} runs holds NaN or Infinity`, results.length > 0 && !results.some(nonFinite));

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/engine: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-engine crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/engine.test.ts > scratchpad/calc/t1.txt 2>&1; echo "exit $?" >> scratchpad/calc/t1.txt`. Expected: exit 1, `x calc-engine` "the engine is there" and "the first slice's adapter is there", then "modules missing".

- [ ] **Step 3: The fifth kind word.** In `src/lib/spine/provenance.ts` the line `export type Provenance = { src: string; kind: ProvenanceKind };` becomes:

```ts
/** A FIGURE THE READER SET (plan 2026-10-13 cost-simulator, Task 1; spec section 3: "a reader's own figure carries the new kind word 'yours'"): the
 *  fifth word stands beside the ledger's four, never inside them, so every reader of a kind that compares it to the four is unchanged and
 *  ProvenanceKind still holds four words. An output resting on a reader's figure keeps its own kind and says "your figures" in its line. */
export type StampKind = ProvenanceKind | "yours";
export type Provenance = { src: string; kind: StampKind };
```

and in `provAttrs` the return type `{ "data-src"?: string; "data-kind"?: ProvenanceKind }` becomes `{ "data-src"?: string; "data-kind"?: StampKind }`. In the header's list, after the line ` *  - "estimate": our judgement where no register exists (the engine's break-even and keeps, a cost at the city's prices).` add ` *  - "yours" (plan 2026-10-13 cost-simulator): a figure the reader set on /calculator (StampKind below), never one of the ledger's four.`

- [ ] **Step 4: The provenance gate reads the fifth word.** In `scripts/harness/check_provenance.mjs`: the header's `(counted, worked out, looked up, estimate; src/lib/spine/` becomes `(counted, worked out, looked up, estimate, or yours for a figure the reader set on /calculator; src/lib/spine/`; the line `const KINDS = new Set(["counted", "worked out", "looked up", "estimate"]);` becomes

```js
/* The ledger's four words and "yours", a figure the reader set on /calculator (plan 2026-10-13 cost-simulator, Task 1; src/lib/spine/provenance.ts StampKind). */
const KINDS = new Set(["counted", "worked out", "looked up", "estimate", "yours"]);
```

and in the wrong-kind red `not one of the ledger's four` becomes `not one of the ledger's four or "yours"`.

- [ ] **Step 5: The engine** `src/lib/simulator/engine.ts`:

```ts
/**
 * src/lib/simulator/engine.ts , THE COST SIMULATOR'S ARITHMETIC (plan 2026-10-13 cost-simulator, Task 1; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-cost-simulator-design.md, sections 2 and 3; R7 tables 4.1 and 4.2).
 *
 * ONE BUSINESS, ONE YEAR, ONE CURRENCY (pounds for a UK place, dollars elsewhere: the caller converts). Pure: no file, no database, no clock,
 * so the browser runs it on every lever and the chain proves it offline.
 *
 *   variable share   v  = the shares of each sale spent on goods and running costs
 *   fixed costs      F0 = rent + service charge + rates (England's law, on the rent as the rateable value) + the business's own lines
 *                         + the team (each head's pay and its on-cost) + the loan's repayments
 *   with your pay    F  = F0 + W, W the owner's pay before tax when set
 *   break-even       R* = F / (1 - v), never circular: no input is a share of the sales it answers
 *   profit at R      P  = R - (each share x R, rounded first) - F; a loss stays a loss
 *   after tax (UK)   keeps(W + P) - keeps(W), keeps the legal form's take-home (take_home.ts); a loss pays none; the loan's principal is
 *                    taxed though it is no cost
 *   target           the profit p that leaves T after tax, then (F + p) / (1 - v); before tax outside the UK
 *   payback          the money to open over the month's profit (after tax in the UK), none at a loss
 *   moves            each input up a tenth, or one more head on a role the team holds, the five largest rises in R*
 *
 * A FIGURE IS HELD OR SAYS WHY NOT (`Out`): a missing input names itself in `needs`, shares at or above every pound answer "no-margin", a loss
 * answers "loss" where the payback would stand. Nothing is filled. Each held output carries the kind of the inputs it rests on (combineStamps):
 * "worked out" only when every one is counted, looked up or worked out, an estimate otherwise, and `yours` when any is the reader's own.
 *
 * ITS BLIND SPOT, stated: it computes what it is handed. It cannot tell a rent a year from a month's, a share from a percentage typed as 32,
 * or a default from a guess; the defaults builder and the levers' bounds carry those, and its test pins the arithmetic, not the inputs.
 */
import { pennies, sumPennies } from "@/lib/uk/law/money";
import { businessRates } from "@/lib/uk/law/business_rates";
import { hireAllIn } from "@/lib/uk/law/employer_cost";
import { annuity } from "@/lib/uk/law/loan";
import { soleTraderTakeHome, bestCompanyTakeHome } from "@/lib/uk/law/take_home";
import { UK_2026_27 } from "@/lib/uk/law/params_2026_27";
import { bandCdf } from "@/lib/uk/pnl/banded";
import type { ProvenanceKind, StampKind } from "@/lib/spine/provenance";

export type Stamp = { src: string; kind: StampKind };
export type Held = { v: number; stamp: Stamp };
export type Value = Held | null;
export type Line = { key: string; amountYear: number; stamp: Stamp };
export type Share = { key: string; share: number; stamp: Stamp };
export type Role = { key: string; heads: number; headsStamp: Stamp; payYear: Value };
export type OnCost = { law: "uk"; allowance: boolean } | { rate: Held } | null;
export type Form = "sole trader" | "company";
export type Tax = { law: "uk"; form: Form } | { law: "none" };
export type Spread =
  | { kind: "bands"; revenueBandsK: readonly number[]; stamp: Stamp }
  | { kind: "tenths"; p10: number; p25: number; p50: number; p75: number; p90: number; firms: number; stamp: Stamp };
export type EngineInputs = {
  area: Value;
  rentPerM2: Value;
  serviceChargePerM2: Value;
  rates: { law: "england"; retailHospitalityLeisure: boolean } | null;
  lines: readonly Line[];
  roles: readonly Role[];
  onCost: OnCost;
  /** The shares of each sale spent on goods; null where none is held (the break-even waits for it); [] where the trade spends none. */
  variable: readonly Share[] | null;
  runningShare: Value;
  ownerPay: Value;
  targetProfit: Value;
  sales: Value;
  ticket: Value;
  openingCost: Value;
  loan: { amount: Value; ratePct: Value; years: Value };
  tax: Tax;
  spread: Spread | null;
};
export type Reason = "needs" | "no-margin" | "no-sales" | "loss" | "no-ticket" | "no-opening" | "no-target" | "no-tax" | "no-spread" | "beyond-spread" | "out-of-reach";
export type Out = { held: true; value: number; kind: ProvenanceKind; yours: boolean } | { held: false; reason: Reason; needs?: string[] };
export type BillLine = { key: string; year: number; part: "variable" | "fixed" | "owner"; kind: ProvenanceKind; yours: boolean; src: string };
export type Move = { key: string; rise: number; kind: ProvenanceKind; yours: boolean };
export type EngineResult = {
  bill: BillLine[];
  billAt: "sales" | "break-even" | null;
  variableShare: Out;
  fixedYear: Out;
  breakEven: Out;
  breakEvenBusiness: Out;
  targetSales: Out;
  profit: Out;
  profitAfterTax: Out;
  marginBefore: Out;
  marginAfter: Out;
  customersADay: Out;
  shareAbove: Out;
  salesRank: Out;
  firms: number | null;
  paybackMonths: Out;
  perHundred: Out;
  moves: Move[];
};

/** An adult hire, 22 or over and under State Pension age (employer_cost.ts enrols them in the pension). */
const ADULT_AGE = 30;
const DAYS = 365;
const STEP = 1.1;
const MAX_HEADS = 1000;
export const MOVES_MAX = 5;
const RATES_LAW: Stamp = { src: "uk/law/business_rates.ts", kind: "worked out" };
const HIRE_LAW: Stamp = { src: "uk/law/employer_cost.ts:hireAllIn", kind: "worked out" };
const TAX_LAW: Stamp = { src: "uk/law/take_home.ts", kind: "worked out" };

const ok = (x: number | null | undefined): x is number => typeof x === "number" && Number.isFinite(x) && x >= 0;
const val = (h: Value): number | null => (h && ok(h.v) ? h.v : null);

/** The kind an output takes from the stamps it rests on: "worked out" when every one is counted, looked up or worked out, else an estimate
 *  (resting on nothing too); `yours` when any is the reader's own. */
export function combineStamps(stamps: readonly Stamp[]): { kind: ProvenanceKind; yours: boolean } {
  const yours = stamps.some((s) => s.kind === "yours");
  const firm = stamps.length > 0 && stamps.every((s) => s.kind === "counted" || s.kind === "looked up" || s.kind === "worked out");
  return { kind: firm ? "worked out" : "estimate", yours };
}

/** One stamp for a line built from several inputs: their sources joined, "yours" when any is the reader's, else the kind they combine to. */
function joined(stamps: readonly Stamp[]): Stamp {
  const c = combineStamps(stamps);
  return { src: stamps.map((s) => s.src).join(" x "), kind: c.yours ? "yours" : c.kind };
}

const held = (value: number, stamps: readonly Stamp[]): Out => ({ held: true, value, ...combineStamps(stamps) });
const none = (reason: Reason, needs?: string[]): Out => (needs && needs.length > 0 ? { held: false, reason, needs } : { held: false, reason });

function shareLines(i: EngineInputs): { shares: Share[]; v: number } {
  const goods = (i.variable ?? []).filter((s) => Number.isFinite(s.share) && s.share >= 0);
  const run = val(i.runningShare);
  const shares = run !== null && i.runningShare ? [...goods, { key: "running", share: run, stamp: i.runningShare.stamp }] : goods;
  return { shares, v: shares.reduce((a, s) => a + s.share, 0) };
}

function teamLines(i: EngineInputs): { lines: Line[]; needs: string[] } {
  const lines: Line[] = [];
  const needs: string[] = [];
  const staffed = i.roles.filter((r) => Number.isFinite(r.heads) && r.heads > 0);
  if (staffed.length > 0 && !i.onCost) needs.push("oncost");
  let allowance = i.onCost && "law" in i.onCost && i.onCost.allowance ? UK_2026_27.class1Secondary.employmentAllowance : 0;
  for (const r of staffed) {
    if (r.heads > MAX_HEADS) { needs.push(`heads:${r.key}`); continue; }
    const pay = val(r.payYear);
    if (pay === null || !r.payYear) { needs.push(`pay:${r.key}`); continue; }
    if (!i.onCost) continue;
    let amount: number;
    let cost: Stamp;
    if ("law" in i.onCost) {
      /* Each head through the law in turn, a part head at that part of the pay, the Employment Allowance spent once across them. */
      const parts: number[] = [];
      const hire = (gross: number) => { const c = hireAllIn({ gross, age: ADULT_AGE, allowanceRemaining: allowance }); allowance = pennies(allowance - c.allowanceUsed); parts.push(c.allIn); };
      const whole = Math.floor(r.heads + 1e-9);
      for (let k = 0; k < whole; k++) hire(pay);
      if (r.heads - whole > 1e-6) hire(pennies(pay * (r.heads - whole)));
      amount = sumPennies(parts);
      cost = HIRE_LAW;
    } else {
      amount = pennies(pennies(pay + pennies(pay * i.onCost.rate.v)) * r.heads);
      cost = i.onCost.rate.stamp;
    }
    lines.push({ key: `team:${r.key}`, amountYear: amount, stamp: joined([r.headsStamp, r.payYear.stamp, cost]) });
  }
  return { lines, needs };
}

function loanLine(i: EngineInputs): { line: Line | null; needs: boolean; principal: number } {
  const amount = val(i.loan.amount);
  if (amount === null || amount === 0 || !i.loan.amount) return { line: null, needs: false, principal: 0 };
  const rate = val(i.loan.ratePct), years = val(i.loan.years);
  if (rate === null || years === null || years < 1 || !i.loan.ratePct || !i.loan.years) return { line: null, needs: true, principal: 0 };
  const months = Math.round(years * 12);
  const a = annuity({ principal: amount, annualRatePct: rate, months });
  /* The first year's repayments; the principal among them is the amount less the balance after twelve payments. */
  const r = rate / 100 / 12;
  const balance = r === 0 ? amount - (amount / months) * 12 : amount * (1 + r) ** 12 - (a.monthly * ((1 + r) ** 12 - 1)) / r;
  return { line: { key: "loan", amountYear: pennies(a.monthly * 12), stamp: joined([i.loan.amount.stamp, i.loan.ratePct.stamp, i.loan.years.stamp]) }, needs: false, principal: pennies(Math.max(0, amount - balance)) };
}

function fixedLines(i: EngineInputs): { lines: Line[]; needs: string[]; outOfReach: boolean; principal: number } {
  const lines: Line[] = [];
  const needs: string[] = [];
  let outOfReach = false;
  const area = val(i.area), rent = val(i.rentPerM2);
  if (area === null) needs.push("area");
  if (rent === null) needs.push("rent");
  if (area !== null && rent !== null && i.area && i.rentPerM2) {
    const r = pennies(area * rent);
    lines.push({ key: "rent", amountYear: r, stamp: joined([i.area.stamp, i.rentPerM2.stamp]) });
    if (i.rates) {
      if (r >= UK_2026_27.businessRates.highValueThreshold) outOfReach = true;
      else lines.push({ key: "rates", amountYear: businessRates({ rateableValue: r, retailHospitalityLeisure: i.rates.retailHospitalityLeisure }).bill, stamp: joined([i.area.stamp, i.rentPerM2.stamp, RATES_LAW]) });
    }
    const sc = val(i.serviceChargePerM2);
    if (sc !== null && sc > 0 && i.serviceChargePerM2) lines.push({ key: "service", amountYear: pennies(area * sc), stamp: joined([i.area.stamp, i.serviceChargePerM2.stamp]) });
  }
  for (const l of i.lines) if (ok(l.amountYear)) lines.push({ key: `line:${l.key}`, amountYear: pennies(l.amountYear), stamp: l.stamp });
  const team = teamLines(i);
  lines.push(...team.lines);
  needs.push(...team.needs);
  const loan = loanLine(i);
  if (loan.line) lines.push(loan.line);
  if (loan.needs) needs.push("loan");
  return { lines, needs, outOfReach, principal: loan.principal };
}

function keepsOf(x: number, form: Form): number {
  if (x <= 0) return x;
  return form === "sole trader" ? soleTraderTakeHome(x).takeHome : bestCompanyTakeHome(x).takeHome;
}

/** What the owner keeps of a year's profit under the UK law, W already drawn: keeps(W + P) - keeps(W). A loss pays no tax; `addBack`, the
 *  year's loan principal, is taxed though it is no cost. Outside the UK the profit as it stands. */
export function afterTaxProfit(profit: number, ownerPay: number, tax: Tax, addBack = 0): number {
  if (tax.law !== "uk") return profit;
  const taxable = pennies(profit + addBack);
  if (taxable <= 0) return profit;
  return pennies(keepsOf(pennies(ownerPay + taxable), tax.form) - keepsOf(ownerPay, tax.form) - addBack);
}

/** The year's profit that leaves `target` after tax, searched to the pound (the law steps, so no closed form); null past 100 million. */
export function profitForAfterTax(target: number, ownerPay: number, tax: Tax, addBack = 0): number | null {
  if (!(target > 0)) return 0;
  if (tax.law !== "uk") return pennies(target);
  let lo = 0;
  let hi = Math.max(1000, target);
  while (hi < 1e8 && afterTaxProfit(hi, ownerPay, tax, addBack) < target) hi *= 2;
  if (afterTaxProfit(hi, ownerPay, tax, addBack) < target) return null;
  while (hi - lo > 1) { const mid = (lo + hi) / 2; if (afterTaxProfit(mid, ownerPay, tax, addBack) >= target) hi = mid; else lo = mid; }
  return Math.ceil(hi);
}

/** The break-even alone, for the moves: null where any input it needs is missing or a sale costs all it brings. */
function breakEvenOf(i: EngineInputs): number | null {
  const { v } = shareLines(i);
  const fx = fixedLines(i);
  if (fx.outOfReach || fx.needs.length > 0 || i.variable === null || v >= 1) return null;
  return pennies(pennies(sumPennies(fx.lines.map((l) => l.amountYear)) + (val(i.ownerPay) ?? 0)) / (1 - v));
}

function candidates(i: EngineInputs): Array<{ key: string; inputs: EngineInputs; stamps: Stamp[] }> {
  const up = (h: Value): Value => (h && ok(h.v) ? { v: h.v * STEP, stamp: h.stamp } : h);
  const out: Array<{ key: string; inputs: EngineInputs; stamps: Stamp[] }> = [];
  if (val(i.area) && i.area) out.push({ key: "area", inputs: { ...i, area: up(i.area) }, stamps: [i.area.stamp] });
  if (val(i.rentPerM2) && i.rentPerM2) out.push({ key: "rent", inputs: { ...i, rentPerM2: up(i.rentPerM2) }, stamps: [i.rentPerM2.stamp] });
  if (val(i.serviceChargePerM2) && i.serviceChargePerM2) out.push({ key: "service", inputs: { ...i, serviceChargePerM2: up(i.serviceChargePerM2) }, stamps: [i.serviceChargePerM2.stamp] });
  for (const l of i.lines) if (ok(l.amountYear) && l.amountYear > 0) out.push({ key: `line:${l.key}`, inputs: { ...i, lines: i.lines.map((x) => (x === l ? { ...x, amountYear: x.amountYear * STEP } : x)) }, stamps: [l.stamp] });
  const paid = i.roles.filter((r) => r.heads > 0 && val(r.payYear) !== null);
  for (const r of paid) out.push({ key: `hire:${r.key}`, inputs: { ...i, roles: i.roles.map((x) => (x === r ? { ...x, heads: x.heads + 1 } : x)) }, stamps: [r.headsStamp, ...(r.payYear ? [r.payYear.stamp] : [])] });
  if (paid.length > 0) out.push({ key: "pay", inputs: { ...i, roles: i.roles.map((x) => ({ ...x, payYear: up(x.payYear) })) }, stamps: paid.flatMap((r) => (r.payYear ? [r.payYear.stamp] : [])) });
  if (i.variable && i.variable.some((s) => s.share > 0)) out.push({ key: "goods", inputs: { ...i, variable: i.variable.map((s) => ({ ...s, share: s.share * STEP })) }, stamps: i.variable.map((s) => s.stamp) });
  if (val(i.runningShare) && i.runningShare) out.push({ key: "running", inputs: { ...i, runningShare: up(i.runningShare) }, stamps: [i.runningShare.stamp] });
  if (val(i.ownerPay) && i.ownerPay) out.push({ key: "owner", inputs: { ...i, ownerPay: up(i.ownerPay) }, stamps: [i.ownerPay.stamp] });
  if (val(i.loan.amount) && i.loan.amount) out.push({ key: "loan", inputs: { ...i, loan: { ...i.loan, amount: up(i.loan.amount) } }, stamps: [i.loan.amount.stamp] });
  return out;
}

function movesOf(i: EngineInputs, base: number): Move[] {
  const out: Move[] = [];
  for (const c of candidates(i)) {
    const be = breakEvenOf(c.inputs);
    if (be === null) continue;
    const rise = pennies(be - base);
    if (rise > 0) out.push({ key: c.key, rise, ...combineStamps(c.stamps) });
  }
  return out.sort((a, b) => b.rise - a.rise || a.key.localeCompare(b.key)).slice(0, MOVES_MAX);
}

/** Where a sales figure stands among the place's firms: the share below it; null with no spread; NaN past a trusted cell's tenths. */
function placed(s: Spread | null, x: number): number | null {
  if (!s) return null;
  if (s.kind === "bands") return bandCdf(s.revenueBandsK, x / 1000);
  if (x < s.p10 || x > s.p90) return Number.NaN;
  const pts: Array<[number, number]> = [[s.p10, 0.1], [s.p25, 0.25], [s.p50, 0.5], [s.p75, 0.75], [s.p90, 0.9]];
  for (let k = 1; k < pts.length; k++) {
    const [x0, q0] = pts[k - 1], [x1, q1] = pts[k];
    if (x <= x1) return x1 > x0 ? q0 + ((x - x0) / (x1 - x0)) * (q1 - q0) : q1;
  }
  return 0.9;
}

const billOf = (s: Stamp) => (s.kind === "yours" ? { kind: "estimate" as ProvenanceKind, yours: true, src: s.src } : { kind: s.kind, yours: false, src: s.src });

export function simulate(i: EngineInputs): EngineResult {
  const { shares, v } = shareLines(i);
  const fx = fixedLines(i);
  const W = val(i.ownerPay) ?? 0;
  const wStamps = i.ownerPay && W > 0 ? [i.ownerPay.stamp] : [];
  const needs = [...fx.needs, ...(i.variable === null ? ["goods"] : [])];
  const blocked: Out | null = fx.outOfReach ? none("out-of-reach") : needs.length > 0 ? none("needs", needs) : null;
  const gap: Out | null = blocked ?? (v >= 1 ? none("no-margin") : null);
  const fixedStamps = fx.lines.map((l) => l.stamp);
  const shareStamps = shares.map((s) => s.stamp);
  const costStamps = [...fixedStamps, ...shareStamps, ...wStamps];
  const F0 = sumPennies(fx.lines.map((l) => l.amountYear));
  const F = pennies(F0 + W);
  const breakEven = gap ?? held(pennies(F / (1 - v)), costStamps);
  const breakEvenBusiness = gap ?? held(pennies(F0 / (1 - v)), [...fixedStamps, ...shareStamps]);
  const fixedYear = fx.outOfReach ? none("out-of-reach") : fx.needs.length > 0 ? none("needs", fx.needs) : held(F, [...fixedStamps, ...wStamps]);
  const variableShare = i.variable === null ? none("needs", ["goods"]) : held(v, shareStamps);
  const perHundred = i.variable === null ? none("needs", ["goods"]) : v >= 1 ? none("no-margin") : held(100 / (1 - v), shareStamps);

  const R = val(i.sales);
  const hasSales = R !== null && R > 0 && !!i.sales;
  const salesStamps = hasSales && i.sales ? [i.sales.stamp] : [];
  const atSales = (x: number) => shares.map((s) => ({ key: `share:${s.key}`, year: pennies(s.share * x), stamp: s.stamp }));
  const P = !blocked && hasSales ? pennies((R as number) - sumPennies([...atSales(R as number).map((l) => l.year), F])) : null;
  const stamps = [...costStamps, ...salesStamps];
  const uk = i.tax.law === "uk";
  const Pt = P !== null && uk ? afterTaxProfit(P, W, i.tax, fx.principal) : null;
  const profit = blocked ?? (P === null ? none("no-sales") : held(P, stamps));
  const marginBefore = blocked ?? (P === null ? none("no-sales") : held(P / (R as number), stamps));
  const profitAfterTax = blocked ?? (P === null ? none("no-sales") : Pt === null ? none("no-tax") : held(Pt, [...stamps, TAX_LAW]));
  const marginAfter = blocked ?? (P === null ? none("no-sales") : Pt === null ? none("no-tax") : held(Pt / (R as number), [...stamps, TAX_LAW]));

  const T = val(i.targetProfit);
  let targetSales: Out;
  if (gap) targetSales = gap;
  else if (T === null || !i.targetProfit) targetSales = none("no-target");
  else {
    const p = profitForAfterTax(T, W, i.tax, fx.principal);
    targetSales = p === null ? none("out-of-reach") : held(pennies((F + p) / (1 - v)), [...costStamps, i.targetProfit.stamp, ...(uk ? [TAX_LAW] : [])]);
  }

  const ticket = val(i.ticket);
  const customersADay = !breakEven.held ? breakEven : ticket === null || ticket <= 0 || !i.ticket ? none("no-ticket") : held(breakEven.value / ticket / DAYS, [...costStamps, i.ticket.stamp]);

  const firms = !i.spread ? null : i.spread.kind === "bands" ? i.spread.revenueBandsK.reduce((a, c) => a + c, 0) : i.spread.firms;
  const spreadStamps = i.spread ? [i.spread.stamp] : [];
  const among = (x: number, base: Stamp[], above: boolean): Out => {
    const c = placed(i.spread, x);
    if (c === null) return none("no-spread");
    if (Number.isNaN(c)) return none("beyond-spread");
    return held(above ? 1 - c : c, [...base, ...spreadStamps]);
  };
  const shareAbove = !breakEven.held ? breakEven : among(breakEven.value, costStamps, true);
  const salesRank = !hasSales ? none("no-sales") : among(R as number, salesStamps, false);

  const opening = val(i.openingCost);
  const month = Pt ?? P;
  const paybackMonths = opening === null || opening <= 0 || !i.openingCost ? none("no-opening") : !profit.held ? profit : (month as number) <= 0 ? none("loss") : held(Math.ceil(opening / ((month as number) / 12)), [...stamps, i.openingCost.stamp, ...(uk ? [TAX_LAW] : [])]);

  const billSales = hasSales ? (R as number) : breakEven.held ? breakEven.value : null;
  const bill: BillLine[] = [
    ...(billSales !== null ? atSales(billSales).map((l) => ({ key: l.key, year: l.year, part: "variable" as const, ...billOf(l.stamp) })) : []),
    ...fx.lines.map((l) => ({ key: l.key, year: l.amountYear, part: "fixed" as const, ...billOf(l.stamp) })),
    ...(W > 0 && i.ownerPay ? [{ key: "owner", year: W, part: "owner" as const, ...billOf(i.ownerPay.stamp) }] : []),
  ];

  return {
    bill,
    billAt: hasSales ? "sales" : breakEven.held ? "break-even" : null,
    variableShare, fixedYear, breakEven, breakEvenBusiness, targetSales, profit, profitAfterTax, marginBefore, marginAfter,
    customersADay, shareAbove, salesRank, firms, paybackMonths, perHundred,
    moves: gap || !breakEven.held ? [] : movesOf(i, breakEven.value),
  };
}
```

- [ ] **Step 6: The first slice's adapter** `src/lib/simulator/uk_model.ts`:

```ts
/**
 * src/lib/simulator/uk_model.ts , THE FIRST SLICE: MODEL.TS'S BUSINESS AS THE ENGINE'S INPUTS (plan 2026-10-13 cost-simulator, Task 1; spec section 2,
 * "a first slice (London's three money trades on the model as it stands) proves the engine before the world defaults land"; R7 section 3, "wrap
 * model.ts ... at the defaults it reproduces the trade page's break-even").
 *
 * One business in the average premises at the anchor's sales, model.ts's break-even reading ("the business in the average premises cannot shed its
 * crew when sales dip"): the premises' area and its rent per m2 (the valuation's rateable value over its area, so area times rent is the rateable
 * value to the penny), England's rates by the recipe's multiplier, the recipe's sized lines at the anchor as two fixed lines (the crew, every line
 * whose research driver pays people, and the running costs, the rest, each line rounded first as model.ts rounds it), its variable shares as the
 * shares of each sale, the register's bands as the spread, the legal form's tax. No roles: the crew line pays the team (recipes.ts P1), so a hire
 * the reader adds is on top, costed by the law with the Employment Allowance held spent on that crew. The quartiles' size rule (model.ts billAt at
 * other sales) is not read: the simulator is one business whose fixed costs stay fixed.
 */
import { pennies, sumPennies } from "@/lib/uk/law/money";
import { RECIPES } from "@/lib/uk/pnl/recipes";
import { own } from "@/lib/own";
import { registerSrc } from "@/lib/spine/provenance";
import type { PnlInputs, Share as ModelShare } from "@/lib/uk/pnl/model";
import type { EngineInputs, Line, Stamp } from "./engine";

/** A recipe line whose research driver pays people (recipes.ts P1, "wages"): the crew. */
export const STAFF_DRIVER = /labou?r|payroll|wage|staff/i;

export function ukModelInputs(model: PnlInputs, ctx: { trade: string; geography: string }): EngineInputs {
  const recipe = own(RECIPES, ctx.trade);
  const A = model.anchorSales.value;
  const premises: Stamp = { src: `uk/registers/premises.json:${ctx.trade}:${ctx.geography}`, kind: model.premises.kind };
  const driverOf = (key: string) => recipe?.sized.find((s) => s.key === key)?.driver ?? "";
  const line = (key: string, shares: readonly ModelShare[]): Line[] =>
    shares.length === 0 ? [] : [{ key, amountYear: sumPennies(shares.map((s) => pennies(s.share * A))), stamp: { src: `uk/pnl/recipes.ts:${ctx.trade}:${shares.map((s) => s.key).join("+")} x anchor`, kind: "estimate" } }];
  return {
    area: { v: model.premises.areaM2, stamp: premises },
    rentPerM2: { v: model.premises.rateableValue / model.premises.areaM2, stamp: premises },
    serviceChargePerM2: null,
    rates: { law: "england", retailHospitalityLeisure: model.premises.retailHospitalityLeisure },
    lines: [...line("crew", model.sized.filter((s) => STAFF_DRIVER.test(driverOf(s.key)))), ...line("running", model.sized.filter((s) => !STAFF_DRIVER.test(driverOf(s.key))))],
    roles: [],
    onCost: { law: "uk", allowance: false },
    variable: model.variable.map((s) => ({ key: s.key, share: s.share, stamp: { src: `uk/pnl/recipes.ts:${ctx.trade}:${s.key}`, kind: s.kind } })),
    runningShare: null,
    ownerPay: null,
    targetProfit: null,
    sales: null,
    ticket: null,
    openingCost: null,
    loan: { amount: null, ratePct: null, years: null },
    tax: { law: "uk", form: model.form },
    spread: { kind: "bands", revenueBandsK: model.revenueBandsK, stamp: { src: registerSrc("turnover.json", ctx.trade, ctx.geography), kind: "counted" } },
  };
}
```

- [ ] **Step 7: Run it to see it pass.** The Step 2 command to `scratchpad/calc/t1.txt`. Expected: exit 0, `simulator/engine: all pass`, every PASS line printing the hand-worked figure beside the engine's.

- [ ] **Step 8: Wire the gate.** In `scripts/prebuild_all.ts`, after the line `  { name: "provenance", script: "scripts/harness/check_provenance.mjs", args: ["--list"] },` insert:

```ts
  /* THE COST SIMULATOR'S ARITHMETIC (plan 2026-10-13 cost-simulator, Task 1): F / (1 - v) on London's three money trades against model.ts, on
     hand-worked London and Berlin cases, a loss, no sales, a sale that costs all it brings, extremes. Offline: the register slices and fixtures. */
  { name: "calc-engine", script: "tests/simulator/engine.test.ts" },
```

Stage the new files, then COUNTS. Then GATES `--only=calc-engine,provenance,uk-pnl-model,uk-pnl-london,london-trade-hero,counts-fresh` to `scratchpad/calc/t1-gates.txt`. Expected: exit 0. `provenance` reads the renders as they stand (none carries "yours" yet) and passes.

- [ ] **Step 9: Typecheck.** MEMORY, then TYPECHECK to `scratchpad/calc/t1-tsc.txt`. Expected: exit 0. A red naming a file that hands a provenance's kind to a four-word type (`const k: ProvenanceKind = prov.kind`) is fixed there by typing that figure `{ src: string; kind: ProvenanceKind }`: it never holds a reader's figure. The read of 2026-10-13 found every use of a provenance's kind to be a comparison to a word.

- [ ] **Step 10: Commit.**

```bash
cd /e/atlas/website && git add src/lib/spine/provenance.ts scripts/harness/check_provenance.mjs src/lib/simulator/engine.ts src/lib/simulator/uk_model.ts tests/simulator/engine.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:engine: the cost simulator's arithmetic, F / (1 - v) on absolute inputs, proved on London's three money trades against model.ts and on hand-worked London and Berlin cases; "yours" the fifth kind word (plan 2026-10-13 cost-simulator, Task 1)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 2: Every default with its source (R7 4.1, row for row)

**Files:**
- Modify: `src/lib/uk/pnl/london.ts` (the geography a parameter; London's functions and words unchanged)
- Create: `src/lib/simulator/place.ts`, `src/lib/simulator/bundle.ts`, `src/lib/simulator/cell_facts.ts`, `src/lib/simulator/defaults.ts`, `src/lib/simulator/load.ts`
- Modify: `src/lib/spine/copy.ts` (`COPY.calculator`, every word the page prints)
- Test: `tests/simulator/defaults.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-defaults` after `calc-engine`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 1's engine types, `simulate`, `ukModelInputs`, `STAFF_DRIVER`; `cityFigure`, `countryFigure`, `industryFigure` (each `{ value, tag } | null`, placeholders dropped); `shardRoles(id)` (`{ key, role, name, sub, headcount, wageIndex }[]`), `countryMedianPay(iso2)`; `getCityAnnualWageUsd(slug)`; `hasCountrySpecificRates`, `getCountryTaxRates(iso2).employer_social`; `listCountryProfiles`, `getCountryProfile(iso2).bank_lending_rate_pct`; `getCountryEconomicsSnapshot(iso2).avgMonthlySalary`; `getAovCityTierMultiplier(id, tier)`, `getCityTier(slug)`; `shardLadderNet(id)` (`{ fill }`); `startupCapitalArchetypeKeyed(slug)`, `placeCostFactor({ iso2, geo })`, `honestRound`; `setupItemsFromCell(cell)`; `isTrustedLocalCell(cell, id)`; `getCellBySlug`, `withBudget(p, fallback, ms, label)`; `convertUsdTo("GBP", usd)`; `inSentence`; `registerSrc`; `anchorSalesFromBands`; `COUNTRIES`, `INDUSTRIES`, `INDUSTRY_BY_ID`, `industryToSlug`, `isDefaultVisible`; `own`; `RECIPES`.
- Produces (`london.ts`): `export const LONDON = "E12000007"`, `export const ENGLAND = "E92000001"`; `geographyWithholding(slug, geography, place)`, `geographyTradeInputs(slug, geography, place, form?)`, `geographyBands(slug, geography) => { bands: number[]; enterprises: number } | null`, `geographyPremises(slug, geography) => { category; areaM2; rentPerM2 } | null`; `londonWithholding(slug)` and `londonTradeInputs(slug, form?)` wrap them with London's words.
- Produces (`place.ts`): `type Nation = "england" | "scotland" | "wales" | "northern-ireland"`; `type Place = { iso2; country; countryName; city: string | null; cityName: string | null; trade; industryId; tradeName; nation: Nation | null }`; `DEFAULT_PLACE = { country: "gb", city: "london", trade: "restaurants" }`; `GB_CITY_NATION`; `resolvePlace({ country?, city?, trade? }) => Place | null`; `cityOfCountry(iso2, slug) => string | null`; `simulatorCountries()`, `simulatorCities()`, `simulatorTrades()`.
- Produces (`bundle.ts`): `type Level = "city" | "nation" | "country" | "trade" | "sector" | "law" | "none"`; `type SimInput = { value: number | null; stamp: Stamp | null; level: Level; line: string }`; `LEVERS` (`"area", "rent", "service", "oncost", "sales", "ticket", "goods", "runShare", "owner", "target", "loanAmount", "loanRate", "loanYears", "opening"`), `type LeverKey`; `type SimRole = { key; name; sub; heads; headsStamp; pay: SimInput; owner: boolean }`; `type OpeningLine = { key; name; amount; stamp }`; `type OpeningRule = { kind: "held" | "built" | "archetype" | "none"; lines: OpeningLine[]; line: string }`; `type SimBundle` (Step 6); `type SimState = { levers: Partial<Record<LeverKey, number | null>>; on: { owner?: boolean; target?: boolean }; heads: Record<string, number>; pay: Record<string, number>; form: Form | null }`; `FRESH`; `DEFAULT_PLACE` (re-exported by place.ts); `yours(key) => Stamp` (`calculator:lever:<key>`); `toEngine(bundle, state) => EngineInputs`.
- Produces (`cell_facts.ts`): `type CellFacts = { src; typical: number | null; tenths: { p10; p25; p50; p75; p90 } | null; firms: number | null; setup: { items: Array<{ name; usd }>; scope: string } | null }`; `cellFacts(cell, place) => CellFacts | null` (pure: types only from cells.ts).
- Produces (`defaults.ts`): `buildBundle(place: Place, opts: { cell: CellFacts | null }) => SimBundle` (server: reads the shards from disk; never imports cells.ts).
- Produces (`load.ts`, server, the one database read): `loadSimulatorCell(place) => Promise<CellFacts | null>`; `loadPlaceBundle(place) => Promise<SimBundle>`. Task 4B adds `buildCalculatorSeed` here.
- Produces (`copy.ts`): `COPY.calculator` with the keys `title`, `metaTitle`, `metaDescription`, `pick`, `answer`, `margin`, `levers`, `month`, `bill`, `moves`, `opening`, `reasons`, `fallback`, `lines`, `sources`.

- [ ] **Step 1: Write the failing test** `tests/simulator/defaults.test.ts`:

```ts
/**
 * THE COST SIMULATOR'S DEFAULTS (plan 2026-10-13 cost-simulator, Task 2; spec section 3: "a fallback test pins city to country to none with its line;
 * a no-fill test reds any of the known fills reaching an input"; R7 table 4.1 row for row).
 *
 * The place a view names; London on model.ts's business (the break-even at the defaults is model.ts's to the penny, Q1 answer A); Leeds and
 * "anywhere in" the UK on England's rows, said; Edinburgh off the law's reach, said; Berlin's rows summed by hand in Task 1 reached through the
 * real files (the same 1,095,484.12); REVIEW FOCUS 3, a city with no rent, by taking Berlin's rent out of the fact store and then Germany's; and
 * the no-fill sweep over every trade the calculator offers in three places.
 * BLIND SPOT, stated: it holds what the files say on the day it runs; a shard figure that is wrong in the file passes as that file's figure.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/defaults.test.ts
 */
import cityListJson from "../../data/cities/city_list_v1.json";
import { allFacts, loadFacts } from "../../src/lib/facts/store";
import { shardLadderNet } from "../../src/lib/spine/trade_net";
import { startupCapitalArchetypeKeyed } from "../../src/lib/markets/startup_capital_archetypes";
import { hasCountrySpecificRates } from "../../src/lib/tax";
import { listCountryProfiles } from "../../src/lib/economic_profile";
import { getAovCityTierMultiplier } from "../../src/lib/economics/breakeven";
import { getCityTier } from "../../src/lib/cities/city_tier";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-defaults";
const FILE = "src/lib/simulator/defaults.ts";
const REMEDY = "every default reads R7 4.1's row in its order (city, then country, then none), carries its stamp and says its level in its line; a place that lacks a figure says so or leaves the field empty, never a fill";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const KINDS = new Set(["counted", "worked out", "looked up", "estimate", "yours"]);

async function main(): Promise<void> {
  const P = await import("../../src/lib/simulator/place").catch(() => null);
  const B = await import("../../src/lib/simulator/bundle").catch(() => null);
  const D = await import("../../src/lib/simulator/defaults").catch(() => null);
  check("the place module is there", !!P, "src/lib/simulator/place.ts");
  check("the bundle module is there", !!B, "src/lib/simulator/bundle.ts");
  check("the defaults builder is there", !!D);
  if (!P || !B || !D) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const E = await import("../../src/lib/simulator/engine");
  const L = await import("../../src/lib/uk/pnl/london");
  const M = await import("../../src/lib/uk/pnl/model");
  const { COPY } = await import("../../src/lib/spine/copy");
  const W = COPY.calculator;
  const place = (country: string | null, city: string | null, trade: string | null) => P.resolvePlace({ country, city, trade });
  const at = (country: string, city: string | null, trade: string) => { const p = place(country, city, trade); if (!p) throw new Error(`no place ${country}/${city}/${trade}`); return { p, b: D.buildBundle(p, { cell: null }) }; };
  const run = (b: ReturnType<typeof D.buildBundle>) => E.simulate(B.toEngine(b, B.FRESH));
  const value = (o: { held: boolean; value?: number }) => (o.held ? (o as { value: number }).value : null);

  /* THE PLACE A VIEW NAMES (Reading 16; spec: "an unknown country, city or trade answers 404"). */
  check("no words is London restaurants", JSON.stringify(place(null, null, null) && [place(null, null, null)!.iso2, place(null, null, null)!.city, place(null, null, null)!.trade]) === JSON.stringify(["GB", "london", "restaurants"]), "src/lib/simulator/place.ts");
  check("a country with no city is anywhere in it; a city with no country names nothing", place("de", null, "restaurants")?.city === null && place(null, "berlin", "restaurants") === null, "src/lib/simulator/place.ts");
  check("an unknown country, city or trade, a city of another country, and a built-in name are no place", [place("xx", null, "restaurants"), place("gb", "atlantis", "restaurants"), place("gb", "london", "time-travel"), place("gb", "berlin", "restaurants"), place("gb", "london", "constructor"), place("gb", "__proto__", "restaurants")].every((x) => x === null), "src/lib/simulator/place.ts");
  const gbCities = (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "GB").map((c) => c.slug).sort();
  check(`every UK city in the list has its nation, and no other (${gbCities.join(", ")})`, JSON.stringify(Object.keys(P.GB_CITY_NATION).sort()) === JSON.stringify(gbCities), "src/lib/simulator/place.ts");

  /* LONDON ON MODEL.TS'S BUSINESS (Reading 1; Q1 answer A). */
  const { b: lb } = at("gb", "london", "restaurants");
  const lm = L.londonTradeInputs("restaurants")!;
  const lr = run(lb);
  check(`London restaurants run on the UK model in pounds (${lb.path}, ${lb.currency})`, lb.path === "uk-model" && lb.currency === "GBP");
  check(`the break-even at the defaults is model.ts's to the penny (${value(lr.breakEven)} against ${M.breakEvenSales(lm)})`, value(lr.breakEven) === M.breakEvenSales(lm));
  check(`the floor space and the rent are the valuation's, worked out, at the city's level (${lb.inputs.area.value}, ${lb.inputs.rent.value}, ${lb.inputs.area.stamp?.kind}, ${lb.inputs.area.level})`, lb.inputs.area.value === lm.premises.areaM2 && lb.inputs.rent.value === 362 && lb.inputs.area.stamp?.kind === "worked out" && lb.inputs.area.level === "city" && lb.inputs.area.line === W.lines.area.valuation);
  // Q1 answer A: the valuation's rent carries no service charge and the sales are the register's mean under 5m. Answer B: the city's service charge and bandQuantile(bands, 0.5).
  check(`Q1: the service charge stands empty with its line, and the sales are the anchor (${lb.inputs.service.value}, ${lb.inputs.sales.value})`, lb.inputs.service.value === null && lb.inputs.service.line === W.lines.service.valuation && lb.inputs.sales.value === lm.anchorSales.value && lb.inputs.sales.line === W.lines.sales.register);
  check(`the trade's roles stand at nought heads as hires on top, the owner's seat marked (${lb.roles.map((r) => `${r.key} ${r.heads}`).join(", ")})`, lb.roles.length > 0 && lb.roles.every((r) => r.heads === 0) && lb.roles.some((r) => r.owner) && lb.ukLaw?.allowance === false);
  check("the staff and running lines are the recipe's at the anchor", JSON.stringify(lb.lines.map((l) => [l.key, l.amountYear])) === JSON.stringify([["crew", 179232.26], ["running", 71692.9]]));
  check(`no running share off the model, the goods are the recipe's 36% (${lb.inputs.runShare.value}, ${lb.inputs.goods.value})`, lb.inputs.runShare.value === null && Math.abs((lb.inputs.goods.value ?? 0) - 0.36) < 1e-12);
  check(`the owner keeps the profit by default, a profit goal stands unset (${B.toEngine(lb, B.FRESH).ownerPay}, ${B.toEngine(lb, B.FRESH).targetProfit})`, B.toEngine(lb, B.FRESH).ownerPay === null && B.toEngine(lb, B.FRESH).targetProfit === null && lb.inputs.owner.value !== null);

  /* ENGLAND'S ROWS, SAID (Reading 2). */
  const { b: leeds } = at("gb", "leeds", "restaurants");
  const em = L.geographyTradeInputs("restaurants", L.ENGLAND, "England")!;
  check(`Leeds restaurants run on England's rows and say so (${leeds.inputs.area.line})`, leeds.path === "uk-model" && leeds.inputs.area.level === "nation" && leeds.inputs.area.line === "Leeds holds none. This is England's.");
  check(`Leeds' break-even is England's model.ts break-even (${value(run(leeds).breakEven)} against ${M.breakEvenSales(em)})`, value(run(leeds).breakEven) === M.breakEvenSales(em));
  const { p: anyUk, b: anyUkB } = at("gb", null, "restaurants");
  check(`anywhere in the UK reads England's rows (${anyUk.nation}, ${anyUkB.path}, ${anyUkB.inputs.area.level})`, anyUk.nation === "england" && anyUkB.path === "uk-model" && anyUkB.inputs.area.level === "nation" && anyUkB.inputs.area.line === W.lines.area.valuation);
  check("London's own functions keep their words", L.londonWithholding("constructor") === "no London turnover bands for the trade's code", "src/lib/uk/pnl/london.ts");

  /* SCOTLAND: no England rates, no rUK income tax, the employer's law still the UK's. */
  const { b: edi } = at("gb", "edinburgh", "restaurants");
  check(`Edinburgh: the world rows in pounds, no rates, no income tax, the hire law the UK's (${edi.path}, ${edi.rates}, ${edi.tax.law}, ${!!edi.ukLaw})`, edi.path === "world" && edi.currency === "GBP" && edi.rates === null && edi.tax.law === "none" && !!edi.ukLaw);

  /* BERLIN THROUGH THE REAL FILES: Task 1's hand-worked rows, reached by the builder. */
  const { b: be } = at("de", "berlin", "restaurants");
  const br = run(be);
  check(`Berlin restaurants: the world rows in dollars, 242 m2 from 22 a worker, rent 608 and service 40 the city's (${be.path}, ${be.inputs.area.value}, ${be.inputs.rent.value}, ${be.inputs.service.value})`, be.path === "world" && be.currency === "USD" && be.inputs.area.value === 242 && be.inputs.area.level === "sector" && be.inputs.rent.value === 608 && be.inputs.rent.level === "city" && be.inputs.service.value === 40);
  check(`Berlin's roles at the city's wage, Germany's employer rate (${be.roles.map((r) => `${r.key} ${r.heads}x${r.pay.value}`).join(", ")}; ${be.inputs.oncost.value})`, be.roles.find((r) => r.owner)?.heads === 0 && be.roles.find((r) => r.key === "head_chef_or_kitchen_lead")?.pay.value === 54120 && be.inputs.oncost.value === 0.197 && be.inputs.oncost.level === "country");
  check(`Berlin's break-even through the files is Task 1's by hand, 1,095,484.12 (${value(br.breakEven)})`, value(br.breakEven) === 1095484.12);
  check(`the ticket is the trade's spend per head times the city tier's multiplier (${be.inputs.ticket.value})`, be.inputs.ticket.value === 22 * getAovCityTierMultiplier("restaurants", getCityTier("berlin")));
  check(`no tax outside the UK, and the bank lending rate as the loan's (${be.tax.law}, ${be.inputs.loanRate.level})`, be.tax.law === "none" && be.inputs.loanRate.level === "country" && be.inputs.loanAmount.value === null);
  check(`the money to open it is built from the city's fit-out where no cell holds a bill (${be.opening.kind}: ${be.opening.lines.map((l) => `${l.key} ${l.amount}`).join(", ")})`, be.opening.kind === "built" && be.opening.lines[0]?.key === "fit-out" && be.opening.lines[0]?.amount === 1100 * 242);
  check(`at most five notes of where figures come from (${be.notes.length}: ${be.notes.map((n) => n.label).join(", ")})`, be.notes.length >= 1 && be.notes.length <= 5);

  /* REVIEW FOCUS 3, A CITY WITH NO RENT: Berlin's rent taken out of the store, then Germany's. */
  const saved = allFacts();
  loadFacts(saved.filter((f) => !(f.entityId === "DE-berlin" && f.metric === "realestate.rent_secondary_usd_sqm_yr")));
  const noCity = D.buildBundle(place("de", "berlin", "restaurants")!, { cell: null });
  check(`no city rent: the country's, said (${noCity.inputs.rent.value}, ${noCity.inputs.rent.level}, "${noCity.inputs.rent.line}")`, noCity.inputs.rent.level === "country" && noCity.inputs.rent.value !== null && noCity.inputs.rent.line === "Berlin holds none. This is Germany's.");
  loadFacts(allFacts().filter((f) => !(f.entityId === "DE" && f.metric === "costs.commercial_rent_usd_sqm_yr")));
  const noRent = D.buildBundle(place("de", "berlin", "restaurants")!, { cell: null });
  const nr = run(noRent);
  check(`no country rent either: the field empty with its line, the break-even waiting for it (${noRent.inputs.rent.value}, "${noRent.inputs.rent.line}", ${JSON.stringify(nr.breakEven)})`, noRent.inputs.rent.value === null && noRent.inputs.rent.stamp === null && noRent.inputs.rent.level === "none" && noRent.inputs.rent.line === W.lines.rent.none && !nr.breakEven.held && (nr.breakEven.needs ?? []).includes("rent"));
  loadFacts(saved);

  /* THE NO-FILL SWEEP: every trade the calculator offers, in London, in Berlin and anywhere in Afghanistan. */
  const profiles = new Set(listCountryProfiles().map((x) => x.iso2));
  const trades = P.simulatorTrades();
  let bundles = 0;
  const faults: string[] = [];
  for (const t of trades) for (const [c, city] of [["gb", "london"], ["de", "berlin"], ["af", null]] as const) {
    const p = place(c, city, t.slug);
    if (!p) { faults.push(`${c}/${city}/${t.slug}: no place`); continue; }
    const b = D.buildBundle(p, { cell: null });
    bundles++;
    const where = `${c}/${city ?? "anywhere"}/${t.slug}`;
    for (const [k, x] of Object.entries(b.inputs)) {
      if (x.value === null && x.stamp !== null) faults.push(`${where} ${k}: a stamp with no figure`);
      if (x.value !== null && (!x.stamp || !x.stamp.src || !KINDS.has(x.stamp.kind))) faults.push(`${where} ${k}: a figure with no stamp`);
      if (x.value !== null && !Number.isFinite(x.value)) faults.push(`${where} ${k}: ${x.value}`);
      if (x.stamp && /default_fallback/.test(x.stamp.src)) faults.push(`${where} ${k}: a file's fallback row`);
    }
    if (b.inputs.goods.stamp && /margin_ladder/.test(b.inputs.goods.stamp.src) && shardLadderNet(p.industryId)?.fill) faults.push(`${where}: the 42/10/5 ladder reached the cost of goods`);
    if (b.opening.kind === "archetype" && startupCapitalArchetypeKeyed(p.trade) === null) faults.push(`${where}: the 80,000 archetype default reached the money to open`);
    if (p.iso2 !== "GB" && b.inputs.oncost.value !== null && !hasCountrySpecificRates(p.iso2)) faults.push(`${where}: the tax table's fallback rate reached the employer charges`);
    if (p.iso2 !== "GB" && b.inputs.loanRate.value !== null && !profiles.has(p.iso2)) faults.push(`${where}: the profile's fallback row reached the loan rate`);
    if (b.roles.some((r) => r.pay.value !== null && !r.pay.stamp)) faults.push(`${where}: a pay with no stamp`);
  }
  check(`no fill reaches an input on ${bundles} bundles of ${trades.length} trades (${faults.slice(0, 6).join("; ") || "none"})`, bundles === trades.length * 3 && faults.length === 0);

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/defaults: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-defaults crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/defaults.test.ts > scratchpad/calc/t2.txt 2>&1; echo "exit $?" >> scratchpad/calc/t2.txt`. Expected: exit 1, the three "is there" reds, "modules missing".

- [ ] **Step 3: The geography a parameter.** In `src/lib/uk/pnl/london.ts`, the line `const LONDON = "E12000007";` becomes `export const LONDON = "E12000007";` followed by `export const ENGLAND = "E92000001";`. Replace the whole of `londonWithholding` and `londonTradeInputs` (from the comment line `/** Why a trade's London money is withheld, or null when it can be built. The data's limits are checked before the` to the closing brace of `londonTradeInputs`) with:

```ts
/** Why a trade's money in a geography is withheld, or null when it can be built. The data's limits are checked before the recipe, so a trade
 *  without one still says what else it lacks. `place` names the geography in the words (London, England). */
export function geographyWithholding(slug: string, geography: string, place: string): string | null {
  /* The slices' own entries only (src/lib/own.ts): `TURNOVER.trades["constructor"]` is the Object function, whose geography threw. */
  const g = own(own(TURNOVER.trades, slug)?.by_geography, geography);
  const bands = g?.turnover_bands_k;
  if (!g || !bands || bands.every((c) => c === 0)) return `no ${place} turnover bands for the trade's code`;
  if (g.thin) return `${g.enterprises} businesses in ${place} on the register, under the 40 its figures need`;
  const category = own(PREMISES.trade_category, slug);
  if (!category) return "no kind of premises for the trade";
  if (GENERIC_PREMISES.has(category)) return `its premises are valued as ${category.toLowerCase()}, an average over unlike occupiers`;
  const row = PREMISES.rows[geography]?.categories[category];
  if (!row || !row.rv_per_m2 || !row.count || !row.floorspace_k_m2) return `no ${place} valuation row for ${category.toLowerCase()}`;
  if (row.count < MIN_PREMISES) return `${row.count} ${category.toLowerCase()} premises in ${place}, too few for the valuation's rounding`;
  if (!own(RECIPES, slug)) return "no recipe";
  return null;
}

export function londonWithholding(slug: string): string | null {
  return geographyWithholding(slug, LONDON, "London");
}

/** The trade's turnover bands in a geography, or null where the register holds none for its code or too few (thin). */
export function geographyBands(slug: string, geography: string): { bands: number[]; enterprises: number } | null {
  const g = own(own(TURNOVER.trades, slug)?.by_geography, geography);
  const bands = g?.turnover_bands_k;
  if (!g || !bands || bands.every((c) => c === 0) || g.thin) return null;
  return { bands, enterprises: g.enterprises };
}

/** The valuation's average premises of the trade's kind in a geography, or null under geographyWithholding's premises rules. */
export function geographyPremises(slug: string, geography: string): { category: string; areaM2: number; rentPerM2: number } | null {
  const category = own(PREMISES.trade_category, slug);
  if (!category || GENERIC_PREMISES.has(category)) return null;
  const row = PREMISES.rows[geography]?.categories[category];
  if (!row || !row.rv_per_m2 || !row.count || !row.floorspace_k_m2 || row.count < MIN_PREMISES) return null;
  return { category, areaM2: (row.floorspace_k_m2 * 1000) / row.count, rentPerM2: row.rv_per_m2 };
}

export function geographyTradeInputs(slug: string, geography: string, place: string, form: Form = "sole trader"): PnlInputs | null {
  if (geographyWithholding(slug, geography, place) !== null) return null;
  /* Own entries (src/lib/own.ts), as geographyWithholding reads them: it answers null only when the trade holds each of these, so a word that
     names a built-in never gets here, and if it did the read is undefined and not the Object function. */
  const category = own(PREMISES.trade_category, slug) as string;
  const row = PREMISES.rows[geography].categories[category] as PremisesRow;
  const bands = own(TURNOVER.trades, slug)!.by_geography[geography].turnover_bands_k as number[];
  return buildInputs(own(RECIPES, slug)!, { revenueBandsK: bands, premises: row, premisesCategory: category, place, form });
}

export function londonTradeInputs(slug: string, form: Form = "sole trader"): PnlInputs | null {
  return geographyTradeInputs(slug, LONDON, "London", form);
}
```

The file's header gains, after its first paragraph, ` * The geography is a parameter since plan 2026-10-13 cost-simulator, Task 2 (England's rows, E92000001, for the calculator's English places); the`, ` * London functions keep their words.` Then GATES `--only=uk-pnl-london,uk-pnl-recipes,uk-pnl-model,london-trade-hero` to `scratchpad/calc/t2-london.txt`. Expected: exit 0 (London unchanged).

- [ ] **Step 4: The words** (`src/lib/spine/copy.ts`), before the line `  /** Words that must never appear in an archetype's copy: the corporate register.`:

```ts
  /** THE COST SIMULATOR, /calculator (plan 2026-10-13 cost-simulator; spec E:/atlas/docs/superpowers/specs/2026-10-13-cost-simulator-design.md,
   *  section 4; R7 4.6's headings). The masthead, the answer, the levers, the month, what moves it most, the money to open it, where figures come
   *  from; each default's line (R7 4.1 and 4.3: "London holds none. This is the UK's."), each empty figure's reason, the sources' notes. Headings
   *  of four words, lines of twelve, labels of three; tests/simulator/display.test.ts reads every string. */
  calculator: {
    title: "What your business costs",
    metaTitle: "What your business costs | Margin Atlas",
    metaDescription: "The sales your business needs to break even, with every cost shown.",
    yoursTail: ", with your figures",
    pick: { label: "Place and trade", country: "Country", city: "City", trade: "Trade", anywhere: "Anywhere in {country}", failed: "That place did not load. Try again." },
    answer: { title: "Sales to break even", month: "Each month must take this much to cover every cost.", day: "A day", customers: "Customers a day", customersNote: "Every day of the year", firms: "Firms above it", firmsNote: "Registered firms in the place", goal: "For your goal", goalNote: "A month, after tax", goalNoteWorld: "A month, before tax", basis: "Fixed costs over what each sale keeps.", basisYours: "Fixed costs over what each sale keeps, with your figures." },
    margin: { title: "Your margin", words: "of each sale you keep, before tax", wordsNoTax: "of each sale you keep, before any tax", after: "After tax", placement: "Your sales top {pct} of firms here." },
    levers: {
      title: "Your numbers",
      fixed: "fixed costs a month, whatever you sell",
      basis: "Move any figure and every answer follows.",
      groups: { team: "Team", premises: "Premises", sales: "Sales", you: "You", loan: "Loan" },
      reset: "Reset",
      yourFigure: "Your figure.",
      add: "Add one",
      remove: "Remove one",
      payYourself: "Pay yourself",
      stopPaying: "Stop paying yourself",
      setTarget: "Set a profit goal",
      dropTarget: "Drop the profit goal",
      form: "Legal form",
      sole: "Sole trader",
      company: "Company",
      staffLine: "The trade's staff line pays the usual team.",
      hireOnTop: "Hires you add stand on top of it.",
      effect: "Break-even now",
      effectTail: "a month",
      labels: { area: "Floor space", rent: "Rent per m2", service: "Service charge", oncost: "Employer charges", sales: "Sales a year", ticket: "Spend per customer", goods: "Cost of goods", runShare: "Running costs", owner: "Your pay", target: "Profit goal", loanAmount: "Loan", loanRate: "Interest rate", loanYears: "Years to repay", opening: "Money to open", pay: "Pay a year" },
      units: { m2: "m2", year: "a year", head: "a head", share: "of sales", pay: "of pay", years: "years", pct: "%" },
    },
    month: { title: "Your month", profit: "profit a month at your sales", loss: "loss a month at your sales", basis: "At sales of {sales} a year.", span: "Show the bill", monthTab: "A month", yearTab: "A year", key: { variable: "Costs per sale", fixed: "Fixed costs", profit: "Profit", loss: "Loss" }, tick: "Break-even", bar: "Your month: costs that follow sales, fixed costs and {last}." },
    bill: { goods: "Cost of goods", running: "Running costs", team: "Your team", teamNote: "{n} people with employer costs", crew: "Staff", rent: "Rent", service: "Service charge", rates: "Business rates", ratesNote: "2026-27 rates on the rent", ratesStandard: "2026-27 rates, standard multiplier", loan: "Loan repayments", owner: "Your pay" },
    moves: { title: "What moves it most", focal: "of sales cover each 100 of fixed costs", basis: "Each figure moved up a tenth, or one more hire.", top: "Largest", rows: { area: "More floor space", rent: "Higher rent", service: "Higher service charge", pay: "Higher pay", goods: "Dearer goods", running: "Higher running costs", owner: "Your higher pay", loan: "A bigger loan", crew: "More staff cost" } },
    opening: { title: "Money to open it", months: "months to earn back the money to open", monthsUk: "months to earn it back, after tax", total: "In all", yours: "Your figure" },
    reasons: { needs: "Fill the empty fields above to see this.", noMargin: "Each sale costs more than it brings in.", noSales: "Type your sales to see this.", loss: "No payback while the month runs at a loss.", noTicket: "Type a spend per customer to see this.", noOpening: "No cost to open is held for this trade.", outOfReach: "Rates stop at a rateable value of £500,000.", beyondSpread: "Past the range of firms held here.", noSpread: "No register of firms is held here.", noTarget: "Set a profit goal to see this." },
    fallback: "{city} holds none. This is {country}'s.",
    lines: {
      area: { valuation: "Average premises of the trade's kind, 2021 valuation.", perWorker: "{m2} m2 a worker in this sector, for the team.", none: "No floor space is held here. Type yours." },
      rent: { valuation: "The 2021 valuation's rent for these premises.", city: "Secondary shop rent in {city}.", country: "The country's average commercial rent.", none: "No rent is held here. Type yours." },
      service: { city: "Service charge in {city}.", valuation: "The valuation's rent holds none. Type yours if you pay one.", none: "No service charge is held here." },
      team: { roles: "The trade's usual team, at its typical counts.", sector: "The trade holds no roles. This is its sector's.", none: "No team is held for this trade.", ukLaw: "Employer NI and pension, 2026-27 law." },
      oncost: { country: "{country}'s employer charges, a share of pay.", none: "No employer charges are held here. Type yours." },
      pay: { city: "{index} times average pay in {city}.", country: "{index} times the country's median pay.", none: "No pay is held here. Type it." },
      sales: { register: "Average sales of registered firms under £5m, March 2026.", cell: "Typical yearly sales for the trade here.", none: "No sales are held here. Type yours." },
      ticket: { trade: "Spend per customer for the trade.", tier: "Spend per customer, set for a city this size.", none: "No spend per customer is held. Type yours." },
      goods: { recipe: "The trade's cost of goods, a share of each sale.", margin: "What the trade's gross margin leaves for goods.", sector: "The sector's cost of goods. The trade holds none.", none: "No cost of goods is held. Type yours." },
      running: { recipe: "Utilities, supplies and running costs, a share of sales.", sector: "The sector's energy, marketing, software and insurance.", none: "No running costs are held. Type yours." },
      owner: { off: "None by default. You keep the profit.", city: "Typical income in {city}.", country: "The country's average pay.", none: "No income figure is held here. Type yours." },
      target: { uk: "The profit you want each year, after tax.", world: "The profit you want each year, before tax." },
      loan: { amount: "None by default. Type a loan if you take one.", uk: "The UK start-up loan rate.", country: "{country}'s bank lending rate.", noRate: "No lending rate is held here. Type yours.", years: "Type the years to repay." },
      opening: { held: "The trade's opening bill for {country}.", built: "Fit-out for this space, the deposit and registration.", archetype: "The trade's usual cost to open, at {city} prices.", archetypeBare: "The trade's usual cost to open.", none: "No cost to open is held for this trade." },
      openingItems: { fitOut: "Fit-out", deposit: "Lease deposit", registration: "Registration" },
      form: "Sole trader by default. Tax follows 2026-27 law.",
    },
    sources: {
      title: "Where figures come from",
      yours: { label: "Your figures", fact: "What you type is kept in this page's address." },
      register: { label: "Registered firms", fact: "Firms and their sales by band, March 2026 snapshot." },
      valuation: { label: "Premises and rents", fact: "The official valuation of business premises, April 2021." },
      law: { label: "UK law", fact: "Rates, employer costs and income tax for 2026-27." },
      cell: { label: "Local firms", fact: "Sales and the bill to open, from the trade's local figures." },
      trade: { label: "The trade", fact: "Team, cost of goods and running costs, as estimates." },
      place: { label: "The place", fact: "Rent, service charge, wages and fit-out, as estimates." },
    },
  },
```

- [ ] **Step 5: The place** `src/lib/simulator/place.ts`:

```ts
/**
 * src/lib/simulator/place.ts , THE PLACE A VIEW NAMES (plan 2026-10-13 cost-simulator, Task 2; spec section 3, "an unknown country, city or trade
 * answers 404"; the plan's Readings 2 and 16). Pure, so the edge, the door gate and the client may read it.
 *
 * Missing words: no country is London; a city with no country names no place; a country with no city is "anywhere in" it; no trade is
 * restaurants. A word is lower case letters, digits and hyphens, or it names nothing. The UK's cities carry their nation (GB_CITY_NATION, held
 * to the city list by tests/simulator/defaults.test.ts): England reads the register and the valuation, Scotland does not (no England rates, and
 * the law module's income tax is the rest of the UK's); "anywhere in" the UK reads England's rows, said.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COUNTRIES, INDUSTRIES, industryToSlug, isDefaultVisible } from "@/lib/taxonomy";
import { own } from "@/lib/own";
import { DEFAULT_PLACE } from "./bundle";

export type Nation = "england" | "scotland" | "wales" | "northern-ireland";
export type Place = { iso2: string; country: string; countryName: string; city: string | null; cityName: string | null; trade: string; industryId: string; tradeName: string; nation: Nation | null };

/** Declared in bundle.ts, which the browser loads, so the client never reaches this file's city list and taxonomy. */
export { DEFAULT_PLACE };

export const GB_CITY_NATION: Readonly<Record<string, Nation>> = {
  birmingham: "england",
  bristol: "england",
  edinburgh: "scotland",
  glasgow: "scotland",
  leeds: "england",
  london: "england",
  manchester: "england",
};

const CITIES = (cityListJson as { cities: Array<{ slug: string; iso2: string; name: string }> }).cities;
const TRADES = INDUSTRIES.filter(isDefaultVisible).map((i) => ({ slug: industryToSlug(i.id), id: i.id, name: i.name })).sort((a, b) => a.name.localeCompare(b.name));
const WORD = /^[a-z0-9-]{1,64}$/;

export function simulatorTrades(): Array<{ slug: string; id: string; name: string }> {
  return TRADES;
}
export function simulatorCountries(): Array<{ code: string; name: string }> {
  return COUNTRIES.map((c) => ({ code: c.code.toLowerCase(), name: c.name }));
}
export function simulatorCities(): Array<{ slug: string; iso2: string; name: string }> {
  return CITIES.map((c) => ({ slug: c.slug, iso2: c.iso2.toUpperCase(), name: c.name })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The city slug when the city list holds it for that country, else null (a trade page's geography may be a region or a council). */
export function cityOfCountry(iso2: string, slug: string | null | undefined): string | null {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return CITIES.some((c) => c.slug === s && c.iso2.toUpperCase() === iso2.toUpperCase()) ? s : null;
}

export function resolvePlace(q: { country?: string | null; city?: string | null; trade?: string | null }): Place | null {
  const word = (w: string | null | undefined) => (w == null || w === "" ? null : String(w).toLowerCase());
  let country = word(q.country);
  let city = word(q.city);
  const trade = word(q.trade) ?? DEFAULT_PLACE.trade;
  if ([country, city, trade].some((w) => w !== null && !WORD.test(w))) return null;
  if (country === null) {
    if (city !== null) return null;
    country = DEFAULT_PLACE.country;
    city = DEFAULT_PLACE.city;
  }
  const c = COUNTRIES.find((x) => x.code.toLowerCase() === country);
  if (!c) return null;
  const iso2 = c.code.toUpperCase();
  const row = city === null ? null : CITIES.find((x) => x.slug === city && x.iso2.toUpperCase() === iso2) ?? null;
  if (city !== null && !row) return null;
  const t = TRADES.find((x) => x.slug === trade);
  if (!t) return null;
  const nation: Nation | null = iso2 !== "GB" ? null : row ? own(GB_CITY_NATION, row.slug) ?? null : "england";
  return { iso2, country: iso2.toLowerCase(), countryName: c.name, city: row ? row.slug : null, cityName: row ? row.name : null, trade: t.slug, industryId: t.id, tradeName: t.name, nation };
}
```

- [ ] **Step 6: The bundle** `src/lib/simulator/bundle.ts`:

```ts
/**
 * src/lib/simulator/bundle.ts , A PLACE'S DEFAULTS AND THE READER'S CHANGES, AS THE ENGINE TAKES THEM (plan 2026-10-13 cost-simulator, Task 2).
 * Pure and small: the browser imports it with the engine. The defaults builder (defaults.ts, on the server) writes a SimBundle; the levers write
 * a SimState; toEngine joins them, every figure the reader set stamped "yours" (`calculator:lever:<key>`). The owner's pay and the profit goal are
 * off until the reader turns them on (R7 4.1: "none by default: the owner keeps the profit").
 */
import type { EngineInputs, Form, Share, Spread, Stamp, Tax, Value } from "./engine";

export type Level = "city" | "nation" | "country" | "trade" | "sector" | "law" | "none";
export type SimInput = { value: number | null; stamp: Stamp | null; level: Level; line: string };

export const LEVERS = ["area", "rent", "service", "oncost", "sales", "ticket", "goods", "runShare", "owner", "target", "loanAmount", "loanRate", "loanYears", "opening"] as const;
export type LeverKey = (typeof LEVERS)[number];

export type SimRole = { key: string; name: string; sub: string | null; heads: number; headsStamp: Stamp; pay: SimInput; owner: boolean };
export type OpeningLine = { key: string; name: string; amount: number; stamp: Stamp };
export type OpeningRule = { kind: "held" | "built" | "archetype" | "none"; lines: OpeningLine[]; line: string };

export type SimBundle = {
  path: "uk-model" | "world";
  currency: "GBP" | "USD";
  inputs: Record<LeverKey, SimInput>;
  roles: SimRole[];
  teamLine: string;
  /** The UK's law per hire (employer_cost.ts); `allowance` false on the UK model, whose staff line has spent the Employment Allowance. */
  ukLaw: { allowance: boolean } | null;
  lines: Array<{ key: string; name: string; amountYear: number; stamp: Stamp }>;
  variable: Share[] | null;
  rates: EngineInputs["rates"];
  ratesLine: string | null;
  tax: Tax;
  spread: Spread | null;
  opening: OpeningRule;
  notes: Array<{ label: string; fact: string }>;
};

export type SimState = {
  levers: Partial<Record<LeverKey, number | null>>;
  on: { owner?: boolean; target?: boolean };
  heads: Record<string, number>;
  pay: Record<string, number>;
  form: Form | null;
};
export const FRESH: SimState = { levers: {}, on: {}, heads: {}, pay: {}, form: null };

/** The bare page's place, London restaurants, the site's exemplar (R7 4.1's first row); place.ts re-exports it. */
export const DEFAULT_PLACE = { country: "gb", city: "london", trade: "restaurants" } as const;

export const yours = (key: string): Stamp => ({ src: `calculator:lever:${key}`, kind: "yours" });

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

export function toEngine(b: SimBundle, s: SimState): EngineInputs {
  const pick = (k: LeverKey): Value => {
    if (has(s.levers, k)) { const x = s.levers[k]; return x == null || !Number.isFinite(x) ? null : { v: x, stamp: yours(k) }; }
    const d = b.inputs[k];
    return d.value === null || d.stamp === null ? null : { v: d.value, stamp: d.stamp };
  };
  const goods = pick("goods");
  const sum = (b.variable ?? []).reduce((a, x) => a + x.share, 0);
  /* The reader's cost of goods keeps the defaults' split between their lines, each stamped as the reader's. */
  const variable: Share[] | null = !has(s.levers, "goods") ? b.variable : goods === null ? null : sum > 0 ? (b.variable ?? []).map((x) => ({ ...x, share: (x.share * goods.v) / sum, stamp: goods.stamp })) : [{ key: "goods", share: goods.v, stamp: goods.stamp }];
  const oncost = pick("oncost");
  return {
    area: pick("area"),
    rentPerM2: pick("rent"),
    serviceChargePerM2: pick("service"),
    rates: b.rates,
    lines: b.lines.map((l) => ({ key: l.key, amountYear: l.amountYear, stamp: l.stamp })),
    roles: b.roles.map((r) => ({
      key: r.key,
      heads: has(s.heads, r.key) ? s.heads[r.key] : r.heads,
      headsStamp: has(s.heads, r.key) ? yours(`team:${r.key}`) : r.headsStamp,
      payYear: has(s.pay, r.key) ? { v: s.pay[r.key], stamp: yours(`pay:${r.key}`) } : r.pay.value === null || r.pay.stamp === null ? null : { v: r.pay.value, stamp: r.pay.stamp },
    })),
    onCost: b.ukLaw ? { law: "uk", allowance: b.ukLaw.allowance } : oncost ? { rate: oncost } : null,
    variable,
    runningShare: pick("runShare"),
    ownerPay: s.on.owner ? pick("owner") : null,
    targetProfit: s.on.target ? pick("target") : null,
    sales: pick("sales"),
    ticket: pick("ticket"),
    openingCost: pick("opening"),
    loan: { amount: pick("loanAmount"), ratePct: pick("loanRate"), years: pick("loanYears") },
    tax: b.tax.law === "uk" ? { law: "uk", form: s.form ?? b.tax.form } : b.tax,
    spread: b.spread,
  };
}
```

- [ ] **Step 7: A cell's facts** `src/lib/simulator/cell_facts.ts`:

```ts
/**
 * src/lib/simulator/cell_facts.ts , WHAT A TRADE CELL GIVES THE DEFAULTS (plan 2026-10-13 cost-simulator, Task 2; R7 4.1's sales row, "a trusted
 * cell's typical", the firms above break-even "from its p10 to p90", and the cost to open, "the cell's held bill"). Pure: the cell's type only is
 * read from src/lib/cells.ts, so the chain's tests import this without the database client. Dollars, as the cells hold them.
 */
import type { Cell } from "@/lib/cells";
import { isTrustedLocalCell } from "@/lib/cells/trust";
import { setupItemsFromCell } from "@/lib/spine/setup_items";

export type CellFacts = {
  src: string;
  typical: number | null;
  tenths: { p10: number; p25: number; p50: number; p75: number; p90: number } | null;
  firms: number | null;
  setup: { items: Array<{ name: string; usd: number }>; scope: string } | null;
};

const pos = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) && x > 0 ? x : null);

export function cellFacts(cell: Cell | null | undefined, place: { country: string; city: string | null; trade: string; industryId: string }): CellFacts | null {
  if (!cell) return null;
  const trusted = isTrustedLocalCell(cell, place.industryId);
  const t = [pos(cell.rev_p10), pos(cell.rev_p25), pos(cell.rev_p50), pos(cell.rev_p75), pos(cell.rev_p90)];
  const rising = t.every((x, k) => x !== null && (k === 0 || x >= (t[k - 1] as number)));
  return {
    src: `cells:${place.country}:${place.city}:${place.trade}`,
    typical: trusted ? pos(cell.rev_p50) ?? pos(cell.revenue_per_firm) : null,
    tenths: trusted && rising ? { p10: t[0] as number, p25: t[1] as number, p50: t[2] as number, p75: t[3] as number, p90: t[4] as number } : null,
    firms: trusted ? pos(cell.n_enterprises) : null,
    setup: setupItemsFromCell(cell) ?? null,
  };
}
```

- [ ] **Step 8: The defaults** `src/lib/simulator/defaults.ts`:

```ts
/**
 * src/lib/simulator/defaults.ts , EVERY DEFAULT WITH ITS STAMP, ITS LEVEL AND ITS LINE (plan 2026-10-13 cost-simulator, Task 2; spec sections 2 and
 * 3; R7 table 4.1 row for row, its fallbacks city, then country, then none, said in the row).
 *
 * TWO PATHS. "uk-model": the place is in England (London its own rows, any other English city and "anywhere in" the UK England's) and the trade
 * passes model.ts's own conditions there with a recipe that carries its utilities (london_trade_hero.ts's rule, made geographic). Its engine
 * inputs are model.ts's business (uk_model.ts), so the break-even at these defaults is model.ts's to the penny, and the trade's roles stand at
 * nought heads as hires on top. "world": every other place and trade, R7 4.1's rows as the files hold them, in pounds for a UK place (the
 * site's parse-time pound rate, fx.ts) and dollars elsewhere. A UK place on the world path keeps the valuation's premises and the register's
 * sales where England holds them.
 *
 * NEVER A FILL (spec section 3): a row the place lacks falls back a level and says so, or stands empty with its line. The files' own fallbacks
 * are never read: the tax table's and the two profiles' default_fallback, the 42/10/5 ladder (trade_net.ts LADDER_FILL), the 80,000 archetype
 * default (startupCapitalArchetypeKeyed answers null on it). tests/simulator/defaults.test.ts holds each.
 *
 * ITS BLIND SPOT, stated: it reads what the files hold and cannot tell a city's rent from a guess filed under the city; every shard figure is an
 * estimate and is stamped so. Server only: it reads the fact shards from disk. It never imports src/lib/cells.ts: the cell comes as an argument.
 */
import icpJson from "../../../data/finance/industry_cost_profile_v1.json";
import { cityFigure } from "@/lib/facts/city_shard";
import { countryFigure } from "@/lib/facts/country_shard";
import { industryFigure } from "@/lib/facts/industry_shard";
import { countryMedianPay, shardRoles } from "@/lib/spine/team_rows";
import { shardLadderNet } from "@/lib/spine/trade_net";
import { placeCostFactor } from "@/lib/spine/open_rows";
import { inSentence } from "@/lib/spine/place_names";
import { registerSrc } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import { getCityAnnualWageUsd } from "@/lib/economic_profile/city_wages";
import { getCountryProfile, listCountryProfiles } from "@/lib/economic_profile";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getAovCityTierMultiplier } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { getCountryTaxRates, hasCountrySpecificRates } from "@/lib/tax";
import { startupCapitalArchetypeKeyed } from "@/lib/markets/startup_capital_archetypes";
import { honestRound } from "@/lib/uk/present/precision";
import { convertUsdTo } from "@/lib/finance/fx";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { own } from "@/lib/own";
import { RECIPES } from "@/lib/uk/pnl/recipes";
import { anchorSalesFromBands } from "@/lib/uk/pnl/inputs";
import { ENGLAND, LONDON, geographyBands, geographyPremises, geographyTradeInputs } from "@/lib/uk/pnl/london";
import { pennies } from "@/lib/uk/law/money";
import { STAFF_DRIVER, ukModelInputs } from "./uk_model";
import type { ProvenanceKind } from "@/lib/spine/provenance";
import type { Share, Spread, Stamp } from "./engine";
import type { Place } from "./place";
import type { CellFacts } from "./cell_facts";
import type { Level, LeverKey, OpeningLine, OpeningRule, SimBundle, SimInput, SimRole } from "./bundle";

const W = COPY.calculator;
const ICP = (icpJson as unknown as { sectors: Record<string, Record<string, number>> }).sectors;
const RUNNING_KEYS = ["energy_share", "marketing_share", "software_share", "insurance_share", "motor_vehicle_share", "other_overhead_share"] as const;
/** A producer paid a share of what they take (recipes.ts P1's commission): off the UK model the team pays producers, so it is no cost of goods. */
const COMMISSION = /commission/i;

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const est = (src: string): Stamp => ({ src, kind: "estimate" });
const pos = (x: number | null | undefined): number | null => (typeof x === "number" && Number.isFinite(x) && x > 0 ? x : null);
const input = (value: number | null, stamp: Stamp | null, level: Level, line: string): SimInput => (value === null || stamp === null ? { value: null, stamp: null, level: "none", line } : { value, stamp, level, line });

type Step = { level: Level; value: number | null; src: string; kind: ProvenanceKind; line: string };
/** The first level that holds the figure; past the first, a city's row says it holds none and whose figure stands ("Berlin holds none. This is Germany's."). */
function stepDown(place: Place, steps: Array<Step | null>, noneLine: string): SimInput {
  const live = steps.filter((s): s is Step => s !== null);
  for (let k = 0; k < live.length; k++) {
    const s = live[k];
    if (s.value === null) continue;
    const fellBack = k > 0 && live[0].level === "city" && place.cityName !== null;
    const whose = s.level === "nation" ? "England" : inSentence(place.countryName);
    return { value: s.value, stamp: { src: s.src, kind: s.kind }, level: s.level, line: fellBack ? fill(W.fallback, { city: place.cityName as string, country: whose }) : s.line };
  }
  return { value: null, stamp: null, level: "none", line: noneLine };
}

function notesOf(b: Omit<SimBundle, "notes">): Array<{ label: string; fact: string }> {
  const srcs = [
    ...Object.values(b.inputs).map((x) => x.stamp?.src ?? ""),
    ...b.lines.map((l) => l.stamp.src),
    ...b.opening.lines.map((l) => l.stamp.src),
    ...b.roles.flatMap((r) => [r.headsStamp.src, r.pay.stamp?.src ?? ""]),
    ...(b.variable ?? []).map((s) => s.stamp.src),
    b.spread?.stamp.src ?? "",
  ];
  const holds = (re: RegExp) => srcs.some((s) => re.test(s));
  const S = W.sources;
  const out = [
    holds(/turnover\.json/) ? S.register : null,
    holds(/premises\.json/) ? S.valuation : null,
    b.ukLaw || b.rates || b.tax.law === "uk" ? S.law : null,
    holds(/^cells:|setup_costs:/) ? S.cell : null,
    holds(/recipes\.ts|facts\/industry\/|industry_cost_profile/) ? S.trade : null,
    holds(/facts\/city\/|facts\/country\/|city_wage_premium|economic_profile|country_metrics|country_rates|startup_capital_archetypes/) ? S.place : null,
  ].filter((n): n is { label: string; fact: string } => n !== null);
  return out.slice(0, 5).map((n) => ({ label: n.label, fact: n.fact }));
}

function worldBundle(place: Place, cell: CellFacts | null): SimBundle {
  const uk = place.iso2 === "GB";
  const currency: "GBP" | "USD" = uk ? "GBP" : "USD";
  const money = (usd: number | null): number | null => (usd === null ? null : currency === "USD" ? usd : convertUsdTo("GBP", usd));
  const geography = uk && place.nation === "england" ? (place.city === "london" ? LONDON : ENGLAND) : null;
  const ownRows = geography === LONDON || place.cityName === null;
  const geoLevel: Level = geography === LONDON ? "city" : "nation";
  const said = (line: string) => (ownRows ? line : fill(W.fallback, { city: place.cityName as string, country: "England" }));
  const cityId = place.city ? `${place.iso2}-${place.city}` : null;
  const city = (metric: string) => (place.city ? pos(cityFigure(place.iso2, place.city, metric)?.value) : null);
  const country = (metric: string) => pos(countryFigure(place.iso2, metric)?.value);
  const csrc = (metric: string) => `facts/city/${cityId}.json:${metric}`;
  const ksrc = (metric: string) => `facts/country/${place.iso2}.json:${metric}`;
  const sectorId = INDUSTRY_BY_ID[place.industryId]?.sector_id ?? null;
  const sector = sectorId ? own(ICP, sectorId) ?? null : null;
  const recipe = own(RECIPES, place.trade) ?? null;
  const premises = geography ? geographyPremises(place.trade, geography) : null;
  const premisesStamp = (): Stamp => ({ src: `uk/registers/premises.json:${place.trade}:${geography}`, kind: "worked out" });

  /* THE TEAM: the shard's roles at their typical counts, the owner's seat at nought (the owner's pay row stands for it); else the sector's small
     firm as one role; pay is the role's index times the city's wage, else the country's median. */
  const shard = shardRoles(place.industryId);
  const cityWage = place.city ? pos(getCityAnnualWageUsd(place.city)) : null;
  const median = pos(countryMedianPay(place.iso2));
  const payOf = (index: number): SimInput =>
    stepDown(place, [
      place.city ? { level: "city", value: cityWage === null ? null : money(pennies(cityWage * index)), src: `economics/city_wage_premium_v1.json:${place.city} x ${index}`, kind: "estimate", line: fill(W.lines.pay.city, { index, city: place.cityName ?? "" }) } : null,
      { level: "country", value: median === null ? null : money(pennies(median * index)), src: `economic_profile:${place.iso2}.median_wage_full_time_usd x ${index}`, kind: "estimate", line: fill(W.lines.pay.country, { index }) },
    ], W.lines.pay.none);
  const key = (k: string) => k.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const small = sector ? pos(sector.typical_employees_small) : null;
  const roles: SimRole[] = shard.length > 0
    ? shard.map((r) => { const owner = /^owner\b/i.test(r.role); return { key: key(r.key), name: r.name, sub: r.sub, heads: owner ? 0 : r.headcount, headsStamp: est(`facts/industry/${place.industryId}.json:roles.${r.key}.headcount_typical`), pay: payOf(r.wageIndex), owner }; })
    : small !== null ? [{ key: "staff", name: W.bill.team, sub: null, heads: small, headsStamp: est(`finance/industry_cost_profile_v1.json:${sectorId}.typical_employees_small`), pay: payOf(1), owner: false }] : [];
  const heads = shard.length > 0 ? shard.reduce((a, r) => a + r.headcount, 0) : small ?? 0;

  const sqm = sector ? pos(sector.sqm_per_fte) : null;
  const area = premises ? input(premises.areaM2, premisesStamp(), geoLevel, said(W.lines.area.valuation))
    : sqm !== null && heads > 0 ? input(pennies(sqm * heads), est(`finance/industry_cost_profile_v1.json:${sectorId}.sqm_per_fte x ${heads}`), "sector", fill(W.lines.area.perWorker, { m2: sqm }))
    : input(null, null, "none", W.lines.area.none);
  const rent = premises ? input(premises.rentPerM2, premisesStamp(), geoLevel, said(W.lines.rent.valuation))
    : stepDown(place, [
      place.city ? { level: "city", value: money(city("realestate.rent_secondary_usd_sqm_yr")), src: csrc("realestate.rent_secondary_usd_sqm_yr"), kind: "estimate", line: fill(W.lines.rent.city, { city: place.cityName ?? "" }) } : null,
      { level: "country", value: money(country("costs.commercial_rent_usd_sqm_yr")), src: ksrc("costs.commercial_rent_usd_sqm_yr"), kind: "estimate", line: W.lines.rent.country },
    ], W.lines.rent.none);
  // Q1 (plan 2026-10-13 cost-simulator), answer A: a rent that is the valuation's carries no service charge. Answer B takes the city's here too.
  const service = premises ? input(null, null, "none", W.lines.service.valuation)
    : stepDown(place, [place.city ? { level: "city", value: money(city("realestate.service_charge_usd_sqm_yr")), src: csrc("realestate.service_charge_usd_sqm_yr"), kind: "estimate", line: fill(W.lines.service.city, { city: place.cityName ?? "" }) } : null], W.lines.service.none);
  const oncost: SimInput = uk ? { value: null, stamp: null, level: "law", line: W.lines.team.ukLaw }
    : hasCountrySpecificRates(place.iso2) ? input(getCountryTaxRates(place.iso2).employer_social, est(`tax/country_rates_2024.json:${place.iso2}.employer_social`), "country", fill(W.lines.oncost.country, { country: inSentence(place.countryName) }))
    : input(null, null, "none", W.lines.oncost.none);

  /* EACH SALE: the recipe's goods (no commission), else what the gross margin leaves (never the 42/10/5 ladder), else the sector's share; the
     running costs as a share of sales, the recipe's lines that pay no staff, else the sector's six running shares. */
  const recipeGoods = recipe ? recipe.variable.filter((s) => !COMMISSION.test(s.driver) && !COMMISSION.test(s.key)) : [];
  const ladder = shardLadderNet(place.industryId);
  const gross = ladder && !ladder.fill ? industryFigure(place.industryId, "margin_ladder.gross_margin_pct")?.value ?? null : null;
  const from: "recipe" | "margin" | "sector" | null = recipeGoods.length > 0 ? "recipe" : gross !== null && gross >= 0 && gross <= 100 ? "margin" : sector && pos(sector.cogs_share) !== null ? "sector" : null;
  const variable: Share[] | null = from === "recipe" ? recipeGoods.map((s) => ({ key: s.key, share: s.shareOfSales, stamp: est(`uk/pnl/recipes.ts:${place.trade}:${s.key}`) }))
    : from === "margin" ? [{ key: "goods", share: 1 - (gross as number) / 100, stamp: est(`facts/industry/${place.industryId}.json:margin_ladder.gross_margin_pct`) }]
    : from === "sector" && sector ? [{ key: "goods", share: sector.cogs_share, stamp: est(`finance/industry_cost_profile_v1.json:${sectorId}.cogs_share`) }]
    : null;
  const goodsLine = from === "recipe" ? W.lines.goods.recipe : from === "margin" ? W.lines.goods.margin : from === "sector" ? W.lines.goods.sector : W.lines.goods.none;
  const goods = variable ? input(variable.reduce((a, s) => a + s.share, 0), variable.length === 1 ? variable[0].stamp : est(`uk/pnl/recipes.ts:${place.trade}:${variable.map((s) => s.key).join("+")}`), from === "sector" ? "sector" : "trade", goodsLine) : input(null, null, "none", goodsLine);
  const recipeRun = recipe ? recipe.sized.filter((s) => !STAFF_DRIVER.test(s.driver)) : [];
  const sectorRun = sector ? RUNNING_KEYS.reduce((a, k) => a + (pos(sector[k]) ?? 0), 0) : 0;
  const runShare = recipeRun.length > 0 ? input(recipeRun.reduce((a, s) => a + s.shareOfSales, 0), est(`uk/pnl/recipes.ts:${place.trade}:${recipeRun.map((s) => s.key).join("+")}`), "trade", W.lines.running.recipe)
    : sectorRun > 0 ? input(sectorRun, est(`finance/industry_cost_profile_v1.json:${sectorId}:${RUNNING_KEYS.join("+")}`), "sector", W.lines.running.sector)
    : input(null, null, "none", W.lines.running.none);

  /* SALES AND THE FIRMS: England's register where it holds the trade, else a trusted cell. */
  const bands = geography ? geographyBands(place.trade, geography) : null;
  const anchor = bands ? anchorSalesFromBands(bands.bands) : null;
  // Q1 (plan 2026-10-13 cost-simulator), answer A: the register's mean under 5m, model.ts's anchor. Answer B takes bandQuantile(bands, 0.5) here.
  const sales = anchor !== null ? input(anchor, { src: registerSrc("turnover.json", place.trade, geography as string), kind: "worked out" }, geoLevel, said(W.lines.sales.register))
    : cell?.typical ? input(money(cell.typical), est(`${cell.src}:rev_p50`), "city", W.lines.sales.cell)
    : input(null, null, "none", W.lines.sales.none);
  const tenths = cell?.tenths && cell.firms ? cell.tenths : null;
  const spread: Spread | null = bands ? { kind: "bands", revenueBandsK: bands.bands, stamp: { src: registerSrc("turnover.json", place.trade, geography as string), kind: "counted" } }
    : tenths && cell?.firms ? { kind: "tenths", p10: money(tenths.p10) as number, p25: money(tenths.p25) as number, p50: money(tenths.p50) as number, p75: money(tenths.p75) as number, p90: money(tenths.p90) as number, firms: cell.firms, stamp: est(`${cell.src}:rev_p10+rev_p90`) }
    : null;
  const sph = pos(industryFigure(place.industryId, "demand.spend_per_head_usd")?.value);
  const mult = getAovCityTierMultiplier(place.industryId, place.city ? getCityTier(place.city) : null);
  const ticket = sph !== null ? input(money(sph * mult), est(`facts/industry/${place.industryId}.json:demand.spend_per_head_usd${mult !== 1 ? ` x ${mult}` : ""}`), "trade", mult !== 1 ? W.lines.ticket.tier : W.lines.ticket.trade) : input(null, null, "none", W.lines.ticket.none);

  /* YOU AND THE LOAN. */
  const ownerMonth = city("owner_col.median_salary_usd_mo");
  const avg = pos(getCountryEconomicsSnapshot(place.iso2).avgMonthlySalary);
  const owner = stepDown(place, [
    place.city ? { level: "city", value: ownerMonth === null ? null : money(ownerMonth * 12), src: `${csrc("owner_col.median_salary_usd_mo")} x 12`, kind: "estimate", line: fill(W.lines.owner.city, { city: place.cityName ?? "" }) } : null,
    { level: "country", value: avg === null ? null : money(avg * 12), src: `economics/country_metrics:${place.iso2}.avgMonthlySalary x 12`, kind: "estimate", line: W.lines.owner.country },
  ], W.lines.owner.none);
  const taxed = uk && place.nation !== "scotland";
  const ukRate = uk ? pos(countryFigure("GB", "financing.startup_loan_rate_pct")?.value) : null;
  const lend = !uk && listCountryProfiles().some((p) => p.iso2 === place.iso2) ? pos(getCountryProfile(place.iso2).bank_lending_rate_pct) : null;
  const loanRate = ukRate !== null ? input(ukRate, { src: "facts/country/GB.json:financing.startup_loan_rate_pct", kind: "looked up" }, "country", W.lines.loan.uk)
    : lend !== null ? input(lend, est(`economic_profile:${place.iso2}.bank_lending_rate_pct`), "country", fill(W.lines.loan.country, { country: inSentence(place.countryName) }))
    : input(null, null, "none", W.lines.loan.noRate);

  /* THE MONEY TO OPEN IT: the cell's held bill, else fit-out for this floor space, the deposit and registration, else the trade's archetype at
     the city's prices (never on a UK page without its own city index, as the trade page holds it), else none. */
  let opening: OpeningRule;
  const fit = city("realestate.fit_out_cost_usd_sqm");
  if (cell?.setup) {
    const scope = cell.setup.scope;
    opening = { kind: "held", lines: cell.setup.items.map((it, k) => ({ key: `held-${k}`, name: it.name, amount: pennies(money(it.usd) as number), stamp: est(`setup_costs:${place.industryId}:${scope}`) })), line: fill(W.lines.opening.held, { country: scope === place.iso2 ? inSentence(place.countryName) : scope }) };
  } else if (fit !== null && area.value !== null) {
    const lines: OpeningLine[] = [{ key: "fit-out", name: W.lines.openingItems.fitOut, amount: pennies((money(fit) as number) * area.value), stamp: est(`${csrc("realestate.fit_out_cost_usd_sqm")} x area`) }];
    const months = city("realestate.deposit_months");
    if (months !== null && rent.value !== null) lines.push({ key: "deposit", name: W.lines.openingItems.deposit, amount: pennies(((area.value * rent.value) / 12) * months), stamp: est(`${csrc("realestate.deposit_months")} x rent`) });
    const reg = country("costs.license_setup_usd");
    if (reg !== null) lines.push({ key: "registration", name: W.lines.openingItems.registration, amount: pennies(money(reg) as number), stamp: est(ksrc("costs.license_setup_usd")) });
    opening = { kind: "built", lines, line: W.lines.opening.built };
  } else {
    const factor = place.city ? placeCostFactor({ iso2: place.iso2, geo: place.city }) : null;
    const keyed = factor === null && uk ? null : startupCapitalArchetypeKeyed(place.trade);
    opening = keyed !== null
      ? { kind: "archetype", lines: [{ key: "archetype", name: W.opening.total, amount: pennies(money(factor !== null ? honestRound(keyed * factor) : keyed) as number), stamp: est(`markets/startup_capital_archetypes:${place.trade}${factor !== null ? `:${place.city}` : ""}`) }], line: factor !== null && place.cityName ? fill(W.lines.opening.archetype, { city: place.cityName }) : W.lines.opening.archetypeBare }
      : { kind: "none", lines: [], line: W.lines.opening.none };
  }
  const openTotal = opening.lines.reduce((a, l) => a + l.amount, 0);
  const openingInput = opening.lines.length > 0 ? input(pennies(openTotal), opening.lines.length === 1 ? opening.lines[0].stamp : { src: opening.lines.map((l) => l.stamp.src).join(" + "), kind: "estimate" }, opening.kind === "archetype" ? "trade" : "city", opening.line) : input(null, null, "none", opening.line);

  const inputs: Record<LeverKey, SimInput> = {
    area, rent, service, oncost, sales, ticket, goods, runShare, owner,
    target: { value: null, stamp: null, level: "none", line: taxed ? W.lines.target.uk : W.lines.target.world },
    loanAmount: { value: null, stamp: null, level: "none", line: W.lines.loan.amount },
    loanRate,
    loanYears: { value: null, stamp: null, level: "none", line: W.lines.loan.years },
    opening: openingInput,
  };
  const partial: Omit<SimBundle, "notes"> = {
    path: "world", currency, inputs, roles,
    teamLine: shard.length > 0 ? W.lines.team.roles : roles.length > 0 ? W.lines.team.sector : W.lines.team.none,
    ukLaw: uk ? { allowance: true } : null,
    lines: [],
    variable,
    rates: geography ? { law: "england", retailHospitalityLeisure: recipe?.retailHospitalityLeisure ?? false } : null,
    ratesLine: geography ? (recipe ? W.bill.ratesNote : W.bill.ratesStandard) : null,
    tax: taxed ? { law: "uk", form: "sole trader" } : { law: "none" },
    spread, opening,
  };
  return { ...partial, notes: notesOf(partial) };
}

export function buildBundle(place: Place, opts: { cell: CellFacts | null }): SimBundle {
  const world = worldBundle(place, opts.cell);
  const geography = place.iso2 === "GB" && place.nation === "england" ? (place.city === "london" ? LONDON : ENGLAND) : null;
  const recipe = own(RECIPES, place.trade);
  const model = geography && recipe?.utilitiesCarried === true ? geographyTradeInputs(place.trade, geography, geography === LONDON ? "London" : "England") : null;
  if (!model || !geography) return world;
  /* THE UK MODEL: model.ts's business; the world rows' place figures (premises, sales, the bands, the owner's pay, the loan, the opening) stand. */
  const e = ukModelInputs(model, { trade: place.trade, geography });
  const names: Record<string, string> = { crew: W.bill.crew, running: W.bill.running };
  const partial: Omit<SimBundle, "notes"> = {
    ...world,
    path: "uk-model",
    inputs: {
      ...world.inputs,
      goods: { ...world.inputs.goods, value: model.variable.reduce((a, s) => a + s.share, 0), stamp: est(`uk/pnl/recipes.ts:${place.trade}:${model.variable.map((s) => s.key).join("+")}`), level: "trade", line: W.lines.goods.recipe },
      runShare: { value: null, stamp: null, level: "none", line: "" },
    },
    roles: world.roles.map((r) => ({ ...r, heads: 0 })),
    ukLaw: { allowance: false },
    lines: e.lines.map((l) => ({ key: l.key, name: names[l.key] ?? l.key, amountYear: l.amountYear, stamp: l.stamp })),
    variable: (e.variable ?? []).map((s) => ({ ...s })),
    rates: e.rates,
    tax: e.tax,
    spread: e.spread,
  };
  return { ...partial, notes: notesOf(partial) };
}
```

- [ ] **Step 9: The one database read** `src/lib/simulator/load.ts`:

```ts
/**
 * src/lib/simulator/load.ts , THE CALCULATOR'S ONE DATABASE READ (plan 2026-10-13 cost-simulator, Task 2): the place's trade cell through
 * getCellBySlug inside withBudget, so a slow or failing read leaves the defaults to the shards (the sales withheld where no register holds them,
 * the money to open built or the archetype's) and never breaks the page. Server only; the chain's tests never import this file
 * (src/lib/cells.ts builds the database client at import) and build bundles with defaults.ts directly.
 * ITS BLIND SPOT, stated: withBudget logs a timeout and nothing else, so a fast failure reads as a cell that holds nothing (CLAUDE.md, rule 2).
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { cellFacts, type CellFacts } from "./cell_facts";
import { buildBundle } from "./defaults";
import type { Place } from "./place";
import type { SimBundle } from "./bundle";

const CELL_BUDGET_MS = 1500;

export async function loadSimulatorCell(place: Place): Promise<CellFacts | null> {
  if (!place.city) return null;
  const cell = await withBudget(getCellBySlug(place.country, place.city, place.trade).catch(() => null), null, CELL_BUDGET_MS, "calculator-cell");
  return cellFacts(cell, place);
}

export async function loadPlaceBundle(place: Place): Promise<SimBundle> {
  return buildBundle(place, { cell: await loadSimulatorCell(place) });
}
```

- [ ] **Step 10: Run it to see it pass.** The Step 2 command. Expected: exit 0, `simulator/defaults: all pass`. If "Berlin's break-even through the files" reds, the files moved since 2026-10-13: the PASS lines above it name which figure, and the report quotes it; the engine's hand-worked case stands (Task 1), and the test's expected figure is never edited to a new file value without the controller.

- [ ] **Step 11: Wire the gate.** In `scripts/prebuild_all.ts`, after `  { name: "calc-engine", script: "tests/simulator/engine.test.ts" },` insert:

```ts
  /* THE COST SIMULATOR'S DEFAULTS (plan 2026-10-13 cost-simulator, Task 2): R7 4.1 row for row, city then country then none with its line, the
     no-fill sweep, a city with no rent (Review Focus 3), London's and England's break-even on model.ts. Offline: the shards and the slices. */
  { name: "calc-defaults", script: "tests/simulator/defaults.test.ts" },
```

Stage, COUNTS, then GATES `--only=calc-defaults,calc-engine,uk-pnl-london,london-trade-hero,archetype-copy,counts-fresh` to `scratchpad/calc/t2-gates.txt`. Expected: exit 0. Then MEMORY and TYPECHECK to `scratchpad/calc/t2-tsc.txt`: exit 0.

- [ ] **Step 12: Commit.**

```bash
cd /e/atlas/website && git add src/lib/uk/pnl/london.ts src/lib/simulator/place.ts src/lib/simulator/bundle.ts src/lib/simulator/cell_facts.ts src/lib/simulator/defaults.ts src/lib/simulator/load.ts src/lib/spine/copy.ts tests/simulator/defaults.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:defaults: every default with its stamp, level and line, R7 4.1 row for row on two paths (model.ts's business in England, the shards elsewhere), city then country then none, never a fill (plan 2026-10-13 cost-simulator, Task 2)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 3: The place switch's route

**Files:**
- Create: `src/lib/simulator/respond.ts`, `src/app/api/calculator/route.ts`
- Modify (generated): `src/lib/routing/route_shapes.ts` (by `scripts/gen_route_shapes.ts`)
- Test: `tests/simulator/api.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-api` after `calc-defaults`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `resolvePlace`, `Place` (Task 2); `buildBundle` (Task 2, in the test); `loadPlaceBundle` (Task 2, in the route); `tooMany(req, key, limit)` (`src/lib/rate_limit.ts`).
- Produces: `respond(q: { country?; city?; trade? }, load: (place: Place) => Promise<SimBundle>) => Promise<Answer>`, `type Answer = { status: 200 | 404; body: { place: Place; bundle: SimBundle } | { place: null; reason: string }; headers: Record<string, string> }`, `ANSWER_CACHE`; `GET /api/calculator?country=&city=&trade=` answering `Answer.body` as JSON. Task 4B's client fetches it.

- [ ] **Step 1: Write the failing test** `tests/simulator/api.test.ts`:

```ts
/**
 * THE PLACE SWITCH'S ROUTE (plan 2026-10-13 cost-simulator, Task 3; spec section 3: "a place switch fetches its defaults from one API route ... an
 * unknown country, city or trade answers 404"). respond() on a stub loader and on the real defaults builder (offline: the shards, no database), the
 * route's source (rate-limited first, the place's three words its only reads, so no lever ever reaches the server), the edge's route table.
 * BLIND SPOT, stated: it reads the route's source, not a running server; Task 9 asks the deployed route once, after his deploy word.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/api.test.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-api";
const FILE = "src/lib/simulator/respond.ts";
const ROUTE = "src/app/api/calculator/route.ts";
const REMEDY = "answer a known place with its defaults and an unknown one with 404, read only the place's three words, rate-limit first, and regenerate the edge's route table with the route";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const nonFinite = (x: unknown): boolean => (typeof x === "number" ? !Number.isFinite(x) : Array.isArray(x) ? x.some(nonFinite) : x !== null && typeof x === "object" ? Object.values(x as Record<string, unknown>).some(nonFinite) : false);

async function main(): Promise<void> {
  const R = await import("../../src/lib/simulator/respond").catch(() => null);
  check("the responder is there", !!R);
  if (!R) { redSummary(RULE, failed, REMEDY, "module missing"); process.exit(1); }
  const D = await import("../../src/lib/simulator/defaults");
  const B = await import("../../src/lib/simulator/bundle");
  const E = await import("../../src/lib/simulator/engine");
  type Bundle = Awaited<ReturnType<typeof D.buildBundle>>;
  const seen: string[] = [];
  const stub = async (p: { iso2: string; city: string | null; trade: string }) => { seen.push(`${p.iso2}/${p.city}/${p.trade}`); return { stub: true } as unknown as Bundle; };

  const ok = await R.respond({ country: "gb", city: "london", trade: "restaurants" }, stub);
  check(`a known place answers 200 with the place and its defaults (${ok.status}, ${seen.join(" ")})`, ok.status === 200 && "bundle" in ok.body && ok.body.place.city === "london" && seen[0] === "GB/london/restaurants" && /s-maxage/.test(ok.headers["Cache-Control"] ?? ""));
  for (const q of [{ country: "xx", city: null, trade: "restaurants" }, { country: "gb", city: "atlantis", trade: "restaurants" }, { country: "gb", city: "london", trade: "constructor" }, { country: "gb", city: "berlin", trade: "restaurants" }]) {
    const a = await R.respond(q, stub);
    check(`${JSON.stringify(q)} answers 404 and loads nothing (${a.status})`, a.status === 404 && a.body.place === null && seen.length === 1);
  }

  /* The real defaults travel as JSON and rebuild the same engine in the browser. */
  const real = await R.respond({ country: "de", city: "berlin", trade: "restaurants" }, async (p) => D.buildBundle(p, { cell: null }));
  const body = real.body as { bundle: Bundle };
  const back = JSON.parse(JSON.stringify(body)) as { bundle: Bundle };
  const be = (b: Bundle) => { const r = E.simulate(B.toEngine(b, B.FRESH)); return r.breakEven.held ? r.breakEven.value : null; };
  check(`Berlin's defaults survive the wire whole (${be(back.bundle)} against ${be(body.bundle)})`, real.status === 200 && !nonFinite(body) && JSON.stringify(back) === JSON.stringify(body) && be(back.bundle) === be(body.bundle) && be(body.bundle) !== null);

  /* THE ROUTE: rate-limited before anything, the place's three words its only reads. */
  check("the route is there", existsSync(ROUTE), ROUTE);
  const src = existsSync(ROUTE) ? readFileSync(ROUTE, "utf8") : "";
  const body0 = src.slice(src.indexOf("export async function GET"));
  check("its first act is the rate limit, as the cell lookup's", /export async function GET\(req: NextRequest\) \{\s*const limited = tooMany\(req, "calculator", 120\);\s*if \(limited\) return limited;/.test(src), ROUTE);
  const reads = [...body0.matchAll(/\.get\("([^"]+)"\)/g)].map((m) => m[1]).sort();
  check(`it reads the place's three words and nothing else (${reads.join(", ")})`, JSON.stringify(reads) === JSON.stringify(["city", "country", "trade"]), ROUTE);
  check("it answers through respond() with the defaults loader", /respond\(/.test(src) && /loadPlaceBundle/.test(src), ROUTE);

  /* THE EDGE: an address the route table does not hold answers 404 there. */
  const shapes = readFileSync("src/lib/routing/route_shapes.ts", "utf8");
  check('the edge\'s route table holds ["api", "calculator"]', shapes.includes('["api", "calculator"]'), "src/lib/routing/route_shapes.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/api: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-api crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/api.test.ts > scratchpad/calc/t3.txt 2>&1; echo "exit $?" >> scratchpad/calc/t3.txt`. Expected: exit 1, "the responder is there".

- [ ] **Step 3: The responder** `src/lib/simulator/respond.ts`:

```ts
/**
 * src/lib/simulator/respond.ts , THE PLACE SWITCH'S ANSWER (plan 2026-10-13 cost-simulator, Task 3; spec section 3: "a place switch fetches its defaults
 * from one API route"). Pure over its loader, so the chain's test runs it on the real defaults builder without the database. An unknown place answers
 * 404, the page's own rule; the answer holds the place and its defaults and never a reader's figure (the levers stay in the browser).
 */
import { resolvePlace, type Place } from "./place";
import type { SimBundle } from "./bundle";

export type Answer = { status: 200 | 404; body: { place: Place; bundle: SimBundle } | { place: null; reason: string }; headers: Record<string, string> };

/** The defaults change when the data does, a few times a year: six hours at the edge, a day stale. */
export const ANSWER_CACHE = "public, s-maxage=21600, stale-while-revalidate=86400";

export async function respond(q: { country?: string | null; city?: string | null; trade?: string | null }, load: (place: Place) => Promise<SimBundle>): Promise<Answer> {
  const place = resolvePlace(q);
  if (!place) return { status: 404, body: { place: null, reason: "no such place or trade" }, headers: { "Cache-Control": ANSWER_CACHE } };
  return { status: 200, body: { place, bundle: await load(place) }, headers: { "Cache-Control": ANSWER_CACHE } };
}
```

- [ ] **Step 4: The route** `src/app/api/calculator/route.ts`:

```ts
/**
 * /api/calculator , the cost simulator's place switch (plan 2026-10-13 cost-simulator, Task 3). ?country=gb&city=london&trade=restaurants answers
 * { place, bundle }; an unknown place answers 404. Rate-limited as the cell lookup is. The levers never come here: they recompute in the browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/lib/rate_limit";
import { respond } from "@/lib/simulator/respond";
import { loadPlaceBundle } from "@/lib/simulator/load";

export async function GET(req: NextRequest) {
  const limited = tooMany(req, "calculator", 120);
  if (limited) return limited;
  const q = new URL(req.url).searchParams;
  const answer = await respond({ country: q.get("country"), city: q.get("city"), trade: q.get("trade") }, loadPlaceBundle);
  return NextResponse.json(answer.body, { status: answer.status, headers: answer.headers });
}
```

- [ ] **Step 5: The edge's route table.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs scripts/gen_route_shapes.ts > scratchpad/calc/t3-shapes.txt 2>&1; echo "exit $?" >> scratchpad/calc/t3-shapes.txt`. Expected: exit 0; `git diff --stat src/lib/routing/route_shapes.ts` to `scratchpad/calc/t3-shapes-diff.txt` shows the one line `["api", "calculator"],` added and nothing else (anything else is another plan's route the table had not caught: stop and report it).

- [ ] **Step 6: Run it to see it pass.** The Step 2 command. Expected: exit 0, `simulator/api: all pass`.

- [ ] **Step 7: Wire the gate.** In `scripts/prebuild_all.ts`, after `  { name: "calc-defaults", script: "tests/simulator/defaults.test.ts" },` insert:

```ts
  /* THE PLACE SWITCH'S ROUTE (plan 2026-10-13 cost-simulator, Task 3): 404 on an unknown place, the defaults whole over the wire, the route
     rate-limited and reading the place alone, the edge's table holding it. Offline: a stub loader and the shards. */
  { name: "calc-api", script: "tests/simulator/api.test.ts" },
```

Stage, COUNTS, then GATES `--only=calc-api,edge-not-found,counts-fresh` to `scratchpad/calc/t3-gates.txt`. Expected: exit 0. MEMORY and TYPECHECK to `scratchpad/calc/t3-tsc.txt`: exit 0.

- [ ] **Step 8: Commit.**

```bash
cd /e/atlas/website && git add src/lib/simulator/respond.ts src/app/api/calculator/route.ts src/lib/routing/route_shapes.ts tests/simulator/api.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:api: the place switch's one route, /api/calculator, 404 on an unknown place, rate-limited, the defaults whole over the wire, the edge's table regenerated (plan 2026-10-13 cost-simulator, Task 3)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 4A: The money in the reader's currency, the lever's stamp, the words' law

**Files:**
- Create: `src/lib/simulator/display.ts`, `src/lib/simulator/bounds.ts`
- Modify: `src/components/spine/interact/Range.tsx` (a value that may be empty, its stamp on the typed figure, the symbol and the decimals as props)
- Test: `tests/simulator/display.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-display` after `calc-api`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `CURRENCIES`, `convertFromUsd`, `CurrencyCode` (`src/lib/currency.ts`); `convertToUsd`, `convertUsdTo` (`src/lib/finance/fx.ts`); `provAttrs`, `Provenance` (Task 1); `LeverKey` (Task 2); `COPY.calculator` (Task 2); `COPY.banned`.
- Produces (`display.ts`): `type Base = "GBP" | "USD"`; `MINUS` (U+2212); `toDisplay(x, base, show)`, `fromDisplay(x, base, show)`; `symbolOf(code)`; `shown(d, show, compact?)` (an amount already in the display currency); `money(x, base, show, compact?)`; `percent(x, digits?)`; `type Format = { base; show; symbol; money(x, compact?); toShow(x); fromShow(x); percent(x, digits?) }`; `makeFormat(base, show) => Format`.
- Produces (`bounds.ts`): `BOUNDS: Record<LeverKey, { min; max; step }>` (in the base currency), `HEADS_MAX = 50`, `PAY_MAX = 300000`, `clampTo(key, x)`.
- Produces (`Range.tsx`): `Range({ ..., value: number | null, onClear?: () => void, prov?: Provenance | null, symbol?: string, decimals?: number })`; with `value` null the typed figure is empty and the wrapper carries `data-empty`; the typed figure (`.fig`) carries `data-src` and `data-kind`; `symbol` defaults to "$" and `decimals` to 0, so every caller of today draws as before.

- [ ] **Step 1: Write the failing test** `tests/simulator/display.test.ts`:

```ts
/**
 * THE MONEY AND THE WORDS (plan 2026-10-13 cost-simulator, Task 4A; spec section 4: "the money in the reader's display currency through the site's
 * existing switch"; Review Focus 1, a loss with a true minus, and 5, a currency switch mid-session: the half that is arithmetic).
 * The display's round trips in every currency the switch offers, the pound's two rates as the site holds them (fx.ts for a UK figure in dollars,
 * currency.ts for the rest), the signed forms; the lever's typed figure empty, stamped, its symbol; and every string of COPY.calculator held to the
 * copy rules (four-word headings, twelve-word lines, three-word labels, no semicolon, no em-dash, no method word, no "we", no corporate word).
 * BLIND SPOT, stated: the copy check reads the strings, not the page; the plain-copy gate reads the page (Task 4C).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/display.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CURRENCIES } from "../../src/lib/currency";
import { COPY } from "../../src/lib/spine/copy";
import { Range } from "../../src/components/spine/interact/Range";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-display";
const FILE = "src/lib/simulator/display.ts";
const REMEDY = "show a base figure exactly in its own currency, a UK figure in dollars at fx.ts's pound rate, every other through dollars, a loss with U+2212 before the symbol; keep every calculator string inside the copy rules";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const D = await import("../../src/lib/simulator/display").catch(() => null);
  const BD = await import("../../src/lib/simulator/bounds").catch(() => null);
  check("the display module is there", !!D);
  check("the bounds are there", !!BD, "src/lib/simulator/bounds.ts");
  if (!D || !BD) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }

  /* REVIEW FOCUS 5, THE ARITHMETIC: a typed figure keeps its base value whatever the currency. */
  const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  for (const base of ["GBP", "USD"] as const) for (const c of CURRENCIES) for (const x of [0, 1, 362, 1507.72, 556017.36, 2e7]) {
    if (!near(D.fromDisplay(D.toDisplay(x, base, c.code), base, c.code), x)) check(`${x} ${base} through ${c.code} comes back to itself`, false);
  }
  check("every base figure comes back to itself through every currency", true);
  check("a UK figure in pounds is the law's pounds exactly", D.toDisplay(31551.16, "GBP", "GBP") === 31551.16 && D.money(31551.16, "GBP", "GBP") === "£31,551");
  check(`a UK figure in dollars is at fx.ts's pound rate, the trade page's dollars (${D.toDisplay(556017.36, "GBP", "USD")})`, near(D.toDisplay(556017.36, "GBP", "USD"), 556017.36 * 1.3265));
  check(`a dollar figure in pounds is at the display rate (${D.toDisplay(1000, "USD", "GBP")})`, near(D.toDisplay(1000, "USD", "GBP"), 743.5));
  check(`typing 2,000 dollars on a UK view keeps 2,000 / 1.3265 pounds (${D.fromDisplay(2000, "GBP", "USD")})`, near(D.fromDisplay(2000, "GBP", "USD"), 2000 / 1.3265));

  /* REVIEW FOCUS 1, THE SIGN: a loss is a true minus before the symbol. */
  check(`a loss: ${D.money(-12345, "USD", "USD")}, ${D.money(-12345, "USD", "USD", true)}, ${D.percent(-0.04, 0)}`, D.money(-12345, "USD", "USD") === "−$12,345" && D.money(-12345, "USD", "USD", true) === "−$12K" && D.percent(-0.04, 0) === "−4%");
  check(`no minus on nothing, no "$-" anywhere (${D.money(-0.4, "USD", "USD")}, ${D.percent(-0.0001, 1)})`, D.money(-0.4, "USD", "USD") === "$0" && D.percent(-0.0001, 1) === "0.0%" && !D.money(-5000, "USD", "USD").includes("$-"));
  check(`millions compact: ${D.money(1234567, "USD", "USD", true)}`, D.money(1234567, "USD", "USD", true) === "$1.23M");

  /* THE BOUNDS: every lever bounded, the clamp holding them. */
  check("every lever has bounds with min below max and a step", Object.values(BD.BOUNDS).every((b) => b.min < b.max && b.step > 0) && BD.clampTo("area", 999999) === BD.BOUNDS.area.max && BD.clampTo("area", -5) === BD.BOUNDS.area.min, "src/lib/simulator/bounds.ts");

  /* THE LEVER: empty when nothing is held, stamped, its symbol a prop; today's callers draw as before. */
  const html = (p: Partial<React.ComponentProps<typeof Range>>) => renderToStaticMarkup(React.createElement(Range, { id: "x", label: "Rent", min: 0, max: 100, step: 1, value: 50, onChange: () => {}, format: (v: number) => String(v), ...p }));
  check("by default the typed figure reads as before: $ and a whole number", /\$<\/span><input[^>]*value="50"/.test(html({})), "src/components/spine/interact/Range.tsx");
  check("an empty value draws an empty field, says so, and is no figure", /data-empty=""/.test(html({ value: null })) && /<input type="text"[^>]*value=""/.test(html({ value: null })) && !/class="fig /.test(html({ value: null, prov: { src: "x", kind: "estimate" } })), "src/components/spine/interact/Range.tsx");
  check("the typed figure carries its stamp", /class="fig [^"]*"[^>]*data-src="calculator:lever:rent" data-kind="yours"|data-src="calculator:lever:rent" data-kind="yours"[^>]*class="fig /.test(html({ prov: { src: "calculator:lever:rent", kind: "yours" } })), "src/components/spine/interact/Range.tsx");
  check("no symbol when none is asked, one decimal when asked", !html({ symbol: "" }).includes(">$<") && /value="7.5"/.test(html({ value: 7.5, decimals: 1, symbol: "" })), "src/components/spine/interact/Range.tsx");

  /* THE WORDS: every string of COPY.calculator inside the copy rules. */
  const strings: Array<[string, string]> = [];
  const walk = (o: unknown, at: string) => { if (typeof o === "string") strings.push([at, o]); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, `${at}.${k}`); };
  walk(COPY.calculator, "calculator");
  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const METHOD = [/\bmodell?ed\b/i, /\bwithheld\b/i, /\bon file\b/i, /\bnot gathered\b/i, /\bnot measured\b/i, /typical for the trade anywhere/i, /\bthe model\b/i, /\bplaceholder\b/i, /as on the opening card/i, /\bworked from\b/i, /\bwe\b/i];
  const LABEL = /^calculator\.(levers\.labels|levers\.groups|levers\.units|bill\.(?!teamNote|ratesNote|ratesStandard)|moves\.rows|month\.key|month\.(monthTab|yearTab|tick)|pick\.(country|city|trade|label)|answer\.(day|customers|firms|goal)|margin\.after|opening\.(total|yours)|sources\.\w+\.label|lines\.openingItems)\b/;
  const PLACEHOLDERS = new Set(["country", "city", "pct", "n", "index", "m2", "sales", "last"]);
  const faults: string[] = [];
  for (const [at, s] of strings) {
    if (s.trim() === "" && !at.endsWith(".runShare")) faults.push(`${at}: empty`);
    if (words(s) > 12) faults.push(`${at}: ${words(s)} words`);
    if (/\.title$/.test(at) && words(s) > 4) faults.push(`${at}: a heading of ${words(s)} words`);
    if (LABEL.test(at) && words(s) > 3) faults.push(`${at}: a label of ${words(s)} words`);
    if (s.includes(";") || s.includes(String.fromCharCode(0x2014))) faults.push(`${at}: a semicolon or an em-dash`);
    for (const re of METHOD) if (re.test(s)) faults.push(`${at}: "${s.match(re)?.[0]}"`);
    for (const b of COPY.banned) if (s.toLowerCase().includes(b)) faults.push(`${at}: the corporate word "${b}"`);
    for (const m of s.matchAll(/\{(\w+)\}/g)) if (!PLACEHOLDERS.has(m[1])) faults.push(`${at}: an unknown slot {${m[1]}}`);
  }
  check(`every one of the ${strings.length} calculator strings keeps the copy rules (${faults.slice(0, 8).join("; ") || "all"})`, strings.length > 100 && faults.length === 0, "src/lib/spine/copy.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/display: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-display crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/display.test.ts > scratchpad/calc/t4a.txt 2>&1; echo "exit $?" >> scratchpad/calc/t4a.txt`. Expected: exit 1, "the display module is there", "the bounds are there".

- [ ] **Step 3: The display** `src/lib/simulator/display.ts`:

```ts
/**
 * src/lib/simulator/display.ts , THE MONEY IN THE READER'S CURRENCY (plan 2026-10-13 cost-simulator, Task 4A; spec section 4: "the money in the reader's
 * display currency through the site's existing switch"; the plan's Reading 14). The engine counts in the base currency, pounds for a UK place (the
 * law's own) and dollars elsewhere. A figure shows exactly in its base; a UK figure in dollars at the site's pound rate (fx.ts, the trade page's own
 * dollars); any other through dollars at the display rates (currency.ts). A typed figure goes back the same way, so the base never moves when the
 * currency does. A loss prints a true minus (U+2212) before the symbol, "−$12K", never spine/money.ts's "$-12,000".
 */
import { CURRENCIES, convertFromUsd, type CurrencyCode } from "@/lib/currency";
import { convertToUsd, convertUsdTo } from "@/lib/finance/fx";

export type Base = "GBP" | "USD";
/** The true minus sign, U+2212 (written by its code so no reader mistakes it for a hyphen). */
export const MINUS = String.fromCharCode(0x2212);

export function toDisplay(x: number, base: Base, show: CurrencyCode): number {
  if (show === base) return x;
  const usd = base === "USD" ? x : (convertToUsd("GBP", x) as number);
  return show === "USD" ? usd : convertFromUsd(usd, show);
}

export function fromDisplay(x: number, base: Base, show: CurrencyCode): number {
  if (show === base) return x;
  const usd = show === "USD" ? x : x / convertFromUsd(1, show);
  return base === "USD" ? usd : (convertUsdTo("GBP", usd) as number);
}

export const symbolOf = (c: CurrencyCode): string => CURRENCIES.find((k) => k.code === c)?.symbol ?? "$";

/** An amount already in the display currency: whole units with thousands marks; `compact` takes thousands as K and millions as M. */
export function shown(d: number, show: CurrencyCode, compact = false): string {
  const a = Math.abs(d);
  const body = compact && a >= 1e6 ? `${(a / 1e6).toFixed(a >= 1e7 ? 1 : 2)}M` : compact && a >= 1e4 ? `${Math.round(a / 1000).toLocaleString("en-GB")}K` : Math.round(a).toLocaleString("en-GB");
  const negative = compact && a >= 1e4 ? d < 0 : Math.round(a) > 0 && d < 0;
  return `${negative ? MINUS : ""}${symbolOf(show)}${body}`;
}

export function money(x: number, base: Base, show: CurrencyCode, compact = false): string {
  return shown(toDisplay(x, base, show), show, compact);
}

export function percent(x: number, digits = 1): string {
  const s = (Math.abs(x) * 100).toFixed(digits);
  return `${x < 0 && Number(s) !== 0 ? MINUS : ""}${s}%`;
}

export type Format = { base: Base; show: CurrencyCode; symbol: string; money: (x: number, compact?: boolean) => string; toShow: (x: number) => number; fromShow: (x: number) => number; percent: (x: number, digits?: number) => string };

export function makeFormat(base: Base, show: CurrencyCode): Format {
  return { base, show, symbol: symbolOf(show), money: (x, compact = false) => money(x, base, show, compact), toShow: (x) => toDisplay(x, base, show), fromShow: (x) => fromDisplay(x, base, show), percent };
}
```

- [ ] **Step 4: The bounds** `src/lib/simulator/bounds.ts`:

```ts
/**
 * src/lib/simulator/bounds.ts , EACH LEVER'S RANGE (plan 2026-10-13 cost-simulator, Task 4A; spec section 3: "an unknown lever is ignored, one out of
 * range clamped"). In the base currency (pounds for a UK place, dollars elsewhere); shares as decimals. The profit goal and the owner's pay stop at
 * 250,000: the law's best company salary is searched in steps of 250 (take_home.ts), so the goal's search grows with it. 2,000 m2 at 5,000 a m2
 * puts a rateable value past the law's 500,000, which the engine answers with its rule, never a throw.
 */
import type { LeverKey } from "./bundle";

export const BOUNDS: Record<LeverKey, { min: number; max: number; step: number }> = {
  area: { min: 5, max: 2000, step: 1 },
  rent: { min: 0, max: 5000, step: 1 },
  service: { min: 0, max: 1000, step: 1 },
  oncost: { min: 0, max: 0.6, step: 0.005 },
  sales: { min: 0, max: 20_000_000, step: 1000 },
  ticket: { min: 0, max: 1000, step: 0.5 },
  goods: { min: 0, max: 0.95, step: 0.005 },
  runShare: { min: 0, max: 0.6, step: 0.005 },
  owner: { min: 0, max: 250_000, step: 500 },
  target: { min: 0, max: 250_000, step: 500 },
  loanAmount: { min: 0, max: 2_000_000, step: 500 },
  loanRate: { min: 0, max: 30, step: 0.1 },
  loanYears: { min: 1, max: 30, step: 1 },
  opening: { min: 0, max: 5_000_000, step: 500 },
};
export const HEADS_MAX = 50;
export const PAY_MAX = 300_000;

export const clampTo = (k: LeverKey, x: number): number => Math.min(BOUNDS[k].max, Math.max(BOUNDS[k].min, x));
```

- [ ] **Step 5: The lever takes an empty value, its stamp, its symbol.** `src/components/spine/interact/Range.tsx`, whole new body under its header (the header gains one paragraph: ` * EMPTY, STAMPED, IN THE READER'S CURRENCY (plan 2026-10-13 cost-simulator, Task 4A): a lever whose figure the place does not hold stands empty (value`, ` * null, data-empty), never at a typed default; its typed figure carries where it came from (data-src, data-kind, "yours" once the reader sets it);`, ` * the symbol and the decimals are the caller's, "$" and whole numbers by default.`):

```tsx
import * as React from "react";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";

export function Range({ id, label, min, max, step, value, onChange, onClear, format, unit, prov, symbol = "$", decimals = 0 }: {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  /** null: the place holds no figure; the field stands empty with the caller's line beside it. */
  value: number | null;
  onChange: (v: number) => void;
  /** Called when the reader empties the typed figure; without it an emptied field returns to the last value, as before. */
  onClear?: () => void;
  /** The value as the card prints it ("$52K"), for the screen reader's reading. */
  format: (v: number) => string;
  /** The words after the typed figure ("a year"). */
  unit?: string;
  prov?: Provenance | null;
  symbol?: string;
  decimals?: number;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v / step) * step));
  const [draft, setDraft] = React.useState<string | null>(null);
  const at = value ?? min;
  const typed = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: decimals });
  return (
    <div data-lever={id} {...(value === null ? { "data-empty": "" } : {})} className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <label htmlFor={`${id}-range`} className="shrink-0 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{label}</label>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={at}
        aria-valuetext={value === null ? "" : format(value)}
        onChange={(e) => { setDraft(null); onChange(clamp(Number(e.target.value))); }}
        className="atlas-range min-w-[8rem] flex-1 cursor-pointer"
        style={{ ["--fill" as string]: `${max > min && value !== null ? ((value - min) / (max - min)) * 100 : 0}%` } as React.CSSProperties}
      />
      <span className="inline-flex items-baseline gap-1">
        {symbol ? <span aria-hidden className="text-[length:var(--t-body)] text-[var(--c-muted)]">{symbol}</span> : null}
        <input
          type="text"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          aria-label={label}
          value={draft ?? (value === null ? "" : typed(value))}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
            if (e.target.value.trim() !== "" && Number.isFinite(n) && n >= min && n <= max) onChange(clamp(n));
          }}
          onBlur={() => {
            if (draft != null) {
              const n = Number(draft.replace(/[^0-9.]/g, ""));
              if (draft.trim() === "" && onClear) onClear();
              else onChange(clamp(Number.isFinite(n) && (n > 0 || min === 0) && draft.trim() !== "" ? n : at));
            }
            setDraft(null);
          }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          /* An empty field prints no number, so it is no figure: the `fig` class (the provenance ratchet's "a number the page prints") comes with a value. */
          className={`${value === null ? "" : "fig "}w-24 rounded-sm border border-[var(--c-line-strong)] bg-[var(--c-card)] px-2 py-1 text-right text-[length:var(--t-body)] font-semibold tabular-nums text-[var(--c-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]`}
          {...provAttrs(value === null ? null : prov)}
        />
        {unit ? <span className="text-[length:var(--t-body)] text-[var(--c-muted)]">{unit}</span> : null}
      </span>
    </div>
  );
}
```

The unit's class is the one Range carries on the rhythm branch after its Task 3 (`--t-body`); where the branch still reads `--t-micro` there, keep the branch's own class: this step changes the value, the stamp, the symbol and the decimals, nothing else. Typing 0 into a lever whose least is 0 is the figure 0 (Review Focus 2: a reader can type no sales); an emptied field with `onClear` is no figure.

- [ ] **Step 6: Run it to see it pass.** The Step 2 command. Expected: exit 0, `simulator/display: all pass`.

- [ ] **Step 7: Wire the gate and run Range's neighbours.** In `scripts/prebuild_all.ts`, after `  { name: "calc-api", script: "tests/simulator/api.test.ts" },` insert:

```ts
  /* THE MONEY AND THE WORDS (plan 2026-10-13 cost-simulator, Task 4A): every currency's round trip, the pound's two rates as the site holds them, a
     loss with a true minus, the lever empty and stamped, every calculator string inside the copy rules. */
  { name: "calc-display", script: "tests/simulator/display.test.ts" },
```

Stage, COUNTS, then GATES `--only=calc-display,interact,type-floor-reader,spacing-pin,counts-fresh` to `scratchpad/calc/t4a-gates.txt` (`interact` reads the levers already on the trade page: it must still pass with Range's new optional props). Expected: exit 0. MEMORY and TYPECHECK to `scratchpad/calc/t4a-tsc.txt`: exit 0 (every caller of Range passes a number, which the wider `number | null` takes).

- [ ] **Step 8: Commit.**

```bash
cd /e/atlas/website && git add src/lib/simulator/display.ts src/lib/simulator/bounds.ts src/components/spine/interact/Range.tsx tests/simulator/display.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:display: the money in the reader's currency through the site's switch (the base never moves), a loss with a true minus, the lever empty and stamped, each lever's bounds, every calculator string held to the copy rules (plan 2026-10-13 cost-simulator, Task 4A)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 4B: The page

Written for Q4 answer A (two bar-family cards: the month and what moves it most; the team rows as steppers with their figures; the opening bill as fact rows under the months to pay back; no phase bar) and Q1 answer A.

**Files:**
- Create: `src/lib/simulator/seed.ts`; `src/components/spine/calculator/calculator-view.tsx`, `CalculatorClient.tsx`, `sections.tsx`, `levers.tsx`; `src/lib/spine/note_shape.ts`
- Modify: `src/lib/simulator/load.ts` (`buildCalculatorSeed`); `src/app/(site)/calculator/page.tsx` (whole file)
- Modify: `src/lib/spine/owner_direction.ts` (two measures), `src/lib/spine/signal.ts` (the state of a placed share), `tests/spine/country_model.test.ts` (`WANT`)
- Modify: `src/lib/spine/door_kinds.ts` (the kind `break-even`, the surface `calculator`), `src/components/spine/archetypes/RankedBars.tsx` (a `level` for its title), `src/components/spine/zones.tsx` (`STACKED` exported), `src/components/spine/archetypes/NoteList.tsx` and `src/lib/spine/locals_rows.ts` (the note's shape from note_shape.ts)
- Modify: `scripts/lib/loud_seats.ts` (`SPINE_PAGES`), `scripts/verify_bar_budget.ts` (the group), `scripts/verify_banned_patterns.ts`, `scripts/verify_no_bold_display.ts`, `scripts/verify_no_eyebrow.ts`, `scripts/verify_subsection_icons.ts` (the four lists), `docs/loop/CENSUS.md` (regenerated); `scripts/type_ladder_baseline.json` and `scripts/width_discipline_baseline.json` only if their gates report the page's count shrank
- Test: `tests/simulator/page.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-page` after `calc-display`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Tasks 1 to 4A; the country plan's `OWNER_DIRECTION`, `MeasureKey`, `directionOf`, `SignalState`, `Signalled`, `SIGNAL_SET_FLOOR`, `Signal`, `SignalKey`, `Focal({ ..., placed, signal, noSignal })`, `FactRow` `placed`, `signal`, `noSignal`; the rhythm plan's `Focal`, `Basis`, `Rail level={2}`; `Zone`, `zoneTone`, `ZoneSplit`; `Box keep`; `Fig`; `FactRows`; `RankedBars`, `BarRow`; `NoteList`; `Switch`; `ReportFoot`, `SourcesFoot`; `getStoredCurrency` and the `atlas:currency-change` event; `inSentence`; `SpineShell`.
- Produces: `seedOf(place, bundle, state?) => CalculatorSeed`, `type CalculatorSeed = { place; bundle; state; choices: Choices; words: CalculatorWords; path }`, `type Choices`, `type CalculatorWords = typeof COPY.calculator`, `CALCULATOR_PATH = "/calculator"` (`seed.ts`); `buildCalculatorSeed(q) => Promise<CalculatorSeed | null>` (`load.ts`); `SpineCalculatorBody({ data })` and `LOUD_SEATS` (`calculator-view.tsx`); `CalculatorClient({ seed })`; `reasonOf(out, words)`, `Reason({ o, W })`, `withYours(text, out, words)`, `Masthead`, `AnswerSection`, `MarginSection`, `InstrumentGrid`, `MonthSection`, `MovesSection`, `OpeningSection`, `SourcesSection` (`sections.tsx`); `LeversCard({ W, bundle, state, r, fmt, set, active?, onActive? })`, `LeverRow({ ..., effect? })`, `TeamRow({ ..., effect? })`, `type Effect` (`levers.tsx`; the lever last moved shows the break-even beside it as `[data-effect]`); `signalStateOfShare(share, firms, direction)`, `signalForShare(measure, share, firms)` (`signal.ts`); `DOOR_KINDS` holds `"break-even"`, `LandingSurface` holds `"calculator"`, `SURFACE_ANSWERS.calculator === "break-even"`; `RankedBars({ ..., level?: 2 | 3 })`; `STACKED` from zones.tsx. The markup contract later tasks read: the answer section `#answer[data-archetype="sim-answer"][data-level="page"][data-answers="break-even"]`, its 40 under `[data-sim-figure]` or its reason as `[data-sim-label]`; every withheld figure's words `[data-reason="<reason>"]`; the sections' ids `answer`, `margin`, `levers`, `month`, `moves`, `opening`, `sources`; a lever row `[data-lever-row="<key>"]`, a team row `[data-team-row="<role>"]`.

- [ ] **Step 1: Write the failing test** `tests/simulator/page.test.ts`:

```ts
/**
 * THE COST SIMULATOR'S PAGE (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first; Review Focus 2 and 5).
 * The body drawn statically for London restaurants (the UK model, its sales the register's anchor) and Berlin restaurants (the world rows, no sales
 * held): the seven parts, the one 40 in terracotta, one 30 a section, every figure stamped, the bar outside the switch, the signal on the firms
 * above break-even and on the margin, each empty figure's reason (Review Focus 2), no NaN; the loud seats declared; the client's module graph free
 * of the server's modules; and, mounted, a currency change that redraws the figures and writes no lever (Review Focus 5).
 * BLIND SPOT, stated: jsdom computes no layout; sizes are read from the type tokens in the classes, and the browser gates read the chain's render
 * (Task 4C).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/page.test.ts
 */
import { JSDOM } from "jsdom";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { red, redSummary } from "../../scripts/lib/red";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/calculator" });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
(globalThis as any).localStorage = dom.window.localStorage;
(globalThis as any).CustomEvent = dom.window.CustomEvent;
(globalThis as any).HTMLElement = dom.window.HTMLElement;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
/* React ships `act` in its development build only and reads NODE_ENV when first evaluated: set before the dynamic imports. */
Object.assign(process.env, { NODE_ENV: "development" });

const RULE = "calc-page";
const VIEW = "src/components/spine/calculator/calculator-view.tsx";
const REMEDY = "draw the seven parts in their zones as plan 2026-10-13 Task 4B gives them: the one 40 in terracotta, one 30 a section, every figure stamped, the bar outside the switch, each missing figure's reason in its place, and no server module in the browser";
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const KINDS = new Set(["counted", "worked out", "looked up", "estimate", "yours"]);

/* THE CLIENT'S MODULE GRAPH, walked statically from the client component: value imports only (an `import type` is erased). */
function reach(entry: string): string[] {
  const seen = new Set<string>();
  const file = (p: string) => existsSync(p) && statSync(p).isFile();
  const resolveSpec = (from: string, spec: string): string | null => {
    const base = spec.startsWith("@/") ? join("src", spec.slice(2)) : spec.startsWith(".") ? join(dirname(from), spec) : null;
    if (!base) return null;
    for (const e of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) { const p = (base + e).replace(/\\/g, "/"); if (file(p)) return p; }
    return null;
  };
  const visit = (f: string) => {
    if (seen.has(f)) return;
    seen.add(f);
    if (!/\.tsx?$/.test(f)) return;
    for (const m of readFileSync(f, "utf8").matchAll(/^\s*(?:import|export)\s+(?!type\b)(?:[\s\S]*?\sfrom\s+)?["']([^"']+)["']/gm)) {
      if (/^(node:)?fs$/.test(m[1])) { seen.add(`builtin:${m[1]}`); continue; }
      const r = resolveSpec(f, m[1]);
      if (r) visit(r);
    }
  };
  visit(entry);
  return [...seen];
}

async function main(): Promise<void> {
  const React = (await import("react")).default;
  const { act } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createRoot } = await import("react-dom/client");
  const V = await import("../../src/components/spine/calculator/calculator-view").catch(() => null);
  const C = await import("../../src/components/spine/calculator/CalculatorClient").catch(() => null);
  const Lv = await import("../../src/components/spine/calculator/levers").catch(() => null);
  const S = await import("../../src/lib/simulator/seed").catch(() => null);
  check("the view, the client, the levers and the seed are there", !!V && !!C && !!Lv && !!S);
  if (!V || !C || !Lv || !S) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const P = await import("../../src/lib/simulator/place");
  const D = await import("../../src/lib/simulator/defaults");
  const Dp = await import("../../src/lib/simulator/display");
  const Sig = await import("../../src/lib/spine/signal");
  const Dk = await import("../../src/lib/spine/door_kinds");
  const { OWNER_DIRECTION } = await import("../../src/lib/spine/owner_direction");
  const { readLoudSeats } = await import("../../scripts/lib/loud_seats");
  const { COPY } = await import("../../src/lib/spine/copy");
  const W = COPY.calculator;

  const lp = P.resolvePlace({ country: "gb", city: "london", trade: "restaurants" })!;
  const lb = D.buildBundle(lp, { cell: null });
  const bp = P.resolvePlace({ country: "de", city: "berlin", trade: "restaurants" })!;
  const bb = D.buildBundle(bp, { cell: null });
  const draw = (seed: ReturnType<typeof S.seedOf>) => new JSDOM(renderToStaticMarkup(React.createElement(V.SpineCalculatorBody, { data: seed }))).window.document;
  const ld = draw(S.seedOf(lp, lb));
  const bd = draw(S.seedOf(bp, bb));

  /* THE SEVEN PARTS, IN THEIR ZONES. */
  const ids = ["answer", "margin", "levers", "month", "moves", "opening", "sources"];
  check(`London draws the seven parts (${ids.filter((id) => ld.getElementById(id)).join(", ")}), the masthead's h1 and three pickers on 48px fields`, ids.every((id) => ld.getElementById(id)) && ld.querySelector("h1")?.textContent === W.title && ld.querySelectorAll("form[data-sim-pick] select.h-12").length === 3);
  check(`four zones, the instrument's wide (${[...ld.querySelectorAll("[data-zone]")].map((z) => z.getAttribute("data-zone")).join(", ")})`, JSON.stringify([...ld.querySelectorAll("[data-zone]")].map((z) => z.getAttribute("data-zone"))) === JSON.stringify(["wide", "wide", "lone", "1-1"]));
  check("every section's title is an h2 of four words or fewer", ids.every((id) => { const h = ld.querySelector(`#${id} h2[data-rail-title]`); return !!h && (h.textContent ?? "").trim().split(/\s+/).length <= 4; }));
  check("only the levers keep their box", ld.querySelectorAll("[data-keep-card]").length === 1 && !!ld.querySelector("#levers[data-keep-card]"));

  /* THE ANSWER: the page's one 40, in terracotta, in the reader's currency (dollars before the switch is read). */
  const answers = [...ld.querySelectorAll("[class*='var(--t-answer)']")];
  const expected = Dp.money(556017.36 / 12, "GBP", "USD");
  check(`one 40 on the page, in the answer, terracotta, stamped (${answers.map((a) => a.textContent).join(", ")} against ${expected})`, answers.length === 1 && !!answers[0].closest("#answer") && /--terra-text/.test(answers[0].getAttribute("class") ?? "") && answers[0].textContent === expected && !!answers[0].getAttribute("data-src"));
  check("the answer declares itself a page masthead answering the break-even", !!ld.querySelector('#answer[data-archetype="sim-answer"][data-level="page"][data-answers="break-even"]'));
  for (const id of ["margin", "levers", "month", "moves", "opening"]) {
    const focal = ld.querySelectorAll(`#${id} [class*='var(--t-focal)']`).length;
    check(`${id}: one figure at 30 (${focal})`, focal === 1);
  }
  check("no 30 in the answer", ld.querySelectorAll("#answer [class*='var(--t-focal)']").length === 0);

  /* EVERY FIGURE STAMPED; NO NaN, NO "$-". */
  for (const [name, d] of [["London", ld], ["Berlin", bd]] as const) {
    const figs = [...d.querySelectorAll(".fig")];
    const silent = figs.filter((el) => !el.getAttribute("data-src") || !KINDS.has(el.getAttribute("data-kind") ?? ""));
    check(`${name}: every one of ${figs.length} figures says where it came from (${silent.slice(0, 3).map((el) => el.outerHTML.slice(0, 80)).join(" | ") || "all"})`, figs.length > 10 && silent.length === 0);
    const text = d.body.textContent ?? "";
    check(`${name}: no NaN, Infinity, undefined or "$-" in the page`, !/NaN|Infinity|undefined|\$-/.test(text));
  }

  /* THE MONTH: one bar, outside the switch; the switch holds words and figures (his ruling of 2026-07-09). */
  check("the month's bar stands outside the switch, and the switch holds a month and a year", !!ld.querySelector("#month [data-archetype='month-bar']") && !ld.querySelector("[role='tabpanel'] [data-archetype='month-bar']") && ld.querySelectorAll("#month [role='tabpanel']").length === 2 && ld.querySelectorAll("#month [role='tabpanel'][hidden]").length === 1);

  /* THE SIGNAL, the country page's, where the register places the figure among twenty firms or more. */
  check("the firms above London's break-even are placed and marked poor (0.32, the fourth fifth)", !!ld.querySelector('[data-row="firms"][data-placed="firms-above-break-even"] [data-signal="4"][data-measure="firms-above-break-even"]'));
  check("London's margin is placed by its sales among the firms and marked good (0.70)", !!ld.querySelector('[data-placed="sales-among-firms"] [data-signal="2"][data-measure="sales-among-firms"]') && !!ld.querySelector("[data-signal-key]"));
  check("the share's fifths: higher is easier, none under twenty firms", Sig.signalStateOfShare(0.85, 40, "higher") === 1 && Sig.signalStateOfShare(0.32, 7860, "higher") === 4 && Sig.signalStateOfShare(0.1, 40, "lower") === 1 && Sig.signalStateOfShare(0.5, 19, "higher") === null, "src/lib/spine/signal.ts");
  check("the two measures join the direction table, higher is easier", OWNER_DIRECTION["firms-above-break-even"]?.direction === "higher" && OWNER_DIRECTION["sales-among-firms"]?.direction === "higher", "src/lib/spine/owner_direction.ts");
  check("the door kind and the surface: the calculator answers the break-even", Dk.SURFACE_ANSWERS.calculator === "break-even" && (Dk.DOOR_KINDS as readonly string[]).includes("break-even"), "src/lib/spine/door_kinds.ts");

  /* REVIEW FOCUS 2: Berlin holds no sales, so the margin, the month's profit and the payback say so where they would stand. */
  check("Berlin: no sales held, so the margin, the profit and the payback wait with their words", ["margin", "month", "opening"].every((id) => bd.querySelector(`#${id} [data-reason="no-sales"]`)?.textContent === W.reasons.noSales));
  check("Berlin: the break-even still prints, in dollars, and no rates line stands in its bill", !!bd.querySelector("#answer [data-sim-figure]") && (bd.querySelector("#answer [data-sim-figure] .fig")?.textContent ?? "").startsWith("$") && !bd.querySelector('#month [data-row="rates"]'));
  check("Berlin: the sales field stands empty with its line", bd.querySelector('[data-lever-row="sales"] [data-empty]') !== null && (bd.querySelector('[data-lever-row="sales"] p[data-line]')?.textContent ?? "") === W.lines.sales.none);

  /* EACH LEVER SHOWS ITS EFFECT BESIDE IT (spec section 7): the lever in hand carries the break-even as it now stands; none on arrival. */
  const Eng = await import("../../src/lib/simulator/engine");
  const Bn = await import("../../src/lib/simulator/bundle");
  const card = new JSDOM(renderToStaticMarkup(React.createElement(Lv.LeversCard, { W, bundle: lb, state: Bn.FRESH, r: Eng.simulate(Bn.toEngine(lb, Bn.FRESH)), fmt: Dp.makeFormat("GBP", "USD"), set: () => {}, active: "rent" }))).window.document;
  check(`the rent in hand shows the break-even beside it (${card.querySelector('[data-lever-row="rent"] [data-effect] .fig')?.textContent}), and the page on arrival shows none`, card.querySelector('[data-lever-row="rent"] [data-effect] .fig')?.textContent === expected && card.querySelectorAll("[data-effect]").length === 1 && ld.querySelectorAll("[data-effect]").length === 0, "src/components/spine/calculator/levers.tsx");

  /* WHERE FIGURES COME FROM: prose, five notes at most, no figure. */
  check(`the sources are a note list of five notes or fewer, no figure in them (${ld.querySelectorAll("#sources [data-note]").length})`, !!ld.querySelector("#sources [data-archetype='note-list']") && ld.querySelectorAll("#sources [data-note]").length <= 5 && ld.querySelectorAll("#sources .fig").length === 0);
  check("NoteList takes the note's shape from note_shape.ts, so the browser carries no country notes", /from "@\/lib\/spine\/note_shape"/.test(readFileSync("src/components/spine/archetypes/NoteList.tsx", "utf8")) && !/locals_rows/.test(readFileSync("src/components/spine/archetypes/NoteList.tsx", "utf8")), "src/components/spine/archetypes/NoteList.tsx");

  /* THE LOUD SEATS, declared beside the code that lights them. */
  const loud = readLoudSeats();
  const seats = loud.declarations.get("calculator" as never);
  check(`the calculator declares three seats, two lit (${loud.faults.join("; ") || seats?.seats.map((s) => s.state).join(", ")})`, loud.faults.length === 0 && JSON.stringify(seats?.seats.map((s) => s.state)) === JSON.stringify(["LIT", "LIT", "NO HONEST CANDIDATE"]), "scripts/lib/loud_seats.ts");

  /* THE BROWSER CARRIES NO SERVER MODULE. */
  const graph = reach("src/components/spine/calculator/CalculatorClient.tsx");
  const FORBIDDEN = ["src/lib/cells.ts", "src/lib/uk/pnl/london.ts", "src/lib/simulator/defaults.ts", "src/lib/simulator/load.ts", "src/lib/simulator/seed.ts", "src/lib/simulator/place.ts", "src/lib/facts/store.ts", "src/lib/spine/locals_rows.ts", "builtin:fs", "builtin:node:fs"];
  check(`the client's ${graph.length} modules hold no server module (${graph.filter((g) => FORBIDDEN.includes(g)).join(", ") || "none"})`, graph.length > 10 && !graph.some((g) => FORBIDDEN.includes(g)), "src/components/spine/calculator/CalculatorClient.tsx");

  /* REVIEW FOCUS 5, MOUNTED: a currency change redraws the answer and a lever's typed figure and writes no lever. */
  const host = document.getElementById("root") as HTMLElement;
  const root = createRoot(host);
  await act(async () => { root.render(React.createElement(C.CalculatorClient, { seed: S.seedOf(lp, lb) })); });
  const fig = () => host.querySelector("#answer [data-sim-figure] .fig")?.textContent ?? "";
  const before = fig();
  await act(async () => { window.dispatchEvent(new window.CustomEvent("atlas:currency-change", { detail: "GBP" })); });
  const after = fig();
  check(`a currency change redraws the answer in pounds, the law's own (${before} then ${after})`, before === expected && after === Dp.money(556017.36 / 12, "GBP", "GBP"));
  await act(async () => { root.unmount(); });
  let writes = 0;
  const rowHost = document.createElement("ul");
  document.body.appendChild(rowHost);
  const rowRoot = createRoot(rowHost);
  const row = (show: "USD" | "GBP") => React.createElement(Lv.LeverRow, { id: "rent", W, input: lb.inputs.rent, value: lb.inputs.rent.value, yours: false, kind: "money", unit: W.levers.units.year, fmt: Dp.makeFormat("GBP", show), onChange: () => { writes++; }, onClear: () => { writes++; }, onReset: () => { writes++; } });
  await act(async () => { rowRoot.render(row("USD")); });
  const typedUsd = (rowHost.querySelector('input[type="text"]') as HTMLInputElement | null)?.value;
  await act(async () => { rowRoot.render(row("GBP")); });
  const typedGbp = (rowHost.querySelector('input[type="text"]') as HTMLInputElement | null)?.value;
  check(`the rent's typed figure follows the currency and nothing is written (${typedUsd} then ${typedGbp}, ${writes} writes)`, typedUsd === "480" && typedGbp === "362" && writes === 0, "src/components/spine/calculator/levers.tsx");
  await act(async () => { rowRoot.unmount(); });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/page: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-page crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/page.test.ts > scratchpad/calc/t4b.txt 2>&1; echo "exit $?" >> scratchpad/calc/t4b.txt`. Expected: exit 1, "the view, the client, the levers and the seed are there".

- [ ] **Step 3: The two measures and the share's state.** In `src/lib/spine/owner_direction.ts`, after the row that begins `  "cost-of-living": { direction:` insert:

```ts
  "firms-above-break-even": { direction: "higher", spec: "the cost simulator's spec (2026-10-13, section 4): the signal marks the share of firms above break-even; more firms clearing it is easier" },
  "sales-among-firms": { direction: "higher", spec: "the cost simulator's spec (2026-10-13, section 4): the signal marks the margin, placed by the reader's sales among the place's firms" },
```

In `tests/spine/country_model.test.ts`, inside `const WANT: Record<string, string> = {`, after the line that begins `  "admin-ease": ` insert `  "firms-above-break-even": "higher", "sales-among-firms": "higher",`. In `src/lib/spine/signal.ts`, after `signalFor`, append:

```ts
/** THE STATE OF A SHARE ALREADY PLACED (plan 2026-10-13 cost-simulator, Task 4B): the break-even and the reader's sales placed among a place's firms
 *  by the register's bands or a trusted cell's tenths, so no list of values exists to rank. The same fifths, on the share where higher is easier
 *  and on its complement where lower is; no state under twenty firms, none for a measure with no direction. */
export function signalStateOfShare(share: number, firms: number, direction: OwnerDirection): SignalState | null {
  if (direction === "none" || !Number.isFinite(share) || !(firms >= SIGNAL_SET_FLOOR)) return null;
  const s = direction === "higher" ? share : 1 - share;
  return s >= 0.8 ? 1 : s >= 0.6 ? 2 : s >= 0.4 ? 3 : s >= 0.2 ? 4 : 5;
}

export function signalForShare(measure: MeasureKey, share: number, firms: number): { signal: Signalled | null; noSignal: "set" | null } {
  const direction = directionOf(measure);
  if (direction === "none") return { signal: null, noSignal: null };
  const state = signalStateOfShare(share, firms, direction);
  return state === null ? { signal: null, noSignal: "set" } : { signal: { state, measure }, noSignal: null };
}
```

- [ ] **Step 4: The door's kind, the title's level, the stacked rhythm, the note's shape.**
  - `src/lib/spine/door_kinds.ts`: after `  "region-cities",` (in `DOOR_KINDS`) insert `  "break-even",`; after `  | "trades-index"` (in `LandingSurface`) insert `  | "calculator"`; after `  "trades-index": "trades-index",` (in `SURFACE_ANSWERS`) insert `  calculator: "break-even", // /calculator (plan 2026-10-13 cost-simulator): the sales to break even a month`. In the header's list of kinds add ` *  - break-even: /calculator's masthead, the sales a business needs to break even (plan 2026-10-13 cost-simulator).`
  - `src/components/spine/archetypes/RankedBars.tsx`: before the line `  focal?: { figure: string; accent?: boolean; words?: string; prov?: Provenance };` insert `  /** The title's heading level (plan 2026-10-13 cost-simulator): 3 under a page's chapters, the default; 2 where the section is the page's own level. */` and `  level?: 2 | 3;`; `fill = false }: RankedBarsProps) {` becomes `fill = false, level = 3 }: RankedBarsProps) {`; `<Rail icon={icon} kicker={kicker} sample={tagged} gloss={gloss} />` becomes `<Rail icon={icon} kicker={kicker} sample={tagged} gloss={gloss} level={level} />`.
  - `src/components/spine/zones.tsx`: `const STACKED = "grid grid-cols-1 items-start gap-y-6` becomes `export const STACKED = "grid grid-cols-1 items-start gap-y-6` (the rest of the line unchanged), and the comment above it gains the sentence ` The calculator's instrument (plan 2026-10-13 cost-simulator) stacks by it too.`
  - Create `src/lib/spine/note_shape.ts`:

```ts
/**
 * src/lib/spine/note_shape.ts , A NOTE'S SHAPE AND THE LIST'S CAP, apart from the countries' notes (plan 2026-10-13 cost-simulator, Task 4B):
 * NoteList draws in the browser on /calculator, and locals_rows.ts reads a data file and the register's cities, which no page's browser bundle
 * should carry. locals_rows.ts re-exports both, so every reader of it is unchanged.
 */
import type { AtlasIconId } from "@/components/brand/icons/atlas-icons-data";

/** `icon`: the note's glyph, chosen by hand with the note (2026-09-26, M6); `dots`: a paperwork level, one to five (2026-09-26). */
export type LocalNote = { label: string; fact: string; icon?: AtlasIconId; dots?: 1 | 2 | 3 | 4 | 5; source?: string };

/** At most five notes; the sixth is not drawn. */
export const NOTE_CAP = 5;
```

  In `src/lib/spine/locals_rows.ts`: the two comment lines above `export type LocalNote = ` and that line become `import { NOTE_CAP, type LocalNote } from "./note_shape";` and `export { NOTE_CAP, type LocalNote };`, and the line `export const NOTE_CAP = 5;` is deleted (its comment stays above `LABEL_WORDS_CAP`). In `src/components/spine/archetypes/NoteList.tsx`, `import { NOTE_CAP, type LocalNote } from "@/lib/spine/locals_rows";` becomes `import { NOTE_CAP, type LocalNote } from "@/lib/spine/note_shape";`.

- [ ] **Step 5: The seed and its loader.** Create `src/lib/simulator/seed.ts`:

```ts
/**
 * src/lib/simulator/seed.ts , WHAT THE PAGE HANDS THE BROWSER (plan 2026-10-13 cost-simulator, Task 4B): the place, its defaults, the reader's state (Task
 * 5 reads it from the address), the three pickers' lists and the words. Pure; the server builds it (load.ts, the page, the harness) and the client
 * component draws it, importing its types only.
 */
import { COPY } from "@/lib/spine/copy";
import { simulatorCities, simulatorCountries, simulatorTrades, type Place } from "./place";
import { FRESH, type SimBundle, type SimState } from "./bundle";

export type Choices = { countries: Array<{ code: string; name: string }>; cities: Array<{ slug: string; iso2: string; name: string }>; trades: Array<{ slug: string; name: string }> };
export type CalculatorWords = typeof COPY.calculator;
export type CalculatorSeed = { place: Place; bundle: SimBundle; state: SimState; choices: Choices; words: CalculatorWords; path: string };

export const CALCULATOR_PATH = "/calculator";

export function seedOf(place: Place, bundle: SimBundle, state: SimState = FRESH): CalculatorSeed {
  return {
    place,
    bundle,
    state,
    choices: { countries: simulatorCountries(), cities: simulatorCities(), trades: simulatorTrades().map((t) => ({ slug: t.slug, name: t.name })) },
    words: COPY.calculator,
    path: CALCULATOR_PATH,
  };
}
```

  In `src/lib/simulator/load.ts`, add to the imports `import { resolvePlace } from "./place";` and `import { seedOf, type CalculatorSeed } from "./seed";`, and append:

```ts
/** The page's seed for the place its three words name, or null where they name none (the page answers 404). */
export async function buildCalculatorSeed(q: { country?: string | null; city?: string | null; trade?: string | null }): Promise<CalculatorSeed | null> {
  const place = resolvePlace(q);
  if (!place) return null;
  return seedOf(place, await loadPlaceBundle(place));
}
```

- [ ] **Step 6: The sections** `src/components/spine/calculator/sections.tsx`:

```tsx
/**
 * THE COST SIMULATOR'S SECTIONS (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, items 1, 2 and 4 to 7; Q4 answered as written, A). The
 * masthead; the answer (the page's one 40, a day at 16, the firms above it); your margin (its 30); your month (one bar, then the bill as fact rows,
 * a switch for a month or a year holding words and figures only, the bar outside it); what moves it most (RankedBars); the money to open it (the
 * months to pay back at 30, the bill as fact rows); where figures come from (NoteList, the page's one prose section). Each figure through the kit's
 * Fig with its stamp; an output resting on the reader's figure says so in its line; a figure that cannot be worked out leaves its reason where it
 * would stand. One supporting line a card (the plain-copy law), two in the answer, the page's masthead.
 */
import * as React from "react";
import { Box, Rail, Fig, Focal, Basis } from "@/components/spine/kit";
import { FactRows, type FactRow } from "@/components/spine/archetypes/FactRows";
import { RankedBars, type BarRow } from "@/components/spine/archetypes/RankedBars";
import { NoteList } from "@/components/spine/archetypes/NoteList";
import { Switch } from "@/components/spine/interact/Switch";
import { SignalKey } from "@/components/spine/signal/Signal";
import { STACKED } from "@/components/spine/zones";
import { signalForShare } from "@/lib/spine/signal";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";
import { inSentence } from "@/lib/spine/place_names";
import { shown, type Format } from "@/lib/simulator/display";
import type { BillLine, EngineResult, Out } from "@/lib/simulator/engine";
import type { SimBundle, SimRole, SimState } from "@/lib/simulator/bundle";
import type { Place } from "@/lib/simulator/place";
import type { CalculatorWords, Choices } from "@/lib/simulator/seed";
import type { Provenance } from "@/lib/spine/provenance";

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const prov = (o: Out, key: string): Provenance | null => (o.held ? { src: `calculator:${key}`, kind: o.kind } : null);
const NONE = { signal: null, noSignal: null } as const;
/** A figure's words, said to rest on the reader's figures where they do (spec section 3: "an output that rests on one says 'your figures' in its line"). */
export const withYours = (text: string, o: Out, W: CalculatorWords): string => (o.held && o.yours ? `${text}${W.yoursTail}` : text);

/** The words that stand where a figure cannot be worked out. */
export function reasonOf(o: Out, W: CalculatorWords): string {
  if (o.held) return "";
  const R = W.reasons;
  const by: Record<string, string> = { needs: R.needs, "no-margin": R.noMargin, "no-sales": R.noSales, loss: R.loss, "no-ticket": R.noTicket, "no-opening": R.noOpening, "out-of-reach": R.outOfReach, "beyond-spread": R.beyondSpread, "no-spread": R.noSpread, "no-target": R.noTarget };
  return by[o.reason] ?? "";
}

export function Reason({ o, W }: { o: Out; W: CalculatorWords }) {
  return <p data-line="" data-reason={o.held ? undefined : o.reason} className="text-[length:var(--t-lead)] leading-6 text-[var(--c-ink)]">{reasonOf(o, W)}</p>;
}

export function Masthead({ W, place, choices, onPick, busy, failed }: { W: CalculatorWords; place: Place; choices: Choices; onPick: (next: { country: string; city: string | null; trade: string }) => void; busy: boolean; failed: boolean }) {
  const field = "h-12 w-full rounded-md border border-[var(--c-line-strong)] bg-[var(--c-card)] px-3 text-[length:var(--t-lead)] text-[var(--c-ink)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ink)]";
  const label = "flex flex-col gap-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]";
  return (
    <div data-hero="1">
      <h1 id="headline" data-typography="custom" className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]">{W.title}</h1>
      <form data-sim-pick="" aria-label={W.pick.label} aria-busy={busy} onSubmit={(e) => e.preventDefault()} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <label className={label}>
          {W.pick.country}
          <select name="country" value={place.country} onChange={(e) => onPick({ country: e.target.value, city: null, trade: place.trade })} className={field}>
            {choices.countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </label>
        <label className={label}>
          {W.pick.city}
          <select name="city" value={place.city ?? ""} onChange={(e) => onPick({ country: place.country, city: e.target.value || null, trade: place.trade })} className={field}>
            <option value="">{fill(W.pick.anywhere, { country: inSentence(place.countryName) })}</option>
            {choices.cities.filter((c) => c.iso2 === place.iso2).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className={label}>
          {W.pick.trade}
          <select name="trade" value={place.trade} onChange={(e) => onPick({ country: place.country, city: place.city, trade: e.target.value })} className={field}>
            {choices.trades.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
      </form>
      {failed ? <p data-line="" role="status" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{W.pick.failed}</p> : null}
    </div>
  );
}

export function AnswerSection({ W, r, fmt, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; taxed: boolean }) {
  const be = r.breakEven;
  const firms = r.shareAbove.held && r.firms ? signalForShare("firms-above-break-even", r.shareAbove.value, r.firms) : NONE;
  const rows: FactRow[] = [
    ...(be.held ? [{ key: "day", label: W.answer.day, value: fmt.money(be.value / 365), prov: prov(be, "break-even-a-day") }] : []),
    ...(r.customersADay.held ? [{ key: "customers", label: W.answer.customers, note: W.answer.customersNote, value: Math.round(r.customersADay.value).toLocaleString("en-GB"), prov: prov(r.customersADay, "customers-a-day") }] : []),
    ...(r.shareAbove.held ? [{ key: "firms", label: W.answer.firms, note: W.answer.firmsNote, value: fmt.percent(r.shareAbove.value, 0), prov: prov(r.shareAbove, "firms-above-break-even"), placed: "firms-above-break-even" as const, signal: firms.signal, noSignal: firms.noSignal }] : []),
    ...(r.targetSales.held ? [{ key: "goal", label: W.answer.goal, note: taxed ? W.answer.goalNote : W.answer.goalNoteWorld, value: fmt.money(r.targetSales.value / 12), prov: prov(r.targetSales, "sales-for-your-goal") }] : []),
  ];
  return (
    <Box id="answer" data-archetype="sim-answer" data-level="page" data-answers={SURFACE_ANSWERS.calculator} data-sim-answer="">
      <Rail icon="break-even" kicker={W.answer.title} level={2} />
      <div aria-live="polite">
        {be.held ? (
          <div data-sim-figure="">
            <Fig className="block text-[length:var(--t-answer)] font-semibold leading-none text-[var(--terra-text)]" prov={prov(be, "break-even-a-month")}>{fmt.money(be.value / 12)}</Fig>
            <p data-focal-words="" className="mt-2 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]">{W.answer.month}</p>
          </div>
        ) : (
          <p data-sim-label="" data-line="" data-reason={be.reason} className="text-[length:var(--t-lead)] leading-6 text-[var(--c-ink)]">{reasonOf(be, W)}</p>
        )}
      </div>
      <FactRows rows={rows} className="mt-6" />
      <Basis>{be.held && be.yours ? W.answer.basisYours : W.answer.basis}</Basis>
      {firms.signal ? <SignalKey /> : null}
    </Box>
  );
}

export function MarginSection({ W, r, fmt, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; taxed: boolean }) {
  const m = r.marginBefore;
  const placed = r.salesRank.held && r.firms ? signalForShare("sales-among-firms", r.salesRank.value, r.firms) : NONE;
  const rows: FactRow[] = taxed && r.marginAfter.held ? [{ key: "after", label: W.margin.after, value: fmt.percent(r.marginAfter.value), prov: prov(r.marginAfter, "margin-after-tax") }] : [];
  return (
    <Box id="margin">
      <Rail icon="margin" kicker={W.margin.title} level={2} />
      {m.held ? (
        <Focal
          figure={fmt.percent(m.value)}
          words={withYours(taxed ? W.margin.words : W.margin.wordsNoTax, m, W)}
          placement={r.salesRank.held ? fill(W.margin.placement, { pct: fmt.percent(r.salesRank.value, 0) }) : null}
          prov={prov(m, "margin-before-tax")}
          live
          placed={r.salesRank.held ? "sales-among-firms" : null}
          signal={placed.signal}
          noSignal={placed.noSignal}
        />
      ) : (
        <Reason o={m} W={W} />
      )}
      <FactRows rows={rows} />
    </Box>
  );
}

/** THE INSTRUMENT'S LEVEL (spec section 4: "From 1024 the levers stand left and the answer and the bill right"; on a phone the answer stands above the
 *  levers). One wide zone holds it: the zone's own stacked rhythm under 1024 (STACKED), then two columns, the levers card spanning the three rows the
 *  answer, the margin and the month stand in. */
export function InstrumentGrid({ answer, margin, levers, month }: { answer: React.ReactNode; margin: React.ReactNode; levers: React.ReactNode; month: React.ReactNode }) {
  return (
    <div data-calc-grid="" className={`${STACKED} lg:grid-cols-[2fr_3fr] lg:gap-x-16 lg:[&>*:nth-child(3)]:col-start-1 lg:[&>*:nth-child(3)]:row-start-1 lg:[&>*:nth-child(3)]:row-span-3 lg:[&>*:not(:nth-child(3))]:col-start-2`}>
      <div className="min-w-0">{answer}</div>
      <div className="min-w-0">{margin}</div>
      <div className="min-w-0">{levers}</div>
      <div className="min-w-0">{month}</div>
    </div>
  );
}

/** THE MONTH AS ONE BAR (R7 4.6, "the signature drawing"): the costs that follow sales, the fixed costs and the profit, in greys and ink (no accent:
 *  the card's figure is no loud moment), the break-even ticked; at a loss the costs run past the sales, whose tick stands where they stop. The axis
 *  is the larger of the sales and the costs, so nothing is clipped. Its key is a list of words: no figure is printed twice. */
function MonthBar({ W, variable, fixed, sales, breakEven }: { W: CalculatorWords; variable: number; fixed: number; sales: number; breakEven: number | null }) {
  const costs = variable + fixed;
  const scale = Math.max(sales, costs, breakEven ?? 0) || 1;
  const loss = sales < costs;
  const parts: Array<{ key: "variable" | "fixed" | "profit"; value: number; fill: string }> = [
    { key: "variable", value: variable, fill: "var(--c-line-strong)" },
    { key: "fixed", value: fixed, fill: "var(--c-muted)" },
    ...(loss ? [] : [{ key: "profit" as const, value: sales - costs, fill: "var(--c-ink)" }]),
  ];
  const pct = (x: number) => `${Math.min(100, (x / scale) * 100)}%`;
  return (
    <div data-archetype="month-bar" role="img" aria-label={fill(W.month.bar, { last: (loss ? W.month.key.loss : W.month.key.profit).toLowerCase() })} className="relative mt-6">
      <div className="flex h-8 w-full overflow-hidden rounded-md bg-[var(--c-soft)]">
        {parts.map((s) => <span key={s.key} data-part={s.key} className="h-full" style={{ width: pct(s.value), background: s.fill }} />)}
      </div>
      {breakEven !== null ? <span data-tick="break-even" aria-hidden className="absolute -top-1 h-10 w-0.5 bg-[var(--c-ink)]" style={{ left: pct(breakEven) }} /> : null}
      {loss ? <span data-tick="sales" aria-hidden className="absolute -top-1 h-10 w-0.5 bg-[var(--c-ink2)]" style={{ left: pct(sales) }} /> : null}
      <ul data-key="" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">
        {parts.map((s) => (
          <li key={s.key} className="inline-flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: s.fill }} />{W.month.key[s.key]}</li>
        ))}
        {loss ? <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-0.5 bg-[var(--c-ink2)]" />{W.month.key.loss}</li> : null}
        <li className="inline-flex items-center gap-2"><span aria-hidden className="h-3 w-0.5 bg-[var(--c-ink)]" />{W.month.tick}</li>
      </ul>
    </div>
  );
}

function billRows(r: EngineResult, b: SimBundle, W: CalculatorWords, fmt: Format, span: 1 | 12, teamHeads: number): FactRow[] {
  const sum = (lines: BillLine[]) => lines.reduce((a, l) => a + Math.round(l.year * 100), 0) / 100;
  const group = (key: string, label: string, pick: (l: BillLine) => boolean, note: string | null = null): FactRow | null => {
    const lines = r.bill.filter(pick);
    if (lines.length === 0) return null;
    const yours = lines.some((l) => l.yours);
    return { key, label, note: yours ? W.levers.yourFigure : note, value: fmt.money(sum(lines) / span), prov: { src: `calculator:bill:${key}`, kind: lines.every((l) => l.kind === "worked out") && !yours ? "worked out" : "estimate" } };
  };
  return [
    group("goods", W.bill.goods, (l) => l.part === "variable" && l.key !== "share:running"),
    group("running", W.bill.running, (l) => l.key === "share:running" || l.key === "line:running"),
    group("crew", W.bill.crew, (l) => l.key === "line:crew"),
    group("team", W.bill.team, (l) => l.key.startsWith("team:"), fill(W.bill.teamNote, { n: teamHeads.toLocaleString("en-GB", { maximumFractionDigits: 1 }) })),
    group("rent", W.bill.rent, (l) => l.key === "rent"),
    group("service", W.bill.service, (l) => l.key === "service"),
    group("rates", W.bill.rates, (l) => l.key === "rates", b.ratesLine),
    group("loan", W.bill.loan, (l) => l.key === "loan"),
    group("owner", W.bill.owner, (l) => l.key === "owner"),
  ].filter((x): x is FactRow => x !== null);
}

export function MonthSection({ W, r, fmt, sales, bundle, teamHeads }: { W: CalculatorWords; r: EngineResult; fmt: Format; sales: number | null; bundle: SimBundle; teamHeads: number }) {
  const p = r.profit;
  const variable = r.bill.filter((b) => b.part === "variable").reduce((a, b) => a + b.year, 0);
  const fixed = r.bill.filter((b) => b.part !== "variable").reduce((a, b) => a + b.year, 0);
  const S = r.billAt === "sales" ? sales : r.breakEven.held ? r.breakEven.value : null;
  return (
    <Box id="month">
      <Rail icon="cost-breakdown" kicker={W.month.title} level={2} />
      {p.held ? <Focal figure={fmt.money(p.value / 12)} words={withYours(p.value < 0 ? W.month.loss : W.month.profit, p, W)} prov={prov(p, "profit-a-month")} live /> : <Reason o={p} W={W} />}
      {S !== null ? <MonthBar W={W} variable={variable} fixed={fixed} sales={S} breakEven={r.breakEven.held ? r.breakEven.value : null} /> : null}
      <Switch
        id="month-span"
        label={W.month.span}
        className="mt-6"
        views={[
          { key: "month", label: W.month.monthTab, panel: <FactRows rows={billRows(r, bundle, W, fmt, 12, teamHeads)} /> },
          { key: "year", label: W.month.yearTab, panel: <FactRows rows={billRows(r, bundle, W, fmt, 1, teamHeads)} /> },
        ]}
      />
      {p.held && S !== null ? <Basis>{fill(W.month.basis, { sales: fmt.money(S) })}</Basis> : null}
    </Box>
  );
}

export function MovesSection({ W, r, fmt, roles }: { W: CalculatorWords; r: EngineResult; fmt: Format; roles: SimRole[] }) {
  if (r.moves.length === 0 || !r.perHundred.held) return null;
  const rowsWords = W.moves.rows as Record<string, string>;
  const nameOf = (key: string) => (key.startsWith("hire:") ? roles.find((x) => x.key === key.slice(5))?.name ?? key : rowsWords[key.replace(/^line:/, "")] ?? key);
  const rows: BarRow[] = r.moves.map((m) => ({ key: m.key, name: nameOf(m.key), value: fmt.toShow(m.rise), prov: { src: `calculator:move:${m.key}`, kind: m.kind } }));
  return (
    <RankedBars
      id="moves"
      kicker={W.moves.title}
      icon="ranking"
      level={2}
      basis={W.moves.basis}
      rows={rows}
      worldMax={Math.max(...rows.map((x) => x.value))}
      fmt={(v: number) => shown(v, fmt.show, true)}
      ceiling="set"
      feature="leader"
      topLabel={W.moves.top}
      focal={{ figure: Math.round(r.perHundred.value).toLocaleString("en-GB"), accent: true, words: withYours(W.moves.focal, r.perHundred, W), prov: { src: "calculator:sales-per-hundred-of-fixed-costs", kind: r.perHundred.kind } }}
    />
  );
}

export function OpeningSection({ W, r, fmt, bundle, state, taxed }: { W: CalculatorWords; r: EngineResult; fmt: Format; bundle: SimBundle; state: SimState; taxed: boolean }) {
  const pb = r.paybackMonths;
  if (!pb.held && pb.reason === "no-opening") return null;
  const typed = Object.prototype.hasOwnProperty.call(state.levers, "opening") ? state.levers.opening ?? null : null;
  const lines = bundle.opening.lines;
  const total = lines.reduce((a, l) => a + Math.round(l.amount * 100), 0) / 100;
  const rows: FactRow[] = typed !== null
    ? [{ key: "yours", label: W.opening.yours, value: fmt.money(typed), prov: { src: "calculator:lever:opening", kind: "yours" } }]
    : [
      ...lines.map((l) => ({ key: l.key, label: l.name, value: fmt.money(l.amount), prov: { src: l.stamp.src, kind: l.stamp.kind } })),
      ...(lines.length > 1 ? [{ key: "total", label: W.opening.total, value: fmt.money(total), prov: { src: "calculator:opening-total", kind: "estimate" as const } }] : []),
    ];
  return (
    <Box id="opening">
      <Rail icon="startup-cost" kicker={W.opening.title} level={2} />
      {pb.held ? <Focal figure={pb.value.toLocaleString("en-GB")} words={withYours(taxed ? W.opening.monthsUk : W.opening.months, pb, W)} prov={prov(pb, "months-to-pay-back")} live /> : <Reason o={pb} W={W} />}
      <FactRows rows={rows} className="mt-6" />
      {pb.held ? <Basis>{bundle.opening.line}</Basis> : null}
    </Box>
  );
}

export function SourcesSection({ W, notes }: { W: CalculatorWords; notes: Array<{ label: string; fact: string }> }) {
  return (
    <Box id="sources">
      <Rail icon="methodology" kicker={W.sources.title} level={2} />
      <NoteList notes={notes} />
    </Box>
  );
}
```

- [ ] **Step 7: The levers** `src/components/spine/calculator/levers.tsx`:

```tsx
/**
 * THE LEVERS, THE PAGE'S ONE CARD (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, item 3: "Team, Premises, Sales, You, Loan; each a slider
 * beside a typed figure with its source line; team rows as steppers"; MODEL 10.4, a card stays where the reader operates it). Each row draws the
 * figure in the reader's currency and writes the base figure back (display.ts), stamped "yours" once set; its line says where the default came
 * from, or that the figure is the reader's, with a reset. The fixed costs a month are the card's 30. Q4 answer A: the team rows are steppers with
 * their counts, no bar.
 */
import * as React from "react";
import { Box, Rail, Fig, Focal, Basis } from "@/components/spine/kit";
import { Range } from "@/components/spine/interact/Range";
import { BOUNDS, HEADS_MAX, PAY_MAX, clampTo } from "@/lib/simulator/bounds";
import type { Format } from "@/lib/simulator/display";
import type { EngineResult } from "@/lib/simulator/engine";
import type { LeverKey, SimBundle, SimInput, SimRole, SimState } from "@/lib/simulator/bundle";
import type { CalculatorWords } from "@/lib/simulator/seed";
import type { Provenance } from "@/lib/spine/provenance";
import { Reason, reasonOf, withYours } from "./sections";

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const LINE = "mt-1 text-[length:var(--t-body)] leading-5 text-[var(--c-muted)]";
const RESET = "tap-y ml-2 underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]";
const STEP = "tap-y h-11 w-11 rounded-md border border-[var(--c-line-strong)] text-[length:var(--t-lead)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)] disabled:opacity-40";
const TOGGLE = "tap-y rounded-md border border-[var(--c-line-strong)] px-3 py-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]";

function Group({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`levers-${id}`} data-lever-group={id} className="mt-8">
      <h3 id={`levers-${id}`} data-typography="custom" className="text-[length:var(--t-lead)] font-semibold leading-6 text-[var(--c-ink)]">{title}</h3>
      <ul className="mt-4 grid gap-6">{children}</ul>
    </section>
  );
}

/** WHAT THE LEVER JUST DID (spec section 7: "the answer stands above the levers and each lever shows its effect beside it"): under the lever the reader
 *  last moved, the break-even as it now stands, or the reason it cannot be worked out. Only the lever in hand carries it, so the page prints the answer
 *  twice only while the reader is moving something, never on arrival. */
export type Effect = { figure: string; prov: Provenance | null } | { words: string } | null;
function EffectLine({ effect, W }: { effect: Effect; W: CalculatorWords }) {
  if (!effect) return null;
  return (
    <p data-effect="" aria-live="polite" className="mt-1 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
      {"figure" in effect ? (
        <>
          {W.levers.effect} <Fig className="font-semibold" prov={effect.prov}>{effect.figure}</Fig> {W.levers.effectTail}
        </>
      ) : effect.words}
    </p>
  );
}

export function LeverRow({ id, W, input, value, yours, kind, unit, fmt, effect = null, onChange, onClear, onReset }: { id: LeverKey; W: CalculatorWords; input: SimInput; value: number | null; yours: boolean; kind: "money" | "share" | "count"; unit?: string; fmt: Format; effect?: Effect; onChange: (x: number) => void; onClear: () => void; onReset: () => void }) {
  const b = BOUNDS[id];
  const show = (x: number) => (kind === "money" ? fmt.toShow(x) : kind === "share" ? x * 100 : x);
  const back = (x: number) => (kind === "money" ? fmt.fromShow(x) : kind === "share" ? x / 100 : x);
  const stamp: Provenance | null = yours ? { src: `calculator:lever:${id}`, kind: "yours" } : input.stamp ? { src: input.stamp.src, kind: input.stamp.kind } : null;
  return (
    <li data-lever-row={id}>
      <Range
        id={`lever-${id}`}
        label={W.levers.labels[id]}
        min={show(b.min)}
        max={show(b.max)}
        step={kind === "money" ? 1 : kind === "share" ? b.step * 100 : b.step}
        value={value === null ? null : show(value)}
        onChange={(x) => onChange(back(x))}
        onClear={onClear}
        format={(x) => (kind === "money" ? `${fmt.symbol}${Math.round(x).toLocaleString("en-GB")}` : kind === "share" ? `${x.toFixed(1)}%` : x.toLocaleString("en-GB"))}
        unit={unit}
        prov={stamp}
        symbol={kind === "money" ? fmt.symbol : ""}
        decimals={kind === "share" || b.step < 1 ? 1 : 0}
      />
      <p data-line="" className={LINE}>
        {yours ? W.levers.yourFigure : input.line}
        {yours ? <button type="button" onClick={onReset} className={RESET}>{W.levers.reset}</button> : null}
      </p>
      <EffectLine effect={effect} W={W} />
    </li>
  );
}

export function TeamRow({ role, W, fmt, heads, headsYours, pay, payYours, effect = null, onHeads, onPay, onPayReset }: { role: SimRole; W: CalculatorWords; fmt: Format; heads: number; headsYours: boolean; pay: number | null; payYours: boolean; effect?: Effect; onHeads: (n: number) => void; onPay: (x: number) => void; onPayReset: () => void }) {
  const headsProv: Provenance = headsYours ? { src: `calculator:lever:team:${role.key}`, kind: "yours" } : { src: role.headsStamp.src, kind: role.headsStamp.kind };
  const payProv: Provenance | null = payYours ? { src: `calculator:lever:pay:${role.key}`, kind: "yours" } : role.pay.stamp ? { src: role.pay.stamp.src, kind: role.pay.stamp.kind } : null;
  return (
    <li data-team-row={role.key}>
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
          {role.name}
          {role.sub ? <span className="block text-[var(--c-muted)]">{role.sub}</span> : null}
        </span>
        <span className="inline-flex shrink-0 items-center gap-2">
          <button type="button" aria-label={`${W.levers.remove}: ${role.name}`} disabled={heads <= 0} onClick={() => onHeads(Math.max(0, heads - 1))} className={STEP}>{"−"}</button>
          <Fig className="block min-w-8 text-center text-[length:var(--t-lead)] font-semibold tabular-nums text-[var(--c-ink)]" prov={headsProv}>{heads.toLocaleString("en-GB", { maximumFractionDigits: 1 })}</Fig>
          <button type="button" aria-label={`${W.levers.add}: ${role.name}`} disabled={heads >= HEADS_MAX} onClick={() => onHeads(Math.min(HEADS_MAX, heads + 1))} className={STEP}>+</button>
        </span>
      </div>
      {heads > 0 ? (
        <div className="mt-3">
          <Range id={`pay-${role.key}`} label={W.levers.labels.pay} min={0} max={fmt.toShow(PAY_MAX)} step={1} value={pay === null ? null : fmt.toShow(pay)} onChange={(x) => onPay(fmt.fromShow(x))} format={(x) => `${fmt.symbol}${Math.round(x).toLocaleString("en-GB")}`} unit={W.levers.units.year} prov={payProv} symbol={fmt.symbol} />
          <p data-line="" className={LINE}>
            {payYours ? W.levers.yourFigure : role.pay.line}
            {payYours ? <button type="button" onClick={onPayReset} className={RESET}>{W.levers.reset}</button> : null}
          </p>
        </div>
      ) : null}
      <EffectLine effect={effect} W={W} />
    </li>
  );
}

export function LeversCard({ W, bundle, state, r, fmt, set, active = null, onActive = () => {} }: { W: CalculatorWords; bundle: SimBundle; state: SimState; r: EngineResult; fmt: Format; set: (s: SimState) => void; active?: string | null; onActive?: (key: string) => void }) {
  const valueOf = (k: LeverKey) => (has(state.levers, k) ? state.levers[k] ?? null : bundle.inputs[k].value);
  const touch = (key: string, next: SimState) => { onActive(key); set(next); };
  const setLever = (k: LeverKey, x: number | null) => touch(k, { ...state, levers: { ...state.levers, [k]: x === null ? null : clampTo(k, x) } });
  const reset = (k: LeverKey) => { const levers = { ...state.levers }; delete levers[k]; touch(k, { ...state, levers }); };
  const toggle = (k: "owner" | "target", on: boolean) => { const levers = { ...state.levers }; if (!on) delete levers[k]; touch(k, { ...state, levers, on: { ...state.on, [k]: on } }); };
  const effectOf = (key: string): Effect => (active !== key ? null : r.breakEven.held ? { figure: fmt.money(r.breakEven.value / 12), prov: { src: "calculator:break-even-a-month", kind: r.breakEven.kind } } : { words: reasonOf(r.breakEven, W) });
  const U = W.levers.units;
  const row = (k: LeverKey, kind: "money" | "share" | "count", unit?: string) => (
    <LeverRow key={k} id={k} W={W} input={bundle.inputs[k]} value={valueOf(k)} yours={has(state.levers, k)} kind={kind} unit={unit} fmt={fmt} effect={effectOf(k)} onChange={(x) => setLever(k, x)} onClear={() => setLever(k, null)} onReset={() => reset(k)} />
  );
  return (
    <Box id="levers" keep data-archetype="sim-levers">
      <Rail icon="calculator" kicker={W.levers.title} level={2} />
      {r.fixedYear.held ? <Focal figure={fmt.money(r.fixedYear.value / 12)} words={withYours(W.levers.fixed, r.fixedYear, W)} prov={{ src: "calculator:fixed-costs-a-month", kind: r.fixedYear.kind }} live /> : <Reason o={r.fixedYear} W={W} />}
      <Group id="team" title={W.levers.groups.team}>
        {bundle.path === "uk-model" ? (
          <li data-team-note="">
            <p data-line="" className={LINE}>{W.levers.staffLine}</p>
            <p data-line="" className={LINE}>{W.levers.hireOnTop}</p>
          </li>
        ) : (
          <li data-team-note="">
            <p data-line="" className={LINE}>{bundle.teamLine}</p>
          </li>
        )}
        {bundle.roles.map((role) => (
          <TeamRow
            key={role.key}
            role={role}
            W={W}
            fmt={fmt}
            heads={has(state.heads, role.key) ? state.heads[role.key] : role.heads}
            headsYours={has(state.heads, role.key)}
            pay={has(state.pay, role.key) ? state.pay[role.key] : role.pay.value}
            payYours={has(state.pay, role.key)}
            effect={effectOf(`team:${role.key}`)}
            onHeads={(n) => touch(`team:${role.key}`, { ...state, heads: { ...state.heads, [role.key]: n } })}
            onPay={(x) => touch(`team:${role.key}`, { ...state, pay: { ...state.pay, [role.key]: Math.min(PAY_MAX, Math.max(0, x)) } })}
            onPayReset={() => { const pay = { ...state.pay }; delete pay[role.key]; touch(`team:${role.key}`, { ...state, pay }); }}
          />
        ))}
        {bundle.ukLaw ? <li><p data-line="" className={LINE}>{W.lines.team.ukLaw}</p></li> : row("oncost", "share", U.pay)}
      </Group>
      <Group id="premises" title={W.levers.groups.premises}>
        {row("area", "count", U.m2)}
        {row("rent", "money", U.year)}
        {row("service", "money", U.year)}
      </Group>
      <Group id="sales" title={W.levers.groups.sales}>
        {row("sales", "money", U.year)}
        {row("ticket", "money", U.head)}
        {row("goods", "share", U.share)}
        {bundle.path === "world" ? row("runShare", "share", U.share) : null}
      </Group>
      <Group id="you" title={W.levers.groups.you}>
        <li data-lever-row="owner-on">
          <button type="button" aria-pressed={!!state.on.owner} onClick={() => toggle("owner", !state.on.owner)} className={TOGGLE}>{state.on.owner ? W.levers.stopPaying : W.levers.payYourself}</button>
          {state.on.owner ? null : <p data-line="" className={LINE}>{W.lines.owner.off}</p>}
        </li>
        {state.on.owner ? row("owner", "money", U.year) : null}
        <li data-lever-row="target-on">
          <button type="button" aria-pressed={!!state.on.target} onClick={() => toggle("target", !state.on.target)} className={TOGGLE}>{state.on.target ? W.levers.dropTarget : W.levers.setTarget}</button>
        </li>
        {state.on.target ? row("target", "money", U.year) : null}
        {bundle.tax.law === "uk" ? (
          <li data-lever-row="form">
            <label className="flex flex-col gap-2 text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">
              {W.levers.form}
              <select value={state.form ?? bundle.tax.form} onChange={(e) => touch("form", { ...state, form: e.target.value === "company" ? "company" : "sole trader" })} className="h-12 rounded-md border border-[var(--c-line-strong)] bg-[var(--c-card)] px-3 text-[length:var(--t-lead)] text-[var(--c-ink)]">
                <option value="sole trader">{W.levers.sole}</option>
                <option value="company">{W.levers.company}</option>
              </select>
            </label>
            <p data-line="" className={LINE}>{W.lines.form}</p>
          </li>
        ) : null}
      </Group>
      <Group id="loan" title={W.levers.groups.loan}>
        {row("loanAmount", "money")}
        {row("loanRate", "count", U.pct)}
        {row("loanYears", "count", U.years)}
        {row("opening", "money")}
      </Group>
      {r.fixedYear.held ? <Basis>{W.levers.basis}</Basis> : null}
    </Box>
  );
}
```

- [ ] **Step 8: The client** `src/components/spine/calculator/CalculatorClient.tsx`:

```tsx
"use client";

/**
 * THE COST SIMULATOR'S BODY (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first). One state: the place, its defaults (the
 * bundle), the reader's changes, the display currency. Each change recomputes the engine at once (no Apply button) and the answer is announced
 * politely; a place switch fetches its defaults from /api/calculator and puts every lever back to the new place's (the plan's Reading 15). The words
 * come in the seed; this file imports no server module and no copy table.
 *
 * THE ZONES: the masthead alone; the instrument (the answer, your margin, your numbers and your month); what moves it most; the money to open it beside
 * where figures come from. A section with nothing to draw is not passed to a zone, and the zones close up so no two lone zones stand together.
 */
import * as React from "react";
import { Zone, zoneTone, type ZoneSplit } from "@/components/spine/zones";
import { ReportFoot } from "@/components/spine/ReportFoot";
import { SourcesFoot } from "@/components/spine/SourcesFoot";
import { getStoredCurrency } from "@/components/CurrencySwitcher";
import type { CurrencyCode } from "@/lib/currency";
import { simulate } from "@/lib/simulator/engine";
import { FRESH, toEngine, type SimBundle, type SimState } from "@/lib/simulator/bundle";
import { makeFormat } from "@/lib/simulator/display";
import type { Place } from "@/lib/simulator/place";
import type { CalculatorSeed } from "@/lib/simulator/seed";
import { AnswerSection, InstrumentGrid, MarginSection, Masthead, MonthSection, MovesSection, OpeningSection, SourcesSection } from "./sections";
import { LeversCard } from "./levers";

export function CalculatorClient({ seed }: { seed: CalculatorSeed }) {
  const W = seed.words;
  const [place, setPlace] = React.useState<Place>(seed.place);
  const [bundle, setBundle] = React.useState<SimBundle>(seed.bundle);
  const [state, setState] = React.useState<SimState>(seed.state);
  const [show, setShow] = React.useState<CurrencyCode>("USD");
  const [busy, setBusy] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  /* The lever the reader last moved: it shows its effect beside it (spec section 7); none on arrival. */
  const [active, setActive] = React.useState<string | null>(null);

  /* THE SITE'S CURRENCY SWITCH: its stored choice once hydrated, then each change it announces. A change redraws every figure and writes no lever. */
  React.useEffect(() => {
    setShow(getStoredCurrency());
    const on = (e: Event) => { const c = (e as CustomEvent<CurrencyCode>).detail; if (c) setShow(c); };
    window.addEventListener("atlas:currency-change", on);
    return () => window.removeEventListener("atlas:currency-change", on);
  }, []);

  const inputs = React.useMemo(() => toEngine(bundle, state), [bundle, state]);
  const r = React.useMemo(() => simulate(inputs), [inputs]);
  const fmt = React.useMemo(() => makeFormat(bundle.currency, show), [bundle.currency, show]);
  const taxed = bundle.tax.law === "uk";
  const changed = Object.keys(state.levers).length + Object.keys(state.heads).length + Object.keys(state.pay).length > 0 || state.form !== null || !!state.on.owner || !!state.on.target;
  const notes = changed ? [W.sources.yours, ...bundle.notes].slice(0, 5) : bundle.notes;

  const pick = async (next: { country: string; city: string | null; trade: string }) => {
    setBusy(true);
    setFailed(false);
    try {
      const q = new URLSearchParams({ country: next.country, trade: next.trade });
      if (next.city) q.set("city", next.city);
      const res = await fetch(`/api/calculator?${q.toString()}`);
      if (!res.ok) throw new Error(`calculator: ${res.status}`);
      const body = (await res.json()) as { place: Place; bundle: SimBundle };
      setPlace(body.place);
      setBundle(body.bundle);
      setState(FRESH);
      setActive(null);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const teamHeads = inputs.roles.reduce((a, x) => a + (x.heads > 0 ? x.heads : 0), 0);
  const sales = inputs.sales ? inputs.sales.v : null;
  const moves = <MovesSection key="moves" W={W} r={r} fmt={fmt} roles={bundle.roles} />;
  const opening = <OpeningSection key="opening" W={W} r={r} fmt={fmt} bundle={bundle} state={state} taxed={taxed} />;
  const sources = <SourcesSection key="sources" W={W} notes={notes} />;
  const hasMoves = r.moves.length > 0 && r.perHundred.held;
  const hasOpening = r.paybackMonths.held || r.paybackMonths.reason !== "no-opening";
  const after: Array<{ key: string; split: ZoneSplit; label: string; body: React.ReactNode[] }> =
    hasMoves && hasOpening ? [{ key: "moves", split: "2-1", label: W.moves.title, body: [moves] }, { key: "money", split: "1-1", label: W.opening.title, body: [opening, sources] }]
    : hasMoves ? [{ key: "moves", split: "2-1", label: W.moves.title, body: [moves, sources] }]
    : hasOpening ? [{ key: "money", split: "1-1", label: W.opening.title, body: [opening, sources] }]
    : [{ key: "sources", split: "2-1", label: W.sources.title, body: [sources] }];
  const zones: Array<{ key: string; split: ZoneSplit; label: string; body: React.ReactNode[] }> = [
    { key: "head", split: "wide", label: W.title, body: [<Masthead key="head" W={W} place={place} choices={seed.choices} onPick={pick} busy={busy} failed={failed} />] },
    {
      key: "instrument",
      split: "wide",
      label: W.answer.title,
      body: [
        <InstrumentGrid
          key="grid"
          answer={<AnswerSection W={W} r={r} fmt={fmt} taxed={taxed} />}
          margin={<MarginSection W={W} r={r} fmt={fmt} taxed={taxed} />}
          levers={<LeversCard W={W} bundle={bundle} state={state} r={r} fmt={fmt} set={setState} active={active} onActive={setActive} />}
          month={<MonthSection W={W} r={r} fmt={fmt} sales={sales} bundle={bundle} teamHeads={teamHeads} />}
        />,
      ],
    },
    ...after,
  ];
  return (
    <>
      <div data-spine-body data-composition="zones">
        {zones.map((z, i) => (
          <Zone key={z.key} tone={zoneTone(i)} split={z.split} label={z.label}>
            {z.body}
          </Zone>
        ))}
      </div>
      <SourcesFoot iso2={place.iso2} />
      <ReportFoot path={seed.path} />
    </>
  );
}
```

- [ ] **Step 9: The view** `src/components/spine/calculator/calculator-view.tsx`:

```tsx
/**
 * THE COST SIMULATOR, /calculator (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first). Its body is one client component
 * (CalculatorClient.tsx): the levers recompute in the browser, a place switch fetches its defaults from /api/calculator. Drawn by
 * src/app/(site)/calculator/page.tsx and the harness surface `calculator` (page `calculator-gb-london-restaurants`).
 */
import * as React from "react";
import { CalculatorClient } from "./CalculatorClient";
import type { CalculatorSeed } from "@/lib/simulator/seed";
import type { LoudSeat } from "@/lib/spine/loud_seats";

/**
 * THE LOUD MOMENTS (MODEL.md PART 6; the spec's section 4 and R7 4.6): the sales to break even a month, the page's one 40, in terracotta; the sales
 * each 100 of fixed costs needs, at 30, the moves' focal, whose fill the largest move's bar follows; the money to open it holds no honest third.
 * Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "answer", id: "answer", figure: "the sales to break even a month, the page's one 40", state: "LIT", condition: "plan 2026-10-13 cost-simulator, Task 4B (spec section 4, item 2): `--terra-text` at 40 in the answer section; unlit where the break-even waits for an input, its reason standing in its place" },
  { seat: 2, card: "moves", id: "moves", figure: "the sales each 100 of fixed costs needs, at 30, beside the largest move's terracotta bar", state: "LIT", condition: "plan 2026-10-13 cost-simulator, Task 4B (R7 4.6, the largest bar the one other terracotta): RankedBars' focal accent, the leader's bar following it (PART 6); not drawn where no move can be worked out" },
  { seat: 3, card: "opening", figure: "none: the months to pay back rank nothing", state: "NO HONEST CANDIDATE", condition: "plan 2026-10-13 cost-simulator, Task 4B: the payback is the reader's own arithmetic, not a measured standing; the page ends quiet (MODEL PART 6)" },
] as const satisfies readonly LoudSeat[];

export function SpineCalculatorBody({ data }: { data: CalculatorSeed }) {
  return <CalculatorClient seed={data} />;
}
```

- [ ] **Step 10: The page** `src/app/(site)/calculator/page.tsx`, the whole file:

```tsx
/**
 * /calculator: THE COST SIMULATOR (plan 2026-10-13 cost-simulator, Task 4B; spec section 3: "At /calculator (its route, canonical, hub card and footer
 * links stand)"). The route stands where the circular form stood; no URL is renamed. It reads its address, so it renders on each request: the place's
 * three words choose the defaults and an unknown word answers 404. The body is src/components/spine/calculator/calculator-view.tsx.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { SpineCalculatorBody } from "@/components/spine/calculator/calculator-view";
import { buildCalculatorSeed } from "@/lib/simulator/load";
import { COPY } from "@/lib/spine/copy";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined): string | null => (Array.isArray(v) ? v[0] : v) ?? null;

export const metadata: Metadata = {
  title: COPY.calculator.metaTitle,
  description: COPY.calculator.metaDescription,
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const seed = await buildCalculatorSeed({ country: one(q.country), city: one(q.city), trade: one(q.trade) });
  if (!seed) notFound();
  return (
    <SpineShell>
      <SpineCalculatorBody data={seed} />
    </SpineShell>
  );
}
```

- [ ] **Step 11: The page joins the source gates.**
  - `scripts/lib/loud_seats.ts`: `export const SPINE_PAGES = ["country", "howto", "city", "hood", "cell", "industry", "home", "openings"] as const;` becomes `export const SPINE_PAGES = ["country", "howto", "city", "hood", "cell", "industry", "home", "openings", "calculator"] as const;`, and its comment gains `"calculator" since plan 2026-10-13 cost-simulator (src/components/spine/calculator/calculator-view.tsx, /calculator).`
  - `scripts/verify_bar_budget.ts`: after the line `  { name: "openings", budget: 2, files: ["src/components/spine/openings/openings-view.tsx"] }, // /new-businesses, plan 2026-10-09` insert `  { name: "calculator", budget: 2, files: tsxIn("src/components/spine/calculator") }, // /calculator, plan 2026-10-13 cost-simulator: the month's bar and what moves it most (RankedBars is no PRIMITIVE here, so the count reads 1)`, and the header's budget line gains `, calculator 2`.
  - In each of `scripts/verify_banned_patterns.ts`, `scripts/verify_no_bold_display.ts`, `scripts/verify_no_eyebrow.ts` and `scripts/verify_subsection_icons.ts`, after the line `  "src/components/spine/openings/openings-view.tsx", // /new-businesses (plan 2026-10-09, home introduction)` insert:

```ts
  "src/components/spine/calculator/calculator-view.tsx", // /calculator (plan 2026-10-13 cost-simulator), and the three files it draws
  "src/components/spine/calculator/CalculatorClient.tsx",
  "src/components/spine/calculator/sections.tsx",
  "src/components/spine/calculator/levers.tsx",
```

- [ ] **Step 12: Run it to see it pass.** The Step 2 command. Expected: exit 0, `simulator/page: all pass`. A red on "four zones" for a London render whose opening bill is withheld means the city's fit-out moved out of the shard: the report quotes Step 1's Berlin and London `opening.kind`.

- [ ] **Step 13: Wire the gate, the census and the neighbours.** In `scripts/prebuild_all.ts`, after `  { name: "calc-display", script: "tests/simulator/display.test.ts" },` insert:

```ts
  /* THE COST SIMULATOR'S PAGE (plan 2026-10-13 cost-simulator, Task 4B): the seven parts, the one 40, one 30 a section, every figure stamped, the bar
     outside the switch, the signal, each missing figure's reason (Review Focus 2), the loud seats, no server module in the browser, and a currency
     change that writes no lever (Review Focus 5). Offline: bundles built from the shards; jsdom. */
  { name: "calc-page", script: "tests/simulator/page.test.ts" },
```

Stage every new file, then COUNTS, then MEMORY and CENSUS (`docs/loop/CENSUS.md` gains the calculator's sections). Then GATES `--only=calc-page,calc-display,country-model,signal,doors,archetype-copy,spacing-pin,type-floor-reader,tiles-openers,census-fresh,bar-budget,banned-patterns,no-bold-display,no-eyebrow,subsection-icons,no-em-dashes,no-source-agencies,type-ladder,width-discipline,counts-fresh` to `scratchpad/calc/t4b-gates.txt`. Expected: exit 0, except `type-ladder` and `width-discipline` if they report the page's count shrank (the new page.tsx drops the old one's sizes and widths): then `node node_modules/tsx/dist/cli.mjs scripts/verify_type_ladder.ts --write-baseline` and `scripts/verify_width_discipline.ts --write-baseline`, each to its own file, a lowering and never a raise (`git diff` of each baseline shows only falling numbers), and the two gates again. A red on a new calculator file in either gate is fixed in the file. MEMORY and TYPECHECK to `scratchpad/calc/t4b-tsc.txt`: exit 0; if it reports `AtlasIconId` unused in `src/lib/spine/locals_rows.ts`, drop it from that file's import.

- [ ] **Step 14: Commit.**

```bash
cd /e/atlas/website && git add src/lib/simulator/seed.ts src/lib/simulator/load.ts src/components/spine/calculator "src/app/(site)/calculator/page.tsx" src/lib/spine/owner_direction.ts src/lib/spine/signal.ts tests/spine/country_model.test.ts src/lib/spine/door_kinds.ts src/components/spine/archetypes/RankedBars.tsx src/components/spine/zones.tsx src/lib/spine/note_shape.ts src/lib/spine/locals_rows.ts src/components/spine/archetypes/NoteList.tsx scripts/lib/loud_seats.ts scripts/verify_bar_budget.ts scripts/verify_banned_patterns.ts scripts/verify_no_bold_display.ts scripts/verify_no_eyebrow.ts scripts/verify_subsection_icons.ts docs/loop/CENSUS.md tests/simulator/page.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git add -u scripts/type_ladder_baseline.json scripts/width_discipline_baseline.json && git commit -F - <<'MSG'
calc:page: /calculator rebuilt as the cost simulator, the answer's one 40, your margin, your numbers, your month, what moves it most, the money to open it and where figures come from, live in the browser, the signal on the firms above break-even and the margin (plan 2026-10-13 cost-simulator, Task 4B)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 4C: The page joins the chain's renders

Spec section 3: "The page joins the chain's renders, so the copy, page and provenance gates read it." The last surface to join was /new-businesses (plan 2026-10-09, Task 5, Step 7); every place it was named is a place the calculator joins, found by search, not memory.

**Files:**
- Modify: `scripts/harness/render_page.tsx`, `scripts/harness/pages.json`, `scripts/harness/check_model_laws.mjs` (`FLOOR_BY_SURFACE`), `data/seo/floor_census.json` (by its script), `scripts/harness/check_page_links.mjs` (`LINK_FLOOR`, `surfaceOf`), `scripts/verify_doors.ts` (`expectedAnswer`, the masthead's query), `tests/spine/page_foot.test.ts` (`PAGES`), `scripts/verify_launch_ready.ts` (exemplars, `productionPath`), `scripts/verify_art_direction.mjs` (its list of band-page surfaces), `tests/simulator/page.test.ts` (the render's checks, appended)
- Modify (first measurements only, each the calculator's line at 0): `scripts/harness/model_laws_baseline.json`, `page_laws_baseline.json`, `page_holes_baseline.json`, `provenance_baseline.json`, `copy_plain_baseline.json`, `scripts/art_direction_baseline.json`, `scripts/section_bands_baseline.json`, and any other ratchet the run names for the new page
- Regenerated: `docs/loop/CENSUS.md`, `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: Task 4B's `SpineCalculatorBody`, `buildCalculatorSeed`, `SURFACE_ANSWERS.calculator`, the markup contract (`#answer[data-archetype="sim-answer"][data-level="page"]`).
- Produces: the harness surface `calculator <country> <city|anywhere> <trade>`; the chain's render `scratchpad/harness/pages/calculator-gb-london-restaurants.html`; `FLOOR_BY_SURFACE.calculator = 7`.

- [ ] **Step 1: Where the last surface joined.** `cd /e/atlas/website && git grep -n "openings" -- scripts tests > scratchpad/calc/t4c-places.txt 2>&1; echo "exit $?" >> scratchpad/calc/t4c-places.txt`. Read it: every line that names the openings surface or its page (`openings-world`, `case "openings"`, `openings:`) beside the other surfaces is a place in Steps 2 to 8 below; a line about the openings page's own content (its tests, its sections) is not. A place the file holds that Steps 2 to 8 do not name is added the same way and named in the report.

- [ ] **Step 2: The renderer.** In `scripts/harness/render_page.tsx`: the header line `     surfaces: country <iso2> | city <slug> | cell <country> <geo> <industry> | industry <slug> | hood <city> [<district>] | home <iso2> | openings world` gains ` | calculator <country> <city|anywhere> <trade>`; after `import { SpineOpeningsBody } from "../../src/components/spine/openings/openings-view";` add `import { SpineCalculatorBody } from "../../src/components/spine/calculator/calculator-view";` and `import { buildCalculatorSeed } from "../../src/lib/simulator/load";`; after the line `    case "openings": C = SpineOpeningsBody; data = { scope: slugs[0] }; break;` add:

```ts
    /* The cost simulator, /calculator (plan 2026-10-13 cost-simulator, Task 4C): country, city ("anywhere" for none) and trade; its levers at their defaults. */
    case "calculator": C = SpineCalculatorBody; data = await buildCalculatorSeed({ country: slugs[0], city: slugs[1] === "anywhere" ? null : slugs[1] ?? null, trade: slugs[2] ?? null }); break;
```

- [ ] **Step 3: The list.** In `scripts/harness/pages.json`, after the openings entry's closing `}` (the one whose `since` begins `"plan 2026-10-09, home introduction: /new-businesses`), add `,` and:

```json
    {
      "surface": "calculator",
      "slugs": [
        "gb",
        "london",
        "restaurants"
      ],
      "since": "plan 2026-10-13 cost-simulator: /calculator, the cost simulator, London restaurants at their defaults (model.ts's business, no reader's figure)"
    }
```

- [ ] **Step 4: The floor, and the census that copies it.** In `scripts/harness/check_model_laws.mjs`, above `const FLOOR_BY_SURFACE = ` add:

```js
/* calculator 7 since plan 2026-10-13 cost-simulator: /calculator holds the answer, your margin, your numbers, your month, what moves it most, the
   money to open it and where figures come from; its masthead is a band and no section. A view where a section has nothing to draw stands under it,
   and the chain renders the bare page, where all seven draw. */
```

and append `, calculator: 7` inside its braces (after whatever entry is last; Task 0, Step 2 recorded the line). Then the floor census, in its form that keeps every page and rewrites the floors (plan 2026-10-09's own command): MEMORY, then `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/seo/floor_census.tsx --only=howto --limit=1 > scratchpad/calc/t4c-fc.txt 2>&1; echo "exit $?" >> scratchpad/calc/t4c-fc.txt`. Expected: exit 0; `git diff data/seo/floor_census.json` to `scratchpad/calc/t4c-fc-diff.txt` shows `"calculator": 7` at the end of `floors`, a new `generated_at` and at most one how-to entry changed. If the script's usage moved, read its header and run its form for the floors alone; never edit the file by hand.

- [ ] **Step 5: The masthead the door gate reads.** In `scripts/verify_doors.ts`, in `expectedAnswer`, after `    case "openings": return null;` add:

```ts
    /* /calculator answers the sales to break even (plan 2026-10-13 cost-simulator): its answer section is the page's masthead. */
    case "calculator": return SURFACE_ANSWERS.calculator;
```

and in `doorsOf` the query `'[data-archetype="answer-card"][data-level="page"], [data-archetype="hero-board"][data-level="page"]'` becomes `'[data-archetype="answer-card"][data-level="page"], [data-archetype="hero-board"][data-level="page"], [data-archetype="sim-answer"][data-level="page"]'`, and its label query `"[data-answer] > div, [data-answer-absent] > div"` becomes `"[data-answer] > div, [data-answer-absent] > div, [data-sim-figure] .fig, [data-sim-label]"`.

- [ ] **Step 6: The page foot, the launch list, the art direction's list.**
  - `tests/spine/page_foot.test.ts`: after `  { file: "openings-world", path: "/new-businesses", dated: false },` add `  { file: "calculator-gb-london-restaurants", path: "/calculator", dated: false }, // the tool's own sources section dates its figures; no checked line`.
  - `scripts/verify_launch_ready.ts`: after the exemplar line that begins `  { surface: "openings", slugs: ["world"]` add three:

```ts
  { surface: "calculator", slugs: ["gb", "london", "restaurants"], why: "/calculator (plan 2026-10-13 cost-simulator): the harness's page, the UK model at its defaults" },
  { surface: "calculator", slugs: ["de", "berlin", "restaurants"], why: "the world rows: a city's rent, the shard's team, no sales held" },
  { surface: "calculator", slugs: ["gb", "manchester", "barbershops"], why: "England's rows off the model: a recipe that does not carry its utilities" },
```

  and in `productionPath` after `    case "openings": return "/new-businesses";` add ``    case "calculator": return `/calculator?country=${s[0]}${s[1] === "anywhere" ? "" : `&city=${s[1]}`}&trade=${s[2]}`;``.
  - `scripts/verify_art_direction.mjs`: in the comment above `const unread`, `(the eight surfaces of scripts/harness/pages.json each draw their levels with Zone: country, howto, city, cell, industry, hood,` / `home, openings)` becomes `(the nine surfaces of scripts/harness/pages.json each draw their levels with Zone: country, howto, city, cell, industry, hood,` / `home, openings, calculator)`.

- [ ] **Step 7: Render the page.** MEMORY, then RENDER to `scratchpad/calc/t4c-render.txt`. Expected: exit 0 and the line `scratchpad/harness/pages/calculator-gb-london-restaurants.html  <n>KB`. Copy it to `scratchpad/calc/after/`.

- [ ] **Step 8: The link floor.** `cd /e/atlas/website && node scripts/harness/check_page_links.mjs --counts > scratchpad/calc/t4c-links.txt 2>&1; echo "exit $?" >> scratchpad/calc/t4c-links.txt`. Read the calculator's count N (the report link, the licence line's link; the levers and the bars navigate nowhere). In `scripts/harness/check_page_links.mjs`, above `const LINK_FLOOR = ` add `/* calculator N since plan 2026-10-13 cost-simulator: /calculator's distinct internal links as this walk counts them on its render (<what they are, read off t4c-links.txt>). */` with N and the words written in, append `, calculator: N` inside the braces, and after `  name.startsWith("openings-") ? "openings" :` add `  name.startsWith("calculator-") ? "calculator" :`.

- [ ] **Step 9: Every gate over the new page.** GATES `--only=pages-fresh,harness-laws,harness-page-laws,harness-page-filter,harness-copy-plain,harness-readability,provenance,art-direction,zone-rhythm,section-bands,fact-once,type-floor,tiles-openers,spacing-pin,loud-seats,doors,interact,page-foot,harness-links,floor-census-fresh,census-fresh,gathered-emptiness,fullwidth-sitewide,form-variety,bar-budget` to `scratchpad/calc/t4c-gates.txt` (the browser gates one at a time inside the serial chain, nothing beside it). Every red is read before anything changes:
  - A ratchet that reds only because `calculator-gb-london-restaurants` has no entry is seeded by its own command, after reading that no other page's count grew: `--write-baseline` on `check_model_laws.mjs --list --ratchet`, `check_page_laws.mjs --list`, `check_page_holes.mjs --list`, `check_provenance.mjs --list`, `check_copy_plain.mjs --list` and `verify_section_bands.mjs`; `verify_art_direction.mjs --write-baseline` writes every page's count, so run it without the flag first and write only when its "findings GREW" lines name the calculator alone. The new page is held at zero: a seed above 0 is not written, and the finding is fixed in the page (one fix, one render, one rerun). `git diff` of each baseline shows the calculator's line and nothing else; any other moved line is restored by hand and named in the report.
  - A law (FOCAL, LINES, LINE LONG, fact-once, type-floor, tiles-openers, loud-seats, zone-rhythm) that reds on the calculator is fixed in the calculator's files. A fact-once red on the levers' head counts (two roles at the same count) is answered in `scripts/harness/fact_once_allow.json` with the law "a stepper's count is the reader's control, read as an input, not a fact printed twice", the page, the figure and the place, and nothing else is allowed there.
  - A gate that reds because it holds no entry for the surface `calculator` is a place Step 1 missed: it is added as openings was, and named in the report.
  Expected after the fixes: exit 0.

- [ ] **Step 10: The render's checks.** Append to `tests/simulator/page.test.ts`, before `  if (failed > 0) {`:

```ts
  /* THE CHAIN'S RENDER (Task 4C): the bare page as pages-fresh draws it, its masthead declared, its seven parts, every figure stamped. */
  const RENDER = "scratchpad/harness/pages/calculator-gb-london-restaurants.html";
  const listed = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages.some((p: { surface: string; slugs: string[] }) => p.surface === "calculator" && p.slugs.join("-") === "gb-london-restaurants");
  check("the harness lists the calculator's page", listed, "scripts/harness/pages.json");
  check("the model laws hold a floor of seven for it", /calculator: 7/.test(readFileSync("scripts/harness/check_model_laws.mjs", "utf8")), "scripts/harness/check_model_laws.mjs");
  if (!existsSync(RENDER)) check(`a render to read (run the pages-fresh gate): ${RENDER}`, false, RENDER);
  else {
    const rd = new JSDOM(readFileSync(RENDER, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
    check("the render draws the seven parts and its masthead answers the break-even", ids.every((id) => rd.getElementById(id)) && !!rd.querySelector('[data-archetype="sim-answer"][data-level="page"][data-answers="break-even"] [data-sim-figure] .fig'), RENDER);
    const silent = [...rd.querySelectorAll("main .fig")].filter((el) => !el.getAttribute("data-src") || !KINDS.has(el.getAttribute("data-kind") ?? ""));
    check(`every figure on the render says where it came from (${silent.length} silent)`, silent.length === 0, RENDER);
  }
```

Run the test (Task 4B's Step 2 command): exit 0.

- [ ] **Step 11: Counts, census, typecheck.** Stage, COUNTS (gate path literals changed), MEMORY and CENSUS, MEMORY and TYPECHECK to `scratchpad/calc/t4c-tsc.txt`: exit 0. GATES `--only=calc-page,census-fresh,counts-fresh` to `scratchpad/calc/t4c-gates2.txt`: exit 0.

- [ ] **Step 12: Commit.**

```bash
cd /e/atlas/website && git add scripts/harness/render_page.tsx scripts/harness/pages.json scripts/harness/check_model_laws.mjs data/seo/floor_census.json scripts/harness/check_page_links.mjs scripts/verify_doors.ts tests/spine/page_foot.test.ts scripts/verify_launch_ready.ts scripts/verify_art_direction.mjs tests/simulator/page.test.ts docs/loop/CENSUS.md scripts/gates.json CLAUDE.md && git add -u scripts/harness/*_baseline.json scripts/*_baseline.json scripts/harness/fact_once_allow.json src/components/spine/calculator && git commit -F - <<'MSG'
calc:render: /calculator joins the chain's renders (London restaurants at their defaults), its floor of seven, its masthead declared to the door gate, every render law and ratchet reading it at zero (plan 2026-10-13 cost-simulator, Task 4C)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 5: The address, its bounds and its robots

**Files:**
- Create: `src/lib/simulator/state.ts`, `src/lib/simulator/seo.ts`
- Modify: `src/lib/simulator/load.ts` (`buildCalculatorSeed` takes `v`), `src/app/(site)/calculator/page.tsx` (`generateMetadata`, `v`), `src/components/spine/calculator/CalculatorClient.tsx` (the address follows), `src/middleware.ts` (`/calculator` leaves the cache list)
- Test: `tests/simulator/state.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-state` after `calc-page`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `LEVERS`, `FRESH`, `SimState`, `SimBundle` (Task 2); `BOUNDS`, `HEADS_MAX`, `PAY_MAX`, `clampTo` (Task 4A); `DEFAULT_PLACE`, `Place` (Task 2); `seedOf` (Task 4B).
- Produces: `encodeState(state, bundle) => string | null`; `decodeState(v, bundle) => SimState`; `calculatorHref(place, state, bundle) => string`; `ADDRESS_DEBOUNCE_MS = 250` (`state.ts`); `calculatorMetadata(searchParams) => Metadata` (`seo.ts`); `buildCalculatorSeed({ country, city, trade, v })`.

- [ ] **Step 1: Write the failing test** `tests/simulator/state.test.ts`:

```ts
/**
 * THE ADDRESS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "State in the address: country, city and trade, and only the levers that differ
 * from the defaults ... an unknown lever is ignored, one out of range clamped ... Canonical /calculator on every view; a view with parameters is
 * noindex"; Review Focus 4: a typed figure out of range, the address's half). The round trip; the clamps and the ignored; the href; the robots; the
 * edge no longer caching a page that reads its address; the client writing the address with replaceState after a pause.
 * BLIND SPOT, stated: it reads the client's and the page's source for the wiring; the browser check in Task 9 watches the address change.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/state.test.ts
 */
import { readFileSync } from "node:fs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-state";
const FILE = "src/lib/simulator/state.ts";
const REMEDY = "write only the levers that differ from the defaults into v, read them back clamped, ignore what names nothing, keep /calculator canonical and noindex every view with parameters, and let the edge never cache a page that reads its address";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const St = await import("../../src/lib/simulator/state").catch(() => null);
  const Seo = await import("../../src/lib/simulator/seo").catch(() => null);
  check("the address module is there", !!St);
  check("the robots module is there", !!Seo, "src/lib/simulator/seo.ts");
  if (!St || !Seo) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const P = await import("../../src/lib/simulator/place");
  const D = await import("../../src/lib/simulator/defaults");
  const B = await import("../../src/lib/simulator/bundle");
  const lp = P.resolvePlace({ country: "gb", city: "london", trade: "restaurants" })!;
  const lb = D.buildBundle(lp, { cell: null });
  const bp = P.resolvePlace({ country: "de", city: "berlin", trade: "restaurants" })!;
  const bb = D.buildBundle(bp, { cell: null });
  const chef = bb.roles.find((r) => r.key === "head_chef_or_kitchen_lead")!.key;
  const cook = bb.roles.find((r) => r.key === "line_and_prep_cook")!.key;

  /* THE ROUND TRIP: only what differs, back as it went. */
  check("the defaults write nothing", St.encodeState(B.FRESH, lb) === null && St.encodeState({ ...B.FRESH, levers: { area: lb.inputs.area.value } }, lb) === null);
  const s = { levers: { area: 250, rent: 410.5, sales: null, owner: 52000 }, on: { owner: true, target: true }, heads: { [chef]: 2, [cook]: 4.5 }, pay: { [chef]: 61000 }, form: null };
  const v = St.encodeState(s, bb);
  const back = St.decodeState(v, bb);
  check(`a state goes out and comes back whole (${v})`, v === `area:250,rent:410.5,sales:,owner:52000,target:on,team:${chef}-2.${cook}-4.5,pay:${chef}-61000` && JSON.stringify(back) === JSON.stringify({ levers: { area: 250, rent: 410.5, sales: null, owner: 52000 }, on: { owner: true, target: true }, heads: { [chef]: 2, [cook]: 4.5 }, pay: { [chef]: 61000 }, form: null }));
  check("the legal form travels in the UK alone", St.encodeState({ ...B.FRESH, form: "company" }, lb) === "form:company" && St.decodeState("form:company", lb).form === "company" && St.decodeState("form:company", bb).form === null);

  /* REVIEW FOCUS 4, THE ADDRESS'S HALF: clamped, ignored, never thrown. */
  const odd = St.decodeState("area:-5,rent:abc,zz:1", lb);
  check(`v=area:-5,rent:abc,zz:1 reads as the least floor space and nothing else (${JSON.stringify(odd.levers)})`, JSON.stringify(odd.levers) === JSON.stringify({ area: 5 }));
  check("a figure past the top is held at the top", St.decodeState("area:999999,sales:1e99", lb).levers.area === 2000 && St.decodeState("area:999999,sales:1e99", lb).levers.sales === undefined);
  check("a role the place does not hold is ignored, heads past fifty held at fifty", JSON.stringify(St.decodeState(`team:nobody-3.${chef}-99`, bb).heads) === JSON.stringify({ [chef]: 50 }));
  check("an address of 3,000 characters reads as the defaults", JSON.stringify(St.decodeState("area:1,".repeat(500), lb)) === JSON.stringify(B.FRESH));
  check("nothing at all reads as the defaults", JSON.stringify(St.decodeState(null, lb)) === JSON.stringify(B.FRESH) && JSON.stringify(St.decodeState("", lb)) === JSON.stringify(B.FRESH));

  /* THE HREF: the bare page clean, every other view its place and its changes. */
  check(`London at its defaults is /calculator (${St.calculatorHref(lp, B.FRESH, lb)})`, St.calculatorHref(lp, B.FRESH, lb) === "/calculator");
  check(`Berlin with its floor space changed (${St.calculatorHref(bp, { ...B.FRESH, levers: { area: 250 } }, bb)})`, St.calculatorHref(bp, { ...B.FRESH, levers: { area: 250 } }, bb) === "/calculator?country=de&city=berlin&trade=restaurants&v=area:250");
  const anyDe = P.resolvePlace({ country: "de", city: null, trade: "restaurants" })!;
  check("anywhere in a country carries no city", St.calculatorHref(anyDe, B.FRESH, D.buildBundle(anyDe, { cell: null })) === "/calculator?country=de&trade=restaurants");

  /* THE ROBOTS: canonical on every view, noindex with any parameter. */
  const bare = Seo.calculatorMetadata({});
  const view = Seo.calculatorMetadata({ country: "gb", city: "london", trade: "restaurants" });
  check("the bare page: canonical /calculator, indexable", (bare.alternates as { canonical?: string })?.canonical === "/calculator" && bare.robots === undefined, "src/lib/simulator/seo.ts");
  check("a view with parameters: canonical /calculator, noindex, followed", (view.alternates as { canonical?: string })?.canonical === "/calculator" && JSON.stringify(view.robots) === JSON.stringify({ index: false, follow: true }), "src/lib/simulator/seo.ts");

  /* THE WIRING: the page, the client, the edge. */
  const page = readFileSync("src/app/(site)/calculator/page.tsx", "utf8");
  check("the page asks its robots of calculatorMetadata and hands v to the seed", /export async function generateMetadata/.test(page) && /calculatorMetadata\(/.test(page) && /v: one\(q\.v\)/.test(page) && !/export const metadata/.test(page), "src/app/(site)/calculator/page.tsx");
  const client = readFileSync("src/components/spine/calculator/CalculatorClient.tsx", "utf8");
  check("the client writes the address with replaceState after a pause, and never navigates", /window\.history\.replaceState\(/.test(client) && /ADDRESS_DEBOUNCE_MS/.test(client) && /calculatorHref\(/.test(client) && !/useRouter|router\.push/.test(client), "src/components/spine/calculator/CalculatorClient.tsx");
  const mw = readFileSync("src/middleware.ts", "utf8");
  check("the edge caches no /calculator: the page reads its address", !/^\s*\/\^\\\/calculator\$\/,/m.test(mw), "src/middleware.ts");

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/state: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-state crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/state.test.ts > scratchpad/calc/t5.txt 2>&1; echo "exit $?" >> scratchpad/calc/t5.txt`. Expected: exit 1, the two "is there" reds.

- [ ] **Step 3: The address** `src/lib/simulator/state.ts`:

```ts
/**
 * src/lib/simulator/state.ts , THE READER'S CHANGES IN THE ADDRESS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "only the levers that differ
 * from the defaults (?country=gb&city=london&trade=restaurants&v=...) ... an unknown lever is ignored, one out of range clamped"; R7 4.4's form).
 *
 * THE FORM. `v` is pairs `key:value` joined by commas: a lever and its base figure (two decimals at most, shares as decimals; an empty value is a field
 * the reader cleared), `team:` role-heads pairs joined by dots, `pay:` role-amount pairs joined by dots, `owner:on` or `owner:<figure>` (the same for
 * `target`), `form:company` or `form:sole`. A role is the bundle's own key, [a-z0-9_], so a dot before a letter parts two pairs and a dot before a
 * digit is a decimal point. Every character is one a query string carries as it is. Pure: the server decodes, the browser encodes.
 */
import { DEFAULT_PLACE, FRESH, LEVERS, type LeverKey, type SimBundle, type SimState } from "./bundle";
import { HEADS_MAX, PAY_MAX, clampTo } from "./bounds";
import type { Place } from "./place";

export const ADDRESS_DEBOUNCE_MS = 250;
const NUM = /^-?\d+(?:\.\d+)?$/;
const MAX_V = 2000;
const num = (x: number) => String(Math.round(x * 100) / 100);
const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

export function encodeState(s: SimState, b: SimBundle): string | null {
  const parts: string[] = [];
  for (const k of LEVERS) {
    if (k === "owner" || k === "target" || !has(s.levers, k)) continue;
    const x = s.levers[k];
    if (x === null || x === undefined) parts.push(`${k}:`);
    else if (x !== b.inputs[k].value) parts.push(`${k}:${num(x)}`);
  }
  for (const k of ["owner", "target"] as const) {
    if (!s.on[k]) continue;
    const x = s.levers[k];
    parts.push(x === null || x === undefined ? `${k}:on` : `${k}:${num(x)}`);
  }
  const team = b.roles.filter((r) => has(s.heads, r.key) && s.heads[r.key] !== r.heads).map((r) => `${r.key}-${num(s.heads[r.key])}`);
  if (team.length > 0) parts.push(`team:${team.join(".")}`);
  const pay = b.roles.filter((r) => has(s.pay, r.key) && s.pay[r.key] !== r.pay.value).map((r) => `${r.key}-${num(s.pay[r.key])}`);
  if (pay.length > 0) parts.push(`pay:${pay.join(".")}`);
  if (s.form && b.tax.law === "uk" && s.form !== b.tax.form) parts.push(`form:${s.form === "company" ? "company" : "sole"}`);
  return parts.length > 0 ? parts.join(",") : null;
}

export function decodeState(v: string | null | undefined, b: SimBundle): SimState {
  if (typeof v !== "string" || v === "" || v.length > MAX_V) return FRESH;
  const s: SimState = { levers: {}, on: {}, heads: {}, pay: {}, form: null };
  const roles = new Set(b.roles.map((r) => r.key));
  for (const pair of v.split(",")) {
    const at = pair.indexOf(":");
    if (at <= 0) continue;
    const key = pair.slice(0, at);
    const raw = pair.slice(at + 1);
    if (key === "team" || key === "pay") {
      for (const rp of raw.split(/\.(?=[a-z])/)) {
        const dash = rp.lastIndexOf("-");
        const role = rp.slice(0, dash);
        const n = rp.slice(dash + 1);
        if (dash <= 0 || !roles.has(role) || !NUM.test(n)) continue;
        if (key === "team") s.heads[role] = Math.min(HEADS_MAX, Math.max(0, Number(n)));
        else s.pay[role] = Math.min(PAY_MAX, Math.max(0, Number(n)));
      }
      continue;
    }
    if (key === "form") {
      if (b.tax.law === "uk" && (raw === "company" || raw === "sole")) s.form = raw === "company" ? "company" : "sole trader";
      continue;
    }
    if (!(LEVERS as readonly string[]).includes(key)) continue;
    const k = key as LeverKey;
    if (k === "owner" || k === "target") {
      if (raw === "on") s.on[k] = true;
      else if (NUM.test(raw)) { s.on[k] = true; s.levers[k] = clampTo(k, Number(raw)); }
      continue;
    }
    if (raw === "") s.levers[k] = null;
    else if (NUM.test(raw)) s.levers[k] = clampTo(k, Number(raw));
  }
  return s;
}

/** The view's address: /calculator for the default place at its defaults, else the place's words and the changes. */
export function calculatorHref(place: Pick<Place, "country" | "city" | "trade">, s: SimState, b: SimBundle): string {
  const v = encodeState(s, b);
  const bare = place.country === DEFAULT_PLACE.country && place.city === DEFAULT_PLACE.city && place.trade === DEFAULT_PLACE.trade;
  if (bare && v === null) return "/calculator";
  return `/calculator?country=${place.country}${place.city ? `&city=${place.city}` : ""}&trade=${place.trade}${v ? `&v=${v}` : ""}`;
}
```

`sales:1e99` does not match `NUM` and is ignored, which the test holds (the lever keeps its default). The client imports `state.ts`, `bundle.ts` and `bounds.ts` (all pure) and only the type of `place.ts`, so Task 4B's module walk still finds no city list or taxonomy in the browser (`DEFAULT_PLACE` is declared in `bundle.ts` since Task 2 for this reason).

- [ ] **Step 4: The robots** `src/lib/simulator/seo.ts`:

```ts
/**
 * src/lib/simulator/seo.ts , THE CALCULATOR'S ROBOTS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "Canonical /calculator on every view; a view
 * with parameters is noindex and in no sitemap"; the page-architecture spec of 2026-10-09, its rule for views). The bare page keeps the site's default.
 */
import type { Metadata } from "next";
import { COPY } from "@/lib/spine/copy";

export function calculatorMetadata(q: Record<string, string | string[] | undefined>): Metadata {
  const view = Object.values(q).some((x) => x !== undefined);
  return {
    title: COPY.calculator.metaTitle,
    description: COPY.calculator.metaDescription,
    alternates: { canonical: "/calculator" },
    ...(view ? { robots: { index: false, follow: true } } : {}),
  };
}
```

- [ ] **Step 5: The page reads v; the client writes the address; the edge lets go.**
  - `src/lib/simulator/load.ts`: `buildCalculatorSeed(q: { country?: string | null; city?: string | null; trade?: string | null })` becomes `buildCalculatorSeed(q: { country?: string | null; city?: string | null; trade?: string | null; v?: string | null })`, its import of `./bundle` gains nothing, `import { decodeState } from "./state";` is added, and its last line becomes `const bundle = await loadPlaceBundle(place);` then `return seedOf(place, bundle, decodeState(q.v ?? null, bundle));`.
  - `src/app/(site)/calculator/page.tsx`: the `export const metadata: Metadata = { ... };` block becomes

```tsx
export async function generateMetadata({ searchParams }: { searchParams: Search }): Promise<Metadata> {
  return calculatorMetadata(await searchParams);
}
```

    with `import { calculatorMetadata } from "@/lib/simulator/seo";` (the `COPY` import leaves), and the seed call gains `v: one(q.v)`: `buildCalculatorSeed({ country: one(q.country), city: one(q.city), trade: one(q.trade), v: one(q.v) })`.
  - `src/components/spine/calculator/CalculatorClient.tsx`: add `import { ADDRESS_DEBOUNCE_MS, calculatorHref } from "@/lib/simulator/state";` and, after the currency effect:

```tsx
  /* THE ADDRESS FOLLOWS (spec section 3): the place and the changed levers, written with replaceState once the reader pauses, so a drag writes one entry
     and Back leaves the page as it came. */
  React.useEffect(() => {
    const href = calculatorHref(place, state, bundle);
    const t = window.setTimeout(() => {
      if (window.location.pathname + window.location.search !== href) window.history.replaceState(window.history.state, "", href);
    }, ADDRESS_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [place, state, bundle]);
```

  - `src/middleware.ts`: the line `  /^\/calculator$/,` in `CACHEABLE_PATTERNS` becomes

```ts
  /* /calculator REMOVED (plan 2026-10-13 cost-simulator, Task 5): the cost simulator reads its address (the place and the reader's changes), so it is
     the kind of page the note below keeps out, as /decide and /contact are. */
```

- [ ] **Step 6: Run it to see it pass.** The Step 2 command, then Task 4B's page test (its walk now sees `state.ts` and `bundle.ts`, never `place.ts`). Expected: both exit 0.

- [ ] **Step 7: Wire the gate.** In `scripts/prebuild_all.ts`, after `  { name: "calc-page", script: "tests/simulator/page.test.ts" },` insert:

```ts
  /* THE ADDRESS (plan 2026-10-13 cost-simulator, Task 5): only the changes in v, read back clamped (Review Focus 4), unknown keys ignored, canonical
     /calculator and noindex with parameters, the edge never caching it, the client writing it with replaceState. */
  { name: "calc-state", script: "tests/simulator/state.test.ts" },
```

Stage, COUNTS, then GATES `--only=calc-state,calc-page,calc-defaults,edge-not-found,counts-fresh` to `scratchpad/calc/t5-gates.txt`. Expected: exit 0. MEMORY and TYPECHECK to `scratchpad/calc/t5-tsc.txt`: exit 0.

- [ ] **Step 8: Commit.**

```bash
cd /e/atlas/website && git add src/lib/simulator/state.ts src/lib/simulator/seo.ts src/lib/simulator/load.ts "src/app/(site)/calculator/page.tsx" src/components/spine/calculator/CalculatorClient.tsx src/middleware.ts tests/simulator/state.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:address: the reader's changes in the address (only what differs, clamped on the way back, unknown keys ignored), replaceState after a pause, canonical /calculator and noindex with parameters, the edge no longer caching it (plan 2026-10-13 cost-simulator, Task 5)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 6: The door from every trade page

Written for Q3 answer A: a fourth door in the trade close, before the compare pill, the cap a prop the trade close alone raises to four.

**Files:**
- Modify: `src/lib/spine/copy.ts` (`COPY.tradeClose.runDoor`), `src/lib/spine/close_rows.ts` (`buildTradeCloseDoors`), `src/components/spine/archetypes/Terminus.tsx` (`cap`, `TRADE_CLOSE_CAP`), `src/components/spine/cell/exit.tsx` (`CloseCard` passes the cap), `src/components/spine/cell/cell-view.tsx` (the trade close asks four), `src/components/spine/archetypes/stories.tsx` (the trade close's story), `scripts/verify_doors.ts` (`landingOf` for /calculator), `scripts/verify_archetype_copy.ts` (`checkDoors` takes a cap; the trade close's counts)
- Test: `tests/simulator/door.test.ts` (create)
- Modify: `scripts/prebuild_all.ts` (gate `calc-door` after `calc-state`); regenerated `scripts/gates.json`, `CLAUDE.md`

**Interfaces:**
- Consumes: `resolvePlace`, `cityOfCountry` (Task 2); `SURFACE_ANSWERS.calculator` (Task 4B); `Door`, `DOOR_CAP` (`Terminus.tsx`).
- Produces: `COPY.tradeClose.runDoor = "Run your own numbers"`; the trade close's door `{ key: "run", label, href: "/calculator?country=<cc>[&city=<slug>]&trade=<slug>", kind: "link", lands: "break-even" }` before the pill; `TRADE_CLOSE_CAP = 4`; `Terminus({ kicker, doors, cap? })`; `CloseCard({ id?, doors, cap? })`; `landingOf("/calculator?...")` answering the surface `calculator` where the place resolves.

- [ ] **Step 1: Write the failing test** `tests/simulator/door.test.ts`:

```ts
/**
 * THE DOOR (plan 2026-10-13 cost-simulator, Task 6; spec section 3: "Each trade-in-place page gains a door, 'Run your own numbers', carrying its three
 * place parameters"; Q3 answered as written, A). The trade close's doors on the three seeds the archetype gate holds (London, California, a place with
 * no page), the door's place (a city of the country, else anywhere in it), no door where the calculator offers no such place or trade, the cap the
 * trade close alone raises, the door gate's landing for /calculator, and the London trade page's render with its four doors.
 * BLIND SPOT, stated: it reads the builder and the render; the browser walk of Task 9 follows the door to the page.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/door.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { buildTradeCloseDoors } from "../../src/lib/spine/close_rows";
import { Terminus, DOOR_CAP } from "../../src/components/spine/archetypes/Terminus";
import { COPY } from "../../src/lib/spine/copy";
import { INDUSTRIES, isDefaultVisible, industryToSlug } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "calc-door";
const FILE = "src/lib/spine/close_rows.ts";
const REMEDY = "add the run door to the trade close before the compare pill, carrying the trade page's place (its city where the calculator holds it, else the country) and trade, only where the calculator resolves it, the cap raised to four for the trade close alone";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const T = await import("../../src/components/spine/archetypes/Terminus");
  check("the trade close's cap is exported, four", (T as { TRADE_CLOSE_CAP?: number }).TRADE_CLOSE_CAP === 4 && DOOR_CAP === 3, "src/components/spine/archetypes/Terminus.tsx");
  check(`the door's words: four, its own first word (${COPY.tradeClose.runDoor})`, (COPY.tradeClose as Record<string, string>).runDoor === "Run your own numbers", "src/lib/spine/copy.ts");

  const seed = (trade: string, iso2: string, geo: string, industry: string, id: string, city: string) => ({ meta: { trade, iso2, geo, industry, industry_id: id, city } });
  const london = buildTradeCloseDoors(seed("Restaurants", "GB", "london", "restaurants", "restaurants", "London"));
  check(`London: industry, place, run, the pill (${london.map((d) => d.key).join(", ")})`, JSON.stringify(london.map((d) => d.key)) === JSON.stringify(["industry", "place", "run", "compare"]));
  const run = london.find((d) => d.key === "run");
  check(`London's door carries its three words and promises the break-even (${run?.href})`, run?.href === "/calculator?country=gb&city=london&trade=restaurants" && run?.lands === "break-even" && run?.kind === "link" && run?.label === "Run your own numbers");
  const cal = buildTradeCloseDoors(seed("Restaurants", "US", "california", "restaurants", "restaurants", "California"));
  check(`a region's trade page sends anywhere in its country (${cal.find((d) => d.key === "run")?.href})`, cal.length === 4 && cal.find((d) => d.key === "run")?.href === "/calculator?country=us&trade=restaurants");
  const pom = buildTradeCloseDoors(seed("Cafés & coffee shops", "GB", "gb-e06000043", "cafes-coffee-shops", "cafes_coffee", "Portsmouth"));
  check(`a place with no page of its own: industry, run, the pill (${pom.map((d) => d.key).join(", ")})`, JSON.stringify(pom.map((d) => d.key)) === JSON.stringify(["industry", "run", "compare"]) && pom[1].href === `/calculator?country=gb&trade=${industryToSlug("cafes_coffee")}`);
  const hidden = INDUSTRIES.find((i) => !isDefaultVisible(i));
  if (hidden) {
    const none = buildTradeCloseDoors(seed(hidden.name, "GB", "london", industryToSlug(hidden.id), hidden.id, "London"));
    check(`a trade the calculator does not offer (${hidden.id}) draws no run door`, !none.some((d) => d.key === "run"));
  }
  check("every first word stands alone, the pill last", [london, cal, pom].every((ds) => new Set(ds.map((d) => d.label.split(/\s+/)[0].toLowerCase())).size === ds.length && ds[ds.length - 1].kind === "pill"));

  /* THE CAP: four on the trade close, three everywhere else. */
  const four = renderToStaticMarkup(React.createElement(Terminus, { doors: london, cap: 4 } as React.ComponentProps<typeof Terminus>));
  const three = renderToStaticMarkup(React.createElement(Terminus, { doors: london }));
  check("the trade close draws its four doors; a terminus without the cap still draws three", (four.match(/data-door/g) ?? []).length === 4 && (three.match(/data-door/g) ?? []).length === 3, "src/components/spine/archetypes/Terminus.tsx");
  check("the trade page asks four of its close card", /<CloseCard doors=\{doors\} cap=\{TRADE_CLOSE_CAP\} \/>/.test(readFileSync("src/components/spine/cell/cell-view.tsx", "utf8")), "src/components/spine/cell/cell-view.tsx");
  check("the door gate lands /calculator by the place it resolves", /if \(path === "\/calculator"\) return calculatorLanding\(href\);/.test(readFileSync("scripts/verify_doors.ts", "utf8")), "scripts/verify_doors.ts");
  check("the archetype gate holds the trade close to four", /checkDoors\(name, doors, "trade close", TRADE_CLOSE_CAP\)/.test(readFileSync("scripts/verify_archetype_copy.ts", "utf8")), "scripts/verify_archetype_copy.ts");

  /* THE RENDER: London's restaurant page, its close. */
  const RENDER = "scratchpad/harness/pages/cell-gb-london-restaurants.html";
  if (!existsSync(RENDER)) check(`a render to read (run the pages-fresh gate): ${RENDER}`, false, RENDER);
  else {
    const doc = new JSDOM(readFileSync(RENDER, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
    const doors = [...doc.querySelectorAll("#close a[data-door]")].map((a) => (a.textContent ?? "").replace(/→/g, "").trim());
    check(`London's restaurant page closes on four doors, the run door before the pill (${doors.join(" | ")})`, doors.length === 4 && doors[2] === "Run your own numbers", RENDER);
  }

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/door: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-door crashed:", e); process.exit(1); });
```

- [ ] **Step 2: Run it to see it fail.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs tests/simulator/door.test.ts > scratchpad/calc/t6.txt 2>&1; echo "exit $?" >> scratchpad/calc/t6.txt`. Expected: exit 1: the cap, the words and London's keys red.

- [ ] **Step 3: The words, the cap.**
  - `src/lib/spine/copy.ts`, in `tradeClose`, after `    compareDoor: "Compare {trade} across cities",` add `    runDoor: "Run your own numbers",`, and the comment above `tradeClose` gains: ` *  The run door since plan 2026-10-13 cost-simulator (Q3, answer A): the calculator with the page's place and trade, before the pill, a fourth door.`
  - `src/components/spine/archetypes/Terminus.tsx`: after `export const DOOR_CAP = 3;` add

```ts
/** THE TRADE CLOSE'S FOUR (plan 2026-10-13 cost-simulator, Task 6; Q3 answered A): the industry page, the place's page, the calculator with the place,
 *  the compare pill. Only the trade close asks it; every other terminus keeps DOOR_CAP. */
export const TRADE_CLOSE_CAP = 4;
```

    `export function Terminus({ kicker, doors }: { kicker?: string; doors: Door[] }) {` becomes `export function Terminus({ kicker, doors, cap = DOOR_CAP }: { kicker?: string; doors: Door[]; cap?: number }) {`, and `.slice(0, DOOR_CAP);` in its first line becomes `.slice(0, cap);`.
  - `src/components/spine/cell/exit.tsx`: `export function CloseCard({ id = "close", doors }: { id?: string; doors: Door[] }) {` becomes `export function CloseCard({ id = "close", doors, cap }: { id?: string; doors: Door[]; cap?: number }) {` and `<Terminus kicker={COPY.close.kicker} doors={doors} />` becomes `<Terminus kicker={COPY.close.kicker} doors={doors} cap={cap} />`.
  - `src/components/spine/cell/cell-view.tsx`: `<CloseCard doors={doors} />` becomes `<CloseCard doors={doors} cap={TRADE_CLOSE_CAP} />`, with `import { TRADE_CLOSE_CAP } from "@/components/spine/archetypes/Terminus";` beside its imports; its header's `three doors and the pill last` becomes `four doors, the run door before the pill last`.
  - `src/components/spine/archetypes/stories.tsx`: `<CloseCard id={`close-cell-${c.key}`} doors={doors} />` becomes `<CloseCard id={`close-cell-${c.key}`} doors={doors} cap={TRADE_CLOSE_CAP} />` (import beside its Terminus import); in `pickCellCloseInstances`' why and the comment above `cellCloseKey`, `the compare pill last` becomes `the calculator with the place, the compare pill last` and `the exemplar's three doors` becomes `the exemplar's four doors`.

- [ ] **Step 4: The door.** In `src/lib/spine/close_rows.ts`, add `import { cityOfCountry, resolvePlace } from "@/lib/simulator/place";` and, above `buildTradeCloseDoors`:

```ts
/** The calculator's address for a trade page's place and trade: its city where the city list holds it for the country, else anywhere in the country (a
 *  region, a council); null where the calculator names no such place or trade (a trade it does not offer). */
function runDoorHref(iso2: string, geo: string, tradeSlug: string | null): string | null {
  if (iso2.length !== 2 || !tradeSlug) return null;
  const place = resolvePlace({ country: iso2.toLowerCase(), city: cityOfCountry(iso2, geo), trade: tradeSlug });
  return place ? `/calculator?country=${place.country}${place.city ? `&city=${place.city}` : ""}&trade=${place.trade}` : null;
}
```

  and in `buildTradeCloseDoors`, before `  doors.push({ key: "compare",` insert:

```ts
  /* THE RUN DOOR (plan 2026-10-13 cost-simulator, Task 6; spec section 3; Q3 answered A): the calculator with this page's place and trade, before the
     pill; it lands on the calculator's masthead, the sales to break even. */
  const run = runDoorHref(iso2, geo, industrySlug);
  if (run) doors.push({ key: "run", label: COPY.tradeClose.runDoor, href: run, kind: "link", lands: SURFACE_ANSWERS.calculator });
```

- [ ] **Step 5: The gates read the door.**
  - `scripts/verify_doors.ts`: add `import { resolvePlace } from "../src/lib/simulator/place";` and, above `function landingOf`:

```ts
/* /calculator (plan 2026-10-13 cost-simulator, Task 6): a static route that reads its address; it exists for the place its three words resolve and
   answers 404 for any other, the page's own rule (src/lib/simulator/place.ts). */
function calculatorLanding(href: string): Landing {
  const q = new URLSearchParams(href.split("#")[0].split("?")[1] ?? "");
  const place = resolvePlace({ country: q.get("country"), city: q.get("city"), trade: q.get("trade") });
  return place
    ? { surface: "calculator", answers: SURFACE_ANSWERS.calculator, exists: "yes", why: `the calculator resolves ${place.country}/${place.city ?? "anywhere"}/${place.trade}` }
    : { surface: "calculator", answers: SURFACE_ANSWERS.calculator, exists: "no", why: `the calculator answers 404 for "${q.toString()}"` };
}
```

    and inside `if (ROUTES.statics.has(path)) {`, before `    return { surface: "static", answers: null, exists: "yes", why: "a static route" };`, add `    if (path === "/calculator") return calculatorLanding(href);`.
  - `scripts/verify_archetype_copy.ts`: `import { DOOR_CAP } from "@/components/spine/archetypes/Terminus";` becomes `import { DOOR_CAP, TRADE_CLOSE_CAP } from "@/components/spine/archetypes/Terminus";`; `function checkDoors(iso2: string, doors: ReturnType<typeof buildCloseDoors>, page: string) {` becomes `function checkDoors(iso2: string, doors: ReturnType<typeof buildCloseDoors>, page: string, cap = DOOR_CAP) {` and its first line's `doors.length > DOOR_CAP` and `over ${DOOR_CAP}` become `doors.length > cap` and `over ${cap}`; in `tradeCloseSeeds` the counts `3`, `3`, `2` become `4`, `4`, `3`; `checkDoors(name, doors, "trade close");` becomes `checkDoors(name, doors, "trade close", TRADE_CLOSE_CAP);`, and after the line that checks the first door is the industry page's add:

```ts
    if (doors[doors.length - 2]?.key !== "run" || !doors[doors.length - 2].href.startsWith("/calculator?country=")) reds.push(`trade close (${name}): the run door does not stand before the pill`);
```

- [ ] **Step 6: Run it to see it pass.** RENDER `cell gb london restaurants` (one render) to `scratchpad/calc/t6-render.txt`, then the Step 2 command. Expected: exit 0, `simulator/door: all pass`.

- [ ] **Step 7: Wire the gate; the doors walk the new door.** In `scripts/prebuild_all.ts`, after `  { name: "calc-state", script: "tests/simulator/state.test.ts" },` insert:

```ts
  /* THE DOOR (plan 2026-10-13 cost-simulator, Task 6; Q3 answer A): every trade page's close carries "Run your own numbers" with its place and trade,
     before the pill, four doors on the trade close alone. */
  { name: "calc-door", script: "tests/simulator/door.test.ts" },
```

Stage, COUNTS, then GATES `--only=pages-fresh,calc-door,doors,archetype-copy,harness-archetypes,harness-laws,harness-page-laws,harness-copy-plain,loud-seats,interact,counts-fresh` to `scratchpad/calc/t6-gates.txt` (browser gates one at a time). Expected: exit 0; the `doors` walk prints `ok link ... "Run your own numbers" /calculator?country=gb&city=london&trade=restaurants -> calculator (answers break-even)` on the London trade render. A model-laws or page-laws red on the four-door close (a terminus of four) is the written rule Task 8 changes: read it, record it in the report, and let Task 8's MODEL row and its gate line land in the same review; no baseline rises. MEMORY and TYPECHECK to `scratchpad/calc/t6-tsc.txt`: exit 0.

- [ ] **Step 8: The after of the trade page's close.** One at a time: `node scripts/harness/shoot_page.mjs scratchpad/harness/pages/cell-gb-london-restaurants.html "#close" scratchpad/calc/shots/after-close 1280,768,375 > scratchpad/calc/after/shoot-close.txt 2>&1; echo "exit $?" >> scratchpad/calc/after/shoot-close.txt`. Read the three photographs beside Task 0's: four doors, each on its line, the pill last, no door cut.

- [ ] **Step 9: Commit.**

```bash
cd /e/atlas/website && git add src/lib/spine/copy.ts src/lib/spine/close_rows.ts src/components/spine/archetypes/Terminus.tsx src/components/spine/cell/exit.tsx src/components/spine/cell/cell-view.tsx src/components/spine/archetypes/stories.tsx scripts/verify_doors.ts scripts/verify_archetype_copy.ts tests/simulator/door.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md && git commit -F - <<'MSG'
calc:door: every trade page's close gains "Run your own numbers" with its place and trade, before the compare pill, four doors on the trade close alone; the door gate lands it on the calculator's masthead (plan 2026-10-13 cost-simulator, Task 6)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 7: The circular form leaves

**Files:**
- Delete: `src/components/CalculatorForm.tsx`
- Modify: `scripts/type_ladder_baseline.json`, `scripts/width_discipline_baseline.json` (by their gates' `--write-baseline`, the entries of the deleted file gone)
- Modify: `src/app/(site)/tools/page.tsx` (the hub card's comment), `src/lib/coverage/admin1.ts` (its comment)
- Test: `tests/simulator/page.test.ts` (append: the form is gone)

**Interfaces:**
- Consumes: Task 4B's page (the form's only importer, now gone).
- Produces: no file imports `CalculatorForm`; the baselines hold no entry for it.

- [ ] **Step 1: Write the failing check.** Append to `tests/simulator/page.test.ts`, before `  if (failed > 0) {`:

```ts
  /* THE CIRCULAR FORM LEAVES (Task 7): its file, its baselines' entries and every import of it. */
  const gone = !existsSync("src/components/CalculatorForm.tsx");
  const named = ["scripts/type_ladder_baseline.json", "scripts/width_discipline_baseline.json", "src/app/(site)/calculator/page.tsx", "src/lib/coverage/admin1.ts"].filter((f) => readFileSync(f, "utf8").includes("CalculatorForm"));
  check(`the circular form is deleted and nothing names it as present (${named.join(", ") || "none"})`, gone && named.length === 0, "src/components/CalculatorForm.tsx");
```

Run Task 4B's Step 2 command to `scratchpad/calc/t7.txt`. Expected: exit 1, the form still there.

- [ ] **Step 2: Delete it.** `cd /e/atlas/website && git rm src/components/CalculatorForm.tsx > scratchpad/calc/t7-rm.txt 2>&1; echo "exit $?" >> scratchpad/calc/t7-rm.txt`. Then `git grep -n "CalculatorForm" -- src scripts tests > scratchpad/calc/t7-grep.txt 2>&1; echo "exit $?" >> scratchpad/calc/t7-grep.txt`: the hits left are the two baselines, `admin1.ts:13` and `src/lib/format/money.ts:10`. The last is history in the past tense ("Before this consolidation ... .toFixed(2) in CalculatorForm"), true as written, and stays.

- [ ] **Step 3: The baselines fall.** `cd /e/atlas/website && node node_modules/tsx/dist/cli.mjs scripts/verify_type_ladder.ts > scratchpad/calc/t7-tl.txt 2>&1; echo "exit $?" >> scratchpad/calc/t7-tl.txt`, and the same for `scripts/verify_width_discipline.ts` to `t7-wd.txt`. Each reports its total shrank; then each with `--write-baseline` to `t7-tl-write.txt` and `t7-wd-write.txt`. `git diff --stat scripts/type_ladder_baseline.json scripts/width_discipline_baseline.json` to `t7-baselines.txt`: only falling numbers and the deleted file's entries gone; a rising number stops the task and goes to the controller.

- [ ] **Step 4: The comments say what stands.**
  - `src/app/(site)/tools/page.tsx`: the comment inside the calculator card, from `    /* The title read "Run your exact rent, payroll, and concept" and promised` to `       promise the calculator's own h1 makes. */`, becomes:

```tsx
    /* The cost simulator since plan 2026-10-13 (the circular form left that day): a place and a trade, then the team, the premises, the sales, the
       owner's own pay and a loan, every default with its source. The title is the promise the page keeps: the sales to break even, and, with the
       owner's pay set, whether the owner gets paid. The card stands as the spec asks (its route, canonical, hub card and footer links). */
```

  - `src/lib/coverage/admin1.ts`: `// NavigatorForm and the CalculatorForm. A node:fs read would break the client` becomes `// NavigatorForm (the calculator's old form imported it too until 2026-10-13). A node:fs read would break the client`.

- [ ] **Step 5: Run it to see it pass, and the build's reach.** Task 4B's Step 2 command: exit 0. GATES `--only=calc-page,type-ladder,width-discipline,counts-fresh` to `scratchpad/calc/t7-gates.txt`: exit 0. MEMORY and TYPECHECK to `scratchpad/calc/t7-tsc.txt` (CLAUDE.md: run it after any deletion): exit 0.

- [ ] **Step 6: Commit.**

```bash
cd /e/atlas/website && git add -u src/components/CalculatorForm.tsx scripts/type_ladder_baseline.json scripts/width_discipline_baseline.json "src/app/(site)/tools/page.tsx" src/lib/coverage/admin1.ts tests/simulator/page.test.ts && git commit -F - <<'MSG'
calc:retire: the circular calculator form leaves (its file, its baselines' entries, the comments that named it as standing); the hub card stands over the simulator (plan 2026-10-13 cost-simulator, Task 7)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 8: The written rules say what the gates hold

Written for Q3 and Q4 answer A; under another answer the controller rewrites the two rows it names before this task runs.

**Files:**
- Modify: `E:/atlas/design/loop/build/briefs/MODEL.md` (8.6's `15 close` row and its doors paragraph; a new 8.10, the calculator's spine; PART 10's provenance line)
- Modify: `E:/atlas/website/docs/design-system/GUIDELINES.md` (section 0.7, four rows)

**Interfaces:**
- Consumes: every gate Tasks 1 to 7 wired (`calc-engine`, `calc-defaults`, `calc-api`, `calc-display`, `calc-page`, `calc-state`, `calc-door`) and the four-door trade close.
- Produces: written rules that name those gates; nothing a gate reads.

- [ ] **Step 1: The gates the rules will name exist.** `cd /e/atlas/website && git grep -n 'name: "calc-' -- scripts/prebuild_all.ts > scratchpad/calc/t8-gates.txt 2>&1; echo "exit $?" >> scratchpad/calc/t8-gates.txt`. Expected: seven lines (engine, defaults, api, display, page, state, door), exit 0. A missing one stops the task: its task is not done.

- [ ] **Step 2: MODEL.md, the trade close and its doors.** In `E:/atlas/design/loop/build/briefs/MODEL.md`:
  - the `15 close` row: `` `Terminus`: three doors (its cap), the pill last (M21): `` becomes `` `Terminus`: four doors since 2026-10-13 (the cap the trade close alone raises; plan 2026-10-13 cost-simulator, Q3), the pill last (M21): ``, and after `up to the city page, "Opening a business in {city}";` insert ` to the calculator, "Run your own numbers", with the page's place and trade (`/calculator?country=..&city=..&trade=..`, landing on the sales to break even; a region's or a council's page carries its country alone);`.
  - THE DOORS paragraph: `and the compare pill (`/compare`).` in its `15 close` sentence becomes `the calculator with the page's place and trade ("Run your own numbers", landing on the sales to break even, since 2026-10-13), and the compare pill (`/compare`).`
  - PART 10's line that begins `- **A figure says where it came from**:` : `(counted, worked out, looked up, estimate, the register ledger's words)` becomes `(counted, worked out, looked up, estimate, the register ledger's words; and "yours", a figure the reader set on /calculator, since 2026-10-13, never one of the four)`.

- [ ] **Step 3: MODEL.md, the calculator's spine.** Before the line `## PART 9. WHAT THE MODEL FORBIDS` insert:

```markdown
### 8.10 The cost simulator, /calculator. Seven blocks since 2026-10-13 (plan 2026-10-13 cost-simulator; spec docs/superpowers/specs/2026-10-13-cost-simulator-design.md, section 4), this order, every place and trade the calculator resolves

| Row | Block | What it holds | Seat |
|---|---|---|---|
| `00 masthead` | What your business costs | The h1 and three native pickers on 48px fields: the country, the city or anywhere in it, the trade. A band, no block. | the first zone, wide |
| `01 answer` | Sales to break even | The page's one 40, the sales to break even a month, `--terra-text`; a day at 16, customers a day, the firms above it with the signal where twenty firms or more are placed; the sales for the reader's profit goal when set; one basis. Its reason in its place where an input is empty. | the instrument, the right column from 1024, first |
| `02 margin` | Your margin | The margin at the reader's sales before tax at 30, placed by those sales among the place's firms (the signal); after tax in the UK. "Type your sales to see this." where none are held. | the instrument, the right column, second |
| `03 numbers` | Your numbers | The page's one card (the reader operates it, 10.4): the fixed costs a month at 30; Team (steppers), Premises, Sales, You, Loan, each lever a slider beside a typed figure with its line, the lever in hand showing the break-even beside it. | the instrument, the left column from 1024, spanning its three rows |
| `04 month` | Your month | The profit a month at 30; one bar (costs per sale, fixed costs, profit, the break-even ticked, the costs running past the sales at a loss); the bill as fact rows in a switch for a month or a year, words and figures only. | the instrument, the right column, third |
| `05 moves` | What moves it most | RankedBars: each input up a tenth or one more hire, the five largest rises, the leader's bar `--terra`; its focal the sales each 100 of fixed costs needs, `--terra-text`. | the next band, its left two thirds |
| `06 opening` | Money to open it | The months to pay back at 30, none at a loss; the opening bill as fact rows (the cell's held bill, else fit-out, deposit and registration, else the trade's archetype at the city's prices). | the last band, the left half |
| `07 sources` | Where figures come from | NoteList, five notes at most, the page's one prose section, "Your figures" first once the reader sets one. | the last band, the right half |

THE BAR LEDGER: two cards, `04 month` and `05 moves`, in two columns of consecutive bands (the instrument's right column, the next band's left two thirds); no third (Q4 answer A: the team rows are steppers, the opening bill is rows, no phase bar). THE THREE LOUD MOMENTS: `01 answer` LIT, `05 moves` LIT, the third NO HONEST CANDIDATE (`calculator-view.tsx` LOUD_SEATS). THE DOORS: the page draws none; every trade page's close carries "Run your own numbers" to it (8.6 `15 close`). A block with nothing to draw is not drawn, and the zones close up so no two lone zones stand together. Gates: `calc-engine`, `calc-defaults`, `calc-api`, `calc-display`, `calc-page`, `calc-state`, `calc-door`, and every render law over `calculator-gb-london-restaurants`.
```

- [ ] **Step 4: GUIDELINES.md, the rules and their gates.** In `docs/design-system/GUIDELINES.md` section 0.7, after the row that begins `| No unknowable metric asserted as a figure,` add:

```markdown
| A figure the reader set carries the kind word "yours" (the fifth beside the ledger's four); an output resting on one keeps its own kind and says "your figures" in its line. | `provenance` (the five words), `calc-engine`, `calc-page` | 2026-10-13 |
| The calculator's break-even is F / (1 - v): every fixed line and the owner's pay in F, never a share of the sales it answers; a loss prints as a loss with a true minus, and no payback stands at a loss. | `calc-engine`, `calc-display` | 2026-10-13 |
| A default the place lacks falls back a level and says so ("Berlin holds none. This is Germany's."), or stands empty with its line; never a file's fallback row, the 42/10/5 ladder or the 80,000 archetype. | `calc-defaults` | 2026-10-13 |
| The trade close holds four doors, "Run your own numbers" before the compare pill, with the page's place and trade; every other terminus holds three. | `calc-door`, `archetype-copy`, `doors` | 2026-10-13 |
```

- [ ] **Step 5: Read both files back.** `cd /e/atlas && git diff --stat design/loop/build/briefs/MODEL.md > website/scratchpad/calc/t8-model.txt 2>&1; echo "exit $?" >> website/scratchpad/calc/t8-model.txt` and the same for the website's GUIDELINES.md to `scratchpad/calc/t8-guide.txt`. Open each file with the Read tool at its changed lines: no em-dash, and every gate named is one of Step 1's seven or a gate already in the chain.

- [ ] **Step 6: Commit, one commit in each repository.**

```bash
cd /e/atlas && git add design/loop/build/briefs/MODEL.md && git commit -F - <<'MSG'
calc:rules: MODEL 8.10, the cost simulator's spine (seven blocks, its bar ledger and loud moments), the trade close's four doors with "Run your own numbers", "yours" the fifth provenance word (plan 2026-10-13 cost-simulator, Task 8)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
cd /e/atlas/website && git add docs/design-system/GUIDELINES.md && git commit -F - <<'MSG'
calc:rules: GUIDELINES 0.7 names the calculator's rules and their gates (the fifth kind word, F / (1 - v), the fallbacks without a fill, the trade close's four doors) (plan 2026-10-13 cost-simulator, Task 8)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
MSG
```

---

### Task 9: Verification (spec section 5)

Spec section 5: "renders and photographs at 375, 768 and 1280, every browser check, the chain, the build, and after his deploy word a production probe." Nothing here changes code; a fault found goes back to its task as one fix and one rerun, and the report names it.

**Files:**
- Create (scratch, never committed): `scratchpad/calc/probe.mjs`, `scratchpad/calc/after/*`, `scratchpad/calc/shots/after-*`

**Interfaces:**
- Consumes: everything above; `npm run verify:deploy` (CLAUDE.md: the chain serially, `--build` adding the Next build and the postbuild guard); `npm run deploy:watch`.
- Produces: the report: the before and after, the hand-worked break-even the page prints, every gate's result, the photographs read.

- [ ] **Step 1: The renders.** MEMORY before each, one at a time: RENDER `calculator gb london restaurants` (the chain's), then the same command with `calculator de berlin restaurants`, `calculator gb manchester barbershops` and `calculator gb anywhere restaurants`, each to `scratchpad/calc/t9-render-<n>.txt` with exit 0, each html copied to `scratchpad/calc/after/`. Each ad hoc view through the zone and copy laws on its own: `node scripts/harness/check_copy_plain.mjs scratchpad/calc/after/calculator-de-berlin-restaurants.html > scratchpad/calc/t9-copy-berlin.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-copy-berlin.txt` and the same for Manchester and anywhere in the UK. Expected: exit 0 on each (a LINES or BANNED red on a view the chain does not render is still a fault, fixed in its section).

- [ ] **Step 2: The photographs.** One browser at a time, nothing beside it: `node scripts/harness/shoot_page.mjs scratchpad/calc/after/calculator-gb-london-restaurants.html "main" scratchpad/calc/shots/after-london 1280,768,375 > scratchpad/calc/t9-shoot-london.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-shoot-london.txt`, then Berlin, Manchester and anywhere in the UK the same way. Read every picture: on a phone the answer stands above the levers and the 40 is the only terracotta figure besides the moves' focal; from 1024 the levers stand left of the answer, the margin and the month; no field, door or figure is cut; no sideways scroll at 375; the month's bar draws its three parts with the break-even ticked; Berlin's margin, month and payback show "Type your sales to see this."; Manchester carries a rates line and no staff line (England's rows off the model).

- [ ] **Step 3: The browser checks, against the local production build.** The build first: MEMORY (1150 MB or more; the build and tsc need their 4 GB heap: wait and check again, never close an application), then `cd /e/atlas/website && npm run verify:deploy -- --build > scratchpad/calc/t9-deploy.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-deploy.txt`. Expected: exit 0 and `scratchpad/deploy/chain.txt` reading every gate green (read the file, never a pipe). Then the server in the background (`npm run start` from E:/atlas/website, run_in_background), then write `scratchpad/calc/probe.mjs`:

```js
// scratchpad/calc/probe.mjs (plan 2026-10-13 cost-simulator, Task 9): the cost simulator in one real browser against the local production server. Not
// committed. usage: node scratchpad/calc/probe.mjs http://localhost:3000 > scratchpad/calc/t9-probe.txt
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:3000";
const lines = [];
let reds = 0;
const say = (ok, line) => { lines.push(`${ok ? "ok" : "x "} ${line}`); if (!ok) reds++; };
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  const answer = () => page.locator("#answer [data-sim-figure] .fig").first().textContent();
  await page.goto(`${BASE}/calculator`, { waitUntil: "networkidle" });
  const first = await answer();
  say(!!first && first.startsWith("$"), `the bare page answers in dollars: ${first}`);
  say((await page.locator('meta[name="robots"]').count()) === 0 || !/noindex/.test((await page.locator('meta[name="robots"]').getAttribute("content")) ?? ""), "the bare page is indexable");
  say(((await page.locator('link[rel="canonical"]').getAttribute("href")) ?? "").endsWith("/calculator"), "its canonical is /calculator");

  /* Review Focus 2: the sales cleared. */
  const sales = page.locator('[data-lever-row="sales"] input[type="text"]');
  await sales.fill("");
  await sales.blur();
  await page.waitForTimeout(400);
  say((await page.locator('#margin [data-reason="no-sales"]').count()) === 1, "cleared sales: the margin waits for them");
  say((await page.locator("#answer [data-sim-figure]").count()) === 1, "cleared sales: the break-even still prints");
  say(page.url().includes("v=sales:"), `the address keeps the cleared field: ${page.url()}`);

  /* Review Focus 5: a currency switch mid-session. */
  const rent = page.locator('[data-lever-row="rent"] input[type="text"]');
  await rent.fill("2000");
  await rent.blur();
  await page.waitForTimeout(400);
  const addr = page.url();
  for (const c of ["GBP", "USD"]) { await page.evaluate((code) => window.dispatchEvent(new CustomEvent("atlas:currency-change", { detail: code })), c); await page.waitForTimeout(300); }
  say((await rent.inputValue()) === "2,000" && page.url() === addr, `the typed rent survives a switch to pounds and back, the address unchanged (${await rent.inputValue()})`);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("atlas:currency-change", { detail: "GBP" })));
  await page.waitForTimeout(300);
  say(((await answer()) ?? "").startsWith("£"), `in pounds the answer is the law's own: ${await answer()}`);

  /* The lever in hand shows its effect beside it. */
  await page.locator('[data-lever-row="area"] input[type="range"]').focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(300);
  say((await page.locator('[data-lever-row="area"] [data-effect]').count()) === 1, "the floor space in hand shows the break-even beside it");

  /* Review Focus 4: an address out of range, and a place that is none. */
  const odd = await page.goto(`${BASE}/calculator?country=gb&city=london&trade=restaurants&v=area:-5,rent:abc,zz:1`, { waitUntil: "networkidle" });
  say(odd?.status() === 200 && (await page.locator('[data-lever-row="area"] input[type="text"]').inputValue()) === "5", "v=area:-5,rent:abc,zz:1 reads as the least floor space, the rest ignored");
  say(/noindex/.test((await page.locator('meta[name="robots"]').getAttribute("content")) ?? ""), "a view with parameters is noindex");
  const none = await page.goto(`${BASE}/calculator?country=xx`, { waitUntil: "domcontentloaded" });
  say(none?.status() === 404, `an unknown country answers 404 (${none?.status()})`);
  const api = await page.request.get(`${BASE}/api/calculator?country=de&city=berlin&trade=restaurants`);
  say(api.status() === 200 && (await api.json()).place?.city === "berlin", "the place switch's route answers Berlin");

  /* A place switch from the pickers. */
  await page.goto(`${BASE}/calculator`, { waitUntil: "networkidle" });
  await page.selectOption('form[data-sim-pick] select[name="country"]', "de");
  await page.waitForResponse((r) => r.url().includes("/api/calculator"));
  await page.selectOption('form[data-sim-pick] select[name="city"]', "berlin");
  await page.waitForResponse((r) => r.url().includes("/api/calculator"));
  await page.waitForTimeout(400);
  say(page.url().includes("country=de&city=berlin&trade=restaurants"), `the pickers switch the place and the address follows: ${page.url()}`);

  /* The door, from London's restaurant page. */
  await page.goto(`${BASE}/gb/london/restaurants`, { waitUntil: "networkidle" });
  const door = page.locator('#close a[data-door]', { hasText: "Run your own numbers" });
  say((await door.getAttribute("href")) === "/calculator?country=gb&city=london&trade=restaurants", "London's restaurant page carries the door with its place");
  await door.click();
  await page.waitForLoadState("networkidle");
  say(page.url().includes("/calculator?country=gb&city=london&trade=restaurants") && (await page.locator("#answer [data-sim-figure]").count()) === 1, "the door lands on the answer");

  /* From 1024 the levers stand left of the answer. */
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${BASE}/calculator`, { waitUntil: "networkidle" });
  const levers = await page.locator("#levers").boundingBox();
  const ans = await page.locator("#answer").boundingBox();
  say(!!levers && !!ans && levers.x < ans.x && Math.abs(levers.y - ans.y) < 200, "at 1280 the levers stand left, the answer right");
} finally {
  await browser.close();
}
console.log(lines.join("\n"));
process.exit(reds ? 1 : 0);
```

Run it: `node scratchpad/calc/probe.mjs http://localhost:3000 > scratchpad/calc/t9-probe.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-probe.txt`. Expected: exit 0, every line `ok`. Stop the server. The browser gates of the chain (Step 3's `verify:deploy`) ran before the server and never beside it.

- [ ] **Step 4: The report.** Write it to the controller (not a file in the repo): the task commits; Task 0's census counts; the hand-worked London break-even beside the page's (£556,017.36 a year, £46,334.78 a month, the dollars the bare page prints at the site's pound rate); Berlin's 1,095,484.12 dollars a year beside the page's; the before and after of the old page and the trade close (photographs named); every gate in `scratchpad/deploy/chain.txt` and the probe's lines; each red met on the way and its one fix; the questions Q1 to Q4 as answered and where each answer lives in the code.

- [ ] **Step 5: After his deploy word only: the production probe.** Never before it, and never a push or a deploy by this plan. When he has deployed: `cd /e/atlas/website && npm run deploy:watch -- --marker=data-sim-answer > scratchpad/calc/t9-watch.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-watch.txt`, then `node scratchpad/calc/probe.mjs https://www.marginatlas.com > scratchpad/calc/t9-prod.txt 2>&1; echo "exit $?" >> scratchpad/calc/t9-prod.txt` (one browser, nothing beside it). Expected: both exit 0; the report quotes the lines.

---

## Out of scope, noted

- Spec section 6, each later and each download his word: every London borough's and English local authority's rent, the recipe protocol on all 243 trades, a monthly cash curve with ramp and seasons, tax by legal form beyond the UK, energy use per trade, personal tax outside the UK, insurance premiums, licence fees in money, accounting, software and card-fee prices, register-grade shop rents outside England; the give-to-get exchange as the page's end.
- A sticky answer on a phone (spec section 7: not in this version); the phase bar and the opening bill as bars (Q4, written for A); the hire lever's bar on each team row (Q4).
- /tools/simulator (R7 4.4's other road): the calculator stays at its address and the hub card stands.
- The paywall: the calculator is free (the brief: "/calculator rebuilt, free"); `src/lib/monetization/free_paid_map.ts` is not touched.
- Scotland's income tax bands (the law module holds the rest of the UK's): Edinburgh and Glasgow print no after-tax figure and say so.
- A solved "other running costs" line calibrated to the trade page's net outside the UK (Q2, written for B).
- `src/components/spine2/Calc.tsx`, `calc-engine.ts` and `src/app/dev/calculator`: the /dev pages' prior art, untouched.
