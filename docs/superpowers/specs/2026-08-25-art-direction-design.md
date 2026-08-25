# Art direction, 2026-08-25 , where it lives and what happened

**The document itself is `E:\atlas\design\ART-DIRECTION.md`, in the PARENT
repository, beside the Design Rulebook it extends.** This file exists because the
loop prompt names this path, and a pointer that resolves beats a path that does
not.

It is in the parent repo on purpose: the Rulebook, the Form Catalog, the Operating
Model and the founder's verdict corpus are all there, and an art direction that
lives away from the rules it extends is an art direction nobody reads beside them.

---

## What it is

Twelve sections saying how a section is composed. The Rulebook says what is
forbidden; this says what is built.

- **A** section anatomy, six ordered slots
- **B** where a number sits, four cases
- **C** where colour is used
- **D** page rhythm: one hero, one terminus, five splits, no band repeating its
  neighbour, a spacing ladder
- **E** density, two measured budgets that pull against each other
- **F** table conventions
- **G** chart conventions
- **H** relevance and anti-slop
- **I** the fourteen mistakes, named, every one something that actually happened
  on these pages
- **J** which rules are gated and which are judgment, WITH THE REASON for every
  judgment one
- **K** the per-page checklist
- **L** the per-section checklist

## Where it came from

Every rule descends from something the founder said on 2026-08-25, and his words
are carried verbatim at the top of the document rather than paraphrased. Two
further ratifications came from direct questions the same day: a wrong visual
form may be REPLACED rather than tidied, and the pages run a strict grammar with
two or three crafted moments.

## What it changed, measured

| | Before | After |
|---|---|---|
| Sections running the full column | 28 of 39 | 0 |
| Places where text is drawn on text | 2 | 0 |
| Chapters with nothing under them, all 15 real pages | 3 | 0 |
| Figures that stack without tabular numerals | 25 | 7 |
| Bands repeating their neighbour's split | 2 | 0 |
| Rungs of the spacing ladder sharing one number | 3 of 4 | 0 |
| Elements carrying the ratified frosted treatment | 0 | every card |
| Art-direction rules held by a gate | 0 | 14 of 55 |

## The honest part

**Roughly half the fall in the finding count was measurement corrections, not
pages improving.** Six times in one day a gate disagreed with the picture and the
gate was the thing at fault: it counted inset stat panels as nested sections,
counted invisible accessibility labels as text at the top of the page, counted a
card's own padding as emptiness, counted three DOM nodes as three accent marks
when they were one, read a split out of a conditional CSS variant, and enforced a
page accent budget that was simply a number I invented. Each is written into the
gate that made it and into the commit that fixed it.

Two rules in the document were wrong and were corrected in place with the reason,
before any page was changed to satisfy the wrong version: the accent budget
contradicted the colour rule, and the prose budget would have cut the only human
voice on a page of figures.

## The state to resume from

- Ledger: `E:\atlas\website\.superpowers\sdd\progress.md`
- Correction plan: `docs/superpowers/plans/2026-08-25-london-four-pages-correction.md`
- One file for the founder: `E:\atlas\design\PAGE-SHEET-2026-08-25.html`
- Gated, 14 of 55: A5 C2 C4 D1 D3 D6 E1 E2 E3 F1 G6 G7 H3 H4, plus the frost
  floor, which is not a lettered rule. Section J of the art direction carries
  this table and was re-checked against the gates on 2026-08-25 by extracting
  the rule id from every finding each gate can emit. It matched. The two claims
  that did not match it were this document's and the founder sheet's.
- Still ungated and named in section J with the reason: D7 top alignment,
  C6 tint not colour, F2 to F8 the rest of the table conventions.
