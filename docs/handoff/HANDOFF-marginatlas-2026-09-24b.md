# HANDOFF: marginatlas.com, the goal of 2026-09-24 (evening checkpoint)
Seventeen batches of his goal shipped; this session shipped eleven to seventeen, all proven on production at `42ae3c87` (deployment 6647237952). Nothing committed ahead of origin. Written 2026-09-24, about 22:25.

> **How to use this document.** Read top to bottom once. Then read the files in
> section 7 in the given order. Do not start work until you can answer the
> checklist in section 13. A ready-to-paste re-hydration prompt is in section 14.
> `E:/atlas/design/loop/build/STATE.md` (`step-in-flight`) is the state of record and
> is newer than this file whenever the two disagree.

## 1. TL;DR (read this first)

marginatlas.com is a world atlas of what it costs to open and run a small business, by country, city, district and trade. The founder (called "he" in the records, by his own usage) set a standing goal on 2026-09-24: make the main UK pages richer, sharper and more exact, item by item, shipped in green batches, working alone, never asking him to look or choose. That evening he added a correction on every card's words: section names and subtitles were "bullshit", sentences were "bland" and "mechanical", disclaimers "disgusting", and lines "all competing". He banned words like "modelled" and "withheld" and asked for plain language that answers the visitor at that second, with the harness enforcing it.

This session answered that correction on every main page, ships it (batches fourteen to fifteen), and then kept going on honesty and layout (sixteen and seventeen). The copy gate (gate 166) reads every card at 0 on all nine harness pages; its baseline file is empty, so any new method word or second line is a red. Production matches `main` at `42ae3c87`.

**The next committed item is D7, "the answers on a level at one height"** (BACKLOG D7, QUEUE `ui:the-answer-line`). It is measured, and it has a recorded conflict with the kit's rule that air is spread across a card rather than gathered at its foot. So it closes level by level, only where a card can fill its own height.

Lane C (new sections) has nothing clean to build today: every field is drawn or blocked, per NEW-SECTIONS-2026-09-23 sections 9 and 10, and C1 is blocked on DATA-REQUIREMENTS item 90.

## 2. Mission & success criteria

His goal, in his words (the full text is in `design/loop/build/goal-2026-09-24/GOAL.md` and was restated in his check-ins):

> "Make marginatlas.com's main pages richer, sharper and more exact, relentlessly and professionally: new sections chosen by measurement, existing sections improved, blockers cleared, shipped in green batches. You work alone. Decide, build, verify, record, commit, ship, then take the next item. Never ask me to look or choose: a question only I can answer becomes a HIS row in QUEUE.md and you carry on."

- **Main pages, and the UK is the only surface he looks at:** `/gb`, `/cities/london` (`/gb/london` 308-redirects here), `/gb/london/barbershops`, `/industries/restaurants`, `/cities/london/neighborhoods` and its districts, and `/gb/how-to-open`.
- **Lanes, in order:** A honesty and live faults; B improve existing sections; C new sections; D interface rows; E systems that make the next section cheaper.
- **Each item:** STATE first, measure, build through an archetype, verify, record, commit each step in both repos (staged by path).
- **Ship:** after every 2 to 4 green items. Run the whole chain through `scratchpad/step23/wait_then_chain.mjs`. If every gate passes, push `main`, match the deployment's full SHA, fetch the live page and prove the change. A red stops the push and becomes the next item.
- **Report after every shipped batch:** five plain lines, plus one photograph per changed section at 1280 and 375, sent with SendUserFile.
- **NEVER** (his list): invent, round up or print a placeholder figure; print one figure twice, or let two pages disagree; a coined index as a reading; a "not gathered yet" card on a UK page; em dashes, statistics-body names, raw hex or px; the home page; a renamed URL; a claim about production without fetching it; a browser or dev server to show him work.
- **His copy correction of the evening** is rules/FOUNDER-VERDICTS.md's newest entry and `design/loop/build/goal-2026-09-24/COPY-STYLE.md`. A card has three parts: a title of at most four words in the visitor's words; a figure and its label; at most one supporting line of twelve words or fewer, one sentence, no semicolon, never saying how the number was made. The honesty note appears once per page. Absence lines are plain ("No figure for the bill yet.").

## 3. Current state: ground truth (2026-09-24, 22:25)

