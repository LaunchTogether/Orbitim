import * as THREE from 'three';
import { ALL_BODIES, getBodyRecord, type BodyId } from '../lib/ephemeris/bodies';
import { getHeliocentric } from '../lib/ephemeris/positions';
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
      const parentRadius = sceneRadiusOf(record.parent!);
      const distance = moonOrbitToScene(record.orbitRadiusKm!, parentRadius);
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
