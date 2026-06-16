# 05 - QA, governance, and the final phases

The closing arc of the reformation. By the time these phases run, the six narrative
bands (the answer, the verdict, the economics, the operating reality, the comparison
field, the trust layer) have been composed onto all five locked page types: home, the
United Kingdom country page, the London city page, the London restaurants cell, and the
London neighbourhood page. The section orders are unchanged. What changed is HOW each
section is rendered: into one of the six bands, with one dominant visual, drawn from the
visx + Observable Plot chart kit, set in Newsreader plus Inter, on the warm OKLCH token
ramp with one loud color per viewport.

These phases do not add bands or build new sections. They prove the reformed site reads
as one authored object, that it is correct and accessible, that it is fast, that the
founder has approved it, and that the constitution becomes the standing law that keeps it
that way. They map onto Wave F of the cohesion roadmap (verify all gates plus a per-type
cohesion QA pass, then one comprehensive preview, then promote once), and they extend it
with explicit accessibility, performance, and governance gates.

Each phase below states its goal, substeps, deliverable, and the methodology gates it
must pass. The methodology is the verification protocol (`docs/verification-protocol.md`):
instruction fidelity first, then quality gates, then data honesty, then SEE it at 1280 and
375, then honest reporting, then ship discipline. No phase is done until its gates pass and
its deliverable exists.

Source authority for everything below: `00-research-answer-source.md` (Parts A to D),
`06-ground-truth.md`, `docs/brand/cohesion-master-plan.md`, `docs/brand/section-constitution.md`,
`docs/verification-protocol.md`, and `CLAUDE.md`. Where a value is needed, the token file
(`src/lib/design-tokens.ts`) is the authority, never a number retyped here.

---

## Q1 - Cross-page cohesion QA (the "one authored object" pass)

### Goal

Prove that a reader walking home, then UK, then London, then London restaurants, then a
London neighbourhood feels ONE product, not five. The reformation exists to close the
two-language split (warm SaaS kit versus engraved almanac). This phase is where that
closure is verified, not asserted. Cohesion is judged by four named tests, applied to
every band on every page, at both 1280 and 375.

### Substeps

1. **Build the QA matrix.** Five page types down, six bands across. Each cell names the
   sections that compose that band on that page, and the one dominant visual the band
   resolves to. This matrix is the artifact the four tests run against. It is built from
   the locked section orders in `06-ground-truth.md` section 2; the bands group those
   sections, they never reorder or drop them.

2. **The skim test.** Scroll each page once, top to bottom, at reading speed, without
   stopping to read body copy. For each of the six bands, ask: can I state this band's
   point from its visual and its headline alone? The answer band must read as one revenue
   number plus its spread. The economics band must read as money flowing from revenue to
   owner take. The comparison band must read as this place against its peers. If a band's
   point is not legible from the visual alone, the band failed the skim test and is logged
   for rework. Run the skim at 1280 and again at 375, because the reflow can break a
   visual that worked wide.

3. **The sameness test.** Walk adjacent sections within each page. No two adjacent
   sections may read identically: same shell, same chart shape, same density, same color
   load. If "where the money goes" and "what the owner keeps" both render as the same bar
   in the same posture, the reader's eye flattens them into one beat and the page feels
   like a list. Adjacent sections must differ in at least one of: chart family, dominant
   axis, density, or the single accent's placement. Log every adjacent pair that reads as
   a duplicate.

4. **The one-idea-per-band test.** This is the governing rule of the ideology made
   testable. Each band carries exactly one dominant visual, one crisp claim, one
   explanatory paragraph, one trust cue. A band that tries to carry two charts of equal
   weight, or two competing claims, has more than one idea and fails. The fix is to demote
   one element (smaller, quieter, lower) so a single idea dominates. Log every band that
   reads as two ideas.

5. **The chart-vocabulary-consistency test.** The same analytical intent must resolve to
   the same chart family everywhere, per the chart language in the research answer Part B.
   A revenue spread is a min/median/high band with labeled percentile anchors on the cell
   page; it must not become a histogram on the city page and a box plot on the country
   page. A peer comparison is a ranked dot plot everywhere it appears. A cost flow is a
   waterfall everywhere. Walk every chart across all five pages and confirm that intent
   maps to family one-to-one. Any statistic rendered with two different chart families
   across pages is a vocabulary break and is logged. This is the test that most directly
   proves the chart kit is a language and not a grab-bag.

