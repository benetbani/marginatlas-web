# HANDOFF: marginatlas.com, 2026-09-25 (the UK page goal and his page-agnostic sections)
The UK country page taken through his five faults and a polish pass, and every section of his list of that night built or ruled out, most of them seated. Production is `7eb744b4` (deployment 6664521457), nothing ahead of origin. Written 2026-09-25, about 17:50.

> **How to use this document.** Read top to bottom once, then the files in section 7 in order. Do not start work until you can
> answer the checklist in section 13; the re-hydration prompt is section 14. `E:/atlas/design/loop/build/STATE.md`
> (`step-in-flight`) is the state of record and is newer than this file whenever they disagree.

## 1. TL;DR

marginatlas.com is a world atlas of what it costs to open and run a small business, by country, city, district and trade. On
2026-09-25 the founder set the goal "make only the page of the United Kingdom as a country at the highest quality ... polished and
perfect", then sent a list of new sections to build "page agnostically, we will decide later where to put them", five faults on
the UK page, a demand for symbols over words, and "several quality checks ... so the harness is respected fully". Twice he
delegated the open decisions ("idk-you-choose-pusg-forward", then "move-forward").

Shipped today, batches 20 to 32, every one through the full 166-gate chain and fetched on production: the five faults (a pie in
the hero, the spending bar, flag room, row alignment, fewer words); real photographs (Wikimedia Commons public domain or CC0) on
the UK hero and its seven city cards; nine page-agnostic sections plus two more (obstacles, spending by income from the ONS
workbooks he let us download); their seats on the UK page and on the UK's barbershop, cafe, restaurant, hairdresser, nail,
tea-house and grocery trade pages; and a polish pass. The UK page's model-law count fell 7 to 3; its page laws, holes and copy
are at 0.

**Waiting on him, one word each (QUEUE):** `sections:origin-vs-people-foot` and `country:register-fee-three-prints`. **Next for
the loop:** the UK page's last three FOCAL rows are his kept forms (two character tables, the city cards), so they are proposals,
not edits; "how customers come" has no page that asks both its questions; opening hours, the top 1%, customer types,
accounting by city, walk-in conversion and the technical trade sections have no usable figures.

## 2. Mission & success criteria

- His goal of the day, verbatim in the transcript and in `design/loop/build/goal-2026-09-24/PLAN-2026-09-25-sections-and-symbols.md`
  (his message quoted in full at its head): the UK country page at the highest standard, all the constitution and the harness.
- Standing rules (unchanged): decide, build, verify, record, commit, ship in green batches; photos at 1280 and 375; a question only
  he can answer becomes a HIS row in QUEUE; STATE current; never ask him to look.
- The NEVER list (his): invent, round up or print a placeholder figure; print one figure twice, or let two pages disagree; a
  coined index as a reading; a "not gathered yet" card on a UK page; em dashes, statistics-body names, raw hex or px; the home
  page; a renamed URL; a claim about production without fetching it; a browser or dev server to show him work.
- His design laws in force: labels never sentences (four-word titles, three-word row labels); a share of a whole is drawn; the
  accent marks the answer only (two accent marks a card); page laws clauses 50 to 58 and 64 (three cards a level, one or two
  drawings a level, a kind of drawing twice a page and a level apart, parts behind a plus); no full-width section except the
  hero, the close and a sanctioned wide table (his ban of 2026-08-25).

## 3. Current state

| Component | Status | Notes |
|---|---|---|
| Production | `7eb744b4`, deployment 6664521457 | /gb, the trade pages and /gb/london/grocery-stores fetched |
| Website `main` | 0 ahead | remote benetbani/marginatlas-web |
| Design repo `p4-seam` | committed through the handoff's own record | `E:/atlas`, no remote |
| Chain | 166 of 166 at `7eb744b4` in one serial run | `scratchpad/deploy/chain.txt` |
| UK page laws / model laws / holes / copy | 0 / 3 / 0 / 0 | the 3: FOCAL on `#character`, `#character-people`, `#cities` |

