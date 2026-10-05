# Phase D, steps 22 to 29: the four Pro-only sections on the UK page

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**Goal:** his ruling 28 (interview of 2026-09-26): "the first Pro-only sections: all four: the lease by law (item 73), one hire
all in (77), what failing costs you (76), opening as a foreigner (74)", each "through the data requirements and the harness like
any section". On `/gb`, each seated as a level after its chapter's first, so the paywall locks it by his ruling 18 with no
special case.

**Sources, all on disk (no download):**
- The research: `E:/atlas/design/loop/build/research/2026-10-02-pro-sections-uk-law.md` (as at 2 October 2026, tax year
  2026/27): section 77 (lines 11-148: formula 77.1, parameters 77.2, changes 77.3, worked examples 77.4 A and B), section 76
  (152-303: solvent closing 76.1, insolvency 76.2, disqualification 76.3, personal liability 76.4, redundancy 76.5, the lease on
  failure 76.6, bankruptcy, IVA and DRO 76.7, worked examples 76.8 A to E), section 74 (307-415: company and identity 74.1, no
  visa 74.2, routes with the Home Office fees of 8 April 2026 74.3, changes 74.4, worked examples 74.5 A to E), section 73
  (419-533). Every figure there carries a URL and a quote; every figure used carries both into its data file.
- The requirements: `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` items 73 (L737), 74 (L747), 76 (L767), 77 (L777), each
  with "What", "Needed for" (its form and seat) and "Done means".
- The law engine: `src/lib/uk/law/params_2026_27.ts` (class 1 secondary L50-57, pension L58-68, redundancy L108-117, minimum wage
  L118-124), `employer_cost.ts` (`annualGross`, `hireAllIn`), `redundancy.ts` (`statutoryRedundancyPay`,
  `statutoryNoticeWeeks`), `lease_tax.ts` (`leaseRentNpv`, `sdltOnLeaseRent`, `lttOnLeaseRent`), `business_rates.ts`; the
  London premises slice `data/uk/registers/premises.json` (rateable value per m² by category).
- The page: `/gb` chapters (copy.ts `chapters` L668-677): 01 What it costs to open, and to run (setup, staff, running, peers);
  02 Red tape, borrowing and getting paid (state, money); 03 What to open, and where; 04 The first years.

**Rules every section here obeys:** one figure at 30 (PART 4), labels of three words at most, one supporting line of at most
twelve words, no method word, no agency named on the card (each new source enters `src/lib/spine/uk_sources.ts` and the Sources
and licences page instead), money as the staff card prints it (computed money in dollars through the site's FX module, a law's
own amounts in pounds in its rows), `data-src` and `data-kind` on every figure, never the same figure printed twice on the page
(the insurance card already prints employers' liability: the hire section does not repeat it), a figure that needs a missing
input is withheld, not filled.

---

## Step 22: one hire, all in: the builder

**Files:** Create `src/lib/spine/sections/hire_all_in.ts`; Test `tests/spine/hire_all_in.test.ts`; Modify
`src/lib/uk/law/params_2026_27.ts` only where the research's parameter table 77.2 holds a value the module lacks (statutory sick
pay weekly rate, worked hours), each with its source line.

