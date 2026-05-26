# Signature panel rollout: shipped state

**Date shipped:** 2026-05-26
**Status:** Live in production on every country page (`/[country]`) and every city page (`/[country]/[city]`).

## What's live

The signature panel renders four blocks of editorial data on every
country and city page:

1. **People** — % of residents born outside the country, % of local SMBs
   with at least one foreign owner.
2. **Three sectors that say "{place}"** — three industries that
   characterise the metro vs comparable places. Banks, asset
   management, and farms (agriculture, livestock, aquaculture) are
   excluded as too generic; London insurance is the one explicit
   exception. Sub-sector labels such as "Olive oil processing" or
   "Salmon aquaculture" remain valid because they are distinctive.
4. **Where commerce happens** — 5-10 named streets / zones per city
   with one-line "what is sold". City-level only; country pages do not
   render this block.
4. **Culture, as locals feel it** — six dimensions on a red-→-blue
   spectrum bar with a vertical-switch handle for the city's
   position:
   - Loose on time ↔ Strict on time
   - Insular ↔ Welcoming
   - Tradition-bound ↔ Embraces new ideas
   - Indirect ↔ Direct
   - Corruption tolerated ↔ Rejects corruption
   - Humble ↔ Self-promoting
5. **Government, from a business desk** — five 0-10 scores with green /
   amber / red bands:
   - Tax predictability
   - Low bribery
   - Task efficiency
   - Time efficiency
   - Judicial impartiality

## Architecture

Two JSON files plus one resolver:

- `data/cities/country_signature_v1.json` — 196 countries. The default
  baseline for every city in that country.
- `data/cities/city_signature_v1.json` — per-city overrides. NYC ships
  a full override (everything overridden). The other 48 ship partial
  overrides containing only `commercial_streets` and inherit the rest
  from the country baseline.
- `CitySignaturePanel.resolveSignature(citySlug, iso2)` — merges city
  override fields on top of the country baseline. Falls back to the
  country baseline if no city entry. Returns null if neither.

The `CountrySignaturePanel` is a thin wrapper that calls
`CitySignaturePanel` with `citySlug=""`, forcing the country baseline.
Country pages don't render the `commercial_streets` block.

## City coverage

49 cities have a hand-curated commercial-streets list:

**Tier 1 (25):** Baghdad, Barcelona, Beijing, Berlin, Chicago, Delhi,
Dubai, Hong Kong, London, Los Angeles, Madrid, Mexico City, Milan,
Moscow, Mumbai, New York, Paris, Rome, San Francisco, São Paulo,
Seoul, Shanghai, Singapore, Sydney, Tokyo.

**Tier 2 (24):** Amsterdam, Bangkok, Bogotá, Boston, Buenos Aires,
Cairo, Cape Town, Copenhagen, Dublin, Istanbul, Jakarta, Johannesburg,
Karachi, Kuala Lumpur, Lisbon, Manila, Melbourne, Montreal, Munich,
Nairobi, Riyadh, Toronto, Vienna, Zurich.

The remaining ~200 cities in `city_list_v1.json` inherit demographics,
sectors, culture, and government from their country baseline and
silently omit the `commercial_streets` block.

## Quality gate

`scripts/verify_signature_quality.ts` runs three tiers of checks:

**Tier 1 — per-row structure**
- Culture scores 1-10, government scores 0-10, percentages 0-100.
- Exactly 3 signature sectors per country.
- Signature-sector labels are not banned generics (Banking, Banks,
  Banking, Asset management, Farming, Agriculture, Livestock).

**Tier 2 — anchor-pair monotonicity**
- Sweden > United States on low_bribery (Transparency International).
- Japan > Germany on task_efficiency (operator surveys).
- United Kingdom > Italy on judicial_impartiality (WJP).
- Singapore > Hong Kong on tax_predictability (post-2020 NSL drag).
- Saudi Arabia < Sweden on openness_to_foreigners.
- United States > Japan on ambition_chest_beating (Hofstede / GLOBE).

**Tier 4 — city vs country**
- City overrides may diverge from the country baseline by up to 3
  points before a warning fires.
- Every commercial-street entry must have `name`, `area`, `sells`.
- Each city should ship at least 3 streets (warning otherwise).

Current gate state: **196 country rows, 49 city overrides, 0
warnings, 0 hard fails.**

## How to extend

**Add a new country baseline.** Open
`data/cities/country_signature_v1.json` and add a new ISO-2 key with
the six culture scores (1-10), five government scores (0-10), two
percentages, and three signature sectors. Run the verify script —
anchor pairs and range checks fire on save.

**Add a city's commercial streets.** Edit
`data/cities/city_signature_v1.json`. The city slug must match
`city_list_v1.json`. Ship a partial override:

```json
"prague": {
  "commercial_streets": [
    { "name": "Wenceslas Square", "area": "Nové Město", "sells": "..." }
  ]
}
```

The city inherits demographics, sectors, culture, and government from
its country baseline (`CZ` in this case) automatically.

**Add a city's distinctive culture.** When the city meaningfully
differs from the country baseline (e.g., Berlin is more open and less
formal than rural Germany), ship a partial override with just `culture`
or `government` fields. Other fields stay inherited.

## Sources used

- **Transparency International CPI 2024** — low_bribery anchor.
- **World Bank WGI** — government dimensions.
- **World Justice Project Rule of Law Index 2024** —
  judicial_impartiality.
- **Hofstede / GLOBE / Erin Meyer Culture Map** — culture spectrum.
- **WIPO Global Innovation Index** — innovation dimension.
- **UN DESA Migrant Stock 2024** — foreign_born_pct.
- **World Bank Enterprise Surveys** — foreign_owned_pct.
- Country-specific industry research for the three signature sectors
  per country.

## What's deliberately not yet done

- City-level cultural overrides beyond NYC. The merge-pattern is
  ready; adding overrides for Berlin, Shanghai, Bangalore, Tel Aviv,
  Dubai etc. is a v2 polish.
- Source-citation panel in the UI. The data file's `convention` and
  `anchor` fields document the methodology; nothing user-facing
  surfaces sources yet (R-002: no source-agency names in UI).
- Sub-region and admin-1 panels. The country baseline applies
  uniformly to every region within a country today.
