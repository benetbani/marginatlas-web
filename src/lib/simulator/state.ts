/**
 * src/lib/simulator/state.ts , THE READER'S CHANGES IN THE ADDRESS (plan 2026-10-13 cost-simulator, Task 5; spec section 3: "only the levers that differ
 * from the defaults (?country=gb&city=london&trade=restaurants&v=...) ... an unknown lever is ignored, one out of range clamped"; R7 4.4's form).
 *
 * THE FORM. `v` is pairs `key:value` joined by commas: a lever and its base figure (four decimals at most, shares as decimals; an empty value is a field
 * the reader cleared), `team:` role-heads pairs joined by dots, `pay:` role-amount pairs joined by dots, `owner:on` or `owner:<figure>` (the same for
 * `target`), `form:company` or `form:sole`. A role is the bundle's own key, [a-z0-9_], so a dot before a letter parts two pairs and a dot before a
 * digit is a decimal point. Every character is one a query string carries as it is. Pure: the server decodes, the browser encodes.
 */
import { DEFAULT_PLACE, FRESH, LEVERS, type LeverKey, type SimBundle, type SimState } from "./bundle";
import { HEADS_MAX, PAY_MAX, clampTo } from "./bounds";
import type { Place } from "./place";

export const ADDRESS_DEBOUNCE_MS = 250;
const NUM = /^-?\d+(?:\.\d+)?$/;
const MAX_V = 2000;
/* Four decimals: a share steps by 0.005 (32.5% is 0.325), and a money figure keeps its pennies (the final review's I3). */
const num = (x: number) => String(Math.round(x * 10000) / 10000);
const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

export function encodeState(s: SimState, b: SimBundle): string | null {
  const parts: string[] = [];
  for (const k of LEVERS) {
    if (k === "owner" || k === "target" || !has(s.levers, k)) continue;
    const x = s.levers[k];
    if (x === null || x === undefined) parts.push(`${k}:`);
    else if (x !== b.inputs[k].value) parts.push(`${k}:${num(x)}`);
  }
  for (const k of ["owner", "target"] as const) {
    if (!s.on[k]) continue;
    const x = s.levers[k];
    parts.push(x === null || x === undefined ? `${k}:on` : `${k}:${num(x)}`);
  }
  const team = b.roles.filter((r) => has(s.heads, r.key) && s.heads[r.key] !== r.heads).map((r) => `${r.key}-${num(s.heads[r.key])}`);
  if (team.length > 0) parts.push(`team:${team.join(".")}`);
  const pay = b.roles.filter((r) => has(s.pay, r.key) && s.pay[r.key] !== r.pay.value).map((r) => `${r.key}-${num(s.pay[r.key])}`);
  if (pay.length > 0) parts.push(`pay:${pay.join(".")}`);
  if (s.form && b.tax.law === "uk" && s.form !== b.tax.form) parts.push(`form:${s.form === "company" ? "company" : "sole"}`);
  return parts.length > 0 ? parts.join(",") : null;
}

export function decodeState(v: string | null | undefined, b: SimBundle): SimState {
  if (typeof v !== "string" || v === "" || v.length > MAX_V) return FRESH;
  const s: SimState = { levers: {}, on: {}, heads: {}, pay: {}, form: null };
  const roles = new Set(b.roles.map((r) => r.key));
  for (const pair of v.split(",")) {
    const at = pair.indexOf(":");
    if (at <= 0) continue;
    const key = pair.slice(0, at);
    const raw = pair.slice(at + 1);
    if (key === "team" || key === "pay") {
      for (const rp of raw.split(/\.(?=[a-z])/)) {
        const dash = rp.lastIndexOf("-");
        const role = rp.slice(0, dash);
        const n = rp.slice(dash + 1);
        if (dash <= 0 || !roles.has(role) || !NUM.test(n)) continue;
        if (key === "team") s.heads[role] = Math.min(HEADS_MAX, Math.max(0, Number(n)));
        else s.pay[role] = Math.min(PAY_MAX, Math.max(0, Number(n)));
      }
      continue;
    }
    if (key === "form") {
      if (b.tax.law === "uk" && (raw === "company" || raw === "sole")) s.form = raw === "company" ? "company" : "sole trader";
      continue;
    }
    if (!(LEVERS as readonly string[]).includes(key)) continue;
    const k = key as LeverKey;
    if (k === "owner" || k === "target") {
      if (raw === "on") s.on[k] = true;
      else if (NUM.test(raw)) { s.on[k] = true; s.levers[k] = clampTo(k, Number(raw)); }
      continue;
    }
    if (raw === "") s.levers[k] = null;
    else if (NUM.test(raw)) s.levers[k] = clampTo(k, Number(raw));
  }
  return s;
}

/** The view's address: /calculator for the default place at its defaults, else the place's words and the changes. */
export function calculatorHref(place: Pick<Place, "country" | "city" | "trade">, s: SimState, b: SimBundle): string {
  const v = encodeState(s, b);
  const bare = place.country === DEFAULT_PLACE.country && place.city === DEFAULT_PLACE.city && place.trade === DEFAULT_PLACE.trade;
  if (bare && v === null) return "/calculator";
  return `/calculator?country=${place.country}${place.city ? `&city=${place.city}` : ""}&trade=${place.trade}${v ? `&v=${v}` : ""}`;
}
