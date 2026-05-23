# Country research cards

Internal-only documentation per country. Backs the values in
`country_profile_v2.json` with reasoning chains so any number can be
defended. **Never exposed in user-visible UI** (R-002).

Each card has the same structure:

1. **Headline profile** — 3-paragraph economic summary
2. **Labor market** — wage dispersion, hiring norms, severance
3. **Tax regime** — VAT particulars, corporate tax structure, withholding
4. **Commercial real estate** — T1/T2/T3 split, lease norms, popular cities
5. **Industry anomalies** — which industries diverge from the country norm
6. **Internal sources** — bracketed list of references (NOT exposed in UI)
7. **Last verified** — date when the card was last reviewed

Cards live in this directory keyed by lowercase ISO-2 (e.g., `de.md`,
`mx.md`, `us.md`).

## Tier A cards (50)

Top 50 countries receive the full hand-research treatment. Cards
populate in batches over multiple sessions.

## Cadence

- Initial pass: ~30-45 min per Tier A country
- Quarterly review: re-verify every Tier A card against latest data
- New data event (major tax change, etc.): targeted card update

## Status

- `us.md` — populated (template)
- `de.md` — populated
- `mx.md` — populated
- `jp.md` — populated
- `in.md` — populated
- Other 45 Tier A countries: queued
