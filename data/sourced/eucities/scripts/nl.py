import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/nl/"
O = "https://opendata.cbs.nl/ODataApi/odata/"
CBS = "CBS (Centraal Bureau voor de Statistiek)"
LIC = "CC BY 4.0, CBS copyright https://www.cbs.nl/en-gb/about-us/website/copyright"
GM = {"GM0363": "Amsterdam", "GM0599": "Rotterdam"}
CR = {"CR23": ("Groot-Amsterdam (COROP area)", "Amsterdam"), "CR29": ("Groot-Rijnmond (COROP area)", "Rotterdam")}
MEAS = "number of business establishments (vestigingen) in the business register, 1 January 2026, provisional"
S1 = {"publisher": CBS, "title": "Vestigingen van bedrijven; bedrijfstak, gemeente (81575NED)", "url": O + "81575NED"}
S2 = {"publisher": CBS, "title": "Vestigingen van bedrijven; bedrijfstak, regio (81578NED)", "url": O + "81578NED"}
S3 = {"publisher": CBS, "title": "Bevolking op 1 januari en gemiddeld; geslacht, leeftijd en regio (03759ned)", "url": O + "03759ned"}
S4 = {"publisher": CBS, "title": "Hotels; gasten, overnachtingen, woonland, regio (82061NED)", "url": O + "82061NED"}
sbig = {t["Key"]: t["Title"] for t in json.load(open(D + "sbi.json"))["value"]}
sbi = {t["Key"]: t["Title"] for t in json.load(open(D + "sbi_r.json"))["value"]}
rows = []
G = {"T001081": ("all", None), "389100": (None, "Section I, hotels and restaurants together (horeca)"), "435500": (None, "Section S, other service activities")}
for r in json.load(open(D + "gm.json"))["value"]:
    k = r["BedrijfstakkenBranchesSBI2008"]
    if k.strip() not in G: continue
    trade, extra = G[k.strip()]
    g = r["RegioS"].strip()
    row = {"item": "business_count", "officialClass": "SBI 2008 " + sbig[k].strip(), "geo": {"level": "city", "code": g, "name": GM[g] + " (gemeente)"},
           "value": r["Vestigingen_1"], "unit": "establishments", "year": "2026", "measure": MEAS,
           "note": f"Gemeente {GM[g]}. The municipal table goes no finer than SBI sections." + (f" {extra}." if extra else ""), "source": S1}
    if trade: row["trade"] = trade
    rows.append(row)
C = {"T001081": "all", "390500": None, "390800": "restaurants", "391500": "cafes", "439200": None, "439300": "barbershops", "439400": None}
for r in json.load(open(D + "cr.json"))["value"]:
    k = r["BedrijfstakkenBranchesSBI2008"].strip(); g = r["RegioS"].strip()
    if k not in C or g == "NL01": continue
    v = r["Vestigingen_1"]
    if v is None: continue
    name, city = CR[g]
    row = {"item": "business_count", "officialClass": "SBI 2008 " + sbi[r["BedrijfstakkenBranchesSBI2008"]].strip(), "geo": {"level": "metro", "code": g, "name": name},
           "value": v, "unit": "establishments", "year": "2026", "measure": MEAS,
           "note": f"The COROP area around {city}, wider than the gemeente: the finest level at which the register is published by SBI class.", "source": S2}
    if C[k]: row["trade"] = C[k]
    if k == "439300": row["note"] += " Kappers: hairdressers and barbers, beauty salons apart (96022)."
    rows.append(row)
for f in ("pop.json", "pop2.json"):
    for r in json.load(open(D + f))["value"]:
        g = r["RegioS"].strip()
        if g == "NL01": continue
        name = GM[g] + " (gemeente)" if g in GM else CR[g][0]
        rows.append({"item": "population", "geo": {"level": "city" if g in GM else "metro", "code": g, "name": name}, "value": r["BevolkingOp1Januari_1"],
                     "unit": "persons", "year": "2026", "measure": "population on 1 January 2026", "note": "Same boundary as the establishment rows of this file, same date.", "source": S3})
for r in json.load(open(D + "hot.json"))["value"]:
    g = r["RegioS"].strip(); w = r["WoonlandVanGasten"]
    item = "visitors" if w == "B000069" else "visitors_total"
    who = "guests resident abroad" if w == "B000069" else "all guests, residents of the Netherlands included"
    for unit, val in (("guests", r["Gasten_1"]), ("nights", r["Overnachtingen_2"])):
        rows.append({"item": item, "geo": {"level": "city", "code": g, "name": GM[g] + " (gemeente)"}, "value": val * 1000, "unit": unit,
                     "year": r["Perioden"][:4], "measure": f"{'arrivals' if unit=='guests' else 'nights'} of {who} in hotels, motels, pensions, hotel apartments, youth hostels and B&Bs with at least 5 beds",
                     "note": "Published in thousands (x 1 000), written here multiplied out. Hotel-type accommodation only: holiday parks and campsites are not in the municipal series." + (" A guest counts once per stay." if unit == "guests" else ""),
                     "source": S4})
write("nl-cbs-2026.json", {"id": "eucities-nl-cbs-2026",
    "source": {**S1, "table": "81575NED (gemeente, SBI sections), 81578NED (COROP, SBI classes), 1 January 2026; 03759ned population 1 January 2026; 82061NED hotel guests 2024 and 2025; CBS OData https://opendata.cbs.nl/ODataApi/odata/",
               "licence": LIC},
    "retrieved": RETRIEVED, "rows": rows})
