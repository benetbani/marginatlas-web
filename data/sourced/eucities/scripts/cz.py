import json, sys, csv
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/cz/"
CSU = "Český statistický úřad (ČSÚ), Czech Statistical Office"
GEO = {"level": "city", "code": "CZ010", "name": "Hlavní město Praha (Prague, city and region)"}
SRES = {"publisher": CSU, "title": "Registr ekonomických subjektů (RES), open data file res_data.csv, state of 15 October 2026", "url": "https://opendata.czso.cz/data/od_org03/res_data.csv"}
agg = json.load(open(D + "agg.json"))
MEAS = "number of economic subjects in the business register (RES) with their registered seat in Prague and no date of dissolution, by prevailing statistical activity (CZ-NACE), state of 15 October 2026"
BASE = "Seats of legal units and sole traders, not premises. The register keeps subjects with no activity until they are dissolved, so it counts more than the businesses trading."
CL = {"56100": ("restaurants", "CZ-NACE 56.10: Stravování v restauracích, u stánků a v mobilních zařízeních (restaurants, stalls and mobile food service)"),
      "56300": ("cafes", "CZ-NACE 56.30: Pohostinství (beverage serving activities)"),
      "96020": ("barbershops", "CZ-NACE 96.02: Kadeřnictví, holičství, kosmetické a podobné služby (hairdressing, barbering, beauty treatment)")}
nace = dict(agg["nace"])
rows = [{"item": "business_count", "trade": "all", "officialClass": "All activities (whole register)", "geo": GEO, "value": agg["all"], "unit": "registered economic subjects",
         "year": "2026-10", "measure": MEAS, "note": BASE, "source": SRES}]
COARSE = {"56100": ["561", "5610"], "56300": ["563", "5630"], "96020": ["9602"]}
for k, (trade, cls) in CL.items():
    extra = sum(nace.get(c, 0) for c in COARSE[k])
    note = BASE + f" A further {extra} subjects carry only the coarser code ({', '.join(COARSE[k])}) and are not in this count."
    if k == "96020": note += " Hairdressing and beauty together: barbers are not counted apart."
    rows.append({"item": "business_count", "trade": trade, "officialClass": cls, "geo": GEO, "value": nace[k], "unit": "registered economic subjects",
                 "year": "2026-10", "measure": MEAS, "note": note, "source": SRES})
for r in csv.reader(open(D + "obyA.csv", encoding="utf-8")):
    if r[0] == "Počet obyvatel k 1. 1. (počáteční stav)" and r[2] == "Celkem" and r[7] == "CZ010" and r[4] == "2026":
        rows.append({"item": "population", "geo": GEO, "value": int(r[8]), "unit": "persons", "year": "2026", "measure": "population on 1 January 2026",
                     "note": "Prague is one municipality and one region: the boundary of the register rows.",
                     "source": {"publisher": CSU, "title": "Obyvatelstvo - stav a věková struktura, sada OBY02A (počet obyvatel k 1. 1.)", "url": "https://data.csu.gov.cz/opendata/sady/OBY02A/distribuce/csv"}})
SCRU = {"publisher": CSU, "title": "Návštěvnost hromadných ubytovacích zařízení, sada CRU02R (hosté a přenocování podle rezidence)", "url": "https://data.csu.gov.cz/opendata/sady/CRU02R/distribuce/csv"}
for r in csv.reader(open(D + "cru02r.csv", encoding="utf-8")):
    if len(r) < 15 or r[5] != "CZ010" or r[6] or r[12] != "HUZ celkem" or r[10] not in ("2024", "2025"): continue
    if r[0] not in ("Počet hostů", "Počet přenocování") or r[8] not in ("Celkem", "Nerezidenti"): continue
    unit = "guests" if r[0] == "Počet hostů" else "nights"
    item = "visitors" if r[8] == "Nerezidenti" else "visitors_total"
    who = "non-resident guests" if item == "visitors" else "all guests, residents of Czechia included"
    rows.append({"item": item, "geo": GEO, "value": int(r[14]), "unit": unit, "year": r[10],
                 "measure": f"{'arrivals of' if unit=='guests' else 'nights spent by'} {who} in collective accommodation establishments (at least 5 rooms and 10 beds), calendar year",
                 "note": "Collective accommodation (HUZ) only: private flats let to tourists are not in the count." + (" A guest counts once per stay." if unit == "guests" else ""), "source": SCRU})
write("cz-csu-2026.json", {"id": "eucities-cz-csu-2026",
    "source": {**SRES, "table": "res_data.csv (state 2026-10-15), grouped on OKRESLAU CZ0100, DDATZAN empty, NACE (script cz_counts.py); OBY02A population; CRU02R collective accommodation",
               "licence": "ČSÚ open data, free reuse with the source given (https://csu.gov.cz/otevrena-data)"},
    "retrieved": RETRIEVED, "rows": rows})
