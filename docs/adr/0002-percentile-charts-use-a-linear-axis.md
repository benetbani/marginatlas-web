# Percentile charts use a linear axis, and their bands carry a mark

**Date:** 2026-08-21
**Decided by:** me, at the founder's instruction. His words: *"the percentile
axis, I have no idea. I have no idea about that. You should try to understand.
And that's the whole point."*

**Decision:** the converged percentile chart uses a **linear** axis, not a
logarithmic one. Two of the six implementations were logarithmic and both change.

---

## The measurement that decided it, and it moved the question

The plan said: measure the actual spreads before choosing, because a log axis is
defensible when data runs over orders of magnitude and indefensible when it
flatters a narrow spread.

**So I measured. There is no measured spread on this site to fit an axis to.**

Every percentile the site draws comes from five constants in
`src/lib/cells/fill_defaults.ts`:

```
p10 0.25x   p25 0.55x   p50 1.0x   p75 1.85x   p90 3.4x
```

Multiplied against the typical figure. The same five, for a London restaurant
and a Warsaw dental practice and every other business on earth. The p90/p10
ratio is therefore **13.6x, constant, everywhere, by construction.**

The only other percentile data in the repository is
`data/quality/wave5_logic_check_v1.json`, and it is not a spread: it is an
outlier and normalisation report over aggregate totals, where `p10` exceeds
`p50` on row after row and figures run to billions. Reading a distribution out
of it would have produced a confident number about nothing, which is the
failure mode this project has already paid for six times.

## Why that makes it linear

**A log axis on a constant-ratio fan is not neutral. It is flattering.** Take
0.25, 1.0 and 3.4 to a logarithmic scale and they space out almost evenly, and
the strip reads as a distribution with structure: a bottom tail, a middle, a top
tail, all comfortably legible. On a linear axis the same three numbers visibly
bunch toward the left with a long reach to the right, which is what a
fixed-multiplier fan actually looks like.

So the log axis takes a shape produced by five constants and draws it as if it
had been measured. That is the defect class this entire effort exists to
remove, wearing an axis instead of a badge.

**And 13.6x does not need a log axis to be readable.** Logarithmic scaling earns
its place across orders of magnitude, where a linear axis crushes the small
values into the origin. At 13.6x the p10 sits at roughly 7% of the way along a
linear track. That is tight but perfectly markable, and it is honest about how
lopsided the fan is.

## The consequence that matters more than the axis

Per `docs/adr/0001-figures-carry-no-visible-origin-mark.md`, the founder ruled
that a **Band whose shape is invented carries a mark**, even though a Figure does
not. That ADR's reasoning names this exact situation:

> Nine code paths produce one, they differ by about fifteen times in typical
> width, and three of them draw the same shape whatever the trade, so an
> unmarked band is a claim about spread that the figures behind it do not
> support.

Every band drawn from `PCT_MULTIPLIERS` is that case. **The converged chart must
mark them.** Choosing an axis for a fabricated fan and leaving it unmarked would
settle the smaller question and leave the larger one exactly where it was.

## What this does NOT decide

- **It does not make the spreads real.** That needs firm-level data and is a
  data project, which the founder has ruled out of scope for now.
- **It does not touch the two live consumers yet.** `PercentileStrip` and
  `RangeStrip` are logarithmic today and change when the percentile charts
  converge in the charts phase.
- **It does not judge `IncomeCurve`**, the city page's shared-axis marker plot,
  which is logarithmic over genuinely wide income data and is a different
  question. Left alone.

## Reversal condition, stated so this can be undone cleanly

If firm-level percentiles ever land and the measured p90/p10 ratio exceeds
roughly 20x across a meaningful share of cells, a log axis becomes the honest
choice and this decision should be revisited with that measurement attached.
