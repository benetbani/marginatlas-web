"""Step 2 of the plan's Task 3: each row read from the government's or issuer's own page (downloaded copies under
/srv/atlas/wc/cwd/data-rules/dl/pages/, retrieved 2026-10-17). Run: python build_step2.py [file ...]"""
import sys
from lib import R, src, write

# ---------------------------------------------------------------- sources (one per page read)
S = {
    # United Kingdom
    "ch_fees": src("Companies House", "Companies House fees", "https://www.gov.uk/government/publications/companies-house-fees/companies-house-fees"),
    "soletrader": src("GOV.UK", "Set up as a sole trader", "https://www.gov.uk/set-up-sole-trader"),
    "ct": src("HM Revenue & Customs", "Corporation Tax rates, expenses and reliefs: Rates", "https://www.gov.uk/corporation-tax-rates"),
    "it": src("HM Revenue & Customs", "Income Tax rates and Personal Allowances", "https://www.gov.uk/income-tax-rates"),
    "class4": src("HM Revenue & Customs", "Self-employed National Insurance rates", "https://www.gov.uk/self-employed-national-insurance-rates"),
    "vatrates": src("HM Revenue & Customs", "VAT rates", "https://www.gov.uk/vat-rates"),
    "vat709": src("HM Revenue & Customs", "Catering, takeaway food and VAT (VAT Notice 709/1)", "https://www.gov.uk/guidance/catering-takeaway-food-and-vat-notice-7091"),
    "vatreg": src("HM Revenue & Customs", "Register for VAT: when to register", "https://www.gov.uk/vat-registration/when-to-register"),
    "er2627": src("HM Revenue & Customs", "Rates and thresholds for employers 2026 to 2027", "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027"),
    "er2526": src("HM Revenue & Customs", "Rates and thresholds for employers 2025 to 2026", "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2025-to-2026"),
    "er2425": src("HM Revenue & Customs", "Rates and thresholds for employers 2024 to 2025", "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2024-to-2025"),
    "pension": src("GOV.UK", "Workplace pensions: what you, your employer and the government pay", "https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay"),
    "nmw": src("GOV.UK", "National Minimum Wage and National Living Wage rates", "https://www.gov.uk/national-minimum-wage-rates"),
    "holiday": src("GOV.UK", "Holiday entitlement", "https://www.gov.uk/holiday-entitlement-rights"),
    "notice": src("GOV.UK", "Redundancy: your rights, notice periods", "https://www.gov.uk/redundant-your-rights/notice-periods"),
    "ratescalc": src("GOV.UK", "Estimate your business rates", "https://www.gov.uk/calculate-your-business-rates"),
    "sbrr": src("GOV.UK", "Business rates relief: Small business rate relief", "https://www.gov.uk/apply-for-business-rate-relief/small-business-rate-relief"),
    "startfood": src("Food Standards Agency", "Starting a food business", "https://www.gov.uk/guidance/starting-a-food-business"),
    "alcfees": src("Home Office", "Alcohol licensing fee levels: main fee levels", "https://www.gov.uk/government/publications/alcohol-licensing-fee-levels/main-fee-levels"),
    "pavement": src("Ministry of Housing, Communities and Local Government", "Pavement licences: guidance", "https://www.gov.uk/government/publications/pavement-licences-guidance"),
    "personal": src("GOV.UK", "Personal licence to sell alcohol (England and Wales)", "https://www.gov.uk/personal-licence-to-sell-alcohol"),
    "cityhair": src("City of London Corporation", "Hairdresser and Barber registration", "https://www.cityoflondon.gov.uk/services/licensing/other-licence-and-business-permit-types/hairdresser-registration"),
    "bankr": src("GOV.UK", "Applying to become bankrupt", "https://www.gov.uk/bankruptcy"),
    "bankr_end": src("GOV.UK", "Becoming bankrupt: when bankruptcy ends", "https://www.gov.uk/becoming-bankrupt/when-bankruptcy-ends"),
    "liq_court": src("GOV.UK", "Liquidate your limited company: apply directly to the court", "https://www.gov.uk/liquidate-your-company/apply-to-court"),
    # United States, California, Los Angeles
    "irs_corp": src("Internal Revenue Service", "Corporations", "https://www.irs.gov/businesses/small-businesses-self-employed/corporations"),
    "irs_2026": src("Internal Revenue Service", "IRS releases tax inflation adjustments for tax year 2026", "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill"),
    "irs_se": src("Internal Revenue Service", "Self-employment tax (Social Security and Medicare taxes)", "https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes"),
    "irs_fica": src("Internal Revenue Service", "Topic no. 751, Social Security and Medicare withholding rates", "https://www.irs.gov/taxtopics/tc751"),
    "irs_futa": src("Internal Revenue Service", "Topic no. 759, Form 940, Employer's Annual Federal Unemployment (FUTA) Tax Return", "https://www.irs.gov/taxtopics/tc759"),
    "dol_futa": src("U.S. Department of Labor, Employment and Training Administration", "FUTA credit reductions (Actual FUTA Credit Reductions 2010-2025, and Potential 2026 Credit Reductions)", "https://oui.doleta.gov/unemploy/futa_credit.asp"),
    "ftb_rates": src("California Franchise Tax Board", "Business tax rates", "https://www.ftb.ca.gov/file/business/tax-rates.html"),
    "ftb_llc": src("California Franchise Tax Board", "Limited liability company (LLC)", "https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html"),
    "sos_llc": src("California Secretary of State", "Limited Liability Companies (LLC) - California: forms and fees", "https://www.sos.ca.gov/business-programs/cannabizfile/cannabis-forms-and-fees/limited-liability-companies-llc-california"),
    "edd": src("California Employment Development Department", "Tax rates, wage limits, and value of meals and lodging", "https://edd.ca.gov/en/payroll_taxes/rates_and_withholding"),
    "dir_mw": src("California Department of Industrial Relations", "Minimum wage frequently asked questions", "https://www.dir.ca.gov/dlse/faq_minimumwage.htm"),
    "dir_ff": src("California Department of Industrial Relations", "Fast food minimum wage frequently asked questions", "https://www.dir.ca.gov/dlse/Fast-Food-Minimum-Wage-FAQ.htm"),
    "dir_sick": src("California Department of Industrial Relations", "California paid sick leave: frequently asked questions", "https://www.dir.ca.gov/dlse/Paid_Sick_Leave.htm"),
    "la_mw": src("City of Los Angeles, Office of Wage Standards", "July 1, 2026 Minimum Wage Ordinance wage rate increase (notice of 30 January 2026)", "https://wagesla.lacity.gov/sites/g/files/wph1941/files/2026-04/2026%20MWR%20Increase%20Memo%2001-30-26%20ADA%20Final.pdf"),
    "la_sick": src("City of Los Angeles, Office of Wage Standards", "Wages LA: minimum wage and paid sick leave", "https://wagesla.lacity.gov/"),
    "cdtfa_oct26": src("California Department of Tax and Fee Administration", "Effective Sales and Use Tax Rates, October 2026 (SalesTaxRates10-1-26.xlsx)", "https://www.cdtfa.ca.gov/taxes-and-fees/SalesTaxRates10-1-26.xlsx"),
    "cdtfa_L1037": src("California Department of Tax and Fee Administration", "L-1037, New Sales and Use Tax Rates Effective October 1, 2026", "https://cdtfa.ca.gov/formspubs/L1037.pdf"),
    "cdtfa_arch2504": src("California Department of Tax and Fee Administration", "California City and County Sales and Use Tax Rates, 1 April 2025 to 30 June 2025 (archive)", "https://cdtfa.ca.gov/taxes-and-fees/ArchivesRates-04-01-2025-06-30-2025.pdf"),
    "cdtfa_hist": src("California Department of Tax and Fee Administration", "History of Statewide Sales and Use Tax Rates", "https://www.cdtfa.ca.gov/taxes-and-fees/sales-use-tax-rates-history.htm"),
    "la_bt": src("City of Los Angeles, Office of Finance", "Tax Information Booklet", "https://finance.lacity.gov/tax-information-booklet"),
    "la_sbe": src("City of Los Angeles, Office of Finance", "Small Business Exemption FAQ", "https://finance.lacity.gov/small-business-exemption-faq"),
    "la_reg": src("City of Los Angeles, Office of Finance", "Business Registration Requirements FAQ", "https://finance.lacity.gov/frequently-asked-questions/business-registration-requirements-faq"),
    "la_dph": src("County of Los Angeles Department of Public Health", "FY 2026-2027 Public Health and Financial Management Fee Schedule", "https://admin.publichealth.lacounty.gov/eh/docs/permit/public-health-financial-management-fee-schedule.pdf"),
    "abc_app": src("California Department of Alcoholic Beverage Control", "Application fee schedules (effective January 1, 2026)", "https://www.abc.ca.gov/licensing/license-fees/application-fee-schedules/"),
    "abc_ann": src("California Department of Alcoholic Beverage Control", "Annual fee schedule (effective January 1, 2026)", "https://www.abc.ca.gov/licensing/license-fees/annual-fee-schedule/"),
    "bbc_barber": src("California Board of Barbering and Cosmetology", "Barber application for examination and initial license fee (form rev. August 2025)", "https://www.barbercosmo.ca.gov/forms_pubs/forms/barber_app.pdf"),
    "bbc_estab": src("California Board of Barbering and Cosmetology", "Application for establishment license, instructions and checklist (form rev. 25 March 2024)", "https://www.barbercosmo.ca.gov/forms_pubs/forms/estab_app.pdf"),
    "ch7": src("United States Courts", "Chapter 7 - Bankruptcy Basics", "https://www.uscourts.gov/court-programs/bankruptcy/bankruptcy-basics/chapter-7-bankruptcy-basics"),
    # Italy, Lazio, Rome
    "rm_ditta": src("Camera di Commercio di Roma", "Diritti di segreteria e bolli imprese individuali", "https://www.rm.camcom.it/pagina3375_diritti-di-segreteria-e-bolli-imprese-individuali.html"),
    "rm_soc": src("Camera di Commercio di Roma", "Diritti di segreteria e bolli società", "https://www.rm.camcom.it/pagina3431_diritti-di-segreteria-e-bolli-societ.html"),
    "bo_srl": src("Camera di Commercio di Bologna", "Le nuove SRL", "https://www.bo.camcom.gov.it/it/node/1145"),
    "tuir77": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.P.R. 22 dicembre 1986, n. 917 (TUIR), art. 77, testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1986-12-22;917~art77!vig=2026-10-17"),
    "tuir11": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.P.R. 22 dicembre 1986, n. 917 (TUIR), art. 11, testo vigente dal 1-1-2026", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1986-12-22;917~art11!vig=2026-10-17"),
    "ae_irpef": src("Agenzia delle Entrate", "Irpef: aliquote e calcolo dell'Irpef", "https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef"),
    "l190": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "Legge 23 dicembre 2014, n. 190, art. 1, commi 54 a 89 (regime forfetario), testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2014-12-23;190~art1!vig=2026-10-17"),
    "inps14": src("INPS", "Circolare n. 14 del 9 febbraio 2026: artigiani e commercianti, contribuzione 2026", "https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/02/Circolare_15162/Allegati/16561_Circolare-numero-14-del-09-02-2026.pdf"),
    "iva16": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.P.R. 26 ottobre 1972, n. 633, art. 16 (aliquote dell'imposta), testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1972-10-26;633~art16!vig=2026-10-17"),
    "ae_r19": src("Agenzia delle Entrate", "Risposta n. 19 del 2024 (aliquota IVA applicabile, Tabella A, parte III, n. 121)", "https://www.agenziaentrate.gov.it/portale/documents/20143/5781149/Risposta+n.+19_2024.pdf/33d65944-8f05-4ce2-f170-c2c8bf5111b5"),
    "irap_list": src("Ministero dell'Economia e delle Finanze, Dipartimento delle Finanze", "IRAP: elenco generale delle aliquote applicabili, anno 2026 (aggiornamento del 09/10/2026)", "https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/aliquoteirap/download/download.php?tipo=ira&anno=2026"),
    "lazio_lr20": src("Consiglio Regionale del Lazio", "Legge regionale 31 dicembre 2025, n. 20, art. 2 (testo coordinato)", "https://www.consiglio.regione.lazio.it/consiglio-regionale/?vw=leggiregionalidettaglio&id=9524&sv=vigente"),
    "dlgs66": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.Lgs. 8 aprile 2003, n. 66, art. 10 (ferie annuali), testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-04-08;66~art10!vig=2026-10-17"),
    "cci282": src("Normattiva (Istituto Poligrafico e Zecca dello Stato)", "D.Lgs. 12 gennaio 2019, n. 14 (Codice della crisi d'impresa e dell'insolvenza), art. 282, testo vigente", "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2019-01-12;14~art282!vig=2026-10-17"),
    "rm_somm": src("Roma Capitale", "Somministrazione al pubblico di alimenti e bevande: SCIA apertura fuori dagli ambiti di tutela", "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF44858"),
    "rm_tari": src("Roma Capitale", "Deliberazione dell'Assemblea Capitolina n. 121 del 21 luglio 2026: misure della TARI per l'anno 2026 (Allegato 2, utenze non domestiche)", "https://www.comune.roma.it/web-resources/cms/documents/Deliberazione_Assemblea_Capitolina_121_2026.pdf"),
    "la_alfresco": src("City of Los Angeles Department of Transportation (LADOT)", "L.A. Al Fresco On-Street Dining Application Fees (fee summary, June 2023)", "https://ladot.lacity.gov/sites/default/files/2026-04/al-fresco-program-fee-summary-062023.pdf"),
    "ccnl_pe": src("Federazione Italiana Pubblici Esercizi (signatory)", "Accordo integrativo del 26 giugno 2024 all'ipotesi di rinnovo del CCNL Pubblici Esercizi, Ristorazione Collettiva e Commerciale e Turismo del 5 giugno 2024: tabelle retributive (artt. 161, 162, 164)", "https://www.fipe.it/wp-content/uploads/2018/03/Tabelle-retributive-CCNL-2024.pdf"),
    "rm_acconc": src("Roma Capitale", "Acconciatore: avvio attività", "https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF37582"),
    # Hungary, Budapest
    "evtv": src("Nemzeti Jogszabálytár", "2009. évi CXV. törvény az egyéni vállalkozóról és az egyéni cégről, 8. §", "https://njt.jog.gov.hu/jogszabaly/2009-115-00-00"),
    "bir_cegeljaras": src("Országos Bírósági Hivatal (birosag.hu)", "A cégbejegyzési kérelem benyújtása", "https://birosag.hu/ugyfeleknek/birosagi-eljarasok/cegeljaras/cegbejegyzesi-kerelem-benyujtasa"),
    "ptk": src("Nemzeti Jogszabálytár", "2013. évi V. törvény a Polgári Törvénykönyvről, 3:161. § (4)", "https://njt.jog.gov.hu/jogszabaly/2013-5-00-00"),
    "nav_ev": src("Nemzeti Adó- és Vámhivatal", "Információs füzet: Az egyéni vállalkozók szja- és járulékkötelezettsége (közzétéve 2026. 08. 31.)", "https://nav.gov.hu/pfile/file?path=%2Fugyfeliranytu%2Fnezzen-utana%2Finf_fuz%2Frejtett%2FInformacios-fuzetek---Aktualis%2F03_Az-egyeni-vallalkozok-szja--es-jarulekkotelezettsege"),
    "nav_atalany": src("Nemzeti Adó- és Vámhivatal", "Információs füzet: Az egyéni vállalkozók átalányadózásának alapvető szabályai (2026. 02. 20.)", "https://nav.gov.hu/pfile/file?path=%2Fugyfeliranytu%2Fnezzen-utana%2Finf_fuz%2F2026%2F100.-Az-egyeni-vallalkozok-atalanyadozasanak-alapveto-szabalyai-2026.-02.-20"),
    "nav_tao": src("Nemzeti Adó- és Vámhivatal", "Információs füzet: TAO-felajánlás (2026. 02. 02.)", "https://nav.gov.hu/pfile/file?path=%2Fugyfeliranytu%2Fnezzen-utana%2Finf_fuz%2F2026%2F55.-Tao-felajanlas-2026.-02.-02"),
    "nav_kiva": src("Nemzeti Adó- és Vámhivatal", "Információs füzet: A kisvállalati adó szabályozása 2026-tól (2026. 05. 18.)", "https://nav.gov.hu/pfile/file?path=%2Fugyfeliranytu%2Fnezzen-utana%2Finf_fuz%2Frejtett%2FInformacios-fuzetek---Aktualis%2F92.-informacios-fuzet---a-kisvallalati-ado-szabalyozasa"),
    "nav_afakulcs": src("Nemzeti Adó- és Vámhivatal", "Áfa kulcsok és a tevékenység közérdekű vagy egyéb sajátos jellegére tekintettel adómentes tevékenységek köre", "https://nav.gov.hu/pfile/file?path=%2Fugyfeliranytu%2Fadokulcsok_jarulekmertekek%2Fafakulcs_adomen%2FAfa_kulcsok_es_a_tevekenyseg_kozerdeku_vagy_egyeb_sajatos_jellegere_tekintettel_adomentes_tevekenysegek_kore"),
    "nav_afa5": src("Nemzeti Adó- és Vámhivatal", "Mikor alkalmazható a kedvezményes áfakulcs az étkezőhelyi vendéglátásban?", "https://nav.gov.hu/print/ugyfeliranytu/nezzen-utana/tudjon_rola/Mikor_alkalmazhato_a_kedvezmenyes_afakulcs_az_etkezohelyi_vendeglatasban_"),
    "nav_alanyi": src("Nemzeti Adó- és Vámhivatal", "Emelkedik az alanyi adómentesség értékhatára", "https://nav.gov.hu/ado/afa/Emelkedik_az_alanyi_adomentesseg_ertekhatara"),
    "szocho": src("Nemzeti Jogszabálytár", "2018. évi LII. törvény a szociális hozzájárulási adóról, 2. § (1)", "https://njt.jog.gov.hu/jogszabaly/2018-52-00-00"),
    "hu_mw": src("Nemzeti Jogszabálytár", "426/2025. (XII. 23.) Korm. rendelet a kötelező legkisebb munkabér (minimálbér) és a garantált bérminimum megállapításáról", "https://njt.jog.gov.hu/jogszabaly/2025-426-20-22"),
    "mt": src("Nemzeti Jogszabálytár", "2012. évi I. törvény a munka törvénykönyvéről, 69. § és 116. §", "https://njt.jog.gov.hu/jogszabaly/2012-1-00-00"),
    "htv": src("Nemzeti Jogszabálytár", "1990. évi C. törvény a helyi adókról, 40. § (1)", "https://njt.jog.gov.hu/jogszabaly/1990-100-00-00"),
    "bp_hipa": src("Budapest Főváros Önkormányzata", "4. függelék az előterjesztéshez: Kimutatás a 2026. évi közvetett támogatásokról (helyi iparűzési adó)", "https://einfoszab.budapest.hu/File/DownloadDvD/129000?filename=f09_4+f%C3%BCggel%C3%A9k+az+el%C3%B6terj+k%C3%B6zvetett+t%C3%A1m.pdf&prevcont=Session&prevaction=DvdItem&path=Tev%C3%A9kenys%C3%A9gre%2C+m%C5%B1k%C3%B6d%C3%A9sre+vonatkoz%C3%B3+adatok+%2F+D%C3%B6nt%C3%A9shozatal%2C+%C3%BCl%C3%A9sek+%2F+A+F%C5%91v%C3%A1rosi+K%C3%B6zgy%C5%B1l%C3%A9s+%C3%BCl%C3%A9sei&type=5&key=fovarosi-kozgyules-nyilvanos-ulesei&fileId=210452&sessionType=1&organizationtype=2&parentId=18521&parenttype=2"),
    "kereskedelem": src("Nemzeti Jogszabálytár", "210/2009. (IX. 29.) Korm. rendelet a kereskedelmi tevékenységek végzésének feltételeiről, 2. § és 6. §", "https://njt.jog.gov.hu/jogszabaly/2009-210-20-22"),
    "cstv": src("Nemzeti Jogszabálytár", "1991. évi XLIX. törvény a csődeljárásról és a felszámolási eljárásról", "https://njt.jog.gov.hu/jogszabaly/1991-49-00-00"),
    "aar": src("Nemzeti Jogszabálytár", "2015. évi CV. törvény a természetes személyek adósságrendezéséről", "https://njt.jog.gov.hu/jogszabaly/2015-105-00-00"),
}

