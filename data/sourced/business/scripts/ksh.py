import json, re, sys
sys.path.insert(0, "/srv/atlas/runs/data-business/scripts")
from lib import *
DL = "/srv/atlas/runs/data-business/dl/hu/"
t = open(DL + "terstat.txt").read()
num = lambda s: int(s.replace(" ", ""))
def six(line):
    toks = line.split()
    # numbers written with a thin space: regroup "5 339 619 2 015" -> use the known layout by matching 1-3 digit groups
    return toks
# table 5.5.11: the Budapest line and the Total line, six columns each
b = re.search(r"^Budapest ((?:\d{1,3}(?: \d{3})*) ){5}\d{1,3}(?: \d{3})* ?$", t[t.index("5.5.11. A vendéglátóhelyek száma üzlettípusonként, 2024. december 31. \n"):], re.M).group(0)
tot = re.search(r"^Összesen \nTotal \n(.*)$", t[t.index("5.5.11. A vendéglátóhelyek száma üzlettípusonként, 2024. december 31. \n"):], re.M).group(1)
COLS = [("Éttermek, büfék (Restaurants, buffets)", "restaurants"), ("Cukrászdák (Confectioneries)", None),
        ("Italüzletek és zenés szórakozóhelyek (Taverns and music clubs)", None),
        ("Kereskedelmi vendéglátóhelyek összesen (Public catering units, total)", None),
        ("Munkahelyi, rendezvényi és közétkeztetést végző vendéglátóhelyek (Workplace, event and mass catering units)", None),
        ("Vendéglátóhelyek összesen (Catering units, total)", None)]
def split6(s, expect):
    # greedy parse of space-grouped thousands into 'expect' integers, checked against the published totals
    toks = s.split()
    out, i = [], 0
    def rec(i, acc):
        if len(acc) == expect:
            return acc if i == len(toks) else None
        for k in (1, 2, 3):
            grp = toks[i:i + k]
            if len(grp) < k or any(len(g) != 3 for g in grp[1:]) or not grp[0].isdigit():
                continue
            r = rec(i + k, acc + [num(" ".join(grp))])
            if r and (len(r) < expect or (r[0] + r[1] + r[2] == r[3] and r[3] + r[4] == r[5])):
                return r
        return None
    return rec(0, [])
bud = split6(b[len("Budapest "):], 6)
hun = split6(tot, 6)
print(bud, hun)
assert bud == [5339, 619, 2015, 7973, 1014, 8987]
assert hun == [21792, 3770, 10992, 36554, 7021, 43575], hun
SRC = {"publisher": "KSH (Hungarian Central Statistical Office)", "title": "Területi statisztikai évkönyv, 2024 (Regional Statistical Yearbook of Hungary, 2024), chapter 5.5, table 5.5.11 Number of catering units by type, 31 December 2024",
       "url": "https://www.ksh.hu/evkonyvek/2024/teruleti-statisztikai-evkonyv-2024/pdf/terstat_2024_5_5.pdf"}
rows = []
for (cls, trade), bv, hv in zip(COLS, bud, hun):
    for geo, v in (({"level": "city", "code": "HU110", "name": "Budapest"}, bv), ({"level": "country", "code": "HU", "name": "Hungary"}, hv)):
        r = {"item": "business_count", "officialClass": cls, "geo": geo, "value": v, "unit": "catering units",
             "year": "2024", "measure": "number of catering units on 31 December 2024, from the municipal trade registers",
             "note": "Counted from the registers kept by municipal notaries under Government Decree 210/2009 (IX. 29.), not from the business register. The register has no cafe type and no barber count.",
             "source": SRC}
        if cls.startswith("Vendéglátóhelyek összesen") and geo["code"] == "HU110":
            r["note"] += " The yearbook's table 5.5.10 gives 53.3 catering units per ten thousand inhabitants for Budapest in 2024."
        if trade: r["trade"] = trade
        rows.append(r)
write("ksh-yearbook-2024.json", {
    "id": "ksh-yearbook-2024",
    "source": {**SRC, "table": "Table 5.5.11 (page 321); PDF sha256 3697c1f0971465e55d8d098d5344d59d08f73c19566422b6ad7ea67235467746"},
    "retrieved": RETRIEVED, "rows": rows})
t2 = open(DL + "terstat2.txt").read()
bp = re.search(r"^Budapest (.*)$", t2, re.M).group(1)
toks = bp.split()
# columns 1990 2001 2012 2015R 2020R 2023 2024 2025: each value is a 1-digit group + two 3-digit groups
vals = [num(" ".join(toks[i:i + 3])) for i in range(0, len(toks), 3)]
assert len(vals) == 8 and vals[-1] == 1685209, vals
tt = re.search(r"Összesen \nTotal \n(.*)$", t2, re.M).group(1).split()
hv = [num(" ".join(tt[i:i + 3])) for i in range(0, len(tt), 3)]
assert len(hv) == 8, hv
PS = {"publisher": "KSH (Hungarian Central Statistical Office)", "title": "Területi statisztikai évkönyv, 2024 (Regional Statistical Yearbook of Hungary, 2024), table 2.1 Population, 1 January",
      "url": "https://www.ksh.hu/evkonyvek/2024/teruleti-statisztikai-evkonyv-2024/pdf/terstat_2024_2.pdf"}
pop = []
for yr, i in (("2024", 6), ("2025", 7)):
    pop.append({"item": "population", "geo": {"level": "city", "code": "HU110", "name": "Budapest"}, "value": vals[i], "unit": "persons",
                "year": yr, "measure": f"population on 1 January {yr}", "note": "Same boundary as the rows of ksh-yearbook-2024.json (Budapest, the capital).", "source": PS})
    pop.append({"item": "population", "geo": {"level": "country", "code": "HU", "name": "Hungary"}, "value": hv[i], "unit": "persons",
                "year": yr, "measure": f"population on 1 January {yr}", "note": "Table 2.1 total.", "source": PS})
json.dump(pop, open("/srv/atlas/runs/data-business/pop_HU.json", "w"), indent=1)
print(pop)
