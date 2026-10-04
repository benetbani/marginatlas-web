# The United Kingdom page reform: bands instead of the bento, phone tables that hold, and context that is the country's own

Design spec, 2026-10-04. Branch `uk-page-reform` (website). Decided by the loop under doctrine 16 (the loop decides on the country
page and never asks him to look); every decision below carries its evidence. Research behind it:
`docs/superpowers/research/2026-10-04-uk-page-reform/` (R1 measured references, R2 phone tables and spacing, R3 sections and
bands, R4 context and gold nuggets, R5 the UK data inventory, R6 UK facts sourced).

## 0. What he asked, verbatim, and how it is read

> "on the mobile version the rendering of the tables and of many elements has a horrible execution ... we need a big reform of
> the sections and we should abandon the bento in favor of a more traditional thing where the sections have alternating background
> colors maybe just by a little bit ... we can keep some cards but not so much bento, not everything inside the bento ... do this
> test first and foremost with the page of United Kingdom ... The page still feels a little bit blank and stale. There are not so
> many details about the country ... the sections ... feel not very backed up ... there has to be some context below, there has to
> be some hot stuff, some gold nuggets ... But we should avoid going and making each section with a line of sentences below ...
> the guidelines for the distance between the rows and the columns in the mobile version ... has to be studied so extensively ...
> go further with the studies of how pages that have data heavy structures actually make their pages digestible ... Apply several
> quality checks ... do not stop until the goal is reached" (2026-10-04, in chat).

Read as six commitments:

1. **No bento.** Sections stand open on full-width bands that alternate a little in tone; a card survives only where it earns one.
2. **Phone tables that hold.** Every table and list on the page laid out for 375px from measured numbers, never wrapped by luck.
3. **The country's own context.** Dated changes, the rules behind a figure, the named peers, the reader's own currency: drawn as
   marks and ruled rows, never as a sentence under a section.
4. **Backed up, literally.** No figure the files cannot stand behind: the layout seed's placeholders come off or are replaced by
   sourced values; known fills stop distorting the world's range.
5. **A written phone standard** for rows and columns, with numbers, that a gate can hold.
6. **Digestible**: one dominant reading a section, depth behind the plus, landmarks for a long page.

"First and foremost the United Kingdom": the reform replaces the composition only the United Kingdom draws (`country-view.tsx`,
the `rich` branch, which needs every depth block; no other country holds them). The other 194 countries keep the bento until the
UK page is ratified; the new pieces (zones, the phone tables, the fact rows, the world strip) are built page-agnostic so the
roll-out is a composition change, not a rebuild.

## 1. The page before, measured (live, 2026-10-04)

| Measure | 375 | 1280 | Instrument |
|---|---|---|---|
| Height | 13,786px, 17 screens | 6,675px, 7.4 screens | `design_probe.js` |
| Text set at 12px | 213 of 478 leaves (45%) | 230 of 480 (48%) | same |
| Figures per screen | 13.3 | 30.5 | same |
| Rows whose figures wrap to a second line | 8 (the five peer rows, a bill step, two range rows) | 3 | `scratchpad/reform/probe_url.mjs` |
| Rows set only at 12px | 30 | 31 | same |
| Card boxes on the page | 23 | 23 | page laws |
| Existing layout gates | page filter 0 reds, page laws 0 reds, model laws 3 allowed | | harness on Edge |

Every bento gate passed while he saw a botched page: the checks could not see figures drifting from their heads. The new checks
(section 9) read exactly that.

### 1b. The page after, measured the same way (local, in the site's own faces, 2026-10-04)

| Measure | 375 before | 375 after | 1280 before | 1280 after |
|---|---|---|---|---|
| Height | 13,786px, 17 screens | 14,804px, 18.2 screens | 6,675px, 7.4 screens | 8,461px, 9.4 screens |
| Text set at 12px | 45% (213 of 478) | 29% (211 of 732) | 48% | 31% (223 of 729) |
| Figures on the page | 226 | 416 | 226 | 416 |
| Words on the page | 1,116 | 1,694 | 1,120 | 1,703 |
| Card boxes | 23 | 3 (the masthead, two levers) | 23 | 4 (with the peers table) |
| Rows whose figures stand on two lines | 9 | 3 * | 3 | 4 * |
| Rows set only at 12px | 30 | 2 * | 31 | 3 * |

