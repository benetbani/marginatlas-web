# HANDOFF — marginatlas.com, the build loop: new sections, measured
**2026-09-23, end of session. Five new sections are live on production; the twenty brief rows that produced them are now measured, and eleven of them are owed to the data track. Both repos are committed; the website is pushed and deployed; nothing is in flight.**

> **How to use this document.** Read top to bottom once. Then read the files in
> section 7 in the order given. Do not start work until you can answer the
> "Successor verification" checklist in section 13. A ready-to-paste
> re-hydration prompt is section 14.

---

## 1. TL;DR (read this first)

marginatlas.com is a world business atlas: for a person deciding where to open a
small business, every country, city, district and trade has a page of figures
that are gathered or modelled, never invented. The work runs as a **build loop**
under DOCTRINE 16: the loop decides, builds, records reversibly, and never asks
the founder to look at anything. This session ran the loop on **new sections**.

The method was: measure which fields the fact bank already holds that nothing
draws (`scripts/audit/unused_fields.mjs`), turn that into a brief of forty
candidate sections, and build them. **Five shipped and are live**: the city's
spending calendar, the country's "how long it takes to sell", "what households
spend on", the city's "what the crew costs" and "how this city does business".

The expensive lesson is not any of the five. It is that **a new section cannot be
seated alone**: the page's cards come in pairs, so a twelfth card breaks the
level, and three sections had each been shipped full width — which his rule of
2026-08-25 bans outside the hero. Two gates caught it. Everything is paired now.

The second lesson: **coverage finds a candidate, opening the shard finds a
section.** When every remaining brief row was read as numbers rather than as a
metric list, sixteen of the twenty turned out to be blocked by a placeholder
tag, a coined index, a duplicate figure or a cross-page contradiction.

**Recommended next action:** run the same measurement pass on the trade page's
T1–T10 and the neighbourhood's N1–N10 (brief sections 3 and 4), which have NOT
been measured yet, and build any clean PAIR it finds. See section 8.

---

## 2. Mission & success criteria

