/**
 * CityRows, THE UK'S CITIES AS STILL ROWS ON THE HOME (plan docs/superpowers/plans/2026-10-10-home-reform, Task 6; the spec's
 * decision 2; the critique's P1.10 and P1.11; the ship audit's 3.3, 3.5 and 4.4). A server component: the home's cities never page
 * (his refusal of carousels and pagination, 2026-09-22), so the list needs no client code and puts no card in the page's payload,
 * which the pager's client file (CityCards.tsx) did. The same archetype, `city-cards`, in its row form.
 *
 * THE FORM, by width:
 *  - UNDER 768, TWO TO A ROW (his ruling of 2026-08-30, standing in FOUNDER-VERDICTS): each city a cell 64px tall, its name at 20
 *    over its figure at 14, no arrow (the cell is the door, and the arrow on the picture's busiest ground nearly disappeared; critique
 *    pass 3, fix round D2, item P2.7); an eighth cell, "All UK cities", opens /gb's cities, its words at 20 semibold as the names are
 *    and its own arrow at the right, so seven cities and the door fill four rows (about 280px, where the stack of seven rows stood 356).
 *  - FROM 768, ONE ROW A CITY on a fixed pitch (critique pass 2, fix round C2, items P1.3 and P1.4): each city a slot of 56px
 *    (`md:auto-rows-[56px]`), the doors' own pitch (WhereNext `pitch`), so the foot's two lists meet row for row, on white with a
 *    hairline above it as the doors are ruled: the 72 by 48 thumbnail, the name in a column of 22ch (underlined on hover), the
 *    figure in the very next column, the leftover absorbed, the arrow at the right edge (PART 5's row). The "All UK cities" cell
 *    stands at every width: its words at 20 semibold in ink and its arrow at every width, and from 768 it is the eighth slot, a row with
 *    no picture (its edge), beside the doors' eighth. The rows' arrows show from 768 only.
 *
 * THE PICTURE IN GREY (the spec's decision 2): each city's small copy (480 by 360, about 25KB, public/cities/thumbs) in grey and with
 * no terracotta wash, so the band above and the cities never read as one salmon wall. Under 768 it is the cell's ground under a
 * white veil at 0.6; the darkest pixel under the veil is rgb(153, 153, 153), and ink on it reads 6.05 to 1. From 768 (critique pass
 * 2, fix round C2, item P1.4) it leaves the row's ground and is a 72 by 48 thumbnail at the row's left, rounded 8, with no veil
 * (the wrapper hides it) and no text over it: under the 0.6 veil in a short row each picture was a pale smear that read as disabled
 * and the busiest ground on the page stood behind the figure. Each picture keeps its landmark in its frame through its own
 * object-position (data/cities/images_credits.json, carried into the manifest). It loads lazily and decodes off the main thread.
 *
 * Each row is a door to its city's page (`data-card`, `data-lands`, which the doors gate holds to the page); its figure is its
 * builder's, stamped, and says its unit to a screen reader ("a year", visually hidden), as the basis line under the rows says it
 * once for the eye.
 */
import * as React from "react";
import { provAttrs } from "@/lib/spine/provenance";
import { cityThumb } from "@/lib/cities/city_images";
import type { CityCard } from "@/lib/spine/city_cards";
import { DuotonePhoto, moneyFor } from "./CityParts";

/** The grey veil over each row's picture: ink on its darkest pixel, rgb(153, 153, 153), reads 6.05 to 1 (the spec's decision 2). */
export const ROW_VEIL = 0.6;
/** The small copies' own size (scripts/build_city_images_manifest.ts --thumbs). */
const THUMB_W = 480;
const THUMB_H = 360;

