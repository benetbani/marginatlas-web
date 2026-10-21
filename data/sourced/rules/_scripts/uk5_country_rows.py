"""The country page's rows that no file held (job uk5, 2026-10-21, his word "source the missing UK rows now ... from gov.uk only"):
filing deadlines and late-filing penalties, the steps to open, the Start Up Loan, the workplace pension, and six rule changes.

Every value is read out of the page's own words, from gov.uk's content API (https://www.gov.uk/api/content/<path>, the same
pages as https://www.gov.uk/<path>), pulled to DL by /srv/atlas/runs/data-rules/gov_fetch*.sh on 2026-10-21; each row keeps the
sha256 of its pull. A sentence that is not found stops the build. Where gov.uk's current pages do not print a figure, the row
says so and the value is null.
"""
import hashlib
import html
import json
import re

from lib import GEO, R, src, write

DL = "/srv/atlas/runs/data-rules/dl/gov-uk5"
GB = GEO["GB"]


def page(stem):
    raw = open(f"{DL}/{stem}.json", "rb").read()
    d = json.loads(raw)
    det = d.get("details", {})
    chunks = []
    for k in ("body", "introductory_paragraph", "introduction", "more_information"):   # a guide's body; a transaction page's parts
        v = det.get(k)
        if isinstance(v, str):
            chunks.append(v)
        elif isinstance(v, list):
            chunks += [x.get("content", "") for x in v if isinstance(x, dict)]
    for part in det.get("parts", []) or []:
        b = part.get("body")
        chunks.append(f" {part.get('title', '')} " + (b if isinstance(b, str) else "".join(x.get("content", "") for x in b or [])))
    t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", " ".join(chunks)))).replace("’", "'")
    path = d.get("base_path") or "/" + stem.replace("_", "/")
    return t, d.get("title") or stem, "https://www.gov.uk" + path, hashlib.sha256(raw).hexdigest()


def find(t, pattern, what):
    m = re.search(pattern, t, flags=re.I)
    assert m, f"not found on the page: {what} ({pattern})"
    return m


def source(stem, publisher="GOV.UK"):
    t, title, url, sha = page(stem)
    s = src(publisher, title, url)
    s["sha256"] = sha
    return t, s


rows = []

# ---- filing deadlines and penalties ----
t, s = source("submit-vat-return")
m = find(t, r"deadline for submitting your return online is usually one calendar month and (\d+) days after the end of an accounting period", "VAT")
rows.append(R("filing_deadline", GB, 1, f"calendar month and {m.group(1)} days after each VAT period ends", "2026", s,
              measure="VAT return and payment", note="Also the deadline for paying HMRC."))
t, s = source("prepare-file-annual-accounts-for-limited-company")
m = find(t, r"File annual accounts with Companies House (\d+) months after your company's financial year ends", "accounts")
rows.append(R("filing_deadline", GB, int(m.group(1)), "months after the financial year ends", "2026", s, measure="Company accounts filed"))
m = find(t, r"File first accounts with Companies House (\d+) months after the date you registered", "first accounts")
rows.append(R("filing_deadline", GB, int(m.group(1)), "months after registering", "2026", s, measure="First accounts filed"))
t, s = source("pay-corporation-tax")
m = find(t, r"pay your Corporation Tax (\d+) months and (\d+) day after the end of your accounting period", "CT")
rows.append(R("filing_deadline", GB, int(m.group(1)), f"months and {m.group(2)} day after the accounting period ends", "2026", s,
              measure="Corporation tax paid", note="For taxable profits of up to 1.5 million pounds."))