**The enduring goal** (the founder's framing, unchanged): a rich world atlas
that answers "where should I open this business, and what will it actually cost
me", with a decision in the top 20% of the page and the proof under it. Honesty
is the moat: a figure is gathered, modelled-and-labelled, or withheld. Never
invented, never a placeholder wearing a number's clothes.

**The current tactic** (this session's): the pages are thin, and his answer to a
thin page is more sections. So the loop finds sections the bank can already
defend, builds them through the kit and the harness, and records what it learns.

**"Done" for one section:** a builder whose header names the field, its coverage
and what withholds it; a card through a named archetype; a seat measured against
the page; stories in the archetype sheet where a component behaviour is new; the
page ratchets unmoved; and a record in MODEL.md, the brief, and the form
catalogue.

**Hard constraints that bound any solution** are in section 9. The two that most
often decide a design: *no section stands full width except the hero*, and
*every section card takes exactly one figure at 30*.

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| `E:/atlas/website` (the site) | **clean, pushed** | `main` at `61f9cb6e`, 0 commits ahead of `origin/main` |
| `E:/atlas` (the design repo) | **clean, no remote** | `81bf5eb`; this repo has no origin, so its commits stay local by design |
| Production | **live and verified** | Two deploys this session. `marginatlas.com/gb` and `www.marginatlas.com/cities/london` fetched and checked for the new cards' own strings |
| The gate chain | **158/158 green** | Last full run 18:17:59, 923s serial. `npm run verify:deploy` |
| Country page (GB) | 15 blocks | page laws 3 (baseline 3), model laws 16 (baseline 18), 0 holes |
| Country page (AF, the thin exemplar) | 15 blocks | page laws 11 (baseline 13), model laws 12 (baseline 12), 0 holes |
| City page (London) | 20 blocks | page laws **0**, model laws 11 (baseline 12), 0 holes |
| Trade / industry / hood pages | untouched this session | their baselines unmoved |
| The archetype harness | 260 instances × 3 widths | 0 design reds, 14 standing data reds (all pre-existing, in DATA-REQUIREMENTS) |

**Believed but not proven:** nothing material. Every claim above was measured
this session; the production claims come from fetching the live pages, not from
the deploy log.

**Half-finished:** nothing is in flight. The brief's remaining twenty rows (trade
and neighbourhood) are written but NOT measured — that is the next step, not an
unfinished one.

---

## 4. How we got here — the decision trail

The session began mid-flight on the trade page's `16 customers` card and moved
through five phases. Each pivot below carries its reason, because the reason is
what usually dies in a handoff.

1. **The customers card forced a new archetype.** A fact grid put its two
   figures at 20 beside a 30, which the FOCAL rule forbids (nothing between 16
   and 30 in a card holding a 30), and the plain fact card carries no 30 at all.
   So `WorkedFigure` was built: one focal at 30 over the figures it is worked
   from at 16. **Reason it matters:** three other cards (`03 permits`, `09
   lasts`, `14 worth`) carry that same row in their baseline and move onto this
   form when their turn comes.

2. **He rejected the first samples sheet**, in his words: "the execution is still
   quite poor... not very digestible... badly executed", and asked for deeper
   rules — "the ratios, the hierarchy, the way that the elements should be
   placed, the distances especially the distances should be clearly defined".
   That produced `DISTANCES.md` (a measured 12-step ladder, drawing sizes, and
   later an alignment law) and `VISUAL-CHOICE.md` (which drawing a shape of data
   gets, and which it must never get). **These two briefs now decide design
   arguments that used to be re-litigated per card.**

3. **He named two faults by hand** — "year swing should have vertical candles"
   and "a lot of white space at firms per 10k people, that section is
   worthless" — and asked the loop to "think very deep for the visual choice of
   each section". Both were fixed and generalised into VISUAL-CHOICE section 0:
   a line interpolates between periods that have no in-between, and a rate with
   nothing to measure it against is not a fact a reader can use.

4. **The unused-field measurement replaced imagination.** `unused_fields.mjs`
   counted 146 of 156 country metrics, 185 of 214 city metrics and 81 of 119
   industry metrics read by nothing. That became the forty-section brief. **This
   is the method to keep**: a section built on a field 198 of 198 countries hold
   is defensible the day it is drawn and is on no other site.

5. **The full-width law was rediscovered the hard way.** `17 exit`, `18 spend`
   and `19 calendar` were each seated full width, each for the same
   honest-sounding reason ("nothing on this page belongs beside it").
   `verify_section_bands` counted the country page at 4 full widths against a
   baseline of 2 and `verify_full_width_sitewide` caught the city at 1 against
   0. His words, twice: *"for every subsection that stretches left to right full
   width, I think we should ban it except hero section."* All three are paired
   now, and the seating law is written into the brief's section 6.

6. **The measurement pass that ended the country and city tens.** Reading the
   remaining rows as numbers rather than as coverage blocked eight of nine
   country rows and eight of ten city rows. The single most valuable finding:
   the bank carries TOP dividend and capital-gains rates on most countries and
   BASIC ones on the United Kingdom (8 and 4) — and no British owner pays 4% on
   a gain. One visibly wrong figure on the one page he looks at is the launch
   bar.

---

## 5. Hard-won truths & mental model

These are the laws this session paid for. A successor who skips them will
re-learn them at the same price.

**On seating a new section**

- **A new section arrives with a seat, or it does not arrive.** Every spine
  page's band cards come in PAIRS. One new card makes the count odd and ends in
  a lone card in a band, which clauses 52 and 53 red and which his own
  2026-09-07 correction calls a major mistake. **Build sections two at a time.**
- **The partner is chosen by measured height, not by subject.** Clause 52 reds a
  card whose last ink stops more than **48px** above its floor — far tighter
  than the page filter's 120×120 hole. `npm run probe:page <render> 1280` gives
  every card's natural height; pick the partner from that table.
- **The probe's blind spot, stated:** a card whose content stretches (a `flex-1`
  slot) reports its stretched height as its natural one, so strip cards read as
  "full" whatever they hold.
- **Clause 64 constrains the ORDER, not just the pairing:** two cards of one
  kind keep a level between them, so a new range strip cannot sit next to the
  old one and a new ranked card cannot sit next to the money card.
- **A short card can take the slack inside itself** — put the drawing in a
  `flex-1` slot and centre it, the way RankedBars lets its rows share the height
  its band hands them. That is how the exit card stands level beside a card 96px
  taller.
