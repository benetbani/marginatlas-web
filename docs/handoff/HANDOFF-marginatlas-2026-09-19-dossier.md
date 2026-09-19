# HANDOFF, marginatlas.com: the continuity dossier
The fifty-step plan ended today with the launch checklist's first honest run (NOT READY: 2 reasons); the site is live on the day's third deploy; the checkup skill exists and its first audit is on file. Written 2026-09-19, evening, at the end of one very long session.

> **How to use this document.** Read top to bottom once. Then read the files in section 7 in the given order. Do not start work until you can answer the checklist in section 13. A ready-to-paste re-hydration prompt is in section 14. The one-page handoff of the same date (`HANDOFF-marginatlas-2026-09-19.md`) is the short form of this; this dossier is the zero-loss form.

## 1. TL;DR

marginatlas.com is a Next.js site that prints what a small business keeps, by trade and by place, and refuses to print a figure it cannot stand behind. A "build loop" run by a controller session with dispatched subagents executed a fifty-step plan (`E:/atlas/design/loop/build/plan-2026-09-17/`) from 2026-09-17 to 2026-09-19; today it finished: every page type is on its spine (country 21 blocks, city 17 less one ruling, trade 16, industry 12, neighbourhood hub and district pages 7, how-to 6), the chain holds 155 gates and runs inside every Vercel build, a new gate refuses to print filled or floored revenue (money now shows on 87 of 3,670 slate cells and says "not measured" elsewhere), and `npm run launch:check` printed its checklist: NOT READY, two reasons, both named. On his word the site was pushed and deployed three times (the first failed on a build server with no browser, the third fixed a how-to page that had answered 404 with its whole body for months). A `checkup` skill was written by the writing-skills TDD method and run on this project: the machine, not the code, is the bottleneck (the same chain: 161 s on Vercel, 513 to 1,017 s here), the working loop pays about 100,000 words of reading and five ledger rewrites per step, and the site is public and indexable with the sample marks off. The single most important thing: **nothing is pushed, built or deployed without his word, and the honesty rules are not negotiable.** The recommended next action is `npm run verify:deploy` on a machine with 1.1 GB free, then the `launch:*` queue rows, and his four answers (section 8).

## 2. Mission and success criteria

**The enduring goal, in his framing:** a rich world atlas of what a business earns and what its owner keeps, by trade and place, "very powerful free", with honesty and myth-debunking as the moat; decision-in-the-top-20-percent of every page (answer first, depth below); the country page rebuilt as the exemplar, then city, then the page types that never existed on the system. Money is the core; variance comes through subtypes; a figure the site cannot stand behind is withheld with a stated line, never faked ("no plausible numbers").

**The current tactic (this fortnight):** the fifty-step plan, files 03 (friction), 01 (models), 02 (errors), 04 (pages), 05 (data and launch). It ended by its own clause: step 50's script printed the launch checklist. "Done" for the plan is not "launch ready"; it is "the checklist is honest and every reason has an owner".

**Hard constraints that bound any solution** (the goal prompt, CLAUDE.md, his rulings; the newest ruling wins): no em-dashes in user-visible source; no source-agency names in copy; no URL slug renames; no raw hex or pixel values in components; never `--no-verify`; never raise a ratchet baseline; every figure names its file, field and tag or is withheld with a line; a fill value is withheld; modelled says modelled; one prose section per page; three loud moments or fewer; no coined index, no cream, no green, no one-word place summary, no word where a number goes, no featuring without a reason, flags one width, no photograph but the city placeholder; an uncatalogued form is a mockup awaiting his click; the loop decides everything except four things it may ask him (a candidate form's click, the home page's date, the 90 countries below the floor, two undated rulings that disagree); subagents commit nothing under `E:/atlas`.

## 3. Current state, ground truth

