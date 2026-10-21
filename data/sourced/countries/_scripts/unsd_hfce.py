"""UN Statistics Division, National Accounts Official Country Data (UNdata, SNA mart), Table 3.2: household final consumption
expenditure by purpose (COICOP divisions) at current prices, newest year, for catalog countries neither data-place's file nor
oecd-household-spending.json holds.

Pull: one UNdata record view per country (its download handler answers 404 since at least 2026-10-19), first page of 50
records, newest year first: https://data.un.org/Data.aspx?d=SNA&f=group_code%3a302%3bcountry_code%3a<M49> -> DL/unsd/<ISO2>.html
"""
import collections, html, json, os, re
from lib import DL, RETRIEVED, COUNTRIES, OUT, geo, write

M49 = json.load(open(f"{DL}/m49.json"))
HELD = {r["geo"]["code"] for f in (os.path.join(OUT, "..", "place", "household-spending-by-purpose.json"), os.path.join(OUT, "oecd-household-spending.json"))
        for r in json.load(open(f))["rows"]}
DIVS = [f"{i:02d}" for i in range(1, 13)]
DOMESTIC = "Equals: Household final consumption expenditure in domestic market"

out, report = [], {}
for iso2 in sorted(COUNTRIES):
    p = f"{DL}/unsd/{iso2}.html"
    if iso2 in HELD or not os.path.exists(p):
        continue
    s = open(p, encoding="utf-8", errors="ignore").read()
    recs = []
    for r in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S):
        c = [html.unescape(re.sub(r"<[^>]+>", "", x)).strip() for x in re.findall(r"<td[^>]*>(.*?)</td>", r, re.S)]
        if len(c) >= 11 and c[2] == "Individual consumption expenditure of households":
            recs.append(c)
    groups = collections.defaultdict(dict)
    for c in recs:
        key = (c[5], c[6])  # year, series
        if c[4] in DIVS:
            groups[key][c[4]] = c
        elif c[3] == DOMESTIC:
            groups[key]["T"] = c
        elif c[3].startswith("Plus: Direct purchases abroad"):
            groups[key]["plus"] = c
        elif c[3] == "Equals: Household final consumption expenditure":
            groups[key]["P31"] = c
    for v in groups.values():
        # Where the country prints no adjustment for purchases abroad, its one total IS the domestic-market total.
        if "T" not in v and "P31" in v and "plus" not in v:
            v["T"] = v["P31"]
            v["T_is_p31"] = True
    full = [k for k, v in groups.items() if all(d in v for d in DIVS) and k[0] >= "2015"]
    if not full:
        yrs = sorted({k[0] for k, v in groups.items() if all(d in v for d in DIVS)})
        report[iso2] = (f"{len(recs)} household records on the first page; " +
                        (f"all twelve divisions only for {yrs[-1]} (older than 2015, or without a domestic total)" if yrs else "no year with all twelve divisions"))
        continue
    year, series = max(full, key=lambda k: (k[0], int(k[1])))
    v = groups[(year, series)]
    cur = v["01"][7]
    src = {"publisher": "United Nations Statistics Division",
           "title": "National Accounts Official Country Data, Table 3.2 Individual consumption expenditure of households, NPISHs, and general government at current prices",
           "url": f"https://data.un.org/Data.aspx?d=SNA&f=group_code%3a302%3bcountry_code%3a{M49[iso2]}"}
    for d in DIVS + (["T"] if "T" in v else []):
        c = v[d]
        out.append({
            "item": "household_spending_total" if d == "T" else "household_spending",
            **({"officialClass": f"COICOP 1999 {d}"} if d != "T" else {}),
            "geo": geo(iso2),
            "value": float(c[10].replace(",", "")),
            "unit": f"{cur} (currency units, as published)",
            "year": year,
            "measure": "Household final consumption expenditure in the domestic market" if d == "T" else c[3],
            "note": f"National accounts as the country reports them to the UN, SNA {c[8]}, series {series}, {c[9].lower()}; current prices, domestic market.",
            "source": src,
        })
    part = sum(float(v[d][10].replace(",", "")) for d in DIVS)
    if "T" not in v:
        for r in out[-12:]:
            r["note"] += " The country prints no domestic-market total for this year; the twelve divisions are its parts."
        report[iso2] = f"{year} (series {series}, {cur}) no domestic total printed"
        continue
    tot = float(v["T"][10].replace(",", ""))
    if v.get("T_is_p31"):
        out[-1]["note"] += " The country prints no adjustment for purchases abroad, so its one total stands as the domestic-market total."
    if abs(part / tot - 1) > 0.005:
        out[-1]["note"] += f" The twelve divisions as published add to {part / tot * 100:.1f}% of this total."
    report[iso2] = f"{year} (series {series}, {cur}) divisions/total {part / tot * 100:.1f}%"
for k, v in sorted(report.items()):
    print(k, v)
print("written:", len({r['geo']['code'] for r in out}))
write("unsd-household-spending.json", {
    "id": "unsd-household-spending",
    "source": {
        "publisher": "United Nations Statistics Division (UNdata)",
        "title": "National Accounts Official Country Data, Table 3.2: individual consumption expenditure of households by purpose, current prices",
        "url": "https://data.un.org/Data.aspx?d=SNA&f=group_code%3a302",
        "table": "SNA mart, group_code 302 (Table 3.2), sub-group 'Individual consumption expenditure of households', COICOP divisions 01 to 12 and the domestic-market total",
        "licence": "UNdata terms of use: data and metadata free of charge, may be copied, duplicated and further distributed provided UNdata is cited as the reference, https://data.un.org/Host.aspx?Content=UNdataUse",
    },
    "retrieved": RETRIEVED,
    "rows": out,
})
