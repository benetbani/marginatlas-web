/**
 * Plan v28 Lane D — editorial voice card.
 *
 * Renders a single calm paragraph between the data sections of a cell
 * or country page. Reads from src/lib/editorial/blurbs.ts.
 *
 * Server component. Zero client cost.
 */
import { getEditorialBlurb } from "@/lib/editorial/blurbs";

type Props = {
  industryId?: string | null;
  sectorId?: string | null;
  iso2?: string | null;
};

export function EditorialNote({ industryId, sectorId, iso2 }: Props) {
  const text = getEditorialBlurb({ industryId, sectorId, iso2 });
  if (!text) return null;
  return (
    <section className="py-8 md:py-10">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-3">
        Editor&apos;s note
      </div>
      <div className="relative max-w-3xl">
        <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-atlas-500/30" aria-hidden />
        <p className="text-base md:text-lg text-ink-900 leading-relaxed pl-4 italic">
          {text}
        </p>
      </div>
    </section>
  );
}
