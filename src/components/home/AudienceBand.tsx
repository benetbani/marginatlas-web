/**
 * AudienceBand -- "who it's for". Four audience CATEGORIES Atlas serves, framed
 * as who-it-is-for (not fabricated social proof: no logos, no quotes).
 * Server component, tokens only.
 *
 * TWO SHAPES, SAME CONTENT. As a "band" it is the original four-across row. As
 * a "panel" it is a single narrow column, for sitting beside the pricing table
 * in one two-up row on the homepage.
 *
 * The ratified rule is bento two-up bands, never one section per row, and the
 * homepage was eleven full-width bands stacked. These two were the clearest
 * pair to fix first: the pricing table is max-w-3xl inside a max-w-7xl
 * container, so it already left forty percent of its band empty, and "who is
 * this for" and "what does it cost" are one question a reader asks once.
 *
 * Nothing is dropped in panel form. All four audiences render, with the same
 * words. Only the grid changes.
 */
import { ChartLineUp, Megaphone, Briefcase, Storefront } from "@phosphor-icons/react/dist/ssr";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AtlasSpot } from "@/components/brand/spots";

const AUDIENCES: { who: string; use: string; Icon: typeof Briefcase }[] = [
  { who: "Private equity and investors", use: "Size a market and sanity-check a target before the first call.", Icon: ChartLineUp },
  { who: "Marketing and growth agencies", use: "Understand a client's real economics before pitching a budget.", Icon: Megaphone },
  { who: "Management consultants", use: "Benchmark an industry in minutes instead of a research week.", Icon: Briefcase },
  { who: "Founders and operators", use: "See what a business keeps before risking your own money.", Icon: Storefront },
];

export function AudienceBand({ variant = "band" }: { variant?: "band" | "panel" }) {
  const panel = variant === "panel";
  return (
    <section className={panel ? "" : "py-12 md:py-16"}>
      <div
        className={
          panel ? "mb-5" : "mb-8 flex items-start justify-between gap-6 md:mb-10"
        }
      >
        <div>
          <SectionEyebrow size="md" className="mb-2">Who it&apos;s for</SectionEyebrow>
          <h2
            className={`font-display font-medium tracking-tight text-ink-900 ${
              panel ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            }`}
          >
            Built for the people who price a business for a living
          </h2>
        </div>
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
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        }
      >
        {AUDIENCES.map(({ who, use, Icon }) => (
          <div
            key={who}
            className={
              panel
                ? "atlas-card flex items-start gap-3.5 px-4 py-3.5"
                : "atlas-card px-5 py-6"
            }
          >
            <Icon
              size={panel ? 20 : 24}
              weight="regular"
              className={`text-atlas-700 ${panel ? "mt-0.5 shrink-0" : ""}`}
              aria-hidden
            />
            <div>
              <h3
                className={`font-display font-medium tracking-tight text-ink-900 ${
                  panel ? "text-[15px]" : "mt-3 text-base"
                }`}
              >
                {who}
              </h3>
              <p
                className={`text-cocoa-700 leading-relaxed ${
                  panel ? "mt-0.5 text-[13px]" : "mt-1.5 text-sm"
                }`}
              >
                {use}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
