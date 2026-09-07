# HANDOFF , marginatlas.com, the build loop after 25 runs, and the founder's art-direction correction

**Status, 2026-09-07:** the build loop has run 25 times since 2026-09-05 and rebuilt the country page, the how-to page and nine of the city page's fifteen sections on eleven reusable archetypes, every run verified by a harness and a 138-gate chain, every commit local and unpushed (40 site commits ahead of the deployed main). Tonight the founder rejected the loop's reports as jargon and its design as art-directorless; a plan answering both is written and committed, and the loop's queue has not yet been re-pointed at it. Nothing is broken. Nothing is live from this work.

> **How to use this document.** Read top to bottom once. Then read the files in
> section 7 in the order given. Do not start work until you can answer the
> checklist in section 13. A ready-to-paste re-hydration prompt is section 14.

---

## 1. TL;DR (read this first)

marginatlas.com tells a would-be shop owner what a business keeps, by trade and by place. The site is a Next.js app in `E:\atlas\website` (its own git repo, branch `main`, deployed on Vercel from a push); the rules, design and loop state live in the parent repo `E:\atlas` (branch `p4-seam`, no remote). Since 2026-09-05 an autonomous **build loop** (a fixed prompt the founder starts with "go") has done 25 runs, each taking one queue row: a page section rebuilt on a reusable component with the design law written inside it (an **archetype**), tested at three screen widths, photographed, judged, recorded in a ledger, committed locally. The country page (9 sections) and the how-to page (6) are fully on archetypes; the city page is 9 of 15; 43 sections across the other pages still wait. The harness (81 example cards x 3 widths, a full-page filter for 3 pages) and the chain (138 gates) are green at the last commit. **Tonight the founder said the reports are unreadable ("wtf you talking about") and that an art director is missing: the graphics do not know what to emphasize; every card wears its own accent (London has eight terracotta figures and no hierarchy); sections were filled to match a neighbour's height instead of composed.** The answer is a written plan (`docs/superpowers/plans/2026-09-07-art-direction-in-the-build-loop.md`): a design brief per section before any build, one emphasis budget per page (three loud moments), page-level hierarchy checks in the harness, one whole-page picture and eight plain lines per run. **The committed next step is the plan's Task 7 (re-point the queue and the state) and then run 26 = Tasks 0 to 2 (the founder's words into the rules file, the city brief, the doctrine's new stage). STATE.md still says the next row is `city:demand`; that is stale by one evening and must be corrected first.**

## 2. Mission & success criteria