6. **Cross-page identity walk.** With all four tests passed per page, do the full walk
   home to UK to London to cell to neighbourhood, at 1280 then at 375, and confirm the
   engraved frame, the section shells, the type scale, the divider family, and the single
   accent discipline are the same object on every page. The warm frame is on by default
   everywhere; confirm it. This is the cohesion check from the protocol's SEE-it step,
   applied across the whole set rather than one page.

### Deliverable

The cohesion QA matrix (five types by six bands) annotated PASS or FAIL per cell against
all five tests, with a screenshot evidence pair (1280 and 375) per page type, and a logged
defect list for every failed band, pair, or chart. London and the UK are the filled
exemplars; at least one thin instance per type is walked too so cohesion is proven on
sparse data, not only on the showcase.

### Methodology gates

- Instruction fidelity: every one of the five tests is run on all five page types at both
  widths; none silently skipped. The six bands map onto the locked section orders with no
  section dropped, renamed, or reordered (the cardinal locked rule).
- SEE it: real Playwright MCP screenshots at 1280 and 375, exemplar plus thin, per type.
  No cohesion claim without the paired screenshot behind it.
- Honest reporting: the defect list is reported in full. A band that fails a test is
  reported as failed, with the actual screenshot, not smoothed over.
- `verify_page_sections` and `verify_section_order` PASS, confirming the band composition
  did not disturb the spine.

---

## Q2 - Accessibility and correctness audit

### Goal

Prove the reformed pages meet the WCAG AA floor and the data-honesty bar on the warm
palette and the new charts, on every band, at 375 with no horizontal scroll. The warm
restraint palette and the chart kit are new surfaces for old constraints; this phase
re-checks every constraint against them.

### Substeps

1. **Contrast audit on the warm palette.** Check every foreground/background pairing that
   the reformation introduces or restyles against WCAG AA: 4.5:1 for body text, 3:1 for
   large text and non-text UI. The warm ink on cream pairings, the single loud accent on
   its washes, moss on its surface for the kept band, amber on its surface for caution,
   and every chart label, axis, and annotation. The accent text token and the accent
   mark/surface token are distinct; confirm body text never uses the mark token. Use the
   contrast-grade mental model from the catalog (USWDS-style foreground/background
   discipline) and audit, do not eyeball. Every failing pair is logged with its measured
   ratio and a fix.

2. **375 no-horizontal-scroll on every band.** At 375, walk every band on every page and
   confirm zero horizontal scroll. The serif headline, the masthead anchor number, and the
   revenue spread survive a 375 column. Tables reflow to labeled bar lists. The three
   reading lanes collapse to one column with the section order preserved. The optional
   sticky section index does not obscure reading. Any band that overflows 375 is logged.

3. **Tabular figures everywhere numbers align.** Confirm every numeric surface, the
   mastheads, the spreads, the P&L, the pay-by-role table, the cost-to-open ranges, the
   peer dot plots, the seasonality values, renders with tabular lining figures so columns
   and stacked numbers align. Inter carries all numerals; the serif carries only the single
   masthead anchor number. Any numeric run that wobbles because it is not tabular is logged.

4. **No-color-alone encoding (Bertin).** Per the Bertin discipline in the catalog, no band
   may carry meaning by color alone. The kept band cannot rely on moss being green; it must
   also be labeled, or positioned, or carry a direct figure. The caution amber and the risk
   red must each pair with a label, an icon, or an ordering, never hue as the sole signal.
   Walk every chart and confirm position, length, label, or order carries the meaning and
   color only reinforces it. Any color-only encoding is logged and re-encoded.

5. **Keyboard and focus on the Radix-backed controls.** The interactive surfaces, the
   make-it-yours calculator, the methodology accordions, the role-pay tabsets, the
   comparison popovers, the mobile section index, are backed by Radix primitives. Tab
   through every one: reachable in a sensible order, operable by keyboard, with a visible
   focus ring that is never removed. Confirm the calculator is fully operable without a
   mouse and that its live range band updates are announced or at least keyboard-driven.
   Any control that traps focus, skips in tab order, or hides its focus ring is logged.

