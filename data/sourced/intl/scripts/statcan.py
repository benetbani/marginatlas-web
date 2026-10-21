"""Statistics Canada: food services summary statistics (21-10-0171-01), Canadian Business Counts June 2026
(33-10-1174-01 with employees, 33-10-1175-01 without employees, 33-10-1176-01 with employees by CMA and CSD),
population estimates 1 July 2025 (17-10-0148-01 CMA, 17-10-0155-01 CSD). Full-table CSVs from the WDS API
(https://www150.statcan.gc.ca/t1/wds/rest/getFullTableDownloadCSV/<pid>/en) in /srv/atlas/runs/data-intl/dl/statcan.
"""
import csv
from lib import write, DL, RETRIEVED

D = f"{DL}/statcan"
TV = "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid="
SRC = {
    "fs": {"publisher": "Statistics Canada", "title": "Food services and drinking places, summary statistics (table 21-10-0171-01)", "url": TV + "2110017101"},
    "cbc": {"publisher": "Statistics Canada", "title": "Canadian Business Counts, with employees, June 2026 (table 33-10-1174-01)", "url": TV + "3310117401"},
    "cbc0": {"publisher": "Statistics Canada", "title": "Canadian Business Counts, without employees, June 2026 (table 33-10-1175-01)", "url": TV + "3310117501"},
    "cma": {"publisher": "Statistics Canada", "title": "Canadian Business Counts, with employees, census metropolitan areas and census subdivisions, June 2026 (table 33-10-1176-01)", "url": TV + "3310117601"},
    "popcma": {"publisher": "Statistics Canada", "title": "Population estimates, July 1, by census metropolitan area and census agglomeration, 2021 boundaries (table 17-10-0148-01)", "url": TV + "1710014801"},
    "popcsd": {"publisher": "Statistics Canada", "title": "Population estimates, July 1, by census subdivision, 2021 boundaries (table 17-10-0155-01)", "url": TV + "1710015501"},
}
LOC = ("Statistics Canada counts statistical locations: a business with ten stores and a head office counts eleven times. "
       "Statistics Canada advises not to read these counts as a time series.")
CLASSES = {  # NAICS member label -> trade (None: written under its own class only)
    "Full-service restaurants [722511]": ("restaurants", None),
    "Limited-service eating places [722512]": (None, "Canada's NAICS 722512 holds fast food, takeaway and coffee shops together: no class for cafes alone."),
    "Drinking places (alcoholic beverages) [7224]": ("cafes", "Drinking places (bars, pubs, taverns), the counterpart of ISIC 5630 beverage serving. Canada's coffee shops sit in limited-service eating places (722512), not here."),
    "Barber shops [812114]": ("barbershops", None),
    "Unisex hair salons [812116]": (None, None),
    "Beauty salons [812115]": (None, None),
    "Full-service restaurants and limited-service eating places [7225]": ("restaurants", "NAICS 7225 holds full-service restaurants and limited-service eating places (fast food, takeaway, coffee shops) together: the finest class published by metropolitan area and city."),
    "Personal care services [8121]": ("barbershops", "NAICS 8121 holds barber shops, hair salons, beauty salons, nail salons and other personal care together: the finest class published by metropolitan area and city."),
    "Total, all industries [1]": ("all", None),
}
CITIES = {  # catalog city: (CMA DGUID, CMA name, CSD DGUID, CSD name)
    "toronto": ("2021S0503535", "Toronto (census metropolitan area)", "2021A00053520005", "Toronto (city)"),
    "montreal": ("2021S0503462", "Montréal (census metropolitan area)", "2021A00052466023", "Montréal (city)"),
    "vancouver": ("2021S0503933", "Vancouver (census metropolitan area)", "2021A00055915022", "Vancouver (city)"),
    "calgary": ("2021S0503825", "Calgary (census metropolitan area)", "2021A00054806016", "Calgary (city)"),
}
CA = {"level": "country", "code": "CA", "name": "Canada"}
rows = []


def row(**k):
    return {x: y for x, y in k.items() if y is not None}


def num(s):
    return float(s) if s not in ("", None) else None


# 1. Business counts, Canada, with and without employees
for key, tab, kind in (("cbc", "33101174", "with employees"), ("cbc0", "33101175", "without employees (owner-operated or no payroll)")):
    for r in csv.DictReader(open(f"{D}/{tab}.csv", encoding="utf-8-sig")):
        if r["GEO"] != "Canada" or not r.get("Employment size", "Total").startswith("Total") or r["North American Industry Classification System (NAICS)"] not in CLASSES:
            continue
        v = num(r["VALUE"])
        if v is None:
            continue
        cls = r["North American Industry Classification System (NAICS)"]
        trade, note = CLASSES[cls]
        rows.append(row(item="business_count", trade=trade, officialClass=f"NAICS Canada 2022 {cls}", geo=CA, value=int(v),
                        unit="business locations", year=r["REF_DATE"][:4] + "-06", measure=f"active business locations {kind}, June 2026",
                        note=" ".join(x for x in (note, LOC) if x), source=SRC[key]))

# 2. Business counts by CMA and CSD (with employees only: the table has no counts without employees)
want = {}
for c, (cma, cman, csd, csdn) in CITIES.items():
    want[cma] = {"level": "metro", "code": f"CA-{cma}", "name": cman}
    want[csd] = {"level": "city", "code": f"CA-{csd}", "name": csdn}
