/**
 * Embed view — a minimal, iframe-friendly version of a cell.
 *
 * Designed to be dropped into Notion, a blog, or a Confluence page.
 * Hides the global header/footer (via parent layout opt-out) and shows
 * just the headline numbers + a tiny attribution footer.
 *
 * ---------------------------------------------------------------------------
 * THIS ROUTE CANNOT CURRENTLY BE EMBEDDED, and the reason is two files away.
 *
 * next.config.js sends, on `source: "/:path*"`, so on this route too:
 *
 *   X-Frame-Options: DENY
 *   Content-Security-Policy: frame-ancestors 'none'
 *
 * Both instruct every browser to refuse to render this page inside a frame.
 * Anyone following the intent above gets a blank box in their Notion doc, with
 * nothing in the page itself to explain it. The headers are right for the rest
 * of the site; they were simply applied to every path, and this is the one path
 * whose entire purpose they forbid.
 *
 * The feature is also gone from the product: the cell page records "CellActions
 * import removed (save/copy/CSV/embed buttons stripped)", nothing links here,
 * and the route is noindex and absent from the sitemap. So today this is a
 * route with no way in and no way to work.
 *
 * Two honest exits, and both are the founder's call rather than a passing edit:
 *
 *   KEEP IT   scope the two frame headers so /embed/* is excluded (or sends
 *             frame-ancestors *), and put an embed affordance back on the cell
 *             page. Clickjacking risk here is low: the page carries figures and
 *             an attribution line, no forms, no auth, no actions.
 *   DROP IT   delete this route and the middleware pattern at
 *             src/middleware.ts:424 that still matches it.
 *
 * Written down rather than fixed because loosening a security header is a
 * posture decision and deleting a route is a product one.
 * ---------------------------------------------------------------------------
 */

import { notFound } from "next/navigation";
import { getCellBySlug } from "@/lib/cells";
import { fmtMoney } from "@/lib/format/money";

export const revalidate = 604800;
export const dynamicParams = true;

type Params = { country: string; geo: string; industry: string };

/**
 * THE EMBED EMITS NO CANONICAL AT ALL, and that is the decision, not an omission.
 *
 * This route declared `robots` but no `alternates`, and Next resolves metadata
 * down the segment tree per top-level KEY rather than by deep merge, so it
 * inherited the root layout's `alternates: { canonical: "/" }` whole. Every
 * embed URL was therefore a noindex page nominating the HOME PAGE as its
 * canonical: the two most contradictory instructions available, aimed at the
 * most valuable URL on the domain.
 *
 * The obvious repair is a canonical pointing at the real page this embeds,
 * /{country}/{geo}/{industry}, since that page is genuinely where this content
 * lives. It is refused, because noindex and rel=canonical are conflicting
 * signals by construction: one says do not list this URL, the other says treat
 * this URL and that one as the same thing. A crawler resolving the pair can
 * carry the noindex across to the canonical target, and the target here is a
 * cell page. Cell pages ARE the long tail, hundreds of thousands of them, and
 * they are the whole reason the site is a search surface. No consolidation
 * benefit is worth putting a noindex anywhere near them.
 *
 * Nothing is lost by staying silent. An embed is dropped into an iframe on
 * somebody else's page; it accrues no links of its own to consolidate, and the
 * attribution link in the footer below already sends a reader (and any equity)
 * to the full page. `canonical: null` clears the inherited "/" and resolves to
 * no tag, which leaves exactly one instruction standing: do not list this.
 *
 * Same answer, same reasoning, as /account, /signin, /saved and /you.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  // The miss branch inherited the same "/" canonical, so it clears it too.
  if (!cell) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
      alternates: { canonical: null },
    };
  }
  return {
    title: `${cell.industry_name} in ${cell.geo_name} | Margin Atlas`,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
  };
}

export default async function EmbedCell({ params }: { params: Promise<Params> }) {
  const { country, geo, industry } = await params;
  const cell = await getCellBySlug(country, geo, industry);
  if (!cell) notFound();

  const url = `https://www.marginatlas.com/${country}/${geo}/${industry}`;
  return (
    <div className="p-5 max-w-2xl">
      <div className="text-[10px] uppercase tracking-wide text-atlas-600 font-medium">
        {cell.sector_name && <>{cell.sector_name} · </>}
        {cell.geo_name}
      </div>
      <h2 className="mt-1 text-xl font-semibold text-ink-900">
        {cell.industry_name}
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <Stat label="Typical revenue" value={fmtMoney(cell.revenue_per_firm)} />
        <Stat label="Bottom 10%" value={fmtMoney(cell.rev_p10)} />
        <Stat label="Top 10%" value={fmtMoney(cell.rev_p90)} />
        <Stat label="Wage / employee" value={fmtMoney(cell.payroll_per_employee)} />
      </div>
      <div className="mt-4 text-[10px] text-ink-700/60 flex items-center justify-between">
        <span>Source: Margin Atlas</span>
        <a href={url} target="_blank" rel="noopener" className="hover:text-atlas-600">
          View full page →
        </a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-paper-350 rounded-lg p-2.5">
      <div className="text-[10px] uppercase tracking-wide text-ink-700/60 font-medium">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-ink-900 tabular-nums">{value}</div>
    </div>
  );
}
