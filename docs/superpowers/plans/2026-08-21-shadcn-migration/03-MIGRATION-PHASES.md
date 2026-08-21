# 03 — THE PHASES. Ordered by blast radius, smallest first.

Seven phases. Each ends with something rendered and looked at, and each is
independently abandonable: stopping after any phase leaves the site working.

**Ordering principle:** delete before you migrate, migrate mechanism before
appearance, and do the thing that fixes a known reader-visible defect before the
thing that only tidies code.

---

## PHASE 0 — Make verification possible. **Do this first or nothing else is checkable.**

**The problem, measured this session.** The screenshot instrument this project
relies on renders routes with `react-dom/server` into a static file and serves
it. **Client components do not run.** recharts measures the DOM, so every chart
in this migration renders EMPTY under that harness, by construction. The bar
chart built on 2026-08-21 could not be verified for exactly this reason.

Worse: the Playwright MCP, which `docs/verification-protocol.md` names as the
sanctioned instrument, **disconnected mid-session and did not come back**.

**Also measured:** the dev server takes **67 seconds** to serve the homepage on
this machine, which has 8GB total and was down to **777MB free** with the
founder's own applications running. This is not a reliable verification
environment as it stands.

**Deliverables:**

1. A hydrated-page screenshot path that works. Options, in order of preference:
   - the Browser pane against `preview_start` (worked this session; `navigate`
     to a localhost path was denied but `preview_start {url}` succeeded)
   - Playwright MCP, if it reconnects
   - a Puppeteer script in `scripts/`, owned by this repo and dependent on
     nothing external
2. Write down which one is authoritative, in `docs/verification-protocol.md`.
3. A note on the memory constraint, so the next session does not re-discover it.

**Do not start Phase 1 until a chart can be photographed.**

---

## PHASE 1 — RETIRE. Delete before migrating.

Every component deleted here is one that never needs migrating.

| Target | Count |
|---|---|
| graphics that mount nowhere (G34) | ~30 |
| graphics reachable only from `_design`, which has no URL | 9 |
| gauges permanently fed `notHeld()` | 3 |
| the `meaningStep` ladder (G17), which `FootingLegend` prints to the reader as its own key | 1 |

**Method:** build the render graph, not a registry. A grep for the component
name finds comments and stories, not call sites.

**Verification:** the site renders identically. This phase is invisible to a
reader by definition, and if it is not, something was not actually dead.

**Gate:** a `verify_no_orphan_components` ratchet.

---

## PHASE 2 — TABLES. Highest reader value, lowest risk.

**Why first among the real work:** it fixes measured accessibility failures, it
touches no numbers, and a table is the most mechanical swap there is.

**Measured today:** 13 files hold a `<table>` with **no `scope` attribute at
all**. **No table anywhere has a sticky header.** The house tabular-figures rule
is used **zero times**, including in `Money.tsx`, whose entire job is printing
money.

**Work:**
1. `npx shadcn@latest add table`
2. Build one `AtlasTable` on it: `scope` on every header, right-aligned numeric
   columns **with** tabular figures (half the rule is useless without the other
   half), sticky header where the table is taller than the screen, horizontal
   scroll inside its own container so the page body never scrolls sideways.
3. Converge `AtlasTable`, `ComparisonTable`, `SortableFactsTable`, `CompareTable`
   onto it.
4. Sweep the 13 files.

**Content rule:** same columns, same rows, same figures, same order. If a column
looks wrong, that is a finding for the founder, not a fix to make in passing.

---

## PHASE 3 — INTERACTION. Radix is installed and unused.

`accordion`, `separator`, `slot`, `tabs` and `tooltip` are already dependencies
and nothing imports four of them.

| Swap | Fixes |
|---|---|
| 13 bespoke switchers to `ui/tabs` / `ui/toggle-group` | keyboard nav, ARIA, focus |
| bespoke tooltips to `ui/tooltip` | escape and focus handling |
| `InlineDisclosure` / `Expand` to `ui/collapsible` | |
| **the currency switcher** to `ui/select` or `ui/toggle-group` | **the 11px horizontal overflow at 375 on the trade page**, measured in Phase 0 of the previous plan: a label plus six pills on one unwrapped line |
| `CompareTray` to `ui/sheet` | |
| search to `ui/command` | |

