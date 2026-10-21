import csv, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/dk/"
DST = "Danmarks Statistik (Statistics Denmark)"
def S(t, title): return {"publisher": DST, "title": f"Statbank {t}: {title}", "url": f"https://www.statbank.dk/{t}"}
def rd(f): return list(csv.DictReader(open(D + f, encoding="utf-8-sig"), delimiter=";"))
GEO = {"Copenhagen": {"level": "city", "code": "101", "name": "København (Copenhagen municipality)"},
       "Province Byen København": {"level": "metro", "code": "DK-PROV-01", "name": "Landsdel Byen København (Copenhagen, Frederiksberg, Dragør, Tårnby)"}}
TR = {"TOT": "all", "561010": "restaurants", "563000": "cafes", "960210": "barbershops"}
rows = []
for r in rd("gf12.csv"):
    code = r["BRANCHEDB0710TIL127"].split(" ")[0]
    cls = r["BRANCHEDB0710TIL127"].strip()
    row = {"item": "business_count", "officialClass": "DB07 " + cls, "geo": GEO[r["KOMK"]], "value": int(r["INDHOLD"]), "unit": "enterprises",
           "year": r["TID"], "measure": "number of enterprises (firms) in the general enterprise statistics, by municipality, reference year 2024",
           "note": ("The province (landsdel) holding the city: Copenhagen with Frederiksberg, Dragør and Tårnby. " if r["KOMK"] != "Copenhagen" else "") +
                   {"56000": "The whole restaurant grouping (DB07 127-grouping 56000).", "561010": "Restaurants alone: pizzerias and takeaways (561020) apart.",
                    "563000": "Pubs, bars, cafés, coffee shops and discotheques together.", "960210": "Hairdressing, barbers included."}.get(code, ""),
           "source": S("GF12", "General enterprise statistics by municipality, industry (DB07 10-, 19- and 127-grouping and detailed) and time")}
    if not row["note"]: del row["note"]
    if code in TR: row["trade"] = TR[code]
    rows.append(row)
for r in rd("folk.csv"):
    y = r["TID"][:4]
    rows.append({"item": "population", "geo": GEO["Copenhagen"], "value": int(r["INDHOLD"]), "unit": "persons", "year": y,
                 "measure": f"population on the first day of the quarter, 1 January {y}", "note": "Copenhagen municipality, the boundary of the enterprise rows. 1 January 2025 closes the enterprise reference year 2024.",
                 "source": S("FOLK1A", "Population at the first day of the quarter by region, sex, age, marital status and time")})
for r in rd("hotel1.csv"):
    who = "guests resident outside Denmark" if r["NATION1"].startswith("World") else "all guests, residents of Denmark included"
    rows.append({"item": "visitors" if r["NATION1"].startswith("World") else "visitors_total", "geo": GEO["Province Byen København"], "value": int(r["INDHOLD"]),
                 "unit": "nights", "year": r["TID"], "measure": f"nights spent at hotels and holiday resorts by {who}, whole year",
                 "note": "Published for the province Byen København (Copenhagen, Frederiksberg, Dragør, Tårnby), not the municipality. Table footnote: only hotels with a minimum of 40 beds participate.",
                 "source": S("HOTEL1", "Nights spent at hotels and holiday resorts by region, nationality of the guest, unit, period and time")})
write("dk-dst-2024.json", {"id": "eucities-dk-dst-2024",
    "source": {"publisher": DST, "title": "Statbank Denmark: GF12 general enterprise statistics, FOLK1A population, HOTEL1 hotel nights",
               "url": "https://www.statbank.dk/", "table": "API https://api.statbank.dk/v1/data, tables GF12 (2024), FOLK1A (2025Q1, 2026Q1), HOTEL1 (2024, 2025)",
               "licence": "Statistics Denmark terms of use: free reuse with the source given (https://www.dst.dk/en)"},
    "retrieved": RETRIEVED, "rows": rows})
