/**
 * /tools — the tools hub.
 *
 * One register for the three interactive surfaces the founder folded under a
 * single hub: Decide (which business, and where), Check (compare your own
 * numbers to typical), and Calculator (break-even, and whether the owner gets
 * paid). The hub only points to the live routes; it does not move, rename, or
 * wrap them, so each tool keeps its own URL and its SEO equity.
 *
 * NOT LISTED, ON PURPOSE: /compare. It is a real interactive route, but the
 * three here are the three the founder folded under this hub, and adding a
 * fourth is a decision about what the hub IS rather than a defect in it.
 *
 * Server component. Warm editorial layout on paper, matching the /decide and
 * /calculator headers. Cards reuse the established .atlas-card pattern (see the
 * worked-example cards on /decide): eyebrow, title, one-line read, arrow link.
 *
 * 2026-06-07 shipped as the single entry point chosen over three nav items.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export function generateMetadata(): Metadata {
  return {
    title: "Tools | Margin Atlas",
    /* "Run your exact rent, payroll, and concept" stood here too. The card
       below carries a comment explaining why that claim was retired: the
       calculator has five fields, country, region, industry, size band and
       annual revenue, and it MODELS rent and payroll from the trade's cost
       structure rather than taking yours. The correction was applied to the
       card title and not to this description, so the retired promise survived
       in the one place that reaches a search result. */
    description:
      "Three ways to put the benchmarks to work: decide which business to start and where, check your own numbers against typical, and find your break-even and whether the owner gets paid.",
    alternates: { canonical: "/tools" },
  };
}

type Tool = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
};

// The order leads with the broadest decision and narrows to the most precise
// input: choose the business, then sanity-check your numbers, then model your
// exact situation.
const TOOLS: Tool[] = [
  {
    href: "/decide",
    eyebrow: "Decide",
    title: "What business should I start, and where?",
    description:
      "Frame the choice of activity by what actually reaches an owner, then rank a city's neighborhoods for the one you pick.",
  },
  {
    href: "/check",
    eyebrow: "Check",
    title: "Compare your own numbers to what is typical",
    description:
      "Type in your real figures and see where you sit against the typical range for your industry and revenue band.",
  },
  {
    href: "/calculator",
    eyebrow: "Calculator",
    /* The title read "Run your exact rent, payroll, and concept" and promised
       three inputs the tool does not have. Its five fields are country, region,
       industry, size band and annual revenue. Rent and payroll are MODELLED
       from the trade's cost structure, which is the opposite of exact and the
       opposite of yours, and there is no concept field at all.

       The description directly beneath it already said the true thing, "enter
       your country, industry, and revenue", so the card contradicted itself and
       the more prominent half was the wrong one. This title is now the same
       promise the calculator's own h1 makes. */
    title: "Find your break-even, and whether the owner gets paid",
    description:
      "Enter your country, industry, and revenue. See the sales it takes to break even, and whether the owner gets paid.",
  },
];

export default function ToolsHub() {
  return (
    <article className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <header className="max-w-2xl">
        <SectionEyebrow size="md" className="mb-2">
          Tools
        </SectionEyebrow>
        <h1 className="mb-4 font-display text-3xl font-medium leading-tight tracking-tight text-balance text-ink-900 md:text-5xl">
          Tools
        </h1>
        <p className="text-base leading-relaxed text-graphite md:text-lg">
          Three ways to put the benchmarks to work. Each one runs on the same
          data as the rest of the atlas. Pick the one that fits the question you
          are holding.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="atlas-card flex flex-col gap-2 p-6"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-atlas-700">
              {t.eyebrow}
            </div>
            <h2
              data-typography="custom"
              className="font-display text-lg font-medium leading-snug text-ink-900"
            >
              {t.title}
            </h2>
            <p className="flex-1 text-sm leading-relaxed text-graphite">
              {t.description}
            </p>
            <div className="pt-1 text-[11px] font-medium text-atlas-700">
              Open {t.eyebrow.toLowerCase()} &rarr;
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
