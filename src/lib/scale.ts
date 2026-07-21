/**
 * Logarithmic hybrid scale — the single source of truth for every distance in
 * the scene.
 *
 * Real scale is unusable: at Neptune's true distance the Earth is far below one
 * pixel. Instead orbital radii are log-compressed so the whole system reads on
 * one screen, while body radii keep their true ratios (Jupiter still dwarfs
 * Mercury) with a constant exaggeration so planets remain visible against their
 * orbits.
 */

/** Scene units per astronomical unit at 1 AU, before log compression. */
const ORBIT_BASE = 60;
/** Strength of the log compression. 0 = linear, 1 = fully logarithmic. */
const ORBIT_COMPRESSION = 0.62;
/** Scene units per kilometre of body radius. */
const RADIUS_UNIT = 1 / 6378.1;
/** Constant exaggeration applied to every body radius. */
const RADIUS_EXAGGERATION = 3;

/** Orbital distance in AU to a radial distance in scene units. */
export function auToScene(au: number): number {
  if (au <= 0) return 0;
  return ORBIT_BASE * Math.pow(au, 1 - ORBIT_COMPRESSION) * (1 + ORBIT_COMPRESSION * Math.log10(1 + au));
}

/** Inverse of {@link auToScene}, solved numerically. */
export function sceneToAu(units: number): number {
  if (units <= 0) return 0;
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (auToScene(mid) < units) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Body radius in kilometres to a radius in scene units. */
export function kmToSceneRadius(km: number): number {
  return km * RADIUS_UNIT * RADIUS_EXAGGERATION;
}

/** Inverse of {@link kmToSceneRadius}. */
export function sceneRadiusToKm(units: number): number {
  return units / (RADIUS_UNIT * RADIUS_EXAGGERATION);
}

/**
 * Moon orbital radius in kilometres to scene units. Moons are positioned
 * relative to their parent, not to the Sun, so they use their own compression:
 * true distances would bury Phobos inside Mars at the exaggerated body radii.
 */
export function moonOrbitToScene(km: number, parentSceneRadius: number): number {
  const raw = kmToSceneRadius(km) * 0.35;
  const minimum = parentSceneRadius * 1.8;
  return Math.max(raw, minimum);
}

/**
 * Position of a body in scene space. The heliocentric ecliptic vector keeps its
 * direction; only its magnitude is compressed, so alignments and conjunctions
 * stay geometrically truthful.
 */
export function heliocentricToScene(v: { x: number; y: number; z: number }): [number, number, number] {
  const distance = Math.hypot(v.x, v.y, v.z);
  if (distance === 0) return [0, 0, 0];
  const scaled = auToScene(distance) / distance;
  // Ecliptic z becomes scene y so the ecliptic plane lies flat in the viewport.
  return [v.x * scaled, v.z * scaled, -v.y * scaled];
}
