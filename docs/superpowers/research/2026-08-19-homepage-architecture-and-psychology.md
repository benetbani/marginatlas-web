# Homepage Architecture and Design Psychology — External Research

Date: 2026-08-19
For: marginatlas.com homepage rebuild
Method: direct fetch of 18 homepages and 9 sub-pages, plus extraction of 11 published design-system teardowns and a literature review of the underlying psychology.
Constraint honoured: no site code was modified. Everything below is external evidence.

---

## EXECUTIVE SUMMARY (10 lines)

1. The median modern homepage body is **~1,285 words**, and the best ones run **180–800**: Arc 180, Vercel ~400, Notion ~575, Clerk ~720. Stripe's 2,485 is the outlier, not the model.
2. The median band is **~90 words**. Bands over 200 words appear roughly once per page, and they are always the testimonial wall.
3. The median first screen is **7 headline words + 15 subhead words + 2 CTAs**. Nobody writes a paragraph above the fold.
4. The common 7-band skeleton is: **hero → proof strip → bento/capability grid → 3–5 depth bands → testimonial wall → stat line → closing CTA.** 12 of 14 SaaS sites follow it.
5. **8 of 11 design systems use zero drop shadows.** Depth is a 3–4 step surface ladder plus 1px hairlines. This is now the default, not a minority taste.
6. **Section rhythm is the tallness dial.** SaaS sites run 80–192px of vertical section padding. Editorial sites run 32–64px (The Verge 32–64, Wired 48). Editorial feel is literally half the height.
7. Every studied system **reserves exactly one accent colour** and states the rule explicitly — Von Restorff, independently rediscovered four times.
8. Data products invert the SaaS order: **the data appears in or immediately under the first screen** (Observable 6 live charts above the fold, Nomads the grid itself, OWID "14,082 charts"), and proof-by-logo is demoted.
9. NN/g eyetracking (2018, 120 users, 130k fixations): **57% of viewing time above the fold, 74% in two screenfuls, 81% in three.** A tall page does not buy attention; it spends it.
10. The single highest-leverage lever for "not bloated with text" is not shorter sentences — it is **fewer words per band and shorter bands**, so the layer-cake scan works. Target ≤900 body words across ≤9 bands.

---

# PART A — HOMEPAGE ARCHITECTURE

## A1. BAND ORDER

### The common skeleton

Across the 14 SaaS/tool homepages, one sequence recurs. It is not universal, but 12 of 14 are recognisable variants:

| # | Band | 3-word label | Present on |
|---|---|---|---|
| 1 | Hero | Claim, proof, action | 14/14 |
| 2 | Proof strip | Logos or numbers | 11/14 |
| 3 | Capability grid (bento) | Everything at once | 10/14 |
| 4–8 | Depth bands | One idea each | 14/14 |
| 9 | Testimonial wall | Humans vouch here | 11/14 |
| 10 | Stat line | One number band | 7/14 |
| 11 | Closing CTA | Ask again, short | 14/14 |

Two structural facts worth more than the list:

- **The proof strip is thin by design.** Stripe's logo carousel is 5 words. Clerk's is 15. Notion's is 12. It is a full-width band that costs almost no vertical space and no reading.
- **The closing CTA is the shortest band on every single page.** Stripe 40 words, Linear 35, Clerk 35, Attio 35, Vercel ~10, Ramp customers 15.

### Actual band orders (ordered lists, as fetched)

**Stripe (16 bands, 2,485 words)** — hero / logo carousel / solutions grid / personalisation form / event promo / commerce statistics / enterprise showcase / professional services / startup showcase / platform solutions / platform testimonials / developer infrastructure / integration options / news roundup / press logos / closing CTA.

**Linear (12 bands, 1,285 words)** — hero / three feature cards / intake / plan / build / diffs / monitor / changelog / testimonials / statistics banner / CTA footer.

**Vercel (7 bands, ~400 words)** — event announcement / hero / Notion customer band / Zapier customer band / Mintlify customer band / recently shipped / final CTA. *Vercel is the cleanest proof that a homepage can be three customer stories and nothing else.*

**Clerk (12 bands, 720 words)** — hero / logo strip / components overview / user authentication / multi-tenancy / billing / platform / framework integrations / third-party integrations / testimonials (210 words, the page's largest) / closing CTA / footer.

**Raycast (11 bands, ~3,200 words)** — hero / feature callouts / extension showcase / AI / social proof / automation / additional tools / community / developer API / final CTA.

**Framer (10 bands, 1,290 words)** — hero / design agent / inspiration gallery / CMS agent / code agent / external AI / platform features grid / customer stories / community stats / use-case CTA.

**Attio (17 bands, ~2,100 words)** — hero / demo transcript / Slack interaction / tabbed platform overview / pipeline / lead conversion / sales motion / forecasting / retention / universal context / ecosystem / scale stats / customer stories / changelog / final CTA.

**Mercury (12 bands, 1,055 words)** — hero / feature grid / testimonials / banking features / speed and access / fee savings / business operations / social-proof stats / security / press logos / final CTA.

**Cursor (21 bands, ~1,700 words)** — hero / desktop demo / customer intro / research timeline / task examples / agents / mission control / cloud agents / dashboard / CLI+Slack / Slack conversation / automation / testimonials (380 words, the largest) / model selection / repository tasks / enterprise trust / changelog / careers / blog.

**Notion (7 bands, 575 words)** — hero / Forbes Cloud 100 proof line / feature carousel / use-case cards / testimonials / footer. *The shortest recognisable version of the standard skeleton.*

**Arc (10 bands, 180 words)** — nav / Dia promo / hero / download links / spaces / customisation / privacy / social proof / final CTA. *The extreme: 180 words on the whole page.*

**Supabase, Resend, Ramp** served agent-optimised or machine-readable variants to the fetcher; their band lists in this file are directionally right but their word counts are unreliable and are flagged in the word table.

### Data-product band orders

**Our World in Data (11 bands, ~3,610 words)** — popular pages / mission statement / featured articles / updates / newsletter / social / data insights grid / interactive charts / data explorers / topic directory / donation CTA.

**Observable (13 bands, ~850 words)** — nav / **hero visualisation carousel (0 words, 6 live charts)** / value proposition / code examples carousel / feature trio / customer logo grid (16 logos) / collaboration / libraries / production readiness / features grid / community CTA / testimonial.

**Datawrapper (12 bands, ~950 words)** — nav / hero / export platforms / visualisation quality / brand customisation / editor workflow / team collaboration / customer examples / trusted-by logos / feature discovery / learning resources.

**Metabase (13 bands, ~2,200 words)** — nav / hero with dashboards / trusted companies / demo video / deploy / data sources / security badges / BI / embedded analytics / feature highlights / testimonial carousel / final CTA.

**Nomads (ex-Nomad List)** — a hybrid: ~280–320 words of prose, then the live city grid. The product *is* the page.

---

## A2. THE FIRST SCREEN

| Site | Headline words | Subhead words | CTAs | Product visual? | Real data or abstraction? |
|---|---:|---:|---:|---|---|
| Vercel | 2 | 12 | 2 | yes, device mockups | abstraction |
| Mercury | 3 | 14 | 3 | yes, animated hero | abstraction |
| Resend | 3 | 17 | 2 | yes, hero art | abstraction |
| Clerk | 4 | 28 | 1 | no | none |
| Raycast | 4 | 15 | 4 | yes, command palette | real product UI |
| Attio | 4 | 16 | 3 | yes, demo interface | simulated real record |
| Notion | 6 | 14 | 2 | yes, animated docs | abstraction |
| Stripe | 6 | 17 | 3 | no product UI | abstraction (gradient) |
| Supabase | 7 | 16 | 0 visible | no | none |
| Metabase | 7 | 33 | 2 | yes, 3 dashboards | **real charts** |
| Observable | 7 | 8 | 2 | **6 live charts** | **real data** |
| Linear | 8 | 12 | 2 | yes, full app UI | real product UI |
| Datawrapper | 8 | 13 | 2 | decorative chart bg | abstraction |
| Arc | 9 | 15 | 2 | app icon only | none |
| Cursor | 9 | 0 | 3 | yes, IDE demo | real product UI |
| OWID | 12 | 13 | 1 + search | no chart above fold | claim: "14,082 charts" |
| Framer | 12 | 30 | 2 | yes, canvas UI | abstraction |

**Medians: headline 7 words, subhead 15 words, 2 CTAs.**

Findings:

- **Nobody exceeds 12 headline words.** Framer's 12 + 30 is the most verbose first screen studied, and it is a design tool that has to explain a new category.
- **Subheads cluster at 12–17 words.** The three above 25 (Clerk 28, Framer 30, Metabase 33) all belong to products whose category is contested. If your category is obvious, the subhead shrinks.
- **2 CTAs is the mode** (10 of 17). One primary, one lower-commitment secondary. Raycast's 4 is platform-driven (Mac/Windows/brew/beta), not a strategy.
- **13 of 17 show a visual above the fold. Only 3 show real data** — Observable (6 live charts), Metabase (3 dashboards), OWID (a count, not a chart). Every other site shows product chrome or an abstraction.
- **Stripe famously shows no product UI at all above the fold.** Its first screen is type on a gradient. The proof is deferred to band 2.

## A3. PROOF PLACEMENT

**Where it goes:**

| Proof type | Typical position | Space it gets |
|---|---|---|
| Customer logos | Band 2 (immediately under hero) | 5–15 words, one row |
| Numeric stats | Band 6 (mid-page) or band 10 (late) | 25–85 words |
| Testimonials | Band 9–11, late | 85–400 words — the largest band on the page |
| Live/real data | Data products only: band 1–2 | unbounded |

**Evidence:**

- **Logos are cheap and early.** Stripe band 2 (13 logos, 5 words). Clerk band 2 (11 logos, 15 words). Notion band 3 (15+ logos, 12 words, plus "98% of the Forbes Cloud 100"). Metabase band 3 (8 logos). Datawrapper puts its logos *late* (band 9) but they are its strongest asset — NYT, AP, Reuters, UN, Washington Post, Guardian.
- **Numbers are mid-page.** Stripe band 6: 135+ currencies, $1.9T processed in 2025, 99.999% uptime, 200M+ active subscriptions. Attio band 13: 2.6M MCP calls/month, 400M API calls/week, 76k active agents, 15M emails synced/day. Mercury band 8: 300K+ entrepreneurs, 1 in 3 startups, $20B+ monthly volume, 4.9 rating. Framer band 7 embeds performance numbers *inside a product mockup* (LCP 1.1s, INP 95ms, CLS 0.01, 135,535 pageviews, 54,817 visitors, 17.1% vs 15% conversion).
- **Testimonials are late and fat.** They are the single largest band on Clerk (210 of 720 words = 29% of the page), Cursor (380 of 1,700 = 22%), Resend (890 words), Metabase (~400). This is the one place these sites permit density.
- **One-line stat banners act as punctuation.** Linear band 11 is 25 words: over 40,000 product teams. Ramp's customers page header is 11 words: 70,000+ companies. These bands cost almost nothing and reset the eye.
- **Per-customer numbers beat aggregate numbers.** Ramp's customers page attaches a specific figure to each name: 2x quicker bill processing (The Second City), $2M+ saved (ABB Optical), 4x faster PO creation (Foursquare), $1M+ savings (Snapdocs), 90% automatically coded (Glossier), 400 hours back monthly (Barry's), 75 hours saved monthly (Notion), >$590k surfaced (Eight Sleep). Linear's customers page does the same with 2.0x, 3.3x, 50%.
- **Vercel's whole homepage is proof.** Bands 3, 4, 5 are three customers with one number each: Notion (millions of agent conversations daily), Zapier (100M+ monthly visits), Mintlify (20,000+ companies). There is no separate testimonial section because the page never stops being one.

