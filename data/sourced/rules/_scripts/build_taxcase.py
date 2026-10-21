"""tax-case-40000.json (plan Task 3 step 2): a sole trader with a profit of 40,000 in the local currency under 2026 rules,
no other income, no employees, single, whole year. Every parameter is its own row with its issuer; the components and the
total are computed here from those rows, and each computed row says how."""
from math import floor
from lib import R, src, write
from build_step2 import S

S2 = {
    "irs_sse": src("Internal Revenue Service", "Schedule SE (Form 1040), Self-Employment Tax (lines 4a and 13)", "https://www.irs.gov/pub/irs-pdf/f1040sse.pdf"),
    "irs_qbi": src("Internal Revenue Service", "Qualified business income deduction", "https://www.irs.gov/newsroom/qualified-business-income-deduction"),
    "ftb_news": src("California Franchise Tax Board", "Tax News, October 2026: 2026 indexing (2026 California tax rate schedules)", "https://www.ftb.ca.gov/about-ftb/newsroom/tax-news/index.html"),
    "ftb_schca": src("California Franchise Tax Board", "2025 Instructions for Schedule CA (540), line 15, deductible part of self-employment tax", "https://www.ftb.ca.gov/forms/2025/2025-540-ca-instructions.html"),
    "tuir10": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.P.R. 917/1986 (TUIR), art. 10, c. 1, lett. e), testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1986-12-22;917~art10!vig=2026-10-17"),
    "tuir13": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.P.R. 917/1986 (TUIR), art. 13, c. 5 and 6, testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1986-12-22;917~art13!vig=2026-10-17"),
    "l234": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "Legge 30 dicembre 2021, n. 234, art. 1, c. 8 (IRAP non dovuta dalle persone fisiche esercenti attività commerciali)", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2021-12-30;234~art1!vig=2026-10-17"),
    "lazio_add": src("Regione Lazio", "Addizionale regionale all'IRPEF, anno d'imposta 2026 (aliquote per scaglione)", "https://www.regione.lazio.it/sites/default/files/2026-01/Addizionale-regionale-2026.pdf"),
    "roma_add": src("Ministero dell'Economia e delle Finanze, Dipartimento delle Finanze", "Addizionale comunale all'IRPEF, Roma (H501): delibera n. 186 del 19-12-2024", "https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lazio.htm&cm=&pr=RM&cc=H501&r=1"),
}

r2 = lambda x: round(x + 1e-9, 2)
rows = []


def P(geo, measure, value, unit, year, source, note=None):
    rows.append(R("tax_case_parameter", geo, value, unit, year, source, measure=measure, note=note))
    return value


def C(geo, measure, value, unit, source, how, item="tax_case_component"):
    rows.append(R(item, geo, r2(value), unit, "2026", source, measure=measure, note="Computed: " + how))
    return r2(value)


def case(geo, cur, profit, parts, regime, alt, src_total):
    total = r2(sum(parts))
    rows.append(R("tax_case_total", geo, total, cur, "2026", src_total, measure=f"Tax and the owner's compulsory contributions on a profit of {profit:,} {cur}, sole trader, 2026 rules",
                  note=f"Regime: {regime}. Alternatives: {alt}"))
    rows.append(R("tax_case_share_of_profit", geo, round(100 * total / profit, 1), "% of profit", "2026", src_total,
                  measure="The total as a share of the profit", note=f"Computed: {total:,.2f} / {profit:,}."))
    rows.append(R("tax_case_kept", geo, r2(profit - total), cur, "2026", src_total, measure="What is left of the profit after them",
                  note=f"Computed: {profit:,} - {total:,.2f}."))


PROFIT = 40000

# ---------------------------------------------------------------- United Kingdom (England), tax year 2026-27
g = "GB"
rows.append(R("tax_case_profit", g, PROFIT, "GBP", "2026-27", S["it"], measure="Profit of the case, sole trader, England, tax year 2026-27",
              note="No other income, no employees, standard Personal Allowance."))
