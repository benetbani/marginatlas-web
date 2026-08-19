# 09. Site continuation. The foreign font, and the elements that are missing.

**Founder:** "continuation of website changes, font on the last things you did was
foreign, elements are missing".

Two complaints, two different instruments. Both are render-only findings: neither
can be found by reading source, and both were invisible to 101 green gates.

---

## A. THE FOREIGN FONT. A hypothesis with an exact test, not a diagnosis.

> **RESOLVED, ticks 4 and 8. Do not spend another tick on section A.**
> Tick 4 confirmed the self-reference in a browser on a two-order fixture and
> fixed it by giving the loader its own slot, `--font-serif` (`2179bcb2`), with
> gate 102 `verify_no_self_referential_css_vars` so it cannot return.
> **Tick 8 confirmed it from the paint side and ran the font census this file
> asks for: exactly two families, Inter on 171 elements and Newsreader on 61.**
> Display elements resolve to Newsreader rather than inheriting body sans.
> Census: `artifacts/home-paint-census-2026-08-19.md`.
> The original hypothesis is kept below as the record of how it was found.

Found while reading, 2026-08-18, and at that time not yet confirmed by rendering:

`src/app/layout.tsx` loads Newsreader onto the CSS variable `--font-display` and
Inter onto `--font-sans`, both applied by className to `<html>`.
`src/app/globals.css:882` then declares, on `:root`, which is the same element:

```css
--font-display: var(--font-display), Newsreader, Georgia, ui-serif, serif;
```

**That declaration references itself.** Its two neighbours do not: `--font-body`
and `--font-num` both read `var(--font-sans)`, a different property. A custom
property whose value contains a `var()` referring to itself is invalid at
computed-value time, which makes the property guaranteed-invalid, which makes
every `font-family: var(--font-display)` fall back to inherited body type. There
are dozens of those in `globals.css`, and they are the engraved display headings.

That would print body sans where the design calls for the editorial serif, which
is exactly "the font was foreign". Whether it bites depends on cascade order
between next/font's injected class and `:root`, which is why it must be
**measured, not assumed**.

### The test, in this order

1. Render `/` and one engraved page (`/gb`) with the harness in
   `00-OPERATING-RULES.md` section 5.
2. `getComputedStyle(el).fontFamily` on: the H1, a section heading, an `.eng-*`
   display element, a table figure, a small label. Record the resolved family for
   each at 1280 and 375.
3. Compare against what the design says each should be. **Confirmed only if a
   display element resolves to the body stack or to a generic serif rather than
   Newsreader.**
4. If confirmed: fix the self-reference by giving the slot its own name, so the
   next/font variable and the fallback chain are two different properties, and
   re-render to prove the family changed. Then gate it:
   `verify_no_self_referential_css_vars`, which is a twenty-line scan and catches
   a defect class that is otherwise completely silent.
5. If not confirmed: write that down in this file with the measurement, so nobody
   spends another tick on it, and go hunting the real cause with the same
   instrument. Candidates: a component rendering outside the shell that defines
   the variables, a font loaded on the dev route but not the shipped one, or a
   family named in a class that Tailwind never emitted.

**A font census is cheap and nobody has ever run one here.** Enumerate every
distinct resolved `fontFamily` on a page. The site should use two families, or
three at most. Anything else on the list is a defect with a location.

---

## B. MISSING ELEMENTS. Compare rendered against agreed, per page type.

"Elements are missing" is checkable the moment the comparison is written down.

1. **The agreed inventory** is `docs/brand/section-constitution.md` plus the
   section registry the gates already read (`verify_page_sections`,
   `verify_section_order`).
2. **The rendered inventory** comes from the harness: render the page type at
   1280 and 375 and list the sections that actually paint, with their heights.
3. **Diff them.** Three outcomes and they need different handling:
   - **Self-omitted for missing data.** Correct behaviour, not a defect. The cell
     data bands self-omit from this machine because lookups exceed a 4s budget to
     eu-west-1. **Never "fix" that** by raising the budget or softening the
     omission.
   - **Rendered but empty or collapsed.** A real defect. Something painted a
     wrapper and no content.
   - **Absent from the source entirely.** A dropped section. The founder's rule
     is that an agreed section is never dropped without saying so explicitly.
4. **Zero-height and near-zero-height elements** are the quiet version of this.
   Measure every section's rendered height; anything under 40px that is not a
   rule or a spacer is a candidate.
5. Fix one per tick, render it, commit it.

---

## Standing checks for any page this step touches

- **Both widths, always.** Three separate defects have lived at exactly one
  breakpoint, including `/industries` rendering as a blank white sheet on a phone
  across 200 routes.
- **Reload after every resize.** A resized measurement is fiction.
- No horizontal scroll at 375.
- Terracotta plus cool neutrals only. No cream, no green, no amber, no brown.
- Terracotta under roughly 24px does not sit on the backdrop. `atlas-800` or a
  card.
- Tokens only. No raw hex, px or ms in components.
- No em-dashes in user-visible copy.

## Forbidden

- Restyling a page type the founder has not complained about, in a tick that was
  meant to fix a defect. Fix the defect, then stop.
- Changing a URL slug.
- Touching the H1.
- Treating a locally self-omitted data band as a layout finding.

## Done test

**"The font question is now answered with a measured computed value rather than a
hypothesis, and every element I called missing has a rendered height of zero or
an absence in the source to prove it."**