| Component | Status | Notes |
|---|---|---|
| Production | `42ae3c87`, deployment 6647237952 | fetched and proven by `website/scratchpad/prove17.mjs` |
| Website `main` | 0 ahead of origin | `E:/atlas/website`, remote `benetbani/marginatlas-web` |
| Design repo `p4-seam` | committed through `48bae63` | `E:/atlas`, no remote; `design/loop/build/PAGES.md` was modified before this session began and is left alone |
| The chain | 166 gates, green on every push | `npm run verify:deploy`; about 530 s |
| Copy gate (166) | 0 on the nine harness pages at 1280 and 375 | `scripts/harness/copy_plain_baseline.json` is `{}` |
| Page holes | 0 on the nine | |
| Page laws | at baseline everywhere; country-AF 11 against 13 (can fall) | |
| Model laws | at baseline; the district pages fell 15 to 1 this session | |
| Archetype harness | 260 instances, 0 design reds, 14 standing data reds | the data reds are recorded in DATA-REQUIREMENTS |
| The 138 London trade pages | 2 page-filter reds, both older `#split` at 1280 (auto-dealers, game development studios) | `npx tsx scripts/sweep_trades.ts`; BACKLOG B12's last row |
| Trade heroes | 120 of 138 show "Not known yet" in the hero | his row `cell:hero-not-measured` |

**Shipped this session** (every batch was proven on production; the report photos are in `E:/atlas/design/loop/build/photos/b14-*` to `b17-*`):

