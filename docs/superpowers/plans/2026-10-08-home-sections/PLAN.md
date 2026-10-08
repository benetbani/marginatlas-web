# The home's new sections, from his ideas of 2026-10-08 (2026-10-08) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Four new sections on the home page, the audit's top four (FEASIBILITY.md section 4), each from files already on disk, each
in a two-up level: where new firms last (the UK's cities, the 2019 cohort after five years) beside the UK's city pages; where new
companies open (Latin America and Africa, 2022) beside where US restaurants grew and shrank (45 metros, 2019 and 2023); how figures
are made beside the notebook. The UK's answer and the leads of sections 1 and 3 are the page's three loud moments.

**Architecture:** Four small slices of files outside the repo are copied into `data/home/` by one Python script run by hand,
`scripts/data/home/export_home.py`, each fingerprinted in `data/home/manifest.json` (its SHA-256, rows, the day it ran, every
source with its own SHA-256 and its publisher's key on the sources page), the register slices' pattern. One gate a section
(`home-firms-last`, `home-new-companies`, `home-us-restaurants`, `home-how-made`) holds its slice to the manifest and, where the
source is on the machine, to its source (through `scripts/lib/home_export.ts`), then grows with the section's builder
(`src/lib/home/*.ts`, every number from its slice) and its drawing (`src/components/spine/home/Home*.tsx`). The drawings are the
site's own forms: BarList (section 1), MarkList (section 2, which gains a grouped form: two short ranked lists in one card), two
TiersTables of a name and two figures (section 3), FactRows under a focal (section 4). Three tiny optional props (Focal's
`accent`, a provenance stamp on TiersTable's and DetailPanel's figures) change nothing where they are not passed. The home view
gains three levels and loses one; `tests/trust/home_shape.test.ts` holds the new order; the sources page names the two sources
from outside the UK.

**Tech Stack:** Next.js 15 (App Router), TypeScript, tsx-run gate scripts (`scripts/prebuild_all.ts`), Python 3.13 with openpyxl
and pyarrow (both installed, user site) for the exports, the harness renderer (`scripts/harness/render_page.tsx` through
`scratchpad/reform/render_some.sh`), Playwright's Chromium for the browser gates; the design repo `E:/atlas` (QUEUE, PAGES.md).

**Ground rules (binding on every task):** no push, deploy, merge into main or force-push without his word; no Stripe, Supabase,
Vercel or DNS setting changed; no migration applied; no `.env` value printed; no install or download; no invented figure; one
change, one verification, then a commit; `tsc --noEmit` after any restore or late fix (the chain runs no typecheck); patches
holding a backslash go through the Edit tool, never a Bash heredoc (it turns `\b` into a backspace). Never raise a ratchet
baseline. Chromium is installed, so the browser gates run locally. Run `node node_modules/tsx/dist/cli.mjs`, not npx. Every
verification writes to a file under `scratchpad/uk-cities/` and is read there, never piped into a formatter (a pipe hides the exit
code). Free memory sits near 1 GB: renders and browser gates run one at a time, and one that dies for memory waits 60 s and runs
again. Another session may commit on `whats-left` meanwhile (src/lib/taxonomy.ts, src/middleware.ts, the routing files): this
plan touches none of them; if a commit meets a moved HEAD, commit on top.

For this plan: read `scratchpad/home-sections/` wherever the rules above say `scratchpad/uk-cities/`; the exports run as
`python -P` (no script directory on the path; the interpreter that holds openpyxl and pyarrow, nothing installed); no task queries
the database (the home's builders read local JSON only, and the one render this plan runs is the home's); new files are written
with the Write tool (every test holds regex backslashes).

---

## Where things stand (measured 2026-10-08 on `whats-left` at 31cba903: production main d2cefe6b plus the six UK cities plan)

- **The home** (`src/components/spine/home/home-view.tsx`, the code default since 2026-10-07) runs five zones: search (the one
  wide zone, `data-hero`), the UK's three answers (`1-1-1`, even), the registers (the duel and the kitchens list, `1-1`, even), Pro
  (only with the paywall's switch on), and the last level, the UK's city pages beside the notebook (`1-1`, even, the notebook
  filling its half). `LOUD_SEATS`: seat 1 LIT (the UK's answer at 40); seats 2 and 3 NO HONEST CANDIDATE (the search's button, the
  Pro band), so two loud moments are free. `tests/trust/home_shape.test.ts` holds that order.
- **The home's ratchets:** `home-gb` has no entry in `scripts/harness/page_laws_baseline.json`, `page_holes_baseline.json` or
  `copy_plain_baseline.json` (so every one must be 0), 0 in `model_laws_baseline.json` and 0 in `provenance_baseline.json` (every
  `.fig` stamped). The browser gates on today's render were not re-run here (a chain was running, no browser in this session);
  Task 16 measures the new render.
- **The copy gate reads a section's title as its `h3`** (the Rail's kicker): four words at most (`TITLE LONG`), one supporting
  `<p>` at 13.5px or less a card (`LINES`), twelve words and no semicolon a line. The audit's working titles "Where most new
  companies open" and "How a figure is made" are five words each.
- **Section 1's source** (`E:/atlas/cache/uk/ons_demography/2026-10-02/businessdemographyexceltables2024.xlsx`, Table 5.1a, read
  with openpyxl): the five-year percentage column is a formula (`=L5/C5*100`), so the share is worked out from the two counts. Of
  the 2019 births, still active five years on: Leeds (E08000035) 1,625 of 3,890 = 41.8; Glasgow (S12000049) 1,315 of 3,275 = 40.2;
  Edinburgh (S12000036) 1,025 of 2,590 = 39.6; Bristol (E06000023) 1,060 of 2,725 = 38.9; London, the region (E12000007) 33,785 of
  88,550 = 38.2; Manchester (E08000003) 1,485 of 4,380 = 33.9; Birmingham (E08000025, "Birmingham*") 2,205 of 7,430 = 29.7; the UK
  (K02000001) 139,845 of 363,825 = 38.4. The Notes sheet: districts "having more than 500 businesses at a single postcode contain
  an *"; the Cover: "Date published: 20th November 2025". The UK's 38.4 is `data/sections/survival.json`'s GB year 5 (the home's
  ring); London's 88,550 and 0.382 are `data/uk/registers/survival.json`'s E12000007.
- **Section 2's source** (`E:/atlas/macro/global-aggregates/wb-business-density.json`, `lastupdated` 2026-04-08, and
  `wb-labor-force-total.json`): the profile's `world_bank_region` "Latin America & Caribbean" holds 34 countries; its `continent`
  "Africa" 47, plus Egypt, Morocco, Tunisia and Algeria (continent "MENA", their cities in Africa) and Libya (MENA with no city
  in the city list, so the export's map places it in Africa; it holds no rate) = 52. With a 2022 figure and a
  2022 labour force of a million or more: 11 in Latin America (Chile 10.8, Costa Rica 5.8, Brazil 5.1, Peru 4.7, Panama 4.5, then
  Uruguay, Jamaica, Colombia, Mexico, Paraguay, Honduras) and 20 in Africa (South Africa 11.1, Botswana 8.7, Morocco 2.6, Tunisia
  1.7, Zambia 1.6, then fifteen); 2023 to 2025 hold no figure for either region, so 2022 is the latest year both show five; the UK
  2022 is 18.6. The floor leaves out Cape Verde (18.5, 0.22 million), Mauritius (9.6, 0.59 million), Barbados, Belize, Suriname,
  Comoros (and Antigua, Dominica, Seychelles, which hold no labour force).
- **Section 3's source** (`E:/atlas/us/bls/qcew/parsed/qcew_cells_{2019,2023}.parquet`, built by `E:/atlas/scripts/us_phase9_qcew_full.py`:
  annual, private, every area level, no all-industry row), NAICS 722511, the 45 metros the city list has pages for, every code
  checked against its title in `E:/atlas/us/susb/2021/msa_3digitnaics_2021.txt` (all 45 "... Metro Area" titles naming the city).
  A row marked "N" withholds employment and wages, never the establishments: all 1,869,191 N rows of 2023 carry a count and zero
  employment and pay (Raleigh 2019, Charlotte and Nashville 2023 are N rows). 35 metros grew, 10 shrank. By restaurants added:
  Atlanta 4,451 to 5,179 (728), Houston 4,512 to 5,027 (515), Dallas 5,234 to 5,712 (478), Miami 5,584 to 6,050 (466), Detroit
  2,950 to 3,413 (463; held out of the ranking, decision 12, so Phoenix 2,435 to 2,828 (393) is the fifth); by restaurants lost: San
  Francisco 5,189 to 4,919 (270), Los Angeles 11,146 to 10,975 (171), Pittsburgh 1,776 to 1,714 (62), Buffalo 939 to 886 (53), St.
  Louis 2,030 to 1,989 (41).
- **Section 4's sources:** `E:/atlas/registers/uk/tables/company_failures_by_trade.json` `match`: 31,926 notices, 31,376 company
  names, 30,510 names matched, 1,137 notices unmatched; its `source` string is `data/uk/registers/failures.json`'s. Nothing in the
  website repo holds those counts, so section 4 needs an export too. In the repo: 111 live trades have London takings read from the
  band counts (`londonTradeSales(slug).q50.open === false`; 90 codes; the UK page's money card ranks 16 of them, one a code). The
  draft's third row, the country pages a visitor can reach (195), is gone: the owner called the home's 195 counter wrong on
  2026-10-07, and the home prints no count of countries (decision 8).
- **The forms:** BarList (`src/components/spine/charts/BarList.tsx`) takes `mark`, `fill`, `reference`, `look="plain"`; MarkList
  draws one set; TiersTable's figures shape draws a name and two figures but stamps no provenance; DetailPanel's rows stamp none;
  Focal draws ink only; CityCards takes `fill`. `archetype-coverage` needs an archetype tag inside every `<Box` of a home file.

## The brief's decisions (the owner: "stop asking, decide and build"; not reopened)

Exactly four sections, the audit's top four, in two-up levels; section 1 paired with the UK cities' zone, sections 2 and 3 in one
level, section 4 with the notebook; Birmingham held out, its reason recorded, not printed; Latin America and Africa in one section,
no tabs or chips (native `<details>` allowed); one trade, 2019 against 2023, top five and bottom five, two numbers a row, never a
percent or a composite; section 4 quiet, each technique shown by a figure it produced, counts only of pages a visitor can reach,
no count of countries and no line that figures outside the UK are estimates (amended 2026-10-08, decision 8); data only from files
on disk, exported by a script with a manifest and a gate; sources named on About the figures, never in the home's copy; one
heading and at most one line a section, twelve words, no semicolon, no "modelled", "withheld", "on file", no em dash; three loud
moments; the type ladder and width ratchets only shrink.

## Decisions taken here beyond the brief

1. **Titles at the copy gate's four words:** "Where new firms last", "Where new companies open", "US restaurants since 2019", "How
   figures are made".
2. **Section 3 is ranked by restaurants added or lost (2023 less 2019), not by share:** the order must be readable off the two
   printed counts (a share ranks Raleigh's 226 over Atlanta's 728 with no figure saying why). The lead figure is the leader's
   count added, 728, a figure no row prints.
3. **Section 2's floor is a labour force of a million or more in the same year** (the series' own publisher, on disk; no population
   file is on disk); its one figure at 30 is the UK's own 18.6, "for scale" (a figure the rows do not print; it ranks nothing); each
   region's five highest drawn with flag and name, the rest behind the founder's plus; the year is the latest in which both regions
   show five (2022), worked out, never typed.
4. **A fourth export, `data/home/method.json`,** from the registers' failures table: the notices count is in no website file.
5. **One Python script in the website repo with its own manifest, not `export_for_site.py`:** re-running the register export would
   move every UK page's "Checked" date (his D2 ruling: Checked is the export's day) for figures nobody re-read.
6. **QCEW "N" rows are kept:** the mark withholds employment and wages only (measured above).
7. **Shared forms gain small optional props:** MarkList a grouped form (`groups`), TiersTable figure rows and DetailPanel rows a
   `prov` each (the home's provenance baseline is 0), Focal an `accent`; each proven byte-identical where it is not passed. Section
   1's bars and the UK cities' rows both `fill` their level (`even`); the world level is not `even` (open sections, each its height).
8. **Section 4 shows the match rate and prints no count of countries:** its focal is the 31,926 company notices (insolvencies and
   solvent liquidations alike); its first row "Names matched, 30,510 of 31,376", so the technique's honesty is on the card; its
   second row "London trade pages, 111 of 138"; then its door to About the figures. **Amended 2026-10-08, before Tasks 12 to 17 were
   built:** the draft's last row "Country pages, 195", with the line "Outside the UK, these pages print estimates.", is gone. On
   2026-10-07 the owner called the home's "195 COUNTRIES" counter wrong (`E:/atlas/rules/FOUNDER-VERDICTS.md`, "Countries, the
   still hero, the home reformed and switched on": "the picker's count is wrong"), and that night's fix took every count off the
   home (`tests/trust/home_shape.test.ts` holds "no counts"); printing 195 again, whatever its note, brings back the number he
   rejected. The estimates line goes with the row: no figure the home prints is an estimate (the UK answers and registers are
   official or counted; sections 1 to 3 are published or counted), and each country page says so on itself. His idea "Section
   for the global coverage" is not built (Out of scope, named).
9. **The sources page gains a second list,** `WORLD_SOURCES` in `src/lib/spine/uk_sources.ts` (the one module allowed to name a
   source), printed on About the figures under the UK's: the World Bank and the US Bureau of Labor Statistics.
10. **The grouped MarkList has no story on the archetype sheet** (the sheet's instances are keyed off builders; a fixture story
    would be the first of its kind): the home render's gates hold it; a QUEUE row asks for the story.
11. **Zone order:** search, answers, registers, (Pro), the UK's cities `[firms last | cities]`, beyond the UK
    `[new companies | US restaurants]`, the method `[how figures are made | notebook]`: two levels more than today, every one a pair.
12. **Detroit is held out of section 3** (2026-10-08, under his "decide, push forward"): its gain of 463 sits on a Michigan-wide step
    in the count of every kind of business, not in its restaurants. Measured by the Task 4 review and re-read from the QCEW annual
    files' own all-industry rows (private establishments), 2026-10-08: Michigan 264,942 (2021) to 315,870 (2023), +19.2%, rank 5 of 51
    (median +11.5%); 2023 alone +9.8%, rank 2 of 51 (Ohio, Indiana and Wisconsin +1.0% to +2.6%); its jobs +6.2%, so establishments
    per 100 jobs +12.3%, rank 2 (median +4.8%); every two-digit sector but retail rose more than 8%, food and lodging being 5.7% of
    the net change (7.3% of the base); and the Detroit metro's restaurants track its whole count, +14.4% against +12.6% (2021 to
    2023). A member is featured only with a reason, and a gain that is the count's step is not one: Detroit stays in the slice with
    its counts, in `held_out` with its reason, recorded and never printed, as section 1 holds out Birmingham. **Phoenix (2,435 to
    2,828, +393) is the fifth gainer**, and the section ranks 44 metros. **The drawn gainers stay** (the same review, from the QCEW
    files on this machine): Atlanta's restaurants gained 199, 309 and 377 in 2020 to 2022 and lost 157 in 2023 while its whole count
    rose every year; Georgia's 2022 jump (+12.9%, rank 1 of 51) is unclassified accounts (sector 99, +71.4%), and without them Georgia
    rose +5.0% (rank 29) and the Atlanta metro shows no jump year; Phoenix's whole count climbs steadily (+5.1%, +8.5%, +9.9%, +7.2% a
    year) with its restaurants at about half that pace; Texas and Florida show no step. Without sector 99 Michigan's 2023 rise is
    +10.1%, rank 1 of 51, so Detroit's hold-out stands.

---

## File structure

| File | Task | Responsibility |
|---|---|---|
| `scripts/data/home/export_home.py` | 1, 3, 4, 5 | the four exports and the manifest, by hand |
| `.gitattributes` | 1 | `data/home/*.json` in LF, so the hashes hold on a Windows checkout |
| `data/home/{city_survival,new_companies,us_restaurants,method,manifest}.json` | 1, 3, 4, 5 | the slices (generated) |
| `scripts/lib/home_export.ts` | 2 | the export's holder, shared by the four gates |
| `src/lib/spine/uk_sources.ts` | 2, 3, 4, 6 | `WORLD_SOURCES`; the ONS and Gazette items name what the home prints |
| `tests/home/firms_last.test.ts` | 2, 9, 13 | gate `home-firms-last` |
| `tests/home/new_companies.test.ts` | 3, 10, 13 | gate `home-new-companies` |
| `tests/home/us_restaurants.test.ts` | 4, 11, 14 | gate `home-us-restaurants` |
| `tests/home/how_made.test.ts` | 5, 12, 14 | gate `home-how-made` |
| `scripts/prebuild_all.ts`, `scripts/gates.json`, `CLAUDE.md` | 2 to 6, 9 to 15 | the four gates registered; the generated registry and counts |
| `src/app/(site)/about-data/page.tsx`, `tests/spine/uk_sources.test.ts` | 6 | the world sources printed and held |
| `src/components/spine/country/focal.tsx`, `archetypes/TiersTable.tsx`, `archetypes/DetailPanel.tsx` | 7 | `accent`, `prov` |
| `src/components/spine/archetypes/MarkList.tsx` | 8 | the grouped form |
| `src/lib/home/{firms_last,new_companies,us_restaurants,how_made}.ts` | 9 to 12 | the builders |
| `src/lib/spine/copy.ts` | 9 to 12, 15 | the sections' words, the world level's label |
| `src/components/spine/home/{HomeFirmsLast,HomeNewCompanies,HomeUsRestaurants,HomeHowMade}.tsx` | 13, 14 | the drawings |
| `src/components/spine/home/home-view.tsx`, `tests/trust/home_shape.test.ts`, `docs/loop/CENSUS.md` | 15 | the wiring, its gate, the census |
| `scratchpad/home-sections/*` (never committed) | all | outputs, identity checks, the hand-run list |
| `E:/atlas/design/loop/build/QUEUE.md`, `E:/atlas/design/loop/build/PAGES.md` | 17 | the records |

Line numbers are 31cba903's. Earlier tasks shift them (copy.ts, prebuild_all.ts and the four tests above all), so every edit below
is anchored on the exact text it quotes: find that text, not the number.

---

## Task 1: the export script and section 1's slice

**Files:**
- Create: `scripts/data/home/export_home.py`
- Modify: `.gitattributes` (append)
- Create (generated): `data/home/city_survival.json`, `data/home/manifest.json`

- [ ] **Step 1: Make the output folder**

Run: `mkdir -p scratchpad/home-sections scripts/data/home`

- [ ] **Step 2: Pin the slices to LF**

In `.gitattributes`, replace:

```
data/uk/registers/*.json        text eol=lf
```

with:

```
data/uk/registers/*.json        text eol=lf

# The home page's slices are the fourth (plan 2026-10-08, home sections): the home gates hash data/home/*.json against the
# manifest scripts/data/home/export_home.py writes in LF.

data/home/*.json                text eol=lf
```

- [ ] **Step 3: Write the script**

Create `scripts/data/home/export_home.py`:

```python
"""
scripts/data/home/export_home.py: THE HOME PAGE'S FIGURES FROM FILES ON DISK OUTSIDE THIS REPO (plan
docs/superpowers/plans/2026-10-08-home-sections/PLAN.md; his section ideas of 2026-10-08, the audit's top four).

The site's build never reads the network or another repo (its chain runs on Vercel), so the figures the home's new sections print
are copied in here, sliced to what they print, and fingerprinted the way E:/atlas/registers/uk/export_for_site.py fingerprints the
register slices: data/home/manifest.json holds each file's SHA-256 and rows, the day this export ran, and every source it read (its
path, bytes and SHA-256, the publisher's key on the sources page, src/lib/spine/uk_sources.ts, and whether a figure prints from it).
The section gates (tests/home/*.test.ts, through scripts/lib/home_export.ts) recompute each hash, so a figure edited by hand fails
the chain, and on the machine that holds the sources they hash each source again, so a source that changed since the export fails
until this runs again. It is a script of its own, not a slice of export_for_site.py: re-running that export would move every UK
page's "Checked" date (his ruling: Checked is the export's day) for figures nobody read again.

Every figure is read from its source as published (a count, a published rate) or worked out here from what was read (a share of
100 from two counts, half up to one decimal, in Decimal); none is typed. What is typed is identifiers (an area's code, a metro's
code and the state its city stands in), each checked against its own source's name for it before anything is written, and the rule
a list is cut by (a floor), written into the file with its reason. A refusal says what is wrong and writes nothing. What it writes
is read line by line by the build's internal-notes gate (scripts/verify_no_internal_notes.ts), so a note is the publisher's own
words and nothing in the files speaks of this machine's files or of running anything.

By hand, never in the chain (it reads the parent repo), from the website root, with the Python that holds openpyxl and pyarrow:
  python -P scripts/data/home/export_home.py city_survival     section 1: of 100 firms born in a year, still trading five years on
  python -P scripts/data/home/export_home.py new_companies     section 2: new limited companies per 1,000 people of working age
  python -P scripts/data/home/export_home.py us_restaurants    section 3: full-service restaurants in 45 US metros, two years
  python -P scripts/data/home/export_home.py method            section 4: the year of company notices the failure rates were read from
(each joins with its task; with no argument, every one this file holds runs.)
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
from datetime import date
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

OUT = Path("data/home")
MANIFEST = OUT / "manifest.json"
CITY_LIST = Path("data/cities/city_list_v1.json")
PROFILE = Path("data/economic_indicators/country_profile_v2.json")


def refuse(what: str) -> None:
    raise SystemExit(f"export refused: {what}; nothing was written")


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def source(key: str, path: str, publisher: str | None, title: str, prints: bool = True) -> dict:
    """A source as the manifest records it; `prints` is false for a file read only to check or to cut what another prints."""
    p = Path(path)
    if not p.is_file():
        refuse(f"{path} is not on this machine")
    return {"key": key, "path": path, "bytes": p.stat().st_size, "sha256": sha256_of(p), "publisher": publisher, "title": title, "prints": prints}


def share(survived: int, births: int) -> float:
    """Of 100, half up to one decimal: the site's rounding, in Decimal so no float tips a half."""
    return float((Decimal(survived) * 100 / Decimal(births)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


def cities_of(iso2: str) -> list[dict]:
    """The city list's cities of one country, by slug: the pages this export may print a figure for."""
    rows = json.loads(CITY_LIST.read_text(encoding="utf-8"))["cities"]
    return sorted((c for c in rows if str(c.get("iso2", "")).upper() == iso2), key=lambda c: c["slug"])


def write(name: str, obj: dict, rows: int, sources: list[dict]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    text = json.dumps(obj, indent=1, ensure_ascii=False, sort_keys=True) + "\n"
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {"files": {}}
    # The two lines that say what the file is are set on every write, so a change of wording reaches a manifest that already exists.
    manifest["what"] = "Slices of files outside this repo, the figures the home page's sections print; do not edit by hand"
    manifest["built_by"] = "scripts/data/home/export_home.py"
    manifest["files"][name] = {"sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "rows": rows, "built": date.today().isoformat(), "sources": sources}
    (OUT / name).write_text(text, encoding="utf-8", newline="\n")
    MANIFEST.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    print(f"{name}: {rows} rows, {manifest['files'][name]['sha256'][:12]}")


# ---- section 1: where new firms last ---------------------------------------------------------------------------------------------

DEMOGRAPHY = "E:/atlas/cache/uk/ons_demography/2026-10-02/businessdemographyexceltables2024.xlsx"
# THE UK CITIES WITH A PAGE, by their areas' own codes in the tables (London's page is Greater London: the region's row).
CITY_AREAS = {
    "birmingham": "E08000025",
    "bristol": "E06000023",
    "edinburgh": "S12000036",
    "glasgow": "S12000049",
    "leeds": "E08000035",
    "london": "E12000007",
    "manchester": "E08000003",
}
UK_AREA = "K02000001"


def city_survival() -> None:
    """Of 100 firms born in the table's cohort, how many still traded five years on, per UK city with a page (Table 5.1a). The
    table's five-year percentage is a formula, so the share is worked out from its two counts. An area the publisher stars is held
    out with the publisher's own reason, recorded and never printed. The publisher's note on stars is kept whole, for it goes on to
    say that areas with up to 500 such businesses are not identified."""
    import openpyxl

    cities = cities_of("GB")
    if [c["slug"] for c in cities] != sorted(CITY_AREAS):
        refuse(f"the city list's UK cities {[c['slug'] for c in cities]} are not the areas this export reads {sorted(CITY_AREAS)}")
    wb = openpyxl.load_workbook(DEMOGRAPHY, read_only=True)
    head, rows = None, {}
    for r in wb["Table 5.1a"].iter_rows(values_only=True):
        if head is None:
            if r and len(r) > 12 and isinstance(r[2], str) and r[2].strip().endswith("Births"):
                head = r
            continue
        if r and isinstance(r[0], str) and r[0].strip():
            rows[r[0].strip()] = r
    if head is None or str(head[11]).strip() != "5-year survival":
        refuse("Table 5.1a holds no births column or no five-year survival column where the 2024 release put them")
    cohort = int(str(head[2]).split()[0])

    def lines(sheet: str) -> list[str]:
        return [" ".join(str(v) for v in r if v is not None) for r in wb[sheet].iter_rows(values_only=True)]

    def note_of(sheet: str, phrase: str) -> tuple[str, str] | None:
        """The numbered note of `sheet` with `phrase` in a row of its description: that row, and the note whole, every row from its
        number to the next number as the publisher wrote it (spaces tidied) and joined by a space. Nothing of it is typed here but
        the phrase it is found by."""
        entries = []
        for r in wb[sheet].iter_rows(values_only=True):
            cells = [*r, None, None]
            entries.append((cells[0], " ".join(str(cells[1]).split()) if cells[1] is not None else ""))
        hit = next((i for i, (num, text) in enumerate(entries) if num is None and phrase in text), None)
        if hit is None:
            return None
        top, end = hit, hit + 1
        while top > 0 and entries[top][0] is None:
            top -= 1
        while end < len(entries) and entries[end][0] is None:
            end += 1
        if entries[top][0] is None:
            return None
        return entries[hit][1], " ".join(text for _, text in entries[top + 1 : end] if text)

    star = note_of("Notes", "500 businesses at a single postcode")
    reason = re.search(r"more than \d+ businesses at a single postcode", star[0]) if star else None
    published = next((t.split(":", 1)[1].strip() for t in lines("Cover") if t.startswith("Date published")), None)
    if not star or not reason or not published:
        refuse("the workbook's note on starred areas, or its date of publication, is not where or as the 2024 release put them")

    def area(code: str) -> dict:
        r = rows.get(code)
        if r is None:
            refuse(f"Table 5.1a holds no row {code}")
        births, survived = int(r[2]), int(r[11])
        if births <= 0 or not 0 <= survived <= births:
            refuse(f"{code}: {survived} of {births} is not a share")
        return {"code": code, "name_in_table": str(r[1]).strip(), "births": births, "survived": survived, "pct": share(survived, births)}

    drawn, held = [], []
    for c in cities:
        a = area(CITY_AREAS[c["slug"]])
        if c["name"].lower() not in a["name_in_table"].lower():
            refuse(f"{a['code']} reads {a['name_in_table']!r} in the table, not {c['name']!r}")
        row = {"slug": c["slug"], "name": c["name"], **a}
        if a["name_in_table"].endswith("*"):
            held.append({**row, "why": f"the publisher stars this area: {reason.group(0)}"})
        else:
            drawn.append(row)
    obj = {"cohort": cohort, "year": cohort + 5, "table": "Table 5.1a", "published": published, "star_note": star[1], "uk": area(UK_AREA), "cities": drawn, "held_out": held}
    write("city_survival.json", obj, len(drawn) + len(held) + 1, [
        source("demography", DEMOGRAPHY, "ons", "Business demography, UK: 2024, reference tables, Table 5.1a: the 2019 births and their survival"),
    ])


EXPORTS = {
    "city_survival": city_survival,
}


if __name__ == "__main__":
    asked = sys.argv[1:] or list(EXPORTS)
    unknown = [a for a in asked if a not in EXPORTS]
    if unknown:
        raise SystemExit(f"usage: python -P scripts/data/home/export_home.py [{' | '.join(EXPORTS)}] (unknown: {', '.join(unknown)})")
    for a in asked:
        EXPORTS[a]()
```

