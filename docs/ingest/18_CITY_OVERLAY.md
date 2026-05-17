# Phase 18 — Global City Overlay (top 200 metros across countries without city-level ingest)

> **Goal:** For every country where phases 1–16 didn't reach city
> level, manually curate the top 5–10 cities with population, then use
> a city-derived multiplier on the country/state extrapolation so that
> `/{country}/{city}/{industry}` URLs render meaningful (if approximate)
> data. This catches the long tail of cities people actually search for
> globally.

## Why this exists

Phases 1–16 give us:
- Full sub-national coverage in EU, US, JP, KR, CA, AU, NZ, top SEA, top LATAM, top MENA/AF
- BUT many countries are still only at state/province level (Russia, Vietnam-tier-2 cities, smaller MENA, most of Africa, smaller LATAM)
- AND many cities the founder explicitly cares about (Milan, Munich, Barcelona, Bangalore, Toronto, Melbourne, Mumbai) are populated by phases 1–12 BUT not all of them. This phase ensures every "famous SMB city" anyone might search for actually resolves.

## City list (illustrative — full list ~200 cities)

| Country | City | Source for city ratio |
|---|---|---|
| Russia | Moscow, St Petersburg, Novosibirsk, Yekaterinburg | Rosstat |
| Ukraine | Kyiv, Lviv, Odesa, Kharkiv | UkrStat |
| Belarus | Minsk, Brest, Gomel | BelStat |
| Vietnam | Hanoi, Ho Chi Minh City, Da Nang, Hai Phong, Can Tho | already in Phase 14 |
| Pakistan | Karachi, Lahore, Islamabad, Faisalabad | PBS |
| Bangladesh | Dhaka, Chittagong, Khulna | BBS |
| Sri Lanka | Colombo, Galle | DCS Sri Lanka |
| Iran | Tehran, Isfahan, Mashhad, Shiraz | SCI |
| Iraq | Baghdad, Basra, Erbil | CSO Iraq |
| Jordan | Amman, Zarqa | DOS Jordan |
| Lebanon | Beirut, Tripoli | CAS Lebanon |
| Qatar | Doha | PSA Qatar |
| Kuwait | Kuwait City | CSB |
| Bahrain | Manama | iGA |
| Oman | Muscat, Salalah | NCSI |
| Pakistan, Bangladesh, Nepal, Sri Lanka cities | as above | regional bureaus |
| All other countries' top-5 cities | population + extrapolation | World Cities Database (free) |

## Strategy

This phase does NOT pull new national-statistical-office data. Instead:

1. **City population dataset:** Download SimpleMaps World Cities (free, https://simplemaps.com/data/world-cities), filter to cities with population > 100k, plus all national capitals regardless.
2. **City share factor:** Estimate the city's share of national/state SMB activity using the population ratio + the OECD Productivity Premium for the country (1.0 = no premium, 1.4 = typical capital-city productivity premium).
3. **Per-cell city estimate:** Multiply country/state-level extrapolation by the city share factor; write to `regional_cells` with `geo_level = 'city'`, `coverage_tier = 'X'`, `quality_score = 35`.
4. **Clearly marked:** UI shows "City estimate" badge and links to the parent state/country cell for actual measured data.

## Schema mapping
```
country := <ISO-2>
geo_id := '<ISO-2>-CITY-' + city slug (e.g. 'RU-CITY-moscow')
geo_level := 'city'
geo_name := city name
industry_id := same as parent extrapolation
year := same as parent
size_band := 'total'
n_enterprises := parent × city_share_factor (rounded)
n_employees := parent × city_share_factor
revenue_per_firm := parent × productivity_premium
quality_score := 35
coverage_tier := 'X'
coverage_source := 'Estimated from city share of national activity'
currency := 'USD'
```

## Implementation
1. `scripts/ingest/global_cities/download_simplemaps.py`
2. `scripts/ingest/global_cities/compute_city_shares.py` — multiplies country extrapolation by population share + productivity premium
3. `scripts/ingest/global_cities/upload.py`
4. `scripts/ingest/global_cities/run.py`

## Expected output
~200 cities × 25 SMB industries = **~5,000 cells.** Storage: ~2 MB. Time: 3 hours.

## DoD
- [ ] Top 200 global cities outside Phases 1–16 reach renders
- [ ] Every cell with `coverage_tier = 'X'` shows the "Estimated" badge
- [ ] Spot: `/ru/city/moscow/restaurants`, `/ua/city/kyiv/web-mobile-dev-shops`, `/pk/city/karachi/restaurants`, `/iq/city/baghdad/restaurants` all return content with appropriate quality warning
- [ ] ≥ 4,000 city-overlay rows in `regional_cells`
