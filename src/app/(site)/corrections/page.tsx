/**
 * /corrections: THE CORRECTIONS LOG (his ruling of 2026-10-05 on PARKED P31.1, option (a): "a corrections page from launch day,
 * each correction with its date and 'no corrections yet' as its honest first state, and no changelog until there is a data release
 * to list"). It lists data/corrections.json, newest first: the day, the page, what it said, what it says now and why. Empty, it
 * says so. The form a reader reports a mistake with lives beside it at /corrections/new, and each links the other.
 *
 * No promise of answer or fix times is printed: the credibility doctrine proposes two working days and five, and his ruling did
 * not make that promise. The gate corrections-log (tests/trust/corrections_log.test.ts) holds all of it.
 */
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { getCorrections } from "@/lib/corrections";

export const metadata = {
  title: "Corrections | Margin Atlas",
  description: "Every correction made on Margin Atlas, with the date, what the page said and what it says now.",
  alternates: { canonical: "/corrections" },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export default function CorrectionsPage() {
  const entries = getCorrections();
  return (
    <LegalPage
      title="Corrections"
      eyebrow="Trust"
      standfirst="Every correction we make, dated, with what the page said and what it says now."
      updated="5 October 2026"
      notice={null}
    >
      <LegalSection heading="The list">
        {entries.length === 0 ? (
          <p>No corrections yet.</p>
        ) : (
          <ol className="space-y-5">
            {entries.map((e) => (
              <li key={`${e.date}-${e.page}`}>
                <p className="font-semibold text-ink-900">
                  {longDate(e.date)},{" "}
                  <Link href={e.page} className="underline underline-offset-2 hover:text-atlas-600">
                    {e.page}
                  </Link>
                </p>
                <p>It said: {e.said}</p>
                <p>It says now: {e.says}</p>
                <p>Why: {e.why}</p>
              </li>
            ))}
          </ol>
        )}
      </LegalSection>
      <LegalSection heading="Found a mistake?">
        <p>
          Every page ends with a &ldquo;Report a mistake&rdquo; link. You can also{" "}
          <a href="/corrections/new" className="underline underline-offset-2 hover:text-atlas-600">
            report one here
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
