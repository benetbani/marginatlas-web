import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/no/"
SSB = "Statistisk sentralbyrå (SSB), Statistics Norway"
GEO = {"level": "city", "code": "0301", "name": "Oslo (kommune and fylke)"}
S1 = {"publisher": SSB, "title": "07091: Establishments, by region, industry (SIC2007), number of employees, contents and year", "url": "https://www.ssb.no/en/statbank/table/07091"}
S2 = {"publisher": SSB, "title": "07459: Population, by region, sex, age, contents and year", "url": "https://www.ssb.no/en/statbank/table/07459"}
d = json.load(open(D + "d07091.json")); v = d["value"]
MEAS = "number of establishments (bedrifter) in the Central Register of Establishments and Enterprises, 1 January 2026"
CL = [("01-99", "SIC2007 all industries (Total)", "all", ""),
      ("56", "SIC2007 division 56: Food and beverage service activities", "restaurants", " The whole division 56: restaurants, takeaways, catering and bars together; the municipal table stops at divisions."),
      ("96", "SIC2007 division 96: Other personal service activities", None, " Hairdressing (96.02) cannot be separated at municipal level.")]
rows = []
for i, (code, cls, trade, extra) in enumerate(CL):
    allv, none = v[2 * i], v[2 * i + 1]
    trades = ["restaurants", "cafes"] if trade == "restaurants" else [trade]
    for t in trades:
        r = {"item": "business_count", "officialClass": cls, "geo": GEO, "value": allv, "unit": "establishments", "year": "2026", "measure": MEAS,
             "note": f"All size groups; {none} of them employ no one." + extra, "source": S1}
        if t: r["trade"] = t
        rows.append(r)
p = json.load(open(D + "d07459.json"))["value"][0]
rows.append({"item": "population", "geo": GEO, "value": p, "unit": "persons", "year": "2026", "measure": "population on 1 January 2026",
             "note": "Oslo is one municipality and one county: the boundary of the establishment rows, the same date.", "source": S2})
write("no-ssb-2026.json", {"id": "eucities-no-ssb-2026",
    "source": {"publisher": SSB, "title": "StatBank Norway: establishments by region and industry; population", "url": "https://www.ssb.no/en/statbank",
               "table": "PxWeb API https://data.ssb.no/api/v0/en/table/, tables 07091 (2026, updated 2026-01-12) and 07459 (2026)",
               "licence": "SSB open data, CC BY 4.0 (source to be given)"},
    "retrieved": RETRIEVED, "rows": rows})
