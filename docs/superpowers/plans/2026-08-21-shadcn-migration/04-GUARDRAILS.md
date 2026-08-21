# 04 — GUARDRAILS. Structure adapts. Substance does not.

The founder's constraint on this whole migration:

> *"this is a new design thing. The replacement of elements should not impose
> changes on the content unless they were all due to be changed beforehand."*

**AMENDED 2026-08-21, by the founder, and the amendment reverses this file's
original position.** His words:

> *"due to the fact that these components are proven and tested, you should
> really think whether we should remove the subtitles and their parts. The
> tendency should be to switch to suit the content that we have according to the
> structure of the new components."*

The first draft of this file said: a shadcn component invites content the
bespoke one did not have, so **decline the invitation**. That was wrong, and it
was wrong in a way that would have quietly rebuilt the bespoke problem, because
fighting a proven component's structure at every call site is how you end up
maintaining a fork of it.

**The rule is now the other way round: the component's STRUCTURE wins, and the
content is arranged to fit it.** What may never change is the SUBSTANCE.

## 1. The rule, stated three ways

**Plainly:** the component's structure decides the ARRANGEMENT. The site decides
the SUBSTANCE. A migration may reshape how content is laid out; it may not add a
claim, drop a figure, or change what a number says.

**Operationally, and this is the line that matters:**

| May change | May never change |
|---|---|
| which slot a string sits in | the set of figures, and their values |
| whether a heading and its line are one block or two | a claim the site makes |
| the order of elements within a section | which sections exist (that is a gated contract) |
| a subtitle being dropped where the component has no slot for it | a figure gaining or losing precision |
| a subtitle being kept where the component has one | anything a reader could act on |

**On subtitles specifically, since he raised them.** Rulebook rule 14 already
says a subtitle never delivers a verdict and **most should not exist**. So where
a component has no description slot, the subtitle goes and that is an
improvement, not a loss. Where a component has one, it may be used, but it may
not be FILLED with something invented to justify the slot. **An empty slot is
fine. A slot filled with a verdict is the thing rule 14 forbids.**

**The exception, and its limit:** where a prior ratified decision had already
scheduled a content change, that change proceeds, named with its date and its
ruling in the commit. "It seemed better" is not a ratified decision.

## 2. THE CONTENT DIFF. The gate this migration lives or dies by.

Before touching a surface, capture what it says. After, capture it again.
Compare.

**`scripts/verify_content_unchanged.ts`, to build in Phase 0:**

1. Render the route with the existing server-render harness.
2. Extract two sets:
   - **strings**: every text node, trimmed, whitespace-collapsed
   - **figures**: every numeric token, with its unit and prefix
3. Write them to `data/content-snapshots/<route>.json`.
4. On a later run, diff **as SETS, not as sequences**, because the founder's
   amendment explicitly permits rearrangement:
   - **figures**: any added, removed or altered figure **fails**. Hard.
   - **strings**: any REMOVED string is reported for review, not auto-failed,
     because dropping a subtitle a component has no slot for is now sanctioned.
     Any ADDED string **fails**: that is a claim nobody ratified.
   - reordering alone: passes silently.

**Why the asymmetry.** Losing a sentence is a judgement call the amendment now
allows and a human should glance at. Gaining one is how an invented verdict
enters the site, which is the defect class this whole effort exists to remove.

**Why strings AND figures separately:** a figure that changes from `$86,000` to
`$86000` is a formatting change and a string diff would flag it, correctly. A
figure that changes from `$86,000` to `$92,000` is a content change wearing a
formatting change's clothes, and only a numeric comparison catches it.

**This gate has to exist before Phase 2**, not after. A content diff written
after the migration proves nothing about the migration.

---

## 3. Standing gates that already run. All must stay green.

The chain is at **112**. It grew from 105 today. It counts up only.

