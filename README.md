# Keeler Family Dental website

Redesign of keelerdental.org: Next.js (App Router), TypeScript, Tailwind CSS, React Three Fiber, GSAP + ScrollTrigger, Lenis and Framer Motion.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

Requires Node.js 18.18 or newer (20+ recommended).

## Deploy

Import the folder into Vercel as a Next.js project (root directory = this folder, default build settings). All pages are static.

## Reports

- `CONTENT-INVENTORY.md`: every piece of original content, page by page.
- `ASSET-INVENTORY.md`: every original image and where it is used now.
- `CONTENT-PRESERVATION-REPORT.md`: where each original section lives, intentional changes and open items for the client.

## Homepage 3D story

- `src/components/three/ToothScene.tsx`: one fixed WebGL stage (React Three Fiber). Procedural tooth with enamel, dentin, pulp and roots; fresnel rim lighting; scroll-driven 360° turn, cutaway and exploded anatomy with hoverable labels; a different state for each featured service (whitening light sweep, implant swap, cosmetic sparkle, family trio, emergency pulse); a jaw section where the implant post, abutment and crown come together.
- `src/components/home/HomeStory.tsx`: section order and the scroll-to-3D wiring (`src/components/three/store.ts`). The WebGL stage loads after the hero has played or on first scroll.
- Add `?qa` to the URL to skip easing (used by the screenshot tests).

## Hero animation (tooth family)

- Component: `src/components/home/HeroToothFamily.tsx`; layer positions: `src/components/home/toothFamily.data.ts`; images: `public/assets/hero/`.
- The illustration is flat, so it is animated as separate layers: entrance, floating, blinking, smile, child bounce, parents leaning in, pointer parallax and eye follow, and a scroll hand-off to the 3D trio in the next scene.
- Glow, heart arc, orbit ring, sparkles, reflections and shadows are drawn in code (CSS, SVG, canvas). The sparkle loop pauses when the hero is off screen.
- `prefers-reduced-motion` shows a still, fully composed frame.
- To recut the layers from a new version of the illustration, run `scripts/hero-layers/gen.py` (needs Python with OpenCV and rembg; update the paths at the top of the script).