\* What is left is the instrument's reading, not a split: a bill step, whose step number sits in its circle above the line of its
day and fee, and the two world tracks, whose ends, median and key stand on lines of their own by design. The 12px target of 25%
is not met: the notes under the rules are 12 on 16 by the row grammar, and they are most of the added rows. A dev page draws in
the fallback face on this machine (Google Fonts unreachable), so these were measured with the two faces loaded in the browser,
as the harness renders do.

## 2. The research in one page

- **Bands (R3, 24 sites measured).** Data pages separate sections with headings, space and rules, and keep cards for things a
  reader operates. Neighbouring bands differ by a WCAG ratio of 1.04 to 1.13 against white, clustered at 1.06 to 1.09 (Apple and
  Notion 1.089). No band is visible by APCA's floor and forced colours remove them, so headings and spacing must carry the edge.
  `--c-soft` cannot be a band (more chroma than a banned cream); `--c-soft2` fails accent text.
- **Phone tables (R2, 98 sources).** 343px of content at 375 (16px gutters). Space Grotesk's tabular figure is 0.62em (8.7px at
  14); the heads, not the figures, set column widths. Three numeric columns fit beside a 112px label; five only with the name on
  its own line. Read-only rows 36px, tappable 44px; 14 on 20 and 12 on 16. Heads at most two lines, bottom-aligned, right over
  their numbers, the break chosen. No zebra stripes (no accuracy gain; GOV.UK dropped them). No cards, no sideways scroll, no
  transposing, no one-metric switcher for a comparison.
- **Context (R4).** The old page's context was all one kind, "where on the world's ruler", identical on 195 pages, which is why it
  read stale. Missing: time (what changed, what is coming), rules (thresholds, deadlines, penalties), named peers, the reader's own
  units. Five strongest patterns: dated change as two absolutes; the plus as a fact sheet with the penalty beside the rule; peer and
  domestic reference ticks on the existing tracks; every country as a hairline on the world track; the native figure beside the
  dollar one.
