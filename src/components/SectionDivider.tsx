/**
 * SectionDivider
 * ==============
 *
 * Visual breath between major sections on Atlas pages. Three variants
 * so adjacent sections can use different separators without monotony.
 *
 * Plan v30 Phase 3 — visual language pack.
 */

export type SectionDividerVariant = "subtle" | "labeled" | "ornament";

export type SectionDividerProps = {
  variant?: SectionDividerVariant;
  /** Only used when variant="labeled". */
  label?: string;
  className?: string;
};

export default function SectionDivider({
  variant = "subtle",
  label,
  className,
}: SectionDividerProps) {
  if (variant === "ornament") {
    return (
      <div
        role="separator"
        aria-hidden="true"
        className={`flex items-center justify-center py-8 sm:py-10 ${className ?? ""}`}
      >
        <span className="block w-1 h-1 rounded-full bg-atlas-500/60" />
        <span className="mx-2 block w-1 h-1 rounded-full bg-atlas-500/40" />
        <span className="block w-1 h-1 rounded-full bg-atlas-500/60" />
      </div>
    );
  }
  if (variant === "labeled" && label) {
    return (
      <div
        role="separator"
        aria-label={label}
        className={`flex items-center gap-4 py-8 sm:py-10 ${className ?? ""}`}
      >
        <span className="flex-1 h-px bg-parchment" aria-hidden="true" />
        <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-cocoa-700/70 whitespace-nowrap">
          {label}
        </span>
        <span className="flex-1 h-px bg-parchment" aria-hidden="true" />
      </div>
    );
  }
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`py-8 sm:py-10 ${className ?? ""}`}
    >
      <span className="block h-px bg-parchment opacity-70" />
    </div>
  );
}
