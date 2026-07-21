import { Body } from 'astronomy-engine';

export type BodyId =
  | 'sun' | 'mercury' | 'venus' | 'earth' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  | 'moon' | 'io' | 'europa' | 'ganymede' | 'callisto'
  | 'titan' | 'phobos' | 'deimos' | 'triton';

export type BodyKind = 'star' | 'planet' | 'moon';

export interface BodyRecord {
  id: BodyId;
  name: string;
  kind: BodyKind;
  /** astronomy-engine body, null for satellites handled by parent-relative models */
  engineBody: Body | null;
  /** parent body for moons */
  parent?: BodyId;
  /** equatorial radius, km */
  radiusKm: number;
  /** obliquity of the rotation axis to its orbital plane, degrees */
  axialTiltDeg: number;
  /** sidereal rotation period, hours. Negative means retrograde. */
  rotationHours: number;
  /** mean orbital radius around the parent, km (moons only) */
  orbitRadiusKm?: number;
  /** sidereal orbital period around the parent, days (moons only) */
  orbitDays?: number;
  /** orbital inclination to the parent equator, degrees (moons only) */
  orbitInclinationDeg?: number;
  /** ring system inner/outer radius in body radii */
  rings?: { innerRadii: number; outerRadii: number };
  /** UI accent colour */
  color: string;
}

const RECORDS: BodyRecord[] = [
  { id: 'sun', name: 'Sun', kind: 'star', engineBody: Body.Sun, radiusKm: 695700, axialTiltDeg: 7.25, rotationHours: 609.12, color: '#ffd27a' },
  { id: 'mercury', name: 'Mercury', kind: 'planet', engineBody: Body.Mercury, radiusKm: 2439.7, axialTiltDeg: 0.034, rotationHours: 1407.6, color: '#a8a29e' },
  { id: 'venus', name: 'Venus', kind: 'planet', engineBody: Body.Venus, radiusKm: 6051.8, axialTiltDeg: 177.36, rotationHours: -5832.5, color: '#e7c68a' },
  { id: 'earth', name: 'Earth', kind: 'planet', engineBody: Body.Earth, radiusKm: 6378.1, axialTiltDeg: 23.44, rotationHours: 23.9345, color: '#6fb3e0' },
  { id: 'mars', name: 'Mars', kind: 'planet', engineBody: Body.Mars, radiusKm: 3396.2, axialTiltDeg: 25.19, rotationHours: 24.6229, color: '#d1603d' },
  { id: 'jupiter', name: 'Jupiter', kind: 'planet', engineBody: Body.Jupiter, radiusKm: 71492, axialTiltDeg: 3.13, rotationHours: 9.925, color: '#d9a066' },
  { id: 'saturn', name: 'Saturn', kind: 'planet', engineBody: Body.Saturn, radiusKm: 60268, axialTiltDeg: 26.73, rotationHours: 10.656, rings: { innerRadii: 1.24, outerRadii: 2.27 }, color: '#e3d1a0' },
  { id: 'uranus', name: 'Uranus', kind: 'planet', engineBody: Body.Uranus, radiusKm: 25559, axialTiltDeg: 97.77, rotationHours: -17.24, rings: { innerRadii: 1.64, outerRadii: 2.0 }, color: '#9fd8e0' },
  { id: 'neptune', name: 'Neptune', kind: 'planet', engineBody: Body.Neptune, radiusKm: 24764, axialTiltDeg: 28.32, rotationHours: 16.11, color: '#5b7fe0' },

  { id: 'moon', name: 'Moon', kind: 'moon', engineBody: Body.Moon, parent: 'earth', radiusKm: 1737.4, axialTiltDeg: 6.68, rotationHours: 655.72, orbitRadiusKm: 384400, orbitDays: 27.3217, orbitInclinationDeg: 5.145, color: '#cfcfcf' },

  { id: 'io', name: 'Io', kind: 'moon', engineBody: null, parent: 'jupiter', radiusKm: 1821.6, axialTiltDeg: 0, rotationHours: 42.46, orbitRadiusKm: 421700, orbitDays: 1.769, orbitInclinationDeg: 0.05, color: '#e8d16a' },
  { id: 'europa', name: 'Europa', kind: 'moon', engineBody: null, parent: 'jupiter', radiusKm: 1560.8, axialTiltDeg: 0, rotationHours: 85.22, orbitRadiusKm: 671100, orbitDays: 3.551, orbitInclinationDeg: 0.47, color: '#d8cbb0' },
  { id: 'ganymede', name: 'Ganymede', kind: 'moon', engineBody: null, parent: 'jupiter', radiusKm: 2634.1, axialTiltDeg: 0, rotationHours: 171.7, orbitRadiusKm: 1070400, orbitDays: 7.155, orbitInclinationDeg: 0.2, color: '#a89f92' },
  { id: 'callisto', name: 'Callisto', kind: 'moon', engineBody: null, parent: 'jupiter', radiusKm: 2410.3, axialTiltDeg: 0, rotationHours: 400.5, orbitRadiusKm: 1882700, orbitDays: 16.689, orbitInclinationDeg: 0.19, color: '#7a6f63' },
  { id: 'titan', name: 'Titan', kind: 'moon', engineBody: null, parent: 'saturn', radiusKm: 2574.7, axialTiltDeg: 0, rotationHours: 382.7, orbitRadiusKm: 1221870, orbitDays: 15.945, orbitInclinationDeg: 0.33, color: '#e0a95c' },
  { id: 'phobos', name: 'Phobos', kind: 'moon', engineBody: null, parent: 'mars', radiusKm: 11.27, axialTiltDeg: 0, rotationHours: 7.65, orbitRadiusKm: 9376, orbitDays: 0.3189, orbitInclinationDeg: 1.08, color: '#8a7f74' },
  { id: 'deimos', name: 'Deimos', kind: 'moon', engineBody: null, parent: 'mars', radiusKm: 6.2, axialTiltDeg: 0, rotationHours: 30.31, orbitRadiusKm: 23463, orbitDays: 1.2624, orbitInclinationDeg: 1.79, color: '#9a8f84' },
  { id: 'triton', name: 'Triton', kind: 'moon', engineBody: null, parent: 'neptune', radiusKm: 1353.4, axialTiltDeg: 0, rotationHours: -141.0, orbitRadiusKm: 354759, orbitDays: -5.877, orbitInclinationDeg: 156.9, color: '#c9d6d6' }
];

const BY_ID = new Map<BodyId, BodyRecord>(RECORDS.map((r) => [r.id, r]));

export const ALL_BODIES: readonly BodyRecord[] = RECORDS;
export const PLANETS: readonly BodyRecord[] = RECORDS.filter((r) => r.kind === 'planet');

export function getBodyRecord(id: BodyId): BodyRecord {
  const record = BY_ID.get(id);
  if (!record) throw new Error(`Unknown body id: ${id}`);
  return record;
}

export function getMoonsOf(id: BodyId): readonly BodyRecord[] {
  return RECORDS.filter((r) => r.parent === id);
}
