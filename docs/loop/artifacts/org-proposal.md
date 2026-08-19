# Org proposal, 2026-08-19

Step `02-ORGANISATION-RESEARCH.md` procedure 4, 5 and 6. **One** target tree, and
a numbered list of independently executable moves ordered by value divided by
blast radius. `06-REFORMATION.md` executes from this list, top first, one per tick.

Inputs: `org-map-2026-08-19.md` (what exists), `research/2026-08-19-docs-organisation.md`
(20 pages, 17 projects), `contradictions-2026-08-19.md` (the stated-number census).

---

## 1. The headline recommendation, and it is a refusal

**Do not restructure the tree.** No mass move of `docs/`, no new top-level
taxonomy, no migration of 358 markdown files.

That refusal is the finding, not an absence of one. Three reasons, each measured:

1. **The pricing says a big move is the expensive half.** Of the 78 June plans,
   **55 are referenced** by other tracked files. A bulk archive repoints 55 files
   to save a reader from scrolling. The **21 unreferenced** ones cost nothing, and
   that is where a move earns its keep.
2. **The sources disagree about layout and agree about mechanism.** Google
   docguide wants docs next to the code; Diátaxis wants a type-first hierarchy.
   They reconcile *only* if the root file is a pure index. Meanwhile lychee, Vale,
   cog and tfplugindocs all point one way: **make the document unable to be wrong,
   rather than moving it somewhere tidier.** Layout is contested; automation is not.
3. **The counter-example kills the tidy answer.** Kubernetes puts status in a
   machine-readable `kep.yaml`, and its own README lists metadata presubmit checks
   as an improvement it still *wants*. **`status: implemented` in YAML lies exactly
   as easily as a sentence in prose.** A data file buys one location and
   parseability. It does not buy truth. Only a check that compares the field to
   the thing it describes buys truth.

**So the target tree is the tree we have, plus three properties it currently
lacks:** counts that are generated, an entry point that names rather than
restates, and records that carry a status.

---

## 2. The four questions, answered for this repo

| Question | Answer here | Source |
|---|---|---|
| Where does a **RULE** live, so it exists exactly once? | One file per topic, and **`CLAUDE.md` may NAME an authority but must never RESTATE it.** Everything else links. | Google docguide "duplication is evil, link instead"; GitHub's first-found-wins search path makes a stale second copy inert rather than competing |
| Where does a **RECORD** live, so history is legible and never mistaken for a rule? | A dated, append-only file that is **immutable except for one status line**. `docs/handoff/` is already this shape and needs only the status line. | Nygard, Rust RFCs, adr-tools, MADR, Keep a Changelog — five sources that do not cite each other converging on one shape |
| Where does **STATE** live, so "what is true right now" has one file? | `docs/loop/STATE.md`, which already does this. **Do not move it into YAML.** | The Kubernetes counter-example above |
| What makes a document **stale on its own**? | A generated block plus a `--check` in the prebuild chain. Nothing softer works. | cog `--check` / `--diff` / `--check-fail-msg`; tfplugindocs generate-from-schema |

**The one thing none of the four mechanisms can do:** detect a document that is
fluently *wrong*. lychee finds dead links, Vale finds banned prose, cog finds a
stale generated block. A paragraph that confidently describes a design decision
we reversed passes all four. Only regenerate-and-diff makes a wrong **value**
structurally impossible, and only for values that can be generated.

---

## 3. The moves, ordered by value / blast radius

### M1 — Generate every stated count. **Rank 1.**

**Why first:** four documents state the gate count at four different values (95,
31, 101, 102). It is the defect class the whole step exists to attack, and it is
the only move that makes a recurrence impossible rather than merely corrected.

- **Shape:** cog's, adapted. cog is Python and this chain is Node, so a short
  `tsx` equivalent gives the identical guarantee. **Copy `--check-fail-msg`
  exactly** — the failure must tell the reader the command that fixes it.
- One script prints the counts (gates, tracked files, routes, docs). Every
  document that states one carries a marked block instead. A `--check` gate fails
  the chain when a block is stale.
- **Blast radius: 1 new script + 1 new gate + 5 documents** — `CLAUDE.md`,
  `docs/verification-protocol.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`,
  `docs/loop/STATE.md`, `docs/loop/PROMPT.md`.
- **References to repoint: 0. Redirect needed: none.**
- **After this, no document states a number; it only carries one, and a stale
  carrier turns the chain red.**

### M2 — `CLAUDE.md` becomes a pure index. **Rank 2.**

