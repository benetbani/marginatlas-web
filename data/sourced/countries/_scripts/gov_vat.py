"""VAT, GST or sales tax standard rates read on the tax authority's own page, for catalog countries outside the OECD's and the
EU's tables. Each row carries the sentence read; the script fails if that sentence is not in the saved page's text.

Pulls: /srv/atlas/runs/data-countries/fetch.py NAME URL -> DL/gov/NAME.raw and NAME.txt (the page's text)
"""
from lib import DL, RETRIEVED, geo, write

PAGES = [
    ("ZA", "za-vat", 15, "2026", "standard VAT rate",
     "VAT is levied at the standard rate of 15% on the supply of goods and services by registered vendors.",
     "South African Revenue Service", "Value-Added Tax", "https://www.sars.gov.za/types-of-tax/value-added-tax/",
     "The page also records that the rises to 15.5% (1 May 2025) and 16% (1 April 2026) proposed in the March 2025 budget were withdrawn: the rate stays 15%."),
    ("TH", "th-vat", 7, "2026", "VAT, general rate",
     "4.1 General Rate Currently, the rate is 7 percent.",
     "The Revenue Department (Thailand)", "Value Added Tax", "https://www.rd.go.th/english/6043.html", None),
    ("SG", "sg-gst", 9, "2026", "GST, the prevailing rate",
     "The current GST rate in Singapore is 9%.",
     "Inland Revenue Authority of Singapore", "Current GST rates", "https://www.iras.gov.sg/taxes/goods-services-tax-(gst)/basics-of-gst/current-gst-rates",
     "The page's history of rates ends with 8% from 1 Jan 2023 to 31 Dec 2023; it does not print the 9% rate's start date."),
    ("PK", "pk-st", 18, "2023-02", "sales tax, standard rate (Sales Tax Act 1990, section 3)",
     "the standa rate of sales tax has been increased from 17% to 18%",
     "Federal Board of Revenue (Pakistan)", "Circular No. 01 of 2023-24 (Sales Tax and Federal Excise): Finance (Supplementary) Act, 2023",
     "https://download1.fbr.gov.pk/Docs/20232281524459451Circular01-2023SalesTaxFederalExcise.pdf",
     "Read in the FBR's 2023 circular (the quote keeps the PDF's own typo 'standa'); a later change would be in a later Finance Act."),
]
out = []
for iso2, page, v, year, measure, quote, pub, title, url, note in PAGES:
    text = open(f"{DL}/gov/{page}.txt", encoding="utf-8").read()
    assert quote in text, (iso2, quote)
    if iso2 == "SG":
        assert "1 Jan 2023 to 31 Dec 2023 8%" in text
    row = {"item": "vat_rate_standard", "geo": geo(iso2), "value": v, "unit": "%", "year": year, "measure": measure,
           "note": f'The page reads: "{quote}"' + (f" {note}" if note else ""),
           "source": {"publisher": pub, "title": title, "url": url}}
    out.append(row)
write("vat-government-pages.json", {
    "id": "vat-government-pages",
    "source": {"publisher": "Each row's own tax authority (see the row's source)",
               "title": "VAT, GST or sales tax standard rate, read on the tax authority's own page",
               "url": "https://www.sars.gov.za/types-of-tax/value-added-tax/"},
    "retrieved": RETRIEVED,
    "rows": out,
})