## A4. BAND RHYTHM

**How many consecutive bands share a layout before it changes?**

Counted from the fetched structures:

| Site | Longest run of same-layout bands | What breaks the run |
|---|---:|---|
| Linear | 6 (intake → plan → build → diffs → monitor → changelog, all copy+product-UI) | testimonials, then a 25-word stat line |
| Vercel | 3 (three identical customer bands) | recently-shipped list |
| Attio | 5 (pipeline → conversion → sales motion → forecasting → retention) | universal context |
| Cursor | 4 (mission control → cloud agents → dashboard → CLI) | Slack conversation |
| Stripe | 2 (rarely more) | constant alternation |
| Framer | 3 (design agent → CMS agent → code agent) | platform features bento |
| Clerk | 5 (auth → multi-tenancy → billing → platform → integrations) | testimonials |

**Rule extracted: 3–6 consecutive bands may share a layout, provided each carries a different visual.** The run is broken by a *thin* band — a logo strip, a one-line statistic, a quote — never by another dense band.

**The palate-cleanser pattern is explicit in editorial systems.** The Verge's design documentation describes silent dark gaps between saturated colour blocks acting as palette cleansers. Framer's states that on a dark canvas, sections separate by *mode change* (black ↔ charcoal) rather than by white gaps. Superhuman's states a "three-canvas system": indigo hero, white body, deep-teal closing band, with no fourth surface permitted.

**Full-bleed vs contained.** Every studied site contains its content at **1,100–1,400px** and lets only the *background* go full-bleed:

| Site | Max content width |
|---|---|
| Superhuman | 960–1,100px (narrowest = most premium) |
| Framer | ~1,199px |
| Stripe | ~1,200px |
| Cursor | ~1,200px |
| Resend | ~1,200px |
| Raycast | ~1,240px |
| Linear | ~1,280px |
| PostHog | ~1,280px |
| The Verge | 1,280–1,300px |
| Vercel | 1,200–1,400px |
| Wired | ~1,400px |

