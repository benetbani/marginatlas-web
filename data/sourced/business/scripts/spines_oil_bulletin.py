"""EU Weekly Oil Bulletin: automotive diesel, consumer price with and without taxes, the latest week (EUR, published per 1,000 litres)."""
import os, sys, urllib.request
sys.path.insert(0, "/srv/atlas/wc/cwd/research-business/venv/lib/python3.13/site-packages")
import openpyxl
from spines_lib import DL, RETRIEVED, geo_eu, write

URL = "https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en?filename=Weekly_Oil_Bulletin_Prices_History_maticni_4web.xlsx"
path = os.path.join(DL, "wob_hist.xlsx")
if not os.path.exists(path):
    open(path, "wb").write(urllib.request.urlopen(urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})).read())
wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
NAMES = {"EU": ("EU27_2020", "European Union (weighted average)"), "EUR": ("EA", "Euro area (weighted average)"),
         "AT": "Austria", "BE": "Belgium", "BG": "Bulgaria", "CY": "Cyprus", "CZ": "Czechia", "DE": "Germany", "DK": "Denmark",
         "EE": "Estonia", "ES": "Spain", "FI": "Finland", "FR": "France", "GR": "Greece", "HR": "Croatia", "HU": "Hungary",
         "IE": "Ireland", "IT": "Italy", "LT": "Lithuania", "LU": "Luxembourg", "LV": "Latvia", "MT": "Malta", "NL": "Netherlands",
         "PL": "Poland", "PT": "Portugal", "RO": "Romania", "SE": "Sweden", "SI": "Slovenia", "SK": "Slovakia"}
rows = []
for sheet, key, words in (("Prices with taxes", "price_with_tax_diesel", "with all duties and taxes, VAT included (the pump price)"),
                          ("Prices wo taxes", "price_wo_tax_diesel", "without duties and taxes")):
    it = wb[sheet].iter_rows(values_only=True)
    head = next(it)
    data = [r for r in it if r and hasattr(r[0], "year")]
    latest = max(data, key=lambda r: r[0])
    week = latest[0].strftime("%Y-%m-%d")
    for i, h in enumerate(head):
        if not h or not str(h).endswith(key):
            continue
        cc = str(h).split("_")[0]
        if cc not in NAMES or not isinstance(latest[i], (int, float)):
            continue
        nm = NAMES[cc]
        geo = {"level": "eu", "code": nm[0], "name": nm[1]} if isinstance(nm, tuple) else geo_eu("EL" if cc == "GR" else cc, nm)
        rows.append({"item": "diesel_price", "officialClass": "Automotive gas oil (diesel)", "geo": geo,
                     "value": round(latest[i] / 1000, 4), "unit": "EUR per litre", "year": week,
                     "measure": f"average consumer price of diesel, {words}, week of {week}",
                     "note": f"Published as EUR {latest[i]:,.2f} per 1,000 litres; divided by 1,000. Prices outside the euro area are converted to EUR by the bulletin."
                             + (" A business registered for VAT recovers the VAT inside the pump price." if "VAT" in words else "")})
write("business", "eu-oil-bulletin-diesel.json", {
    "id": "eu-oil-bulletin-diesel",
    "source": {"publisher": "European Commission, Directorate-General for Energy", "title": "Weekly Oil Bulletin: price history",
               "url": "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
               "table": "Weekly_Oil_Bulletin_Prices_History_maticni_4web.xlsx, sheets 'Prices with taxes' and 'Prices wo taxes', columns <country>_price_with_tax_diesel and <country>_price_wo_tax_diesel, the latest week",
               "licence": "European Commission reuse policy (Commission Decision 2011/833/EU): reuse allowed with acknowledgement of the source"},
    "retrieved": RETRIEVED, "rows": rows})
