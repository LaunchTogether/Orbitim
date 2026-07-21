import { HelioVector, GeoVector, Illumination, MakeTime, Body } from 'astronomy-engine';
import { getBodyRecord, type BodyId } from './bodies';

/** Right-handed ecliptic-of-J2000 vector, astronomical units. */
export interface EclipticVec {
  x: number;
  y: number;
  z: number;
}

export interface BodyState {
  id: BodyId;
  /** Position relative to the solar system barycentre (Sun at origin), AU. */
  heliocentric: EclipticVec;
  /** Position relative to Earth, AU. Zero-length for Earth itself. */
  geocentric: EclipticVec;
  /** Distance from Earth, AU. */
  distanceFromEarthAU: number;
  /** Distance from the Sun, AU. */
  distanceFromSunAU: number;
  /** Apparent visual magnitude as seen from Earth, or null when undefined for the body. */
  magnitude: number | null;
  /** Illuminated fraction of the disc, 0..1, or null when undefined. */
  phaseFraction: number | null;
}

const AU_KM = 149597870.7;
const LIGHT_SECONDS_PER_AU = 499.004784;

function length(v: EclipticVec): number {
  return Math.hypot(v.x, v.y, v.z);
}

/**
 * Heliocentric position of a moon, derived from its parent plus a circular
 * parent-relative model. astronomy-engine only ships full theories for the Moon
 * and the Galilean satellites; the remaining moons use their mean orbital
 * elements, which is accurate enough at the scene scales used here.
 */
function moonHeliocentric(id: BodyId, date: Date): EclipticVec {
  const record = getBodyRecord(id);
  if (!record.parent) throw new Error(`Body ${id} declared as moon without a parent`);
  const parent = getHeliocentric(getBodyRecord(record.parent).id, date);

  if (record.engineBody) {
    const geo = GeoVector(record.engineBody, MakeTime(date), true);
    const earth = HelioVector(Body.Earth, MakeTime(date));
    return { x: earth.x + geo.x, y: earth.y + geo.y, z: earth.z + geo.z };
  }

  const orbitDays = record.orbitDays!;
  const radiusAU = record.orbitRadiusKm! / AU_KM;
  const inclination = (record.orbitInclinationDeg! * Math.PI) / 180;
  const angle = (date.getTime() / 86400000 / orbitDays) * 2 * Math.PI;

  const x = radiusAU * Math.cos(angle);
  const yFlat = radiusAU * Math.sin(angle);
  return {
    x: parent.x + x,
    y: parent.y + yFlat * Math.cos(inclination),
    z: parent.z + yFlat * Math.sin(inclination)
  };
}

function heliocentricOf(id: BodyId, date: Date): EclipticVec {
  const record = getBodyRecord(id);
  if (record.id === 'sun') return { x: 0, y: 0, z: 0 };
  if (record.kind === 'moon') return moonHeliocentric(id, date);
  if (!record.engineBody) throw new Error(`Body ${id} has no ephemeris source`);
  const v = HelioVector(record.engineBody, MakeTime(date));
  return { x: v.x, y: v.y, z: v.z };
}

/**
 * Single-instant memo. The scene asks for the same instant many times per frame
 * — once per body, plus once more per moon for its parent — and a VSOP87
 * evaluation is far too expensive to repeat for an answer already computed.
 */
const positionCache = new Map<BodyId, { ms: number; value: EclipticVec }>();

/**
 * Heliocentric position only, without the illumination and geometry work
 * {@link getBodyState} does. This is the per-frame path: the scene needs
 * eighteen positions every frame and none of the derived readouts.
 */
export function getHeliocentric(id: BodyId, date: Date): EclipticVec {
  const ms = date.getTime();
  const cached = positionCache.get(id);
  if (cached && cached.ms === ms) return cached.value;
  const value = heliocentricOf(id, date);
  positionCache.set(id, { ms, value });
  return value;
}

/** Sole astronomy entry point for the scene. Never returns three.js types. */
export function getBodyState(id: BodyId, date: Date): BodyState {
  const heliocentric = getHeliocentric(id, date);
  const earth = getHeliocentric('earth', date);
  const geocentric = {
    x: heliocentric.x - earth.x,
    y: heliocentric.y - earth.y,
    z: heliocentric.z - earth.z
  };

  let magnitude: number | null = null;
  let phaseFraction: number | null = null;
  const record = getBodyRecord(id);
  if (record.engineBody && record.id !== 'earth') {
    try {
      const info = Illumination(record.engineBody, MakeTime(date));
      magnitude = info.mag;
      phaseFraction = info.phase_fraction;
    } catch {
      // Illumination is undefined for some bodies; leave the fields null rather
      // than inventing a value.
      magnitude = null;
      phaseFraction = null;
    }
  }

  return {
    id,
    heliocentric,
    geocentric,
    distanceFromEarthAU: length(geocentric),
    distanceFromSunAU: length(heliocentric),
    magnitude,
    phaseFraction
  };
}

export function auToKm(au: number): number {
  return au * AU_KM;
}

export function auToLightMinutes(au: number): number {
  return (au * LIGHT_SECONDS_PER_AU) / 60;
}
