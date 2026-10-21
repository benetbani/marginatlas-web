import csv, json, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
DL = "/srv/atlas/runs/data-business/dl/"
NAMES = {"E12000007": "London (Greater London)", "E08000025": "Birmingham", "E06000023": "Bristol", "S12000036": "Edinburgh",
         "S12000049": "Glasgow", "E08000035": "Leeds", "E08000003": "Manchester"}
GEONOTE = {"E12000007": "Greater London, the London region (all 33 boroughs).",
           "S12000036": "City of Edinburgh council area.", "S12000049": "Glasgow City council area.",
           "E06000023": "Bristol, City of (unitary authority).", "E08000025": "Birmingham local authority district.",
           "E08000035": "Leeds local authority district.", "E08000003": "Manchester local authority district."}
TRADE = {"Total": "all", "56101": "restaurants", "56102": "cafes", "96020": "barbershops"}
UNIT = {"NM_141_1": ("local units", "local units (business sites) registered for VAT or PAYE"),
        "NM_142_1": ("enterprises", "enterprises registered for VAT or PAYE")}
rows = []
for ds, (unit, what) in UNIT.items():
    for r in csv.DictReader(open(DL + f"nomis_{ds}.csv")):
        ind = r["INDUSTRY_NAME"]
        code = ind.split(" : ")[0]
        if code != "Total" and len(code) != 5:
            continue
        g = r["GEOGRAPHY_CODE"]
        row = {"item": "business_count", "officialClass": "All industries (Total)" if code == "Total" else f"SIC 2007 subclass {ind}",
               "geo": {"level": "city", "code": g, "name": NAMES[g]}, "value": int(r["OBS_VALUE"]), "unit": unit,
               "year": r["DATE_NAME"], "measure": f"count of {what}, snapshot of March {r['DATE_NAME']}",
               "note": GEONOTE[g] + (" Barbers are not counted apart: the class is hairdressing and other beauty treatment." if code == "96020" else "")
                       + (" Cafes are not counted apart from unlicensed restaurants." if code == "56102" else ""),
               "source": {"publisher": "Office for National Statistics", "title": f"UK Business Counts, {'local units' if ds=='NM_141_1' else 'enterprises'} by industry and employment size band ({ds}), via Nomis",
                          "url": f"https://www.nomisweb.co.uk/datasets/{'idbrlu' if ds=='NM_141_1' else 'idbrent'}"}}
        if code in TRADE:
            row["trade"] = TRADE[code]
        assert r["OBS_STATUS_NAME"] == "Normal Value", r
        rows.append(row)
write("ons-business-counts-2026.json", {
    "id": "ons-business-counts-2026",
    "source": {"publisher": "Office for National Statistics", "title": "UK Business Counts (Inter-Departmental Business Register), via Nomis",
               "url": "https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1",
               "table": "NM_141_1 (local units) and NM_142_1 (enterprises), employment size band Total, legal status Total, date latest (March 2026)",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": rows})
pop = []
for r in csv.DictReader(open(DL + "nomis_pop.csv")):
    g = r["GEOGRAPHY_CODE"]
    pop.append({"item": "population", "geo": {"level": "city", "code": g, "name": NAMES[g]}, "value": int(r["OBS_VALUE"]),
                "unit": "persons", "year": r["DATE_NAME"], "measure": f"usually resident population, mid-year estimate (30 June {r['DATE_NAME']})",
                "note": GEONOTE[g] + " Same boundary as the business counts in ons-business-counts-2026.json.",
                "source": {"publisher": "Office for National Statistics", "title": "Population estimates, local authority based by single year of age (NM_2002_1), via Nomis",
                           "url": "https://www.nomisweb.co.uk/datasets/pestsyoala"}})
json.dump(pop, open("/srv/atlas/runs/data-business/pop_GB.json", "w"), indent=1)
print(len(pop), "pop rows")