for r in csv.DictReader(open(f"{D}/33101176.csv", encoding="utf-8-sig")):
    if r["DGUID"] not in want or r["Employment size"] != "Total, with employees":
        continue
    cls = r["North American Industry Classification System (NAICS)"]
    if cls not in CLASSES:
        continue
    v = num(r["VALUE"])
    if v is None:
        continue
    trade, note = CLASSES[cls]
    rows.append(row(item="business_count", trade=trade, officialClass=f"NAICS Canada 2022 {cls}", geo=want[r["DGUID"]], value=int(v),
                    unit="business locations", year="2026-06", measure="active business locations with employees, June 2026 (locations without employees are not published below the province)",
                    note=" ".join(x for x in (note, LOC) if x), source=SRC["cma"]))

# 3. Populations for the same boundaries, 1 July 2025
for tab, key in (("17100148", "popcma"), ("17100155", "popcsd")):
    for r in csv.DictReader(open(f"{D}/{tab}.csv", encoding="utf-8-sig")):
        if r["REF_DATE"] != "2025" or r["DGUID"] not in want and r["GEO"] != "Canada":
            continue
        if tab == "17100148" and (r["Gender"] != "Total - gender" or r["Age group"] != "All ages"):
            continue
        if r["GEO"] == "Canada" and tab == "17100148":
            continue
        g = CA if r["GEO"] == "Canada" else want[r["DGUID"]]
        rows.append(row(item="population", geo=g, value=int(num(r["VALUE"])), unit="persons", year="2025",
                        measure="population estimate, 1 July 2025 (2021 boundaries)",
                        note="Same boundary and code as the business counts of table 33-10-1176-01." if g is not CA else None, source=SRC[key]))

# 4. Food services and drinking places: financial summary, Canada and the four cities' provinces, latest year
PROV = {"Canada": CA, "Ontario": {"level": "region", "code": "CA-ON", "name": "Ontario"}, "Quebec": {"level": "region", "code": "CA-QC", "name": "Quebec"},
        "British Columbia": {"level": "region", "code": "CA-BC", "name": "British Columbia"}, "Alberta": {"level": "region", "code": "CA-AB", "name": "Alberta"}}
FS = {"Full-service restaurants [722511]": "restaurants", "Drinking places (alcoholic beverages) [7224]": "cafes",
      "Limited-service eating places [722512]": None, "Food services and drinking places [722]": None}
fs = {}
for r in csv.DictReader(open(f"{D}/21100171.csv", encoding="utf-8-sig")):
    if r["GEO"] in PROV and r["North American Industry Classification System (NAICS)"] in FS and num(r["VALUE"]) is not None:
        fs[(r["REF_DATE"], r["GEO"], r["North American Industry Classification System (NAICS)"], r["Summary statistics"])] = (num(r["VALUE"]), r["STATUS"])
year = max(k[0] for k in fs)
QUAL = {"A": "excellent", "B": "very good", "C": "good", "D": "acceptable", "E": "use with caution"}
for geo, g in PROV.items():
    for cls, trade in FS.items():
        def get(s):
            return fs.get((year, geo, cls, s))
        rev, sal, opm = get("Operating revenue"), get("Salaries, wages, commissions and benefits"), get("Operating profit margin")
        q = [QUAL[x[1]] for x in (rev, sal, opm) if x and x[1] in QUAL]
        qn = ("Statistics Canada quality indicator: " + ", ".join(sorted(set(q))) + ".") if q else None
        cnote = CLASSES.get(cls, (None, None))[1]
        if rev and sal:
            rows.append(row(item="staff_cost_share", trade=trade, officialClass=f"NAICS Canada {cls}", geo=g, value=round(100 * sal[0] / rev[0], 1),
                            unit="percent of operating revenue", year=year,
                            measure="salaries, wages, commissions and benefits divided by operating revenue",
                            note=" ".join(x for x in (cnote, f"{sal[0]:,.1f} million CAD over operating revenue of {rev[0]:,.1f} million CAD.", qn) if x), source=SRC["fs"]))
        if opm:
            rows.append(row(item="operating_profit_margin", trade=trade, officialClass=f"NAICS Canada {cls}", geo=g, value=opm[0],
                            unit="percent of operating revenue", year=year,
                            measure="operating profit margin as published: operating revenue minus operating expenses (depreciation included), divided by operating revenue. Not the gross operating rate: it is after depreciation and after all staff pay",
                            note=" ".join(x for x in (cnote, qn) if x), source=SRC["fs"]))
        if rev:
            rows.append(row(item="operating_revenue_total", trade=trade, officialClass=f"NAICS Canada {cls}", geo=g, value=rev[0],
                            unit="million CAD", year=year, measure="total operating revenue of the industry (no business count is published with it, so no mean per business)",
                            note=" ".join(x for x in (cnote, qn) if x), source=SRC["fs"]))

write("statcan-canada.json", {
    "id": "statcan-canada",
    "source": {"publisher": "Statistics Canada", "title": "Canadian Business Counts (June 2026), Food services and drinking places summary statistics, Population estimates (1 July 2025)",
               "url": TV + "3310117601", "table": "Each row names its own table: 33-10-1174, 33-10-1175, 33-10-1176, 21-10-0171, 17-10-0148, 17-10-0155",
               "licence": "Statistics Canada Open Licence, https://www.statcan.gc.ca/en/terms-conditions/open-licence"},
    "retrieved": RETRIEVED, "rows": rows})
