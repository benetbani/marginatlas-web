# R5. The country page: what is drawn, who it serves, and one model every country fills

2026-10-13. Read-only research for the strategic pages goal, answering the owner's critique of /gb read on a phone.
Code read at website `main` c35e42a7 (live since 2026-10-12, so the fetched pages and the code agree). Live pages fetched
2026-10-13 about 03:45Z: /gb, /kh, /af, /bo (4 of the 20 allowed requests). Phone shots read as images: website
`scratchpad/rhythm/shots/before-country-{GB,DE}-{top,ch02,ch02body,foot}-375.jpeg` and the measurement files beside them in
`scratchpad/rhythm/before/` (rhythm plan Task 0, 2026-10-12). Nothing was rendered for this report.

Short names: **cv** website `src/components/spine/country/country-view.tsx`; **hb** `src/lib/spine/hero_board.ts`; **HB**
`src/components/spine/archetypes/HeroBoard.tsx`; **copy** `src/lib/spine/copy.ts`; **M** `E:/atlas/design/loop/build/briefs/MODEL.md`;
**FV** `E:/atlas/rules/FOUNDER-VERDICTS.md`; **G** website `docs/design-system/GUIDELINES.md`. Text in double quotes taken from a
page is that page's fetched text.

## 0. The answers

- **Journey:** orient, the market, to open, to run, to last, the rules, next (section 4).
- **Misplaced on /gb:** the rule changes (zone 2 of 18, before any cost), opening from abroad, the lease law, if it fails (in the
  money chapter, far from survival), what London's trades take (zone 12: the market's answer comes after failure law), the job
  market (beside people by age, not beside staff), what locals know (repeats two figures already printed).