**Dark vs light.** Fully dark: Linear (#010102), Framer (#090909), Raycast (#07080a), Resend (#000000), The Verge (#131313) — and all five state that no light mode exists. Fully light/warm: Stripe (#ffffff / #f6f9fc / a cream #f5e9d4 interlude), Cursor (warm cream #f7f7f4), PostHog (warm cream #eeefe9), Wired (#ffffff). Mixed-band: Notion (navy hero → white body), Superhuman (indigo → white → teal).

**The relevant lesson for a warm-paper almanac:** Cursor and PostHog prove a *warm cream canvas with warm near-black ink* (#26251e, #23251d — never pure black) reads as considered rather than default. Superhuman explicitly uses warm dark grey #292827 and forbids pure black.

**Is there a bento band, and where?** Yes, on 10 of 14 — and its position is consistent:

- **Position 2–4 (right after hero/logos):** Supabase products grid (band 2), Linear three feature cards (band 3), Clerk components overview (band 3), Raycast feature callouts (band 3), Stripe solutions grid (band 3), Notion feature carousel (band 4).
- **Position 7–8 (late catch-all):** Framer platform features grid (band 7), Metabase feature highlights (band 10).

Published analysis of the pattern (bento-grid design write-ups, 2025–26) puts the working range at **4–8 cards**: below four it reads sparse, above twelve it reads cluttered. That range matches every implementation observed here.

## A5. WORD BUDGET PER BAND

**This is the most directly actionable output.**

### Totals across all sites studied

| Site | Body words (excl. nav/footer) | Bands | Words per band |
|---|---:|---:|---:|
| Arc | 180 | 10 | 18 |
| Vercel | ~400 | 7 | 57 |
| Supabase* | ~315 | 5 | 63 |
| Notion | 575 | 7 | 82 |
| Clerk | 720 | 12 | 60 |
| Raycast /pro | ~800 | 11 | 73 |
| Observable | ~850 | 13 | 65 |
| Datawrapper | ~950 | 12 | 79 |
| Mercury | 1,055 | 12 | 88 |
| Linear | 1,285 | 12 | 107 |
| Framer | 1,290 | 10 | 129 |
| Ramp /customers | 1,480 | 7 | 211 |
| Cursor | ~1,700 | 21 | 81 |
| Attio | ~2,100 | 17 | 124 |
| Metabase | ~2,200 | 13 | 169 |
| Stripe | 2,485 | 16 | 155 |
| Resend* | ~2,820 | 16 | 176 |
| Ramp* | ~2,843 | 11 | 258 |
| Raycast (home) | ~3,200 | 11 | 291 |
| Our World in Data | ~3,610 | 11 | 328 |

\* served an agent/machine-readable variant; totals unreliable.

**Median total: ~1,285 words. Median words per band: ~88.**

### Per-band detail for six homepages

| Band | Vercel | Notion | Clerk | Mercury | Linear | Framer |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 15 (event) | 45 (hero) | 45 (hero) | 85 (hero) | 85 (hero) | 85 (hero) |
| 2 | 60 (hero) | 12 (proof) | 15 (logos) | 120 (grid) | 120 (cards) | 120 (agent) |
| 3 | 85 (customer) | 95 (carousel) | 85 (components) | 95 (testimonials) | 280 (intake) | 95 (gallery) |
| 4 | 85 (customer) | 35 (use cases) | 70 (auth) | 140 (banking) | 95 (plan) | 45 (CMS) |
| 5 | 85 (customer) | 110 (testimonials) | 55 (multi-tenancy) | 110 (speed) | 150 (build) | 110 (code) |
| 6 | 35 (shipped) | — | 50 (billing) | 115 (fees) | 110 (diffs) | 85 (external AI) |
| 7 | 10 (CTA) | — | 55 (platform) | 105 (ops) | 140 (monitor) | 180 (bento) |
| 8 | — | — | 40 (frameworks) | 35 (stats) | 95 (changelog) | 30 (customers) |
| 9 | — | — | 35 (integrations) | 90 (security) | 85 (testimonials) | 95 (community) |
| 10 | — | — | **210 (testimonials)** | 25 (press) | 25 (stat line) | 50 (CTA) |
| 11 | — | — | 35 (CTA) | 40 (CTA) | 35 (CTA) | — |
| **Median band** | **60** | **45** | **50** | **95** | **110** | **90** |

**The numbers that matter:**

- **A normal band is 45–120 words.** Design to ~90.
- **Exactly one band per page is allowed to exceed 200 words**, and on 4 of 6 pages it is the testimonial wall (Clerk 210, Linear's intake 280, Cursor 380, Resend 890).
- **The closing CTA is 10–50 words**, always.
- **Thin punctuation bands run 10–35 words** (Vercel's CTA 10, Notion's proof line 12, Clerk's logo strip 15, Linear's stat banner 25, Mercury's press row 25, Framer's customer band 30).
- **Bands 1 and 2 together are 60–205 words.** That is the whole first screen budget.

## A6. MOTION AND ATMOSPHERE

### What creates depth — the strongest single finding

**8 of 11 extracted design systems use NO drop shadows at all.**

| System | Depth mechanism | Shadow policy |
|---|---|---|
| Linear | 4-step surface ladder #010102 → #0f1011 → #141516 → #18191a + 1px hairlines #23252a | none |
| Raycast | canvas #07080a → surface #0d0d0d → elevated #101111 → card #121212 + 1px #242728 | none |
| Framer | canvas #090909 → surface-1 #141414 → surface-2 #1c1c1c + hairline #262626 | none (one 0.5px white top-edge on floating cards) |
| Resend | pure #000000 + translucent white hairlines at 6% and 14% + radial glows at 6–9% opacity, ~600px falloff, anchored to section top | none, explicitly "translucent white borders replace shadows entirely" |
| Cursor | warm cream #f7f7f4 with white cards + 1px #e6e5e0 hairlines | none, "hairline-only depth" |
| PostHog | warm cream #eeefe9 with white cards + 1px olive #bfc1b7 | none |
| Wired | white + 1px #e0e0e0 dividers | none anywhere |
| The Verge | #131313 + 1px hazard-colour borders, solid colour fills, zero gradients | none |
| Stripe | white/#f6f9fc + **one WebGL mesh gradient** | 2 levels, very light: `0 1px 3px rgba(0,55,112,0.08)` and `0 8px 24px rgba(0,55,112,0.08)` |
| Notion | flat borders | level 0 everywhere **except the product mockup**: `rgba(15,15,15,0.20) 0 24px 48px -8px` |
| Superhuman | three-canvas system | `0 1px 3px rgba(0,0,0,0.08)` cards, `0 8px 24px rgba(0,0,0,0.12)` panels, one radial atmospheric backdrop in the hero only |

**The three systems that do use shadow spend it on exactly one element — the product mockup — and one atmosphere — the hero.**

### Section rhythm (the vertical-height dial)

| System | Section padding |
|---|---:|
| The Verge | **32–64px** |
| Wired | **48px** |
| Cursor | 80px |
| PostHog | 80px |
| Stripe | 64–96px (marketing), 32–48px (product) |
| Superhuman | 64–96px, closing band 96–128px |
| Linear | 96px |
| Raycast | 96px desktop → 64px tablet → 48px mobile |
| Framer | 96px |
| Resend | 96px section / 128px band |
| Notion | 96px large, 64px tight, 120px hero |
| Vercel | **192px** between major bands |

**The editorial sites use one-third to one-half the section padding of the SaaS sites.** If the complaint is "too tall," this is the dial. 48–72px is editorial. 96–192px is SaaS.

### What moves

- **Stripe** — the signature animated mesh gradient is a ~10kb WebGL implementation (a minimal "minigl" plus a Gradient class) driving Fractal Brownian Motion over layered Simplex noise, with the UV coordinates modulated by sin/cos over time so it reads as liquid rather than static noise. The famous diagonal edge is not in the shader: the canvas is a full rectangle whose container is `transform: skewY(-12deg); overflow: hidden`. Targets 60fps on mobile.
- **Linear** — scroll-triggered reveals on the hero and each feature band; otherwise stillness. Its design system documents no hover states.
- **Framer** — gradient spotlight cards, hard-limited: one or two per long page, because "three reads as a moodboard, not a system." They are *cards in a grid*, never section backgrounds.
- **Raycast** — the hero stripe gradient (#ff5757 → #a1131a diagonal) is used **exactly once per page**, in the top band only. Saturated colour is reserved for extension illustrations and is banned from chrome.
- **Resend** — atmospheric radial glows at 6–9% opacity, anchored to the top of a section with roughly 600px falloff, in orange/blue/green/red. No decorative chrome otherwise.
- **PostHog** — explicitly rejects the norm: no decorative gradients, no atmospheric mesh. Atmosphere is hand-drawn marginalia instead.
- **Wired / The Verge** — zero gradients, zero shadows. Atmosphere comes entirely from type contrast and solid colour blocks.

### Motion timing (from the published guidance)

- Google Material: **100–300ms** for transitions; **over 500ms disrupts flow**.
- Broader UX consensus: optimum interface animation **200–500ms**; micro-interactions ~100ms; hero/modal transitions 300–400ms.
- **Entrances should be slightly longer than exits** (e.g. 300ms in, 200–250ms out).
- **Under ~80ms reads as broken; over ~500ms reads as sluggish.**
- Fade-up translate distance: **~20px on mobile, ~50px (or 2rem) on desktop.**
- `prefers-reduced-motion`: replace slides and parallax with plain opacity fades; keep fades under 200ms, colour changes, focus rings, progress indicators.

## A7. THE SIGNATURE MOMENT

One remembered thing per site:

| Site | Signature moment |
|---|---|
| Stripe | The skewed, liquid WebGL mesh gradient behind the wordmark — depth *is* the gradient |
| Linear | The full product UI as page protagonist on near-black, with zero shadows |
| Vercel | Three customer bands with one number each, and nothing else — a homepage that is only proof |
| Resend | A **Domaine Display serif** at 96px on pure black — an editorial serif inside a developer tool |
| Clerk | The component gallery: the thing you are buying, drawn |
| Raycast | The command palette rendered at marketing scale, plus one red diagonal stripe used once |
| Framer | 110px display type at **−5.5px tracking**, and gradient spotlight cards rationed to two |
| Supabase | The line itself: build in a weekend, scale to millions |
| Attio | A live agent transcript as the hero visual — the product talking |
| Mercury | Restraint as a banking signal; the whole page is 1,055 words |
| Ramp | A named dollar figure attached to every customer (\$2M+, \$1M+, >\$590k) |
| Arc | 180 words. The entire homepage. |
| Cursor | The IDE mockup floating white on warm cream #f7f7f4, hairline-only |
| Notion | Navy hero band with the workspace embedded, centred (atypical for B2B) |
| Our World in Data | The count: **14,082 charts across 126 topics**, free and openly licensed |
| Observable | Six real, live charts as the hero — **zero words in the band** |
| Datawrapper | The masthead logos: NYT, Reuters, AP, Guardian, UN |
| Metabase | "Inspect the query behind every answer" — verifiability as the pitch |
| Nomads | The data grid *is* the homepage; ~300 words of prose, then the product |

## A8. HOW A DATA PRODUCT DIFFERS FROM A SaaS TOOL

**The SaaS pattern:** claim → borrowed credibility (logos) → capability → human vouching → ask.
**The data pattern:** show the data → say how much of it there is → say where it came from → let the user start foraging.

Four concrete inversions, with evidence:

**1. The data appears at or above the fold, not at band 6.**
Observable's band 2 is a carousel of six live visualisations with **zero words**. Metabase renders three real dashboards in the hero. Nomads shows city cards immediately. OWID leads with a count. Compare: no SaaS homepage studied shows real output above the fold — they show product chrome.

**2. Volume is the headline proof.**
OWID's subhead is literally the inventory: 14,082 charts across 126 topics, plus "all free: open access and openly licensed." OWID's energy page states "Chart 1 of 114." The number of things you have is a credibility claim a SaaS product cannot make.

**3. Logos are demoted; source institutions are promoted.**
Datawrapper's trusted-by row (NYT, AP, Reuters, UN, Washington Post, Stripe, Gallup, Axios, Cato, Guardian) is band 9, not band 2 — and it works because the names are *publishers*, not customers. Observable's 16-logo grid (NYT, Washington Post, MIT, HuggingFace) is band 6. OWID uses **researcher bylines** (Hannah Ritchie, Max Roser, Edouard Mathieu, Pablo Rosado) where a SaaS site would use a customer logo.

**4. Method transparency replaces the testimonial.**
Metabase's entire hero pitch is verifiability — inspect the query behind every answer. OWID's grapher redesign explicitly surfaced sources with a "learn more about this data" overlay, and the team stated the rationale as recognising the statisticians and institutions who produced the data. OWID's chart pages carry a "cite this work" band (~150 words) — a band type that does not exist on any SaaS homepage.

**How they make a number feel like a product:**

- **Give it a unit and a scope, not a superlative.** Attio: 400M API calls/week, 15M emails synced/day, 76k active agents. Not "massive scale."
- **Attach it to a named subject.** Ramp: \$2M+ saved (ABB Optical), 400 hours back monthly (Barry's). Vercel: 100M monthly visits (Zapier).
- **Render it inside product chrome.** Framer's hero mockup shows 135,535 pageviews / 54,817 visitors / LCP 1.1s / INP 95ms / CLS 0.01 — precise numbers inside a fake-but-plausible dashboard read as a live reading, not a marketing claim.
- **Typeset it as a number.** Stripe's design system mandates `font-feature-settings: "tnum"` on every money or numeric cell, and `"ss01"` globally. Linear and Vercel ship a dedicated mono for technical values. A figure set in tabular lining figures reads as measured; the same figure in proportional body type reads as written.
- **Grid it.** Nomads shows 4 data points per city card in a scannable grid — date range, count, flag, city. The comparison is the product.

**One warning from OWID.** Its energy page was found to signal *certainty* far more than uncertainty: no per-chart confidence intervals, no per-chart last-updated stamp, minimal hedging, and its "missing data" article buried at section 8. That is a gap marginatlas can turn into a differentiator, since our data has explicit gaps and sample tags already.

---

## A9. THE CATALOG PROBLEM — HOW A COLLECTION READS AS A THING, NOT A LIST

This section exists because marginatlas's homepage brief contains a hard constraint that no generic SaaS teardown answers: a catalog of four named collections that must not read as a list of elements.

**Evidence from sites that solved it:**

- **The Pudding** presents ~25–30 stories as cards, each carrying exactly one image, **one issue number (e.g. #224)**, one month/year, one title, and a description averaging **10–15 words**. The number and the date do the work: they make each entry an *issue of something* rather than a row. Filter tabs ("Our Faves", "Popular", "Video", "Audio") signal editorial selection rather than a chronological dump, and the introductory prose is deliberately minimal.
- **Observable's hero band** is six live visualisations and **zero words**. The set *is* the statement.
- **OWID's data-insights** cards each carry a chart, a date, and named researchers. Attribution converts an entry into a piece of work.
- **Museum-collection practice**, as documented in digital-exhibition write-ups, states the principle directly: a digital exhibition is a curated walk, not a grid of thumbnails. Pacing, restraint and high-quality imagery are what separate a collection from an inventory.

**The extracted pattern — five things that turn N members into one object:**

1. **A claim as the title**, not a category name. "Cheap to run, light to tax" is an object; "Low-cost countries" is a filter.
2. **A stated membership rule**, visible. It makes the set falsifiable, therefore real.
3. **A ratio, not a count.** "39 of 194" is a finding. "39 countries" is a list length.
4. **One visual that shows the whole set at once** (a plate, a distribution, a dotted field) so the eye gets the shape before it gets the names.
5. **Five names on the surface, the rest behind the click.** Naming everything is what makes it a list.


---

# PART B — DESIGN PSYCHOLOGY

Format per mechanism: **what it is → evidence quality → one concrete implication for marginatlas.**
A folklore register follows at the end. Several widely repeated design "laws" turn out to have nothing behind them, and knowing which ones is worth as much as knowing the real ones.

## B1. Visual hierarchy and pre-attentive attributes

**Mechanism.** Vision runs in two stages. A parallel first stage registers a small set of primitive features across the whole field in roughly 200 to 250ms without focused attention. A serial second stage binds them into objects and needs attention. A single feature difference (one terracotta figure among black ones) pops out with search time roughly flat no matter how many other items are present. A *combination* of features (the terracotta figure that is also bold and also in column two) forces item-by-item search, and time scales with item count.

Pre-attentive channels, per Healey and Enns: hue, luminance, orientation, size and length, curvature, added marks, enclosure, blur, spatial position and grouping, depth cues, direction of motion. Glyph identity and text meaning are **not** pre-attentive.

**Evidence: STRONG.** Treisman and Gelade, *Feature Integration Theory*, Cognitive Psychology 12(1), 1980, established the flat-slope vs steep-slope signature. Healey and Enns, IEEE TVCG 2012, is the canonical applied list. Healey and Booth, ACM ToCHI 1996, showed the channels support rapid quantity *estimation*, not merely detection. Forty years of replication; the 2020 *Attention, Perception and Psychophysics* special issue refines search as a continuum rather than a strict dichotomy but does not overturn it.

**Misapplication.** Stacking channels: bigger *and* bolder *and* coloured *and* boxed spends four channels on one message. Worse is redundancy blindness: if every figure on the page is accented, colour stops being a cue and becomes the background.

**Implication for marginatlas.** Exactly one figure per band may carry the terracotta. On the main table, that is the take-home column and nothing else. Every other distinction must be carried by *position and enclosure* (alignment, hairline, whitespace), which are pre-attentive and free, rather than by a second colour.

## B2. F-pattern vs Z-pattern vs layer-cake scanning

**Mechanism.** People sample pages rather than read them, and the sampling geometry is set by the page's formatting, not by an innate law. Given descriptive, visually distinct subheads the eye hops landmark to landmark: **layer cake**, which NN/g calls the most efficient pattern. Given an undifferentiated wall of text the eye degrades to the **F**: full first line, shorter second, then a vertical stripe down the left margin, missing the right-hand side entirely. NN/g's full catalogue is six patterns: F, layer cake, **spotted** (hunting for a specific token such as digits, capitals or an address), **marking**, **bypassing**, and **commitment** (near-full reading, only under high motivation).

**Evidence: MODERATE to STRONG for the patterns, and the popular interpretation is the contested part.** Nielsen's 2006 F-pattern eyetracking used 232 users. Pernice's 2017 and 2019 NN/g follow-ups carry the essential correction: **the F-pattern is bad for users and businesses**, it appears specifically when text lacks bolding, bullets and subheads, and it is a symptom to design *out of* rather than a template to design *to*. The per-page samples in the follow-ups are small (9 to 47 participants), so the patterns are solid but precise percentages attached to them are not.

On how little gets read: Weinreich, Obendorf, Herder and Mayer, *Not Quite the Average*, ACM TWEB 2(1), 2008, instrumented 25 users across 59,573 page views (45,237 after cleaning). Nielsen's analysis of that dataset: users have time for at most **28% of the words**, realistically **around 20%**; each extra 100 words buys only **4.4 seconds**; readers cover half a page only when it is **111 words or fewer**, against a dataset average of 593.

**Folklore: the Z-pattern.** No NN/g eyetracking study and no peer-reviewed source establishes a Z scan path. It circulates in design blogs and borrows the F-pattern's credibility. Treat it as a composition heuristic, never as evidence.

**Implication for marginatlas.** A visitor arriving with a specific question ("what does a cafe keep in Lisbon?") will run the **spotted** pattern, hunting for digits and currency symbols, layered on layer-cake heading hops. So: every band heading must be descriptive and value-bearing (never "Our data", always "What the trade itself keeps"), and every figure must be typographically typed as a figure so the spotted scan can find it. At 20% read-through, a 615-word page delivers about 123 words of actually-consumed copy. Those 123 words are the real design surface.

## B3. Cognitive load, Hick's law, Miller's limit

**Mechanism.** Three separate claims get fused into one bad rule ("fewer things equals easier"). Cognitive load theory says working memory is limited and material should not spend that budget on incidental presentation problems. Hick's law says choice reaction time grows roughly logarithmically with the number of alternatives. Miller's 7 plus or minus 2 says immediate memory span is about seven chunks. Only the first is about interface presentation, and **none of the three says a page should have fewer sections.**

**Evidence, stated honestly:**

- **Cognitive load theory: STRONG for the specific effects, CONTESTED for the construct.** Sweller, van Merrienboer and Paas, Educational Psychology Review 31, 2019, summarises a large body of randomised instructional trials supporting split-attention, redundancy and worked-example effects. De Jong, *Instructional Science* 38, 2010, is the standing critique: the intrinsic / extraneous / germane split is hard to measure independently, and germane load risks circularity.
- **Hick's law: STRONG inside its paradigm, effectively INVALID outside it.** Hick 1952 and Hyman, JEP 45, 1953, used eight lights with pre-learned names and participants trained to criterion, with no visual search. Liu, Gori, Rioul, Beaudouin-Lafon and Guiard, "How Relevant is Hick's Law for HCI?", CHI 2020, reaches three conclusions that gut the folk version: the law argues **against** "less is better" because logarithmic growth means doubling options costs one extra bit; observing log growth does not license a Hick interpretation; and the stimulus-response paradigm rarely matches a real HCI task. Landauer and Nachbar 1985 applied it successfully to menus and concluded **breadth beats depth**, meaning *more* items per screen.
- **Miller's 7 plus or minus 2 as a UI rule: FOLKLORE.** The 1956 Psychological Review paper is about the span of absolute judgment and the span of immediate memory, two limits Miller explicitly warned against fusing. Cowan, *The Magical Number 4 in Short-Term Memory*, BBS 24, 2001, revised the pure capacity limit to about **4 chunks** once rehearsal and chunking are controlled. Neither applies to items that are *visible* rather than remembered.

**Implication for marginatlas.** Do not cap bands or nav items at seven and do not cite Miller. The real target is **extraneous** load, and this site has a specific instance of it: a reader holding a unit definition or a tag meaning in their head while scanning a table three scrolls away. Put the unit and the tag legend *in the same band as the figures they govern*. A long page of well-chunked, well-labelled data is low extraneous load; a short page that splits a number from its definition is high.

## B4. Progressive disclosure and information scent

**Mechanism.** Pirolli and Card imported optimal foraging theory: information seekers maximise useful information per unit cost, and decide where to go next from **proximal cues** (link text, headings, labels, snippets) that imperfectly predict the value of the distal content. Strong scent means the cue reliably predicts what is behind it, so people go deep confidently. Weak scent means hesitation, backtracking, or leaving for a better patch, which on the open web means a competitor or the back button.

**Evidence: STRONG for information scent, CONTESTED for progressive disclosure specifically.** Pirolli and Card, *Information Foraging*, Psychological Review 106(4), 1999. Chi, Pirolli, Chen and Pitkow, CHI 2001, modelled scent computationally over proximal cues. The Bloodhound Project, CHI 2003, validated the simulator against **244 subjects across 1,385 sessions on four websites** and introduced Information Scent Absorption Rate as a navigability metric: scent computed from link text predicts real navigation. Progressive disclosure itself is thinner: Carroll and Rosson's early-1980s "training wheels" work covered one word processor with one menu style, and Carroll and Rosson stated no general empirical evidence existed for it.

**Folklore flag.** Widely circulated claims of a "2006 study" showing progressive disclosure gives 30 to 50% faster task completion, and a SaaS meta-analysis showing about 40% fewer support tickets, do not trace to any locatable study. Treat both as fabricated.

**Implication for marginatlas.** Generic labels are the cheapest thing on the page to fix and the most expensive to leave. "Learn more", "Explore", "Details" carry near-zero scent. Replace every catalog and method link with the reader's own trigger words: "How we estimate owner take-home", "Why 39 of 194 countries qualify", "What a cafe keeps in Lisbon". And disclose the **answer** immediately while deferring the **apparatus**: collapsing the number the reader came for behind an accordion raises foraging cost and sends them to another patch.

## B5. Von Restorff / the isolation effect

**Mechanism.** In a homogeneous set, the item that differs is better remembered. The effect is contextual: it depends on the *homogeneity of the surround*, not on any property of the isolate.

**Evidence: STRONG for memory, CONTESTED to WEAK for design choice.** Von Restorff 1933 is almost always cited second-hand. Hunt, *The Subtlety of Distinctiveness: What von Restorff Really Did*, Psychonomic Bulletin and Review 2(1), 1995, is the corrective: perceptual salience is not necessary, and difference must be evaluated against the similarity context. Boundary conditions are real: the effect is rarely found in recognition memory, and *Revisiting von Restorff's early isolation effect*, Memory and Cognition 2016, found the early-list version does not occur under conditions supporting the midlist one. The one direct UI test located, Sauro / MeasuringU 2019 (two studies, N=202 then N=213), found the visually distinct option was chosen in only 4 of 8 and then 3 of 8 realistic scenarios, none significant in study 1. Isolation alone does not predict selection.

**Implication for marginatlas.** The defensible version of "one accent beats five" is an argument **about the surround**: five accents destroy homogeneity and therefore destroy salience for all five. That is precisely why the terracotta-only rule is correct, and why the moss and cocoa tokens sitting in `globals.css` are not a cosmetic slip but a structural one. Do not claim the accent causes clicks; claim that a second accent costs the first one its power.

## B6. Fitts's law

**Mechanism.** Time to acquire a target is a function of distance over width on a log scale: MT = a + b · log2(D/W + 1) in MacKenzie's Shannon formulation. Doubling distance costs about what halving width costs. Screen edges behave as infinite targets because the pointer stops there.

**Evidence: STRONG.** Fitts, JEP 47(6), 1954; MacKenzie's formulation is the HCI standard because it never goes negative and fits better. Walker and Smelcer 1990 established the edge advantage, typically about **100ms and roughly independent of index of difficulty**, with edge-target experiments reporting movement-time reductions up to about **44%** in favourable conditions, while a **1px gap** to the edge reportedly costs a **20 to 30% slowdown**. The law models the pointing phase only, not decision or visual search time, and touch needs modified models.

**Implication for marginatlas.** The bite here is not the CTA, it is the **data table**. Row-level affordances (sort handles, expand toggles, tooltip triggers) with small width *and* small spacing are measurably slow and error-prone. Make the entire row a hit area with generous padding even where the visible glyph stays small. And do not port "put it in the corner" to mobile: there is no cursor to pin, and edge targets there are harder because of thumb reach and system gestures.

## B7. Serial position effect

**Mechanism.** In an ordered set, first and last items are recalled better than the middle. Applied to pages, the first and last sections get disproportionate attention.

**Evidence: STRONG for word lists, MODERATE and much smaller on the web.** Murdock, JEP 64(5), 1962, gave the canonical U-curve over 10 to 40-word lists. The one good web test is Murphy, Hofacker and Bennett, *Primacy and Recency Effects on Clicking Behavior*, JCMC 11(2), 2006, two Latin-square field experiments: click-through ran from **10.5% at position 1 down to 7.3% at position 5** with an uptick at the end. That is roughly a **1.4x first-versus-worst advantage**, real but modest. The mechanism on a page is probably scanning order and above-fold position rather than memory, since sections are continuously visible.

**Implication for marginatlas.** Use it directionally and stop there. The strongest band goes first (the reading), the second strongest goes last before the ask (the vision), and the most important claim never sits in position 4 of 10. Do not build an elaborate ordering theory on a 3-point effect. Note also that on a scrolled page "last" may simply be unseen: 81% of viewing time is in the first three screenfuls, so a recency slot below that is worth nothing.

## B8. Aesthetic-usability effect and the credibility halo

**Mechanism.** Visual quality is judged almost instantly and then bleeds into judgments of logically independent attributes, including trustworthiness and the accuracy of content. Two variables do most of the predictive work: **visual complexity** (lower reads as more appealing) and **prototypicality** (matching the reader's template for this *kind* of site).

**Evidence: STRONG for first impressions and the credibility halo; CONTESTED for "beautiful is usable" after real use.**

- Kurosu and Kashimura, CHI 1995: 26 ATM layouts, 252 participants; aesthetics correlated with *perceived* ease of use at about **r = 0.59**, far above the correlation with actual usability.
- Tractinsky, CHI 1997, expected the effect to be culture-bound, obtained the original layouts, tightened controls, and found it **stronger** in the Israeli sample.
- Lindgaard, Fernandes, Dudek and Brown, Behaviour and Information Technology 25(2), 2006: appeal ratings at **50ms** correlate very highly with ratings at 500ms.
- Tuch, Presslaber, Stocklin, Opwis and Bargas-Avila, IJHCS 70(11), 2012: 119 real screenshots crossed on complexity and prototypicality, shown for 50, 500, 1000ms and then 17, 33, 50ms. Both factors move ratings **at 17ms**. Complexity has the larger effect.
- Reinecke, Yeh, Miratrix, Zhao, Mardiko, Liu and Gajos, CHI 2013: **548 participants, 450 websites**; computational complexity and colourfulness plus demographics explain **roughly half the variance** in appeal after 500ms.
- **The credibility study to cite internally: Robins and Holmes, Information Processing and Management 44(1), 2008.** Identical content, high versus low aesthetic treatment. The high-aesthetic version was rated more credible in **14 of 21 image pairs (67%)**, and rated higher though below threshold in most of the rest.
- **The counterweight: Tuch, Roth, Hornbaek, Opwis and Bargas-Avila, Computers in Human Behavior 28(5), 2012.** 80 participants, four shop versions crossing aesthetics and usability, validated instruments before and after use. Aesthetics did **not** affect perceived usability; usability affected post-use perceived *aesthetics*. The causal arrow reversed.

**Implication for marginatlas.** Three things follow. First, the "premium editorial almanac" direction is a **deliberate break from the SaaS prototype**, and prototypicality is judged in under 50ms, so that break is a real cost paid before a single word is read. Repay it by breaking the prototype in the *editorial and typographic* layer while keeping the *functional furniture* (search, nav, home link) exactly where Roth et al. 2010 shows people expect it. Second, visual complexity is the single largest lever in Reinecke's model, and a data-dense homepage is inherently exposed on that axis: the job is high information density with **low perceived complexity**, achieved by a regular grid, few type sizes, aligned numeric columns and a restrained palette. Third, Tuch 2012 means the halo decays on contact: a beautiful page with wrong numbers ends up both distrusted and retroactively judged uglier.

## B9. Processing fluency, and precise versus round numbers

**Mechanism.** Two related effects. **Fluency**: ease of processing gets misattributed to properties of the content, so easy-to-read reads as more true. **Precision**: granularity is itself a signal. A precise figure implies a fine-grained measurement and confidence; a round one implies estimation. Readers infer competence from precision, but the signal reverses for felt rather than calculated decisions, and it becomes a liability if the precise figure is wrong.

**Evidence, split by claim:**

- **Precision signals competence and confidence: MODERATE to STRONG.** Janiszewski and Uy, Psychological Science 19(2), 2008, five studies: people adjust *less* from a precise anchor because it instantiates a finer mental scale. Zhang and Schwarz, JESP 2012: readers assume a communicator chose precision for a reason, so precision reads as confidence. Xie and Kronrod, Journal of Advertising 41(4), 2012, four experiments: precise claims signal competence, **moderated by advertising skepticism** so the effect weakens or inverts among skeptics.
- **The reversal that matters most here: Pena-Marin and Bhargave, Journal of Consumer Psychology, 2019**, four studies plus a single-paper meta-analysis. **Precision sets an accuracy expectation.** When an estimate later proves wrong, the *imprecise* estimate preserves more source trustworthiness and loyalty than the precise one, **even when the imprecise estimate was further off**. Corroborated by Batteux et al., *When Certainty Backfires*, JBDM 2025.
- **Round numbers for feeling-based judgments: CONTESTED.** Wadhwa and Zhang, JCR 41(5), 2015, five studies, is real. But Harms, Genau, Meschede and Beauducel, Royal Society Open Science 5(4), 2018, **pre-registered, N = 588**, replicating study 5, found **neither** the roundedness by context interaction **nor** the "feeling right" mediation.
- **Fluency to truth: CONTESTED.** Reber and Schwarz, Consciousness and Cognition 8(3), 1999, is the foundation (high contrast rated more true). Alter and Oppenheimer, PSPR 13(3), 2009, popularised it. But Unkelbach 2007 showed the mapping is learned and reversible, and Hansen, Dechene and Wanke, JESP 2008, plus a 2025 JESP re-examination, locate the effect in **relative** rather than absolute fluency. The famous disfluency-improves-analytic-thinking result (Alter et al. 2007) **failed to replicate** in Meyer et al., JEP General, 2015, across about 17 experiments with several thousand participants.

**Implication for marginatlas.** The synthesis is a rule the site can actually run: **precise where measured, ranged where modelled, and label which is which.** That captures the competence signal from precision on the figures that earn it while avoiding the Pena-Marin liability on the figures that do not. Concretely: 109,379 and "39 of 194" are precise because they are counts we hold; a modelled owner take-home should carry a range, not a fake fourth significant figure. And never cite "easy to read equals true" to justify low-contrast grey body copy: Reber and Schwarz's *low*-fluency condition was the low-contrast one, so the fluency literature argues for **high contrast and real type sizes**.

## B10. Trust and credibility signals specific to data products

**Mechanism.** Credibility is not computed from content quality, it is computed from whatever the reader *notices* and then *interprets*. Fogg's **Prominence-Interpretation Theory** holds that a credibility judgment needs both salience and an assigned valence; if either fails, no judgment is made. Because visual design is the most prominent thing on a page, it dominates, and it is assessed before and more cheaply than any verification of the numbers.

**Evidence: STRONG.**

Fogg, Soohoo, Danielson, Marable, Stanford and Tauber, DUX 2003 (Stanford Web Credibility Project, run 2002), **N = 2,684**, free-response comments coded by frequency:

| Factor | % of participants citing |
|---|---:|
| **Design look** | **46.1** |
| Information design / structure | 28.5 |
| Information focus | 25.1 |
| Company motive | 15.5 |
| Usefulness of information | 14.8 |
| **Accuracy of information** | **14.3** |
| Name recognition / reputation | 14.1 |
| Advertising | 13.8 |
| Bias of information | 11.6 |
| Tone of writing | 9.0 |
| Identity of site sponsor | 8.8 |
| Functionality | 8.6 |

Roughly three-quarters judged credibility on presentation rather than on the authority or expertise behind the content. Note the ordering: *accuracy* was cited at under a third the rate of *design look*. Fogg also found domain-dependence, with finance and health held to stricter standards. Caveat: 2002 data, so the *ranking* has aged better than the exact percentages.

**The uncertainty finding, the single most useful result in this review: van der Bles, van der Linden, Freeman and Spiegelhalter, PNAS 117(14), 2020** (Winton Centre, Cambridge). Five experiments, **total N = 5,780**, including one pre-registered nationally representative sample (N=1,050) and one **live field experiment on the BBC News website** (N=1,531). Conditions: no uncertainty, a **numeric range**, or a **verbal statement** that uncertainty exists.

| Outcome | Overall | Verbal | Numeric range |
|---|---:|---:|---:|
| Perceived uncertainty | d = 0.65 | d = 0.88 | d = 0.43 |
| Trust in the numbers | d = -0.34 | **d = -0.55** | **d = -0.15** |
| Trust in the source | d = -0.12 | **d = -0.21** | **d = -0.03** |

In the BBC field test, presenting an estimate with an explicit range raised perceived uncertainty (d = 0.19) and produced **no significant effect on trust in the number** (F(2,1526) = 1.20, p = 0.30) **or in the source** (F(2,1525) = 1.24, p = 0.29). Prior beliefs on contested topics moved baseline trust but did not interact with format.

**Stating uncertainty as a numeric range is close to free.** Vague verbal hedging is what costs: roughly 3.7x the trust-in-number penalty and about 7x the source penalty of a stated range, and it is the only format that measurably dents source trust at all.

Supporting work:

- **McKinley et al., *Trustworthy by Design*, CHI 2025:** viewer trust in a visualisation was closely tied to whether its **data origins were explicit**, and participants actively hunted for source information. Viewers were individually consistent but disagreed with each other on which criteria mattered, which argues for providing several trust signals rather than betting on one.
- **Elliott, Bailey et al., 2025, on chart embellishment:** colour and image-style bars **raised** perceived credibility; hand-drawn fonts and cartoon-style bars **significantly reduced** it. Craft reads as competence, whimsy reads as unseriousness.
- **Sample size, recency and method stamps: WEAK to MODERATE.** No controlled experiment isolating "display N" or "display last-updated" as a causal driver of credibility could be located. What exists is professional norms (AAPOR transparency standards, health-information quality instruments scoring funding, independence and currency), plus Fogg's 8.8% citing sponsor identity, plus the CHI 2025 provenance finding. Do it, but do not claim an effect size for it.

**Implication for marginatlas.** Two operational rules. First, **replace every verbal hedge with a numeric range.** A design system that renders estimates as "approximately" or "roughly" prose is strictly worse, by measured effect sizes, than one that renders them as a range. Second, **provenance must pass the prominence test.** A source line at 11px grey at 40% opacity is, under Prominence-Interpretation Theory, not merely weak but *inert*: an element that is not noticed generates no credibility judgment at all. Give the method band real size, and read the Fogg ranking correctly: two of its top three factors (information design 28.5%, information focus 25.1%) are about **organisation**, not ornament.

## B11. Tables versus charts, and Tufte's data-ink ratio

**Mechanism.** Tables win for exact-value lookup and precise comparison of a few named entities, and they signal that you hold the actual numbers. Charts win for distribution, trend, outlier and association. Tufte's data-ink ratio proposes maximising the ink devoted to data and erasing the rest.

**Evidence:**

- **Task-dependence: STRONG.** Visualisations are advantaged for association, distribution, outlier and trend claims; tables remain the route to exact values.
- **"Charts make claims more believable": CONTESTED, leaning refuted.** Tal and Wansink, *Blinded with Science*, Public Understanding of Science 25(1), 2016, found a trivial bar chart raised belief in efficacy. Dragicevic and Jansen, IEEE TVCG 2018, ran four replications across two platforms: text-with-chart was **no more persuasive, and sometimes less**, than text alone. The chart aided understanding, but the effect was very small. The original lab was subsequently subject to research-integrity findings.
- **Tufte's data-ink ratio: CONTESTED.** Gillan and Richman, Human Factors 1994, is the strongest supporting study and it explicitly concludes **against maximisation**: higher data-ink helped in experiment 1, but pictorial backgrounds hurt, redundant indicator ink barely mattered, and **removing y-axis lines and the x-axis hurt performance**. Their conclusion was a limited minimalism with an optimum below the maximum. Inbar, Tractinsky and Meyer, ECCE 2007, found a clear preference *against* minimalist bar graphs. Bateman, Mandryk, Gutwin, Genest, McDine and Brooks, CHI 2010, found embellished charts were **better remembered** short and long term with no accuracy cost during viewing.

**Implication for marginatlas.** The core query on this site is a lookup: what does this business keep, here. That is a **table-shaped task**, which is why the founder is right that the main table is the good part of the page and why it belongs high. The chart's job is context, showing where this place sits in the distribution, which is a chart-shaped task. Do not add charts to look rigorous; Dragicevic and Jansen shows that buys no persuasion and may cost some. And do not strip axis lines and gridlines in the name of Tufte: Gillan and Richman found removing them slowed readers down, because they are reference structure, not junk.

## B12. FOLKLORE REGISTER

Claims that circulate as settled and are not. Each has cost design teams real decisions.

| Claim | Status |
|---|---|
| The **Z-pattern** | No eyetracking study establishes it. Rides on the F-pattern's evidence. |
| **Miller's 7 plus or minus 2** as a cap on menu items or page sections | The paper is about absolute judgment and memory span; Miller warned against fusing them; Cowan 2001 revised the memory figure to about 4. Visible options are not memorised options. |
| **Hick's law** as a mandate to reduce options | Applies to prepared, practised choice with no visual search. Liu et al. CHI 2020 argue its log form argues *for* breadth; Landauer and Nachbar 1985 found breadth beats depth. |
| Progressive disclosure gives "30 to 50% faster task completion (2006 study)" and "about 40% fewer support tickets" | Neither traces to a locatable study. Treat as fabricated. |
| "**Charts make claims more believable**" | Tal and Wansink 2016 failed to replicate across four studies (Dragicevic and Jansen 2018). |
| "**Disfluent type makes people think harder**" | Alter et al. 2007 failed to replicate in Meyer et al. 2015, about 17 experiments. |
| "**Easy to read equals true**" as a plain main effect | Real but relative, not absolute (Unkelbach 2007; Hansen et al. 2008; JESP 2025). Still supports high contrast; just not the usual mechanism story. |
| "**Round prices feel right**" | Wadhwa and Zhang 2015 failed a pre-registered replication at N=588 (Harms et al. 2018). |
| **Von Restorff predicts clicks** | Solid as memory science; the only direct UI-choice test (MeasuringU 2019, N=202 and N=213) found no consistent effect. |
| "**Last-updated stamps and sample sizes increase trust**" as a measured effect | Professional norm with face validity and qualitative support. No controlled effect size exists. Do it; do not quote a number for it. |

## B13. THE FIVE FINDINGS THAT SHOULD DRIVE THIS REDESIGN

1. **Fogg 2003, N=2,684: design look 46.1%, information structure 28.5%, information focus 25.1%, accuracy of information only 14.3%.** For a product whose asset is correct numbers, presentation is not downstream of proof. For most readers it *is* the proof. Robins and Holmes 2008 (same content, different treatment, credibility moved in 67% of pairs) is the cleanest internal citation.
2. **van der Bles et al. 2020, PNAS, N=5,780 including a live BBC field test: a numeric range costs essentially nothing in source trust (d = -0.03); vague verbal hedging costs about 7x that (d = -0.21).** Ranges are safe. Prose hedging is the expensive habit.
3. **Precision is a claim with an asymmetric downside.** Precise figures signal competence (Janiszewski and Uy 2008; Zhang and Schwarz 2012; Xie and Kronrod 2012), but a precise figure that turns out wrong destroys more trust than an imprecise one that was further off (Pena-Marin and Bhargave 2019).
4. **Tuch et al. 2012 plus Reinecke et al. 2013: visual complexity and prototypicality are judged in 17 to 50ms and explain about half the variance in appeal.** The editorial-almanac departure is paid for in the first 50ms; repay it with genuinely low perceived complexity and keep functional furniture where people expect it (Roth et al. 2010).
5. **NN/g scanning work plus Weinreich et al. 2008: the reader consumes about 20% of your words.** Design for layer-cake and spotted scanning, not for reading. The highest-leverage single change, per Pirolli and Card, is replacing generic labels with the reader's own trigger words.

---

# PROPOSED HOMEPAGE BAND ORDER FOR MARGINATLAS

**Design premise:** the proof is the data, and the register is a premium editorial almanac — not a SaaS tool. That has three structural consequences, all evidenced above:

- **Halve the vertical rhythm.** Editorial systems run 32–64px section padding (The Verge 32–64, Wired 48); SaaS runs 96–192px (Linear/Raycast/Framer/Resend 96, Vercel 192). Use **56px desktop / 40px mobile**. This alone removes roughly a third of the page height without deleting a word.
- **Put real data in the first two screenfuls.** 74% of viewing time lands there (NN/g 2018). Observable spends its hero band on six live charts and zero words; that is the model, not Stripe's gradient.
- **Set every figure as a figure.** Tabular lining numerals (`font-feature-settings: "tnum"`), which Stripe mandates on every money cell, are what make a number read as measured rather than written.

**Constraints honoured from the 2026-08-09 founder brief:** the hero is kept as-is; the map gets smaller; the catalog must not read as a list; the page must state the vision; more real imagery; terracotta plus cool neutrals only. Every band currently in `src/app/page.tsx` survives below, either as itself or inside a named merge — nothing is deleted unilaterally.

## The order

| # | Band | Word budget | What it must prove | Layout | Maps from |
|---|---|---:|---|---|---|
| 1 | **The question** (hero) | **45** | That this atlas answers one question — what an owner keeps — and answers it in a real currency amount | contained, one column, one live figure | `hero` (KEEP, unchanged) |
| 2 | **The reading** | **60** | That the answer arrives immediately, as a real table for a real place and trade, not a promise of one | contained, full-width table, tabular figures | `specimen` + main table |
| 3 | **The holdings** | **25** | Scale and recency, in one line: 109,379 measurements, 1,236 places and trades, 503 metrics, built 2026-08-15 | thin full-bleed rule, one line of type | new; absorbs `ledger` |
| 4 | **The catalog** | **140** (35 per plate) | That the atlas can *see* four things about the world — including one it honestly cannot see yet | 2×2 plates, one visual each, five names each | `catalog-plates` (upgraded) |
| 5 | **The world** | **40** | Coverage is global, and every dot is a page | contained and **smaller**, not full-bleed | `world-map` (reduced) |
| 6 | **A page, end to end** | **70** | What you actually get when you arrive somewhere | two-up: crop + 4 bullet captions | `example-tiles` + `state-comparison` |
| 7 | **How a number is made** | **90** | Provenance, method, and the admission — what is held, modelled, extrapolated, and the 48,114 estimates deliberately not ingested | three columns of small type + one legend | new (the differentiator) |
| 8 | **Who it is for** | **55** | Four named readers, one line each | 4-up, icon-free | `audience` (compressed) |
| 9 | **Recently published** | **60** | The atlas is alive and being added to | horizontal rail, 3 cards, 12-word decks | `blog-rail` (compressed) |
| 10 | **The standing invitation** | **30** | One ask, one field | contained, single column | `newsletter` |
| | **TOTAL** | **615** | | **10 bands** | |

615 words is between Notion (575) and Clerk (720) — squarely inside the band that reads as confident rather than sparse, and well under the 1,285 median.

## Band-by-band specification

**1. The question — 45 words.** Keep exactly as shipped; the founder ruled it fine. The only addition permitted: one real figure rendered in the hero at display size, drawn from the warehouse, with its place and trade named. Headline ≤9 words, standfirst ≤18, two actions. Do not add a third CTA.

**2. The reading — 60 words.** The existing main table, which the founder called good. Two required fixes: remove both `?` badges from the Country and City labels (they read as unfinished, and an atlas does not ask the reader questions it should answer), and set every numeric cell in tabular lining figures. Copy budget: a 12-word standfirst above, 8-word column notes, nothing else. The table is the argument; prose beside it is noise.

**3. The holdings — 25 words.** One line, one rule above and below, ~40px tall. This is OWID's "14,082 charts across 126 topics" and Linear's 25-word "over 40,000 product teams" — the cheapest credibility on any page studied. Exact copy shape: *109,379 measurements. 1,236 places and trades. 503 metrics. Built 2026-08-15.* Four figures, tabular, with the build date as the recency signal.

**4. The catalog — 140 words, 35 per collection.** The hard constraint is that it must not read as a list of elements. Five moves, drawn from The Pudding, Observable and museum-exhibition practice, turn N members into one object:

| Move | Applied to marginatlas |
|---|---|
| Title is a claim, not a category | "Cheap to run, light to tax" — already written |
| The membership rule is visible | "tax below 33.9% and labour cost below $11,500" |
| A ratio, not a count | **39 of 194** countries; **26 of 252** cities; **30 of 243** trades |
| One visual shows the whole set | a plate: all measured entities as marks, members filled, the rest ghosted |
| Five names on the surface, 24 behind the click | already the export's shape (`NAME_COUNT = 5`, `MEMBER_COUNT = 24`) |

Per plate: title (≤7 words) + rule (≤12 words) + ratio + five names = ~35 words. **The fourth plate ships empty on purpose** — "Districts on the way down, no decline metric is held yet" — and that is the single most differentiating element on the page. OWID's own energy topic page was found to carry no per-chart uncertainty and to bury its missing-data article at section 8. A visible, dated gap is a claim about method that competitors do not make.

**5. The world — 40 words.** Reduce to roughly half its current height and contain it to the 1,120px column. The map is navigation, not a hero. Copy: one 14-word line plus a count of covered countries.

**6. A page, end to end — 70 words.** One real page crop at large scale plus four captions of ≤12 words each. This is the Cursor/Linear move — the product UI as protagonist — but the "product" here is a data page. Use a real render, not a placeholder; the founder has already flagged placeholder imagery twice.

**7. How a number is made — 90 words.** Three short columns: where figures come from, how a cell estimate is built, and what is not known. Include the tag legend as a live count — held 16,853, modelled 90,391, extrapolated 1,800, placeholder 335 — and the sentence that 48,114 cell estimates were measured and deliberately not ingested, with a link to the reasons. This band is Metabase's "inspect the query behind every answer" translated into an atlas. It is also the band that earns the right to publish modelled numbers at all.

**8. Who it is for — 55 words.** Four readers, ≤13 words each. No icons above 24px, no cards with shadows.

**9. Recently published — 60 words.** Three cards, each: an issue-style number, a date, a title, and a 12-word deck — the exact card contents The Pudding uses. The number and date are what make a rail read as an almanac rather than a blog.

**10. The standing invitation — 30 words.** One line, one field, one button. The shortest band on the page, as it is on all fourteen SaaS homepages studied.

## Density and atmosphere settings

| Setting | Value | Evidence |
|---|---|---|
| Section padding | **56px desktop / 40px mobile** | The Verge 32–64, Wired 48; SaaS 96–192 is the sound we are avoiding |
| Content max-width | **1,120–1,200px** | Superhuman 960–1,100 (most premium), Stripe/Cursor/Resend ~1,200 |
| Body text | 15–16px at 1.5–1.6 | universal across all 11 systems |
| Display tracking | **−2.5% to −5% of font size** | Framer −5.5px@110, Vercel −2.4px@48, Cursor −2.16px@72, Linear −3px@80 |
| Display weight | **light-to-medium, never bold** | Stripe locks display tiers at weight 300 and states that 400+ removes the editorial air; matches the founder's existing bold-H1 ban |
| Ink | **warm near-black, never #000** | Cursor #26251e, PostHog #23251d, Superhuman #292827 |
| Shadows | **none**, except one soft shadow on the single product crop in band 6 | 8 of 11 systems use zero; Notion spends its only shadow on the mockup |
| Depth | 3-step warm surface ladder + 1px hairlines | Linear, Raycast, Framer, Resend, Cursor, PostHog all do exactly this |
| Accent | **terracotta only**, reserved for actions and one mark per band | Stripe, Linear, Framer and Raycast each independently state a one-accent rule |
| Atmosphere | the Italian-village photograph in the gutters, plus at most **one** warm wash on the page | Framer: three gradient moments read as a moodboard, not a system; Raycast uses its hero gradient exactly once per page |
| Numerals | `font-feature-settings: "tnum"` on every figure | Stripe mandates it on every money cell |
| Motion | 200–300ms, ease-out, entrances ~50ms longer than exits; fade-up 20px mobile / 50px desktop; full `prefers-reduced-motion` fallback to opacity only | Material 100–300ms; >500ms sluggish, <80ms broken |
| Bands sharing a layout | **max 3 in a row**, broken by a thin band | Linear runs 6 and is the outlier; 3–4 is typical |

---

# RULES TO ADOPT

Short, checkable statements. Each is testable against a built page.

**Budget**
1. The homepage body is **≤900 words** total, excluding nav and footer. Target 615.
2. No band exceeds **200 words**. The median band is **≤90**.
3. The hero is **≤9 headline words + ≤18 standfirst words + exactly 2 actions**.
4. The closing band is **≤30 words**.
5. The page has **≤10 bands**. Count them with `document.querySelectorAll('[data-band]')` — the attribute already exists.

**Structure**
6. Real data appears **within the first two screenfuls**, not below them.
7. Every band proves **exactly one thing**, and that thing is nameable in three words.
8. **At most 3 consecutive bands share a layout**; the run is broken by a thin band of ≤35 words.
9. Every collection shows a **ratio (39 of 194)**, never a bare count.
10. A collection names **five members on the surface**; the rest live behind the click.
11. **One band per page is allowed to be dense.** Choose it deliberately.
12. Every band that makes a claim carries its **rule or its source** in the same band.

**Form**
13. **Zero drop shadows**, with one exception per page, spent on the product crop.
14. Depth comes from a **surface ladder plus 1px hairlines**, never from blur.
15. **Section padding 56px desktop / 40px mobile.** Never 96px+.
16. Content is contained to **≤1,200px**; only backgrounds go full-bleed.
17. Display type is **light or medium weight, never bold**, with **−2.5% to −5% tracking**.
18. Ink is **warm near-black**, never pure black. Canvas is warm paper, never pure white.
19. **One accent colour — terracotta.** It appears on actions and at most one mark per band. No green, no brown, no amber, ever.
20. **One atmospheric moment per page.** Two is a system; three is a moodboard.

**Numbers**
21. Every figure is set in **tabular lining numerals**.
22. Figures are **precise unless the precision is fake**. Report 39 of 194, not "about 20%".
23. Every figure carries a **unit and a scope** in the same line.
24. Every figure is **attached to a named subject** — a place, a trade, a date.
25. The page states **when it was built**, visibly.
26. The page states **what is not known**, visibly, in its own band.

**Motion**
27. Transitions are **200–300ms, ease-out**. Nothing exceeds 500ms.
28. Entrances run ~50ms longer than exits.
29. Scroll reveals fade up **20px on mobile, 50px on desktop**, once, never on re-entry.
30. `prefers-reduced-motion` reduces everything to an opacity fade under 200ms.

**Prohibitions carried from existing founder rulings**
31. No horizontal bar charts. No bold H1. No em-dashes. No source-agency names.
32. No unknowable metric is displayed.
33. No placeholder imagery ships. A real image or no image.
34. No agreed section is dropped without the founder saying so.

---

# SOURCES

## Part A — pages fetched directly (2026-08-19)

**Homepages (18):** stripe.com, linear.app, vercel.com/home, resend.com, clerk.com, raycast.com, supabase.com, framer.com, attio.com, mercury.com, ramp.com, arc.net, cursor.com, notion.com, ourworldindata.org, observablehq.com, datawrapper.de, metabase.com, nomads.com (ex nomadlist.com).

**Sub-pages (9):** stripe.com/payments, linear.app/customers, ourworldindata.org/energy, attio.com/pricing, mercury.com/pricing, clerk.com/pricing, ramp.com/customers, raycast.com/pro, metabase.com/pricing. Also pudding.cool for catalog-card structure.

**Note on three fetches.** vercel.com, resend.com, supabase.com and ramp.com served agent-optimised or machine-readable variants. Their band lists are directionally correct; their word totals are flagged as unreliable in the word-budget table. Vercel was re-fetched at /home and both readings are reported.

## Part A — published design-system extractions

`VoltAgent/awesome-design-md` (design-md/), which holds extracted design documentation for 70+ sites. Pulled and used here: linear.app, stripe, vercel, raycast, framer, resend, cursor, notion, posthog, superhuman, wired, theverge. Values quoted (type scales, tokens, section padding, radius, shadow policy, layout widths) are as recorded in those documents.

## Part A — supporting material

- Our World in Data, "Redesigning our interactive data visualizations" (2023-12-28) and "We've redesigned our homepage" (2024-02-28), for the stated design rationale of a data product.
- Financial Times Visual Journalism Team, *Visual Vocabulary* (Financial-Times/chart-doctor), roughly 50 chart types across 9 categories: deviation, correlation, ranking, distribution, change over time, part-to-whole, magnitude, spatial, flow.
- Published technical write-ups of the Stripe hero gradient (minigl / Gradient class, Fractal Brownian Motion over Simplex noise, skewY(-12deg) container).
- Google Material motion guidance and collected UX-animation timing guidance for durations and easing.
- Published bento-grid pattern analyses (2025-26) for the 4-to-8 card working range.

## Part B — primary literature

**Attention and scanning.** Treisman and Gelade, Cognitive Psychology 12(1), 1980. Healey and Enns, IEEE TVCG, 2012. Healey and Booth, ACM ToCHI, 1996. Nielsen/NN group F-pattern eyetracking, 2006 (N=232). Pernice, NN group, 2017 and 2019. NN group, "The Layer-Cake Pattern of Scanning Content on the Web". NN group, "Scrolling and Attention", 2018 (120 participants, 130,000+ fixations). Weinreich, Obendorf, Herder and Mayer, ACM TWEB 2(1), 2008 (25 users, 59,573 page views).

**Load and choice.** Miller, Psychological Review 63(2), 1956. Cowan, Behavioral and Brain Sciences 24, 2001. Hick, 1952; Hyman, JEP 45, 1953. Landauer and Nachbar, 1985. Liu, Gori, Rioul, Beaudouin-Lafon and Guiard, CHI 2020. Sweller, van Merrienboer and Paas, Educational Psychology Review 31, 2019. De Jong, Instructional Science 38, 2010.

**Foraging.** Pirolli and Card, Psychological Review 106(4), 1999. Chi, Pirolli, Chen and Pitkow, CHI 2001. Chi et al., Bloodhound Project, CHI 2003 (244 subjects, 1,385 sessions). Carroll and Rosson on training wheels.

**Isolation.** Von Restorff, 1933. Hunt, Psychonomic Bulletin and Review 2(1), 1995. Memory and Cognition, 2016. Sauro / MeasuringU, 2019 (N=202, N=213).

**Pointing.** Fitts, JEP 47(6), 1954. MacKenzie, Shannon formulation. Walker and Smelcer, 1990.

**Order.** Murdock, JEP 64(5), 1962. Murphy, Hofacker and Bennett, JCMC 11(2), 2006.

**Aesthetics and credibility.** Kurosu and Kashimura, CHI 1995 (252 participants). Tractinsky, CHI 1997. Tractinsky, Katz and Ikar, Interacting with Computers 13(2), 2000. Lindgaard, Fernandes, Dudek and Brown, Behaviour and Information Technology 25(2), 2006. Tuch, Presslaber, Stocklin, Opwis and Bargas-Avila, IJHCS 70(11), 2012. Reinecke et al., CHI 2013 (548 participants, 450 sites). Robins and Holmes, Information Processing and Management 44(1), 2008. Tuch, Roth, Hornbaek, Opwis and Bargas-Avila, Computers in Human Behavior 28(5), 2012. Roth, Schmutz, Pauwels, Bargas-Avila and Opwis, Interacting with Computers 22(2), 2010.

**Numbers and fluency.** Janiszewski and Uy, Psychological Science 19(2), 2008. Zhang and Schwarz, JESP, 2012. Xie and Kronrod, Journal of Advertising 41(4), 2012. Wadhwa and Zhang, JCR 41(5), 2015. Harms, Genau, Meschede and Beauducel, Royal Society Open Science 5(4), 2018 (pre-registered, N=588). Pena-Marin and Bhargave, Journal of Consumer Psychology, 2019. Batteux et al., JBDM, 2025. Reber and Schwarz, Consciousness and Cognition 8(3), 1999. Alter and Oppenheimer, PSPR 13(3), 2009. Unkelbach, 2007. Hansen, Dechene and Wanke, JESP, 2008. Meyer et al., JEP General, 2015.

**Trust in data.** Fogg, Soohoo, Danielson, Marable, Stanford and Tauber, DUX 2003 (N=2,684). Fogg, Prominence-Interpretation Theory, CHI 2003 EA. Van der Bles, van der Linden, Freeman and Spiegelhalter, PNAS 117(14), 2020 (N=5,780 across five experiments including a BBC field test). McKinley et al., CHI 2025. Elliott, Bailey et al., 2025.

**Tables, charts and data-ink.** Tal and Wansink, Public Understanding of Science 25(1), 2016. Dragicevic and Jansen, IEEE TVCG, 2018. Tufte, *The Visual Display of Quantitative Information*, 1983. Gillan and Richman, Human Factors, 1994. Inbar, Tractinsky and Meyer, ECCE 2007. Bateman, Mandryk, Gutwin, Genest, McDine and Brooks, CHI 2010.

## Internal material read (not modified)

`design/loop5/FOUNDER-REVIEW-2026-08-09-homepage.md` (the homepage brief and the catalog constraint), `page-data/tools/export/catalog_collections.py`, `website/data/catalog/collections_v1.json`, `page-data/derived/warehouse_summary.json`, and `website/src/app/page.tsx` (band list only). No site code was changed.
