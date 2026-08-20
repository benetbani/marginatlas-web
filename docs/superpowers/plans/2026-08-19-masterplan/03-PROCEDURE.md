# 03 — THE PROCEDURE

> The exact steps for one unit of work, and the review that follows it.
> This file is normative. A tick that skips a step has not done the step,
> and saying "it looked fine" is not a substitute for a number.

Authority order: **the founder's charter** (`../2026-08-17-founder-brief-and-loop-charter.md`)
overrides this file; this file overrides an agent's judgement.

---

## 0. The unit of work is a SECTION, not a page

A page is too big to hold in one head and too big to review honestly. Every
backlog item names ONE section of ONE surface, or one cross-cutting rule applied
to a named list of sections.

Why this and not "improve the homepage": the last two rejections in this project
were both of whole-page passes. A whole page changes in fifty places, so no
single measurement can tell you which change helped, and the review degenerates
into an opinion about the whole. A section has a before number and an after
number.

**Exception, and the only one:** section ORDER is a page-level property. Reordering
is a legitimate unit, but then reordering is the ONLY thing that tick does — no
content edits ride along, or the diff stops being readable.

---

## 1. The eleven steps

### S0 — ORIENT. Never start from memory.

1. Read the charter in full. It is the founder's own words and it moves.
2. Read `06-BACKLOG.md` and take the top unblocked item.
3. Read the page dossier for the target surface in `02-PAGE-DOSSIERS.md`.
4. Read `05-ERROR-LEDGER.md` and search it for the surface and the technique you
   are about to use. **If your intended change appears in the ledger as a dead
   end, stop and take the next item.**
5. `git log --oneline -20 -- <the file you intend to edit>`. If the thing you are
   about to change was changed in the last ten commits, read that commit's
   message before proceeding. You may be about to revert someone's fix.

> The founder's instruction: *"be aware to consult the current progress for each
> step and to not repeat past errors."* S0.4 and S0.5 are that instruction made
> mechanical.

### S1 — MEASURE BEFORE. Numbers, not adjectives.

Render the target and record, into the tick's scratch notes:

| Metric | How |
|---|---|
| Section count on the surface | count rendered landmark blocks |
| Word count of the target section | `innerText.trim().split(/\s+/).length` |
| Rendered height at 375 / 768 / 1280 | `document.body.scrollHeight`, **reload between widths** |
| Computed colour + size of every text node in the section | `getComputedStyle` |
| Contrast of each against its ACTUAL painted backdrop | not its assumed backdrop |
| Element inventory | how many icons, marks, charts, numbers-set-large |
| Horizontal overflow at 375 | `scrollWidth > clientWidth` |

If a metric is impossible to obtain, **suspect the stylesheet compile order
first** (see S6). A metric that reads zero or empty is usually an instrument
failure, not a finding.

### S2 — DIAGNOSE. One sentence, with a number in it.

Write the defect as a single sentence that contains a measured quantity:

- Good: *"The coverage band spends 148 words to state one fact and occupies 640px
  at 375."*
- Not acceptable: *"The coverage band feels wordy."*

If you cannot put a number in the sentence, you have not measured; return to S1.

Then write the honesty line the charter demands: **"this measurement cannot
distinguish X from Y."** Every measurement has a blind spot. An SSR render cannot
distinguish "rendered identically" from "self-omitted identically". A word count
cannot distinguish prose from a table's contents. Name yours.

### S3 — CONSULT THE STANDARD. Find the rule before you invent one.

Open `01-DESIGN-STANDARD.md` and find the rule that governs the thing you are
changing: the band's word budget, the section order, the type step, the element
vocabulary.

- **A rule exists** → apply it exactly. Do not improve on it in passing.
- **No rule exists** → this is a GAP. Write the gap into `06-BACKLOG.md` as a
  standard-question item and pick the most conservative option available. Do not
  invent a new visual language on a tick; the charter forbids a new icon language
  and the same logic covers new type steps, new card treatments, new motion.

### S3.5 — BRAINSTORM. Three options, then pick, then say why the others lost.