FILES = {}


def file(name, fid, title, publisher="National governments and their agencies", url=None):
    def deco(fn):
        FILES[name] = (fid, src(publisher, title, url or "https://www.gov.uk/"), fn)
        return fn
    return deco


# ---------------------------------------------------------------- registration.json
@file("registration.json", "registration", "Registering a business by legal form: fees, minimum capital, wait where the registry states one")
def registration():
    return [
        R("registration_fee", "GB", 100, "GBP", "2026", S["ch_fees"], measure="Private limited company, incorporation online",
          note="Companies House: online 100, software 100, paper 124, same-day 156."),
        R("registration_fee", "GB", None, "GBP", "2026", S["soletrader"], measure="Sole trader, registration for Self Assessment",
          note="A sole trader registers for Self Assessment with HMRC once self-employed income passes GBP 1,000 in a tax year; the page names no fee."),
        R("registration_fee", "US-CA", 70, "USD", "2026", S["sos_llc"], measure="Limited liability company, Articles of Organization, online",
          note="California Secretary of State."),
        R("registration_fee", "US-CA", 20, "USD", "2026", S["sos_llc"], measure="Limited liability company, Statement of Information",
          note="Due within 90 days of registration and every two years after."),
        R("annual_company_tax", "US-CA", 800, "USD", "2026", S["ftb_llc"], measure="LLC annual tax, Franchise Tax Board",
          note="Every LLC doing business or organized in California pays it; the first is due by the 15th day of the 4th month after filing with the Secretary of State."),
        R("registration_required", "la", None, "none", "2026", S["la_reg"], measure="City business tax registration (Business Tax Registration Certificate)",
          note="Every business in the City of Los Angeles registers with the Office of Finance for a Business Tax Registration Certificate; the FAQ read names no registration fee."),
        R("registration_fee", "rome", 18, "EUR", "2026", S["rm_ditta"], measure="Sole trader (impresa individuale), registration: diritti di segreteria",
          note="Camera di Commercio di Roma. Stamp duty 17.50 on top; yearly chamber fee 53 (special section) or 120 (ordinary section)."),
        R("registration_stamp_duty", "rome", 17.5, "EUR", "2026", S["rm_ditta"], measure="Sole trader (impresa individuale), registration: imposta di bollo"),
        R("chamber_annual_fee", "rome", 53, "EUR", "2026", S["rm_ditta"], measure="Sole trader, diritto annuale, special section (sezione speciale)"),
        R("chamber_annual_fee", "rome", 120, "EUR", "2026", S["rm_ditta"], measure="Sole trader, diritto annuale, ordinary section (sezione ordinaria)"),
        R("registration_fee", "rome", 90, "EUR", "2026", S["rm_soc"], measure="Company (S.r.l.), registration: diritti di segreteria",
          note="Camera di Commercio di Roma; stamp duty 65 for capital companies. The notary's deed and its registration tax are not on this page and were not read."),
        R("registration_stamp_duty", "rome", 65, "EUR", "2026", S["rm_soc"], measure="Company (S.r.l.), registration: imposta di bollo"),
        R("minimum_capital", "IT", 10000, "EUR", "2026", S["bo_srl"], measure="S.r.l., standard minimum share capital",
          note="An S.r.l. (and the simplified S.r.l.s.) may also be formed with capital of 1 euro up to 10,000, paid in full in cash (art. 2463 and 2463-bis of the civil code, per the Chamber of Commerce)."),
        R("minimum_capital", "IT", 1, "EUR", "2026", S["bo_srl"], measure="S.r.l. or S.r.l.s. with reduced capital, lowest amount",
          note="Contributions in cash, paid in full to the directors."),
        R("registration_fee", "HU", 0, "HUF", "2026", S["evtv"], measure="Sole trader (egyéni vállalkozó), notice of starting",
          note="The notice of starting, change, suspension and ending of a sole trader's activity is free of fees and duties (Act CXV of 2009, s. 8)."),
        R("registration_fee", "HU", 0, "HUF", "2026", S["bir_cegeljaras"], measure="Company (Kft), court registration duty and publication fee, simplified procedure",
          note="The simplified procedure uses the model articles; for a Kft the duty and the publication fee are both free, in the general procedure too. The lawyer's fee is not set by law and was not read."),
        R("registration_wait_days", "HU", 1, "working days", "2026", S["bir_cegeljaras"], measure="Company (Kft), court's deadline to decide, simplified procedure",
          note="General procedure: 15 working days."),
        R("registration_wait_days", "HU", 15, "working days", "2026", S["bir_cegeljaras"], measure="Company (Kft), court's deadline to decide, general procedure"),
        R("minimum_capital", "HU", 3000000, "HUF", "2026", S["ptk"], measure="Kft, minimum share capital (törzstőke)",
          note="Civil Code 3:161 (4): at least three million forints; each member's contribution at least HUF 100,000."),
    ]


