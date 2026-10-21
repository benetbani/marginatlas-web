import json, sys, itertools
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/ie/"
CSO = "Central Statistics Office (CSO), Ireland"
def S(t, title): return {"publisher": CSO, "title": f"{title} ({t})", "url": f"https://data.cso.ie/table/{t}"}
def cells(f):
    d = json.load(open(D + f)); cats = []
    for i in d["id"]:
        c = d["dimension"][i]["category"]; idx = c["index"]
        ks = idx if isinstance(idx, list) else sorted(idx, key=idx.get)
        cats.append([(k, c["label"][k]) for k in ks])
    for n, combo in enumerate(itertools.product(*cats)):
        yield combo, d["value"][n]
GEO = {"level": "county", "code": "IE-D", "name": "County Dublin (Dublin City, Dún Laoghaire-Rathdown, Fingal, South Dublin)"}
NOTE = "County Dublin, wider than Dublin City Council's area: the finest level published. Business demography scope: market enterprises of NACE B to S, non-market producers excluded from 2022 (the table's note)."
MEAS = "number of active enterprises in the business demography, reference year 2024"
rows = []
for combo, v in cells("BRA30.json"):
    if combo[0][0] == "BRA30C01" and combo[1][0] == "2024" and combo[2][0] == "-03" and "Dublin" in combo[3][1]:
        rows.append({"item": "business_count", "trade": "all", "officialClass": "NACE Rev 2, all activities in the business demography (all persons engaged size classes)",
                     "geo": GEO, "value": int(v), "unit": "active enterprises", "year": "2024", "measure": MEAS, "note": NOTE,
                     "source": S("BRA30", "Business Demography NACE Rev 2, by employment size, county and year")})
for combo, v in cells("BRA34.json"):
    if combo[0][0] == "BRA34C01" and combo[1][0] == "2024" and combo[2][0] in ("I56", "S96") and "Dublin" in combo[3][1]:
        a = combo[2][0]
        for t in (["restaurants", "cafes"] if a == "I56" else [None]):
            r = {"item": "business_count", "officialClass": "NACE Rev 2 " + combo[2][1], "geo": GEO, "value": int(v), "unit": "active enterprises", "year": "2024", "measure": MEAS,
                 "note": NOTE + (" The whole division 56: restaurants, cafes, pubs and takeaways together; the county table stops at divisions." if a == "I56" else " Hairdressing (96.02) cannot be separated at county level."),
                 "source": S("BRA34", "Business Demography, by activity, county and year")}
            if t: r["trade"] = t
            rows.append(r)
for combo, v in cells("G0420.json"):
    if combo[0][0] == "G0420C01" and "Dublin" in combo[2][1]:
        rows.append({"item": "population", "geo": GEO, "value": int(v), "unit": "persons", "year": combo[1][0], "measure": "population of the county, Census of Population 2022 (census night, 3 April 2022)",
                     "note": "Same county as the enterprise rows, two years earlier than their reference year: the newest county figure in this table.",
                     "source": S("G0420", "Population per County")})
write("ie-cso-2024.json", {"id": "eucities-ie-cso-2024",
    "source": {"publisher": CSO, "title": "CSO PxStat: Business Demography by county and activity; population per county", "url": "https://data.cso.ie/",
               "table": "PxStat API https://ws.cso.ie/public/api.restful/PxStat.Data.Cube_API.ReadDataset/{BRA30,BRA34,G0420}/JSON-stat/2.0/en (BRA tables updated 2026-10-06)",
               "licence": "Creative Commons Attribution 4.0 (CSO open data)"},
    "retrieved": RETRIEVED, "rows": rows})
