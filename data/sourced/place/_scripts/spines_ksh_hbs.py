"""KSH STADAT 14.8.1.14 (jov0025): annual per capita expenditure by COICOP and income decile; group 11, the newest two years."""
import html, os, re, urllib.request
from spines_lib import DL, RETRIEVED, write

URL = "https://www.ksh.hu/stadat_files/jov/en/jov0025.html"
path = os.path.join(DL, "hu", "jov0025.html")
if not os.path.exists(path):
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-US,en;q=0.9"})
    open(path, "wb").write(urllib.request.urlopen(req).read())
s = open(path, encoding="iso-8859-2", errors="replace").read()
rows_h = [[html.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", r, re.S)]
          for r in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S)]
by, yr = {}, None
for r in rows_h:
    if len(r) == 1 and re.match(r"^\d{4}$", r[0]):
        yr = r[0]
    elif yr and len(r) >= 12:
        key = "11" if r[0] == "11" else ("total" if r[1] == "Total" else None)
        if key:
            by.setdefault(yr, {})[key] = [float(x.replace(",", "")) for x in r[2:13]]
years = sorted(by)[-2:]
HU = {"level": "country", "code": "HU", "name": "Hungary"}
out = []
for y in years:
    for i in range(11):
        grp = "all households" if i == 0 else f"people in households of income decile {i}"
        c, tot = by[y]["11"][i], by[y]["total"][i]
        extra = {"decile": i} if i else {}
        note = ("Household budget survey, per person, not per household; COICOP 11 holds restaurants and cafes with accommodation."
                + (" 2020 holds the pandemic closures of restaurants and cafes." if y == "2020" else ""))
        out.append(dict({"item": "eating_out_by_income", "officialClass": "COICOP 11: Catering and accommodation services", "geo": HU,
                         "value": c, "unit": "HUF per person per year", "year": y,
                         "measure": f"annual per capita spending on catering and accommodation services, {grp}, {y}", "note": note}, **extra))
        out.append(dict({"item": "eating_out_by_income", "officialClass": "COICOP 11: Catering and accommodation services", "geo": HU,
                         "value": round(100 * c / tot, 1), "unit": "percent of consumption expenditure", "year": y,
                         "measure": f"catering and accommodation services as a share of consumption expenditure, {grp}, {y}",
                         "note": note + f" Derived from the same table: HUF {c:,.0f} of HUF {tot:,.0f} a year."}, **extra))
write("place", "ksh-hbs-eating-out-by-income.json", {
    "id": "ksh-hbs-eating-out-by-income",
    "source": {"publisher": "Hungarian Central Statistical Office (KSH)", "title": "STADAT 14.8.1.14 Annual per capita expenditure by COICOP, income deciles",
               "url": URL, "table": "jov0025, rows 11 'Catering and accommodation services' and Total, columns Total and income deciles 1 to 10; the newest two years (" + ", ".join(years) + ")",
               "licence": "KSH terms of reuse not read (the terms page was not reached from the server); see the report"},
    "retrieved": RETRIEVED, "rows": out})