**Start with the currency switcher.** It is the only item in this phase with a
defect a reader can feel today.

---

## PHASE 4 — CHARTS, part one: the bar family.

The largest and most defect-ridden area. `AtlasBarChart` already exists
(2026-08-21) and is **unverified** pending Phase 0.

**Order within the phase:**
1. Verify `AtlasBarChart` renders. It has a known-fixed bug already (per-bar
   colour needs `Cell`, not a nested `Bar`, which typechecks fine and would draw
   a second series over the first).
2. Migrate the 5 month-of-year charts. They disagree on baseline today; one
   implementation ends that.
3. Migrate `MiniBar`, `IndexBar`, `StackBar`, `ShareStack`, `RankBars`,
   `ComparisonBars`.
4. Converge the 3 `Waterfall`s and `SteppedWaterfall` to one.

**Blocked, needs a founder ruling before it starts:** the **6 percentile
charts**, two of which are **logarithmic**. Converging them means choosing an
axis, and a log axis is a claim about how a reader should read a spread. That is
a design decision, not a migration decision.

---

## PHASE 5 — CHARTS, part two: everything else.

| Work | Note |
|---|---|
| 9 gauge geometries to one `RadialBarChart` | eight of nine disappear |
| `Donut` to recharts `PieChart` | the hard 5-slice cap and the "Other" roll-up must be re-implemented |
| `Spark` to a tiny `AreaChart` | |
| KEEP and leave alone | `SurvivalCurve` + `StruckLine`, `SpectraTable`, `Dots`, `Timeline`, `PhaseBar`, `CountryShape`, `CompassRosette`, `ContourField` |

---

## PHASE 6 — FORMS, and the door to accounts.

Every form on the site is hand-rolled. `ui/form` + `ui/input` + `ui/label`
(react-hook-form + zod) replaces them.

**This phase does NOT build sign-in.** Accounts and the paid tier are a separate
plan the founder has already asked for. This phase only ensures that when that
plan starts, the form substrate is shadcn and not another bespoke layer.

**A live item to respect, not to fix here:** the newsletter and correction forms
both report success and discard the submission, because their tables were never
created. That is a database migration the founder runs, and he has already ruled
it low priority. **A form migration must not make it look fixed when it is not.**

---

## PHASE 7 — BLOCKS. The part actually paid for.

Only after the primitives are in and the skin contract is proven.

1. Get the shadcnblocks catalogue. The MCP's `list_blocks` returned a GitHub API
   error this session; individual `get_component` calls worked. If the listing
   stays broken, browse the site with the licence.
2. Shortlist blocks for surfaces the site genuinely lacks a good version of:
   pricing, FAQ, feature grids, footers, the auth screens Phase 6 anticipates.
3. **Every block is re-skinned on arrival**, per `02-SKIN-CONTRACT.md` section 4.
   A block ships with a hero gradient, a legend, a testimonial wall and a
   "Trending up" footer. None of that lands.
4. **A block may not introduce a claim.** If a pricing block has three tiers and
   the site has two, the block gets two. The content does not bend to the block.

---

## Sequencing summary

```
0  verification path        BLOCKING, nothing is checkable without it
1  retire dead components   invisible to readers, shrinks everything downstream
2  tables                   fixes measured accessibility defects
3  interaction              fixes the 375 overflow
4  charts, bars             the biggest defect cluster   [1 founder ruling needed]
5  charts, the rest         nine gauges become one
6  forms                    substrate for the accounts plan
7  blocks                   the purchase, used
```

**Founder gates:** after Phase 0 (does the instrument work), after Phase 2 (does
a migrated table look right), after Phase 4 (do the charts look right), and
before Phase 7 (which blocks).
