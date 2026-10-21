"""rates-and-loans.json: central bank rates (with their changes since mid-2024) and what a new business loan costs."""
import csv, datetime, openpyxl
from lib import R, src, write, DL

rows = []
BOE_RATE = src("Bank of England", "Interest rates and Bank Rate", "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate")
BOE_DB = src("Bank of England", "Bankstats database, series IUDBEDR (Official Bank Rate) and CFMBJ82",
             "https://www.bankofengland.co.uk/boeapps/database/")
FED = src("Federal Reserve", "Open Market Operations: policy actions, federal funds target range", "https://www.federalreserve.gov/monetarypolicy/openmarket.htm")
ECB_KR = src("European Central Bank", "Key ECB interest rates (Data Portal series FM.B.U2.EUR.4F.KR.DFR.LEV and FM.B.U2.EUR.4F.KR.MRR_FR.LEV)",
             "https://data.ecb.europa.eu/data/datasets/FM")
MNB_PR = src("Magyar Nemzeti Bank", "Press release on the Monetary Council meeting of 22 September 2026",
             "https://www.mnb.hu/en/monetary-policy/the-monetary-council/press-releases/2026/press-release-on-the-monetary-council-meeting-of-22-september-2026")
MNB_HIST = src("Magyar Nemzeti Bank", "Central bank base rate history (alapkamat.xlsx)", "https://www.mnb.hu/root/BaseRate/BaseRateExcel/alapkamat.xlsx")
MIR = src("European Central Bank", "MFI interest rate statistics (MIR), series MIR.M.<country>.B.A2A.A.R.2.2240.EUR.N",
          "https://data.ecb.europa.eu/data/datasets/MIR")
MNB_KAMAT = src("Magyar Nemzeti Bank", "Tájékoztató a háztartási és a nem pénzügyi vállalati kamatlábakról, 2026. augusztus",
                "https://statisztika.mnb.hu/sw/static/file/Kamat_HU_202608.pdf")
KCFED = src("Federal Reserve Bank of Kansas City", "Small Business Lending Survey, aggregate data, second quarter 2026 (tab A.16, New Fixed-Rate Term Loans)",
            "https://www.kansascityfed.org/documents/18908/Small-Business-Lending-Survey-Aggregate-Data-Kansas-City-Fed-Second-Quarter-2026.xlsx")

# --- central bank rates: the level in force, then each change since mid-2024 (year = the date it took effect)
rows.append(R("central_bank_rate", "GB", 3.75, "%", "2026-09-17", BOE_RATE, measure="Bank Rate",
              note="Held at 3.75% by the Monetary Policy Committee on 17 September 2026."))
prev = None
for d, v in csv.reader(open(f"{DL}/boe/IUDBEDR.csv")):
    if d == "DATE":
        continue
    if v != prev:
        iso = datetime.datetime.strptime(d, "%d %b %Y").date().isoformat()
        rows.append(R("central_bank_rate_change", "GB", float(v), "%", iso, BOE_DB, measure="Bank Rate, level from this date",
                      note="Daily series IUDBEDR; the first row is the level on the series' first day read (1 July 2024), each later row a change." if prev is None else None))
        prev = v

fed = [("2024-09-19", 4.75, 5.00), ("2024-11-08", 4.50, 4.75), ("2024-12-19", 4.25, 4.50), ("2025-09-18", 4.00, 4.25),
       ("2025-10-30", 3.75, 4.00), ("2025-12-11", 3.50, 3.75), ("2026-09-17", 3.75, 4.00)]
lo, hi = fed[-1][1], fed[-1][2]
rows.append(R("central_bank_rate", "US", lo, "%", "2026-09-17", FED, measure="Federal funds target range, lower bound",
              note="Target range 3.75 to 4.00%, raised by 0.25 points on 17 September 2026."))
rows.append(R("central_bank_rate_upper", "US", hi, "%", "2026-09-17", FED, measure="Federal funds target range, upper bound"))
for d, a, b in fed:
    rows.append(R("central_bank_rate_change", "US", a, "%", d, FED, measure="Federal funds target range, lower bound, from this date",
                  note=f"Target range {a:.2f} to {b:.2f}%."))

for f, item, meas in (("dfr.csv", "central_bank_rate", "Deposit facility rate"), ("mro.csv", "central_bank_rate_mro", "Main refinancing operations, fixed rate")):
    series = [(r["TIME_PERIOD"], float(r["OBS_VALUE"])) for r in csv.DictReader(open(f"{DL}/ecb/{f}"))]
    d, v = series[-1]
    rows.append(R(item, "EA", v, "%", d, ECB_KR, measure=meas, note="The euro area's rate, the same for every euro-area country (Italy among them)."))
    for d, v in series:
        rows.append(R(item + "_change", "EA", v, "%", d, ECB_KR, measure=meas + ", level from this date"))

