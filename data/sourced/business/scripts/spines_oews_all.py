"""BLS OEWS May 2025, all occupations: annual mean and median wage, US and California (public API v1)."""
import json, os, urllib.request
from spines_lib import DL, RETRIEVED, write

API = "https://api.bls.gov/publicAPI/v1/timeseries/data/"
SIDS = {"N0000000": {"level": "country", "code": "US", "name": "United States"}, "S0600000": {"level": "region", "code": "06", "name": "California"}}
path = os.path.join(DL, "us", "oews_all.json")
if not os.path.exists(path):
    sids = [f"OEU{a}000000000000{t}" for a in SIDS for t in ("04", "13", "01")]
    req = urllib.request.Request(API, method="POST", headers={"Content-Type": "application/json"},
                                 data=json.dumps({"seriesid": sids, "startyear": "2025", "endyear": "2025"}).encode())
    open(path, "wb").write(urllib.request.urlopen(req).read())
v = {s["seriesID"]: x["value"] for s in json.load(open(path))["Results"]["series"] for x in s["data"] if x["year"] == "2025"}
rows = []
for a, geo in SIDS.items():
    emp = int(v[f"OEU{a}00000000000001"])
    for t, kind in (("04", "mean"), ("13", "median")):
        sid = f"OEU{a}000000000000{t}"
        rows.append({"item": "average_wage", "officialClass": "SOC 00-0000: All Occupations, all industries", "geo": geo,
                     "value": float(v[sid]), "unit": "USD per year", "year": "2025",
                     "measure": f"{kind} annual wage, all occupations, May 2025",
                     "note": f"Wage and salary employees, full-time and part-time together (the survey does not split them); the annual wage is the hourly wage times 2,080 hours for most occupations. Self-employed and owners not covered. {emp:,} employees. Series {sid}.",
                     "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": f"Occupational Employment and Wage Statistics, May 2025, series {sid}", "url": API}})
write("business", "us-bls-oews-all-2025.json", {
    "id": "us-bls-oews-all-2025",
    "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": "Occupational Employment and Wage Statistics (OEWS), May 2025, all occupations, national and California",
               "url": "https://www.bls.gov/oes/tables.htm",
               "table": "BLS Public Data API v1, series OEUN0000000000000000000{04 annual mean, 13 annual median, 01 employment} and OEUS0600000000000000000{04, 13, 01}, 2025",
               "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"},
    "retrieved": RETRIEVED, "rows": rows})
