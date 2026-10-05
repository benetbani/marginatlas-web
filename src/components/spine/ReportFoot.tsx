/**
 * ReportFoot, "REPORT A MISTAKE" AND "CHECKED" AT EVERY SPINE PAGE'S FOOT (milestone 2, masterplan step 31; QUEUE
 * close:furniture-lines; the credibility doctrine of 2026-10-02: one "Report a mistake" link on every page, and "Checked [date]"
 * only where a date is held). Under the sources line on a UK page, under the last band elsewhere: the link to the correction page
 * with this page's own path (src/lib/spine/report.ts), and the checked line only when the page's data holds a date
 * (src/lib/spine/checked.ts). At the micro rung, muted, as the sources line; nofollow, since the correction page is a form.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { reportHref } from "@/lib/spine/report";

const dateText = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function ReportFoot({ path, checked = null }: { path: string | null | undefined; checked?: string | null }) {
  return (
    <p data-page-foot className="mt-6 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)] [[data-sources-foot]+&]:mt-2">
      <a data-report="1" href={reportHref(path)} rel="nofollow" className="tap-y whitespace-nowrap underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]">
        {COPY.pageFoot.report}
      </a>
      {checked ? (
        <span data-checked="1" className="ml-4 whitespace-nowrap">
          {COPY.pageFoot.checked} <time dateTime={checked}>{dateText(checked)}</time>
        </span>
      ) : null}
    </p>
  );
}
