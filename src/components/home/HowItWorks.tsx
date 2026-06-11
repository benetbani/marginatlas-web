/**
 * HowItWorks -- the homepage's 3-step explainer: search, see the numbers,
 * decide. Pure presentational server component, tokens only, no data. Shows the
 * flow from a query to a decision so a first-time visitor understands the tool
 * before scrolling into the rest of the marketing band.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Search a business and a place",
    body: "Pick a trade and a city. A bakery in Lyon, a law firm in Texas, a hotel in Bali.",
  },
  {
    n: "2",
    title: "See the real numbers",
    body: "Revenue, costs, wages, and what the owner actually keeps, drawn from the data we hold for that cell.",
  },
  {
    n: "3",
    title: "Decide before you risk money",
    body: "Know whether the business works, and how hard it is to break in, before you commit a cent.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16">
      <SectionEyebrow size="md" className="mb-2">How it works</SectionEyebrow>
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-8 md:mb-10">
        From a question to a decision, in three steps
      </h2>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {STEPS.map((s) => (
          <li key={s.n} className="atlas-card px-6 py-7">
            <div className="font-display text-3xl font-semibold tabular-nums text-atlas-700">
              {s.n}
            </div>
            <h3 className="mt-3 font-display text-lg font-medium tracking-tight text-ink-900">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
