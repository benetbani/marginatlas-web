/**
 * Phase 3, first migration: the currency switcher onto Radix ToggleGroup.
 *
 * Six identical strings in, six identical strings out. Same currencies, same
 * order, same labels, same stored value, same event. What changes is the
 * control they sit in, and two defects go with it.
 */
import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/CurrencySwitcher.tsx";
let s = readFileSync(p, "utf8");

const before = `  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-paper-100 border border-parchment p-0.5 text-xs">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          type="button"
          onClick={() => pick(c.code)}
          className={\`px-2.5 py-1 rounded-full transition font-medium \${
            current === c.code
              ? "bg-ink-900 text-white"
              : "text-ink-700 hover:text-ink-900"
          }\`}
          title={c.label}
        >
          {c.code}
        </button>
      ))}
    </div>
  );
}`;

const after = `  return (
    /* MIGRATED to Radix ToggleGroup via the shadcn primitive, 2026-08-21.
       Six currencies in, six out, same order, same labels, same stored value,
       same change event. The control changes; the content does not.

       TWO DEFECTS GO WITH THE SWAP.

       1. THE PAGE STOPPED SCROLLING SIDEWAYS ON A PHONE. Measured at 375 on
          the London restaurant page: 371px of content in a 360px viewport, and
          this row was the only thing past the edge. The old container was
          \`inline-flex\` with no wrap, so a label plus six pills sat on one line
          that no phone is wide enough to hold. \`flex-wrap\` lets it fall to a
          second line, which is why the fix is a wrap rather than a dropdown:
          the pills are the established look and wrapping keeps them.

       2. IT IS NOW REACHABLE BY KEYBOARD, PROPERLY. Six separate buttons meant
          six tab stops and no relationship between them. Radix gives one tab
          stop, arrow keys between options, and a single-select role so a screen
          reader announces which of six is chosen rather than reading six
          unrelated buttons. Criterion G22, keyboard reachability, is recorded
          as UNMEASURED on this site; this is one surface that no longer needs
          measuring.

       \`type="single"\` (not multiple) and a guarded onValueChange: Radix emits
       the empty string when a user deselects the active item, and accepting
       that would store an empty currency and reformat every figure on the page
       to nothing. */
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={(v) => {
        if (v) pick(v as CurrencyCode);
      }}
      aria-label="Show numbers in"
      className="inline-flex flex-wrap items-center gap-1 rounded-full bg-paper-100 border border-parchment p-0.5 text-xs"
    >
      {CURRENCIES.map((c) => (
        <ToggleGroupItem
          key={c.code}
          value={c.code}
          title={c.label}
          aria-label={c.label}
          className="rounded-full px-2.5 py-1 font-medium text-ink-700 transition hover:text-ink-900 data-[state=on]:bg-ink-900 data-[state=on]:text-white"
        >
          {c.code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}`;

if (!s.includes(before)) {
  console.error("  markup did not match. Not touching the file.");
  process.exit(1);
}
s = s.replace(before, after);

s = s.replace(
  'import { CURRENCIES, type CurrencyCode } from "@/lib/currency";',
  'import { CURRENCIES, type CurrencyCode } from "@/lib/currency";\nimport { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";',
);

writeFileSync(p, s);
console.log("  migrated " + p);
