# Plan v30 Lane 2 — neighborhood deep-data expansion plan

**Status:** framework shipped 2026-05-23; expansion is multi-session.

## The target

The founder asked for "at least 1000 neighborhoods" across 200 cities, with "deeply flavored and original info" per neighborhood — not generic boilerplate.

## The framework

Every neighborhood gets 8 fields:

| Field | What it captures | Example |
|-------|------------------|---------|
| `character_paragraph` | 2-3 sentence editorial summary, voice-of-Atlas | "Manhattan is the dense vertical core of New York..." |
| `signature_businesses` | 3-5 small-business categories | `["law offices", "specialty restaurants", "fitness studios"]` |
| `food_scene` | One sentence on the local food culture | "Every cuisine on earth in a 10-block radius..." |
| `demographic_skew` | Compact tag for the resident population | "affluent professional" / "working family" |
| `walkability` | three-bucket enum | `high \| moderate \| low` |
| `history_note` | One sentence on what shaped this place | "Settled as a Dutch trading post in 1624..." |
| `price_tier` | five-bucket enum | `luxury \| expensive \| mid \| affordable \| budget` |
| `dont_miss` | A single concrete detail | "Brick Lane curry houses are the spiritual home..." |

The bar: **specific, not generic**. Any field that could be written about any city in the world has failed the test.

## What shipped today

40 neighborhoods across 7 anchor cities with full flavor data:

- **New York** — Manhattan, Brooklyn, Queens, Bronx, Staten Island
- **London** — Central, East, West, North, South
- **Paris** — Right Bank, Left Bank, Marais, Montmartre
- **Tokyo** — Central, Shibuya-Shinjuku, Shitamachi, Western, Bay Area
- **Berlin** — Mitte, Kreuzberg, Prenzlauer Berg, Charlottenburg
- **Mexico City** — Polanco, Condesa, Centro, Roma
- **Shenzhen** — Futian, Nanshan, Luohu, Bao'an

These serve as the **quality template**. The render layer surfaces flavor data on `/cities/{slug}/neighborhoods` whenever it's populated; falls back to the existing description otherwise. Same data is available for the cell editorial layer.

## What needs to land next

### Phase A — finish the 23 current cities (next 1-2 sessions)

The `neighborhoods_v1.json` file already has 113 neighborhoods across 23 cities. 40 now have flavor data; **73 remain** in: Los Angeles, Chicago, San Francisco, Toronto, Hong Kong, Singapore, Bangkok, Mumbai, Delhi, Istanbul, Cairo, Lagos, Buenos Aires, São Paulo, Madrid, Rome, Amsterdam, Moscow.

Effort per neighborhood: ~15-20 minutes of hand-research + writing. 73 × 18min = ~22 hours.

### Phase B — expand to 100 cities (4-6 sessions)

Add neighborhood schemes for the next 77 Tier 1+2 cities. For each:
1. Pick the canonical 4-8 macro-neighborhood split (Tier-1 cities should have known divisions; Tier-2 cities use the cardinal-zones pattern).
2. Hand-research each neighborhood's flavor.
3. Add to both `neighborhoods_v1.json` (skeleton) and `neighborhood_flavor_v1.json` (deep data).

Target: 5-7 neighborhoods per city × 77 cities = **400-540 new neighborhoods**.

### Phase C — Tier 3 cities (slower, lower priority)

The remaining 100 Tier 3 cities each get 3-4 neighborhoods (city-quarter granularity rather than borough-level). Less rich coverage; can be lower flavor quality.

Target: ~350 additional neighborhoods.

### Total at completion

| Phase | Cities | Neighborhoods cumulative |
|------:|-------:|-------------------------:|
| Today | 7 | 40 |
| End of Phase A | 23 | ~150 |
| End of Phase B | 100 | ~600 |
| End of Phase C | 200 | ~1,000 |

## Quality bar

Every neighborhood is rejected and rewritten if it fails any of these tests:

1. **The substitution test**. Could the `character_paragraph` describe a different neighborhood with one word changed? If yes, rewrite.
2. **The Wikipedia test**. Is this just a paraphrase of the Wikipedia opening paragraph? If yes, rewrite — we need operator-level insight, not encyclopedia summary.
3. **The 18-year-old test**. Would a curious teenager understand this without looking up jargon? (Per Plan v30 Lane 3.)
4. **The `dont_miss` test**. The specific detail must be a fact, not an opinion. "The best pizza in town" fails. "Di Fara on Avenue J has used the same coal oven since 1965" passes.

## Audit script

`scripts/audit/neighborhood_flavor_audit.ts` (planned) probes the flavor file and checks:
- Every populated entry has all 8 fields
- `character_paragraph` is 30-80 words
- `signature_businesses` has 3-5 entries
- `dont_miss` contains at least one number, year, or proper noun (specificity check)
- `food_scene` and `history_note` are under 30 words each

Build the audit script next session.

## Render integration

Today:
- `/cities/{slug}/neighborhoods` — shows flavor when available (price tier chip, walkability chip, character paragraph, food + don't-miss row)
- Falls back to the v26 neighborhood description otherwise

Future (not yet implemented):
- Cell pages (`/{country}/{city}/{neighborhood}/{industry}`) — surface flavor + signature businesses on the relevant industry's page
- Curiosities pages — use the `dont_miss` field as a curiosity card
- Comparison pages (city-vs-city) — show the neighborhood character split in the right column

## Stuck-on-budget reality

This work cannot be done by an LLM at quality. Each flavor entry takes a few minutes of human-quality knowledge per neighborhood — what makes Yanaka different from Asakusa, what makes Williamsburg different from Bushwick. Generic LLM output fails the substitution test almost immediately.

The pragmatic path:
- I (in-session) can write ~50-80 neighborhoods at quality per session.
- 4-5 sessions get us to ~300 with deep flavor.
- The remaining 700 should be filled by the founder over time, OR by external research help paid per neighborhood at $1-2/each ($700-1400 total). Atlas would commission the research and approve each one.

That's the honest scoping. The framework is solid and the first 40 are real; expansion is editorial labor that can't be cheap-shotted.
