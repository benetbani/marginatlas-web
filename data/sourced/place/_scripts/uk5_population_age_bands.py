"""uk5: residents by five age groups (0 to 14, 15 to 24, 25 to 44, 45 to 64, 65 and over) for London (the ONS London region) and
the United Kingdom, mid-2025, summed from the ONS five-year bands (Nomis NM_2002_1, the dataset behind populations-age.json). The
85 and over band is all ages less the bands to 84, as the publisher's own total gives it.
Usage: python3 -I uk5_population_age_bands.py NOMIS_CSV OUT_JSON
"""
import csv, json, sys

URL = ("https://www.nomisweb.co.uk/api/v01/dataset/NM_2002_1.data.csv?geography=E12000007,K02000001&date=latest&gender=0"
       "&c_age=200,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19&measures=20100"
       "&select=date_name,geography_name,geography_code,c_age,c_age_name,obs_value")
SRC = {"publisher": "Office for National Statistics",
       "title": "Population estimates: local authority based by five year age band (mid-year estimates), via Nomis dataset NM_2002_1",
       "url": URL, "table": "NM_2002_1", "licence": "Open Government Licence v3.0",
       "sha256": "981124c3d1de108d1626de38d3b3dac5c71987a327095af6b7ece98c7c8282e7"}
GROUPS = [("0 to 14", [1, 3, 4]), ("15 to 24", [5, 6]), ("25 to 44", [7, 8, 9, 10]), ("45 to 64", [11, 12, 13, 14]),
          ("65 and over", None)]
GEO = {"E12000007": ("city", "London", "Greater London, the ONS London region"), "K02000001": ("country", "United Kingdom", None)}


def main(path, out):
    by = {}
    for r in csv.DictReader(open(path, encoding="utf-8")):
        by.setdefault(r["GEOGRAPHY_CODE"], {})[int(r["C_AGE"])] = int(r["OBS_VALUE"])
        year = r["DATE_NAME"]
    rows = []
    for code, (level, name, area) in GEO.items():
        v = by[code]
        total = v[200]
        counted = 0
        for label, ages in GROUPS:
            n = sum(v[a] for a in ages) if ages else total - counted
            counted += n if ages else 0
            parts = ("ONS five-year bands " + ", ".join(str(a) for a in ages)) if ages else \
                "all ages less the groups to 64 (the bands 65 to 69 and over, 85 and over included)"
            rows.append({"item": "age_group_share", "geo": {"level": level, "code": code, "name": name},
                         "value": round(100 * n / total, 1), "unit": "percent", "year": year,
                         "measure": f"share of residents aged {label}",
                         "note": f"computed from the published counts: {n:,} of {total:,} ({parts}); usual residents at mid-year"
                                 + (f"; {area}" if area else ""), "source": SRC})
        assert abs(sum(x["value"] for x in rows if x["geo"]["code"] == code) - 100) < 0.25
    json.dump({"id": "place-uk5-population-age-bands-2025", "source": SRC, "retrieved": "2026-10-21", "rows": rows},
              open(out, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    for x in rows: print(x["geo"]["name"], x["measure"], x["value"])


if __name__ == "__main__":
    main(*sys.argv[1:3])
