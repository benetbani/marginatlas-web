# HANDOFF — The shadcnblocks upgrade loop (marginatlas.com)
**Status, 2026-08-23:** a self-pacing audit-and-repair loop is 32 of 64 reader-visible surfaces through the site. 37 rows closed, 13 blocked, 19 to go. The work is committed on `main`, never pushed. Nothing is deployed.

> **How to use this document.** Read it top to bottom once. Then read the files in
> §7 in the order given. Do not start work until you can answer §13. The
> ready-to-paste re-hydration prompt is §14.

---

## 1. TL;DR

The founder bought the **shadcnblocks** component library (~$140, 3,968 blocks) and asked for a slow, careful loop that walks the whole site, researches each surface, and upgrades the look **without botching anything**. That loop is running. Each iteration takes exactly **one** reader-visible section, reads its source *and the module that produces its numbers*, decides replace / keep / retire **with recorded evidence**, applies seven kinds of quality check, renders a standalone before/after HTML sheet at 320/480/760px, updates the ledger, and makes **one commit per surface**.

The headline result after 37 rows: **the library has won exactly three times, always for the same defect** — a section laid out as a table with no table underneath it. Everything else the loop has found is native defects in this codebase: undefined CSS variables painting nothing, containers that split before they have content, markers half-clipped at scale ends, sections that reach no reader, and — the worst, found in the last iteration — **a rent comparison whose arithmetic was wrong on 251 of 252 cities and inverted in sign**.

**The single most important thing to know, and it was discovered while writing this handoff: the rebuilt "spine" pages are NOT live.** Every flag resolves OFF with no env var set, and production serves the pre-spine pages. Earlier ledger entries (and my reports to the founder) said "live". They were wrong. See §3 and §11.

**Recommended next action:** tell the founder the "live" correction, then continue the loop at **row 38, "The spending pool", city page.**

---

## 2. Mission & success criteria

### The founder's own framing

> "create the prompt for a loop that will slowly scan the whole site, research, optimize, and ultimately seek to upgrade the look using this lubrary, be careful to not botch the site, sevwral quality checks of different kidns b3for3 delivering."

And mid-loop, when I reported that the blocks mostly didn't fit:

> "You just keep pushing forward... I cannot guide you on anything. You know better... we are in a major phase of implementing those changes to our whole page. So, effectively, that... that's what we are trying to achieve. Like, taking those blocks that were ready and implementing them very, uh, where they make sense and they make sense in a lot of instances, to be honest. So that's the path."

**Read that second quote as a correction, not encouragement.** It was a challenge to my "the blocks don't fit" conclusion. The answer was to *measure* rather than assert: a codebase sweep found **12 more candidates** for the one pattern the library answers (§5). The ledger records that my reports had been "accurate but narrow".

### The enduring goal vs. the current tactic

- **Enduring goal:** the site looks and reads like a premium editorial almanac, and no reader ever sees a wrong number.
- **Current tactic:** a per-surface audit loop that uses the paid library *only where it answers a measured defect*, and fixes the native defects it uncovers along the way.

These differ. The loop has spent far more effort on native defects than on installing blocks, and that is correct — but do not let it drift into pure defect-hunting. The founder's redirect above is a standing instruction to keep looking for places blocks land.

### "Done" for the loop

All 64 ledger rows are `DONE-REPLACED`, `DONE-KEPT`, `RETIRED`, or `BLOCKED` with a written reason.

### Hard constraints (verbatim from the founder)

