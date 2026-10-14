/**
 * /calculator: THE COST SIMULATOR (plan 2026-10-13 cost-simulator, Task 4B; spec section 3: "At /calculator (its route, canonical, hub card and footer
 * links stand)"). The route stands where the circular form stood; no URL is renamed. It reads its address, so it renders on each request: the place's
 * three words choose the defaults and an unknown word answers 404. The body is src/components/spine/calculator/calculator-view.tsx.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpineShell } from "@/components/spine/shell";
import { SpineCalculatorBody } from "@/components/spine/calculator/calculator-view";
import { buildCalculatorSeed } from "@/lib/simulator/load";
import { COPY } from "@/lib/spine/copy";

type Search = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined): string | null => (Array.isArray(v) ? v[0] : v) ?? null;

export const metadata: Metadata = {
  title: COPY.calculator.metaTitle,
  description: COPY.calculator.metaDescription,
  alternates: { canonical: "/calculator" },
};

export default async function CalculatorPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const seed = await buildCalculatorSeed({ country: one(q.country), city: one(q.city), trade: one(q.trade) });
  if (!seed) notFound();
  return (
    <SpineShell>
      <SpineCalculatorBody data={seed} />
    </SpineShell>
  );
}
