# The country page, by the visitor's journey: 16 slots in 7 stages, any country (2026-10-13) Design

The owner's direction of 2026-10-13, reading /gb on a phone (memory feedback-2026-10-13-strategic-page-design). Built after the rhythm
branch (air inside, in flight) and the homepage (planned), on top of both. The city and trade pages take the same model in later passes;
the cost simulator has its own spec.

## 1. Intent

**His words (2026-10-13), in substance:** the stacking of text lowers readability; the alignment of elements is often bad; missing cues
make it hard to tell whether an indicator is good or bad; "if the same page is done for Cambodia, would you fill it roughly the same?
That's the problem, each section has to be filled in a more programmatic, category based, less declarative language"; make the data more
digestible and use "click to explore more in the same section" more; follow the visitor's mental cycle, "is the visitor ready for this
info at this moment?"; "You cannot slap legislative changes at the top"; "in a declarative section you cannot switch from words to numbers";
"be programmatic, but not shallow, but also relevant and understandable"; the section icons "bigger and superior with no background";
"vertically first".

**His decisions (2026-10-13, in chat):**
- Structure: **journey order, depth behind "more"**: 16 slots in 7 stages for every country; the UK's extra depth opens inside its slot.
- The good-or-bad signal: **green to red, only in the signal** (one named exception to the terracotta-and-greys palette), its middle
  state **dark yellow**.

**Measured today** (research R5, E:/atlas/docs/superpowers/research/2026-10-13-strategic-pages/R5-country-page.md): /gb draws 30 sections
in 18 zones with the rule changes second; /kh draws 15, 17 of /gb's blocks hold no Cambodian data (18 of 27 fact families exist only in
GB.json), and even shared slots switch answer type (/gb's hero "18%", /kh's "Not known yet").

**Success:** every country fills the same slots in the same order and type (Cambodia 11 of 16 in the UK's form); a first read of /gb meets
16 sections, the rest one tap away inside the slot it deepens; no section mixes answer types; every placed figure with an owner
direction carries the signal; the phone reads one column in stage order; nothing a section printed today is lost.

## 2. The journey: seven stages

| Stage | The visitor's question |
|---|---|
| 1 Orient | What is this country like for a small business? |
| 2 The market | Is there money here, and where? |
| 3 To open | What does opening take? |
| 4 To run | What does staying open cost? |
| 5 To last | Will it survive, and what if it does not? |
| 6 The rules | Which rules bind me, and what is changing? |
| 7 Next | Where do I go from here? |

The market stands before the costs (a cost reads against the revenue it is set against); the rule changes stand in stage 6, each change
also dated on the row it changes.

## 3. The 16 slots (one question, one answer type, one source, one thin state, one tap down)

Answer types: MONEY, SHARE, TIME, POSITION (a figure and its signal), STATE (a word from a closed list), DATED PAIR. A slot leads with one
figure at 30, then rows of that same type; a list of another type goes behind the plus as its own list under its own head; units sit in
the label or the column head, never in the cell, so digits share one edge. A slot without its data omits itself (no seat, no "Not known
yet"). Sources, thin states and the plus for each slot are R5 section 5's table, which this spec adopts row for row:

| # | Stage | Slot | Type |
|---|---|---|---|
| 1 | Orient | Tax on profit | SHARE |
| 2 | Orient | Where it stands | POSITION |
| 3 | Market | Customers, city by city | MONEY |
| 4 | Market | What households spend on | SHARE |
| 5 | Market | What trades take | MONEY |
| 6 | Open | To open (forms, the bill, steps; licences and from abroad behind the plus) | MONEY and DAYS, one unit a column |
| 7 | Run | What a hire costs (rules of employing, hiring ease and the hire lever behind the plus) | MONEY |
| 8 | Run | Running costs (premises tax, insurance behind the plus) | MONEY per unit |
| 9 | Run | Credit and card fees | SHARE |
| 10 | Run | Filing deadlines (late penalties behind the plus) | TIME |
| 11 | Run | Against the peers | table, one unit a column |
| 12 | Last | How many last | SHARE |
| 13 | Last | Selling or failing (if it fails behind the plus) | TIME |
| 14 | Rules | How dealings go (the state or people, a switch) | POSITION |
| 15 | Rules | Rule changes | DATED PAIR |
| 16 | Next | Where to next | doors |

The UK's present deep sections (opening from abroad, employing people, an hour all in, the lease by law, if it fails, the job market, the
locals' notes) fold behind the plus of slots 6, 7, 8 and 13; "what locals know" keeps only what no other slot prints. Slot 1's thin state is
the company tax rate under its own label (198 of 198 countries), never "Not known yet".

## 4. The signal: one triangle, five states

- **Shape and place:** one solid triangle, 16px beside a row's figure and 20px beside a 30px figure, in its own column right after the
  figure. Its angle carries the state: up very good, tilted up-left good, pointing left middle, down-left poor, pointing down very poor.
- **Colour (his ruling):** dark green `#1b5e20` (7.87:1 on white), green `#2e7d32` (5.13:1), dark yellow `#8a6d00` (4.92:1), red
  `#c62828` (5.62:1), dark red `#7f0000` (11.04:1). Each holds 3:1 or more on every ground (WCAG 1.4.11). The palette gate takes one
  named allowlist for these five tokens inside the signal component only, never a raised baseline; everywhere else the palette rule holds.
- **Never colour alone (WCAG 1.4.1):** the angle and a word carry the state for colour-blind readers (green and red merge for about 8% of
  men) and screen readers: the mark's accessible label is the state word, and each page carries a one-line key.
- **Which figures carry it:** a placed figure (the country ranked among the countries) whose measure has an owner direction. One direction
  table, defined once per measure, says which way is easier for an owner: fewer days, lower fees and tax, cheaper power and credit, cleaner
  dealing, easier hiring, more firms lasting, a shorter sale or discharge. A measure with no clear owner direction (salary, customer pay,
  the wage floor) carries no mark. **The direction table is his to read, measure by measure, at spec review.** Proposed:

  | Measure | Easier for an owner |
  |---|---|
  | Tax on profit; employer on-cost share; cost to register; card fees; lending rate; electricity and diesel prices | lower |
  | Days to register; time to sell a business; time to be freed after a failure; days to enforce a contract | fewer, shorter |
  | Firms still trading at year five | more |
  | Hiring ease; tax predictability | easier, more predictable |
  | Bribery met in dealings; waiting time with officials | less |
  | Customer pay; salaries; the wage floor; household spend shares; population | no mark (no single owner direction) |
- **The state:** the placement rank among the countries holding the measure, turned by its direction, in fifths; no mark under a set of 20.
- This replaces MODEL PART 6's "nothing is a judgment" and GUIDELINES' "no hue for good or bad" for the signal alone (his ruling).

## 5. Depth behind "more"

The site's existing DetailPanel (native details): the summary row shows the answer (its label, its figure, the plus at the row's end), and
opening it shows 2 to 8 rows of one type in place; closed on arrival; the whole row a 44px target; no carousel, modal, drawer or jump.
Every browser check that reads a section's content opens the panels first (seven skip a closed panel today: their reading is fixed in
the same change, each a red first on a planted closed panel).

