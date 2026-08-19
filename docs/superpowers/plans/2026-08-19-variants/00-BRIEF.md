# 00 — THE VARIANTS BRIEF

**Build three versions of five graphics, side by side, on real data, as HTML the
founder opens himself. He picks. No agent picks.**

Written 2026-08-19, after the graphics review
(`docs/superpowers/research/2026-08-19-GRAPHICS-REVIEW.md`).

---

## 1. The one rule that makes this different from the thing that failed

This project has already run a variants-and-pick machine and the founder called
the result **mediocre**. The recorded fix was one mind holding a vision rather
than a committee averaging opinions.

**That failure was agents judging agents' variants.** This is not that.

> **An agent builds the variants. The founder picks the winner. No agent, no
> panel and no adversarial pass expresses a preference between A, B and C.**

An agent may state **facts** about a variant (its height, its contrast, whether a
value is anchored, whether it survives a null). An agent may **not** write "B is
the best one", rank them, or recommend. The moment a build agent starts choosing,
this is the machine that already failed.

The only exception is the review's existing verdicts, which are already written
down and are the founder's to overturn, not an agent's to re-litigate.

---

## 2. Scope. Five families, and what is deliberately NOT touched.

The review's verdict on most graphics is **keep what is there**. Building
alternatives to things that already work is the grind failure this project has
also already paid for. So:

### BUILD variants for these five, because each has a real open decision

| # | Family | The decision that is actually open |
|---|---|---|
| **V1** | **The distribution** | Six charts show p10/p50/p90 and **disagree about the axis: two logarithmic, three linear, one zero-based, and only one has a tick axis.** A reader who learns one misreads another. |
| **V2** | **The single score** | Five score surfaces are **structurally unanchored** — plotted against a fixed 0-100 scale and a band word, never against another place's same score, though the data exists. `ScoreBand` already has an unused `peers` prop. |
| **V3** | **The table** | The house tabular-figures rule at `globals.css:12` is used **zero times**; `Money.tsx` carries none. **No table anywhere has a sticky header.** Thirteen files have a `<table>` with no `scope`. |
| **V4** | **Seasonality** | Five month-of-year charts **disagree about whether the baseline is zero or the annual average**, so a bar means "this much trade" on one page and "this much above normal" on another. |
| **V5** | **The country scorecard** | Eight cells at **equal weight**, so the country page is the only page type with no signal for which number matters. |

### DO NOT build variants for these. The review already says keep them.

`LikeForLikeBars` and `TierBar` (zero-based, max-normalised, directly labelled,
verified arithmetically) · `RangeStrip` and `PercentileStrip` (the
anti-lone-figure device, working) · `MoneyGoesBreakdown` (monotonic neutral
ladder, single accent) · `VsWorld`, `Neighbours`, `CheckResult`, the `/decide`
podium (anchored by construction) · `ThresholdGauge` (a linear meter with a
misleading name) · direct labelling over legends · the div-and-CSS approach to
bars.

**If a build agent believes one of these needs a variant, it writes the reason
into `DECISIONS-NEEDED.md` and builds the five it was asked for.**

---

## 3. Every variant is shown in three states

Sample content hides exactly the cases where a chart choice breaks. The review's
own blind spot says so. So each variant renders three times:

| State | What it is | Why |
|---|---|---|
| **TYPICAL** | real data, a well-covered cell | the case everyone designs for |
| **THIN** | a real cell with missing or single-point data | where self-omission, typed absence and empty states are decided |
| **EXTREME** | a real outlier, and a long list where relevant | where log-vs-linear actually bites, and where 5 rows becomes 40 |

**Use real data from the repo.** Where a state cannot be found in real data, say
so in the harness rather than fabricating one. A fabricated extreme proves
nothing and this project bans invented figures outright.

---

## 4. What gets delivered

1. **One `/dev` route per family**, `/dev/variants/v1` … `/dev/variants/v5`.
   `/dev` is already `robots`-disallowed and is the workshop, not the shop.
2. **One standalone HTML file per family**, written to **`E:\atlas\_review-2026-08-19\`**,
   openable by double-click, with the stylesheet inlined or beside it. This is
   the actual deliverable: the founder has said repeatedly that a dev server and
   a browser session are not how he wants to look at work.
3. **One index page**, `E:\atlas\_review-2026-08-19\index.html`, linking all five
   with one line each on what the decision is.

**No live route changes. No component deletions. Nothing on a reader-facing page.**

---

## 5. The rules that still bind

- Terracotta plus cool neutrals. **One accent.** Good-versus-bad is intensity in
  ONE hue. Few's bullet-graph spec independently mandates this, so it is now
  cited rather than merely house preference.
- **No brown.** The cocoa ramp (`#87745D`, `#C3B39C`) is currently inside charts
  as a bar tone; do not carry it into a variant.
- Tokens only, no raw hex or px in components. No em-dashes in user-visible copy.
  No source-agency names.
- Every figure gets a unit. **Every headline figure gets a comparison anchor** —
  that is the rule whose violation the review says most damages this product.
- **Never touch the H1.** Never fabricate a figure. Never raise a ratchet.
  Never push.
- `npx tsc --noEmit` clean and the gate chain green at the count the chain
  reports, before anything is called done.
