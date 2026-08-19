/**
 * NeighborhoodCards -- the homepage "drilled to the neighborhood" proof, built
 * from REAL deep flavor data. Six clickable cards. Self-omits below four cards.
 * Server component, tokens only.
 *
 * DENSITY PASS 2026-08-17. Measured before the change by rendering this band
 * with react-dom/server and counting the words in the emitted markup: 234
 * words, the heaviest band on the home page by a factor of two, and 201 of
 * them inside <p> tags. The founder's note is that the page "just has a lot of
 * text, when it should not" and "lacks elements".
 *
 * Three things went, and each was carrying words rather than information:
 *
 * 1. THE LEDE, 23 words, entirely. It read "A business two streets over can
 *    run on completely different economics", which is the heading, "The same
 *    benchmarks, block by block", said again at length. A paragraph that
 *    restates its own heading is the clearest thing on the page to cut.
 *
 * 2. THE EYEBROW, "Drilled to the neighborhood", for the same reason one level
 *    up: a second, vaguer label over a heading that already says it.
 *
 * 3. DONT_MISS, six paragraphs of 12 to 26 words, 119 in total. This is the
 *    single biggest block of prose on the home page and it is travel writing:
 *    the oldest planned square in Paris, a farmers' market at 9 AM. Nothing in
 *    it is about what a business earns, which is what the band's own heading
 *    promises. **The text does not disappear from the site.** It is the
 *    `dont_miss` field and it already renders on the page each card links to,
 *    src/app/(site)/cities/[slug]/neighborhoods, where a reader who wants the
 *    character of the place is actually standing. The loader still requires it
 *    to be present, so it still decides which districts qualify.
 *
 * WHAT WENT IN ITS PLACE. `signature_businesses` was a prose line reading
 * "Known for: design boutiques, small museums, kosher bakeries". The trades
 * are the useful part and the two-word preamble was not, so the line is now
 * three chips, each with its trade pictogram from the existing kit. Same
 * facts, drawn instead of narrated, which is the "small signals, the icons"
 * the founder asked for and is what AtlasPictogram exists for: trade identity,
 * never decoration scattered around prose (design system 9.2).
 *
 * The card head also lost 16px of empty gradient and gained the lead trade's
 * mark, so a reader can tell a food district from an electronics one before
 * reading a word. And the city name printed TWICE, once in the head and once
 * under the district name; it prints once now.
 *
 * THE HEADING SHRANK, 2xl/3xl to lg/xl. The reference pages this is measured
 * against, rental and travel marketplaces, all set section headings small and
 * let the inventory carry the weight. Ours was inverted: a display heading
 * over small cards. `font-display text-lg` is a canonical h2 token, so this is
 * a step down the existing scale rather than a new size.
 */
import type { NeighborhoodCard } from "@/lib/home/neighborhood_cards";
import { AtlasPictogram } from "@/components/brand/pictograms";
import type { AtlasPictogramId } from "@/components/brand/pictograms";

/**
 * Trade phrase to pictogram. The flavor data writes free text ("kosher
 * bakeries", "wholesale electronics"), so this matches on the substring that
 * names the trade and takes the FIRST hit, which is why the order is specific
 * before general: "luxury retail" must reach jewellery before "retail" reaches
 * clothing, and "fine dining" must reach restaurant before "dining" is left to
 * the fallback.
 *
 * The fallback is a high-street storefront, never nothing: a chip with a blank
 * where its neighbours have a mark reads as a missing glyph rather than a
 * general one.
 */
