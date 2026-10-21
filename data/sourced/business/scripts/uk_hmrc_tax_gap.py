"""HMRC, Measuring tax gaps 2026 edition, online tables (S-U1, 2026-10-20): the trade page's informal block.

Tables 1.2 (the tax gap and the total theoretical liability, GBP billion), 1.3 (by customer group) and 7.1 (by behaviour: the hidden
economy), the tax year 2024 to 2025, each value read from the workbook's own cell. The workbook is downloaded once to the runs
directory (not committed). No figure here is a trade's own: HMRC publishes the tax gap by tax, customer group and behaviour, never by
industry, so every row is the United Kingdom's.

    /srv/atlas/wc/cwd/research-business/venv/bin/python -I data/sourced/business/scripts/uk_hmrc_tax_gap.py
"""
import json, os, urllib.request
import openpyxl

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, "..", "hmrc-tax-gap-2026.json"))
PAGE = "https://www.gov.uk/government/statistics/measuring-tax-gaps-tables"
FILE = "https://assets.publishing.service.gov.uk/media/6a314f53141f0690ad5fa41e/Measuring_tax_gap_online_tables_2026.xlsx"
PATH = "/srv/atlas/runs/uk-trade/dl/mtg2026.xlsx"
if not os.path.exists(PATH):
    os.makedirs(os.path.dirname(PATH), exist_ok=True)
    open(PATH, "wb").write(urllib.request.urlopen(urllib.request.Request(FILE, headers={"User-Agent": "Mozilla/5.0"})).read())
YEAR = "2024-25"
wb = openpyxl.load_workbook(PATH, read_only=True, data_only=True)


def table(name):
    ws = wb[name]
    ws.reset_dimensions()
    rows = [r for r in ws.iter_rows(values_only=True)]
    head = next(r for r in rows if YEAR in r)
    return head.index(YEAR), rows


def cell(name, *keys):
    col, rows = table(name)
    for r in rows:
        if all(k in r for k in keys):
            return r[col]
    raise KeyError(f"{name}: {keys}")


def pct(v):
    return round(float(v) * 100, 1) if isinstance(v, float) and v < 1 else float(str(v).rstrip("%"))


GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
base = {"geo": GB, "year": "2024/25"}
gap = cell("Table 1.2", "Total tax gap")
owed = cell("Table 1.2", "Total theoretical tax liability")
rate = cell("Table 1.2", "Total percentage tax gap (%)")
hidden = cell("Table 7.1", "Hidden economy", "Tax gap in £bn")
hidden_share = cell("Table 7.1", "Hidden economy", "Proportion of the tax gap %")
small = cell("Table 1.3", "Small businesses", "Tax gap in £bn")
small_share = cell("Table 1.3", "Small businesses", "Proportion of the tax gap")
rows = [
    {**base, "item": "tax_gap_share", "value": pct(rate), "unit": "percent of total theoretical tax liabilities",
     "measure": "the tax gap: tax that should be paid to HMRC but is not, as a share of all tax owed (provisional), tax year 2024 to 2025",
     "note": f"Table 1.2: GBP {gap} billion of GBP {owed} billion owed."},
    {**base, "item": "tax_gap_gbp", "value": float(gap), "unit": "GBP billion", "measure": "the tax gap, all taxes, tax year 2024 to 2025 (provisional)", "note": "Table 1.2."},
    {**base, "item": "tax_owed_gbp", "value": float(owed), "unit": "GBP billion", "measure": "total theoretical tax liability, tax year 2024 to 2025", "note": "Table 1.2."},
    {**base, "item": "hidden_economy_gap_gbp", "value": float(hidden), "unit": "GBP billion",
     "measure": "the tax gap from the hidden economy (economic activity entirely undeclared to HMRC), tax year 2024 to 2025",
     "note": "Table 7.1, illustrative tax gap by behaviour."},
    {**base, "item": "hidden_economy_share_of_gap", "value": pct(hidden_share), "unit": "percent of the tax gap",
     "measure": "the hidden economy's share of the tax gap, tax year 2024 to 2025", "note": "Table 7.1, rounded by the publisher to the nearest 1%."},
    {**base, "item": "hidden_economy_share_of_tax", "value": round(100 * float(hidden) / float(owed), 2), "unit": "percent of total theoretical tax liabilities",
     "measure": "the hidden economy's tax gap as a share of all tax owed, tax year 2024 to 2025",
     "note": f"Derived: GBP {hidden} billion (Table 7.1) over GBP {owed} billion owed (Table 1.2)."},
    {**base, "item": "small_business_share_of_gap", "value": pct(small_share), "unit": "percent of the tax gap",
     "measure": "small businesses' share of the tax gap, tax year 2024 to 2025", "note": f"Table 1.3: GBP {small} billion of GBP {gap} billion."},
]
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({"id": "hmrc-tax-gap-2026",
               "source": {"publisher": "HM Revenue & Customs", "title": "Measuring tax gaps 2026 edition: online tables", "url": PAGE,
                          "table": "Measuring_tax_gap_online_tables_2026.xlsx (published 23 June 2026), Tables 1.2, 1.3 and 7.1, tax year 2024 to 2025",
                          "licence": "Open Government Licence v3.0, https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"},
               "retrieved": "2026-10-20", "rows": rows}, f, ensure_ascii=False, indent=1)
    f.write("\n")
for r in rows:
    print(r["item"], r["value"])
