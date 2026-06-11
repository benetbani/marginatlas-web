/**
 * AudienceBand -- "who it's for". Names the four audience categories Atlas
 * serves, framed as who-it-is-for, NOT as fabricated social proof: no invented
 * logos, no testimonial quotes. Pure presentational server component, tokens
 * only. If real named references land later they replace this honest read.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const AUDIENCES: { who: string; use: string }[] = [
  {
    who: "Private equity and investors",
    use: "Size a market and sanity-check a target before the first call.",
  },
  {
    who: "Marketing and growth agencies",
    use: "Understand a client's real economics before pitching the budget.",
  },
  {
    who: "Management consultants",
    use: "Benchmark an industry in minutes instead of a research week.",
  },
  {
    who: "Founders and operators",
    use: "See what a business keeps before risking your own money.",
  },
];

export function AudienceBand() {
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">Who it's for</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-8 md:mb-10">
        Built for the people who price a business for a living
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {AUDIENCES.map((a) => (
          <div key={a.who} className="atlas-card px-6 py-6">
            <h3 className="font-display text-lg font-medium tracking-tight text-ink-900">
              {a.who}
            </h3>
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">{a.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
