"use client";
/**
 * CityCards , THE CITY CARD, IN THE ONE LOOK HE KEPT: THE FIELD, THE CITY'S
 * PHOTOGRAPH UNDER A TERRACOTTA WASH.
 *
 * ONE LOOK SINCE 2026-10-02. Three were built on 2026-09-10 for him to choose
 * between (the field, the plate, the column); the field went live with the
 * cities' own photographs, and his ruling 39 of 2026-09-26 closed the choice
 * ("the live cards are the field look with the city photo"). The plate and the
 * column, their stories, their copy and their mark were deleted, so the card
 * no longer carries a look switch nothing calls.
 *
 * Founder, 2026-09-10, on reference B11: "those coloured beautiful vertical
 * cards of cities should be used by us for cities too." The cards he was
 * pointing at are tall, saturated colour fields with the city name set large,
 * a couple of details under it and a link at the foot. He called ours stale
 * and bland, and the photograph of them says he is right: a name, a region, an
 * arrow, and on one of 252 cities a grey map.
 *
 * THE PHOTOGRAPH CAME BACK FOR THIS CARD AND THIS CARD ONLY, 2026-09-11.
 * Founder, reversing his own "no photographs anywhere" of 2026-09-07 with the
 * scope stated in the same breath: "the cities should have their placeholder
 * image ... just keep a placeholder image, you can just blast the London in all
 * of them, the London image with the bridge that we have, you know, not the
 * map." Nothing else on the site gains a photograph. Which file, and why it is
 * a stand-in rather than a city's own picture, is settled in `city_cards.ts`
 * (CITY_CARD_PLACEHOLDER_IMAGE): the bridge photograph he remembers does not
 * exist, the only real photograph in the repository is Positano, and the one
 * London file we hold is the street map he ruled out by name.
 *
 * WHAT THAT COST THE FIELD LOOK, AND IT IS THE REAL DESIGN DECISION HERE. The
 * tint used to BE the figure: deeper card, higher pay, read across the cities on
 * the card. A tint of varying depth laid over a photograph is no longer a
 * reading of anything, because the reader cannot separate the tint's depth from
 * the picture's own light. Today every card carries the SAME stand-in, so the
 * comparison would survive by accident; the day a real photograph lands for one
 * city, two cards on the same figure would look different and a card on a lower
 * figure could look deeper. A drawing that becomes a lie when the data improves
 * is worse than no drawing. So the tint STOPPED encoding the figure and became a
 * fixed veil with one job, legibility, and the figure is carried by the number
 * every card already prints in its own column, with a thin pay track over it
 * (PayTrack, 2026-09-25).
 *
 * THE LOOK: A DUOTONE. The photograph full-bleed and desaturated, a white veil
 * to lift it, a fixed terracotta wash over that. No card is crowned and no card
 * carries a pill. (His reference was blue, teal and purple; this palette is
 * terracotta and warm neutrals with green banned outright.)
 *
 * THE LAW, WRITTEN HERE ONCE.
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
 *    is not one (LINKS LOOK LIKE LINKS). The card stamps what it promises,
 *    `data-lands`, from the builder (city_cards.ts CITY_CARD_LANDS, customer
 *    pay: the figure it prints is the city page's own answer), and the
 *    chain's `doors` gate holds that promise to the page the href reaches
 *    (plan step 39, 2026-09-19).
 *  - EQUAL HEIGHTS BY CONSTRUCTION, his ruling 7: the grid stretches, every
 *    card is `h-full`, and the name block RESERVES its second line on every
 *    card, so a one-word city and a two-line city are the same object. Never by
 *    content luck.
 *  - A PHOTOGRAPH ON EVERY CARD: the city's own where the repository holds
 *    one (data/cities/images_credits.json), the one stand-in otherwise, each
 *    card showing a different part of it.
 *
 * WHAT THE SHARE MAY CLAIM. `payOfTop` is zero-based, and the pay track uses it
 * for a length that reads as a proportion, which is the one thing a bar may not
 * lie about. `payShare` is ordinal and is not drawn. Where there is no set to
 * scale within (one city, or every city on the same figure), the track draws
 * nothing: an empty track reads as zero, and zero is not what "not held" means.
 */
