import type { OrbitalElements } from '../lib/ephemeris/cometOrbit';

/**
 * Comets carried by their real osculating orbital elements.
 *
 * Elements are the J2000 heliocentric-ecliptic set from the JPL Small-Body
 * Database (https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html); the perihelion
 * epoch is the time of perihelion passage for the apparition the elements were
 * fitted to. Nothing here is synthetic — the coma and tail are effect sprites,
 * but the path the nucleus rides is the object's published orbit.
 */
export interface Comet {
  id: string;
  /** Formal designation, e.g. 1P/Halley. */
  designation: string;
  /** Common name shown as the label. */
  name: string;
  elements: OrbitalElements;
  /** One-line note for the dossier. */
  note: string;
  /** Human-readable orbital period, for the readout. */
  period: string;
}

/** Perihelion passage time as epoch milliseconds. */
function perihelion(iso: string): number {
  return new Date(iso).getTime();
}

export const COMETS: readonly Comet[] = [
  {
    id: 'halley',
    designation: '1P/Halley',
    name: 'Halley',
    note: 'The first comet shown to return; last at perihelion in 1986, next in 2061.',
    period: '75.3 years',
    elements: {
      perihelionAU: 0.586,
      eccentricity: 0.96714,
      inclinationDeg: 162.262,
      ascendingNodeDeg: 58.42,
      argPerihelionDeg: 111.332,
      perihelionEpochMs: perihelion('1986-02-09T11:00:00Z')
    }
  },
  {
    id: 'encke',
    designation: '2P/Encke',
    name: 'Encke',
    note: 'The shortest orbit of any known comet — a lap of the inner system every 3.3 years.',
    period: '3.30 years',
    elements: {
      perihelionAU: 0.3360,
      eccentricity: 0.84833,
      inclinationDeg: 11.781,
      ascendingNodeDeg: 334.568,
      argPerihelionDeg: 186.547,
      perihelionEpochMs: perihelion('2023-10-22T00:00:00Z')
    }
  },
  {
    id: 'churyumov',
    designation: '67P/Churyumov–Gerasimenko',
    name: '67P',
    note: 'Rosetta orbited it and Philae landed on it in 2014 — the first landing on a comet.',
    period: '6.44 years',
    elements: {
      perihelionAU: 1.2432,
      eccentricity: 0.64102,
      inclinationDeg: 7.0405,
      ascendingNodeDeg: 50.147,
      argPerihelionDeg: 12.780,
      perihelionEpochMs: perihelion('2021-11-02T00:00:00Z')
    }
  },
  {
    id: 'hale-bopp',
    designation: 'C/1995 O1 (Hale–Bopp)',
    name: 'Hale–Bopp',
    note: 'Naked-eye for a record eighteen months in 1996–97; not due back for over two millennia.',
    period: '~2 530 years',
    elements: {
      perihelionAU: 0.914,
      eccentricity: 0.995086,
      inclinationDeg: 89.43,
      ascendingNodeDeg: 282.47,
      argPerihelionDeg: 130.59,
      perihelionEpochMs: perihelion('1997-04-01T03:00:00Z')
    }
  },
  {
    id: 'neowise',
    designation: 'C/2020 F3 (NEOWISE)',
    name: 'NEOWISE',
    note: 'The brightest northern comet since Hale–Bopp, a naked-eye object in July 2020.',
    period: '~6 800 years',
    elements: {
      perihelionAU: 0.29478,
      eccentricity: 0.99918,
      inclinationDeg: 128.937,
      ascendingNodeDeg: 61.01,
      argPerihelionDeg: 37.28,
      perihelionEpochMs: perihelion('2020-07-03T16:00:00Z')
    }
  }
];
