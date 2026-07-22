```text
 ██████╗ ██████╗ ██████╗ ██╗████████╗██╗███╗   ███╗
██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝██║████╗ ████║
██║   ██║██████╔╝██████╔╝██║   ██║   ██║██╔████╔██║
██║   ██║██╔══██╗██╔══██╗██║   ██║   ██║██║╚██╔╝██║
╚██████╔╝██║  ██║██████╔╝██║   ██║   ██║██║ ╚═╝ ██║
 ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝   ╚═╝╚═╝     ╚═╝
```

### **The solar system where it actually is right now.**
### Real ephemeris, live orbital elements, NASA imagery — in a browser tab, with nothing behind it.

</div>

---

## ✦ What is Orbitim?

**Orbitim** is a real-time 3D solar system that runs entirely in the browser. Eighteen
bodies — the Sun, eight planets and nine major moons — are placed by orbital mechanics
rather than by hand, for the exact instant on the clock. Fly to any of them, scrub the
clock forward a decade, and the geometry you see is the geometry the sky will hold.

Around Earth, up to fourteen constellations of tracked objects are propagated from real
orbital elements at frame rate: space stations, Starlink, GPS, GLONASS, Galileo, BeiDou,
OneWeb, Iridium NEXT, geostationary, weather, science, Earth observation, the brightest
objects and Iridium 33 debris.

**No backend. No API keys. No accounts.** Static files, a fetch for orbital elements, and
your GPU.

> **Nothing on screen is simulated telemetry.** Where a value is undefined for a body,
> the panel says so instead of inventing one.

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| 🪐 **Real positions** | VSOP87 and the lunar theory via `astronomy-engine`; moons of Jupiter, Saturn, Mars and Neptune from parent-relative elements |
| 🛰️ **Live satellites** | CelesTrak element sets, SGP4-propagated in the browser each frame, 14 switchable groups with live object counts |
| 🕰️ **Scrubbable clock** | Pause, run at rate, or jump to any instant — every position, distance and phase angle follows |
| 🚀 **Cinematic flight** | Camera state machine: overview → flying → orbiting, with `Escape` as the way back out |
| 🏷️ **Collision-free labels** | Screen-space planet labels laid out in one pass, so the inner planets never stack into an unreadable pile |
| ☀️ **Living photosphere** | The Sun's surface is a GLSL shader: drifting granulation over the published map, plus a camera-facing corona sprite |
| 💍 **Physical rings** | Saturn's shadow cast across its own ring plane, sub-texture ringlet structure, and forward scattering when the Sun sits behind |
| 🌫️ **Atmospheres** | Limb shells only where a world actually has one — Venus opaque, Mars thin, the ice giants deep; Mercury and the moons get none |
| ✨ **Deep sky** | A dimmed Milky Way plate behind 9,000 deterministic point stars, coloured across the main sequence |
| 📊 **Live dossier** | Distance, light travel time, apparent magnitude, illuminated fraction — all computed at render time from the same ephemeris |
| 🖼️ **8K on approach** | 2K maps for everything visible, an 8K map only for the body you are flying to, released when you leave |
| 📐 **Honest geometry** | Distances are log-compressed to fit one screen; directions are never distorted, so conjunctions stay truthful |

---

## 🔭 What is real