- **The data (R5).** About 730 UK country values held in 31 files, a third printed. Sixteen shard blocks equal the illustrative
  layout seed value for value and print as "modeled" (the payment mix, the card fee, the insurance premiums and their $2,200, the
  admin hours and filings, Innovate UK's range). The electricity "world median $0.13" was the fill 52 countries hold. Official
  dated facts (Companies House fees, employer National Insurance, the National Living Wage, sick pay, the unfair dismissal change,
  thresholds) sit in `data/sections/thresholds.json` and the research note of 2026-09-25 and were never seated.
- **Measured references (R1, 15 pages at 375 and 1280).** Six alternate full-width light bands, neighbours 1.046 to 1.111 (median
  about 1.08). References put a median 2% of their text in bordered cards (8% with tinted panels); the old page put 97% in 23 cards.
  Phone text starts 12 to 25px from the edge on 11 of 14 (the old page 45px, a 285px column). No reference stacks a table row into
  several lines; 2 to 4 columns show, rows about 41px, at least 13 to 18px between number columns. The first phone screen holds a
  median of 8 figures on data pages (the old page 1); text under 14px a median 19% (the old page 43%). Census Reporter is the
  closest model: a heading, the figure, a label, one context line, a small chart, a rule.

## 3. The band system (zones)

A **zone** is one full-width background band holding ONE LEVEL of the page: one section that takes the column, or two related
sections side by side from 768px (equal halves there, the level's ratio from 1024). (`Band` in `kit.tsx` keeps its meaning, a level of cards, on the pages not yet moved; R3's
naming warning.) Code: `src/components/spine/zones.tsx`; CSS: `globals.css`, THE ZONES.

| Rule | Value | Why |
|---|---|---|
| Surfaces | paper `--c-card` #ffffff and tint `--c-ground` #f6f6f5, 1.081:1 | R3: the measured cluster; the live ground; under every cream's chroma |
| Alternation | per zone (per level), tint first (the masthead) | His ask is the SECTIONS separated by a background; per level changes colour about every 450px on a desktop and every one or two screens on a phone, never a stripe per section (R3's warning) |
| Padding | 40 / 48 / 64 at 375 / 768 / 1024, the first zone 24 / 32 / 48 (the column opens 16 under the header: 64 in all at 1024, DISTANCES 2.3) | R3 3.4; R2's 40 to 64 between sections |
| Full bleed | the zone stays in the 1120 column and paints edge to edge with a border image's sideways outset (none above or below) | full bleed is not full width: sections keep the column (R3 pitfall 8); an outset makes no scrollable overflow and clips nothing (the first build's clipped shadow cut tooltips at a zone's edge) |
| Phone gutter | 16 (the zones reach 8px into the column's 24) | R2: Material, iOS, NHS; 343px of content |
| Chapter opener | at the top of the chapter's first zone: the number at 14 muted, 8, the title at 24 semibold; 24 (phone) or 32 to the level | R3 3.5; the title at the section rung now that it anchors coloured zones |
| Section title | 20 semibold beside the 28px glyph tile (open sections only) | the card edge used to say where a section began; on the band the title is that edge |
| Two sections in a zone | side by side from 768 in equal halves, 48 apart; from 1024 in the level's ratio (1-1, 3-2, 2-1, 2-3), 64 apart, no rule; stacked below 768: 24, a hairline, 24 | R3 3.6; stacked at 768 an open section used the left half of 720px (the page filter's WHITE SPACE, four sections) |
| The ratio | chosen so the two columns end level (the running costs at 3-2: their four rows split into two lists from 600px) | his ruling of 2026-09-20, blank space is a fault |
| Forced colours | a 1px CanvasText rule between zones | R3 Q1 |
| Soft fills on a tint zone | `--c-soft` re-pointed at white inside tint zones (a home row, a chip, a disclosure panel), restored inside kept cards | R3 pitfall 4: soft vanishes on the tint (1.01:1) |
| What a drawing stands on | `--c-surface`: the card's white by default, the band's grey on a tint zone, white again in a kept card; a label that masks a grid line and a ring's hollow paint it | the time to sell's "Here" stood in a white box on the grey band at 375 |

**THE CARDS THAT STAY** (R3 3.7: a card earns its box when the reader operates something in it, or it is a door): his masthead
board (his ratified design, on the tint as it has stood since 2026-09-25), the hire lever, the loan lever, the sortable peers
table (open on a phone, where its 343px are needed for five figures a line), the city cards (each a door). The cover picker left
with the seed's four premiums (section 7); the insurance section is the law's cover and its two fines. Each is
the one card surface (white, the strong edge, radius 12, the July-3 shadow pair). Everything read rather than operated stands open.

## 4. The phone standard (rows and columns), the numbers a gate holds

| What | Number | Source |
|---|---|---|
| Page gutter | 16 | R2 F2 to F5 |
| Content width at 375 | 343 | arithmetic |
| Text in rows | 14 on 20; notes and heads 12 on 16 | R2 T1 to T3; RATIOS ROW RUNG |
| Read-only table row | 8 + content + 8 (a name line and a figures line: 60) | R2 Q2 |
| Tappable row | 44 at the least | Apple, WCAG 2.5.5 |
| Fact row (glyph, label, figure) | 12 + 28 + 12 = 52; with a note 68 | FactRows |
| Numeric columns beside a label | 3 at most | R2 Q1 |
| Five figures | only under a name line, one grid shared by heads and rows | R2 pattern f |
| Gap between numeric columns | 12 at the least, the slack shared | R2 Q1 |
| Heads | at most two lines, bottom-aligned, right over the figures, the break chosen (the last word and the sort arrows on line two) | R2 Q4 |
| A row's figures | never on a second line under their heads | R2 section 4, rule 1 |
| Units | once, in the head (a days column prints the count under "Days to trade" on a phone) | PART 5 |
| Row separation | 1px hairline; the home row's tint the one background that means something; no stripes | R2 Q6 |
| Heading to its content | 16; between groups 24; between sections 40 to 64 | R2 Q7 |

## 5. The tables and lists, one by one

- **Against the peers** (5 countries x 5 columns): one grid; heads once; each country a ruled row of its name line and its five
  figures on one line, each in its column; the tick to the left of the best figure; the home row's tint reaching 8px past the text.
  Measured at 375: columns 64, 64, 54, 43, 48; rows 61 to 62; no sideways scroll. `SortTable`, `CompareTable`.
- **Registering, by legal form**: the name keeps its column at every width (107px at 375); fee 56, time 60, dots and the plus 84;
  each form's figures on its name's first line; the local name wraps in two lines, never cut; the whole row is the plus.
  `TiersTable`.
- **Facts under a section** (what staff cost, employing people, running costs, insurance, legal and admin costs, borrowing,
  getting paid): ruled rows, the glyph and the label (its note under it) then the figure in the next column; one grid, so the
  figures share one edge; under 420px label left and figure right; from 600px two lists side by side. Every row shows at every
  width: a fold behind a plus was tried and left the same day (it hid the rules he asked for, and left the employing column 220px
  short of its pair at 1280). `FactRows` (new).
- **Rule changes** (two sections, coming and recent): a date, the item, its value before and from; a rate changed with its
  threshold is two rows. The recent run shows the newest of the lead changes (the ones a person opening a small business meets
  first, and every change of the last 120 days), as many as the coming run holds and four at the least, so the two columns stand
  level; the rest behind the plus. `ChangeRun` (new).
- **Ranked bars** (trades keep, what holds firms back, insurance): the name and its figure on one line, the bar on its own line, as
  built (R2 3.4, 3.5).
- **The bill's steps**: unchanged form; checked at 375.

## 6. The context layer: the country's own nuggets, never a sentence

Context enters a section in only three places (R4): a mark on the drawing, a ruled row, or a row behind the plus. Never a
conclusion, a comparison word, a multiple or a difference (PART 9 clauses 12, 13, 15).

1. **Every country as a hairline on a world track** (P3): electricity and the small-business loan rate draw each held country as a
   1px mark (fills left out), so the placement is visibly counted from something. `world_stats.ts worldValues`.
2. **The page's peers on the track** (P2): the comparison table's four peers as hollow marks, named once in a key line with their
   figures ("Peers France $0.19 Netherlands $0.21 Germany $0.22 Ireland $0.28"). Three at the least. `peer_marks.ts`.
3. **Rule changes, by date** (P9, P13, D2): a section of its own after the masthead: what changed in the last years and what is
   enacted for the months ahead, each a date, the item and its value before and from (two absolutes). Only changes in force or
   enacted with a date; each row sourced (R6, `data/sections/changes.json`).
4. **The rules behind a figure** (P20, P21): ruled rows under the section's drawing, from `data/sections/rules.json`: the
   thresholds, the deadlines, the penalties, all of them visible.
5. **The native figure** (P19): a rule prints in the law's currency and unit ("£12.71 an hour", "£123.25 a week", "43.2p",
   "£50" a year for the company statement, "£13" to strike a company off); a comparison across the world keeps the site's dollars.
6. **A reference on the track**: the central bank's rate as a small ink triangle above the small-business loan track, named in the
   key ("Central bank rate 3.75%"), in place of its row under the track. The loan track is on a log scale: the world runs 1.3% to
   78%, and on a linear track the four peers and the country stood in one blot.
7. **One placement wording** (P14, clause 37): the time-to-sell card's "quicker than in 182 of 198 countries" becomes the site's
   one sentence ("Among the lowest tenth.").

## 7. Backed up, literally: the data fixes

| Fault (R5) | Fix |
|---|---|
| Electricity's world median and range were drawn on the 0.13 fill (52 of 197 rows) | `world_stats.ts` leaves a field's known fill out of the set: the median reads $0.14, the count is the measured countries |
| Seed placeholders printed as "modeled": the payment mix, card fee and payouts; four insurance premiums and their sum; 55 admin hours and 9 filings; closing with debts in 6 to 12 months; Innovate UK $30K to $2M | Replaced by R6's sourced values where a primary source exists; otherwise the figure leaves the page (the rule replaces it: the filing calendar replaces the two admin counts) |
| "Cost of living 41/100", a 1-to-100 scale the site built, read as a score (clause 17) | Replaced in Running costs by the premises tax a shop pays here (business rates relief and the multipliers, official) |
| "Quicker than in 182 of 198 countries", a second placement wording | The one wording, from `placement.ts` |
| Unfair dismissal goes stale on 1 Jan 2027 | The row carries "of service; 6 months from 1 Jan 2027" (read from the change file's own key, `unfair-dismissal-period`) |
| Sick pay printed as the world shard's "$163" beside "£12.71 an hour" | The law's "£123.25 a week", "from day one; 80% of pay if lower"; maternity pay's note carries "90% for 6 weeks, then £194.32 a week" |
| The paperwork's figures in dollars over pound signs in the words ("$66 a year ... (£50 online)") | The law's £50 and £13 as the two views' figures |
| The newest change (the tribunal's time limit, 1 Oct 2026) waited behind the plus under April's rows | Every change of the last 120 days leads the recent run |

## 8. The page, zone by zone (United Kingdom)

| Zone | Tone | Sections |
|---|---|---|
| Masthead | tint | his board (a kept card) |
| Rule changes | paper | rule changes coming, recent rule changes (two sections, level) |
| 01 What it costs to open, and to run | tint | registering by legal form, the bill to register |
| | paper | what staff cost (the hire lever a card), employing people |
| | tint | running costs (3-2: the track, then diesel and the premises rules in two lists), insurance (the law's cover and fines) |
| | paper | against the peers (the table a card from 768) |
| 02 Red tape, borrowing and getting paid | tint | dealing with the state, legal and admin costs |
| | paper | borrowing (the central bank's rate on the track; the loan lever a card), getting paid (the payments ring, its basis under it) |
| 03 What to open, and where | tint | what London's trades keep, time to sell |
| | paper | people by age, the job market |
| | tint | the cities, what locals know |
| | paper | what households spend on, dealing with people |
| 04 The first years | tint | who is still trading, what holds firms back |
| Close | paper | where to next |

(The tones follow from the alternation; a zone that does not draw is not counted, so the reader always sees alternation.)

## 9. What changes in the model and the gates

- **MODEL.md gains PART 10, THE BAND PAGE** (written 2026-10-04, with forbids 68 to 73), superseding for band pages: PART 2's ground-and-card law, the bento band of PART 5, the
  level rules of PART 9 clauses 24 to 26, 50 to 53 and 59 where they speak of cards on a level, and the 16px card title. Kept: the
  type ladder (one 30 a section, the 40 once), the row grammar, the accent budget, placement, every copy law.
- **DISTANCES.md** gains 2.5, the band page: the band distances (section 3), the phone standard (section 4) and the leading
  pairs 12/16, 14/20, 16/24, 20/28, 24/32; the ladder's reserved 40 takes its job (a band's padding on a phone).
- **New page laws** for a band page (`check_page_laws.mjs`), each proved by planting its fault: ZONE TONES (neighbouring zones
  differ, tones from the two tokens), ZONE PAD (the padding values), ZONE SPLIT (a declared pair draws two cells, none empty),
  OPEN SECTION (a card inside a zone only where it holds a control or a link), and at 400px and under SPLIT ROW (no row whose
  figures stand on more than one line) and HEAD LINES (no column head over two lines). A tappable row's 44px stays with the
  existing TAP SIZE law. Card-level rules that still mean something per section (FOCAL, TEXT CUT, TEXT OUT OF BOX, ROW TOPS) read
  open sections; level rules written for boxes (cards per level, level coverage, card foot blank, white space inside a card) do not
  apply inside a zone, by the ruling of 2026-10-04, written in the checker with the reason.
- **FOUNDER-VERDICTS.md** records his words of 2026-10-04 verbatim.

## 9b. What the two reviews changed (2026-10-04)

An adversarial design review (27 photographs, before and after) and a code review (the diff) ran on the built page; every finding
was fixed or answered:

- **Fixed, data and logic:** the first hire's cost took no Employment Allowance and no pension ("$6,773 of employer NI" beside
  "£10,500 off the NI bill"); it now computes both from rules.json. The unfair dismissal row would contradict the change list from
  1 Jan 2027; it reads the change in force on the day. The central bank marker never drew (a percent read against shares). The
  hidden changes opened out of order and counted rows; they sort newest first and count changes. Scope words the ledger dropped
  ("England", "sole traders"); the bank holidays' year; the card payouts read from the file; 108.5% for the small employers' reclaim.
- **Fixed, layout:** the city cards had lost their padding, radius and edge on the band (the open-section rule now names section
  boxes only, `.spine-card`); the legal forms' local name sat nearer the next form at 768 (the row reserves its height under its
  lines); the German page's narrow card broke "Freelancer" inside the word (narrow tables stack); five figures overflowed a card
  page at 320 (they wrap three and two under 280px); the best figure without its tick was marked by ink alone (underlined); the
  newsletter bar hid its field under the footer on a phone; the site header ran 11px past a 320 screen (on production too); the
  ring's words ran over the ring in Geist; the "Here" label stood in a white box on the grey band (`--c-surface`); the tablet's
  table heads wrapped unevenly; the first years' band was 171px uneven at 1280 (3-2 now, 27px).
- **Fixed, reading:** the notes under the rules cut to short phrases with no semicolons, dates unbreakable; the ring's basis is its
  caption; the log track prints 5%, 10% and 20%; the survival strip spans the regions' range, each figure under its end; distinct
  icons in neighbouring rows; the household spending list is ruled rows on the band; the dollar fee and the pound fee bridged;
  the calculator's two rules are a short list (Employer NI, Pension) and the track's keys are legends, so each section keeps its
  one supporting line; a change whose two values pass 22 characters takes a line of its own under its item on a phone.
- **Answered, not changed:** a figure printed once as the section's 30 is not printed again in its drawing (the 33% segment, the
  61% bar: the accent marks it); the two spectra keep their two dot colours (the twin rule asks two of a kind to look different);
  the masthead's "Easy" and the placement sentences are his ratified forms; a currency switch for UK pages is his decision, not
  this pass's: comparisons stay in dollars, laws in pounds, bridged where one is the other.

## 10. Quality checks before it is called done

1. `tsc --noEmit` clean; the unit tests of every builder touched.
2. Photographs of the whole page at 375 and 1280 (and 768) before and after; every section at 375 by itself.
3. The design probe before and after: 12px share (target under 25%), rows split at 375 (target 0), figures per screen.
4. The harness on Edge (the bundled browser is absent; `scripts/lib/pw_edge_fallback.cjs`): page filter, page laws (with the new
   band laws), model laws, archetypes, readability, copy.
5. An adversarial design review and a code review by separate agents; every finding fixed or answered.
6. No push and no deploy without his word.

## 11. Open, stated

- The other 194 countries keep the bento until the UK page is ratified.
- A sticky chapter bar (R3 3.8) is designed, not built in this pass.
- Mixed vintages (R5 pitfall 7): the UK's pay, electricity and lending rate are 2025 to 2026 figures, its peers' older; the peer
  marks and the world strip inherit that until the data track refreshes the peers.
