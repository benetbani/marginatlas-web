"""
scripts/data/home/export_home.py: THE HOME PAGE'S FIGURES FROM FILES ON DISK OUTSIDE THIS REPO (plan
docs/superpowers/plans/2026-10-08-home-sections/PLAN.md; his section ideas of 2026-10-08, the audit's top four).

The site's build never reads the network or another repo (its chain runs on Vercel), so the figures the home's new sections print
are copied in here, sliced to what they print, and fingerprinted the way E:/atlas/registers/uk/export_for_site.py fingerprints the
register slices: data/home/manifest.json holds each file's SHA-256 and rows, the day this export ran, and every source it read (its
path, bytes and SHA-256, the publisher's key on the sources page, src/lib/spine/uk_sources.ts, and whether a figure prints from it).
The section gates (tests/home/*.test.ts, through scripts/lib/home_export.ts) recompute each hash, so a figure edited by hand fails
the chain, and on the machine that holds the sources they hash each source again, so a source that changed since the export fails
until this runs again. It is a script of its own, not a slice of export_for_site.py: re-running that export would move every UK
page's "Checked" date (his ruling: Checked is the export's day) for figures nobody read again.

Every figure is read from its source as published (a count, a published rate) or worked out here from what was read (a share of
100 from two counts, half up to one decimal, in Decimal); none is typed. What is typed is identifiers (an area's code, a metro's
code and the state its city stands in), each checked against its own source's name for it before anything is written, and the rule
a list is cut by (a floor), written into the file with its reason. A refusal says what is wrong and writes nothing. What it writes
is read line by line by the build's internal-notes gate (scripts/verify_no_internal_notes.ts), so a note is the publisher's own
words and nothing in the files speaks of this machine's files or of running anything.

By hand, never in the chain (it reads the parent repo), from the website root, with the Python that holds openpyxl and pyarrow:
  python -P scripts/data/home/export_home.py city_survival     section 1: of 100 firms born in a year, still trading five years on
  python -P scripts/data/home/export_home.py new_companies     section 2: new limited companies per 1,000 people of working age
  python -P scripts/data/home/export_home.py us_restaurants    section 3: full-service restaurants in 45 US metros, two years
  python -P scripts/data/home/export_home.py method            section 4: the insolvency notices the failure rates were read from
(each joins with its task; with no argument, every one this file holds runs.)
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

OUT = Path("data/home")
MANIFEST = OUT / "manifest.json"
CITY_LIST = Path("data/cities/city_list_v1.json")
PROFILE = Path("data/economic_indicators/country_profile_v2.json")


def refuse(what: str) -> None:
    raise SystemExit(f"export refused: {what}; nothing was written")


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def source(key: str, path: str, publisher: str | None, title: str, prints: bool = True) -> dict:
    """A source as the manifest records it; `prints` is false for a file read only to check or to cut what another prints."""
    p = Path(path)
    if not p.is_file():
        refuse(f"{path} is not on this machine")
    return {"key": key, "path": path, "bytes": p.stat().st_size, "sha256": sha256_of(p), "publisher": publisher, "title": title, "prints": prints}


def share(survived: int, births: int) -> float:
    """Of 100, half up to one decimal: the site's rounding, in Decimal so no float tips a half."""
    return float((Decimal(survived) * 100 / Decimal(births)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def cities_of(iso2: str) -> list[dict]:
    """The city list's cities of one country, by slug: the pages this export may print a figure for."""
    rows = json.loads(CITY_LIST.read_text(encoding="utf-8"))["cities"]
    return sorted((c for c in rows if str(c.get("iso2", "")).upper() == iso2), key=lambda c: c["slug"])


def write(name: str, obj: dict, rows: int, sources: list[dict]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    text = json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=True) + "\n"
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {"files": {}}
    # The two lines that say what the file is are set on every write, so a change of wording reaches a manifest that already exists.
    manifest["what"] = "Slices of files outside this repo, the figures the home page's sections print; do not edit by hand"
    manifest["built_by"] = "scripts/data/home/export_home.py"
    manifest["files"][name] = {"sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "rows": rows, "built": date.today().isoformat(), "sources": sources}
    (OUT / name).write_text(text, encoding="utf-8", newline="\n")
    MANIFEST.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    print(f"{name}: {rows} rows, {manifest['files'][name]['sha256'][:12]}")


# ---- section 1: where new firms last ---------------------------------------------------------------------------------------------

DEMOGRAPHY = "E:/atlas/cache/uk/ons_demography/2026-10-02/businessdemographyexceltables2024.xlsx"
# THE UK CITIES WITH A PAGE, by their areas' own codes in the tables (London's page is Greater London: the region's row).
CITY_AREAS = {
    "birmingham": "E08000025",
    "bristol": "E06000023",
    "edinburgh": "S12000036",
    "glasgow": "S12000049",
    "leeds": "E08000035",
    "london": "E12000007",
    "manchester": "E08000003",
}
UK_AREA = "K02000001"


def city_survival() -> None:
    """Of 100 firms born in the table's cohort, how many still traded five years on, per UK city with a page (Table 5.1a). The
    table's five-year percentage is a formula, so the share is worked out from its two counts. An area the publisher stars is held
    out with the publisher's own reason, recorded and never printed. The publisher's note on stars is kept whole, for it goes on to
    say that areas with up to 500 such businesses are not identified."""
    import openpyxl

    cities = cities_of("GB")
    if [c["slug"] for c in cities] != sorted(CITY_AREAS):
        refuse(f"the city list's UK cities {[c['slug'] for c in cities]} are not the areas this export reads {sorted(CITY_AREAS)}")
    wb = openpyxl.load_workbook(DEMOGRAPHY, read_only=True)
    head, rows = None, {}
    for r in wb["Table 5.1a"].iter_rows(values_only=True):
        if head is None:
            if r and len(r) > 12 and isinstance(r[2], str) and r[2].strip().endswith("Births"):
                head = r
            continue
        if r and isinstance(r[0], str) and r[0].strip():
            rows[r[0].strip()] = r
    if head is None or str(head[11]).strip() != "5-year survival":
        refuse("Table 5.1a holds no births column or no five-year survival column where the 2024 release put them")
    cohort = int(str(head[2]).split()[0])

    def lines(sheet: str) -> list[str]:
        return [" ".join(str(v) for v in r if v is not None) for r in wb[sheet].iter_rows(values_only=True)]

    def note_of(sheet: str, phrase: str) -> tuple[str, str] | None:
        """The numbered note of `sheet` with `phrase` in a row of its description: that row, and the note whole, every row from its
        number to the next number as the publisher wrote it (spaces tidied) and joined by a space. Nothing of it is typed here but
        the phrase it is found by."""
        entries = []
        for r in wb[sheet].iter_rows(values_only=True):
            cells = [*r, None, None]
            entries.append((cells[0], " ".join(str(cells[1]).split()) if cells[1] is not None else ""))
        hit = next((i for i, (num, text) in enumerate(entries) if num is None and phrase in text), None)
        if hit is None:
            return None
        top, end = hit, hit + 1
        while top > 0 and entries[top][0] is None:
            top -= 1
        while end < len(entries) and entries[end][0] is None:
            end += 1
        if entries[top][0] is None:
            return None
        return entries[hit][1], " ".join(text for _, text in entries[top + 1 : end] if text)

    star = note_of("Notes", "500 businesses at a single postcode")
    reason = re.search(r"more than \d+ businesses at a single postcode", star[0]) if star else None
    published = next((t.split(":", 1)[1].strip() for t in lines("Cover") if t.startswith("Date published")), None)
    if not star or not reason or not published:
        refuse("the workbook's note on starred areas, or its date of publication, is not where or as the 2024 release put them")

    def area(code: str) -> dict:
        r = rows.get(code)
        if r is None:
            refuse(f"Table 5.1a holds no row {code}")
        births, survived = int(r[2]), int(r[11])
        if births <= 0 or not 0 <= survived <= births:
            refuse(f"{code}: {survived} of {births} is not a share")
        return {"code": code, "name_in_table": str(r[1]).strip(), "births": births, "survived": survived, "pct": share(survived, births)}

    drawn, held = [], []
    for c in cities:
        a = area(CITY_AREAS[c["slug"]])
        if c["name"].lower() not in a["name_in_table"].lower():
            refuse(f"{a['code']} reads {a['name_in_table']!r} in the table, not {c['name']!r}")
        row = {"slug": c["slug"], "name": c["name"], **a}
        if a["name_in_table"].endswith("*"):
            held.append({**row, "why": f"the publisher stars this area: {reason.group(0)}"})
        else:
            drawn.append(row)
    obj = {"cohort": cohort, "year": cohort + 5, "table": "Table 5.1a", "published": published, "star_note": star[1], "uk": area(UK_AREA), "cities": drawn, "held_out": held}
    write("city_survival.json", obj, len(drawn) + len(held) + 1, [
        source("demography", DEMOGRAPHY, "ons", "Business demography, UK: 2024, reference tables, Table 5.1a: the 2019 births and their survival"),
    ])


# ---- section 2: where new companies open -----------------------------------------------------------------------------------------

DENSITY = "E:/atlas/macro/global-aggregates/wb-business-density.json"
LABOUR = "E:/atlas/macro/global-aggregates/wb-labor-force-total.json"
# Every row of a series file names its own indicator; series() reads it and refuses a file that is not the one asked for.
DENSITY_INDICATOR = "IC.BUS.NDNS.ZS"
LABOUR_INDICATOR = "SL.TLF.TOTL.IN"
# THE FLOOR: a labour force under a million, in the same year as the rate, leaves a country out of the lists (on 2022's figures Cape
# Verde, Mauritius and Barbados hold a rate and are left out). It states what it does and no cause: no file says why a small
# economy's rate differs from the rest.
FLOOR = 1_000_000
SHOWN_AT_LEAST = 5
# A MENA country counts as African by where its cities stand in the city list. Those with no city there cannot be placed that way,
# so each is named here and placed by its continent (Libya: Africa; Palestine, Syria and Yemen: not Africa), never left to fall out
# of Africa for want of a city. The export refuses, naming the country, when a MENA country with no city is missing from this map,
# and when a country named here has a city or is not MENA, so the map cannot go stale unseen. On the 2022 figures Libya holds no
# rate, so placing it in Africa changes nothing a list shows.
MENA_WITHOUT_A_CITY: dict[str, str | None] = {"LY": "africa", "PS": None, "SY": None, "YE": None}


def series(path: str, want: str) -> tuple[dict, dict, str]:
    """A World Bank series file: its header, {country: {year: value}} and the indicator it names. Every row names one, and it must
    be `want`: a file of another indicator is refused, so the id the slice records is the file's own, read here."""
    meta, rows = json.loads(Path(path).read_text(encoding="utf-8"))
    ids = {(r.get("indicator") or {}).get("id") for r in rows}
    if ids != {want}:
        refuse(f"{path} names the indicator(s) {sorted(str(i) for i in ids)}, not {want}")
    by: dict[str, dict[str, float]] = {}
    for r in rows:
        if r.get("value") is not None:
            by.setdefault(r["country"]["id"], {})[r["date"]] = r["value"]
    return meta, by, next(iter(ids))


def new_companies() -> None:
    """New limited companies registered in a year per 1,000 people aged 15 to 64, each country of Latin America and of Africa (by
    the country profile in this repo), the UK's beside them for scale. A MENA country is African by where its cities stand in the
    city list, and one with no city there by MENA_WITHOUT_A_CITY. The year is the latest in which both regions show five
    countries over the floor and the UK has a figure: worked out, never typed."""
    meta, density, density_id = series(DENSITY, DENSITY_INDICATOR)
    _, labour, labour_id = series(LABOUR, LABOUR_INDICATOR)
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))["countries"]
    city_continent: dict[str, str] = {}
    for c in json.loads(CITY_LIST.read_text(encoding="utf-8"))["cities"]:
        city_continent.setdefault(str(c["iso2"]).upper(), c["continent"])
    stale = sorted(i for i in MENA_WITHOUT_A_CITY if profile.get(i, {}).get("continent") != "MENA" or i in city_continent)
    if stale:
        refuse(f"MENA_WITHOUT_A_CITY names {', '.join(stale)}; each must be a MENA country with no city in the city list")

    def region_of(iso2: str, p: dict) -> str | None:
        if p.get("world_bank_region") == "Latin America & Caribbean":
            return "latam"
        if p.get("continent") == "Africa":
            return "africa"
        if p.get("continent") == "MENA":
            if iso2 in city_continent:
                return "africa" if city_continent[iso2] == "Africa" else None
            if iso2 not in MENA_WITHOUT_A_CITY:
                refuse(f"{iso2} ({p.get('name')}) is a MENA country with no city in the city list, and MENA_WITHOUT_A_CITY does not place it")
            return MENA_WITHOUT_A_CITY[iso2]
        return None

    members: dict[str, list[str]] = {"latam": [], "africa": []}
    for iso2, p in profile.items():
        r = region_of(iso2, p)
        if r:
            members[r].append(iso2)

    def shown(iso2: str, year: str) -> bool:
        return density.get(iso2, {}).get(year) is not None and (labour.get(iso2, {}).get(year) or 0) >= FLOOR

    years = sorted({y for v in density.values() for y in v}, reverse=True)
    year = next((y for y in years if all(sum(shown(i, y) for i in members[k]) >= SHOWN_AT_LEAST for k in members) and density.get("GB", {}).get(y) is not None), None)
    if year is None:
        refuse("no year in which both regions show five countries over the floor and the UK has a figure")
    regions = []
    named = ", ".join(sorted(i for i, r in MENA_WITHOUT_A_CITY.items() if r == "africa"))
    africa_rule = "the profile's continent is Africa, or MENA with the country's cities in Africa" + (f", or MENA with no city in the list and named as African ({named})" if named else "")
    for key, rule in (("latam", "the profile's world_bank_region is Latin America & Caribbean"), ("africa", africa_rule)):
        regions.append({"key": key, "rule": rule, "members": [
            {"iso2": i, "value": density.get(i, {}).get(year), "labour_force": labour.get(i, {}).get(year), "shown": shown(i, year)}
            for i in sorted(members[key])
        ]})
    obj = {
        "year": int(year),
        "measure": density_id,
        "last_updated": meta.get("lastupdated"),
        "floor": {"measure": labour_id, "year": int(year), "at_least": FLOOR, "why": f"a labour force under {FLOOR:,} is left out of the lists"},
        "uk": {"iso2": "GB", "value": density["GB"][year]},
        "regions": regions,
    }
    write("new_companies.json", obj, sum(len(r["members"]) for r in regions) + 1, [
        source("density", DENSITY, "worldbank", f"New business density ({density_id}): new limited companies registered per 1,000 people aged 15 to 64"),
        source("labour_force", LABOUR, "worldbank", f"Labor force, total ({labour_id}): the list's floor", prints=False),
    ])


# ---- section 3: where US restaurants grew and shrank -----------------------------------------------------------------------------

QCEW_DIR = "E:/atlas/us/bls/qcew/parsed"
SUSB = "E:/atlas/us/susb/2021/msa_3digitnaics_2021.txt"
TRADE = ("722511", "Full-service restaurants")
# THE US CITIES WITH A PAGE, each by its metro's code in the employment census ("C" and the first four digits of its CBSA) and the
# state its page stands in (the first state of the metro's title, the principal city's own). Each is checked against the metro's
# published title (SUSB's MSADSCR) before anything is written: the title must name the city and the state must be one of the title's
# states, so a metro of the same name in another state (Columbus GA-AL or Columbus IN beside Columbus OH) is refused, not taken.
METROS: dict[str, tuple[str, str]] = {
    "atlanta": ("C1206", "GA"), "austin": ("C1242", "TX"), "baltimore": ("C1258", "MD"), "boston": ("C1446", "MA"), "buffalo": ("C1538", "NY"),
    "charlotte": ("C1674", "NC"), "chicago": ("C1698", "IL"), "cincinnati": ("C1714", "OH"), "cleveland": ("C1746", "OH"), "columbus": ("C1814", "OH"),
    "dallas": ("C1910", "TX"), "denver": ("C1974", "CO"), "detroit": ("C1982", "MI"), "honolulu": ("C4652", "HI"), "houston": ("C2642", "TX"),
    "indianapolis": ("C2690", "IN"), "kansas-city": ("C2814", "MO"), "las-vegas": ("C2982", "NV"), "los-angeles": ("C3108", "CA"), "louisville": ("C3114", "KY"),
    "memphis": ("C3282", "TN"), "miami": ("C3310", "FL"), "milwaukee": ("C3334", "WI"), "minneapolis": ("C3346", "MN"), "nashville": ("C3498", "TN"),
    "new-orleans": ("C3538", "LA"), "new-york": ("C3562", "NY"), "oklahoma-city": ("C3642", "OK"), "orlando": ("C3674", "FL"), "philadelphia": ("C3798", "PA"),
    "phoenix": ("C3806", "AZ"), "pittsburgh": ("C3830", "PA"), "portland": ("C3890", "OR"), "raleigh": ("C3958", "NC"), "richmond": ("C4006", "VA"),
    "sacramento": ("C4090", "CA"), "salt-lake-city": ("C4162", "UT"), "san-antonio": ("C4170", "TX"), "san-diego": ("C4174", "CA"), "san-francisco": ("C4186", "CA"),
    "san-jose": ("C4194", "CA"), "seattle": ("C4266", "WA"), "st-louis": ("C4118", "MO"), "tampa": ("C4530", "FL"), "washington-dc": ("C4790", "DC"),
}


def title_states(title: str) -> list[str]:
    """The states a metro's published title names: the text after its last comma and before " Metro Area", split on "-"
    ("Columbus, GA-AL Metro Area" names GA and AL). A title with no comma names none."""
    if "," not in title:
        return []
    return [s for s in title.rsplit(",", 1)[1].strip().removesuffix(" Metro Area").split("-") if s]


def us_restaurants() -> None:
    """Full-service restaurants with staff (private establishments, NAICS 722511) in each US metro the site has a city page for, in
    the first and the last year the parsed files hold. A row the publisher marks "N" withholds employment and wages, never its
    count of establishments, so the count is kept and the mark recorded. Each city's metro is its code and its state, both typed in
    METROS; the title the code resolves to must name the city and hold the state, so a code that lands on a metro of the same name
    in another state is refused."""
    import pyarrow.parquet as pq

    us = cities_of("US")
    if [c["slug"] for c in us] != sorted(METROS):
        refuse(f"the city list's US cities are not the metros this export reads ({len(us)} against {len(METROS)})")
    titles: dict[str, str] = {}
    with Path(SUSB).open(encoding="latin-1", newline="") as f:
        for row in csv.reader(f):
            # One row a CBSA (its total, all sizes); a CBSA's code ends in 0, so "C" and its first four digits name it alone.
            if len(row) > 9 and row[1] == "--" and row[2] == "01" and row[0].endswith("0"):
                key = "C" + row[0][:4]
                if key in titles and titles[key] != row[9]:
                    refuse(f"{key} names two metros in the titles file")
                titles[key] = row[9]
    years = sorted(int(p.stem.rsplit("_", 1)[1]) for p in Path(QCEW_DIR).glob("qcew_cells_*.parquet"))
    if len(years) < 2:
        refuse(f"{QCEW_DIR} holds fewer than two years")
    first, last = years[0], years[-1]
    wanted = {code for code, _ in METROS.values()}
    counts: dict[int, dict[str, tuple[int, str | None]]] = {}
    for y in (first, last):
        pf = pq.ParquetFile(f"{QCEW_DIR}/qcew_cells_{y}.parquet")
        got: dict[str, tuple[int, str | None]] = {}
        for g in range(pf.metadata.num_row_groups):
            t = pf.read_row_group(g, columns=["area_fips", "naics", "own_code", "estabs", "disclosure_code"]).to_pydict()
            for a, n, o, e, dc in zip(t["area_fips"], t["naics"], t["own_code"], t["estabs"], t["disclosure_code"]):
                if n == TRADE[0] and o == "5" and a in wanted:
                    if a in got:
                        refuse(f"{a} holds two rows of {TRADE[0]} in {y}")
                    got[a] = (e, dc)
        counts[y] = got
    metros = []
    for c in us:
        a, state = METROS[c["slug"]]
        t = titles.get(a)
        city = c["name"].split(",")[0].strip()
        if not t or not t.endswith("Metro Area") or city.lower() not in t.lower():
            refuse(f"{a} is {t!r}, not a metro area named for {c['name']}")
        states = title_states(t)
        if state not in states:
            refuse(f"{c['name']} ({a}) is {t!r}, which names {'-'.join(states) or 'no state'}, not {state}: put the city's own metro code and state beside it in METROS")
        f0, f1 = counts[first].get(a), counts[last].get(a)
        if not f0 or not f1 or not f0[0] or not f1[0]:
            refuse(f"{a} ({c['name']}) holds no count in {first} or {last}")
        metros.append({"slug": c["slug"], "name": c["name"], "area": a, "state": state, "title": t, "y_from": int(f0[0]), "y_to": int(f1[0]), "codes": [f0[1], f1[1]]})
    if len({m["area"] for m in metros}) != len(metros):
        refuse("two cities share one metro")
    obj = {"trade": {"naics": TRADE[0], "title": TRADE[1]}, "ownership": "private", "from": first, "to": last, "metros": metros}
    write("us_restaurants.json", obj, len(metros), [
        source("qcew_from", f"{QCEW_DIR}/qcew_cells_{first}.parquet", "bls", f"Quarterly Census of Employment and Wages, {first} annual averages, private establishments, parsed"),
        source("qcew_to", f"{QCEW_DIR}/qcew_cells_{last}.parquet", "bls", f"Quarterly Census of Employment and Wages, {last} annual averages, private establishments, parsed"),
        source("metro_titles", SUSB, None, "Statistics of US Businesses 2021, metro areas: each code's published name, read to check the codes", prints=False),
    ])


# ---- section 4: how figures are made ---------------------------------------------------------------------------------------------

FAILURES = "E:/atlas/registers/uk/tables/company_failures_by_trade.json"


def method() -> None:
    """The year of insolvency notices the failure rates were read from: how many notices, how many company names they held, how
    many of those the register matched by name, how many notices matched nothing (the registers' failures table, its `match`)."""
    t = json.loads(Path(FAILURES).read_text(encoding="utf-8"))
    m = t.get("match") or {}
    keys = ("notices", "names", "matched_names", "unmatched_notices")
    if not all(isinstance(m.get(k), int) and m[k] >= 0 for k in keys):
        refuse("the failures table holds no whole match counts; rebuild it with registers/uk/build_gazette.py")
    if not (m["matched_names"] <= m["names"] <= m["notices"]) or m["unmatched_notices"] > m["notices"]:
        refuse("the failures table's match counts do not nest")
    obj = {**{k: m[k] for k in keys}, "source": t["source"]}
    write("method.json", obj, 1, [
        source("failures", FAILURES, "gazette", "The registers' failures table: a year of company insolvency notices, matched by name to the company register"),
    ])


EXPORTS = {
    "city_survival": city_survival,
    "new_companies": new_companies,
    "us_restaurants": us_restaurants,
    "method": method,
}


if __name__ == "__main__":
    asked = sys.argv[1:] or list(EXPORTS)
    unknown = [a for a in asked if a not in EXPORTS]
    if unknown:
        raise SystemExit(f"usage: python -P scripts/data/home/export_home.py [{' | '.join(EXPORTS)}] (unknown: {', '.join(unknown)})")
    for a in asked:
        EXPORTS[a]()
