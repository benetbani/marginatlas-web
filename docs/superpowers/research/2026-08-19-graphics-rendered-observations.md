# Graphics: first-hand rendered observations, 2026-08-19

Written from the **rendered page**, not from source. Three agents are producing
the code inventory, the tables/forms inventory and the external practice
research; this file is the thing none of them can do, which is look at the
graphics as they actually paint and measure them.

Instrument: `scripts/spikes/render_home_to_scratch.tsx`, generalised this session
to take any route module, plus a Tailwind build served over HTTP and measured in
a browser.

---

## 1. What was rendered

`/dev/charts`, the viz-primitive showcase. Six primitives on real-shaped sample
content. **Note this is only ONE of the four chart kits in the repo** -
`src/components/kit/charts/`. `board/charts/`, `spine2/` and `ui/` have no
showcase at all, which is itself a finding: three quarters of the chart surface
has never been assembled in one place to be looked at.

---

## 2. The encodings are arithmetically sound. Verified, not assumed.

The bars are **max-normalised length encodings on a zero baseline**, which is the
correct form. Checked against the printed values rather than trusted:

**`LikeForLikeBars`** - typical revenue a year, subject plus peers

| Place | Value | Bar width | Check |
|---|---:|---:|---|
| London (subject) | $720K | **100%** | the max |
| Manchester | $410K | 56.94% | 410/720 = 56.94 ✓ |
| Birmingham | $380K | 52.78% | 380/720 = 52.78 ✓ |
| Bristol | $360K | 50.0% | 360/720 = 50.00 ✓ |
| Leeds | $340K | 47.2% | 340/720 = 47.22 ✓ |

**`TierBar`** - trades ranked by what the owner keeps

| Trade | Value | Bar width | Check |
|---|---:|---:|---|
| Dental practice | $138K | **100%** | the max |
| Law office | $96K | 69.6% | 96/138 = 69.57 ✓ |
| Pharmacy | $72K | 52.2% | 72/138 = 52.17 ✓ |
| Cafe | $31K | 22.5% | 31/138 = 22.46 ✓ |
| Bookshop | $18K | 13.0% | 18/138 = 13.04 ✓ |

**This matters for the review's verdict.** Length from a zero baseline is the top
of Cleveland and McGill's accuracy ranking, and every bar carries its value
printed beside it, which is direct labelling rather than a legend. On the two
properties that matter most for a financial bar chart, these primitives are
already right. **The founder's "maybe the current version is the best one" is
likely to be the correct answer for these two**, and the review should say so
rather than manufacture alternatives.

One property worth naming rather than assuming a defect: because the scale is
normalised to the **visible maximum**, bar length reads as *share of the largest
item shown*, not as an absolute magnitude comparable across two different
charts. That is standard and defensible. It becomes a real problem only if two
such charts are ever placed side by side and read as comparable.

---

## 3. `ThresholdGauge` is a linear meter, not a dial. That is the defensible form.

Rendered: a single track at **56.7%** with a threshold marker, terracotta fill on
a parchment track, and directional labels reading "Losing money" below and
"Covering costs" above, with the value "85 sales a day".

The literature's case against gauges is aimed at **radial dials**, which spend a
lot of ink to encode one number by angle - the weakest channel above area. This
is a linear meter encoding by **position along a common scale**, which is the
strongest. The name is misleading; the thing is fine.

**Two other components are named `*Gauge`** - `board/charts/CrowdingGauge` and
`board/charts/RentGauge`. Whether they are also linear or actually radial is for
the inventory agent to establish. **Do not assume from the name; this one proved
the name wrong.**

---

## 4. Accessibility: only one of the six is exposed to assistive tech

Only `SeverityGlyph` renders SVG. It carries `role="img"` and an `aria-label`,
which is correct. It draws a 12x12 viewBox at 16x16, so it is upscaled slightly.

**The other five primitives are div-and-CSS constructions with percentage
widths.** They are not images, carry no role, and expose no accessible name for
the encoded quantity. This is mitigated - and it is a real mitigation, not an
excuse - by the fact that **every value is printed as text beside its bar**, so a
screen reader gets the numbers even though it does not get the chart. That is a
better outcome than an unlabelled SVG.

The div-based approach also has genuine advantages worth stating: it inherits the
type system, it reflows, and it cannot suffer the
`preserveAspectRatio="none"` distortion the backlog already records at six sites.

---

## 5. Colour: one accent, plus two browns that are supposed to be gone

Background colours measured across the showcase:

| Colour | Reads as |
|---|---|
| `rgb(230, 34, 0)` | terracotta, the accent |
| `rgb(153, 22, 0)` | terracotta, darker step |
| `rgb(238,238,238)` `rgb(227,227,227)` `rgb(191,191,191)` | cool neutrals, the tracks |
| **`rgb(135, 116, 93)`** | **`#87745D`, cocoa-500** |
| **`rgb(195, 179, 156)`** | **`#C3B39C`, cocoa-300** |

The first three groups are exactly the ratified palette: one accent hue at two
intensities, cool neutral tracks. **The last two are the cocoa ramp, which is
brown, which charter section 8 bans.** They are already known - backlog P0-9
records that cocoa survived the 2026-08-17 ramp deletion and carries the whole
quiet-text ladder - but this is the first observation of them **inside a chart**,
where they act as a data tone rather than as text.

That distinction matters for the fix. A brown used for a caption is a palette
question. A brown used as a **bar tone** is a palette question *and* an encoding
question, because it puts a second hue into a chart whose house rule is intensity
in one hue.

---

## 6. Smallest type in the showcase is 10px

Measured in the first card. This is the open founder question, charter section 13
Q1, and it is not pre-empted here. Noted only because a chart is exactly where
small type is load-bearing: axis ticks, units and value labels.

---

## 7. What this observation pass cannot see

1. **Only one kit of four.** `board/charts`, `spine2` and `ui` were not rendered,
   because no showcase assembles them. Their verdicts must come from the code
   inventory plus a later render.
2. **Sample content, not live data.** The showcase feeds representative values.
   A chart that handles $720K well may not handle a null, a negative margin, a
   single-item list or a 40-item list. **Empty, extreme and degenerate states are
   the untested half of every one of these primitives.**
3. **No real webfonts and no frame**, per the harness's own recorded blind spots.
   Bar geometry does not depend on either; label wrapping does.
4. **No screenshots.** The Browser pane would not composite, so every screenshot
   attempt timed out at 5s. Everything above is DOM measurement and computed
   style, which is precise about geometry and silent about whether it looks good.
   That last judgement is the founder's and this file does not attempt it.
