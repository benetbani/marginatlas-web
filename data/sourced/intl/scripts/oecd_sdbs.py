"""OECD SDBS (ISIC Rev. 4) for the catalog's OECD members outside Eurostat's SBS, the UK and the US.

Input: /srv/atlas/runs/data-intl/dl/sdbs.csv, pulled with
  https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_SDBSBSC_ISIC4@DF_SDBS_ISIC4,1.0/
  A..ENTR+TUTT+EMPN+EMPE+GOPS+INGS+REMN+REME+WASE+ESTB+VALU+VAFC+PROD.I56+I561+I5610+I563+I5630+S96+S960+S9602+BTSXO_S94+BTNXK+BTN+_T._T.?startPeriod=2015
and sdbs_size.csv (ENTR+ESTB by size class) for the size-class shares.
"""
import csv, collections
from lib import write, rnd, DL, RETRIEVED

COUNTRIES = {  # OECD code: (ISO2, name, currency)
    "KOR": ("KR", "Korea", "KRW"),
    "NZL": ("NZ", "New Zealand", "NZD"),
    "TUR": ("TR", "Türkiye", "TRY"),
    "ISR": ("IL", "Israel", "ILS"),
    "CRI": ("CR", "Costa Rica", "CRC"),
    "CHL": ("CL", "Chile", "CLP"),
    "COL": ("CO", "Colombia", "COP"),
    "JPN": ("JP", "Japan", "JPY"),
    "CAN": ("CA", "Canada", "CAD"),
}
# Survey coverage: the published enterprise count is not the whole trade, so no count and no mean per enterprise.
PARTIAL = {
    "CHL": "Chile's figures in this dataset cover only the enterprises its survey reports (107 restaurant enterprises with 161,991 persons employed in 2018), not the whole trade, so no count and no mean per enterprise is written.",
    "COL": "Colombia's figures in this dataset come from its annual services survey, which covers larger firms only (350 restaurant enterprises with 64,200 persons employed in 2016, 183 persons each), so no count and no mean per enterprise is written.",
}
STATUS = {"I": "value imputed by the OECD (a receiving agency)", "E": "estimated value", "D": "definition differs", "P": "provisional value", "B": "break in time series"}
LABEL = {}
# trade -> tiers of candidates (activity code, scope note or None when the code is the trade's own class).
# Within a tier the activities are the same activity (or, for "all", alternative totals): the latest year wins.
# A finer tier always wins over a coarser one, item by item.
TRADES = {
    "restaurants": [[("I5610", None), ("I561", "ISIC group 561 has one class, 5610: the same activity.")],
                    [("I56", "Whole division 56 (food and beverage service): this country publishes no figure for class 5610 alone.")]],
    "cafes": [[("I5630", None), ("I563", "ISIC group 563 has one class, 5630: the same activity.")],
              [("I56", "Whole division 56 (food and beverage service): this country publishes no figure for class 5630 alone.")]],
    "barbershops": [[("S9602", None)],
                    [("S960", "ISIC group 960, all other personal service activities (laundry, funeral, hairdressing and beauty, other): hairdressing cannot be split out in this country's figures."),
                     ("S96", "ISIC division 96, all other personal service activities (laundry, funeral, hairdressing and beauty, other): hairdressing cannot be split out in this country's figures.")]],
    "all": [[("BTSXO_S94", None), ("BTN", None), ("BTNXK", None), ("_T", None)]],
}

data = collections.defaultdict(dict)  # (area, act) -> {(measure, year): (value, status)}
for r in csv.DictReader(open(f"{DL}/sdbs.csv", encoding="utf-8")):
    a = r["REF_AREA: Reference area"].split(":")[0]
    if a not in COUNTRIES or r["OBS_VALUE"] == "":
        continue
    act, act_lab = r["ACTIVITY: Economic activity"].split(": ", 1)
    LABEL[act] = act_lab
    m = r["MEASURE: Measure"].split(":")[0]
    mult = int(r["UNIT_MULT: Unit multiplier"].split(":")[0] or 0)
    st = r["OBS_STATUS: Observation status"].split(":")[0]
    data[(a, act)][(m, r["TIME_PERIOD: Time period"])] = (float(r["OBS_VALUE"]) * 10 ** mult, st)

