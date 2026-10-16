# HANDOFF: marginatlas.com, four fronts in parallel and the new server (2026-10-15)

Production is `main` c35e42a7 (the truth fixes, live since 2026-10-12). Four design fronts are built or in flight on work branches:
the homepage and the cost simulator are finished and reviewed, the country page is two thirds built, and the rhythm reform
("air inside") is mid-plan at Task 3. The owner just ordered a netcup RS 4000 server and is waiting for netcup to approve it.
Nothing new has been merged to main or deployed.

> **How to use this document.** Read it top to bottom once. Then read the files in section 7 in the given order. Do not start work
> until you can answer the checklist in section 13. The ready-to-paste re-hydration prompt is section 14.

---

## 1. TL;DR (read this first)

Margin Atlas (marginatlas.com, repo `E:\atlas\website`, GitHub `benetbani/marginatlas-web`, PUBLIC) is "the reference atlas of
small-business earnings": country, city, trade and neighbourhood pages built from data, with a paid layer (billing and paywall) that is
built and switched off. Since 2026-10-12 the owner has asked for four design projects. They now run in parallel on separate branches:

- **rhythm** (more space inside sections, 14px reader text, each fact once, bare opener icons): `rhythm-air-inside`, Tasks 0 to 2C done
  and reviewed, Task 3 (the type floor) in flight and **uncommitted in the main checkout**.
- **homepage** (quiet editorial): `home-quiet-editorial`, all tasks built, reviewed by Opus, fix round done.
- **cost simulator** (/calculator rebuilt, free): `cost-simulator`, all tasks built, reviewed by Opus, fix round done.
- **country page** (16 slots in 7 stages): `country-journey`, Tasks 0 to 4 done, Tasks 5 to 8 left.

A GitHub check server (`.github/workflows/checks.yml`) runs the gate chain and the full typecheck on every work-branch push. The owner
chose a netcup RS 4000 G12.5 (12 dedicated cores, 32 GB, 512 GB, about EUR 75/month) so agents and checks stop queuing on his 8 GB
laptop; he ordered it on 2026-10-15 and is waiting for approval.

**The single most important thing:** the owner wants speed and short answers. Reply in under 100 words, plain words, tell him exactly
what to do, and never push main or deploy without his explicit word in chat for that action.

**Recommended next action:** check whether Task 3's work got committed (section 8, thread A), then keep the fronts moving; when the
owner sends the server's IP, run the setup in section 8, thread F.

---

## 2. Mission & success criteria

**The enduring goal (his words over time):** a professional, trustworthy reference site for small-business economics that "looks
already established", reads phone first, is programmatic and replicable for any country ("if the same page is done for Cambodia, would
you fill it roughly the same?"), and earns money through the Pro layer once he switches it on. Standing mandate: "push forward with the
project heavily, efficiently", "stop questioning, push forward".

**The current tactic (2026-10-12 to now):** four design projects, then integrate and ship:
1. Rhythm, his choice "Air inside only" (spec `E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md`).
2. Homepage, his critique: "The homepage talks about London and fails all the premises of what a homepage should include... Homepage is
   a total mess"; "It fails on establishing brand, not elegant and slaps infographics". Decided: quiet editorial, positioning line "The
   reference atlas of small-business earnings." above his h1 with moving parts, one solid terracotta band (#c11c00).
