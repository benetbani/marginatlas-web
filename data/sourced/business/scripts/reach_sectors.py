"""Writes the registers' broad sectors for the whole register of each catalog city (I3c reach step 4, data note 36).
Each row: item business_count, `sector` the sector's code, officialClass the register's own name, the city's geo, the register's unit."""
import csv, json, re, sys, collections
OUT = "/srv/atlas/wc/wt-reach/data/sourced/"
DL = "/srv/atlas/runs/reach/dl/sectors/"
def save(path, d):
    with open(OUT + path, "w", encoding="utf-8") as f: json.dump(d, f, ensure_ascii=False, indent=1); f.write("\n")
    print(path, len(d["rows"]))

# ---- UK: UK Business Counts, local units by broad industry group, March 2026
uk_url = open(DL + "uk_url.txt").read().strip()
NAME = {"E12000007": "London (Greater London)", "E08000003": "Manchester", "E08000025": "Birmingham", "E08000035": "Leeds", "E06000023": "Bristol", "S12000036": "City of Edinburgh", "S12000049": "Glasgow City"}
rows = []
for r in csv.DictReader(open(DL + "uk.csv")):
    code = r["GEOGRAPHY_CODE"]; name = r["INDUSTRY_NAME"]
    sec = name.split(" : ")[0].strip()  # the broad industry group's own number (three groups share section G)
    lvl = "the London region (all 33 boroughs)" if code == "E12000007" else "the local authority"
    rows.append({"item": "business_count", "sector": sec, "officialClass": f"UK Business Counts broad industry group {name}", "geo": {"level": "city", "code": code, "name": NAME[code]},
                 "value": int(r["OBS_VALUE"]), "unit": "local units", "year": r["DATE_NAME"], "measure": "count of local units (business sites) registered for VAT or PAYE by broad industry group, snapshot of March 2026",
                 "note": f"Measured for {lvl}; counts rounded by the publisher to the nearest 5; every industry of the register, the 18 broad groups summing to its total."})
save("business/ons-business-counts-sectors-2026.json", {"id": "ons-business-counts-sectors-2026", "source": {"publisher": "Office for National Statistics", "title": "UK Business Counts, local units by broad industry group (NM_141_1), via Nomis", "url": uk_url, "table": "NM_141_1, industry 163577857 to 163577874 (the 18 broad industry groups), employment size band Total, legal status Total, date latest (March 2026)", "licence": "Open Government Licence v3.0"}, "retrieved": "2026-10-18", "rows": rows})

# ---- US: County Business Patterns 2023, employer establishments by NAICS sector, the principal county of each catalog city
cbp = json.load(open(OUT + "business/us-cbp-nes-2023.json"))
counties = collections.OrderedDict()
for r in cbp["rows"]:
    if r["geo"]["level"] == "county": counties[r["geo"]["code"]] = r["geo"]["name"]
labels = {r["NAICS"]: r["DESCRIPTION"] for r in csv.DictReader(open(DL + "naics2017.txt", encoding="latin-1"))}
rows = []
for r in csv.DictReader(open(DL + "cbp23co.txt")):
    fips = r["fipstate"] + r["fipscty"]
    if fips not in counties: continue
    n = r["naics"]
    if not re.fullmatch(r"\d\d----", n): continue
    rows.append({"item": "business_count", "sector": n[:2], "officialClass": f"NAICS 2017 sector {n[:2]}: {labels[n]}", "geo": {"level": "county", "code": fips, "name": counties[fips]},
                 "value": int(r["est"]), "unit": "employer establishments", "year": "2023", "measure": "employer establishments by NAICS sector, week of 12 March 2023",
                 "note": "The county holding the city (the five counties of New York City each its own row): County Business Patterns publishes no city. Establishments with paid employees only; sector 99 holds those not yet classified."})
save("business/us-cbp-sectors-2023.json", {"id": "us-cbp-sectors-2023", "source": {"publisher": "U.S. Census Bureau", "title": "County Business Patterns 2023, county file (cbp23co), employer establishments by NAICS sector", "url": "https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23co.zip", "table": "cbp23co.txt, NAICS codes of the form NN---- (the sectors), field est; labels from naics2017.txt (https://www2.census.gov/programs-surveys/cbp/technical-documentation/reference/naics-descriptions/naics2017.txt)", "licence": "U.S. federal government work, public domain (17 U.S.C. 105)"}, "retrieved": "2026-10-18", "rows": rows})

# ---- Italy: ISTAT ASIA local units by Ateco section, the five comuni, 2024
ateco = open("/srv/atlas/runs/data-business/dl/it/ateco.xml", encoding="utf-8").read()
def lab(code):
    m = re.search(r'<structure:Code id="%s"[^>]*>(.*?)</structure:Code>' % code, ateco, re.S)
    n = dict(re.findall(r'<common:Name xml:lang="(\w+)">([^<]*)', m.group(1)))
    return n["it"], n["en"]
