"""The report's matrix: for every catalog country, which country-page section (constitution Part III.3) has a figure, before
this job (data/sourced/business, place, rules, and data-intl's branch) and after (adding data/sourced/countries).
Prints markdown. Reads data-intl's files from its branch with git (not merged here)."""
import glob, json, os, subprocess, collections
from lib import OUT, COUNTRIES

ROOT = os.path.abspath(os.path.join(OUT, "..", "..", ".."))
EURO = set("AT BE CY DE EE ES FI FR GR HR IE IT LT LV LU MT NL PT SI SK".split())


def load(paths):
    rows = []
    for p in paths:
        rows += json.load(open(p))["rows"]
    return rows


old = load(glob.glob(os.path.join(ROOT, "data/sourced/business/*.json")) + glob.glob(os.path.join(ROOT, "data/sourced/place/*.json"))
           + glob.glob(os.path.join(ROOT, "data/sourced/rules/*.json")))
intl = []
names = subprocess.run(["git", "-C", ROOT, "ls-tree", "--name-only", "data-intl", "data/sourced/intl/"], capture_output=True, text=True).stdout.split()
for n in names:
    if n.endswith(".json"):
        intl += json.loads(subprocess.run(["git", "-C", ROOT, "show", f"data-intl:{n}"], capture_output=True, text=True).stdout)["rows"]
new = load(glob.glob(os.path.join(OUT, "*.json")))


def cc(r):
    g = r["geo"]
    if g["level"] == "country":
        return g["code"]
    c = g["code"]
    if "-" in c and c[:2] in COUNTRIES and c[2] == "-":  # JP-01, CA-ON, US-los-angeles, IT-rome: said at its own level
        if g["level"] in ("city", "region") and not r["item"].startswith("tax_case"):
            return None
        return c[:2]
    return None


SECTIONS = {
    "hero": lambda i: i in ("tax_case_share_of_profit",),
    "01": lambda i: i in ("company_entry_days", "registration_fee", "registration_wait_days"),
    "02": lambda i: i in ("profit_tax_rate", "cit_rate_combined", "vat_rate_standard", "sales_tax_rate"),
    "03": lambda i: i in ("employer_charge_rate", "minimum_wage", "minimum_wage_monthly", "wage_floor"),
    "04": lambda i: i in ("small_business_loan_rate", "business_loan_rate", "lending_rate", "central_bank_rate"),
    "05": lambda i: i in ("household_spending_share", "household_spending"),
    "06": lambda i: i.startswith("survival_"),
    "07": lambda i: i in ("liquidation_months", "liquidation_court_fee", "insolvency_procedure"),
    "08": lambda i: i == "rule_change",
}


def held(rows):
    h = collections.defaultdict(set)
    for r in rows:
        c = cc(r)
        if r["geo"]["code"] == "EA" and r["item"].startswith("central_bank_rate"):
            for e in EURO:
                h[e].add("04")
            continue
        if not c or c not in COUNTRIES or (r.get("value") is None and r["item"] != "minimum_wage"):
            continue
        for s, f in SECTIONS.items():
            if f(r["item"]):
                h[c].add(s)
    return h


before = held(old + intl)
after = held(old + intl + new)
cols = list(SECTIONS)
print("| country | " + " | ".join(cols) + " | sections before | after |")
print("|---|" + "---|" * (len(cols) + 2))
counts = collections.Counter()
for c in sorted(COUNTRIES, key=lambda c: -len(after[c] - {"hero"})):
    cells = []
    for s in cols:
        cells.append("held" if s in before[c] else ("NEW" if s in after[c] else ""))
    b, a = len(before[c] - {"hero"}), len(after[c] - {"hero"})
    counts["b3"] += b >= 3
    counts["a3"] += a >= 3
    print(f"| {c} {COUNTRIES[c][1]} | " + " | ".join(cells) + f" | {b} | {a} |")
print()
print(f"Countries with three figure sections or more (01 to 08, the hero apart): before {counts['b3']}, after {counts['a3']} of {len(COUNTRIES)}.")
print("Under three after:", " ".join(f"{c}({len(after[c] - {'hero'})})" for c in sorted(COUNTRIES) if len(after[c] - {'hero'}) < 3))
