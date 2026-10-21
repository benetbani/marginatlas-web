import json, sys
sys.path.insert(0, "/srv/atlas/runs/data-eucities/scripts")
from lib import *
D = "/srv/atlas/runs/data-eucities/dl/fi/"
SF = "Statistics Finland (Tilastokeskus)"
def S(p, title): return {"publisher": SF, "title": title, "url": f"https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/StatFin__{p.split('/')[0]}/statfin_{p.split('/')[0]}_pxt_{p.split('/')[1]}/"}
HEL = {"level": "city", "code": "091", "name": "Helsinki (municipality)"}
UUS = {"level": "region", "code": "FI-MK01", "name": "Uusimaa (region)"}
MEAS = "number of establishments of enterprises (statistics on establishments of enterprises), 2024"
NOTE = "Enterprise establishments; general government establishments are counted in a separate statistic and are not here."
rows = []
v = json.load(open(D + "d13wz.json"))["value"][0]
rows.append({"item": "business_count", "trade": "all", "officialClass": "TOL 2008, all industries", "geo": HEL, "value": v, "unit": "establishments", "year": "2024", "measure": MEAS,
             "note": NOTE + " The municipal table gives no industry split.", "source": S("alyr/13wz.px", "13wz -- Establishments of enterprises by municipality, 2018-2024")})
d = json.load(open(D + "d13ww.json")); labs = list(d["dimension"]["toimiala_79_20180101"]["category"]["label"].values())
for lab, val in zip(labs, d["value"]):
    if val is None: continue
    code = lab.split(" ")[0]
    trade = {"Total": "all", "56": "restaurants"}.get(code)
    for t in (["restaurants", "cafes"] if trade == "restaurants" else [trade]):
        r = {"item": "business_count", "officialClass": "TOL 2008 " + ("all industries" if code == "Total" else lab), "geo": UUS, "value": val, "unit": "establishments", "year": "2024", "measure": MEAS,
             "note": NOTE + " The region holding Helsinki, wider than the city." + (" The whole division 56: restaurants, cafés and bars together; the classes are not published for the region." if code == "56" else "") + (" Hairdressing (96.02) is not published for the region." if code == "96" else ""),
             "source": S("alyr/13ww.px", "13ww -- Establishments of enterprises by industry and region, 2018-2024")}
        if t: r["trade"] = t
        rows.append(r)
d = json.load(open(D + "d11ra.json")); geos = list(d["dimension"]["alue_23_20260101"]["category"]["index"])
for g, val in zip(geos, d["value"]):
    rows.append({"item": "population", "geo": HEL if g == "KU091" else UUS, "value": val, "unit": "persons", "year": "2024", "measure": "population on 31 December 2024",
                 "note": "Same boundary and year as the establishment rows.", "source": S("vaerak/11ra.px", "11ra -- Key figures on population by region, 1990-2025")})
d = json.load(open(D + "d11sl.json")); v = d["value"]
for i, (item, who) in enumerate((("visitors_total", "all guests"), ("visitors", "guests resident abroad"))):
    for j, y in enumerate(("2024", "2025")):
        rows.append({"item": item, "geo": HEL, "value": v[i * 2 + j], "unit": "nights", "year": y, "measure": f"nights spent by {who} in hotels, calendar year {y}",
                     "note": "Hotel nights only (the municipal yearly hotel table); other accommodation types are not in it.",
                     "source": S("matk/11sl.px", "11sl -- Yearly hotel capacity and nights spent by municipality, 1995-2026")})
write("fi-statfin-2024.json", {"id": "eucities-fi-statfin-2024",
    "source": {"publisher": SF, "title": "StatFin database: establishments of enterprises; population; accommodation", "url": "https://pxdata.stat.fi/PxWeb/pxweb/en/StatFin/",
               "table": "PxWeb API https://pxdata.stat.fi/PXWeb/api/v1/en/StatFin/, tables 13wz and 13ww (2024, updated 2025-12-19), 11ra (2024), 11sl (2024-2025)",
               "licence": "Creative Commons Attribution 4.0 (Statistics Finland)"},
    "retrieved": RETRIEVED, "rows": rows})