import * as React from "react";
import type { CityCard } from "@/lib/spine/city_cards";

/* FOUR A PAGE, the card pager's own arithmetic, kept: the cities card is the
   two-thirds band, 693px at 1280, whose inner 653px holds four tracks and not
   five, and five put one card alone on a second row. Four is inside his
   "five cities maximum" of 2026-08-30 and it fills the row. */
const PER_PAGE = 4;

/* THE PHOTOGRAPH STACK: a DUOTONE, three layers, each with exactly one job.

   1. THE PICTURE, `object-cover`, full-bleed, and DESATURATED. That last word
      is the design decision and it was made from a photograph, not from an
      argument. Built first in full colour, the terracotta wash over a blue sky
      and green cliffs produced a pink-mauve cast that reads as a filter someone
      forgot to turn off , which is the exact quality the founder named when he
      killed the hero photograph on 2026-09-07 ("it gives a feeling of being
      cheap"). Desaturated first, the same wash reads as one deliberate
      terracotta monotone: the picture survives as texture, the row belongs to
      the palette, and green (banned outright) cannot appear. Both were
      photographed side by side before this was chosen.
      IT IS ALSO THE HONEST FORM FOR A STAND-IN. This is a coastline in Italy
      standing behind Birmingham and Manchester. Nobody mistakes a terracotta
      duotone for a document of a place; a full-colour photograph invites
      exactly that mistake, and would be a fabricated place detail the day a
      reader looked closely.
   2. THE VEIL, white, whose only job is to lift the photograph's darkest
      regions so near-black ink clears the contrast floor everywhere on the
      card and not just over the sky. A scrim behind the name alone was the
      alternative and was rejected: it reads as a label stuck on a picture, and
      the name is meant to be the card, not a caption.
   3. THE WASH, `--terra` at ONE fixed opacity. Fixed, not per-card: it is no
      longer a figure (see the header note).

   THE TWO NUMBERS ARE SET BY A MEASUREMENT, NOT BY EYE. Composited over the
   photograph's darkest pixel, which is rgb(0,0,0) (measured 2026-09-11 by
   decoding the file and walking all 1,116,717 pixels), this stack lands a
   backdrop of rgb(190,137,124), and `--c-ink` on it reads 5.78 to 1 , over the
   4.5 WCAG AA floor this repo holds, and 11.6 to 1 over the picture's brightest
   region. Lowering the veil to 0.42 to let more of the picture through was
   computed and rejected at 4.57 to 1: clearing the floor by seven hundredths is
   not a margin, it is a coincidence waiting for a different photograph. The
   harness re-measures this from the rendered layers at every run
   (check_archetypes.mjs, the city-cards CONTRAST rule), so changing either
   number here fails the build rather than the reader. */
const PHOTO_VEIL = 0.55;
const PHOTO_WASH = 0.45;
/* The grey form's veil (`DuotonePhoto`'s `tint={false}`): no name is printed over
   that picture, so it answers to no contrast floor, only to keeping the grey soft
   beside the cards' ink. */
