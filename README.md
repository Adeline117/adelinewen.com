# adelinewen.com

Personal portfolio website for Adeline Wen — CS @ University of Washington, decentralized computing research & crafted software.

## Status

🎨 **Design exploration phase.** Iterating on the visual direction before scaffolding the production Next.js app.

## Concept — "The Infinite Loop" (∞)

The site is built around the **infinity symbol**: the two loops represent **Research (思考)** and **Building (创造)**, joined at a single crossing point — *About* — that is Adeline herself. It also nods to decentralized systems (continuous, self-sustaining loops).

The ∞ doubles as the **navigation spine**: scrolling travels a glowing bead along the glass infinity, passing four stations — **Work → About (crossing) → Research → Contact** — and looping back to close.

See [`design-exploration/`](./design-exploration/) for live prototypes. Current direction: **`INF2-refined.html`** (real WebGL glass lemniscate, refined).

## Design system

- **Palette (Arena purple):** primary `#7C5CF0`→`#896AFB`, light `#EEEDFE`, dark `#534AB7`→`#3C3489`, neutral `#F1EFE8` / white. Cool + minimal.
- **Type:** Fraunces (display serif) + JetBrains Mono (labels/UI).
- **3D aesthetic:** refractive glass with subtle dispersion + restrained iridescence + bespoke purple-gradient environment + light bloom.

## Planned stack

Next.js (App Router) + TypeScript + Tailwind + Three.js / react-three-fiber + Framer Motion + Lenis. Deploy on Vercel; DNS on Cloudflare.
