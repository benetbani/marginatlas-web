# Overnight Design Run , Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the ratified v2 design system from two live routes to as much of the site as one unattended night can carry, with the home page as the centrepiece, on a machine with 1.5GB of free memory.

**Architecture:** Every page is PORTED from an existing v2 dev route or the founder's `atlas.css` mockup, never invented. Work runs strictly sequentially, one process at a time, browser-free. Verification is the rendered page read as prose, plus the crash-aware gate runner. Nothing is deployed; the night ends with one approval list.

**Tech Stack:** Next.js 15.5 App Router, React 19.2, TypeScript 5, the `.av2` scoped stylesheet generated from `design/mockups/atlas.css`.

---

## 0. THE ONE PARAGRAPH THAT OUTRANKS THE REST

**This run is about the SKELETON and the LOOK, not the numbers.** The founder was explicit: factual accuracy is not tonight's job. A page with the right structure, the right spacing, the right flags and a `SampleTag` on an invented figure is a **success**. A page with perfect numbers and the previous generation's chrome is a **failure**. When a task could be done either faster with a fixture or slower with real research, **take the fixture, label it, and move on.**

The one thing that does not bend: **a fabricated figure may never reach a shipping route.** Fixtures live in `fixtures/`, render on `/dev` routes, and wear `SampleTag`. The gate `verify_no_fixture_in_routes` enforces it. That rule exists because the canonical repair made every page newly indexable, so the accident that used to protect an invented number is gone.

---

## Global Constraints

Copied verbatim from the authorities. Every task inherits all of them.

**Design authority**

- The founder designs; **the loop ports and proposes.** A week of AI-invented design was rejected outright in June. A new visual is a review artifact in `design/loop5/reviews/`, never a commit to a page.
- **`src/styles/atlas-spine.css` is GENERATED** from `design/mockups/atlas.css` by `node scripts/scope_atlas_css.mjs`. Never edit the generated file. A gate fails the build when the source moved and the copy did not.
- **Two surfaces only.** `--card` `rgba(255,255,255,.955)` for anything holding text, `--air` `rgba(255,255,255,.40)` for surfaces over the background image. A bordered box holding text is a card and must have a fill. Gate: `verify_two_surface_levels`.
- **Terracotta `#c23a22` is the only accent, and it marks the answer once per chapter.** Twice is no focal point.
- `--faint` `#8c8c94` is **NON-TEXT ONLY**. There is exactly one quiet text tone, `--muted` `#5f5f67`; quieter is carried by size and weight, never a second grey.
- **Icons are drawn, never unicode.** Five icon sizes are correct and considered: 18 section head, 13 inline glyph, 24 tile, 14 pricing tick, 16 footer social. Radius tokens only: `--r-lg` 10, `--r-md` 8, `--r-sm` 6, `--r-xs` 4.
- **Motion tokens:** `--t-fast` 90ms colour, `--t-move` 150ms transform, `--t-slow` 200ms width or rail. Nothing carrying data ever animates.
- **Spacing scale:** `2 4 6 8 10 12 14 16 18 20 22 26 32 40`. Gate: `verify_spacing_scale`, scoped to the React kit. **No new grandfathered entry may be added.**
- **Fonts:** Geist for text, Space Grotesk for figures, `tabular-nums` on every number, hard rule.
- **Stacking:** content auto, label clearing its chart 2, chapter rail and jump sheet 15, masthead 20. A new layer picks one of these and does not invent a number.
- **No eyebrow above a heading.** A crumb naming the subject ("Restaurants, London") is a breadcrumb and is fine. A crumb labelling the section below it is an eyebrow and is banned.
- **Tap targets 40px minimum.** A 16px glyph needs 12px of padding around it.

**The row, and the two defects it hides , READ THIS BEFORE WRITING ANY `.row`**

- **Every rule is scoped `.statblock .row`. There is no bare `.row` rule.** A row without a `.statblock` ancestor renders its spans fused: *"Londonmeasured16,765"*. It looks like ordinary prose. 125 of the city page's 129 rows were like this on a page delivered as complete.
- A run of rows belongs in `<div className="panel pad rise"><div className="statblock">`, **BOTH classes on ONE element**, because `.panel.pad > .statblock` is the rule that strips the inner border. `<div className="panel"><div className="pad">` does not match it.
- **Never fix this by adding a bare `.row` rule.** The stylesheet is the founder's design; the call site is the loop's, so the call site moves.
- **`--val-col` is a 78px figure column.** The figure goes in `.v`; the qualifier goes in `.nm > .s`. A longer string clips silently, mid-word, no ellipsis. 51 values were clipping.

**Copy rules, all gated**

