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
  { id: "customers", label: "What customers earn" },
  { id: "lenses", label: "Lending, customers, currency" },
  { id: "money", label: "What an owner keeps" },
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
 * The masthead , where the reader is, and the one number this page exists to
 * state. Rebuilt 2026-08-30 to five founder verdicts, all recorded in
 * FOUNDER-VERDICTS.md that day:
 *
 * 1. THE ANSWER IS THE SMALL-BUSINESS EFFECTIVE RATE, and its label is "Total
 *    effective tax burden". The composed profit+wages sum and its name "the
 *    government take" are retired ("what's the point of saying the government
 *    take?"). The rate comes from the SMB regime table, whose own header
 *    reasons exactly as he did: headline CIT is the wrong frame for small
 *    shops. The employer payroll rate is a SEPARATE burden on a SEPARATE base
 *    and renders beside the answer, never summed into it.
 * 2. THE NAME APPEARS ONCE, WITH ITS FLAG. The old crumb spelled the country
 *    name above the H1 that also spelled it, and the flag was missing
 *    ("duplicates are completely forbidden... the flag is very important").
 *    One identity row: altitude mark, flag, H1.
 * 3. NO WORLD-MEDIAN LINE ("a little bit disgusting").
 * 4. THE SUPPORT FACTS ARE ONE QUIET SENTENCE, never tiles ("things that
 *    don't really need their own cards and so much space").
 * 5. Hierarchy: the answer at 48 is the only large thing; everything else
 *    supports it (rule 16, the 1.6x rule, kept).
 *
 * The SMB rate is a conservative modeled read at median SMB revenue (the
 * module says so), so it contributes "modeled" to the block's weakest-of
 * confidence and GB now carries the honesty tag here. That is the honest
 * price of the more honest number.
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

  /* Rule 4A: the block's confidence is the WEAKEST of every fact inside it,
     and the SMB effective rate is modeled by its own module's admission, so
     the tag now appears wherever the answer does. */
  const confidence = hero?._meta?.confidence;
  const tagged = typeof confidence === "string" && confidence !== "measured";

  /* The subtitle promises what this page holds for THIS country, composed
     from what resolved, never promising an absent section. */
  const promises: string[] = [];
  if (rate != null) promises.push("what a small business effectively pays the state");
  if (cost) promises.push("what it costs to register one");
  else if (days) promises.push("how long it takes to register one");
  const subtitle = promises.length > 0 ? `${promises.join(", and ").replace(/^./, (c) => c.toUpperCase())}.` : null;

  /* THE QUIET SENTENCE (verdict 4). Each clause guards its own field and
     drops out silently; a zero fee is the word "nothing", never $0. */
  const clauses: string[] = [];
  const dayWord = days ? `${days.value} ${days.value === 1 ? "day" : "days"}` : null;
  const costWord = cost ? (cost.value === 0 ? "nothing" : usd(cost.value as number)) : null;
  if (dayWord && costWord) clauses.push(`Registering takes ${dayWord} and costs ${costWord}`);
  else if (dayWord) clauses.push(`Registering takes ${dayWord}`);
  else if (costWord) clauses.push(`Registering costs ${costWord}`);
  if (salesTax) clauses.push(`sales tax is ${salesTax.value}%, carried by the customer`);
  const factLine = clauses.length > 0 ? clauses.join("; ") + "." : null;

  return (
    <Band hero>
      <Box id="take">
        {/* The identity row: the altitude mark, the flag, the name , ONCE. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <AtlasMark id="alt-country" size={13} className="opacity-55" />
          {iso2 ? <CountryFlag iso2={iso2} className="w-9 shrink-0" /> : null}
          {/* Rule 35: semibold, never bold. Focal 30, below the answer's 48:
              the identity names the place, the figure answers the question,
              and only one of them may be the largest thing on the page. */}
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

        {rate != null ? (
          <div className="mt-6">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Total effective tax burden</div>
            {/* The accent, and the only one on the page at answer size. */}
            <div className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{rate}%</div>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
              <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
                on profit, for a small business
                {regime ? (
                  <>
                    {" "}under <span className="text-[var(--c-ink)]">{regime}</span>
                  </>
                ) : null}
              </span>
              {payroll != null ? (
                <span aria-hidden className="text-[length:var(--t-body)] text-[var(--c-muted)]">&middot;</span>
              ) : null}
              {payroll != null ? (
                /* A separate burden on a separate base: named beside, never
                   summed. The words say "separate" so a reader cannot add
                   the two rates into a number that is true of nothing. */
                <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                  <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{payroll}%</Fig>
                  <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">employer costs on wages, separate</span>
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {factLine ? (
          <p className="mt-6 max-w-[64ch] text-[length:var(--t-small)] text-[var(--c-ink2)]">{factLine}</p>
        ) : null}
      </Box>
    </Band>
  );
}

/**
 * The cities , rebuilt 2026-08-30. FOUNDER VERDICT, verbatim: "we should
 * avoid the functionality of the map... remove the map altogether and just
 * replace everything with the cards. The standard row should have five cities
 * maximum, and if there are more, the person can click left or right. And we
 * should have an option so the person sees the full list of cities, which
 * redirects him to the terminal." The SpineMap import left this file with the
 * verdict, and with it the map's camera blind spot: every element here
 * photographs statically.
 *
 * Verdict 6 (2026-08-27) still binds: the cities appear ONCE and every card
 * IS its link; a city whose page does not exist renders nothing at all.
 */
function Cities({ cities }: { cities: any }) {
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
          allHref="/cities"
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
 * The lens grid , what REPLACES the hexagon, and the shape of the replacement
 * is the whole argument (founder 2026-08-27, verbatim: "this hexagon. It's
 * overloaded with information... and it occupies the full width"; art direction
 * ratified 2026-08-25: a wrong form is REPLACED, not tidied).
 *
 * A LENS THE MASTHEAD ALREADY STATED DOES NOT RESTATE. The first render of this
 * grid printed 38.8 percent twice on one screen, once in the hero and once as
 * the tax lens, and "1 day" twice, which is the exact fault round 3 closed on
 * the trade page (one number, three cards). The grid therefore drops any lens
 * whose figure the masthead carries, and the one reading that would have been
 * lost with it, the world-median take, moves UP into the masthead where the
 * figure it gives meaning to lives. What remains here is what the page has not
 * yet said: pay, lending, customers, currency.
 *
 * The radar put six word-ratings at six positions on axes with no units, printed
 * every word twice, and stretched one reading across the page. What stands in
 * its place is six PUBLISHED FIGURES, each a tile: a plain label, one number
 * with its unit, and a one-line context where the seed carries one. No scale is
 * drawn, so no position can fake precision (the form catalogue's meter do-not),
 * and a grid of six distinct tiles is the founder's own sanctioned pattern
 * ("six neighborhoods... those are six different pieces").
 *
 * The tax tile obeys the composed-take rule: the total never renders without
 * its two components, here as the tile's own sub-line.
 *
 * Direction is not drawn because nothing is ranked: a burden's tile reads as
 * what it costs, a strength's tile as what it pays, and the label wording does
 * the teaching (rule 40) rather than an arrow doing the asserting.
 */
function Lenses({ lenses, hero, customersShown }: { lenses: any; hero: any; customersShown?: boolean }) {
  const all: any[] = Array.isArray(lenses?.list) ? lenses.list : [];
  const heroStatesTake = isNum(hero?.effective_burden?.rate_pct);
  const heroFacts: SupportFact[] = Array.isArray(hero?.support) ? hero.support : [];
  const heroStatesDays = heroFacts.some((f) => f?.key === "register_days" && isNum(f.value));
  const list = all.filter((l) => {
    if (l.key === "tax_burden" && heroStatesTake) return false;
    if (l.key === "entry" && heroStatesDays) return false;
    /* The customers section states the median pay ON A SPREAD, which is the same
       figure this lens carried alone; one page, one statement of one number. */
    if (l.key === "talent" && customersShown) return false;
    return true;
  });
  if (list.length < 3) return null;
  const tagged = typeof lenses?._meta?.confidence === "string" && lenses._meta.confidence !== "measured";


  const fmt = (l: any): { value: React.ReactNode; sub?: string } => {
    const v = l.value;
    switch (l.unit) {
      case "composed_pct":
        /* The lens carries its own components (the adapter's Lens type), so
           the composed total never renders without what it is a sum of even
           now the hero no longer holds take_components. */
        return {
          value: <>{v}%</>,
          sub: isNum(l.profit_tax_pct) && isNum(l.payroll_tax_pct) ? l.profit_tax_pct + "% on profit + " + l.payroll_tax_pct + "% on wages" : undefined,
        };
      case "days":
        return { value: <>{v} {v === 1 ? "day" : "days"}</>, sub: "to legally trading" };
      case "usd_per_year":
        return { value: <>{usd(v)}</>, sub: "typical full-time pay, a year" };
      case "pct":
        return l.key === "finance"
          ? { value: <>{v}%</>, sub: "typical bank lending rate" }
          : {
              value: <>{v}%</>,
              sub: isNum(l.context?.inflation_5y_avg_pct)
                ? "currency swing a year; inflation " + l.context.inflation_5y_avg_pct + "% averaged over five"
                : "currency swing a year",
            };
      case "index_world_median_100":
        return { value: <>x{(v / 100).toFixed(2)}</>, sub: "the world-median wage" };
      default:
        return { value: <Fig>{String(v)}</Fig> };
    }
  };

  return (
      <Box id="lenses">
        <Rail icon="gut-check" kicker={customersShown ? "Lending, customers, currency" : "Pay, lending, customers, currency"} sample={tagged} />
        {/* NO BREAKPOINT. The first version pitched two columns at a width class
            the width gate refuses to grow (a phone never reaches it, so the
            second layout exists for nobody). Tiles ask for a readable minimum
            and wrap when they cannot have it: one column on a phone, two in
            this band, at every width in between, with no number in a stylesheet
            to be wrong. The same lesson as the trade page closing row. */}
        <div className="flex flex-wrap gap-x-6 gap-y-5">
          {list.map((l: any) => {
            const f = fmt(l);
            return (
              <div key={l.key} className="min-w-[15rem] flex-[1_1_15rem]">
                <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{l.label}</div>
                <Fig className="mt-1 block text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{f.value}</Fig>
                {f.sub ? (
                  <div className="mt-1 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{f.sub}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Box>
  );
}

/**
 * What customers earn , THE SPREAD IS DARK (2026-08-30, notation N9). The
 * founder's convention is deciles, verbatim: "we should seek to find the
 * average, the top ten percent and the bottom ten percent. Instead you are
 * just saying the lower quarter or the upper quarter... that's not very
 * helpful." The profile today carries only quartiles (wage_p25/p75_usd), and
 * quartiles relabelled as deciles would be a fabricated statistic, so the
 * scale drawing does not render until wage_p10_usd / wage_p90_usd exist (the
 * queued data task). Until then the card states the typical figure alone.
 * The tick-scale form and its edge rules are preserved in the blueprint for
 * the day the deciles land; quartile words never render again.
 */
function Customers({ customers }: { customers: any }) {
  if (!isNum(customers?.median_usd)) return null;
  const tagged = typeof customers?._meta?.confidence === "string" && customers._meta.confidence !== "measured";
  return (
    <Box id="customers">
      <Rail icon="spread" kicker="What customers earn" sample={tagged} />
      <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Typical pay</div>
      {/* Accent register entry 2: the customers card's answer. */}
      <Fig className="mt-1 block text-[length:var(--t-sub)] font-semibold leading-none text-[var(--terra-text)]">{usd(customers.median_usd)}</Fig>
      <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{customers.basis ?? "Full-time pay, a year."}</div>
    </Box>
  );
}

/**
 * The money , what an owner keeps, trade by trade, and the funnel rule 24 asks
 * for: every row is a real link down to that trade's national page. The whole
 * block is modeled at country altitude and says so with the tag; every figure
 * inside it came through the SAME engine the trade pages run, so the two can
 * never disagree.
 *
 * WITHHELD IS SAID, NEVER SILENT. The adapter screens out any keep past six
 * times the country's own typical pay (the founder's 2026-08-29 decision,
 * applied as one fixed formula), and this section prints how many rows that
 * screen held back. A row that quietly vanished would read as coverage; a
 * counted withholding reads as honesty, which is the difference this site is
 * built on.
 *
 * No bars (rule 25's budget is precious and length would encode nothing a
 * reader needs here): each trade is a row, the keep is the row's figure in ink,
 * the cost to open rides muted beside it, the arrow says it goes somewhere.
 */
function Money({ money }: { money: any }) {
  const rows: any[] = (Array.isArray(money?.list) ? [...money.list] : []).sort((x, y) => (y?.keeps_usd_year ?? 0) - (x?.keeps_usd_year ?? 0));
  if (rows.length < 2) return null;
  const tagged = typeof money?._meta?.confidence === "string" && money._meta.confidence !== "measured";
  return (
    <Band>
      <Box id="money">
        <Rail icon="owner-keeps" kicker="What an owner keeps, trade by trade" sample={tagged} />
        <div className="divide-y divide-[var(--c-border)]">
          {rows.map((r: any) => (
            <a key={r.slug} href={r.href} className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0">
              <span className="flex min-w-[11rem] flex-[1_1_11rem] items-baseline gap-2">
                <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)] transition-colors group-hover:text-[var(--c-ink2)]">{r.name}</span>
              </span>
              <span className="flex items-baseline gap-x-3 whitespace-nowrap">
                <Fig className="text-[length:var(--t-body)] font-semibold text-[var(--c-ink)]">{usd(r.keeps_usd_year)}</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">kept a year</span>
              </span>
              <span className="flex items-baseline gap-x-1.5 whitespace-nowrap">
                <Fig className="text-[length:var(--t-small)] text-[var(--c-ink2)]">{usd(r.cost_to_open_usd)}</Fig>
                <span className="text-[length:var(--t-micro)] text-[var(--c-muted)]">to open</span>
              </span>
              <span aria-hidden className="ml-auto shrink-0 text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
            </a>
          ))}
        </div>
        {money?.withheld?.reason ? (
          <p className="mt-2.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">{money.withheld.reason}</p>
        ) : null}
      </Box>
    </Band>
  );
}

/**
 * The character , the TWO ratified six-spectra tables, state and people, kept
 * whole: round 4 judged this the closest thing on the legacy page to the
 * current law, and dropping or butchering the pair is a standing founder rule
 * (2026-06-18). The pole words are the legacy page's own ratified wording,
 * carried verbatim; the positions are the same published-index-anchored reads,
 * normalised exactly as the legacy route normalised them (government scores run
 * 0 to 10, culture scores 1 to 10, and collapsing that difference is how a
 * position would silently shift by half a step).
 *
 * TAGGED AS MODELED, which is a change from the legacy page: these are
 * hand-anchored reads against published indices, not measurements, and behind a
 * seed the tag gate can finally see them.
 *
 * The two real percentages, born abroad and foreign-owned firms, ride beside
 * the people table as plain facts, exactly where the legacy page put them and
 * round 4 called them "the only true numbers" on the card.
 */
function Character({ character }: { character: any }) {
  const gov = character?.government;
  const cu = character?.culture;
  if (!gov && !cu) return null;
  const tagged = typeof character?._meta?.confidence === "string" && character._meta.confidence !== "measured";
  const norm10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, v / 10)) : null);
  const norm1to10 = (v: unknown) => (isNum(v) ? Math.max(0, Math.min(1, (v - 1) / 9)) : null);
  const row = (pos: number | null, spectrum: string, left: string, right: string) =>
    pos == null ? null : { spectrum, left_label: left, right_label: right, position_0_1: pos };
  const govRows = gov
    ? [
        row(norm10(gov.tax_predictability), "tax", "Erratic", "Predictable"),
        row(norm10(gov.low_bribery), "bribery", "Greased", "Clean"),
        row(norm10(gov.task_efficiency), "tasks", "Slow", "Efficient"),
        row(norm10(gov.time_efficiency), "time", "Long", "Short"),
        row(norm10(gov.judicial_impartiality), "courts", "Partial", "Impartial"),
        row(norm10(gov.innovation_capacity), "new", "Resistant", "Receptive"),
      ].filter(Boolean)
    : [];
  const cuRows = cu
    ? [
        row(norm1to10(cu.openness_to_foreigners), "open", "Insular", "Welcoming"),
        row(norm1to10(cu.innovation), "innovation", "Tradition-bound", "Embraces the new"),
        row(norm1to10(cu.communication_directness), "direct", "Indirect", "Direct"),
        row(norm1to10(cu.punctuality), "punctual", "Loose", "Strict"),
        row(norm1to10(cu.corruption_rejection), "straight", "Tolerated", "Rejected"),
        row(norm1to10(cu.ambition_chest_beating), "ambition", "Understated", "Loud"),
      ].filter(Boolean)
    : [];
  if (govRows.length === 0 && cuRows.length === 0) return null;
  return (
    <Band split="1-1">
      {govRows.length > 0 ? (
        <Box id="character">
          <Rail icon="red-tape" kicker="Dealing with the state" sample={tagged} />
          <SpectraTable rows={govRows} />
        </Box>
      ) : null}
      {cuRows.length > 0 ? (
        <Box {...(govRows.length === 0 ? { id: "character" } : {})}>
          <Rail icon="who-for" kicker="Dealing with people" sample={tagged} />
          <SpectraTable rows={cuRows} />
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
 * Getting set up + what premises cost , Task 16, a 3-2 band.
 *
 * The legal-form table is the one piece of the legacy page the July-5 review
 * marked "execution GOOD, keep": tier, local name, fee, filing time, and the
 * complexity read as dots. The dots are QUIET, ink on line, because complexity
 * is furniture here, not an answer (rule 37), and a zero fee is the word Free.
 *
 * Premises: the two CONNECTs of plan correction 3 that belong to running a
 * site, rent by location tier and commercial electricity. The lending rate the
 * seed also carries is NOT here: the lens grid already states it, and one page
 * says one number once. Rent tiers are three labelled figures on one line, the
 * spread IS the reading (prime runs nearly eight times edge in the UK), and the
 * unit is named once for all three (N5).
 */
function Setup({ setup }: { setup: any }) {
  const tiers: any[] = Array.isArray(setup?.tiers) ? setup.tiers : [];
  if (tiers.length === 0) return null;
  const tagged = typeof setup?._meta?.confidence === "string" && setup._meta.confidence !== "measured";
  return (
    <Box id="setup">
      <Rail icon="register-cost" kicker="Registering, by legal form" sample={tagged} />
      <div className="divide-y divide-[var(--c-border)]">
        {tiers.map((t: any) => (
          <div key={t.tier} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0">
            <span className="min-w-[9rem] flex-[1_1_9rem]">
              <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">{t.tier}</span>
              {t.local_term && t.local_term !== t.tier ? (
                <span className="ml-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{t.local_term}</span>
              ) : null}
            </span>
            <span className="whitespace-nowrap">
              {t.cost_usd === 0 ? (
                <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)]">Free</span>
              ) : isNum(t.cost_usd) ? (
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{usd(t.cost_usd)}</Fig>
              ) : null}
            </span>
            {isNum(t.days) ? (
              <span className="whitespace-nowrap">
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink2)]">{t.days} {t.days === 1 ? "day" : "days"}</Fig>
              </span>
            ) : null}
            {isNum(t.complexity_1_5) ? (
              <span aria-label={"complexity " + t.complexity_1_5 + " of 5"} className="ml-auto flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: i <= t.complexity_1_5 ? "var(--c-ink2)" : "var(--c-soft2)" }}
                  />
                ))}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </Box>
  );
}

function Premises({ premises }: { premises: any }) {
  const prime = premises?.rent_prime_usd_sqm_year;
  const mid = premises?.rent_mid_usd_sqm_year;
  const edge = premises?.rent_edge_usd_sqm_year;
  const kwh = premises?.electricity_usd_per_kwh;
  const hasRent = isNum(prime) || isNum(mid) || isNum(edge);
  if (!hasRent && !isNum(kwh)) return null;
  const tagged = typeof premises?._meta?.confidence === "string" && premises._meta.confidence !== "measured";
  const rents: Array<[string, number]> = [];
  if (isNum(prime)) rents.push(["Prime street", prime]);
  if (isNum(mid)) rents.push(["Ordinary street", mid]);
  if (isNum(edge)) rents.push(["Edge of town", edge]);
  return (
    <Box id="premises">
      <Rail icon="commercial-rent" kicker="What premises cost to run" sample={tagged} />
      {rents.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {rents.map(([label, v]) => (
              <div key={label} className="min-w-[7rem]">
                <Fig className="block text-[length:var(--t-head)] leading-none text-[var(--c-ink)]">{usd(v)}</Fig>
                <div className="mt-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Commercial rent for a square metre, a year.</div>
        </>
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
  if (isNum(floor)) bars.push(["Wage floor", floor, "var(--chart-4)"]);
  if (isNum(typical)) bars.push(["Typical pay", typical, "var(--c-ink2)"]);
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
        <Cities cities={d.cities} />
        <Peers peers={d.peers} />
        {(() => {
          const customersShown = isNum(d.customers?.median_usd);
          const lensNode = <Lenses lenses={d.lenses} hero={d.hero} customersShown={customersShown} />;
          if (!customersShown) return <Band>{lensNode}</Band>;
          return (
            <Band split="2-3">
              <Customers customers={d.customers} />
              {lensNode}
            </Band>
          );
        })()}
        <Money money={d.money} />
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