- **Where the slack is too large for that, the short card is owed content**, and
  the honest kind is a PLACEMENT (the world's usual band, a count of countries
  that do worse), which the card probably owed anyway.

**On choosing what to build**

- **Coverage finds the candidate; opening the shard finds the section.** A
  metric list carries no tags, no duplicates and no disagreements. Of twenty
  brief rows: four built, eleven owed to data, three already on their page or
  wrong in form — and **two of the four built were found outside the table**,
  by reading the shard.
- **Clause 17: no coined index as a reading.** A 0-100 or 1-10 score invented by
  the bank cannot print. The tiers table's paperwork dots survive only because
  their scale is DEFINED in the legend from the data's own terms.
- **A `placeholder` tag is not a figure.** London is the one city of 252 whose
  demand, first-year and risk blocks are placeholders — which blocks three whole
  sections on the one page the founder looks at.
- **A figure does not print twice on a page** — and a figure that contradicts
  another page's figure for the same concept is worse. The city's
  `labor.employer_social_pct` disagrees with the country's employer on-cost on
  164 of 252 cities; social contributions are national, so that is a fault in
  the bank, not a local rate.

**On the machinery**

- **Ratchets fall only.** Never raise a baseline to pass. A NEW rule's first
  measurement may be seeded with a `DEBUG.md` §7 entry and a reason.
- **Never pipe a verification into a formatter** — write to a file and read the
  file. A pipe hides the exit code of everything left of it.
- **The census cannot see a card an archetype draws.** `census.ts` counts a
  section by its `<Box` in the view, so RankedBars/CompareTable/AnswerCard/
  MarkList cards are invisible to it: it prints 10 country sections where the
  page draws 15. Queued as `ui:census-cannot-see-a-card-an-archetype-draws`.

---

## 6. Dead ends — do NOT retry

| What was tried | Why it is dead |
|---|---|
| Seating a new section full width | His ban of 2026-08-25; two gates count it. Three sections were re-seated this session |
| `C1` the tax table | The bank's UK dividend (8) and capital-gains (4) rates are basic-rate where the rest of the bank is top-rate. Waits on DATA-REQUIREMENTS 88 |
| `C8` pay by level | The ladder puts a British "junior" above the median worker; it is a professional ladder the shard does not label. Waits on requirement 86 |
| `C4` / `Y9` income spread | Already drawn by `13 customers` / the earnings strip, and the bank's city income block is distrusted (item 24: household vs person) |
| `C6`, `C9`, `Y5`, `Y8` | Coined indices, clause 17. C6 cannot be rescued by its order either: the five risk names are identical on all 198 shards |
| `C7` languages | Shares do not sum to 100 (14 to 192 across the bank), so no share bar; the UK holds two rows, below MarkList's floor of four |
| `Y10` lease terms | `04 premises` already draws the deposit, lease term and rent-free months off `realestate.*`; `space.*` is a second source |
| `Y2`, `Y6`, `Y7` | London alone is a placeholder on those blocks; the cards would draw nothing on the exemplar |
| `PayBars` for five roles | Typed for exactly two rows (`"minimum" \| "average"`) against a world maximum. Use MarkList for a ranking whose bars are spent |
| `KvGrid` for a new card | It carries no focal, so it adds a FOCAL finding the ratchet will not allow |
| `RankedBars foot={{items: [], line}}` | With no companions the line draws at 16 in ink2 and shouts. Put the word in the basis instead |
| `spend \| exit` at 1-1 or 3-2, three-card levels on the country page | Measured: every alternative opened a bigger blank than 2-1 |
| A `md:` breakpoint for a card's internal layout | The card's own width decides, not the window. Use a container query (the stepper and the spend head both hit this) |

---

## 7. Critical files & artifacts (the map + reading order)