t, s = source("company-tax-returns")
m = find(t, r"deadline for your tax return is (\d+) months after the end of the accounting period", "CT return")
rows.append(R("filing_deadline", GB, int(m.group(1)), "months after the accounting period ends", "2026", s, measure="Company tax return"))
t, s = source("guidance_filing-your-companys-confirmation-statement")
m = find(t, r"file at least one confirmation statement every (\d+) months", "confirmation statement")
rows.append(R("filing_deadline", GB, int(m.group(1)), "months, at least", "2026", s, measure="Confirmation statement"))
t, s = source("annual-accounts")
m = find(t, r"Up to 1 month £([\d,]+) 1 to 3 months £([\d,]+) 3 to 6 months £([\d,]+) More than 6 months £([\d,]+)", "penalties")
for label, v in zip(("Up to 1 month late", "1 to 3 months late", "3 to 6 months late", "More than 6 months late"), m.groups()):
    rows.append(R("late_filing_penalty", GB, int(v.replace(",", "")), "GBP", "2026", s, measure=f"Accounts filed {label.lower()}",
                  note="Private limited companies. Public limited companies pay more."))

# ---- the steps to open ----
t, s = source("limited-company-formation")
m = find(t, r"It costs £(\d+) and can be paid by debit or credit card\. Your company is usually registered within (\d+) hours", "registration")
rows.append(R("registration_time", GB, int(m.group(2)), "hours, usually", "2026", s, measure="Private limited company registered online",
              note=f"The fee is {m.group(1)} pounds online."))
t, s = source("corporation-tax")
find(t, r"You'll get the option to be set up for Corporation Tax at the same time", "CT setup")
rows.append(R("registration_step", GB, None, "step", "2026", s, measure="Set up for Corporation Tax",
              note="At the same time as registering the company with Companies House, or later by adding Corporation Tax to the "
                   "business tax account. gov.uk's current guide states no deadline for it."))
t, s = source("register-employer")
find(t, r"You must register before the first payday", "employer")
m = find(t, r"You cannot register more than (\d+) months before you start paying people", "employer window")
rows.append(R("registration_step", GB, None, "step", "2026", s, measure="Register as an employer",
              note=f"Before the first payday, and not more than {m.group(1)} months before paying anyone."))
t, s = source("guidance_food-business-registration")
m = find(t, r"England, Wales and Northern Ireland You are required to register at least (\d+) days before trading", "food")
rows.append(R("registration_step", GB, int(m.group(1)), "days before trading, at least", "2026", s, measure="Register a food business",
              note="England, Wales and Northern Ireland, with the local council."))
t, s = source("become-sole-trader")
find(t, r"You can start trading straight away without registering", "sole trader")
m = find(t, r"register for Self Assessment as a sole trader if you earn more than £([\d,]+) in a tax year", "self assessment")
rows.append(R("registration_step", GB, 0, "days before trading", "2026", s, measure="Start as a sole trader",
              note=f"Trading can start straight away without registering. Self Assessment registration is needed once earnings pass "
                   f"{m.group(1)} pounds in a tax year."))

# ---- the Start Up Loan ----
t, s = source("apply-start-up-loan")
m = find(t, r"Start Up Loan of £([\d,]+) to £([\d,]+)", "loan size")
r_ = find(t, r"fixed interest rate of ([\d.]+)% per year", "loan rate")
y = find(t, r"repay the loan over a period of (\d+) to (\d+) years", "loan term")
rows.append(R("startup_loan_min", GB, int(m.group(1).replace(",", "")), "GBP", "2026", s, measure="Start Up Loan, smallest"))
rows.append(R("startup_loan_max", GB, int(m.group(2).replace(",", "")), "GBP", "2026", s, measure="Start Up Loan, largest"))
rows.append(R("startup_loan_rate", GB, float(r_.group(1)), "% a year, fixed", "2026", s, measure="Start Up Loan, interest rate",
              note="Government-backed, an unsecured personal loan, no application or early repayment fee."))
rows.append(R("startup_loan_term", GB, int(y.group(2)), "years at most", "2026", s, measure="Start Up Loan, repaid over",
              note=f"{y.group(1)} to {y.group(2)} years."))

