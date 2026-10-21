"""uk3: capital_gains_tax_rate and income_tax_rate for 2026-27, as GOV.UK's pages state them (read 2026-10-20), Scotland's
bands confirmed against the Scottish Government's factsheet. Values typed from the pages' text, saved under
/srv/atlas/runs/data-uk3/dl/ (gov_*.html, scot_it.html). Usage: python3 -I uk3_tax_rates.py OUT_JSON
"""
import json, sys

CGT = {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "Capital Gains Tax: what you pay it on, rates and allowances (Capital Gains Tax rates)",
       "url": "https://www.gov.uk/capital-gains-tax/rates"}
CGT_A = {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "Capital Gains Tax: what you pay it on, rates and allowances (Capital Gains Tax allowances)",
         "url": "https://www.gov.uk/capital-gains-tax/allowances"}
BADR = {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "Business Asset Disposal Relief", "url": "https://www.gov.uk/business-asset-disposal-relief"}
IT = {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "Income Tax rates and Personal Allowances", "url": "https://www.gov.uk/income-tax-rates"}
SIT = {"publisher": "HM Revenue & Customs (GOV.UK)", "title": "Income Tax in Scotland", "url": "https://www.gov.uk/scottish-income-tax"}
SG = "https://www.gov.scot/publications/scottish-income-tax-rates-and-bands/pages/2026-to-2027/"
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
RUK = {"level": "region", "code": "GB-EWN", "name": "England, Wales and Northern Ireland"}
SCO = {"level": "region", "code": "S92000003", "name": "Scotland"}
Y = "2026-27"


def row(item, geo, value, unit, measure, note, src):
    return {"item": item, "geo": geo, "value": value, "unit": unit, "year": Y, "measure": measure, "note": note, "source": src}


rows = [
    row("capital_gains_tax_rate", GB, 18, "%", "Capital Gains Tax, gains within the basic rate band (basic rate taxpayers)",
        "gains made from 6 April 2026; a basic rate taxpayer pays 18% on the part of the taxable gain that, added to taxable income, "
        "falls within the basic rate band (GBP 37,700 for 2026-27) and 24% above it; the whole UK, Scotland included", CGT),
    row("capital_gains_tax_rate", GB, 24, "%", "Capital Gains Tax, higher and additional rate taxpayers (and gains above the basic rate band)",
        "gains made from 6 April 2026; the whole UK, Scotland included (Scotland's own income tax bands do not apply to gains)", CGT),
    row("capital_gains_tax_rate", GB, 18, "%", "Capital Gains Tax with Business Asset Disposal Relief (selling all or part of a business)",
        "qualifying assets disposed of from 6 April 2026 (14% from 6 April 2025 to 5 April 2026, 10% on or before 5 April 2025); "
        "for a sole trader or partner who has owned the business for at least 2 years, or qualifying shares", BADR),
    row("capital_gains_tax_allowance", GB, 3000, "GBP a year", "Capital Gains Tax tax-free allowance (Annual Exempt Amount), individuals",
        "gains above it are taxed; GBP 1,500 for trusts", CGT_A),
    row("income_tax_rate", RUK, 0, "%", "Personal Allowance, taxable income up to GBP 12,570",
        "the standard Personal Allowance; it goes down by GBP 1 for every GBP 2 of adjusted net income above GBP 100,000, and is zero from GBP 125,140", IT),
    row("income_tax_rate", RUK, 20, "%", "Basic rate, taxable income GBP 12,571 to 50,270", "with the standard Personal Allowance of GBP 12,570", IT),
    row("income_tax_rate", RUK, 40, "%", "Higher rate, GBP 50,271 to 125,140", "with the standard Personal Allowance of GBP 12,570", IT),
    row("income_tax_rate", RUK, 45, "%", "Additional rate, over GBP 125,140", "no Personal Allowance on taxable income over GBP 125,140", IT),
]
sco_note = ("Scottish Income Tax, paid by those who live in Scotland on wages, pensions and most other taxable income (dividends "
            "and savings interest are taxed as in the rest of the UK); with the standard Personal Allowance of GBP 12,570; "
            "the same bands and rates on the Scottish Government's factsheet (" + SG + "), which still calls them the proposed "
            "bands of the Scottish Budget of 13 January 2026")
for v, m in [(0, "Personal Allowance, taxable income up to GBP 12,570"), (19, "Starter rate, GBP 12,571 to 16,537"),
             (20, "Basic rate, GBP 16,538 to 29,526"), (21, "Intermediate rate, GBP 29,527 to 43,662"),
             (42, "Higher rate, GBP 43,663 to 75,000"), (45, "Advanced rate, GBP 75,001 to 125,140"), (48, "Top rate, over GBP 125,140")]:
    rows.append(row("income_tax_rate", SCO, v, "%", m, sco_note, SIT))

d = {"id": "rules-uk3-tax-rates-2026-27",
     "source": {"publisher": "HM Revenue & Customs (GOV.UK); Scotland confirmed by the Scottish Government", "title":
                "Capital Gains Tax rates and allowances, Business Asset Disposal Relief, Income Tax rates and Personal Allowances, Income Tax in Scotland, tax year 2026 to 2027",
                "url": IT["url"], "licence": "Open Government Licence v3.0"},
     "retrieved": "2026-10-20", "rows": rows}
with open(sys.argv[1], "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
print(len(rows), "rows")
