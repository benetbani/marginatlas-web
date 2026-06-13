/**
 * Breadcrumb (CC.10) — visible breadcrumb component, distinct from the
 * JSON-LD-only Breadcrumbs in StructuredData.tsx.
 *
 * Adaptive depth: accepts any number of items. On narrow screens, middle
 * items collapse to "···" so the trail never wraps.
 */
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";

export type Crumb = {
  label: string;
  href?: string;
  /** Emoji or character glyph rendered before the label. */
  glyph?: string;
  /** ISO-2 country code — when set, renders the SVG <CountryFlag> instead of an emoji. */
  iso2?: string;
};

type Props = {
  items: Crumb[];
  /** Always show the first + last N items; collapse middle when items > maxVisible. */
  maxVisible?: number;
};

export function Breadcrumb({ items, maxVisible = 4 }: Props) {
  if (items.length === 0) return null;
  // Decide which items to show. Always show first + last 2; collapse middle.
  let visible = items;
  let collapsed = false;
  if (items.length > maxVisible) {
    visible = [items[0], ...items.slice(items.length - (maxVisible - 1))];
    collapsed = true;
  }
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-ink-700 mb-4 flex items-center gap-1 flex-wrap"
    >
      {visible.map((crumb, i) => {
        const isLast = i === visible.length - 1;
        const showCollapsedMarker = collapsed && i === 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
            {showCollapsedMarker ? (
              <>
                <span className="text-ink-700/40" aria-hidden>
                  ···
                </span>
                <span className="text-ink-700/40 mx-1" aria-hidden>
                  /
                </span>
              </>
            ) : null}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="text-atlas-700 hover:text-atlas-700 transition-colors inline-flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
              >
                {crumb.iso2 ? (
                  <CountryFlag iso2={crumb.iso2} label={crumb.label} className="w-4" />
                ) : crumb.glyph ? (
                  <span className="text-base leading-none flag" aria-hidden>
                    {crumb.glyph}
                  </span>
                ) : null}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span className="text-ink-900 font-medium inline-flex items-center gap-1">
                {crumb.iso2 ? (
                  <CountryFlag iso2={crumb.iso2} label={crumb.label} className="w-4" />
                ) : crumb.glyph ? (
                  <span className="text-base leading-none flag" aria-hidden>
                    {crumb.glyph}
                  </span>
                ) : null}
                <span>{crumb.label}</span>
              </span>
            )}
            {!isLast ? (
              <span className="text-ink-700/40 mx-1" aria-hidden>
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
