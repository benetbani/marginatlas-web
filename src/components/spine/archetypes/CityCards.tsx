"use client";
/**
 * CityCards , THE CITY CARD, IN THREE LOOKS, AND THE LOOK IS THE ONLY THING
 * THAT DIFFERS.
 *
 * Founder, 2026-09-10, on reference B11: "those coloured beautiful vertical
 * cards of cities should be used by us for cities too." The cards he was
 * pointing at are tall, saturated colour fields with the city name set large,
 * a couple of details under it and a link at the foot. He called ours stale
 * and bland, and the photograph of them says he is right: a name, a region, an
 * arrow, and on one of 252 cities a grey map.
 *
 * THE PROBLEM HE HAS NOT SEEN, WHICH THIS FILE EXISTS TO ANSWER. His reference
 * gets its beauty from a full-bleed photograph, and he killed photographs on
 * 2026-09-07 and confirmed it when asked ("No photographs anywhere"), partly
 * because only one covered city holds an image at all. His reference is also
 * blue, teal and purple, and this palette is terracotta and warm neutrals with
 * green banned outright. So the card has to find its beauty without a picture
 * and inside one accent hue, and there is no single right answer to that. Three
 * are built, they differ in KIND rather than in degree, and he chooses:
 *
 *   "field"   COLOUR. A terracotta field whose strength is what a customer
 *             there earns, measured across the cities on the card. The tint is
 *             the figure drawn, the way the district card's bars are; no card
 *             is crowned and no card carries a pill.
 *   "plate"   TYPE, and nothing else. No colour, no mark: white, a hairline,
 *             and the name set large in the display face over a quiet foot.
 *             Proportion and scale do the whole job, the way a book cover does.
 *   "column"  A GENERATED MARK, deterministic from the city's own figure, so
 *             252 cities cost nothing to draw. A slim track down the card's
 *             left edge fills from the bottom to that city's pay as a part of
 *             the highest-earning city on the card. The row reads as a skyline
 *             and every mark is a real measurement, not an ornament.
 *
 * THE LAW, WHICH ALL THREE OBEY, AND IT IS WRITTEN HERE ONCE.
 *  - TALL. A card is at least 12.5rem tall at every width, which at the 155px
 *    track a 693px band gives it is a 1.29 ratio, so the proportion of his
 *    reference survives the phone, where cards die more than anywhere. The
 *    harness measures it rather than trusting it (NOT TALL).
 *  - THE NAME IS THE LOUDEST THING ON THE CARD, at 20 (`--t-head`, the rung a
 *    heading takes). Not 30: `--t-focal` is one focal figure per CARD and the
 *    cities section is one card, so four names at 30 would be four focals, and
 *    24 is the h1's rung. 20 over the 12 beside it is 1.67, which clears the
 *    contrast law.
 *  - TWO SUPPORTING DETAILS AND NO MORE: the region it sits in, and what an
 *    average customer there earns in a year. Both real, both off the covered
 *    city list, and the second is the very figure that city's own page opens
 *    with, so the card promises what the page delivers.
 *  - THE UNIT IS SAID ONCE, in the basis line under the row, never in a cell
 *    (PART 5).
 *  - A DOOR AT THE FOOT. The whole card navigates, so it carries an arrow at
 *    its right edge and a hover, and nothing on the card looks like a link and
 *    is not one (LINKS LOOK LIKE LINKS).
 *  - EQUAL HEIGHTS BY CONSTRUCTION, his ruling 7: the grid stretches, every
 *    card is `h-full`, and the name block RESERVES its second line on every
 *    card, so a one-word city and a two-line city are the same object. Never by
 *    content luck.
 *  - NO PHOTOGRAPH, no per-city art, nothing that would have to be drawn 252
 *    times.
 *
 * WHAT THE SHARE MAY CLAIM. `payShare` is ordinal, and the field look uses it
 * for tint depth: the claim is only "this one is more than that one", and the
 * whole set it is measured within is drawn beside it with every absolute figure
 * printed. `payOfTop` is zero-based, and the column look uses it for a mark
 * whose length reads as a proportion, which is the one thing a bar may not
 * lie about. Where there is no set to scale within (one city, or every city on
 * the same figure), neither look draws: an empty track reads as zero, and zero
 * is not what "not held" means.
 */
