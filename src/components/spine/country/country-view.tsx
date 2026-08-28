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
import { Band, Box, Fig, Rail, SampleTag, usd } from "@/components/spine/kit";
import { AtlasMark } from "@/components/spine/marks";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";

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
function Masthead({ name, hero }: { name: string; hero: any }) {
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
        <Masthead name={name} hero={d.hero} />
        <Cities cities={d.cities} />
      </main>
      <OnThisPage sections={RAIL_SECTIONS} />
    </>
  );
}

export default SpineCountryBody;
