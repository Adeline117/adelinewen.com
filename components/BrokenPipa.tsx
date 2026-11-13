import { BRIDGE, H, NUT, PipaBody, STRINGS, W } from "./pipa";

// The 404 mark: the pipa from About › Off the clock with its top string snapped. The two
// loose ends hang under their own weight and sway when the pointer passes over.
export default function BrokenPipa() {
  return (
    <svg className="broken" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <PipaBody />
      {STRINGS.slice(1).map((s) => (
        <path key={s.f} className="str" style={{ strokeWidth: s.w }} d={`M${NUT} ${s.y0}L${BRIDGE} ${s.y1}`} />
      ))}
      <path className="str snap snap-nut" style={{ strokeWidth: STRINGS[0].w }} d="M74 94 C122 93 150 97 165 112 C175 123 174 139 167 147" />
      <path className="str snap snap-bridge" style={{ strokeWidth: STRINGS[0].w }} d="M536 81 C472 84 432 104 419 131 C411 150 419 166 431 171" />
    </svg>
  );
}
