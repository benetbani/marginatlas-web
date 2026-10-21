"""OECD Consumption Tax Trends 2024, Annex Table 2.A.1 VAT rates (position as at 1 September 2023): standard and reduced rates.

Pull: https://www.oecd.org/content/dam/oecd/en/topics/policy-sub-issues/consumption-tax-trends/vat-gst-rates-ctt-trends.xlsx
      -> DL/oecd_vat_rates.xlsx (a browser User-Agent is needed)
"""
import re
from lib import DL, RETRIEVED, COUNTRIES, write, xlsx_rows

URL = "https://www.oecd.org/content/dam/oecd/en/topics/policy-sub-issues/consumption-tax-trends/vat-gst-rates-ctt-trends.xlsx"
NAMES = {"Australia": "AU", "Austria": "AT", "Belgium": "BE", "Canada": "CA", "Chile": "CL", "Colombia": "CO", "Costa Rica": "CR",
         "Czech Republic": "CZ", "Denmark": "DK", "Estonia": "EE", "Finland": "FI", "France": "FR", "Germany": "DE", "Greece": "GR",
         "Hungary": "HU", "Iceland": "IS", "Ireland": "IE", "Israel": "IL", "Italy": "IT", "Japan": "JP", "Korea": "KR", "Latvia": "LV",
         "Lithuania": "LT", "Luxembourg": "LU", "Mexico": "MX", "Netherlands": "NL", "New Zealand": "NZ", "Norway": "NO", "Poland": "PL",
         "Portugal": "PT", "Slovak Republic": "SK", "Slovenia": "SI", "Spain": "ES", "Sweden": "SE", "Switzerland": "CH",
         "Türkiye": "TR", "United Kingdom": "GB"}
rows = xlsx_rows(f"{DL}/oecd_vat_rates.xlsx")
head = rows[1]
assert head["U"] == "2023" and head["X"] == "Reduced rates1" and head["Y"] == "Regional rates", head
notes = {}
for r in rows:
    a = r.get("A", "")
    m = re.match(r"([A-Z][A-Za-zü ]+?)\*?\.\s*(.+)", a)
    if m and m.group(1).strip() in NAMES and len(r) == 1:
        notes[NAMES[m.group(1).strip()]] = m.group(2).strip()

def num(s):
    s = s.strip()
    return float(s) if s not in ("", "-") else None

def fmt(v):
    return int(v) if v == int(v) else round(v, 2)

out = []
for r in rows[2:]:
    name = r.get("A", "").rstrip("*").strip()
    if name not in NAMES:
        continue
    iso2 = NAMES[name]
    g = {"level": "country", "code": iso2, "name": COUNTRIES[iso2][1] if iso2 in COUNTRIES else name}
    note = notes.get(iso2)
    std = num(r["U"])
    row = {"item": "vat_rate_standard", "geo": g, "value": fmt(std), "unit": "%", "year": "2023-09-01",
           "measure": "standard VAT/GST rate, as at 1 September 2023"}
    extra = []
    if r.get("Y", "-").strip() not in ("-", ""):
        extra.append(f"Regional rates: {r['Y'].strip()}.")
    if note:
        extra.append(f"OECD country note: {note}")
    if extra:
        row["note"] = " ".join(extra)
    out.append(row)
    red = r.get("X", "-").strip()
    if red not in ("-", ""):
        for p in red.split("/"):
            out.append({"item": "vat_rate_reduced", "geo": g, "value": fmt(float(p)), "unit": "%", "year": "2023-09-01",
                        "measure": "a reduced VAT/GST rate (zero rates on domestic supplies included), as at 1 September 2023",
                        "note": f"The table lists the reduced rates {red} together; what each applies to is the country's own law."})
cat = sorted({r["geo"]["code"] for r in out} & set(COUNTRIES))
print("countries:", len({r['geo']['code'] for r in out}), "catalog:", len(cat))
write("oecd-vat-rates.json", {
    "id": "oecd-vat-rates",
    "source": {
        "publisher": "OECD (Consumption Tax Trends 2024)",
        "title": "Annex Table 2.A.1. VAT rates (source: national delegates, position as at 1 September 2023)",
        "url": URL,
        "table": "Column 2023 (standard rate as at 1 September 2023), Reduced rates, Regional rates, Country notes",
        "licence": "OECD open by default policy (CC BY 4.0 default from 1 July 2024), https://www.oecd.org/en/about/oecd-open-by-default-policy.html",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
