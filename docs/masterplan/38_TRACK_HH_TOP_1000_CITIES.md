# 38 · Track HH — Top-1000 Cities Full Curation

> Founder direction (earlier session): "top one thousand of the world,
> that would be good if we have... if we can find the data."
>
> Extends Track Y (top-200 cities). Goes to 1000 with proper sourcing
> and proper data backing.

---

## 1 · Goal

Lock `src/lib/cities/top1000.json` at v3.0.0 with:
- 1000 cities ranked by economic + search-volume importance
- Western-world over-representation per earlier founder direction
- Microstates included
- Per-city: tier (1-5), country, region, slug, geo_id, data_status,
  population, gdp_rank, neighborhood_drill
- Every tier-1 city has measured data; tier-5 may be extrapolated

---

## 2 · Tier distribution

| Tier | Count | Definition |
|---|---|---|
| 1 (Global metropolis) | 50 | NYC, London, Paris, Tokyo, etc. |
| 2 (Major regional capital) | 150 | Munich, Boston, Madrid, Seoul, etc. |
| 3 (Important secondary) | 250 | Manchester, Lyon, Atlanta, Hyderabad, etc. |
| 4 (Niche relevant) | 350 | Smaller capitals, rich micros, regional hubs |
| 5 (Long tail) | 200 | Smaller cities with notable industries |
| **Total** | **1000** | |

## 3 · Sources

- **Brookings Global Metro Monitor** (top 300 by GDP)
- **UN World Urbanization Prospects** (population-based, ~1500 metros)
- **OECD Functional Urban Areas** (FUA definitions)
- **Google Trends** (search volume validation for top 100)

## 4 · Country quotas

Per Plan v8 Track Y, but extended:

| Region | Cities |
|---|---|
| US | 100 (NYC, LA, Chicago, SF, Boston, Miami, Atlanta, Dallas, Houston, DC, Seattle, San Diego, Phoenix, Denver, Minneapolis, Detroit, Philadelphia, plus 80+ tertiary) |
| Western Europe | 250 (UK 40, Germany 40, France 30, Italy 30, Spain 25, Netherlands 15, Switzerland 10, Belgium 10, Sweden 10, etc.) |
| Eastern Europe + Balkans | 60 (Warsaw, Prague, Vienna, etc. + Tirana for founder) |
| Asia | 200 (China 30, Japan 25, India 30, Korea 10, SE Asia 40, ME 30, Central Asia 15) |
| Africa | 50 |
| LATAM | 100 |
| AU + NZ | 25 |
| Canada | 25 |
| Microstates + Pacific | 15 |
| Caribbean | 25 |
| Russia + post-Soviet | 30 |
| **Total** | **1000** |

## 5 · Steps

| Step | Effort |
|---|---|
| HH.1 Source canonical list (Brookings + UN + OECD merge) | 4-5 hr |
| HH.2 Apply quota constraints; tier assignments | 3 hr |
| HH.3 Map every city to existing geo_id; compute data_status | 2 hr |
| HH.4 Run Wave 5 city overlay for missing tier 3-5 cities | 3 hr |
| HH.5 Write `top1000.json` v3.0.0 | 1.5 hr |
| HH.6 Migrate consumers (CountryCityShortcuts, CityPicker, sitemap) to use new file | 1.5 hr |
| HH.7 `/cities` standalone directory page (paginated, filterable) | 4 hr |
| HH.8 Per-city URL `/cities/{slug}` lands on city page | 3-4 hr |
| HH.9 Founder review pass | (founder time) |
| **Total** | **~22 hr** |

## 6 · Verification gate

- `top1000.json` has exactly 1000 entries
- Tier counts: 50/150/250/350/200
- US count ≥ 100; Western Europe ≥ 250
- Every tier-1 city data_status == "measured"
- ≥ 80% of tier-2 cities have data_status in (measured, extrapolated)
- CityPicker covers all 1000
- /cities page loads in < 1 second

## 7 · What this unlocks

The atlas becomes the most-complete SMB benchmark city database on
the public internet. Search-volume capture goes up materially as long
tail of cities all get indexable URLs.