- **No em dashes**, and not `--` either. Applies to source, including comments. En dashes in number ranges are fine.
- **No first person.** No "we", "us", "our", "I". Not in FAQ answers, not in an absence marker.
- **No source-agency names** anywhere a reader sees, including text that lives in `data/` and gets printed.
- **Banned vocabulary:** "turnover", "covers", "pp", "percentage points", "net margin".
- **No superlatives with no basis.** No "coming soon" , a missing figure states its absence, never a dash, a zero, or a vanished section.
- **A page is always complete; its shape never varies by place.**
- **Canonical phrasing for the keep metric: "what the owner keeps".**

**Repository rules**

- **Never rename a URL slug.** SEO equity rides on existing URLs.
- **Resolve links, never assemble them:** `countryPageTarget()`, `industryToSlug()`, `geoPageTarget()`. Greece is stored as `GR`, so every hand-built `/el` link was dead. `geoPageTarget` tries CITY first, which is wrong for a route serving REGIONS , check `kind`.
- **Never `git add -A` while a subagent has files in flight.** Stage explicit paths.
- **Never `git checkout -- <file>`.** Use `git stash`.

---

## 1. THE HARD RULES OF THIS RUN

### 1.1 The deploy line , the only rule with no exceptions

**The loop commits. The loop NEVER pushes.**

`main` is now the production branch and the local branch is identical to it, so **a push is a deploy**. Commit as often as you like; every commit is reversible and invisible. The night ends with an approval list and the founder pushes.

Also never, without an explicit instruction in a live message from the founder:

- `npm run build`, any deploy, any feature-flag flip
- Create an account, post to social, send email, submit to a third party
- Fabricate a figure on a shipping route, or put a fixture on a public URL
- Rename a URL slug

### 1.2 Memory discipline , this is why the last run lost half its tasks

The machine has **~1.5GB free of 8.5GB**. The previous run lost 28 of 50 tasks to memory, not to difficulty. These are not suggestions.

| Rule | Why |
|---|---|
| **`node scripts/loop/gate.mjs`, never `npm run prebuild`** | The parallel runner reported 18 failures when 0 gates failed. `gate.mjs` runs one at a time and tells CRASH apart from FAIL |
| **`--heap 1536`, not higher** | The four gates that would not run at all completed first try at 1536. The failures are the OS refusing a reservation, so asking for LESS is what helps. Raising the ceiling is the reflex and it is backwards here |
| **Never open a browser.** No Playwright, no `computer`, no screenshots | Next dev plus a second Chromium exceeds this box. It killed the last run six times |
| **ONE dev server, warmed one route at a time** | `preview_start` name `atlas-dev`, port 3210. Never `npm run dev` in Bash |
| **A 0-byte response means the server died** | Restart it. A grep over an empty file prints nothing and reads exactly like a pass. That produced a whole false finding once |
| **One subagent at a time. Never parallel** | Two agents writing files at once breaks staging and produces commits nobody can read |
| **`npx tsc --noEmit` with `NODE_OPTIONS=--max-old-space-size=4096`** | Typecheck is the one place a bigger heap genuinely helps |

### 1.3 Windows and shell landmines, all observed

- **`cd` alone does not change drive in cmd.** Use `cd /d E:\atlas\website`. In Bash, `cd /e/atlas/website`, and **CWD resets between calls** so prefix every command.
- **Never use python heredocs for text edits.** `\a` became a bell character in a committed file and `\b` became a literal backspace in a regex, silently disabling three of four patterns. Use `node -e` or the Edit tool.
- **`grep -c` returning 0 exits 1**, which breaks `&&` chains and silently skips the commit after it.
- **Git Bash rewrites arguments starting with `/`** into Windows paths. `/dev/industries2` became `C:/Program Files/Git/dev/industries2`. Quote them or use `curl` with a full URL.
- **`middleware` returns 403 to curl.** A curl 403 is not a broken link.
- **Git background GC fails on this box** (`fatal: failed to run repack`). The commit still succeeded.
- **`npm run prebuild:serial` is STALE.** It is a hand-written `&&` chain covering only 37 of 62 gates. Use `gate.mjs --all`.

### 1.4 The verification ladder , in this order, every task

1. `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit`
2. `node scripts/loop/gate.mjs <the gates this task can break> --heap 1536`
3. **`node scripts/loop/prose.mjs <route>` , read the output as prose.** This is the highest-yield check on the list. It found nine defects the 62 gates could not see. If a sentence is wrong, the page is wrong.
4. `node scripts/audit_row_layout.mjs` when the task touched `.row` or `.statblock`. Needs the dev server.
5. `node scripts/audit_generation_seam.mjs` when the task moved a route between generations.

**A claim without a command output behind it does not go in the journal.**

### 1.5 The flexibility doctrine , what to do when the plan meets reality

The plan is a priority order, not a contract. **A found defect outranks a planned page**, and that judgement is why the last run was reweighted toward audits mid-flight and was right to be.

Triage anything unexpected into exactly one of four buckets and act on it immediately:

