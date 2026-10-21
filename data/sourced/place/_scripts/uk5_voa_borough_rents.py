"""uk5: shop_rent_m2_month for London's 33 boroughs (and Inner and Outer London) from the VOA business floorspace tables, March 2026.

The same table, column and arithmetic as uk3_voa_shop_rent_month.py, which gives London's own £22.42: Table FS2.2 (retail rateable
value per m2, the publisher's own retail RV over retail floorspace) and FS2.1 (the retail floorspace), the 31 March 2026 column,
the yearly figure over 12. Inner and Outer London are the publisher's own groups in the table (its rows between the region and
the boroughs). Usage: python3 -I uk5_voa_borough_rents.py XLSX OUT_JSON
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import xlsx

URL = "https://assets.publishing.service.gov.uk/media/6ac8f1caf1ba855cc196aa13/NDR_Business_Floorspace_Tables_2026.xlsx"
NOTE = ("the retail sector's rateable value over its floorspace in the borough, as the publisher divides it in Table FS2.2 "
        "(GBP {y} per m2 a year, rounded by the publisher to the whole pound), over 12 for a month; {fs} thousand m2 of rated retail "
        "floorspace (Table FS2.1); rateable value is the law's estimate of the open-market yearly rent at the valuation date of "
        "1 April 2021 (the 2023 rating list), counted at 31 March 2026; all rated retail property, not only shops on high streets; "
        "{group}")


def main(path, out):
    fs22, fs21 = xlsx.cells(path, "Table_FS2.2"), xlsx.cells(path, "Table_FS2.1")
    col = next(j for j in range(1, 40) if fs22.get((7, j)) == "31 March 2026")
    assert fs21.get((7, col)) == "31 March 2026"
    by21 = {fs21.get((r, 4)): r for r in range(8, 600) if fs21.get((r, 4))}
    rows, group = [], None
    for r in range(8, 600):
        code, name = fs22.get((r, 4)), fs22.get((r, 5))
        if not isinstance(code, str):
            continue
        if code == "E13000001":
            group = "inner"
        elif code == "E13000002":
            group = "outer"
        elif not code.startswith(("E09", "E12000007")):
            if group and code.startswith("E1"):
                group = None
            continue
        y, fs = fs22[(r, col)], fs21[(by21[code], col)]
        level = ("region" if code == "E12000007" else "group" if code.startswith("E13") else "district")
        where = ("measured for the London region (all 33 boroughs)" if code == "E12000007" else
                 f"the publisher's group {name}" if code.startswith("E13") else
                 f"a London borough, in the publisher's group {'Inner' if group == 'inner' else 'Outer'} London")
        rows.append({"item": "shop_rent_m2_month", "geo": {"level": level, "code": code, "name": name,
                                                           **({"group": group} if level == "district" else {})},
                     "value": round(float(y) / 12, 2), "unit": "GBP per m2 per month", "year": "2026",
                     "measure": "retail rateable value per m2 of floorspace, a year, over 12",
                     "note": NOTE.format(y=int(y), fs=f"{int(fs):,}", group=where)})
    boroughs = [x for x in rows if x["geo"]["level"] == "district"]
    assert len(boroughs) == 33, len(boroughs)
    assert sum(1 for x in boroughs if x["geo"]["group"] == "inner") == 14
    d = {"id": "place-uk5-voa-borough-rents-2026",
         "source": {"publisher": "Valuation Office Agency",
                    "title": "Non-domestic rating: business floorspace, March 2026 (Table FS2.2 retail sector rateable value per metre squared, Table FS2.1 retail floorspace, by administrative area), published 15 October 2026",
                    "url": URL, "table": "Table_FS2.2 and Table_FS2.1, column '31 March 2026'", "licence": "Open Government Licence v3.0",
                    "sha256": "ccec956c76c464e2dd249041bdad8c6f7076536e7592d46a937fe2832cc90d6b"},
         "retrieved": "2026-10-21", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for x in rows: print(x["geo"]["level"], x["geo"].get("group", ""), x["geo"]["name"], x["value"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