COM = {"058091": "Roma (comune)", "015146": "Milano (comune)", "063049": "Napoli (comune)", "001272": "Torino (comune)", "048017": "Firenze (comune)"}
it_url = open(DL + "it_url.txt").read().strip()
rows = []
for r in csv.DictReader(open(DL + "it.csv")):
    s = r["ECON_ACTIVITY_NACE_2007"]
    if not re.fullmatch(r"[A-U]", s): continue
    i, e = lab(s)
    rows.append({"item": "business_count", "sector": s, "officialClass": f"ATECO 2007 section {s}: {i.strip()} ({e.strip()})", "geo": {"level": "city", "code": r["REF_AREA"], "name": COM[r["REF_AREA"]]},
                 "value": int(r["OBS_VALUE"]), "unit": "local units", "year": r["TIME_PERIOD"], "measure": "number of local units of active enterprises (premises) by Ateco section, annual",
                 "note": "The register of active enterprises covers sections B to S without O (no farms, no public administration); the sections sum to its total."})
save("business/istat-asia-sections-2024.json", {"id": "istat-asia-sections-2024", "source": {"publisher": "ISTAT (Istituto Nazionale di Statistica)", "title": "Local units of active enterprises (ASIA local units), by comune and Ateco section (183_1163_DF_DICA_ASIAULP_TERRIFDATA_3)", "url": it_url, "table": "DATA_TYPE LU, size class TOTAL, 2024, the section codes B to S; labels from the dataflow's ATECO codelist", "licence": "Creative Commons Attribution 4.0 (CC BY 4.0)"}, "retrieved": "2026-10-18", "rows": rows})

# ---- NACE Rev. 2 sections from divisions (Eurostat's structure), for registers coded by class
SECTIONS = [("A", 1, 3, "Agriculture, forestry and fishing"), ("B", 5, 9, "Mining and quarrying"), ("C", 10, 33, "Manufacturing"),
  ("D", 35, 35, "Electricity, gas, steam and air conditioning supply"), ("E", 36, 39, "Water supply; sewerage, waste management and remediation activities"),
  ("F", 41, 43, "Construction"), ("G", 45, 47, "Wholesale and retail trade; repair of motor vehicles and motorcycles"), ("H", 49, 53, "Transportation and storage"),
  ("I", 55, 56, "Accommodation and food service activities"), ("J", 58, 63, "Information and communication"), ("K", 64, 66, "Financial and insurance activities"),
  ("L", 68, 68, "Real estate activities"), ("M", 69, 75, "Professional, scientific and technical activities"), ("N", 77, 82, "Administrative and support service activities"),
  ("O", 84, 84, "Public administration and defence; compulsory social security"), ("P", 85, 85, "Education"), ("Q", 86, 88, "Human health and social work activities"),
  ("R", 90, 93, "Arts, entertainment and recreation"), ("S", 94, 96, "Other service activities"), ("T", 97, 98, "Activities of households as employers"),
  ("U", 99, 99, "Activities of extraterritorial organisations and bodies")]
def section(div):
    for s, a, b, n in SECTIONS:
        if a <= div <= b: return s, n
    return None, None

# ---- France: Sirene, active establishments by NAF rév. 2 section (grouped from each establishment's APE code), the six communes
fr = json.load(open("/srv/atlas/runs/data-eucities/dl/fr/agg.json"))
FRN = {"75056": "Paris (commune)", "69123": "Lyon (commune)", "13055": "Marseille (commune)", "44109": "Nantes (commune)", "06088": "Nice (commune)", "31555": "Toulouse (commune)"}
cnt = collections.Counter(); other = collections.Counter()
for com, ape, nom, tot, emp, part in fr:
    if nom != "NAFRev2" or not ape or not re.match(r"^\d\d\.", ape): other[com] += tot; continue
    s, n = section(int(ape[:2]))
    if s: cnt[(com, s)] += tot
    else: other[com] += tot
rows = []
for (com, s), v in sorted(cnt.items()):
    n = dict((x[0], x[3]) for x in SECTIONS)[s]
    rows.append({"item": "business_count", "sector": s, "officialClass": f"NAF rév. 2 section {s} ({n})", "geo": {"level": "city", "code": com, "name": FRN[com]},
                 "value": v, "unit": "establishments", "year": "2026", "measure": "active establishments in the Sirene register by NAF rév. 2 section of their main activity (APE), file of 1 October 2026",
                 "note": f"Every active establishment, employers or not; Paris, Lyon and Marseille with their arrondissements summed. The section is the APE code's division grouped as NAF rév. 2 defines it; {other[com]} establishments coded in an older nomenclature or uncoded are in no section. Holding companies and domiciled offices are counted where registered."})
