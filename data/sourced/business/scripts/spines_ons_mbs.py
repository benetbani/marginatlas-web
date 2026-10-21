"""ONS Monthly Business Survey: turnover of services industries, SIC 56 and 96, current prices, not seasonally adjusted."""
import os, sys, urllib.request
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, write

FILE = "/economy/economicoutputandproductivity/output/datasets/monthlybusinesssurveymbsturnoverofservicesindustries/current/mbsturnoverofservicesindustries202608.xlsx"
PAGE = "https://www.ons.gov.uk/economy/economicoutputandproductivity/output/datasets/monthlybusinesssurveymbsturnoverofservicesindustries"
path = os.path.join(DL, "mbs.xlsx")
if not os.path.exists(path):
    req = urllib.request.Request("https://www.ons.gov.uk/file?uri=" + FILE, headers={"User-Agent": "Mozilla/5.0"})
    open(path, "wb").write(urllib.request.urlopen(req).read())
rows_x = list(openpyxl.load_workbook(path, read_only=True, data_only=True)["Services Industries"].iter_rows(values_only=True))
head, cdid = rows_x[1], rows_x[2]
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
months = []
for r in rows_x:
    p = str(r[0] or "").split()
    if len(p) == 2 and p[0].isdigit() and p[1] in MON:
        months.append((f"{p[0]}-{MON[p[1]]:02d}", r))
months = months[-24:]
SERIES = [("56", "SIC 2007 division 56: Food & beverage serving services", ["restaurants", "cafes"],
           "The division holds restaurants, cafes, takeaways, pubs and bars together; no class below it is published monthly."),
          ("96", "SIC 2007 division 96: Other personal services", ["barbershops"],
           "The division holds hairdressing and beauty with laundries, funeral services and other personal services; hairdressing is not published apart.")]
out = []
for code, cls, trades, note in SERIES:
    c = head.index(code)
    for t, r in months:
        for trade in trades:
            out.append({"item": "turnover_index_month", "trade": trade, "officialClass": cls,
                        "geo": {"level": "country", "code": "GB", "name": "United Kingdom"},
                        "value": r[c], "unit": "GBP million", "year": t,
                        "measure": f"total turnover in the month, current prices, not seasonally adjusted, {t} (series {cdid[c]})",
                        "note": "The publisher prints money, not an index: the month's turnover in GBP million is the series. " + note})
write("business", "ons-mbs-turnover-month.json", {
    "id": "ons-mbs-turnover-month",
    "source": {"publisher": "Office for National Statistics",
               "title": "Monthly Business Survey (MBS): turnover of services industries",
               "url": PAGE,
               "table": "mbsturnoverofservicesindustries202608.xlsx, sheet 'Services Industries', columns 56 (CDID JQ37) and 96 (CDID JR3P); the latest 24 months",
               "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
    "retrieved": RETRIEVED, "rows": out})
