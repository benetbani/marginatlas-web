"""Size classes for London and Los Angeles (data note 14, 2026-10-18): the share of a trade's local units (London) or employer
establishments (Los Angeles County) in each employment size class, each a published count over the published total of the same
table, so the trade page's dot grid draws in all four cities (law 13).
Sources: Nomis NM_141_1 (UK Business Counts, local units by industry and employment size band), London region, March 2026:
  https://www.nomisweb.co.uk/api/v01/dataset/NM_141_1.data.csv?geography=E12000007&date=latest&industry=37748736,134273829,134273830,134313748&employment_sizeband=0,1,2,3,4,30,40&legal_status=0&measures=20100
U.S. Census Bureau County Business Patterns 2023, county file cbp23co.zip (establishments by employment size class):
  https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23co.zip
Run: python3 -I data/sourced/business/scripts/size_bands.py <nomis csv> <cbp23co.txt> <out json>"""
import csv, json, sys
nomis, cbp, out = sys.argv[1:4]
OGL = "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
rows = []
TRADE_UK = {"Total": "all", "56101 : Licensed restaurants": "restaurants", "56102 : Unlicensed restaurants and cafes": "cafes", "96020 : Hairdressing and other beauty treatment": "barbershops"}
CLASS_UK = {"0 to 4": "0 to 4 employees", "5 to 9": "5 to 9 employees", "10 to 19": "10 to 19 employees", "20 to 49": "20 to 49 employees"}
uk = {}
for r in csv.DictReader(open(nomis)):
    assert r["OBS_STATUS_NAME"] == "Normal Value", r
    uk.setdefault(r["INDUSTRY_NAME"], {})[r["EMPLOYMENT_SIZEBAND_NAME"]] = int(r["OBS_VALUE"]); year = r["DATE_NAME"]
for ind, bands in uk.items():
    total = bands["Total"]
    classes = {CLASS_UK[k]: v for k, v in bands.items() if k in CLASS_UK}
    classes["50 or more employees"] = bands["Medium-sized (50 to 249)"] + bands["Large (250+)"]
    assert sum(classes.values()) == total, (ind, classes, total)
    for name, v in classes.items():
        rows.append({"item": "size_class_share", "trade": TRADE_UK[ind],
                     "officialClass": "All industries (Total)" if ind == "Total" else f"SIC 2007 subclass {ind}",
                     "geo": {"level": "city", "code": "E12000007", "name": "London (Greater London)"},
                     "value": round(100 * v / total, 1), "unit": "percent of local units", "year": year,
                     "measure": f"share of local units with {name}, snapshot of March {year}",
                     "note": f"{v} of {total} local units in Greater London; employees, not owners, are counted (the UK register's employment size band).",
                     "source": {"publisher": "Office for National Statistics", "title": "UK Business Counts, local units by industry and employment size band (NM_141_1), via Nomis",
                                "url": "https://www.nomisweb.co.uk/datasets/idbrlu", "licence": OGL}})
TRADE_US = {"------": "all", "722511": "restaurants", "722515": "cafes", "812111": "barbershops"}
LABEL_US = {"------": "NAICS 2017: Total for all sectors", "722511": "NAICS 2017: Full-service restaurants (722511)", "722515": "NAICS 2017: Snack and nonalcoholic beverage bars (722515)", "812111": "NAICS 2017: Barber shops (812111)"}
for r in csv.DictReader(open(cbp, encoding="latin-1")):
    if r["fipstate"] != "06" or r["fipscty"] != "037" or r["naics"] not in TRADE_US:
        continue
    n = lambda k: 0 if r[k] in ("N", "") else int(r[k])
    total = int(r["est"])
    classes = {"1 to 4 employees": n("n<5"), "5 to 9 employees": n("n5_9"), "10 to 19 employees": n("n10_19"), "20 to 49 employees": n("n20_49"),
               "50 or more employees": sum(n(k) for k in ("n50_99", "n100_249", "n250_499", "n500_999", "n1000"))}
    assert sum(classes.values()) == total, (r["naics"], classes, total)
    for name, v in classes.items():
        rows.append({"item": "size_class_share", "trade": TRADE_US[r["naics"]], "officialClass": LABEL_US[r["naics"]],
                     "geo": {"level": "county", "code": "06037", "name": "Los Angeles County, California"},
                     "value": round(100 * v / total, 1), "unit": "percent of employer establishments", "year": "2023",
                     "measure": f"share of establishments with paid employees with {name} (week of March 12), 2023",
                     "note": f"{v} of {total} employer establishments in Los Angeles County; businesses with no employees are not counted. \"N\" (not available) classes read as none, as the class counts add to the total.",
                     "source": {"publisher": "U.S. Census Bureau", "title": "County Business Patterns 2023, county file (cbp23co)",
                                "url": "https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23co.zip", "licence": "Public domain (U.S. Government work)"}})
json.dump({"id": "size-bands-gb-us", "source": {"publisher": "Office for National Statistics and U.S. Census Bureau (each row names its own)",
           "title": "Business size classes: UK Business Counts (London) and County Business Patterns (Los Angeles County)",
           "url": "https://www.nomisweb.co.uk/datasets/idbrlu", "table": "NM_141_1 employment size bands, March 2026; cbp23co establishment size classes, 2023"},
           "retrieved": "2026-10-18", "rows": rows}, open(out, "w"), indent=1, ensure_ascii=False)
print(len(rows), "rows")