| Batch | Head | What |
|---|---|---|
| 11 to 13 | `705bf6b4`, `f52e311e`, `5f6f0fa5` | A10 and A11 (the benchmark's set, row names), B6, E1, B12 rows (see the 2026-09-24 afternoon handoff) |
| 14 | `2d3233d7` | A13 (one main, one gutter: production had served every spine page 1024 wide at 1280 and 295 on a phone), A14 (copy gate 166), A15 (the trade and industry pages in plain words) |
| 15 | `e0fce4df` | A16a (country pages; the hero's promise line out, the tax on profit drawn), A16b (the city, district and how-to pages; the city hero's pay placed among cities), A19 (the district pages' "we don't know yet" card off), A17 (short-term rental management moved to hospitality; the rank carries its count) |
| 16 | `73bcfcd1` | B14 (the survival card draws its hundred), A20 (the cost to open's empty line), B15 (three licence waits fill their card), E10 (the sweep sees the plain words and refuses a filter that did not run) |
| 17 | `42ae3c87` | A18a (the district "side by side" table, fourteen second prints, off), A18b (London's rent-against-income card without the income) |

## 4. How we got here: the decision trail

1. **His copy correction came mid-goal.** The copy gate went in first (A14), then the rewrite page by page (A15, A16). The measurement behind it: 76 cards, 127 small supporting lines, and 38 cards carrying a method word, on the seven UK pages. Some gate laws had required the old words ("the foot says modelled"). Each was turned over to the new rule, never deleted: the law now requires no method word. This is why `verify_archetype_copy.ts`, `tests/spine/entry_bill_guard.test.ts` and others read "TURNED OVER 2026-09-24".
2. **Removing a line can open a hole, and the hole is filled by drawing the answer, never by bringing a line back.** The country hero's promise line left 323 by 144 of air, so the tax on profit is now drawn under its figure (his law of 2026-09-19: "a share of a whole is drawn"). SegmentBar's new bare form draws it without a label row, so the figure is never printed twice. The city hero's subtitle left 323 by 162, so the city's typical pay is placed among the covered cities. Both are `answerBar` on HeroBoard (see FORM-CATALOG).
3. **The NEVER list decides his open rows where it speaks.** Row `cell:not-gathered-seats` had held the district "What lifts sales most" seat for his line since 2026-09-20. His goal's NEVER list ("a 'not gathered yet' card on a UK page") is that line, so the seat left (A19). The notes now sit beside the exit, and the district floor fell 7 to 6.
4. **"Print one figure twice" was measured, not guessed** (`website/scratchpad/_figure_twice.mjs`, A18). Two kinds of repeat are accepted as his own compositions: the hero summarising a card below it (his hero board's rows), and a comparison table's home row. Coincidences are ignored. Three cases were left: the district compare table (off, A18a), London's runway income (off, A18b), and the UK's pay pair (his row `country:median-pay-two-names`).
5. **The long tail is read by the sweep, not the harness.** The harness renders two trade pages; the sweep renders all 138 London trades. The sweep found the bakery licence hole (B15). It had also been blind to the new words and to a crashed filter (E10).
6. **A taxonomy fault showed through the copy.** "Short-term rental management" led the restaurants' "Similar trades" card as a "food and drink" trade. Its own `parent_id` is `hotels_lodging`, so it moved to hospitality (A17). No URL changed.

## 5. Hard-won truths & mental model

- **The copy rules (COPY-STYLE.md) are gated, not advisory.** Gate 166 `harness-copy-plain` reads each visible card at 1280 and 375. It checks for banned words, allows one line under 13.5px (two in the page's hero), a title of four words or fewer, and lines of twelve words or fewer with no semicolon. Its blind spot is meaning: a plain line that says nothing passes. The echo and reading-grade proxies were tried and withdrawn (E9).
- **Emptying a copy string needs a guarded component.** Builders return `""` for a removed line, and every component prints a line only when it is non-empty (`{x ? <p>…</p> : null}`). Where a builder joined clauses with `"; "`, the join changed to a sentence per clause, or to the first clause.
- **The data tag stays on the cell; the word stays off the page.** `confidence: "modeled"` and the gates that read it remain. Only the visible words went.
- **A page's block floor is lowered only by a ruled removal, never by a build.** Precedent: trade 14, city 16 and industry 11 on 2026-09-20; today the district floor went 7 to 6 (works seat), then 6 to 5 (compare table). See `FLOOR_BY_SURFACE` in `scripts/harness/check_model_laws.mjs`, each value with its reason.
- **Centring is deliberate.** When a level stretches a card, its content centres so the air splits above and below ("the emptiness is distributed, not gathered", BentoMetric's law), which keeps the foot under clause 52's 48px. This is why D7 is hard.
- **Where the harness can't read, measure by hand.** Examples: `measure_levels.mjs` for the answer heights, `_figure_twice.mjs` for duplicates, `_cardtext.mjs` and `_cardall.mjs` for card text, `_hoodh.mjs` for the district cards' heights. All are in `website/scratchpad/`.
- **Production waits on React's batched reveal.** At `load` the cards can still be hidden, so every prove script waits for a laid-out `main [data-card]` before measuring.

## 6. Dead ends: do NOT retry

- **Opening the licence fees under a thin licence card.** The fees are tier words ("Medium fee", "Low fee"), and his ruling says no word where a number goes. The rows fill instead (B15).
- **ShareBar for the tax on profit.** It colours the largest part in the accent, which would light "You keep 80%" instead of the tax. The bare SegmentBar is the form.
- **A SegmentBar with its label row under the hero figure.** It prints the figure twice.
- **The echo and Flesch-Kincaid proxies as gates** (E9). They flag unit lines the rules keep and rate four-word titles as grade 9.6.
- **C1 on the register's district medians** (built on 2026-09-24 as `397b67d9`, withdrawn as `34a72aec`). They contradict the trade pages' modelled spread; see DATA-REQUIREMENTS item 90. Do not swap the trade pages' typical takings for the register's medians either: those are a broader class of every registered enterprise, not a typical going concern, and the row names that choice as his.
- **Fixing the two auto-dealer and game-development `#split` holes by changing the band or the two-abreast threshold.** Either moves all 138 pages. Measure on the sweep first.
- **Opening a plus on arrival.** His rule is that a plus is closed on arrival.

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `E:/atlas/design/loop/build/STATE.md` | `step-in-flight`, the state of record | first |
| 2 | `E:/atlas/design/loop/build/goal-2026-09-24/GOAL.md`, `SELECTION.md`, `BACKLOG.md` | his manual; how a section is chosen; the ranked work with evidence (D7, B12, A18, B14, B15, E9, E10 written this session) | first |
| 3 | `E:/atlas/design/loop/build/goal-2026-09-24/COPY-STYLE.md` | his copy correction as rules, with sources | first |
| 4 | `E:/atlas/rules/FOUNDER-VERDICTS.md` (newest entries) | his words | first |
| 5 | `E:/atlas/design/loop/build/briefs/MODEL.md` PART 8 (the page you touch) and PART 9 in full | the spine and the laws; 8.8 carries today's two removals | before building |
| 6 | `E:/atlas/design/loop/build/QUEUE.md` | HIS rows and system rows (`ui:the-answer-line` for D7) | before building |
| 7 | `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` | items 70, 90, 91 and 95 bear on the open work | as needed |
| 8 | `E:/atlas/rules/FORM-CATALOG.md` | HeroBoard's answerBar, SegmentBar's bare form | before building a card |
| 9 | `E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-24.md` | the afternoon handoff: batches one to ten and the loop's traps | background |
| 10 | `E:/atlas/website/CLAUDE.md` | the repo's rules and generated counts | background |

## 8. Open threads & next steps

**Committed next: D7, the answers on a level at one height** (BACKLOG D7, QUEUE `ui:the-answer-line`).
- **The measurement**, `node scratchpad/step23/measure_levels.mjs scratchpad/harness/pages/<page>.html 1280`. On the trade page: `permits | open` 87 and 99, `clears | lasts` 122 and 94, `mix | rivals` 114 and 83. On the industry page: `lasts | benchmark` 87 and 65, `formats | channels` 83 and 114. On London: `gates | market` 83 and 65. On the UK: `spend | exit` 65 and 117.
- **Decide the law first.** A ring's or donut's figure sits at the drawing's centre, so either the drawing's top joins the line or those figures are exempt.
- **Fix level by level**, only where a card can fill its own height (rows that grow, a drawing that takes the slack). Never move the air to the foot.
- **Verify** with the page filter and page laws at three widths, and a byte diff of the renders.
- **Gate it last:** the clause joins `check_page_laws.mjs` at zero (a level whose answers differ by more than 8px reds). Never seed it into the ratchet.

**Then, in order:**
- **The industry pages with a lone survival card** (QUEUE `industry:benchmark-lone-lasts`, four long-tail pages: game development, bricklaying, tiling, plastering). The seat option is closed by the NEVER list, so the remedy is a re-pair, measured by height.
- **B12's last row:** the two `#split` holes on the sweep (see Dead ends).
- **A18's third case** waits on his row `country:median-pay-two-names`.

**Blocked, recorded:** C1 (item 90), C2 (a partner), C5 (item 49), C6 (London's placeholder demand).

**HIS rows, never decide them:** `country:median-pay-two-names`, `cell:hero-not-measured`, `hood:visitor-figures`, `launch:exemplar-url-serves-the-july-page`, `launch:retired-trades-live`, `launch:publish-the-form-catalogue`, `ui:industry-page-is-a-dead-end`, `ui:trail-repeats-the-hero-crumb`.

## 9. Constraints, guardrails & operator preferences

- **Git:** never `--no-verify`, never force-push, never rename a URL.
- **Ratchets:** never raise one. Lower it with the checker's own `--write-baseline` (the model laws with `--ratchet --write-baseline`).
- **The ship rules:** a red stops the push and becomes the next item; push only a commit the chain ran on; never pipe a verification into a filter.
- **Working alone:** subagents never commit under E:/atlas. His questions become HIS rows.
- **Showing him work:** never open a browser or dev server to show him work. The headless shoot tool, for your own proof or a photograph, is fine.
- **Memory:** never close his applications to free memory; wait for it.
- **Reports:** plain English, five lines and the photos.
- **His copy rules** (section 2) hold for every word you add.

## 10. Environment & reproduction

```bash
cd E:/atlas/website
npx tsc --noEmit                                                  # about 60 s
node scripts/verify_pages_fresh.mjs                               # the nine harness renders; exit 3221226505 after "ok" lines is the intermittent Windows exit crash, rerun
node scripts/harness/check_copy_plain.mjs --list [--write-baseline]
node scripts/harness/check_page_holes.mjs --list
node scripts/harness/check_page_laws.mjs --list
node scripts/harness/check_model_laws.mjs --list --ratchet [--write-baseline]
node scripts/harness/harness.mjs archetypes
npx tsx scripts/verify_archetype_copy.ts                          # prints its reds by kind past forty
npx tsx scripts/harness/census.ts --check                         # --write when a section moved
npx tsx scripts/counts.ts --write                                 # when a gate changed
npx tsx scripts/sweep_trades.ts [--no-render]                     # the 138 London trades, about 10 min
node scratchpad/step23/wait_then_chain.mjs 1400 180               # the chain; read scratchpad/deploy/chain.txt, never the task's exit code
bash scratchpad/watch_deploy.sh <full sha>                        # waits for the deployment of that sha
node scratchpad/prove17.mjs                                       # the latest production check; copy it for the next batch
node scripts/harness/shoot_page.mjs <file-or-url> "#id" <out-prefix> 1280,375
node scratchpad/step23/measure_levels.mjs <render.html> 1280      # D7's measurement
```

## 11. Landmines & gotchas

- **The Bash tool mangles backslashes in heredocs.** `\b` arrived as a backspace byte in a regex this session. Write Python edit scripts with the Write tool and assert `"\x08" not in s` before saving.
- **A background task's exit code is its last command's.** `wait_then_chain ... ; tail` reported 0 on a red chain. Read `scratchpad/deploy/chain.txt` for the ✗ count and the "=== Failures ===" block.
- **Two copy-like laws live outside `verify_archetype_copy.ts`:** `tests/spine/entry_bill_guard.test.ts` (it went red on batch fifteen) and `verify_model_laws_copy.ts`. Grep for a string before emptying it.
- **`scratchpad/harness/pages/` holds about 90 stale underscore-id renders from old sweeps.** Read the sweep's list (`scratchpad/harness/sweep/gb-london-list.json`), never the folder glob.
- **The copy gate counts `p` under 13.5px only.** An uppercase label drawn as a `div` is a label, not a line. Keep it that way honestly.
- **`census.ts --write` rewrites `E:/atlas/design/loop/build/PAGES.md` too.** That file was already modified before this session; commit it only if a census write of yours changed it.
- **The design repo's `design/loop/build/PAGES.md`** had an uncommitted change at the session's start. It is not this session's; leave it unless you find out whose it is.

## 12. Glossary

- **Batch:** two to four green items shipped together.
- **Chain:** the 166-gate prebuild list, which Vercel also runs on every deploy.
- **Ratchet:** a per-page count that may only fall.
- **HIS row:** a QUEUE row only he decides.
- **Harness pages:** the nine renders in `scripts/harness/pages.json`: GB, AF, how-to GB, London, two London trades, restaurants industry, the hub and the City of London.
- **Sweep:** the 138 live London trade pages.
- **Answer drawn:** HeroBoard's `answerBar`, the hero's figure pictured at the answer column's foot.
- **Level:** one row of cards, a Band.
- **Clause N:** MODEL PART 9's numbered laws.

## 13. Successor verification checklist

You are oriented when you can answer these:
1. What SHA is production at, and how was that proven?
2. What are the three parts a card may have under his copy correction, and which words does gate 166 ban?
3. Why did the district floor fall from 7 to 5 today, and what may lower a floor?
4. Which two kinds of repeated figure are accepted as his compositions, and which case of "one figure twice" is still his to rule?
5. What is D7's conflict, and what may never be done to resolve it?
6. Why is C1 blocked, and why must the trade pages' takings not simply be replaced by the register's medians?
7. How do you know a chain passed, given that the background task's exit code may say 0?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com, the founder's goal of 2026-09-24 (make the main UK pages richer, sharper and more exact, shipped in green batches, working alone)
Working directory: E:/atlas/website (the site, git main) and E:/atlas (the design repo, p4-seam)
Handoff dossier (read this FIRST, in full): E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-24b.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   E:/atlas/design/loop/build/STATE.md (step-in-flight)
   E:/atlas/design/loop/build/goal-2026-09-24/GOAL.md, SELECTION.md, BACKLOG.md (D7 first)
   E:/atlas/design/loop/build/goal-2026-09-24/COPY-STYLE.md
   E:/atlas/rules/FOUNDER-VERDICTS.md (the newest entries)
   E:/atlas/design/loop/build/briefs/MODEL.md PART 8 for the page you touch and PART 9 in full
   E:/atlas/design/loop/build/QUEUE.md (the HIS rows and ui:the-answer-line)
   E:/atlas/rules/FORM-CATALOG.md (HeroBoard, SegmentBar)
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5-10 lines: the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files;
   the dossier is a point-in-time snapshot and the code and data are ground truth.
6. The goal pre-authorizes the work: after the checkpoint, state that you are taking
   D7 (the answers on a level at one height) per the dossier's section 8, and begin.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly. If anything in the dossier is unclear, ask before acting, but only after
you've read everything above.
```