import * as React from "react";
import type { CityCard } from "@/lib/spine/city_cards";

export type CityCardsLook = "field" | "plate" | "column";

/* FOUR A PAGE, the card pager's own arithmetic, kept: the cities card is the
   two-thirds band, 693px at 1280, whose inner 653px holds four tracks and not
   five, and five put one card alone on a second row. Four is inside his
   "five cities maximum" of 2026-08-30 and it fills the row. */
const PER_PAGE = 4;

/* THE TINT RANGE. The lightest card still has to read as a colour, or the row
   looks like one coloured card and three that failed to load; the deepest has
   to stay a field under black ink, not a block of paint. 0.30 to 0.88 of
   `--terra` over the white card, drawn as an opacity on a token so the ramp
   needs neither a new token nor a hex nor color-mix. */
const TINT_LOW = 0.3;
const TINT_HIGH = 0.88;

/* ONE GRAMMAR FOR THE WHOLE COLUMN, decided by the set and not by each figure
   (PART 5: every figure in a column shares one font, one size, one weight and
   one decimal count). The site's `usd()` switches to thousands at 10,000, which
   inside one set of cities would print "$8,400" beside "$12K": the same column
   in two notations. The set decides once, and it rounds to thousands only when
   its own SMALLEST figure can carry the rounding. */
const moneyFor = (pays: number[]) => {
  const k = pays.length > 0 && Math.min(...pays) >= 1e4;
  return (v: number) => (k ? "$" + Math.round(v / 1000) + "K" : "$" + Math.round(v).toLocaleString("en-US"));
};