| bucket | test | action |
|---|---|---|
| **BLOCKER** | The current task cannot proceed and cannot be worked around | Use `superpowers:systematic-debugging`. Do not guess. If still blocked after one honest attempt, write the block in the journal with the exact command and error, **skip to the next task**, and put it in the morning report |
| **LIVE DEFECT** | Something already shipped is wrong: a broken link, banned copy on a reader-facing page, an accessibility promise not kept, a wrong canonical | **Stop the current task and fix this first.** Then resume. Record both in the journal |
| **ADJACENT** | A real improvement, near the work, that nobody asked for | Do it only if it is under ~10 minutes AND it is inside the file you already have open. Otherwise write one line in `design/loop5/FOUND.md` and keep moving |
| **DESIGN QUESTION** | It needs the founder's eye: a new visual, a spacing change inside the ratified mockup, a type-scale move, anything the corpus does not already answer | **Never decide it.** Write it in `design/loop5/reviews/` with a before and after, and add it to the morning approval list |

**Skills to reach for:** `superpowers:systematic-debugging` for any bug or unexpected behaviour, `superpowers:test-driven-development` when adding a gate or a lib function, `superpowers:verification-before-completion` before writing any journal entry claiming `done`, `superpowers:subagent-driven-development` to run the tasks themselves.

**Skills to REFUSE, and this matters more than it looks:** `impeccable`, `frontend-design`, `ui-ux-pro-max`, `design`, `ui-styling`, `banner-design`. Every one of them will confidently invent a visual language. **That is precisely the failure the founder rejected in June.** The design already exists in `design/mockups/atlas.css` and in the v2 component kit. Porting is the job.

### 1.6 The journal , written as you go, never from memory

Append one block to `design/loop5/NIGHT-JOURNAL.md` **when each task ends, before starting the next.** A journal written at the end of the run is fiction.

```
## T<NN> <task name>
outcome: done | partial | blocked
files: <paths touched, or "read only">
verified: tsc <pass|fail> | gates <n PASS, n FAIL, n CRASH> | prose <read|not read> | seam <n shipping v2>
found: <one line. Anything surprising, wrong, or worth the founder's attention.>
```

`outcome` has three values and no others. `found: nothing` is valid and useful; it means someone looked. **Never write a screenshot path for an image that does not exist.**

---

## 2. FILE STRUCTURE

What this run creates and modifies, and what each is responsible for.

**Already built and proven tonight, use them:**

| Path | Responsibility |
|---|---|
| `scripts/loop/gate.mjs` | Sequential, crash-aware gate runner. Reads the gate list from `prebuild_all.ts` so it can never drift. Writes `data/loop/gates-latest.json` |
| `scripts/loop/prose.mjs` | Fetches a route, strips it to text, flags fused words, clipped values, leaked apparatus and banned copy. Exits non-zero on an empty body |

**Created by this run:**

| Path | Responsibility |
|---|---|
| `design/loop5/NIGHT-JOURNAL.md` | Per-task record, appended immediately |
| `design/loop5/FOUND.md` | One line per ADJACENT item not acted on |
| `design/loop5/reviews/` | Before/after artifacts for every DESIGN QUESTION |
| `design/loop5/MORNING.md` | The report and the single approval list |
| `src/app/dev/industry2/page.tsx` | The industry detail page, v2. Does not exist today |
| `src/app/dev/hood2/page.tsx` | The neighbourhood page, v2. Does not exist today |
| `src/lib/fixtures/` | Sample-tagged skeleton data for the two new page types |

**Modified by this run:**

| Path | Responsibility |
|---|---|
| `src/app/dev/home3/page.tsx` | The v2 home page. Finished against the approved eight-section spine |
| `src/components/spine2/page/CellPage.tsx` | Gains the `.av2` root and the v2 shell |
| `src/app/cities/[slug]/` , `src/app/[country]/` | The city and country promotions, moved out of `(site)` |

---

## SEGMENT A , BASE AND ORIENTATION

### Task A1: Establish the true starting state

**Files:** Read only, plus `design/loop5/NIGHT-JOURNAL.md`, `design/loop5/FOUND.md`

**Produces:** A measured baseline every later task compares against.

- [ ] **Step 1: Read the authorities.** In this order, and do not skip:
  `E:\atlas\website\DESIGN.md` (section 0.1 first), `E:\atlas\website\PRODUCT.md`, `E:\atlas\website\BRAND.md`, `E:\atlas\design\loop4\DECISIONS-2026-08-04.md`.

- [ ] **Step 2: Confirm both repositories are clean and on the right branch.**

```bash
cd /e/atlas/website && git status --porcelain && git rev-parse --abbrev-ref HEAD
cd /e/atlas && git status --porcelain && git rev-parse --abbrev-ref HEAD
```

Expected: no output from either `status`. Website on `main`, parent on `p4-seam`.
**If either is dirty, STOP and commit the stray work as housekeeping first**, so tonight's diff is legible. That exact situation occurred at the start of the last run.

- [ ] **Step 3: Run every gate, sequentially.**

