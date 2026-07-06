# Mueed City Portfolio — Phase 6.7 Fixed Start + Real Left Lane

A cinematic 3D portfolio city built with Next.js, React Three Fiber, Drei, and Three.js.

## Phase 6.7 fixes

This update directly fixes the broken starting scene from Phase 6.6.

- Removed the giant start/finish board that was blocking the camera at launch.
- Rebuilt the start gate as a small overhead roadside arch, so it no longer covers the car view.
- Changed the lap to a clear clockwise left-lane route:
  - start on the top road
  - drive forward/east
  - car begins in the actual left lane
  - buildings and parking bays sit on the driver’s left side
- Fixed mirrored sign text by making story labels camera-facing instead of backside-facing 3D HTML.
- Repositioned buildings, parking zones, story signs, and puzzle bays around the outside-left shoulder of the loop.
- Moved the start point away from parking bays so no story popup opens immediately.
- Adjusted the driver camera higher/farther back so the start view is clean and readable.
- Kept the full cycle map: the route still starts and ends near Origin Gate.

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Important files

```text
components/MueedCity3D.tsx   # main 3D city experience
components/ClassicPortfolio.tsx
components/TopNav.tsx
data/profile.ts
```

## Controls

- `W` / `ArrowUp`: accelerate
- `S` / `ArrowDown`: reverse / brake
- `A` / `ArrowLeft`: steer left
- `D` / `ArrowRight`: steer right
- Stop inside a glowing parking bay to unlock a story.
