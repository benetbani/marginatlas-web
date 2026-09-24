# HANDOFF: marginatlas.com, the goal of 2026-09-24: richer, more exact pages in green batches
**2026-09-24, afternoon. Ten batches shipped and proven on production (last 2f25945b, deployment 6637950986); batch eleven is committed locally and its chain waits for memory. Read `E:/atlas/design/loop/build/STATE.md` first: it is newer than this file.**

> **How to use this document.** Read top to bottom once, then the files in section 7
> in order. Do not start work until you can answer the checklist in section 13.
> The re-hydration prompt is section 14.

---

## 1. TL;DR (read this first)

marginatlas.com is a world business atlas: for a person deciding where to open a small
business, every country, city, district and trade has a page of figures that are
gathered or modelled, never invented. The founder set a **goal** on 2026-09-24
(`E:/atlas/design/loop/build/goal-2026-09-24/PROMPT.md`, invoked with `/goal`): make
the main pages richer and more exact, add sections chosen by measurement, improve the
existing ones, clear blockers, and ship in green batches. The loop works alone, never
asks him, pushes main itself after a green chain, and reports each shipped batch in
five plain lines with photographs from production.

**Shipped and proven today (website, all fetched on production):**
- batches one to five: the trade page's fact cards lead at 30 (B1), the country money
  card's short form (B3), the district clip line (B7), the withheld margin card's mix
  (B8), the cost to open's kinds of shop and "earning it back" (B10, A4a), the city
  seats off London (A4b), /gb/london's 308 (D4);
- batch six (8d2a4a92, fae5920a): /gb/london redirects at the edge; A5, the spread and
  worth "Not measured yet" cards off the London trade pages;
- batch seven (4ec312f9): B4 glosses; A6, no address names a retired activity (the
  resolvers, gate 161 `trade-resolution`); A7, aliases name the exact trade;
- batch eight (91bb8615): B13 the spend card beside the season card off the curated
  cities; A8 the "?" opens on a phone tap (gate 162 `gloss-tap`); E7 the 138-page
  sweep; gate 163 `browser-gates-skip` after its first deploy failed on Vercel;
- batch nine (be56eb07): B12's rows two to four (the cost to open's figure card at 2-1,
  MarkList's one-column rows share the level, the kinds-of-shop list at 1-1);
- batch ten (2f25945b): A9 US-named licences withheld off a US page (gate 164
  `licence-jurisdiction`); E8 the fact store's entity index (archetype-copy 365 s to 5 s).

**Batch eleven, committed locally, chain waiting for memory:** A9b (1ba0bbc1, the world
page's licences), B6's `04 open` (915bc7a0) and `10 field` (8199ca2b) on the figure
card. **A10 is built and UNCOMMITTED** (see section 8): the industry benchmark ranks
the sector's live trades only (74 of 138 industry pages printed a retired or merged
trade among "the trades next door", 40 as the leader, /industries/restaurants led with
bed and breakfasts); the copy gate is updated and passes, planted; `tsc` could not run
(the machine had 560 to 1,060 MB free; tsc aborts with exit 134 under about 1.2 GB).

**Recommended next action:** read STATE's step-in-flight; finish A10 (section 8, step 1),
then run batch eleven's chain when memory allows, push on green, prove, report.

---

## 2. Mission & success criteria

The goal prompt and its manual are in `E:/atlas/design/loop/build/goal-2026-09-24/`:
PROMPT.md, GOAL.md (lanes, cycle, commands, laws, recording, shipping, reporting,
traps), SELECTION.md (sources, eight kill filters, the score, the pair rule),
BACKLOG.md (ranked items, each with a STATUS). Lanes in order: A honesty and live
faults, B better existing sections, C new sections, D interface rows, E systems.
Success per item: the page's ratchets at or under baseline, the chain green, pushed,
the deployment matched by SHA, the live page fetched and showing the change, and the
records current.

The NEVER list (verbatim in PROMPT.md): invent, round up or print a placeholder; one
figure twice or two pages disagreeing; a coined index; a "not gathered yet" card on a
UK page; em dashes, statistics-body names, raw hex or px; the home page; a renamed URL;
a claim about production without fetching it; a browser or dev server to show him work.

## 3. Current state: ground truth

- Website `E:/atlas/website`, branch main, origin benetbani/marginatlas-web. Origin
  2f25945b (batch ten, deployment 6637950986, dpl_6MT5evm2dqDbNSJVm73NDq6166Vn). Local
  ahead: 1ba0bbc1, 915bc7a0, 8199ca2b (batch eleven) plus A10 uncommitted.
- Design repo `E:/atlas` (branch p4-seam, no remote): records committed through 4505a76.
- Chain: 164 gates (+ trade-resolution, gloss-tap, browser-gates-skip,
  licence-jurisdiction today). About 600 s serial since E8.
