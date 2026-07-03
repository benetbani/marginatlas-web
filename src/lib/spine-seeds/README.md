# src/lib/spine-seeds , bundled spine seeds (Final Ascent promotion, Phase A)

These JSON files are a **bundled snapshot** of the illustrative spine seeds. The
**canonical source is the parent repo at `E:/atlas/page-data/`** (`countries/`,
`cities/`, `cells/`, `industries/`). They were copied here so the spine pages can
be imported statically inside the Vercel deploy root (`website/`), which does NOT
contain `../page-data/`. Reading that path with `fs` at build time would throw on
Vercel, so the spine pages `import` these bundled copies instead.

- These numbers are **illustrative placeholders** (`overall_confidence:
  "placeholder"`, `provenance_line: "Figures are illustrative..."`). They are NOT
  production truth and must never be shown at a live URL as if real. That is why the
  promoted routes stay behind `isSpineReformEnabled()` (default OFF) until each
  page's real-data adapter (accessor -> spine props) lands (promotion Phase B).
- If you edit a seed in `page-data/`, re-copy it here (or these drift). On Phase B
  the spine pages switch from these imports to the real accessor layer and this
  directory is retired.

Files: countries/{GB,DE,FR,NL,IE}.json (GB + its peer_set), cities/GB-london.json,
cities/GB-london-neighborhoods.json, cells/GB-london-restaurants.json,
industries/restaurants.json.
