# Signature panel rollout — master plan

Date: 2026-05-26.
Status: PROPOSAL, awaiting founder approval.
Owner: ben + atlas-bot.

## What this scales

The `CitySignaturePanel` we built for New York has five blocks:
1. **People** — % foreign-born, % foreign-owned SMBs
2. **Three signature sectors** — industries that define the city/country (banks excluded)
3. **Commercial streets** — 10 zones with what is sold there
4. **Culture, as locals feel it** — 6 spectrum bars 1-10 (red/Pakistan-style → blue/US-style)
5. **Government, from a business desk** — 5 score bars 0-10 (higher = better for business)

Goal: scale to all 197 countries and 252 cities with cross-verified data and no per-row stereotyping mistakes.

## Architecture: country baseline + city override

```
1. data/cities/country_signature_v1.json   (NEW — 197 countries)
2. data/cities/city_signature_v1.json      (existing — overrides only when variance is documented)
3. CitySignaturePanel falls back: city slug → country iso2 → null
```

Why this split:
- Culture and government scores are mostly country-level (a German in Munich vs Berlin scores nearly identically on Hofstede)
- Signature sectors mostly country-level too (`Germany = machinery, automotive, chemicals`)
- Demographics, commercial streets, and a few signature sectors are city-specific (NYC vs LA both US but different signatures)

This cuts the curation from `197 × city-count` down to `197 + ~50 city overrides`.

## Data sources per dimension (each cross-referenced 2-3 ways)

### People (% foreign-born, % foreign-owned)

| Field | Primary source | Cross-check |
|---|---|---|
| `foreign_born_pct` (country) | UN DESA International Migrant Stock 2024 | World Bank "Migrant stock, % of population" |
| `foreign_born_pct` (city) | US ACS / Eurostat / national census metro tables | Local stat agency metro reports |
| `foreign_owned_pct` (country SMBs) | World Bank Enterprise Surveys (% of firms with foreign ownership) | OECD AnaBerd database |

### Signature sectors

| Field | Primary source | Cross-check |
|---|---|---|
| Country signatures | WTO World Trade Statistical Review (top exports) | UNIDO industrial-development reports + OECD STAN industry stats |
| City signatures | National stat agencies' metro economic studies | City government economic development reports |

