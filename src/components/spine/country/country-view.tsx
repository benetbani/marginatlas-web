/**
 * Country page , SPINE rebuild BODY (SpineCountryBody).
 *
 * The body/route split every other spine page type already uses: the live route
 * (src/app/[country]/page.tsx) mounts this with the REAL seed from
 * buildSpineCountrySeed, so the country page stops rendering the bundled
 * illustrative GB sample the moment its flag is ever opened. Next forbids
 * arbitrary named exports and custom props on a route file, so the body lives
 * here as a plain module and the route imports it.
 *
 * TASK 10 BUILT THE MASTHEAD. Tasks 11 to 18 append the remaining sections, one
 * per task, each with its own form from the kit and its own entry in
 * RAIL_SECTIONS below. The flag stays shut until the page is whole: a page with
 * one section must never be reachable, and isSpineReformEnabledFor("country")
 * returns false with the master switch unable to open it.
 *
 * Null-guarded like its siblings: every section added here early-returns null
 * when its block is absent, so an omitted field renders NOTHING rather than a
 * zero, an "undefined" or a broken frame. The adapter self-omits whole blocks,
 * so those guards are load-bearing on every section from this one onward.
 *
 * Does NOT wrap itself in SpineShell; the route wraps it, matching the city
 * body. No em-dashes, no raw hex, tokens only.
 *
 * The honesty marker (rulebook 4A) is wired in the masthead below, so the
 * illustrative bundled country seeds (src/lib/spine-seeds/countries/*.json, all
 * "modeled" or "placeholder") now resolve to a file that actually carries it and
 * verify_sample_tags.ts passes on its own logic. The Task 9 `allow-unmarked`
 * exemption that recorded the gap is gone with the gap.
 */
import * as React from "react";
import { Band, Box, Fig, Rail, SampleTag, SpectraTable, usd } from "@/components/spine/kit";
import { RangeBracket, RankedTiles } from "@/components/spine/forms-v2";
import { AtlasMark } from "@/components/spine/marks";
import { CityCardsPager } from "@/components/spine/country/city-cards";
import { SetupTiers } from "@/components/spine/country/setup-tiers";
import { CountryFlag } from "@/components/CountryFlag";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * The on-this-page rail's entries, in page order, and the ONE list that says
 * what this page is made of. A section task appends its own entry here in the
 * same change that mounts the section, so the rail can never promise a section
 * that is not there (a dead in-page link fails to scroll and reads as missing
 * content, which is worse than a 404 because nothing tells the reader).
 */
const RAIL_SECTIONS: Array<{ id: string; label: string }> = [
  { id: "take", label: "The tax burden" },
  { id: "cities", label: "The cities" },
  { id: "peers", label: "Against the peers" },
  { id: "money", label: "What an owner keeps" },
  { id: "customers", label: "What customers earn" },
  { id: "character", label: "The character" },
  { id: "setup", label: "Registering, by legal form" },
  { id: "premises", label: "What premises cost" },
  { id: "hiring", label: "What staff cost" },
  { id: "locals", label: "What locals know" },
];

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/* THE PRIVATE COPY IS GONE AND THE KIT'S `usd` IS THE EXACT ONE (C29,
   2026-09-02). It was written here because the shared function abbreviated at a
   thousand: four of 198 countries carry a prime rent at or above one, Hong Kong
   at $1,850 printing "$2K", Monaco at $1,437 and Macao and Liechtenstein at about
   $1,200 all printing "$1K". Beside an edge rent of $278 that pair said 3.6 times
   where the truth is 5.2, and this card STATES the ratio, so a rounded figure put
   the drawing and the sentence in open disagreement. The founder ratified the
   grammar on 2026-09-02 and the kit carries it, so the premises card calls `usd`
   directly and no second name for money survives in this file. Every prime rent
   in the atlas is below $10,000, so the collapse changes no figure here. */

/** One published fact from hero.support, shaped as the adapter emits it. */
type SupportFact = { key?: string; label?: string; value?: number; unit?: string; note?: string };

/**
 * The wayfinding rail, and the DEVIATION it carries is recorded rather than
 * silent. The plan asked for this in the shared shell "so every spine page
 * inherits it"; the shared shell also serves four founder-locked pages, and
 * this task must not change them, so the rail is built into the country body
 * alone. When a second page type wants one, it moves up to the shell then.
 *
 * Founder verdict 8 (2026-08-27) is the whole geometry: "it should be shifted a
 * little bit more to the right, and the content should be shifted more to the
 * center. Right now it's a little bit idiotic." Fixed to the viewport's right
 * edge, so it takes NO room from the reading column and the column stays
 * centred on the page rather than pushed left to make space, which is what it
 * did on the legacy page.
 *
 * IT APPEARS ONLY WHERE IT FITS WITHOUT INTRUDING. The column is 1120px; a
 * 1280px viewport leaves 80px of gutter on each side, which is less than this
 * rail needs, so at that width and below it does not render at all. 2xl (1536)
 * leaves 208px a side, and the rail's own right margin plus its measure clears
 * the column's edge with room to spare. There is no width at which it overlaps
 * a figure.
 */