const PHOTO_VEIL_GREY = 0.3;

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
  prevLabel = "Previous",
  nextLabel = "More",
  fill = false,
}: {
  cards: CityCard[];
  allHref: string;
  allLabel: string;
  /** One line, said once for the whole row: what the figure is, and nothing else. */
  basis: string;
  prevLabel?: string;
  nextLabel?: string;
  /** The cards grow into the height the level lends the card that holds them (2026-09-24), instead of a blank under the link. */
  fill?: boolean;
}) {
  const [page, setPage] = React.useState(0);
  /* BELOW FOUR, THE ROW FORM (the threshold measured 2026-09-19, QUEUE
     country:cities-covered-list, on New Zealand's three covered cities through
     the harness renderer and the page filter). The threshold stood at three
     ("three or more fill a row of tall cards") and three do not: the grid's
     row holds PER_PAGE tracks, four, and three tall cards leave the fourth
     empty, 164 by 200 at 1280 (the unfilled right edge of PART 9 clause 25,
     under the page filter's 173 floor there), and on the two-up grid at 768
     and 375 they stand 2 + 1 with a 155 by 200 blank beside the third, over
     the floor, which the filter reds. Closing the grid to three tracks is
     barred by this card's own laws: at 1280 a 212px card at 200 tall reads
     0.94 against NOT TALL's 1.15, and at 768 and 375 three tracks of 95px cut
     the names. So the set that cannot fill the row takes the row form, which
     is what the paragraph below already reasons for one and two; the number
     is the row's own track count, not a guess. */
  const rows = cards.length < PER_PAGE;
  const pays = cards.map((c) => c.payUsd).filter((v): v is number => typeof v === "number");
  const fmt = moneyFor(pays);
  const pages = Math.max(1, Math.ceil(cards.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const slice = cards.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE);
  const btn =
    "tap flex h-8 w-8 items-center justify-center rounded-[12px] border border-[var(--c-border)] text-[var(--c-ink2)] transition-colors hover:border-[var(--c-ink2)] hover:text-[var(--c-ink)] disabled:cursor-default disabled:opacity-35 disabled:hover:border-[var(--c-border)] disabled:hover:text-[var(--c-ink2)]";
  return (
    <div data-archetype="city-cards" data-look="field" data-form={rows ? "rows" : "grid"} data-count={cards.length} data-fill={fill ? "1" : undefined} className={fill ? "flex flex-1 flex-col" : undefined}>
      {pages > 1 ? (
        <div className="mb-2 flex items-center justify-end gap-2">
          <span className="mr-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">{cur + 1} of {pages}</span>
          <button type="button" aria-label={prevLabel} disabled={cur === 0} onClick={() => setPage((p) => Math.max(0, p - 1))} className={btn}><span aria-hidden>&#8592;</span></button>
          <button type="button" aria-label={nextLabel} disabled={cur >= pages - 1} onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} className={btn}><span aria-hidden>&#8594;</span></button>
        </div>
      ) : null}
      {/* 9rem is the measured minimum that keeps two tracks in a 302px tablet
          card; two up on a phone is the founder's own (2026-08-30).

          BELOW FOUR CITIES THE FORM CHANGES, AND IT IS NOT A FALLBACK WITH AN
          APOLOGY UNDER IT (rule 22 bans that; this is what the range strip
          already does at one mark). Four tall cards fill a 653px row; ONE tall
          card leaves 500px of white beside it, which is the unfilled right edge
          he raised against this very section (rule 25), measured at 502 by 216
          by the harness before this line existed, and three leave the fourth
          track (measured above). So a set of one, two or three draws the
          model's own full-width row instead: same content, same name size,
          same figure, the arrow at the right edge, and no hole. */}
      {/* `fill`: the grid takes the height the card is lent and its rows share it (`auto-rows-fr`), so the cards grow instead of a blank under the link. */}
      <div className={`${rows ? "grid grid-cols-1 items-stretch auto-rows-fr" : "grid grid-cols-2 items-stretch gap-2 md:[grid-template-columns:repeat(auto-fill,minmax(9rem,1fr))]"} ${fill ? "flex-1 auto-rows-fr" : ""}`}>
        {slice.map((c, i) => (rows ? <Row key={c.id} card={c} fmt={fmt} /> : <Card key={c.id} card={c} fmt={fmt} index={i} />))}
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{basis}</p>
      <div className="mt-2 text-right">
        <a href={allHref} className="tap-y inline-block text-[length:var(--t-micro)] text-[var(--c-ink2)] transition-colors hover:text-[var(--c-ink)]">{allLabel} <span aria-hidden>&#8594;</span></a>
      </div>
    </div>
  );
}

