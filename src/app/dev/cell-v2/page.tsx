/**
 * /dev/cell-v2 , Phase B preview (noindex, internal).
 *
 * The real cell page composed from GENUINE components: the kit AnswerFirstMasthead
 * (with the signature RangeStrip spread), MoneyGoesBreakdown, and StillFillingIn,
 * plus the purchased shadcnblocks blocks (Feature43, Cta10), all themed warm by
 * the one token bridge in globals.css. London restaurants exemplar data, inlined
 * so the route prerenders with no DB path. First cut for the Vercel preview loop;
 * the kit charts (break-even, wages, seasonality, first-year, nearby) are added in
 * the next iteration once their look is confirmed here. Tokens only, no em-dashes.
 */
import type { Metadata } from "next";
import { AnswerFirstMasthead, MoneyGoesBreakdown, StillFillingIn } from "@/components/kit";
import { Feature43 } from "@/components/blocks/feature43";
import { Cta10 } from "@/components/blocks/cta10";

export const metadata: Metadata = {
  title: "Cell v2 (London restaurants) , preview",
  robots: { index: false, follow: false },
};

function fmtMoney(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

export default function CellV2Preview() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-display text-xl tracking-tight">
            Margin <span className="text-primary">Atlas</span>
          </span>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <span>Countries</span>
            <span>Industries</span>
            <span>Cities</span>
            <span>Compare</span>
          </nav>
          <a
            href="#"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
          >
            Get the data
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        <AnswerFirstMasthead
          eyebrow="Restaurants · London · United Kingdom"
          title="A London restaurant brings in about $503K a year."
          answer="The owner keeps about $48K of it. Strong revenue, thin take-home: rent and wages decide it, not the dining room."
          anchor={{ label: "Typical revenue a year", value: 503000, format: "usd-full" }}
          spread={{ p10: 252000, p25: 362000, p50: 503000, p75: 679000, p90: 905000, format: fmtMoney }}
          stats={[
            { label: "Net margin", value: "10%" },
            { label: "Owner take-home", value: "$48K" },
            { label: "Restaurants in London", value: "8,200" },
          ]}
          breakIn="Hard to break into"
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <MoneyGoesBreakdown
          id="money"
          heading="Every $100 of revenue"
          lede="Only the last sliver is the owner's. The kitchen and the lease take the rest."
          items={[
            { label: "Cost of goods", perHundred: 30 },
            { label: "Payroll", perHundred: 33, hint: "wages and on-costs" },
            { label: "Rent and premises", perHundred: 15 },
            { label: "Everything else", perHundred: 12 },
            { label: "What the owner keeps", perHundred: 10, kept: true },
          ]}
        />
      </div>

      <Feature43
        heading="What that looks like day to day"
        buttons={{}}
        features={[
          { title: "About 140 covers a day", description: "The room turns over roughly 140 covers across a typical trading day." },
          { title: "About $12 average spend", description: "Each cover spends around twelve dollars, drinks and service included." },
          { title: "12 people on the payroll", description: "A typical kitchen and front of house runs about a dozen staff." },
        ]}
      />

      <Cta10
        heading="A wages-and-rent business, not a high-margin one."
        description="The headline revenue is real, but the rent takes a bigger bite here than almost anywhere else, and skilled kitchen staff are hard to keep. Pricing power is the lever that makes the model work."
        buttons={{}}
      />

      <div className="mx-auto max-w-5xl px-6 py-6">
        <StillFillingIn
          place="London restaurants"
          sections={[
            { id: "operator-voices", label: "Operator voices" },
            { id: "vs-world", label: "Versus the world" },
          ]}
        />
      </div>

      <Cta10
        heading="See the same trade in another place"
        description="Compare a London restaurant against Manchester, Edinburgh, or Bristol on the same like-for-like basis."
        buttons={{ primary: { text: "Compare places", url: "#" } }}
      />
    </main>
  );
}
