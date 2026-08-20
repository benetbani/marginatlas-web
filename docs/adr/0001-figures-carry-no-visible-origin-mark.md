# Figures carry no visible origin mark; the band carries one

Asked on 2026-08-20 whether a modelled Figure should wear a mark a reader can see,
the founder ruled **zero marks: treat the figure as correct**. In the same
exchange he ruled that a **Band** whose shape is invented **should** be marked. The
two together are the decision: a Figure is the product and is published as
correct, while a Band is a picture of variation and must not imply variation the
data does not contain.

The reasoning worth keeping, because it is what stops this being re-suggested: an
atlas of benchmarks whose every number wears a "modelled" badge reads as
unreliable, and the badge would appear on most figures, so it would decorate
rather than inform. A Band is different in kind. Nine code paths produce one, they
differ by about fifteen times in typical width, and three of them draw the same
shape whatever the trade, so an unmarked band is a claim about spread that the
figures behind it do not support.

## Consequences

**Origin is still required, and is still per figure.** It does two jobs: it
decides whether a Figure may be printed as money at all, which is the question
`isTrustedLocal` is spelled nine ways to answer today, and it carries the
**Regime** so a Band can be marked. It does not drive per-figure furniture.

That narrows the provenance module considerably, and it means a future
architecture review should NOT propose `{value, origin}` reaching every render
site. It should stop at the two jobs above.

**Self-omission is unaffected.** A Figure with no Origin worth printing still
renders nothing. This decision is about marking what IS printed, not about
softening what is not.
