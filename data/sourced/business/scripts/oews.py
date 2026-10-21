import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
DL = "/srv/atlas/runs/data-business/dl/us/"
OCC = {"351011": ("Chefs and Head Cooks", "restaurants"), "352014": ("Cooks, Restaurant", "restaurants"),
       "352021": ("Food Preparation Workers", "restaurants"), "353031": ("Waiters and Waitresses", "restaurants"),
       "353011": ("Bartenders", None), "353023": ("Fast Food and Counter Workers", "cafes"),
       "119051": ("Food Service Managers", "restaurants"), "395011": ("Barbers", "barbershops"),
       "395012": ("Hairdressers, Hairstylists, and Cosmetologists", None), "000000": ("All Occupations", "all")}
v = {}
for f in ("oews_a.json", "oews_b.json"):
    for s in json.load(open(DL + f))["Results"]["series"]:
        for x in s["data"]:
            if x["year"] == "2025" and x["period"] == "A01":
                v[s["seriesID"]] = x["value"]
rows = []
for o, (name, trade) in OCC.items():
    sid = f"OEUM0031080000000{o}08"
    if sid not in v:
        continue
    mean = v.get(f"OEUM0031080000000{o}03")
    soc = f"{o[:2]}-{o[2:]}"
    row = {"item": "pay_hourly", "officialClass": f"SOC {soc}: {name}" if o != "000000" else "00-0000: All Occupations",
           "geo": {"level": "metro", "code": "31080", "name": "Los Angeles-Long Beach-Anaheim, CA Metropolitan Statistical Area"},
           "value": float(v[sid]), "unit": "USD per hour", "year": "2025",
           "measure": f"median hourly wage, May 2025, all industries: {name}",
           "note": f"Employees only; the self-employed and owners are not covered. Series {sid}; hourly mean {mean} USD (series OEUM0031080000000{o}03)."
                   + (" The BLS definition: serve customers at counter or from a steam table, may prepare food and beverages; it does not name baristas, and the occupation spans fast food and coffee counters alike." if o == "353023" else ""),
           "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": f"Occupational Employment and Wage Statistics, May 2025, series {sid}",
                      "url": f"https://api.bls.gov/publicAPI/v2/timeseries/data/{sid}"}}
    if trade: row["trade"] = trade
    rows.append(row)
write("us-bls-oews-2025.json", {
    "id": "us-bls-oews-2025",
    "source": {"publisher": "U.S. Bureau of Labor Statistics", "title": "Occupational Employment and Wage Statistics (OEWS), May 2025, Los Angeles-Long Beach-Anaheim MSA (area 31080)",
               "url": "https://www.bls.gov/oes/current/oes_31080.htm",
               "table": "BLS Public Data API v2, series OEUM0031080000000{SOC}{08 hourly median, 03 hourly mean}, period A01 2025 (bls.gov pages refuse this server; the API is the publisher's own)",
               "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"},
    "retrieved": RETRIEVED, "rows": rows})
for r in rows: print(r.get("trade"), r["officialClass"], r["value"])
