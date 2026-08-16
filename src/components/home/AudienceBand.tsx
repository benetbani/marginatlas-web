/**
 * AudienceBand -- "who it's for". Four audience CATEGORIES Atlas serves, each
 * now carrying a real DOOR into the product rather than a sentence about what
 * that audience might hypothetically do.
 *
 * WHAT WAS WRONG. Measured by rendering the band and counting words off the
 * emitted markup: 67 words, every one of them description, and not a single
 * figure, link or destination anywhere in it. It was the purest institutional
 * band left on the homepage, and it is exactly the thing the founder named:
 * "it's a little bit institutional and not very relevant to the person who
 * might be visiting... It lacks flavor, it lacks elements. It just has a lot of
 * text, when it should not."
 *
 * A band that tells four kinds of reader what they could do, and then gives
 * none of them anywhere to go, is an advertisement for the product printed
 * inside the product. The reference pages this one is measured against
 * (Airbnb, airlines, premium rentals) do not describe their audiences at all;
 * they show inventory and let a reader recognize themselves in it.
 *
 * THE FIX, and why it is links rather than a cut. The four categories are
 * agreed content and are not dropped. What is dropped is the explanatory
 * sentence under each, replaced by the page that audience would actually open.
 * Every href below is a real route, verified in src/app/(site):
 *
 *   Founders and operators        -> /decide        the recommender
 *   Private equity and investors  -> /margin-index  ranked by what owners keep
 *   Management consultants        -> /industries    every trade
 *   Marketing and growth agencies -> /cities        every city
 *
 * FOUNDERS LEAD, and that reordering is the point rather than a tidy-up. The
 * list used to open on private equity and close on the operator, which is the
 * institutional ordering: the professional buyer first, the person actually
 * deciding whether to open a business last. He is the visitor. He goes first.
 *
 * No figure was lost in the cut: none of the four deleted sentences carried
 * one, and no statistic was invented to replace them.
 *
 * TWO SHAPES, SAME CONTENT. As a "band" it is the four-across row. As a
 * "panel" it is a single narrow column, for sitting beside the pricing table
 * in one two-up row on the homepage (the live homepage uses the panel). All
 * four audiences render in both; only the grid changes.
 *
 * The heading dropped its eyebrow rather than keeping both. "Who it's for" was
 * the eyebrow, and the h2 under it read "Built for the people who price a
 * business for a living", which is the same label restated at length. That is
 * the pattern CatalogPlates and NeighborhoodCards already use on this page: no
 * eyebrow, one plain h2 at the canonical section size.
 *
 * Server component, tokens only. Cards are .atlas-card, which is already
 * position:relative, so they sit above the AtlasFrame photograph rather than
 * sinking behind its fixed z-index:0 layers.
 */
import { ChartLineUp, Megaphone, Briefcase, Storefront } from "@phosphor-icons/react/dist/ssr";
import { AtlasSpot } from "@/components/brand/spots";

const AUDIENCES: {
  who: string;
  cta: string;
  href: string;
  Icon: typeof Briefcase;
}[] = [
  { who: "Founders and operators", cta: "Where to open", href: "/decide", Icon: Storefront },
  { who: "Private equity and investors", cta: "The Margin Index", href: "/margin-index", Icon: ChartLineUp },
  { who: "Management consultants", cta: "Every trade", href: "/industries", Icon: Briefcase },
  { who: "Marketing and growth agencies", cta: "Every city", href: "/cities", Icon: Megaphone },
];

export function AudienceBand({ variant = "band" }: { variant?: "band" | "panel" }) {
  const panel = variant === "panel";
  return (
    <section className={panel ? "" : "py-12 md:py-16"}>
      <div
        className={
          panel ? "mb-4" : "mb-6 flex items-start justify-between gap-6 md:mb-8"
        }
      >
        {/* Canonical section size (font-display text-lg md:text-xl), the same
            token CatalogPlates, NeighborhoodCards and HomeNewsletter carry. One
            page cannot have two section-heading sizes, and the content is meant
            to carry the weight rather than the label. */}
        <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
          Who it&apos;s for
        </h2>
        {/* One brand spot per band (design-system 9.3): the four audience roles.
            Not in panel form. At 132px beside a heading in a five-twelfths
            column it wins a fight with the heading it is meant to accompany,
            and the row it now shares already has the pricing table carrying
            the visual weight. */}
        {!panel && (
          <AtlasSpot
            id="four-roles"
            width={132}
            className="hidden shrink-0 text-ink-800 lg:block"
          />
        )}
      </div>
      <div
        className={
          panel
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
        }
      >
        {AUDIENCES.map(({ who, cta, href, Icon }) => (
          <a
            key={who}
            href={href}
            className="atlas-card group flex items-start gap-3 px-4 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
          >
            <Icon
              size={20}
              weight="regular"
              className="mt-0.5 shrink-0 text-atlas-700"
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-display text-base font-medium tracking-tight text-ink-900">
                {who}
              </h3>
              <div className="mt-0.5 text-[12.5px] font-medium text-atlas-700 group-hover:underline">
                {cta} <span aria-hidden>&rarr;</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