- **Would Cambodia fill roughly the same: partly.** /kh draws 15 blocks to /gb's 30; 17 of /gb's blocks have no Cambodian data,
  because 18 of the 27 fact families exist on GB.json alone; and shared slots switch answer type ("18%" in /gb's hero, "Not known
  yet" in /kh's).
- **Category model:** 16 slots in 7 stages, one answer type each; under it /kh fills 11 of 16 in the UK's form.
- **Three changes:** one answer type per section; the journey order with the UK's deep sections folded into their slot's plus; a
  direction cue (easier or harder for an owner) on every placed figure.

## 1. /gb as drawn today, top to bottom

Only the UK takes the "rich" branch: its test needs London's trade sales, built for GB alone (cv:1473, cv:1478), and six more
builders are GB-only by code (cv:1510-1520). 18 zones, 30 blocks (Task 0 `check_model_laws.txt`: "BLOCK FLOOR: 30 blocks").
Answer: N one number, W words, L a list of rows, C a chart. Kind: **CAT** a slot whose form, labels and data any country can fill;
**CAT-GB** a category form whose data the UK alone holds; **DEC** UK-specific content (UK law concepts, labels or keys typed for the
UK), which another country would need rewritten.

| # | Chapter | Section(s) | Job: the visitor's question | Answer | Kind | Code |
|---|---|---|---|---|---|---|
| 1 | none | The tax burden (masthead) | What does the state take from my profit? "18%", six placed figures | N + L ("Easy" among numbers) | CAT (UK figure from the UK law engine, hb:208-209) | cv:1672 |
| 2 | none | Rule changes coming; Recent rule changes | What changed, what is coming? 4 + 4 dated rows, "+ 30 more changes" | dated pairs | CAT-GB (lead keys typed for the UK, cv:691) | cv:1673-1677 |
| 3 | 01 What it costs to open, and to run | Registering, by legal form; The bill to register | What does opening cost, how long? | table; N + steps | CAT | cv:1678-1684 |
| 4 | 01 | Opening from abroad | Can a founder from abroad open here? "$8,572", 8 rows | L (£, $, days, words) | DEC | cv:1687 |
| 5 | 01 | What staff cost; Employing people; An hour, all in | What does a hire cost, what do I owe staff? | N + L; N + L; N + L | CAT core with DEC rows (cv:1602-1607); An hour, all in: DEC | cv:1688-1705 |
| 6 | 01 | Running costs; Insurance | What does staying open cost? | N + track + L; N + L | CAT core, DEC rows (cv:1646-1650); DEC | cv:1706-1716 |
| 7 | 01 | The lease, by law | What does the law give a tenant? "6 months", 11 rows | L (words, durations, %, $) | DEC | cv:1719 |
| 8 | 01 | Against the peers | Is the UK a better deal than four peers? | table | CAT (51 of 195, cv:419) | cv:1720 |
| 9 | 02 Red tape, borrowing and getting paid | Dealing with the state; Legal and admin costs | How does the state behave? What do I file, when? | poles; N + L | CAT; CAT core, DEC rows | cv:1721-1730 |
| 10 | 02 | Borrowing; Getting paid | What does credit cost? How do customers pay? | N + track + lever; ring + L | CAT core, DEC rows; CAT-GB | cv:1731-1739 |
| 11 | 02 | If it fails | What does failing cost me? "12 months", 8 rows | L (words, £, months, %) | DEC | cv:1742 |
| 12 | 03 What to open, and where | What London's trades take | Which trades make money? "$220K", 7 bars, "+ 9 more trades" | N + C | DEC (a London register on a country page, cv:777-801) | cv:1743-1751 |
| 13 | 03 | People by age; The job market | Who buys? Can I hire? | N + C; N + C | CAT-GB | cv:1752-1754 |
| 14 | 03 | The cities; What locals know | Where in the country? What do locals know? | city doors; 2 notes | CAT; CAT-GB | cv:1755 |
| 15 | 03 | What households spend on; Dealing with people | Where does household money go? How do people deal? | N + share bar; poles | CAT | cv:1756 |
| 16 | 04 The first years | Who is still trading; What holds firms back | Will it last? What hurts most? | N + curve; N + bars | CAT-GB (survival.json:91 "place": "the UK") | cv:1757-1767 |
| 17 | 04 | Where new firms last; Which trades fail most | Which cities and trades last? | N + bars | CAT-GB (cv:1519-1520) | cv:1773-1782 |
| 18 | none | Where to next | Where now? three doors | doors | CAT | cv:1783 |

**Where the rule changes sit.** Twice. (a) As a block in zone 2, outside every chapter, between the answer and the first cost
(cv:1673-1677: "THE HOT STUFF FIRST (his word of 2026-10-04) ... right under the answer, before the costs it changes"). His words
that day did not place them: "there has to be some context below, there has to be some hot stuff, some gold nuggets" (FV:1239),
and the binding reading put that context "under each section's drawing, never a line of sentences" (FV:1245). The block at the top
was the spec's choice, "a section of its own after the masthead" (website `docs/superpowers/specs/2026-10-04-uk-page-reform-design.md:173`).
(b) As standing rules in the rows of seven sections (country_rules.ts `ruleRows` and `ruleValue`: staff cv:1602-1607, employing
cv:1637-1645, premises cv:1646-1650, insurance cv:728-742, filings and closing cv:1651-1668, borrowing cv:645-649, payments
cv:755-758), one of them already dated on its own row: "Unfair dismissal 6
months from 1 Jan 2027 ... 2 years" (cv:1620-1628). On a phone the block is the second screen: the masthead card alone is 885px
tall at 375 (`shoot-country-GB-top.txt`), and the block opens on "Unfair dismissal 2 years to 6 months", "Sole-trader digital
records over £50,000 to over £30,000", "Tribunal claim limit 3 months to 6 months".

Side finding: the desktop rail lists "Time to sell" (cv:1540, unconditional) though /gb draws no exit card (cv:1750 draws it only
with data; the fetched /gb has no `#exit`): a dead link at 2xl.

## 2. Cambodia, Afghanistan, Bolivia through the general branch

Every other country takes the general branch (cv:1824-1963): up to 9 zones (8 on /kh, /af, /bo, the empty peers zone filtered,
cv:1923), three chapters named differently from the UK's four ("Where to open it, and what to open", "What the place is like",
copy:686-687, against "Red tape, borrowing and getting paid", "What to open, and where", "The first years", copy:689-692). M 10.2
sanctions the split (M:1030) against M PART 1: "The order is fixed for every country and every city, so a person who has read one
page has read all of them" (M:55).

