"""Legal forms for GB, US (California), IT and HU: registration fee, wait, minimum capital and the owner's liability, each from the
registry's, the tax authority's or the statute's own page, for the rows data/sourced/rules/registration.json does not hold.
Every row carries the words it was read from (`quote`), and the script checks each quote is in the downloaded page."""
import html, json, os, re

DL = "/srv/atlas/runs/data-spines/dl/rules"
RETRIEVED = "2026-10-19"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "legal-forms.json")


def text(f):
    s = open(os.path.join(DL, f), encoding="utf-8", errors="replace").read()
    if f.endswith(".txt"):
        return re.sub(r"\s+", " ", s)
    s = s.replace("\\u003c", "<").replace("\\u003e", ">").replace('\\"', '"').replace("\\n", " ")
    t = html.unescape(re.sub(r"<[^>]+>", " ", s))
    return re.sub(r"\s+", " ", t.replace(" ", " ").replace("Â", " "))


S = {
    "ch_fees": ("Companies House", "Companies House fees", "https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees", "ch_fees.html"),
    "gov_reg": ("GOV.UK", "Set up a private limited company: register your company", "https://www.gov.uk/limited-company-formation/register-your-company", "limited-company-formation_register-your-company.html"),
    "gov_ltd": ("GOV.UK", "Set up a private limited company", "https://www.gov.uk/limited-company-formation", "limited-company-formation.html"),
    "gov_st": ("GOV.UK", "Set up as a sole trader", "https://www.gov.uk/set-up-sole-trader", "set-up-sole-trader.html"),
    "gov_p": ("GOV.UK", "Set up a business partnership", "https://www.gov.uk/set-up-business-partnership", "set-up-business-partnership.html"),
    "ca_types": ("California Secretary of State", "Business Entities: types of business entities", "https://www.sos.ca.gov/business-programs/business-entities/starting-business/types", "ca_types.html"),
    "ca_corp": ("California Secretary of State", "Forms, samples and fees: corporations (California domestic)", "https://www.sos.ca.gov/business-programs/business-entities/forms/corporations-california-domestic", "ca_f_corporations-california-domestic.html"),
    "ca_gp": ("California Secretary of State", "Forms, samples and fees: general partnership", "https://www.sos.ca.gov/business-programs/business-entities/forms/general-partnership", "ca_f_general-partnership.html"),
    "ca_lp": ("California Secretary of State", "Forms, samples and fees: limited partnership (California domestic)", "https://www.sos.ca.gov/business-programs/business-entities/forms/limited-partnership-california-domestic", "ca_f_limited-partnership-california-domestic.html"),
    "la_fbn": ("Los Angeles County Registrar-Recorder/County Clerk", "Fictitious business names: frequently asked questions", "https://lavote.gov/home/county-clerk/fictitious-business-names/frequently-asked-questions", "lavote_frequently-asked-questions.html"),
    "la_fbn_online": ("Los Angeles County Registrar-Recorder/County Clerk", "Fictitious business names: filing", "https://lavote.gov/home/county-clerk/fictitious-business-names/filing", "lavote_filing.html"),
    "it_guide": ("Camera di Commercio della Toscana Nord-Ovest (published by Unioncamere)", "La scelta della forma giuridica: responsabilità, costi e tassazione", "https://sni.unioncamere.it/sites/default/files/approfondimento/documenti/GUIDA%20TNO%20-%20La%20scelta%20della%20forma%20giuridica.pdf", "unioncamere_forme.txt"),
    "hu_ptk": ("Nemzeti Jogszabálytár", "2013. évi V. törvény a Polgári Törvénykönyvről", "https://njt.jog.gov.hu/jogszabaly/2013-5-00-00", "ptk.html"),
    "hu_evectv": ("Nemzeti Jogszabálytár", "2009. évi CXV. törvény az egyéni vállalkozóról és az egyéni cégről", "https://njt.jog.gov.hu/jogszabaly/2009-115-00-00", "evectv.html"),
    "hu_court": ("Országos Bírósági Hivatal (birosag.hu)", "A cégbejegyzési kérelem benyújtása", "https://birosag.hu/ugyfeleknek/birosagi-eljarasok/cegeljaras/cegbejegyzesi-kerelem-benyujtasa", "birosag.html"),
}
GB = {"level": "country", "code": "GB", "name": "United Kingdom"}
CA = {"level": "region", "code": "06", "name": "California"}
LAC = {"level": "county", "code": "06037", "name": "Los Angeles County"}
IT = {"level": "country", "code": "IT", "name": "Italy"}
HU = {"level": "country", "code": "HU", "name": "Hungary"}