```bash
cd /e/atlas/website && node scripts/loop/gate.mjs --all --heap 1536 --retries 4
```

Expected: `PASS 62, FAIL 0, CRASH 0`. Takes roughly 4 minutes.
**A FAIL is a real defect and it is now a LIVE DEFECT**, because `main` is production. Fix it before anything else in this plan.
A CRASH is the machine; re-run just that gate by name.

- [ ] **Step 4: Measure the launch metric.**

```bash
node scripts/audit_generation_seam.mjs 2>&1 | tail -8
```

Expected today: `2 shipping routes are v2 and nothing else`. Write the number down. **This number is the scoreboard for the whole night.**

- [ ] **Step 5: Create the journal scaffolding.**

```bash
mkdir -p /e/atlas/design/loop5/reviews
```

Write `design/loop5/NIGHT-JOURNAL.md` with the format block from section 1.6 at the top, and an opening entry recording: both HEADs, the gate result, and the seam count.

- [ ] **Step 6: Commit.**

```bash
cd /e/atlas && git add design/loop5 && git commit -m "loop5: open the run, baseline recorded"
```

---

### Task A2: Warm the dev server and prove the prose reader on a known-good page

**Files:** Read only.

**Interfaces:** Produces a running dev server on port 3210 that every later verification step depends on.

- [ ] **Step 1: Start the dev server.** Use the `preview_start` tool with name `atlas-dev`. **Never `npm run dev` in Bash.**

- [ ] **Step 2: Warm ONE route and read it.**

```bash
cd /e/atlas/website && node scripts/loop/prose.mjs /dev/home3 --chars 4000
```

Expected: HTTP 200, well over 800 characters of text, and prose that reads like a home page.

- [ ] **Step 3: Interpret the result honestly.**
  - Exit 2 or "DEAD" means the server is not up. Restart and warm again. **The first compile of a route on this box can take minutes**; that is not a failure.
  - Fused-word candidates are the `.row` defect. Note them; Task E1 owns the sweep.
  - Under 800 characters means the route does not exist. On `home3` that would be a genuine surprise and a BLOCKER.

- [ ] **Step 4: Journal it.** `T A2, outcome: done, verified: prose read.`

---

## SEGMENT B , THE HOME PAGE

**This is the centrepiece and it is why the run exists.** The founder asked for the home page to advance. Today the live home page renders inside `SpineShell` (generation two) while styling its content with `parchment` and `text-atlas-700` (generation three). Two palettes on one page, neither of them ratified. It also carries four named anti-references from `PRODUCT.md`: a superlative with no basis, a rotating headline, a hero video of a city skyline, and glassmorphism.

`/dev/home3` is the v2 replacement and it already carries `.av2`. **It is not finished.** Tonight it gets finished against the approved eight-section spine.

### Task B1: Audit `/dev/home3` against the approved spine, section by section

**Files:**
- Read: `src/app/dev/home3/page.tsx`, `E:\atlas\design\loop4\research\2026-08-03-homepage-warming.md`
- Create: `design/loop5/reviews/B1-home-spine-audit.md`

**Interfaces:** Produces a per-section verdict list that Tasks B2 and B3 consume.

- [ ] **Step 1: Read the approved spine.** `design/loop4/research/2026-08-03-homepage-warming.md` holds the eight sections and the reasoning. The founder ratified it: *"Home spine: Approved. Eight sections, build on it."*

- [ ] **Step 2: Read the current page as prose.**

```bash
cd /e/atlas/website && node scripts/loop/prose.mjs /dev/home3 --chars 8000
```

- [ ] **Step 3: Write the audit.** One row per approved section, with exactly one of four verdicts and evidence for it:

| verdict | means |
|---|---|
| `PRESENT` | Built, and it reads correctly |
| `THIN` | Built, but a section that prints a figure and moves on. **`BRAND.md` voice move 1: the figure carries a because.** A section without a reason attached has not finished |
| `WRONG` | Built and it violates a rule. Name the rule |
| `MISSING` | Not built |

- [ ] **Step 4: Commit the audit.**

```bash
cd /e/atlas && git add design/loop5/reviews/B1-home-spine-audit.md && git commit -m "loop5: home3 audited against the approved eight-section spine"
```

- [ ] **Step 5: Journal it**, with the count of each verdict in the `found:` line.

---

### Task B2: Build every MISSING section on `/dev/home3`

**Files:**
- Modify: `src/app/dev/home3/page.tsx`
- Reference: `src/components/spine2/*` for every primitive

**Interfaces:** Consumes the audit from B1.

- [ ] **Step 1: Take the MISSING sections in the spine's own order**, one at a time. Do not batch. Each section is its own edit, its own verification, and its own commit.

- [ ] **Step 2: Build the section from the EXISTING kit.** Every primitive you need already exists in `src/components/spine2/`. Read the neighbouring section in the same file and match it. **Do not import a new visual idea.** If the kit genuinely lacks a primitive, that is a DESIGN QUESTION: write it to `design/loop5/reviews/` and build the section with the nearest existing primitive.