6. **Reduced motion.** Motion is used only for disclosure, calculator state changes,
   section transitions, and orientation, never to make a number understandable. Confirm
   that with prefers-reduced-motion set, every animation is suppressed or reduced and no
   information is lost: the calculator still updates, the accordion still discloses, the
   page is fully usable static. Any motion that ignores the reduced-motion preference, or
   that is load-bearing for comprehension, is logged.

### Deliverable

The accessibility and correctness report: a contrast table of every reformed pairing with
its measured ratio and PASS/FAIL; a 375-overflow log (target zero); a tabular-figures
confirmation per numeric surface; a no-color-alone confirmation per chart; a keyboard and
focus walk per Radix control; a reduced-motion confirmation. Every logged failure has a
named fix, and the fixes are applied and re-checked before the phase closes.

### Methodology gates

- Quality gates: hard constraints clean (no em-dashes, no source-agency names, tokens only,
  WCAG AA, 375 with no horizontal scroll). `npx tsc --noEmit` clean and `npm run prebuild`
  31/31, including the constraint verifiers.
- SEE it: 375 screenshots per page type are the evidence for the no-scroll and reflow
  claims; the keyboard walk is demonstrated, not assumed.
- Data honesty: the correctness half of the audit confirms no fabricated real-looking
  numbers, no visibly-wrong numbers, like-for-like only, and that thin instances self-omit
  or show a tagged SAMPLE rather than a wall of dashes. London stays the one sanctioned-
  invention exemplar; everywhere else is real-or-honest-omit.
- Honest reporting: failures reported with the measured ratio or the actual screenshot, not
  rounded up to pass.

---

## Q3 - Performance

### Goal

Prove the reformed site is fast and stable: charts render server-side or static-first, the
visx and d3 weight is controlled, fonts deliver without a flash or a layout shift, and
cumulative layout shift stays low. Density and rigor must not cost load time.

### Substeps

1. **SSR / static-first charts.** Confirm the chart kit renders as server-rendered or
   static SVG by default, per the stack decision (visx for product charts, Observable Plot
   plus jsdom for static and methodology graphics, d3 for the scale and format math). The
   public pages are static; charts must not require a client boundary to appear. Client
   boundaries are reserved for genuine interaction (the calculator, disclosures, tabs).
   Any chart that needlessly forces a client component, or that renders blank until
   hydration, is logged and moved to server/static rendering.

2. **Bundle weight of visx and d3.** Measure the JavaScript the reformation adds. visx is
   imported as the specific primitives used, not the umbrella where it inflates the bundle;
   d3 is imported as the specific modules (array, scale, format, shape), never the whole
   library. Confirm tree-shaking is effective and that Motion and the icon set are
   imported per-symbol. Log any import that pulls a whole library where a submodule would
   do, and any client bundle that grew beyond the budget set at the start of this phase.

3. **Font delivery.** Confirm Newsreader and Inter deliver without a flash of invisible or
   unstyled text and without a layout shift when they swap in. Whether through the
   framework font pipeline or the self-hosted package path, the faces are preloaded, the
   fallback metrics are matched so the swap does not reflow, and the serif is scoped to its
   reserved roles (H1 to H3, the masthead anchor, pull-quotes, wordmark) so it is not
   loaded weight the body never uses. Log any font that blocks render or shifts layout on
   swap.

4. **Cumulative layout shift.** Walk each page type and confirm CLS stays low: charts
   reserve their space before they draw, images and washes have intrinsic dimensions, the
   sticky index and the calculator do not push content as they mount, and the band rhythm
   does not jump as fonts and charts settle. Measure at 1280 and 375, since the mobile
   reflow is where shift most often hides. Any band that shifts on load is logged with the
   element that caused it.

5. **Re-run after fixes.** Apply the fixes (server-render the strays, trim the imports,
   preload and metric-match the fonts, reserve the chart space) and re-measure, so the
   phase closes on measured numbers, not intentions.

### Deliverable

