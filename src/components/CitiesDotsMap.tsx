/**
 * Stylized world dots for the "Top 100 cities" placeholder.
 *
 * Decorative inline SVG: ~24 city dots on an equirectangular layout with
 * three "active" cities ringed in atlas-600 to suggest the neighborhood
 * drill-down the placeholder describes. No labels, no interactivity —
 * the goal is to give the placeholder card a visual anchor without
 * shipping a real interactive map.
 */
type City = { x: number; y: number; active?: boolean };

const CITIES: City[] = [
  // North America
  { x: 137, y: 124 },   // Los Angeles
  { x: 128, y: 116 },   // San Francisco
  { x: 205, y: 107 },   // Chicago
  { x: 223, y: 103 },   // Toronto
  { x: 235, y: 110, active: true }, // New York
  { x: 180, y: 157 },   // Mexico City
  // South America
  { x: 235, y: 190 },   // Bogotá
  { x: 296, y: 252 },   // São Paulo
  { x: 304, y: 251 },   // Rio
  { x: 270, y: 277 },   // Buenos Aires
  // Europe
  { x: 400, y: 86, active: true },  // London
  { x: 405, y: 91 },    // Paris
  { x: 392, y: 110 },   // Madrid
  { x: 430, y: 83 },    // Berlin
  { x: 425, y: 100 },   // Milan
  { x: 464, y: 109 },   // Istanbul
  { x: 484, y: 76 },    // Moscow
  // Africa
  { x: 407, y: 186 },   // Lagos
  { x: 469, y: 133 },   // Cairo
  { x: 482, y: 203 },   // Nairobi
  { x: 441, y: 275 },   // Cape Town
  // Middle East / South Asia
  { x: 523, y: 144 },   // Dubai
  { x: 572, y: 136 },   // Delhi
  { x: 562, y: 158 },   // Mumbai
  // East Asia + Oceania
  { x: 623, y: 169 },   // Bangkok
  { x: 631, y: 197 },   // Singapore
  { x: 654, y: 150 },   // Hong Kong
  { x: 682, y: 116 },   // Seoul
  { x: 710, y: 121, active: true }, // Tokyo
  { x: 736, y: 275 },   // Sydney
];

export function CitiesDotsMap() {
  return (
    <svg
      viewBox="0 0 800 320"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      role="img"
      aria-label="Stylized world dots representing covered cities."
    >
      {/* faint guide grid: equator + a few latitude / longitude hints */}
      <g stroke="#D9D2C4" strokeWidth="0.6" strokeDasharray="2 3" fill="none">
        <line x1="0" y1="160" x2="800" y2="160" />
        <line x1="400" y1="0" x2="400" y2="320" />
      </g>
      {/* faint continent suggestion: rough archipelagos of small dots */}
      <g fill="#DDDDDD">
        {Array.from({ length: 90 }).map((_, i) => {
          // pseudo-random scatter biased to a continental belt
          const seed = (i * 9301 + 49297) % 233280;
          const r = seed / 233280;
          const x = ((r * 9999) % 800);
          const y = (((seed * 0.71) | 0) % 280) + 20;
          return <circle key={`bg-${i}`} cx={x} cy={y} r="1.2" />;
        })}
      </g>
      {/* covered cities */}
      <g>
        {CITIES.map((c, i) =>
          c.active ? (
            <g key={`city-${i}`}>
              <circle cx={c.x} cy={c.y} r="9" fill="none" stroke="#0F766E" strokeWidth="1.2" opacity="0.45" />
              <circle cx={c.x} cy={c.y} r="4.5" fill="#0F766E" />
            </g>
          ) : (
            <circle key={`city-${i}`} cx={c.x} cy={c.y} r="3" fill="#475569" />
          ),
        )}
      </g>
    </svg>
  );
}