# ---------------------------------------------------------------- licences.json
@file("licences.json", "licences", "Trade licences for restaurants, cafes and barbershops in London, Los Angeles, Rome and Budapest, each from its issuer")
def licences():
    rows = []
    for trade in ("restaurants", "cafes"):
        rows += [
            R("licence_fee", "GB-ENG", 0, "GBP", "2026", S["startfood"], trade=trade, measure="Food business registration",
              note="Issuer: the local authority (in London, the borough). Free and cannot be refused (Food Standards Agency)."),
            R("licence_wait_days", "GB-ENG", 28, "days", "2026", S["startfood"], trade=trade, measure="Food business registration, at least this long before trading",
              note="Issuer: the local authority (in London, the borough). The FSA: register at least 28 days before trading."),
        ]
        for band, rv, app, ann in (("A", "none to GBP 4,300", 100, 70), ("B", "GBP 4,301 to 33,000", 190, 180), ("C", "GBP 33,001 to 87,000", 315, 295),
                                   ("D", "GBP 87,001 to 125,000", 450, 320), ("E", "GBP 125,001 plus", 635, 350)):
            rows.append(R("licence_fee", "GB-ENG", app, "GBP", "2005", S["alcfees"], trade=trade,
                          measure=f"Premises licence to sell alcohol, new application, band {band} (non-domestic rateable value {rv})",
                          note="Issuer: the licensing authority (in London, the borough). Home Office page published 25 April 2012; fees of the Licensing Act 2003 (Fees) Regulations 2005." +
                               (" Premises used mainly for drinking on the premises pay twice (D) or three times (E)." if band in "DE" else "")))
            rows.append(R("licence_annual_fee", "GB-ENG", ann, "GBP", "2005", S["alcfees"], trade=trade,
                          measure=f"Premises licence to sell alcohol, annual charge, band {band}",
                          note="Issuer: the licensing authority (in London, the borough)."))
        rows += [
            R("licence_fee", "GB-ENG", 500, "GBP", "2026", S["pavement"], trade=trade, measure="Pavement licence for tables and chairs, first application, at most",
              note="Issuer: the local authority; it may charge up to 500 new and 350 on renewal; licences last up to two years."),
            R("licence_fee", "GB-ENG", 350, "GBP", "2026", S["pavement"], trade=trade, measure="Pavement licence, renewal, at most",
              note="Issuer: the local authority."),
            R("licence_required", "GB-ENG", None, "none", "2026", S["personal"], trade=trade, measure="Personal licence to sell alcohol",
              note="Issuer: the local authority. Someone selling alcohol from licensed premises holds a personal licence (age 18+ and a licensing qualification); the page names no fee."),
            R("licence_fee", "la-county", 1044, "USD", "2026-27", S["la_dph"], trade=trade, measure="Plan check, restaurant 0 to 500 sq ft",
              note="Issuer: County of Los Angeles Department of Public Health. 501-1,999 sq ft 1,530; 2,000-3,999 1,865; 4,000-9,999 2,276; 10,000+ 2,723."),
            R("licence_fee", "la-county", 2723, "USD", "2026-27", S["la_dph"], trade=trade, measure="Plan check, restaurant 10,000 sq ft or more",
              note="Issuer: County of Los Angeles Department of Public Health."),
        ]
        for seats, lo, mid, hi in (("0-30", 319, 719, 1206), ("31-60", 344, 762, 1309), ("61-150", 370, 838, 1375), ("151+", 400, 932, 1438)):
            for risk, v in (("low", lo), ("moderate", mid), ("high", hi)):
                rows.append(R("licence_annual_fee", "la-county", v, "USD", "2026-27", S["la_dph"], trade=trade,
                              measure=f"Public health permit, restaurant {seats} seats, {risk} risk",
                              note="Issuer: County of Los Angeles Department of Public Health."))
        rows += [
            R("licence_fee", "US-CA", 1135, "USD", "2026", S["abc_app"], trade=trade, measure="Alcohol licence Type 41 (on-sale beer and wine, eating place), original application",
              note="Issuer: California Department of Alcoholic Beverage Control. Annual fee 565, collected with the application."),
            R("licence_annual_fee", "US-CA", 565, "USD", "2026", S["abc_ann"], trade=trade, measure="Alcohol licence Type 41, annual fee",
              note="Issuer: California Department of Alcoholic Beverage Control."),
            R("licence_fee", "US-CA", 19840, "USD", "2026", S["abc_app"], trade=trade, measure="Alcohol licence Type 47 (on-sale general, eating place), new licence by priority drawing",
              note="Issuer: California Department of Alcoholic Beverage Control. A new Type 47 is available only to priority drawing winners; existing licences can be transferred person to person. Annual fee 1,545 in a city over 40,000."),
            R("licence_annual_fee", "US-CA", 1545, "USD", "2026", S["abc_ann"], trade=trade, measure="Alcohol licence Type 47, annual fee, city with population over 40,000",
              note="Issuer: California Department of Alcoholic Beverage Control."),
            R("licence_fee", "la", 1500, "USD", "2023", S["la_alfresco"], trade=trade, measure="L.A. Al Fresco on-street dining, LADOT application review fee, new participants (one-time)",
              note="Issuer: LADOT with the Bureau of Engineering (LAMC 62.118.2). Also a BOE R-permit fee of 556 for new participants and a sewer facility charge per seat. The summary is dated June 2023."),
            R("licence_fee", "la", 556, "USD", "2023", S["la_alfresco"], trade=trade, measure="L.A. Al Fresco on-street dining, Bureau of Engineering R-permit fee, new participants (one-time)",
              note="Issuer: City of Los Angeles Bureau of Engineering."),
            R("licence_fee", "la", 165 if trade == "restaurants" else 138, "USD per seat", "2023", S["la_alfresco"], trade=trade,
              measure="L.A. Al Fresco on-street dining, sewer facility charge, " + ("full service" if trade == "restaurants" else "limited service"),
              note="Issuer: City of Los Angeles Bureau of Engineering. 165 a seat for full service, 138 for limited service."),
            R("licence_fee", "rome", None, "EUR", "2026", S["rm_somm"], trade=trade, measure="SCIA for serving food and drink (somministrazione), opening outside the protected areas",
              note="Issuer: the SUAP of Roma Capitale, filed online only. A spese istruttoria fee applies, set yearly in the Giunta Capitolina's tariff resolution; the amount was not readable."),
            R("licence_wait_days", "rome", 0, "days", "2026", S["rm_somm"], trade=trade, measure="SCIA for serving food and drink, wait before trading",
              note="Issuer: the SUAP of Roma Capitale. The activity may start on the date the SCIA is filed (its protocol receipt). This SCIA covers openings outside the protected areas (ambiti di tutela)."),
            R("licence_required", "budapest", None, "none", "2026", S["kereskedelem"], trade=trade, measure="Notice of catering (vendéglátás) to the district notary",
              note="Issuer: in Budapest, the district's notary (kerületi jegyző), or the chief notary of the capital where it governs the area (Gov. Decree 210/2009, s. 2). The notary registers the notice; the decree refers to a duty, whose amount was not read."),
        ]
    rows += [
        R("licence_required", "city-of-london", None, "none", "2025", S["cityhair"], trade="barbershops", measure="Hairdresser and barber premises registration, City of London",
          note="Issuer: City of London Corporation, under the Greater London Council (General Powers) Act 1967, s. 21; application by email; page updated 25/07/2025; no fee stated."),
        R("licence_fee", "US-CA", 125, "USD", "2025", S["bbc_barber"], trade="barbershops", measure="Barber licence, application for examination and initial licence",
          note="Issuer: California Board of Barbering and Cosmetology (form rev. August 2025); non-refundable."),
        R("licence_fee", "US-CA", 50, "USD", "2024", S["bbc_estab"], trade="barbershops", measure="Establishment licence for the shop, application",
          note="Issuer: California Board of Barbering and Cosmetology (form rev. 25 March 2024); non-refundable."),
        R("licence_required", "rome", None, "none", "2026", S["rm_acconc"], trade="barbershops", measure="Hairdresser (acconciatore) qualification and SCIA",
          note="Issuer: the SUAP of Roma Capitale. A professional qualification under Law 174/2005 is required, or a qualified technical manager; the SCIA is filed online and the activity may start on filing."),
        R("tax_rate", "la", 4.25, "USD per USD 1,000 of gross receipts", "2026", S["la_bt"], trade="barbershops", measure="City of Los Angeles business tax, professions and occupations (barbers named as an example)",
          note="Issuer: City of Los Angeles Office of Finance (LAMC 21.49(c)). Restaurants are retail sales at 1.27."),
    ]
    return rows