**Added 2026-08-20**, because the founder named brainstorming as one of the five
things a tick does and this procedure jumped from "find the rule" straight to
"write the spec". A tick that goes from diagnosis to implementation has chosen
the first thing it thought of, and the first thing is usually the most obvious
thing, which on a site whose problem is *"a little bit schematic and very bland"*
is exactly the wrong bias.

Write, in the tick notes, **three options minimum**:

```
OPTION A: <what it is>
  COSTS:  <effort, and what else has to change>
  RISKS:  <what it could break, what it forecloses>
  MOVES:  <which criterion in 11-PRODUCTION-READINESS.md, or "none">
OPTION B: ...
OPTION C: ...
CHOSE:    <which, and the reason the other two lost>
```

Three rules on the options themselves:

1. **"Keep the current version" is always a legitimate option and must be one of
   the three when the thing already renders.** The graphics review found the
   founder's instinct that *"maybe the current version is the best one"* was right
   more often than not, across ten families.
2. **At least one option must be smaller than the others.** The cheapest change
   that moves the criterion is frequently the right one, and it is the one an
   agent mid-flow never proposes.
3. **The options are yours; a preference between founder-facing VARIANTS is not.**
   Where the output is A/B/C pages for him to judge, an agent builds all three and
   states measured facts beside each. It never says which is better. That rule
   exists because this project already ran a variants-and-pick machine and he
   called the result mediocre.

Invoke `superpowers:brainstorming` for anything creative. It never overrides the
charter, the standard, or the operating rules.

### S4 — SPEC IT BEFORE YOU EDIT.

Write, in the tick notes, before touching a file:

```
SURFACE:      /[country]/[geo]/[industry]/[sub]
SECTION:      "What the owner keeps"
IN:           <what stays>
OUT:          <what is deleted, and where that information now lives, or that it dies>
REORDERED:    <before -> after>
WORD BUDGET:  <target from 01-DESIGN-STANDARD>
ELEMENTS:     <which existing kit components, by name>
TOKENS:       <which existing tokens, by name>
RISK:         <what could this break that is not in the diff>
```

The RISK line is not ceremony. The footer being unpainted for weeks, and 200
`/industries` routes rendering a 0px column, were both invisible in their diffs.

### S5 — IMPLEMENT.

- Tokens only. No raw hex, px or ms in components.
- Reuse the existing kit. `AtlasIcon`, `AtlasSpot`, trade icons, spine glyphs,
  `.atlas-card`, the `eng-*` family. A new component is a last resort and must be
  justified in the commit message.
- **Every wrapper you add gets a positioning context.** See the review gate R1.
- Checkpoint-commit if the unit takes more than one edit round. Charter §9.3.3:
  every agent that batched its work has lost some.

### S6 — COMPILE, THEN RENDER. In that order, always.

```bash
npx tailwindcss -i src/app/globals.css -o <scratch>/site.css --minify
```

**After** the file is written, never before. Tailwind emits only classes it can
see; a class written after the compile emits no rule and the element renders
unstyled while looking correct in source. This has cost this project twice.

Then render at **375, 768 and 1280**, reloading between each. Resizing without
reloading lies about height — measured, 12,282px versus 32,114px on the same
file.

Serve the scratch directory **and** `public/` over HTTP; `file:` is blocked and
`/spine/_skyline.jpeg` must resolve at the path the markup asks for.

### S7 — MEASURE AFTER. Same metrics, diffed.

Produce the before/after table. Every row that moved is evidence; every row that
did not move when you expected it to is a defect in either the change or the
instrument, and you must say which.

### S8 — THE REVIEW GATE. Run all nineteen. (§2 below.)

### S9 — VERIFY THE TREE.

```bash
npx tsc --noEmit
npm run prebuild
```

`tsc` clean; prebuild all gates passing with the count matching the chain, not
matching this document — **a gate count that reads low is how a missing gate
hides**. Deferred checks are reported as deferred and are NOT passes.

Under parallel agents both commands are tree-wide: before reporting a red gate,
check whether the failing file is yours. If it is not, say so and re-run rather
than "fixing" another agent's mid-write file.