| # | Path | Role | Read priority |
|---|---|---|---|
| 1 | `E:/atlas/design/loop/build/STATE.md` | **The state of record.** Written before every dispatch; its `step-in-flight` is the session's own summary | **First** |
| 2 | `E:/atlas/design/loop/build/DOCTRINE.md` | How the loop behaves. Section 16 is the standing instruction (decide, build, record, never ask him to look) | **First** |
| 3 | `E:/atlas/design/loop/build/briefs/NEW-SECTIONS-2026-09-23.md` | The forty-section brief. **Sections 6, 7 and 8 are this session's payload**: the seating law, and the country and city tens measured row by row | **First** |
| 4 | `E:/atlas/design/loop/build/briefs/MODEL.md` | The constitution. PART 8 is the per-page spine (8.2 country, 8.3 city, 8.6 trade); PART 9 is the numbered clauses (17, 50–58, 64, 65) | High, by section |
| 5 | `E:/atlas/design/loop/build/briefs/VISUAL-CHOICE.md` | Which drawing a shape of data gets, and which it must never get | High |
| 6 | `E:/atlas/design/loop/build/briefs/DISTANCES.md` | The distance ladder, drawing sizes, type ratios, placement, §5.7 alignment | High |
| 7 | `E:/atlas/design/loop/build/QUEUE.md` | The work queue. Rows marked `HIS` are founder decisions, not loop work | High |
| 8 | `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` | What the data track owes. **23 (widened today), 86, 87, 88** are this session's | High |
| 9 | `E:/atlas/website/src/lib/spine/country_spend_rows.ts` | The exemplar builder: header names the field, coverage, form, withholding | Medium |
| 10 | `E:/atlas/website/src/lib/spine/city_crew_rows.ts` + `city_texture_rows.ts` | The two newest builders, same shape | Medium |
| 11 | `E:/atlas/website/src/components/spine/country/country-view.tsx` | The country page's composition; the seat comments carry the measurements | Medium |
| 12 | `E:/atlas/website/src/components/spine/city/city-view.tsx` | The city page's composition | Medium |
| 13 | `E:/atlas/website/scripts/harness/check_page_laws.mjs` | Clauses 50–58, 64, 65 as code. Read `isVisual`, `VISUAL`, and the KIND block before composing a level | Medium |
| 14 | `E:/atlas/website/scripts/audit/unused_fields.mjs` | The instrument that finds candidates, with its blind spot stated | Medium |
| 15 | `E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-19-dossier.md` | The previous dossier; authoritative for anything this one does not touch | Reference |
| 16 | `E:/atlas/rules/FORM-CATALOG.md` | Every archetype, its law, and what it must never do | Reference |
| 17 | `E:/atlas/rules/FOUNDER-VERDICTS.md` | His rulings, dated, in his words | Reference |

---

## 8. Open threads & next steps

**Committed next step (pre-authorized, no need to ask):**

1. **Measure the trade (T1–T10) and neighbourhood (N1–N10) brief rows the way
   the country and city tens were measured.**
   *Why:* the brief's table was compiled from a metric list; sixteen of the
   first twenty rows turned out to be blocked once the shards were opened, and
   there is no reason to think the other twenty are cleaner.
   *Where:* `E:/atlas/design/loop/build/briefs/NEW-SECTIONS-2026-09-23.md`
   sections 3 and 4; the shards are `data/facts/industry/*.json` and the city
   shards' district fields.
   *How to check each row:* open the exemplar's shard (London restaurants for
   the trade page), read the tag (`placeholder` kills it), check the figure
   against a number you can verify, grep `src/` for the metric (already drawn
   kills it), and hold the form against `check_page_laws.mjs`'s kind counts for
   that page.
   *Then:* build any clean **pair** (never one card), seat it by the rules in
   section 5, and record it in MODEL PART 8, the brief, and the form catalogue.
   *Verify:* `npx tsc --noEmit`, render, the three checkers, the archetype
   harness, then the gate subset. Every ratchet at or under baseline.

**Open, in priority order:**

2. **`country:off-the-books`** (QUEUE): the share of the economy that never
   reaches the state, `informal_economy_share_pct` on the country profile, 197
   of 197, 7 in Switzerland to 64 in Nigeria, UK 11, 176 distinct values. A
   ring, which the country page does not yet draw. **Blocked only on a
   partner**, which requirement 88 unblocks (C1).
3. **The data requirements**, in the order that unblocks the most: **88** (two
   tax rates on one basis → C1, which pairs with the ring), **86** (the pay
   ladder's scope → C8), **23 widened** (London's demand, first-year and risk
   blocks → three city sections), **87** (a risk figure that is not a score).