pa = P(g, "Personal Allowance", 12570, "GBP", "2026-27", S["it"])
br = P(g, "Income tax basic rate, GBP 12,571 to 50,270", 20, "%", "2026-27", S["it"])
c4l = P(g, "Class 4 National Insurance lower profits limit", 12570, "GBP", "2026-27", S["class4"])
c4 = P(g, "Class 4 National Insurance, profits 12,570 to 50,270", 6, "%", "2026-27", S["class4"])
it = C(g, "Income tax", (PROFIT - pa) * br / 100, "GBP", S["it"], "(40,000 - 12,570) x 20%.")
ni = C(g, "Class 4 National Insurance", (PROFIT - c4l) * c4 / 100, "GBP", S["class4"], "(40,000 - 12,570) x 6%. Class 2 is treated as paid at this profit.")
case(g, "GBP", PROFIT, [it, ni], "Self Assessment, income tax and Class 4 National Insurance (England)",
     "a limited company instead pays Corporation Tax at 19% on profits to GBP 50,000, the owner then taxed on salary and dividends (not computed).", S["it"])

# ---------------------------------------------------------------- United States, California, City of Los Angeles, 2026
g = "la"
rows.append(R("tax_case_profit", g, PROFIT, "USD", "2026", S["irs_2026"], measure="Profit of the case, sole proprietor living and trading in the City of Los Angeles, 2026",
              note="Net profit on Schedule C. Single, no other income, no employees, standard deductions."))
f9235 = P("US", "Net earnings from self-employment: share of net profit", 92.35, "%", "2025", S2["irs_sse"], "Schedule SE line 4a (the 2025 form, the latest published).")
se = P("US", "Self-employment tax rate (12.4% social security, 2.9% Medicare)", 15.3, "%", "2026", S["irs_se"],
       "The social security part stops at the year's wage base, far above this case.")
half = P("US", "Deduction for one-half of self-employment tax", 50, "%", "2025", S2["irs_sse"], "Schedule SE line 13.")
sd = P("US", "Federal standard deduction, single", 16100, "USD", "2026", S["irs_2026"])
qbi = P("US", "Qualified business income deduction, limited to 20% of taxable income before it", 20, "%", "2026", S2["irs_qbi"],
        "The limit binds in this case: 20% of taxable income is below 20% of the business income.")
b1 = P("US", "Federal income tax 10%, single, taxable income to USD 12,400", 12400, "USD", "2026", S["irs_2026"])
P("US", "Federal income tax 12%, single, taxable income over USD 12,400 to 50,400", 12, "%", "2026", S["irs_2026"])
casd = P("US-CA", "California standard deduction, single", 5900, "USD", "2026", S2["ftb_news"])
P("US-CA", "California income tax, Schedule X, over USD 27,157 to 42,861: 428.58 plus 4.00% of the amount over 27,157", 4, "%", "2026", S2["ftb_news"])
cacr = P("US-CA", "California personal exemption credit, single", 158, "USD", "2026", S2["ftb_news"])
P("US-CA", "California follows the federal deduction for half of self-employment tax", 1, "1 = yes", "2025", S2["ftb_schca"],
  "Schedule CA (540) line 15: an adjustment is needed only where the taxpayer is an employee for California purposes.")
nese = PROFIT * f9235 / 100
setax = C("US", "Self-employment tax", nese * se / 100, "USD", S["irs_se"], "40,000 x 92.35% = 36,940, x 15.3%.")
agi = PROFIT - r2(setax * half / 100)
ti0 = agi - sd
q = r2(ti0 * qbi / 100)
ti = ti0 - q
fed = C("US", "Federal income tax", 0.10 * b1 + 0.12 * (ti - b1), "USD", S["irs_2026"],
        f"AGI 40,000 - {r2(setax/2):,.2f} (half the SE tax) = {agi:,.2f}; less 16,100 = {ti0:,.2f}; less the QBI deduction {q:,.2f} (20% of that) = {ti:,.2f}; 10% to 12,400 and 12% above. By the rate schedule.")