# ---- the workplace pension ----
t, s = source("workplace-pensions")
m = find(t, r"From April 2019 (\d+)% (\d+)% (\d+)%", "contributions")
b = find(t, r"total earnings between £([\d,]+) and £([\d,]+) a year before tax", "band")
rows.append(R("pension_employer_min", GB, int(m.group(1)), "% of qualifying earnings", "2026", s, measure="Workplace pension, the employer's minimum",
              note=f"The employee pays {m.group(2)}%, {m.group(3)}% in all."))
rows.append(R("pension_band_lower", GB, int(b.group(1).replace(",", "")), "GBP a year", "2026", s, measure="Qualifying earnings, from"))
rows.append(R("pension_band_upper", GB, int(b.group(2).replace(",", "")), "GBP a year", "2026", s, measure="Qualifying earnings, to"))

# ---- six rule changes (item rule_change, year the date the change takes effect, as data/sourced/rules/rule-changes.json) ----
t, s = source("government_publications_implementing-the-plan-to-make-work-pay-and-employment-rights-act_"
              "plan-to-make-work-pay-and-employment-rights-act-timeline-update")
find(t, r"reduction of unfair dismissal qualifying period to 6 months, for dismissals from 1 January 2027", "unfair dismissal")
t2, s2 = source("dismissal")
b = find(t2, r"minimum period - normally (\d+) years - before you qualify for the right to claim unfair dismissal", "2 years")
rows.append(R("rule_change", GB, 6, "months", "2027-01-01", s, measure="Unfair dismissal, the qualifying period",
              note=f"From normally {b.group(1)} years (gov.uk, Dismissal: your rights) to 6 months, for dismissals from 1 January 2027."))
m = find(t, r"Measures that took effect on 1 October 2026 the time limit for bringing a claim to the Employment Tribunal has increased from (\d+) to (\d+) months", "tribunal")
rows.append(R("rule_change", GB, int(m.group(2)), "months", "2026-10-01", s, measure="Employment tribunal claims, the time limit",
              note=f"From {m.group(1)} to {m.group(2)} months."))
find(t, r"Measures that took effect on 6 April 2026 .{0,900}Statutory Sick Pay \(SSP\): removing the Lower Earnings Limit \(LEL\) and waiting period", "SSP")
rows.append(R("rule_change", GB, 1, "first day of sickness paid", "2026-04-06", s, measure="Statutory Sick Pay, the waiting period removed",
              note="Sick pay from the first day off sick. The length of the old waiting period is not printed on gov.uk's current pages."))
t, s = source("guidance_find-out-if-and-when-you-need-to-use-making-tax-digital-for-income-tax")
for amount, when, iso in (("50,000", "6 April 2026", "2026-04-06"), ("30,000", "6 April 2027", "2027-04-06"), ("20,000", "6 April 2028", "2028-04-06")):
    find(t, re.escape(f"£{amount}") + r" for the \d{4} to \d{4} tax year, you (?:should've started|will need to use)[^£]{0,80}" + re.escape(when), f"MTD {amount}")
    rows.append(R("rule_change", GB, int(amount.replace(",", "")), "GBP of qualifying income", iso, s,
                  measure="Making Tax Digital for Income Tax, the threshold",
                  note=f"Sole traders and landlords over {amount} pounds keep digital records from {when}."))
t, s = source("government_news_companies-house-fees-are-changing-from-1-february-2026")
m = find(t, r"incorporation digital filing fee will change to £(\d+)", "fee")
rows.append(R("rule_change", GB, int(m.group(1)), "GBP", "2026-02-01", s, measure="Company registration fee, online",
              note="From 1 February 2026. The fee before it is not printed on gov.uk's current pages."))

write("uk5-country-rows.json", "uk5-country-rows",
      src("GOV.UK (each row's own page)", "The country page's rows from gov.uk: filing deadlines, steps, the Start Up Loan, the pension, rule changes",
          "https://www.gov.uk/api/content/"), rows, retrieved="2026-10-21")
print(len(rows), "rows")
for r in rows:
    print(" ", r["item"], r["value"], r["unit"], r["year"], "|", r.get("measure", ""))