rows.append(R("central_bank_rate", "HU", 5.50, "%", "2026-09-22", MNB_PR, measure="Central bank base rate",
              note="Kept unchanged at 5.50% by the Monetary Council on 22 September 2026."))
wb = openpyxl.load_workbook(f"{DL}/pages/hu_alapkamat.xlsx", read_only=True)
for r in list(wb.worksheets[0].iter_rows(min_row=2, values_only=True)):
    if isinstance(r[0], datetime.datetime) and r[0] >= datetime.datetime(2024, 6, 1):
        rows.append(R("central_bank_rate_change", "HU", float(r[1].rstrip("%").replace(",", ".")), "%", r[0].date().isoformat(), MNB_HIST,
                      measure="Central bank base rate, level from the day the decree took effect"))

# --- what a new small-business loan costs
for d, v in csv.reader(open(f"{DL}/boe/CFMBJ82.csv")):
    if d == "DATE":
        continue
    m = datetime.datetime.strptime(d, "%d %b %Y").strftime("%Y-%m")
    rows.append(R("business_loan_rate", "GB", float(v), "%", m, BOE_DB,
                  measure="Monthly average sterling weighted average interest rate, other loans, new advances to private non-financial corporations (CFMBJ82)",
                  note="All firm sizes: the published series gives no small-business line."))

BOE_MC = src("Bank of England", "Money and Credit - August 2026", "https://www.bankofengland.co.uk/statistics/money-and-credit/2026/august-2026")
rows.append(R("small_business_loan_rate", "GB", 6.63, "%", "2026-08", BOE_MC, measure="Effective interest rate on new loans from banks to SMEs (small and medium-sized non-financial businesses)",
              note="Up from 6.61% in July. All private non-financial corporations: 5.57%."))
rows.append(R("small_business_loan_rate", "GB", 6.61, "%", "2026-07", BOE_MC, measure="Effective interest rate on new loans from banks to SMEs (small and medium-sized non-financial businesses)",
              note="The July figure as stated in the August 2026 release."))

names = {"AT": "Austria", "BE": "Belgium", "BG": "Bulgaria", "CY": "Cyprus", "DE": "Germany", "EE": "Estonia", "ES": "Spain", "FI": "Finland",
         "FR": "France", "GR": "Greece", "HR": "Croatia", "IE": "Ireland", "IT": "Italy", "LT": "Lithuania", "LU": "Luxembourg", "LV": "Latvia",
         "MT": "Malta", "NL": "Netherlands", "PT": "Portugal", "SI": "Slovenia", "SK": "Slovakia", "U2": "Euro area"}
for r in csv.DictReader(open(f"{DL}/ecb/mir_small.csv")):
    c = r["REF_AREA"]
    geo = {"level": "eu", "code": "EA", "name": "Euro area"} if c == "U2" else {"level": "country", "code": c, "name": names[c]}
    rows.append(R("small_business_loan_rate", geo, float(r["OBS_VALUE"]), "%", r["TIME_PERIOD"], MIR,
                  measure="Bank interest rates, loans to non-financial corporations of up to EUR 0.25 million, new business, annualised agreed rate",
                  note="Euro-denominated loans." + (" Bulgaria joined the euro area on 1 January 2026; its earlier months are euro-denominated loans only." if c == "BG" else "")))

rows.append(R("small_business_loan_rate", "HU", 7.86, "%", "2026-08", MNB_KAMAT,
              measure="Average interest rate on new forint loan contracts to non-financial corporations below EUR 1 million",
              note="Down 0.35 points on the month (the release's own change column)."))

wb = openpyxl.load_workbook(f"{DL}/kcfed/sbls26q2.xlsx", read_only=True)
for r in wb["Aggregate Data Tab"].iter_rows(values_only=True):
    if r[0] == "A16" and str(r[3]).strip() == "Weighted average interest rate" and r[2] >= "2024:Q3":
        y, q = r[2].split(":")
        rows.append(R("small_business_loan_rate", "US", round(float(r[4]), 2), "%", f"{y}-{q}", KCFED,
                      measure="Weighted average interest rate, new fixed-rate small business term loans, banks in the survey",
                      note="A survey of banks (about 140), weighted by loan amount; quarterly."))

write("rates-and-loans.json", "rates-and-loans", src("Central banks and their statistics", "Central bank rates and new business loan rates, United Kingdom, United States, euro area, Hungary", "https://data.ecb.europa.eu/data/datasets/MIR"), rows)
