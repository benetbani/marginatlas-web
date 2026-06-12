# Five design-tool prompts for Atlas visual assets (2026-06-12)

Paste each block (including the SHARED BRAND BLOCK at the top) into Claude's design tool. Each produces a cohesive BUNDLE, not a one-off. They supplement the page build: icons, pictograms, a data-viz language, editorial illustrations, and restrained motion.

---

## SHARED BRAND BLOCK (prepend to every prompt)
```
Brand: Margin Atlas (marginatlas.com), the world atlas of local profit intelligence.
Personality: a sharp friend who has the numbers. Warm, precise, plainspoken, editorial,
world-class but human. Never corporate, never clip-arty, never gimmicky, never cringe.
Aesthetic north star: a beautiful modern atlas / a sharp financial almanac that a thoughtful
human made. Line-based, warm, precise, generous whitespace, paper-like.
Palette: signature vermillion/maroon accent (deep maroon-red #991600 primary, bright
vermillion #e62200 accent), ink near-black #1A1A1A, warm cream/parchment backgrounds,
warm cocoa brown, a muted moss green as the only secondary accent. Mostly ink + cream with
vermillion used sparingly as the highlight.
Type feel: an editorial serif for display, a clean humanist sans for labels.
Deliverable: a single cohesive FAMILY: consistent stroke weight, corner radius, grid, and
optical size. Export as clean SVG, one consistent 24px (or 1000px art) grid, named clearly.
```

---

## PROMPT 1 - The unified line-icon SYSTEM (UI + section concepts)
For: the recurring sections + actions across every page (so each section has a quiet, consistent mark).
```
[paste SHARED BRAND BLOCK]

Design a unified family of ~40 line icons (1.5px-equivalent stroke, rounded joins, single
ink color with optional vermillion accent dot) for these concepts. Keep them quiet and
abstract, readable at 20px:
startup cost, what the owner keeps, revenue, range/spread, where-the-money-goes (cost
breakdown), wages by role, break-even, seasonality, first year, competition, taxes, cost to
register, red tape / time-to-open, hiring / workforce, minimum wage, local customer / spending
power, commercial rent, tourist vs local, best areas, neighborhood, compare, vs-the-world,
free economic zone, airport/captive venue, corruption / informal economy, "what locals know",
the honest take, contrarian insight, myth vs reality, who-it's-for, gut-check, worked example,
operator voices / quotes, freshness / last-checked, "flag this", save / bookmark, watch / alert,
calculator, methodology, search.
Deliver as one SVG sheet + individual SVGs. They must feel like one set.
```

## PROMPT 2 - Business-category PICTOGRAMS (trades, sub-niches, venues)
For: the business pages, the sub-type switcher, the category tiles.
```
[paste SHARED BRAND BLOCK]

Design ~60 warm line pictograms of small businesses and venues, one consistent family,
slightly friendlier than the UI icons (a touch of character, still precise, never cartoonish):
restaurant, pizzeria, kebab shop, sushi bar, trattoria, fine-dining, cafe, coffee roaster,
bakery, bar, juice bar, barber shop, hair salon, nail salon, pharmacy, dentist, doctor's
clinic, vet, law firm, accountant, software studio, design agency, gym, yoga studio, hotel,
hostel, grocery store, butcher, florist, bookshop, clothing boutique, hardware store, auto
repair, car wash, gas station, dry cleaner, laundromat, plumber, electrician, HVAC,
construction, metal workshop, print shop, tattoo studio, pet shop, daycare, driving school,
tutoring, real-estate office, travel agency, jeweler, optician, bike shop, food truck,
convenience store.
Plus 4 venue marks: high street, shopping mall, airport, train station.
Deliver as one cohesive SVG set, same grid + stroke as the UI icons so the two families sit
together. Vermillion used only as a small accent.
```

## PROMPT 3 - The data-viz MOTIF kit (the chart language)
For: a consistent way to show the numbers across the whole site.
```
[paste SHARED BRAND BLOCK]

Design a cohesive data-visualization language (static reference designs / components, not a
chart library) in the Atlas palette, calm and editorial, ink + cream with vermillion as the
single highlight:
1. A "range / spread" strip showing 7 gradations from low to high with the typical value
   marked (the signature way we show that outcomes vary).
2. A "where the money goes" breakdown: for every $100 of revenue, segmented into food / staff
   / rent / other / what's left, as a clean horizontal stack and as a plain labeled list.
3. A like-for-like comparison: the same business across 3-5 comparable places, as a restrained
   bar/dot row (never a ranking that shames a place).
4. A sub-type switcher control (pill/tab style) that visibly reframes the numbers below it.
5. A distribution curve (where most businesses land vs the long tail).
6. A small world-map motif (dotted/engraved atlas style) for coverage.
7. A confident-but-not-flashy "hero number" treatment.
Deliver consistent components with shared type, axis, and color rules. Restraint over flash.
```

## PROMPT 4 - Editorial SPOT ILLUSTRATIONS (the human moments)
For: the brand/editorial beats (honest-take, who-it's-for, neighborhoods, scenarios, intricacies).
```
[paste SHARED BRAND BLOCK]

Design a set of ~12 editorial spot illustrations, one cohesive style: warm, intelligent,
lightly hand-drawn line-and-wash in ink + cream with vermillion + a touch of moss; the feel of
a smart magazine or a thoughtful almanac, human and grounded, never corporate stock, never
whimsical mascots. Subjects:
the honest take (a candid conversation), who-it's-for (an investor, an agency, a consultant,
a founder, as 4 quiet portraits-of-roles not faces), a neighborhood street with its own
character, "vs the world" (a small figure against a globe/atlas), opening a business abroad as
a foreigner, a free economic zone, an airport/captive venue, "what locals know" (an insider
detail), a first year (a ramp/journey), the reality check (an honest hard truth), the flagship
benchmarks report (a cover), the calculator / make-it-yours.
Deliver as a matched set, consistent line weight + palette + framing.
```

## PROMPT 5 - Restrained MICRO-ANIMATIONS (Lottie set)
For: the aliveness layer (subtle, clarity-serving, never confetti).
```
[paste SHARED BRAND BLOCK]

Design a set of ~8 restrained micro-animations (deliver as Lottie/JSON + preview GIFs), each
subtle, fast, and clarity-serving, matching the calm editorial tone (no bounce, no confetti,
no spinning globes):
1. A subtly living world map (a gentle breathing / faint shimmer of covered places).
2. A hero-number count-up (quick, easing to the final figure).
3. A gentle section fade-and-rise on scroll-into-view.
4. A freshness "last-checked" pulse (a single quiet beat).
5. The sub-type switch transition (numbers cross-fading as the niche changes).
6. A range-strip reveal (the 7 gradations filling left to right once).
7. A loading shimmer for cards (calm, not flashy).
8. A "saved / watching" confirmation (a small, satisfying check).
Restraint is the brief: every motion must help the eye understand or notice, never decorate.
Keep durations short (150-450ms) and easing soft.
```