export function CityRows({ cards, basis, allHref, allLabel, unit }: { cards: CityCard[]; /** One line, said once for the rows: what the figure is, and nothing else. */ basis: string; /** The eighth cell's door, drawn under 768. */ allHref: string; allLabel: string; /** The figure's unit, said to a screen reader ("a year"). */ unit: string }) {
  if (cards.length === 0) return null;
  const pays = cards.map((c) => c.payUsd).filter((v): v is number => typeof v === "number");
  const fmt = moneyFor(pays);
  return (
    <div data-archetype="city-cards" data-look="grey" data-form="rows" data-count={cards.length} className="flex flex-1 flex-col">
      <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-1 md:auto-rows-[56px] md:gap-0">
        {cards.map((c, i) => (
          <Row key={c.id} card={c} fmt={fmt} unit={unit} first={i === 0} />
        ))}
        <a href={allHref} data-all-cities="" className="group tap-y flex min-h-16 items-center justify-between gap-2 rounded-[12px] border border-[var(--c-line-strong)] px-3 py-2 text-[length:var(--t-head)] font-semibold leading-[1.15] tracking-tight text-[var(--c-ink)] no-underline transition-colors hover:border-[var(--c-ink2)] md:my-1 md:min-h-0 md:py-0">
          <span>{allLabel}</span>
          <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5">&#8594;</span>
        </a>
      </div>
      <p className="mt-3 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{basis}</p>
    </div>
  );
}

/** ONE CITY, ONE DOOR: under 768 its name across the cell over its figure, the picture behind them under its veil and no arrow (the cell is the door); from
 *  768 the thumbnail, the name, the figure in the next column, the leftover, the arrow at the edge, on white with a hairline above
 *  every row but the first. The row's own height is its tap (64, then the 56px slot), never an invisible box outside it: under 768
 *  the row clips its overflow for the picture. */
function Row({ card, fmt, unit, first }: { card: CityCard; fmt: (v: number) => string; unit: string; first: boolean }) {
  const thumb = cityThumb(card.id);
  return (
    <a
      href={card.href}
      data-card={card.id}
      data-lands={card.lands}
      className={`group relative grid min-h-16 grid-cols-[minmax(0,1fr)_auto] content-center items-center gap-x-2 gap-y-1 overflow-hidden rounded-[12px] border border-transparent px-3 py-2 transition-colors hover:border-[var(--c-ink2)] md:min-h-0 md:grid-cols-[72px_minmax(0,22ch)_auto_1fr_auto] md:gap-x-3 md:gap-y-0 md:overflow-visible md:rounded-none md:border-0 md:border-[var(--c-border)] md:px-0 md:py-0 md:hover:border-[var(--c-border)]${first ? "" : " md:border-t"}`}
    >
      <span aria-hidden className="absolute inset-0 md:relative md:inset-auto md:block md:h-12 md:w-[72px] md:overflow-hidden md:rounded-[8px] md:[&>[data-veil]]:hidden">
        <DuotonePhoto src={thumb ? thumb.src : card.photo.src} placeholder={card.photo.placeholder} tint={false} veil={ROW_VEIL} position={thumb?.position} width={thumb ? THUMB_W : undefined} height={thumb ? THUMB_H : undefined} />
      </span>
      <span data-city-name className="relative col-span-2 block min-w-0 text-[length:var(--t-head)] font-semibold leading-[1.15] tracking-tight text-[var(--c-ink)] md:col-span-1 md:group-hover:underline" style={{ overflowWrap: "normal" }}>
        {card.name}
      </span>
      <span className="fig font-serif tabular-figures relative text-[length:var(--t-body)] leading-none text-[var(--c-ink)]" {...provAttrs(card.payProv)}>
        {typeof card.payUsd === "number" ? fmt(card.payUsd) : ""}
        {typeof card.payUsd === "number" ? <span className="sr-only">{` ${unit}`}</span> : null}
      </span>
      <span aria-hidden className="hidden md:block" />
      <span aria-hidden className="relative hidden justify-self-end text-[length:var(--t-body)] leading-none text-[var(--c-ink)] transition-transform group-hover:translate-x-0.5 md:block">&#8594;</span>
    </a>
  );
}
