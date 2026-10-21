"""KSH STADAT 20.2.1.43 (mun0144): average and median gross monthly earnings of full-time employees, Hungary."""
import html, os, re, urllib.request
from spines_lib import DL, RETRIEVED, write

URL = "https://www.ksh.hu/stadat_files/mun/en/mun0144.html"
path = os.path.join(DL, "hu", "mun0144.html")
if not os.path.exists(path):
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-US,en;q=0.9"})
    open(path, "wb").write(urllib.request.urlopen(req).read())
s = open(path, encoding="iso-8859-2", errors="replace").read()
rows_h = [[html.unescape(re.sub(r"<[^>]+>", "", c)).strip() for c in re.findall(r"<t[hd][^>]*>(.*?)</t[hd]>", r, re.S)]
          for r in re.findall(r"<tr[^>]*>(.*?)</tr>", s, re.S)]
sect, yr, pick = None, None, {}
for r in rows_h:
    if len(r) == 1:
        sect = r[0]
        continue
    if r and r[0] and re.match(r"^\d{4}$", r[0]):
        yr = r[0]
    if len(r) > 5 and r[2]:
        pick[(sect, yr, r[1])] = r
num = lambda x: float(re.sub(r"[^\d.]", "", x.replace(",", "")))
HU = {"level": "country", "code": "HU", "name": "Hungary"}
out = []
for (sect, yr, per), label, ylab in ((("Quarterly cumulative data", "2025", "Q1–Q4")), "the year 2025", "2025"), \
                                   ((("Monthly cumulative data", "2026", "January–August")), "January to August 2026", "2026-01 to 2026-08"):
    r = pick[(sect, yr, per)]
    for col, kind in ((2, "mean"), (4, "median")):
        flag = " The KSH marks this figure corrected on 16 September 2026." if r[col].endswith("b") else ""
        out.append({"item": "average_wage", "officialClass": "Full-time employees, national economy", "geo": HU,
                    "value": num(r[col].rstrip("b")), "unit": "HUF per month", "year": ylab,
                    "measure": f"{'average' if kind == 'mean' else 'median'} gross monthly earnings of full-time employees, {label} ({kind})",
                    "note": "Enterprises with at least 5 employees, budgetary institutions and the significant non-profit organisations; "
                            f"a monthly figure, not a yearly one. Previous year = 100: {r[col + 1].rstrip('b')}." + flag})
write("business", "ksh-earnings.json", {
    "id": "ksh-earnings",
    "source": {"publisher": "Hungarian Central Statistical Office (KSH)",
               "title": "STADAT 20.2.1.43 Main earnings data, monthly, monthly cumulative and quarterly cumulative data",
               "url": URL, "table": "mun0144, columns Full-time employees: average gross earnings and median gross earnings (HUF/person/month); rows 2025 Q1–Q4 and 2026 January–August",
               "licence": "KSH terms of reuse not read (the terms page was not reached from the server); see the report"},
    "retrieved": RETRIEVED, "rows": out})
