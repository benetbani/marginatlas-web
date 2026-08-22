# 01 — INVENTORY. Every bespoke surface, and its verdict.

Three verdicts only. **REPLACE** means a shadcn component does this job better
and the swap is mechanical. **KEEP** means there is no equivalent and the
bespoke one is good. **RETIRE** means it should not exist at all.

> **Nothing in this file is a licence to change what a section SAYS.** A REPLACE
> verdict is about the box, never about the words or the numbers inside it. See
> `04-GUARDRAILS.md`.

---

## A. Charts. The worst area, and the founder's specific complaint.

**Measured:** 16 chart primitives hand-rolled in `src/components/spine/kit.tsx`,
13 more files under `src/components/kit/charts/`, drawn as `<div>` stacks and
inline `<svg>`. The readiness ledger already records what that produced: six
percentile charts that disagree on axis (two logarithmic), five different
"where each $100 goes", month-of-year charts once believed to disagree about where zero
is, nine gauge geometries, and three separate components named `Waterfall`.

| Bespoke | Verdict | Becomes | Note |
|---|---|---|---|
| `MiniBar`, `IndexBar`, `StackBar`, `ShareStack`, `RankBars`, `ComparisonBars` | **REPLACE** | `ui/chart` + recharts `BarChart` | One component, variants by prop. Zero baseline pinned; recharts will not do it unless told |
| the month-of-year charts | **NO WORK NEEDED** | , | **The claim was wrong, re-measured 2026-08-21.** Four render for a reader and all four are already zero-based or are deviation charts. The one non-zero floor belongs to a pay-by-role RANGE chart, not a month chart |
| the 6 percentile charts | **REPLACE** | one `BarChart` or `AreaChart` | **Two are logarithmic.** Picking one axis is a founder decision, not a migration decision. Route it |
| `Waterfall` x3, `SteppedWaterfall` | **REPLACE**, then converge to one | recharts stacked bar with a transparent base | The money identity is a signature moment; get it right once |
| `Gauge` x9 geometries | **REPLACE**, converge to one | recharts `RadialBarChart` | Nine is the defect. One survives |
| `Spark` | **REPLACE** | recharts `AreaChart`, no axes | |
| `SurvivalCurve`, `StruckLine` | **KEEP** | | A struck phantom line on the same axis is a local idiom with no shadcn equivalent. It is also rule 30 |
| `SpectraTable` | **KEEP** | | Two-pole spectra. Nothing in shadcn does this and it is the country/city character standard |
| `Dots` | **KEEP** | | 7px dot rows. Trivial, correct, and lighter than anything imported |
| `Meter`, `EaseScale` | **KEEP for now** | possibly `ui/slider` (read-only) | Re-evaluate after the charts land. Low value, non-zero risk |
| `Timeline`, `PhaseBar` | **KEEP** | | Honest-anchors-only rule is baked into them |
| `Donut` | **REPLACE** | recharts `PieChart` with `innerRadius` | Hard 5-slice cap must be re-implemented |
| `CountryShape`, `CompassRosette`, `ContourField` | **KEEP** | | Signature moments. Bespoke is the point |

**Blocking decision inside this section, for the founder:** the six percentile
charts use two different axes and two of them are logarithmic. Converging them
means choosing one, and a logarithmic axis is a claim about how the reader should
read a spread. That is a design ruling, not a swap. **Do not guess it.**

---

## B. Structure and interaction. Highest value, lowest risk.

These are pure mechanism. A reader notices only that they stop misbehaving.

