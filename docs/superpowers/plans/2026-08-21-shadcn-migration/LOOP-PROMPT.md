# THE LOOP PROMPT

Paste the fenced block below into a fresh session, prefixed with `/loop`. It is
self-pacing: no interval, one surface per iteration, stop on any failure.

---

```
You are upgrading marginatlas.com onto the shadcnblocks library the founder paid
for. Work in E:\atlas\website. The licence key is live in .env.local and the
registry is wired in components.json as @shadcnblocks.

ONE SURFACE PER ITERATION. Never two. If you finish early, stop early.

=== STATE ===
Your ledger is docs/loop/shadcn-upgrade/LEDGER.md. Read it FIRST, every time.
If it does not exist, this is iteration 1: build it and do nothing else. The
ledger lists every reader-visible surface on the site (page type, section, what
it claims, what it is currently built out of, whether a defect has been VERIFIED)
with a status of TODO / DONE-REPLACED / DONE-KEPT / BLOCKED. Order it by reader
value: cell page, then industry, city, neighbourhood, country, then home, then
the rest. Never reorder it later to reach something easier.

=== THE ITERATION ===

1. RESEARCH, before touching anything.
   Read the surface's own source and the module that produces its numbers. Write
   down, in the ledger, what a VISITOR sees and what the surface CLAIMS.
   Then answer: is there a defect, measured rather than felt? Named defects that
   count: text that scales with its container, labels that collide, a chart that
   does not start at zero, a spread whose ends are invented, raw hex, a hover as
   the only carrier of a number, a shape that does not sum to what it claims, a
   component that mounts nowhere.
   Search the catalogue (curl https://www.shadcnblocks.com/r/registry.json,
   3,968 items, index is public) for candidates. Pull one with
   curl -H "Authorization: Bearer $SHADCNBLOCKS_API_KEY" https://www.shadcnblocks.com/r/<name>

2. DECIDE, and record the reason.
   REPLACE only when the library answers a defect: an axis, a scale, responsive
   measurement, tick collision, many data points, a recurring geometry.
   KEEP is a legitimate outcome and must be recorded WITH EVIDENCE. A 44px score
   ring that renders on the server, forty to a page, does not become better by
   being redrawn in the browser. Do not replace things to look busy.
   RETIRE anything that mounts nowhere.

3. IF REPLACING: pull to a workshop route under src/app/dev/, never straight to
   a reader page. Then STRIP what the library ships on by default, all of it:
   the five-hue palette (this site has ONE accent, terracotta, marking the answer
   and nothing else), rounded candy bars, legends (use direct labels), the
   "Trending up 5.2%" footer and every invented figure like it, card headings
   that duplicate the section heading above them, and any font the block names.
   NEVER run shadcn add with --overwrite. It has already clobbered a customised
   file once in this project.

4. THE RULE THAT DECIDES ARGUMENTS: structure adapts, substance does not.
   The block's LAYOUT wins; the content reflows into it. The block's CONTENT
   never lands. Three tiers in the block and two on the site means two. Sample
   prices, sample features, sample company names, sample percentages: deleted on
   arrival, not "adjusted later".

5. QUALITY CHECKS. All of them, every iteration, different kinds on purpose.
   Any failure you cannot fix in one obvious edit: revert, mark BLOCKED, stop.
   a. npx tsc --noEmit
   b. npm run prebuild:serial (114 gates; use serial, this machine is short of
      memory and the parallel run fails differently each time)
   c. CONTENT DIFF: no reader-visible word or figure may change. Figures failing
      either direction is a FAIL. An added string is a FAIL. A removed string is
      a REVIEW: say what went and why.
   d. RENDER AND LOOK AT IT AT 320, 480 AND 760 PIXELS WIDE. Not a typecheck, an
      actual image you open and read. A typecheck is not a render: two real
      defects in the waterfall were invisible to every automated check and
      obvious the second it was drawn.
   e. If the shape sums to a total, assert the identity closes, and confirm it
      draws NOTHING when it does not.
   f. Keyboard and no-pointer: any number that exists only on hover is a defect.
   g. ADVERSARIAL PASS: write the sentence "what I just changed could be wrong
      because ___" and go check that thing. If you cannot write it, you have not
      understood the change.

6. DELIVER a standalone before/after HTML sheet at three widths into
   docs/loop/artifacts/. The founder opens files himself. Do not ask him to
   start a server or watch a browser.

7. Update the ledger, commit, STOP. One commit per surface, so any of it can be
   reverted alone.

=== HARD STOPS. Abort the iteration and report in plain language. ===
- Never push. Never raise a ratchet baseline to make a gate pass.
- Never touch the homepage H1 or the ratified band order. 842 hero, bento and
  feature blocks exist and NONE of them are in scope.
- Never fabricate a figure, a percentile, a spread, a trend or a comparison. If a
  block invites a number the data does not hold, the block is wrong for this site.
- Never let a block introduce a second live hue.
- If the dev server dies (it has, repeatedly, under half a gig of free memory),
  render to a standalone sheet instead. Say the browser check did not run.

=== HOW TO REPORT ===
Plain language. No file paths, no function names, no line numbers. Say what a
VISITOR sees, what changed, what you checked, and what you could not check.
State failures with their output. If you kept something instead of replacing it,
say so and say why. Never claim done for anything you have not looked at.
```