/** THE PICTURE AND THE TWO LAYERS OVER IT, drawn once and used by both forms so
 *  a tall card and a wide row can never drift into two different recipes.
 *
 *  EXPORTED 2026-09-25 so the home page's post cards draw this recipe and not a
 *  copy of it (the founder: the blog blocks need a placeholder image). `crop`
 *  zooms into one region of the picture, so cards that share the single
 *  placeholder show different parts of it rather than one image six times. The
 *  parent must be `relative` and `overflow-hidden`.
 *
 *  `tint={false}` drops the terracotta wash and keeps a lighter veil: the
 *  picture in grey. For a grid of several photographs with no name printed over
 *  them (the post cards), where six washed pictures made a wall of the accent
 *  (the founder's reference of 2026-09-20: one warm card per grid). */
export function DuotonePhoto({
  src,
  placeholder,
  crop,
  tint = true,
}: {
  src: string;
  placeholder: boolean;
  crop?: { x: number; y: number; zoom: number };
  tint?: boolean;
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        aria-hidden
        data-photo={placeholder ? "placeholder" : "own"}
        className="absolute inset-0 h-full w-full object-cover"
        /* DESATURATED, so the wash above it reads as a duotone rather than as a
           filter left on by accident. See the stack note. */
        style={{
          filter: "grayscale(1)",
          ...(crop ? { transform: `scale(${crop.zoom})`, transformOrigin: `${crop.x}% ${crop.y}%` } : {}),
        }}
      />
      <span aria-hidden data-veil className="absolute inset-0 bg-white" style={{ opacity: tint ? PHOTO_VEIL : PHOTO_VEIL_GREY }} />
      {tint ? <span aria-hidden data-tint className="absolute inset-0" style={{ background: "var(--terra)", opacity: PHOTO_WASH }} /> : null}
    </>
  );
}

/* THE ONE PLACEHOLDER, A DIFFERENT PART OF IT ON EACH CARD (2026-09-25): four cards showing one picture four times read as a row
   copied and pasted, the section "dead" in his word of that day. Each card of a page takes its own region (the sea, the town, the
   cliff, the harbour), the way the home page's post cards already do. A city's own photograph is drawn whole. */
const PLACEHOLDER_CROPS: { x: number; y: number; zoom: number }[] = [
  { x: 100, y: 55, zoom: 1.7 },
  { x: 0, y: 30, zoom: 1.9 },
  { x: 70, y: 100, zoom: 2.1 },
  { x: 35, y: 85, zoom: 1.6 },
];

function Photo({ card, index = 0 }: { card: CityCard; index?: number }) {
  const crop = card.photo.placeholder ? PLACEHOLDER_CROPS[index % PLACEHOLDER_CROPS.length] : undefined;
  return <DuotonePhoto src={card.photo.src} placeholder={card.photo.placeholder} crop={crop} />;
}

/* On a terracotta field every line goes to `--c-ink`: `--c-muted` reads about 3.3 to 1 on the deepest step, under the floor this
   repo holds, and the hierarchy is carried by size (20 over 12), never by greying a line out. The card wears a TRANSPARENT
   border rather than none, so the hover has an edge to colour without moving anything. */