> "NEVER push, never raise a ratchet baseline, never fabricate a figure, never touch the homepage H1, and NEVER write your report to me in code — no file paths, no function names, no line numbers. I do not have the codebase in my head. Tell me what a visitor sees."

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| Branch | `main`, **37 loop commits, never pushed** | Newest: `dd814a94` |
| Ledger | 64 rows | 6 replaced/retired · 25 kept with evidence · 13 blocked · **19 to go** |
| Licence key | **Working** | Live in `.env.local` as `SHADCNBLOCKS_API_KEY`; registry wired in `components.json` as `@shadcnblocks` |
| Gate chain | **114 passed, 0 failed** on the last clean serial run | 3 deferred (`cell-lattice`), pre-existing |
| Typecheck | Clean | |
| Cell page | **DONE.** All 17 rows closed or blocked | 5 blocked on missing data |
| Industry page | **DONE.** All 14 rows closed or blocked | 4 blocked on missing data, 1 void duplicate |
| City page | Rows 33–37 closed, **38–47 open** | Next row is 38 |
| Neighbourhood | Rows 48–51 untouched | |
| Country page | Blocked, rebuild switched off | |
| Home | Blocked, ratified and locked | 842 hero/bento/feature blocks are explicitly **out of scope** |
| Everything else | Rows 54–64, mostly untouched | |
| **The rebuilt "spine" pages** | **NOT SERVED TO ANYONE** | See below — this is the biggest correction in the dossier |

### The "live" correction (verify this yourself before trusting any older text)

`isSpineReformEnabledFor(page)` does **not** default a shipped page to on. It defaults it to *following the master switch*, and the master defaults to **off**. Called directly with no env set, all six page types return **OFF**.

Production confirms it. `https://www.marginatlas.com/cities/london` and `/industries/restaurants` both return 200 and carry **zero** spine markers; their headings use the **pre-spine** typography classes (`font-display`, `text-ink-900`).

**Consequences, stated plainly:**
- Every "a visitor sees" phrase in the ledger describes the **rebuilt** page, currently reachable only in the workshop.
- Row 37's "wrong on 251 of 252 city pages" is true of the rebuilt city page, **which is not being served**.
- The work is **not** wasted: these pages are the ratified destination (memory: *"Phase C DEPLOY — founder flips `NEXT_PUBLIC_SPINE_REFORM_{CELL,INDUSTRY,CITY,HOOD}=1` in Vercel + a build"*). The loop is hardening them before they go live.
- **Whether the switches are on in production is invisible from this repo.** They are dashboard settings. The only instrument that answers it is a fetch of the live site.

**The ledger has been corrected in place** (§"What a visitor actually sees"). Older per-row prose written before 2026-08-23 may still read as though a reader is looking at it today. Treat those as describing the rebuilt page.

---

## 4. How we got here — the decision trail

| # | Decision | Reason |
|---|---|---|
| 1 | Buy shadcnblocks and migrate onto it | Founder's call; ~$140 already spent |
| 2 | I claimed the licence "is wired up" from a 200 on `registry.json` | **Wrong.** That index is public. Corrected in `00-OVERVIEW.md` in place |
| 3 | Key installed without echoing its value | Printed only length (40) and prefix (`sk_live`); confirmed `.env*` is git-ignored; verified with a real block pull (`chart-card15` → 200) |
| 4 | A **loop**, not a big-bang migration | Founder asked for slow + careful + several quality checks. One surface per iteration, one commit each, so any of it reverts alone |
| 5 | Order by **reader value**: cell → industry → city → hood → country → home → rest | Cell page is the product ("a trade in a place"). Country is weakest, deliberately late. **Never reorder to reach something easier** |
| 6 | Build a **ledger** as the loop's memory | Context resets between iterations. Read it first, every time |
| 7 | **KEEP is a legitimate outcome, with evidence** | Prevents replacing things to look busy. A 44px score ring rendered server-side, 40 to a page, does not improve by being redrawn in the browser |
| 8 | Rule that settles arguments: **structure adapts, substance does not** | The block's layout wins; the block's content never lands. Sample prices/features/percentages deleted on arrival |
| 9 | **A typecheck is not a render** — photograph every change | Both real defects in the money waterfall were invisible to every automated check and obvious the second it was drawn |
| 10 | **Never raise a ratchet baseline** to make a gate pass | Type-ladder ratchet failed 421→423; I moved three sizes onto the ladder instead and the ratchet went **down** to 420 |
| 11 | Sheets are rendered at **viewport widths**, one full-width column | My early sheets used container widths, which media queries cannot see. That made an earlier sheet unable to show the defect it was drawn for |
| 12 | Server-render harness instead of a dev server | The dev server dies repeatedly under ~0.5GB free memory. `renderToStaticMarkup` + the Tailwind CLI + `shoot_live.mjs` is deterministic |
| 13 | After the founder's redirect, **sweep** for the one pattern the library answers | Answered his challenge with a measurement, not a defence: 12 more candidates found |
| 14 | Row 35 marked BLOCKED rather than redesigned | Fixing label collisions needs pixel widths, which a server render does not have. Both real fixes change what the section looks like → founder's call |
| 15 | Row 37: fixed a wrong number even though it changed reader-visible figures | The content-diff rule exists to prove a *layout swap* didn't disturb content. When the finding is that the content is wrong, the diff becomes the evidence. Stated loudly rather than hidden |

