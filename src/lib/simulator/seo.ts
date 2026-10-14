/**
 * src/lib/simulator/seo.ts , THE CALCULATOR'S ROBOTS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "Canonical /calculator on every view; a view
 * with parameters is noindex and in no sitemap"; the page-architecture spec of 2026-10-09, its rule for views). The bare page keeps the site's default.
 */
import type { Metadata } from "next";
import { COPY } from "@/lib/spine/copy";

export function calculatorMetadata(q: Record<string, string | string[] | undefined>): Metadata {
  const view = Object.values(q).some((x) => x !== undefined);
  return {
    title: COPY.calculator.metaTitle,
    description: COPY.calculator.metaDescription,
    alternates: { canonical: "/calculator" },
    ...(view ? { robots: { index: false, follow: true } } : {}),
  };
}
