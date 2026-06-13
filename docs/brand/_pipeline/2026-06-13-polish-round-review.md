# Fable polish round, 2026-06-13: founder review pack

> Second autonomous round, responding to your preview punch-list. One big batch, one preview
> at the end (per your call). Production untouched; everything on `reform-v2/palette-brick`.
> Plan: `~/.claude/plans/linked-seeking-goblet.md`. Evidence: `_pipeline/evidence/p2/`.

## Every point you raised, and where it landed

| Your note | What changed |
|---|---|
| Tables / cities section unpolished | City page sections (Neighborhoods, Everyday trades, Cities-like) now seated cards; trade rows carry pictograms; board section headers carry quiet marks |
| Visual assets not used | The 40 icons + 64 pictograms + 12 spots are now deployed on real pages (activities, trades, section headers, editorial beats); the cartographic motif is on the countries header and the neighborhood covers |
| Neighborhoods need a placeholder image | `NeighborhoodCover`: an honest designed cover (token gradient keyed to the area + engraved street-grid + initial), on every city neighborhood card and the neighborhood hero. NOT a fake photo (brand rule) |
| Neighborhoods duplicate commercial streets | Merged: the city has one "areas" model (neighborhoods); the streets fold onto each neighborhood card. The standalone "Where commerce happens" block is gone where a neighborhood scheme exists |
| "Excellent to brutal" scale strange | One plain scale in a single helper: business = Easy / Doable / Hard / Very hard; city = Excellent / Good / Fair / Hard. "Brutal" retired |
| Don't expose peer categorizations | The "Local competitor / Classic rival / Peer abroad" labels are gone; the section reads "How {city} compares to similar cities" with continents |
| Countries page = AI slop | Redesigned: editorial header with the survey-grid motif + coverage stats (195 countries, 252 cities), continent sections as cards, richer country cards |
| Activities page has no icons | `/industries` redesigned with a trade pictogram on every activity card + hover lift |
| Font: you decide | Set to **Fraunces** (warm, signature, strong display numerals). Literata is the one-line fallback. Live everywhere |
| Cell sections not updated graphically | Board sections are seated cards (from the prior round) now with header icons; the tail beats carry spots |
| "Across the country" graph monocolor | `BarList` gains a rank-shaded gradient (leader deepest vermillion, a sheen); applied to the across-states bars |
| Site feels blank | Icons + pictograms + spots + covers + motifs deployed across the surfaces above |
| Only "All sizes"; can't pick size or type | The size bands always existed (4 for CA restaurants, it was the collapsed default). Added a working **Type** select (restaurants -> pizzeria, food truck, cafe, ...), each a real cell URL; switcher restyled warm |

## The preview (full round, all 29 gates + tsc green)

    https://marginatlas-web-twtl-jdwesexlf-benets-projects-3110e8e1.vercel.app

(open logged into Vercel, or with the protection-bypass header). All key routes smoke-checked 200.

## What to try
- `/cities/london` (neighborhood covers, the streets/hoods merge, plain score words, no peer labels)
- `/us/california/restaurants` (the Type + size switcher, section icons, gradient across-states bars, the reality-check spot)
- `/industries` (pictograms) and `/countries` (the redesign)
- A neighborhood page (cover banner) and the homepage audience band (the four-roles spot)
- `/dev/brand-glyphs` (all 40 icons + 64 pictograms + 12 spots catalogued) and `/dev/font-showcase`

## Commits (this round, on the branch)
font (Fraunces) -> IA fixes (scale, peers, streets) -> pictograms + activities -> gradient bars +
covers + city cards -> Type switcher -> countries redesign -> section icons -> spots. ~11 commits.

## Verification
- Local gates green before deploy: em-dashes, hardcoded-hex, layering, source-agencies, typography,
  section-order all PASS; `tsc --noEmit` clean.
- One Vercel preview deployed at the end (remote build runs the full 29 gates + tsc + all pages).
  URL in the session output.

## Still open (next round, flagged not done)
- Masthead motifs were deprioritized (covers + countries motif already add the cartographic texture);
  a faint masthead motif is a quick follow-up.
- The full P2 editorial-contracts machinery + Sonnet data-fill remains the next phase.
- A handful of long-tail pictograms fall to the neutral storefront mark (sensible, not wrong);
  the DIRECT crosswalk can be widened any time.
- Out of scope by design: real licensed neighborhood photography (covers are honest placeholders).
- Shipping to `main` still held for your nod.