- [ ] **Step 4: Run it**

Run: `python -P scripts/data/home/export_home.py city_survival > scratchpad/home-sections/x01.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x01.txt`
Expected (read the file): `city_survival.json: 8 rows, <twelve hex>`, `exit 0`.
Run: `node -e "const d=require('./data/home/city_survival.json');console.log(d.cohort,d.year,d.published,d.uk.pct,d.cities.map(c=>c.slug+'='+c.pct).join(' '),'held:',d.held_out.map(c=>c.slug+'='+c.pct).join(' '))" > scratchpad/home-sections/x01b.txt 2>&1`
Expected: `2019 2024 20th November 2025 38.4 bristol=38.9 edinburgh=39.6 glasgow=40.2 leeds=41.8 london=38.2 manchester=33.9 held: birmingham=29.7`.
Run: `git diff --stat .gitattributes > scratchpad/home-sections/x01c.txt 2>&1; git status --short data/home >> scratchpad/home-sections/x01c.txt`
Expected: `.gitattributes` one file changed; `?? data/home/`.

- [ ] **Step 5: Commit**

```bash
git add scripts/data/home/export_home.py .gitattributes data/home/city_survival.json data/home/manifest.json
git commit -m "The home's exports: scripts/data/home/export_home.py and section 1's slice, the UK cities' 2019 cohort after five years, Birmingham held out with the publisher's star (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 2: the exports' holder and gate `home-firms-last`

**Files:**
- Create: `scripts/lib/home_export.ts`
- Modify: `src/lib/spine/uk_sources.ts` (an empty `WORLD_SOURCES` above `UK_REGISTER_SOURCE`)
- Create: `tests/home/firms_last.test.ts`
- Modify: `scripts/prebuild_all.ts` (one entry below `home-kitchens`); generated `scripts/gates.json`, `CLAUDE.md`

- [ ] **Step 1: The world sources' list, empty for now**

In `src/lib/spine/uk_sources.ts`, above:

```ts
/** The register slices the UK pages read (data/uk/registers/manifest.json), each to its publisher's entry. */
```

add:

```ts
/** THE HOME PAGE'S SOURCES OUTSIDE THE UNITED KINGDOM (plan 2026-10-08, home sections 2 and 3): named here, the one module allowed
 *  to name a source, and printed on About the figures under the UK's list. An attribution line prints only where the record names
 *  the licence (the rule above); each section's export names its entry by `key` (data/home/manifest.json), and its gate holds it. */
export const WORLD_SOURCES: readonly UkSource[] = [];

```

- [ ] **Step 2: Write the holder**

Create `scripts/lib/home_export.ts`:

```ts
/**
 * scripts/lib/home_export.ts , THE HOME'S EXPORTS ARE THEIR SOURCES' (plan 2026-10-08, home sections).
 *
 * data/home/ holds slices of files on disk outside this repo, written by scripts/data/home/export_home.py with a manifest of each
 * file's SHA-256, its rows, the day it ran and every source it read (path, bytes, SHA-256, the publisher's key on the sources page,
 * whether a figure prints from it). Each section's gate (tests/home/<section>.test.ts) holds its file here:
 *   - the manifest is readable JSON that lists files, hashes every .json in data/home and names none that is missing, so a file
 *     nothing hashes cannot sit there;
 *   - the file is the export's byte for byte, so a figure edited by hand fails the chain (a CRLF checkout is named as such);
 *   - every source a figure prints from names its publisher's entry in src/lib/spine/uk_sources.ts (UK_SOURCES or WORLD_SOURCES);
 *   - on the machine that holds the sources, each is hashed again, so a source changed since the export fails until it runs again.
 * It reads this repo, and a source only where it exists (existsSync), which a build server never has. A source it could not hash
 * again is DEFERRED, never passed: the holder returns its key (`deferred`), and the gate ends on homePassLine(), whose last line
 * reads "<gate>: all pass, N deferred (<keys>: source not on this machine)". The chain's runner counts that "N deferred" off the
 * last twenty lines a gate prints (scripts/prebuild_all.ts), so the skip shows in its summary, and nothing may print after it.
 *
 * Every finding goes through the gate's `check(label, ok, at?)`. `at` is optional and says where a finding is and what to do about
 * it when that is not the gate's own file and remedy: the manifest, a stray or a missing file, the sources page, the line ends.
 * A gate that passes none (or whose check takes two arguments) keeps its own file and remedy for every finding.
 * An entry whose sources are missing or damaged is such a finding, and the gate is handed an empty list of sources (so
 * `held.entry.sources` is always a list): it reds on its own lookup of a source and ends on its summary, never on a stack.
 *
 * What it cannot see: a hand edit that also rewrites manifest.json (nothing signs the manifest, as with the register slices), and
 * whether the export read its source rightly (the export's refusals and each gate's own checks hold that).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { UK_SOURCES, WORLD_SOURCES } from "../../src/lib/spine/uk_sources";

export const HOME_DIR = "data/home";
export const HOME_MANIFEST = `${HOME_DIR}/manifest.json`;
export const HOME_EXPORT = "python -P scripts/data/home/export_home.py";
/** The module that names every publisher; a source's `publisher` is a key in it. */
export const HOME_SOURCES_PAGE = "src/lib/spine/uk_sources.ts";

export type HomeSource = { key: string; path: string; bytes: number; sha256: string; publisher: string | null; title: string; prints: boolean };
export type HomeEntry = { sha256: string; rows: number; built: string; sources: HomeSource[] };
/** Where a finding is and what to do about it, when that is not the gate's own file and remedy. */
export type HomeAt = { file?: string; remedy?: string };
/** The gate's `check`: a PASS line, or a red with the gate's rule, and `at` or else the gate's file and remedy. */
export type HomeCheck = (label: string, ok: boolean, at?: HomeAt) => void;
/** A slice held: its parsed body, its manifest entry and the keys of the sources this machine does not hold (their hashes were not
 *  read again). The entry's `sources` is always a list: the manifest's own when every source in it is whole, else empty, after the
 *  red that says so. */
export type HomeHeld = { data: unknown; entry: HomeEntry; deferred: string[] };

const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex");
/** A file's SHA-256, or null where it cannot be read as a file. */
const hashOf = (path: string): string | null => {
  try {
    return sha(readFileSync(path));
  } catch {
    return null;
  }
};

