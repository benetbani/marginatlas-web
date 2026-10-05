/**
 * /about: WHO RUNS THIS (his ruling of 2026-10-05 on PARKED P0.2, option (a): "a short about page with his name and why the site
 * exists"). It names him, says why the site exists and how a figure is checked, and leads to the contact form, About the figures,
 * the corrections log and the data pack.
 *
 * Only what he has given: his background, a photograph, a company with its number, and the independence and AI lines of the
 * credibility plan's draft (CREDIBILITY.md, section 5) are his to supply or edit, so none is printed. The gate about-page holds it.
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "About | Margin Atlas",
  description: "Who makes Margin Atlas, why it exists, and how its figures are checked.",
  alternates: { canonical: "/about" },
};

const LINK = "underline underline-offset-2 hover:text-atlas-600";

export default function AboutPage() {
  return (
    <LegalPage title="About" eyebrow="Trust" standfirst="Who makes Margin Atlas, and why." updated="5 October 2026" notice={null}>
      <LegalSection heading="Who makes it">
        <p>Margin Atlas is made by Benet Bani.</p>
      </LegalSection>
      <LegalSection heading="Why it exists">
        <p>
          Before someone opens a shop, a salon or a restaurant, they need to know whether it can work where they want to open it.
          Margin Atlas answers with figures: what a business like theirs takes in a place, what it costs to open and run, and how
          many like it are still trading years later.
        </p>
        <p>For the UK, every figure that has an official source comes from it. The others are estimates.</p>
      </LegalSection>
      <LegalSection heading="How a figure is checked">
        <p>
          <a href="/about-data" className={LINK}>About the figures</a> says where each figure comes from. Every page ends with a
          &ldquo;Report a mistake&rdquo; link, and every correction is listed on the{" "}
          <a href="/corrections" className={LINK}>corrections page</a>. The tables behind the UK pages are free on the{" "}
          <a href="/data" className={LINK}>data page</a>.
        </p>
      </LegalSection>
      <LegalSection heading="Contact">
        <p>
          Write from the <a href="/contact" className={LINK}>contact page</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
