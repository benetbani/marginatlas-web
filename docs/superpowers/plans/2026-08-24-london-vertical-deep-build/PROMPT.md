# The paste-in prompt

Paste the fenced block below into a session. It is self-contained.

---

```
You are taking the FOUR LONDON PAGES from roughly a fifth of their intended
richness to matching or beating it. Work in E:\atlas\website. The parent E:\atlas
holds the rules and the baselines.

ONE VERTICAL: LONDON / UK. ONE SECTION PER ITERATION. Never two pages at once.

=== READ FIRST, IN FULL, BEFORE ANY CODE ===
E:\atlas\rules\DESIGN-RULEBOOK.md      the law. Cite it by number in every commit.
E:\atlas\rules\OPERATING-MODEL.md      roles, the registry, the lock rule
E:\atlas\rules\REVIEW-CYCLE.md         never skip a step
E:\atlas\rules\FORM-CATALOG.md         visual forms come from here, nowhere else
E:\atlas\rules\FOUNDER-VERDICTS.md     his documented verdict history
docs/superpowers/plans/2026-08-24-london-vertical-deep-build.md   the plan

=== WHY THIS EXISTS ===
The pages thinned to about a fifth of the July-3 baseline, one self-omitting
section at a time, and nothing noticed because every individual omission was
correct behaviour. Measured, both sides, in a real browser inside the real shell:

  city    11,077 chars / 9 headings -> 1,936 / 6 chapters
  trade    7,662 / 6                ->  1,756 / 4
  across   9,091 / 8                ->  2,013 / 7
  hood     7,048 / 5                ->  2,987 / 3

21 of 49 section titles reach no reader on any of fifteen real pages.

THE WORK IS SMALLER THAN IT LOOKS. The adapters already carry the data. The trade
adapter hands over FOURTEEN blocks and its page renders four chapters. Every
neighbourhood district carries fifteen fields INCLUDING COORDINATES, so the map
that self-omits for want of them can draw. This is a CONNECTION project, not a
collection project.

=== THE FOUR RULES THIS EXISTS TO STOP BREAKING ===
§42 ONE VERTICAL. London only. A shared file may change when a London section
    needs it; measure the blast radius on every other page before it lands.
§43 INVENTORY-DRIVEN. Every page starts with a section inventory. No code is
    written for a page before its inventory exists. File-by-file sweeps are the
    forbidden method and they are what produced this.
§3  REPLACE, DO NOT DELETE. A figure with no source gets a knowable neighbour
    that answers a similar decision. Deleting needs §41's two grounds and nothing
    else. §2: "a page of dashes is a failure, not a virtue."
§48 THE REVIEW CYCLE, EVERY TIME. Re-render the same session, diff the approved
    crops, run the panel, then the founder.

=== PAGE ORDER, FIXED ===
1. city         furthest from the baseline
2. trade        the product
3. neighbourhood  third despite being closest: its coordinates unlock the map,
                  the single biggest visual win in the vertical
4. trade across places

Finish a page and get it approved before starting the next.

=== THE ITERATION ===

1. INVENTORY, once per page, before any code.
   List what the page CAN render:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/sweep_dead_sections.tsx
   List what it DOES render:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
   List what the adapter CARRIES but the page ignores:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/probe_adapter_pool.tsx
   OPEN THE JULY-3 BASELINE AND READ IT: E:\atlas\{CITY,CELL,HOOD,INDUSTRY}-PREVIEW.html
   Every section in it the page does not render is a regression with a name. This
   step was skipped for six weeks and is the reason for all of the above.

   Write E:\atlas\design\inventory\london-<page>.md, one row per section, every
   column filled. Verdict is one of exactly five words:
     keep | rework | CONNECT | REPLACE | cut
   CONNECT   the adapter carries it and the page ignores it. CHEAPEST WIN.
   REPLACE   no source. Needs a written replacement decision before any code.
   cut       needs §41's two grounds: fails credibility, or fails differentiation.

   DO EVERY CONNECT IN A PAGE BEFORE ANY REPLACE IN THAT PAGE.

2. REPLACEMENT DECISION, one file per REPLACE row, before any code:
   E:\atlas\design\replacements\<section-id>.md carrying, all filled:
     the decision the section serves
     the t4 figure it wants and cannot have
     the knowable neighbour that takes its place
     why that answers a similar question
     where it comes from, with the field named
     COVERAGE, COUNTED, not estimated
     the tier, and whether §4A needs a SampleTag
     the §21 universality result for Dhaka, Tirana, Lagos, Mumbai
   Verify the source covers the set BEFORE writing the file. If a field is
   missing for a large share, the neighbour is wrong. Pick another.

3. BUILD, one fresh implementer subagent per SECTION. Never batch. The brief
   carries, verbatim, so the implementer never goes looking:
     the inventory row
     the replacement decision, if any
     THE RULEBOOK RULES QUOTED, not referenced: always §0 §3 §11 §14 §17 §21
       §26 §29A §32 §37, plus the form-specific ones
     the matching FOUNDER-VERDICTS entries
     the scope fence: ONE section, not the kit unless the inventory says so,
       never an approved registry entry
   And two warnings, because both were got wrong on 2026-08-24:
     READ THE MODULE THAT PRODUCES EVERY NUMBER BEFORE USING IT. A city trade
       score looked usable until it turned out to blend a banned per-city margin
       with a term its own comment labels crowding.
     NEVER GUESS AN IDENTIFIER FROM A SIBLING MODULE. A filter written from a
       neighbouring file's naming matched nothing, on every city, silently.

4. QUALITY CHECKS, all of them, every section.
   a. npx tsc --noEmit
   b. npm run prebuild:serial          expect 116 passed, 0 failed
   c. BLAST RADIUS if a shared file changed:
        npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/sweep_empty_chapters.tsx
   d. RE-RENDER THE SAME SESSION AND LOOK AT THE PICTURE at 375, 768, 1280.
      Not a typecheck. An image you open and read. Two faults in a section
      written on 2026-08-24, a repeated title and an item stranded beside a blank
      half, were invisible to 116 gates and obvious in the picture.
   e. If a shape sums to a total, assert the identity closes and confirm it draws
      NOTHING when it does not.
   f. Any number that exists only on hover is a defect.
   g. ADVERSARIAL PANEL, three lenses, before the founder sees anything:
        rulebook lens      cite the rule number or withdraw the objection
        corpus lens        has he rejected this before? quote the entry
        universality lens  §21: Kinshasa, Dhaka, Tirana, La Paz
      A judge that cannot cite a rule or a corpus entry has no objection. Two of
      three refusing sends it back.
   h. Write the sentence "what I just changed could be wrong because ___" and go
      check that thing.

5. COMMIT, citing the law. One commit per section, so any of it reverts alone.
   Format: "<page>: <section> <what changed> (rulebook v2 §N, §M)"

6. PAGE DONE: build the review sheet, every changed section before and after at
   375 and 1280, one APPROVE/REJECT control each. Hand over ONE FILE. Apply the
   pasted verdict string. APPROVE locks the section and its crop becomes the new
   baseline; REJECT records the reason in FOUNDER-VERDICTS.md and requeues it. A
   bare REJECT with no reason is legal.
   If a verdict changes a rule, EDIT THE RULEBOOK IN PLACE FIRST: version bump,
   reversal logged in the changelog table, before any code is written to it.
   Then raise the richness floor and move to the next page.

=== HARD STOPS. Abort and report in plain language. ===
- Never touch a second vertical.
- Never run a file-by-file rule sweep. §43.
- Never delete a section to make a rule pass. §41, two grounds only.
- Never invent a visual or a metric. §0. Forms come from FORM-CATALOG, the kit,
  or the July-3 baseline.
- Never use a number without reading the module that produces it.
- Never raise a ratchet baseline to make a gate pass.
- Never fabricate a figure, a percentile, a spread, a trend or a comparison.
- Never let the accent appear on hover. §37.
- Never chain a command after `npm run build` that can mask its exit code. A
  failed build was reported as a success on 2026-08-24 because a trailing tail
  returned zero.
- Never claim done for anything you have not looked at as a picture.

=== HOW TO REPORT ===
Plain language. NO file paths, NO function names, NO line numbers. He does not
have the codebase in his head. Say what a VISITOR sees, what changed, what you
checked, and what you could not check. State failures with their output. If you
kept something instead of changing it, say so and say why. Give the section count
before and after, every time, because that is the number this whole effort is
about.
```
