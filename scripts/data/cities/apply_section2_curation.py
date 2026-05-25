"""
Cities Section 2 curation script.

One-shot edit applied to data/cities/city_list_v1.json + city_coordinates_v1.json
that:
  1. Adds the 33 founder-requested cities (Moscow, St Petersburg, European
     capitals, Baghdad, Baku, Algiers, Luanda, Muscat, Antalya, Doha,
     Manama, San Jose CR, Santo Domingo, Panama City, Bucharest, Tbilisi,
     Haifa, etc.)
  2. Removes Suva (founder: nobody cares).
  3. Removes Jerusalem (founder: replace with Haifa).
  4. Removes Andorra, San Marino, Vaduz (Liechtenstein) per micro-country rule.
  5. Normalizes continent labels to: Africa, Asia, Europe, North America,
     Oceania, South America. Drops the inconsistent EU / NA / SA / MENA
     short codes so Section 3 can group cleanly.

Run from project root:
    python scripts/data/cities/apply_section2_curation.py

No-op safe to re-run (idempotent: adds only if missing).
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LIST_FILE = ROOT / "data" / "cities" / "city_list_v1.json"
COORDS_FILE = ROOT / "data" / "cities" / "city_coordinates_v1.json"

# Founder-curated additions. Format: (slug, name, iso2, continent, tier,
# pop_m_metro, gdp_b_metro, wealth_z_legacy, lat, lon).
# pop_m and gdp_b are conservative metro estimates; Section 5 pipeline
# refines them with sourced values.
ADDITIONS: list[tuple] = [
    # Russia + post-Soviet
    ("moscow",            "Moscow",            "RU", "Europe", 1, 12.5, 850, 0, 55.7558,  37.6173),
    ("saint-petersburg",  "Saint Petersburg",  "RU", "Europe", 2,  5.4, 200, 0, 59.9311,  30.3609),
    ("kyiv",              "Kyiv",              "UA", "Europe", 2,  3.0,  70, 0, 50.4501,  30.5234),
    ("minsk",             "Minsk",             "BY", "Europe", 2,  2.0,  35, 0, 53.9006,  27.5590),
    ("chisinau",          "Chisinau",          "MD", "Europe", 3,  0.7,   8, 0, 47.0105,  28.8638),
    ("bucharest",         "Bucharest",         "RO", "Europe", 2,  2.4, 130, 0, 44.4268,  26.1025),
    ("tbilisi",           "Tbilisi",           "GE", "Asia",   3,  1.5,  35, 0, 41.7151,  44.8271),
    ("baku",              "Baku",              "AZ", "Asia",   2,  2.4,  65, 0, 40.4093,  49.8671),

    # Middle East + Gulf
    ("baghdad",           "Baghdad",           "IQ", "Asia",   1,  8.5, 110, 0, 33.3152,  44.3661),
    ("muscat",            "Muscat",            "OM", "Asia",   3,  1.6,  50, 0, 23.5859,  58.4059),
    ("doha",              "Doha",              "QA", "Asia",   3,  2.4, 140, 0, 25.2854,  51.5310),
    ("manama",            "Manama",            "BH", "Asia",   3,  0.7,  40, 0, 26.2235,  50.5876),
    ("haifa",             "Haifa",             "IL", "Asia",   3,  1.1,  45, 0, 32.7940,  34.9896),
    ("antalya",           "Antalya",           "TR", "Asia",   3,  2.6,  35, 0, 36.8841,  30.7056),

    # North + Sub-Saharan Africa
    ("algiers",           "Algiers",           "DZ", "Africa", 2,  4.5,  90, 0, 36.7372,   3.0866),
    ("luanda",            "Luanda",            "AO", "Africa", 2,  8.3,  80, 0, -8.8390,  13.2894),

    # Caribbean + Central America
    ("san-jose-cr",       "San Jose",          "CR", "North America", 3,  1.5,  35, 0,  9.9281, -84.0907),
    ("santo-domingo",     "Santo Domingo",     "DO", "North America", 3,  3.5,  50, 0, 18.4861, -69.9312),
    ("panama-city",       "Panama City",       "PA", "North America", 3,  1.9,  55, 0,  8.9824, -79.5199),

    # European capitals (the ones missing)
    ("sofia",             "Sofia",             "BG", "Europe", 3,  1.7,  55, 0, 42.6977,  23.3219),
    ("belgrade",          "Belgrade",          "RS", "Europe", 3,  1.7,  50, 0, 44.7866,  20.4489),
    ("sarajevo",          "Sarajevo",          "BA", "Europe", 3,  0.6,  12, 0, 43.8563,  18.4131),
    ("reykjavik",         "Reykjavik",         "IS", "Europe", 3, 0.25,  22, 0, 64.1466, -21.9426),
    ("bratislava",        "Bratislava",        "SK", "Europe", 3, 0.65,  35, 0, 48.1486,  17.1077),
    ("ljubljana",         "Ljubljana",         "SI", "Europe", 3, 0.55,  25, 0, 46.0569,  14.5058),
    ("zagreb",            "Zagreb",            "HR", "Europe", 3,  1.1,  40, 0, 45.8150,  15.9819),
    ("tirana",            "Tirana",            "AL", "Europe", 3,  0.9,  12, 0, 41.3275,  19.8187),
    ("skopje",            "Skopje",            "MK", "Europe", 3,  0.6,   8, 0, 41.9981,  21.4254),
    ("podgorica",         "Podgorica",         "ME", "Europe", 3, 0.19,   4, 0, 42.4304,  19.2594),
    ("pristina",          "Pristina",          "XK", "Europe", 3,  0.5,   5, 0, 42.6629,  21.1655),
    ("vilnius",           "Vilnius",           "LT", "Europe", 3,  0.6,  25, 0, 54.6872,  25.2797),
    ("riga",              "Riga",              "LV", "Europe", 3,  0.9,  25, 0, 56.9496,  24.1052),
    ("tallinn",           "Tallinn",           "EE", "Europe", 3, 0.55,  22, 0, 59.4370,  24.7536),
    ("nicosia",           "Nicosia",           "CY", "Europe", 3, 0.33,  12, 0, 35.1856,  33.3823),
    ("valletta",          "Valletta",          "MT", "Europe", 3,  0.4,  15, 0, 35.8989,  14.5146),
    ("bern",              "Bern",              "CH", "Europe", 3,  0.4,  30, 0, 46.9480,   7.4474),
]

# Slugs to REMOVE entirely.
REMOVALS: set[str] = {
    "suva",         # founder: nobody cares
    "jerusalem",    # founder: replace with Haifa (added above)
    "andorra",      # micro-country; founder excludes
    "san-marino",   # micro-country; founder excludes
    "vaduz",        # Liechtenstein; founder excludes
}

# Continent label normalization. Maps the inconsistent legacy labels to
# the 6 standard labels Section 3 will group by.
# MENA splits by country: Middle East countries go to Asia, North African
# countries go to Africa.
CONTINENT_RENAME = {
    "EU": "Europe",
    "NA": "North America",
    "SA": "South America",
    "Oceania": "Oceania",
    "Africa": "Africa",
    "Asia": "Asia",
}

# MENA countries that should be grouped under Africa (North Africa). Every
# other MENA country falls into Asia (Middle East).
MENA_AFRICA = {"EG", "MA", "TN", "LY", "DZ", "SD"}


def normalize_continent(entry: dict) -> str:
    cont = entry.get("continent", "")
    if cont == "MENA":
        iso2 = entry.get("iso2", "").upper()
        return "Africa" if iso2 in MENA_AFRICA else "Asia"
    return CONTINENT_RENAME.get(cont, cont)


def load_list() -> tuple[list[dict], dict]:
    """Returns (cities_array, wrapper_payload).

    The on-disk format is `{ "cities": [...] }` — the consumers
    (src/app/cities/[slug]/page.tsx) cast it to that shape. Preserve
    the wrapper so we don't break the cast."""
    data = json.loads(LIST_FILE.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data, {"cities": data}
    if isinstance(data, dict) and "cities" in data:
        return data["cities"], data
    raise SystemExit(f"Unexpected shape in {LIST_FILE}")


def write_list(arr: list[dict], wrapper: dict) -> None:
    wrapper["cities"] = arr
    LIST_FILE.write_text(
        json.dumps(wrapper, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def load_coords() -> dict:
    return json.loads(COORDS_FILE.read_text(encoding="utf-8"))


def write_coords(payload: dict) -> None:
    COORDS_FILE.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    cities, list_wrapper = load_list()
    coords_payload = load_coords()
    coord_rows: list[dict] = coords_payload.get("coordinates", [])

    print(f"loaded {len(cities)} cities + {len(coord_rows)} coords")

    # Normalize every existing entry's continent label.
    renamed = 0
    for c in cities:
        before = c.get("continent")
        after = normalize_continent(c)
        if before != after:
            c["continent"] = after
            renamed += 1
    print(f"renamed {renamed} continent labels to the 6 standard buckets")

    # Apply removals.
    before_count = len(cities)
    cities = [c for c in cities if c.get("slug") not in REMOVALS]
    coord_rows = [r for r in coord_rows if r.get("slug") not in REMOVALS]
    print(f"removed {before_count - len(cities)} entries: {sorted(REMOVALS)}")

    # Apply additions (idempotent: skip if slug already present).
    existing_slugs = {c.get("slug") for c in cities}
    existing_coord_slugs = {r.get("slug") for r in coord_rows}
    added_list = 0
    added_coords = 0
    for (slug, name, iso2, continent, tier, pop_m, gdp_b, wealth_z, lat, lon) in ADDITIONS:
        if slug not in existing_slugs:
            cities.append({
                "slug": slug,
                "name": name,
                "iso2": iso2,
                "continent": continent,
                "tier": tier,
                "pop_m": pop_m,
                "gdp_b": gdp_b,
                "wealth_z": wealth_z,
            })
            existing_slugs.add(slug)
            added_list += 1
        if slug not in existing_coord_slugs:
            coord_rows.append({"slug": slug, "lat": lat, "lon": lon})
            existing_coord_slugs.add(slug)
            added_coords += 1
    print(f"added {added_list} new cities to list, {added_coords} new coords")

    # Sort cities by slug for stable diffs.
    cities.sort(key=lambda c: c.get("slug", ""))
    coord_rows.sort(key=lambda r: r.get("slug", ""))

    # Sanity: every list entry has a coord row, and vice versa.
    list_slugs = {c["slug"] for c in cities}
    coord_slugs = {r["slug"] for r in coord_rows}
    missing_coords = sorted(list_slugs - coord_slugs)
    orphan_coords = sorted(coord_slugs - list_slugs)
    if missing_coords:
        print(f"WARN: list entries without coords: {missing_coords}")
    if orphan_coords:
        print(f"WARN: coords without list entry: {orphan_coords}")

    write_list(cities, list_wrapper)
    coords_payload["coordinates"] = coord_rows
    write_coords(coords_payload)

    print(f"final: {len(cities)} cities, {len(coord_rows)} coords")


if __name__ == "__main__":
    main()