- [ ] **Test first** (rule `hire-all-in`), from the research's worked examples (77.4): at the National Living Wage, 37.5 hours,
  gross 24,784.50; all-in 25,340.84 with the Employment Allowance and 28,308.52 without; per worked hour 14.56 and 16.27 over
  1,740 worked hours (52 weeks of 37.5 hours less 28 days of holiday at 7.5 hours). Example B (30,000 a year): its all-in figures
  from 77.4. The parting bill (76.5 and 76.8 D): statutory redundancy (none under two years' service) plus statutory notice, at
  1, 3 and 10 years of service, for the same wage. Every expected value is the research's, in pounds, to the penny.
- [ ] **Build** `buildHireAllIn(params, { gross?: number, allowance: boolean })` returning
  `{ perWorkedHour: { gbp, usd, prov }, allIn: { gbp, usd, prov }, parting: Array<{ years: 1 | 3 | 10; gbp; usd; prov }>, extras: FactRow[] }`
  from `hireAllIn`, `statutoryRedundancyPay` and `statutoryNoticeWeeks`, never from a sentence. `extras`: statutory sick pay from
  day one (its weekly rate), employer pension 3% of qualifying earnings, the right-to-work fines (45,000 and 60,000 per worker,
  74.1 or 77.2, with the URL), holiday 5.6 weeks; each a law's own amount in pounds with provenance looked up. Dollars through
  the site's FX module (find it: `src/lib/finance/fx`), never a typed rate.
- [ ] **Run, wire** `hire-all-in`, counts, carriers. **Commit:** `22: one hire, all in: the worked hour and the parting bill from the law engine, tested against the research`.

## Step 23: one hire, all in: the section beside the staff card

**Files:** Create the section component (`src/components/spine/country/HireAllIn.tsx`, a `KvGrid` with a focal cell and the
metric row, as item 77's "Needed for" says: `08 hiring | 08b commits`); Modify `country-view.tsx` (the staff level becomes the
level of three, `1-1-1`: Hiring | employment | commits; if the level of three does not hold its PART 10.5 rules at 1024, a new
level after staff in chapter 01 holding commits alone at two thirds); Modify `copy.ts`, `uk_sources.ts` (new sources),
`COPY.locked.lines` (its locked line), the rail list.

- [ ] **The card:** title (at most four words, the visitor's question, e.g. "An hour, all in"); the 30 is the cost of one worked
  hour all in, in dollars; one line ("At the minimum wage, with the allowance."); rows: the parting bill at 1, 3 and 10 years and
  the extras. Icons from the registry (the opener's glyph; ICONS.md's grammar: an icon names a kind, never a value).
- [ ] **Harness:** re-render `country GB`; `harness-laws` (FOCAL: one 30; BLOCK FLOOR), `harness-page-laws` (ZONE SPLIT, the
  level's pairs), `harness-copy-plain`, `provenance` (the new figures stamped; the baseline only falls), `archetype-copy`,
  `loud-seats` (no new accent: the 30 is ink), `census-fresh` (write), `subsection-icons`, `uk-sources`, `no-source-agencies`.
- [ ] **Photograph** the level at 1280 and 375; look at it. **Commit:** `23: one hire, all in, seated beside the staff card`.

## Step 24: the lease, by law: the data and the builder

**Files:** Create `data/uk/law/lease_law.json`; Create `src/lib/spine/sections/lease_by_law.ts`; Test
`tests/spine/lease_by_law.test.ts`.

- [ ] **The data** from research section 73 (lines 419-533): each of item 73's fields the research answers for England and
  Wales (`break_first_months`, `deposit_months`, `review_rule`, `renewal_right` under the 1954 Act and contracting out,
  `repairs_norm`, `dilapidations` with the cap and the protocol's timetable, `assignment`, `guarantee_norm`, `legal_fee_local`,
  `vat_on_rent`, the s.25 and s.26 notice windows, compensation, the registration threshold), each with `value`, `source_url`,
  `quote`, `checked: "2026-10-02"`. A field the research does not answer is absent, not guessed.
- [ ] **The builder** `buildLeaseByLaw()`: "signed for" (item 73: the rent for the months to the first break, plus the deposit,
  the fees and the tax on the lease) for a stated unit: rent per m² from `premises.json`'s London shop row (the valuation's
  rateable value per m², an estimate of the rent and labelled so: provenance kind estimate), a unit size the card states (take it
  from the research if it states a typical small shop; otherwise 80 m² stated on the card as "for an 80 m² shop"), months to
  the first break and deposit months from the data, the legal fee from the data, the tax from `sdltOnLeaseRent`. Withhold
  "signed for" (item 73's "Done means") if any addend is missing. Clause rows from the data, each in plain words.
- [ ] **Test** (rule `lease-by-law`): the tax on the lease equals `sdltOnLeaseRent` for the same rent and term; "signed for"
  equals the sum of its addends; a missing addend withholds; every row carries a source URL.
- [ ] **Commit:** `24: the lease, by law: the clauses from the research and "signed for" from parts that are all held`.

## Step 25: the lease, by law: the section

**Files:** a section component (the twin of the country page's `05 premises`: `KvGrid` with a focal cell); `country-view.tsx`
(a new level in chapter 01 after "Running costs", alone at two thirds or paired by PART 10.5); `copy.ts`; `uk_sources.ts`; the
locked line; the rail list.

- [ ] **Harness:** re-render `country GB` (`bash scratchpad/reform/render_some.sh "country GB"`), write the census (`npx tsx scripts/harness/census.ts --write`), then run `harness-laws` (FOCAL: one 30 in the card; BLOCK FLOOR), `harness-page-laws` (ZONE SPLIT, the level's pairs at 1024), `harness-copy-plain`, `provenance` (every new figure stamped; the baseline only falls), `archetype-copy`, `loud-seats` (no new accent: the 30 is ink), `census-fresh`, `subsection-icons`, `uk-sources`, `no-source-agencies`, `no-em-dashes`, `paywall-levels`, and `paywall-shape` once step 20 has built it (the new level locks; the chapter's first level stays free).
- [ ] **Photograph** the new level at 1280 and 375 (`node scratchpad/reform/_shoot_sel.mjs`) and look at both before going on.
- [ ] **Commit:** `25: the lease, by law, seated in chapter 01`.

## Step 26: opening from abroad: the data and the builder

**Files:** Create `data/uk/law/opening_from_abroad.json`; Create `src/lib/spine/sections/from_abroad.ts`; Test
`tests/spine/from_abroad.test.ts`.

- [ ] **The data** from research section 74 (lines 307-415): who needs no visa (74.2); the routes that allow running a business
  (74.3: Innovator Founder, Youth Mobility, UK Expansion Worker, and sponsoring a hire), each with fee, health surcharge, funds
  to show, weeks to decide, years, and whether it allows self-employment; the trades a sponsored worker cannot fill (barbers,
  beauticians and cooks fall outside Skilled Worker, with the quote); company, address, identity and tax steps (74.1). Each with
  `source_url`, `quote`, `checked`. No difficulty score (item 74: the seed's `difficulty_0_100` is a coined index and goes).
- [ ] **The builder** `buildFromAbroad()`: the walls in the order a founder meets them (item 74), a `TiersTable` row each with its
  state (open, conditional, closed), cost and weeks; the 30 is "money to show before the first sale" for the Innovator Founder
  route (research example 74.5 A: the fees and the funds, per person), the second figure its weeks.
- [ ] **Test** (rule `from-abroad`): the 30 equals example A's sum; every row has a state and a source; the walls keep the order
  the research gives.
- [ ] **Commit:** `26: opening from abroad: the walls in order, priced and timed from the research`.

## Step 27: opening from abroad: the section

**Files:** a section component (`TiersTable` at `3-2`, the twin of `03 setup`, item 74's "Needed for"); `country-view.tsx` (a
new level in chapter 01 after the free "Registering" level); `copy.ts`; `uk_sources.ts`; the locked line; the rail list.

- [ ] **Harness:** re-render `country GB` (`bash scratchpad/reform/render_some.sh "country GB"`), write the census (`npx tsx scripts/harness/census.ts --write`), then run `harness-laws` (FOCAL: one 30 in the card; BLOCK FLOOR), `harness-page-laws` (ZONE SPLIT, the level's pairs at 1024), `harness-copy-plain`, `provenance` (every new figure stamped; the baseline only falls), `archetype-copy`, `loud-seats` (no new accent: the 30 is ink), `census-fresh`, `subsection-icons`, `uk-sources`, `no-source-agencies`, `no-em-dashes`, `paywall-levels`, and `paywall-shape` once step 20 has built it (the new level locks; the chapter's first level stays free).
- [ ] **Photograph** the new level at 1280 and 375 (`node scratchpad/reform/_shoot_sel.mjs`) and look at both before going on.
- [ ] **Commit:** `27: opening from abroad, seated after registering`.

## Step 28: what failing costs: the data and the builder

**Files:** Create `data/uk/law/if_it_fails.json`; Create `src/lib/spine/sections/if_it_fails.ts`; Test `tests/spine/if_it_fails.test.ts`.

- [ ] **The data** from research section 76 (lines 152-303): item 76's fields for England and Wales: `discharge_months`
  (bankruptcy, 76.7), `home_protected`, `wrongful_trading` (76.4), `disqualification_years_max` (76.3), `liquidation_cost_local`
  and `liquidation_months` (76.2: the creditors' voluntary liquidation's median fees against its median assets, and what
  creditors receive), the solvent close (76.1), the personal guarantee surviving the company (76.6), the director's loan charge
  (76.8 C), the Debt Relief Order's threshold (76.7). Each with `source_url`, `quote`, `checked`. No ease score (item 76:
  `closing.ease_0_100` is coined and goes).
- [ ] **The builder** `buildIfItFails()`: the 30 is the months until a failed sole trader's debts are discharged; cells for the
  rest. Rule 64 and the page's other cards: the free chapter 02 paperwork card already prints the solvent strike-off ("To
  close", `rules.json` GB.closing); this section does not print that figure again.
- [ ] **Test** (rule `if-it-fails`): the 30 equals the research's months; worked examples 76.8 A to E reproduce from the data;
  no figure equals one the paperwork card prints.
- [ ] **Commit:** `28: what failing costs: the owner's exposure from the insolvency rules, tested against the research's examples`.

## Step 29: what failing costs: the section, and the four closed in the ledgers

**Files:** a section component (`KvGrid` with a focal cell, "If it fails"); `country-view.tsx` (a new level in chapter 02 after
"Borrowing"); `copy.ts`; `uk_sources.ts`; the locked line; the rail list; `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md`
(items 73, 74, 76, 77: status "BUILT for GB, 2026-10-05", the other countries still open); `QUEUE.md` (`country:lease`,
`country:foreigner`, `country:hiring-plus` DONE for GB; `country:collect-fail` half: item 76 done, item 75 open).

- [ ] **Harness:** re-render `country GB` (`bash scratchpad/reform/render_some.sh "country GB"`), write the census (`npx tsx scripts/harness/census.ts --write`), then run `harness-laws` (FOCAL: one 30 in the card; BLOCK FLOOR), `harness-page-laws` (ZONE SPLIT, the level's pairs at 1024), `harness-copy-plain`, `provenance` (every new figure stamped; the baseline only falls), `archetype-copy`, `loud-seats` (no new accent: the 30 is ink), `census-fresh`, `subsection-icons`, `uk-sources`, `no-source-agencies`, `no-em-dashes`, `paywall-levels`, and `paywall-shape` once step 20 has built it (the new level locks; the chapter's first level stays free).
- [ ] **Photograph** the new level at 1280 and 375 (`node scratchpad/reform/_shoot_sel.mjs`) and look at both before going on.
- [ ] **The four together:** with all four sections seated, run `paywall-shape` on the locked `/gb`: the four new levels lock,
  every chapter's first level stays free.
- [ ] **Commit** both repos: `29: what failing costs, seated in chapter 02; the four Pro sections built for the UK`.
