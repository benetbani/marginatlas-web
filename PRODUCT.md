# PRODUCT.md — Margin Atlas

> Context for `impeccable` and any other design-aware AI agent operating on this codebase.
> Lift from `docs/specs/2026-05-19-site-editorial-style-guide.md` when in doubt about voice.

---

## Register

**Primary register: `brand`.**

Margin Atlas IS the product. There is no separate "app" being marketed; the site itself is the deliverable. Every public page is a piece of editorial: a benchmark cell, a country anchor, an industry essay. The design is not in service of an app it sells — the design is the product the reader is paying with their attention for.

**Secondary register: `product` (route-scoped).**

A small set of routes are tool-like and should be designed in the `product` register: `/admin`, `/saved`, `/calculator`, `/embed`, `/api`, and the navigator forms inside `/browse`. Treat those as product UI. Everything under `/`, `/[country]`, `/industries`, `/sectors`, `/world`, `/blog`, `/methodology`, `/about-data`, `/coverage` is brand.

Default to `brand` if the route is ambiguous.

---

## Product purpose

Margin Atlas is a global small-business benchmarks site. Every page answers a variant of one question: **how much does an X make in Y.**

The reader arrives with a specific question — what a coffee shop earns in Lisbon, what a dental clinic clears in São Paulo, what margin a restaurant runs in California — and leaves with a number, the structural reason the number is what it is, and a sense that someone serious thought about what it means.

Coverage: 191 countries, 180+ small-business industries, 357,000+ data cells, free to browse.

---

## Users

Four real personas. Each is anchored by the question they actually type into a search bar, not by demographic noise.

1. **Small-business operators in commerce-heavy industries.**
   *"What do bakeries in Madrid actually clear?"*
   Restaurateurs, café owners, dental clinic owners, salon owners, hotel operators sizing a market, validating a lease, or sanity-checking what a peer told them at a conference. They came for the number. If the page makes them work for it, they leave.

2. **Accountants, consultants, and analysts triangulating against client data.**
   *"Is this client's 6% margin actually normal for restaurants in California, or is something wrong?"*
   They need the distribution, not the average. They want bottom-decile, median, top-decile in one glance. They will dismiss the site forever if any number looks fabricated.

3. **Journalists and researchers fact-checking a claim.**
   *"A source said grocery stores in Lagos pull $X — does that hold up?"*
   They need the methodology in plain language and the confidence the number was reported with. They will quote the site only if the credibility holds.

4. **Curious citizens who came in from a search engine.**
   *"How much does a coffee shop in New York make?"*
   They want the number, one paragraph of context, and the dignity of being treated as intelligent. They didn't ask for marketing.

What every persona shares: they want the **denominator**, not just the headline. Revenue without margin is theater. Average without distribution is a lie.

---

## Brand tone

**Reference register: The Economist briefing.** Not their 5,000-word features — the short explainers and weekly briefings. Confident, structurally grounded, allergic to slogans, numerically precise.

### What carries from the founder's voice
- **Editorial confidence, no hedging.** State facts and the structural reasons behind them. Not "could potentially indicate." "Coffee shops in Lisbon work because rent is unusually forgiving for the volume tourists move through them."
- **Metaphor for what the number actually means.** Cash machine. Seasonal pulse. Treadmill. Toll booth. The right metaphor compresses two paragraphs into a phrase the reader keeps.
- **Country-respectful specificity.** Each place gets the texture that distinguishes it. No country is a placeholder. *"In Lagos, the most reliable input cost is not flour but diesel."*
- **The "yes, but not the main reason" move.** Acknowledge the obvious explanation, then point at the deeper one. *"Margins are thin here, yes — but the real squeeze is staff turnover, not food cost."* (Note: in copy the em dash gets replaced with a semicolon or period.)
- **Quiet calibration.** When uncertain, say so plainly. Don't collapse uncertainty into bravado or hedging.

### What never appears
- First person of any kind. No "we," "us," "our," "I." The site is a thing, not a personality. Never sign anything. Never attribute opinions to a person.
- LinkedIn-style openings. No "Most people get this wrong:" No "Unpopular opinion:" No "Nobody is talking about this, but..."
- Personal anecdotes. "I once met a barber in Buenos Aires" — gone.
- Long philosophical asides. One paragraph of historical weight, then back to the number.
- Politically charged or polarizing takes. The site has opinions about *commerce*, not about *parties*. No commentary on elections, immigration, climate policy, named politicians, religion, or war outcomes.

---

## Anti-references

**Critical for design decisions.** When `impeccable` is choosing colors, type, layout, or motion, it should treat these as match-and-refuse patterns.