- Ratchets: industry-restaurants page holes 1 to 0, page laws 3 to 2, model laws 6 to 4
  (lowered today); the rest at their baselines.
- The 138 live London trade pages (sweep at 8c954ed7 plus B12's fourth row measured on
  its 41): about 84 page-filter reds, 78 of them the split card at 768 (B12's first
  row, deferred with measurements); no absence line outside the hero; the hero's "Not
  measured yet" on 120 is his (cell:hero-not-measured).

## 4. How we got here: the decision trail

1. Proving batch six found that any word in a trade's place answered 200, and that the
   alias map named retired activities (plumber as residential construction). Fixed in
   the resolvers (A6), then the aliases that named a broader trade (A7).
2. Photographing batch seven found the "?" dead on phones since the Radix move (A8);
   its gate failed batch eight's first deploy on Vercel (no browser there), which gave
   gate 163.
3. The sweep (E7) made the long tail measurable: B12's rows fell one by one; the split
   legend at 768 resisted two fixes and is deferred with the numbers.
4. Batch nine's photograph showed a "Federal brewer's notice" on a London page (A9, then
   the world page A9b).
5. Batch ten's chain nearly timed out on archetype-copy (349 s against 360): profiled,
   one full scan in the fact store; indexed (E8), not the budget raised a third time.
6. B6 put the industry page's fact cards on the figure card; reading the benchmark for
   its third card found the retired and merged trades in the set (A10).

## 5. Hard-won truths & mental model

- A green chain proves the gates, never that two pages agree, and never the Vercel
  build: the design machine has a browser and the parent repo, the build machine has
  neither; a browser gate calls `requireBrowser` (gate 163 holds it).
- `scratchpad/deploy/chain.txt` is written at the chain's end; read its time before
  reading a verdict. A failed deployment's log: `vercel inspect dpl_<id> --logs`.
- Route probes by the URL slug and sweep the live taxonomy (`INDUSTRIES`, 138); a
  lookup table (aliases, crosswalks, sector sets) ages with the taxonomy it points into.