cati = agi - casd
ca = C("US-CA", "California income tax", 428.58 + 0.04 * (cati - 27157) - cacr, "USD", S2["ftb_news"],
       f"California AGI {agi:,.2f} (no QBI deduction in California) less 5,900 = {cati:,.2f}; 428.58 + 4% of the amount over 27,157, less the 158 credit.")
case(g, "USD", PROFIT, [setax, fed, ca], "sole proprietor: federal income tax, self-employment tax and California personal income tax",
     "the City of Los Angeles business tax is on gross receipts, not profit, and is nil for a registered business with worldwide receipts of USD 100,000 or less (not in this total). An S corporation or LLC election changes the case (not computed).", S["irs_se"])

# ---------------------------------------------------------------- Italy, Lazio, Rome, 2026, ordinary regime
g = "rome"
rows.append(R("tax_case_profit", g, PROFIT, "EUR", "2026", S["inps14"], measure="Profit of the case (reddito d'impresa), sole trader in commerce (commerciante), resident in Rome, 2026",
              note="Ordinary regime (regime ordinario or semplificato). No other income, no employees, no dependants."))
mn = P("IT", "INPS commercianti: minimum income (minimale)", 18808, "EUR", "2026", S["inps14"])
mc = P("IT", "INPS commercianti: contribution on the minimum income, with maternity", 4611.64, "EUR", "2026", S["inps14"])
ir = P("IT", "INPS commercianti: rate on income above the minimum, to EUR 56,224", 24.48, "%", "2026", S["inps14"], "Artisans (barbers among them): 24%.")
P("IT", "INPS contributions are deductible from total income", 1, "1 = yes", "2026", S2["tuir10"], "TUIR art. 10, c. 1, lett. e).")
P("IT", "IRPEF to EUR 28,000", 23, "%", "2026", S["tuir11"])
P("IT", "IRPEF EUR 28,000 to 50,000", 33, "%", "2026", S["tuir11"])
P("IT", "Deduction for business income (art. 13, c. 5, b-bis): EUR 500 x (50,000 - total income) / 22,000, for total income 28,000 to 50,000", 500, "EUR", "2026", S2["tuir13"],
  "The ratio is taken to its first four decimals (c. 6).")
P("IT", "IRAP is not due from individuals carrying on commercial activities", 0, "%", "2022", S2["l234"], "L. 234/2021, art. 1, c. 8, from tax year 2022.")
P("IT-62", "Lazio regional surcharge (addizionale regionale), taxable income over EUR 28,000: 1.73% to 15,000", 1.73, "%", "2026", S2["lazio_add"])
P("IT-62", "Lazio regional surcharge, taxable income over EUR 28,000: 3.33% above 15,000", 3.33, "%", "2026", S2["lazio_add"],
  "The EUR 60 deduction applies only to taxable income from 28,001 to 30,000.")
P("rome", "Rome municipal surcharge (addizionale comunale), single rate", 0.9, "%", "2025", S2["roma_add"],
  "Exempt to taxable income of EUR 14,000. The finance ministry's list shows no 2026 resolution for Rome; the 2025 one (n. 186 of 19-12-2024) is the latest.")
inps = C("IT", "INPS contributions (owner's own)", mc + (PROFIT - mn) * ir / 100, "EUR", S["inps14"], "4,611.64 + 24.48% x (40,000 - 18,808).")
rc = PROFIT - inps
gross = 0.23 * 28000 + 0.33 * (rc - 28000)
ratio = floor((50000 - rc) / 22000 * 10000) / 10000
ded = 500 * ratio
irpef = C("IT", "IRPEF", gross - ded, "EUR", S["tuir11"],
          f"Total income 40,000 - {inps:,.2f} = {rc:,.2f}; 23% x 28,000 + 33% x {rc-28000:,.2f} = {gross:,.2f}; less the art. 13 deduction 500 x {ratio:.4f} = {ded:,.2f}.")