---

## 5. Hard-won truths & mental model

**Where the library actually lands.** Three wins in 37 rows, all the same defect: *a section that puts things down the side and measures across the top, with a header row drawn to look like one and no `<table>` underneath it*. The library's Table primitive fixed all three. A codebase sweep for that signature found **12 more reader-facing candidates** (city page 4 files / neighbourhood explorer 1 / shared spine kit 2 — used by every page / cell+industry leftovers 5). **Two have been opened; neither was a table.** Treat 12 as an upper bound: the instrument cannot tell a grid holding tabular data from a grid holding layout.

**The most repeated structural fault in this codebase:** *a container that splits before it knows what it has to put in both halves.* Four occurrences (masthead scorecard, customer-spend band, who-it-suits columns, the close band).

**The second most repeated:** *a mark or label centred on its own value at the very end of a scale, with half of it outside the box.* Three separate charts.

**Read the module that produces a number before acting on the number.** This is `CLAUDE.md`'s first working rule and it is the single highest-yield habit here. Row 37's site-wide defect existed because two iterations earlier I measured a section against the **bundled sample** and never against the real adapter — and the sample is the one shape in which that bug is invisible.

**State the instrument's blind spot before quoting it.** Write the sentence *"this measurement cannot distinguish X from Y."* If you can't write it, the measurement isn't ready. Three of my own probes have produced false results this loop, each caught by writing that sentence.

**Vocabulary you must not misread:**

| Term | Meaning |
|---|---|
| **spine** | The rebuilt page architecture (`src/components/spine/`). Flag-gated. **Not live.** |
| **the seed / the sample** | `src/lib/spine-seeds/*.json` — illustrative bundled data the workshop routes render. **Anything rendered from a seed is tagged SAMPLE.** |
| **the adapter** | `src/lib/spine/adapt_*.ts` — builds the same shape from *real* data. Deliberately omits fields with no source, with the reason written in. **The seed and the adapter produce different shapes. This is where bugs hide.** |
| **cell** | A trade × place pair. The product's atomic page |
| **the ratchet** | Count-down-only baselines (`type_ladder_baseline.json`, `width_discipline_baseline.json`). Never raise one |
| **the type ladder** | `--t-mark:10 --t-micro:11 --t-small:12 --t-body:14 --t-lead:16 --t-sub:18 --t-head:20 --t-section:24 --t-focal:30 --t-answer:48` |
| **terracotta** | `--chart-1: #e62200`. **The site's ONE accent. It marks the answer and nothing else.** |
| **reaches no reader** | The component is correct but its adapter omits its inputs, so it renders only in the workshop. **Ten sections so far.** |

---

## 6. Dead ends — do NOT retry