| /gb block | /kh | /af | /bo |
|---|---|---|---|
| The tax burden | same board, answer "Not known yet", 6 rows | same, "Not known yet", 5 rows | same, "Not known yet", 5 rows |
| Registering; the bill | same forms; steps are sentences: "Reserve the company name in Khmer on the CamDX business registration portal" | table a seat: "We don't have this country's legal forms and their costs yet."; bill "$50" | table same; bill "No reliable figure for the bill yet. No reliable count of the days yet." beside a table printing "LLC $400 30 days" |
| Running costs | other form: "$0.11 a kilowatt hour Low", "Cost of living 10/100 Low" | electricity, then "No living costs yet: we cover no city here." | as /af |
| What staff cost | other form: "$2,160", "7% employer's share", two shares | as /kh | as /kh |
| The cities | other form (one city takes the row form, M:371): "Phnom Penh $4,560" beside "What customers earn Typical $4,800" | seat: "No city here yet. Nearby: Delhi, Dhaka and Mumbai." | seat |
| What London's trades take | seat: "We don't have profit figures for everyday shops here yet." | seat | seat |
| What locals know; Against the peers | two seats: "We don't have local tips ...", "We don't have countries to compare this one with yet." | seats | seats |
| Dealing with the state; with people | same form | same | same |
| What households spend on | other form (ranked rows, cv:1372-1393; GB a share bar, cv:804-820) | as /kh | as /kh |
| Where to next | same | 2 doors | 2 doors |
| not on /gb | What customers earn; Time to sell | both | both |
| /gb's other 17 blocks | absent | absent | absent |

