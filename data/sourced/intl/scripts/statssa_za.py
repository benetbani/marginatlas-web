"""South Africa: Statistics South Africa, Food and beverages industry, Report No. 64-20-01 (2022), large sample survey of
VAT-registered enterprises, financial years ending 1 July 2021 to 30 June 2022 (PDF in /srv/atlas/runs/data-intl/dl/s2,
text extracted with pypdf). Figures typed from tables C, D/13 and 9 of that PDF (R million).
"""
from lib import write, RETRIEVED

SRC = {"publisher": "Statistics South Africa", "title": "Food and beverages industry, 2022 (Report No. 64-20-01), large sample survey",
       "url": "https://www.statssa.gov.za/publications/Report-64-20-01/Report-64-20-012022.pdf"}
ZA = {"level": "country", "code": "ZA", "name": "South Africa"}
SCOPE = ("VAT-registered enterprises only, financial years ending between 1 July 2021 and 30 June 2022 (year written as 2022). ")
# type of service: (trades, class words, turnover, net profit after tax, published margin, salaries, purchases, rent, employment)
T = {
    "Restaurants and coffee shops": (["restaurants", "cafes"], "SIC 64201 and 64202: restaurants, coffee shops and tearooms, with and without a liquor licence (one category: written under restaurants and under cafes)",
                                     50261, 2133, 4.2, 8974, 22686, 3788, 127437),
    "Takeaway and fast-food outlets": ([None], "SIC 64203: takeaway counters and fast-food outlets", 29584, 1801, 6.1, 4729, 13694, 1552, 64315),
    "Total food and beverages industry": ([None], "SIC 64201 to 64209: the whole food and beverages industry (restaurants, takeaway, caterers)", 95837, 4251, 4.4, 16898, 46271, 6014, 236527),
}
rows = []
for name, (trades, cls, turn, npat, margin, sal, pur, rent, emp) in T.items():
    for t in trades:
        b = {"officialClass": f"Stats SA type of service '{name}', {cls}", "geo": ZA, "year": "2022", "source": SRC}
        if t:
            b["trade"] = t
        rows += [
            dict(b, item="net_profit_margin", value=margin, unit="percent of turnover", measure="profit margin as published: net profit after tax divided by turnover (after the owner's pay where salaried, depreciation, interest and tax). Not the gross operating rate",
                 note=SCOPE + f"Net profit after tax {npat:,} over turnover {turn:,} million ZAR (table C)."),
            dict(b, item="staff_cost_share", value=round(100 * sal / turn, 1), unit="percent of turnover", measure="salaries and wages divided by turnover, derived from two published figures",
                 note=SCOPE + f"Salaries and wages {sal:,} over turnover {turn:,} million ZAR (tables 9 and C)."),
            dict(b, item="purchases_share", value=round(100 * pur / turn, 1), unit="percent of turnover", measure="purchases (of goods) divided by turnover, derived from two published figures; rent, utilities and other services are separate expenditure lines",
                 note=SCOPE + f"Purchases {pur:,} over turnover {turn:,} million ZAR (tables 9 and C)."),
            dict(b, item="rent_share", value=round(100 * rent / turn, 1), unit="percent of turnover", measure="rental and leasing of land, buildings and other structures under operating leases, divided by turnover, derived",
                 note=SCOPE + f"Rent {rent:,} over turnover {turn:,} million ZAR (tables 9 and C)."),
            dict(b, item="persons_employed_total", value=emp, unit="persons employed", measure="persons employed at the last pay period ended on or before 30 June 2022 (no count of enterprises is published, so no mean per business)",
                 note=SCOPE.strip()),
        ]

write("statssa-south-africa.json", {
    "id": "statssa-south-africa",
    "source": dict(SRC, table="Tables C (profit margin), 9 (expenditure), D and 13 (employment); text extracted from the PDF",
                   licence="Statistics South Africa copyright: free use with acknowledgement of the source (Statistics Act 6 of 1999)"),
    "retrieved": RETRIEVED, "rows": rows})
