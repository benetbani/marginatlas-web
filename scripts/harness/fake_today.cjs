/* scripts/harness/fake_today.cjs: A CLOCK MOVED FOR A RENDER (plan 2026-10-11 gb-ch04-lone-state; QUEUE gb:ch04-lone-state).
   A --require preload for the harness only. With ATLAS_FAKE_TODAY=YYYY-MM-DD it moves the process's clock to noon UTC of that day, so a page
   that reads "today" draws as it will on that day: /gb's duel leaves its 45-day window on the 46th day after its data's end
   (src/lib/home/duel.ts). An offset, never a frozen instant: the clock keeps ticking from there, so whatever measures elapsed time still
   measures it (withBudget, src/lib/cells.ts). new Date() and Date.now() move; a Date with arguments, Date.parse, Date.UTC, Date() and
   instanceof behave as before. Without the variable it changes nothing. No route, page or chain gate loads it: a render command that names
   it does, and tests/home/duel.test.ts holds it. */
const day = process.env.ATLAS_FAKE_TODAY;
if (day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error(`fake_today: ATLAS_FAKE_TODAY must be YYYY-MM-DD, not "${day}"`);
  const RealDate = Date;
  const target = RealDate.parse(`${day}T12:00:00Z`);
  if (!Number.isFinite(target)) throw new Error(`fake_today: "${day}" is no date`);
  const offset = target - RealDate.now();
  const now = () => RealDate.now() + offset;
  function FakeDate(...args) {
    if (!new.target) return new RealDate(now()).toString();
    return args.length === 0 ? new RealDate(now()) : new RealDate(...args);
  }
  FakeDate.prototype = RealDate.prototype;
  Object.setPrototypeOf(FakeDate, RealDate);
  FakeDate.now = now;
  globalThis.Date = FakeDate;
  process.stderr.write(`fake_today: the clock reads ${day}\n`);
}
