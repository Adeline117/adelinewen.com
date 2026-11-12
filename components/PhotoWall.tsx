import { WALL } from "./wall";

// Rows of small photos drifting, neighbours in opposite directions: the sheer amount of
// it, not any one picture. Pure CSS (each row is the list twice, translated by
// half its width); each photo is a .plate like every other photo on the site.
// A row stops under the pointer; reduced motion gets plain scrollable rows.
export default function PhotoWall({ label }: { label: string }) {
  return (
    <div className="wall" role="group" aria-label={label}>
      {WALL.map((row, r) => (
        <div className={`wall-row${r % 2 ? " rev" : ""}`} key={r}>
          <ul className="wall-track">
            {[0, 1].map((copy) =>
              row.map(([n, w]) => {
                const f = `/photos/stage/wall/${String(n).padStart(2, "0")}`;
                return (
                  <li key={`${copy}-${n}`} aria-hidden={copy === 1 || undefined}>
                    <span className="plate">
                      <picture>
                        <source type="image/avif" srcSet={`${f}-240.avif 1x, ${f}-480.avif 2x`} />
                        <img src={`${f}-240.webp`} srcSet={`${f}-240.webp 1x, ${f}-480.webp 2x`} width={w} height={240} alt="" loading="lazy" decoding="async" />
                      </picture>
                    </span>
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