- [ ] **Step 3: Obey the row rule.** Any run of rows goes inside:

```jsx
<div className="panel pad rise">   {/* BOTH classes, ONE element */}
  <div className="statblock">
    <div className="row">
      <span className="nm">Staff<span className="s">of every hundred</span></span>
      <span className="v">34</span>
    </div>
  </div>
</div>
```

The figure goes in `.v`. **The qualifier goes in `.s`, never in `.v`,** which is 78px and clips mid-word with no ellipsis.

- [ ] **Step 4: Data policy for this task.** Real figures where `front_page_figures` or the one reconciled cell already has them. Where it does not, **a labelled fixture with `SampleTag` is the correct answer and is not a compromise.** This is a dev route. The skeleton is the deliverable.

- [ ] **Step 5: Verify.**

```bash
cd /e/atlas/website && NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit
node scripts/loop/gate.mjs no-em-dashes no-source-agencies banned-vocabulary no-eyebrow no-bold-display two-surface-levels sample-tags bar-budget spacing-scale v2-scales --heap 1536
node scripts/loop/prose.mjs /dev/home3 --chars 8000
```

**Read the prose output.** A fused word means the row rule was broken. Banned copy means a rule was broken. Both are fixed now, not later.

- [ ] **Step 6: Commit this one section.**

```bash
git add src/app/dev/home3/page.tsx && git commit -m "home3: <the section>, <what it says and why it earns its place>"
```

- [ ] **Step 7: Journal, then return to Step 1** for the next MISSING section.

---

### Task B3: Repair every WRONG and THIN section

**Files:** Modify `src/app/dev/home3/page.tsx`

- [ ] **Step 1: WRONG first, THIN second.** A violated rule outranks a weak section.

- [ ] **Step 2: For each THIN section, apply voice move 1 , the figure carries a because.** The reference is already live on the home page and is the best sentence on the site:

> "Everyone blames the rent. Rent is the third biggest line." Staff takes 34 of every 100, rent takes 13.

A section that prints a figure and moves on has not finished. **The reason is what turns a statistic into a finding.**

- [ ] **Step 3: Check the accent budget.** Terracotta marks the answer **once per section**. If a section has two terracotta marks, one of them is not the answer. Fifty accents is no focal point.

- [ ] **Step 4: Verify with the full command block from Task B2 Step 5.**

- [ ] **Step 5: Commit per section, journal, repeat.**

---

### Task B4: The home page on a 390px viewport

**Files:** Modify `src/app/dev/home3/page.tsx`

**Note:** This is a real gap. The mobile reading has not been done on `home3` and mobile is a standing emphasis on this project.

- [ ] **Step 1: Read the page at mobile width.**

```bash
cd /e/atlas/website && node scripts/audit_overflow.mjs home --width 390 2>&1 | tail -30
```

- [ ] **Step 2: Fix every horizontal overflow.** A page that scrolls sideways on a phone is broken, not stylistically imperfect.

- [ ] **Step 3: Check the tap targets.** 40px minimum. A 16px glyph needs 12px of padding around it.

- [ ] **Step 4: Verify, commit, journal.**

---

## SEGMENT C , PROMOTE THE TWO FINISHED PAGE TYPES

**City and country are DONE.** `CityPage.tsx` and `CountryPage.tsx` both carry `.av2` and both render real data. They have been sitting on dev routes doing nothing for weeks. **Promoting them is the single highest-value move per hour in this plan**, because the work is already paid for.

**The mechanism is proven.** It was executed on `/world` and `/industries` on 2026-08-07 and it worked: move the route folder OUT of the `(site)` group, carry the metadata across verbatim, keep the URL. `(site)/layout.tsx` documents exactly this: *"A route group does not appear in the URL, so moving a folder in or out of `(site)` changes what wraps it and never changes its path."*

**Read `src/app/world/page.tsx` before starting.** Its header comment is the worked example.

### Task C1: Promote the city page to `/cities/[slug]`

**Files:**
- Create: `src/app/cities/[slug]/page.tsx`
- Delete: `src/app/(site)/cities/[slug]/page.tsx`
- Reference: `src/app/dev/city2/page.tsx`, `src/components/city2/page/CityPage.tsx`

- [ ] **Step 1: Map the child routes first.**

```bash
cd /e/atlas/website && find "src/app/(site)/cities" -type f
```

`cities/[slug]/neighborhoods` is a child and is still previous-generation. **It must keep `SiteChrome`.** Follow the industries precedent: move only the leaf that is being promoted, leave the children in `(site)`.

- [ ] **Step 2: Read the OLD route file and copy its `metadata`, `revalidate` and `generateStaticParams` verbatim.** The canonical in that metadata was repaired three days ago along with 28 others. **Dropping it silently undoes part of that repair.**