3. Country page, his /gb phone critique of 2026-10-13 (stacking, alignment, good/bad cues, replicability, digestible, "You cannot slap
   legislative changes at the top", one answer type per section, opener icons "bigger and superior with no background", "remember
   vertically first"). Decided: journey order with depth behind "more"; a green-to-red triangle signal, the one named palette exception,
   middle colour dark yellow.
4. Cost simulator, his ask: "a business costs simulator where the user picks country, city, number of employees, rent... and we
   calculate his costs, and breakeven revenue for profit. Super detailed and chic." Decided: rebuild /calculator, free.
5. Later, not started: the London trade picker ("One trade band"), the buyer and acquisition layer (needs data downloads, his word).

**Done for this phase means:** all four branches integrated, the whole chain green on the reference machine (browser gates included),
the build green, the built pages seen, then his deploy word, a deploy watch and a production probe.

**Hard constraints (his, verbatim):** "Never: push, deploy, merge into main, force-push, --no-verify; change Stripe, Supabase, Vercel or
DNS settings; apply a migration to the live database; print or copy any .env value; install or download anything (npm, pip, data files);
send an email or post anywhere; rename a URL; raise a ratchet baseline; pipe a verification into a filter; run two browsers or a browser
beside the chain; close my apps for memory (wait and check again). Never invent a figure, testimonial, review, logo or credential." Since
2026-10-14 work branches MAY be pushed (his "Yes, branches only"); main and deploys still need his word, per action.

---

## 3. Current state: ground truth

| Component | Status | Where | Notes |
|---|---|---|---|
| Production | LIVE, unchanged since 2026-10-12 | `origin/main` c35e42a7 | the truth-fixes batch; wire-checked 27/27 then |
| Rhythm plan | Tasks 0, 1A, 1B, 1C, 1D, 2A, 2B, 2C done and reviewed; **Task 3 in flight, uncommitted** | branch `rhythm-air-inside` e98c1f70 (pushed); main checkout `E:\atlas\website` | 30 commits ahead of main; Task 3's edits sit modified in the working tree (70 files at handoff time); its report says page laws and harness-archetypes pass after two copy shortenings; no Task 3 commit yet |
| Rhythm Tasks 4 to 8 | not started | briefs `.superpowers/sdd/2026-10-12-rhythm-air-inside/task-{4..8}-brief.md` plus controller notes `task-{3..7}-notes.md` | notes win over briefs |
| Homepage | built, Opus-reviewed, fix round 1 done | `origin/home-quiet-editorial` 6aa71ea1; worktree `E:\atlas\website\.claude\worktrees\agent-aa9c8b0b72dd1c19e` | report `docs/superpowers/reports/2026-10-14-home-quiet-editorial-report.md` on the branch; review `.superpowers/sdd/home-quiet-editorial-final-review.md` |
| Cost simulator | built, Opus-reviewed, fix round 1 done | `origin/cost-simulator` e5839b07; worktree `...\agent-abe3dca34b6b380b0` | report `docs/superpowers/reports/2026-10-14-cost-simulator-report.md`; review `.superpowers/sdd/cost-simulator-final-review.md` |
| Country page | Tasks 0 to 4 done (model, gates, signal, pieces, stages 1 to 7, composition); **Tasks 5 to 8 left** | `origin/country-journey` fe34a6ce; worktree `...\agent-aa506b3a9ca1653cc` | report `docs/superpowers/reports/2026-10-14-country-page-journey-report.md` on the branch |
| GitHub check server | working for non-browser gates and tsc | `.github/workflows/checks.yml` on `parallel-base` 5e11c768 and merged into every front | runs show "failure" because of known reds (section 11); read `chain.txt`, not the badge |
| Supabase secrets on GitHub | NOT set (`gh secret list` empty) | GitHub repo settings | CI renders use a placeholder URL, so database-fed content falls back |
| Server | netcup RS 4000 G12.5 ordered 2026-10-15, **awaiting netcup approval** | owner's netcup account | SSH key ready at `C:\Users\benet\.ssh\id_ed25519` (section 10) |
| API credits | owner has 1,000 in API credits, plan already the highest | his Anthropic accounts | not yet switched (`/login` to the Console account); unverified |

**Agents at the moment of this handoff:** two subagents of the old session were still running: the Task 3 implementer (in the main
checkout) and the country builder (in its worktree). Subagents die with their session and **cannot be resumed from a new chat**. Read
git and the reports to see what landed; re-dispatch fresh agents with the brief plus the report for whatever is left.

---

## 4. How we got here: the decision trail

1. **2026-10-12, truth fixes deployed** on his "Deploy after the chain": main c35e42a7. Then his design goals (rhythm, buyers, a
   catalog homepage, the city trade picker). Answers: order "Rhythm, picker, home, buyers"; picker "One trade band"; rhythm "Air inside
   only"; execution "Subagent-driven".
2. **Rhythm plan Q1, Q2** (his answers, verbatim): to "how should the check spot a repeat?" he chose "Equal figure, no stamp, counts
   (Recommended)"; to "how should 'each fact once' treat these [figures a standing law prints twice]?" he chose "Named exception
   (Recommended)". Q3 (fact rows 16, the share and donut ruled rows keep 12) was the controller's literal reading, not his answer.
3. **2026-10-13, homepage moved ahead** ("Homepage now", "Quiet editorial", band "One solid statement", line "The reference atlas…",
   colour "Deep terracotta #c11c00"). Spec and 15-task plan written.
4. **2026-10-13, /gb phone critique.** Signal: "Green to red, only in the signal" (one named palette exception), middle "Dark yellow";
   structure "Journey order, depth behind 'more'"; simulator "Rebuild /calculator, free". Country spec and 21-task plan, simulator spec
   and 12-task plan, each "Approved, subagent-driven".
5. **2026-10-13, rhythm Task 2C added by the controller.** The positional line rule became a gate (CLAUDE.md rule 4: a ratified rule
   becomes a gate) after the spacing pin stayed green through a 24|16 defect. Built, reviewed, fixed: `line-rule` gate, 68 fixtures.
6. **2026-10-14, the progress-review skill** (`C:\Users\benet\.claude\skills\progress-review\`) was written at his request and run. He
   answered: no web analytics now ("the site is still unfinished"), "you are giving me details that I don't need, and giving me a very
   long response", laptop 8 GB, plan already highest, 1,000 API credits he "can spare without thinking", "I want to use way more compute
   at the same time".
7. **2026-10-14, "Yes, branches only"**: push work branches (never main, never deploy) so cloud agents and a GitHub check server run in
   parallel. Built `parallel-base` (the CI workflow; `ATLAS_BROWSER_GATES=1` lets browser gates run where a browser exists; the three
   October-13 plans copied into the repo). Three builders dispatched with `isolation: "remote"`; they silently ran as local worktrees.
8. **2026-10-14, four agents hit the plan's session limit in about an hour** (reset 6:10am Tirane) and free memory fell to 36 MB. All
   resumed. Lesson: the plan's usage cap and the 8 GB laptop are the bottlenecks, not money.
9. **2026-10-15, the server hunt** (his words: "I want something that I can pay money and fuck off, can take the workload"):
   OVH VPS-4 (24 GB) was sold out and VPS-1 is 4 GB in Canada; Hetzner CCX33 is $163.59/month for 8 vCPU (about 4 real cores); Hetzner's
   MC/MA line is managed (no root). **netcup RS 4000 G12.5** (12 dedicated EPYC 9645 cores, 32 GB, 512 GB NVMe, EUR 75.21/month, 1-month
   contract, 30-day money-back, -13% at 12 months) won; he ordered it and waits for approval.

---

## 5. Hard-won truths & mental model

- **The owner.** Benet Bani, founder, not technical ("I'm like a baby that I need help for all of these things"). Wants results, speed,
  honesty, and answers under 100 words that tell him exactly what to click. Ask him only for a push to main, a deploy, a switch, a
  purchase or a download; batch questions with AskUserQuestion and a recommended first option.
- **The gate chain is the definition of correct.** `scripts/prebuild_all.ts` (289 gates on the rhythm branch, a generated count:
  never type it, run `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write`). It runs on every Vercel deploy, but Vercel skips
  browser gates, so browser gates are authoritative only on the reference machine (the laptop today, the server soon).
- **Browser gates vs fonts.** The laptop has neither Geist nor Space Grotesk installed (checked 2026-10-15), so its renders draw a
  stand-in font; GitHub's runner with the real fonts still reds FIGURE FACE on every page. Unexplained: read
  `scripts/harness/check_model_laws.mjs` FIGURE FACE (around :915-975) before trusting either machine's text measurements.
- **Subagent-driven development (SDD).** Per task: brief, implementer, reviewer, fix rounds, ledger lines in
  `.superpowers/sdd/<plan>/progress.md` ("Ruling: what - why - cost if wrong"). Whole branches get a final Opus review.
- **The kit's shared pieces** (`src/components/spine/kit.tsx`): Rail (opener, `mb-6`), Focal (figure plus its words 8 under), Basis
  (`src/components/spine/basis.tsx`, a line under rows or a drawing, 24 above), FactRows (16 above and below), FocalWords (Task 2C).
  The line rule: a line directly under a figure and over its rows or drawing is the figure's own words, 8 under it, the next group 24
  below; a basis stands 24 under the group above; a foot or detail panel stands 12 under a line (DISTANCES 2.1).
- **A gate never passes having read nothing** (standing ruling): every new gate reds on an empty scan set, a missing render, or a
  surface with no page in `scripts/harness/pages.json`.
- **Capacity truth.** Compute is cheap; AI usage and the 8 GB laptop are the limits. Four parallel agents exhausted the plan in about an
  hour. API credits remove the cap (pay per token; Opus 5.5 $4/$20 per million in/out, Sonnet 5.5 $2/$10, cached reads $0.20).
- **Claude Code cloud sessions** (claude.ai/code, the Claude app's Code tab, Desktop "Cloud") run on Anthropic's machines, included in
  his plan, but share the plan's usage cap and cannot run on API credits; they need everything they read on GitHub (the design repo
  `E:\atlas` is not on GitHub).

---

## 6. Dead ends: do NOT retry

| Tried | Result | Why it is dead |
|---|---|---|
| Agent tool `isolation: "remote"` | ran as local worktrees under `.claude/worktrees/` | not available to this account; agents still used laptop memory |
| OVH VPS-4 (24 GB) | sold out; only VPS-1 (4 GB, Canada) orderable | too small, too far |
| Hetzner Cloud CCX33 | $163.59/month for 8 vCPU (~4 real cores) | twice netcup's price for less |
| Hetzner MC30/MC60/MA80 | managed servers, setup fee, no root | cannot install agents or video tools |
| Installing Geist and Space Grotesk on the CI runner | FIGURE FACE still reds on every page | cause not found; do not keep patching the workflow blind |
| A Supabase placeholder URL on CI | renders work; database-fed content falls back | provenance, home-answers and harness-links differ from the laptop until the two secrets are set |
| Web analytics now | he declined | "the site is still unfinished"; keep the site on the web anyway |
| Four agents at once on the laptop | session limit in ~1h, 36 MB free | throttle locally or move to the server and API credits |
| Parallel prebuild on the laptop | spurious Chromium failures, slower | always `--concurrency=1` locally |
| Long answers to the owner | he objected twice | under 100 words |

---

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | this file | the snapshot | first |
| 2 | `E:\atlas\website\CLAUDE.md` | project rules, gates, method (four working rules), hard constraints | must |
| 3 | `E:\atlas\website\docs\verification-protocol.md` | the definition of done before anything reaches the owner | must |
| 4 | `C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md` (and its starred files) | the binding memory: his rulings since June | must |
| 5 | `C:\Users\benet\.claude\projects\E--atlas-website\memory\MEMORY.md`, `feedback-2026-10-14-go-parallel.md`, `feedback-2026-10-13-strategic-page-design.md`, `project-2026-10-12-design-goals.md` | this account's newer memories | must |
| 6 | `E:\atlas\website\.superpowers\sdd\progress.md` (last ~60 lines) | the main ledger: rulings and results across all fronts | must |
| 7 | `E:\atlas\website\.superpowers\sdd\2026-10-12-rhythm-air-inside\progress.md` (last ~40 lines), `global-constraints.md`, `task-3-brief.md`, `task-3-notes.md`, `task-3-report.md` | the rhythm plan in flight | must |
| 8 | `E:\atlas\docs\superpowers\plans\2026-10-12-rhythm-air-inside.md` and its spec | the rhythm plan (13 tasks plus 2C) | as needed |
| 9 | `git show origin/country-journey:docs/superpowers/reports/2026-10-14-country-page-journey-report.md` and the plan `docs/superpowers/plans/2026-10-13-country-page-journey.md` (on the branch; rulings Q1-Q6 at its line ~70) | the country front | must |
| 10 | `.superpowers/sdd/home-quiet-editorial-final-review.md`, `.superpowers/sdd/cost-simulator-final-review.md`, and each branch's report | the two finished fronts | must |
| 11 | `.github/workflows/checks.yml` (on `parallel-base`), `scripts/lib/local_only.mjs` | the check server | should |
| 12 | `E:\atlas\design\loop\build\STATE.md` (`step-in-flight`), `E:\atlas\design\loop\build\QUEUE.md` | state of record; the open rows (154 done, 70 TODO, 19 his/owner) | should |
| 13 | `E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-10-11.md` | the prior handoff (launch switches, paywall, account move) | optional |
| 14 | `E:\atlas\website\docs\superpowers\plans\2026-10-05-masterplan\LAUNCH-SWITCHES.md` | his 13 launch-day steps (all his) | optional |

---

## 8. Open threads & next steps

**A. Rhythm Task 3 (the type floor): finish and commit.** *Committed next step.*
- Check `git -C E:/atlas/website status --short` and `git log --oneline -3`. If Task 3's edits are still uncommitted and no agent is
  working, dispatch a fresh Sonnet implementer with `task-3-brief.md`, `task-3-notes.md` and `task-3-report.md` ("continue from the
  report; commit as Step 9 says, in two commits").
- Verify: `type-floor` PASS on every spine render, the plain-copy law still reads lifted lines, harness-archetypes and line-rule PASS,
  whole-project tsc 0. Then a task review (Sonnet), fix rounds, ledger lines.
- Once Task 3 is committed and no agent works in the main checkout: commit this dossier (untracked at
  `docs/handoff/HANDOFF-marginatlas-2026-10-15.md`), add it as CURRENT to CLAUDE.md's "Latest handoff" list and to
  `docs/handoff/INDEX.md`, and push the work branch.

**B. Rhythm Tasks 4 to 8, then its final review.** Each with its brief plus the controller's notes file (Tasks 4 to 7). Task 4: his Q1
and Q2 answers apply (named exceptions in `scripts/harness/fact_once_allow.json`, each naming its law). Task 5: his 2026-10-13 icon rule
(bare 32px terracotta glyph in a `32px 1fr` grid, no tile; nothing inside a section repeats the opener's glyph; inner glyphs grey).
Task 6: lock-preserving re-splits only; **the country rebuild replaces /gb's zones, so after the country merge, Task 6 likely shrinks to
the non-country surfaces**; decide at integration. Task 7: written rules; the controller appends his verbatim Q1 and Q2 answers and his
2026-10-13 icon words to `E:/atlas/rules/FOUNDER-VERDICTS.md`. Task 8: verification. Then an Opus whole-branch review.

**C. Country page Tasks 5 to 8.** Check `git log origin/parallel-base..origin/country-journey` and the report. Remaining: 5 (locks follow
the slots), 6 (what the fold replaced leaves, with its tests), 7 (written rules: parent-repo text goes in the report for the controller),
8 (verification: /gb, /kh, /af, /de at 375 first). If the old builder is gone, dispatch a fresh Opus builder in the existing worktree
with the plan and the report. Then an Opus whole-branch review and a fix round, as for the other two.

**D. Integration and ship** (after A to C).
1. Make an integration branch from `rhythm-air-inside`; merge `home-quiet-editorial`, `cost-simulator`, `country-journey`.
2. Known conflicts: `docs/loop/CENSUS.md` (regenerate: `npm run census -- --write`), `scripts/gates.json` and the CLAUDE.md counts block
   (`counts.ts --write`), home tests (`tests/home/archive.test.ts`, `tests/spine/home_forms.test.ts`; keep home's deletions of
   `CityRows.tsx` and `tests/home/foot.test.ts`), `country-view.tsx` (country's rebuild wins over rhythm's /gb edits), and rhythm Task 5's
   update to `home_forms.test.ts:64`.
3. Extend fact-once, type-floor and line-rule scan sets to /calculator (the spec says the rhythm rules hold there).
4. The simulator still lacks the country plan's signal on the margin and the share above break-even: wire it after the merge.
5. Apply the parent-repo edits each report lists (MODEL.md, DISTANCES.md, GUIDELINES text) in `E:\atlas` (branch `p4-seam`).
6. Whole chain on the reference machine (`--concurrency=1`, browser gates), the Next build, `next start` and photographs at 375, 768 and
   1280. Then ask his deploy word (AskUserQuestion). After it: merge to main, push, `MSYS_NO_PATHCONV=1 npm run deploy:watch -- --marker=...`,
   production probe (`curl --ssl-no-revoke` with a browser UA).

**E. Owner decisions to collect** (one AskUserQuestion batch, recommended option first, when the work reaches them):
- the server's IP when netcup approves (thread F);
- switch Claude Code to the API account (`/login` → Console) so agents use his credits, not the plan cap;
- add GitHub secrets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (he copies them from Vercel; public values);
- homepage: the band's sentence wording, and the three reds on the first screen (wordmark #e62200, positioning mark #c11c00, h1 words
  #991600);
- the simulator's default for Manchester barbershops reads a -20.8% margin (break-even GBP 154,157 against register mean sales GBP
  122,357): accept as data, or change the default team;
- the deploy word for the integrated release.

**F. Server setup (when he sends the netcup IP).** He types his own logins; you never handle passwords or .env values.
1. `ssh -i ~/.ssh/id_ed25519 root@<IP>` from Git Bash. If netcup did not install the key or Ubuntu 24.04, guide him in netcup's Server
   Control Panel to (re)install Ubuntu 24.04 with this public key (section 10). Never ask him for the root password.
2. Create user `atlas` with sudo and the same key; key-only SSH; ufw allowing 22; unattended upgrades.
3. Install git, build-essential, tmux, Node 22, the GitHub CLI, Claude Code, Python 3 with venv, ffmpeg, Playwright Chromium with
   `--with-deps`, Geist and Space Grotesk. (Installing on his server is part of what he bought; the no-install rule is about his laptop.)
4. Clone `benetbani/marginatlas-web` to `/srv/atlas/website`, `npm ci`. Copy `E:\atlas\design` (272 MB) and the needed parent docs from
   the laptop with `tar | ssh` (never to GitHub: private rulings). The gates read `E:/atlas/design/...` as a relative path on Linux, so
   create `/srv/atlas/website/E:` linking to `/srv/atlas` and add `E:` to `.git/info/exclude`.
5. Ask him to type, on the server: `claude` then `/login` (his API account), and `gh auth login` (device code). If renders need
   Supabase values, he copies `.env.local` himself with one `scp` command you give him.
6. Run the full chain there with browser gates; compare with the laptop. Where the server reads more reds, fix pages, never raise a
   baseline; a baseline that differs only by machine needs his ruling.
7. Operating model: one tmux window per front, each a headless Claude Code run in its own worktree; you (in the desktop app on the
   laptop) start, watch and review them over SSH; branches go to GitHub; he steers from his phone. HyperFrames video work and the
   Exa/Firecrawl and Polymarket research he plans can run there too.

**Someday (not now):** the London trade picker spec, the buyer layer (downloads need his word), the launch switches (all his), the
QUEUE's open rows, the buy-or-start page's **153 valuation multiples typed in code with no source**
(`src/lib/open/buy_vs_start.ts`, `SDE_MULTIPLE_BY_SLUG` about :100-281, live at `/gb/london/restaurants/buy-or-start`): the old session told him on 2026-10-12 it would go in the
queue and only queued it at handoff (`open:buy-or-start-typed-multiples`, E:/atlas 8f67517). It is live and breaks "never invent a
figure": schedule it right after the integration.

---

## 9. Constraints, guardrails & operator preferences

- **Replies:** under 100 words, plain, step by step, no technical detail he did not ask for; start with what he should do; one
  recommendation, not a survey. He uses the phone too: SendUserFile for files he should see.
- **Permissions:** push work branches freely; main, deploys, Stripe, Supabase, Vercel, DNS, migrations, emails, posts, purchases and
  downloads need his word per action. Never print or copy .env values. Never raise a ratchet baseline (lowering to a measured value in
  the same commit is fine). Never `--no-verify`. Never invent a figure.
- **Copy rules (site text):** four-word headings, twelve words a line, no semicolon, no em-dash, never "modelled", "withheld" or "on
  file", no source-agency names, no "we". **Palette:** terracotta and neutral greys; the green-to-red signal only inside its component.
- **Method (CLAUDE.md):** read the module behind a number before acting on it; state an instrument's blind spot; one change, one
  verification; a ratified rule becomes a gate in the same session. Never pipe a verification into a filter (redirect to a file, read
  it). Comment detection through `scripts/lib/strip_comments`. Skip directories by path, never by bare name.
- **Laptop discipline while it is still the reference machine:** wait for 800 MB free before a render, browser or chain run
  (`bash scratchpad/rhythm/_run_when_free.sh <outfile> <command>`), one browser at a time, never close his apps. Full tsc needs about
  1,150 MB free (`node --max-old-space-size=4096 node_modules/typescript/bin/tsc --noEmit -p .`), else a scoped config.
- **Commits:** end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Memory:** binding project memory lives in `C:\Users\benet\.claude\projects\E--atlas\memory\`; write new project memories there and
  index them; this account's folder `E--atlas-website` also loads.

---

## 10. Environment & reproduction

- **Repos:** website `E:\atlas\website` (git, GitHub public `benetbani/marginatlas-web`); design and data `E:\atlas` (git, branch
  `p4-seam`, **no remote**, about 130 GB: raw data and archives stay home; only `design/` and some docs are needed elsewhere).
- **Worktrees:** `E:\atlas\website-par` (`parallel-base`), the three agent worktrees under `E:\atlas\website\.claude\worktrees\`, plus
  older ones (`git worktree list`). node_modules in a new worktree is a junction to the main one; remove junctions link-only with
  `[System.IO.Directory]::Delete(path,$false)`, never recursively.
- **Key commands:** gates by name `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=<names>`;
  renders `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require
  ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx <surface> <slugs>`; photographs `node scripts/harness/shoot_page.mjs
  <render> <#id> <out> 1280,768,375`; CI result `gh run list --branch <b> --limit 1`, then
  `gh run download <id> -R benetbani/marginatlas-web -n check-outputs -D <dir>` and read `chain.txt` and `tsc.txt`.
- **Server key:** `C:\Users\benet\.ssh\id_ed25519` (no passphrase, made 2026-10-15 for the server). Public half:
  `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIH1jnlrtOqQXbSsGt7KQtbs8ZkMtTh/AzsKrNlxCGxHe atlas-server`
- **Secrets:** in `.env.local` (laptop) and Vercel; never printed. GitHub has none set.

---

## 11. Landmines & gotchas

- `src/components/spine/country/country-view.tsx` and `city/city-view.tsx` are git `-text`: byte-level edits only, endings kept.
- The main checkout is the rhythm implementer's workspace: never commit there while an agent works in it (a shared index would sweep its
  staged files into your commit). Commit side work from another worktree.
- GitHub runs report "failure" today. Known reds: by design on rhythm until Tasks 3, 4 and 6 (type-floor, fact-once, art-direction);
  CI-only (FIGURE FACE, provenance, home-answers, harness-links, page-laws text metrics, harness-archetypes and money-shown-own-rows
  timeouts). Locally only: `home-archive` (`tests/home/archive.test.ts` re-reads `E:/atlas/archive/uk/ARCHIVE.json`, which the
  pipeline updated on 2026-10-12 after the slice `data/home/archive.json` was cut; the test still exists on the home branch too, a
  build server defers it; the fix is re-exporting the slice from the local archive, a controller decision before the deploy).
- tsx injects `__name` into compiled functions, so a function serialized into a page breaks: tests read a lib's source from disk.
- A JSX comment cannot sit inside a ternary branch; put it above the `{cond ? (` line.
- Subagents die with their session; usage limits stop agents mid-task (they resume by message within the same session only).
- `cd` into an agent worktree switches the session's primary directory; use `git -C <path>` instead.
- Merge commits 1ed87394, 9af8a1a4, 95f556da carry git's default message without the attribution line: accepted, do not rewrite pushed
  history.
- Firecrawl credits are low; WebSearch and WebFetch work.
- Git Bash needs `MSYS_NO_PATHCONV=1` for `deploy:watch`; production probes need `curl --ssl-no-revoke` and a browser user agent.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| his word | the owner's explicit yes in chat, per action |
| the chain | the prebuild gate chain, `scripts/prebuild_all.ts` |
| spine pages | the country, city, cell (trade in a place), industry and hood pages the harness renders from `scripts/harness/pages.json` |
| zone, level, split | a full-width band of a page; its sections side by side; the column ratio (`wide`, `1-1`, `2-1`...); D3 forbids a split repeating the one before |
| slot, stage | the country plan's 16 fixed sections in 7 journey stages |
| Rail, Focal, Basis, FactRows | the kit's opener, figure block, basis line and fact rows |
| the line rule | Task 2C's gate on the 8, 24 and 12 distances around a figure's line and a basis |
| the type floor | reader text 14px or more; 12px only for chart ticks and the foot's source line |
| fact-once | one figure, one provenance, printed once per page; named exceptions allowed by his Q2 answer |
| SDD, controller, ledger, ruling | subagent-driven development; the session that dispatches and decides; `progress.md`; a decision recorded as "what - why - cost if wrong" |
| parallel-base | the branch holding the CI workflow and the copied plans, base of the three fronts |
| reference machine | where browser gates are authoritative (the laptop now, the server next) |

---

## 13. Successor verification checklist

You are oriented when you can answer these:
1. What are the four fronts, their branches and heads, and which one has uncommitted work in the main checkout?
2. What may you push without asking, and what needs the owner's word, per action?
3. Why does every GitHub check run say "failure", and how do you read what actually failed?
4. What did the owner order on 2026-10-15, what is it waiting for, and what are the first three steps when he sends the IP?
5. What are his Q1 and Q2 answers for "each fact once", and his 2026-10-13 rule for section icons?
6. Which conflicts do you expect when the four branches are integrated, and which side wins in `country-view.tsx`?
7. How long may a reply to him be, and which live data-honesty fault was promised to the queue on 2026-10-12 and only queued at handoff?

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: marginatlas.com (Margin Atlas), four design fronts in parallel and a new server
Working directory: E:\atlas\website
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-10-15.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   - E:\atlas\website\CLAUDE.md
   - E:\atlas\website\docs\verification-protocol.md
   - C:\Users\benet\.claude\projects\E--atlas\memory\MEMORY.md and the files it marks with stars
   - C:\Users\benet\.claude\projects\E--atlas-website\memory\MEMORY.md and feedback-2026-10-14-go-parallel.md
   - E:\atlas\website\.superpowers\sdd\progress.md (last ~60 lines)
   - E:\atlas\website\.superpowers\sdd\2026-10-12-rhythm-air-inside\progress.md (last ~40 lines),
     global-constraints.md, task-3-brief.md, task-3-notes.md, task-3-report.md
   - git show origin/country-journey:docs/superpowers/reports/2026-10-14-country-page-journey-report.md
   - E:\atlas\website\.superpowers\sdd\home-quiet-editorial-final-review.md and cost-simulator-final-review.md
   - E:\atlas\design\loop\build\STATE.md (step-in-flight)
3. Do not edit anything, run anything destructive, or make decisions until steps 1–2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5–10 lines: the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files:
   the dossier is a point-in-time snapshot and the code/data is ground truth
   (check git status, branch heads and the reports first).
6. Then stop and wait for my go, unless the dossier's "Open threads" marks a committed
   next step I've pre-authorized, in which case state what you're about to do and begin.
   (Thread A, finishing and committing rhythm Task 3, is pre-authorized; so is continuing
   the fronts on their work branches. Main, deploys and anything paid still need my word.)

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly: answer me in under 100 words. If anything in the dossier is unclear, ask
before acting, but only after you've read everything above.
```
