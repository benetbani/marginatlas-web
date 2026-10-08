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
code), each checked against its own source's name for it before anything is written, and the rule a list is cut by (a floor),
written into the file with its reason. A refusal says what is wrong and writes nothing.

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
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {
        "what": "Slices of files on disk outside this repo, the figures the home page's sections print; do not edit by hand",
        "built_by": "scripts/data/home/export_home.py",
        "files": {},
    }
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
    table's five-year percentage is a formula, so the share is worked out from its two counts. An area the publisher stars (over
    500 businesses at one postcode) is held out with that reason, recorded and never printed."""
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

    star = next((t for t in lines("Notes") if "500 businesses at a single postcode" in t), None)
    published = next((t.split(":", 1)[1].strip() for t in lines("Cover") if t.startswith("Date published")), None)
    if not star or not published:
        refuse("the workbook's note on starred areas, or its date of publication, is not where the 2024 release put them")

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
            held.append({**row, "why": "the publisher stars this area: over 500 businesses at one postcode, so its births are not like the other cities'"})
        else:
            drawn.append(row)
    obj = {"cohort": cohort, "year": cohort + 5, "table": "Table 5.1a", "published": published, "star_note": star, "uk": area(UK_AREA), "cities": drawn, "held_out": held}
    write("city_survival.json", obj, len(drawn) + len(held) + 1, [
        source("demography", DEMOGRAPHY, "ons", "Business demography, UK: 2024, reference tables, Table 5.1a: the 2019 births and their survival"),
    ])


EXPORTS = {
    "city_survival": city_survival,
}


if __name__ == "__main__":
    asked = sys.argv[1:] or list(EXPORTS)
    unknown = [a for a in asked if a not in EXPORTS]
    if unknown:
        raise SystemExit(f"usage: python -P scripts/data/home/export_home.py [{' | '.join(EXPORTS)}] (unknown: {', '.join(unknown)})")
    for a in asked:
        EXPORTS[a]()
