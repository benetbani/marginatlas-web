# Design-sourcing decision, 2026-06-16 (the phased path)

Ratified by the founder after a week of AI-invented-design failure and a live
pricing/tooling research sweep (full output + the reusable research prompt:
`DESIGN-SOURCING-RESEARCH-PROMPT.md` at repo root). This is the standing decision
for HOW the design system is sourced. It does not replace the locked section orders
(`docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`) or the
honesty boundary; it sits under the "founder designs, AI ports 1:1" pivot.

## The one rule
ONE source of truth. Stop mixing systems (five competing directions was the root
cause of the failure). Every choice below is the single pick for its layer.

## The chosen stack

| Layer | Pick | Price | Notes |
|---|---|---|---|
| Charts (product core) | Recharts + Tremor + visx | Free (MIT/OSS) | Tremor free since Vercel bought it; Recharts engine; visx for bespoke editorial plots. Built to the FT / Our World in Data reference, wired to the OKLCH tokens. |
| Block/section vocabulary | shadcnblocks (Pro) | $149 one-time | shadcn-native = lowest port cost, no foreign primitive. Origin UI (free MIT) as supplement. |
| Origination tool | v0 by Vercel | ~$20-30/mo | React+Tailwind+shadcn output = the exact stack. Founder composes / screenshots, AI ports. |

Rejected and why: Tailwind Plus ($299; Catalyst uses Headless UI not Radix; vendor
Jan-2026 layoffs); Untitled UI ($349+; React Aria, would force a rebuild); Subframe
(its own @subframe/core dependency fights the one-system rule). Nivo / Observable
Plot / Chart.js rejected as the chart standard (second theming system or not
React-native); Observable Plot kept only as a reference for OWID/FT distribution
vocabulary to reproduce in Recharts/visx.

## Tailwind version
Current 2026 kits target Tailwind v4; Atlas is on 3.4. Plan: prototype the first
page on 3.4 (back-port the handful of components used), then do the full v4
migration only after the founder approves the direction. Do not start the v4
migration before that approval.

## The honest finding (why this is phased, not final)
No off-the-shelf kit supplies the "warm editorial almanac" SOUL or the signature
benchmark charts. Those come from (a) the founder's reference URLs + AI porting, or
(b) a hired data-viz/editorial designer (~$8k-$20k via Dribbble or Contra, not
Toptal) briefed to design ON the existing OKLCH tokens + shadcn primitives. The
designer hire is PHASE 2, decided only after the founder sees the cheap-foundation
prototype.

## Working loop
Founder provides 3-5 reference URLs (and optionally composes a rough layout in v0)
-> AI assembles the chosen vetted parts to match the references, wires real London
`cell_view` data, and builds the charts to the FT/OWID reference -> verify gates
(`npx tsc --noEmit`, `npm run prebuild`) + SEE it at 1280 and 375 -> founder judges.
All work on `reform-v2/r6-forward`; nothing to production before the founder's nod.

## Immediate next step
BLOCKER: the founder's 3-5 reference URLs. First build target: a London restaurants
prototype on a `/dev` route, using free parts first so spend stays $0 until the
founder is convinced. Do NOT invent visuals; assemble the chosen parts to the
references.