# ---------------------------------------------------------------- profit-taxes.json
@file("profit-taxes.json", "profit-taxes", "Profit taxes by legal form, United Kingdom, United States and California, Italy and Lazio, Hungary")
def profit_taxes():
    return [
        R("profit_tax_rate", "GB", 25, "%", "2026", S["ct"], measure="Corporation Tax, main rate (profits over GBP 250,000)", note="Marginal Relief between GBP 50,000 and 250,000."),
        R("profit_tax_rate", "GB", 19, "%", "2026", S["ct"], measure="Corporation Tax, small profits rate (profits of GBP 50,000 or less)"),
        R("income_tax_allowance", "GB", 12570, "GBP", "2026-27", S["it"], measure="Personal Allowance", note="Tax year 6 April 2026 to 5 April 2027; England, Wales and Northern Ireland bands (Scotland differs)."),
        R("income_tax_rate", "GB", 20, "%", "2026-27", S["it"], measure="Basic rate, taxable income GBP 12,571 to 50,270"),
        R("income_tax_rate", "GB", 40, "%", "2026-27", S["it"], measure="Higher rate, GBP 50,271 to 125,140"),
        R("income_tax_rate", "GB", 45, "%", "2026-27", S["it"], measure="Additional rate, over GBP 125,140"),
        R("owner_contribution_rate", "GB", 6, "%", "2026-27", S["class4"], measure="Class 4 National Insurance, sole trader, profits GBP 12,570 to 50,270", note="Class 2 is treated as paid for profits of GBP 7,105 or more."),
        R("owner_contribution_rate", "GB", 2, "%", "2026-27", S["class4"], measure="Class 4 National Insurance, profits over GBP 50,270"),
        R("profit_tax_rate", "US", 21, "%", "2026", S["irs_corp"], measure="Federal corporate income tax (C corporation)"),
        R("profit_tax_rate", "US-CA", 8.84, "%", "2026", S["ftb_rates"], measure="California corporation franchise tax, corporations other than banks and financials", note="S corporations 1.5%."),
        R("income_tax_rate", "US", 10, "%", "2026", S["irs_2026"], measure="Federal income tax, single, taxable income up to USD 12,400"),
        R("income_tax_rate", "US", 12, "%", "2026", S["irs_2026"], measure="Federal income tax, single, over USD 12,400", note="22% over 50,400; 24% over 105,700; 32% over 201,775; 35% over 256,225; 37% over 640,600."),
        R("income_tax_allowance", "US", 16100, "USD", "2026", S["irs_2026"], measure="Federal standard deduction, single"),
        R("owner_contribution_rate", "US", 15.3, "%", "2026", S["irs_se"], measure="Self-employment tax (12.4% social security, 2.9% Medicare)", note="On net earnings from self-employment."),
        R("profit_tax_rate", "IT", 24, "%", "2026", S["tuir77"], measure="IRES, company income tax", note="TUIR art. 77."),
        R("profit_tax_rate", "IT-62", 4.82, "%", "2026", S["irap_list"], measure="IRAP, Lazio, ordinary rate (on net value of production, not on profit)",
          note="Lazio's 0.92-point increase on the national rate (L.R. 20/2025, art. 2, c. 4) is included. Firms in the ATECO codes of D.L. 21/2026, art. 3: 6.82."),
        R("income_tax_rate", "IT", 23, "%", "2026", S["tuir11"], measure="IRPEF, income up to EUR 28,000"),
        R("income_tax_rate", "IT", 33, "%", "2026", S["tuir11"], measure="IRPEF, EUR 28,000 to 50,000", note="Cut from 35% by the 2026 budget law (L. 199/2025)."),
        R("income_tax_rate", "IT", 43, "%", "2026", S["tuir11"], measure="IRPEF, over EUR 50,000"),
        R("owner_contribution_rate", "IT", 24.48, "%", "2026", S["inps14"], measure="INPS, shopkeepers (commercianti), owner's own contribution, income to EUR 56,224",
          note="Artisans (artigiani, barbers among them) 24%. On income above 56,224: 25.48 and 25%. Minimum income 18,808; minimum contribution 4,611.64 (commercianti) or 4,521.36 (artigiani)."),
        R("profit_tax_rate", "IT", 15, "%", "2026", S["l190"], measure="Flat-rate regime (regime forfetario), substitute tax on revenue times the ATECO coefficient",
          note="For individuals with revenue up to EUR 85,000 the year before (L. 190/2014, art. 1, c. 54 and 64); 5% for the first five years of a new activity (c. 65); INPS on that income reduced by 35% (c. 77)."),
        R("profit_tax_rate", "HU", 9, "%", "2026", S["nav_tao"], measure="Corporate income tax (társasági adó)"),
        R("profit_tax_rate", "HU", 10, "%", "2026", S["nav_kiva"], measure="Small business tax (kisvállalati adó, KIVA), an alternative to corporate tax", note="Its base starts from personal payments (pay) and capital items, not from profit alone."),
        R("profit_tax_rate", "HU", 9, "%", "2026", S["nav_ev"], measure="Sole trader under entrepreneurial income taxation: entrepreneur's personal income tax (vállalkozói szja) on the business tax base"),
        R("profit_tax_rate", "HU", 15, "%", "2026", S["nav_ev"], measure="Sole trader: tax on the entrepreneur's dividend base (vállalkozói osztalékalap)"),
        R("owner_contribution_rate", "HU", 18.5, "%", "2026", S["nav_ev"], measure="Sole trader, social security contribution (TB járulék) on the owner's drawings, at least on the minimum wage a month"),
        R("owner_contribution_rate", "HU", 13, "%", "2026", S["nav_ev"], measure="Sole trader, social contribution tax (szocho) on the owner's drawings, at least on the minimum wage a month",
          note="From 1 January 2026 the 112.5% multiplier on the minimum base no longer applies. The guaranteed wage minimum is the floor where the main activity needs a secondary qualification."),
    ]