4. **Six `HIS` rulings** sit in the QUEUE and are not loop work:
   `launch:exemplar-url-serves-the-july-page` (/gb/london/restaurants still
   serves the July page; the rebuilt trade page is at /gb/london/barbershops),
   `launch:ruling-30-or-the-seat`, `country:character-pair-vs-clause-64`,
   `ui:industry-page-is-a-dead-end`, `ui:trail-repeats-the-hero-crumb`,
   `launch:publish-the-form-catalogue`.
5. **`ui:census-cannot-see-a-card-an-archetype-draws`** (QUEUE): the loop's own
   map of the country page says 10 sections where the page draws 15.
6. **`ui:alignment-audit`**, **`ui:reading-on-every-point`** and the other `ui:`
   rows from the interface-layer brainstorm remain TODO.

---

## 9. Constraints, guardrails & operator preferences

**Never, without his word in this session:**
- push, build (`npm run build`), or deploy
- `--no-verify`, force-push, rename a URL slug
- raise a ratchet baseline

**Never, full stop:**
- print a plausible number. A fill is withheld; modelled says modelled; every
  figure names its file, field and tag
- claim what production serves without fetching it
- em-dashes in user-visible source; source-agency names in copy; raw hex or px
  in components
- a "not gathered yet" card in front of him (his word, 2026-09-19)
- open a browser or dev server to show him work (his standing rule) — deliver a
  standalone file, an inline render, or a URL
- subagents commit anything under `E:/atlas`

**How he works:**
- DOCTRINE 16: the loop decides everything, builds, records reversibly, and
  never asks him to look or to choose. Reserve questions for things only he can
  answer, and put them in the QUEUE as `HIS` rows instead of asking.
- The UK is the only surface shown to him. A section that does not draw on
  London or GB is a section he cannot see.
- His standard for a section (2026-09-19): a named pain point, a figure with its
  computation named, the fields distinguished from research, the form and the
  seat, and the withholding rule.
- Reports: plain, technical, no jargon, no hype. State failures plainly.

---

## 10. Environment & reproduction

```bash
# the site
cd E:/atlas/website
npx tsc --noEmit                      # typecheck, ~40s

# render the eight harness pages (needs the harness env + font stub)
node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json \
  --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs \
  scripts/harness/render_page.tsx --list

# the three page checkers (run after every render)
node scripts/harness/check_page_laws.mjs --list
node scripts/harness/check_page_holes.mjs --list
node scripts/harness/check_model_laws.mjs --list --ratchet

# every card's natural height, for choosing a partner
node scripts/harness/probe_page.mjs scratchpad/harness/pages/city-london.html 1280,768,375

# the archetype sheet (260 instances x 3 widths)
node scripts/harness/harness.mjs archetypes

# a subset of the gate chain by exact name
npx tsx scripts/prebuild_all.ts --concurrency=1 --only=harness-page-laws,section-bands

# the whole chain before a push (158 gates, ~16 min serial)
npm run verify:deploy

# watch a deploy land (DEFAULTS TO /gb — pass --url for another page)
npm run deploy:watch -- --marker="<a string the new code puts on the page>" --url=/gb
```

**The memory floor.** `verify:deploy` refuses under **1,100 MB free** because a
browser gate that dies mid-screenshot reads as a false red. Free memory on this
machine swings between 400 MB and 1,900 MB as Edge and other apps breathe.
`E:/atlas/website/scratchpad/step23/wait_then_chain.mjs` polls and launches the
chain in the same process the moment it clears, which avoids the gap between the
check and the start. A single browser gate needs only 620 MB, and
`--concurrency=1` lowers the floor to that.

---

## 11. Landmines & gotchas

- **`spawnSync` cannot run `npm.cmd` on Windows** without a shell: it returns
  status `null` and runs nothing. The first chain runner reported "chain exited
  null" and had done nothing. Call `process.execPath` with the script.
- **`deploy:watch` fetches `/gb` by default** and does not follow the apex →
  `www` redirect on other paths. For a city-page marker, fetch the live page
  directly with `curl -L -A "<a browser UA>"` and grep it.
- **Bash heredocs on Windows mangle backslashes and unicode.** Write Python or
  Node via the Write tool instead of a heredoc for anything with escapes.
- **A Python edit script that asserts late writes nothing.** One run this
  session inserted imports, pickers and story blocks, then died on the last
  assertion and saved none of it. Assert everything up front, or write in stages.
- **An element cannot query its own width.** `[container-type:inline-size]` goes
  on the CARD, not on the grid inside it.