1. **NOT a startup-landing SaaS dashboard.** No purple-to-pink gradients, no big SaaS hero stat tiles, no "trusted by" logo wall, no big floating product screenshot with shadow, no "Get started free" stacked-CTA hero. The hero metric template is forbidden.
2. **NOT a Crunchbase / Pitchbook clone.** No investor-deck aesthetic. No dense data tables masquerading as design. No corporate stock photography.
3. **NOT a finance terminal.** Bloomberg green-on-black is wrong. So is any other "data feels serious if it's dark" reflex. The site is editorial, not surveillance.
4. **NOT a content farm or listicle site.** No "10 ways..." headers. No clickbait hero copy. No infinite scroll of identical cards. No related-article sidebars.
5. **NOT a generic AI-tool marketing page.** No "powered by AI" tagline. No glassmorphism cards. No neon-on-black hero. No isometric illustrations of laptops floating in space.
6. **NOT a course funnel or creator economy product.** No countdown timers, no fake scarcity, no testimonial carousel, no "as seen in" press strip with grayed-out logos.
7. **NOT an agency template.** No oversized hero video of a busy city skyline labeled "Global. Trusted. Bold." (See: own homepage, ironically — flag this on audit.)
8. **NOT a consulting-firm corporate site.** No earth-tone abstract photography of glass office buildings. No "About our values" gridded headshots.
9. **NOT playful or cartoonish.** No mascot. No illustrated characters. No friendly waving avatars. Emoji are tolerated only as data labels (industry glyphs on tiles).
10. **NOT a personal blog or essay collection.** The site is a benchmark resource, not a writer's portfolio. No author byline, no profile photo, no "About me."

---

## Strategic principles

These are the lenses the writer (and the designer) must internalize before composing a single page. Distilled from Section 1 of the style guide.

1. **The denominator is the story.** Revenue per seat, revenue per square meter, revenue per labor hour, revenue per location. Never report a nominal figure without the unit that makes it real. A design that lets the eye land on a big number without the qualifier next to it has failed the brief.

2. **History compounds.** Numbers today are residues of centuries. The site can be brief, but it must respect that no number arrives from nowhere. Type hierarchy should let a single sentence of historical weight sit comfortably next to a 2024 figure.

3. **Each country has unique character; never generic.** Brazil is not "an emerging market." Korea is not "an Asian tiger." Tirana is not "a city in Albania." Every place gets the texture that distinguishes it from its peers. Design must not use one country template applied identically to 191 countries.

4. **Incentives explain behavior.** People do what their constraints reward. A restaurant in Manhattan and a restaurant in Tirana are not the same business with different decor. The site's job is to make the structural difference visible, not paper it over with a uniform card.

5. **Geography is a brutal constraint.** Density, climate, coastline, neighbours, arable land, and resource endowment set what is possible. Write geography into the explanation; the design should leave room for it.

6. **Skepticism of hype, respect for craft.** Marketing language is a tell. Operators speak in numbers, constraints, and quiet certainties. The site's voice is closer to the operator than to the consultant. The visual tone follows: closer to a well-printed broadsheet than to a Series B pitch deck.

7. **The reader scrolled in for a number; reward the scroll.** Easy information at the top. Complexity rewards the scroll. Above the fold: the headline number and one sentence of context. First scroll: the structural framing. Second scroll: distribution and percentiles. Third scroll: caveats and methodology. Bottom: FAQ. Each scroll adds a layer, not a paragraph.

---

## Operational constraints carried through

A short list of non-negotiable rules from the style guide that affect what design can ship.

- **R-002: source agencies are never named in user-visible text.** The data speaks for itself; the apparatus stays invisible. Design cannot include a "powered by [agency]" badge, a sources strip, or a methodology page that lists registries by name.
- **No em dashes anywhere.** Use commas, semicolons, periods, parentheses. Also not `--`. Applies to UI copy, button labels, error states, marketing pages, blog. (En dashes for number ranges are fine: "$2-4M".)
- **No first-person.** Anywhere. Including FAQ answers.
- **No "Coming soon" stubs.** Sections with no usable data render nothing. Pages are shorter when data is thin but never broadcast brokenness. (See `src/lib/page-layout/section-order.ts`.)
- **No author byline; no human name as the site's voice.** Never sign anything.

---

## What "good design" looks like for this site

If a future designer or AI agent needs a single-sentence test:

> Would a senior editor at The Economist's data desk look at this page and say "yes, this is how we'd present this"?

If yes, ship it. If the answer is closer to "this looks like a Series B SaaS landing page that happens to be about benchmarks," start over.
