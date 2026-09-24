# HANDOFF: marginatlas.com, the goal of 2026-09-24: richer, more exact pages in green batches
**2026-09-24. Five batches shipped (batch five pushed 73435e28 after its chain ran 160 of 160; its deployment and proof are in STATE); A5 was starting. Read `E:/atlas/design/loop/build/STATE.md` first: it is newer than this file.**

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

**Shipped and proven this session (website):** batch one 34a72aec (the trade page's
licences and survival cards lead with their answer at 30); batch two 532f54ff (the
country money card puts each margin beside its trade; the city district card names
the West End's rent as the model's ceiling; the shoot tool hides a live page's sticky
header); batch three 1a47b5e1 (the withheld net margin card draws the costs on file
split among themselves, closing its hole on eight London trades); batch four b11b2ba4
(the harness reads London barbershops; the cost to open names its kinds of shop, and
where it holds no cost it "earns it back" instead of printing "Not gathered yet": 44
of 138 live London trades to 0); batch five 68b8081c (the city page off London drops
its three "Not gathered yet" seats), 0ba46868 (/gb/london redirects to /cities/london,
gate 160 `city-path-redirect`), 73435e28 (that gate prints through the red formatter
after the first chain went red on `gate-reds-ratchet`), pushed 07:45Z.

**Withdrawn before shipping, on purpose:** the districts hub's measured takings table
(397b67d9, reverted by 34a72aec): its dental figures sat under the dental trade page's
own bottom tenth, "two pages disagree". It waits on DATA-REQUIREMENTS item 90.

**Recommended next action:** read STATE's step-in-flight. If batch five's deployment is
not yet proven, prove it (section 8) and report; then A5 (BACKLOG A5: on 121 of 138
London trade pages the spread and the worth say "Not measured yet"; the loop's plan is
written there, the hero is his row cell:hero-not-measured).

---

## 2. Mission & success criteria

The goal prompt (3,796 characters) and its manual are in
`E:/atlas/design/loop/build/goal-2026-09-24/`: PROMPT.md, GOAL.md (lanes, cycle,
commands, laws, recording, shipping, reporting, traps), SELECTION.md (sources, eight
kill filters, the six-axis score, the pair rule), BACKLOG.md (ranked items, each with
a STATUS). Lanes in order: A honesty and live faults, B better existing sections, C new
sections, D interface rows, E systems. Success per item: the page's ratchets at or under
baseline, the chain green, pushed, the deployment matched by SHA, the live page fetched
and showing the change, and the records current.

The NEVER list (verbatim in PROMPT.md): invent, round up or print a placeholder; one
figure twice or two pages disagreeing; a coined index; a "not gathered yet" card on a
UK page; em dashes, statistics-body names, raw hex or px; the home page; a renamed URL;
a claim about production without fetching it; a browser or dev server to show him work.

## 3. Current state: ground truth

- Website `E:/atlas/website`, branch main, origin benetbani/marginatlas-web. At writing:
  origin 73435e28 (batch five, pushed 07:45Z after 160 of 160; the deployment is in
  STATE); before it b11b2ba4 (deployment 6632236355, success 07:09:18Z).
- Design repo `E:/atlas` (branch p4-seam, no remote): records committed through fbd7d3a.
- Ratchets: model laws country-GB 12 (from 18), barbershops seeded 2; page laws
  barbershops seeded 2; holes 0 on barbershops. Chain: 160 gates.
- The harness list (`scripts/harness/pages.json`) has nine pages: country GB and AF,
  how-to GB, city London, cell London restaurants and barbershops, industry
  restaurants, hood London and City of London.
- Live London trade pages (138): 0 "Not gathered yet" lines since batch four; the page
  filter still reads 262 standing reds over them (spread 120 at 1280, split 78 at 768,
  open 40 at 1280, rivals 18, team 3), the long tail's debt (BACKLOG B12).

## 4. How we got here: the decision trail

