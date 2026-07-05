# Mueed City Portfolio — Phase 5.3 Building-Level Parking

An interactive portfolio where visitors drive through a cinematic virtual city instead of scrolling.

## Phase 5.3 focused upgrade

- Added a **separate parking bay for every named building** in the city.
- Each building parking bay now unlocks that building's own details: project, role, life chapter, research direction, leadership work, or future plan.
- Kept puzzle parking bays beside selected roads.
- Parking labels are now less cluttered: nearby parking bays reveal readable names, distant bays stay subtle.
- Project buildings like Errum, Deshio, ABCD Braille Trainer, Digital Shelf, and The Positive One now have specific parking cards instead of only one generic parking area per district.

## Previous upgrades retained

- Realistic night city map with wider roads, stretched districts, buildings, parks, harbor, minimap, guided drive, and mobile controls.
- Project details appear through intentional parking interactions, while broad story panels remain embedded inside the city.
- Puzzle bays ask small workflow/HCI/supply-chain questions and show feedback.
- Car speed remains tuned for controlled parking.

## Run locally

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Controls

- Arrow keys / WASD: drive
- Slow down and stop inside a glowing parking bay to unlock that building's card
- T: guided drive
- C: toggle cinematic / wide camera
- Mobile: on-screen controls

## Main files

- `components/CityDrive.tsx` — city engine, roads, buildings, cars, all building parking zones, puzzle zones, and driving controls
- `data/profile.ts` — profile, project, and checkpoint/story data
- `components/ClassicPortfolio.tsx` — normal quick portfolio section

## Build check

Production build passed with:

```bash
npm run build
```
