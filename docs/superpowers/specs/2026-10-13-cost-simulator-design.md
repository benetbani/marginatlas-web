# The cost simulator: /calculator rebuilt, free (2026-10-13) Design

The owner's ask of 2026-10-13: "A page of the website should be related to business costs simulator where the user picks country, city,
number of employees, rent, blah blah and we calculate his costs, and breakeven revenue for profit. Super detailed and chic." His decision
the same day: **rebuild /calculator, free**. Built after the rhythm branch, the homepage and the country page, in that order, unless he
moves it.

## 1. Intent

**Why now:** today's /calculator is the site's only break-even tool, and its break-even is circular: it sizes fixed costs as a share of the
revenue the reader types, so whether the owner is paid never depends on that revenue, and it works for 16 trades (research R7,
E:/atlas/docs/superpowers/research/2026-10-13-strategic-pages/R7-simulator.md, section 1). A tool that cannot be wrong in the reader's
favour or against it is no tool; it is replaced, at its own address (no URL renamed).

**What the reader does:** picks a country, a city and a trade; sets the team by role, the premises (size and rent), the sales they expect
and the average ticket, the owner's pay target and a loan; and reads, at once and live, what the business costs a month and a year by line,
the sales it needs to break even (with and without paying the owner, and for a target profit), the margin at their sales, what moves the
break-even most, and how many months the opening money takes to come back.

**Success:** every default carries its source and its kind; a reader's own figure says "yours"; a place that lacks a figure says so and
falls back to the country, or leaves the field empty with its reason, never a typed default; the break-even is the arithmetic
F / (1 - v), never circular; the page reads phone first and stands beside the site's best pages in finish.

## 2. The version built: the minimum honest one (size M)

Every place. London and England run on the register and the UK law engine already in the repo (src/lib/uk/pnl/model.ts and the law
modules: business rates, employer cost, take-home by legal form, loans, lease tax); elsewhere the trade and city shards supply the defaults
as estimates, each fallback said. Only data already held (R7 section 5). Inside it, a first slice (London's three money trades on the model
as it stands) proves the engine before the world defaults land.

**Inputs** (R7 4.1, adopted row for row): country, city (optional: "anywhere in" the country), trade; premises size; rent per m2 a year;
service charge and rates (rates by law in England, omitted elsewhere); team by role with pay per role and employer on-cost; owner's pay
(none by default: the owner keeps the profit; a target when set); sales a year; average ticket; cost of goods share; running costs (utilities,
insurance, software, marketing as the trade's drivers); a loan; the cost to open; the legal form (UK only).

**Outputs** (R7 4.2, adopted): the bill by line, a month and a year, the month drawn as one bar; sales to break even (F / (1 - v), F with the
owner's pay when set); the sales that pay the owner and leave a target profit, after tax where the law engine holds the tax; customers a day;
the margin at the reader's sales, before and after tax (after tax in the UK; before tax elsewhere, said so); the share of firms above
break-even where a register or a trusted cell holds it; what moves the break-even most (each input moved one step, sorted); months to pay
back the opening money (withheld at a loss).

**Provenance:** every figure through the kit's Fig with its data-src and data-kind; an output combines its inputs' kinds (an estimate unless
all are counted, looked up or worked out); a reader's own figure carries the new kind word "yours", and an output that rests on one says
"your figures" in its line.

**When the place lacks data:** city, then country, then none, and the row says which ("London holds none. This is the UK's."). A withheld
input leaves its field empty with its line, and every output that needs it is withheld where the figure would stand. Never a fill (the
electricity 0.13, the 80,000 archetype, the 42/10/5 ladder, any placeholder).

## 3. Address, state and indexing (R7 4.4, adopted)

At /calculator (its route, canonical, hub card and footer links stand). State in the address: country, city and trade, and only the levers
that differ from the defaults (`?country=gb&city=london&trade=restaurants&v=...`). A cold load renders on the server from the parameters; a
place switch fetches its defaults from one API route; the levers recompute in the browser and write the address with replaceState,
debounced. Canonical /calculator on every view; a view with parameters is noindex and in no sitemap; an unknown country, city or trade
answers 404; an unknown lever is ignored, one out of range clamped. Each trade-in-place page gains a door, "Run your own numbers", carrying
its three place parameters.

## 4. The page, phone first (R7 4.5 and 4.6, adopted)

1. Masthead: "What your business costs", one line, three native pickers on 48px fields.
2. The answer: sales to break even a month at 40, the page's one 40, in terracotta; a day at 16; the share of firms above it; the margin at
   the reader's sales at 30.
3. The levers, the page's one card (the reader operates it): Team, Premises, Sales, You, Loan; each a slider beside a typed figure with its
   source line; team rows as steppers drawing the hire lever's bar.
4. The month: one bar of variable costs, fixed costs and profit with break-even ticked, then fact rows (label, source, figure); a switch
   for a month or a year.
5. What moves it most: the sorted bars, the largest the one other terracotta.
6. Money to open it: the opening bill as ranked bars, months to pay back at 30, the phase bar.
7. Where figures come from: every default's source in words, with its date.

From 1024 the levers stand left and the answer and the bill right. Live figures, no Apply button, announced politely. Headings of four
words; lines under twelve words; no modal, drawer, carousel or toast; the money in the reader's display currency through the site's
existing switch (src/lib/finance/fx.ts). The rhythm branch's air, type floor, each-fact-once and bare opener icons hold here, and the
country page's signal marks the margin and the share above break-even where a direction exists.

## 5. Gates and verification

The page joins the chain's renders, so the copy, page and provenance gates read it; a new engine test pins the break-even arithmetic
(F / (1 - v), the owner's pay in F, a loss shown as a loss, payback withheld at a loss) against hand-worked cases for London restaurants
and one place outside the UK; a fallback test pins city to country to none with its line; a no-fill test reds any of the known fills
reaching an input. Verification: renders and photographs at 375, 768 and 1280, every browser check, the chain, the build, and after his
deploy word a production probe.

## 6. Later: the full version (size L), each download his word

Every London borough's and English local authority's rent (a rebuild of a cached file, no download), the recipe protocol on all 243 trades,
a monthly cash curve with ramp and seasons, tax by legal form beyond the UK, and, each needing a download and his word: energy use per trade,
personal tax schedules outside the UK, insurance premiums, licence fees in money, accounting, software and card-fee prices, register-grade
shop rents outside England. The give-to-get exchange (the owner's numbers, SPEC-2026-10-02-owner-numbers) as the page's end is a later
decision of his.

## 7. Decided here, for his review

- "yours" as the provenance word for a reader's own figure.
- The display currency through the existing switch, dollars by default as the site prints today.
- No sticky answer on a phone in this version (a new pattern the model does not hold); the answer stands above the levers and each lever
  shows its effect beside it.