1. A1 and B1 shipped first (loud-seats wording; licences and survival on WorkedFigure).
2. B2 plus C1a (the CompareTable name column at 22ch and the hub's measured takings)
   passed its chain and was WITHDRAWN before the push, because a render of the London
   trade pages showed the register's medians under the dental page's modelled bottom
   tenth. Revert, not raise: the tree went back to B1's exactly (34a72aec).
3. The hub's visitor figures (22 a resident for the City) fail against the file's own
   note; the fix is his call (QUEUE hood:visitor-figures, three options measured).
4. B3 (the short ranked list) first drew a world track and read a PLACEMENT row; the
   track came out ("or nothing" in PART 5).
5. Rendering the page production serves as the rebuilt trade page (barbershops, since
   /gb/london/restaurants serves the July page) found holes the harness never read.
   B8 fixed the withheld margin card; E5 listed barbershops; its first chain went red on
   `gathered-emptiness` (the cost to open's centred figure), so B8 shipped alone from a
   detached checkout of its commit and E5 waited for B10.
6. Counting "Not gathered yet" over every live London trade (by URL slug) led to A4:
   the trade page's cost to open (fixed, batch four), the city seats off London (batch
   five), the hub (his), the retired trades still live (his).

## 5. Hard-won truths & mental model

- A green chain proves the gates, never that two pages agree: render the other page
  and read the two side by side before printing a figure another page prints.
- `scratchpad/deploy/chain.txt` is written at the chain's end; read its time against
  the run's start in `scratchpad/step23/chain-wait.txt` before reading a verdict.
- Route probes of trade pages by the URL slug (`industryToSlug`), never the taxonomy
  id, and sweep the live taxonomy (`INDUSTRIES`, 138), not the 243 shard ids.
- A page added to the harness list meets every render gate at once; two of them have
  no seed path (page holes, gathered-emptiness).
- A new gate prints its reds through `scripts/lib/red`, or `gate-reds-ratchet` reds.
- A card that states only absence ("Not gathered yet", "Not measured yet") is the class
  he refused on 2026-09-19; the answer is honest content the card already holds, or
  the card leaves and its band re-seats.
- Renders are deterministic: byte-diff pages before and after a change (strip
  `<style>`), so "nothing else moved" is a measurement.

## 6. Dead ends: do NOT retry

- A CSS `min()` of a percentage and a length as a table column width: the browser reads
  it as no width (the hub's name column went back to an equal quarter).
- 22ch on a table in a band (London's peers at 768 overlapped).
- A world track on a short ranked list without a placement builder.
- Seeding the holes or gathered-emptiness ratchet for a new page: no seed path; fix the
  page to zero first.

## 7. Critical files & artifacts (reading order)

1. `E:/atlas/design/loop/build/STATE.md` (step-in-flight)
2. `E:/atlas/design/loop/build/goal-2026-09-24/PROMPT.md`, GOAL.md (section 9's traps),
   BACKLOG.md (A5 next; B11 to B13; E7), SELECTION.md
3. `E:/atlas/design/loop/build/QUEUE.md` (HIS rows: hood:visitor-figures,
   launch:retired-trades-live, cell:not-gathered-seats; DONE rows of this session)
4. `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` items 90 (trade takings against the
   register) and 91 (district visitors)
5. `E:/atlas/design/loop/build/briefs/MODEL.md` PART 8.6 (rows 04, 05), 8.3, 8.8, PART 9
6. Website: `src/lib/spine/open_rows.ts`, `split_rows.ts`, `trade_spread_rows.ts`;
   `src/components/spine/cell/turn-one.tsx`, `cell-view.tsx`; `src/components/spine/
   city/city-view.tsx`; `scripts/harness/*`, `scripts/verify_archetype_copy.ts`

## 8. Open threads & next steps

1. **Batch five** (pushed 73435e28): if STATE does not show its proof, watch
   `gh api repos/benetbani/marginatlas-web/deployments?sha=<full sha>`, then prove:
   `/gb/london` answers a 308 to `/cities/london`, `/cities/manchester` prints no "Not
   gathered yet", London's city page unchanged; report five lines with photographs.
2. **A5 (next, pre-authorized by the goal)**: the spread card's "Not measured yet" on
   most London trade pages; no money may print (the trust gate); options in BACKLOG A5.
3. B13 (the season card alone off curated cities), B12 (the long tail's standing holes),
   E7 (one command for the 138-page sweep: the three probe steps of this session).
4. His rows: hood:visitor-figures, launch:retired-trades-live, cell:not-gathered-seats
   (the hub's works seat), launch:exemplar-url-serves-the-july-page, ruling 30.

## 9. Constraints, guardrails & operator preferences

Never `--no-verify`, force-push, or rename a URL; never raise a ratchet; a red stops
the push and becomes the next item; never pipe a verification into a filter; subagents
never commit under E:/atlas; never open a browser or dev server to show him work (the
headless shoot tool for your own proof is fine); push only a commit the chain ran on;
work alone, his questions become HIS rows; plain English in reports.

## 10. Environment & reproduction

```bash
cd E:/atlas/website
# render the nine harness pages
node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx --list
# render any list of pages (a JSON with {pages:[{surface,slugs}]}) in one process
node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx --list <list.json>
# the three checkers
node scripts/harness/check_page_laws.mjs --list --ratchet
node scripts/harness/check_page_holes.mjs --list
node scripts/harness/check_model_laws.mjs --list --ratchet
# the archetype sheet and a gate subset
node scripts/harness/harness.mjs archetypes
npx tsx scripts/prebuild_all.ts --only=<names> --no-bail --concurrency=1
# the whole chain before a push (~13 min), then read chain.txt's time against chain-wait.txt
node scratchpad/step23/wait_then_chain.mjs
# photograph a card from a render or a live URL
node scripts/harness/shoot_page.mjs <file-or-url> "#id" <out-prefix> 1280,375
```

## 11. Landmines & gotchas

- `render_page` can exit 127 on a libuv assertion after writing every page; read its
  "rendered from" line, not the exit code.
- A stash round trip for a "before" render overwrites `scratchpad/harness/pages`;
  re-render the "after" page before photographing or quoting it.
- Never edit website source while a chain runs: later gates import live source.
- `census.ts --write` also rewrites `E:/atlas/design/loop/build/PAGES.md`; commit it.

## 12. Glossary

Batch: two to four green items shipped together. Chain: the 160-gate prebuild list
(`npm run verify:deploy`). Ratchet: a per-page count that may only fall. Seat: a card
drawn to say what is missing. HIS: a queue row only the founder decides. Earning it
back: the cost to open's state where no cost is held.

## 13. Successor verification checklist

1. What is the goal, and where are its manual and backlog?
2. Which commits are live, which are local, and did batch five ship?
3. Why was the hub's measured takings table withdrawn, and what does it wait on?
4. What is A5, and what may never print on that card?
5. Which two ratchets have no seed path?
6. What must you never do before a push?

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
   DATA-REQUIREMENTS.md items 90 and 91; MODEL.md PART 8.6 rows 04 and 05.
3. Do not edit anything or run anything destructive until steps 1–2 are done.
4. Prove you are oriented: answer the dossier's section 13 checklist in 5–10 lines.
5. Flag any contradiction between the dossier and the files; the files win.
6. The goal pre-authorizes the next step: finish whatever STATE's step-in-flight names
   (a batch to prove, or A5 in progress). State what you are about to do and begin.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly.
```