Rules:
- 3 sectors per country/city
- **Banks are not a signature** (too generic; exception: London where insurance is allowed because it's the global capital)
- Must be distinctive — Germany "machinery" yes; Germany "retail" no
- City overrides only when the city's signature genuinely diverges (LA entertainment vs US tech/finance)

### Culture (6 spectrums, 1-10)

| Dimension | Primary | Cross-check 1 | Cross-check 2 |
|---|---|---|---|
| `punctuality` | Hofstede LTO + project-management studies | Trompenaars "Time orientation" | GLOBE Future Orientation |
| `openness_to_foreigners` | Gallup Migrant Acceptance Index | V-Dem Civil Society Index | IPSOS public opinion on immigration |
| `innovation` | WIPO Global Innovation Index | R&D % GDP (OECD) | Patent applications per capita |
| `communication_directness` | Erin Meyer Culture Map | Hofstede Individualism Index | GLOBE Performance Orientation |
| `acceptance_of_corruption` | Transparency International CPI (inverted) | V-Dem Corruption Index | WB Control of Corruption (WGI) |
| `ambition_chest_beating` | Hofstede Masculinity | GLOBE Assertiveness | LinkedIn self-promotion data 2024 |

### Government (5 scores, 0-10, higher is better-for-business)

| Dimension | Primary | Cross-check 1 | Cross-check 2 |
|---|---|---|---|
| `tax_predictability` | PwC Paying Taxes Index | IMF tax-policy stability metric | OECD tax-administration efficiency |
| `low_bribery` | TI CPI | WGI Control of Corruption | V-Dem Political Corruption |
| `task_efficiency` | WGI Government Effectiveness | B-Ready 2024 Operational Efficiency | Edelman Trust Barometer (government competence) |
| `time_efficiency` | B-Ready "Time to start a business" | Doing Business archive 2019 (where B-Ready missing) | OECD Going Digital index |
| `judicial_impartiality` | World Justice Project Rule of Law Index | WGI Rule of Law | V-Dem Judicial Independence |

### Commercial streets

City-level only. 10 zones per city. Curation flow:
1. Wikipedia "Shopping in X" + travel-guide top-10 (Lonely Planet, NYT travel)
2. Local government economic-development reports (e.g., NYC EDC, London Property Investment)
3. Founder spot-check before publishing

## Execution: one continent per wave, with quality gates

### Wave 1: Europe (50 countries, ~50 cities)
- Hand-anchor: G7 EU + Nordic + UK + CH = top 12
- Tier 2: 23 mid-size EU members
- Tier 3: 15 smaller (Balkans, Baltic, smaller Eastern)
- Cities: London, Paris, Berlin, Madrid, Rome, Milan, Amsterdam, Munich, Zurich, Vienna, Stockholm, Copenhagen, Dublin, Lisbon, Warsaw, Prague, Budapest, Athens, Helsinki, Oslo, etc.

### Wave 2: Asia + Oceania (~55 countries, ~60 cities)
- Major: JP, KR, CN, IN, ID, TH, VN, PH, MY, SG, HK, TW, AU, NZ
- Tier 2: BD, PK, LK, KH, MM, MN, MV, BN
- Pacific micros + Central Asia
- Cities: Tokyo, Osaka, Seoul, Beijing, Shanghai, Shenzhen, Mumbai, Delhi, Bangalore, Jakarta, Bangkok, Manila, KL, Singapore, HK, Taipei, Sydney, Melbourne, Auckland, etc.

### Wave 3: Americas (35 countries, ~30 cities)
- North: US, CA, MX
- LatAm tier 1: BR, AR, CL, CO, PE
- LatAm tier 2: UY, EC, BO, PY, VE, CR, PA, DO
- Caribbean + Central America
- Cities: NYC (done), LA, Chicago, SF, Toronto, Montreal, Vancouver, Mexico City, São Paulo, Rio, Buenos Aires, Santiago, Bogotá, Lima, etc.

### Wave 4: Africa (54 countries, ~15-20 cities)
- Tier 1 (hand-anchor): NG, KE, ZA, EG, GH, ET, MA, DZ, TN
- Tier 2: regional cluster (East Africa, West Africa francophone, West Africa anglophone, Southern, Maghreb, Sahel)
- Tier 3: smaller + LDCs
- Cities: Lagos, Nairobi, Cairo, Joburg, Cape Town, Accra, Abidjan, Casablanca, Addis, Dar es Salaam, Kampala

### Wave 5: MENA (~17 countries, ~15 cities)
- Gulf: SA, AE, QA, KW, BH, OM
- Levant: JO, LB, IL, PS, SY
- Maghreb already in Africa wave
- Iran, Iraq, Yemen separately
- Cities: Dubai, Abu Dhabi, Doha, Riyadh, Jeddah, Tel Aviv, Jerusalem, Amman, Beirut, Baghdad, Tehran

## Quality checks (run at the END of each wave)

### Tier 1: per-row hard checks (must pass before commit)

1. **Range check** — every value in valid range; no missing fields per country
2. **Banned word check** — sector blurbs don't include banned source-agency names per R-002
3. **Banks check** — no signature sector matches `/bank|insur(?!nce.*london)|finance|invest/i` except documented exceptions
4. **Em-dash check** — no em-dashes in user-visible text (existing prebuild gate handles this)

### Tier 2: relative-position checks (cluster sanity)

5. **Regional cluster outlier** — for each region (e.g., "Nordic", "GCC", "ASEAN"), compute the median culture/government score; flag any country > 3 points off the cluster median without a `notes` field justifying it
6. **Anchor pair monotonicity** — locked reference pairs that must respect the expected ordering (configurable list):
 - Sweden gov > US gov on `low_bribery`
 - Japan gov > Germany gov on `task_efficiency`
 - UK gov > Italy gov on `judicial_impartiality`
 - Singapore gov > Hong Kong gov on `tax_predictability` (post-2020)
 - Saudi Arabia culture < Sweden culture on `openness_to_foreigners`
 - US culture > Japan culture on `ambition_chest_beating`
 - If any anchor pair violates expectation → script fails the wave

### Tier 3: cross-source triangulation

7. **At least 2 of 3 sources agree** for each cell. Disagreement > 2 points triggers a re-check note in the data row
8. **Per-continent floor and ceiling** — each continent has an expected range per dimension (e.g., African judicial_impartiality average expected to fall in [2.5, 6]). Anything outside → manual review

### Tier 4: city-vs-country consistency

9. **City must be within ±2 of country baseline** on every culture/government dimension unless a `city_override_reason` note exists
10. **Commercial-streets coverage** — every city flagged as tier-1 or tier-2 must have ≥ 8 commercial-streets entries; tier-3 cities optional

### Tier 5: human-review checkpoints

11. **Pair-spot-check** — after each wave, randomly pick 5 pairs (e.g., FR vs ES, JP vs KR) and ask the founder to confirm the relative positions make qualitative sense
12. **Signature-sector reality check** — pick 5 countries from the wave; founder confirms the 3 sectors really do "say that country"

## Cross-verification mechanisms

| Mechanism | What it catches |
|---|---|
| **Triangulation (3 sources per dimension)** | Single-source bias; outdated indices |
| **Regional cluster outlier check** | Stereotype-driven mis-anchoring (e.g., "all of Africa is corrupt" — wrong, Rwanda is cleaner than France on TI CPI) |
| **Anchor pair monotonicity** | Logic errors where the curator put a country in the wrong direction |
| **City-vs-country bound** | Over-eager city override (e.g., claiming NYC culture is wildly different from US average) |
| **Signature-sector banking exclusion** | The "banks would be everywhere" boring-data trap |
| **Historical consistency** | War-affected countries appearing ahead of stable ones on government scores |
| **Cross-wave re-run** | After wave 2 ships, re-run wave 1 checks to make sure new anchor pairs introduced in wave 2 don't break |

## Effort estimate

| Phase | Hours |
|---|---|
| Build `verify_signature_quality.ts` (the 12-check pipeline) | 6 |
| Wave 1 Europe — data + checks + fixes | 14 |
| Wave 2 Asia + Oceania | 16 |
| Wave 3 Americas | 12 |
| Wave 4 Africa | 14 |
| Wave 5 MENA | 8 |
| Component scaling (country fallback in CitySignaturePanel + country page mount) | 4 |
| Documentation per continent | 5 |
| **Total** | **79 hours** |

Spread over 2-3 weeks of focused work, or 6-8 weeks at lower intensity.

## Risks

| Risk | Mitigation |
|---|---|
| Cultural stereotyping pushback | The "Pakistan-like / US-like" framing stays internal. Public copy: "loose on time / strict on time". Numbers from quantitative sources (Hofstede, GLOBE). Convention doc lives in `/about-data`. |
| Source dispute (TI / Hofstede critics) | Triangulate 3 sources per dimension. Never publish a value with only 1 source. |
| Data freshness | Document anchor year per dimension. Quarterly review for top 25 countries. |
| Founder disagrees with a number | Each country gets a `notes` field where the rationale lives; easy to override and document the override. |
| Africa data sparsity | Wave 4 uses regional clusters more aggressively. LDCs may share a cluster median. Documented explicitly. |
| City overrides creep | Hard rule: city must be within ±2 of country unless `city_override_reason` is non-empty. Auto-flagged. |

## Founder decision points (need approval before I start)

1. **Country baseline + city override architecture** — agreed?
2. **5 continent waves in this order** (Europe → Asia/Pac → Americas → Africa → MENA) — or different priority?
3. **Anchor pairs for the monotonicity check** — I drafted 6 above; want to add/edit any?
4. **Signature sectors: keep "no banks" rule with London-insurance exception only?** Or allow other exceptions (Switzerland banking, NYC finance)?
5. **`acceptance_of_corruption` — keep the field name + inverted rendering** OR rename to `corruption_rejection` (1 = tolerates, 10 = rejects) so every score reads left-low / right-high?
6. **Commercial streets — only for top 120 cities (tier 1 + 2)?** Or all 252?
7. **Anchor year** — 2024 (latest available indices)? Or aim for 2025 when WIPO/TI publish later this year?
8. **Country-page mount** — Add the panel to `/[country]` too, or city-only?

## After all 5 waves: what good looks like

- Every country has the full signature data (people + 3 sectors + culture + government, plus notes)
- Every top-120 city has full data including commercial streets
- Tier-3 cities (~130) inherit country defaults silently
- One reproducible `recompute_signature.ts` script
- One `verify_signature_quality.ts` gate (12 checks) wired into prebuild
- One methodology doc in `/about-data`

## Ask

This is the plan. Tell me:
1. **Approve / change** the 8 decision points above
2. **Start wave 1 (Europe)** or **build the quality script first** then start wave 1

I won't begin without your nod.
