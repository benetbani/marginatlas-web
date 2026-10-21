"""ONS Business demography, UK: 2024, Tables 1.1d (births of new enterprises, 2024) and 3.1d (active enterprises, 2024) by local
authority: the birth rate of six UK catalog cities, births over active (London's region row is in
data/sourced/business/ons-bd-rates-2024.json, worked the same way). Usage: python3 uk_business_births_la.py <bd.xlsx> <out.json>"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import xlsx

SRC = {"publisher": "Office for National Statistics", "title": "Business demography, UK: 2024 (reference tables)",
       "url": "https://www.ons.gov.uk/file?uri=/businessindustryandtrade/business/activitysizeandlocation/datasets/"
              "businessdemographyreferencetable/current/businessdemographyexceltables2024.xlsx",
       "table": "Tables 1.1d (births of new enterprises, 2024) and 3.1d (active enterprises, 2024), by district, county and "
                "unitary authority",
       "licence": "Open Government Licence v3.0"}
LAS = [("E08000003", "Manchester"), ("E08000025", "Birmingham"), ("E08000035", "Leeds"), ("E06000023", "Bristol"),
       ("S12000036", "City of Edinburgh"), ("S12000049", "Glasgow City")]

def col(f, sheet):
    c = xlsx.cells(f, sheet)
    assert c[(4, 3)] == 2024.0 and "2024" in c[(1, 1)], sheet
    return {c[(r, 1)]: (c[(r, 2)], int(c[(r, 3)])) for (r, k) in c if k == 1 and isinstance(c.get((r, 3)), float)}

def main(src, out):
    births, active = col(src, "Table 1.1d"), col(src, "Table 3.1d")
    rows = []
    for code, name in LAS:
        b, a = births[code][1], active[code][1]
        rows.append({"item": "birth_rate", "trade": "all", "officialClass": "SIC 2007 all industries",
                     "geo": {"level": "city", "code": code, "name": name}, "value": round(100 * b / a, 2),
                     "unit": "per 100 active enterprises", "year": "2024",
                     "measure": "enterprise births in 2024 divided by active enterprises in 2024, percent",
                     "note": f"the local authority ({births[code][0]}); no industry detail is published for a local authority. "
                             f"Worked as one count over the other from the release's own counts: {b:,} enterprise births of "
                             f"{a:,} active enterprises (both control rounded to base 5; Tables 1.1d and 3.1d).",
                     "source": SRC})
    json.dump({"id": "place-uk-business-births-la-2024", "source": SRC, "retrieved": "2026-10-20", "rows": rows},
              open(out, "w"), indent=1, ensure_ascii=False)
    for x in rows: print(x["geo"]["name"], x["value"], x["note"][-120:])

if __name__ == "__main__":
    main(*sys.argv[1:])