The performance report: a per-page-type table of chart-rendering mode (server/static/client
with a reason for each client case), the measured client bundle delta from the reformation,
the font-delivery confirmation (no FOIT/FOUT, no swap shift), and the CLS figure per page
type at 1280 and 375, each against the budget set at phase start. Fixes applied and
re-measured.

### Methodology gates

- Quality gates: `npx tsc --noEmit` clean, `npm run prebuild` 31/31. Tokens only, so no
  raw values crept in while tuning. Parallel prebuild concurrency stays at or below 4 on
  Windows.
- SEE it: the pages render correctly after the performance fixes; a screenshot pass
  confirms nothing broke, blanked, or reflowed wrong while charts were moved to server
  rendering or imports were trimmed.
- Honest reporting: measured numbers reported, including any budget a page misses, with the
  cause and the planned remedy. No "fast enough" without the figure behind it.

---

## Q4 - Founder review and the single cohesive promote (Wave F)

### Goal

Get the founder's review and approval on the reformed cohesive site, iterate on the
feedback, and then promote the whole site live in one go. This is Wave F of the cohesion
roadmap: verify, one comprehensive preview, founder nod, promote once. Per the locked
decision, the country page and every other reformed type ship together here; nothing
promotes ahead of the set.

### Substeps

1. **Assemble the review package.** Collect the Q1 cohesion matrix with its screenshot
   pairs, the Q2 accessibility and correctness report, and the Q3 performance report into
   one founder-facing summary. State plainly what is real, what is a tagged sample, and
   what is deferred, per page type. Name the judgment calls made and the risks seen.

2. **Deploy one comprehensive preview.** A single preview deployment that carries every
   reformed page type, run and confirmed from `E:\atlas\website` against the correct
   Vercel project. The preview is the thing the founder walks, not a description of it.
   Verify the preview yourself first (the SEE-it pass on the deployed preview, not just
   local) before showing it.

3. **Founder review walk.** Present the preview for the founder to walk home to UK to
   London to cell to neighbourhood, at desktop and on mobile. Capture the feedback as a
   discrete list, the same way the cardinal rule enumerates asks, so nothing is lost or
   silently reinterpreted.

4. **Iterate.** Address each piece of feedback. A change to a band's composition or visual
   re-runs the relevant Q1 to Q3 checks for the affected page, not the whole suite, but the
   cohesion tests re-run across the set if the change touches the shared frame, shells,
   type scale, divider family, or chart kit, because those are the cohesion-bearing layers.
   Re-deploy the preview after the iteration and re-verify.

5. **The single promote.** On the founder's explicit nod, and only then, promote the
   reformed site to production in one go. Preview, then verify, then nod, then promote;
   never promote unverified, and never let production fall behind the verified branch work.
   Confirm the target Vercel project before promoting. After promote, do a production SEE-it
   pass at 1280 and 375 on each page type to confirm the live site matches the approved
   preview.

### Deliverable

The reformed cohesive site live in production: every page type carrying the six bands on
the engraved frame with the clean data core, promoted together in one Wave F ship, with the
founder's recorded approval, the preview-then-promote trail, and a post-promote production
verification pass.

### Methodology gates

- Instruction fidelity: every item of founder feedback enumerated and addressed, or the
  deviation explicitly flagged with a reason; no silent substitution. All of the founder's
  messages reconciled, not just the latest.
- Quality gates: the full gate set green on the promoted commit (`npx tsc --noEmit`,
  `npm run prebuild` 31/31, `verify_page_sections` and `verify_section_order` PASS, hard
  constraints clean).
- SEE it: the preview verified before the founder sees it, and the production verified after
  promote, both at 1280 and 375, exemplar and thin.
- Ship discipline: preview, verify, founder nod, promote, once; correct Vercel project
  confirmed; no force-push to main, no `--no-verify`, no `--no-gpg-sign`.
- Honest reporting: the review package states real versus sample versus deferred, the
  judgment calls, and the risks, with nothing overclaimed.

---

## Q5 - Governance (make the constitution the living law)

### Goal

Lock in the cohesion so it does not erode the next time a page or chart is added. Make the
section constitution and the reformed visual ideology the standing law, give every future
contributor a conformance checklist, retire the last artifacts of the old two-language
direction so no one ports from them, and update the handoff so the next session continues
from a clean, single-language baseline.

