"""US Census Monthly Retail Trade: food services and drinking places (NAICS 722), not adjusted, USD million."""
import os, re, sys, urllib.request
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, write

URL = "https://www.census.gov/retail/mrts/www/mrtssales92-present.xlsx"
path = os.path.join(DL, "mrtssales.xlsx")
if not os.path.exists(path):
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    open(path, "wb").write(urllib.request.urlopen(req).read())
wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
SERIES = {"722": ("restaurants", "NAICS 722: Food services and drinking places",
                  "The subsector holds full-service restaurants with limited-service places, caterers and drinking places; full-service restaurants (722511) are not published monthly."),
          "722513, 722514, 722515": ("cafes", "NAICS 722513, 722514, 722515: Limited service eating places",
                  "Limited-service restaurants, cafeterias and snack and nonalcoholic beverage bars together; coffee shops (722515) are not published apart.")}
pts = {}
for year in ("2024", "2025", "2026"):
    rows = list(wb[year].iter_rows(values_only=True))
    months = rows[4]
    adjusted = False
    for r in rows[5:]:
        if r[1] and str(r[1]).startswith("ADJUSTED"):
            adjusted = True
        if adjusted or str(r[0]).strip() not in SERIES:
            continue
        for c, lab in enumerate(months):
            m = re.match(r"(\w{3})\.? (\d{4})(\(p\))?", str(lab or ""))
            if m and isinstance(r[c], (int, float)):
                pts[(str(r[0]).strip(), f"{m.group(2)}-{MON[m.group(1)]:02d}")] = (r[c], bool(m.group(3)))
out = []
for code, (trade, cls, note) in SERIES.items():
    for t in sorted(k[1] for k in pts if k[0] == code)[-24:]:
        v, prelim = pts[(code, t)]
        out.append({"item": "turnover_index_month", "trade": trade, "officialClass": cls,
                    "geo": {"level": "country", "code": "US", "name": "United States"},
                    "value": v, "unit": "USD million", "year": t,
                    "measure": f"sales in the month, not adjusted for season, holidays, trading days or prices, {t}",
                    "note": ("The publisher prints money, not an index: the month's sales in USD million is the series. "
                             "National only: no state is published monthly. " + note + (" Preliminary estimate." if prelim else ""))})
write("business", "us-census-mrts-month.json", {
    "id": "us-census-mrts-month",
    "source": {"publisher": "U.S. Census Bureau",
               "title": "Monthly Retail Trade Survey: Estimates of Monthly Retail and Food Services Sales by Kind of Business",
               "url": "https://www.census.gov/retail/sales.html",
               "table": URL + ", sheets 2024 to 2026, NOT ADJUSTED block, rows 722 and 722513-722515; the latest 24 months",
               "licence": "US federal work, public domain"},
    "retrieved": RETRIEVED, "rows": out})
