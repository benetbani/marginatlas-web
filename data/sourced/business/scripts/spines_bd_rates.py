"""Eurostat bd_size: enterprise birth and death rates (per 100 active), divisions I56 and S96 and the business economy."""
import collections, os, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/bd_size?indic_sbs=ENT_BRTHR_PC&indic_sbs=ENT_DTHR_PC"
       "&indic_sbs=ENT_NR&indic_sbs=ENT_BRTH_NR&indic_sbs=ENT_DTH_NR&nace_r2=I56&nace_r2=S96&nace_r2=B-S_X_O_S94"
       "&sizeclas=TOTAL&age=TOTAL&sinceTimePeriod=2021")
path = os.path.join(DL, "bd_rates.json")
urllib.request.urlretrieve(URL, path)
NACE = {"I56": (["restaurants", "cafes"], "NACE Rev. 2 I56: Food and beverage service activities",
                "Division I56 holds restaurants (56.10), bars and cafes (56.30) and catering together: the classes 56.10 and 56.30 are not published."),
        "S96": (["barbershops"], "NACE Rev. 2 S96: Other personal service activities",
                "Division S96 holds hairdressing and beauty (96.02) with laundries, funeral and other personal services: 96.02 is not published."),
        "B-S_X_O_S94": (["all"], "NACE Rev. 2 B-S_X_O_S94: Industry, construction and market services (except public administration and defence; compulsory social security; activities of membership organisations)", None)}
SKIP = {"EU28", "EA19", "EA20"}
v = collections.defaultdict(dict)
for k, val, s, lab in jsonstat(path):
    if k["geo"] in SKIP:
        continue
    v[(k["geo"], k["nace_r2"], k["time"])][k["indic_sbs"]] = (val, s)
    v[(k["geo"], k["nace_r2"], k["time"])]["_name"] = (lab["geo"][k["geo"]], "")
rows = []
for (g, n, t), d in sorted(v.items()):
    trades, cls, note = NACE[n]
    for ind, item, word, cnt in (("ENT_BRTHR_PC", "birth_rate", "births", "ENT_BRTH_NR"), ("ENT_DTHR_PC", "death_rate", "deaths", "ENT_DTH_NR")):
        if ind not in d:
            continue
        val, s = d[ind]
        notes = [note] if note else []
        if cnt in d and "ENT_NR" in d:
            notes.append(f"{d[cnt][0]:,.0f} enterprise {word} of {d['ENT_NR'][0]:,.0f} active enterprises.")
        if word == "deaths":
            notes.append("A death is counted when an enterprise has stayed inactive for two years; recent years are often provisional.")
        fn = flagnote(s)
        if fn:
            notes.append(fn)
        for trade in trades:
            rows.append({"item": item, "trade": trade, "officialClass": cls, "geo": geo_eu(g, d["_name"][0]),
                         "value": val, "unit": "per 100 active enterprises", "year": t,
                         "measure": f"enterprise {word} in {t} divided by active enterprises in {t}, percent",
                         "note": " ".join(notes)})
write("business", "eurostat-bd-rates.json", {
    "id": "eurostat-bd-rates",
    "source": {"publisher": "Eurostat", "title": "Business demography by size class and NACE Rev. 2 activity (bd_size)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/bd_size/default/table",
               "table": "bd_size, indic_sbs ENT_BRTHR_PC and ENT_DTHR_PC (counts ENT_BRTH_NR, ENT_DTH_NR, ENT_NR in the notes), sizeclas TOTAL, reference years 2021 to 2024",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