function Card({ card, fmt, index = 0 }: { card: CityCard; fmt: (v: number) => string; index?: number }) {
  return (
    <a
      href={card.href}
      data-card={card.id}
      data-lands={card.lands}
      className="group relative flex h-full min-h-[12.5rem] flex-col overflow-hidden rounded-[12px] border border-transparent px-3 py-2 transition-colors hover:border-[var(--c-ink2)]"
    >
      <Photo card={card} index={index} />
      <span className="relative flex h-full flex-col">
        {/* THE NAME, AND ITS SECOND LINE IS RESERVED ON EVERY CARD, whether it
            wraps or not, so the row is one object and not four accidents. */}
        <span
          data-city-name
          className="block text-[length:var(--t-head)] font-semibold leading-[1.15] tracking-tight text-[var(--c-ink)]"
          style={{ minHeight: "calc(2 * 1.15 * var(--t-head))", overflowWrap: "normal" }}
        >
          {card.name}
        </span>
        {card.region ? <span className="block truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)]">{card.region}</span> : null}
        <span className="mt-auto" />
        <PayTrack part={card.payOfTop} />
        <span className="flex items-baseline justify-between gap-2 pt-2">
          {/* `.fig` is the site's figure face and it resolves off a variable the
              spine shell owns; `font-serif` names the same family off the
              variable the root layout owns, so the figure reads in one face on
              the page AND in the harness sheet, which mounts no shell. */}
          <span className="fig font-serif tabular-figures text-[length:var(--t-body)] leading-none text-[var(--c-ink)]">
            {typeof card.payUsd === "number" ? fmt(card.payUsd) : ""}
          </span>
          <span aria-hidden className="shrink-0 text-[length:var(--t-body)] leading-none text-[var(--c-ink)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
        </span>
      </span>
    </a>
  );
}

/** THE PAY TRACK (2026-09-25, his "numbers ... with no relation to each other"): a thin bar over the figure, this city's pay as
 *  a part of the highest pay in the set, zero-based, so the four figures of a row are read against one another before they are
 *  read at all. The track is the card's white over the photograph, the fill the page's ink. Nothing is drawn where there is no
 *  set to scale within: an empty track reads as zero. */
function PayTrack({ part }: { part?: number }) {
  if (typeof part !== "number" || !Number.isFinite(part) || part <= 0) return null;
  const pct = Math.max(4, Math.min(100, part * 100));
  return (
    <span aria-hidden data-pay-track className="relative mt-2 block h-1.5 overflow-hidden rounded-full">
      <span className="absolute inset-0 rounded-full" style={{ background: "var(--c-card)", opacity: 0.6 }} />
      <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: "var(--c-ink)" }} />
    </span>
  );
}

/** THE ROW FORM, drawn when the country holds one or two covered cities. The
 *  model's own row geometry (PART 5): the name, the figure in the very next
 *  column, a third column absorbing every pixel of leftover width, and the
 *  arrow at the right edge. Never `justify-between` across a wide card, which
 *  is the fault that puts a label at one end and its figure at the other. */
function Row({ card, fmt }: { card: CityCard; fmt: (v: number) => string }) {
  return (
    <a
      href={card.href}
      data-card={card.id}
      data-lands={card.lands}
      className="group relative grid h-full items-center gap-3 overflow-hidden rounded-[12px] border border-transparent px-3 py-2 transition-colors hover:border-[var(--c-ink2)] [grid-template-columns:minmax(0,22ch)_auto_1fr_auto]"
    >
      <Photo card={card} />
      <span className="relative min-w-0">
        <span data-city-name className="block text-[length:var(--t-head)] font-semibold leading-[1.15] tracking-tight text-[var(--c-ink)]" style={{ overflowWrap: "normal" }}>{card.name}</span>
        {card.region ? <span className="block truncate text-[length:var(--t-micro)] leading-snug text-[var(--c-ink)]">{card.region}</span> : null}
      </span>
      <span className="fig font-serif tabular-figures relative text-[length:var(--t-body)] leading-none text-[var(--c-ink)]">
        {typeof card.payUsd === "number" ? fmt(card.payUsd) : ""}
      </span>
      <span aria-hidden />
      <span aria-hidden className="relative shrink-0 text-[length:var(--t-body)] leading-none text-[var(--c-ink)] transition-transform group-hover:translate-x-0.5">&#8594;</span>
    </a>
  );
}
