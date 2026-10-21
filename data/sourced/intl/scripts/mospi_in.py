"""India: MoSPI, Annual Survey of Unincorporated Sector Enterprises (ASUSE) 2025 press note of 24 March 2026, Table 1
(all-India). mospi.gov.in does not resolve from the server: the PDF was read through the Exa web fetch tool; values typed
from its Table 1. Only the broad sector is published at this level (manufacturing, trade and other services together)."""
from lib import write, RETRIEVED

SRC = {"publisher": "National Statistics Office, Ministry of Statistics and Programme Implementation (India)",
       "title": "Press note on the Annual Survey of Unincorporated Sector Enterprises (ASUSE) 2025, Table 1: key indicators",
       "url": "https://www.mospi.gov.in/uploads/latestReleases/latest_release_1774347321466_c16ddf22-bfff-4097-88a7-b3134e464d51_Press_Note_ASUSE_2025_English.pdf"}
IN = {"level": "country", "code": "IN", "name": "India"}
OC = "ASUSE scope: unincorporated non-agricultural establishments in manufacturing, trade and other services (construction excluded)"
NOTE = "Survey period January to December 2025. Covers only the unincorporated sector (proprietorships, partnerships, co-operatives, societies); companies are outside it."
est, wrk = 792465 * 100, 1280518 * 100
rows = [
    dict(item="business_count", value=est, unit="establishments", measure="estimated number of unincorporated non-agricultural establishments (published as 7,92,465 hundred)"),
    dict(item="persons_per_business", value=round(wrk / est, 1), unit="workers per establishment", measure="workers per establishment, derived from the two published totals (12,80,518 and 7,92,465 hundred)"),
    dict(item="gva_per_business", value=252699, unit="INR", measure="gross value added per establishment as published (market establishments), current prices"),
    dict(item="gva_per_worker", value=156539, unit="INR", measure="gross value added per worker as published (market establishments), current prices"),
    dict(item="pay_annual", value=146550, unit="INR per year", measure="emoluments per hired worker as published, all activities in scope"),
]
rows = [dict(r, trade="all", officialClass=OC, geo=IN, year="2025", note=NOTE, source=SRC) for r in rows]
write("mospi-india.json", {"id": "mospi-india", "source": dict(SRC, licence="Government Open Data Licence - India, https://data.gov.in/government-open-data-license-india"),
                           "retrieved": RETRIEVED, "rows": rows})
