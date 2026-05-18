# 28 · Track Y — Top-200 Cities Curation Locked

> Founder direction: "top one hundred that are top one hundred
> economically… western world should be a little bit more represented…
> can be even two hundred for the whole world."
>
> Current top100.json has 102 entries; locked at draft 1.0.0. This
> track properly curates the canonical top-200 by economic importance
> + adds neighborhoods for the top-100 subset.

---

## 1 · Goal

Lock `src/lib/cities/top200.json` at version 2.0.0 with:
- 200 cities ranked by economic importance (GDP × density × search-volume)
- Western-world over-representation per founder
- Microstates included where rich (Monaco, Vaduz, Andorra la Vella)
- Specific country quotas (China 5, Japan 5, AU 3-4, IN 2-3, etc.)
- Per-city: tier (1-4), country, region, slug, geo_id, data_status,
  population, gdp_rank, neighborhood_drill

For top-100 subset: ensure data_status != "missing".

---

## 2 · Tier distribution

| Tier | Count | Definition |
|---|---|---|
| 1 (Global metropolis) | 30 | New York, London, Paris, Tokyo, etc. |
| 2 (Major regional) | 60 | Munich, Boston, Madrid, etc. |
| 3 (Important secondary) | 60 | Manchester, Lyon, Atlanta, etc. |
| 4 (Niche-but-relevant) | 50 | Smaller capitals, rich microstates |
| **Total** | **200** | |

## 3 · Country quotas (target distribution)

Per founder direction:

| Region | Cities | Bias |
|---|---|---|
| US | 25-30 | Heavy (NYC, LA, SF, Chicago, Boston, Miami, Atlanta, Dallas, Houston, DC, Seattle, San Diego, Phoenix, Denver, Minneapolis, Detroit, Philadelphia, Charlotte, Nashville, Tampa, Austin, Portland, Salt Lake, Pittsburgh, Cleveland, etc.) |
| Western Europe | 50-60 | Heavy (UK 10, Germany 10, France 8, Italy 8, Spain 6, Netherlands 4, Switzerland 3, Belgium 3, Sweden 3, Austria 3) |
| Eastern Europe | 8-10 | (Warsaw, Prague, Vienna, Bucharest, Budapest, Sofia, Kyiv, Moscow + St Petersburg in Russia, Belgrade) |
| Asia | 30-35 | China 5 (Shanghai, Beijing, Shenzhen, Guangzhou, Chongqing), Japan 5 (Tokyo, Osaka, Yokohama, Nagoya, Kyoto), Korea 2 (Seoul, Busan), India 2-3 (Mumbai, Delhi, Bangalore), SE Asia 5-7 (Singapore, Bangkok, Jakarta, Manila, KL, HCMC, Hanoi), HK + Taipei |
| Middle East | 8-10 | (Dubai, Abu Dhabi, Riyadh, Tel Aviv, Jerusalem, Doha, Kuwait City, Manama, Tehran, Istanbul) |
| Africa | 6-8 | (Lagos, Johannesburg, Cape Town, Nairobi, Cairo, Casablanca, Accra, Addis Ababa) |
| LATAM | 15-20 | (Mexico City, São Paulo, Rio, Buenos Aires, Lima, Bogotá, Santiago, Caracas, Quito, Guatemala City, Panama City, San José, Montevideo, La Paz, Asunción) |
| Australia + NZ | 5-6 | (Sydney, Melbourne, Brisbane, Perth, Adelaide; Auckland, Wellington) |
| Canada | 5-6 | (Toronto, Montreal, Vancouver, Calgary, Edmonton, Ottawa) |
| Microstates | 5-6 | (Monaco, Vaduz, Andorra la Vella, City of San Marino, Singapore is already in Asia) |
| **Total** | **~200** | |

## 4 · Steps

| # | Task | Effort |
|---|---|---|
| Y.1 | Source canonical list — Brookings Metro Monitor + UN World Urbanization + OECD FUA | 3-4 hr |
| Y.2 | Apply founder quota constraints; tier assignments | 2 hr |
| Y.3 | Map each city to existing geo_id; compute data_status | 1.5 hr |
| Y.4 | Run city overlay extension (Wave 5) for missing cities | 2 hr |
| Y.5 | Write `top200.json` v2.0.0 | 1 hr |
| Y.6 | Migrate `top100.json` consumers (CountryCityShortcuts component) to use new file | 1 hr |
| Y.7 | Per-city URL routes — extend `/cities/{slug}` standalone page | 3-4 hr |
| Y.8 | Founder review pass — surface top200.json + ask for cuts/promotes | (founder) |
| **Total** | **~14-17 hr** | |

---

## 5 · Verification gate

- `src/lib/cities/top200.json` has exactly 200 entries
- Tier counts: 30/60/60/50
- US count ≥ 25 (Western bias)
- Every tier-1 city has data_status == "measured"
- ≥ 80% of tier-2 cities have data_status in ("measured", "extrapolated")
- `verify_taxonomy.ts` passes new top200 invariant check

---

## 6 · What this unlocks

- The top-200 list is locked and canonical
- Every covered city has a friendly URL
- `/cities` page becomes a usable directory
- Founder's "Western world should be a little bit more represented"
  reflected in actual data
