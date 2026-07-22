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
export type MinorBodyClass = 'dwarf-planet' | 'asteroid';

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
    id: 'ceres',
    name: 'Ceres',
    designation: '1 Ceres',
    klass: 'dwarf-planet',
    diameterKm: 939,
    note: 'The largest body in the asteroid belt and the only dwarf planet inside Neptune.',
    elements: elementsAtEpoch({
      semiMajorAU: 2.7658, eccentricity: 0.0785, inclinationDeg: 10.593,
      ascendingNodeDeg: 80.393, argPerihelionDeg: 73.597, meanAnomalyDeg: 287.42
    })
  },
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
    id: 'pluto',
    name: 'Pluto',
    designation: '134340 Pluto',
    klass: 'dwarf-planet',
    diameterKm: 2377,
    note: 'The largest known Kuiper-belt object; New Horizons flew past in 2015.',
    elements: elementsAtEpoch({
      semiMajorAU: 39.482, eccentricity: 0.2488, inclinationDeg: 17.16,
      ascendingNodeDeg: 110.299, argPerihelionDeg: 113.834, meanAnomalyDeg: 14.80
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
  }
];