# ---------------------------------------------------------------- vat-sales-tax.json
@file("vat-sales-tax.json", "vat-sales-tax", "VAT or sales tax: standard rate, the rate on a restaurant meal, and the registration threshold")
def vat():
    return [
        R("vat_rate_standard", "GB", 20, "%", "2011-01-04", S["vatrates"], measure="VAT, standard rate", note="Raised to 20% on 4 January 2011 (from 17.5%)."),
        R("vat_rate_restaurant", "GB", 20, "%", "2026", S["vat709"], measure="VAT on catering (food and drink supplied in the course of catering)", note="Supplies in the course of catering are standard-rated (VAT Notice 709/1)."),
        R("vat_threshold", "GB", 90000, "GBP", "2026", S["vatreg"], measure="Registration compulsory when taxable turnover over 12 months goes over"),
        R("sales_tax_rate", "la", 10.25, "%", "2026-10-01", S["cdtfa_oct26"], measure="Sales and use tax, City of Los Angeles",
          note="No VAT in the United States. Applies to sales of taxable goods, prepared food among them."),
        R("sales_tax_rate", "US-CA", 7.25, "%", "2017-01-01", S["cdtfa_hist"], measure="Statewide base sales and use tax rate (state 6.00 plus local 1.25), excluding district taxes"),
        R("vat_rate_standard", "IT", 22, "%", "2026", S["iva16"], measure="IVA, ordinary rate", note="DPR 633/1972, art. 16; reduced rates 4, 5 and 10% for the goods and services in Tabella A."),
        R("vat_rate_restaurant", "IT", 10, "%", "2026", S["ae_r19"], measure="IVA on serving food and drink (somministrazioni di alimenti e bevande)", note="Tabella A, parte III, n. 121 of DPR 633/1972, as quoted by the Agenzia delle Entrate."),
        R("vat_rate_standard", "HU", 27, "%", "2026", S["nav_afakulcs"], measure="ÁFA, general rate", note="Áfa tv. 82. §."),
        R("vat_rate_restaurant", "HU", 5, "%", "2026", S["nav_afa5"], measure="ÁFA on restaurant service: food and drinks made on the spot without alcohol, eaten on the premises (TESZOR 56.10)",
          note="Takeaway and delivered food 27%."),
        R("vat_threshold", "HU", 20000000, "HUF", "2026", S["nav_alanyi"], measure="Subject exemption (alanyi adómentesség): turnover limit",
          note="Rises from HUF 18 million (2025) to 20 million (2026), 22 million (2027) and 24 million (2028)."),
    ]