### S10 — COMMIT.

Message states, in this order: **what was wrong** (with the S1 number), **what
changed**, **what was measured after** (with the S7 number), and **what this
measurement could not distinguish**. Never push.

### S11 — RECORD, so the next tick is not the same tick.

1. Move the backlog item to `DONE` in `06-BACKLOG.md` with the commit hash and
   the before/after numbers on one line.
2. If you learned a trap, append it to `05-ERROR-LEDGER.md`. A trap that cost you
   twenty minutes will cost the next agent twenty minutes.
3. If you found new work, add it to the backlog — **as an item, not as a fix you
   sneak into this tick.**

---

## 2. THE REVIEW GATE — nineteen checks, after every unit

Run these against the rendered output, not the source. Each is pass/fail with a
number. A unit that fails any check is not done.

**R1–R12 are the design checks. R14–R19 were added 2026-08-20** when the founder
put *site functionality* and *usability* in scope alongside design. The absence of
that half is not theoretical: with no functionality check in this gate, two forms
shipped that report `{ok:true}` to the reader and discard every submission,
because the tables they write to do not exist.

| # | Check | Failure condition | How |
|---|---|---|---|
| **R1** | **Paint** | any new wrapper computes `position: static` | `AtlasFrame` paints fixed layers at `z-index: 0`; CSS paints positioned z-index-0 descendants after in-flow ones, so a static element is **not drawn at all**. Not dimmed. Absent. |
| **R2** | **Three widths** | verified at only one | 375 / 768 / 1280, reload between. Three separate defects in this project existed at exactly one breakpoint. |
| **R3** | **Word budget** | band exceeds its budget in `01-DESIGN-STANDARD` | count `innerText` words |
| **R4** | **Contrast** | any text under its ratified minimum against its ACTUAL backdrop | measure the painted pixel behind it, not the token you think is behind it |
| **R5** | **Tokens** | any raw hex, px or ms in a component | `verify_hardcoded_hex` covers part of this; grep the diff for the rest |
| **R6** | **Palette** | any hue outside terracotta + cool neutrals | no green, no amber, no brown, no cream. A banned colour hides under a permitted NAME — this has happened four times |
| **R7** | **Type floor** | any computed size below the ratified floor | `getComputedStyle().fontSize` across every node in the section |
| **R8** | **Vocabulary** | a new icon, card, type step or motion pattern was invented | must reuse the kit; a new one needs a justification in the commit |
| **R9** | **Honesty** | a number appears that no module sources, or a self-omission was softened | read the module that produces the number |
| **R10** | **Overflow** | `scrollWidth > clientWidth` at 375 | the page body must never scroll horizontally |
| **R11** | **Verticality** | this created a second way to solve a problem an existing surface already solves | see `04-CONSOLIDATION.md`. The founder's rule: *"we only go vertically, never create 2 similar sister pages."* |
| **R12** | **Compile order** | the stylesheet was compiled before the file was written | if any measurement was impossible or read empty, assume this happened |

### R14–R19 — FUNCTIONALITY, HIERARCHY AND USABILITY

| # | Check | Failure condition | How |
|---|---|---|---|
| **R14** | **Keyboard** | an interactive element is unreachable by Tab, or reachable with no visible focus ring | walk the tab order. A focus ring removed by `outline: none` with nothing put back is the most common form of this |
| **R15** | **It works** | the control does not do the thing it says | **Verify in jsdom.** The browser preview pane has a 0x0 hidden viewport: `.focus()` does nothing, IntersectionObserver never fires, and every layout measurement reads zero. A control tested there reports working when it is not |
| **R16** | **Hierarchy** | the section has no single dominant element | measure the computed size ratio between the primary figure and the next-largest. The country `Scorecard` renders eight cells at equal weight and is the only page type with no hierarchy signal; do not add a second |
| **R17** | **Target size** | an interactive target is under 24x24 CSS px | WCAG 2.2 SC 2.5.8, measured on the rendered box, not the icon inside it |
| **R18** | **Dead ends** | an `href` resolves to a 404, or to nothing | enumerate hrefs from the rendered markup and resolve against the route table. **A crude path grep matches namesakes**: `scores/country_verdict` against `countries/country_verdict` produced a wrong count once already. Resolve by exact specifier |
| **R19** | **States** | empty, single-item, long-list and error were not rendered | render each deliberately. Sample content is the untested half of every primitive. **Do not count a self-omission as an empty state**: locally the data bands self-omit because cell lookups exceed a 4s budget to eu-west-1, and that absence is never a finding |

