"""ILOSTAT statutory nominal gross monthly minimum wage (DF_EAR_INEE_NOC_NB), newest year per catalog country.

Pull: https://sdmx.ilo.org/rest/data/ILO,DF_EAR_INEE_NOC_NB,1.0/?startPeriod=2015&format=csv -> DL/ilo_mw.csv
"""
import csv, re
from lib import COUNTRIES, ISO3, DL, RETRIEVED, geo, write

URL = "https://sdmx.ilo.org/rest/data/ILO,DF_EAR_INEE_NOC_NB,1.0/?startPeriod=2015&format=csv"
rows = list(csv.DictReader(open(f"{DL}/ilo_mw.csv", encoding="utf-8")))
latest = {}
for r in rows:
    iso2 = ISO3.get(r["REF_AREA"])
    if not iso2 or r["OBS_VALUE"] == "" or r["UNIT_MEASURE"] != "LC":
        continue
    if iso2 not in latest or r["TIME_PERIOD"] > latest[iso2]["TIME_PERIOD"]:
        latest[iso2] = r

out = []
excluded = []
for iso2 in sorted(latest):
    r = latest[iso2]
    assert r["UNIT_MULT"] in ("0", ""), r
    notes = [p.strip() for p in r["NOTE_INDICATOR"].split("|") + r["NOTE_SOURCE"].split("|") if p.strip()]
    cur = [p for p in notes if re.fullmatch(r"[A-Z]{3}: .+", p)]
    assert len(cur) == 1, (iso2, notes)
    code = cur[0][:3]
    # A note mis-attached by the publisher (a US BLS shutdown note on Bahrain's and Saudi Arabia's rows) is not carried.
    rest = [p for p in notes if p not in cur and "federal government shutdown" not in p and "11-month averages" not in p]
    # A row whose own note contradicts the series' monthly unit (an hourly or yearly time unit), or whose currency cannot be
    # the national one (Cambodia's 200 "KHR", the USD garment floor), is not written: listed in the report instead.
    bad = [p for p in rest if p.startswith("Time unit:") and p != "Time unit: Per month"]
    if bad or (iso2 == "KH" and code == "KHR" and float(r["OBS_VALUE"]) < 1000):
        excluded.append((iso2, r["TIME_PERIOD"], r["OBS_VALUE"], code, "; ".join(bad) or "currency KHR on a USD-sized figure"))
        continue
    v = float(r["OBS_VALUE"])
    out.append({
        "item": "minimum_wage_monthly",
        "geo": geo(iso2),
        "value": int(v) if v == int(v) else v,
        "unit": f"{code} per month",
        "year": r["TIME_PERIOD"],
        "measure": "statutory nominal gross monthly minimum wage, local currency (ILOSTAT, harmonised series)",
        "note": f"Source of the figure: {r['SOURCE']}. " + ". ".join(rest) + ("." if rest else ""),
    })
missing = sorted(set(COUNTRIES) - set(latest))
for e in excluded: print("EXCLUDED", *e)
print("countries with a row:", len(latest), "without:", len(missing), " ".join(missing))
write("ilostat-minimum-wage.json", {
    "id": "ilostat-minimum-wage",
    "source": {
        "publisher": "International Labour Organization (ILOSTAT)",
        "title": "Statutory nominal gross monthly minimum wage (local currency), annual",
        "url": URL,
        "table": "DF_EAR_INEE_NOC_NB, measure EAR_INEE_NB, unit LC",
        "licence": "ILO rights and permissions: databases and datasets with their metadata, from 3 May 2023, under Creative Commons CC BY 4.0, https://www.ilo.org/node/9321 (read through a search summary; ilostat.ilo.org refuses scripted requests)",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
