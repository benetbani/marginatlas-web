/**
 * scripts/spikes/stub_next_font.cjs , a --require preload for the render spikes.
 *
 * next/font/google is a build-time transform, not a runtime module: outside
 * `next build` the named exports are undefined and calling one throws
 * "Geist is not a function". The country page reaches it through SpineShell,
 * which it imports for the flag-OFF branch it never takes. Stubbing it lets the
 * real page body render with react-dom/server, which is the technique charter
 * section 9 note 3 prescribes for a machine whose dev server dies.
 *
 * The stub returns the shape next/font hands a caller: a className, a variable
 * and a style object. Nothing under test reads any of them.
 */
const Module = require("node:module");

const FONT_STUB = new Proxy(
  {},
  {
    get() {
      return () => ({
        className: "font-stub",
        variable: "--font-stub",
        style: { fontFamily: "stub" },
      });
    },
  },
);

const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request === "next/font/google" || request === "next/font/local") {
    return "\0next-font-stub";
  }
  return origResolve.call(this, request, ...rest);
};

/* The site chrome's client components call usePathname / useSearchParams, which
   throw "invariant expected app router to be mounted" with no Next runtime
   around them. The page body under test does not read any of it, so a quiet
   stand-in is the smallest thing that lets the real tree render. */
const NAV_STUB = {
  usePathname: () => "/gb",
  useRouter: () => ({ push() {}, replace() {}, refresh() {}, back() {}, prefetch() {} }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  useSelectedLayoutSegment: () => null,
  redirect() {},
  notFound() {
    const e = new Error("NEXT_NOT_FOUND");
    e.digest = "NEXT_NOT_FOUND";
    throw e;
  },
};

const origLoad = Module._load;
Module._load = function (request, ...rest) {
  if (request === "next/font/google" || request === "next/font/local") {
    return FONT_STUB;
  }
  if (request === "next/navigation") {
    const real = origLoad.call(this, request, ...rest);
    return { ...real, ...NAV_STUB, notFound: real.notFound || NAV_STUB.notFound };
  }
  return origLoad.call(this, request, ...rest);
};

/* Stylesheet imports are a bundler affordance too. Node hands `.css` to the JS
   parser and prints the whole file as a syntax error, which is how maplibre's
   stylesheet arrived in this spike's output. Register them as empty modules. */
require.extensions[".css"] = function () {};