function OnThisPage({ sections }: { sections: Array<{ id: string; label: string }> }) {
  if (sections.length === 0) return null;
  return (
    <nav aria-label="On this page" className="fixed right-6 top-1/2 hidden -translate-y-1/2 2xl:block">
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">On this page</div>
      <ol className="mt-2 space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block max-w-[18ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The masthead , two-sided since the founder's second 2026-08-30 batch:
 * "those eight details that we put a little bit below, they can be put on the
 * right side of this section in two columns and four rows, something that
 * would look nice." LEFT: identity row (mark, flag, name , once), subtitle,
 * the label and the answer with its regime clause. RIGHT: a quiet grid, two
 * columns, no borders and no tiles (his tile ban stands): payroll on wages and
 * sales tax. The remaining slots are reserved for the upkeep and decile figures
 * when their data lands; nothing fills them speculatively.
 *
 * Everything the first batch settled still binds: the answer is the
 * small-business effective rate labelled "Total effective tax burden", the
 * name appears once with its flag, no world-median line, and the SMB rate's
 * modeled confidence keeps the honesty tag on the block.
 *
 * ========= C13, 2026-09-02: THE GRID GIVES UP THE TWO REGISTRATION CELLS =====
 *
 * IT HELD FOUR AND IT HOLDS TWO, and the two that went were stated twice more
 * on this same page. Read off the render: the masthead printed "Time to
 * register 1 day" and "Cost to register Free"; the peers table's home row
 * printed the same pair in its own two columns; the legal-form table's first
 * row printed it a third time. Both figures come from ONE place,
 * `data/legal/business_formation_costs_v1.json`, through
 * `getTypicalFormationCostUsd` and `DAYS_TO_START_BY_ISO2`, and both of those
 * pick the SOLE TRADER tier. So all three cards were printing one tier's pair.
 *
 * WHY THIS CARD IS THE ONE THAT YIELDS, per quantity and measured rather than
 * argued, which is C6's and C9's own test:
 *
 * - THE LEGAL-FORM TABLE CANNOT YIELD EITHER COLUMN. Counted on the file: the
 *   fee differs across tiers in 152 of 152 countries and the filing time in 149
 *   of 152, so both columns carry facts stated nowhere else on almost every
 *   page in the atlas. Its own warrant is what the wall costs, and the cheapest
 *   tier is the base that reading is taken from.
 * - THE PEERS TABLE CANNOT YIELD EITHER COLUMN EITHER, and its home row least
 *   of all: the four peers' fees and filing times appear nowhere else, and a
 *   comparison column with a hole where the reader's own country sits is not a
 *   comparison. It is also the one card on this page the founder praised
 *   unprompted.
 * - THIS GRID HELD NEITHER FACT IN A SET. Two bare figures, no peer beside
 *   them and no form named, which is step 1's duplicate exactly: without them
 *   a reader has to do nothing at all, because two later cards say it better.
 *
 * AND THEY WERE WORSE THAN A DUPLICATE, WHICH IS WHY BOTH WENT RATHER THAN ONE.
 * The band's answer is an ANNUAL burden, "what a small business effectively
 * pays the state", and the two surviving cells exist to stop a reader taking
 * 20% for the whole of it: payroll is a second burden the rate excludes, sales
 * tax is a burden the customer carries. A one-off fee and a filing wait qualify
 * that answer not at all. They also quietly advertise the trap the setup
 * chapter exists to warn against, because the tier they describe is the one
 * with NO liability wall: in Germany this grid would read "$50, 7 days" on a
 * page whose own table shows the company that gives you the wall at $1,500 and
 * three weeks, and the joint-stock form at $12,000 and sixty days.
 *
 * THE PAIR IS NOT SPLIT ACROSS TWO CARDS, and the reason is the grid's own
 * shape as well as the data: at three cells a two-column grid orphans one, so
 * a grid that must lose one of these loses both. The fee and the filing time
 * are also one reading, what it takes to get in the door, and half of it in a
 * band about annual tax is a question raised and not answered.
 *
 * THE SUBTITLE KEEPS ITS PROMISE and is now a POINTER rather than a
 * restatement: it still reads "and what it costs to register one", the page
 * still answers it in the setup chapter, and the on-this-page rail links there.
 * The adapter still emits both support facts, which is right: the hero's
 * confidence is composed from every fact it holds, and the subtitle branches on
 * them. What changed is what this band DRAWS.
 */
function Masthead({ name, iso2, hero }: { name: string; iso2?: string; hero: any }) {
  const eb = hero?.effective_burden;
  const rate = isNum(eb?.rate_pct) ? eb.rate_pct : undefined;
  const payroll = isNum(eb?.payroll_pct) ? eb.payroll_pct : undefined;
  const regime = typeof eb?.regime_name === "string" && eb.regime_name.length > 0 ? eb.regime_name : undefined;

  const facts: SupportFact[] = Array.isArray(hero?.support) ? hero.support : [];
  const factFor = (key: string) => facts.find((f) => f?.key === key && isNum(f.value));
  const days = factFor("register_days");
  const cost = factFor("register_cost");
  const salesTax = factFor("sales_tax");

  const confidence = hero?._meta?.confidence;
  const tagged = typeof confidence === "string" && confidence !== "measured";

  const promises: string[] = [];
  if (rate != null) promises.push("what a small business effectively pays the state");
  if (cost) promises.push("what it costs to register one");
  else if (days) promises.push("how long it takes to register one");
  const subtitle = promises.length > 0 ? `${promises.join(", and ").replace(/^./, (c) => c.toUpperCase())}.` : null;

  /* The right-side grid's cells, each guarding its own field, in his order of
     weight: the payroll burden first (it is a burden, not trivia), then the tax
     the customer carries. Both QUALIFY the answer beside them, which is what
     earns them a place in this band; the two registration cells that used to
     follow did not, and were printed twice more below. See the header, C13. */
  const cells: Array<{ key: string; label: string; value: React.ReactNode; note?: string }> = [];
  if (payroll != null) {
    cells.push({
      key: "payroll",
      label: "Payroll on wages",
      value: <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{payroll}%</Fig>,
      note: "a separate burden, never added to the rate",
    });
  }
  if (salesTax) {
    cells.push({
      key: "sales-tax",
      label: "Sales tax",
      value: <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{salesTax.value}%</Fig>,
      note: "carried by the customer",
    });
  }
  /* NO REGISTRATION CELLS. `days` and `cost` are still read above, because the
     subtitle promises whichever of them the country holds and the page keeps
     that promise in the setup chapter. They are not printed here. */

  return (
    <Band hero>
      <Box id="take">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AtlasMark id="alt-country" size={13} className="opacity-55" />
          {iso2 ? <CountryFlag iso2={iso2} className="w-9 shrink-0" /> : null}
          {/* THE NAMING h1 SITS AT --t-section, WHICH IS THE LADDER'S OWN
              ARITHMETIC AND NOT A PREFERENCE. globals.css derives the 40 ceiling
              in its own words: "Rule 16 wants the answer at 1.6x its supports;
              the page title shares the masthead card with it. 40 over a 24 title
              is 1.67x." At --t-focal this h1 stood at 30 under a 40 answer, which
              is 1.33x at 1280 AND at 375, measured on the render, and 1.33 fails
              step 5's floor. --t-focal is "a section's own focal figure"; a
              country's name is not a figure. C7 settled the identical case on
              the industry masthead. */}
          <h1
            id="headline"
            data-typography="custom"
            className="text-balance text-[length:var(--t-section)] font-semibold leading-[1.05] tracking-tight text-[var(--c-ink)]"
          >
            {name}
          </h1>
          {tagged ? <SampleTag /> : null}
        </div>
        {subtitle ? (
          <p className="mt-1.5 max-w-[52ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">{subtitle}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          {rate != null ? (
            <div>
              <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Total effective tax burden</div>
              <div className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{rate}%</div>
              <div className="mt-2.5 max-w-[40ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">
                on profit, for a small business
                {regime ? (
                  <>
                    {" "}under <span className="text-[var(--c-ink)]">{regime}</span>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
          {cells.length > 0 ? (
            <div className="grid shrink-0 grid-cols-2 gap-x-10 gap-y-4 md:w-[320px]">
              {cells.map((c) => (
                <div key={c.key}>
                  <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{c.label}</div>
                  <div className="mt-1">{c.value}</div>
                  {c.note ? <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{c.note}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Box>
    </Band>
  );
}

/**
 * The cities as a card pager (the map removed by the first 2026-08-30 batch).
 * Second batch: TWO CARDS PER ROW on phones ("on phones we should have two
 * cities in a row instead of one"), and the terminal link deep-links to this
 * country's own cities ("the redirection should put him immediately at the
 * section of the page that has to do with the specific country"). Verdict 6
 * still binds: every card IS its link; a city without a page renders nothing.
 */
function Cities({ cities, iso2 }: { cities: any; iso2?: string }) {
  const list: any[] = Array.isArray(cities?.list) ? cities.list : [];
  const linked = list.filter((c) => typeof c?.href === "string" && c.href.length > 0);
  if (linked.length === 0) return null;

  return (
    <Band>
      <Box id="cities">
        <Rail icon="best-areas" kicker="The cities" />
        {/* On the country's OWN page a disambiguator like "(UK)" is redundant
            by construction, and it truncated to "Birmingham (U..." in the card
            (photographed 2026-08-30), so a trailing parenthetical is dropped. */}
        <CityCardsPager
          cities={linked.map((c) => ({ id: String(c.id), name: String(c.name).replace(/\s*\([^)]*\)\s*$/, ""), region: typeof c.region === "string" ? c.region : undefined, href: c.href }))}
          allHref={iso2 ? `/cities#c-${iso2.toLowerCase()}` : "/cities"}
        />
      </Box>
    </Band>
  );
}

/**
 * The peers table , the section the founder tore apart on the legacy page and
 * the one place besides the hero and the close that may take the full width,
 * declared with data-wide-table so the gate reads a sanction and not a claim.
 *
 * FOUNDER VERDICT 4, 2026-08-27, verbatim: "the flags are very minuscule, which
 * makes it ugly, and the table is just ugly... It shows no character... the
 * lines are botched." So: flags at a size a person can recognise (28x19, the
 * component is rectangular with its own hairline, which is what the flag gate
 * now enforces site-wide), one hairline per row and nothing else, the home row
 * on the soft wash with its name at weight, and per column the BEST value in
 * ink and weight while the rest sit quiet, the same winner convention the
 * district table settled (lower is better in all four columns here, rule 29A
 * inverted burdens read by their best end).
 *
 * The caveat sentence renders visibly under the table: round 4 judged exactly
 * that sentence GOOD on the legacy page ("the honest voice"), and a table
 * caption is table furniture, not the banned chart-sentence.
 *
 * Units ride the values, one convention per column (N5): money as money, days
 * as days, rates as percentages, and a zero registration fee is the word Free
 * in the reading face, never $0, which reads as a missing number.
 */
function Peers({ peers }: { peers: any }) {
  const rows: any[] = Array.isArray(peers?.list) ? peers.list : [];
  if (rows.length < 2) return null;
  const cols: Array<{ key: string; head: string; fmt: (v: number) => React.ReactNode; best: (vs: number[]) => number }> = [
    /* One basis across the whole table (founder 2026-08-30, "apply the
       procedure to the countries"): the same small-business effective rate
       the masthead answer states, from the same module, per peer. */
    { key: "effective_tax_pct", head: "Effective tax", fmt: (v) => <>{v}%</>, best: (vs) => Math.min(...vs) },
    { key: "payroll_pct", head: "Payroll on staff", fmt: (v) => <>{v}%</>, best: (vs) => Math.min(...vs) },
    {
      key: "register_cost_usd",
      head: "Cost to register",
      fmt: (v) => (v === 0 ? <span className="font-medium">Free</span> : <>{usd(v)}</>),
      best: (vs) => Math.min(...vs),
    },
    { key: "register_days", head: "Time to register", fmt: (v) => <>{v} {v === 1 ? "day" : "days"}</>, best: (vs) => Math.min(...vs) },
  ];
  const bestOf: Record<string, number | undefined> = {};
  for (const c of cols) {
    const vs = rows.map((r) => r[c.key]).filter((v: unknown): v is number => isNum(v));
    bestOf[c.key] = vs.length >= 2 ? c.best(vs) : undefined;
  }
  return (
    /* The sanctioned wide-table band: the same bare full-width wrapper the hero
       uses, carrying the attribute the width gate reads. Not a Band split, since
       the table IS the whole band. */
    <div data-wide-table className="mt-8">
      <Box id="peers">
        <Rail icon="benchmark" kicker="Against the peers" />
        {/* LAW M, founder 2026-08-30 verbatim: "no scrolling left and right"
            on a phone. Five columns do not fit 343 pixels and must not
            pretend to, and a sideways swipe is now banned too, so BELOW md
            the table reconfigures to one stacked card per country (rendered
            after the table below); the real table renders from md up. */}
        <div className="hidden md:block">
        <Table className="text-[length:var(--t-micro)]">
          <caption className="sr-only">The same four set-up facts for each country, side by side.</caption>
          <TableHeader>
            <TableRow className="border-[var(--c-border)] hover:bg-transparent">
              <TableHead scope="col" className="h-auto px-0 pb-2 text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                Country
              </TableHead>
              {cols.map((c) => (
                <TableHead key={c.key} scope="col" className="h-auto px-2 pb-2 text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
                  {c.head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow
                key={r.iso2}
                className={`border-[var(--c-border)] hover:bg-transparent ${r.home ? "bg-[var(--c-soft)]" : ""}`}
              >
                <TableCell className="px-0 py-2.5">
                  <span className="flex items-center gap-2.5">
                    <CountryFlag iso2={r.iso2} className="w-7 shrink-0" />
                    <span className={`text-[length:var(--t-body)] ${r.home ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{r.name}</span>
                  </span>
                </TableCell>
                {cols.map((c) => {
                  const v = r[c.key];
                  const isBest = isNum(v) && bestOf[c.key] != null && v === bestOf[c.key];
                  return (
                    <TableCell key={c.key} className="px-2 py-2.5 text-right">
                      {isNum(v) ? (
                        <Fig className={`text-[length:var(--t-body)] ${isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{c.fmt(v)}</Fig>
                      ) : (
                        <span aria-label="not held" className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        {/* The phone form: the same rows, the same winner convention, no
            sideways motion. One card per country, figures as label-over-value
            pairs in a two-column grid. */}
        <div className="space-y-2 md:hidden">
          {rows.map((r) => (
            <div
              key={r.iso2}
              className={`rounded-[14px] border border-[var(--c-border)] px-3.5 py-3 ${r.home ? "bg-[var(--c-soft)]" : ""}`}
            >
              <span className="flex items-center gap-2.5">
                <CountryFlag iso2={r.iso2} className="w-7 shrink-0" />
                <span className={`text-[length:var(--t-body)] ${r.home ? "font-semibold" : ""} text-[var(--c-ink)]`}>{r.name}</span>
              </span>
              <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                {cols.map((c) => {
                  const v = r[c.key];
                  const isBest = isNum(v) && bestOf[c.key] != null && v === bestOf[c.key];
                  return (
                    <div key={c.key}>
                      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{c.head}</div>
                      {isNum(v) ? (
                        <Fig className={`text-[length:var(--t-body)] ${isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>{c.fmt(v)}</Fig>
                      ) : (
                        <span aria-label="not held" className="text-[length:var(--t-body)] text-[var(--c-muted)]">&ndash;</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {peers?.caveat ? (
          <p className="mt-2.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{peers.caveat}</p>
        ) : null}
      </Box>
    </div>
  );
}

/**
 * What customers earn. THE SPREAD IS DECILES (2026-08-30, notation N9),
 * founder verbatim: "we should seek to find the average, the top ten percent
 * and the bottom ten percent. Instead you are just saying the lower quarter or
 * the upper quarter... that's not very helpful."
 *
 * The drawing returns only for a country whose deciles were actually
 * researched (data/economics/wage_deciles_v1.json, pushed into the profile as
 * wage_p10_usd / wage_p90_usd). A country without them states the typical
 * figure alone, exactly as it did while the spread was dark, because the
 * quartile pair the profile still carries is a fixed multiple of the median
 * rather than a measurement, and relabelling it would be a fabricated
 * statistic. Quartile words never render again; the gate is
 * scripts/verify_no_quartile_words.mjs.
 *
 * THE LABELS DO NOT COLLIDE, and that is the whole reason the outer two wrap.
 * Pay distributions lean right, so the typical mark sits well left of centre
 * (about 29 percent of the span for the United Kingdom) while "Bottom ten
 * percent" is anchored at the left edge. Held on one line, those two blocks
 * overlap at every width the card is ever laid out at. Capped at 5rem the
 * outer labels take two short lines and clear the typical block at 1280 and at
 * 390 alike, with no invented breakpoint and nothing scrolling sideways (law
 * M).
 */
function Customers({ customers }: { customers: any }) {
  if (!isNum(customers?.median_usd)) return null;
  const med = customers.median_usd;
  const p10 = customers?.p10_usd, p90 = customers?.p90_usd;
  const spread = isNum(p10) && isNum(p90) && p10 < med && med < p90;
  const tagged = typeof customers?._meta?.confidence === "string" && customers._meta.confidence !== "measured";
  const basis = customers.basis ?? "Full-time pay, a year.";
  if (!spread) {
    return (
      <Box id="customers">
        <Rail icon="spread" kicker="What customers earn" sample={tagged} />
        <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Typical pay</div>
        {/* Accent register entry 2: the customers card's answer. */}
        <Fig className="mt-1 block text-[length:var(--t-head)] font-semibold leading-none text-[var(--terra-text)]">{usd(med)}</Fig>
        <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</div>
      </Box>
    );
  }
  /* C11, 2026-09-02. WHAT WAS HERE WAS AN UNDECLARED HORIZONTAL TRACK, and it
     was the wrong drawing rather than merely an untagged one.
     THE FORM. A hairline with three ticks on it is I1, and I1 is reserved for a
     POSITION BETWEEN TWO NAMED POLES. "Bottom ten percent" and "top ten percent"
     are the BOTTOM AND TOP OF AN ORDER, which A1 settled on the trade page and
     C10 settled again on the hood page: an order's two ends are not two poles a
     value sits between. The page also carries exactly two legitimate tracks
     already, the ratified character tables, so declaring this one would have put
     the page at I1 3 of 2 and failed the gate in the same commit.
     WHAT THE INFORMATION IS: a spread, a low, a typical and a high of ONE
     quantity. The catalogue holds two forms for it, SpreadStrip at I1 (at cap,
     and the wrong drawing above) and RangeBracket at I12, whose version 3 entry
     carries the typical between its two ends. I12 is free on this page.
     THE HIERARCHY WAS ALSO FAILING, measured on the render before this change:
     the typical stood at head 20 against its two ends at body 14, a ratio of
     1.43x, under step 5's floor of 1.6. The bracket sets the typical at focal
     30 against the same two ends, 2.14x.
     WHAT IT COSTS, and it is deliberate rather than overlooked: the old drawing
     placed the typical at its true fraction of the span (measured 27.9 percent
     drawn against 26.5 percent true, the difference being the end padding), so
     the SKEW of the distribution was drawn. A brace does not place its notch by
     value and says so in its own entry: the numbers carry the reading. That is
     the trade version 3 made when it struck the anchored numeral, and the skew
     survives in the figures, which any reader can subtract.
     THE ACCENT IS UNCHANGED AND NARROWER. Register entry 2 is "the customers
     card's Typical figure"; the old card also painted the word and the 2px tick,
     so three things wore terracotta where the register names one. The bracket
     colours the figure and nothing else. */
  return (
    <Box id="customers">
      {/* The range glyph, not the shopping bag: at sixteen pixels the bag reads
          as a bin, the city page paid for that in round 3, and this card draws
          exactly what the range glyph depicts, a low-to-high band with the
          typical point marked. */}
      <Rail icon="spread" kicker="What customers earn" sample={tagged} />
      <RangeBracket
        lo={p10}
        hi={p90}
        typical={med}
        format={usd}
        caption="Typical"
        /* "BOTTOM TENTH" AND "TOP TENTH", SHORTENED BY TWO AND A HALF PIXELS,
           and the photograph is the only thing that found it. "Bottom ten
           percent" measures 106px in a 103.9px column at 375, so it wrapped with
           "percent" orphaned on a second line while the two labels beside it sat
           on one, which is A3's own fault ("asks.", "business.") and A3's own
           remedy. A first DOM probe reported one line and was wrong, because it
           measured before `document.fonts.ready` and therefore measured the
           fallback face. THE STATISTIC IS UNCHANGED, which is what the founder's
           N9 order was actually about: he asked for the top and bottom tenths
           instead of quartiles, and a tenth is what both labels say. */
        endLabels={["Bottom tenth", "Top tenth"]}
        accent
      />
      <div className="mt-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</div>
    </Box>
  );
}

/**
 * What an owner keeps , the repetition is out (founder, second batch: "for
 * each row you say kept a year and to open... you could have just said it
 * once at the top as a column and not repeated the same word six times in a
 * row"). Column headers ONCE; each row carries the trade, two figures and the
 * arrow, on one shared grid template so the headers sit over their columns.
 * Returns a bare Box: the body composes it into the 2-1 band beside the
 * customers card. His standing note, recorded and queued: "a little bit stale
 * and without a lot of character."
 */
function Money({ money }: { money: any }) {
  const rows: any[] = (Array.isArray(money?.list) ? [...money.list] : []).sort((x, y) => (y?.keeps_usd_year ?? 0) - (x?.keeps_usd_year ?? 0));
  if (rows.length < 2) return null;
  const tagged = typeof money?._meta?.confidence === "string" && money._meta.confidence !== "measured";
  /* ===== C43, 2026-09-02: THE ROW IS TWO BLOCKS, AND THE CARD'S OWN WIDTH SAYS
     WHETHER THEY SHARE A LINE. ================================================

     WHAT WAS WRONG, measured with a Range rect after `document.fonts.ready`
     (`scratchpad/loop18_c43.mjs`), because a name's own element box IS its
     column's width and can never tell you the name was cut. The row was ONE
     four-column grid whose name track was `minmax(0,1fr)`, so the name got
     whatever the two fixed figure columns left. Against the six names' true
     widths, "Restaurants" 79.6, "Grocery stores" 96.2, "Sports & fitness"
     104.5, "Auto repair shops" 115.6, "Cafes & coffee shops" 138 and
     "Hairdressers & beauty" 144.3:

       viewport   card   name track   names cut
       1280       624    350          0
       1024       566    292          0
       900        410    136          2
       768        344    70           SIX OF SIX
       640        608    334          0
       480        448    174          0
       375        343    69           SIX OF SIX

     TWO WINDOWS, NOT ONE, and the queue's row had found only the outer pair: the
     phone, and the WHOLE TABLET RANGE, 768 to 1023, where `Band` gives every band
     equal halves under its own ratified D4 rule and this card is 344px, one pixel
     wider than the same card at 375.

     TWO FIXES WERE WEIGHED AND REFUSED.
     TRUNCATION IS ALREADY RULED OUT, twice this loop and both times on a
     photograph: C6 made RankedTiles wrap rather than cut, and C19 found the
     countries list cutting a name at every width on a page whose whole job is
     finding the country you came for. A row named by a trade cannot cut the
     trade. SMALLER TYPE IS NOT AVAILABLE either: step 5 makes the ladder the only
     source of sizes and body 14 is where a table's names sit everywhere else.
     AND WRAPPING THE NAME INSIDE ITS OWN TRACK DOES NOT FINISH IT, which is
     C19's hardest-won finding: a word has nowhere to break, and "Hairdressers"
     alone measures 82.9 against a 69px track, so wrapping there buys a split
     mid-word, which A5 photographed as "Equipmen / t" and rejected.

     SO THE READINGS LEAVE THE LINE, and this is not a new shape: it is the idiom
     `setup-tiers.tsx` already ships on THIS PAGE, ratified with a photograph in
     run 9, for the identical problem of a name plus several readings in a card
     too narrow to hold both. A name block and a readings block in a wrapping flex
     row, so a break can only ever happen BETWEEN them and never inside either,
     driven by the CARD's own width rather than by a viewport breakpoint. That is
     run 7's ruling and it is the only rule that can work here: this card is 343px
     at 375, 448 at 480, 608 at 640, 344 at 768 and 624 at 1280, so its width is
     NOT monotonic in the viewport and no breakpoint ladder can name the narrow
     cases.

     THE ARITHMETIC, so the basis is a measurement and not a taste. The readings
     block is 5.5rem + 5.5rem + 1.25rem + three 12px gaps = 232px, and it does not
     shrink. The name's basis is 10rem, 160px, the longest name in the fixed six
     (144.3) rounded up. A flex line breaks when 160 + 12 + 232 = 404 exceeds the
     card's inner width, and whenever it does NOT break the name's share is at
     least 160, which holds every name on one line. The two thresholds coincide by
     construction, which is why the basis is that number.
     THE LEADING 1fr SPACER inside the readings block keeps the figures packed to
     the card's own right edge on BOTH lines: the block grows and the spacer eats
     the growth, so the two figure columns and the arrow land in the same place
     whether they sit beside a name or beneath one. Taken from setup-tiers, which
     records the 375 measurement that made it necessary. */
  const nameSlot = "min-w-0 flex-[1_1_10rem]";
  const readings = "grid flex-[1_0_auto] grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_1.25rem] items-baseline gap-x-3";
  const line = "flex flex-wrap items-baseline gap-x-3";
  return (
    <Box id="money">
      <Rail icon="owner-keeps" kicker="What an owner keeps, trade by trade" sample={tagged} />
      {/* The header takes the SAME two blocks as a row, so its labels sit over
          their own columns at every width rather than over a template only the
          wide case ever uses. */}
      <div className={line + " pb-2"}>
        <span aria-hidden className={nameSlot} />
        <span className={readings}>
          <span aria-hidden />
          <span className="text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Kept a year</span>
          <span className="text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">To open</span>
          <span aria-hidden />
        </span>
      </div>
      <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
        {rows.map((r: any) => (
          <a key={r.slug} href={r.href} className={"group " + line + " py-2.5"}>
            <span className={nameSlot + " text-[length:var(--t-body)] font-medium text-[var(--c-ink)] transition-colors group-hover:text-[var(--c-ink2)]"}>{r.name}</span>
            <span className={readings}>
              <span aria-hidden />
              <Fig className="text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(r.keeps_usd_year)}</Fig>
              <Fig className="text-right text-[length:var(--t-micro)] text-[var(--c-ink2)]">{usd(r.cost_to_open_usd)}</Fig>
              <span aria-hidden className="text-right text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
            </span>
          </a>
        ))}
      </div>
      {money?.withheld?.reason ? (
        <p className="mt-2.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{money.withheld.reason}</p>
      ) : null}
    </Box>
  );
}

/**
 * The character , the two ratified tables, rebuilt to the founder's second
 * 2026-08-30 batch: every row carries its TRAIT NAME again (the previous
 * build had dropped them, leaving generic pole words , half the fault he
 * named); the pole words are EXPLANATORY of their category ("you should make
 * the two words explanatory to the category that they are referring to");
 * best on the right, worst on the left, every row; the STATE table's dots are
 * INK and the PEOPLE table's dots TERRACOTTA ("that's the feeling"); the
 * state's icon is an institution (the bank glyph); foreign-owned firms sits
 * at the bottom of the state table and born abroad at the bottom of the
 * people table. The positions are the same published-index-anchored reads,
 * normalised exactly as before (government 0 to 10, culture 1 to 10).
 */
function Character({ character }: { character: any }) {
  const gov = character?.government;
  const cu = character?.culture;
  if (!gov && !cu) return null;
  const tagged = typeof character?._meta?.confidence === "string" && character._meta.confidence !== "measured";
  const norm10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, v / 10)) : null);
  const norm1to10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, (v - 1) / 9)) : null);
  const row = (pos: number | null, spectrum: string, rowName: string, left: string, right: string) =>
    pos == null ? null : { spectrum, name: rowName, left_label: left, right_label: right, position_0_1: pos };
  const govRows = gov
    ? [
        row(norm10(gov.tax_predictability), "tax", "Tax predictability", "Rules change yearly", "Set for years"),
        row(norm10(gov.low_bribery), "bribery", "Clean dealing", "Bribes expected", "By the book"),
        row(norm10(gov.task_efficiency), "tasks", "Getting things done", "Weeks of stamps", "Same-week answers"),
        row(norm10(gov.time_efficiency), "time", "Waiting time", "Queues for months", "Days, not months"),
        row(norm10(gov.judicial_impartiality), "courts", "Courts", "Connections decide", "Contracts hold"),
        row(norm10(gov.innovation_capacity), "new", "Openness to the new", "New ways resisted", "New ways welcomed"),
      ].filter(Boolean)
    : [];
  const cuRows = cu
    ? [
        row(norm1to10(cu.openness_to_foreigners), "open", "Openness", "Keep to themselves", "Quick to include you"),
        row(norm1to10(cu.innovation), "innovation", "Innovation", "The old way rules", "New ideas land"),
        row(norm1to10(cu.communication_directness), "direct", "Directness", "Read between the lines", "Said to your face"),
        row(norm1to10(cu.punctuality), "punctual", "Timekeeping", "Schedules drift", "Clocks are kept"),
        row(norm1to10(cu.corruption_rejection), "straight", "Straight dealing", "Corners get cut", "A word is kept"),
        row(norm1to10(cu.ambition_chest_beating), "ambition", "Ambition", "Kept quiet", "Worn openly"),
      ].filter(Boolean)
    : [];
  if (govRows.length === 0 && cuRows.length === 0) return null;
  return (
    <Band split="1-1">
      {govRows.length > 0 ? (
        <Box id="character">
          <Rail icon="bank" kicker="Dealing with the state" sample={tagged} />
          <SpectraTable rows={govRows} />
          {isNum(character?.foreign_owned_pct) ? (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-3">
              <span className="flex items-baseline gap-1.5">
                <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{character.foreign_owned_pct}%</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of firms are foreign-owned</span>
              </span>
            </div>
          ) : null}
        </Box>
      ) : null}
      {cuRows.length > 0 ? (
        <Box {...(govRows.length === 0 ? { id: "character" } : {})}>
          <Rail icon="who-for" kicker="Dealing with people" sample={tagged} />
          <SpectraTable rows={cuRows} dot="terra" />
          {isNum(character?.foreign_born_pct) ? (
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-3">
              <span className="flex items-baseline gap-1.5">
                <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{character.foreign_born_pct}%</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">born abroad</span>
              </span>
            </div>
          ) : null}
        </Box>
      ) : null}
    </Band>
  );
}

/**
 * Registering, by legal form , expandable since the founder's second batch
 * ("I've told you multiple times that this should be an expandable section").
 * The rows, the quiet local term and the terracotta complexity dots live in
 * the SetupTiers client component; this wrapper holds the section chrome.
 */
function Setup({ setup }: { setup: any }) {
  const tiers: any[] = Array.isArray(setup?.tiers) ? setup.tiers : [];
  if (tiers.length === 0) return null;
  const tagged = typeof setup?._meta?.confidence === "string" && setup._meta.confidence !== "measured";
  return (
    <Box id="setup">
      <Rail icon="register-cost" kicker="Registering, by legal form" sample={tagged} />
      <SetupTiers tiers={tiers} />
    </Box>
  );
}

/**
 * What premises cost , a STANDING of the address tiers since C11 (2026-09-02).
 *
 * WHAT WAS HERE, AND WHY IT WAS A REPLACEMENT RATHER THAN A DECLARATION. The
 * three rents sat as ticks on one hairline, which is an undeclared I1 horizontal
 * track on a page already at the I1 cap of two, and the track was wrong twice
 * over. Its two ends are the BOTTOM AND TOP OF AN ORDER, which A1 and C10 both
 * settled is not a position between two named poles. And the axis was LOGARITHMIC
 * with nothing in the drawing saying so: measured on the render, the middle mark
 * stood at 41.7 percent of the way between the outer two where the true linear
 * fraction of those same figures is 20.0 percent, so the picture published DOUBLE
 * the distance the data holds. That is C10's invented-position fault class, in a
 * card that had no other reading: nothing in it was larger than 14px, so there
 * was no first thing to see and no ratio to state (C6's measurement, here again).
 *
 * WHAT THE INFORMATION IS: a ranking of named things, three of them, one figure
 * each. NOT a spread, which is the customers card two bands up: "Ordinary street"
 * is not the typical of a distribution, it is a third named place, and a tenant
 * chooses a tier rather than landing at a percentile.
 *
 * EVERY DRAWN FORM WAS ELIMINATED BEFORE THE TYPOGRAPHIC ONE WAS TAKEN, which is
 * A8's own path through step 3. I1 is at cap and is the wrong drawing, above. I2
 * LollipopColumn refuses fewer than four entries in code, verified rather than
 * assumed, and the card directly below this one in reading order is the hiring
 * bar set, so an I2 here would also breach rule 25. I3 StackBar asserts a total,
 * and three rents do not sum to a quantity. I4 is a level reached or a running
 * total and this is neither. I5 is a count of identical marks, and the setup card
 * beside it already draws pips. I6 OptionCards needs 478px of inner width (run 7
 * measured it) and this card has 396, and the band cannot widen because B8
 * measured 624 as the narrowest width its own table stays a table at. I7 has
 * nothing to clear. I12 is spent two bands up on a different information type,
 * and drawing three entities as a span would be the fuse this loop is forbidden.
 * So the catalogue holds NO drawn form for a three-entry ranking on this page,
 * and RankedTiles is the form its index names for a ranking that is few.
 *
 * WHICH LEAVES THE FOUNDER'S OWN OBJECTION TO ANSWER, "this is just a list of
 * numbers, so it doesn't feel well at all" (second batch). What he rejected was
 * figures with no reading, and the tick scale answered it with a drawing that
 * lies. The card answers it instead with the reading itself: a computed finding
 * at the section rung saying how many times the dearest address costs the
 * cheapest, with the standing beneath it as its evidence. The finding is COMPUTED
 * and never typed, which is C6's rule and matters here for C6's reason: the tiers
 * and their spread differ in every country.
 *
 * NO ACCENT ANYWHERE. The accent register closed by the founder on 2026-08-30 is
 * exhaustive and this card is not in it, so RankedTiles takes `accent={false}`;
 * the order, the numerals and the leader's semibold name carry the rank, which is
 * A3's own settled reading for a form whose colour is turned off.
 *
 * The electricity rate keeps its own quiet line beneath.
 */
function Premises({ premises }: { premises: any }) {
  const prime = premises?.rent_prime_usd_sqm_year;
  const mid = premises?.rent_mid_usd_sqm_year;
  const edge = premises?.rent_edge_usd_sqm_year;
  const kwh = premises?.electricity_usd_per_kwh;
  const rents: Array<[string, number]> = [];
  if (isNum(edge)) rents.push(["Edge of town", edge]);
  if (isNum(mid)) rents.push(["Ordinary street", mid]);
  if (isNum(prime)) rents.push(["Prime street", prime]);
  if (rents.length === 0 && !isNum(kwh)) return null;
  const tagged = typeof premises?._meta?.confidence === "string" && premises._meta.confidence !== "measured";
  /* THE FINDING, COMPUTED. Read off the two ends of whatever set this country
     holds, so a page with two tiers and a page with three both say something
     true, and no sentence is typed about a country nobody looked at (C6). Under
     1.15x the ratio is not a finding and the card says so rather than printing
     "1.1 times", which is a difference a rent survey cannot defend. */
  const cheapest = rents[0]?.[1];
  const dearest = rents[rents.length - 1]?.[1];
  const ratio = rents.length >= 2 && cheapest > 0 ? dearest / cheapest : null;
  /* THE MULTIPLE IS ROUNDED TO WHAT THE RENTS CAN CARRY, and "about" is not
     hedging. The tier rents are published to the nearest ten dollars a square
     metre, so on a $120 base a ten-dollar wobble at either end moves a 7.7 into
     the range 7.0 to 8.4: a tenth of a multiple is well inside the inputs' own
     rounding at that size, and printing one would be the false precision this
     card was already guilty of in its drawing. A tenth still says something
     below 3, where the same wobble is a smaller share of the reading. */
  const times = ratio == null ? null : ratio >= 3 ? Math.round(ratio) : Math.round(ratio * 10) / 10;
  const finding =
    times == null
      ? null
      : ratio != null && ratio < 1.15
        ? "The dearest address costs about the same as the cheapest."
        : "The dearest address costs about " + (Number.isInteger(times) ? times : times.toFixed(1)) + " times the cheapest.";
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker="What premises cost to run" sample={tagged} />
      {rents.length >= 2 ? (
        <>
          <p className="text-[length:var(--t-section)] font-semibold leading-snug text-[var(--c-ink)]">{finding}</p>
          <div className="mt-4">
            <RankedTiles
              accent={false}
              ariaLabel={"Commercial rent for a square metre a year, cheapest address first: " + rents.map(([l, v]) => l + " " + usd(v)).join(", ")}
              rows={rents.map(([label, v]) => ({ name: label, value: usd(v) }))}
            />
          </div>
          <div className="mt-4 text-[length:var(--t-micro)] text-[var(--c-muted)]">Commercial rent for a square metre, a year.</div>
        </>
      ) : rents.length === 1 ? (
        <div className="flex flex-wrap items-baseline gap-x-2">
          <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{usd(rents[0][1])}</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">{rents[0][0].toLowerCase()}, a square metre a year</span>
        </div>
      ) : null}
      {isNum(kwh) ? (
        <div className={"flex flex-wrap items-baseline gap-x-2 " + (rents.length > 0 ? "mt-3 border-t border-[var(--c-border)] pt-3" : "")}>
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{"$" + kwh}</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">a kilowatt hour, the commercial electricity rate</span>
        </div>
      ) : null}
    </Box>
  );
}

/**
 * Sections 8, 9 and 10, built EXACTLY to design/blueprints/country.md, which
 * was written first. Where these components and that file disagree, one of
 * them is wrong and gets fixed the same day.
 *
 * 8 , WHAT STAFF COST: replaces the legacy "ground under you" (founder
 * verdict 5) with the staffing half of what it tried to say. The page's only
 * bar-family spend: TWO bars, one shared zero-based track, BOTH NEUTRAL,
 * because neither figure is an answer and the legacy version accenting the
 * higher cost was a rule-29A inversion fault.
 *
 * 9 , WHAT LOCALS KNOW: label-over-fact rows, never a wall of text (founder
 * verdict 9), capped at five, always sample-tagged (hand-written).
 *
 * 10 , WHERE TO NEXT: the terminus, the second sanctioned full width. Three
 * doors that LEAVE the page and share no first word. The legacy honest-take
 * SECTION is cut here under rule 41, credibility ground: hand-written verdict
 * prose presented as a read is the patronizing class the founder condemned.
 */
function Hiring({ hiring }: { hiring: any }) {
  const floor = hiring?.wage_floor_usd_year;
  const typical = hiring?.typical_pay_usd_year;
  const canDraw = isNum(floor) || isNum(typical);
  if (!canDraw) return null;
  const tagged = typeof hiring?._meta?.confidence === "string" && hiring._meta.confidence !== "measured";
  const max = Math.max(isNum(floor) ? floor : 0, isNum(typical) ? typical : 0) * 1.05;
  const bars: Array<[string, number, string]> = [];
  /* Terracotta, the founder's second-batch order ("there is a problem that
     you are removing the terracotta color from the bars"): the typical bar in
     the full accent fill, the floor in the lighter border tone so the two
     stay tellable apart at a glance. Accent register 5. */
  if (isNum(floor)) bars.push(["Wage floor", floor, "var(--terra-border)"]);
  if (isNum(typical)) bars.push(["Typical pay", typical, "var(--terra)"]);
  const addPct = hiring?.payroll_only_multiplier != null && isNum(hiring?.employer_payroll_pct)
    ? hiring.employer_payroll_pct
    : undefined;
  const labour = hiring?.labour_force_pct;
  const informal = hiring?.informal_share_pct;
  return (
    <Box id="hiring">
      <Rail icon="hiring" kicker="What staff cost" sample={tagged} />
      {/* C12, 2026-09-02. THE DECLARATION IS THE WHOLE FIX HERE, and saying so
          plainly is the point: two fills measured by length from ONE shared zero
          is what the catalogue calls a BAR SET in its own words, "rectangles
          compared by length from a common baseline", and the addendum already
          classified this exact markup, a fill inside a track from one common
          left edge, as I2 when it re-read the kit's Waterfall. Nothing about the
          drawing was wrong, so nothing about the drawing changed.
          IT IS TAGGED ON THE SET AND NOT ON EACH BAR, which is the rule B5, B7
          and B8 each settled in a different component: if a reader would call the
          SET one object, the set declares. Two tags here would have been two bar
          sets in one card, which is the arithmetic that binds a card.
          THE BUDGET, counted on the render: the page was I2 0 of 3 and is now 1
          of 3, and this is the page's only bar set. The blueprint's own condition
          holds too, that the hiring bars be "non-adjacent to any other bar user":
          the band above is the setup pips (I5) and the rent standing (I11), the
          card beside it draws nothing, and nothing else on the page is an I2.
          THE ACCENT IS UNTOUCHED. Register entry 5 names these bars and the
          founder's 2026-08-30 order put the colour back on them.
          THE ROW GAP GOES 10 TO 8, the slot rung, because ten sits between two
          rungs of the spacing ladder and step 7 forbids that outright. It is the
          twelfth off-ladder value this loop has found. The 12 INSIDE each row
          stays and the distinction is A4's: a label, its own bar and its own
          figure on one baseline are ONE object kerned, while the gap between the
          rows separates two of them. */}
      <div data-idea="I2" className="space-y-2">
        {bars.map(([label, v, fill]) => (
          <div key={label} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3">
            <span className="text-[length:var(--t-body)] text-[var(--c-ink)]">{label}</span>
            <span className="relative block h-3 overflow-hidden rounded-full" style={{ background: "var(--c-soft)" }} role="img" aria-label={label + " " + usd(v) + " a year"}>
              <span aria-hidden className="absolute inset-y-0 left-0 rounded-full" style={{ width: ((v / max) * 100).toFixed(1) + "%", background: fill }} />
            </span>
            <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(v)}</Fig>
          </div>
        ))}
      </div>
      {/* 16, THE CARD-PADDING RUNG, on both blocks below. Both were 12, which is
          between two rungs, and so was the 12 of padding above the last block's
          own rule. Thirteenth, fourteenth and fifteenth off-ladder values. */}
      {isNum(addPct) ? (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">On top of gross pay, employers add</span>
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">+{addPct}%</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">(pension auto-enrolment and insurance sit on top)</span>
        </div>
      ) : null}
      {isNum(labour) || isNum(informal) ? (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-4">
          {isNum(labour) ? (
            <span className="flex items-baseline gap-1.5">
              <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{labour}%</Fig>
              <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of adults are in the labour force</span>
            </span>
          ) : null}
          {isNum(informal) ? (
            <span className="flex items-baseline gap-1.5">
              <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{informal}%</Fig>
              <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">of the economy runs informal</span>
            </span>
          ) : null}
        </div>
      ) : null}
    </Box>
  );
}

function LocalsKnow({ locals }: { locals: any }) {
  const items: any[] = Array.isArray(locals?.items) ? locals.items.slice(0, 5) : [];
  if (items.length === 0) return null;
  return (
    <Box>
      <Rail icon="locals-know" kicker="What locals know" sample />
      <div id="locals" className="divide-y divide-[var(--c-border)]">
        {items.map((it: any, i: number) => (
          <div key={i} className="py-2.5 first:pt-0 last:pb-0">
            <div className="text-[length:var(--t-micro)] font-semibold text-[var(--c-ink)]">{it.label}</div>
            <div className="mt-0.5 text-[length:var(--t-body)] leading-snug text-[var(--c-ink2)]">{it.fact}</div>
          </div>
        ))}
      </div>
    </Box>
  );
}

function Close({ meta }: { meta: any }) {
  const iso = typeof meta?.iso2 === "string" ? meta.iso2.toLowerCase() : undefined;
  return (
    <div data-terminus className="mt-8">
      <Box id="close">
        <h3 data-typography="custom" className="mb-1.5 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-muted)]">Where to next</h3>
        <div className="mt-2 flex flex-col items-start gap-3 border-t border-[var(--c-border)] pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6">
          {iso === "gb" ? (
            <a href="/cities/london" className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">Start in London, the deepest city &#8594;</a>
          ) : null}
          <a href="/industries" className="text-[length:var(--t-body)] font-medium text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">See every trade measured here &#8594;</a>
          <a href="/pricing" className="rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-center text-[length:var(--t-body)] font-semibold text-white transition-colors hover:bg-[var(--terra-text)]">Compare this country with Pro &#8594;</a>
        </div>
      </Box>
    </div>
  );
}

/**
 * The country spine page body. `data` is the seed from buildSpineCountrySeed.
 * Every block on it is optional by design, so read defensively.
 */
export function SpineCountryBody({ data }: { data?: any }) {
  const d = data ?? {};
  const name: string | undefined = d.meta?.country_name;
  if (!name) return null;

  return (
    <>
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <Masthead name={name} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} hero={d.hero} />
        <Cities cities={d.cities} iso2={typeof d.meta?.iso2 === "string" ? d.meta.iso2 : undefined} />
        <Peers peers={d.peers} />
        {/* The money grid takes the wide side and the customers card the narrow;
            the lens grid that stood here is retired, every tile by his own words.
            THE SPLIT MOVED 2-1 TO 3-2 IN C11, and a measurement decided it rather
            than taste. At 347 the bracket's own left label, "Bottom ten percent",
            needs 103px in a 100px column and wrapped to two lines while the two
            beside it stayed on one, so a row of three labels went ragged. At 416
            each column is 141px and every label sits on one line with room for a
            wider middle figure than any country in the file holds. The money grid
            gives up 69px and loses nothing: its name column falls 419 to 352 and
            its longest trade name is about 140. D3 also reads better afterwards,
            because 2-1 stood at three bands on this page and now stands at two. */}
        {Array.isArray(d.money?.list) || isNum(d.customers?.median_usd) ? (
          <Band split="3-2">
            <Money money={d.money} />
            <Customers customers={d.customers} />
          </Band>
        ) : null}
        <Character character={d.character} />
        {d.setup?.tiers?.length || d.premises ? (
          <Band split="3-2">
            <Setup setup={d.setup} />
            <Premises premises={d.premises} />
          </Band>
        ) : null}
        {d.hiring || d.locals_know ? (
          <Band split="2-1">
            <Hiring hiring={d.hiring} />
            <LocalsKnow locals={d.locals_know} />
          </Band>
        ) : null}
        <Close meta={d.meta} />
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
