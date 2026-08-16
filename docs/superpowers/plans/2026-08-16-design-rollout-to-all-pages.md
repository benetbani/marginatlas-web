# Rolling the design onto every page

**Written 2026-08-16, after the founder's review of the live site.**

His words: *"most of the pages in the online live version are totally not
updated... the background should be totally visible on the edges of the whole
site, and on the center it should have that sort of opacity. And you only put it
at the hero section... the pages are not updated, they are a shithole. You have
not [updated] them according to the new rules of the design."*

---

## 1. What is actually true, measured

I fetched six live page types from production and looked for the design's own
markers (`spine-band`, `spine-scope`) rather than asking the code what it thinks
it does.

| live URL | frame? | background |
|---|---|---|
| `/us/california/restaurants` (cell) | **YES** | Unsplash stock |
| `/` (home) | no | my hero-only skyline |
| `/cities/london` | no | none |
| `/industries/restaurants` | no | none |
| `/us` (country) | no | none |
| `/coverage` (tertiary) | no | none |

**The design is live on exactly one page type out of six.** That is the whole
complaint, and it is correct.

## 2. The design he is describing already exists, to the percent

It is `src/components/spine/shell.tsx`, and it is not vague. Three fixed layers
across the whole viewport, content above them:

```
white base            position:fixed, inset:0
the photograph        position:fixed, inset:0, cover, opacity .32
the passe-partout     position:fixed, centred, width min(1480px,100%)
```

and the passe-partout is exactly what he asked for:

```css
edges   rgba(255,255,255,.16)   <- photograph reads through
9.61%   hard step
centre  rgba(255,255,255,.82)   <- photograph muted so text is legible
90.39%  hard step
edges   rgba(255,255,255,.16)
```

"Totally visible on the edges, and on the centre it should have that sort of
opacity" is a description of this gradient. Nothing needs designing. It needs
**mounting in the right place**.

## 3. Why turning flags on is not sufficient

Two separate problems, and only one is a flag.

**(a) Four page types are built and switched off.** Every page type branches on
`isSpineReformEnabledFor(page)`. In `src/lib/feature_flags.ts`, cell, industry,
city and hood are marked as having real shipped adapters; region and country are
marked illustrative and the master flag deliberately cannot enable them. Only
`CELL` is on in production.

**(b) The frame is per-page, so it can never cover "the whole site."** Each page
mounts its own `SpineShell`. A tertiary page like `/coverage`, `/faq` or
`/pricing` mounts nothing, so no flag will ever give it the background. This is
the structural half, and it is the half he actually asked about.

## 4. The plan

Four phases, ordered by ratio of effect to risk. Phase 1 is a config change with
no code at all.

### Phase 1 — switch on the three finished page types (config only)

Set in Vercel and redeploy:

```
NEXT_PUBLIC_SPINE_REFORM_CITY=1
NEXT_PUBLIC_SPINE_REFORM_INDUSTRY=1
NEXT_PUBLIC_SPINE_REFORM_HOOD=1
```

These three carry the same "real adapter shipped" marking as `CELL`, which has
been serving the design in production without incident. Takes the design from
one page type to four.

Each is independently reversible by setting it back to `0`. **Verify each
locally before flipping**, because the flag-ON branch is a genuinely different
render and has had less production exposure than the cell page.

Does NOT fix: the homepage, tertiary pages, country.

### Phase 2 — move the frame into the chrome, so "the whole site" is true

Today the frame lives in `SpineShell`, mounted per page. It should live in
`SiteChrome`, which every page reaches one way or another: the `(site)` route
group renders it from its layout, and the pages outside that group (home,
`/world`, `/industries`, all `[country]/*`) each render it directly. That split
exists because one URL serves three different renders chosen at request time and
App Router layouts key on path, not data, so the chrome had to move down into
pages. It is still one component.

Put the three fixed layers there. Then:

- every tertiary page inherits the atmosphere for free
- the homepage stops needing the hero-only hack I added, which is the thing he
  saw and objected to
- `SpineShell` keeps only its typography scope and token block

Care required: the fixed layers sit at `z-index:0` with content at `1`; the
sticky masthead and the true-black footer both have to keep reading correctly
over the photograph, and the footer is the site's single dark anchor.

### Phase 3 — one image, and it is his

The six files that mount `SpineShell` today override `bg` with Unsplash URLs.
`SpineShell`'s own default is already `/spine/_skyline.jpeg`, the image he asked
for. Delete the overrides and let the default apply.

This also clears the standing violation recorded in
`scripts/verify_no_stock_imagery.ts`: seventeen frozen stock references, six of
them these page backgrounds. "No stock imagery" is a hard rule and those are the
last of it on real pages.

### Phase 4 — the two that need work, not configuration

**Country** is blocked on data, not design: *"Illustrative hero has no honest
country-level source."* It needs the country adapter before its flag can mean
anything. This is the one item on this list that is a build rather than a
switch, and it is also the page type the founder has rebuilt twice, so it wants
his eye before mine.

**Tertiary page internals.** Phase 2 gives `/coverage`, `/faq`, `/pricing`,
`/tools`, `/learn`, `/blog` the atmosphere, but their bodies are still legacy
cards and legacy type. They need a pass onto the spine kit. This is the largest
item by volume and the least urgent by visibility.

## 5. What I recommend doing first

Phase 1 tonight (config, minutes, reversible), Phase 3 next (small, deletes
code, removes a rule violation), then Phase 2 (the real structural change, and
the one that answers "the whole site"). Phase 4 last and with him.
