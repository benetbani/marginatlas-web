# Margin Atlas

The domain language of marginatlas.com: an atlas of what a small business earns in
a place and what its owner actually keeps. Created 2026-08-20, during an
architecture review, because module names were being chosen from concepts that had
no agreed word. The terms below are the ones the code should be named after.

Architecture vocabulary lives separately and is not repeated here: module,
interface, implementation, depth, seam, adapter, leverage, locality.

## Language

**Cell**:
One country, one geography, one industry, one sub-industry. The flagship page type
and the unit almost every figure is attached to.
_Avoid_: record, row, entry.

**Take-home**:
What the owner keeps in a year after costs and tax. The site's headline quantity.
Resolved by `resolveOwnerTakeHome`, which returns a **floor**, never an equality.
_Avoid_: profit, earnings, income, salary.

**Figure**:
A single published number with its unit and period. The thing a reader came for.
_Avoid_: value, metric, datapoint, stat.

**Origin**:
Where a **Figure** came from, per figure and never per **Cell**: measured off a
row, filled from an archetype, modelled whole, curated, derived from other figures,
or deliberately suppressed. A cell can hold a measured headline and a filled band
at the same time, which is why this is per figure.
_Avoid_: source, provenance tier, quality (all three already mean other things
here: source names an agency, and coverage tier and quality score are stored
fields).

**Band**:
The spread of a **Figure** across firms, p10 to p90. A picture of variation.
_Avoid_: range, distribution, spread strip.

**Regime**:
Which rule produced a **Band**. Nine code paths currently produce one and they
disagree by about fifteen times in typical width, so a band without its regime
cannot be read. A regime is a property of the band, not of the cell.
_Avoid_: method, model, fan.

**Self-omission**:
Rendering nothing rather than a placeholder when a **Figure** is not held.
Ratified, and never to be softened.
_Avoid_: fallback, empty state, graceful degradation.

**Trusted-local**:
The current predicate for "this cell's figures may be printed as money". Spelled
nine different ways across the path today; the intent is one question.
_Avoid_: verified, confirmed, real.

**The frame**:
`AtlasFrame`, the fixed full-screen photograph behind every page. Anything
`position: static` is not drawn against it at all.

**The workshop**:
`/dev` and `_design`. Built and served, robots-disallowed, linked from nowhere
public. Distinct from **reader-facing routes**.
_Avoid_: staging, sandbox, internal.

**Gate**:
One check in the prebuild chain. A **ratchet** is a gate whose baseline may shrink
and never grow.

## Relationships

- A **Cell** holds many **Figures**.
- Every **Figure** has exactly one **Origin**.
- A **Band** describes one **Figure** and carries exactly one **Regime**.
- **Self-omission** is what happens when a **Figure** has no **Origin** worth
  printing.
- **Trusted-local** is, today, a caller-side stand-in for asking a **Figure** its
  **Origin**.

## Flagged ambiguities

- "spread" was used for both the **Band** and for the act of fanning one out of a
  single number. Resolved: the noun is **Band**, the rule that made it is a
  **Regime**.
- "provenance" was used for the stored `coverage_tier` field, for the
  `_revenueFilled` marker, and for the caption a reader sees. Resolved: **Origin**
  is the per-figure fact; coverage tier stays the name of the stored field.
- "modelled" and "estimated" were used interchangeably in copy. Unresolved, and
  worth settling before either word is put in front of a reader.