**The enduring goal (the founder's words, 2026-09-04):** "seek solutions on how we can move forward quickly, efficiently, and reliably... remove me as much as possible... build programmatic pages that are the same, only with different variables... I want you to do the work." Pages are built from archetypes so that every country, city, district and trade renders the same composition with different variables, and the founder rules once per archetype instead of once per page.

**The current tactic:** the build loop. One row per run, eight stages (research, build, stories, harness, integrate, verify, photograph and judge, record), the doctrine at `E:\atlas\design\loop\build\DOCTRINE.md` as the law, the queue as the order of work, the founder steering with one line in `VERDICTS.txt`.

**What "done" looks like for this phase (PLAN.md section 8, unchanged):** every section of the country, how-to, city, neighbourhood, trade and industry pages on an archetype; the coverage gate's exception list at zero; the harness and the chain green; each page photographed and judged whole. **Added tonight:** every section built to a brief; three loud moments per page; the page seen whole in one picture per run; reports a designer friend would say in eight lines.

**Hard constraints (all still binding):** never fabricate a figure, a place detail, a note or a source; never edit `rules/*` except to append the founder's words verbatim; never rename a URL; no em dash, no source-agency name, no raw hex or pixel in a component; equal heights for cards on one level; never push, never `npm run build`, never deploy (a push deploys); never `git add -A`; never open a browser to show the founder anything; never ask him to look or decide inside a run; never download or install without his explicit word (given once, for `npx playwright install chromium`, on 2026-09-06).

## 3. Current state , ground truth

| Component | Status | Notes |
|---|---|---|
| Country page (`src/components/spine/country/`) | 9 of 9 sections on archetypes | Done runs 1 to 5. Photographed. In the page filter (`country GB`). |
| How-to page (`/[country]/how-to-open`) | 6 of 6 | Run 5. In the filter (`howto GB`). |
| City page (`src/components/spine/city/`) | 9 of 15 on archetypes | Masthead, verdict, districts, quick reads, peers, earnings, premises, character x2, close. Left: spending pool, seasonal, trades (three cards), risks, locals, runway. Filter: `city london`. |
| Neighbourhood, trade (cell), industry pages | 0 on archetypes | Queue sections D, E, F. Untouched by the loop. |
| Home page | PARKED (founder, 2026-09-03); its map CUT (ruling 13) | Do not touch. |
| Archetypes (`src/components/spine/archetypes/`) | 11 | AnswerCard, KvGrid, RankedBars, CompareTable, CardPager, TiersTable, RangeStrip, SpectraTable, NoteList, Terminus, PayBars. Stories for each in `stories.tsx`; index on the sheet. |
| Archetype harness (`npm run harness:archetypes`) | Green: 81 instances x 3 widths, 0 design reds, 8 data reds (data, not design) | Rules: BOTCHED MOBILE, LADDER, NO HIERARCHY, WORLD MAX, ACCENT, HEADLINE, UNEQUAL, REPETITION, PROMISE, LONE STAT, ROWS CUT, INDEX. |
| Page filter (`npm run harness:page`) | Green: 3 pages x 3 widths, 0 holes | Reads `scripts/harness/pages.json`. Rules: holes a quarter each way, ROWS CUT, sideways scroll, NO SECTIONS, NO RENDER. **No page-level hierarchy check yet** (plan Task 3). |
| Prebuild chain (`npm run prebuild:serial`) | Green: 138 passed at website commit `cb323712` (read 2026-09-07 03:4x) | Serial only on this 8 GB machine; needs about 900 MB free; three cell-lattice checks always deferred (data conditions). |
| Typecheck (`npx tsc --noEmit`) | Clean | |
| Coverage gate exceptions (`data/archetypes/coverage_exceptions.json`) | 43 | Was 51 at setup. Shrinks by one per section landed. Keys `file#id` or `file#<n>` (fragile: `sys:coverage-keys` queued). |
| Website git | `main`, HEAD `f6263aab`, **40 commits ahead of `origin/main`**, unpushed | Last deploy was 2026-09-03 (previous handoff). **One tracked file modified and uncommitted:** `data/audit/a11y_static_REPORT.md` (the chain's a11y gate regenerated it: 732 source files after run 25's `district_rows.ts`). Commit it by name in the next run, as runs 17 and 24 did. |
| Parent git (`E:\atlas`) | `p4-seam`, HEAD `dbb687f`, no remote, clean | The loop's state, rules, blueprints, photos. |
| Data track | 16 requirements in `DATA-REQUIREMENTS.md`, none delivered | The loop hands them over; nobody is working them. |
| The plan of tonight | Written, committed (`f6263aab`), **not started** | `docs/superpowers/plans/2026-09-07-art-direction-in-the-build-loop.md`, Tasks 0 to 7. |
| The founder's ten decisions (PLAN.md section 5) | All open | Lone bands; two full-width top bands; the compare pill; the Pro pill's words; the 768 pill position; the percentage-points word; district pages; the chain's static fixtures; **push and deploy + `vercel.json` buildCommand**; the home page. |
| Memory (Claude's) | `C:\Users\benet\.claude\projects\E--atlas\memory\` | Newest: `feedback_2026-09-07_art_director_plain_reports.md`; the loop's status line per run in `feedback_2026-09-04_reset_archetypes.md`. |

**Believed, not proven:** that the London page's eight accent figures is the count the new ACCENT BUDGET check will report (counted by hand from the code on 2026-09-07; the check is not built). That the sibling architecture loop in `E:\atlas\design\loop\architecture\` is dormant (its `WORKING.md` was not read tonight).

## 4. How we got here , the decision trail

1. **2026-09-03 (previous handoff):** the chain was found red for eighteen design-loop runs, three gates fixed, 108 commits pushed, the site deployed live. The design loop then had 37 rows.
2. **2026-09-04, the founder's fifteen rulings and the RESET:** he rejected the loop's pace and method (mockups as deliverables). New unit of work: an archetype as a real kit component with the law inside, stories, harness checks, one preview URL; he rules once per archetype. Rulings 1 to 16 (DOCTRINE.md section 3) bind every archetype: LLC cells, city images, vertical net-margin bars, world's-best top rule, equal heights, the how-to page, nothing botched on a phone, the practical register, premises in five metrics, pay pairs, no home map, explanatory spectra poles, no walls of prose, no massive white space.
3. **2026-09-05, the build loop set up (LEDGER "setup"):** nine archetypes existed from the reset session; the loop's files, doctrine, queue and prompt were written. Runs 1 to 8 finished the country page, the how-to page, the chain runner's timeout and subset flags, the harness tools, the key-value grid's container columns, and the city masthead.
4. **2026-09-06, runs 9 to 22, the city page:** each section in turn, with a system row every third run (coverage gate, page-filter list, photo diff, section census, stories index). Honesty findings along the way: London's income spread is modelled (marked); the three rent fields are city-size averages (relabelled); city:hoods decided and not drawn (no district pages or photos; a data requirement); the word "pp" banned and removed.
5. **2026-09-07, runs 23 to 25:** the verdict card on the answer archetype at a new section level (the answer card learned not to be an h1 twice); the preflight in every harness script (the shell drifted to the wrong folder four times and the browser folder vanished once); the district ranking on the ranked bars with a burden direction (the lightest leads at the right; the top rule is the set's heaviest), the section's door and never-drawing map wiring removed.
6. **2026-09-07, the correction.** Verbatim: "yoooo make my life easier, wtf you talking about?" ... "an art director is missing from a lot of your work, the graphics don't know what to emphasize, how to emphasize, how to show by not showing, how to design world class design effectively. that's quite a problem to be honest, you should think for each section, why, how, how to make it better, how it will relate to the page, visual hierarchy, etc. the harness and architecture can be improved further as a whole thing." **Why it was true:** emphasis was a per-card law (each archetype accents its own answer), so the page had no emphasis; pairing sections for equal heights drove content (run 9 opened the district list to fill a hole); nothing before a build said the section's purpose. **The response:** the plan (section 8 below), and the reports' register changed to eight plain lines.

## 5. Hard-won truths & mental model

**Vocabulary.** A **row** is one unit of queue work (SECTION, ARCHETYPE, SYSTEM, PAGE). A **run** is one pass of the loop prompt, about fifteen minutes, one row. An **archetype** is a component in `src/components/spine/archetypes/` with its law inside (constructions the component cannot violate plus checks the harness runs), a **builder** in `src/lib/spine/<name>_rows.ts` that reads data and the copy table, **stories** (instances picked from the data: the exemplar, the poor case, the extremes, the self-omit), and a place in a view. The **sheet** is the rendered stories page (`scratchpad/harness/archetypes.html`); the **filter** is the full-page check; the **chain** is the prebuild gate list; a **gate** is one script in it. The **kit** (`src/components/spine/kit.tsx`) is the older component set that stays only while a page still uses it. A **Band** is a row of cards with equal heights by construction; a **hole** is a blank rectangle a quarter of a card each way. The **census** regenerates PAGES.md's section tables from the code. The **brief** (new tonight) is a section's design intent written before the build; **loud/quiet** is the page's emphasis budget.

**Laws that took the whole effort to learn (DOCTRINE.md section 13 and DEBUG.md section 3 hold the full list):**
- The shell's working directory drifts between calls, including parallel calls in one message: **every command begins with `cd /e/atlas/website &&` or `cd /e/atlas &&`**, background commands included. Since run 24 every harness script stops itself on the wrong ground (exit 2 with the remedy).
- A JSX comment as the first thing inside a ternary branch is a parse error. It has cost a typecheck cycle at least six times across sessions.
- A pipe hides the exit code. Redirect every verification to a file and read the exit code from the shell.
- Long scripts and edits go through a file written with the Write tool, then run; a heredoc with quotes inside parsed to nothing, silently, twice.
- A full-page screenshot paints a white block over the fixed atmosphere layers; every photograph is a viewport capture.
- Lazy images never load headless; the tools set them eager and decode.
- A class assembled from a template is invisible to the Tailwind scanner; container-query classes are written out in full.
- The coverage gate keys id-less boxes by ordinal in the file; removing a box shifts every key after it (paid in runs 14 and 23).
- The machine has 8 GB; the parallel chain crashed twice; the serial chain runs alone, only above about 900 MB free, read with PowerShell's `Get-CimInstance Win32_OperatingSystem`.
- A ratified rule becomes a gate in the same session or is written down as not machine-checkable; the counts in CLAUDE.md are generated (`npx tsx scripts/counts.ts --write`) and the `counts-fresh` gate fails when stale (three carrier files, not one; run 24 missed two).

**The founder's taste, as ruled and as photographed:** horizontal bars are "disgusting", limited to three bar-family drawings per page; vertical ranked bars are ratified; tiles are banned (2026-08-30); repetition is his most frequent complaint ("you are repeating the front part"); titles must be instantly understandable, no coined jargon; unknowable metrics (per-district "what you keep", crowding) are banned; a lone number may stay a number; walls of prose fail; massive white space fails; the practical register ("say what a thing costs and where"); plain visitor language in reports, no file paths, no rule names.

**The design gap, in one sentence he would sign:** every card knew how to be loud on its own; nobody decided what the page should be loud about.

## 6. Dead ends , do NOT retry

- **Keeping the kit's lollipop for the districts** (considered run 25): it is bar-family by the kit's own idea I2, the founder ratified vertical bars, and keeping it left the section on the kit forever. Decided: RankedBars with a burden direction. Do not reopen.
- **A NoteList of seven for the district characters:** over the note cap of five; the notes ride the bar rows instead (RankedBars `note`).
- **Hiding the district words behind a disclosure** (the old city rulebook allowed it): the founder's white-space ruling outranks it; the list stays open. But see tonight's correction: filling a card to match a neighbour's height is the wrong reason; the brief decides content.
- **RankedBars with the accent on the highest bar for a rent load:** the good end is the lightest; `best="min"` exists for this. Never accent the heaviest rent.
- **Two doors to one destination on one page** (the districts card's door plus the terminus's): repetition; one door, at the close.
- **Asking the founder to look or decide mid-run:** forbidden by the doctrine and by his 2026-09-03 correction. The loop decides and records why; he overrules with one line in VERDICTS.txt.
- **The parallel chain (`npm run prebuild`)** on this machine: crashed twice on memory (2026-09-05).
- **Full-page screenshots at 768:** the white block. Viewport captures only.
- **Heredocs with quotes for scripts:** silent no-op twice. Write tool, then run.
- **`npm run build` or a deploy to prove anything:** never inside the loop; a push deploys and needs the founder's permission.
- **A page-level accent achieved by hiding accents in the story sheet:** the sheet must draw what the page draws (the London districts story passes the same `emphasis` the view does; plan Task 4).
- **The panel/committee/adversarial-judge machine** of July: "mediocre", asymptotes on nits (memory `project_design_direction_2026-07-12.md`). One mind holds the brief; the founder judges the whole look.
- **Reporting commits, gate names, rule names and run numbers to the founder:** rejected tonight. Eight plain lines and one picture.

## 7. Critical files & artifacts (the map + reading order)

| # | Path | Role | Read priority |
|---|---|---|---|
| 1 | `E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-09-07.md` | This dossier | First |
| 2 | `E:\atlas\website\docs\superpowers\plans\2026-09-07-art-direction-in-the-build-loop.md` | Tonight's plan, Tasks 0 to 7, with the fifteen city section briefs already drafted inside Task 1 | Second |
| 3 | `E:\atlas\design\loop\build\DOCTRINE.md` | The loop's law: files, stages, archetype method, verification order, judging, recording, hard rules, lessons | Third, in full |
| 4 | `E:\atlas\design\loop\build\STATE.md` | Where the loop is (stale by one evening: says `city:demand` next; the plan's Task 7 corrects it) | Fourth |
| 5 | `E:\atlas\design\loop\build\QUEUE.md` | Every row, in order, with status; sections A to F | Fifth, the first sixty lines |
| 6 | `E:\atlas\design\loop\build\LOOP-PROMPT.md` | The prompt the founder pastes to start a run (`/loop 20m` + the text) | Sixth |
| 7 | `E:\atlas\design\loop\build\DEBUG.md` | The debug pass, the chain and memory protocol, the traps, the failure table, the log per run | Seventh |
| 8 | `E:\atlas\design\loop\build\PLAN.md` | The run-by-run plan of 2026-09-06 (runs 21 to 58) and the founder's ten open decisions (section 5); still the order of rows after tonight's rows are inserted | Eighth |
| 9 | `E:\atlas\design\loop\build\LEDGER.md` | Append-only record of every run; read the last three entries (runs 23 to 25) for the current patterns | Ninth |
| 10 | `E:\atlas\design\loop\build\SYSTEMS.md` | Every tool, gate and renderer, how to run and extend each | When touching the harness |
| 11 | `E:\atlas\design\loop\build\PAGES.md` | Per page: hand tables of bands and sizes; the generated census block | When touching a page |
| 12 | `E:\atlas\design\loop\build\DATA-REQUIREMENTS.md` | Sixteen data needs, defined, for the data track | When a figure is missing |
| 13 | `E:\atlas\rules\FOUNDER-VERDICTS.md` | The founder's words verbatim (append only); tonight's words are NOT yet in it (plan Task 0) | Before any design decision |
| 14 | `E:\atlas\design\blueprints\city.md` | The city page blueprint from the architecture loop: measured sections, the accent register, the bar ledger | When touching the city page |
| 15 | `E:\atlas\website\CLAUDE.md` | The repo's working method, constraints, generated counts | Once |
| 16 | `E:\atlas\website\src\components\spine\archetypes\*.tsx` and `stories.tsx` | The eleven archetypes and their stories | When building |
| 17 | `E:\atlas\website\scripts\harness\` | `preflight.mjs`, `render_archetypes.tsx`, `check_archetypes.mjs`, `render_page.tsx`, `check_page_holes.mjs`, `pages.json`, `shoot_page.mjs`, `crop_story.mjs`, `probe_page.mjs`, `probe_overlap.mjs`, `photo_diff.mjs`, `census.ts`, `env.cjs` | When verifying |
| 18 | `E:\atlas\design\loop\build\photos\` | 104 judged photographs under stable names (`site-<city>-<section>-<width>.jpeg`, `diff-*`, `story-*`) | When judging a change |
| 19 | `E:\atlas\website\scratchpad\arch\record_run25.py`, `patch_city_districts.py`, `state24.py` | The record-script and patch-script patterns every run reuses | When recording |
| 20 | `E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-09-03.md` | The previous dossier: the deploy, Vercel, Supabase, the login/Stripe stack finding | For deploy or database work |
| 21 | `C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md` | Claude's memory index; read the top three entries | Once |
| 22 | `https://claude.ai/code/artifact/a306e099-715c-4d9e-a501-5727090999a7` | The 2026-09-06 plan as a page (the founder's copy of PLAN.md) | Optional |

## 8. Open threads & next steps

**Committed next step (pre-authorized by the founder's "go" pattern; he has not yet said "go" for run 26):**

1. **Plan Task 7 first, outside a run or as the first act of run 26:** insert the four rows (`city:brief`, `sys:page-hierarchy`, `city:emphasis`, `sys:page-strip`) into QUEUE.md and set STATE.md's `next-step` to `city:brief` (Tasks 0 to 2). Where: `E:\atlas\design\loop\build\QUEUE.md`, `STATE.md`. Verify: `grep -n 'city:brief' QUEUE.md` shows the row above `city:demand`; STATE.md's next-step names it. Commit in the parent by file name.
2. **Run 26 = `city:brief` (plan Tasks 0, 1, 2):** append the founder's 2026-09-07 words verbatim to `E:\atlas\rules\FOUNDER-VERDICTS.md` under a dated heading; create `E:\atlas\design\loop\build\briefs\README.md` and `briefs\city.md` (the plan's Task 1 holds the full text of both; copy it, do not rewrite it); patch DOCTRINE.md with S1.5 DIRECT, the judge's block 0 and the eight-line report (the plan's Task 2 script). No site code that run. Verify: the three greps in Task 2 Step 3; the debug pass green first (`npm run harness`, `npx tsc --noEmit`, to files). Commit both repos by file name. **Also commit `data/audit/a11y_static_REPORT.md`** in the website with the message form of run 24 ("audit: the static accessibility report as its gate regenerated it (732 source files)").
3. **Run 27 = `sys:page-hierarchy` (Task 3):** the fixture, the three checks, proved on the fixture (exit 1, three named reds), then run on London to read the accent count. A London red on ACCENT BUDGET is expected and stands until run 28; say so in the report.
4. **Run 28 = `city:emphasis` (Task 4):** RankedBars `emphasis`, the districts and premises quiet, three kit figures to ink, the sheet's ranked-bars ACCENT rule reading `data-emphasis`. Verify: harness and filter green, ACCENT BUDGET green on London. Photograph the districts card and the page.
5. **Run 29 = `sys:page-strip` (Task 6):** `strip:page`; from then on every closing message is the eight lines plus the strip, sent with SendUserFile.
6. **Runs 30 on (Task 5):** `city:demand`, `city:trades`, `city:locals`, `kv-grid:tag-line`, `city:PAGE-2`, each built to its brief block (8, 10, 11, the page block), then PLAN.md's hood, cell and industry sequences with a brief per page first.

**Every run, unchanged:** the debug pass first; a red is the first job; a system row every third run; the chain after the commit when memory allows, its result recorded when read; STATE.md after every stage; the ledger entry; commits by file name; nothing pushed.

**Optional / someday (the founder's, not the loop's):** the ten decisions in PLAN.md section 5, above all **push and deploy** (40 commits waiting; add `vercel.json` with `{ "buildCommand": "npm run build" }` so the chain runs on deploy) and **district pages**. The data track's sixteen requirements. The sibling architecture loop's queue (dormant since the reset).

## 9. Constraints, guardrails & operator preferences

**Never:** fabricate a figure, a place detail, a note or a source; edit `rules/*` except to append his words verbatim; rename a URL; use an em dash, a source-agency name, a raw hex, pixel or millisecond in a component; put the accent on hover; `git add -A`; push, deploy, `npm run build`; `--no-verify`, `--no-gpg-sign`, force-push; open a browser or dev server to show him anything; ask him to look or decide inside a run; download or install without his explicit word; run the parallel chain; pipe a verification; leave a run with the tree half-edited and STATE.md silent; touch the home page or the map; regenerate `docs/loop/artifacts/final-pages/`; stop any process that is not a `chrome-headless-shell` your own script spawned.

**How he wants to be told things (tonight's ruling, on top of the standing one):** eight plain lines a designer friend would say: what changed on the page, why, what is loud and what went quiet, what was left out and why, what the tests say, what the picture shows that the tests cannot, what is next, what he can settle with one line. No file paths, no function names, no gate or rule names, no commit hashes, no run numbers in the body. One picture of the whole page. Second person. When asked for the plan or the state, ten simple bullets. Lead with the answer; give a recommendation, not a menu.

**How he steers:** one line per ruling in `E:\atlas\design\loop\build\VERDICTS.txt`, in his own words; the next run copies it verbatim into `rules/FOUNDER-VERDICTS.md` under the date and applies it. "go" starts a run. Silence is not consent: a verdict that never arrived is never inferred (the 2026-08-30 message cut off before the locals and close sections).

**Approvals:** deploys and pushes are his; the Vercel build command is his; the one download so far was approved by name. The plan's execution mode: inline through the loop's runs unless he says otherwise (offered tonight; no answer yet).

## 10. Environment & reproduction

- **App:** `E:\atlas\website`, Next.js 15.5 / React 19.2 / TypeScript 5 / Tailwind 3.4, Node v26.3.0, Playwright ^1.60 (chromium-1223 at `C:\Users\benet\AppData\Local\ms-playwright`). Own git repo, branch `main`, remote `github.com/benetbani/marginatlas-web`. `.env.local` exists (Supabase keys; the harness preload `scripts/harness/env.cjs` loads it; the chain never may).
- **Parent:** `E:\atlas`, branch `p4-seam`, no remote. `rules/`, `design/blueprints/`, `design/loop/build/` (this loop), `design/loop/architecture/` (the sibling, dormant).
- **Hosting and database:** unchanged from the 2026-09-03 handoff (Vercel project `marginatlas-web-twtl`, the CLI authenticated; Supabase migrations applied by hand). Nothing in this phase touched them.
- **Machine:** Windows 11, 8 GB. Free memory before a chain: `powershell -NoProfile -Command "[int]((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1024)"`; leftover browsers: `tasklist | grep -c chrome-headless-shell`.

The loop's commands, each from `E:\atlas\website`, each to a file:

```bash
cd /e/atlas/website && npm run harness > scratchpad/harness-run.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npx tsc --noEmit > scratchpad/harness-tsc.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npx tsx scripts/prebuild_all.ts --concurrency=1 --only=archetype-coverage,archetype-copy,counts-fresh > scratchpad/gate-subset.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npm run prebuild:serial > scratchpad/harness-prebuild.txt 2>&1; echo "prebuild serial exit $?" >> scratchpad/harness-prebuild.txt
```

```bash
cd /e/atlas/website && npm run shoot:page -- scratchpad/harness/pages/city-london.html "#districts" scratchpad/photos/districts "1280,768,375"
```

```bash
cd /e/atlas/website && npm run photo:diff -- before.jpeg after.jpeg out.jpeg
```

```bash
cd /e/atlas/website && npm run probe:page -- scratchpad/harness/pages/city-london.html "1280,768"
```

```bash
cd /e/atlas/website && npm run census -- --write
```

```bash
cd /e/atlas/website && npx tsx scripts/counts.ts --write
```

Starting a run: the founder opens Claude Code in `E:\atlas\website` and types "go" (or `/loop 20m` with the text of `LOOP-PROMPT.md`). The run reads the files, never memory.

## 11. Landmines & gotchas

- **The working directory.** The single most repeated fault (eight times in runs 18 to 25). A `cd` in one parallel call moves the shell for its siblings. Every command carries its own `cd`. The preflight now stops a harness script on the wrong ground; python and git commands have no such guard.
- **STATE.md is stale by tonight's plan.** It names `city:demand` as the next row; the plan's Task 7 has not run. Correct it before anything else, or the loop will build the spending pool without a brief.
- **`data/audit/a11y_static_REPORT.md` is modified and uncommitted** (the chain regenerates it whenever a source file is added). Commit it by name; never let it ride in an unrelated commit unnamed.
- **The counts have three carrier files** (`CLAUDE.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `docs/verification-protocol.md`). Run 24 committed one and left two; run 25 caught it. After `counts.ts --write`, `git status` and commit all three.
- **The coverage gate's numbered keys shift** when a box leaves a file. Re-key the exceptions in the same run and read the gate's output (`sys:coverage-keys` will fix the keying).
- **`stripCommentLines` takes lines, not text** (`string[]` in, `string[]` out); `\s` in a `^\s*` regex swallows the blank line above a match. Both cost a red in run 24.
- **The ranked-bars ACCENT rule expects exactly one accent at 1280.** A quiet card (plan Task 4) needs the rule to read `data-emphasis` first, or the sheet reds.
- **The Band halves every band from md to lg**, so a card at 768 is one pixel wider than at 375; a lone child takes two thirds only at lg. Bands with a lone card carry `stack="lg"`.
- **Two answer cards on one page** are sanctioned by the city blueprint (the masthead's and the verdict's); the answer card's page level draws the only h1.
- **The KvGrid puts a modelled cell's tag beside the figure**, so on a phone a tagged cell's note drops a line below its neighbour's (`kv-grid:tag-line`, queued).
- **The London districts are the only ranked districts in the data**; every other city's district card self-omits. The multiples are tag constants (modelled). District coordinates do not exist; the map never drew.
- **Memory:** a run that ends under about 900 MB free defers the chain; a watcher (a Monitor loop polling PowerShell) has been used to wake the session when memory rises. Stop a stale watcher with TaskStop before launching another chain.
- **Playwright's browser folder vanished once between two green runs** (2026-09-06). The preflight names the remedy; it is a download, so it waits for the founder's word.

## 12. Glossary

- **Archetype:** a reusable section component with its law inside (`src/components/spine/archetypes/`).
- **Builder:** the synchronous function in `src/lib/spine/<name>_rows.ts` that turns data and copy into the archetype's rows.
- **Stories / the sheet:** the rendered instance set of every archetype (`scratchpad/harness/archetypes.html`), keyed `XX` or `slug:variant`; the index at its top.
- **Harness:** the archetype checker (`check_archetypes.mjs`) and its rules, named in capitals (BOTCHED MOBILE, NO HIERARCHY, ACCENT, HEADLINE, ROWS CUT...).
- **The filter / page filter:** the full-page checker (`check_page_holes.mjs`) over `pages.json`; a **hole** is a blank rectangle a quarter of a card each way.
- **The chain / a gate:** `scripts/prebuild_all.ts` and its 138 scripts; serial only here.
- **Coverage exception:** a section not yet on an archetype, listed in `coverage_exceptions.json` so the gate stays green; deleted the run its section lands.
- **Band, Box, Rail, Head, Fig, SampleTag:** kit primitives: a row of equal-height cards; a card; a section opener with icon tile and kicker; the older opener with a title; a figure; the "sample" pill for a modelled figure.
- **Terminus:** the page's closing card of up to three doors.
- **Row / run / stage:** see section 5.
- **Verdict / ruling:** the founder's word, verbatim in `rules/FOUNDER-VERDICTS.md`; a **VERDICTS.txt** line is how he sends one.
- **Ledger / report / state / queue / doctrine / systems / pages / data requirements:** the loop's files in `E:\atlas\design\loop\build\`.
- **Brief, loud/quiet, accent budget, the strip:** tonight's plan: the design intent per section; the page's three loud moments; the page-level accent cap; the one-picture-per-run tool.
- **Modelled / measured / placeholder:** a figure's confidence; modelled and placeholder figures wear the sample mark.
- **The architecture loop:** the sibling procedure in `design/loop/architecture/` that wrote the blueprints; dormant since the reset.

## 13. Successor verification checklist

You are oriented when you can answer these from the dossier and the files:

1. What is the unit of work of the build loop, what are its eight stages, and which file is its law?
2. What did the founder say on 2026-09-07, in his words, and what two things about the loop's output does it change?
3. What is the committed next step, and why is STATE.md's next-step line wrong tonight?
4. How many terracotta figures does the London city page wear today, which three should remain, and which file will say so?
5. Which one tracked file is modified and uncommitted in the website repo, why, and how is it committed?
6. Why must every shell command begin with a `cd`, and what does a harness script do on the wrong ground since run 24?
7. What may never be done without the founder's explicit word (three things), and how does he send a ruling?
8. Where are the ten decisions only he can make, and which one blocks readers from seeing any of this work?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com, the build loop (archetypes, harness, the art-direction correction of 2026-09-07)
Working directory: E:\atlas\website (the site; the loop's state is in E:\atlas\design\loop\build)
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-09-07.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   E:\atlas\website\docs\superpowers\plans\2026-09-07-art-direction-in-the-build-loop.md
   E:\atlas\design\loop\build\DOCTRINE.md (in full)
   E:\atlas\design\loop\build\STATE.md
   E:\atlas\design\loop\build\QUEUE.md (the first sixty lines)
   E:\atlas\design\loop\build\LOOP-PROMPT.md
   E:\atlas\design\loop\build\DEBUG.md
   E:\atlas\design\loop\build\PLAN.md (sections 3 and 5)
   E:\atlas\design\loop\build\LEDGER.md (the last three entries)
   E:\atlas\rules\FOUNDER-VERDICTS.md (the last heading and the 2026-09-04 section)
   E:\atlas\website\CLAUDE.md
3. Do not edit anything, run anything destructive, or make decisions until steps 1 and 2 are done.
   Every shell command you ever run here begins with `cd /e/atlas/website &&` or `cd /e/atlas &&`.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5 to 10 lines: the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files
   (start with STATE.md's next-step line and `git status` in both repos); the dossier is
   a point-in-time snapshot and the code and files are ground truth.
6. Then stop and wait for my go. When I say "go": first do the plan's Task 7 (re-point
   QUEUE.md and STATE.md), then run 26 as the loop prompt defines a run, taking the row
   city:brief (the plan's Tasks 0 to 2). Report in eight plain lines, no file paths, no
   rule or gate names, no commit hashes.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly. If anything in the dossier is unclear, ask before acting, but only after
you've read everything above.
```