| Bespoke | Verdict | Becomes | Why it matters |
|---|---|---|---|
| 13 hand-rolled switchers/toggles | **REPLACE** | `ui/tabs` or `ui/toggle-group` | Radix `tabs` is already installed and unused. Gets keyboard nav and ARIA for free, which G22 says is unmeasured today |
| every `<table>` | **DONE for semantics, 2026-08-21** | `ui/table` | **G35's figures were wrong and are corrected.** 19 files hold a table, 11 lacked `scope` (not 13), one already had a sticky header (not zero), and `tabular-nums` appears **405** times including in `Money.tsx`, the file G35 named as lacking it. All 37 reader-facing headers now carry `scope`, gated by `table-semantics`. Sticky headers still open |
| bespoke tooltips / "?" glosses | **REPLACE** | `ui/tooltip` | Radix `tooltip` installed and unused. Fixes focus and escape handling |
| `InlineDisclosure`, `Expand` | **REPLACE** | `ui/collapsible` or `ui/accordion` | Radix `accordion` installed and unused |
| the currency switcher | **REPLACE** | `ui/select` or `ui/toggle-group` | **This is the thing that makes the trade page scroll sideways at 375**, measured this session: 371px of content in a 360px viewport, a label plus six pills on one unwrapped line |
| `Pager`, `SortHeader`, `ControlRail` | **REPLACE** | `ui/pagination`, `ui/table` sorting | |
| `CompareTray` | **REPLACE** | `ui/sheet` or `ui/drawer` | |
| search / command surfaces | **REPLACE** | `ui/command` | |
| `ui/skeleton`, `ui/spinner` | **REPLACE** | `ui/skeleton` (canonical) | Already half-shadcn |
| `AtlasTable`, `ComparisonTable`, `SortableFactsTable`, `CompareTable` | **REPLACE**, converge to one | `ui/table` | Four tables, one job |

---

## C. Forms. Entirely bespoke today, and about to matter.

The accounts and paid-tier work the founder raised earlier this session needs
sign-in, and there is **no auth UI at all**. Every form on the site is
hand-rolled.

| Bespoke | Verdict | Becomes |
|---|---|---|
| newsletter forms x4, correction form, calculator inputs | **REPLACE** | `ui/form` + `ui/input` + `ui/label` (react-hook-form + zod) |
| any future sign-in / sign-up | **BUILD ON** | `ui/form`, or a shadcnblocks auth block |

**Do not build auth UI as part of this migration.** It is a separate plan. This
inventory records only that the substrate for it should be shadcn, not bespoke.

---

## D. Layout and chrome. Mostly KEEP.

| Bespoke | Verdict | Why |
|---|---|---|
| `AtlasFrame` (the fixed photograph) | **KEEP** | Founder-designed, and the paint rule depends on it |
| `SiteChrome`, masthead, footer | **KEEP** | No shadcn equivalent and no defect |
| `Box` / `.atlas-card` | **KEEP the class, REPLACE the component** | `ui/card` already rebases onto `.atlas-card`. **NOTE: `card.tsx` is customised with a `variant` prop mapping to `.atlas-card` / `-soft` / `-band`. It was clobbered by `shadcn add --overwrite` this session and restored. Never overwrite it.** |
| width tiers `Full` / `Even` / `WideRail` / `Narrow` | **KEEP** | Local grid contract |
| `Movement`, `Head`, `Ico`, `Rail` | **KEEP** | The section grammar, rulebook rules 11 to 14 |

---

## E. RETIRE. Should not exist in either form.

| What | Why |
|---|---|
| ~30 graphics that mount nowhere (G34) | Dead code. Deleting is not a migration risk because nothing renders them |
| 9 more that render only from `_design` | `_design` is a Next private folder and has **no URL at all** |
| 3 gauges permanently fed `notHeld()` | A frame around a value that never arrives. Named defect class |
| `meaningStep` ladder (G17) | Non-monotonic on hue, luminance AND saturation; steps 3 and 4 byte-identical; and `FootingLegend` **prints it to the reader as the key explaining itself** |

**Retiring is cheaper than migrating.** Do section E before section A: every
component deleted here is one that never needs a verdict above.

---

## F. The count this plan is trying to move

| | now | target |
|---|---|---|
| `.tsx` under `src/components` | **319** | fewer, and the number is not the point |
| chart implementations | **29** (16 + 13) | **under 10** |
| things named `Waterfall` | 3 | 1 |
| gauge geometries | 9 | 1 |
| percentile charts | 6 | 1 |
| month-of-year charts | 4, all already zero-based | no change needed |
| tables with no `scope` | 11 files (not 13) | **0, done and gated** |
| tables with a sticky header | 1 (not 0) | all that need one, still open |
| uses of the house tabular-figures rule | **405, the ledger's zero was wrong** | keep |
