"""uk5: the nine tenths of full-time gross annual pay (10th to 90th percentile, the median as the 50th) for London and the UK,
ASHE table 8 (place of residence) via Nomis NM_30_1, so a page can draw deciles, not quartiles (ruling 2026-07, FOUNDER-VERDICTS 781).

The publisher's own percentiles, a year and over 12 a month. Usage: python3 -I uk5_ashe_residence_deciles.py CSV OUT_JSON
The CSV is the URL below, saved as it came.
"""
import csv
import json
import sys

URL = ("https://www.nomisweb.co.uk/api/v01/dataset/NM_30_1.data.csv?geography=E12000007,K02000001&date=latest&sex=8"
       "&item=6,7,9,10,2,11,12,14,15&pay=7&measures=20100,20701&select=date_name,geography_name,geography_code,sex_name,"
       "item_name,pay_name,measures_name,obs_value,obs_status_name")
NAMES = {"E12000007": ("Greater London", "city", "E12000007", "the London region"),
         "K02000001": ("United Kingdom", "country", "GB", "the UK")}
ITEMS = [("10 percentile", 10), ("20 percentile", 20), ("30 percentile", 30), ("40 percentile", 40), ("Median", 50),
         ("60 percentile", 60), ("70 percentile", 70), ("80 percentile", 80), ("90 percentile", 90)]


def main(path, out):
    v = {}
    for r in csv.DictReader(open(path, encoding="utf-8")):
        v[(r["GEOGRAPHY_CODE"], r["ITEM_NAME"], r["MEASURES_NAME"])] = (r["OBS_VALUE"], r["DATE_NAME"], r["OBS_STATUS_NAME"])
    rows = []
    for code, (name, level, geo, where) in NAMES.items():
        for item, pct in ITEMS:
            a, year, st = v[(code, item, "Value")]
            ci = v[(code, item, "Confidence")][0]
            assert st == "Normal Value", (code, item, st)
            a = float(a)
            what = "median" if pct == 50 else f"{pct}th percentile"
            rows.append({"item": "pay_tenth", "geo": {"level": level, "code": geo, "name": name}, "percentile": pct,
                         "value": round(a), "value_month": round(a / 12), "unit": "GBP per year", "year": year,
                         "measure": f"{what} of gross annual pay, full-time employees, by place of residence",
                         "note": (f"employees who live in {where}, wherever they work (ASHE table 8, the place of residence "
                                  f"analysis); value_month is the year over 12, rounded to the pound; {year} figures are "
                                  f"provisional; coefficient of variation {ci}%")})
    d = {"id": "place-uk5-ashe-residence-deciles-2025",
         "source": {"publisher": "Office for National Statistics",
                    "title": "Annual Survey of Hours and Earnings 2025 (provisional), resident analysis (ASHE table 8), via Nomis dataset NM_30_1",
                    "url": URL, "table": "NM_30_1: sex 8 full-time workers, pay 7 annual pay gross, items 6, 7, 9, 10, 2, 11, 12, 14, 15 (the 10th to the 90th percentile)",
                    "licence": "Open Government Licence v3.0"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write("\n")
    for r in rows:
        print(r["geo"]["name"], r["percentile"], r["value"], r["value_month"], r["year"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
