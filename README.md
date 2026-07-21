# Orbitim

A real-time 3D solar system in the browser. Every planet, its major moons, the ring
systems and thousands of live satellites — placed by real orbital mechanics, not by hand.

No backend, no API keys, no accounts.

## What is real

| Shown | Source |
|---|---|
| Planet, moon and Sun positions | VSOP87 and the lunar theory, via [`astronomy-engine`](https://github.com/cosinekitty/astronomy) |
| Distances, light travel time, apparent magnitude, illuminated fraction | Computed from the same ephemeris at render time |
| Satellite positions | CelesTrak TLEs, SGP4-propagated in the browser each frame |
| Body constants (mass, gravity, day length, atmosphere) | [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) |
| Surface imagery | [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0, NASA-derived — see `public/textures/ATTRIBUTION.md` |

Nothing on screen is simulated telemetry. Where a value is undefined for a body, the
panel says so rather than inventing one.

## Scale

True scale is unusable — at Neptune's real distance the Earth is far below one pixel.
Orbital radii are logarithmically compressed and body radii follow a gentler compression,
so Jupiter still dwarfs Mercury and the whole system reads on one screen. Directions are
never distorted: conjunctions and alignments are geometrically truthful. All of this lives
in `src/lib/scale.ts`.

## Architecture

Flow is one-way: **ephemeris → scale → scene**. Astronomy code never returns three.js types,
so it can be verified without rendering anything.

```
src/lib/ephemeris/   body registry, positions, rotation      (no three.js, no React)
src/lib/scale.ts     the single source of truth for distance
src/lib/textures/    level-of-detail loading and disposal
src/scene/           React Three Fiber components
src/flight/          camera state machine: overview | flying | orbiting
src/ui/              DOM only — landing, rail, dossier, clock
src/data/            fact sheet and active mission lists
```

Textures load lazily: a 2K map for every visible body, an 8K map only for the body you are
flying to, released when you leave it.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Stack

React 19, React Three Fiber, three.js, `@react-three/postprocessing`, astronomy-engine,
satellite.js, Tailwind CSS 4, Vite.