- [ ] **Step 3: Write the new route** at `src/app/cities/[slug]/page.tsx`, rendering `CityPage`, carrying the old metadata, and with a header comment stating what moved and why, in the shape of `src/app/world/page.tsx`.

- [ ] **Step 4: Delete the old route.**

```bash
git rm "src/app/(site)/cities/[slug]/page.tsx"
```

- [ ] **Step 5: Verify. All five rungs of the ladder.**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit
node scripts/loop/gate.mjs page-metadata canonical-urls no-fixture-in-routes layering section-order page-sections dead-links --heap 1536
node scripts/audit_generation_seam.mjs 2>&1 | tail -8
node scripts/loop/prose.mjs /cities/london --chars 5000
node scripts/audit_row_layout.mjs
```

Expected: the seam count goes from 2 to 3. **Read the prose.** The city page is the one that had 125 of 129 rows unstyled, so fused words here are the likeliest defect on the whole run.

- [ ] **Step 6: Commit.**

```bash
git add -A src/app && git commit -m "promote: the city page to v2 on its live URL"
```

- [ ] **Step 7: Journal**, with the seam count in `verified:`.

---

### Task C2: Promote the country page to `/[country]`

**Files:**
- Modify: `src/app/[country]/page.tsx`
- Reference: `src/app/dev/country2/page.tsx`, `src/components/country2/page/CountryPage.tsx`

**Note, and this one is different from C1:** `src/app/[country]/` is **already outside `(site)`** and renders `<SiteChrome>` itself. So the move is not a folder move; it is a swap of what the route renders, and the `<SiteChrome>` wrapper comes OFF because `CountryPage` carries its own masthead and footer.

- [ ] **Step 1: Read `src/app/[country]/page.tsx` end to end.** It is a dynamic route with `generateStaticParams` over 195 countries. Note every export.

- [ ] **Step 2: Confirm the country page has an honest hero.** The country page was parked once for exactly this reason: *"no honest hero"*. `DECISIONS` resolved the data question , a labelled fixture is acceptable, but **not on a shipping route**. So: if the hero figure is real or derived, promote. **If the hero can only be filled with a fixture, STOP.** Write it up as a DESIGN QUESTION, skip to Task C3, and put it in the morning list. That is the fixture rule and it does not bend.

- [ ] **Step 3: Swap the render**, keeping `metadata`, `revalidate`, `generateStaticParams` and every other export exactly as they are.

- [ ] **Step 4: Remove the `<SiteChrome>` wrapper** from this route only, since `CountryPage` brings its own.

- [ ] **Step 5: Verify with the C1 Step 5 block**, substituting `/gb` for the prose route. Expected seam count: 4.

- [ ] **Step 6: Commit and journal.**

---

### Task C3: Give the cell page its `.av2` root

**Files:** Modify `src/components/spine2/page/CellPage.tsx`

**Note:** This is the "smaller job than it sounds" finding. `CellPage.tsx` is **already assembled from the spine2 v2 kit and is already what the live route renders.** What it lacks is the `.av2` root, which is why the stylesheet never applies and why the census reports `/[country]/[geo]/[industry]` as three generations at once.

- [ ] **Step 1: Read `src/app/world/page.tsx` lines 130 to 155** for the exact shell shape: `<div className="av2">`, `<Place />`, `<div className="wrap">`, the `.mast` header, and `<SiteFooter />` at the end.

- [ ] **Step 2: Wrap `CellPage`'s return in that shell.** Add `import "@/styles/atlas-spine.css"`.

- [ ] **Step 3: PORT THE 21 CHAPTERS UNCHANGED.** Ratified: *"Rebuilding the look and the content model at once is two risky changes, and only one is overdue."* Do not reorder, merge, drop or rewrite a chapter. If a chapter looks wrong under the new scope, that is a DESIGN QUESTION, not a fix.

- [ ] **Step 4: Remove whatever legacy or SpineShell wrapper the route currently applies**, so the page carries one generation and not three.

- [ ] **Step 5: Verify.**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit
node scripts/loop/gate.mjs --all --heap 1536
node scripts/audit_generation_seam.mjs 2>&1 | tail -8
node scripts/loop/prose.mjs /gb/london/restaurants --chars 10000
node scripts/audit_row_layout.mjs
```

**Run the FULL gate set here.** This is the money page and it is a shipping route. Expected seam count: 5.

- [ ] **Step 6: Commit and journal.**

---

## SEGMENT D , THE TWO PAGE TYPES THAT DO NOT EXIST

**`/dev/industry2` and `/dev/hood2` have no route file and never have.** Both answered HTTP 200 with 594 characters of legacy chrome for days, because Next renders the layout for an unmatched path, and an audit tool reported them clean the whole time.

These two are the last of the five locked page types. **Building them is the finish line the founder defined.**

**This is where the skeleton doctrine matters most.** Both pages will be built largely on `SampleTag`-labelled fixtures, on dev routes, and that is the correct and intended outcome. The design is the deliverable.