### Substeps

1. **Promote the constitution and ideology to living law.** Confirm the section
   constitution (`docs/brand/section-constitution.md`) and the cohesion master plan are the
   named authorities, and fold the reformed ideology, the six bands, the 12/6/4 grid with
   three reading lanes, the type law, the warm OKLCH token law with one loud color per
   viewport, and the chart-vocabulary mapping, into the brand docs as the standing visual
   law, cross-linked from `CLAUDE.md` so a new session reads them first. The five locked
   page types and their fixed section orders remain immutable; the bands govern composition,
   never the spine.

2. **Write the conformance checklist for any new page or chart.** A short, enforceable
   checklist a contributor runs before merging a new page type, a new section, or a new
   chart. It asks: does the page render its full locked spine in order, with no section
   dropped, renamed, or reordered? Does each band carry one idea, one dominant visual, one
   claim, one trust cue? Does every statistic use the established chart family for its
   intent (the vocabulary-consistency rule), or is a genuinely new intent being added to
   the vocabulary deliberately and documented? Tokens only, no raw hex/px/ms/font/z? WCAG
   AA, tabular figures, no color-alone? 375 with no horizontal scroll? Server/static-first
   chart? No em-dashes, no source-agency names, no slug renames? Real-or-tagged-sample, no
   fabricated numbers, London the only sanctioned-invention exemplar? This checklist is the
   per-page-and-chart distillation of the verification protocol and lives beside it.

3. **Retire the last old-direction artifacts.** Per the cohesion plan, the duplicate
   components (the `kit/blocks` versions of the blocks that the engraved versions supersede)
   and the warm-SaaS-kit grammar that the reformation replaces are retired or re-pointed,
   so no future work ports from a stale path and regresses the repo. Confirm the page-
   sections manifest now matches the locked orders (it predated the spec and had to be
   rewritten during the reformation) and that no superseded component remains importable as
   a tempting shortcut. Stale design export sets that are pre-refactor are marked do-not-port
   if any remain referenced.

4. **Update the handoff.** Write the new session handoff: the reformation is live, the site
   speaks one visual language (engraved frame, clean data core, six bands), the constitution
   and ideology are the living law, the conformance checklist is the merge gate for new
   work, the old artifacts are retired, and the chart kit is the established vocabulary.
   Carry forward any deferred items honestly (thin instances still awaiting real data, any
   page that shipped with a tagged sample, any performance budget still being tuned). Update
   `CLAUDE.md`'s latest-handoff pointer so the next session starts here.

### Deliverable

The governance set: the constitution and the reformed ideology established as the living
visual law and cross-linked from `CLAUDE.md`; the conformance checklist for any new page or
chart, living beside the verification protocol; the old-direction artifacts retired or
re-pointed with the manifest matching the locked orders; and the updated session handoff
that lets the next session continue from a single-language baseline.

### Methodology gates

- Instruction fidelity: every governance ask done, the locked spines confirmed immutable,
  the bands confirmed as composition-only.
- Quality gates: after retiring artifacts, `npx tsc --noEmit` clean and `npm run prebuild`
  31/31, proving nothing still imports a retired path; `verify_page_sections` and
  `verify_section_order` still PASS; `verify_layering` clean with no new allowlist entries.
- Honest reporting: the handoff states deferrals, samples, and any remaining tuning
  plainly, with no overclaiming. Nothing is recorded as done that is partial.
- Ship discipline: governance changes are doc and cleanup work; they follow the same
  preview-and-verify discipline where they touch anything user-visible, and they never
  force-push main.

---

## How the five phases chain

Q1 proves the site reads as one object. Q2 proves it is correct and accessible on the new
palette and charts. Q3 proves it is fast. Q4 takes the verified, accessible, fast site to
the founder and promotes it once, as Wave F. Q5 makes the result durable so the next page
or chart does not undo it. Each phase gates the next: a cohesion defect from Q1 or a
contrast failure from Q2 or a performance miss from Q3 must be fixed before the Q4 promote,
and the Q5 governance closes only after the Q4 site is live. The whole arc runs under one
methodology, the verification protocol, applied at every step, so the reformed site ships
seen, honest, and held to the same law that will keep it cohesive.
