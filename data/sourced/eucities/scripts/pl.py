import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/pl/"
GUS = "Główny Urząd Statystyczny (GUS), Statistics Poland"
S2809 = {"publisher": GUS, "title": "Bank Danych Lokalnych: Podmioty wg sekcji i działów PKD 2007 oraz sektorów własnościowych (P2809)", "url": "https://bdl.stat.gov.pl/api/v1/variables?subject-id=P2809"}
S2137 = {"publisher": GUS, "title": "Bank Danych Lokalnych: Ludność wg płci, stan na 31 XII (P2137, variable 72305)", "url": "https://bdl.stat.gov.pl/api/v1/variables/72305"}
S2017 = {"publisher": GUS, "title": "Bank Danych Lokalnych: Turystyczne obiekty noclegowe, korzystający i udzielone noclegi (P2017, variables 40928 and 40905)", "url": "https://bdl.stat.gov.pl/api/v1/variables?subject-id=P2017"}
CITY = {"071412865011": ("1465011", "Warszawa (miasto stołeczne)"), "011212161011": ("1261011", "Kraków (gmina miejska)")}
POW = {"071412865000": "071412865011", "011212161000": "011212161011"}
MEAS = "number of entities of the national economy entered in the REGON register (podmioty gospodarki narodowej), by registered seat, as of 31 December"
VAR = {"152339": ("all", "PKD 2007, all sections (ogółem)", None),
       "152171": (None, "PKD 2007 Sekcja I: Zakwaterowanie i usługi gastronomiczne (accommodation and food service)", None),
       "152165": ("restaurants", "PKD 2007 Sekcja I, dział 56: Działalność usługowa związana z wyżywieniem (food and beverage service activities)", "The whole division 56: restaurants, takeaways, catering and bars together; the register is not published finer at gmina level."),
       "152038": (None, "PKD 2007 Sekcja S dział 96 and Sekcja T działy 97-98 (other personal services with households as employers), published as one line", "Hairdressing (96.02) cannot be separated at gmina level.")}
rows = []
for u, (code, name) in CITY.items():
    d = json.load(open(D + f"u_{u}.json"))
    for r in d["results"]:
        v = r["id"]
        for x in r["values"]:
            if x["year"] != "2025": continue
            if str(v) == "72305":
                rows.append({"item": "population", "geo": {"level": "city", "code": code, "name": name}, "value": x["val"], "unit": "persons", "year": "2025",
                             "measure": "population on 31 December 2025 (actual place of residence, balance method)", "note": "Same gmina and date as the REGON counts of this file.", "source": S2137})
                continue
            trade, cls, extra = VAR[str(v)]
            trades = ["restaurants", "cafes"] if trade == "restaurants" else [trade]
            for t in trades:
                row = {"item": "business_count", "officialClass": cls, "geo": {"level": "city", "code": code, "name": name}, "value": x["val"], "unit": "registered entities",
                       "year": "2025", "measure": MEAS, "note": "Every entity entered in REGON with its seat in the gmina, natural persons running a business included; the register keeps entities that have ceased activity without striking them off, so it counts more than the businesses trading." + (" " + extra if extra else ""), "source": S2809}
                if t: row["trade"] = t
                rows.append(row)
for p, u in POW.items():
    code, name = CITY[u]
    d = json.load(open(D + f"p_{p}.json"))
    for r in d["results"]:
        if str(r["id"]) not in ("40905", "40928"): continue
        for x in r["values"]:
            unit = "nights" if str(r["id"]) == "40905" else "tourists"
            rows.append({"item": "visitors", "geo": {"level": "city", "code": code, "name": name}, "value": x["val"], "unit": unit, "year": x["year"],
                         "measure": ("nights provided to foreign tourists (non-residents)" if unit == "nights" else "foreign tourists (non-residents) accommodated") + " in tourist accommodation establishments with 10 or more bed places, January to December",
                         "note": "The city is its own powiat, the boundary of the gmina." + (" A tourist counts once per stay in each establishment." if unit == "tourists" else ""), "source": S2017})
write("pl-gus-2025.json", {"id": "eucities-pl-gus-2025",
    "source": {"publisher": GUS, "title": "Bank Danych Lokalnych (Local Data Bank): REGON register entities, population, tourist accommodation",
               "url": "https://bdl.stat.gov.pl/", "table": "API https://bdl.stat.gov.pl/api/v1/, variables 152339, 152171, 152165, 152038 (P2809), 72305 (P2137), 40905, 40928 (P2017); units 071412865011 / 071412865000 Warszawa, 011212161011 / 011212161000 Kraków",
               "licence": "GUS public data, reusable with the source given (terms on https://bdl.stat.gov.pl/)"},
    "retrieved": RETRIEVED, "rows": rows})
