# 11 — PRODUCTION READINESS. The destination, with numbers.

> **This file is the loop's definition of done.** Before it existed, the loop had
> a queue but no destination: it could work for eight hours and nobody, including
> the loop, could say whether the site was closer to production or merely
> different. Every criterion below is a number that can only move one way.
>
> **Scope, per the founder, 2026-08-20:** *"we should focus only on design, site
> functionality, hierarchy, usability."* Data coverage, statistics sourcing and
> where-to-find-numbers are **out of scope** and do not appear here. A criterion
> that cannot be met without new data is not a criterion, it is a data project.

---

## How to read this file

| | |
|---|---|
| **MET** | measured, at the target, and gated so it cannot silently regress |
| **CLOSE** | measured, near the target, not yet gated |
| **OPEN** | measured, not at the target. This is the work |
| **UNMEASURED** | nobody has taken the number. **Taking it is a valid tick.** |
| **BLOCKED** | needs a founder decision or a founder action. Named in `DECISIONS-NEEDED.md` |

**The ledger is a ratchet.** A criterion that reaches MET may not return to OPEN
without a commit that says what regressed and why the gate did not catch it. A
criterion moving from UNMEASURED to OPEN is progress, not failure: the site did
not get worse, the loop got honest.

**UNMEASURED is deliberately the most common state at the start.** Writing a
ledger full of confident numbers nobody took is exactly the failure this project
has paid for six times. The first ticks fill this in. `scripts/loop_status.mjs`
prints the MET count every tick.

---

## A. INSTRUMENTS — can the loop trust its own measurements?

**These come first and it is not negotiable.** Every criterion below A is
measured by an instrument, and the audit found the design gates enforcing the
rulebook against `/dev` routes no reader can reach. Improving a page while the
gates measure the workshop buys nothing. Charter §0.3.

| ID | Criterion | Measured by | Status |
|---|---|---|---|
| G1 | Zero gates scan a route no reader can reach | count gates whose scan set resolves only to `dev/` or `_design/` | OPEN — 5 repointed at tick 8, `verify_sample_tags`, `verify_v2_scales`, `verify_spacing_scale`, `verify_paragraph_budget` still on workshop paths (P0-1) |
| G2 | Zero gates pass on a comment rather than a rendered tree | `verify_route_chrome_contract` asserts the tree, not the word | OPEN — `/world` and `/industries` pass today by mentioning the word (P0-2) |
| G3 | One comment-stripping implementation, not twelve | count gates rolling their own | OPEN — **21** roll their own, recounted tick 14; 12 was wrong. The shared module was unsafe to adopt until `8bd4aa1b` (it ate every URL), so this criterion was unreachable rather than merely undone |
| G4 | Every ratchet refuses to be raised | count ratchets lacking the `verify_no_cream` guard | OPEN — 4 of 7 can be silently raised (P0-5) |
| G5 | One gate chain, not two | `prebuild:serial` and `prebuild` report the same count | OPEN — serial ran 43 of the chain (P0-10) |
| G6 | The a11y audit runs in the chain | `a11y_static_audit.ts` present in `GATES` | OPEN — written, never wired (P0-7). **The cheapest win on this page** |
| G7 | The chain is green and its count matches the chain, not a document | `npx tsc --noEmit` clean, `npm run prebuild` at the carried count | MET — 104/104, 3 cell-lattice checks deferred and deferred is not passed |
| G8 | Whether the gates run on a deploy is known | a `buildCommand` in `vercel.json`, or a written answer | BLOCKED — founder, `DECISIONS-NEEDED` Q3. If Vercel runs `next build` directly, all 104 gates are skipped in CI while green locally |

---

## B. DESIGN — does it look like one thing, and is it readable?

| ID | Criterion | Measured by | Status |
|---|---|---|---|
| G10 | Zero text below AA against its **actual painted** backdrop | composite the real ground, not the assumed one; `verify_token_contrast.mjs` | OPEN — `--text-faint` is 4.34:1 at the shipped alpha across 82 of 114 small nodes, and 3.40:1 at ladder step L1 |
| G11 | A ratified type floor exists and zero nodes sit below it | `getComputedStyle().fontSize` census per page type | BLOCKED — floor unratified, `DECISIONS-NEEDED` Q1. Measured: 114 nodes under 12px on `/gb` (51 at 11px, 31 at 10px, 17 at 11.5px, 15 at 10.5px) |
| G12 | Zero raw hex, px or ms in components | `verify_hardcoded_hex` plus a diff grep | UNMEASURED across the whole tree |
| G13 | Zero banned hues rendered, not merely zero banned token names | sample rendered pixels, not source | OPEN — cocoa `#87745D` and `#C3B39C` act as **bar tones** in charts, not only as text. Charter §8 bans brown |
| G14 | Zero horizontal overflow at 375 on every reader-facing page type | `scrollWidth > clientWidth` per type | UNMEASURED |
| G15 | Every page type renders at 375, 768 and 1280 | render, reload between widths, read back | UNMEASURED. Three defects in this project existed at exactly one breakpoint |
| G16 | One transparency ladder, applied, with each step paired to the lightest token it may carry | `verify_token_contrast.mjs` passes at every declared step and fails a bad pairing | OPEN — the ladder is researched and measured, not written. `--n2` floor is alpha 0.851; `--ink` is 14.74:1 even at 0.62 |
| G17 | The `meaningStep` ladder is monotonic, or retired | hue, luminance and saturation across the five steps | OPEN — non-monotonic on all three channels, steps 3 and 4 byte-identical, and `FootingLegend` **prints it to the reader as the key explaining itself** |

