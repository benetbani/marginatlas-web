"""The adult monthly (or four-week) pass in six UK catalog cities, each from its transport authority's or main operator's own page
(London's Travelcard is already held in transport-passes.json). Each value is asserted against the page text saved on 2026-10-20.
Usage: python3 uk_transport_passes.py <dir of saved page texts> <out.json>"""
import json, os, sys

R = "Operator's tariff quoted as published"
PASSES = [
    # file, the words that must be on the page, geo, value, unit, year, note, source
    ("tfgm-28day.txt", "A 28-day Bee Bus ticket for adults costs £80.",
     {"level": "city", "code": "E08000003", "name": "Manchester"}, 80, "GBP per 28 days", "2026",
     "28-day Bee Bus ticket, adult: unlimited travel on all buses in Greater Manchester for 28 days; buses only, the tram is a "
     "dearer ticket; a four-week pass, not a calendar month",
     {"publisher": "Transport for Greater Manchester", "title": "28-day Bee Bus ticket (adult)",
      "url": "https://tfgm.com/tickets-and-passes/28-day-bee-bus-adult", "licence": R}),
    ("nxwm-adult.txt", "4 week Buy online or on your mobile £73",
     {"level": "city", "code": "E08000025", "name": "Birmingham"}, 73, "GBP per 28 days", "2026",
     "National Express West Midlands 4 week adult ticket: unlimited travel for 28 days on National Express buses and every "
     "operator in the nBus scheme within the nBus zone; buses only",
     {"publisher": "National Express West Midlands", "title": "Adult bus tickets",
      "url": "https://nxbus.co.uk/west-midlands/tickets-prices/adult-bus-tickets", "licence": R}),
    ("wym-adult.txt", "Countywide Bus - Month ticket £93.00",
     {"level": "city", "code": "E08000035", "name": "Leeds"}, 93, "GBP per month", "2026",
     "MCard Countywide Bus Month ticket, adult: any bus in West Yorkshire, valid anytime; no Leeds-only pass is sold; buses only "
     "(bus and rail zones 1-3 monthly is GBP 149.60)",
     {"publisher": "West Yorkshire Combined Authority (West Yorkshire Metro)", "title": "MCard Adult tickets",
      "url": "https://www.wymetro.com/tickets-and-passes/mcard-adult-tickets/", "licence": R}),
    ("firstmonth.txt", "Bristol Zone Bristol Zone Click to expand and see further details Buy Online from £ 101.20",
     {"level": "city", "code": "E06000023", "name": "Bristol"}, 101.2, "GBP per month", "2026",
     "First Bus FirstMonth, adult, Bristol Zone: unlimited travel on First buses for one calendar month, metrobus included, "
     "Airport Flyer excluded",
     {"publisher": "First Bus (First West of England)", "title": "Ticket prices, Bristol, Bath and the West: FirstMonth, Adult",
      "url": "https://www.firstbus.co.uk/bristol-bath-and-west/tickets/ticket-prices", "licence": R}),
    ("lothian-rev.txt", "Ridacard (4 week) £73.00 (Adult) £62.50 (Student) £36.50 (Child) £80.00 (Adult)",
     {"level": "city", "code": "S12000036", "name": "City of Edinburgh"}, 80, "GBP per 28 days", "2026",
     "Ridacard 4 week, adult: the season ticket for unlimited journeys on day and night services across Edinburgh, including "
     "Edinburgh Airport (Lothian's fares page); GBP 80 from 22 February 2026 "
     "(was GBP 73); a four-week pass",
     {"publisher": "Lothian Buses", "title": "Fares Revision from Sunday 22 February (30 January 2026)",
      "url": "https://www.lothianbuses.com/news/2026/01/fares-revision/", "licence": R}),
    ("firstgla-sep.txt", "Adult 4 Week City & Local £88.00",
     {"level": "city", "code": "S12000049", "name": "Glasgow City"}, 88, "GBP per 28 days", "2026",
     "First Glasgow Adult 4 Week, City & Local zone: First buses in Glasgow; GBP 88 from 7 September 2026 (the Network zone is "
     "GBP 114); a four-week pass; buses only",
     {"publisher": "First Bus (First Glasgow)", "title": "Changes to Tickets Across Glasgow and Surrounding areas from 2 September",
      "url": "https://www.firstbus.co.uk/greater-glasgow/news-and-service-updates/updates/changes-tickets-across-glasgow-and-surrounding",
      "licence": R}),
]

def main(d, out):
    rows = []
    for f, words, geo, v, unit, year, note, src in PASSES:
        assert words in open(os.path.join(d, f), encoding="utf-8").read(), (f, words)
        rows.append({"item": "transport_pass_month", "geo": geo, "value": v, "unit": unit, "year": year,
                     "measure": "monthly or four-week public transport pass, adult, full price (the unit says which)",
                     "note": note, "source": src})
    first = rows[0]["source"]
    json.dump({"id": "place-uk-transport-passes-2026", "source": first, "retrieved": "2026-10-20", "rows": rows},
              open(out, "w"), indent=1, ensure_ascii=False)
    for r in rows: print(r["geo"]["name"], r["value"], r["unit"])

if __name__ == "__main__":
    main(*sys.argv[1:])
