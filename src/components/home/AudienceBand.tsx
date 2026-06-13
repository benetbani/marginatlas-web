/**
 * AudienceBand -- "who it's for". Four audience CATEGORIES Atlas serves, framed
 * as who-it-is-for (not fabricated social proof: no logos, no quotes). Horizontal
 * four-card row with an icon per card. Server component, tokens only.
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

export function AudienceBand() {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-8 flex items-start justify-between gap-6 md:mb-10">
        <div>
          <SectionEyebrow size="md" className="mb-2">Who it's for</SectionEyebrow>
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
            Built for the people who price a business for a living
          </h2>
        </div>
        {/* One brand spot per band (design-system 9.3): the four audience roles. */}
        <AtlasSpot
          id="four-roles"
          width={132}
          className="hidden shrink-0 text-ink-800 lg:block"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {AUDIENCES.map(({ who, use, Icon }) => (
          <div key={who} className="atlas-card px-5 py-6">
            <Icon size={24} weight="regular" className="text-atlas-700" aria-hidden />
            <h3 className="mt-3 font-display text-base font-medium tracking-tight text-ink-900">{who}</h3>
            <p className="mt-1.5 text-sm text-cocoa-700 leading-relaxed">{use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