reg = C("IT-62", "Lazio regional surcharge", 0.0173 * 15000 + 0.0333 * (rc - 15000), "EUR", S2["lazio_add"], f"1.73% x 15,000 + 3.33% x {rc-15000:,.2f}.")
com = C("rome", "Rome municipal surcharge", 0.009 * rc, "EUR", S2["roma_add"], f"0.9% x {rc:,.2f}.")
case(g, "EUR", PROFIT, [inps, irpef, reg, com], "ordinary regime: IRPEF with the Lazio and Rome surcharges, and INPS as a shopkeeper (commerciante)",
     "the flat-rate regime (regime forfetario, revenue to EUR 85,000) taxes revenue times the activity's coefficient at 15% (5% for the first five years), replaces IRPEF and the surcharges, and cuts INPS on it by 35%; its result depends on revenue, not profit (not computed).", S["inps14"])

# ---------------------------------------------------------------- Hungary, 2026, entrepreneurial income taxation
g = "HU"
rows.append(R("tax_case_profit", g, PROFIT, "HUF", "2026", S["nav_ev"], measure="Profit of the case, full-time sole trader (főfoglalkozású egyéni vállalkozó), before the owner's drawings and contributions, 2026",
              note="No drawings (vállalkozói kivét) taken, no other income, no employees, an activity needing no secondary qualification, insured all year. HUF 40,000 is about an eighth of one month's minimum wage: the minimum contribution bases decide the result."))
mw = P(g, "Minimum wage, the monthly minimum contribution base", 322800, "HUF a month", "2026", S["hu_mw"])
tb = P(g, "Social security contribution (TB járulék), sole trader", 18.5, "%", "2026", S["nav_ev"], "On drawings, at least on the minimum wage each month.")
sz = P(g, "Social contribution tax (szocho), sole trader", 13, "%", "2026", S["nav_ev"], "On drawings, at least on the minimum wage each month; the 112.5% multiplier no longer applies from 2026.")
P(g, "The sole trader's own szocho paid is a deductible cost", 1, "1 = yes", "2026", S["nav_ev"])
P(g, "Entrepreneur's personal income tax on the business tax base", 9, "%", "2026", S["nav_ev"])
P(g, "Tax on the entrepreneur's dividend base", 15, "%", "2026", S["nav_ev"])
tbj = C(g, "Social security contribution on the minimum base", tb / 100 * mw * 12, "HUF", S["nav_ev"], "18.5% x 322,800 x 12.")
szo = C(g, "Social contribution tax on the minimum base", sz / 100 * mw * 12, "HUF", S["nav_ev"], "13% x 322,800 x 12.")
C(g, "Entrepreneur's income tax and dividend-base tax", 0, "HUF", S["nav_ev"],
  f"The business income 40,000 less the deductible szocho {szo:,.2f} is below zero, so the 9% and 15% taxes are nil.")
case(g, "HUF", PROFIT, [tbj, szo], "entrepreneurial income taxation (vállalkozói jövedelem szerinti adózás)",
     "flat-rate taxation (átalányadózás): income is revenue less a cost ratio of 80% for catering and hairdressing (45% for most activities), tax-free to half the annual minimum wage, contributions on that income with the minimum-wage floor. KATA, the fixed small-taxpayer levy, was not read. Neither is computed here.", S["nav_ev"])

write("tax-case-40000.json", "tax-case-40000",
      src("Each row's own issuer (see the row's source)", "A sole trader's tax and contributions on a profit of 40,000 in the local currency, 2026 rules, every parameter shown", S["it"]["url"]), rows)
for r in rows:
    if r["item"] in ("tax_case_total", "tax_case_share_of_profit"):
        print(r["geo"]["code"], r["item"], r["value"])