**Why:** it is the file every session reads first, and it currently routes
attention to `docs/design-system/GUIDELINES.md` (last committed **2026-05-28**)
and `docs/architecture/README.md` (**2026-05-27**, 1 file). Worse, it restates
rules rather than naming them, so it competes with the authorities instead of
pointing at them.

- Name authorities; restate nothing. Every "read these first" entry becomes a link
  with a one-line reason and no content.
- **Blast radius: 1 file.** Nothing links into `CLAUDE.md`'s sections, so there is
  nothing to repoint.
- **Gates affected: none.** **Redirect needed: none.**

### M3 — Supersede `docs/design-system`. **Rank 3.**

**Why:** `TOKENS.md` carries **25 references to moss, amber, teal and cream** —
ramps deleted 2026-08-17 and now enforced against by `verify_palette_membership`
and `verify_no_cream`. This is not a stale document, it is a document the chain
actively contradicts, reached through the prescribed reading order.

- **Do NOT delete.** 17 files reference it, including live code
  (`src/app/_design/page.tsx` links `TOKENS.md`, `PLAN.md`, `INVENTORY.md`).
- Add a superseded banner to each of the 4 files naming the live authority, in the
  Nygard shape: keep the record, mark it, never edit it away.
- **Blast radius: 4 files edited, 0 references repointed.**
- Same treatment for `docs/architecture/README.md` (**4 referrers**), which is a
  separate, smaller move.

### M4 — Give every superseded record a status line. **Rank 4.**

**Why:** `docs/handoff/` holds 33 records and `CLAUDE.md` promotes one to a rule
with "READ IT FIRST", naming the 2026-08-01 file while 2026-08-18 exists. The
research is unambiguous that this is the record shape's missing field, not merely
a bad pointer: **a record promoted to a rule goes stale the moment the next record
lands**, which for handoffs is every session.

- One status line per superseded handoff, in MADR's enumerated form
  (`superseded by <file>`). `INDEX.md` becomes generated by M1's script.
- **Blast radius: 33 files, one added line each. 0 references break** — adding a
  line breaks nothing.
- Note the partial cure already present: `INDEX.md` exists; the entry point
  bypasses it by hardcoding a filename. M2 removes the hardcoding, M4 makes the
  index true.

### M5 — Archive the 21 unreferenced June plans. **Rank 5.**

- **Blast radius: 21 file moves, 0 references to repoint** (measured, not assumed).
- Move to `docs/superpowers/plans/archive/`, leave the directory listing as the
  pointer. **Archive, never delete** — a file map cannot distinguish an unread
  document from a relied-upon one.

### M6 — Status lines for the 55 referenced June plans. **Rank 6.**

- **Blast radius: 55 files, one line each.** Same value per file as M4 at nearly
  double the cost, which is why it sorts below it.

### M7 — Root-level markdown. **Rank last: BLOCKED ON PRICING.**

`PLAN_V3.md` and `PLAN_V4.md` sit side by side; so do `DESIGN.md`,
`DESIGN_STATE.md` and `BRAND.md`, plus two files that are research *prompts*
rather than research. This is the clearest rule-versus-record confusion in the
repo.

**It does not get a rank because it does not yet have a blast-radius number, and
the step's own instruction is that a move without one does not get executed.**
Price it first: reference counts per root file, then re-sort it into this list.

---

## 4. What this proposal is betting, and how it could be wrong

**The bet:** automation transfers to this repo and social process does not. Every
social mechanism found in the research — CODEOWNERS, required review,
block-the-merge — assumes a second party at the review step. This repo has one
operator and a fleet of agents.

**Why that is weaker evidence than it looks:** it is a **selection effect from
this repo's shape**, not a neutral finding about what works. The sources were read
looking for what survives without a reviewer, and unsurprisingly the automated
mechanisms are what came back.

**The other honest limit:** published practice is what a project *says* it does.
Not one source is evidence the policy held over years, and Kubernetes is the
in-sample tell — its machine-readable status field ran unvalidated while the
document describing it reads as settled. We are copying documented intentions.

**Three fetches failed and are excluded rather than guessed:**
`diataxis.fr/complex-hierarchies/` returned 404, so Diátaxis on *large*
hierarchies is absent from the reasoning above; the docdecay page returned no
content, so time-decay is not proposed; `vale.sh/docs` 301'd and was refetched at
`docs.vale.sh`.

---

## 5. Done test for this step

- [x] One proposal, not three.
- [x] Every ranked move carries a blast-radius number. M7 is explicitly unranked
      **because** it does not.
- [ ] Every contradiction found is fixed or listed — the gate count in
      `02-ORGANISATION-RESEARCH.md` was fixed in-tick (`edfab3ab`); the remainder
      is `contradictions-2026-08-19.md`, and M1 is the move that retires the
      class.
