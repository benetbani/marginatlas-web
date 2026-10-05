/**
 * /corrections/new: REPORT A MISTAKE (milestone 2, masterplan step 31; QUEUE close:furniture-lines; the credibility doctrine of
 * 2026-10-02: one "Report a mistake" link on every page). Every spine page's foot links here with its own path
 * (src/components/spine/ReportFoot.tsx). The page holds the site's one correction form (src/components/CorrectionForm.tsx, posting
 * to /api/correction and its corrections table), open, the path sent with the note; until now it was mounted only on the trade
 * page's older branch, which no reader meets.
 *
 * Never indexed: a form to use, not a page to find. It reads the address's `page`, so it renders per request; a path from
 * anywhere but this site is never echoed (src/lib/spine/report.ts).
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { CorrectionForm } from "@/components/CorrectionForm";
import { reportedPath } from "@/lib/spine/report";

export const metadata = {
  title: "Report a mistake | Margin Atlas",
  description: "Tell us a figure, a date or a claim on Margin Atlas is wrong, and on which page.",
  alternates: { canonical: "/corrections/new" },
  robots: { index: false, follow: true },
};

export default async function ReportMistakePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const sp = await searchParams;
  const path = reportedPath(sp.page);
  return (
    <LegalPage
      title="Report a mistake"
      eyebrow="Trust"
      standfirst="Tell us what looks wrong, and where. We read every report, and a figure that turns out wrong is corrected."
      updated="5 October 2026"
      notice={null}
    >
      <LegalSection heading="What looks wrong">
        {path ? (
          <p>
            On{" "}
            <a href={path} className="underline underline-offset-2 hover:text-atlas-600">
              {path}
            </a>
            .
          </p>
        ) : null}
        <CorrectionForm cellUrl={path ?? ""} startOpen />
      </LegalSection>
    </LegalPage>
  );
}
