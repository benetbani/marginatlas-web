/**
 * /new-businesses: WHERE NEW BUSINESSES OPEN (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 5; the home's spec of
 * 2026-10-09, section 6). One URL added, none renamed. Not indexed until he rules which pages outside the UK are (open since 2026-10-09),
 * so it stands in no sitemap; its links are followed. The body is src/components/spine/openings/openings-view.tsx.
 */
import type { Metadata } from "next";
import { SpineShell } from "@/components/spine/shell";
import { SpineOpeningsBody } from "@/components/spine/openings/openings-view";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Where new businesses open | Margin Atlas",
  description: "New companies by country in Latin America and Africa, and the full-service restaurants US cities added and lost.",
  alternates: { canonical: "/new-businesses" },
  robots: { index: false, follow: true },
};

export default function NewBusinessesPage() {
  return (
    <SpineShell>
      <SpineOpeningsBody />
    </SpineShell>
  );
}
