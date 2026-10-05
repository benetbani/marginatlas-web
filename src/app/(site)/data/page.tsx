/**
 * /data: THE FREE UK DATA PACK (his ruling of 2026-10-05 on PARKED P0.3, option (a): "free and public, cited, as the credibility
 * plan proposes"). Every published file of the current version, what it holds and its link; the licence; how to cite. The files
 * are static under public/data/uk/<version>/ (scripts/data/publish_pack.ts); the list and its words are src/lib/data_pack.ts. The
 * gate data-pack holds the page, the files and the list together.
 */
import { LegalPage, LegalSection } from "@/components/LegalPage";
import { PACK_FILES, PACK_RELEASED, PACK_VERSION, packHref } from "@/lib/data_pack";

export const metadata = {
  title: "Data | Margin Atlas",
  description: "Free downloads of the UK tables behind Margin Atlas, with their sources and licences.",
  alternates: { canonical: "/data" },
};

export default function DataPage() {
  return (
    <LegalPage
      title="Data"
      eyebrow="Data"
      standfirst="The tables behind the UK pages, free to download and reuse with credit."
      updated={PACK_RELEASED}
      notice={null}
    >
      <LegalSection heading={`Version ${PACK_VERSION}`}>
        <ul className="space-y-3">
          {PACK_FILES.map((f) => (
            <li key={f.file}>
              <a href={packHref(f.file)} className="font-semibold text-ink-900 underline underline-offset-2 hover:text-atlas-600">
                {f.file}
              </a>
              <span className="block">
                {f.title}: {f.holds}
              </span>
            </li>
          ))}
        </ul>
      </LegalSection>
      <LegalSection heading="Reuse and credit">
        <p>
          Our tables are free to reuse under CC BY 4.0. Credit Margin Atlas and the version, for example: Margin Atlas, UK register
          tables, version {PACK_VERSION}.
        </p>
        <p>Each source&apos;s own figures stay under its own licence. The read me gives every attribution line.</p>
      </LegalSection>
      <LegalSection heading="What they cannot see">
        <p>
          The registers count registered businesses only, so a business registered for neither VAT nor PAYE is absent. The read me
          lists every limit, table by table.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
