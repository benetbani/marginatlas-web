"""OECD Corporate Tax Statistics: statutory corporate income tax rates, every jurisdiction the dataflow covers, newest year.

Pull: https://sdmx.oecd.org/public/rest/data/OECD.CTP.TPS,DSD_TAX_CIT@DF_CIT,2.0/all?startPeriod=2024&format=csvfilewithlabels
      -> DL/oecd_cit.csv
"""
import csv, json
from lib import DL, RETRIEVED, COUNTRIES, write

URL = "https://sdmx.oecd.org/public/rest/data/OECD.CTP.TPS,DSD_TAX_CIT@DF_CIT,2.0/all?startPeriod=2024&format=csvfilewithlabels"
iso2_of = {c["id"]: c["iso2Code"] for c in json.load(open(f"{DL}/wb_countries.json"))[1]}
iso2_of.update({"GGY": "GG", "COK": "CK", "MSR": "MS", "JEY": "JE", "AIA": "AI"})

# (measure, targeting) -> (item, words)
WANT = {
    ("CIT_C", "ST"): ("cit_rate_combined", "combined corporate income tax rate (central and sub-central government), statutory"),
    ("CIT", "ST"): ("cit_rate_central", "corporate income tax rate, central government, statutory"),
    ("CIT_C", "TA"): ("cit_rate_small_business", "combined corporate income tax rate targeted at small business"),
}
latest = {}
for r in csv.DictReader(open(f"{DL}/oecd_cit.csv", encoding="utf-8")):
    k = (r["MEASURE"], r["TARGETING"])
    if k not in WANT or r["OBS_VALUE"] == "":
        continue
    key = (r["REF_AREA"], k)
    if key not in latest or r["TIME_PERIOD"] > latest[key]["TIME_PERIOD"]:
        latest[key] = r

out = []
for (area, k), r in sorted(latest.items(), key=lambda x: (x[0][0], list(WANT).index(x[0][1]))):
    item, words = WANT[k]
    iso2 = iso2_of[area]
    name = COUNTRIES[iso2][1] if iso2 in COUNTRIES else r["Reference area"]
    row = {
        "item": item,
        "geo": {"level": "country", "code": iso2, "name": name},
        "value": round(float(r["OBS_VALUE"]), 2),
        "unit": "% of taxable income",
        "year": r["TIME_PERIOD"],
        "measure": words,
    }
    notes = []
    if r["OBS_STATUS"] != "A":
        notes.append(f"OECD observation status: {r['Observation status']}.")
    if k == ("CIT_C", "TA"):
        notes.append("The rate a small business pays where the jurisdiction targets one; the eligibility rule is the jurisdiction's own.")
    if notes:
        row["note"] = " ".join(notes)
    out.append(row)

cat = {r["geo"]["code"] for r in out if r["item"] == "cit_rate_combined"} & set(COUNTRIES)
print("jurisdictions:", len({r['geo']['code'] for r in out}), "catalog countries:", len(cat), "missing:", " ".join(sorted(set(COUNTRIES) - cat)))
write("oecd-corporate-tax-rates.json", {
    "id": "oecd-corporate-tax-rates",
    "source": {
        "publisher": "OECD (Corporate Tax Statistics)",
        "title": "Corporate income tax (CIT): statutory and targeted small business rates",
        "url": URL,
        "table": "DSD_TAX_CIT@DF_CIT 2.0: CIT_C (combined), CIT (central government), targeting ST (statutory) and TA (small business)",
        "licence": "OECD open by default policy (CC BY 4.0 default from 1 July 2024; earlier content under the OECD terms, free reuse on terms similar to CC BY 4.0), https://www.oecd.org/en/about/oecd-open-by-default-policy.html (the data terms page refuses scripted requests)",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