---

## C. FUNCTIONALITY — does the thing the reader touches work?

**This class is new. The 30-minute loop had no functionality lane at all**, which
is how two forms came to report success while discarding every submission.

| ID | Criterion | Measured by | Status |
|---|---|---|---|
| G20 | Every form either works, or does not claim to | submit against the real backend; read the response | **OPEN, AND LIVE.** `newsletter_signups` and `corrections` **do not exist**. Four signup forms and the cell correction form all answer `{ok:true}` and discard. Both migrations are written and idempotent |
| G21 | Zero dead links: every `href` resolves to a route that is not a 404 | enumerate hrefs from rendered markup, resolve against the route table | UNMEASURED |
| G22 | Every interactive element is reachable by keyboard with a visible focus ring | tab order in jsdom; the preview pane's 0x0 viewport makes `.focus()` a no-op | UNMEASURED |
| G23 | Every interactive target is at least 24x24 CSS px | WCAG 2.2 SC 2.5.8, measured on the rendered box | UNMEASURED |
| G24 | Every primitive renders its empty, single-item, long-list and error states | render each deliberately; sample content only is the untested half of every primitive | UNMEASURED |
| G25 | Zero components that ship but hold no number | count mounted components permanently fed `notHeld()` | OPEN — 9 on the live country page ship a frame and an empty state and have never held a figure |
| G26 | The world map draws | render `/cities` and `/world`, count country paths | CLOSE — fixed in `310600c5`, 177 paths now ink at 0.9px. **Verify it draws before believing it** |

---

## D. HIERARCHY AND USABILITY — can a reader find the answer?

| ID | Criterion | Measured by | Status |
|---|---|---|---|
| G30 | Every page type has one dominant figure | size ratio between the primary figure and the next-largest element | OPEN — the country `Scorecard` renders all eight cells at equal weight. It is the only page type with no hierarchy signal |
| G31 | Every band is inside its word budget | `innerText` word count against `01-DESIGN-STANDARD` §1: 90 per band, 120 ceiling, 615 per homepage | CLOSE — homepage measured 617 at 1280 and 613 at 375, target met. Other page types UNMEASURED |
| G32 | Zero figures appear alone | count single-figure surfaces with no anchor, peer or band | OPEN — every homepage KPI tile grid, every coverage counter, every single-score gauge. `ScoreBand` already accepts a `peers` prop **that no caller passes** |
| G33 | Zero duplicate surfaces: one way to solve each problem | `04-CONSOLIDATION.md`. Converge and redirect, never delete | OPEN — 6 percentile charts disagreeing on axis (2 logarithmic), 5 "where each $100 goes", 5 month-of-year charts disagreeing on baseline, 9 gauge geometries, 3 components named `Waterfall` |
| G34 | Zero components with no call site | render graph, not a registry | OPEN — roughly 30 of ~150 graphics mount nowhere; 9 more render only from `_design`, which is a Next private folder and therefore **no URL at all** |
| G35 | One table primitive with `scope`, tabular figures, right-aligned numerics and a sticky header | count tables missing each property | OPEN — 13 files hold a `<table>` with no `scope` at all; no table anywhere has a sticky header row; the house tabular-figures rule is used **zero** times, including in `Money.tsx`, whose entire job is printing money |
| G36 | Section order matches its gated contract on every page type | `verify_section_order` resolves more than one id | OPEN — it reads ONE id on the country page against a 22-item list (P0-3) |

---

## The two things only the founder can do

Neither is a code change and the loop must never attempt either.

1. **Run two SQL migrations** in the Supabase SQL Editor. Both idempotent, both
   written, neither applied. Until then every newsletter signup and every reader
   correction is silently discarded while the form says it worked. This is G20
   and it is the only item on this page that is losing something right now.
   - `db/migrations/2026-08-16-newsletter-source.sql`
   - `db/migrations/2026-08-16-corrections.sql`
2. **Answer the open questions** in `DECISIONS-NEEDED.md`. G8 and G11 are blocked
   on them and cannot be worked around, only guessed at.

---

## What this ledger cannot tell you

Stated here because every instrument in this project states its blind spot, and
because a ledger reading 36/36 would be the most dangerous document in the repo.

- **It cannot tell you the site looks good.** Every criterion is mechanical. The
  founder is the judge of taste and this file does not attempt it. A site can meet
  all thirty-six and still be bland, which is the failure mode he has already
  rejected twice.
- **It cannot see production.** Every measurement is local. Seven runtime gates
  resolve OFF with no env vars set, 63 of 226 live-reachable components sit behind
  a flag, and which surface production serves is a Vercel setting, not a fact in
  this repo.
- **It cannot distinguish "renders nothing correctly" from "self-omitted because
  the query timed out."** Cell lookups exceed the 4s budget from this machine to
  eu-west-1, so data bands are absent locally and present in production. That
  absence is never a finding.