### R13 — THE ADVERSARIAL PASS. Not optional on design work.

After R1–R12 pass, dispatch a **fresh agent that did not make the change** with
this brief:

> Here is a rendered before and after and the diff. Your job is to REFUTE the
> claim that this is an improvement. Find what is worse, what is broken at a
> width that was not checked, what information was lost, and what the author's
> measurement could not distinguish. Default to "not proven" when uncertain.
> Return findings with a measured number each; a finding without a number is not
> a finding.

The author does not judge their own work. Two of this project's worst defects
survived because the person who made them was the person who checked them.

**Converge, do not grind.** An adversarial panel always finds one more nit —
that is its nature, and it is the reason a previous run of this project was
called "mediocre" after endless polishing. Ship when R1–R12 and R14–R19 pass and
the adversary finds nothing with a NUMBER attached. A nit without a measurement is
an opinion, and the founder is the judge of opinions, not the panel.

---

## 3. Parallel agents — the rules that are already paid for

The loop runs three or four specialists per tick in the SAME checkout, with
**non-overlapping file ownership declared up front**.

1. **NEVER `git stash`, `git checkout .`, or `git reset --hard`.** They are
   tree-wide, not file-wide. One agent stashed to isolate a typecheck and swept
   up two other agents' uncommitted work. To isolate, use a separate worktree.
2. **`tsc` and `prebuild` are tree-wide too.** A red gate may belong to another
   agent mid-write. Check whose file is failing before you report it.
3. **Checkpoint-commit.** Every agent that batched has lost work; every agent
   that checkpointed has kept all of it.
4. **Declare ownership in the dispatch.** Two agents must never be given the same
   file. If a change needs a shared file, one agent owns it and the other waits.
5. Keep prebuild concurrency at or below 4 on Windows; 6 segfaults intermittently.

---

## 4. Known traps, all previously paid for

- **Bash heredocs eat backslashes and break on nested code fences.** Use the
  Write tool for anything containing a regex or a fenced block.
- **The Bash CWD resets to `E:\atlas`** (the parent repo). Prefix every command
  with `cd /e/atlas/website &&` or you will inspect the wrong repository.
- **Playwright writes screenshots to `E:\atlas`**, not the website repo.
- **`scratchpad/` and `scripts/spikes/` are shared.** Clean up BY NAME; never
  remove the directory.
- **`$?` after a pipe reports the last command's status.** Use `${PIPESTATUS[0]}`.
- **The browser preview pane has a 0x0 hidden viewport**: `.focus()` does nothing,
  IntersectionObserver never fires, and every layout measurement is zero. Verify
  interactive behaviour in jsdom.
- **Data bands self-omit locally** because cell lookups exceed a 4s budget from
  this machine to eu-west-1. They render in production. **Do not "fix" this.**
- **`.mcp.json` is intentionally dirty.** Never commit it.
- **Comparing rounded display values invents defects.** Seven apparent take-home
  breaches were the money formatter abbreviating.

---

## 5. What a tick reports

Under ten lines, to the founder, in this shape:

```
TICK <n>  <surface>/<section>
WAS:      <the S2 sentence, with its number>
DID:      <the change, one line>
NOW:      <the S7 number>
BLIND:    <what the measurement could not distinguish>
CHECKS:   R1-R19 <n>/19 · tsc clean · prebuild N/N · adversary: <verdict>
GOAL:     <which criterion in 11-PRODUCTION-READINESS.md moved, or "none">
COMMIT:   <hash>
NEXT:     <the next backlog item>
```

Numbers over adjectives. The founder reads commit messages for the reasoning; the
tick report is the headline only.
