import * as THREE from 'three';
import { ALL_BODIES, getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { getHeliocentric, moonDirection } from '../lib/ephemeris/positions';
import { heliocentricToScene, kmToSceneRadius, moonOrbitToScene } from '../lib/scale';

/**
 * World-space position of every body for a single instant. Written once per
 * frame by the scene root and read by the camera rig, labels and info panel, so
 * nothing recomputes ephemeris independently.
 */
export type PositionRegistry = Map<BodyId, THREE.Vector3>;

export function createPositionRegistry(): PositionRegistry {
  return new Map(ALL_BODIES.map((b) => [b.id, new THREE.Vector3()]));
}

export function sceneRadiusOf(id: BodyId): number {
  return kmToSceneRadius(getBodyRecord(id).radiusKm);
}

/** Recomputes every body position in place. Allocates nothing per frame. */
export function updatePositions(registry: PositionRegistry, date: Date): void {
  for (const record of ALL_BODIES) {
    const target = registry.get(record.id)!;

    if (record.kind === 'moon') {
      const parent = registry.get(record.parent!)!;
      const parentRecord = getBodyRecord(record.parent!);
      const parentRadius = sceneRadiusOf(record.parent!);
      const distance = moonOrbitToScene(record.orbitRadiusKm!, parentRadius, parentRecord.radiusKm);

      // Where a real theory exists, place the moon on its true instantaneous
      // bearing and compress only the radius. The direction is an equatorial-of-
      // J2000 unit vector, mapped to scene axes the same way heliocentricToScene
      // maps a heliocentric one: equatorial z becomes scene y.
      const direction = moonDirection(record.id, date);
      if (direction) {
        target.set(
          parent.x + direction.x * distance,
          parent.y + direction.z * distance,
          parent.z - direction.y * distance
        );
        continue;
      }

      // No shipped theory: a mean circular orbit at the correct radius, period
      // and inclination. The absolute phase is not anchored to an epoch, so the
      // longitude is representative rather than observed.
      const angle = (date.getTime() / 86400000 / record.orbitDays!) * 2 * Math.PI;
      const inclination = (record.orbitInclinationDeg! * Math.PI) / 180;
      target.set(
        parent.x + distance * Math.cos(angle),
        parent.y + distance * Math.sin(angle) * Math.sin(inclination),
        parent.z + distance * Math.sin(angle) * Math.cos(inclination)
      );
      continue;
    }

    const [x, y, z] = heliocentricToScene(getHeliocentric(record.id, date));
    target.set(x, y, z);
  }
}
