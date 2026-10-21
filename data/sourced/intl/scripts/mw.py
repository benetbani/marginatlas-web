"""Legal minimum wages of the countries this domain covers, each read on its government's own page or legal text on
2026-10-18 (raw copies in /srv/atlas/runs/data-intl/dl/mw where the site let the server download them; pages that refuse the
server were read through a web fetch tool, which the report names). Values typed from those pages, one row per published rate.
"""
from lib import write, RETRIEVED


def S(publisher, title, url):
    return {"publisher": publisher, "title": title, "url": url}


MHLW = S("Ministry of Health, Labour and Welfare (Japan)", "FY2026 (Reiwa 8) regional minimum wages, national list (令和8年度地域別最低賃金全国一覧)", "https://www.mhlw.go.jp/content/11200000/001753404.pdf")
KR = S("Minimum Wage Commission (Republic of Korea)", "Minimum wage decisions by year (연도별 최저임금 결정현황)", "https://www.minimumwage.go.kr/minWage/policy/decisionMain.do")
NZ = S("Employment New Zealand (Ministry of Business, Innovation and Employment)", "Minimum wage is increasing on 1 April 2026", "https://www.employment.govt.nz/news-and-updates/minimum-wage-is-increasing-on-1-april-2026")
AU = S("Fair Work Ombudsman (Australian Government)", "Minimum wages", "https://www.fairwork.gov.au/pay-and-wages/minimum-wages")
ON = S("Government of Ontario", "Your guide to the Employment Standards Act: Minimum wage", "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage")
QC = S("Commission des normes, de l'équité, de la santé et de la sécurité du travail (CNESST), Québec", "Minimum wage in Québec", "https://www.cnesst.gouv.qc.ca/en/working-conditions/wage-and-pay/wages/minimum-wage")
QCN = S("Gouvernement du Québec, ministère du Travail", "Hausse du salaire minimum, 1er mai 2026", "https://www.quebec.ca/nouvelles/actualites/details/hausse-du-salaire-minimum-des-aujourdhui-le-taux-general-du-salaire-minimum-setablit-a-1660-lheure-70097")
BC = S("Government of British Columbia", "Minimum wage", "https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/wages/minimum-wage")
AB = S("Government of Alberta", "Employment standards rules: Minimum wage", "https://www.alberta.ca/minimum-wage")
TR = S("Ministry of Labour and Social Security (Türkiye)", "Asgari ücretin net hesabı ve işverene maliyeti, 01/01/2026 - 31/12/2026", "https://www.csgb.gov.tr/poco-pages/asgari-ucret/")
MX = S("Comisión Nacional de los Salarios Mínimos, Diario Oficial de la Federación (Mexico)", "Resolución que fija los salarios mínimos generales y profesionales a partir del 1 de enero de 2026 (DOF 09/12/2025)", "https://dof.gob.mx/nota_detalle.php?codigo=5775534&fecha=09/12/2025")
IL = S("National Insurance Institute of Israel (Bituach Leumi)", "Minimum wage: general data (שכר מינימום - נתונים כלליים)", "https://www.btl.gov.il/Mediniyut/GeneralData/Pages/%D7%A9%D7%9B%D7%A8%20%D7%9E%D7%99%D7%A0%D7%99%D7%9E%D7%95%D7%9D.aspx")
CL = S("Dirección del Trabajo (Chile)", "¿Cuál es el valor del ingreso mínimo mensual? (Ley N° 21.830, Diario Oficial 22.06.2026)", "https://www.dt.gob.cl/portal/1628/w3-article-60141.html")
CO = S("Presidencia de la República, Ministerio del Trabajo (Colombia)", "Decreto 0159 del 19 de febrero de 2026, por el cual se fija transitoriamente el salario mínimo mensual legal del año 2026", "https://dapre.presidencia.gov.co/normativa/normativa/DECRETO%20No.%200159%20DEL%2019%20DE%20FEBRERO%20DE%202026.pdf")
CR = S("Ministerio de Trabajo y Seguridad Social (Costa Rica)", "Lista de salarios mínimos 2026 (rige 1 de enero de 2026)", "https://www.mtss.go.cr/temas-laborales/salarios/lista_salarios_minimos_2026.pdf")
BR = S("Presidência da República (Brazil)", "Decreto nº 12.797, de 23 de dezembro de 2025 (salário mínimo a partir de 1º de janeiro de 2026)", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm")


def c(code, name):
    return {"level": "country", "code": code, "name": name}


def r(code, name):
    return {"level": "region", "code": code, "name": name}


rows = []


def add(geo, value, unit, year, measure, src, note=None):
    row = {"item": "minimum_wage", "geo": geo, "value": value, "unit": unit, "year": year, "measure": measure, "source": src}
    if note:
        row["note"] = note
    rows.append(row)


# Japan: prefectural minimum wages (no national rate); FY2026 revision, each prefecture's own effective date
JP = [("JP-01", "Hokkaido (Sapporo)", 1131, 1075, "2026-10-01"), ("JP-04", "Miyagi (Sendai)", 1098, 1038, "2026-10-01"),
      ("JP-13", "Tokyo", 1280, 1226, "2026-10-01"), ("JP-14", "Kanagawa (Yokohama)", 1279, 1225, "2026-10-01"),
      ("JP-23", "Aichi (Nagoya)", 1195, 1140, "2026-10-01"), ("JP-26", "Kyoto", 1180, 1122, "2026-11-16"),
      ("JP-27", "Osaka", 1231, 1177, "2026-10-01"), ("JP-28", "Hyogo (Kobe)", 1172, 1116, "2026-10-01"),
      ("JP-34", "Hiroshima", 1141, 1085, "2026-10-11"), ("JP-40", "Fukuoka", 1114, 1057, "2026-10-04")]
for code, name, new, old, eff in JP:
    add(r(code, name), new, "JPY per hour", eff, "regional (prefectural) minimum wage per hour, FY2026 revision", MHLW,
        f"Japan sets minimum wages by prefecture. In force from {eff}; it replaces {old:,} JPY.")
add(r("JP-26", "Kyoto"), 1122, "JPY per hour", "2025", "regional (prefectural) minimum wage per hour, FY2025 rate", MHLW,
    "In force until 15 November 2026, replaced by 1,180 JPY from 16 November 2026 (the list prints it as the rate before revision).")
add(c("JP", "Japan"), 1177, "JPY per hour", "2026", "national weighted average of the 47 prefectural minimum wages, FY2026 revision (not a legal rate itself)", MHLW,
    "A weighted average published with the list (1,121 JPY before the revision); the legal rate is the prefecture's.")
# Korea
add(c("KR", "Korea"), 10320, "KRW per hour", "2026-01-01", "statutory minimum wage per hour, all workplaces, 1 January to 31 December 2026", KR, "Monthly equivalent published: 2,156,880 KRW (209 hours).")
add(c("KR", "Korea"), 10700, "KRW per hour", "2027-01-01", "statutory minimum wage per hour, from 1 January 2027 (decided 14 July 2026, notified 5 August 2026)", KR, "Monthly equivalent published: 2,236,300 KRW (209 hours).")
# New Zealand
add(c("NZ", "New Zealand"), 23.95, "NZD per hour", "2026-04-01", "adult minimum wage per hour", NZ, "Up from 23.50 NZD.")
add(c("NZ", "New Zealand"), 19.16, "NZD per hour", "2026-04-01", "starting-out and training minimum wage per hour", NZ, "Up from 18.80 NZD.")
# Australia
add(c("AU", "Australia"), 26.44, "AUD per hour", "2026-07-01", "National Minimum Wage per hour (employees not covered by an award or agreement)", AU,
    "1,004.90 AUD per week. Applies from the first full pay period on or after 1 July 2026; most employees are covered by an award, whose rates may be higher.")
# Canada: provincial general minimum wages for the four catalog cities' provinces
add(r("CA-ON", "Ontario (Toronto)"), 17.95, "CAD per hour", "2026-10-01", "general minimum wage per hour", ON, "Rates from 1 October 2026 to 30 September 2027; 17.60 CAD before. Student minimum wage 16.90 CAD.")
add(r("CA-QC", "Quebec (Montréal)"), 16.60, "CAD per hour", "2026-05-01", "general minimum wage rate per hour", QC, "Up 0.50 CAD on 1 May 2026 (government release of that day).")
add(r("CA-QC", "Quebec (Montréal)"), 13.30, "CAD per hour", "2026-05-01", "minimum wage per hour for employees receiving tips", QCN)
add(r("CA-BC", "British Columbia (Vancouver)"), 18.25, "CAD per hour", "2026-06-01", "general minimum wage per hour", BC, "17.85 CAD from 1 June 2025.")
add(r("CA-AB", "Alberta (Calgary)"), 15.00, "CAD per hour", "2026", "general minimum wage per hour (Employment Standards Regulation)", AB,
    "The page gives no effective date for the current rate. Students under 18: 13 CAD for the first 28 hours a week in school term.")
# Türkiye
add(c("TR", "Türkiye"), 33030.00, "TRY per month (gross)", "2026-01-01", "gross monthly minimum wage, 1 January to 31 December 2026", TR, "Net after employee social security (14%) and unemployment insurance (1%): 28,075.50 TRY.")
# Mexico
add(c("MX", "Mexico"), 315.04, "MXN per day", "2026-01-01", "general minimum wage per day, general minimum wage zone (all of the country outside the northern border free zone, Mexico City included)", MX)
add(c("MX", "Mexico"), 440.87, "MXN per day", "2026-01-01", "minimum wage per day, Northern Border Free Zone", MX)
# Israel
add(c("IL", "Israel"), 6443.85, "ILS per month", "2026-04-01", "monthly minimum wage, workers aged 18 and over", IL, "Hourly: 35.40 ILS on 182 hours a month, 34.64 ILS on 186 hours.")
add(c("IL", "Israel"), 35.40, "ILS per hour", "2026-04-01", "hourly minimum wage, workers aged 18 and over, 182-hour month", IL)
# Chile
add(c("CL", "Chile"), 553553, "CLP per month", "2026-05-01", "ingreso mínimo mensual, workers aged 18 to 65", CL, "Ley 21.830 (Diario Oficial 22 June 2026), retroactive to 1 May 2026. Under 18 and over 65: 412,938 CLP.")
# Colombia
add(c("CO", "Colombia"), 1750905, "COP per month", "2026-02-19", "salario mínimo legal mensual 2026, fixed transitorily by Decree 0159 of 19 February 2026", CO,
    "Transitory, until the Council of State rules on the annulment case against Decree 1469 of 2025, which set the same amount from 1 January 2026.")
# Costa Rica: minimums are set per occupation category
add(c("CR", "Costa Rica"), 373092.30, "CRC per month", "2026-01-01", "minimum monthly wage, generic unskilled worker (TONCG)", CR, "Costa Rica sets minimum wages by occupation category.")
add(c("CR", "Costa Rica"), 12436.41, "CRC per day", "2026-01-01", "minimum daily wage, unskilled worker (TONC): the category of waiters (salonero)", CR)
add(c("CR", "Costa Rica"), 13991.86, "CRC per day", "2026-01-01", "minimum daily wage, skilled worker (TOC): the category of cooks (cocinero) and barbers (barbero)", CR)
# Brazil
add(c("BR", "Brazil"), 1621.00, "BRL per month", "2026-01-01", "national minimum wage per month", BR, "Daily 54.04 BRL, hourly 7.37 BRL (the decree's sole paragraph).")

# South Africa
ZA = S("Department of Employment and Labour (South Africa), Government Gazette 54075", "National Minimum Wage Act No. 9 of 2018: Amendment of National Minimum Wage 2026 (Notice R. 7083, 3 February 2026)",
       "https://www.gov.za/sites/default/files/gcis_document/202602/54075rg11941gon7083.pdf")
add(c("ZA", "South Africa"), 30.23, "ZAR per hour", "2026-03-01", "national minimum wage for each ordinary hour worked (farm and domestic workers included)", ZA,
    "Binding from 1 March 2026. Expanded public works programme workers: 16.62 ZAR an hour.")
# China: minimum wages are set by each province or municipality
SHS = S("Shanghai Municipal Human Resources and Social Security Bureau", "Notice on adjusting the city's minimum wage standard (沪人社规〔2025〕10号)", "https://rsj.sh.gov.cn/tgzfl_17732/20250714/t0035_1434097.html")
add({"level": "city", "code": "CN-SH", "name": "Shanghai (municipality)"}, 2740, "CNY per month", "2025-07-01", "monthly minimum wage, full-time workers (excluding the worker's own social insurance and housing fund contributions)", SHS,
    "Set by the municipality; the latest adjustment in the bureau's list of notices (read 2026-10-18). Up from 2,690 CNY.")
add({"level": "city", "code": "CN-SH", "name": "Shanghai (municipality)"}, 25, "CNY per hour", "2025-07-01", "hourly minimum wage, part-time workers", SHS, "Up from 24 CNY.")
# Indonesia: provincial minimum wage
JKT = S("Ministry of Manpower (Kementerian Ketenagakerjaan), Indonesia", "News: UMP DKI Jakarta 2026 (Governor's Decree 1142 of 2025 on the 2026 provincial minimum wage)",
        "https://kemnaker.go.id/news/detail/wamenaker-apresiasi-paket-kebijakan-kesejahteraan-pekerja-dki-pascapenetapan-ump-2026-bisa-dicontoh-oleh-daerah-lain")
add(r("ID-JK", "DKI Jakarta"), 5729876, "IDR per month", "2026-01-01", "provincial minimum wage (UMP), workers with less than one year of service", JKT,
    "Governor's Decree 1142 of 2025 (listed in force on jdih.jakarta.go.id). Up from 5,396,761 IDR in 2025.")

write("minimum-wages.json", {
    "id": "intl-minimum-wages",
    "source": {"publisher": "National governments (each row names its own page)", "title": "Legal minimum wages, read on each government's page or legal text",
               "url": "https://www.ilo.org/ilostat", "table": "ILOSTAT used only to locate the rates; every value is from the row's own government source",
               "licence": "Official public notices and legal texts"},
    "retrieved": RETRIEVED, "rows": rows})