export function CityCards({
  cards,
  allHref,
  allLabel,
  basis,
  basisDrawn,
  look = "field",
  prevLabel = "Previous",
  nextLabel = "More",
}: {
  cards: CityCard[];
  allHref: string;
  allLabel: string;
  /** One line, said once for the whole row: what the figure is, and nothing
   *  else. Printed on its own whenever the look draws no tint and no mark. */
  basis: string;
  /** The same line plus the clause that reads the drawing ("the darker the
   *  card, the more"). Printed only when a drawing is actually on the page: a
   *  set of one has nothing to scale within, draws nothing, and must not carry
   *  a sentence describing a drawing that is not there. */
  basisDrawn?: string;
  look?: CityCardsLook;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const [page, setPage] = React.useState(0);
  const rows = cards.length < 3;
  const pays = cards.map((c) => c.payUsd).filter((v): v is number => typeof v === "number");
  const fmt = moneyFor(pays);
  const drawn = look !== "plate" && cards.some((c) => typeof c.payShare === "number");
  const pages = Math.max(1, Math.ceil(cards.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = cards.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-[14px] border border-[var(--c-border)] text-[var(--c-ink2)] transition-colors hover:border-[var(--c-ink2)] hover:text-[var(--c-ink)] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]";
  return (
    <div data-archetype="city-cards" data-look={look} data-form={rows ? "rows" : "grid"} data-count={cards.length}>
      {pages > 1 ? (
        <div className="mb-2 flex items-center justify-end gap-1.5">
          <span className="mr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{cur + 1} of {pages}</span>
          <button type="button" aria-label={prevLabel} disabled={cur === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className={btn}><span aria-hidden>&#8592;</span></button>
          <button type="button" aria-label={nextLabel} disabled={cur >= pages - 1} onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} className={btn}><span aria-hidden>&#8594;</span></button>
        </div>
      ) : null}
      {/* 9rem is the measured minimum that keeps two tracks in a 302px tablet
          card; two up on a phone is the founder's own (2026-08-30).

          BELOW THREE CITIES THE FORM CHANGES, AND IT IS NOT A FALLBACK WITH AN
          APOLOGY UNDER IT (rule 22 bans that; this is what the range strip
          already does at one mark). Four tall cards fill a 653px row; ONE tall
          card leaves 500px of white beside it, which is the unfilled right edge
          he raised against this very section (rule 25), measured at 502 by 216
          by the harness before this line existed. So a set of one or two draws
          the model's own full-width row instead: same content, same name size,
          same figure, the arrow at the right edge, and no hole. */}
      <div className={rows ? "grid grid-cols-1 items-stretch auto-rows-fr" : "grid grid-cols-2 items-stretch gap-2 md:[grid-template-columns:repeat(auto-fill,minmax(9rem,1fr))]"}>
        {slice.map((c) => (rows ? <Row key={c.id} card={c} look={look} fmt={fmt} /> : <Card key={c.id} card={c} look={look} fmt={fmt} />))}
      </div>
      <p className="mt-2.5 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{drawn && basisDrawn ? basisDrawn : basis}</p>
      <div className="mt-1.5 text-right">
        <a href={allHref} className="text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{allLabel} <span aria-hidden>&#8594;</span></a>
      </div>
    </div>
  );
}

function Card({ card, look, fmt }: { card: CityCard; look: CityCardsLook; fmt: (v: number) => string }) {
  const field = look === "field";
  const tint = field && typeof card.payShare === "number" ? TINT_LOW + (TINT_HIGH - TINT_LOW) * card.payShare : null;
  /* On a terracotta field every line goes to `--c-ink`: `--c-muted` reads about
     3.3 to 1 on the deepest step, under the floor this repo holds, and the
     hierarchy is carried by size (20 over 12), never by greying a line out. */
  const quiet = field ? "text-[var(--c-ink)]" : "text-[var(--c-muted)]";
  /* The field look wears a TRANSPARENT border rather than none, so the box
     model is identical in all three looks (a photograph of one against another
     is then a photograph of the design and not of a one-pixel difference) and
     so the hover has an edge to colour without moving anything. */
  const edge = field ? "border border-transparent" : "border border-[var(--c-border)]";
  return (
    <a
      href={card.href}
      data-card={card.id}
      className={`group relative flex h-full min-h-[12.5rem] flex-col overflow-hidden rounded-[14px] px-3 py-2.5 transition-colors hover:border-[var(--c-ink2)] ${edge}`}
    >
      {tint != null ? <span aria-hidden data-tint className="absolute inset-0" style={{ background: "var(--terra)", opacity: tint }} /> : null}
      {look === "column" ? <Mark part={card.payOfTop} /> : null}
      <span className="relative flex h-full flex-col">
        {/* THE PLATE PUTS ITS AIR AT THE TOP AND STANDS THE NAME ON THE FOOT
            RULE, and that is the whole difference between a composition and a
            hollow box. Photographed with the name at the top (2026-09-10,
            scratchpad/photos), the card read as four empty white rectangles
            with a word in the corner: air BELOW type reads as a card that ran
            out of content, air ABOVE it reads as a margin. The other two looks
            keep the name at the top, because a colour field and a mark already
            fill what the plate has to fill with proportion. */}
        {look === "plate" ? <span className="mt-auto" /> : null}
        {/* THE NAME, AND ITS SECOND LINE IS RESERVED ON EVERY CARD, whether it
            wraps or not, so the row is one object and not four accidents. */}
        <span
          data-city-name
          className={`block text-[length:var(--t-head)] leading-[1.15] tracking-tight text-[var(--c-ink)] ${field ? "font-semibold" : "font-serif font-semibold"}`}
          style={{ minHeight: "calc(2 * 1.15 * var(--t-head))", overflowWrap: "normal" }}
        >
          {card.name}
        </span>
        {card.region ? <span className={`block truncate text-[length:var(--t-micro)] leading-snug ${quiet}`}>{card.region}</span> : null}
        {look === "plate" ? null : <span className="mt-auto" />}
        <span className={`flex items-baseline justify-between gap-2 pt-2 ${field ? "" : "border-t border-[var(--c-border)]"}`}>
          {/* `.fig` is the site's figure face and it resolves off a variable the
              spine shell owns; `font-serif` names the same family off the
              variable the root layout owns, so the figure reads in one face on
              the page AND in the harness sheet, which mounts no shell. */}
          <span className="fig font-serif tabular-figures text-[length:var(--t-body)] leading-none text-[var(--c-ink)]">
            {typeof card.payUsd === "number" ? fmt(card.payUsd) : ""}
          </span>
          <span aria-hidden className={`shrink-0 text-[length:var(--t-body)] leading-none transition-transform group-hover:translate-x-0.5 ${field ? "text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>&#8594;</span>
        </span>
      </span>
    </a>
  );
}

/** THE COLUMN LOOK'S MARK: the card's whole left edge, filled from the bottom
 *  to this city's pay as a part of the highest pay on the card.
 *
 *  IT IS FULL-BLEED AT THE EDGE, AND THAT IS A MEASUREMENT, NOT A STYLE. An
 *  inset track costs the name its horizontal room: at 375 a two-up card is
 *  147px wide, its content 123px, and "Birmingham" at 20px needs about 118, so
 *  a 16px inset clipped two names of four in the harness's own photograph. At
 *  the edge the mark costs the name nothing, because the card's own 12px
 *  padding already clears it.
 *
 *  Nothing is drawn when there is no set to scale within: an empty track reads
 *  as zero, and zero is not what "not held" means. */
function Mark({ part }: { part?: number }) {
  if (typeof part !== "number" || !Number.isFinite(part) || part <= 0) return null;
  const pct = Math.max(4, Math.min(100, part * 100));
  return (
    <span aria-hidden data-mark className="absolute inset-y-0 left-0 w-1.5 overflow-hidden" style={{ background: "var(--c-soft2)" }}>
      <span className="absolute inset-x-0 bottom-0 block" style={{ height: `${pct}%`, background: "var(--c-ink2)" }} />
    </span>
  );
}

/** THE ROW FORM, drawn when the country holds one or two covered cities. The
 *  model's own row geometry (PART 5): the name, the figure in the very next
 *  column, a third column absorbing every pixel of leftover width, and the
 *  arrow at the right edge. Never `justify-between` across a wide card, which
 *  is the fault that puts a label at one end and its figure at the other. */
function Row({ card, look, fmt }: { card: CityCard; look: CityCardsLook; fmt: (v: number) => string }) {
  const field = look === "field";
  const tint = field && typeof card.payShare === "number" ? TINT_LOW + (TINT_HIGH - TINT_LOW) * card.payShare : null;
  const quiet = field ? "text-[var(--c-ink)]" : "text-[var(--c-muted)]";
  return (
    <a
      href={card.href}
      data-card={card.id}
      className={`group relative grid h-full items-center gap-3 overflow-hidden rounded-[14px] px-3 py-2.5 transition-colors hover:border-[var(--c-ink2)] [grid-template-columns:minmax(0,22ch)_auto_1fr_auto] ${field ? "border border-transparent" : "border border-[var(--c-border)]"}`}
    >
      {tint != null ? <span aria-hidden data-tint className="absolute inset-0" style={{ background: "var(--terra)", opacity: tint }} /> : null}
      {look === "column" ? <Mark part={card.payOfTop} /> : null}
      <span className="relative min-w-0">
        <span data-city-name className={`block text-[length:var(--t-head)] leading-[1.15] tracking-tight text-[var(--c-ink)] ${field ? "font-semibold" : "font-serif font-semibold"}`} style={{ overflowWrap: "normal" }}>{card.name}</span>
        {card.region ? <span className={`block truncate text-[length:var(--t-micro)] leading-snug ${quiet}`}>{card.region}</span> : null}
      </span>
      <span className="fig font-serif tabular-figures relative text-[length:var(--t-body)] leading-none text-[var(--c-ink)]">
        {typeof card.payUsd === "number" ? fmt(card.payUsd) : ""}
      </span>
      <span aria-hidden />
      <span aria-hidden className={`relative shrink-0 text-[length:var(--t-body)] leading-none transition-transform group-hover:translate-x-0.5 ${field ? "text-[var(--c-ink)]" : "text-[var(--c-ink2)]"}`}>&#8594;</span>
    </a>
  );
}
