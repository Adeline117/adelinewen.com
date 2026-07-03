// A guilloché ∞ — the fine interlaced linework of banknotes/passports, drawn
// from a modulated Bernoulli lemniscate. Pure inline SVG: crisp hairlines
// (non-scaling-stroke), vector-light, deterministic (SSR-safe), no deps.
// Used as a faint, premium background watermark behind the cover type.

const CX = 500;
const CY = 280;
const A = 360; // lemniscate scale
const N = 520; // samples per curve
const LAYERS = 6; // interlaced phase-shifted copies → the guilloché moiré
const FREQ = 28; // modulation teeth
const AMP = 13; // modulation depth

function lemni(t: number): [number, number] {
  const d = 1 + Math.sin(t) * Math.sin(t);
  return [CX + (A * Math.cos(t)) / d, CY + (A * Math.sin(t) * Math.cos(t)) / d];
}

function buildPath(phase: number, ampVar: number): string {
  let out = "";
  for (let s = 0; s <= N; s++) {
    const t = (s / N) * Math.PI * 2;
    const [x, y] = lemni(t);
    const [x2, y2] = lemni(t + 0.001);
    // unit normal (perpendicular to the tangent) to offset along
    let nx = -(y2 - y);
    let ny = x2 - x;
    const len = Math.hypot(nx, ny) || 1;
    nx /= len;
    ny /= len;
    const m = ampVar * Math.sin(FREQ * t + phase);
    const px = (x + nx * m).toFixed(1);
    const py = (y + ny * m).toFixed(1);
    out += (s === 0 ? "M" : "L") + px + " " + py;
  }
  return out + "Z";
}

export default function Guilloche() {
  const paths = Array.from({ length: LAYERS }, (_, i) =>
    buildPath((i / LAYERS) * Math.PI * 2, AMP * (1 + 0.16 * Math.sin(i * 1.7)))
  );
  return (
    <svg className="guilloche-svg" viewBox="0 0 1000 560" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
