# 00 — MASTER PLAN, 2026-08-19

> **What this is.** The design and architecture programme for marginatlas.com,
> grounded in external research conducted 2026-08-19 and in a full internal audit
> of what the repo actually is. It is the *content* the unattended loop works on.
>
> **What this is NOT.** It is not a second loop. `docs/loop/` already owns the
> tick mechanics — the rotation, the operating rules, the subagent doctrine,
> `STATE.md`, `WAKE-UP.md`, `DECISIONS-NEEDED.md`. **This plan plugs into that
> system.** Building a parallel loop beside it would be the exact duplication the
> founder banned on 2026-08-19, applied to our own documents.

---

## 1. Authority order. Read it as a stack.

1. **A direct message from the founder.** Overrides everything, including this.
2. **`docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`** —
   his own quoted words. The background, the palette, cream, the H1, cohesion,
   the verification cadence, the paint rule.
3. **`docs/loop/00-OPERATING-RULES.md`** — the invariants that bind every tick.
4. **This plan** — what to work on, and to what standard.
5. **An agent's judgement.** Last.

---

## 2. The goal, and the three rulings that shape it

**Goal:** a homepage the founder wakes up to and thinks is perfect, and the same
design carried across every page type.

**2026-08-19 rulings, new, quoted:**

> *"we only go vertically, so never create 2 similar sister pages, we are
> clearing design and sections now"*

> *"The design, the visual hierarchy, the functionality of the elements is the
> main priority. Like, the site is not being visited by anyone, so you have to
> give this in mind."*

Three consequences:

1. **No new surfaces.** Deepen what exists. Where two surfaces overlap, converge.
   See `04-CONSOLIDATION.md`. **In this repo's own vocabulary, say "duplicate
   surface", never "sister page"** — the repo already uses "sister page" to mean
   the opposite.
2. **Design is the priority, and the research says that is correct.** Fogg 2003
   (N=2,684): design look drives **46.1%** of credibility judgements; accuracy of
   information, **14.3%**. For a numbers product, presentation *is* the proof for
   most readers.
3. **No traffic means no regression risk, so be bold.** The risk here is a
   mediocre-looking product, not a broken one.

---

## 3. The files

| File | What it holds |
|---|---|
| **`01-DESIGN-STANDARD.md`** | The ratified standard: word budgets, the honesty-as-material finding, the 25 ranked rules, form, the homepage band order |
| **`02-PAGE-DOSSIERS.md`** | Per surface: what it renders now, what it should render, what to cut |
| **`03-PROCEDURE.md`** | The eleven steps for one unit of work, and the 13-check review gate |
| **`04-CONSOLIDATION.md`** | The verticality doctrine and the six measured duplicate surfaces |
| **`05-ERROR-LEDGER.md`** | Everything already paid for, indexed by what you are about to do |
| **`06-BACKLOG.md`** | The ordered queue. **The loop takes the top unblocked item and updates it.** |

**Research annexes** (`docs/superpowers/research/`, 2026-08-19):

| File | Scope |
|---|---|
| `...-homepage-architecture-and-psychology.md` | 18 homepages fetched, 12 design systems mined, 11 psychology mechanisms with evidence quality, a folklore register |
| `...-ui-ux-guidelines.md` | 262 rules, 182 mechanically checkable, 113 sources, 13 documented source disagreements |
| `...-reference-page-architecture.md` | How the best data/reference/entity pages are structured |
| `...-internal-state-audit.md` | 102 routes, section counts, measured duplicates, gate-coverage gaps |

---

## 4. The tracks, in priority order

**P0 — repair the instruments.** The audit found ten design gates scanning
`dev/` bodies no reader can reach, a chrome gate that passes on a comment, a
section-order gate resolving one id against a 22-item list, and a contrast gate
measuring a surface that never renders. **Improving the homepage while the gates
measure the workshop buys no protection.** Cheap, and it makes everything after
it trustworthy.

**P1 — the homepage.** 11 bands / 764 words → 10 bands / 615 words. Start with
section padding: editorial rhythm is 32–64px against our SaaS-scale, and that one
dial removes about a third of the page height **without deleting a word**. Then
build band 7, "How a number is made" — the moat, because no competitor publishes
what is held versus modelled versus extrapolated, nor the 48,114 estimates
deliberately not ingested.

**P2 — converge the duplicate surfaces.** Six are measured, not guessed. Redirect,
never delete; `/browse` → `/world` is the first-party precedent.

**P3 — correctness and dead weight.** Seven country sections that can never
render. The headline recommender not wired to its own page.

**P4 — cohesion.** 7 widths, 4 card systems, 3 body scales, 3 terracottas, 2 font
pairs, 4 icon systems. Ungated entirely today.

**P5 — responsive and accessibility.** The 320px width is never checked, and it
is the width WCAG reflow is specified at.

---

## 5. How a tick picks its work

1. Finish a dirty tree.
2. Repair a red chain.
3. Finish an in-flight item in `STATE.md`.
4. Obey a founder message.
5. Otherwise: **the top unblocked item in `06-BACKLOG.md`.**

Then run `03-PROCEDURE.md` end to end: measure, diagnose with a number, consult
the standard, spec it, implement, compile-then-render, measure again, run the
13-check review gate, verify the tree, commit, record.

---

## 6. The five things most likely to go wrong

1. **Working from a registry instead of a render.** `PAGE_SECTION_ORDER` lists 7
   cell sections; the cell page renders **34**. An earlier pass at this plan drew
   the wrong conclusion from exactly that. **Render and count.**
2. **Trusting a green gate.** Several gates in this chain have been measured
   lying. A pass is evidence the gate ran, not that the site is correct.
3. **Cutting sections when the instruction was to cut words.** Section membership
   and order are gated contracts and the charter forbids dropping an agreed
   section. "Cut text" means fewer words inside a section, and prose replaced by
   elements.
4. **Grinding.** An adversarial panel always finds one more nit; a previous run of
   this project was called *"mediocre"* after exactly that. Converge and ship.
5. **Duplicating.** Including in the documents. If something already exists, extend
   it.
