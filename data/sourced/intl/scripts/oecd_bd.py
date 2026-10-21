"""OECD employer business demography, enterprise survival (ISIC Rev. 4), for the catalog's OECD members and partners
outside Eurostat's business demography.

Input: /srv/atlas/runs/data-intl/dl/surv_DF_BD_EMP_S.csv, pulled with
  https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_SDBSBD_ISIC4@DF_BD_EMP_S,1.0/
  A.JPN+KOR+CAN+AUS+NZL+MEX+ISR+CHL+COL+CRI+BRA+IND+CHN+IDN+ZAF+ARG.ENT.._T....?startPeriod=2010
Unit PT_ENT_B (percentage of enterprise births): survivors of a cohort of employer-enterprise births, as a share of it.
TIME_PERIOD is the year the survivors are counted (Korea's total runs 2011 at one year to 2015 at five: one cohort).
Mexico and Costa Rica publish no survival rate (only counts of employer enterprises by age, which exceed the births of
the matching cohort, so they are not cohort survivors): nothing is written for them.
"""
import csv, collections
from lib import write, DL, RETRIEVED

COUNTRIES = {"KOR": ("KR", "Korea"), "NZL": ("NZ", "New Zealand"), "ISR": ("IL", "Israel"), "CAN": ("CA", "Canada"),
             "BRA": ("BR", "Brazil"), "COL": ("CO", "Colombia")}
SCOPE = {
    "I56": "Whole division 56 (food and beverage service): the figure covers restaurants, catering and bars together.",
    "I": "Whole section I (accommodation and food service): the figure covers hotels as well as restaurants and bars.",
    "S960": "ISIC group 960, all other personal service activities (laundry, funeral, hairdressing and beauty, other).",
    "S": "Whole section S (other service activities: membership organisations, repair of personal goods and all other personal services, hairdressing among them).",
}
TRADES = {
    "restaurants": [["I5610", "I561"], ["I56"], ["I"]],
    "cafes": [["I5630", "I563"], ["I56"], ["I"]],
    "barbershops": [["S9602"], ["S960", "S96"], ["S"]],
    "all": [["BTSXO_S94", "BTN", "BTNXK", "_T"]],
}
STATUS = {"I": "value imputed by the OECD (a receiving agency)", "E": "estimated value", "P": "provisional value", "B": "break in time series"}

data = collections.defaultdict(dict)  # (area, act, age) -> {year: (v, status)}
LABEL = {}
for r in csv.DictReader(open(f"{DL}/surv_DF_BD_EMP_S.csv", encoding="utf-8")):
    a = r["REF_AREA: Reference area"][:3]
    if a not in COUNTRIES or r["OBS_VALUE"] == "" or not r["UNIT_MEASURE: Unit of measure"].startswith("PT_ENT_B:"):
        continue
    if not r["ENT_TYPE: Enterprise type"].startswith("ENT_EMP:") or not r["BUSINESS_STAGE: Business stage"].startswith("ACTIVE:"):
        continue
    act, lab = r["ACTIVITY: Economic activity"].split(": ", 1)
    LABEL[act] = lab
    age = r["AGE: Enterprise age"].split(":")[0]
    if age not in ("Y1", "Y2", "Y3", "Y4", "Y5"):
        continue
    data[(a, act, age)][r["TIME_PERIOD: Time period"]] = (float(r["OBS_VALUE"]), r["OBS_STATUS: Observation status"].split(":")[0])

rows = []
for a, (iso, name) in COUNTRIES.items():
    for trade, tiers in TRADES.items():
        for age in ("Y1", "Y2", "Y3", "Y4", "Y5"):
            if age == "Y4":
                continue  # the contract's items are 1, 2, 3 and 5 years
            for tier in tiers:
                best = None
                for act in tier:
                    d = data.get((a, act, age))
                    if d:
                        y = max(d)
                        if best is None or y > best[0]:
                            best = (y, act, d[y])
                if best:
                    y, act, (v, st) = best
                    n = int(age[1])
                    note = [f"Employer enterprises born in {int(y) - n} still active in {y}, as a share of employer-enterprise births in {int(y) - n}."]
                    if act in SCOPE:
                        note.append(SCOPE[act])
                    if st in STATUS:
                        note.append(f"OECD observation status: {STATUS[st]}.")
                    code = act[1:] if act[1:].isdigit() else act
                    rows.append({"item": f"survival_{n}y", "trade": trade, "officialClass": f"ISIC Rev. 4 {code}: {LABEL[act]}",
                                 "geo": {"level": "country", "code": iso, "name": name}, "value": round(v, 1),
                                 "unit": "percent of employer enterprises born", "year": y,
                                 "measure": f"{n}-year survival rate of employer enterprises (reference year {y}, cohort born {int(y) - n})",
                                 "note": " ".join(note)})
                    break

write("oecd-business-demography.json", {
    "id": "oecd-business-demography",
    "source": {
        "publisher": "OECD",
        "title": "Employer business demography: enterprise survival (ISIC Rev. 4), Structural and Demographic Business Statistics (SDBS)",
        "url": "https://data-explorer.oecd.org/vis?df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_SDBSBD_ISIC4%40DF_BD_EMP_S&df[ag]=OECD.SDD.TPS",
        "table": "DSD_SDBSBD_ISIC4@DF_BD_EMP_S v1.0, unit PT_ENT_B (percentage of enterprise births), size class total, employer enterprises; API https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_SDBSBD_ISIC4@DF_BD_EMP_S,1.0/",
        "licence": "OECD terms and conditions: OECD data are free to reuse with attribution (CC BY 4.0), https://www.oecd.org/en/about/terms-conditions.html",
    },
    "retrieved": RETRIEVED,
    "rows": rows,
})