### Task D1: Build `/dev/industry2`, the industry detail page

**Files:**
- Create: `src/app/dev/industry2/page.tsx`
- Create: `src/lib/fixtures/industry-skeleton.ts`
- Reference: `src/app/dev/spine-industry/industry-view.tsx` for the section list, `src/app/industries/page.tsx` for the v2 shell

- [ ] **Step 1: Take the SECTION ORDER from the previous generation, not from imagination.** `src/app/dev/spine-industry/industry-view.tsx` holds the ratified industry spine. The section list carries over; only the rendering changes.

- [ ] **Step 2: Write the fixture** at `src/lib/fixtures/industry-skeleton.ts`, exporting one shaped object with every field the spine needs. **It lives under `fixtures/` so the gate can see it.**

- [ ] **Step 3: Build the page** in the `src/app/industries/page.tsx` shell: `.av2` root, `<Place />`, `.wrap`, `.mast`, sections, `<SiteFooter />`.

- [ ] **Step 4: Every fixture figure renders through `SampleTag`.** Not a footnote at the bottom. On the figure. `verify_sample_tags` checks this and `verify_no_fixture_in_routes` makes it structural.

- [ ] **Step 5: Set `robots: { index: false, follow: false }` in the metadata.** It is a dev route and it holds invented numbers.

- [ ] **Step 6: Verify.**

```bash
NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit
node scripts/loop/gate.mjs sample-tags no-fixture-in-routes no-em-dashes banned-vocabulary no-eyebrow two-surface-levels v2-scales spacing-scale --heap 1536
node scripts/loop/prose.mjs /dev/industry2 --chars 6000
```

**Under 800 characters of text means the route did not register.** That is the exact failure that hid for days. Check it explicitly.

- [ ] **Step 7: Commit and journal.**

---

### Task D2: Build `/dev/hood2`, the neighbourhood page

**Files:**
- Create: `src/app/dev/hood2/page.tsx`
- Create: `src/lib/fixtures/hood-skeleton.ts`
- Reference: `src/app/dev/spine-hood/`, `src/components/NeighborhoodOverview.tsx`

- [ ] **Step 1 to Step 7: Follow Task D1 exactly**, substituting the neighbourhood spine from `src/app/dev/spine-hood/` and `/dev/hood2` as the route.

- [ ] **Step 8: When both exist, re-measure and record.**

```bash
node scripts/audit_generation_seam.mjs 2>&1 | tail -8
```

Write in the journal how many of the **five locked page types** now render v2, and state plainly which of those are on live URLs and which are still on `/dev`. **Those are different claims and conflating them is how "all five spine pages exist" became false.**

---

## SEGMENT E , THE DESIGN QUALITY SWEEP

Everything above builds. This segment makes it good. **If the night runs short, this segment is worth more than Segment D**, because a half-finished new page type is recoverable and a sitewide spacing defect is not noticed until the founder sees it.

### Task E1: The row and value sweep across every v2 surface

**Files:** Modify whichever call sites are wrong.

- [ ] **Step 1: Run the tool against every v2 route that exists.**

```bash
cd /e/atlas/website && node scripts/audit_row_layout.mjs
```

- [ ] **Step 2: Fix every unstyled row at the CALL SITE.** Wrap the run in `<div className="panel pad rise"><div className="statblock">`, both classes on one element. **Never add a bare `.row` rule to the stylesheet.** The stylesheet is the founder's design.

- [ ] **Step 3: Fix every clipped value by moving the qualifier into `.nm > .s`.** Widen `--val-col` on a row only where the value is genuinely a short phrase rather than a figure. **Widening it to hold prose is the same mistake as putting prose there.**

- [ ] **Step 4: Verify the count reaches zero, commit, journal.**

---

### Task E2: Flags, everywhere a country is named

**Note:** The founder asked for this directly. `CountryFlag` renders flat SVGs at a canonical 3:2 from a CDN, so ninety-nine flags are ninety-nine cached requests and no bytes in the bundle. **It has been in the repository the whole time**; a truncated search once "proved" it did not exist and that claim reached a document.

- [ ] **Step 1: Find every place a country name is rendered without its flag.**

```bash
cd /e/atlas/website && node scripts/loop/gate.mjs --list > /dev/null && grep -rln "countryPageTarget\|countryName(" src/components src/app --include=*.tsx | head -40
```

- [ ] **Step 2: Add `<CountryFlag iso2={...} className="w-[18px]" />` before the name** in every v2 surface, matching the `CountryLink` pattern in `src/app/world/page.tsx`.

- [ ] **Step 3: Never use an emoji flag.** Windows renders regional indicators as letter boxes. This was tried and it failed.

- [ ] **Step 4: Verify, commit, journal.**

---

### Task E3: Read every v2 page as prose, end to end

**Note:** This is the technique that found nine defects the 62 gates could not see. Run it last, when everything is built, because it reads the result rather than the intention.

- [ ] **Step 1: Read them all.**