# ---------------------------------------------------------------- employer-charges.json
@file("employer-charges.json", "employer-charges", "What a hire costs on top of pay: the employer's charges by name, and the wage floor and its kind")
def employer():
    return [
        R("employer_charge_rate", "GB", 15, "%", "2026-27", S["er2627"], measure="Employer (secondary) Class 1 National Insurance, category A, above the secondary threshold",
          note="Secondary threshold GBP 5,000 a year (96 a week)."),
        R("employer_charge_threshold", "GB", 5000, "GBP a year", "2026-27", S["er2627"], measure="Secondary threshold, employer National Insurance"),
        R("employer_allowance", "GB", 10500, "GBP a year", "2026-27", S["er2627"], measure="Employment Allowance (reduces the employer's National Insurance bill)"),
        R("employer_charge_rate", "GB", 3, "%", "2026", S["pension"], measure="Workplace pension, employer's minimum, automatic enrolment",
          note="On earnings between GBP 6,240 and 50,270 in most schemes; total minimum 8% with the worker's 5%."),
        R("employer_charge_rate", "US", 6.2, "%", "2026", S["irs_fica"], measure="Social Security, employer's share"),
        R("employer_charge_rate", "US", 1.45, "%", "2026", S["irs_fica"], measure="Medicare, employer's share"),
        R("employer_charge_rate", "US", 6.0, "%", "2026", S["irs_futa"], measure="Federal unemployment tax (FUTA), on the first USD 7,000 a worker",
          note="0.6% after the full 5.4% state credit; California employers lose part of that credit (next rows)."),
        R("employer_charge_rate", "US-CA", 1.2, "%", "2025", S["dol_futa"], measure="FUTA credit reduction, California, calendar year 2025",
          note="So California employers paid FUTA of 1.8% for 2025 (0.6 plus 1.2) on the first USD 7,000."),
        R("employer_charge_rate", "US-CA", 3.4, "%", "2026", S["edd"], measure="California unemployment insurance (UI), new employer, on the first USD 7,000",
          note="Assigned for two to three years; then 1.5% to 6.2% by experience (schedule F+ in 2026)."),
        R("employer_charge_rate", "US-CA", 0.1, "%", "2026", S["edd"], measure="California Employment Training Tax (ETT), on the first USD 7,000"),
        R("wage_floor", "GB", 12.71, "GBP an hour", "2026-04-01", S["nmw"], measure="National Living Wage, aged 21 and over", note="Statutory minimum. 18 to 20: 10.85; under 18 and apprentices: 8."),
        R("wage_floor", "la", 18.42, "USD an hour", "2026-07-01", S["la_mw"], measure="City of Los Angeles minimum wage",
          note="City ordinance (LAMC 187.02), indexed each 1 July to the Los Angeles CPI-W. California's own minimum is 16.90; fast-food chains of 60+ establishments 20.00."),
        R("wage_floor", "US-CA", 16.90, "USD an hour", "2026-01-01", S["dir_mw"], measure="California minimum wage, all employers"),
        R("wage_floor", "US-CA", 20.00, "USD an hour", "2024-04-01", S["dir_ff"], measure="California fast food restaurant employees (chains of at least 60 establishments nationally)"),
        R("wage_floor", "IT", None, "EUR a month", "2026", S["ccnl_pe"], measure="Statutory minimum wage",
          note="Italy has no statutory minimum wage; national collective agreements set pay floors (for restaurants, bars and cafes the CCNL Pubblici Esercizi, next rows). The hairdressing agreement was not read."),
        R("wage_floor", "IT", 1390.2, "EUR a month", "2026-06", S["ccnl_pe"], trade="restaurants", measure="Collective agreement floor, CCNL Pubblici Esercizi, level 7, monthly pay (contingenza plus paga base)",
          note="Not a statutory minimum: the national collective agreement signed by FIPE, Legacoop, Confcooperative, Agci and Filcams-CGIL, Fisascat-CISL, Uiltucs. From June 2026 in the agreement's first table; firms under art. 1, c. 1, paragraph II reach the same amounts from September 2026. Level 7 is the lowest grade."),
        R("wage_floor", "IT", 1390.2, "EUR a month", "2026-06", S["ccnl_pe"], trade="cafes", measure="Collective agreement floor, CCNL Pubblici Esercizi, level 7, monthly pay (contingenza plus paga base)",
          note="Not a statutory minimum: the national collective agreement for restaurants, bars and cafes. Level 7 is the lowest grade."),
        R("wage_floor", "IT", 1692.69, "EUR a month", "2026-06", S["ccnl_pe"], trade="restaurants", measure="Collective agreement floor, CCNL Pubblici Esercizi, level 4, monthly pay (contingenza plus paga base)",
          note="Not a statutory minimum: the national collective agreement signed by FIPE, Legacoop, Confcooperative, Agci and Filcams-CGIL, Fisascat-CISL, Uiltucs. From June 2026 in the agreement's first table; firms under art. 1, c. 1, paragraph II reach the same amounts from September 2026. Level 7 is the lowest grade."),
        R("wage_floor", "IT", 1692.69, "EUR a month", "2026-06", S["ccnl_pe"], trade="cafes", measure="Collective agreement floor, CCNL Pubblici Esercizi, level 4, monthly pay (contingenza plus paga base)",
          note="Not a statutory minimum: the national collective agreement for restaurants, bars and cafes. Level 7 is the lowest grade."),
        R("wage_floor", "HU", 322800, "HUF a month", "2026-01-01", S["hu_mw"], measure="Minimum wage (minimálbér), full time",
          note="Statutory, Gov. Decree 426/2025. Hourly 1,856."),
        R("wage_floor", "HU", 373200, "HUF a month", "2026-01-01", S["hu_mw"], measure="Guaranteed wage minimum (garantált bérminimum), jobs needing at least a secondary qualification",
          note="Statutory. Hourly 2,145."),
        R("employer_charge_rate", "HU", 13, "%", "2026", S["szocho"], measure="Social contribution tax (szocho), employer, on gross pay"),
    ]