| Dead end | Why |
|---|---|
| **`shadcn add --overwrite`** | Has already clobbered a customised file in this project once. Never |
| **Running the dev server to verify** | Dies repeatedly under ~0.5GB free memory. Also: the founder has a standing rule — *never open a browser to show him work*. Render to a standalone `.html` he opens himself |
| **The parallel gate chain** | Fails differently on each attempt on this machine. Use `npm run prebuild:serial` |
| **Container-width proof sheets** | Media queries can't see them. One full-width column, shot at viewport widths |
| **Hero / bento / feature blocks** | 842 exist. **None are in scope.** The homepage H1 and band order are ratified and locked |
| **Redesigning the peer-city strip to fix label collisions** | Alternating by distance instead of index doesn't help — with three in a cluster two still share a side. Assigning lanes needs each label's pixel width, and this section renders on the server. **Both working fixes change what the section looks like → founder's call** |
| **Deleting the chapter divider's unused `eyebrow` / `icon` props** | They are dead *by design* (a ratified ban + a rule scoped to section openers). 15 and 22 call sites pass them. Deleting 37 authored choices is not the loop's call |
| **Removing the typography gate's opt-out from spine headings** | Tried it; the gate failed. The canonical tokens are the **pre-spine serif scale**, which a spine heading on the v2 ladder cannot wear. Every spine heading must opt out |
| **`git stash` to capture a "before" render** | It reverts the harness config too, producing an empty capture. Use `git stash push -- <one file>` |
| **Bash heredocs for non-trivial scripts** | Repeated quoting failures (unterminated strings, `$?` inside regex). Use the Write tool, or a `/tmp/*.py` file |

---

## 7. Critical files & artifacts — the map and reading order

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `docs/loop/shadcn-upgrade/LEDGER.md` | **THE loop's memory.** 64 rows + a long prose entry per closed row. 1,333 lines. Read the header, §"What a visitor actually sees", the row tables, "THE SWEEP", "The count", and "Standing notes" | **READ FIRST, ALWAYS** |
| 2 | `docs/superpowers/plans/2026-08-21-shadcn-migration/LOOP-PROMPT.md` | The canonical loop prompt, verbatim | Critical |
| 3 | `CLAUDE.md` | Project entry point; the four working rules; hard constraints; gate commands | Critical |
| 4 | `docs/superpowers/plans/2026-08-21-shadcn-migration/00-OVERVIEW.md` | Migration framing + the corrected licence-key note | High |
| 5 | `docs/superpowers/plans/2026-08-21-shadcn-migration/05-BLOCK-SHORTLIST.md` | Blocks shortlisted against surfaces the site lacks | High |
| 6 | `src/components/spine/kit.tsx` | The shared spine kit — `Rail`, `Head`, `Movement`, `StackBar`, `SpreadStrip`, `PhaseBar`, `EaseScale`, `WideRail`, `Box`. **Used by every page**; 9 pinned grids, 2 sweep candidates | High |
| 7 | `src/lib/spine/adapt_city.ts` | The city adapter. **Read this before touching any city row.** Its comments state which fields are deliberately omitted and why | High (next rows) |
| 8 | `src/components/spine/city/city-view.tsx` | The city page body. Rows 33–47 live here | High (next rows) |
| 9 | `src/lib/feature_flags.ts` | `isSpineReformEnabledFor` + `resolveSpinePage`. **The file that proves the pages are off** | High |
| 10 | `scripts/tsconfig.harness.json` | Makes page components renderable outside Next (`jsx: react-jsx`, `@/*` paths, `maplibre-gl` CSS stub) | Needed for every capture |
| 11 | `scripts/shoot_live.mjs` | Photographs a page at given viewport widths. Owns its own Chromium | Needed for every capture |
| 12 | `scripts/proof_space.mjs` + `scripts/proof_space_render.tsx` | The newest proof pair — **copy these as the template** for the next row | High |
| 13 | `scripts/probe_tabular_surfaces.mjs` | The sweep. Re-run it to see the 12 remaining candidates | Medium |
| 14 | `docs/loop/artifacts/space/space-before-after.html` | Row 37's sheet — the clearest example of the deliverable's standard | Medium |
| 15 | `docs/loop/artifacts/` | ~45 subdirectories, one per closed row: sheets + shots + shoot reports | Reference |
| 16 | `docs/handoff/HANDOFF-marginatlas-2026-08-21.md` | The prior session handoff | Reference |

**43 probe/proof scripts** exist in `scripts/`. Each is documented at the top with what it measures and **what it cannot distinguish**. Read one before writing a new one — the pattern is established.

---

## 8. Open threads & next steps

### Committed next step

