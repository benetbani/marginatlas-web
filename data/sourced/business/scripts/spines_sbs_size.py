"""Eurostat sbs_sc_ovw: turnover share and turnover per enterprise by size class (persons employed), latest year published."""
import collections, os, urllib.request
from spines_lib import DL, RETRIEVED, jsonstat, geo_eu, flagnote, write

URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw?indic_sbs=ENT_NR&indic_sbs=NETTUR_MEUR"
       "&nace_r2=I561&nace_r2=I563&nace_r2=S960&nace_r2=B-S_X_O_S94&sinceTimePeriod=2022")
path = os.path.join(DL, "sbs_sc.json")
urllib.request.urlretrieve(URL, path)
NACE = {"I561": ("restaurants", "NACE Rev. 2 I56.1: Restaurants and mobile food service activities", None),
        "I563": ("cafes", "NACE Rev. 2 I56.3: Beverage serving activities",
                 "Group 56.3 is bars and cafes together (the Italian bar is the cafe); in the UK it is pubs and bars."),
        "S960": ("barbershops", "NACE Rev. 2 S96.0: Other personal service activities",
                 "Group 96.0 holds hairdressing and beauty (96.02) with laundries, funeral and other personal services; 96.02 is not published by size."),
        "B-S_X_O_S94": ("all", "NACE Rev. 2 B-S_X_O_S94: Industry, construction and market services (except public administration and defence; compulsory social security; activities of membership organisations)", None)}
SIZES = [("0-9", "0 to 9 persons employed"), ("10-19", "10 to 19 persons employed"), ("20-49", "20 to 49 persons employed"),
         ("50-249", "50 to 249 persons employed"), ("GE250", "250 persons employed or more")]
SKIP = {"EU28", "EA19", "EA20"}
v = collections.defaultdict(dict)
names = {}
for k, val, s, lab in jsonstat(path):
    if k["geo"] in SKIP:
        continue
    names[k["geo"]] = lab["geo"][k["geo"]]
    v[(k["geo"], k["nace_r2"], k["time"])][(k["indic_sbs"], k["size_emp"])] = (val, s)
latest = {}
for (g, n, t), d in v.items():
    if d.get(("NETTUR_MEUR", "TOTAL"), (0,))[0] and t > latest.get((g, n), ""):
        latest[(g, n)] = t
rows = []
for (g, n), t in sorted(latest.items()):
    d = v[(g, n, t)]
    trade, cls, cnote = NACE[n]
    tot, tot_s = d[("NETTUR_MEUR", "TOTAL")]
    missing = [w for c, w in SIZES if ("NETTUR_MEUR", c) not in d]
    for c, words in SIZES:
        if ("NETTUR_MEUR", c) not in d:
            continue
        tur, s = d[("NETTUR_MEUR", c)]
        base = [cnote] if cnote else []
        if missing:
            base.append("Not published for this class set (confidential or not collected): " + "; ".join(missing) + ".")
        fn = flagnote(s, tot_s)
        if fn:
            base.append(fn)
        rows.append({"item": "turnover_share_by_size", "trade": trade, "officialClass": cls, "geo": geo_eu(g, names[g]),
                     "value": round(100 * tur / tot, 1), "unit": "percent of the trade's net turnover", "year": t,
                     "measure": f"share of net turnover made by enterprises with {words}",
                     "note": " ".join(base + [f"Derived: EUR {tur:,.2f} million of EUR {tot:,.2f} million net turnover."])})
        if ("ENT_NR", c) in d and d[("ENT_NR", c)][0]:
            ent, es = d[("ENT_NR", c)]
            fn2 = flagnote(s, es)
            rows.append({"item": "sales_per_business_by_size", "trade": trade, "officialClass": cls, "geo": geo_eu(g, names[g]),
                         "value": round(tur * 1e6 / ent), "unit": "EUR per enterprise", "year": t,
                         "measure": f"mean net turnover per enterprise, enterprises with {words}",
                         "note": " ".join(([cnote] if cnote else []) + ([fn2] if fn2 else []) +
                                          [f"Derived: EUR {tur:,.2f} million net turnover over {ent:,.0f} enterprises."])})
write("business", "eurostat-sbs-size.json", {
    "id": "eurostat-sbs-size",
    "source": {"publisher": "Eurostat", "title": "Enterprise statistics by size class and NACE Rev. 2 activity (sbs_sc_ovw)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/sbs_sc_ovw/default/table",
               "table": "sbs_sc_ovw, indic_sbs NETTUR_MEUR and ENT_NR, size_emp 0-9, 10-19, 20-49, 50-249, GE250 and TOTAL; the latest reference year each country publishes (2022 to 2024)",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
print(collections.Counter(t for t in latest.values()))
