# BRAND.md , Margin Atlas

> Operational companion to `PRODUCT.md`. That file decides the voice; this one
> makes it checkable. Every claim below is verifiable against a file in this
> repository, and where the site currently breaks its own rule, this says so.

---

## The name

**Margin Atlas.** Two words, both capitalised, always.

Counted 2026-08-04: **126 uses in source, zero variants.** No "MarginAtlas", no
"margin atlas", no "MA". This is the one part of the brand that has never
drifted, and it stays that way.

The domain is lowercase, `marginatlas.com`, and appears as a domain only. It is
never used as the name in a sentence.

**There is no logo wordmark to protect and no tagline.** The masthead is the
name beside a terracotta square. A tagline would be a slogan, and slogans are a
named anti-reference.

---

## What the site is, in one sentence

> What a small business earns, and what its owner actually keeps, trade by
> trade and place by place.

That sentence is the homepage's opening line, and it is the answer to "what is
this" wherever the question is asked: a meta description, a social card, a
footer. **Keep the two in step.** If the homepage line changes, this changes.

It works because it names the gap. Revenue is easy to find and worth little on
its own. What an owner keeps is the number nobody publishes, and it is the
product.

---

## The voice

`PRODUCT.md` sets the register: **an Economist briefing.** Confident,
structurally grounded, allergic to slogans, numerically precise. Three moves
carry it, and all three are already in the product.

### 1. The figure carries a because

A number alone is a statistic. A number with a reason attached is a finding.
This is the difference between a page that informs and a page that is worth
reading.

> **Live, on the homepage:** "Everyone blames the rent. Rent is the third
> biggest line." Staff takes 34 of every 100, rent takes 13.

A section that prints a figure and moves on has not finished.

### 2. Yes, but not the main reason

Acknowledge the obvious explanation, then point past it. It is the most
characteristic move in the voice and the warmest thing the site does, because
it treats the reader as someone who already had a theory.

> **Live, on the homepage myth section:** the claim that nine in ten
> restaurants fail in the first year, struck through, answered with 94 percent
> still trading at one year and 39 percent at five. The first year is
> survivable. The fifth is where the trade thins.

### 3. Quiet calibration

When a figure is uncertain, say so in the same breath, at the same volume. Not
louder, which is alarm, and not quieter, which is burial.

> **Live, on every gap chapter:** "No count of the working-age population by
> qualification has been filled for this country yet."

---

## Friendly, and what that means here

The founder asked for a friendly brand. Friendly on this site is **not** chatty,
not warm-sounding, and never first person. It is three things:

**Being clear instead of impressive.** "What the owner keeps" beats "net
profitability metrics".

**Admitting what is thin, unprompted.** The coverage section prints "1" next to
"252" because that is the true number of places reconciled line by line. A site
that hid it would read better and be worth less.

**Treating the reader as intelligent.** No explaining what a percentage is, no
congratulating them for scrolling, no exclamation marks.

Three corrections drawn from real strings in this repository:

| currently | why it fails | instead |
|---|---|---|
| "How we know this" | first person, banned outright | "How this figure was built" |
| "we do not crown a winner here" | first person, and hedging about a deliberate decision | "No winner is crowned here, and that is deliberate" |
| "Weight what matters to you, and we re-rank the pick" | first person | "Weight what matters, and the ranking follows" |

---

## The rule the site is currently breaking

`PRODUCT.md`: *"First person of any kind. No 'we,' 'us,' 'our,' 'I.' The site is
a thing, not a personality."*

**It is stated and it is violated.** Grepped 2026-08-04 across `src/app/(site)`
and `src/components`, excluding code comments: **roughly a dozen user-facing
instances**, including a link label a reader clicks.

Confirmed examples, all on shipping pages:

- `about-data/page.tsx` , a "How we know this" link beside every headline number
- `compare/CompareClient.tsx` , "we do not crown a winner here", "Across
  countries we leave the money measures out", "we re-rank the pick"
- `blog/page.tsx` , "a directional guess we would not bet the lease on"
- `account/AccountPreview.tsx` , "when we publish a sourcing or method change"

**This needs a gate.** A rule stated in a document and enforced nowhere decays,
and this one already has. `verify_no_first_person`, scoped to user-facing
strings and exempting code comments, is the fix. Until then the rule is a
suggestion.

---

## Words that never appear

From `PRODUCT.md` and the gate chain, and non-negotiable:

- **No em dashes.** Commas, colons, semicolons, periods, parentheses. Not `--`.
  Gate: `verify_no_em_dashes`.
- **No source-agency names** in anything a reader sees. Gate:
  `verify_no_source_agencies`. This also applies to text sitting in data files
  that a page prints: one industry note carried a named benchmarking source and
  reached a rendered page before it was caught.
- **Banned vocabulary:** "turnover", "covers", "pp", "percentage points", "net
  margin". The last one is a live trap because `industry_margins.json` uses
  `net_margin` as a key.
- **No first person.** See above.
- **No superlatives with no basis.** "The #1 atlas of local profit intelligence"
  was live and is a named anti-reference.
- **No "coming soon".** A missing figure states its absence. It never promises a
  date nobody can keep.

---

## The tier vocabulary, which is the most repeated thing on the site

Three words, and **they are never varied.** They are the site's spine, and a
synonym in one place breaks a reader's ability to compare pages.

| word | means |
|---|---|
| **Measured** | counted in that exact place |
| **Built from published inputs** | arithmetic on published figures, shown so it can be checked |
| **Thin** | the shape is right, the level is not certain |

And the sentence that always follows them, verbatim:

> The tier says which route a figure came down. It does not certify the figure
> is right.

**Repetition here is the point, not a tic.** `LEXICON.md` separates the phrases
that must repeat from the ones that have become reflex.

---

## Social

There is no social presence. Grepped 2026-08-04: **zero** links to any network
anywhere in the product.

That is a decision to make, not an oversight to paper over. Until an account
exists, **the footer renders no icon for it.** A social icon linking nowhere is
worse than an absent one, because it is the first small lie a reader catches.

The icon treatment, when there is something to link: drawn icons from
`@phosphor-icons/react/dist/ssr`, one stroke weight, 16px, `--n2` at rest and
`--ink` on hover. **Never brand colours, never a coloured circle badge.** A row
of platform blues would be the loudest thing on a page whose only accent is one
terracotta per section.
