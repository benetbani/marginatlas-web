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
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
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
  { id: "take", label: "The government take" },
  { id: "cities", label: "The cities" },
  { id: "peers", label: "Against the peers" },
  { id: "customers", label: "What customers earn" },
  { id: "lenses", label: "Lending, customers, currency" },
  { id: "money", label: "What an owner keeps" },
  { id: "character", label: "The character" },
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
 * state. Answer-first (rule 16): exactly one dominant figure, the composed
 * government take, at more than 1.6x the size of everything supporting it, and
 * the accent sits on that figure and nothing else (rule 37).
 *
 * THE COMPOSED TAKE NEVER RENDERS ALONE, which is the binding rule from the
 * 2026-08-28 review and the reason the field is named
 * government_take_composed_pct rather than government_take_pct. The figure sums
 * a tax on PROFIT with a tax on WAGES, two different denominators, so no single
 * "38.8 of every 100 of X" sentence about it is true. Both halves therefore ride
 * directly beneath it at support size with their bases named in plain words, and
 * if either half is missing the total does not draw at all: a sum whose parts
 * cannot be shown is a number a reader has no way to test.
 *
 * The business tax is labelled "main rate" because it is one. The seed carries
 * only the main rate, and most countries that publish one also publish a lower
 * small-profits rate, so an unqualified figure would overstate the burden for
 * exactly the small shops this site is written for.
 */