const TRADE_MARKS: [RegExp, AtlasPictogramId][] = [
  [/restaurant|dining|bistro|eater/i, "restaurant"],
  [/caf|coffee/i, "cafe"],
  [/bakery|bakeries|bread/i, "bakery"],
  [/sweet|pastry|patisserie|confection/i, "patisserie"],
  [/ice cream|gelat/i, "icecream"],
  [/bar\b|pub|nightlife|brewer/i, "bar"],
  [/market|grocer|greengrocer|produce/i, "greengrocer"],
  [/convenience|corner shop/i, "convenience"],
  [/electronic|component|hardware store/i, "electronics"],
  [/mobile|phone repair/i, "mobile"],
  [/auto|garage|car repair/i, "auto"],
  [/medical|clinic|doctor|health/i, "clinic"],
  [/pharmac|chemist/i, "pharmacy"],
  [/dental|dentist/i, "dentist"],
  [/gym|fitness/i, "gym"],
  [/yoga|pilates/i, "yoga"],
  [/salon|hair|beauty/i, "salon"],
  [/barber/i, "barber"],
  [/spa|massage/i, "spa"],
  [/luxury|jewel|watch/i, "jewellery"],
  [/museum|gallery|book|art\b/i, "bookshop"],
  [/design|studio|architect/i, "design"],
  [/craft|artisan|gift|souvenir/i, "gift"],
  [/vintage|clothing|fashion|boutique|apparel/i, "clothing"],
  [/shoe|footwear/i, "shoes"],
  [/florist|flower/i, "florist"],
  [/laundry|dry clean/i, "laundry"],
  [/tailor|alteration/i, "tailor"],
  [/hotel|hostel|guesthouse/i, "hotel"],
  [/cowork|office space/i, "coworking"],
  [/law|legal|solicitor/i, "law"],
  [/account|finance|bank/i, "accountant"],
  [/software|tech|digital/i, "software"],
  [/estate|property|letting/i, "estate"],
  [/print|signage|copy shop/i, "print"],
  [/service|agency|consult/i, "accountant"],
  [/retail|shop|store/i, "clothing"],
];

function markFor(trade: string): AtlasPictogramId {
  for (const [re, id] of TRADE_MARKS) if (re.test(trade)) return id;
  return "v-high-street";
}

/** "design boutiques, small museums, kosher bakeries" to three chip labels. */
function trades(knownFor: string): string[] {
  return knownFor
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function NeighborhoodCards({ cards }: { cards: NeighborhoodCard[] }) {
  if (cards.length < 4) return null;
  return (
    <section>
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-5">
        The same benchmarks, block by block
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {cards.map((n) => {
          const list = trades(n.knownFor);
          const lead = markFor(list[0] ?? "");
          return (
            <a key={n.href + n.name} href={n.href} className="group atlas-card block overflow-hidden p-0">
              {/* NOT A PHOTOGRAPH, AND NOT A PLACEHOLDER EITHER.
                  This slot was briefly wired to the city's hero from
                  city_heroes, on the reasoning that 209 of the 252 cities
                  carry one and the homepage was the only surface not using
                  them. Those heroes are Pexels stock photographs, and "no
                  stock imagery" is a hard constraint, listed in the
                  2026-06-06 overhaul plan beside no-em-dashes and
                  tokens-only, and again in the design system as "no stock
                  gloss".

                  This page in particular: ExploreCards was DELETED from the
                  homepage for using Pexels, and the comment recording that is
                  forty lines up in src/app/page.tsx. Putting stock
                  photography back into the same page is the specific mistake
                  that rule exists to prevent, so it came straight back out.

                  It used to be an empty h-36 field with the city name in it,
                  and the city name is already printed below, so it was 144px
                  of gradient carrying a duplicate. It now carries the
                  district's lead trade as a mark: shorter, and it says
                  something. */}
              <div
                aria-hidden
                /* 48px ON A PHONE, 80 FROM 640 UP, and the split is measured
                   rather than felt. Rendered at 375: this band is the tallest on
                   the homepage at 1,568px, six cards of 215 to 244px each,
                   carrying 32 words between them. Of each 215px card, THIS BLOCK
                   IS 80, thirty-seven percent, and it holds no text at all: a
                   gradient and one pictogram.
                   The mark stays, because the founder's brief asks for more
                   elements and not fewer ("it lacks flavor, it lacks elements").
                   What changes is its share of a narrow screen. Measured after:
                   the band falls to 1,376px and the page to 9,656px at 375.
                   Desktop is untouched by construction: `sm:h-20` restores the
                   ratified height at 640 and above, so nothing the founder has
                   already approved moves. */
                className="h-12 sm:h-20 w-full bg-gradient-to-br from-cocoa-700/15 to-atlas-700/15 flex items-center justify-center"
              >
                <AtlasPictogram
                  id={lead}
                  size={32}
                  className="text-cocoa-700/70 transition-colors group-hover:text-atlas-700"
                />
              </div>
              <div className="px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors">
                    {n.name}
                  </h3>
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-cocoa-700/70">
                    {n.priceTier}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-cocoa-700/80">{n.city}</div>
                {/* The trades, drawn. A real list, so a screen reader reads
                    three items rather than one run-on line, and the mark is
                    aria-hidden because the label beside it already says it. */}
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {list.map((t) => (
                    <li
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-md border border-parchment px-2 py-1 text-[11px] leading-none text-cocoa-700"
                    >
                      <AtlasPictogram id={markFor(t)} size={14} className="shrink-0 text-atlas-700" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