| Shown | Source |
|-------|--------|
| Planet, moon and Sun positions | VSOP87 and the lunar theory, via [`astronomy-engine`](https://github.com/cosinekitty/astronomy) |
| Distances, light travel time, apparent magnitude, illuminated fraction | Computed from the same ephemeris at render time |
| Satellite positions | CelesTrak TLEs, SGP4-propagated in the browser each frame |
| Body constants (mass, gravity, day length, atmosphere) | [NASA Planetary Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) |
| Surface imagery | [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0, NASA-derived — see `public/textures/ATTRIBUTION.md` |

---

## 📏 Scale

True scale is unusable — at Neptune's real distance the Earth is far below one pixel.
Orbital radii are logarithmically compressed and body radii follow a gentler compression,
so Jupiter still dwarfs Mercury and the whole system reads on one screen. Directions are
never distorted: conjunctions and alignments are geometrically truthful.

```
auToScene(au)   →  ORBIT_BASE · au^(1-0.62) · (1 + 0.62·log₁₀(1+au))
radiusOf(km)    →  EARTH_SCENE_RADIUS · (km / R⊕)^0.45
```

All of it lives in one file: `src/lib/scale.ts`.

---

## 🛠️ Tech Stack

```
Language        →  TypeScript (strict) · GLSL
Rendering       →  three.js · React Three Fiber · @react-three/drei · @react-three/postprocessing
UI              →  React 19 · Tailwind CSS 4
State           →  zustand (flight state machine, satellite groups)
Astronomy       →  astronomy-engine (VSOP87, lunar theory, magnitudes, phase)
Orbits          →  satellite.js (SGP4/SDP4 from TLE)
Build           →  Vite 8 · oxlint
Data            →  CelesTrak element sets · NASA Planetary Fact Sheet · Solar System Scope textures
Backend         →  none
```

---

## 🏗️ Architecture

Flow is one-way: **ephemeris → scale → scene**. Astronomy code never returns three.js
types, so it can be verified without rendering anything.

```
┌──────────────────────────────────────────────────────────────────┐
│                        ORBITIM (browser only)                     │
│                                                                   │
│  ┌────────────────────┐   ┌────────────────┐   ┌───────────────┐  │
│  │ src/lib/ephemeris/ │   │ src/lib/scale  │   │ src/data/     │  │
│  │ bodies · positions │──▶│ log compression│   │ fact sheet    │  │
│  │ rotation           │   │ (single truth) │   │ per body      │  │
│  └────────────────────┘   └───────┬────────┘   └───────┬───────┘  │
│         no three.js, no React     │                    │          │
│                            ┌──────▼────────────────────▼───────┐  │
│                            │ src/scene/  React Three Fiber      │  │
│                            │ Body · Rings · Atmosphere · Sun    │  │
│                            │ Starfield · SatelliteLayer · Labels│  │
│                            └──────┬─────────────────────┬───────┘  │
│  ┌──────────────────┐      ┌──────▼──────┐       ┌──────▼───────┐ │
│  │ src/lib/textures │─────▶│ src/flight/ │◀─────▶│ src/ui/ DOM  │ │
│  │ 2K/8K LOD + free │      │ overview →  │       │ rail·dossier │ │
│  └──────────────────┘      │ flying →    │       │ clock·sats   │ │
│                            │ orbiting    │       └──────────────┘ │
│                            └─────────────┘                        │
└───────────────────────────────┬───────────────────────────────────┘
                                │ fetch, cached 2h in localStorage
                    ┌───────────▼────────────┐
                    │ CelesTrak element sets  │
                    │ (CDN mirror → direct)   │
                    └────────────────────────┘
```

---

## 🌐 Orbital element pipeline

Element sets are fetched per constellation, not all at once, and each step degrades to the
next with the reason recorded on the result:

| Step | Source | Notes |
|------|--------|-------|
| 1 | `localStorage` cache | Reused for 2 hours, so a reload costs no network |
| 2 | Satvisor CDN mirror of CelesTrak | Primary path; avoids CelesTrak rate limits |
| 3 | CelesTrak `gp.php` directly | Used when the mirror is unavailable; 403 is surfaced, not hidden |
| 4 | Embedded fallback set | ISS, Tiangong, HST, a GPS bird — so the layer is never empty |

Each result carries its own `source` (`live` · `cache` · `local_fallback` · `hardcoded_fallback`),
so the UI can always say where a position came from.

---

## 🚀 Running

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc -b && vite build
npm run preview
npm run lint      # oxlint
```

No environment variables, no `.env`, nothing to provision.

---

## ⚙️ Performance

| Concern | Approach |
|---------|----------|
| **Texture memory** | 2K everywhere, 8K only for the flight target, disposed on departure |
| **Bundle** | `three`, `astronomy-engine` and `satellite.js` split into their own vendor chunks — app rebuilds don't invalidate ~1.3 MB of cached script |
| **Star field** | One `Points` draw call for 9,000 stars, deterministic hash instead of `Math.random`, no per-frame allocation |
| **Satellites** | One points buffer per group, written in place each frame — a whole constellation is a single draw call; groups are opt-in and counted |
| **Frame loop** | Scratch vectors and quaternions allocated once per component, reused every frame |

---

## 📄 License

Code is [MIT](LICENSE). Surface imagery is CC BY 4.0 from Solar System Scope,
not covered by the MIT grant — see `public/textures/ATTRIBUTION.md`.

---

<div align="center">

Built with three.js · React Three Fiber · astronomy-engine · satellite.js

*Real positions, real elements, no backend. If Orbitim shows you something you didn't
expect to be true, drop the repo a ⭐*

</div>
