/**
 * scripts/verify_subtypes.ts
 *
 * THE SUBTYPE IS THE UNIT THE OPERATOR ACTUALLY IS.
 *
 * Ratified 2026-07-31, decisions 9 to 12, from the founder's own framing: "for
 * a person opening a Middle Eastern fast food in London, giving him the average
 * of restaurants is not that smart." Every figure on a trade page is an average
 * across subtypes that behave nothing alike, and averaging a kebab counter with
 * a tasting room produces a number that describes neither.
 *
 * WHAT IT CHECKS, per cell file:
 *   1. At most ten subtypes. The founder capped it and refused a fixed number:
 *      "depending on the trade, not more than 10".
 *   2. Repeat frequency is one of four bands, never a number. It is banded for
 *      the same reason district wealth is: the ordering is real and the decimal
 *      is not, and a visit count would be a claim about a specific business we
 *      have never observed.
 *   3. No numeric field smuggles a repeat count in under another name.
 *   4. Slugs are unique and kebab-case, since they will become URL segments if
 *      subtypes ever get their own pages.
 *   5. Every subtype states all five facts, as a figure or as an honest null.
 *      A subtype missing `fitOut` entirely is a hole; one carrying a NullFigure
 *      with a reason is a stated gap, and the difference is the whole
 *      completeness rule.
 *
 * A NullFigure for the whole set is legitimate and will be the normal state for
 * a long time: the section still renders and says this city is not filled yet.
 *
 * Usage: npx tsx scripts/verify_subtypes.ts
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { REPEAT_BANDS } from "../src/lib/cells/spine2_types";

/** Decision 9. */
const MAX_SUBTYPES = 10;
/** Decision 10. All five, every time, as a figure or a stated null. */
const REQUIRED_FACTS = ["staff", "orderValue", "repeat", "space", "fitOut"] as const;

const bands = new Set<string>(REPEAT_BANDS);
const failures: string[] = [];

function cellFiles(): string[] {
  const out: string[] = [];
  for (const dir of ["data/cells", "fixtures"]) {
    const abs = resolve(process.cwd(), dir);
    if (!existsSync(abs)) continue;
    for (const n of readdirSync(abs)) if (n.endsWith(".json")) out.push(resolve(abs, n));
  }
  return out;
}

let filled = 0;
let nulled = 0;

for (const file of cellFiles()) {
  let doc: Record<string, unknown>;
  try {
    doc = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  // Only cell files carry subtypes; a city file has no modelRoom.
  if (!doc.modelRoom) continue;
  const rel = file.replace(process.cwd(), "").replace(/\\/g, "/").replace(/^\//, "");

  const s = doc.subtypes as Record<string, unknown> | undefined;
  if (!s) {
    failures.push(
      `${rel}: subtypes is absent entirely. A page's shape never varies by place,\n` +
        `      so a cell with nothing filled holds a NullFigure carrying its reason.`,
    );
    continue;
  }
  if (s.value === null) {
    if (!s.reason) failures.push(`${rel}: subtypes is null but states no reason. A hole must say why it is a hole.`);
    nulled++;
    continue;
  }
  filled++;

  const rows = (s.rows as Array<Record<string, unknown>>) ?? [];
  if (rows.length > MAX_SUBTYPES) {
    failures.push(`${rel}: ${rows.length} subtypes; the ratified maximum is ${MAX_SUBTYPES}.`);
  }

  const slugs = new Set<string>();
  for (const r of rows) {
    const slug = String(r.slug ?? "");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      failures.push(`${rel}: subtype slug "${slug}" is not kebab-case. Slugs may become URL segments.`);
    }
    if (slugs.has(slug)) failures.push(`${rel}: subtype slug "${slug}" appears more than once.`);
    slugs.add(slug);

    for (const fact of REQUIRED_FACTS) {
      if (!(fact in r)) {
        failures.push(
          `${rel}: subtype "${slug}" does not state "${fact}". State it as a figure or as\n` +
            `      a null with a reason; an absent key is a hole, not a stated gap.`,
        );
      }
    }

    const repeat = String(r.repeat ?? "");
    if (repeat && !bands.has(repeat)) {
      failures.push(
        `${rel}: subtype "${slug}" has repeat = "${repeat}", which is not one of the four\n` +
          `      bands. Allowed: ${[...bands].join(", ")}`,
      );
    }
    if (typeof r.repeat === "number") {
      failures.push(
        `${rel}: subtype "${slug}" carries repeat as a NUMBER. A visit count is a claim\n` +
          `      about a specific business we have never observed. Band it.`,
      );
    }
    for (const [k, v] of Object.entries(r)) {
      if (/visit|frequency|returns/i.test(k) && typeof v === "number") {
        failures.push(
          `${rel}: subtype "${slug}" carries a numeric "${k}". Repeat frequency is banded;\n` +
            `      a number under another name is the same claim.`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error(`x verify_subtypes: ${failures.length} problem(s).\n`);
  for (const f of failures) console.error("   " + f);
  process.exit(1);
}

console.log(
  `verify_subtypes: PASS. ${filled} cell(s) with subtypes filled, ${nulled} stating an honest gap.`,
);
