// The pipa as drawn on the site, lying on its side in a 600 x 200 box: geometry shared by
// About › Off the clock (strings you can pluck) and the 404 page (one string snapped).
export const W = 600;
export const H = 200;
export const NUT = 74;
export const BRIDGE = 536;
// top to bottom: the thinnest, highest string first; they fan out from nut to bridge
export const STRINGS = [
  { y0: 94, y1: 81, f: 220.0, w: 0.8 },
  { y0: 98, y1: 93.7, f: 164.81, w: 1.0 },
  { y0: 102, y1: 106.3, f: 146.83, w: 1.2 },
  { y0: 106, y1: 119, f: 110.0, w: 1.5 },
];
export const base = (s: (typeof STRINGS)[number], x: number) => s.y0 + ((s.y1 - s.y0) * (x - NUT)) / (BRIDGE - NUT);
// frets at equal-tempered steps from the nut: the first four are the tall xiang on the
// neck, the rest the thin pin frets running down the soundboard
const span = (x: number) => [base(STRINGS[0], x), base(STRINGS[3], x)];
const FRETS = Array.from({ length: 17 }, (_, k) => NUT + (BRIDGE - NUT) * (1 - 2 ** (-(k + 1) / 12)));
const XIANG = FRETS.slice(0, 4)
  .map((x) => `M${x.toFixed(1)} 88.5V111.5`)
  .join("");
const PIN = FRETS.slice(4)
  .map((x) => {
    const [a, b] = span(x);
    return `M${x.toFixed(1)} ${(a - 5).toFixed(1)}V${(b + 5).toFixed(1)}`;
  })
  .join("");
// the body: a narrow neck that swells, without a step, into the pear
const BODY =
  "M74 89 C120 88.5 160 87.5 182 85.5 C232 81 286 46 362 24 C424 8 486 6 532 13 C574 20 598 56 598 100 " +
  "C598 144 574 180 532 187 C486 194 424 192 362 176 C286 154 232 119 182 114.5 C160 112.5 120 111.5 74 111";
export function PipaBody() {
  return (
    <>
      <path className="pipa-fill" d={`${BODY} Z`} />
      <g className="pipa-body">
        {/* the head, bent back, a pegbox ending in a curled finial */}
        <path pathLength={1} d="M74 89 L32 92 C22 92 14 90 10 95 C6 100 10 106 16 105 C20 104.5 21 100 17 99.5 M74 111 L32 108 C24 108 18 107 16 105" />
        {/* four long pegs, two each side, swept back toward the head */}
        <path pathLength={1} d="M62 89.5 L52 70 C50 66 55 64 57 68 L66 89.2 M42 91 L32 71 C30 67 35 65 37 69 L46 90.7 M62 110.5 L52 130 C50 134 55 136 57 132 L66 110.8 M42 109 L32 129 C30 133 35 135 37 131 L46 109.3" />
        {/* the nut */}
        <path pathLength={1} d="M74 89V111" />
        <path pathLength={1} d={BODY} />
        <path pathLength={1} className="xiang" d={XIANG} />
        <path pathLength={1} className="frets" d={PIN} />
        {/* the fu shou, the carved tailpiece the strings tie to */}
        <path pathLength={1} d="M532 74 C527 70 527 64 534 64 C539 66 540 72 540 78 V122 C540 128 539 134 534 136 C527 136 527 130 532 126 Z" />
      </g>
    </>
  );
}