# ---------------------------------------------------------------- leave-notice.json
@file("leave-notice.json", "leave-notice", "Paid leave and the employer's notice, by law")
def leave():
    return [
        R("paid_leave", "GB", 5.6, "weeks a year", "2026", S["holiday"], measure="Statutory paid holiday", note="28 days for a five-day week; bank holidays may count; capped at 28 days."),
        R("notice_employer", "GB", 1, "weeks", "2026", S["notice"], measure="Notice from the employer, one month to two years' service", note="Then one week per full year from 2 to 12 years; 12 weeks after 12 years."),
        R("notice_employer", "GB", 12, "weeks", "2026", S["notice"], measure="Notice from the employer, 12 years' service or more"),
        R("paid_sick_leave", "US-CA", 40, "hours a year", "2024-01-01", S["dir_sick"], measure="California paid sick leave, at least 40 hours or five days, whichever is more"),
        R("paid_sick_leave", "la", 48, "hours a year", "2026", S["la_sick"], measure="City of Los Angeles paid sick leave, at least"),
        R("paid_leave", "IT", 4, "weeks a year", "2026", S["dlgs66"], measure="Paid annual leave (ferie), at least", note="D.Lgs. 66/2003, art. 10. Notice periods are set by the collective agreements (not read)."),
        R("paid_leave", "HU", 20, "working days a year", "2026", S["mt"], measure="Base leave (alapszabadság)", note="Labour Code s. 116; extra days by age follow (s. 117)."),
        R("notice_employer", "HU", 30, "days", "2026", S["mt"], measure="Notice period (felmondási idő)",
          note="Labour Code s. 69: on the employer's notice, plus 5 days after 3 years, 15 after 5, 20 after 8, 25 after 10, 30 after 15."),
    ]


# ---------------------------------------------------------------- local-business-taxes.json
@file("local-business-taxes.json", "local-business-taxes", "Local business taxes by name and base")
def local():
    return [
        R("local_tax_rate", "GB-ENG", 38.2, "pence per GBP of rateable value", "2026-27", S["ratescalc"], measure="Business rates multiplier, retail, hospitality and leisure, rateable value below GBP 51,000",
          note="Business rates: rateable value times the multiplier, billed by the council (in London, the borough). The City of London uses different multipliers."),
        R("local_tax_rate", "GB-ENG", 43, "pence per GBP of rateable value", "2026-27", S["ratescalc"], measure="Business rates multiplier, retail, hospitality and leisure, rateable value GBP 51,000 to 499,999"),
        R("local_tax_rate", "GB-ENG", 43.2, "pence per GBP of rateable value", "2026-27", S["ratescalc"], measure="Business rates multiplier, other businesses, rateable value below GBP 51,000"),
        R("local_tax_rate", "GB-ENG", 48, "pence per GBP of rateable value", "2026-27", S["ratescalc"], measure="Business rates multiplier, other businesses, GBP 51,000 to 499,999"),
        R("local_tax_rate", "GB-ENG", 50.8, "pence per GBP of rateable value", "2026-27", S["ratescalc"], measure="Business rates multiplier, rateable value GBP 500,000 or more"),
        R("local_tax_relief_threshold", "GB-ENG", 12000, "GBP of rateable value", "2026", S["sbrr"], measure="Small business rate relief: no rates at or below this rateable value",
          note="Relief tapers from 100% to 0 between GBP 12,001 and 15,000, if it is the only property the business uses."),
        R("local_tax_rate", "la", 1.27, "USD per USD 1,000 of gross receipts", "2026", S["la_bt"], trade="restaurants", measure="City of Los Angeles business tax, retail sales (restaurants named as an example)",
          note="Issuer: City of Los Angeles Office of Finance (LAMC 21.44)."),
        R("local_tax_exemption", "la", 100000, "USD of worldwide gross receipts", "2026", S["la_sbe"], measure="Small business exemption, City of Los Angeles business tax",
          note="Registered businesses with worldwide gross receipts of USD 100,000 or less pay no business tax if the renewal is filed on time (LAMC 21.29)."),
        R("local_tax_rate", "IT-62", 4.82, "% of net value of production", "2026", S["irap_list"], measure="IRAP, Lazio, ordinary rate (regional tax on productive activities)",
          note="Base: net value of production, not profit."),
        R("local_tax_rate", "budapest", 2, "% of the local business tax base", "2026", S["bp_hipa"], measure="Local business tax (helyi iparűzési adó, HIPA), Budapest",
          note="Levied by the capital at the legal maximum (Act C of 1990, s. 40: 2% from 2000). Businesses with a business-level tax base of HUF 1.5 million or less are exempt. The base is defined in the act; its parts were not read."),
        R("local_tax_rate", "rome", 38.65, "EUR per m2 a year", "2026", S["rm_tari"], trade="restaurants", officialClass="Ristoranti, trattorie, osterie, pizzerie, pub/mense, birrerie, hamburgherie (categoria 20)",
          measure="TARI (waste tax), Roma Capitale, total yearly tariff per square metre", note="Fixed part 12.69 plus variable part 25.96 (Kc 3.500, Kd 32.000)."),
        R("local_tax_rate", "rome", 34.29, "EUR per m2 a year", "2026", S["rm_tari"], trade="cafes", officialClass="Bar, caffè, pasticcerie (categoria 21)",
          measure="TARI (waste tax), Roma Capitale, total yearly tariff per square metre", note="Fixed part 11.16 plus variable part 23.12 (Kc 3.080, Kd 28.500)."),
        R("local_tax_rate", "rome", 10.85, "EUR per m2 a year", "2026", S["rm_tari"], trade="barbershops", officialClass="Attività artigianali tipo parrucchiere, barbiere, estetista, nail center, centri tatuaggi, toletta animali domestici (categoria 16)",
          measure="TARI (waste tax), Roma Capitale, total yearly tariff per square metre", note="Fixed part 3.55 plus variable part 7.30 (Kc 0.980, Kd 9.000)."),
        R("local_tax_exemption", "budapest", 1500000, "HUF of tax base", "2026", S["bp_hipa"], measure="HIPA exemption, Budapest, tax base at or below"),
    ]