| Component | Status | Notes |
|---|---|---|
| Website repo `E:/atlas/website`, `main` | HEAD is the commit that adds this dossier (run `git log --oneline -3`), clean tree | `44877f5e` is on origin and in production; the commits after it (`923ffcb8` the one-page handoff, then this dossier) are docs only and unpushed. Branches to keep in mind: `checkup-baseline`, `checkup-green` (section 8), eight stale merged reform branches. |
| Production `https://marginatlas.com` | Vercel deploy `44877f5e`, success 11:47 UTC | Fetched and read, not assumed: `/gb` carries the doors' attributes and two blocked seats; `/af` prints the cities seat's line; `/gb/how-to-open` 200; the hub and district pages render; the trade page answers 200 to a browser (403 to a bare curl, the scraper rule). Status read through `gh api repos/benetbani/marginatlas-web/deployments` and `npx vercel inspect <id> --logs` (the CLI is logged in as benet-4126). |
| Parent repo `E:/atlas`, `p4-seam` | HEAD `885bb0d`, clean of tracked changes | **No remote.** 4.64 GiB of loose objects, never packed; 17.4 GB of raw data tracked; 55 GB of stale worktrees under `.claude/worktrees` (all zero commits ahead). The rules corpus, the loop and the plan exist on one drive. |
| The plan (50 steps) | Complete to its end clause | STATE.md `step-in-flight: NONE. THE GOAL ENDED 2026-09-19`. Steps 37 (home page date) and the candidate clicks are his. |
| The chain | 155 gates (`scripts/prebuild_all.ts`; counts generated by `npx tsx scripts/counts.ts --write`) | Green on Vercel at `44877f5e` (155 of 155, 161 s). **Not proven green end to end on this laptop at HEAD**: the last full local runs were 154 of 155 (archetype-copy killed at the old 120 s budget under load; default now 240 s), and a forced run died on memory. Every subset the day's steps ran is green. |
| Launch checklist `npm run launch:check` | NOT READY: 2 reasons (`scratchpad/launch/checklist.txt`) | (a) 13 of 18 exemplars at their floor: London 16 of 17 (ruling 30), Frankfurt and Abidjan 14 of 17 (districts and trades blocks self-omit off London), how-to DE and IN 5 of 6 (locals seat not drawn). (b) the chain half: no green local chain today; production proven 9 of 9 pages 200 with the marker `data-lands=` on `/gb`. Items (c) to (i) pass. |
| Honesty gate `money-shown-own-rows` | In the chain, planted once | Money shows on 13 of 31 walked routes, 87 of 3,670 slate cells (New York's own rows, the curated London entries); `isTrustedLocalCell` refuses `_revenueFilled`; `moneyShown` refuses a floored margin; the curated London entry is bound to London's geo id (the UK aggregates had printed London's figure as the country's). |
| Sample marks | OFF in production; `.env.production` committed with `NEXT_PUBLIC_SITE_PRIVATE=1` | The `sample-switch` gate fails a build with the marks off and no private flag. **The flag is a declaration only: the site answers 200 to anyone and is indexable.** His decision (section 8). |
| Data requirements | 82 items, 16 marked launch-blocking (all CLOSED or WITHHELD with a line), items 72 to 80 are his nine chosen sections, item 81 the honesty gate, item 82 a covered city per country | `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` |
| The checkup skill | Deployed at `C:/Users/benet/.claude/skills/checkup/` (SKILL.md, reference.md) | TDD-built: two baselines, one green run, one refactor check. Its first audit: `E:/atlas/design/loop/build/CHECKUP-2026-09-19.md` (six findings with kinds, a 21-metric ledger, a data-side addendum; its first three actions: the sample marks on or the deployment protected; the machine freed and one green chain at HEAD; his rulings on the reading path, the two-tier chain and a backup for the parent). |
| Memory (auto) | 47 files, `C:/Users/benet/.claude/projects/E--atlas/memory/` | The two newest lines of MEMORY.md are today's: the plan's end and the checkup skill; the founder's "technical, pain-point" standard for sections. |

Believed but not proven: that Vercel's 161 s chain is representative (one log); that the `checkup-green` branch's tsc win (97 to 74 s cold) survives a full chain (not run).

## 4. How we got here, the decision trail (this session and its ancestors)

1. **The loop and its law.** Since 2026-09-05 a controller runs "steps" as dispatches to subagents against `MODEL.md` (the page model: PART 8 per-page spines, PART 9 what the model forbids) with harness checks and ratchets. His corrections shaped it: 2026-09-03 ("stay on the country page, the loop decides, never ask me to look"), 2026-09-04 (archetypes as the unit, a ruling per archetype), 2026-09-07 (an art director's briefs, plain reports, three loud moments a page), 2026-09-11 (natural language, no featuring without reason, pages absorb the parts). The plan of 2026-09-17 made MODEL.md the one source.
2. **The industry page (step 34, four dispatches).** Rulings the controller made when the spine met the data: the benchmark draws five bars not ten (ten made a 559 px table beside a 215 px grid); the bento draws four cells on the trade market's tiling (8.7's three-cell tiling made a full-width card, which he banned); the places table is seated blocked on 243 of 243 under an **own-row law** (every slate city but New York resolved on a filled or floored revenue); the fixed-cost reading stands twice until the composition round; the leader door passes a retired leader.
3. **The honesty step, `trust:revenue-filled`.** The places table's finding was site-wide: `fillMissingFields` supplies a headline revenue and marks `_revenueFilled`, and the trust gate never read the mark, so trade pages off London printed a filled figure as the city's own. Decided and built the same day, before the neighbourhood page, so every later measurement stands on honest states. Money shown fell from 1,108 to 87 slate cells. Three follow-ups by hand: the curated London entry bound to London's geo id; the across resolver admitting the entry; the opening page withholding a floored take-home.
4. **His sections brainstorm.** He selected nine ideas and rejected the rest as "wikipedia like"; the standard is now technical and pain-point driven (memory `feedback_2026-09-19_sections_technical_pain_points.md`); the nine are DATA-REQUIREMENTS items 72 to 80 with seats and withholding rules, every one a blocked seat until research lands (the country blocks they draw on are seed data).
5. **Step 48, the sample switch.** A gate fails a build with the marks off unless the site declares itself private; the declaration is `.env.production`, committed by a gitignore exception, holding public flags only, so launch day flips one line and adds `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1`. The checkup later showed the declaration protects nothing by itself.
6. **Step 49, the 90 countries.** He was asked, did not answer, so the loop took option A (the cities band as a drawn blocked seat naming the region's three largest covered cities; the floor counts it), recorded in MODEL 8.2's floor bracket as reversible by his word. Step 49 found by counting that the card builder read a draft list of 53 countries; fixed the same day (105 draw cards, 90 the seat, none at 20 blocks).
7. **Steps 39 and 40.** Every door declares its promise (`data-lands`), every masthead its answer (`data-answers`), a jsdom gate walks the renders (61 anchors, none dead); every page declares its three loud seats in code, the census prints "Loud today: n of 3", a gate holds it to the measured accents.
8. **Step 50.** `scripts/verify_launch_ready.ts`, by hand, never in the chain, nine items measured by the thing itself. First run NOT READY: 2 reasons. The goal ended there by GOAL-PROMPT's clause.
9. **The push ("push-it-go").** 114 commits to origin; the first Vercel build failed because the three harness gates stop where Playwright's Chromium is absent (every other browser gate had skipped loudly on a build server since 2026-08-27 through `requireBrowser`); fixed; the second deploy landed the plan's site; production fetched page by page found `/gb/how-to-open` answering 404 with the whole page in its body (the middleware's static-child exemption typed "industries" alone); fixed with a generated set and its gate; third deploy success.
10. **The checkup skill and the checkup.** Written by the writing-skills TDD cycle (two baseline audits without the skill on this repo, one green run with it, one refactor check); the audit's verdict: the machine is the bottleneck, the working loop's fixed tax, gates that never retire, dead weight compiled on every build, data as the critical path, public with the marks off.

## 5. Hard-won truths and mental model

- **A figure is a claim.** Every printed number names its file, field and tag, or the card draws a stated line. The trust gate's sixth guard (`_revenueFilled`) and the floor check in `moneyShown` are the two rails; `trade_net.ts` is the one net builder (engine where money shows, else the shard's ladder unless it is the 42 / 10 / 5 fill, else the sector profile's residual, marked modelled).
- **The spine vocabulary.** A page is blocks in a fixed order (`00 take` ... `NN close`); a block is an archetype (seventeen catalogued forms plus `BlockedSeat`); a band pairs two cards at a measured split (`1-1`, `2-1`, `3-2`, `stack="lg"`); a seat awaiting his click on a candidate form is drawn plain as `KvGrid` with a census note; a blocked seat is "Not gathered yet: ..." with the foot "Waits on DATA-REQUIREMENTS item N."; a door is an anchor that leaves the page and declares what it promises; loud moments are the accent figures, three at most, declared per page.
- **Baselines fall and never rise.** `model_laws_baseline.json`, `page_holes_baseline.json`, the art-direction and section-bands files (with `_reseed_history`), `gate_reds_baseline.json`. A reseed is allowed only with the rows written and the reason; an instrument correction is a reason.
- **Every new rule is fault-planted once** and watched red, then unplanted; a gate that never went red proves nothing.
- **Read the module that produces a number before acting on the number**; state the instrument's blind spot; one change, one verification.
- **The chain is deterministic but the machine is not.** Vercel: 155 gates in 161 s. This laptop: 513 to 1,017 s, refuses under 1,100 MB free, dies when forced. A timeout under load is a finding about the machine.
- **The loop writes five ledgers per step** (STATE, DEBUG, QUEUE, MODEL brackets, DATA-REQUIREMENTS; PAGES by the census) and commits in both repos, the website first, the parent's record after. The checkup names this as the second-largest inefficiency; it is still the rule until he rules otherwise.
- **The founder's register.** Plain language, numbers, no jargon in reports; he reads "so?" as "give me the state in three lines"; he rejects encyclopaedia-style lists; he hates browser automation used to show him things (deliver files or URLs); he decides taste by looking at a sheet once per archetype.

## 6. Dead ends, do NOT retry

| Tried | Result | Do instead |
|---|---|---|
| Forcing the chain past the memory preflight (`PREFLIGHT_FORCE=1` under 1,100 MB) | Died in the archetype harness at 875 MB on a screenshot error; a memory death, not a red | Free the machine (close sessions, delete the 55 GB worktrees) and run `verify:deploy` |
| The Node deploy watcher `deploy:watch` on this machine | Every fetch failed ("fetch failed") while curl reached the site | Poll with curl (browser UA, `Accept-Language`) or read deployment status through `gh api` |
| Long prose or briefs through a Bash heredoc | The tool mangles backslashes and breaks on some quote patterns ("unexpected EOF while looking for matching quote") | Write files with the Write tool; run scripts from files (`scratchpad/record_*.py`) |
| `git checkout <file>` to "restore" a file while holding uncommitted edits in it | Wiped the edits (happened once today on `top_level_segments.ts`) | Stage and diff first; keep edits in a script that re-applies |
| The plan's district route `/gb/london/<district>` | Collides with the trade route's third segment, where unknown slugs 404 by design | The district page lives at `/cities/[slug]/neighborhoods/[district]` |
| 8.7's three-cell bento with a two-wide crew cell | A 1,072 px card, full width by the section-bands gate and by his ban | Four cells on the trade market's tiling |
| A ten-row benchmark beside the survival grid | 559 px beside 215 px at every split, under the E2 ink floor | Five rows (the trade and the highest four) |
| "The lightest district's rent multiple" as the hub's answer | It is 1.00x by construction | The spread, the dearest against the cheapest; on a district page the district's own rent |
| Passing `--marker-url=/gb` to a script in Git Bash | Rewritten to `C:/Program Files/Git/gb` | `MSYS_NO_PATHCONV=1` in front of the command |
| A bare `curl` on a trade page | 403 (the middleware's scraper rule: tool UA without Accept-Language) | `-A "Mozilla/5.0" -H "Accept-Language: en"` |
| Spawning four sub-audits in a thirty-minute audit | Three never returned inside the budget | Spawn what you can harvest; a late audit is folded in only when it lands complete |
| Warm timing runs as evidence | 36 s "after" was the incremental cache | Cold runs (delete `tsconfig.tsbuildinfo`), or counts |
| The sample-marks "private" flag as protection | It is a line no page reads; production is public | Deployment protection on the host, or the marks on |

## 7. Critical files and artifacts, the map and the reading order

| # | Path | Role | Read priority |
|---|---|---|---|
| 1 | `E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-19.md` | the one-page handoff: first commands, his answers, the day's traps | first, 3 minutes |
| 2 | `E:/atlas/design/loop/build/STATE.md` | the state of record: `step-in-flight`, `steps-done`, the push and deploy lines | second |
| 3 | `E:/atlas/design/loop/build/CHECKUP-2026-09-19.md` | the measured picture of the project and the owner decisions it waits on | third |
| 4 | `E:/atlas/design/loop/build/QUEUE.md`, the `launch:*` rows (lines 65 to 69) and the rows dated 2026-09-19 | the next work, each with its done-means and owner | fourth |
| 5 | `E:/atlas/website/CLAUDE.md` | the working method, the hard constraints, the generated counts block | before any edit |
| 6 | `E:/atlas/website/docs/verification-protocol.md` | the definition of done | before any delivery |
| 7 | `E:/atlas/design/loop/build/DOCTRINE.md` sections 6a, 13, 16 | pace rules, the traps ledger, the 2026-09-03 correction | before dispatching anything |
| 8 | `E:/atlas/design/loop/build/briefs/MODEL.md` PART 8 (per page) and PART 9 | the law of every page; read the section a step touches, not the whole 40,000 words | when a step touches a page |
| 9 | `E:/atlas/design/loop/build/DEBUG.md` section 7, the last twelve rows | every baseline's number and why it moved today | when a gate reds |
| 10 | `E:/atlas/design/loop/build/DATA-REQUIREMENTS.md` items 69, 72 to 82 and the Launch lines | the data track and the launch-blocking items | for data work |
| 11 | `E:/atlas/design/loop/build/plan-2026-09-17/GOAL-PROMPT.md` and `04-PAGES.md`, `05-DATA-AND-LAUNCH.md` | how the loop worked and what each step meant | for context on a finished step |
| 12 | `E:/atlas/website/scripts/verify_launch_ready.ts`, `scratchpad/launch/checklist.txt` | the launch checklist and its first run | before claiming readiness |
| 13 | `E:/atlas/website/scripts/prebuild_all.ts`, `scripts/gates.json` | the chain, its registry, the per-gate timeout (240 s) | when adding or reading a gate |
| 14 | `E:/atlas/website/src/lib/cells/trust.ts`, `src/lib/cells/cell_view.ts`, `src/lib/spine/trade_net.ts`, `src/lib/scores/cell_board.ts` (`getLondonEntry`) | the honesty rails | before touching any money figure |
| 15 | `E:/atlas/website/src/lib/spine/door_kinds.ts`, `scripts/verify_doors.ts`, `scripts/verify_loud_seats.mjs`, `scripts/lib/accent_walk.mjs` | doors and loud seats | when a page's navigation or accents change |
| 16 | `E:/atlas/website/src/middleware.ts`, `src/lib/routing/top_level_segments.ts` | the real-404 rule and its generated sets (`TOP_LEVEL_SEGMENTS`, `COUNTRY_STATIC_CHILDREN`) | when adding a route |
| 17 | `E:/atlas/website/.env.production`, `scripts/verify_sample_switch.ts`, `docs/DEPLOY-PACK-spine-flags.md` ("Launch day") | the sample-marks switch and its launch-day flip | before launch |
| 18 | `C:/Users/benet/.claude/skills/checkup/SKILL.md` and `reference.md` | the audit protocol | when asked for a checkup |
| 19 | `C:/Users/benet/.claude/projects/E--atlas/memory/MEMORY.md` | the memory index; the two newest lines are today's | at session start (auto-loaded) |
| 20 | `E:/atlas/design/mockups/2026-09-16/index.html` | the candidate forms awaiting his click | when he rules on candidates |

## 8. Open threads and next steps

**Committed next steps (in order; none pre-authorised beyond reading):**

1. **A green chain at HEAD on a free machine.** `cd /e/atlas/website && npm run verify:deploy` writes `scratchpad/deploy/chain.txt`; read it. Needs 1,100 MB free: close the other Claude sessions, delete `E:/atlas/.claude/worktrees/*` (four worktrees, 55 GB, all zero commits ahead; `git worktree list` then `git worktree remove`), and consider `git gc` in the parent (4.64 GiB loose). Success: `Passed: 155`, `Died on memory: 0`.
2. **`launch:city-seats-off-london`** (S): the city's `03 districts` and `09 trades` blocks draw the blocked seat with its line off London instead of self-omitting (PART 4's idiom; the country page's `07 workforce` is the exemplar); Frankfurt and Abidjan then read 17 of 17 less ruling 30. Verify with `npm run harness:page -- --only=city` and the laws list; then `npm run launch:check`.
3. **`launch:howto-locals-seat`** (S): the how-to page's `04 locals` seat off GB (MODEL 8.9), DE and IN to 6 of 6. Same verification.
4. **Push the handoff commit** (`923ffcb8`, docs only) on his word; watch the deploy through `gh api` (the Node watcher fails here).
5. **`launch:check` again** with `--marker=<a string HEAD puts on a page>` once a deploy carries it; item (b) closes when the chain is green locally and production proves the marker.

**His answers (asked, unanswered; each one line):**
- The sample marks in public: `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1` (the launch-day flip) or deployment protection. The checkup's first action.
- Ruling 30 or the city's `10 easiest` seat (London 16 of 17 on purpose until then).
- The candidate forms' clicks (fact card with a focal, placement line, derived ratio, ring, donut).
- The checkup's owner decisions: the reading path and the commit form (DOCTRINE sections 1 and 8); the two-tier chain (the 2026-09-17 ruling on live renders per deploy); a backup for the parent repo (no remote; 25 blobs over a hosted repo's limit); memory for the laptop; option A on the 90 countries (taken, reversible).
- The home page's reopening date (`HOME-PROPOSAL.md`, plan step 37).

**Optional, someday, with their owners:**
- The two test branches: `checkup-green` (per-icon phosphor imports measured cold 97 to 74 s tsc; scratch folders out of the typecheck; `docs/checkup/2026-09-19.md`; CLAUDE.md's stale timings pointed at the ledger) and `checkup-baseline` (gates spawned as `node --import tsx`, which the checkup measured as 5 to 8 s of npm boot per gate on this machine and about 1 s on Vercel). Merge only after `verify:deploy` is green on the branch; delete otherwise.
- The checkup's proposals: `/dev` routes off production builds; the 18 unused dependencies removed after one build; the retire-one rule for gates; one heartbeat data metric; the parent's `delivery/` 69 percent redundant copies deleted after a listing.
- The nine sections he chose (items 72 to 80): every one starts as a `BlockedSeat` and a research brief; the data track first.
- QUEUE rows recorded today: `arch:compare-table-name-column` (22 ch ruling, and the value columns need a cap), `arch:ranked-bars-table-doors`, `doors:aggregate-spelling`, `doors:cell-route-unverifiable`, `industry:route-resolves-to-parent` (109 of 243 slugs render a parent's page), `country:cities-region-line` (his eye), `hood:crowd`, `data:flavour-notes-rows`, `industry:format-names-over-three`, `launch:chain-under-load`.
- Candidates 4 (ring) and 5 (donut) still owe mockups to the review sheet.

## 9. Constraints, guardrails and operator preferences

- **Never** push, build (`npm run build`) or deploy without his word; `npx tsc --noEmit`, `npm run harness`, the chain subsets and `verify:deploy` are the approved cadence.
- **Never** `--no-verify`, never force-push, never rename a URL slug, never raise a baseline, never pipe a verification into a formatter (write to a file, read the file, echo the exit code).
- **Never** print a plausible number; a fill is withheld; modelled says modelled; every figure names file, field and tag.
- **Never** claim what production serves without fetching it; never claim a gate ran without reading its output file.
- Subagents commit nothing under `E:/atlas`; the controller records their reports; every command carries its own `cd`.
- His rulings bind and the newest wins; the four things the loop may ask him are listed in section 2; everything else the loop decides and records as reversible.
- Reports: plain language, numbers with their commands, no jargon, no self-flagellation; corrections stated once; "so?" means three lines of state.
- Do not open a browser to show him things; deliver files, URLs, or inline text.
- Memory: write durable facts to `C:/Users/benet/.claude/projects/E--atlas/memory/` with a one-line index entry; the index is auto-loaded.

## 10. Environment and reproduction

- Two repos on Windows 11, Git Bash through the Bash tool (the working directory resets between calls: every command starts with `cd /e/atlas/website &&` or `cd /e/atlas &&`).
- Website commands (`E:/atlas/website/package.json`): `npm run verify:deploy` (the serial chain to `scratchpad/deploy/chain.txt`), `npx tsx scripts/prebuild_all.ts --concurrency=1 [--only=a,b] [--timeout=240]`, `npm run harness` (the archetype sheet, the page filter, renderers-agree), `npm run harness:page -- --only=<surface> --section=<id>`, `npm run harness:laws -- --list --render --ratchet`, `npm run verify:quick -- --story=<kind/key> --page=<surface#id>`, `npm run look -- <surface> <slugs> "#id" 1280,375`, `npm run census -- --write`, `npm run query:outcomes`, `npm run launch:check [-- --marker=<s> --marker-url=/gb]`, `npm run deploy:watch -- --marker=<s>` (fails on this machine; use curl or `gh api`).
- Memory floors: the chain refuses under 1,100 MB free, a browser tool under 620 MB (`scripts/harness/preflight.mjs`); free memory: `node -e "console.log(Math.round(require('os').freemem()/1048576))"`.
- Secrets live in `E:/atlas/website/.env.local` (never committed); `.env.production` is committed and holds public flags only.
- Vercel: `vercel.json` pins `npm run build`; the `prebuild` hook is the chain; deploy status `gh api repos/benetbani/marginatlas-web/deployments?per_page=3`, logs `npx vercel inspect <dpl_id> --logs`.
- Renders the gates read: `scratchpad/harness/pages/<surface>-<slugs>.html` (written by `pages-fresh`); the doors walk `scratchpad/harness/doors.txt`; the accent record `scratchpad/harness/accents.json`.
- The parent's loop tooling: `E:/atlas/design/loop/build/` (STATE, DEBUG, QUEUE, LEDGER, PAGES with the census block, DATA-REQUIREMENTS, HOME-PROPOSAL, briefs/MODEL.md, briefs/TEMPLATE.md, the plan folder); records are written by small Python scripts run from the session scratchpad.

## 11. Landmines and gotchas

- A closed `<details>` reports client rects for its hidden content; the laws checker, the page filter and the probe all counted hidden rows as ink until today (`hiddenFromSight`, the same rule in three files).
- The database spells geo ids in capitals (`GB-E09000001`), the aliases file in lower case; compare case-folded.
- `generateStaticParams` on the how-to route lowercases the country; `buildHowTo` uppercases; fine, but the middleware's two-segment rule pins 404 on any static child of `[country]` not in `COUNTRY_STATIC_CHILDREN` (generated, gated).
- Three harness gates stop with exit 2 where Chromium is absent; on a build server they must skip loudly (`requireBrowser`), which they do since `68a1a0eb`; a new browser gate must call it too or it kills the next deploy.
- The harness's story lookup by `--only` reads the last full render's census, so a new story key resolves only after a full `npm run harness`.
- `counts.ts` compares carrier blocks after normalising line endings (a Windows checkout trap); `git diff --cached --stat` before every commit (the shared index once swept another agent's staged files into a commit).
- The `industry-refs` gate reads any `industry: "<word>"` as a trade reference; the doors module carries `allow-industry-ref` for its kind name.
- A Bash heredoc through the tool mangles backslashes and long prose; the Write tool for files.
- `MSYS_NO_PATHCONV=1` when an argument starts with `/`.
- The archetype-copy gate runs 95 s free, 128 s beside the harness, 225 s under other load; the per-gate default timeout is 240 s since `d4fae4d3`.
- Memory notes name flags and files that may have moved; verify a file exists before recommending it.

## 12. Glossary

- **Spine / block / band / seat**: a page's fixed block order; a block is one archetype; two blocks paired at a split make a band; a seat is a block's place, drawn plain (awaiting a candidate's click) or blocked (a stated line).
- **Archetype**: one of the seventeen catalogued forms (`rules/FORM-CATALOG.md`) plus `BlockedSeat`; **candidate**: a form awaiting his click (1 fact card with focal, 2 placement line, 3 derived ratio, 4 ring, 5 donut).
- **Loud moment / accent**: a figure in `--terra-text`; three at most per page; declared in `LOUD_SEATS`.
- **Floor / BLOCK FLOOR**: the count of blocks a page type must draw (`FLOOR_BY_SURFACE`); a blocked seat counts.
- **Ratchet / baseline**: a per-page count that may fall and never rise; a reseed needs the rows and the reason.
- **Plant**: break a rule on purpose, watch the gate go red, restore.
- **Chain**: the 155 prebuild gates; **subset**: `--only=`; **the runner**: `prebuild_all.ts`.
- **Census**: `PAGES.md`'s generated block of sections and the loud ledger; **CENSUS.md** the same in the website docs.
- **Own-row law**: a slate row is withheld when its revenue is filled, shared to the cent, floored, or missing.
- **moneyShown / trusted local cell / the London entry**: the trade page's money gate; the five-plus-one guard in `trust.ts`; the curated London file's economics for 21 trades, bound to London's geo.
- **Door / lands / answers**: an anchor that leaves the page; its promise; a masthead's declared answer.
- **The loop / the controller / a dispatch**: the build process; the session that dispatches and records; one subagent's task with a brief per `TEMPLATE.md`.
- **His click / his word**: a founder decision on a form; his permission to push, build or deploy.
- **Sample marks**: the visible "modelled" marks, hidden by his 2026-09-11 switch while he is the only reader.
- **checkup**: the audit skill; its kinds: change, proposal, owner decision.

## 13. Successor verification checklist

You are oriented when you can answer these from the dossier and the files it names:

1. What is the HEAD of each repo (run git), which commit production serves, and which commits are unpushed?
2. What are the two reasons the launch checklist is NOT READY, and which queue rows close the first one?
3. Why is the chain "green on Vercel but unproven here", and what must the machine have before `verify:deploy` runs?
4. What does the trust gate's sixth guard refuse, what does `moneyShown` refuse, and how many slate cells show money?
5. Which four answers are his, and which one should not wait a fortnight?
6. Name three dead ends from section 6 and what to do instead.
7. What is the rule about pushes, builds and deploys, and how do you read a deploy's status on this machine?
8. Where is the checkup, what were its first three actions, and which of its findings are owner decisions?

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com (the website repo E:/atlas/website on main; the parent design
and data repo E:/atlas on p4-seam; two repos, every shell command carries its own cd)
Working directory: E:/atlas/website
Handoff dossier (read this FIRST, in full):
E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-19-dossier.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier's section 7 explains why each matters):
   E:/atlas/website/docs/handoff/HANDOFF-marginatlas-2026-09-19.md
   E:/atlas/design/loop/build/STATE.md
   E:/atlas/design/loop/build/CHECKUP-2026-09-19.md
   E:/atlas/design/loop/build/QUEUE.md (the launch:* rows and every row dated 2026-09-19)
   E:/atlas/website/CLAUDE.md
   E:/atlas/website/docs/verification-protocol.md
   E:/atlas/design/loop/build/DOCTRINE.md (sections 6a, 13 and 16)
   E:/atlas/website/scratchpad/launch/checklist.txt
3. Do not edit anything, run anything destructive, push, build or deploy, or make decisions
   until steps 1 and 2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the end of
   the dossier in 5 to 10 lines: the mission, the current state, the committed next step,
   and the top thing you must NOT do. Keep it tight; this is a checkpoint, not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files: the
   dossier is a point-in-time snapshot and the code, the ledgers and production are ground
   truth (run `git log --oneline -3` in both repos and `git status` before you answer).
6. Then stop and wait for my go. Nothing in the dossier is pre-authorised beyond reading;
   the first committed step, `npm run verify:deploy` on a machine with 1,100 MB free, starts
   only when I say so.

Honor the operator preferences and guardrails in the dossier's section 9 as if they were
given to you directly: no push, build or deploy without my word; no plausible numbers; no
em-dashes; never raise a baseline; every command with its own cd; every verification to a
file and read. If anything in the dossier is unclear, ask before acting, but only after
you have read everything above.
```
