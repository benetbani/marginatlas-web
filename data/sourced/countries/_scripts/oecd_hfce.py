"""OECD national accounts, household final consumption expenditure by purpose, current prices, national currency: the twelve
COICOP 1999 divisions (Table 5, T501) or the thirteen COICOP 2018 divisions (Table 5A, T501) and the total, newest complete year,
for the catalog countries data-place's household-spending-by-purpose.json does not hold.

Pulls: https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_NAMAIN10@DF_TABLE5_T501,1.0/all?startPeriod=2018&format=csvfilewithlabels
       -> DL/oecd_t501.csv
       https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_NAMAIN10@DF_TABLE5A_T501,2.0/all?startPeriod=2020&format=csvfilewithlabels
       -> DL/oecd_t5a501.csv
"""
import csv, collections, json, os
from lib import DL, RETRIEVED, COUNTRIES, ISO3, OUT, geo, write

HELD = {r["geo"]["code"] for r in json.load(open(os.path.join(OUT, "..", "place", "household-spending-by-purpose.json")))["rows"]}
T5 = ("https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_NAMAIN10@DF_TABLE5_T501,1.0/all?startPeriod=2018&format=csvfilewithlabels",
      "oecd_t501.csv", "COICOP 1999", 12, "Annual household final consumption expenditure by purpose (COICOP), DSD_NAMAIN10@DF_TABLE5_T501")
T5A = ("https://sdmx.oecd.org/public/rest/data/OECD.SDD.NAD,DSD_NAMAIN10@DF_TABLE5A_T501,2.0/all?startPeriod=2020&format=csvfilewithlabels",
       "oecd_t5a501.csv", "COICOP 2018", 13, "Annual household final consumption expenditure by purpose (COICOP 2018), DSD_NAMAIN10@DF_TABLE5A_T501")
STATUS = {"P": "provisional", "E": "estimated", "B": "a break in the series", "D": "definition differs"}

out, done = [], set()
for url, fn, coicop, ndiv, title in (T5, T5A):
    cells = collections.defaultdict(dict)
    for r in csv.DictReader(open(f"{DL}/{fn}", encoding="utf-8")):
        iso2 = ISO3.get(r["REF_AREA"])
        if not iso2 or iso2 in HELD or r["PRICE_BASE"] != "V" or r["OBS_VALUE"] == "":
            continue
        e = r["EXPENDITURE"]
        if e == "_T" or (e.startswith("CP") and len(e) == 4):
            cells[(iso2, r["TIME_PERIOD"])][e] = r
    divs = [f"CP{i:02d}" for i in range(1, ndiv + 1)]
    for iso2 in sorted({k[0] for k in cells}):
        if iso2 in done:
            continue
        years = [y for (c, y), v in cells.items() if c == iso2 and all(d in v for d in divs + ["_T"])]
        if not years:
            continue
        y = max(years)
        v = cells[(iso2, y)]
        done.add(iso2)
        src = {"publisher": "OECD", "title": title, "url": url}
        for d in divs + ["_T"]:
            r = v[d]
            assert r["UNIT_MULT"] == "6" and r["UNIT_MEASURE"] == "XDC", r
            row = {
                "item": "household_spending_total" if d == "_T" else "household_spending",
                "geo": geo(iso2),
                "value": float(r["OBS_VALUE"]),
                "unit": f"{r['CURRENCY']} million",
                "year": y,
                "measure": ("Household final consumption expenditure, domestic concept" if d == "_T" else r["Expenditure"]),
                "note": f"National accounts, domestic concept (residents and non-residents on the territory), current prices, {coicop}"
                        + (f"; the OECD marks it {STATUS[r['OBS_STATUS']]}" if r["OBS_STATUS"] in STATUS else "") + ".",
                "source": src,
            }
            if d != "_T":
                row["officialClass"] = f"{coicop} {d[2:]}"
            out.append(row)
        tot = float(v["_T"]["OBS_VALUE"])
        part = sum(float(v[d]["OBS_VALUE"]) for d in divs)
        if abs(part / tot - 1) > 0.005:
            out[-1]["note"] += (f" The {ndiv} divisions as published add to {part / tot * 100:.1f}% of this total; a share drawn from them "
                                "must divide by this total and show the rest as not allocated by purpose.")
print("countries:", " ".join(sorted(done)))
print("catalog countries in neither file:", " ".join(sorted(set(COUNTRIES) - HELD - done)))
write("oecd-household-spending.json", {
    "id": "oecd-household-spending",
    "source": {
        "publisher": "OECD (national accounts)",
        "title": "Annual household final consumption expenditure by purpose, current prices, national currency",
        "url": T5[0],
        "table": "DSD_NAMAIN10@DF_TABLE5_T501 (COICOP 1999) and DF_TABLE5A_T501 (COICOP 2018, Japan and Korea); transaction P31DC, price base V",
        "licence": "OECD open by default policy (CC BY 4.0 default from 1 July 2024), https://www.oecd.org/en/about/oecd-open-by-default-policy.html",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
