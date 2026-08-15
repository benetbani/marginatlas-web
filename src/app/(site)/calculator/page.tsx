/**
 * /calculator — the break-even and owner take-home tool.
 *
 * Reframed (Reformation Bible Section 8, features #2 break-even and #6 owner
 * take-home; Section 4.A unit economics; Section 25 voice). The two strongest
 * interactive hooks are here and they are FREE: enter your country, industry,
 * and the revenue you do, and the tool tells you the sales you actually need to
 * clear break-even, then whether the owner gets paid after that.
 *
 * Server component. Warm editorial layout on paper. All interactivity lives in
 * CalculatorForm (client). metadata, canonical, and revalidate are preserved.
 */
import Link from "next/link";
import { COUNTRIES, INDUSTRIES, industryToSlug, isDefaultVisible } from "@/lib/taxonomy";
import { getCoverageRows } from "@/lib/coverage/report";
import { CalculatorForm } from "@/components/CalculatorForm";
import { PageShell, ContentColumn } from "@/components/ui/page-shell";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "Break-even and owner take-home: Margin Atlas calculator",
  description:
    "Enter your country, industry, and revenue. See the sales you actually need to break even, and whether the owner gets paid after that.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  /* Which countries hold a benchmark at all, so the country select can group
     them rather than making a reader discover it four inputs later. */
  const measured = new Set(getCoverageRows().map((r) => r.iso2));
  const countries = [...COUNTRIES]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ ...c, measured: measured.has(c.code) }));
  const industries = [...INDUSTRIES]
    .filter(isDefaultVisible)
    .map((i) => ({ id: i.id, name: i.name, slug: industryToSlug(i.id) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageShell tone="paper">
      <ContentColumn width="wide" className="py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-cocoa-500">
          <Link href="/" className="hover:text-ink-900">
            Home
          </Link>
          <span className="mx-1.5 text-parchment" aria-hidden="true">
            /
          </span>
          <span className="text-graphite">Calculator</span>
        </nav>

        <header className="max-w-3xl">
          <SectionEyebrow size="md">Calculator</SectionEyebrow>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-medium tracking-tight text-balance text-ink-900">
            What sales do you actually need, and does the owner get paid?
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-graphite">
            Pick your country, your industry, and the revenue your firm does in a
            year. The tool does two blunt things. It tells you the sales it takes
            to clear break-even, and it shows where your number sits against
            every comparable firm. Everything above break-even is the owner&apos;s
            pay, before tax.
          </p>
        </header>

        <div className="mt-9">
          <CalculatorForm
            countries={countries.map((c) => ({
              code: c.code,
              name: c.name,
              measured: c.measured,
            }))}
            industries={industries}
          />
        </div>

        <section className="mt-12 grid gap-3 sm:grid-cols-2">
          <Link
            href="/compare"
            className="atlas-card block p-5"
          >
            <h2
              data-typography="custom"
              className="text-base font-semibold text-ink-900"
            >
              Compare three at once
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              Same industry across regions, or three different industries in one
              place. Three benchmarks, one view.
            </p>
          </Link>
          <Link
            href="/browse"
            className="atlas-card block p-5"
          >
            <h2
              data-typography="custom"
              className="text-base font-semibold text-ink-900"
            >
              Start from a place
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-graphite">
              Rather pick the country first, then drill into an industry. The
              whole atlas, browsable.
            </p>
          </Link>
        </section>

        <p className="mt-9 max-w-2xl text-xs leading-relaxed text-cocoa-500">
          The tool runs on the same benchmark data as the rest of the atlas. It
          does not collect or store the revenue you enter: the comparison is
          computed in your browser from the bottom-10%, typical, and top-10%
          values for this industry and place. Break-even and take-home are
          modelled from the cost structure of the trade, so treat them as a
          directional read, not your books.
        </p>
      </ContentColumn>
    </PageShell>
  );
}