## 6. Typography and icons

- **One answer type a section,** gated: a new chain gate reads each row's value class and reds a list that mixes money, time, share,
  position or state.
- **Openers:** the section's icon is a bare 32px Atlas glyph in terracotta, no tile, 12px before the 20px title (a `32px 1fr` grid, so a
  wrapped title hangs under itself); icons inside a section are grey, and never the opener's own glyph. (The rhythm branch's Task 5 lands
  this for every page; this page inherits it.)
- **Vertically first:** the stage order is the phone's one column; a desktop pair joins only two neighbouring slots of one stage.

## 7. What it replaces (his rulings of 2026-10-13 over these)

MODEL PART 1's walk (money out, then money in); 10.2's chapters (the UK's four, the general three: one set of seven stages for every
country); 10.7's "every row shows at every width" (the plus folds a slot's depth); 8.2's "every block is present on every country, drawn or
seated" and the floor of 13 (a thin country draws its 11); clause 63's "more sections" (the content stays, a dozen sections open on a tap);
PART 6 and GUIDELINES on judgment and hue (the signal). Kept: one figure printed once, three full widths, no typed figure, a section with
no data omits itself, the copy rules.

## 8. Paywall, gates, verification

- **Paywall:** his ruling 18 by analogy: each stage's first slot open, every later slot of the stage locked when the paywall is on; the lock
  order (lockedLevelKeys) follows the new slots.
- **Gates that move:** blueprint-conformance, the loud-seat ledger, KIND ADJACENT, form-variety, BLOCK FLOOR (the country floor follows the
  slots), the paywall shape; each re-baselined only by a measured fall or a ruled change, never raised to pass.
- **New gates:** the answer-type gate; a replicability test that /gb, /kh, /af and /de draw their slots in the model's order and types
  (the programmatic promise); the signal's direction table read for every mark printed.
- **Verification:** before and after renders of /gb, /kh, /af and /de at 375 first, then 768 and 1280; photographs read; every browser
  check no more reds than before; the measures (first-read sections, answer-type mixes, marks per page); the chain, the build, and after
  his deploy word a production probe.

## 9. Out of scope

The city and trade pages (the same model in later passes), the cost simulator (its own spec), the homepage (planned), the London trade
picker and the buyer layer (later projects). The side finding of R5 (the desktop index links "Time to sell", which /gb never draws,
country-view.tsx:1540) is fixed in this page's build, since the slots rebuild the index.