- **Tailwind class strings must be literal.** The stylesheet compiler scans
  source; a template-assembled class generates nothing.
- **A stray `.ts` file in `scratchpad/` breaks `tsc`.** Delete probes before the
  typecheck.
- **The `archetype-copy` gate runs ~250s** and has timed out at 360s under
  memory pressure. It passes when run directly; if the chain reports TIMEOUT on
  it, re-run it alone before believing a red.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **the loop** | The build loop: the working method in `design/loop/build/`, governed by DOCTRINE.md |
| **spine page** | One of the six rebuilt page types: country, city, neighbourhood (hub and district), trade-in-city ("cell"), industry, how-to |
| **archetype** | A named, gated card component in `src/components/spine/archetypes/` with its law in its own header |
| **the kit** | `src/components/spine/kit.tsx`: Band, Box, Rail, Fig, Ico, and the splits (`1-1`, `2-1`, `1-1-1`, …) |
| **band / level** | A `Band` is the markup; a LEVEL is what the page laws measure — a row of cards at one height |
| **the harness** | The renderers and checkers in `scripts/harness/`: page renders, the archetype sheet, the three checkers |
| **the chain** | The 158-gate prebuild chain (`scripts/prebuild_all.ts`), run on every Vercel build and locally by `verify:deploy` |
| **ratchet** | A baseline count a gate holds a page to. It may fall and must never rise |
| **the fact bank** | `data/facts/{country,city,industry}/*.json`, read through `src/lib/facts/` |
| **tag** | A fact's trust: `held` (gathered), `modeled`, `extrapolated`, `placeholder` (a slot awaiting research; never printed) |
| **focal** | The one figure at 30px every section card takes (PART 4) |
| **the three loud moments** | At most three accent figures a page (PART 6) |
| **clause N** | A numbered rule in MODEL.md PART 9 (17 = no coined index; 50–58 = his page laws; 64 = kind adjacency; 65 = lone figure) |
| **DATA FIRST** | A brief row that is a research request, not a build row |
| **HIS** | A QUEUE row that is the founder's decision to make, not the loop's |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. Why can a new section never be added to a spine page one card at a time, and
   what are the two numbers that decide which card it pairs with?
2. What does `placeholder` mean on a fact, and which page does it currently
   block three sections on?
3. Name three reasons a brief row that looked clean on coverage turned out to be
   unbuildable, each with the rule behind it.
4. What is the one thing you must never do to a ratchet baseline, and what is the
   one exception?
5. Which two things must happen before a push, and who authorizes it?
6. Where is the state of record, and what does DOCTRINE 16 forbid you from asking
   the founder?
7. What is the committed next step, and how will you verify each row you measure?

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com — the build loop (new sections, measured)
Working directory: E:/atlas/website  (the design repo is its parent, E:/atlas)
Handoff dossier (read this FIRST, in full): E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-23.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   - E:/atlas/design/loop/build/STATE.md  (the state of record; read its step-in-flight)
   - E:/atlas/design/loop/build/DOCTRINE.md  (section 16 especially)
   - E:/atlas/design/loop/build/briefs/NEW-SECTIONS-2026-09-23.md  (sections 6, 7 and 8)
   - E:/atlas/design/loop/build/briefs/VISUAL-CHOICE.md
   - E:/atlas/design/loop/build/briefs/MODEL.md  (PART 8's spine for the page you touch, PART 9's clauses)
   - E:/atlas/design/loop/build/QUEUE.md  (rows marked HIS are not yours)
   - E:/atlas/design/loop/build/DATA-REQUIREMENTS.md  (items 23, 86, 87, 88)
   - E:/atlas/website/src/lib/spine/city_crew_rows.ts  (the shape every builder takes)
   - E:/atlas/website/src/components/spine/city/city-view.tsx  (how a seat is composed and recorded)
3. Do not edit anything, run anything destructive, or make decisions until steps 1–2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5–10 lines — the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files —
   the dossier is a point-in-time snapshot and the code/data is ground truth.
6. Then stop and wait for my go, unless the dossier's "Open threads" marks a committed
   next step I've pre-authorized — in which case state what you're about to do and begin.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly. If anything in the dossier is unclear, ask before acting — but only after
you've read everything above.
```
