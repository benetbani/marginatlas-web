/**
 * HomeColophon, THE HOME'S LAST WORD (plan 2026-10-13 home-quiet-editorial, Task 6; spec docs/superpowers/specs/2026-10-13-home-
 * quiet-editorial-design.md, section 2, item 5): one ruled block in place of the two small foot lines, gathering what a careful reader looks
 * for at a page's foot: the licence line the UK's figures ask for (OGL_LINE), Sources and licences, Report a mistake (this page's path,
 * src/lib/spine/report.ts; nofollow, since the correction page is a form), the corrections log and the site's status. NO CHECKED DATE (the
 * plan's Q3, ruled B): src/lib/spine/checked.ts prints a date only on a page whose figures that data backs, and the home prints no register
 * figure. At the body rung in ink2, the licence line within the prose measure, a hairline between it and the links, every link 44 tall to
 * the tap. It keeps the foot lines' hook, data-page-foot, so globals.css paints it as the tint band edge to edge under the last zone, and
 * the Report link keeps its own (data-report), which tests/spine/page_foot.test.ts reads on every page.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";
import { OGL_LINE, UK_SOURCES_FOOT } from "@/lib/spine/uk_sources";
import { reportHref } from "@/lib/spine/report";

const LINK = "tap-y inline-flex min-h-11 items-center underline decoration-[var(--c-line-strong)] underline-offset-2 transition-colors hover:text-[var(--c-ink)]";

export function HomeColophon() {
  const C = COPY.home.colophon;
  return (
    <section id="colophon" data-colophon="" data-page-foot="" aria-label={C.label} className="pt-8 pb-8 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">
      <p data-licence="" className="max-w-[min(64ch,var(--measure-half))] text-pretty">
        {OGL_LINE}
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 border-t border-[var(--c-border)] pt-2">
        <li>
          <a href={UK_SOURCES_FOOT.href} className={LINK}>{UK_SOURCES_FOOT.link}</a>
        </li>
        <li>
          <a data-report="1" href={reportHref("/")} rel="nofollow" className={LINK}>{COPY.pageFoot.report}</a>
        </li>
        <li>
          <a href="/corrections" className={LINK}>{COPY.home.contents.method.corrections}</a>
        </li>
        <li>
          <a href="/status" className={LINK}>{C.status}</a>
        </li>
      </ul>
    </section>
  );
}