**Row 38, "The spending pool", city page.** Follow the loop prompt exactly.

- **What:** one iteration on that section.
- **Where:** `src/components/spine/city/city-view.tsx` (`DemandSize`), and **first** `src/lib/spine/adapt_city.ts` to see what the adapter actually supplies. The adapter's comment already flags that the `$196B` metro total, per-capita, growth, and the trend spark are **omitted**, and only the resident/visitor split is real — so expect a "reaches no reader" outcome for parts of it. **Verify; do not assume.**
- **How to verify success:** `npx tsc --noEmit` clean · `npm run prebuild:serial` 114/0 · content diff on the seed render byte-identical (unless the finding *is* a wrong figure, in which case the diff is the evidence and must be stated loudly) · a sheet in `docs/loop/artifacts/` photographed at 320/480/760 and **actually looked at** · one commit.

### Then

1. **Rows 39–47**, city page, in order.
2. **Rows 48–51**, neighbourhood explorer. The sweep flags this file with 4 pinned grids — a likely fourth library win.
3. **The shared spine kit's 2 sweep candidates (9 pinned grids).** Highest leverage in the sweep: it is used by every page.
4. **Rows 54, 56–61, 63.**

### Optional / someday

- Row 54, Pricing: **no monthly/yearly switch exists.** Verified. The library has pricing blocks. This is the clearest untried block opportunity in the ledger.
- Row 64, Sign-in: **no sign-in surface exists at all.** Belongs to the accounts work, listed so it starts from a block instead of another hand-built form.

### Decisions waiting on the founder (do not guess at these)

| # | The question | Why it's his |
|---|---|---|
| 1 | **Is terracotta-on-hover banned?** A ratified ruling says *"the accent never appears on hover"*. **Ten reader-facing controls use it**, two of them eleven lines from where that rule is quoted. Either the rule means what it says and is broken in ten places, or its scope was a decorative motif and not interactive controls. Both readings are defensible | Site-wide, both readings defensible |
| 2 | **The peer-city strip's crowding.** At phone width "Paris" and "Munich" run together. Structural for London (two cities share a cost index). Both fixes change what the section looks like | Design, not correctness |
| 3 | **Nine figures on the wage-bracket card cannot be read by anyone looking at it** — spoken to a screen reader only. And three figures are printed twice on the same card | Changes what a reader reads |
| 4 | Should the cell page's legend sum to 100? | Content decision |
| 5 | The bullet primitive's raw colour across four surfaces | |
| 6 | The "suits dots" accent contradiction | |
| 7 | The ramp-from-week-0 semantics | |
| 8 | Grey-on-grey bar contrast measured at **2.25:1** | Below AA; may be intentional for a non-text mark |
| 9 | **Do the spine flags get switched on?** (new, §3) | Deploy decision |

---

## 9. Constraints, guardrails & operator preferences

### Absolute — from the loop prompt

- **Never push.**
- **Never raise a ratchet baseline** to make a gate pass.
- **Never touch the homepage H1 or the ratified band order.**
- **Never fabricate** a figure, percentile, spread, trend or comparison. *If a block invites a number the data does not hold, the block is wrong for this site.*
- **Never let a block introduce a second live hue.**
- **Never run `shadcn add --overwrite`.**
- If the dev server dies, render to a standalone sheet **and say the browser check did not run.**

### From `CLAUDE.md`

- No em-dashes in user-visible source. No source-agency names in reader copy. No URL slug renames. No raw hex/px/ms in components. No `--no-verify`, no force-push to main.
- **A ratified rule becomes a gate in the same session, or it is written down as not machine-checkable with the reason.**
- The prebuild chain must never need the network or a secret.

### How the founder wants to be told

**This is not a style note; he said it explicitly.**

> "NEVER write your report to me in code — no file paths, no function names, no line numbers. I do not have the codebase in my head. Tell me what a visitor sees."