save("eucities/fr-sirene-sections-2026.json", {"id": "eucities-fr-sirene-sections-2026", "source": {"publisher": "Insee", "title": "Base Sirene des entreprises et de leurs établissements, StockEtablissement (file of 1 October 2026), active establishments grouped by NAF rév. 2 section", "url": "https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/", "table": "StockEtablissement parquet: etatAdministratifEtablissement A, codeCommuneEtablissement, activitePrincipaleEtablissement where nomenclatureActivitePrincipaleEtablissement is NAFRev2", "licence": "Licence Ouverte / Open Licence 2.0 (Etalab)"}, "retrieved": "2026-10-18", "rows": rows})

# ---- Belgium: Statbel, VAT-registered enterprises by NACE-BEL section, the City of Brussels, 31 December 2024
import zipfile, io
z = zipfile.ZipFile("/srv/atlas/runs/data-eucities/dl/be/TF_VAT_NACE_2024.zip")
cnt = collections.Counter(); names = {}
with z.open("TF_VAT_NACE_2024.txt") as fh:
    for r in csv.DictReader(io.TextIOWrapper(fh, encoding="utf-8-sig"), delimiter="|"):
        if r["CD_MUNTY_REFNIS"] != "21004": continue
        lvl1 = r["TX_NACE_EN_LVL1"]; s = lvl1.split(" ")[0]
        cnt[s] += int(r["MS_NUM_VAT"]); names[s] = lvl1[len(s) + 1:]
rows = [{"item": "business_count", "sector": s if re.fullmatch(r"[A-U]", s) else "unclassified", "officialClass": f"NACE-BEL 2008 section {s} ({names[s]})" if re.fullmatch(r"[A-U]", s) else f"NACE-BEL 2008, activity not known (published as '{s}')", "geo": {"level": "city", "code": "21004", "name": "Bruxelles / Brussel (City of Brussels, commune)"},
         "value": v, "unit": "VAT-registered enterprises", "year": "2024", "measure": "number of enterprises subject to VAT by the commune of the registered office and NACE-BEL section, active on 31 December 2024 (MS_NUM_VAT)",
         "note": "The City of Brussels (commune 21004) only, not the 19 communes of the region; an enterprise counts where its registered office is."} for s, v in sorted(cnt.items())]
save("eucities/be-statbel-sections-2024.json", {"id": "eucities-be-statbel-sections-2024", "source": {"publisher": "Statbel (Belgian statistical office)", "title": "Enterprises subject to VAT according to legal form, 2024 (TF_VAT_NACE_2024), summed by NACE-BEL section", "url": "https://statbel.fgov.be/sites/default/files/files/opendata/btw-plichtige/rechtsvorm/TF_VAT_NACE_2024.zip", "table": "TF_VAT_NACE_2024.txt, CD_MUNTY_REFNIS 21004, MS_NUM_VAT summed by TX_NACE_EN_LVL1", "licence": "Open data licence of Statbel (CC BY 4.0)"}, "retrieved": "2026-10-18", "rows": rows})

# ---- The Netherlands: CBS, establishments by SBI section, the two gemeenten, 1 January 2026
D = "/srv/atlas/runs/data-eucities/dl/nl/"
sbig = {t["Key"]: t["Title"] for t in json.load(open(D + "sbi.json"))["value"]}
GM = {"GM0363": "Amsterdam (gemeente)", "GM0599": "Rotterdam (gemeente)"}
rows = []
for r in json.load(open(D + "gm.json"))["value"]:
    k = r["BedrijfstakkenBranchesSBI2008"]; t = sbig[k].strip(); s = t.split(" ")[0]
    if not re.fullmatch(r"[A-U]", s) or r["Vestigingen_1"] is None: continue
    rows.append({"item": "business_count", "sector": s, "officialClass": f"SBI 2008 section {t} ({dict((x[0], x[3]) for x in SECTIONS)[s]})", "geo": {"level": "city", "code": r["RegioS"].strip(), "name": GM[r["RegioS"].strip()]},
                 "value": r["Vestigingen_1"], "unit": "establishments", "year": "2026", "measure": "number of business establishments (vestigingen) in the business register by SBI section, 1 January 2026, provisional",
                 "note": "The gemeente's establishments by section, the finest the municipal table publishes."})
save("eucities/nl-cbs-sections-2026.json", {"id": "eucities-nl-cbs-sections-2026", "source": {"publisher": "CBS (Centraal Bureau voor de Statistiek)", "title": "Vestigingen van bedrijven; bedrijfstak, gemeente (81575NED), by SBI section", "url": "https://opendata.cbs.nl/ODataApi/odata/81575NED", "table": "81575NED, Perioden 2026JJ00, RegioS GM0363 and GM0599, the SBI 2008 sections A to U", "licence": "CC BY 4.0"}, "retrieved": "2026-10-18", "rows": rows})
