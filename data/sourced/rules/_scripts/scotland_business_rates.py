"""Scotland's non-domestic rates for 2026-27: the poundage (basic, intermediate, higher) and the Small Business Bonus Scheme
thresholds, shaped as local-business-taxes.json holds England's. Each value's words are asserted in the page text saved on
2026-10-20. Usage: python3 scotland_business_rates.py <dir of saved texts> <out.json>"""
import json, os, sys

GEO = {"level": "region", "code": "GB-SCT", "name": "Scotland"}
ORDER = {"publisher": "Scottish Ministers (legislation.gov.uk)", "title": "The Non-Domestic Rate (Scotland) Order 2026 (SSI 2026/39)",
         "url": "https://www.legislation.gov.uk/ssi/2026/39/made", "licence": "Open Government Licence v3.0"}
REGS = {"publisher": "Scottish Ministers (legislation.gov.uk)",
        "title": "The Non-Domestic Rates (Levying and Miscellaneous Amendment) (Scotland) Regulations 2026 (SSI 2026/68), "
                 "regulations 5 and 6",
        "url": "https://www.legislation.gov.uk/ssi/2026/68/made", "licence": "Open Government Licence v3.0"}
CIRC = {"publisher": "Scottish Government",
        "title": "Local government finance circular 7/2026: non-domestic rates relief guidance, Annex A (Tables 3 and 4)",
        "url": "https://www.gov.scot/publications/local-government-finance-circular-7-2026-non-domestic-rates-relief-guidance/"
               "pages/non-domestic-rates-relief-information-for-scottish-local-authorities/",
        "licence": "Open Government Licence v3.0"}
C = "non-domestic-rates-relief-information-for-scottish-local-authorities.txt"
BASIC = ("Business rates in Scotland (non-domestic rates): rateable value times the poundage, billed by the council; "
         "the national rate applies to every property, and the additional factors of SSI 2026/68 add to it above GBP 51,000")
ROWS = [
    ("ssi39.txt", "specify a rate of 48.1 pence per pound as the non-domestic rate to be levied throughout Scotland in respect "
     "of the financial year 2026-2027", "local_tax_rate", 48.1, "pence per GBP of rateable value",
     "Non-domestic rates poundage, basic (the national non-domestic rate), rateable value up to GBP 51,000",
     BASIC + "; 49.8p in 2025-26 (the Order's explanatory note)", ORDER),
    ("ssi68.txt", "S is the additional factor of 0.054", "local_tax_rate", 53.5, "pence per GBP of rateable value",
     "Non-domestic rates poundage, intermediate (basic plus the additional factor), rateable value GBP 51,001 to 100,000",
     "the basic 48.1p (SSI 2026/39) plus the additional factor of 0.054 (5.4p, regulation 5 of SSI 2026/68); the sum is worked "
     "here, the two parts are each in law", REGS),
    ("ssi68.txt", "S is the additional factor of 0.067", "local_tax_rate", 54.8, "pence per GBP of rateable value",
     "Non-domestic rates poundage, higher (basic plus the additional factor), rateable value over GBP 100,000",
     "the basic 48.1p (SSI 2026/39) plus the additional factor of 0.067 (6.7p, regulation 6 of SSI 2026/68); the sum is worked "
     "here, the two parts are each in law", REGS),
    (C, "£12,000 or less 100% £12,001 to £15,000", "local_tax_relief_threshold", 12000, "GBP of rateable value",
     "Small Business Bonus Scheme: no rates at or below this rateable value (one property)",
     "100% relief where the ratepayer's only entry in the valuation roll has a rateable value of GBP 12,000 or less", CIRC),
    (C, "£12,001 to £15,000 Relief percentage = 100 - (75 x (1 - ((15000 - RV) / 3000)))", "local_tax_relief_threshold", 15000,
     "GBP of rateable value", "Small Business Bonus Scheme: relief tapers from 100% to 25% up to this rateable value (one property)",
     "relief percentage = 100 - (75 x (1 - ((15000 - RV) / 3000))) between GBP 12,001 and 15,000", CIRC),
    (C, "£15,001 to £20,000 Relief percentage = 25 x ((20000 - RV) / 5000)", "local_tax_relief_threshold", 20000,
     "GBP of rateable value", "Small Business Bonus Scheme: relief tapers from 25% to 0 up to this rateable value",
     "relief percentage = 25 x ((20000 - RV) / 5000) between GBP 15,001 and 20,000", CIRC),
    (C, "£12,001 to £35,000 25% on each individual property with a rateable value of £15,000 or less", "local_tax_relief_threshold",
     35000, "GBP of rateable value", "Small Business Bonus Scheme: the most a business's properties may be worth together and qualify",
     "with several properties: 100% where they total GBP 12,000 or less; 25% on each property of GBP 15,000 or less where they total "
     "GBP 12,001 to 35,000 (tapering to 0 for a property of GBP 15,001 to 20,000); the scheme runs 1 April 2026 to 31 March 2029 "
     "under regulations made for 2026-27", CIRC),
    (C, "15% relief is available for eligible properties in the retail, hospitality and leisure sectors (excluding Licensed Premises "
     "and Music Venues) with rateable values up to and including £100,000", "local_tax_relief", 15, "percent of the rates bill",
     "Retail, hospitality and leisure relief on the mainland, rateable value up to GBP 100,000, licensed premises and music venues "
     "excepted", "the purposes of Schedule 1 of the regulations (bed and breakfast, guest house, camping and the like in the circular's "
     "list); restaurants and cafes are in the 40% class below, not this one; applies 2026-27, the scheme set for 1 April 2026 to "
     "31 March 2029", CIRC),
    (C, "40% relief is available for eligible properties in licensed hospitality sectors and music venues with rateable values up to "
     "and including £100,000", "local_tax_relief", 40, "percent of the rates bill",
     "Licensed hospitality and music venue relief, rateable value up to GBP 100,000",
     "hotel, hostel, live music venue, public house, night club or restaurant (cafe, coffee shop, bistro, fast food restaurant or "
     "snack bar included, the circular's words for Schedule 1A)", CIRC),
]

def main(d, out):
    rows = []
    for f, words, item, v, unit, measure, note, src in ROWS:
        assert words in open(os.path.join(d, f), encoding="utf-8").read(), (f, words)
        rows.append({"item": item, "geo": GEO, "value": v, "unit": unit, "year": "2026-27", "measure": measure,
                     "note": note, "source": src})
    json.dump({"id": "rules-scotland-business-rates-2026", "source": ORDER, "retrieved": "2026-10-20", "rows": rows},
              open(out, "w"), indent=1, ensure_ascii=False)
    for r in rows: print(r["item"], r["value"], r["measure"][:70])

if __name__ == "__main__":
    main(*sys.argv[1:])