- Deliver a **standalone `.html`** he opens himself. Never ask him to start a server or watch a browser.
- **State failures with their output.** Never claim done for anything not looked at.
- **KEEP is a fine answer** — say so and say why.
- He is blunt and does not want to be asked permission for things you can do yourself. When I asked how to find the licence key instead of acting, he said: *"stop bitching, nobody gives a fuck yooo."* **Act; report.**
- Record your own wrong predictions rather than quietly fixing them. The ledger does this throughout and it is why it is trustworthy.

---

## 10. Environment & reproduction

Windows 11 · PowerShell primary, Bash available · working dir `E:\atlas\website` · Next.js 15.5 · React 19.2 · **Tailwind 3.4.1 (not v4)** · Recharts 2.15.4 · Node 26.

```bash
npx tsc --noEmit
```

```bash
npm run prebuild:serial
```

Render a component outside Next (Supabase-touching adapters need the two public env vars):

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/proof_space_render.tsx after
```

Compile the real Tailwind for a sheet — **include the source files, not just the rendered HTML**:

```bash
npx tailwindcss -i scratchpad/tw-in-space.css -o scratchpad/tw-space.css --content "./scratchpad/space-live-after.html,./src/components/spine/kit.tsx,./src/components/spine/city/city-view.tsx" --minify
```

Photograph a sheet:

```bash
node scripts/shoot_live.mjs "file:///E:/atlas/website/docs/loop/artifacts/space/space-before-after.html" scratchpad/shots-space --widths 320,480,760,1024 --settle 700 --prefix SPACE-
```

Pull a block (key is in `.env.local`; **never echo it**):

```bash
curl -H "Authorization: Bearer $SHADCNBLOCKS_API_KEY" https://www.shadcnblocks.com/r/chart-card15
```

**Secrets:** `.env.local`, git-ignored. `SHADCNBLOCKS_API_KEY` + the Supabase pair. Do not print values.

---

## 11. Landmines & gotchas

1. **Memory.** This machine runs at <1GB free. The gate chain crashes 1–4 gates with Windows abort codes (`3221226505`, `4294963202`) or `ERR_WORKER_INIT_FAILED`. **Every crashed gate passes when run alone.** Report it as environmental, never as a pass — and re-run the chain, which often comes back clean.
2. **The seed and the adapter differ, and the seed is the flattering one.** The bundled sample indexes the home city to 100; the real adapter passes an absolute index where London reads 75. That single difference hid a site-wide wrong number for two iterations. **Always render both.**
3. **Tailwind's extractor cannot see HTML-entity-escaped classes.** `[&>*]:flex-1` appears as `[&amp;&gt;*]:flex-1` in rendered HTML, so scanning only the render silently drops the rule and the sheet lays out wrongly while looking perfect in source. **Always add the source `.tsx` to `--content`.**
4. **Client-only content is invisible to content diffs and screenshots.** The InfoTip gloss lives inside a Radix tooltip. Verify such things by walking the element tree (`scripts/probe_gloss_city.tsx`).
5. **`buildSpineCitySeed` is `async`.** Forgetting to await returns `{}` and every field reads as absent. Also, top-level `await` fails under tsx's CJS output — wrap in an `async main()`.
6. **Probe scripts can break `tsc --noEmit`** while running fine under tsx. Fix with a documented cast.
7. **`renderToStaticMarkup` on page components fails with "React is not defined"** — they rely on Next's automatic JSX runtime. That's what `scripts/tsconfig.harness.json` is for.
8. **`where-to-trade.tsx` imports `maplibre-gl.css`.** The harness config aliases it to a stub. Don't clobber the `@/*` alias when editing that config.
9. **My own probes have produced false results three times** (a class-only heading matcher, a greedy `the (.+?)` capture, a chapter-icon detector that measured nothing). Each is documented in the script that had it. **Read the fix comment before reusing a probe.**
10. **`docs/loop/artifacts/` is large.** Keep the working scratch in `scratchpad/` (untracked); only sheets, shots and reports belong in artifacts.
11. **Whether the gates run on deploy is unknown from this repo.** There is no `vercel.json`; the build command is a dashboard setting. If Vercel runs `next build` directly, the `prebuild` hook is bypassed and **every gate is skipped on every deploy.** `CLAUDE.md` proposes the one-line fix and leaves it to the founder.
12. **Two database tables do not exist** (`newsletter_signups`, `corrections`) and both forms report success. Migrations are written and unapplied. Not this loop's work, but it is real reader data being discarded — see `CLAUDE.md`.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **the loop** | The `/loop` self-pacing audit; one surface per iteration |
| **the ledger** | `docs/loop/shadcn-upgrade/LEDGER.md`, the loop's persistent memory |
| **row** | One numbered reader-visible surface in the ledger (1–64) |
| **surface** | A section a visitor actually reads, named for what they see — never a file |
| **spine** | The rebuilt page architecture; flag-gated; not live |
| **seed / sample** | Illustrative bundled JSON. Anything drawn from it is tagged SAMPLE |
| **adapter** | Builds the page shape from real data; omits unsourced fields on purpose |
| **cell** | A trade × place pair — the product's atomic page |
| **ratchet** | A count-down-only baseline file. Never raise one |
| **the sweep** | The scan for "a table built without a table" — the one pattern the library answers |
| **reaches no reader** | Component correct, inputs omitted upstream; renders only in the workshop |
| **proof sheet** | Standalone before/after `.html` in `docs/loop/artifacts/`, the founder's deliverable |
| **the gate chain** | 114 prebuild verifiers, run serially |
| **workshop route** | `src/app/dev/*` — where a block is pulled and stripped before it ever reaches a reader page |

---

## 13. Successor verification checklist

You are oriented when you can answer these **without asking**:

1. What is the loop's one rule about how much work happens per iteration, and what is the ledger's rule about ordering?
2. **Are the rebuilt spine pages being served to readers right now?** How would you check, and why can't you answer it from the repository alone?
3. Which single defect has the paid library answered, how many times, and how many more candidates has the sweep found?
4. What is "the seed vs. the adapter", and what did that distinction hide for two iterations?
5. What is the exact rule for what happens when a block's content conflicts with the site's content?
6. Name three things you must never do (from the hard stops).
7. What is the committed next step, which two files do you read first for it, and in which order?
8. How does the founder want to be told what you did, and what must never appear in that report?

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: The shadcnblocks upgrade loop, marginatlas.com
Working directory: E:\atlas\website
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-shadcn-upgrade-loop-2026-08-23.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   1. docs/loop/shadcn-upgrade/LEDGER.md            (the loop's memory; read the header,
                                                     "What a visitor actually sees", the row
                                                     tables, "THE SWEEP", "The count", and
                                                     "Standing notes")
   2. docs/superpowers/plans/2026-08-21-shadcn-migration/LOOP-PROMPT.md
   3. CLAUDE.md
   4. src/lib/feature_flags.ts                      (proves the rebuilt pages are switched off)
   5. src/lib/spine/adapt_city.ts                   (read BEFORE any city section)
   6. src/components/spine/city/city-view.tsx       (rows 38-47 live here)
   7. src/components/spine/kit.tsx                  (the shared kit, used by every page)
   8. scripts/proof_space.mjs + scripts/proof_space_render.tsx  (the deliverable template)
   9. docs/loop/artifacts/space/space-before-after.html         (the standard to match)
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" in section 13
   of the dossier in 5-10 lines - the mission, the current state, the committed next step,
   and the top thing you must NOT do. Keep it tight; this is a checkpoint, not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files - the
   dossier is a point-in-time snapshot and the code is ground truth. In particular,
   re-check the feature-flag claim yourself: it contradicts what earlier ledger entries say.
6. Then stop and wait for my go, unless I have already pasted the loop prompt - in which
   case the committed next step is pre-authorized: state what you are about to do and begin
   at ledger row 38, "The spending pool", on the city page.

Honor the operator preferences and guardrails in the dossier as if they were given to you
directly. Two of them are absolute and easy to break by accident: never push, and never
write the report to the founder in code - no file paths, no function names, no line
numbers. Tell him what a visitor sees.

If anything in the dossier is unclear, ask before acting - but only after you have read
everything above.
```