```bash
cd /e/atlas/website && node scripts/loop/prose.mjs /dev/home3 /world /industries /cities/london /gb /gb/london/restaurants /dev/industry2 /dev/hood2 --chars 6000
```

- [ ] **Step 2: Read the output as a human.** Not scanning for a pattern. **Reading it.** A sentence that is wrong means the page is wrong.

- [ ] **Step 3: Triage every finding** with the section 1.5 table. LIVE DEFECTs are fixed tonight.

- [ ] **Step 4: Commit each fix separately, journal each one.**

---

### Task E4: The type, radius and line-height retrofit , PARTIAL, and read this carefully

**Ratified:** radius and line-height **APPLY**. Type scale **HOLD**.

- [ ] **Step 1: Apply the radius tokens only.** `--r-lg` 10, `--r-md` 8, `--r-sm` 6, `--r-xs` 4. Fifteen distinct radii collapse to four.

- [ ] **Step 2: Apply the line-height collapse.** Fifteen distinct values across 34 uses.

- [ ] **Step 3: DO NOT TOUCH FONT SIZE.** Ratified HOLD: *"Three sizes shift perceptibly in a design already ratified."* Twenty-four sizes stay twenty-four sizes tonight. **This is the founder's call and it has already been made.**

- [ ] **Step 4: Remember that 34 box-shadows are BORDERS, not elevation.** `0 0 0 1px var(--terra-line)` and `inset 0 1px 0 var(--grp-rule)` draw a 1px ring with no layout box. **Any sweep that collapses "all box-shadows" destroys 34 working borders.**

- [ ] **Step 5: Verify with `gate.mjs --all`, commit, journal.**

---

## SEGMENT F , THE MORNING REPORT

### Task F1: Write the report and the single approval list

**Files:** Create `design/loop5/MORNING.md`

- [ ] **Step 1: Run the full ladder one last time.**

```bash
cd /e/atlas/website && NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit
node scripts/loop/gate.mjs --all --heap 1536
node scripts/audit_generation_seam.mjs 2>&1 | tail -8
```

- [ ] **Step 2: Write the report.** Lead with the scoreboard: **shipping v2 routes at open, shipping v2 routes at close.** That is the number the founder is buying.

- [ ] **Step 3: Be honest in his own preferred register.** He asked for *"thirty done, twelve partial, eight blocked, here is exactly why"* over a clean list he would have to verify himself. **Every blocked task names its command and its error.**

- [ ] **Step 4: Write ONE approval list.** One message, one list, one line of reasoning each, covering everything that touches a live page, a URL, a flag or a deploy. **The push to `main` is item one and it is the only thing standing between the night's work and a reader.**

- [ ] **Step 5: Never write a screenshot path for an image that does not exist.** If a shot could not be taken, write `shot none (server)`.

- [ ] **Step 6: Commit both repositories.**

```bash
cd /e/atlas/website && git add -A && git commit -m "loop5: <what landed>"
cd /e/atlas && git add design/loop5 && git commit -m "loop5: the morning report"
```

**Then STOP. Do not push.**

---

## 3. PRIORITY ORDER IF THE NIGHT RUNS SHORT

Work down this list. **Do not start something further down while something above it is unfinished**, unless the thing above is BLOCKED and written up.

1. **Task A1** , the baseline. Without it nothing tonight is measurable.
2. **Segment C** , the promotions. The work is already paid for; this is the best value per hour on the page.
3. **Segment B** , the home page. The founder named it directly.
4. **Segment E** , the quality sweep. Worth more than Segment D if time is short.
5. **Segment D** , the two new page types. Most ambitious, least recoverable if half-done.
6. **Task F1** , the report. **Reserve 30 minutes for this no matter what else is unfinished.** A run nobody can read is a run that did not happen.

---

## 4. SELF-REVIEW NOTES

Checked against the founder's stated priorities on 2026-08-07:

- **"Design is the main main main thing"** , Segments B and E are design, Segment C is design promotion. Section 0 makes the skeleton-over-numbers rule outrank everything.
- **"Not factual accuracy, we are building the skeleton"** , stated in section 0 and repeated in B2 Step 4, D1 Step 2 and D2. The one counterweight, no fixture on a shipping route, is stated with its reason.
- **"Pick the flags right"** , Task E2, with the emoji trap and the truncated-search correction recorded.
- **"The spacing that designed"** , the spacing scale is in Global Constraints with the no-new-grandfathered-entry rule; E4 applies radius and line-height and explicitly holds type.
- **"The home website should advance forward"** , Segment B, four tasks, and it is priority 3 with the home page named as the centrepiece.
- **"It should not take too much usage"** , section 1.2, six rules, each with the observed failure behind it.
- **"Flexibility, we might find different problems"** , section 1.5, a four-bucket triage with an action per bucket.
- **"Use the skills that we have if needed"** , section 1.5 names four to use and six to refuse, with the reason the refusals matter more.
