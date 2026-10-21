"""Shared helpers for the rules builders: one row per published figure, the contract of PLAN-replicable.md Task 1."""
import json, os, re

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DL = "/srv/atlas/wc/cwd/data-rules/dl"

GEO = {
    "GB": {"level": "country", "code": "GB", "name": "United Kingdom"},
    "GB-ENG": {"level": "region", "code": "GB-ENG", "name": "England"},
    "london": {"level": "city", "code": "GB-london", "name": "London"},
    "city-of-london": {"level": "city", "code": "GB-city-of-london", "name": "City of London"},
    "US": {"level": "country", "code": "US", "name": "United States"},
    "US-CA": {"level": "region", "code": "US-CA", "name": "California"},
    "la-county": {"level": "county", "code": "US-CA-037", "name": "Los Angeles County"},
    "la": {"level": "city", "code": "US-los-angeles", "name": "Los Angeles"},
    "IT": {"level": "country", "code": "IT", "name": "Italy"},
    "IT-62": {"level": "region", "code": "IT-62", "name": "Lazio"},
    "rome": {"level": "city", "code": "IT-rome", "name": "Rome"},
    "HU": {"level": "country", "code": "HU", "name": "Hungary"},
    "budapest": {"level": "city", "code": "HU-budapest", "name": "Budapest"},
    "EA": {"level": "eu", "code": "EA", "name": "Euro area"},
}


def src(publisher, title, url):
    return {"publisher": publisher, "title": title, "url": url}


def R(item, geo, value, unit, year, source, note=None, measure=None, trade=None, officialClass=None):
    g = GEO[geo] if isinstance(geo, str) else geo
    r = {"item": item}
    if trade:
        r["trade"] = trade
    if officialClass:
        r["officialClass"] = officialClass
    r.update({"geo": g, "value": value, "unit": unit, "year": year})
    if measure:
        r["measure"] = measure
    if note:
        r["note"] = note
    r["source"] = source
    return r


def clean(t):
    """The copy rules forbid a semicolon in visible words: a note or measure that may print is split into sentences."""
    return re.sub(r";\s+(\S)", lambda m: ". " + m.group(1).upper(), t) if isinstance(t, str) else t


def write(name, fid, source, rows, retrieved="2026-10-17"):
    for r in rows:
        for k in ("note", "measure"):
            if k in r:
                r[k] = clean(r[k])
    d = {"id": fid, "source": source, "retrieved": retrieved, "rows": rows}
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(name, len(rows), "rows")