Where each of his sections stands (the plan's status table has the commits):

| His ask | Section | Seat |
|---|---|---|
| stock at four tiers | StockTiers | UK barbershop and cafe pages, beside the lines |
| opening hours | not built | chains publish only their own hours |
| local apps | LocalApps (figure: apps founded here) | UK grooming, eating-out and grocery trade pages, beside spending by income; the booking apps on grooming pages only |
| first-year survival factors | FirstYears, Obstacles | UK page, 04 The first years |
| first-year thresholds | Thresholds | trade pages beside the kit or the market (never the country page: it repeats the hero's VAT line) |
| top 1% | not built | not found |
| three customer types | not built | not found for barbering |
| accounting by city | not built | one firm's prices a city |
| walk-in conversion | not built | not found |
| customers by transport | CustomersCome | not seated (no page asks both its questions) |
| by age | AgeMix | UK page 03, beside the job market |
| by purchasing power | SpendByIncome | trade pages, beside the apps |
| by origin | Origin | HIS: its figure is the people table's foot |
| market dynamics | MarketHold, JobMarket | the grocery pages; UK page 03 |
| technical sections | not built | grade-D sources only |

## 4. How we got here (the decisions and why)

- **Photographs from Wikimedia Commons, public domain or CC0 only**, found through the Commons API, because "no stock imagery" is
  a hard rule (Unsplash and Pexels keys exist in `.env.local` and are banned for this). Credits in `data/cities/images_credits.json`.
- **Seats chosen so nothing prints twice and every level holds a drawing:** the job market takes the unemployment rate from the
  employment card (which takes statutory maternity pay, a new held fact with its gov.uk source); the thresholds stay off the
  country page; born abroad stays unseated.
- **What holds firms back became its own card, as columns:** stacked under the survival curve it doubled the card's height, and
  the UK page already draws two bar lists (clause 55).
- **Spending by income from ONS workbook 1, Table A6**, which holds the detailed items by income tenth (hairdressing and beauty,
  restaurant and cafe meals, food and drink); research R4 had marked it not found. The one computed figure is the richest fifth's
  share of the spending.
- **The polish pass photographed every level at 1280 and 375** and fixed what read wrong: the cost of living's twenty blocks
  (his "cubic bars") now a track like the electricity's; seven legal-and-admin cells to six; tied margin leaders both marked;
  London's long trade names shortened; the margins card's figure is the middle trade's (10.5%).

## 5. Hard-won truths

- The chain is the authority; the page harness (`harness.mjs page`, `check_page_laws`, `check_model_laws`, `check_copy_plain`)
  finds most of it earlier, but the chain caught eleven real faults today that the targeted runs did not (section 11).
- A seat is measured, never assumed: heights, a level's visuals, the kinds on the page, and whether any figure repeats
  (`scratchpad/b24_twice.mjs` is the probe: same money or percent in two cards).
- His machine often has under 1,100 MB free because of his own applications. The loop never closes them.

## 6. Dead ends (do not retry)

- A region fallback file for covered cities with no draft row: archetype-copy holds a card's region to the draft alone.
- A manifest under `data/countries/`: the cell lattice reads that folder as its country files.
- Full-width seats for the apps or the kit: his full-width ban; the trade page's R1 allows three full widths only.
- Equal rows (`auto-rows-fr`) for fill: every row at the tallest one's height on a phone.
- A bar list for the obstacles on the UK page: a third bar list.
- Origin on the country or city page as it stands: born abroad would print twice.

## 7. Critical files (reading order)

| # | Path | Role |
|---|---|---|
| 1 | `E:/atlas/design/loop/build/STATE.md` | state of record, `step-in-flight` |
| 2 | `E:/atlas/design/loop/build/QUEUE.md` | the HIS rows, `sections:seats-2026-09-25` |
| 3 | `E:/atlas/design/loop/build/goal-2026-09-24/PLAN-2026-09-25-sections-and-symbols.md` | his message verbatim, the status table |
| 4 | `E:/atlas/rules/FORM-CATALOG.md` VERSION 7 | every new form, its law and seat |
| 5 | `src/components/spine/country/country-view.tsx` (the `rich` branch) | the UK page's composition |
| 6 | `src/components/spine/cell/cell-view.tsx` | the trade page's seats (kit or market beside the lines; apps beside spending) |
| 7 | `src/components/spine/sections/*.tsx`, `src/lib/spine/sections/*.ts`, `data/sections/*.json` | the page-agnostic sections |
| 8 | `E:/atlas/design/loop/build/research/2026-09-25-*.md` | sources, including the official figures table (row 26 added) and R4's workbook addenda |

## 8. Open threads

1. **His two rulings** (QUEUE): origin versus the people table's foot; the $133 registration fee in the hero, the legal-form table
   and the bill. Nothing to do until he answers.
2. **The UK page's three FOCAL rows**: the character tables' feet at the body rung and the city cards gallery have no 30px figure.
   Each fix changes a form he kept; write the proposal in QUEUE rather than editing.
3. **How customers come**: seat it where a page asks both questions (a retail trade page, beside a card that is not a bar cut
   into parts), or leave it on the sheet.
4. **More ONS data** (downloads are allowed): survival by industry (Business demography reference table) for the trade pages'
   own curve, unemployment by previous industry (UNEM03), main mode for shopping trips (NTS).
5. Verify each: page harness on the page, then the serial chain, push, fetch production, photos at 1280 and 375.

## 9. Guardrails

Never `--no-verify`, never force-push, never rename a URL, never raise a ratchet baseline (lower it with `--write-baseline`
when a count falls), never pipe a verification into a filter, subagents never commit, the API keys in `.env.local` are never
printed, no browser or dev server to show him work (photos by SendUserFile are fine), never close his applications.

## 10. Environment

- Render a page: `node scripts/harness/harness.mjs page --only=<page>`; an unlisted trade page:
  `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx cell gb london <slug>`,
  then `check_page_holes.mjs`, `check_page_laws.mjs`, `check_model_laws.mjs`, `check_copy_plain.mjs` on the file.
- One story kind: `node scripts/harness/harness.mjs --only=<kind>`.
- The chain: `node scratchpad/step23/wait_then_chain.mjs <floor> <minutes>`; when memory will not clear 1,100 MB, run the same
  serial list directly, `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail > scratchpad/deploy/chain.txt`,
  and rerun a gate that timed out alone at the same commit with `npx tsx scripts/prebuild_all.ts --only=pages-fresh,<gate> --concurrency=1 --no-bail`.
- Deploy watch: `MSYS_NO_PATHCONV=1`, `gh api repos/benetbani/marginatlas-web/commits/<sha>/status`.
- Production: `/gb` answers a bare curl; trade pages need a browser user agent (the bot filter's 403).
- Photos of production: `scratchpad/b25_live_bands.mjs <url> <prefix> <width> <card ids...>`.

## 11. Landmines (each hit today, each fixed at its source)

- `data/countries/` is the cell lattice's folder (X2).
- archetype-copy holds a city card's region to the draft.
- CardPager with photographs needs 12rem tracks or names are cut.
- The radius scale: 12px a card, 8px or under a control (`rounded-sm`), or a pill; `rounded-lg` is 16px here.
- The distance ladder has no 6px (`gap-1.5`).
- Art direction H3: three rows reading the same value (say "All free" once).
- `data-parts` means parts behind a plus to the page laws (clause 58); a drawing that shows its parts stamps `data-wedges`.
- ALIGNMENT: one parent's rows in two grid columns stand on two right edges; draw two lists.
- `main li` carries the prose measure (globals.css): grid rows need `max-w-none`.
- LABEL GAP's second half reds any `justify-between` class holding a figure or a row on a card over 420px; spread with
  `content-between` on a grid instead.
- A card that grows stretches its neighbour: the gathered-emptiness gate (E6) finds the hole the neighbour opens.
- A JSX comment inside a `.map((x) => ( ... ))` return is a parse error; put it above the map.
- `tsc` exiting 134 is memory, not types.

## 12. Glossary

Level: a Band, one row of cards. Seat: where a section stands. Focal: a card's one figure at 30px (PART 4). The chain: the
166-gate prebuild list. HIS row: a QUEUE row only he can close. Kit: StockTiers. Lines: Thresholds.

## 13. Successor checklist

1. What is production's commit, and how was it proven?
2. Which two rulings are his, and what are their options?
3. Why is Thresholds not on the country page?
4. What do you do when `verify_deploy` refuses on memory?
5. Which three model-law rows remain on the UK page, and why are they proposals, not edits?
6. Where do the page-agnostic sections live, and how does the census read them?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff so you can continue with zero context loss.
Do NOT start work yet.

Project: marginatlas.com (the UK page goal of 2026-09-25 and his page-agnostic sections)
Working directory: E:\atlas\website (the design repo is E:\atlas)
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-09-25.md

1. Read the dossier top to bottom.
2. Then read, in order: E:/atlas/design/loop/build/STATE.md; E:/atlas/design/loop/build/QUEUE.md (the HIS rows and
   sections:seats-2026-09-25); E:/atlas/design/loop/build/goal-2026-09-24/PLAN-2026-09-25-sections-and-symbols.md;
   E:/atlas/rules/FORM-CATALOG.md VERSION 7; src/components/spine/country/country-view.tsx (the rich branch);
   src/components/spine/cell/cell-view.tsx.
3. Edit nothing and run nothing destructive until 1 and 2 are done.
4. Answer the dossier's section 13 in 5 to 10 lines.
5. Flag any contradiction between the dossier and the files; the files win.
6. Then carry on with section 8's open threads without waiting, deciding for yourself, and put any question only the founder can
   answer into QUEUE as a HIS row.
```
