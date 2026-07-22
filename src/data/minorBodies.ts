import { elementsAtEpoch, type OrbitalElements } from '../lib/ephemeris/cometOrbit';

/**
 * Named minor planets — the dwarf planets and the largest asteroids — carried
 * by their real J2000 osculating orbital elements from the JPL Small-Body
 * Database (https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html).
 *
 * These are unperturbed two-body positions from mean elements, the same
 * approximation the scene already uses for the outer moons: accurate to well
 * under a scene pixel here, and drifting slowly from the true path over many
 * revolutions. The marker size is symbolic, like the satellite points — a real
 * Ceres at true scale would be far below a pixel from any neighbouring world.
 * The element-based pipeline is checked against astronomy-engine's own Pluto,
 * which it reproduces to within a twentieth of a degree.
 */
export type MinorBodyClass = 'dwarf-planet' | 'asteroid' | 'near-earth';

/** Julian date to epoch milliseconds, for elements not referred to J2000. */
const jdToMs = (jd: number): number => (jd - 2440587.5) * 86400000;

export interface MinorBody {
  id: string;
  name: string;
  designation: string;
  klass: MinorBodyClass;
  /** Mean diameter, kilometres. */
  diameterKm: number;
  note: string;
  elements: OrbitalElements;
}

export const MINOR_BODIES: readonly MinorBody[] = [
  {
    id: 'vesta',
    name: 'Vesta',
    designation: '4 Vesta',
    klass: 'asteroid',
    diameterKm: 525,
    note: 'The brightest asteroid, occasionally naked-eye; visited by Dawn in 2011.',
    elements: elementsAtEpoch({
      semiMajorAU: 2.3617, eccentricity: 0.0887, inclinationDeg: 7.140,
      ascendingNodeDeg: 103.851, argPerihelionDeg: 150.728, meanAnomalyDeg: 250.09
    })
  },
  {
    id: 'pallas',
    name: 'Pallas',
    designation: '2 Pallas',
    klass: 'asteroid',
    diameterKm: 512,
    note: 'A steeply inclined orbit tilts it 35° out of the plane of the belt.',
    elements: elementsAtEpoch({
      semiMajorAU: 2.7725, eccentricity: 0.2302, inclinationDeg: 34.832,
      ascendingNodeDeg: 173.024, argPerihelionDeg: 310.457, meanAnomalyDeg: 59.60
    })
  },
  {
    id: 'hygiea',
    name: 'Hygiea',
    designation: '10 Hygiea',
    klass: 'asteroid',
    diameterKm: 434,
    note: 'The fourth-largest asteroid, and round enough to be a dwarf-planet candidate.',
    elements: elementsAtEpoch({
      semiMajorAU: 3.1415, eccentricity: 0.1125, inclinationDeg: 3.842,
      ascendingNodeDeg: 283.413, argPerihelionDeg: 312.316, meanAnomalyDeg: 152.18
    })
  },
  {
    id: 'juno',
    name: 'Juno',
    designation: '3 Juno',
    klass: 'asteroid',
    diameterKm: 247,
    note: 'One of the first four asteroids found, in 1804.',
    elements: elementsAtEpoch({
      semiMajorAU: 2.6685, eccentricity: 0.2579, inclinationDeg: 12.989,
      ascendingNodeDeg: 169.853, argPerihelionDeg: 248.138, meanAnomalyDeg: 32.36
    })
  },
  {
    id: 'eris',
    name: 'Eris',
    designation: '136199 Eris',
    klass: 'dwarf-planet',
    diameterKm: 2326,
    note: 'As massive as Pluto but far more distant; its discovery unseated Pluto as a planet.',
    elements: elementsAtEpoch({
      semiMajorAU: 67.78, eccentricity: 0.4407, inclinationDeg: 44.187,
      ascendingNodeDeg: 35.951, argPerihelionDeg: 151.639, meanAnomalyDeg: 204.16
    })
  },
  {
    id: 'makemake',
    name: 'Makemake',
    designation: '136472 Makemake',
    klass: 'dwarf-planet',
    diameterKm: 1430,
    note: 'A bright Kuiper-belt dwarf planet with one known small moon.',
    elements: elementsAtEpoch({
      semiMajorAU: 45.79, eccentricity: 0.161, inclinationDeg: 28.98,
      ascendingNodeDeg: 79.62, argPerihelionDeg: 294.83, meanAnomalyDeg: 153.72
    })
  },
  {
    id: 'haumea',
    name: 'Haumea',
    designation: '136108 Haumea',
    klass: 'dwarf-planet',
    diameterKm: 1560,
    note: 'Spun into an ellipsoid by a four-hour day, and ringed — the first such trans-Neptunian.',
    elements: elementsAtEpoch({
      semiMajorAU: 43.13, eccentricity: 0.191, inclinationDeg: 28.21,
      ascendingNodeDeg: 121.79, argPerihelionDeg: 239.18, meanAnomalyDeg: 217.77
    })
  },

  // Near-Earth asteroids — the population behind the CNEOS close-approach feed.
  // Real osculating elements from the JPL Small-Body Database, at their own
  // recent epoch (Bennu's is older but its orbit is stable), so each sits on its
  // true path as it crosses Earth's neighbourhood.
  {
    id: 'apophis',
    name: 'Apophis',
    designation: '99942 Apophis',
    klass: 'near-earth',
    diameterKm: 0.34,
    note: 'Passes inside the ring of geostationary satellites on 13 April 2029.',
    elements: elementsAtEpoch({
      semiMajorAU: 0.9223592206975018, eccentricity: 0.1911492279663492, inclinationDeg: 3.340996879880978,
      ascendingNodeDeg: 203.8936514240762, argPerihelionDeg: 126.6795706895841, meanAnomalyDeg: 175.3304026592739,
      epochMs: jdToMs(2461200.5)
    })
  },
  {
    id: 'bennu',
    name: 'Bennu',
    designation: '101955 Bennu',
    klass: 'near-earth',
    diameterKm: 0.49,
    note: 'OSIRIS-REx returned a sample of it to Earth in 2023.',
    elements: elementsAtEpoch({
      semiMajorAU: 1.126391025894812, eccentricity: 0.2037450762416414, inclinationDeg: 6.03494377024794,
      ascendingNodeDeg: 2.06086619569642, argPerihelionDeg: 66.22306084084298, meanAnomalyDeg: 101.703952002457,
      epochMs: jdToMs(2455562.5)
    })
  },
  {
    id: 'eros',
    name: 'Eros',
    designation: '433 Eros',
    klass: 'near-earth',
    diameterKm: 16.8,
    note: 'The first asteroid orbited and landed on, by NEAR Shoemaker in 2000–01.',
    elements: elementsAtEpoch({
      semiMajorAU: 1.458243716760167, eccentricity: 0.2228779627700761, inclinationDeg: 10.82854410314273,
      ascendingNodeDeg: 304.2679713350896, argPerihelionDeg: 178.9181319135911, meanAnomalyDeg: 62.51145501986792,
      epochMs: jdToMs(2461200.5)
    })
  },
  {
    id: 'phaethon',
    name: 'Phaethon',
    designation: '3200 Phaethon',
    klass: 'near-earth',
    diameterKm: 5.8,
    note: 'Sheds the dust that becomes the Geminid meteor shower; skims closer to the Sun than Mercury.',
    elements: elementsAtEpoch({
      semiMajorAU: 1.271464620920411, eccentricity: 0.8896722843692159, inclinationDeg: 22.31052728047163,
      ascendingNodeDeg: 265.0988060455101, argPerihelionDeg: 322.300168483426, meanAnomalyDeg: 301.4858235833354,
      epochMs: jdToMs(2461200.5)
    })
  },
  {
    id: 'ryugu',
    name: 'Ryugu',
    designation: '162173 Ryugu',
    klass: 'near-earth',
    diameterKm: 0.9,
    note: 'Hayabusa2 collected a subsurface sample and returned it in 2020.',
    elements: elementsAtEpoch({
      semiMajorAU: 1.190918932477906, eccentricity: 0.1910730049967184, inclinationDeg: 5.866442495106322,
      ascendingNodeDeg: 251.2897124408818, argPerihelionDeg: 211.6089939475371, meanAnomalyDeg: 62.34067433781601,
      epochMs: jdToMs(2461200.5)
    })
  },
  {
    id: 'didymos',
    name: 'Didymos',
    designation: '65803 Didymos',
    klass: 'near-earth',
    diameterKm: 0.78,
    note: 'DART struck its moonlet Dimorphos in 2022 — the first test of planetary defence.',
    elements: elementsAtEpoch({
      semiMajorAU: 1.642709608529702, eccentricity: 0.3831233242624545, inclinationDeg: 3.413876519313629,
      ascendingNodeDeg: 72.9858236207145, argPerihelionDeg: 319.5807001349104, meanAnomalyDeg: 260.8612886320632,
      epochMs: jdToMs(2461200.5)
    })
  }
];