- Before changing a resolver or builder, grep `tests/` and the copy gates for its
  functions: a test can hold the pre-ruling behaviour (batch seven's first chain red).
- A render cannot see behaviour: test a client component in a real browser with touch
  emulation; a subset of gates is not the chain.
- A gate near its time budget is a profile to take, not a budget to raise:
  `NODE_OPTIONS="--cpu-prof --cpu-prof-dir=<dir>"` on the tsx child.
- A card that states only absence is the class he refused; the answer is honest
  content the card holds, or the card leaves and its band re-seats.
- Renders are deterministic: byte-diff pages before and after, and diff the checkers
  finding for finding, not only their counts.

## 6. Dead ends: do NOT retry

- A CSS `min()` of a percentage and a length as a table column width.
- 22ch on a table in a band; a world track on a short ranked list.
- Seeding the holes or gathered-emptiness ratchet for a new page (no seed path).
- The split legend at 768: hairlines under the rows lose to the parent's `divide-y-0`
  (specificity) and, won, leave an odd-count legend's bottom-right about 130 tall; three
  columns clip 30-character names. Candidates: a label-length rule, or the head beside
  the legend from 640 of the card.
- Raising the chain's per-gate timeout again for archetype-copy: it was the fact store.

## 7. Critical files & artifacts (reading order)

1. `E:/atlas/design/loop/build/STATE.md` (step-in-flight)
2. `E:/atlas/design/loop/build/goal-2026-09-24/PROMPT.md`, GOAL.md (section 9's traps),
   BACKLOG.md, SELECTION.md
3. `E:/atlas/design/loop/build/QUEUE.md` (HIS rows: hood:visitor-figures,
   launch:retired-trades-live (rewritten: every unknown trade word answers 200),
   cell:hero-not-measured, cell:not-gathered-seats, launch:exemplar-url-serves-the-july-page)
4. `DATA-REQUIREMENTS.md` items 90, 91 and 92 (each trade's UK licences)
5. `briefs/MODEL.md` PART 8.6 and 8.7 (today's bracketed notes), PART 9
6. Website: `src/lib/taxonomy.ts`, `src/lib/cells/industry_resolution.ts`,
   `src/lib/spine/permits_rows.ts`, `benchmark_rows.ts`, `src/lib/facts/store.ts`,
   `src/components/kit/InfoTip.tsx`, `scripts/verify_*` of today, `scripts/sweep_trades.ts`

## 8. Open threads & next steps

1. **A10, uncommitted in the website tree**: `src/lib/spine/benchmark_rows.ts` (the
   set is `INDUSTRIES` by sector), `src/components/spine/industry/industry-view.tsx`
   (a withheld benchmark is omitted and the survival card stands alone at 2-1; four
   sectors: game development, bricklaying, tiling, plastering), and
   `scripts/verify_archetype_copy.ts` (the laws on the live set; a row may not be a
   retired or merged trade; planted, 21 reds). Still owed: `npx tsc --noEmit` (needs
   about 1.2 GB free), renders of /industries/restaurants and the four omitted pages
   with the three checkers, the archetype harness, census, then commit, and close QUEUE
   industry:sector-set as ruled.
2. **Batch eleven's chain**: `node scratchpad/step23/wait_then_chain.mjs 1400 180`
   (the wrapper's threshold must allow for the chain process's own ~200 MB). Push on
   green, prove on production (the world page's plus without US names; the industry
   page's two figure cards; the benchmark without retired trades), report.
3. B6's third card (`#benchmark`'s focal): after A10 the set is live; a rank among the
   sector's live trades is the candidate reading, measured first.
4. B12's first row (the split legend at 768), B5, C3 (inflation, property tax), the D
   rows, the HIS rows.

## 9. Constraints, guardrails & operator preferences

Never `--no-verify`, force-push, or rename a URL; never raise a ratchet (lower it with
the checker's own `--write-baseline`, the model laws with `--ratchet --write-baseline`);
a red stops the push and becomes the next item; never pipe a verification into a
filter; subagents never commit under E:/atlas; never open a browser or dev server to
show him work (the headless shoot tool for your own proof is fine); push only a commit
the chain ran on; work alone, his questions become HIS rows; plain English in reports;
never close his applications to free memory, wait for it.

## 10. Environment & reproduction

```bash
cd E:/atlas/website
# render the nine harness pages, or any list (a JSON with {pages:[{surface,slugs}]})
node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx --list [<list.json>]
# the three checkers (file mode takes paths; --list reads the harness list with ratchets)
node scripts/harness/check_page_laws.mjs --list
node scripts/harness/check_page_holes.mjs --list
node scripts/harness/check_model_laws.mjs --list --ratchet
# the 138 London trade pages in one command
npx tsx scripts/sweep_trades.ts --iso=gb --city=london
# the archetype sheet and a gate subset
node scripts/harness/harness.mjs archetypes
npx tsx scripts/prebuild_all.ts --only=<names> --no-bail --concurrency=1
# the whole chain before a push, then read chain.txt's time against chain-wait.txt
node scratchpad/step23/wait_then_chain.mjs 1400 180
# photograph a card from a render or a live URL
node scripts/harness/shoot_page.mjs <file-or-url> "#id" <out-prefix> 1280,375
```

## 11. Landmines & gotchas

- `render_page` can exit 127 after writing every page; read its "rendered from" line.
- A render list that includes a page overwrites that page's file in
  `scratchpad/harness/pages`; copy the "before" first.
- Never edit website source while a chain runs; stop a waiting wrapper before editing.
- `census.ts --write` also rewrites `E:/atlas/design/loop/build/PAGES.md`; commit it.
- `tsc` and the chain need memory the founder's applications often hold; `tsc` aborts
  with exit 134 and no output under about 1.2 GB free.
- Radix's `aria-describedby` names a visually hidden copy; measure the popper wrapper.

## 12. Glossary

Batch: two to four green items shipped together. Chain: the 164-gate prebuild list
(`npm run verify:deploy`). Ratchet: a per-page count that may only fall. Figure card:
BentoMetric, one figure at 30 with companions. Live taxonomy: `INDUSTRIES`, the 138
trades in scope; retired and merged ids are off the atlas. HIS: a queue row only the
founder decides.

## 13. Successor verification checklist

1. What is the goal, and where are its manual and backlog?
2. Which commits are live, which are local, and what is uncommitted?
3. Why did batch eight's first deploy fail, and which gate prevents it now?
4. What does A10 change, and what must run before it is committed?
5. Which two ratchets have no seed path, and how is a ratchet lowered?
6. What must you never do before a push, and never to the founder's machine?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com, the goal of 2026-09-24 (richer, more exact pages in green batches)
Working directory: E:/atlas/website  (the design repo is its parent, E:/atlas)
Handoff dossier (read this FIRST, in full): E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-24.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read, in this order: E:/atlas/design/loop/build/STATE.md (its step-in-flight);
   E:/atlas/design/loop/build/goal-2026-09-24/PROMPT.md, GOAL.md, BACKLOG.md,
   SELECTION.md; E:/atlas/design/loop/build/QUEUE.md (HIS rows are not yours);
   DATA-REQUIREMENTS.md items 90 to 92; MODEL.md PART 8.6 and 8.7.
3. Do not edit anything or run anything destructive until steps 1–2 are done.
4. Prove you are oriented: answer the dossier's section 13 checklist in 5–10 lines.
5. Flag any contradiction between the dossier and the files; the files win.
6. The goal pre-authorizes the next step: finish A10 (section 8, step 1), then batch
   eleven's chain, push on green, prove, report. State what you are about to do and begin.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly.
```
