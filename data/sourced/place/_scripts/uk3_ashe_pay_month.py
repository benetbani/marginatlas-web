"""uk3: pay_median_month for the seven UK catalog cities and the UK, ASHE table 8 (place of residence) via Nomis NM_30_1.

The publisher's median gross annual pay of full-time employees, over 12. Usage: python3 -I uk3_ashe_pay_month.py CSV OUT_JSON
"""
import csv, json, sys

URL = ("https://www.nomisweb.co.uk/api/v01/dataset/NM_30_1.data.csv?geography=E12000007,E08000003,E08000025,E08000035,"
       "E06000023,S12000036,S12000049,K02000001&date=latest&sex=8&item=2&pay=7,1&measures=20100,20701&select=date_name,"
       "geography_name,geography_code,sex_name,item_name,pay_name,measures_name,obs_value,obs_status_name")
NAMES = {"E12000007": ("London", "city", "the London region (Greater London)"), "E08000003": ("Manchester", "city", None),
         "E08000025": ("Birmingham", "city", None), "E08000035": ("Leeds", "city", None), "E06000023": ("Bristol", "city", None),
         "S12000036": ("Edinburgh", "city", None), "S12000049": ("Glasgow", "city", None),
         "K02000001": ("United Kingdom", "country", None)}


def main(path, out):
    v = {}
    for r in csv.DictReader(open(path, encoding="utf-8")):
        v[(r["GEOGRAPHY_CODE"], r["PAY_NAME"], r["MEASURES_NAME"])] = (float(r["OBS_VALUE"]), r["DATE_NAME"], r["OBS_STATUS_NAME"])
    rows = []
    for code, (name, level, region) in NAMES.items():
        a, year, st = v[(code, "Annual pay - gross", "Value")]
        ci = v[(code, "Annual pay - gross", "Confidence")][0]
        wk = v[(code, "Weekly pay - gross", "Value")][0]
        assert st == "Normal Value", (code, st)
        where = ("measured for the country" if level == "country" else
                 "measured for " + region if region else "measured for the local authority")
        rows.append({"item": "pay_median_month", "geo": {"level": level, "code": "GB" if code == "K02000001" else code, "name": name},
                     "value": round(a / 12), "unit": "GBP per month", "year": year,
                     "measure": "median gross annual pay of full-time employees by place of residence, over 12",
                     "note": (f"the publisher's median gross annual pay, GBP {int(a):,} a year, over 12 (rounded to the pound); employees "
                              f"who live in {name if level == 'city' else 'the UK'}, wherever they work (ASHE table 8, the place of "
                              f"residence analysis); annual pay counts employees in the same job for at least a year; the weekly "
                              f"median is GBP {wk:,} (not used); {where}; {year} figures are provisional; coefficient of "
                              f"variation {ci}%")})
    d = {"id": "place-uk3-ashe-pay-month-2025",
         "source": {"publisher": "Office for National Statistics",
                    "title": "Annual Survey of Hours and Earnings 2025 (provisional), resident analysis (ASHE table 8, place of residence by local authority), via Nomis dataset NM_30_1",
                    "url": URL, "table": "NM_30_1: sex 8 full-time workers, item 2 median, pay 7 annual pay gross (pay 1 weekly read beside it)",
                    "licence": "Open Government Licence v3.0"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in rows: print(r["geo"]["name"], r["value"], r["year"])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
