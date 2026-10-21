"""European Commission, Taxes in Europe Database (TEDB) VAT retrieval service: the standard rate and the rate on restaurant and
catering services of every EU member, the situation on 2026-10-19 (each rate says the date it is in force from).

Pull: SOAP POST https://ec.europa.eu/taxation_customs/tedb/ws/VatRetrievalService (WSDL VatRetrievalService.wsdl), all 27
      members, situationOn 2026-10-19 -> DL/tedb_2026-10-19.xml
"""
import re
import xml.etree.ElementTree as ET
from lib import DL, RETRIEVED, COUNTRIES, write

URL = "https://ec.europa.eu/taxation_customs/tedb/ws/VatRetrievalService.wsdl"
NS = "{urn:ec.europa.eu:taxud:tedb:services:v1:IVatRetrievalService:types}"
NAMES = {"LU": "Luxembourg"}
root = ET.parse(f"{DL}/tedb_2026-10-19.xml").getroot()


def clean(s):
    s = re.sub(r"<[^>]+>", "", s or "").replace("&nbsp;", " ")
    return re.sub(r"\s+", " ", s).strip()


def num(v):
    v = float(v)
    return int(v) if v == int(v) else v


out = []
for r in root.iter(NS + "vatRateResults"):
    ms = r.findtext(NS + "memberState")
    iso2 = "GR" if ms == "EL" else ms
    g = {"level": "country", "code": iso2, "name": COUNTRIES[iso2][1] if iso2 in COUNTRIES else NAMES[iso2]}
    rate = r.find(NS + "rate")
    since = r.findtext(NS + "situationOn")[:10]
    comment = clean(r.findtext(NS + "comment"))
    cat = r.find(NS + "category")
    if r.findtext(NS + "type") == "STANDARD":
        if comment.startswith("VAT - "):  # an import or regional line (DE import, ES Canary Islands): not the country's rate
            continue
        row = {"item": "vat_rate_standard", "geo": g, "value": num(rate.findtext(NS + "value")), "unit": "%", "year": since,
               "measure": "standard VAT rate, in force on 2026-10-19 (the year is the date the database gives the rate from)"}
        if comment:
            row["note"] = comment
        out.append(row)
    elif cat is not None and cat.findtext(NS + "identifier") in ("RESTAURANT", "FOOD_SERVICE"):
        row = {"item": "vat_rate_restaurant", "geo": g, "value": num(rate.findtext(NS + "value")), "unit": "%", "year": since,
               "officialClass": clean(cat.findtext(NS + "description")),
               "measure": f"VAT rate on restaurant and catering services ({rate.findtext(NS + 'type').lower().replace('_', ' ')}), "
                          "in force on 2026-10-19"}
        if comment:
            row["note"] = comment
        out.append(row)

std = {r["geo"]["code"] for r in out if r["item"] == "vat_rate_standard"}
rest = {r["geo"]["code"] for r in out if r["item"] == "vat_rate_restaurant"}
assert len(std) == 27, sorted(std)
print("standard:", len(std), "restaurant:", len(rest), "no restaurant line:", " ".join(sorted(std - rest)))
write("eu-tedb-vat-rates.json", {
    "id": "eu-tedb-vat-rates",
    "source": {
        "publisher": "European Commission (Directorate-General for Taxation and Customs Union)",
        "title": "Taxes in Europe Database (TEDB), VAT rates retrieval service, situation on 19 October 2026",
        "url": URL,
        "table": "retrieveVatRates, all 27 member states, situationOn 2026-10-19: type STANDARD, and REDUCED rows of categories "
                 "RESTAURANT and FOOD_SERVICE",
        "licence": "European Commission reuse policy (Decision 2011/833/EU): reuse allowed with acknowledgement of the source, "
                   "https://commission.europa.eu/legal-notice_en",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
