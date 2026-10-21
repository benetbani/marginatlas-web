import sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
DL = "/srv/atlas/runs/data-business/dl/"
EURO = set("AT BE CY DE EE EL ES FI FR IE IT LT LU LV MT NL PT SI SK HR".split())
CUR = {"BG": "BGN", "CZ": "CZK", "DK": "DKK", "HU": "HUF", "PL": "PLN", "RO": "RON", "SE": "SEK", "IS": "ISK", "NO": "NOK",
       "CH": "CHF", "BA": "BAM", "MK": "MKD", "AL": "ALL", "RS": "RSD"}
TR = {"I": ["restaurants", "cafes"], "S": ["barbershops"], "B-S_X_O": ["all"]}
lab, upd = labels_of(DL + "ses22.json")
rows = []
def add(d, v, s, unit, cur_note):
    for t in TR[d["nace_r2"]]:
        occ = lab["isco08"][d["isco08"]]
        note = [f"Sector-wide: NACE Rev. 2 {d['nace_r2']} ({lab['nace_r2'][d['nace_r2']]}), not one trade.",
                "Enterprises with 10 or more employees only; employees only.", cur_note]
        fn = flagnote(s)
        if fn: note.append(fn)
        rows.append({"item": "pay_hourly", "trade": t,
                     "officialClass": f"ISCO-08 {d['isco08']}: {occ}; NACE Rev. 2 {d['nace_r2']}: {lab['nace_r2'][d['nace_r2']]}",
                     "geo": geo_eu(d["geo"], lab["geo"][d["geo"]]), "value": v, "unit": unit, "year": "2022",
                     "measure": f"mean gross hourly earnings, October 2022, enterprises with 10+ employees: {occ.lower() if d['isco08'] != 'TOTAL' else 'all occupations'}",
                     "note": " ".join(x for x in note if x)})
for d, v, s, _ in jsonstat(DL + "ses22.json"):
    if d["sizeclas"] != "GE10" or d["geo"] in EURO or d["geo"].startswith(("EU", "EA")):
        continue
    add(d, v, s, f"{CUR[d['geo']]} per hour", "National currency, as published.")
for d, v, s, _ in jsonstat(DL + "ses22_eur.json"):
    if not (d["geo"] in EURO or d["geo"].startswith(("EU", "EA"))):
        continue
    add(d, v, s, "EUR per hour", "Croatia joined the euro in 2023; Eurostat publishes its 2022 figures in euro." if d["geo"] == "HR" else "")
write("eurostat-ses-2022.json", {
    "id": "eurostat-ses-2022",
    "source": {"publisher": "Eurostat", "title": "Structure of Earnings Survey 2022: mean hourly earnings by sex, occupation and economic activity (earn_ses22_47)",
               "url": "https://ec.europa.eu/eurostat/databrowser/view/earn_ses22_47/default/table",
               "table": f"earn_ses22_47, sex total, gross earnings, size class 10 employees or more, ISCO-08 TOTAL/OC1/OC5/OC9, NACE I, S and B-S_X_O; national currency for non-euro countries, EUR for euro-area members and aggregates; updated {upd[:10]}",
               "licence": "Eurostat copyright notice: free reuse with acknowledgement of the source (Commission Decision 2011/833/EU), https://ec.europa.eu/eurostat/help/copyright-notice"},
    "retrieved": RETRIEVED, "rows": rows})
for r in rows:
    if r["geo"]["code"] in ("IT", "HU") and r["trade"] in ("restaurants", "all"): print(r["geo"]["code"], r["trade"], r["officialClass"][:30], r["value"], r["unit"])