# (geo, legal form, attribute, value, unit, measure, note, source key, quote)
R = [
    (GB, "Private limited company", "registration_wait", 24, "hours", "usual time for Companies House to register a company online", "Usually: the page sets no deadline.", "gov_reg", "Your company is usually registered within 24 hours"),
    (GB, "Private limited company", "registration_fee", 156, "GBP", "same day incorporation (software filing)", "The standard online fee (GBP 100) is in registration.json.", "ch_fees", "Same day incorporation | | £156"),
    (GB, "Private limited company", "registration_fee", 124, "GBP", "incorporation on paper", None, "ch_fees", "Incorporation | £100 | £100 | £124"),
    (GB, "Private limited company", "minimum_capital", None, "GBP", "minimum share capital", "No minimum: the price of an individual share can be any value, and shareholders pay for their shares in full if the company shuts down.", "gov_ltd", "The price of an individual share can be any value"),
    (GB, "Private limited company", "liability", None, "none", "the owners' liability for the business's debts", "Limited: owners are responsible for business debts only up to the value of their financial investment.", "gov_ltd", "owners are responsible for business debts only up to the value of their financial investment"),
    (GB, "Sole trader", "registration_wait", 0, "days", "wait before trading", "None: a sole trader can start trading straight away and registers for Self Assessment if earning more than GBP 1,000 in a tax year.", "gov_st", "You can start trading straight away without registering"),
    (GB, "Sole trader", "liability", None, "none", "the owner's liability for the business's debts", "Unlimited: the owner is personally responsible for all of the debts of the business.", "gov_st", "owners are personally responsible for all of the debts of the business"),
    (GB, "Partnership", "liability", None, "none", "the partners' liability for the business's debts", "Shared and personal: the partners personally share responsibility for the business, its losses and its bills.", "gov_p", "personally share responsibility for your business"),
    (GB, "Limited liability partnership (LLP)", "registration_fee", 100, "GBP", "incorporation of an LLP (software filing)", "No online service for an LLP; GBP 124 on paper, GBP 156 the same day.", "ch_fees", "Incorporation of an | LLP | | £100 | £124"),
    (GB, "Limited partnership (LP)", "registration_fee", 124, "GBP", "registration of a limited partnership (paper)", None, "ch_fees", "Registration of a limited partnership | £124"),
    (CA, "Corporation (general stock)", "registration_fee", 100, "USD", "Articles of Incorporation, general stock (form ARTS-GS)", None, "ca_corp", "Articles of Incorporation - General Stock | Form ARTS-GS (PDF) | $100.00"),
    (CA, "Corporation (general stock)", "liability", None, "none", "the owners' liability for the business's debts", "Generally limited: a corporation exists separately from its owners and normally limits them from personal liability.", "ca_types", "normally limiting the owners from personal liability"),
    (CA, "Limited liability company (LLC)", "liability", None, "none", "the members' liability for the business's debts", "Generally limited: liability protection similar to that of a corporation. The fees are in registration.json.", "ca_types", "generally offers liability protection similar to that of a corporation"),
    (CA, "General partnership (GP)", "registration_fee", 70, "USD", "Statement of Partnership Authority (form GP-1)", "Optional: registering a general partnership with the state is not required.", "ca_gp", "Statement of Partnership Authority | Form GP-1 (PDF) | $70.00"),
    (CA, "General partnership (GP)", "liability", None, "none", "the partners' liability for the business's debts", "Unlimited, joint and several: all partners are liable for all obligations of the partnership unless the claimant agrees otherwise.", "ca_types", "all partners are liable jointly and severally for all obligations of the partnership"),
    (CA, "Limited partnership (LP)", "registration_fee", 70, "USD", "Certificate of Limited Partnership (form LP-1)", None, "ca_lp", "Certificate of Limited Partnership | Form LP-1 (PDF) | $70.00"),
    (CA, "Limited partnership (LP)", "liability", None, "none", "the partners' liability for the business's debts", "Split: general partners have unlimited personal liability; a limited partner's liability is normally limited.", "ca_types", "General partners of an LP have unlimited personal liability"),
    (CA, "Sole proprietorship", "registration_fee", 0, "USD", "state formation filing", "None at the state: no formation documents are filed with the Secretary of State. A trading name other than the owner's needs a county Fictitious Business Name Statement.", "ca_types", "No formation documents are filed with the California Secretary of State"),
    (CA, "Sole proprietorship", "liability", None, "none", "the owner's liability for the business's debts", "Unlimited: the sole proprietor is responsible for the taxes and liabilities of the business.", "ca_types", "is responsible for taxes and liabilities of the business"),
    (LAC, "Sole proprietorship (trading under another name)", "registration_fee", 26, "USD", "Fictitious Business Name Statement, original filing, one name and one registrant", "USD 5 for each additional name or registrant; filing online adds a USD 10.75 service fee; the statement expires after 5 years.", "la_fbn", "Both are $26.00 for one business name and one registrant"),
    (IT, "Impresa individuale (sole trader)", "registration_wait", 24, "hours", "time to open", "Can be opened in less than 24 hours, the chamber's guide says.", "it_guide", "anche in meno di 24 ore"),
    (IT, "Impresa individuale (sole trader)", "minimum_capital", 0, "EUR", "capital to be paid in", "No capital is required.", "it_guide", "Non richiede versamento di capitali"),
    (IT, "Impresa individuale (sole trader)", "liability", None, "none", "the owner's liability for the business's debts", "Unlimited: the owner answers for the business's debts with all personal assets.", "it_guide", "Il titolare risponde illimitatamente con il proprio patrimonio personale"),
    (IT, "Società in nome collettivo (S.n.c.)", "liability", None, "none", "the partners' liability for the business's debts", "Unlimited and joint: every partner answers with personal assets for the company's debts.", "it_guide", "Tutti i soci sono amministratori e hanno responsabilità illimitata e solidale"),
    (IT, "Società in nome collettivo (S.n.c.)", "minimum_capital", 0, "EUR", "minimum capital", "No minimum capital for partnerships (S.n.c. and S.a.s.).", "it_guide", "non è necessario un capitale minimo di partenza"),
    (IT, "Società in accomandita semplice (S.a.s.)", "liability", None, "none", "the partners' liability for the business's debts", "Split: limited partners (accomandanti) answer up to the capital paid in; general partners (accomandatari) answer without limit.", "it_guide", "Soci Accomandanti: Hanno una responsabilità limitata al capitale sociale versato"),
    (IT, "Società in accomandita semplice (S.a.s.)", "minimum_capital", 0, "EUR", "minimum capital", "No minimum capital for partnerships (S.n.c. and S.a.s.).", "it_guide", "non è necessario un capitale minimo di partenza"),
    (IT, "Società a responsabilità limitata (S.r.l.)", "liability", None, "none", "the members' liability for the business's debts", "Limited: members answer only up to the share capital paid in. The fees and the capital are in registration.json.", "it_guide", "I soci rispondono solo entro il capitale sociale versato"),
    (IT, "Società a responsabilità limitata (S.r.l.)", "minimum_capital_paid", 2500, "EUR", "capital to be paid in at formation, standard S.r.l.", "At least 25 percent of the EUR 10,000 standard minimum.", "it_guide", "almeno il 25% deve essere versato al momento della costituzione (minimo 2.500 euro)"),
    (IT, "Società a responsabilità limitata semplificata (S.r.l.s.)", "notary_fee", 0, "EUR", "notary's fee for the deed of formation", "No notary's fee: the deed follows the standard model.", "it_guide", "Non prevede costi notarili"),
    (IT, "Società a responsabilità limitata semplificata (S.r.l.s.)", "liability", None, "none", "the members' liability for the business's debts", "Limited, as an S.r.l.: personal assets stay separate from the company's.", "it_guide", "Questa caratteristica è tipica delle Società a Responsabilità Limitata (SRL), delle Società a Responsabilità Limitata Semplificata (SRLS)"),
    (HU, "Egyéni vállalkozó (sole trader)", "liability", None, "none", "the owner's liability for the business's debts", "Unlimited: the sole trader answers with all assets for the obligations of the business (Act CXV of 2009, s. 15).", "hu_evectv", "egyéni vállalkozói tevékenységéből eredő kötelezettségeiért teljes vagyonával felel"),
    (HU, "Korlátolt felelősségű társaság (Kft)", "liability", None, "none", "the members' liability for the business's debts", "Limited: a member is not bound to answer for the company's obligations unless the law says otherwise (Civil Code 3:159).", "hu_ptk", "A társaság kötelezettségeiért – ha e törvény eltérően nem rendelkezik – a tag nem köteles helytállni"),
    (HU, "Korlátolt felelősségű társaság (Kft)", "minimum_contribution", 100000, "HUF", "smallest contribution of one member", "Each member's contribution is at least HUF 100,000 (Civil Code 3:161); the HUF 3,000,000 minimum capital is in registration.json.", "hu_ptk", "az egyes törzsbetétek mértéke nem lehet kevesebb százezer forintnál"),
    (HU, "Közkereseti társaság (Kkt)", "registration_fee", 0, "HUF", "court registration duty and publication fee", "Free in the simplified and the general procedure.", "hu_court", "kft., bt., kkt, egyéni cég - ingyenes"),
    (HU, "Közkereseti társaság (Kkt)", "registration_wait", 1, "working days", "court's deadline to decide, simplified procedure", "General procedure: 15 working days.", "hu_court", "egyszerűsített eljárás 1 munkanap"),
    (HU, "Közkereseti társaság (Kkt)", "liability", None, "none", "the members' liability for the business's debts", "Unlimited and joint: members answer for obligations the company's assets do not cover (Civil Code 3:138).", "hu_ptk", "korlátlanul és egyetemlegesen helytállnak"),
    (HU, "Betéti társaság (Bt)", "registration_fee", 0, "HUF", "court registration duty and publication fee", "Free in the simplified and the general procedure.", "hu_court", "kft., bt., kkt, egyéni cég - ingyenes"),
    (HU, "Betéti társaság (Bt)", "registration_wait", 1, "working days", "court's deadline to decide, simplified procedure", "General procedure: 15 working days.", "hu_court", "egyszerűsített eljárás 1 munkanap"),
    (HU, "Betéti társaság (Bt)", "liability", None, "none", "the members' liability for the business's debts", "Split: at least one member (beltag) answers jointly without limit; a limited member (kültag) does not, unless the law says otherwise (Civil Code 3:154).", "hu_ptk", "nem tartozik helytállási kötelezettséggel"),
    (HU, "Zártkörűen működő részvénytársaság (Zrt)", "registration_fee", 50000, "HUF", "court registration duty, simplified procedure", "General procedure: HUF 100,000 duty and a HUF 5,000 publication fee.", "hu_court", "zrt-50.000 Ft"),
    (HU, "Zártkörűen működő részvénytársaság (Zrt)", "minimum_capital", 5000000, "HUF", "minimum share capital", "Civil Code 3:212 (2).", "hu_ptk", "zártkörűen működő részvénytársaság alaptőkéje nem lehet kevesebb ötmillió forintnál"),
]
cache, rows, bad = {}, [], []
for geo, form, attr, val, unit, measure, note, sk, quote in R:
    pub, title, url, f = S[sk]
    t = cache.setdefault(f, text(f))
    if re.sub(r"[\s|]+", " ", quote) not in re.sub(r"[\s|]+", " ", t):
        bad.append((form, attr, quote))
    row = {"item": "legal_form", "legalForm": form, "attribute": attr, "geo": geo, "value": val, "unit": unit, "year": "2026",
           "measure": f"{form}: {measure}", "quote": quote,
           "source": {"publisher": pub, "title": title, "url": url}}
    if note:
        row["note"] = note
    rows.append(row)
if bad:
    raise SystemExit("quotes not found in the downloaded pages: " + json.dumps(bad, ensure_ascii=False, indent=1))
with open(OUT, "w", encoding="utf-8") as fh:
    json.dump({"id": "legal-forms", "source": {"publisher": "Each row's own issuer (see the row's source)",
               "title": "Legal forms: registration fee, wait, minimum capital and the owner's liability, GB, California, Italy, Hungary",
               "url": "https://www.gov.uk/business-legal-structures",
               "table": "Rows not already in registration.json; every row's `quote` is the publisher's own words, checked against the page downloaded on the retrieval date"},
               "retrieved": RETRIEVED, "rows": rows}, fh, ensure_ascii=False, indent=1)
    fh.write("\n")
print("wrote", OUT, len(rows), "rows")
