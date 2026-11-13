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
// The body outline is computed, not hand-drawn, so it reads as one continuous teardrop:
// the tail is an elliptical arc (full and round, no flat sides), and from the neck to that
// arc the half-width swells along a power curve whose slope meets the arc's exactly, so
// there is no corner and no straight run anywhere. The inner binding is the same curve
// drawn a few units in.
const CX = 478; // centre of the tail's arc; the body is widest here, three quarters down
const RX = 120; // so the tail ends at x = 598
const RY = 90; // half the widest width
const X0 = 182; // where the neck ends and the swell begins
const HW0 = 14.5; // half-width of the neck there
const COS_T = -0.55; // where the swell hands over to the arc
const outline = (inset: number, steps = 90) => {
  const rx = RX - inset;
  const ry = RY - inset;
  const th = Math.acos(COS_T);
  const xt = CX + rx * COS_T;
  const ht = ry * Math.sin(th);
  const mt = (ry * -COS_T) / (rx * Math.sin(th)); // the arc's slope at the hand-over
  const x0 = X0 + inset * 3;
  const h0 = Math.max(4, HW0 - inset * 0.3);
  const n = (mt * (xt - x0)) / (ht - h0); // the power that makes the slopes meet
  const top: [number, number][] = [];
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    top.push([x0 + (xt - x0) * t, h0 + (ht - h0) * t ** n]);
  }
  for (let k = 1; k <= steps; k++) {
    const a = th - (th * k) / steps; // round the arc to its tip at angle 0
    top.push([CX + rx * Math.cos(a), ry * Math.sin(a)]);
  }
  const f = (v: number) => v.toFixed(2);
  const upper = top.map(([x, h]) => `${f(x)} ${f(100 - h)}`);
  const lower = [...top].reverse().slice(1).map(([x, h]) => `${f(x)} ${f(100 + h)}`);
  return { upper, lower, start: top[0] };
};
const B = outline(0);
// the neck runs from the nut and joins the swell
const BODY = `M74 89 C120 88.5 160 87.5 ${X0} ${100 - HW0} L${B.upper.join(" L")} L${B.lower.join(" L")} C160 112.5 120 111.5 74 111`;
const R = outline(4.5);
// the inner rim, round the bulb: the binding at the edge of the soundboard
const RIM = `M${R.upper.join(" L")} L${R.lower.join(" L")}`;
const [RX0, RH0] = R.start;
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
const SOUNDBOARD = `${RIM} C${RX0 - 8} ${100 + RH0 - 2} ${RX0 - 10} ${100 - RH0 + 2} ${RX0} ${100 - RH0} Z`;
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
// past the nut each string runs on into the slot, the four kept in order (no crossing),
// each stopping at its own peg in turn
const SLOT_END = [62, 56, 50, 44].map((x, i) => [x, 97.6 + i * 1.6]);

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
        <path pathLength={1} className="fine" d="M73 95 L41 97.2 C37 97.6 37 102.4 41 102.8 L73 105" />
        {/* four turned pegs, two each side, swept back toward the head */}
        {PEGS.map(([x, y, r]) => (
          <path key={`${x}${y}`} pathLength={1} d={PEG} transform={`translate(${x} ${y}) rotate(${r})`} />
        ))}
        {/* the strings run on past the nut, into the slot, each to its peg */}
        <path
          pathLength={1}
          className="fine"
          d={STRINGS.map((s, i) => `M${NUT} ${s.y0} L${SLOT_END[i][0]} ${SLOT_END[i][1].toFixed(1)}`).join("")}
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
