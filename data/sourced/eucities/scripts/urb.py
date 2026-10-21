import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
from js import jsonstat
D = "/srv/atlas/runs/data-eucities/dl/"
CAT = {"DE001C": "berlin", "DE004C": "cologne", "DE011C": "dusseldorf", "DE005C": "frankfurt", "DE002C": "hamburg", "DE008C": "leipzig",
       "DE003C": "munich", "DE007C": "stuttgart", "FR001C": "paris", "FR002C": "lyon", "FR004C": "marseille", "FR007C": "nantes",
       "FR008C": "nice", "FR006C": "toulouse", "ES001C": "madrid", "ES002C": "barcelona", "ES004C": "seville", "ES003C": "valencia",
       "CH002C": "zurich", "CH003C": "geneva", "CH004C": "basel", "CH001C": "bern", "NL001C": "amsterdam", "NL037C": "rotterdam",
       "PL001C": "warsaw", "PL003C": "krakow", "PT001C": "lisbon", "PT002C": "porto", "AT001C": "vienna", "BE001C": "brussels",
       "CZ001C": "prague", "SE001C": "stockholm", "DK001C": "copenhagen", "IE001C": "dublin", "EL001C": "athens", "EE001C": "tallinn",
       "LV001C": "riga", "LT001C": "vilnius", "FI001C": "helsinki", "SI001C": "ljubljana", "SK001C": "bratislava", "RO001C": "bucharest",
       "BG001C": "sofia", "HR001C": "zagreb", "MT001C": "valletta", "CY001C": "nicosia", "NO001C": "oslo"}
FLAG = {"e": "estimated", "p": "provisional", "b": "break in time series", "u": "low reliability", "d": "definition differs", "i": "see metadata"}
MIN_YEAR = 2015
IND = {"DE1001V": ("population", "persons", "population on 1 January"),
       "CR2011V": ("visitors", "nights", "nights spent in tourist accommodation establishments by non-residents (nights, not visitors)"),
       "CR2001V": ("visitors_total", "nights", "total nights spent in tourist accommodation establishments, residents and non-residents (nights, not visitors)")}
rows, skipped = [], []
for f, ds in (("urb_cpop1.json", "urb_cpop1"), ("urb_ctour.json", "urb_ctour")):
    obs, lab, upd = jsonstat(D + f)
    for code, slug in CAT.items():
        for ind, (item, unit, meas) in IND.items():
            ys = {o["time"]: (v, s) for o, v, s in obs if o["cities"] == code and o["indic_ur"] == ind}
            if not ys: continue
            y = max(ys)
            v, s = ys[y]
            if int(y) < MIN_YEAR:
                skipped.append(f"{code} {lab['cities'][code]} {ind} latest {y}")
                continue
            name = lab["cities"][code]
            note = f"Urban Audit city {code}, the catalog's {slug}."
            if "greater city" in name or name.startswith("Greater"):
                note += " A greater city: the core municipality with its contiguous urban municipalities, wider than the municipality alone."
            fl = sorted({FLAG[c] for c in s if c in FLAG})
            if fl: note += " Eurostat flags the value: " + ", ".join(fl) + "."
            if item == "visitors": note += " A stay of five nights counts five."
            rows.append({"item": item, "geo": {"level": "city", "code": code, "name": name}, "value": int(v) if float(v).is_integer() else v,
                         "unit": unit, "year": y, "measure": meas, "note": note,
                         "source": {"publisher": "Eurostat", "title": f"Urban Audit, cities ({ds}): {('Population on 1 January by age groups and sex - cities and greater cities' if ds=='urb_cpop1' else 'Culture and tourism - cities and greater cities')}",
                                    "url": f"https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/{ds}?format=JSON&lang=EN"}})
    print(ds, "updated", upd)
write("eurostat-urban-audit.json", {"id": "eucities-eurostat-urban-audit",
    "source": {"publisher": "Eurostat", "title": "Urban Audit city statistics (urb_cpop1 population, urb_ctour tourism)",
               "url": "https://ec.europa.eu/eurostat/web/cities/database",
               "table": "urb_cpop1 indicator DE1001V; urb_ctour indicators CR2011V and CR2001V; latest year per city, 2015 or later; urb_ctour updated 2026-10-16",
               "licence": "Eurostat copyright notice: reuse authorised, source acknowledged (CC BY 4.0), https://ec.europa.eu/eurostat/about-us/policies/copyright"},
    "retrieved": RETRIEVED, "rows": rows})
open("/srv/atlas/runs/data-eucities/urb_skipped.txt", "w").write("\n".join(skipped) + "\n")