# ---------------------------------------------------------------- insolvency.json
@file("insolvency.json", "insolvency", "If it fails: a company and a sole trader, by national law")
def insolvency():
    return [
        R("liquidation_court_fee", "GB-ENG", 2600, "GBP", "2026", S["liq_court"], measure="Compulsory liquidation: fee to submit the winding-up petition", note="Plus GBP 280 for the court hearing."),
        R("liquidation_court_fee", "GB-ENG", 280, "GBP", "2026", S["liq_court"], measure="Compulsory liquidation: court hearing fee"),
        R("bankruptcy_fee", "GB-ENG", 680, "GBP", "2026", S["bankr"], measure="Sole trader: applying to become bankrupt"),
        R("bankruptcy_discharge", "GB-ENG", 12, "months", "2026", S["bankr_end"], measure="Sole trader: usually released (discharged) from bankruptcy debts after",
          note="Longer without co-operation with the trustee. A sole trader's business is very likely to close."),
        R("bankruptcy_fee", "US", 335, "USD", "2026", S["ch7"], measure="Chapter 7: filing fee 245, administrative fee 75, trustee surcharge 15",
          note="Federal law. A Chapter 7 discharge is available to individuals, not to partnerships or corporations."),
        R("bankruptcy_discharge", "US", None, "days", "2026", S["ch7"], measure="Chapter 7: discharge order, individual",
          note="Usually 60 to 90 days after the date first set for the meeting of creditors; granted in more than 99% of individual cases."),
        R("bankruptcy_discharge", "IT", 3, "years", "2026", S["cci282"], measure="Liquidazione controllata (small entrepreneurs, sole traders): discharge of debts (esdebitazione)",
          note="On closing, or three years after opening if earlier (D.Lgs. 14/2019, art. 282)."),
        R("insolvency_procedure", "HU", None, "none", "2026", S["cstv"], measure="Company: liquidation (felszámolás) under Act XLIX of 1991",
          note="Act XLIX of 1991 governs bankruptcy (csődeljárás) and liquidation (felszámolás) of insolvent business organisations."),
        R("insolvency_procedure", "HU", None, "none", "2026", S["aar"], measure="Natural person: debt settlement under Act CV of 2015",
          note="The act governs the debt settlement of indebted natural persons."),
    ]


# ---------------------------------------------------------------- rule-changes.json
@file("rule-changes.json", "rule-changes", "Rule changes of the last two years, dated, with before and after")
def changes():
    rc = lambda geo, date, after, unit, s, note, measure: R("rule_change", geo, after, unit, date, s, note=note, measure=measure)
    return [
        rc("GB", "2025-04-06", 15, "%", S["er2526"], "Employer National Insurance 13.8% to 15%; secondary threshold GBP 9,100 to 5,000 a year.", "Employer Class 1 National Insurance rate"),
        rc("GB", "2025-04-06", 10500, "GBP", S["er2526"], "Employment Allowance GBP 5,000 (2024-25) to 10,500 (2025-26).", "Employment Allowance"),
        rc("GB", "2025-04-01", 12.21, "GBP an hour", S["nmw"], "National Living Wage to 12.21 (April 2025 to March 2026).", "National Living Wage"),
        rc("GB", "2026-04-01", 12.71, "GBP an hour", S["nmw"], "National Living Wage 12.21 to 12.71.", "National Living Wage"),
        rc("GB-ENG", "2026-04-01", 38.2, "pence", S["ratescalc"], "Lower retail, hospitality and leisure multipliers (38.2p and 43p) replace the retail, hospitality and leisure relief of 2025-26.", "Business rates, retail, hospitality and leisure"),
        rc("US-CA", "2026-01-01", 16.90, "USD an hour", S["dir_mw"], "California minimum wage 16.50 to 16.90.", "California minimum wage"),
        rc("la", "2026-07-01", 18.42, "USD an hour", S["la_mw"], "City of Los Angeles minimum wage up 0.55 to 18.42.", "City of Los Angeles minimum wage"),
        rc("la", "2025-04-01", 9.75, "%", S["cdtfa_arch2504"], "Sales tax in the City of Los Angeles 9.75% from 1 April 2025 (the earlier rate not read here).", "Sales and use tax rate, City of Los Angeles"),
        rc("la", "2026-10-01", 10.25, "%", S["cdtfa_L1037"], "Los Angeles County rate 9.750% to 10.250%: Measure ER, approved 2 June 2026, a new 0.5% countywide tax. The October 2026 rate table gives the City of Los Angeles 10.25%.", "Sales and use tax rate, City of Los Angeles"),
        rc("US-CA", "2025", 1.2, "%", S["dol_futa"], "California FUTA credit reduction 0.9% (2024) to 1.2% (2025).", "FUTA credit reduction, California"),
        rc("IT", "2026-01-01", 33, "%", S["ae_irpef"], "IRPEF on income EUR 28,000 to 50,000 cut from 35% to 33% (L. 199/2025).", "IRPEF second bracket"),
        rc("IT-62", "2026", 4.82, "%", S["lazio_lr20"], "Lazio keeps its 0.92-point IRAP increase from tax year 2026 (L.R. 20/2025, art. 2, c. 4).", "IRAP, Lazio"),
        rc("HU", "2026-01-01", 322800, "HUF a month", S["hu_mw"], "Minimum wage to HUF 322,800 a month, up 11% on 2025.", "Minimum wage"),
        rc("HU", "2026-01-01", 373200, "HUF a month", S["hu_mw"], "Guaranteed wage minimum to HUF 373,200 a month, up 7% on 2025.", "Guaranteed wage minimum"),
        rc("HU", "2026-01-01", 20000000, "HUF", S["nav_alanyi"], "VAT subject-exemption limit HUF 18 million to 20 million; 22 million from 2027, 24 million from 2028.", "VAT subject exemption limit"),
        rc("HU", "2026-01-01", 100, "% of the minimum wage", S["nav_ev"], "Sole traders' minimum monthly szocho base: 112.5% of the minimum wage to 100% (the multiplier no longer applies).", "Sole trader social contribution tax, minimum base"),
    ]


if __name__ == "__main__":
    want = sys.argv[1:] or list(FILES)
    for name in want:
        fid, fsrc, fn = FILES[name]
        rows = fn()
        # every row carries its own issuer; the file-level source names the set and points at its first row's page
        fsrc = src("Each row's own issuer (see the row's source)", fsrc["title"], rows[0]["source"]["url"])
        write(name, fid, fsrc, rows)
