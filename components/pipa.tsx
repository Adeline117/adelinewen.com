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
// the inner rim, a few units in from the edge of the bulb: the binding round the soundboard
const RIM =
  "M200 85 C244 79 292 50 364 29.5 C425 13.5 486 11.5 531 18 C569 24.5 593 58 593 100 " +
  "C593 142 569 175.5 531 182 C486 188.5 425 186.5 364 170.5 C292 150 244 121 200 115";
// paulownia grain on the soundboard: the board is two halves glued down the middle, so the
// grain runs lengthwise and mirrors either side, opening a little toward the tail and
// wandering slightly, as straight-grained wood does
const GRAIN = Array.from({ length: 11 }, (_, k) => k)
  .flatMap((k) => {
    const o = 7 + k * 8.2 + ((k * 37) % 7) * 0.6;
    const j = (((k * 53) % 9) - 4) * 0.5;
    return [1, -1].map(
      (sgn) =>
        `M205 ${(100 + sgn * o * 0.42).toFixed(1)} C330 ${(100 + sgn * (o * 0.66 + j)).toFixed(1)} 470 ${(100 + sgn * (o * 0.86 - j)).toFixed(1)} 600 ${(100 + sgn * o * 0.98).toFixed(1)}`,
    );
  })
  .join("");
// the hardwood frame seen from the front: the neck, and the sides showing round the
// soundboard, whose upper end comes to a rounded point at the neck
const SOUNDBOARD = `${RIM} C192 112 190 88 200 85 Z`;
// the head: a pegbox, then a ruyi cloud-head finial (three lobes, an incised line inside)
const HEAD = "M74 89 L31 92 C27 86 19 84.5 15.5 88 C13 90.5 14.5 93.5 11.5 94.5 C5.5 96 5.5 104 11.5 105.5 C14.5 106.5 13 109.5 15.5 112 C19 115.5 27 114 31 108 L74 111 Z";
const HEAD_LINE = "M28.5 94.5 C25.5 90.5 20.5 90 18.5 92.5 C17 94.5 18 97 15 98 C12.5 99 12.5 101 15 102 C18 103 17 105.5 18.5 107.5 C20.5 110 25.5 109.5 28.5 105.5";
// a turned peg, pointing up from its socket: tapered shaft, a collar, an oval knob
const PEG = "M-1.8 0 L-1.1 -16 M1.8 0 L1.1 -16 M-2.5 -16.6 H2.5 M-1.5 -17.6 C-3.5 -20 -3.3 -25.5 0 -27 C3.3 -25.5 3.5 -20 1.5 -17.6 Z";
const PEGS = [
  [63, 89.6, -26],
  [44, 90.6, -26],
  [63, 110.4, 206],
  [44, 109.4, 206],
];
// where each string runs on from the nut into the slot, to its peg
const TO_PEG = [63, 63, 44, 44];

export function PipaBody() {
  return (
    <>
      <defs>
        <radialGradient id="pipa-shade" cx="0.74" cy="0.5" r="0.62">
          <stop offset="0" className="ps0" />
          <stop offset="1" className="ps1" />
        </radialGradient>
        <clipPath id="pipa-board">
          <path d={SOUNDBOARD} />
        </clipPath>
      </defs>
      <path className="pipa-fill" d={SOUNDBOARD} fill="url(#pipa-shade)" />
      <path className="pipa-fill wood" d={`${BODY} Z ${SOUNDBOARD} ${HEAD}`} fillRule="evenodd" />
      <g className="pipa-body">
        {/* the head: pegbox and ruyi cloud-head, a bone band where they meet */}
        <path pathLength={1} d={HEAD} />
        <path pathLength={1} className="fine" d={`${HEAD_LINE}M33.5 91.9V108.1M36 91.8V108.2`} />
        {/* the string slot cut through the pegbox */}
        <path pathLength={1} className="fine" d="M70 96 L38 97.6 C34 98 34 102 38 102.4 L70 104" />
        {/* four turned pegs, two each side, swept back toward the head */}
        {PEGS.map(([x, y, r]) => (
          <path key={`${x}${y}`} pathLength={1} d={PEG} transform={`translate(${x} ${y}) rotate(${r})`} />
        ))}
        {/* the strings run on past the nut, into the slot, each to its peg */}
        <path
          pathLength={1}
          className="fine"
          d={STRINGS.map((s, i) => `M${NUT} ${s.y0} L${TO_PEG[i]} ${i < 2 ? 98.4 + i * 0.8 : 101.6 - (3 - i) * 0.8}`).join("")}
        />
        {/* the nut */}
        <path pathLength={1} d="M74 88.5V111.5" />
        <path pathLength={1} d={BODY} />
        <path pathLength={1} className="rim" d={SOUNDBOARD} />
        <g clipPath="url(#pipa-board)">
          <path pathLength={1} className="grain" d={GRAIN} />
        </g>
        <path pathLength={1} className="xiang" d={XIANG} />
        <path pathLength={1} className="frets" d={PIN} />
        {/* the fu shou, the carved tailpiece: a bar with cloud-scroll ends */}
        <path pathLength={1} d="M531 72 Q536 67.5 541 72 V128 Q536 132.5 531 128 Z" />
        <path pathLength={1} d="M536 69.5 C536 63.5 530 60.5 527 63.5 C525 65.5 527 68.5 529.5 67 M536 69.5 C536 63.5 542 60.5 545 63.5 C547 65.5 545 68.5 542.5 67 M536 130.5 C536 136.5 530 139.5 527 136.5 C525 134.5 527 131.5 529.5 133 M536 130.5 C536 136.5 542 139.5 545 136.5 C547 134.5 545 131.5 542.5 133" />
        {/* each string knotted over the bar, its tail left loose */}
        <path
          pathLength={1}
          className="fine"
          d={STRINGS.map((s) => `M538 ${s.y1} C547 ${s.y1} 551 ${s.y1 + 2} 549 ${s.y1 + 6}`).join("")}
        />
      </g>
    </>
  );
}
