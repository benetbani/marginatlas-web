import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/pt/"
INE = "Instituto Nacional de Estatística (INE), Statistics Portugal"
def S(c, title): return {"publisher": INE, "title": f"{title} (indicator {c})", "url": f"https://www.ine.pt/xurl/indx/{c}/EN"}
S8511 = S("0008511", "Enterprises (No.) by Geographic localization (NUTS - 2013), Economic activity (Division - CAE Rev. 3) and Legal form; Annual, Integrated business accounts system")
S13838 = S("0013838", "Enterprises (No.) by Geographic localization (NUTS - 2024) and Economic activity (Subclass - CAE Rev. 3); Annual, Integrated business accounts system")
S8273 = S("0008273", "Resident population (No.) by Place of residence (NUTS - 2013), Sex and Age group; Annual estimates of resident population")
p1 = json.load(open(D + "pulls.json")); p2 = json.load(open(D + "pulls2.json")); p3 = json.load(open(D + "pulls3.json"))
CITY = {"1701106": {"level": "city", "code": "1106", "name": "Lisboa (município)"}, "11A1312": {"level": "city", "code": "1312", "name": "Porto (município)"}}
METRO = {"1A0": {"level": "metro", "code": "PT1A0", "name": "Grande Lisboa (NUTS III, 2024)"}, "11A": {"level": "metro", "code": "PT11A", "name": "Área Metropolitana do Porto (NUTS III)"}}
SCOPE = "Enterprises of CAE sections A to S, financial and insurance (K) and public administration (O) left out, sole traders included, located by their registered seat."
rows = []
def one(v): return v[0]["Dados"][y][0] if (v and (y := list(v[0]["Dados"])[0])) else None
for g in CITY:
    for a, trade, cls, extra in (("TOT", "all", "CAE Rev. 3, all sections A to S except K and O (Total)", ""),
                                 ("56", "restaurants", "CAE Rev. 3 division 56: Food and beverage service activities", " The whole division 56: restaurants, cafés and bars together; the municipal table stops at divisions."),
                                 ("96", None, "CAE Rev. 3 division 96: Other personal service activities", " Hairdressing (96.021) cannot be separated at municipal level.")):
        v = p1.get(f"8511_{g}_{a}") or p2.get(f"8511_{g}_{a}")
        if not v: v = json.load(open(D + f"d8511_{g}_{a}.json"))
        r = one(v)
        for t in (["restaurants", "cafes"] if trade == "restaurants" else [trade]):
            row = {"item": "business_count", "officialClass": cls, "geo": CITY[g], "value": int(r["valor"]), "unit": "enterprises", "year": "2022",
                   "measure": "number of enterprises in the integrated business accounts system (SCIE), legal form total", "note": SCOPE + extra, "source": S8511}
            if t: row["trade"] = t
            rows.append(row)
    r = one(p3[g])
    rows.append({"item": "population", "geo": CITY[g], "value": int(r["valor"]), "unit": "persons", "year": "2022", "measure": "annual estimate of the resident population, 2022",
                 "note": "Same municipality and year as the enterprise rows of this file.", "source": S8273})
for g in METRO:
    for a, trade, cls in (("TOT", "all", "CAE Rev. 3 Total"), ("56101", "restaurants", "CAE Rev. 3 subclass 56101: Traditional restaurants"),
                          ("56301", "cafes", "CAE Rev. 3 subclass 56301: Cafés"), ("96021", "barbershops", "CAE Rev. 3 subclass 96021: Hairdressing")):
        r = one(p1[f"13838_{g}_{a}"])
        rows.append({"item": "business_count", "trade": trade, "officialClass": cls, "geo": METRO[g], "value": int(r["valor"]), "unit": "enterprises", "year": "2024",
                     "measure": "number of enterprises in the integrated business accounts system (SCIE)",
                     "note": SCOPE + " The NUTS III region around the city, the finest level published by subclass." + (" Hairdressing, barbers included." if a == "96021" else ""),
                     "source": S13838})
write("pt-ine.json", {"id": "eucities-pt-ine",
    "source": {"publisher": INE, "title": "Statistics Portugal database: enterprises (SCIE) by municipality and NUTS III; resident population estimates", "url": "https://www.ine.pt/",
               "table": "JSON API https://www.ine.pt/ine/json_indicador/pindica.jsp, indicators 0008511 (2022, municipalities 1701106 Lisboa, 11A1312 Porto), 0013838 (2024, NUTS III 1A0 and 11A), 0008273 (2022)",
               "licence": "Statistics Portugal terms: reuse permitted with the source cited (https://www.ine.pt)"},
    "retrieved": RETRIEVED, "rows": rows})
