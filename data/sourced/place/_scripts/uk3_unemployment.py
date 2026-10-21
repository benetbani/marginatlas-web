"""uk3: unemployment_rate for the seven UK catalog cities (ONS model-based estimates, Nomis NM_127_1) and the UK (Annual
Population Survey, Nomis NM_17_5 variable 83, the same twelve months: no model-based figure is made for the country).
Usage: python3 -I uk3_unemployment.py UMB_CSV APS_CSV OUT_JSON
"""
import csv, json, sys

UMB = ("https://www.nomisweb.co.uk/api/v01/dataset/NM_127_1.data.csv?geography=E08000003,E08000025,E08000035,E06000023,"
       "S12000036,S12000049,E12000007,K02000001&date=latest&item=1,2&measures=20100,20701&select=date_name,date_code,"
       "geography_name,geography_code,geography_type,item_name,measures_name,obs_value,obs_status_name")
APS = ("https://www.nomisweb.co.uk/api/v01/dataset/NM_17_5.data.csv?geography=K02000001,E12000007,E08000003&date=latest"
       "&variable=83&measures=20599,21001,21002,21003&select=date_name,geography_name,geography_code,variable_name,"
       "measures_name,obs_value,obs_status_name")
NAMES = {"E12000007": "London", "E08000003": "Manchester", "E08000025": "Birmingham", "E08000035": "Leeds",
         "E06000023": "Bristol", "S12000036": "Edinburgh", "S12000049": "Glasgow"}


def main(umb, aps, out):
    u = {(r["GEOGRAPHY_CODE"], r["ITEM_NAME"], r["MEASURES_NAME"]): r for r in csv.DictReader(open(umb, encoding="utf-8"))}
    a = {(r["GEOGRAPHY_CODE"], r["MEASURES_NAME"]): r for r in csv.DictReader(open(aps, encoding="utf-8"))}
    rows = []
    for code, name in NAMES.items():
        rate = u[(code, "Unemployment rate (model based)", "Value")]
        ci = u[(code, "Unemployment rate (model based)", "Confidence")]["OBS_VALUE"]
        cnt = int(float(u[(code, "Unemployment count (model based)", "Value")]["OBS_VALUE"]))
        assert rate["OBS_STATUS_NAME"] == "Normal Value"
        lvl = ("measured for the London region (Greater London); for a region the model-based figure is the survey's own "
               "direct estimate" if code == "E12000007" else "measured for the local authority")
        rows.append({"item": "unemployment_rate", "geo": {"level": "city", "code": code, "name": name},
                     "value": float(rate["OBS_VALUE"]), "unit": "% of the economically active", "year": "2025-04/2026-03",
                     "measure": "unemployment rate, aged 16 and over, model-based estimate for the local authority",
                     "note": (f"the twelve months April 2025 to March 2026 ({rate['DATE_NAME']}), the newest period published; "
                              f"{cnt:,} people unemployed; 95% confidence interval plus or minus {ci} points; the model joins the "
                              f"Annual Population Survey with the claimant count to steady small samples; {lvl}")})
    v, n, d_, ci = (a[("K02000001", m)] for m in ("Variable", "Numerator", "Denominator", "Confidence"))
    rows.append({"item": "unemployment_rate", "geo": {"level": "country", "code": "GB", "name": "United Kingdom"},
                 "value": float(v["OBS_VALUE"]), "unit": "% of the economically active", "year": "2025-04/2026-03",
                 "measure": "unemployment rate, aged 16 and over, Annual Population Survey",
                 "note": (f"the twelve months April 2025 to March 2026 ({v['DATE_NAME']}), the same period as the cities; "
                          f"{int(float(n['OBS_VALUE'])):,} unemployed of {int(float(d_['OBS_VALUE'])):,} economically active; "
                          f"95% confidence interval plus or minus {ci['OBS_VALUE']} points; no model-based figure is made for the "
                          f"country, whose survey sample needs none; the monthly headline rate from the Labour Force Survey is a "
                          f"different, three-month measure; measured for the country"),
                 "source": {"publisher": "Office for National Statistics",
                            "title": "Annual Population Survey, unemployment rate aged 16+ (variable 83), via Nomis dataset NM_17_5",
                            "url": APS}})
    d = {"id": "place-uk3-unemployment-2026",
         "source": {"publisher": "Office for National Statistics",
                    "title": "Model-based estimates of unemployment for local authorities, April 2025 to March 2026, via Nomis dataset NM_127_1",
                    "url": UMB, "table": "NM_127_1: item 2 unemployment rate (model based), item 1 count, measures value and confidence",
                    "licence": "Open Government Licence v3.0"},
         "retrieved": "2026-10-20", "rows": rows}
    with open(out, "w", encoding="utf-8") as f:
        json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
    for r in rows: print(r["geo"]["name"], r["value"])


if __name__ == "__main__":
    main(*sys.argv[1:4])