size = collections.defaultdict(dict)
SIZELAB = {}
try:
    for r in csv.DictReader(open(f"{DL}/sdbs_size.csv", encoding="utf-8")):
        a = r["REF_AREA: Reference area"].split(":")[0]
        if a not in COUNTRIES or r["OBS_VALUE"] == "":
            continue
        act = r["ACTIVITY: Economic activity"].split(":")[0]
        sc, sl = r["SIZE_CLASS: Size class"].split(": ", 1)
        SIZELAB[sc] = sl
        m = r["MEASURE: Measure"].split(":")[0]
        size[(a, act, m, r["TIME_PERIOD: Time period"])][sc] = float(r["OBS_VALUE"])
except FileNotFoundError:
    pass


def latest(d, *measures):
    """Latest year in which every named measure is published; returns (year, {m: (v, st)})."""
    years = [y for (m, y) in d if m == measures[0]]
    for y in sorted(years, reverse=True):
        if all((m, y) in d for m in measures):
            return y, {m: d[(m, y)] for m in measures}
    return None, None


def stnote(*sts):
    words = sorted({STATUS[s] for s in sts if s in STATUS})
    return ("OECD observation status: " + ", ".join(words) + ".") if words else None


def join(*parts):
    p = [x for x in parts if x]
    return " ".join(p) if p else None


def fmt(v):
    return f"{v:,.0f}"


def unit_of(d):
    for cm, cu in (("ENTR", "enterprises"), ("ESTB", "establishments")):
        if latest(d, cm)[0]:
            return cm, cu
    return None, None


def per(cu):
    return "enterprise" if cu == "enterprises" else "establishment"


def i_count(a, d, scope, cur):
    cm, cu = unit_of(d)
    if not cm:
        return None
    y, v = latest(d, cm)
    return dict(item="business_count", value=int(round(v[cm][0])), unit=cu, year=y, measure=f"number of {cu}", note=join(scope, stnote(v[cm][1])))


def i_sales(a, d, scope, cur):
    cm, cu = unit_of(d)
    y, v = latest(d, "TUTT", cm) if cm else (None, None)
    if not y:
        return None
    t, n = v["TUTT"][0], v[cm][0]
    return dict(item="sales_per_business", value=rnd(t / n), unit=cur, year=y,
                measure=f"mean turnover per {per(cu)} (turnover divided by the number of {cu}), derived from two published figures",
                note=join(scope, f"Turnover {fmt(t)} {cur} over {fmt(n)} {cu}.", stnote(v['TUTT'][1], v[cm][1])))


def i_persons(a, d, scope, cur):
    cm, cu = unit_of(d)
    y, v = latest(d, "EMPN", cm) if cm else (None, None)
    if not y:
        return None
    e, n = v["EMPN"][0], v[cm][0]
    if e < n:  # fewer persons employed than units: the two figures do not cover the same units
        SKIPPED.append(f"{a} {d is not None and ''}persons per business: {fmt(e)} persons over {fmt(n)} {cu} ({y}), below one, not written")
        return None
    return dict(item="persons_per_business", value=round(e / n, 1), unit=f"persons employed per {per(cu)}", year=y,
                measure=f"mean persons employed per {per(cu)}, owners and unpaid workers included, derived from two published figures",
                note=join(scope, f"{fmt(e)} persons employed over {fmt(n)} {cu}.", stnote(v['EMPN'][1], v[cm][1])))


def i_gor(a, d, scope, cur):
    y, v = latest(d, "GOPS", "TUTT")
    if y:
        g, t = v["GOPS"][0], v["TUTT"][0]
        return dict(item="gross_operating_rate", value=round(100 * g / t, 1), unit="percent of turnover", year=y,
                    measure="gross operating rate: gross operating surplus as a share of turnover, before the owner's own pay, depreciation, interest and tax",
                    note=join(scope, f"Gross operating surplus {fmt(g)} {cur} over turnover {fmt(t)} {cur}.", stnote(v['GOPS'][1], v['TUTT'][1])))
    for pc in ("REME", "REMN"):
        y, v = latest(d, "VAFC", pc, "TUTT")
        if y:
            va, p, t = v["VAFC"][0], v[pc][0], v["TUTT"][0]
            return dict(item="gross_operating_rate", value=round(100 * (va - p) / t, 1), unit="percent of turnover", year=y,
                        measure="gross operating rate, DERIVED: value added at factor cost minus remuneration, as a share of turnover (no operating surplus is published), before the owner's own pay, depreciation, interest and tax",
                        note=join(scope, f"Value added at factor cost {fmt(va)} {cur}, {'remuneration of employees' if pc == 'REME' else 'remuneration, total'} {fmt(p)} {cur}, turnover {fmt(t)} {cur}.", stnote(v['VAFC'][1], v[pc][1], v['TUTT'][1])))
    return None


