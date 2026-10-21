"""ONS Annual Business Survey 2024 by employment size band, EVERY section (S-U1, 2026-10-20): the trade page's people tiers.

The same workbook as spines_ons_abs_size.py (abssizeband.xlsx, released 26 May 2026, held at /srv/atlas/runs/data-spines/dl), every
section it prints, each size band and the total: sales per enterprise, purchases as a share of turnover, the gross operating rate
(aGVA less employment costs, over turnover) and the band's share of the section's turnover. Rows carry `classCode` (the section
letter, "A to S (part)" the whole), never `trade`: the trade page reads them through the class map, as data-trades' files.

    /srv/atlas/wc/cwd/research-business/venv/bin/python -I data/sourced/business/scripts/uk_abs_size_sections.py
"""
import json, os
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "ons-abs-size-sections-2024.json"))
PAGE = "https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/datasets/uknonfinancialbusinesseconomyannualbusinesssurveyemploymentsizeband"
PATH = "/srv/atlas/runs/data-spines/dl/abs_size.xlsx"
YEAR = 2024
BANDS = ["1 to 9", "10 to 49", "50 to 249", "250 and over"]
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}

wb = openpyxl.load_workbook(PATH, read_only=True, data_only=True)
data, names = {}, {}
for sheet in BANDS + ["Total"]:
    for r in wb[sheet].iter_rows(values_only=True):
        if r[3] == YEAR and isinstance(r[0], str):
            # SIC, description, band, year, enterprises, turnover, aGVA, purchases, employment costs (GBP million)
            data[(r[0], sheet)] = r[4:9]
            names[r[0]] = r[1].strip()


def num(v):
    return v if isinstance(v, (int, float)) else None


rows = []
for code in names:
    cls = f"SIC 2007 section {code}: {names[code]}"
    for band in BANDS + ["Total"]:
        ent, tur, gva, pur, emp = (num(x) for x in data.get((code, band), (None,) * 5))
        tot = num(data.get((code, "Total"), (None,) * 5)[1])
        who = "all enterprises" if band == "Total" else f"enterprises with {band} in employment"
        base = {"classCode": code, "officialClass": cls, "geo": GB, "year": str(YEAR)}
        note = "Size bands use the business register's employment (the publisher's note 1)."
        if band == "Total":
            note = "The section's total, every size band."
        if ent and tur:
            rows.append({**base, "item": "sales_per_business_by_size", "value": round(tur * 1e6 / ent), "unit": "GBP per enterprise",
                         "measure": f"mean total turnover per enterprise, {who}",
                         "note": f"{note} Derived: GBP {tur:,} million total turnover over {ent:,} enterprises."})
        if tur and pur is not None:
            rows.append({**base, "item": "purchases_share_by_size", "value": round(100 * pur / tur, 1), "unit": "percent of turnover",
                         "measure": f"total purchases of goods, materials and services divided by total turnover, {who}",
                         "note": f"{note} Derived: GBP {pur:,} million of GBP {tur:,} million."})
        if tur and gva is not None and emp is not None:
            rows.append({**base, "item": "gross_operating_rate_by_size", "value": round(100 * (gva - emp) / tur, 1), "unit": "percent of turnover",
                         "measure": f"approximate gross value added less total employment costs, divided by total turnover, {who}",
                         "note": f"{note} Derived: (GBP {gva:,} million less GBP {emp:,} million) over GBP {tur:,} million."})
        if band != "Total" and tur and tot:
            rows.append({**base, "item": "turnover_share_by_size", "value": round(100 * tur / tot, 1), "unit": "percent of the section's total turnover",
                         "measure": f"share of total turnover made by {who}",
                         "note": f"{note} Derived: GBP {tur:,} million of GBP {tot:,} million total turnover."})

with open(OUT, "w", encoding="utf-8") as f:
    json.dump({
        "id": "ons-abs-size-sections-2024",
        "source": {"publisher": "Office for National Statistics",
                   "title": "UK non-financial business economy, Annual Business Survey: employment size band",
                   "url": PAGE,
                   "table": "abssizeband.xlsx (released 26 May 2026), sheets '1 to 9', '10 to 49', '50 to 249', '250 and over', 'Total', year 2024, every section: Number of enterprises, Total turnover, aGVA, Total purchases, Total employment costs",
                   "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
        "retrieved": "2026-10-20", "rows": rows}, f, ensure_ascii=False, indent=1)
    f.write("\n")
print(OUT, len(rows), "rows,", len(names), "sections")
