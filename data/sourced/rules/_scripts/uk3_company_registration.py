"""uk3: llc_registration_cost, the registry's fee for a private limited company registered online, as GOV.UK's "Set up a private
limited company: Register your company" states it (read 2026-10-20, saved under /srv/atlas/runs/data-uk3/dl/).
Usage: python3 -I uk3_company_registration.py OUT_JSON
"""
import json, sys

URL = "https://www.gov.uk/limited-company-formation/register-your-company"
d = {"id": "rules-uk3-company-registration-2026",
     "source": {"publisher": "Companies House (GOV.UK)", "title": "Set up a private limited company: Register your company",
                "url": URL, "licence": "Open Government Licence v3.0"},
     "retrieved": "2026-10-20",
     "rows": [{"item": "llc_registration_cost", "geo": {"level": "country", "code": "GB", "name": "United Kingdom"},
               "value": 100, "unit": "GBP", "year": "2026",
               "measure": "Companies House fee to register a private limited company online",
               "note": ("the page: 'It costs £100 and can be paid by debit or credit card. Your company is usually registered within "
                        "24 hours'; the private limited company is the UK's nearest form to an LLC; registering by post or through "
                        "an agent or software costs differently; one register for England and Wales, Scotland and Northern Ireland")}]}
with open(sys.argv[1], "w", encoding="utf-8") as f:
    json.dump(d, f, indent=2, ensure_ascii=False); f.write("\n")
