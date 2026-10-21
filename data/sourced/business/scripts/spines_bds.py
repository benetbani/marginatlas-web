"""US Census Business Dynamics Statistics 2023: establishment entry and exit rates, NAICS 7225 and 8121 (national),
sectors 72 and 81 (California), and every sector (US, California)."""
import csv, os, urllib.request
from spines_lib import DL, RETRIEVED, write

BASE = "https://www2.census.gov/programs-surveys/bds/tables/time-series/2023/"
FILES = ["bds2023.csv", "bds2023_st.csv", "bds2023_vcn4.csv", "bds2023_st_sec.csv"]
for f in FILES:
    p = os.path.join(DL, f)
    if not os.path.exists(p):
        req = urllib.request.Request(BASE + f, headers={"User-Agent": "Mozilla/5.0"})
        open(p, "wb").write(urllib.request.urlopen(req).read())
US = {"level": "country", "code": "US", "name": "United States"}
CA = {"level": "region", "code": "06", "name": "California"}
YEARS = {"2021", "2022", "2023"}
rows = []


def add(r, trade, cls, geo, note, f):
    y = r["year"]
    for item, word, cnt, rate in (("birth_rate", "entries", "estabs_entry", "estabs_entry_rate"),
                                  ("death_rate", "exits", "estabs_exit", "estabs_exit_rate")):
        n = [note] if note else []
        n.append(f"Establishments, not firms: {int(r[cnt]):,} establishment {word} in the year to March {y}; "
                 f"the denominator is the average of the establishment counts of {int(y) - 1} and {y} ({f}).")
        rows.append({"item": item, "trade": trade, "officialClass": cls, "geo": geo, "value": float(r[rate]),
                     "unit": "per 100 establishments", "year": y,
                     "measure": f"establishment {word} rate, employer establishments, {y}",
                     "note": " ".join(n)})


def read(f):
    return list(csv.DictReader(open(os.path.join(DL, f))))


for r in read("bds2023_vcn4.csv"):
    if r["year"] in YEARS and r["vcnaics4"] == "7225":
        for t in ("restaurants", "cafes"):
            add(r, t, "NAICS 7225: Restaurants and other eating places", US,
                "Full-service and limited-service restaurants, cafeterias, snack and coffee bars together; the 6-digit classes are not published.", "bds2023_vcn4.csv")
    if r["year"] in YEARS and r["vcnaics4"] == "8121":
        add(r, "barbershops", "NAICS 8121: Personal care services",
            US, "Barber shops (812111) with beauty salons, nail salons and other personal care; 812111 is not published.", "bds2023_vcn4.csv")
for r in read("bds2023_st_sec.csv"):
    if r["year"] in YEARS and r["st"] == "06" and r["sector"] == "72":
        for t in ("restaurants", "cafes"):
            add(r, t, "NAICS 72: Accommodation and food services", CA,
                "California by sector only: the sector holds hotels with restaurants, cafes and bars.", "bds2023_st_sec.csv")
    if r["year"] in YEARS and r["st"] == "06" and r["sector"] == "81":
        add(r, "barbershops", "NAICS 81: Other services (except public administration)", CA,
            "California by sector only: the sector holds repair, personal care, laundries, religious and civic organisations.", "bds2023_st_sec.csv")
for r in read("bds2023.csv"):
    if r["year"] in YEARS:
        add(r, "all", "All sectors (private non-farm employer establishments)", US, None, "bds2023.csv")
for r in read("bds2023_st.csv"):
    if r["year"] in YEARS and r["st"] == "06":
        add(r, "all", "All sectors (private non-farm employer establishments)", CA, None, "bds2023_st.csv")
write("business", "us-bds-rates-2023.json", {
    "id": "us-bds-rates-2023",
    "source": {"publisher": "U.S. Census Bureau", "title": "Business Dynamics Statistics (BDS) 2023 release",
               "url": "https://www.census.gov/programs-surveys/bds/data/data-tables.html",
               "table": BASE + " files " + ", ".join(FILES) + "; columns estabs_entry_rate, estabs_exit_rate, years 2021 to 2023",
               "licence": "US federal work, public domain"},
    "retrieved": RETRIEVED, "rows": rows})
