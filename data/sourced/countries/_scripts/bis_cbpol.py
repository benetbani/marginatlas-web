"""BIS central bank policy rates (WS_CBPOL), monthly, end of period: the December value of 2016 to 2025 and the newest month.

Pull: https://stats.bis.org/api/v1/data/WS_CBPOL/M./all?startPeriod=2016-01&format=csv -> DL/bis_cbpol.csv
"""
import csv, collections, re
from lib import DL, RETRIEVED, COUNTRIES, geo, write

URL = "https://stats.bis.org/api/v1/data/WS_CBPOL/M./all?startPeriod=2016-01&format=csv"
series = collections.defaultdict(list)
for r in csv.DictReader(open(f"{DL}/bis_cbpol.csv", encoding="utf-8")):
    if r["OBS_VALUE"] not in ("", "NaN"):
        series[r["REF_AREA"]].append(r)

out = []
for area in sorted(series):
    if area != "XM" and area not in COUNTRIES:
        continue
    obs = sorted(series[area], key=lambda r: r["TIME_PERIOD"])
    pick = [r for r in obs if r["TIME_PERIOD"].endswith("-12")]
    if obs[-1] not in pick:
        pick.append(obs[-1])
    g = {"level": "eu", "code": "EA", "name": "Euro area"} if area == "XM" else geo(area)
    comp = re.sub(r"\s+", " ", obs[-1]["COMPILATION"]).strip()
    for r in pick:
        row = {
            "item": "central_bank_rate",
            "geo": g,
            "value": float(r["OBS_VALUE"]) if "." in r["OBS_VALUE"] else int(r["OBS_VALUE"]),
            "unit": "% a year",
            "year": r["TIME_PERIOD"],
            "measure": "central bank policy rate, end of month",
            "note": (f"{r['SOURCE_REF'].strip()}. " + (f"Series definition: {comp}" if comp and r is obs[-1] else "")).strip(),
        }
        if area == "XM":
            row["note"] += " The euro area's rate, the same for every euro-area member."
        out.append(row)
    if area == "AR":
        # The series' own definition says no policy rate has been adopted since 10 July 2025: said as the fact, never a zero.
        assert comp.startswith("From 10 July 2025 onwards: no policy rate adopted"), comp
        out.append({"item": "central_bank_rate", "geo": g, "value": None, "unit": "% a year", "year": "2025-07-10",
                    "measure": "central bank policy rate", "note": "No policy rate adopted from 10 July 2025 (the BIS series' definition)."})
    last = obs[-1]["TIME_PERIOD"]
    if last < "2026":
        print("stale:", area, last)
have = {r["geo"]["code"] for r in out}
print("series:", len(have), "catalog countries:", len(have & set(COUNTRIES)))
write("bis-policy-rates.json", {
    "id": "bis-policy-rates",
    "source": {
        "publisher": "Bank for International Settlements (BIS), from each central bank",
        "title": "Central bank policy rates (WS_CBPOL), monthly, end of period",
        "url": URL,
        "table": "WS_CBPOL, frequency M: the December observation of 2016 to 2025 and the newest month published",
        "licence": "Terms of permitted use of BIS statistics (https://www.bis.org/terms_statistics.htm, read through a search summary, "
                   "the site refused scripted requests): free use with the BIS named as the source, on condition that including the "
                   "statistics in a commercial product adds no charge for its users",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