/kh: 15 blocks, 6 in /gb's form, 4 in another form, 3 seats, 2 that /gb does not draw; 17 of /gb's 30 have no counterpart (both
change runs, from abroad, employing, an hour all in, insurance, the lease, legal and admin costs, borrowing, getting paid, if it
fails, people by age, the job market, the first years, what holds firms back, where new firms last, which trades fail most).
Absence printed as words: 4 lines on /kh, 7 on /af, 8 on /bo (the hero's "Not known yet" and each "We don't have" or "No ... yet").

**Why.** Of the 27 fact families on `data/facts/country/*.json` (198 shards, placeholders excluded, counted for this report), 9
are on 197 or 198 shards (tax_burden, risk_exit, economic_profile, costs, cities, character, setup, people_pay, income) and 18 are
on GB.json alone (employment, financing, payments, insurance, closing, admin, admin_load, licensing, grants, immigration, premises,
tax_detail, sector_mix, seasonality, infrastructure, exporting, demand, competition). The ten `data/sections/*.json` files opened
(changes, rules, payments, household_spend, survival, job_market, people, thresholds, local_apps, market_hold) hold the UK alone.

**The owner's question.** Partly. The frame reads the same (masthead form, registering, the bill, the two spectra, the close);
the body does not, the chapters carry other names, and a shared slot changes answer type: a number in /gb's hero, words in /kh's
("Total effective tax burden Not known yet"; HB:127-129, copy:66), because the hero reads the regime file, held for 58 of 195
(cv:147, hero_facts.ts:80-89). Step names come verbatim from each shard (howto_steps_rows.ts:12, 82), so the UK's read as labels
("Register the company") and Cambodia's as sentences. That is the failure his law of 2026-09-20 names: "labels and categories,
defined once and replicated across countries with small differences; never a sentence generated per country" (FV:1163; M:347).

## 3. Mobile at 375

### 3a. Stacking and alignment faults

1. **Length.** /gb at 375 ends at 16,728px (close card at y 16,533, height 195, `shoot-country-GB-foot.txt`): about 20 screens of
   812. Chapter 02 starts at y 7,739 (`shoot-country-GB-ch02.txt`): the answer, the changes and chapter 01 take 9.5 screens.
2. **Dense, and dense the same way as on a desktop.** Task 0 counted 905 gaps inside /gb's sections, 798 of them (88%) at 12px or
   less, 105 glyph tiles (75 inside rows) and 28 section titles (`measure.txt`, `explore.txt`), and every inner gap at 375 equal to
   1280 ("lines at 375 identical to 1280: yes", `summary.txt`). A fact row is a 28px tile, a label, a note under it and a figure
   (FactRows.tsx:8-16); at 343px the notes wrap ("after the period, with payment" on two lines, shot `before-country-GB-ch02body-375`).
3. **Three-line changes.** Under 420px a change row is the date on one line, the item and values on the next, values past 22
   characters on a third (DatedChanges.tsx:11-13, 42-47). Eight such stacks fill the page's second screen.
4. **A ragged figure column in the masthead.** Value and unit share one right-aligned span (HB:150-154), so the digits end at
   different points: "71 /100", "84 /100", "1 day", "Easy", "$4,315 /mo", "$133" (shot `before-country-GB-top-375`), against PART
   5's "THE UNIT. Said once, in the column head" (M:181). The marks column has a hole on the word row (HB:155-159).
5. **Three left edges.** Open sections take no padding (`src/app/globals.css:1336-1342`), an instrument inside one 12px on a phone
   (globals.css:1343-1347), the masthead card 20px (`p-5`, `shoot-country-GB-top.txt`): content starts 16, 28 and 36px from the
   glass on one page.
6. **Centred against left.** The close stacks two left-aligned door rows over a full-width pill whose words are centred ("Compare
   the United Kingdom with other countries", Terminus.tsx:20, shot `before-country-GB-foot-375`).
7. **City cards out of line.** Some cards carry a region line and others none, long names wrap ("Munich" over "Bavaria" beside
   "Frankfurt am Main" on two lines, shot `before-country-DE-ch02body-375`; M:371 records the mixed sub-line on GB), and the unit sits
   under the grid, away from the figures ("A typical customer's pay, a year.").
8. **One figure three times in three screens:** "$133" in the masthead, the legal-form table and the bill (cv:885-891 explains it).
9. **Marks without direction.** "Marks rank the countries." (copy:361). On /gb one bar marks "Days to register 1 day" and "Register
   a company $133" (both good) and three mark "Clean dealing 71 /100" (good); on Germany three bars mark "Register a company $1,150"
   (bad) and "Clean dealing 75 /100" (good) (shots `before-country-GB-top-375`, `before-country-DE-top-375`). By design: "The level
   says where the figure stands and nothing about good or bad" (hb:41-46; HB:177-181).

The chain passed all of it: country-GB@375 "30 cards, 0 red(s)" (`check_page_laws.txt`), "0 readability red(s)"
(`check_readability.txt`). Those gates measure holes, gaps and focal sizes; they cannot see a word in a figure column, a mark's
direction, or a section's place in a visitor's sequence.

### 3b. Where a section mixes word answers with number answers (fetched /gb unless named)

| Section | The column as printed | Mixed | Code |
|---|---|---|---|
| Masthead | "71 /100", "84 /100", "1 day", "Easy", "$4,315 /mo", "$133" | numbers, a word | hb:188-191 |
| Masthead, thin | "Total effective tax burden Not known yet" (/kh, /af, /bo) | words in the number's place | HB:127-129 |
| Opening from abroad | "£100, 1 day", "Depends", "£0", "21 days", "Depends", "Depends", "$2,510", "Closed" | words, £, $, days | FromAbroad.tsx:30-36 |
| The lease, by law | "By law", "14 days' warning", "6 to 12 months", "15 years", "1 x rateable value", "Capped", "20% if opted", "$852" | words, durations, a multiple, %, $ | lease_by_law.ts:93-109 |
| If it fails | "Can be sold", "Under £50,000", "£12,937", "23 months", "No cap", "2 to 15 years", "Survives", "35.75%" | words, £, months, years, % | if_it_fails.ts:45-60 |
| An hour, all in | "$632", "$3,793", "$13K", "£45,000", "£22,530" | two currencies | hire_all_in.ts:77-78 |
| Employing people | "48 hours", "£123.25 a week", "2 years", "39 weeks", "1 week", "28 weeks", "8 days" | durations, money | cv:1620-1645 |
| Legal and admin costs | "9 months", "12 months", "9 months, 1 day", "1 month, 7 days", "£150 to £1,500" | deadlines, money | cv:1653-1664 |
| Running costs | "$0.32", "$2.59/L", "£12,000", "43.2p", "38.2p" | $, £, pence | cv:1646-1650 |
| Getting paid | "1.69% to 1.75%", "Next day", "8%", "8% over Bank Rate", "30 days" | %, a word, days | cv:752-759 |
| Time to sell (/kh) | "8 months", "18 months", "93 of 198", then "Buyers are few, and a sale can take a year or more." | numbers, a sentence | cv:1331-1342 |
| The bill (/bo) | "No reliable figure for the bill yet." beside a table printing "$400" and "30 days" | words beside numbers | copy:544 |

PART 5 already forbids the word rows: "A LABEL NEVER STANDS WHERE A NUMBER GOES" (M:199; G:99, gated for mark lists only), and one
unit per column (G:97, whose UNIT MIX check reads only `[data-col]`). The currencies split by law: "A rule prints in the law's
currency and unit ... a comparison across the world keeps the site's dollars" (M:1049; clause 72, M:1075), so a list that mixes a
rule and a comparison mixes currencies by construction.

## 4. The visitor's mental cycle

### 4a. The stages (his example tested; kept, with three amendments)

| Stage | The visitor's question | What the visitor is ready for there |
|---|---|---|
| 1 Orient | What is this country like for a small business? | one answer and a few placed figures, each with a direction |
| 2 The market | Is there money here, and where? | customers' pay by city, what households spend on, what trades take |
| 3 To open | What does opening take? | forms, the bill, its steps and days; licences and from-abroad one tap down |
| 4 To run | What does staying open cost? | staff, power and premises, credit and card fees, filing deadlines; then the peers |
| 5 To last | Will it survive, and what if it does not? | survival, what holds firms back, time to sell, the cost of failing |
| 6 The rules | Which rules bind me, how are they applied, what is changing? | how the state and people deal, standing law, dated changes |
| 7 Next | Where do I go from here? | cities, trades, compare, how to open |

Amendments: (a) stage 2 stands on what nearly every country holds (customers' pay, a profile field on 198 rows; household spend on 196) before a trades
figure that 173 countries lack (cv:1442); (b) how the state deals belongs with the rules, since its rows are tax predictability,
bribery, waiting time and courts (copy:130-140), not orientation; (c) the cities join stage 2 as doors, nearer his standing order,
"country page opens hero then map+cities" (FV:139-142), than today's chapter 02 or 03. Putting the market before costs reverses M
PART 1's walk ("TURN ONE, THE MONEY OUT ... TURN TWO, THE MONEY IN", M:46-47); a cost read without the revenue it is set against
cannot be judged, but the order is his to rule.

### 4b. Today's sections on the stages: the misplacements

| Section | Stage it serves | Where it stands | Why it is misplaced |
|---|---|---|---|
| Rule changes, both runs | 6 | zone 2, before any cost | a change reads against a baseline not yet met: "Minimum wage (21+) £12.21 to £12.71" comes three zones before the staff figures |
| Opening from abroad | 3, for a minority | zone 4, a level of its own | a founder-visa total ("$8,572") before the staff costs every reader needs |
| Employing people | 6 (rights) | zone 5, beside staff cost | entitlements ("Maternity pay 39 weeks", "Sick pay lasts 28 weeks") in a cost stage |
| An hour, all in | 4, and 5 for parting costs | zone 5 | "Parting, 10 years ... $13K" before the visitor has opened |
| The lease, by law | 6 | zone 7, among costs | stamp duty on a 10-year lease and renewal compensation in the run stage |
| Dealing with the state | 6 | opens chapter 02 | its twin "Dealing with people" stands six zones later (cv:1727, cv:1756) |
| If it fails | 5 | zone 11, chapter 02 | failure law before the market, five zones before survival (chapter 04) |
| What London's trades take | 2 | zone 12, chapter 03 | the market stage (zones 12 to 15) arrives after the costs, red tape and failure law of zones 3 to 11; a London figure standing for the country |
| The job market | 4 (hiring pool) | zone 13, beside people by age | "Hospitality 2.8 vacancies per 100 jobs" is a staff fact |
| What locals know | 4 | zone 14, beside the cities | both notes repeat printed figures: "pays no business rates" at £12,000 (running costs' "Full rates relief £12,000"), pension auto-enrolment (the staff rows) |

On /kh the page is shorter but the market is split: cities and customers in chapter 02, household spend in chapter 03 "What the
place is like" (cv:1875-1881, cv:1915-1920), and the peers seat stands under "Where to open it" (cv:1882-1907).

### 4c. What a first-time visitor is not ready for where it stands

The UK's deep sections in zones 4, 5, 7 and 11 (from abroad, employing people, an hour all in, the lease, if it fails) and the
locals' notes print 41 rows and 5 focal figures at once, and the change runs 8 rows over "+ 30 more changes" (fetched /gb). A first
reading needs a headline from each at most; the rest are decision-stage facts. Each belongs one tap down inside the slot it deepens:
his clause 58, "a section with several parts reveals them on a click" (FV:1180; M:1001), and "THE POP-UP IS NOT EXECUTED"
(FV:1204).

## 5. A category model: 16 slots, one answer type each

Every slot: one question; one answer type (MONEY, SHARE, TIME, POSITION, a STATE word from a closed list, or a DATED PAIR); labels
defined once for all countries (FV:1163); one figure at 30, then rows of the same type; a row of another type goes behind the plus
in its own list under its own head; a slot without its data omits itself (no seat, no "We don't have"); the plus opens in place
(DetailPanel), never a carousel, modal or drawer; no typed figure. **Vertically first:** the stage order is the phone's one column;
a desktop pair may only join two neighbouring slots of one stage (today the phone order is a by-product of desktop pairs: a zone
stacks its pair in source order, zones.tsx:54-58).

| # | Stage | Slot | Question | Type | Source in repo | Thin state | One tap down (+) |
|---|---|---|---|---|---|---|---|
| 1 | Orient | Tax on profit | What share of profit goes to the state? | SHARE | hero_facts.ts:80-89 (regime, 58 of 195); GB law engine, hb:208-209 | the company tax rate under its own label (`country_profile_v2.json` corporate_income_tax_combined_pct, 198 of 198); never "Not known yet" | the other taxes (hb:225-257), today hidden when no regime (HB:109 sits in the answer branch) |
| 2 | Orient | Where it stands | How does it sit for an owner? | POSITION: figure and owner-direction mark | hb:171-202 | no mark under a set of 20 (hb:113-119); "Hiring staff" moves to slot 7 | the row's placement sentence (hb:84-86) |
| 3 | Market | Customers, city by city | What do customers earn, and where? | MONEY a year | city_cards.ts (105 countries, doors); range_rows.ts:63-71 strip (profile median_wage_full_time_usd, 198 rows; tenths on 47) | the national typical alone | every covered city; the tenths |
| 4 | Market | What households spend on | Where does a household's money go? | SHARE of 100 | country_spend_rows.ts (196 of 198, M:390) | omit | the survey's own lines (GB household_spend.json) |
| 5 | Market | What trades take | Which trades make money here? | MONEY a year | GB: country_depth_rows.ts London sales; margin rows (22 countries, M:373) | omit (173, cv:1442) | more trades (cv:798) |
| 6 | Open | To open | What do the forms cost, how long? | MONEY and DAYS, one unit a column | setup tiers (152, M:357); entry_bill_rows.ts; howto_steps_rows.ts; country_licences_rows.ts | the bill or the table alone | the steps (fixed step labels, the shard's text beneath), licences by trade, from abroad (a STATE list) |
| 7 | Run | What a hire costs | What does one employee cost a year? | MONEY a year | pay_rows.ts (195 pairs, M:362); employer share (shard tax_burden.employer_oncost_pct, 198); rules.json (GB) | the wage floor and the share (as /kh) | rules of employing (TIME list), hiring ease (STATE list from people_pay.hiring, 197), the hire lever |
| 8 | Run | Running costs | What do power and premises cost? | MONEY per unit | profile electricity (198, 52 fills withheld, M:360), diesel (198); rules.json premises, insurance (GB) | electricity and its placement | premises tax; insurance the law requires |
| 9 | Run | Credit and card fees | What does money cost me? | SHARE (rates) | profile bank_lending_rate_pct (198; repeated values to vet, 6 rows share 0.2496); financing, payments.json (GB) | the lending rate on its track | start-up loans; how customers pay |
| 10 | Run | Filing deadlines | What must I file, and when? | TIME | rules.json filings (GB, cv:1651-1664) | omit | late penalties (a MONEY list) |
| 11 | Run | Against the peers | Better deal than its peers? | table, one unit a column | peer_rows.ts (51 of 195, cv:419) | omit | sort by any head |
| 12 | Last | How many last | Of 100 new firms, how many trade at year five? | SHARE of 100 | survival.json, firms_last, duel (GB) | omit | by region; by city; trades that fail most |
| 13 | Last | Selling or failing | How long to sell, or to be freed if it fails? | TIME (months) | country_exit_rows.ts (198; withheld on GB as unsourced, cv:1476); if_it_fails.ts (GB) | time to sell alone | if it fails: TIME rows, then MONEY and STATE rows in lists of their own |
| 14 | Rules | How dealings go | How do the state and people deal? | POSITION on poles | character_rows.ts (192 of 195, M:386) | omit under two reads | a switch, the state or people (the Switch, cv:1122) |
| 15 | Rules | Rule changes | What changed, what is coming? | DATED PAIR | country_rules.ts; data/sections/changes.json (GB) | omit | more changes; each change also dated on the row it changes (cv:1620-1628) |
| 16 | Next | Where to next | Where now? | doors | close_rows.ts | fewer doors | none |

Under the model /gb draws all 16 and keeps every fact it prints today, about twelve of its present sections becoming the plus of the
slot they deepen. /kh draws slots 1, 2, 3, 4, 6, 7, 8, 9 (if its lending rate passes the fill check), 13, 14 and 16: 11 of 16 in the
UK's form and type, omitting 5, 10, 11, 12 and 15 for want of data. /af draws the same 11, thinner inside (no city row, no forms
table). A visitor who has read /gb has then read /kh, which M:55 promises today and the page does not keep.

## 6. The three changes that would most raise digestibility on a phone

**1. One answer type per section, units out of the cells.** Each section leads with one figure and rows of that figure's type; a
list holding another type moves behind the plus as its own list with its own head (money, time, state); the masthead never prints a
word in the number's place (thin countries show slot 1's labelled company rate and keep "+ The other taxes"); "Hiring staff" leaves
the board; units move to the label or a head so digits share one edge (M:181). *Fixes* every row of 3b, the ragged masthead column,
and "Not known yet" on 137 of 195 heroes (cv:147). *Costs* about eight files (FromAbroad.tsx, LeaseByLaw.tsx, IfItFails.tsx,
HireAllIn.tsx, the employment and paperwork blocks in cv, hb, HB) and their copy; one new chain gate reading a value class per
FactRows row (UNIT MIX reads only `[data-col]`, G:97, and reports "unmeasured, not zero" where there is none); the slot 1 fallback is
a data ruling (another measure under its own label). Overturns no ruling: PART 5 already demands it (M:199). One to two days with
renders at 375, 768 and 1280.

**2. The journey order, with the UK's deep sections folded into their slot.** The 16 slots in the seven stages, for every country.
The change runs move to stage 6 and each change also shows dated on the row it changes. From abroad, employing people, an hour all
in, the lease, if it fails, the job market and the locals' notes fold behind the plus of slots 6, 7, 8 and 13 (DetailPanel already
serves cv:798, cv:903, cv:920). A first reading meets 16 sections instead of 30, the 41 rows of 4c one tap away. *Fixes* the
misplacements of 4b, the phone length, and "click to explore more in the same section". *Costs* the two zone lists and two rail
lists in cv (1522-1549, 1671-1784, 1855-1941) and six wrappers; re-baselining blueprint-conformance (G:88), the paywall's lock order
(lockedLevelKeys, cv:1788; his rulings 18 and 22 decide which levels stay free), the loud-seat ledger (cv:146-150), KIND ADJACENT
(clause 64, M:1013) and form-variety. Overturns M PART 1's walk, 10.2's chapters and 10.7's no-fold line (section 7), so his ruling
comes first. Two to three days.

**3. A direction cue on every placed figure.** One table, defined once per measure, says which way is easier for an owner (fewer
days, lower fees and tax, cheaper power and credit, cleaner dealing, easier admin); the board's marks fill toward easier and the key
says so ("More bars: easier for an owner." for "Marks rank the countries.", copy:361); a measure with no owner direction (salary,
customer pay) carries no mark; the tracks of slots 8 and 9 name their easier end. Ink only, no green or red (G:54). *Fixes* "missing
visual cues make it hard to tell if an indicator is good or bad" (3a.9). *Costs* half a day of code (hb `levelOf` plus a direction
map, HB `LevelMark` at 177-191, copy, the WorldRange key) and his reading of the direction table, measure by measure. Overturns PART
6's "nothing is a judgment" (M:266) and the board's own law (hb:41-46); clause 37's one placement sentence can stay, the cue being
the mark.

## 7. Rulings the proposal would change, quoted

- M PART 1, the walk: "TURN ONE, THE MONEY OUT ... TURN TWO, THE MONEY IN." (M:46-47)
- M 10.2: "The United Kingdom's four: 01 What it costs to open, and to run; 02 Red tape, borrowing and getting paid; 03 What to
  open, and where; 04 The first years." (M:1030) One set of stages would replace the UK's four and the general three.
- M 10.7: "Every row shows at every width. A fold behind a plus was tried on 2026-10-04 and left the same day: it hid the rules he
  asked for" (M:1041).
- M 8.2, the thin country seated: "Every block is present on every country, drawn or seated" (M:376), and the floor of 13 (M:461):
  /kh and /af would draw 11.
- His "more sections": "EVERY MAIN PAGE HOLDS MORE SECTIONS" (FV:1205; clause 63, M:1009). The model keeps every section's content,
  but a dozen of them open on a tap.
- M PART 6: "One direction always, so the same words mean the same rank on every page and nothing is a judgment." (M:266)
- cv:1673's "THE HOT STUFF FIRST (his word of 2026-10-04)", a loop reading his words (FV:1239) and binding (FV:1245) do not carry.
- Kept: one figure printed once, a rule in the law's currency (M:1049), no hue for good or bad (G:54), three full widths (M:976),
  his hero's labels "high, medium, low" (FV:1154) read in the owner's direction rather than dropped.

## 8. What these measurements cannot see

- Task 0's "0 red(s)" for /gb at 375 cannot distinguish a digestible page from a dense one: no gate reads value classes in a list, a
  mark's direction, or section order against a visitor's sequence.
- The family count shows which shards hold a family, not whether its values are good; "198 of 198" for a profile field cannot tell
  a measured value from a fill (electricity's 0.13 on 52 rows is the known case, M:360).
- Block counts come from my text extraction of the fetched HTML (scripts, styles and SVG stripped), cross-checked against Task 0's
  "30 blocks" for /gb; the 375 pixel figures are Task 0's, taken 2026-10-12 from main before this branch.