def i_staff(a, d, scope, cur):
    for pc, words in (("REME", "remuneration of employees"), ("REMN", "remuneration, total")):
        y, v = latest(d, pc, "TUTT")
        if y:
            p, t = v[pc][0], v["TUTT"][0]
            return dict(item="staff_cost_share", value=round(100 * p / t, 1), unit="percent of turnover", year=y,
                        measure=f"staff costs ({words}, the OECD's measure: wages, salaries and employer social contributions) divided by turnover",
                        note=join(scope, f"{fmt(p)} {cur} over turnover {fmt(t)} {cur}.", stnote(v[pc][1], v['TUTT'][1])))
    return None


def i_purch(a, d, scope, cur):
    y, v = latest(d, "INGS", "TUTT")
    if not y:
        return None
    p, t = v["INGS"][0], v["TUTT"][0]
    return dict(item="purchases_share", value=round(100 * p / t, 1), unit="percent of turnover", year=y,
                measure="total purchases of goods and services divided by turnover",
                note=join(scope, f"{fmt(p)} {cur} over turnover {fmt(t)} {cur}.", stnote(v['INGS'][1], v['TUTT'][1])))


def i_size(a, act, d, scope):
    cm, cu = unit_of(d)
    if not cm:
        return []
    ys = sorted({k[3] for k in size if k[0] == a and k[1] == act and k[2] == cm}, reverse=True)
    for y in ys:
        sc = size[(a, act, cm, y)]
        if not sc.get("_T"):
            continue
        return [dict(item="size_class_share", value=round(100 * n / sc["_T"], 1), unit=f"percent of {cu}", year=y,
                     measure=f"share of {cu} with {SIZELAB[band].lower().replace('from ', '')} persons employed",
                     note=join(scope, f"{fmt(n)} of {fmt(sc['_T'])} {cu}."))
                for band, n in sc.items() if band != "_T"]
    return []


SKIPPED = []
ITEMS = [i_count, i_sales, i_persons, i_gor, i_staff, i_purch]
rows = []
for a, (iso, name, cur) in COUNTRIES.items():
    geo = {"level": "country", "code": iso, "name": name}
    for trade, tiers in TRADES.items():
        out = []
        for fn in ITEMS + ["size"]:
            if a in PARTIAL and fn in (i_count, i_sales, i_persons, "size"):
                continue
            for tier in tiers:
                best = None
                for act, scope in tier:
                    d = data.get((a, act))
                    if not d:
                        continue
                    if fn == "size":
                        r = i_size(a, act, d, scope)
                        cand = (r[0]["year"], r) if r else None
                    else:
                        r = fn(a, d, scope, cur)
                        cand = (r["year"], [r]) if r else None
                    if cand and (best is None or cand[0] > best[0][0]):
                        best = (cand, act)
                if best:
                    (_, rs), act = best
                    for r in rs:
                        out.append(dict({"trade": trade, "officialClass": f"ISIC Rev. 4 {act[1:] if act[1:].isdigit() else act}: {LABEL[act]}", "geo": geo}, **r))
                    break
        for o in out:
            if a in PARTIAL:
                o["note"] = join(o.get("note"), PARTIAL[a])
            if o.get("note") is None:
                o.pop("note")
        rows += out
print("\n".join(SKIPPED))

write("oecd-sdbs.json", {
    "id": "oecd-sdbs",
    "source": {
        "publisher": "OECD",
        "title": "Structural business statistics by size class and economic activity (ISIC Rev. 4), Structural and Demographic Business Statistics (SDBS)",
        "url": "https://data-explorer.oecd.org/vis?df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_SDBSBSC_ISIC4%40DF_SDBS_ISIC4&df[ag]=OECD.SDD.TPS",
        "table": "DSD_SDBSBSC_ISIC4@DF_SDBS_ISIC4 v1.0, annual, total size class; API https://sdmx.oecd.org/public/rest/data/OECD.SDD.TPS,DSD_SDBSBSC_ISIC4@DF_SDBS_ISIC4,1.0/",
        "licence": "OECD terms and conditions: OECD data are free to reuse with attribution (CC BY 4.0), https://www.oecd.org/en/about/terms-conditions.html",
    },
    "retrieved": RETRIEVED,
    "rows": rows,
})