/** The slice `name` held to the manifest and its sources, each finding through `check`; its parsed body, its manifest entry and the keys it deferred. */
export function holdHomeExport(name: string, check: HomeCheck): HomeHeld | null {
  /* THE MANIFEST: there, JSON, and listing files. A missing, cut-off or emptied one is a red with its remedy, never a stack. */
  const manifestAt: HomeAt = { file: HOME_MANIFEST, remedy: `git checkout -- ${HOME_MANIFEST}, or re-run ${HOME_EXPORT}` };
  let files: Record<string, HomeEntry> | null = null;
  let damage = "is missing";
  if (existsSync(HOME_MANIFEST)) {
    try {
      const m = JSON.parse(readFileSync(HOME_MANIFEST, "utf8")) as { files?: unknown } | null;
      if (m && typeof m.files === "object" && m.files !== null && !Array.isArray(m.files)) files = m.files as Record<string, HomeEntry>;
      else damage = "holds no list of files";
    } catch {
      damage = "cannot be read as JSON";
    }
  }
  if (!files) {
    check(`${HOME_MANIFEST} ${damage}`, false, manifestAt);
    return null;
  }
  const listed = Object.keys(files).sort();
  const onDisk = readdirSync(HOME_DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
  const unlisted = onDisk.filter((f) => !listed.includes(f));
  const lacking = listed.filter((f) => !onDisk.includes(f));
  if (unlisted.length === 0 && lacking.length === 0) check(`the manifest hashes every file in ${HOME_DIR} and names none that is missing (listed ${listed.join(", ") || "none"}; on disk ${onDisk.join(", ") || "none"})`, true);
  for (const f of unlisted) check(`${HOME_DIR}/${f} sits in ${HOME_DIR} and the manifest does not list it`, false, { file: `${HOME_DIR}/${f}`, remedy: "delete it, or add it to the export" });
  for (const f of lacking) check(`the manifest lists ${f} and ${HOME_DIR} does not hold it`, false, { file: `${HOME_DIR}/${f}`, remedy: `re-run ${HOME_EXPORT} ${f.replace(/\.json$/, "")}` });

  /* THE SLICE: listed, there, readable, and the export's byte for byte. */
  const entry = files[name];
  const file = `${HOME_DIR}/${name}`;
  if (!entry || typeof entry !== "object" || !existsSync(file)) {
    check(`${file} is exported and in the manifest`, false);
    return null;
  }
  let raw: Buffer;
  try {
    raw = readFileSync(file);
  } catch {
    check(`${file} cannot be read as a file`, false);
    return null;
  }
  const now = sha(raw);
  const want = typeof entry.sha256 === "string" ? entry.sha256 : "";
  const same = now === want;
  const crlf = !same && sha(raw.toString("utf8").replace(/\r\n/g, "\n")) === want;
  check(`${name} is the export's, byte for byte (${now.slice(0, 12)}, the manifest's ${want.slice(0, 12)})${crlf ? ": its line ends were rewritten to CRLF" : ""}`, same, crlf ? { file, remedy: "check out data/home/*.json with LF: .gitattributes pins it" } : undefined);
  check(`${name} says the day it was exported (${entry.built})`, /^\d{4}-\d{2}-\d{2}$/.test(typeof entry.built === "string" ? entry.built : ""));
  const listedSources = Array.isArray(entry.sources) ? entry.sources : [];
  const named = listedSources.length > 0 && listedSources.every((s) => !!s && typeof s.key === "string" && typeof s.path === "string" && typeof s.sha256 === "string");
  check(`${name} names the sources it was exported from (${named ? listedSources.map((s) => s.key).join(", ") : "none"})`, named);
  /* That red is given. From here the gates are handed the whole list or an empty one, never a damaged one: a gate looks a source up
     by its key (held.entry.sources.find), and must end on its own red summary, not on a TypeError. */
  const sources = named ? listedSources : [];

  /* THE SOURCES: the publisher of each a figure prints from is on the sources page; each is hashed again where this machine holds it. */
  const keys = new Set([...UK_SOURCES, ...WORLD_SOURCES].map((s) => s.key));
  const deferred: string[] = [];
  for (const s of sources) {
    if (s.prints) check(`${name}: the source a figure prints from names its publisher on the sources page (${s.key}: ${s.publisher})`, !!s.publisher && keys.has(s.publisher), { file: HOME_SOURCES_PAGE, remedy: "add the source to WORLD_SOURCES or fix the key in export_home.py" });
    if (existsSync(s.path)) check(`${name}: on this machine its source ${s.key} is the file it was exported from`, hashOf(s.path) === s.sha256);
    else {
      deferred.push(s.key);
      console.log(`DEFER ${name}: its source ${s.key} is not on this machine, so its hash was not read again here`);
    }
  }
  let data: unknown;
  try {
    data = JSON.parse(raw.toString("utf8"));
  } catch {
    check(`${file} cannot be read as JSON`, false);
    return null;
  }
  return { data, entry: { ...entry, sources }, deferred };
}

/** A gate's last line. When `held` deferred any source it says so as "N deferred (<keys>: source not on this machine)", the form the runner counts. */
export function homePassLine(gate: string, held: HomeHeld | null): string {
  const keys = held?.deferred ?? [];
  return keys.length > 0 ? `${gate}: all pass, ${keys.length} deferred (${keys.join(", ")}: source not on this machine)` : `${gate}: all pass`;
}
```

- [ ] **Step 3: Write the gate**

Create `tests/home/firms_last.test.ts`:

```ts
/**
 * WHERE NEW FIRMS LAST, THE UK'S CITIES (plan 2026-10-08, home sections, section 1; his idea of 2026-10-08, "Midtier city
 * opportunities Leeds, Austin, Lublin, Malaga", built for the UK's cities, where the data holds it). Of 100 firms born in the
 * table's cohort, how many still traded five years on, per UK city with a page (data/home/city_survival.json, from the business
 * demography tables by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; every UK city with a page is read by its own area code and is drawn or held out with the
 * publisher's reason (a star: over 500 businesses at one postcode), never both and never neither; every share is its two counts'
 * (half up, one decimal, in whole numbers), so none can be typed; the UK's share is the one the home's ring prints
 * (data/sections/survival.json) and London's the one London's pages read (data/uk/registers/survival.json); the shares are of the
 * cohort's fifth year.
 *
 * Run: npx tsx tests/home/firms_last.test.ts
 */
import { readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { buildSurvival } from "../../src/lib/spine/sections/first_years";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-firms-last";
const FILE = "data/home/city_survival.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py city_survival, never edit data/home by hand; then draw section 1 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

type Area = { code: string; name_in_table: string; births: number; survived: number; pct: number };
type City = Area & { slug: string; name: string };
type Export = { cohort: number; year: number; table: string; published: string; star_note: string; uk: Area; cities: City[]; held_out: Array<City & { why: string }> };

const held = holdHomeExport("city_survival.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  check(`the manifest's rows are the slice's: the UK, ${d.cities.length} drawn and ${d.held_out.length} held out (${held.entry.rows})`, held.entry.rows === 1 + d.cities.length + d.held_out.length);
  /* Of 100, half up to one decimal, in whole numbers so no float can tip a half (the export's Decimal). */
  const share = (survived: number, births: number) => Math.floor((2000 * survived + births) / (2 * births)) / 10;
  const uk = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "GB").map((c) => c.slug).sort();
  const drawn = d.cities.map((c) => c.slug);
  const out = d.held_out.map((c) => c.slug);
  check(`every UK city with a page is drawn or held out, never both (drawn ${drawn.join(", ")}; held out ${out.join(", ") || "none"})`, JSON.stringify([...drawn, ...out].sort()) === JSON.stringify(uk) && !drawn.some((s) => out.includes(s)));
  check("a city is held out only where the publisher stars its area, with the reason, and the note on stars is the workbook's", d.held_out.every((c) => c.name_in_table.endsWith("*") && c.why.length > 0) && d.cities.every((c) => !c.name_in_table.endsWith("*")) && /500 businesses/.test(d.star_note));
  check("Birmingham is held out (the publisher's star: over 500 businesses at one postcode)", out.includes("birmingham"));
  const all = [d.uk, ...d.cities, ...d.held_out];
  check(`every share is its two counts' (${all.map((a) => `${a.code} ${a.survived}/${a.births}=${a.pct}`).join("; ")})`, all.every((a) => Number.isInteger(a.births) && Number.isInteger(a.survived) && a.births > 0 && a.survived >= 0 && a.survived <= a.births && a.pct === share(a.survived, a.births)));
  check(`each city is read under its own name in the table (${[...d.cities, ...d.held_out].map((c) => `${c.name}: ${c.name_in_table}`).join("; ")})`, [...d.cities, ...d.held_out].every((c) => c.name_in_table.toLowerCase().includes(c.name.toLowerCase())));
  check(`the shares are of the cohort's fifth year (${d.cohort} to ${d.year}, ${d.table}, published ${d.published})`, d.year - d.cohort === 5 && d.table === "Table 5.1a" && d.published.length > 0);
  /* The ring prints the GB curve's LAST point (home_answers.ts reads buildSurvival("GB").last) and the slice reads the cohort's fifth
     year, so the two are one figure only while the curve's last point is its fifth year. */
  const ring = buildSurvival("GB");
  check(`the UK's share is the home's ring's: the slice's fifth year is ${d.uk.pct} (the ${d.cohort} cohort), the ring prints the curve's last point, year ${ring?.last.year}, ${ring?.last.pct} (the ${ring?.cohort} cohort)`, !!ring && ring.last.year === 5 && ring.cohort === d.cohort && ring.last.pct === d.uk.pct);
  const london = d.cities.find((c) => c.slug === "london");
  const slice = (JSON.parse(readFileSync("data/uk/registers/survival.json", "utf8")) as { areas: Record<string, { births_2019: number; cohort_2019_five_years: number }> }).areas[london?.code ?? ""];
  check(`London's row is the register slice's (${london?.births} births, ${london?.pct} of 100, against ${slice?.births_2019} and ${slice?.cohort_2019_five_years})`, !!london && !!slice && london.births === slice.births_2019 && Math.abs(london.pct / 100 - slice.cohort_2019_five_years) < 0.0005);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/firms_last", held));
```

The tie to the home's ring reads what the ring prints: `buildSurvival("GB").last`, the curve's last point (src/lib/spine/home_answers.ts), which must be
the fifth year the slice reads. A sixth year on the curve moves the ring and reds the gate, and the red names both sides (the slice's share and the
ring's year and share).

- [ ] **Step 4: Run it, then plant a hand edit and watch it red**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t02.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t02.txt`
Expected: every line PASS (the source's hash among them: the workbook is on this machine), `home/firms_last: all pass`, `exit 0`. Where the workbook is not on the machine (a build server) the holder prints a `DEFER` line for it and the gate ends `home/firms_last: all pass, 1 deferred (demography: source not on this machine)`; the chain's runner counts that "N deferred" and reports it in its summary, so a skipped hash is never read as a pass. The holder's own findings (the manifest missing, cut off or listing no files; a file in data/home it does not list; a slice it lists that data/home lacks; a publisher the sources page lacks; CRLF line ends) name their own file and remedy through `check`'s third argument, never the gate's.
Run: `node -e "const f=require('fs'),p='data/home/city_survival.json';f.writeFileSync(p,f.readFileSync(p,'utf8').replace('\"pct\": 41.8','\"pct\": 41.9'))"`
Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t02plant.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t02plant.txt`
Expected: red lines for `city_survival.json is the export's, byte for byte` and `every share is its two counts'`, `exit 1`.
Run: `git checkout -- data/home/city_survival.json`, then the first run again: `exit 0`.

- [ ] **Step 5: Register the gate and regenerate the counts**

In `scripts/prebuild_all.ts`, below:

```ts
  { name: "home-kitchens", script: "tests/home/kitchens.test.ts" },
```

add:

```ts
  /* The home's new sections (plan 2026-10-08, home sections; his section ideas of that day): each held to its slice in data/home
     (scripts/data/home/export_home.py: the hash, the sources, the arithmetic) and, from its builder's task on, its builder and its
     drawing. Section 1, where new firms last: the UK cities' 2019 cohort after five years, Birmingham held out. */
  { name: "home-firms-last", script: "tests/home/firms_last.test.ts" },
```

Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c02.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c02.txt`
Expected: `[counts] wrote 1 carrier(s) and scripts/gates.json: <one more than before> gates, ...`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,uk-sources,counts-fresh,no-parent-repo-reads,gate-reds-ratchet,single-gate-chain,gate-conflicts,no-source-agencies > scratchpad/home-sections/g02.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g02.txt`
Expected: `Passed: 8`, `Failed: 0`, `SUBSET: PASS`, `exit 0`.

- [ ] **Step 6: Commit**

```bash
git add scripts/lib/home_export.ts src/lib/spine/uk_sources.ts tests/home/firms_last.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md
git commit -m "Gate home-firms-last: section 1's slice held to its manifest and its source, every share its two counts', the UK's the ring's and London's the register slice's (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 3: section 2's slice and gate `home-new-companies`

**Files:**
- Modify: `scripts/data/home/export_home.py` (a function above `EXPORTS = {`, one entry)
- Modify: `src/lib/spine/uk_sources.ts` (`WORLD_SOURCES` takes the World Bank)
- Create: `tests/home/new_companies.test.ts`
- Modify: `scripts/prebuild_all.ts`; generated `scripts/gates.json`, `CLAUDE.md`, `data/home/new_companies.json`, `data/home/manifest.json`

- [ ] **Step 1: Write the failing gate**

Create `tests/home/new_companies.test.ts`:

```ts
/**
 * WHERE NEW COMPANIES OPEN, LATIN AMERICA AND AFRICA (plan 2026-10-08, home sections, section 2; his ideas of 2026-10-08, "LATAM
 * Gems" and "Best of Africa (countries)", with "Rising stars countries" folded in as the audit found it). New limited companies
 * registered in a year per 1,000 people of working age, one year, each region ranked within itself (data/home/new_companies.json,
 * from the new-business series by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's; each region's members are the ones the in-repo files give it (the country profile's
 * world_bank_region for Latin America; its continent, or a MENA country whose cities stand in Africa, or one with no city in the
 * list that the export's map places there, for Africa); a member shows only with a figure for the year and a labour force of at
 * least the floor, which says what it does; five or more show in each region; the UK's own figure is there; every member shown has
 * a country page; and, where the series is on this machine, each names the indicator the slice says it is, every figure, the UK's
 * among them, is the source's, read again, and the year is the latest in which both regions show five.
 *
 * Run: npx tsx tests/home/new_companies.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-new-companies";
const FILE = "data/home/new_companies.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py new_companies, never edit data/home by hand; then draw section 2 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A source table read as JSON. One that is cut off or damaged is a red of its own, with its path and the remedy, and null: the
 *  checks that need the table are skipped, so the gate ends on its summary and never on a SyntaxError stack. */
function readTable<T>(name: string, path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    check(`the ${name} table reads as JSON`, false, { file: path, remedy: "restore the source file, then re-run the export" });
    return null;
  }
}

type Member = { iso2: string; value: number | null; labour_force: number | null; shown: boolean };
type Export = { year: number; measure: string; last_updated: string; floor: { measure: string; year: number; at_least: number; why: string }; uk: { iso2: string; value: number }; regions: Array<{ key: string; rule: string; members: Member[] }> };
const REGIONS = ["latam", "africa"] as const;
/* A MENA country is African by where its cities stand in the city list. One with no city there is placed by this map, the export's own
   (MENA_WITHOUT_A_CITY in scripts/data/home/export_home.py), kept here as a second copy so a placement changes in both files or this
   gate fails. On the 2022 figures Libya holds no rate, so placing it in Africa shows nothing new. */
const MENA_WITHOUT_A_CITY: Record<string, "africa" | null> = { LY: "africa", PS: null, SY: null, YE: null };

const held = holdHomeExport("new_companies.json", check);
const d = (held?.data ?? null) as Export | null;
if (d && held) {
  const counted = d.regions.reduce((n, r) => n + r.members.length, 0);
  check(`the manifest's rows are the slice's: the UK and ${counted} members (${held.entry.rows})`, held.entry.rows === 1 + counted);
  const profile = (JSON.parse(readFileSync("data/economic_indicators/country_profile_v2.json", "utf8")) as { countries: Record<string, { continent?: string; world_bank_region?: string }> }).countries;
  const cityContinent = new Map<string, string>();
  for (const c of (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ iso2: string; continent: string }> }).cities) {
    const k = c.iso2.toUpperCase();
    if (!cityContinent.has(k)) cityContinent.set(k, c.continent);
  }
  const regionOf = (iso2: string, p: { continent?: string; world_bank_region?: string }) => {
    if (p.world_bank_region === "Latin America & Caribbean") return "latam";
    if (p.continent === "Africa") return "africa";
    if (p.continent !== "MENA") return null;
    return cityContinent.has(iso2) ? (cityContinent.get(iso2) === "Africa" ? "africa" : null) : MENA_WITHOUT_A_CITY[iso2] ?? null;
  };
  const noCity = Object.entries(profile).filter(([iso2, p]) => p.continent === "MENA" && !cityContinent.has(iso2)).map(([iso2]) => iso2).sort();
  check(`a MENA country with no city in the list is placed by the map and the map names no other (${noCity.map((i) => `${i}: ${MENA_WITHOUT_A_CITY[i] ?? "not Africa"}`).join(", ") || "none"})`, JSON.stringify(noCity) === JSON.stringify(Object.keys(MENA_WITHOUT_A_CITY).sort()));
  check(`the regions are Latin America and Africa, in that order (${d.regions.map((r) => r.key).join(", ")})`, JSON.stringify(d.regions.map((r) => r.key)) === JSON.stringify(REGIONS));
  for (const key of REGIONS) {
    const want = Object.entries(profile).filter(([iso2, p]) => regionOf(iso2, p) === key).map(([iso2]) => iso2).sort();
    const members = d.regions.find((r) => r.key === key)?.members ?? [];
    check(`${key}: the members are the profile's (${members.length} against ${want.length})`, JSON.stringify(members.map((m) => m.iso2).sort()) === JSON.stringify(want));
    const shown = members.filter((m) => m.shown);
    check(`${key}: a member shows only with a ${d.year} figure and a labour force of ${d.floor.at_least} or more (${shown.length} shown)`, members.every((m) => m.shown === (typeof m.value === "number" && Number.isFinite(m.value) && typeof m.labour_force === "number" && m.labour_force >= d.floor.at_least)));
    check(`${key}: five or more show (${shown.length})`, shown.length >= 5);
  }
  check(`the floor is the labour force of the slice's own year, with its reason (${d.floor.measure}, ${d.floor.year}, ${d.floor.at_least})`, d.floor.year === d.year && d.floor.at_least > 0 && d.floor.why.length > 0);
  check(`the UK's own figure for ${d.year} is there (${d.uk.value})`, d.uk.iso2 === "GB" && Number.isFinite(d.uk.value) && d.uk.value > 0);
  const codes = new Set(COUNTRIES.map((c) => c.code));
  check("every member shown has a country page", d.regions.every((r) => r.members.filter((m) => m.shown).every((m) => codes.has(m.iso2))));

  /* THE SOURCE, READ AGAIN, where it is on this machine. A series that is not is deferred by the holder, and its key ends the last line. */
  const density = held.entry.sources.find((s) => s.key === "density");
  const labour = held.entry.sources.find((s) => s.key === "labour_force");
  check("the manifest names the two series the figures were read from (density, labour_force)", !!density && !!labour);
  if (density && labour && existsSync(density.path) && existsSync(labour.path)) {
    type Row = { country: { id: string }; date: string; value: number | null; indicator?: { id?: string } };
    const table = (name: string, path: string) => {
      const rows = readTable<[unknown, Row[]]>(name, path);
      if (!rows) return null;
      const by = new Map<string, number>();
      const ids = new Set<string>();
      for (const r of rows[1]) {
        ids.add(r.indicator?.id ?? "none");
        if (r.value !== null && r.value !== undefined) by.set(`${r.country.id}:${r.date}`, r.value);
      }
      return { by, id: [...ids].sort().join(", ") };
    };
    const densTable = table("density", density.path), lfTable = table("labour_force", labour.path);
    if (densTable && lfTable) {
      const dens = densTable.by, lf = lfTable.by;
      check(`each series names the indicator the slice says it is (${densTable.id} for ${d.measure}; ${lfTable.id} for ${d.floor.measure})`, densTable.id === d.measure && lfTable.id === d.floor.measure);
      const all = d.regions.flatMap((r) => r.members);
      const wrong = all.filter((m) => (dens.get(`${m.iso2}:${d.year}`) ?? null) !== m.value || (lf.get(`${m.iso2}:${d.year}`) ?? null) !== m.labour_force).map((m) => m.iso2);
      check(`every member's ${d.year} figure and labour force are the source's, read again here${wrong.length ? `: differs on ${wrong.join(", ")}` : ""}`, wrong.length === 0);
      const gb = dens.get(`GB:${d.year}`);
      check(`the UK's ${d.year} figure is the source's, read again here (${d.uk.value} against ${gb ?? "none"})`, gb === d.uk.value);
      const years = [...new Set([...dens.keys()].map((k) => k.split(":")[1]))].sort().reverse();
      const shows = (iso2: string, y: string) => dens.has(`${iso2}:${y}`) && (lf.get(`${iso2}:${y}`) ?? 0) >= d.floor.at_least;
      const latest = years.find((y) => REGIONS.every((key) => (d.regions.find((r) => r.key === key)?.members ?? []).filter((m) => shows(m.iso2, y)).length >= 5) && dens.has(`GB:${y}`));
      check(`the year is the latest in which both regions show five and the UK has a figure (${latest})`, latest === String(d.year));
    }
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/new_companies", held));
```

A series file that is cut off or damaged is a red of its own (`the density table reads as JSON`, `the labour_force table reads as JSON`, each naming
the file and the remedy: restore the source file, then re-run the export), never a SyntaxError stack, and the checks that read the series again are
skipped.

Run: `node node_modules/tsx/dist/cli.mjs tests/home/new_companies.test.ts > scratchpad/home-sections/t03.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t03.txt`
Expected: `data/home/new_companies.json is exported and in the manifest` red, `exit 1`.

- [ ] **Step 2: The World Bank on the sources list**

In `src/lib/spine/uk_sources.ts`, replace:

```ts
export const WORLD_SOURCES: readonly UkSource[] = [];
```

with:

```ts
export const WORLD_SOURCES: readonly UkSource[] = [
  {
    key: "worldbank",
    publisher: "World Bank",
    names: ["World Bank"],
    attribution: null,
    items: [
      { prints: "New limited companies per 1,000 people of working age, in Latin America and in Africa, on the home page", title: "World Development Indicators: new business density (IC.BUS.NDNS.ZS), and the labour force (SL.TLF.TOTL.IN) that sets the list's floor", url: "https://data.worldbank.org/indicator/IC.BUS.NDNS.ZS" },
    ],
  },
];
```

- [ ] **Step 3: Write the export**

In `scripts/data/home/export_home.py`, above `EXPORTS = {`, add:

```python
# ---- section 2: where new companies open -----------------------------------------------------------------------------------------

DENSITY = "E:/atlas/macro/global-aggregates/wb-business-density.json"
LABOUR = "E:/atlas/macro/global-aggregates/wb-labor-force-total.json"
# Every row of a series file names its own indicator; series() reads it and refuses a file that is not the one asked for.
DENSITY_INDICATOR = "IC.BUS.NDNS.ZS"
LABOUR_INDICATOR = "SL.TLF.TOTL.IN"
# THE FLOOR: a labour force under a million, in the same year as the rate, leaves a country out of the lists (on 2022's figures Cape
# Verde, Mauritius and Barbados hold a rate and are left out). It states what it does and no cause: no file says why a small
# economy's rate differs from the rest.
FLOOR = 1_000_000
SHOWN_AT_LEAST = 5
# A MENA country counts as African by where its cities stand in the city list. Those with no city there cannot be placed that way,
# so each is named here and placed by its continent (Libya: Africa; Palestine, Syria and Yemen: not Africa), never left to fall out
# of Africa for want of a city. The export refuses, naming the country, when a MENA country with no city is missing from this map,
# and when a country named here has a city or is not MENA, so the map cannot go stale unseen. On the 2022 figures Libya holds no
# rate, so placing it in Africa changes nothing a list shows.
MENA_WITHOUT_A_CITY: dict[str, str | None] = {"LY": "africa", "PS": None, "SY": None, "YE": None}


def series(path: str, want: str) -> tuple[dict, dict, str]:
    """A World Bank series file: its header, {country: {year: value}} and the indicator it names. Every row names one, and it must
    be `want`: a file of another indicator is refused, so the id the slice records is the file's own, read here."""
    meta, rows = json.loads(Path(path).read_text(encoding="utf-8"))
    ids = {(r.get("indicator") or {}).get("id") for r in rows}
    if ids != {want}:
        refuse(f"{path} names the indicator(s) {sorted(str(i) for i in ids)}, not {want}")
    by: dict[str, dict[str, float]] = {}
    for r in rows:
        if r.get("value") is not None:
            by.setdefault(r["country"]["id"], {})[r["date"]] = r["value"]
    return meta, by, next(iter(ids))


def new_companies() -> None:
    """New limited companies registered in a year per 1,000 people aged 15 to 64, each country of Latin America and of Africa (by
    the country profile in this repo), the UK's beside them for scale. A MENA country is African by where its cities stand in the
    city list, and one with no city there by MENA_WITHOUT_A_CITY. The year is the latest in which both regions show five
    countries over the floor and the UK has a figure: worked out, never typed."""
    meta, density, density_id = series(DENSITY, DENSITY_INDICATOR)
    _, labour, labour_id = series(LABOUR, LABOUR_INDICATOR)
    profile = json.loads(PROFILE.read_text(encoding="utf-8"))["countries"]
    city_continent: dict[str, str] = {}
    for c in json.loads(CITY_LIST.read_text(encoding="utf-8"))["cities"]:
        city_continent.setdefault(str(c["iso2"]).upper(), c["continent"])
    stale = sorted(i for i in MENA_WITHOUT_A_CITY if profile.get(i, {}).get("continent") != "MENA" or i in city_continent)
    if stale:
        refuse(f"MENA_WITHOUT_A_CITY names {', '.join(stale)}; each must be a MENA country with no city in the city list")

    def region_of(iso2: str, p: dict) -> str | None:
        if p.get("world_bank_region") == "Latin America & Caribbean":
            return "latam"
        if p.get("continent") == "Africa":
            return "africa"
        if p.get("continent") == "MENA":
            if iso2 in city_continent:
                return "africa" if city_continent[iso2] == "Africa" else None
            if iso2 not in MENA_WITHOUT_A_CITY:
                refuse(f"{iso2} ({p.get('name')}) is a MENA country with no city in the city list, and MENA_WITHOUT_A_CITY does not place it")
            return MENA_WITHOUT_A_CITY[iso2]
        return None

    members: dict[str, list[str]] = {"latam": [], "africa": []}
    for iso2, p in profile.items():
        r = region_of(iso2, p)
        if r:
            members[r].append(iso2)

    def shown(iso2: str, year: str) -> bool:
        return density.get(iso2, {}).get(year) is not None and (labour.get(iso2, {}).get(year) or 0) >= FLOOR

    years = sorted({y for v in density.values() for y in v}, reverse=True)
    year = next((y for y in years if all(sum(shown(i, y) for i in members[k]) >= SHOWN_AT_LEAST for k in members) and density.get("GB", {}).get(y) is not None), None)
    if year is None:
        refuse("no year in which both regions show five countries over the floor and the UK has a figure")
    regions = []
    named = ", ".join(sorted(i for i, r in MENA_WITHOUT_A_CITY.items() if r == "africa"))
    africa_rule = "the profile's continent is Africa, or MENA with the country's cities in Africa" + (f", or MENA with no city in the list and named as African ({named})" if named else "")
    for key, rule in (("latam", "the profile's world_bank_region is Latin America & Caribbean"), ("africa", africa_rule)):
        regions.append({"key": key, "rule": rule, "members": [
            {"iso2": i, "value": density.get(i, {}).get(year), "labour_force": labour.get(i, {}).get(year), "shown": shown(i, year)}
            for i in sorted(members[key])
        ]})
    obj = {
        "year": int(year),
        "measure": density_id,
        "last_updated": meta.get("lastupdated"),
        "floor": {"measure": labour_id, "year": int(year), "at_least": FLOOR, "why": f"a labour force under {FLOOR:,} is left out of the lists"},
        "uk": {"iso2": "GB", "value": density["GB"][year]},
        "regions": regions,
    }
    write("new_companies.json", obj, sum(len(r["members"]) for r in regions) + 1, [
        source("density", DENSITY, "worldbank", f"New business density ({density_id}): new limited companies registered per 1,000 people aged 15 to 64"),
        source("labour_force", LABOUR, "worldbank", f"Labor force, total ({labour_id}): the list's floor", prints=False),
    ])


```

and replace:

```python
EXPORTS = {
    "city_survival": city_survival,
}
```

with:

```python
EXPORTS = {
    "city_survival": city_survival,
    "new_companies": new_companies,
}
```

- [ ] **Step 4: Run it and the gate**

Run: `python -P scripts/data/home/export_home.py new_companies > scratchpad/home-sections/x03.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x03.txt`
Expected: `new_companies.json: 87 rows, <twelve hex>` (34 + 52 members and the UK), `exit 0`.
Run: `node -e "const d=require('./data/home/new_companies.json');console.log(d.year,d.uk.value.toFixed(1));for(const r of d.regions){const s=r.members.filter(m=>m.shown).sort((a,b)=>b.value-a.value);console.log(r.key,r.members.length,s.length,s.slice(0,5).map(m=>m.iso2+'='+(Math.round(m.value*10)/10).toFixed(1)).join(' '))}" > scratchpad/home-sections/x03b.txt 2>&1`
Expected: `2022 18.6`, `latam 34 11 CL=10.8 CR=5.8 BR=5.1 PE=4.7 PA=4.5`, `africa 52 20 ZA=11.1 BW=8.7 MA=2.6 TN=1.7 ZM=1.6`.
Run: `node node_modules/tsx/dist/cli.mjs tests/home/new_companies.test.ts > scratchpad/home-sections/t03.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t03.txt`
Expected: every line PASS, the sources read again, `home/new_companies: all pass`, `exit 0`.
Run (city_survival's gate still green beside a second slice): `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t03b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t03b.txt` → `exit 0`.

- [ ] **Step 5: Register and regenerate**

In `scripts/prebuild_all.ts`, below `  { name: "home-firms-last", script: "tests/home/firms_last.test.ts" },` add:

```ts
  /* Section 2, where new companies open: Latin America and Africa, one year, each region within itself, the labour-force floor. */
  { name: "home-new-companies", script: "tests/home/new_companies.test.ts" },
```

Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c03.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c03.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,home-new-companies,uk-sources,no-source-agencies,counts-fresh,no-parent-repo-reads,gate-reds-ratchet,single-gate-chain > scratchpad/home-sections/g03.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g03.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add scripts/data/home/export_home.py src/lib/spine/uk_sources.ts tests/home/new_companies.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md data/home/new_companies.json data/home/manifest.json
git commit -m "Section 2's slice: new limited companies per 1,000 of working age, Latin America and Africa, 2022, a labour-force floor; gate home-new-companies (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 4: section 3's slice and gate `home-us-restaurants`

**Files:**
- Modify: `scripts/data/home/export_home.py`
- Modify: `src/lib/spine/uk_sources.ts` (`WORLD_SOURCES` takes the US Bureau of Labor Statistics)
- Create: `tests/home/us_restaurants.test.ts`
- Modify: `scripts/prebuild_all.ts`; generated `scripts/gates.json`, `CLAUDE.md`, `data/home/us_restaurants.json`, `data/home/manifest.json`

- [ ] **Step 1: Write the failing gate**

Create `tests/home/us_restaurants.test.ts`:

```ts
/**
 * WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3; his idea of 2026-10-08, "US biggest winners and
 * losers ranking of top 5 cities bottom 5"). One trade held (full-service restaurants, private establishments), every US metro the
 * site has a city page for, its count in the first and the last year on disk (data/home/us_restaurants.json, from the employment
 * census's parsed files by scripts/data/home/export_home.py).
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's, the metros ranked and the metros held out together; every US city with a page is ranked or
 * held out with its reason (the export's HELD_OUT map; plan decision 12, Detroit today), never both and never neither, and under the
 * city's own name; each metro's code a metro area whose published title names the city, no two cities on one code; each metro's
 * state, typed beside its code in the export's METROS table, one of the states its title names, so a metro of the same name in
 * another state (Columbus in Georgia or in Indiana, for Columbus in Ohio) does not pass for the city's, and, where the titles file
 * is on this machine, each title the file's own, read again; whole counts in both years; the mark a row may carry withholds
 * employment and pay and never the count (every row keeps its count). Every one of these holds for a metro held out as for one
 * ranked, so a held-out metro's counts stay the publisher's. Five or more ranked metros grew and five or more shrank, so both ends
 * of the ranking stand.
 *
 * Run: npx tsx tests/home/us_restaurants.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-us-restaurants";
const FILE = "data/home/us_restaurants.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py us_restaurants, never edit data/home by hand; then draw section 3 from the slice only";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/* A metro's code and its state are typed in the export's METROS table, so that table is where a finding about either is put right. */
const AT_METROS = { remedy: "put the city's own metro code and state beside it in the METROS table of scripts/data/home/export_home.py, then re-run python -P scripts/data/home/export_home.py us_restaurants" };

/* A metro is held out of the ranking, and the reason given, in the export's HELD_OUT map, so that map is where a finding about either is put right. */
const AT_HELD = { remedy: "give the metro its reason in the HELD_OUT map of scripts/data/home/export_home.py (or take it out of the map), then re-run python -P scripts/data/home/export_home.py us_restaurants" };

type Metro = { slug: string; name: string; area: string; state: string; title: string; y_from: number; y_to: number; codes: Array<string | null> };
/** A metro the export holds out of the ranking: its row as any metro's, and the reason, recorded and never printed. */
type HeldOut = Metro & { why: string };
type Export = { trade: { naics: string; title: string }; ownership: string; from: number; to: number; metros: Metro[]; held_out: HeldOut[] };

/** The states a metro's title names, read as the export reads them: the text after the last comma and before " Metro Area",
 *  split on "-" ("Columbus, GA-AL Metro Area" names GA and AL). */
const statesOf = (title: string): string[] => (title.includes(",") ? title.slice(title.lastIndexOf(",") + 1).replace(/ Metro Area$/, "").trim().split("-").filter((s) => s !== "") : []);
/** The titles file's metro areas: its one total row a CBSA (industry "--", enterprise size "01"), keyed as the export keys them
 *  ("C" and the first four digits of the code). The title is the tenth field, quoted when it holds a comma. */
const metroTitles = (path: string): Map<string, string> => {
  const by = new Map<string, string>();
  for (const m of readFileSync(path).toString("latin1").matchAll(/^(\d{4})0,--,01,(?:[^,\n]*,){6}(?:"([^"\n]*)"|([^,\n]*)),/gm)) by.set(`C${m[1]}`, m[2] ?? m[3]);
  return by;
};

const held = holdHomeExport("us_restaurants.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  /* THE RANKED AND THE HELD OUT. A metro the export holds out (its HELD_OUT map gives the reason) keeps its counts in the slice and is
     never ranked. Every per-metro check below runs over both lists, so a held-out metro's counts, code, title and state are the
     publisher's as any ranked metro's are. */
  const out = Array.isArray(d.held_out) ? d.held_out : [];
  const all: Metro[] = [...d.metros, ...out];
  check(`the slice lists the metros it holds out, an empty list if none (${Array.isArray(d.held_out) ? `${out.length} held out` : "no list"})`, Array.isArray(d.held_out));
  check(`the manifest's rows are the slice's: one a metro, ranked or held out (${held.entry.rows} against ${d.metros.length} and ${out.length})`, held.entry.rows === all.length);
  const us = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities.filter((c) => c.iso2.toUpperCase() === "US");
  const ranked = d.metros.map((m) => m.slug), heldOut = out.map((m) => m.slug);
  check(`every US city with a page is ranked or held out, never both (${us.length} pages; ${ranked.length} ranked; held out ${heldOut.join(", ") || "none"})`, JSON.stringify([...ranked, ...heldOut].sort()) === JSON.stringify(us.map((c) => c.slug).sort()) && !ranked.some((s) => heldOut.includes(s)));
  check(`every metro held out carries its reason (${out.map((h) => `${h.slug}: ${h.why}`).join("; ") || "none held out"})`, out.every((h) => typeof h.why === "string" && h.why.trim().length > 0), AT_HELD);
  check("each metro under its city's own name", all.every((m) => us.find((c) => c.slug === m.slug)?.name === m.name));
  check("each code is a metro area whose title names the city, and no two cities share one", all.every((m) => /^C\d{4}$/.test(m.area) && / Metro Area$/.test(m.title) && m.title.toLowerCase().includes(m.name.split(",")[0].trim().toLowerCase())) && new Set(all.map((m) => m.area)).size === all.length);
  const inState = all.filter((m) => statesOf(m.title).includes(m.state)).length;
  check(`each metro's state is one of its title's states, so a metro of the same name in another state is not the city's (${inState} of ${all.length})`, inState === all.length, AT_METROS);
  check(`one trade held, private establishments (${d.trade.naics}, ${d.trade.title}, ${d.ownership})`, d.trade.naics === "722511" && d.ownership === "private");
  check(`whole counts in both years, ${d.from} and ${d.to}`, d.from < d.to && all.every((m) => Number.isInteger(m.y_from) && Number.isInteger(m.y_to) && m.y_from > 0 && m.y_to > 0));
  const marked = all.filter((m) => m.codes.includes("N")).length;
  check(`a row may carry the mark N and every row keeps its whole count (${marked} rows marked)`, all.every((m) => m.codes.length === 2 && m.codes.every((c) => c === null || c === "N") && Number.isInteger(m.y_from) && m.y_from > 0 && Number.isInteger(m.y_to) && m.y_to > 0));
  /* The ranking's two ends are drawn from the metros ranked, so these two counts are theirs alone. */
  const grew = d.metros.filter((m) => m.y_to > m.y_from).length, shrank = d.metros.filter((m) => m.y_to < m.y_from).length;
  check(`five or more ranked metros grew and five or more shrank (${grew} and ${shrank})`, grew >= 5 && shrank >= 5);

  /* THE TITLES, READ AGAIN, where the file is on this machine. A machine without it is deferred by the holder, and its key ends the last line. */
  const titlesFile = held.entry.sources.find((s) => s.key === "metro_titles");
  check("the manifest names the titles file the codes were checked against (metro_titles)", !!titlesFile);
  if (titlesFile && existsSync(titlesFile.path)) {
    const titles = metroTitles(titlesFile.path);
    const wrong = all.filter((m) => titles.get(m.area) !== m.title || !statesOf(titles.get(m.area) ?? "").includes(m.state)).map((m) => m.slug);
    check(`each metro's title is the titles file's for its code, read again here, and names the metro's state${wrong.length ? `: differs on ${wrong.join(", ")}` : ""}`, wrong.length === 0, AT_METROS);
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/us_restaurants", held));
```

Each city's state is typed beside its metro code in the export (Step 3's `METROS`) and carried in the slice: the title a code resolves to must name the city and hold that state, so a metro of the same name in another state (Columbus in Georgia or Indiana for Columbus in Ohio, Charlottesville for Charlotte, Cleveland in Tennessee, Portland in Maine, Augusta-Richmond County for Richmond) is refused by the export and reds in the gate. Where the metro titles file is on the machine the gate also reads it again and holds every row's title to the file's own for its code (the holder defers its key otherwise); its red names the `METROS` table and the remedy. The mark's check says what it sees: a row may carry the mark N, and every row keeps its whole count. A metro the export holds out of the ranking (Step 3's `HELD_OUT`, decision 12: Detroit) sits in the slice's `held_out` with its reason, and the manifest's rows count both lists: the gate holds the ranked and the held out together to the US city pages, never both and never neither, every held-out metro to a non-empty reason, and runs every per-metro check above over both lists, so a held-out metro's counts stay the publisher's; only the two counts of metros that grew and shrank are the ranked's alone.

Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t04.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t04.txt`
Expected: `data/home/us_restaurants.json is exported and in the manifest` red, `exit 1`.

- [ ] **Step 2: The Bureau of Labor Statistics on the sources list**

In `src/lib/spine/uk_sources.ts`, replace:

```ts
      { prints: "New limited companies per 1,000 people of working age, in Latin America and in Africa, on the home page", title: "World Development Indicators: new business density (IC.BUS.NDNS.ZS), and the labour force (SL.TLF.TOTL.IN) that sets the list's floor", url: "https://data.worldbank.org/indicator/IC.BUS.NDNS.ZS" },
    ],
  },
];
```

with:

```ts
      { prints: "New limited companies per 1,000 people of working age, in Latin America and in Africa, on the home page", title: "World Development Indicators: new business density (IC.BUS.NDNS.ZS), and the labour force (SL.TLF.TOTL.IN) that sets the list's floor", url: "https://data.worldbank.org/indicator/IC.BUS.NDNS.ZS" },
    ],
  },
  {
    key: "bls",
    publisher: "US Bureau of Labor Statistics",
    names: ["Bureau of Labor Statistics"],
    attribution: null,
    items: [
      { prints: "Full-service restaurants in the US metro areas the site has city pages for, in two years, on the home page", title: "Quarterly Census of Employment and Wages, annual averages, private establishments, industry 722511", url: "https://www.bls.gov/cew/" },
    ],
  },
];
```

- [ ] **Step 3: Write the export**

In `scripts/data/home/export_home.py`, above `EXPORTS = {`, add:

```python
# ---- section 3: where US restaurants grew and shrank -----------------------------------------------------------------------------

QCEW_DIR = "E:/atlas/us/bls/qcew/parsed"
SUSB = "E:/atlas/us/susb/2021/msa_3digitnaics_2021.txt"
TRADE = ("722511", "Full-service restaurants")
# THE US CITIES WITH A PAGE, each by its metro's code in the employment census ("C" and the first four digits of its CBSA) and the
# state its page stands in (the first state of the metro's title, the principal city's own). Each is checked against the metro's
# published title (SUSB's MSADSCR) before anything is written: the title must name the city and the state must be one of the title's
# states, so a metro of the same name in another state (Columbus GA-AL or Columbus IN beside Columbus OH) is refused, not taken.
METROS: dict[str, tuple[str, str]] = {
    "atlanta": ("C1206", "GA"), "austin": ("C1242", "TX"), "baltimore": ("C1258", "MD"), "boston": ("C1446", "MA"), "buffalo": ("C1538", "NY"),
    "charlotte": ("C1674", "NC"), "chicago": ("C1698", "IL"), "cincinnati": ("C1714", "OH"), "cleveland": ("C1746", "OH"), "columbus": ("C1814", "OH"),
    "dallas": ("C1910", "TX"), "denver": ("C1974", "CO"), "detroit": ("C1982", "MI"), "honolulu": ("C4652", "HI"), "houston": ("C2642", "TX"),
    "indianapolis": ("C2690", "IN"), "kansas-city": ("C2814", "MO"), "las-vegas": ("C2982", "NV"), "los-angeles": ("C3108", "CA"), "louisville": ("C3114", "KY"),
    "memphis": ("C3282", "TN"), "miami": ("C3310", "FL"), "milwaukee": ("C3334", "WI"), "minneapolis": ("C3346", "MN"), "nashville": ("C3498", "TN"),
    "new-orleans": ("C3538", "LA"), "new-york": ("C3562", "NY"), "oklahoma-city": ("C3642", "OK"), "orlando": ("C3674", "FL"), "philadelphia": ("C3798", "PA"),
    "phoenix": ("C3806", "AZ"), "pittsburgh": ("C3830", "PA"), "portland": ("C3890", "OR"), "raleigh": ("C3958", "NC"), "richmond": ("C4006", "VA"),
    "sacramento": ("C4090", "CA"), "salt-lake-city": ("C4162", "UT"), "san-antonio": ("C4170", "TX"), "san-diego": ("C4174", "CA"), "san-francisco": ("C4186", "CA"),
    "san-jose": ("C4194", "CA"), "seattle": ("C4266", "WA"), "st-louis": ("C4118", "MO"), "tampa": ("C4530", "FL"), "washington-dc": ("C4790", "DC"),
}
# THE METROS HELD OUT OF THE RANKING, each with its reason (plan 2026-10-08, home sections, decision 12). A held-out metro keeps its
# counts in the slice, in `held_out` with its reason, and is never ranked: recorded and never printed, as section 1 holds out
# Birmingham. A member is featured only with a reason, and a gain that is the count's own step is not one. Detroit: the Task 4 review
# measured (2026-10-08, from the QCEW files on this machine; the plan's decision 12 carries the figures) that Michigan's count of
# every kind of business steps up in 2022 and 2023, in nearly every sector and far ahead of its jobs, and that the Detroit metro's
# full-service restaurants follow that whole count, so its gain rides on the step. Each key must be one of the US cities with a
# page; the export refuses otherwise.
HELD_OUT: dict[str, str] = {
    "detroit": "Michigan's count of every kind of business jumps in 2022 and 2023, far ahead of its jobs",
}


def title_states(title: str) -> list[str]:
    """The states a metro's published title names: the text after its last comma and before " Metro Area", split on "-"
    ("Columbus, GA-AL Metro Area" names GA and AL). A title with no comma names none."""
    if "," not in title:
        return []
    return [s for s in title.rsplit(",", 1)[1].strip().removesuffix(" Metro Area").split("-") if s]


def us_restaurants() -> None:
    """Full-service restaurants with staff (private establishments, NAICS 722511) in each US metro the site has a city page for, in
    the first and the last year the parsed files hold. A row the publisher marks "N" withholds employment and wages, never its
    count of establishments, so the count is kept and the mark recorded. Each city's metro is its code and its state, both typed in
    METROS; the title the code resolves to must name the city and hold the state, so a code that lands on a metro of the same name
    in another state is refused. A metro named in HELD_OUT moves out of `metros` into `held_out`, with every field its row carries
    and its reason, so its counts stay in the slice and it is never ranked; the manifest's rows count both lists, and a HELD_OUT key
    that is not one of the cities is refused."""
    import pyarrow.parquet as pq

    us = cities_of("US")
    if [c["slug"] for c in us] != sorted(METROS):
        refuse(f"the city list's US cities are not the metros this export reads ({len(us)} against {len(METROS)})")
    unknown = sorted(set(HELD_OUT) - {c["slug"] for c in us})
    if unknown:
        refuse(f"HELD_OUT names {', '.join(repr(k) for k in unknown)}, not among the {len(us)} US cities with a page: correct the key in HELD_OUT in scripts/data/home/export_home.py, or take it out")
    titles: dict[str, str] = {}
    with Path(SUSB).open(encoding="latin-1", newline="") as f:
        for row in csv.reader(f):
            # One row a CBSA (its total, all sizes); a CBSA's code ends in 0, so "C" and its first four digits name it alone.
            if len(row) > 9 and row[1] == "--" and row[2] == "01" and row[0].endswith("0"):
                key = "C" + row[0][:4]
                if key in titles and titles[key] != row[9]:
                    refuse(f"{key} names two metros in the titles file")
                titles[key] = row[9]
    years = sorted(int(p.stem.rsplit("_", 1)[1]) for p in Path(QCEW_DIR).glob("qcew_cells_*.parquet"))
    if len(years) < 2:
        refuse(f"{QCEW_DIR} holds fewer than two years")
    first, last = years[0], years[-1]
    wanted = {code for code, _ in METROS.values()}
    counts: dict[int, dict[str, tuple[int, str | None]]] = {}
    for y in (first, last):
        pf = pq.ParquetFile(f"{QCEW_DIR}/qcew_cells_{y}.parquet")
        got: dict[str, tuple[int, str | None]] = {}
        for g in range(pf.metadata.num_row_groups):
            t = pf.read_row_group(g, columns=["area_fips", "naics", "own_code", "estabs", "disclosure_code"]).to_pydict()
            for a, n, o, e, dc in zip(t["area_fips"], t["naics"], t["own_code"], t["estabs"], t["disclosure_code"]):
                if n == TRADE[0] and o == "5" and a in wanted:
                    if a in got:
                        refuse(f"{a} holds two rows of {TRADE[0]} in {y}")
                    got[a] = (e, dc)
        counts[y] = got
    metros = []
    for c in us:
        a, state = METROS[c["slug"]]
        t = titles.get(a)
        city = c["name"].split(",")[0].strip()
        if not t or not t.endswith("Metro Area") or city.lower() not in t.lower():
            refuse(f"{a} is {t!r}, not a metro area named for {c['name']}")
        states = title_states(t)
        if state not in states:
            refuse(f"{c['name']} ({a}) is {t!r}, which names {'-'.join(states) or 'no state'}, not {state}: put the city's own metro code and state beside it in METROS")
        f0, f1 = counts[first].get(a), counts[last].get(a)
        if not f0 or not f1 or not f0[0] or not f1[0]:
            refuse(f"{a} ({c['name']}) holds no count in {first} or {last}")
        metros.append({"slug": c["slug"], "name": c["name"], "area": a, "state": state, "title": t, "y_from": int(f0[0]), "y_to": int(f1[0]), "codes": [f0[1], f1[1]]})
    if len({m["area"] for m in metros}) != len(metros):
        refuse("two cities share one metro")
    # A metro held out leaves the ranking with every field its row carries, and its reason beside them; the rows count both lists.
    ranked = [m for m in metros if m["slug"] not in HELD_OUT]
    held_out = [{**m, "why": HELD_OUT[m["slug"]]} for m in metros if m["slug"] in HELD_OUT]
    obj = {"trade": {"naics": TRADE[0], "title": TRADE[1]}, "ownership": "private", "from": first, "to": last, "metros": ranked, "held_out": held_out}
    write("us_restaurants.json", obj, len(ranked) + len(held_out), [
        source("qcew_from", f"{QCEW_DIR}/qcew_cells_{first}.parquet", "bls", f"Quarterly Census of Employment and Wages, {first} annual averages, private establishments, parsed"),
        source("qcew_to", f"{QCEW_DIR}/qcew_cells_{last}.parquet", "bls", f"Quarterly Census of Employment and Wages, {last} annual averages, private establishments, parsed"),
        source("metro_titles", SUSB, None, "Statistics of US Businesses 2021, metro areas: each code's published name, read to check the codes", prints=False),
    ])


```

and add `    "us_restaurants": us_restaurants,` as the last entry of `EXPORTS`.

- [ ] **Step 4: Run it and the gate**

Run: `python -P scripts/data/home/export_home.py us_restaurants > scratchpad/home-sections/x04.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x04.txt`
Expected: `us_restaurants.json: 45 rows, <twelve hex>`, `exit 0` (it reads the two parquet files a row group at a time; a minute or two).
Run: `node -e "const d=require('./data/home/us_restaurants.json');const c=m=>m.y_to-m.y_from;const g=d.metros.filter(m=>c(m)>0).sort((a,b)=>c(b)-c(a)),s=d.metros.filter(m=>c(m)<0).sort((a,b)=>c(a)-c(b));console.log(d.from,d.to,g.length,s.length);console.log(g.slice(0,5).map(m=>m.slug+':'+m.y_from+'>'+m.y_to).join(' '));console.log(s.slice(0,5).map(m=>m.slug+':'+m.y_from+'>'+m.y_to).join(' '))" > scratchpad/home-sections/x04b.txt 2>&1`
Expected: `2019 2023 34 10`; `atlanta:4451>5179 houston:4512>5027 dallas:5234>5712 miami:5584>6050 phoenix:2435>2828`; `san-francisco:5189>4919 los-angeles:11146>10975 pittsburgh:1776>1714 buffalo:939>886 st-louis:2030>1989` (`metros` holds the 44 ranked; Detroit, 2950>3413, sits in `held_out`: decision 12).
Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t04.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t04.txt`
Expected: `home/us_restaurants: all pass` (the three sources hashed again), `exit 0`.

- [ ] **Step 5: Register and regenerate**

In `scripts/prebuild_all.ts`, below `  { name: "home-new-companies", script: "tests/home/new_companies.test.ts" },` add:

```ts
  /* Section 3, where US restaurants grew and shrank: one trade, 45 read, 44 ranked (Detroit held out, plan decision 12), two years,
     two counts a row. */
  { name: "home-us-restaurants", script: "tests/home/us_restaurants.test.ts" },
```

Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c04.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c04.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,home-new-companies,home-us-restaurants,uk-sources,no-source-agencies,counts-fresh,no-parent-repo-reads,gate-reds-ratchet > scratchpad/home-sections/g04.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g04.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add scripts/data/home/export_home.py src/lib/spine/uk_sources.ts tests/home/us_restaurants.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md data/home/us_restaurants.json data/home/manifest.json
git commit -m "Section 3's slice: full-service restaurants in the 45 US metros with a city page, 2019 and 2023, every code checked against its title, the N rows kept; gate home-us-restaurants (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 5: section 4's slice and gate `home-how-made`

**Files:**
- Modify: `scripts/data/home/export_home.py`
- Create: `tests/home/how_made.test.ts`
- Modify: `scripts/prebuild_all.ts`; generated `scripts/gates.json`, `CLAUDE.md`, `data/home/method.json`, `data/home/manifest.json`

- [ ] **Step 1: Write the failing gate**

Create `tests/home/how_made.test.ts`:

```ts
/**
 * HOW FIGURES ARE MADE (plan 2026-10-08, home sections, section 4; his ideas of 2026-10-08, "the deep techniques used to derive
 * data", "unmatched archival capability" and "the global coverage", merged as the audit found them honest). Each technique shown
 * by a figure it produced, in two rows: the names matched and the London trade pages. No row counts countries and the home prints
 * no estimates line, so the global coverage is not built (his ruling of 2026-10-07: the home's 195 counter is wrong). The notices
 * and names counts come from data/home/method.json (the registers' failures table, by scripts/data/home/export_home.py); the
 * trade pages are counted from this repo's files.
 *
 * Holds the slice: it is its source's (scripts/lib/home_export.ts), a source this machine lacks ends the last line as deferred; the
 * manifest's row count is its content's (one); its counts nest (names matched within names, names within notices, the unmatched
 * notices within the notices); its source line is the register slice's own (data/uk/registers/failures.json), so the two name one
 * year of notices; and, where the failures table is on this machine, its four counts and its source line are the table's own, read
 * again.
 *
 * Run: npx tsx tests/home/how_made.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { holdHomeExport, homePassLine } from "../../scripts/lib/home_export";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-how-made";
const FILE = "data/home/method.json";
const REMEDY = "re-run python -P scripts/data/home/export_home.py method, never edit data/home by hand; then draw section 4 from the slice and the repo's own counts";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/** A source table read as JSON. One that is cut off or damaged is a red of its own, with its path and the remedy, and null: the
 *  checks that need the table are skipped, so the gate ends on its summary and never on a SyntaxError stack. */
function readTable<T>(name: string, path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    check(`the ${name} table reads as JSON`, false, { file: path, remedy: "restore the source file, then re-run the export" });
    return null;
  }
}

type Export = { notices: number; names: number; matched_names: number; unmatched_notices: number; source: string };

const held = holdHomeExport("method.json", check);
const d = (held?.data ?? null) as Export | null;
if (held && d) {
  check(`the manifest's rows are the slice's: one (${held.entry.rows})`, held.entry.rows === 1);
  check(`the counts nest: ${d.matched_names} names matched of ${d.names} names in ${d.notices} notices, ${d.unmatched_notices} notices unmatched`, [d.notices, d.names, d.matched_names, d.unmatched_notices].every((n) => Number.isInteger(n) && n >= 0) && d.notices > 0 && d.matched_names <= d.names && d.names <= d.notices && d.unmatched_notices <= d.notices);
  const failures = JSON.parse(readFileSync("data/uk/registers/failures.json", "utf8")) as { source: string };
  check("the notices are the year the failure rates were read from (the register slice's own source line)", d.source === failures.source, { file: "data/uk/registers/failures.json", remedy: "re-run registers/uk/export_for_site.py, then python -P scripts/data/home/export_home.py method, so both read one table" });

  /* THE TABLE, READ AGAIN, where it is on this machine. A machine without it is deferred by the holder, and its key ends the last line. */
  const src = held.entry.sources.find((s) => s.key === "failures");
  check("the manifest names the failures table the counts were read from (failures)", !!src);
  if (src && existsSync(src.path)) {
    const table = readTable<{ match?: Record<string, unknown>; source?: unknown }>("failures", src.path);
    if (table) {
      const differs = [...(["notices", "names", "matched_names", "unmatched_notices"] as const).filter((k) => table.match?.[k] !== d[k]), ...(table.source !== d.source ? ["source"] : [])];
      check(`the four counts and the source line are the table's own, read again here${differs.length ? `: differs on ${differs.join(", ")}` : ""}`, differs.length === 0);
    }
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(homePassLine("home/how_made", held));
```

The gate follows the holder's contract (Task 2, fixed after its review): `check` takes an optional third argument `{ file, remedy }`, which the holder passes for its own findings (the manifest, a stray or a missing slice, the sources page, CRLF line ends); the rows check reads the manifest's `rows` against the slice; and the last line comes from `homePassLine`, which ends `home/how_made: all pass, 1 deferred (failures: source not on this machine)` where the failures table is not on the machine (a build server), the form the chain's runner counts as a deferred check. Nothing prints after it. Where the failures table is on the machine, the gate reads its `match` block and `source` line again and holds the slice's four counts and its source line to them (so a slice signed again with a count changed reds, naming the count); where it is not, the holder defers the key. The tie to the register slice's own source line passes its own file (`data/uk/registers/failures.json`) and remedy: re-run the register export first, then this one, so both read one table. The notices are company notices, not all insolvencies (members' voluntary liquidations are solvent), and the words say so. A failures table that is cut off or damaged is a red of its own (`the failures table reads as JSON`, naming the file and the remedy: restore the source file, then re-run the export), never a SyntaxError stack, and the check that needs it is skipped.

Run: `node node_modules/tsx/dist/cli.mjs tests/home/how_made.test.ts > scratchpad/home-sections/t05.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t05.txt`
Expected: `data/home/method.json is exported and in the manifest` red, `exit 1`.

- [ ] **Step 2: Write the export**

In `scripts/data/home/export_home.py`, above `EXPORTS = {`, add:

```python
# ---- section 4: how figures are made ---------------------------------------------------------------------------------------------

FAILURES = "E:/atlas/registers/uk/tables/company_failures_by_trade.json"


def method() -> None:
    """The year of company notices the failure rates were read from: how many notices, how many different company names, how many
    of those the register matched by name, how many notices matched nothing (the registers' failures table, its `match`). They
    are company notices, not all insolvencies: a members' voluntary liquidation, a solvent company closed by its owners, is one."""
    t = json.loads(Path(FAILURES).read_text(encoding="utf-8"))
    m = t.get("match") or {}
    keys = ("notices", "names", "matched_names", "unmatched_notices")
    if not all(isinstance(m.get(k), int) and m[k] >= 0 for k in keys):
        refuse("the failures table holds no whole match counts; rebuild it with registers/uk/build_gazette.py")
    if not (m["matched_names"] <= m["names"] <= m["notices"]) or m["unmatched_notices"] > m["notices"]:
        refuse("the failures table's match counts do not nest")
    obj = {**{k: m[k] for k in keys}, "source": t["source"]}
    write("method.json", obj, 1, [
        source("failures", FAILURES, "gazette", "The registers' failures table: a year of company notices, matched by name to the company register"),
    ])


```

and add `    "method": method,` as the last entry of `EXPORTS`.

- [ ] **Step 3: Run it and the gate**

Run: `python -P scripts/data/home/export_home.py method > scratchpad/home-sections/x05.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x05.txt`
Expected: `method.json: 1 rows, <twelve hex>`, `exit 0`.
Run: `node -e "const d=require('./data/home/method.json');console.log(d.notices,d.names,d.matched_names,d.unmatched_notices)" > scratchpad/home-sections/x05b.txt 2>&1`
Expected: `31926 31376 30510 1137`.
Run: `node node_modules/tsx/dist/cli.mjs tests/home/how_made.test.ts > scratchpad/home-sections/t05.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t05.txt`
Expected: `home/how_made: all pass` (the failures table is on this machine, so nothing is deferred), `exit 0`.

- [ ] **Step 4: Register and regenerate**

In `scripts/prebuild_all.ts`, below `  { name: "home-us-restaurants", script: "tests/home/us_restaurants.test.ts" },` add:

```ts
  /* Section 4, how figures are made: a technique a figure, the notices and their match rate, the London trade pages read from the
     band counts. */
  { name: "home-how-made", script: "tests/home/how_made.test.ts" },
```

Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c05.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c05.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,home-new-companies,home-us-restaurants,home-how-made,uk-registers,counts-fresh,no-parent-repo-reads,gate-reds-ratchet > scratchpad/home-sections/g05.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g05.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/data/home/export_home.py tests/home/how_made.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md data/home/method.json data/home/manifest.json
git commit -m "Section 4's slice: the year of insolvency notices behind the failure rates, read and matched by name; gate home-how-made (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 6: About the figures names the home's sources

**Files:**
- Modify: `src/lib/spine/uk_sources.ts` (the statistics office's and the notices' items, the World Bank's `prints`)
- Modify: `src/app/(site)/about-data/page.tsx`
- Modify: `tests/spine/uk_sources.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/spine/uk_sources.test.ts`, replace (a finding may carry its own remedy; the file's `REMEDY` is the default):

```ts
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};
```

with:

```ts
const check = (label: string, ok: boolean, remedy: string = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy });
};
```

replace:

```ts
import { UK_SOURCES, UK_REGISTER_SOURCE, UK_SOURCES_FOOT, OGL_LINE, ONS_LINE } from "../../src/lib/spine/uk_sources";
```

with:

```ts
import { UK_SOURCES, UK_REGISTER_SOURCE, UK_SOURCES_FOOT, OGL_LINE, ONS_LINE, WORLD_SOURCES } from "../../src/lib/spine/uk_sources";
```

below:

```ts
check("one entry a publisher", new Set(UK_SOURCES.map((s) => s.publisher)).size === UK_SOURCES.length);
```

add:

```ts
/* THE HOME'S SOURCES OUTSIDE THE UK (plan 2026-10-08, home sections 2 and 3): each says what the home prints from it, links
   securely or not at all, prints no attribution its record does not name, and no key is two entries across the two lists. */
check(`the world list names the home's two sources (${WORLD_SOURCES.map((s) => s.key).join(", ")})`, WORLD_SOURCES.length === 2 && WORLD_SOURCES.every((s) => s.items.length > 0 && s.items.every((i) => i.prints.trim() && i.title.trim() && (i.url === null || /^https:\/\//.test(i.url)))));
check("no world source prints an attribution line its record does not name", WORLD_SOURCES.every((s) => s.attribution === null));
check("one key an entry across both lists", new Set([...UK_SOURCES, ...WORLD_SOURCES].map((s) => s.key)).size === UK_SOURCES.length + WORLD_SOURCES.length);
check("the statistics office's entry says the home prints its cities' survival, and the notices' entry the notices read", UK_SOURCES.some((s) => s.key === "ons" && s.items.some((i) => /by city/.test(i.prints))) && UK_SOURCES.some((s) => s.key === "gazette" && s.items.some((i) => /notices/.test(i.prints))));

/* THE NEW COMPANIES' FLOOR, IN WORDS (the review of the new companies' slice): the list leaves out countries with a labour force
   under the slice's floor (data/home/new_companies.json, floor.at_least), and a reader must be able to find that here, so the
   entry says it in words and the words are held to the slice's own figure. */
const floor = (JSON.parse(readFileSync("data/home/new_companies.json", "utf8")) as { floor: { at_least: number } }).floor.at_least;
const newCompanies = WORLD_SOURCES.flatMap((s) => s.items).find((i) => i.title.includes("IC.BUS.NDNS.ZS"));
check(`the new companies' entry says the slice's floor in words (${floor})`, floor === 1000000 && newCompanies !== undefined && newCompanies.prints.includes("under one million"), "say the slice's floor (data/home/new_companies.json floor.at_least) in the new companies entry's words in uk_sources.ts, and change this pin with it");
```

and below:

```ts
  check("the section prints the statistics office's own attribution line", about.includes(ONS_LINE));
```

add:

```ts
  const absentWorld = WORLD_SOURCES.filter((s) => !about.includes(s.publisher.replace(/'/g, "&#x27;")));
  check(`the section names the home's sources outside the UK${absentWorld.length ? `: missing ${absentWorld.map((s) => s.publisher).join(", ")}` : ""}`, absentWorld.length === 0);
```

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_sources.test.ts > scratchpad/home-sections/t06.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t06.txt`
Expected: 3 red lines (the ONS and Gazette items; the new companies' floor in words; the world sources on the page), `exit 1`. The floor check
carries its own remedy: it says the slice's floor in the new companies entry's words in `uk_sources.ts`, and the pin changes with it.

- [ ] **Step 2: The entries say what the home prints**

In `src/lib/spine/uk_sources.ts`, replace `prints: "How many businesses last one, three and five years, by trade group and by region"` with
`prints: "How many businesses last one, three and five years, by trade group and by region, and after five years by city"` (the home
prints only the five-year share by city), and replace
`prints: "How many companies of a trade became insolvent in a year, the UK's"` with
`prints: "How many companies of a trade became insolvent in a year, the UK's, and how many notices, insolvent and solvent, were read for it"`,
and, in the same item, `title: "Company insolvency notices, October 2025 to September 2026, matched to the Companies House register of 1 May 2026"` with
`title: "Notices of liquidations and administrations, October 2025 to September 2026, matched to the Companies House register of 1 May 2026"`
(the notices are winding-up orders, creditors' and members' voluntary liquidations, and administrations; members' voluntary liquidations
are solvent). In the World Bank entry, replace
`prints: "New limited companies per 1,000 people of working age, in Latin America and in Africa, on the home page"` with
`prints: "New limited companies per 1,000 people of working age, in Latin America and the Caribbean and in Africa, on the home page, leaving out countries with a labour force under one million"`
(the region's own name, as the list draws it; and the floor in words, which the floor check reads and holds to the slice's figure).

- [ ] **Step 3: Print the world list**

In `src/app/(site)/about-data/page.tsx`, replace:

```tsx
import { UK_SOURCES } from "@/lib/spine/uk_sources";
```

with:

```tsx
import { UK_SOURCES, WORLD_SOURCES, type UkSource } from "@/lib/spine/uk_sources";
```

replace:

```tsx
        <ul className="mt-5 space-y-5">
          {UK_SOURCES.map((s) => (
            <li key={s.key}>
              <p className="font-semibold text-ink-900">{s.publisher}</p>
              <ul className="mt-1 space-y-1 text-sm leading-relaxed text-ink-800">
                {s.items.map((i) => (
                  <li key={i.title}>
                    {i.prints}:{" "}
                    {i.url ? <a href={i.url} className="underline underline-offset-2">{i.title}</a> : i.title}.
                  </li>
                ))}
              </ul>
              {s.attribution ? <p className="mt-1 text-sm text-ink-700">{s.attribution}</p> : null}
            </li>
          ))}
        </ul>
```

with:

```tsx
        <SourceList sources={UK_SOURCES} />
        {/* THE HOME PAGE'S SOURCES OUTSIDE THE UNITED KINGDOM (plan 2026-10-08, home sections 2 and 3), named the way the UK's are. */}
        <p className="mt-6 text-ink-800">
          The home page also prints figures from outside the United Kingdom, from these sources.
        </p>
        <SourceList sources={WORLD_SOURCES} />
```

and at the end of the file add:

```tsx

/** One list of sources: the publisher, what the pages print from it with each dataset or page read, and the attribution line where
 *  its licence asks for one. The UK's list and the home's sources outside the UK draw the same way. */
function SourceList({ sources }: { sources: readonly UkSource[] }) {
  return (
    <ul className="mt-5 space-y-5">
      {sources.map((s) => (
        <li key={s.key}>
          <p className="font-semibold text-ink-900">{s.publisher}</p>
          <ul className="mt-1 space-y-1 text-sm leading-relaxed text-ink-800">
            {s.items.map((i) => (
              <li key={i.title}>
                {i.prints}:{" "}
                {i.url ? <a href={i.url} className="underline underline-offset-2">{i.title}</a> : i.title}.
              </li>
            ))}
          </ul>
          {s.attribution ? <p className="mt-1 text-sm text-ink-700">{s.attribution}</p> : null}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/spine/uk_sources.test.ts > scratchpad/home-sections/t06.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t06.txt`
Expected: `spine/uk_sources: all pass` (or the file's own pass line), `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c06.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c06.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=uk-sources,no-source-agencies,no-em-dashes,layering,home-new-companies,home-us-restaurants,counts-fresh > scratchpad/home-sections/g06.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g06.txt`
Expected: `Passed: 7`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/spine/uk_sources.ts "src/app/(site)/about-data/page.tsx" tests/spine/uk_sources.test.ts scripts/gates.json
git commit -m "About the figures names the home's sources outside the UK; the statistics office's and the notices' entries say what the home prints (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 7: Focal's accent, and a provenance stamp on TiersTable's and DetailPanel's figures

Three optional props, inert where they are not passed; the identity check proves it byte for byte.

**Files:**
- Modify: `src/components/spine/country/focal.tsx`
- Modify: `src/components/spine/archetypes/TiersTable.tsx:45`, `:49`, `:301`, `:304`
- Modify: `src/components/spine/archetypes/DetailPanel.tsx:2`, `:52`, the `<dd>` holding `<Fig>{r.value}</Fig>`
- Create (never committed): `scratchpad/home-sections/identity7.ts`

- [ ] **Step 1: Record the markup before**

Create `scratchpad/home-sections/identity7.ts`:

```ts
/* THE THREE PROPS CHANGE NOTHING WHERE THEY ARE NOT PASSED (plan 2026-10-08, home sections, Task 7): Focal, TiersTable's figures
   shape and DetailPanel rendered before and after, byte for byte; after, the new props each draw. Scratch, never committed. Run from
   the website root: node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity7.ts before|after */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { Focal } from "../../src/components/spine/country/focal";
import { TiersTable } from "../../src/components/spine/archetypes/TiersTable";
import { DetailPanel } from "../../src/components/spine/archetypes/DetailPanel";

const html = [
  renderToStaticMarkup(React.createElement(Focal, { figure: "41.8", words: "Words under the figure", prov: { src: "x.json:a", kind: "counted" } })),
  renderToStaticMarkup(React.createElement(TiersTable, { heads: { name: "Role", a: "Staff", b: "Pay a year" }, figures: [{ key: "a", name: "Chef", a: "3", b: "$44K" }, { key: "b", name: "Server", a: null, b: "$31K" }] })),
  renderToStaticMarkup(React.createElement(DetailPanel, { name: "d", summary: "2 more", rows: [{ label: "One", value: "1.0" }, { label: "Two", value: "2.0", note: "A note" }] })),
].join("\n");
const phase = process.argv[2];
writeFileSync(`scratchpad/home-sections/identity7-${phase}.html`, html);
if (phase === "after") {
  const same = readFileSync("scratchpad/home-sections/identity7-before.html", "utf8") === html;
  console.log(same ? "IDENTICAL: the three render as they did" : "DIFFERENT: a prop not passed changed the markup");
  const accent = renderToStaticMarkup(React.createElement(Focal, { figure: "7", words: "w", accent: true }));
  const stamped = renderToStaticMarkup(React.createElement(TiersTable, { heads: { a: "2019", b: "2023" }, figures: [{ key: "x", name: "X", a: "1", b: "2", aProv: { src: "x.json:a", kind: "counted" }, bProv: { src: "x.json:b", kind: "counted" } }] }));
  const rest = renderToStaticMarkup(React.createElement(DetailPanel, { name: "e", summary: "s", rows: [{ label: "A", value: "1", prov: { src: "x.json:c", kind: "looked up" } }, { label: "B", value: "2", prov: { src: "x.json:d", kind: "looked up" } }] }));
  console.log(/ text-\[var\(--terra-text\)\]/.test(accent) ? "ACCENT: drawn" : "ACCENT: missing");
  console.log((stamped.match(/data-src="x\.json:[ab]"/g) ?? []).length === 2 ? "TIERS: both figures stamped" : "TIERS: unstamped");
  console.log((rest.match(/data-src="x\.json:[cd]"/g) ?? []).length === 2 ? "DETAIL: both rows stamped" : "DETAIL: unstamped");
  process.exit(same ? 0 : 1);
}
console.log(`written scratchpad/home-sections/identity7-${phase}.html`);
```

Run: `node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity7.ts before > scratchpad/home-sections/x07a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x07a.txt`
Expected: `written scratchpad/home-sections/identity7-before.html`, `exit 0`.

- [ ] **Step 2: Focal's accent**

Replace the whole of `src/components/spine/country/focal.tsx` with:

```tsx
/**
 * THE CARD'S ONE FIGURE, at the focal rung, with the words that say what it is (PART 4: one figure at 30 a section card). Moved out
 * of country-view.tsx (masterplan step 23) so a card in its own file draws the same focal; a figure with a source stamps it
 * (src/lib/spine/provenance.ts). `accent` (plan 2026-10-08, home sections): the figure in `--terra-text`, for a card its page
 * declares a loud moment (the home's LOUD_SEATS, sections 1 and 3); ink otherwise, as every focal drew before.
 */
import * as React from "react";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";

export function Focal({ figure, words, placement, prov, accent = false }: { figure: string; words: string; placement?: string | null; prov?: Provenance | null; accent?: boolean }) {
  return (
    <div className="mb-4">
      <div data-focal="1" className={`fig text-[length:var(--t-focal)] leading-none ${accent ? "text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`} {...provAttrs(prov)}>{figure}</div>
      <p data-focal-words="" className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{words}</p>
      {/* The site's one placement sentence (placement.ts), under the figure's words, where the section's figure stands on a scale
          of the countries (PART 6, "Higher than {n} countries in ten."). */}
      {placement ? <p data-placement="" className="mt-1 text-[length:var(--t-micro)] leading-4 text-[var(--c-ink2)]">{placement}</p> : null}
    </div>
  );
}
```

- [ ] **Step 3: TiersTable's figures stamped**

In `src/components/spine/archetypes/TiersTable.tsx`, below `import { COPY } from "./copy";` add
`import type { Provenance } from "@/lib/spine/provenance";`, replace (the type already has a doc comment of its own; the new text joins it, one
comment and never a second stacked under the first):

```ts
/** A row of the figures shape: the name block's two lines and the two figures as printed (null prints an en dash). */
export type TiersFigureRow = { key: string; name: string; sub?: string | null; a: string | null; b: string | null };
```

with:

```ts
/** A row of the figures shape: the name block's two lines and the two figures as printed (null prints an en dash). `aProv`, `bProv`
 *  (plan 2026-10-08, home sections): where each figure came from, stamped on it (the provenance ratchet); a row that passes none
 *  stamps nothing, as before. */
export type TiersFigureRow = { key: string; name: string; sub?: string | null; a: string | null; b: string | null; aProv?: Provenance | null; bProv?: Provenance | null };
```

replace `{r.a != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.a}</Fig> : DASH}` with
`{r.a != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]" prov={r.aProv}>{r.a}</Fig> : DASH}`, and
`{r.b != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{r.b}</Fig> : DASH}` with
`{r.b != null ? <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]" prov={r.bProv}>{r.b}</Fig> : DASH}`.

- [ ] **Step 4: DetailPanel's rows stamped**

In `src/components/spine/archetypes/DetailPanel.tsx`, below `import { Fig, InlineDisclosure } from "@/components/spine/kit";` add
`import type { Provenance } from "@/lib/spine/provenance";`, replace (the file's long header comment is the type's doc comment; the new text joins its
end, one comment and never a second stacked under it):

```ts
 *    way to reach a touch target and needs no more than that.)
 */
export type DetailRow = { label: string; value: string; note?: string };
```

with:

```ts
 *    way to reach a touch target and needs no more than that.)
 *
 * `prov` (plan 2026-10-08, home sections): where the row's figure came from, stamped on it; a row with none stamps nothing.
 */
export type DetailRow = { label: string; value: string; note?: string; prov?: Provenance | null };
```

and replace `<dd className="text-[length:var(--t-micro)] text-[var(--c-ink)]"><Fig>{r.value}</Fig></dd>` with
`<dd className="text-[length:var(--t-micro)] text-[var(--c-ink)]"><Fig prov={r.prov}>{r.value}</Fig></dd>`.

- [ ] **Step 5: Run the identity check and the gates**

Run: `node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity7.ts after > scratchpad/home-sections/x07b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x07b.txt`
Expected: `IDENTICAL: the three render as they did`, `ACCENT: drawn`, `TIERS: both figures stamped`, `DETAIL: both rows stamped`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=archetype-coverage,census-fresh,type-ladder,width-discipline,no-terra-hover,layering > scratchpad/home-sections/g07.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g07.txt`
Expected: `Passed: 6`, `Failed: 0`.

- [ ] **Step 6: Commit**

```bash
git add src/components/spine/country/focal.tsx src/components/spine/archetypes/TiersTable.tsx src/components/spine/archetypes/DetailPanel.tsx
git commit -m "Focal takes an accent; TiersTable's figure rows and DetailPanel's rows take a provenance stamp; each byte-identical where not passed (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 8: MarkList's grouped form

Section 2 is one measure over two regions never ranked together: two short ranked lists under one headline in one card. No form
holds that: MarkList draws one set, CompareTable and RankedBars one set each (and their own card), and two MarkLists would be two
cards, two titles and two 30s. So MarkList gains `groups`, its own body, leaving the one-set body untouched.

**Files:**
- Modify: `src/components/spine/archetypes/MarkList.tsx:125` (import), above `:155` (a type), `:161` (the props type, now a part both
  forms take and two forms), `:234` (the early return), and the file's end (the grouped body)
- Create (never committed): `scratchpad/home-sections/identity8.ts`

- [ ] **Step 1: Record the one-set markup before**

Create `scratchpad/home-sections/identity8.ts`:

```ts
/* MARKLIST'S ONE-SET FORM IS UNCHANGED BY THE GROUPED FORM (plan 2026-10-08, home sections, Task 8): three one-set cards before and
   after, byte for byte; after, a grouped card's markers. Scratch, never committed. Run from the website root:
   node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity8.ts before|after */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { MarkList } from "../../src/components/spine/archetypes/MarkList";

const rows = [1, 2, 3, 4, 5].map((n) => ({ key: `r${n}`, name: `Row ${n}`, value: n * 1.5, mark: React.createElement("img", { alt: "", src: "x.svg" }), href: `/x${n}`, lands: "government-take" as const, prov: { src: `x.json:${n}`, kind: "counted" as const } }));
const plain = rows.map((r) => ({ key: r.key, name: r.name, value: r.value, prov: r.prov }));
const base = { kicker: "Kicker", icon: "ranking" as const, headline: { label: "The middle", value: 3, prov: { src: "x.json:m", kind: "counted" as const } }, basis: "A line.", head: { name: "Name", value: "Value" }, fmt: (v: number) => v.toFixed(1) };
const html = [
  renderToStaticMarkup(React.createElement(MarkList, { id: "a", ...base, rows })),
  renderToStaticMarkup(React.createElement(MarkList, { id: "b", ...base, rows: plain, oneColumn: true, withheld: 1, withheldLine: "One left out." })),
  renderToStaticMarkup(React.createElement(MarkList, { id: "c", ...base, rows: plain.slice(0, 4) })),
].join("\n");
const phase = process.argv[2];
writeFileSync(`scratchpad/home-sections/identity8-${phase}.html`, html);
if (phase === "after") {
  const same = readFileSync("scratchpad/home-sections/identity8-before.html", "utf8") === html;
  console.log(same ? "IDENTICAL: the one-set form renders as it did" : "DIFFERENT: the one-set form changed");
  const grouped = renderToStaticMarkup(React.createElement(MarkList, { id: "g", ...base, rows: [], groups: [
    { key: "one", name: "First", rows, rest: { summary: "2 more in First", rows: [{ label: "Six", value: "0.9", prov: { src: "x.json:6", kind: "counted" } }, { label: "Seven", value: "0.8", prov: { src: "x.json:7", kind: "counted" } }] } },
    { key: "two", name: "Second", rows: rows.map((r) => ({ ...r, key: `${r.key}b` })), rest: null },
  ] }));
  console.log(/data-form="groups"/.test(grouped) && /data-group="one"/.test(grouped) && grouped.indexOf('data-group="two"') > grouped.indexOf('data-group="one"') ? "GROUPS: two, in order" : "GROUPS: missing");
  console.log((grouped.match(/<a [^>]*data-row=/g) ?? []).length === 10 && (grouped.match(/data-lands="government-take"/g) ?? []).length === 10 ? "ROWS: ten doors" : "ROWS: wrong");
  console.log((grouped.match(/<details/g) ?? []).length === 1 && (grouped.match(/data-src="x\.json:[67]"/g) ?? []).length === 2 ? "PLUS: one, its rows stamped" : "PLUS: wrong");
  console.log(renderToStaticMarkup(React.createElement(MarkList, { id: "h", ...base, rows: [], groups: [{ key: "one", name: "First", rows: rows.slice(0, 3), rest: null }] })) === "" ? "FLOOR: a group under four draws nothing" : "FLOOR: drew");
  process.exit(same ? 0 : 1);
}
console.log(`written scratchpad/home-sections/identity8-${phase}.html`);
```

Run: `node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity8.ts before > scratchpad/home-sections/x08a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x08a.txt`
Expected: `written scratchpad/home-sections/identity8-before.html`, `exit 0`.

- [ ] **Step 2: The grouped form**

In `src/components/spine/archetypes/MarkList.tsx`, below `import type { Provenance } from "@/lib/spine/provenance";` add:

```ts
import { DetailPanel, type DetailRow } from "./DetailPanel";
```

Above `export type MarkListProps = {` add:

```ts
/** A GROUP OF THE GROUPED FORM (plan 2026-10-08, home sections, section 2): its name (the head over its rows, where the one-set form
 *  says what a row is), its rows, and the rest of its set behind the founder's plus (DetailPanel, closed on arrival, rows of a name
 *  and a figure). */
export type MarkGroup = { key: string; name: string; rows: MarkRow[]; rest?: { summary: string; rows: DetailRow[] } | null };

```

Replace the whole of `MarkListProps`, from `export type MarkListProps = {` to its closing `};` (each prop's doc comment moves with it, word for
word), with the part both forms take and the two forms. The grouped form refuses the one-set form's `withheld`, `withheldLine`, `oneColumn` and `foot`
at the type level, since its body reads none of them, and `rows` stays required in both (a grouped card is passed an empty list):

```ts
/** What both forms of the card take. */
type MarkListShared = {
  id: string;
  kicker: string;
  icon?: AtlasIconId;
  tagged?: boolean;
  /** The set's own figure and the words over it. Formatted with the same `fmt`
   *  as every row, so the card cannot hold two notations for one quantity. */
  headline: { label: string; value: number; prov?: Provenance };
  basis: string;
  /** The two column heads. The unit is said HERE, once, and nowhere else
   *  (PART 5: "THE UNIT. Said once, in the column head"). */
  head: { name: string; value: string };
  rows: MarkRow[];
  fmt: (v: number) => string;
};

export type MarkListProps = MarkListShared &
  (
    | {
        /** How many members of the set hold no figure. Declared even when zero: the
         *  harness reads it against the presence of the line below. */
        withheld?: number;
        withheldLine?: string | null;
        /** THE COMPOSER'S WORD THAT THE WIDE SEAT OPENS NO HOLE (2026-09-20): the
         *  two-column form below exists for a wide card beside a SHORTER partner
         *  (PART 5's clause is about the hole a tall one-column list opens beside
         *  it). Beside a TALLER partner the one-column list is the fit, and two
         *  columns would leave the list's own card short: the trade page's `13
         *  rivals` at 693 stands 397 in one column beside the donut's 409, and 308
         *  in two columns with 100 of air under it. The caller says which partner
         *  it has; the component cannot see the band. */
        oneColumn?: boolean;
        /** THE FOOT, PART 7's fourth part, where earned (2026-09-23, the city's `20
         *  crew`): companion figures at 16 under a hairline after the list, drawn by
         *  the same `CompanionRow` RankedBars' foot uses, so the two list cards' feet
         *  are one markup. The crew card's is the week's usual hours, which is the
         *  other half of a wage bill and belongs to this card rather than to one of
         *  its own. */
        foot?: { items: Companion[]; line?: string | null } | null;
        /** The one-set form: no groups. */
        groups?: null;
      }
    | {
        /** THE GROUPED FORM (plan 2026-10-08, home sections, section 2; GroupedMarkList below says why): one measure over sets never
         *  ranked together, each a short ranked list under its own head, in one card under one headline. Its body does not read `rows`
         *  (still required: pass an empty list), `withheld`, `withheldLine`, `oneColumn` or `foot`, so those last four are refused at
         *  the type level; and `head.name` gives way to each group's name (only `head.value` is read). */
        groups: MarkGroup[];
        withheld?: never;
        withheldLine?: never;
        oneColumn?: never;
        foot?: never;
      }
  );
```

Replace:

```tsx
export function MarkList({ id, kicker, icon, tagged, headline, basis, head, rows, fmt, withheld = 0, withheldLine = null, oneColumn = false, foot = null }: MarkListProps) {
```

with:

```tsx
export function MarkList({ id, kicker, icon, tagged, headline, basis, head, rows, fmt, withheld = 0, withheldLine = null, oneColumn = false, foot = null, groups = null }: MarkListProps) {
  /* THE GROUPED FORM has its own body (below), so nothing after this line changes for a one-set card. */
  if (groups) return <GroupedMarkList id={id} kicker={kicker} icon={icon} tagged={tagged} headline={headline} basis={basis} head={head} groups={groups} fmt={fmt} />;
```

Replace the file's last lines:

```tsx
      {foot && foot.items.length > 0 ? (
        <div data-foot className="mt-3 border-t border-[var(--c-border)] pt-3">
          <CompanionRow items={foot.items} />
          {foot.line ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot.line}</p> : null}
        </div>
      ) : null}
    </Box>
  );
}
```

with:

```tsx
      {foot && foot.items.length > 0 ? (
        <div data-foot className="mt-3 border-t border-[var(--c-border)] pt-3">
          <CompanionRow items={foot.items} />
          {foot.line ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{foot.line}</p> : null}
        </div>
      ) : null}
    </Box>
  );
}

/**
 * THE GROUPED FORM (plan 2026-10-08, home sections, section 2: Latin America's countries and Africa's on one measure, his ideas
 * "LATAM Gems" and "Best of Africa"). One measure over one or more sets a reader must never see ranked together, so each set is its
 * own short ranked list under its own head, in one card under one headline, as the one-set form draws one. The law, the one-set
 * form's where it can be:
 *  - THE FLOOR, EVERY GROUP: a group under four rows (MARK_LIST_FLOOR) draws nothing, and then the whole card draws nothing, so a
 *    reader is never shown one set ranked and the other dropped in silence.
 *  - ONE GEOMETRY FOR THE CARD: the figure column is the widest figure any group draws, so every figure in every list shares one right
 *    edge (the page laws' ALIGNMENT); the mark column only where a row carries a mark, the arrow column only where a row is a door.
 *  - THE GROUPS ONE UNDER ANOTHER AT EVERY WIDTH: the card stands in a half of a level (504px at 1280), where two lists side by side
 *    would leave each country's name about 120px.
 *  - A ROW IS THE ONE-SET FORM'S ROW (the same cells and classes), 44 tall at the least, so a door is a tap at 375. A change to the
 *    one-set form's row cells is mirrored here.
 *  - THE REST OF A GROUP BEHIND THE FOUNDER'S PLUS (DetailPanel, closed on arrival; his clause 58, parts behind a click), each row
 *    a name and its figure, stamped where it came from.
 *  - THE HEADLINE IS WHAT THE GROUPS ARE READ AGAINST: the one-set form's middle of its set; here what its label names (the home
 *    passes the UK's own figure on the same measure). Ink at 30, never the accent.
 */
function GroupedMarkList({ id, kicker, icon, tagged, headline, basis, head, groups, fmt }: Pick<MarkListShared, "id" | "kicker" | "icon" | "tagged" | "headline" | "basis" | "head" | "fmt"> & { groups: MarkGroup[] }) {
  if (groups.length === 0 || groups.some((g) => g.rows.length < MARK_LIST_FLOOR) || !Number.isFinite(headline.value)) return null;
  const all = groups.flatMap((g) => g.rows);
  const marks = all.some((r) => r.mark != null);
  const doors = all.some((r) => typeof r.href === "string" && r.href.length > 0);
  const GEO = geometry(Math.max(1, ...all.map((r) => fmt(r.value).length)), marks, doors);
  const rowCls = `${ROW} min-h-11 items-center border-t border-[var(--c-border)]`;
  const cells = (r: MarkRow) => (
    <>
      {marks ? (
        <span className="flex min-w-0 items-center">
          {r.mark != null ? <span data-mark className="inline-flex items-center">{r.mark}</span> : null}
        </span>
      ) : null}
      <span data-label className={NAME_CLS}>{r.name}</span>
      <Fig className="py-0.5 text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]" prov={r.prov}>{fmt(r.value)}</Fig>
      {doors ? <span aria-hidden="true" className="text-right text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.href ? <>&#8594;</> : null}</span> : null}
    </>
  );
  return (
    <Box id={id} data-archetype="mark-list" data-idea="I11" data-form="groups" data-groups={groups.length} data-rows={all.length} data-marks={marks ? "1" : "0"} data-doors={doors ? "1" : "0"} data-withheld={0}>
      <Rail icon={icon} kicker={kicker} sample={tagged} />
      <div data-answer="1">
        <div className={HEAD_CLS}>{headline.label}</div>
        <Fig className="block text-[length:var(--t-focal)] font-semibold leading-none text-[var(--c-ink)]" prov={headline.prov}>{fmt(headline.value)}</Fig>
      </div>
      {basis ? <p className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</p> : null}
      {groups.map((g) => (
        <div key={g.key} data-group={g.key} className="mt-4">
          <div className="grid" data-expect-rows={g.rows.length} data-columns="1">
            <div className={`${ROW} items-baseline pb-2`} style={GEO}>
              {marks ? <span aria-hidden="true" /> : null}
              <div className="col-span-2 flex items-baseline justify-between gap-x-3">
                <span className={HEAD_CLS}>{g.name}</span>
                <span className={HEAD_CLS}>{head.value}</span>
              </div>
              {doors ? <span aria-hidden="true" /> : null}
            </div>
            {g.rows.map((r) =>
              r.href ? (
                <a key={r.key} href={r.href} className={`${rowCls} no-underline transition-colors hover:bg-[var(--c-soft)]`} style={GEO} data-row={r.key} data-value={r.value} data-lands={r.lands}>
                  {cells(r)}
                </a>
              ) : (
                <div key={r.key} className={rowCls} style={GEO} data-row={r.key} data-value={r.value}>
                  {cells(r)}
                </div>
              ),
            )}
          </div>
          {g.rest ? <DetailPanel name={`${id}-${g.key}`} summary={g.rest.summary} rows={g.rest.rows} /> : null}
        </div>
      ))}
    </Box>
  );
}
```

- [ ] **Step 3: Run the identity check and the gates**

Run: `node node_modules/tsx/dist/cli.mjs scratchpad/home-sections/identity8.ts after > scratchpad/home-sections/x08b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/x08b.txt`
Expected: `IDENTICAL: the one-set form renders as it did`, `GROUPS: two, in order`, `ROWS: ten doors`, `PLUS: one, its rows stamped`, `FLOOR: a group under four draws nothing`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=archetype-coverage,census-fresh,type-ladder,width-discipline,no-terra-hover,distance-ladder,one-display,home-kitchens > scratchpad/home-sections/g08.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g08.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 4: Commit**

```bash
git add src/components/spine/archetypes/MarkList.tsx
git commit -m "MarkList's grouped form: one measure over sets never ranked together, a short list each under one headline, the rest behind the plus; the one-set form byte-identical (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 9: section 1's builder, `buildFirmsLast`

**Files:**
- Create: `src/lib/home/firms_last.ts`
- Modify: `src/lib/spine/copy.ts` (a block above the `PRO, QUIETLY` comment in `home`)
- Modify: `tests/home/firms_last.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/firms_last.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import { buildFirmsLast } from "../../src/lib/home/firms_last";
import { COPY } from "../../src/lib/spine/copy";
```

above ` * Run: npx tsx tests/home/firms_last.test.ts` add:

```ts
 * Holds the builder (src/lib/home/firms_last.ts): the cities highest first; the lead the single highest (a tie features nobody);
 * no held-out city drawn; every row a door to its own city page; every figure stamped from the slice; the UK's tick the slice's;
 * the lead's line twelve words at most with the cohort and its fifth year in it.
 *
```

and above `if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }` add:

```ts
/* THE BUILDER (plan Task 9). */
const built = buildFirmsLast();
check("section 1 builds", !!built);
if (built && d) {
  const want = [...d.cities].sort((a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
  check(`the cities run highest first (${built.rows.map((r) => `${r.name} ${r.display}`).join(", ")})`, JSON.stringify(built.rows.map((r) => r.key)) === JSON.stringify(want.map((c) => c.slug)) && built.rows.every((r, i) => r.value === want[i].pct && r.display === want[i].pct.toFixed(1)));
  check(`the lead is the single highest, ${built.lead.figure} (${built.lead.key})`, built.lead.key === want[0].slug && built.lead.figure === want[0].pct.toFixed(1) && want[0].pct > want[1].pct);
  check("no city held out is drawn", !built.rows.some((r) => d.held_out.some((h) => h.slug === r.key)));
  check("every row opens its own city page", built.rows.every((r) => r.href === `/cities/${r.key}`));
  check("every figure says where it came from", [built.lead.prov, ...built.rows.map((r) => r.prov)].every((p) => p.src.startsWith("home/city_survival.json:") && p.kind === "worked out"));
  check(`the UK's tick is the slice's UK share (${built.uk.value}), keyed "${built.uk.label}"`, built.uk.value === d.uk.pct && built.uk.label === COPY.home.firmsLast.ukKey);
  const words = built.lead.words.split(/\s+/).filter(Boolean).length;
  check(`the lead's line is twelve words at most, no semicolon, the cohort and its fifth year in it ("${built.lead.words}")`, words <= 12 && !built.lead.words.includes(";") && built.lead.words.includes(String(d.cohort)) && built.lead.words.includes(String(d.year)) && built.lead.words.startsWith(want[0].name));
  check(`the title is four words at most ("${COPY.home.firmsLast.kicker}")`, COPY.home.firmsLast.kicker.split(/\s+/).length <= 4);
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t09.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t09.txt`
Expected: a module-not-found error on `src/lib/home/firms_last`, `exit 1`.

- [ ] **Step 2: The words**

In `src/lib/spine/copy.ts`, above:

```ts
    /** PRO, QUIETLY (masterplan step 35; his ruling 23): drawn only while the paywall's switch is on. */
```

add:

```ts
    /** WHERE NEW FIRMS LAST (plan 2026-10-08, home sections, section 1): the title, the lead city's one line (it leads a measured
     *  ranking, the reason his featuring rule asks for), the key of the bars' tick at the UK's share, the bars' spoken unit. */
    firmsLast: {
      kicker: "Where new firms last",
      words: "{city}, of 100 firms born in {cohort} still trading in {year}",
      ukKey: "The UK",
      aria: " of 100 still trading",
    },
```

- [ ] **Step 3: The builder**

Create `src/lib/home/firms_last.ts`:

```ts
/**
 * src/lib/home/firms_last.ts
 *
 * WHERE NEW FIRMS LAST, THE UK'S CITIES (plan 2026-10-08, home sections, section 1; his idea of 2026-10-08, "Midtier city
 * opportunities Leeds, Austin, Lublin, Malaga", built for the UK's cities, where the data holds it). Like for like: one cohort (the
 * firms born in the table's year), one measure (of 100, still trading five years on), one country's cities with a page, every figure
 * from data/home/city_survival.json (the business demography tables through scripts/data/home/export_home.py; never typed).
 *
 * The cities run highest first. The highest is the section's figure and one of the home's three loud moments (LOUD_SEATS in
 * home-view.tsx): it leads a measured ranking, the reason his featuring rule asks for, so a tie at the top features nobody and the
 * section is not drawn. A city the publisher stars (over 500 businesses at one postcode, Birmingham today) is held out by the
 * export with that reason, recorded and never printed. The UK's own share is the bars' tick, the figure the home's ring prints
 * rounded, so a reader sees which cities stand above it without a word.
 */
import cityJson from "../../../data/home/city_survival.json";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type City = { slug: string; name: string; births: number; survived: number; pct: number };
type Export = { cohort: number; year: number; uk: { pct: number }; cities: City[]; held_out: City[] };

/** Four members or no ranking (HOMEPAGE-EDITORIAL.md's rule, MarkList's floor). */
export const FIRMS_LAST_FLOOR = 4;

export type FirmsLastRow = { key: string; name: string; value: number; display: string; href: string; prov: Provenance };
export type FirmsLast = { lead: { key: string; figure: string; words: string; prov: Provenance }; rows: FirmsLastRow[]; uk: { value: number; label: string }; cohort: number; year: number };

const one = (v: number) => v.toFixed(1);

export function buildFirmsLast(): FirmsLast | null {
  const d = cityJson as unknown as Export;
  const rows = [...d.cities].sort((a, b) => b.pct - a.pct || a.name.localeCompare(b.name));
  if (rows.length < FIRMS_LAST_FLOOR || !Number.isFinite(d.uk?.pct) || rows[0].pct === rows[1].pct) return null;
  const C = COPY.home.firmsLast;
  const stamp = (key: string): Provenance => ({ src: `home/city_survival.json:${key}`, kind: "worked out" });
  const lead = rows[0];
  return {
    lead: { key: lead.slug, figure: one(lead.pct), words: C.words.replace("{city}", lead.name).replace("{cohort}", String(d.cohort)).replace("{year}", String(d.year)), prov: stamp(lead.slug) },
    rows: rows.map((r) => ({ key: r.slug, name: r.name, value: r.pct, display: one(r.pct), href: `/cities/${r.slug}`, prov: stamp(r.slug) })),
    uk: { value: d.uk.pct, label: C.ukKey },
    cohort: d.cohort,
    year: d.year,
  };
}
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t09.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t09.txt`
Expected: `the cities run highest first (Leeds 41.8, Glasgow 40.2, Edinburgh 39.6, Bristol 38.9, London 38.2, Manchester 33.9)`,
`the lead's line ... ("Leeds, of 100 firms born in 2019 still trading in 2024")`, `home/firms_last: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c09.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c09.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,copy-no-method-words,model-laws-copy,archetype-copy,no-em-dashes,no-source-agencies,no-hardcoded-place,layering,counts-fresh > scratchpad/home-sections/g09.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g09.txt`
Expected: `Passed: 9`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/home/firms_last.ts src/lib/spine/copy.ts tests/home/firms_last.test.ts scripts/gates.json
git commit -m "buildFirmsLast: the UK's cities highest first from the slice, the single leader the lead, the UK's share the tick (plan 2026-10-08, home sections, section 1)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 10: section 2's builder, `buildNewCompanies`

**Files:**
- Create: `src/lib/home/new_companies.ts`
- Modify: `src/lib/spine/copy.ts` (a block above the `PRO, QUIETLY` comment)
- Modify: `tests/home/new_companies.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/new_companies.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import { iso2ToName } from "../../src/lib/countries";
import { buildNewCompanies, NEW_COMPANIES_SHOWN, rateDisplay } from "../../src/lib/home/new_companies";
import { SURFACE_ANSWERS } from "../../src/lib/spine/door_kinds";
import { COPY } from "../../src/lib/spine/copy";
```

above ` * Run: npx tsx tests/home/new_companies.test.ts` add:

```ts
 * Holds the builder (src/lib/home/new_companies.ts): Latin America then Africa, never ranked together; each region's five highest
 * in order, one decimal, the rest behind the plus in order; every row a door to its country's page promising what that page
 * answers; every figure stamped; the card's figure the UK's own; the one line twelve words at most.
 *
```

and above `if (failed > 0) {` add:

```ts
/* THE BUILDER (plan Task 10). */
const built = buildNewCompanies();
check("section 2 builds", !!built);
if (built && d) {
  const one = (v: number) => Math.round(v * 10) / 10;
  check("a small rate prints in two decimals, never nought", rateDisplay(0.0245092032058038) === "0.02" && rateDisplay(0.113132873298748) === "0.1" && rateDisplay(10.8180967387068) === "10.8");
  check("Latin America first, then Africa, never ranked together", JSON.stringify(built.groups.map((g) => g.key)) === JSON.stringify(["latam", "africa"]));
  for (const g of built.groups) {
    const want = (d.regions.find((r) => r.key === g.key)?.members ?? []).filter((m) => m.shown && typeof m.value === "number").sort((a, b) => (b.value as number) - (a.value as number) || a.iso2.localeCompare(b.iso2));
    check(`${g.name}: its ${NEW_COMPANIES_SHOWN} highest, in order (${g.rows.map((r) => `${r.name} ${r.value.toFixed(1)}`).join(", ")})`, g.rows.length === NEW_COMPANIES_SHOWN && g.rows.every((r, i) => r.iso2 === want[i].iso2 && r.value === one(want[i].value as number)));
    check(`${g.name}: the rest behind the plus, in order ("${g.more}")`, g.rest.length === want.length - NEW_COMPANIES_SHOWN && g.rest.every((r, i) => r.value === rateDisplay(want[i + NEW_COMPANIES_SHOWN].value as number)) && g.rest.every((r, i) => r.label === iso2ToName(want[i + NEW_COMPANIES_SHOWN].iso2)) && g.more === COPY.home.newCompanies.more.replace("{n}", String(g.rest.length)).replace("{region}", g.name));
    check(`${g.name}: no rate prints as nought`, [...g.rows.map((r) => r.value.toFixed(1)), ...g.rest.map((r) => r.value)].every((s) => Number(s) > 0));
    check(`${g.name}: every row opens its country's page and promises what that page answers`, g.rows.every((r) => r.href === `/${r.iso2.toLowerCase()}` && r.lands === SURFACE_ANSWERS.country));
    check(`${g.name}: every figure says where it came from`, [...g.rows.map((r) => r.prov), ...g.rest.map((r) => r.prov)].every((p) => p.src.startsWith("home/new_companies.json:") && p.kind === "looked up"));
  }
  check(`the card's figure is the UK's own, ${built.uk.value}`, built.uk.value === one(d.uk.value) && built.uk.prov.src === "home/new_companies.json:GB");
  const line = COPY.home.newCompanies.basis.replace("{year}", String(built.year));
  check(`the one line is twelve words at most, no semicolon ("${line}")`, line.split(/\s+/).length <= 12 && !line.includes(";") && built.year === d.year);
  check(`the title is four words at most ("${COPY.home.newCompanies.kicker}")`, COPY.home.newCompanies.kicker.split(/\s+/).length <= 4);
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/new_companies.test.ts > scratchpad/home-sections/t10.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t10.txt`
Expected: a module-not-found error on `src/lib/home/new_companies`, `exit 1`.

- [ ] **Step 2: The words**

In `src/lib/spine/copy.ts`, above the `PRO, QUIETLY` comment line, add:

```ts
    /** WHERE NEW COMPANIES OPEN (plan 2026-10-08, home sections, section 2): the title, the yardstick's label (the UK's own figure,
     *  for scale; it ranks nothing), the one line (the measure said once: limited companies, per 1,000 of working age, the year),
     *  the value column's head, each region's name and its plus. */
    newCompanies: {
      kicker: "Where new companies open",
      headline: "The UK, for scale",
      basis: "New limited companies per 1,000 people of working age, {year}.",
      headName: "Country",
      headValue: "Per 1,000",
      regions: { latam: "Latin America and the Caribbean", africa: "Africa" },
      more: "{n} more in {region}",
    },
```

- [ ] **Step 3: The builder**

Create `src/lib/home/new_companies.ts`:

```ts
/**
 * src/lib/home/new_companies.ts
 *
 * WHERE NEW COMPANIES OPEN, LATIN AMERICA AND AFRICA (plan 2026-10-08, home sections, section 2; his ideas of 2026-10-08, "LATAM
 * Gems" and "Best of Africa (countries)", with "Rising stars countries" folded in as the audit found it). One measure (new limited
 * companies registered in a year per 1,000 people of working age), one year, countries ranked within their own region and never
 * across the two; each region's five highest drawn with flag and name (his /countries ruling: a country is its flag and its name),
 * the rest behind the founder's plus. A country shows only with a figure for the year and a labour force of a million or more (the
 * export's floor, which leaves a smaller labour force out of the lists). The card's one figure
 * is the UK's own on the same measure, for scale; it ranks nothing. Every number from data/home/new_companies.json, never typed.
 */
import ncJson from "../../../data/home/new_companies.json";
import { iso2ToName } from "@/lib/countries";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Member = { iso2: string; value: number | null; shown: boolean };
type Export = { year: number; uk: { iso2: string; value: number }; regions: Array<{ key: string; members: Member[] }> };

/** Each region's rows drawn; the rest stand behind the plus. Under five shown and the region is not drawn, nor the section. */
export const NEW_COMPANIES_SHOWN = 5;
export const NEW_COMPANIES_REGIONS = ["latam", "africa"] as const;

export type NewCompaniesRow = { key: string; iso2: string; name: string; value: number; href: string; lands: DoorKind; prov: Provenance };
export type NewCompaniesGroup = { key: (typeof NEW_COMPANIES_REGIONS)[number]; name: string; rows: NewCompaniesRow[]; rest: Array<{ label: string; value: string; prov: Provenance }>; more: string };
export type NewCompanies = { year: number; uk: { value: number; prov: Provenance }; groups: NewCompaniesGroup[] };

/** One decimal, half up, as every rate on the site prints. */
const one = (v: number) => Math.round(v * 10) / 10;
/** A rate as the site prints it: one decimal, half up; under 0.1 two decimals, so a rate of 0.005 or more never prints as nought. */
export const rateDisplay = (v: number) => (v < 0.1 ? (Math.round(v * 100) / 100).toFixed(2) : one(v).toFixed(1));

export function buildNewCompanies(): NewCompanies | null {
  const d = ncJson as unknown as Export;
  if (!Number.isFinite(d.uk?.value)) return null;
  const C = COPY.home.newCompanies;
  const stamp = (iso2: string): Provenance => ({ src: `home/new_companies.json:${iso2}`, kind: "looked up" });
  const groups: NewCompaniesGroup[] = [];
  for (const key of NEW_COMPANIES_REGIONS) {
    const shown = (d.regions.find((r) => r.key === key)?.members ?? [])
      .filter((m): m is Member & { value: number } => m.shown && typeof m.value === "number" && Number.isFinite(m.value))
      .sort((a, b) => b.value - a.value || a.iso2.localeCompare(b.iso2));
    if (shown.length < NEW_COMPANIES_SHOWN) return null;
    const rows = shown.map((m) => ({ key: m.iso2.toLowerCase(), iso2: m.iso2, name: iso2ToName(m.iso2), value: one(m.value), href: `/${m.iso2.toLowerCase()}`, lands: SURFACE_ANSWERS.country, prov: stamp(m.iso2) }));
    const name = C.regions[key];
    groups.push({
      key,
      name,
      rows: rows.slice(0, NEW_COMPANIES_SHOWN),
      /* The rest print from the full figure through rateDisplay, never from the rounded rows. */
      rest: shown.slice(NEW_COMPANIES_SHOWN).map((m) => ({ label: iso2ToName(m.iso2), value: rateDisplay(m.value), prov: stamp(m.iso2) })),
      more: C.more.replace("{n}", String(rows.length - NEW_COMPANIES_SHOWN)).replace("{region}", name),
    });
  }
  return { year: d.year, uk: { value: one(d.uk.value), prov: stamp("GB") }, groups };
}
```

The rest behind the plus is ordered on each country's full figure, never on the rounded one, and printed through `rateDisplay` (one decimal, half
up; under 0.1 two decimals, so a rate of 0.005 or more never prints as nought: Liberia's 0.0245 prints 0.02 and Madagascar's 0.113 prints 0.1). The
gate holds the rest's names in order as well as its printed figures, because countries that print one figure (Colombia and Jamaica 2.3; Ghana,
Senegal and Angola 1.3; Egypt and Somalia 0.3) would flip under a sort on the rounded figure and still print the same column; and `rateDisplay`
has a check of its own on literal values, so it is not its own oracle.

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/new_companies.test.ts > scratchpad/home-sections/t10.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t10.txt`
Expected: `a small rate prints in two decimals, never nought`, `Latin America and the Caribbean: its 5 highest, in order (Chile 10.8, Costa Rica 5.8, Brazil 5.1, Peru 4.7,
Panama 4.5)`, `Africa: its 5 highest, in order (South Africa 11.1, Botswana 8.7, Morocco 2.6, Tunisia 1.7, Zambia 1.6)`, `("6 more in Latin America and
the Caribbean")`, `("15 more in Africa")`, `the card's figure is the UK's own, 18.6`, `home/new_companies: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c10.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c10.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-new-companies,copy-no-method-words,model-laws-copy,archetype-copy,no-em-dashes,no-source-agencies,layering,counts-fresh > scratchpad/home-sections/g10.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g10.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/home/new_companies.ts src/lib/spine/copy.ts tests/home/new_companies.test.ts scripts/gates.json
git commit -m "buildNewCompanies: each region's five highest from the slice, the rest behind the plus, every row a door to its country, the UK for scale (plan 2026-10-08, home sections, section 2)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 11: section 3's builder, `buildUsRestaurants`

**Files:**
- Create: `src/lib/home/us_restaurants.ts`
- Modify: `src/lib/spine/copy.ts` (a block above the `PRO, QUIETLY` comment)
- Modify: `tests/home/us_restaurants.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/us_restaurants.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import { buildUsRestaurants, US_ENDS } from "../../src/lib/home/us_restaurants";
import { COPY } from "../../src/lib/spine/copy";
```

above ` * Run: npx tsx tests/home/us_restaurants.test.ts` add:

```ts
 * Holds the builder (src/lib/home/us_restaurants.ts): the five metros that added most, most first, and the five that lost most,
 * most first, ranked by the count added or lost so the order can be read off the two printed counts; the metros ranked are those
 * with a city page less any the export holds out with its reason (the slice's `metros`, not its `held_out`), and no metro held out
 * is drawn; two counts a row as the slice holds them, never a percent; the lead the single metro that added most, its count added
 * the card's figure; every figure stamped; the lead's line twelve words at most.
 *
```

and above `if (failed > 0) {` add:

```ts
/* THE BUILDER (plan Task 11). */
const built = buildUsRestaurants();
check("section 3 builds", !!built);
if (built && d) {
  const change = (m: Metro) => m.y_to - m.y_from;
  const added = d.metros.filter((m) => change(m) > 0).sort((a, b) => change(b) - change(a) || a.name.localeCompare(b.name));
  const lost = d.metros.filter((m) => change(m) < 0).sort((a, b) => change(a) - change(b) || a.name.localeCompare(b.name));
  const count = (n: number) => n.toLocaleString("en-US");
  check(`the ${US_ENDS} that added most, most first (${built.added.map((r) => `${r.name} ${r.a} to ${r.b}`).join("; ")})`, JSON.stringify(built.added.map((r) => r.key)) === JSON.stringify(added.slice(0, US_ENDS).map((m) => m.slug)));
  check(`the ${US_ENDS} that lost most, most first (${built.lost.map((r) => `${r.name} ${r.a} to ${r.b}`).join("; ")})`, JSON.stringify(built.lost.map((r) => r.key)) === JSON.stringify(lost.slice(0, US_ENDS).map((m) => m.slug)));
  /* A TIE AT EITHER CUT. The ranking is by the count added or lost, so a metro tied with the last one drawn would be drawn or left out by its name, and the alphabet would choose who the section shows. A list with nothing past the cut has no cut to tie at. */
  const tied = (list: Metro[]) => list.length > US_ENDS && change(list[US_ENDS - 1]) === change(list[US_ENDS]);
  const atCut = (list: Metro[]) => (list.length > US_ENDS ? `last drawn ${count(change(list[US_ENDS - 1]))} against first left out ${count(change(list[US_ENDS]))}` : "none left out");
  check(`no tie at either cut (added: ${atCut(added)}; lost: ${atCut(lost)})`, !tied(added) && !tied(lost), { file: "data/home/us_restaurants.json", remedy: "a tie at a cut draws one metro over another for its name: decide in the plan which ends the list, then change the builder and this check together" });
  const out = Array.isArray(d.held_out) ? d.held_out : [];
  check("no metro held out is drawn", !([...built.added, ...built.lost].some((r) => out.some((h) => h.slug === r.key))));
  /* THE DECISION ITSELF (plan decision 12). The check above reads the held-out list as the slice gives it, so an emptied HELD_OUT map in the export would put Detroit back into the ranking with every other check green; this pin names the metros the export holds out. */
  check(`the export holds out exactly the metros plan decision 12 names (${out.map((h) => h.slug).join(", ") || "none"})`, JSON.stringify(out.map((h) => h.slug)) === JSON.stringify(["detroit"]), { remedy: "plan decision 12 holds Detroit out: restore it in the HELD_OUT map of scripts/data/home/export_home.py, then re-run python -P scripts/data/home/export_home.py us_restaurants, or change the decision in the plan and this pin together" });
  check("two counts a row as the slice holds them, and never a percent", [...built.added, ...built.lost].every((r) => { const m = d.metros.find((x) => x.slug === r.key); return !!m && r.from === m.y_from && r.to === m.y_to && r.a === count(m.y_from) && r.b === count(m.y_to) && !/%/.test(r.a + r.b); }));
  check(`the lead added most, alone at the top: ${built.lead.figure} (${built.lead.key})`, built.lead.key === added[0].slug && built.lead.figure === count(change(added[0])) && change(added[0]) > change(added[1]));
  check("every figure says where it came from", [...built.added, ...built.lost].every((r) => r.aProv.src === `home/us_restaurants.json:${r.key}:${d.from}` && r.bProv.src === `home/us_restaurants.json:${r.key}:${d.to}` && r.aProv.kind === "counted" && r.bProv.kind === "counted") && built.lead.prov.src.startsWith(`home/us_restaurants.json:${built.lead.key}:`) && built.lead.prov.kind === "worked out");
  const words = built.lead.words.split(/\s+/).filter(Boolean).length;
  check(`the lead's line is twelve words at most, no semicolon ("${built.lead.words}")`, words <= 12 && !built.lead.words.includes(";") && built.lead.words.endsWith(added[0].name));
  const title = COPY.home.usRestaurants.kicker.replace("{from}", String(d.from));
  check(`the title is four words at most ("${title}")`, title.split(/\s+/).length <= 4);
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t11.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t11.txt`
Expected: a module-not-found error on `src/lib/home/us_restaurants`, `exit 1`.

- [ ] **Step 2: The words**

In `src/lib/spine/copy.ts`, above the `PRO, QUIETLY` comment line, add:

```ts
    /** WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3): the title, the lead's one line (the
     *  narrower trade named, the metro last so a long name still fits twelve words), the two tables' heads. */
    usRestaurants: {
      kicker: "US restaurants since {from}",
      words: "Full-service restaurants added since {from}, most of {n} metros: {city}",
      added: "Most added",
      lost: "Most lost",
    },
```

- [ ] **Step 3: The builder**

Create `src/lib/home/us_restaurants.ts`:

```ts
/**
 * src/lib/home/us_restaurants.ts
 *
 * WHERE US RESTAURANTS GREW AND SHRANK (plan 2026-10-08, home sections, section 3; his idea of 2026-10-08, "US biggest winners and
 * losers ranking of top 5 cities bottom 5"). One trade held (full-service restaurants, private establishments), the US metros the
 * site has city pages for, less any the export holds out with its reason (Detroit today: plan decision 12; the slice's `held_out`,
 * recorded and never drawn), so the metros ranked are the slice's `metros`; two counts a metro (the first and the last year on
 * disk), from data/home/us_restaurants.json (never typed). Ranked by the restaurants a metro added or lost, so the order can be
 * read off the two printed counts; never a percent and never a composite (PART 9 clause 15; his ruling 11). The five that added
 * most and the five that lost most; the metro that added most leads, its count added the section's figure and one of the home's
 * three loud moments (it leads a measured ranking), and a tie at the top features nobody and the section is not drawn.
 */
import usJson from "../../../data/home/us_restaurants.json";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Metro = { slug: string; name: string; y_from: number; y_to: number };
type Export = { from: number; to: number; metros: Metro[] };

/** The metros drawn at each end of the ranking. */
export const US_ENDS = 5;

export type UsRestaurantsRow = { key: string; name: string; from: number; to: number; a: string; b: string; aProv: Provenance; bProv: Provenance };
export type UsRestaurants = { from: number; to: number; count: number; lead: { key: string; figure: string; words: string; prov: Provenance }; added: UsRestaurantsRow[]; lost: UsRestaurantsRow[] };

const count = (n: number) => n.toLocaleString("en-US");

export function buildUsRestaurants(): UsRestaurants | null {
  const d = usJson as unknown as Export;
  const change = (m: Metro) => m.y_to - m.y_from;
  const added = d.metros.filter((m) => change(m) > 0).sort((a, b) => change(b) - change(a) || a.name.localeCompare(b.name));
  const lost = d.metros.filter((m) => change(m) < 0).sort((a, b) => change(a) - change(b) || a.name.localeCompare(b.name));
  if (added.length < US_ENDS || lost.length < US_ENDS || change(added[0]) === change(added[1])) return null;
  const at = (m: Metro, year: number): Provenance => ({ src: `home/us_restaurants.json:${m.slug}:${year}`, kind: "counted" });
  const row = (m: Metro): UsRestaurantsRow => ({ key: m.slug, name: m.name, from: m.y_from, to: m.y_to, a: count(m.y_from), b: count(m.y_to), aProv: at(m, d.from), bProv: at(m, d.to) });
  const lead = added[0];
  const C = COPY.home.usRestaurants;
  return {
    from: d.from,
    to: d.to,
    count: d.metros.length,
    lead: {
      key: lead.slug,
      figure: count(change(lead)),
      words: C.words.replace("{from}", String(d.from)).replace("{n}", String(d.metros.length)).replace("{city}", lead.name),
      prov: { src: `home/us_restaurants.json:${lead.slug}:${d.to} less ${d.from}`, kind: "worked out" },
    },
    added: added.slice(0, US_ENDS).map(row),
    lost: lost.slice(0, US_ENDS).map(row),
  };
}
```

Two checks of the gate guard what the builder cannot see. A tie at either cut (the fifth and the sixth metro with one count) would draw one metro
over another for its name, so the gate names the two counts at each cut and reds on a tie (today Phoenix 393 against Charlotte 390, St. Louis -41
against San Jose -40). And the list of metros the export holds out is pinned to the one decision 12 names (Detroit), read through a guard so a
slice that lost the list ends on its summary, never a TypeError, and a pin that finds nothing held out prints `none`; its remedy names the map in
the export and the command that re-runs it.

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t11.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t11.txt`
Expected: `the 5 that added most, most first (Atlanta 4,451 to 5,179; Houston 4,512 to 5,027; Dallas 5,234 to 5,712; Miami 5,584 to
6,050; Phoenix 2,435 to 2,828)`, `the 5 that lost most, most first (San Francisco 5,189 to 4,919; Los Angeles 11,146 to 10,975;
Pittsburgh 1,776 to 1,714; Buffalo 939 to 886; St. Louis 2,030 to 1,989)`, `no tie at either cut (added: last drawn 393 against first left
out 390; lost: last drawn -41 against first left out -40)`, `no metro held out is drawn`, `the export holds out exactly the metros plan
decision 12 names (detroit)`, `... alone at the top: 728 (atlanta)`, `("Full-service restaurants added since 2019, most of 44 metros:
Atlanta")`, `home/us_restaurants: all pass`, `exit 0` (Detroit, held out in decision 12, is in neither list).
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c11.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c11.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-us-restaurants,copy-no-method-words,model-laws-copy,archetype-copy,no-em-dashes,no-source-agencies,layering,counts-fresh > scratchpad/home-sections/g11.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g11.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/home/us_restaurants.ts src/lib/spine/copy.ts tests/home/us_restaurants.test.ts scripts/gates.json
git commit -m "buildUsRestaurants: the five metros that added most and the five that lost most, by the count, two counts a row, the single leader's count added the lead (plan 2026-10-08, home sections, section 3)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 12: section 4's builder, `buildHowMade`

**Files:**
- Create: `src/lib/home/how_made.ts`
- Modify: `src/lib/spine/copy.ts` (a block above the `PRO, QUIETLY` comment)
- Modify: `tests/home/how_made.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/how_made.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import { buildHowMade } from "../../src/lib/home/how_made";
import { londonTradeSales } from "../../src/lib/uk/registers/london_trade";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { COPY } from "../../src/lib/spine/copy";
```

above ` * Run: npx tsx tests/home/how_made.test.ts` add:

```ts
 * Holds the builder (src/lib/home/how_made.ts): the focal is the slice's notices; the names matched are the slice's, of its names;
 * the London trade pages are counted as their pages print them, never as the builder reads them: the trades whose page prints a
 * takings figure (tradeHeadFigure, which the page, its description and its share card read), of the London trade pages served
 * (the taxonomy's trade slugs that are not retired, the sitemap's list), at least the trades the UK page's money card ranks; no
 * row counts countries and the copy holds no countries row (his ruling of 2026-10-07: the home's 195 counter is wrong); every
 * figure stamped; the focal's line twelve words at most; the copy's checks name the copy.
 *
```

and above `if (failed > 0) {` add:

```ts
/* THE BUILDER (plan Task 12). */
const COPY_FILE = "src/lib/spine/copy.ts";
const TRADES_AT = { file: "src/lib/home/how_made.ts", remedy: "count the London trade pages that print a takings figure (tradeHeadFigure) out of the pages served, the taxonomy's trade slugs that are not retired, the sitemap's list" };
const built = buildHowMade();
check("section 4 builds", !!built);
if (built && d) {
  const n = (v: number) => v.toLocaleString("en-US");
  check(`the focal is the slice's notices, ${built.notices.figure}`, built.notices.figure === n(d.notices) && built.notices.prov.src === "home/method.json:notices" && built.notices.prov.kind === "counted");
  const row = (key: string) => built.rows.find((r) => r.key === key);
  check(`the names matched are the slice's, of its names (${row("matched")?.value})`, row("matched")?.value === `${n(d.matched_names)} of ${n(d.names)}`);
  /* THE TRADE PAGES, HELD TO THE PAGES AND NOT TO THE BUILDER'S OWN PREDICATE. A London trade page prints a takings figure where its
     head gives a dollar one (tradeHeadFigure: the page, its description and its share card read it; a trade whose median falls in
     an open band prints an edge in words and gives none). The pages served are the sitemap's London list, every trade slug of the
     taxonomy that is not retired (src/app/sitemap.ts, src/lib/home/destination.ts). A gate cannot read that list from the sitemap:
     its module builds the database client on load and so needs the database address, which a gate never has. So the sitemap's
     rule is restated here from the taxonomy, as the routing gates restate it (tests/routing/edge_not_found.test.ts). */
  const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !Object.hasOwn(RETIRED, s));
  const printing = served.filter((s) => tradeHeadFigure({ isLondon: true, slug: s })?.usd != null);
  const closed = served.filter((s) => londonTradeSales(s)?.q50.open === false);
  const apart = [...closed.filter((s) => !printing.includes(s)), ...printing.filter((s) => !closed.includes(s))];
  check(`the trades whose median falls in a closed band are exactly the pages that print a takings figure (${printing.length} of the ${served.length} served)${apart.length ? `; apart on ${apart.join(", ")}` : ""}`, apart.length === 0, TRADES_AT);
  check(`the London trade pages are counted as they print (${row("trades")?.value}; the UK page's money card ranks ${buildLondonTradeSales()?.rows.length} of them, one a code)`, row("trades")?.value === `${n(printing.length)} of ${n(served.length)}` && printing.length >= (buildLondonTradeSales()?.rows.length ?? Number.POSITIVE_INFINITY), TRADES_AT);
  check("no row counts countries (his ruling of 2026-10-07: the home's 195 counter is wrong)", !built.rows.some((r) => /countr/i.test(r.label)) && !Object.keys(COPY.home.howMade).includes("countries"), { file: COPY_FILE, remedy: "take the countries row and its words out of COPY.home.howMade; the home prints no count of countries (his ruling of 2026-10-07)" });
  check("every figure says where it came from", built.rows.every((r) => r.prov.src.length > 0 && r.prov.kind === "counted"));
  check("the door goes to About the figures", built.link.href === "/about-data" && built.link.label === COPY.home.howMade.link);
  const words = built.notices.words.split(/\s+/).filter(Boolean).length;
  check(`the focal's line is twelve words at most, no semicolon ("${built.notices.words}")`, words <= 12 && !built.notices.words.includes(";"), { file: COPY_FILE, remedy: "cut COPY.home.howMade.words to twelve words at most and no semicolon, the card's one supporting line" });
  check(`the title is four words at most, and every row's label three ("${COPY.home.howMade.kicker}")`, COPY.home.howMade.kicker.split(/\s+/).length <= 4 && built.rows.every((r) => r.label.split(/\s+/).length <= 3), { file: COPY_FILE, remedy: "cut COPY.home.howMade.kicker to four words at most and each row's label (COPY.home.howMade.matched.label, COPY.home.howMade.trades.label) to three" });
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/how_made.test.ts > scratchpad/home-sections/t12.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t12.txt`
Expected: a module-not-found error on `src/lib/home/how_made`, `exit 1`.

- [ ] **Step 2: The words**

In `src/lib/spine/copy.ts`, above the `PRO, QUIETLY` comment line, add:

```ts
    /** HOW FIGURES ARE MADE (plan 2026-10-08, home sections, section 4): the title, the focal's one line (the notices and the
     *  technique), each row's label (three words at most) and note, and the door to About the figures. No countries row and no
     *  line that the pages print estimates (his ruling of 2026-10-07: the home's 195 counter is wrong). */
    howMade: {
      kicker: "How figures are made",
      words: "Company notices in a year, matched by name to the company register",
      matched: { label: "Names matched", note: "Company names in the notices, found in the register" },
      trades: { label: "London trade pages", note: "Takings read from the official counts by turnover band" },
      link: "About the figures",
    },
```

- [ ] **Step 3: The builder**

Create `src/lib/home/how_made.ts`:

```ts
/**
 * src/lib/home/how_made.ts
 *
 * HOW FIGURES ARE MADE (plan 2026-10-08, home sections, section 4; his ideas of 2026-10-08, "the deep techniques used to derive
 * data", "unmatched archival capability" and "the global coverage", merged as the audit found them honest). Each technique shown by
 * a figure it produced: a year of company notices matched by name to the company register (the focal, and the names matched of
 * the names they held, so the match rate is on the card), and London's trades' takings read from the official counts by turnover
 * band (the London trade pages that print a takings figure, of those served: the taxonomy's trade slugs that are not retired, the
 * list the sitemap and the home's search go by). No count of countries and no line that the pages print estimates: his ruling of
 * 2026-10-07 is that the home's 195 counter is wrong, so the global coverage is not built. Counts of distinct records and of
 * reachable pages only, never cells or slots (src/lib/coverage/report.ts says why). Quiet: no accent. The notices from
 * data/home/method.json; the rest worked out from this repo's own files, never typed.
 */
import methodJson from "../../../data/home/method.json";
import { londonTradeSales } from "@/lib/uk/registers/london_trade";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { RETIRED } from "@/lib/taxonomy/retired";
import { hasOwn } from "@/lib/own";
import type { Provenance } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";

type Export = { notices: number; names: number; matched_names: number };

export type HowMadeRow = { key: "matched" | "trades"; label: string; value: string; note: string; prov: Provenance };
export type HowMade = { notices: { figure: string; words: string; prov: Provenance }; rows: HowMadeRow[]; link: { href: string; label: string } };

const n = (v: number) => v.toLocaleString("en-US");

export function buildHowMade(): HowMade | null {
  const m = methodJson as unknown as Export;
  if (![m.notices, m.names, m.matched_names].every((v) => Number.isInteger(v) && v > 0)) return null;
  /* The London trade pages served: every trade slug of the taxonomy that is not retired, the list the sitemap and the home's search
     go by (src/app/sitemap.ts, src/lib/home/destination.ts). */
  const served = Object.keys(SLUG_TO_INDUSTRY).filter((s) => !hasOwn(RETIRED, s));
  /* Of them, the pages that print a takings figure: where the trade's register median falls in a closed band of the band counts. A
     median in an open band prints an edge in words, and is not counted. */
  const trades = served.filter((s) => londonTradeSales(s)?.q50.open === false).length;
  if (trades === 0) return null;
  const C = COPY.home.howMade;
  return {
    notices: { figure: n(m.notices), words: C.words, prov: { src: "home/method.json:notices", kind: "counted" } },
    rows: [
      { key: "matched", label: C.matched.label, value: `${n(m.matched_names)} of ${n(m.names)}`, note: C.matched.note, prov: { src: "home/method.json:matched_names of names", kind: "counted" } },
      { key: "trades", label: C.trades.label, value: `${n(trades)} of ${n(served.length)}`, note: C.trades.note, prov: { src: "uk/registers/turnover.json:London trades with takings read from the band counts, of the trade pages served", kind: "counted" } },
    ],
    link: { href: "/about-data", label: C.link },
  };
}
```

- [ ] **Step 4: Run the test and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/how_made.test.ts > scratchpad/home-sections/t12.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t12.txt`
Expected: `the focal is the slice's notices, 31,926`, `(30,510 of 31,376)`, `the trades whose median falls in a closed band are
exactly the pages that print a takings figure (111 of the 138 served)`, `the London trade pages are counted as they print
(111 of 138; the UK page's money card ranks 16 of them, one a code)`, `no row counts countries (his ruling of 2026-10-07:
the home's 195 counter is wrong)`, `home/how_made: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c12.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c12.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-how-made,copy-no-method-words,model-laws-copy,archetype-copy,no-em-dashes,no-source-agencies,layering,counts-fresh > scratchpad/home-sections/g12.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g12.txt`
Expected: `Passed: 8`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/home/how_made.ts src/lib/spine/copy.ts tests/home/how_made.test.ts scripts/gates.json
git commit -m "buildHowMade: the notices and their match rate, the London trade pages read from the bands, no count of countries (plan 2026-10-08, home sections, section 4)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 13: sections 1 and 2 drawn

**Files:**
- Create: `src/components/spine/home/HomeFirmsLast.tsx`, `src/components/spine/home/HomeNewCompanies.tsx`
- Modify: `tests/home/firms_last.test.ts`, `tests/home/new_companies.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/firms_last.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeFirmsLast } from "../../src/components/spine/home/HomeFirmsLast";
```

and above `if (failed > 0) {` add:

```ts
/* THE DRAWING (plan Task 13): the bars, plain and filling the half, the lead's bar marked and its figure the card's one accent, the
   UK's tick keyed once, every figure stamped, the title the copy gate's. */
if (built) {
  const html = renderToStaticMarkup(React.createElement(HomeFirmsLast, { last: built }));
  check("the section is a box with its id and its bars (plain, filling its half, the lead's bar marked)", /id="firms-last"/.test(html) && /data-archetype="bar-list"/.test(html) && /data-look="plain"/.test(html) && /data-marked="1"/.test(html) && /flex-1/.test(html));
  const accents = html.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  check(`one figure in the accent, the lead's (${accents.length})`, accents.length === 1 && new RegExp(`text-\\[var\\(--terra-text\\)\\][^>]*>${built.lead.figure.replace(".", "\\.")}<`).test(html));
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === built.rows.length + 1 && figs.every((f) => /data-src="home\/city_survival\.json:/.test(f) && /data-kind="worked out"/.test(f)));
  check("the tick at the UK's share is keyed once", /data-ref-tick/.test(html) && (html.match(/data-ref-key/g) ?? []).length === 1 && html.includes(COPY.home.firmsLast.ukKey));
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is the copy's, four words at most ("${title}")`, title === COPY.home.firmsLast.kicker && title.split(/\s+/).length <= 4);
  check("one supporting line, the lead's", (html.match(/<p /g) ?? []).length === 1 && html.includes(built.lead.words));
}
```

In `tests/home/new_companies.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeNewCompanies } from "../../src/components/spine/home/HomeNewCompanies";
```

and above `if (failed > 0) {` add:

```ts
/* THE DRAWING (plan Task 13): the list card's grouped form, the two regions in order, each drawn country its flag, its name and its
   figure, a door to its page; the rest behind each plus, closed; quiet (no accent); every figure stamped; one line. */
if (built) {
  /* CountryFlag is written for Next's automatic JSX runtime and names no React; this runner compiles JSX to React.createElement, so
     the flags read the one React this file lends them (as tests/spine/uk_sources.test.ts lends it to the About page). */
  (globalThis as unknown as { React: typeof React }).React = React;
  const html = renderToStaticMarkup(React.createElement(HomeNewCompanies, { nc: built }));
  check("the section is the list card's grouped form, Latin America then Africa", /id="new-companies"/.test(html) && /data-archetype="mark-list"/.test(html) && /data-form="groups"/.test(html) && html.indexOf('data-group="latam"') !== -1 && html.indexOf('data-group="africa"') > html.indexOf('data-group="latam"'));
  const drawn = built.groups.reduce((s, g) => s + g.rows.length, 0);
  check(`each drawn country is its flag, its name and its figure, a door to its page (${drawn})`, (html.match(/<a [^>]*data-row=/g) ?? []).length === drawn && (html.match(/flagcdn\.com\//g) ?? []).length === drawn && (html.match(/data-lands="government-take"/g) ?? []).length === drawn);
  check("the rest of each region stands behind its plus, closed", (html.match(/<details/g) ?? []).length === built.groups.filter((g) => g.rest.length >= 2).length && !/<details[^>]*\bopen\b/.test(html));
  check("no figure in the accent (a quiet section)", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html));
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  const rest = built.groups.reduce((s, g) => s + (g.rest.length >= 2 ? g.rest.length : 0), 0);
  check(`every figure says where it came from (${figs.length}: the UK's, ${drawn} drawn, ${rest} behind the plus)`, figs.length === 1 + drawn + rest && figs.every((f) => /data-src="home\/new_companies\.json:/.test(f) && /data-kind="looked up"/.test(f)));
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is the copy's, four words at most ("${title}")`, title === COPY.home.newCompanies.kicker && title.split(/\s+/).length <= 4);
  check("one supporting line, the measure said once", (html.match(/<p /g) ?? []).length === 1 && html.includes(COPY.home.newCompanies.basis.replace("{year}", String(built.year))));
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t13a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t13a.txt`
Expected: a module-not-found error on `HomeFirmsLast`, `exit 1` (and the same for `HomeNewCompanies` in its file).

- [ ] **Step 2: Section 1 drawn**

Create `src/components/spine/home/HomeFirmsLast.tsx`:

```tsx
/**
 * WHERE NEW FIRMS LAST ON THE HOME PAGE (plan 2026-10-08, home sections, section 1): the lead city's share of its 2019 firms still
 * trading five years on, the card's one figure and one of the page's three loud moments (LOUD_SEATS, seat 2), then the UK's cities
 * as the site's gradient bar list, highest first, each a door to its city page, the lead's bar the one in the accent's gradient, a
 * tick at the UK's own share keyed once under the list. The bars' far end is the whole, 100, so a bar is the city's own share and
 * never a share of the leader's. The list fills the height its level gives it (`fill`): it stands beside the UK's city rows, which
 * fill theirs too, so neither half stands a blank foot. Every figure from src/lib/home/firms_last.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { BarList } from "@/components/spine/charts/BarList";
import { COPY } from "@/lib/spine/copy";
import type { FirmsLast } from "@/lib/home/firms_last";

/** Of 100: the bars' far end is the whole. */
const WHOLE = 100;

export function HomeFirmsLast({ last }: { last: FirmsLast }) {
  const C = COPY.home.firmsLast;
  return (
    <Box id="firms-last" className="flex flex-col">
      <Rail icon="ranking" kicker={C.kicker} />
      <Focal figure={last.lead.figure} words={last.lead.words} prov={last.lead.prov} accent />
      <BarList items={last.rows.map((r) => ({ key: r.key, label: r.name, value: r.value, display: r.display, href: r.href, prov: r.prov }))} max={WHOLE} look="plain" mark={last.lead.key} fill reference={last.uk} ariaUnit={C.aria} />
    </Box>
  );
}
```

- [ ] **Step 3: Section 2 drawn**

Create `src/components/spine/home/HomeNewCompanies.tsx`:

```tsx
/**
 * WHERE NEW COMPANIES OPEN ON THE HOME PAGE (plan 2026-10-08, home sections, section 2): the list card's grouped form, the UK's own
 * figure for scale at 30 in ink (quiet: no accent), the one line saying the measure once, then Latin America's five highest and
 * Africa's, each country its flag, its name and its figure (his /countries ruling: a country is its flag and its name), a door to its
 * country page, and the rest of each region behind the founder's plus. The flag comes from CountryFlag and nowhere else (MarkList's
 * clause 5). Every figure from src/lib/home/new_companies.ts, stamped.
 */
import * as React from "react";
import { MarkList } from "@/components/spine/archetypes/MarkList";
import { CountryFlag } from "@/components/CountryFlag";
import { COPY } from "@/lib/spine/copy";
import type { NewCompanies } from "@/lib/home/new_companies";

export function HomeNewCompanies({ nc }: { nc: NewCompanies }) {
  const C = COPY.home.newCompanies;
  return (
    <MarkList
      id="new-companies"
      kicker={C.kicker}
      icon="global-spread"
      headline={{ label: C.headline, value: nc.uk.value, prov: nc.uk.prov }}
      basis={C.basis.replace("{year}", String(nc.year))}
      head={{ name: C.headName, value: C.headValue }}
      rows={[]}
      groups={nc.groups.map((g) => ({
        key: g.key,
        name: g.name,
        rows: g.rows.map((r) => ({ key: r.key, name: r.name, value: r.value, mark: <CountryFlag iso2={r.iso2} />, href: r.href, lands: r.lands, prov: r.prov })),
        rest: g.rest.length >= 2 ? { summary: g.more, rows: g.rest } : null,
      }))}
      fmt={(v) => v.toFixed(1)}
    />
  );
}
```

- [ ] **Step 4: Run the tests and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/firms_last.test.ts > scratchpad/home-sections/t13a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t13a.txt`
Expected: `one figure in the accent, the lead's (1)`, `every figure says where it came from (7)`, `home/firms_last: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs tests/home/new_companies.test.ts > scratchpad/home-sections/t13b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t13b.txt`
Expected: `(10)` drawn, `(32: the UK's, 10 drawn, 21 behind the plus)`, `home/new_companies: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c13.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c13.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-firms-last,home-new-companies,archetype-coverage,no-terra-hover,legacy-method-words,no-hardcoded-place,no-hardcoded-hex,type-ladder,width-discipline,distance-ladder,one-display,layering,counts-fresh > scratchpad/home-sections/g13.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g13.txt`
Expected: `Passed: 13`, `Failed: 0` (the two files hold no `<Box` without an archetype: HomeFirmsLast's holds `<BarList`, HomeNewCompanies has none).

- [ ] **Step 5: Commit**

```bash
git add src/components/spine/home/HomeFirmsLast.tsx src/components/spine/home/HomeNewCompanies.tsx tests/home/firms_last.test.ts tests/home/new_companies.test.ts scripts/gates.json
git commit -m "Sections 1 and 2 drawn: the UK cities' bars with the lead in the accent and the UK's tick; Latin America and Africa on the list card's grouped form, flags and names, the rest behind the plus (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 14: sections 3 and 4 drawn

**Files:**
- Create: `src/components/spine/home/HomeUsRestaurants.tsx`, `src/components/spine/home/HomeHowMade.tsx`
- Modify: `tests/home/us_restaurants.test.ts`, `tests/home/how_made.test.ts`; generated `scripts/gates.json`

- [ ] **Step 1: Write the failing checks**

In `tests/home/us_restaurants.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeUsRestaurants } from "../../src/components/spine/home/HomeUsRestaurants";
```

and above `if (failed > 0) {` add:

```ts
/* THE DRAWING (plan Task 14): the lead's count added the card's one accent, two tables of a name and two counts (most added, most
   lost), each count stamped, no percent anywhere, the title the copy gate's. */
if (built) {
  const html = renderToStaticMarkup(React.createElement(HomeUsRestaurants, { us: built }));
  check("the section is a box with its id and two tables of a name and two figures", /id="us-restaurants"/.test(html) && (html.match(/data-archetype="tiers-table"/g) ?? []).length === 2 && (html.match(/data-shape="figures"/g) ?? []).length === 2 && html.indexOf(COPY.home.usRestaurants.added) < html.indexOf(COPY.home.usRestaurants.lost));
  const accents = html.match(/(?:^|[\s"])text-\[var\(--terra-text\)\]/g) ?? [];
  check(`one figure in the accent, the lead's (${accents.length})`, accents.length === 1 && new RegExp(`text-\\[var\\(--terra-text\\)\\][^>]*>${built.lead.figure}<`).test(html));
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === 1 + 2 * (built.added.length + built.lost.length) && figs.every((f) => /data-src="home\/us_restaurants\.json:/.test(f) && /data-kind="(counted|worked out)"/.test(f)));
  check("no percent anywhere in the card", !/%/.test(html.replace(/<[^>]+>/g, " ")));
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is four words at most ("${title}")`, title === COPY.home.usRestaurants.kicker.replace("{from}", String(built.from)) && title.split(/\s+/).length <= 4);
  check("one supporting line, the lead's", (html.match(/<p /g) ?? []).length === 1 && html.includes(built.lead.words));
}
```

In `tests/home/how_made.test.ts`, above `import { red, redSummary } from "../../scripts/lib/red";` add:

```ts
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeHowMade } from "../../src/components/spine/home/HomeHowMade";
```

and above `if (failed > 0) {` add:

```ts
/* THE DRAWING (plan Task 14): quiet (no accent), the focal and two ruled rows, no count of countries and no estimates line, every
   figure stamped, one supporting line, the door to About the figures. */
if (built) {
  const html = renderToStaticMarkup(React.createElement(HomeHowMade, { how: built }));
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  check("the section is a box with its id, its figure and its rows", /id="how-made"/.test(html) && /data-archetype="fact-rows"/.test(html) && (html.match(/data-row="/g) ?? []).length === built.rows.length);
  check("no figure in the accent (a quiet section)", !/(?:^|[\s"])text-\[var\(--terra-text\)\]/.test(html));
  const figs = [...html.matchAll(/<[^>]+class="[^"]*\bfig\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  check(`every figure says where it came from (${figs.length})`, figs.length === 1 + built.rows.length && figs.every((f) => /data-src="/.test(f) && /data-kind="counted"/.test(f)));
  check("no count of countries and no estimates line", !/Country pages/.test(text) && !/Outside the UK, these pages print estimates/.test(text));
  check("one supporting line, the focal's", (html.match(/<p /g) ?? []).length === 1 && html.includes(built.notices.words));
  check("the door to About the figures", html.includes(`href="${built.link.href}"`) && html.includes(built.link.label) && /tap-y/.test(html));
  const title = /<h3[^>]*>([^<]*)<\/h3>/.exec(html)?.[1] ?? "";
  check(`the title is the copy's, four words at most ("${title}")`, title === COPY.home.howMade.kicker && title.split(/\s+/).length <= 4);
}
```

Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t14a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t14a.txt`
Expected: a module-not-found error on `HomeUsRestaurants`, `exit 1`.

- [ ] **Step 2: Section 3 drawn**

Create `src/components/spine/home/HomeUsRestaurants.tsx`:

```tsx
/**
 * WHERE US RESTAURANTS GREW AND SHRANK ON THE HOME PAGE (plan 2026-10-08, home sections, section 3): the restaurants the leading metro
 * added, the card's one figure and one of the page's three loud moments (LOUD_SEATS, seat 3), then the five metros that added most
 * and the five that lost most, each its name and its two counts on the site's table of a name and two figures (TiersTable's figures
 * shape, the trade page's team). No new drawing: the reading is two absolutes a row, never a percent (PART 9 clause 15), and a table
 * holds that. Every count from src/lib/home/us_restaurants.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { TiersTable } from "@/components/spine/archetypes/TiersTable";
import { COPY } from "@/lib/spine/copy";
import type { UsRestaurants, UsRestaurantsRow } from "@/lib/home/us_restaurants";

const figures = (rows: UsRestaurantsRow[]) => rows.map((r) => ({ key: r.key, name: r.name, a: r.a, b: r.b, aProv: r.aProv, bProv: r.bProv }));

export function HomeUsRestaurants({ us }: { us: UsRestaurants }) {
  const C = COPY.home.usRestaurants;
  const heads = (name: string) => ({ name, a: String(us.from), b: String(us.to) });
  return (
    <Box id="us-restaurants" className="flex flex-col">
      <Rail icon="trade-restaurant" kicker={C.kicker.replace("{from}", String(us.from))} />
      <Focal figure={us.lead.figure} words={us.lead.words} prov={us.lead.prov} accent />
      <TiersTable heads={heads(C.added)} figures={figures(us.added)} />
      <div className="mt-6">
        <TiersTable heads={heads(C.lost)} figures={figures(us.lost)} />
      </div>
    </Box>
  );
}
```

- [ ] **Step 3: Section 4 drawn**

Create `src/components/spine/home/HomeHowMade.tsx`:

```tsx
/**
 * HOW FIGURES ARE MADE ON THE HOME PAGE (plan 2026-10-08, home sections, section 4): the notices read, at 30 in ink (quiet: no
 * accent), with the technique in its one line, then two ruled rows (FactRows): the names matched of the names the notices held,
 * and the London trade pages whose takings are read from the band counts; no count of countries and no estimates line (his ruling
 * of 2026-10-07: the home's 195 counter is wrong); then one door to About the figures, where every source is named. It stands
 * beside the notebook. Every figure from src/lib/home/how_made.ts, stamped.
 */
import * as React from "react";
import { Box, Rail } from "@/components/spine/kit";
import { Focal } from "@/components/spine/country/focal";
import { FactRows } from "@/components/spine/archetypes/FactRows";
import { COPY } from "@/lib/spine/copy";
import type { HowMade } from "@/lib/home/how_made";

export function HomeHowMade({ how }: { how: HowMade }) {
  return (
    <Box id="how-made" className="flex flex-col">
      <Rail icon="methodology" kicker={COPY.home.howMade.kicker} />
      <Focal figure={how.notices.figure} words={how.notices.words} prov={how.notices.prov} />
      <FactRows rows={how.rows.map((r) => ({ key: r.key, label: r.label, value: r.value, note: r.note, prov: r.prov }))} />
      <div className="mt-3">
        <a href={how.link.href} className="tap-y inline-block text-[length:var(--t-body)] text-[var(--c-ink2)] underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]">{how.link.label}</a>
      </div>
    </Box>
  );
}
```

- [ ] **Step 4: Run the tests and the gates**

Run: `node node_modules/tsx/dist/cli.mjs tests/home/us_restaurants.test.ts > scratchpad/home-sections/t14a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t14a.txt`
Expected: `one figure in the accent, the lead's (1)`, `every figure says where it came from (21)`, `home/us_restaurants: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs tests/home/how_made.test.ts > scratchpad/home-sections/t14b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t14b.txt`
Expected: `every figure says where it came from (3)`, `home/how_made: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c14.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c14.txt` → `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-us-restaurants,home-how-made,archetype-coverage,no-terra-hover,legacy-method-words,no-hardcoded-place,no-hardcoded-hex,type-ladder,width-discipline,distance-ladder,one-display,layering,counts-fresh > scratchpad/home-sections/g14.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g14.txt`
Expected: `Passed: 13`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/components/spine/home/HomeUsRestaurants.tsx src/components/spine/home/HomeHowMade.tsx tests/home/us_restaurants.test.ts tests/home/how_made.test.ts scripts/gates.json
git commit -m "Sections 3 and 4 drawn: the leading metro's count added in the accent over two tables of two counts; the notices, the match rate and the trade pages, no count of countries (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 15: the home wired, its shape held, the census written, the home rendered

**Files:**
- Modify: `src/components/spine/home/home-view.tsx` (header, imports, `LOUD_SEATS`, `HomeCities`, `Notebook`'s comment, the
  builders, the zones)
- Modify: `src/lib/spine/copy.ts:2736` (`worldLabel`)
- Modify: `tests/trust/home_shape.test.ts` (rewritten)
- Modify: `scripts/prebuild_all.ts` (the `home-shape` comment); generated `scripts/gates.json`, `CLAUDE.md`, `docs/loop/CENSUS.md`
  and `E:/atlas/design/loop/build/PAGES.md` (committed in Task 17)

- [ ] **Step 1: Write the failing shape**

Replace the whole of `tests/trust/home_shape.test.ts` with:

```ts
/**
 * THE REBUILT HOME'S SHAPE (his instruction of 2026-10-07: "reform home drastically"; he called the live home "catastrophically
 * bad"; his section ideas of 2026-10-08, plan docs/superpowers/plans/2026-10-08-home-sections/PLAN.md). In this order and nothing
 * else: the search (the h1 asks the question, so the picker draws no heading of its own), the UK's three answers, the duel and the
 * kitchens list from the registers, Pro only while the paywall is on, then three levels of two halves each: where new firms last
 * beside the UK's city pages held still (his refusal of carousels and pagination, 2026-09-22), where new companies open beside
 * where US restaurants grew and shrank, and how figures are made beside the notebook, last. Every level but the search is a pair:
 * the section-bands gate bars a full-width section that is not the hero, and the baseline may only come down. The UK's cities' level
 * and the last level end level (`even`), each half filling the height the pair is given; the world level does not (open sections,
 * each its own height). No counts of what the atlas holds (its cities count took in the non-UK city pages, which are not indexed)
 * and no newsletter band (the footer's bar asks once). The live home keeps the picker's heading. Read from
 * src/components/spine/home/home-view.tsx, src/app/page.tsx and src/components/NavigatorForm.tsx, and from the harness render
 * scratchpad/harness/pages/home-gb.html where it exists.
 * Run: npx tsx tests/trust/home_shape.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync } from "node:fs";
import { CityCards } from "../../src/components/spine/archetypes/CityCards";
import { buildCityCards } from "../../src/lib/spine/city_cards";

let failed = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const view = readFileSync("src/components/spine/home/home-view.tsx", "utf8");
const live = readFileSync("src/app/page.tsx", "utf8");
const picker = readFileSync("src/components/NavigatorForm.tsx", "utf8");

/* THE ZONE ORDER, as the body lists its zones (each `key:` inside the `zones` array of SpineHomeBody). */
const body = /const zones[\s\S]*?\n  \];/.exec(view)?.[0] ?? "";
const keys = [...body.matchAll(/\bkey: "([a-z-]+)"/g)].map((m) => m[1]);
const want = ["search", "answers", "registers", "cities", "world", "method"];
check(`the zones run search, answers, registers, the UK's cities, beyond the UK, then how figures are made (read: ${keys.join(", ") || "none"})`, JSON.stringify(keys.filter((k) => k !== "pro")) === JSON.stringify(want));
const pro = keys.indexOf("pro");
check("Pro, where it is listed, stands after the registers and before the UK's cities, behind the paywall's switch", pro === -1 || (pro > keys.indexOf("registers") && pro < keys.indexOf("cities") && /isPaywallOn\(\) \? \[\{ key: "pro"/.test(body)));
/* THE THREE PAIRS (section-bands: no section but the hero spans the page, and the home's baseline is 0). */
const levelOf = (key: string) => new RegExp(`key: "${key}",\\s*split: "([^"]+)"[\\s\\S]*?body: (\\[[^\\n]*\\])`).exec(body);
const PAIRS: Array<[string, string, string]> = [["cities", "<HomeFirmsLast", "<HomeCities"], ["world", "<HomeNewCompanies", "<HomeUsRestaurants"], ["method", "<HomeHowMade", "<Notebook"]];
for (const [key, first, second] of PAIRS) {
  const m = levelOf(key);
  check(`the ${key} level is two halves, ${first.slice(1)} then ${second.slice(1)}, never a wide zone (read: split ${m?.[1] ?? "none"})`, !!m && m[1] === "1-1" && m[2].indexOf(first) !== -1 && m[2].indexOf(second) > m[2].indexOf(first));
}
/* The bars' call is one line, and its props hold an arrow (`=>`), so the read runs to the line's end, not to the first `>`. */
check("the UK's cities' level ends level while both draw, the bars and the city rows filling their halves", /key: "cities",[\s\S]*?even: !!\(last && cities\)/.test(body) && /<CityCards\s+still\s+stack\s+fill\b/.test(view) && /<BarList [^\n]*\sfill\s/.test(readFileSync("src/components/spine/home/HomeFirmsLast.tsx", "utf8")));
const world = /key: "world",[\s\S]*?body: \[[^\n]*\]/.exec(body)?.[0] ?? "";
check("the world level is not stretched (open sections, each its own height)", world.length > 0 && !/even:/.test(world));
check("the last level ends level while both draw, and the notebook's list fills its half in equal rows", /key: "method",[\s\S]*?even: !!\(howMade && notebook\.length\)/.test(body) && /<ul className="[^"]*\bflex-1\b[^"]*\bmd:auto-rows-fr\b[^"]*">/.test(view));

/* NO NEWSLETTER BAND. */
check("the rebuilt home draws no HomeNewsletter", !/HomeNewsletter/.test(view));

/* THE UK'S CITIES HELD STILL: the home's CityCards is the still row, given no pager labels, and the still row draws no control. */
const cities = /function HomeCities[\s\S]*?\n\}/.exec(view)?.[0] ?? "";
check("the cities zone draws CityCards `still`, with no pager labels and no carousel", /<CityCards\s+still\b/.test(cities) && !/prevLabel|nextLabel|CardPager|[Cc]arousel/.test(cities));
check("the home's cities take the row form at every width (`stack`), as a half cannot hold a row of tall cards", /<CityCards\s+still\s+stack\b/.test(cities));
const gb = buildCityCards("GB");
const stacked = gb ? renderToStaticMarkup(React.createElement(CityCards, { still: true, stack: true, cards: gb.cards, basis: "basis" })) : "";
check("CityCards still + stack draws every city once, as a row (one anchor a city), no tall card and no button", !!gb && (stacked.match(/<a /g) ?? []).length === gb.cards.length && !/data-still=/.test(stacked) && !/<button/.test(stacked) && /data-form="rows"/.test(stacked) && /\bgap-2\b/.test(stacked));
const still = gb ? renderToStaticMarkup(React.createElement(CityCards, { still: true, cards: gb.cards, basis: "basis" })) : "";
/* The still row writes each city in both of its forms (the row form below 1024, the tall card from it; the width picks one), so a
   city is counted once, by its id, and each form is held to every city. */
const form = (name: "row" | "tall") => new Set([...(new RegExp(`data-still="${name}"[\\s\\S]*?(?=data-still="|<p class=)`).exec(still)?.[0] ?? "").matchAll(/data-card="([^"]+)"/g)].map((m) => m[1]));
const drawn = form("tall").size;
check(`the still row draws every UK city page at once (${drawn} of ${gb?.cards.length ?? 0}) and no button`, !!gb && gb.cards.length > 0 && drawn === gb.cards.length && !/<button/.test(still));
check(`the still row's row form, drawn below 1024, holds every city too (${form("row").size} of ${gb?.cards.length ?? 0}), hidden from 1024`, !!gb && form("row").size === gb.cards.length && /data-still="row"[^>]*\blg:hidden\b/.test(still) && /data-still="tall"[^>]*\bhidden\b[^>]*\blg:flex\b/.test(still) && !/lg:flex-nowrap|flex-wrap/.test(still));
check("the still row draws no link to the world's list, so CityCards asks for no allHref", !/CityCards[^]*?allHref/.test(cities) && /allHref\?: string/.test(readFileSync("src/components/spine/archetypes/CityCards.tsx", "utf8")));

/* NO "WHAT THE ATLAS HOLDS" COUNTS. */
check("no counts zone (no AtlasHolds, buildAtlasHolds, ledger counts or COPY.home.atlas)", !/AtlasHolds|buildAtlasHolds|atlas_ledger|getAtlasLedger|What the atlas holds|COPY\.home\.atlas\b/.test(view));

/* THE THREE LOUD MOMENTS: the UK's answer, and the leads of sections 1 and 3, each declared LIT with its card's id. */
const seats = /export const LOUD_SEATS = \[[\s\S]*?\] as const/.exec(view)?.[0] ?? "";
check("three loud moments declared LIT: the UK's answer, where new firms last, the US restaurants", (seats.match(/state: "LIT"/g) ?? []).length === 3 && /card: "00 answer"/.test(seats) && /id: "firms-last"/.test(seats) && /id: "us-restaurants"/.test(seats));

/* THE PICKER'S HEADING: off on the rebuilt home, on (the default) on the live home. */
check("the rebuilt home renders the picker without its heading", /<NavigatorForm showHeading=\{false\} \/>/.test(view));
check("the live home renders the picker with its heading", /<NavigatorForm \/>/.test(live) && !/<NavigatorForm[^>]*showHeading=\{false\}/.test(live));
check("the picker's heading is drawn by default and only when asked", /showHeading = true/.test(picker) && /\{showHeading \? \(/.test(picker) && /Pick a country, a city, and a business\./.test(picker));

/* THE RENDER, where the harness wrote it (pages-fresh renders it first in the chain). */
const render = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (render) {
  const labels = [...render.matchAll(/<section data-zone="[^"]*"(?: data-tone="[^"]*")? data-zone-label="([^"]*)"/g)].map((m) => m[1].replace(/&#x27;/g, "'"));
  check(`the render's zones run in that order (${labels.join(" | ")})`, JSON.stringify(labels.filter((l) => l !== "Pro")) === JSON.stringify(["Search", "The UK's answers", "From the registers", "The UK's cities", "Beyond the UK", "How figures are made"]));
  const zoneOf = (label: string) => { const at = render.indexOf(`data-zone-label="${label.replace(/'/g, "&#x27;")}"`); if (at < 0) return ""; const next = render.indexOf("<section data-zone", at + 1); return render.slice(at, next < 0 ? undefined : next); };
  const pair = (label: string, a: string, b: string) => new RegExp(`<section data-zone="1-1"[^>]*data-zone-label="${label.replace(/'/g, "&#x27;")}"`).test(render) && zoneOf(label).indexOf(a) !== -1 && zoneOf(label).indexOf(b) > zoneOf(label).indexOf(a);
  check("the render's UK cities level holds where new firms last, then the city pages, side by side", pair("The UK's cities", 'id="firms-last"', 'id="cities"'));
  check("the render's world level holds where new companies open, then the US restaurants, side by side", pair("Beyond the UK", 'id="new-companies"', 'id="us-restaurants"'));
  check("the render's last level holds how figures are made, then the notebook, side by side", pair("How figures are made", 'id="how-made"', "data-notebook"));
  check("no zone of the page is a wide zone but the search", [...render.matchAll(/<section data-zone="wide"/g)].length === 1);
  check("the render prints no picker heading, no counts and no newsletter form", !/Pick a country, a city, and a business\./.test(render) && !/What the atlas holds|atlas_ledger\.ts:/.test(render) && !/Notify me when my city/.test(render));
  check("the render's cities zone carries no pager", !/aria-label="(Previous cities|More cities)"/.test(render));
} else console.log("NOTE  scratchpad/harness/pages/home-gb.html is not rendered here; the render's checks did not run");

if (failed > 0) { console.error(`trust/home_shape: ${failed} failure(s). Remedy: keep src/components/spine/home/home-view.tsx to the zones search, answers, registers, (pro), then three pairs at split 1-1, never a wide zone (the section-bands gate bars a full width that is not the hero): cities [<HomeFirmsLast> | <HomeCities>] even while both draw, world [<HomeNewCompanies> | <HomeUsRestaurants>] not even, method [<HomeHowMade> | <Notebook>] even while both draw; three LIT seats (00 answer, firms-last, us-restaurants); no HomeNewsletter and no counts section; its cities a <CityCards still stack fill> with no pager labels and its picker <NavigatorForm showHeading={false} />; keep <NavigatorForm /> with its heading in src/app/page.tsx and the heading behind showHeading (default true) in src/components/NavigatorForm.tsx; then render the home (bash scratchpad/reform/render_some.sh "home gb") and run npx tsx tests/trust/home_shape.test.ts`); process.exit(1); }
console.log("trust/home_shape: all pass");
```

Run: `node node_modules/tsx/dist/cli.mjs tests/trust/home_shape.test.ts > scratchpad/home-sections/t15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t15.txt`
Expected: FAIL lines on the zone order, the three pairs, the `fill`, the seats and the render's zones, `exit 1`.

- [ ] **Step 2: The world level's label**

In `src/lib/spine/copy.ts`, below `    citiesLabel: "The UK's cities",` add:

```ts
    /** The level of sections 2 and 3 (plan 2026-10-08, home sections): a data attribute the checks read, not a word the page prints. */
    worldLabel: "Beyond the UK",
```

- [ ] **Step 3: Wire the view**

In `src/components/spine/home/home-view.tsx`:

(a) Replace, in the header:

```
 * kitchens list from the registers (P36.2, P36.2b); Pro said once and quietly while the paywall's switch is on (step 35); and the
 * last level, two halves: the UK's city pages, still, every one at once (step 35), beside the notebook (step 36). The cities stood
 * third and alone across the level until the visual gates' finding of 2026-10-07 (HomeCities says why). Gone that day: the counts
```

with:

```
 * kitchens list from the registers (P36.2, P36.2b); Pro said once and quietly while the paywall's switch is on (step 35); then,
 * since his section ideas of 2026-10-08 (plan docs/superpowers/plans/2026-10-08-home-sections/PLAN.md), three levels of two
 * halves: where new firms last beside the UK's city pages, still, every one at once (step 35); where new companies open beside
 * where US restaurants grew and shrank; and how figures are made beside the notebook (step 36), last. The cities stood
 * third and alone across the level until the visual gates' finding of 2026-10-07 (HomeCities says why). Gone that day: the counts
```

(b) Below `import { buildNotebook, type NotebookCard } from "@/lib/home/notebook";` add:

```tsx
import { HomeFirmsLast } from "./HomeFirmsLast";
import { buildFirmsLast } from "@/lib/home/firms_last";
import { HomeNewCompanies } from "./HomeNewCompanies";
import { buildNewCompanies } from "@/lib/home/new_companies";
import { HomeUsRestaurants } from "./HomeUsRestaurants";
import { buildUsRestaurants } from "@/lib/home/us_restaurants";
import { HomeHowMade } from "./HomeHowMade";
import { buildHowMade } from "@/lib/home/how_made";
```

(c) Replace the whole `LOUD_SEATS` block (lines 46 to 56 at 31cba903): from the comment opening
` * THE THREE LOUD MOMENTS (MODEL.md PART 6; the masterplan's step 32: the UK's answer at 40, the search's button, the Pro band's`
(its `/**` line included) through `] as const satisfies readonly LoudSeat[];`, with:

```tsx
/**
 * THE THREE LOUD MOMENTS (MODEL.md PART 6; masterplan step 32, and plan 2026-10-08, home sections): the UK's answer at 40 (step
 * 34), and two figures that each lead a measured ranking, the reason his featuring rule asks for: the UK city whose new firms last
 * longest, and the US metro that added the most full-service restaurants, each at 30 in the accent (Focal's `accent`). Quiet cards
 * stand between them (the years, the trades, the duel, the kitchens; the city rows, the new companies), PART 6's two at the least.
 * The search's button keeps the brand red his ruling of 2026-08-09 chose over the accent's orange, and the Pro band is quiet by
 * ruling 23 (masterplan step 37): neither is a seat any more. Literals only, read from source (src/lib/spine/loud_seats.ts says why).
 */
export const LOUD_SEATS = [
  { seat: 1, card: "00 answer", figure: "the UK's total effective tax burden on a sole trader's profit, at 40", state: "LIT", condition: "masterplan step 34: the same figure /gb's masthead prints (buildHeroBoard), `--terra-text` at 40, the page's only 40" },
  { seat: 2, card: "firms-last", id: "firms-last", figure: "of 100 firms born in the cohort, those still trading five years on, in the UK city that leads, at 30", state: "LIT", condition: "plan 2026-10-08, home sections, section 1: the city leads a measured ranking of the UK's cities (buildFirmsLast; a tie features nobody and the section is not drawn), `--terra-text` at 30 through Focal's accent" },
  { seat: 3, card: "us-restaurants", id: "us-restaurants", figure: "the full-service restaurants the leading US metro added since the first year on disk, at 30", state: "LIT", condition: "plan 2026-10-08, home sections, section 3: the metro leads a measured ranking of 44 by restaurants added (buildUsRestaurants; a tie features nobody and the section is not drawn), `--terra-text` at 30 through Focal's accent" },
] as const satisfies readonly LoudSeat[];
```

(d) In `HomeCities`, replace `   tall law exempts, at every width. */` with:

```
   tall law exempts, at every width. BESIDE WHERE NEW FIRMS LAST since plan 2026-10-08 (the notebook moved to the last level),
   the rows share the height the pair is given (`fill`), as the bars beside them do, so neither half stands a blank foot. */
```

and replace `      <CityCards still stack cards={cards.cards.map((c) => ({ ...c, region: undefined }))} basis={COPY.cityCards.plain.basis} />` with
`      <CityCards still stack fill cards={cards.cards.map((c) => ({ ...c, region: undefined }))} basis={COPY.cityCards.plain.basis} />`.

(e) In the `Notebook` comment, replace:

```
   it stands in a half beside the UK's cities (the level below), whose rows are one under another an 8 apart, so the two lists run
   down their halves in step, and FILLS ITS HALF: the level ends level (`even`, the zones' rule; his rulings that blank space is a
   fault and that cards in a row share a height), so the section takes the height the cities' rows give the pair, the list takes
```

with:

```
   it stands in a half beside how figures are made (since plan 2026-10-08; beside the UK's cities until then), and FILLS ITS HALF:
   the level ends level (`even`, the zones' rule; his rulings that blank space is a fault and that cards in a row share a
   height), so the section takes the height the pair is given, the list takes
```

(f) Below `  const kitchens = buildKitchens();` add:

```tsx
  const last = buildFirmsLast();
  const newCompanies = buildNewCompanies();
  const usRestaurants = buildUsRestaurants();
  const howMade = buildHowMade();
```

(g) Replace the last zone, from `    /* THE LAST LEVEL: THE UK'S CITIES BESIDE THE NOTEBOOK, two halves (the visual gates' finding of 2026-10-07, section-bands `home``
through its closing `      : []),` (the line before `  ];`), that is:

```tsx
    /* THE LAST LEVEL: THE UK'S CITIES BESIDE THE NOTEBOOK, two halves (the visual gates' finding of 2026-10-07, section-bands `home`
       0 to 1; HomeCities says why). The cities stood alone across the level as the page's third zone, after the answers; a full
       width that is not the hero is what that gate bars, and the two lone sections of the page (these two, the notebook at two
       thirds) pair into the one band the founder's pattern asks for. The pair is read through the zones' own rules, so a level
       with one of the two to draw is a lone section at two thirds (the LONE rule, the notebook's place until now) and a level with
       neither is not listed. The notebook is still the last level (masterplan step 36), and Pro, where it draws, still stands
       after the registers and before it. NO NEWSLETTER BAND AFTER IT (his instruction of 2026-10-07): the footer's newsletter bar
       asks once on every page, and the home's own ask right above it was the same plea twice in a row. The zone is named by its
       first section, as the registers' lone item is (it is a data attribute the checks read, not a word the page prints). */
    ...(cities || notebook.length
      ? [{
          key: "cities",
          split: "1-1" as ZoneSplit,
          even: !!(cities && notebook.length),
          label: cities ? COPY.home.citiesLabel : COPY.home.notebook.title,
          body: [...(cities ? [<HomeCities key="cities" cards={cities} />] : []), ...(notebook.length ? [<Notebook key="notebook" cards={notebook} />] : [])],
        }]
      : []),
```

with:

```tsx
    /* THREE LEVELS OF TWO HALVES (plan 2026-10-08, home sections: his section ideas of that day, the audit's top four; his pattern,
       "never one lone section per horizontal band", 2026-06-18; the section-bands gate bars a full width that is not the hero, and
       the home's baseline is 0). Each is read through the zones' own rules: a level with one of its two to draw is a lone section at
       two thirds (the LONE rule), a level with neither is not listed. Pro, where it draws, still stands after the registers and
       before the first of them. A zone is named by its first section (a data attribute the checks read, not a word the page prints).

       THE UK'S CITIES, AND WHERE THEIR NEW FIRMS LAST (section 1; HomeCities says why the cities stand in a half): the 2019 cohort's
       five-year survival per UK city, its lead one of the page's three loud moments, beside the UK's city pages held still. It ends
       level while both draw (`even`): the bars and the city rows each fill the height the taller gives the pair (`fill`). */
    ...(last || cities
      ? [{
          key: "cities",
          split: "1-1" as ZoneSplit,
          even: !!(last && cities),
          label: COPY.home.citiesLabel,
          body: [...(last ? [<HomeFirmsLast key="firms-last" last={last} />] : []), ...(cities ? [<HomeCities key="cities" cards={cities} />] : [])],
        }]
      : []),
    /* BEYOND THE UK (sections 2 and 3): where new companies open in Latin America and Africa, beside where US restaurants grew and
       shrank; each a published or counted figure, never the site's estimates. Open sections, each its own height (not `even`: a
       stretched list or table would stand a blank at its foot). */
    ...(newCompanies || usRestaurants
      ? [{
          key: "world",
          split: "1-1" as ZoneSplit,
          label: COPY.home.worldLabel,
          body: [...(newCompanies ? [<HomeNewCompanies key="new-companies" nc={newCompanies} />] : []), ...(usRestaurants ? [<HomeUsRestaurants key="us-restaurants" us={usRestaurants} />] : [])],
        }]
      : []),
    /* THE LAST LEVEL: HOW FIGURES ARE MADE BESIDE THE NOTEBOOK (section 4; masterplan step 36, the notebook last). The page's one
       place to say how its figures are made; quiet, no accent, no count of countries (his ruling of 2026-10-07: the home's 195
       counter is wrong). It ends level while both draw (`even`): the notebook's posts share the height in equal rows, as they did
       beside the cities. NO NEWSLETTER BAND AFTER IT (his instruction of 2026-10-07): the footer's newsletter bar asks once on every
       page. */
    ...(howMade || notebook.length
      ? [{
          key: "method",
          split: "1-1" as ZoneSplit,
          even: !!(howMade && notebook.length),
          label: howMade ? COPY.home.howMade.kicker : COPY.home.notebook.title,
          body: [...(howMade ? [<HomeHowMade key="how-made" how={howMade} />] : []), ...(notebook.length ? [<Notebook key="notebook" cards={notebook} />] : [])],
        }]
      : []),
```

(h) In `scripts/prebuild_all.ts`, replace:

```ts
  /* His instruction of 2026-10-07, "reform home drastically": the rebuilt home runs search, answers, UK cities (still), registers, notebook; no counts, no newsletter band, no picker heading. */
```

with:

```ts
  /* His instruction of 2026-10-07, "reform home drastically", and his section ideas of 2026-10-08: the rebuilt home runs search, answers, registers, (Pro), then three pairs, where new firms last beside the UK's cities (still), where new companies open beside the US restaurants, how figures are made beside the notebook; no counts, no newsletter band, no picker heading. */
```

- [ ] **Step 4: Typecheck, the census, the counts**

Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/home-sections/tsc15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/tsc15.txt`
Expected: `exit 0`, no error line.
Run: `node node_modules/tsx/dist/cli.mjs scripts/harness/census.ts --write > scratchpad/home-sections/census15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/census15.txt`
Expected: `exit 0`; `git diff docs/loop/CENSUS.md` shows the home's rows `firms-last` (bar-list), `new-companies` (mark-list),
`us-restaurants` (tiers-table), `how-made` (fact-rows) and its ledger "Loud today: 3 of 3".
Run: `node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write > scratchpad/home-sections/c15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/c15.txt` → `exit 0`.

- [ ] **Step 5: Render the home and hold its shape**

Run: `bash scratchpad/reform/render_some.sh "home gb" > scratchpad/home-sections/render15.txt 2>&1`
Expected (read the file): `rendered: home gb`, no `FAILED:` line (one that failed for memory: wait 60 s and render it again).
Run: `node node_modules/tsx/dist/cli.mjs tests/trust/home_shape.test.ts > scratchpad/home-sections/t15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/t15.txt`
Expected: every line PASS, `the render's zones run in that order (Search | The UK's answers | From the registers | The UK's cities |
Beyond the UK | How figures are made)`, `trust/home_shape: all pass`, `exit 0`.
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=home-shape,home-answers,home-bands,home-duel,home-kitchens,home-firms-last,home-new-companies,home-us-restaurants,home-how-made,census-fresh,archetype-coverage,layering,no-hardcoded-place,no-terra-hover,no-em-dashes,no-source-agencies,copy-no-method-words,legacy-method-words,counts-fresh > scratchpad/home-sections/g15.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g15.txt`
Expected: `Passed: 19`, `Failed: 0`, `SUBSET: PASS`.

- [ ] **Step 6: Commit**

```bash
git add src/components/spine/home/home-view.tsx src/lib/spine/copy.ts tests/trust/home_shape.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md docs/loop/CENSUS.md
git commit -m "The home wired: three pairs after the registers (firms last | cities, new companies | US restaurants, how figures are made | notebook), three loud moments, the shape held (plan 2026-10-08, home sections)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

## Task 16: the fresh home under its browser gates, the chain's subset, the typecheck

- [ ] **Step 1: The render is the wired home's**

Run: `node -e "const s=require('fs').readFileSync('scratchpad/harness/pages/home-gb.html','utf8');for(const t of ['id=\"firms-last\"','id=\"new-companies\"','id=\"us-restaurants\"','id=\"how-made\"','data-form=\"groups\"'])console.log(s.includes(t)?'PRINTS':'ABSENT',t)" > scratchpad/home-sections/r16.txt 2>&1`
Expected: five `PRINTS` lines. (If an `ABSENT` shows, render again: `bash scratchpad/reform/render_some.sh "home gb"`.)

- [ ] **Step 2: The seven named browser gates on the home, one at a time**

Create `scratchpad/home-sections/pages.json`:

```json
{
  "why": "The home page alone, for one hand run of loud-seats (plan 2026-10-08, home sections); the chain never reads it.",
  "pages": [{ "surface": "home", "slugs": ["gb"] }]
}
```

Run each, then read its file:

```bash
node scripts/harness/check_page_laws.mjs scratchpad/harness/pages/home-gb.html > scratchpad/home-sections/page_laws.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/page_laws.txt
node scripts/harness/check_copy_plain.mjs scratchpad/harness/pages/home-gb.html > scratchpad/home-sections/copy_plain.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/copy_plain.txt
node scripts/harness/check_readability.mjs scratchpad/harness/pages/home-gb.html > scratchpad/home-sections/readability.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/readability.txt
node scripts/harness/check_page_holes.mjs scratchpad/harness/pages/home-gb.html > scratchpad/home-sections/page_holes.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/page_holes.txt
node scripts/harness/check_model_laws.mjs scratchpad/harness/pages/home-gb.html > scratchpad/home-sections/model_laws.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/model_laws.txt
node node_modules/tsx/dist/cli.mjs scripts/verify_loud_seats.mjs --list=scratchpad/home-sections/pages.json > scratchpad/home-sections/loud_seats.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/loud_seats.txt
node scripts/verify_section_bands.mjs > scratchpad/home-sections/section_bands.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/section_bands.txt
node scripts/verify_gathered_emptiness.mjs > scratchpad/home-sections/gathered.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/gathered.txt
```

Expected, each against the home's baselines (no entry, so zero; model laws 0):
- page laws: `page laws: 1 page(s) x 3 widths, 0 red(s)`, `exit 0`.
- copy plain: `copy plain: 1 page(s) x 2 widths, 0 red(s) (none)`, `exit 0` (four titles of four words, one line a card).
- readability: `readability: 1 page(s) x 3 widths, 0 red(s)`, `exit 0`.
- page filter: `page holes: 1 page(s) x 3 widths, 0 red(s)`, `exit 0` (it rewrites `scratchpad/harness/accents.json`; the chain's
  next run writes it back).
- model laws: `model laws: 1 page(s) x 3 widths, 0 red(s)`, `exit 0`.
- loud-seats: `ok loud-seats: 1 renders at 1280, 3 accent figures, every one a seat declared LIT and every LIT seat lit or withheld
  (3 declared LIT, 0 withheld on these renders)`, `exit 0`.
- section-bands: `PASS verify_section_bands.`, `exit 0`; gathered-emptiness: `PASS verify_gathered_emptiness. ...`, `exit 0`.

Any red is this plan's: fix the card it names under its law (a line past twelve words, a figure without a stamp, a foot left
blank) and run again; never raise a baseline.

- [ ] **Step 3: The chain's render readers and the home's gates**

Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=doors,harness-archetypes,harness-page-filter,harness-page-laws,harness-copy-plain,harness-readability,harness-laws,harness-links,page-foot,provenance,floor-census-fresh,loud-seats,section-bands,art-direction,gathered-emptiness,fullwidth-sitewide,radius-uniform,flag-marks,no-phone-sideways,form-variety,frost-reads,interact,paragraph-budget,no-caps-labels,distance-ladder > scratchpad/home-sections/g16a.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g16a.txt`
Expected: `Passed: 25`, `Failed: 0`, `SUBSET: PASS` (the other pages' renders are the latest chain run's; this plan's shared-form props
were proven byte-identical where not passed, Tasks 7 and 8).
Run: `node node_modules/tsx/dist/cli.mjs scripts/prebuild_all.ts --concurrency=1 --no-bail --only=census-fresh,archetype-copy,model-laws-copy,archetype-coverage,type-ladder,width-discipline,no-terra-hover,no-em-dashes,no-source-agencies,layering,no-hardcoded-place,copy-no-method-words,legacy-method-words,no-place-words,uk-sources,uk-registers,home-answers,home-bands,home-duel,home-kitchens,home-shape,home-firms-last,home-new-companies,home-us-restaurants,home-how-made,counts-fresh,single-gate-chain,gate-reds-ratchet,gate-conflicts,no-parent-repo-reads > scratchpad/home-sections/g16b.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/g16b.txt`
Expected: `Passed: 30`, `Failed: 0`, `SUBSET: PASS`.

- [ ] **Step 4: The typecheck**

Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p . > scratchpad/home-sections/tsc16.txt 2>&1; echo "exit $?" >> scratchpad/home-sections/tsc16.txt`
Expected: `exit 0`, no error line.

Nothing is committed in this task. The whole chain (`npm run verify:deploy`, which re-renders every page) before any push is the
controller's, on his word for the deploy.

---

## Task 17: the records

**Files:**
- Modify: `E:/atlas/design/loop/build/QUEUE.md` (a new section K at the end)
- Commit: `E:/atlas/design/loop/build/PAGES.md` (written by Task 15's census)

- [ ] **Step 1: The queue**

At the end of `E:/atlas/design/loop/build/QUEUE.md`, add (the two hashes from `git log --oneline`, the first and the last commit of
Tasks 1 to 15):

```
## K. The home's new sections, from his ideas of 2026-10-08 (website branch whats-left)

| id | kind | title | done means | status |
|---|---|---|---|---|
| home:firms-last | SECTION | where new firms last, the UK's cities (his "Midtier city opportunities", the UK's part) | the 2019 cohort's five-year survival per UK city with a page, from the business demography tables through website scripts/data/home/export_home.py; Birmingham held out on the publisher's star, its reason in the slice, never printed; the lead city in the accent; gate home-firms-last | DONE, built on whats-left <first>..<last> (plan website docs/superpowers/plans/2026-10-08-home-sections/PLAN.md); NOT pushed, his word for the deploy |
| home:new-companies | SECTION | where new companies open, Latin America and Africa (his "LATAM Gems", "Best of Africa", "Rising stars" folded in) | one measure (new limited companies per 1,000 of working age), one year worked out from the series, each region ranked within itself, a labour-force floor with its reason, five a region drawn with flag and name and the rest behind the plus, the UK's own figure for scale; gate home-new-companies | DONE, built on whats-left <first>..<last>; NOT pushed |
| home:us-restaurants | SECTION | where US restaurants grew and shrank (his "US biggest winners and losers") | one trade (full-service restaurants), 45 metros read and 44 ranked (Detroit held out with its reason), the first and the last year on disk, the five that added most and the five that lost most by the count, two counts a row, never a percent, the leader's count added in the accent; gate home-us-restaurants | DONE, built on whats-left <first>..<last>; NOT pushed |
| home:how-made | SECTION | how figures are made (his "deep techniques" and "archival capability", merged) | the notices read and their match rate, the London trade pages read from the band counts, a door to About the figures; no count of countries and no estimates line; global coverage: not built (his 2026-10-07 ruling on the 195 counter); quiet; gate home-how-made | DONE, built on whats-left <first>..<last>; NOT pushed |
| home:hotels | SECTION | hotels in six cities (his idea of 2026-10-08) | London's hotel boroughs from the register slice the site holds now (turnover.json hotels-lodging, under "hotels and similar accommodation"); the six US metros with published 2022 hotel receipts after one export from the 2022 economic census, sector 72; never London against the US on one scale | TODO (NEXT: the home's next round, M) |
| home:tax-burdens | DATA | high tax burdens in global cities: New York, London, Los Angeles | a US sole-trader engine (federal brackets, self-employment tax, New York's and California's brackets, New York City's resident tax and unincorporated business tax), so every row is worked out on one basis as the UK's is | DATA (not built: only the UK's figure is worked out from the law; New York and Los Angeles would print the same typed rate) |
| home:rising-stars | RULING | rising stars countries | none as worded | CUT (the site's growth field is a fill; the risers in the new-company series are registration hubs and series breaks; "star" is a verdict; its honest part is home:new-companies) |
| home:underserved | RULING | underserved realities: six cities short of businesses (Calgary, Tromso) | the within-country form only (fewest businesses per 10,000 residents from one register), once populations are on disk | CUT as worded (the premise fails on Norway's register; "harsh climate" and "culturally bland" are causes and verdicts no figure shows; Calgary against Tromso is not like for like) |
| home:restaurants-four-cities | DATA | restaurants in Rome, Paris, New York and London | a counted figure for Paris and for Rome on disk | DATA (nothing counted for either on disk; the London and New York pair is two statistics in two currencies and repeats the duel, the kitchens and the trades answer) |
| home:cash-flow | DATA | industries' "cash flow masters" | a cash measure by trade (the filed accounts on disk hold cash and debtors, and micro-entities file no profit and loss, so no ratio to turnover) | DATA (no cash measure on the site) |
| home:context-dependent | RULING | industries "context dependent" | none | CUT (not a measure) |
| home:archive-claim | RULING | "unmatched archival capability" as worded | none | CUT as worded ("unmatched" is a claim no figure proves; its honest half, the records read, is home:how-made's figure) |
| home:midtier-abroad | DATA | Austin, Lublin and Malaga beside Leeds | Lublin and Malaga need city pages and a current city source (the regional tables on disk are provinces and end in 2020); Austin stands only on home:us-restaurants' measure | DATA |
| home:mark-list-groups-story | SYSTEM | MarkList's grouped form (plan 2026-10-08) has no story on the archetype sheet; the home render's gates hold it | a story keyed like the sheet's others, the archetype harness's rules over it | TODO (found by plan 2026-10-08; LATER, S) |
```

- [ ] **Step 2: Commit the design repo's records**

```bash
git -C E:/atlas add design/loop/build/QUEUE.md design/loop/build/PAGES.md
git -C E:/atlas commit -m "QUEUE: the home's four new sections DONE on whats-left (plan 2026-10-08, home sections); hotels next; his other ideas each with its reason; PAGES.md's census with the home's three loud moments" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: Report**

Report the commits, the seven browser gates' lines from Task 16 Step 2, the two subsets' `Passed: 25` and `Passed: 30`, the
typecheck, the render at `scratchpad/harness/pages/home-gb.html`, and that nothing was pushed. The deploy is his word.

---

## Out of scope, named

- **Rising stars countries:** the site's growth field is a fill (31 countries at 1.7 percent); the 2017 to 2022 risers in the
  new-company series are registration hubs and a series break; "star" is a verdict. Folded into section 2.
- **Underserved realities (Calgary, Tromso):** the premise fails on Norway's register (Tromso in line with its peers); climate and
  blandness are causes and verdicts no figure shows; the within-country form needs populations not on disk.
- **High tax burdens (New York, London, Los Angeles):** only the UK's figure is worked out from the law; the other two would print
  one typed rate; needs a US sole-trader engine.
- **Restaurants in Rome, Paris, New York and London, and the London and New York pair:** nothing counted for Paris or Rome on disk;
  the pair is two statistics in two currencies and repeats the duel, the kitchens and the trades answer.
- **Cash flow masters:** no cash measure on the site; the filed accounts on disk give none for micro-entities.
- **"Unmatched archival capability" as worded:** a claim no figure proves; its honest half is section 4's notices.
- **Section for the global coverage:** not built. The owner called the home's 195 counter wrong on 2026-10-07 (`FOUNDER-VERDICTS.md`,
  "the picker's count is wrong"), and that night's fix took every count off the home; printing 195 again, whatever its note,
  brings back the number he rejected. Section 4 prints no count of countries and no estimates line (decision 8).
- **"Context dependent":** not a measure.
- **Austin, Lublin, Malaga:** no city page or current city source for the two European cities; Austin only on section 3's measure.
- **The economy's real growth beside section 2** (the audit's suggestion for "rising stars"): a second figure on a quiet card; not
  asked for in the brief.
- **Hotels in six cities:** buildable (London's hotel boroughs now, six US metros after one export); the next round (QUEUE
  `home:hotels`).
- **A story for MarkList's grouped form** on the archetype sheet (QUEUE `home:mark-list-groups-story`).
- **Adding the new data folder to the free data pack, or the new sources to the pack's README:** the pack is the UK registers'; not
  touched.
