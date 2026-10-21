"""uk3: shop_rent_m2_month for the seven UK catalog cities from the VOA business floorspace tables, March 2026.

Reads Table FS2.2 (retail rateable value per m2, the publisher's own retail RV over retail floorspace) and FS2.1 (the
retail floorspace), the 31 March 2026 column, and writes the yearly figure over 12. Scotland is outside the VOA's lists.
Usage: python3 -I uk3_voa_shop_rent_month.py XLSX OUT_JSON
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import xlsx

URL = "https://assets.publishing.service.gov.uk/media/6ac8f1caf1ba855cc196aa13/NDR_Business_Floorspace_Tables_2026.xlsx"
PAGE = "https://www.gov.uk/government/statistics/non-domestic-rating-business-floorspace-march-2026"
CITIES = [("E12000007", "London", "London (Greater London, the region)"), ("E08000003", "Manchester", None),
          ("E08000025", "Birmingham", None), ("E08000035", "Leeds", None), ("E06000023", "Bristol", None),
          ("K04000001", "England and Wales", None)]
NOTE = ("the retail sector's rateable value over its floorspace in the local authority, as the publisher divides it in Table FS2.2 "
        "(GBP {y} per m2 a year, rounded by the publisher to the whole pound), over 12 for a month; {fs} thousand m2 of rated retail "
        "floorspace (Table FS2.1); rateable value is the law's estimate of the open-market yearly rent at the valuation date of "
        "1 April 2021 (the 2023 rating list), counted at 31 March 2026; all rated retail property, not only shops on high streets; {lvl}")


def main(path, out):
    fs22, fs21 = xlsx.cells(path, "Table_FS2.2"), xlsx.cells(path, "Table_FS2.1")
    col = next(j for j in range(1, 40) if fs22.get((7, j)) == "31 March 2026")
    assert fs21.get((7, col)) == "31 March 2026"
    by = {fs22.get((r, 4)): r for r in range(8, 600) if fs22.get((r, 4))}
    by21 = {fs21.get((r, 4)): r for r in range(8, 600) if fs21.get((r, 4))}
    rows = []
    for code, name, lvl in CITIES:
        y, fs = fs22[(by[code], col)], fs21[(by21[code], col)]
        level = "region" if code == "K04000001" else "city"
        where = ("measured for England and Wales together (the VOA's lists; Scotland and Northern Ireland are outside them)"
                 if code == "K04000001" else
                 "measured for the London region (all 33 boroughs)" if code == "E12000007" else "measured for the local authority")
        rows.append({"item": "shop_rent_m2_month", "geo": {"level": level, "code": code, "name": name}, "value": round(y / 12, 2),
                     "unit": "GBP per m2 per month", "year": "2026",
                     "measure": "retail rateable value per m2 of floorspace, a year, over 12",
                     "note": NOTE.format(y=int(y), fs=f"{int(fs):,}", lvl=where)})
    for code, name in [("S12000036", "Edinburgh"), ("S12000049", "Glasgow")]:
        rows.append({"item": "shop_rent_m2_month", "geo": {"level": "city", "code": code, "name": name}, "value": None,
                     "unit": "GBP per m2 per month", "year": "2026",
                     "measure": "retail rateable value per m2 of floorspace, a year, over 12",
                     "note": ("Scotland publishes no floorspace with its valuation roll: the VOA's lists cover England and Wales only, "
                              "and the Scottish Government's revaluation 2026 statistics (publication and additional tables) give "
                              "rateable values by council and property class without any floor area, so no rent per m2 can be made"),
                     "source": {"publisher": "Scottish Government", "title": "Non-domestic rates revaluation 2026 statistics (publication tables and additional tables)",
                                "url": "https://www.gov.scot/publications/non-domestic-rates-revaluation-2026-statistics/documents/"}})
    d = {"id": "place-uk3-voa-shop-rent-month-2026",
         "source": {"publisher": "Valuation Office Agency",
                    "title": "Non-domestic rating: business floorspace, March 2026 (Table FS2.2 retail sector rateable value per metre squared, Table FS2.1 retail floorspace, by administrative area), published 15 October 2026",
                    "url": URL, "table": "Table_FS2.2 and Table_FS2.1, column '31 March 2026'", "licence": "Open Government Licence v3.0"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in rows: print(r["geo"]["name"], r["value"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
