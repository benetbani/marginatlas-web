/**
 * Plan v21 Block 5 — replace the pair of compact "Browse by country /
 * Browse by industry" anchors with two big symmetric image cards. The
 * entire card is clickable. Background is a Pexels stock image, with a
 * 45% dark overlay so the cream serif heading reads cleanly. Both cards
 * share aspect ratio so they're exactly symmetric on every breakpoint.
 *
 * Server component — zero client cost.
 */

type ExploreCardSpec = {
  href: string;
  eyebrow: string;
  heading: string;
  imageUrl: string;
  imageAlt: string;
};

const CARDS: ExploreCardSpec[] = [
  {
    href: "/world",
    eyebrow: "By geography",
    heading: "Explore the countries",
    imageUrl:
      "https://images.pexels.com/photos/335393/pexels-photo-335393.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600",
    imageAlt: "World map composition with continents in warm tones",
  },
  {
    href: "/industries",
    eyebrow: "By line of work",
    heading: "Browse by industry",
    imageUrl:
      "https://images.pexels.com/photos/1483844/pexels-photo-1483844.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1600",
    imageAlt: "Artisan worker at a craft workbench, focused attention",
  },
];

export function ExploreCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {CARDS.map((card) => (
        <a
          key={card.href}
          href={card.href}
          className="group relative block overflow-hidden rounded-2xl border border-parchment hover:border-atlas-500 transition-all"
          style={{ aspectRatio: "16 / 10" }}
        >
          {/* Background image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.imageUrl}
            alt={card.imageAlt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* Dark overlay for text legibility */}
          <div
            className="absolute inset-0 bg-ink-900/55 group-hover:bg-ink-900/45 transition-colors"
            aria-hidden
          />
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 lg:p-10">
            <div className="text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-atlas-200">
              {card.eyebrow}
            </div>
            <div className="flex items-end justify-between gap-4">
              <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-cream-50 leading-tight">
                {card.heading}
              </h3>
              <span
                aria-hidden="true"
                className="shrink-0 text-cream-50 text-xl md:text-2xl translate-x-0 group-hover:translate-x-1 transition-transform"
              >
                →
              </span>
            </div>
          </div>
        </a>
      ))}
    </section>
  );
}