function Masthead({ name, hero, worldTakeMedian }: { name: string; hero: any; worldTakeMedian?: number }) {
  const take = isNum(hero?.government_take_composed_pct) ? hero.government_take_composed_pct : undefined;
  const onProfit = isNum(hero?.take_components?.corporate_rate_pct) ? hero.take_components.corporate_rate_pct : undefined;
  const onWages = isNum(hero?.take_components?.employer_payroll_pct) ? hero.take_components.employer_payroll_pct : undefined;
  const showTake = take != null && onProfit != null && onWages != null;

  const facts: SupportFact[] = Array.isArray(hero?.support) ? hero.support : [];
  const factFor = (key: string) => facts.find((f) => f?.key === key && isNum(f.value));
  const days = factFor("register_days");
  const cost = factFor("register_cost");
  const salesTax = factFor("sales_tax");

  /* Rule 4A, wired here rather than assumed: the block's confidence is the
     WEAKEST of every fact inside it (adapter finding I1), so anything short of
     measured marks the whole masthead. GB holds published rates for all of it
     and carries no tag; a tier-B country's interpolated sales tax pulls the
     block to modeled and the tag appears beside the crumb, where a reader meets
     it before the figures rather than after them. */
  const confidence = hero?._meta?.confidence;
  const tagged = typeof confidence === "string" && confidence !== "measured";

  /* THE SUBTITLE PROMISES WHAT THIS PAGE HOLDS FOR THIS COUNTRY, not what the
     page type usually holds. 65 of 195 countries hold no tax rates and 43 hold
     no registration figures, so a fixed sentence would promise a section that
     self-omitted two lines below it. Composed from what actually resolved, the
     same way the adapter composes its provenance line. */
  const promises: string[] = [];
  if (showTake) promises.push("what the state takes from a standard business");
  if (cost) promises.push("what it costs to register one");
  else if (days) promises.push("how long it takes to register one");
  const subtitle = promises.length > 0 ? `${promises.join(", and ").replace(/^./, (c) => c.toUpperCase())}.` : null;

  /* THE SUPPORT TILES, each guarding its own field. The business tax is
     deliberately NOT a tile: it is already printed above as half of the composed
     take, and one page printing one figure twice is the defect the whole rebuild
     exists to remove. */
  const tiles: Array<{ key: string; label: string; value: React.ReactNode; note?: string }> = [];
  if (days) {
    tiles.push({
      key: "days",
      label: "Time to register",
      value: (
        <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">
          {days.value} {days.value === 1 ? "day" : "days"}
        </Fig>
      ),
    });
  }
  if (cost) {
    /* A WORD IS NOT A FIGURE AND MUST NOT BE DRESSED AS ONE, the lesson the
       trade masthead paid for. A registration fee of nothing is real and
       measured in 30-odd countries, and "$0" reads as a missing number rather
       than as a fee that does not exist. It becomes a word, and it takes the
       reading face so the eye does not count it among the measurements.
       IT KEEPS THE FIGURES' LINE BOX, THOUGH, and this was visible in the
       picture before it was findable in the code. The word carried leading-none
       while its two neighbours carry the inherited 30px line, so at 768 and 1280
       "Free" sat two pixels high and "COST TO REGISTER" sat TEN pixels above
       "TIME TO REGISTER" and "SALES TAX": three tiles in one row reading as two
       rows. A different face is the point; a different baseline is a fault. */
    tiles.push({
      key: "cost",
      label: "Cost to register",
      value:
        cost.value === 0 ? (
          <span className="block text-[length:var(--t-head)] font-medium text-[var(--c-ink)]">Free</span>
        ) : (
          <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{usd(cost.value as number)}</Fig>
        ),
    });
  }
  if (salesTax) {
    tiles.push({
      key: "sales-tax",
      label: "Sales tax",
      value: <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{salesTax.value}%</Fig>,
      /* Carried only when the seed says so. Sales tax sits BESIDE the take and
         is never added into it, because the customer pays it; a reader who does
         not know that reads this tile as a fourth slice of the owner's burden. */
      note: salesTax.note ? "carried by the customer, not the owner" : undefined,
    });
  }

  return (
    <Band hero>
      <Box id="take">
        {/* The crumb, the settled spine form: muted uppercase with the altitude
            mark. A country page has one segment, because a country is the top of
            this site's altitude ladder: no Home step, and no ISO code, which is
            a database key and not a place a reader recognises. */}
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-[0.14em] text-[var(--c-ink2)]">{/* allow-eyebrow */}
          <span className="inline-flex items-center gap-1.5">
            <AtlasMark id="alt-country" size={13} className="opacity-55" />
            {name}
          </span>
          {tagged ? <SampleTag /> : null}
        </div>

        {/* Rule 35: semibold, never bold. Bold display "gives the page a feeling
            of being cheap". The size is a ladder step (--t-focal, 30px) and is
            deliberately BELOW the dominant figure: the page identity names the
            place, the figure answers the question, and only one of them may be
            the largest thing on the page. */}
        <h1
          id="headline"
          data-typography="custom"
          className="text-balance text-[length:var(--t-focal)] font-semibold leading-tight tracking-tight text-[var(--c-ink)]"
        >
          {name}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-[52ch] text-[length:var(--t-body)] text-[var(--c-ink2)]">{subtitle}</p>
        ) : null}

        {showTake ? (
          <div className="mt-6">
            <div className="text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">The government take</div>
            {/* The accent, and the only one on the page. --terra-text is the
                readable member of the terracotta family (the fill, --terra,
                carries about 2.5:1 against paper and cannot hold text); it is
                what every other masthead figure in the spine already uses. */}
            <div className="fig text-[length:var(--t-answer)] leading-none text-[var(--terra-text)]">{take}%</div>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1.5">
              {/* Each half keeps its own words on one line, so a phone wraps
                  BETWEEN the two halves and never through "on profit". The plus
                  travels with the second half for the same reason: on its own it
                  would be free to end a line, and a lone plus sign at a line
                  break reads as a typo rather than as an addition. */}
              <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{onProfit}%</Fig>
                <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">
                  on profit, <span className="text-[var(--c-muted)]">main rate</span>
                </span>
              </span>
              <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
                <span aria-hidden className="text-[length:var(--t-body)] text-[var(--c-muted)]">+</span>
                <Fig className="text-[length:var(--t-head)] text-[var(--c-ink)]">{onWages}%</Fig>
                <span className="text-[length:var(--t-body)] text-[var(--c-ink2)]">on wages</span>
              </span>
            </div>
            {isNum(worldTakeMedian) ? (
              <div className="mt-1.5 text-[length:var(--t-micro)] text-[var(--c-muted)]">
                the world median is {worldTakeMedian}%
              </div>
            ) : null}
          </div>
        ) : null}

        {/* THE TILES WRAP BEFORE THEY CLIP, and they are sized by their own
            contents rather than by a share of the row: the trade masthead
            arrived at this after a fixed three-column grid crushed "Demanding"
            to "Deman" on a phone and to "Demandin" at 900px, which is two
            failures from one number in a stylesheet. A row that wraps has no
            empty cells to leave showing either, so the last tile takes the rest
            of its line. The hairlines are the gap, hence the single background
            behind a one-pixel gap; the clip is what keeps the corners, and
            nothing inside can reach it. */}
        {tiles.length > 0 ? (
          <div
            className="mt-6 flex flex-wrap gap-px overflow-hidden rounded-[14px] border border-[var(--c-border)]"
            style={{ background: "var(--c-border)" }}
          >
            {tiles.map((t) => (
              <div key={t.key} className="flex-[1_1_auto] bg-[var(--c-card)] px-3.5 py-3">
                {t.value}
                <div className="mt-1 whitespace-nowrap text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">{t.label}</div>
                {t.note ? (
                  <div className="mt-0.5 whitespace-nowrap text-[length:var(--t-micro)] text-[var(--c-muted)]">{t.note}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </Box>
    </Band>
  );
}

/**
 * The cities , the second signature moment (art direction D5) and the funnel
 * rule 24 asks every higher page to carry: real clickable places leading a
 * reader down one altitude. The map takes the large side of a 3-2 band and the
 * city cards the small side, because the map is the drawing and the cards are
 * its index (D4, the split follows the content).
 *
 * FOUNDER VERDICT 6, 2026-08-27, is the whole reason this section looks the way
 * it does: "The cities of United Kingdom, you have given four cards two times,
 * catastrophe, and the upper cards are not even clickable." The cities appear
 * ONCE, and every card IS its link: one list, no echo of chips below it, and a
 * city whose page does not exist yet renders nothing at all rather than a card
 * that looks pressable and is not. A dead-looking card is worse than a missing
 * one, because a reader who presses it learns to stop pressing things.
 *
 * The map self-omits below three placed cities (plan correction 2), and the
 * card list self-omits when empty, so Chad renders no stub here (rule 21). The
 * map draws itself in a browser and not in a static capture, the same blind
 * spot the district map already carries; the emptiness gate names that class
 * rather than counting it as a hole, and the cards carry the section's whole
 * reading without it.
 */
function Cities({ cities }: { cities: any }) {
  const list: any[] = Array.isArray(cities?.list) ? cities.list : [];
  const linked = list.filter((c) => typeof c?.href === "string" && c.href.length > 0);
  const rawPoints: any[] = Array.isArray(cities?.map_points) ? cities.map_points : [];
  const points: SpinePoint[] = rawPoints
    .filter((p) => isNum(p?.lat) && isNum(p?.lng))
    .map((p) => ({ id: String(p.id ?? p.name), name: String(p.name), lat: p.lat, lng: p.lng, href: typeof p.href === "string" ? p.href : undefined }));
  const hasMap = points.length >= 3;
  if (linked.length === 0 && !hasMap) return null;

  return (
    <Band split="3-2">
      {hasMap ? (
        <Box id="cities" density="dense">
          <Rail icon="best-areas" kicker="The cities" />
          {/* The map is the craft object and gets the card's whole room; a
              shorter band than the city page's because four national pins need
              breathing room, not street detail. */}
          <SpineMap points={points} ariaLabel="Map of the covered cities" fitPadding={64} heightClass="h-[320px] w-full md:h-[420px]" fallbackNote="The map is drawing. Every city on it is in the list beside." />
        </Box>
      ) : null}
      <Box {...(hasMap ? {} : { id: "cities" })}>
        {hasMap ? (
          <div className="mb-2 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Open a city</div>
        ) : (
          <Rail icon="best-areas" kicker="The cities" />
        )}
        {/* One row per city, the whole row the link (verdict 6). The name leads,
            the region sits muted beside it, the arrow says it goes somewhere.
            Hover is INK, never the accent (rule 37). */}
        <div className="divide-y divide-[var(--c-border)]">
          {linked.map((c) => (
            <a
              key={c.id}
              href={c.href}
              className="group flex items-baseline justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className="min-w-0">
                <span className="text-[length:var(--t-body)] font-medium text-[var(--c-ink)] transition-colors group-hover:text-[var(--c-ink2)]">{c.name}</span>
                {c.region ? (
                  <span className="ml-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{c.region}</span>
                ) : null}
              </span>
              <span aria-hidden className="shrink-0 text-[length:var(--t-body)] text-[var(--c-muted)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
            </a>
          ))}
        </div>
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
    { key: "business_tax_pct", head: "Business tax", fmt: (v) => <>{v}%</>, best: (vs) => Math.min(...vs) },
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
        {/* AT PHONE WIDTH THE TABLE CLIPPED, photographed at 375: the last column
            read COST TO REGIST and the fee column read Fr. Five columns do not
            fit 343 pixels and must not pretend to. The table keeps its shape and
            scrolls INSIDE the card, which is the convention for a comparison a
            reader swipes across, and the first column stays sticky so the
            country names never leave the eye while the figures slide. */}
        <div className="overflow-x-auto">
        <Table className="min-w-[560px] text-[length:var(--t-small)]">
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
  const heroStatesTake = isNum(hero?.government_take_composed_pct);
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
  const onProfit = hero?.take_components?.corporate_rate_pct;
  const onWages = hero?.take_components?.employer_payroll_pct;

  const fmt = (l: any): { value: React.ReactNode; sub?: string } => {
    const v = l.value;
    switch (l.unit) {
      case "composed_pct":
        return {
          value: <>{v}%</>,
          sub: isNum(onProfit) && isNum(onWages) ? onProfit + "% on profit + " + onWages + "% on wages" : undefined,
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
                {l.key === "tax_burden" && isNum(l.context?.world_median_pct) ? (
                  <div className="mt-0.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">world median {l.context.world_median_pct}%</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Box>
  );
}

/**
 * What customers earn , the first CONNECT of plan correction 3: the pay spread
 * held for 195 of 195 countries and rendered nowhere. The form is the one the
 * city income card settled in round 3: marks on a scale, each label UNDER its
 * own mark, the typical figure a step larger and in the accent because it is
 * the card's answer, the outermost labels pinned inside the box (the
 * scale-end rule, four scales paid for it). The spread here is quartiles, so
 * the scale is linear; the city card's log scale exists for top-1-percent
 * tails this card does not carry.
 *
 * Quarter labels are words, not statistics: "lower quarter" and "upper
 * quarter" say what p25 and p75 are without the jargon rule 13 bans. The
 * basis sentence renders once for the whole card (N5).
 */
function Customers({ customers }: { customers: any }) {
  if (!isNum(customers?.p25_usd) || !isNum(customers?.median_usd) || !isNum(customers?.p75_usd)) return null;
  const p25 = customers.p25_usd, med = customers.median_usd, p75 = customers.p75_usd;
  const lo = p25 * 0.9, hi = p75 * 1.1, span = Math.max(1, hi - lo);
  const X = (v: number) => ((v - lo) / span) * 100;
  const tagged = typeof customers?._meta?.confidence === "string" && customers._meta.confidence !== "measured";
  const marks: Array<[string, number, boolean]> = [
    ["Lower quarter", p25, false],
    ["Typical", med, true],
    ["Upper quarter", p75, false],
  ];
  return (
    <Box id="customers">
      {/* The range glyph, not the shopping bag: at sixteen pixels the bag reads
          as a bin, the city page paid for that in round 3, and this card draws
          exactly what the range glyph depicts, a low-to-high band with the
          typical point marked. */}
      <Rail icon="spread" kicker="What customers earn" sample={tagged} />
      <div className="relative mt-1 h-[24px]" role="img" aria-label={"Full-time pay a year: lower quarter " + usd(p25) + ", typical " + usd(med) + ", upper quarter " + usd(p75)}>
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
      <div className="relative mt-1 h-[42px] text-[length:var(--t-micro)] text-[var(--c-muted)]">
        {marks.map(([label, v, accent]) => {
          const x = X(v);
          const edge = x > 82 ? "right" : x < 14 ? "left" : "centre";
          const style: React.CSSProperties =
            edge === "right" ? { right: 0 } : edge === "left" ? { left: 0 } : { left: x + "%", transform: "translateX(-50%)" };
          return (
            <span key={label} className={"absolute top-0 flex flex-col whitespace-nowrap " + (edge === "right" ? "items-end" : "")} style={style}>
              <span className={accent ? "font-semibold text-[var(--terra-text)]" : ""}>{label}</span>
              <Fig className={"font-semibold " + (accent ? "text-[length:var(--t-sub)] text-[var(--terra-text)]" : "text-[length:var(--t-body)] text-[var(--c-ink)]")}>{usd(v)}</Fig>
            </span>
          );
        })}
      </div>
      {customers.basis ? (
        <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{customers.basis}</div>
      ) : null}
    </Box>
  );
}

/** The trade glyphs for the everyday set, by slug. A trade without a glyph
 *  gets none rather than a wrong one. */
const TRADE_GLYPHS: Record<string, string> = {
  restaurants: "trade-restaurant",
  "grocery-stores": "trade-grocery",
  "hairdressers-beauty": "trade-salon",
  "sports-fitness": "trade-gym",
  "auto-repair-shops": "trade-auto",
  "cafes-coffee-shops": "trade-cafe",
};

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
        <Masthead
          name={name}
          hero={d.hero}
          worldTakeMedian={(Array.isArray(d.lenses?.list) ? d.lenses.list : []).find((l: any) => l?.key === "tax_burden")?.context?.world_median_pct}
        />
        <Cities cities={d.cities} />
        <Peers peers={d.peers} />
        {(() => {
          const customersShown = isNum(d.customers?.p25_usd) && isNum(d.customers?.median_usd) && isNum(d.customers?.p75_usd);
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
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