| Gate | Guards |
|---|---|
| `verify_type_ladder` | off-ladder sizes may only shrink. **An import that adds one fails the build** |
| `width-discipline` | fixed-width caps shrink; phone-blind `sm:` pairings shrink; real reading measures may only GROW |
| `verify_palette_membership`, `verify_no_cream` | no banned hue, no cream |
| `verify_no_em_dashes`, `verify_no_source_agencies` | copy constraints |
| `verify_hardcoded_hex` | tokens only in components |
| `a11y-static` | hard zero across 697 files |
| `verify_section_order` | section membership is a contract |
| `verify_sample_tags` | **see the note below; this one is disputed** |
| `scope-rules`, `retired-activities`, `activity-merges`, `presence-threshold` | today's taxonomy work |

**A live contradiction to settle, not to inherit blindly.** `DESIGN-RULEBOOK`
rules 4 and 4A make a visible "sample" badge mandatory on modelled figures and
call an unmarked one *the worst defect in the system*. The founder's ADR of
2026-08-20 rules the **opposite**: no visible mark on a Figure, marks only on a
Band whose shape is invented. The August ruling is newer and wins by the
rulebook's own tiebreak, the July text was never edited to say so, and
`verify_sample_tags` still enforces the retired rule. It currently scans only
workshop routes, so no reader is affected. **Do not let a migration quietly pick
a side.**

---

## 4. Verification per phase

**Every phase, before it is called done:**

```bash
cd /e/atlas/website
npx tsc --noEmit          # silent
npm run prebuild:serial   # at the carried count or higher, exit 0
```

**Plus, for anything a reader can see:** rendered and photographed at **1280 and
375**, reloading between widths, because a bare resize lies about height (12,282
against 32,114 on the same file, measured).

**And the thing this migration specifically breaks:** the server-render harness
**cannot photograph a client component**. recharts draws nothing under it. Phase
0 exists to fix that. Until it is fixed, a chart is unverified, and unverified
must be said out loud rather than rounded up to done.

---

## 5. Traps this repo has already paid for

Each of these has cost real time. They are not hypothetical.

| Trap | The rule |
|---|---|
| `shadcn add --overwrite` clobbered the customised `card.tsx` | **never `--overwrite`.** Add without it and merge by hand |
| Nested `<Bar>` for per-bar colour **typechecks fine** and draws a second series | recharts types children loosely. Per-datum styling is `<Cell>`. A typecheck is not a render |
| `.av2, .av2 * { padding: 0 }` beats every Tailwind padding class, at (0,1,1) against (0,1,0) | inside the spine scope, padding must be inline. Cost twice in one hour today |
| `SpectraTable` takes `rows: any[]` | a wrong prop shape rendered a blank grey bar and **compiled clean**. Map at the boundary, and prefer typed props on anything new |
| Tailwind emits only classes it can SEE | compile the stylesheet **after** writing the file, never before. Cost twice historically |
| `globals.css` does not `@import` `atlas-spine.css` | a fixture without it has zero `.av2` rules and every spine measurement is wrong |
| `ch` is the width of "0", not `fontSize x 0.5` | measure the real character width. Measured: 10.61px against a naive 10.8 at 18px Geist |
| `var()` naming an unset property with no fallback voids the whole declaration | an unstyled shadcn component usually means a missing token |
| A `position: static` element is **not drawn at all** on this site | the fixed photograph paints over it. Every card must be `relative` |
| `git stash` / `checkout .` / `reset --hard` | all tree-wide. Banned |
| Bash heredocs eat backslashes | use the Write tool for anything with a regex. Cost twice today |

---

## 6. What the founder sees, and how

His ratified review format: **one file he opens.** Before and after, full length,
desktop and phone. Not a dev server, not a thumbnail.

`scripts/build_compare.mjs` does this and is gated. Images embed as data URIs so
the file survives being moved or sent to a phone.

**Report to him about the SITE, never about the code.** No file paths, no
function names, no line numbers. He has said this twice.

---

## 7. Never

- push, deploy, or run `npm run build`
- raise a ratchet baseline to make it pass
- fabricate a figure
- touch the homepage H1
- rename a URL slug
- introduce a second accent hue
- let a component's default content become the site's content
