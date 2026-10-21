"""World Bank Worldwide Governance Indicators, the 2026 update (data year 2025): four scores on the revised 0 to 100 scale.

The 2025 methodology revision replaced the old percentile ranks with an absolute score between a notional best and worst case
(The Worldwide Governance Indicators 2025 Methodology Revision, comparison table); percentile ranks are no longer published.
So each row carries the official score, and a placement worked out here from the published scores of every economy that has one
(`lower_n` of `of_n` economies score lower). The placement is arithmetic on the official figures, said as such on any page.

Pull, for each code in CODES:
  https://api.worldbank.org/v2/country/all/indicator/GOV_WGI_<code>.SC?source=3&format=json&per_page=20000&date=2025
    -> DL/wgi_<code>.json   (the sha256 of each pull is printed and kept in the file's source block)
"""
import hashlib, json
from lib import DL, COUNTRIES, ISO3, geo, write

RETRIEVED = "2026-10-21"
CODES = {
    "CC": ("governance_control_of_corruption", "Control of Corruption: how far public power is used for private gain, petty and grand corruption alike"),
    "GE": ("governance_government_effectiveness", "Government Effectiveness: the quality of public services and of the civil service, and how far it is independent of political pressure"),
    "RQ": ("governance_regulatory_quality", "Regulatory Quality: how far the government makes and applies sound rules that let private business grow"),
    "RL": ("governance_rule_of_law", "Rule of Law: how far people trust and keep the rules, in particular contracts, property rights, the police and the courts"),
}
URL = "https://api.worldbank.org/v2/country/all/indicator/GOV_WGI_{c}.SC?source=3&format=json&per_page=20000&date=2025"
out, sums = [], {}
for code, (item, measure) in CODES.items():
    path = f"{DL}/wgi_{code}.json"
    raw = open(path, "rb").read()
    sums[code] = hashlib.sha256(raw).hexdigest()
    data = [r for r in json.loads(raw)[1] if r["value"] is not None and r["date"] == "2025"]
    # every economy the publisher scores for 2025 (the set has no regional aggregates; 8 economies carry no ISO code in the API,
    # Kosovo and territories among them, and still count in the placement); only catalog countries get a row
    economies = data
    of_n = len(economies)
    for r in sorted(economies, key=lambda r: r["countryiso3code"] or ""):
        iso2 = ISO3.get(r["countryiso3code"])
        if not iso2:
            continue
        v = r["value"]
        lower = sum(1 for e in economies if e["value"] < v)
        out.append({
            "item": item,
            "geo": geo(iso2),
            "value": round(v, 1),
            "unit": "score from 0 to 100",
            "year": "2025",
            "measure": measure,
            "lower_n": lower,
            "of_n": of_n,
            "note": f"The official score (0 the notional worst case, 100 the best). lower_n is worked out here: the economies, of the {of_n} "
                    "the publisher scores for 2025, whose score is lower. The publisher no longer prints a rank.",
        })
    print(code, "economies scored:", of_n, "catalog rows:", sum(1 for r in out if r["item"] == item))
gb = {r["item"]: (r["value"], r["lower_n"], r["of_n"]) for r in out if r["geo"]["code"] == "GB"}
print("GB:", gb)
write("wb-wgi-2025.json", {
    "id": "wb-wgi-2025",
    "source": {
        "publisher": "World Bank, Worldwide Governance Indicators",
        "title": "Worldwide Governance Indicators, 2026 update (data for 2025), scores GOV_WGI_CC.SC, GE.SC, RQ.SC, RL.SC",
        "url": URL.replace("{c}", "<code>"),
        "table": "The four scores on the 0 to 100 scale of the 2025 methodology revision, data year 2025",
        "licence": "World Bank data: Creative Commons Attribution 4.0 (CC BY 4.0), https://www.worldbank.org/en/publication/worldwide-governance-indicators",
        "sha256": sums,
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
