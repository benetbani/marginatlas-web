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
              className="block max-w-[18ch] text-[length:var(--t-small)] leading-snug text-[var(--c-ink2)] transition hover:text-[var(--terra-text)]"
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
 * columns, capacity four rows, no borders and no tiles (his tile ban stands):
 * payroll on wages, sales tax, time to register, cost to register. The four
 * remaining slots are reserved for the upkeep and decile figures when their
 * data lands; nothing fills them speculatively.
 *
 * Everything the first batch settled still binds: the answer is the
 * small-business effective rate labelled "Total effective tax burden", the
 * name appears once with its flag, no world-median line, and the SMB rate's
 * modeled confidence keeps the honesty tag on the block.
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
     weight: the payroll burden first (it is a burden, not trivia), then the
     tax the customer carries, then the two registration facts. */
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
  if (days) {
    cells.push({
      key: "days",
      label: "Time to register",
      value: (
        <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">
          {days.value} {days.value === 1 ? "day" : "days"}
        </Fig>
      ),
    });
  }
  if (cost) {
    cells.push({
      key: "cost",
      label: "Cost to register",
      value:
        cost.value === 0 ? (
          <span className="block text-[length:var(--t-head)] font-medium leading-none text-[var(--c-ink)]">Free</span>
        ) : (
          <Fig className="text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{usd(cost.value as number)}</Fig>
        ),
    });
  }

  return (
    <Band hero>
      <Box id="take">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AtlasMark id="alt-country" size={13} className="opacity-55" />
          {iso2 ? <CountryFlag iso2={iso2} className="w-9 shrink-0" /> : null}
          <h1
            id="headline"
            data-typography="custom"
            className="text-balance text-[length:var(--t-focal)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]"
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
        <Table className="text-[length:var(--t-small)]">
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
        <Fig className="mt-1 block text-[length:var(--t-sub)] font-semibold leading-none text-[var(--terra-text)]">{usd(med)}</Fig>
        <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</div>
      </Box>
    );
  }
  /* The ten percent of room at each end is the round-3 scale rule kept intact:
     an end mark sits inside the track rather than on its edge, so a tick is
     never half-drawn against the card's own boundary. */
  const lo = p10 * 0.9, hi = p90 * 1.1, span = Math.max(1, hi - lo);
  const X = (v: number) => ((v - lo) / span) * 100;
  const marks: Array<[string, number, boolean]> = [
    ["Bottom ten percent", p10, false],
    ["Typical", med, true],
    ["Top ten percent", p90, false],
  ];
  return (
    <Box id="customers">
      {/* The range glyph, not the shopping bag: at sixteen pixels the bag reads
          as a bin, the city page paid for that in round 3, and this card draws
          exactly what the range glyph depicts, a low-to-high band with the
          typical point marked. */}
      <Rail icon="spread" kicker="What customers earn" sample={tagged} />
      <div
        className="relative mt-1 h-[24px]"
        role="img"
        aria-label={"Full-time pay a year: bottom ten percent " + usd(p10) + ", typical " + usd(med) + ", top ten percent " + usd(p90)}
      >
        <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--c-border)]" />
        {marks.map(([label, v, accent]) => (
          <span key={label} className="absolute bottom-0 top-0" style={{ left: X(v) + "%" }}>
            <span
              className="absolute bottom-0 h-[12px] w-0 -translate-x-1/2"
              style={{ borderLeftWidth: accent ? 2 : 1, borderLeftStyle: "solid", borderLeftColor: accent ? "var(--terra-text)" : "var(--c-line-strong)" }}
            />
          </span>
        ))}
      </div>
      <div className="relative mt-1 h-[52px] text-[length:var(--t-micro)] text-[var(--c-muted)]">
        {marks.map(([label, v, accent]) => {
          const x = X(v);
          const edge = x > 82 ? "right" : x < 14 ? "left" : "centre";
          const style: React.CSSProperties =
            edge === "right" ? { right: 0 } : edge === "left" ? { left: 0 } : { left: x + "%", transform: "translateX(-50%)" };
          return (
            <span
              key={label}
              className={"absolute top-0 flex flex-col " + (accent ? "whitespace-nowrap " : "max-w-[5rem] ") + (edge === "right" ? "items-end text-right" : "")}
              style={style}
            >
              <span className={accent ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span>
              <Fig className={"mt-0.5 font-semibold " + (accent ? "text-[length:var(--t-sub)] text-[var(--terra-text)]" : "text-[length:var(--t-body)] text-[var(--c-ink)]")}>{usd(v)}</Fig>
            </span>
          );
        })}
      </div>
      <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{basis}</div>
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
  const cols = "grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_1.25rem] items-baseline gap-x-3";
  return (
    <Box id="money">
      <Rail icon="owner-keeps" kicker="What an owner keeps, trade by trade" sample={tagged} />
      <div className={cols + " pb-2"}>
        <span aria-hidden />
        <span className="text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Kept a year</span>
        <span className="text-right text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">To open</span>
        <span aria-hidden />
      </div>
      <div className="divide-y divide-[var(--c-border)] border-t border-[var(--c-border)]">
        {rows.map((r: any) => (
          <a key={r.slug} href={r.href} className={"group " + cols + " py-2.5"}>
            <span className="truncate text-[length:var(--t-body)] font-medium text-[var(--c-ink)] transition-colors group-hover:text-[var(--c-ink2)]">{r.name}</span>
            <Fig className="text-right text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(r.keeps_usd_year)}</Fig>
            <Fig className="text-right text-[length:var(--t-small)] text-[var(--c-ink2)]">{usd(r.cost_to_open_usd)}</Fig>
            <span aria-hidden className="text-right text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
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
 * What premises cost , the bare figure list is out (founder, second batch:
 * "this is just a list of numbers, so it doesn't feel well at all"). The
 * three rent tiers draw on ONE linear scale, the settled tick form: hairline
 * baseline, 12px ticks, each label UNDER its own mark, outermost labels
 * pinned inside the box, all ink (nothing here is the answer, so no accent).
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
  /* LOG SCALE, and the photograph is why: prime street rents run near eight
     times edge-of-town, so a linear scale crushed the two lower marks into
     one unreadable overlap ("Edge oOtdiuary street", photographed
     2026-08-30). The log form spreads a multiplicative spread evenly; the
     city income card made the same call for the same reason. */
  const lo = rents.length > 0 ? Math.min(...rents.map(([, v]) => v)) * 0.9 : 1;
  const hi = rents.length > 0 ? Math.max(...rents.map(([, v]) => v)) * 1.1 : 2;
  const span = Math.max(0.01, Math.log(hi) - Math.log(Math.max(1, lo)));
  const X = (v: number) => ((Math.log(Math.max(1, v)) - Math.log(Math.max(1, lo))) / span) * 100;
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker="What premises cost to run" sample={tagged} />
      {rents.length >= 2 ? (
        <>
          <div className="relative mt-1 h-[24px]" role="img" aria-label={"Commercial rent for a square metre, a year: " + rents.map(([l, v]) => l + " " + usd(v)).join(", ")}>
            <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--c-border)]" />
            {rents.map(([label, v]) => (
              <span key={label} className="absolute bottom-0 top-0" style={{ left: X(v) + "%" }}>
                <span className="absolute bottom-0 h-[12px] w-0 -translate-x-1/2" style={{ borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: "var(--c-line-strong)" }} />
              </span>
            ))}
          </div>
          <div className="relative mt-1 h-[42px] text-[length:var(--t-micro)] text-[var(--c-muted)]">
            {rents.map(([label, v]) => {
              const x = X(v);
              const pin = x > 82 ? "right" : x < 14 ? "left" : "centre";
              const style: React.CSSProperties =
                pin === "right" ? { right: 0 } : pin === "left" ? { left: 0 } : { left: x + "%", transform: "translateX(-50%)" };
              return (
                <span key={label} className={"absolute top-0 flex flex-col whitespace-nowrap " + (pin === "right" ? "items-end" : "")} style={style}>
                  <span>{label}</span>
                  <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(v)}</Fig>
                </span>
              );
            })}
          </div>
          <div className="mt-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">Commercial rent for a square metre, a year.</div>
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
      <div className="space-y-2.5">
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
      {isNum(addPct) ? (
        <div className="mt-3 flex flex-wrap items-baseline gap-x-1.5">
          <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">On top of gross pay, employers add</span>
          <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">+{addPct}%</Fig>
          <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">(pension auto-enrolment and insurance sit on top)</span>
        </div>
      ) : null}
      {isNum(labour) || isNum(informal) ? (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 border-t border-[var(--c-border)] pt-3">
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
            <div className="text-[length:var(--t-small)] font-semibold text-[var(--c-ink)]">{it.label}</div>
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
        {/* The 2-1 band the second batch made: the money grid takes the wide
            side, the customers card the narrow; the lens grid that stood here
            is retired, every tile by his own words. */}
        {Array.isArray(d.money?.list) || isNum(d.customers?.median_usd) ? (
          <Band split="2-1">
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
